import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf-8');
const envVars = Object.fromEntries(
  envContent.split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.trim().split('='))
);

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const sql = `
  CREATE TABLE IF NOT EXISTS public.staff_users (
      id TEXT PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      phone VARCHAR(50),
      role VARCHAR(50) NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  ALTER TABLE public.staff_users ENABLE ROW LEVEL SECURITY;
  DO $$ BEGIN
    CREATE POLICY "Public Read Staff" ON public.staff_users FOR SELECT USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE POLICY "Public Manage Staff" ON public.staff_users FOR ALL USING (true);
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  INSERT INTO public.staff_users (id, name, email, phone, role, is_active)
  VALUES
      ('stf_1', 'Administrator (Owner Store)', 'admin@urbanstyle.com', '081199887766', 'owner', TRUE),
      ('stf_2', 'Staf Logistik & Gudang', 'gudang@urbanstyle.com', '081122334455', 'gudang', TRUE),
      ('stf_3', 'Staf Kasir & Finance', 'kasir@urbanstyle.com', '081177665544', 'kasir', TRUE)
  ON CONFLICT (id) DO NOTHING;
  `;

  const { error: rpcError } = await supabase.rpc('exec_sql', { query: sql });
  console.log('RPC execution error:', rpcError);

  const { data, error: selectError } = await supabase.from('staff_users').select('*');
  console.log('staff_users in Supabase:', data);
  console.log('staff_users select error:', selectError);
  process.exit(0);
}

run();
