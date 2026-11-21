/* Fotografér de ti kladder: hver i sine egne farver, og i den modsatte (lys eller mørk).
   Brug: node rytme-studio/kladder/fotografer.js */
const path = require('path'), fs = require('fs');
let pw; try { pw = require('playwright'); } catch (e) { pw = require('/opt/node-tools/node_modules/playwright'); }
(async () => {
  const b = await pw.chromium.launch(), p = await b.newPage({ viewport: { width: 1948, height: 1300 } });
  const fejl = []; p.on('pageerror', e => fejl.push(e.message));
  await p.goto('file://' + path.join(__dirname, 'kladder.html'));
  for (const f of fs.readdirSync(__dirname)) if (/^kladde-.*\.png$/.test(f)) fs.unlinkSync(path.join(__dirname, f));
  const n = await p.evaluate(() => KLADDER.K.length);
  for (let i = 0; i < n; i++) {
    const info = await p.evaluate(k => { const v = KLADDER.valg; v.k = k; v.m = v.tone = v.acc = null; KLADDER.tegn(); return { navn: KLADDER.K[k].navn.toLowerCase().replace('æ', 'ae').replace('ø', 'oe').replace(/[^a-z0-9]+/g, '-'), m: KLADDER.K[k].std[0] }; }, i);
    const nr = String(i + 1).padStart(2, '0');
    await p.locator('#kladde').screenshot({ path: path.join(__dirname, `kladde-${nr}-${info.navn}-${info.m}.png`) });
    const anden = info.m === 'moerk' ? 'lys' : 'moerk';
    await p.evaluate(m => { KLADDER.valg.m = m; KLADDER.tegn(); }, anden);
    await p.locator('#kladde').screenshot({ path: path.join(__dirname, `kladde-${nr}-${info.navn}-${anden}.png`) });
  }
  console.log(fejl.length ? fejl.join('\n') : 'ok, ' + n + ' kladder × 2');
  await b.close();
})();
