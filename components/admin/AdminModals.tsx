// components/admin/AdminModals.tsx
'use client';

import React from 'react';
import { Product, Order } from '@/lib/types';
import { EditProductModal } from './modals/EditProductModal';
import { ExactStockModal } from './modals/ExactStockModal';
import { ThermalLabelModal } from './modals/ThermalLabelModal';

interface AdminModalsProps {
  editingProduct: Product | null;
  onCloseEditProduct: () => void;
  onUpdateProduct: (p: Product) => Promise<void>;
  exactStockModal: { product: Product; newStock: number } | null;
  onCloseExactStock: () => void;
  onSetExactStock: (productId: number, qty: number) => Promise<void>;
  shippingLabelOrder: Order | null;
  onCloseShippingLabel: () => void;
}

export default function AdminModals({
  editingProduct,
  onCloseEditProduct,
  onUpdateProduct,
  exactStockModal,
  onCloseExactStock,
  onSetExactStock,
  shippingLabelOrder,
  onCloseShippingLabel,
}: AdminModalsProps) {
  return (
    <>
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={onCloseEditProduct}
          onSave={onUpdateProduct}
        />
      )}

      {exactStockModal && (
        <ExactStockModal
          data={exactStockModal}
          onClose={onCloseExactStock}
          onSave={onSetExactStock}
        />
      )}

      {shippingLabelOrder && (
        <ThermalLabelModal
          order={shippingLabelOrder}
          onClose={onCloseShippingLabel}
        />
      )}
    </>
  );
}
