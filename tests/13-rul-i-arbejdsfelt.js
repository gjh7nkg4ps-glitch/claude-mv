/* Trin 4 · Det nye i v9.18: alle faner i Arbejdsfeltet kan rulle, når indholdet er højere end fanen.
   Før v9.17 kunne Lydkilde ikke rulle; før v9.18 kunne Router ikke. For hver fane på Niveau 2 og 4: er indholdet højere end
   det synlige, skal der være noget, der ruller, og musehjulet skal flytte indholdet. Også linjen "Nyt i …" i manualen.
   Router er slettet i v9.35. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, versionFraNavn, tæller } = require('./faelles');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Rul i Arbejdsfeltet'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('13 · Rul i Arbejdsfeltet · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const niv of [2, 4]) {
      const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      await side.evaluate(n => { try { nivSaet(n); } catch (e) { set.niv = n; } brugFor('fuld1', true); }, niv); await side.waitForTimeout(800);
      const faner = await side.evaluate(() => FG.lyd.faner);
      for (const [id, navn] of faner) {
        const synlig = await side.evaluate(n => { const k = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === n); if (k) k.click(); return !!k; }, navn);
        if (!synlig) continue;
        await side.waitForTimeout(900);
        const r = await side.evaluate(id => { const w = document.getElementById(id), wb = w.querySelector(':scope > .wb') || w.querySelector('.wb'); let rul = null;
          for (let e = wb; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (/(auto|scroll)/.test(c.overflowY) && e.scrollHeight > e.clientHeight + 2) { rul = e; break; } }
          const høj = wb.scrollHeight > wb.clientHeight + 2; if (rul) rul.dataset.rultest = '1'; const q = wb.getBoundingClientRect(); return { høj, rul: !!rul, top: rul ? rul.scrollTop : 0, x: q.left + q.width / 2, y: q.top + Math.min(q.height / 2, 80), indhold: wb.scrollHeight, synligt: wb.clientHeight }; }, id);
        let flyttet = false;
        if (r.rul) { await side.mouse.move(r.x, r.y); await side.mouse.wheel(0, 400); await side.waitForTimeout(400); flyttet = await side.evaluate(t0 => { const e = document.querySelector('[data-rultest="1"]'); const ok = e && e.scrollTop > t0; if (e) delete e.dataset.rultest; return ok; }, r.top); }
        T.tjek(!r.høj || (r.rul && flyttet), `Niveau ${niv} · ${navn}: indhold ${r.indhold} px, synligt ${r.synligt} px` + (r.høj ? ', musehjulet ruller' : ', ikke højere end fanen'), r.rul ? 'musehjulet flyttede intet' : 'intet ruller, så resten er skåret af');
      }
      await side.close();
    }
    const html = fs.readFileSync(fil, 'utf8'), v = versionFraNavn(fil);
    const nyt = (html.match(/<b>Nyt i v[^<]*<\/b>[^]*?De forrige:([^]*?)<\/div>/) || [])[1] || '';
    T.tjek(html.includes(`<b>Nyt i v${v}:</b>`) && /v9\.17/.test(nyt) && /v9\.16/.test(nyt), `"Nyt i v${v}" øverst i manualen, og v9.17 og v9.16 står blandt de forrige`);
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
