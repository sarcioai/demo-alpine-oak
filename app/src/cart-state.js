// The shopper's cart and the code they typed, deliberately their own module:
// a fix to pricing.js replaces that module in the open page while this one,
// and everything the shopper has put in their cart, stays exactly as it was.
const lines = new Map();
let couponCode = '';
const listeners = new Set();

const notify = () => {
  for (const fn of listeners) fn();
};

export function getLines() {
  return [...lines.values()];
}

export function count() {
  return getLines().reduce((sum, line) => sum + line.qty, 0);
}

export function add(product, qty = 1) {
  const line = lines.get(product.id);
  if (line) {
    line.qty += qty;
  } else {
    lines.set(product.id, { id: product.id, name: product.name, price: product.price, qty });
  }
  notify();
}

export function setQty(id, qty) {
  const line = lines.get(id);
  if (!line) return;
  if (qty <= 0) {
    lines.delete(id);
  } else {
    line.qty = qty;
  }
  notify();
}

export function getCoupon() {
  return couponCode;
}

export function setCoupon(code) {
  couponCode = code.trim().toUpperCase();
  notify();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
