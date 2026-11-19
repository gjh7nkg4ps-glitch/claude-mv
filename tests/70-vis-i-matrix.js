/* Trin 4 · Det nye i v9.75 (trin 6b): Vis i matrix i stedet for fanen Koblinger; Detaljer, Adfærd og kilde-listen ved hver egenskab er væk.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160: Egenskaber har kun fanerne Figur og Lag, knappen Vis i matrix, ingen Detaljer-vælger, ingen kilde-liste
   og ingen ⚡ ved egenskaberne, ingen Adfærd; ved hver egenskab står en knap med reglens kilde eller + regel. Rigtige klik: Vis i matrix åbner 3 · Regler
   med matrixen, der kun viser figuren (chippen Kun: navn), alle dens egenskaber som kolonner og de 14 lydtræk som rækker; et klik i en tom celle laver en regel;
   × alle viser alle figurer igen; knappen ved en egenskab åbner matrixen med reglen valgt; Figurer har også Vis i matrix. Levende og danserens afsnit er der stadig. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Vis i matrix');
  console.log('70 · Vis i matrix (6b) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(5000);
      const klik = async sel => { const p = await side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width } }, sel); if (!p || !p.w) throw new Error('kan ikke klikke på ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
      await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200);
      await klik('#fg34-ny'); await klik('#fg34 [data-op="piger"]'); await side.waitForTimeout(700);
      /* v9.91: siden v9.88 (B4) lægges pigerne på uden regler; testen giver den valgte pige danserens standardregler direkte (uden om forslagene), så knapperne med reglens kilde kan prøves */
      await side.evaluate(() => { const o = fase2.objekter.find(x => x.id === selO) || fase2.objekter[fase2.objekter.length - 1]; const li = o.lag.findIndex(l => l.form === 'danser'); const d = FSF.direkte; FSF.direkte = true; try { Regler.samlet(() => danserStandard(o, li < 0 ? 0 : li)); } finally { FSF.direkte = d; } formUI(); }); await side.waitForTimeout(700);
      await klik('#fctl [data-fe-fane="C"]'); await side.evaluate(() => { document.querySelectorAll('#fctl details').forEach(x => x.open = true) });
      const e = await side.evaluate(() => ({ faner: [...document.querySelectorAll('#fctl [data-fe-fane]')].map(b => b.textContent), vismx: !!document.getElementById('fe-vismx') && document.getElementById('fe-vismx').getBoundingClientRect().width > 0, niv: !!document.getElementById('fe-niv'), bnd: document.querySelectorAll('#fctl .bnd select, #fctl [data-learn], #fctl [data-adf], #fctl .fe-nk, #fctl .fe-kobl').length, knapper: [...document.querySelectorAll('#fctl .fe-regel')].map(b => b.textContent), rows: document.querySelectorAll('#fctl .frow').length, styrke: document.querySelectorAll('#fctl .fe-styrke input[data-ks]').length, dans: !!document.querySelector('#fctl [data-dmf]'), lev: /Levende/.test(document.getElementById('fctl').textContent) || !!document.querySelector('#fctl [data-lvfod],#fctl #fliv'), fgMx: !!document.getElementById('fg34-mx'), feNiv: typeof feNiv === 'function' ? feNiv() : null, adf: typeof ADF, kob: typeof feKobOversigt }));
      const medRegel = e.knapper.filter(k => k !== '+ regel');
      T.tjek(e.faner.join(',') === 'Figur,Lag' && e.vismx && !e.niv && e.bnd === 0 && e.feNiv === 4 && e.adf === 'undefined' && e.kob === 'undefined' && e.fgMx, `${w} × ${h}: Egenskaber har fanerne ${e.faner.join(' og ')} og Vis i matrix; Detaljer, Adfærd, Koblinger, kilde-listen og ⚡ er væk; Figurer har Vis i matrix`, JSON.stringify(e));
      T.tjek(e.rows > 20 && e.knapper.length === e.rows && medRegel.length >= 6 && e.knapper.includes('+ regel') && e.styrke >= medRegel.length && e.dans, `${w} × ${h}: alle ${e.rows} egenskaber i laget vises (ingen niveauer) med en knap hver: ${medRegel.length} med reglens kilde (fx ${medRegel[0]}) og resten "+ regel"; Gain og de andre skydere ved koblede egenskaber og danserens afsnit er der stadig`, JSON.stringify({ rows: e.rows, knapper: e.knapper.slice(0, 8), styrke: e.styrke, dans: e.dans }));
      /* Vis i matrix (rigtigt klik) */
      await klik('#fe-vismx'); await side.waitForTimeout(1600);
      const m = await side.evaluate(() => ({ lay: set.lay3, mx: set.ne.mx, kun: set.ne.mxKun, chip: (document.querySelector('#ne-mx .mx-kun') || {}).textContent, figurer: [...document.querySelectorAll('#ne-mx th.mx-fig')].map(x => x.textContent.trim()), kol: document.querySelectorAll('#ne-mx th.mx-maal').length, maal: TARGETS.filter(t => t.id.startsWith('obj:' + set.ne.mxKun + ':')).length, rk: [...document.querySelectorAll('#ne-mx th.mx-lt')].map(x => x.dataset.b), har: document.querySelectorAll('#ne-mx td.mx-har').length, regler: maps.filter(x => String(x.effect).startsWith('obj:' + set.ne.mxKun + ':')).length, toast: (document.getElementById('ne-toast') || {}).textContent }));
      const b14 = await side.evaluate(() => BANDS.map(b => b[0]));
      T.tjek(m.lay === 'ao-regler' && m.mx && m.kun && /^Kun: Pige på stangen/.test(m.chip || '') && m.figurer.length === 1 && /Pige på stangen/.test(m.figurer[0]) && m.kol === m.maal && b14.every(b => m.rk.includes(b)) && m.har === m.regler, `${w} × ${h}: Vis i matrix åbner 3 · Regler med matrixen for kun Pige på stangen (${m.chip}): ${m.kol} kolonner = alle hendes egenskaber, de 14 lydtræk som rækker (${m.rk.length} rækker i alt), ${m.har} celler med regler`, JSON.stringify(m));
      if (w !== 1920) { T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n')); await ctx.close(); continue }
      /* klik i en tom celle laver en regel for figuren */
      const n0 = await side.evaluate(() => maps.length);
      const celle = await side.evaluate(() => { const c = [...document.querySelectorAll('#ne-mx td.mx-ledig')].find(x => x.getBoundingClientRect().width > 0 && x.getBoundingClientRect().top > 0); if (!c) return null; c.scrollIntoView({ block: 'center', inline: 'center' }); const q = c.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, titel: c.title } });
      await side.mouse.click(celle.x, celle.y); await side.waitForTimeout(700);
      const ny = await side.evaluate(k => ({ n: maps.length, sidste: maps[maps.length - 1] && maps[maps.length - 1].effect, kun: set.ne.mxKun, erFig: maps[maps.length - 1] && String(maps[maps.length - 1].effect).startsWith('obj:' + k + ':') }), m.kun);
      T.tjek(ny.n === n0 + 1 && ny.erFig, `et klik i en tom celle (${celle.titel.slice(0, 60)}) laver en regel til figuren (${ny.sidste})`, JSON.stringify({ n0, ny, celle }));
      /* × alle */
      await klik('#ne-mx [data-mxkun]'); await side.waitForTimeout(800);
      const alle = await side.evaluate(() => ({ kun: set.ne.mxKun, chip: !!document.querySelector('#ne-mx .mx-kun'), figurer: document.querySelectorAll('#ne-mx th.mx-fig').length }));
      T.tjek(alle.kun === '' && !alle.chip && alle.figurer >= 4, `× alle viser alle figurer igen (${alle.figurer} figurer og grupper)`, JSON.stringify(alle));
      /* knappen ved en egenskab vælger reglen i matrixen */
      await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1000); await klik('#fctl [data-fe-fane="C"]'); await side.evaluate(() => { document.querySelectorAll('#fctl details').forEach(x => x.open = true) });
      const kn = await side.evaluate(() => { const b = document.querySelector('#fctl .fe-regel:not(.fe-tom)'); b.scrollIntoView({ block: 'center' }); return { tekst: b.textContent, mx: b.dataset.feMx } });
      await klik('#fctl .fe-regel:not(.fe-tom)'); await side.waitForTimeout(1600);
      const v = await side.evaluate(() => ({ lay: set.lay3, kun: set.ne.mxKun, effect: NE2.valgt && NE2.N.get(NE2.valgt) && NE2.N.get(NE2.valgt).m && NE2.N.get(NE2.valgt).m.effect, kp: (document.getElementById('ne-kp') || document.querySelector('.ne-kp') || {}).textContent || '' }));
      T.tjek(v.lay === 'ao-regler' && v.kun && v.effect === kn.mx, `knappen "${kn.tekst}" ved en egenskab åbner matrixen med reglen for ${kn.mx} valgt`, JSON.stringify({ kn, v }));
      /* Figurer: Vis i matrix for en anden figur */
      await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(900); await klik('.fg34-row[data-fg34="0"]'); await klik('#fg34-mx'); await side.waitForTimeout(1500);
      const f = await side.evaluate(() => ({ kun: set.ne.mxKun, navn: (fase2.objekter.find(o => o.id === set.ne.mxKun) || {}).navn, figurer: [...document.querySelectorAll('#ne-mx th.mx-fig')].map(x => x.textContent.trim()) }));
      T.tjek(f.navn === 'Discokugle' && f.figurer.length === 1 && /Discokugle/.test(f.figurer[0]), `Vis i matrix i Figurer viser den valgte figur (${f.navn})`, JSON.stringify(f));
      await side.evaluate(() => neVisAlleFigurer());
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
