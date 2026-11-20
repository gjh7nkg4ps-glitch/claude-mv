/* Trin 4 · Det nye i v9.83 (trin 7c): død kode er fjernet. Ved tre skærmstørrelser: programmet starter uden fejl; Lyd i 3D (w9), Idé-galleri (w22),
   Enkel tilstand (#enkel, #enkelbtn) og deres funktioner findes ikke i filen; Mappings rester (syncRow, stakHtml, taktLinje, stemLinje, fjernetBanner,
   fjernetHvad, STAK_AABEN) er væk, mens stakFor og Styrke brugt virker; Udgangsvinduet viser har fire valg, og et gemt valg af Øjet huskes ved start
   (rettet i v9.83); ordlisten har ingen opslag under Lyd i 3D; alle færdige opsætninger kan hentes uden fejl, og reglerne i Standard regner som før
   (styrken brugt = gain × samlet styrke); filen er mindre end v9.82. */
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Død kode');
  console.log('78 · Død kode fjernet (7c) · ' + path.basename(fil));
  const st = fs.statSync(fil).size; const html = fs.readFileSync(fil, 'utf8'); T.tjek(!/LYD I 3D ==========/.test(html) && !/IDÉ-GALLERI ==========/.test(html) && !/function enkelTempo\(/.test(html), `den døde kode fra 7c (Lyd i 3D, Idé-galleri, Enkel tilstand) er stadig væk (${st} bytes; v9.83 var 6 391 297, og filen må vokse med nye blokke siden)`, String(st));
  const tekst = fs.readFileSync(fil, 'utf8');
  const rester = ['function d3Vis(', 'function galVis(', 'function enkelSync(', 'function syncRow(', 'function stakHtml(', 'function taktLinje(', 'function stemLinje(', 'function fjernetBanner(', 'function fjernetHvad(', 'const STAK_AABEN', 'id="w9"', 'id="w22"', 'id="enkel"', 'id="enkelbtn"', 'IDÉ-GALLERI ====', 'LYD I 3D ====', '<option value="d3">'].filter(x => tekst.includes(x));
  T.tjek(rester.length === 0, `ingen rester i filen af Lyd i 3D, Idé-galleri, Enkel tilstand og Mappings rækker`, rester.join(', '));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push(m.text()) });
      /* et gemt valg af Øjet i Udgangsvinduet viser skal huskes (før v9.83 blev det sat til Live preview) */
      await side.addInitScript(() => { try { if (!localStorage.getItem('rytme-set')) localStorage.setItem('rytme-set', JSON.stringify({ udkilde: 'oeje' })) } catch (e) { } });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const r = await side.evaluate(() => {
        const u = ['d3Vis', 'd3Synlig', 'drawD3', 'D3ST', 'galVis', 'galUI', 'galSynlig', 'GAL', 'enkelSync', 'enkelNorm', 'enkelTempo', 'syncRow', 'stakHtml', 'taktLinje', 'stemLinje', 'fjernetBanner', 'fjernetHvad', 'STAK_AABEN'].filter(n => { try { return typeof eval(n) !== 'undefined' } catch (e) { return false } });
        const el = ['w9', 'w22', 'enkel', 'enkelbtn', 'd3btn', 'galbtn', 'tb-gen', 'ops-gal', 'mb-auto-gal', 'gal', 'd3'].filter(id => document.getElementById(id));
        const uk = document.getElementById('ud-kilde');
        const ord = (typeof ORDBOG !== 'undefined' && Array.isArray(ORDBOG)) ? ORDBOG.filter(o => o[0] === 'Lyd i 3D' || o[1] === 'Enkel tilstand').length : -1;
        return { u, el, udkilde: set.udkilde, valg: uk ? [...uk.options].map(o => o.value) : null, ord, bruger: typeof stakFor === 'function' && typeof taktValg === 'function' && typeof stemValg === 'function' && typeof taktGrund === 'function' && typeof stemGrund === 'function' && typeof stakTal === 'function' && typeof renderAudit === 'undefined' /* v9.93: renderAudit er fjernet; corr bruges af autoListe */ && typeof corr === 'function' };
      });
      T.tjek(r.u.length === 0 && r.el.length === 0, `${w} × ${h}: funktionerne og elementerne findes ikke (${r.u.join(',')} ${r.el.join(',')})`, JSON.stringify(r));
      T.tjek(r.udkilde === 'oeje' && r.valg && r.valg.join(',') === 'pv,mesh,mesh3d,oeje', `${w} × ${h}: Udgangsvinduet viser husker Øjet og har fire valg (${r.valg})`, JSON.stringify(r));
      T.tjek(r.ord === 0 && r.bruger, `${w} × ${h}: ordlisten har intet under Lyd i 3D og Enkel tilstand (${r.ord}); stakFor, taktValg, stemValg, taktGrund, stemGrund, stakTal og corr findes stadig (renderAudit er væk fra v9.93)`, JSON.stringify(r));
      /* alle opsætninger kan hentes; Standard regner som før */
      const o = await side.evaluate(async () => {
        const vent = ms => new Promise(r => setTimeout(r, ms)); const fejl = [];
        for (const f of FORINDST) { try { brugFor(f.id, true); await vent(60) } catch (e) { fejl.push(f.id + ': ' + e.message) } }
        brugFor('std', true); await vent(300);
        const st = maps.map((m, i) => { const S = stakFor(m, i); return { id: m.id, styrke: S.styrke, lag: S.lag.length, forventet: +m.gain * +gmaster } });
        const ok = st.every(x => Math.abs(x.styrke - x.forventet) < 1e-9);
        return { fejl, n: FORINDST.length, regler: st.length, ok, st: st.slice(0, 3) };
      });
      T.tjek(o.fejl.length === 0 && o.n >= 7 /* v9.97 */, `${w} × ${h}: alle ${o.n} færdige opsætninger kan hentes uden fejl`, o.fejl.join('\n'));
      T.tjek(o.ok && o.regler >= 10, `${w} × ${h}: Styrke brugt for Standards ${o.regler} regler = gain × samlet styrke (ingen følsomhed mere)`, JSON.stringify(o.st));
      /* Node-editorens kontrolpanel viser Styrke brugt for en valgt regel */
      await side.click('#lay3 [data-lay3="ao-regler"]'); await side.waitForTimeout(1500);
      const kp = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); mxSaet(false, true); await vent(900); const n = [...NE2.N.values()].find(x => x.kol === 'regel' || /^r:/.test(x.key)); if (!n) return { ingen: true, kol: [...new Set([...NE2.N.values()].map(x => x.kol))] }; neVaelg(n.key); await vent(600); const txt = (document.getElementById('ne-kp') || document.body).textContent.replace(/\s+/g, ' '); return { har: /Styrke brugt/.test(txt), tekst: txt.slice(0, 200) } });
      T.tjek(!kp.ingen && kp.har, `${w} × ${h}: kontrolpanelet viser Styrke brugt for en valgt regel`, JSON.stringify(kp).slice(0, 400));
      if (w === 1920) await side.screenshot({ path: path.join(__dirname, 'ud', 'v9_83-7c.png') }).catch(() => { });
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
