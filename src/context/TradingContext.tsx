import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { api } from '../lib/api';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Position {
  id: string;
  symbol: string;
  name: string;
  buyPrice: number;
  currentPrice: number;
  lots: number;
  shares: number;          // lots * 100
  totalCost: number;       // buyPrice * shares
  unrealizedPnL: number;   // (currentPrice - buyPrice) * shares
  unrealizedPct: number;   // unrealizedPnL / totalCost * 100
  boughtAt: string;        // ISO date string
}

export interface Transaction {
  id: string;
  symbol: string;
  name: string;
  type: 'BUY' | 'SELL';
  price: number;
  lots: number;
  shares: number;
  totalValue: number;
  pnl?: number;           // only for SELL
  pnlPct?: number;        // only for SELL
  createdAt: string;
}

interface TradingContextType {
  cash: number;
  totalPortfolioValue: number;
  totalCost: number;
  totalPnL: number;
  totalPnLPct: number;
  positions: Position[];
  transactions: Transaction[];
  equityHistory: { date: string; value: number }[];
  userId: string | null;
  setUserId: (id: string) => void;

  buyStock: (symbol: string, name: string, price: number, lots: number) => { success: boolean; message: string };
  sellStock: (symbol: string, lots: number, currentPrice: number) => { success: boolean; message: string };
  updatePrice: (symbol: string, newPrice: number) => void;
  resetPortfolio: () => void;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const INITIAL_CASH = 100_000_000; // Rp 100 juta
const STORAGE_KEY = 'paper_trading_state';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function now(): string {
  return new Date().toISOString();
}

function todayLabel(): string {
  return new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
}

// ─── Initial State ────────────────────────────────────────────────────────────

interface StoredState {
  cash: number;
  positions: Position[];
  transactions: Transaction[];
  equityHistory: { date: string; value: number }[];
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return {
    cash: INITIAL_CASH,
    positions: [],
    transactions: [],
    equityHistory: [{ date: todayLabel(), value: INITIAL_CASH }],
  };
}

function saveState(state: StoredState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ─── Context ──────────────────────────────────────────────────────────────────

const TradingContext = createContext<TradingContextType | undefined>(undefined);

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = loadState();
  const [cash, setCash] = useState(initial.cash);
  const [positions, setPositions] = useState<Position[]>(initial.positions);
  const [transactions, setTransactions] = useState<Transaction[]>(initial.transactions);
  const [equityHistory, setEquityHistory] = useState(initial.equityHistory);
  const [userId, setUserIdState] = useState<string | null>(
    () => localStorage.getItem('investai_user_id')
  );

  const setUserId = useCallback((id: string) => {
    setUserIdState(id);
    localStorage.setItem('investai_user_id', id);
  }, []);

  // Sync portfolio from Azure SQL when userId is set
  useEffect(() => {
    if (!userId) return;
    api.portfolio.get(userId).then(data => {
      setCash(data.cash_balance);
      // Rebuild positions from holdings (keep current prices if already loaded)
      setPositions(prev => data.holdings.map(h => {
        const existing = prev.find(p => p.symbol === h.stock_symbol);
        const shares = h.total_lots * 100;
        return existing
          ? { ...existing, lots: h.total_lots, shares, buyPrice: h.average_price, totalCost: h.average_price * shares }
          : {
              id: h.stock_symbol,
              symbol: h.stock_symbol,
              name: h.stock_symbol,
              buyPrice: h.average_price,
              currentPrice: h.average_price,
              lots: h.total_lots,
              shares,
              totalCost: h.average_price * shares,
              unrealizedPnL: 0,
              unrealizedPct: 0,
              boughtAt: new Date().toISOString(),
            };
      }));
    }).catch(() => { /* fallback to localStorage */ });
  }, [userId]);

  // ── Derived values ────────────────────────────────────────────────────────

  const totalPositionValue = positions.reduce((acc, p) => acc + p.currentPrice * p.shares, 0);
  const totalPortfolioValue = cash + totalPositionValue;
  const totalCost = positions.reduce((acc, p) => acc + p.totalCost, 0);
  const totalPnL = positions.reduce((acc, p) => acc + p.unrealizedPnL, 0);
  const totalPnLPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  // ── Persist helper ────────────────────────────────────────────────────────

  const persist = useCallback((newCash: number, newPositions: Position[], newTransactions: Transaction[], newHistory: { date: string; value: number }[]) => {
    saveState({ cash: newCash, positions: newPositions, transactions: newTransactions, equityHistory: newHistory });
  }, []);

  // ── Append equity snapshot ────────────────────────────────────────────────

  const appendEquity = useCallback((newCash: number, newPositions: Position[], currentHistory: { date: string; value: number }[]) => {
    const total = newCash + newPositions.reduce((a, p) => a + p.currentPrice * p.shares, 0);
    const label = todayLabel();
    const last = currentHistory[currentHistory.length - 1];
    if (last?.date === label) {
      const updated = [...currentHistory.slice(0, -1), { date: label, value: total }];
      return updated;
    }
    const updated = [...currentHistory, { date: label, value: total }].slice(-30);
    return updated;
  }, []);

  // ── Buy Stock ─────────────────────────────────────────────────────────────

  const buyStock = useCallback((symbol: string, name: string, price: number, lots: number): { success: boolean; message: string } => {
    const shares = lots * 100;
    const totalCostVal = price * shares;

    if (totalCostVal > cash) {
      return { success: false, message: `Saldo tidak cukup. Dibutuhkan Rp ${totalCostVal.toLocaleString('id-ID')}, tersedia Rp ${cash.toLocaleString('id-ID')}` };
    }
    if (lots < 1) return { success: false, message: 'Minimal pembelian 1 lot (100 lembar)' };

    const newCash = cash - totalCostVal;

    const newTx: Transaction = {
      id: generateId(),
      symbol,
      name,
      type: 'BUY',
      price,
      lots,
      shares,
      totalValue: totalCostVal,
      createdAt: now(),
    };

    let newPositions: Position[];
    const existing = positions.find(p => p.symbol === symbol);

    if (existing) {
      // Average down/up
      const newShares = existing.shares + shares;
      const newTotalCost = existing.totalCost + totalCostVal;
      const avgPrice = newTotalCost / newShares;
      const unrealizedPnL = (price - avgPrice) * newShares;
      const unrealizedPct = (unrealizedPnL / newTotalCost) * 100;

      newPositions = positions.map(p =>
        p.symbol === symbol
          ? {
              ...p,
              lots: p.lots + lots,
              shares: newShares,
              buyPrice: avgPrice,
              currentPrice: price,
              totalCost: newTotalCost,
              unrealizedPnL,
              unrealizedPct,
            }
          : p
      );
    } else {
      const newPos: Position = {
        id: generateId(),
        symbol,
        name,
        buyPrice: price,
        currentPrice: price,
        lots,
        shares,
        totalCost: totalCostVal,
        unrealizedPnL: 0,
        unrealizedPct: 0,
        boughtAt: now(),
      };
      newPositions = [...positions, newPos];
    }

    const newTxs = [newTx, ...transactions];
    const newHistory = appendEquity(newCash, newPositions, equityHistory);

    setCash(newCash);
    setPositions(newPositions);
    setTransactions(newTxs);
    setEquityHistory(newHistory);
    persist(newCash, newPositions, newTxs, newHistory);

    // Sync to Azure SQL (fire-and-forget)
    if (userId) {
      api.portfolio.buy(userId, { stock_symbol: symbol, lot_count: lots, price_per_share: price })
        .catch(err => console.warn('Portfolio sync (buy) failed:', err.message));
    }

    return { success: true, message: `Berhasil beli ${lots} lot ${symbol} @ Rp ${price.toLocaleString('id-ID')}` };
  }, [cash, positions, transactions, equityHistory, appendEquity, persist, userId]);

  // ── Sell Stock ────────────────────────────────────────────────────────────

  const sellStock = useCallback((symbol: string, lots: number, currentPrice: number): { success: boolean; message: string } => {
    const pos = positions.find(p => p.symbol === symbol);
    if (!pos) return { success: false, message: `Anda tidak memiliki saham ${symbol}` };
    if (lots > pos.lots) return { success: false, message: `Hanya memiliki ${pos.lots} lot ${symbol}` };
    if (lots < 1) return { success: false, message: 'Minimal penjualan 1 lot' };

    const shares = lots * 100;
    const proceeds = currentPrice * shares;
    const costBasis = pos.buyPrice * shares;
    const pnl = proceeds - costBasis;
    const pnlPct = (pnl / costBasis) * 100;

    const newCash = cash + proceeds;

    const newTx: Transaction = {
      id: generateId(),
      symbol,
      name: pos.name,
      type: 'SELL',
      price: currentPrice,
      lots,
      shares,
      totalValue: proceeds,
      pnl,
      pnlPct,
      createdAt: now(),
    };

    let newPositions: Position[];
    if (lots === pos.lots) {
      newPositions = positions.filter(p => p.symbol !== symbol);
    } else {
      const remainShares = pos.shares - shares;
      const remainCost = pos.buyPrice * remainShares;
      const unrealizedPnL = (currentPrice - pos.buyPrice) * remainShares;
      const unrealizedPct = (unrealizedPnL / remainCost) * 100;
      newPositions = positions.map(p =>
        p.symbol === symbol
          ? {
              ...p,
              lots: p.lots - lots,
              shares: remainShares,
              totalCost: remainCost,
              currentPrice,
              unrealizedPnL,
              unrealizedPct,
            }
          : p
      );
    }

    const newTxs = [newTx, ...transactions];
    const newHistory = appendEquity(newCash, newPositions, equityHistory);

    setCash(newCash);
    setPositions(newPositions);
    setTransactions(newTxs);
    setEquityHistory(newHistory);
    persist(newCash, newPositions, newTxs, newHistory);

    // Sync to Azure SQL (fire-and-forget)
    if (userId) {
      api.portfolio.sell(userId, { stock_symbol: symbol, lot_count: lots, price_per_share: currentPrice })
        .catch(err => console.warn('Portfolio sync (sell) failed:', err.message));
    }

    return {
      success: true,
      message: `Berhasil jual ${lots} lot ${symbol}. ${pnl >= 0 ? 'Profit' : 'Rugi'} Rp ${Math.abs(pnl).toLocaleString('id-ID')} (${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%)`,
    };
  }, [cash, positions, transactions, equityHistory, appendEquity, persist, userId]);

  // ── Update Price ──────────────────────────────────────────────────────────

  const updatePrice = useCallback((symbol: string, newPrice: number) => {
    setPositions(prev => {
      const updated = prev.map(p => {
        if (p.symbol !== symbol) return p;
        const unrealizedPnL = (newPrice - p.buyPrice) * p.shares;
        const unrealizedPct = (unrealizedPnL / p.totalCost) * 100;
        return { ...p, currentPrice: newPrice, unrealizedPnL, unrealizedPct };
      });
      return updated;
    });
  }, []);

  // ── Reset ─────────────────────────────────────────────────────────────────

  const resetPortfolio = useCallback(() => {
    const freshHistory = [{ date: todayLabel(), value: INITIAL_CASH }];
    setCash(INITIAL_CASH);
    setPositions([]);
    setTransactions([]);
    setEquityHistory(freshHistory);
    localStorage.removeItem(STORAGE_KEY);
    
    // Sync to Azure SQL (fire-and-forget)
    if (userId) {
      api.portfolio.reset(userId).catch(err => console.warn('Portfolio sync (reset) failed:', err.message));
    }
  }, [userId]);

  return (
    <TradingContext.Provider value={{
      cash,
      totalPortfolioValue,
      totalCost,
      totalPnL,
      totalPnLPct,
      positions,
      transactions,
      equityHistory,
      userId,
      setUserId,
      buyStock,
      sellStock,
      updatePrice,
      resetPortfolio,
    }}>
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const ctx = useContext(TradingContext);
  if (!ctx) throw new Error('useTrading must be inside TradingProvider');
  return ctx;
};
