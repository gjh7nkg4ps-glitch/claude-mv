/* Trin 4 · Det nye i v9.63: fase 4, trin 4a: Foreslå regler i stedet for Auto-mapping.
   - Foreslå regler ændrer ingen regler; forslagene står som stiplede celler i matrixen (planens prøve: Pigernes show, og ingen af pigernes regler er væk).
   - ✓ laver reglen, ✕ fjerner forslaget, Ja til alle er ét Fortryd-skridt, Nej til alle ændrer intet.
   - Den kender figurerne (en ny danser får forslag til sine bevægelser) og bruger sangen (forslag til scenens effekter, når en sang er analyseret).
   - Auto-mapping: Til/Fra er væk, og Kør Auto-mapping nu hedder Foreslå regler og erstatter ikke længere reglerne.
   Rigtige museklik ved 1920 × 1080, 2560 × 1440 og 3840 × 2160. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Forslag');
  console.log('58 · Foreslå regler: forslag som stiplede celler i stedet for Auto-mapping · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const id = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('piger_show', true); await vent(1500); const ny = nyFigurHer('Ny pige', .8, .6, 'danser'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500); window.__H = []; Regler.lyt(x => window.__H.push(x.hvad)); return { ny: ny.id, regler: JSON.stringify(maps), n: maps.length } });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const st = () => side.evaluate(() => { const bj = document.getElementById('fs-bj'); return { n: maps.length, fs: FS.liste.length, celler: document.querySelectorAll('#ne-mx td.mx-forslag').length, bj: bj && !bj.hidden ? bj.textContent : null, regler: JSON.stringify(maps), ens: new Set(maps.map(m => m.id)).size === maps.length } });
      const knap = async navn => { const p = await side.evaluate(t => { const b = [...document.querySelectorAll('#fs-bj button, #ne89-vaerk button')].find(x => x.textContent === t); /* v9.89: Foreslå regler står i værktøjslinjen */ if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, navn); if (!p) return false; await side.mouse.click(p.x, p.y); await side.waitForTimeout(1000); return true };
      const H = () => side.evaluate(() => { const h = window.__H.join(); window.__H.length = 0; return h });
      /* 1 · linjen med Foreslå regler står under matrixen; Auto-mapping: Til/Fra er væk */
      const s0 = await st(), auto = await side.evaluate(() => { const a = document.getElementById('auto'), n = document.getElementById('autonow'); return { autoSes: !!a && a.getBoundingClientRect().width > 0, nu: n ? n.textContent : null, autoOn: typeof autoOn !== 'undefined' ? autoOn : null } });
      T.tjek(/Foreslå regler/.test(s0.bj || '') && /Ingen forslag lige nu/.test(s0.bj || '') && !auto.autoSes && auto.nu === 'Foreslå regler' && auto.autoOn === false, `${w} × ${h}: linjen Foreslå regler står under matrixen; knappen Auto-mapping: Til/Fra kan ikke ses mere, og Kør Auto-mapping nu hedder Foreslå regler`, JSON.stringify({ bj: s0.bj, auto }));
      /* 2 · Foreslå regler (rigtigt klik): ingen regler ændres; den nye danser får forslag */
      await H(); await knap('Foreslå regler'); const s1 = await st(), h1 = await H();
      const f1 = await side.evaluate(ny => ({ nyPige: FS.liste.filter(f => f.regel.effect.startsWith('obj:' + ny + ':')).map(f => f.regel.band + '>' + f.regel.effect.split(':')[3]), andre: FS.liste.filter(f => !f.regel.effect.startsWith('obj:' + ny + ':')).length, harRegel: FS.liste.filter(f => maps.some(m => m.effect === f.regel.effect)).length, hvorfor: FS.liste[0] && FS.liste[0].hvorfor, toast: (document.getElementById('ne-toast') || {}).textContent }), id.ny);
      T.tjek(s1.regler === id.regler && h1 === '' && s1.fs >= 8 && s1.celler === s1.fs && f1.nyPige.length >= 8 && f1.nyPige.includes('kick>dHop') && f1.harRegel === 0 && /danser/.test(f1.hvorfor || '') && new RegExp(s1.fs + ' forslag').test(s1.bj || '') && /Ingen af dine \d+ regler er ændret/.test(f1.toast || ''), `${w} × ${h}: Foreslå regler på Pigernes show ændrer ingen af de ${id.n} regler; ${s1.fs} forslag står som stiplede celler (${f1.nyPige.length} til den nye danser, fx kick → Hop), og ingen af dem går til et mål, der allerede har en regel`, JSON.stringify({ fs: s1.fs, celler: s1.celler, f1, h1 }));
      /* 3 · ✓ i en celle laver reglen; ✕ fjerner forslaget */
      const pj = await side.evaluate(ny => { const f = FS.liste.find(x => x.regel.effect === 'obj:' + ny + ':0:dHop'), b = document.querySelector('#ne-mx [data-fsj="' + f.id + '"]'); b.scrollIntoView({ block: 'center', inline: 'center' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, thr: f.regel.thr, att: f.regel.att } }, id.ny);
      await side.mouse.click(pj.x, pj.y); await side.waitForTimeout(1200); const s2 = await st(), h2 = await H();
      const r2 = await side.evaluate(ny => { const m = maps.find(x => x.band === 'kick' && x.effect === 'obj:' + ny + ':0:dHop'), q = neEgAf('obj:' + ny + ':0:dHop'); return m ? { thr: m.thr, att: m.att, id: !!m.id, uds: q.e.fra !== q.e.til } : null }, id.ny);
      const pn = await side.evaluate(() => { const b = document.querySelector('#ne-mx [data-fsn]'); b.scrollIntoView({ block: 'center', inline: 'center' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } });
      await side.mouse.click(pn.x, pn.y); await side.waitForTimeout(900); const s3 = await st();
      T.tjek(s2.n === id.n + 1 && s2.fs === s1.fs - 1 && !!r2 && r2.thr === pj.thr && r2.att === pj.att && r2.id && r2.uds && /tilfoej/.test(h2) && s2.ens && s3.n === s2.n && s3.fs === s2.fs - 1 && s3.celler === s3.fs, `${w} × ${h}: ✓ i den stiplede celle laver reglen kick → Hop med forslagets indstillinger og et udsving (${id.n} → ${s2.n} regler); ✕ i en anden celle fjerner kun forslaget (${s2.fs} → ${s3.fs} forslag, stadig ${s3.n} regler)`, JSON.stringify({ s2: { n: s2.n, fs: s2.fs }, r2, h2, s3: { n: s3.n, fs: s3.fs } }));
      /* 4 · klik på en stiplet celle laver ikke en regel; linjen viser hvorfor, med Ja og Nej */
      const pc = await side.evaluate(() => { const td = document.querySelector('#ne-mx td.mx-forslag'); td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height - 5 } });
      await side.mouse.click(pc.x, pc.y); await side.waitForTimeout(600); const s4 = await st();
      T.tjek(s4.n === s3.n && s4.fs === s3.fs && /plejer at passe til|discokugle|Ud fra sangen/.test(s4.bj || '') && /JaNej$/.test((s4.bj || '').replace(/\s/g, '')), `${w} × ${h}: et klik på selve den stiplede celle laver ingen regel; linjen viser, hvorfor reglen foreslås, med knapperne Ja og Nej`, JSON.stringify({ n: s4.n, bj: (s4.bj || '').slice(-160) }));
      /* 5 · Ja til alle: ét Fortryd-skridt; de gamle regler er der stadig */
      await side.waitForTimeout(1500); await H(); await knap('Ja til alle'); const s5 = await st(), h5 = await H();
      const gamle = await side.evaluate(r => { const G = JSON.parse(r); return G.every(g => maps.some(m => m.id === g.id && JSON.stringify(m) === JSON.stringify(g))) }, id.regler);
      await side.waitForTimeout(1800); await side.evaluate(() => document.querySelector('#ne-mx td.mx-c').focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(1000); const s6 = await st();
      T.tjek(s5.n === s4.n + s4.fs && s5.fs === 0 && s5.celler === 0 && /samlet/.test(h5) && gamle && s5.ens && s6.n === s4.n, `${w} × ${h}: Ja til alle laver de ${s4.fs} foreslåede regler (${s4.n} → ${s5.n}); alle ${id.n} regler fra før er der uændret; én Ctrl+Z tager dem alle væk igen (${s6.n})`, JSON.stringify({ s5: { n: s5.n, fs: s5.fs }, h5, gamle, s6: s6.n }));
      /* 6 · Nej til alle ændrer intet */
      await knap('Foreslå regler'); const s7 = await st(); await knap('Nej til alle'); const s8 = await st();
      T.tjek(s7.fs > 0 && s8.fs === 0 && s8.celler === 0 && s8.regler === s7.regler, `${w} × ${h}: Nej til alle fjerner de ${s7.fs} forslag, og ingen regler er ændret`, JSON.stringify({ s7: s7.fs, s8: s8.fs }));
      /* 7 · med en analyseret sang foreslås også scenens effekter (Auto-mappings beregning), og kun til mål uden regler */
      const sang = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); sr = 44100; dur = 60; const n = Math.floor(dur * sr / H), R = {}; let s = 3; BANDS.forEach(([k], bi) => { const a = new Float32Array(n); for (let i = 0; i < n; i++) { s = (s * 16807) % 2147483647; const u = s / 2147483647; a[i] = ['kick', 'snare', 'hihat', 'flux'].includes(k) ? ((i + bi * 7) % (18 + bi) === 0 ? .8 + .2 * u : .03 * u) : .3 + .3 * Math.sin(i / (200 + bi * 37)) + .1 * u } R[k] = a }); buf = new AudioBuffer({ length: 2000, sampleRate: 8000, numberOfChannels: 1 }); ARAW = null; mode = 'auto'; RAW = R; applyNorm(); buildPeaks();
        Regler.erstat([]); save(); await vent(900); const foer = maps.length; const n1 = fsForeslaa(); await vent(900); const scene = FS.liste.filter(f => !f.regel.effect.startsWith('obj:')).map(f => f.regel.band + '>' + f.regel.effect); const A = autoListe().m.map(r => r.band + '>' + r.effect); return { foer, n1, scene, auto: A, efter: maps.length, celler: document.querySelectorAll('#ne-mx td.mx-forslag').length, hv: (FS.liste.find(f => !f.regel.effect.startsWith('obj:')) || {}).hvorfor } });
      T.tjek(sang.foer === 0 && sang.efter === 0 && sang.scene.length >= 4 && sang.scene.every(x => sang.auto.includes(x)) && sang.celler === sang.n1 && /Ud fra sangen/.test(sang.hv || ''), `${w} × ${h}: med en analyseret sang og ingen regler foreslås også ${sang.scene.length} regler til scenens effekter og klodsbanen (de samme, som Auto-mapping ville have valgt); stadig 0 regler, før der siges ja`, JSON.stringify(sang));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
