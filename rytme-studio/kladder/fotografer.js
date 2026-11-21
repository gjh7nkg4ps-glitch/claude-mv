/* Fotografér de fem kladder. Brug: node rytme-studio/kladder/fotografer.js */
const path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/node-tools/node_modules/playwright'); }
(async () => {
  const b = await pw.chromium.launch(), p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const fejl = []; p.on('pageerror', e => fejl.push(e.message));
  await p.goto('file://' + path.join(__dirname, 'kladder.html'));
  const navne = ['galleri', 'urvaerk', 'partitur', 'laerred', 'spejl'];
  for (let i = 0; i < 5; i++) await p.locator('#k' + (i + 1)).screenshot({ path: path.join(__dirname, 'kladde-' + (i + 1) + '-' + navne[i] + '.png') });
  console.log(fejl.length ? fejl.join('\n') : 'ok, 5 kladder');
  await b.close();
})();
