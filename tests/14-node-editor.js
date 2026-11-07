/* Trin 4 · Det nye i v9.19: Node-editoren, trin 1 (lærredet, kolonnerne og temaet). Se docs/PLAN-NODE-EDITOREN.md.
   Uden browser: temaet i programmet er det samme som docs/node-editoren/tema-warm-analog.json; der står ingen farvekoder
   i Node-editorens kode og stil (alle farver kommer fra temaet); de 6 skrifttyper ligger i filen.
   I browseren: fanen Node-editor i Arbejdsfeltet; de 9 kolonner i temaets farver og bredder; zoom (musehjul, + og −), træk,
   piletaster og Tilpas; visningen huskes efter genstart; layoutet Noder (med og uden zone-tilstand); maps ændres ikke;
   gamle indstillinger fra v9.18 (uden set.ne) åbner Node-editoren tilpasset.
   Skærmbilleder: tests/ud/node-editor-noder.png og tests/ud/node-editor-zoom.png (deviceScaleFactor 2). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { ROD, findFil, tæller } = require('./faelles');

/* Teksten mellem to markeringer i filen */
function uddrag(html, fra, til) { const a = html.indexOf(fra), b = html.indexOf(til, a); return a < 0 || b < 0 ? null : html.slice(a, b + til.length); }
const FARVEKODE = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:white|black|red|orange|yellow|gold|pink|purple|violet|magenta|gr[ae]y|silver|blue|green|brown)(?![\w-])/;

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 1)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('14 · Node-editor, trin 1 · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');

  /* 1 · Temaet er en kopi af filen i docs */
  const temaFil = path.join(ROD, 'docs', 'node-editoren', 'tema-warm-analog.json');
  const m = html.match(/\n<script type="application\/json" id="tema-warm-analog">\n([^]*?)\n<\/script>/);
  let tema = null;
  try { tema = JSON.parse(m[1]); } catch (e) { tema = null; }
  const docsTema = JSON.parse(fs.readFileSync(temaFil, 'utf8'));
  T.tjek(!!tema, 'temaet ligger i filen som <script type="application/json" id="tema-warm-analog">');
  T.tjek(tema && JSON.stringify(tema) === JSON.stringify(docsTema), 'temaet i programmet er det samme som docs/node-editoren/tema-warm-analog.json');

  /* 2 · Ingen farvekoder i Node-editorens kode og stil */
  const kode = uddrag(html, '/* ========== v9.19: NODE-EDITOR (TRIN 1) ==========', '/* ========== SLUT: NODE-EDITOR (TRIN 1) ========== */');
  const stilM = html.match(/\n<style id="ne-stil">([^]*?)<\/style>/);
  T.tjek(!!kode && !!stilM, 'Node-editorens blok og <style id="ne-stil"> findes');
  for (const [navn, tekst] of [['koden', kode || ''], ['stilen', stilM ? stilM[1] : '']]) {
    const linjer = tekst.split('\n').map((l, i) => [i + 1, l.replace(/\/\*[^]*?\*\//g, '')]).filter(([, l]) => FARVEKODE.test(l));
    T.tjek(tekst && !linjer.length, `ingen farvekoder i ${navn} (alle farver er --ne-… fra temaet)`, linjer.slice(0, 3).map(([n, l]) => 'linje ' + n + ': ' + (l.match(FARVEKODE) || [''])[0]).join(', '));
  }
  const brugt = new Set(((stilM ? stilM[1] : '') + (kode || '')).match(/--ne-[A-Za-z0-9-]+/g) || []);
  const fra = new Set(); (function gaa(o, s) { if (o && typeof o === 'object') Object.keys(o).forEach(k => gaa(o[k], s.concat(k))); else fra.add('--ne-' + s.join('-')); })(docsTema, []);
  const ukendt = [...brugt].filter(v => !fra.has(v) && !/^--ne-kolonne-'?$/.test(v));
  T.tjek(!ukendt.length, `alle ${brugt.size} CSS-variabler, stilen bruger, findes i temaet`, ukendt.join(', '));

  /* 3 · Skrifttyperne ligger i filen */
  const sk = (html.match(/\n<style id="ne-skrift">([^]*?)<\/style>/) || [])[1] || '';
  const ff = [...sk.matchAll(/font-family:'([^']+)';font-style:(\w+);font-weight:(\d+)/g)].map(x => x[1] + ' ' + x[2] + ' ' + x[3]);
  T.tjek(ff.length === 6 && ['Orbitron normal 800', 'Orbitron normal 900', 'Exo 2 italic 900', 'IBM Plex Sans normal 400', 'IBM Plex Sans normal 500', 'IBM Plex Sans normal 600'].every(x => ff.includes(x)), 'de 6 skrifttyper ligger i filen (Orbitron 800/900, Exo 2 900 kursiv, IBM Plex Sans 400/500/600)', ff.join(', '));
  T.tjek(!/url\((?!data:)/.test(sk), 'skrifttyperne hentes ikke fra internettet');
  T.tjek([docsTema.skrift.overskrift.familie, docsTema.skrift.tal.familie, docsTema.skrift.tekst.familie].every(f => ff.some(x => x.startsWith(f + ' '))), 'skrifttypernes navne er de samme som i temaet');

  const browser = await chromium.launch();
  try {
    /* 4 · I browseren */
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
    side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const før = await side.evaluate(() => JSON.stringify(maps));
    const r = await side.evaluate(async () => {
      const vent = ms => new Promise(r => setTimeout(r, ms));
      const ud = { fane: FG.lyd.faner.some(f => f[0] === 'w33' && f[1] === 'Node-editor'), byg: NE.byg };
      lay3Anvend('noder'); await vent(900);
      const fl = document.getElementById('ne-flade'), b = fl.getBoundingClientRect();
      ud.flade = [Math.round(b.width), Math.round(b.height)];
      ud.hoveder = [...document.querySelectorAll('#ne-hoveder .ne-hoved')].map(h => ({ k: h.dataset.kol, navn: h.querySelector('.ne-hnavn').textContent, farve: getComputedStyle(h).color, linje: getComputedStyle(h.querySelector('.ne-hnavn')).borderBottomColor, font: getComputedStyle(h.querySelector('.ne-hnavn')).fontFamily }));
      ud.kol = NE.kol.map(c => [c.k, c.w, c.x]);
      ud.kp = document.querySelector('#ne-kp .ne-kp-tekst').textContent;
      ud.tilpas = { z: NE.z, x: NE.x, bredde: NE.bredde, W: fl.clientWidth, tilpas: NE.tilpas };
      ud.fonte = [document.fonts.check('800 12px Orbitron'), document.fonts.check("italic 900 12px 'Exo 2'"), document.fonts.check("400 12px 'IBM Plex Sans'")];
      ud.baggrund = getComputedStyle(document.getElementById('ne')).backgroundImage;
      return ud;
    });
    T.tjek(r.fane && r.byg, 'fanen Node-editor findes i Arbejdsfeltet, og lærredet er bygget');
    T.tjek(r.flade[0] > 600 && r.flade[1] > 150, `lærredet kan ses (${r.flade.join(' × ')} px)`);
    const hex = h => { const n = parseInt(h.slice(1), 16); return `rgb(${n >> 16}, ${(n >> 8) & 255}, ${n & 255})`; };
    const navne = ['Ikke i brug', 'Lydkilde', 'FFT', 'Analyse', 'Lydtræk', 'Regel', 'Figur', 'Mål', 'Scene'];
    T.tjek(r.hoveder.length === 9 && r.hoveder.every((h, i) => h.navn === navne[i]), 'de 9 kolonner i rækkefølge: ' + r.hoveder.map(h => h.navn).join(', '));
    const forkert = r.hoveder.filter(h => h.farve !== hex(docsTema.kolonne[h.k]) || h.linje !== hex(docsTema.kolonne[h.k]));
    T.tjek(!forkert.length, 'hver kolonne har sin farve fra temaet (tekst og streg)', forkert.map(h => h.navn + ' ' + h.farve).join(', '));
    T.tjek(r.hoveder.every(h => /Orbitron/.test(h.font)), 'overskrifterne bruger Orbitron');
    T.tjek(r.fonte.every(Boolean), 'skrifttyperne er indlæst (Orbitron, Exo 2, IBM Plex Sans)', JSON.stringify(r.fonte));
    const B = docsTema.maal.bredde, ventet = { ikkeIBrug: B.smal, lydkilde: B.bred, regel: B.bred, scene: B.bred };
    let xx = 0; const breddeOk = r.kol.every(([k, w, x]) => { const ok = w === (ventet[k] || B.normal) && x === xx; xx += w + docsTema.maal.kolonneAfstand; return ok; });
    T.tjek(breddeOk, 'bredder og afstande fra temaet (smal 200, normal 320, bred 440, afstand 120)', JSON.stringify(r.kol));
    T.tjek(r.kp === 'Klik på en node for at se, hvordan den virker.', 'kontrolpanelet viser hjælpeteksten');
    T.tjek(/radial-gradient/.test(r.baggrund), 'baggrunden er temaets radiale gradient');
    const t = r.tilpas; T.tjek(t.tilpas && t.x >= 0 && t.x + t.bredde * t.z <= t.W + 1 && t.z > .2, `Tilpas ved start: alle kolonner kan ses (zoom ${Math.round(t.z * 100)} %)`);

    /* zoom, træk, taster */
    const fb = await side.locator('#ne-flade').boundingBox();
    await side.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
    await side.mouse.wheel(0, -300); await side.waitForTimeout(200);
    const z1 = await side.evaluate(() => ({ z: NE.z, tekst: document.getElementById('ne-zoom').textContent, tilpas: NE.tilpas }));
    T.tjek(z1.z > t.z && z1.tekst === Math.round(z1.z * 100) + ' %' && !z1.tilpas, `musehjulet zoomer ind (${Math.round(t.z * 100)} % → ${z1.tekst}), og Tilpas slås fra`);
    const x0 = await side.evaluate(() => NE.x);
    await side.mouse.move(fb.x + 300, fb.y + 200); await side.mouse.down(); await side.mouse.move(fb.x + 150, fb.y + 220, { steps: 5 }); await side.mouse.up();
    const x1 = await side.evaluate(() => NE.x);
    T.tjek(Math.abs(x1 - x0 + 150) < 2, `træk flytter lærredet (${Math.round(x0)} → ${Math.round(x1)})`);
    await side.keyboard.press('ArrowRight');
    const xp = await side.evaluate(() => NE.x);
    await side.keyboard.press('-');
    const k = await side.evaluate(() => ({ x: NE.x, z: NE.z }));
    T.tjek(Math.abs(xp - x1 + 60) < 1 && k.z < z1.z, 'piletasten flytter og − zoomer ud, når lærredet har fokus');
    await side.click('.ne-k[data-ne="ind"]'); await side.click('.ne-k[data-ne="ind"]');
    const k2 = await side.evaluate(() => NE.z);
    T.tjek(Math.abs(k2 - Math.min(2, k.z * 1.5625)) < .01, `knappen + zoomer (${Math.round(k.z * 100)} % → ${Math.round(k2 * 100)} %)`);
    await side.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
    for (let i = 0; i < 20; i++) await side.mouse.wheel(0, -400);
    const zMax = await side.evaluate(() => NE.z);
    for (let i = 0; i < 40; i++) await side.mouse.wheel(0, 400);
    const zMin = await side.evaluate(() => NE.z);
    T.tjek(Math.abs(zMax - 2) < 1e-6 && Math.abs(zMin - .1) < 1e-6, `zoom går fra 10 til 200 % (${Math.round(zMin * 100)} % og ${Math.round(zMax * 100)} %)`);
    await side.mouse.move(fb.x + fb.width / 2, fb.y + fb.height / 2);
    for (let i = 0; i < 8; i++) await side.mouse.wheel(0, -200);
    await side.waitForTimeout(700);
    const gemt = await side.evaluate(() => ({ ne: JSON.parse(localStorage.getItem('rytme-set')).ne, z: NE.z, x: NE.x, y: NE.y }));
    T.tjek(gemt.ne && Math.abs(gemt.ne.z - gemt.z) < .002 && gemt.ne.tilpas === false, `visningen gemmes i set.ne (zoom ${Math.round(gemt.z * 100)} %)`);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'node-editor-zoom.png') });

    /* efter genstart */
    await side.reload(); await side.waitForTimeout(3500);
    const efter = await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 800)); return { z: NE.z, x: NE.x, y: NE.y, tilpas: NE.tilpas }; });
    T.tjek(Math.abs(efter.z - gemt.ne.z) < .002 && Math.abs(efter.x - gemt.ne.x) < 1 && !efter.tilpas, 'efter genstart står lærredet, hvor det stod (zoom og placering)');
    await side.click('.ne-k[data-ne="tilpas"]');
    const tp = await side.evaluate(() => ({ tilpas: NE.tilpas, on: document.querySelector('.ne-k[data-ne=tilpas]').classList.contains('ne-paa') }));
    T.tjek(tp.tilpas && tp.on, 'Tilpas-knappen tilpasser og lyser, så længe Tilpas gælder');

    /* layoutet Noder */
    for (const zoner of [true, false]) {
      const l = await side.evaluate(async zoner => {
        const vent = ms => new Promise(r => setTimeout(r, ms));
        if (!!set.zoner !== zoner) { zonerSaet(zoner); await vent(500); }
        lay3Anvend('noder'); await vent(800);
        const q = id => { const e = document.getElementById(id); if (!e || e.hidden || e.classList.contains('zon-skjult')) return null; const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 ? b : null; };
        const sc = q('w23'), af = q('w25'), fl = document.getElementById('ne-flade').getBoundingClientRect();
        return { knap: !!document.querySelector('#lay3 [data-lay3="noder"]'), lay: set.lay3, aktiv: set.fg.lyd.aktiv, sc: sc && [sc.top, sc.height, sc.width], af: af && [af.top, af.height, af.width], fl: [fl.width, fl.height], niv: set.niv };
      }, zoner);
      T.tjek(l.knap && l.lay === 'noder' && l.aktiv === 'w33', `${zoner ? 'zone-tilstand' : 'frie vinduer'}: layoutet Noder vælger fanen Node-editor`);
      T.tjek(l.sc && l.af && l.af[1] > l.sc[1] * 1.5 && l.af[2] > 1200 && l.fl[1] > 250, `${zoner ? 'zone-tilstand' : 'frie vinduer'}: Arbejdsfeltet er stort (${l.af && Math.round(l.af[2])} × ${l.af && Math.round(l.af[1])} px), Scenen kan ses ovenover (${l.sc && Math.round(l.sc[1])} px høj)`);
      if (zoner) await side.screenshot({ path: path.join(UD, 'node-editor-noder.png') });
    }
    await side.evaluate(() => { zonerSaet(true); });
    const nu = await side.evaluate(() => JSON.stringify(maps));
    T.tjek(før === nu, 'forbindelserne (maps) er de samme før og efter, at Node-editoren er brugt');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();

    /* 5 · Gamle indstillinger fra v9.18 (uden set.ne) */
    const g = JSON.parse(fs.readFileSync(path.join(__dirname, 'gamle-indstillinger', 'v9_18.json'), 'utf8'));
    const ctx2 = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await ctx2.addInitScript(ls => { if (!sessionStorage.getItem('__lagt')) { localStorage.clear(); for (const k in ls) localStorage.setItem(k, ls[k]); sessionStorage.setItem('__lagt', '1'); } }, g.localStorage);
    const s2 = await ctx2.newPage(); const f2 = [];
    s2.on('pageerror', e => f2.push(e.message)); s2.on('console', x => { if (x.type() === 'error') f2.push(x.text()); });
    await s2.goto('file://' + fil); await s2.waitForTimeout(4000);
    const g2 = await s2.evaluate(async () => { const før = JSON.stringify(maps); const ingen = !set.ne; lay3Anvend('noder'); await new Promise(r => setTimeout(r, 800)); return { ingen, byg: NE.byg, tilpas: NE.tilpas, z: NE.z, aktiv: set.fg.lyd.aktiv, samme: før === JSON.stringify(maps), maps: maps.length }; });
    T.tjek(g2.ingen && g2.byg && g2.tilpas && g2.aktiv === 'w33' && g2.samme && !f2.length, `gemte indstillinger fra v9.18 (uden set.ne): Node-editoren åbner tilpasset (${Math.round(g2.z * 100)} %), ${g2.maps} forbindelser uændrede, ingen fejl`, f2.slice(0, 2).join(' | '));
    await ctx2.close();
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-noder.png og tests/ud/node-editor-zoom.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
