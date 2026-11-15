/* Trin 4 · Det nye i v9.54: en ny regel til en figurs egenskab giver egenskaben et udsving, så figuren bevæger sig med det samme.
   Fejlen (brugerens video 15. november): en regel lavet med et klik i matrixen (eller et link i Noder) til danserens "Arm til højre i billedet"
   gjorde ingenting, fordi egenskabens Fra og Til var ens. Testen gør det samme som i videoen med rigtige museklik: en danser, matrixen på Alle,
   et klik i cellen, og generatoren spiller; så skal egenskaben have et udsving, og dens tal skal bevæge sig.
   En regel uden udsving (lavet i en ældre version) har et gult ! i cellen; et klik på det giver udsvinget. Et udsving, der findes, røres ikke. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Udsving');
  console.log('49 · En ny regel bevæger figuren med det samme · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const d = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(800); const o = nyFigurHer('Danser', .5, .55, 'danser'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
        const e = o.lag[0].egenskaber; return { id: o.id, armH: [e.dArmH.fra, e.dArmH.til], hoved: [e.dHoved.fra, e.dHoved.til] } });
      T.tjek(d.armH[0] === d.armH[1], `${w} × ${h}: en ny danser har ingen udsving på Arm til højre i billedet (Fra ${d.armH[0]} = Til ${d.armH[1]}), som i videoen`);
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(900);
      /* + mål: Arm til højre i billedet, og klik i cellen ud for kick */
      await side.click('#ne-mx [data-mxp="e"]'); await side.waitForTimeout(300); await side.keyboard.type('arm til h'); await side.waitForTimeout(300); await side.keyboard.press('Enter'); await side.waitForTimeout(700);
      const tid = 'obj:' + d.id + ':0:dArmH';
      const klikCelle = async (b, e) => { const p = await side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); if (!td) return null; td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, { b, e }); if (p) await side.mouse.click(p.x, p.y); await side.waitForTimeout(1000); return !!p };
      const k1 = await klikCelle('kick', tid);
      const a = await side.evaluate(tid => { const q = neEgAf(tid), m = maps.find(x => x.effect === tid), td = mxFindCelle({ b: 'kick', e: tid }); return { regel: !!m, fra: q.e.fra, til: q.e.til, advarsel: !!(td && td.querySelector('.mx-adv')), toast: (document.getElementById('ne-toast') || {}).textContent || '', kp: document.getElementById('ne-kp').textContent } }, tid);
      T.tjek(k1 && a.regel && a.fra === 0 && a.til === 1 && !a.advarsel && /udsving 0–1/.test(a.toast), `${w} × ${h}: et museklik i cellen kick → Arm til højre i billedet laver reglen og giver egenskaben udsvinget ${a.fra}–${a.til} (danserens standard); beskeden viser det, og cellen har intet !`, JSON.stringify({ k1, a: { ...a, kp: undefined } }));
      /* armen bevæger sig, når generatoren spiller: reglens udgang skal skifte */
      const lev = await side.evaluate(async tid => { const vent = ms => new Promise(r => setTimeout(r, ms)), i = maps.findIndex(x => x.effect === tid); document.getElementById('gp').click(); let mx = 0, mn = 9; for (let j = 0; j < 90; j++) { await vent(70); const u = +R2M.ud[i] || 0; mx = Math.max(mx, u); mn = Math.min(mn, u) } if (gPlaying) document.getElementById('gp').click(); return { mx, mn } }, tid);
      T.tjek(lev.mx > .3 && lev.mx - lev.mn > .25, `${w} × ${h}: mens generatoren spiller, går reglens udgang fra ${lev.mn.toFixed(2)} til ${lev.mx.toFixed(2)}, så armen bevæger sig mellem Fra og Til`, JSON.stringify(lev));
      if (w === 1920) {
        /* en regel uden udsving (som dem fra v9.52 og v9.53): gult !, og et klik giver udsvinget */
        const tidH = 'obj:' + d.id + ':0:dHoved';
        await side.evaluate(async tidH => { Regler.tilfoej(mk('snare', tidH, .3, 1, 20, 200)); await new Promise(r => setTimeout(r, 1500)) }, tidH);
        const b0 = await side.evaluate(tidH => { const td = mxFindCelle({ b: 'snare', e: tidH }); if (td) td.scrollIntoView({ block: 'center', inline: 'center' }); const q = neEgAf(tidH); return { adv: !!(td && td.querySelector('.mx-adv')), graa: !!(td && td.classList.contains('mx-intet')), fra: q.e.fra, til: q.e.til } }, tidH);
        const knap = await side.evaluate(tidH => { const td = mxFindCelle({ b: 'snare', e: tidH }), x = td && td.querySelector('.mx-adv'); if (!x) return null; const r = x.getBoundingClientRect(), el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return { x: r.x + r.width / 2, y: r.y + r.height / 2, fri: el === x } }, tidH);
        if (knap && knap.fri) await side.mouse.click(knap.x, knap.y); await side.waitForTimeout(1000);
        const b1 = await side.evaluate(tidH => { const td = mxFindCelle({ b: 'snare', e: tidH }), q = neEgAf(tidH); return { adv: !!(td && td.querySelector('.mx-adv')), fra: q.e.fra, til: q.e.til, toast: (document.getElementById('ne-toast') || {}).textContent || '', n: maps.filter(x => x.effect === tidH).length } }, tidH);
        T.tjek(b0.adv && b0.graa && b0.fra === b0.til && knap && knap.fri && !b1.adv && b1.fra === 0 && b1.til === .8 && b1.n === 1 && /Udsving sat/.test(b1.toast), `en regel uden udsving (Hoved, Fra ${b0.fra} = Til ${b0.til}) har et gult ! i cellen; et museklik på ! giver udsvinget ${b1.fra}–${b1.til} og fjerner mærket`, JSON.stringify({ b0, knap, b1 }));
        /* et udsving, der findes, røres ikke; en almindelig egenskab får også et udsving; det samme gælder et link lavet i Noder */
        const c = await side.evaluate(async id => { const vent = ms => new Promise(r => setTimeout(r, ms)), o = fase2.objekter.find(x => x.id === id), e = o.lag[0].egenskaber, ud = {};
          e.dKnae.fra = .2; e.dKnae.til = .5; ne5Ny('hihat', 'obj:' + id + ':0:dKnae'); await vent(600); ud.roerIkke = e.dKnae.fra === .2 && e.dKnae.til === .5 ? 'ok' : e.dKnae.fra + '–' + e.dKnae.til;
          const p = Object.keys(e).find(k => !DANS_STD[k] && !SWING[k] && PROPS[k] && e[k].fra === e[k].til && PROPS[k][1] !== PROPS[k][2]); if (p) { ne5Ny('hihat', 'obj:' + id + ':0:' + p); await vent(600); ud['andenEgenskab (' + p + ')'] = e[p].fra !== e[p].til ? 'ok' : 'intet udsving' } else ud.andenEgenskab = 'ok';
          const f1 = fase2.objekter[0], e1 = f1.lag[0].egenskaber, s = Object.keys(e1).find(k => SWING[k] && e1[k].fra === e1[k].til && !maps.some(m => m.effect === tidOf(f1, 0, k))); if (s) { ne5Ny('hihat', tidOf(f1, 0, s)); await vent(600); ud['somKobl (' + s + ')'] = e1[s].fra !== e1[s].til ? 'ok' : 'intet udsving' } else ud.somKobl = 'ok';
          const n0 = maps.length; ne5Ny('hihat', 'strobe'); await vent(400); ud.effekt = maps.length === n0 + 1 ? 'ok' : 'ingen regel'; return ud }, d.id);
        const dårlig = Object.entries(c).filter(([k, v]) => v !== 'ok');
        T.tjek(!dårlig.length, `et udsving, der findes, røres ikke; en egenskab uden standard får et udsving; en almindelig egenskab får det samme som Kobl i Editoren; en regel til en effekt virker som før (${Object.keys(c).join('; ')})`, dårlig.map(([k, v]) => k + ' → ' + v).join(' | '));
        /* Ctrl+Z fortryder reglen og udsvinget */
        const u = await side.evaluate(async id => { const vent = ms => new Promise(r => setTimeout(r, ms)), o = () => fase2.objekter.find(x => x.id === id); await vent(1900); const t = 'obj:' + id + ':0:dHofte', f0 = o().lag[0].egenskaber.dHofte.fra, t0 = o().lag[0].egenskaber.dHofte.til, n0 = maps.length; ne5Ny('bas', t); await vent(1900); const midt = [o().lag[0].egenskaber.dHofte.fra, o().lag[0].egenskaber.dHofte.til]; feFortryd(); await vent(500); const e = o().lag[0].egenskaber.dHofte; return { f0, t0, midt, efter: [e.fra, e.til], n: maps.length - n0 } }, d.id);
        T.tjek(u.f0 === u.t0 && u.midt[0] !== u.midt[1] && u.efter[0] === u.f0 && u.efter[1] === u.t0 && u.n === 0, `Ctrl+Z fortryder både den nye regel og udsvinget (Hofte: ${u.f0}–${u.t0} → ${u.midt.join('–')} → ${u.efter.join('–')})`, JSON.stringify(u));
      }
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
