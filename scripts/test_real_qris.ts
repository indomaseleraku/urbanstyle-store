// scripts/test_real_qris.ts
import { qrisService } from '../lib/services/qrisService';

const realPayload = '00020101021126610014COM.GO-JEK.WWW01189360091431037768610210G1037768610303UMI51440014ID.CO.QRIS.WWW0215ID10254589113160303UMI5204581253033605802ID5914warung koh kim6008PEMALANG61055235262070703A0163044086';

const dynamic = qrisService.generateDynamicPayload(249000, {
  customBaseQRIS: realPayload,
  orderNumber: 'ORD-20261006-888',
});

console.log('--- HASIL GENERATOR QRIS DINAMIS ASLI ---');
console.log('Dynamic Payload:', dynamic.payload);
console.log('NMID:', dynamic.nmid);
console.log('Merchant:', dynamic.merchantName);
console.log('CRC:', dynamic.crc);
