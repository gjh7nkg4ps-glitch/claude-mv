/* Trin 4 · Det nye i v9.81 (trin 7a): oprydning. Lyd i 3D, Idé-galleri, Generator (fuld), Lydlag, Audit og Detektion er væk fra skærmen
   (ikke i ＋, ikke i Scene, ikke i arbejdsområderne, ikke under ☰ Mere; vinduerne er skjult), Lydkilde har ingen Avanceret …, målene lyd:… findes ikke,
   og en gemt regel med et lydlag som mål slås fra med en gul besked; scene-nodens kontrolpanel har ingen knapper; en slukket scene tændes ved start. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Oprydning 7a');
  console.log('76 · Oprydning 7a (v9.81) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      /* en gemt regel med et lydlag som mål, og en slukket scene */
      await side.addInitScript(() => { try { if (!localStorage.getItem('rytme-mapping2')) { localStorage.setItem('rytme-mapping2', JSON.stringify([{ band: 'kick', effect: 'puls', thr: .3, gain: 1, att: 10, rel: 200 }, { band: 'hihat', effect: 'lyd:klik', thr: .3, gain: 1, att: 10, rel: 200 }])); const s = JSON.parse(localStorage.getItem('rytme-set') || '{}'); s.ne = Object.assign(s.ne || {}, { sluk: ['w28'] }); localStorage.setItem('rytme-set', JSON.stringify(s)) } } catch (e) { } });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const r = await side.evaluate(() => { const vaek = ['w9', 'w22', 'w4', 'w15', 'w19', 'w20']; return { navne: vaek.filter(id => DK_NAVN[id]), skjult: vaek.map(id => { const e = document.getElementById(id); return !!e && e.hidden }), sc: SC_FANER.map(f => f[0]).includes('w9'), ne12: NE12_SC.map(s => s[0]).includes('w9'), adv: !!document.querySelector('button#lks-adv'), knapper: ['tb-gen', 'd3btn', 'galbtn'].map(id => !!document.getElementById(id)), lyd: TARGETS.filter(t => String(t.id).startsWith('lyd:')).length, eff: EFFECTS.some(e => String(e[0]).startsWith('lyd:')), regel: maps.find(m => m.effect === 'lyd:klik'), status: document.getElementById('status').textContent, sluk: (set.ne && set.ne.sluk) || [], m3: typeof ne12Sluk === 'function' ? ne12Sluk('w28') : null } });
      T.tjek(r.navne.length === 0 && r.skjult.every(Boolean) && !r.sc && !r.ne12 && !r.adv && r.knapper.every(x => !x) && r.lyd === 0 && !r.eff, `${w} × ${h}: Lyd i 3D, Idé-galleri, Generator (fuld), Lydlag, Audit og Detektion er væk fra ＋, Scene og scene-noderne, vinduerne er skjult, Avanceret … og de gamle knapper er væk, og målene lyd:… findes ikke`, JSON.stringify(r));
      T.tjek(r.regel && r.regel.fjernet === 'lyd' && r.regel.off === true && /lydlag som mål/.test(r.status) && r.sluk.length === 0 && r.m3 === false, `${w} × ${h}: en gemt regel med et lydlag som mål er slået fra med beskeden "${r.status.slice(0, 90)}…"; den slukkede scene er tændt igen`, JSON.stringify({ regel: r.regel, status: r.status, sluk: r.sluk, m3: r.m3 }));
      /* ＋ i en zone, Scene-fanerne og ☰ Mere */
      await side.click('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1200);
      const z = await side.evaluate(() => ({ faner: [...document.querySelectorAll('.dk-zone .dk-fane')].map(f => f.textContent.replace(/×$/, '').trim()), plus: Object.keys(DK_NAVN).filter(id => dkSynligFane(id)).map(id => dkFane(id)) }));
      await side.click('#el9-mere'); await side.waitForTimeout(400); const m = await side.evaluate(() => [...document.querySelectorAll('#mere-pan button')].map(b => b.textContent.trim())); await side.keyboard.press('Escape');
      const d = [...z.faner, ...z.plus, ...m].filter(x => /Lyd i 3D|Idé-galleri|Generator \(fuld\)|Lydlag|Audit|Detektion/.test(x));
      T.tjek(d.length === 0 && z.faner.includes('Egenskaber') && !z.faner.includes('Idé-galleri') && z.plus.length >= 10, `${w} × ${h}: ingen af de seks står i zonernes faner (${z.faner.join(', ')}), i ＋ (${z.plus.length} vinduer) eller under ☰ Mere`, JSON.stringify({ d, z }));
      /* scene-nodens kontrolpanel */
      await side.click('#lay3 [data-lay3="ao-regler"]'); await side.waitForTimeout(1500);
      const kp = await side.evaluate(async () => { try { mxSaet(false, true) } catch (e) { } await new Promise(r => setTimeout(r, 600)); const n = [...NE2.N.values()].find(x => x.kol === 'scene'); if (!n) return { node: false }; neVaelg(n.key); await new Promise(r => setTimeout(r, 300)); return { node: true, knapper: document.querySelectorAll('#ne-kp [data-ne12]').length, tekst: (document.querySelector('#ne-kp .ne-kp-ind') || {}).textContent || '' } });
      T.tjek(kp.node && kp.knapper === 0 && /zonens bjælke/.test(kp.tekst), `${w} × ${h}: scene-nodens kontrolpanel har ingen knapper (Riv løs, Send til skærm, Sluk, Åbn stort er væk)`, JSON.stringify(kp));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
