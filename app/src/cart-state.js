// Cart state, deliberately its own module: a module patch replaces pricing.js
// while this module — and the shopper's cart — stays exactly as it was. That
// survival is the demo.
const items = [
  { id: 'trail-25', name: 'Alpine Trail 25L Pack', price: 89.0, qty: 1 },
  { id: 'flask-1l', name: 'Ridgeline Flask 1L', price: 24.5, qty: 2 },
  { id: 'wool-crew', name: 'Basecamp Wool Crew', price: 48.0, qty: 1 }
];

const listeners = new Set();

export function getItems() {
  return items;
}

export function setQty(id, qty) {
  const item = items.find(entry => entry.id === id);
  if (!item) return;
  item.qty = Math.max(0, qty);
  for (const fn of listeners) fn();
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
