/* Trin 4 · Det nye i v9.105 (P8.12): gitter i Node-editoren. Ved 1920 × 1080 og 2560 × 1440 med Pigernes show:
   standard-gitteret (faste kolonner i NE.kol-rækkefølge, lige stor luft vandret, den tætteste kolonne fylder rammens højde, alle noder har en plads i showet,
   set.ne.pos findes ikke mere); to noder trækkes langt ud, og Ret op (rigtigt klik) holder rammen (de yderste kanter) og lægger resten ind i kolonnerne i samme
   rækkefølge; model A (alle kolonner fylder højden) og B (fælles rækker) via listen; Del deler Regel-kolonnen i to stakke, når rammen er for lav; skyderen Lodret 150 %
   strækker rammen fra midten; Ctrl+Z (rigtigt tastetryk) sætter pladserne tilbage; pladser og skydere følger med i en gemt opsætning; Gitter · Kæmpe (4×) giver en ramme cirka 4 × standard. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Gitter'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('92 · Gitter i Node-editoren · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const side = await browser.newPage({ viewport: { width: w, height: h } }); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.evaluate(() => { brugFor('piger_show', true); lay3Anvend('noder') }); await side.waitForTimeout(3000);
      const maal = () => side.evaluate(() => { const N = [...NE2.N.values()].filter(n => n.el); const kol = {}; NE.kol.forEach(c => { const L = N.filter(n => n.kol === c.k); if (!L.length) return; kol[c.k] = { n: L.length, x: Math.min(...L.map(n => n.x)), x1: Math.max(...L.map(n => n.x + n.el.offsetWidth)), xs: [...new Set(L.map(n => n.x))].length, y0: Math.min(...L.map(n => n.y)), y1: Math.max(...L.map(n => n.y + n.el.offsetHeight)), orden: L.slice().sort((a, b) => a.y - b.y || a.x - b.x).map(n => n.key) } }); const fl = document.getElementById('ne-flade'); return { kol, r: gitRamme(), z: NE.z, x: NE.x, y: NE.y, W: fl.clientWidth, H: fl.clientHeight, git: JSON.parse(JSON.stringify(scene.ne.git)), posN: Object.keys(NE.pos).filter(k => !/^d:/.test(k)).length, nN: N.length, setpos: !!(set.ne && set.ne.pos), samme: NE.pos === scene.ne.pos } });
      const m0 = await maal();
      const ks = Object.keys(m0.kol), xs = ks.map(k => m0.kol[k].x), stigende = xs.every((x, i) => !i || x > xs[i - 1]);
      const luft = ks.slice(1).map((k, i) => m0.kol[k].x - m0.kol[ks[i]].x1), luftAfv = Math.max(...luft) - Math.min(...luft);
      const reg = m0.kol.regel, fyld = Math.abs(reg.y0 - m0.r.y0) <= 8 && Math.abs(reg.y1 - m0.r.y1) <= 8;
      T.tjek(stigende && luftAfv <= 16 && fyld && m0.posN === m0.nN && !m0.setpos && m0.samme && m0.git.model === 'C' && m0.git.ramme, `${w} × ${h}: standard-gitteret: ${ks.length} kolonner i rækkefølge, lige stor luft vandret (afvigelse ${Math.round(luftAfv)} px), Regel-kolonnen fylder rammens højde, alle ${m0.nN} noder har en plads i showet (scene.ne.pos), set.ne.pos er væk`, JSON.stringify({ xs, luft, reg: [reg.y0, reg.y1], r: m0.r, posN: m0.posN, nN: m0.nN, setpos: m0.setpos, samme: m0.samme }));
      await side.evaluate(() => neTilpas()); await side.waitForTimeout(300);
      const m1 = await maal(); const bredde = (m1.r.x1 - m1.r.x0) * m1.z / m1.W;
      T.tjek(bredde >= .85 && bredde <= 1, `Tilpas: gitteret fylder ${Math.round(bredde * 100)} % af feltets bredde`, JSON.stringify({ bredde, z: m1.z }));
      /* rod: to noder langt ud */
      await side.evaluate(() => { const N = [...NE2.N.values()].filter(n => n.el); const a = N.find(n => n.kol === 'lydtraek'), c = N.filter(n => n.kol === 'regel')[5]; a.x -= 6000; a.y -= 3000; c.x += 2000; c.y += 4000; [a, c].forEach(n => { NE.pos[n.key] = [n.x, n.y]; n.el.style.left = n.x + 'px'; n.el.style.top = n.y + 'px' }); gitGem(); neTilpas() }); await side.waitForTimeout(1600);
      const mRod = await maal();
      const knap = await side.evaluate(() => { const b = document.querySelector('[data-git="ret"]'); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, synlig: b.offsetParent !== null && q.width > 0 } });
      if (!knap.synlig) { await side.evaluate(() => vlAabn()); await side.waitForTimeout(200); }
      const k2 = await side.evaluate(() => { const b = document.querySelector('[data-git="ret"]'); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.click(k2.x, k2.y); await side.waitForTimeout(1600);
      const m2 = await maal(); const rammeSamme = ['x0', 'x1', 'y0', 'y1'].every(k => Math.abs(m2.r[k] - mRod.r[k]) <= 8);
      const ordenSamme = ['regel', 'lydtraek', 'maal'].every(k => JSON.stringify(m2.kol[k].orden) === JSON.stringify(m0.kol[k].orden));
      const inde = Object.keys(m2.kol).every(k => m2.kol[k].xs === 1);
      T.tjek(rammeSamme && ordenSamme && inde, `Ret op (rigtigt klik): rammen er de yderste kanter som før (${Math.round(m2.r.x0)},${Math.round(m2.r.y0)} til ${Math.round(m2.r.x1)},${Math.round(m2.r.y1)}), de to udtrukne noder står i deres kolonne igen, og rækkefølgen i kolonnerne er den samme`, JSON.stringify({ rammeSamme, ordenSamme, inde, foer: mRod.r, efter: m2.r }));
      /* Ctrl+Z */
      await side.evaluate(() => document.getElementById('ne-flade').focus()); await side.keyboard.press('Control+z'); await side.waitForTimeout(1200);
      const m3 = await maal(); const tilbage = ['x0', 'x1', 'y0', 'y1'].every(k => Math.abs(m3.r[k] - mRod.r[k]) <= 8) && m3.kol.lydtraek.xs === 2;
      T.tjek(tilbage, 'Ctrl+Z (rigtigt tastetryk) sætter pladserne tilbage: den udtrukne node står langt ude igen', JSON.stringify({ r: m3.r, xs: m3.kol.lydtraek.xs }));
      await side.mouse.click(k2.x, k2.y); await side.waitForTimeout(1600);
      /* model A og B */
      await side.selectOption('#ne-git-model', 'A'); await side.waitForTimeout(400);
      const mA = await maal(); const alleFylder = Object.keys(mA.kol).filter(k => mA.kol[k].n > 1).every(k => Math.abs(mA.kol[k].y0 - mA.r.y0) <= 8 && Math.abs(mA.kol[k].y1 - mA.r.y1) <= 8);
      T.tjek(alleFylder && mA.git.model === 'A', 'model A: alle kolonner med mere end én node fylder hele højden', JSON.stringify(Object.keys(mA.kol).map(k => [k, mA.kol[k].y0, mA.kol[k].y1])));
      await side.selectOption('#ne-git-model', 'B'); await side.waitForTimeout(400);
      const mB = await side.evaluate(() => { const N = [...NE2.N.values()].filter(n => n.el); const reg = N.filter(n => n.kol === 'regel').sort((a, b) => a.y - b.y), lt = N.filter(n => n.kol === 'lydtraek').sort((a, b) => a.y - b.y); const d = L => L.slice(1).map((n, i) => n.y - L[i].y); const dr = d(reg), dl = d(lt); return { pitchR: dr[0], pitchL: dl[0], ens: Math.max(...dr, ...dl) - Math.min(...dr, ...dl), model: scene.ne.git.model } });
      T.tjek(mB.model === 'B' && mB.ens <= 8, `model B: fælles rækker, samme afstand i alle kolonner (${mB.pitchR} px)`, JSON.stringify(mB));
      await side.selectOption('#ne-git-model', 'C'); await side.waitForTimeout(400);
      /* skyderen Lodret 150 % */
      const foerL = (await maal()).r;
      await side.evaluate(() => { const el = document.getElementById('ne-git-lod'); el.value = 150; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }); await side.waitForTimeout(600);
      const mL = await maal(); const cy = (foerL.y0 + foerL.y1) / 2, hF = foerL.y1 - foerL.y0, strakt = Math.abs((mL.r.y1 - mL.r.y0) - hF * 1.5) <= 24 && Math.abs((mL.r.y0 + mL.r.y1) / 2 - cy) <= 24 && Math.abs((mL.r.x1 - mL.r.x0) - (foerL.x1 - foerL.x0)) <= 8;
      T.tjek(strakt && mL.git.lod === 150, `Lodret 150 %: rammen er 1,5 × så høj om samme midte (${Math.round(hF)} → ${Math.round(mL.r.y1 - mL.r.y0)} px), bredden er den samme`, JSON.stringify({ foer: foerL, efter: mL.r, lod: mL.git.lod }));
      await side.evaluate(() => { const el = document.getElementById('ne-git-lod'); el.value = 40; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }); await side.waitForTimeout(400);
      /* Del: ved 40 % kan Regel-kolonnen ikke være i højden */
      await side.click('#ne-git-del'); await side.waitForTimeout(500);
      const mD = await maal();
      T.tjek(mD.git.del === true && mD.kol.regel.xs === 2 && mD.kol.lydtraek.xs === 1, `Del ved Lodret 40 %: Regel-kolonnen (${mD.kol.regel.n} noder) står i to stakke, Lydtræk i én`, JSON.stringify({ del: mD.git.del, regelXs: mD.kol.regel.xs, ltXs: mD.kol.lydtraek.xs }));
      await side.click('#ne-git-del'); await side.evaluate(() => { const el = document.getElementById('ne-git-lod'); el.value = 100; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }); await side.waitForTimeout(600);
      /* gem og hent: pladser og skydere følger med */
      await side.evaluate(() => { const el = document.getElementById('ne-git-vand'); el.value = 120; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })) }); await side.waitForTimeout(700);
      const gemt = await side.evaluate(async () => { slotSave('T'); const pos = JSON.stringify(NE.pos), git = JSON.stringify(scene.ne.git); neAutoPlacer(); await new Promise(r => setTimeout(r, 900)); const efterPlacer = JSON.stringify(scene.ne.git); slotLoad('T'); await new Promise(r => setTimeout(r, 1500)); return { samme: JSON.stringify(NE.pos) === pos && JSON.stringify(scene.ne.git) === git, vand: scene.ne.git.vand, placerVand: JSON.parse(efterPlacer).vand, posN: Object.keys(NE.pos).length } });
      T.tjek(gemt.samme && gemt.vand === 120 && gemt.placerVand === 100, 'pladser og skydere gemmes med showet: Placér nulstiller dem, og Hent fra pladsen giver dem tilbage (Vandret 120 %)', JSON.stringify(gemt));
      /* Gitter · Kæmpe (4×) */
      await side.evaluate(() => neAutoPlacer()); await side.waitForTimeout(900); const st = (await maal()).r;
      await side.evaluate(() => { const s = document.getElementById('ne61-opst'); if (s.offsetParent === null) vlAabn() }); await side.waitForTimeout(200); await side.selectOption('#ne61-opst', 'git4'); await side.waitForTimeout(900);
      const mK = await maal(); const fw = (mK.r.x1 - mK.r.x0) / (st.x1 - st.x0), fh = (mK.r.y1 - mK.r.y0) / (st.y1 - st.y0);
      T.tjek(fw > 3.6 && fw < 4.4 && fh > 3.6 && fh < 4.4 && mK.z < .06, `Gitter · Kæmpe (4×): rammen er ${fw.toFixed(1)} × bredere og ${fh.toFixed(1)} × højere end standard, zoom ${Math.round(mK.z * 100)} %`, JSON.stringify({ fw, fh, z: mK.z }));
      if (w === 2560) { await side.screenshot({ path: path.join(UD, 'gitter-kaempe.png') }); }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await side.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
