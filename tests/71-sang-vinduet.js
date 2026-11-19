/* Trin 4 · Det nye i v9.76 (trin S2): vinduet Sang med Lydkilde til venstre og fanerne Sang · Spor · Avanceret.
   Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160: 1 · Sang er én zone med vinduet Sang; Lydkilde (Lydfil, Generator, Lyd ind) står til venstre;
   fanen Sang har Bølgeform og sløjfe (Tidslinjens knapper og tegneflade), Spektrum (EQ's tegneflade, ⚙ Opsætning, forbindelsens skydere) og Taktslag
   (Halvér, 1×, Fordobl, Tap-tempo, Første slag nu fra Show); tegnefladerne fylder deres kort; fanen Spor har kortet 4 spor; fanen Avanceret har Toner og klang,
   Spektrum+ og Indstillinger for analysen (Normalisering, Lange sange, Adaptiv tærskel, Analysér igen, flueben), og Automatik viser "Ændres i Analyse";
   de fem gamle vinduer er skjult og står ikke i ＋; Søg/dkVis på et gammelt vindue åbner Sang på den rigtige fane; EQ og EQ+ er ikke scene-faner;
   rigtige klik: fanerne skifter (huskes), Normalisering Fast via kortet virker (og tilbage), Zoom + på bølgeformen virker, ⚙ Opsætning åbner panelet. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Sang-vinduet');
  console.log('71 · Vinduet Sang (S2) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(5000);
      const klik = async sel => { const p = await side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; try { el.scrollIntoView({ block: 'center' }) } catch (e) { } const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, w: q.width } }, sel); if (!p || !p.w) throw new Error('kan ikke klikke på ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(450) };
      await klik('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(1200);
      const vis = `id => { const e = document.getElementById(id); return !!e && e.offsetParent !== null && e.getBoundingClientRect().width > 0 }`;
      const r = await side.evaluate(() => { const vis = id => { const e = document.getElementById(id); return !!e && e.offsetParent !== null && e.getBoundingClientRect().width > 0 }; const cv = id => { const e = document.getElementById(id), k = e && e.parentElement; if (!e || !k) return null; const q = e.getBoundingClientRect(), p = k.getBoundingClientRect(); return { b: Math.round(q.width), h: Math.round(q.height), kb: Math.round(p.width), kh: Math.round(p.height), cw: e.width, ch: e.height } };
        const Z = [...document.querySelectorAll('.dk-zone')].filter(z => !z.hidden && z.getBoundingClientRect().width > 0);
        return { lay: set.lay3, zoner: Z.length, faner: Z.map(z => [...z.querySelectorAll('.dk-fane')].map(f => f.textContent.replace(/×$/, '').trim()).join('/')).join(' | '), sg: vis('sg'), venstre: ['lks-drop', 'lks-play', 'lks-lin'].map(vis), fane: set.sgFane, sangKort: [...document.querySelectorAll('#sg .sg-fane[data-sg="sang"] .sg-kort h4')].map(x => x.textContent), tl: cv('tl'), eq: cv('eq'), tlbar: vis('tl-zi') && vis('tl-loop'), eqKn: vis('eq-ops') && vis('eqmap'), takt: ['show-halv', 'show-en', 'show-dobbelt', 'show-tap', 'show-foerste'].map(vis), gamle: ['w1', 'w3', 'w7', 'w24', 'w31'].map(id => document.getElementById(id).hidden && !document.getElementById(id).closest('.dk-zone')), navne: Object.keys(DK_NAVN).filter(k => ['w1', 'w3', 'w7', 'w24', 'w31'].includes(k)), sc: SC_FANER.map(f => f[0]).filter(k => k === 'w3' || k === 'w24'), spor: !!document.querySelector('#sg .sg-fane[data-sg="spor"] .lks-stem'), avKort: [...document.querySelectorAll('#sg .sg-fane[data-sg="avanceret"] .sg-kort h4')].map(x => x.textContent) } });
      T.tjek(r.lay === 'ao-sang' && r.zoner === 1 && r.faner === 'Analyse' /* v9.98 */ && r.sg && r.venstre.every(Boolean) && r.gamle.every(Boolean) && r.navne.length === 0 && r.sc.length === 0, `${w} × ${h}: 1 · Sang er én zone med vinduet Sang; Lydkilde står til venstre (Lydfil, Generator, Lyd ind); Tidslinje, EQ, Analyse, EQ+ og Lydkilde er skjult, står ikke i ＋ og er ikke scene-faner`, JSON.stringify(r));
      const fylder = c => c && c.b >= c.kb - 2 && c.h >= c.kh - 2 && c.cw === c.b && c.ch === c.h && c.h > 60;
      T.tjek(r.fane === 'sang' && r.sangKort.join(',') === 'Bølgeform og sløjfe,Spektrum,Niveau,Taktslag' /* v9.78: Niveau */ && fylder(r.tl) && fylder(r.eq) && r.tlbar && r.eqKn && r.takt.every(Boolean) && r.spor && r.avKort.join(',') === 'Lyd over tid,Toner og klang,Stereo,Spektrum+,Detektion,Indstillinger for analysen' /* v9.95: Detektion */ /* v9.77: Lyd over tid; v9.79: Stereo */, `${w} × ${h}: fanen Sang har ${r.sangKort.join(', ')}; tegnefladerne fylder deres kort (bølgeform ${r.tl && r.tl.b} × ${r.tl && r.tl.h}, spektrum ${r.eq && r.eq.b} × ${r.eq && r.eq.h}); Tidslinjens knapper, ⚙ Opsætning, forbindelsens skydere og Shows tempoknapper er flyttet ind; Spor har 4 spor; Avanceret har ${r.avKort.join(', ')}`, JSON.stringify(r));
      /* Avanceret: tegnefladerne og Indstillinger for analysen; Automatik siger "Ændres i Analyse" */
      await klik('#sg [data-sgf="avanceret"]'); await side.waitForTimeout(700);
      const a = await side.evaluate(() => { const cv = id => { const e = document.getElementById(id), k = e && e.parentElement; const q = e.getBoundingClientRect(), p = k.getBoundingClientRect(); return { b: Math.round(q.width), h: Math.round(q.height), kb: Math.round(p.width), kh: Math.round(p.height), cw: e.width, ch: e.height } }; return { fane: set.sgFane, an: cv('an'), eqp: cv('eqp'), eqpKn: !!document.getElementById('eqp-vf') && document.getElementById('eqp-vf').offsetParent !== null, rk: [...document.querySelectorAll('#sg [data-sgk="indst"] .sg-r b')].map(x => x.textContent), knapper: document.querySelectorAll('#sg [data-sgk="indst"] [data-sgau]').length, flueben: document.querySelectorAll('#sg [data-sgk="indst"] [data-audel]').length, gemt: JSON.parse(localStorage.getItem('rytme-set')).sgFane } });
      await side.evaluate(() => { try { auAaben(true) } catch (e) { } }); await side.waitForTimeout(500);
      const au = await side.evaluate(() => { const p = document.getElementById('ne65-pan'); const rows = [...p.querySelectorAll('tr[data-aur]')].map(r => r.dataset.aur + ':' + (r.querySelector('[data-au="sang"]') ? 'sang' : 'knap')); const b = p.querySelector('[data-au="sang"]'); return { rows, knap: b && b.textContent } });
      await side.evaluate(() => { try { auAaben(false) } catch (e) { } });
      T.tjek(a.fane === 'avanceret' && a.gemt === 'avanceret' && fylder(a.an) && fylder(a.eqp) && a.eqpKn && a.rk.join(',') === 'Normalisering,Lange sange,Adaptiv tærskel,Sangens analyse' && a.knapper >= 7 && a.flueben === 4 && ['norm', 'lokal', 'tilpas', 'ana'].every(k => au.rows.includes(k + ':sang')) && au.knap === 'Ændres i Analyse', `${w} × ${h}: Avanceret (huskes) har Toner og klang (${a.an.b} × ${a.an.h}) og Spektrum+ (${a.eqp.b} × ${a.eqp.h}) med deres knapper, og Indstillinger for analysen (${a.rk.join(', ')}, ${a.flueben} flueben); Automatik viser "${au.knap}" på de fire linjer`, JSON.stringify({ a, au }));
      if (w !== 1920) { T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n')); await ctx.close(); continue }
      /* Normalisering via kortet (rigtige klik) */
      const n0 = await side.evaluate(() => auTilstand().norm);
      await klik('#sg [data-sgk="indst"] [data-sgau="norm"][data-v="0"]'); await side.waitForTimeout(500); const n1 = await side.evaluate(() => ({ norm: auTilstand().norm, on: document.querySelector('#sg [data-sgau="norm"][data-v="0"]').classList.contains('on') }));
      await klik('#sg [data-sgk="indst"] [data-sgau="norm"][data-v="1"]'); await side.waitForTimeout(500); const n2 = await side.evaluate(() => auTilstand().norm);
      T.tjek(n0 === 'auto' && n1.norm === 'fast' && n1.on && n2 === 'auto', `Normalisering skiftes i kortet: ${n0} → ${n1.norm} → ${n2}`, JSON.stringify({ n0, n1, n2 }));
      /* dkVis på et gammelt vindue åbner Sang på den rigtige fane; Spor */
      await side.evaluate(() => lay3Anvend('ao-scene')); await side.waitForTimeout(900);
      const v1 = await side.evaluate(async () => { dkVis('w7'); await new Promise(r => setTimeout(r, 500)); return { fane: set.sgFane, synlig: document.getElementById('sg').offsetParent !== null, an: document.getElementById('an').offsetParent !== null } });
      const v2 = await side.evaluate(async () => { dkVis('w1'); await new Promise(r => setTimeout(r, 500)); return { fane: set.sgFane, tl: document.getElementById('tl').offsetParent !== null } });
      await klik('#sg [data-sgf="spor"]'); const sp = await side.evaluate(() => ({ fane: set.sgFane, stem: document.querySelector('#stem-brug') && document.querySelector('#stem-brug').offsetParent !== null, slots: document.querySelectorAll('#sg .sg-fane[data-sg="spor"] .stem-slot').length }));
      T.tjek(v1.fane === 'avanceret' && v1.synlig && v1.an && v2.fane === 'sang' && v2.tl && sp.fane === 'spor' && sp.stem && sp.slots === 4, `dkVis('w7') åbner Sang → Avanceret (Toner og klang kan ses), dkVis('w1') → Sang (bølgeformen kan ses); fanen Spor viser kortet 4 spor (${sp.slots} spor)`, JSON.stringify({ v1, v2, sp }));
      /* Zoom + og ⚙ Opsætning virker på deres nye plads */
      await klik('#sg [data-sgf="sang"]'); const z0 = await side.evaluate(() => !!TLS.foelg);
      await klik('#tl-foelg'); const z1 = await side.evaluate(() => !!TLS.foelg); await klik('#tl-foelg'); const z2 = await side.evaluate(() => !!TLS.foelg);
      await klik('#eq-ops'); const op = await side.evaluate(() => ({ aaben: !document.getElementById('eq-panel').hidden, synlig: document.getElementById('eq-tilpas').offsetParent !== null })); await klik('#eq-ops');
      T.tjek(z0 && !z1 && z2 && op.aaben && op.synlig, `Tidslinjens knapper virker på deres nye plads (Følg: ${z0} → ${z1} → ${z2}), og ⚙ Opsætning åbner Adaptiv tærskel-panelet i kortet Spektrum`, JSON.stringify({ z0, z1, z2, op }));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
