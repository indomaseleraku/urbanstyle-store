import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env.local manually
const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [k, ...v] = trimmed.split('=');
    envVars[k.trim()] = v.join('=').trim();
  }
});

const url = envVars['NEXT_PUBLIC_SUPABASE_URL'] || '';
const key = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || '';
console.log('Testing Supabase connection to:', url);

const supabase = createClient(url, key);

async function check() {
  const tables = ['categories', 'products', 'orders', 'order_items', 'coupons', 'profiles', 'reviews', 'staff_users'];
  for (const t of tables) {
    try {
      const { data, error, count } = await supabase.from(t).select('*', { count: 'exact', head: true });
      if (error) {
        console.log(`Table "${t}": ERROR -> ${error.message} (code: ${error.code})`);
      } else {
        console.log(`Table "${t}": OK (count: ${count})`);
      }
    } catch (e: any) {
      console.log(`Table "${t}": EXCEPTION -> ${e.message}`);
    }
  }
}
check();
