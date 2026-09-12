// The Sarcio host for the storefront: create the vanilla module registry,
// load the registry build, render, and connect for signed module patches.
// When a patch swaps pricing.js the registry re-runs dependents and onReplace
// re-renders — with the cart untouched, because its state module wasn't
// replaced.
import { connectSarcioModules } from '@sarcio/hmr-runtime/client';
import { createVanillaRegistry } from '@sarcio/hmr-runtime/vanilla';

const registry = createVanillaRegistry(id => {
  throw new Error(`no vendor dependency: ${id}`);
});

new Function(window.__SARCIO_DEFINES)();

const root = document.querySelector('#cart-root');
const couponInput = document.querySelector('#coupon');
const getCoupon = () => couponInput.value;

const rerender = () => {
  const { render, subscribe } = registry.require('src/shop.js');
  render(root, getCoupon);
  return subscribe;
};

let unsubscribe = rerender()(rerender);
registry.onReplace(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
  unsubscribe = rerender()(rerender);
});
couponInput.addEventListener('input', () => rerender());

connectSarcioModules({
  apiBase: window.__SARCIO_API_BASE,
  registry,
  siteKey: window.__SARCIO_SITE_KEY,
  wsUrl: window.__SARCIO_WS_URL
});
