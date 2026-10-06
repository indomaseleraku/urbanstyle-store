import { dataStore } from '../lib/store';

async function main() {
  const prods = await dataStore.getProducts();
  const res = await dataStore.createOrder({
    customer_name: 'Kimy Eka Ardiansyah',
    customer_phone: '081234567890',
    customer_address: 'Universitas Pamulang, Viktor Lantai 5, Tangsel',
    shipping_courier: 'J&T Express',
    shipping_cost: 15000,
    payment_method: 'Bank Transfer',
    bank_name: 'BCA',
    coupon_code: 'URBANWELCOME50',
    discount_amount: 50000,
    cart_items: [
      { product: prods[0], selected_size: 'L', selected_color: prods[0].colors[0]?.name || 'Standard', quantity: 1 }
    ]
  });

  if (res.success && res.order) {
    console.log('ORDER_SUCCESS');
    console.log('ORDER_NUMBER:', res.order.order_number);
    console.log('BANK:', res.order.bank_name);
    console.log('UNIQUE_CODE:', res.order.unique_code);
    console.log('TOTAL_AMOUNT:', res.order.total_amount);
  } else {
    console.error('ORDER_FAILED:', res.message);
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
