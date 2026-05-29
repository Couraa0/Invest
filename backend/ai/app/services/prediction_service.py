# -*- coding: utf-8 -*-
"""
InvestAI — Prediction Service (v2 — XGBoost Engine)
Dibangun dari Investfinal.py — model XGBoost multi-saham 90+ ticker IDX.

Menyediakan:
  - fetch_stock_data()      → ambil data historis dari yfinance
  - engineer_features()     → feature engineering 35 indikator teknikal
  - predict_stock()         → inferensi model XGBoost
  - get_chart_data()        → data historis untuk chart frontend
  - get_market_overview()   → data IHSG
  - load_model()            → load bundle .pkl sekali saja (singleton)
"""

import os
import numpy as np
import pandas as pd
import warnings
import logging
from datetime import datetime, timedelta

import joblib
import yfinance as yf
from sklearn.impute import SimpleImputer

warnings.filterwarnings("ignore")
logger = logging.getLogger(__name__)

# ================================================================
# Konfigurasi Global — 90+ Saham IDX
# ================================================================

# Kategori sektor
TICKER_CATEGORIES: dict[str, list[str]] = {
    "Perbankan & Keuangan": [
        "BBCA.JK", "BMRI.JK", "BBNI.JK", "BBRI.JK", "BRIS.JK", "BTPS.JK",
        "ARTO.JK", "BNGA.JK", "NISP.JK", "BDMN.JK", "MEGA.JK", "BJBR.JK",
    ],
    "Energi & Pertambangan": [
        "ADRO.JK", "PTBA.JK", "ITMG.JK", "HRUM.JK", "BUMI.JK", "INDY.JK",
        "MDKA.JK", "ANTM.JK", "INCO.JK", "MEDC.JK", "ELSA.JK", "PGAS.JK",
        "ESSA.JK", "ADMR.JK",
    ],
    "Consumer Goods & Retail": [
        "UNVR.JK", "INDF.JK", "ICBP.JK", "KLBF.JK", "CPIN.JK", "JPFA.JK",
        "MYOR.JK", "SIDO.JK", "GOOD.JK", "ACES.JK", "MAPI.JK", "MAPA.JK", "ERAA.JK",
    ],
    "Telekomunikasi & Teknologi": [
        "TLKM.JK", "EXCL.JK", "ISAT.JK", "TOWR.JK", "TBIG.JK",
        "DCII.JK", "BUKA.JK", "GOTO.JK", "EMTK.JK", "SCMA.JK",
    ],
    "Industri & Manufaktur": [
        "ASII.JK", "UNTR.JK", "SRIL.JK", "AKRA.JK", "SMGR.JK", "INTP.JK",
        "AMFG.JK", "CTRA.JK", "BJTM.JK",
    ],
    "Properti & Konstruksi": [
        "LPKR.JK", "WIKA.JK", "WSKT.JK", "PPRE.JK", "PTPP.JK", "BSDE.JK",
        "SMRA.JK", "PWON.JK",
    ],
    "Healthcare & Farmasi": [
        "KAEF.JK", "PYFA.JK", "MIKA.JK", "HEAL.JK", "TSPC.JK",
    ],
    "Infrastruktur & Utilitas": [
        "JSMR.JK", "WEGE.JK", "META.JK", "BIRD.JK", "NELY.JK",
    ],
    "Agribisnis": [
        "AALI.JK", "SIMP.JK", "LSIP.JK", "TBLA.JK",
    ],
    "Media & Hiburan": [
        "MNCN.JK", "VIVA.JK", "LINK.JK",
    ],
    "Logistik & Pergudangan": [
        "HRTA.JK", "INTD.JK",
    ],
}

# Flat list (semua ticker)
TICKERS: list[str] = []
for _tickers in TICKER_CATEGORIES.values():
    TICKERS.extend(_tickers)

# Reverse lookup: ticker → kategori
TICKER_CATEGORY_MAP: dict[str, str] = {}
for _cat, _tickers in TICKER_CATEGORIES.items():
    for _t in _tickers:
        TICKER_CATEGORY_MAP[_t] = _cat

# Nama perusahaan lengkap
TICKER_NAMES: dict[str, str] = {
    # Perbankan & Keuangan
    "BBCA.JK": "Bank Central Asia Tbk.",
    "BMRI.JK": "Bank Mandiri Tbk.",
    "BBNI.JK": "Bank Negara Indonesia Tbk.",
    "BBRI.JK": "Bank Rakyat Indonesia Tbk.",
    "BRIS.JK": "Bank BRI Syariah Tbk.",
    "BTPS.JK": "Bank BTPN Syariah Tbk.",
    "ARTO.JK": "Bank Jago Tbk.",
    "BNGA.JK": "Bank CIMB Niaga Tbk.",
    "NISP.JK": "Bank OCBC NISP Tbk.",
    "BDMN.JK": "Bank Danamon Indonesia Tbk.",
    "MEGA.JK": "Bank Mega Tbk.",
    "BJBR.JK": "Bank Pembangunan Daerah Jabar Banten Tbk.",
    # Energi & Pertambangan
    "ADRO.JK": "Adaro Energy Indonesia Tbk.",
    "PTBA.JK": "Bukit Asam Tbk.",
    "ITMG.JK": "Indo Tambangraya Megah Tbk.",
    "HRUM.JK": "Harum Energy Tbk.",
    "BUMI.JK": "Bumi Resources Tbk.",
    "INDY.JK": "Indika Energy Tbk.",
    "MDKA.JK": "Merdeka Copper Gold Tbk.",
    "ANTM.JK": "Aneka Tambang Tbk.",
    "INCO.JK": "Vale Indonesia Tbk.",
    "MEDC.JK": "Medco Energi Internasional Tbk.",
    "ELSA.JK": "Elnusa Tbk.",
    "PGAS.JK": "Perusahaan Gas Negara Tbk.",
    "ESSA.JK": "Essa Industries Indonesia Tbk.",
    "ADMR.JK": "Adaro Minerals Indonesia Tbk.",
    # Consumer Goods & Retail
    "UNVR.JK": "Unilever Indonesia Tbk.",
    "INDF.JK": "Indofood Sukses Makmur Tbk.",
    "ICBP.JK": "Indofood CBP Sukses Makmur Tbk.",
    "KLBF.JK": "Kalbe Farma Tbk.",
    "CPIN.JK": "Charoen Pokphand Indonesia Tbk.",
    "JPFA.JK": "Japfa Comfeed Indonesia Tbk.",
    "MYOR.JK": "Mayora Indah Tbk.",
    "SIDO.JK": "Industri Jamu & Farmasi Sido Muncul Tbk.",
    "GOOD.JK": "Garudafood Putra Putri Jaya Tbk.",
    "ACES.JK": "Ace Hardware Indonesia Tbk.",
    "MAPI.JK": "Mitra Adiperkasa Tbk.",
    "MAPA.JK": "MAP Aktif Adiperkasa Tbk.",
    "ERAA.JK": "Erajaya Swasembada Tbk.",
    # Telekomunikasi & Teknologi
    "TLKM.JK": "Telkom Indonesia Tbk.",
    "EXCL.JK": "XL Axiata Tbk.",
    "ISAT.JK": "Indosat Ooredoo Hutchison Tbk.",
    "TOWR.JK": "Sarana Menara Nusantara Tbk.",
    "TBIG.JK": "Tower Bersama Infrastructure Tbk.",
    "DCII.JK": "DCI Indonesia Tbk.",
    "BUKA.JK": "Bukalapak.com Tbk.",
    "GOTO.JK": "GoTo Gojek Tokopedia Tbk.",
    "EMTK.JK": "Elang Mahkota Teknologi Tbk.",
    "SCMA.JK": "Surya Citra Media Tbk.",
    # Industri & Manufaktur
    "ASII.JK": "Astra International Tbk.",
    "UNTR.JK": "United Tractors Tbk.",
    "SRIL.JK": "Sri Rejeki Isman Tbk.",
    "AKRA.JK": "AKR Corporindo Tbk.",
    "SMGR.JK": "Semen Indonesia Tbk.",
    "INTP.JK": "Indocement Tunggal Prakarsa Tbk.",
    "AMFG.JK": "Asahimas Flat Glass Tbk.",
    "CTRA.JK": "Ciputra Development Tbk.",
    "BJTM.JK": "Bank Pembangunan Daerah Jawa Timur Tbk.",
    # Properti & Konstruksi
    "LPKR.JK": "Lippo Karawaci Tbk.",
    "WIKA.JK": "Wijaya Karya Tbk.",
    "WSKT.JK": "Waskita Karya Tbk.",
    "PPRE.JK": "PP Presisi Tbk.",
    "PTPP.JK": "PP Persero Tbk.",
    "BSDE.JK": "Bumi Serpong Damai Tbk.",
    "SMRA.JK": "Summarecon Agung Tbk.",
    "PWON.JK": "Pakuwon Jati Tbk.",
    # Healthcare & Farmasi
    "KAEF.JK": "Kimia Farma Tbk.",
    "PYFA.JK": "Pyridam Farma Tbk.",
    "MIKA.JK": "Mitra Keluarga Karyasehat Tbk.",
    "HEAL.JK": "Medikaloka Hermina Tbk.",
    "TSPC.JK": "Tempo Scan Pacific Tbk.",
    # Infrastruktur & Utilitas
    "JSMR.JK": "Jasa Marga Tbk.",
    "WEGE.JK": "Wijaya Karya Bangunan Gedung Tbk.",
    "META.JK": "Nusantara Infrastructure Tbk.",
    "BIRD.JK": "Blue Bird Tbk.",
    "NELY.JK": "Pelayaran Nelly Dwi Putri Tbk.",
    # Agribisnis
    "AALI.JK": "Astra Agro Lestari Tbk.",
    "SIMP.JK": "Salim Ivomas Pratama Tbk.",
    "LSIP.JK": "PP London Sumatra Indonesia Tbk.",
    "TBLA.JK": "Tunas Baru Lampung Tbk.",
    # Media & Hiburan
    "MNCN.JK": "Media Nusantara Citra Tbk.",
    "VIVA.JK": "Visi Media Asia Tbk.",
    "LINK.JK": "Link Net Tbk.",
    # Logistik & Pergudangan
    "HRTA.JK": "Hartadinata Abadi Tbk.",
    "INTD.JK": "Inter Delta Tbk.",
}

# Path ke model artifact
_HERE = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(
    _HERE, "..", "..", "model_artifacts", "xgb_model.pkl"
)


# ================================================================
# Singleton: Load Model Sekali
# ================================================================

_model_bundle: dict | None = None


def load_model() -> dict:
    """
    Load model bundle XGBoost dari .pkl.
    Dipanggil sekali saat startup FastAPI (singleton pattern).
    """
    global _model_bundle
    if _model_bundle is None:
        logger.info(f"📦 Loading XGBoost model dari: {MODEL_PATH}")
        _model_bundle = joblib.load(MODEL_PATH)
        logger.info(
            f"✅ XGBoost model loaded — "
            f"Fitur: {len(_model_bundle['feature_cols'])}, "
            f"Ticker: {_model_bundle.get('ticker', 'multi')}, "
            f"Akurasi: {_model_bundle.get('accuracy_val', _model_bundle.get('accuracy', 'N/A'))}"
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
    
    # Filter out rows with zero volume (holidays / non-trading days / weekends)
    if "Volume" in df.columns:
        df = df[df["Volume"] > 0]

    df.dropna(inplace=True)
    return df


# ================================================================
# Feature Engineering — identik dengan Investfinal.py
# ================================================================

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Buat 35 fitur teknikal multi-dimensi dari OHLCV.
    Identik dengan engineer_features() di Investfinal.py agar
    feature names cocok dengan model XGBoost yang sudah dilatih.
    """
    d = df.copy()

    # Pastikan kolom 1D (bukan MultiIndex Series)
    def _to_series(col):
        s = d[col]
        return s.iloc[:, 0] if isinstance(s, pd.DataFrame) else s

    c = _to_series("Close")
    v = _to_series("Volume")
    h = _to_series("High")
    l = _to_series("Low")
    o = _to_series("Open")

    # --- Momentum multi-timeframe ---
    for n in [3, 5, 10, 20]:
        d[f"mom_{n}d"] = c.pct_change(n)
        d[f"return_{n}d"] = c / c.shift(n) - 1

    # Lag returns
    for lag in [1, 2, 3, 5]:
        d[f"lag_ret_{lag}"] = c.pct_change(1).shift(lag)

    # --- RSI (14 dan 7 hari) ---
    def calc_rsi(series, period=14):
        delta = series.diff()
        gain = delta.clip(lower=0).rolling(period).mean()
        loss = (-delta.clip(upper=0)).rolling(period).mean()
        rs = gain / (loss + 1e-9)
        return 100 - (100 / (1 + rs))

    d["rsi_14"] = calc_rsi(c, 14)
    d["rsi_7"] = calc_rsi(c, 7)
    d["rsi_div"] = d["rsi_14"] - d["rsi_7"]
    d["rsi_slope"] = d["rsi_14"].diff(3)

    # --- MACD + histogram slope ---
    ema12 = c.ewm(span=12, adjust=False).mean()
    ema26 = c.ewm(span=26, adjust=False).mean()
    d["macd"] = ema12 - ema26
    d["macd_sig"] = d["macd"].ewm(span=9, adjust=False).mean()
    d["macd_hist"] = d["macd"] - d["macd_sig"]
    d["macd_slope"] = d["macd_hist"].diff(3)

    # --- Bollinger Bands ---
    bb_mid = c.rolling(20).mean()
    bb_std = c.rolling(20).std()
    d["bb_pct"] = (c - (bb_mid - 2 * bb_std)) / (4 * bb_std + 1e-9)
    d["bb_width"] = (4 * bb_std) / (bb_mid + 1e-9)

    # --- ATR + volatility regime ---
    tr = pd.concat(
        [h - l, (h - c.shift()).abs(), (l - c.shift()).abs()], axis=1
    ).max(axis=1)
    d["atr_14"] = tr.rolling(14).mean()
    d["atr_pct"] = d["atr_14"] / c
    d["vol_regime"] = (
        d["atr_pct"] > d["atr_pct"].rolling(60).median()
    ).astype(int)

    # --- Volume signals ---
    vol_ma20 = v.rolling(20).mean()
    vol_std20 = v.rolling(20).std()
    d["vol_zscore"] = (v - vol_ma20) / (vol_std20 + 1e-9)
    d["vol_ratio"] = v / (vol_ma20 + 1e-9)

    # OBV
    obv = (np.sign(c.diff()) * v).fillna(0).cumsum()
    d["obv_trend"] = obv.diff(5).apply(np.sign)

    # Volume-price divergence
    d["vp_div"] = c.pct_change(3) * d["vol_zscore"].shift(1)

    # --- Mean reversion signals ---
    for ma in [10, 20, 50]:
        d[f"dist_ma{ma}"] = (c / c.rolling(ma).mean()) - 1

    # Z-score
    d["zscore_20"] = (c - c.rolling(20).mean()) / (c.rolling(20).std() + 1e-9)

    # Distance dari 52-week high/low
    d["dist_52h"] = (c / h.rolling(252).max()) - 1
    d["dist_52l"] = (c / l.rolling(252).min()) - 1

    # --- Candlestick body ratio ---
    d["body_ratio"] = (c - o).abs() / (tr + 1e-9)
    d["upper_wick"] = (h - pd.concat([c, o], axis=1).max(axis=1)) / (tr + 1e-9)
    d["lower_wick"] = (pd.concat([c, o], axis=1).min(axis=1) - l) / (tr + 1e-9)

    return d


# ================================================================
# Prediksi Satu Ticker
# ================================================================

def predict_stock(ticker: str) -> dict:
    """
    Prediksi real-time untuk satu ticker menggunakan XGBoost.

    Returns:
        dict dengan semua informasi prediksi untuk frontend
    """
    bundle = load_model()
    model = bundle["model"]
    scaler = bundle["scaler"]
    feat_cols = bundle["feature_cols"]

    # Ambil 400 hari terakhir (butuh rolling 252 hari untuk dist_52h/l)
    end_dt = datetime.today().strftime("%Y-%m-%d")
    start_dt = (datetime.today() - timedelta(days=500)).strftime("%Y-%m-%d")

    raw = fetch_stock_data(ticker, start_dt, end_dt)

    if len(raw) < 60:
        raise ValueError(f"Data tidak cukup untuk {ticker}: {len(raw)} baris.")

    # Feature engineering
    df_proc = engineer_features(raw)
    df_proc.dropna(inplace=True)

    if df_proc.empty:
        raise ValueError(f"DataFrame kosong setelah feature engineering: {ticker}")

    # Cek feature columns
    missing = [c for c in feat_cols if c not in df_proc.columns]
    if missing:
        raise ValueError(f"Fitur hilang untuk {ticker}: {missing}")

    # Ambil baris terakhir
    latest = df_proc.iloc[-1]
    X_latest = latest[feat_cols].values.reshape(1, -1)

    # Handle inf & nan secara defensif
    X_latest = np.nan_to_num(X_latest, nan=np.nan, posinf=np.nan, neginf=np.nan)
    imputer = SimpleImputer(strategy="mean")
    X_latest = imputer.fit_transform(X_latest)
    X_scaled = scaler.transform(X_latest)

    # Prediksi
    pred = int(model.predict(X_scaled)[0])
    proba = model.predict_proba(X_scaled)[0]  # [prob_turun, prob_naik]
    prob_naik = float(proba[1]) * 100
    prob_turun = float(proba[0]) * 100
    confidence = max(prob_naik, prob_turun)

    # Harga & indikator utama
    def safe_float(val, fallback=0.0):
        try:
            v = float(val)
            return fallback if np.isnan(v) or np.isinf(v) else v
        except Exception:
            return fallback

    current_price = safe_float(latest["Close"])
    latest_date = raw.index[-1].strftime("%Y-%m-%d")

    # RSI dari rsi_14
    rsi_val = safe_float(latest.get("rsi_14", 50.0), 50.0)

    # MACD diff (histogram)
    macd_diff_val = safe_float(latest.get("macd_hist", 0.0), 0.0)
    macd_val = safe_float(latest.get("macd", 0.0), 0.0)

    # Daily return: hitung langsung dari raw data (close hari ini vs close kemarin)
    if len(raw) >= 2:
        prev_close = safe_float(raw["Close"].iloc[-2])
        change_pct = ((current_price - prev_close) / prev_close * 100) if prev_close != 0 else 0.0
    else:
        change_pct = 0.0

    # SMA 20 dari dist_ma20 (reconstruct: sma20 = close / (1 + dist_ma20))
    dist_ma20 = safe_float(latest.get("dist_ma20", 0.0), 0.0)
    sma20 = current_price / (1 + dist_ma20) if (1 + dist_ma20) != 0 else current_price

    # EMA 12 (reconstruct từ macd = ema12 - ema26, approximate ema12)
    # Use raw rolling approximation from last close
    ema12 = safe_float(current_price)  # approximate; ema12 not directly stored

    # Bollinger Bands dari bb_pct dan bb_width
    bb_pct = safe_float(latest.get("bb_pct", 0.5), 0.5)
    bb_width = safe_float(latest.get("bb_width", 0.04), 0.04)
    bb_mid_val = sma20
    bb_half = (bb_width * bb_mid_val) / 2
    bb_upper = bb_mid_val + bb_half * 2
    bb_lower = bb_mid_val - bb_half * 2

    # Stochastic tidak ada dalam engineer_features — use RSI as proxy
    stoch_k = rsi_val  # sama-sama oscillator range 0-100

    # Rekomendasi
    if pred == 1:
        direction = "NAIK"
        signal = "BULLISH"
        action = "BUY"
        take_profit = round(current_price * 1.03, 0)
        stop_loss = round(current_price * 0.98, 0)
    else:
        direction = "TURUN"
        signal = "BEARISH"
        action = "SELL"
        take_profit = round(current_price * 0.97, 0)
        stop_loss = round(current_price * 1.02, 0)

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
    ma_status = "Di Atas MA" if dist_ma20 > 0 else "Di Bawah MA"

    return {
        "ticker": ticker,
        "symbol": ticker.replace(".JK", ""),
        "name": TICKER_NAMES.get(ticker, ticker),
        "category": TICKER_CATEGORY_MAP.get(ticker, "Lainnya"),
        "tanggal": latest_date,
        "harga": current_price,
        "change_pct": round(change_pct, 2),
        "prediksi": direction,
        "signal": signal,
        "action": action,
        "confidence": round(confidence, 1),
        "prob_naik": round(prob_naik, 1),
        "prob_turun": round(prob_turun, 1),
        "take_profit": take_profit,
        "stop_loss": stop_loss,
        "strength": strength,
        # Indikator teknikal
        "rsi": round(rsi_val, 2),
        "rsi_status": rsi_status,
        "macd_diff": round(macd_diff_val, 6),
        "macd_status": macd_status,
        "sma20": round(sma20, 0),
        "ema12": round(ema12, 0),
        "bb_upper": round(bb_upper, 0),
        "bb_lower": round(bb_lower, 0),
        "stoch_k": round(stoch_k, 2),
        "ma_status": ma_status,
    }


# ================================================================
# Data Chart Historis
# ================================================================

def get_chart_data(ticker: str, period: str = "1M") -> list[dict]:
    """
    Ambil data historis harga untuk ditampilkan di chart frontend.
    period: '1D', '1W', '1M', '1Y', '5Y'
    """
    period_map = {
        "1D": (2, "2m"),
        "1W": (7, "1h"),
        "1M": (35, "1d"),
        "1Y": (370, "1d"),
        "5Y": (1830, "1wk"),
    }
    days, interval = period_map.get(period, (35, "1d"))

    end_dt = datetime.today().strftime("%Y-%m-%d")
    start_dt = (datetime.today() - timedelta(days=days)).strftime("%Y-%m-%d")

    df = yf.download(
        ticker, start=start_dt, end=end_dt, interval=interval,
        progress=False, auto_adjust=True
    )

    if df.empty:
        return []

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    # Filter out rows with zero volume
    if "Volume" in df.columns:
        df = df[df["Volume"] > 0]

    df = df[["Open", "High", "Low", "Close", "Volume"]].dropna()

    result = []
    for idx, row in df.iterrows():
        ts = idx.isoformat() if isinstance(idx, pd.Timestamp) else str(idx)
        result.append({
            "time": ts,
            "open": round(float(row["Open"]), 2),
            "high": round(float(row["High"]), 2),
            "low": round(float(row["Low"]), 2),
            "close": round(float(row["Close"]), 2),
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
        df = yf.download(
            "^JKSE", period="5d", interval="1d",
            progress=False, auto_adjust=True
        )
        if df.empty:
            raise ValueError("No IHSG data")

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # Filter out rows with zero volume (holidays / weekends)
        if "Volume" in df.columns:
            df = df[df["Volume"] > 0]
        df.dropna(inplace=True)

        latest = df.iloc[-1]
        prev = df.iloc[-2] if len(df) > 1 else df.iloc[-1]

        close_now = float(latest["Close"])
        close_prev = float(prev["Close"])
        change_pct = ((close_now - close_prev) / close_prev) * 100

        chart = []
        for idx, row in df.iterrows():
            chart.append({
                "name": idx.strftime("%d/%m"),
                "value": round(float(row["Close"]), 2),
            })

        return {
            "ihsg": round(close_now, 2),
            "change_pct": round(change_pct, 2),
            "volume": int(latest["Volume"]),
            "status": "Bullish" if change_pct > 0 else "Bearish",
            "chart": chart,
        }
    except Exception as e:
        logger.warning(f"Gagal ambil data IHSG: {e}")
        return {
            "ihsg": 7164.50,
            "change_pct": 0.42,
            "volume": 0,
            "status": "N/A",
            "chart": [],
        }
