/* Trin 4 · Det nye i v9.57: matrixen, fase 3 trin 3b: træk med Ctrl for at kopiere en celle, og indsæt kun indstillingerne.
   - Ctrl + træk fra en celle med en regel til en tom celle laver en ny regel dér med de samme indstillinger (ét Fortryd).
   - Ctrl + træk til en celle med en regel giver den indstillingerne uden en ny regel.
   - Et Ctrl + klik uden træk markerer stadig cellen.
   - Ctrl+Shift+V (og knappen Indsæt indstillinger) giver de markerede regler den kopierede regels indstillinger; lydtræk og mål ændres ikke.
   Rigtige museklik, træk og tastetryk ved 1920 × 1080 og 2560 × 1440. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (træk med Ctrl)');
  console.log('52 · Matrixen: træk med Ctrl for at kopiere, og indsæt kun indstillingerne · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const id = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(800); const a = nyFigurHer('Pige A', .35, .6, 'danser'), b = nyFigurHer('Pige B', .65, .6, 'danser'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
        ne5Ny('kick', 'obj:' + a.id + ':0:dArmV'); Regler.retNr(maps.length - 1, { gain: 0.7, thr: 0.4, att: 21, rel: 333 }); ne5Ny('snare', 'obj:' + a.id + ':0:dHop'); ne5Ny('hihat', 'obj:' + a.id + ':0:dHoved'); mxInd().mxE.e.push('obj:' + b.id + ':0:dArmV'); mxInd().mxFold['g:Bane'] = true; await vent(1500); window.__H = []; Regler.lyt(x => window.__H.push(x.hvad)); return { a: a.id, b: b.id } });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const E = (f, p) => 'obj:' + id[f] + ':0:' + p;
      const pkt = (b, e) => side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); if (!td) return null; td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, { b, e });
      const pktNu = (b, e) => side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); if (!td) return null; const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, { b, e });
      const klik = async (b, e, mod) => { const p = await pkt(b, e); if (!p) return false; if (mod) await side.keyboard.down(mod); await side.mouse.click(p.x, p.y); if (mod) await side.keyboard.up(mod); await side.waitForTimeout(350); return true };
      const H = () => side.evaluate(() => { const h = window.__H.join(); window.__H.length = 0; return h });
      const regel = (b, e) => side.evaluate(({ b, e }) => { const m = maps.find(x => x.band === b && x.effect === e); return m ? { gain: m.gain, thr: m.thr, att: m.att, rel: m.rel, band: m.band, effect: m.effect } : null }, { b, e });
      const antal = () => side.evaluate(() => maps.length);
      const toast = () => side.evaluate(() => ((document.getElementById('ne-toast') || {}).textContent || '').replace(/Fortryd$/, ''));
      /* træk med Ctrl nede: fra én celle til en anden, i små skridt; midtvejs læses kanten på målet */
      const ctrlTraek = async (fb, fe, tb, te) => { await pkt(tb, te); await pkt(fb, fe); const a = await pktNu(fb, fe), b = await pktNu(tb, te); if (!a || !b) return { fejl: 'celle mangler' };
        await side.keyboard.down(MOD); await side.mouse.move(a.x, a.y); await side.mouse.down(); for (let i = 1; i <= 10; i++) { await side.mouse.move(a.x + (b.x - a.x) * i / 10, a.y + (b.y - a.y) * i / 10); await side.waitForTimeout(25); }
        const kant = await side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); return { til: !!td && td.classList.contains('mx-kopi-til'), n: document.querySelectorAll('#ne-mx td.mx-kopi-til').length, fra: document.querySelectorAll('#ne-mx td.mx-kopi-fra').length } }, { b: tb, e: te });
        await side.mouse.up(); await side.keyboard.up(MOD); await side.waitForTimeout(1200); return kant };
      /* 1 · Ctrl + træk til en tom celle hos en anden figur: en ny regel med de samme indstillinger */
      await side.waitForTimeout(1700); await H(); const n0 = await antal();
      const k1 = await ctrlTraek('kick', E('a', 'dArmV'), 'kick', E('b', 'dArmV')); const r1 = await regel('kick', E('b', 'dArmV')), n1 = await antal(), h1 = await H(), t1 = await toast();
      const eft1 = await side.evaluate(e => { const q = neEgAf(e); return { uds: q.e.fra !== q.e.til, mark: MX.mark.size, rest: document.querySelectorAll('#ne-mx td.mx-kopi-til,#ne-mx td.mx-kopi-fra').length, valgt: NE2.valgt } }, E('b', 'dArmV'));
      T.tjek(k1.til && k1.n === 1 && k1.fra === 1 && n1 === n0 + 1 && !!r1 && r1.gain === 0.7 && r1.thr === 0.4 && r1.att === 21 && r1.rel === 333 && /samlet/.test(h1) && eft1.uds && eft1.mark === 0 && eft1.rest === 0 && /^Kopieret/.test(t1), `${w} × ${h}: Ctrl + træk fra kick → Arm til venstre (Pige A) til den tomme celle hos Pige B: cellen får en kant under trækket, og der laves én ny regel med de samme indstillinger (×0,70, tærskel 0,40, attack 21, release 333) og et udsving; beskeden: "${t1}"`, JSON.stringify({ k1, n: [n0, n1], r1, h1, eft1 }));
      /* 2 · én Ctrl+Z fortryder kopien */
      await side.waitForTimeout(1800); await side.evaluate(() => (document.querySelector('#ne-mx td.mx-c')).focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(900);
      const n2 = await antal(), r2 = await regel('kick', E('b', 'dArmV'));
      T.tjek(n2 === n0 && !r2, `${w} × ${h}: én Ctrl+Z fortryder kopien (${n1} → ${n2} regler)`, JSON.stringify({ n2, r2 }));
      /* 3 · Ctrl + træk til en celle med en regel: den får indstillingerne, og der laves ingen ny regel */
      await side.waitForTimeout(1500); const k3 = await ctrlTraek('kick', E('a', 'dArmV'), 'snare', E('a', 'dHop')); const r3 = await regel('snare', E('a', 'dHop')), n3 = await antal(), t3 = await toast();
      T.tjek(k3.til && n3 === n0 && !!r3 && r3.gain === 0.7 && r3.thr === 0.4 && r3.att === 21 && r3.band === 'snare' && /har fået indstillingerne/.test(t3), `${w} × ${h}: Ctrl + træk til en celle, der har en regel (snare → Hop): den får indstillingerne (×0,70, tærskel 0,40, attack 21), og der laves ingen ny regel (${n3})`, JSON.stringify({ k3, n3, r3, t3 }));
      /* 4 · Ctrl + klik uden træk markerer stadig; slip uden for en celle laver ingenting */
      await side.keyboard.press('Escape'); await klik('hihat', E('a', 'dHoved'), MOD); const m4 = await side.evaluate(() => MX.mark.size), n4 = await antal();
      await side.keyboard.press('Escape'); const a4 = await pkt('kick', E('a', 'dArmV')); await side.keyboard.down(MOD); await side.mouse.move(a4.x, a4.y); await side.mouse.down(); for (let i = 1; i <= 6; i++) { await side.mouse.move(a4.x, a4.y - i * 60); await side.waitForTimeout(25); } const ude = await side.evaluate(({ x, y }) => { const el = document.elementFromPoint(x, y); return !(el && el.closest && el.closest('#ne-mx td.mx-c')) }, { x: a4.x, y: a4.y - 360 }); await side.mouse.up(); await side.keyboard.up(MOD); await side.waitForTimeout(700);
      const n4b = await antal(), t4 = await toast(), m4b = await side.evaluate(() => MX.mark.size);
      T.tjek(m4 === 1 && n4 === n0 && (!ude || (n4b === n0 && /ikke lavet/.test(t4) && m4b === 0)), `${w} × ${h}: et Ctrl + klik uden træk markerer stadig cellen (1 markeret); slippes trækket uden for cellerne, laves ingen regel, og beskeden siger det ("${t4}")`, JSON.stringify({ m4, n4, ude, n4b, t4, m4b }));
      /* 5 · Ctrl+C på én regel, markér to andre, Ctrl+Shift+V: kun indstillingerne; ét Fortryd */
      await side.evaluate(e => { const i = maps.findIndex(m => m.band === 'kick' && m.effect === e); Regler.retNr(i, { gain: 1.3, thr: 0.55, att: 9, rel: 111, curve: 2 }) }, E('a', 'dArmV')); await side.waitForTimeout(1500);
      await side.keyboard.press('Escape'); await klik('kick', E('a', 'dArmV'), MOD); await side.keyboard.press(MOD + '+c'); await side.keyboard.press('Escape'); await side.waitForTimeout(200);
      await klik('snare', E('a', 'dHop'), MOD); await klik('hihat', E('a', 'dHoved'), MOD); const knap = await side.evaluate(() => !!document.querySelector('#mx-bj [data-mxb="indst"]'));
      await side.waitForTimeout(1700); await H(); const foer = [await regel('snare', E('a', 'dHop')), await regel('hihat', E('a', 'dHoved'))];
      await side.keyboard.press(MOD + '+Shift+V'); await side.waitForTimeout(1200);
      const s5 = [await regel('snare', E('a', 'dHop')), await regel('hihat', E('a', 'dHoved'))], n5 = await antal(), h5 = await H(), t5 = await toast(), kurve = await side.evaluate(e => maps.find(m => m.band === 'hihat' && m.effect === e).curve, E('a', 'dHoved'));
      T.tjek(knap && n5 === n0 && s5.every(x => x && x.gain === 1.3 && x.thr === 0.55 && x.att === 9 && x.rel === 111) && s5[0].band === 'snare' && s5[1].band === 'hihat' && s5[0].effect === E('a', 'dHop') && s5[1].effect === E('a', 'dHoved') && kurve === 2 && /samlet/.test(h5) && /Indstillinger indsat i 2 regler/.test(t5), `${w} × ${h}: Ctrl+Shift+V giver de to markerede regler den kopierede regels indstillinger (×1,30, tærskel 0,55, attack 9, release 111, kurve 2); lydtræk og mål er de samme (snare → Hop, hihat → Hoved), og der er ingen ny regel; knappen Indsæt indstillinger står i linjen`, JSON.stringify({ knap, n5, s5, kurve, h5, t5 }));
      await side.waitForTimeout(1800); await side.evaluate(() => (document.querySelector('#ne-mx td.mx-mark') || document.querySelector('#ne-mx td.mx-c')).focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(900);
      const s6 = [await regel('snare', E('a', 'dHop')), await regel('hihat', E('a', 'dHoved'))];
      T.tjek(s6[0].gain === foer[0].gain && s6[1].gain === foer[1].gain && s6[1].thr === foer[1].thr, `${w} × ${h}: én Ctrl+Z sætter begge regler tilbage (×${String(foer[0].gain).replace('.', ',')} og ×${String(foer[1].gain).replace('.', ',')})`, JSON.stringify({ foer, s6 }));
      /* 6 · knappen Indsæt indstillinger gør det samme med et rigtigt museklik */
      await side.waitForTimeout(1500); await side.keyboard.press('Escape'); await klik('hihat', E('a', 'dHoved'), MOD); await side.click('#mx-bj [data-mxb="indst"]'); await side.waitForTimeout(1000);
      const s7 = await regel('hihat', E('a', 'dHoved'));
      T.tjek(!!s7 && s7.gain === 1.3 && s7.rel === 111 && s7.band === 'hihat', `${w} × ${h}: knappen Indsæt indstillinger (rigtigt museklik) giver den markerede regel indstillingerne (×1,30, release 111)`, JSON.stringify(s7));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
