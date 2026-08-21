const { supabase } = require('../config/db');

// GET /api/portfolio/:userId  — ambil portofolio + holdings sekaligus
const getPortfolio = async (req, res) => {
  try {
    // Cari portfolio user
    let { data: portfolio, error: pError } = await supabase
      .from('Portfolios')
      .select('*')
      .eq('user_id', req.params.userId)
      .maybeSingle();

    if (pError) throw pError;

    // Buat portfolio baru jika belum ada (auto-create)
    if (!portfolio) {
      const { data: newPortfolio, error: insError } = await supabase
        .from('Portfolios')
        .insert([{ user_id: req.params.userId }])
        .select()
        .single();

      if (insError) throw insError;
      portfolio = newPortfolio;
    }

    // Ambil holdings
    const { data: holdings, error: hError } = await supabase
      .from('Holdings')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .order('updated_at', { ascending: false });

    if (hError) throw hError;

    res.json({ ...portfolio, holdings });
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
    // Cek / buat portfolio
    let { data: portfolio, error: pError } = await supabase
      .from('Portfolios')
      .select('*')
      .eq('user_id', req.params.userId)
      .maybeSingle();

    if (pError) throw pError;

    if (!portfolio) {
      const { data: newPortfolio, error: insError } = await supabase
        .from('Portfolios')
        .insert([{ user_id: req.params.userId }])
        .select()
        .single();

      if (insError) throw insError;
      portfolio = newPortfolio;
    }

    if (portfolio.cash_balance < totalValue)
      return res.status(400).json({ error: 'Saldo tidak mencukupi' });

    // Kurangi saldo
    const { error: updPortError } = await supabase
      .from('Portfolios')
      .update({
        cash_balance: portfolio.cash_balance - totalValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolio.id);

    if (updPortError) throw updPortError;

    // Upsert holdings (average price)
    const { data: holding, error: holdError } = await supabase
      .from('Holdings')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .eq('stock_symbol', stock_symbol)
      .maybeSingle();

    if (holdError) throw holdError;

    if (holding) {
      const newLots = holding.total_lots + lot_count;
      const newAvg = ((holding.average_price * holding.total_lots * 100) + totalValue) / (newLots * 100);

      const { error: updHoldError } = await supabase
        .from('Holdings')
        .update({
          total_lots: newLots,
          average_price: newAvg,
          updated_at: new Date().toISOString()
        })
        .eq('portfolio_id', portfolio.id)
        .eq('stock_symbol', stock_symbol);

      if (updHoldError) throw updHoldError;
    } else {
      const { error: insHoldError } = await supabase
        .from('Holdings')
        .insert([{
          portfolio_id: portfolio.id,
          stock_symbol,
          total_lots: lot_count,
          average_price: price_per_share
        }]);

      if (insHoldError) throw insHoldError;
    }

    // Catat transaksi
    const { error: txError } = await supabase
      .from('Transactions')
      .insert([{
        portfolio_id: portfolio.id,
        type: 'BUY',
        stock_symbol,
        lot_count,
        price_per_share,
        total_value: totalValue
      }]);

    if (txError) throw txError;

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
    const { data: portfolio, error: pError } = await supabase
      .from('Portfolios')
      .select('*')
      .eq('user_id', req.params.userId)
      .maybeSingle();

    if (pError) throw pError;
    if (!portfolio) return res.status(404).json({ error: 'Portfolio tidak ditemukan' });

    const { data: holding, error: holdError } = await supabase
      .from('Holdings')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .eq('stock_symbol', stock_symbol)
      .maybeSingle();

    if (holdError) throw holdError;
    if (!holding || holding.total_lots < lot_count)
      return res.status(400).json({ error: 'Kepemilikan saham tidak mencukupi' });

    const newLots = holding.total_lots - lot_count;

    if (newLots === 0) {
      const { error: delHoldError } = await supabase
        .from('Holdings')
        .delete()
        .eq('portfolio_id', portfolio.id)
        .eq('stock_symbol', stock_symbol);

      if (delHoldError) throw delHoldError;
    } else {
      const { error: updHoldError } = await supabase
        .from('Holdings')
        .update({
          total_lots: newLots,
          updated_at: new Date().toISOString()
        })
        .eq('portfolio_id', portfolio.id)
        .eq('stock_symbol', stock_symbol);

      if (updHoldError) throw updHoldError;
    }

    // Tambah saldo
    const { error: updPortError } = await supabase
      .from('Portfolios')
      .update({
        cash_balance: portfolio.cash_balance + totalValue,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolio.id);

    if (updPortError) throw updPortError;

    // Catat transaksi
    const { error: txError } = await supabase
      .from('Transactions')
      .insert([{
        portfolio_id: portfolio.id,
        type: 'SELL',
        stock_symbol,
        lot_count,
        price_per_share,
        total_value: totalValue
      }]);

    if (txError) throw txError;

    res.json({ message: `Berhasil jual ${lot_count} lot ${stock_symbol}`, total_value: totalValue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/portfolio/:userId/transactions
const getTransactions = async (req, res) => {
  try {
    const { data: portfolio, error: pError } = await supabase
      .from('Portfolios')
      .select('id')
      .eq('user_id', req.params.userId)
      .maybeSingle();

    if (pError) throw pError;
    if (!portfolio) return res.json([]);

    const { data: transactions, error: txError } = await supabase
      .from('Transactions')
      .select('*')
      .eq('portfolio_id', portfolio.id)
      .order('transaction_date', { ascending: false });

    if (txError) throw txError;

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/portfolio/:userId/reset
const resetPortfolio = async (req, res) => {
  try {
    const { data: portfolio, error: pError } = await supabase
      .from('Portfolios')
      .select('id')
      .eq('user_id', req.params.userId)
      .maybeSingle();

    if (pError) throw pError;
    if (!portfolio) return res.status(404).json({ error: 'Portfolio tidak ditemukan' });
    
    const portfolioId = portfolio.id;

    // Reset saldo ke 100M
    const { error: portUpdError } = await supabase
      .from('Portfolios')
      .update({
        cash_balance: 100000000.00,
        updated_at: new Date().toISOString()
      })
      .eq('id', portfolioId);

    if (portUpdError) throw portUpdError;
      
    // Hapus semua Holdings
    const { error: delHoldError } = await supabase
      .from('Holdings')
      .delete()
      .eq('portfolio_id', portfolioId);

    if (delHoldError) throw delHoldError;

    // Hapus semua Transactions
    const { error: delTxError } = await supabase
      .from('Transactions')
      .delete()
      .eq('portfolio_id', portfolioId);

    if (delTxError) throw delTxError;

    res.json({ message: 'Portfolio berhasil direset' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getPortfolio, buyStock, sellStock, getTransactions, resetPortfolio };
