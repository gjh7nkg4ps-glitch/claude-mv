/* Trin 4 · Det nye i v9.69: mindre spildt arbejde (ydelse) og Skarphed i Kvalitet.
   Målt på 6 sekunders afspilning med Pigernes show i 3 · Regler (2× skærmskalering):
   - dockingen lægges ikke om ved hvert billede (før: cirka 24 resize-hændelser i sekundet; nu under 1 i sekundet),
     men et rigtigt skift af vinduets størrelse lægger stadig zonerne om, så de fylder bredden;
   - Sikker visning læser pixels højst 13 gange i sekundet (før: ved hvert billede);
   - værktøjstip gennemgår ikke hele siden ved hver ændring (højst 2 fulde gennemgange på 6 s; før cirka 10 i sekundet);
   - Skarphed (Live preview) under Mere → Lyd og ydelse og i Kvalitet (v9.70: menuen, fordi Kvalitet er skjult på lavt Niveau): Fuld = 2× på en 2×-skærm, 1× halverer tegnefladen, Opløsning er skjult, og regulatoren på trin 4 sænker til 1× med tekst. */
const path = require('path'), fs = require('fs'), os = require('os');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Ydelse');
  console.log('64 · Ydelse: dockingens sløjfe, Sikker visning, værktøjstip og Skarphed · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.addInitScript(() => { window.__T = {}; const tael = k => { window.__T[k] = (window.__T[k] || 0) + 1 }; const g2 = CanvasRenderingContext2D.prototype.getImageData; CanvasRenderingContext2D.prototype.getImageData = function () { tael('getImageData'); return g2.apply(this, arguments) }; addEventListener('resize', () => tael('resize')) });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    await side.evaluate(() => { const gl = window.tipAlle; window.tipAlle = function (rod) { if (!rod || rod === document) window.__T.tipHele = (window.__T.tipHele || 0) + 1; return gl.apply(this, arguments) }; const g2 = window.dkAnvend; window.dkAnvend = function () { window.__T.dkAnvend = (window.__T.dkAnvend || 0) + 1; return g2.apply(this, arguments) } });
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')), 'testlyd-ydelse.wav'));
    await side.setInputFiles('#file', wav); await side.waitForFunction(() => typeof F !== 'undefined' && F && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('piger_show', true); await vent(1500); lay3Anvend('ao-regler'); await vent(2500); mxSaet(false, true); await vent(1500); window.__T = {} });
    await side.click('#play'); await side.waitForTimeout(6000);
    const r = await side.evaluate(() => ({ T: window.__T, sikker: set.sikker, fps: typeof METER !== 'undefined' && METER.t && METER.t.length ? Math.round(1000 / (METER.t.reduce((a, x) => a + x, 0) / METER.t.length)) : null }));
    /* 1 · dockingens sløjfe */
    T.tjek((r.T.resize || 0) <= 6 && (r.T.dkAnvend || 0) <= 6, `dockingen lægges ikke om ved hvert billede: ${r.T.resize || 0} resize-hændelser og ${r.T.dkAnvend || 0} omlægninger på 6 s afspilning (v9.68: cirka 24 i sekundet)`, JSON.stringify(r));
    /* 2 · Sikker visning */
    T.tjek(r.sikker === true && (r.T.getImageData || 0) <= 13 * 6 + 4 && (r.T.getImageData || 0) >= 20, `Sikker visning er til og læser pixels højst 13 gange i sekundet: ${r.T.getImageData || 0} læsninger på 6 s (v9.68: ved hvert billede)`, JSON.stringify(r));
    /* 3 · værktøjstip */
    T.tjek((r.T.tipHele || 0) <= 2, `værktøjstip gennemgår ikke hele siden ved hver ændring: ${r.T.tipHele || 0} fulde gennemgange på 6 s (v9.68: cirka 10 i sekundet)`, JSON.stringify(r));
    await side.evaluate(() => stop());
    /* 4 · et rigtigt skift af vinduets størrelse lægger stadig zonerne om */
    await side.evaluate(() => { window.__T = {} }); await side.setViewportSize({ width: 1600, height: 900 }); await side.waitForTimeout(1500);
    const z = await side.evaluate(() => { const Z = [...document.querySelectorAll('.dk-zone')].filter(z => !z.hidden).map(z => z.getBoundingClientRect()); const ws = document.getElementById('ws').getBoundingClientRect(); return { n: Z.length, inde: Z.every(q => q.right <= ws.right + 2 && q.bottom <= ws.bottom + 2), bred: Math.max(...Z.map(q => q.right)) >= ws.right - 30, T: window.__T } });
    T.tjek(z.n >= 2 && z.inde && z.bred && (z.T.dkAnvend || 0) >= 1 && (z.T.resize || 0) <= 8, `et rigtigt skift af vinduets størrelse (1920 → 1600) lægger zonerne om, så de fylder bredden (${z.n} zoner, ${z.T.dkAnvend || 0} omlægninger, ${z.T.resize || 0} resize-hændelser), og det stopper igen`, JSON.stringify(z));
    await side.setViewportSize({ width: 1920, height: 1080 }); await side.waitForTimeout(1200);
    /* 5 · Skarphed i Kvalitet */
    await side.evaluate(async () => { lay3Anvend('ao-scene'); await new Promise(r => setTimeout(r, 1500)) });
    /* v9.71: Skarphed står under ☰ Mere → Lyd og ydelse i linjen øverst; Mere åbnes med et rigtigt klik */
    const mk = await side.evaluate(() => { const b = document.getElementById('el9-mere'); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }); await side.mouse.click(mk.x, mk.y); await side.waitForTimeout(600);
    const k = await side.evaluate(() => { const s = document.getElementById('tb-skarp'), o = document.getElementById('kv-skala'), s0 = document.getElementById('kv-skarp'); const c = document.getElementById('pv'), b = c.closest('.wb') || c.parentElement; return { findes: !!s, muligheder: s ? [...s.options].map(x => x.value).join(',') : '', vaerdi: s && s.value, oploesningSkjult: !!o && getComputedStyle(o.closest('label')).display === 'none', pvB: c.width, klientB: b.clientWidth, synlig: s && s.getBoundingClientRect().width > 0, iKvalitet: !!s0 && [...s0.options].map(x => x.value).join(',') === 'fuld,2,1' } });
    /* valget sættes med value + change (rullelisten kan stå uden for det synlige i Kvalitet-fanen) */
    T.tjek(k.findes && k.synlig && k.iKvalitet && k.muligheder === 'fuld,2,1' && k.vaerdi === 'fuld' && k.oploesningSkjult && Math.abs(k.pvB - k.klientB * 2) <= 4, `☰ Mere → Lyd og ydelse (åbnet med et rigtigt klik) viser Skarphed (Live preview), og det samme valg står i Kvalitet: Fuld · Højst 2× · 1× (står på Fuld = 2× på en 2×-skærm: tegnefladen ${k.pvB} for ${k.klientB} px), og Opløsning er skjult`, JSON.stringify(k));
    await side.selectOption('#tb-skarp', '1'); await side.waitForTimeout(700);
    const k1 = await side.evaluate(() => { const c = document.getElementById('pv'), b = c.closest('.wb') || c.parentElement; return { pvB: c.width, klientB: b.clientWidth, gemt: JSON.parse(localStorage.getItem('rytme-set') || '{}').skarp, tekst: document.getElementById('kv-skarp-nu').textContent, kv: document.getElementById('kv-skarp').value } });
    T.tjek(Math.abs(k1.pvB - k1.klientB) <= 4 && k1.gemt === '1' && /tegneflade/.test(k1.tekst) && k1.kv === '1', `1× halverer tegnefladen (${k1.pvB} for ${k1.klientB} px), valget huskes, og teksten viser skalering og tegneflade: "${k1.tekst}"`, JSON.stringify(k1));
    await side.selectOption('#tb-skarp', 'fuld'); await side.waitForTimeout(500);
    const k2 = await side.evaluate(async () => { set.kval = { ...set.kval, regulator: true }; REG.trin = 4; pvResize(); await new Promise(r => setTimeout(r, 700)); const c = document.getElementById('pv'), b = c.closest('.wb') || c.parentElement; const ud = { pvB: c.width, klientB: b.clientWidth, tekst: document.getElementById('kv-skarp-nu').textContent }; REG.trin = 0; set.kval = { ...set.kval, regulator: false }; pvResize(); await new Promise(r => setTimeout(r, 700)); ud.pvB2 = c.width; return ud });
    T.tjek(Math.abs(k2.pvB - k2.klientB) <= 4 && /regulatoren har sænket skarpheden til 1×/.test(k2.tekst) && Math.abs(k2.pvB2 - k2.klientB * 2) <= 4, `regulatoren på trin 4 sænker skarpheden til 1× (${k2.pvB} for ${k2.klientB} px), og det står i Kvalitet; på trin 0 er den Fuld igen (${k2.pvB2})`, JSON.stringify(k2));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
