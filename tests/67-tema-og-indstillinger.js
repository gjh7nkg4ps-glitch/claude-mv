/* Trin 4 · Det nye i v9.72 (trin 5c): ét tema i hele programmet, Størrelse, og Indstillinger samlet ét sted.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160: Warm Analog er standard (html.tema-warm; programmets baggrund og tekst følger temaet);
   med rigtige klik: ☰ Mere → ⚙ Indstillinger åbner dialogen med Visning og Ydelse; Mere har ingen sektion Lyd og ydelse; Størrelse Stor giver
   zoom 1,15, et rigtigt klik på 2 · Scene rammer stadig, og Live preview får flere punkter; Mørkt giver det gamle blå tema tilbage;
   Linjer i Node-editoren skifter NE14, og kontrolpanelets gamle Linjer-linje er skjult. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Tema og Indstillinger');
  console.log('67 · Ét tema, Størrelse og Indstillinger (5c) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(5000);
      const klik = async sel => { const p = await side.evaluate(sel => { const q = document.querySelector(sel).getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
      const r = await side.evaluate(() => ({ tema: set.theme, warm: document.documentElement.classList.contains('tema-warm'), bg: getComputedStyle(document.body).backgroundColor, ink: getComputedStyle(document.body).color, tbBg: getComputedStyle(document.getElementById('tb')).backgroundImage.includes('255, 138, 0') || getComputedStyle(document.getElementById('tb')).backgroundImage.includes('rgb(42, 15, 10)'), mereSek: [...document.querySelectorAll('#mere-pan .mere-sek h4')].map(x => x.textContent).join(' · '), ne14Skjult: getComputedStyle(document.querySelector('.ne14-linje') || document.createElement('i')).display === 'none' || !document.querySelector('.ne14-linje'), zoom: document.body.style.zoom || '' }));
      T.tjek(r.tema === 'warm' && r.warm && r.bg === 'rgb(11, 6, 6)' && r.ink === 'rgb(255, 217, 200)' && r.tbBg, `${w} × ${h}: Warm Analog er standard i hele programmet (baggrund ${r.bg}, tekst ${r.ink}, topbjælken i temaets farver)`, JSON.stringify(r));
      T.tjek(/Vis · Vinduer · Indstillinger · Opsætninger · Hjælp/.test(r.mereSek) && !/Lyd og ydelse/.test(r.mereSek) && r.ne14Skjult && r.zoom === '', `${w} × ${h}: Mere har sektionerne ${r.mereSek} (ingen Lyd og ydelse); kontrolpanelets Linjer-linje er skjult; Størrelse er Normal`, JSON.stringify(r));
      if (w === 1920) {
        /* Indstillinger åbnes fra Mere */
        await klik('#el9-mere'); await klik('#sbtn');
        const d = await side.evaluate(() => { const sd = document.getElementById('sd'); const ids = q => [...sd.querySelectorAll(q)].map(x => x.id || x.textContent.trim()); return { open: sd.open, mereLukket: document.getElementById('mere-pan').hidden, visning: ids('#sd-visning select,#sd-visning button'), ydelse: ids('#sd-ydelse select,#sd-ydelse input,#sd-ydelse button'), linjer: document.getElementById('s-linjer') && document.getElementById('s-linjer').value, synlig: document.getElementById('s-stoer').getBoundingClientRect().width > 0 } });
        T.tjek(d.open && d.mereLukket && d.synlig && d.visning.join(',') === 's-theme,s-stoer,tb-skarp,fx-knap,tb-dock,s-linjer,s-felt,s-fps' && d.ydelse.join(',') === 'tb-kval,tb-reg,Kør måletest' && d.linjer === 'auto', `☰ Mere → ⚙ Indstillinger (rigtige klik) åbner dialogen med Visning (${d.visning.join(', ')}) og Ydelse (${d.ydelse.join(', ')})`, JSON.stringify(d));
        /* Størrelse: Stor (Live preview skal kunne ses, så 2 · Scene først) */
        await side.keyboard.press('Escape'); await side.waitForTimeout(300); await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1500);
        const pv0 = await side.evaluate(() => document.getElementById('pv').width);
        await klik('#el9-mere'); await klik('#sbtn'); await side.selectOption('#s-stoer', 'stor'); await side.waitForTimeout(1500);
        const z = await side.evaluate(() => ({ zoom: document.body.style.zoom, gemt: JSON.parse(localStorage.getItem('rytme-set')).stoerrelse, pv: document.getElementById('pv').width, ws: document.getElementById('ws').getBoundingClientRect().toJSON() }));
        await side.keyboard.press('Escape'); await side.waitForTimeout(300); await klik('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(800); await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200);
        const z2 = await side.evaluate(() => ({ lay: set.lay3, zoner: [...document.querySelectorAll('.dk-zone')].filter(x => !x.hidden).map(x => { const q = x.getBoundingClientRect(); return [Math.round(q.right), Math.round(q.bottom)] }) }));
        T.tjek(z.zoom === '1.15' && z.gemt === 'stor' && Math.abs(z.pv - pv0) < pv0 * .03 && Math.round(z.ws.right) === 1920 && Math.round(z.ws.bottom) === 1080 && z2.lay === 'ao-scene' && z2.zoner.every(([r, b]) => r <= 1921 && b <= 1081), `Størrelse Stor: zoom ${z.zoom} (huskes), Live preview beholder sine punkter og er stadig skarp (${pv0} → ${z.pv}), arbejdsfladen passer stadig til skærmen, og rigtige klik på 1 · Sang og 2 · Scene rammer (zonerne inden for skærmen)`, JSON.stringify({ z, z2, pv0 }));
        await side.evaluate(() => { set.stoerrelse = 'normal'; applySet() }); await side.waitForTimeout(400);
        /* Mørkt tema */
        await klik('#el9-mere'); await klik('#sbtn'); await side.selectOption('#s-theme', 'dark'); await side.waitForTimeout(400);
        const m = await side.evaluate(() => ({ warm: document.documentElement.classList.contains('tema-warm'), bg: getComputedStyle(document.body).backgroundColor, gemt: JSON.parse(localStorage.getItem('rytme-set')).theme }));
        await side.selectOption('#s-theme', 'warm'); await side.waitForTimeout(300);
        const m2 = await side.evaluate(() => getComputedStyle(document.body).backgroundColor);
        T.tjek(!m.warm && m.bg === 'rgb(7, 11, 26)' && m.gemt === 'dark' && m2 === 'rgb(11, 6, 6)', `Mørkt (blåt) kan vælges (${m.bg}, huskes), og Warm Analog kommer tilbage (${m2})`, JSON.stringify({ m, m2 }));
        /* Linjer i Node-editoren */
        await side.selectOption('#s-linjer', '2d'); await side.waitForTimeout(500);
        const l = await side.evaluate(() => ({ valg: NE14.valg, gemt: set.ne && set.ne.linjer }));
        await side.selectOption('#s-linjer', 'auto'); await side.waitForTimeout(400);
        const l2 = await side.evaluate(() => ({ valg: NE14.valg, gemt: set.ne && set.ne.linjer }));
        T.tjek(l.valg === '2d' && l.gemt === '2d' && l2.valg === 'auto' && l2.gemt === undefined, 'Linjer i Node-editoren: Enkle (Canvas 2D) og Glød (TSL) vælges i Indstillinger (NE14.valg og set.ne.linjer følger med)', JSON.stringify({ l, l2 }));
        await side.keyboard.press('Escape');
      }
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
