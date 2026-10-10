import { Metadata } from 'next';
import { SupabaseRealtimeForInventoryUpdatesView } from '@/src/components/supabase-realtime-for-inventory-updates/supabase-realtime-for-inventory-updates-view';

export const metadata: Metadata = {
  title: 'Realtime Replikasi Stok | UrbanStyle Store LifeWear',
  description: 'Pembaruan inventaris realtime via Supabase WebSockets & Postgres CDC Uniqlo-Style.',
};

export default function SupabaseRealtimeForInventoryUpdatesPage() {
  return <SupabaseRealtimeForInventoryUpdatesView />;
}
