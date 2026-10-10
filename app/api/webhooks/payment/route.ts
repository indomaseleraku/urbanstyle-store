// app/api/webhooks/payment/route.ts
// Official Payment & Mutation Webhook Receiver Endpoint dengan Proteksi Secret Signature
// Mendukung integrasi notifikasi HP GoBiz (MacroDroid), Bank Transfer Mutation, Midtrans, & PaymentGatewayin

import { NextResponse } from 'next/server';
import { settlementService } from '@/lib/services/settlementService';

export async function POST(request: Request) {
  try {
    let body: any;
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        body = await request.json();
      } catch (jsonErr) {
        return NextResponse.json(
          { success: false, message: 'Format JSON payload tidak valid.' },
          { status: 400 }
        );
      }
    } else {
      // Menerima plain text (misal raw notification push dari MacroDroid)
      const text = await request.text();
      body = { raw_text: text };
    }

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Payload webhook kosong atau tidak terbaca.' },
        { status: 400 }
      );
    }

    // 1. Verifikasi Keamanan: Webhook Secret Token Protection (Anti Free-Order Exploit)
    const expectedSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'urbanstyle_webhook_secret_2026';
    const secretHeader = request.headers.get('x-webhook-secret') || '';
    const authHeader = request.headers.get('authorization') || '';
    const bearerSecret = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    const providedSecret = secretHeader || bearerSecret || body.secret;

    const isPingOnly = Boolean(
      body.is_test ||
      body.channel === 'Test Ping' ||
      body.app_name === 'Test Ping' ||
      body.title === 'Uji Coba Ping' ||
      (typeof body.raw_text === 'string' && body.raw_text.toLowerCase().includes('ping'))
    );

    // Jika bukan sekadar ping dan secret tidak cocok, tolak request seketika
    if (!isPingOnly && (!providedSecret || providedSecret !== expectedSecret)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak: Kunci autentikasi webhook (x-webhook-secret) tidak valid atau tidak disertakan.',
        },
        { status: 401 }
      );
    }

    const result = await settlementService.processPaymentWebhook(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.message,
          order_number: result.order_number,
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        order_number: result.order_number,
        amount: result.amount,
        previous_status: result.previous_status,
        new_status: result.new_status,
        message: result.message,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Terjadi kesalahan sistem saat memproses webhook.',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      service: 'PaymentGatewayin Webhook Receiver',
      status: 'ONLINE',
      message: 'Webhook endpoint aktif dan terproteksi oleh secret signature.',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
