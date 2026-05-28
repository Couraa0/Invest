# -*- coding: utf-8 -*-
"""
InvestAI — FastAPI Routes
Endpoint REST API untuk prediksi saham real-time
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
    ihsg:       float
    change_pct: float
    volume:     int
    status:     str
    chart:      list


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

@router.get("/stocks", summary="Prediksi semua 6 saham IDX")
async def get_all_stocks():
    """
    Ambil data real-time dan prediksi AI untuk semua 6 saham:
    BBCA, ASII, TLKM, BMRI, GOTO, UNVR.
    
    Response dipakai oleh halaman:
    - Dashboard (watchlist cards)
    - Signals (stock grid + analisis)
    """
    cached = _cache_get("all_stocks")
    if cached:
        logger.info("Cache hit: all_stocks")
        return {"status": "success", "data": cached, "cached": True}

    results = []
    errors  = []

    for ticker in TICKERS:
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
        "status":  "success",
        "count":   len(results),
        "errors":  errors,
        "data":    results,
        "cached":  False,
    }


@router.get("/stocks/{symbol}", summary="Prediksi detail satu saham")
async def get_stock_detail(
    symbol: str,
    period: str = Query(default="1M", description="Chart period: 1D, 1W, 1M, 1Y, 5Y")
):
    """
    Ambil prediksi AI + data chart historis untuk satu saham.
    
    - **symbol**: kode saham tanpa .JK (contoh: BBCA, ASII)
    - **period**: rentang chart (1D, 1W, 1M, 1Y, 5Y)
    
    Response dipakai oleh halaman StockDetail.
    """
    ticker = f"{symbol.upper()}.JK"

    if ticker not in TICKERS:
        raise HTTPException(
            status_code=404,
            detail=f"Saham '{symbol}' tidak tersedia. Pilih dari: {[t.replace('.JK','') for t in TICKERS]}"
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
        "chart":      chart,
        "period":     period,
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
