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

