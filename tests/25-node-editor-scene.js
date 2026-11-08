/* Trin 4 · Det nye i v9.30: Node-editoren, trin 12 (scene-noder, øje og Slå fra, Baggrund). Se papirets afsnit 5.7 og 5.9.
   Scene-noden for Live preview har et levende billede og et link fra hver figur og effekt-gruppe. Vælgeren skifter til Mesh 3D, som starter.
   Sluk Mesh 3D: den tegner ikke (tiden står stille), vinduet viser Slukket; Tænd: den tegner igen. Sluk Live preview: billedet står stille.
   En effekt-gruppe slået fra: dens regler giver 0 (m.off og maps røres ikke). Øjet på gruppen skjuler dens effekter i tegningen, ikke i motoren.
   Øjet på en figur er "Tag af scenen" og kan fortrydes. Baggrund ▾: Dublet-scenen og Mesh 3D tegnes svagt bag noderne. Klik på billedet åbner Show.
   Skærmbilleder: tests/ud/node-editor-scene.png og tests/ud/node-editor-scene-sluk.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 12)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('25 · Node-editor, trin 12 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); scVaelg('w2', true); await new Promise(r => setTimeout(r, 1000)); curGen = 'house'; gStart(); await new Promise(r => setTimeout(r, 1500)); NE.tilpas = false; NE.z = .45; const s = NE.kol.find(c => c.k === 'scene'); NE.x = Math.round(document.getElementById('ne-flade').clientWidth - (s.x + 470) * NE.z); NE.y = 60; neVis(); });
    await vent(800);
    /* 1 · scene-noden for Live preview */
    const a = await side.evaluate(async () => { const n = NE2.N.get('s:w2'); if (!n) return null; const c = n.el.querySelector('.ne-sc-billede'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let sum = 0, sum2 = 0, k = 0; for (let i = 0; i < d.length; i += 40) { const v = d[i] + d[i + 1] + d[i + 2]; sum += v; sum2 += v * v; k++ } const fig = [...NE2.N.values()].filter(x => x.kol === 'figur'); return { scener: [...NE2.N.values()].filter(x => x.kol === 'scene').map(x => x.navn), var: sum2 / k - (sum / k) ** 2, fig: fig.length, links: NE2.L.filter(l => l.til === 's:w2').length, grupper: fig.filter(x => x.gruppe).length, hoved: document.querySelector('#ne-hoveder .ne-hoved[data-kol="scene"] .ne-naar').textContent }; });
    T.tjek(a && a.scener.join() === 'Live preview' && a.var > 20 && a.links === a.fig && a.grupper > 0, a ? `én scene-node (${a.scener.join(', ')}; "${a.hoved}") med et levende billede og ${a.links} links fra ${a.fig} figurer og effekt-grupper (${a.grupper} grupper)` : 'ingen scene-node for Live preview');
    /* 2 · øjet og Slå fra på en effekt-gruppe */
    const før = await side.evaluate(() => JSON.stringify(maps));
    const g = await side.evaluate(async () => { const G = [...NE2.N.values()].filter(x => x.kol === 'figur' && x.gruppe && x.regler.length).sort((p, q) => q.regler.length - p.regler.length)[0]; const I = G.regler.map(k => NE2.N.get(k).i); const maks = async () => { let u = 0; for (let k = 0; k < 40; k++) { await new Promise(r => setTimeout(r, 50)); I.forEach(i => u = Math.max(u, R2M.ud[i] || 0)) } return u }; const u0 = await maks();
      neVaelg(G.key); await new Promise(r => setTimeout(r, 200)); document.querySelector('#ne-kp [data-ne12="fra"]').click(); await new Promise(r => setTimeout(r, 1500)); /* release skal klinge ud */ const u1 = await maks(); const node = NE2.N.get(G.key).el, regel = NE2.N.get(G.regler[0]).el;
      const r = { navn: G.navn, n: I.length, u0, u1, fra: scene.ne.grp[G.navn].fra, off: I.some(i => maps[i].off), node: node.classList.contains('ne-fig-fra') && /Slået fra/.test(node.textContent), regel: regel.classList.contains('ne-slukket') };
      neSaetFra(G.key, false); const e = maps[I[0]].effect; neSaetOeje(G.key, false); const E = {}; E[e] = 1; E.xyz = 1; const b = blinkE(E); r.skjult = b[e] === 0; r.oejeNode = NE2.N.get(G.key).el.querySelector('.ne-oeje').textContent; neSaetOeje(G.key, true); r.vis = blinkE(E)[e] === 1; return r; });
    T.tjek(g.u0 > .05 && g.u1 < .08 && g.fra && !g.off && g.node && g.regel, `Slå fra på ${g.navn}: ${g.n} regler gav op til ${g.u0.toFixed(2)}, nu ${g.u1.toFixed(3)}; noden og reglerne viser Slået fra; m.off er ikke rørt`);
    T.tjek(g.skjult && g.vis && g.oejeNode === '⊘', `øjet på ${g.navn}: effekterne får 0 i tegningen (blinkE), noden viser ⊘; åbnet igen vises de`);
    T.tjek(await side.evaluate(f => JSON.stringify(maps) === f, før), 'maps er uændret af øje og Slå fra');
    /* 3 · øjet på en figur = Tag af scenen, og Fortryd */
    const f = await side.evaluate(async () => { brugFor('piger_show', true); await new Promise(r => setTimeout(r, 1500)); const F = [...NE2.N.values()].find(x => x.kol === 'figur' && !x.gruppe && x.obj && x.obj.synlig); if (!F) return null; const id = F.key.slice(2); await new Promise(r => setTimeout(r, 1200)); F.el.querySelector('[data-ne12="oeje"]').click(); await new Promise(r => setTimeout(r, 400)); const o = () => fase2.objekter.find(x => x.id === id); const r = { navn: F.navn, skjult: !o().synlig, tegn: NE2.N.get(F.key).el.querySelector('.ne-oeje').textContent }; await new Promise(r => setTimeout(r, 1200)); feFortryd(); await new Promise(r => setTimeout(r, 500)); r.tilbage = o().synlig; return r; });
    T.tjek(f && f.skjult && f.tegn === '⊘' && f.tilbage, f ? `øjet på ${f.navn}: figuren er taget af scenen (⊘), og Fortryd lægger den på igen` : 'ingen synlig figur');
    await side.screenshot({ path: path.join(UD, 'node-editor-scene.png') });
    /* 4 · vælgeren: Mesh 3D, og Sluk */
    const m = await side.evaluate(async () => { brugFor('fuld1', true); scVaelg('w2', true); await new Promise(r => setTimeout(r, 1200)); const s = NE2.N.get('s:w2').el.querySelector('[data-ne12="vaelg"]'); s.value = 'w28'; s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 2500)); const n = NE2.N.get('s:w28'); const t0 = M3.tTot; await new Promise(r => setTimeout(r, 800)); return { aktiv: set.scene.aktiv, node: !!n, w2: NE2.N.has('s:w2'), gaar: M3.tTot > t0, r: !!M3.r }; });
    T.tjek(m.aktiv === 'w28' && m.node && !m.w2 && m.r && m.gaar, 'vælgeren skifter Scene til Mesh 3D: scene-noden er nu Mesh 3D, og Mesh 3D tegner');
    const sl = await side.evaluate(async () => { neVaelg('s:w28'); await new Promise(r => setTimeout(r, 200)); document.querySelector('#ne-kp [data-ne12="sluk"]').click(); await new Promise(r => setTimeout(r, 500)); const t0 = M3.tTot; await new Promise(r => setTimeout(r, 1200)); return { staar: M3.tTot === t0, vindue: document.getElementById('w28').classList.contains('ne-sc-sluk'), node: NE2.N.get('s:w28').el.classList.contains('ne-slukket'), gemt: set.ne.sluk.slice() }; });
    await side.screenshot({ path: path.join(UD, 'node-editor-scene-sluk.png') });
    T.tjek(sl.staar && sl.vindue && sl.node && sl.gemt.includes('w28'), 'Sluk Mesh 3D: den tegner ikke (tiden står stille), vinduet og noden viser Slukket, og det huskes i set.ne.sluk');
    const tn = await side.evaluate(async () => { document.querySelector('#ne-kp [data-ne12="sluk"]').click(); await new Promise(r => setTimeout(r, 400)); const t0 = M3.tTot; await new Promise(r => setTimeout(r, 1500)); return { gaar: M3.tTot > t0, vindue: document.getElementById('w28').classList.contains('ne-sc-sluk') }; });
    T.tjek(tn.gaar && !tn.vindue, 'Tænd: Mesh 3D tegner igen');
    /* 5 · Øjet (scene) starter, og Live preview slukket står stille */
    const oj = await side.evaluate(async () => { ne12Vis('w29'); await new Promise(r => setTimeout(r, 2500)); return { node: NE2.N.has('s:w29'), r: !!OJ.r, tabt: !!OJ.tabt }; });
    T.tjek(oj.node && oj.r && !oj.tabt, 'Øjet vælges fra Scene-kolonnens liste og starter');
    const pv = await side.evaluate(async () => { ne12Vis('w2'); await new Promise(r => setTimeout(r, 600)); neSaetSluk('w2', true); await new Promise(r => setTimeout(r, 300)); const c = document.getElementById('pv'), px = () => Array.from(c.getContext('2d').getImageData(0, 0, c.width, c.height).data.filter((x, i) => i % 997 === 0)).join(); const a = px(); await new Promise(r => setTimeout(r, 800)); const b = px(); neSaetSluk('w2', false); await new Promise(r => setTimeout(r, 800)); const c2 = px(); return { ens: a === b, igen: c2 !== b, spiller: gPlaying }; });
    T.tjek(pv.ens && pv.igen, `Sluk Live preview: billedet står stille; tændt tegner det igen (generatoren spiller: ${pv.spiller})`);
    /* 6 · Baggrund ▾ */
    const bg = await side.evaluate(async () => { const s = document.getElementById('ne-bg-v'), sæt = v => { s.value = v; s.dispatchEvent(new Event('change', { bubbles: true })) }, fyld = () => { const c = document.getElementById('ne-bg'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 400) if (d[i] + d[i + 1] + d[i + 2] > 30) n++; return n }; sæt('dublet'); await new Promise(r => setTimeout(r, 700)); const d = { vis: !document.getElementById('ne-bg').hidden, n: fyld() }; sæt('mesh3d'); await new Promise(r => setTimeout(r, 1500)); const m = { n: fyld(), gemt: set.ne.bg }; sæt('fra'); await new Promise(r => setTimeout(r, 300)); return { d, m, fra: document.getElementById('ne-bg').hidden && !set.ne.bg, valg: [...s.options].map(o => o.textContent.replace(' ▾', '')).join(', ') }; });
    T.tjek(bg.d.vis && bg.d.n > 10 && bg.m.n > 10 && bg.m.gemt === 'mesh3d' && bg.fra, `Baggrund ▾ (${bg.valg}): Dublet-scenen og Mesh 3D tegnes bag noderne; Fra skjuler`);
    /* 7 · klik på billedet åbner scenen stort */
    const st = await side.evaluate(async () => { const c = NE2.N.get('s:w2').el.querySelector('.ne-sc-billede'), r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
    await side.mouse.click(st.x, st.y); await vent(800);
    const sh = await side.evaluate(() => { const r = { lay: (document.querySelector('.lay3-on, [data-lay3].on') || {}).textContent || '', sc: document.getElementById('w23').getBoundingClientRect().height, ne: document.getElementById('w25') ? document.getElementById('w25').getBoundingClientRect().height : 0 }; lay3Anvend('noder'); return r; });
    T.tjek(sh.sc > 600, `klik på billedet åbner Live preview stort (layoutet Show: Scene ${Math.round(sh.sc)} px høj)`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-scene.png og node-editor-scene-sluk.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
