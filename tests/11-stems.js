/* Trin 4 · Det nye i v9.15: 4 spor (stems), trin 1.
   Test-sporene laves med numpy (tests/lav-stems.py): hvert spor spiller kun i sit eget tidsrum
   (trommer 0–20 s, bas 5–25 s, vokal 10–30 s, resten 15–30 s), så man kan se, at hver måling kun reagerer på sit eget spor.
   - Kortet "4 spor (stems)" i Lydkilde: 4 filer ind, længderne vises, ▶ Brug de 4 spor.
   - Den samlede lyd spilles og analyseres som én fil.
   - Hver måling reagerer kun på sit eget spor; den samlede lyd reagerer på alt.
   - Kildelisten har en gruppe pr. spor (D2: intet lægges sammen).
   - Auto: kick, hihat fra Trommer, bas fra Bas, vokal fra Vokal; grunden står ved forbindelsen; Manuel.
   - Gul besked, når længderne ikke passer; besked ved .stem.mp4; en almindelig fil fjerner sporene.
   Skærmbillede: tests/ud/stems-lydkilde.png og tests/ud/stems-noder.png. */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('4 spor'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('11 · 4 spor (stems) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-stems-')), kort = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-stems-kort-'));
  execFileSync('python3', ['-I', path.join(__dirname, 'lav-stems.py'), tmp]);
  execFileSync('python3', ['-I', path.join(__dirname, 'lav-stems.py'), kort, '--kort-bas']);
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const side = await browser.newPage({ viewport: { width: 1600, height: 1300 } });
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  const fane = n => side.evaluate(n => { const t = [...document.querySelectorAll('.dk-zone:has(#w33) .dk-fane')].find(b => b.textContent.trim() === n); if (t) t.click(); }, n);
  const sætSpor = async mappe => { for (const s of ['trommer', 'bas', 'vokal', 'resten']) await side.setInputFiles(`[data-stem-input="${s}"]`, path.join(mappe, s + '.wav')); await side.waitForFunction(() => STEM_SPOR.every(([s]) => STEM.buf[s]), null, { timeout: 20000 }); };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    await fane('Lydkilde'); await side.waitForSelector('#stem-brug', { timeout: 10000 });
    T.ok('kortet "4 spor (stems)" står i Lydkilde');
    await sætSpor(tmp);
    const k1 = await side.evaluate(() => ({ slots: [...document.querySelectorAll('[data-stem-fil]')].map(e => e.textContent), brug: !document.getElementById('stem-brug').disabled, gul: !!document.querySelector('#stem-besked .stem-gul') }));
    T.tjek(k1.brug && !k1.gul && k1.slots.every(s => /0:30,0/.test(s)), '4 spor valgt, alle 0:30,0, ingen gul besked, og ▶ Brug de 4 spor kan trykkes: ' + k1.slots.join(' · '));
    await side.locator('.dk-zone:has(#w33)').screenshot({ path: path.join(UD, 'stems-lydkilde.png') });
    const t0 = Date.now();
    await side.click('#stem-brug');
    await side.waitForFunction(() => STEM.klar && F && A && !document.getElementById('play').disabled, null, { timeout: 300000 });
    const k2 = await side.evaluate(() => ({ dur, kan: buf.numberOfChannels, status: document.getElementById('status').textContent, brug: document.getElementById('stem-brug').textContent }));
    T.tjek(Math.abs(k2.dur - 30) < .1 && /4 spor er analyseret/.test(k2.status), `den samlede lyd: ${k2.dur.toFixed(1)} s; analyseret på ${Math.round((Date.now() - t0) / 1000)} s ("${k2.status.slice(0, 50)}…")`);

    /* Hver måling reagerer kun på sit eget spor */
    /* målingerne læses direkte fra analysen (som når sangen spiller), for spor og for den samlede lyd */
    const M = await side.evaluate(() => { const v = (k, t) => { const p = k.split(':'), a = p[0] === 'stem' ? STEM.F[p[1]][p[2]] : F[k]; return a[Math.max(0, Math.min(a.length - 1, Math.floor(t * sr / H)))]; }; const mid = (k, a, z) => { let s = 0, n = 0; for (let t = a; t < z; t += .05) { s += +v(k, t) || 0; n++; } return +(s / n).toFixed(3); };
      return { kickPaa: mid('stem:trommer:kick', 0, 5), kickAf: mid('stem:trommer:kick', 20.5, 30), hihatPaa: mid('stem:trommer:hihat', 0, 5), hihatAf: mid('stem:trommer:hihat', 20.5, 30),
        basAf: mid('stem:bas:bas', 0, 4.5), basPaa: mid('stem:bas:bas', 20, 25), mixBas: mid('bas', 0, 4.5),
        vokAf: mid('stem:vokal:vokal', 0, 9.5), vokPaa: mid('stem:vokal:vokal', 25, 30), mixVok: mid('vokal', 0, 9.5),
        restAf: mid('stem:resten:rms', 0, 14.5), restPaa: mid('stem:resten:rms', 20, 30), mixRms: mid('rms', 0, 14.5) }; });
    console.log('     ' + JSON.stringify(M));
    T.tjek(M.kickPaa > .05 && M.kickAf < .01 && M.hihatPaa > .05 && M.hihatAf < .01, `Trommer · Kick og Hihat: med trommer ${M.kickPaa} og ${M.hihatPaa}; uden trommer (20–30 s, mens bas, vokal og resten spiller) ${M.kickAf} og ${M.hihatAf}`);
    T.tjek(M.basAf < .01 && M.basPaa > .05, `Bas · Bas: kun trommer (0–5 s) ${M.basAf}; bas uden trommer (20–25 s) ${M.basPaa}`);
    T.tjek(M.vokAf < .01 && M.vokPaa > .05, `Vokal · Vokal: før vokalen (0–10 s) ${M.vokAf}; med vokal ${M.vokPaa}`);
    T.tjek(M.restAf < .01 && M.restPaa > .05, `Resten · Styrke: før akkorderne (0–15 s) ${M.restAf}; med akkorder ${M.restPaa}`);
    T.tjek(M.mixBas > .05 && M.mixRms > .05, `til sammenligning reagerer den samlede lyd på alt: Bas 0–5 s ${M.mixBas} (det er kicken), RMS 0–15 s ${M.mixRms}`);

    /* Kildelisten: en gruppe pr. spor */
    const L = await side.evaluate(() => { set.niv = 2; const h = feKildeOpts(''); return { grp: [...h.matchAll(/label="(Spor · [^"]+)"/g)].map(m => m[1]), kick: h.includes('>Trommer · Kick<'), vok: h.includes('>Vokal · Styrke (RMS)<'), mixKick: h.includes('value="kick"'), n: (h.match(/value="stem:/g) || []).length }; });
    T.tjek(L.grp.join(',') === 'Spor · Trommer,Spor · Bas,Spor · Vokal,Spor · Resten' && L.kick && L.vok && L.mixKick, `kildelisten: ${L.grp.join(' · ')} (${L.n} målinger), fx "Trommer · Kick" og "Vokal · Styrke (RMS)"; "Kick" for den samlede lyd står der stadig`);

    /* Auto */
    await side.evaluate(() => { const M = (band, effect) => ({ band, effect, thr: .3, gain: 1, att: 5, rel: 120, curve: 1, gap: 120, min: false }); maps = [M('kick', 'puls'), M('bas', 'ring'), M('vokal', 'glod'), M('hihat', 'sky'), M('rms', 'burst')]; renderMaps(); });
    await fane('Node-editor'); await side.waitForTimeout(500);
    const brugt = () => side.evaluate(() => { const b = []; Rytme.koer(maps, { v: (m) => { b.push(m.band); return 0; }, off: () => false, master: 1, dt: 1 / 60, env: [], pe: [], E: {}, kant: () => {}, holdRyd: false }); return b; });
    let b = await brugt(); let tx = await side.evaluate(() => maps.map(m => stemGrund(m)).filter(Boolean).map(h => h.replace(/<[^>]+>/g, '')));
    T.tjek(b.join(',') === 'stem:trommer:kick,stem:bas:bas,stem:vokal:vokal,stem:trommer:hihat,rms', 'Auto: motoren læser ' + b.join(', '));
    T.tjek(tx.length === 4 && /Auto-valg: fra sporet Trommer, fordi der er 4 spor/.test(tx[0]) && /fra sporet Bas/.test(tx[1]) && /fra sporet Vokal/.test(tx[2]), 'ved forbindelsen: "' + tx[0] + '" (kun ved de 4, der har et spor; ikke ved RMS)');
    await side.evaluate(() => { maps[0].spor = 'mix'; save(); renderMaps(); }); await side.waitForTimeout(300);
    b = await brugt(); tx = await side.evaluate(() => stemGrund(maps[0]).replace(/<[^>]+>/g, ''));
    T.tjek(b[0] === 'kick' && /Manuel: fra den samlede lyd \(du har valgt det\)\. Auto-valg ville bruge fra sporet Trommer/.test(tx), 'Manuel: "' + tx + '"; motoren læser ' + b[0]);
    await side.evaluate(() => { delete maps[0].spor; save(); renderMaps(); });
    await side.evaluate(() => document.getElementById('play').click()); await side.waitForTimeout(2500);
    const lev = await side.evaluate(() => ({ ud: Math.max(R2M.ud[0] || 0, R2M.ud[3] || 0), v: R2M.v[0] }));
    await side.locator('.dk-zone:has(#w33)').screenshot({ path: path.join(UD, 'stems-noder.png') });
    await side.evaluate(() => document.getElementById('pause').click());
    T.tjek(lev.ud > 0, `afspilning: forbindelserne fra sporet Trommer giver udslag (${lev.ud.toFixed(2)})`);
    const r2 = await side.evaluate(() => ({ navn: bandNavn('stem:trommer:kick'), hvor: r2Hvor('stem:trommer:kick'), type: sigInfo('stem:trommer:kick').type }));
    T.tjek(r2.navn === 'Trommer · Kick' && /sporet Trommer/.test(r2.hvor) && r2.type === 'slag', `navn og sted (som i Node-editorens lydtræk): "${r2.navn}", "${r2.hvor}", type ${r2.type}`);
    let f = nyeFejl(); T.tjek(!f.length, '4 spor uden fejl', f.slice(0, 3).join(' | '));

    /* Gul besked, .stem.mp4 og en almindelig fil */
    await fane('Lydkilde'); await side.click('#stem-fjern'); await side.waitForTimeout(300);
    await sætSpor(kort); await side.waitForTimeout(300);
    const gul = await side.evaluate(() => (document.querySelector('#stem-besked .stem-gul') || {}).textContent || '');
    T.tjek(/ikke samme længde/.test(gul) && /Bas 0:29,0/.test(gul), 'gul besked: "' + gul.slice(0, 110) + '…"');
    const ni = path.join(tmp, 'sang.stem.mp4'); fs.writeFileSync(ni, Buffer.from('ikke rigtig mp4'));
    await side.setInputFiles('[data-stem-input="trommer"]', ni); await side.waitForTimeout(400);
    const nim = await side.evaluate(() => document.getElementById('stem-besked').textContent);
    T.tjek(/Native Instruments/.test(nim) && /kan ikke læses endnu/.test(nim), '.stem.mp4: "' + nim.slice(0, 100) + '…"');
    await side.click('#stem-fjern'); await sætSpor(tmp); await side.click('#stem-brug');
    await side.waitForFunction(() => STEM.klar && !document.getElementById('play').disabled, null, { timeout: 300000 });
    await side.setInputFiles('#file', lavTestlyd(path.join(tmp, 'alm.wav')));
    await side.waitForTimeout(500);
    const ryd = await side.evaluate(() => ({ klar: STEM.klar, n: (feKildeOpts('').match(/value="stem:/g) || []).length }));
    T.tjek(!ryd.klar && ryd.n === 0, 'en almindelig lydfil fjerner sporene (ingen stem-kilder i listen)');
    f = nyeFejl(); T.tjek(!f.length, 'beskederne uden fejl', f.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); fs.rmSync(tmp, { recursive: true, force: true }); fs.rmSync(kort, { recursive: true, force: true }); }
  console.log('  skærmbilleder: tests/ud/stems-lydkilde.png, tests/ud/stems-noder.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
