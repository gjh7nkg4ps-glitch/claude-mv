/* Trin 4 · Det nye i v9.71 (trin 5b): én linje øverst.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160: linjen øverst har plads til alt uden at rulle; sidebjælken, bundbjælken, Niveau, Enkel tilstand og
   vinduesnumre er væk, og arbejdsfladen fylder resten; programmet starter i et arbejdsområde; vinduerne er låst som standard.
   Med rigtige museklik: ☰ Mere viser det, der hører til arbejdsområdet (skifter, når 2 · Scene vælges) og de faste sektioner; 💾 Gem ▾ gemmer alt i
   Opsætning 20; ↶ Fortryd fortryder en ændret regel; alle vinduer kan åbnes (Kvalitet, som før var skjult på lavt Niveau); Søg finder knapperne under Mere. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Én linje øverst');
  console.log('66 · Én linje øverst (5b) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const r = await side.evaluate(() => { const tbm = document.querySelector('#tb .tbm'), tb = document.getElementById('tb'), ws = document.getElementById('ws').getBoundingClientRect(); const synlig = id => { let e = document.getElementById(id); if (!e) return false; if (id === 'tid') e = e.closest('.tp-tid') || e; /* tiden er tom uden en sang */ const q = e.getBoundingClientRect(); return q.width > 0 && q.height > 0 && q.bottom <= tb.offsetHeight + 2 };
        return { tbH: tb.offsetHeight, ruller: tbm.scrollWidth > tbm.clientWidth + 1, ws: { x: Math.round(ws.x), y: Math.round(ws.y), r: Math.round(ws.right), b: Math.round(ws.bottom) }, sb: !!document.getElementById('sb'), fly: !!document.getElementById('sb-fly'), tpBjaelke: getComputedStyle(document.getElementById('tp')).position, niv: !!document.getElementById('tb-niv'), enkel: !!document.getElementById('enkel') || !!document.getElementById('enkelbtn'), gamle: [...document.querySelectorAll('#lay3 [data-lay3]')].map(b => b.dataset.lay3).join(','), vaek: ['lay3-mine', 'lay3-gem', 'bred-knap', 'zon-knap'].filter(id => document.getElementById(id)), nr: [...document.querySelectorAll('.nr')].some(e => e.getBoundingClientRect().width > 0), elementer: ['file', 'play', 'pause', 'pl-start', 'pl-pos', 'tp-a', 'tp-bpm', 'status', 'kp-knap', 'el9-fortryd', 'el9-gentag', 'el9-gem', 'el9-mere'].filter(id => !synlig(id)), ao: set.lay3, laast: set.laast, bodyLaast: document.body.classList.contains('laast') } });
      T.tjek(r.tbH <= 48 && !r.ruller && r.ws.x === 0 && r.ws.y === r.tbH && r.ws.r === w && r.ws.b === h && !r.sb && !r.fly && r.tpBjaelke === 'static', `${w} × ${h}: én linje øverst (${r.tbH} px) med plads til alt uden at rulle; arbejdsfladen fylder resten (${r.ws.x},${r.ws.y} til ${r.ws.r},${r.ws.b}); sidebjælken og bundbjælken er væk`, JSON.stringify(r));
      T.tjek(!r.niv && !r.enkel && r.gamle === 'ao-sang,ao-scene,ao-regler,ao-show' && !r.vaek.length && !r.nr && !r.elementer.length, `${w} × ${h}: Niveau, Enkel tilstand, de 6 gamle layout-knapper, Mine, Gem layout, Bredt skrivebord, Zoner og vinduesnumre er væk; afspilning, tid, position, A/B, tempo, status, Søg, Fortryd, Gentag, Gem og Mere står i linjen`, JSON.stringify(r));
      T.tjek(/^ao-/.test(r.ao) && r.laast === true && r.bodyLaast, `${w} × ${h}: programmet starter i et arbejdsområde (${r.ao}), og vinduerne er låst som standard`, JSON.stringify(r));
      if (w === 1920) {
        /* Mere: hører til arbejdsområdet, og skifter */
        const klik = async id => { const p = await side.evaluate(id => { const q = document.getElementById(id).getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, id); await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
        await side.click('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(1200); await klik('el9-mere');
        const m1 = await side.evaluate(() => { const p = document.getElementById('mere-pan'); return { vis: !p.hidden && p.getBoundingClientRect().width > 200, ao: p.querySelector('#mere-ao-sek h4').textContent, punkter: [...p.querySelectorAll('#mere-ao button')].map(b => b.textContent).join(' · '), sek: [...p.querySelectorAll('.mere-sek h4')].map(x => x.textContent).join(' · '), skarp: !!p.querySelector('#tb-skarp'), laas: !!p.querySelector('#laas-knap'), std: !!p.querySelector('#dk-std'), sikker: !!p.querySelector('#tb-sikker'), ordliste: !!p.querySelector('#hjbtn') } });
        T.tjek(m1.vis && /1 · Sang/.test(m1.ao) && /Generator \(fuld\) · Lydlag · Lydtræk-guide/.test(m1.punkter) && /Vis · Vinduer · Indstillinger · Opsætninger · Hjælp/.test(m1.sek) && !m1.skarp && m1.laas && m1.std && m1.sikker && m1.ordliste, `☰ Mere (rigtigt klik) i 1 · Sang: "${m1.ao}" (${m1.punkter}) og sektionerne ${m1.sek} med Lås vinduer, ↺ Standard, Sikker visning og Ordliste (Skarphed står i Indstillinger fra v9.72)`, JSON.stringify(m1));
        await side.keyboard.press('Escape'); await side.waitForTimeout(200); await side.click('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200); await klik('el9-mere');
        const m2 = await side.evaluate(() => { const p = document.getElementById('mere-pan'); return { ao: p.querySelector('#mere-ao-sek h4').textContent, punkter: [...p.querySelectorAll('#mere-ao button')].map(b => b.textContent).join(' · ') } });
        T.tjek(/2 · Scene/.test(m2.ao) && /Bane og klods · Kvalitet · Flyt effekter/.test(m2.punkter), `i 2 · Scene viser Mere "${m2.ao}": ${m2.punkter}`, JSON.stringify(m2));
        /* Kvalitet kan åbnes (før skjult på lavt Niveau) */
        const kvP = await side.evaluate(() => { const b = [...document.querySelectorAll('#mere-ao button')].find(x => x.textContent === 'Kvalitet'); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }); await side.mouse.click(kvP.x, kvP.y); await side.waitForTimeout(900);
        const kv = await side.evaluate(() => { const w = document.getElementById('w14'); return { lukket: document.getElementById('mere-pan').hidden, synlig: !!w && w.getBoundingClientRect().width > 200 && !w.hidden, fane: !!document.querySelector('.dk-fane[data-w="w14"]') } });
        T.tjek(kv.lukket && kv.synlig && kv.fane, 'Kvalitet åbnes som fane fra Mere (vinduet var før skjult på Niveau 1 og 2), og Mere lukker', JSON.stringify(kv));
        /* Gem ▾ */
        await side.evaluate(() => { try { localStorage.removeItem('rytme-T') } catch (e) { } }); await klik('el9-gem');
        const g1 = await side.evaluate(() => { const p = document.getElementById('el9-gem-pan'); const b = p.querySelector('[data-el9gem="T"]'); const q = b.getBoundingClientRect(); return { vis: !p.hidden, n: p.querySelectorAll('[data-el9gem]').length, tekst: b.textContent, x: q.x + q.width / 2, y: q.y + q.height / 2 } });
        await side.mouse.click(g1.x, g1.y); await side.waitForTimeout(500);
        const g2 = await side.evaluate(() => { const d = slotRead('T'); return { gemt: !!d && Array.isArray(d.maps) && d.maps.length === maps.length, lukket: document.getElementById('el9-gem-pan').hidden, status: document.getElementById('status').textContent } });
        T.tjek(g1.vis && g1.n === 20 && /Opsætning 20 · tom/.test(g1.tekst) && g2.gemt && g2.lukket && /gemt i Opsætning 20/.test(g2.status), `💾 Gem ▾ viser Opsætning 1 til 20 (${g1.n}); et rigtigt klik på "${g1.tekst}" gemmer alt dér: "${g2.status}"`, JSON.stringify({ g1, g2 }));
        /* Fortryd */
        const f0 = await side.evaluate(() => { const i = maps.findIndex(m => m && m.band); const g = maps[i].gain; Regler.retNr(i, { gain: Math.round((g + 0.37) * 100) / 100 }); return { i, g, ny: maps[i].gain } });
        await side.waitForTimeout(900); await klik('el9-fortryd');
        const f1 = await side.evaluate(i => maps[i].gain, f0.i);
        T.tjek(f0.ny !== f0.g && Math.abs(f1 - f0.g) < 1e-9, `↶ Fortryd (rigtigt klik) sætter en regels styrke tilbage (${f0.g} → ${f0.ny} → ${f1})`, JSON.stringify({ f0, f1 }));
        /* Søg finder knapperne under Mere */
        const kp = await side.evaluate(() => { kpAabn(); const inp = document.getElementById('kp-in'); inp.value = 'ordliste'; inp.dispatchEvent(new Event('input')); const L = [...document.querySelectorAll('#kp-liste .kp-r')].map(r => r.textContent); const sidebj = L.some(x => /Sidebjælke/.test(x)); document.getElementById('kp-in').dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })); return { L: L.slice(0, 3), sidebj } });
        T.tjek(kp.L.some(x => /Ordliste/.test(x) && /Mere · Hjælp/.test(x)) && !kp.sidebj, `Søg (Ctrl+K) finder Ordliste under "Mere · Hjælp" (${kp.L[0]}) og intet fra sidebjælken`, JSON.stringify(kp));
      }
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
