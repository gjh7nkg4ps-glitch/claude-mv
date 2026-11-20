/* Trin 4 · Det nye i v9.108 (PS2): hylden Effekter i Biblioteket. Ved 1920 × 1080 og 2560 × 1440 med Pigernes show: hylden (rigtigt klik) viser 19 kort i grupper;
   kortet Lys-puls (rigtigt klik) viser status og regel-sæt, der kun passer til Lys-puls (fx "Lys-puls på kick"); Brug på et sæt (rigtigt klik) lægger reglen på (kick → puls)
   og viser effekten; Ctrl+Z tager den af i ét trin; Skjul på scenen sætter scene.ne.eff; Lav en kopi giver et Mit sæt (set.ne.effSaet); Gem som regel-sæt gemmer effektens
   regler; figurernes kort viser ikke effekt-sæt; klik på effektens navn i På scenen åbner kortet. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Hylden Effekter'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('95 · Hylden Effekter (PS2) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const klik = async (sel) => { const p = await side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'nearest' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width } }, sel); if (!p || !p.w) throw new Error('kan ikke klikke på ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
      await side.evaluate(() => { brugFor('piger_show', true); bibVis('shows') }); await side.waitForTimeout(1500);
      await klik('#bib [data-bibh="effekter"]');
      const m0 = await side.evaluate(() => ({ hylde: BIB.hylde, kort: document.querySelectorAll('#bib .bib-k[data-bib^="e:"]').length, grupper: [...document.querySelectorAll('#bib .bib-kort h4')].map(x => x.textContent), info: document.querySelector('#bib .bib-info').textContent, foerste: (document.querySelector('#bib .bib-k[data-bib^="e:"] b') || {}).textContent, canvas: !!document.querySelector('#bib .bib-k[data-bib="e:puls"] canvas') }));
      T.tjek(m0.hylde === 'effekter' && m0.kort === 19 && m0.grupper.length >= 3 && /19 effekter · \d+ regel-sæt/.test(m0.info) && m0.canvas, `${w} × ${h}: hylden Effekter (rigtigt klik) viser 19 kort i grupperne ${m0.grupper.join(', ')} (${m0.info})`, JSON.stringify(m0));
      await klik('#bib .bib-k[data-bib="e:puls"]');
      const d = await side.evaluate(() => { const det = document.getElementById('bib-det'); return { valgt: BIB.valgt, tekst: det.textContent.slice(0, 200), saet: [...det.querySelectorAll('.bib-s b')].map(x => x.textContent), knapper: [...det.querySelectorAll('[data-biba]')].map(b => b.dataset.biba), regler: maps.length } });
      T.tjek(d.valgt === 'e:puls' && d.saet.length >= 2 && d.saet.every(s => /^Lys-puls på /.test(s)) && d.knapper.includes('effvis') && d.knapper.includes('efffra') && d.knapper.includes('effsaetbrug') && /hele billedet/.test(d.tekst), `kortet Lys-puls viser status og ${d.saet.length} regel-sæt, der alle hedder "Lys-puls på …" (valg C)`, JSON.stringify(d));
      /* Brug på "Lys-puls på kick" */
      const foer = await side.evaluate(() => ({ n: maps.length, puls: maps.filter(m => m.effect === 'puls' && m.band === 'kick').length }));
      await klik('#bib-det [data-biba="effsaetbrug"][data-s="e:std:0"]');
      const ef = await side.evaluate(() => ({ n: maps.length, puls: maps.filter(m => m.effect === 'puls' && m.band === 'kick').length, skjult: !!(scene.ne.eff && scene.ne.eff.puls && scene.ne.eff.puls.skjult), status: document.getElementById('status').textContent }));
      T.tjek(ef.n === foer.n + 1 && ef.puls === foer.puls + 1 && !ef.skjult && /lagt på Lys-puls/.test(ef.status), `Brug på "Lys-puls på kick" (rigtigt klik) lægger reglen kick → Lys-puls på (${foer.n} → ${ef.n} regler)`, JSON.stringify({ foer, ef }));
      await side.waitForTimeout(1500); await side.evaluate(() => document.body.focus()); await side.keyboard.press('Control+z'); await side.waitForTimeout(1200);
      const uz = await side.evaluate(() => ({ n: maps.length }));
      T.tjek(uz.n === foer.n, `Ctrl+Z tager reglen af igen (${uz.n} regler)`, JSON.stringify(uz));
      /* Skjul på scenen, Slå fra */
      await klik('#bib-det [data-biba="effvis"]');
      const sk = await side.evaluate(() => ({ skjult: !!(scene.ne.eff && scene.ne.eff.puls && scene.ne.eff.puls.skjult), knap: document.querySelector('#bib-det [data-biba="effvis"]').textContent, raekke: !!document.querySelector('#fg34 [data-pseff="puls"].ps-af') }));
      await klik('#bib-det [data-biba="effvis"]');
      const sk2 = await side.evaluate(() => ({ eff: JSON.stringify(scene.ne.eff || {}) }));
      T.tjek(sk.skjult && /Brug: vis på scenen/.test(sk.knap) && sk2.eff === '{}', 'Skjul på scenen (rigtigt klik) sætter øjet, knappen bliver til Brug: vis på scenen, og et klik igen viser effekten', JSON.stringify({ sk, sk2 }));
      /* Lav en kopi → Mit sæt; Gem som regel-sæt */
      await klik('#bib-det [data-biba="effsaetkopi"][data-s="e:std:0"]');
      const ko = await side.evaluate(() => ({ mine: (set.ne.effSaet || []).map(s => s.navn + '|' + s.eff), gemt: ((JSON.parse(localStorage.getItem('rytme-set')).ne || {}).effSaet || []).length, vist: [...document.querySelectorAll('#bib-det .bib-s b')].map(x => x.textContent) }));
      T.tjek(ko.mine.length === 1 && ko.mine[0] === 'Lys-puls på kick (kopi)|puls' && ko.gemt === 1 && ko.vist.includes('Lys-puls på kick (kopi)'), 'Lav en kopi (rigtigt klik) giver et Mit regel-sæt til Lys-puls, gemt i indstillingerne og vist på kortet', JSON.stringify(ko));
      await klik('#bib-det [data-biba="effsaetbrug"][data-s="e:std:0"]'); /* en regel på Lys-puls igen, så der er noget at gemme */
      await klik('#bib-det [data-biba="effgem"]');
      const gm = await side.evaluate(() => ({ mine: (set.ne.effSaet || []).map(s => s.navn), regler: (set.ne.effSaet || []).slice(-1)[0].regler.length, puls: maps.filter(m => m.effect === 'puls').length }));
      T.tjek(gm.mine.length === 2 && /^Lys-puls \(mine \d+\)$/.test(gm.mine[1]) && gm.regler === gm.puls && gm.puls >= 1, `Gem som regel-sæt gemmer Lys-puls' ${gm.puls} regler som "${gm.mine[1]}"`, JSON.stringify(gm));
      /* valg C: figurernes kort viser ikke effekt-sæt; effekt-kort viser ikke figur-sæt */
      await klik('#bib [data-bibh="figurer"]'); await klik('#bib .bib-k[data-bib="g:danser"]');
      const vc = await side.evaluate(() => ({ saet: [...document.querySelectorAll('#bib-det .bib-s b')].map(x => x.textContent) }));
      T.tjek(vc.saet.length > 0 && !vc.saet.some(s => /^Lys-puls|\(kopi\)|\(mine/.test(s)), `danserens kort viser ${vc.saet.length} regel-sæt og ingen effekt-sæt`, JSON.stringify(vc));
      /* fra På scenen til kortet */
      await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200);
      await side.evaluate(() => { document.querySelector('#fg34 .ps-afsnit[data-ps="eff"]').open = true }); await side.waitForTimeout(200);
      await klik('#fg34 [data-psbib="glod"]'); await side.waitForTimeout(800);
      const ps = await side.evaluate(() => ({ lay: set.lay3, hylde: BIB.hylde, valgt: BIB.valgt, w36: !!document.getElementById('w36') && !document.getElementById('w36').hidden, navn: (document.querySelector('#bib-det .bib-dt b') || {}).textContent }));
      T.tjek(ps.lay === 'ao-regler' && ps.hylde === 'effekter' && ps.valgt === 'e:glod' && ps.w36 && ps.navn === 'Glød', 'klik på Glød i På scenen (rigtigt klik) åbner 3 · Regler med Biblioteket på kortet Glød', JSON.stringify(ps));
      if (w === 2560) { await side.screenshot({ path: path.join(UD, 'hylden-effekter.png') }); }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
