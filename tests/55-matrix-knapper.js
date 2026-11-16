/* Trin 4 · Det nye i v9.60: tydelige knapper under matrixen, og Ctrl + klik rettet (brugerens fund 16. november).
   - Et Ctrl + klik, hvor musen flytter sig lidt inde i cellen, markerer cellen (før blev det til et træk, og cellen blev ikke markeret).
   - Linjen under matrixen står der altid; knapper, der ikke kan bruges, er grå.
   - Markér celler: Til gør, at et almindeligt klik markerer (også en tom celle) uden at lave en regel.
   - Kopiér, Indsæt, Indsæt indstillinger, Markér alle og Ryd markering med rigtige museklik, helt uden tastatur.
   - Største · Læg sammen · Gang i linjen for den valgte regels mål.
   Rigtige museklik ved 1920 × 1080, 2560 × 1440 og 3840 × 2160. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (knapper)');
  console.log('55 · Matrixen: tydelige knapper under matrixen, og Ctrl + klik · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const id = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(800); const a = nyFigurHer('Pige A', .35, .6, 'danser'), b = nyFigurHer('Pige B', .65, .6, 'danser'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
        ne5Ny('kick', 'obj:' + a.id + ':0:dHop'); Regler.retNr(maps.length - 1, { gain: 0.7, att: 15 }); ne5Ny('snare', 'obj:' + a.id + ':0:dArmV'); ne5Ny('hihat', 'obj:' + a.id + ':0:dHoved'); ne5Ny('snare', 'obj:' + a.id + ':0:dHop'); mxInd().mxE.e.push('obj:' + b.id + ':0:dHop'); mxInd().mxFold['g:Bane'] = true; await vent(1500); return { a: a.id, b: b.id } });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const E = (f, p) => 'obj:' + id[f] + ':0:' + p;
      const pkt = (b, e) => side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); if (!td) return null; td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height } }, { b, e });
      const klik = async (b, e) => { const p = await pkt(b, e); await side.mouse.click(p.x, p.y); await side.waitForTimeout(350) };
      const bar = () => side.evaluate(() => { const bj = document.getElementById('mx-bj'); return { vis: !!bj && !bj.hidden && bj.getBoundingClientRect().height > 20, tekst: bj.textContent, graa: [...bj.querySelectorAll('button:disabled')].map(b => b.textContent), knapper: [...bj.querySelectorAll('button')].map(b => b.textContent), mark: MX.mark.size, n: maps.length } });
      const knap = async navn => { const p = await side.evaluate(t => { const b = [...document.querySelectorAll('#mx-bj button')].find(x => x.textContent.startsWith(t)); if (!b || b.disabled) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, navn); if (!p) return false; await side.mouse.click(p.x, p.y); await side.waitForTimeout(900); return true };
      const regel = (b, e) => side.evaluate(({ b, e }) => { const m = maps.find(x => x.band === b && x.effect === e); return m ? { gain: m.gain, att: m.att } : null }, { b, e });
      /* 1 · linjen står der fra start; knapperne, der ikke kan bruges, er grå */
      const b1 = await bar();
      T.tjek(b1.vis && /Ingen celler markeret/.test(b1.tekst) && b1.knapper.includes('Markér celler: Fra') && ['Markér alle', 'Kopiér', 'Indsæt', 'Indsæt indstillinger', 'Spejl', 'Slå fra / til', 'Slet', 'Ryd markering'].every(k => b1.knapper.includes(k)) && ['Kopiér', 'Indsæt', 'Indsæt indstillinger', 'Spejl', 'Slet', 'Ryd markering'].every(k => b1.graa.includes(k)) && !b1.graa.includes('Markér alle'), `${w} × ${h}: linjen under matrixen står der uden markering ("Ingen celler markeret") med alle knapperne; dem, der ikke kan bruges endnu, er grå`, JSON.stringify(b1));
      /* 2 · Ctrl + klik med en lille bevægelse inde i cellen markerer (fejlen i v9.59), tre celler i træk */
      const slip = async (b, e) => { const p = await pkt(b, e); await side.keyboard.down(MOD); await side.mouse.move(p.x - 7, p.y - 5); await side.mouse.down(); await side.mouse.move(p.x, p.y); await side.mouse.move(p.x + 9, p.y + 7); await side.mouse.up(); await side.keyboard.up(MOD); await side.waitForTimeout(300) };
      await slip('kick', E('a', 'dHop')); await slip('snare', E('a', 'dArmV')); await slip('hihat', E('a', 'dHoved')); const b2 = await bar(), toast2 = await side.evaluate(() => (document.getElementById('ne-toast') || {}).textContent || '');
      T.tjek(b2.mark === 3 && /3 celler markeret/.test(b2.tekst) && !/ikke lavet/.test(toast2) && b2.n === b1.n, `${w} × ${h}: tre Ctrl + klik, hvor musen flytter sig cirka 20 px inde i cellen, markerer alle tre celler (i v9.59 blev det til et træk, og cellen blev ikke markeret)`, JSON.stringify({ b2, toast2 }));
      await knap('Ryd markering'); const b2b = await bar();
      /* 3 · helt uden tastatur: Markér celler: Til, klik på to celler, Kopiér, Ryd, klik på målet, Indsæt */
      await knap('Markér celler'); await klik('kick', E('a', 'dHop')); const b3 = await bar(); await knap('Kopiér'); await knap('Ryd markering');
      await klik('kick', E('b', 'dHop')); const b3b = await bar(); await knap('Indsæt'); const r3 = await regel('kick', E('b', 'dHop')), b3c = await bar();
      T.tjek(b2b.mark === 0 && b3.knapper.includes('Markér celler: Til') && b3.mark === 1 && b3b.mark === 1 && b3b.n === b1.n && !!r3 && r3.gain === 0.7 && r3.att === 15 && b3c.n === b1.n + 1, `${w} × ${h}: uden tastatur: Markér celler: Til → klik på kick → Hop (markeret) → Kopiér → Ryd markering → klik på den tomme celle hos Pige B (markeret, ingen ny regel) → Indsæt: Pige B har fået reglen (×0,70, attack 15)`, JSON.stringify({ b2b: b2b.mark, b3: b3.mark, b3b, r3, n: b3c.n }));
      /* 4 · Indsæt indstillinger med knappen; Markér alle; Markér celler: Fra igen (et klik vælger reglen) */
      await knap('Ryd markering'); await klik('snare', E('a', 'dArmV')); await klik('hihat', E('a', 'dHoved')); await knap('Indsæt indstillinger'); const r4 = [await regel('snare', E('a', 'dArmV')), await regel('hihat', E('a', 'dHoved'))];
      await knap('Markér alle'); const b4 = await bar(), alle = await side.evaluate(() => MX.celler.filter(c => { const id = mxCelleId(c.td); return id && !id.fold }).length); await knap('Ryd markering'); await knap('Markér celler'); await klik('snare', E('a', 'dHop')); const b4b = await bar(), valgt = await side.evaluate(() => NE2.valgt);
      T.tjek(r4.every(x => x && x.gain === 0.7 && x.att === 15) && b4.mark === alle && alle >= 5 && b4b.mark === 0 && b4b.knapper.includes('Markér celler: Fra') && /^r:snare\|/.test(valgt || ''), `${w} × ${h}: Indsæt indstillinger giver de to markerede regler ×0,70 og attack 15; Markér alle markerer alle ${alle} celler med regler (ikke dem i en figur, der er foldet sammen); med Markér celler: Fra vælger et klik reglen igen`, JSON.stringify({ r4, mark: b4.mark, alle, b4b: b4b.mark, valgt }));
      /* 5 · Største · Læg sammen · Gang i linjen for den valgte regels mål */
      const b5 = await bar(); await knap('Læg sammen'); const k5 = await side.evaluate(e => ({ k: neKombFor(e), kant: (document.querySelector('#ne-mx [data-mxko="' + e + '"]') || {}).dataset.t, paa: (document.querySelector('#mx-bj [data-mxbk].ne-paa') || {}).textContent }), E('a', 'dHop'));
      await knap('Største'); const k5b = await side.evaluate(e => neKombFor(e), E('a', 'dHop'));
      T.tjek(/Flere regler på/.test(b5.tekst) && ['Største', 'Læg sammen', 'Gang'].every(k => b5.knapper.includes(k)) && k5.k === 'sum' && k5.kant === 'Sum' && k5.paa === 'Læg sammen' && k5b === 'max', `${w} × ${h}: for den valgte regel står "Flere regler på Hop …: Største · Læg sammen · Gang" i linjen; et klik på Læg sammen skifter (mærket i kolonnen viser Sum), og Største skifter tilbage`, JSON.stringify({ t: b5.tekst.slice(-80), k5, k5b }));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
