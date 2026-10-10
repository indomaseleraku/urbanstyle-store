import assert from 'node:assert/strict';
import { 
  realtimeSubscriptionSchema, 
  realtimeBroadcastMessageSchema 
} from '../../../lib/validations/supabase-realtime-for-inventory-updates.schema';

console.log('=== [TEST SUITE: MODUL 3 - SUPABASE REALTIME FOR INVENTORY UPDATES] ===');

export async function runModul3Tests() {
  // Test 1: Happy Path Channel Subscription
  const validSub = realtimeSubscriptionSchema.parse({
    channelName: 'realtime:inventory-updates',
    event: '*',
    schema: 'public',
    table: 'product_variants',
    heartbeatIntervalMs: 30000,
  });
  assert.equal(validSub.channelName, 'realtime:inventory-updates');
  assert.equal(validSub.table, 'product_variants');
  assert.equal(validSub.heartbeatIntervalMs, 30000);
  console.log('  ✓ Happy path Zod realtime subscription schema lolos');

  // Test 2: Channel Name Boundary & Characters
  const invalidChannel = realtimeSubscriptionSchema.safeParse({
    channelName: 'bad channel with space & special !#@$',
    table: 'product_variants',
  });
  assert.equal(invalidChannel.success, false);
  console.log('  ✓ Channel identifier dengan karakter tidak sah berhasil ditolak');

  // Test 3: Heartbeat Interval Boundary (min 1000ms, max 60000ms)
  const tooFastHeartbeat = realtimeSubscriptionSchema.safeParse({
    channelName: 'realtime:test',
    heartbeatIntervalMs: 200, // below min 1000ms
  });
  assert.equal(tooFastHeartbeat.success, false);
  console.log('  ✓ Heartbeat interval terlalu rendah (<1000ms) berhasil ditolak');

  // Test 4: Realtime Broadcast Message Schema
  const validBroadcast = realtimeBroadcastMessageSchema.parse({
    topic: 'inventory:sync',
    event: 'stock_updated',
    payload: { sku: 'UQ-AIRISM-01', newStock: 140 },
    clientTimestamp: Date.now(),
  });
  assert.equal(validBroadcast.topic, 'inventory:sync');
  assert.equal(validBroadcast.event, 'stock_updated');
  console.log('  ✓ Broadcast message schema validation lolos');

  console.log('✓ [MODUL 3] Seluruh pengujian otomatis 100% PASS!\n');
}

runModul3Tests().catch((err) => {
  console.error('Modul 3 test failed:', err);
  process.exit(1);
});
