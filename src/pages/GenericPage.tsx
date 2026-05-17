import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Footer from '../components/Footer';

const pageContents: Record<string, React.ReactNode> = {
  "Tentang Kami": (
    <>
      <p>InvestAI didirikan dengan satu misi sederhana: mendemokratisasi edukasi finansial di Indonesia melalui teknologi kecerdasan buatan. Kami menyadari bahwa literasi keuangan yang rendah seringkali menjadi hambatan utama bagi masyarakat untuk mencapai kemerdekaan finansial.</p>
      <p>Dengan menggabungkan analisis data mutakhir dan kurikulum edukasi yang komprehensif, kami bertujuan untuk membekali setiap individu dengan pengetahuan dan alat simulasi yang bebas risiko.</p>
      <h3 className="text-2xl font-bold text-primary mt-8 mb-4">Visi Kami</h3>
      <p>Menjadi ekosistem edukasi investasi saham nomor satu di Asia Tenggara yang paling diandalkan oleh para investor ritel.</p>
    </>
  ),
  "Karir": (
    <>
      <p>Bergabunglah bersama kami di InvestAI dan jadilah bagian dari revolusi edukasi finansial. Kami selalu mencari talenta-talenta cemerlang yang bersemangat tentang teknologi, edukasi, dan pasar modal.</p>
      <h3 className="text-2xl font-bold text-primary mt-8 mb-4">Posisi yang Tersedia saat ini:</h3>
      <ul className="list-disc pl-5 space-y-2">
        <li><strong>Senior Frontend Engineer</strong> (Remote) - Fokus pada pengembangan antarmuka simulasi investasi.</li>
        <li><strong>AI Research Scientist</strong> (Jakarta) - Mengembangkan model prediktif untuk asisten AI kami.</li>
        <li><strong>Financial Content Writer</strong> (Remote) - Membuat modul edukasi yang mudah dipahami oleh pemula.</li>
      </ul>
      <p className="mt-6">Silakan kirimkan CV Anda ke <a href="mailto:karir@investai.example.com" className="text-secondary font-bold hover:underline">karir@investai.example.com</a>.</p>
    </>
  ),
  "Kontak": (
    <>
      <p>Kami sangat senang mendengar saran, masukan, maupun pertanyaan dari Anda. Tim dukungan pelanggan kami beroperasi setiap hari kerja, Senin hingga Jumat, dari pukul 09:00 hingga 17:00 WIB.</p>
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 mt-6 space-y-2">
        <p><strong>Email:</strong> support@investai.example.com</p>
        <p><strong>Telepon:</strong> +62 21 1234 5678</p>
        <p><strong>Alamat:</strong> Gedung InvestAI, Menara Sudirman Lt. 12, Jakarta Selatan, 12190.</p>
      </div>
      <p className="mt-6">Atau Anda bisa langsung menggunakan layanan asisten AI kami yang ada di dalam <em>dashboard</em> untuk respon 24/7.</p>
    </>
  ),
  "Kebijakan Privasi": (
    <>
      <p>Privasi Anda sangat penting bagi kami. Kebijakan ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda saat menggunakan platform edukasi InvestAI.</p>
      <h3 className="text-2xl font-bold text-primary mt-8 mb-4">1. Pengumpulan Data</h3>
      <p>Kami mengumpulkan data nama, alamat email, dan preferensi investasi (tingkat pemahaman) saat Anda mendaftar. Data ini digunakan untuk memberikan rekomendasi materi yang paling sesuai.</p>
      <h3 className="text-2xl font-bold text-primary mt-6 mb-4">2. Keamanan Data</h3>
      <p>Seluruh transmisi data dienkripsi menggunakan protokol keamanan standar industri (SSL/TLS). Kami tidak membagikan, menjual, atau menyewakan data pengguna kami kepada pihak ketiga untuk tujuan pemasaran tanpa izin eksplisit Anda.</p>
    </>
  ),
  "Edukasi Risiko": (
    <>
      <p>Sangat penting untuk dipahami bahwa berinvestasi di pasar modal selalu melibatkan tingkat risiko tertentu, termasuk potensi hilangnya sebagian atau seluruh modal yang diinvestasikan.</p>
      <h3 className="text-2xl font-bold text-primary mt-8 mb-4">Bukan Nasihat Finansial</h3>
      <p>InvestAI adalah murni platform edukasi. Semua sinyal, analisis AI, dan data harga yang disajikan di sini adalah untuk tujuan pembelajaran dan simulasi (Paper Trading). Kami <strong>TIDAK</strong> memberikan nasihat keuangan, investasi, atau perdagangan yang dipersonalisasi.</p>
      <p>Anda bertanggung jawab penuh atas keputusan investasi nyata yang Anda buat di luar platform kami menggunakan uang sungguhan di sekuritas/broker pilihan Anda.</p>
    </>
  ),
  "Syarat & Ketentuan": (
    <>
      <p>Dengan mengakses atau menggunakan platform edukasi InvestAI, Anda setuju untuk terikat dengan Syarat dan Ketentuan berikut.</p>
      <h3 className="text-2xl font-bold text-primary mt-8 mb-4">Penggunaan Platform</h3>
      <p>Anda setuju untuk menggunakan layanan kami secara bertanggung jawab dan hanya untuk tujuan pembelajaran investasi yang sah. Pengguna dilarang keras menggunakan program <em>bot</em> otomatis atau melakukan pengikisan data (<em>scraping</em>) pada sistem AI dan harga pasar kami tanpa izin.</p>
      <h3 className="text-2xl font-bold text-primary mt-6 mb-4">Simulasi Virtual</h3>
      <p>Saldo senilai "Rp 100 Juta" pada fitur <em>Paper Trading</em> sepenuhnya merupakan mata uang virtual fiktif tanpa nilai tunai di dunia nyata, dan tidak dapat ditarik, dipindahkan, atau ditukar dalam bentuk apa pun.</p>
    </>
  )
};

export default function GenericPage({ title }: { title: string }) {
  const content = pageContents[title] || (
    <p>Konten untuk halaman ini sedang dalam tahap penyusunan. Silakan kembali lagi nanti.</p>
  );

  return (
    <div className="bg-white min-h-screen overflow-x-hidden flex flex-col">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100/80 px-6 h-16 transition-all duration-300">
        <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-md shadow-primary/25 group-hover:scale-105 transition-transform overflow-hidden">
              <img src="/logo.svg" alt="Logo" className="w-5 h-5 brightness-0 invert" />
            </div>
            <span className="text-lg font-bold text-primary tracking-tight">InvestAI</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link to="/features" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Fitur</Link>
            <Link to="/academy" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Academy</Link>
            <Link to="/pricing" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Harga</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors px-3 py-2 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </Link>
            <Link
              to="/login"
              className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 active:scale-[0.97] transition-all"
            >
              Mulai Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 pt-32 pb-24 px-6 max-w-3xl mx-auto w-full">
        <h1 className="text-4xl lg:text-5xl font-bold text-primary mb-10 tracking-tight">{title}</h1>
        <div className="prose prose-slate prose-p:text-slate-600 prose-p:leading-relaxed max-w-none text-base">
          {content}
        </div>
      </div>

      <Footer />
    </div>
  );
}
