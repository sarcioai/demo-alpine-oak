# demo-alpine-oak

**Alpine & Oak Outfitters** is a fictional company. Its storefront carries a
seeded bug that [Sarcio](https://www.sarcio.io) fixes live, in the running page,
with no reload and no deploy.

|           |                                                        |
| --------- | ------------------------------------------------------ |
| Live demo | [demos.sarcio.io/alpine-oak](https://demos.sarcio.io/alpine-oak) |
| Shows     | a code fix applied in the browser, with the cart intact |
| Fix PR    | opens on this repository (GitHub)                      |

## The seeded bug

`app/src/pricing.js` applies every coupon against the subtotal **twice**: try
`SAVE10` and a 10% coupon takes 20% off. Once a fix is approved in Sarcio, the
corrected pricing takes effect in the open page. Quantities and the coupon you
entered stay as they were, and retiring the fix puts the original behaviour
back, also live. The pull request with the permanent fix edits
`app/src/pricing.js`.

## Run it

```bash
npm install
node build.mjs
SARCIO_BASE_PATH=/alpine-oak node server.mjs   # http://localhost:4010/alpine-oak
```

It also ships as a container (see `Dockerfile`). Environment: `PORT`,
`SARCIO_BASE_PATH`, `SARCIO_SITE_KEY`, `SARCIO_API_URL`, `SARCIO_WS_URL`,
`SARCIO_WIDGET_SRC`.
