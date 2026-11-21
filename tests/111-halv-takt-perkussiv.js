/* Trin 4 · Det nye i v9.132 (P8.33 trin 2): den halve takt afgøres af den perkussive del (HPSS). Ved 1920 × 1080:
   den perkussive kick (a3hpssKick) er høj på kicket og lav, hvor en bas, der varer ved, begynder (lavet i siden: kick på slagene, bas på modslaget);
   Testlyd: Taktslag 65 og Takt 1 45 med Perkussiv del (standard); et rigtigt klik på Hele lyden giver 49 og 31 (som før), Perkussiv del igen 65; rækken
   "Halv takt uden spor" står efter "Taktgitter med 4 spor" og er grå med A3 slået fra; med en sang regnes den perkussive del i baggrunden og gemmes i cachen,
   rækken siger, hvad der skete, og anden gang kommer den fra cachen; "Sådan måles det" siger det om Breakbeat; ingen konsolfejl. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Halv takt fra den perkussive del'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('111 · Halv takt fra den perkussive del (P8.33 trin 2) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-hpss-')), wav = lavTestlyd(path.join(tmp, 'testlyd-120bpm.wav'));
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage(); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const indst = async () => { await side.evaluate(() => { lay3Anvend('ao-sang'); dkVis('w35'); sgFane('avanceret'); sgIndstTegn(true) }); await side.waitForTimeout(800) };
  const klik = async sel => { const p = await side.evaluate(sel => { const b = document.querySelector(sel); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(900) };
  const tal = () => side.evaluate(async () => { const d = await asKoer(); return { slag: d.res['ana:taktslag'].s, takt: d.res['ana:takt'].s, tslag: d.res['stem:trommer:ana:taktslag'].s, ttakt: d.res['stem:trommer:ana:takt'].s, kick: d.res.kick.s } });
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500);
    /* den perkussive kick på en lyd lavet i siden */
    const pk = await side.evaluate(() => { const sr = 44100, sek = 8, n = sr * sek, x = new Float32Array(n), sl = .5; for (let b = 0; b * sl < sek - .5; b++) { const t0 = Math.round(b * sl * sr); for (let i = 0; i < .2 * sr && t0 + i < n; i++) { const u = i / sr; x[t0 + i] += .8 * Math.sin(2 * Math.PI * (50 + 80 * Math.exp(-u * 30)) * u) * Math.exp(-u * 14) } const t1 = Math.round((b * sl + sl / 2) * sr); for (let i = 0; i < .45 * sr && t1 + i < n; i++) { const u = i / sr; x[t1 + i] += .5 * Math.sin(2 * Math.PI * 55 * u) * Math.min(1, u / .03) } }
      const ab = new AudioBuffer({ length: n, numberOfChannels: 1, sampleRate: sr }); ab.copyToChannel(x, 0); const nf = Math.floor((n - 2048) / 1024), k = a3hpssKick(a3hMono(ab), sr, nf), dtf = 1024 / sr; let paa = 0, mel = 0, m = 0; for (let b = 1; b * sl < sek - 1; b++) { const v = t => { let q = 0; const f = Math.round(t / dtf) - 1; for (let d = -1; d <= 2; d++)q = Math.max(q, k[f + d] || 0); return q }; paa += v(b * sl); mel += v(b * sl + sl / 2); m++ } return { paa: +(paa / m).toFixed(2), mel: +(mel / m).toFixed(2), n: k.length, nf } });
    T.tjek(pk.n === pk.nf && pk.paa > .5 && pk.mel < pk.paa / 3, `den perkussive kick: ${pk.paa} på kicket, ${pk.mel} hvor bassen (der varer ved) begynder mellem slagene`, JSON.stringify(pk));
    const a = await tal(); T.tjek(a.slag === 65 && a.takt === 45 && a.tslag === 81 && a.ttakt === 76 && a.kick === 92, `Testlyd med Perkussiv del (standard): Taktslag ${a.slag}, Takt 1 ${a.takt} (hele lyden); kun trommerne ${a.tslag} og ${a.ttakt} som før`, JSON.stringify(a));
    await indst(); const r0 = await side.evaluate(() => { const k = document.querySelector('#sg [data-sgk="indst"]'), s = k.querySelector('[data-a3sr]'), h = k.querySelector('[data-a3hr]'); return { efter: !!(s && s.nextElementSibling === h), on: h && h.querySelector('[data-a3h="1"]').className, tekst: h ? h.textContent : '' } });
    T.tjek(r0.efter && /on/.test(r0.on) && /Halv takt uden spor/.test(r0.tekst), 'rækken "Halv takt uden spor" står lige efter "Taktgitter med 4 spor", og Perkussiv del er valgt som standard', JSON.stringify(r0).slice(0, 200));
    await klik('#sg [data-a3h="0"]'); const b = await tal(); const g0 = await side.evaluate(() => ({ s: set.a3perk, gemt: JSON.parse(localStorage.getItem('rytme-set')).a3perk }));
    T.tjek(b.slag === 49 && b.takt === 31 && g0.s === false && g0.gemt === false, `et rigtigt klik på Hele lyden (gemt) giver tallene fra før: Taktslag ${b.slag}, Takt 1 ${b.takt}`, JSON.stringify({ b, g0 }));
    await indst(); await klik('#sg [data-a3h="1"]'); const c = await tal(); T.tjek(c.slag === 65 && c.takt === 45, 'et rigtigt klik på Perkussiv del giver 65 og 45 igen', JSON.stringify(c));
    await indst(); await klik('#sg [data-a3="0"]'); await indst(); const d = await side.evaluate(() => [...document.querySelectorAll('#sg [data-a3h]')].every(x => x.disabled)); await klik('#sg [data-a3="1"]');
    T.tjek(d, 'med Bedre slag og takt (A3) slået fra er knapperne grå', String(d));
    /* en sang: regnes i baggrunden og gemmes i cachen */
    await side.setInputFiles('#file', wav); await side.waitForFunction(() => F && A && SHOWPROFIL && A3H.sang.kick && !A3H.sang.regner && !document.getElementById('play').disabled, null, { timeout: 180000 }); await side.waitForTimeout(1500); await indst();
    const s1 = await side.evaluate(async () => ({ n: A3H.sang.kick.length, nf: F.kick.length, halv: SHOWPROFIL.halv, cache: !!(await cacheGet(a3hNoegle())), tekst: (document.querySelector('#sg [data-a3hr]') || {}).textContent || '' }));
    T.tjek(Math.abs(s1.n - s1.nf) <= 3 && s1.halv === 'perkussiv' && s1.cache && /Denne sang: den halve takt er afgjort med den perkussive del/.test(s1.tekst), `med en sang regnes den perkussive del i baggrunden (${s1.n} rammer) og gemmes i cachen; rækken siger det`, JSON.stringify(s1).slice(0, 300));
    await side.evaluate(() => document.querySelector('#sg [data-a3hr]').scrollIntoView({ block: 'center' })); await side.waitForTimeout(300);
    await side.screenshot({ path: path.join(UD, 'halv-takt-perkussiv.png') });
    await side.reload(); await side.waitForTimeout(4500); const t0 = Date.now(); await side.setInputFiles('#file', wav); await side.waitForFunction(() => F && SHOWPROFIL && A3H.sang.kick && !A3H.sang.regner, null, { timeout: 180000 }); const s2 = Date.now() - t0;
    T.tjek(await side.evaluate(() => SHOWPROFIL.halv === 'perkussiv'), `anden gang kommer den perkussive del fra cachen (sangen klar på ${(s2 / 1000).toFixed(1)} s)`, String(s2));
    await side.evaluate(() => { asAaben('ana:taktslag') }); await side.waitForTimeout(1000);
    const hv = await side.evaluate(() => (document.querySelector('#as-rude [data-a3hb]') || {}).textContent || '');
    T.tjek(/Breakbeat/.test(hv) && /modslaget/.test(hv), '"Sådan måles det" siger, at Breakbeat kan være musikken', hv.slice(0, 120));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
