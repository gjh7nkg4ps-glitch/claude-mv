/* Trin 4 · Det nye i v9.32: Node-editoren, trin 14 (linjer og glød i TSL med den nye three.js ved siden af r128).
   Den nye three.js (r186) starter fra teksten i filen (intet internet), WebGPU eller WebGL2 bruges (i testbrowseren: WebGL2, for der er intet grafikkort),
   og window.THREE er stadig r128. Linjerne står på TSL-lærredet og ikke på Canvas 2D-lærredet. Gløden er kun på det valgte og det, der slår til:
   uden valg og uden lyd ingen glød; med en valgt regel glød på dens kæde. Canvas 2D kan vælges og tegner som før; Auto skifter tilbage.
   Mesh 3D og Øjet starter stadig. WebGPU kan ikke testes her. Skærmbillede: tests/ud/node-editor-tsl.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 14)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('27 · Node-editor, trin 14 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); NE.tilpas = false; NE.z = .45; NE.x = -200; NE.y = 110; neVis(); });
    const st = await side.evaluate(async () => { for (let i = 0; i < 300 && !NE14.ok && /indlæses/.test(NE14.grund); i++) await new Promise(r => setTimeout(r, 100)); return { ok: NE14.ok, backend: NE14.backend, rev: NE14.rev, gammel: THREE.REVISION, grund: NE14.grund, gpu: 'gpu' in navigator, kp: (document.querySelector('#ne-kp [data-ne14="tekst"]') || {}).textContent }; });
    T.tjek(st.ok && /^WebG/.test(st.backend) && st.rev === '186' && st.gammel === '128', `den nye three.js r${st.rev} kører med ${st.backend || '–'} ved siden af r${st.gammel} (window.THREE)${st.ok ? '' : ': ' + st.grund}`);
    T.tjek(/TSL · WebG/.test(st.kp || ''), `kontrolpanelet siger "Linjer: ${st.kp}"`);
    /* pixels: TSL-lærredet har linjerne, Canvas 2D-lærredet er tomt */
    const px = () => side.evaluate(() => { const tael = c => { const k = document.createElement('canvas'); k.width = c.width; k.height = c.height; const g = k.getContext('2d'); g.drawImage(c, 0, 0); const d = g.getImageData(0, 0, k.width, k.height).data; let n = 0; for (let i = 3; i < d.length; i += 4 * 7) if (d[i] > 20) n++; return n }; neLinjerTegn(); return { tsl: tael(document.getElementById('ne-linjer-tsl')), k2d: tael(document.getElementById('ne-linjer')), links: NE14.stat.links, gloed: NE14.stat.gloed }; });
    const a = await px();
    T.tjek(a.tsl > 500 && a.k2d === 0 && a.links > 10, `${a.links} links tegnes på TSL-lærredet (${a.tsl} prøver med farve); Canvas 2D-lærredet er tomt`);
    T.tjek(a.gloed === 0, 'uden valg og uden lyd: ingen glød');
    const v = await side.evaluate(() => { const r = [...NE2.N.values()].find(x => x.kol === 'regel' && x.i >= 0); neVaelg(r.key); return NE2.L.filter(l => NE2.kaede.has(l.fra) && NE2.kaede.has(l.til)).length; });
    const b = await px();
    await side.screenshot({ path: path.join(UD, 'node-editor-tsl.png') });
    T.tjek(b.gloed > 0 && b.gloed <= v, `en valgt regel: glød på ${b.gloed} links (kæden har ${v})`);
    await side.evaluate(async () => { curGen = 'house'; gStart(); neVaelg(null); await new Promise(r => setTimeout(r, 2500)); });
    let mx = 0; for (let i = 0; i < 6; i++) { const c = await px(); mx = Math.max(mx, c.gloed); await vent(150); }
    T.tjek(mx > 0, `mens generatoren spiller, gløder op til ${mx} links, der slår til`);
    /* Canvas 2D og tilbage */
    const c2 = await side.evaluate(async () => { document.querySelector('#ne-kp [data-ne14="2d"]').click(); await new Promise(r => setTimeout(r, 300)); return { gemt: set.ne.linjer, skjult: document.getElementById('ne-linjer-tsl').hidden }; });
    const c2p = await px();
    const au = await side.evaluate(async () => { document.querySelector('#ne-kp [data-ne14="auto"]').click(); await new Promise(r => setTimeout(r, 300)); return { gemt: set.ne.linjer === undefined, brug: NE14.brug() }; });
    const aup = await px();
    T.tjek(c2.gemt === '2d' && c2.skjult && c2p.k2d > 300 && au.gemt && au.brug && aup.tsl > 500 && aup.k2d === 0, `Canvas 2D tegner linjerne som før (${c2p.k2d} prøver), og Auto skifter tilbage til TSL`);
    /* r128 er uændret: Mesh 3D og Øjet starter */
    const m = await side.evaluate(async () => { scVaelg('w28', true); await new Promise(r => setTimeout(r, 2500)); scVaelg('w29', true); await new Promise(r => setTimeout(r, 2500)); const r = { m3: !!M3.r && !M3.tabt, oj: !!OJ.r && !OJ.tabt }; scVaelg('w2', true); return r; });
    T.tjek(m.m3 && m.oj, 'Mesh 3D og Øjet (r128) starter stadig');
    const kb = Math.round(fs.statSync(fil).size / 1024);
    T.tjek(kb > 5500, `filen er ${kb} KB (den nye three.js fylder cirka 3,7 MB)`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    console.log('  ⚠ WebGPU kan ikke testes i testbrowseren (intet grafikkort); navigator.gpu findes: ' + st.gpu);
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/node-editor-tsl.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
