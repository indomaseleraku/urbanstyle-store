# 🥋 UNIQLO LIFEWEAR 1:1 UI ALIGNMENT SPECIFICATION V4.0
## UrbanStyle Store — Standar Rekayasa Antarmuka, Storytelling & Ergonomi Mobile
**Dokumen:** `UNIQLO_UI_ALIGNMENT_SPEC.md`  
**Proyek:** UrbanStyle Store (SIM E-Commerce Retail Fashion)  
**Pengembang:** Kimy Eka Ardiansyah (Teknik Informatika, Universitas Pamulang)  
**Peran PM:** Project Management & QA Lead  
**Target:** Sidang UAS & Publikasi Jurnal Ilmiah JIUP (10 Oktober 2026)  
**Status:** Approved for Implementation (Siap Dieksekusi Dev)  

---

## 1. 📐 DNA Desain & Token Visual Resmi Uniqlo

Seluruh komponen dalam antarmuka UrbanStyle Store **WAJIB** tunduk pada 6 aturan baku sistem desain Uniqlo LifeWear:

| Parameter Desain | Token Tailwind / CSS | Nilai Warna / Ukuran | Keterangan & Rujukan |
| :--- | :--- | :--- | :--- |
| **Primary Brand Red** | `bg-[#E60012]`, `text-[#E60012]` | `#E60012` | Merah resmi Uniqlo. Dilarang menggunakan `#EF4444` atau `#DC2626`. |
| **Base Pure Canvas** | `bg-white`, `bg-[#FFFFFF]` | `#FFFFFF` | Kanvas latar belakang putih bersih tanpa gradasi murahan. |
| **Typography Dark** | `text-[#111111]`, `text-zinc-950` | `#111111` | Hitam arang pekat (*Stark Jet Black*) untuk kontras rasio WCAG AAA. |
| **Hairline Dividers** | `border-zinc-200` (1px) | `#E5E5E5` | Garis pembatas tipis 1px netral, bersih, dan konsisten. |
| **Border Radius** | `rounded-none` | `0px` | **Prinsip Utama:** Sudut tajam 90° di seluruh kartu, tombol, badge, modal, dan bar. Dilarang `rounded-md` atau `rounded-full` (kecuali avatar bulat). |
| **Rasio Gambar Katalog** | `aspect-[3/4]` | $3:4$ Portrait | Rasio potret majalah mode untuk memperlihatkan proporsi pakaian secara utuh. |

---

## 2. 🏛️ Blueprint Redesain Beranda: Dari "Katalog Gudang" ke "Flagship Editorial"

Uniqlo tidak menumpuk 40 produk sekaligus di halaman utama. Halaman utama disusun seperti **majalah gaya hidup** dengan ritme visual (*visual rhythm*) berikut:

```
┌────────────────────────────────────────────────────────────────────────┐
│ [US] [ユニ]  SEMUA KOLEKSI   PRIA   WANITA   LIMITED OFFER   🔍 ❤️ 🛍️ 👤│ <- SECTION 1: Dynamic Frosted Header
├────────────────────────────────────────────────────────────────────────┤
│ [ HERO CAROUSEL: LOOKBOOK AUTUMN / WINTER 2026 ]                       │ <- SECTION 2: Hero Editorial Banner
├────────────────────────────────────────────────────────────────────────┤
│ (Foto) Kemeja  │ (Foto) Kaos AIRism │ (Foto) Chino │ (Foto) Outerwear  │ <- SECTION 3: Visual Category Bubbles
├────────────────────────────────────────────────────────────────────────┤
│ 🏷️ PENAWARAN TERBATAS MINGGU INI (LIMITED OFFER 🔥)                    │ <- SECTION 4: 4 Produk Sale Terpilih
│ [Produk 1]          [Produk 2]          [Produk 3]         [Produk 4]  │
├────────────────────────────────────────────────────────────────────────┤
│ 📖 FILOSOFI TEKSTIL RESMI (AIRism & Double-Brushed Cotton Story)       │ <- SECTION 5: Narasi & Edukasi Bahan
│ [ Foto Editorial Model Santai ]  "Bernapas Bebas di Cuaca Tropis..."   │
├────────────────────────────────────────────────────────────────────────┤
│ ⭐ KOLEKSI ESENSIAL TERLARIS (BEST OF LIFEWEAR)                        │ <- SECTION 6: 4 Produk Terpopuler
│ [Produk 5]          [Produk 6]          [Produk 7]         [Produk 8]  │
├────────────────────────────────────────────────────────────────────────┤
│ ✨ INSPIRASI GAYA OOTD (STYLEHINT COMMUNITY GRID)                      │ <- SECTION 7: Galeri Gaya Nyata
│ [Look 1: Kasual]   [Look 2: Kampus]   [Look 3: Smart]   [Look 4: Outer]│
├────────────────────────────────────────────────────────────────────────┤
│ 🪪 BENEFIT MEMBER (KARTU DIGITAL BARCODE & VOUCHER RP 50.000)          │ <- SECTION 8: Loyalty Member Banner
├────────────────────────────────────────────────────────────────────────┤
│ 🎛️ EKSPLORASI SELURUH KOLEKSI (Filter Kategori, Gender, Cari & Sortir) │ <- SECTION 9: Full Catalog Browser
├────────────────────────────────────────────────────────────────────────┤
│ 🦶 FOOTER RESMI MULTI-LAYER (Newsletter, Trust Badges, Sitemap, Legal) │ <- SECTION 10: Rich Footer
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. 🛠️ Daftar Tiket Spesifikasi Teknis Developer

Berikut adalah 8 tiket spesifikasi teknis presisi untuk developer:

### [TICKET-01] Header Dinamis Kaca Buram (*Dynamic Frosted Header*)
* **File Target:** `components/Navbar.tsx` & `app/page.tsx`
* **Spesifikasi:**
  - Saat posisi scroll berada di paling atas (`scrollY === 0`): Header menyatu dengan hero banner (bisa semi-transparan dengan border lembut).
  - Saat di-scroll melewati hero (`scrollY > 50`): Header berubah menjadi `bg-white/95 backdrop-blur-md border-b border-zinc-200 shadow-xs`.
  - Transisi pergantian warna berlangsung mulus (`transition-all duration-300`).

---

### [TICKET-02] Gelembung Kategori Bergambar Model (*Visual Category Story Bubbles*)
* **File Target:** `components/CategoryBubbles.tsx` (Komponen baru) & `app/page.tsx`
* **Spesifikasi:**
  - Letakkan tepat di bawah Hero Lookbook Carousel.
  - Setiap kategori ditampilkan dengan **foto model lingkaran/kotak 1:1 mini** mengenakan pakaian kategori tersebut:
    1. **Kemeja & Flannel:** Foto model kemeja kotak tartan.
    2. **Kaos & AIRism:** Foto model kaos boxy 280 GSM.
    3. **Celana Chino & Ankle:** Foto model celana ankle stretch.
    4. **Jaket & Outerwear:** Foto model parka ultra-light.
    5. **Limited Offer 🔥:** Foto dengan badge diskon merah menyala.
  - Di layar desktop: Grid 5 kolom rapi di tengah halaman.
  - Di layar mobile: Deretan gelembung foto yang bisa **di-swipe horizontal** (`flex overflow-x-auto no-scrollbar gap-4 px-4 py-3`).
  - Efek klik: Mengarahkan katalog ke kategori tersebut secara instan.

---

### [TICKET-03] Seksi Narasi Teknologi Tekstil (*The LifeWear Philosophy Story*)
* **File Target:** `components/LifeWearStorySection.tsx` (Komponen baru) & `app/page.tsx`
* **Spesifikasi:**
  - Layout dua kolom (*split screen*):
    - **Kolom Kiri (Visual):** Foto editorial berkualitas tinggi model pakaian santai/kampus dengan filter kehangatan lembut.
    - **Kolom Kanan (Narasi):**
      - Tag merah kecil: `FILOSOFI TEKSTIL LIFEWEAR`
      - Judul besar: `"AIRism & Cotton: Bernapas Bebas di Bawah Terik Tropis"`
      - Penjelasan: *"Ditenun dari serat berpori mikro kapiler yang melepaskan hawa panas tubuh secara instan, dipadukan katun 280 GSM bertekstur tebal yang jatuh sempurna tanpa mudah kusut. Pakaian yang diciptakan untuk membuat aktivitas sehari-hari lebih nyaman."*
      - Tombol tajam: `JELAJAHI INOVASI AIRism ->` (Memicu filter ke kategori Kaos & AIRism).

---

### [TICKET-04] Kurasi Beranda Tematik (Pemisahan Grid 40 Produk)
* **File Target:** `app/page.tsx`
* **Spesifikasi:**
  - Jangan langsung menampilkan 40 produk dalam satu grid membosankan.
  - Bagi menjadi 2 sorotan kurasi teratas:
    1. **Seksi "Penawaran Terbatas (LIMITED OFFER 🔥)":** Ambil 4 produk yang memiliki diskon (`original_price > price`).
    2. **Seksi "Koleksi Paling Populer (BEST OF LIFEWEAR)":** Ambil 4 produk dengan rating tertinggi (4.8 - 5.0).
  - Setiap seksi memiliki judul tebal huruf kapital, deskripsi 1 baris, dan tombol *"Lihat Semua Koleksi"*.
  - Di bawahnya, sediakan seksi pencarian & filter lengkap bagi user yang ingin menjelajahi seluruh katalog 40 produk.

---

### [TICKET-05] 5-Tab Sticky Bottom Navigation Bar di Mobile (Thumb Zone)
* **File Target:** `app/page.tsx`
* **Spesifikasi:**
  - Pada layar ponsel (`md:hidden`), pasang sticky bottom bar melayang di bawah layar (`fixed bottom-0 inset-x-0 z-30 bg-white border-t border-zinc-200 py-2 flex justify-around shadow-lg`).
  - 5 Tab Wajib:
    1. 🏠 **Beranda** (Home & Reset Filter)
    2. 📂 **Kategori** (Scroll mulus ke gelembung kategori)
    3. ❤️ **Favorit** (Buka Wishlist Drawer + badge angka merah)
    4. 🛍️ **Tas Belanja** (Buka Cart Drawer + badge angka merah)
    5. 👤 **Akun / Member** (Buka portal akun / modal login)
  - Tambahkan padding bawah `pb-24 md:pb-8` pada kontainer utama beranda agar kartu produk terbawah tidak tertutup bottom bar.

---

### [TICKET-06] Efek Coret Diagonal pada Ukuran Habis di PDP
* **File Target:** `app/product/[id]/page.tsx`
* **Spesifikasi:**
  - Jika suatu ukuran bernilai stok `0`, berikan efek visual khas Uniqlo berupa **garis coret diagonal 45°** (*diagonal strikethrough line*), bukan sekadar opacity pudar:
  ```tsx
  className={`relative px-4 py-2 text-xs font-bold border transition-all ${
    isOutOfStock 
      ? 'border-zinc-200 text-zinc-300 bg-zinc-50 cursor-not-allowed overflow-hidden after:content-[""] after:absolute after:inset-0 after:border-t after:border-zinc-300 after:rotate-45 after:translate-y-1/2'
      : isSelected
      ? 'border-zinc-950 bg-zinc-950 text-white'
      : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-950'
  }`}
  ```

---

### [TICKET-07] Redesain Footer Kaya Informasi Multi-Layer
* **File Target:** `components/Footer.tsx`
* **Spesifikasi:**
  - **Tingkat 1 (Newsletter Bar):** Form langganan email: *"Dapatkan Voucher Rp 50.000 untuk Pembelian Pertama"* dengan tombol hitam tajam `DAFTAR SEKARANG`.
  - **Tingkat 2 (Value Proposition):** 4 pilar: Bebas Ongkir >400rb, Garansi 30 Hari, 100% Produk Original LifeWear, Bayar QRIS Instan.
  - **Tingkat 3 (Sitemap Kolom):** Kolom Tentang UrbanStyle, Panduan & Bantuan, Portal Akun Member. Di layar ponsel, kolom ini otomatis menjadi **accordion yang bisa dibuka-tutup** (`+` dan `-`).
  - **Tingkat 4 (Trust Badges):** Deretan logo monokrom resmi: QRIS, BCA, Mandiri, BNI, BRI, J&T Express, JNE, SiCepat.
  - **Tingkat 5 (Legal):** Copyright © 2026 UrbanStyle Store. Dibuat oleh Kimy Eka Ardiansyah (Teknik Informatika, UNPAM).

---

### [TICKET-08] Eliminasi Bug Kritis Admin Infinite Redirect Loop (P0)
* **File Target:** `app/page.tsx` (baris 27-31) & `middleware.ts` (baris 13-15)
* **Spesifikasi:**
  - Hapus blok auto-redirect paksa ke `/admin` saat akun admin login.
  - Admin harus bebas menjelajahi katalog toko `/` tanpa mental kembali ke dashboard.

---

## 4. 🧪 Protokol Verifikasi QA (Uji 3 Lapis)

1. **Lapis 1 (Happy Path):** Seluruh seksi beranda (Hero, Bubbles, Limited Offer, Storytelling, Best Sellers, StyleHint, Footer) tampil dan responsif di mobile & desktop.
2. **Lapis 2 (Adversarial):** Bottom navigation bar tidak menutupi tombol modal, dan swipe horizontal kategori lancar di layar sentuh ponsel.
3. **Lapis 3 (Kompilasi):** `npm test` lulus **100% PASS** dan `npm run build` sukses mengompilasi 13 rute tanpa error.
