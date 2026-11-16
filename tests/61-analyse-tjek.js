/* Trin 4 · Det nye i v9.66: tjek af sangens analyse, to bekræftelser ved gem af egen opstilling, og Lav show som forslag.
   - anaTjek sammenligner analysen med lyden i 8 dele: en analyse, der passer, er ok; en analyse, der er stille, hvor der er lyd, eller har forkert længde, bliver fundet.
   - Analysér igen laver en ny analyse af lyden, og bagefter passer den.
   - Gem som Min opstilling oven i en gemt opstilling spørger to gange; siges der nej, er den gamle uændret.
   - Lav show ændrer ingen regler. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Analyse-tjek');
  console.log('61 · Tjek af sangens analyse, bekræftelse ved gem, og Lav show som forslag · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 2560, height: 1440 } }); const side = await ctx.newPage(); const fejl = [], dialoger = []; let svar = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    side.on('dialog', async d => { dialoger.push(d.message()); const ja = svar.length ? svar.shift() : false; if (ja) await d.accept(); else await d.dismiss(); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    /* 1 · en rigtig analyse af 40 sekunders lyd med slag hele vejen; så ødelægges den på to måder */
    const a = await side.evaluate(async () => { const SR = 22050, n = SR * 40, bf = new AudioBuffer({ length: n, sampleRate: SR, numberOfChannels: 1 }), d = bf.getChannelData(0); for (let i = 0; i < n - 2000; i += SR / 2) for (let j = 0; j < 900; j++) d[i + j] = Math.sin(j * .06) * Math.exp(-j / 180) * .8;
      buf = bf; dur = bf.duration; mode = 'auto'; RAW = await analyze(bf); ARAW = null; applyNorm(); buildPeaks(); const god = anaTjek(), tekst = anaTekst(god);
      const hel = RAW; const R2 = {}; Object.keys(hel).forEach(k => { const x = Float32Array.from(hel[k]); for (let i = Math.floor(x.length * .25); i < x.length; i++) x[i] = 0; R2[k] = x }); RAW = R2; applyNorm(); const stille = anaTjek(), t2 = anaTekst(stille);
      const R3 = {}; Object.keys(hel).forEach(k => { R3[k] = hel[k].slice(0, Math.floor(hel[k].length * .3)) }); RAW = R3; applyNorm(); const kort = anaTjek();
      const ok = await anaIgen(); const efter = anaTjek(); return { god: { ok: god.ok, medSlag: god.medSlag, n: god.n, vent: god.vent }, tekst, stille: { ok: stille.ok, daarlig: stille.daarlig, medSlag: stille.medSlag }, t2, kort: { ok: kort.ok, laengdeOK: kort.laengdeOK }, igen: ok, efter: { ok: efter.ok, medSlag: efter.medSlag }, status: document.getElementById('status').textContent } });
    T.tjek(a.god.ok && a.god.medSlag === 8 && /slag fundet i 8 af 8 dele/.test(a.tekst), `en analyse, der passer til lyden, er ok: "${a.tekst}" (${a.god.n} målinger, ventet ${a.god.vent})`, JSON.stringify(a.god));
    T.tjek(!a.stille.ok && a.stille.daarlig.join() === '3,4,5,6,7,8' && a.stille.medSlag === 2 && /analysen er stille i del 3, 4, 5, 6, 7, 8, hvor der er lyd/.test(a.t2), `en analyse, der er tom efter den første fjerdedel, bliver fundet: "${a.t2}"`, JSON.stringify(a.stille));
    T.tjek(!a.kort.ok && !a.kort.laengdeOK, 'en analyse med forkert længde (kun 30 % af sangen) bliver fundet', JSON.stringify(a.kort));
    T.tjek(a.igen && a.efter.ok && a.efter.medSlag === 8 && /Analyseret igen og gemt · slag fundet i 8 af 8/.test(a.status), `Analysér igen laver en ny analyse, der passer; statuslinjen: "${a.status}"`, JSON.stringify(a.efter));
    /* 2 · panelet Automatik viser linjen Sangens analyse med knappen Analysér igen */
    await side.evaluate(() => lay3Anvend('noder')); await side.waitForTimeout(2500); await side.click('#ne .ne-vlinje [data-au="aaben"]'); await side.waitForTimeout(900);
    const p = await side.evaluate(() => { const r = document.querySelector('#ne65-pan tr[data-aur="ana"]'); return r ? { tekst: r.textContent, knap: !!r.querySelector('[data-au="anaigen"]') } : null }); await side.click('#ne65-pan [data-au="luk"]');
    T.tjek(!!p && p.knap && /slag fundet i 8 af 8 dele/.test(p.tekst), 'panelet Automatik har linjen Sangens analyse ("slag fundet i 8 af 8 dele af sangen") med knappen Analysér igen', JSON.stringify(p));
    /* 3 · gem egen opstilling: første gang uden spørgsmål; oven i en gemt spørges der to gange */
    await side.evaluate(() => mxSaet(false, true)); await side.waitForTimeout(800);
    await side.selectOption('#ne61-opst', 'gem1'); await side.waitForTimeout(700); const d0 = dialoger.length, g0 = await side.evaluate(() => JSON.stringify(set.ne.egne[1].pos));
    await side.selectOption('#ne61-opst', 'kompakt'); await side.waitForTimeout(1100);
    svar = [true, false]; await side.selectOption('#ne61-opst', 'gem1'); await side.waitForTimeout(800); const d1 = dialoger.length, g1 = await side.evaluate(() => JSON.stringify(set.ne.egne[1].pos));
    svar = [true, true]; await side.selectOption('#ne61-opst', 'kompakt'); await side.waitForTimeout(900); await side.selectOption('#ne61-opst', 'gem1'); await side.waitForTimeout(800); const d2 = dialoger.length, g2 = await side.evaluate(() => JSON.stringify(set.ne.egne[1].pos));
    T.tjek(d0 === 0 && d1 === 2 && g1 === g0 && d2 === 4 && g2 !== g0 && /findes allerede/.test(dialoger[0] || '') && /helt sikker/.test(dialoger[1] || ''), `Gem som Min opstilling 1: første gang uden spørgsmål; oven i en gemt opstilling spørges der to gange ("${dialoger[0]}" og "${dialoger[1]}"); ja og nej lader den gamle være, ja og ja gemmer den nye`, JSON.stringify({ d0, d1, d2, ens1: g1 === g0, ens2: g2 === g0 }));
    /* 4 · Lav show ændrer ingen regler */
    const sh = await side.evaluate(async () => { const r0 = JSON.stringify(maps); document.getElementById('show-rolig').click(); await new Promise(r => setTimeout(r, 1200)); return { ens: JSON.stringify(maps) === r0, n: maps.length, status: document.getElementById('status').textContent.slice(0, 160) } });
    T.tjek(sh.ens, `Lav show (Rolig) ændrer ingen af de ${sh.n} regler; statuslinjen: "${sh.status}"`, JSON.stringify(sh));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
