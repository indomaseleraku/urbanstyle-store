// app/api/orders/[orderNumber]/status/route.ts
// Real-time Status & Autonomous Settlement API
import { NextResponse } from 'next/server';
import { settlementService } from '@/lib/services/settlementService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const resolvedParams = await params;
    const orderNumber = resolvedParams.orderNumber;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Nomor pesanan wajib disertakan.' },
        { status: 400 }
      );
    }

    const result = await settlementService.checkAndSettleOrder(orderNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.reason },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order_number: result.order?.order_number,
      status: result.order?.status,
      settled: result.settled,
      remaining_ms: result.remainingMs || 0,
      total_amount: result.order?.total_amount,
      payment_method: result.order?.payment_method,
      reason: result.reason,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const resolvedParams = await params;
    const orderNumber = resolvedParams.orderNumber;

    if (!orderNumber) {
      return NextResponse.json(
        { success: false, message: 'Nomor pesanan wajib disertakan.' },
        { status: 400 }
      );
    }

    const success = await settlementService.simulateInstantSettle(orderNumber);
    if (!success) {
      return NextResponse.json(
        { success: false, message: `Gagal memperbarui status pesanan #${orderNumber}.` },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      order_number: orderNumber,
      status: 'Dibayar',
      message: `Pesanan #${orderNumber} berhasil diverifikasi dan ditandai lunas oleh sistem.`,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
