/* Trin 2 til 4 · Run 1: opstart uden fejl, afspiller, tidslinje (zoom, snap, følg, loop), filer, status, sprog,
   det, der huskes, og skærmbilleder i 1920 × 1080, 2560 × 1440 og 3840 × 2160.
   Knapper prøves med rigtige museklik og rigtige tastetryk.
   Brug: node rytme-studio/tests/2-run1.js */
const fs = require('fs'), path = require('path');
const { FIL, UD, playwright, lavWav, tjekker, sikrUd } = require('./faelles');

module.exports = async function run1() {
  sikrUd();
  const T = tjekker('2 · Run 1: afspiller, tidslinje, filer og status');
  const { chromium } = playwright();
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const kontekst = await browser.newContext({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const page = await kontekst.newPage();
  const fejl = [];
  page.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });

  const aabn = async () => {
    await page.goto('file://' + FIL);
    await page.evaluate(() => { window.__klar = 0; RS.Events.on('analyse:boelgeform', () => { window.__klar++; }); });
    await page.waitForTimeout(250);
  };
  /* Kør en handling, der åbner en sang, og vent til bølgeformen er tegnet. */
  const efterIndlaest = async handling => {
    const n = await page.evaluate(() => window.__klar);
    await handling();
    await page.waitForFunction(k => window.__klar > k, n, { timeout: 30000 });
    await page.waitForTimeout(200);
  };
  const S = sti => page.evaluate(s => RS.State.hent(s), sti);
  const pos = () => page.evaluate(() => RS.Audio.position());
  const tilstand = () => page.evaluate(() => RS.Audio.tilstand());
  const tekst = id => page.evaluate(i => document.getElementById(i).textContent, id);
  const statusTekst = () => tekst('statusTekst');
  const visning = () => page.evaluate(() => RS.Tidslinje.visning());
  const kasse = async sel => page.locator(sel).boundingBox();
  /* Et punkt på den store bølgeform: fx = 0 til 1 hen ad bredden, fy = 0 til 1 ned ad højden. */
  const tlPunkt = async (fx, fy = 0.6) => { const k = await kasse('#tlLaerred'); return { x: k.x + k.width * fx, y: k.y + k.height * fy, k }; };
  const tlKlik = async (fx, fy) => { const p = await tlPunkt(fx, fy); await page.mouse.click(p.x, p.y); await page.waitForTimeout(60); };
  /* Skærmpunktet for en tid i sangen. */
  const tidX = async t => { const k = await kasse('#tlLaerred'); return k.x + await page.evaluate(tt => RS.Tidslinje.tidTilX(tt), t); };
  const naer = (a, b, tol) => Math.abs(a - b) <= tol;

  /* ---------- A · Opstart ---------- */
  console.log('A · Opstart');
  await aabn();
  T.tjek((await page.title()).includes('Rytme Studio 0.3'), 'titlen er "Rytme Studio 0.3"');
  T.tjek((await statusTekst()).startsWith('Klar'), 'status siger Klar', await statusTekst());
  T.tjek(await page.locator('#spilKnap').isDisabled(), 'Afspil er slået fra, når der ikke er nogen lydfil');
  T.tjek(await page.locator('#previewTom').isVisible(), 'forsiden "Slip en lydfil her" vises');
  T.tjek(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'intet ruller til siden ved 1920 × 1080');
  T.tjek(await page.evaluate(() => Object.keys(window).filter(k => /^RS$/.test(k)).length === 1 && typeof RS.Audio === 'object'), 'ét globalt navn (RS) med modulerne på');
  await page.screenshot({ path: path.join(UD, 'run1-1-tom-1920.png') });

  /* ---------- B · Demo-lyden ---------- */
  console.log('B · Demo-lyden');
  await efterIndlaest(() => page.locator('.preview-tom [data-kommando="fil.demo"]').click());
  T.tjek((await statusTekst()).includes('er klar'), 'status: demo-lyden er klar', await statusTekst());
  T.tjek((await tekst('tidIalt')) === '0:32', 'længden er 0:32', await tekst('tidIalt'));
  T.tjek((await page.inputValue('#bpmFelt')) === '120', 'tempoet er 120 BPM');
  T.tjek((await S('sang.gitter.kilde')) === 'demo' && (await tekst('tempoInfo')).includes('demo-lyden'), 'der står, at tempoet kommer fra demo-lyden');
  T.tjek(!(await page.locator('#previewTom').isVisible()) && await page.locator('#spilKnap').isEnabled(), 'forsiden er væk, og Afspil kan bruges');
  const top = await page.evaluate(() => { const v = RS.Tidslinje.visning(); return v.passerAlt; });
  T.tjek(top === true, 'tidslinjen viser hele sangen');

  /* ---------- C · Afspil og pause ---------- */
  console.log('C · Afspil og pause');
  await page.locator('#spilKnap').click();
  await page.waitForTimeout(1500);
  let p = await pos();
  T.tjek((await tilstand()) === 'spiller' && p > 0.9 && p < 2.6, 'klik på Afspil: sangen spiller, og positionen løber', p);
  const live = await page.evaluate(() => ({ db: RS.Analyse.live.rmsDb, fyld: document.getElementById('maalerFyld').style.transform, ikon: document.getElementById('spilIkon').getAttribute('href') }));
  T.tjek(live.db > -50 && live.db < 0, 'niveauet måles (RMS mellem −50 og 0 dB)', live.db);
  T.tjek(parseFloat(live.fyld.replace('scaleX(', '')) > 0.1, 'måleren i kontrolpanelet bevæger sig', live.fyld);
  T.tjek(live.ikon === '#i-pause', 'knappen viser pause, mens der spilles');
  T.tjek((await tekst('tidNu')) !== '0:00,0', 'tiden i playerbaren tæller', await tekst('tidNu'));
  await page.keyboard.press('Space');
  const p1 = await pos(); await page.waitForTimeout(300); const p2 = await pos();
  T.tjek((await tilstand()) === 'pause' && p1 === p2, 'Mellemrum: pause, og positionen står stille', [p1, p2]);

  /* ---------- D · Søgning ---------- */
  console.log('D · Søgning');
  await tlKlik(0.5);
  T.tjek(naer(await pos(), 16, 0.15), 'klik midt på bølgeformen søger til 0:16', await pos());
  const sk = await kasse('#soeg');
  await page.mouse.click(sk.x + sk.width * 0.25, sk.y + sk.height / 2);
  await page.waitForTimeout(80);
  T.tjek(naer(await pos(), 8, 0.6), 'klik en fjerdedel inde på playerbarens skyder søger til cirka 0:08', await pos());
  p = await pos();
  await page.keyboard.press('ArrowRight');
  T.tjek(naer(await pos(), p + 5, 0.01), 'pil højre: 5 sekunder frem');
  await page.keyboard.press('Shift+ArrowLeft');
  T.tjek(naer(await pos(), p + 4, 0.01), 'Shift + pil venstre: 1 sekund tilbage');
  await page.keyboard.press('Home');
  T.tjek((await pos()) === 0, 'Home: til start');

  /* ---------- E · Zoom ---------- */
  console.log('E · Zoom');
  let pt = await tlPunkt(0.5);
  await page.mouse.move(pt.x, pt.y);
  const foerPps = (await visning()).pps;
  const tFoer = await page.evaluate(x => RS.Tidslinje.xTilTid(x), pt.k.width * 0.5);
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(120);
  const tEfter = await page.evaluate(x => RS.Tidslinje.xTilTid(x), pt.k.width * 0.5);
  let v = await visning();
  T.tjek(v.pps > foerPps * 1.5 && !v.passerAlt, 'musehjul zoomer ind', [foerPps, v.pps]);
  T.tjek(naer(tFoer, tEfter, 0.05), 'tiden under musen bliver på sin plads, når der zoomes', [tFoer, tEfter]);
  T.tjek(Number(await page.inputValue('#zoom')) > 0, 'zoom-skyderen følger med');
  T.tjek((await tekst('tlUdsnit')).includes('–'), 'udsnittet står med tal over tidslinjen', await tekst('tlUdsnit'));
  const pps1 = v.pps;
  await page.locator('[data-kommando="tidslinje.zoomInd"]').click();
  T.tjek((await visning()).pps > pps1 * 1.3, 'knappen + zoomer ind');
  await page.keyboard.press('-');
  T.tjek(naer((await visning()).pps, pps1, pps1 * 0.02), 'tasten − zoomer ud igen');
  const ok0 = await kasse('#tlOversigt');
  await page.mouse.click(ok0.x + ok0.width * 0.6, ok0.y + ok0.height / 2);
  await page.waitForTimeout(80);
  v = await visning();
  T.tjek(naer(v.start + v.synlig / 2, 32 * 0.6, 0.3), 'klik i oversigten flytter udsnittet derhen (midten ved 0:19,2)', v.start + v.synlig / 2);
  await page.locator('[data-kommando="tidslinje.visAlt"]').click();
  T.tjek((await visning()).passerAlt, 'Hele sangen viser alt igen');

  /* ---------- F · Snap ---------- */
  console.log('F · Snap til slag og takt');
  await page.locator('#snapValg [data-snap="takt"]').click();
  await tlKlik(0.33);
  p = await pos();
  T.tjek((await S('tidslinje.snap')) === 'takt' && naer(p % 2, 0, 1e-6) && naer(p, 10, 0.01), 'Snap Takt: klik ved 10,56 s lander på takten 0:10', p);
  await page.keyboard.down('Alt'); await tlKlik(0.33); await page.keyboard.up('Alt');
  T.tjek(naer(await pos(), 32 * 0.33, 0.1), 'Alt holdt nede: uden snap', await pos());
  await page.locator('#snapValg [data-snap="slag"]').click();
  await tlKlik(0.33);
  T.tjek(naer(await pos(), 10.5, 1e-6), 'Snap Slag: lander på slaget 0:10,5', await pos());

  /* ---------- G · Loop ---------- */
  console.log('G · Loop A til B');
  await page.locator('#snapValg [data-snap="takt"]').click();
  const a0 = await tlPunkt(0.26), b0 = await tlPunkt(0.36);
  await page.keyboard.down('Shift');
  await page.mouse.move(a0.x, a0.y); await page.mouse.down(); await page.mouse.move(b0.x, b0.y, { steps: 6 }); await page.mouse.up();
  await page.keyboard.up('Shift');
  let l = await S('sang.loop');
  T.tjek(l.tilstand === 'ab' && l.a === 8 && l.b === 12, 'Shift + træk markerer A til B, snappet til takter (0:08 til 0:12)', l);
  T.tjek((await tekst('loopATal')) === '0:08,00' && (await tekst('loopBTal')) === '0:12,00', 'A og B står i kontrolpanelet', [await tekst('loopATal'), await tekst('loopBTal')]);
  T.tjek((await page.getAttribute('#loopKnap', 'aria-pressed')) === 'true', 'loop-knappen i playerbaren lyser');
  const kB = await kasse('#tlLaerred'), xB = await tidX(12), xMaal = await tidX(14.1);
  await page.mouse.move(xB - 8, kB.y + 8); await page.mouse.down(); await page.mouse.move(xMaal, kB.y + 12, { steps: 6 }); await page.mouse.up();
  l = await S('sang.loop');
  T.tjek(l.a === 8 && l.b === 14 && l.tilstand === 'ab', 'håndtaget B kan trækkes (til 0:14)', l);
  const xA = await tidX(8), xMaalA = await tidX(5.9);
  await page.mouse.move(xA - 8, kB.y + 8); await page.mouse.down(); await page.mouse.move(xMaalA, kB.y + 12, { steps: 6 }); await page.mouse.up();
  l = await S('sang.loop');
  T.tjek(l.a === 6 && l.b === 14, 'håndtaget A kan trækkes (til 0:06)', l);
  await page.locator('#snapValg [data-snap="fra"]').click();
  await page.mouse.click(await tidX(13.2), kB.y + kB.height * 0.6);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1700);
  p = await pos();
  T.tjek((await tilstand()) === 'spiller' && p >= 6 && p < 8, 'afspilning fra 0:13,2 hopper tilbage til A ved B (nu cirka 0:06,9)', p);
  await page.keyboard.press('KeyL');
  T.tjek((await S('sang.loop.tilstand')) === 'fra' && (await page.getAttribute('#loopKnap', 'aria-pressed')) === 'false', 'L slår loop fra; A og B bliver stående');
  await page.keyboard.press('Space');
  await page.locator('#loopValg [data-loop="sang"]').click();
  T.tjek((await S('sang.loop.tilstand')) === 'sang', 'valget Hele sangen');
  await page.locator('#loopRydKnap').click();
  l = await S('sang.loop');
  T.tjek(l.a === null && l.b === null && l.tilstand === 'sang', 'Ryd A og B fjerner punkterne', l);
  T.tjek(await page.locator('#loopValg [data-loop="ab"]').isDisabled(), 'A til B kan ikke vælges uden punkter');
  await page.locator('#loopValg [data-loop="fra"]').click();
  await tlKlik(0.125); await page.keyboard.press('KeyA');
  await tlKlik(0.1875); await page.keyboard.press('KeyB');
  l = await S('sang.loop');
  T.tjek(l.tilstand === 'ab' && naer(l.a, 4, 0.05) && naer(l.b, 6, 0.05), 'tasterne A og B sætter punkterne ved afspilningsstregen', l);
  await page.locator('[data-loop="ab"]').waitFor();

  /* ---------- H · Lydstyrke ---------- */
  console.log('H · Lydstyrke');
  const vk = await kasse('#volumen');
  await page.mouse.click(vk.x + vk.width * 0.3, vk.y + vk.height / 2);
  const vol = await S('lyd.volumen');
  T.tjek(vol > 0.2 && vol < 0.4 && (await tekst('volTal')) === Math.round(vol * 100) + ' %', 'klik på lydstyrke-skyderen sætter cirka 30 %', vol);
  await page.locator('#muteKnap').click();
  T.tjek((await S('lyd.mute')) === true && (await page.getAttribute('#muteIkon', 'href')) === '#i-lydfra', 'klik på højttaleren slår lyden fra');
  await page.keyboard.press('KeyM');
  T.tjek((await S('lyd.mute')) === false, 'M slår lyden til igen');

  /* ---------- I · Følg afspilning ---------- */
  console.log('I · Følg afspilning');
  await page.locator('#loopValg [data-loop="fra"]').click();
  pt = await tlPunkt(0.5);
  await page.mouse.move(pt.x, pt.y);
  await page.mouse.wheel(0, -1400);
  await page.keyboard.press('Home');
  await page.keyboard.press('Space');
  await page.waitForTimeout(2500);
  v = await visning(); p = await pos();
  const stregAndel = (p - v.start) / v.synlig;
  T.tjek(v.start > 0.3 && naer(stregAndel, 0.3, 0.03), 'udsnittet følger med, og stregen står 30 % inde', [v.start, stregAndel]);
  await page.keyboard.down('Shift'); await page.mouse.wheel(0, 300); await page.keyboard.up('Shift');
  await page.waitForTimeout(100);
  T.tjek((await S('tidslinje.foelg')) === false && (await statusTekst()).includes('Følg afspilning er slået fra'), 'ruller man selv, slås Følg fra, og det står i status', await statusTekst());
  T.tjek((await page.getAttribute('#foelgKnap', 'aria-pressed')) === 'false', 'knappen Følg afspilning viser, at den er fra');
  await page.locator('#foelgKnap').click();
  T.tjek((await S('tidslinje.foelg')) === true, 'klik på Følg afspilning tænder den igen');
  await page.keyboard.press('Space');
  await page.keyboard.press('0');
  T.tjek((await visning()).passerAlt, 'tasten 0 viser hele sangen');

  /* ---------- J · Tempo-gitter ---------- */
  console.log('J · Tempo-gitter');
  await page.locator('#snapValg [data-snap="slag"]').click();
  await page.locator('#tempoRydKnap').click();
  T.tjek((await S('sang.gitter.bpm')) === null && await page.locator('#snapHint').isVisible(), 'Ryd tempo: tempoet er væk, og der står "Snap venter på et tempo"');
  for (let i = 0; i < 5; i++) { await page.keyboard.press('KeyT'); await page.waitForTimeout(500); }
  let g = await S('sang.gitter');
  T.tjek(g.bpm > 112 && g.bpm < 128 && g.kilde === 'tap', 'Tap fem gange med et halvt sekund imellem giver cirka 120 BPM', g);
  await page.locator('#bpmFelt').fill('96');
  await page.keyboard.press('Enter');
  g = await S('sang.gitter');
  T.tjek(g.bpm === 96 && g.kilde === 'manuel' && (await tekst('tempoInfo')).includes('Sat manuelt'), 'et tal i feltet sætter tempoet (96, sat manuelt)', g);
  await page.selectOption('#slagFelt', '3');
  T.tjek((await S('sang.gitter.slagPrTakt')) === 3, 'Slag pr. takt kan ændres (3)');
  await tlKlik(0.25, 0.6);
  await page.locator('[data-kommando="tempo.takt1"]').click();
  g = await S('sang.gitter');
  T.tjek(naer(g.start, await pos(), 0.002) && g.start > 7, 'Takt 1 her lægger takt 1 ved afspilningsstregen', g.start);
  await page.locator('#snapValg [data-snap="fra"]').click();

  /* ---------- K · Sprog ---------- */
  console.log('K · Dansk og engelsk');
  await page.locator('#sprogValg [data-sprog="en"]').click();
  T.tjek((await page.locator('.tl h2').textContent()) === 'Timeline' && (await page.evaluate(() => document.documentElement.lang)) === 'en', 'English: teksterne skifter');
  T.tjek((await tekst('tempoInfo')).includes('beats per bar') && (await page.getAttribute('#spilKnap', 'title')) === 'Play or pause (Space)', 'også tempo-teksten og tooltips er på engelsk');
  await page.screenshot({ path: path.join(UD, 'run1-2-english-1920.png') });
  await page.locator('#sprogValg [data-sprog="da"]').click();
  T.tjek((await page.locator('.tl h2').textContent()) === 'Tidslinje', 'Dansk igen');

  /* ---------- L · Lydfiler ---------- */
  console.log('L · Lydfiler');
  const wav = path.join(UD, 'test-tone.wav'), daarlig = path.join(UD, 'ikke-lyd.mp3');
  fs.writeFileSync(wav, lavWav(3));
  fs.writeFileSync(daarlig, 'Dette er ikke lyd.');
  await efterIndlaest(() => page.setInputFiles('#filValg', wav));
  T.tjek((await tekst('plTitel')) === 'test-tone.wav' && naer(await page.evaluate(() => RS.Audio.varighed()), 3, 0.05), 'en WAV-fil kan vælges og afkodes (3 sekunder)');
  T.tjek((await tekst('infoStoerrelse')).includes('KB') && (await tekst('infoKanaler')) === 'Stereo', 'fil-oplysningerne vises (størrelse og kanaler)', await tekst('infoStoerrelse'));
  T.tjek((await page.locator('#sangListe button').count()) === 2 && await page.locator('#sangBoks').isVisible(), 'listen "Åbnet i denne omgang" har to sange');
  T.tjek((await S('sang.gitter.bpm')) === null && (await S('sang.loop.a')) === null, 'en ny sang begynder uden loop og tempo');
  await page.setInputFiles('#filValg', daarlig);
  await page.waitForFunction(() => document.getElementById('statusPrik').dataset.type === 'fejl', null, { timeout: 10000 });
  T.tjek((await statusTekst()).includes('Kunne ikke afkode ikke-lyd.mp3'), 'en fil, der ikke er lyd, giver en tydelig fejl', await statusTekst());
  T.tjek((await tekst('plTitel')) === 'test-tone.wav' && (await page.locator('#sangListe button').count()) === 2, 'den gamle sang bliver, og den dårlige fil kommer ikke på listen');
  await efterIndlaest(() => page.locator('#sangListe button').first().click());
  T.tjek((await tekst('plTitel')).startsWith('Demo-lyd') && (await statusTekst()).includes('hentet fra sidst'), 'klik på demo-lyden i listen åbner den, med loop og tempo fra før', await statusTekst());
  T.tjek((await S('sang.gitter.bpm')) === 96 && (await S('sang.gitter.slagPrTakt')) === 3, 'tempoet 96 og 3 slag pr. takt er husket for demo-lyden');
  await efterIndlaest(() => page.evaluate(bytes => {
    const dt = new DataTransfer();
    dt.items.add(new File([new Uint8Array(bytes)], 'sluppet.wav', { type: 'audio/wav' }));
    window.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
  }, [...lavWav(2)]));
  T.tjek((await tekst('plTitel')) === 'sluppet.wav', 'en fil, der slippes i vinduet, åbnes (prøvet med en efterlignet slip-hændelse)');

  /* ---------- M · Sangens slutning og Stop ---------- */
  console.log('M · Slutning og Stop');
  await tlKlik(0.8);
  await page.keyboard.press('Space');
  await page.waitForTimeout(900);
  T.tjek((await tilstand()) === 'stoppet' && (await pos()) === 0, 'ved sangens slutning stopper afspilningen og går til start', [await tilstand(), await pos()]);
  await page.keyboard.press('Space');
  await page.waitForTimeout(350);
  await page.locator('[data-kommando="afspiller.stop"]').click();
  T.tjek((await tilstand()) === 'stoppet' && (await pos()) === 0, 'klik på Stop: stoppet og ved start');

  /* ---------- N · Status-listen ---------- */
  console.log('N · Seneste beskeder');
  await page.locator('#status').click();
  const linjer = await page.locator('#logListe li').allTextContents();
  T.tjek(await page.locator('#log').isVisible() && linjer.length >= 5 && !linjer.some(x => x.includes('Afkoder') || x.includes('Tegner')), 'klik på status viser de seneste beskeder (uden midlertidige "arbejder"-linjer)', linjer.length);
  await page.screenshot({ path: path.join(UD, 'run1-3-beskeder-1920.png') });
  await page.keyboard.press('Escape');
  T.tjek(!(await page.locator('#log').isVisible()), 'Esc lukker listen');

  /* ---------- O · Det, der huskes ---------- */
  console.log('O · Det, der huskes (localStorage)');
  await page.locator('#sprogValg [data-sprog="en"]').click();
  await page.evaluate(() => RS.State.gemNu());
  await aabn();
  T.tjek(naer(await S('lyd.volumen'), vol, 1e-9) && (await S('sprog')) === 'en' && (await statusTekst()).startsWith('Ready'), 'efter genindlæsning: lydstyrke og sprog er husket');
  await page.locator('#sprogValg [data-sprog="da"]').click();
  await efterIndlaest(() => page.locator('.side [data-kommando="fil.demo"]').click());
  T.tjek((await S('sang.gitter.bpm')) === 96 && (await S('sang.loop.b')) !== null, 'demo-lydens tempo og loop-punkter er husket efter genindlæsning');
  await page.locator('[data-kommando="indstillinger.nulstil"]').click();
  T.tjek((await S('lyd.volumen')) === 0.8 && (await S('tidslinje.snap')) === 'fra' && (await S('sang.gitter.bpm')) === 96, 'Tilbage til standard: lydstyrke og snap sættes tilbage; sangens tempo bliver');

  /* ---------- P · Skærmbilleder i tre størrelser ---------- */
  console.log('P · Skærmbilleder');
  await page.locator('#bpmFelt').fill('120'); await page.keyboard.press('Enter');
  await page.selectOption('#slagFelt', '4');
  await page.evaluate(() => { RS.State.saet('sang.gitter.start', 0); RS.Audio.saetLoopOmraade(8, 12); });
  for (const [b, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
    await page.setViewportSize({ width: b, height: h });
    await page.waitForTimeout(300);
    await page.keyboard.press('0');
    pt = await tlPunkt(0.3);
    await page.mouse.move(pt.x, pt.y);
    await page.mouse.wheel(0, -520);
    await page.mouse.click(await tidX(6), pt.y);
    await page.keyboard.press('Space');
    await page.waitForTimeout(2600);
    const m = await page.evaluate(() => ({ fps: Math.round(RS.Rendering.fps()), over: document.documentElement.scrollWidth > innerWidth || document.documentElement.scrollHeight > innerHeight, b: document.getElementById('tlLaerred').width }));
    await page.screenshot({ path: path.join(UD, 'run1-4-spiller-' + b + '.png') });
    await page.keyboard.press('Space');
    T.tjek(!m.over && m.b > b * 0.5, b + ' × ' + h + ': alt er inden for skærmen (' + m.fps + ' billeder i sekundet i testbrowseren)', m);
  }

  /* ---------- Q · Smalle vinduer ---------- */
  console.log('Q · Smalle vinduer');
  for (const [b, h] of [[1000, 800], [600, 900]]) {
    await page.setViewportSize({ width: b, height: h });
    await page.waitForTimeout(300);
    const over = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    await page.screenshot({ path: path.join(UD, 'run1-5-smal-' + b + '.png') });
    T.tjek(!over, b + ' × ' + h + ': intet ruller til siden');
  }

  /* ---------- Fejl i konsollen ---------- */
  T.tjek(fejl.length === 0, 'ingen pageerror og ingen fejl i konsollen under hele testen', fejl);
  await browser.close();
  return T.slut();
};

if (require.main === module) module.exports().then(ok => process.exit(ok ? 0 : 1)).catch(e => { console.error(e); process.exit(1); });
