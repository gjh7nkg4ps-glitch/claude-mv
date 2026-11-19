/* Trin 4 · Det nye i v9.79 (trin S5): kortet Stereo under Sang → Avanceret efter Toner og klang.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med stereo-testlyden: kortet har goniometeret og de tre tal (Stereobredde, Panorering, Faselighed) fra
   analysens egne rækker (samme tal som sampleA); mens der spilles, tegner goniometeret punkter; i det brede stykke (20–30 s) er bredden høj, i venstre-stykket
   (10–20 s) er panoreringen under 0,5; Brug i en regel (rigtigt klik) lægger rækken i matrixen og åbner 3 · Regler; Vis over tid slår rækken Stereo til i Lyd over tid. */
const path = require('path'), os = require('os'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Stereo');
  console.log('74 · Kortet Stereo (S5) · ' + path.basename(fil));
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-ste-')), st = lavTestlyd.stereo(path.join(d, 'stereo-ste.wav'));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.click('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(800); await side.click('#sg [data-sgf="avanceret"]'); await side.waitForTimeout(400);
      const r0 = await side.evaluate(() => ({ kort: [...document.querySelectorAll('#sg .sg-fane[data-sg="avanceret"] .sg-kort h4')].map(x => x.textContent), gon: !!document.getElementById('ste-gon'), tal: [...document.querySelectorAll('#sg .ste-r b')].map(x => x.textContent), knapper: document.querySelectorAll('#sg [data-sgregel]').length, vis: !!document.querySelector('#sg [data-stelot]') }));
      T.tjek(r0.kort.join(',') === 'Lyd over tid,Toner og klang,Stereo,Spektrum+,Detektion,Indstillinger for analysen' /* v9.95: Detektion */ && r0.gon && r0.tal.join(',') === 'Stereobredde,Panorering,Faselighed' && r0.knapper === 3 && r0.vis, `${w} × ${h}: Stereo ligger efter Toner og klang med goniometer, ${r0.tal.join(', ')}, tre knapper Brug i en regel og Vis over tid`, JSON.stringify(r0));
      await side.setInputFiles('#file', st); await side.waitForFunction(() => /Analyse færdig og gemt i cache|Analyse hentet fra cache/.test(document.getElementById('status').textContent) && !!A && !!A['ana:bredde'], null, { timeout: 240000 });
      /* tallene følger analysen: bredt stykke (25 s) og venstre stykke (15 s) */
      const v = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const laes = () => { const o = {}; document.querySelectorAll('#sg .ste-r').forEach(r => { o[r.dataset.ste] = { tekst: r.querySelector('em').textContent, w: parseFloat(r.querySelector('u').style.width) } }); return o };
        tlSpring(25); steTik(); await vent(100); const bred = laes(), bredA = sampleA('ana:bredde', now()); tlSpring(15); STE.sidst = 0; steTik(); await vent(100); const venstre = laes(), panA = sampleA('ana:pan', now()); tlSpring(3); STE.sidst = 0; steTik(); await vent(100); const mono = laes(); return { bred, bredA, venstre, panA, mono } });
      const tal = s => parseFloat(String(s).replace(',', '.'));
      T.tjek(tal(v.bred['ana:bredde'].tekst) > .1 && tal(v.bred['ana:pan'].tekst) > .6 && Math.abs(tal(v.bred['ana:bredde'].tekst) - v.bredA) < .011 && tal(v.venstre['ana:pan'].tekst) < .35 && Math.abs(tal(v.venstre['ana:pan'].tekst) - v.panA) < .011 && tal(v.mono['ana:bredde'].tekst) < .15 && Math.abs(v.bred['ana:bredde'].w / 100 - v.bredA) < .02, `${w} × ${h}: tallene er analysens egne: højre og brede stykke bredde ${v.bred['ana:bredde'].tekst} (sampleA ${v.bredA.toFixed(2)}) og panorering ${v.bred['ana:pan'].tekst}, venstre stykke panorering ${v.venstre['ana:pan'].tekst} (${v.panA.toFixed(2)}), mono stykke bredde ${v.mono['ana:bredde'].tekst}`, JSON.stringify(v));
      if (w !== 1920) { T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n')); await ctx.close(); continue }
      /* goniometeret tegner, mens der spilles */
      await side.evaluate(() => { tlSpring(22); play() }); await side.waitForTimeout(1500);
      const gon = await side.evaluate(() => { const c = document.getElementById('ste-gon'), g = c.getContext('2d'), dta = g.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < dta.length; i += 4) if (dta[i] > 150 && dta[i + 1] > 100) n++; return { n, playing } });
      await side.evaluate(() => stop());
      T.tjek(gon.playing && gon.n > 100, `goniometeret tegner punkter, mens der spilles (${gon.n} lyse punkter)`, JSON.stringify(gon));
      /* Brug i en regel (rigtigt klik) */
      const p = await side.evaluate(() => { const b = document.querySelector('#sg [data-sgregel="ana:fase"]'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.click(p.x, p.y); await side.waitForTimeout(1500);
      const m = await side.evaluate(() => ({ lay: set.lay3, mx: set.ne.mx, raekke: set.ne.mxE.b.includes('ana:fase'), th: [...document.querySelectorAll('#ne-mx th.mx-lt')].map(x => x.dataset.b).includes('ana:fase'), toast: (document.getElementById('ne-toast') || {}).textContent }));
      T.tjek(m.lay === 'ao-regler' && m.mx && m.raekke && m.th, `Brug i en regel (rigtigt klik på Faselighed) åbner 3 · Regler med matrixen, hvor rækken Faselighed står (${m.toast})`, JSON.stringify(m));
      /* Vis over tid */
      await side.evaluate(() => { lay3Anvend('ao-sang') }); await side.waitForTimeout(900); await side.evaluate(() => { const L = lotIndst(); L.rk.stereo = false; lotGem(); lotHoved() });
      const p2 = await side.evaluate(() => { const b = document.querySelector('#sg [data-stelot]'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.click(p2.x, p2.y); await side.waitForTimeout(600);
      const lo = await side.evaluate(() => ({ stereo: set.lot.rk.stereo, flueben: document.querySelector('[data-lotrk="stereo"]').checked }));
      T.tjek(lo.stereo && lo.flueben, 'Vis over tid slår rækken Stereo til i Lyd over tid', JSON.stringify(lo));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
