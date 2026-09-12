// Registry-package the storefront's module graph (the same engine the Sarcio
// bundler plugins drive) and bundle the host that renders it + connects for
// signed module patches. The defines stay config-free; the page injects
// runtime config via /config.js first.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { packageApp } from '@sarcio/build-core';

import { build } from 'esbuild';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = join(here, 'app');

const pkg = packageApp(join(appRoot, 'src', 'shop.js'), appRoot);
console.log('registry modules:', Object.keys(pkg.modules).join(', '));

mkdirSync(join(here, 'public'), { recursive: true });
writeFileSync(
  join(here, 'public', 'shop-defines.js'),
  [
    `window.__SARCIO_DEFINES = ${JSON.stringify(pkg.defines)};`,
    `window.__SARCIO_ENTRY = ${JSON.stringify(pkg.entryId)};`,
    ''
  ].join('\n')
);

await build({
  bundle: true,
  entryPoints: [join(here, 'host', 'shop-host.js')],
  format: 'iife',
  outfile: join(here, 'public', 'shop-host.js')
});
console.log('built public/shop-defines.js + public/shop-host.js');
