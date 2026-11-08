/* Trin 4 · Det nye i v9.33: Node-editoren, trin 15 (nye navne i hele programmet og "· gammel"). Se papirets afsnit 2 og 8.
   Uden browser: de gamle navne (Auto-tærskel, Portgrænse, auto-opsætning, Normalisering: Auto, forudindstilling, Skift A/B, Gem som A/B, pladserne A–T)
   findes 0 gange i programmets tekst (kommentarer, de gamle "Nyt i"-afsnit i manualen og tabellen over de gamle navne tæller ikke med).
   I browseren: fanerne Mapping, Router, Dublet og Routing-overblik viser "· gammel"; en gemt plads C (nøglen rytme-C) vises som Opsætning 3 og kan hentes og står i Galleriet;
   Gem som 1 gemmer i rytme-A; Normalisering: Adaptiv · Fast; Auto-mapping: Fra; Gate i Mapping; Auto-valg ved taktslaget. Skærmbillede: tests/ud/navne.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const GAMLE = ['Auto-tærskel', 'Portgrænse', 'portgrænse', 'auto-opsætning', 'Auto-opsætning', 'Normalisering: Auto', 'Fast reference', 'forudindstilling', 'Forudindstilling', 'Skift A/B', 'Gem som A', 'Gem som B', 'pladserne A–T', 'pladserne (A–T)'];
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 15)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('28 · Node-editor, trin 15 · ' + path.basename(fil));
  let t = fs.readFileSync(fil, 'utf8');
  t = t.slice(0, t.indexOf('<script type="text/plain" id="three-ny-core">'));
  t = t.replace(/<h3 id="man-v\d+">[\s\S]*?(?=<h3|<\/div>)/g, m => m.startsWith('<h3 id="man-v933">') ? m.replace(/<table class="ne33-navne">[\s\S]*?<\/table>/, '') : '');
  t = t.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '');
  const fund = GAMLE.map(w => [w, t.split(w).length - 1]).filter(x => x[1]);
  T.tjek(!fund.length, 'de gamle navne findes 0 gange i programmets tekst (uden kommentarer og de gamle "Nyt i"-afsnit)', fund.map(x => x[0] + ' ×' + x[1]).join(', '));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(500);
    await side.evaluate(() => { localStorage.setItem('rytme-C', JSON.stringify({ v: 2, navn: 'Gammel C', gemt: '2026-10-01T10:00:00.000Z', laast: false, maps: [{ band: 'kick', effect: 'puls', thr: .4, gain: 1, att: 10, rel: 200, curve: 1, gap: 120, min: true }], master: 1, objekter: [], pos: {} })); });
    await side.reload(); await side.waitForTimeout(3500);
    const g = await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1200)); const efter = s => { const e = document.querySelector(s); return e ? getComputedStyle(e, '::after').content.replace(/"/g, '') : '–' }; return { mapping: efter('[data-fgv="w12"]'), router: efter('[data-fgv="w32"]'), dublet: efter('[data-sc="w8"]'), routing: SC_FANER.find(f => f[0] === 'w10')[1] + efter('#w10>.wh>span'), ne: efter('[data-fgv="w33"]'), mappingTekst: (document.querySelector('[data-fgv="w12"]') || {}).textContent }; });
    T.tjek(g.mapping === ' · gammel' && g.router === ' · gammel' && g.dublet === ' · gammel' && /Routing-overblik · gammel/.test(g.routing) && g.ne === 'none' && g.mappingTekst === 'Mapping', `fanerne viser "Mapping · gammel", "Router · gammel", "Dublet · gammel" og "${g.routing}"; Node-editor uden mærke; knappens tekst er stadig "${g.mappingTekst}"`);
    await side.screenshot({ path: path.join(UD, 'navne.png') });
    const s = await side.evaluate(async () => { if (!opsBygget) opsByg(); opsOpdat(); await new Promise(r => setTimeout(r, 300)); const b = document.querySelector('#ops-grid [data-slot="C"]'); const r = { knap: b && b.querySelector('b').textContent, titel: b && b.title, navn: navnAktiv('C') }; slotLoad('C'); await new Promise(r => setTimeout(r, 300)); r.status = document.getElementById('status').textContent; r.maps = maps.length && maps[0].effect; r.kp = (galKort().find(x => x.slot === 'C') || {}).navn || ''; return r; }).catch(e => ({ fejl: e.message }));
    T.tjek(s.knap === '3' && /^Opsætning 3/.test(s.titel) && /^Opsætning 3 \(Gammel C\) hentet/.test(s.status) && s.maps === 'puls' && /Opsætning 3/.test(s.kp), `en gemt plads C (rytme-C) vises som "${s.knap}" og "${s.navn}", hentes ("${(s.status || '').slice(0, 40)}") og står i Galleriet som "${(s.kp || '').trim().slice(0, 40)}"`);
    const a = await side.evaluate(async () => { const b = document.querySelector('[data-save="A"]'); const r = { tekst: b.textContent, swap: document.getElementById('swap').textContent }; b.click(); await new Promise(r => setTimeout(r, 300)); r.gemt = !!localStorage.getItem('rytme-A'); r.status = document.getElementById('status').textContent; return r; });
    T.tjek(a.tekst === 'Gem som 1' && a.swap === 'Sammenlign 1 ↔ 2' && a.gemt && /Gemt som opsætning 1/.test(a.status), `"${a.tekst}" gemmer i rytme-A ("${a.status.slice(0, 30)}…"); "${a.swap}"`);
    const n = await side.evaluate(() => { const b = document.getElementById('norm'), r = [b.textContent]; b.click(); r.push(b.textContent); b.click(); r.push(b.textContent); return { r, auto: document.getElementById('auto').textContent, gate: [...document.querySelectorAll('#w12 label')].some(l => /^Gate/.test(l.textContent.trim())) || /Gate<select/.test(document.getElementById('w12').innerHTML) }; });
    T.tjek(n.r.join(' → ') === 'Normalisering: Adaptiv → Normalisering: Fast → Normalisering: Adaptiv' && n.auto === 'Auto-mapping: Fra', `${n.r.join(' → ')}; "${n.auto}"`);
    const v = await side.evaluate(() => { brugFor('fuld1', true); maps.push({ band: 'hnd:takt', effect: 'puls', thr: .5, gain: 1, att: 5, rel: 150, curve: 1, gap: 120, min: true }); renderMaps(); return { grund: typeof taktGrund === 'function' ? taktGrund(maps[maps.length - 1]) : '', gate: /Gate<select/.test(document.getElementById('w12').innerHTML) || /Gate/.test([...document.querySelectorAll('#w12 .mrow label, #w12 label')].map(x => x.textContent).join('|')) }; });
    T.tjek(/Auto-valg:/.test(v.grund) && v.gate, `taktslaget: "${v.grund.replace(/<[^>]+>/g, '').slice(0, 50)}"; Mapping har Gate (før Port)`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/navne.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
