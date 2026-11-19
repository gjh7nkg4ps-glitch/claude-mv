/* Trin 4 · Det nye i v9.95 (P8.14 svar 2B): kortet Detektion under Sang → Avanceret (før det skjulte vindue Detektions-tuning).
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med testlyden (kick på hvert slag ved 120 BPM): kortet ligger efter Spektrum+ med teksten om tap med hånden,
   tolerance-skyderen, knapperne K og S og Ryd; uden analyse står "Analysér en sang først"; efter analysen giver tryk på K (rigtige tastetryk, lagt på kickens
   tidspunkter) en hit-rate i procent, der står stort (.det-pct), og Ryd (rigtigt klik) tømmer. Vinduet w20 er skjult og tomt. Skærmbillede: tests/ud/detektion.png. */
const path = require('path'), os = require('os'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Detektion'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('86 · Kortet Detektion · ' + path.basename(fil));
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-det-')), lyd = lavTestlyd(path.join(d, 'det.wav'));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.click('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(800); await side.click('#sg [data-sgf="avanceret"]'); await side.waitForTimeout(400);
      const r0 = await side.evaluate(() => { const k = document.querySelector('#sg .sg-kort[data-kort="det"]'); const w20 = document.getElementById('w20'); return { kort: [...document.querySelectorAll('#sg .sg-fane[data-sg="avanceret"] .sg-kort h4')].map(x => x.textContent), tekst: k ? k.textContent : '', tol: !!(k && k.querySelector('#s-tol')), knapper: k ? [...k.querySelectorAll('button')].map(b => b.textContent) : [], tune: (document.getElementById('tune') || {}).textContent, w20: w20 ? { hidden: w20.hidden, tom: !w20.querySelector('#tune') } : null } });
      T.tjek(r0.kort.join(',') === 'Lyd over tid,Toner og klang,Stereo,Spektrum+,Detektion,Indstillinger for analysen' && /Tap med hånden er omtrentligt/.test(r0.tekst) && /30 til 50 ms/.test(r0.tekst) && r0.tol && r0.knapper.join('|') === 'Markér kick (K)|Markér snare (S)|Ryd' && /Analysér en sang først/.test(r0.tune) && r0.w20 && r0.w20.hidden && r0.w20.tom, `${w} × ${h}: kortet Detektion ligger efter Spektrum+ med teksten om tap, tolerancen, K, S og Ryd; w20 er skjult og tomt`, JSON.stringify({ kort: r0.kort, tol: r0.tol, knapper: r0.knapper, tune: r0.tune, w20: r0.w20 }));
      await side.setInputFiles('#file', lyd); await side.waitForFunction(() => /Analyse færdig og gemt i cache|Analyse hentet fra cache/.test(document.getElementById('status').textContent), null, { timeout: 240000 });
      /* tryk K på kickens tidspunkter (slag hvert 0,5 s ved 120 BPM); rigtige tastetryk, mens tiden sættes */
      /* fokus væk fra filfeltet (tastetryk i et felt tæller ikke) */
      { const q = await side.evaluate(() => { const k = document.querySelector('#sg .sg-kort[data-kort="det"] h4'); k.scrollIntoView({ block: 'center' }); const r = k.getBoundingClientRect(); return { x: r.x + 5, y: r.y + r.height / 2 } }); await side.mouse.click(q.x, q.y); await side.waitForTimeout(100); }
      const fokus = await side.evaluate(() => ({ tag: document.activeElement.tagName, kbOn: typeof kbOn !== 'undefined' ? kbOn : null }));
      for (const t of [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5]) { await side.evaluate(t => { tlSpring(t) }, t); await side.keyboard.press('k'); await side.waitForTimeout(60); }
      const r1 = await side.evaluate(() => { const p = document.querySelector('#tune .det-pct'); return { pct: p ? p.textContent : null, tekst: document.getElementById('tune').textContent, n: marks.kick.length } });
      const pct = r1.pct ? parseInt(r1.pct) : -1;
      T.tjek(r1.n === 8 && pct >= 50 && /Kick.*ramt \d+ af 8 tryk/.test(r1.tekst) && /bedste tærskel/.test(r1.tekst), `${w} × ${h}: 8 tryk på K giver hit-raten ${r1.pct} stort og en tekst med ramt, falske alarmer og bedste tærskel`, JSON.stringify({ ...r1, fokus }).slice(0, 300));
      if (w === 2560) await side.locator('#sg .sg-kort[data-kort="det"]').screenshot({ path: path.join(UD, 'detektion.png') });
      const p = await side.evaluate(() => { const b = document.getElementById('clr'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.click(p.x, p.y); await side.waitForTimeout(300);
      const r2 = await side.evaluate(() => ({ n: marks.kick.length, tekst: document.getElementById('tune').textContent }));
      T.tjek(r2.n === 0 && /ingen tryk endnu/.test(r2.tekst), `${w} × ${h}: Ryd (rigtigt klik) tømmer målingen`, JSON.stringify(r2));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
