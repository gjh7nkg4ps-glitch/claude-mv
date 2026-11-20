/* Trin 4 · Det nye i v9.107 (PS1, P8.14 punkt 7, godkendt i P8.20): vinduet På scenen. Ved 1920 × 1080 og 2560 × 1440 med Pigernes show i 2 · Scene:
   fanen hedder På scenen; tre afsnit (Karakterer 2, Figurer 1, Effekter 19 · hele billedet), Effekter foldet fra start og husket efter genstart (rigtigt klik på
   overskriften); effektens øje (rigtigt klik) skjuler Lys-puls i tegningen (blinkE giver 0), mens motoren regner videre; ⏻ på Glød får neFraF til at sige fra;
   styrken trækkes op (rigtigt træk) og nulstilles med dobbeltklik; figurens ⏻ og styrke står i rækken; Ctrl+Z (rigtigt tastetryk) fortryder; uden tryk er alt som før. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('På scenen'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('94 · På scenen (PS1) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const klik = async (sel, dbl) => { const p = await side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'nearest' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width } }, sel); if (!p || !p.w) throw new Error('kan ikke klikke på ' + sel); if (dbl) await side.mouse.dblclick(p.x, p.y); else await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
      await side.evaluate(() => { brugFor('piger_show', true) }); await side.waitForTimeout(600);
      await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1500);
      const m0 = await side.evaluate(() => { const faner = [...document.querySelectorAll('.dk-fane')].map(f => f.textContent.replace(/×$/, '').trim()); const D = [...document.querySelectorAll('#fg34 .ps-afsnit')].map(d => ({ k: d.dataset.ps, open: d.open, s: d.querySelector('summary').textContent.trim(), n: d.querySelectorAll('.fg34-row').length, navne: [...d.querySelectorAll('.fg34-row .fg34-navn')].map(x => x.textContent) })); return { faner, D, navn: DK_NAVN.w34, eff: JSON.stringify(scene.ne && scene.ne.eff) } });
      const D = Object.fromEntries(m0.D.map(d => [d.k, d]));
      T.tjek(m0.navn === 'På scenen' && m0.faner.includes('På scenen') && m0.D.length === 3 && D.kar && D.kar.open && D.kar.n === 2 && D.kar.navne.includes('Pige på stangen') && D.fig && D.fig.open && D.fig.n === 1 && D.eff && !D.eff.open && D.eff.n === 19 && /Effekter \(19\)/.test(D.eff.s) && /hele billedet/.test(D.eff.s) && D.eff.navne[0] === 'Lys-puls', `${w} × ${h}: fanen hedder På scenen; afsnittene Karakterer (${D.kar && D.kar.n}: ${D.kar && D.kar.navne.join(', ')}), Figurer (${D.fig && D.fig.n}) og Effekter (${D.eff && D.eff.n} · hele billedet, foldet fra start)`, JSON.stringify(m0));
      T.tjek(!m0.eff || m0.eff === 'undefined' || m0.eff === '{}', 'intet er sat pr. effekt, før man trykker (de indbyggede shows tegner som før)', m0.eff);
      /* fold Effekter ud (rigtigt klik), og husk det efter genstart */
      await klik('#fg34 .ps-afsnit[data-ps="eff"] > summary'); await side.waitForTimeout(300);
      const f1 = await side.evaluate(() => ({ open: document.querySelector('#fg34 .ps-afsnit[data-ps="eff"]').open, husk: set.paaScene && set.paaScene.eff, gemt: JSON.parse(localStorage.getItem('rytme-set')).paaScene }));
      await side.reload(); await side.waitForTimeout(4500); await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200);
      const f2 = await side.evaluate(() => ({ open: document.querySelector('#fg34 .ps-afsnit[data-ps="eff"]').open, kar: document.querySelector('#fg34 .ps-afsnit[data-ps="kar"]').open }));
      T.tjek(f1.open && f1.husk === true && f1.gemt && f1.gemt.eff === true && f2.open && f2.kar, 'Effekter foldes ud med et rigtigt klik på overskriften, og det huskes efter genstart', JSON.stringify({ f1, f2 }));
      /* øjet på Lys-puls */
      await klik('#fg34 [data-psoje="e:puls"]');
      const oe = await side.evaluate(() => { const E = blinkE({ puls: .8, glod: .6, farve: .4 }); return { skjult: scene.ne.eff.puls.skjult, E, raekke: document.querySelector('#fg34 [data-pseff="puls"]').classList.contains('ps-af'), knap: document.querySelector('#fg34 [data-psoje="e:puls"]').textContent, motor: neFraF({ effect: 'puls' }), status: document.getElementById('status').textContent } });
      T.tjek(oe.skjult === true && oe.E.puls === 0 && oe.E.glod > 0 && oe.E.farve > 0 && oe.raekke && oe.knap === '⊘' && oe.motor === false && /skjult på scenen/.test(oe.status), 'øjet på Lys-puls (rigtigt klik): tegningen får 0 for Lys-puls, de andre effekter tegnes, motoren regner videre', JSON.stringify(oe));
      await klik('#fg34 [data-psoje="e:puls"]');
      const oe2 = await side.evaluate(() => ({ eff: JSON.stringify(scene.ne.eff), E: blinkE({ puls: .8 }).puls }));
      T.tjek(oe2.eff === '{}' && oe2.E > 0, 'klik igen viser den (og scene.ne.eff er tom igen)', JSON.stringify(oe2));
      /* ⏻ på Glød */
      await klik('#fg34 [data-psfra="e:glod"]');
      const fr = await side.evaluate(() => ({ fra: scene.ne.eff.glod.fra, glod: neFraF({ effect: 'glod' }), puls: neFraF({ effect: 'puls' }), raekke: document.querySelector('#fg34 [data-pseff="glod"]').classList.contains('ps-fraet'), E: blinkE({ glod: .7 }).glod }));
      T.tjek(fr.fra === true && fr.glod === true && fr.puls === false && fr.raekke && fr.E > 0, '⏻ på Glød (rigtigt klik): motoren siger fra for Glød (reglerne giver 0), ikke for Lys-puls; den tegnes stadig', JSON.stringify(fr));
      /* Ctrl+Z */
      await side.waitForTimeout(1500); await side.evaluate(() => document.body.focus()); await side.keyboard.press('Control+z'); await side.waitForTimeout(1200);
      const uz = await side.evaluate(() => ({ eff: JSON.stringify(scene.ne.eff || {}), glod: neFraF({ effect: 'glod' }), raekke: document.querySelector('#fg34 [data-pseff="glod"]').classList.contains('ps-fraet') }));
      T.tjek(uz.eff === '{}' && uz.glod === false && !uz.raekke, 'Ctrl+Z (rigtigt tastetryk) slår Glød til igen', JSON.stringify(uz));
      /* styrke: træk op på Lys-puls, dobbeltklik = 1 */
      const sp = await side.evaluate(() => { const s = document.querySelector('#fg34 [data-psst="e:puls"]'); s.scrollIntoView({ block: 'nearest' }); const q = s.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.mouse.move(sp.x, sp.y); await side.mouse.down(); await side.mouse.move(sp.x, sp.y - 60, { steps: 6 }); await side.mouse.up(); await side.waitForTimeout(500);
      const st = await side.evaluate(() => ({ styrke: scene.ne.eff.puls.styrke, f: neFigF('puls'), tekst: document.querySelector('#fg34 [data-psst="e:puls"]').textContent, status: document.getElementById('status').textContent }));
      T.tjek(st.styrke === 1.5 && st.f === 1.5 && st.tekst === '×1,50' && /styrke ×1,50/.test(st.status), 'styrken på Lys-puls trækkes op til ×1,50 (rigtigt træk, 60 px = 0,50), og motoren ganger den på', JSON.stringify(st));
      await klik('#fg34 [data-psst="e:puls"]', true);
      const st2 = await side.evaluate(() => ({ eff: JSON.stringify(scene.ne.eff || {}), f: neFigF('puls') }));
      T.tjek(st2.eff === '{}' && st2.f === 1, 'dobbeltklik sætter styrken til 1', JSON.stringify(st2));
      /* figurens ⏻ og styrke i rækken */
      const fig = await side.evaluate(() => { const r = [...document.querySelectorAll('#fg34 .fg34-row[data-fg34]')].find(x => x.querySelector('.fg34-navn').textContent === 'Lyshåret pige'); return { id: fase2.objekter[+r.dataset.fg34].id, fra: !!r.querySelector('[data-psfra]'), st: !!r.querySelector('[data-psst]'), oje: !!r.querySelector('[data-fg34oje]') } });
      await klik('#fg34 [data-psfra="f:' + fig.id + '"]');
      const ff = await side.evaluate(id => { const o = fase2.objekter.find(x => x.id === id); return { neFra: !!o.neFra, motor: neFraF({ effect: 'obj:' + id + ':0:dHop' }), raekke: document.querySelector('#fg34 [data-psfra="f:' + id + '"]').closest('.fg34-row').classList.contains('ps-fraet') } }, fig.id);
      T.tjek(fig.fra && fig.st && fig.oje && ff.neFra && ff.motor && ff.raekke, 'figurens række har øje, ⏻ og styrke; ⏻ på Lyshåret pige (rigtigt klik) slår hendes regler fra i motoren', JSON.stringify({ fig, ff }));
      await klik('#fg34 [data-psfra="f:' + fig.id + '"]');
      if (w === 2560) { await side.evaluate(() => { document.querySelector('#fg34 .ps-afsnit[data-ps="eff"]').open = true }); await side.waitForTimeout(300); const q = await side.evaluate(() => { const r = document.getElementById('w34').getBoundingClientRect(); return { x: r.x, y: r.y, width: Math.min(r.width, 700), height: Math.min(r.height, 1100) } }); await side.screenshot({ path: path.join(UD, 'paa-scenen.png'), clip: q }); }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
