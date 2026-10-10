import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qrrdfbdzcozjdaysfimi.supabase.co',
  'sb_secret_8BPG4cVx1mzo_mvwYsX2HA_6JynTSuH'
);

async function main() {
  const { data, error } = await supabase
    .from('orders')
    .select('id, order_number, total_amount, status, payment_method, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) {
    console.error('Error fetching orders:', error);
    return;
  }
  console.log('RECENT_ORDERS:', JSON.stringify(data, null, 2));
}

main();
