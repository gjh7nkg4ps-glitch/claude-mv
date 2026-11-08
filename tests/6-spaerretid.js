/* Trin 4 · Det nye i v9.10: Spærretid for alle slag, signaltyper (D2) og den kortere M-knap.
   - Spærretid 0, og kilder, der glider: motoren regner præcis som før (R2M.gammel).
   - Klods-spor: præcis som før (de har deres egen spærretid).
   - To kick-anslag 50 ms fra hinanden: med spærretid 120 ms bliver det andet ikke til et nyt anslag; et anslag 250 ms senere kommer igennem.
   - Signaltyperne: kick er slag i mappen Rytme, bas er glidende i Frekvens, taktfase er rampe, toneklasse er valg.
   - Spærretid virker kun for slag-kilder (r2SpaerVirker; Router 2.0 er slettet i v9.35).
   - W4: M-knappen er smal, og trinene står lige efter lydstyrken. Skærmbillede: tests/ud/w4-m-knap.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Spærretid for alle slag'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('6 · Spærretid for alle slag · ' + path.basename(fil));
  const browser = await chromium.launch();
  const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    const mot = await side.evaluate(() => {
      const kør = (koer, M, ind, n) => { const env = [], pe = [], ud = []; for (let k = 0; k < n; k++) { const E = {}; koer(M, { v: (m, i) => ind(k, i), off: () => false, master: 1, dt: 1 / 60, env, pe, E, kant: () => {}, holdRyd: false }); ud.push(M.map(m => E[m.effect])); } return ud; };
      let s = 11; const R = () => ((s = (s * 16807) % 2147483647) / 2147483647); const lyd = Array.from({ length: 600 }, () => R());
      const forskel = (M) => { const a = kør(R2M.gammel, M.map(m => ({ ...m })), k => lyd[k], 600), b = kør(Rytme.koer, M.map(m => ({ ...m })), k => lyd[k], 600); let d = 0; a.forEach((r, k) => r.forEach((x, j) => { d = Math.max(d, Math.abs((x || 0) - (b[k][j] || 0))); })); return d; };
      const d0 = forskel([{ band: 'kick', effect: 'puls', thr: .3, gain: 1, att: 5, rel: 80, curve: 1, gap: 0 }, { band: 'snare', effect: 'ring', thr: .2, gain: 1, att: 1, rel: 40, curve: 1, gap: 0 }]);
      const dGlid = forskel([{ band: 'bas', effect: 'puls', thr: .3, gain: 1, att: 5, rel: 80, curve: 1, gap: 120 }, { band: 'rms', effect: 'ring', thr: .1, gain: 1, att: 1, rel: 40, curve: 1, gap: 300 }]);
      const dKlods = forskel([{ band: 'kick', effect: 'klods1', thr: .3, gain: 1, att: 1, rel: 40, curve: 1, gap: 120 }]);
      /* to anslag 50 ms fra hinanden (3 billeder), så et 250 ms efter det første */
      const slag = k => ((k >= 0 && k < 2) || (k >= 5 && k < 7) || (k >= 15 && k < 17)) ? 1 : 0;
      const top = (u, a, b) => Math.max(...u.slice(a, b).map(r => r[0] || 0));
      const med = kør(Rytme.koer, [{ band: 'kick', effect: 'puls', thr: .1, gain: 1, att: 1, rel: 20, curve: 1, gap: 120 }], slag, 30);
      const uden = kør(Rytme.koer, [{ band: 'kick', effect: 'puls', thr: .1, gain: 1, att: 1, rel: 20, curve: 1, gap: 0 }], slag, 30);
      const bund = (u, a, b) => Math.min(...u.slice(a, b).map(r => r[0] || 0));
      return { d0, dGlid, dKlods,
        udenAndet: top(uden, 5, 9) - bund(uden, 3, 5), medAndet: top(med, 5, 9) - bund(med, 3, 5), medTredje: top(med, 15, 19),
        typer: ['kick', 'bas', 'ana:taktfase', 'ana:toneklasse', 'hnd:takt', 'ana:c3'].map(k => k + '=' + sigInfo(k).mappe + '/' + sigInfo(k).type) };
    });
    T.tjek(mot.d0 === 0, 'spærretid 0 på kick og snare: præcis som før (forskel ' + mot.d0 + ')');
    T.tjek(mot.dGlid === 0, 'kilder, der glider (bas, RMS), med spærretid 120 og 300 ms: præcis som før (forskel ' + mot.dGlid + ')');
    T.tjek(mot.dKlods === 0, 'klods-spor: præcis som før (forskel ' + mot.dKlods + ')');
    T.tjek(mot.udenAndet > .3 && mot.medAndet < .02, `to anslag 50 ms fra hinanden: uden spærretid stiger effekten ${mot.udenAndet.toFixed(2)} igen; med 120 ms ${mot.medAndet.toFixed(2)}`);
    T.tjek(mot.medTredje > .5, `et anslag 250 ms senere kommer igennem (top ${mot.medTredje.toFixed(2)})`);
    T.tjek(mot.typer.join(' ') === 'kick=Rytme/slag bas=Frekvens/glidende ana:taktfase=Rytme/rampe ana:toneklasse=Tone og harmoni/valg hnd:takt=Rytme/slag ana:c3=Tone og harmoni/glidende', 'signaltyperne: ' + mot.typer.join(', '));

    /* Spærretid virker kun for slag-kilder (Router 2.0 er slettet i v9.35; Node-editorens drejeknap bruger samme regel, r2SpaerVirker) */
    const r = await side.evaluate(() => ({ kick: r2SpaerVirker({ band: 'kick', effect: 'puls' }), bas: r2SpaerVirker({ band: 'bas', effect: 'ring' }) }));
    T.tjek(r.kick && !r.bas, 'spærretid virker for kick (slag) og ikke for bas (glidende); Node-editoren gør knappen grå for bas');
    let f = nyeFejl(); T.tjek(!f.length, 'motoren uden fejl', f.slice(0, 3).join(' | '));

    /* W4: M-knappen */
    await side.evaluate(() => { sbAabn('w4'); });
    await side.waitForTimeout(600);
    const w4 = await side.evaluate(() => { const row = document.querySelector('#pads .gr'), mt = row.querySelector('.mt'), vr = row.querySelector('input[type=range]'), pad = row.querySelector('.pad'); const R = e => e.getBoundingClientRect();
      return { mt: Math.round(R(mt).width), afstand: Math.round(R(pad).left - R(vr).right), alleSynlige: [...document.querySelectorAll('#pads .gr')].every(g => { const p = g.querySelectorAll('.pad:not([hidden])'); return p.length && R(p[p.length - 1]).right <= R(document.getElementById('w4')).right + 1; }) }; });
    T.tjek(w4.mt < 40, `M-knappen er ${w4.mt} px bred (før cirka 760 px)`);
    T.tjek(w4.afstand < 20 && w4.alleSynlige, `trinene står lige efter lydstyrken (${w4.afstand} px), og alle trin kan ses i vinduet`);
    await side.locator('#w4').screenshot({ path: path.join(UD, 'w4-m-knap.png') });
    f = nyeFejl(); T.tjek(!f.length, 'W4 uden fejl', f.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/w4-m-knap.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
