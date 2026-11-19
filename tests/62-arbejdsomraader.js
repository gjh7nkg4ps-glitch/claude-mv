/* Trin 4 · Det nye i v9.67: fase 5, trin 5a: de fire arbejdsområder Sang, Scene, Regler og Show (tasterne 1 til 4).
   - Fire knapper står først i topbjælken; et rigtigt klik viser arbejdsområdets vinduer uden overlap.
   - Tasterne 1 til 4 skifter; mens der skrives i et felt, skifter de ikke.
   - De gamle layouts ligger der stadig; ↺ Standard sætter et arbejdsområde tilbage.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Arbejdsområder');
  console.log('62 · De fire arbejdsområder: Sang, Scene, Regler og Show · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      const se = () => side.evaluate(() => { const ws = document.getElementById('ws').getBoundingClientRect(); const V = [...document.querySelectorAll('#ws .win')].filter(x => { const r = x.getBoundingClientRect(), st = getComputedStyle(x); return !x.hidden && st.display !== 'none' && st.visibility !== 'hidden' && r.width > 40 && r.height > 40 && r.bottom > ws.top && r.top < ws.bottom }).map(x => ({ id: x.id, r: x.getBoundingClientRect() }));
        let ov = 0; for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) { const a = V[i].r, b = V[j].r; if (a.left < b.right - 2 && b.left < a.right - 2 && a.top < b.bottom - 2 && b.top < a.bottom - 2) ov++ }
        const faner = [...new Set(dkZoner(set.dock).flatMap(z => z.f))].sort(); return { lay: set.lay3, vinduer: V.map(v => v.id).sort(), faner, ov, paa: (document.querySelector('#lay3 [data-lay3].on') || {}).textContent } });
      /* 1 · kun de fire knapper (v9.71) */
      const kn = await side.evaluate(() => [...document.querySelectorAll('#lay3 [data-lay3]')].map(b => b.textContent));
      T.tjek(kn.join('|') === '1 · Analyse|2 · Scene|3 · Regler|4 · Show' /* v9.98 */, `${w} × ${h}: de fire arbejdsområder står i linjen øverst (1 · Sang, 2 · Scene, 3 · Regler, 4 · Show); de seks gamle layout-knapper er væk (v9.71)`, JSON.stringify(kn));
      /* 2 · hvert arbejdsområde med et rigtigt klik */
      const vent = { 'ao-sang': ['w35'], 'ao-scene': ['w2', 'w28', 'w29', 'w5', 'w6', 'w34'], 'ao-regler': ['w2', 'w33', 'w36'], /* v9.87: Biblioteket */ 'ao-show': ['w13', 'w17', 'w2', 'w28', 'w29', 'w5'] }; const R = {};
      for (const k of Object.keys(vent)) { await side.click('#lay3 [data-lay3="' + k + '"]'); await side.waitForTimeout(1300); R[k] = await se(); }
      T.tjek(Object.keys(vent).every(k => R[k].lay === k && R[k].ov === 0 && R[k].faner.join() === vent[k].slice().sort().join() && R[k].vinduer.length === (k === 'ao-scene' || k === 'ao-regler' ? 3 : k === 'ao-sang' ? 1 : 2) /* v9.74: Scene har tre zoner; v9.76: Sang er ét vindue; v9.87: Regler har tre (Biblioteket) */ && R[k].vinduer.every(v => vent[k].includes(v))), `${w} × ${h}: et klik på hver knap viser arbejdsområdets vinduer i to zoner (Scene: tre, Sang: én) uden overlap (Sang: vinduet Sang · Scene: Live preview, Mesh 3D, Øjet, Radial Mesh, Editor, Idé-galleri · Regler: Biblioteket, Node-editor og Live preview · Show: scenerne, Opsætninger og Show)`, JSON.stringify(R));
      T.tjek(R['ao-regler'].paa === '3 · Regler' && R['ao-show'].paa === '4 · Show', `${w} × ${h}: den valgte knap er markeret`, JSON.stringify([R['ao-regler'].paa, R['ao-show'].paa]));
      /* 3 · tasterne 1 til 4; ikke mens der skrives i et felt */
      await side.evaluate(() => { if (document.activeElement) document.activeElement.blur(); document.body.focus() }); const tast = [];
      for (const k of ['1', '2', '3', '4']) { await side.keyboard.press(k); await side.waitForTimeout(900); tast.push((await se()).lay) }
      await side.evaluate(() => { const i = document.createElement('input'); i.id = 'ao-prove'; i.style.cssText = 'position:fixed;left:300px;top:4px;z-index:99999'; document.body.appendChild(i); i.focus() }); await side.keyboard.press('2'); await side.waitForTimeout(700);
      const felt = await side.evaluate(() => { const i = document.getElementById('ao-prove'), v = i.value; i.remove(); return { v, lay: set.lay3 } });
      T.tjek(tast.join() === 'ao-sang,ao-scene,ao-regler,ao-show' && felt.v === '2' && felt.lay === 'ao-show', `${w} × ${h}: tasterne 1, 2, 3 og 4 skifter arbejdsområde; skrives 2 i et felt, står tallet i feltet, og arbejdsområdet skifter ikke`, JSON.stringify({ tast, felt }));
      /* 4 · et arbejdsområde husker en ændring, og ↺ Standard sætter det tilbage; et gammelt layout virker stadig */
      await side.keyboard.press('3'); await side.waitForTimeout(900);
      const st = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const s0 = JSON.stringify(set.dock.s); set.dock.s = [.5, .5]; dkGem(); dkAnvend(); await vent(300); lay3Anvend('ao-sang'); await vent(500); lay3Anvend('ao-regler'); await vent(500); const husket = JSON.stringify(set.dock.s); dkStandard(); await vent(500); const std = JSON.stringify(set.dock.s); lay3Anvend('overblik'); await vent(700); return { s0, husket, std, gl: set.lay3, zoner: dkZoner(set.dock).length } });
      T.tjek(st.husket === '[0.5,0.5]' && st.std === st.s0 && st.gl === 'overblik' && st.zoner === 3, `${w} × ${h}: arbejdsområdet Regler husker en flyttet streg, ↺ Standard sætter den tilbage, og det gamle layout Overblik virker stadig`, JSON.stringify(st));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
