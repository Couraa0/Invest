# -*- coding: utf-8 -*-
"""
InvestAI — Prediction Service
Diekstrak dari notebook InvestAI_Stock_Prediction.ipynb

Menyediakan:
  - fetch_stock_data()   → ambil data historis dari yfinance
  - add_features()       → feature engineering 30+ indikator teknikal
  - predict_stock()      → inferensi model RF multi-stock
  - get_chart_data()     → data historis untuk chart frontend
  - load_model()         → load bundle .pkl sekali saja (singleton)
"""

import os
import numpy as np
import pandas as pd
import warnings
import logging
from datetime import datetime, timedelta
from functools import lru_cache

import joblib
import yfinance as yf

# Technical indicators
import ta
from ta.trend import SMAIndicator, EMAIndicator, MACD
from ta.momentum import RSIIndicator, StochasticOscillator
from ta.volatility import BollingerBands, AverageTrueRange
from ta.volume import OnBalanceVolumeIndicator

from sklearn.impute import SimpleImputer

warnings.filterwarnings("ignore")
logger = logging.getLogger(__name__)

# ================================================================
# Konfigurasi Global
# ================================================================

# 6 saham yang sama dengan frontend
TICKERS = [
    "BBCA.JK",  # Bank Central Asia
    "ASII.JK",  # Astra International
    "TLKM.JK",  # Telkom Indonesia
    "BMRI.JK",  # Bank Mandiri
    "GOTO.JK",  # GoTo Gojek Tokopedia
    "UNVR.JK",  # Unilever Indonesia
]

TICKER_NAMES = {
    "BBCA.JK": "PT Bank Central Asia Tbk.",
    "ASII.JK": "Astra International Tbk.",
    "TLKM.JK": "Telkom Indonesia Tbk.",
    "BMRI.JK": "Bank Mandiri Tbk.",
    "GOTO.JK": "GoTo Gojek Tokopedia Tbk.",
    "UNVR.JK": "Unilever Indonesia Tbk.",
}

# Path ke model artifact (relative dari file ini)
_HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(_HERE, "..", "..", "model_artifacts", "model_saham_multi_rf.pkl")


# ================================================================
# Singleton: Load Model Sekali
# ================================================================

_model_bundle: dict | None = None


def load_model() -> dict:
    """
    Load model bundle dari .pkl.
    Dipanggil sekali saat startup FastAPI (singleton pattern).
    """
    global _model_bundle
    if _model_bundle is None:
        logger.info(f"📦 Loading model dari: {MODEL_PATH}")
        _model_bundle = joblib.load(MODEL_PATH)
        logger.info(
            f"✅ Model loaded — Fitur: {len(_model_bundle['feature_cols'])}, "
            f"Akurasi: {_model_bundle.get('accuracy', 'N/A')}"
        )
    return _model_bundle


# ================================================================
# Data Fetching
# ================================================================

def fetch_stock_data(ticker: str, start: str, end: str) -> pd.DataFrame:
    """
    Ambil data historis OHLCV dari Yahoo Finance.
    """
    df = yf.download(ticker, start=start, end=end, progress=False, auto_adjust=True)

    if df.empty:
        raise ValueError(f"Tidak ada data untuk ticker '{ticker}'")

    # Flatten MultiIndex jika ada
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    required = ["Open", "High", "Low", "Close", "Volume"]
    df = df[required].copy()
    df.dropna(inplace=True)
    return df


# ================================================================
# Feature Engineering (persis sama dengan notebook)
# ================================================================

def add_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Tambahkan 30+ indikator teknikal sebagai fitur ML.
    """
    df = df.copy()
    close = df["Close"]
    high  = df["High"]
    low   = df["Low"]
    vol   = df["Volume"]

    # Pastikan kolom numerik, bukan MultiIndex Series
    if isinstance(close, pd.DataFrame):
        close = close.iloc[:, 0]
    if isinstance(high, pd.DataFrame):
        high = high.iloc[:, 0]
    if isinstance(low, pd.DataFrame):
        low = low.iloc[:, 0]
    if isinstance(vol, pd.DataFrame):
        vol = vol.iloc[:, 0]

    # --- Moving Averages ---
    df["SMA_20"] = SMAIndicator(close=close, window=20).sma_indicator()
    df["SMA_50"] = SMAIndicator(close=close, window=50).sma_indicator()
    df["EMA_12"] = EMAIndicator(close=close, window=12).ema_indicator()
    df["EMA_26"] = EMAIndicator(close=close, window=26).ema_indicator()

    # --- RSI ---
    df["RSI"] = RSIIndicator(close=close, window=14).rsi()

    # --- MACD ---
    macd_obj = MACD(close=close, window_slow=26, window_fast=12, window_sign=9)
    df["MACD"]        = macd_obj.macd()
    df["MACD_Signal"] = macd_obj.macd_signal()
    df["MACD_Diff"]   = macd_obj.macd_diff()

    # --- Bollinger Bands ---
    bb = BollingerBands(close=close, window=20, window_dev=2)
    df["BB_Upper"] = bb.bollinger_hband()
    df["BB_Lower"] = bb.bollinger_lband()
    df["BB_Width"] = (df["BB_Upper"] - df["BB_Lower"]) / close

    # --- Daily Return ---
    df["Daily_Return"] = close.pct_change() * 100

    # --- Volatility ---
    df["Volatility_10"] = df["Daily_Return"].rolling(window=10).std()

    # --- Price vs MA Ratio ---
    df["Price_SMA20_Ratio"] = close / df["SMA_20"]
    df["Price_SMA50_Ratio"] = close / df["SMA_50"]

    # --- Volume Features ---
    df["Volume_Change"] = vol.pct_change() * 100
    df["Volume_MA5"]    = vol.rolling(window=5).mean()
    df["Volume_Ratio"]  = vol / df["Volume_MA5"]

    # --- High-Low Spread ---
    df["HL_Spread"] = (high - low) / close * 100

    # --- Lag Features ---
    for lag in [1, 2, 3]:
        df[f"Return_Lag{lag}"] = df["Daily_Return"].shift(lag)
        df[f"RSI_Lag{lag}"]    = df["RSI"].shift(lag)

    # --- ATR ---
    df["ATR"] = AverageTrueRange(high, low, close, window=14).average_true_range()

    # --- OBV ---
    df["OBV"] = OnBalanceVolumeIndicator(close=close, volume=vol).on_balance_volume()

    # --- Rolling Returns ---
    for w in [5, 10, 20]:
        df[f"Return_Roll{w}"] = close.pct_change(w) * 100

    # --- Stochastic Oscillator ---
    stoch = StochasticOscillator(high, low, close, window=14)
    df["Stoch_K"] = stoch.stoch()
    df["Stoch_D"] = stoch.stoch_signal()

    # --- Target Label (hanya untuk training, bukan inference) ---
    # Dibuat agar konsisten dengan notebook tapi tidak dipakai saat predict
    df["Future_Return"] = close.shift(-1) / close - 1
    THRESHOLD = 0.003
    df["Label"] = 0
    df.loc[df["Future_Return"] > THRESHOLD,  "Label"] = 1
    df.loc[df["Future_Return"] < -THRESHOLD, "Label"] = 0

    df.dropna(inplace=True)
    return df


# ================================================================
# Prediksi Satu Ticker
# ================================================================

def predict_stock(ticker: str) -> dict:
    """
    Prediksi real-time untuk satu ticker.
    Menggunakan model multi-stock Random Forest yang sudah di-load.

    Returns:
        dict dengan semua informasi prediksi untuk frontend
    """
    bundle    = load_model()
    model     = bundle["model"]
    scaler    = bundle["scaler"]
    feat_cols = bundle["feature_cols"]

    # Ambil 300 hari terakhir (butuh rolling 50 hari)
    end_dt   = datetime.today().strftime("%Y-%m-%d")
    start_dt = (datetime.today() - timedelta(days=400)).strftime("%Y-%m-%d")

    raw = fetch_stock_data(ticker, start_dt, end_dt)

    if len(raw) < 60:
        raise ValueError(f"Data tidak cukup untuk {ticker}: {len(raw)} baris.")

    # Feature engineering
    df_proc = add_features(raw)

    if df_proc.empty:
        raise ValueError(f"DataFrame kosong setelah feature engineering: {ticker}")

    # Cek apakah semua feature_cols tersedia
    missing = [c for c in feat_cols if c not in df_proc.columns]
    if missing:
        raise ValueError(f"Fitur yang hilang: {missing}")

    # Ambil baris terakhir
    latest   = df_proc.iloc[-1]
    X_latest = latest[feat_cols].values.reshape(1, -1)

    # Handle inf & nan
    X_latest = np.nan_to_num(X_latest, nan=np.nan, posinf=np.nan, neginf=np.nan)
    imputer  = SimpleImputer(strategy="mean")
    X_latest = imputer.fit_transform(X_latest)
    X_scaled = scaler.transform(X_latest)

    # Prediksi
    pred   = int(model.predict(X_scaled)[0])
    proba  = model.predict_proba(X_scaled)[0]  # [prob_turun, prob_naik]
    prob_naik  = float(proba[1]) * 100
    prob_turun = float(proba[0]) * 100
    confidence = max(prob_naik, prob_turun)

    # Harga & indikator
    current_price = float(latest["Close"])
    rsi_val       = float(latest["RSI"]) if not np.isnan(latest["RSI"]) else 50.0
    macd_diff_val = float(latest["MACD_Diff"]) if not np.isnan(latest["MACD_Diff"]) else 0.0
    change_pct    = float(latest["Daily_Return"]) if not np.isnan(latest["Daily_Return"]) else 0.0
    sma20         = float(latest["SMA_20"]) if not np.isnan(latest["SMA_20"]) else current_price
    ema12         = float(latest["EMA_12"]) if not np.isnan(latest["EMA_12"]) else current_price
    bb_upper      = float(latest["BB_Upper"]) if not np.isnan(latest["BB_Upper"]) else current_price * 1.02
    bb_lower      = float(latest["BB_Lower"]) if not np.isnan(latest["BB_Lower"]) else current_price * 0.98
    stoch_k       = float(latest["Stoch_K"]) if not np.isnan(latest["Stoch_K"]) else 50.0
    latest_date   = raw.index[-1].strftime("%Y-%m-%d")

    # Rekomendasi
    if pred == 1:
        direction   = "NAIK"
        signal      = "BULLISH"
        action      = "BUY"
        take_profit = round(current_price * 1.03, 0)
        stop_loss   = round(current_price * 0.98, 0)
    else:
        direction   = "TURUN"
        signal      = "BEARISH"
        action      = "SELL"
        take_profit = round(current_price * 0.97, 0)
        stop_loss   = round(current_price * 1.02, 0)

    # Kekuatan sinyal
    if confidence >= 70:
        strength = "KUAT"
    elif confidence >= 60:
        strength = "SEDANG"
    else:
        strength = "LEMAH"

    # Status RSI
    if rsi_val > 70:
        rsi_status = "Overbought"
    elif rsi_val < 30:
        rsi_status = "Oversold"
    else:
        rsi_status = "Normal"

    # MACD status
    macd_status = "Bullish" if macd_diff_val > 0 else "Bearish"

    # MA status
    ma_status = "Di Atas MA" if current_price > sma20 else "Di Bawah MA"

    return {
        "ticker":        ticker,
        "symbol":        ticker.replace(".JK", ""),
        "name":          TICKER_NAMES.get(ticker, ticker),
        "tanggal":       latest_date,
        "harga":         current_price,
        "change_pct":    round(change_pct, 2),
        "prediksi":      direction,
        "signal":        signal,
        "action":        action,
        "confidence":    round(confidence, 1),
        "prob_naik":     round(prob_naik, 1),
        "prob_turun":    round(prob_turun, 1),
        "take_profit":   take_profit,
        "stop_loss":     stop_loss,
        "strength":      strength,
        # Indikator teknikal
        "rsi":           round(rsi_val, 2),
        "rsi_status":    rsi_status,
        "macd_diff":     round(macd_diff_val, 4),
        "macd_status":   macd_status,
        "sma20":         round(sma20, 0),
        "ema12":         round(ema12, 0),
        "bb_upper":      round(bb_upper, 0),
        "bb_lower":      round(bb_lower, 0),
        "stoch_k":       round(stoch_k, 2),
        "ma_status":     ma_status,
    }


# ================================================================
# Data Chart Historis
# ================================================================

def get_chart_data(ticker: str, period: str = "1D") -> list[dict]:
    """
    Ambil data historis harga untuk ditampilkan di chart frontend.

    period: '1D', '1W', '1M', '1Y', '5Y'
    """
    period_map = {
        "1D": (2,   "2m"),    # 2 hari, interval 2 menit
        "1W": (7,   "1h"),    # 7 hari, interval 1 jam
        "1M": (35,  "1d"),    # 35 hari, interval harian
        "1Y": (370, "1d"),    # 1 tahun harian
        "5Y": (1830,"1wk"),   # 5 tahun mingguan
    }
    days, interval = period_map.get(period, (35, "1d"))

    end_dt   = datetime.today().strftime("%Y-%m-%d")
    start_dt = (datetime.today() - timedelta(days=days)).strftime("%Y-%m-%d")

    df = yf.download(ticker, start=start_dt, end=end_dt, interval=interval,
                     progress=False, auto_adjust=True)

    if df.empty:
        return []

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df[["Open", "High", "Low", "Close", "Volume"]].dropna()

    result = []
    for idx, row in df.iterrows():
        if isinstance(idx, pd.Timestamp):
            ts = idx.isoformat()
        else:
            ts = str(idx)
        result.append({
            "time":   ts,
            "open":   round(float(row["Open"]), 2),
            "high":   round(float(row["High"]), 2),
            "low":    round(float(row["Low"]), 2),
            "close":  round(float(row["Close"]), 2),
            "volume": int(row["Volume"]),
        })
    return result


# ================================================================
# Market Overview (IHSG proxy)
# ================================================================

def get_market_overview() -> dict:
    """
    Ambil data IHSG (^JKSE) sebagai market overview.
    """
    try:
        df = yf.download("^JKSE", period="5d", interval="1d",
                         progress=False, auto_adjust=True)
        if df.empty:
            raise ValueError("No IHSG data")

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        latest = df.iloc[-1]
        prev   = df.iloc[-2] if len(df) > 1 else df.iloc[-1]

        close_now  = float(latest["Close"])
        close_prev = float(prev["Close"])
        change_pct = ((close_now - close_prev) / close_prev) * 100

        # Mini chart data (5 hari terakhir)
        chart = []
        for idx, row in df.iterrows():
            chart.append({
                "name":  idx.strftime("%d/%m"),
                "value": round(float(row["Close"]), 2),
            })

        return {
            "ihsg":       round(close_now, 2),
            "change_pct": round(change_pct, 2),
            "volume":     int(latest["Volume"]),
            "status":     "Bullish" if change_pct > 0 else "Bearish",
            "chart":      chart,
        }
    except Exception as e:
        logger.warning(f"Gagal ambil data IHSG: {e}")
        return {
            "ihsg":       7164.50,
            "change_pct": 0.42,
            "volume":     0,
            "status":     "N/A",
            "chart":      [],
        }
