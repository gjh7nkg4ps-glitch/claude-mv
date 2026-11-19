/* Trin 4 · Det nye i v9.104 (P8.18 D1, D2, D3): Gemt ✓ i linjen øverst, banner når gemningen fejler, tasten ? åbner Tastaturgenveje, Hvad er nyt på startskærmen.
   Ved 1920 × 1080: alle localStorage.setItem går gennem lsGem (kun én i koden); save() giver Gemt ✓ (synligt) og intet banner; når setItem kaster QuotaExceededError,
   viser save() banneret med teksten og knappen; rigtigt klik på knappen eksporterer (opsEksport kaldes) og åbner Opsætninger; når gemningen lykkes igen, forsvinder banneret;
   tasten ? (rigtigt tastetryk) åbner manualen ved Tastaturgenveje, men ikke i et felt; startskærmen (set.startSkTest) viser Hvad er nyt i v… med højst 5 linjer og knappen til manualen. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller, versionFraNavn } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Gemning siger til'), v = versionFraNavn(fil), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('91 · Gemning siger til, ?, Hvad er nyt · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');
  T.tjek((html.match(/localStorage\.setItem\(/g) || []).length === 1 && (html.match(/lsGem\(/g) || []).length > 60, `alle localStorage.setItem går gennem lsGem (${(html.match(/lsGem\(/g) || []).length} steder; setItem står kun i hjælpefunktionen)`);
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.goto('file://' + fil); await side.waitForTimeout(4500);
    const r1 = await side.evaluate(async () => { GEM.tid = 0; save(); await new Promise(r => setTimeout(r, 200)); const m = document.getElementById('gem-ok'); return { maerke: !!m, vis: m && m.classList.contains('vis') && m.checkVisibility(), banner: !!document.getElementById('gem-fejl') && !document.getElementById('gem-fejl').hidden } });
    T.tjek(r1.maerke && r1.vis && !r1.banner, 'save() lyser Gemt ✓ i linjen øverst, og der er intet banner', JSON.stringify(r1));
    /* lageret er fuldt */
    const r2 = await side.evaluate(async () => { window.__glSet = Storage.prototype.setItem; window.__eks = 0; const glE = opsEksport; window.opsEksport = () => { window.__eks++ }; Storage.prototype.setItem = function () { const e = new Error('kvote'); e.name = 'QuotaExceededError'; throw e }; save(); await new Promise(r => setTimeout(r, 200)); const b = document.getElementById('gem-fejl'); const q = b.querySelector('#gem-fejl-kopi').getBoundingClientRect(); return { vis: !!b && !b.hidden && b.checkVisibility(), tekst: b && b.textContent, x: q.x + q.width / 2, y: q.y + q.height / 2 } });
    T.tjek(r2.vis && /Kunne ikke gemme/.test(r2.tekst) && /sikkerhedskopi/.test(r2.tekst) && /Gem alle på computeren/.test(r2.tekst), `når lageret er fuldt, viser save() banneret: "${(r2.tekst || '').slice(0, 60)}…"`, JSON.stringify({ vis: r2.vis }));
    await side.mouse.click(r2.x, r2.y); await side.waitForTimeout(700);
    const r3 = await side.evaluate(() => ({ eks: window.__eks, ops: !!document.getElementById('w13') && !document.getElementById('w13').hidden }));
    T.tjek(r3.eks === 1 && r3.ops, 'knappen i banneret (rigtigt klik) gemmer på computeren (opsEksport) og åbner Opsætninger', JSON.stringify(r3));
    const r4 = await side.evaluate(async () => { Storage.prototype.setItem = window.__glSet; save(); await new Promise(r => setTimeout(r, 200)); return { banner: !document.getElementById('gem-fejl').hidden, fejl: GEM.fejl } });
    T.tjek(!r4.banner && !r4.fejl, 'når gemningen lykkes igen, forsvinder banneret', JSON.stringify(r4));
    /* ? */
    await side.evaluate(() => { try { document.getElementById('gd').close() } catch (e) { } document.body.focus() });
    await side.keyboard.press('Shift+?'); await side.waitForTimeout(500);
    const r5 = await side.evaluate(() => { const g = document.getElementById('gd'); const h = document.getElementById('man-genveje'); const q = h.getBoundingClientRect(); return { aaben: g.open, synlig: q.top >= -5 && q.top < 400 } });
    T.tjek(r5.aaben && r5.synlig, 'tasten ? åbner manualen ved Tastaturgenveje', JSON.stringify(r5));
    await side.evaluate(() => { document.getElementById('gd').close(); const i = document.createElement('input'); i.id = 'test91-felt'; document.body.appendChild(i); i.focus() });
    await side.keyboard.press('Shift+?'); await side.waitForTimeout(300);
    const r6 = await side.evaluate(() => ({ aaben: document.getElementById('gd').open, felt: /INPUT|TEXTAREA/.test(document.activeElement.tagName) }));
    T.tjek(!r6.aaben && r6.felt, 'i et felt gør ? ingenting', JSON.stringify(r6));
    /* Hvad er nyt på startskærmen */
    await side.evaluate(() => { set.startSkTest = true; startSkVis(true) }); await side.waitForTimeout(400);
    const r7 = await side.evaluate(v => { const d = document.getElementById('start-sk'), n = document.querySelector('#start-nyt .start-nyt'); return { aaben: d.open, findes: !!n, summary: n && n.querySelector('summary').textContent, li: n ? n.querySelectorAll('li').length : 0, knap: !!(n && n.querySelector('[data-startnyt]')) } }, v);
    T.tjek(r7.aaben && r7.findes && r7.summary === 'Hvad er nyt i v' + v && r7.li >= 1 && r7.li <= 5 && r7.knap, `startskærmen viser "${r7.summary}" med ${r7.li} linjer og knappen til manualen`, JSON.stringify(r7));
    await side.evaluate(() => { document.querySelector('#start-nyt details').open = true }); await side.waitForTimeout(200);
    await side.screenshot({ path: path.join(UD, 'startskaerm-nyt.png'), clip: { x: 560, y: 150, width: 800, height: 700 } });
    const k = await side.evaluate(() => { const b = document.querySelector('[data-startnyt]'); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
    await side.mouse.click(k.x, k.y); await side.waitForTimeout(500);
    const r8 = await side.evaluate(v => { const g = document.getElementById('gd'), h = document.getElementById('man-v' + v.replace('.', '')); return { start: document.getElementById('start-sk').open, manual: g.open, top: h ? h.getBoundingClientRect().top : null } }, v);
    T.tjek(!r8.start && r8.manual && r8.top !== null && r8.top > -5 && r8.top < 400, 'Hele listen i manualen (rigtigt klik) lukker startskærmen og åbner manualen ved det nye afsnit', JSON.stringify(r8));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
