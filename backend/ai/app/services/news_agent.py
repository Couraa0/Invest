# -*- coding: utf-8 -*-
"""
InvestAI — LangGraph News Scraping & Analysis Agent
Clean Python module (refactored from Colab notebook)

Flow: fetch_news → analyze_sentiment → generate_report → END

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
    ticker:         str             # input: e.g. 'BBCA.JK'
    lookback_days:  int             # input: 7 | 30 | 90
    raw_articles:   list            # output node 1
    article_count:  int
    sentiment_data: Optional[dict]  # output node 2
    final_report:   Optional[str]   # output node 3
    error:          Optional[str]


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
            'raw_articles':  articles,
            'article_count': len(articles),
            'error':         None,
        }
    except Exception as e:
        logger.error(f"❌ [fetch_news] Error: {e}")
        return {**state, 'raw_articles': [], 'article_count': 0, 'error': str(e)}


def analyze_sentiment_node(state: NewsAnalysisState) -> NewsAnalysisState:
    """Node 2: Analisis sentimen menggunakan Groq LLM."""
    ticker   = state['ticker']
    articles = state['raw_articles']

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
    """Node 3: Generate laporan analisis Bahasa Indonesia."""
    ticker        = state['ticker']
    articles      = state['raw_articles']
    sentiment     = state.get('sentiment_data') or {}
    lookback_days = state.get('lookback_days', 30)
    logger.info(f"📝 [generate_report] Menyusun laporan untuk {ticker}...")

    llm = _get_llm()

    articles_summary = '\n'.join([
        f"- [{a['date']}] {a['title']} ({a['source']})"
        for a in articles[:10]
    ])

    user_prompt = f"""Buat laporan analisis berita saham {clean_ticker(ticker)} (IDX) dalam Bahasa Indonesia.
Periode analisis: {lookback_days} hari terakhir.

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
        return {**state, 'final_report': report}
    except Exception as e:
        logger.error(f"❌ [generate_report] Error: {e}")
        return {**state, 'final_report': f"Error generating report: {e}"}


# ─────────────────────────────────────────────────────────────────────────────
# Build LangGraph
# ─────────────────────────────────────────────────────────────────────────────

def build_news_agent():
    """
    Kompilasi LangGraph news analysis agent.
    Flow: fetch_news → analyze_sentiment → generate_report → END
    """
    graph = StateGraph(NewsAnalysisState)

    graph.add_node('fetch_news',        fetch_news_node)
    graph.add_node('analyze_sentiment', analyze_sentiment_node)
    graph.add_node('generate_report',   generate_report_node)

    graph.set_entry_point('fetch_news')
    graph.add_edge('fetch_news',        'analyze_sentiment')
    graph.add_edge('analyze_sentiment', 'generate_report')
    graph.add_edge('generate_report',   END)

    return graph.compile()


# Singleton agent — di-compile sekali saat module di-import
_news_agent = None


def _get_agent():
    global _news_agent
    if _news_agent is None:
        _news_agent = build_news_agent()
        logger.info("✅ LangGraph News Agent compiled: fetch_news → analyze_sentiment → generate_report")
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
        'ticker':        ticker,
        'lookback_days': lookback_days,
        'raw_articles':  [],
        'article_count': 0,
        'sentiment_data': None,
        'final_report':  None,
        'error':         None,
    }

    agent = _get_agent()
    result = agent.invoke(initial_state)
    return result
