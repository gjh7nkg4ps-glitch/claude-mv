/* Trin 4 · Det nye i v9.125 (A2): sikkerhedsgrænse og enighed i reglerne.
   Ved 1920 × 1080: kontrolpanelet for en regel har skyderen Kræv sikkerhed over Gate, med lydtrækkets sikkerhed og hvor den kommer fra; et rigtigt klik på
   skyderen sætter grænsen, og regel-noden får mærket "≥ N %"; motoren: en regel med grænsen 0,8 spærres, når sikkerheden er 0,3, og virker ved 0,9, og uden
   grænse regnes som før; sikkerheden er fast (Analyse sikkerhed) for Kick og pr. øjeblik for Tonehøjde og Takt 1 (fasens sikkerhed takt for takt); Gate er
   forklaret som enighed; Foreslå regler hæver tærsklen 0,1 for lydtræk under 75 %; Lyd over tid skraverer Taktslag, hvor takt 1 er usikker; ingen konsolfejl. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Kræv sikkerhed'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('106 · Kræv sikkerhed og enighed (A2) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-a2-'));
  const browser = await chromium.launch(); const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500);
    await side.evaluate(async () => { const d = await asKoer() });
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); maps.push({ band: 'ana:pitch', effect: 'ring', thr: .1, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }); renderMaps(); await new Promise(r => setTimeout(r, 900)) });
    const vælg = () => side.evaluate(async () => { const i = maps.length - 1, n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i); neVaelg(n.key); NE.tilpas = false; NE.z = .8; NE.x = Math.round(300 - n.x * NE.z); NE.y = Math.round(96 - n.y * NE.z); neVis(); await new Promise(r => setTimeout(r, 400)); return i });
    const i = await vælg();
    const p0 = await side.evaluate(() => { const kp = document.getElementById('ne-kp'), s = kp && kp.querySelector('.ne-sik'), g = kp && kp.querySelector('.ne-gate'), inp = s && s.querySelector('input[data-nf="sik"]'); return { s: !!s, foer: !!(s && g && (s.compareDocumentPosition(g) & Node.DOCUMENT_POSITION_FOLLOWING)), tekst: s ? s.textContent : '', inp: !!inp, gate: g ? (g.querySelector('label') || {}).title || '' : '' } });
    T.tjek(p0.s && p0.foer && p0.inp && /Kræv sikkerhed Fra/.test(p0.tekst) && /Sikkerhed for Tonehøjde/.test(p0.tekst) && /Tonesikkerhed, pr\. øjeblik/.test(p0.tekst) && /Gate \(enighed\)/.test(p0.gate),
      'kontrolpanelet har skyderen Kræv sikkerhed (Fra) over Gate; den siger, at Tonehøjdes sikkerhed er Tonesikkerhed pr. øjeblik; Gate er forklaret som enighed', JSON.stringify(p0).slice(0, 400));
    /* rigtigt klik på skyderen ved cirka 80 % */
    const q = await side.evaluate(() => { const e = document.querySelector('#ne-kp input[data-nf="sik"]'); e.scrollIntoView({ block: 'center' }); const r = e.getBoundingClientRect(); return { x: r.x + r.width * .8, y: r.y + r.height / 2 } });
    await side.mouse.click(q.x, q.y); await side.waitForTimeout(1200);
    const p1 = await side.evaluate(i => { const m = maps[i], n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i), mk = n && n.el && n.el.querySelector('.ne-m-sik'); return { sik: m.sik, mk: mk ? mk.textContent : '', lab: (document.querySelector('#ne-kp [data-nv="sik"]') || {}).textContent || '' } }, i);
    T.tjek(p1.sik >= .7 && p1.sik <= .9 && p1.mk === '≥ ' + Math.round(p1.sik * 100) + ' %' && p1.lab === Math.round(p1.sik * 100) + ' %', `et rigtigt klik på skyderen sætter grænsen til ${Math.round(p1.sik * 100)} %, og regel-noden får mærket "${p1.mk}"`, JSON.stringify(p1));
    await side.evaluate(() => { const e = document.querySelector('#ne-kp .ne-sik'); if (e) e.scrollIntoView({ block: 'center' }) }); await side.waitForTimeout(300);
    await side.screenshot({ path: path.join(UD, 'kraev-sikkerhed.png') });
    /* motoren: grænsen spærrer som Gate */
    const mo = await side.evaluate(() => { const gl = window.a2Sik; let sv = .3; window.a2Sik = () => ({ v: sv, slags: 'nu', hvor: 'test' }); const kør = (M, n) => { const o = { v: () => 1, off: () => false, master: 1, dt: 1 / 60, env: [], pe: [], E: {}, kant: () => { }, holdRyd: false }; for (let k = 0; k < n; k++) { o.E = {}; Rytme.koer(M, o) } return { E: o.E.ring || 0, blok: !!A2.blok[0] } };
      const M = [{ band: 'ana:pitch', effect: 'ring', thr: .1, gain: 1, att: 8, rel: 120, curve: 1, gap: 120, sik: .8 }];
      const a = kør(M, 30); sv = .9; const b = kør(M, 30); const c = kør([{ band: 'ana:pitch', effect: 'ring', thr: .1, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }], 30); window.a2Sik = gl; return { a, b, c } });
    T.tjek(mo.a.E === 0 && mo.a.blok && mo.b.E > .5 && !mo.b.blok && Math.abs(mo.c.E - mo.b.E) < 1e-9, `motoren: med grænsen 0,8 spærres reglen ved sikkerhed 0,3 (udgang ${mo.a.E}) og virker ved 0,9 (${mo.b.E.toFixed(2)}); uden grænse regnes som før (${mo.c.E.toFixed(2)})`, JSON.stringify(mo));
    const fa = await side.evaluate(() => { const k = a2Sik('kick'), s = a2Sik('snare'), u = a2Sik('ana:tonestyrke'); return { k, ks: AS.data.res.kick.s, s, ss: AS.data.res.snare.s, u } });
    T.tjek(fa.k.slags === 'fast' && fa.k.v === fa.ks / 100 && fa.s.v === fa.ss / 100 && /Analyse sikkerhed/.test(fa.k.hvor) && fa.u.v === null && /spærrer ikke/.test(fa.u.hvor), `fast sikkerhed fra Analyse sikkerhed: Kick ${fa.k.v}, Snare ${fa.s.v}; ikke målt (Tonestyrke) spærrer ikke`, JSON.stringify(fa).slice(0, 300));
    /* en sang: Takt 1 pr. øjeblik og Lyd over tid */
    const wav = lavTestlyd(path.join(tmp, 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav); await side.waitForFunction(() => F && A && SHOWPROFIL && SHOWPROFIL.faseInfo && !document.getElementById('play').disabled, null, { timeout: 180000 }); await side.waitForTimeout(800);
    const tk = await side.evaluate(() => { const k = a2FaseKurve(), a = a2Sik('ana:takt', 10), b = a2Sik('hnd:takt4', 10); return { n: k && k.length, nf: F.kick.length, a, b, min: k ? Math.min(...k) : null, max: k ? Math.max(...k) : null } });
    T.tjek(tk.n === tk.nf && tk.a.slags === 'nu' && /takt for takt/.test(tk.a.hvor) && tk.a.v >= .2 && tk.a.v <= .95 && tk.b.v === tk.a.v, `Takt 1 har sikkerhed pr. øjeblik (fasens sikkerhed takt for takt): ved 10 s ${tk.a.v.toFixed(2)}, i hele sangen ${tk.min.toFixed(2)}–${tk.max.toFixed(2)}; Takt 1-hændelsen bruger det samme`, JSON.stringify(tk).slice(0, 300));
    /* Foreslå regler: lydtræk under 75 % får tærsklen hævet */
    const fo = await side.evaluate(() => { const gem = maps.slice(); maps.length = 0; const glFor = window.asFor; window.asFor = () => ({ s: null }); const L0 = fsBeregn(); const X = L0.length ? L0[0].regel.band : null;
      window.asFor = b => b === X ? { s: 40, r: {} } : { s: null }; const L1 = fsBeregn(); window.asFor = glFor; maps.push(...gem); const nøgle = f => f.regel.band + '>' + f.regel.effect, m0 = new Map(L0.map(f => [nøgle(f), f.regel.thr]));
      return { n: L1.length, X, lav: L1.filter(f => f.regel.band === X).map(f => [nøgle(f), m0.get(nøgle(f)), f.regel.thr, /Analyse sikkerhed: 40 % \(usikker\), så tærsklen er hævet/.test(f.hvorfor)]), hoej: L1.filter(f => f.regel.band !== X).every(f => m0.get(nøgle(f)) === f.regel.thr && !/tærsklen er hævet/.test(f.hvorfor)), bands: [...new Set(L1.map(f => f.regel.band))] } });
    T.tjek(fo.lav.length > 0 && fo.lav.every(([k, a, b, h]) => Math.abs(b - Math.min(.9, a + .1)) < 1e-9 && h) && fo.hoej, `Foreslå regler (${fo.n} forslag ud fra sangen): når ${fo.X} har 40 % i Analyse sikkerhed, får dets ${fo.lav.length} forslag tærsklen hævet 0,1 og siger hvorfor; de andre er uændrede`, JSON.stringify(fo).slice(0, 400));
    const lo = await side.evaluate(async () => { lay3Anvend('ao-sang'); dkVis('w35'); sgFane('avanceret'); await new Promise(r => setTimeout(r, 900)); const c = document.getElementById('lot'); c.scrollIntoView({ block: 'center' }); await new Promise(r => setTimeout(r, 300)); const I = SHOWPROFIL.faseInfo, gl = I.stemmer; I.stemmer = gl.map(() => 0); SHOWPROFIL.faseKurve = null; LOT.offSig = ''; A2.lotLav = 0; lotTegn(); await new Promise(r => setTimeout(r, 300)); const lav = A2.lotLav; return { lav, k: a2Sik('ana:takt', 10).v } });
    await side.screenshot({ path: path.join(UD, 'kraev-sikkerhed-lyd-over-tid.png') });
    const lo2 = await side.evaluate(async () => { const I = SHOWPROFIL.faseInfo; I.stemmer = I.stemmer.map(() => 1); SHOWPROFIL.faseKurve = null; LOT.offSig = ''; A2.lotLav = 0; lotTegn(); await new Promise(r => setTimeout(r, 300)); return { lav: A2.lotLav, k: a2Sik('ana:takt', 10).v } });
    T.tjek(lo.lav > 100 && Math.abs(lo.k - .2) < 1e-6 && lo2.lav === 0 && Math.abs(lo2.k - .95) < 1e-6, `Lyd over tid: når ingen takter er enige (sikkerhed ${lo.k}), er Taktslag skraveret (${lo.lav} pixel); når alle er enige (${lo2.k}), er intet skraveret`, JSON.stringify({ lo, lo2 }));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
