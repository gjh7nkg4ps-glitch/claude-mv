/* Kør hele testpakken i den faste rækkefølge: syntaks, indhold, browser.
   Brug: node tests/koer-alle.js [programfil] [--uden-lyd] */
const path = require('path');
const { findFil } = require('./faelles');
(async () => {
  const arg = process.argv.slice(2).find(a => !a.startsWith('--')), fil = findFil(arg);
  console.log('Testpakke for ' + path.basename(fil) + '\n');
  const res = [require('./1-syntaks')(fil), require('./2-indhold')(fil)];
  res.push(await require('./3-browser')(fil, { udenLyd: process.argv.includes('--uden-lyd') }));
  const ok = res.every(Boolean);
  console.log(ok ? '✅ Alle test er bestået.' : '❌ Mindst én test fejlede.');
  process.exit(ok ? 0 : 1);
})();
