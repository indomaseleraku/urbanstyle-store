'use strict';
import React from 'react';

export const InventoryTrackingWithTimeBoundLockingSkeleton: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-36 bg-gray-200" />
          <div className="h-6 w-80 bg-gray-300" />
          <div className="h-3 w-96 bg-gray-100" />
        </div>
        <div className="h-10 w-44 bg-gray-200" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-24 bg-gray-200" />
        <div className="h-24 bg-gray-200" />
        <div className="h-24 bg-gray-200" />
      </div>

      <div className="bg-white border border-gray-200 p-4 space-y-3">
        <div className="h-8 bg-gray-100" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-50 border border-gray-100 flex items-center justify-between px-4">
            <div className="h-4 w-40 bg-gray-200" />
            <div className="h-4 w-32 bg-gray-200" />
            <div className="h-4 w-20 bg-gray-200" />
            <div className="h-4 w-16 bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
};
export default InventoryTrackingWithTimeBoundLockingSkeleton;
