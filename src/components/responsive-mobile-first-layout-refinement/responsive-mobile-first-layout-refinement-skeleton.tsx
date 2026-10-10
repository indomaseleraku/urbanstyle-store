// src/components/responsive-mobile-first-layout-refinement/responsive-mobile-first-layout-refinement-skeleton.tsx
'use client';

import React from 'react';

export default function ResponsiveMobileFirstLayoutSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Mobile Top Bar Skeleton */}
      <div className="h-12 bg-zinc-200 w-full rounded-none" />

      {/* Hero Banner Skeleton */}
      <div className="aspect-[16/9] sm:aspect-[2/1] bg-zinc-200 w-full rounded-none" />

      {/* Category Horizontal Pill Strip */}
      <div className="flex gap-2 overflow-x-auto py-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 bg-zinc-200 shrink-0 rounded-none" />
        ))}
      </div>

      {/* Grid 2-Kolom Mobile */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[3/4] bg-zinc-200 rounded-none" />
            <div className="h-3 bg-zinc-200 w-3/4" />
            <div className="h-3 bg-zinc-200 w-1/2" />
          </div>
        ))}
      </div>

      {/* Bottom Thumb Bar Skeleton */}
      <div className="fixed bottom-0 inset-x-0 h-14 bg-zinc-300 border-t border-zinc-200 rounded-none" />
    </div>
  );
}
