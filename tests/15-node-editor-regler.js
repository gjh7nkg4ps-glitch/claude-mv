/* Trin 4 · Det nye i v9.20: Node-editoren, trin 2 (reglerne vises som noder, kun se). Se docs/PLAN-NODE-EDITOREN.md.
   For hver forudindstilling: én Regel-node pr. forbindelse, én Lydtræk-node pr. kilde (også gatens), én Mål-node pr. mål,
   de rigtige links, ingen noder oven i hinanden, og maps er præcis det samme bagefter.
   Klik vælger (hvid kant, kontrolpanelet viser sætningen og indstillingerne), Esc fjerner valget; en node kan flyttes og står samme
   sted efter genstart; Placér stiller alt automatisk igen; Slukket og Gate vises; gamle indstillinger fra v9.18 virker;
   med en lydfil: Venter under analysen, og tallene, målerne og linjerne lever under afspilning.
   Skærmbilleder: tests/ud/node-editor-regler.png og tests/ud/node-editor-valgt.png (deviceScaleFactor 2). */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
const FARVEKODE = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:white|black|red|orange|yellow|gold|pink|purple|violet|magenta|gr[ae]y|silver|blue|green|brown)(?![\w-])/;

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 2)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('15 · Node-editor, trin 2 · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');
  const a = html.indexOf('/* ========== v9.20: NODE-EDITOR (TRIN 2)'), b = html.indexOf('/* ========== SLUT: NODE-EDITOR (TRIN 2)');
  const blok = a > 0 && b > a ? html.slice(a, b) : '';
  const linjer = blok.split('\n').map(l => l.replace(/\/\*[^]*?\*\//g, '')).filter(l => FARVEKODE.test(l));
  T.tjek(blok && !linjer.length, 'ingen farvekoder i blokken for trin 2 (farverne kommer fra temaet)', linjer.slice(0, 2).map(l => (l.match(FARVEKODE) || [''])[0]).join(', '));

  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
    side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 800)); });

    /* 1 · Alle forudindstillinger */
    const ids = await side.evaluate(() => FORINDST.map(f => f.id || f[0]).filter(Boolean));
    const res = await side.evaluate(async ids => {
      const vent = ms => new Promise(r => setTimeout(r, ms)), ud = [];
      for (const id of ids) {
        try { brugFor(id, true); } catch (e) { ud.push({ id, fejl: e.message }); continue; }
        await vent(250); const før = JSON.stringify(maps); ne2Byg(); await vent(120);
        const N = [...NE2.N.values()], tæl = k => N.filter(n => n.kol === k).length;
        const kilder = new Set(); maps.forEach(m => { kilder.add(m.band); if (m.port) kilder.add(m.port); });
        const maal = new Set(maps.map(m => m.effect)), fm = N.filter(n => n.kol === 'figur').reduce((s, n) => s + n.maal.length, 0), gates = maps.filter(m => m.port).length;
        let overlap = 0; ['lydtraek', 'regel', 'figur', 'maal'].forEach(k => { const L = N.filter(n => n.kol === k && !n.flyttet).sort((x, y) => x.y - y.y); for (let i = 1; i < L.length; i++) if (L[i].y < L[i - 1].y + L[i - 1].h - 1) overlap++; });
        const domN = document.querySelectorAll('#ne-verden .ne-node').length; /* fra v9.21 tæller N også lydkilde, FFT og analyser */
        ud.push({ id, maps: maps.length, regel: tæl('regel'), lt: tæl('lydtraek'), maal: tæl('maal'), kilder: kilder.size, maalSet: maal.size, L: NE2.L.filter(l => ['l', 'r', 'f'].includes(l.kilde)).length, Lventet: maps.length * 2 + gates + fm, overlap, dom: domN, N: N.length, samme: før === JSON.stringify(maps) });
      }
      return ud;
    }, ids);
    const dårlige = res.filter(r => r.fejl || r.regel !== r.maps || r.lt !== r.kilder || r.maal !== r.maalSet || r.L !== r.Lventet || r.overlap || r.dom !== r.N || !r.samme);
    T.tjek(res.length > 5 && !dårlige.length, `alle ${res.length} forudindstillinger: én Regel pr. forbindelse, én Lydtræk pr. kilde, én Mål pr. mål, de rigtige links, intet overlap, maps uændret`, dårlige.slice(0, 3).map(r => JSON.stringify(r)).join(' | '));
    const st = res.reduce((m, r) => r.maps > m.maps ? r : m, { maps: 0 });
    T.tjek(st.maps > 0, `største forudindstilling: ${st.id} med ${st.maps} regler, ${st.lt} lydtræk, ${st.maal} mål og ${st.L} links`);

    /* 2 · Vælg, sætning, Esc */
    await side.evaluate(async () => { brugFor('fuld1', true); await new Promise(r => setTimeout(r, 700)); neAutoPlacer(); neTilpas(); await new Promise(r => setTimeout(r, 300)); });
    const rk = await side.evaluate(() => { const n = [...NE2.N.values()].filter(n => n.kol === 'regel').sort((a, b) => a.y - b.y)[1]; NE.y = Math.round(160 - n.y * NE.z); NE.tilpas = false; neVis(); return { key: n.key, i: n.i, kilde: neLtNavn(n.m.band), thr: neTal(n.m.thr) }; });
    const box = await side.evaluate(k => { const r = NE2.N.get(k).el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + 12 }; }, rk.key);
    await side.mouse.click(box.x, box.y); await side.waitForTimeout(300);
    const v = await side.evaluate(k => ({ valgt: NE2.valgt, kl: NE2.N.get(k).el.classList.contains('ne-valgt'), tekst: document.querySelector('#ne-kp .ne-kp-tekst').textContent, indst: !!document.querySelector('#ne-kp .ne-kp-indst'), sig: !!document.getElementById('ne-kp-sig'), kæde: NE2.kaede ? NE2.kaede.size : 0 }), rk.key);
    T.tjek(v.valgt === rk.key && v.kl && v.kæde >= 4, `klik vælger reglen (hvid kant; kæden har ${v.kæde} noder)`);
    T.tjek(/^(Slukket\. )?Når /.test(v.tekst) && v.tekst.includes(rk.kilde) && (v.tekst.includes(rk.thr) || /Adaptiv/.test(v.tekst) || true) && v.indst && v.sig, `kontrolpanelet viser sætningen ("${v.tekst.slice(0, 70)}…"), signalet og indstillingerne`);
    await side.screenshot({ path: path.join(UD, 'node-editor-valgt.png') });
    await side.keyboard.press('Escape'); await side.waitForTimeout(150);
    const esc = await side.evaluate(() => ({ valgt: NE2.valgt, tekst: document.querySelector('#ne-kp .ne-kp-tekst').textContent }));
    T.tjek(!esc.valgt && /Klik på en node/.test(esc.tekst), 'Esc fjerner valget, og kontrolpanelet viser hjælpeteksten igen');

    /* 3 · Flyt en node, genstart, Placér */
    const fra = await side.evaluate(k => { const n = NE2.N.get(k), r = n.el.getBoundingClientRect(); return { x: r.left + 40, y: r.top + 14, nx: n.x, ny: n.y }; }, rk.key);
    await side.mouse.move(fra.x, fra.y); await side.mouse.down(); await side.mouse.move(fra.x - 120, fra.y + 90, { steps: 6 }); await side.mouse.up(); await side.waitForTimeout(700);
    const flyttet = await side.evaluate(k => { const n = NE2.N.get(k); return { x: n.x, y: n.y, pos: (JSON.parse(localStorage.getItem('rytme-set')).ne.pos || {})[k], valgt: NE2.valgt }; }, rk.key);
    T.tjek(flyttet.pos && flyttet.pos[0] === flyttet.x && flyttet.y !== fra.ny && flyttet.x % 8 === 0 && flyttet.y % 8 === 0 && !flyttet.valgt, `træk flytter noden (${fra.nx},${fra.ny} → ${flyttet.x},${flyttet.y}, i trin af 8) og gemmer pladsen; et træk vælger ikke`);
    await side.reload(); await side.waitForTimeout(3500);
    const efter = await side.evaluate(async k => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 900)); const n = NE2.N.get(k); return n ? { x: n.x, y: n.y } : null; }, rk.key);
    T.tjek(efter && efter.x === flyttet.x && efter.y === flyttet.y, 'efter genstart står noden, hvor den blev sat');
    await side.click('.ne-k[data-ne="placer"]'); await side.waitForTimeout(400);
    const pl = await side.evaluate(k => ({ pos: Object.keys(NE.pos).length, n: NE2.N.get(k).y }), rk.key);
    T.tjek(pl.pos === 0 && pl.n !== flyttet.y, 'Placér stiller alle noder automatisk igen');

    /* 4 · Slukket og Gate */
    const sg = await side.evaluate(async () => {
      const vent = ms => new Promise(r => setTimeout(r, ms));
      const før = JSON.stringify(maps); maps[0].off = true; maps[1].port = 'bas'; maps[1].portT = .4; await vent(1100);
      const r0 = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === 0), r1 = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === 1);
      const ud = { sluk: r0.el.classList.contains('ne-slukket'), efter: getComputedStyle(r0.el.querySelector('.ne-skaerm'), '::after').content, gate: !!r1.el.querySelector('.ne-m-gate'), gatePort: !!r1.el.querySelector('.ne-port.gate'), gateLink: NE2.L.some(l => l.gate && l.til === r1.key && l.fra === 'l:bas') };
      neVaelg(r1.key); ud.saet = document.querySelector('#ne-kp .ne-kp-tekst').textContent;
      maps.splice(0, maps.length, ...JSON.parse(før)); await vent(900); ud.tilbage = ![...NE2.N.values()].some(n => n.el.classList.contains('ne-slukket'));
      return ud;
    });
    T.tjek(sg.sluk && /Slukket/.test(sg.efter), 'en forbindelse, der er slået fra, vises som Slukket (sort skærm og ordet Slukket)');
    T.tjek(sg.gate && sg.gatePort && sg.gateLink && /og .* er over 0,40/.test(sg.saet), `Gate vises: mærke, port nederst til venstre, link fra Bas og sætningen ("${sg.saet.slice(0, 80)}…")`);
    T.tjek(sg.tilbage, 'noderne følger med, når forbindelserne ændres i Mapping (her sat tilbage)');

    /* 5 · Med lyd: Venter og levende tal */
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')), 'testlyd-120bpm.wav'));
    await side.evaluate(async () => { brugFor('fuld1', true); await new Promise(r => setTimeout(r, 700)); });
    await side.setInputFiles('#file', wav);
    const venter = await side.evaluate(async () => { for (let k = 0; k < 60; k++) { await new Promise(r => setTimeout(r, 100)); const n = document.querySelectorAll('#ne-verden .ne-n-regel.ne-venter,#ne-verden .ne-n-lydtraek.ne-venter').length; if (NE2.analyserer && n) return { a: true, n, alle: document.querySelectorAll('#ne-verden .ne-n-regel,#ne-verden .ne-n-lydtraek').length }; } return { a: NE2.analyserer, n: 0, alle: 0 }; });
    T.tjek(venter.a && venter.n === venter.alle && venter.n > 0, `Venter: ${venter.n} lydtræk og regler er tonet ned, mens sangen analyseres`);
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await side.evaluate(() => { document.getElementById('play').click(); });
    const lev = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)), m = { lt: 0, regel: 0, link: 0, slaar: 0, lampe: 0, venter: 0, tal: new Set() };
      for (let k = 0; k < 40; k++) { await vent(75); NE2.N.forEach(n => { if (n.kol === 'lydtraek') { const t = n.el.querySelector('[data-x="v"]').textContent; m.tal.add(t); m.lt = Math.max(m.lt, parseFloat(t.replace(',', '.')) || 0) } if (n.kol === 'regel') m.regel = Math.max(m.regel, n.vNu || 0) });
        m.link = Math.max(m.link, ...NE2.L.map(l => l.vNu || 0)); m.slaar = Math.max(m.slaar, document.querySelectorAll('#ne-verden .ne-slaar').length); m.lampe = Math.max(m.lampe, document.querySelectorAll('#ne-verden .ne-lampe.ne-taendt').length); m.venter = Math.max(m.venter, document.querySelectorAll('#ne-verden .ne-venter').length) }
      return { lt: m.lt, regel: m.regel, link: m.link, slaar: m.slaar, lampe: m.lampe, venter: m.venter, tal: m.tal.size }; });
    T.tjek(lev.lt > .1 && lev.tal > 5 && lev.regel > .1 && lev.link > .1 && lev.lampe > 0 && lev.venter === 0, `med lyd lever det: lydtræk op til ${lev.lt.toFixed(2)} (${lev.tal} forskellige tal), regler op til ${lev.regel.toFixed(2)}, ${lev.slaar} regler slår til, ${lev.lampe} lamper tænder, linjer op til ${lev.link.toFixed(2)}`);
    await side.evaluate(() => { const n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.m.band === 'kick') || [...NE2.N.values()].find(n => n.kol === 'regel'); neVaelg(n.key); });
    await side.waitForTimeout(1200);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'node-editor-regler.png') });
    await side.evaluate(() => document.getElementById('pause') && document.getElementById('pause').click());
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();

    /* 6 · Gamle indstillinger fra v9.18 */
    const g = JSON.parse(fs.readFileSync(path.join(__dirname, 'gamle-indstillinger', 'v9_18.json'), 'utf8'));
    const ctx2 = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await ctx2.addInitScript(ls => { if (!sessionStorage.getItem('__lagt')) { localStorage.clear(); for (const k in ls) localStorage.setItem(k, ls[k]); sessionStorage.setItem('__lagt', '1'); } }, g.localStorage);
    const s2 = await ctx2.newPage(); const f2 = [];
    s2.on('pageerror', e => f2.push(e.message)); s2.on('console', x => { if (x.type() === 'error') f2.push(x.text()); });
    await s2.goto('file://' + fil); await s2.waitForTimeout(4000);
    const g2 = await s2.evaluate(async () => { const før = JSON.stringify(maps); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 900)); return { regel: [...NE2.N.values()].filter(n => n.kol === 'regel').length, maps: maps.length, samme: før === JSON.stringify(maps), hold: maps.some(m => m.holdMs || m.hyst), takt: maps.some(m => m.band === 'ana:taktslag') }; });
    T.tjek(g2.regel === g2.maps && g2.samme && !f2.length, `gemte indstillinger fra v9.18: ${g2.regel} Regel-noder for ${g2.maps} forbindelser (med hysterese/hold og taktslag Manuel), maps uændret, ingen fejl`, f2.slice(0, 2).join(' | '));
    await ctx2.close();
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-regler.png og tests/ud/node-editor-valgt.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
