// app/api/notifications/email/route.ts
// Endpoint Pengiriman Notifikasi Email Transaksi / Pesanan ke Gmail Pelanggan

import { NextRequest, NextResponse } from 'next/server';
import { sendOrderNotificationEmail } from '@/lib/services/emailSmtpService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const toEmail = String(body.toEmail || body.email || '').trim().toLowerCase();
    if (!toEmail || !toEmail.includes('@')) {
      return NextResponse.json(
        { success: false, message: 'Alamat email penerima tidak valid.' },
        { status: 400 }
      );
    }

    const res = await sendOrderNotificationEmail({
      toEmail,
      customerName: String(body.customerName || 'Pelanggan UrbanStyle'),
      orderNumber: String(body.orderNumber || `INV-${Date.now()}`),
      totalAmount: Number(body.totalAmount || 0),
      paymentMethod: String(body.paymentMethod || 'QRIS / Transfer'),
      itemsSummary: String(body.itemsSummary || 'Koleksi Pakaian UrbanStyle LifeWear'),
      shippingAddress: body.shippingAddress ? String(body.shippingAddress) : undefined,
    });

    if (!res.sent) {
      return NextResponse.json(
        { success: false, message: res.error || 'Gagal mengirim email notifikasi.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: res.messageId,
      message: `Email konfirmasi pesanan berhasil dikirim ke ${toEmail}.`,
    });
  } catch (err) {
    console.error('[/api/notifications/email] Error:', err);
    return NextResponse.json(
      { success: false, message: 'Gagal memproses pengiriman notifikasi email.' },
      { status: 500 }
    );
  }
}
