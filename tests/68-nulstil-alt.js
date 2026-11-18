/* Trin 4 · Det nye i v9.73: Nulstil alt genstarter programmet i startilstanden (brugerens fund 17. november: efter Nulstil alt kunne
   intet i topbjælken trykkes, og Opsætninger stod halvt uden for skærmen; F5 var nødvendigt).
   Ved 1920 × 1080 og 2560 × 1440: gem en plads, skift til 2 · Scene og Mørkt tema, kør Nulstil alt (begge spørgsmål besvares med Ja via knapperne),
   vent på genstarten, og tjek: zoner (docking) findes og ingen frie vinduer, arbejdsområdet er 1 · Sang, docking låst, Warm Analog, pladsen er bevaret,
   beskeden "Alt er nulstillet" vises, og et rigtigt klik på 2 · Scene og 3 · Regler virker. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Nulstil alt');
  console.log('68 · Nulstil alt genstarter programmet (v9.73) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(5000);
      const klik = async sel => { const p = await side.evaluate(sel => { const q = document.querySelector(sel).getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
      /* noget at nulstille: en gemt plads, et andet arbejdsområde, et andet tema, og låsen åben */
      await side.evaluate(() => { fase2.objekter[0].navn = 'Testfigur 68'; slotSave('C'); set.theme = 'dark'; set.laast = false; applySet(); laasGem(); lay3Anvend('ao-scene') }); await side.waitForTimeout(800);
      const før = await side.evaluate(() => ({ lay: set.lay3, tema: set.theme, laast: !!set.laast, plads: !!localStorage.getItem('rytme-C'), antalKeys: Object.keys(localStorage).filter(k => k.startsWith('rytme-')).length }));
      T.tjek(før.lay === 'ao-scene' && før.tema === 'dark' && !før.laast && før.plads, `${w} × ${h}: før nulstilling: 2 · Scene, Mørkt tema, låst op, og Opsætning 3 er gemt (${før.antalKeys} nøgler i localStorage)`, JSON.stringify(før));
      /* Nulstil alt med rigtige klik på de to spørgsmål */
      const genstart = side.waitForEvent('load', { timeout: 20000 });
      await side.evaluate(() => { nulstilAlt() }); await side.waitForTimeout(600);
      const sp1 = await side.evaluate(() => { const b = document.getElementById('bd-ok'); return b && b.getBoundingClientRect().width > 0 ? document.getElementById('bd-t').textContent : null });
      T.tjek(!!sp1, `${w} × ${h}: Nulstil alt spørger først (${sp1})`, JSON.stringify(sp1));
      await klik('#bd-ok'); await side.waitForTimeout(400); await klik('#bd-ok');
      let genstartet = true; try { await genstart } catch (e) { genstartet = false }
      T.tjek(genstartet, `${w} × ${h}: programmet genstarter efter det andet Ja`, '');
      await side.waitForTimeout(5500);
      const efter = await side.evaluate(() => {
        const frie = [...document.querySelectorAll('.win')].filter(x => x.offsetParent && !x.closest('.dk-zone') && getComputedStyle(x).position === 'absolute' && getComputedStyle(x).display !== 'none').map(x => x.id);
        const zoner = [...document.querySelectorAll('.dk-zone')].filter(x => !x.hidden && x.getBoundingClientRect().width > 0).length;
        const ude = [...document.querySelectorAll('.win')].filter(x => { const q = x.getBoundingClientRect(); return q.width > 0 && (q.right > innerWidth + 2 || q.left < -2) }).map(x => x.id);
        const toast = [...document.querySelectorAll('body *')].filter(x => x.children.length === 0 && /Alt er nulstillet/.test(x.textContent || '') && x.getBoundingClientRect().width > 0).length;
        return { lay: set.lay3, tema: set.theme, warm: document.documentElement.classList.contains('tema-warm'), laast: !!set.laast, zoner, frie, ude, plads: !!localStorage.getItem('rytme-C'), pladsGemt: (() => { try { return JSON.parse(localStorage.getItem('rytme-C')).gemt } catch (e) { return '?' } })(), mapping: !!localStorage.getItem('rytme-mapping2'), regler: maps.length, toast, el9: document.body.classList.contains('el9'), lay3Knapper: [...document.querySelectorAll('#lay3 button')].map(b => b.textContent.trim()) };
      });
      T.tjek(efter.lay === 'ao-sang' && efter.zoner >= 1 /* v9.76: 1 · Sang er én zone */ && efter.frie.length === 0 && efter.ude.length === 0 && efter.el9, `${w} × ${h}: efter genstarten: arbejdsområdet 1 · Sang med ${efter.zoner} zoner, ingen frie vinduer og intet vindue uden for skærmen`, JSON.stringify(efter));
      T.tjek(efter.tema === 'warm' && efter.warm && efter.laast && efter.plads && efter.toast > 0, `${w} × ${h}: Warm Analog, docking låst, Opsætning 3 bevaret (gemt ${efter.pladsGemt}), og beskeden "Alt er nulstillet" vises`, JSON.stringify(efter));
      /* topbjælken kan trykkes med rigtige klik */
      await klik('#lay3 [data-lay3="ao-scene"]'); const l2 = await side.evaluate(() => set.lay3);
      await klik('#lay3 [data-lay3="ao-regler"]'); const l3 = await side.evaluate(() => ({ lay: set.lay3, ne: !!(document.getElementById('w33') && document.getElementById('w33').getBoundingClientRect().width > 300) }));
      await klik('#el9-mere'); const mere = await side.evaluate(() => !document.getElementById('mere-pan').hidden); await side.keyboard.press('Escape');
      T.tjek(l2 === 'ao-scene' && l3.lay === 'ao-regler' && l3.ne && mere, `${w} × ${h}: rigtige klik på 2 · Scene, 3 · Regler (Node-editoren vises) og ☰ Mere virker efter nulstillingen`, JSON.stringify({ l2, l3, mere }));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
