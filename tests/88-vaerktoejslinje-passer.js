/* Trin 4 · Det nye i v9.99 (P8.14 punkt 3f og brugerens besked om Radial Mesh): værktøjslinjen over matrixen og Node-editoren ruller ikke;
   det, der ikke er plads til, ligger bag ⋯ Mere. Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 i 3 · Regler, i Noder og i Matrix: scrollWidth ≤ clientWidth;
   Noder · Matrix, Fortryd, Gentag og Foreslå regler står altid i linjen; ved 1920 ligger Baggrund, Dæmp, Kun valgt kæde og Automatik bag ⋯; et rigtigt klik på ⋯
   åbner listen, og et rigtigt klik på Automatik derinde åbner panelet; Esc lukker; ved 3840 i Matrix er ⋯ skjult. Radial Mesh: #w5:fullscreen>.wh er skjult i CSS,
   og × (fuld-x) mister .vis sammen med bjælken efter 3 s. Skærmbillede: tests/ud/vaerktoejslinje-mere.png. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Værktøjslinjen passer'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('88 · Værktøjslinjen passer (⋯ Mere) · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');
  T.tjek(/#w5:fullscreen>\.wh\{display:none\}/.test(html) && /#fuld-x\{opacity:0;pointer-events:none/.test(html), 'Radial Mesh i fuld skærm: vinduets overskrift er skjult, og × er usynligt, til musen flyttes (CSS)');
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      await side.click('#lay3 [data-lay3="ao-regler"]'); await side.waitForTimeout(3000);
      const m = () => side.evaluate(() => { const vl = document.querySelector('#ne .ne-vlinje'), k = document.getElementById('ne-vl-mere'), pop = document.getElementById('ne-vl-pop'); const tx = c => (c.textContent || '').trim(); return { w: vl.clientWidth, sw: vl.scrollWidth, knap: k ? (k.hidden ? 'skjult' : tx(k)) : 'mangler', i: pop ? [...pop.children].map(tx) : null, synlige: [...vl.children].filter(c => c.offsetParent && !c.hasAttribute('data-vlph')).map(tx) } });
      const n0 = await m(); const altid = r => r.synlige.some(t => /^Noder/.test(t)) && r.synlige.some(t => /Fortryd/.test(t)) && r.synlige.some(t => /Gentag/.test(t)) && r.synlige.some(t => /Foreslå regler/.test(t));
      T.tjek(n0.sw <= n0.w + 1 && altid(n0) && (w > 1920 || (n0.i.some(t => /^Baggrund/.test(t)) && n0.i.some(t => /^Dæmp/.test(t)) && n0.i.some(t => /^Automatik/.test(t)))), `${w} × ${h}, Noder: linjen ruller ikke (${n0.sw} ≤ ${n0.w}); Noder · Matrix, Fortryd, Gentag og Foreslå regler står i linjen; ${n0.knap}`, JSON.stringify(n0));
      await side.evaluate(() => mxSaet(true)); await side.waitForTimeout(900);
      const m1 = await m();
      T.tjek(m1.sw <= m1.w + 1 && altid(m1) && (w !== 3840 || m1.knap === 'skjult'), `${w} × ${h}, Matrix: linjen ruller ikke (${m1.sw} ≤ ${m1.w}); ${m1.knap}`, JSON.stringify(m1));
      await side.evaluate(() => mxSaet(false)); await side.waitForTimeout(900);
      if (w === 1920) {
        const luk0 = await side.evaluate(() => { const p = document.getElementById('ne-vl-pop'); return p.hidden && !p.checkVisibility() });
        T.tjek(luk0, `${w} × ${h}: listen bag ⋯ er usynlig, til der klikkes (hidden virker trods display:flex)`);
        await side.click('#ne-vl-mere'); await side.waitForTimeout(300);
        const o = await side.evaluate(() => { const p = document.getElementById('ne-vl-pop'); const b = [...p.querySelectorAll('button')].find(x => /Automatik/.test(x.textContent)); const q = b.getBoundingClientRect(); return { aaben: !p.hidden && p.checkVisibility(), x: q.x + q.width / 2, y: q.y + q.height / 2 } });
        await side.screenshot({ path: path.join(UD, 'vaerktoejslinje-mere.png'), clip: { x: 0, y: 0, width: 1920, height: 560 } });
        await side.mouse.click(o.x, o.y); await side.waitForTimeout(500);
        const a = await side.evaluate(() => ({ pan: !!document.getElementById('ne65-pan') && !document.getElementById('ne65-pan').hidden }));
        await side.keyboard.press('Escape'); await side.waitForTimeout(200); await side.keyboard.press('Escape'); await side.waitForTimeout(200);
        const l = await side.evaluate(() => ({ pop: document.getElementById('ne-vl-pop').hidden }));
        T.tjek(o.aaben && a.pan && l.pop, `${w} × ${h}: ⋯ Mere åbner listen (rigtigt klik), Automatik derinde åbner panelet, og Esc lukker`, JSON.stringify({ o: o.aaben, a, l }));
        /* bjælken Afslut fuld visning og × forsvinder sammen efter 3 s (uden rigtig fuld skærm: elementerne laves her) */
        const fb = await side.evaluate(async () => { const b = document.createElement('div'); b.id = 'fuld-bar'; const x = document.createElement('button'); x.id = 'fuld-x'; document.body.append(b, x); fuldVis(); const f0 = { b: b.classList.contains('vis'), x: x.classList.contains('vis') }; await new Promise(r => setTimeout(r, 3400)); const f1 = { b: b.classList.contains('vis'), x: x.classList.contains('vis') }; b.remove(); x.remove(); return { f0, f1 } });
        T.tjek(fb.f0.b && fb.f0.x && !fb.f1.b && !fb.f1.x, 'bjælken Afslut fuld visning og × vises sammen og forsvinder sammen efter 3 s', JSON.stringify(fb));
      }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
