/* Trin 4 · Det nye i v9.26: Node-editoren, trin 8 (flere regler på ét mål). Se papirets afsnit 5.8.
   Motoren: uden m.komb giver den nye motor præcis det samme som den gamle (R2M.gammel) for alle forudindstillinger; med to regler på samme mål giver
   Største det største, Læg sammen summen (højst 1) og Gang produktet. Kontrolpanelet: Største · Læg sammen · Gang sætter m.komb på alle målets regler,
   mærket på noden følger med, og Fortryd sætter det tilbage. Skærmbillede: tests/ud/node-editor-komb.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 8)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('21 · Node-editor, trin 8 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    /* motoren: præcis som før uden m.komb */
    const ens = await side.evaluate(() => { const ud = []; FORINDST.forEach(f => { try { brugFor(f.id, true); } catch (e) { return; } const M = JSON.parse(JSON.stringify(maps)); if (!M.length) return; M.forEach(m => { m.gap = 0; delete m.hyst; delete m.holdMs; delete m.slew; }); /* spærretid, hysterese, hold med tid og slew er testet i test 5 og 6 */
      const kør = koer => { const o = { v: (m, i) => ((i * 37) % 100) / 100, off: m => !!m.off, master: 1, dt: 1 / 60, env: [], pe: [], E: {}, kant: () => {} }; for (let k = 0; k < 20; k++) { o.E = {}; koer(M, o); } return JSON.stringify(o.E); };
      ud.push(kør(Rytme.koer) === kør(R2M.gammel) ? '' : f.id); }); return { n: ud.length, fejl: ud.filter(Boolean) }; });
    T.tjek(ens.n > 10 && !ens.fejl.length, `uden m.komb regner motoren præcis som den gamle (${ens.n} forudindstillinger)`, ens.fejl.join(', '));
    /* to regler på samme mål */
    const tal = await side.evaluate(() => { const r = {}; for (const k of [undefined, 'sum', 'gang']) { const M = [{ band: 'a', effect: 'puls', thr: 0, gain: 1, att: 1, rel: 1, curve: 1, gap: 0, komb: k }, { band: 'b', effect: 'puls', thr: 0, gain: 1, att: 1, rel: 1, curve: 1, gap: 0, komb: k }];
      if (!k) M.forEach(m => delete m.komb); const sv = maps; maps = M; NE8.cache = null; const o = { v: (m) => m.band === 'a' ? .6 : .5, off: () => false, master: 1, dt: 1, env: [], pe: [], E: {}, kant: () => {} }; for (let j = 0; j < 5; j++) { o.E = {}; Rytme.koer(M, o); } maps = sv; NE8.cache = null; r[k || 'max'] = Math.round(o.E.puls * 1000) / 1000; } return r; });
    T.tjek(tal.max === .6 && tal.sum === 1 && tal.gang === .3, `to regler (0,6 og 0,5) på samme mål: Største ${tal.max}, Læg sammen ${tal.sum} (højst 1), Gang ${tal.gang}`);
    /* kontrolpanelet */
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); });
    const e = await side.evaluate(() => { const c = {}; maps.forEach(m => c[m.effect] = (c[m.effect] || 0) + 1); let e = Object.keys(c).find(k => c[k] > 1); if (!e) { maps.push(Object.assign({}, maps[0], { band: 'snare' })); renderMaps(); e = maps[0].effect; } return e; });
    await side.waitForTimeout(900);
    const før = await side.evaluate(() => JSON.stringify(maps));
    await side.evaluate(e => { neVaelg('m:' + e); }, e); await side.waitForTimeout(300);
    await side.click('#ne-kp [data-ne8="sum"]'); await side.waitForTimeout(500);
    const s1 = await side.evaluate(e => ({ alle: maps.filter(m => m.effect === e).every(m => m.komb === 'sum'), andre: maps.filter(m => m.effect !== e).every(m => !m.komb), mærke: NE2.N.get('m:' + e).el.textContent, knap: document.querySelector('#ne-kp [data-ne8="sum"]').classList.contains('ne-paa'), saet: document.querySelector('#ne-kp .ne-kp-tekst').textContent }), e);
    await side.screenshot({ path: path.join(UD, 'node-editor-komb.png') });
    T.tjek(s1.alle && s1.andre && /Læg sammen/.test(s1.mærke) && s1.knap && /Læg sammen/.test(s1.saet), `Læg sammen i kontrolpanelet: alle målets regler får m.komb, mærket og sætningen følger med ("${s1.saet.slice(0, 80)}…")`);
    await side.waitForTimeout(1500);
    await side.click('.ne-vk[data-ne4="fortryd"]'); await side.waitForTimeout(600);
    T.tjek(await side.evaluate(f => JSON.stringify(maps) === f, før), 'Fortryd sætter det tilbage til Største (intet m.komb)');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/node-editor-komb.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
