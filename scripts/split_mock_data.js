const fs = require('fs');
const path = require('path');

const mockPath = path.join(__dirname, '../lib/mock-data.ts');
const lines = fs.readFileSync(mockPath, 'utf8').split('\n');

const outDir = path.join(__dirname, '../lib/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Line indices:
// 0..11: Categories
// 12..1997: Products
// 1998..2071: Orders
// 2072..2107: Coupons
// 2108..2161: Users
// 2162..end: Addresses

const catLines = [
  "import { Category } from '../types';",
  "",
  ...lines.slice(5, 12)
].join('\n');
fs.writeFileSync(path.join(outDir, 'categories.data.ts'), catLines);

const prodLines = [
  "import { Product } from '../types';",
  "",
  ...lines.slice(12, 1998)
].join('\n');
fs.writeFileSync(path.join(outDir, 'products.data.ts'), prodLines);

const orderLines = [
  "import { Order } from '../types';",
  "",
  ...lines.slice(1998, 2072)
].join('\n');
fs.writeFileSync(path.join(outDir, 'orders.data.ts'), orderLines);

const couponLines = [
  "import { Coupon } from '../types';",
  "",
  ...lines.slice(2072, 2108)
].join('\n');
fs.writeFileSync(path.join(outDir, 'coupons.data.ts'), couponLines);

const userLines = [
  "import { UserProfile, UserAddress } from '../types';",
  "",
  ...lines.slice(2108)
].join('\n');
fs.writeFileSync(path.join(outDir, 'users.data.ts'), userLines);

console.log('Successfully created lib/data files!');
