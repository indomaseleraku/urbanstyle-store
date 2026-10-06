// app/api/orders/route.ts
import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/store';

export async function GET() {
  try {
    const orders = await dataStore.getOrders();
    return NextResponse.json({
      success: true,
      count: orders.length,
      data: orders,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat daftar pesanan' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validasi payload
    if (!body.customer_name || !body.customer_phone || !body.customer_address || !body.cart_items) {
      return NextResponse.json(
        { success: false, message: 'Payload tidak lengkap. Nama, telepon, alamat, dan item keranjang wajib diisi.' },
        { status: 400 }
      );
    }

    const result = await dataStore.createOrder(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Pesanan berhasil dibuat dan stok fisik telah dipotong secara atomik.',
        order: result.order,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan internal server' },
      { status: 500 }
    );
  }
}
