/* Trin 4 · Det nye i v9.37: rettet, at en node ikke kunne trækkes (fundet af brugeren i en video 8. november).
   Før: et træk på kontrolpanelets tekst, kolonnernes overskrifter eller værktøjslinjen markerede tekst hen over noderne; det næste træk i en node
   startede browserens træk-og-slip af markeringen (dragstart), som afbrød nodens træk (pointercancel), så noden kun flyttede sig få pixel.
   Nu: de tre træk markerer ingen tekst; med en markering over noderne flytter noden sig hele vejen, uden dragstart og pointercancel; fanerne i zonerne
   kan stadig trækkes; felter i kontrolpanelet kan stadig skrives i. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Træk uden markering');
  console.log('32 · Træk uden markering · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1200)); window.__ev = []; ['dragstart', 'pointercancel'].forEach(n => document.addEventListener(n, e => window.__ev.push(n), true)); });
    const træk = async (q, dx, dy) => { await side.mouse.move(q.x, q.y); await side.mouse.down(); await side.mouse.move(q.x + dx / 4, q.y + dy / 4, { steps: 4 }); await side.mouse.move(q.x + dx, q.y + dy, { steps: 10 }); await side.mouse.up(); await side.waitForTimeout(250); };
    /* 1 · trækkene, der før markerede tekst */
    const mark = [];
    for (const [navn, s] of [['kontrolpanelet', '#ne-kp .ne-kp-tekst'], ['kolonnernes overskrifter', '#ne-hoveder .ne-hoved[data-kol="fft"] .ne-hvad'], ['værktøjslinjen', '#ne .ne-vlinje .ne-trin']]) {
      const q = await side.evaluate(s => { getSelection().removeAllRanges(); const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + 12, y: r.top + Math.min(r.height / 2, 14) }; }, s);
      await træk(q, 500, 250); mark.push(navn + ' ' + await side.evaluate(() => { const s = getSelection(); return s.rangeCount && s.getRangeAt(0).intersectsNode(document.getElementById('ne-verden')) ? 'markerer noderne' : 'ingen markering over noderne'; }));
    }
    T.tjek(mark.every(m => /ingen markering/.test(m)), `træk på kontrolpanelet, kolonnernes overskrifter og værktøjslinjen markerer ikke noderne (${mark.join(', ')})`);
    /* 2 · en markering over noderne stopper ikke længere nodens træk */
    const r0 = await side.evaluate(() => { const s = getSelection(); s.removeAllRanges(); const rg = document.createRange(); rg.setStartBefore(document.getElementById('ne-hoveder')); rg.setEndAfter(document.getElementById('ne-kp')); s.addRange(rg); window.__ev = []; const n = NE2.N.get('f:fin'), q = n.el.querySelector('.ne-nh').getBoundingClientRect(); return { x: q.left + 30, y: q.top + q.height / 2, x0: n.x, sel: s.rangeCount && !s.isCollapsed }; });
    await træk(r0, 160, 120);
    const r1 = await side.evaluate(() => ({ x: NE2.N.get('f:fin').x, ev: window.__ev.slice() }));
    T.tjek(r0.sel && r1.x - r0.x0 > 300 && !r1.ev.length, `med en markering over noderne flytter FFT · fin hele vejen (${r0.x0} → ${r1.x}), uden dragstart og pointercancel`);
    /* 3 · fanerne kan stadig trækkes, og felterne kan stadig skrives i */
    const f = await side.evaluate(() => { const a = document.querySelector('.dk-fane[data-w="w28"]').getBoundingClientRect(), z = document.querySelector('.dk-zone:has(#w33)').getBoundingClientRect(); return { x: a.left + a.width / 2, y: a.top + a.height / 2, tx: z.left + z.width - 40, ty: z.top + z.height / 2 }; });
    await træk(f, f.tx - f.x, f.ty - f.y); await side.waitForTimeout(500);
    const ny = await side.evaluate(() => { const z = dkZoneAf('w28'); return z && z.f.length === 1 && z.a === 'w28'; });
    const felt = await side.evaluate(() => { const i = document.createElement('input'); document.getElementById('ne-kp').appendChild(i); const u = getComputedStyle(i).userSelect; i.remove(); return u; });
    T.tjek(ny && felt !== 'none', `fanen Mesh 3D kan stadig trækkes til en ny zone; felter i Node-editoren kan stadig markeres (user-select: ${felt})`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
