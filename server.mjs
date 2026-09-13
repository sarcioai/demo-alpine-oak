// Alpine & Oak Outfitters' storefront. The bug lives entirely in the BROWSER
// module graph (app/src/pricing.js) and is fixed by a signed module patch, so
// this server only serves the pages and their runtime config — there is no
// server tier and no sidecar.
import { readFileSync } from 'node:fs';

import express from 'express';

const PORT = Number(process.env.PORT ?? 4010);
// Everything is served under this prefix (e.g. /alpine-oak); nothing in front
// of the app rewrites paths.
const BASE_PATH = (process.env.SARCIO_BASE_PATH ?? '').replace(/\/+$/, '');
// The page's canonical address: the bare base (/alpine-oak), never a slashed one.
const HOME_PATH = BASE_PATH || '/';
const SITE_KEY = process.env.SARCIO_SITE_KEY ?? 'pk_demo_alpine_oak';
const API_URL = process.env.SARCIO_API_URL ?? 'http://control.sarcio.local';
const WS_URL =
  process.env.SARCIO_WS_URL || API_URL.replace(/^http/, 'ws') + '/ws';
const WIDGET_SRC = process.env.SARCIO_WIDGET_SRC ?? `${API_URL}/sarcio.js`;

const app = express();
const site = express.Router();

// Browser config, resolved from the container env at request time so one image
// serves any deployment.
site.get('/config.js', (_req, res) => {
  res
    .type('application/javascript')
    .send(
      [
        `window.__SARCIO_API_BASE = ${JSON.stringify(API_URL)};`,
        `window.__SARCIO_WS_URL = ${JSON.stringify(WS_URL)};`,
        `window.__SARCIO_SITE_KEY = ${JSON.stringify(SITE_KEY)};`,
        `window.__SARCIO_WIDGET_SRC = ${JSON.stringify(WIDGET_SRC)};`,
        ''
      ].join('\n')
    );
});
site.get('/health', (_req, res) => res.json({ ok: true }));
site.use(express.static('public', { index: false }));

// The page is addressed WITHOUT a trailing slash, where a relative `shop.css`
// would resolve against the parent path, so every asset and API URL in it is
// rendered base-absolute from the %BASE_PATH% / %HOME_PATH% placeholders.
const page = readFileSync('public/index.html', 'utf8')
  .replaceAll('%BASE_PATH%', BASE_PATH)
  .replaceAll('%HOME_PATH%', HOME_PATH);

// Matched on the exact path: Express routing is not strict, so a route for the
// bare base would also catch the slashed form. The slashed form (and the raw
// template's own file name) 301s to the canonical bare base, query kept.
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    next();
    return;
  }
  if (req.path === HOME_PATH) {
    res.type('html').send(page);
    return;
  }
  if (req.path === `${BASE_PATH}/` || req.path === `${BASE_PATH}/index.html`) {
    const { search } = new URL(req.originalUrl, 'http://localhost');
    res.redirect(301, `${HOME_PATH}${search}`);
    return;
  }
  next();
});
app.use(BASE_PATH || '/', site);

const server = app.listen(PORT, () => {
  console.log(`demo-alpine-oak on :${PORT}${HOME_PATH}`);
});
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
