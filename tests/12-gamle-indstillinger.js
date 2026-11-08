/* Fast del (fra v9.18): start programmet med gemte indstillinger fra ældre versioner.
   Gemte indstillinger har skjult fejl før (fx stoppede scriptet i v9.6 til v9.14, når Lyd i 3D var den gemte Scene-fane).
   Indstillingerne ligger i tests/gamle-indstillinger/vX_Y.json. De er lavet ved at bruge den gamle version fra git-historikken
   (Niveau 4, forudindstillinger, plads A og B, layout Byg, generator-sang, Lyd i 3D som Scene-fane, og hvor de fandtes:
   Lydkort-forbindelse, hysterese/hold/slew, taktslag Manuel, Router-visning og foldede bånd) og gemme hele localStorage.
   For hver: opstart uden fejl, scriptet kører til ende, plads A og B kan hentes, Router, Mapping, Mesh 3D og Øjet kan åbnes. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Gamle indstillinger'), DIR = path.join(__dirname, 'gamle-indstillinger');
  console.log('12 · Gamle indstillinger · ' + path.basename(fil));
  const filer = fs.readdirSync(DIR).filter(f => f.endsWith('.json')).sort((a, b) => a.localeCompare(b, 'da', { numeric: true }));
  const browser = await chromium.launch();
  try {
    for (const f of filer) {
      const d = JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8'));
      const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
      await ctx.addInitScript(ls => { if (!sessionStorage.getItem('__lagt')) { localStorage.clear(); for (const k in ls) localStorage.setItem(k, ls[k]); sessionStorage.setItem('__lagt', '1'); } }, d.localStorage);
      const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
      side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
      try {
        await side.goto('file://' + fil); await side.waitForTimeout(4500);
        const r = await side.evaluate(async () => {
          const ud = { ende: false }; try { ud.ende = !!D3ST && typeof R2 === 'object' && typeof STEM === 'object'; } catch (e) { ud.ende = false; }
          const vent = ms => new Promise(r => setTimeout(r, ms));
          ud.maps = maps.length; ud.fjernet = maps.filter(m => m.fjernet).length;
          for (const p of ['A', 'B']) { try { slotLoad(p); await vent(300); ud['plads' + p] = maps.length; } catch (e) { ud['plads' + p] = 'fejl: ' + e.message; } }
          for (const n of ['Node-editor', 'Lydkilde']) { const t = [...document.querySelectorAll('.dk-zone:has(#w33) .dk-fane')].find(b => b.textContent.trim() === n); if (t) { t.click(); await vent(700); } }
          for (const n of ['Mesh 3D', 'Øjet']) { const t = [...document.querySelectorAll('.dk-fane')].find(b => b.textContent.trim() === n); if (t) { t.click(); await vent(1500); } }
          ud.m3 = !!(M3 && M3.r); ud.oj = !!(OJ && OJ.r); return ud;
        });
        T.tjek(r.ende && !fejl.length && typeof r.pladsA === 'number' && typeof r.pladsB === 'number' && r.m3 && r.oj,
          `${d.version}: opstart uden fejl, ${r.maps} forbindelser${r.fjernet ? ' (' + r.fjernet + ' med Lydkort slået fra)' : ''}, plads A ${r.pladsA} og B ${r.pladsB}, Router, Mesh 3D og Øjet åbner`,
          (r.ende ? '' : 'scriptet stoppede · ') + fejl.slice(0, 2).join(' | '));
      } catch (e) { T.fejl(d.version + ': testen stoppede: ' + e.message.split('\n')[0]); }
      await ctx.close();
    }
  } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
