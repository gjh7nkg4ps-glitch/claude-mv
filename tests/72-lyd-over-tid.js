/* Trin 4 · Det nye i v9.77 (trin S3): Lyd over tid, det første kort under Sang → Avanceret: hele sangen på én tidsakse med rækker, der slås til og fra.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med stereo-testlyden: kortet står først, rækkerne Afsnit, Bølgeform, Spektrogram, Taktslag og lydtrækkene Kick, Bas og Vokal
   er tegnet (lærredet har farve i hver række), klik hopper i sangen (samme markør som Bølgeform og sløjfe), musehjulet zoomer (samme udsnit, tlVis), Shift + hjul flytter;
   Toner og Stereo kan slås til, et lydtræk kan lægges til med ＋ og fjernes med ×, og det huskes (set.lot); lotSerie giver det højeste tal pr. søjle (samme tal som F);
   Node-editorens visning Tidslinje er væk. */
const path = require('path'), os = require('os'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Lyd over tid');
  console.log('72 · Lyd over tid (S3) · ' + path.basename(fil));
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lot-')), st = lavTestlyd.stereo(path.join(d, 'stereo-lot.wav'));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.click('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(800); await side.click('#sg [data-sgf="avanceret"]'); await side.waitForTimeout(500);
      const r0 = await side.evaluate(() => ({ kort: [...document.querySelectorAll('#sg .sg-fane[data-sg="avanceret"] .sg-kort h4')].map(x => x.textContent), rk: [...document.querySelectorAll('[data-lotrk]')].map(x => x.dataset.lotrk + ':' + x.checked), chips: [...document.querySelectorAll('.lot-chip')].map(x => x.textContent.replace('×', '').trim()), tid: NE41_VIS.some(x => x[0] === 'tid') || typeof rtTid === 'function', h: document.getElementById('lot').height }));
      T.tjek(r0.kort[0] === 'Lyd over tid' && r0.rk.join(',').replace('lufs:false,', '') === 'afsnit:true,boelge:true,spek:true,takt:true,haend:true,toner:false,stereo:false,lyd:true' /* v9.78: rækken Lydstyrke (lufs) kom til; v9.126: Hændelser */ && r0.chips.length === 3 && !r0.tid && r0.h > 200, `${w} × ${h}: Lyd over tid står først under Avanceret med rækkerne ${r0.rk.filter(x => /true/.test(x)).map(x => x.split(':')[0]).join(', ')} og lydtrækkene ${r0.chips.join(', ')}; Node-editorens visning Tidslinje er væk`, JSON.stringify(r0));
      await side.setInputFiles('#file', st); await side.waitForFunction(() => /Analyse færdig og gemt i cache|Analyse hentet fra cache/.test(document.getElementById('status').textContent) && !!A && !!SHOWPROFIL, null, { timeout: 240000 }); await side.waitForTimeout(2500);
      /* hver række har farve */
      const rk = await side.evaluate(() => { const c = document.getElementById('lot'), g = c.getContext('2d'), R = lotRaekker(); let y = 14; const ud = {}; R.forEach(r => { const dta = g.getImageData(0, y + 2, c.width, Math.max(1, r.h - 4)).data; let n = 0; for (let i = 0; i < dta.length; i += 8) if (dta[i] + dta[i + 1] + dta[i + 2] > 90) n++; ud[r.id + (r.k ? ':' + r.k : '')] = Math.round(n / (dta.length / 8) * 1000) / 10; y += r.h }); return { ud, env: LOT.envKlar, serie: (() => { const s = lotSerie('kick', 100, 0, dur); let m = 0; for (const v of s) if (v > m) m = v; const F2 = F.kick; let m2 = 0; for (const v of F2) if (v > m2) m2 = v; return { max: m, fmax: m2, n: s.length } })() } });
      const alle = Object.entries(rk.ud);
      T.tjek(alle.length === 8 /* v9.126: Hændelser */ && alle.every(([k, p]) => p > 1) && rk.env && rk.serie.n === 100 && Math.abs(rk.serie.max - rk.serie.fmax) < 1e-6, `${w} × ${h}: alle 8 rækker er tegnet (${alle.map(([k, p]) => k + ' ' + p + ' %').join(', ')}); bølgeformens kontur er regnet; lotSerie giver det højeste tal pr. søjle (${rk.serie.max.toFixed(2)} = F's højeste ${rk.serie.fmax.toFixed(2)})`, JSON.stringify(rk));
      if (w !== 1920) { T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n')); await ctx.close(); continue }
      /* klik hopper, hjul zoomer, Shift + hjul flytter */
      const c = await side.evaluate(() => document.getElementById('lot').getBoundingClientRect().toJSON());
      await side.mouse.click(c.x + c.width * .5, c.y + 40); await side.waitForTimeout(300); const t1 = await side.evaluate(() => ({ t: now(), dur, tlT: tlX(now(), 100) }));
      await side.mouse.move(c.x + c.width * .5, c.y + 80); await side.mouse.wheel(0, -200); await side.waitForTimeout(300); const z1 = await side.evaluate(() => tlVis());
      await side.keyboard.down('Shift'); await side.mouse.wheel(0, 200); await side.keyboard.up('Shift'); await side.waitForTimeout(300); const z2 = await side.evaluate(() => tlVis());
      T.tjek(Math.abs(t1.t - t1.dur / 2) < .6 && z1.b - z1.a < t1.dur * .9 && z1.b - z1.a > 5 && Math.abs((z2.b - z2.a) - (z1.b - z1.a)) < .01 && z2.a > z1.a, `klik midt i kortet hopper til ${t1.t.toFixed(1)} s af ${t1.dur} s; hjulet zoomer ind (${z1.a.toFixed(1)} til ${z1.b.toFixed(1)} s, samme udsnit som Bølgeform og sløjfe), og Shift + hjul flytter udsnittet (${z2.a.toFixed(1)} til ${z2.b.toFixed(1)} s)`, JSON.stringify({ t1, z1, z2 }));
      /* rækker og lydtræk til og fra, huskes */
      const h0 = await side.evaluate(() => document.getElementById('lot').height);
      await side.click('[data-lotrk="toner"]'); await side.click('[data-lotrk="stereo"]'); await side.selectOption('#lot-plus', 'hihat'); await side.waitForTimeout(500);
      const r2 = await side.evaluate(() => ({ h: document.getElementById('lot').height, lt: set.lot.lt.join(), toner: set.lot.rk.toner, stereo: set.lot.rk.stereo, chips: document.querySelectorAll('.lot-chip').length, gemt: JSON.parse(localStorage.getItem('rytme-set')).lot.lt.join() }));
      await side.click('.lot-chip [data-lotx="bas"]'); await side.waitForTimeout(400);
      const r3 = await side.evaluate(() => ({ lt: set.lot.lt.join(), chips: document.querySelectorAll('.lot-chip').length, h: document.getElementById('lot').height }));
      T.tjek(r2.h > h0 && r2.toner && r2.stereo && r2.lt === 'kick,bas,vokal,hihat' && r2.chips === 4 && r2.gemt === r2.lt && r3.lt === 'kick,vokal,hihat' && r3.chips === 3 && r3.h < r2.h, `Toner og Stereo slås til (kortet bliver højere: ${h0} → ${r2.h} px), ＋ lydtræk lægger Hihat til (huskes), og × fjerner Bas igen (${r3.lt})`, JSON.stringify({ h0, r2, r3 }));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
