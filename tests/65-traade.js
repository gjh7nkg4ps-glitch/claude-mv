/* Trin 4 · Det nye i v9.70 (trin S1): analysen i baggrunds-tråde, brug sangen imens, flueben pr. del.
   - Trådenes analyse giver præcis de samme tal som den gamle (stereo-testfilen: alle 14 lydtræk og alle 70 rækker i trin 2).
   - Under en rigtig indlæsning kan sangen spilles (Afspil er aktiv), mens trin 2 stadig regnes.
   - Flueben i Automatik: uden Toner og tonehøjde er tonehøjden 0 efter Analysér igen (de 31 bånd regnes stadig), og det står i statuslinjen; med igen er den tilbage.
   - Annullér i trin 2 beholder lydtrækkene; annulleret Analysér igen beholder den gamle analyse (også trin 2). */
const path = require('path'), fs = require('fs'), os = require('os');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Baggrunds-tråde');
  console.log('65 · Analysen i baggrunds-tråde, brug sangen imens, og flueben pr. del · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')); const stereo = lavTestlyd.stereo(path.join(d, 'stereo-traade.wav')); const mono = lavTestlyd(path.join(d, 'mono-traade-' + Date.now() + '.wav'));
    /* 1 · samme tal som den gamle analyse */
    const r = await side.evaluate(async (p) => {
      const bin = atob(p); const u8 = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i); actx = actx || new AudioContext(); const bf = await actx.decodeAudioData(u8.buffer);
      const t0 = performance.now(); const F0 = await analyze(bf); const t1 = performance.now(); const A0 = await analyzeAna(bf); const t2 = performance.now();
      const dele = atDele(); const F1 = await atKoer(bf, 1, dele); const t3 = performance.now(); const A1 = await atKoer(bf, 2, dele); const t4 = performance.now();
      const diff = (X, Y) => { let maks = 0, nøgler = 0, mangler = 0; for (const k in X) { if (!(X[k] instanceof Float32Array)) continue; nøgler++; const a = X[k], c = Y[k]; if (!c || c.length !== a.length) { mangler++; continue } for (let i = 0; i < a.length; i++) { const dd = Math.abs(a[i] - c[i]); if (dd > maks) maks = dd } } return { maks, nøgler, mangler } };
      return { kanaler: bf.numberOfChannels, n: F0.kick.length, dF: diff(F0, F1), dA: diff(A0, A1), tid: { gammel1: Math.round(t1 - t0), gammel2: Math.round(t2 - t1), ny1: Math.round(t3 - t2), ny2: Math.round(t4 - t3) }, traade: AT.brugt, fejl: AT.fejl, kerner: navigator.hardwareConcurrency };
    }, fs.readFileSync(stereo).toString('base64'));
    T.tjek(r.kanaler === 2 && r.traade >= 1 && !r.fejl && r.dF.nøgler === 14 && r.dA.nøgler === 70 && !r.dF.mangler && !r.dA.mangler && r.dF.maks === 0 && r.dA.maks === 0, `trådenes analyse (${r.traade} tråde på ${r.kerner} kerner) giver præcis de samme tal som den gamle: 14 lydtræk og 70 rækker i trin 2, største forskel ${r.dF.maks} og ${r.dA.maks} (stereo, ${r.n} rammer); tid gammel ${r.tid.gammel1} + ${r.tid.gammel2} ms, ny ${r.tid.ny1} + ${r.tid.ny2} ms`, JSON.stringify(r));
    /* 2 · brug sangen, mens trin 2 regnes */
    await side.setInputFiles('#file', mono); let set2 = null; const t0 = Date.now();
    while (Date.now() - t0 < 200000) { const q = await side.evaluate(() => { const d = document.getElementById('ana-prog'); return { felt: !!d && !d.hidden, trin: d && !d.hidden ? d.querySelector('.ana-trin').textContent : '', play: document.getElementById('play').disabled, F: typeof F !== 'undefined' && !!F, status: document.getElementById('status').textContent } }); if (q.felt && /Trin 2/.test(q.trin) && !q.play && q.F) { set2 = q; break } if (/Analyse færdig/.test(q.status)) break; await side.waitForTimeout(30) }
    await side.waitForFunction(() => /Analyse færdig og gemt i cache/.test(document.getElementById('status').textContent), null, { timeout: 240000 });
    const s2 = await side.evaluate(() => ({ status: document.getElementById('status').textContent, A: !!A, pitch: A && A['ana:pitch'] ? Array.from(A['ana:pitch']).some(v => v > 0) : false, tid: AT.tid, fejl: AT.fejl }));
    T.tjek(!!set2 && !set2.play && set2.F && /Lydtræk er klar/.test(set2.status) && s2.A && s2.pitch && !s2.fejl && s2.tid && s2.tid.traade >= 1, `mens trin 2 regnes, er Afspil aktiv og lydtrækkene klar ("${set2 ? set2.status : '—'}"); bagefter er toner og klang der også (trin 1 ${s2.tid && s2.tid.trin1} ms, trin 2 ${s2.tid && s2.tid.trin2} ms, ${s2.tid && s2.tid.traade} tråde)`, JSON.stringify({ set2, s2 }));
    /* 3 · flueben: uden Toner og tonehøjde */
    await side.evaluate(async () => { lay3Anvend('ao-sang'); await new Promise(r => setTimeout(r, 1500)); sgFane('avanceret'); sgIndstTegn(true); await new Promise(r => setTimeout(r, 400)) }); /* v9.76: fluebenene står i Sang → Avanceret */
    const fb = await side.evaluate(() => { const L = [...document.querySelectorAll('#sg [data-sgk="indst"] [data-audel]')]; const b = L.find(x => x.dataset.audel === 'toner').getBoundingClientRect(); return { n: L.length, navne: L.map(x => x.dataset.audel).join(','), alle: L.every(x => x.checked), x: b.x + b.width / 2, y: b.y + b.height / 2, synlig: b.width > 0 } });
    T.tjek(fb.n === 4 && fb.navne === 'toner,baand,klang,stereo' && fb.alle && fb.synlig, 'Indstillinger for analysen (Sang → Avanceret) har fire flueben for dele af analysen (Toner og tonehøjde, De 31 bånd, Klang, Stereo), alle slået til', JSON.stringify(fb));
    await side.mouse.click(fb.x, fb.y); await side.waitForTimeout(300);
    const u = await side.evaluate(async () => { const gemt = JSON.parse(localStorage.getItem('rytme-set') || '{}').anaDele; const ok = await anaIgen(); const f0 = ARAW.f0, ls = ARAW['ana:ls5'], c = ARAW['ana:c0']; return { gemt, ok, f0max: Math.max(...Array.from(f0)), lsmax: Math.max(...Array.from(ls)), chroma: Math.max(...Array.from(c)), status: document.getElementById('status').textContent, dele: AT.dele, trin: document.querySelector('#sg [data-sgk="indst"] [data-audel="toner"]').checked } });
    T.tjek(u.gemt && u.gemt.toner === false && u.ok && u.f0max === 0 && u.lsmax > 0 && u.chroma > 0 && /analyseret uden: Toner og tonehøjde/.test(u.status) && u.dele && u.dele.toner === false && !u.trin, `uden Toner og tonehøjde (rigtigt klik) er tonehøjden 0 efter Analysér igen, mens de 31 bånd (${u.lsmax.toFixed(2)}) og toneklasserne regnes, og statuslinjen siger det: "${u.status}"`, JSON.stringify(u));
    await side.evaluate(() => { const c = document.querySelector('#sg [data-sgk="indst"] [data-audel="toner"]'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })) }); await side.waitForTimeout(200);
    const v = await side.evaluate(async () => { const ok = await anaIgen(); return { ok, f0max: Math.max(...Array.from(ARAW.f0)), status: document.getElementById('status').textContent, dele: AT.dele } });
    T.tjek(v.ok && v.f0max > 0 && !/analyseret uden/.test(v.status) && v.dele.toner !== false, `med Toner og tonehøjde igen er tonehøjden tilbage (højst ${v.f0max.toFixed(0)} Hz), og statuslinjen siger ikke "uden"`, JSON.stringify(v));
    /* 4 · Annullér i trin 2 beholder lydtrækkene */
    const mono2 = lavTestlyd(path.join(d, 'mono-annuller-' + Date.now() + '.wav'), 40); await side.setInputFiles('#file', mono2); const t4 = Date.now(); let saa = false;
    while (Date.now() - t4 < 200000) { const q = await side.evaluate(() => { const d = document.getElementById('ana-prog'); return d && !d.hidden && /Trin 2/.test(d.querySelector('.ana-trin').textContent) && !document.getElementById('play').disabled }); if (q) { saa = true; break } await side.waitForTimeout(20) }
    const p4 = await side.evaluate(() => { const q = document.getElementById('ana-stop').getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }); await side.mouse.click(p4.x, p4.y); await side.waitForTimeout(1500);
    const a4 = await side.evaluate(() => ({ status: document.getElementById('status').textContent, F: !!F, A: !!A, play: document.getElementById('play').disabled, pool: !!AT.pool, felt: !document.getElementById('ana-prog').hidden }));
    T.tjek(saa && /Trin 2 blev annulleret/.test(a4.status) && a4.F && !a4.A && !a4.play && !a4.felt, `Annullér i trin 2 beholder lydtrækkene (Afspil aktiv), og toner mangler: "${a4.status}"`, JSON.stringify({ saa, a4 }));
    /* 5 · annulleret Analysér igen beholder den gamle analyse (også trin 2) */
    await side.setInputFiles('#file', []); await side.setInputFiles('#file', mono); await side.waitForFunction(() => /Analyse færdig og gemt i cache|Analyse hentet fra cache/.test(document.getElementById('status').textContent) && !!A, null, { timeout: 240000 });
    const sum0 = await side.evaluate(() => Array.from(ARAW.f0).reduce((a, x) => a + x, 0));
    await side.evaluate(() => { window.__igen = anaIgen() }); const t5 = Date.now(); let s5 = false; while (Date.now() - t5 < 60000) { const q = await side.evaluate(() => { const d = document.getElementById('ana-prog'); return d && !d.hidden && /Trin 2/.test(d.querySelector('.ana-trin').textContent) }); if (q) { s5 = true; break } await side.waitForTimeout(15) }
    const p5 = await side.evaluate(() => { const q = document.getElementById('ana-stop').getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }); await side.mouse.click(p5.x, p5.y);
    const c5 = await side.evaluate(async () => { const ok = await window.__igen; return { ok, status: document.getElementById('status').textContent, sum: Array.from(ARAW.f0).reduce((a, x) => a + x, 0), A: !!A, play: document.getElementById('play').disabled } });
    T.tjek(s5 && c5.ok === false && /Analysér igen blev annulleret\. Den gamle analyse bruges stadig/.test(c5.status) && c5.A && Math.abs(c5.sum - sum0) < 1e-3 && !c5.play, 'annulleres Analysér igen i trin 2, bruges den gamle analyse stadig, også toner og klang', JSON.stringify({ s5, c5, sum0 }));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
