# -*- coding: utf-8 -*-
"""
InvestAI — FastAPI Routes (v2)
Endpoint REST API untuk prediksi saham real-time — 90+ saham IDX
"""

import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, BackgroundTasks
from pydantic import BaseModel

from ..services.prediction_service import (
    predict_stock,
    get_chart_data,
    get_market_overview,
    TICKERS,
    TICKER_NAMES,
    TICKER_CATEGORIES,
    TICKER_CATEGORY_MAP,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["stocks"])


# ================================================================
# Pydantic Response Models
# ================================================================

class StockSummary(BaseModel):
    ticker:      str
    symbol:      str
    name:        str
    category:    str
    tanggal:     str
    harga:       float
    change_pct:  float
    prediksi:    str
    signal:      str
    action:      str
    confidence:  float
    prob_naik:   float
    prob_turun:  float
    take_profit: float
    stop_loss:   float
    strength:    str
    rsi:         float
    rsi_status:  str
    macd_diff:   float
    macd_status: str
    sma20:       float
    ema12:       float
    bb_upper:    float
    bb_lower:    float
    stoch_k:     float
    ma_status:   str


class ChartPoint(BaseModel):
    time:   str
    open:   float
    high:   float
    low:    float
    close:  float
    volume: int


class MarketOverview(BaseModel):
    ihsg:            float
    change_pct:      float
    volume:          int
    status:          str
    chart:           list
    bullish_percent: Optional[float] = 50.0


class MessageItem(BaseModel):
    role:    str
    content: str


class ChatRequest(BaseModel):
    messages: list[MessageItem]


# ================================================================
# In-memory Cache (sederhana)
# ================================================================

_cache: dict = {}
CACHE_TTL_SECONDS = 300  # 5 menit


def _cache_get(key: str):
    import time
    if key in _cache:
        data, ts = _cache[key]
        if time.time() - ts < CACHE_TTL_SECONDS:
            return data
    return None


def _cache_set(key: str, value):
    import time
    _cache[key] = (value, time.time())


# ================================================================
# Endpoints
# ================================================================

@router.get("/stocks/categories", summary="Daftar kategori & ticker saham IDX")
async def get_categories():
    """
    Mengembalikan daftar sektor beserta ticker yang tersedia.
    Dipakai frontend untuk membangun filter tab sektor.
    """
    result = {}
    for cat, tickers in TICKER_CATEGORIES.items():
        result[cat] = [
            {
                "ticker": t,
                "symbol": t.replace(".JK", ""),
                "name": TICKER_NAMES.get(t, t),
            }
            for t in tickers
        ]
    return {
        "status": "success",
        "total_tickers": len(TICKERS),
        "categories": result,
    }


@router.get("/stocks/by-category/{category}", summary="Prediksi saham per sektor")
async def get_stocks_by_category(category: str):
    """
    Prediksi AI untuk semua saham dalam satu sektor/kategori.
    Memungkinkan lazy loading per tab di frontend.

    - **category**: nama sektor (contoh: Perbankan%20%26%20Keuangan)
    """
    # URL decode manual jika perlu
    category_decoded = category.replace("%20", " ").replace("%26", "&")

    # Cari kategori yang cocok (case-insensitive prefix match)
    matched_cat = None
    for cat in TICKER_CATEGORIES:
        if cat.lower() == category_decoded.lower() or category_decoded.lower() in cat.lower():
            matched_cat = cat
            break

    if not matched_cat:
        available = list(TICKER_CATEGORIES.keys())
        raise HTTPException(
            status_code=404,
            detail=f"Kategori '{category_decoded}' tidak ditemukan. Pilih dari: {available}"
        )

    cache_key = f"cat_{matched_cat}"
    cached = _cache_get(cache_key)
    if cached:
        logger.info(f"Cache hit: {cache_key}")
        return {"status": "success", "category": matched_cat, "data": cached, "cached": True}

    tickers_in_cat = TICKER_CATEGORIES[matched_cat]
    results = []
    errors = []

    for ticker in tickers_in_cat:
        try:
            logger.info(f"🔍 Predicting [{matched_cat}]: {ticker}")
            result = predict_stock(ticker)
            results.append(result)
        except Exception as e:
            logger.error(f"❌ Error predicting {ticker}: {e}")
            errors.append({"ticker": ticker, "error": str(e)})

    _cache_set(cache_key, results)
    return {
        "status": "success",
        "category": matched_cat,
        "count": len(results),
        "errors": errors,
        "data": results,
        "cached": False,
    }


@router.get("/stocks", summary="Prediksi semua 90+ saham IDX")
async def get_all_stocks(limit: int = Query(default=0, description="Batas jumlah saham (0=semua)")):
    """
    Ambil data real-time dan prediksi AI untuk semua 90+ saham IDX.

    ⚠️ Endpoint ini membutuhkan waktu 3-5 menit untuk 90+ saham.
    Untuk UX lebih cepat, gunakan /api/stocks/by-category/{category}.

    Response dipakai oleh halaman:
    - Dashboard (watchlist cards)
    - Signals (stock grid + analisis)
    """
    cached = _cache_get("all_stocks")
    if cached:
        logger.info("Cache hit: all_stocks")
        data = cached[:limit] if limit > 0 else cached
        return {"status": "success", "data": data, "count": len(data), "cached": True}

    tickers_to_fetch = TICKERS[:limit] if limit > 0 else TICKERS
    results = []
    errors = []

    for ticker in tickers_to_fetch:
        try:
            logger.info(f"🔍 Predicting: {ticker}")
            result = predict_stock(ticker)
            results.append(result)
        except Exception as e:
            logger.error(f"❌ Error predicting {ticker}: {e}")
            errors.append({"ticker": ticker, "error": str(e)})

    if not results:
        raise HTTPException(
            status_code=503,
            detail="Tidak dapat mengambil data saham. Pastikan koneksi internet aktif."
        )

    _cache_set("all_stocks", results)
    return {
        "status": "success",
        "count": len(results),
        "total_tickers": len(TICKERS),
        "errors": errors,
        "data": results,
        "cached": False,
    }


@router.get("/stocks/{symbol}", summary="Prediksi detail satu saham")
async def get_stock_detail(
    symbol: str,
    period: str = Query(default="1M", description="Chart period: 1D, 1W, 1M, 1Y, 5Y")
):
    """
    Ambil prediksi AI + data chart historis untuk satu saham.

    - **symbol**: kode saham tanpa .JK (contoh: BBCA, TLKM, GOTO)
    - **period**: rentang chart (1D, 1W, 1M, 1Y, 5Y)
    """
    ticker = f"{symbol.upper()}.JK"

    if ticker not in TICKERS:
        raise HTTPException(
            status_code=404,
            detail=f"Saham '{symbol}' tidak tersedia. Total {len(TICKERS)} saham IDX tersedia."
        )

    cache_key = f"stock_detail_{symbol}_{period}"
    cached = _cache_get(cache_key)
    if cached:
        return {"status": "success", **cached, "cached": True}

    try:
        prediction = predict_stock(ticker)
    except Exception as e:
        logger.error(f"❌ Error predicting {ticker}: {e}")
        raise HTTPException(status_code=503, detail=f"Gagal ambil prediksi: {str(e)}")

    try:
        chart = get_chart_data(ticker, period)
    except Exception as e:
        logger.warning(f"⚠️ Gagal ambil chart {ticker}: {e}")
        chart = []

    response = {
        "prediction": prediction,
        "chart": chart,
        "period": period,
    }
    _cache_set(cache_key, response)

    return {"status": "success", **response, "cached": False}


@router.get("/market/overview", summary="Overview pasar (IHSG)")
async def get_market():
    """
    Ambil data IHSG dan sentimen pasar umum.
    Dipakai oleh halaman Dashboard (Market Overview card).
    """
    cached = _cache_get("market_overview")
    if cached:
        return {"status": "success", "data": cached, "cached": True}

    data = get_market_overview()
    _cache_set("market_overview", data)
    return {"status": "success", "data": data, "cached": False}


@router.get("/market/ihsg", summary="Chart IHSG dengan periode")
async def get_ihsg_chart(
    period: str = Query(default="1M", description="Period: 1D, 1W, 1M, 3M, 1Y, 5Y")
):
    """
    Ambil data chart IHSG (^JKSE) dengan berbagai rentang waktu.
    Dipakai oleh halaman Simulator sebagai benchmark pasar.
    """
    cache_key = f"ihsg_chart_{period}"
    cached = _cache_get(cache_key)
    if cached:
        return {"status": "success", "data": cached, "period": period, "cached": True}

    from ..services.prediction_service import get_chart_data as _get_chart
    try:
        chart = _get_chart("^JKSE", period)
    except Exception as e:
        logger.warning(f"Gagal ambil chart IHSG: {e}")
        chart = []

    # Also fetch latest overview for current price/change
    overview = get_market_overview()

    response = {
        "ihsg": overview["ihsg"],
        "change_pct": overview["change_pct"],
        "status": overview["status"],
        "bullish_percent": overview.get("bullish_percent", 50.0),
        "chart": chart,
    }
    _cache_set(cache_key, response)
    return {"status": "success", "data": response, "period": period, "cached": False}


@router.delete("/cache", summary="Clear cache (dev only)")
async def clear_cache():
    """Hapus semua cache — berguna saat development."""
    _cache.clear()
    return {"status": "success", "message": "Cache cleared"}


@router.post("/mentor/chat", summary="Chat dengan AI Mentor (Groq)")
async def chat_mentor(request: ChatRequest):
    """
    Kirim riwayat chat ke AI Mentor yang ditenagai oleh Groq (Llama 3.1 8B Instant).
    """
    messages_dict = [{"role": msg.role, "content": msg.content} for msg in request.messages]
    from ..services.mentor_service import chat_with_mentor
    response = await chat_with_mentor(messages_dict)
    return response
