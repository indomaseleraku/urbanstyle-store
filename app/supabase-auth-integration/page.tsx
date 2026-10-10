import { Metadata } from 'next';
import { SupabaseAuthIntegrationView } from '@/src/components/supabase-auth-integration/supabase-auth-integration-view';

export const metadata: Metadata = {
  title: 'Supabase Auth & RBAC | UrbanStyle Store LifeWear',
  description: 'Integrasi otentikasi Supabase GoTrue dan otorisasi profil RBAC Uniqlo-Style.',
};

export default function SupabaseAuthIntegrationPage() {
  return <SupabaseAuthIntegrationView />;
}
