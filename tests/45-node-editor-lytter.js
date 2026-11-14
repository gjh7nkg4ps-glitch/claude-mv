/* Trin 4 · Det nye i v9.50: Node-editoren lytter på den fælles indgang, og resterne af Mapping-vinduet er fjernet (fase 1, trin 4: fase 1 er færdig).
   Før sammenlignede Node-editoren hele regel-listen to gange i sekundet (ne2Sig). Nu får den besked fra Regler (NE2.snavs) og bygger noderne om
   ved næste tjek; signaturen dækker kun figurerne og det, der ikke er regler.
   Testen ser, at noderne bygges om efter en ny regel, en rettet regel (også et gammelt sted, der skriver direkte i et felt), en slettet regel
   og en ændret figur, og at de ikke bygges om, når intet er ændret. Den ser også, at Mappings rester er væk fra filen. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editoren lytter');
  console.log('45 · Node-editoren lytter på den fælles indgang · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8'), kode = html.slice(0, html.indexOf('<!-- v9.32: den nye three.js'));
  const rester = ['#maps', "$('maps').innerHTML", 'tkGammelRender', 'stGammelRender', 'function stakTik', 'const effEn', 'const holdPortHtml', 'Minimér forbindelser'].filter(s => kode.includes(s));
  T.tjek(!rester.length, 'resterne af Mapping-vinduet er væk fra filen (tegningen i renderMaps, dens lyttere, de to tilføjelser for taktslag og spor, Styrke brugt i rækkerne, Minimér og udseendet)', rester.join(' · '));
  const sig = (kode.match(/function ne2Sig\(\)\{[^\n]*/) || [''])[0];
  T.tjek(sig && !/maps\.map/.test(sig) && /Regler\.lyt\(\(\)=>\{try\{NE2\.snavs=true/.test(kode), 'Node-editorens signatur indeholder ikke reglerne mere, og Node-editoren lytter på Regler');
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const r = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(800); lay3Anvend('noder'); await vent(2500); const ud = {};
      const regler = () => [...NE2.N.values()].filter(n => n.kol === 'regel').length;
      const prøv = async (navn, fn, tjek) => { await vent(1300); const N0 = NE2.N, r0 = regler(); try { await fn() } catch (e) { ud[navn] = 'fejl: ' + e.message; return } await vent(1300); const bygget = NE2.N !== N0; let t = true; try { if (tjek) t = tjek(r0) } catch (e) { t = 'fejl i tjek: ' + e.message } ud[navn] = (bygget && t === true) ? 'ok' : 'bygget om: ' + bygget + ' · ' + t };
      await prøv('Ny regel gennem indgangen', () => Regler.tilfoej(mk('hihat', 'strobe', .3, 1, 20, 200)), r0 => regler() === r0 + 1 || 'regel-noder ' + r0 + ' → ' + regler());
      await prøv('Ret gennem indgangen', () => Regler.retNr(maps.length - 1, { gain: .55 }), () => { const n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.m === maps[maps.length - 1]); return !n || n.m.gain === .55 || 'noden har ikke den nye styrke' });
      await prøv('Et gammelt sted retter et felt direkte og gemmer', () => { maps[maps.length - 1].thr = .42; save() });
      await prøv('Et gammelt sted retter et felt direkte uden at gemme', () => { maps[maps.length - 1].off = true });
      await prøv('Slet gennem indgangen', () => Regler.sletNr(maps.length - 1), r0 => regler() === r0 - 1 || 'regel-noder ' + r0 + ' → ' + regler());
      await prøv('Hent en anden opsætning', () => brugFor('std', true));
      await prøv('En figur får nyt navn (ikke en regel)', () => { fase2.objekter[0].navn = 'Nyt navn'; persistObj() });
      /* intet ændret: noderne bygges ikke om */
      await vent(1300); const N0 = NE2.N; await vent(2200); ud['Intet ændret: noderne bygges ikke om'] = NE2.N === N0 ? 'ok' : 'noderne blev bygget om uden grund';
      /* Fortryd bygger også om */
      await prøv('Ny regel og Fortryd', async () => { const n0 = maps.length; Regler.tilfoej(mk('kick', 'zoom', .3, 1, 20, 200)); await vent(1700); feFortryd(); await vent(300); if (maps.length !== n0) throw new Error('Fortryd gav ' + maps.length + ' regler mod ' + n0) }, r0 => regler() === r0 || 'regel-noder ' + r0 + ' → ' + regler());
      return ud; });
    const dårlig = Object.entries(r).filter(([k, v]) => v !== 'ok');
    T.tjek(!dårlig.length, `${Object.keys(r).length} tjek: noderne bygges om, når reglerne eller figurerne ændres, og ellers ikke (${Object.keys(r).join('; ')})`, dårlig.map(([k, v]) => k + ' → ' + v).join(' | '));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
