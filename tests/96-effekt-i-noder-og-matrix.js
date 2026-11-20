/* Trin 4 · Det nye i v9.109 (PS3): øje og Slå fra pr. effekt i Noder og matrixen, effekternes navne i Live preview. Ved 1920 × 1080 og 2560 × 1440 med
   Alle effekter (fuld1): mål-noden Lys-puls vælges, kontrolpanelet har Synlig/Skjult og Slå fra/til (rigtige klik), noden får klasserne og teksten, scene.ne.eff sættes;
   matrixen: kolonnens overskrift for Lys-puls har øje og ⏻ (rigtige klik), og den bliver svag/gennemstreget; Ctrl+Z; Navne: Til skriver de effekter, der slår til, i hjørnet. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Effekt i Noder og matrix'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('96 · Øje og Slå fra pr. effekt i Noder og matrixen (PS3) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const klik = async (sel) => { const p = await side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'nearest' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width } }, sel); if (!p || !p.w) throw new Error('kan ikke klikke på ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(500) };
      await side.evaluate(() => { brugFor('fuld1', true); lay3Anvend('noder') }); await side.waitForTimeout(2500);
      /* Noder: mål-noden Lys-puls */
      const n0 = await side.evaluate(() => { const n = [...NE2.N.values()].find(x => x.kol === 'maal' && x.effect === 'puls'); if (!n) return null; neVaelg(n.key); return { key: n.key, regler: n.regler.length } });
      await side.waitForTimeout(600);
      const kp = await side.evaluate(() => ({ oeje: !!document.querySelector('#ne-kp [data-ps3="oeje"]'), fra: !!document.querySelector('#ne-kp [data-ps3="fra"]'), tekst: (document.querySelector('#ne-kp [data-ps3="oeje"]') || {}).textContent }));
      T.tjek(n0 && n0.regler >= 1 && kp.oeje && kp.fra && /Synlig/.test(kp.tekst), `${w} × ${h}: mål-noden Lys-puls (${n0 && n0.regler} regler) har Synlig/Skjult og Slå fra/til i kontrolpanelet`, JSON.stringify({ n0, kp }));
      await klik('#ne-kp [data-ps3="fra"]');
      const f1 = await side.evaluate(k => { const n = NE2.N.get(k); return { fra: !!(scene.ne.eff && scene.ne.eff.puls && scene.ne.eff.puls.fra), kl: n && n.el && n.el.classList.contains('ne-fig-fra'), bund: n && n.el ? n.el.querySelector('.ne-bund').textContent : '', knap: (document.querySelector('#ne-kp [data-ps3="fra"]') || {}).textContent, motor: neFraF({ effect: 'puls' }) } }, n0.key);
      T.tjek(f1.fra && f1.kl && /Slået fra/.test(f1.bund) && /Slå til/.test(f1.knap) && f1.motor, 'Slå fra (rigtigt klik) i mål-nodens kontrolpanel: noden er stiplet med "Slået fra", knappen hedder Slå til, motoren siger fra', JSON.stringify(f1));
      await side.waitForTimeout(1500); /* et nyt Fortryd-skridt */
      await klik('#ne-kp [data-ps3="oeje"]');
      const o1 = await side.evaluate(k => { const n = NE2.N.get(k); return { skjult: !!(scene.ne.eff.puls && scene.ne.eff.puls.skjult), kl: n && n.el && n.el.classList.contains('ne-skjult'), E: blinkE({ puls: .7 }).puls } }, n0.key);
      T.tjek(o1.skjult && o1.kl && o1.E === 0, 'øjet (rigtigt klik): effekten er skjult, noden har klassen, tegningen får 0', JSON.stringify(o1));
      await side.waitForTimeout(1500); await side.evaluate(() => document.body.focus()); await side.keyboard.press('Control+z'); await side.waitForTimeout(1200);
      const uz = await side.evaluate(() => ({ eff: JSON.stringify((scene.ne.eff && scene.ne.eff.puls) || {}) }));
      T.tjek(/"fra":true/.test(uz.eff) && !/skjult/.test(uz.eff), 'Ctrl+Z (rigtigt tastetryk) tager det sidste skridt (øjet) tilbage, Slå fra står stadig', JSON.stringify(uz));
      await side.evaluate(() => { psEffSaet('puls', 'fra', undefined); save() });
      /* matrixen */
      await side.evaluate(() => mxSaet(true)); await side.waitForTimeout(1200);
      const m0 = await side.evaluate(() => { const th = [...document.querySelectorAll('#ne-mx th.mx-maal')].find(t => t.querySelector('[data-mxpo="puls"]')); return { th: !!th, oeje: !!(th && th.querySelector('[data-mxpo="puls"]')), fra: !!(th && th.querySelector('[data-mxpf="puls"]')), kl: th ? th.className : '' } });
      T.tjek(m0.th && m0.oeje && m0.fra && !/mx-ps-/.test(m0.kl), 'matrixens overskrift for Lys-puls har øje og ⏻', JSON.stringify(m0));
      await klik('#ne-mx [data-mxpf="puls"]');
      const m1 = await side.evaluate(() => { const th = [...document.querySelectorAll('#ne-mx th.mx-maal')].find(t => t.querySelector('[data-mxpf="puls"]')); return { fra: !!(scene.ne.eff.puls && scene.ne.eff.puls.fra), kl: th ? th.className : '', on: th ? th.querySelector('[data-mxpf="puls"]').classList.contains('on') : false } });
      await klik('#ne-mx [data-mxpo="puls"]');
      const m2 = await side.evaluate(() => { const th = [...document.querySelectorAll('#ne-mx th.mx-maal')].find(t => t.querySelector('[data-mxpo="puls"]')); return { skjult: !!(scene.ne.eff.puls && scene.ne.eff.puls.skjult), kl: th ? th.className : '', raekke: !!document.querySelector('#fg34 [data-pseff="puls"].ps-af') } });
      T.tjek(m1.fra && /mx-ps-fra/.test(m1.kl) && m1.on && m2.skjult && /mx-ps-af/.test(m2.kl), '⏻ og øje i matrixens overskrift (rigtige klik) slår effekten fra og skjuler den; overskriften er gennemstreget og svag', JSON.stringify({ m1, m2 }));
      if (w === 2560) { await side.screenshot({ path: path.join(UD, 'effekt-i-matrix.png'), clip: { x: 0, y: 40, width: 1400, height: 400 } }); }
      await side.evaluate(() => { psEffSaet('puls', 'fra', undefined); psEffSaet('puls', 'skjult', undefined); save(); mxSaet(false) });
      /* Navne: Til: effekternes navne i hjørnet */
      await side.evaluate(() => lay3Anvend('ao-scene')); await side.waitForTimeout(1200);
      const nv = await side.evaluate(async () => { pvNavneSkift(); PS2.E = { puls: .9, glod: .4, farve: 0 }; const c = document.createElement('canvas'); c.width = 400; c.height = 200; const g = c.getContext('2d'); pvNavneTegn(g, 400, 200); const px = g.getImageData(10, 8, 40, 12).data; let lys = 0; for (let i = 0; i < px.length; i += 4) if (px[i] > 120) lys++; const sidst = PS3.sidst.slice(); psEffSaet('puls', 'skjult', true); pvNavneTegn(g, 400, 200); const sidst2 = PS3.sidst.slice(); psEffSaet('puls', 'skjult', undefined); pvNavneSkift(); return { til: set.pvNavne, sidst, sidst2, lys } });
      T.tjek(nv.sidst.length === 2 && nv.sidst[0] === 'Lys-puls' && nv.sidst[1] === 'Glød' && nv.sidst2.length === 1 && nv.sidst2[0] === 'Glød' && nv.lys > 5 && nv.til === false, `Navne: Til skriver effekterne, der slår til (${nv.sidst.join(', ')}), i hjørnet; en skjult effekt skrives ikke`, JSON.stringify(nv));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
