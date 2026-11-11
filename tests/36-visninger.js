/* Trin 4 · Det nye i v9.41: de 10 visninger fra Routing-overblik i Node-editoren (Visning ▾ i værktøjslinjen).
   - Visning ▾ har 11 valg: Noder (kolonner) og de 10 visninger.
   - Hver af de 10 tegner reglerne (lærredet er ikke tomt), står i stedet for nodernes lærred, og kontrolpanelet bliver.
   - Kræfter-bjælken kun i Frit netværk og 3D-netværk; Fokus og valg af en regel; båndet retter tærsklen (samme regel i maps).
   - Tasterne i visningen flytter ikke nodernes lærred; Noder (kolonner) giver noderne tilbage; valget huskes efter genstart; Ctrl+K.
   Skærmbilleder: tests/ud/visning-*.png (fri, matrix, strom, ring, d3). */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const UD = path.join(__dirname, 'ud');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Visninger');
  console.log('36 · De 10 visninger · ' + path.basename(fil));
  fs.mkdirSync(UD, { recursive: true });
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1500)); });
    const valg = await side.evaluate(() => [...$('ne41-vis').options].map(o => o.value + ':' + o.textContent));
    T.tjek(valg.length === 11 && valg[0] === 'kol:Noder (kolonner)', `Visning ▾ har ${valg.length} valg: ${valg.map(v => v.split(':')[1]).join(', ')}`);
    const res = [];
    for (const v of ['fri', 'matrix', 'strom', 'tid', 'trae', 'treemap', 'bue', 'hive', 'ring', 'd3']) {
      const r = await side.evaluate(async v => { ne41Vis(v); await new Promise(r => setTimeout(r, 900)); const c = $('rt'), g = c.getContext('2d'), d = g.getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 16) if (Math.abs(d[i] - 16) + Math.abs(d[i + 1] - 22) + Math.abs(d[i + 2] - 28) > 30) n++;
        return { v, px: n, w: c.width, h: c.height, ov: !$('ne-vis').hidden, fl: getComputedStyle($('ne-flade')).display, kp: !!$('ne-kp').offsetParent, kraft: !$('rtkraft').hidden, lay: set.rtLay }; }, v);
      res.push(r);
      if (['fri', 'matrix', 'strom', 'ring', 'd3'].includes(v)) await side.screenshot({ path: path.join(UD, 'visning-' + v + '.png'), clip: await side.evaluate(() => { const r = $('ne').getBoundingClientRect(); return { x: r.left, y: r.top, width: r.width, height: r.height }; }) });
    }
    const dårlig = res.filter(r => !(r.ov && r.fl === 'none' && r.kp && r.px > 200 && r.w > 300 && r.lay === r.v));
    T.tjek(!dårlig.length, `de 10 visninger tegner reglerne i stedet for nodernes lærred (kontrolpanelet bliver): ${res.map(r => r.v + ' ' + r.px).join(', ')} farvede punkter`, JSON.stringify(dårlig.slice(0, 2)));
    T.tjek(res.every(r => r.kraft === (r.v === 'fri' || r.v === 'd3')), `Kræfter-bjælken kun i Frit netværk og 3D-netværk`);
    /* fokus, valg og båndet */
    const fv = await side.evaluate(async () => { ne41Vis('matrix'); await new Promise(r => setTimeout(r, 300)); ne41Vis('fri'); await new Promise(r => setTimeout(r, 900)); const L = rt.lay, nd = Object.values(L.alle)[0]; rtFokus(nd); const fok = rt.fokus; rtVaelg(0); await new Promise(r => setTimeout(r, 400));
      const s = $('rtsel').querySelector('input[data-f="thr"]'); const t0 = maps[0].thr; if (s) { s.value = .62; s.dispatchEvent(new Event('input', { bubbles: true })) } return { fok: !!fok, conn: rt.conn, s: !!s, t0, t1: maps[0].thr, knap: [...$('rtsel').querySelectorAll('button')].map(b => b.textContent) }; });
    T.tjek(fv.fok && fv.conn === 0 && fv.s && fv.t1 === 0.62, `Fokus på en knude og valg af regel 1; båndet retter tærsklen i reglen (${fv.t0} → ${fv.t1}); knapper: ${fv.knap.join(', ')}`);
    /* tasterne flytter ikke nodernes lærred */
    const kb = await side.evaluate(async () => { const x0 = NE.x, y0 = NE.y; $('rt').focus(); ['ArrowDown', 'ArrowRight', 'ArrowDown'].forEach(k => $('rt').dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }))); await new Promise(r => setTimeout(r, 200)); return { kb: rt.kb.vis || rt.kb.i > 0 || rt.kb.kol > 0, x: NE.x === x0 && NE.y === y0 }; });
    T.tjek(kb.x, `piletasterne i visningen flytter ikke nodernes lærred (tastaturet går i visningen: ${kb.kb})`);
    /* tilbage til noderne, huskes */
    await side.evaluate(async () => { ne41Vis('ring'); await new Promise(r => setTimeout(r, 300)); });
    await side.reload(); await side.waitForTimeout(5000);
    const efter = await side.evaluate(async () => { await new Promise(r => setTimeout(r, 1000)); const a = { vis: set.neVis, ov: !$('ne-vis').hidden, sel: $('ne41-vis').value }; ne41Vis('kol'); await new Promise(r => setTimeout(r, 500)); return { a, ov: !$('ne-vis').hidden, fl: getComputedStyle($('ne-flade')).display, noder: document.querySelectorAll('#ne-verden .ne-node').length, h: Math.round($('ne-flade').getBoundingClientRect().height) }; });
    T.tjek(efter.a.vis === 'ring' && efter.a.ov && efter.a.sel === 'ring', `valget huskes efter genstart (Ring (chord) står der igen)`);
    T.tjek(!efter.ov && efter.fl !== 'none' && efter.noder > 0 && efter.h > 100, `Noder (kolonner) giver noderne tilbage (${efter.noder} noder, lærredet ${efter.h} px)`);
    const ck = await side.evaluate(() => { const L = []; neKpPunkter(L); return L.filter(x => /^Visning: /.test(x.n)).length; });
    T.tjek(ck === 11, `Ctrl+K har ${ck} punkter "Visning: …"`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
