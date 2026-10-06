// app/api/webhooks/payment/route.ts
// Official Payment & Mutation Webhook Receiver Endpoint
// Mendukung integrasi notifikasi HP GoBiz (MacroDroid), Bank Transfer Mutation, Midtrans, Cekmutasi, & Moota

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
      message: 'Webhook endpoint aktif dan siap menerima mutasi transaksi.',
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}
