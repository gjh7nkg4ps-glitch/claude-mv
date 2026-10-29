/* Trin 4 · Det nye i v9.11: Router 2.0 med kompakt visning og sortering efter D2.
   - Standard: Kompakt og D2. Kompakte bokse er lave, og skyderne er skjult; Detaljer ▸ åbner én boks; Fuld viser alt.
   - D2: kilderne står i mapper efter musik med en overskrift pr. mappe, og slag → glidende → rampe → valg inden i mappen; boksene følger kilderne.
   - Rækkefølge: kilderne står, som forbindelserne bruger dem.
   - Farve efter type; hver kilde har sin chip med tal lige nu og "bruges af …"; de 31 bånd står i Frekvens.
   - Vis kilder, der ikke bruges: de står i deres mapper; ＋ laver en ny forbindelse.
   - Standard-visning sætter alt tilbage.
   - Med en lydfil, der spiller, viser chipsene deres tal lige nu.
   Skærmbilleder: tests/ud/router-kompakt.png og tests/ud/router-ubrugte.png. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Router kompakt og D2'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('7 · Router kompakt og D2 · ' + path.basename(fil));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const side = await browser.newPage({ viewport: { width: 1700, height: 2400 } });
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  const vent = ms => side.waitForTimeout(ms);
  try {
    await side.goto('file://' + fil); await vent(4000);
    /* Forbindelser fra kilder i forskellige mapper og typer, i en blandet rækkefølge */
    await side.evaluate(() => {
      const M = (band, effect) => ({ band, effect, thr: .3, gain: 1, att: 20, rel: 200, curve: 1, gap: 120, min: true });
      maps = [M('bas', 'puls'), M('kick', 'ring'), M('rms', 'glod'), M('ana:taktfase', 'sky'), M('centroid', 'burst'), M('hnd:takt', 'daempring'), M('kick', 'farve'), M('ana:toneklasse', 'puls')];
      renderMaps(); const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === 'Router'); t.click();
    });
    await vent(1200);
    const std = await side.evaluate(() => ({ vis: set.r2vis, sort: set.r2sort, kompakte: document.querySelectorAll('#r2 .r2-boks.kompakt').length, bokse: document.querySelectorAll('#r2 .r2-boks').length,
      h: Math.round(Math.max(...[...document.querySelectorAll('#r2 .r2-boks')].filter(b => !b.querySelector('.tk-rad')).map(b => b.getBoundingClientRect().height))), hTakt: Math.round(Math.max(0, ...[...document.querySelectorAll('#r2 .r2-boks')].filter(b => b.querySelector('.tk-rad')).map(b => b.getBoundingClientRect().height))), sl: [...document.querySelectorAll('#r2 .r2-boks .r2-sls')].some(e => e.offsetParent) }));
    T.tjek(std.vis === 'kompakt' && std.sort === 'd2', 'standard: Kompakt og D2');
    /* fra v9.13 har taktslag-bokse en ekstra linje med Auto · Fra filen · Mens det spiller */
    T.tjek(std.kompakte === std.bokse && std.h < 260 && std.hTakt < 300 && !std.sl, `alle ${std.bokse} bokse er kompakte (${std.h} px høje; taktslag-boksen ${std.hTakt} px), og skyderne er skjult`);

    const d2 = await side.evaluate(() => ({ chips: [...document.querySelectorAll('#r2 .r2-kilder .r2-chip')].sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top)).map(c => c.dataset.kk),
      mapper: [...document.querySelectorAll('#r2 .r2-kilder .r2-mappe')].filter(h => h.style.display !== 'none').sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top)).map(h => h.dataset.mp),
      bokse: [...document.querySelectorAll('#r2 .r2-boks')].map(b => maps[+b.dataset.i].band),
      kickBrug: (document.querySelector('#r2 .r2-chip[data-kk="kick"] .r2-brug') || {}).textContent,
      hue: { kick: document.querySelector('#r2 .r2-chip[data-kk="kick"]').style.getPropertyValue('--hue'), bas: document.querySelector('#r2 .r2-chip[data-kk="bas"]').style.getPropertyValue('--hue') } }));
    /* inden i samme mappe og type sorteres efter navn: "Hændelse · taktslag" før "Slag, dyb (kick)" */
    const forvent = ['hnd:takt', 'kick', 'ana:taktfase', 'ana:toneklasse', 'centroid', 'rms', 'bas'];
    T.tjek(d2.chips.join(',') === forvent.join(','), 'D2: kilderne står ' + d2.chips.join(' → '), 'forventet ' + forvent.join(' → '));
    T.tjek(d2.mapper.join(',') === 'Rytme,Tone og harmoni,Klang,Dynamik,Frekvens', 'mappe-overskrifter: ' + d2.mapper.join(' · '));
    T.tjek(d2.bokse.join(',') === ['hnd:takt', 'kick', 'kick', 'ana:taktfase', 'ana:toneklasse', 'centroid', 'rms', 'bas'].join(','), 'boksene følger kilderne: ' + d2.bokse.join(', '));
    T.tjek(/forbindelserne 2, 7/.test(d2.kickBrug || ''), 'kick-chippen siger "' + d2.kickBrug + '"');
    T.tjek(d2.hue.kick === '22' && d2.hue.bas === '195', `farve efter type: kick (slag) ${d2.hue.kick}, bas (glidende) ${d2.hue.bas}`);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'router-kompakt.png') });

    /* v9.12: Lydkort er fjernet, så kun de 31 bånd tjekkes her. */
    const ls = await side.evaluate(() => ['ana:ls0', 'ana:ls3', 'ana:ls30'].map(k => k + '=' + sigInfo(k).mappe + '/' + sigInfo(k).type).join(' '));
    T.tjek(ls === 'ana:ls0=Frekvens/glidende ana:ls3=Frekvens/glidende ana:ls30=Frekvens/glidende', 'de 31 bånd har faste pladser: ' + ls);
    /* Detaljer og Fuld */
    const det = await side.evaluate(async () => { const b = document.querySelector('#r2 .r2-boks'), i = b.dataset.i; b.querySelector('[data-r2="det"]').click(); await new Promise(r => setTimeout(r, 300));
      const nb = document.querySelector('#r2 .r2-boks[data-i="' + i + '"]'); const r1 = { aaben: !nb.classList.contains('kompakt'), h: Math.round(nb.getBoundingClientRect().height), andre: document.querySelectorAll('#r2 .r2-boks.kompakt').length };
      nb.querySelector('[data-r2="det"]').click(); await new Promise(r => setTimeout(r, 300)); r1.lukket = document.querySelector('#r2 .r2-boks[data-i="' + i + '"]').classList.contains('kompakt'); return r1; });
    T.tjek(det.aaben && det.h > 350 && det.andre === std.bokse - 1 && det.lukket, `Detaljer ▸ åbner én boks (${det.h} px), de andre bliver kompakte, og den lukker igen`);
    const fuld = await side.evaluate(async () => { document.querySelector('#r2 [data-r2set="r2vis"][data-v="fuld"]').click(); await (async () => { const klar = () => new Promise(r => { const t0 = performance.now(); const f = () => { if ((R2.byg && document.querySelector('#r2 .r2-graf')) || performance.now() - t0 > 5000) requestAnimationFrame(() => requestAnimationFrame(r)); else requestAnimationFrame(f); }; requestAnimationFrame(f); }); await klar(); })(); return { k: document.querySelectorAll('#r2 .r2-boks.kompakt').length, det: document.querySelectorAll('#r2 [data-r2="det"]').length }; });
    T.tjek(fuld.k === 0 && fuld.det === 0, 'Fuld: ingen kompakte bokse');

    /* Rækkefølge */
    const brug = await side.evaluate(async () => { document.querySelector('#r2 [data-r2set="r2sort"][data-v="brug"]').click(); await (async () => { const klar = () => new Promise(r => { const t0 = performance.now(); const f = () => { if ((R2.byg && document.querySelector('#r2 .r2-graf')) || performance.now() - t0 > 5000) requestAnimationFrame(() => requestAnimationFrame(r)); else requestAnimationFrame(f); }; requestAnimationFrame(f); }); await klar(); })();
      return { chips: [...document.querySelectorAll('#r2 .r2-kilder .r2-chip')].sort((a, b) => parseFloat(a.style.top) - parseFloat(b.style.top)).map(c => c.dataset.kk), mapper: [...document.querySelectorAll('#r2 .r2-kilder .r2-mappe')].length }; });
    T.tjek(brug.chips.join(',') === 'bas,kick,rms,ana:taktfase,centroid,hnd:takt,ana:toneklasse' && brug.mapper === 0, 'Rækkefølge: ' + brug.chips.join(' → ') + ', ingen mappe-overskrifter');

    /* Ubrugte kilder */
    const ub = await side.evaluate(async () => { document.getElementById('r2-alle').click(); await (async () => { const klar = () => new Promise(r => { const t0 = performance.now(); const f = () => { if ((R2.byg && document.querySelector('#r2 .r2-graf')) || performance.now() - t0 > 5000) requestAnimationFrame(() => requestAnimationFrame(r)); else requestAnimationFrame(f); }; requestAnimationFrame(f); }); await klar(); })();
      /* fra v9.13 er de smalle bånd foldet sammen, og Rolloff og Zero crossing rate er skjult under Niveau 4 */
      const u = [...document.querySelectorAll('#r2 .r2-uchip')], brugtS = new Set(maps.map(m => m.band)), ubrugt = r2AlleKilder().filter(k => !brugtS.has(k)), n = feNiv(), skjult = ubrugt.filter(k => { const m = /^ana:ls(\d+)$/.exec(k); return m ? (!lsSynlig(+m[1], n) || !set.lsAaben.includes(lsBred(+m[1]))) : (n < 4 && NIV4_KILDER.includes(k)); }).length, alle = ubrugt.length + brugtS.size - skjult, brugt = brugtS.size;
      return { n: u.length, forvent: alle - brugt, harKick: u.some(c => c.dataset.kk === 'kick'), grupper: [...document.querySelectorAll('#r2 .r2-ugrp .r2-mappe-n')].map(b => b.textContent) }; });
    T.tjek(ub.n === ub.forvent && !ub.harKick, `Vis kilder, der ikke bruges: ${ub.n} kilder (alle minus de brugte og de foldede eller skjulte), i mapperne ${ub.grupper.join(', ')}`);
    await side.evaluate(() => { const h = document.querySelector('#r2 .r2-ubrugt'); if (h) h.scrollIntoView(); });
    await vent(400);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'router-ubrugte.png') });
    const plus = await side.evaluate(async () => { const n0 = maps.length, b = document.querySelector('#r2 .r2-uchip[data-kk="snare"]'); b.click(); await (async () => { const klar = () => new Promise(r => { const t0 = performance.now(); const f = () => { if ((R2.byg && document.querySelector('#r2 .r2-graf')) || performance.now() - t0 > 5000) requestAnimationFrame(() => requestAnimationFrame(r)); else requestAnimationFrame(f); }; requestAnimationFrame(f); }); await klar(); })(); return { n0, n1: maps.length, band: maps[maps.length - 1].band, borte: !document.querySelector('#r2 .r2-uchip[data-kk="snare"]'), chip: !!document.querySelector('#r2 .r2-kilder .r2-chip[data-kk="snare"]') }; });
    T.tjek(plus.n1 === plus.n0 + 1 && plus.band === 'snare' && plus.borte && plus.chip, '＋ på Snare laver en ny forbindelse, og Snare flytter op blandt de brugte kilder');

    /* Standard-visning */
    const sv = await side.evaluate(async () => { document.getElementById('r2-stdvis').click(); await (async () => { const klar = () => new Promise(r => { const t0 = performance.now(); const f = () => { if ((R2.byg && document.querySelector('#r2 .r2-graf')) || performance.now() - t0 > 5000) requestAnimationFrame(() => requestAnimationFrame(r)); else requestAnimationFrame(f); }; requestAnimationFrame(f); }); await klar(); })(); return { vis: set.r2vis, sort: set.r2sort, alle: set.r2alle, ub: !!document.querySelector('#r2 .r2-ubrugt') }; });
    T.tjek(sv.vis === 'kompakt' && sv.sort === 'd2' && !sv.alle && !sv.ub, 'Standard-visning: Kompakt, D2 og ingen ubrugte kilder');
    let f = nyeFejl(); T.tjek(!f.length, 'visningen uden fejl', f.slice(0, 3).join(' | '));

    /* Med lyd: tallene lever */
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')), 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav);
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await side.evaluate(() => document.getElementById('play').click());
    const tal = await side.evaluate(async () => { const seen = {}; for (let k = 0; k < 40; k++) { await new Promise(r => setTimeout(r, 75)); document.querySelectorAll('#r2 .r2-kilder .r2-chip').forEach(c => { const v = parseFloat((c.querySelector('.r2-nu b') || {}).textContent.replace(',', '.')) || 0; seen[c.dataset.kk] = Math.max(seen[c.dataset.kk] || 0, v); }); } return seen; });
    /* Testbrowseren tegner kun få billeder i sekundet (uden grafikkort), så korte kick-slag kan gå tabt; derfor tjekkes kilder, der glider. */
    T.tjek(tal.bas > .05 && tal.rms > .05, `med lyd viser chipsene deres tal lige nu (højeste: bas ${tal.bas}, rms ${tal.rms}, kick ${tal.kick})`);
    await side.evaluate(() => document.getElementById('pause') && document.getElementById('pause').click());
    f = nyeFejl(); T.tjek(!f.length, 'afspilning uden fejl', f.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/router-kompakt.png, tests/ud/router-ubrugte.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
