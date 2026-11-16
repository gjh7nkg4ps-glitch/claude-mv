/* Trin 4 · Det nye i v9.48: Slet og Vis i Editorens Koblinger virker igen, og 15 steder mere bruger den fælles indgang (fase 1, trin 3, fjerde bid).
   Fejlen (fundet af brugeren i v9.47, men fra v9.36): rækkerne i Koblinger har mærket data-dk, og det har zonernes knapper (docking) også,
   så zonernes klik-lytter opfangede klikket og stoppede det. Testen trykker med et rigtigt museklik på Slet og Vis.
   De 15 steder er hjælpere, der kaldes midt i en større handling: banens klods-regler, Tilfældigt, Lav figurer, danseren, diskokuglen og lagenes numre.
   Testen lytter på Regler og ser, at ingen af dem giver beskeden "andet" (den får et gammelt sted), og at alle regler har hvert sit id. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
function direkte(fil) { const html = fs.readFileSync(fil, 'utf8'); let k = html.slice(html.indexOf('id="rytme-runtime"'), html.indexOf('<script type="text/plain" id="three-ny-core">'));
  const a = k.indexOf('/* ========== FÆLLES INDGANG TIL REGLERNE'), b = k.indexOf('/* ========== SLUT: FÆLLES INDGANG TIL REGLERNE'); if (a > 0 && b > a) k = k.slice(0, a) + k.slice(b);
  return [/(?<![\w$.])maps\s*=(?!=)/g, /(?<![\w$.])maps\.push\(/g, /(?<![\w$.])maps\.splice\(/g, /(?<![\w$.])maps\.length\s*=(?!=)/g].reduce((s, p) => s + (k.match(p) || []).length, 0); }
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Flytning 4');
  console.log('43 · Slet i Koblinger og flytning til den fælles indgang, fjerde bid · ' + path.basename(fil));
  const n = direkte(fil);
  T.tjek(n <= 20, `${n} steder uden for den fælles indgang skriver stadig direkte i regel-listen (35 i v9.47; højst 20 nu)`);
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const side = await browser.newPage({ viewport: { width: w, height: h } }); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500); await side.evaluate(() => { FSF.direkte = true }); /* v9.64: knapperne giver nu forslag; denne test prøver de gamle hjælpefunktioner, der stadig skriver direkte, når en færdig opsætning eller figur indlæses */
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(1000); lay3Anvend('figurer'); await vent(1500); });
      for (const k of await side.$$('#w6 button')) { if ((await k.textContent()).trim().startsWith('Koblinger')) { await k.click({ timeout: 3000 }); break; } }
      await side.waitForTimeout(600);
      /* Vis: klikket skal nå helt ud (før blev det stoppet af zonerne) */
      await side.evaluate(() => { window.__naaet = 0; window.addEventListener('click', e => { if (e.target.closest && e.target.closest('[data-fe-vis]')) window.__naaet++ }) });
      const vis = await side.$('#fctl .fe-kobr [data-fe-vis]'); let visOk = false;
      if (vis) { await vis.click({ timeout: 3000 }); await side.waitForTimeout(500); visOk = await side.evaluate(() => window.__naaet === 1); }
      T.tjek(visOk, `${w} × ${h}: et museklik på Vis i Koblinger når frem`, vis ? 'klikket blev stoppet' : 'knappen Vis blev ikke fundet');
      for (const k of await side.$$('#w6 button')) { if ((await k.textContent()).trim().startsWith('Koblinger')) { await k.click({ timeout: 3000 }); break; } }
      await side.waitForTimeout(500);
      const før = await side.evaluate(() => ({ n: maps.length, k: document.querySelectorAll('#fctl [data-dk-slet]').length }));
      const slet = await side.$('#fctl [data-dk-slet]'); if (slet) await slet.click({ timeout: 3000 }); await side.waitForTimeout(800);
      const efter = await side.evaluate(() => ({ n: maps.length, k: document.querySelectorAll('#fctl [data-dk-slet]').length, s: document.getElementById('status').textContent }));
      T.tjek(!!slet && efter.n === før.n - 1 && efter.k === før.k - 1 && /slettet/.test(efter.s), `${w} × ${h}: et museklik på Slet i Koblinger sletter koblingen (${før.n} → ${efter.n} regler, ${før.k} → ${efter.k} rækker, beskeden "${efter.s}")`, slet ? `regler ${før.n} → ${efter.n}, rækker ${før.k} → ${efter.k}` : 'knappen Slet blev ikke fundet');
      /* zonernes egne knapper virker stadig: ⤢ Stor på Editorens zone og tilbage */
      const stor = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)), z = document.querySelector('.dk-zone:has(#w6)'), b = z && z.querySelector('[data-dk="stor"]'); if (!b) return 'knappen mangler'; const b0 = z.getBoundingClientRect().width; b.click(); await vent(500); const z1 = document.querySelector('.dk-zone:has(#w6)'), b1 = z1.getBoundingClientRect().width; const t = z1.querySelector('[data-dk="stor"]'); if (t) t.click(); await vent(500); return b1 > b0 ? 'ok' : 'bredde ' + b0 + ' → ' + b1 });
      T.tjek(stor === 'ok', `${w} × ${h}: zonens egen knap ⤢ Stor virker stadig`, stor);
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await side.close();
    }
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500); await side.evaluate(() => { FSF.direkte = true }); /* v9.64: knapperne giver nu forslag; denne test prøver de gamle hjælpefunktioner, der stadig skriver direkte, når en færdig opsætning eller figur indlæses */
    const r = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(2000); const H = []; Regler.lyt(b => H.push(b.hvad)); const ud = {};
      /* ventet: de beskeder, der må komme (mindst én af dem skal komme); tjek: indholdet bagefter */
      const prøv = async (navn, fn, ventet, tjek) => { await vent(700); H.length = 0; try { await fn() } catch (e) { ud[navn] = 'fejl: ' + e.message; return } await vent(900); const ens = new Set(maps.map(m => m.id)).size === maps.length && maps.every(m => m.id); let t = true; try { if (tjek) t = tjek() } catch (e) { t = 'fejl i tjek: ' + e.message }
        ud[navn] = (H.length > 0 && H.every(h => ventet.includes(h)) && ens && t === true) ? 'ok' : 'beskeder: ' + H.join() + ' · id: ' + ens + ' · indhold: ' + t };
      const klods = () => maps.filter(m => /^klods\d+$/.test(m.effect)).length;
      await prøv('Bane med 16 spor', () => baneSkabelon(16, true), ['tilfoej', 'samlet'], () => klods() === 16 || klods() + ' klods-regler');
      await prøv('Antal spor ned til 2', () => { scene.spor = 2; sporAendret() }, ['slet', 'samlet'], () => klods() === 2 || klods() + ' klods-regler');
      await prøv('Antal spor op til 5', () => { scene.spor = 5; sporAendret() }, ['tilfoej', 'samlet'], () => klods() === 5 || klods() + ' klods-regler');
      await prøv('Bane · Standard', () => document.getElementById('sstd').click(), ['slet', 'samlet'], () => klods() === 3 || klods() + ' klods-regler');
      await prøv('Tilfældigt (erstat)', () => tilfaeldigt('slag', { antal: 3, erstat: true, froe: 'test' }), ['samlet', 'tilfoej', 'slet']);
      await prøv('Lav figurer (erstat)', () => lavFigurer({ antal: 3, erstat: true, froe: 'test' }), ['samlet', 'tilfoej', 'slet', 'andet']);
      /* lagenes numre */
      selO = Math.max(0, fase2.objekter.findIndex(o => maps.some(m => m.effect.startsWith('obj:' + o.id + ':0:')))); selL = 0; const o = fase2.objekter[selO], n0 = maps.filter(m => m.effect.startsWith('obj:' + o.id + ':0:')).length, lag = (li) => maps.filter(m => m.effect.startsWith('obj:' + o.id + ':' + li + ':')).length;
      if (!n0) ud['Lag'] = 'ingen figur med regler'; else {
        lagNyt(); await vent(700); const ny = o.lag.length - 1;
        selL = 0; while (selL < ny) { lagFlyt(1) } await vent(700);
        ud['Flyt lag: reglerne følger med'] = lag(ny) === n0 ? 'ok' : 'lag ' + ny + ' har ' + lag(ny) + ' mod ' + n0;
        await prøv('Flyt lag op', () => { selL = ny; lagFlyt(-1) }, ['ret', 'samlet'], () => lag(ny - 1) === n0 || 'lag ' + (ny - 1) + ' har ' + lag(ny - 1));
        await prøv('Slet lag', () => { selL = ny - 1; lagSlet() }, ['slet', 'samlet'], () => !maps.some(m => m.effect.startsWith('obj:' + o.id + ':') && +m.effect.split(':')[2] >= o.lag.length) || 'regler til lag, der ikke findes'); }
      /* danser og diskokugle */
      const d = nyFigurHer('Danser', .4, .5, 'danser'), dp = 'obj:' + d.id + ':0:', dans = () => maps.filter(m => m.effect.startsWith(dp)).length;
      await prøv('Danser · standardforbindelser', () => { danserStandard(d, 0); save() }, ['tilfoej', 'samlet'], () => dans() > 3 || dans() + ' regler');
      const p0 = DANS_MOVES.find(([p]) => p !== 'dKrop')[0];
      await prøv('Danser · kobl en bevægelse om', () => { danserKobl(d, 0, p0, 'snare', .8); save() }, ['samlet'], () => (maps.find(m => m.effect === dp + p0) || {}).band === 'snare' || 'kilden er ikke snare');
      selO = fase2.objekter.indexOf(d); selL = 0; formUI(); await vent(300);
      await prøv('Danser · Ryd', () => document.querySelector('#fctl [data-dmk="ryd"]').click(), ['slet', 'samlet'], () => dans() === 0 || dans() + ' regler tilbage');
      const k = nyFigurHer('Kugle', .6, .5, 'discokugle'), kp = 'obj:' + k.id + ':0:';
      await prøv('Diskokugle · koblinger', () => { diskoKobl(k, 0); save() }, ['tilfoej', 'samlet'], () => maps.filter(m => m.effect.startsWith(kp)).length === 4 || maps.filter(m => m.effect.startsWith(kp)).length + ' regler');
      return ud; });
    const dårlig = Object.entries(r).filter(([k, v]) => v !== 'ok');
    T.tjek(!dårlig.length, `${Object.keys(r).length} tjek: hjælperne går gennem den fælles indgang, giver en rigtig besked, hvert sit id og de rigtige regler (${Object.keys(r).join('; ')})`, dårlig.map(([k, v]) => k + ' → ' + v).join(' | '));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
