/* Trin 4 · Det nye i v9.113 (A1, P8.26): hele analysen på de 4 spor. Test-sporene er de samme som i test 11 (tests/lav-stems.py: trommer 0–20 s, bas 5–25 s,
   vokal 10–30 s, resten 15–30 s). ▶ Brug de 4 spor (rigtigt klik): hvert spor får alle 80 lydtræk (14 + 66), siden fryser ikke imens (et ur i siden måler
   den længste pause), Tonehøjde · Vokal og Tonehøjde · Bas reagerer kun, når deres spor spiller, navne, type og D2 kender de nye kilder, en regel på
   Tonehøjde · Vokal står i matrixen (med cirkel) og i Node-editoren og får et tal, når sangen står et sted med vokal. Cachen: anden gang, og efter en genstart
   af siden, hentes alle 5 analyser (blanding + 4 spor) uden at regne. Analyse sikkerhed: ét instrument alene giver tal for Tonehøjde · Bas, Tonehøjde · Vokal
   og Taktslag · Trommer. */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Spor: hele analysen'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('98 · Hele analysen på de 4 spor (A1) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-spor-')); execFileSync('python3', ['-I', path.join(__dirname, 'lav-stems.py'), tmp]);
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage(); let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)); });
  const sætSpor = async () => { await side.evaluate(() => { try { dkVis('w35'); sgFane('spor') } catch (e) { } }); await side.waitForSelector('#stem-brug', { timeout: 10000 }); for (const s of ['trommer', 'bas', 'vokal', 'resten']) await side.setInputFiles(`[data-stem-input="${s}"]`, path.join(tmp, s + '.wav')); await side.waitForFunction(() => STEM_SPOR.every(([s]) => STEM.buf[s]), null, { timeout: 60000 }); await side.waitForTimeout(400) };
  const brug = async () => { await side.evaluate(() => { window.__ur = { sidst: performance.now(), max: 0 }; window.__urIv = setInterval(() => { const n = performance.now(); __ur.max = Math.max(__ur.max, n - __ur.sidst); __ur.sidst = n }, 20) }); const p = await side.evaluate(() => { const b = document.getElementById('stem-brug'); b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }); const t0 = Date.now(); await side.mouse.click(p.x, p.y);
    await side.waitForFunction(() => STEM.klar && F && A && !document.getElementById('play').disabled, null, { timeout: 300000 }); await side.waitForTimeout(300); return side.evaluate(t0 => { clearInterval(__urIv); return { ms: Date.now() - t0, pause: Math.round(__ur.max), cache: STEM.cache, status: document.getElementById('status').textContent } }, t0) };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500); await sætSpor();
    const k1 = await brug();
    T.tjek(k1.cache.regnet === 5 && k1.cache.hentet === 0 && /Hele analysen på hvert spor/.test(k1.status), `første gang regnes alle 5 (blandingen og 4 spor) på ${(k1.ms / 1000).toFixed(1)} s; statuslinjen siger det`, JSON.stringify(k1));
    T.tjek(k1.pause < 1500, `siden fryser ikke imens: den længste pause i sidens eget ur var ${k1.pause} ms (analysen kører i baggrunds-trådene)`, JSON.stringify(k1));
    const r = await side.evaluate(() => { const ant = Object.fromEntries(STEM_SPOR.map(([s]) => [s, BANDS.filter(b => STEM.F[s][b[0]] && STEM.F[s][b[0]].length).length + Rytme.ANA_KILDER.filter(q => STEM.F[s][q.key] && STEM.F[s][q.key].length).length]));
      const mid = (s, k, a, z) => { const x = STEM.F[s][k]; let q = 0, n = 0; for (let t = a; t < z; t += .05) { q += x[Math.max(0, Math.min(x.length - 1, Math.floor(t * sr / H)))]; n++ } return +(q / n).toFixed(3) };
      return { ant, kilder: stemKilder().length, n14: BANDS.length, n84: Rytme.ANA_KILDER.length, alle: r2AlleKilder().filter(k => k.startsWith('stem:')).length,
        vokFoer: mid('vokal', 'ana:pitchsik', 0, 9), vokMed: mid('vokal', 'ana:pitchsik', 12, 28), vokTone: mid('vokal', 'ana:pitch', 12, 28), basFoer: mid('bas', 'ana:tonestyrke', 0, 4), basMed: mid('bas', 'ana:tonestyrke', 8, 22), tromSlag: mid('trommer', 'ana:taktslag', 2, 18), tromEfter: mid('trommer', 'ana:taktslag', 23, 29), ls: mid('bas', 'ana:ls6', 8, 22),
        navn: [stemNavn('stem:vokal:ana:pitch'), neLtNavn('stem:vokal:ana:pitch'), stemNavn('stem:trommer:kick'), stemNavn('stem:bas:ana:c9')], type: [neLtType('stem:vokal:ana:pitch'), neLtType('stem:trommer:ana:taktslag'), neLtType('stem:bas:ana:ls4'), neLtType('stem:trommer:kick')], sig: [sigInfo('stem:vokal:ana:pitch'), sigInfo('ana:pitch')], hjem: ne3Hjem('stem:vokal:ana:pitch') } });
    console.log('     ' + JSON.stringify(r));
    T.tjek(r.n14 === 14 && r.n84 === 66 && Object.values(r.ant).every(n => n === 80) && r.kilder === 4 * 80 && r.alle === 4 * 80, 'hvert af de 4 spor har alle 80 lydtræk (14 fra trin 1 + 66 fra trin 2), og kildelisten har 4 × 80 = 320 spor-kilder', JSON.stringify(r));
    T.tjek(r.vokFoer < .02 && r.vokMed > .1 && r.vokTone > 0 && r.basFoer < .02 && r.basMed > .05 && r.ls > .05 && r.tromSlag > .02, `målingerne følger sporet: Tonesikkerhed · Vokal ${r.vokFoer} før vokalen og ${r.vokMed} med; Tonestyrke · Bas ${r.basFoer} og ${r.basMed}; Taktslag · Trommer ${r.tromSlag} (sporets eget taktslag)`, JSON.stringify(r));
    const typ = await side.evaluate(() => ({ a: [neLtType('stem:vokal:ana:pitch'), neLtType('stem:trommer:ana:taktslag'), neLtType('stem:bas:ana:ls4'), neLtType('stem:trommer:kick')], b: [neLtType('ana:pitch'), neLtType('ana:taktslag'), neLtType('ana:ls4'), neLtType('kick')], navn: [stemNavn('stem:vokal:ana:pitch'), neLtNavn('stem:vokal:ana:pitch'), stemNavn('stem:trommer:kick'), stemNavn('stem:bas:ana:c9')], sig: JSON.stringify(sigInfo('stem:vokal:ana:pitch')) === JSON.stringify(sigInfo('ana:pitch')), hjem: ne3Hjem('stem:vokal:ana:pitch') }));
    T.tjek(JSON.stringify(typ.a) === JSON.stringify(typ.b) && typ.navn[0] === 'Vokal · Tonehøjde' && typ.navn[1] === 'Tonehøjde · Vokal' && typ.navn[2] === 'Trommer · Kick' && /^Bas · Tone A/.test(typ.navn[3]) && typ.sig && typ.hjem[1] === 's:vokal', `navne, type og D2 kender de nye kilder: ${typ.navn.join(' · ')}; samme type som i den samlede lyd (${typ.a.join(', ')})`, JSON.stringify(typ));
    /* en regel på Tonehøjde · Vokal: matrixen, Node-editoren og motoren */
    await side.evaluate(() => { Regler.tilfoej(mk('stem:vokal:ana:pitch', 'puls', .05, 1, 20, 200)); lay3Anvend('noder'); mxSaet(true) }); await side.waitForTimeout(2500);
    const mx = await side.evaluate(() => { const th = document.querySelector('#ne-mx th.mx-lt[data-b="stem:vokal:ana:pitch"]'); offset = 20; const v20 = kildeV('stem:vokal:ana:pitch', 20), v5 = kildeV('stem:vokal:ana:pitch', 5); offset = 0; return { th: !!th, tekst: th ? th.textContent : '', cirkel: th && th.querySelector('.as-c') ? th.querySelector('.as-c').textContent : null, v20, v5 } });
    T.tjek(mx.th && /Tonehøjde · Vokal/.test(mx.tekst) && mx.cirkel === '?' && mx.v20 > 0 && mx.v5 === 0, `en regel på Tonehøjde · Vokal står som en række i matrixen med en cirkel (? før testen), og motoren får ${mx.v20.toFixed(2)} ved 20 s (vokal) og ${mx.v5} ved 5 s (ingen vokal)`, JSON.stringify(mx));
    await side.evaluate(() => mxSaet(false)); await side.waitForTimeout(1800);
    const nd = await side.evaluate(() => { const n = [...NE2.N.values()].find(x => x.kol === 'lydtraek' && x.band === 'stem:vokal:ana:pitch'); return { node: !!(n && n.el), navn: n && n.el ? n.el.textContent.slice(0, 60) : '' } });
    T.tjek(nd.node && /Tonehøjde · Vokal/.test(nd.navn), 'Node-editoren har en lydtræk-node for Tonehøjde · Vokal', JSON.stringify(nd));
    await side.screenshot({ path: path.join(UD, 'spor-hele-analysen-noder.png') });
    /* cachen: anden gang og efter en genstart */
    await side.evaluate(() => { try { dkVis('w35'); sgFane('spor') } catch (e) { } lay3Anvend('ao-sang') }); await side.waitForTimeout(800);
    const k2 = await brug();
    T.tjek(k2.cache.hentet === 5 && k2.cache.regnet === 0 && /hentet fra cachen/.test(k2.status), `anden gang hentes alle 5 fra cachen på ${(k2.ms / 1000).toFixed(1)} s (første gang ${(k1.ms / 1000).toFixed(1)} s)`, JSON.stringify(k2));
    await side.reload(); await side.waitForTimeout(4500); await sætSpor(); const k3 = await brug();
    const r3 = await side.evaluate(() => ({ n: Object.keys(STEM.F.vokal).filter(k => /^ana:/.test(k)).length, tone: !!STEM.F.vokal['ana:pitch'], regel: maps.some(m => m.band === 'stem:vokal:ana:pitch') }));
    T.tjek(k3.cache.hentet === 5 && k3.cache.regnet === 0 && r3.tone && r3.n >= 66 && r3.regel, `efter en genstart af siden (filerne vælges igen) hentes alle 5 fra cachen på ${(k3.ms / 1000).toFixed(1)} s; sporene har stadig hele analysen, og reglen er der`, JSON.stringify({ k3, r3 }));
    await side.screenshot({ path: path.join(UD, 'spor-hele-analysen.png') });
    /* Analyse sikkerhed: ét instrument alene */
    const as = await side.evaluate(async () => { const D = await asKoer(), R = D.res, s = k => R[k] ? R[k].s : null; return { ms: D.ms, tal: { 'Tonehøjde · Bas': s('stem:bas:ana:pitch'), 'Basens tone, hele lyden': s('x:bastone'), 'Tonehøjde · Vokal (melodien alene)': s('stem:vokal:ana:pitch'), 'Tonehøjde, hele lyden': s('ana:pitch'), 'Taktslag · Trommer': s('stem:trommer:ana:taktslag'), 'Taktslag, hele lyden': s('ana:taktslag'), 'Takt 1 · Trommer': s('stem:trommer:ana:takt'), 'Toneklasse · Bas': s('stem:bas:ana:toneklasse'), 'Toneklasse · Vokal': s('stem:vokal:ana:toneklasse'), 'Toneklasse, hele lyden': s('ana:toneklasse'), '12 toner · Bas': s('x:toner:bas'), '12 toner · Vokal': s('x:toner:vokal') },
      resten: asFor('stem:resten:ana:pitch').s === s('stem:vokal:ana:pitch'), mat: asFor('stem:bas:ana:ls3').s, fase: asFor('stem:trommer:ana:taktfase').s === s('stem:trommer:ana:taktslag'), ukendt: asFor('stem:vokal:vokal').s, c: !!(R['stem:bas:ana:c0'] && R['stem:vokal:ana:c11']), hist: Object.keys(D.hist[D.hist.length - 1].s) } });
    console.log('     ' + JSON.stringify(as.tal));
    T.tjek(Object.values(as.tal).every(v => Number.isInteger(v) && v >= 0 && v <= 100) && as.c && as.hist.includes('stem:bas:ana:pitch') && as.hist.includes('stem:trommer:ana:taktslag'), 'Analyse sikkerhed måler ét instrument alene: Tonehøjde, Toneklasse og de 12 toner på bassen og melodien, Taktslag og Takt 1 på trommerne; tallene står i historikken', JSON.stringify(as));
    T.tjek(as.tal['Tonehøjde · Bas'] > as.tal['Basens tone, hele lyden'] && as.tal['Tonehøjde · Vokal (melodien alene)'] > as.tal['Tonehøjde, hele lyden'] && as.tal['Taktslag · Trommer'] >= as.tal['Taktslag, hele lyden'], `et rent spor giver mere: Tonehøjde · Bas ${as.tal['Tonehøjde · Bas']} mod ${as.tal['Basens tone, hele lyden']}, melodien alene ${as.tal['Tonehøjde · Vokal (melodien alene)']} mod ${as.tal['Tonehøjde, hele lyden']}, Taktslag · Trommer ${as.tal['Taktslag · Trommer']} mod ${as.tal['Taktslag, hele lyden']}`, JSON.stringify(as.tal));
    T.tjek(as.resten && as.mat === 99 && as.fase && as.ukendt === null, 'Resten bruger tallet for melodien alene; et smalt bånd i Bas-sporet er 99 (ren matematik); Taktfase · Trommer følger Taktslag · Trommer; Vokal · Vokal har stadig intet tal', JSON.stringify(as));
    /* P8.28: bedste tærskel også for sporene, Brug den bedste tærskel (rigtigt klik), Ctrl+Z, rapporten */
    await side.evaluate(() => { Regler.tilfoej(mk('stem:trommer:kick', 'glod', .3, 1, 8, 120)); asAaben('stem:trommer:kick') }); await side.waitForTimeout(1600);
    const kp = await side.evaluate(() => { const r = [...document.querySelectorAll('#as-rude tr[data-asr]')].find(x => x.dataset.asr === 'stem:trommer:kick').querySelector('td'); const q = r.getBoundingClientRect(); return { x: q.x + 30, y: q.y + q.height / 2 } }); await side.mouse.click(kp.x, kp.y); await side.waitForTimeout(500);
    const b0 = await side.evaluate(() => { const b = document.querySelector('#as-rude [data-asbedst="stem:trommer:kick"]'); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, tekst: b.textContent, det: b.closest('td').textContent, bedst: AS.data.res['stem:trommer:kick'].bedst, sn: !!AS.data.res['stem:trommer:snare'].bedst, hh: !!AS.data.res['stem:trommer:hihat'].bedst, thr: maps.filter(m => m.band === 'stem:trommer:kick').map(m => m.thr) } });
    T.tjek(b0 && /Bedste tærskel/.test(b0.det) && /i 1 regel/.test(b0.tekst) && Array.isArray(b0.bedst) && b0.sn && b0.hh && b0.thr[0] === .3, `rækken Kick · Trommer har en bedste tærskel (${b0 && b0.bedst}) og knappen "${b0 && b0.tekst}"; Snare · Trommer og Hihat · Trommer har det også`, JSON.stringify(b0));
    await side.waitForTimeout(1500); await side.mouse.click(b0.x, b0.y); await side.waitForTimeout(900);
    const b1 = await side.evaluate(() => maps.filter(m => m.band === 'stem:trommer:kick').map(m => m.thr));
    await side.waitForTimeout(1500); await side.evaluate(() => document.body.focus()); await side.keyboard.press('Control+z'); await side.waitForTimeout(1200);
    const b2 = await side.evaluate(() => ({ thr: maps.filter(m => m.band === 'stem:trommer:kick').map(m => m.thr), rap: asRapport() }));
    T.tjek(b1.length === 1 && b1[0] === b0.bedst[0] && (b0.bedst[0] === .3 || b2.thr[0] === .3), `Brug den bedste tærskel (rigtigt klik) sætter reglens tærskel til ${b1[0]}; Ctrl+Z sætter den tilbage til ${b2.thr[0]}`, JSON.stringify({ b1, b2: b2.thr }));
    T.tjek(/Fundet tempo/.test(b2.rap) && /House 124 → \d+/.test(b2.rap) && /Kick · Trommer: \d+/.test(b2.rap) && /bedste tærskel/.test(b2.rap) && /Mozilla/.test(b2.rap), 'rapporten (Kopiér rapport) har browserens version, det fundne tempo pr. mønster, alle tal og de bedste tærskler', b2.rap.slice(0, 300));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
