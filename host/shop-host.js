// The Sarcio host for the storefront: create the vanilla module registry,
// load the registry build, render, and connect for signed module patches.
// When a patch swaps pricing.js the registry re-runs dependents and onReplace
// re-renders, with the cart untouched, because its state module wasn't
// replaced.
import { connectSarcioModules } from '@sarcio/hmr-runtime/client';
import { createVanillaRegistry } from '@sarcio/hmr-runtime/vanilla';

const registry = createVanillaRegistry(id => {
  throw new Error(`no vendor dependency: ${id}`);
});

new Function(window.__SARCIO_DEFINES)();

const root = document.querySelector('#store');
const base = window.__SARCIO_BASE_PATH ?? '';

const rerender = () => {
  const { render, subscribe } = registry.require('src/shop.js');
  render(root, location.hash, base);
  return subscribe;
};

let unsubscribe = rerender()(rerender);
registry.onReplace(() => {
  if (typeof unsubscribe === 'function') unsubscribe();
  unsubscribe = rerender()(rerender);
});
window.addEventListener('hashchange', () => {
  rerender();
  window.scrollTo(0, 0);
});

connectSarcioModules({
  apiBase: window.__SARCIO_API_BASE,
  registry,
  siteKey: window.__SARCIO_SITE_KEY,
  wsUrl: window.__SARCIO_WS_URL
});
