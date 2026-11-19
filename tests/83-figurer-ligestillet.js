/* Trin 4 · Det nye i v9.88 (pakke 7, B4): alle figurer ligestillet. Ved tre skærmstørrelser (rigtige klik): + Ny figur → danser lægger en danser på
   scenen uden regler; Biblioteket → Figurer → Discokugle → Brug: læg på scenen giver en discokugle uden regler; Dansemapping (danserens standard) står
   som Indbygget regel-sæt hos danseren, og Brug lægger 11 regler på danseren (Ctrl+Z tager dem af i ét trin); Morgenstjerne fra + Ny figur kommer uden
   regler; knappen Tilføj morgenstjerne findes ikke; de indbyggede shows er uændrede (Pigernes show har stadig sine regler). */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Figurer ligestillet');
  console.log('83 · Alle figurer ligestillet (v9.88) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push(m.text()) });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); bygSelv(); await vent(300); lay3Anvend('ao-scene'); await vent(1500); });
      /* + Ny figur → danser (rigtigt klik) */
      await side.click('#fg34-ny'); await side.waitForTimeout(300); await side.click('#fg34 [data-op="danser"]'); await side.waitForTimeout(800);
      const a = await side.evaluate(() => ({ danser: fase2.objekter.filter(o => o.lag[0].form === 'danser').length, regler: maps.filter(m => /^obj:/.test(m.effect)).length, status: document.getElementById('status').textContent, addms: !!document.getElementById('addms') }));
      T.tjek(a.danser === 1 && a.regler === 0 && /uden regler/.test(a.status) && !a.addms, `${w} × ${h}: + Ny figur → danser lægger en danser på scenen uden regler ("${a.status.slice(0, 60)}…"); Tilføj morgenstjerne findes ikke`, JSON.stringify(a));
      /* Biblioteket: discokugle uden regler; Dansemapping hos danseren */
      await side.click('#lay3 [data-lay3="ao-regler"]'); await side.waitForTimeout(1800);
      await side.click('#bib [data-bibh="figurer"]'); await side.waitForTimeout(400); await side.click('#bib .bib-k[data-bib="g:diskokugle"]'); await side.waitForTimeout(400); await side.click('#bib-det [data-biba="brug"]'); await side.waitForTimeout(800);
      const b = await side.evaluate(() => ({ kugle: fase2.objekter.filter(o => o.lag[0].form === 'discokugle').length, regler: maps.filter(m => /^obj:/.test(m.effect)).length }));
      T.tjek(b.kugle === 1 && b.regler === 0, `${w} × ${h}: Biblioteket → Discokugle → Brug: læg på scenen giver en discokugle uden regler`, JSON.stringify(b));
      await side.click('#bib .bib-k[data-bib="g:danser"]'); await side.waitForTimeout(500);
      const c = await side.evaluate(() => ({ saet: [...document.querySelectorAll('#bib .bib-s')].map(s => ({ navn: s.querySelector('b').textContent, ind: !!s.querySelector('.bib-m-ind'), faelles: !!s.querySelector('.bib-m-faelles') })) }));
      const dm = c.saet.find(s => /Dansemapping/.test(s.navn));
      T.tjek(!!dm && dm.ind && !dm.faelles && c.saet.findIndex(s => /Dansemapping/.test(s.navn)) < c.saet.findIndex(s => s.faelles), `${w} × ${h}: Dansemapping (danserens standard) står som Indbygget regel-sæt hos danseren, før de fælles (${c.saet.map(s => s.navn).join(', ')})`, JSON.stringify(c));
      const n0 = await side.evaluate(() => maps.length);
      await side.evaluate(() => { const s = [...document.querySelectorAll('#bib .bib-s')].find(s => /Dansemapping/.test(s.querySelector('b').textContent)); s.querySelector('[data-biba="saetbrug"]').scrollIntoView({ block: 'center' }) });
      const kn = await side.evaluate(() => { const s = [...document.querySelectorAll('#bib .bib-s')].find(s => /Dansemapping/.test(s.querySelector('b').textContent)); const q = s.querySelector('[data-biba="saetbrug"]').getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.click(kn.x, kn.y); await side.waitForTimeout(1300);
      const d = await side.evaluate(() => ({ n: maps.length, dans: maps.filter(m => /^obj:.*:d[A-Z]/.test(m.effect)).length, kilder: [...new Set(maps.filter(m => /^obj:/.test(m.effect)).map(m => m.band))].sort().join(','), hvem: !!document.getElementById('bib-hvem') }));
      await side.keyboard.press('Control+z'); await side.waitForTimeout(900);
      const d2 = await side.evaluate(() => maps.length);
      T.tjek(!d.hvem && d.n === n0 + 11 && d.dans === 11 && /kick/.test(d.kilder) && /vokal/.test(d.kilder) && d2 === n0, `${w} × ${h}: Brug på Dansemapping lægger 11 regler på danseren (${n0} → ${d.n}; kilder ${d.kilder}); Ctrl+Z tager dem af i ét trin (${d2})`, JSON.stringify({ d, n0, d2 }));
      /* Morgenstjerne fra + Ny figur: uden regler; de indbyggede shows er uændrede */
      const e = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); lay3Anvend('ao-scene'); await vent(1200); document.getElementById('fg34-ny').click(); await vent(200); document.querySelector('#fg34 [data-op="morgenstjerne"]').click(); await vent(600); const ms = fase2.objekter.find(o => o.id === 'ms'); const msRegler = maps.filter(m => /^obj:ms:/.test(m.effect)).length;
        const show = FORINDST.find(f => f.id === 'piger_show').lav(); return { ms: !!ms, msRegler, showRegler: show.maps.length, showDans: show.maps.filter(m => /:d[A-Z]/.test(m.effect)).length } });
      T.tjek(e.ms && e.msRegler === 0 && e.showRegler >= 30 && e.showDans >= 10, `${w} × ${h}: Morgenstjernen fra + Ny figur kommer uden regler; Pigernes show har stadig sine ${e.showRegler} regler (${e.showDans} til danserne)`, JSON.stringify(e));
      if (w === 1920) { await side.evaluate(async () => { lay3Anvend('ao-regler'); await new Promise(r => setTimeout(r, 1500)); bibVis('figurer'); bibVaelg('g:danser'); }); await side.waitForTimeout(800); await side.screenshot({ path: path.join(__dirname, 'ud', 'v9_88-dansemapping.png') }).catch(() => { }); }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
