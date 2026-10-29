/* Trin 4 · Det nye i v9.14: Stereobredde måler bredde, ikke placering.
   Stereobredde = 1 minus korrelationen mellem venstre og højre kanal, højst 1; er den ene kanal stille, er bredden 0. Panorering er uændret.
   - Målingen direkte (Rytme.stereoRamme): samme lyd i begge kanaler = 0 · samme lyd kun i venstre = 0 · forskellige lyde i hver kanal = høj,
     og ekstra: samme lyd med højre svagere = 0 · modfase = 1 (faselighed 0) · stilhed = 0 · en næsten stille kanal med lidt støj = 0. Panorering i alle tilfælde.
   - I programmet med stereo-testfilen: mono = 0, lyd mest til venstre = 0 (før 0,37), bred = høj; panorering som før.
   - Navnet på kilden og manualen siger det nye. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Stereobredde'), html = fs.readFileSync(fil, 'utf8');
  console.log('10 · Stereobredde · ' + path.basename(fil));
  const browser = await chromium.launch();
  const side = await browser.newPage();
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-'));
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const R = await side.evaluate(() => {
      const N = 8192; let s = 3; const støj = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
      const x = Float32Array.from({ length: N }, (_, i) => .5 * Math.sin(2 * Math.PI * 220 * i / 44100) + .3 * Math.sin(2 * Math.PI * 331 * i / 44100));
      const y = Float32Array.from({ length: N }, () => .5 * støj()), nul = new Float32Array(N);
      const m = (l, r) => { const o = Rytme.stereoRamme(l, r, 0, N); return { bredde: +o.bredde.toFixed(2), pan: +o.pan.toFixed(2), fase: +o.fase.toFixed(2) }; };
      return { ens: m(x, x), venstre: m(x, nul), svagHoejre: m(x, x.map(v => v * .25)), forskellige: m(x, y), modfase: m(x, x.map(v => -v)), stille: m(nul, nul), naestenStille: m(x, Float32Array.from({ length: N }, () => 1e-4 * støj())) };
    });
    const vis = o => `bredde ${o.bredde}, panorering ${o.pan}`;
    T.tjek(R.ens.bredde === 0 && R.ens.pan === .5, 'samme lyd i begge kanaler: ' + vis(R.ens));
    T.tjek(R.venstre.bredde === 0 && R.venstre.pan === 0, 'samme lyd kun i venstre: ' + vis(R.venstre));
    T.tjek(R.forskellige.bredde > .9, 'forskellige lyde i hver kanal: ' + vis(R.forskellige));
    T.tjek(R.svagHoejre.bredde === 0 && R.svagHoejre.pan === .2, 'samme lyd, højre er 25 % så kraftig: ' + vis(R.svagHoejre) + ' (panorering viser stadig placeringen)');
    T.tjek(R.modfase.bredde === 1 && R.modfase.fase === 0, `modfase: bredde ${R.modfase.bredde}, faselighed ${R.modfase.fase} (forskellen fra "forskellige lyde" ses i faselighed: ${R.forskellige.fase})`);
    T.tjek(R.stille.bredde === 0 && R.naestenStille.bredde === 0, `stilhed: bredde ${R.stille.bredde}; den ene kanal næsten stille med lidt støj: bredde ${R.naestenStille.bredde}`);

    /* I programmet med stereo-testfilen */
    await side.setInputFiles('#file', lavTestlyd.stereo(path.join(tmp, 'stereo.wav')));
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled && A && A['ana:bredde'] && /færdig/.test(document.getElementById('status').textContent), null, { timeout: 240000 });
    const D = await side.evaluate(() => { const del = (a, z) => { const o = {}; for (const k of ['pan', 'bredde', 'fase']) { let s = 0, n = 0; for (let t = a; t < z; t += .1) { s += +sampleA('ana:' + k, t) || 0; n++; } o[k] = +(s / n).toFixed(2); } return o; }; return { mono: del(2, 9), venstre: del(12, 19), bred: del(22, 29) }; });
    console.log('     stereo-testfilen: mono ' + JSON.stringify(D.mono) + ' · mest venstre ' + JSON.stringify(D.venstre) + ' · højre og bred ' + JSON.stringify(D.bred));
    T.tjek(D.mono.bredde === 0 && D.venstre.bredde < .05, `stereo-testfilen: mono bredde ${D.mono.bredde}; lyd mest til venstre bredde ${D.venstre.bredde} (før v9.14: 0,37)`);
    T.tjek(D.bred.bredde > .1 && D.bred.bredde > D.venstre.bredde + .1, `den brede del er bredere: ${D.bred.bredde}`);
    T.tjek(Math.abs(D.mono.pan - .5) < .03 && D.venstre.pan < .3 && D.bred.pan > .6, `panorering er uændret: ${D.mono.pan} · ${D.venstre.pan} · ${D.bred.pan}`);
    const navn = await side.evaluate(() => bandNavn('ana:bredde'));
    T.tjek(/kun i én/.test(navn), 'kildens navn: "' + navn + '"');
    T.tjek(html.includes('<h3 id="man-v914">') && !/Reserveret \(findes ikke endnu\)','Panorering og stereobredde/.test(html) && !html.includes('<i>panorering</i> og <i>stereobredde</i>'), 'manualen: afsnit om v9.14, og panorering og stereobredde står ikke længere som "findes ikke endnu"');
    T.tjek(!fejl.length, 'uden fejl', fejl.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); fs.rmSync(tmp, { recursive: true, force: true }); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
