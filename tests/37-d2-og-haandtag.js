/* Trin 4 · Det nye i v9.42: D2 på lærredet og håndtag i billedet (de sidste linjer fra funktionslisten).
   - Sortér: D2 (efter musik) stiller reglerne og lydtrækkene i D2-rækkefølgen (mappe efter musik) med en overskrift pr. mappe; Figur → mål giver det gamle.
   - Håndtag i billedet på Live previews scene-node: et træk i en effekts prik (Lys-puls) og en figurs prik flytter dem på scenen (pos og o.pos),
     gemmes, flytter ikke noden og åbner ikke Show.
   Skærmbilleder: tests/ud/d2-lærred.png og haandtag-billede.png. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const UD = path.join(__dirname, 'ud');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('D2 og håndtag');
  console.log('37 · D2 på lærredet og håndtag i billedet · ' + path.basename(fil));
  fs.mkdirSync(UD, { recursive: true });
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1500)); neAutoPlacer(); neVaelg(null); ne2Kp(true); await new Promise(r => setTimeout(r, 400)); });
    /* 1 · D2 */
    const d2 = await side.evaluate(async () => { document.querySelector('#ne-kp [data-ne42="sort"][data-v="d2"]').click(); await new Promise(r => setTimeout(r, 800));
      const mi = k => SIG_MAPPER.indexOf(sigInfo(k).mappe), N = [...NE2.N.values()];
      const reg = N.filter(n => n.kol === 'regel' && n.m).sort((a, b) => a.y - b.y).map(n => mi(n.m.band)), lt = N.filter(n => n.kol === 'lydtraek' && n.regler.length).sort((a, b) => a.y - b.y).map(n => mi(n.band));
      const stiger = a => a.every((v, i) => !i || v >= a[i - 1]);
      return { sort: set.ne.sort, hoved: [...document.querySelectorAll('#ne-verden .ne42-mappe')].map(e => e.textContent), reg: stiger(reg), lt: stiger(lt), n: reg.length, knap: document.querySelector('#ne-kp [data-ne42="sort"][data-v="d2"]').classList.contains('ne-paa') }; });
    await side.evaluate(() => neTilpas()); await side.waitForTimeout(500);
    await side.screenshot({ path: path.join(UD, 'd2-lærred.png'), clip: await side.evaluate(() => { const r = $('ne').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }) });
    T.tjek(d2.sort === 'd2' && d2.knap && d2.hoved.length >= 2 && d2.reg && d2.lt, `D2: ${d2.n} regler og deres lydtræk står i mapper efter musik (${d2.hoved.join(', ')})`);
    const fm = await side.evaluate(async () => { ne42SaetSort('figur'); await new Promise(r => setTimeout(r, 600)); return { sort: set.ne.sort, hoved: document.querySelectorAll('#ne-verden .ne42-mappe').length }; });
    T.tjek(fm.sort === 'figur' && fm.hoved === 0, 'Figur → mål giver det gamle (ingen mappe-overskrifter)');
    /* 2 · håndtag i billedet */
    const forb = await side.evaluate(async () => { const n = [...NE2.N.values()].find(x => x.kol === 'scene' && x.sc === 'w2'); neVaelg(n.key); await new Promise(r => setTimeout(r, 400)); const b = document.querySelector('#ne-kp [data-ne42="haand"]'); const fra = b && b.textContent; b.click(); await new Promise(r => setTimeout(r, 300));
      const c = n.el.querySelector('.ne-sc-billede'); c.scrollIntoView({ block: 'center' }); neVis(); await new Promise(r => setTimeout(r, 700)); return { key: n.key, fra, til: (document.querySelector('#ne-kp [data-ne42="haand"]') || {}).textContent, on: set.ne.haand, x0: n.x, y0: n.y }; });
    T.tjek(forb.on && /Fra/.test(forb.fra) && /Til/.test(forb.til), `Live previews scene-node har "${forb.fra}" → "${forb.til}"`);
    const prik = (k) => side.evaluate(([key, k]) => { const n = NE2.N.get(key), c = n.el.querySelector('.ne-sc-billede'), K = ne42Kort(c), r = c.getBoundingClientRect(), p = hp(k); return { x: r.left + (K.ox + p.x * K.w) / K.W * r.width, y: r.top + (K.oy + p.y * K.h) / K.H * r.height, px: p.x, py: p.y, sx: r.width / K.W }; }, [forb.key, k]);
    const træk = async (q, dx, dy) => { await side.mouse.move(q.x, q.y); await side.mouse.down(); await side.mouse.move(q.x + dx / 2, q.y + dy / 2, { steps: 4 }); await side.mouse.move(q.x + dx, q.y + dy, { steps: 6 }); await side.mouse.up(); await side.waitForTimeout(300); };
    const p0 = await prik('puls'); await træk(p0, 40, -20); const p1 = await prik('puls');
    const fig = await side.evaluate(() => fase2.objekter[0] ? 'obj:' + fase2.objekter[0].id : null);
    let f0 = null, f1 = null; if (fig) { f0 = await prik(fig); await træk(f0, -30, 15); f1 = await prik(fig); }
    await side.screenshot({ path: path.join(UD, 'haandtag-billede.png'), clip: await side.evaluate(k => { const r = NE2.N.get(k).el.getBoundingClientRect(); return { x: r.left - 10, y: r.top - 10, width: r.width + 20, height: r.height + 20 }; }, forb.key) });
    const efter = await side.evaluate(k => { const n = NE2.N.get(k); return { x: n.x, y: n.y, gemt: JSON.parse(localStorage.getItem('rytme-pos') || '{}').puls, stor: !!(DK && DK.stor), lay: set.lay3 }; }, forb.key);
    T.tjek(p1.px > p0.px + .02 && p1.py < p0.py - .01 && efter.gemt && Math.abs(efter.gemt.x - p1.px) < 1e-6, `et træk i Lys-pulsens prik flytter den på scenen (x ${p0.px.toFixed(2)} → ${p1.px.toFixed(2)}, y ${p0.py.toFixed(2)} → ${p1.py.toFixed(2)}) og gemmes`);
    T.tjek(!fig || (f1.px < f0.px - .02 && f1.py > f0.py + .01), fig ? `en figurs prik flytter figuren (x ${f0.px.toFixed(2)} → ${f1.px.toFixed(2)})` : 'ingen figur at flytte (springes over)');
    T.tjek(efter.x === forb.x0 && efter.y === forb.y0 && !efter.stor, 'trækket flytter ikke noden og åbner ikke Show (⤢ Stor)');
    const ck = await side.evaluate(() => { const L = []; neKpPunkter(L); return L.filter(x => /^Sortér: |^Håndtag i billedet/.test(x.n)).length; });
    T.tjek(ck === 3, `Ctrl+K har Sortér (2) og Håndtag i billedet (${ck} punkter)`);
    await side.evaluate(() => ne42SaetHaand(false));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
