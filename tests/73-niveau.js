/* Trin 4 · Det nye i v9.78 (trin S4): kortet Niveau under Sang → Sang (mellem Spektrum og Taktslag).
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med stereo-testlyden: kortet regner hele sangen (LUFS integreret, LRA, topværdi, RMS, crest factor, klip)
   med tal, der passer til testlyden; V og H viser dB, mens der spilles, med topmærke og klip-tæller (samme lytter som Lydfil-noden); Nulstil nulstiller;
   Lyd over tid har rækken Lydstyrke med NIV.st (3 s hvert sekund). Ingen af tallene er lydtræk (BANDS og ANA_KILDER er uændrede). */
const path = require('path'), os = require('os'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Niveau');
  console.log('73 · Kortet Niveau (S4) · ' + path.basename(fil));
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-niv-')), st = lavTestlyd.stereo(path.join(d, 'stereo-niv.wav'));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.click('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(800);
      const r0 = await side.evaluate(() => ({ kort: [...document.querySelectorAll('#sg .sg-fane[data-sg="sang"] .sg-kort h4')].map(x => x.textContent), tekst: document.querySelector('#sg [data-niv="sang"]').textContent, bar: document.querySelectorAll('#sg .niv-nu .niv-bar').length, bands: BANDS.length, ana: Rytme.ANA_KILDER.length, lufsKilde: BANDS.some(b => /lufs/i.test(b[0])) || Rytme.ANA_KILDER.some(k => /lufs|crest/i.test(k.key)) }));
      T.tjek(r0.kort.join(',') === 'Bølgeform og sløjfe,Spektrum,Niveau,Taktslag' && /Vælg en lydfil/.test(r0.tekst) && r0.bar === 2 && !r0.lufsKilde, `${w} × ${h}: Niveau ligger mellem Spektrum og Taktslag med V/H-målere og teksten "${r0.tekst.trim()}"; LUFS og crest factor er ikke lydtræk (${r0.bands} lydtræk, ${r0.ana} analyse-kilder)`, JSON.stringify(r0));
      await side.setInputFiles('#file', st); await side.waitForFunction(() => /Analyse færdig og gemt i cache|Analyse hentet fra cache/.test(document.getElementById('status').textContent) && !!A, null, { timeout: 240000 });
      await side.waitForFunction(() => NIV.klar && NIV.buf === buf, null, { timeout: 60000 }); await side.waitForTimeout(600);
      const r1 = await side.evaluate(() => ({ res: NIV.res, st: NIV.st.length, dur, tal: [...document.querySelectorAll('#sg .niv-tal')].map(x => x.querySelector('span').textContent + ' ' + x.querySelector('b').textContent + ' ' + x.querySelector('small').textContent) }));
      const R = r1.res;
      T.tjek(R && R.lufs > -40 && R.lufs < 0 && R.lra >= 0 && R.lra < 30 && R.peakDb <= 1 && R.peakDb > -30 /* testlyden rammer loftet */ && R.rmsDb < R.peakDb && Math.abs(R.crest - (R.peakDb - R.rmsDb)) < 1e-6 && R.klip >= 0 && Math.abs(r1.st - Math.floor((r1.dur - 3) / 1 + 1)) <= 1 && r1.tal.length === 6, `${w} × ${h}: hele sangen er regnet: ${r1.tal.join(' · ')} (kortvarig lydstyrke: ${r1.st} tal for ${r1.dur} s)`, JSON.stringify(r1));
      if (w !== 1920) { T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n')); await ctx.close(); continue }
      /* V og H lige nu, mens der spilles; samme tal som Lydfil-noden */
      await side.evaluate(() => { tlSpring(5); play() }); await side.waitForTimeout(2500);
      const m = await side.evaluate(() => { const q = k => document.querySelector('#sg [data-niv="' + k + '"]'); const nodeL = ne3DbTxt(ne3Db(ne3Tap().L)); nivTik(); return { nodeL, L: q('Ldb').textContent, R: q('Rdb').textContent, wL: q('L').style.width, pL: q('pL').style.left, klip: q('klip').textContent, playing, tap: !!ne3Tap() } });
      const dbL = parseFloat(m.L.replace('−', '-').replace(',', '.')), nodeL = parseFloat(m.nodeL.replace('−', '-').replace(',', '.'));
      await side.evaluate(() => stop()); await side.waitForTimeout(400);
      const m2 = await side.evaluate(() => ({ L: document.querySelector('#sg [data-niv="Ldb"]').textContent, wL: document.querySelector('#sg [data-niv="L"]').style.width }));
      await side.evaluate(() => { NIV.klip = 7 }); await side.waitForTimeout(300); await side.click('#sg [data-niv="nul"]'); await side.waitForTimeout(300);
      const m3 = await side.evaluate(() => ({ klip: NIV.klip, tekst: document.querySelector('#sg [data-niv="klip"]').textContent, pL: NIV.peak.L }));
      T.tjek(m.playing && m.tap && Number.isFinite(dbL) && dbL > -60 && dbL < 0 && parseFloat(m.wL) > 0 && parseFloat(m.pL) >= parseFloat(m.wL) - 1 && Math.abs(dbL - nodeL) < 3 /* samme lytter, aflæst i samme øjeblik */ && m2.L === '–∞ dB' && parseFloat(m2.wL) === 0 && m3.klip === 0 && m3.tekst === '0' && m3.pL === 0, `mens der spilles viser V ${m.L} (Lydfil-noden: ${m.nodeL}) med topmærke ved ${m.pL}; stoppet viser –∞ dB; Nulstil sætter klip (7 → ${m3.klip}) og topmærket tilbage`, JSON.stringify({ m, m2, m3 }));
      /* Lyd over tid: rækken Lydstyrke */
      await side.click('#sg [data-sgf="avanceret"]'); await side.waitForTimeout(400); await side.click('[data-lotrk="lufs"]'); await side.waitForTimeout(700);
      const lo = await side.evaluate(() => { const c = document.getElementById('lot'), g = c.getContext('2d'), R = lotRaekker(); let y = 14, ud = null; R.forEach(r => { if (r.id === 'lufs') { const dta = g.getImageData(0, y + 2, c.width, r.h - 4).data; let n = 0; for (let i = 0; i < dta.length; i += 4) if (dta[i + 1] > 120 && dta[i] < 120) n++; ud = { groen: n, h: r.h } } y += r.h }); return { ud, rk: set.lot.rk.lufs, navn: LOT.rk.find(x => x[0] === 'lufs')[1] } });
      T.tjek(lo.rk && lo.ud && lo.ud.groen > 200 && lo.navn === 'Lydstyrke', `Lyd over tid har rækken ${lo.navn} (slås til), og kurven er tegnet (${lo.ud && lo.ud.groen} grønne punkter)`, JSON.stringify(lo));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
