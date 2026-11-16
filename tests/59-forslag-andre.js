/* Trin 4 · Det nye i v9.64: fase 4, trin 4b: de andre, der skrev regler, giver forslag.
   Auto-kobl, danserens Standardforbindelser, Tilfældigt, skabeloner og Tilføj morgenstjerne ændrer ingen regler; det, de ville lave, står som forslag.
   Figurernes udsving (Fra og Til) ændres ikke, før der siges ja. Random alt: skift automatisk og de ekstra Fortryd-knapper kan ikke ses.
   Knapperne ligger i vinduer, der ikke er åbne i testen, så de trykkes med element.click() (ikke et rigtigt museklik); Ja til alle trykkes med rigtig mus. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Forslag (andre)');
  console.log('59 · Flere knapper giver forslag i stedet for at skrive regler · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 2560, height: 1440 } }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const r = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('piger_show', true); await vent(1500); const ny = nyFigurHer('Ny pige', .8, .6, 'danser'), fri = nyFigurHer('Fri figur', .2, .3, 'cirkel'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
      const ud = {}, R = () => JSON.stringify(maps), r0 = R(), fra = id => FS.liste.filter(f => f.regel.effect.startsWith('obj:' + id + ':')).length, uds = o => JSON.stringify(Object.entries(o.lag[0].egenskaber).map(([k, v]) => [k, v.fra, v.til]));
      const u0 = uds(ny), u1 = uds(fri);
      /* danserens Standardforbindelser (knappen i Editoren) */
      selO = fase2.objekter.indexOf(ny); selL = 0; formUI(); await vent(400); const b1 = document.querySelector('[data-dmk="std"]'); if (b1) b1.click(); await vent(900);
      ud.dans = { knap: !!b1, ens: R() === r0, fs: fra(ny.id), uds: uds(ny) === u0, status: document.getElementById('status').textContent };
      /* Auto-kobl på en anden figur */
      selO = fase2.objekter.indexOf(fri); selL = 0; formUI(); await vent(400); const b2 = document.getElementById('fauto'); if (b2) b2.click(); await vent(900);
      ud.auto = { knap: !!b2, ens: R() === r0, fs: fra(fri.id), uds: uds(fri) === u1 };
      /* Tilfældige slag (Værksted) */
      const f0 = FS.liste.length; document.getElementById('rnd-slag').click(); await vent(900); ud.rnd = { ens: R() === r0, fs: FS.liste.length - f0, status: document.getElementById('status').textContent };
      /* en skabelon på den nye danser: forslagene findes allerede (Standardforbindelser), så de springes over */
      FS.liste = []; const sk = ne11Alle().find(s => { try { return ne11Passer(s, 'f:' + ny.id) } catch (e) { return false } }); if (sk) neBrugSkabelon(sk, 'f:' + ny.id); await vent(900); ud.skab = { navn: sk && sk.navn, ens: R() === r0, fs: fra(ny.id) };
      /* Tilføj morgenstjerne: figuren laves, reglerne bliver forslag */
      const harMs = fase2.objekter.some(o => o.id === 'ms'); const f1 = FS.liste.length; document.getElementById('addms').click(); await vent(1200); ud.ms = { foer: harMs, figur: fase2.objekter.some(o => o.id === 'ms'), ens: R() === r0, fs: FS.liste.length - f1 };
      /* uden for fange-tilstand skriver Regler som før */
      const n0 = maps.length; const idd = Regler.tilfoej({ band: 'kick', effect: 'puls', thr: .5, gain: 1, att: 10, rel: 100, curve: 1, gap: 120 }); ud.normal = { n: maps.length - n0, id: !!idd }; Regler.slet(idd);
      /* det, der er fjernet fra skærmen */
      const ses = id => { const e = document.getElementById(id); return !!e && getComputedStyle(e).display !== 'none' }; const lab = id => { const e = document.getElementById(id), l = e && e.closest('label'); return !!l && getComputedStyle(l).display !== 'none' };
      ud.vaek = { rnd: ses('rnd-fortryd'), fg: ses('fg-fortryd'), show: ses('show-fortryd'), ops: lab('ops-skift'), tb: lab('tb-skift') }; ud.r0n = JSON.parse(r0).length; ud.mx = !!(set.ne && set.ne.mx); ud.celler = document.querySelectorAll('#ne-mx td.mx-forslag').length; ud.fsNu = FS.liste.length; return ud });
    T.tjek(r.dans.knap && r.dans.ens && r.dans.fs >= 8 && r.dans.uds && /Danserens standardforbindelser: \d+ forslag/.test(r.dans.status) && /Ingen regler er ændret/.test(r.dans.status), `danserens Standardforbindelser ændrer ingen regler og giver ${r.dans.fs} forslag; danserens udsving (Fra og Til) er ikke ændret; statuslinjen: "${r.dans.status.slice(0, 110)}…"`, JSON.stringify(r.dans));
    T.tjek(r.auto.knap && r.auto.ens && r.auto.fs >= 1 && r.auto.uds, `Auto-kobl ændrer ingen regler og giver ${r.auto.fs} forslag til figuren; dens udsving er ikke ændret`, JSON.stringify(r.auto));
    T.tjek(r.rnd.ens && /Tilfældige slag: /.test(r.rnd.status) && /Ingen regler er ændret/.test(r.rnd.status), `Tilfældige slag ændrer ingen regler (${r.rnd.fs} nye forslag; resten springes over, fordi målene har regler)`, JSON.stringify(r.rnd));
    T.tjek(!!r.skab.navn && r.skab.ens && r.skab.fs >= 1, `skabelonen "${r.skab.navn}" på den nye danser ændrer ingen regler og giver ${r.skab.fs} forslag`, JSON.stringify(r.skab));
    T.tjek(r.ms.figur && r.ms.ens && (r.ms.foer || r.ms.fs >= 1), `Tilføj morgenstjerne laver figuren, men ingen regler: de ${r.ms.fs} regler står som forslag`, JSON.stringify(r.ms));
    T.tjek(r.normal.n === 1 && r.normal.id, 'uden for forslags-knapperne skriver Regler stadig, som den plejer (en regel lagt til og slettet igen)', JSON.stringify(r.normal));
    T.tjek(!r.vaek.rnd && !r.vaek.fg && !r.vaek.show && !r.vaek.ops && !r.vaek.tb, 'Fortryd tilfældigt, Fortryd figurer, Fortryd sidste show og Random alt: skift automatisk kan ikke ses mere', JSON.stringify(r.vaek));
    /* Ja til alle med rigtig mus: forslagene bliver til regler, og de gamle er der stadig */
    const p = await side.evaluate(() => { if (!mxTil()) mxSaet(true, true); mxByg(); const b = [...document.querySelectorAll('#fs-bj button')].find(x => x.textContent === 'Ja til alle'); if (!b) return null; const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }); await side.waitForTimeout(600);
    if (p) await side.mouse.click(p.x, p.y); await side.waitForTimeout(1500);
    const e = await side.evaluate(n0 => ({ n: maps.length, fs: FS.liste.length, ens: new Set(maps.map(m => m.id)).size === maps.length }), r.r0n);
    T.tjek(!!p && r.celler === r.fsNu && r.fsNu >= 1 && e.n === r.r0n + r.fsNu && e.fs === 0 && e.ens, `forslagene står som ${r.celler} stiplede celler; Ja til alle (rigtigt museklik) laver dem (${r.r0n} → ${e.n} regler)`, JSON.stringify({ celler: r.celler, fsNu: r.fsNu, e }));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
