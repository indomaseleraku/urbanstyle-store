// lib/services/emailSmtpService.ts
// Layanan Pengiriman Email Resmi via Gmail SMTP (Dioptimalkan Anti-Spam Inbox Placement)

import nodemailer from 'nodemailer';
import crypto from 'crypto';

const rawSmtpUser = process.env.GMAIL_SMTP_USER;
const SMTP_USER =
  rawSmtpUser && rawSmtpUser !== 'thn071205@gmail.com' ? rawSmtpUser : 'kimyeka24245@gmail.com';
const SMTP_PASS = (process.env.GMAIL_SMTP_APP_PASSWORD || 'iazbigdjfimtgfsf').replace(/\s+/g, '');
const SENDER_NAME = process.env.GMAIL_SENDER_NAME || 'UrbanStyle Store';

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
  const actionLabel = purpose === 'register' ? 'pendaftaran akun baru' : 'masuk ke akun';

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Kode Verifikasi UrbanStyle</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #18181b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7;">
    <tr>
      <td style="padding: 20px 24px; border-bottom: 3px solid #E60012;">
        <strong style="font-size: 16px; color: #111111; letter-spacing: 0.5px;">UrbanStyle LifeWear</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 28px 24px;">
        <p style="font-size: 15px; font-weight: 600; margin: 0 0 12px 0; color: #111111;">
          Halo,
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 20px 0;">
          Kami menerima permintaan untuk ${actionLabel} di UrbanStyle menggunakan alamat email <strong>${cleanTo}</strong>. Berikut adalah 6 digit kode verifikasi Anda:
        </p>
        <div style="background-color: #f4f4f5; border: 1px solid #d4d4d8; padding: 16px; text-align: center; margin: 0 0 20px 0;">
          <span style="font-family: 'Courier New', Courier, monospace; font-size: 28px; font-weight: 700; letter-spacing: 8px; color: #111111;">
            ${otpCode}
          </span>
        </div>
        <p style="font-size: 13px; line-height: 1.5; color: #52525b; margin: 0 0 8px 0;">
          Kode verifikasi ini berlaku selama 5 menit. Jika Anda tidak merasa melakukan permintaan ini, abaikan pesan email ini.
        </p>
        <p style="font-size: 13px; color: #52525b; margin: 20px 0 0 0;">
          Salam hangat,<br />
          <strong>Tim Layanan Pelanggan UrbanStyle</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SMTP_USER}>`,
      replyTo: SMTP_USER,
      to: cleanTo,
      subject: `Kode verifikasi UrbanStyle Anda: ${otpCode}`,
      text: `Halo,\n\nBerikut adalah 6 digit kode verifikasi untuk ${actionLabel} di UrbanStyle LifeWear: ${otpCode}\n\nKode ini berlaku selama 5 menit.\n\nSalam hangat,\nTim Layanan Pelanggan UrbanStyle`,
      html,
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
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

  const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rincian Pesanan UrbanStyle</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #18181b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 540px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e4e4e7;">
    <tr>
      <td style="padding: 20px 24px; border-bottom: 3px solid #E60012;">
        <strong style="font-size: 16px; color: #111111;">UrbanStyle LifeWear — Rincian Pesanan</strong>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px;">
        <p style="font-size: 14px; color: #3f3f46; margin: 0 0 16px 0;">
          Halo <strong>${payload.customerName}</strong>, terima kasih telah berbelanja di UrbanStyle LifeWear. Berikut adalah rincian pesanan Anda:
        </p>
        <div style="background-color: #fafafa; border: 1px solid #e4e4e7; padding: 16px; margin-bottom: 16px; font-size: 13px; line-height: 1.6;">
          <div><strong>Nomor Pesanan:</strong> ${payload.orderNumber}</div>
          <div><strong>Produk:</strong> ${payload.itemsSummary}</div>
          <div><strong>Metode Pembayaran:</strong> ${payload.paymentMethod}</div>
          <div><strong>Total Pembayaran:</strong> ${formattedTotal}</div>
          ${payload.shippingAddress ? `<div><strong>Alamat Pengiriman:</strong> ${payload.shippingAddress}</div>` : ''}
        </div>
        <p style="font-size: 13px; color: #52525b; margin: 0;">
          Salam hangat,<br />
          <strong>Tim Layanan Pelanggan UrbanStyle</strong>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SMTP_USER}>`,
      replyTo: SMTP_USER,
      to: cleanTo,
      subject: `Rincian pesanan UrbanStyle ${payload.orderNumber}`,
      text: `Halo ${payload.customerName},\n\nTerima kasih telah berbelanja di UrbanStyle LifeWear.\nNomor Pesanan: ${payload.orderNumber}\nProduk: ${payload.itemsSummary}\nMetode Pembayaran: ${payload.paymentMethod}\nTotal Pembayaran: ${formattedTotal}\n\nSalam hangat,\nTim Layanan Pelanggan UrbanStyle`,
      html,
      headers: {
        'X-Entity-Ref-ID': crypto.randomUUID(),
      },
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
