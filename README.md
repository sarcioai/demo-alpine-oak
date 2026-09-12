# demo-alpine-oak

**Alpine & Oak Outfitters** is a fictional company. Its storefront carries a
seeded bug that [Sarcio](https://sarcio.io) fixes live, in the running page, with
no reload. It is one demo in Sarcio's catalog (see `docs/demo.md` in the Sarcio
repo):

| | |
| --- | --- |
| Workspace | `alpine-oak` (`alpine-oak.sarcio.io`) |
| Served at | `demos.sarcio.io/alpine-oak/` |
| Patch kind | module patch — state-preserving hot swap in the browser |
| Forge | GitHub — this repo, where the permanent-fix PR opens |

## The seeded bug

`app/src/pricing.js` applies every coupon against the subtotal **twice**: try
`SAVE10` and a 10% coupon takes 20% off. The fix is replacement code for that
module, hot-swapped into the running page by a signed module patch. The cart is
state in a different module (`app/src/cart-state.js`), so quantities and the
coupon survive the swap; retiring the patch restores the shipped module, live.
`app/src/pricing.js` is the file the permanent-fix PR edits (the site's
`sourcePath`). Module drafts use `appRoot` `app` and entry `src/shop.js`.

## Run it

```bash
npm install            # needs a token for the private @sarcio packages
node build.mjs         # registry-build the shop + bundle its host
SARCIO_BASE_PATH=/alpine-oak node server.mjs   # http://localhost:4010/alpine-oak/
```

Ships as a container (see `Dockerfile`; the npm token is a build secret, never in
a layer). Env, per the Sarcio demo image contract: `PORT`, `SARCIO_BASE_PATH`,
`SARCIO_SITE_KEY`, `SARCIO_API_URL`, `SARCIO_WS_URL`, `SARCIO_WIDGET_SRC`.

## Release

Push a `vX.Y.Z` tag: `.github/workflows/release.yml` builds
`ghcr.io/sarcioai/demo-alpine-oak` for arm64 + amd64. Bump `DEMO_ALPINE_OAK_TAG`
in the Sarcio stack to roll it out.
