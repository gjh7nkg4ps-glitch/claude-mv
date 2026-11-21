/* Trin 4 · De fire opsætninger (Studie, Scene, Tidslinje, Fliser): skift med klik, alle dele kan ses og bruges,
   intet ruller, afspilning virker; skærmbilleder i 1920 og 3840.
   Brug: node rytme-studio/tests/5-opsaetninger.js */
const path = require('path');
const { FIL, UD, playwright, tjekker, sikrUd } = require('./faelles');
module.exports = async function opsaetninger() {
  sikrUd();
  const T = tjekker('5 · De fire opsætninger');
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 } })).newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  await page.goto('file://' + FIL);
  await page.locator('.preview-tom [data-kommando="fil.demo"]').click();
  await page.waitForFunction(() => RS.Audio.harSang() && document.getElementById('statusPrik').dataset.type === 'ok', null, { timeout: 20000 });
  await page.evaluate(() => RS.Audio.saetLoopOmraade(8, 12));
  const synlig = sel => page.evaluate(q => { const e = document.querySelector(q), r = e.getBoundingClientRect(); return r.width > 20 && r.height >= 8 && r.left >= -1 && r.top >= -1 && r.right <= innerWidth + 1 && r.bottom <= innerHeight + 1; }, sel);
  for (const [b, h] of [[1920, 1080], [3840, 2160]]) {
    await page.setViewportSize({ width: b, height: h });
    for (const l of ['studie', 'scene', 'tidslinje', 'fliser']) {
      await page.locator('#layoutValg [data-layout="' + l + '"]').click();
      await page.waitForTimeout(350);
      if (l === 'scene' && (await page.evaluate(() => RS.State.hent('panelAaben')))) await page.locator('#panelKnap').click();
      await page.keyboard.press('0');
      const k = await page.locator('#tlLaerred').boundingBox();
      await page.mouse.move(k.x + k.width * 0.3, k.y + k.height * 0.6);
      await page.mouse.wheel(0, -520);
      await page.mouse.click(k.x + await page.evaluate(() => RS.Tidslinje.tidTilX(5)), k.y + k.height * 0.6);
      await page.locator('#spilKnap').click();
      await page.waitForTimeout(3200);
      const m = await page.evaluate(() => ({ spiller: RS.Audio.tilstand() === 'spiller', over: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight, fps: Math.round(RS.Rendering.fps()), tl: document.getElementById('tlLaerred').clientHeight, pv: [document.getElementById('previewLaerred').clientWidth, document.getElementById('previewLaerred').clientHeight] }));
      const dele = ['#spilKnap', '#tlLaerred', '#tlOversigt', '#soeg', '#volumen', '#status', '.nav', '[data-kommando="fil.aabn"]'];
      if (l !== 'scene') dele.push('#maaler', '#loopValg', '#bpmFelt', '.genveje summary', '[data-kommando="indstillinger.nulstil"]');
      const mangler = []; for (const d of dele) if (!(await synlig(d))) mangler.push(d);
      await page.screenshot({ path: path.join(UD, 'opsaetning-' + l + '-' + b + '.png') });
      T.tjek(m.spiller && !m.over && mangler.length === 0 && m.tl >= 80 && m.pv[0] > 300, l + ' ' + b + ' × ' + h + ': alle dele kan ses, intet ruller, sangen spiller (' + m.fps + ' billeder i sekundet; tidslinjen er ' + m.tl + ' høj)', { m, mangler });
      if (l === 'scene') {
        await page.locator('#panelKnap').click();
        await page.waitForTimeout(250);
        T.tjek(await synlig('#maaler') && await synlig('#bpmFelt'), 'scene ' + b + ': knappen Panel viser kontrolpanelet');
        await page.locator('.side').hover();
        await page.waitForTimeout(350);
        T.tjek(await synlig('[data-kommando="fil.demo"]'), 'scene ' + b + ': sidebaren folder sig ud, når musen er over den');
        await page.screenshot({ path: path.join(UD, 'opsaetning-scene-aaben-' + b + '.png') });
        await page.mouse.move(b / 2, h / 3);
        await page.locator('#panelKnap').click();
      }
      if (l !== 'scene' && b === 1920) {
        await page.locator('.genveje summary').click();
        await page.waitForTimeout(150);
        T.tjek(l === 'studie' || await synlig('.genveje dl'), l + ': Genveje kan åbnes og ses');
        await page.locator('.genveje summary').click();
      }
      await page.locator('#spilKnap').click();
    }
  }
  await page.setViewportSize({ width: 1000, height: 800 });
  await page.waitForTimeout(250);
  T.tjek(!(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)), 'smalt vindue (1000) med opsætningen Fliser valgt: den smalle opsætning bruges, intet ruller til siden');
  T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl);
  await browser.close();
  return T.slut();
};
if (require.main === module) module.exports().then(ok => process.exit(ok ? 0 : 1)).catch(e => { console.error(e); process.exit(1); });
