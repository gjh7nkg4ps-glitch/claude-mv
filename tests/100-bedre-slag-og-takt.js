/* Trin 4 · Det nye i v9.117 (P8.30 trin 3, A3 første del): kick i lineær skala, taktslaget en halv slaglængde, takt 1 ud fra kick, snare og skift i klang.
   Ved 1920 × 1080: rækken "Bedre slag og takt (A3)" står i Analyse → Avanceret → Indstillinger for analysen; Analyse sikkerhed (Testlyd) med A3 til giver de nye tal
   (Kick 92, Kick · Trommer 94, Taktslag · Trommer 81, Takt · Trommer 76); et rigtigt klik på Fra giver præcis tallene fra før (60, 40, 33, 0); Til igen; med en sang
   indlæst siger rækken, om taktslaget er flyttet, og hvor sikker fasen er, og boblen ved Takt 1 siger det samme; rapporten siger, om A3 er til. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Bedre slag og takt'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('100 · Bedre slag og takt (A3, P8.30 trin 3) · ' + path.basename(fil));
  const browser = await chromium.launch(); const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const tal = () => side.evaluate(async () => { const d = await asKoer(), g = k => d.res[k].s; return { kick: g('kick'), tkick: g('stem:trommer:kick'), taktslag: g('ana:taktslag'), takt: g('ana:takt'), ttaktslag: g('stem:trommer:ana:taktslag'), ttakt: g('stem:trommer:ana:takt'), snare: g('snare'), hihat: g('hihat'), rap: asRapport().split('\n').find(l => /A3/.test(l)) } });
  const indst = async () => { await side.evaluate(() => { lay3Anvend('ao-sang'); dkVis('w35'); sgFane('avanceret'); sgIndstTegn(true) }); await side.waitForTimeout(800) };
  const klik = async v => { const p = await side.evaluate(v => { const b = document.querySelector('#sg [data-a3="' + v + '"]'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, v); await side.mouse.click(p.x, p.y); await side.waitForTimeout(600) };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500); await indst();
    const r0 = await side.evaluate(() => { const r = document.querySelector('#sg [data-a3r]'); return { tekst: r ? r.textContent : '', til: a3Til(), on: (document.querySelector('#sg [data-a3="1"]') || {}).className } });
    T.tjek(/Bedre slag og takt \(A3\)/.test(r0.tekst) && r0.til && /on/.test(r0.on), 'rækken "Bedre slag og takt (A3)" står i Indstillinger for analysen, og Til er valgt som standard', JSON.stringify(r0).slice(0, 200));
    const a = await tal(); console.log('  A3 til: ' + JSON.stringify(a));
    T.tjek(a.kick >= 85 && a.tkick >= 85 && a.ttaktslag >= 75 && a.ttakt >= 60 && a.taktslag >= 45 && /A3\): til/.test(a.rap), `Testlyd med A3 til: Kick ${a.kick}, Kick · Trommer ${a.tkick}, Taktslag ${a.taktslag}, Taktslag · Trommer ${a.ttaktslag}, Takt · Trommer ${a.ttakt}; rapporten siger "til"`, JSON.stringify(a));
    await indst(); await klik('0');
    const f0 = await side.evaluate(() => ({ a3: set.a3, gemt: JSON.parse(localStorage.getItem('rytme-set')).a3 }));
    const b = await tal(); console.log('  A3 fra: ' + JSON.stringify(b));
    T.tjek(f0.a3 === false && f0.gemt === false && b.kick === 60 && b.tkick === 40 && b.taktslag === 33 && b.takt === 33 && b.ttaktslag === 33 && b.ttakt === 0 && b.snare === a.snare && b.hihat === a.hihat && /A3\): fra/.test(b.rap), 'et rigtigt klik på Fra (gemt) giver præcis tallene fra før v9.117 (Kick 60, Kick · Trommer 40, Taktslag 33, Takt 1 33, Taktslag · Trommer 33, Takt · Trommer 0); Snare og Hihat er uændrede', JSON.stringify({ f0, b }));
    await indst(); await klik('1');
    const f1 = await side.evaluate(() => ({ a3: set.a3, til: a3Til() }));
    T.tjek(f1.a3 === undefined && f1.til, 'et rigtigt klik på Til slår A3 til igen (tilbage til standard)', JSON.stringify(f1));
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-a3-')), 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav); await side.waitForFunction(() => F && A && SHOWPROFIL && !document.getElementById('play').disabled, null, { timeout: 180000 }); await side.waitForTimeout(800);
    await indst();
    const s = await side.evaluate(() => { const r = document.querySelector('#sg [data-a3r]'); return { tekst: r ? r.textContent : '', bpm: Math.round(SHOWPROFIL.bpm), fk: SHOWPROFIL.faseKonf, a3: SHOWPROFIL.a3, boble: asBobleHtml('ana:takt') } });
    T.tjek(/Denne sang: taktslaget er (ikke flyttet|flyttet en halv slaglængde); fasens sikkerhed \d/.test(s.tekst) && s.a3 === true && Math.abs(s.bpm - 120) <= 2 && /Din sang:<\/b> fasens sikkerhed/.test(s.boble), `med en sang indlæst (${s.bpm} BPM) siger rækken, om taktslaget er flyttet, og hvor sikker fasen er (${(s.fk || 0).toFixed(2)}); boblen ved Takt 1 siger det samme`, JSON.stringify({ tekst: s.tekst.slice(-140), boble: s.boble.slice(-160) }));
    await side.evaluate(() => document.querySelector('#sg [data-a3r]').scrollIntoView({ block: 'center' })); await side.waitForTimeout(300);
    await side.screenshot({ path: path.join(UD, 'bedre-slag-og-takt.png') });
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
