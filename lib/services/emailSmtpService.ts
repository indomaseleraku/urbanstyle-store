// lib/services/emailSmtpService.ts
// Layanan Pengiriman Email Resmi via Gmail SMTP (OTP 6 Digit & Notifikasi Pesanan)

import nodemailer from 'nodemailer';

const rawSmtpUser = process.env.GMAIL_SMTP_USER;
const SMTP_USER =
  rawSmtpUser && rawSmtpUser !== 'thn071205@gmail.com' ? rawSmtpUser : 'kimyeka24245@gmail.com';
const SMTP_PASS = (process.env.GMAIL_SMTP_APP_PASSWORD || 'iazbigdjfimtgfsf').replace(/\s+/g, '');
const SENDER_NAME = process.env.GMAIL_SENDER_NAME || 'UrbanStyle LifeWear Indonesia';

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
  const titleText = purpose === 'register' ? 'Verifikasi Pendaftaran Member' : 'Kode Verifikasi Login (OTP)';

  const html = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 520px; margin: 0 auto; border: 1px solid #e4e4e7; background-color: #ffffff; color: #18181b;">
    <div style="background-color: #E60012; padding: 20px 24px; display: flex; align-items: center;">
      <span style="color: #ffffff; font-size: 18px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
        URBANSTYLE // LIFEWEAR
      </span>
    </div>
    <div style="padding: 32px 24px;">
      <p style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #71717a; margin: 0 0 8px 0;">
        KEAMANAN AKUN MEMBER
      </p>
      <h1 style="font-size: 20px; font-weight: 900; text-transform: uppercase; margin: 0 0 16px 0; color: #09090b;">
        ${titleText}
      </h1>
      <p style="font-size: 14px; line-height: 1.6; color: #3f3f46; margin: 0 0 24px 0;">
        Gunakan 6 digit kode keamanan (OTP) di bawah ini untuk menyelesaikan proses masuk ke akun <strong>UrbanStyle LifeWear</strong> Anda (<strong>${cleanTo}</strong>):
      </p>
      <div style="background-color: #f4f4f5; border: 2px solid #18181b; padding: 20px; text-align: center; margin: 0 0 24px 0;">
        <span style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #E60012;">
          ${otpCode}
        </span>
      </div>
      <p style="font-size: 12px; line-height: 1.5; color: #71717a; margin: 0 0 8px 0;">
        • Kode ini hanya berlaku selama <strong>5 menit</strong>.
      </p>
      <p style="font-size: 12px; line-height: 1.5; color: #71717a; margin: 0;">
        • Jangan pernah membagikan kode rahasia ini kepada siapa pun, termasuk pihak yang mengaku staf UrbanStyle.
      </p>
    </div>
    <div style="border-top: 1px solid #e4e4e7; background-color: #fafafa; padding: 16px 24px; font-size: 11px; color: #a1a1aa; text-align: center;">
      &copy; ${new Date().getFullYear()} UrbanStyle LifeWear Indonesia. Seluruh hak cipta dilindungi.
    </div>
  </div>
  `;

  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SMTP_USER}>`,
      to: cleanTo,
      subject: `[${otpCode}] ${titleText} - UrbanStyle LifeWear`,
      text: `Kode OTP UrbanStyle LifeWear Anda adalah: ${otpCode}. Berlaku selama 5 menit. Jangan bagikan kode ini kepada siapa pun.`,
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

  const html = `
  <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e4e4e7; background-color: #ffffff; color: #18181b;">
    <div style="background-color: #E60012; padding: 20px 24px;">
      <span style="color: #ffffff; font-size: 18px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase;">
        URBANSTYLE // KONFIRMASI PESANAN
      </span>
    </div>
    <div style="padding: 28px 24px;">
      <p style="font-size: 14px; color: #3f3f46; margin: 0 0 16px 0;">
        Halo <strong>${payload.customerName}</strong>, terima kasih telah berbelanja di UrbanStyle LifeWear.
      </p>
      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; padding: 16px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a;">NOMOR INVOICE</p>
        <p style="margin: 0 0 16px 0; font-family: monospace; font-size: 16px; font-weight: 900; color: #09090b;">
          ${payload.orderNumber}
        </p>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #71717a;">RINGKASAN PRODUK</p>
        <p style="margin: 0 0 16px 0; font-size: 13px; color: #18181b;">
          ${payload.itemsSummary}
        </p>
        <p style="margin: 0 0 4px 0; font-size: 12px; color: #71717a;">METODE PEMBAYARAN</p>
        <p style="margin: 0 0 16px 0; font-size: 13px; font-weight: 700; color: #18181b;">
          ${payload.paymentMethod}
        </p>
        <div style="border-top: 1px solid #e4e4e7; padding-top: 12px; display: flex; justify-content: space-between;">
          <span style="font-size: 13px; font-weight: 800; text-transform: uppercase;">TOTAL TAGIHAN: </span>
          <span style="font-size: 16px; font-weight: 900; color: #E60012;">${formattedTotal}</span>
        </div>
      </div>
      ${
        payload.shippingAddress
          ? `<p style="font-size: 12px; color: #52525b; margin: 0 0 16px 0;"><strong>Alamat Pengiriman:</strong><br/>${payload.shippingAddress}</p>`
          : ''
      }
      <p style="font-size: 12px; color: #71717a; margin: 0;">
        Anda dapat memantau status pengiriman secara real-time melalui menu <strong>Pesanan Saya</strong> di aplikasi UrbanStyle.
      </p>
    </div>
  </div>
  `;

  const transporter = createTransporter();
  try {
    const info = await transporter.sendMail({
      from: `"${SENDER_NAME}" <${SMTP_USER}>`,
      to: cleanTo,
      subject: `Konfirmasi Pesanan #${payload.orderNumber} - UrbanStyle LifeWear`,
      text: `Terima kasih ${payload.customerName}. Pesanan #${payload.orderNumber} sebesar ${formattedTotal} (${payload.paymentMethod}) telah kami terima.`,
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
