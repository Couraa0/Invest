const { poolPromise, sql } = require('../config/db');

// GET /api/portfolio/:userId  — ambil portofolio + holdings sekaligus
const getPortfolio = async (req, res) => {
  try {
    const pool = await poolPromise;

    // Cari portfolio user
    let portfolioRes = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .query('SELECT * FROM Portfolios WHERE user_id = @userId');

    // Buat portfolio baru jika belum ada (auto-create)
    if (!portfolioRes.recordset.length) {
      portfolioRes = await pool.request()
        .input('userId', sql.UniqueIdentifier, req.params.userId)
        .query('INSERT INTO Portfolios (user_id) OUTPUT INSERTED.* VALUES (@userId)');
    }

    const portfolio = portfolioRes.recordset[0];

    // Ambil holdings
    const holdingsRes = await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
      .query('SELECT * FROM Holdings WHERE portfolio_id = @portfolioId ORDER BY updated_at DESC');

    res.json({ ...portfolio, holdings: holdingsRes.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/portfolio/:userId/buy
const buyStock = async (req, res) => {
  const { stock_symbol, lot_count, price_per_share } = req.body;
  if (!stock_symbol || !lot_count || !price_per_share)
    return res.status(400).json({ error: 'stock_symbol, lot_count, price_per_share wajib diisi' });

  const totalValue = lot_count * 100 * price_per_share;

  try {
    const pool = await poolPromise;

    // Cek / buat portfolio
    let pRes = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .query('SELECT * FROM Portfolios WHERE user_id = @userId');
    if (!pRes.recordset.length) {
      pRes = await pool.request()
        .input('userId', sql.UniqueIdentifier, req.params.userId)
        .query('INSERT INTO Portfolios (user_id) OUTPUT INSERTED.* VALUES (@userId)');
    }
    const portfolio = pRes.recordset[0];

    if (portfolio.cash_balance < totalValue)
      return res.status(400).json({ error: 'Saldo tidak mencukupi' });

    // Kurangi saldo
    await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
      .input('totalValue', sql.Decimal(18, 2), totalValue)
      .query('UPDATE Portfolios SET cash_balance = cash_balance - @totalValue, updated_at = CURRENT_TIMESTAMP WHERE id = @portfolioId');

    // Upsert holdings (average price)
    const holdRes = await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
      .input('symbol', sql.VarChar, stock_symbol)
      .query('SELECT * FROM Holdings WHERE portfolio_id = @portfolioId AND stock_symbol = @symbol');

    if (holdRes.recordset.length) {
      const existing = holdRes.recordset[0];
      const newLots = existing.total_lots + lot_count;
      const newAvg = ((existing.average_price * existing.total_lots * 100) + totalValue) / (newLots * 100);
      await pool.request()
        .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
        .input('symbol', sql.VarChar, stock_symbol)
        .input('newLots', sql.Int, newLots)
        .input('newAvg', sql.Decimal(18, 2), newAvg)
        .query('UPDATE Holdings SET total_lots = @newLots, average_price = @newAvg, updated_at = CURRENT_TIMESTAMP WHERE portfolio_id = @portfolioId AND stock_symbol = @symbol');
    } else {
      await pool.request()
        .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
        .input('symbol', sql.VarChar, stock_symbol)
        .input('lots', sql.Int, lot_count)
        .input('avgPrice', sql.Decimal(18, 2), price_per_share)
        .query('INSERT INTO Holdings (portfolio_id, stock_symbol, total_lots, average_price) VALUES (@portfolioId, @symbol, @lots, @avgPrice)');
    }

    // Catat transaksi
    await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
      .input('type', sql.VarChar, 'BUY')
      .input('symbol', sql.VarChar, stock_symbol)
      .input('lots', sql.Int, lot_count)
      .input('price', sql.Decimal(18, 2), price_per_share)
      .input('total', sql.Decimal(18, 2), totalValue)
      .query('INSERT INTO Transactions (portfolio_id, type, stock_symbol, lot_count, price_per_share, total_value) VALUES (@portfolioId, @type, @symbol, @lots, @price, @total)');

    res.json({ message: `Berhasil beli ${lot_count} lot ${stock_symbol}`, total_value: totalValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/portfolio/:userId/sell
const sellStock = async (req, res) => {
  const { stock_symbol, lot_count, price_per_share } = req.body;
  if (!stock_symbol || !lot_count || !price_per_share)
    return res.status(400).json({ error: 'stock_symbol, lot_count, price_per_share wajib diisi' });

  const totalValue = lot_count * 100 * price_per_share;

  try {
    const pool = await poolPromise;

    const pRes = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .query('SELECT * FROM Portfolios WHERE user_id = @userId');
    if (!pRes.recordset.length) return res.status(404).json({ error: 'Portfolio tidak ditemukan' });
    const portfolio = pRes.recordset[0];

    const holdRes = await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
      .input('symbol', sql.VarChar, stock_symbol)
      .query('SELECT * FROM Holdings WHERE portfolio_id = @portfolioId AND stock_symbol = @symbol');

    if (!holdRes.recordset.length || holdRes.recordset[0].total_lots < lot_count)
      return res.status(400).json({ error: 'Kepemilikan saham tidak mencukupi' });

    const existing = holdRes.recordset[0];
    const newLots = existing.total_lots - lot_count;

    if (newLots === 0) {
      await pool.request()
        .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
        .input('symbol', sql.VarChar, stock_symbol)
        .query('DELETE FROM Holdings WHERE portfolio_id = @portfolioId AND stock_symbol = @symbol');
    } else {
      await pool.request()
        .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
        .input('symbol', sql.VarChar, stock_symbol)
        .input('newLots', sql.Int, newLots)
        .query('UPDATE Holdings SET total_lots = @newLots, updated_at = CURRENT_TIMESTAMP WHERE portfolio_id = @portfolioId AND stock_symbol = @symbol');
    }

    // Tambah saldo
    await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
      .input('totalValue', sql.Decimal(18, 2), totalValue)
      .query('UPDATE Portfolios SET cash_balance = cash_balance + @totalValue, updated_at = CURRENT_TIMESTAMP WHERE id = @portfolioId');

    // Catat transaksi
    await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, portfolio.id)
      .input('symbol', sql.VarChar, stock_symbol)
      .input('lots', sql.Int, lot_count)
      .input('price', sql.Decimal(18, 2), price_per_share)
      .input('total', sql.Decimal(18, 2), totalValue)
      .query('INSERT INTO Transactions (portfolio_id, type, stock_symbol, lot_count, price_per_share, total_value) VALUES (@portfolioId, \'SELL\', @symbol, @lots, @price, @total)');

    res.json({ message: `Berhasil jual ${lot_count} lot ${stock_symbol}`, total_value: totalValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/portfolio/:userId/transactions
const getTransactions = async (req, res) => {
  try {
    const pool = await poolPromise;
    const pRes = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .query('SELECT id FROM Portfolios WHERE user_id = @userId');
    if (!pRes.recordset.length) return res.json([]);

    const result = await pool.request()
      .input('portfolioId', sql.UniqueIdentifier, pRes.recordset[0].id)
      .query('SELECT * FROM Transactions WHERE portfolio_id = @portfolioId ORDER BY transaction_date DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPortfolio, buyStock, sellStock, getTransactions };
