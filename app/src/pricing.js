// Pricing rules for the Alpine & Oak store.
export const COUPONS = { SAVE10: 0.1 };

export function subtotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function discount(items, couponCode) {
  const rate = COUPONS[couponCode?.trim().toUpperCase() ?? ''];
  if (!rate) return 0;
  return subtotal(items) * rate;
}

export function total(items, couponCode) {
  return subtotal(items) - discount(items, couponCode);
}
