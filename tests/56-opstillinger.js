/* Trin 4 · Det nye i v9.61: Node-editorens 6 opstillinger, kolonnenavne der følger zoom og kan trækkes, sikring mod en tom flade, og et klik i matrixen, mens tabellen bygges om.
   - Opstilling ▾ (rigtigt valg i rullelisten): Kolonner, Bred, Luftig, Meget luftig, Kompakt og Kæmpe; ingen noder ligger oven i hinanden.
   - Bred og Kompakt viser alle noder i feltet; Kæmpe fylder feltet ved 10 % zoom; kolonne-opstillingerne fylder bredden.
   - Kolonnenavnene står over deres noder og skalerer med zoom; et træk i et navn flytter hele kolonnen (rigtig mus).
   - Ugyldige tal (NaN) i placering og zoom gør ikke fladen tom; flyttes lærredet helt væk, kommer beskeden med knappen Vis alle noder.
   - Matrixen: bygges tabellen om mellem tryk og slip, markeres cellen alligevel.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med Pigernes show (97 noder). */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Opstillinger');
  console.log('56 · Node-editoren: 6 opstillinger, kolonnenavne og sikring mod en tom flade · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error' || /NaN/.test(x.text())) fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('piger_show', true); await vent(1500); lay3Anvend('noder'); await vent(2500); mxSaet(false, true); await vent(900) });
      const maal = () => side.evaluate(() => { const fl = document.getElementById('ne-flade').getBoundingClientRect(); const E = [...NE2.N.values()].filter(n => n.el); let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, ov = 0; const R = E.map(n => n.el.getBoundingClientRect()); R.forEach(q => { x0 = Math.min(x0, q.left); x1 = Math.max(x1, q.right); y0 = Math.min(y0, q.top); y1 = Math.max(y1, q.bottom) });
        for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) { const a = R[i], c = R[j]; if (a.left < c.right - 1 && c.left < a.right - 1 && a.top < c.bottom - 1 && c.top < a.bottom - 1) ov++ }
        const ses = R.some(q => q.width > 0 && q.right > fl.left && q.left < fl.right && q.bottom > fl.top && q.top < fl.bottom);
        return { z: Math.round(NE.z * 1000) / 1000, n: E.length, fx: Math.round((x1 - x0) / fl.width * 100), fy: Math.round((y1 - y0) / fl.height * 100), inde: x0 >= fl.left - 2 && x1 <= fl.right + 2 && y0 >= fl.top - 2 && y1 <= fl.bottom + 2, ov, ses, valg: (document.getElementById('ne61-opst') || {}).value, opst: set.ne && set.ne.opst, pos: Object.keys(NE.pos || {}).length } });
      /* 1 · rullelisten står i værktøjslinjen med de 6 opstillinger */
      const liste = await side.evaluate(() => { const s = document.getElementById('ne61-opst'); return s ? { vis: s.getBoundingClientRect().width > 30, valg: [...s.options].map(o => o.textContent) } : null });
      T.tjek(!!liste && liste.vis && liste.valg.join('|').startsWith('Opstilling ▾|Kolonner|Bred|Luftig|Meget luftig|Kompakt|Kæmpe'), `${w} × ${h}: rullelisten Opstilling ▾ står i Node-editorens værktøjslinje med de 6 opstillinger`, JSON.stringify(liste));
      /* 2 · hver opstilling, valgt i rullelisten */
      const R = {}; for (const id of ['kolonner', 'luftig', 'megetluftig', 'bred', 'kompakt', 'kaempe']) { await side.selectOption('#ne61-opst', id); await side.waitForTimeout(1100); R[id] = await maal(); }
      const alle = Object.values(R);
      T.tjek(alle.every(r => r.ov === 0 && r.ses && r.pos >= r.n - 1 && r.n > 40), `${w} × ${h}: i alle 6 opstillinger ligger ingen af de ${alle[0].n} noder oven i hinanden, og de kan ses`, JSON.stringify(R));
      T.tjek(R.kolonner.fx >= 85 && R.kolonner.z > .25 && R.luftig.inde && R.megetluftig.inde && R.luftig.fx >= 88 && R.megetluftig.fx >= 88 && R.luftig.fy >= 75 && R.megetluftig.fy >= 75 && R.bred.fy >= 75 && R.megetluftig.z < R.luftig.z && R.luftig.z < R.bred.z, `${w} × ${h}: Kolonner fylder bredden (zoom ${Math.round(R.kolonner.z * 100)} %); Bred, Luftig og Meget luftig er spredt ud over hele feltet (v9.66: Luftig ${R.luftig.fx} % × ${R.luftig.fy} %, Meget luftig ${R.megetluftig.fx} % × ${R.megetluftig.fy} %) med mere luft og mindre zoom for hver (${Math.round(R.bred.z * 100)} %, ${Math.round(R.luftig.z * 100)} %, ${Math.round(R.megetluftig.z * 100)} %)`, JSON.stringify({ k: R.kolonner, l: R.luftig, m: R.megetluftig }));
      T.tjek(!R.bred.inde && R.bred.fx >= 400 && R.bred.fx <= 560 && R.bred.z > .15 && R.kompakt.inde && R.kompakt.fx >= 60, `${w} × ${h}: Bred er fem felter bred (v9.68: ${R.bred.fx} % af feltets bredde, zoom ${Math.round(R.bred.z * 100)} %); Kompakt viser alle noder inde i feltet (zoom ${Math.round(R.kompakt.z * 100)} %)`, JSON.stringify({ b: R.bred, k: R.kompakt }));
      T.tjek(R.kaempe.z === 0.1 && R.kaempe.fx >= 88 && R.kaempe.fy >= 80 && R.kaempe.inde && R.kaempe.valg === 'kaempe' && R.kaempe.opst === 'kaempe', `${w} × ${h}: Kæmpe står på 10 % zoom og fylder feltet (${R.kaempe.fx} % af bredden og ${R.kaempe.fy} % af højden)`, JSON.stringify(R.kaempe));
      /* 3 · kolonnenavnene står over deres noder og følger zoom */
      await side.selectOption('#ne61-opst', 'kompakt'); await side.waitForTimeout(1100);
      const hov = () => side.evaluate(() => { const h = document.querySelector('#ne-hoveder .ne-hoved[data-kol="regel"]'), n = h.querySelector('.ne-hnavn').getBoundingClientRect(), N = [...NE2.N.values()].filter(x => x.el && x.kol === 'regel').map(x => x.el.getBoundingClientRect()); return { top: n.top, hoej: n.height, left: n.left, x0: Math.min(...N.map(q => q.left)), y0: Math.min(...N.map(q => q.top)), z: NE.z, ft: document.getElementById('ne-flade').getBoundingClientRect().top } });
      const h1 = await hov(); await side.evaluate(() => { const fl = document.getElementById('ne-flade'); neZoomOm(fl.clientWidth / 2, fl.clientHeight / 2, 1.8) }); await side.waitForTimeout(500); const h2 = await hov();
      T.tjek(Math.abs(h1.left - h1.x0) < 3 && h1.top < h1.y0 && h1.y0 - h1.top < 140 * h1.z + 4 && Math.abs(h2.left - h2.x0) < 3 && (h2.top < h2.y0 || Math.abs(h2.top - h2.ft) < 14) && Math.abs(h2.hoej / h1.hoej - h2.z / h1.z) < .12, `${w} × ${h}: kolonnenavnet Regel står lige over sine noder (eller øverst i feltet, når kolonnens top er rullet ud), også efter zoom, og er blevet ${(h2.hoej / h1.hoej).toFixed(2).replace('.', ',')} gange større, når zoom er ${(h2.z / h1.z).toFixed(2).replace('.', ',')} gange større`, JSON.stringify({ h1, h2 }));
      /* 4 · træk i et kolonnenavn flytter hele kolonnen (rigtig mus) */
      await side.selectOption('#ne61-opst', 'kompakt'); await side.waitForTimeout(1100);
      const foer = await side.evaluate(() => { const n = document.querySelector('#ne-hoveder .ne-hoved[data-kol="maal"] .ne-hnavn').getBoundingClientRect(); return { x: n.left + 12, y: n.top + n.height / 2, pos: [...NE2.N.values()].filter(x => x.el && x.kol === 'maal').map(x => [x.x, x.y]), andre: [...NE2.N.values()].filter(x => x.el && x.kol === 'regel').map(x => [x.x, x.y]), z: NE.z } });
      await side.mouse.move(foer.x, foer.y); await side.mouse.down(); for (let i = 1; i <= 8; i++) { await side.mouse.move(foer.x + i * 5, foer.y + i * 6); await side.waitForTimeout(25); } await side.mouse.up(); await side.waitForTimeout(700);
      const eft = await side.evaluate(() => ({ pos: [...NE2.N.values()].filter(x => x.el && x.kol === 'maal').map(x => [x.x, x.y]), andre: [...NE2.N.values()].filter(x => x.el && x.kol === 'regel').map(x => [x.x, x.y]), gemt: [...NE2.N.values()].filter(x => x.el && x.kol === 'maal').every(x => NE.pos[x.key] && NE.pos[x.key][0] === x.x) }));
      const dx = eft.pos[0][0] - foer.pos[0][0], dy = eft.pos[0][1] - foer.pos[0][1];
      T.tjek(eft.pos.length === foer.pos.length && eft.pos.every((p, i) => p[0] - foer.pos[i][0] === dx && p[1] - foer.pos[i][1] === dy) && Math.abs(dx - 40 / foer.z) <= 8 && Math.abs(dy - 48 / foer.z) <= 8 && JSON.stringify(eft.andre) === JSON.stringify(foer.andre) && eft.gemt, `${w} × ${h}: et træk 40 × 48 px i kolonnenavnet Mål flytter alle ${eft.pos.length} mål-noder lige meget (${dx} × ${dy} i lærredets mål); de andre kolonner står stille, og pladserne er gemt`, JSON.stringify({ dx, dy, z: foer.z }));
      /* 5 · Placér giver den automatiske opstilling tilbage */
      await side.click('#ne .ne-vlinje [data-ne="placer"]'); await side.waitForTimeout(1000); const p5 = await maal();
      T.tjek(p5.pos === 0 && p5.valg === '' && !p5.opst && p5.ov === 0, `${w} × ${h}: Placér giver den automatiske opstilling tilbage (ingen gemte pladser, rullelisten står på Opstilling ▾)`, JSON.stringify(p5));
      /* 6 · ugyldige tal gør ikke fladen tom */
      const nan = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const K = [...NE2.N.values()].filter(n => n.el).slice(0, 3).map(n => n.key); NE.pos[K[0]] = [NaN, 40]; NE.pos[K[1]] = [null, null]; NE.pos[K[2]] = [undefined, NaN]; NE.z = NaN; NE.x = NaN; NE.tilpas = false; NE2.sig = ''; ne2Byg(); await vent(400); neZoomOm(NaN, 5, NaN); neZoomOm(100, 100, 0); await vent(300);
        const E = [...NE2.N.values()].filter(n => n.el), fl = document.getElementById('ne-flade').getBoundingClientRect(); return { fin: E.every(n => Number.isFinite(n.x) && Number.isFinite(n.y)), z: NE.z, x: NE.x, y: NE.y, tr: document.getElementById('ne-verden').style.transform, ses: E.some(n => { const q = n.el.getBoundingClientRect(); return q.width > 0 && q.right > fl.left && q.left < fl.right && q.bottom > fl.top && q.top < fl.bottom }) } });
      T.tjek(nan.fin && [nan.z, nan.x, nan.y].every(Number.isFinite) && !/NaN/.test(nan.tr) && nan.ses, `${w} × ${h}: med ugyldige tal (NaN) i tre noders plads og i zoom står alle noder stadig på gyldige pladser, og de kan ses`, JSON.stringify(nan));
      /* 7 · flyttes lærredet helt væk, kommer beskeden; Vis alle noder bringer dem tilbage */
      await side.evaluate(() => { NE.tilpas = false; NE.x = -900000; neVis() }); await side.waitForTimeout(1600);
      const b7 = await side.evaluate(() => { const b = document.getElementById('ne61-tom'); return b && !b.hidden ? b.textContent : null });
      await side.click('#ne61-tom [data-ne61="vis"]'); await side.waitForTimeout(1600); const e7 = await maal(), b7b = await side.evaluate(() => { const b = document.getElementById('ne61-tom'); return !!b && !b.hidden });
      T.tjek(/Ingen af de \d+ noder kan ses lige nu/.test(b7 || '') && /Vis alle noder/.test(b7 || '') && e7.ses && !b7b, `${w} × ${h}: når ingen noder kan ses, står beskeden midt i feltet med knapperne Vis alle noder og Stil noderne op igen; et klik på Vis alle noder bringer dem tilbage, og beskeden forsvinder`, JSON.stringify({ b7, ses: e7.ses, b7b }));
      /* 8 · matrixen: tabellen bygges om mellem tryk og slip; cellen markeres alligevel */
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const c = await side.evaluate(() => { const td = document.querySelector('#ne-mx td.mx-har:not(.mx-lukket)'); td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(), id = mxCelleId(td); return { x: r.x + r.width / 2, y: r.y + r.height / 2, k: mxNoegle(id) } });
      await side.keyboard.down(MOD); await side.mouse.move(c.x, c.y); await side.mouse.down(); await side.evaluate(() => { MX.nede = 0; mxByg() }); await side.mouse.up(); await side.keyboard.up(MOD); await side.waitForTimeout(400);
      const m8 = await side.evaluate(k => ({ har: MX.mark.has(k), n: MX.mark.size }), c.k);
      T.tjek(m8.har && m8.n === 1, `${w} × ${h}: bygges matrixens tabel om, mens museknappen er nede, markerer Ctrl + klik cellen alligevel`, JSON.stringify(m8));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl og ingen NaN-linjer i browserens konsol`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
