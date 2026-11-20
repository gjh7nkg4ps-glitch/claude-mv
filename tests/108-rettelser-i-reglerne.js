/* Trin 4 · Det nye i v9.127 (A4, anden del): dine rettelser bruges af reglerne. Ved 1920 × 1080 med testlyden (30 s, 120 BPM):
   et slettet kick giver 0 i kurven Kick (det, reglerne læser), et tilføjet snare giver en top, et flyttet kick er væk det gamle sted og findes det nye; slettet
   Takt 1 giver 0 i kurven Takt (første slag); hændelserne i Lyd over tid regnes stadig af de urørte kurver; Analyse sikkerhed giver de samme tal med rettelser;
   et rigtigt klik på "Rettelser i reglerne" (Fra) giver de urørte kurver, og Til giver rettelserne igen; Normalisering Fast/Adaptiv beholder rettelserne; ingen konsolfejl. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Rettelser i reglerne'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('108 · Rettelser i reglerne (A4, anden del) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-tlr-')), wav = lavTestlyd(path.join(tmp, 'testlyd-120bpm.wav'));
  const browser = await chromium.launch(); const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const klik = async sel => { const p = await side.evaluate(sel => { const b = document.querySelector(sel); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); if (!p) throw new Error('findes ikke: ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(600) };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500); const a0 = await side.evaluate(async () => { const d = await asKoer(); return { kick: d.res.kick.s, takt: d.res['ana:takt'].s } });
    await side.setInputFiles('#file', wav); await side.waitForFunction(() => F && A && SHOWPROFIL && SHOWPROFIL.faseInfo && !document.getElementById('play').disabled, null, { timeout: 180000 }); await side.waitForTimeout(800);
    await side.evaluate(async () => { lay3Anvend('ao-sang'); dkVis('w35'); sgFane('avanceret'); await new Promise(r => setTimeout(r, 900)); document.getElementById('lot').scrollIntoView({ block: 'center' }) }); await side.waitForTimeout(400);
    const mx = `(k,t)=>{const dtf=H/sr,f=Math.round(t/dtf)-1;let m=0;for(let d=-2;d<=3;d++){const v=(k==='takt'?A['ana:takt']:F[k])[f+d]||0;if(v>m)m=v}return +m.toFixed(3)}`;
    const p = await side.evaluate(mx => { const MX = eval(mx), L = tlHaend(), k = L.filter(e => e.spor === 'kick'), s = L.filter(e => e.spor === 'snare'), t1 = L.filter(e => e.spor === 'takt1'); let tn = 12.25; while (s.some(e => Math.abs(e.t - tn) < .3)) tn += .37;
      return { k5: k[5].t, k9: k[9].t, k13: k[13].t, tak: t1[4].t, tn, f5: MX('kick', k[5].t), f9: MX('kick', k[9].t), f13: MX('kick', k[13].t), fn: MX('snare', tn), ft: MX('takt', t1[4].t), nk: k.length, til: tlrTil() } }, mx);
    /* rettelser: slet kick 5, flyt kick 9 en halv slaglængde, ny snare, slet takt 1 nr. 4 */
    await side.evaluate(p => { const R = { slet: [{ spor: 'kick', t: p.k5 }, { spor: 'takt1', t: p.tak }], flyt: [{ spor: 'kick', fra: p.k9, til: +(p.k9 + .25).toFixed(3) }], ny: [{ spor: 'snare', t: p.tn }] }; tlRetGem(R, '') }, p); await side.waitForTimeout(300);
    const q = await side.evaluate(([mx, p]) => { const MX = eval(mx); return { f5: MX('kick', p.k5), f9: MX('kick', p.k9), f9ny: MX('kick', p.k9 + .25), f13: MX('kick', p.k13), fn: MX('snare', p.tn), ft: MX('takt', p.tak), nk: tlHaend().filter(e => e.spor === 'kick').length, raa: tlRaa().filter(e => e.spor === 'kick').length, antal: TLR.antal } }, [mx, p]);
    T.tjek(p.til && p.f5 > .3 && q.f5 === 0 && q.f9 === 0 && q.f9ny >= .99 && q.f13 === p.f13 && q.fn >= .99 && p.fn < .99 && p.ft > .9 && q.ft < .05 && q.antal === 4,
      `reglernes kurver følger rettelserne: slettet kick ${p.f5} → 0, flyttet kick 0 det gamle sted og ${q.f9ny} det nye, nyt snare ${p.fn} → ${q.fn}, slettet Takt 1 ${p.ft} → ${q.ft}; et urørt kick er uændret (${q.f13})`, JSON.stringify({ p, q }));
    T.tjek(q.raa === p.nk && q.nk === p.nk - 1, `hændelserne i Lyd over tid regnes stadig af de urørte kurver (${q.raa} kick fundet; med rettelserne ${q.nk})`, JSON.stringify(q));
    const a1 = await side.evaluate(async () => { const d = await asKoer(); return { kick: d.res.kick.s, takt: d.res['ana:takt'].s } }); const q1 = await side.evaluate(([mx, p]) => eval(mx)('kick', p.k5), [mx, p]);
    T.tjek(a1.kick === a0.kick && a1.takt === a0.takt && q1 === 0, `Analyse sikkerhed giver de samme tal med rettelser (Kick ${a1.kick}, Takt 1 ${a1.takt}), og rettelserne er der stadig bagefter`, JSON.stringify({ a0, a1, q1 }));
    await klik('.tl-bar [data-tlr]'); const f0 = await side.evaluate(([mx, p]) => { const MX = eval(mx); return { til: tlrTil(), gemt: JSON.parse(localStorage.getItem('rytme-set')).tlRegler, f5: MX('kick', p.k5), fn: MX('snare', p.tn), ft: MX('takt', p.tak), knap: document.querySelector('.tl-bar [data-tlr]').textContent } }, [mx, p]);
    T.tjek(!f0.til && f0.gemt === false && f0.f5 === p.f5 && f0.fn === p.fn && f0.ft === p.ft && /Fra/.test(f0.knap), `et rigtigt klik på "Rettelser i reglerne" (Fra): kurverne er urørte igen (kick ${f0.f5}, snare ${f0.fn}, takt ${f0.ft})`, JSON.stringify(f0));
    await klik('.tl-bar [data-tlr]'); const f1 = await side.evaluate(([mx, p]) => { const MX = eval(mx); return { til: tlrTil(), f5: MX('kick', p.k5), fn: MX('snare', p.tn) } }, [mx, p]);
    T.tjek(f1.til && f1.f5 === 0 && f1.fn >= .99, 'et rigtigt klik igen (Til) giver rettelserne igen', JSON.stringify(f1));
    const n1 = await side.evaluate(([mx, p]) => { mode = 'fast'; applyNorm(); const MX = eval(mx), a = { f5: MX('kick', p.k5), fn: MX('snare', p.tn) }; mode = 'auto'; applyNorm(); return { a, b: { f5: MX('kick', p.k5), fn: MX('snare', p.tn), f13: MX('kick', p.k13) } } }, [mx, p]);
    T.tjek(n1.a.f5 === 0 && n1.a.fn >= .99 && n1.b.f5 === 0 && n1.b.fn >= .99 && n1.b.f13 === p.f13, 'når analysen regnes om (Normalisering Fast og Adaptiv), bruges rettelserne stadig, og et urørt kick er som før', JSON.stringify(n1));
    await side.screenshot({ path: path.join(UD, 'rettelser-i-reglerne.png') });
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
