/* Trin 4 · Det nye i v9.34: Node-editoren, trin 16 (funktionsliste-tjek). Se papirets afsnit 8 og planens trin 16.
   Uden browser: hver linje i docs/arkiv/hjertet/FUNKTIONER.md står præcis én gang i docs/node-editoren/FUNKTIONSLISTE-TJEK.md under samme del,
   status er lavet, delvis, mangler eller ikke nødvendig, sammendraget passer, og Kort over forbindelserne (Mermaid, PNG, SVG) og de 11 visninger
   fra Routing-overblik står med. Tallene i programmet (NE16) passer med tabellen.
   I browseren: hvert navn i kolonnen Kontrol findes i programmet; Ctrl+K i Node-editoren åbner Kort over forbindelserne; de fire gamle vinduer er slettet (v9.35).
   Skærmbillede: tests/ud/funktionsliste.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const ROD = path.join(__dirname, '..');
const del = l => l.slice(3).replace(/^\d+\.\s*/, '').split(' (')[0].trim();
function funktioner() { const R = []; let sek = '', ord = false; for (const l of fs.readFileSync(path.join(ROD, 'docs/arkiv/hjertet/FUNKTIONER.md'), 'utf8').split('\n')) { if (l.startsWith('## ')) { sek = del(l); ord = false; continue } if (l.startsWith('### ')) { ord = /Ord/.test(l); continue } if (l.startsWith('| ') && !l.startsWith('| ---') && !l.startsWith('| Funktion |') && !l.startsWith('| Ord |')) R.push([ord ? 'Ord' : sek, l.trim().replace(/^\||\|$/g, '').split('|')[0].trim()]) } return R }
function tjek() { const R = []; let sek = ''; for (const l of fs.readFileSync(path.join(ROD, 'docs/node-editoren/FUNKTIONSLISTE-TJEK.md'), 'utf8').split('\n')) { if (l.startsWith('## ')) { sek = l.slice(3).trim(); continue } if (sek !== 'Sammendrag' && l.startsWith('| ') && !l.startsWith('| ---') && !l.startsWith('| Funktion |')) { const c = l.trim().replace(/^\||\|$/g, '').split('|').map(x => x.trim()); R.push({ sek, fn: c[0], st: c[1], kontrol: (c[4] || '').replace(/`/g, '').split(',').map(x => x.trim()).filter(Boolean) }) } } return R }
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 16)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('29 · Node-editor, trin 16 · ' + path.basename(fil));
  const F = funktioner(), J = tjek(), ST = ['✅ lavet', '◐ delvis', '✗ mangler', '– ikke nødvendig'];
  const mangler = F.filter(([s, f]) => J.filter(j => j.sek === s && j.fn === f).length !== 1);
  T.tjek(F.length > 100 && !mangler.length, `alle ${F.length} linjer fra FUNKTIONER.md står præcis én gang i tabellen`, mangler.slice(0, 4).map(x => x.join(': ')).join(' | '));
  const dårlig = J.filter(j => !ST.includes(j.st));
  T.tjek(!dårlig.length, `hver linje har en af de fire status (${J.length} linjer i alt)`, dårlig.slice(0, 3).map(j => j.fn + ': ' + j.st).join(' | '));
  const tal = {}; J.filter(j => F.some(([s, f]) => s === j.sek && f === j.fn)).forEach(j => tal[j.st] = (tal[j.st] || 0) + 1);
  const md = fs.readFileSync(path.join(ROD, 'docs/node-editoren/FUNKTIONSLISTE-TJEK.md'), 'utf8'), sum = k => +((md.match(new RegExp('\\| ' + k + ' \\| (\\d+) \\|')) || [0, -1])[1]);
  T.tjek(ST.every(k => (tal[k] || 0) === sum(k)), `sammendraget passer: ${ST.map(k => k + ' ' + (tal[k] || 0)).join(', ')}`);
  const html = fs.readFileSync(fil, 'utf8'), ne16 = (html.match(/const NE16=\{lavet:(\d+),delvis:(\d+),mangler:(\d+),ikke:(\d+),ialt:(\d+)/) || []).slice(1).map(Number);
  T.tjek(ne16.join() === [tal[ST[0]] || 0, tal[ST[1]] || 0, tal[ST[2]] || 0, tal[ST[3]] || 0, F.length].join() /* v9.42: 0 står ikke i optællingen */, `tallene i programmet (NE16: ${ne16.join(', ')}) passer med tabellen`);
  const kort = J.filter(j => j.sek === 'Kort over forbindelserne').map(j => j.fn), vis = J.filter(j => j.sek === 'Routing-overblik: de 11 visninger');
  const elleve = ((fs.readFileSync(path.join(ROD, 'docs/arkiv/hjertet/FUNKTIONER.md'), 'utf8').match(/11 måder at se de samme forbindelser: ([^.]*)\./) || [0, ''])[1]).split(' · ').map(x => x.trim());
  T.tjek(kort.length === 3 && /Mermaid/.test(kort[0]) && kort.includes('⬇ PNG') && kort.includes('⬇ SVG') && vis.length === 11 && elleve.length === 11 && elleve.every(v => vis.some(j => j.fn === v)), `Kort over forbindelserne (${kort.join(', ')}) og de 11 visninger fra Routing-overblik står med (${vis.filter(j => j.st === ST[0]).length} lavet, ${vis.filter(j => j.st === ST[2]).length} mangler)`);
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const navne = [...new Set(J.flatMap(j => j.kontrol))];
    const k = await side.evaluate(async N => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1200)); neVaelg(null); return { mangler: N.filter(x => typeof window[x] !== 'function'), tekst: (document.querySelector('#ne-kp .ne16-liste') || {}).textContent || '', gamle: ['w8', 'w10', 'w12', 'w32'].filter(id => document.getElementById(id)) }; }, navne);
    T.tjek(!k.mangler.length, `alle ${navne.length} navne i kolonnen Kontrol findes i programmet`, k.mangler.join(', '));
    await side.screenshot({ path: path.join(UD, 'funktionsliste.png') });
    T.tjek(k.tekst.includes(tal[ST[0]] + ' af ' + F.length) /* v9.39: tallet læses fra tabellen (før fast 85) */ && !k.gamle.length, `kontrolpanelet: "${k.tekst.slice(0, 70)}…"; de fire gamle vinduer er slettet (v9.35)`);
    const m = await side.evaluate(async () => { const L = []; neKpPunkter(L); const p = L.find(x => /Kort over forbindelserne/.test(x.n) && /Node-editor/.test(x.kat)); if (p) p.fn(); await new Promise(r => setTimeout(r, 600)); const r = { punkt: !!p, aaben: !document.getElementById('mvk').hidden }; document.getElementById('mvk').hidden = true; return r; });
    T.tjek(m.punkt && m.aaben, 'Ctrl+K i Node-editoren: "Kort over forbindelserne (Mermaid, PNG, SVG)" åbner kortet');
    T.tjek(!fejl.filter(f => !/mermaid|jsdelivr|net::/i.test(f)).length, 'ingen fejl i browseren (uden internet kan Mermaid ikke hentes; det er kendt)', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/funktionsliste.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
