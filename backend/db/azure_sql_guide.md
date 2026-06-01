# Panduan Menggunakan Azure SQL Database 🚀

Panduan ini akan membantu Anda mengonfigurasi, menghubungkan, dan menjalankan skema database `azure_schema.sql` ke dalam **Azure SQL Database** untuk proyek InvestAI.

---

## 🛠️ Tahap 1: Membuat Database di Portal Azure

1. Buka [Portal Azure](https://portal.azure.com/) dan masuk menggunakan akun Microsoft/Azure Anda.
2. Di bilah pencarian atas, ketik **"SQL Databases"** dan pilih layanan tersebut.
3. Klik tombol **"+ Create"** (Buat).
4. **Basic Settings**:
   - **Subscription**: Pilih langganan Anda (contoh: *Azure for Students* atau *Pay-As-You-Go*).
   - **Resource Group**: Klik *Create new* dan beri nama (misal: `InvestAI-RG`).
   - **Database Name**: Masukkan nama database (misal: `investai-db`).
   - **Server**: Klik *Create new*.
     - Beri nama server (misal: `investai-server-123`). Harus unik.
     - **Location**: Pilih lokasi terdekat (contoh: *Southeast Asia* / Singapura).
     - **Authentication**: Pilih **Use SQL authentication**. Masukkan *Server admin login* (misal: `investadmin`) dan *Password* yang kuat. Simpan kredensial ini baik-baik!
5. **Compute + Storage**: 
   - Klik *Configure database*.
   - Untuk pengembangan awal, sangat disarankan memilih tier **Basic (2 DTUs)** atau **Serverless** agar biaya sangat murah/gratis.
6. Klik **Review + create**, lalu **Create**. Tunggu beberapa menit hingga proses *deployment* selesai.

---

## 🔓 Tahap 2: Mengizinkan Akses Jaringan (Networking & Firewall)

Agar komputer Anda (dan *backend* Anda) bisa mengakses database ini, Anda harus mengizinkan akses jaringan publik dan membuka blokir *firewall*-nya.

1. Buka halaman resource **SQL Database** yang baru saja dibuat di Portal Azure.
2. Di menu sebelah kiri, di bawah bagian **Security**, pilih **Networking**.
3. Pada tab **Public access**, pastikan opsi **Public network access** diatur ke **Selected networks** (JANGAN pilih "Disable").
4. Di bagian *Firewall rules* yang muncul di bawahnya, klik tulisan **+ Add your client IPv4 address** (ini otomatis memasukkan IP internet komputer Anda saat ini).
5. Centang juga kotak **"Allow Azure services and resources to access this server"** (Penting agar *Query Editor* Azure bisa terbuka).
6. Klik tombol **Save** di kiri bawah. Tunggu notifikasi penyimpanan berhasil.

---

## ⚡ Tahap 3: Menjalankan Skema SQL

Sekarang Anda perlu menjalankan *file* `azure_schema.sql` untuk membuat tabel-tabelnya. Cara paling praktis tanpa perlu mengunduh aplikasi tambahan adalah menggunakan **Query Editor** bawaan Azure:

1. Buka halaman resource **SQL Database** Anda di Portal Azure.
2. Di panel menu kiri, cari dan klik **Query editor (preview)**.
3. Masukkan *Login ID* (contoh: `investadmin`) dan *Password* yang Anda buat di Tahap 1, lalu klik **OK**.
4. Buka *file* `azure_schema.sql` di VS Code proyek Anda (`backend/db/azure_schema.sql`). Blok seluruh isinya dan **Copy** (Ctrl+C).
5. Kembali ke jendela *Query editor* di Azure, **Paste** (Ctrl+V) seluruh kode SQL tersebut ke area teks yang kosong.
6. Klik tombol **▶ Run** di bagian atas.
7. Jika berhasil, Anda akan melihat pesan *"Query succeeded"*, dan semua tabel (Users, Portfolios, Mentorship_Sessions, dll) akan muncul di folder **Tables** di bilah kiri.

> [!TIP]
> Anda juga bisa menggunakan aplikasi pihak ketiga di komputer Anda seperti **Azure Data Studio** atau **DBeaver** untuk melakukan ini. Anda cukup membuat koneksi baru dengan memasukkan nama Server, Username, dan Password.

---

## 🔗 Tahap 4: Menghubungkan Backend (FastAPI / Python) ke Azure SQL

Langkah terakhir adalah menyambungkan API Anda agar bisa membaca/menulis ke tabel tersebut.

### 1. Dapatkan *Connection String*
1. Di halaman **SQL Database** Anda di Azure, klik menu **Connection strings** di sebelah kiri.
2. Salin teks yang ada di tab **ADO.NET** (atau **ODBC** jika menggunakan `pyodbc` murni). Formatnya kira-kira seperti ini:
   ```text
   Server=tcp:investai-server-123.database.windows.net,1433;Initial Catalog=investai-db;Persist Security Info=False;User ID=investadmin;Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
   ```
3. Ganti `{your_password}` dengan password asli Anda.

### 2. Pasang di file `.env` Backend
Buka/buat file `.env` di folder `backend/ai/` Anda dan simpan *string* koneksi tersebut (sesuaikan formatnya sesuai ORM/driver Python yang Anda gunakan).

**Contoh jika menggunakan SQLAlchemy dengan `pyodbc`:**
```ini
# .env
AZURE_SQL_URL="mssql+pyodbc://investadmin:PasswordAnda@investai-server-123.database.windows.net:1433/investai-db?driver=ODBC+Driver+18+for+SQL+Server"
```

> [!IMPORTANT]
> Pastikan Anda sudah menginstal *driver* database di backend Python Anda:
> `pip install pyodbc sqlalchemy`
> 
> (Dan pastikan juga *Microsoft ODBC Driver 18 for SQL Server* terinstal di sistem operasi Anda atau di dalam `Dockerfile` backend Anda).
