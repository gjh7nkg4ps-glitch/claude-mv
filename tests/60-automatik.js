/* Trin 4 · Det nye i v9.65: fase 4, trin 4c: panelet Automatik, og gem et sæt regler.
   - Knappen Automatik i Node-editorens værktøjslinje åbner panelet med seks linjer; hver viser, hvad der er valgt, og kan slås fra.
   - Tilbage til standard sætter alle linjer tilbage på én gang.
   - ⋯ ved en figurs navn i matrixen: Gem reglerne som et sæt; sættet kan bruges på en anden figur og kommer ind som forslag.
   Rigtige museklik ved 1920 × 1080, 2560 × 1440 og 3840 × 2160. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Automatik');
  console.log('60 · Panelet Automatik, og gem et sæt regler · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const id = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(800); const a = nyFigurHer('Pige A', .35, .6, 'danser'), b = nyFigurHer('Pige B', .65, .6, 'danser'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
        ne5Ny('kick', 'obj:' + a.id + ':0:dHop'); Regler.retNr(maps.length - 1, { gain: .7, thr: .42 }); ne5Ny('snare', 'obj:' + a.id + ':0:dArmV'); mxInd().mxE.e.push('obj:' + b.id + ':0:dHop'); mxInd().mxFold['g:Bane'] = true; await vent(1500); return { a: a.id, b: b.id } });
      const klikAu = async (sel) => { const p = await side.evaluate(s => { const b = document.querySelector(s); if (!b) return null; b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, sel); if (!p) return false; await side.mouse.click(p.x, p.y); await side.waitForTimeout(700); return true };
      const pan = () => side.evaluate(() => { const p = document.getElementById('ne65-pan'); if (!p || p.hidden) return null; const q = p.getBoundingClientRect(), f = document.getElementById('ne').getBoundingClientRect(); return { rk: [...p.querySelectorAll('tr th')].map(x => x.textContent), tekst: p.textContent, inde: q.left >= f.left - 1 && q.right <= f.right + 1 && q.bottom <= f.bottom + 1, paa: [...p.querySelectorAll('.ne-paa')].map(x => x.closest('tr').dataset.aur + ':' + x.textContent) } });
      /* 1 · knappen åbner panelet med de seks linjer */
      const k1 = await klikAu('#ne .ne-vlinje [data-au="aaben"]'), p1 = await pan();
      T.tjek(k1 && !!p1 && p1.rk.join('|') === 'Normalisering|Lange sange|Adaptiv tærskel|Taktslag: Auto-valg|Spor: Auto-valg|Sangens analyse|Afsnits-dynamik' && p1.inde && /Normalisering[^]*Adaptiv[^]*Ændres i Sang/.test(p1.tekst) && /Lange sange[^]*Til \(i stykker/.test(p1.tekst) /* v9.76: de fire linjer viser værdien og Ændres i Sang */ && /Alle regler bruger Auto-valg/.test(p1.tekst) && /Ikke i brug: der er ikke lavet et show/.test(p1.tekst) && /Tilbage til standard/.test(p1.tekst), `${w} × ${h}: knappen Automatik åbner panelet med seks linjer (Normalisering, Lange sange, Adaptiv tærskel, Taktslag, Spor, Afsnits-dynamik), hver med det, der er valgt nu, og sin standard; panelet ligger inden for Node-editoren`, JSON.stringify(p1));
      /* 2 · slå tre ting om med rigtige klik; én regel på Manuel taktslag */
      /* v9.76: knapperne står i Sang → Avanceret (Indstillinger for analysen); Ændres i Sang åbner dem */
      const sangAabn = await klikAu('#ne65-pan [data-au="sang"]'); await side.waitForTimeout(600); const iSang = await side.evaluate(() => ({ lay: set.lay3, fane: set.sgFane, synlig: document.querySelector('#sg [data-sgau="norm"]') && document.querySelector('#sg [data-sgau="norm"]').offsetParent !== null }));
      await klikAu('#sg [data-sgau="norm"][data-v="0"]'); await klikAu('#sg [data-sgau="lokal"][data-v="0"]'); const tp0 = await side.evaluate(() => document.getElementById('eq-tilpas').checked); await klikAu('#sg [data-sgau="tilpas"][data-v="' + (tp0 ? '0' : '1') + '"]');
      await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1500)); auAaben(true); await new Promise(r => setTimeout(r, 400)) });
      await side.evaluate(() => { const i = maps.findIndex(m => m.band === 'kick'); Regler.retNr(i, { takt: 'live' }); Regler.retNr(maps.length - 1, { spor: 'mix' }) }); await side.waitForTimeout(900);
      const s2 = await side.evaluate(() => ({ mode, lokal: set.normLokal, tilpas: document.getElementById('eq-tilpas').checked, knap: document.getElementById('norm').textContent, takt: maps.filter(m => m.takt).length, spor: maps.filter(m => m.spor).length })), p2 = await pan();
      T.tjek(sangAabn && iSang.lay === 'ao-sang' && iSang.fane === 'avanceret' && iSang.synlig && s2.mode === 'fast' && s2.lokal === false && s2.tilpas === !tp0 && /Fast/.test(s2.knap) && /Normalisering[^]*Fast[^]*Ændres i Sang/.test(p2.tekst) && /Lange sange[^]*Fra/.test(p2.tekst) && /1 regel står på Manuel/.test(p2.tekst) && s2.takt === 1 && s2.spor === 1, `${w} × ${h}: Ændres i Sang åbner Sang → Avanceret; rigtige klik i kortet sætter Normalisering til Fast, Lange sange til Fra og vender Adaptiv tærskel; programmets egne knapper følger med; en regel med Manuel taktslag og en med Manuel spor vises som "1 regel står på Manuel"`, JSON.stringify({ s2, paa: p2.paa }));
      /* 3 · Sæt alle til Auto-valg, og Tilbage til standard */
      await klikAu('#ne65-pan [data-au="takt"]'); const s3 = await side.evaluate(() => maps.filter(m => m.takt).length);
      await klikAu('#ne65-pan [data-au="std"]'); const s4 = await side.evaluate(() => ({ mode, lokal: set.normLokal !== false, tilpas: document.getElementById('eq-tilpas').checked, std: document.getElementById('eq-tilpas').defaultChecked, takt: maps.filter(m => m.takt).length, spor: maps.filter(m => m.spor).length })), p4 = await pan();
      T.tjek(s3 === 0 && s4.mode === 'auto' && s4.lokal && s4.tilpas === s4.std && s4.takt === 0 && s4.spor === 0 && /Normalisering[^]*Adaptiv[^]*Ændres i Sang/.test(p4.tekst) && /Lange sange[^]*Til \(i stykker/.test(p4.tekst) && !/står på Manuel/.test(p4.tekst), `${w} × ${h}: Sæt alle til Auto-valg fjerner Manuel på taktslag; Tilbage til standard sætter alt tilbage (Adaptiv, Til, Adaptiv tærskel som ved start, alle regler på Auto-valg)`, JSON.stringify({ s3, s4, paa: p4.paa }));
      await klikAu('#ne65-pan [data-au="luk"]'); const p5 = await pan();
      /* 4 · matrixen: ⋯ → Gem reglerne som et sæt → ⋯ hos den anden figur → Brug et sæt → forslag */
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const menu = async f => { const p = await side.evaluate(k => { const b = [...document.querySelectorAll('#ne-mx [data-mxfm]')].find(x => x.dataset.mxfm === k); if (!b) return null; b.scrollIntoView({ block: 'nearest', inline: 'center' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }, 'f:' + id[f]); if (!p) return false; await side.mouse.click(p.x, p.y); await side.waitForTimeout(400); return true };
      const mKlik = async re => { const p = await side.evaluate(t => { const b = [...document.querySelectorAll('#mx-vaelg button')].find(x => new RegExp(t).test(x.textContent)); if (!b || b.disabled) return null; b.scrollIntoView({ block: 'nearest' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, t: b.textContent } }, re); if (!p) return null; await side.mouse.click(p.x, p.y); await side.waitForTimeout(1100); return p.t };
      const n0 = await side.evaluate(() => ({ sk: ((set.ne && set.ne.skabeloner) || []).length, n: maps.length }));
      await menu('a'); const g = await mKlik('^Gem reglerne som et sæt$'); const n1 = await side.evaluate(() => ({ sk: (set.ne.skabeloner || []).length, navn: (set.ne.skabeloner || []).slice(-1)[0].navn, regler: (set.ne.skabeloner || []).slice(-1)[0].regler.length }));
      await menu('b'); const br = await mKlik('^Brug et sæt: Mine: Pige A'); const e4 = await side.evaluate(b => ({ n: maps.length, fs: FS.liste.filter(f => f.regel.effect.startsWith('obj:' + b + ':')).map(f => f.regel.band + '>' + f.regel.effect.split(':')[3] + '×' + f.regel.gain + '/' + f.regel.thr).sort(), celler: document.querySelectorAll('#ne-mx td.mx-forslag').length }), id.b);
      T.tjek(!p5 && !!g && n1.sk === n0.sk + 1 && n1.regler === 2 && /^Mine: Pige A/.test(n1.navn) && !!br && e4.n === n0.n && e4.fs.join() === 'kick>dHop×0.7/0.42,snare>dArmV×1/0.3' && e4.celler >= 2, `${w} × ${h}: ⋯ hos Pige A → Gem reglerne som et sæt gemmer "${n1.navn}" (2 regler); ⋯ hos Pige B → Brug et sæt giver de samme 2 regler som forslag (stiplede celler, med styrke og tærskel fra sættet), og ingen regler er ændret`, JSON.stringify({ g, n0, n1, br, e4 }));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
