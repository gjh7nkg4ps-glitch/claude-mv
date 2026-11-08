/* Trin 4 · Det nye i v9.31: Node-editoren, trin 13 (zoom ud, Kun valgt kæde, Dæmp og tastatur). Se papirets forløb 3 og 4 og afsnit 10.
   Under 20 % var noderne lys uden tekst (v9.31); fra v9.38 står de som kasser med tekst ved al zoom (brugerens ønske). Kun valgt kæde dæmper alt uden for kæden; Esc slår det fra.
   Dæmp gør det, der ikke slår til, svagt. Tastaturet: uden valg flytter → lærredet; Home vælger den første node; → skifter kolonne; ] går til næste regel;
   Enter på Kick og Enter på et mål laver en regel uden mus; Delete sletter den. Skærmbilleder: tests/ud/node-editor-lys.png (15 %, nu uden lys) og node-editor-kaede.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 13)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('26 · Node-editor, trin 13 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); curGen = 'house'; gStart(); await new Promise(r => setTimeout(r, 1500)); });
    /* 1 · zoom ud */
    const lod = await side.evaluate(async () => { NE.tilpas = false; NE.z = .15; NE.x = 20; NE.y = 100; neVis(); let lys = 0; for (let k = 0; k < 30; k++) { await new Promise(r => setTimeout(r, 100)); lys = Math.max(lys, document.querySelectorAll('#ne-verden .ne-node.ne-lys').length) } const n = document.querySelector('#ne-verden .ne-node'); return { lod: document.getElementById('ne').classList.contains('ne-lod'), skjult: getComputedStyle(n.querySelector('.ne-nh')).visibility, lys, alle: document.querySelectorAll('#ne-verden .ne-node').length }; });
    await side.screenshot({ path: path.join(UD, 'node-editor-lys.png') });
    const z50 = await side.evaluate(async () => { NE.z = .5; neVis(); await new Promise(r => setTimeout(r, 200)); const n = document.querySelector('#ne-verden .ne-node'); return { lod: document.getElementById('ne').classList.contains('ne-lod'), vis: getComputedStyle(n.querySelector('.ne-nh')).visibility }; });
    T.tjek(!lod.lod && lod.skjult === 'visible' && lod.lys === 0 && !z50.lod && z50.vis === 'visible', `15 %: ${lod.alle} noder står som kasser med tekst, ingen bliver til lys (v9.38); 50 %: alt vises`);
    /* 2 · Kun valgt kæde og Esc */
    const iso = await side.evaluate(async () => { const r = [...NE2.N.values()].find(x => x.kol === 'regel' && x.i >= 0); neVaelg(r.key); NE.z = .45; neVis(); await new Promise(r => setTimeout(r, 100)); document.querySelector('[data-ne13="iso"]').click(); await new Promise(r => setTimeout(r, 300)); const ude = document.querySelectorAll('#ne-verden .ne-node.ne-uden-for').length, inde = [...NE2.kaede].filter(k => NE2.N.get(k) && NE2.N.get(k).el.classList.contains('ne-uden-for')).length; return { ude, inde, kaede: NE2.kaede.size, alfa: ne13Alfa({}, 1), knap: document.querySelector('[data-ne13="iso"]').classList.contains('ne-paa') }; });
    await side.screenshot({ path: path.join(UD, 'node-editor-kaede.png') });
    await side.focus('#ne-flade'); await side.keyboard.press('Escape'); await vent(200);
    const esc = await side.evaluate(() => ({ iso: NE13.iso, ude: document.querySelectorAll('#ne-verden .ne-node.ne-uden-for').length, valgt: !!NE2.valgt }));
    T.tjek(iso.knap && iso.ude > 5 && iso.inde === 0 && iso.alfa < .1 && !esc.iso && esc.ude === 0 && esc.valgt, `Kun valgt kæde: ${iso.ude} noder uden for kæden (${iso.kaede} i kæden) dæmpes, linjerne udenfor næsten usynlige; Esc slår det fra (valget bliver)`);
    /* 3 · Dæmp */
    const d = await side.evaluate(async () => { neVaelg(null); document.querySelector('[data-ne13="daemp"]').click(); let st = 0, ik = 0; for (let k = 0; k < 20; k++) { await new Promise(r => setTimeout(r, 100)); const s = document.querySelectorAll('#ne-verden .ne-node.ne-stille').length; st = Math.max(st, s); ik = Math.max(ik, document.querySelectorAll('#ne-verden .ne-node').length - s) } const gemt = set.ne.daemp; document.querySelector('[data-ne13="daemp"]').click(); await new Promise(r => setTimeout(r, 300)); return { st, ik, gemt, efter: document.querySelectorAll('#ne-verden .ne-node.ne-stille').length, af: !set.ne.daemp }; });
    T.tjek(d.gemt && d.st > 0 && d.ik > 0 && d.efter === 0 && d.af, `Dæmp: op til ${d.st} noder, der ikke slår til, er svage (${d.ik} lyser); slået fra igen er alt normalt`);
    /* 4 · tastaturet */
    await side.evaluate(() => { neVaelg(null); NE.z = .45; NE.x = 20; NE.y = 100; neVis(); }); await side.focus('#ne-flade');
    const x0 = await side.evaluate(() => NE.x); await side.keyboard.press('ArrowRight'); const x1 = await side.evaluate(() => NE.x);
    await side.keyboard.press('Home'); const h = await side.evaluate(() => { const n = NE2.N.get(NE2.valgt); return { k: NE2.valgt, kol: ne13KolAf(n), forste: ne13Kol(ne13KolAf(n))[0].key, fokus: document.activeElement === n.el }; });
    await side.keyboard.press('ArrowRight'); const h2 = await side.evaluate(() => ne13KolAf(NE2.N.get(NE2.valgt)));
    T.tjek(Math.abs(x1 - x0 + 60) < 1 && h.k === h.forste && h.fokus && h2 > h.kol, `uden valg flytter → lærredet; Home vælger den første node (${h.k}) og giver den fokus; → går til næste kolonne`);
    await side.keyboard.press(']'); const r1 = await side.evaluate(() => NE2.N.get(NE2.valgt).kol); await side.keyboard.press(']'); const r2 = await side.evaluate(() => NE2.valgt);
    T.tjek(r1 === 'regel' && /^r:/.test(r2), '] går til næste regel');
    const før = await side.evaluate(() => maps.length);
    const mål = await side.evaluate(() => { const kick = NE2.N.get('l:kick') || [...NE2.N.values()].find(x => x.kol === 'lydtraek'); const m = [...NE2.N.values()].find(x => x.kol === 'maal' && !x.regler.some(rk => (NE2.N.get(rk) || {}).m && NE2.N.get(rk).m.band === kick.band)); ne13Gaa(kick); return { band: kick.band, mk: m.key, eff: m.effect }; });
    await side.keyboard.press('Enter'); const fra = await side.evaluate(() => NE13.fra);
    await side.evaluate(k => ne13Gaa(NE2.N.get(k)), mål.mk); await side.keyboard.press('Enter'); await vent(400);
    const ny = await side.evaluate(() => { const m = maps[maps.length - 1]; return { n: maps.length, band: m.band, eff: m.effect, valgt: NE2.valgt }; });
    T.tjek(fra === mål.band && ny.n === før + 1 && ny.band === mål.band && ny.eff === mål.eff, `uden mus: Enter på ${mål.band} gør det til kilde, Enter på målet laver reglen ${ny.band} → ${ny.eff}`);
    await side.evaluate(() => { const r = [...NE2.N.values()].find(x => x.kol === 'regel' && x.i === maps.length - 1); ne13Gaa(r); }); await side.keyboard.press('Delete'); await vent(400);
    T.tjek(await side.evaluate(n => maps.length === n, før), 'Delete sletter den nye regel');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-lys.png og node-editor-kaede.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
