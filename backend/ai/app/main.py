# -*- coding: utf-8 -*-
"""
InvestAI — FastAPI Main Application (v2 — XGBoost Engine)
Jalankan dengan: uvicorn app.main:app --reload --port 8000
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.routes import router
from .services.prediction_service import load_model

# ================================================================
# Logging
# ================================================================

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ================================================================
# Lifespan: Load model saat startup
# ================================================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup: load XGBoost model ke memory sekali saja.
    Shutdown: bersihkan resources.
    """
    logger.info("🚀 InvestAI API v2 starting up (XGBoost Engine)...")
    try:
        bundle = load_model()
        logger.info(
            f"✅ XGBoost model loaded — "
            f"Fitur: {len(bundle['feature_cols'])}, "
            f"Akurasi: {bundle.get('accuracy_val', bundle.get('accuracy', 'N/A'))}"
        )
    except Exception as e:
        logger.error(f"❌ Gagal load model: {e}")
        logger.warning("⚠️  API berjalan tanpa model — endpoint predict akan error")

    yield  # aplikasi berjalan

    logger.info("👋 InvestAI API shutting down...")


# ================================================================
# Inisialisasi FastAPI App
# ================================================================

app = FastAPI(
    title="InvestAI — Stock Prediction API v2",
    description=(
        "REST API real-time untuk prediksi 90+ saham IDX menggunakan "
        "XGBoost Machine Learning + yfinance. "
        "Menyediakan sinyal BUY/SELL, confidence score, indikator teknikal, "
        "dan prediksi per sektor industri."
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ================================================================
# CORS Middleware
# ================================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "*",  # untuk development; batasi di production
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================================================================
# Register Router
# ================================================================

app.include_router(router)


# ================================================================
# Root & Health
# ================================================================

@app.get("/", tags=["meta"])
def root():
    return {
        "app":     "InvestAI Stock Prediction API",
        "version": "2.0.0",
        "engine":  "XGBoost",
        "docs":    "/docs",
        "status":  "running",
        "endpoints": [
            "GET /api/stocks                       → prediksi semua 90+ saham",
            "GET /api/stocks/{symbol}              → prediksi + chart satu saham",
            "GET /api/stocks/categories            → daftar sektor & ticker",
            "GET /api/stocks/by-category/{cat}    → prediksi per sektor (lazy)",
            "GET /api/market/overview              → data IHSG",
            "DELETE /api/cache                    → clear cache (dev)",
        ],
    }


@app.get("/health", tags=["meta"])
def health():
    return {"status": "healthy", "version": "2.0.0", "engine": "XGBoost"}
