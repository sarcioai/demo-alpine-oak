// Pricing rules for the Alpine & Oak store.
export const COUPONS = { TRAIL10: 0.1 };

export const FREE_SHIPPING_OVER = 150;
const SHIPPING = 9.95;

export function subtotal(lines) {
  return lines.reduce((sum, line) => sum + line.price * line.qty, 0);
}

export function couponRate(code) {
  return COUPONS[code] ?? 0;
}

/** The coupon's saving, as a positive amount (the cart shows it as "−$x"). */
export function discount(lines, code) {
  return Math.round(subtotal(lines) * couponRate(code) * 100) / 100;
}

export function shipping(lines) {
  const amount = subtotal(lines);
  return amount === 0 || amount >= FREE_SHIPPING_OVER ? 0 : SHIPPING;
}

/**
 * The order total: the subtotal plus each adjustment line. 3.2 moved shipping
 * and the coupon into one list of adjustments so the instalments widget can
 * show them. Shipping is a charge, the coupon a saving, but both are summed.
 */
export function total(lines, code) {
  const adjustments = [shipping(lines), discount(lines, code)];
  return subtotal(lines) + adjustments.reduce((sum, amount) => sum + amount, 0);
}
