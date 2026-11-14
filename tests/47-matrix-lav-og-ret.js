/* Trin 4 · Det nye i v9.52: matrixen, trin 2b (lav og ret). Fase 2 i PLAN-NY-BRUGERFLADE.md.
   Klik i en tom celle laver en regel med standard-indstillinger (de samme som et nyt link i Noder). Træk op og ned ændrer styrken.
   Delete sletter. M slår fra og til. Piletasterne flytter mellem cellerne og vælger reglen. Enter i en tom celle laver en regel.
   Shift + pil op/ned ændrer styrken ét trin. Ctrl+Z fortryder. Alt går gennem den fælles indgang (Regler).
   Testen bruger rigtige museklik, rigtigt træk og rigtige tastetryk ved 1920 × 1080 og 2560 × 1440. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (lav og ret)');
  console.log('47 · Matrixen, trin 2b: lav og ret · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(800); lay3Anvend('noder'); await vent(2500); window.__H = []; Regler.lyt(b => window.__H.push(b.hvad)); });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1900);
      const H = async () => side.evaluate(() => { const h = window.__H.join(); window.__H.length = 0; return h });
      const tilstand = () => side.evaluate(() => { const n = NE2.N.get(NE2.valgt), f = document.activeElement && document.activeElement.closest ? document.activeElement.closest('td.mx-c') : null; return { n: maps.length, valgt: n && n.m ? n.m.band + '|' + n.m.effect : null, gain: n && n.m ? n.m.gain : null, off: n && n.m ? !!n.m.off : null, fokus: f ? (mxCelleId(f).b + '|' + mxCelleId(f).e) : null, fokusHar: f ? f.classList.contains('mx-har') : null, ens: new Set(maps.map(m => m.id)).size === maps.length } });
      /* 1: klik i en tom celle */
      await H(); const før = await tilstand();
      const tom = await side.$('#ne-mx td.mx-ledig'); const id = await tom.evaluate(td => { const c = mxCelleId(td); return c.b + '|' + c.e });
      await tom.click({ timeout: 3000 }); await side.waitForTimeout(900);
      const ny = await tilstand(), h1 = await H(), std = await side.evaluate(() => { const m = maps[maps.length - 1]; return Object.keys(NE5_NY).every(k => m[k] === NE5_NY[k]) && !!m.id });
      T.tjek(ny.n === før.n + 1 && ny.valgt === id && std && /tilfoej/.test(h1) && !/andet/.test(h1) && ny.ens, `${w} × ${h}: et museklik i en tom celle laver en regel med standard-indstillinger, og den er valgt (${før.n} → ${ny.n} regler, beskeden "${h1}")`, JSON.stringify({ ny, id, std, h1 }));
      /* 2: træk op i cellen: styrken stiger; ét Fortryd sætter den tilbage */
      await side.waitForTimeout(1800);
      const r = await side.evaluate(() => { const b = document.querySelector('#ne-mx td.mx-valgt').getBoundingClientRect(); return { x: b.x, y: b.y, width: b.width, height: b.height } }), cx = r.x + r.width / 2, cy = r.y + r.height / 2;
      await side.mouse.move(cx, cy); await side.mouse.down(); for (let i = 1; i <= 10; i++) { await side.mouse.move(cx, cy - i * 3); await side.waitForTimeout(25); }
      const under = await side.evaluate(() => { const td = document.querySelector('#ne-mx td.mx-traekker'), em = td && td.querySelector('em'); return em ? em.textContent : null });
      await side.mouse.up(); await side.waitForTimeout(900);
      const tr = await tilstand(), h2 = await H();
      T.tjek(Math.abs(tr.gain - 1.6) < .001 && /ret/.test(h2) && tr.n === ny.n && tr.valgt === id && under === '×1,60', `${w} × ${h}: træk 30 px op i cellen: styrken går fra 1,00 til ${String(tr.gain).replace('.', ',')}, tallet står i cellen imens ("${under}"), og reglen er stadig valgt (klikket bagefter tæller ikke)`, JSON.stringify({ tr, h2, under }));
      await side.waitForTimeout(1900); await side.keyboard.press('Control+z'); await side.waitForTimeout(900);
      const fo = await tilstand();
      T.tjek(fo.n === ny.n && Math.abs(fo.gain - 1) < .001, `${w} × ${h}: Ctrl+Z i matrixen sætter styrken tilbage til 1,00 (reglen findes stadig)`, JSON.stringify(fo));
      /* 3: tastatur: Shift + pil op, M, pile, Enter, Delete */
      await side.evaluate(() => document.querySelector('#ne-mx td.mx-valgt').focus()); await H();
      await side.keyboard.press('Shift+ArrowUp'); await side.waitForTimeout(700); const s1 = await tilstand();
      await side.keyboard.press('m'); await side.waitForTimeout(700); const m1 = await tilstand(); const grå = await side.evaluate(() => document.querySelector('#ne-mx td.mx-valgt').classList.contains('mx-fra'));
      await side.keyboard.press('m'); await side.waitForTimeout(700); const m2 = await tilstand(), h3 = await H();
      T.tjek(Math.abs(s1.gain - 1.05) < .001 && m1.off === true && grå && m2.off === false && !/andet/.test(h3), `${w} × ${h}: Shift + pil op giver styrke 1,05; M slår reglen fra (grå søjle) og til igen (beskederne "${h3}")`, JSON.stringify({ s1, m1, grå, m2, h3 }));
      /* pilene: gå til højre, til der står en regel, og se at den bliver valgt */
      let flyttet = null; for (let i = 0; i < 40; i++) { await side.keyboard.press('ArrowRight'); await side.waitForTimeout(120); const t = await tilstand(); if (t.fokus !== id && t.fokusHar) { flyttet = t; break; } if (t.fokus === (flyttet && flyttet.fokus)) break; }
      if (!flyttet) { for (let i = 0; i < 40; i++) { await side.keyboard.press('ArrowLeft'); await side.waitForTimeout(120); const t = await tilstand(); if (t.fokus !== id && t.fokusHar) { flyttet = t; break; } } }
      T.tjek(!!flyttet && flyttet.valgt === flyttet.fokus, `${w} × ${h}: piletasterne flytter mellem cellerne og vælger reglen i den celle, man lander på (${flyttet ? flyttet.fokus : 'ingen'})`, JSON.stringify(flyttet));
      /* tilbage til den nye regels celle med et klik, og Delete */
      await side.evaluate(id => { const [b, e] = id.split('|'); const td = mxFindCelle({ b, e }); td.focus(); mxVaelgI(td, false) }, id); await side.waitForTimeout(400); await H();
      await side.keyboard.press('Delete'); await side.waitForTimeout(1000);
      const sl = await tilstand(), h4 = await H(), ledig = await side.evaluate(id => { const [b, e] = id.split('|'); const td = mxFindCelle({ b, e }); return !!td && td.classList.contains('mx-ledig') && document.activeElement === td }, id);
      T.tjek(sl.n === før.n && /slet/.test(h4) && ledig, `${w} × ${h}: Delete sletter den valgte regel (${ny.n} → ${sl.n} regler); cellen er tom igen og har stadig fokus`, JSON.stringify({ sl, h4, ledig }));
      await side.keyboard.press('Enter'); await side.waitForTimeout(900); const en = await tilstand(), h5 = await H();
      T.tjek(en.n === før.n + 1 && en.valgt === id && /tilfoej/.test(h5), `${w} × ${h}: Enter i en tom celle laver en regel (${sl.n} → ${en.n} regler)`, JSON.stringify({ en, h5 }));
      /* reglen findes også som node: skift til Noder */
      await side.click('#ne .mx-skift button[data-mx="0"]'); await side.waitForTimeout(900);
      const no = await side.evaluate(() => { const n = NE2.N.get(NE2.valgt); return { valgt: !!(n && n.kol === 'regel'), node: !!(n && n.el && n.el.isConnected), kant: !!(n && n.el && n.el.classList.contains('ne-valgt')) } });
      T.tjek(no.valgt && no.node, `${w} × ${h}: skifter man til Noder, er den nye regel der som node og stadig valgt`, JSON.stringify(no));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
