// app/e-commerce-product-display-optimization/page.tsx
import React from 'react';
import { Metadata } from 'next';
import ECommerceProductDisplayOptimizationView from '@/src/components/e-commerce-product-display-optimization/e-commerce-product-display-optimization-view';

export const metadata: Metadata = {
  title: 'E-Commerce Product Display Optimization | UrbanStyle Store',
  description: 'Optimalisasi tampilan produk LifeWear 1:1 standar industri Uniqlo',
};

export default function ECommerceProductDisplayOptimizationPage() {
  return <ECommerceProductDisplayOptimizationView />;
}
