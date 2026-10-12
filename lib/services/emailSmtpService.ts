// lib/services/emailSmtpService.ts
// Layanan Pengiriman Email via Gmail SMTP dengan Mode Native Gmail (<div dir="ltr">) Anti-Spam

import nodemailer from 'nodemailer';

const rawSmtpUser = process.env.GMAIL_SMTP_USER;
const SMTP_USER =
  rawSmtpUser && rawSmtpUser !== 'thn071205@gmail.com' ? rawSmtpUser : 'kimyeka24245@gmail.com';
const SMTP_PASS = (process.env.GMAIL_SMTP_APP_PASSWORD || 'iazbigdjfimtgfsf').replace(/\s+/g, '');

// Menggunakan nama asli profil Google ("Kimy") agar tidak dianggap spoofing korporat oleh filter gsmtp
const SENDER_DISPLAY = 'Kimy (UrbanStyle)';

function createTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 10000,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  purpose: 'login' | 'register' = 'login'
): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  const cleanTo = toEmail.trim().toLowerCase();
  const actionLabel = purpose === 'register' ? 'pendaftaran member' : 'masuk akun';

  // Struktur <div dir="ltr"> identik dengan email ketikan asli Gmail Web agar lolos filter Spam
  const html = `<div dir="ltr" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #222222; line-height: 1.6;">
  <p>Halo,</p>
  <p>Berikut adalah 6 angka kode untuk melanjutkan ${actionLabel} Anda di UrbanStyle:</p>
  <p style="font-size: 22px; font-weight: bold; letter-spacing: 4px; margin: 16px 0; color: #111111;">${otpCode}</p>
  <p>Silakan masukkan kode tersebut pada halaman aplikasi (berlaku selama 5 menit).</p>
  <p>Terima kasih,<br>Kimy — UrbanStyle</p>
</div>`;

  const text = `Halo,\n\nBerikut adalah 6 angka kode untuk melanjutkan ${actionLabel} Anda di UrbanStyle:\n\n${otpCode}\n\nSilakan masukkan kode tersebut pada halaman aplikasi (berlaku selama 5 menit).\n\nTerima kasih,\nKimy — UrbanStyle`;

  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"${SENDER_DISPLAY}" <${SMTP_USER}>`,
      to: cleanTo,
      subject: `Kode akses UrbanStyle (${otpCode})`,
      text,
      html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal mengirim email SMTP';
    console.error('[emailSmtpService] OTP send error:', msg);
    return { sent: false, error: msg };
  } finally {
    transporter.close();
  }
}

export interface OrderEmailPayload {
  toEmail: string;
  customerName: string;
  orderNumber: string;
  totalAmount: number;
  paymentMethod: string;
  itemsSummary: string;
  shippingAddress?: string;
}

export async function sendOrderNotificationEmail(
  payload: OrderEmailPayload
): Promise<{ sent: boolean; messageId?: string; error?: string }> {
  const cleanTo = payload.toEmail.trim().toLowerCase();
  const formattedTotal = `Rp ${Number(payload.totalAmount || 0).toLocaleString('id-ID')}`;

  const html = `<div dir="ltr" style="font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #222222; line-height: 1.6;">
  <p>Halo ${payload.customerName},</p>
  <p>Terima kasih sudah memesan di UrbanStyle. Berikut catatan pesanan Anda:</p>
  <p>
    Nomor Pesanan: <b>${payload.orderNumber}</b><br>
    Item: ${payload.itemsSummary}<br>
    Pembayaran: ${payload.paymentMethod}<br>
    Total: <b>${formattedTotal}</b>
    ${payload.shippingAddress ? `<br>Alamat Tujuan: ${payload.shippingAddress}` : ''}
  </p>
  <p>Pesanan Anda sedang kami proses.</p>
  <p>Salam,<br>Kimy — UrbanStyle</p>
</div>`;

  const text = `Halo ${payload.customerName},\n\nTerima kasih sudah memesan di UrbanStyle. Berikut catatan pesanan Anda:\n\nNomor Pesanan: ${payload.orderNumber}\nItem: ${payload.itemsSummary}\nPembayaran: ${payload.paymentMethod}\nTotal: ${formattedTotal}${payload.shippingAddress ? `\nAlamat Tujuan: ${payload.shippingAddress}` : ''}\n\nPesanan Anda sedang kami proses.\n\nSalam,\nKimy — UrbanStyle`;

  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"${SENDER_DISPLAY}" <${SMTP_USER}>`,
      to: cleanTo,
      subject: `Catatan pesanan UrbanStyle ${payload.orderNumber}`,
      text,
      html,
    });
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal mengirim email pesanan';
    console.error('[emailSmtpService] Order email error:', msg);
    return { sent: false, error: msg };
  } finally {
    transporter.close();
  }
}
