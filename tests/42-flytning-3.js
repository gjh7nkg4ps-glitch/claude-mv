/* Trin 4 · Det nye i v9.47: de steder, der skifter hele regel-listen, er flyttet til den fælles indgang (fase 1, trin 3, tredje bid).
   Ni steder bruger nu Regler.erstat(liste, true): hent en færdig opsætning og Opsætning 1–20 (anvend), applyPreset, Indlæs fra tekst, Auto-mapping,
   Nulstil alt, Fortryd og Gentag (feGendan), Fortryd tilfældigt, Fortryd figurer og Nulstil i Multi-styring.
   Testen lytter på Regler og ser, at hvert sted giver beskeden erstat (et gammelt sted giver "andet"), at alle regler har hvert sit id,
   og at reglerne er de rigtige bagefter. Auto-mapping kræver en analyseret sang og prøves ikke her (testen 8 og de færdige opsætninger kører den). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
function direkte(fil) { const html = fs.readFileSync(fil, 'utf8'); let k = html.slice(html.indexOf('id="rytme-runtime"'), html.indexOf('<script type="text/plain" id="three-ny-core">'));
  const a = k.indexOf('/* ========== FÆLLES INDGANG TIL REGLERNE'), b = k.indexOf('/* ========== SLUT: FÆLLES INDGANG TIL REGLERNE'); if (a > 0 && b > a) k = k.slice(0, a) + k.slice(b);
  return [/(?<![\w$.])maps\s*=(?!=)/g, /(?<![\w$.])maps\.push\(/g, /(?<![\w$.])maps\.splice\(/g, /(?<![\w$.])maps\.length\s*=(?!=)/g].reduce((s, p) => s + (k.match(p) || []).length, 0); }
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Flytning 3');
  console.log('42 · Flytning til den fælles indgang, tredje bid (skift af hele listen) · ' + path.basename(fil));
  const n = direkte(fil);
  T.tjek(n <= 35, `${n} steder uden for den fælles indgang skriver stadig direkte i regel-listen (44 i v9.46; højst 35 nu)`);
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const r = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(2000); const H = []; Regler.lyt(b => H.push(b.hvad)); const ud = {};
      /* par: kun kilde og mål (programmet udfylder selv standardværdier og manglende klods-regler efter et skift) */ const par = l => l.map(m => m.band + '>' + m.effect), harStd = () => par(DEFAULT).every(p => par(maps).includes(p));
      const uden = l => JSON.stringify(l.map(m => { const k = Object.assign({}, m); delete k.id; return k }));
      const prøv = async (navn, fn, tjek) => { H.length = 0; try { await fn() } catch (e) { ud[navn] = 'fejl: ' + e.message; return } await vent(700); const ens = new Set(maps.map(m => m.id)).size === maps.length && maps.every(m => m.id); let t = true; try { if (tjek) t = tjek() } catch (e) { t = 'fejl i tjek: ' + e.message }
        ud[navn] = (H.join() === 'erstat' && ens && t === true) ? 'ok' : 'beskeder: ' + H.join() + ' · id: ' + ens + ' · indhold: ' + t };
      await prøv('Hent en færdig opsætning', () => brugFor('fuld1', true), () => maps.length > 0); /* v9.85: Alle effekter (OPS_TEST); de 10 shows bygges i et rum (samlet-beskeder) */
      await prøv('applyPreset (Standard)', () => applyPreset(DEFAULT), () => harStd() || 'ikke som Standard');
      /* Opsætning 1–20: gem, lav om, hent */
      brugFor('fuld2', true); await vent(700); const gemt = uden(maps); slotSave('A'); await vent(300); Regler.sletNr(0); await vent(700);
      await prøv('Hent Opsætning 1', () => slotLoad('A'), () => uden(maps) === gemt || 'ikke som gemt');
      /* Indlæs fra tekst */
      const tekst = presetJSON(), parGemt = par(maps).join(); Regler.sletNr(0); await vent(700);
      await prøv('Indlæs fra tekst', () => { document.getElementById('json').value = tekst; document.getElementById('load').click() }, () => par(maps).join() === parGemt || 'ikke som teksten');
      /* Fortryd og Gentag */
      await vent(1500); const n0 = maps.length, id0 = maps.map(m => m.id).join(); Regler.tilfoej(mk('kick', 'zoom', .3, 1, 20, 200)); await vent(1700);
      await prøv('Fortryd (Ctrl+Z)', () => feFortryd(), () => (maps.length === n0 && maps.map(m => m.id).join() === id0) || 'længde ' + maps.length + ' mod ' + n0 + ' eller nye id');
      await prøv('Gentag', () => feGentag(), () => maps.length === n0 + 1 || 'længde ' + maps.length);
      /* Fortryd tilfældigt og Fortryd figurer */
      const f1 = uden(maps); tilfaeldigt('slag', { antal: 3, erstat: false, froe: 'test' }); await vent(700);
      await prøv('Fortryd tilfældigt', () => fortrydTilfaeldigt(), () => uden(maps) === f1 || 'ikke som før');
      const f2 = uden(maps), o2 = fase2.objekter.length; lavFigurer({ antal: 2, erstat: false, froe: 'test' }); await vent(700);
      if (uden(maps) === f2) ud['Fortryd figurer'] = 'lavFigurer lavede ingen regler'; else await prøv('Fortryd figurer', () => fortrydFigurer(), () => (uden(maps) === f2 && fase2.objekter.length === o2) || 'ikke som før');
      /* Multi-styring: Nulstil */
      puckRebase(); const f3 = uden(maps); Regler.retNr(0, { gain: (maps[0].gain || 1) + .3 }); await vent(700);
      await prøv('Multi-styring · Nulstil', () => document.getElementById('mb-nulstil').click(), () => uden(maps) === f3 || 'ikke som før');
      return ud; });
    /* Nulstil alt (de to bekræftelser besvares med ja): fra v9.73 genstarter programmet, så reglerne tjekkes efter genstarten */
    const genstart = side.waitForEvent('load', { timeout: 20000 }); await side.evaluate(() => { sikker = async () => true; nulstilAlt() });
    try { await genstart; await side.waitForTimeout(4000); r['Nulstil alt'] = await side.evaluate(() => { const par = l => l.map(m => m.band + '>' + m.effect); const ens = new Set(maps.map(m => m.id)).size === maps.length && maps.every(m => m.id); return (par(DEFAULT).every(p => par(maps).includes(p)) && ens) ? 'ok' : 'ikke som Standard efter genstarten' }) } catch (e) { r['Nulstil alt'] = 'genstartede ikke: ' + e.message.split('\n')[0] }
    const dårlig = Object.entries(r).filter(([k, v]) => v !== 'ok');
    T.tjek(!dårlig.length, `${Object.keys(r).length} steder skifter hele listen gennem den fælles indgang, giver beskeden erstat, hvert sit id og de rigtige regler (${Object.keys(r).join('; ')})`, dårlig.map(([k, v]) => k + ' → ' + v).join(' | '));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
