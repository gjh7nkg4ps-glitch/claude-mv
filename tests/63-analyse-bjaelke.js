/* Trin 4 · Det nye i v9.68: analysens bjælke og Annullér, zoom ud til 2 %, og Tidslinjen uden fejl, når toppene mangler.
   - Mens en rigtig lydfil analyseres, står feltet midt øverst med trinnet (1 af 2, 2 af 2), bjælken og tiden.
   - Annullér (rigtigt museklik) stopper analysen: ingen analyse, Afspil er grå, og statuslinjen siger det.
   - Vælges filen igen, bliver analysen færdig, og feltet forsvinder.
   - Annulleres Analysér igen, bruges den gamle analyse stadig.
   - Node-editoren kan zoomes ud til 2 %. */
const path = require('path'), fs = require('fs'), os = require('os');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Analysens bjælke');
  console.log('63 · Analysens bjælke og Annullér, og zoom ud til 2 % · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')), 'testlyd-bjaelke.wav'));
    const felt = () => side.evaluate(() => { const d = document.getElementById('ana-prog'); if (!d || d.hidden) return null; const r = d.getBoundingClientRect(), bj = d.querySelector('.ana-bj'), i = bj.querySelector('i'); return { trin: d.querySelector('.ana-trin').textContent, tal: d.querySelector('.ana-tal').textContent, andel: i.getBoundingClientRect().width / bj.getBoundingClientRect().width, bred: r.width, top: r.top, midt: Math.abs(r.left + r.width / 2 - innerWidth / 2) < 4, knap: !!d.querySelector('#ana-stop') } });
    /* 1 · feltet under analysen: trin 1 og trin 2 */
    await side.setInputFiles('#file', wav); let f1 = null, f2 = null; const t0 = Date.now();
    while (Date.now() - t0 < 200000) { const f = await felt(); if (f && /Trin 1 af 2/.test(f.trin) && !f1) f1 = f; if (f && /Trin 2 af 2/.test(f.trin)) { f2 = f; if (f.andel > .25) break } await side.waitForTimeout(60); }
    T.tjek(!!f1 && !!f2 && f1.midt && f1.bred > 400 && f1.knap && /lydtræk/.test(f1.trin) && /toner og klang/.test(f2.trin) && f2.andel > f1.andel && f2.andel > .19 && /% af hele analysen · gået \d+:\d\d/.test(f2.tal), `mens lydfilen analyseres, står feltet midt øverst med Trin 1 af 2 (lydtræk) og derefter Trin 2 af 2 (toner og klang), en bjælke (${f2 ? Math.round(f2.andel * 100) : '?'} %) og tiden: "${f2 ? f2.tal : ''}"`, JSON.stringify({ f1, f2 }));
    /* 2 · Annullér med et rigtigt museklik */
    const p = await side.evaluate(() => { const b = document.getElementById('ana-stop').getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2 } }); await side.mouse.click(p.x, p.y); await side.waitForTimeout(1500);
    const a = await side.evaluate(() => ({ status: document.getElementById('status').textContent, F: typeof F !== 'undefined' && !!F, play: document.getElementById('play').disabled, felt: !document.getElementById('ana-prog').hidden }));
    T.tjek(/Analysen blev annulleret/.test(a.status) && !a.F && a.play && !a.felt, `Annullér stopper analysen: "${a.status}"; der er ingen analyse, Afspil er grå, og feltet er væk`, JSON.stringify(a));
    /* 3 · vælg filen igen: analysen bliver færdig */
    await side.setInputFiles('#file', []); await side.setInputFiles('#file', wav);
    await side.waitForFunction(() => typeof F !== 'undefined' && F && !document.getElementById('play').disabled && /slag fundet i/.test(document.getElementById('status').textContent), null, { timeout: 240000 }); await side.waitForTimeout(400);
    const b = await side.evaluate(() => ({ status: document.getElementById('status').textContent, felt: !document.getElementById('ana-prog').hidden, tjek: anaTjek().ok, toppe: !!peaks && !!peaks.kick }));
    T.tjek(!b.felt && b.tjek && b.toppe && /slag fundet i \d af 8 dele/.test(b.status), `vælges filen igen, bliver analysen færdig, og feltet forsvinder: "${b.status}"`, JSON.stringify(b));
    /* 4 · Analysér igen, annulleret: den gamle analyse bruges stadig */
    await side.evaluate(() => { window.__igen = anaIgen() }); let f4 = null; const t4 = Date.now(); while (Date.now() - t4 < 60000 && !f4) { f4 = await felt(); await side.waitForTimeout(40) }
    const p4 = await side.evaluate(() => { const q = document.getElementById('ana-stop').getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }); await side.mouse.click(p4.x, p4.y);
    const c = await side.evaluate(async () => { const ok = await window.__igen; return { ok, status: document.getElementById('status').textContent, F: !!F, n: F.kick.length, felt: !document.getElementById('ana-prog').hidden, play: document.getElementById('play').disabled } });
    T.tjek(!!f4 && c.ok === false && /Analysér igen blev annulleret\. Den gamle analyse bruges stadig/.test(c.status) && c.F && c.n > 100 && !c.felt && !c.play, 'annulleres Analysér igen, bruges den gamle analyse stadig, og Afspil virker', JSON.stringify(c));
    /* 5 · Tidslinjen giver ingen fejl, når toppene mangler (fejlen fra brugerens konsol) */
    const d = await side.evaluate(async () => { lay3Anvend('ao-sang'); await new Promise(r => setTimeout(r, 1200)); try { dkVis('w1') } catch (e) { } const gl = peaks; peaks = {}; let kast = null; try { drawTL() } catch (e) { kast = e.message } await new Promise(r => setTimeout(r, 600)); peaks = gl; return { kast } });
    T.tjek(!d.kast && !fejl.length, 'Tidslinjen tegnes uden fejl, selv om toppene ikke er regnet endnu (før: en fejl ved hvert billede, mens sangen blev analyseret igen)', JSON.stringify({ d, fejl: fejl.slice(0, 2) }));
    /* 6 · zoom ud til 2 % */
    const z = await side.evaluate(async () => { lay3Anvend('ao-regler'); await new Promise(r => setTimeout(r, 2000)); mxSaet(false, true); await new Promise(r => setTimeout(r, 600)); for (let i = 0; i < 40; i++) neZoomMidt(.8); await new Promise(r => setTimeout(r, 400)); const ud = { z: NE.z, tekst: document.getElementById('ne-zoom').textContent, tr: document.getElementById('ne-verden').style.transform }; for (let i = 0; i < 60; i++) neZoomMidt(1.25); await new Promise(r => setTimeout(r, 300)); ud.max = NE.z; neTilpas(); return ud });
    T.tjek(Math.abs(z.z - .02) < 1e-9 && z.tekst === '2 %' && /scale\(0\.02\)/.test(z.tr) && z.max === 2, `Node-editoren kan zoomes ud til ${z.tekst} (før 10 %) og ind til 200 %`, JSON.stringify(z));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
