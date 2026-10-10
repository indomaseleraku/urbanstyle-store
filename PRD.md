---
title: "PRD: urbanstyle-store"
date: 2026-10-10
tags: [prd, website, urbanstyle-store, lifewear, ecommerce, sim]
project_slug: urbanstyle-store
status: Production-Synchronized (V6.0 Flagship Evolution)
folder: c:\project\websites\urbanstyle-store
---

# 📜 PRODUCT REQUIREMENT DOCUMENT (PRD) V6.0
# UrbanStyle Store — Flagship LifeWear E-Commerce Engine & Autonomous Payment Core

**Proyek:** UrbanStyle Store (Codename: *Kuro-Commerce Engine*)  
**Pemilik Proyek:** Kimy Eka Ardiansyah (Teknik Informatika, Universitas Pamulang)  
**Dokumen:** `PRD.md` (Master Product Requirement Document)  
**Target Milestone:** Ujian Akhir Semester (UAS), Publikasi Jurnal Komputer JIUP, & Komersialisasi White-Label Distro Fashion Lokal  
**Status:** Approved & Production-Aligned (V6.0 Flagship Evolution)  

---

## 1. 🎯 Visi Produk & Ringkasan Eksekutif

**UrbanStyle Store** adalah platform e-commerce retail fashion modern kelas industri yang menggabungkan estetika **Japanese Industrial Minimalism** (*Uniqlo LifeWear — Simple Made Better*) dengan keandalan sistem berskala enterprise:

1. **Digital Editorial Flagship Experience:** Menghadirkan ritme visual majalah gaya hidup, edukasi kenyamanan teknologi tekstil (AIRism, Heavyweight Cotton, Double-Brushed Flannel), katalog kurasi dewasa (Pria, Wanita, Unisex), dan ergonomi sentuhan satu jempol (*mobile thumb zone*).
2. **In-House Zero-Fee Payment Engine:** Pemrosesan pembayaran transfer bank mandiri berbasis kode unik 3 digit acak dan generator QRIS Dinamis standar **EMVCo & CRC-16** mandiri (0% potongan fee pihak ketiga, 100% dana langsung masuk ke rekening/dompet merchant).
3. **Autonomous Mobile Notification Gateway (PaymentGatewayin):** Aplikasi native Android khusus listener notifikasi perbankan & e-wallet merchant (GoBiz, BRImo, DANA, ShopeePay, Bank Jago, SeaBank) yang secara otonom mendeteksi mutasi dan menembak webhook ke server cloud (`/api/webhooks/payment`) untuk melunaskan pesanan detik itu juga tanpa perlu MacroDroid atau timer simulasi palsu.
4. **Autonomous WhatsApp CRM Bot (@whiskeysockets/baileys):** Microservice perpesanan transaksional mandiri pada port 3001 yang mengirimkan invoice tagihan otomatis, notifikasi pelunasan seketika, dan pelacakan nomor resi langsung ke WhatsApp pembeli secara non-blocking.
5. **Pemisahan Pintu Autentikasi & Multi-Role RBAC:** Isolasi 100% antara portal pelanggan publik (`/login`) dan portal staf internal (`/admin/login`), dilengkapi modul penambahan karyawan bertingkat (Owner, Staf Gudang, Staf Kasir) berproteksi session token HMAC.
6. **SKU-Level Granular Inventory & Flexible Restock Control:** Kendali stok multi-varian anti-overselling pada tingkat kombinasi warna dan ukuran secara relasional, didukung tombol jalan pintas cepat `[+1], [+5], [+10], [+50]`.
7. **Sistem Pengambilan Keputusan (DSS) Pareto:** Analitik **Decision Support System (DSS)** berbasis distribusi omzet Pareto 80/20 & klasifikasi ABC siap cetak laporan eksekutif A4.
8. **Smart Size & Fit Predictor AI/Heuristic:** Kalkulator ukuran berbasis Tinggi Badan (TB) dan Berat Badan (BB) yang mengeliminasi keraguan ukuran pembeli fashion online.
9. **Interactive Capsule Wardrobe Outfit Builder:** Studio padu padan interaktif atasan, bawahan, dan luaran dengan paket diskon bundling 1-klik.
10. **Omnichannel Click & Collect:** Pilihan pengiriman Rp 0 ambil di toko fisik distro Pamulang dilengkapi QR Pass pengambilan barang.

---

## 2. 🏛️ Arsitektur Halaman Utama (Homepage Editorial Rhythm)

Halaman utama dirancang dengan ritme visual editorial bertingkat agar mengeliminasi kejenuhan katalog (*anti-catalog fatigue*):

```
┌────────────────────────────────────────────────────────────────────────┐
│ [US] [ユニ]  SEMUA KOLEKSI   PRIA   WANITA   LIMITED OFFER   🔍 ❤️ 🛍️ 👤│ <- Dynamic Frosted Header
├────────────────────────────────────────────────────────────────────────┤
│ [ HERO CAROUSEL: LOOKBOOK AUTUMN / WINTER 2026 ]                       │ <- Visual Editorial Besar
├────────────────────────────────────────────────────────────────────────┤
│ (Foto) Kemeja  │ (Foto) Kaos AIRism │ (Foto) Chino │ (Foto) Outerwear  │ <- Visual Category Bubbles
├────────────────────────────────────────────────────────────────────────┤
│ 🏷️ PENAWARAN TERBATAS MINGGU INI (LIMITED OFFER 🔥)                    │ <- Curated Sale Cards
│ [Produk 1]          [Produk 2]          [Produk 3]         [Produk 4]  │
├────────────────────────────────────────────────────────────────────────┤
│ 📖 FILOSOFI TEKSTIL RESMI (AIRism & Double-Brushed Cotton Story)       │ <- Storytelling & Edukasi Bahan
│ [ Foto Editorial Model Santai ]  "Bernapas Bebas di Cuaca Tropis..."   │
├────────────────────────────────────────────────────────────────────────┤
│ ⭐ KOLEKSI ESENSIAL TERLARIS (BEST OF LIFEWEAR)                        │ <- Top Demand Items
│ [Produk 5]          [Produk 6]          [Produk 7]         [Produk 8]  │
├────────────────────────────────────────────────────────────────────────┤
│ ✨ INSPIRASI GAYA OOTD (STYLEHINT COMMUNITY GRID)                      │ <- Social Proof / Real Looks
│ [Look 1: Kasual]   [Look 2: Kampus]   [Look 3: Smart]   [Look 4: Outer]│
├────────────────────────────────────────────────────────────────────────┤
│ 🪪 BENEFIT MEMBER (KARTU DIGITAL BARCODE & VOUCHER RP 50.000)          │ <- Loyalty Banner
├────────────────────────────────────────────────────────────────────────┤
│ 🎛️ EKSPLORASI SELURUH KOLEKSI (Filter Kategori, Gender, Cari & Sortir) │ <- Full Catalog Grid
├────────────────────────────────────────────────────────────────────────┤
│ 🦶 FOOTER RESMI MULTI-LAYER (Newsletter, Trust Badges, Sitemap, Legal) │ <- Rich Trust Footers
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 🗄️ Arsitektur Basis Data Relasional (PostgreSQL Supabase ERD V6.0)

```
┌────────────────────────┐       ┌────────────────────────┐       ┌────────────────────────┐
│        products        │1    N │    product_variants    │1    N │      order_items       │
├────────────────────────┤───────├────────────────────────┤───────├────────────────────────┤
│ id (BIGINT, PK)        │       │ id (BIGINT, PK)        │       │ id (BIGINT, PK)        │
│ name (VARCHAR)         │       │ product_id (FK)        │       │ order_id (FK)          │
│ slug (VARCHAR, UNIQUE) │       │ color_name (VARCHAR)   │       │ variant_id (FK)        │
│ category_id (FK)       │       │ color_hex (VARCHAR)    │       │ qty (INT)              │
│ base_price (NUMERIC)   │       │ size (S,M,L,XL,XXL)    │       │ price_at_purchase      │
│ weight_grams (INT)     │       │ sku (VARCHAR, UNIQUE)  │       │ subtotal (NUMERIC)     │
│ description (TEXT)     │       │ stock (INT)            │       └────────────────────────┘
│ fabric_details (TEXT)  │       │ is_active (BOOLEAN)    │                    │ N
│ care_instructions (TXT)│       └────────────────────────┘                    │
│ images (JSONB)         │                                                     │ 1
└────────────────────────┘                                        ┌────────────────────────┐
                                                                  │         orders         │
┌────────────────────────┐       ┌────────────────────────┐       ├────────────────────────┤
│     user_profiles      │1    N │     user_addresses     │       │ id (BIGINT, PK)        │
├────────────────────────┤───────├────────────────────────┤       │ order_number (VARCHAR) │
│ id (VARCHAR, PK)       │       │ id (VARCHAR, PK)       │       │ user_id (FK, Nullable) │
│ full_name (VARCHAR)    │       │ user_id (FK)           │       │ subtotal (NUMERIC)     │
│ phone_number (VARCHAR) │       │ recipient_name         │       │ shipping_cost (NUMERIC)│
│ email (VARCHAR, UNIQUE)│       │ phone (VARCHAR)        │       │ unique_code (INT)      │
│ role (customer/staff)  │       │ province (VARCHAR)     │       │ grand_total (NUMERIC)  │
│ staff_role (owner/     │       │ city (VARCHAR)         │       │ payment_method         │
│  gudang/kasir)         │       │ address_line (TEXT)    │       │ payment_status         │
│ preferred_size         │       │ is_default (BOOLEAN)   │       │ delivery_type (kurir/  │
└────────────────────────┘       └────────────────────────┘       │   pickup_store)        │
                                                                  │ tracking_number        │
┌────────────────────────┐       ┌────────────────────────┐       │ expires_at (TIMESTAMP) │
│        coupons         │       │     order_returns      │       └────────────────────────┘
├────────────────────────┤       ├────────────────────────┤                    │ 1
│ id (BIGINT, PK)        │       │ id (BIGINT, PK)        │                    │
│ code (VARCHAR, UNIQUE) │       │ order_id (FK)          │                    │ N
│ discount_type (fix/pct)│       │ user_id (FK)           │       ┌────────────────────────┐
│ discount_value         │       │ reason (TEXT)          │       │   cart_reservations    │
│ min_purchase           │       │ photo_evidence_url     │       ├────────────────────────┤
│ is_active (BOOLEAN)    │       │ return_type (tukar_    │       │ id (BIGINT, PK)        │
│ used_count (INT)       │       │   size / refund)       │       │ variant_id (FK)        │
└────────────────────────┘       │ status (pending/       │       │ session_token (VARCHAR)│
                                 │   approved/rejected)   │       │ qty (INT)              │
                                 └────────────────────────┘       │ expires_at (TIMESTAMP) │
                                                                  └────────────────────────┘
```

---

## 4. 🧩 Spesifikasi Kebutuhan Fungsional (Functional Requirements)

### 4.1. Navigasi & Pemisahan Pintu Autentikasi (Authentication Isolation)
* **FR-01 (Dynamic Frosted Header):** Header transparan saat di puncak hero dan bertransisi menjadi `backdrop-blur-md bg-white/95` saat digulir ke bawah. Memuat logo merah kembar alfabet "US" dan katakana "アー/バン".
* **FR-02 (Mobile Bottom Thumb Bar):** Navigasi melayang 5-tab di ponsel: *Beranda*, *Kategori*, *Favorit*, *Tas Belanja*, dan *Akun*.
* **FR-03 (Portal Login Pelanggan - `/login`):**
  * Halaman publik bergaya minimalis bersih untuk pembeli: masuk via email & kata sandi atau daftar akun baru.
  * Dilengkapi modal login cepat saat checkout tanpa meninggalkan halaman belanja.
  * Akun bertipe `customer` yang mencoba mengakses direktori `/admin/*` otomatis dicegat (*middleware guard*) dan dialihkan ke `/` dengan peringatan akses ditolak.
* **FR-04 (Portal Staf Internal Terisolasi - `/admin/login`):**
  * Pintu masuk khusus staf yang **tersembunyi** dari menu navbar dan footer publik.
  * Tampilan antarmuka *Monochrome Industrial Console* (fokus operasional murni, tanpa banner promo/katalog belanja).
  * Sistem memvalidasi kredensial staf dan memeriksa hak akses (`role: owner | gudang | kasir`) sebelum memberikan akses ke workspace admin.

### 4.2. Pengalaman Belanja & Halaman Detail Produk (PDP)
* **FR-05 (Visual Category Story Bubbles):** Deretan kartu visual bulat/persegi bergambar model mengenakan pakaian asli dengan dukungan *horizontal touch-swipe* di ponsel.
* **FR-06 (Fit Rating Meter Bar):** Indikator meteran kecocokan ukuran resmi Uniqlo:
  $$\text{Kekecilan (8\%)} \longleftrightarrow \mathbf{\text{Pas Sesuai Ukuran (85\%)}}\longleftrightarrow \text{Kebesaran (7\%) }$$
* **FR-07 (Visual Coret Ukuran Habis):** Varian ukuran yang memiliki `stock <= 0` pada kombinasi warna aktif otomatis diberi garis coret diagonal 45° (*strikethrough slash*) dan dinonaktifkan.
* **FR-08 (Modal Panduan Ukuran Kanji 尺):** Tabel dimensi fisik dalam satuan sentimeter (cm) yang beradaptasi dinamis antara tipe pakaian atasan (*Chest, Length, Sleeve*) dan bawahan (*Waist, Hip, Length*).
* **FR-09 (StyleHint Outfit Recommendation):** Modul rekomendasi 4 produk pelengkap di bawah ulasan untuk inspirasi padu padan gaya (*mix-and-match*).
* **FR-10 (Mobile Sticky Action Bar):** Bar melayang di bagian bawah layar ponsel (56px) yang memuat preview varian warna, ukuran terpilih, harga, dan tombol tebal *+ Tas Belanja* / *Beli Sekarang* di zona jempol tunggal.

### 4.3. Tas Belanja, Logistik & In-House Zero-Fee Payment Engine
* **FR-11 (Tas Belanja Drawer & Vouchers):**
  * Drawer samping kanan dengan bilah progres gratis ongkir tajam `rounded-none` (target Rp 400.000).
  * Mesin diskon 1-klik untuk voucher nominal (`URBANWELCOME50` - Rp 50.000), persentase (`LIFEWEAR10` - 10%), dan subsidi ongkir (`BEBASONGKIR` - Rp 15.000).
* **FR-12 (Logistik Domestik Cerdas & Fail-Safe):**
  * Kalkulasi tarif kurir domestik riil berbasis bobot akumulasi gramatur barang (`weight_grams`) dikalikan jarak kota toko fisik (Pamulang, Tangerang Selatan) ke alamat pembeli.
  * Mekanisme *Fail-Safe Flat Rate*: jika API kurir mengalami timeout > 3 detik, sistem otomatis beralih ke tarif cadangan standar (Jabodetabek: Rp 12.000, Luar Jabodetabek: Rp 22.000) tanpa memutus alur checkout.
* **FR-13 (Mesin Transfer Bank Kode Unik 3 Digit):**
  * Saat pembeli memilih metode Transfer Bank (BCA, Mandiri, BRI, BNI), sistem menghasilkan bilangan acak 3 digit ($001 \le \text{kode} \le 999$).
  * Total tagihan dikunci:
    $$\text{Grand Total} = \text{Subtotal} + \text{Ongkir} - \text{Diskon} + \text{Kode Unik}$$
  * Kode unik dikunci selama **2 jam** di database untuk mencegah benturan nominal antar-transaksi.
  * Halaman pembayaran menyediakan tombol 1-klik: *Salin Nomor Rekening* dan *Salin Total Nominal Tepat*.
* **FR-14 (Dynamic QRIS Standar EMVCo & CRC-16):**
  * Sistem mengambil payload QRIS Statis standar milik pemilik toko.
  * Memodifikasi tag struktur EMVCo: menyuntikkan **Tag 54** (Transaction Amount = `grand_total`) dan mengubah tipe inisiasi ke dinamis (**Tag 01 = 12**).
  * Mengkalkulasi ulang kode integritas **Tag 63** menggunakan algoritma matematis **CRC-16/CCITT-FALSE**.
  * Hasil QRIS dinamis dirender di layar: pembeli dapat memindai via BCA Mobile, Livin Mandiri, GoPay, OVO, ShopeePay, Dana, dll., dengan nominal yang langsung terisi otomatis tanpa input manual.
* **FR-15 (Verifikasi Mutasi Otomatis via PaymentGatewayin & Webhook Receiver):**
  * **Verifikasi Otomatis Webhook:** Endpoint resmi `/api/webhooks/payment` menerima sinyal mutasi terenkripsi dari aplikasi native Android **`PaymentGatewayin`** (menangkap notifikasi GoPay Merchant/GoBiz, BRImo, DANA Bisnis, ShopeePay, Bank Jago, SeaBank, BCA, Mandiri). Jika mutasi masuk bernilai cocok dengan `grand_total` pesanan yang *pending*, status otomatis berubah menjadi `DIBAYAR` (`PAID`) seketika secara otonom.
  * **Verifikasi Manual Fallback:** Formulir upload bukti transfer dan pelunasan manual oleh kasir di dasbor admin SIM tetap tersedia sebagai cadangan jika jaringan ponsel merchant mengalami kendala.
* **FR-16 (Pengurangan Stok Atomik PostgreSQL RPC):**
  * Pemotongan kuantitas stok dijalankan via transaksi atomik database (`UPDATE product_variants SET stock = stock - qty WHERE id = variant_id AND stock >= qty`).
  * Mencegah insiden *race condition* atau penjualan melebihi kapasitas (*overselling*).

### 4.4. Autonomous WhatsApp CRM Bot (@whiskeysockets/baileys)
* **FR-17 (Arsitektur Baileys Microservice):**
  * Layanan bot dibangun menggunakan library open-source `@whiskeysockets/baileys` yang berjalan pada service Node.js ringan terpisah (port 3001).
  * Menggunakan WebSocket WhatsApp Multi-Device resmi, tanpa ketergantungan API berbayar pihak ketiga (biaya Rp 0/bulan).
  * Sesi login tersimpan permanen menggunakan `useMultiFileAuthState` di direktori terisolasi `auth_info/`.
* **FR-18 (Pemicu Pesan Transaksional Otomatis):**
  * **Trigger 1 (Pesanan Dibuat):** Mengirim ringkasan barang, nomor rekening/QRIS, nominal eksak hingga 3 digit kode unik, serta batas waktu transfer.
  * **Trigger 2 (Pembayaran Terverifikasi):** Mengirim pesan konfirmasi pembayaran lunas beserta link tautan nota faktur digital.
  * **Trigger 3 (Pesanan Dikirim):** Mengirim pemberitahuan nama kurir pengirim beserta **Nomor Resi Pelacakan**.
* **FR-19 (Non-Blocking & Fail-Safe Protection):**
  * Seluruh pemanggilan fungsi notifikasi WhatsApp di web Next.js bersifat asinkron (`async / fire-and-forget`).
  * Jika server bot WhatsApp sedang offline/restart, transaksi checkout dan pembayaran di website dipastikan **tetap berjalan lancar 100% tanpa error**. Sistem mencatat log status pesan yang gagal terkirim.

### 4.5. Faktur, Pelacakan Resi & Real-Time Auto-Settlement
* **FR-20 (Digital Invoice TPS & Print Ready):** Nota faktur resmi dengan rincian biaya, kode transaksi, cap status lunas, rincian potongan diskon, dan tombol *Cetak Faktur PDF*.
* **FR-21 (Real-Time Radar Status Pelunasan Transaksi):**
  * Komponen reaktif `RealtimePaymentStatus.tsx` melakukan radar polling cerdas ke `/api/orders/[orderNumber]/status` setiap 2.5 detik.
  * Begitu notifikasi mutasi ditangkap oleh aplikasi Android `PaymentGatewayin` dan dikirimkan ke `/api/webhooks/payment`, status pesanan otomatis berubah menjadi `DIBAYAR` dengan audio chime lembut dan stempel resmi lunas tanpa perlu refresh manual ataupun timer palsu.
* **FR-22 (Live Stepper Tracking Kurir):** Indikator status 5 tahap visual (*Dibuat $\rightarrow$ Terverifikasi $\rightarrow$ Dikemas $\rightarrow$ Dikirim $\rightarrow$ Selesai*) terhubung langsung dengan nomor resi kurir pengiriman.

### 4.6. Dasbor Manajemen Admin SIM, DSS & Manajemen Karyawan (RBAC)
* **FR-23 (Manajemen Peran Karyawan / Multi-Staff RBAC):**
  * Owner (Super Admin) memiliki menu khusus **"Manajemen Karyawan"**.
  * Fitur `+ Tambah Staf Baru`: mendaftarkan nama, email, nomor WA, password awal, dan penugasan peran.
  * Matriks hak akses wewenang sistem:
    * **Owner (Super Admin):** Hak mutlak seluruh modul, konfigurasi nomor rekening/QRIS, mutasi kas, DSS Pareto, tambah/nonaktifkan staf.
    * **Staf Gudang (Logistik):** Akses kelola katalog, update stok barang fisik, cetak label pengiriman, dan input nomor resi kurir. Dilarang melihat data omzet keuangan atau mengubah rekening toko.
    * **Staf Kasir (Finance):** Akses melihat daftar transaksi, verifikasi bukti slip transfer, dan menyetujui mutasi kode unik. Dilarang menghapus produk atau mengubah struktur staf.
* **FR-24 (Manajemen Restok Fleksibel):**
  * Input kuantitas stok pada level varian bersifat **bebas / fleksibel** (dapat diisi angka satuan berapa saja, contoh: `1, 3, 7, 14, 25, dst.`, untuk mengakomodasi sisa sampel atau retur QC).
  * Antarmuka admin dilengkapi tombol jalan pintas cepat penambahan kuantitas: `[+1]`, `[+5]`, `[+10]`, `[+50]`.
* **FR-25 (Decision Support System / DSS Analisis Pareto):**
  * Kalkulasi pareto otomatis (Klasifikasi 80/20: Produk Kelas A penghasil 80% omzet toko).
  * Visualisasi grafik bar kontribusi pendapatan, ringkasan omzet kotor, omzet bersih, dan rasio peringatan stok menipis (*low stock warning threshold*).
* **FR-26 (Ekspor Data Akuntansi):** Tombol ekspor laporan transaksi penjualan berkala ke format Excel (`.xlsx`) / CSV untuk pembukuan keuangan distro.

### 4.7. Portal Keanggotaan & Footer Multi-Layer
* **FR-27 (Digital Member Barcode Pass):** Kartu identitas loyalitas berlatar watermark katakana `ライフウェア` dengan barcode tebal-tipis realistis untuk simulasi belanja store fisik.
* **FR-28 (Buku Multi-Alamat & Dompet Kupon):** Penyimpanan daftar alamat pengiriman tersimpan untuk *auto pre-fill* saat checkout dan dompet penyimpanan voucher 1-klik salin.
* **FR-29 (Footer Resmi Multi-Layer):** Kotak newsletter dengan imbalan voucher Rp 50.000, value badges resmi (garansi retur 30 hari, bebas ongkir, 100% LifeWear original), accordion sitemap mobile, serta logo resmi kurir dan perbankan digital.

---

### 4.8. Inovasi Unggulan Retail LifeWear & Logistik Lanjutan (V6.0 Flagship Evolution)

* **FR-30 (Smart Size & Fit Predictor AI/Heuristic):**
  * Widget interaktif pada PDP: pembeli memasukkan Tinggi Badan (cm) dan Berat Badan (kg) serta memilih preferensi fit (*Slim*, *Regular*, *Oversized*).
  * Algoritma menghitung rasio BMI dan distribusi ukuran untuk merekomendasikan ukuran ideal secara presisi: *"Rekomendasi Terbaik: Size L (Kecocokan 94%)"*.
  * Pilihan ukuran pada selector PDP otomatis tersinkronisasi dengan hasil rekomendasi.
* **FR-31 (Interactive Capsule Wardrobe Outfit Builder):**
  * Kanvas padu padan split-screen interaktif (Atasan + Bawahan + Outerwear) di mana pembeli dapat menukar varian pakaian secara real-time.
  * Kalkulasi total harga diskon bundling otomatis (*Hemat 15%*) dan tombol 1-klik *Beli 1 Paket OOTD*.
* **FR-32 (Cart Reservation Countdown Timer & Auto-Release Worker):**
  * Saat varian dengan stok kritis ($< 5$ unit) dimasukkan ke keranjang, sistem mengunci stok sementara selama **10:00 menit** dengan timer mundur aktif.
  * Worker terjadwal (Edge Cron) yang berjalan setiap 5 menit untuk memeriksa pesanan transfer bank yang melewati batas kedaluwarsa 2 jam: otomatis mengubah status menjadi `Dibatalkan` dan mengembalikan kuantitas stok varian ke inventaris.
* **FR-33 (Omnichannel Click & Collect Flagship Store Pamulang):**
  * Opsi metode pengiriman Rp 0: *"Ambil Langsung di Flagship Store Pamulang (Tangerang Selatan)"*.
  * Nota faktur otomatis menerbitkan barcode / QR Pass pengambilan barang digital.
  * Admin scanner kasir toko fisik untuk verifikasi serah-terima barang instan tanpa biaya kirim.
* **FR-34 (Fabric Texture Macro Zoom & Weather Tech Badges):**
  * Kaca pembesar makro resolusi tinggi pada galeri foto PDP untuk inspeksi detail tekstur tenunan tekstil (AIRism mikropori, katun 280 GSM, double-brushed flannel).
  * Badge kecocokan iklim: *"Optimal untuk Cuaca Tropis 28°C - 35°C"* atau *"Optimal untuk Suhu Dingin Ber-AC"*.
* **FR-35 (Modul Klaim Retur & Tukar Ukuran Garansi 30 Hari):**
  * Alur mandiri bagi pembeli di portal `/account/orders` untuk mengajukan penukaran ukuran atau pengembalian barang dalam 30 hari sejak barang diterima.
  * Formulir upload foto bukti kondisi pakaian dan pemilihan ukuran pengganti yang langsung masuk ke tab review admin kasir/gudang.
* **FR-36 (Outbound Dispatcher WhatsApp Baileys Microservice):**
  * Dispatcher HTTP/WebSocket asinkron pada `orderService.ts` dan `settlementService.ts` yang secara nyata menembak microservice WhatsApp port 3001 saat pesanan dibuat, diverifikasi lunas, dan nomor resi diterbitkan.

---

## 5. ⚙️ Spesifikasi Non-Fungsional & Kualitas Rekayasa (Anti-AI Feel & Performance)

* **NFR-01 (Framework & Runtime):** Next.js 16 berbasis React 19, compiler Turbopack, dan Tailwind CSS v4 dengan utility sudut tegas `rounded-none`.
* **NFR-02 (Backend & Database):** PostgreSQL Supabase Cloud dengan dukungan RLS (*Row Level Security*) dan fallback lokal in-memory untuk menjamin **Zero-Crash**.
* **NFR-03 (WhatsApp Communication Service):** Node.js Microservice terpisah menggunakan library `@whiskeysockets/baileys` yang berjalan di port 3001 dengan arsitektur non-blocking async.
* **NFR-04 (Algoritma Kriptografi & Checksum):**
  * Checksum generator Dynamic QRIS menggunakan polinomial CRC-16 standar CCITT-FALSE ($X^{16} + X^{12} + X^5 + 1$, Inisial: `0xFFFF`).
* **NFR-05 (Performance & Core Web Vitals):** LCP (*Largest Contentful Paint*) < 1.5 detik, gambar produk dioptimasi format WebP melalui Unsplash Image CDN / Supabase Storage.
* **NFR-06 (Automated Testing & Stability):** Suite pengujian komprehensif wajib mencapai kelulusan **100% PASS** di semua skenario transaksi, mutasi webhook, dan boundary conditions.
* **NFR-07 (Shimmer Skeleton Loader 1:1):** Seluruh spinner bundar generik dieliminasi; wajib menggunakan shimmer skeleton loader dengan rasio potret 3:4 yang proporsinya 1:1 dengan kontur kartu produk untuk menjamin **Zero Cumulative Layout Shift (CLS)**.
* **NFR-08 (Smooth Variant Crossfade):** Pergantian foto produk saat swatch warna diklik wajib menggunakan transisi crossfade kehalusan opacity 150ms tanpa kedipan (*flicker-free*).
* **NFR-09 (Tactile & Micro-Scale Feedback):** Seluruh tombol aksi utama (`+ Masuk ke Tas Belanja`, Salin Rekening, Voucher) wajib dilengkapi interaksi sentuhan mikro `active:scale-[0.98]` dan respons ikonik instan.
* **NFR-10 (Mobile Thumb Ergonomics):** Tombol aksi pembelian di layar ponsel wajib memiliki tinggi minimal 48px dan berada dalam jangkauan satu jempol (*ergonomic thumb zone*).
* **NFR-11 (Standar Aksesibilitas WCAG AAA):** Teks keterangan mikro berukuran 9-10px wajib memiliki rasio kontras warna minimal 4.5:1 terhadap latar belakang putih agar tetap terbaca jelas di bawah terik matahari luar ruangan.

---

## 6. 🗓️ Roadmap Eksekusi & Matriks Kesiapan

| Prioritas | Fase Sprint | Ruang Lingkup Rekayasa | Status |
| :--- | :--- | :--- | :---: |
| **P0 (Critical)** | **Sprint 1: Keutuhan Data & Stabilitas** | • Normalisasi relasional `product_variants` (SKU-level)<br>• Outbound dispatcher ke WhatsApp Baileys port 3001<br>• Edge Cron auto-release pesanan transfer expired 2 jam | Siap Eksekusi |
| **P1 (High)** | **Sprint 2: UI Organic Polish & Anti-AI** | • Shimmer Skeleton Loader 1:1 pengganti spinner<br>• Smooth crossfade selector warna PDP<br>• Mobile Sticky Thumb Action Bar di PDP<br>• Micro-tactile click feedback (`active:scale-[0.98]`) | Siap Eksekusi |
| **P2 (Growth)** | **Sprint 3: Inovasi Diferensiasi Retail** | • Smart Size & Fit Predictor (TB/BB + Siluet)<br>• Interactive Capsule Wardrobe Outfit Builder<br>• Omnichannel Click & Collect Store Pamulang<br>• Fabric Macro Texture Zoom & Weather Tech Badges<br>• Modul self-service Klaim Retur Garansi 30 Hari | Siap Eksekusi |

---

*Dokumen ini merupakan spesifikasi master V6.0 Flagship Evolution yang sah dan menjadi acuan tunggal seluruh rekayasa kode pada proyek UrbanStyle Store.*