/* Trin 4 · Det nye i v9.86 (pakke 7, B2): startskærmen og linjen Indlæst. Ved tre skærmstørrelser (startskærmen slås til i testbrowseren med set.startSkTest):
   startskærmen står åben ved start med Fortsæt (fremhævet, har fokus), Start et show og Byg selv; et rigtigt klik på Fortsæt lukker den, og intet er ændret;
   linjen øverst viser Indlæst: … · n figurer · n regler; Startskærm fra Ctrl+K → Start et show viser de 10 shows og Mine → Pigernes show indlæses, og Indlæst
   viser navnet; gem som et Mit show, ændr en regel → "· ændret" og browseren vil spørge før lukning (beforeunload); hent igen → ikke ændret; Byg selv → Tomt
   (0 figurer, 0 regler, klodsbane fra) og ingen beforeunload; Esc lukker som Fortsæt; linjen øverst ruller ikke. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Startskærm');
  console.log('81 · Startskærm og Indlæst (v9.86) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push(m.text()) });
      await side.addInitScript(() => { try { const s = JSON.parse(localStorage.getItem('rytme-set') || '{}'); s.startSkTest = 1; localStorage.setItem('rytme-set', JSON.stringify(s)) } catch (e) { } });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const a = await side.evaluate(() => { const d = document.getElementById('start-sk'); return { open: !!(d && d.open), knapper: [...d.querySelectorAll('.start-k b')].map(b => b.textContent), fokus: document.activeElement && document.activeElement.id, frem: !!d.querySelector('#start-fortsaet.start-frem'), sub: document.getElementById('start-fortsaet-s').textContent, indl: document.getElementById('el9-indl').textContent, n0: maps.length, o0: fase2.objekter.length } });
      T.tjek(a.open && a.knapper.join('|') === 'Fortsæt, hvor du slap|Start et show|Byg selv' && a.fokus === 'start-fortsaet' && a.frem, `${w} × ${h}: startskærmen står åben med Fortsæt (fremhævet, fokus), Start et show og Byg selv (${a.knapper.join(' · ')})`, JSON.stringify(a));
      await side.click('#start-fortsaet'); await side.waitForTimeout(400);
      const b = await side.evaluate(() => ({ open: document.getElementById('start-sk').open, n: maps.length, o: fase2.objekter.length, indl: document.getElementById('el9-indl').textContent }));
      T.tjek(!b.open && b.n === a.n0 && b.o === a.o0 && /^Indlæst: .+ · \d+ figur(er)? · \d+ regler?$/.test(b.indl), `${w} × ${h}: Fortsæt lukker uden at ændre noget; linjen øverst: "${b.indl}"`, JSON.stringify(b));
      /* Startskærm igen → Start et show → Pigernes show */
      await side.evaluate(() => startSkVis(true)); await side.waitForTimeout(300); await side.click('#start-show'); await side.waitForTimeout(1800);
      /* v9.87: Start et show åbner Biblioteket (hylden Shows) i 3 · Regler */
      const c = await side.evaluate(() => ({ open: document.getElementById('start-sk').open, lay: set.lay3, bib: !document.getElementById('w36').hidden, hylde: BIB.hylde, kort: [...document.querySelectorAll('#bib .bib-k')].map(b => b.dataset.bib), grupper: [...document.querySelectorAll('#bib .bib-kort h4')].map(x => x.textContent) }));
      T.tjek(!c.open && c.lay === 'ao-regler' && c.bib && c.hylde === 'shows' && c.kort.filter(x => x.startsWith('s:f:')).length === 7 /* v9.97 */ && c.grupper.includes('Figur-shows'), `${w} × ${h}: Start et show åbner Biblioteket med de 10 shows i grupper (${c.grupper.join(', ')})`, JSON.stringify(c));
      await side.click('#bib .bib-k[data-bib="s:f:piger_show"]'); await side.waitForTimeout(400); await side.click('#bib-det [data-biba="brug"]'); await side.waitForTimeout(800);
      const d = await side.evaluate(() => ({ open: document.getElementById('start-sk').open, indl: document.getElementById('el9-indl').textContent, aktiv: active, fig: fase2.objekter.filter(o => o.synlig !== false).length, n: maps.length }));
      T.tjek(!d.open && d.aktiv === 'f:piger_show' && d.indl === `Indlæst: Pigernes show · ${d.fig} figurer · ${d.n} regler`, `${w} × ${h}: Pigernes show er indlæst fra Biblioteket (Brug): "${d.indl}"`, JSON.stringify(d));
      /* Mine: gem som nyt show "Min test" (v9.87: Mine er en liste i Biblioteket), ændr → ændret + beforeunload; hent → ikke ændret */
      const e = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const x = bibGemShow('Min test', null); window.__mit = x.id; await vent(700); const t0 = document.getElementById('el9-indl').textContent, bu0 = (() => { const ev = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(ev); return ev.defaultPrevented })();
        Regler.retNr(0, { gain: 1.37 }); await vent(800); const t1 = document.getElementById('el9-indl').textContent, bu1 = (() => { const ev = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(ev); return ev.defaultPrevented })(), kl = document.getElementById('el9-indl').className;
        bibHent(window.__mit); await vent(800); const t2 = document.getElementById('el9-indl').textContent, bu2 = (() => { const ev = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(ev); return ev.defaultPrevented })();
        return { t0, bu0, t1, bu1, kl, t2, bu2 } });
      T.tjek(/^Indlæst: Min test · \d+ figurer · \d+ regler$/.test(e.t0) && !e.bu0 && /· ændret$/.test(e.t1) && e.bu1 && /indl-aendret/.test(e.kl) && !/ændret/.test(e.t2) && !e.bu2, `${w} × ${h}: gemt som Mit show: "${e.t0}"; efter en ændring: "${e.t1}" (browseren spørger før lukning); hentet igen: "${e.t2}" (ingen spørgsmål)`, JSON.stringify(e));
      /* Byg selv → Tomt; Esc = Fortsæt */
      await side.evaluate(() => startSkVis(true)); await side.waitForTimeout(300); await side.click('#start-byg'); await side.waitForTimeout(800);
      const f = await side.evaluate(() => ({ open: document.getElementById('start-sk').open, indl: document.getElementById('el9-indl').textContent, n: maps.length, fig: fase2.objekter.filter(o => o.synlig !== false).length, bane: scene.bane, bu: (() => { const ev = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(ev); return ev.defaultPrevented })() }));
      T.tjek(!f.open && f.indl === 'Indlæst: Tomt' && f.n === 0 && f.fig === 0 && f.bane === false && !f.bu, `${w} × ${h}: Byg selv giver "${f.indl}" (0 regler, 0 figurer på scenen, klodsbanen fra), ingen spørgsmål før lukning`, JSON.stringify(f));
      await side.evaluate(() => startSkVis(true)); await side.waitForTimeout(300); await side.keyboard.press('Escape'); await side.waitForTimeout(300);
      const g = await side.evaluate(() => { const tbm = document.querySelector('#tb .tbm'); return { open: document.getElementById('start-sk').open, ruller: tbm.scrollWidth > tbm.clientWidth + 1, n: maps.length } });
      T.tjek(!g.open && !g.ruller && g.n === 0, `${w} × ${h}: Esc lukker startskærmen som Fortsæt; linjen øverst ruller ikke`, JSON.stringify(g));
      if (w === 1920) { await side.evaluate(() => { brugFor('piger_show', true); startSkVis(true) }); await side.waitForTimeout(600); await side.screenshot({ path: path.join(__dirname, 'ud', 'v9_86-startskaerm.png') }).catch(() => { }); await side.keyboard.press('Escape'); }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
