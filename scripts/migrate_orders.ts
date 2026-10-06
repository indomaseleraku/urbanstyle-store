import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envVars = Object.fromEntries(
  fs.readFileSync('.env.local', 'utf-8')
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.trim().split('='))
);

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.SUPABASE_SERVICE_ROLE_KEY);

async function run() {
  const sql = `
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS unique_code INT DEFAULT 0;
    ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS bank_name VARCHAR(50) DEFAULT 'BCA';
    NOTIFY pgrst, 'reload schema';
  `;
  const { error } = await supabase.rpc('exec_sql', { query: sql });
  console.log('ALTER TABLE ORDERS RESULT:', error ? error.message : 'SUCCESS');
  process.exit(0);
}

run();
