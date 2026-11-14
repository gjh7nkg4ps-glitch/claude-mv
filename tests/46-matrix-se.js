/* Trin 4 · Det nye i v9.51: matrixen, trin 2a (se). Fase 2 i PLAN-NY-BRUGERFLADE.md.
   Knappen Noder · Matrix i Node-editorens værktøjslinje. Matrixen viser lydtræk i brug som rækker (i mapper efter musik) og mål i brug som
   kolonner (pr. figur og effekt-gruppe). En celle med en regel viser styrken som højde, lyser når reglen slår til, og et klik vælger reglen.
   Testen trykker med rigtige museklik og prøver tre skærmstørrelser: 1920 × 1080, 2560 × 1440 og 3840 × 2160. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (se)');
  console.log('46 · Matrixen, trin 2a: se · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(800); lay3Anvend('noder'); await vent(2500); });
      const kn = await side.$('#ne .mx-skift button[data-mx="1"]');
      T.tjek(!!kn && await kn.isVisible(), `${w} × ${h}: knappen Matrix står i Node-editorens værktøjslinje`);
      if (!kn) { await ctx.close(); continue; }
      await kn.click({ timeout: 3000 }); await side.waitForTimeout(900);
      const a = await side.evaluate(() => { const mx = document.getElementById('ne-mx'), fl = document.getElementById('ne-flade'), td = [...mx.querySelectorAll('td.mx-c')], st = td.map(x => x.getBoundingClientRect());
        const par = new Set(maps.map(m => m.band + '|' + m.effect)), mapper = [...mx.querySelectorAll('.mx-mappe th')].map(x => x.textContent), ord = mapper.map(x => SIG_MAPPER.indexOf(x));
        return { synlig: !mx.hidden && mx.offsetHeight > 100, noderSkjult: getComputedStyle(fl).display === 'none', raekker: mx.querySelectorAll('th.mx-lt').length, baand: new Set(maps.map(m => m.band)).size, kolonner: mx.querySelectorAll('th.mx-maal').length, maal: new Set(maps.map(m => m.effect)).size,
          medRegel: mx.querySelectorAll('td.mx-har').length, par: par.size, minB: Math.min(...st.map(r => r.width)), minH: Math.min(...st.map(r => r.height)), mapper, sorteret: ord.every((x, i) => x >= 0 && (i === 0 || x > ord[i - 1])), figurer: [...mx.querySelectorAll('.mx-fig')].map(x => x.textContent),
          tekst: mx.textContent, kp: document.getElementById('ne-kp').offsetHeight } });
      T.tjek(a.synlig && a.noderSkjult, `${w} × ${h}: et klik på Matrix viser matrixen i stedet for nodernes lærred (kontrolpanelet står stadig, ${a.kp} px)`);
      T.tjek(a.raekker === a.baand && a.kolonner === a.maal && a.medRegel === a.par, `${w} × ${h}: ${a.raekker} rækker (lydtræk i brug), ${a.kolonner} kolonner (mål i brug) og ${a.medRegel} celler med en regel`, `rækker ${a.raekker}/${a.baand}, kolonner ${a.kolonner}/${a.maal}, celler ${a.medRegel}/${a.par}`);
      T.tjek(a.minB >= 44 && a.minH >= 40, `${w} × ${h}: cellerne er mindst 44 × 40 px (${Math.round(a.minB)} × ${Math.round(a.minH)})`);
      T.tjek(a.sorteret && a.mapper.length > 0 && a.figurer.length > 1, `${w} × ${h}: rækkerne står i mapper efter musik (${a.mapper.join(', ')}), kolonnerne pr. figur og effekt-gruppe (${a.figurer.join(', ')})`);
      T.tjek(!/trin \d|af 16|W\d\d|v\d+\.\d|three|WebG/i.test(a.tekst), `${w} × ${h}: ingen udvikler-tekst i matrixen`);
      /* klik på en celle vælger reglen og viser den i kontrolpanelet */
      const celle = await side.$('#ne-mx td.mx-har'); await celle.click({ timeout: 3000 }); await side.waitForTimeout(600);
      const v = await side.evaluate(() => { const td = document.querySelector('#ne-mx td.mx-valgt'), n = NE2.N.get(NE2.valgt), kp = document.getElementById('ne-kp').textContent; return { valgt: !!td, regel: !!(n && n.kol === 'regel'), ikp: !!(n && n.m && kp.includes(neLtNavn(n.m.band))), antal: document.querySelectorAll('#ne-mx td.mx-valgt').length } });
      T.tjek(v.valgt && v.regel && v.ikp && v.antal === 1, `${w} × ${h}: et museklik på en celle vælger reglen, markerer cellen og viser reglen i kontrolpanelet`, JSON.stringify(v));
      if (w === 1920) {
        /* styrke som højde, slået fra, flere regler, Gate og lys */
        const d = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)), ud = {}, mx = document.getElementById('ne-mx'); const n = NE2.N.get(NE2.valgt), i = n.i, m = n.m; const td = () => document.querySelector('#ne-mx td.mx-valgt');
          Regler.retNr(i, { gain: 2 }); await vent(1300); const h2 = td().querySelector('.mx-s').offsetHeight; Regler.retNr(i, { gain: .5 }); await vent(1300); const h05 = td().querySelector('.mx-s').offsetHeight; ud.hoejde = h2 > h05 ? 'ok' : h2 + ' mod ' + h05;
          Regler.retNr(i, { off: true }); await vent(1300); ud.fra = td().classList.contains('mx-fra') ? 'ok' : 'ikke grå'; Regler.retNr(i, { off: undefined }); await vent(1300);
          Regler.tilfoej(Object.assign({}, m, { port: 'rms', portT: .5 })); await vent(1300); const t2 = [...mx.querySelectorAll('td.mx-har')].find(x => x.querySelector('b')); ud.flere = t2 && t2.querySelector('b').textContent === '2' ? 'ok' : 'intet tal'; ud.gate = t2 && t2.querySelector('s') ? 'ok' : 'ingen prik';
          Regler.sletNr(maps.length - 1); await vent(1300);
          /* lyset: generatoren spiller; mindst én celle skal lyse, lydtrækkenes bjælker skal bevæge sig, og alt slukker igen bagefter */
          document.getElementById('gp').click(); let lyste = 0, bjaelke = 0; for (let j = 0; j < 100; j++) { await vent(80); lyste = Math.max(lyste, mx.querySelectorAll('td.mx-slaar').length); bjaelke = Math.max(bjaelke, ...[...mx.querySelectorAll('th.mx-lt u i')].map(x => parseFloat(x.style.width) || 0)); if (lyste > 0 && bjaelke > 20 && j > 25) break }
          ud.lys = lyste > 0 ? 'ok' : 'ingen celle lyste, mens generatoren spillede'; ud.bjaelke = bjaelke > 20 ? 'ok' : 'lydtrækkenes bjælker bevægede sig ikke (' + bjaelke + ' %)';
          if (gPlaying) document.getElementById('gp').click(); await vent(1500);
          /* efter stop står motoren stille med sine sidste tal; hver celle skal lyse præcis, når motorens tal siger, at en af dens regler slår til */
          const skal = td => td.dataset.r.split('\u0001').some(k => { const n = NE2.N.get(k), m = n.m, i = n.i; if (m.off || m.fjernet) return false; const v = +R2M.v[i] || 0, u = +R2M.ud[i] || 0, thr = R2M.thr[i] != null ? +R2M.thr[i] : +m.thr; return neEgM(m) ? u > .05 : (v >= thr && u > .05) });
          let ens = false; for (let j = 0; j < 8 && !ens; j++) { ens = [...mx.querySelectorAll('td.mx-har')].every(td => td.classList.contains('mx-slaar') === skal(td)); if (!ens) await vent(120) }
          ud.somMotoren = ens ? 'ok' : 'cellernes lys passer ikke med motorens tal';
          return ud });
        const dårlig = Object.entries(d).filter(([k, x]) => x !== 'ok');
        T.tjek(!dårlig.length, 'søjlens højde følger styrken; en regel, der er slået fra, er grå; to regler i én celle viser tallet 2; Gate viser en prik; mens generatoren spiller, lyser celler, og lydtrækkenes bjælker bevæger sig; hver celle lyser præcis, når motorens tal siger, at dens regel slår til', dårlig.map(([k, x]) => k + ' → ' + x).join(' | '));
        /* overskrifterne står fast, når man ruller */
        const s = await side.evaluate(async () => { const mx = document.getElementById('ne-mx'); const stor = FORINDST.find(f => /pige/i.test(f.navn) && !f.auto) || FORINDST.find(f => !f.auto && f.id !== 'std'); brugFor(stor.id, true); await new Promise(r => setTimeout(r, 1800)); mx.scrollTop = 200; mx.scrollLeft = 300; await new Promise(r => setTimeout(r, 200)); const m = mx.getBoundingClientRect(), f = mx.querySelector('.mx-fig').getBoundingClientRect(), l = mx.querySelector('th.mx-lt') ? [...mx.querySelectorAll('th.mx-lt')].map(x => x.getBoundingClientRect().left) : []; return { rullet: mx.scrollTop > 0 || mx.scrollLeft > 0, top: Math.abs(f.top - m.top) < 3, venstre: l.every(x => Math.abs(x - m.left) < 3), st: mx.scrollTop + '/' + mx.scrollLeft, r: mx.querySelectorAll('th.mx-lt').length, k: mx.querySelectorAll('th.mx-maal').length } });
        T.tjek(s.top && s.venstre, `en stor opsætning (${s.r} rækker, ${s.k} kolonner): overskrifterne står fast øverst og til venstre, når man ruller (${s.st})`, JSON.stringify(s));
        /* tilbage til Noder, og valget huskes */
        await side.click('#ne .mx-skift button[data-mx="0"]'); await side.waitForTimeout(600);
        const t = await side.evaluate(() => ({ mx: document.getElementById('ne-mx').hidden, fl: getComputedStyle(document.getElementById('ne-flade')).display !== 'none' }));
        T.tjek(t.mx && t.fl, 'et klik på Noder viser nodernes lærred igen');
        await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(500); await side.reload(); await side.waitForTimeout(5000);
        const g = await side.evaluate(() => ({ mx: !document.getElementById('ne-mx').hidden, tryk: document.querySelector('#ne .mx-skift button[data-mx="1"]').getAttribute('aria-pressed') }));
        T.tjek(g.mx && g.tryk === 'true', 'valget huskes: efter genstart står matrixen der stadig');
        const o = await side.evaluate(async () => { const s = document.getElementById('ne41-vis'), gl = [...s.options].find(x => x.value === 'matrix').textContent; ne41Vis('strom'); await new Promise(r => setTimeout(r, 500)); const ude = document.getElementById('ne-mx').hidden && !document.getElementById('ne-vis').hidden; ne41Vis('kol', true); return { gl, ude } });
        T.tjek(o.gl === 'Matrix (gammel)' && o.ude, 'den gamle visning hedder Matrix (gammel), og vælger man en visning i Visning ▾, går man ud af matrixen', JSON.stringify(o));
      }
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
