import { Metadata } from 'next';
import { InventoryTrackingWithTimeBoundLockingView } from '@/src/components/inventory-tracking-with-time-bound-locking/inventory-tracking-with-time-bound-locking-view';

export const metadata: Metadata = {
  title: 'Pelacakan Inventaris & Kunci Stok | UrbanStyle Store LifeWear',
  description: 'Sistem time-bound inventory locking dengan pembebasan otomatis pg_cron Uniqlo-Style.',
};

export default function InventoryTrackingWithTimeBoundLockingPage() {
  return <InventoryTrackingWithTimeBoundLockingView />;
}
