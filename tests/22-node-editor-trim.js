/* Trin 4 · Det nye i v9.27: Node-editoren, trin 9 (trim og figur-styrke). Se papirets afsnit 5.5 og 5.7.
   Motoren: uden trim og med styrke 1 præcis som den gamle; trim +6 dB fordobler tallet, reglen får (R2M.v); figur-styrke 0,5 halverer målets udgang;
   Styrke brugt har figur-styrken som led. Noden: mærket Trim (træk op = mere), figur-styrken (træk). Pladserne A–T husker trim og figur-styrke;
   figur-styrken kan fortrydes. Skærmbillede: tests/ud/node-editor-trim.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 9)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('22 · Node-editor, trin 9 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); });
    /* motoren via de rigtige funktioner (bandNu, vaegt) med et fast tal ind */
    const mot = await side.evaluate(() => { const i = maps.findIndex(m => !String(m.effect).startsWith('klods')), m = maps[i], b = m.band;
      const kør = () => { const o = { v: (mm) => neTrimV(mm.band, .3), vaegt: (mm) => neFigF(mm.effect), off: () => false, master: 1, dt: 1, env: [], pe: [], E: {}, kant: () => {} }; for (let k = 0; k < 5; k++) { o.E = {}; Rytme.koer([Object.assign({}, m, { gap: 0, thr: 0, att: 1, rel: 1, curve: 1, gain: 1 })], o); } return { v: R2M.v[0], ud: o.E[m.effect] }; };
      const a = kør(); neSaetTrim(b, 6, false); const t6 = kør(); neSaetTrim(b, 0, false); const fk = neFigurAf(m.effect).key; neSaetFigStyrke(fk, .5, false); const f5 = kør(); const S = stakFor(m, i); neSaetFigStyrke(fk, 1, false);
      return { b, a, t6, f5, lag: S.lag.map(l => l[0] + ' ' + l[1]).join(' × '), styrke: S.styrke, gain: m.gain, master: gmaster }; });
    T.tjek(Math.abs(mot.a.v - .3) < 1e-6 && Math.abs(mot.t6.v - .3 * Math.pow(10, 6 / 20)) < 1e-3, `trim +6 dB: tallet, reglen får, går fra ${mot.a.v.toFixed(3)} til ${mot.t6.v.toFixed(3)} (×2)`);
    T.tjek(Math.abs(mot.f5.ud - mot.a.ud * .5) < 1e-3, `figur-styrke 0,5: målets udgang går fra ${mot.a.ud.toFixed(3)} til ${mot.f5.ud.toFixed(3)}`);
    T.tjek(/Figur-styrke|Effekt-gruppens styrke/.test(mot.lag) && Math.abs(mot.styrke - mot.gain * .5 * mot.master) < 1e-6, `Styrke brugt har figur-styrken som led: ${mot.lag}`);
    /* noden: Trim-mærket og figur-styrken */
    const lt = await side.evaluate(() => { const n = [...NE2.N.values()].find(x => x.kol === 'lydtraek'); NE.pos[n.key] = [NE.kol.find(c => c.k === 'lydtraek').x, -400]; const f = [...NE2.N.values()].find(x => x.kol === 'figur'); NE.pos[f.key] = [NE.kol.find(c => c.k === 'figur').x, -400]; ne2Byg(); NE.tilpas = false; NE.z = .6; NE.x = Math.round(20 - NE.kol.find(c => c.k === 'lydtraek').x * NE.z); NE.y = Math.round(96 + 400 * NE.z); neVaelg(null); neVis(); return { key: n.key, b: n.band, f: f.key }; });
    await vent(300);
    const pTrim = await side.evaluate(k => { const r = NE2.N.get(k).el.querySelector('.ne-trim').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, lt.key);
    await side.mouse.move(pTrim.x, pTrim.y); await side.mouse.down(); await side.mouse.move(pTrim.x, pTrim.y - 24, { steps: 4 }); await side.mouse.up(); await vent(400);
    const tr = await side.evaluate(b => ({ db: neTrimDb(b), mærke: NE2.N.get('l:' + b).el.querySelector('.ne-trim').textContent }), lt.b);
    T.tjek(tr.db === 3 && /\+3 dB/.test(tr.mærke), `træk op i mærket Trim: ${tr.mærke}`);
    const pF = await side.evaluate(k => { const r = NE2.N.get(k).el.querySelector('.ne-fstyrke').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, lt.f);
    await vent(1200);
    await side.mouse.move(pF.x, pF.y); await side.mouse.down(); await side.mouse.move(pF.x, pF.y + 60, { steps: 4 }); await side.mouse.up(); await vent(400);
    const fs1 = await side.evaluate(k => neFigStyrke(k), lt.f);
    await side.screenshot({ path: path.join(UD, 'node-editor-trim.png') });
    T.tjek(fs1 === .5, `træk ned i figurens styrke: ×${fs1}`);
    /* pladsen A husker; Fortryd for figur-styrken (figurer) */
    const pl = await side.evaluate(([b, f]) => { slotSave('A', 'trim-test'); neSaetTrim(b, 0, false); neSaetFigStyrke(f, 1, true); slotLoad('A'); return { db: neTrimDb(b), fs: neFigStyrke(f) }; }, [lt.b, lt.f]);
    T.tjek(pl.db === 3 && (pl.fs === .5 || !lt.f.startsWith('f:')), `plads A husker trim (${pl.db} dB) og styrke (×${pl.fs})`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/node-editor-trim.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
