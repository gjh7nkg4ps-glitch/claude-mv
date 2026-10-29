/* Trin 3 og 4 · Opstart og den faste testpakke i en testbrowser (Playwright).
   Opstart: ingen pageerror og ingen konsolfejl.
   Fast testpakke: alle forudindstillinger (FORINDST, brugFor) · alle 5 layouts (lay3Anvend) uden overlap
   mellem synlige vinduer · Mesh 3D og Øjet starter · gem og hent en plads (slotSave/slotLoad) ·
   tilføj og fjern en forbindelse · Arbejdsfeltets faner (ingen gammel Generator-fane).
   Med --uden-lyd springes analysen af testlydfilen over; så testes de forudindstillinger, der kræver en analyseret sang, ikke.
   Skærmbilleder gemmes i tests/ud/. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg, { udenLyd = false } = {}) {
  const fil = findFil(arg), T = tæller('Browser'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('3 · Browser · ' + path.basename(fil) + (udenLyd ? ' (uden lyd)' : ''));
  const browser = await chromium.launch();
  const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  side.on('dialog', d => d.dismiss().catch(() => {}));
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  try {
    /* Opstart */
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    const titel = await side.title();
    T.tjek(titel.includes(path.basename(fil).match(/v(\d+)_(\d+)/).slice(1).join('.')), `filen er åbnet: "${titel}"`);
    let f = nyeFejl(); T.tjek(!f.length, 'opstart uden fejl', f.slice(0, 3).join(' | '));
    await side.screenshot({ path: path.join(UD, 'opstart.png') });

    /* Opstart med hver Scene-fane gemt som valgt (v9.15): før stoppede scriptet, hvis Lyd i 3D var gemt, og der kom ingen grafik */
    const scFaner = await side.evaluate(() => SC_FANER.map(f => f[0]));
    const stopFejl = [];
    for (const id of scFaner) {
      await side.evaluate(id => { const s = JSON.parse(localStorage.getItem('rytme-set') || '{}'); s.scene = s.scene || {}; s.scene.aktiv = id; s.niv = 4; localStorage.setItem('rytme-set', JSON.stringify(s)); }, id);
      await side.reload(); await side.waitForTimeout(3000);
      const ok = await side.evaluate(() => { try { return !!D3ST && typeof R2 === 'object'; } catch (e) { return false; } });
      const ff = nyeFejl(); if (ff.length || !ok) stopFejl.push(id + ': ' + (ff[0] || 'scriptet stoppede'));
    }
    T.tjek(!stopFejl.length, `opstart uden fejl med hver af de ${scFaner.length} Scene-faner gemt som valgt (${scFaner.join(', ')})`, stopFejl.slice(0, 3).join(' | '));
    await side.evaluate(() => localStorage.clear()); await side.reload(); await side.waitForTimeout(3500); nyeFejl();

    /* Arbejdsfeltets faner */
    const faner = await side.evaluate(() => ({
      plan: FG.lyd.faner.map(x => x[1]),
      synlige: [...document.querySelectorAll('#w25 .fg-faner [role=tab], #w25 .fg-faner button')].map(b => b.textContent.trim()).filter(t => !/Riv løs/.test(t)),
      w4: !!document.getElementById('w4'),
    }));
    T.tjek(!faner.plan.some(n => /Generator/i.test(n)) && !faner.synlige.some(n => /Generator/i.test(n)), `ingen Generator-fane i Arbejdsfeltet (faner: ${faner.synlige.join(', ')}; i alt: ${faner.plan.join(', ')})`);
    T.tjek(faner.w4, 'Generator-vinduet (W4) findes stadig');
    const adv = await side.evaluate(async () => { const b = document.getElementById('lks-adv'); if (!b) return 'ingen knap'; b.click(); await new Promise(r => setTimeout(r, 400));
      const w = document.getElementById('w4'), q = w.getBoundingClientRect(); const ok = getComputedStyle(w).display !== 'none' && q.width > 0;
      const x = w.querySelector('.zon-luk'); if (x) x.click(); return ok ? 'ok' : 'W4 blev ikke vist'; });
    T.tjek(adv === 'ok', '"Avanceret …" i Lydkilde åbner Generator-vinduet (W4)', adv);

    /* Testlydfil og analyse */
    if (!udenLyd) {
      const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')), 'testlyd-120bpm.wav'));
      const t0 = Date.now();
      await side.setInputFiles('#file', wav);
      await side.waitForFunction(() => typeof F !== 'undefined' && F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
      const P = await side.evaluate(() => ({ bpm: SHOWPROFIL && SHOWPROFIL.bpm, toneart: SHOWPROFIL && SHOWPROFIL.toneart && SHOWPROFIL.toneart.navn }));
      T.ok(`testlydfilen er analyseret (${Math.round((Date.now() - t0) / 1000)} s): ${P.bpm ? Math.round(P.bpm * 10) / 10 + ' BPM' : 'intet tempo'}, toneart ${P.toneart || 'ingen'}`);
      T.tjek(P.bpm && Math.abs(P.bpm - 120) < 2, 'tempoet er fundet til cirka 120 BPM (testfilen er lavet med 120)', String(P.bpm));
      f = nyeFejl(); T.tjek(!f.length, 'analysen uden fejl', f.slice(0, 3).join(' | '));
    }

    /* Alle forudindstillinger */
    const ids = await side.evaluate(() => FORINDST.map(f => [f.id, !!f.auto]));
    const dårlige = [];
    for (const [id, auto] of ids) {
      if (auto && udenLyd) continue;
      /* Fejl, eller forudindstillingen blev ikke indlæst (så er "active" ikke sat til den). */
      const r = await side.evaluate(id => { try { const f = FORINDST.find(x => x.id === id); brugFor(id, true); const vent = f.auto ? 'f:' + id : (f.aktiv || 'f:' + id); return active === vent ? null : 'blev ikke indlæst (' + document.getElementById('status').textContent.slice(0, 80) + ')'; } catch (e) { return e.message; } }, id);
      await side.waitForTimeout(150);
      const ff = nyeFejl(); if (r || ff.length) dårlige.push(id + ': ' + (r || ff[0]));
    }
    const antal = ids.filter(([, a]) => !(a && udenLyd)).length;
    T.tjek(!dårlige.length, `alle ${antal} forudindstillinger uden fejl` + (udenLyd ? ` (${ids.length - antal} kræver lyd, sprunget over)` : ''), dårlige.slice(0, 3).join(' | '));

    /* Alle 5 layouts uden overlap */
    const lay = await side.evaluate(() => LAY3.map(x => x[0]));
    T.tjek(lay.length === 5, `der er 5 layouts (${lay.join(', ')})`);
    for (const k of lay) {
      await side.evaluate(k => lay3Anvend(k), k); await side.waitForTimeout(500);
      const r = await side.evaluate(() => {
        /* Synlige vinduer: øverste niveau i arbejdsfladen (#ws), vist og med en størrelse. Paneler ovenpå (zon-pop) tæller ikke. */
        const v = [...document.querySelectorAll('#ws > .win')].filter(w => { const cs = getComputedStyle(w), q = w.getBoundingClientRect(); return !w.hidden && cs.display !== 'none' && cs.visibility !== 'hidden' && q.width > 4 && q.height > 4 && !w.classList.contains('zon-pop'); })
          .map(w => { const q = w.getBoundingClientRect(); return { id: w.id, x: q.left, y: q.top, r: q.right, b: q.bottom }; });
        const ov = [];
        for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) { const a = v[i], b = v[j]; const dx = Math.min(a.r, b.r) - Math.max(a.x, b.x), dy = Math.min(a.b, b.b) - Math.max(a.y, b.y); if (dx > 1 && dy > 1) ov.push(`${a.id}/${b.id} (${Math.round(dx)}×${Math.round(dy)} px)`); }
        return { vin: v.map(x => x.id), ov };
      });
      const ff = nyeFejl();
      T.tjek(!r.ov.length && !ff.length, `layout "${k}": ${r.vin.length} synlige vinduer (${r.vin.join(', ')}), intet overlap`, r.ov.concat(ff).slice(0, 3).join(' | '));
      await side.screenshot({ path: path.join(UD, `layout-${k}.png`) });
    }
    await side.evaluate(() => lay3Anvend('overblik')); await side.waitForTimeout(300);

    /* Mesh 3D og Øjet starter */
    for (const [w, navn, obj] of [['w28', 'Mesh 3D', 'M3'], ['w29', 'Øjet', 'OJ']]) {
      const ok = await side.evaluate(async ([w, obj]) => {
        const tab = [...document.querySelectorAll('#w23 [role=tab], #w23 .sc-faner button')].find(b => b.dataset && (b.dataset.w === w || b.dataset.fane === w || b.dataset.id === w));
        if (tab) tab.click(); else sbAabn(w);
        for (let i = 0; i < 40; i++) { await new Promise(r => setTimeout(r, 250)); if (window[obj] ? window[obj].r : eval(obj).r) return true; }
        return false;
      }, [w, obj]);
      const ff = nyeFejl();
      T.tjek(ok && !ff.length, `${navn} starter (WebGL-tegner lavet)`, (ok ? '' : 'ingen tegner efter 10 s ') + ff.slice(0, 2).join(' | '));
      await side.screenshot({ path: path.join(UD, `${navn === 'Øjet' ? 'oejet' : 'mesh3d'}.png`) });
    }

    /* Gem og hent en plads */
    const slot = await side.evaluate(() => {
      const før = JSON.stringify(maps); if (slotSave('A', 'testpakke') === false) return 'kunne ikke gemme';
      const gemt = maps.length; maps.length = 0; renderMaps(); slotLoad('A');
      return maps.length === gemt && JSON.stringify(maps) === før ? 'ok' : `hentede ${maps.length} forbindelser, gemte ${gemt}`;
    });
    let ff = nyeFejl(); T.tjek(slot === 'ok' && !ff.length, 'gem og hent plads A (slotSave/slotLoad) giver de samme forbindelser', [slot].concat(ff).join(' | '));

    /* Tilføj og fjern en forbindelse */
    const forb = await side.evaluate(async () => {
      const n0 = maps.length; document.getElementById('add').click(); await new Promise(r => setTimeout(r, 200));
      const n1 = maps.length; const rk = document.querySelectorAll('#maps .row'); const del = rk[rk.length - 1] && rk[rk.length - 1].querySelector('[data-del]');
      if (del) del.click(); await new Promise(r => setTimeout(r, 200));
      return { n0, n1, n2: maps.length, del: !!del };
    });
    ff = nyeFejl();
    T.tjek(forb.n1 === forb.n0 + 1 && forb.del && forb.n2 === forb.n0 && !ff.length, `tilføj og fjern en forbindelse (${forb.n0} → ${forb.n1} → ${forb.n2})`, ff.join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/');
  return T.slut();
}
if (require.main === module) kør(process.argv.slice(2).find(a => !a.startsWith('--')), { udenLyd: process.argv.includes('--uden-lyd') }).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
