/* Trin 4 · Det nye i v9.40: oprydning af døde rester (intet, brugeren bruger, er ændret).
   - Væk: Router-boksens tegninger, knapper og lyttere (r2Boks, r2Byg, r2Layout, r2Tegn, R2_KNAP …) og deres CSS; de frie vinduers kontrol hvert 0,3 s,
     knappen "Mini-vinduer i siderne" og reglerne for revne faner i zone-tilstand (v7.0, v7.1, v9.0).
   - Tilbage: de hjælpere, Node-editoren bruger (R2_HOLD, R2_STD, r2HoldIdx, r2HoldTxt, r2Kl, r2SpaerVirker, r2Hvor, r2Orden, r2AlleKilder), og de virker.
   - Manualen beskriver Node-editorens tastatur i stedet for Dublets. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Oprydning');
  console.log('35 · Oprydning · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8'), kode = html.slice(0, html.indexOf('<script type="text/plain" id="three-ny-core">'));
  const væk = ['r2Boks', 'r2Byg', 'r2Layout', 'r2Tegn', 'r2OpdaterBoks', 'R2_KNAP', 'r2Knap', 'vinParker', 'vinAabnAlle', 'zonHjem', 'zonSamlUde', 'tkGammelBoks', 'fjGammelR2Byg', 'lsGammelR2Byg'].filter(n => new RegExp('(?<![\\w$.])' + n + '(?![\\w$])').test(kode));
  T.tjek(!væk.length && !/\.r2-boks|\.r2-chip|\.r2-uchip/.test(kode) && !/Tastatur i Dublet/.test(kode), 'Router-boksens kode og CSS, de frie vinduers rester og "Tastatur i Dublet" er væk', væk.join(', '));
  T.tjek(/Tastatur i Node-editoren/.test(kode) && /ROUTER 2\.0-HJÆLPERE/.test(kode), 'manualen beskriver Node-editorens tastatur; blokken ROUTER 2.0-HJÆLPERE findes');
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    const a = await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1200));
      const h = ['R2_HOLD', 'R2_STD', 'r2HoldIdx', 'r2HoldTxt', 'r2Kl', 'r2SpaerVirker', 'r2Hvor', 'r2Orden', 'r2AlleKilder'].filter(n => typeof window[n] === 'undefined' && (() => { try { return typeof eval(n) === 'undefined' } catch (e) { return true } })());
      const n = [...NE2.N.values()].find(x => x.kol === 'regel'); neVaelg(n.key); await new Promise(r => setTimeout(r, 400));
      return { mangler: h, hold: r2HoldTxt(r2HoldIdx({ holdMs: R2_HOLD[10] })), holdV: R2_HOLD[10], hvor: r2Hvor('kick'), kilder: r2AlleKilder().length, raf: R2.raf, mini: !!document.getElementById('mini-til'), kp: !!document.querySelector('#ne-kp .ne-kp-ret') }; });
    T.tjek(!a.mangler.length && a.hold === a.holdV + ' ms' && /målt i/.test(a.hvor) && a.kilder > 50 && a.kp, `hjælperne virker: Hold "${a.hold}", "${a.hvor}", ${a.kilder} kilder; reglens kontrolpanel bygges`, a.mangler.join(', '));
    T.tjek(!a.mini && a.raf === 0, 'ingen knap "Mini-vinduer i siderne" og ingen Router-tegneløkke');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
