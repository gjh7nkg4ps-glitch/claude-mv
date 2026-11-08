/* Trin 4 · Det nye i v9.9: Router 2.0 (vores navn; fagudtryk: graf-editor).
   Motoren:
   - Uden de nye trin regner den nye motor præcis som den gamle (R2M.gammel), også med vend om, kurve, Hold ∞, port og klods-spor.
   - Hysterese holder effekten tændt, når lyden vipper lige omkring tærsklen.
   - Hold 300 ms holder niveauet, før release begynder.
   - Slew 2/s: et spring fra 0 til 1 tager cirka et halvt sekund.
   - De nye trin virker ikke på klods-spor.
   Vinduet Router 2.0 er slettet i v9.35 (brugerens valg); dets boks findes nu som reglen i Node-editoren (testet i 17-node-editor-ret.js).
   Motoren (blokken ROUTER 2.0 MOTOR) er den samme, så dens test bliver her. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Router 2.0-motoren'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('5 · Router 2.0-motoren · ' + path.basename(fil));
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
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
