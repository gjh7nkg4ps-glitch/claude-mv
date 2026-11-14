/* Trin 4 · Det nye i v9.45: de første steder er flyttet til den fælles indgang (fase 1, trin 3, første bid).
   Ni steder laver eller sletter nu en regel gennem Regler i stedet for at skrive direkte i maps: EQ (ny regel), Radial Mesh (ny regel, slet-knap, Delete),
   Editorens Koblinger (slet), Node-editoren (ny regel, slet), visningerne (slet) og lydlag (bindLyd). To rester fra Mapping er fjernet.
   Testen lytter på Regler og ser, at hvert sted giver beskeden tilfoej, slet eller samlet (et gammelt sted giver "andet"), at reglen får et id,
   og at Fortryd stadig virker. Den tæller også, hvor mange steder uden for indgangen der stadig skriver direkte i maps. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
function direkte(fil) { const html = fs.readFileSync(fil, 'utf8'); let k = html.slice(html.indexOf('id="rytme-runtime"'), html.indexOf('<script type="text/plain" id="three-ny-core">'));
  const a = k.indexOf('/* ========== FÆLLES INDGANG TIL REGLERNE'), b = k.indexOf('/* ========== SLUT: FÆLLES INDGANG TIL REGLERNE'); if (a > 0 && b > a) k = k.slice(0, a) + k.slice(b);
  return [/(?<![\w$.])maps\s*=(?!=)/g, /(?<![\w$.])maps\.push\(/g, /(?<![\w$.])maps\.splice\(/g, /(?<![\w$.])maps\.length\s*=(?!=)/g].reduce((s, p) => s + (k.match(p) || []).length, 0); }
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Flytning 1');
  console.log('40 · Flytning til den fælles indgang, første bid · ' + path.basename(fil));
  const n = direkte(fil);
  T.tjek(n <= 57, `${n} steder uden for den fælles indgang skriver stadig direkte i regel-listen (69 i v9.42, 68 i v9.44; højst 57 nu)`);
  const kode = fs.readFileSync(fil, 'utf8');
  T.tjek(!/\$\('add'\)\)\$\('add'\)\.onclick/.test(kode) && !/dataset\.del!==undefined/.test(kode), 'resterne fra Mapping (Ny forbindelse og slet-knappen i en række) er væk');
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const r = await side.evaluate(async () => { brugFor('fuld2', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 2000)); const H = []; Regler.lyt(b => H.push(b.hvad)); const ud = {}, vent = ms => new Promise(r => setTimeout(r, ms));
      const prøv = async (navn, fn, ventet, dn) => { H.length = 0; const n0 = maps.length; try { await fn() } catch (e) { ud[navn] = 'fejl: ' + e.message; return } await vent(700); const ens = new Set(maps.map(m => m.id)).size === maps.length && maps.every(m => m.id); ud[navn] = (H.join() === ventet && maps.length - n0 === dn && ens) ? 'ok' : 'beskeder: ' + H.join() + ' · ændring: ' + (maps.length - n0) + ' · id: ' + ens };
      await prøv('EQ · ny regel', () => document.getElementById('eqnew').click(), 'tilfoej', 1);
      await prøv('Radial Mesh · slet-knap', () => { meshSel = maps.length - 1; document.getElementById('mdel').click() }, 'slet', -1);
      await prøv('Radial Mesh · ny regel', () => { const G = { exact: true }; meshKobl({ kind: 'b', key: 'rms' }, { kind: 'e', key: 'ryst' }, G) }, 'samlet', 1);
      await prøv('Radial Mesh · Delete', () => { scVaelg('w5', true); meshSel = maps.length - 1; const c = document.getElementById('mesh'); c.focus(); c.dispatchEvent(new KeyboardEvent('keydown', { key: 'Delete', bubbles: true })) }, 'slet', -1);
      await prøv('Node-editoren · ny regel', () => { ne5Ny('hihat', 'strobe', 'handling') }, 'tilfoej', 1);
      await prøv('Node-editoren · slet', () => ne5Slet(maps.length - 1), 'slet', -1);
      await prøv('Visningerne · slet', () => { maps.length && (rt.conn = maps.length - 1); rtSlet() }, 'slet', -1);
      await prøv('Lydlag · kobl', () => bindLyd('klik', 'hihat'), 'samlet', 1);
      await prøv('Lydlag · skift kilde', () => bindLyd('klik', 'snare'), 'samlet', 0);
      await prøv('Lydlag · fjern', () => bindLyd('klik', ''), 'samlet', -1);
      /* Editoren: slet en kobling */
      const i = maps.findIndex(m => m.effect.startsWith('obj:')); await prøv('Editoren · slet en kobling', () => { const b = document.createElement('button'); b.dataset.dkSlet = i; document.getElementById('fctl').appendChild(b); b.click(); b.remove() }, 'slet', -1);
      /* Fortryd efter en regel lavet gennem indgangen */
      await vent(1500); const n1 = maps.length; ne5Ny('kick', 'zoom', 'handling'); await vent(1700); feFortryd(); await vent(300); ud.fortryd = maps.length === n1 ? 'ok' : 'længde ' + maps.length + ' mod ' + n1;
      return ud; });
    const dårlig = Object.entries(r).filter(([k, v]) => v !== 'ok');
    T.tjek(!dårlig.length, `${Object.keys(r).length - 1} handlinger går gennem den fælles indgang, giver den rigtige besked og et id (${Object.keys(r).filter(k => k !== 'fortryd').join('; ')}); Fortryd virker bagefter`, dårlig.map(([k, v]) => k + ' → ' + v).join(' | '));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
