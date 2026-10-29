/* Trin 4 · Det nye i v9.13: dobbelte målinger foldet sammen, Auto for taktslaget og en stereo-testfil.
   - Kildelisterne pr. Niveau: de 31 smalle bånd står foldet sammen under Bas, Mid, Høj-mid og Brilliance (fra Niveau 3); de høje smalle bånd (5 kHz og op), Spectral rolloff og Zero crossing rate kun på Niveau 4; en forbindelse på en skjult kilde viser den stadig.
   - "▸ Vis …" i en kildeliste folder ud uden at ændre forbindelsen; igen folder ind.
   - Router: de ubrugte kilder følger det samme, med fold-knapper under Frekvens og en note om det skjulte.
   - Taktslag og takt: Auto bruger "fra filen", når en fil spiller, og "mens det spiller" med generatoren; grunden står ved forbindelsen; Manuel kan vælges; motoren læser den kilde, der står.
   - Stereo-testfilen: panorering, stereobredde og faselighed måles rigtigt (mono, venstre, højre og bred).
   Skærmbilleder: tests/ud/taktslag-auto.png og tests/ud/smalle-baand.png. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Kilder og stereo'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('9 · Kilder og stereo · ' + path.basename(fil));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const side = await browser.newPage({ viewport: { width: 1600, height: 1400 } });
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-'));
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4000);

    /* 1 og 2: kildelisterne pr. Niveau */
    const L = await side.evaluate(() => {
      const tæl = (h, re) => (h.match(re) || []).length, før = set.niv, aab = set.lsAaben.slice(), ud = {};
      const liste = (n, a, v) => { set.niv = n; set.lsAaben = a; return feKildeOpts(v || ''); };
      let h = liste(2, []); ud.n2 = { ls: tæl(h, /value="ana:ls/g), fold: tæl(h, /value="__ls:/g), roll: h.includes('value="rolloff"'), zcr: h.includes('value="zcr"'), etiket: (h.match(/label="(Lydtræk[^"]*)"/) || [])[1] };
      h = liste(3, []); ud.n3 = { ls: tæl(h, /value="ana:ls/g), fold: tæl(h, /value="__ls:/g), roll: h.includes('value="rolloff"'), hmid: (h.match(/__ls:hmid">([^<]*)/) || [])[1], brill: (h.match(/__ls:brill"[^>]*>([^<]*)/) || [])[1] };
      h = liste(3, ['bas']); const bas = [...h.matchAll(/value="(ana:ls\d+)"/g)].map(m => m[1]); ud.n3bas = { ls: bas.length, foerst: bas[0], sidst: bas[bas.length - 1], lige: h.indexOf('value="bas"') < h.indexOf('__ls:bas') && h.indexOf('__ls:bas') < h.indexOf('value="ana:ls0"') && h.indexOf('value="ana:ls10"') < h.indexOf('value="mid"') };
      h = liste(4, ['bas', 'mid', 'hmid', 'brill']); ud.n4 = { ls: tæl(h, /value="ana:ls/g), roll: h.includes('value="rolloff"'), zcr: h.includes('value="zcr"') };
      h = liste(2, [], 'rolloff'); ud.valgt = /Valgt \(fra et højere niveau\)[^]*value="rolloff"/.test(h);
      h = liste(3, [], 'ana:ls3'); ud.aabenAfValg = h.includes('value="ana:ls3" selected');
      set.niv = før; set.lsAaben = aab; return ud;
    });
    T.tjek(L.n2.ls === 0 && L.n2.fold === 0 && !L.n2.roll && !L.n2.zcr, `Niveau 2: ingen smalle bånd, ingen Rolloff og Zero crossing rate ("${L.n2.etiket}")`);
    T.tjek(L.n3.ls === 0 && L.n3.fold === 4 && !L.n3.roll, `Niveau 3: de smalle bånd er foldet sammen under de 4 brede bånd`);
    T.tjek(/4 smalle bånd.*1 mere på Niveau 4/.test(L.n3.hmid || '') && /6 smalle bånd vises kun på Niveau 4/.test(L.n3.brill || ''), `Niveau 3: de høje smalle bånd er skjult, og der står det: "${(L.n3.hmid || '').trim()}" · "${(L.n3.brill || '').trim()}"`);
    T.tjek(L.n3bas.ls === 11 && L.n3bas.foerst === 'ana:ls0' && L.n3bas.sidst === 'ana:ls10' && L.n3bas.lige, 'Bas foldet ud: 11 smalle bånd (20 Hz til 200 Hz) står lige under Bas');
    T.tjek(L.n4.ls === 31 && L.n4.roll && L.n4.zcr, 'Niveau 4 med alt foldet ud: alle 31 smalle bånd, Rolloff og Zero crossing rate');
    T.tjek(L.valgt && L.aabenAfValg, 'en forbindelse på en skjult kilde viser den stadig (Rolloff på Niveau 2; et smalt bånd folder sin gruppe ud)');

    /* rettet i v9.13: de tre glidende hændelses-kilder havde typen slag */
    const gl = await side.evaluate(() => ['hnd:akkordrod', 'hnd:akkordmol', 'hnd:midinote', 'hnd:takt'].map(k => k + '=' + sigInfo(k).mappe + '/' + sigInfo(k).type).join(' '));
    T.tjek(gl === 'hnd:akkordrod=Tone og harmoni/valg hnd:akkordmol=Tone og harmoni/valg hnd:midinote=Styring/glidende hnd:takt=Rytme/slag', 'typerne for de glidende hændelser er rettet: ' + gl);
    /* "▸ Vis" i en kildeliste ændrer ikke forbindelsen */
    const fold = await side.evaluate(async () => {
      set.niv = 3; set.lsAaben = []; maps = [{ band: 'bas', effect: 'puls', thr: .3, gain: 1, att: 20, rel: 200, curve: 1, gap: 120, min: false }]; renderMaps();
      const s = () => document.querySelector('#maps .row[data-i="0"] select[data-f="band"]'); let el = s(); el.dispatchEvent(new Event('focusin', { bubbles: true })); fyldMapListe(el);
      const vælg = v => { const e = s(); e.dispatchEvent(new Event('focusin', { bubbles: true })); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); };
      vælg('__ls:bas'); await new Promise(r => setTimeout(r, 100)); const a = { band: maps[0].band, aab: set.lsAaben.includes('bas'), ls: s().querySelectorAll('option[value^="ana:ls"]').length, v: s().value };
      vælg('__ls:bas'); await new Promise(r => setTimeout(r, 100)); const b = { band: maps[0].band, aab: set.lsAaben.includes('bas'), ls: s().querySelectorAll('option[value^="ana:ls"]').length };
      return { a, b };
    });
    T.tjek(fold.a.band === 'bas' && fold.a.aab && fold.a.ls === 11 && fold.a.v === 'bas', '"▸ Vis 11 smalle bånd" folder ud i listen, og forbindelsen står stadig på Bas');
    T.tjek(fold.b.band === 'bas' && !fold.b.aab && fold.b.ls === 0, '"▾ Skjul" folder ind igen');

    /* Router: ubrugte kilder */
    await side.evaluate(() => { set.niv = 3; set.lsAaben = []; set.r2alle = true; set.r2vis = 'kompakt'; R2.byg = false; const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === 'Router'); t.click(); });
    await side.waitForFunction(() => document.querySelector('#r2 .r2-ubrugt .ls-fold'), null, { timeout: 15000 });
    const r2 = await side.evaluate(async () => { const ch = () => [...document.querySelectorAll('#r2 .r2-uchip')].map(c => c.dataset.kk); const a = ch();
      document.querySelector('#r2 [data-lsfold="bas"]').click(); for (let k = 0; k < 60 && !document.querySelector('#r2 .r2-uchip[data-kk="ana:ls0"]'); k++) await new Promise(r => setTimeout(r, 100)); const b = ch();
      return { lsFoer: a.filter(k => /^ana:ls/.test(k)).length, roll: a.includes('rolloff') || a.includes('zcr'), note: (document.querySelector('#r2 .ls-niv') || {}).textContent || '', lsEfter: b.filter(k => /^ana:ls/.test(k)).length, knapper: [...document.querySelectorAll('#r2 [data-lsfold]')].map(x => x.textContent) }; });
    T.tjek(r2.lsFoer === 0 && !r2.roll && /kun på Niveau 4/.test(r2.note), 'Router på Niveau 3: smalle bånd foldet sammen, Rolloff og Zero crossing rate skjult, og der står det: "' + r2.note.slice(0, 60) + '…"');
    T.tjek(r2.lsEfter === 11, 'Router: "' + r2.knapper[0] + '" folder 11 smalle bånd ud (' + r2.knapper.join(' · ') + ')');
    await side.evaluate(() => { const u = document.querySelector('#r2 .r2-ubrugt .ls-fold'); if (u) u.scrollIntoView(); });
    await side.waitForTimeout(400);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'smalle-baand.png') });
    await side.evaluate(() => { set.r2alle = false; set.lsAaben = []; R2.byg = false; set.niv = 2; });
    let f = nyeFejl(); T.tjek(!f.length, 'kildelister og Router uden fejl', f.slice(0, 3).join(' | '));

    /* 3: taktslag og takt, Auto og Manuel */
    const brugt = () => side.evaluate(() => { const set2 = []; Rytme.koer(maps, { v: (m) => { set2.push(m.band); return 0; }, off: () => false, master: 1, dt: 1 / 60, env: [], pe: [], E: {}, kant: () => {}, holdRyd: false }); return set2; });
    await side.evaluate(() => { maps = [{ band: 'ana:taktslag', effect: 'puls', thr: .3, gain: 1, att: 5, rel: 120, curve: 1, gap: 120, min: false }, { band: 'hnd:takt4', effect: 'ring', thr: .3, gain: 1, att: 5, rel: 120, curve: 1, gap: 120, min: false }, { band: 'bas', effect: 'glod', thr: .3, gain: 1, att: 5, rel: 120, curve: 1, gap: 120, min: false }]; renderMaps();
      const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === 'Mapping'); t.click(); });
    await side.waitForTimeout(600);
    const g = sel => side.evaluate(s => [...document.querySelectorAll(s)].map(e => e.textContent.trim()), sel);
    let tx = await g('#maps .tk-rad .tk-grund');
    T.tjek(tx.length === 2 && /Auto: fra filen, fordi der ikke spiller noget endnu/.test(tx[0]), 'uden lyd: "' + tx[0] + '" (kun ved de 2 taktslag-forbindelser, ikke ved Bas)');
    await side.evaluate(() => { bpm = 120; gStart(); });
    await side.waitForTimeout(1200);
    tx = await g('#maps .tk-rad .tk-grund'); let b = await brugt();
    T.tjek(/Auto: mens det spiller, fordi generatoren spiller/.test(tx[0]) && b[0] === 'hnd:takt' && b[1] === 'hnd:takt4' && b[2] === 'bas', 'generatoren: "' + tx[0] + '"; motoren læser ' + b.join(', '));
    await side.evaluate(() => document.querySelector('#maps .tk-rad[data-tki="0"] [data-tk="fil"]').click());
    await side.waitForTimeout(600);
    tx = await g('#maps .tk-rad .tk-grund'); b = await brugt(); const m0 = await side.evaluate(() => maps[0].takt);
    T.tjek(m0 === 'fil' && /Manuel: fra filen \(du har valgt det\)\. Auto ville bruge mens det spiller, fordi generatoren spiller/.test(tx[0]) && b[0] === 'ana:taktslag', 'Manuel: "' + tx[0] + '"; motoren læser ' + b[0]);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'taktslag-auto.png') });
    await side.evaluate(() => { document.querySelector('#maps .tk-rad[data-tki="0"] [data-tk="auto"]').click(); gStop(); });
    await side.waitForTimeout(400);
    T.tjek(await side.evaluate(() => maps[0].takt === undefined), 'Auto er Tilbage til standard (valget er slettet)');

    const wav = lavTestlyd(path.join(tmp, 'mono.wav'));
    await side.setInputFiles('#file', wav);
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await side.evaluate(() => document.getElementById('play').click());
    await side.waitForTimeout(1200);
    tx = await g('#maps .tk-rad .tk-grund'); b = await brugt();
    T.tjek(/Auto: fra filen, fordi du spiller en fil/.test(tx[0]) && b[0] === 'ana:taktslag' && b[1] === 'ana:takt', 'en fil spiller: "' + tx[0] + '"; motoren læser ' + b.slice(0, 2).join(', '));
    await side.evaluate(() => { set.r2vis = 'kompakt'; R2.byg = false; const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(x => x.textContent.trim() === 'Router'); t.click(); });
    await side.waitForFunction(() => document.querySelector('#r2 .r2-boks .tk-rad'), null, { timeout: 15000 });
    const r2t = await side.evaluate(() => document.querySelectorAll('#r2 .r2-boks .tk-rad').length);
    T.tjek(r2t === 2, 'Router viser det samme valg i de 2 taktslag-bokse');
    await side.evaluate(() => document.getElementById('pause') && document.getElementById('pause').click());
    f = nyeFejl(); T.tjek(!f.length, 'taktslag Auto uden fejl', f.slice(0, 3).join(' | '));

    /* 4: stereo-testfilen */
    const mål = async () => side.evaluate(() => { const del = (a, z) => { const o = {}; for (const k of ['ana:pan', 'ana:bredde', 'ana:fase']) { let s = 0, n = 0; for (let t = a; t < z; t += .1) { s += +sampleA(k, t) || 0; n++; } o[k.slice(4)] = +(s / n).toFixed(2); } return o; }; return { mono: del(2, 9), venstre: del(12, 19), hoejre: del(22, 29) }; });
    const mono = await mål();
    T.tjek(mono.mono.pan === .5 && mono.hoejre.pan === .5 && mono.mono.bredde === 0, `hullet før: med den gamle mono-testfil er panorering altid ${mono.mono.pan} og bredde ${mono.mono.bredde}`);
    const st = lavTestlyd.stereo(path.join(tmp, 'stereo.wav'));
    /* vent, til analysen af den nye fil er begyndt (Afspil slukket) og færdig igen */
    await side.evaluate(() => { const p = document.getElementById('pause'); if (p) p.click(); });
    await side.setInputFiles('#file', st);
    await side.waitForFunction(() => document.getElementById('play').disabled, null, { timeout: 30000 }).catch(() => {});
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled && A && A['ana:pan'] && /færdig/.test(document.getElementById('status').textContent), null, { timeout: 240000 });
    await side.waitForTimeout(500);
    const s = await mål();
    console.log('     stereo: mono ' + JSON.stringify(s.mono) + ' · venstre ' + JSON.stringify(s.venstre) + ' · højre og bred ' + JSON.stringify(s.hoejre));
    T.tjek(Math.abs(s.mono.pan - .5) < .03 && s.mono.bredde < .05, `0–10 s (mono): panorering ${s.mono.pan}, bredde ${s.mono.bredde}`);
    T.tjek(s.venstre.pan < .3, `10–20 s (mest venstre): panorering ${s.venstre.pan}`);
    /* Grænsen er 0,6 og ikke 0,7: den brede støj ligger lige kraftigt i begge sider og trækker panoreringen mod midten. */
    T.tjek(s.hoejre.pan > .6 && s.hoejre.bredde > s.mono.bredde + .1, `20–30 s (mest højre og bred): panorering ${s.hoejre.pan}, bredde ${s.hoejre.bredde}`);
    /* Opdaget i v9.13: bredde stiger også, når lyden bare ligger til den ene side (side-signal i forhold til midte). Det er målt her, ikke ændret. */
    console.log('     bemærk: stereobredde er ' + s.venstre.bredde + ', når lyden kun ligger til venstre (ikke bred)');
    T.tjek(s.hoejre.fase < s.mono.fase - .05, `faselighed falder, når lyden bliver bred (mono ${s.mono.fase}, bred ${s.hoejre.fase})`);
    f = nyeFejl(); T.tjek(!f.length, 'stereo-filen uden fejl', f.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
  console.log('  skærmbilleder: tests/ud/taktslag-auto.png, tests/ud/smalle-baand.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
