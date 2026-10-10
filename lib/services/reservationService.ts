// lib/services/reservationService.ts
// 10-Minute Time-Bound Inventory Reservation Service (PRD 3.0 Seksi 5 & 6)

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { CartItem } from '../types';

export interface CartReservation {
  id: string;
  session_id: string;
  product_id: number;
  selected_size: string;
  selected_color: string;
  quantity: number;
  expires_at: string;
  created_at: string;
}

const RESERVATION_DURATION_MS = 10 * 60 * 1000; // 10 menit
let localReservations: CartReservation[] = [];

export const reservationService = {
  getReservationDurationSeconds(): number {
    return 600; // 10 menit
  },

  cleanExpired(): void {
    const now = new Date().toISOString();
    localReservations = localReservations.filter((r) => r.expires_at > now);
  },

  async reserveItems(
    sessionId: string,
    items: CartItem[]
  ): Promise<{ success: boolean; expiresAt: Date; message?: string }> {
    this.cleanExpired();
    const expiresAt = new Date(Date.now() + RESERVATION_DURATION_MS);
    const expiresAtIso = expiresAt.toISOString();

    // Hapus reservasi lama untuk session_id ini
    localReservations = localReservations.filter((r) => r.session_id !== sessionId);

    const newReservations: CartReservation[] = items.map((it) => ({
      id: `res-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      session_id: sessionId,
      product_id: it.product.id,
      selected_size: it.selected_size,
      selected_color: it.selected_color,
      quantity: it.quantity,
      expires_at: expiresAtIso,
      created_at: new Date().toISOString(),
    }));

    localReservations.push(...newReservations);

    // Sinkronkan ke Supabase jika aktif
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cart_reservations').delete().eq('session_id', sessionId);
        const records = items.map((it) => ({
          session_id: sessionId,
          product_id: it.product.id,
          selected_size: it.selected_size,
          selected_color: it.selected_color,
          quantity: it.quantity,
          expires_at: expiresAtIso,
        }));
        await supabase.from('cart_reservations').insert(records);
      } catch (err) {
        console.warn('Supabase cart reservation sync error:', err);
      }
    }

    return { success: true, expiresAt };
  },

  async releaseReservation(sessionId: string): Promise<boolean> {
    localReservations = localReservations.filter((r) => r.session_id !== sessionId);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('cart_reservations').delete().eq('session_id', sessionId);
      } catch (err) {
        console.warn('Supabase release reservation error:', err);
      }
    }
    return true;
  },

  async getReservedQuantity(
    productId: number,
    size?: string,
    color?: string
  ): Promise<number> {
    this.cleanExpired();
    return localReservations
      .filter((r) => {
        if (r.product_id !== productId) return false;
        if (size && r.selected_size !== size) return false;
        if (color && r.selected_color !== color) return false;
        return true;
      })
      .reduce((sum, r) => sum + r.quantity, 0);
  },
};
