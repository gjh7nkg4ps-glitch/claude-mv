/* Trin 4 · Det nye i v9.56: matrixen, fase 3 trin 3a (hurtigt arbejde): markér flere celler, samme værdi på alle, kopiér og indsæt.
   - Ctrl + klik markerer celler, Shift + klik en firkant, Esc fjerner markeringen. Linjen under matrixen viser antallet.
   - Skyderne i linjen sætter samme styrke og tærskel på alle markerede regler; træk, Delete og M gælder dem alle. Ét Fortryd for hver handling.
   - Ctrl+C og Ctrl+V: hos en anden figur lander reglerne på de samme egenskaber; hos samme figur med samme afstand; en regel, der findes, får indstillingerne.
   Rigtige museklik, træk og tastetryk ved 1920 × 1080 og 2560 × 1440. Opgaven fra planen: giv den ene danser de samme regler som den anden. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (kopiér)');
  console.log('51 · Matrixen: markér flere celler, kopiér og indsæt · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const id = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(800); const a = nyFigurHer('Pige A', .35, .6, 'danser'), b = nyFigurHer('Pige B', .65, .6, 'danser'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
        ne5Ny('kick', 'obj:' + a.id + ':0:dArmV'); ne5Ny('snare', 'obj:' + a.id + ':0:dHop'); Regler.retNr(maps.length - 1, { gain: 0.6, thr: 0.45, att: 33 }); mxInd().mxE.e.push('obj:' + b.id + ':0:dArmV'); mxInd().mxFold['g:Bane'] = true; await vent(1500); window.__H = []; Regler.lyt(x => window.__H.push(x.hvad)); return { a: a.id, b: b.id } });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const E = (f, p) => 'obj:' + id[f] + ':0:' + p;
      const pkt = (b, e) => side.evaluate(({ b, e }) => { const td = mxFindCelle({ b, e }); if (!td) return null; td.scrollIntoView({ block: 'center', inline: 'center' }); const r = td.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, { b, e });
      const klik = async (b, e, mod) => { const p = await pkt(b, e); if (!p) return false; if (mod) await side.keyboard.down(mod); await side.mouse.click(p.x, p.y); if (mod) await side.keyboard.up(mod); await side.waitForTimeout(350); return true };
      const H = () => side.evaluate(() => { const h = window.__H.join(); window.__H.length = 0; return h });
      const regel = (b, e) => side.evaluate(({ b, e }) => { const m = maps.find(x => x.band === b && x.effect === e); return m ? { gain: m.gain, thr: m.thr, att: m.att, off: !!m.off } : null }, { b, e });
      const tilstand = () => side.evaluate(() => { const bj = document.getElementById('mx-bj'); return { n: maps.length, mark: MX.mark.size, streg: document.querySelectorAll('#ne-mx td.mx-mark').length, bj: bj && !bj.hidden ? bj.textContent : null, klip: MX.klip ? MX.klip.length : 0, ens: new Set(maps.map(m => m.id)).size === maps.length } });
      /* 1 · Ctrl + klik markerer to celler; linjen under matrixen viser dem */
      await klik('kick', E('a', 'dArmV'), MOD); await klik('snare', E('a', 'dHop'), MOD); const t1 = await tilstand();
      T.tjek(t1.mark === 2 && t1.streg === 2 && /2 celler markeret/.test(t1.bj || '') && /2 regler/.test(t1.bj || ''), `${w} × ${h}: Ctrl + klik markerer to celler (stiplet kant), og linjen under matrixen viser "2 celler markeret · 2 regler"`, JSON.stringify(t1));
      /* 2 · samme styrke på alle med skyderen; ét Fortryd */
      await side.waitForTimeout(1700); await H();
      await side.evaluate(() => { const s = document.querySelector('#mx-bj [data-mxb="gain"]'); s.value = 1.5; s.dispatchEvent(new Event('input', { bubbles: true })) }); await side.waitForTimeout(700);
      const g1 = [await regel('kick', E('a', 'dArmV')), await regel('snare', E('a', 'dHop'))], h2 = await H();
      await side.waitForTimeout(1700); await side.evaluate(() => document.querySelector('#ne-mx td.mx-mark').focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(800);
      const g2 = [await regel('kick', E('a', 'dArmV')), await regel('snare', E('a', 'dHop'))];
      T.tjek(g1[0].gain === 1.5 && g1[1].gain === 1.5 && /samlet/.test(h2) && !/andet/.test(h2) && g2[0].gain === 1 && g2[1].gain === 0.6, `${w} × ${h}: skyderen Styrke i linjen sætter begge regler til ×1,50, og én Ctrl+Z sætter dem tilbage (×1,00 og ×0,60)`, JSON.stringify({ g1, h2, g2 }));
      /* 3 · Ctrl+C, og Ctrl+V hos en anden figur: de samme egenskaber */
      await side.keyboard.press(MOD + '+c'); await side.waitForTimeout(300); const t3 = await tilstand();
      await side.keyboard.press('Escape'); await side.waitForTimeout(200); await klik('kick', E('b', 'dArmV'), MOD); await H(); const n3 = (await tilstand()).n;
      await side.waitForTimeout(1700); await side.keyboard.press(MOD + '+v'); await side.waitForTimeout(1200);
      const b1 = await regel('kick', E('b', 'dArmV')), b2 = await regel('snare', E('b', 'dHop')), t4 = await tilstand(), h4 = await H(), uds = await side.evaluate(e => { const q = neEgAf(e); return q.e.fra !== q.e.til }, E('b', 'dHop')), toast = await side.evaluate(() => (document.getElementById('ne-toast') || {}).textContent || '');
      T.tjek(t3.klip === 2 && t4.n === n3 + 2 && !!b1 && !!b2 && b1.gain === 1 && b2.gain === 0.6 && b2.thr === 0.45 && b2.att === 33 && uds && /samlet/.test(h4) && t4.mark === 2 && t4.ens && /2 regler indsat/.test(toast), `${w} × ${h}: Ctrl+C og Ctrl+V hos Pige B giver hende de samme to regler på de samme egenskaber (Arm til venstre og Hop) med de samme indstillinger (×0,60, tærskel 0,45, attack 33) og et udsving; beskeden: "${toast.replace(/Fortryd$/, '')}"`, JSON.stringify({ t3, n: [n3, t4.n], b1, b2, uds, h4 }));
      /* 4 · én Ctrl+Z fortryder hele indsættelsen */
      await side.waitForTimeout(1800); await side.evaluate(() => { const td = document.querySelector('#ne-mx td.mx-mark') || document.querySelector('#ne-mx td.mx-c'); td.focus() }); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(900);
      const t5 = await tilstand(), b3 = await regel('snare', E('b', 'dHop'));
      T.tjek(t5.n === n3 && !b3, `${w} × ${h}: én Ctrl+Z fortryder hele indsættelsen (${t4.n} → ${t5.n} regler)`, JSON.stringify({ t5, b3 }));
      /* 5 · samme figur, anden række: indsæt med samme afstand; og oven på en regel, der findes: den får indstillingerne */
      await side.keyboard.press('Escape'); await klik('snare', E('a', 'dHop'), MOD); await side.keyboard.press(MOD + '+c'); await side.keyboard.press('Escape'); await side.waitForTimeout(200);
      await klik('hihat', E('a', 'dHop'), MOD); await side.keyboard.press(MOD + '+v'); await side.waitForTimeout(1200); const c1 = await regel('hihat', E('a', 'dHop')), n5 = (await tilstand()).n;
      await side.evaluate(e => { const i = maps.findIndex(m => m.band === 'snare' && m.effect === e); Regler.retNr(i, { gain: 1.25, rel: 444 }) }, E('a', 'dHop')); await side.waitForTimeout(1400);
      await side.keyboard.press('Escape'); await klik('snare', E('a', 'dHop'), MOD); await side.keyboard.press(MOD + '+c'); await side.keyboard.press('Escape'); await klik('hihat', E('a', 'dHop'), MOD); await side.keyboard.press(MOD + '+v'); await side.waitForTimeout(1200);
      const c2 = await side.evaluate(e => { const m = maps.find(x => x.band === 'hihat' && x.effect === e); return m ? { gain: m.gain, rel: m.rel } : null }, E('a', 'dHop')), n6 = (await tilstand()).n;
      T.tjek(!!c1 && c1.gain === 0.6 && n6 === n5 && !!c2 && c2.gain === 1.25 && c2.rel === 444, `${w} × ${h}: hos samme figur i en anden række laves reglen dér (hihat → Hop, ×0,60); indsættes der oven på en regel, der findes, får den indstillingerne (×1,25, release 444) uden en ny regel`, JSON.stringify({ c1, n5, n6, c2 }));
      /* 6 · Shift + klik markerer en firkant; M og Delete gælder alle markerede; ét Fortryd */
      await side.keyboard.press('Escape'); await klik('snare', E('a', 'dHop'), MOD); await klik('hihat', E('a', 'dHop'), 'Shift'); const t7 = await tilstand();
      await side.keyboard.press('m'); await side.waitForTimeout(900); const m1 = [await regel('snare', E('a', 'dHop')), await regel('hihat', E('a', 'dHop'))];
      await side.evaluate(() => document.querySelector('#ne-mx td.mx-mark').focus()); await side.keyboard.press('m'); await side.waitForTimeout(900); const m2 = [await regel('snare', E('a', 'dHop')), await regel('hihat', E('a', 'dHop'))];
      T.tjek(t7.mark >= 2 && /regler/.test(t7.bj || '') && m1.every(x => x && x.off) && m2.every(x => x && !x.off), `${w} × ${h}: Shift + klik markerer firkanten mellem to celler (${t7.mark} celler); M slår alle de markerede regler fra og til igen`, JSON.stringify({ t7, m1, m2 }));
      /* træk i en markeret celle: begge reglers styrke flytter sig lige meget */
      await side.waitForTimeout(1700); const p = await pkt('snare', E('a', 'dHop')); await side.mouse.move(p.x, p.y); await side.mouse.down(); for (let i = 1; i <= 8; i++) { await side.mouse.move(p.x, p.y - i * 3); await side.waitForTimeout(25); } await side.mouse.up(); await side.waitForTimeout(900);
      const d1 = [await regel('snare', E('a', 'dHop')), await regel('hihat', E('a', 'dHop'))];
      T.tjek(Math.abs(d1[0].gain - 1.75) < .001 && Math.abs(d1[1].gain - 1.75) < .001, `${w} × ${h}: et træk 24 px op i en markeret celle flytter styrken lige meget på begge regler (×1,25 → ×${String(d1[0].gain).replace('.', ',')} begge steder)`, JSON.stringify(d1));
      await side.waitForTimeout(1800); await side.evaluate(() => document.querySelector('#ne-mx td.mx-mark').focus()); const n7 = (await tilstand()).n; await side.keyboard.press('Delete'); await side.waitForTimeout(1200); const n8 = (await tilstand()).n;
      await side.waitForTimeout(1800); await side.evaluate(() => (document.querySelector('#ne-mx td.mx-mark') || document.querySelector('#ne-mx td.mx-c')).focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(900); const n9 = (await tilstand()).n;
      T.tjek(n8 === n7 - 2 && n9 === n7, `${w} × ${h}: Delete sletter begge markerede regler (${n7} → ${n8}), og én Ctrl+Z giver dem tilbage (${n9})`, JSON.stringify({ n7, n8, n9 }));
      await side.keyboard.press('Escape'); await side.waitForTimeout(300); const t9 = await tilstand();
      T.tjek(t9.mark === 0 && t9.bj === null, `${w} × ${h}: Esc fjerner markeringen, og linjen under matrixen forsvinder`, JSON.stringify(t9));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
