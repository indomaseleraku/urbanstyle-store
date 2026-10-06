// scripts/diagnose_qris.ts
import { qrisService, parseTLV, calculateCRC16CCITT } from '../lib/services/qrisService';

const originalRaw = '00020101021126610014COM.GO-JEK.WWW01189360091431037768610210G1037768610303UMI51440014ID.CO.QRIS.WWW0215ID10254589113160303UMI5204581253033605802ID5914warung koh kim6008PEMALANG61055235262070703A0163044086';

console.log('--- ORIGINAL QRIS TAGS ---');
const origMap = parseTLV(originalRaw);
for (const [k, v] of origMap.entries()) {
  console.log(`Tag ${k} (len ${v.length}): "${v}"`);
}
