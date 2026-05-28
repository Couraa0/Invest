# -*- coding: utf-8 -*-
"""
InvestAI — Mentor Service
Menyediakan integrasi dengan Groq API untuk AI Mentor Chatbot
"""

import os
import logging
import httpx
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables dari backend/ai/.env secara eksplisit
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
dotenv_path = os.path.join(base_dir, ".env")
load_dotenv(dotenv_path=dotenv_path)

logger = logging.getLogger(__name__)

GROQ_MODEL = "llama-3.1-8b-instant"

SYSTEM_PROMPT = (
    "Anda adalah 'InvestAI Mentor', asisten AI keuangan dan penasihat saham profesional di Indonesia. "
    "Tugas Anda adalah membantu pengguna memahami pasar saham Indonesia (BEI/IDX), edukasi investasi, analisis teknikal, "
    "analisis fundamental, membaca grafik, manajemen risiko, psikologi trading, dan perencanaan keuangan. "
    "Berikan jawaban dalam Bahasa Indonesia yang profesional, ramah, edukatif, dan mudah dipahami oleh investor pemula maupun ahli. "
    "Gunakan format Markdown untuk membuat teks jawaban lebih mudah dibaca (misalnya dengan tebal, poin-poin, tabel jika diperlukan). "
    "Batasi respons Anda agar padat, jelas, dan langsung menjawab pertanyaan pengguna."
)


def get_stocks_summary_for_prompt() -> str:
    """
    Mengambil data harga real-time dan prediksi dari cache atau secara live
    untuk diberikan kepada AI Mentor sebagai konteks pengetahuan tambahan.
    """
    stocks = []
    
    # 1. Coba ambil dari cache routes.py (sangat cepat)
    try:
        from ..api.routes import _cache
        cached_data, _ = _cache.get("all_stocks", (None, None))
        if cached_data:
            stocks = cached_data
    except Exception as e:
        logger.warning(f"Gagal mengambil cache stock untuk AI Mentor: {e}")

    # 2. Jika cache kosong (misal baru dinyalakan), ambil live via prediction_service
    if not stocks:
        try:
            from .prediction_service import predict_stock, TICKERS
            stocks = []
            for ticker in TICKERS:
                try:
                    stocks.append(predict_stock(ticker))
                except Exception as ex:
                    logger.error(f"Gagal hit live predict untuk {ticker} di AI Mentor: {ex}")
        except Exception as e:
            logger.error(f"Gagal import/run live predict di AI Mentor: {e}")

    if not stocks:
        return "Catatan: Data harga saham real-time IDX saat ini tidak dapat dimuat."

    lines = [
        "Berikut adalah data harga saham real-time Indonesia (BEI/IDX) beserta analisis teknikal & sinyal prediksi Machine Learning (Random Forest) saat ini:"
    ]
    for s in stocks:
        lines.append(
            f"- **{s['symbol']}** ({s['name']}): Harga Rp {s['harga']:,} ({'+' if s['change_pct'] >= 0 else ''}{s['change_pct']:.2f}%), "
            f"Sinyal ML AI: **{s['action']}** (Kekuatan: {s['strength']}, Confidence: {s['confidence']:.1f}%), "
            f"RSI: {s['rsi']:.1f} ({s['rsi_status']}), "
            f"MACD: {s['macd_status']} ({s['ma_status']}), "
            f"Rekomendasi TP (Take Profit): Rp {s['take_profit']:,}, SL (Stop Loss): Rp {s['stop_loss']:,}"
        )
    return "\n".join(lines)


async def chat_with_mentor(messages: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    Mengirim riwayat chat ke Groq API menggunakan model Llama 3.1 8B Instant.
    """
    # Mengambil API key secara dinamis dari env
    api_key = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")
    
    if not api_key or api_key == "YOUR_GROQ_API_KEY" or api_key.startswith("your_"):
        logger.warning("⚠️ GROQ_API_KEY tidak ditemukan atau masih default!")
        return {
            "role": "assistant",
            "content": (
                "⚠️ **Sistem: API Key Groq Belum Dikonfigurasi**\n\n"
                "Untuk mengaktifkan AI Mentor secara real-time menggunakan **Groq Llama 3.1 8B**, "
                "silakan tambahkan API key Anda ke file `.env` di folder backend:\n\n"
                "1. Buka file `backend/ai/.env` (atau buat baru jika belum ada).\n"
                "2. Tambahkan baris berikut:\n"
                "   ```env\n"
                "   GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxx\n"
                "   ```\n"
                "3. Restart server backend Anda."
            )
        }

    # Ambil data real-time 6 saham secara dinamis untuk disuntikkan ke System Prompt (RAG)
    stocks_summary = get_stocks_summary_for_prompt()
    
    full_system_prompt = (
        f"{SYSTEM_PROMPT}\n\n"
        "--- DATA REAL-TIME IDX SAHAM TERBARU & HASIL PREDIKSI MACHINE LEARNING ---\n"
        f"{stocks_summary}\n\n"
        "Gunakan data real-time di atas sebagai referensi utama jika pengguna bertanya tentang harga, sinyal, analisis teknikal (RSI, MACD), TP/SL, "
        "atau rekomendasi terkait 6 saham tersebut (BBCA, ASII, TLKM, BMRI, GOTO, UNVR). Jawablah secara akurat sesuai data di atas."
    )

    # Siapkan payloads
    formatted_messages = [{"role": "system", "content": full_system_prompt}]
    # Tambahkan history chat dari user
    for msg in messages:
        # Validasi role agar sesuai spesifikasi Groq (user, assistant, system)
        role = msg.get("role", "user")
        if role not in ["user", "assistant", "system"]:
            role = "user"
        formatted_messages.append({
            "role": role,
            "content": msg.get("content", "")
        })

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": formatted_messages,
        "temperature": 0.7,
        "max_tokens": 1024
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, headers=headers, json=payload)
            
            if response.status_code == 200:
                res_data = response.json()
                content = res_data["choices"][0]["message"]["content"]
                return {
                    "role": "assistant",
                    "content": content
                }
            else:
                logger.error(f"Groq API Error ({response.status_code}): {response.text}")
                return {
                    "role": "assistant",
                    "content": f"❌ **Error Groq API ({response.status_code})**: Gagal mendapatkan respons dari server AI. Pastikan API key Anda valid."
                }
                
    except httpx.RequestError as e:
        logger.error(f"Koneksi ke Groq API gagal: {e}")
        return {
            "role": "assistant",
            "content": "❌ **Koneksi Error**: Gagal menghubungi server Groq AI. Periksa koneksi internet server backend Anda."
        }
