/* Trin 4 · Det nye i v9.74 (trin 6a): Figurer til venstre, scenen i midten, Egenskaber til højre; træk figurerne direkte i Live preview.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160: 2 · Scene har tre zoner (Figurer · scene · Egenskaber) fra venstre mod højre uden overlap;
   Egenskaber har ingen figurliste og ingen fane Ny figur, men den valgte figurs navn øverst; med rigtige klik: + Ny figur → to piger ved stangen,
   klik på en række vælger figuren, øjet tager figuren af scenen og lægger den på igen, Tom figur laver en figur, ▼ flytter den, dobbeltklik + Enter omdøber;
   et træk i Live preview uden Flyt effekter flytter den figur, man tager (og vælger den), men ikke en effekt; Ctrl+Z fortryder trækket;
   Morgenstjernen giver de samme 6 regler som før, og Levende figurers kode er uændret (hash af funktionerne). */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const HASH = { addMorgenstjerne: 3757928788, nyMorgenstjerne: 4209020805, livUI: 3464871260, livKopi: 2438001433, levKoe: 1102397250 };
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Figurer og Egenskaber');
  console.log('69 · Figurer, scene og Egenskaber (6a) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(5000);
      const klik = async (sel, dbl) => { const p = await side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width } }, sel); if (!p || !p.w) throw new Error('kan ikke klikke på ' + sel); if (dbl) await side.mouse.dblclick(p.x, p.y); else await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
      await klik('#lay3 [data-lay3="ao-scene"]'); await side.waitForTimeout(1500);
      const z = await side.evaluate(() => { const Z = [...document.querySelectorAll('.dk-zone')].filter(x => !x.hidden && x.getBoundingClientRect().width > 0).map(x => { const q = x.getBoundingClientRect(); return { z: x.dataset.z, l: q.left, r: q.right, t: q.top, b: q.bottom, faner: [...x.querySelectorAll('.dk-fane')].map(f => f.textContent.replace(/×$/, '').trim()) } }).sort((a, b) => a.l - b.l);
        let overlap = false; for (let i = 0; i < Z.length; i++)for (let j = i + 1; j < Z.length; j++) { const a = Z[i], b = Z[j]; if (a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b) overlap = true }
        return { Z, overlap, inden: Z.every(q => q.l >= 0 && q.r <= innerWidth + 1 && q.b <= innerHeight + 1), figurliste: !!document.querySelector('#fctl .fe-figliste'), faner: [...document.querySelectorAll('#fctl [data-fe-fane]')].map(b => b.textContent), navn: (document.querySelector('.fe-navn74') || {}).textContent, rows: document.querySelectorAll('.fg34-row').length, fgen: !!document.querySelector('#w34 #fgen') } });
      T.tjek(z.Z.length === 3 && z.Z.map(q => q.z).join(',') === 'fg,sc,ed' && !z.overlap && z.inden && z.Z[0].faner[0] === 'Figurer' && z.Z[2].faner[0] === 'Egenskaber', `${w} × ${h}: 2 · Scene har tre zoner fra venstre: ${z.Z.map(q => q.faner.join('/')).join(' | ')} uden overlap og inden for skærmen`, JSON.stringify(z.Z));
      T.tjek(!z.figurliste && z.faner.join(',') === 'Adfærd,Figur,Lag,Koblinger' && /Figur 1/.test(z.navn || '') && z.rows === 1 && z.fgen, `${w} × ${h}: Egenskaber har ingen figurliste og ingen fane Ny figur; fanerne er ${z.faner.join(', ')}; navnet står øverst (${z.navn}); Figurer har ${z.rows} række og Figur-generatoren nederst`, JSON.stringify(z));
      /* + Ny figur → to piger ved stangen */
      await klik('#fg34-ny'); const pan = await side.evaluate(() => !document.getElementById('fg34-ny-pan').hidden && document.getElementById('fg34-ny-pan').getBoundingClientRect().height > 0);
      await klik('#fg34 [data-op="piger"]'); await side.waitForTimeout(800);
      const p = await side.evaluate(() => ({ rows: [...document.querySelectorAll('.fg34-row .fg34-navn')].map(x => x.textContent), on: (document.querySelector('.fg34-row.on .fg34-navn') || {}).textContent, navn: document.querySelector('.fe-navn74').textContent, selO, pan: document.getElementById('fg34-ny-pan').hidden, status: document.getElementById('status').textContent }));
      T.tjek(pan && p.rows.length === 3 && p.rows.includes('Pige på stangen') && p.on === 'Pige på stangen' && /Pige på stangen/.test(p.navn) && p.pan, `${w} × ${h}: + Ny figur (rigtigt klik) åbner listen, og "to piger ved stangen" giver ${p.rows.join(', ')}; Pige på stangen er valgt i Figurer og Egenskaber; listen lukker`, JSON.stringify(p));
      if (w !== 1920) { T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n')); await ctx.close(); continue }
      /* klik på en række vælger */
      await klik('.fg34-row[data-fg34="1"]'); const v = await side.evaluate(() => ({ selO, navn: document.querySelector('.fe-navn74').textContent, on: document.querySelector('.fg34-row.on').dataset.fg34 }));
      /* øjet: af scenen og på igen */
      await klik('.fg34-row[data-fg34="1"] .fg34-oje'); const oje1 = await side.evaluate(() => ({ synlig: fase2.objekter[1].synlig, af: document.querySelector('.fg34-row[data-fg34="1"]').classList.contains('af'), oje: document.querySelector('.fg34-row[data-fg34="1"] .fg34-oje').textContent, hnd: HANDLES.filter(x => x[0].startsWith('obj:')).length, u: document.querySelector('.fe-navn74-u').textContent }));
      await klik('.fg34-row[data-fg34="1"] .fg34-oje'); const oje2 = await side.evaluate(() => ({ synlig: fase2.objekter[1].synlig, hnd: HANDLES.filter(x => x[0].startsWith('obj:')).length }));
      T.tjek(v.selO === 1 && /Lyshåret pige/.test(v.navn) && v.on === '1' && oje1.synlig === false && oje1.af && oje1.oje === '⊘' && oje1.hnd === 2 && /ikke på scenen/.test(oje1.u) && oje2.synlig === true && oje2.hnd === 3, `klik på rækken vælger Lyshåret pige (Egenskaber følger med); øjet tager hende af scenen (${oje1.hnd} håndtag, "${oje1.u}") og lægger hende på igen (${oje2.hnd} håndtag)`, JSON.stringify({ v, oje1, oje2 }));
      /* Tom figur, ▼, omdøb */
      await klik('#fg34-ny'); await klik('#fg34 [data-op="nyt"]'); await side.waitForTimeout(500);
      const ny = await side.evaluate(() => ({ n: fase2.objekter.length, selO, navn: fase2.objekter[selO].navn, on: document.querySelector('.fg34-row.on .fg34-navn').textContent }));
      await klik('#fg34 [data-op="op"]'); const fl = await side.evaluate(() => ({ selO, rk: fase2.objekter.map(o => o.navn) }));
      await klik('.fg34-row.on .fg34-navn', true); const omd = await side.evaluate(() => !!document.querySelector('.fg34-omd') && document.activeElement.classList.contains('fg34-omd'));
      await side.keyboard.type('Min figur'); await side.keyboard.press('Enter'); await side.waitForTimeout(500);
      const omd2 = await side.evaluate(() => ({ navn: fase2.objekter[selO].navn, row: document.querySelector('.fg34-row.on .fg34-navn').textContent, eg: document.querySelector('.fe-navn74').textContent, inp: document.getElementById('fnavn').value }));
      T.tjek(ny.n === 4 && ny.navn === 'Figur 4' && ny.on === 'Figur 4' && fl.selO === 2 && fl.rk[2] === 'Figur 4' && omd && omd2.navn === 'Min figur' && omd2.row === 'Min figur' && /Min figur/.test(omd2.eg) && omd2.inp === 'Min figur', `Tom figur laver ${ny.navn} (valgt), ▲ flytter den op (${fl.rk.join(', ')}), og dobbeltklik + Enter omdøber til ${omd2.navn} (også i Egenskaber)`, JSON.stringify({ ny, fl, omd, omd2 }));
      /* træk i Live preview uden Flyt effekter */
      await klik('.fg34-row[data-fg34="0"]');
      const d = await side.evaluate(() => { const o = fase2.objekter.find(x => x.navn === 'Pige på stangen'); const c = document.getElementById('pv').getBoundingClientRect(); const e = pos.puls; return { fig: { x: c.x + o.pos.x * c.width, y: c.y + o.pos.y * c.height, pos: { ...o.pos }, id: o.id }, eff: { x: c.x + e.x * c.width, y: c.y + e.y * c.height, pos: { ...e } }, c: { x: c.x, y: c.y, w: c.width, h: c.height }, move: moveMode } });
      await side.mouse.move(d.fig.x, d.fig.y); await side.waitForTimeout(150); const cur = await side.evaluate(() => document.getElementById('pv').style.cursor);
      await side.mouse.down(); await side.mouse.move(d.fig.x - 150, d.fig.y - 80, { steps: 10 }); await side.mouse.up(); await side.waitForTimeout(600);
      const e1 = await side.evaluate(id => { const o = fase2.objekter.find(x => x.id === id); return { pos: { ...o.pos }, valgt: fase2.objekter[selO].id === id, status: document.getElementById('status').textContent, navn74: document.querySelector('.fe-navn74').textContent } }, d.fig.id);
      const dx = (d.fig.pos.x - e1.pos.x) * d.c.w, dy = (d.fig.pos.y - e1.pos.y) * d.c.h;
      /* en effekt kan ikke tages uden Flyt effekter */
      const langtFra = await side.evaluate(e => !fase2.objekter.some(o => o.synlig && Math.hypot((o.pos.x - e.x) * 1012, (o.pos.y - e.y) * 916) < 60), d.eff.pos);
      await side.mouse.move(d.eff.x, d.eff.y); await side.mouse.down(); await side.mouse.move(d.eff.x + 100, d.eff.y + 50, { steps: 6 }); await side.mouse.up(); await side.waitForTimeout(300);
      const e2 = await side.evaluate(() => ({ ...pos.puls }));
      T.tjek(!d.move && cur === 'grab' && Math.abs(dx - 150) < 6 && Math.abs(dy - 80) < 6 && e1.valgt && /Pige på stangen/.test(e1.navn74) && /flyttet til .* Ctrl\+Z fortryder/.test(e1.status) && (!langtFra || (e2.x === d.eff.pos.x && e2.y === d.eff.pos.y)), `træk i Live preview (uden Flyt effekter) flytter Pige på stangen ${Math.round(dx)} px til venstre og ${Math.round(dy)} px op, vælger hende, og skriver "${e1.status}"; effekten Lys-puls kan ikke tages uden Flyt effekter`, JSON.stringify({ d, cur, e1, e2, langtFra }));
      /* Ctrl+Z fortryder trækket */
      await side.waitForTimeout(900); await side.mouse.move(d.c.x + 20, d.c.y + 20); await side.keyboard.press('Control+z'); await side.waitForTimeout(600);
      const u = await side.evaluate(id => { const o = fase2.objekter.find(x => x.id === id); return { ...o.pos } }, d.fig.id);
      T.tjek(Math.abs(u.x - d.fig.pos.x) < .01 && Math.abs(u.y - d.fig.pos.y) < .01, `Ctrl+Z sætter figuren tilbage (${u.x.toFixed(2)}, ${u.y.toFixed(2)})`, JSON.stringify({ u, foer: d.fig.pos }));
      /* Morgenstjernen og Levende er uændrede */
      const ms = await side.evaluate(H => { const m0 = maps.length; document.querySelector('#fg34-ny').click(); document.querySelector('#fg34 [data-op="morgenstjerne"]').click(); const o = fase2.objekter[fase2.objekter.length - 1]; const regler = maps.slice(m0).map(m => [m.band, m.effect.split(':').slice(3).join(':'), m.thr, m.gain, m.att, m.rel].join('|'));
        const hsh = s => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7); const hash = {}; Object.keys(H).forEach(n => { try { hash[n] = hsh(eval(n).toString()) } catch (e) { hash[n] = 'mangler' } });
        return { navn: o.navn, form: o.lag[0].form, regler, hash, liv: !!document.querySelector('#fctl input[id^="lv-"],#fctl [data-lvfod]') || /Levende/.test(document.getElementById('fctl').textContent) } }, HASH);
      const forv = ['hmid|piglaengde|0.3|1|20|250', 'bas|storrelse|0.2|1|20|250', 'flux|drej|0.2|1|20|250', 'kick|skala|0.3|1|20|250', 'vokal|svaev|0.2|1|20|250', 'vokal|loeft|0.2|1|20|250'];
      const hashOk = Object.keys(HASH).every(n => ms.hash[n] === HASH[n]);
      T.tjek(ms.navn === 'Morgenstjerne' && ms.form === 'pigkugle' && ms.regler.join(';') === forv.join(';') && hashOk && ms.liv, `Morgenstjernen laves som før (pigkugle med de 6 regler), og Levende figurers kode er uændret (${Object.keys(HASH).join(', ')})`, JSON.stringify(ms));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
