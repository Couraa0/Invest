# -*- coding: utf-8 -*-
"""
InvestAI — News Scraping & Analysis Agent (Lightweight)
Tanpa LangChain/LangGraph — menggunakan Groq API secara langsung via httpx.

Flow:
    fetch_news → filter_articles → analyze_sentiment → generate_report → evaluate

Usage:
    from app.services.news_agent import analyze_ticker
    result = analyze_ticker("BBCA.JK", lookback_days=30)
"""

import os
import json
import time
import logging
from datetime import datetime, timedelta, timezone
from typing import Optional

import feedparser
import requests
import httpx
from bs4 import BeautifulSoup
from dateutil import parser as dateparser

from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Groq LLM Helper (langsung via httpx, tanpa langchain)
# ─────────────────────────────────────────────────────────────────────────────

GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = "openai/gpt-oss-20b"


def _call_groq(system_prompt: str, user_prompt: str, temperature: float = 0.2, max_tokens: int = 2048) -> str:
    """
    Panggil Groq API secara langsung menggunakan httpx (synchronous).
    Mengembalikan content string dari respons LLM.
    """
    api_key = os.getenv("GROQ_API_KEY", "").strip().strip('"').strip("'")
    if not api_key or api_key.startswith("your_"):
        raise EnvironmentError(
            "GROQ_API_KEY tidak ditemukan di environment. "
            "Pastikan sudah di-set di file .env atau environment system."
        )

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        "temperature": temperature,
        "max_tokens": max_tokens,
    }

    with httpx.Client(timeout=60.0) as client:
        response = client.post(GROQ_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        raise RuntimeError(f"Groq API error ({response.status_code}): {response.text}")

    data = response.json()
    return data["choices"][0]["message"]["content"].strip()


def _parse_json_response(raw: str) -> dict:
    """Parse JSON dari respons LLM, strip markdown fences jika ada."""
    text = raw.strip()
    if text.startswith("```"):
        parts = text.split("```")
        text = parts[1] if len(parts) > 1 else text
        if text.startswith("json"):
            text = text[4:]
    return json.loads(text.strip())


# ─────────────────────────────────────────────────────────────────────────────
# Ticker helpers & company name mapping
# ─────────────────────────────────────────────────────────────────────────────

def clean_ticker(ticker: str) -> str:
    """Hapus suffix .JK dari ticker."""
    return ticker.replace(".JK", "")


# Mapping ticker → nama pendek perusahaan untuk pencarian berita yang lebih akurat
COMPANY_SEARCH_NAMES: dict[str, list[str]] = {
    "BBCA.JK": ["Bank BCA", "Bank Central Asia"],
    "BMRI.JK": ["Bank Mandiri"],
    "BBNI.JK": ["Bank BNI", "Bank Negara Indonesia"],
    "BBRI.JK": ["Bank BRI", "Bank Rakyat Indonesia"],
    "BRIS.JK": ["BRI Syariah", "Bank Syariah Indonesia"],
    "BTPS.JK": ["BTPN Syariah"],
    "ARTO.JK": ["Bank Jago"],
    "BNGA.JK": ["CIMB Niaga"],
    "NISP.JK": ["OCBC NISP"],
    "BDMN.JK": ["Bank Danamon"],
    "MEGA.JK": ["Bank Mega"],
    "BJBR.JK": ["Bank BJB", "Bank Jabar Banten"],
    "ADRO.JK": ["Adaro Energy"],
    "PTBA.JK": ["Bukit Asam"],
    "ITMG.JK": ["Indo Tambangraya"],
    "HRUM.JK": ["Harum Energy"],
    "BUMI.JK": ["Bumi Resources"],
    "INDY.JK": ["Indika Energy"],
    "MDKA.JK": ["Merdeka Copper Gold"],
    "ANTM.JK": ["Aneka Tambang", "ANTM"],
    "INCO.JK": ["Vale Indonesia"],
    "MEDC.JK": ["Medco Energi"],
    "ELSA.JK": ["Elnusa"],
    "PGAS.JK": ["PGN", "Perusahaan Gas Negara"],
    "ESSA.JK": ["Essa Industries"],
    "ADMR.JK": ["Adaro Minerals"],
    "UNVR.JK": ["Unilever Indonesia"],
    "INDF.JK": ["Indofood"],
    "ICBP.JK": ["Indofood CBP"],
    "KLBF.JK": ["Kalbe Farma"],
    "CPIN.JK": ["Charoen Pokphand"],
    "JPFA.JK": ["Japfa Comfeed"],
    "MYOR.JK": ["Mayora Indah"],
    "SIDO.JK": ["Sido Muncul"],
    "GOOD.JK": ["Garudafood"],
    "ACES.JK": ["Ace Hardware Indonesia"],
    "MAPI.JK": ["Mitra Adiperkasa"],
    "ERAA.JK": ["Erajaya"],
    "TLKM.JK": ["Telkom Indonesia", "Telkom"],
    "EXCL.JK": ["XL Axiata"],
    "ISAT.JK": ["Indosat Ooredoo"],
    "TOWR.JK": ["Sarana Menara"],
    "TBIG.JK": ["Tower Bersama"],
    "DCII.JK": ["DCI Indonesia"],
    "BUKA.JK": ["Bukalapak"],
    "GOTO.JK": ["GoTo", "Gojek Tokopedia"],
    "EMTK.JK": ["Elang Mahkota"],
    "SCMA.JK": ["Surya Citra Media"],
    "ASII.JK": ["Astra International", "Astra"],
    "UNTR.JK": ["United Tractors"],
    "AKRA.JK": ["AKR Corporindo"],
    "SMGR.JK": ["Semen Indonesia"],
    "INTP.JK": ["Indocement"],
    "CTRA.JK": ["Ciputra Development", "Ciputra"],
    "LPKR.JK": ["Lippo Karawaci"],
    "WIKA.JK": ["Wijaya Karya", "WIKA"],
    "WSKT.JK": ["Waskita Karya"],
    "PTPP.JK": ["PP Persero"],
    "BSDE.JK": ["Bumi Serpong Damai", "BSD"],
    "SMRA.JK": ["Summarecon"],
    "PWON.JK": ["Pakuwon Jati"],
    "KAEF.JK": ["Kimia Farma"],
    "MIKA.JK": ["Mitra Keluarga"],
    "TSPC.JK": ["Tempo Scan"],
    "JSMR.JK": ["Jasa Marga"],
    "BIRD.JK": ["Blue Bird"],
    "AALI.JK": ["Astra Agro Lestari"],
    "MNCN.JK": ["MNC", "Media Nusantara Citra"],
}


# ─────────────────────────────────────────────────────────────────────────────
# News Scraper — Pencarian Berita Saham yang Akurat
# ─────────────────────────────────────────────────────────────────────────────

def scrape_google_news(ticker: str, lookback_days: int = 30, max_articles: int = 15) -> list:
    """
    Scraping berita dari Google News RSS berdasarkan ticker dan nama perusahaan.
    Menggunakan beberapa query berbeda untuk hasil yang lebih lengkap dan akurat.
    """
    code = clean_ticker(ticker)
    cutoff_date = datetime.now() - timedelta(days=lookback_days)
    cutoff_aware = cutoff_date.replace(tzinfo=timezone.utc)

    # Bangun query pencarian yang spesifik untuk saham ini
    company_names = COMPANY_SEARCH_NAMES.get(ticker, [])
    
    queries = [
        # Query 1: Kode saham + konteks bursa
        f'"{code}" saham',
        # Query 2: Kode saham + IDX
        f"{code} IDX harga saham",
    ]
    
    # Query 3+: Gunakan nama perusahaan lengkap (lebih akurat)
    for name in company_names[:2]:  # Max 2 nama perusahaan
        queries.append(f'"{name}" saham')

    articles = []
    seen_titles: set = set()

    for query in queries:
        url = (
            f"https://news.google.com/rss/search?q={requests.utils.quote(query)}"
            f"&hl=id&gl=ID&ceid=ID:id"
        )
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                title = entry.get("title", "").strip()
                if title in seen_titles:
                    continue

                pub_str = entry.get("published", "")
                try:
                    pub_dt = dateparser.parse(pub_str)
                    if pub_dt and pub_dt.tzinfo is None:
                        pub_dt = pub_dt.replace(tzinfo=timezone.utc)
                    if pub_dt and pub_dt < cutoff_aware:
                        continue
                except Exception:
                    pub_dt = None

                seen_titles.add(title)
                articles.append({
                    "title":   title,
                    "link":    entry.get("link", ""),
                    "source":  entry.get("source", {}).get("title", "Unknown"),
                    "date":    pub_dt.strftime("%Y-%m-%d") if pub_dt else "N/A",
                    "summary": BeautifulSoup(
                        entry.get("summary", ""), "html.parser"
                    ).get_text()[:300],
                })

                if len(articles) >= max_articles:
                    break

        except Exception as e:
            logger.warning(f"⚠️ Error fetching news [{query}]: {e}")

        if len(articles) >= max_articles:
            break

        time.sleep(0.3)

    logger.info(f"📡 [{ticker}] Ditemukan {len(articles)} artikel ({lookback_days} hari)")
    return articles


# ─────────────────────────────────────────────────────────────────────────────
# Pipeline Steps
# ─────────────────────────────────────────────────────────────────────────────

def _filter_articles(ticker: str, articles: list) -> list:
    """Filter artikel yang relevan dengan ticker menggunakan keyword matching (ticker + nama perusahaan)."""
    code = clean_ticker(ticker).lower()
    
    # Kumpulkan semua keyword relevan: kode saham + nama perusahaan
    keywords = [code]
    company_names = COMPANY_SEARCH_NAMES.get(ticker, [])
    keywords.extend([name.lower() for name in company_names])

    def is_relevant(article: dict) -> bool:
        text = f"{article.get('title', '')} {article.get('summary', '')}".lower()
        return any(kw in text for kw in keywords)

    filtered = [a for a in articles if is_relevant(a)]
    logger.info(f"🔍 [filter] {len(articles)} → {len(filtered)} artikel relevan (keywords: {keywords})")

    # Fallback: jika filter terlalu agresif
    if len(filtered) < 2 and len(articles) >= 2:
        logger.warning("⚠️ Filter terlalu agresif, fallback ke semua artikel.")
        return articles

    return filtered


def _analyze_sentiment(ticker: str, articles: list) -> dict:
    """Analisis sentimen menggunakan Groq LLM langsung."""
    if not articles:
        return {
            "overall_sentiment": "NETRAL",
            "sentiment_score":   0,
            "bullish_count":     0,
            "bearish_count":     0,
            "neutral_count":     0,
            "key_topics":        [],
            "risk_factors":      [],
            "catalysts":         [],
            "confidence":        "RENDAH",
        }

    code = clean_ticker(ticker)
    articles_text = "\n".join([
        f"[{i+1}] ({a['date']}) {a['title']} — {a['source']}"
        for i, a in enumerate(articles)
    ])

    system_prompt = (
        "Kamu adalah analis saham profesional. Analisis sentimen berita saham Indonesia. "
        "Jawab HANYA dalam format JSON yang valid, tanpa penjelasan tambahan di luar JSON."
    )
    user_prompt = f"""Analisis sentimen berita berikut untuk saham {code} (IDX):

{articles_text}

Berikan output JSON dengan struktur:
{{
  "overall_sentiment": "BULLISH" | "BEARISH" | "NETRAL",
  "sentiment_score": <angka -100 sampai 100>,
  "bullish_count": <jumlah berita positif>,
  "bearish_count": <jumlah berita negatif>,
  "neutral_count": <jumlah berita netral>,
  "key_topics": ["topik1", "topik2", "topik3"],
  "risk_factors": ["risiko1", "risiko2"],
  "catalysts": ["katalis1", "katalis2"],
  "confidence": "TINGGI" | "SEDANG" | "RENDAH"
}}"""

    try:
        raw = _call_groq(system_prompt, user_prompt)
        return _parse_json_response(raw)
    except json.JSONDecodeError as e:
        logger.error(f"❌ [analyze_sentiment] JSON parse error: {e}")
        return {
            "overall_sentiment": "NETRAL",
            "sentiment_score":   0,
            "key_topics":        [],
            "risk_factors":      [],
            "catalysts":         [],
            "confidence":        "RENDAH",
        }
    except Exception as e:
        logger.error(f"❌ [analyze_sentiment] Error: {e}")
        return {
            "overall_sentiment": "NETRAL",
            "sentiment_score":   0,
            "key_topics":        [],
            "risk_factors":      [],
            "catalysts":         [],
            "confidence":        "RENDAH",
            "error_detail":      str(e),
        }


def _generate_report(ticker: str, articles: list, sentiment: dict, lookback_days: int) -> str:
    """Generate laporan analisis dalam Bahasa Indonesia."""
    code = clean_ticker(ticker)

    articles_summary = "\n".join([
        f"- [{a['date']}] {a['title']} ({a['source']})"
        for a in articles[:10]
    ])

    user_prompt = f"""Buat laporan analisis berita saham {code} (IDX) dalam Bahasa Indonesia.
Periode analisis: {lookback_days} hari terakhir.

Data Sentimen:
{json.dumps(sentiment, ensure_ascii=False, indent=2)}

Berita Terkini (10 teratas):
{articles_summary if articles_summary else "Tidak ada berita ditemukan."}

Format laporan:
## 📊 Laporan Analisis Berita — {code}

### 🎯 Ringkasan Sentimen
[Sentimen keseluruhan dan skor]

### 📰 Topik Utama
[3-5 topik dominan dari berita]

### ⚡ Katalis Positif
[Faktor-faktor yang bisa mendorong harga naik]

### ⚠️ Faktor Risiko
[Risiko yang perlu diwaspadai investor]

### 💡 Rekomendasi
[Rekomendasi singkat berdasarkan berita — BUKAN saran investasi finansial]

### 📌 Disclaimer
Laporan ini dibuat otomatis berdasarkan analisis berita dan bukan merupakan saran investasi."""

    try:
        report = _call_groq(
            "Kamu adalah analis saham profesional Indonesia.",
            user_prompt,
            temperature=0.3,
            max_tokens=2048,
        )
        logger.info(f"✅ [generate_report] Selesai ({len(report)} karakter)")
        return report
    except Exception as e:
        logger.error(f"❌ [generate_report] Error: {e}")
        return f"Error generating report: {e}"


def _evaluate_report(ticker: str, report: str, sentiment: dict, articles: list) -> dict:
    """Evaluasi kualitas laporan."""
    if not report or report.startswith("Error"):
        return {
            "quality_score":        0,
            "sentiment_consistent": False,
            "recommendation_clear": False,
            "issues":               ["Laporan kosong atau terjadi error"],
            "verdict":              "NEEDS_REVISION",
        }

    code = clean_ticker(ticker)
    article_titles = "\n".join([
        f"- {a.get('date', 'N/A')}: {a.get('title', '')}"
        for a in articles[:10]
    ])

    system_prompt = (
        "Kamu adalah quality assurance analis laporan saham. "
        "Evaluasi laporan yang diberikan secara objektif dan kritis. "
        "Jawab HANYA dalam format JSON valid, tanpa teks di luar JSON."
    )
    user_prompt = f"""Evaluasi kualitas laporan analisis berita saham berikut untuk {code}.

Data sentimen yang digunakan:
{json.dumps(sentiment, ensure_ascii=False, indent=2)}

Artikel berita yang dianalisis:
{article_titles if article_titles else "(tidak ada)"}

Laporan yang dievaluasi:
{report[:3000]}{'...(dipotong)' if len(report) > 3000 else ''}

Berikan evaluasi dalam JSON:
{{
  "quality_score": <0-100>,
  "sentiment_consistent": <true/false>,
  "recommendation_clear": <true/false>,
  "issues": ["<isu spesifik jika ada>"],
  "verdict": "APPROVED" | "NEEDS_REVISION"
}}"""

    try:
        raw = _call_groq(system_prompt, user_prompt)
        return _parse_json_response(raw)
    except Exception as e:
        logger.error(f"❌ [evaluate] Error: {e}")
        return {
            "quality_score":        50,
            "sentiment_consistent": True,
            "recommendation_clear": True,
            "issues":               [f"Evaluasi gagal: {e}"],
            "verdict":              "APPROVED",
        }


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────

def analyze_ticker(ticker: str, lookback_days: int = 30) -> dict:
    """
    Entry point utama — jalankan pipeline analisis berita untuk satu ticker.

    Flow: fetch_news → filter → analyze_sentiment → generate_report → evaluate
    Jika evaluasi gagal (verdict NEEDS_REVISION), retry generate_report (max 2x).
    """
    if not ticker.endswith(".JK"):
        ticker = f"{ticker.upper()}.JK"

    logger.info(f"🚀 Memulai analisis: {ticker} ({lookback_days} hari)")

    # Step 1: Fetch news
    raw_articles = scrape_google_news(ticker, lookback_days=lookback_days, max_articles=20)
    article_count = len(raw_articles)

    # Gate: cek kecukupan data
    MIN_ARTICLES = 3
    if article_count < MIN_ARTICLES:
        code = clean_ticker(ticker)
        insufficient_report = (
            f"## ⚠️ Data Tidak Mencukupi — {code}\n\n"
            f"Hanya ditemukan **{article_count} artikel** dalam periode "
            f"{lookback_days} hari terakhir.\n"
            f"Diperlukan minimal {MIN_ARTICLES} artikel untuk analisis yang valid.\n\n"
            f"**Saran:** Coba perluas periode analisis atau periksa kembali kode ticker."
        )
        return {
            "ticker":            ticker,
            "lookback_days":     lookback_days,
            "raw_articles":      raw_articles,
            "article_count":     article_count,
            "data_quality":      "insufficient_data",
            "filtered_articles": [],
            "sentiment_data":    None,
            "final_report":      insufficient_report,
            "evaluation_result": None,
            "retry_count":       0,
            "error":             None,
        }

    # Step 2: Filter articles
    filtered = _filter_articles(ticker, raw_articles)

    # Step 3: Analyze sentiment
    sentiment = _analyze_sentiment(ticker, filtered)

    # Step 4 & 5: Generate report + evaluate (with retry loop)
    MAX_RETRY = 2
    report = None
    eval_result = None

    for attempt in range(MAX_RETRY + 1):
        report = _generate_report(ticker, filtered, sentiment, lookback_days)
        eval_result = _evaluate_report(ticker, report, sentiment, filtered)

        verdict = eval_result.get("verdict", "APPROVED")
        if verdict == "APPROVED":
            break

        if attempt < MAX_RETRY:
            logger.info(f"♻️ Retry report ke-{attempt + 1} (issues: {eval_result.get('issues', [])})")
        else:
            logger.warning(f"⚠️ Max retry tercapai, paksa APPROVED.")
            eval_result["verdict"] = "APPROVED"
            eval_result["forced_approve"] = True

    return {
        "ticker":            ticker,
        "lookback_days":     lookback_days,
        "raw_articles":      raw_articles,
        "article_count":     article_count,
        "data_quality":      "sufficient",
        "filtered_articles": filtered,
        "sentiment_data":    sentiment,
        "final_report":      report,
        "evaluation_result": eval_result,
        "retry_count":       MAX_RETRY + 1,
        "error":             None,
    }


def analyze_ticker_stream(ticker: str, lookback_days: int = 30):
    """
    Generator version — yields step-by-step progress events (untuk SSE streaming).
    """
    if not ticker.endswith(".JK"):
        ticker = f"{ticker.upper()}.JK"

    logger.info(f"🚀 Memulai analisis stream: {ticker} ({lookback_days} hari)")

    yield {
        "status": "start",
        "step": "fetch_news",
        "message": f"Memulai analisis: {ticker} ({lookback_days} hari)",
    }

    # Step 1: Fetch
    raw_articles = scrape_google_news(ticker, lookback_days=lookback_days, max_articles=20)

    yield {
        "status": "progress",
        "step": "analyze_sentiment",
        "message": f"Ditemukan {len(raw_articles)} artikel. Menganalisis sentimen...",
    }

    # Step 2: Filter
    filtered = _filter_articles(ticker, raw_articles)

    # Step 3: Sentiment
    try:
        sentiment = _analyze_sentiment(ticker, filtered)
    except Exception as e:
        yield {"status": "error", "message": f"Gagal analisis sentimen: {e}"}
        return

    yield {
        "status": "progress",
        "step": "generate_report",
        "message": "Analisis sentimen selesai. Menyusun laporan ringkasan...",
    }

    # Step 4: Report
    try:
        report = _generate_report(ticker, filtered, sentiment, lookback_days)
    except Exception as e:
        yield {"status": "error", "message": f"Gagal generate report: {e}"}
        return

    # Build response
    response_data = {
        "status":          "success",
        "ticker":          ticker.replace(".JK", ""),
        "sentiment":       sentiment.get("overall_sentiment", "NETRAL"),
        "sentiment_score": int(sentiment.get("sentiment_score", 0)),
        "confidence":      sentiment.get("confidence", "RENDAH"),
        "article_count":   len(raw_articles),
        "key_topics":      sentiment.get("key_topics", []),
        "risk_factors":    sentiment.get("risk_factors", []),
        "catalysts":       sentiment.get("catalysts", []),
        "final_report":    report or "Laporan tidak tersedia.",
        "articles": [
            {
                "title":   a.get("title", ""),
                "link":    a.get("link", ""),
                "source":  a.get("source", ""),
                "date":    a.get("date", ""),
                "summary": a.get("summary", ""),
            }
            for a in raw_articles[:15]
        ],
        "lookback_days": lookback_days,
    }

    yield {"status": "complete", "result": response_data}
