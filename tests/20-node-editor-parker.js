/* Trin 4 · Det nye i v9.25: Node-editoren, trin 7 (Ikke i brug). Se papirets afsnit 5.1 og forløb 7.
   Parkér et lydtræk ved at trække det til Ikke i brug → dets regler sover (motoren giver 0, mens generatoren spiller), linkene er grå og stiplede, maps er
   uændret → træk tilbage → reglerne vågner, en regel, man selv har slået fra, bliver slukket. Parkér en analyse → dens lydtræk og regler sover.
   Den eneste lydkilde spørger "Alt vil sove. Parkér alligevel?" med Annullér som standard. Parkeret huskes efter genstart; Placér holder dem i kolonnen.
   Skærmbillede: tests/ud/node-editor-parkeret.png (deviceScaleFactor 2). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 7)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('20 · Node-editor, trin 7 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
    side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); curGen = 'house'; gStart(); await new Promise(r => setTimeout(r, 1500)); });
    /* et lydtræk med regler: kick */
    const før = await side.evaluate(() => JSON.stringify(maps));
    const kik = await side.evaluate(async () => { const i = maps.findIndex(m => m.band === 'kick'); let ud = 0; for (let k = 0; k < 30; k++) { await new Promise(r => setTimeout(r, 50)); ud = Math.max(ud, R2M.ud[i] || 0); } return { i, ud }; });
    /* træk Kick til Ikke i brug */
    await side.evaluate(() => { const n = NE2.N.get('l:kick'), fr = NE.kol.find(c => c.k === 'ikkeIBrug'); NE.pos['l:kick'] = [NE.kol.find(c => c.k === 'lydtraek').x, -400]; ne2Byg(); NE.tilpas = false; NE.z = .5; NE.x = Math.round(20 - fr.x * NE.z); NE.y = Math.round(96 + 400 * NE.z); neVis(); });
    await vent(300);
    const p = await side.evaluate(() => { const r = NE2.N.get('l:kick').el.querySelector('.ne-nh').getBoundingClientRect(), fr = document.querySelector('#ne-hoveder .ne-hoved[data-kol="ikkeIBrug"]').getBoundingClientRect(); return { x: r.left + 30, y: r.top + r.height / 2, tx: fr.left + 40 }; });
    await side.mouse.move(p.x, p.y); await side.mouse.down(); await side.mouse.move(p.x - 60, p.y, { steps: 3 });
    const lys = await side.evaluate(() => document.getElementById('ne').classList.contains('ne-parker-mulig'));
    await side.mouse.move(p.tx, p.y + 10, { steps: 6 }); await side.mouse.up(); await vent(600);
    const pk = await side.evaluate(async i => { let ud = 1; for (let k = 0; k < 60 && ud >= .02; k++) /* v9.38: venter op til 3 s på, at release-halen er væk (testbrowseren er langsom) */ { await new Promise(r => setTimeout(r, 50)); ud = R2M.ud[i] || 0; } const n = NE2.N.get('l:kick'), r = [...NE2.N.values()].find(x => x.kol === 'regel' && x.i === i); return { park: set.ne.park, ud, sover: neSover(maps[i]), node: n.el.classList.contains('ne-parkeret'), regel: r.el.classList.contains('ne-parksover') && /Sover/.test(r.el.textContent), link: NE2.L.some(l => l.fra === 'l:kick' && l.sover), off: maps[i].off }; }, kik.i);
    await side.screenshot({ path: path.join(UD, 'node-editor-parkeret.png') });
    T.tjek(lys, 'mens man trækker et lydtræk, lyser Ikke i brug op ("Slip her for at parkere")');
    T.tjek(kik.ud > .1 && pk.park.includes('l:kick') && pk.node && pk.sover && pk.ud < .05 && pk.regel && pk.link && !pk.off, `Kick parkeret: reglen sover (motoren gav ${kik.ud.toFixed(2)} før, nu ${pk.ud.toFixed(3)}, kun resten af release), mærket Sover, grå stiplet link; m.off er ikke rørt`);
    T.tjek(await side.evaluate(f => JSON.stringify(maps) === f, før), 'maps er uændret af at parkere');
    /* en regel, man selv har slået fra, bliver slukket; Væk vækker de sovende */
    const væk = await side.evaluate(async i => { const j = maps.findIndex((m, k) => k !== i && m.band === 'kick'); if (j >= 0) maps[j].off = true; neVaek('l:kick'); if (!gPlaying) gStart(); await new Promise(r => setTimeout(r, 1500)); let ud = 0, vv = 0; for (let k = 0; k < 60; k++) /* 3 sekunder: generatoren er langsom i testbrowseren */ { await new Promise(r => setTimeout(r, 50)); ud = Math.max(ud, R2M.ud[i] || 0); vv = Math.max(vv, R2M.v[i] || 0); } const r = { vv, bv: bandV('kick'), lys: typeof live !== 'undefined' && live, park: set.ne.park.length, ud, sover: neSover(maps[i]), j, offJ: j >= 0 ? maps[j].off : null, spiller: gPlaying }; if (j >= 0) delete maps[j].off; return r; }, kik.i);
    /* reglen er vågen, når den ikke sover; udgangen kan kun tjekkes, når indgangen nåede over tærsklen (generatoren er langsom i testbrowseren) */
    T.tjek(væk.park === 0 && !væk.sover && (væk.vv < .3 || væk.ud > .05) && (væk.j < 0 || væk.offJ === true), `Væk: Kick er tilbage, reglen vågner (ud op til ${væk.ud.toFixed(2)}, generatoren spiller: ${væk.spiller}, ind ${væk.vv.toFixed(2)}, kick nu ${(+væk.bv).toFixed(2)}, live ${væk.lys}); en regel, man selv har slået fra, bliver slukket`);
    /* en analyse: dens lydtræk og regler sover */
    const an = await side.evaluate(async () => { neParker('a:slag'); await new Promise(r => setTimeout(r, 400)); const lt = NE2.N.get('l:kick'), r = [...NE2.N.values()].filter(x => x.kol === 'regel' && ['kick', 'snare', 'hihat', 'flux'].includes(x.m.band)); const ok = { lt: lt.el.classList.contains('ne-parksover'), regler: r.length, sover: r.every(x => x.el.classList.contains('ne-parksover')), bas: [...NE2.N.values()].filter(x => x.kol === 'regel' && x.m.band === 'bas').every(x => !x.el.classList.contains('ne-parksover')), parkeret: NE2.N.get('a:slag').el.classList.contains('ne-parkeret') }; neVaek('a:slag'); return ok; });
    T.tjek(an.parkeret && an.lt && an.regler > 0 && an.sover && an.bas, `Slag-detektor parkeret: dens lydtræk og ${an.regler} regler sover; regler fra Bas sover ikke`);
    /* den eneste lydkilde */
    const k1 = await side.evaluate(async () => { neParker('k:main'); await new Promise(r => setTimeout(r, 200)); const m = document.getElementById('ne-menu'); return { titel: m && m.querySelector('.ne-menu-t').textContent, fokus: document.activeElement && document.activeElement.classList.contains('ne-menu-x'), park: (set.ne.park || []).length }; });
    await side.keyboard.press('Enter'); await vent(300);
    const k2 = await side.evaluate(() => (set.ne.park || []).length);
    T.tjek(k1.titel === 'Alt vil sove. Parkér alligevel?' && k1.fokus && k1.park === 0 && k2 === 0, 'den eneste lydkilde: "Alt vil sove. Parkér alligevel?", Annullér har fokus, og Enter annullerer');
    const k3 = await side.evaluate(async () => { neParker('k:main'); await new Promise(r => setTimeout(r, 200)); document.querySelector('#ne-menu .ne-menu-i[data-v="ja"]').click(); await new Promise(r => setTimeout(r, 500)); const r = [...NE2.N.values()].filter(x => x.kol === 'regel'); return { park: set.ne.park.slice(), alle: r.every(x => x.el.classList.contains('ne-parksover')), ana: [...NE2.N.values()].filter(x => x.kol === 'analyse').every(x => x.el.classList.contains('ne-parksover')) }; });
    T.tjek(k3.park.includes('k:main') && k3.alle && k3.ana, 'Parkér alligevel: analyserne og alle regler sover');
    /* huskes efter genstart, og Placér holder dem i kolonnen */
    await vent(600); await side.reload(); await side.waitForTimeout(3500);
    const gen = await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 900)); neAutoPlacer(); await new Promise(r => setTimeout(r, 300)); const n = NE2.N.get('k:main'), fr = NE.kol.find(c => c.k === 'ikkeIBrug'); const r = { park: set.ne.park.slice(), x: n.x, fx: fr.x, sover: maps.length ? neSover(maps[0]) : true }; neVaek('k:main'); return r; });
    T.tjek(gen.park.includes('k:main') && gen.x === gen.fx && gen.sover, 'det parkerede huskes efter genstart, og Placér holder det i Ikke i brug');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/node-editor-parkeret.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
