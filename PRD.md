---
title: "PRD: urbanstyle-store"
date: 2026-10-06
tags: [prd, website, urbanstyle-store]
project_slug: urbanstyle-store
status: Updated
folder: c:\project\websites\urbanstyle-store
---

# 📜 PRODUCT REQUIREMENT DOCUMENT (PRD) V5.2
# UrbanStyle Store — Flagship LifeWear E-Commerce Engine & Autonomous Payment Core
**Proyek:** UrbanStyle Store (Codename: *Kuro-Commerce Engine*)  
**Pemilik Proyek:** Kimy Eka Ardiansyah (Teknik Informatika, Universitas Pamulang)  
**Dokumen:** `PRD.md` (Master Product Requirement Document)  
**Target Milestone:** Ujian Akhir Semester (UAS), Publikasi Jurnal Komputer JIUP, & Komersialisasi White-Label Distro Fashion Lokal  
**Status:** Approved & Implementation-Ready  

---

## 1. 🎯 Visi Produk & Ringkasan Eksekutif

**UrbanStyle Store** adalah platform e-commerce retail fashion modern kelas industri yang menggabungkan estetika **Japanese Industrial Minimalism** (*Uniqlo LifeWear — Simple Made Better*) dengan keandalan sistem berskala enterprise:

1. **Digital Editorial Flagship Experience:** Menghadirkan ritme visual majalah gaya hidup, edukasi kenyamanan teknologi tekstil (AIRism, Heavyweight Cotton, Double-Brushed Flannel), dan ergonomi sentuhan satu jempol (*mobile thumb zone*).
2. **In-House Zero-Fee Payment Engine:** Pemrosesan pembayaran transfer bank mandiri berbasis kode unik 3 digit acak dan generator QRIS Dinamis standar **EMVCo & CRC-16** mandiri (0% potongan fee pihak ketiga, 100% dana langsung masuk ke rekening/dompet merchant).
3. **Autonomous WhatsApp CRM Service:** Microservice mandiri berbasis protokol WebSocket WhatsApp Multi-Device (**@whiskeysockets/baileys**) tanpa biaya langganan bulanan vendor (Rp 0), mengotomasi notifikasi tagihan, verifikasi lunas, dan nomor resi ekspedisi.
4. **Pemisahan Pintu Autentikasi & Multi-Role RBAC:** Isolasi 100% antara portal pelanggan publik (`/login`) dan portal staf internal (`/admin/login`), dilengkapi modul penambahan karyawan bertingkat (Owner, Staf Gudang, Staf Kasir).
5. **Atomic Inventory & Flexible Restock Control:** Kendali stok multi-varian kombinasi ($Warna \times Ukuran$) anti-overselling dengan input restok fleksibel tanpa batasan kelipatan kaku, didukung tombol jalan pintas cepat.
6. **Dual-Mode Engine (UAS Sidang vs Komersial):** Bypass simulator transaksi 1-klik untuk pengujian interaktif dosen serta analitik **Decision Support System (DSS)** berbasis distribusi Pareto 80/20.

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

## 3. 🗄️ Arsitektur Basis Data (PostgreSQL Supabase ERD)

```
┌──────────────────┐       ┌──────────────────────┐       ┌───────────────────┐
│     products     │1    N │   product_variants   │1    N │    order_items    │
├──────────────────┤───────├──────────────────────┤───────├───────────────────┤
│ id (UUID, PK)    │       │ id (UUID, PK)        │       │ id (UUID, PK)     │
│ name             │       │ product_id (FK)      │       │ order_id (FK)     │
│ slug (UNIQUE)    │       │ color_name           │       │ variant_id (FK)   │
│ category_id      │       │ color_hex            │       │ qty (INT)         │
│ base_price       │       │ size (S,M,L,XL,XXL)  │       │ price_at_purchase │
│ weight_grams     │       │ sku (UNIQUE)         │       │ subtotal          │
│ description      │       │ stock (INT)          │       └───────────────────┘
│ images (JSONB)   │       │ is_active (BOOLEAN)  │                 │ N
└──────────────────┘       └──────────────────────┘                 │
                                                                    │ 1
┌──────────────────┐       ┌──────────────────────┐       ┌───────────────────┐
│      users       │1    N │   user_addresses     │       │      orders       │
├──────────────────┤───────├──────────────────────┤       ├───────────────────┤
│ id (UUID, PK)    │       │ id (UUID, PK)        │       │ id (UUID, PK)     │
│ full_name        │       │ user_id (FK)         │       │ order_number      │
│ phone_number     │       │ province             │       │ user_id (FK, Null)│
│ email (UNIQUE)   │       │ city                 │       │ subtotal          │
│ password_hash    │       │ district             │       │ shipping_cost     │
│ role             │       │ postal_code          │       │ unique_code (INT) │
│ (customer/owner/ │       │ address_line         │       │ grand_total       │
│  gudang/kasir)   │       └──────────────────────┘       │ payment_method    │
│ is_active (BOOL) │                                      │ payment_status    │
└──────────────────┘                                      │ payment_proof_url │
                                                          │ tracking_number   │
                                                          │ expires_at (TS)   │
                                                          └───────────────────┘
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
* **FR-10 (Mobile Sticky Action Bar):** Bar melayang di bagian bawah layar ponsel yang memuat preview varian warna, ukuran terpilih, harga, dan tombol *+ Tas Belanja* / *Beli Sekarang*.

### 4.3. Tas Belanja, Logistik & In-House Zero-Fee Payment Engine
* **FR-11 (Tas Belanja Drawer & Vouchers):**
  * Drawer samping kanan dengan bilah progres gratis ongkir tajam `rounded-none` (target Rp 400.000).
  * Mesin diskon 1-klik untuk voucher nominal (`URBANWELCOME50` - Rp 50.000), persentase (`LIFEWEAR10` - 10%), dan subsidi ongkir (`BEBASONGKIR` - Rp 15.000).
* **FR-12 (Logistik Domestik Cerdas & Fail-Safe):**
  * Kalkulasi tarif kurir domestik riil (J&T, JNE, SiCepat) berbasis kecamatan pengirim toko ke kecamatan tujuan pembeli serta akumulasi berat gramatur barang.
  * Mekanisme *Fail-Safe Flat Rate*: jika API kurir mengalami gangguan/timeout > 3 detik, sistem otomatis beralih ke tarif cadangan standar (Jabodetabek: Rp 12.000, Luar Jabodetabek: Rp 22.000) tanpa memutus alur checkout pembeli.
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
* **FR-15 (Verifikasi Pembayaran Ganda - Webhook & Upload Struk):**
  * **Verifikasi Otomatis:** Endpoint `/api/webhooks/mutation` membaca mutasi bank/rekening. Jika mutasi masuk bernilai persis sama dengan `grand_total` pesanan yang *pending*, status otomatis berubah menjadi `PAID`.
  * **Verifikasi Manual:** Tersedia formulir upload foto bukti transfer / tangkapan layar pembayaran bagi pembeli konvensional. Data masuk ke dasbor kasir admin untuk disetujui.
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

### 4.5. Faktur, Pelacakan Resi & Simulasi Ujian UAS
* **FR-20 (Digital Invoice TPS & Print Ready):** Nota faktur resmi dengan rincian biaya, kode transaksi, cap status lunas, rincian potongan diskon, dan tombol *Cetak Faktur PDF*.
* **FR-21 (Tombol Simulasi Sidang UAS Dosen):**
  * Tombol `⚡ Simulasi Bayar Instan (Demo Dosen)` tersedia di halaman pembayaran ketika `NEXT_PUBLIC_DEMO_MODE=true`.
  * Mengirim payload tiruan ke endpoint verifikasi untuk mengubah status transaksi menjadi `PAID` secara real-time di depan dosen tanpa perlu mentransfer uang sungguhan.
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

## 5. ⚙️ Spesifikasi Non-Fungsional & Kualitas Rekayasa

* **NFR-01 (Framework & Runtime):** Next.js 16.3.8 berbasis React 19, compiler Turbopack, dan Tailwind CSS v4 dengan utility sudut tegas `rounded-none`.
* **NFR-02 (Backend & Database):** PostgreSQL Supabase Cloud dengan dukungan RLS (*Row Level Security*) dan fallback lokal in-memory untuk menjamin **Zero-Crash**.
* **NFR-03 (WhatsApp Communication Service):** Node.js Microservice terpisah menggunakan library `@whiskeysockets/baileys` yang berjalan di port 3001 dengan arsitektur non-blocking async.
* **NFR-04 (Algoritma Kriptografi & Checksum):**
  * Checksum generator Dynamic QRIS menggunakan polinomial CRC-16 standar CCITT-FALSE ($X^{16} + X^{12} + X^5 + 1$, Inisial: `0xFFFF`).
* **NFR-05 (Performance & Core Web Vitals):** LCP (*Largest Contentful Paint*) < 1.5 detik, gambar produk dioptimasi format WebP melalui Unsplash Image CDN / Supabase Storage.
* **NFR-06 (Automated Testing & Stability):** Suite pengujian 3 lapis (Happy Path Checkout, Adversarial Invalid Transfers, Zero-Crash Mocking) wajib mencapai kelulusan **100% PASS**.

---

## 6. 🗓️ Matriks Kesiapan UAS & Pengujian Sidang Akademik

| Kriteria Penilaian UAS | Fitur Implementasi di UrbanStyle Store | Bukti Pengujian Sidang | Status |
| :--- | :--- | :--- | :---: |
| **Transaction Processing (TPS)** | Keranjang $\rightarrow$ Multi-kurir $\rightarrow$ Transfer Kode Unik / Dynamic QRIS $\rightarrow$ Pemotongan Stok Atomik | Faktur digital terbit, stok varian berkurang real-time di database | ✅ Siap Uji |
| **Rekayasa Algoritma Mandiri** | In-House Dynamic QRIS EMVCo & CRC-16 Checksum Generator | Scan QRIS via HP dosen langsung menampilkan nominal tagihan pas | ✅ Siap Uji |
| **Autonomous Microservices** | Bot WhatsApp Mandiri berbasis protokol WebSocket Baileys | Pesan rincian tagihan & resi kurir masuk ke nomor WhatsApp dosen | ✅ Siap Uji |
| **Sistem Keamanan & RBAC** | Pemisahan `/login` & `/admin/login`, multi-role (Owner, Gudang, Kasir) | Akses halaman keuangan terkunci saat staf gudang mencoba masuk | ✅ Siap Uji |
| **Decision Support System (DSS)** | Analisis Omzet & Peringkat Produk Terlaris Metode Distribusi Pareto | Dashboard visualisasi grafik kontribusi pendapatan 80/20 | ✅ Siap Uji |
| **Kemudahan Pengujian Dosen** | Bypass Simulator Mutasi Bank & Dynamic QRIS 1-Klik | Tombol `⚡ Simulasi Bayar Instan` langsung mengubah status PAID | ✅ Siap Uji |

---

*Dokumen ini merupakan spesifikasi final V5.2 yang sah dan menjadi acuan tunggal seluruh rekayasa kode pada proyek UrbanStyle Store.*