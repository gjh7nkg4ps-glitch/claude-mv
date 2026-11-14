/* Trin 4 · Det nye i v9.44: ét Fortryd for alt (fase 1, trin 2, i P8.2; det samme som P7.7 punkt 3a).
   Ctrl+Z fortryder nu også trim, en effekt-gruppes styrke, øje og Slå fra, Samlet styrke og Normalisering; Gentag gør det om igen.
   Reglerne og deres id'er er urørte af det. At åbne et kontrolpanel uden at ændre noget giver ikke et Fortryd-skridt. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Fortryd for alt');
  console.log('39 · Fortryd for alt · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 2500)); });
    const ro = () => side.waitForTimeout(1700); /* historikken gemmer et skridt, når en ændring har stået stille i cirka 0,8 s */
    const prøv = async (navn, gør, læs) => { const før = await side.evaluate(læs); await side.evaluate(gør); await ro(); const efter = await side.evaluate(læs); await side.evaluate(() => feFortryd()); await side.waitForTimeout(300); const fortrudt = await side.evaluate(læs); await side.evaluate(() => feGentag()); await side.waitForTimeout(300); const gentaget = await side.evaluate(læs); await side.evaluate(() => feFortryd()); await ro();
      T.tjek(efter !== før && fortrudt === før && gentaget === efter, `${navn}: ${før} → ${efter}; Fortryd giver ${fortrudt}; Gentag giver ${gentaget}`); };
    const ids0 = await side.evaluate(() => maps.map(m => m.id).join());
    await prøv('Trim på Kick', () => neSaetTrim('kick', 6, true), () => String(neTrimDb('kick')));
    const grp = await side.evaluate(() => { const n = [...NE2.N.values()].find(x => x.kol === 'figur' && x.gruppe); return n.key; });
    await side.evaluate(k => { window.__g = k }, grp);
    await prøv('Effekt-gruppens styrke', () => neSaetFigStyrke(window.__g, .5, true), () => String(neFigStyrke(window.__g)));
    await prøv('Effekt-gruppens Slå fra', () => neSaetFra(window.__g, true), () => String(!!(ne12Grp()[window.__g.slice(2)] || {}).fra));
    await prøv('Effekt-gruppens øje', () => neSaetOeje(window.__g, false), () => String(!!(ne12Grp()[window.__g.slice(2)] || {}).skjult));
    await prøv('Samlet styrke', () => { const s = document.getElementById('ne-master'); s.value = 1.5; s.dispatchEvent(new Event('input', { bubbles: true })) }, () => gmaster + ' (skyder ' + document.getElementById('ne-master').value + ', Radial Mesh ' + document.getElementById('mmaster').value + ')');
    await prøv('Normalisering', () => document.querySelector('#ne [data-ne4="norm"][data-v="fast"]').click(), () => mode + ' ("' + document.getElementById('norm').textContent + '")');
    const slut = await side.evaluate(async ids0 => { const u0 = FEH.u.length; neVaelg([...NE2.N.values()].find(x => x.kol === 'lydtraek').key); await new Promise(r => setTimeout(r, 1700)); neVaelg(null); await new Promise(r => setTimeout(r, 1700));
      neSaetTrim('bas', -3, true); const knap = !!document.querySelector('#ne-toast [data-ne4="fortryd"]'); await new Promise(r => setTimeout(r, 1700)); document.querySelector('#ne-toast [data-ne4="fortryd"]').click(); await new Promise(r => setTimeout(r, 400));
      return { ids: maps.map(m => m.id).join() === ids0, tomt: FEH.u.length === u0, knap, bas: neTrimDb('bas') }; }, ids0);
    T.tjek(slut.ids, 'reglerne og deres id\'er er de samme efter alle fortrydelserne');
    T.tjek(slut.tomt, 'at vælge en node og se dens kontrolpanel giver ikke et Fortryd-skridt');
    T.tjek(slut.knap && slut.bas === 0, 'beskeden efter et trim har knappen Fortryd, og den fortryder trimmet');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
