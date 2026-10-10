import { z } from 'zod';

export const realtimeSubscriptionSchema = z.object({
  channelName: z.string().min(3, 'Nama channel minimal 3 karakter').regex(/^[a-zA-Z0-9:_-]+$/, 'Format nama channel tidak valid'),
  event: z.enum(['INSERT', 'UPDATE', 'DELETE', '*']).default('*'),
  schema: z.string().default('public'),
  table: z.enum(['products', 'product_variants', 'inventory_locks', 'orders']).default('product_variants'),
  filter: z.string().optional(),
  heartbeatIntervalMs: z.number().int().min(1000).max(60000).default(30000),
});

export const realtimeBroadcastMessageSchema = z.object({
  topic: z.string().min(2, 'Topic minimal 2 karakter'),
  event: z.string().min(2, 'Event identifier minimal 2 karakter'),
  payload: z.record(z.string(), z.any()),
  clientTimestamp: z.number().int().positive(),
});

export type RealtimeSubscriptionInput = z.infer<typeof realtimeSubscriptionSchema>;
export type RealtimeBroadcastMessage = z.infer<typeof realtimeBroadcastMessageSchema>;
