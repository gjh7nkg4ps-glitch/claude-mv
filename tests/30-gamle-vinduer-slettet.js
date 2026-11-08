/* Trin 4 · Det nye i v9.35: de fire gamle vinduer er slettet (Mapping, Router 2.0, Dublet og Routing-overblik), efter brugerens beslutning.
   - Vinduerne, deres faner og knapperne (Dublet, Routing-overblik) findes ikke; billed-løkken kalder ikke deres tegning.
   - Det flyttede virker: Gem som 1/2, Hent 1/2 og Sammenlign 1 ↔ 2 i Opsætninger; Kort over forbindelserne, Ryd hold, Tilføj morgenstjerne,
     Tilslut MIDI og Tilfældigt i Værksted · Lydtræk-guide; Morph Pads knap åbner Node-editoren.
   - Sidebjælkens Forbindelser åbner Arbejdsfeltet; reglerne laves i Node-editoren; motoren og de gemte regler er de samme.
   Skærmbillede: tests/ud/flyttet-vaerksted.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Gamle vinduer slettet'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('30 · Gamle vinduer slettet · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8'), kode = html.slice(0, html.indexOf('<script type="text/plain" id="three-ny-core">'));
  T.tjek(!/id="(w8|w10|w12|w32|dubbtn|rtbtn|maps|r2)"/.test(kode) && !/========== PREVIEW-DUBLET|========== ROUTING-OVERBLIK \(v3\.4\)/.test(kode), 'vinduerne, knapperne og blokkene Dublet og Routing-overblik er væk fra filen');
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const a = await side.evaluate(() => ({ faner: FG.lyd.faner.map(f => f[1]).concat(SC_FANER.map(f => f[1])).filter(n => /Mapping|Router|Dublet|Routing/.test(n)), vin: ['w8', 'w10', 'w12', 'w32'].filter(id => document.getElementById(id)), hvor: ['swap', 'abmsg', 'mvk-aaben', 'hold-ryd', 'addms', 'map-midi', 'rnd-slag', 'rnd-antal'].map(i => i + ':' + ((document.getElementById(i) || {}).closest ? (document.getElementById(i).closest('.win') || {}).id : '–')).join(' '), lyd: FG.lyd.faner.map(f => f[1]).join(', ') }));
    T.tjek(!a.faner.length && !a.vin.length, `ingen faner eller vinduer tilbage; Arbejdsfeltet har nu ${a.lyd}`);
    T.tjek(a.hvor === 'swap:w13 abmsg:w13 mvk-aaben:w18 hold-ryd:w18 addms:w18 map-midi:w18 rnd-slag:w18 rnd-antal:w18', 'flyttet: Gem/Hent 1/2 og Sammenlign til Opsætninger (W13), værktøjerne til Værksted · Lydtræk-guide (W18)', a.hvor);
    const b = await side.evaluate(async () => { brugFor('fuld1', true); const før = JSON.stringify(maps); document.querySelector('#w13 [data-save="A"]').click(); await new Promise(r => setTimeout(r, 200)); const gemt = !!localStorage.getItem('rytme-A');
      const n0 = maps.length; document.getElementById('rnd-slag').click(); await new Promise(r => setTimeout(r, 300)); const n1 = maps.length; document.getElementById('rnd-fortryd').click(); await new Promise(r => setTimeout(r, 300)); const tilbage = JSON.stringify(maps) === før;
      document.getElementById('mvk-aaben').click(); await new Promise(r => setTimeout(r, 300)); const kort = !document.getElementById('mvk').hidden; document.getElementById('mvk').hidden = true;
      const f0 = fase2.objekter.length; document.getElementById('addms').click(); await new Promise(r => setTimeout(r, 300)); const ms = fase2.objekter.length === f0 + 1;
      document.getElementById('hold-ryd').click(); const hold = /Hold ryddet/.test(document.getElementById('status').textContent + (document.querySelector('.msg,#msg') || {}).textContent);
      return { gemt, n0, n1, tilbage, kort, ms, hold, morph: document.getElementById('mmpforb').textContent }; });
    T.tjek(b.gemt, 'Gem som 1 i Opsætninger gemmer (rytme-A)');
    T.tjek(b.n1 > b.n0 && b.tilbage, `Tilfældige slag laver regler (${b.n0} → ${b.n1}), og Fortryd tilfældigt bringer dem præcis tilbage`);
    T.tjek(b.kort && b.ms, 'Kort over forbindelserne åbner, og Tilføj morgenstjerne laver en figur');
    T.tjek(b.morph === 'Forbind i Node-editoren', `Morph Pad: "${b.morph}"`);
    await side.evaluate(async () => { try { fgVaelg('vaerk', 'w18', true); fgVisHost('vaerk') } catch (e) { sbAabn && sbAabn('w26') } await new Promise(r => setTimeout(r, 600)); });
    await side.screenshot({ path: path.join(UD, 'flyttet-vaerksted.png') }); await side.keyboard.press('Escape');
    const c = await side.evaluate(async () => { const b = [...document.querySelectorAll('#sb button, .sb button, [data-sb]')].find(x => /Forbindelser/.test(x.textContent)); if (b) b.click(); await new Promise(r => setTimeout(r, 600)); const w = document.getElementById('w33'); return { knap: !!b, synlig: !!(w && !w.hidden && w.getBoundingClientRect().width > 0) }; });
    T.tjek(c.knap && c.synlig, 'sidebjælkens Forbindelser viser Node-editoren');
    const ægte = fejl.filter(f => !/mermaid|jsdelivr|net::/i.test(f));
    T.tjek(!ægte.length, 'ingen fejl i browseren (uden internet kan Mermaid ikke hentes; det er kendt)', ægte.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/flyttet-vaerksted.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
