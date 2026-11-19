/* Trin 4 · Det nye i v9.82 (trin 7b): klodsbanen er noget, man slår til i scenen (planens valg V2).
   Ved 1920 × 1080 og 2560 × 1440: ved første start (ingen gemte indstillinger) er banen fra (scene.bane false, knappen Klodsbane: Fra i Live preview, gulvet tegnes ikke);
   et rigtigt klik på knappen slår banen til (tegnes, huskes i rytme-scene, Vis bane i Bane og klods følger med); matrixen skriver "klodsbane fra" ved gruppen Bane, når den er fra;
   en gemt scene fra før v9.82 (uden bane-feltet) åbner med banen til; ☰ Mere i 2 · Scene har Klodsbane: til/fra. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Klodsbane');
  console.log('77 · Klodsbanen slås til i scenen (7b) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.click('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200);
      const gulv = () => side.evaluate(() => { const c = document.getElementById('pv'), g = c.getContext('2d'), d = g.getImageData(0, Math.round(c.height * .5), c.width, Math.round(c.height * .5)).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (d[i] + d[i + 1] + d[i + 2] > 60) n++; return n / (d.length / 16) });
      await side.waitForTimeout(600); const g0 = await gulv();
      const r0 = await side.evaluate(() => ({ bane: scene.bane, knap: document.getElementById('pv-bane').textContent, tryk: document.getElementById('pv-bane').getAttribute('aria-pressed'), gemt: JSON.parse(localStorage.getItem('rytme-scene') || '{}').bane, flag: set.bane7b, regler: maps.filter(m => /^klods\d+$/.test(m.effect)).length }));
      T.tjek(r0.bane === false && r0.knap === 'Klodsbane: Fra' && r0.tryk === 'false' && r0.gemt === false && r0.flag === 1 && r0.regler >= 3 && g0 < .2, `${w} × ${h}: ved første start er klodsbanen fra (knappen "${r0.knap}", den nederste halvdel er næsten tom: ${(g0 * 100).toFixed(1)} % lyse punkter), mens klods-reglerne (${r0.regler}) findes stadig`, JSON.stringify({ r0, g0 }));
      /* rigtigt klik slår banen til */
      const p = await side.evaluate(() => { const q = document.getElementById('pv-bane').getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.click(p.x, p.y); await side.waitForTimeout(900); const g1 = await gulv();
      const r1 = await side.evaluate(() => ({ bane: scene.bane, knap: document.getElementById('pv-bane').textContent, gemt: JSON.parse(localStorage.getItem('rytme-scene') || '{}').bane, sbane: document.getElementById('sbane') && document.getElementById('sbane').checked, status: document.getElementById('status').textContent }));
      T.tjek(r1.bane === true && r1.knap === 'Klodsbane: Til' && r1.gemt === true && r1.sbane === true && g1 > g0 + .03, `${w} × ${h}: et rigtigt klik slår banen til ("${r1.knap}"; gulvet tegnes: ${(g1 * 100).toFixed(1)} %), det huskes, og Vis bane i Bane og klods følger med`, JSON.stringify({ r1, g0, g1 }));
      /* matrixen: klodsbane fra ved gruppen Bane */
      await side.evaluate(() => baneSkift(false)); await side.click('#lay3 [data-lay3="ao-regler"]'); await side.waitForTimeout(1200);
      const mx = await side.evaluate(async () => { mxSaet(true, true); await new Promise(r => setTimeout(r, 900)); const th = [...document.querySelectorAll('#ne-mx th.mx-fig')].map(x => x.textContent.trim()); baneSkift(true); await new Promise(r => setTimeout(r, 600)); const th2 = [...document.querySelectorAll('#ne-mx th.mx-fig')].map(x => x.textContent.trim()); return { fra: th.find(x => /^▾ Bane/.test(x)), til: th2.find(x => /^▾ Bane/.test(x)) } });
      T.tjek(/klodsbane fra/.test(mx.fra || '') && mx.til === '▾ Bane', `${w} × ${h}: matrixen skriver "${mx.fra}" ved gruppen Bane, når banen er fra, og "${mx.til}", når den er til`, JSON.stringify(mx));
      /* Mere i 2 · Scene */
      await side.click('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(900); await side.click('#el9-mere'); await side.waitForTimeout(400);
      const me = await side.evaluate(() => [...document.querySelectorAll('#mere-ao button')].map(b => b.textContent).join(' · ')); await side.keyboard.press('Escape');
      T.tjek(/Klodsbane: til\/fra/.test(me), `${w} × ${h}: ☰ Mere i 2 · Scene har Klodsbane: til/fra (${me})`, me);
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
    /* en gemt scene fra før v9.82 åbner med banen til */
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage();
    await side.addInitScript(() => { try { if (!localStorage.getItem('rytme-scene')) localStorage.setItem('rytme-scene', JSON.stringify({ spor: 4, klodsFart: .5 })) } catch (e) { } });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    const g = await side.evaluate(() => ({ bane: scene.bane, spor: scene.spor, knap: document.getElementById('pv-bane').textContent }));
    T.tjek(g.bane === true && g.spor === 4 && g.knap === 'Klodsbane: Til', `en gemt scene fra før v9.82 åbner med banen til (${g.knap}, ${g.spor} spor)`, JSON.stringify(g));
    await ctx.close();
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
