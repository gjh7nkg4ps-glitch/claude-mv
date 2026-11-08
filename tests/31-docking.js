/* Trin 4 · Det nye i v9.36: docking (vinduessystem C), testet ved 2560 × 1440 (en 43" skærm med 150 % skalering).
   - Start: zonerne Scene, Node-editor og Editor med faner; Scene-, Arbejdsfelt-, Værksted- og Opsætninger-vinduerne (de gamle værter) er skjult;
     zonerne overlapper ikke; Zoner og Bredt skrivebord findes ikke; ↺ Standard findes.
   - Træk en fane med musen: til en kant (ny zone) og til en anden zones fanebjælke (flyttes). Mesh 3D tegner i sin nye zone.
   - Stregerne: træk ændrer størrelsen, dobbeltklik gør siderne lige store; Lås vinduer låser stregerne og fanerne.
   - ⛶ Fuld skærm (rigtig fuld skærm), ⤢ Stor og Esc, ＋ åbner et vindue som fane, × lukker en fane, ⋯ deler og lukker en zone.
   - Layoutet husker ændringerne; ↺ Standard sætter det tilbage; genstart husker opdelingen.
   - De gamle funktioner virker gennem docking: scVaelg, fgVaelg, sbAabn og zonPop åbner faner.
   Skærmbilleder: tests/ud/docking-overblik.png, docking-traek.png og docking-fuld.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Docking'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('31 · Docking (vinduessystem C) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 2560, height: 1440 } });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    const vent = ms => side.waitForTimeout(ms);
    const Z = () => side.evaluate(() => dkZoner(set.dock).map(z => z.id + ':' + z.f.join(',') + '*' + z.a).join(' | '));
    const midt = s => side.evaluate(s => { const q = document.querySelector(s).getBoundingClientRect(); return { x: q.left + q.width / 2, y: q.top + q.height / 2, l: q.left, r: q.right, t: q.top, b: q.bottom, w: q.width, h: q.height }; }, s);
    const træk = async (fra, til) => { await side.mouse.move(fra.x, fra.y); await side.mouse.down(); await side.mouse.move(fra.x + 30, fra.y + 30, { steps: 4 }); await side.mouse.move(til.x, til.y, { steps: 10 }); await side.mouse.up(); await vent(600); };
    /* 1 · start */
    const s = await side.evaluate(() => { const Zs = [...document.querySelectorAll('.dk-zone')].map(z => { const q = z.getBoundingClientRect(); return { id: z.id, x: q.left, y: q.top, r: q.right, b: q.bottom, faner: [...z.querySelectorAll('.dk-fane')].map(f => f.textContent) }; }); let ov = 0; for (let i = 0; i < Zs.length; i++) for (let j = i + 1; j < Zs.length; j++) { const a = Zs[i], b = Zs[j]; if (Math.min(a.r, b.r) - Math.max(a.x, b.x) > 1 && Math.min(a.b, b.b) - Math.max(a.y, b.y) > 1) ov++; }
      return { Zs, ov, vaert: ['w23', 'w25', 'w26', 'w27'].filter(id => { const w = document.getElementById(id); return w && getComputedStyle(w).display !== 'none' && w.getBoundingClientRect().width > 0; }), knapper: ['zon-knap', 'bred-knap'].filter(id => { const b = document.getElementById(id); return b && b.offsetParent; }), std: !!document.getElementById('dk-std') }; });
    await side.screenshot({ path: path.join(UD, 'docking-overblik.png') });
    T.tjek(s.Zs.length === 3 && !s.ov && !s.vaert.length && !s.knapper.length && s.std, `3 zoner uden overlap (${s.Zs.map(z => z.id.slice(3) + ': ' + z.faner.join(', ')).join(' · ')}); de gamle værter, Zoner og Bredt skrivebord er væk; ↺ Standard findes`);
    /* 2 · træk Mesh 3D til højre kant af Node-editorens zone */
    const f1 = await midt('.dk-fane[data-w="w28"]'), z1 = await midt('#dz-af');
    await side.mouse.move(f1.x, f1.y); await side.mouse.down(); await side.mouse.move(f1.x + 30, f1.y + 30, { steps: 4 }); await side.mouse.move(z1.r - 40, z1.y, { steps: 10 });
    const felt = await side.evaluate(() => { const o = document.querySelector('.dk-felt'), g = document.querySelector('.dk-spoegelse'); return { sted: o && o.dataset.sted, tekst: g && g.textContent }; });
    await side.screenshot({ path: path.join(UD, 'docking-traek.png') }); await side.mouse.up(); await vent(800);
    const e1 = await side.evaluate(async () => { const z = dkZoneAf('w28'), t0 = M3.tTot; await new Promise(r => setTimeout(r, 1500)); return { ny: z && z.f.length === 1 && !['sc', 'af', 'ed'].includes(z.id), aktiv: z && z.a, tegner: M3.tTot > t0, tal: dkZoner(set.dock).length }; });
    T.tjek(felt.sted === 'r' && /ny zone til højre/.test(felt.tekst || '') && e1.ny && e1.aktiv === 'w28' && e1.tal === 4 && e1.tegner, `træk Mesh 3D til højre kant: det blå felt viser "${felt.tekst}", Mesh 3D får en ny zone og tegner dér (${e1.tal} zoner)`);
    /* 3 · træk Tidslinje til Editorens fanebjælke */
    await træk(await midt('.dk-fane[data-w="w1"]'), await midt('#dz-ed .dk-faner'));
    const e2 = await side.evaluate(() => ({ ed: (dkZone('ed') || {}).f, af: (dkZone('af') || {}).f }));
    T.tjek(e2.ed.includes('w1') && !e2.af.includes('w1'), `træk Tidslinje til Editorens fanebjælke: den flyttes (${e2.ed.join(', ')})`);
    /* 4 · stregerne */
    const st = await midt('.dk-streg.dk-lodret'); const s0 = await side.evaluate(() => JSON.stringify(DK.streger.map(s => s.n.s.map(x => x.toFixed(3)))));
    await træk(st, { x: st.x - 250, y: st.y });
    const s1 = await side.evaluate(() => JSON.stringify(DK.streger.map(s => s.n.s.map(x => x.toFixed(3)))));
    const st2 = await midt('.dk-streg.dk-lodret'); await side.mouse.dblclick(st2.x, st2.y); await vent(300);
    const s2 = await side.evaluate(() => { const s = DK.streger.find(x => x.vand); return s.n.s[s.i].toFixed(3) + '/' + s.n.s[s.i + 1].toFixed(3); });
    T.tjek(s1 !== s0 && s2.split('/')[0] === s2.split('/')[1], `træk i en streg ændrer størrelsen; dobbeltklik gør siderne lige store (${s2})`);
    /* 5 · fuld skærm og Stor */
    await side.click('#dz-sc [data-dk="fuld"]'); await vent(900);
    const fu = await side.evaluate(() => { const q = document.getElementById(dkZone('sc').a).getBoundingClientRect(); return { el: document.fullscreenElement && document.fullscreenElement.id, b: Math.round(q.width), h: Math.round(q.height) }; });
    await side.screenshot({ path: path.join(UD, 'docking-fuld.png') });
    await side.evaluate(() => document.exitFullscreen && document.fullscreenElement && document.exitFullscreen()); await vent(600);
    T.tjek(fu.el === 'dz-sc' && fu.b > 2500 && fu.h > 1350, `⛶ Fuld skærm: Scene-zonen fylder hele skærmen (vinduet ${fu.b} × ${fu.h} px af 2560 × 1440)`);
    await side.click('#dz-af [data-dk="stor"]'); await vent(400);
    const so = await side.evaluate(() => ({ stor: DK.stor, synlige: document.querySelectorAll('.dk-zone').length, h: Math.round(document.getElementById('dz-af').getBoundingClientRect().height) }));
    await side.keyboard.press('Escape'); await vent(300); const so2 = await side.evaluate(() => ({ stor: DK.stor, n: document.querySelectorAll('.dk-zone').length }));
    T.tjek(so.stor === 'af' && so.synlige === 1 && so.h > 1200 && !so2.stor && so2.n === 4, `⤢ Stor: Node-editorens zone fylder arbejdsfladen (${so.h} px høj); Esc går tilbage (${so2.n} zoner)`);
    /* 6 · ＋, × og ⋯ */
    await side.click('#dz-ed [data-dk="ny"]'); await vent(200);
    await side.evaluate(() => [...document.querySelectorAll('.dk-menu button')].find(b => /^Show/.test(b.textContent)).click()); await vent(400);
    const p1 = await side.evaluate(() => ({ z: dkZoneAf('w17') && dkZoneAf('w17').id, a: dkZone('ed').a, synlig: !document.getElementById('w17').hidden }));
    await side.click('.dk-fx[data-w="w17"]'); await vent(300);
    const p2 = await side.evaluate(() => ({ z: !!dkZoneAf('w17'), skjult: document.getElementById('w17').hidden }));
    T.tjek(p1.z === 'ed' && p1.a === 'w17' && p1.synlig && !p2.z && p2.skjult, '＋ åbner Show som fane i Editorens zone; × lukker fanen igen');
    await side.click('#dz-sc [data-dk="mere"]'); await vent(200); await side.evaluate(() => document.querySelector('.dk-menu button').click()); await vent(400);
    const d1 = await side.evaluate(() => ({ n: dkZoner(set.dock).length, z: dkZoneAf('w2').id, alene: dkZoneAf('w2').f.length }));
    await side.click('#dz-' + d1.z + ' [data-dk="mere"]'); await vent(200); await side.evaluate(() => [...document.querySelectorAll('.dk-menu button')].find(b => /Luk zonen/.test(b.textContent)).click()); await vent(400);
    const d2 = await side.evaluate(() => ({ n: dkZoner(set.dock).length, w2: !!dkZoneAf('w2') }));
    T.tjek(d1.n === 5 && d1.alene === 1 && d2.n === 4 && d2.w2, `⋯ Del: Live preview får sin egen zone (${d1.n} zoner); Luk zonen flytter fanen til nabozonen (${d2.n} zoner)`);
    /* 7 · layoutet husker, ↺ Standard og genstart */
    const før = await Z(); await side.evaluate(() => lay3Anvend('noder')); await vent(300); await side.evaluate(() => lay3Anvend('overblik')); await vent(300);
    const husk = await Z(); await side.click('#dk-std'); await vent(300); const std = await Z();
    T.tjek(husk === før && std === 'sc:w2,w5,w28,w29,w3,w24,w11,w9*w2 | af:w33,w1,w7,w31*w33 | ed:w6,w13,w22*w6', `layoutet Overblik husker ændringerne; ↺ Standard sætter det tilbage (${std})`);
    await side.evaluate(() => { dkZone('af').a = 'w31'; dkGem(); dkAnvend(); }); await side.reload(); await vent(4000);
    T.tjek(await side.evaluate(() => dkZone('af').a === 'w31' && !document.getElementById('w31').hidden), 'efter genstart: opdelingen og den valgte fane (Lydkilde) huskes');
    /* 8 · Lås */
    await side.evaluate(() => { [...document.querySelectorAll('button')].find(b => /Lås vinduer/.test(b.textContent)).click(); }); await vent(700);
    const l0 = await side.evaluate(() => JSON.stringify(set.dock)), ls = await midt('.dk-streg');
    await træk(ls, { x: ls.x - 200, y: ls.y - 200 }); await træk(await midt('.dk-fane[data-w="w5"]'), await midt('#dz-ed .dk-faner'));
    const l1 = await side.evaluate(() => ({ ens: JSON.stringify(set.dock), laast: document.querySelectorAll('.dk-streg.dk-laast').length }));
    await side.evaluate(() => { [...document.querySelectorAll('button')].find(b => /Lås|Låst/.test(b.textContent) && b.closest('#lay3, header, #tb, .tb, body')).click(); }); await vent(700);
    T.tjek(l1.ens === l0 && l1.laast > 0, `🔒 Lås vinduer: stregerne viser en hængelås (${l1.laast}), og hverken streger eller faner kan trækkes`);
    /* 9 · de gamle funktioner */
    const g = await side.evaluate(async () => { const r = {}; scVaelg('w29', true); await new Promise(r => setTimeout(r, 1500)); r.oje = dkZoneAf('w29').a === 'w29' && !!OJ.r; fgVaelg('lyd', 'w1', true); r.tid = dkZoneAf('w1').a === 'w1'; sbAabn('w23'); r.sb = !!dkZoneAf('w29'); zonPop('w4'); await new Promise(r => setTimeout(r, 300)); r.gen = !!dkZoneAf('w4') && dkZoneAf('w4').a === 'w4' && !document.getElementById('w4').hidden; return r; });
    T.tjek(g.oje && g.tid && g.sb && g.gen, 'scVaelg (Øjet starter), fgVaelg (Tidslinje), sbAabn og zonPop (Generator som fane) virker gennem docking');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/docking-overblik.png, docking-traek.png og docking-fuld.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
