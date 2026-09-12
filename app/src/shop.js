// The storefront UI. Re-run by the vanilla registry whenever a dependency
// (pricing.js) is hot-swapped; cart state lives in cart-state.js and is
// untouched by the swap.
import { getItems, setQty, subscribe } from './cart-state.js';
import { COUPONS, discount, subtotal, total } from './pricing.js';

const usd = value => `$${value.toFixed(2)}`;

export function render(root, getCoupon) {
  const items = getItems();
  const coupon = getCoupon();
  const rate = COUPONS[coupon?.trim().toUpperCase() ?? ''];
  const sub = subtotal(items);
  const off = discount(items, coupon);

  root.innerHTML = `
    <div class="cart">
      ${items
        .map(
          item => `
        <div class="cart-row" data-id="${item.id}">
          <span class="cart-name">${item.name}</span>
          <span class="cart-qty">
            <button class="qty" data-id="${item.id}" data-delta="-1">−</button>
            <b>${item.qty}</b>
            <button class="qty" data-id="${item.id}" data-delta="1">+</button>
          </span>
          <span class="cart-price">${usd(item.price * item.qty)}</span>
        </div>`
        )
        .join('')}
      <div class="cart-row cart-sub"><span>Subtotal</span><span></span><span>${usd(sub)}</span></div>
      <div class="cart-row cart-coupon" data-testid="couponLine">
        <span>${rate ? `Coupon ${coupon.trim().toUpperCase()} (−${Math.round(rate * 100)}%)` : 'No coupon applied'}</span>
        <span></span>
        <span>${rate ? `−${usd(off)}` : '—'}</span>
      </div>
      <div class="cart-row cart-total"><span>Total</span><span></span><b data-testid="cartTotal">${usd(total(items, coupon))}</b></div>
    </div>`;

  for (const btn of root.querySelectorAll('button.qty')) {
    btn.addEventListener('click', () => {
      const item = getItems().find(entry => entry.id === btn.dataset.id);
      if (item) setQty(btn.dataset.id, item.qty + Number(btn.dataset.delta));
    });
  }
}

export { subscribe };
