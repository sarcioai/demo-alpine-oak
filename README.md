# demo-alpine-oak

**Alpine & Oak Outfitters** is a fictional outdoor-gear company in Bend,
Oregon. Its web store has a pricing bug that [Sarcio](https://www.sarcio.io)
fixes live, in the open page, with no reload and no deploy, and with the
shopper's cart exactly as they left it.

|           |                                                                  |
| --------- | ---------------------------------------------------------------- |
| Live demo | [demos.sarcio.io/alpine-oak](https://demos.sarcio.io/alpine-oak) |
| Shows     | a code fix applied in the browser, with the cart intact          |
| Fix PR    | opens on this repository (GitHub)                                |

## What's broken

**"I used the 10% code and my total went up."** Version 3.2 of
`app/src/pricing.js` collects shipping and the coupon into one list of
adjustments and adds them all to the subtotal, so the coupon's saving is
charged instead of taken off: $338.00 of gear with `TRAIL10` shows
"−$33.80" and a total of $371.80. Once a fix is approved in Sarcio, the
corrected pricing module replaces the broken one in the open page. The cart,
the quantities and the code the shopper typed stay as they were. The pull
request with the permanent fix edits `app/src/pricing.js`.

## Run it

```bash
npm install
node build.mjs
SARCIO_BASE_PATH=/alpine-oak node server.mjs   # http://localhost:4010/alpine-oak
```

It also ships as a container (see `Dockerfile`). Environment: `PORT`,
`SARCIO_BASE_PATH`, `SARCIO_SITE_KEY`, `SARCIO_API_URL`, `SARCIO_WS_URL`,
`SARCIO_WIDGET_SRC`.

The store is a single page: the catalogue, product pages and cart are views of
one module graph (`app/src/`), so moving around the store never loses the cart.
Photos are from Unsplash, used under the Unsplash License (see
[`CREDITS.md`](CREDITS.md)).
