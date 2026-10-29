/* Trin 4 · Det nye i v9.8: Lydmotor 2 (vores navn), den nye lydmotor til generatoren.
   - Alle 7 genrer laves med begge motorer (Ny og Klassisk) i en lydfil uden at spille den (OfflineAudioContext, fagudtryk): ingen klip (peak under 1), ikke stille, og Ny lyder anderledes end Klassisk.
   - Generér automatisk med Ny giver betoninger (accent) og spøgelsesslag (ghost notes), og de kan ses i trinene.
   - Mens generatoren spiller, lyser akkorden lige nu, takten og Fill i takt 4.
   - Skift til Klassisk bygger mixet om; Tilbage til standard sætter alt tilbage.
   - Send til editor med Ny: lyden laves og analyseres (128 trin). Bemærk: Send til editor laver ikke tempo-profilen (SHOWPROFIL); det gør kun en lydfil. Sådan var det også før v9.8.
   Lydprøver (WAV) gemmes i tests/ud/lyd/, så et menneske kan lytte. Skærmbilleder i tests/ud/. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Lydmotor 2'), UD = path.join(__dirname, 'ud'), LYD = path.join(UD, 'lyd');
  fs.mkdirSync(LYD, { recursive: true });
  console.log('4 · Lydmotor 2 · ' + path.basename(fil));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    T.tjek(await side.evaluate(() => typeof LM === 'object' && gs.motor === 'ny'), 'Lydmotor 2 findes og er valgt fra start');

    /* Alle genrer med begge motorer */
    const genrer = await side.evaluate(() => Object.keys(GEN));
    const res = {};
    for (const g of genrer) for (const motor of ['ny', 'klassisk']) {
      const r = await side.evaluate(async ([g, motor]) => {
        const før = gs.motor, mr = Math.random; gs.motor = motor; curGen = g; Math.random = (() => { let s = 7; return () => ((s = (s * 16807) % 2147483647) / 2147483647); })();
        autoGen(); const sd = 60 / bpm / 4, N = 64, sr = 44100;
        const oc = new OfflineAudioContext(1, Math.ceil(sr * (sd * N + 1.5)), sr), m = mkMaster(oc, bpm), nb = nbuf(oc);
        for (let i = 0; i < N; i++) playStep(oc, m.m, nb, i * sd, i % gs.steps, bpm);
        const b = await oc.startRendering(), d = b.getChannelData(0);
        let pk = 0, sum = 0, nan = 0; for (let i = 0; i < d.length; i++) { const v = d[i]; if (!Number.isFinite(v)) { nan++; continue; } pk = Math.max(pk, Math.abs(v)); sum += v * v; }
        const i16 = new Int16Array(d.length); for (let i = 0; i < d.length; i++) i16[i] = Math.max(-32767, Math.min(32767, Math.round((d[i] || 0) * 32767)));
        let bin = ''; const u8 = new Uint8Array(i16.buffer); for (let i = 0; i < u8.length; i += 0x8000) bin += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
        gs.motor = før; Math.random = mr;
        return { pk, rms: Math.sqrt(sum / d.length), nan, bpm, sr, data: btoa(bin) };
      }, [g, motor]);
      const pcm = Buffer.from(r.data, 'base64'), wav = Buffer.alloc(44);
      wav.write('RIFF', 0); wav.writeUInt32LE(36 + pcm.length, 4); wav.write('WAVEfmt ', 8); wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
      wav.writeUInt32LE(r.sr, 24); wav.writeUInt32LE(r.sr * 2, 28); wav.writeUInt16LE(2, 32); wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(pcm.length, 40);
      fs.writeFileSync(path.join(LYD, `${g}-${motor}.wav`), Buffer.concat([wav, pcm]));
      res[g + '-' + motor] = r;
    }
    const tabel = genrer.map(g => { const n = res[g + '-ny'], k = res[g + '-klassisk']; return `${g.padEnd(7)} ny: peak ${n.pk.toFixed(2)} rms ${n.rms.toFixed(3)} · klassisk: peak ${k.pk.toFixed(2)} rms ${k.rms.toFixed(3)}`; });
    console.log('     ' + tabel.join('\n     '));
    const ny = genrer.map(g => res[g + '-ny']);
    T.tjek(ny.every(r => !r.nan), 'ingen ugyldige tal i lyden (NaN)');
    T.tjek(ny.every(r => r.pk < 1), 'Ny klipper ikke i nogen genre (peak under 1,00)', ny.map(r => r.pk.toFixed(2)).join(', '));
    T.tjek(ny.every(r => r.rms > .03), 'Ny er ikke for stille i nogen genre (rms over 0,03)', ny.map(r => r.rms.toFixed(3)).join(', '));
    T.tjek(genrer.every(g => res[g + '-ny'].data !== res[g + '-klassisk'].data), 'Ny lyder anderledes end Klassisk i alle genrer');
    let f = nyeFejl(); T.tjek(!f.length, 'alle genrer uden fejl', f.slice(0, 3).join(' | '));

    /* Betoninger og spøgelsesslag */
    const bet = await side.evaluate(() => { curGen = 'house'; gs.dens = .7; autoGen(); sbAabn('w4');
      const fl = pat.slice(0, 6).flat(); return { acc: fl.filter(v => v === 2).length, gh: fl.filter(v => v === 3).length, vAcc: document.querySelectorAll('#pads .pad.acc').length, vGh: document.querySelectorAll('#pads .pad.gh').length }; });
    T.tjek(bet.acc > 0 && bet.gh > 0, `Generér automatisk giver betoninger (${bet.acc}) og spøgelsesslag (${bet.gh})`);
    T.tjek(bet.vAcc > 0 && bet.vGh > 0, `de kan ses i trinene (${bet.vAcc} lyser stærkere, ${bet.vGh} svagere)`);

    /* Spil live: akkorden lyser, takten tæller, fill i takt 4 */
    await side.evaluate(() => { bpm = 124; gStart(); });
    await side.waitForTimeout(2500);
    const live1 = await side.evaluate(() => ({ nu: [...document.querySelectorAll('#gen .lm-akk .lm-a.nu')].map(a => a.textContent), takt: (document.querySelector('#gen .lm-takt') || {}).textContent, alle: [...document.querySelectorAll('#gen .lm-akk .lm-a')].map(a => a.textContent) }));
    T.tjek(live1.nu.length === 1 && /takt \d af 4/.test(live1.takt), `mens den spiller, lyser akkorden lige nu (${live1.nu[0]} af ${live1.alle.join(' → ')}; ${live1.takt})`);
    await side.locator('#w4').screenshot({ path: path.join(UD, 'lydmotor-w4.png') });
    /* Vent til fill i takt 4 (en takt ved 124 BPM er 1,94 s) */
    const fill = await side.evaluate(async () => { for (let i = 0; i < 120; i++) { await new Promise(r => setTimeout(r, 50)); const f = document.querySelector('#gen .lm-fill'); if (f && f.classList.contains('nu')) return document.querySelector('#gen .lm-takt').textContent; } return null; });
    T.tjek(fill === 'takt 4 af 4', 'Fill lyser i takt 4', String(fill));
    await side.keyboard.press('Escape'); await side.evaluate(() => { document.querySelectorAll('.zon-pop .zon-luk').forEach(b => b.click()); const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === 'Lydkilde'); if (t) t.click(); });
    await side.waitForTimeout(500);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'lydmotor-lydkilde.png') });
    f = nyeFejl(); T.tjek(!f.length, 'live afspilning uden fejl', f.slice(0, 3).join(' | '));

    /* Skift motor og Tilbage til standard */
    const skift = await side.evaluate(async () => {
      document.querySelector('#gen .lm-rad [data-lms="klassisk"]').click(); await new Promise(r => setTimeout(r, 300));
      const k = { motor: gs.motor, lm: !!(gmk && gmk.lm), akk: !!document.querySelector('#gen .lm-akk') };
      gs.rum = .8; gs.pad = false;
      document.querySelector('#gen .lm-rad [data-lmstd]').click(); await new Promise(r => setTimeout(r, 300));
      const s = { motor: gs.motor, lm: !!(gmk && gmk.lm), pad: gs.pad, fill: gs.fill, rum: gs.rum };
      gStop(); return { k, s };
    });
    T.tjek(skift.k.motor === 'klassisk' && !skift.k.lm && !skift.k.akk, 'Klassisk: den gamle motor og det gamle mix, ingen akkord-linje');
    T.tjek(skift.s.motor === 'ny' && skift.s.lm && skift.s.pad && skift.s.fill && skift.s.rum === .25, 'Tilbage til standard: Ny, akkord-flade og fill til, rumklang 0,25');

    /* Send til editor med Ny: analysen finder tempoet */
    const t0 = Date.now();
    await side.evaluate(() => { curGen = 'house'; autoGen(); renderToEditor(); });
    await side.waitForFunction(() => typeof F !== 'undefined' && F && !document.getElementById('play').disabled && /analyseret/.test(document.getElementById('status').textContent), null, { timeout: 240000 });
    const ana = await side.evaluate(() => ({ dur, forvent: 128 * 60 / bpm / 4 + 1.5 }));
    T.tjek(Math.abs(ana.dur - ana.forvent) < .1, `Send til editor: lyden er lavet og analyseret, ${ana.dur.toFixed(1)} s = 128 trin (${Math.round((Date.now() - t0) / 1000)} s)`);
    f = nyeFejl(); T.tjek(!f.length, 'Send til editor uden fejl', f.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  lydprøver: tests/ud/lyd/ · skærmbilleder: tests/ud/');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
