/* Trin 4 · De tre stile (Glas, Neon, Analog): skift med rigtige klik, tjek at stilen huskes og at lærrederne tegner,
   og tag skærmbilleder af hver stil (forside 1920, spiller 1920 og 3840).
   Brug: node rytme-studio/tests/4-stile.js */
const path = require('path');
const { FIL, UD, playwright, tjekker, sikrUd } = require('./faelles');
module.exports = async function stile() {
  sikrUd();
  const T = tjekker('4 · De tre stile');
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const kontekst = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await kontekst.newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  await page.goto('file://' + FIL);
  const malet = id => page.evaluate(i => { const l = document.getElementById(i), d = l.getContext('2d').getImageData(0, 0, l.width, l.height).data; let n = 0; for (let k = 3; k < d.length; k += 4 * 97) if (d[k] > 20) n++; return n; }, id);
  for (const stil of ['glas', 'neon', 'analog']) {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.locator('#stilValg [data-stil="' + stil + '"]').click();
    T.tjek((await page.evaluate(() => document.documentElement.dataset.stil)) === stil && (await page.evaluate(() => RS.State.hent('stil'))) === stil, stil + ': klik skifter stilen');
    if (!(await page.evaluate(() => RS.Audio.harSang()))) {
      await page.waitForTimeout(250);
      await page.screenshot({ path: path.join(UD, 'stil-' + stil + '-forside-1920.png') });
    }
  }
  await page.locator('.preview-tom [data-kommando="fil.demo"]').click();
  await page.waitForFunction(() => RS.Audio.harSang() && document.getElementById('statusPrik').dataset.type === 'ok', null, { timeout: 20000 });
  await page.evaluate(() => RS.Audio.saetLoopOmraade(8, 12));
  for (const stil of ['glas', 'neon', 'analog']) {
    for (const [b, h] of [[1920, 1080], [3840, 2160]]) {
      await page.setViewportSize({ width: b, height: h });
      await page.locator('#stilValg [data-stil="' + stil + '"]').click();
      await page.waitForTimeout(250);
      await page.keyboard.press('0');
      const k = await page.locator('#tlLaerred').boundingBox();
      await page.mouse.move(k.x + k.width * 0.3, k.y + k.height * 0.6);
      await page.mouse.wheel(0, -520);
      await page.mouse.click(k.x + await page.evaluate(() => RS.Tidslinje.tidTilX(5)), k.y + k.height * 0.6);
      if ((await page.evaluate(() => RS.Audio.tilstand())) !== 'spiller') await page.locator('#spilKnap').click();
      await page.waitForTimeout(3600);
      const spiller = (await page.evaluate(() => RS.Audio.tilstand())) === 'spiller';
      const m = { tl: await malet('tlLaerred'), pv: await malet('previewLaerred'), fps: await page.evaluate(() => Math.round(RS.Rendering.fps())), over: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight) };
      await page.screenshot({ path: path.join(UD, 'stil-' + stil + '-' + b + '.png') });
      await page.locator('#spilKnap').click();
      T.tjek(spiller && m.tl > 200 && m.pv > 200 && !m.over, stil + ' ' + b + ' × ' + h + ': tidslinje og preview er tegnet, alt er inden for skærmen (' + m.fps + ' billeder i sekundet)', m);
    }
  }
  await page.evaluate(() => RS.State.gemNu());
  await page.reload();
  T.tjek((await page.evaluate(() => document.documentElement.dataset.stil)) === 'analog', 'stilen er husket efter genindlæsning');
  T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl);
  await browser.close();
  return T.slut();
};
if (require.main === module) module.exports().then(ok => process.exit(ok ? 0 : 1)).catch(e => { console.error(e); process.exit(1); });
