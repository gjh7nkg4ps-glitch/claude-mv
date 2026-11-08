/* Trin 4 · Det nye i v9.21: Node-editoren, trin 3 (lydkilde, FFT og analyser, kun se). Se docs/PLAN-NODE-EDITOREN.md og papirets afsnit 5.3 og 5.4.
   Uden lyd: Lydfil "Ikke tilgængelig", begge FFT og alle 9 analyser sover. Alle udgange fra papirets tabel 5.4 findes som porte, når alt er foldet ud
   (de 14 lydtræk, alle ana:-kilder, analysernes hændelser); hvert lydtræk, en regel bruger, får et link fra den rigtige analyse; fold ▸ ændrer ikke maps.
   Generator: noden Generator, Stereo og Afsnit er ikke tilgængelige, spektret lever. Mono-testfil: navn, tempo cirka 120 BPM, Venter under analysen,
   bølgeformen, hop i sangen, målerne V og H. Stereo-testfil: venstre og højre forskellige. 4 spor (test-spor): én række pr. spor og Mix, spor-lydtræk
   får link fra deres spor. MIDI, Morph Pad og Tastatur vises, når en regel bruger dem. Gamle indstillinger fra v9.18.
   Skærmbilleder: tests/ud/node-editor-analyser.png, node-editor-4spor.png (deviceScaleFactor 2). */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
const FARVEKODE = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:white|black|red|orange|yellow|gold|pink|purple|violet|magenta|gr[ae]y|silver|blue|green|brown)(?![\w-])/;

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 3)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('16 · Node-editor, trin 3 · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');
  const a = html.indexOf('/* ========== v9.21: NODE-EDITOR (TRIN 3)'), b = html.indexOf('/* ========== SLUT: NODE-EDITOR (TRIN 3)');
  const blok = a > 0 && b > a ? html.slice(a, b) : '';
  const lin = blok.split('\n').map(l => l.replace(/\/\*[^]*?\*\//g, '')).filter(l => FARVEKODE.test(l));
  T.tjek(blok && !lin.length, 'ingen farvekoder i blokken for trin 3', lin.slice(0, 2).map(l => (l.match(FARVEKODE) || [''])[0]).join(', '));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-ne3-'));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); let fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
    side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const neVent = () => side.evaluate(async () => { for (let k = 0; k < 40; k++) { await new Promise(r => setTimeout(r, 100)); if (NE2.sig === ne2Sig() && NE2.maalt) return; } });
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 900)); });
    await neVent();

    /* 1 · Uden lyd */
    const u = await side.evaluate(() => { const N = [...NE2.N.values()]; const k = NE2.N.get('k:main'); return { kilde: k && k.kildeType, ikke: k && k.el.classList.contains('ne-ikke'), fft: N.filter(n => n.kol === 'fft').length, ana: N.filter(n => n.kol === 'analyse').map(n => n.ana[1]), sover: N.filter(n => (n.kol === 'fft' || n.kol === 'analyse') && n.el.classList.contains('ne-sover')).length }; });
    T.tjek(u.kilde === 'ingen' && u.ikke, 'uden lyd: Lydfil står som Ikke tilgængelig ("Vælg en lydfil")');
    T.tjek(u.fft === 2 && u.ana.join(',') === 'Slag-detektor,Brede bånd,31 bånd,Tone og akkord,Klang,Taktslag,Stereo,Styrke,Afsnit', `2 FFT og de 9 analyser i papirets rækkefølge: ${u.ana.join(', ')}`);
    T.tjek(u.sover === 11, `uden lyd sover FFT og analyserne (${u.sover} af 11)`);

    /* 2 · Alle udgange fra tabel 5.4, når alt er foldet ud */
    const ud = await side.evaluate(async () => {
      const før = JSON.stringify(maps); set.ne = set.ne || {}; set.ne.fold = {};
      NE3_ANA.forEach(a => a[4].forEach(r => { if (r[2]) set.ne.fold['a:' + a[0] + '|' + r[0]] = true; })); ne2Byg(); await new Promise(r => setTimeout(r, 200));
      const porte = new Set(); NE2.N.forEach(n => { if (n.kol === 'analyse') Object.keys(n.porte || {}).forEach(p => { if (p.startsWith('o:')) porte.add(p.slice(2)); }); });
      const ventet = [...BANDS.map(b => b[0]), ...Rytme.ANA_KILDER.map(k => k.key), 'hnd:klang:slag', 'hnd:klang:tone', 'hnd:klang:stoej', 'hnd:akkord', 'hnd:akkordrod', 'hnd:akkordmol', 'hnd:takt', 'hnd:takt2', 'hnd:takt4', 'hnd:takt8', 'hnd:drop', 'hnd:pause:stop', 'hnd:pause:start', 'hnd:sektion'];
      const mangler = ventet.filter(k => !porte.has(k)), domPorte = [...NE2.N.values()].filter(n => n.kol === 'analyse').every(n => Object.values(n.porte || {}).every(q => Number.isFinite(q[1])));
      set.ne.fold = {}; ne2Byg(); await new Promise(r => setTimeout(r, 200));
      const foldet = [...document.querySelectorAll('#ne-verden .ne-r-gruppe')].length, åben = [...document.querySelectorAll('#ne-verden .ne-r-barn')].length;
      return { ventet: ventet.length, porte: porte.size, mangler, domPorte, foldet, åben, samme: før === JSON.stringify(maps) };
    });
    T.tjek(!ud.mangler.length && ud.domPorte, `alle ${ud.ventet} udgange fra tabel 5.4 findes som porte, når alt er foldet ud (14 lydtræk, ${ud.ventet - 30} analyse-kilder og 16 hændelser)`, 'mangler: ' + ud.mangler.slice(0, 6).join(', '));
    T.tjek(ud.foldet === 6 && ud.åben === 0 && ud.samme, `foldet sammen fra start (${ud.foldet} grupper, fx 12 toneklasser og de 31 bånd i fire grupper); foldningen ændrer ikke maps`);
    const fk = await side.evaluate(async () => { const r = document.querySelector('#ne-verden .ne-node[data-n="a:tone"] .ne-r-gruppe'); r.click(); await new Promise(r => setTimeout(r, 300)); const n = document.querySelectorAll('#ne-verden .ne-node[data-n="a:tone"] .ne-r-barn').length; const gemt = JSON.parse(JSON.stringify(set.ne.fold)); document.querySelector('#ne-verden .ne-node[data-n="a:tone"] .ne-r-gruppe').click(); await new Promise(r => setTimeout(r, 300)); return { n, gemt, efter: document.querySelectorAll('#ne-verden .ne-node[data-n="a:tone"] .ne-r-barn').length }; });
    T.tjek(fk.n === 12 && fk.gemt['a:tone|:c'] && fk.efter === 0, 'klik på ▸ 12 toneklasser folder ud (12 rækker med hver sin port) og ind igen; valget huskes');

    /* 3 · Lydtræk får link fra den rigtige analyse */
    const lk = await side.evaluate(async () => { const før = JSON.stringify(maps);
      maps.push({ band: 'ana:c4', effect: 'puls', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'ana:ls3', effect: 'glod', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'ana:pan', effect: 'ring', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'hnd:takt4', effect: 'burst', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'pad:x', effect: 'zoom', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'hnd:midi', effect: 'strobe', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'hnd:tast', effect: 'ryst', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 });
      await new Promise(r => setTimeout(r, 900));
      const fra = k => { const l = NE2.L.find(l => l.til === 'l:' + k && NE2.N.get(l.fra) && NE2.N.get(l.fra).kol !== 'lydtraek'); return l ? l.fra + ' ' + l.fp : '–'; };
      const r = { c4: fra('ana:c4'), ls3: fra('ana:ls3'), pan: fra('ana:pan'), takt: fra('hnd:takt4'), kick: fra('kick'), rms: fra('rms'), pad: fra('pad:x'), midi: fra('hnd:midi'), tast: fra('hnd:tast'), blaa: [...NE2.N.values()].filter(n => n.blaa).map(n => n.navn).join(', ') };
      const ok = [...NE2.N.values()].filter(n => n.kol === 'lydtraek').every(n => NE2.L.some(l => l.til === n.key && l.tp === 'ind'));
      maps.splice(0, maps.length, ...JSON.parse(før)); await new Promise(r => setTimeout(r, 900)); r.alle = ok; r.efter = [...NE2.N.values()].filter(n => n.blaa).length; return r; });
    T.tjek(lk.c4 === 'a:tone g::c' && lk.ls3 === 'a:b31 g::ls-bas' && lk.pan === 'a:stereo o:ana:pan' && lk.takt === 'a:takt o:hnd:takt4' && lk.rms === 'a:styrke o:rms', `lydtræk får link fra den rigtige analyse og række: Tone C♯… fra ${lk.c4}, 63 Hz fra ${lk.ls3}, Panorering fra ${lk.pan}, hver takt fra ${lk.takt}, RMS fra ${lk.rms}`);
    T.tjek(lk.pad === 'k:pad o:pad:x' && lk.midi === 'k:midi o:hnd:midi' && lk.tast === 'k:tast o:hnd:tast' && lk.blaa === 'MIDI, Morph Pad, Tastatur' && lk.efter === 0, `de blå noder vises, når en regel bruger dem (${lk.blaa}), og forsvinder igen`);
    T.tjek(lk.alle, 'hvert lydtræk, en regel bruger, har et link ind');

    /* 4 · Generator */
    const g = await side.evaluate(async () => { curGen = 'techno'; gStart(); await new Promise(r => setTimeout(r, 2500)); const k = NE2.N.get('k:main'), st = NE2.N.get('a:stereo'), af = NE2.N.get('a:afsnit');
      let spek = 0; const c = NE2.N.get('f:hurtig').el.querySelector('.ne-spek'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) spek++;
      const r = { kilde: k.kildeType, tekst: k.el.textContent, st: st.el.classList.contains('ne-ikke'), af: af.el.classList.contains('ne-ikke'), sover: document.querySelectorAll('#ne-verden .ne-sover').length, spek, db: (k.el.querySelector('[data-x="db"]') || {}).textContent }; gStop(); await new Promise(r => setTimeout(r, 900)); r.efter = NE2.N.get('k:main').kildeType; return r; });
    T.tjek(g.kilde === 'gen' && /Techno/.test(g.tekst) && /BPM/.test(g.tekst) && g.st && g.af && g.sover === 0 && g.spek > 50 && g.efter === 'ingen', `generatoren: noden Generator (Techno, tempo, tæthed, niveau ${g.db} dB), Stereo og Afsnit ikke tilgængelige, spektret lever (${g.spek} punkter); stoppet: ingen lyd igen`);

    /* 5 · Mono-testfil */
    const wav = lavTestlyd(path.join(tmp, 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav);
    const ve = await side.evaluate(async () => { for (let k = 0; k < 300; k++) { await new Promise(r => setTimeout(r, 50)); const n = NE2.N.get('k:main'); if (NE2.analyserer && n && n.kildeType === 'fil' && n.el.classList.contains('ne-analyserer') && n.el.querySelector('[data-x="info"]')) return { a: true, venter: document.querySelectorAll('#ne-verden .ne-n-analyse.ne-venter').length, tekst: n.el.querySelector('[data-x="info"]').textContent }; } return { a: false }; });
    T.tjek(ve.a && ve.venter === 9 && /Analyserer/.test(ve.tekst), `under analysen: lydkilden viser "${ve.tekst}", og de 9 analyser venter`);
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await neVent(); await side.waitForTimeout(600);
    const f1 = await side.evaluate(() => { const k = NE2.N.get('k:main'); return { kilde: k.kildeType, navn: k.navn, info: k.el.querySelector('[data-x="info"]').textContent, boelge: k.boelgeTegnet, sover: document.querySelectorAll('#ne-verden .ne-sover').length }; });
    T.tjek(f1.kilde === 'fil' && f1.navn === 'testlyd-120bpm.wav' && /0:30/.test(f1.info) && /1[12]\d BPM/.test(f1.info) && f1.boelge && f1.sover === 0, `lydfilen: ${f1.navn} · ${f1.info}, bølgeformen er tegnet, intet sover`);
    const hop = await side.evaluate(async () => { const c = NE2.N.get('k:main').el.querySelector('.ne-boelge'), r = c.getBoundingClientRect(); return { x: r.left + r.width * .5, y: r.top + r.height / 2 }; });
    await side.mouse.click(hop.x, hop.y); await side.waitForTimeout(200);
    const t1 = await side.evaluate(() => now());
    T.tjek(Math.abs(t1 - 15) < 1, `klik midt i bølgeformen hopper til ${t1.toFixed(1)} s (af 30 s)`);
    await side.evaluate(() => { document.getElementById('play').click(); });
    await side.waitForTimeout(1500);
    const lev = await side.evaluate(async () => { const m = { L: 0, kick: 0, søjle: 0, lamper: 0, spek: 0, streg: [] }; for (let k = 0; k < 30; k++) /* 2,4 s: slag-lamperne tænder kun ved et slag */ { await new Promise(r => setTimeout(r, 80));
      const n = NE2.N.get('k:main').el; m.L = Math.max(m.L, parseFloat(n.querySelector('[data-x="L"]').style.width) || 0); m.streg.push(n.querySelector('.ne-hoved-streg').style.left);
      m.søjle = Math.max(m.søjle, ...[...document.querySelectorAll('#ne-verden .ne-node[data-n="a:bred"] .ne-soejler u')].map(u => parseFloat(u.style.height) || 0)); m.lamper = Math.max(m.lamper, document.querySelectorAll('#ne-verden .ne-node[data-n="a:slag"] .ne-lampe.ne-taendt').length); }
      const c = NE2.N.get('f:fin').el.querySelector('.ne-spek'), d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; for (let i = 3; i < d.length; i += 4) if (d[i] > 0) m.spek++; m.streg = new Set(m.streg).size; return m; });
    T.tjek(lev.L > 30 && lev.søjle > 20 && lev.lamper > 0 && lev.spek > 50 && lev.streg > 3, `under afspilning lever det: måler V op til ${lev.L.toFixed(0)} %, brede bånd op til ${lev.søjle.toFixed(0)} %, slag-lamper tænder, FFT · fin tegner (${lev.spek} punkter), afspilningsstregen flytter sig (${lev.streg} pladser, ${lev.lamper} lamper)`);
    await side.evaluate(() => { neVaelg('a:slag'); NE.tilpas = false; NE.z = .7; NE.x = Math.round(20 - NE.kol.find(c => c.k === 'lydkilde').x * NE.z); NE.y = 96; neVis(); });
    await side.waitForTimeout(900);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'node-editor-analyser.png') });
    await side.evaluate(() => { document.getElementById('pause') && document.getElementById('pause').click(); neVaelg(null); });

    /* 6 · Stereo-testfil */
    await side.evaluate(() => { window.__F0 = F; });
    await side.setInputFiles('#file', lavTestlyd.stereo(path.join(tmp, 'stereo.wav')));
    await side.waitForFunction(() => F && F !== window.__F0 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await side.evaluate(() => { tlSpring(12); document.getElementById('play').click(); }); /* 10–20 s: mest til venstre (højre er 25 %, cirka −12 dB) */
    await side.waitForTimeout(1200);
    const st = await side.evaluate(async () => { let L = 0, R = 0; for (let k = 0; k < 10; k++) { await new Promise(r => setTimeout(r, 80)); const n = NE2.N.get('k:main').el; L = Math.max(L, parseFloat(n.querySelector('[data-x="L"]').style.width) || 0); R = Math.max(R, parseFloat(n.querySelector('[data-x="R"]').style.width) || 0); } document.getElementById('pause').click(); return { L, R }; });
    T.tjek(st.L > st.R + 10, `stereo-testfilen (10–20 s, højre er 25 %): V ${st.L.toFixed(0)} %, H ${st.R.toFixed(0)} %`);

    /* 7 · 4 spor */
    let sporOk = true;
    try { execFileSync('python3', ['-I', path.join(__dirname, 'lav-stems.py'), tmp]); } catch (e) { sporOk = false; T.fejl('test-sporene kunne ikke laves (python3 med numpy): ' + String(e.message).split('\n')[0]); }
    if (sporOk) {
      await side.evaluate(() => { const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === 'Lydkilde'); if (t) t.click(); });
      await side.waitForSelector('#stem-brug', { timeout: 10000 });
      for (const s of ['trommer', 'bas', 'vokal', 'resten']) await side.setInputFiles(`[data-stem-input="${s}"]`, path.join(tmp, s + '.wav'));
      await side.waitForFunction(() => STEM_SPOR.every(([s]) => STEM.buf[s]), null, { timeout: 20000 });
      await side.click('#stem-brug');
      await side.waitForFunction(() => STEM.klar && F && !document.getElementById('play').disabled, null, { timeout: 300000 });
      await side.evaluate(async () => { maps.push({ band: 'stem:trommer:kick', effect: 'puls', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'stem:vokal:vokal', effect: 'glod', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }); fgVaelg('lyd', 'w33', true); await new Promise(r => setTimeout(r, 1200)); });
      await neVent();
      const sp = await side.evaluate(() => { const k = NE2.N.get('k:main'); const fra = b => { const l = NE2.L.find(l => l.til === 'l:' + b); return l ? l.fra + ' ' + l.fp : '–'; }; return { kilde: k.kildeType, rækker: [...k.el.querySelectorAll('.ne-r .ne-rn')].map(e => e.textContent).join(','), porte: Object.keys(k.porte).filter(p => p.startsWith('s:')).length, kick: fra('stem:trommer:kick'), vok: fra('stem:vokal:vokal'), mix: NE2.L.filter(l => l.fra === 'k:main' && l.fp === 'ud').length }; });
      T.tjek(sp.kilde === 'spor' && sp.rækker === 'Trommer,Bas,Vokal,Resten,Mix' && sp.porte === 4 && sp.kick === 'k:main s:trommer' && sp.vok === 'k:main s:vokal' && sp.mix >= 7, `4 spor: rækkerne ${sp.rækker}, hvert spor har sin port, Kick · Trommer får link fra ${sp.kick}, Vokal · Vokal fra ${sp.vok}, Mix går til FFT og analyserne (${sp.mix} links)`);
      await side.evaluate(() => { tlSpring(2); document.getElementById('play').click(); NE.tilpas = false; NE.z = .7; NE.x = Math.round(20 - NE.kol.find(c => c.k === 'lydkilde').x * NE.z); NE.y = 96; neVis(); });
      await side.waitForTimeout(1500);
      const sl = await side.evaluate(async () => { let tr = 0, mix = 0, rms = 0; for (let k = 0; k < 12; k++) { await new Promise(r => setTimeout(r, 80)); const el = NE2.N.get('k:main').el; tr = Math.max(tr, parseFloat(el.querySelector('.ne-r[data-k="stem:trommer:rms"] .ne-rb u').style.width) || 0); mix = Math.max(mix, parseFloat(el.querySelector('.ne-r-mix .ne-rb u').style.width) || 0); rms = Math.max(rms, +bandV('rms') || 0); } return { tr, mix, rms, playing, t: now() }; });
      T.tjek(sl.playing && sl.tr > 20 && sl.mix > 20, `4 spor lever under afspilning: Trommer op til ${sl.tr.toFixed(0)} %, Mix op til ${sl.mix.toFixed(0)} % (RMS ${sl.rms.toFixed(2)}, ${sl.t.toFixed(1)} s)`);
      await side.locator('#w25').screenshot({ path: path.join(UD, 'node-editor-4spor.png') });
      await side.evaluate(() => { document.getElementById('pause').click(); maps.splice(maps.length - 2, 2); });
    }
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();

    /* 8 · Gamle indstillinger fra v9.18 */
    const gi = JSON.parse(fs.readFileSync(path.join(__dirname, 'gamle-indstillinger', 'v9_18.json'), 'utf8'));
    const ctx2 = await browser.newContext({ viewport: { width: 1600, height: 1000 } });
    await ctx2.addInitScript(ls => { if (!sessionStorage.getItem('__lagt')) { localStorage.clear(); for (const k in ls) localStorage.setItem(k, ls[k]); sessionStorage.setItem('__lagt', '1'); } }, gi.localStorage);
    const s2 = await ctx2.newPage(); const f2 = [];
    s2.on('pageerror', e => f2.push(e.message)); s2.on('console', x => { if (x.type() === 'error') f2.push(x.text()); });
    await s2.goto('file://' + fil); await s2.waitForTimeout(4000);
    const g2 = await s2.evaluate(async () => { const før = JSON.stringify(maps); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); const N = [...NE2.N.values()]; return { ana: N.filter(n => n.kol === 'analyse').length, fft: N.filter(n => n.kol === 'fft').length, kilde: N.filter(n => n.kol === 'lydkilde').length, samme: før === JSON.stringify(maps), takt: NE2.L.some(l => l.fra === 'a:takt') }; });
    T.tjek(g2.ana === 9 && g2.fft === 2 && g2.kilde >= 1 && g2.samme && g2.takt && !f2.length, `gemte indstillinger fra v9.18: lydkilde, 2 FFT og 9 analyser; taktslag-reglen får link fra Taktslag; maps uændret; ingen fejl`, f2.slice(0, 2).join(' | '));
    await ctx2.close();
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-analyser.png og tests/ud/node-editor-4spor.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
