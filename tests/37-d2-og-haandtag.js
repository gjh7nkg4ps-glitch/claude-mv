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
    /* 2 · Håndtag i billedet er fjernet i v9.55 (brugerens fjerne-liste nr. 41); Flyt effekter i Live preview bliver */
    const hv = await side.evaluate(async () => { const n = [...NE2.N.values()].find(x => x.kol === 'scene' && x.sc === 'w2'); if (n) { neVaelg(n.key); await new Promise(r => setTimeout(r, 400)) } return { knap: !!document.querySelector('#ne-kp [data-ne42="haand"]'), til: ne42Haand() } });
    T.tjek(!hv.knap && !hv.til, 'knappen Håndtag i billedet er væk fra scene-nodens kontrolpanel');
    const ck = await side.evaluate(() => { const L = []; neKpPunkter(L); return L.filter(x => /^Sortér: /.test(x.n)).length + (L.some(x => /^Håndtag i billedet/.test(x.n)) ? 10 : 0); });
    T.tjek(ck === 2, `Ctrl+K har Sortér (2) og ikke længere Håndtag i billedet (${ck} punkter)`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
