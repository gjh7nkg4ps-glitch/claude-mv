/* Trin 4 · Det nye i v9.49: de sidste 9 steder bruger den fælles indgang (fase 1, trin 3, femte og sidste bid).
   Diskodronningerne, Eksempel: trommeslager, Perfect, hændelser på figurerne, Lyd og vision (til og fra) og Node-editorens skabeloner.
   Testen tæller, at der kun er de 11 steder tilbage, som ikke skal flyttes (let maps, de to ved opstart, den midlertidige liste i lavIsoleret
   og lavSinglen, og den lokale liste i den tilfældige opsætning), lytter på Regler og ser, at ingen af handlingerne giver beskeden "andet",
   og trykker med et rigtigt museklik på en Lyd og vision-knap i Editoren. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
function direkte(fil) { const html = fs.readFileSync(fil, 'utf8'); let k = html.slice(html.indexOf('id="rytme-runtime"'), html.indexOf('<script type="text/plain" id="three-ny-core">'));
  const a = k.indexOf('/* ========== FÆLLES INDGANG TIL REGLERNE'), b = k.indexOf('/* ========== SLUT: FÆLLES INDGANG TIL REGLERNE'); if (a > 0 && b > a) k = k.slice(0, a) + k.slice(b);
  return [/(?<![\w$.])maps\s*=(?!=)/g, /(?<![\w$.])maps\.push\(/g, /(?<![\w$.])maps\.splice\(/g, /(?<![\w$.])maps\.length\s*=(?!=)/g].reduce((s, p) => s + (k.match(p) || []).length, 0); }
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Flytning 5');
  console.log('44 · Flytning til den fælles indgang, femte og sidste bid · ' + path.basename(fil));
  const n = direkte(fil);
  T.tjek(n <= 11, `${n} steder uden for den fælles indgang skriver direkte i regel-listen (20 i v9.48); de 11 skal ikke flyttes: oprettelsen, opstarten, en midlertidig og en lokal liste`);
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500); await side.evaluate(() => { FSF.direkte = true }); /* v9.64: knapperne giver nu forslag; denne test prøver de gamle hjælpefunktioner, der stadig skriver direkte, når en færdig opsætning eller figur indlæses */
    const r = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(1500); lay3Anvend('noder'); await vent(1500); const H = []; Regler.lyt(b => H.push(b.hvad)); const ud = {};
      const prøv = async (navn, fn, tjek) => { await vent(700); H.length = 0; const n0 = maps.length; try { await fn() } catch (e) { ud[navn] = 'fejl: ' + e.message; return } await vent(900); const ens = new Set(maps.map(m => m.id)).size === maps.length && maps.every(m => m.id); let t = true; try { if (tjek) t = tjek(n0) } catch (e) { t = 'fejl i tjek: ' + e.message }
        ud[navn] = (H.length > 0 && !H.includes('andet') && ens && t === true) ? 'ok' : 'beskeder: ' + H.join() + ' · id: ' + ens + ' · indhold: ' + t };
      const flere = n0 => maps.length > n0 || 'ingen nye regler';
      await prøv('Diskodronningerne', () => opDronninger(), flere);
      await prøv('Eksempel: trommeslager', () => opTrommer(), flere);
      brugFor('std', true); await vent(700);
      await prøv('Perfect 1', () => opPerfect(1), flere);
      brugFor('fuld2', true); await vent(1500);
      const alle = ne11Alle();
      for (const navn of ['Morgenstjerne', 'Puls på kick']) { const sk = alle.find(x => x.navn === navn), fk = sk && [...NE2.N.values()].find(n => (n.kol === 'figur' || n.kol === 'effekt' || n.kol === 'maal') && ne11Passer(sk, n.key)); if (!fk) { ud['Skabelon ' + navn] = 'ingen figur passer'; continue } await prøv('Skabelon ' + navn, () => neBrugSkabelon(sk, fk.key)); }
      return ud; });
    const dårlig = Object.entries(r).filter(([k, v]) => v !== 'ok');
    T.tjek(!dårlig.length, `${Object.keys(r).length} handlinger går gennem den fælles indgang, giver en rigtig besked og hvert sit id (${Object.keys(r).join('; ')})`, dårlig.map(([k, v]) => k + ' → ' + v).join(' | '));
    /* v9.75: fanen Adfærd (Lyd og vision) er fjernet; adfSlaa findes ikke mere. Tjekket af de andre steder står ovenfor */
    if (false) {
    await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(800); lay3Anvend('figurer'); await vent(1500); window.__H = []; Regler.lyt(b => window.__H.push(b.hvad)); });
    for (const k of await side.$$('#w6 button')) { if ((await k.textContent()).trim() === 'Adfærd') { await k.click({ timeout: 3000 }); break; } }
    await side.waitForTimeout(500);
    const find = async () => { for (const k of await side.$$('#w6 button')) { if ((await k.textContent()).includes('Ryste på snare')) return k; } return null; };
    let k = await find(); const n0 = await side.evaluate(() => maps.length);
    if (k) { await k.click({ timeout: 3000 }); await side.waitForTimeout(900); }
    const n1 = await side.evaluate(() => maps.length), h1 = await side.evaluate(() => { const h = window.__H.join(); window.__H.length = 0; return h });
    k = await find(); if (k) { await k.click({ timeout: 3000 }); await side.waitForTimeout(900); }
    const n2 = await side.evaluate(() => maps.length), h2 = await side.evaluate(() => window.__H.join());
    T.tjek(!!k && n1 !== n0 && n2 === n0 && !/andet/.test(h1 + h2) && h1 && h2, `Lyd og vision · "Ryste på snare" med museklik: ${n0} → ${n1} → ${n2} regler, beskederne "${h1}" og "${h2}"`, k ? `regler ${n0} → ${n1} → ${n2}, beskeder "${h1}" og "${h2}"` : 'knappen blev ikke fundet');
    }
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
