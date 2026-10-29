/* Kør hele testpakken i den faste rækkefølge: syntaks, indhold, browser, og derefter testene af det nye
   (4-*.js, 5-*.js …, én pr. version, der stadig kører).
   Brug: node tests/koer-alle.js [programfil] [--uden-lyd] */
const fs = require('fs'), path = require('path');
const { findFil } = require('./faelles');
(async () => {
  const arg = process.argv.slice(2).find(a => !a.startsWith('--')), fil = findFil(arg);
  console.log('Testpakke for ' + path.basename(fil) + '\n');
  const res = [require('./1-syntaks')(fil), require('./2-indhold')(fil)];
  res.push(await require('./3-browser')(fil, { udenLyd: process.argv.includes('--uden-lyd') }));
  const nye = fs.readdirSync(__dirname).filter(f => /^([4-9]|\d\d+)-.*\.js$/.test(f)).sort((a, b) => parseInt(a) - parseInt(b));
  for (const f of nye) res.push(await require('./' + f)(fil));
  const ok = res.every(Boolean);
  console.log(ok ? '✅ Alle test er bestået.' : '❌ Mindst én test fejlede.');
  process.exit(ok ? 0 : 1);
})();
