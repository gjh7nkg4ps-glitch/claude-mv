/* Trin 4 · Det nye i v9.39: knapperne fra Lydkilde, Opsætninger og Værksted i Node-editoren, og WebGPU-fejlen ved en skjult fane.
   - Intet valgt: Gem som 1/2, Hent 1/2, Sammenlign 1 ↔ 2, Tilslut MIDI og Tilføj morgenstjerne; Gem som 1 gemmer (rytme-A), Sammenlign skifter.
   - Lydkilde-noden: Vælg lydfil, 4 spor, Generator (tempo-skyderen styrer generatoren, Afspil/Stop, Nyt mønster), Lydmotor Ny · Klassisk, Lyd ind, Auto-mapping Til/Fra.
   - Tilføj morgenstjerne tilføjer 6 regler; Ctrl+K har knapperne.
   - Noderne har plads: lærredet er mindst 140 px, også med Lydkildens mange knapper (kontrolpanelet højst 46 %).
   - Skjult fane: linjernes flade er 0 × 0, og der tegnes ikke (før gav det GPUValidationError med WebGPU; testbrowseren har kun WebGL2, så her tælles tegningerne).
   Skærmbillede: tests/ud/knapper-lydkilde.png og knapper-opsaetning.png. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const UD = path.join(__dirname, 'ud');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Knapper i Node-editoren');
  console.log('34 · Knapper i Node-editoren · ' + path.basename(fil));
  fs.mkdirSync(UD, { recursive: true });
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1200)); neVaelg(null); ne2Kp(true); await new Promise(r => setTimeout(r, 300)); });
    /* 1 · intet valgt: Opsætning */
    const ops = await side.evaluate(async () => { const kp = $('ne-kp'), k = [...kp.querySelectorAll('.ne39-ops [data-ne39]')].map(b => b.textContent);
      try { localStorage.removeItem('rytme-A') } catch (e) {} kp.querySelector('[data-ne39="gem1"]').click(); await new Promise(r => setTimeout(r, 400)); const gemt = !!localStorage.getItem('rytme-A');
      const m0 = maps.length; kp.querySelector('[data-ne39="gem2"]').click(); await new Promise(r => setTimeout(r, 300)); kp.querySelector('[data-ne39="swap"]').click(); await new Promise(r => setTimeout(r, 400));
      return { k, gemt, ab: $('abmsg').textContent.trim(), toast: (document.querySelector('.ne-toast') || {}).textContent || '', m0 }; });
    await side.screenshot({ path: path.join(UD, 'knapper-opsaetning.png'), clip: await side.evaluate(() => { const r = $('ne-kp').getBoundingClientRect(); return { x: r.left, y: r.top, width: Math.min(1100, r.width), height: r.height }; }) });
    T.tjek(['Gem som 1', 'Gem som 2', 'Hent 1', 'Hent 2', 'Sammenlign 1 ↔ 2', 'Tilslut MIDI', 'Tilføj morgenstjerne (figur)'].every(x => ops.k.includes(x)) && ops.gemt && ops.ab, `intet valgt: ${ops.k.join(' · ')}; Gem som 1 gemmer Opsætning 1; Sammenlign: "${ops.ab}"`);
    /* 2 · Lydkilde-noden */
    const lk = await side.evaluate(async () => { neVaelg('k:main'); await new Promise(r => setTimeout(r, 400)); const kp = $('ne-kp'), q = s => kp.querySelector(s);
      const knapper = [...kp.querySelectorAll('.ne39 [data-ne39]')].map(b => b.dataset.ne39 + (b.dataset.v ? ':' + b.dataset.v : ''));
      const s = q('[data-ne39g="bpm"]'); s.value = 140; s.dispatchEvent(new Event('input', { bubbles: true })); await new Promise(r => setTimeout(r, 400)); const bpm = document.querySelector('#gen [data-g="bpm"]').value, bpmTxt = q('[data-ne39v="bpm"]').textContent;
      q('[data-ne39="motor"][data-v="klassisk"]').click(); await new Promise(r => setTimeout(r, 400)); const kl = gs.motor, klPaa = q('[data-ne39="motor"][data-v="klassisk"]').classList.contains('ne-paa');
      q('[data-ne39="motor"][data-v="ny"]').click(); await new Promise(r => setTimeout(r, 300)); const ny = gs.motor;
      q('[data-ne39="spil"]').click(); await new Promise(r => setTimeout(r, 1200)); const spiller = gPlaying, stopTxt = q('[data-ne39="spil"]').textContent;
      q('[data-ne39="ny"]').click(); await new Promise(r => setTimeout(r, 300));
      q('[data-ne39="spil"]').click(); await new Promise(r => setTimeout(r, 600)); const stoppet = !gPlaying;
      const a0 = autoOn; q('[data-ne39="auto"]').click(); await new Promise(r => setTimeout(r, 500)); const a1 = autoOn, aTxt = q('[data-ne39="auto"]').textContent; q('[data-ne39="auto"]').click(); await new Promise(r => setTimeout(r, 200));
      return { knapper, bpm, bpmTxt, kl, klPaa, ny, spiller, stopTxt, stoppet, a0, a1, aTxt, autoEfter: autoOn, spor: q('[data-ne39v="spor"]').textContent, lin: q('[data-ne39="lin"]').textContent }; });
    await side.screenshot({ path: path.join(UD, 'knapper-lydkilde.png'), clip: await side.evaluate(() => { const r = $('ne-kp').getBoundingClientRect(); return { x: r.left, y: r.top, width: Math.min(1100, r.width), height: r.height }; }) });
    T.tjek(['fil', 'spor', 'sporfjern', 'spil', 'ny', 'mut', 'adv', 'motor:ny', 'motor:klassisk', 'lin', 'auto', 'autonu'].every(x => lk.knapper.includes(x)), `Lydkilde-noden har ${lk.knapper.length} knapper: ${lk.knapper.join(', ')} (4 spor: "${lk.spor}", Lyd ind: "${lk.lin}")`);
    T.tjek(lk.bpm === '140' && /140/.test(lk.bpmTxt), `tempo-skyderen i Node-editoren styrer generatoren (${lk.bpm}, vist "${lk.bpmTxt}")`);
    T.tjek(lk.kl === 'klassisk' && lk.klPaa && lk.ny === 'ny', `Lydmotor: Klassisk og tilbage til Ny (${lk.kl} → ${lk.ny})`);
    T.tjek(lk.spiller && /Stop/.test(lk.stopTxt) && lk.stoppet, `Afspil starter generatoren (knappen viser "${lk.stopTxt}"), og den stopper igen`);
    T.tjek(lk.a1 === !lk.a0 && /Auto-mapping: (Til|Fra)/.test(lk.aTxt) && lk.autoEfter === lk.a0, `Auto-mapping: Til/Fra skifter (${lk.a0} → ${lk.a1}, knappen viser "${lk.aTxt}")`);
    /* 2b · noderne har stadig plads: kontrolpanelet højst 46 %, lærredet mindst 140 px (ved 1600 × 1000 i layoutet Noder) */
    const plads = await side.evaluate(async () => { const h = () => Math.round($('ne-flade').getBoundingClientRect().height); const lk = h(); neVaelg(null); await new Promise(r => setTimeout(r, 300)); return { lk, tom: h(), ne: Math.round($('ne').getBoundingClientRect().height) }; });
    T.tjek(plads.lk >= 140 && plads.tom >= 140, `noderne har plads: lærredet er ${plads.tom} px uden valg og ${plads.lk} px med Lydkilde valgt (Node-editoren ${plads.ne} px; uden loftet var det 0)`);
    /* 3 · morgenstjerne og Ctrl+K */
    const ms = await side.evaluate(async () => { neVaelg(null); const m0 = maps.length; ne39Handling('morgen'); await new Promise(r => setTimeout(r, 600)); const L = []; neKpPunkter(L); return { ny: maps.length - m0, ck: L.filter(x => x.kat === 'Knapper · Node-editor').map(x => x.n) }; });
    T.tjek(ms.ny === 6, `Tilføj morgenstjerne lægger ${ms.ny} regler`);
    T.tjek(['Opsætning: Gem som 1', 'Opsætning: Sammenlign 1 ↔ 2', 'Tilslut MIDI', 'Lydmotor: Klassisk', 'Auto-mapping: Til/Fra', 'Generator: Nyt mønster'].every(x => ms.ck.includes(x)), `Ctrl+K har knapperne (${ms.ck.length} under Knapper · Node-editor)`);
    /* 4 · skjult fane: ingen tegning på en tom flade */
    const gpu = await side.evaluate(async () => { const N = window.NE14; if (!N || !N.renderer) return { ingen: true }; let n = 0; const r = N.renderer, gl = r.render.bind(r); r.render = function () { n++; return gl.apply(null, arguments) };
      fgVaelg('lyd', 'w31', true); await new Promise(r => setTimeout(r, 1500)); const skjult = { n, tom: N.tom };
      n = 0; fgVaelg('lyd', 'w33', true); await new Promise(r => setTimeout(r, 1500)); return { skjult, synlig: { n, tom: N.tom } }; });
    T.tjek(gpu.ingen || (gpu.skjult.tom === true && gpu.skjult.n === 0 && gpu.synlig.tom === false && gpu.synlig.n > 0), gpu.ingen ? 'TSL-linjerne kører ikke i denne browser (springes over)' : `skjult fane: fladen er tom, ${gpu.skjult.n} tegninger (før blev der tegnet, og WebGPU gav fejl); synlig igen: ${gpu.synlig.n} tegninger`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
