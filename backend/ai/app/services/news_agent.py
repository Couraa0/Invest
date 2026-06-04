# -*- coding: utf-8 -*-
"""
InvestAI — LangGraph News Scraping & Analysis Agent
Clean Python module (refactored from Colab notebook)

Flow:
    fetch_news
        → route_by_data_quality  ──[insufficient_data]──→ END
        → filter_articles
        → analyze_sentiment
        → generate_report  ←────────────────────────────────┐
        → evaluate_output  ──[low quality, retry < 3]───────┘
        → END

Usage:
    from app.services.news_agent import analyze_ticker, build_news_agent
    result = analyze_ticker("BBCA.JK", lookback_days=30)
"""

import os
import json
import time
import logging
from datetime import datetime, timedelta, timezone
from typing import TypedDict, Optional

import feedparser
import requests
from bs4 import BeautifulSoup
from dateutil import parser as dateparser
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.graph import StateGraph, END

from dotenv import load_dotenv
load_dotenv()

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────────────────────────────────────
# Konfigurasi Ticker IDX
# ─────────────────────────────────────────────────────────────────────────────

TICKERS = [
    # Perbankan & Keuangan
    'BBCA.JK', 'BMRI.JK', 'BBNI.JK', 'BBRI.JK', 'BRIS.JK', 'BTPS.JK',
    'ARTO.JK', 'BNGA.JK', 'NISP.JK', 'BDMN.JK', 'MEGA.JK', 'BJBR.JK',
    # Energi & Pertambangan
    'ADRO.JK', 'PTBA.JK', 'ITMG.JK', 'HRUM.JK', 'BUMI.JK', 'INDY.JK',
    'MDKA.JK', 'ANTM.JK', 'INCO.JK', 'MEDC.JK', 'ELSA.JK', 'PGAS.JK',
    'ESSA.JK', 'ADMR.JK',
    # Consumer Goods & Retail
    'UNVR.JK', 'INDF.JK', 'ICBP.JK', 'KLBF.JK', 'CPIN.JK', 'JPFA.JK',
    'MYOR.JK', 'SIDO.JK', 'GOOD.JK', 'ACES.JK', 'MAPI.JK', 'MAPA.JK', 'ERAA.JK',
    # Telekomunikasi & Teknologi
    'TLKM.JK', 'EXCL.JK', 'ISAT.JK', 'TOWR.JK', 'TBIG.JK',
    'DCII.JK', 'BUKA.JK', 'GOTO.JK', 'EMTK.JK', 'SCMA.JK',
    # Industri & Manufaktur
    'ASII.JK', 'UNTR.JK', 'SRIL.JK', 'AKRA.JK', 'SMGR.JK', 'INTP.JK',
    'AMFG.JK', 'CTRA.JK', 'BJTM.JK',
    # Properti & Konstruksi
    'LPKR.JK', 'WIKA.JK', 'WSKT.JK', 'PPRE.JK', 'PTPP.JK', 'BSDE.JK',
    'SMRA.JK', 'PWON.JK',
    # Healthcare & Farmasi
    'KAEF.JK', 'PYFA.JK', 'MIKA.JK', 'HEAL.JK', 'TSPC.JK',
    # Infrastruktur & Utilitas
    'JSMR.JK', 'WEGE.JK', 'META.JK', 'BIRD.JK', 'NELY.JK',
    # Agribisnis
    'AALI.JK', 'SIMP.JK', 'LSIP.JK', 'TBLA.JK',
    # Media & Hiburan
    'MNCN.JK', 'VIVA.JK', 'LINK.JK',
    # Logistik & Pergudangan
    'HRTA.JK', 'INTD.JK',
]


def clean_ticker(ticker: str) -> str:
    """Hapus suffix .JK dari ticker."""
    return ticker.replace('.JK', '')


# ─────────────────────────────────────────────────────────────────────────────
# LLM Init (lazy — dibuat saat pertama kali dipanggil)
# ─────────────────────────────────────────────────────────────────────────────

_llm: Optional[ChatGroq] = None


def _get_llm() -> ChatGroq:
    """
    Inisialisasi ChatGroq sekali saja (lazy singleton).
    GROQ_API_KEY diambil dari environment variable, tidak di-hardcode.
    """
    global _llm
    if _llm is None:
        api_key = os.getenv('GROQ_API_KEY')
        if not api_key:
            raise EnvironmentError(
                "GROQ_API_KEY tidak ditemukan di environment. "
                "Pastikan sudah di-set di file .env atau environment system."
            )
        _llm = ChatGroq(
            model='llama-3.3-70b-versatile',
            api_key=api_key,
            temperature=0.2,
            max_tokens=2048,
        )
        logger.info("✅ ChatGroq (llama-3.3-70b) initialized")
    return _llm


# ─────────────────────────────────────────────────────────────────────────────
# LangGraph State Schema
# ─────────────────────────────────────────────────────────────────────────────

class NewsAnalysisState(TypedDict):
    ticker:            str             # input: e.g. 'BBCA.JK'
    lookback_days:     int             # input: 7 | 30 | 90
    raw_articles:      list            # output fetch_news_node
    article_count:     int
    data_quality:      str             # "sufficient" | "insufficient_data"
    filtered_articles: list            # output filter_articles_node
    sentiment_data:    Optional[dict]  # output analyze_sentiment_node
    final_report:      Optional[str]   # output generate_report_node
    evaluation_result: Optional[dict]  # output evaluate_output_node
    retry_count:       int             # counter untuk loop generate_report
    error:             Optional[str]


# ─────────────────────────────────────────────────────────────────────────────
# News Scraper
# ─────────────────────────────────────────────────────────────────────────────

def scrape_google_news(ticker: str, lookback_days: int = 30, max_articles: int = 15) -> list:
    """
    Scraping berita dari Google News RSS berdasarkan ticker dan periode.

    Args:
        ticker:       Kode saham lengkap (e.g. 'BBCA.JK')
        lookback_days: Jumlah hari ke belakang untuk filter berita
        max_articles: Maksimal artikel yang dikembalikan

    Returns:
        list of dict: [{'title', 'link', 'source', 'date', 'summary'}, ...]
    """
    code = clean_ticker(ticker)
    cutoff_date = datetime.now() - timedelta(days=lookback_days)
    cutoff_aware = cutoff_date.replace(tzinfo=timezone.utc)

    queries = [
        f'saham {code} IDX',
        f'{code} BEI emiten',
    ]

    articles = []
    seen_titles: set = set()

    for query in queries:
        url = (
            f'https://news.google.com/rss/search?q={requests.utils.quote(query)}'
            f'&hl=id&gl=ID&ceid=ID:id'
        )
        try:
            feed = feedparser.parse(url)
            for entry in feed.entries:
                title = entry.get('title', '').strip()
                if title in seen_titles:
                    continue

                # Parse & filter tanggal
                pub_str = entry.get('published', '')
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
                    'title':   title,
                    'link':    entry.get('link', ''),
                    'source':  entry.get('source', {}).get('title', 'Unknown'),
                    'date':    pub_dt.strftime('%Y-%m-%d') if pub_dt else 'N/A',
                    'summary': BeautifulSoup(
                        entry.get('summary', ''), 'html.parser'
                    ).get_text()[:300],
                })

                if len(articles) >= max_articles:
                    break

        except Exception as e:
            logger.warning(f"⚠️ Error fetching news [{query}]: {e}")

        if len(articles) >= max_articles:
            break

        time.sleep(0.3)  # rate limit

    logger.info(f"📡 [{ticker}] Ditemukan {len(articles)} artikel ({lookback_days} hari)")
    return articles


# ─────────────────────────────────────────────────────────────────────────────
# LangGraph Nodes
# ─────────────────────────────────────────────────────────────────────────────

def fetch_news_node(state: NewsAnalysisState) -> NewsAnalysisState:
    """Node 1: Fetch berita dari Google News RSS."""
    ticker = state['ticker']
    lookback_days = state.get('lookback_days', 30)
    logger.info(f"📡 [fetch_news] {ticker} — {lookback_days} hari")
    try:
        articles = scrape_google_news(ticker, lookback_days=lookback_days, max_articles=20)
        return {
            **state,
            'raw_articles':      articles,
            'article_count':     len(articles),
            'filtered_articles': [],
            'data_quality':      'sufficient',
            'retry_count':       0,
            'evaluation_result': None,
            'error':             None,
        }
    except Exception as e:
        logger.error(f"❌ [fetch_news] Error: {e}")
        return {
            **state,
            'raw_articles':      [],
            'article_count':     0,
            'filtered_articles': [],
            'data_quality':      'sufficient',
            'retry_count':       0,
            'evaluation_result': None,
            'error':             str(e),
        }


def route_by_data_quality_node(state: NewsAnalysisState) -> NewsAnalysisState:
    """
    Node 2 (Conditional Gate): Periksa jumlah artikel.
    - Jika < 3  → data_quality = "insufficient_data" → graph berakhir di END.
    - Jika >= 3 → data_quality = "sufficient"        → lanjut ke filter_articles.
    """
    ticker        = state['ticker']
    article_count = state.get('article_count', 0)
    MIN_ARTICLES  = 3

    if article_count < MIN_ARTICLES:
        logger.warning(
            f"⚠️ [route_data_quality] {ticker}: hanya {article_count} artikel "
            f"(minimum {MIN_ARTICLES}) — flow dihentikan."
        )
        insufficient_report = (
            f"## ⚠️ Data Tidak Mencukupi — {clean_ticker(ticker)}\n\n"
            f"Hanya ditemukan **{article_count} artikel** dalam periode "
            f"{state.get('lookback_days', 30)} hari terakhir.\n"
            f"Diperlukan minimal {MIN_ARTICLES} artikel untuk analisis yang valid.\n\n"
            f"**Saran:** Coba perluas periode analisis atau periksa kembali kode ticker."
        )
        return {
            **state,
            'data_quality': 'insufficient_data',
            'final_report': insufficient_report,
        }

    logger.info(
        f"✅ [route_data_quality] {ticker}: {article_count} artikel — cukup, lanjut ke filter."
    )
    return {**state, 'data_quality': 'sufficient'}


def route_quality_edge(state: NewsAnalysisState) -> str:
    """Conditional edge setelah route_by_data_quality_node."""
    return state.get('data_quality', 'sufficient')


def filter_articles_node(state: NewsAnalysisState) -> NewsAnalysisState:
    """
    Node 3: Filter artikel yang benar-benar relevan dengan ticker.

    Dua lapis filter:
      Layer 1 — Keyword matching (cepat, gratis):
        Cek apakah title/summary mengandung kode ticker atau sinonimnya.
        Artikel yang tidak menyebut ticker sama sekali langsung dibuang.

      Layer 2 — LLM relevance scoring (hanya jika artikel > LLM_THRESHOLD):
        LLM menilai relevansi setiap artikel (skor 0–10).
        Artikel dengan skor < 5 dibuang.
    """
    ticker         = state['ticker']
    articles       = state['raw_articles']
    code           = clean_ticker(ticker)          # e.g. "BBCA"
    LLM_THRESHOLD  = 8   # jalankan LLM hanya jika lolos keyword > 8 artikel

    logger.info(f"🔍 [filter_articles] {ticker}: memulai filter {len(articles)} artikel...")

    # ── Layer 1: Keyword Matching ────────────────────────────────────────────
    # Kata kunci primer: kode saham
    # Kata kunci sekunder: nama umum perusahaan (opsional, bisa diperluas)
    primary_keywords   = [code.lower()]
    secondary_keywords = []  # contoh: ["bank central asia", "bca"]

    def is_relevant_by_keyword(article: dict) -> bool:
        text = f"{article.get('title', '')} {article.get('summary', '')}".lower()
        # Harus mengandung setidaknya satu keyword primer
        for kw in primary_keywords:
            if kw in text:
                return True
        # Atau setidaknya satu keyword sekunder (jika ada)
        for kw in secondary_keywords:
            if kw in text:
                return True
        return False

    keyword_filtered = [a for a in articles if is_relevant_by_keyword(a)]
    logger.info(
        f"🔍 [filter_articles] Layer 1 (keyword): "
        f"{len(articles)} → {len(keyword_filtered)} artikel"
    )

    # ── Layer 2: LLM Relevance Scoring ──────────────────────────────────────
    if len(keyword_filtered) > LLM_THRESHOLD:
        logger.info(
            f"🤖 [filter_articles] Layer 2 (LLM): mengevaluasi {len(keyword_filtered)} artikel..."
        )
        try:
            llm = _get_llm()

            articles_text = '\n'.join([
                f"[{i+1}] JUDUL: {a['title']} | SUMBER: {a['source']} | "
                f"RINGKASAN: {a.get('summary', '')[:200]}"
                for i, a in enumerate(keyword_filtered)
            ])

            system_prompt = (
                "Kamu adalah asisten seleksi berita saham. "
                "Nilai setiap artikel berdasarkan relevansinya dengan saham yang ditanyakan. "
                "Jawab HANYA dengan JSON valid tanpa penjelasan tambahan."
            )
            user_prompt = (
                f"Untuk saham {code} (IDX), nilai relevansi setiap artikel berikut "
                f"dengan skor 0-10 (10 = sangat relevan, 0 = tidak relevan sama sekali).\n\n"
                f"{articles_text}\n\n"
                f"Output JSON:\n"
                f"{{\"scores\": [{{\"index\": 1, \"score\": <0-10>}}, ...]}}"
            )

            response = llm.invoke([
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_prompt),
            ])
            raw = response.content.strip()

            # Strip markdown fences jika ada
            if raw.startswith('```'):
                parts = raw.split('```')
                raw = parts[1] if len(parts) > 1 else raw
                if raw.startswith('json'):
                    raw = raw[4:]

            score_data   = json.loads(raw.strip())
            score_map    = {s['index']: s['score'] for s in score_data.get('scores', [])}
            llm_filtered = [
                a for i, a in enumerate(keyword_filtered)
                if score_map.get(i + 1, 10) >= 5  # default: loloskan jika tidak ada skor
            ]
            logger.info(
                f"✅ [filter_articles] Layer 2 (LLM): "
                f"{len(keyword_filtered)} → {len(llm_filtered)} artikel"
            )
            final_filtered = llm_filtered

        except Exception as e:
            logger.warning(
                f"⚠️ [filter_articles] LLM scoring gagal, pakai hasil keyword saja: {e}"
            )
            final_filtered = keyword_filtered
    else:
        final_filtered = keyword_filtered

    # Fallback: jika filter terlalu agresif (< 2 artikel), pakai raw_articles
    if len(final_filtered) < 2 and len(articles) >= 2:
        logger.warning(
            f"⚠️ [filter_articles] Filter terlalu agresif ({len(final_filtered)} sisa), "
            f"fallback ke semua artikel."
        )
        final_filtered = articles

    logger.info(
        f"✅ [filter_articles] {ticker}: "
        f"{len(articles)} → {len(final_filtered)} artikel relevan."
    )
    return {**state, 'filtered_articles': final_filtered}


def analyze_sentiment_node(state: NewsAnalysisState) -> NewsAnalysisState:
    """Node 4: Analisis sentimen menggunakan Groq LLM (dari filtered_articles)."""
    ticker   = state['ticker']
    # Gunakan filtered_articles jika tersedia, fallback ke raw_articles
    articles = state.get('filtered_articles') or state.get('raw_articles', [])

    if not articles:
        logger.warning(f"⚠️ [analyze_sentiment] Tidak ada artikel untuk {ticker}")
        return {
            **state,
            'sentiment_data': {
                'overall_sentiment': 'NETRAL',
                'sentiment_score':   0,
                'bullish_count':     0,
                'bearish_count':     0,
                'neutral_count':     0,
                'key_topics':        [],
                'risk_factors':      [],
                'catalysts':         [],
                'confidence':        'RENDAH',
            }
        }

    logger.info(f"🧠 [analyze_sentiment] Analisis {len(articles)} artikel untuk {ticker}...")
    llm = _get_llm()

    articles_text = '\n'.join([
        f"[{i+1}] ({a['date']}) {a['title']} — {a['source']}"
        for i, a in enumerate(articles)
    ])

    system_prompt = (
        "Kamu adalah analis saham profesional. Analisis sentimen berita saham Indonesia. "
        "Jawab HANYA dalam format JSON yang valid, tanpa penjelasan tambahan di luar JSON."
    )

    user_prompt = f"""Analisis sentimen berita berikut untuk saham {clean_ticker(ticker)} (IDX):

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
        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ])
        raw = response.content.strip()

        # Strip markdown fences jika ada
        if raw.startswith('```'):
            parts = raw.split('```')
            raw = parts[1] if len(parts) > 1 else raw
            if raw.startswith('json'):
                raw = raw[4:]

        sentiment_data = json.loads(raw.strip())
        logger.info(
            f"✅ [analyze_sentiment] {ticker}: "
            f"{sentiment_data.get('overall_sentiment')} "
            f"(score: {sentiment_data.get('sentiment_score')})"
        )
        return {**state, 'sentiment_data': sentiment_data}

    except json.JSONDecodeError as e:
        logger.error(f"❌ [analyze_sentiment] JSON parse error: {e}")
        return {
            **state,
            'sentiment_data': {
                'overall_sentiment': 'NETRAL',
                'sentiment_score':   0,
                'bullish_count':     0,
                'bearish_count':     0,
                'neutral_count':     len(articles),
                'key_topics':        [],
                'risk_factors':      [],
                'catalysts':         [],
                'confidence':        'RENDAH',
                'parse_error':       str(e),
            }
        }
    except Exception as e:
        logger.error(f"❌ [analyze_sentiment] LLM error: {e}")
        return {
            **state,
            'sentiment_data': {
                'overall_sentiment': 'NETRAL',
                'sentiment_score':   0,
                'confidence':        'RENDAH',
                'error_detail':      str(e),
            },
            'error': str(e),
        }


def generate_report_node(state: NewsAnalysisState) -> NewsAnalysisState:
    """Node 5: Generate laporan analisis Bahasa Indonesia."""
    ticker        = state['ticker']
    articles      = state.get('filtered_articles') or state.get('raw_articles', [])
    sentiment     = state.get('sentiment_data') or {}
    lookback_days = state.get('lookback_days', 30)
    retry_count   = state.get('retry_count', 0)
    eval_issues   = (state.get('evaluation_result') or {}).get('issues', [])

    if retry_count > 0:
        logger.info(
            f"♻️ [generate_report] Retry ke-{retry_count} untuk {ticker} "
            f"(isu: {eval_issues})"
        )
    else:
        logger.info(f"📝 [generate_report] Menyusun laporan untuk {ticker}...")

    llm = _get_llm()

    articles_summary = '\n'.join([
        f"- [{a['date']}] {a['title']} ({a['source']})"
        for a in articles[:10]
    ])

    # Sertakan isu dari evaluasi sebelumnya jika ini adalah retry
    revision_note = ''
    if eval_issues:
        issues_str = ', '.join(eval_issues)
        revision_note = (
            f"\n\n⚠️ CATATAN REVISI (dari evaluasi sebelumnya):\n"
            f"Perbaiki masalah berikut: {issues_str}\n"
            f"Pastikan sentimen konsisten, rekomendasi tidak kontradiktif, "
            f"dan kesimpulan didukung oleh data."
        )

    user_prompt = f"""Buat laporan analisis berita saham {clean_ticker(ticker)} (IDX) dalam Bahasa Indonesia.
Periode analisis: {lookback_days} hari terakhir.{revision_note}

Data Sentimen:
{json.dumps(sentiment, ensure_ascii=False, indent=2)}

Berita Terkini (10 teratas):
{articles_summary if articles_summary else "Tidak ada berita ditemukan."}

Format laporan:
## 📊 Laporan Analisis Berita — {clean_ticker(ticker)}

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
        response = llm.invoke([HumanMessage(content=user_prompt)])
        report = response.content.strip()
        logger.info(f"✅ [generate_report] Selesai ({len(report)} karakter)")
        return {**state, 'final_report': report, 'retry_count': retry_count}
    except Exception as e:
        logger.error(f"❌ [generate_report] Error: {e}")
        return {**state, 'final_report': f"Error generating report: {e}"}


def evaluate_output_node(state: NewsAnalysisState) -> NewsAnalysisState:
    """
    Node 6: Evaluasi kualitas laporan yang dihasilkan generate_report_node.

    LLM menilai:
    - Konsistensi sentimen dengan data berita
    - Kejelasan dan kelengkapan rekomendasi
    - Tidak ada kontradiksi internal

    Jika skor < 65 dan retry_count < 2 → trigger retry ke generate_report.
    Jika skor >= 65 atau retry_count >= 2 → lanjut ke END.
    """
    ticker      = state['ticker']
    report      = state.get('final_report', '')
    sentiment   = state.get('sentiment_data') or {}
    retry_count = state.get('retry_count', 0)
    MAX_RETRY   = 2

    logger.info(
        f"🔬 [evaluate_output] Mengevaluasi laporan {ticker} "
        f"(retry_count={retry_count})..."
    )

    if not report or report.startswith('Error'):
        logger.warning(f"⚠️ [evaluate_output] Laporan kosong/error — skip evaluasi.")
        return {
            **state,
            'evaluation_result': {
                'quality_score':          0,
                'sentiment_consistent':   False,
                'recommendation_clear':   False,
                'issues':                 ['Laporan kosong atau terjadi error saat generate'],
                'verdict':                'NEEDS_REVISION',
            },
            'retry_count': retry_count + 1,
        }

    try:
        llm = _get_llm()

        # Ringkas artikel untuk konteks evaluasi
        articles      = state.get('filtered_articles') or state.get('raw_articles', [])
        article_titles = '\n'.join([
            f"- {a.get('date', 'N/A')}: {a.get('title', '')}"
            for a in articles[:10]
        ])

        system_prompt = (
            "Kamu adalah quality assurance analis laporan saham. "
            "Evaluasi laporan yang diberikan secara objektif dan kritis. "
            "Jawab HANYA dalam format JSON valid, tanpa teks di luar JSON."
        )

        user_prompt = f"""Evaluasi kualitas laporan analisis berita saham berikut untuk {clean_ticker(ticker)}.

Data sentimen yang digunakan:
{json.dumps(sentiment, ensure_ascii=False, indent=2)}

Artikel berita yang dianalisis:
{article_titles if article_titles else "(tidak ada)"}

Laporan yang dievaluasi:
{report[:3000]}{'...(dipotong)' if len(report) > 3000 else ''}

Berikan evaluasi dalam JSON:
{{
  "quality_score": <0-100>,
  "sentiment_consistent": <true/false: apakah sentimen laporan sesuai data sentimen>,
  "recommendation_clear": <true/false: apakah rekomendasi jelas dan tidak kontradiktif>,
  "issues": ["<isu spesifik jika ada, atau kosong []>"],
  "verdict": "APPROVED" | "NEEDS_REVISION"
}}

Kriteria APPROVED: quality_score >= 65, sentimen konsisten, rekomendasi jelas."""

        response = llm.invoke([
            SystemMessage(content=system_prompt),
            HumanMessage(content=user_prompt),
        ])
        raw = response.content.strip()

        # Strip markdown fences jika ada
        if raw.startswith('```'):
            parts = raw.split('```')
            raw = parts[1] if len(parts) > 1 else raw
            if raw.startswith('json'):
                raw = raw[4:]

        eval_result = json.loads(raw.strip())
        quality_score = eval_result.get('quality_score', 0)
        verdict       = eval_result.get('verdict', 'NEEDS_REVISION')

        logger.info(
            f"🔬 [evaluate_output] {ticker}: skor={quality_score}, "
            f"verdict={verdict}, retry_count={retry_count}"
        )

        # Force APPROVED jika sudah mencapai max retry
        if retry_count >= MAX_RETRY and verdict == 'NEEDS_REVISION':
            logger.warning(
                f"⚠️ [evaluate_output] Max retry ({MAX_RETRY}) tercapai — "
                f"paksa END meskipun verdict NEEDS_REVISION."
            )
            eval_result['verdict']        = 'APPROVED'
            eval_result['forced_approve'] = True

        return {
            **state,
            'evaluation_result': eval_result,
            'retry_count':       retry_count + 1,
        }

    except json.JSONDecodeError as e:
        logger.error(f"❌ [evaluate_output] JSON parse error: {e}")
        # Jika parse gagal, anggap approved agar tidak infinite loop
        return {
            **state,
            'evaluation_result': {
                'quality_score':        50,
                'sentiment_consistent': True,
                'recommendation_clear': True,
                'issues':               [f'Evaluasi gagal diparse: {e}'],
                'verdict':              'APPROVED',
            },
            'retry_count': retry_count + 1,
        }
    except Exception as e:
        logger.error(f"❌ [evaluate_output] LLM error: {e}")
        return {
            **state,
            'evaluation_result': {
                'quality_score': 50,
                'issues':        [f'Evaluasi error: {e}'],
                'verdict':       'APPROVED',  # fail-safe: jangan block flow
            },
            'retry_count': retry_count + 1,
        }


def route_evaluation_edge(state: NewsAnalysisState) -> str:
    """Conditional edge setelah evaluate_output_node."""
    result  = state.get('evaluation_result') or {}
    verdict = result.get('verdict', 'APPROVED')
    return 'end' if verdict == 'APPROVED' else 'retry'


# ─────────────────────────────────────────────────────────────────────────────
# Build LangGraph
# ─────────────────────────────────────────────────────────────────────────────

def build_news_agent():
    """
    Kompilasi LangGraph news analysis agent.

    Flow:
        fetch_news
            → route_by_data_quality  ──[insufficient_data]──→ END
            → filter_articles
            → analyze_sentiment
            → generate_report  ←────────────────────────────────┐
            → evaluate_output  ──[NEEDS_REVISION, retry < 3]────┘
            → END
    """
    graph = StateGraph(NewsAnalysisState)

    # ── Daftarkan semua node ─────────────────────────────────────────────────
    graph.add_node('fetch_news',           fetch_news_node)
    graph.add_node('route_data_quality',   route_by_data_quality_node)
    graph.add_node('filter_articles',      filter_articles_node)
    graph.add_node('analyze_sentiment',    analyze_sentiment_node)
    graph.add_node('generate_report',      generate_report_node)
    graph.add_node('evaluate_output',      evaluate_output_node)

    # ── Entry point & linear edges ───────────────────────────────────────────
    graph.set_entry_point('fetch_news')
    graph.add_edge('fetch_news',        'route_data_quality')

    # ── Conditional: sufficient vs insufficient_data ─────────────────────────
    graph.add_conditional_edges(
        'route_data_quality',
        route_quality_edge,
        {
            'sufficient':        'filter_articles',
            'insufficient_data': END,
        }
    )

    graph.add_edge('filter_articles',   'analyze_sentiment')
    graph.add_edge('analyze_sentiment', 'generate_report')
    graph.add_edge('generate_report',   'evaluate_output')

    # ── Conditional: approved / max_retry → END | retry → generate_report ────
    graph.add_conditional_edges(
        'evaluate_output',
        route_evaluation_edge,
        {
            'end':   END,
            'retry': 'generate_report',
        }
    )

    return graph.compile()


# Singleton agent — di-compile sekali saat module di-import
_news_agent = None


def _get_agent():
    global _news_agent
    if _news_agent is None:
        _news_agent = build_news_agent()
        logger.info(
            "✅ LangGraph News Agent compiled: "
            "fetch_news → route_data_quality → filter_articles → "
            "analyze_sentiment → generate_report → evaluate_output"
        )
    return _news_agent


# ─────────────────────────────────────────────────────────────────────────────
# Public API
# ─────────────────────────────────────────────────────────────────────────────

def analyze_ticker(ticker: str, lookback_days: int = 30) -> dict:
    """
    Entry point utama — jalankan LangGraph agent untuk satu ticker.

    Args:
        ticker:        Kode saham lengkap (e.g. 'BBCA.JK')
        lookback_days: Periode berita: 7, 30, atau 90 hari

    Returns:
        dict dengan keys:
            ticker, lookback_days, article_count,
            sentiment_data, final_report, raw_articles, error
    """
    # Normalisasi ticker
    if not ticker.endswith('.JK'):
        ticker = f"{ticker.upper()}.JK"

    logger.info(f"🚀 Memulai analisis: {ticker} ({lookback_days} hari)")

    initial_state: NewsAnalysisState = {
        'ticker':            ticker,
        'lookback_days':     lookback_days,
        'raw_articles':      [],
        'article_count':     0,
        'data_quality':      'sufficient',
        'filtered_articles': [],
        'sentiment_data':    None,
        'final_report':      None,
        'evaluation_result': None,
        'retry_count':       0,
        'error':             None,
    }

    agent = _get_agent()
    result = agent.invoke(initial_state)
    return result


def analyze_ticker_stream(ticker: str, lookback_days: int = 30):
    """
    Generator version of analyze_ticker.
    Yields step-by-step progress events:
    - {"status": "start", "step": "fetch_news", "message": "..."}
    - {"status": "progress", "step": "analyze_sentiment", "message": "..."}
    - {"status": "progress", "step": "generate_report", "message": "..."}
    - {"status": "complete", "result": {...}}
    """
    if not ticker.endswith('.JK'):
        ticker = f"{ticker.upper()}.JK"

    logger.info(f"🚀 Memulai analisis stream: {ticker} ({lookback_days} hari)")

    initial_state: NewsAnalysisState = {
        'ticker':        ticker,
        'lookback_days': lookback_days,
        'raw_articles':  [],
        'article_count': 0,
        'sentiment_data': None,
        'final_report':  None,
        'error':         None,
    }

    agent = _get_agent()
    
    yield {
        "status": "start",
        "step": "fetch_news",
        "message": f"Memulai analisis: {ticker} ({lookback_days} hari)"
    }

    current_state = initial_state
    try:
        # LangGraph agent.stream runs the nodes sequentially
        # and yields updates: {node_name: state_update}
        for update in agent.stream(initial_state):
            if not update:
                continue
            node_name = list(update.keys())[0]
            node_output = update[node_name]
            
            # Merge node output
            current_state = {**current_state, **node_output}

            if node_name == 'fetch_news':
                yield {
                    "status": "progress",
                    "step": "analyze_sentiment",
                    "message": f"Ditemukan {current_state.get('article_count', 0)} artikel. Menganalisis sentimen..."
                }
            elif node_name == 'analyze_sentiment':
                yield {
                    "status": "progress",
                    "step": "generate_report",
                    "message": "Analisis sentimen selesai. Menyusun laporan ringkasan..."
                }
            elif node_name == 'generate_report':
                # Final step of graph, now build response_data
                sentiment_data = current_state.get("sentiment_data") or {}
                articles_raw   = current_state.get("raw_articles") or []
                
                response_data = {
                    "status":          "success",
                    "ticker":          ticker.replace(".JK", ""),
                    "sentiment":       sentiment_data.get("overall_sentiment", "NETRAL"),
                    "sentiment_score": int(sentiment_data.get("sentiment_score", 0)),
                    "confidence":      sentiment_data.get("confidence", "RENDAH"),
                    "article_count":   current_state.get("article_count", 0),
                    "key_topics":      sentiment_data.get("key_topics", []),
                    "risk_factors":    sentiment_data.get("risk_factors", []),
                    "catalysts":       sentiment_data.get("catalysts", []),
                    "final_report":    current_state.get("final_report") or "Laporan tidak tersedia.",
                    "articles":        [
                        {
                            "title":   a.get("title", ""),
                            "link":    a.get("link", ""),
                            "source":  a.get("source", ""),
                            "date":    a.get("date", ""),
                            "summary": a.get("summary", ""),
                        }
                        for a in articles_raw[:15]
                    ],
                    "lookback_days": lookback_days,
                }
                yield {
                    "status": "complete",
                    "result": response_data
                }
    except Exception as e:
        logger.error(f"❌ [analyze_ticker_stream] Error: {e}")
        yield {
            "status": "error",
            "message": f"Gagal analisis berita: {str(e)}"
        }

