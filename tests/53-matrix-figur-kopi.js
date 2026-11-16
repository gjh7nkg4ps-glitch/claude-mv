/* Trin 4 · Det nye i v9.58: matrixen, fase 3 trin 3c: kopiér en hel figurs regler til en anden figur med én knap, og spejl venstre og højre.
   - Knappen ⋯ ved figurens navn åbner en liste; "Kopiér reglerne til" giver den anden figur de samme regler på de samme egenskaber (ét Fortryd).
   - En regel, der står hos den anden figur, får indstillingerne; dens øvrige regler slettes ikke.
   - Spejl venstre og højre: reglerne på Arm til venstre og Arm til højre bytter plads (figurens liste og knappen Spejl i linjen for markerede).
   Rigtige museklik og tastetryk ved 1920 × 1080 og 2560 × 1440. Opgaven fra pakken: giv den ene pige de samme regler som den anden. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (figur-kopi og spejl)');
  console.log('53 · Matrixen: kopiér en hel figurs regler, og spejl venstre og højre · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const id = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(800); const a = nyFigurHer('Pige A', .3, .6, 'danser'), b = nyFigurHer('Pige B', .6, .6, 'danser'), c = nyFigurHer('Kugle', .85, .3, 'disko'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
        ne5Ny('kick', 'obj:' + a.id + ':0:dHop'); Regler.retNr(maps.length - 1, { gain: 0.8, thr: 0.35, att: 12 }); ne5Ny('snare', 'obj:' + a.id + ':0:dArmV'); Regler.retNr(maps.length - 1, { gain: 1.4, rel: 250 }); ne5Ny('hihat', 'obj:' + a.id + ':0:dHoved'); ne5Ny('vocal', 'obj:' + a.id + ':0:dArmH'); Regler.retNr(maps.length - 1, { gain: 0.5 });
        ne5Ny('bass', 'obj:' + b.id + ':0:dHofte'); ne5Ny('kick', 'obj:' + b.id + ':0:dHop'); mxInd().mxFold['g:Bane'] = true; await vent(1500); window.__H = []; Regler.lyt(x => window.__H.push(x.hvad)); return { a: a.id, b: b.id, c: c ? c.id : null, vocal: maps.some(m => m.band === 'vocal') } });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const E = (f, p) => 'obj:' + id[f] + ':0:' + p;
      const H = () => side.evaluate(() => { const h = window.__H.join(); window.__H.length = 0; return h });
      const regel = (b, e) => side.evaluate(({ b, e }) => { const m = maps.find(x => x.band === b && x.effect === e); return m ? { gain: m.gain, thr: m.thr, att: m.att, rel: m.rel } : null }, { b, e });
      const figRegler = f => side.evaluate(k => maps.filter(m => neFigurAf(m.effect).key === k).map(m => m.band + '>' + m.effect.split(':')[3] + '×' + m.gain).sort().join(' '), 'f:' + id[f]);
      const antal = () => side.evaluate(() => maps.length);
      const toast = () => side.evaluate(() => ((document.getElementById('ne-toast') || {}).textContent || '').replace(/Fortryd$/, ''));
      const menuKnap = async f => { const p = await side.evaluate(k => { const b = [...document.querySelectorAll('#ne-mx [data-mxfm]')].find(x => x.dataset.mxfm === k); if (!b) return null; b.scrollIntoView({ block: 'nearest', inline: 'center' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height } }, 'f:' + id[f]); if (!p) return null; await side.mouse.click(p.x, p.y); await side.waitForTimeout(400); return p };
      const menu = () => side.evaluate(() => { const d = document.getElementById('mx-vaelg'); if (!d) return null; const r = d.getBoundingClientRect(), bg = getComputedStyle(d).backgroundImage; return { tekst: d.textContent, knapper: [...d.querySelectorAll('button')].map(b => b.textContent + (b.disabled ? ' (grå)' : '')), inde: r.left >= 0 && r.top >= 0 && r.right <= innerWidth && r.bottom <= innerHeight, bg: bg !== 'none' } });
      const menuKlik = async tekst => { const p = await side.evaluate(t => { const b = [...document.querySelectorAll('#mx-vaelg button')].find(x => x.textContent === t); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, tekst); if (!p) return false; await side.mouse.click(p.x, p.y); await side.waitForTimeout(1200); return true };
      /* 1 · knappen ⋯ står ved figurernes navne (ikke ved effekt-grupperne), og listen åbner */
      const kn = await side.evaluate(() => ({ fig: document.querySelectorAll('#ne-mx th.mx-fig:not(.mx-grp):not(.mx-foldet) [data-mxfm]').length, grp: document.querySelectorAll('#ne-mx th.mx-grp [data-mxfm]').length, figs: document.querySelectorAll('#ne-mx th.mx-fig:not(.mx-grp):not(.mx-foldet)').length, navn: [...document.querySelectorAll('#ne-mx th.mx-fig:not(.mx-grp):not(.mx-foldet)')].map(x => x.textContent) }));
      const p1 = await menuKnap('a'), m1 = await menu();
      T.tjek(kn.fig === kn.figs && kn.fig >= 2 && kn.grp === 0 && kn.navn.every(n => /^▾ /.test(n)) && !!p1 && !!m1 && m1.inde && m1.bg && /Pige A · 4 regler/.test(m1.tekst) && m1.knapper.includes('Pige B') && m1.knapper.includes('Spejl venstre og højre') && !m1.knapper.includes('Pige A'), `${w} × ${h}: knappen ⋯ står ved hver figurs navn (${kn.fig}) og ikke ved effekt-grupperne; et klik åbner listen "Pige A · 4 regler" med Kopiér reglerne til (Pige B …) og Spejl venstre og højre; listen ligger inden for skærmen`, JSON.stringify({ kn, p1, m1 }));
      /* 2 · Kopiér reglerne til Pige B: de samme regler på de samme egenskaber; hendes egne bliver; ét skridt */
      await side.waitForTimeout(1500); await H(); const n0 = await antal(), a0 = await figRegler('a');
      await menuKlik('Pige B'); const n1 = await antal(), h1 = await H(), t1 = await toast();
      const b1 = { hop: await regel('kick', E('b', 'dHop')), armV: await regel('snare', E('b', 'dArmV')), hoved: await regel('hihat', E('b', 'dHoved')), armH: await regel('vocal', E('b', 'dArmH')), hofte: await regel('bass', E('b', 'dHofte')) };
      const eft1 = await side.evaluate(({ v, hh }) => ({ uds: [v, hh].every(e => { const q = neEgAf(e); return q.e.fra !== q.e.til }), mark: MX.mark.size, ens: new Set(maps.map(m => m.id)).size === maps.length, menu: !!document.getElementById('mx-vaelg') }), { v: E('b', 'dArmV'), hh: E('b', 'dHoved') });
      T.tjek(n1 === n0 + 3 && b1.hop && b1.hop.gain === 0.8 && b1.hop.thr === 0.35 && b1.hop.att === 12 && b1.armV && b1.armV.gain === 1.4 && b1.armV.rel === 250 && !!b1.hoved && b1.armH && b1.armH.gain === 0.5 && !!b1.hofte && /samlet/.test(h1) && eft1.uds && eft1.mark === 4 && eft1.ens && !eft1.menu && /Pige B har fået 4 regler fra Pige A \(3 nye, 1 rettet\)/.test(t1) && (await figRegler('a')) === a0, `${w} × ${h}: Kopiér reglerne til Pige B giver hende Pige A's 4 regler på de samme egenskaber med de samme indstillinger (3 nye; kick → Hop stod der og har fået ×0,80, tærskel 0,35, attack 12); hendes egen regel (bas → Hofte) er der stadig; egenskaberne har et udsving; Pige A er uændret; beskeden: "${t1}"`, JSON.stringify({ n: [n0, n1], b1, h1, eft1, t1 }));
      /* 3 · én Ctrl+Z fortryder hele kopien */
      await side.waitForTimeout(1800); await side.evaluate(() => (document.querySelector('#ne-mx td.mx-mark') || document.querySelector('#ne-mx td.mx-c')).focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(900);
      const n2 = await antal(), b2 = await regel('kick', E('b', 'dHop')), b2v = await regel('snare', E('b', 'dArmV'));
      T.tjek(n2 === n0 && !b2v && b2 && b2.gain === 1, `${w} × ${h}: én Ctrl+Z fortryder hele kopien (${n1} → ${n2} regler; kick → Hop hos Pige B er ×1,00 igen)`, JSON.stringify({ n2, b2, b2v }));
      /* 4 · en figur uden egenskaberne (diskokuglen): reglerne springes over med en besked */
      let t4 = '', n4 = n2; if (id.c) { await side.waitForTimeout(1500); await side.keyboard.press('Escape'); await menuKnap('a'); await menuKlik('Kugle'); t4 = await toast(); n4 = await antal(); }
      T.tjek(!id.c || (n4 === n2 && /Intet blev kopieret/.test(t4)), `${w} × ${h}: til en figur uden egenskaberne (diskokuglen) kopieres intet, og beskeden siger det ("${t4}")`, JSON.stringify({ c: id.c, n4, t4 }));
      /* 5 · Spejl venstre og højre i figurens liste; ét Fortryd */
      await side.waitForTimeout(1500); await side.keyboard.press('Escape'); await H(); await menuKnap('a'); await menuKlik('Spejl venstre og højre'); const h5 = await H(), t5 = await toast(), n5 = await antal();
      const s5 = { snH: await regel('snare', E('a', 'dArmH')), voV: await regel('vocal', E('a', 'dArmV')), snV: await regel('snare', E('a', 'dArmV')), voH: await regel('vocal', E('a', 'dArmH')), hop: await regel('kick', E('a', 'dHop')) };
      T.tjek(n5 === n0 && s5.snH && s5.snH.gain === 1.4 && s5.snH.rel === 250 && s5.voV && s5.voV.gain === 0.5 && !s5.snV && !s5.voH && s5.hop && s5.hop.gain === 0.8 && /samlet/.test(h5) && /^Spejlet: 2 regler/.test(t5), `${w} × ${h}: Spejl venstre og højre bytter Pige A's to arm-regler (snare → Arm til højre ×1,40, vokal → Arm til venstre ×0,50); de andre regler er uændrede; ingen ny regel; beskeden: "${t5}"`, JSON.stringify({ n5, s5, h5, t5 }));
      await side.waitForTimeout(1800); await side.evaluate(() => (document.querySelector('#ne-mx td.mx-mark') || document.querySelector('#ne-mx td.mx-c')).focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(900);
      const s6 = { snV: await regel('snare', E('a', 'dArmV')), voH: await regel('vocal', E('a', 'dArmH')) };
      T.tjek(s6.snV && s6.snV.gain === 1.4 && s6.voH && s6.voH.gain === 0.5 && (await figRegler('a')) === a0, `${w} × ${h}: én Ctrl+Z sætter armene tilbage`, JSON.stringify(s6));
      /* 6 · Spejl i linjen under matrixen gælder kun den markerede regel */
      await side.waitForTimeout(1500); await side.keyboard.press('Escape');
      const pc = await side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, { b: 'snare', e: E('a', 'dArmV') });
      await side.keyboard.down(MOD); await side.mouse.click(pc.x, pc.y); await side.keyboard.up(MOD); await side.waitForTimeout(400);
      const harKnap = await side.evaluate(() => !!document.querySelector('#mx-bj [data-mxb="spejl"]')); await side.click('#mx-bj [data-mxb="spejl"]'); await side.waitForTimeout(1200);
      const s7 = { snH: await regel('snare', E('a', 'dArmH')), voH: await regel('vocal', E('a', 'dArmH')), snV: await regel('snare', E('a', 'dArmV')) };
      T.tjek(harKnap && s7.snH && s7.snH.gain === 1.4 && s7.voH && s7.voH.gain === 0.5 && !s7.snV, `${w} × ${h}: knappen Spejl i linjen under matrixen flytter kun den markerede regel (snare → Arm til højre); vokal → Arm til højre står, hvor den stod`, JSON.stringify({ harKnap, s7 }));
      /* 7 · tastatur: Enter på ⋯ åbner listen, pil ned og Esc */
      await side.keyboard.press('Escape'); await side.evaluate(k => [...document.querySelectorAll('#ne-mx [data-mxfm]')].find(x => x.dataset.mxfm === k).focus(), 'f:' + id.a); await side.keyboard.press('Enter'); await side.waitForTimeout(400);
      const m7 = await menu(), n7 = await antal(); await side.keyboard.press('ArrowDown'); const fok = await side.evaluate(() => document.activeElement && document.activeElement.closest('#mx-vaelg') ? document.activeElement.textContent : ''); await side.keyboard.press('Escape'); await side.waitForTimeout(300);
      const m7b = await menu(), fold = await side.evaluate(k => !!mxInd().mxFold[k], 'f:' + id.a);
      T.tjek(!!m7 && !!fok && !m7b && !fold && (await antal()) === n7, `${w} × ${h}: Enter på ⋯ åbner listen (figuren foldes ikke sammen), pil ned flytter til "${fok}", og Esc lukker uden at ændre noget`, JSON.stringify({ m7: !!m7, fok, m7b, fold }));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
