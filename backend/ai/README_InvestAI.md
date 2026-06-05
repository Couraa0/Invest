# 🚀 InvestAI: Sahabat Pintar Anda dalam Memulai Investasi Saham

## 🤔 Apa itu InvestAI?
**InvestAI** adalah platform kecerdasan buatan (AI) revolusioner yang dirancang khusus untuk menjadi "mentor pribadi" bagi **orang awam** dan pemula yang ingin terjun ke dunia investasi saham bursa Indonesia (IHSG). 

Bagi orang awam, melihat grafik saham yang naik turun, membaca laporan keuangan yang rumit, serta mencerna ratusan berita ekonomi harian adalah hal yang sangat mengintimidasi. **InvestAI hadir untuk menghilangkan ketakutan tersebut.** Kami menyederhanakan data kompleks menjadi bahasa manusia yang sangat mudah dimengerti, memandu pengguna langkah demi langkah, dan memastikan mereka tidak pernah merasa sendirian dalam mengambil keputusan investasi.

---

## 🌟 Trio AI: Tiga Otak Cerdas di Balik InvestAI
Kekuatan utama InvestAI terletak pada kolaborasi tiga teknologi AI mutakhir yang bekerja secara harmonis di balik layar:

### 1. 📈 AI Machine Learning (XGBoost Engine) — *Sang Peramal Data*
- **Fungsinya:** Mesin ini mempelajari jutaan data harga saham masa lalu (historis) dan tren pasar dari puluhan perusahaan di bursa saham Indonesia.
- **Tugasnya:** Ia bertugas menerjemahkan angka-angka rumit menjadi sinyal sederhana: **"BULLISH" (Potensi Naik / Beli)** atau **"BEARISH" (Potensi Turun / Hindari)**. AI ini juga mengukur tingkat persentase keyakinannya (misalnya: *Confidence Level 85%*), serta memberikan saran angka pasti untuk **Batas Risiko (Stop Loss)** dan **Target Keuntungan (Take Profit)** agar pemula tahu persis kapan harus keluar dari pasar dengan aman.

### 2. 🤖 Gen AI Chatbot (AI Mentor) — *Sang Guru Pribadi*
- **Fungsinya:** Chatbot interaktif berbasis Generative AI (Large Language Model) yang bisa diajak mengobrol layaknya manusia sungguhan.
- **Tugasnya:** Jika pemula merasa bingung dengan suatu istilah atau butuh saran khusus, mereka bisa bertanya langsung ke AI Mentor. Pengguna bisa bertanya, *"Apa maksudnya batas risiko?"* atau *"Jelaskan saham BBCA seperti menjelaskan ke anak SMA."* AI akan menjawab dengan sabar, ramah, dan tanpa jargon teknis yang memusingkan.

### 3. 📰 AI Agent (LangGraph News Agent) — *Sang Analis Berita*
- **Fungsinya:** Agen kecerdasan buatan otonom yang bertugas menyusuri internet untuk membaca dan merangkum berita-berita finansial terbaru secara *real-time*.
- **Tugasnya:** Daripada pengguna harus membuang waktu membaca belasan artikel panjang, Agen AI ini yang akan melakukannya. Dalam hitungan detik, ia akan mengeluarkan laporan ringkas yang berisi: sentimen berita secara keseluruhan (Positif/Negatif), faktor pendorong harga saham (*Catalysts*), dan risiko utama (*Risk Factors*) dalam bentuk poin-poin singkat yang bisa dibaca kurang dari 1 menit.

---

## 🛠️ Bagaimana Cara Orang Awam Menggunakan InvestAI?

Pengalaman pengguna (*User Experience*) di InvestAI dirancang khusus untuk memanjakan pemula. Semua alurnya terasa seperti dipandu oleh seorang ahli:

**Langkah 1: Eksplorasi (Melihat Sinyal)**
- Saat masuk ke halaman **AI Signals**, pengguna tidak akan disambut oleh grafik lilin (*candlestick*) merah-hijau yang membuat pusing.
- Mereka akan melihat kartu-kartu saham yang bersih, dikelompokkan berdasarkan sektor industri (seperti Perbankan atau Teknologi).
- Di setiap kartu, pengguna bisa langsung melihat apakah AI menyarankan saham tersebut kuat atau tidak.

**Langkah 2: Analisis Mendalam yang "Manusiawi"**
- Jika pengguna tertarik pada satu saham, mereka mengklik tombol **"Analisis dengan AI"**.
- Layar detail akan terbuka dan menampilkan **Ringkasan XGBoost AI**. Alih-alih rumus matematika, pengguna akan membaca kalimat naratif: *"Harga saat ini berada di atas rata-rata (Aman), probabilitas naik lebih besar dari turun."*
- Pengguna langsung diberikan pedoman angka pasti untuk membatasi kerugian.

**Langkah 3: Memvalidasi Keputusan dengan Berita**
- Walaupun hitungan angka (teknikal) bagus, pengguna disarankan mengecek kondisi perusahaan di dunia nyata. Mereka cukup menekan tombol **"Analisis Berita AI"**.
- AI Agent akan bekerja dan memunculkan laporan bahwa *"Berita minggu ini positif, karena perusahaan baru saja mencetak rekor laba tinggi."* Hal ini memberikan rasa aman dan validasi ganda (dari sisi angka dan cerita/berita) kepada pengguna.

**Langkah 4: Bertanya pada Mentor**
- Sebelum pengguna memutuskan untuk benar-benar membeli saham melalui aplikasi broker/sekuritas mereka, pengguna menekan tombol **"Tanya AI Mentor"**.
- Mereka bisa mendiskusikan *action plan* mereka: *"Saya mau beli saham ini dengan modal 1 juta, apakah aman?"* Mentor akan memberikan pandangan objektif dan mengingatkan tentang diversifikasi (jangan taruh semua uang di satu tempat).

---

## 💻 Teknologi di Balik Layar (*Tech Stack*)
InvestAI dibangun menggunakan arsitektur modern yang memisahkan bagian depan (*frontend*) dan belakang (*backend*) untuk memastikan performa yang cepat, aman, dan *scalable*:

- **☁️ Cloud & Database (Microsoft Azure)**
  - **Azure SQL Database:** Semua data pengguna, portofolio, dan histori percakapan disimpan dengan aman menggunakan infrastruktur *enterprise-grade* dari Microsoft Azure. Pemilihan Azure memastikan data pengguna terenkripsi dan selalu tersedia 24/7.
  
- **🧠 Artificial Intelligence (Trio AI)**
  - **XGBoost (Python):** Model *Machine Learning* yang terbukti tangguh untuk menangani data berstruktur (seperti harga saham historis) untuk melakukan prediksi teknikal.
  - **LangGraph & LangChain:** Kerangka kerja (*framework*) mutakhir untuk merangkai alur kerja Agen AI. Digunakan khusus pada agen Analisis Berita untuk menciptakan *flow*: *Scrape* ➜ Analisis Sentimen ➜ *Generate* Laporan.
  - **Groq API (Llama 3 70B):** *Large Language Model* kelas berat yang berjalan di atas perangkat keras super cepat Groq (LPU), memungkinkan AI membalas *chat* dan merangkum berita nyaris tanpa *delay*.

- **⚙️ Backend (Node.js & FastAPI)**
  - **Node.js (Express):** Menangani otentikasi pengguna, rute dasar, dan komunikasi langsung dengan Azure SQL.
  - **FastAPI (Python):** Khusus menangani beban komputasi berat untuk prediksi *Machine Learning* dan agen AI LangGraph.

- **🎨 Frontend (React & Vite)**
  - Dibangun dengan **React.js** dan dibungkus oleh **Vite** untuk *loading* yang secepat kilat.
  - Tampilan (UI) dirancang menggunakan **Tailwind CSS** dipadukan dengan **Framer Motion** untuk menghadirkan animasi interaktif yang membuat aplikasi terasa premium, hidup, dan memanjakan mata pengguna awam.

---

## 🎯 Mengapa InvestAI Berbeda?
Banyak aplikasi trading di luar sana (seperti RTI Business atau platform sekuritas) dibuat untuk orang yang **sudah mengerti** saham. Aplikasi tersebut membanjiri pengguna awam dengan tabel angka yang berkedip cepat dan istilah bahasa Inggris yang membingungkan.

Sebaliknya, **InvestAI bertindak sebagai penerjemah (*translator*) sekaligus filter pelindung.** 
Kami menyedot seluruh kerumitan data kuantitatif (angka teknikal) dan kualitatif (narasi berita), mengunyahnya di dalam Trio AI, dan hanya menyajikan sari pati informasinya: **Keputusan apa yang harus diambil, bagaimana membatasi risikonya, dan alasan logis di baliknya.** 

InvestAI bukan sekadar aplikasi sinyal saham; ini adalah **ekosistem edukasi finansial masa depan** yang merangkul setiap pemula agar bisa berinvestasi dengan tenang, cerdas, dan percaya diri.
