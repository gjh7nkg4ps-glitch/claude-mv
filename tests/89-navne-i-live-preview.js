/* Trin 4 · Det nye i v9.100 (P8.15 punkt 1): Navne: Til · Fra i Live previews overskrift. Ved 1920 × 1080 og 2560 × 1440 med Pigernes show:
   knappen står efter Klodsbane og er Fra; rigtigt klik → Til (set.pvNavne), og navnene tegnes (pvNavneTegn kaldes i billedløkken og skriver hver synlig figurs navn);
   huskes efter genstart; Fra igen; punktet står under ☰ Mere → I arbejdsområdet. Skærmbillede: tests/ud/navne-i-live-preview.png. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Navne i Live preview'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('89 · Navne i Live preview · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.evaluate(() => { brugFor('piger_show', true) }); await side.click('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1500);
      const r0 = await side.evaluate(() => { const b = document.getElementById('pv-navne'), k = document.getElementById('pv-bane'); return { findes: !!b, efter: !!b && b.previousElementSibling === k, tekst: b && b.textContent, til: set.pvNavne === true, synlig: !!b && b.getBoundingClientRect().width > 0 } });
      T.tjek(r0.findes && r0.efter && r0.tekst === 'Navne: Fra' && !r0.til && r0.synlig, `${w} × ${h}: knappen Navne: Fra står efter Klodsbane i Live previews overskrift`, JSON.stringify(r0));
      /* rigtigt klik → Til, og navnene tegnes */
      await side.evaluate(() => { window.__navne = []; const gl = pvNavneTegn; window.pvNavneTegn = function (g, W, H) { const r = gl.apply(this, arguments); if (pvNavneTil()) { const t = []; fase2.objekter.forEach(o => { if (o.synlig && !o.skabelon && o.pos && o.navn) t.push(o.navn) }); window.__navne = t } return r } });
      const p = await side.evaluate(() => { const q = document.getElementById('pv-navne').getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.click(p.x, p.y); await side.waitForTimeout(700);
      const r1 = await side.evaluate(() => ({ til: set.pvNavne, tekst: document.getElementById('pv-navne').textContent, navne: window.__navne, gemt: JSON.parse(localStorage.getItem('rytme-set')).pvNavne }));
      T.tjek(r1.til === true && r1.tekst === 'Navne: Til' && r1.navne.length >= 2 && r1.navne.includes('Lyshåret pige') && r1.gemt === true, `${w} × ${h}: klik → Navne: Til, og navnene tegnes i billedløkken (${r1.navne.join(', ')})`, JSON.stringify(r1));
      if (w === 1920) await side.locator('#w2').screenshot({ path: path.join(UD, 'navne-i-live-preview.png') });
      /* huskes efter genstart */
      await side.reload(); await side.waitForTimeout(4000); await side.click('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200);
      const r2 = await side.evaluate(() => ({ til: pvNavneTil(), tekst: document.getElementById('pv-navne').textContent, mere: typeof el9AoPunkter === 'function' ? el9AoPunkter('ao-scene').liste.some(x => /^Navne/.test(x[0])) : null }));
      T.tjek(r2.til && r2.tekst === 'Navne: Til' && r2.mere !== false, `${w} × ${h}: huskes efter genstart; punktet Navne står under ☰ Mere → I arbejdsområdet`, JSON.stringify(r2));
      await side.evaluate(() => pvNavneSkift(false)); await side.waitForTimeout(300);
      const r3 = await side.evaluate(() => ({ til: set.pvNavne, tekst: document.getElementById('pv-navne').textContent }));
      T.tjek(r3.til === false && r3.tekst === 'Navne: Fra', `${w} × ${h}: Fra igen`, JSON.stringify(r3));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
