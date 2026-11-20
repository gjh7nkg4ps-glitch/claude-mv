/* Trin 4 · Det nye i v9.123 (A3, anden del): fasens sikkerhed er takternes enighed, og Rigtige trommer måler hele mixet med toner (trin 2).
   Ved 1920 × 1080: rampen fra enighed til sikkerhed (med og uden toner); Testlyd: sikkerheden ligger mellem 0,20 og 0,95, Drum and bass (takt 1 rigtig) giver 0,95
   og Hip-hop med bas (taktslagene ligger forkert) 0,20; med en sang indlæst står "i N af M takter peger … på samme takt 1" i rækken Bedre slag og takt (A3) og i
   boblen ved Takt 1; et rigtigt klik på Fra fjerner takternes stemmer (alt som før v9.117), Til giver dem igen; Rigtige trommer (lille testmappe som i test 99):
   hele mixet får trin 2, rapporten og "Sådan måles" siger det, og anden gang kommer alt fra cachen; ingen fejl i konsollen. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd'), { lavMappe } = require('./99-rigtige-trommer');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Fasens sikkerhed'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('104 · Fasens sikkerhed (A3, anden del) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-fase-')), { M } = lavMappe(tmp);
  const browser = await chromium.launch(); const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const indst = async () => { await side.evaluate(() => { lay3Anvend('ao-sang'); dkVis('w35'); sgFane('avanceret'); sgIndstTegn(true) }); await side.waitForTimeout(800) };
  const klik = async v => { const p = await side.evaluate(v => { const b = document.querySelector('#sg [data-a3="' + v + '"]'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, v); await side.mouse.click(p.x, p.y); await side.waitForTimeout(800) };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500);
    const ramp = await side.evaluate(() => [[0, 1], [.1, 1], [.25, 1], [1, 1], [0, 0], [.25, 0], [.5, 0], [1, 0]].map(([e, t]) => Math.round(a3FaseKonf(e, !!t) * 100) / 100));
    T.tjek(JSON.stringify(ramp) === JSON.stringify([.2, .5, .95, .95, .25, .45, .65, .65]), `rampen: med toner 0,20 → 0,95 (enighed 0 → 0,25), uden toner 0,25 → 0,65 (enighed 0 → 0,5): ${ramp.join(' ')}`, JSON.stringify(ramp));
    const t = await side.evaluate(async () => { const d = await asKoer(); return { bpm: d.bpm, rap: asRapport() } });
    const fk = Object.values(t.bpm).map(x => x[2]);
    T.tjek(fk.every(x => x >= .2 && x <= .95) && t.bpm.dnb[2] === .95 && t.bpm.dnb[4] === t.bpm.dnb[1] && t.bpm.hip[2] === .2 && t.bpm.hip[4] === null && /fase-sikkerhed 0\.95/.test(t.rap),
      `Testlyd: fasens sikkerhed ligger mellem 0,20 og 0,95 (${fk.join(' ')}); Drum and bass (takt 1 rigtig) 0,95; Hip-hop med bas (taktslagene ved siden af) 0,20`, JSON.stringify(t.bpm));
    const wav = lavTestlyd(path.join(tmp, 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav); await side.waitForFunction(() => F && A && SHOWPROFIL && SHOWPROFIL.faseInfo && !document.getElementById('play').disabled, null, { timeout: 180000 }); await side.waitForTimeout(800);
    await indst();
    const s = await side.evaluate(() => { const r = document.querySelector('#sg [data-a3r]'), I = SHOWPROFIL.faseInfo; return { tekst: r ? r.textContent : '', I: { ja: I.ja, nb: I.nb, toner: I.toner, st: I.stemmer.length }, fk: SHOWPROFIL.faseKonf, fkV: Math.round(a3FaseKonf(Math.max(0, (I.ja / I.nb - .25) / .75), I.toner) * 100) / 100, boble: asBobleHtml('ana:takt') } });
    const m = /i (\d+) af (\d+) takter peger kick, snare og skift i klang og toner på samme takt 1/.exec(s.tekst);
    T.tjek(m && +m[1] === s.I.ja && +m[2] === s.I.nb && s.I.nb === s.I.st && s.I.nb >= 10 && s.I.toner && /i \d+ af \d+ takter peger/.test(s.boble) && s.fk === s.fkV,
      `med en sang: rækken siger "i ${s.I.ja} af ${s.I.nb} takter peger … på samme takt 1" (sikkerhed ${String(s.fk).replace('.', ',')}), og boblen ved Takt 1 siger det samme`, JSON.stringify(s).slice(0, 400));
    await side.evaluate(() => document.querySelector('#sg [data-a3r]').scrollIntoView({ block: 'center' })); await side.waitForTimeout(300);
    await side.screenshot({ path: path.join(UD, 'fasens-sikkerhed.png') });
    await klik('0'); await indst();
    const f = await side.evaluate(() => ({ I: SHOWPROFIL && SHOWPROFIL.faseInfo, tekst: (document.querySelector('#sg [data-a3r]') || {}).textContent || '' }));
    T.tjek(!f.I && !/takter peger/.test(f.tekst), 'et rigtigt klik på Fra: ingen stemmer pr. takt (alt som før v9.117)', JSON.stringify(f).slice(0, 300));
    await klik('1'); await indst();
    const g = await side.evaluate(() => ({ I: !!(SHOWPROFIL && SHOWPROFIL.faseInfo), tekst: (document.querySelector('#sg [data-a3r]') || {}).textContent || '' }));
    T.tjek(g.I && /takter peger/.test(g.tekst), 'et rigtigt klik på Til giver stemmerne igen', JSON.stringify(g).slice(0, 300));
    await side.evaluate(() => { asAaben('kick') }); await side.waitForTimeout(1200);
    const t1 = Date.now(); await side.setInputFiles('#as-mdb-fil', M); await side.waitForFunction(() => !MDB.koerer && MDB.data && MDB.data.res, null, { timeout: 300000 }); const s1 = Date.now() - t1;
    const r1 = await side.evaluate(() => ({ toner: MDB.data.toner, h: MDB.data.hist.slice(-1)[0].toner, hentet: MDB.data.hentet, rap: asRapport(), hv: (document.querySelector('#as-mdb details.as-hvordan') || {}).textContent || '' }));
    T.tjek(r1.toner === true && r1.h === true && r1.hentet === 0 && /hele mixet med toner \(trin 2\)/.test(r1.rap) && /Hele mixet analyseres med begge trin/.test(r1.hv), `Rigtige trommer: hele mixet får trin 2 (${(s1 / 1000).toFixed(1)} s første gang); rapporten og "Sådan måles" siger det`, JSON.stringify({ toner: r1.toner, hentet: r1.hentet }));
    const t2 = Date.now(); await side.evaluate(() => { MDB.data.dato = 0 }); await side.setInputFiles('#as-mdb-fil', M); await side.waitForFunction(() => !MDB.koerer && MDB.data && MDB.data.dato > 0, null, { timeout: 120000 }); const s2 = Date.now() - t2;
    const r2 = await side.evaluate(() => ({ hentet: MDB.data.hentet, toner: MDB.data.toner }));
    T.tjek(r2.hentet === 4 && r2.toner, `anden gang kommer alle 4 lydfiler fra cachen, også trin 2 (${(s2 / 1000).toFixed(1)} s)`, JSON.stringify(r2));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
