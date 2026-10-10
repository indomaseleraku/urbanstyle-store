import { Metadata } from 'next';
import { SupabasePostgresqlDatabaseImplementationView } from '@/src/components/supabase-postgresql-database-implementation/supabase-postgresql-database-implementation-view';

export const metadata: Metadata = {
  title: 'Skema Database PostgreSQL | UrbanStyle Store LifeWear',
  description: 'Arsitektur relasional database Supabase PostgreSQL dan RLS policy Uniqlo-Style.',
};

export default function SupabasePostgresqlDatabaseImplementationPage() {
  return <SupabasePostgresqlDatabaseImplementationView />;
}
