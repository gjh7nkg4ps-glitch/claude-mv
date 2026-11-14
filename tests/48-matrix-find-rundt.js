/* Trin 4 · Det nye i v9.53: matrixen, trin 2c (find rundt). Fase 2 i PLAN-NY-BRUGERFLADE.md.
   + lydtræk og + mål åbner en liste med søgning og lægger en række eller kolonne til. En figur kan foldes sammen til én smal kolonne.
   Brugte · Alle viser alle lydtræk og alle mål (figurer uden regler står foldet sammen). Det, man tilføjer og folder, huskes.
   Testen bruger rigtige museklik og tastetryk ved 1920 × 1080, 2560 × 1440 og 3840 × 2160. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (find rundt)');
  console.log('48 · Matrixen, trin 2c: find rundt · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(800); lay3Anvend('noder'); await vent(2500); });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const tal = () => side.evaluate(() => { const mx = document.getElementById('ne-mx'); return { r: mx.querySelectorAll('th.mx-lt').length, k: mx.querySelectorAll('thead tr:nth-child(2) th.mx-maal').length, n: maps.length, x: mx.querySelectorAll('.mx-x').length, vaelg: !!document.getElementById('mx-vaelg') } });
      const t0 = await tal();
      /* + lydtræk: liste med søgning, Enter vælger */
      await side.click('#ne-mx [data-mxp="b"]'); await side.waitForTimeout(400);
      const l1 = await side.evaluate(() => { const d = document.getElementById('mx-vaelg'), r = d && d.getBoundingClientRect(); return { aaben: !!d, fokus: !!d && document.activeElement === d.querySelector('input'), antal: d ? d.querySelectorAll('.mx-vl button').length : 0, inde: !!r && r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight && r.height > 60 } });
      const ord = await side.evaluate(() => document.querySelectorAll('#mx-vaelg .mx-vl button')[6].textContent.trim().slice(0, 5)); await side.keyboard.type(ord); await side.waitForTimeout(300);
      const l2 = await side.evaluate(() => [...document.querySelectorAll('#mx-vaelg .mx-vl button')].map(b => b.dataset.id));
      await side.keyboard.press('Enter'); await side.waitForTimeout(700);
      const t1 = await tal(), nyB = l2[0], rk = await side.evaluate(b => { const th = [...document.querySelectorAll('#ne-mx th.mx-lt')].find(x => x.dataset.b === b); return { findes: !!th, kryds: !!th && !!th.querySelector('.mx-x') } }, nyB);
      T.tjek(l1.aaben && l1.fokus && l1.antal > 10 && l1.inde && l2.length > 0 && l2.length < l1.antal && rk.findes && rk.kryds && t1.r === t0.r + 1 && t1.n === t0.n && !t1.vaelg, `${w} × ${h}: + lydtræk åbner en liste med søgning (${l1.antal} lydtræk, "${ord}" giver ${l2.length}); Enter lægger rækken til (${t0.r} → ${t1.r} rækker, ingen nye regler), og den har et × til at fjerne den igen`, JSON.stringify({ l1, l2: l2.slice(0, 3), rk, t0, t1 }));
      /* + mål: klik på et punkt i listen */
      await side.click('#ne-mx [data-mxp="e"]'); await side.waitForTimeout(400); await side.keyboard.type('rotation'); await side.waitForTimeout(300);
      const punkt = await side.$('#mx-vaelg .mx-vl button'); const nyE = punkt ? await punkt.getAttribute('data-id') : null; if (punkt) await punkt.click({ timeout: 3000 }); await side.waitForTimeout(700);
      const t2 = await tal();
      T.tjek(!!nyE && t2.k === t1.k + 1 && t2.n === t0.n && !t2.vaelg, `${w} × ${h}: + mål: søg "rotation" og klik på et punkt lægger kolonnen til (${t1.k} → ${t2.k} kolonner)`, JSON.stringify({ nyE, t1, t2 }));
      /* klik i cellen, hvor den nye række og den nye kolonne mødes */
      const boks = await side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); if (!td) return null; td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, ledig: td.classList.contains('mx-ledig') } }, { b: nyB, e: nyE });
      if (boks) await side.mouse.click(boks.x, boks.y); await side.waitForTimeout(1000);
      const t3 = await tal(), ny = await side.evaluate(() => { const m = maps[maps.length - 1]; return m.band + '|' + m.effect });
      T.tjek(!!boks && boks.ledig && t3.n === t0.n + 1 && ny === nyB + '|' + nyE && t3.x === 0, `${w} × ${h}: et klik i cellen, hvor de mødes, laver reglen (${t0.n} → ${t3.n} regler); rækken og kolonnen har ikke længere et ×`, JSON.stringify({ boks, t3, ny }));
      /* slet reglen igen: rækken og kolonnen bliver stående med ×; × fjerner dem */
      await side.keyboard.press('Delete'); await side.waitForTimeout(1000); const t4 = await tal();
      const kryds = async sel => { const p = await side.evaluate(sel => { const x = document.querySelector(sel); if (!x) return null; x.scrollIntoView({ block: 'center', inline: 'center' }); const r = x.getBoundingClientRect(), el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { x: r.x + r.width / 2, y: r.y + r.height / 2, fri: el === x } }, sel); if (p && p.fri) await side.mouse.click(p.x, p.y); await side.waitForTimeout(500); return !!(p && p.fri) };
      const k1 = await kryds('#ne-mx th.mx-lt .mx-x'), k2 = await kryds('#ne-mx th.mx-maal .mx-x'); const t5 = await tal();
      T.tjek(t4.n === t0.n && t4.r === t1.r && t4.k === t2.k && t4.x === 2 && k1 && k2 && t5.r === t0.r && t5.k === t0.k && t5.x === 0, `${w} × ${h}: efter Delete står den tomme række og kolonne der stadig med ×; et klik på × fjerner dem (${t4.r} → ${t5.r} rækker, ${t4.k} → ${t5.k} kolonner)`, JSON.stringify({ t4, t5 }));
      /* efter ændringerne må tabellen ikke blive tegnet om, når intet ændres (fejlen i v9.52: noderne blev bygget om ved hvert billede) */
      const ro = await side.evaluate(async () => { const mx = document.getElementById('ne-mx'), tb = mx.querySelector('table'), N = NE2.N; await new Promise(r => setTimeout(r, 2000)); return mx.querySelector('table') === tb && NE2.N === N });
      T.tjek(ro, `${w} × ${h}: tabellen tegnes ikke om, når intet ændres (2 sekunder i ro)`);
      /* Esc og klik udenfor lukker listen */
      await side.click('#ne-mx [data-mxp="b"]'); await side.waitForTimeout(300); await side.keyboard.press('Escape'); await side.waitForTimeout(300); const e1 = await tal();
      await side.click('#ne-mx [data-mxp="b"]'); await side.waitForTimeout(300); await side.mouse.click(w / 2, 150); await side.waitForTimeout(300); const e2 = await tal();
      T.tjek(!e1.vaelg && !e2.vaelg && e2.r === t0.r, `${w} × ${h}: Esc og et klik udenfor lukker listen uden at ændre noget`);
      /* fold en figur sammen og ud igen */
      const fig = await side.evaluate(() => { const f = MX.fig.find(x => x.maal.length > 2 && x.regler > 0); return { key: f.key, navn: f.navn, maal: f.maal.length, regler: [...new Set(maps.filter(m => neFigurAf(m.effect).key === f.key).map(m => m.band))].length } });
      await side.click(`#ne-mx th.mx-fig[data-f="${fig.key}"]`); await side.waitForTimeout(600);
      const f1 = await side.evaluate(key => { const mx = document.getElementById('ne-mx'), th = mx.querySelector('th.mx-fig[data-f="' + key + '"]'), ki = MX.kol.findIndex(k => k.fold && k.f.key === key), c = [...mx.querySelectorAll('td.mx-c[data-k="' + ki + '"]')]; return { k: mx.querySelectorAll('thead tr:nth-child(2) th.mx-maal').length, foldet: th.getAttribute('aria-expanded') === 'false', bredde: Math.round(th.getBoundingClientRect().width), medRegel: c.filter(x => x.classList.contains('mx-har')).length, lukket: c.filter(x => x.classList.contains('mx-lukket')).length } }, fig.key);
      const fc = await side.$('#ne-mx td.mx-har[data-k="' + await side.evaluate(key => MX.kol.findIndex(k => k.fold && k.f.key === key), fig.key) + '"]'); if (fc) await fc.click({ timeout: 3000 }); await side.waitForTimeout(500);
      const fv = await side.evaluate(key => { const n = NE2.N.get(NE2.valgt); return !!(n && n.m && neFigurAf(n.m.effect).key === key) }, fig.key);
      await side.click(`#ne-mx th.mx-fig[data-f="${fig.key}"]`); await side.waitForTimeout(600); const f2 = await tal();
      T.tjek(f1.k === t0.k - fig.maal + 1 && f1.foldet && f1.bredde <= 48 && f1.medRegel === fig.regler && fv && f2.k === t0.k, `${w} × ${h}: et klik på "${fig.navn}" folder figuren sammen til én kolonne på ${f1.bredde} px (${t0.k} → ${f1.k} kolonner), ${f1.medRegel} celler viser stadig dens regler, et klik på en af dem vælger reglen, og et klik mere folder ud igen`, JSON.stringify({ fig, f1, fv, f2 }));
      if (w === 1920) {
        /* Alle */
        await side.click('#ne-mx [data-mxv="1"]'); await side.waitForTimeout(1200);
        const a = await side.evaluate(() => { const mx = document.getElementById('ne-mx'), t0 = performance.now(); mxByg(); const ms = performance.now() - t0; const kilder = r2AlleKilder().filter(b => !fjernetKilde(b)).length, td = [...mx.querySelectorAll('td.mx-c')].slice(0, 400).map(x => x.getBoundingClientRect());
          return { r: mx.querySelectorAll('th.mx-lt').length, kilder, maal: MX.fig.reduce((s, f) => s + f.maal.length, 0), targets: TARGETS.length, foldet: MX.fig.filter(f => f.fold).length, udenRegler: MX.fig.filter(f => !f.regler).length, medFoldet: MX.fig.filter(f => f.regler && f.fold).length, celler: mx.querySelectorAll('td.mx-c').length, ms: Math.round(ms), minB: Math.min(...td.map(r => r.width)), minH: Math.min(...td.map(r => r.height)), tryk: mx.querySelector('[data-mxv="1"]').getAttribute('aria-pressed') } });
        T.tjek(a.r === a.kilder && a.maal >= a.targets && a.foldet === a.udenRegler && a.medFoldet === 0 && a.tryk === 'true' && a.minB >= 44 && a.minH >= 40, `Alle: ${a.r} lydtræk og ${a.maal} mål (${a.celler} celler); de ${a.foldet} figurer uden regler står foldet sammen; cellerne er stadig mindst 44 × 40`, JSON.stringify(a));
        T.tjek(a.ms < 1500, `Alle: tabellen bygges på ${a.ms} ms`);
        /* huskes efter genstart */
        await side.click(`#ne-mx th.mx-fig[data-f="${fig.key}"]`); await side.waitForTimeout(500); await side.reload(); await side.waitForTimeout(5500);
        const g = await side.evaluate(key => { const mx = document.getElementById('ne-mx'), th = mx.querySelector('th.mx-fig[data-f="' + key + '"]'); return { mx: !mx.hidden, alle: mx.querySelector('[data-mxv="1"]').getAttribute('aria-pressed'), foldet: th && th.getAttribute('aria-expanded') } }, fig.key);
        T.tjek(g.mx && g.alle === 'true' && g.foldet === 'false', 'efter genstart står matrixen stadig på Alle, og den figur, der blev foldet sammen, er stadig foldet', JSON.stringify(g));
        await side.click('#ne-mx [data-mxv="0"]'); await side.waitForTimeout(700); await side.click(`#ne-mx th.mx-fig[data-f="${fig.key}"]`); await side.waitForTimeout(500);
        const b = await tal(); T.tjek(b.r === t0.r && b.k === t0.k, `Brugte: tilbage til de ${b.r} rækker og ${b.k} kolonner, der er i brug`, JSON.stringify(b));
        /* overskrifterne står fast i Alle */
        const s = await side.evaluate(async () => { const mx = document.getElementById('ne-mx'); mxSaetAlle(true); await new Promise(r => setTimeout(r, 600)); mx.scrollTop = 400; mx.scrollLeft = 300; await new Promise(r => setTimeout(r, 200)); const m = mx.getBoundingClientRect(), f = mx.querySelector('.mx-fig').getBoundingClientRect(), l = [...mx.querySelectorAll('th.mx-lt')].map(x => x.getBoundingClientRect().left); const ud = { top: Math.abs(f.top - m.top) < 3, venstre: l.every(x => Math.abs(x - m.left) < 3), st: mx.scrollTop + '/' + mx.scrollLeft }; mxSaetAlle(false); return ud });
        T.tjek(s.top && s.venstre, `Alle: overskrifterne står fast øverst og til venstre, når man ruller (${s.st})`, JSON.stringify(s));
      }
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
