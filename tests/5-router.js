/* Trin 4 · Det nye i v9.9: Router 2.0 (vores navn; fagudtryk: graf-editor).
   Motoren:
   - Uden de nye trin regner den nye motor præcis som den gamle (R2M.gammel), også med vend om, kurve, Hold ∞, port og klods-spor.
   - Hysterese holder effekten tændt, når lyden vipper lige omkring tærsklen.
   - Hold 300 ms holder niveauet, før release begynder.
   - Slew 2/s: et spring fra 0 til 1 tager cirka et halvt sekund.
   - De nye trin virker ikke på klods-spor.
   Visningen:
   - Fanen Router findes; én boks pr. forbindelse, to linjer pr. forbindelse, én chip pr. kilde og pr. mål.
   - Træk i VU-måleren sætter tærsklen; piletast på en drejeknap; Hold-skyderen på ∞ gør Release grå; Spærretid er grå, hvor den ikke virker; ↺ Standard; Mapping viser en Router-linje.
   - + Ny forbindelse og ✕.
   - Med en lydfil, der spiller, lever målerne og linjerne. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Router 2.0'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('5 · Router 2.0 · ' + path.basename(fil));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const side = await browser.newPage({ viewport: { width: 1700, height: 2400 } });
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4000);

    /* Motoren, med kunstige lydværdier */
    const mot = await side.evaluate(() => {
      const kør = (koer, M, ind, n) => { const env = [], pe = [], ud = []; for (let k = 0; k < n; k++) { const E = {}; koer(M, { v: (m, i) => m.band === 'port' ? (k % 50 < 25 ? 1 : 0) : ind(k, i), off: () => false, master: 1, dt: 1 / 60, env, pe, E, kant: () => {}, holdRyd: false }); ud.push(M.map(m => E[m.effect])); } return ud; };
      let s = 3; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647);
      const M = [{ band: 'a', effect: 'puls', thr: .3, gain: 1, att: 20, rel: 200, curve: 1 }, { band: 'a', effect: 'ring', thr: .1, gain: 1.5, att: 5, rel: 600, curve: 2, inv: true },
        { band: 'a', effect: 'glod', thr: .4, gain: 1, att: 10, rel: 100, curve: .5, hold: true }, { band: 'a', effect: 'sky', thr: .2, gain: 1, att: 30, rel: 300, port: 'port', portT: .5 },
        { band: 'a', effect: 'klods1', thr: .3, gain: 1, att: 1, rel: 50, hyst: .1, holdMs: 500, slew: 1 }];
      const lyd = Array.from({ length: 600 }, () => R());
      const a = kør(R2M.gammel, M.map(m => ({ ...m, hyst: undefined, holdMs: undefined, slew: undefined })), k => lyd[k], 600), b = kør(Rytme.koer, M, k => lyd[k], 600);
      let maxForskel = 0; a.forEach((r, k) => r.forEach((x, j) => { maxForskel = Math.max(maxForskel, Math.abs((x || 0) - (b[k][j] || 0))); }));
      /* Hysterese */
      const vip = k => (k % 2 ? .32 : .28), hu = kør(Rytme.koer, [{ band: 'a', effect: 'puls', thr: .3, gain: 1, att: 1, rel: 10, curve: 1, hyst: .05 }], vip, 60).slice(30).map(r => r[0]);
      const uu = kør(Rytme.koer, [{ band: 'a', effect: 'puls', thr: .3, gain: 1, att: 1, rel: 10, curve: 1 }], vip, 60).slice(30).map(r => r[0]);
      /* Hold 300 ms */
      const puls = k => (k < 10 ? 1 : 0), fr = s => Math.round(10 + s * 60);
      const hm = kør(Rytme.koer, [{ band: 'a', effect: 'puls', thr: 0, gain: 1, att: 1, rel: 50, curve: 1, holdMs: 300 }], puls, 80).map(r => r[0]);
      const ho = kør(Rytme.koer, [{ band: 'a', effect: 'puls', thr: 0, gain: 1, att: 1, rel: 50, curve: 1 }], puls, 80).map(r => r[0]);
      /* Slew 2/s */
      const sl = kør(Rytme.koer, [{ band: 'a', effect: 'puls', thr: 0, gain: 1, att: 1, rel: 10, curve: 1, slew: 2 }], () => 1, 60).map(r => r[0]);
      /* Klods-spor: de nye trin virker ikke */
      const kl1 = kør(Rytme.koer, [{ band: 'a', effect: 'klods1', thr: .3, gain: 1, att: 1, rel: 10, curve: 1, hyst: .05, slew: 1, holdMs: 500 }], vip, 60).map(r => r[0]);
      const kl0 = kør(Rytme.koer, [{ band: 'a', effect: 'klods1', thr: .3, gain: 1, att: 1, rel: 10, curve: 1 }], vip, 60).map(r => r[0]);
      return { maxForskel, hMin: Math.min(...hu), uMin: Math.min(...uu), hold200: hm[fr(.2)], hold500: hm[fr(.5)], uden200: ho[fr(.2)], top: hm[9], slew025: sl[14], slew06: sl[36], klodsEns: kl1.every((x, k) => x === kl0[k]) };
    });
    T.tjek(mot.maxForskel === 0, 'uden de nye trin regner motoren præcis som før (største forskel ' + mot.maxForskel + ' over 600 billeder og 5 forbindelser)');
    T.tjek(mot.hMin > .02 && mot.uMin < .01, `hysterese 0,05: effekten bliver tændt, når lyden vipper mellem 0,28 og 0,32 om tærsklen 0,3 (laveste ${mot.hMin.toFixed(3)}; uden hysterese ${mot.uMin.toFixed(3)})`);
    T.tjek(mot.hold200 > .95 * mot.top && mot.hold500 < .1 && mot.uden200 < .1, `Hold 300 ms: efter 0,2 s er niveauet ${mot.hold200.toFixed(2)} (uden hold ${mot.uden200.toFixed(2)}); efter 0,5 s er det ${mot.hold500.toFixed(2)}`);
    T.tjek(Math.abs(mot.slew025 - .5) < .06 && mot.slew06 > .99, `Slew 2/s: efter 0,25 s er udgangen ${mot.slew025.toFixed(2)} (forventet cirka 0,5), efter 0,6 s ${mot.slew06.toFixed(2)}`);
    T.tjek(mot.klodsEns, 'hysterese, hold og slew virker ikke på klods-spor');
    let f = nyeFejl(); T.tjek(!f.length, 'motoren uden fejl', f.slice(0, 3).join(' | '));

    /* Visningen */
    /* Fra v9.11 er standardvisningen Kompakt; denne test ser på alle dele af boksen, så den bruger Fuld. */
    await side.evaluate(() => { if ('r2vis' in set) set.r2vis = 'fuld'; brugFor('fuld1', true); const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === 'Router'); t.click(); });
    await side.waitForTimeout(1200);
    const vis = await side.evaluate(() => ({ maps: maps.length, bokse: document.querySelectorAll('#r2 .r2-boks').length, linjer: document.querySelectorAll('#r2 .r2-linjer path').length,
      kilder: document.querySelectorAll('#r2 .r2-kilder .r2-chip').length, maal: document.querySelectorAll('#r2 .r2-maal .r2-chip').length, uk: new Set(maps.map(m => m.band)).size, um: new Set(maps.map(m => m.effect)).size,
      fane: FG.lyd.faner.map(x => x[1]).includes('Router') }));
    T.tjek(vis.fane && vis.bokse === vis.maps && vis.linjer === 2 * vis.maps, `fanen Router: ${vis.bokse} bokse og ${vis.linjer} linjer for ${vis.maps} forbindelser`);
    T.tjek(vis.kilder === vis.uk && vis.maal === vis.um, `én chip pr. kilde (${vis.kilder}) og pr. mål (${vis.maal})`);

    const b0 = side.locator('#r2 .r2-boks[data-i="0"]');
    await b0.scrollIntoViewIfNeeded();
    const vu = await b0.locator('.r2-vu').boundingBox();
    await side.mouse.move(vu.x + vu.width * .5, vu.y + vu.height / 2); await side.mouse.down(); await side.mouse.move(vu.x + vu.width * .6, vu.y + vu.height / 2); await side.mouse.up();
    await side.waitForTimeout(200);
    T.tjek(await side.evaluate(() => Math.abs(maps[0].thr - .6) < .02), 'træk i VU-måleren sætter tærsklen (0,6)', String(await side.evaluate(() => maps[0].thr)));

    await side.locator('#r2 .r2-boks[data-i="0"] .r2-knap[data-k="hyst"]').focus(); await side.keyboard.press('ArrowUp');
    const hy = await side.evaluate(() => ({ h: maps[0].hyst, note: (document.querySelector('#maps .row[data-i="0"] .r2-mapnote') || {}).textContent, kaede: [...document.querySelectorAll('#r2 .r2-boks[data-i="0"] .r2-kaede span.on')].map(s => s.textContent) }));
    T.tjek(Math.abs(hy.h - .02) < 1e-9, 'piletast på drejeknappen Hysterese giver 0,02', String(hy.h));
    T.tjek(hy.kaede.some(s => /hysterese/.test(s)), 'kæden viser "tærskel + hysterese"', hy.kaede.join(', '));
    T.tjek(/hysterese 0,02/.test(hy.note || ''), 'Mapping viser linjen "Router: hysterese 0,02"', hy.note);

    const hold = await side.evaluate(async () => { const s = document.querySelector('#r2 .r2-boks[data-i="0"] input[data-rf="hold"]'); s.value = s.max; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true }));
      await new Promise(r => setTimeout(r, 200)); const b = document.querySelector('#r2 .r2-boks[data-i="0"]'); return { hold: maps[0].hold, holdMs: maps[0].holdMs, relGraa: b.querySelector('input[data-rf="rel"]').closest('.r2-sl').classList.contains('graa'), txt: b.querySelector('[data-rv="hold"]').textContent }; });
    T.tjek(hold.hold === true && hold.relGraa && hold.txt === '∞', 'Hold-skyderen på ∞ er den gamle Hold, og Release bliver grå');
    const mid = await side.evaluate(async () => { const s = document.querySelector('#r2 .r2-boks[data-i="0"] input[data-rf="hold"]'); s.value = 11; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 200)); return { hold: maps[0].hold, holdMs: maps[0].holdMs }; });
    T.tjek(mid.hold === false && mid.holdMs > 50 && mid.holdMs < 2000, `Hold midt på skyderen giver ${mid.holdMs} ms`);

    /* Fra v9.10 virker spærretid for alle slag-kilder; den er grå, når kilden glider (og målet ikke er klods eller Lyd). */
    const sp = await side.evaluate(async () => { maps.push({ band: 'bas', effect: 'ring', thr: .3, gain: 1, att: 20, rel: 200, curve: 1, gap: 120, min: true }); renderMaps(); await new Promise(r => setTimeout(r, 400));
      const i = maps.length - 1, k = document.querySelector('#r2 .r2-boks[data-i="' + i + '"] .r2-knap[data-k="gap"]'), g = !!(k && k.classList.contains('graa')); maps.pop(); renderMaps(); return g; });
    T.tjek(sp, 'Spærretid er grå, hvor den ikke virker (kilden glider)');

    const std = await side.evaluate(async () => { document.querySelector('#r2 .r2-boks[data-i="0"] [data-r2="std"]').click(); await new Promise(r => setTimeout(r, 200)); const m = maps[0]; return { hyst: m.hyst, holdMs: m.holdMs, hold: m.hold, slew: m.slew, curve: m.curve, thr: m.thr }; });
    T.tjek(std.hyst === 0 && std.holdMs === 0 && !std.hold && std.slew === 0 && std.curve === 1 && Math.abs(std.thr - .6) < .02, '↺ Standard sætter kæden tilbage, men tærsklen bliver');

    const ny = await side.evaluate(async () => { const n0 = maps.length; document.getElementById('r2-ny').click(); await new Promise(r => setTimeout(r, 400)); const n1 = maps.length, b1 = document.querySelectorAll('#r2 .r2-boks').length;
      document.querySelector('#r2 .r2-boks[data-i="' + (n1 - 1) + '"] [data-r2="del"]').click(); await new Promise(r => setTimeout(r, 400)); return { n0, n1, b1, n2: maps.length, b2: document.querySelectorAll('#r2 .r2-boks').length }; });
    T.tjek(ny.n1 === ny.n0 + 1 && ny.b1 === ny.n1 && ny.n2 === ny.n0 && ny.b2 === ny.n0, `+ Ny forbindelse og ✕ (${ny.n0} → ${ny.n1} → ${ny.n2})`);
    f = nyeFejl(); T.tjek(!f.length, 'visningen uden fejl', f.slice(0, 3).join(' | '));

    /* Levende med en lydfil */
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')), 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav);
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await side.evaluate(() => { maps[1].hyst = .08; maps[2].holdMs = 300; maps[3].slew = 3; renderMaps(); document.getElementById('play').click(); });
    await side.waitForTimeout(3000);
    const lev = await side.evaluate(() => { const op = [...document.querySelectorAll('#r2 .r2-linjer path')].map(p => +p.style.opacity || 0); return { ud: Math.max(...maps.map((m, i) => R2M.ud[i] || 0)), opMax: Math.max(...op), opMin: Math.min(...op), aktive: document.querySelectorAll('#r2 .r2-boks.aktiv').length }; });
    T.tjek(lev.ud > .1 && lev.opMax > lev.opMin + .2 && lev.aktive > 0, `med lyd: målerne og linjerne lever (højeste ud ${lev.ud.toFixed(2)}, linjer ${lev.opMin.toFixed(2)} til ${lev.opMax.toFixed(2)}, ${lev.aktive} aktive bokse)`);
    await side.locator('#r2 .r2-boks[data-i="0"]').scrollIntoViewIfNeeded();
    await side.waitForTimeout(500);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'router.png') });
    await side.evaluate(() => document.getElementById('pause') && document.getElementById('pause').click());
    f = nyeFejl(); T.tjek(!f.length, 'afspilning med Router åben uden fejl', f.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/router.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
