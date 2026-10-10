---
title: "PRD: urbanstyle-store"
date: 2026-10-10
tags: [prd, website, urbanstyle-store, lifewear, ecommerce, sim, enterprise]
project_slug: urbanstyle-store
status: Approved & Master-Synchronized (V6.0 Master Specification)
version: 6.0.0
owner: Kimy Eka Ardiansyah
pm_lead: Antigravity Product Management
folder: c:\project\websites\urbanstyle-store
---

# 📜 MASTER PRODUCT REQUIREMENTS DOCUMENT (PRD V6.0)
## UrbanStyle Store — Flagship LifeWear E-Commerce & Autonomous Autonomous Commerce Core

---

## 1. 📌 Ringkasan Eksekutif (Summary)

**UrbanStyle Store** (*Kuro-Commerce Engine*) adalah platform e-commerce retail fashion modern kelas enterprise yang menggabungkan filosofi desain **Japanese Industrial Minimalism** (*Uniqlo LifeWear — Simple Made Better*) dengan keandalan sistem berskala industri:
1. **Digital Editorial Flagship:** Pengalaman berbelanja berbasis majalah gaya hidup, edukasi teknologi bahan tekstil (AIRism, Heavyweight Cotton 280 GSM, Double-Brushed Flannel), katalog kurasi dewasa (Pria, Wanita, Unisex), dan navigasi ergonomis satu jempol (*mobile thumb zone*).
2. **In-House Zero-Fee Payment Engine:** Pemrosesan pembayaran transfer bank mandiri berbasis kode unik 3 digit acak dan generator QRIS Dinamis standar **EMVCo & CRC-16** mandiri (0% potongan MDR pihak ketiga, 100% dana langsung masuk ke rekening merchant).
3. **Autonomous Mobile Notification Gateway (PaymentGatewayin):** Aplikasi native Android listener notifikasi mutasi perbankan/e-wallet yang secara otonom menembak webhook ke server cloud (`/api/webhooks/payment`) untuk melunaskan transaksi secara real-time.
4. **Autonomous WhatsApp CRM Bot (@whiskeysockets/baileys):** Microservice perpesanan WebSocket mandiri (port 3001) yang mengirimkan faktur tagihan, notifikasi pelunasan seketika, dan pelacakan resi kurir tanpa biaya API bulanan.
5. **SKU-Level Relational Inventory Control:** Pengelolaan stok multi-varian terisolasi per kombinasi warna dan ukuran untuk mengeliminasi risiko *overselling*.
6. **Smart Size & Fit Predictor:** Kalkulator pintar ukuran berbasis Tinggi Badan (cm) dan Berat Badan (kg) untuk mengeliminasi keraguan ukuran pembeli fashion online.
7. **Interactive Capsule Wardrobe Outfit Builder:** Kanvas padu padan interaktif atasan, bawahan, dan luaran dengan paket diskon bundling 1-klik.
8. **Omnichannel Click & Collect:** Pilihan pengiriman Rp 0 ambil di toko fisik distro Pamulang dilengkapi QR Pass pengambilan barang.

---

## 2. 👥 Pemangku Kepentingan (Stakeholders & Contacts)

| Nama / Peran | Jabatan & Afiliasi | Tanggung Jawab Utama |
| :--- | :--- | :--- |
| **Kimy Eka Ardiansyah** | Pemilik Proyek / Lead Engineer (UNPAM) | Arsitektur sistem Next.js, basis data Supabase, dan riset akademik SIM e-commerce. |
| **Product Manager (PM)** | Antigravity AI Product Management | Visi produk, audit UX, spesifikasi fungsional, dan prioritas roadmap. |
| **Dosen Penguji UAS & Reviewer JIUP** | Akademisi Teknik Informatika | Evaluasi keaslian algoritma, ketepatan transaksi (TPS), dan DSS Pareto. |
| **Partner Merchant Distro Lokal** | Pemilik Toko Fisik Pamulang | Uji coba operasional kasir, verifikasi stok fisik, dan modul *Click & Collect*. |

---

## 3. 📖 Latar Belakang & Konteks (Background & Why Now?)

### 3.1. Masalah Pasar Fashion E-Commerce Lokal
* **Ketergantungan Biaya Pihak Ketiga (MDR Fee):** Gateway pembayaran konvensional (Midtrans, Xendit) memotong 1.5%–3% per transaksi atau Rp 4.000–Rp 5.000 per transfer, menggerus margin laba distro fashion lokal yang tipis.
* **Tingginya Angka Retur Akibat Salah Ukuran:** Rata-rata 25%–30% retur fashion online disebabkan pembeli salah memilih ukuran akibat tabel CM yang kaku dan membingungkan.
* **Kejenuhan Katalog (Catalog Fatigue):** Toko online lokal umumnya menjejalkan ratusan produk dalam grid kotak-kotak kaku mirip pasar grosir tanpa kurasi storytelling, menurunkan persepsi nilai (*perceived brand value*).
* **Kebocoran Stok (Phantom Overselling):** Pengelolaan stok di level produk induk (bukan SKU varian) menyebabkan pembeli membeli ukuran yang sebenarnya sudah habis di gudang.

### 3.2. Mengapa Sekarang?
* Standar EMVCo QRIS Bank Indonesia memungkinkan pembuatan payload dinamis mandiri berbasis CRC-16 dengan biaya 0%.
* Arsitektur modern Next.js 15 App Router memungkinkan kombinasi performa SSR kilat dengan micro-interactions setara aplikasi native.

---

## 4. 🎯 Tujuan Produk & Metrik Keberhasilan (Objectives & SMART OKRs)

### Objective 1: Menghadirkan Pengalaman Belanja Kelas Flagship Berbasis LifeWear
* **KR 1.1:** LCP (*Largest Contentful Paint*) $< 1.2$ detik pada koneksi 4G mobile.
* **KR 1.2:** Bounce rate halaman beranda turun di bawah 30% berkat ritme editorial majalah.
* **KR 1.3:** Tingkat konversi keranjang ke checkout naik $\ge 25\%$ dengan Cart Reservation Timer.

### Objective 2: Menjamin Keandalan Transaksi Finansial 100% Mandiri (Zero-Fee Core)
* **KR 2.1:** Keberhasilan pemindaian Dynamic QRIS EMVCo dan transfer kode unik mencapai **100% akurat** pada seluruh bank nasional (BCA, Mandiri, BRI, BNI) dan e-wallet.
* **KR 2.2:** Latensi notifikasi mutasi otomatis via aplikasi Android `PaymentGatewayin` $< 3$ detik dari saat uang masuk hingga status order berubah menjadi `DIBAYAR`.
* **KR 2.3:** Penghematan biaya transaksi sebesar 100% (Rp 0 biaya gateway pembayaran).

### Objective 3: Mengeliminasi Keraguan Ukuran & Masalah Overselling
* **KR 3.1:** Penggunaan Smart Size Recommender digunakan oleh $\ge 40\%$ pengunjung halaman PDP, menurunkan potensi salah ukuran hingga $< 5\%$.
* **KR 3.2:** Insiden *overselling* varian produk ditekan menjadi **0 insiden** melalui transaksi atomik tingkat SKU varian.

---

## 5. 👥 Segmentasi Pengguna & JTBD (Market Segments & Jobs-To-Be-Done)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PETA SEGMENTASI PENGGUNA                        │
├───────────────────────────────┬────────────────────────────────────────┤
│ 1. Pembeli Kasual (Urban Gen-Z│ Butuh pakaian berkualitas, anti-ribet, │
│    & Profesional Muda)        │ percaya ukuran pas tanpa harus ngukur. │
├───────────────────────────────┼────────────────────────────────────────┤
│ 2. Pembeli Komuter Pamulang / │ Ingin belanja cepat, bebas ongkir, dan │
│    Tangerang Selatan          │ bisa ambil langsung di distro fisik.   │
├───────────────────────────────┼────────────────────────────────────────┤
│ 3. Staf Gudang & Kasir Toko   │ Butuh sistem kasir & restok kilat tanpa│
│    (Operasional Distro)       │ pusing menghitung selisih manual.      │
├───────────────────────────────┼────────────────────────────────────────┤
│ 4. Owner Distro & Akademisi   │ Butuh analisis Pareto DSS 80/20 untuk  │
│    (Pengambil Keputusan)      │ restok strategis dan laporan UAS A4.   │
└───────────────────────────────┴────────────────────────────────────────┘
```

### Analisis JTBD (Jobs-To-Be-Done):
* *"Ketika saya ingin membeli kemeja atau kaos untuk kerja santai, saya ingin tahu pasti ukuran yang pas di badan saya tanpa harus mencari meteran kain, sehingga saya tidak membuang waktu mengurus retur barang."*
* *"Ketika saya melihat pakaian yang cocok, saya ingin bisa langsung melihat padanan celana yang sesuai dan membelinya dalam 1 paket tanpa harus mencari-cari di katalog."*

---

## 6. 💎 Proposisi Nilai & Kurva Nilai (Value Proposition & Value Curve)

| Dimensi Fitur | Marketplace Umum (Shopee/Tokopedia) | Toko Distro Lokal Standar | **UrbanStyle Store (LifeWear V6.0)** |
| :--- | :--- | :--- | :--- |
| **Estetika Antarmuka** | Ramai banner iklan, padat, berisik | Template kaku, border tebal khas AI | **Japanese Industrial Minimalism (Uniqlo 1:1)** |
| **Biaya Transaksi Pembeli** | Biaya layanan Rp 1.000–Rp 2.500 | Biaya transfer manual | **0% Biaya (Bebas Potongan Apapun)** |
| **Penentuan Ukuran** | Tabel CM statis membingungkan | Tidak ada panduan ukuran | **Smart Size Predictor (Kalkulator TB/BB)** |
| **Inspirasi Padu Padan** | Foto katalog terpisah-pisah | Foto flatlay seadanya | **Interactive Capsule Wardrobe Outfit Builder** |
| **Integrasi Toko Fisik** | Tidak ada | Chat admin WA manual | **Omnichannel Click & Collect + Digital QR Pass** |
| **Kecepatan Verifikasi** | 1-5 menit via aggregator | Manual cek mutasi muter-muter | **Real-time $<3$ detik via Android Gateway** |

---

## 7. 🛠️ Solusi Rekayasa & Spesifikasi Fungsional Detail (Solution Specification)

### 7.1. Wireframe Arsitektur Antarmuka (UI Editorial Rhythm)

#### A. Halaman Beranda (Homepage Layout)
```
┌────────────────────────────────────────────────────────────────────────┐
│ [US] [ユニ]   WANITA    PRIA    ANAK    LIMITED OFFER    🔍 ❤️ 👤 🛍️     │ <- Header Bersih (Pill Search)
├────────────────────────────────────────────────────────────────────────┤
│ [ HERO BANNER LOOKBOOK: ASPECT 2:1 ] "Simple Made Better"              │ <- Visual Editorial Lapang
├────────────────────────────────────────────────────────────────────────┤
│  (Icon) Kaos  │  (Icon) Kemeja  │  (Icon) Celana  │  (Icon) Luaran     │ <- Minimalist 1:1 Categories
├────────────────────────────────────────────────────────────────────────┤
│ 🏷️ PENAWARAN TERBATAS (LIMITED OFFERS) - Tanpa Border-itis             │
│ [Produk 1: Foto 3:4]  [Produk 2: Foto 3:4]  [Produk 3]  [Produk 4]    │ <- Clean Card (Hanya Foto, Swatch,
│  - Swatch Warna (12px) - Nama Produk - Harga Rp199.000 (Merah)        │    Nama, Harga, Star Rating)
├────────────────────────────────────────────────────────────────────────┤
│ 📖 FILOSOFI TEKSTIL RESMI (AIRism & 280 GSM Cotton Story)              │ <- Split Screen Editorial
├────────────────────────────────────────────────────────────────────────┤
│ 👔 CAPSULE WARDROBE OOTD STUDIO (Interactive Mix & Match Canvas)       │ <- Interactive Outfit Builder
├────────────────────────────────────────────────────────────────────────┤
│ 🦶 FOOTER MULTI-LAYER RESMI (Accordion Mobile, Trust Badges, Legal)    │ <- Rich Trust Footer
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Anatomi Kartu Produk Bersih (`ProductCard.tsx` — Uniqlo 1:1)
```
┌──────────────────────────────────────┐
│ [Foto Model Portrait Rasio 3:4]      │ <- Latar belakang abu-abu sangat muda (#F6F6F6)
│  (Badge merah kecil: LIMITED OFFER)  │ <- Hanya 1 badge tajam di pojok kiri atas
│  (Icon hati outline tipis)           │ <- Pojok kanan atas (Wishlist)
├──────────────────────────────────────┤
│ 🔴 🔵 ⚫  (3 Warna)                  │ <- Swatch warna lingkaran mini (12px)
│ PRIA • Kemeja & Flannel              │ <- Kategori gender halus (text-zinc-500, 11px)
│ Kemeja Flannel Kotak Lengan Panjang  │ <- Nama produk bersih (font-medium, max 2 baris)
│ Rp 299.000   Rp 399.000 (Coret)      │ <- Harga pekat / merah Uniqlo (#E60012)
│ ★ 4.8 (24)                           │ <- Rating bintang monokrom halus
└──────────────────────────────────────┘
(CATATAN PM: DILARANG menaruh tombol ukuran [S,M,L,XL] dan tombol "+ Masuk Tas" di kartu ini!)
```

---

### 7.2. Spesifikasi Fungsional Lengkap (FR-01 s.d FR-36)

#### [MODUL 1: Navigasi, Identitas & Autentikasi]
* **FR-01 (Header Minimalis Kapsul):**
  * Logo ganda merah alfabet "US" dan katakana "アー/バン".
  * Tab gender utama: `Wanita`, `Pria`, `Anak`, `Limited Offer` dengan indikator garis bawah tipis saat aktif.
  * Search input berbentuk kapsul (*pill-rounded* 999px) dengan placeholder: *"Apa yang Anda cari?"*.
* **FR-02 (Mobile Bottom Thumb Bar Ergonomis):** 5-tab melayang di ponsel: *Beranda*, *Kategori*, *Favorit*, *Tas Belanja*, dan *Akun*. Tinggi 56px di zona jempol bawah.
* **FR-03 (Isolasi Portal Autentikasi Publik & Staf):**
  * Portal publik (`/login`): autentikasi email/password untuk pembeli.
  * Portal staf internal (`/admin/login`): console monokrom khusus staf dengan validasi peran bertingkat (`owner`, `gudang`, `kasir`) berproteksi HMAC session token. Akun customer dilarang masuk direktori `/admin/*`.

#### [MODUL 2: Katalog & Pengalaman Halaman Produk (PDP)]
* **FR-04 (Grid Katalog Tanpa Border-itis):** Kartu produk ditampilkan di atas kanvas putih tanpa garis pembungkus luar (`border-none`), dipisahkan oleh whitespace alami (kolom gap 24px - 32px).
* **FR-05 (Smooth Color Swatch Crossfade):** Saat pembeli mengklik swatch warna berbeda di PDP atau Quick View, foto utama berganti menggunakan transisi opacity crossfade 150ms tanpa kedipan (*anti-flicker*).
* **FR-06 (Visual Coret Ukuran Habis):** Varian ukuran yang memiliki stok 0 pada warna aktif otomatis diberi garis coret diagonal 45° (*strikethrough slash*) dan dinonaktifkan.
* **FR-07 (Mobile Sticky Thumb Action Bar di PDP):** Saat pembeli di ponsel scroll melewati galeri foto utama, muncul sticky bottom bar (56px) memuat: thumbnail warna aktif, pill ukuran terpilih, harga, dan tombol tebal `+ Tas Belanja` (tinggi 48px).

#### [MODUL 3: Inovasi Retail LifeWear Cerdas]
* **FR-30 (Smart Size & Fit Predictor Heuristic):**
  * Masukan: Tinggi Badan $H$ (cm), Berat Badan $W$ (kg), preferensi potongan $F \in \{\text{Slim}, \text{Regular}, \text{Oversized}\}$.
  * Rumus dasar estimasi BMI:
    $$\text{BMI} = \frac{W}{(H / 100)^2}$$
  * Matriks Klasifikasi:
    * $\text{BMI} < 18.5$: Rekomendasi S (Slim) / M (Oversized).
    * $18.5 \le \text{BMI} < 23.0$: Rekomendasi M (Slim/Regular) / L (Oversized).
    * $23.0 \le \text{BMI} < 27.5$: Rekomendasi L (Regular) / XL (Oversized).
    * $\text{BMI} \ge 27.5$: Rekomendasi XL atau XXL.
  * Antarmuka menampilkan badge: *"Ukuran Ideal Anda: L (Akurasi Kecocokan 92%)"* dan otomatis memilih ukuran tersebut pada selector ukuran.
* **FR-31 (Interactive Capsule Wardrobe Outfit Builder):**
  * Kanvas interaktif 3 lapis visual:
    1. Layer Atas: Kaos AIRism / Kemeja Flannel / Oxford Shirt.
    2. Layer Bawah: Celana Ankle Pants / Chino Relaxed / Easy Shorts.
    3. Layer Luaran: Parka UV Protection / Cardigan.
  * Pembeli dapat menekan tombol panah kiri-kanan pada masing-masing layer untuk melihat perpaduan warna dan siluet pakaian secara utuh.
  * Menghitung total harga set bundling dengan potongan diskon 15% otomatis.
  * Tombol 1-klik: `+ Masukkan 1 Set OOTD ke Tas Belanja`.
* **FR-32 (Cart Reservation Countdown Timer & Edge Auto-Release):**
  * Ketika produk dengan stok kritis ($< 5$ unit) dimasukkan ke keranjang, sistem mengunci stok sementara selama **10:00 menit** dengan timer mundur aktif.
  * Worker terjadwal (Edge Cron) berjalan setiap 5 menit: memeriksa transaksi Transfer Bank pending yang melewati batas waktu 2 jam (`expires_at < NOW()`). Sistem mengubah status menjadi `Dibatalkan` dan mengembalikan kuantitas stok varian ke tabel `product_variants`.
* **FR-33 (Omnichannel Click & Collect Flagship Store Pamulang):**
  * Opsi pengiriman Rp 0 saat checkout: *"Ambil Langsung di Flagship Store Pamulang (Tangerang Selatan)"*.
  * Begitu pembayaran lunas, faktur digital menerbitkan **Digital Pick-up QR Pass**.
  * Staf kasir toko fisik memiliki menu scanner barcode untuk verifikasi pengambilan barang instan.
* **FR-34 (Fabric Texture Macro Zoom & Weather Tech Badges):**
  * Fitur hover kaca pembesar makro resolusi tinggi pada foto PDP untuk memperlihatkan tekstur serat kain 4K (AIRism mikropori, katun 280 GSM, double-brushed flannel).
  * Badge cuaca kontekstual: *"Optimal untuk Cuaca Tropis 28°C - 35°C (Breathable)"* atau *"Optimal untuk Ruangan Ber-AC & Hawa Dingin"*.
* **FR-35 (Modul Self-Service Retur Garansi 30 Hari):**
  * Halaman `/account/orders` menyediakan tombol *"Ajukan Retur / Tukar Ukuran"*.
  * Form memuat: alasan retur, pilihan tukar ukuran vs refund, dan upload foto bukti kondisi pakaian.
  * Permintaan retur masuk ke tab review admin kasir/gudang untuk disetujui atau ditolak.

#### [MODUL 4: Transaksi, Pembayaran Mandiri & WhatsApp CRM]
* **FR-13 (Transfer Bank 3 Digit Kode Unik Acak):**
  * Sistem membangkitkan kode unik acak 3 digit ($001 \le \text{kode} \le 999$).
  * Total tagihan: $\text{Grand Total} = \text{Subtotal} + \text{Ongkir} - \text{Diskon} + \text{Kode Unik}$.
  * Kode unik dikunci 2 jam untuk identifikasi mutasi otomatis. Tombol 1-klik salin nomor rekening dan salin total nominal tepat.
* **FR-14 (Dynamic QRIS Standar EMVCo & CRC-16):**
  * Mengambil payload QRIS statis toko, menyuntikkan Tag 54 (Nominal), mengubah Tag 01 menjadi 12 (Dinamis), dan menghitung ulang CRC-16/CCITT-FALSE Tag 63.
  * QRIS dirender di layar untuk dipindai oleh seluruh aplikasi m-banking dan e-wallet di Indonesia.
* **FR-15 (Autonomous Webhook Settlement via PaymentGatewayin):**
  * Endpoint `/api/webhooks/payment` menerima notifikasi mutasi masuk dari aplikasi native Android `PaymentGatewayin`.
  * Jika nominal mutasi cocok dengan pesanan pending, status pesanan otomatis berubah menjadi `DIBAYAR` dalam waktu $<3$ detik.
* **FR-36 (Outbound Dispatcher WhatsApp Baileys Microservice):**
  * Endpoint Next.js menembak microservice WhatsApp port 3001 secara asinkron (*fire-and-forget*):
    * Trigger 1: Pesanan Dibuat $\rightarrow$ Mengirim invoice tagihan + rekening/QRIS.
    * Trigger 2: Pembayaran Lunas $\rightarrow$ Mengirim bukti pelunasan dan tautan nota digital.
    * Trigger 3: Pesanan Dikirim $\rightarrow$ Mengirim nama ekspedisi dan nomor resi pelacakan.

#### [MODUL 5: Dasbor Manajemen SIM & DSS Pareto]
* **FR-23 (Multi-Role RBAC Staf):**
  * Owner: hak mutlak seluruh modul, laporan DSS, tambah staf.
  * Gudang: katalog produk, update stok varian, cetak label pengiriman thermal, input nomor resi. Dilarang melihat data omzet keuangan.
  * Kasir: daftar transaksi, verifikasi bukti transfer manual, approval retur.
* **FR-24 (Manajemen Restok Fleksibel):** Input stok varian bebas satuan (`1, 3, 7, 25`) didukung tombol jalan pintas cepat `[+1], [+5], [+10], [+50]`.
* **FR-25 (Decision Support System / DSS Analisis Pareto 80/20):**
  * Klasifikasi ABC: Produk Kelas A (penyumbang 80% omzet), Kelas B (15%), Kelas C (5%).
  * Visualisasi grafik bar kontribusi omzet dan peringatan stok menipis siap cetak laporan A4 UAS.

---

### 7.3. Skema Basis Data Relasional SQL (Supabase DDL Migration)

```sql
-- ==============================================================================
-- URBANSTYLE STORE (V6.0 ENTERPRISE SPECIFICATION MIGRATION DDL)
-- ==============================================================================

-- 1. TABEL PRODUK INDUK
CREATE TABLE IF NOT EXISTS products (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    base_price NUMERIC(12, 2) NOT NULL,
    original_price NUMERIC(12, 2),
    weight_grams INT DEFAULT 300,
    description TEXT,
    fabric_details TEXT,
    care_instructions TEXT,
    climate_suitability VARCHAR(100) DEFAULT 'Tropis (28°C - 35°C)',
    image_url TEXT NOT NULL,
    gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    rating NUMERIC(3, 2) DEFAULT 4.8,
    reviews_count INT DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_new BOOLEAN DEFAULT FALSE,
    is_sale BOOLEAN DEFAULT FALSE,
    gender VARCHAR(20) DEFAULT 'unisex',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. TABEL MULTI-VARIAN PRODUK (SKU-LEVEL INVENTORY)
CREATE TABLE IF NOT EXISTS product_variants (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    color_name VARCHAR(100) NOT NULL,
    color_code VARCHAR(50) NOT NULL,
    color_hex VARCHAR(20) NOT NULL,
    color_image_url TEXT NOT NULL,
    size VARCHAR(10) NOT NULL CHECK (size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL')),
    stock INT NOT NULL DEFAULT 0 CHECK (stock >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_product_color_size UNIQUE(product_id, color_name, size)
);

-- 3. TABEL RESERVASI KERANJANG (ANTI-GHOSTING 10 MENIT)
CREATE TABLE IF NOT EXISTS cart_reservations (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    variant_id BIGINT NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    session_id VARCHAR(150) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABEL KLAIM RETUR & GARANSI 30 HARI
CREATE TABLE IF NOT EXISTS order_returns (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    user_id VARCHAR(100),
    return_type VARCHAR(50) NOT NULL CHECK (return_type IN ('tukar_size', 'cacat_produk', 'refund')),
    target_variant_id BIGINT REFERENCES product_variants(id),
    reason TEXT NOT NULL,
    photo_evidence_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexing untuk optimasi query cepat
CREATE INDEX IF NOT EXISTS idx_product_variants_prod ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_sku ON product_variants(sku);
CREATE INDEX IF NOT EXISTS idx_cart_reservations_exp ON cart_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
```

---

## 8. 🚀 Rencana Peluncuran & Roadmap Eksekusi (Release Plan)

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ROADMAP EKSEKUSI SPRINT                         │
├───────────────────────────────┬────────────────────────────────────────┤
│ SPRINT 1 (P0: Foundation)     │ • Refactor ProductCard.tsx (Uniqlo 1:1)│
│ "Clean Visual & SKU Database" │ • Hapus border-itis & rapikan beranda  │
│                               │ • Eksekusi DDL product_variants Supabase│
├───────────────────────────────┼────────────────────────────────────────┤
│ SPRINT 2 (P1: Experience)     │ • Shimmer Skeleton Loader 1:1          │
│ "Anti-AI Organic Polish"      │ • Smooth Crossfade Color Swatch        │
│                               │ • Mobile Sticky Thumb Action Bar PDP   │
│                               │ • Outbound Webhook WhatsApp Baileys    │
├───────────────────────────────┼────────────────────────────────────────┤
│ SPRINT 3 (P2: Innovation)     │ • Smart Size Recommender (TB/BB)       │
│ "Value-Add Flagship Retail"   │ • Capsule Wardrobe Outfit Builder      │
│                               │ • Click & Collect Flagship Pamulang    │
│                               │ • Modul Retur Garansi 30 Hari          │
└───────────────────────────────┴────────────────────────────────────────┘
```

---

*Dokumen PRD V6.0 ini merupakan spesifikasi acuan tunggal dan sah untuk seluruh perombakan antarmuka dan rekayasa kode pada sistem UrbanStyle Store.*