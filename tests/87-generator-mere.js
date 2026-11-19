/* Trin 4 · Det nye i v9.96 (P8.14 svar 3B): hele generatoren ligger under "Mere …" i kortet Generator i Sang; vinduet w4 er væk.
   Ved 1920 × 1080 og 2560 × 1440: kortet har Mere … (foldet fra start) med #gen inde i (trin og pads, tastaturet #keys, Lydmotor-rækken .lm-rad, Gem/Hent, Send til editor);
   rigtigt klik på Mere … folder ud; kortets enkle kontroller (genre) følger stadig med #gen; et rigtigt klik på en tangent spiller uden fejl; Tast og MIDI og Klaverspil
   hentes uden fejl, og computertastaturet virker (kbOn). Skærmbillede: tests/ud/generator-mere.png. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Generator under Mere'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('87 · Generator under Mere … · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.click('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(800);
      const r0 = await side.evaluate(() => { const m = document.getElementById('lks-mere'); return { w4: !!document.getElementById('w4'), mere: !!m, aaben: m && m.open, gen: !!(m && m.querySelector('#gen')), keys: document.querySelectorAll('#lks-mere #keys .key').length, pads: document.querySelectorAll('#lks-mere #pads .pad').length, lm: !!document.querySelector('#lks-mere .lm-rad'), send: !!document.querySelector('#lks-mere #gsend'), gem: document.querySelectorAll('#lks-mere [data-gs]').length, synlig: !!(m && m.querySelector('#keys').checkVisibility()) } });
      T.tjek(!r0.w4 && r0.mere && !r0.aaben && r0.gen && r0.keys === 25 && r0.pads === 256 && r0.lm && r0.send && r0.gem === 5 && !r0.synlig, `${w} × ${h}: vinduet w4 er væk; kortet Generator har Mere … (foldet) med hele generatoren: ${r0.keys} tangenter, ${r0.pads} pads, Lydmotor, Gem 1–5 og Send til editor`, JSON.stringify(r0));
      /* rigtigt klik på Mere … */
      const p = await side.evaluate(() => { const s = document.querySelector('#lks-mere > summary'); s.scrollIntoView({ block: 'center' }); const q = s.getBoundingClientRect(); return { x: q.x + 20, y: q.y + q.height / 2 } });
      await side.mouse.click(p.x, p.y); await side.waitForTimeout(400);
      const r1 = await side.evaluate(() => { const m = document.getElementById('lks-mere'); return { aaben: m.open, synlig: m.querySelector('#keys').checkVisibility() } });
      T.tjek(r1.aaben && r1.synlig, `${w} × ${h}: Mere … folder ud, og tastaturet kan ses`, JSON.stringify(r1));
      await side.locator('#lks .lks-kort:nth-child(2)').screenshot({ path: path.join(UD, 'generator-mere.png') });
      /* kortets genre følger #gen */
      const r2 = await side.evaluate(async () => { const s = document.getElementById('lks-gen'); s.value = 'techno'; s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 400)); return { gen: document.querySelector('#gen [data-g="gen"]').value, cur: curGen } });
      T.tjek(r2.gen === 'techno' && r2.cur === 'techno', `${w} × ${h}: kortets Genre styrer stadig generatoren (${r2.cur})`, JSON.stringify(r2));
      /* en tangent (rigtigt klik) */
      const k = await side.evaluate(() => { const e = document.querySelector('#lks-mere #keys .key[data-k="60"]'); e.scrollIntoView({ block: 'center' }); const q = e.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height * .8 } });
      await side.mouse.click(k.x, k.y); await side.waitForTimeout(300);
      const r3 = await side.evaluate(() => ({ ctx: !!gctx, fejl: 0 }));
      T.tjek(r3.ctx, `${w} × ${h}: en tangent (rigtigt klik) starter lyden uden fejl`, JSON.stringify(r3));
      /* Tast og MIDI og Klaverspil */
      const r4 = await side.evaluate(async () => { const o = {}; for (const id of ['spilselv', 'klaverspil']) { brugFor(id, true); await new Promise(r => setTimeout(r, 500)); o[id] = { fig: fase2.objekter.filter(x => x.synlig).length, regler: maps.length, kb: kbOn, knap: (document.getElementById('gkb') || {}).textContent } } return o });
      T.tjek(r4.spilselv.fig >= 2 && r4.spilselv.regler === 4 && r4.klaverspil.fig >= 1 && r4.klaverspil.regler === 3 && r4.spilselv.kb && /Til/.test(r4.spilselv.knap), `${w} × ${h}: Tast og MIDI (${r4.spilselv.regler} regler) og Klaverspil (${r4.klaverspil.regler} regler) virker, og computertastaturet er til`, JSON.stringify(r4));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
