// Alpine & Oak Outfitters' storefront. The bug lives entirely in the BROWSER
// module graph (app/src/pricing.js) and is fixed by a signed module patch, so
// this server only serves the pages and their runtime config — there is no
// server tier and no sidecar.
import express from 'express';

const PORT = Number(process.env.PORT ?? 4010);
// Everything is served under this prefix (e.g. /alpine-oak); nothing in front
// of the app rewrites paths.
const BASE_PATH = (process.env.SARCIO_BASE_PATH ?? '').replace(/\/+$/, '');
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
site.use(express.static('public', { extensions: ['html'] }));

// The page uses relative URLs, which only resolve under the base when it is
// addressed with a trailing slash. Matched on the exact path: Express routing
// is not strict, so a route for the bare base would also catch the slashed form
// and redirect it to itself.
app.use((req, res, next) => {
  if (BASE_PATH && req.path === BASE_PATH) {
    res.redirect(301, `${BASE_PATH}/`);
    return;
  }
  next();
});
app.use(BASE_PATH || '/', site);

const server = app.listen(PORT, () => {
  console.log(`demo-alpine-oak on :${PORT}${BASE_PATH}/`);
});
process.on('SIGTERM', () => server.close());
process.on('SIGINT', () => server.close());
