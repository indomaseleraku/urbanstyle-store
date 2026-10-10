// src/components/e-commerce-product-display-optimization/e-commerce-product-display-optimization-view.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Category } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { 
  ProductDisplayFilterInput, 
  ProductDisplayPreferenceInput,
  productDisplayFilterSchema,
  productDisplayPreferenceSchema
} from '@/lib/validations/e-commerce-product-display-optimization.schema';
import TampilanAntarmukaEComm from './tampilan-antarmuka-e-comm';
import ValidasiInputAlurData from './validasi-input-alur-data';
import IntegrasiDatabaseStatus from './integrasi-database-status';
import ProductDisplayOptimizationForm from './e-commerce-product-display-optimization-form';
import ProductDisplayOptimizationModal from './e-commerce-product-display-optimization-modal';
import ProductDisplayOptimizationSkeleton from './e-commerce-product-display-optimization-skeleton';
import ProductDisplayOptimizationError from './error';
import { ArrowLeft, Sparkles, SlidersHorizontal, Layers, Check } from 'lucide-react';

export default function ECommerceProductDisplayOptimizationView() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const [filters, setFilters] = useState<ProductDisplayFilterInput>({
    category: 'all',
    gender: 'all',
    sortBy: 'featured',
    searchQuery: '',
    inStockOnly: false,
    priceRange: { min: 0, max: 2000000 },
    viewMode: 'grid-4',
  });

  const [preferences, setPreferences] = useState<ProductDisplayPreferenceInput>({
    enableMacroZoom: true,
    showWeatherBadges: true,
    enableColorCrossfade: true,
    displayDensity: 'comfortable',
    highlightDiscountPercent: 10,
  });

  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'katalog' | 'konfigurasi' | 'telemetri'>('katalog');

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [cats, prods] = await Promise.all([
        dataStore.getCategories(),
        dataStore.getProducts(filters.category, filters.searchQuery || '', filters.gender, filters.sortBy),
      ]);
      setCategories(cats);
      setProducts(filters.inStockOnly ? prods.filter(p => p.stock > 0) : prods);
    } catch (err: any) {
      setError(err instanceof Error ? err : new Error('Gagal memuat produk'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      gender: 'all',
      sortBy: 'featured',
      searchQuery: '',
      inStockOnly: false,
      priceRange: { min: 0, max: 2000000 },
      viewMode: 'grid-4',
    });
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Header Breadcrumb */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors rounded-none"
              title="Kembali ke Beranda"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <span>Modul 6</span>
                <span>/</span>
                <span className="text-[#E60012]">E-Commerce Product Display Optimization</span>
              </div>
              <h1 className="text-sm sm:text-base font-black uppercase text-zinc-950 tracking-tight">
                Optimalisasi Tampilan Produk LifeWear (Uniqlo 1:1)
              </h1>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 border border-zinc-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('katalog')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'katalog' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Katalog
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('konfigurasi')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'konfigurasi' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Konfigurasi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('telemetri')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'telemetri' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Telemetri
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Validasi Status Alur Data */}
        <ValidasiInputAlurData
          filters={filters}
          totalFiltered={products.length}
          totalAvailable={40}
          onResetFilters={handleResetFilters}
          isValid={!error}
          validationErrors={error ? [error.message] : []}
        />

        {error ? (
          <ProductDisplayOptimizationError error={error} reset={loadData} />
        ) : activeTab === 'konfigurasi' ? (
          <ProductDisplayOptimizationForm
            initialFilters={filters}
            initialPreferences={preferences}
            onApplyFilters={(f) => setFilters(f)}
            onApplyPreferences={(p) => setPreferences(p)}
          />
        ) : activeTab === 'telemetri' ? (
          <div className="space-y-6">
            <IntegrasiDatabaseStatus
              totalProducts={products.length}
              totalCategories={categories.length}
              dbLatencyMs={38}
              isOnline={true}
              rlsEnabled={true}
            />
            <div className="p-5 bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 space-y-2">
              <h4 className="font-black uppercase text-zinc-950">Parameter Optimasi Rendering Aktif:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Lensa Makro Zoom 2.8x: {preferences.enableMacroZoom ? 'Aktif' : 'Nonaktif'}</li>
                <li>Weather Tech Badges: {preferences.showWeatherBadges ? 'Aktif' : 'Nonaktif'}</li>
                <li>Smooth Color Swatch Crossfade: {preferences.enableColorCrossfade ? 'Aktif' : 'Nonaktif'}</li>
                <li>Kepadatan Layout: {preferences.displayDensity.toUpperCase()}</li>
              </ul>
            </div>
          </div>
        ) : isLoading ? (
          <ProductDisplayOptimizationSkeleton count={8} />
        ) : (
          <TampilanAntarmukaEComm
            products={products}
            preferences={preferences}
            onOpenDetail={(prod) => {
              setSelectedProductForModal(prod);
              setIsModalOpen(true);
            }}
          />
        )}

      </main>

      {/* Modal Dialog Detail Sub-fitur (TASK-MOD-6-06) */}
      <ProductDisplayOptimizationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Inspeksi Parameter Tampilan Produk"
        type="drawer"
        selectedProduct={selectedProductForModal}
      >
        {selectedProductForModal && (
          <div className="space-y-3">
            <p className="text-zinc-600">{selectedProductForModal.description}</p>
            <div className="grid grid-cols-2 gap-2 p-3 bg-zinc-50 border border-zinc-200 text-zinc-700 font-mono text-[11px]">
              <div>Stok Tersedia: <strong className="text-zinc-950">{selectedProductForModal.stock}</strong></div>
              <div>Rating: <strong className="text-zinc-950">{selectedProductForModal.rating}</strong></div>
              <div>Varian Warna: <strong className="text-zinc-950">{selectedProductForModal.colors?.length || 0}</strong></div>
              <div>Varian Ukuran: <strong className="text-zinc-950">{selectedProductForModal.sizes?.join(', ')}</strong></div>
            </div>
          </div>
        )}
      </ProductDisplayOptimizationModal>
    </div>
  );
}
