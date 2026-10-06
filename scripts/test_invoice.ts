import { dataStore } from '../lib/store';
import { BANK_ACCOUNTS } from '../lib/types';

async function main() {
  try {
    const orderNumber = 'ORD-20261001-088';
    const order = await dataStore.getOrderByNumber(orderNumber);
    console.log('Order:', order ? order.order_number : 'NOT FOUND');
    if (order) {
      const subtotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0);
      const selectedBank = order.bank_name ? BANK_ACCOUNTS[order.bank_name] : BANK_ACCOUNTS['BCA'];
      console.log('Subtotal:', subtotal);
      console.log('Selected bank:', selectedBank);
      console.log('Payment method:', order.payment_method);
      console.log('Date:', new Date(order.created_at).toLocaleDateString('id-ID'));
    }
  } catch (err) {
    console.error('Invoice execution error:', err);
  } finally {
    process.exit(0);
  }
}

main();
