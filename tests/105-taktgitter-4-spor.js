/* Trin 4 · Det nye i v9.124 (A3, tredje del): med 4 spor kommer taktgitteret fra Trommer-sporet.
   Ved 1920 × 1080: rækken "Taktgitter med 4 spor" står lige under Bedre slag og takt (A3) med Trommer-sporet som standard; Testlyd har rækkerne Taktslag · 4 spor
   (78) og Takt 1 · 4 spor (73) og bruger aldrig dine egne spor; 4 spor (testen laver dem selv: trommer på slagene, bas og melodi på modslaget, akkorder pr. takt)
   hentes med rigtige klik: taktgitteret kommer fra Trommer-sporet, og taktslagene rammer trommernes slag; rækken og cirklen ved Taktslag siger det (boblen
   forklarer); et rigtigt klik på Hele lyden giver hele lydens gitter, og Trommer-sporet giver det igen; med A3 slået fra er knapperne grå; Rigtige trommer
   (testmappen fra test 99) har rækkerne Taktslag · 4 spor og Takt 1 · 4 spor; ingen fejl i konsollen. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const { lavMappe } = require('./99-rigtige-trommer');
function wav(fil, x, sr) { const n = x.length, b = Buffer.alloc(44 + n * 2); b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22); b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(x[i] * 26000))), 44 + i * 2); fs.writeFileSync(fil, b) }
/* 4 spor ved 120 BPM i 20 s: trommer (kick på hvert slag, snare på 2 og 4, hihat på ottendedele), bas og melodi på modslaget, akkord-flade, der skifter hver takt */
function lavSpor(mappe, sek = 20, bpm = 120, sr = 22050) { const n = sek * sr, sl = 60 / bpm, T = { trommer: new Float32Array(n), bas: new Float32Array(n), vokal: new Float32Array(n), resten: new Float32Array(n) }; let s = 3; const r = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
  const læg = (a, t, dur, f) => { const i0 = Math.round(t * sr); for (let i = 0; i < dur * sr && i0 + i < n; i++) a[i0 + i] += f(i / sr) };
  const beats = []; for (let b = 0; (b + 1) * sl <= sek; b++) { const t = .5 + b * sl; if (t > sek - .3) break; beats.push(t);
    læg(T.trommer, t, .25, u => .9 * Math.sin(2 * Math.PI * (50 + 100 * Math.exp(-u * 30)) * u) * Math.exp(-u * 12));
    if (b % 2 === 1) læg(T.trommer, t, .15, u => .5 * r() * Math.exp(-u * 25));
    for (const h of [0, .5]) læg(T.trommer, t + h * sl, .04, u => .2 * r() * Math.exp(-u * 90));
    læg(T.bas, t + sl / 2, .2, u => .8 * Math.sin(2 * Math.PI * 55 * u) * Math.min(1, u * 400) * Math.exp(-u * 8));
    læg(T.vokal, t + sl * .5, .15, u => .3 * Math.sin(2 * Math.PI * [440, 523, 587, 659][b % 4] * u) * Math.min(1, u * 300) * Math.exp(-u * 6));
    if (b % 4 === 0) { const ak = [[220, 277, 330], [196, 247, 294], [175, 220, 262], [165, 208, 247]][(b / 4) % 4]; læg(T.resten, t, sl * 4, u => ak.reduce((q, f) => q + .08 * Math.sin(2 * Math.PI * f * u), 0) * Math.min(1, u * 20)) } }
  for (const k in T) wav(path.join(mappe, k + '.wav'), T[k], sr); return beats }
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Taktgitter med 4 spor'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('105 · Taktgitter fra Trommer-sporet (A3, tredje del) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-gitter-')), beats = lavSpor(tmp), { M } = lavMappe(tmp);
  const browser = await chromium.launch(); const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const indst = async () => { await side.evaluate(() => { lay3Anvend('ao-sang'); dkVis('w35'); sgFane('avanceret'); sgIndstTegn(true) }); await side.waitForTimeout(800) };
  const klik = async sel => { const p = await side.evaluate(sel => { const b = document.querySelector(sel); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(900) };
  const ramt = () => side.evaluate(B => { const P = SHOWPROFIL, tb = P.beats.map(k => (k + 1) * P.dtf); let h = 0; B.forEach(t => { if (tb.some(x => Math.abs(x - t) <= .07)) h++ }); return { gitter: P.gitter, ramt: Math.round(100 * h / B.length), bpm: Math.round(P.bpm) } }, beats);
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500); await indst();
    const r0 = await side.evaluate(() => { const k = document.querySelector('#sg [data-sgk="indst"]'), a = k.querySelector('[data-a3r]'), g = k.querySelector('[data-a3sr]'); return { efter: !!(a && a.nextElementSibling === g), tekst: g ? g.textContent : '', on: (g && g.querySelector('[data-a3s="1"]') || {}).className, til: a3SporTil() } });
    T.tjek(r0.efter && /Taktgitter med 4 spor/.test(r0.tekst) && /on/.test(r0.on) && r0.til, 'rækken "Taktgitter med 4 spor" står lige under Bedre slag og takt (A3), og Trommer-sporet er valgt som standard', JSON.stringify(r0).slice(0, 300));
    /* hent 4 spor med rigtige klik */
    await side.evaluate(() => { dkVis('w35'); sgFane('spor') }); await side.waitForSelector('#stem-brug', { timeout: 10000 });
    for (const s of ['trommer', 'bas', 'vokal', 'resten']) await side.setInputFiles(`[data-stem-input="${s}"]`, path.join(tmp, s + '.wav'));
    await side.waitForFunction(() => STEM_SPOR.every(([s]) => STEM.buf[s]), null, { timeout: 60000 }); await side.waitForTimeout(400);
    await klik('#stem-brug'); await side.waitForFunction(() => STEM.klar && F && A && SHOWPROFIL && !document.getElementById('play').disabled, null, { timeout: 300000 }); await side.waitForTimeout(600);
    const g1 = await ramt(); await indst();
    const t1 = await side.evaluate(() => ({ a3: (document.querySelector('#sg [data-a3r]') || {}).textContent || '', sr: (document.querySelector('#sg [data-a3sr]') || {}).textContent || '' }));
    T.tjek(g1.gitter === 'trommer' && g1.ramt >= 90 && /taktgitteret kommer fra Trommer-sporet \(4 spor\)/.test(t1.a3) && /Denne sang:.*taktgitteret kommer fra Trommer-sporet/.test(t1.sr), `med 4 spor kommer taktgitteret fra Trommer-sporet: ${g1.ramt} % af trommernes slag ramt (${g1.bpm} BPM); begge rækker siger det`, JSON.stringify({ g1, t1: { a3: t1.a3.slice(-160), sr: t1.sr.slice(-80) } }));
    await side.evaluate(() => document.querySelector('#sg [data-a3sr]').scrollIntoView({ block: 'center' })); await side.waitForTimeout(300);
    await side.screenshot({ path: path.join(UD, 'taktgitter-4-spor.png') });
    await klik('#sg [data-a3s="0"]'); const g2 = await ramt();
    T.tjek(g2.gitter === 'hele' && (await side.evaluate(() => set.a3spor === false && JSON.parse(localStorage.getItem('rytme-set')).a3spor === false)), `et rigtigt klik på Hele lyden: taktgitteret kommer fra hele lyden (${g2.ramt} % ramt), og valget er gemt`, JSON.stringify(g2));
    await indst(); await klik('#sg [data-a3s="1"]'); const g3 = await ramt();
    T.tjek(g3.gitter === 'trommer' && g3.ramt === g1.ramt && (await side.evaluate(() => set.a3spor === undefined)), 'et rigtigt klik på Trommer-sporet giver Trommer-sporets gitter igen (tilbage til standard)', JSON.stringify(g3));
    /* Testlyd: rækkerne for 4 spor, uden at dine egne spor bruges */
    const a = await side.evaluate(async () => { Regler.tilfoej(mk('ana:taktslag', 'puls', .3, 1, 20, 200)); const d = await asKoer(); const c = document.createElement('div'); c.innerHTML = asCirkel('ana:taktslag'); return { s4: d.res['x:taktslag:4spor'].s, t4: d.res['x:takt:4spor'].s, slag: d.res['ana:taktslag'].s, kick: d.res.kick.s, cirkel: c.textContent, boble: asBobleHtml('ana:taktslag'), navn: asNavn('x:taktslag:4spor'), rk: [...document.querySelectorAll('#as-rude tr[data-asr]')].map(r => r.dataset.asr) } });
    T.tjek(a.s4 === 78 && a.t4 === 73 && a.slag === 49 && a.kick === 92, `Testlyd · 4 spor: Taktslag ${a.s4}, Takt 1 ${a.t4} (hele lyden: Taktslag ${a.slag}); dine egne 4 spor bruges ikke i testen (Kick ${a.kick} som altid)`, JSON.stringify({ s4: a.s4, t4: a.t4, slag: a.slag, kick: a.kick }));
    T.tjek(a.cirkel === String(a.s4) && /får taktgitteret fra Trommer-sporet/.test(a.boble) && /Taktslag · 4 spor/.test(a.navn), `med 4 spor viser cirklen ved Taktslag ${a.cirkel} (tallet for 4 spor), og boblen forklarer hvorfor`, JSON.stringify({ cirkel: a.cirkel, boble: a.boble.slice(0, 260) }));
    /* A3 fra: knapperne er grå */
    await indst(); await klik('#sg [data-a3="0"]'); await indst();
    const f = await side.evaluate(() => ({ dis: [...document.querySelectorAll('#sg [data-a3s]')].every(b => b.disabled), gitter: SHOWPROFIL.gitter }));
    T.tjek(f.dis && f.gitter === 'hele', 'med Bedre slag og takt (A3) slået fra er knapperne grå, og hele lyden bruges (som før v9.117)', JSON.stringify(f));
    await klik('#sg [data-a3="1"]');
    /* Rigtige trommer (testmappen fra test 99) */
    await side.evaluate(() => { asAaben('kick') }); await side.waitForTimeout(1200);
    await side.setInputFiles('#as-mdb-fil', M); await side.waitForFunction(() => !MDB.koerer && MDB.data && MDB.data.res && MDB.data.spor4, null, { timeout: 300000 }); await side.waitForTimeout(400);
    const m = await side.evaluate(() => { const R = MDB.data.res.mix; return { spor4: MDB.data.spor4, n: R.taktslag4 && R.taktslag4.n, nb: R.taktslag.n, n1: R.takt4 && R.takt4.n, nt: R.takt.n, rk: [...document.querySelectorAll('#as-mdb tr[data-mdbr] td.as-nv')].map(x => x.textContent).slice(-2), hv: (document.querySelector('#as-mdb details.as-hvordan') || {}).textContent || '' } });
    T.tjek(m.spor4 === 2 && m.n === m.nb && m.n1 === m.nt && JSON.stringify(m.rk) === JSON.stringify(['Taktslag · 4 spor', 'Takt 1 · 4 spor']) && /Taktslag · 4 spor og Takt 1 · 4 spor: hele mixet analyseres med kun trommerne som Trommer-spor/.test(m.hv), 'Rigtige trommer har rækkerne Taktslag · 4 spor og Takt 1 · 4 spor (2 stykker, samme facit som Taktslag og Takt 1), og "Sådan måles" forklarer dem', JSON.stringify(m).slice(0, 300));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
module.exports.lavSpor = lavSpor; /* bruges også til skærmbilleder */
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
