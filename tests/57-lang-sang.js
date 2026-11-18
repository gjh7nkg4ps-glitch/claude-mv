/* Trin 4 · Det nye i v9.62: lange sange (normalisering i stykker), Tidslinjens højeste tal pr. tidsrum, 2 egne opstillinger af noderne, og linjer med WebGL2.
   Brugerens fund 16. november: en sang på 74 minutter kunne ikke mappes; reglerne slog kun til de første par minutter.
   Testen laver målinger for 74 minutter, hvor de første 12 minutter er fem gange kraftigere end resten (analysen selv er prøvet for sig: den er ens hele vejen). */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Lang sang');
  console.log('57 · Lange sange, egne opstillinger og linjer med WebGL2 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 2560, height: 1440 } }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error' || /NaN/.test(x.text())) fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    /* 1 · 74 minutter: uden rettelsen når kun de første 2 minutter over tærsklen; med den når hele sangen det */
    const r = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(600);
      const lav = min => { sr = 44100; dur = min * 60; const n = Math.floor(dur * sr / H), R = {}; BANDS.forEach(([k]) => { const a = new Float32Array(n); let s = 7; for (let i = 0; i < n; i++) { s = (s * 16807) % 2147483647; const t = i * H / sr, lyd = t < 720 ? 1 : .2, slag = i % 10 === 0 ? 1 : .05; a[i] = lyd * slag * (.8 + .2 * (s / 2147483647)) } R[k] = a }); return R };
      const over = (a, t0, t1) => { const i0 = Math.floor(t0 * sr / H), i1 = Math.floor(t1 * sr / H); let c = 0; for (let i = i0; i < i1; i++) if (a[i] > .3) c++; return Math.round(c / (i1 - i0) * 1000) / 10 };
      buf = new AudioBuffer({ length: 2000, sampleRate: 8000, numberOfChannels: 1 }); ARAW = null; mode = 'auto'; RAW = lav(74); applyNorm(); buildPeaks();
      set.normLokal = false; applyNorm(); const foer = { start: over(F.kick, 0, 600), midt: over(F.kick, 1800, 1920), slut: over(F.kick, 4200, 4320), aktiv: !!NORM_LOKAL.aktiv, cen: F.centroid[40000] };
      delete set.normLokal; document.getElementById('status').textContent = 'Analyse hentet fra cache'; applyNorm(); const efter = { start: over(F.kick, 0, 600), midt: over(F.kick, 1800, 1920), slut: over(F.kick, 4200, 4320), bas: over(F.bas, 3000, 3120), aktiv: !!NORM_LOKAL.aktiv, cen: F.centroid[40000], max: Math.max(...F.kick.subarray(60000, 61000)), status: document.getElementById('status').textContent };
      /* tidslinjen: det højeste tal pr. tidsrum */
      const N = 500, S = F.kick, L = S.length; let kol = 0; for (let c = 0; c < N; c++) { let m = 0; for (let i = Math.floor(c / N * L); i < Math.floor((c + 1) / N * L); i++) if (S[i] > m) m = S[i]; if (m > .3) kol++ }
      /* en kort sang regnes som før */
      RAW = lav(4); set.normLokal = false; applyNorm(); buildPeaks(); const k1 = Array.from(F.kick.subarray(0, 4000)).join(); delete set.normLokal; applyNorm(); const k2 = Array.from(F.kick.subarray(0, 4000)).join();
      return { foer, efter, kol, kortEns: k1 === k2, kortAktiv: !!NORM_LOKAL.aktiv } });
    T.tjek(r.foer.start > 3 && r.foer.midt === 0 && r.foer.slut === 0 && !r.foer.aktiv, `fejlen genskabt: målt over hele sangen når slagene kun over tærsklen 0,30 i de første 12 minutter (${r.foer.start} % af tiden) og aldrig midt i eller sidst i de 74 minutter (${r.foer.midt} % og ${r.foer.slut} %)`, JSON.stringify(r.foer));
    T.tjek(r.efter.aktiv && r.efter.start > 3 && r.efter.midt > 3 && r.efter.slut > 3 && r.efter.bas > 3 && r.efter.max <= 1 && r.efter.cen === r.foer.cen && /lang sang \(74 min\): normaliseret i stykker på 2 minutter/.test(r.efter.status), `rettet: målt i stykker på 2 minutter når slagene over tærsklen hele vejen (${r.efter.start} %, ${r.efter.midt} % og ${r.efter.slut} % af tiden); klang-målingerne (centroid) er ikke ændret; statuslinjen: "${r.efter.status}"`, JSON.stringify(r.efter));
    T.tjek(r.kol > 480 && r.kortEns && !r.kortAktiv, `Tidslinjen ville vise slag i ${r.kol} af 500 tidsrum (det højeste tal i hvert tidsrum); en sang på 4 minutter regnes præcis som før`, JSON.stringify({ kol: r.kol, kortEns: r.kortEns, kortAktiv: r.kortAktiv }));
    /* 2 · Lyd over tid (v9.77; før Node-editorens visning Tidslinje) viser slag i hele den lange sang, og Ctrl+K-kommandoen slår til og fra */
    const tl = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); RAW = (() => { sr = 44100; dur = 74 * 60; const n = Math.floor(dur * sr / H), R = {}; BANDS.forEach(([k]) => { const a = new Float32Array(n); for (let i = 0; i < n; i++) a[i] = (i * H / sr < 720 ? 1 : .2) * (i % 10 === 0 ? 1 : .05); R[k] = a }); return R })(); applyNorm(); buildPeaks(); lay3Anvend('noder'); await vent(2500); mxSaet(false, true); LOT.cache = {}; const N = 500;
      const b = lotSerie('kick', N, 0, dur); let kol = 0; if (b) for (let c = 0; c < b.length; c++) if (b[c] > .3) kol++; normLokalSkift(); const fra = set.normLokal === false; await vent(300); LOT.cache = {}; const b2 = lotSerie('kick', N, 0, dur); let kol2 = 0; if (b2) for (let c = 0; c < b2.length; c++) if (b2[c] > .3) kol2++; normLokalSkift(); await vent(300); LOT.cache = {}; return { n: b ? b.length : 0, kol, fra, kol2, til: set.normLokal !== false, tidVaek: !NE41_VIS.some(x => x[0] === 'tid') } });
    T.tjek(tl.n >= 40 && tl.kol > tl.n * .9 && tl.fra && tl.kol2 > 0 && tl.kol2 < tl.n * .25 && tl.til && tl.tidVaek, `Lyd over tid viser slag i ${tl.kol} af ${tl.n} tidsrum for den lange sang; slås "normalisér i stykker" fra, er det kun ${tl.kol2} (de første 12 minutter), og den kan slås til igen; Node-editorens visning Tidslinje er væk`, JSON.stringify(tl));
    /* 3 · to egne opstillinger: flyt en node, gem som Min opstilling 1, vælg Kompakt, hent Min opstilling 1 */
    const valg0 = await side.evaluate(() => [...document.getElementById('ne61-opst').options].map(o => o.textContent + (o.disabled ? ' [grå]' : '')));
    const n0 = await side.evaluate(() => { neTilpas(); /* v9.71: alle noder inden for feltet, så noden kan trækkes med musen; en node under beskeden (toast) springes over */ const T = [...document.querySelectorAll('.ne-toast')].map(t => t.getBoundingClientRect()).filter(r => r.width > 0); const fri = r => !T.some(t => r.left < t.right && r.right > t.left && r.top < t.bottom && r.bottom > t.top); const inde = r => r.top > 60 && r.bottom < innerHeight - 120 && r.left > 20 && r.right < innerWidth - 120; const n = [...NE2.N.values()].find(x => { if (!x.el || x.kol !== 'regel') return false; const r = x.el.getBoundingClientRect(); return fri(r) && inde(r) }), q = n.el.getBoundingClientRect(); return { key: n.key, x: n.x, y: n.y, px: q.left + 20, py: q.top + 8 } });
    await side.mouse.move(n0.px, n0.py); await side.mouse.down(); for (let i = 1; i <= 6; i++) { await side.mouse.move(n0.px + i * 10, n0.py + i * 8); await side.waitForTimeout(25); } await side.mouse.up(); await side.waitForTimeout(600);
    await side.selectOption('#ne61-opst', 'gem1'); await side.waitForTimeout(700);
    const g1 = await side.evaluate(k => { const n = NE2.N.get(k), E = set.ne.egne && set.ne.egne[1]; return { x: n.x, y: n.y, gemt: E ? Object.keys(E.pos).length : 0, pos: E && E.pos[k], z: E && E.z, valg: document.getElementById('ne61-opst').value, tekst: [...document.getElementById('ne61-opst').options].map(o => o.textContent + (o.disabled ? ' [grå]' : '')) } }, n0.key);
    await side.selectOption('#ne61-opst', 'kompakt'); await side.waitForTimeout(1100); const k1 = await side.evaluate(k => { const n = NE2.N.get(k); return { x: n.x, y: n.y, z: NE.z } }, n0.key);
    await side.selectOption('#ne61-opst', 'egen1'); await side.waitForTimeout(1000); const e1 = await side.evaluate(k => { const n = NE2.N.get(k); return { x: n.x, y: n.y, z: NE.z, valg: document.getElementById('ne61-opst').value, opst: set.ne.opst } }, n0.key);
    await side.reload(); await side.waitForTimeout(4500); const e2 = await side.evaluate(k => { const n = NE2.N && NE2.N.get(k), E = set.ne && set.ne.egne && set.ne.egne[1]; return { gemt: E ? Object.keys(E.pos).length : 0, pos: E && E.pos[k], valg: (document.getElementById('ne61-opst') || {}).value } }, n0.key);
    T.tjek(valg0.includes('Min opstilling 1 (tom) [grå]') && valg0.includes('Gem som Min opstilling 2') && (g1.x !== n0.x || g1.y !== n0.y) && g1.gemt > 20 && g1.pos && g1.pos[0] === g1.x && g1.valg === 'egen1' && g1.tekst.includes('Min opstilling 1') && (k1.x !== g1.x || k1.y !== g1.y) && e1.x === g1.x && e1.y === g1.y && Math.abs(e1.z - g1.z) < 1e-6 && e1.valg === 'egen1' && e2.gemt === g1.gemt && e2.pos && e2.pos[0] === g1.x, `egne opstillinger: Min opstilling 1 er grå, til den er gemt; en node flyttes med musen, Gem som Min opstilling 1 gemmer ${g1.gemt} noders plads og zoom; efter Kompakt giver Min opstilling 1 samme plads og zoom tilbage; den er der stadig efter genstart`, JSON.stringify({ valg0, n0, g1: { x: g1.x, y: g1.y, gemt: g1.gemt, valg: g1.valg }, k1, e1, e2 }));
    /* 4 · linjerne tegnes med WebGL2 */
    await side.evaluate(() => lay3Anvend('noder')); await side.waitForTimeout(3500);
    const ln = await side.evaluate(() => ({ ok: NE14.ok, backend: NE14.backend, tekst: ne14Tekst(), links: NE14.stat.links }));
    T.tjek(ln.ok && ln.backend === 'WebGL2' && ln.tekst === 'TSL · WebGL2' && ln.links > 5, `linjerne i Node-editoren tegnes med ${ln.tekst} (${ln.links} linjer)`, JSON.stringify(ln));
    T.tjek(!fejl.length, 'ingen fejl og ingen NaN-linjer i browserens konsol', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
