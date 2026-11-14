/* Trin 4 · Det nye i v9.38: altid skarpt (brugerens ønske 8. november).
   Testbrowseren køres med skærmens skalering 1,5 (devicePixelRatio, fagudtryk), som en Windows-skærm på 150 %, ved 2560 × 1440.
   - Live preview tegner i skærmens fulde opløsning (før 0,67), også på kvalitetsniveauet Spar.
   - Øjet i fuld størrelse på 4K er skarpt (før 0,89); Radial Mesh er skarp (uændret).
   - Node-editoren: ved 15 % er noderne kasser med tekst (ingen lys); will-change er kun sat, mens der zoomes; tegnefladerne i noderne får flere
     punkter, jo mere der zoomes ind (zoom × 1,5, højst 4×), og færre igen, når der zoomes ud.
   - Drejeknapperne: 60 px op flytter Hysterese 0,045 (400 px for hele vejen; før 150), 60 px til højre gør det samme, musehjulet tager ét trin.
   - Ingen advarsel "Multiple instances of Three.js" i konsollen.
   Skærmbilleder: tests/ud/skarp-live-preview.png og skarp-noder-15.png. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const UD = path.join(__dirname, 'ud');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Altid skarpt');
  console.log('33 · Altid skarpt · ' + path.basename(fil));
  fs.mkdirSync(UD, { recursive: true });
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 2560, height: 1440 }, deviceScaleFactor: 1.5 }); const fejl = [], advarsel = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); if (/Multiple instances of Three/.test(x.text())) advarsel.push(x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(5000);
    const maal = cv => side.evaluate(cv => { const c = document.getElementById(cv); return c && c.clientWidth ? { r: c.width / (c.clientWidth * devicePixelRatio), w: c.width, cw: c.clientWidth } : { r: 0, w: 0, cw: 0 }; }, cv);
    const vis = async id => { await side.evaluate(id => scVaelg(id, true), id); await side.waitForTimeout(1800); };
    /* 1 · Live preview, også med regulatoren på trin 2 og et kvalitetsniveau med skala 0,5 */
    await vis('w2'); const p1 = await maal('pv');
    await side.evaluate(async () => { const g = kvalNu; window.kvalNu = function () { return Object.assign({}, g.apply(this, arguments), { skala: .5 }); }; REG.trin = 2; pvResize(); await new Promise(r => setTimeout(r, 600)); });
    const p2 = await maal('pv'); await side.evaluate(() => { REG.trin = 0; });
    T.tjek(Math.abs(p1.r - 1) < .03 && Math.abs(p2.r - 1) < .03, `Live preview tegner i skærmens fulde opløsning: ${p1.w} punkter på ${p1.cw} px × 1,5 (forhold ${p1.r.toFixed(2)}, før 0,67); med regulator trin 2 og skala 0,5 stadig ${p2.r.toFixed(2)}`);
    await side.screenshot({ path: path.join(UD, 'skarp-live-preview.png'), clip: await side.evaluate(() => { const r = $('pv').getBoundingClientRect(); return { x: r.left, y: r.top, width: Math.min(1000, r.width), height: Math.min(640, r.height) }; }) });
    /* 2 · Øjet og Radial Mesh: i zonen, i fuld skærm (2560 × 1440 × 1,5 = 4K) og i ⤢ Stor */
    const tre = async (id, cv) => { await vis(id); const a = await maal(cv); await side.click('#dz-sc [data-dk="fuld"]'); await side.waitForTimeout(2500); const b = await maal(cv); await side.evaluate(() => document.fullscreenElement && document.exitFullscreen()); await side.waitForTimeout(1500); await side.click('#dz-sc [data-dk="stor"]'); await side.waitForTimeout(2000); const c = await maal(cv); await side.keyboard.press('Escape'); await side.waitForTimeout(1200); return [a, b, c]; };
    const oj = await tre('w29', 'ojcv'), rm = await tre('w5', 'mesh');
    const tekst = l => l.map(x => x.r.toFixed(2) + ' (' + x.w + ' punkter)').join(', ');
    T.tjek(oj.every(x => x.r > .97), `Øjet i zonen, i fuld skærm og i ⤢ Stor: ${tekst(oj)} (før 0,89 i fuld skærm)`);
    T.tjek(rm.every(x => x.r > .97), `Radial Mesh i zonen, i fuld skærm og i ⤢ Stor: ${tekst(rm)}`);
    const loft = await side.evaluate(() => { const s = [...document.scripts].map(x => x.textContent).join(''); return { ny: s.includes('if(W*Hh>9e6)'), gl: s.includes('if(W*Hh>6e6)') }; });
    T.tjek(loft.ny && !loft.gl, 'Øjets loft er 9 millioner punkter (fuld skærm på 4K = 8,3 millioner), ikke 6');
    /* 3 · Node-editoren */
    await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1500)); NE.tilpas = false; NE.z = .15; NE.x = 20; NE.y = 100; neVis(); await new Promise(r => setTimeout(r, 1500)); });
    const z15 = await side.evaluate(() => { const n = document.querySelector('#ne-verden .ne-node'); return { lod: $('ne').classList.contains('ne-lod'), vis: getComputedStyle(n.querySelector('.ne-nh')).visibility, lys: document.querySelectorAll('#ne-verden .ne-node.ne-lys').length, wc: $('ne-verden').style.willChange, css: getComputedStyle($('ne-verden')).willChange }; });
    await side.screenshot({ path: path.join(UD, 'skarp-noder-15.png'), clip: await side.evaluate(() => { const r = $('ne').getBoundingClientRect(); return { x: r.left, y: r.top, width: Math.min(1400, r.width), height: Math.min(800, r.height) }; }) });
    T.tjek(!z15.lod && z15.vis === 'visible' && z15.lys === 0, `ved 15 % er noderne kasser med tekst (ingen lys, ingen ne-lod)`);
    const zoom = await side.evaluate(async () => { const v = $('ne-verden'); NE.z = 2; neVis(); const under = v.style.willChange; await new Promise(r => setTimeout(r, 900)); const s = document.querySelector('#ne-verden canvas.ne-spek'); const efter = v.style.willChange, w2 = s && s.width; NE.z = .3; neVis(); await new Promise(r => setTimeout(r, 900)); return { under, efter, w2, w03: s && s.width, bw: s && +s.dataset.bw, cw: s && s.clientWidth }; });
    T.tjek(zoom.under === 'transform' && zoom.efter === 'auto', `will-change er "transform" mens der zoomes og "auto" bagefter, så teksten tegnes skarpt igen (${zoom.under} → ${zoom.efter})`);
    T.tjek(zoom.bw === 280 && zoom.w2 === 840 && zoom.w03 === 280, `spektret i FFT-noden: ${zoom.w2} punkter ved 200 % (280 × 3), ${zoom.w03} ved 30 %`);
    /* 4 · drejeknapperne */
    await side.evaluate(async () => { NE.z = .8; neVis(); const n = [...NE2.N.values()].find(x => x.kol === 'regel'); maps[n.i].hyst = 0; neVaelg(n.key); await new Promise(r => setTimeout(r, 600)); });
    const knap = async () => side.evaluate(() => { const k = document.querySelector('#ne-kp .ne-knap[data-nf="hyst"]'); k.scrollIntoView({ block: 'center' }); const r = k.querySelector('svg').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    const hyst = () => side.evaluate(() => ne4Vaerdi(maps[NE2.N.get(NE2.valgt).i], 'hyst'));
    let q = await knap(); await side.mouse.move(q.x, q.y); await side.mouse.down(); await side.mouse.move(q.x, q.y - 60, { steps: 8 }); await side.mouse.up(); await side.waitForTimeout(300); const op = await hyst();
    await side.evaluate(() => { maps[NE2.N.get(NE2.valgt).i].hyst = 0; neVaelg(NE2.valgt); }); await side.waitForTimeout(1500); /* v9.45: vent, til Node-editoren har bygget sig om efter nulstillingen */
    q = await knap(); await side.mouse.move(q.x, q.y); await side.mouse.down(); await side.mouse.move(q.x + 60, q.y, { steps: 8 }); await side.mouse.up(); await side.waitForTimeout(300); const hoejre = await hyst();
    q = await knap(); await side.mouse.move(q.x, q.y); await side.mouse.wheel(0, -100); await side.waitForTimeout(300); const hjul = await hyst();
    T.tjek(Math.abs(op - .05) < .015 && Math.abs(hoejre - .05) < .015 && Math.abs(hjul - hoejre - .01) < .001, `drejeknappen Hysterese (0 til 0,3): 60 px op giver ${op}, 60 px til højre ${hoejre}, ét hak på musehjulet +0,01 (${hjul}); før gav 60 px 0,12`);
    /* 5 · brugerens tilfælde: arbejd i noderne (layoutet Noder), gå så i ⤢ Stor med Live preview */
    await side.evaluate(async () => { scVaelg('w2', true); await new Promise(r => setTimeout(r, 1200)); });
    await side.click('#' + await side.evaluate(() => $('pv').closest('.dk-zone').id) + ' [data-dk="stor"]'); await side.waitForTimeout(1500);
    const st = await side.evaluate(() => { const c = $('pv'); return { b: c.width / (c.clientWidth * devicePixelRatio), h: c.height / (c.clientHeight * devicePixelRatio), w: c.width, hh: c.height, cw: c.clientWidth, ch: c.clientHeight }; });
    await side.keyboard.press('Escape'); await side.waitForTimeout(800);
    T.tjek(Math.abs(st.b - 1) < .03 && Math.abs(st.h - 1) < .03, `layoutet Noder, efter arbejde i noderne, Live preview i ⤢ Stor: ${st.w} × ${st.hh} punkter på ${st.cw} × ${st.ch} px (forhold ${st.b.toFixed(2)} × ${st.h.toFixed(2)}; v9.37: 0,67)`);
    T.tjek(!advarsel.length, 'ingen advarsel "Multiple instances of Three.js" i konsollen', advarsel[0] || '');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
