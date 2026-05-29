# InvestAI - Platform Edukasi Simulasi Saham

InvestAI adalah platform pembelajaran dan paper trading (simulasi saham) komprehensif yang dirancang untuk membantu pemula dan investor tingkat menengah menguasai pasar modal tanpa risiko finansial nyata. 

Aplikasi ini menggunakan teknologi AI modern untuk menganalisis dan memandu Anda dalam keputusan investasi.

## 🏗️ Struktur Proyek

Proyek ini memiliki arsitektur *microservices* lokal yang terdiri dari tiga bagian utama:

1. **Frontend (React + Vite)**: Berada di *root folder* proyek. Menangani antarmuka pengguna, navigasi, dan visualisasi data.
2. **Backend Utama (Express.js)**: Berada di folder `backend/`. Menangani autentikasi, database utama, pengguna, dan interaksi reguler.
3. **Backend AI (FastAPI Python)**: Berada di folder `backend/ai/`. Menangani servis *machine learning*, prediksi sinyal AI, dan pemrosesan data berat.

---

## 🚀 Panduan Setup & Instalasi

### Prasyarat (Prerequisites)
Pastikan sistem Anda sudah memiliki:
- **Node.js** (Versi 18 atau ke atas)
- **Python** (Versi 3.8 atau ke atas, dengan PIP terinstal dan sudah masuk PATH Windows)

### Langkah 1: Setup Frontend (Root)
Buka terminal di root direktori proyek (`Invest/`) dan jalankan:
```bash
npm install
```

### Langkah 2: Setup Backend Express
Buka terminal baru, navigasikan ke folder `backend`, lalu jalankan instalasi:
```bash
cd backend
npm install
```

### Langkah 3: Setup Backend AI (Python)
Buka terminal baru, navigasikan ke folder `backend/ai`, dan buat *Virtual Environment*:
```bash
cd backend/ai

# Buat virtual environment bernama 'venv'
py -m venv venv

# Aktifkan virtual environment
.\venv\Scripts\activate

# Install semua requirements (FastAPI, Pandas, Scikit-Learn, dll)
py -m pip install -r requirements.txt
```
*(Catatan: Jika `py` tidak dikenali, Anda bisa mencoba menggunakan `python` atau `python3`)*

---

## 🏃‍♂️ Cara Menjalankan Aplikasi

Untuk menjalankan seluruh platform, Anda harus menjalankan sisi **Frontend** dan kedua sisi **Backend**. 

### 1. Menjalankan Frontend
Di terminal utama (berada di root folder `Invest/`), jalankan:
```bash
npm run dev
```
Ini akan membuka aplikasi web di browser Anda (biasanya di `http://localhost:3000`).

### 2. Menjalankan Kedua Backend Sekaligus (Automatis)
Kami telah menyediakan *script* automasi untuk mempermudah. Buka terminal baru dan jalankan:
```bash
cd backend
.\start-backends.bat
```
Script tersebut otomatis akan memicu dua *window terminal* baru:
- Terminal 1: Backend Express di **Port 5000**.
- Terminal 2: Backend AI FastAPI di **Port 8000**.

> **Pro Tip**: Jika ingin menjalankan secara manual, jalankan `npm run dev` di folder `backend`, dan jalankan `uvicorn app.main:app --reload --port 8000` di dalam folder `backend/ai` (pastikan venv sudah aktif).

---

## 🔑 Environment Variables
Jika menggunakan *API keys* untuk servis eksternal, pastikan untuk mendefinisikannya:
- Untuk Frontend: Gunakan `.env.local` di *root*.
- Untuk Backend: Gunakan `.env` di dalam folder `backend/`.
- Untuk AI (Python FastAPI): 
  1. Masuk ke folder `backend/ai/`.
  2. Salin file template `.env.example` menjadi `.env`:
     ```bash
     copy .env.example .env
     ```
  3. Buka file `.env` baru tersebut, lalu isi `GROQ_API_KEY` Anda dengan API Key dari [Groq Console](https://console.groq.com/keys) (gratis).

---

## 🧠 Cara Kerja Sistem Prediksi AI (XGBoost Engine)

InvestAI menggunakan **Machine Learning** untuk memprediksi pergerakan harga saham di Bursa Efek Indonesia (IDX). Berikut adalah gambaran singkat alur pemrosesan datanya:

### 🍳 Analogi Pemrosesan
1. **Bahan Mentah (Raw Data):** Data harga historis (Open, High, Low, Close, Volume) ditarik dari Yahoo Finance.
2. **Bumbu Dapur (Features):** Dihitung **35 indikator teknikal** (RSI, MACD, Bollinger Bands, ATR, Volatility, dll.).
3. **Koki Pintar (Model):** Algoritma **XGBoost** (`xgb_model.pkl`) mencicipi indikator tersebut untuk memprediksi arah harga saham.
4. **Sajian Akhir (Output):** Menghasilkan rekomendasi **BUY/SELL**, target **Take Profit/Stop Loss**, dan **Confidence Score**.

### 🔄 Alur Kerja Real-Time (Inference)
Saat frontend meminta data prediksi untuk satu saham (misalnya `BBCA`):
1. **FastAPI** (`backend/ai/app/services/prediction_service.py`) menarik data terbaru via `yfinance`.
2. Sistem memproses **35 indikator teknikal** pada data tersebut secara real-time.
3. Data hasil kalkulasi dimasukkan ke model `xgb_model.pkl` yang sudah di-load di memori server.
4. Prediksi dan skor keyakinan dikirim kembali ke **React Frontend** dalam format **JSON** untuk dirender menjadi visualisasi grafik yang interaktif.

---

## 🛠️ Fitur & Modul AI yang Dikembangkan

Platform InvestAI telah ditingkatkan secara signifikan dengan integrasi model prediksi canggih berbasis Machine Learning. Berikut adalah rincian fungsionalitas yang dikembangkan:

### 1. 📈 Prediksi Sinyal Multi-Saham (90+ Ticker IDX)
Model ML kini mendukung pemantauan dan prediksi real-time untuk **90+ saham blue-chip dan likuid di Bursa Efek Indonesia (IDX)**. Saham-saham ini dikelompokkan secara terstruktur ke dalam berbagai sektor:
* **Perbankan & Keuangan:** BBCA, BMRI, BBNI, BBRI, BRIS, BTPS, ARTO, dll.
* **Energi & Pertambangan:** ADRO, PTBA, ITMG, BUMI, MDKA, ANTM, INCO, MEDC, PGAS, dll.
* **Consumer Goods & Retail:** UNVR, INDF, ICBP, KLBF, CPIN, MYOR, SIDO, ACES, MAPI, dll.
* **Telekomunikasi & Teknologi:** TLKM, EXCL, ISAT, GOTO, BUKA, EMTK, TOWR, dll.
* **Industri & Manufaktur:** ASII, UNTR, SMGR, INTP, AKRA, CTRA, dll.
* **Properti, Infrastruktur, Agribisnis, Media, & Logistik** lainnya.

### 2. 🤖 Engine Prediksi XGBoost (`xgb_model.pkl`)
* Mengganti model placeholder sederhana dengan **XGBoost Classifier Model** (`xgb_model.pkl`, kapasitas 681KB) yang telah terlatih menggunakan data historis bursa Indonesia.
* Memprediksi arah pergerakan harga saham berikutnya (NAIK/TURUN) lengkap dengan **Confidence Score (%)** serta target **Take Profit (TP)** dan **Stop Loss (SL)** otomatis.
* Menggunakan fitur scaling berbasis `StandardScaler` dan penanganan data kosong defensif menggunakan `SimpleImputer`.

### 3. 🧪 Feature Engineering Komprehensif (35 Indikator)
Kalkulasi dinamis secara real-time dari data OHLCV ditarik dari Yahoo Finance untuk menghasilkan 35 fitur teknikal:
* **Momentum & Returns:** Momentum harian multi-timeframe (3d, 5d, 10d, 20d) dan Lag Returns.
* **Oscillators:** RSI (7d & 14d), RSI Divergence, dan RSI Slope.
* **Trend Indicators:** MACD Line, Signal Line, MACD Histogram, dan MACD Slope.
* **Volatility & Bands:** ATR (Average True Range), ATR Percentage, Volatility Regime, dan Bollinger Bands (Upper, Lower, Width, Percent).
* **Volume Analysis:** Volume Z-score, Volume Ratio, OBV (On-Balance Volume) Trend, dan Volume-Price Divergence.
* **Mean Reversion:** Jarak harga dari SMA (10d, 20d, 50d), Z-score 20d, serta jarak dari 52-week High & Low.
* **Candlestick Patterns:** Body Ratio, Upper Wick, dan Lower Wick.

### 4. 🌦️ Penanganan Hari Libur & Akhir Pekan (Volume-Filtering)
* Sistem secara cerdas menyaring data perdagangan dengan volume nol (`Volume > 0`) untuk mengeliminasi baris kosong/placeholder saat bursa tutup atau libur nasional (seperti Idul Adha).
* Menghindari masalah visualisasi **"0.00% Change"** stagnan, sehingga grafik dan indikator persentase naik/turun di Dashboard dan Signals tetap merefleksikan harga dan persentase perubahan dari **hari perdagangan aktif terakhir** yang valid.

### 5. 📊 Indikator Sentimen Pasar Real-Time (IHSG Dashboard)
* Menghitung persentase pasar yang sedang *Bullish* secara dinamis menggunakan **10 saham penggerak indeks utama (blue chips)** yang mewakili seluruh sektor penting.
* Memanfaatkan multi-threading (**`ThreadPoolExecutor`**) di backend Python untuk memproses prediksi ke-10 saham secara paralel dalam waktu kurang dari 2 detik demi menjaga responsivitas server.
* Hasil sentimen diumpankan langsung ke diagram mini dan indikator persentase sentimen di halaman utama Dashboard.

### 💬 6. Mentorship Chat AI
* Sistem chat mentorship interaktif di halaman `/mentorship` terintegrasi langsung dengan **Groq Cloud API** menggunakan model **Llama 3.1 8B Instant** untuk memberikan konsultasi finansial terpandu berdasarkan profil risiko pengguna (Pemula, Menengah, Berpengalaman).


