/* Trin 4 · Det nye i v9.101 (P8.14 punkt 3a): hent alle 4 spor på én gang, fordelt efter filnavnet (Ultimate Vocal Remover: Vocals, Drums, Bass, Other/Instrumental).
   Ved 1920 × 1080: de fire test-spor (lav-stems.py) kopieres med UVR-navne i en mappe; Vælg 4 filer … (setInputFiles på #stem-flere) lægger dem på de rigtige spor, og
   linjen "Fordelt efter filnavnet" står i kortet med fil pr. spor; "Instrumental" går til Resten, "No Vocals" ikke til Vokal; en fil uden kendt ord får den ledige plads;
   Vælg en mappe … (#stem-mappe, webkitdirectory) tager en hel mappe. */
const path = require('path'), os = require('os'), fs = require('fs'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('4 spor på én gang');
  console.log('90 · 4 spor på én gang · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-stem4-')); execFileSync('python3', ['-I', path.join(__dirname, 'lav-stems.py'), tmp]);
  const uvr = path.join(tmp, 'uvr'); fs.mkdirSync(uvr);
  const kopi = (fra, til) => fs.copyFileSync(path.join(tmp, fra), path.join(uvr, til));
  kopi('trommer.wav', '1_sang_(Drums).wav'); kopi('bas.wav', '1_sang_(Bass).wav'); kopi('vokal.wav', '1_sang_(Vocals).wav'); kopi('resten.wav', '1_sang_(Instrumental).wav');
  fs.writeFileSync(path.join(uvr, 'noter.txt'), 'ikke lyd');
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.goto('file://' + fil); await side.waitForTimeout(4000);
    await side.evaluate(() => { try { dkVis('w35'); sgFane('spor') } catch (e) { } }); await side.waitForTimeout(800);
    const k = await side.evaluate(() => ({ flere: !!document.getElementById('stem-flere-k'), mappe: !!document.getElementById('stem-mappe-k'), dir: document.getElementById('stem-mappe') && document.getElementById('stem-mappe').hasAttribute('webkitdirectory'), fordelt: document.getElementById('stem-fordelt') && document.getElementById('stem-fordelt').hidden }));
    T.tjek(k.flere && k.mappe && k.dir && k.fordelt, 'kortet Spor har Vælg 4 filer … og Vælg en mappe … (webkitdirectory); linjen Fordelt er skjult, til der er valgt', JSON.stringify(k));
    /* 4 filer med UVR-navne (ikke i rækkefølge) */
    await side.setInputFiles('#stem-flere', ['1_sang_(Instrumental).wav', '1_sang_(Vocals).wav', '1_sang_(Bass).wav', '1_sang_(Drums).wav'].map(n => path.join(uvr, n)));
    await side.waitForFunction(() => STEM_SPOR.every(([s]) => STEM.buf[s]), null, { timeout: 60000 }); await side.waitForTimeout(400);
    const r1 = await side.evaluate(() => ({ fil: Object.fromEntries(STEM_SPOR.map(([s]) => [s, STEM.fil[s]])), linje: document.getElementById('stem-fordelt').textContent, synlig: !document.getElementById('stem-fordelt').hidden, status: document.getElementById('status').textContent }));
    T.tjek(/Drums/.test(r1.fil.trommer) && /Bass/.test(r1.fil.bas) && /Vocals/.test(r1.fil.vokal) && /Instrumental/.test(r1.fil.resten) && r1.synlig && /Fordelt efter filnavnet: .*Trommer ← 1_sang_\(Drums\)\.wav/.test(r1.linje) && /Resten ← 1_sang_\(Instrumental\)\.wav/.test(r1.linje) && /vælg en anden fil på rækken/.test(r1.linje), `Vælg 4 filer …: Drums → Trommer, Bass → Bas, Vocals → Vokal, Instrumental → Resten, og linjen siger hvad der kom hvor`, JSON.stringify(r1));
    /* mappe: samme filer + noter.txt (springes over); "No Vocals" går ikke til Vokal, en fil uden kendt ord får den ledige plads */
    await side.evaluate(() => stemRyd(true)); await side.waitForTimeout(300);
    const uvr2 = path.join(tmp, 'uvr2'); fs.mkdirSync(uvr2);
    fs.copyFileSync(path.join(tmp, 'resten.wav'), path.join(uvr2, 'sang (No Vocals).wav')); fs.copyFileSync(path.join(tmp, 'vokal.wav'), path.join(uvr2, 'sang (Vocals).wav')); fs.copyFileSync(path.join(tmp, 'trommer.wav'), path.join(uvr2, 'sang (Drums).wav')); fs.copyFileSync(path.join(tmp, 'bas.wav'), path.join(uvr2, 'spor4.wav')); fs.writeFileSync(path.join(uvr2, 'noter.txt'), 'x');
    let mappeOk = true; try { await side.setInputFiles('#stem-mappe', uvr2); } catch (e) { mappeOk = false; await side.setInputFiles('#stem-flere', fs.readdirSync(uvr2).map(n => path.join(uvr2, n))); }
    await side.waitForFunction(() => STEM_SPOR.every(([s]) => STEM.buf[s]), null, { timeout: 60000 }); await side.waitForTimeout(400);
    const r2 = await side.evaluate(() => ({ fil: Object.fromEntries(STEM_SPOR.map(([s]) => [s, STEM.fil[s]])), linje: document.getElementById('stem-fordelt').textContent }));
    T.tjek(/No Vocals/.test(r2.fil.resten) && /\(Vocals\)/.test(r2.fil.vokal) && /Drums/.test(r2.fil.trommer) && /spor4/.test(r2.fil.bas) && /Bas ← spor4\.wav \(ledig plads\)/.test(r2.linje) && !/noter/.test(r2.linje), `${mappeOk ? 'Vælg en mappe …' : 'Vælg 4 filer … (mappe-valg kunne ikke sendes af testbrowseren)'}: No Vocals → Resten, spor4.wav → den ledige plads Bas, noter.txt springes over`, JSON.stringify(r2));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
