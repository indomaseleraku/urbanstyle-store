// app/responsive-mobile-first-layout-refinement/page.tsx
import React from 'react';
import { Metadata } from 'next';
import ResponsiveMobileFirstLayoutRefinementView from '@/src/components/responsive-mobile-first-layout-refinement/responsive-mobile-first-layout-refinement-view';

export const metadata: Metadata = {
  title: 'Responsive Mobile-First Layout Refinement | UrbanStyle Store',
  description: 'Desain antarmuka ponsel responsif zona jempol Uniqlo LifeWear 1:1',
};

export default function ResponsiveMobileFirstLayoutRefinementPage() {
  return <ResponsiveMobileFirstLayoutRefinementView />;
}
