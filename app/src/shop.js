// The storefront. Re-run by the module registry whenever a dependency (say
// pricing.js) is replaced in the open page; the cart lives in cart-state.js,
// which isn't replaced, so it survives.
import { CATEGORIES, PRODUCTS, product } from './catalog.js';
import { add, count, getCoupon, getLines, setCoupon, setQty, subscribe } from './cart-state.js';
import { couponRate, discount, FREE_SHIPPING_OVER, shipping, subtotal, total } from './pricing.js';

const usd = value => `$${value.toFixed(2)}`;
const esc = value =>
  String(value).replace(/[&<>"']/g, ch => ({ '"': '&quot;', '&': '&amp;', "'": '&#39;', '<': '&lt;', '>': '&gt;' })[ch]);

const card = (item, img) => `
  <a class="card" href="#/p/${item.id}">
    <img src="${img(item.image)}" alt="${esc(item.name)}" loading="lazy" />
    <span class="card-name">${esc(item.name)}</span>
    <span class="card-price">${usd(item.price)}</span>
  </a>`;

const header = () => `
  <div class="promo">Free shipping over $${FREE_SHIPPING_OVER} · New here? Take 10% off with <b>TRAIL10</b></div>
  <header class="site">
    <a class="logo" href="#/">Alpine <span class="amp">&amp;</span> Oak</a>
    <nav>
      ${CATEGORIES.map(cat => `<a href="#/c/${cat.id}">${esc(cat.name)}</a>`).join('')}
      <a class="cart-link" href="#/cart">Cart <span class="cart-count">${count()}</span></a>
    </nav>
  </header>`;

const home = img => `
  <section class="hero" style="background-image:linear-gradient(90deg,rgba(25,20,15,.65),rgba(25,20,15,.1)),url('${img('hero-trail.jpg')}')">
    <div class="hero-inner">
      <p class="kicker">Fall 2026</p>
      <h1>Gear for the long way round.</h1>
      <p>Packs, boots and layers built to be repaired, not replaced. Tested on the Cascades since 1987.</p>
      <a class="btn" href="#/c/packs">Shop packs</a>
    </div>
  </section>
  <section class="band">
    <h2>Shop by category</h2>
    <div class="cats">
      ${CATEGORIES.map(cat => {
        const first = PRODUCTS.find(item => item.category === cat.id);
        return `<a class="cat" href="#/c/${cat.id}"><img src="${img(first.image)}" alt="" /><span>${esc(cat.name)}</span></a>`;
      }).join('')}
    </div>
  </section>
  <section class="band">
    <h2>Trail-tested this season</h2>
    <div class="grid">${PRODUCTS.slice(0, 4).map(item => card(item, img)).join('')}</div>
  </section>
  <section class="story">
    <img src="${img('story-meadow.jpg')}" alt="A hiker in an alpine meadow" />
    <div>
      <p class="kicker">Since 1987</p>
      <h2>Built in Bend, worn everywhere</h2>
      <p>Alpine &amp; Oak started as a repair bench behind a climbing gym. We still fix what we sell: send any pack or jacket back and we'll patch it, free, for life.</p>
    </div>
  </section>`;

const category = (id, img) => {
  const cat = CATEGORIES.find(entry => entry.id === id);
  const items = PRODUCTS.filter(item => item.category === id);
  return `
    <section class="band">
      <p class="crumbs"><a href="#/">Home</a> / ${esc(cat?.name ?? 'Shop')}</p>
      <h1>${esc(cat?.name ?? 'Shop')}</h1>
      <div class="grid">${items.map(item => card(item, img)).join('')}</div>
    </section>`;
};

const detail = (id, img) => {
  const item = product(id);
  if (!item) return category('', img);
  return `
    <section class="band detail">
      <img src="${img(item.image)}" alt="${esc(item.name)}" />
      <div>
        <p class="crumbs"><a href="#/">Home</a> / <a href="#/c/${item.category}">${esc(CATEGORIES.find(cat => cat.id === item.category)?.name ?? '')}</a></p>
        <h1>${esc(item.name)}</h1>
        <p class="price">${usd(item.price)}</p>
        <p>${esc(item.blurb)}</p>
        <button class="btn" data-add="${item.id}">Add to cart</button>
        <p class="note">Free returns for 90 days · Free repairs for life</p>
      </div>
    </section>`;
};

const cart = img => {
  const lines = getLines();
  if (lines.length === 0) {
    return `<section class="band"><h1>Your cart</h1><p>Your cart is empty. <a href="#/">Keep shopping</a></p></section>`;
  }
  const code = getCoupon();
  const rate = couponRate(code);
  const ship = shipping(lines);
  return `
    <section class="band cart">
      <h1>Your cart</h1>
      <div class="cart-layout">
        <div class="cart-lines">
          ${lines
            .map(
              line => `
            <div class="cart-line">
              <img src="${img(product(line.id)?.image ?? '')}" alt="" />
              <span class="cart-name">${esc(line.name)}</span>
              <span class="qty">
                <button data-qty="${line.id}" data-delta="-1" aria-label="One fewer">−</button>
                <b>${line.qty}</b>
                <button data-qty="${line.id}" data-delta="1" aria-label="One more">+</button>
              </span>
              <span>${usd(line.price * line.qty)}</span>
            </div>`
            )
            .join('')}
        </div>
        <aside class="summary">
          <form class="coupon" data-coupon>
            <label for="coupon">Discount code</label>
            <div><input id="coupon" name="coupon" value="${esc(code)}" placeholder="TRAIL10" autocomplete="off" /><button>Apply</button></div>
            ${code && !rate ? `<p class="coupon-error">That code isn't valid.</p>` : ''}
          </form>
          <div class="row"><span>Subtotal</span><span>${usd(subtotal(lines))}</span></div>
          <div class="row"><span>Shipping</span><span>${ship ? usd(ship) : 'Free'}</span></div>
          ${rate ? `<div class="row saving"><span>${esc(code)} (${Math.round(rate * 100)}% off)</span><span>−${usd(discount(lines, code))}</span></div>` : ''}
          <div class="row total"><span>Total</span><span data-testid="cartTotal">${usd(total(lines, code))}</span></div>
          <button class="btn wide" data-checkout>Check out</button>
          <p class="note" data-checkout-note hidden>This is a demo store: nothing is charged or shipped.</p>
        </aside>
      </div>
    </section>`;
};

/** Render the view for `route` (the location hash) into `root`. */
export function render(root, route, base) {
  const img = file => `${base}/img/${file}`;
  const [, view = '', id = ''] = route.replace(/^#/, '').split('/');
  const body = view === 'c' ? category(id, img) : view === 'p' ? detail(id, img) : view === 'cart' ? cart(img) : home(img);
  root.innerHTML = `${header()}<main>${body}</main>`;

  root.querySelector('[data-add]')?.addEventListener('click', event => {
    add(product(event.currentTarget.dataset.add));
    location.hash = '#/cart';
  });
  for (const button of root.querySelectorAll('[data-qty]')) {
    button.addEventListener('click', () => {
      const line = getLines().find(entry => entry.id === button.dataset.qty);
      if (line) setQty(line.id, line.qty + Number(button.dataset.delta));
    });
  }
  root.querySelector('[data-coupon]')?.addEventListener('submit', event => {
    event.preventDefault();
    setCoupon(new FormData(event.currentTarget).get('coupon') ?? '');
  });
  root.querySelector('[data-checkout]')?.addEventListener('click', () => {
    root.querySelector('[data-checkout-note]').hidden = false;
  });
}

export { subscribe };
