/* Trin 4 · Run 1: en mp3-fil på 4 minutter (det mest brugte format). Filen laves med ffmpeg; findes ffmpeg ikke, springes testen over.
   Tjekker afkodning, længde, tiden det tager, og at tidslinjen kan zoomes helt ind og følge afspilningen.
   Brug: node rytme-studio/tests/3-mp3.js */
const fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const { FIL, UD, playwright, tjekker, sikrUd } = require('./faelles');

module.exports = async function mp3() {
  sikrUd();
  const T = tjekker('3 · Run 1: mp3-fil på 4 minutter');
  const fil = path.join(UD, 'test-4min.mp3');
  try {
    if (!fs.existsSync(fil)) {
      execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'lavfi', '-i',
        'aevalsrc=0.5*sin(2*PI*110*t)*exp(-6*mod(t\\,0.5))+0.2*sin(2*PI*440*t)*(0.5+0.5*sin(2*PI*0.05*t))|0.5*sin(2*PI*110*t)*exp(-6*mod(t\\,0.5))+0.2*sin(2*PI*660*t)*(0.5+0.5*cos(2*PI*0.05*t)):s=44100:d=240',
        '-codec:a', 'libmp3lame', '-b:a', '192k', fil]);
    }
  } catch (e) {
    console.log('  (sprunget over: ffmpeg kunne ikke lave mp3-filen: ' + String(e.message).split('\n')[0] + ')');
    return T.slut();
  }
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const fejl = [];
  page.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  await page.goto('file://' + FIL);
  await page.evaluate(() => {
    window.__klar = 0; window.__beskeder = [];
    RS.Events.on('analyse:boelgeform', () => { window.__klar++; });
    RS.Events.on('status', s => window.__beskeder.push(s.noegle));
    RS.Events.on('analyse:fremskridt', f => window.__beskeder.push('fremskridt ' + Math.round(f.p * 100)));
  });
  const t0 = Date.now();
  await page.setInputFiles('#filValg', fil);
  let ok = true;
  try { await page.waitForFunction(() => window.__klar > 0, null, { timeout: 60000 }); } catch (e) { ok = false; }
  const sek = (Date.now() - t0) / 1000;
  const status = await page.evaluate(() => document.getElementById('statusTekst').textContent);
  if (!T.tjek(ok, 'mp3-filen bliver afkodet (' + sek.toFixed(1) + ' s i testbrowseren)', status)) { await browser.close(); return T.slut(); }
  const m = await page.evaluate(() => ({ varighed: RS.Audio.varighed(), meta: RS.Audio.meta(), beskeder: window.__beskeder }));
  T.tjek(Math.abs(m.varighed - 240) < 0.2, 'længden er 4:00', m.varighed);
  T.tjek(m.beskeder.includes('status.laeser') && m.beskeder.includes('status.afkoder'), 'status viser Læser og Afkoder undervejs');
  T.tjek(m.beskeder.filter(x => x.startsWith('fremskridt')).length >= 2, 'bølgeformen melder fremskridt undervejs', m.beskeder.filter(x => x.startsWith('fremskridt')));
  T.tjek((await page.evaluate(() => document.getElementById('infoStoerrelse').textContent)).includes('MB'), 'størrelsen vises i MB');

  /* Zoom helt ind (de rigtige samples læses), og tilbage */
  const k = await page.locator('#tlLaerred').boundingBox();
  await page.mouse.click(k.x + k.width * 0.5, k.y + k.height * 0.6);
  await page.evaluate(() => { document.getElementById('zoom').value = 1000; document.getElementById('zoom').dispatchEvent(new Event('input')); });
  await page.waitForTimeout(200);
  let v = await page.evaluate(() => RS.Tidslinje.visning());
  T.tjek(v.pps === 4000 && v.synlig < 0.5 && Math.abs(v.start + v.synlig / 2 - 120) < 0.3, 'zoomet helt ind omkring afspilningsstregen (4000 punkter pr. sekund)', v);
  await page.screenshot({ path: path.join(UD, 'run1-6-mp3-zoomet-ind.png') });
  await page.evaluate(() => { document.getElementById('zoom').value = 450; document.getElementById('zoom').dispatchEvent(new Event('input')); });
  await page.keyboard.press('Space');
  await page.waitForTimeout(2000);
  const r = await page.evaluate(() => ({ v: RS.Tidslinje.visning(), pos: RS.Audio.position(), fps: RS.Rendering.fps(), db: RS.Analyse.live.rmsDb }));
  T.tjek(r.pos > 121 && r.pos < 123.5 && r.db > -40, 'afspilning midt i sangen: positionen løber, og niveauet måles', r);
  T.tjek(Math.abs((r.pos - r.v.start) / r.v.synlig - 0.3) < 0.03 && r.fps > 40, 'tidslinjen følger afspilningen (' + Math.round(r.fps) + ' billeder i sekundet)', r.fps);
  await page.screenshot({ path: path.join(UD, 'run1-7-mp3-spiller.png') });
  await page.keyboard.press('Space');
  T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl);
  await browser.close();
  return T.slut();
};

if (require.main === module) module.exports().then(ok => process.exit(ok ? 0 : 1)).catch(e => { console.error(e); process.exit(1); });
