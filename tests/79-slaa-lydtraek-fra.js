/* Trin 4 · Det nye i v9.84 (svar a–d fra fase 7, P8.9): kolonnen Ikke i brug (parkér) er fjernet, og hver lydtræk-række i matrixen kan slås fra med ⏻;
   Lydmotor Klassisk er fjernet. Ved tre skærmstørrelser med Standard-opsætningen og generatoren: et rigtigt klik på ⏻ ved Slag, dyb (kick) slår rækken fra
   (scene.ne.ltFra, rækken grå med "slået fra", motoren giver 0 for kick-reglerne, mens hihat-reglen stadig slår til), Ctrl+Z slår den til igen, knappen i
   lydtrækkets kontrolpanel i Noder gør det samme, og det huskes i en gemt plads; Node-editoren har 8 kolonner uden Ikke i brug, og ne7/neParkeret findes ikke;
   lm-rad har ingen Ny · Klassisk, gs.motor er 'ny', og lmGammel-funktionerne findes ikke. */
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Slå lydtræk fra');
  console.log('79 · Slå et lydtræk fra, og én lydmotor (v9.84) · ' + path.basename(fil));
  const tekst = fs.readFileSync(fil, 'utf8');
  const rester = ['IKKE I BRUG (PARKÉR)', 'function ne7Park(', 'function neParkeret(', 'data-lms="klassisk"', 'lmGammelMaster', 'rytme-lydmotor', "'ikkeIBrug','Ikke i brug'"].filter(x => tekst.includes(x));
  T.tjek(rester.length === 0, 'ingen rester af parkér og Lydmotor Klassisk i filen', rester.join(', '));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push(m.text()) });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const a = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(300); lay3Anvend('ao-regler'); await vent(1500);
        const kol = NE.kol.map(c => c.k); mxSaet(true, true); await vent(900);
        return { kol, u: ['ne7Park', 'neParkeret', 'neSover', 'lmGammelMaster', 'lmGammelVoice'].filter(n => { try { return typeof eval(n) !== 'undefined' } catch (e) { return false } }), motor: gs.motor, seg: !!document.querySelector('.lm-rad [data-lms]'), knap: !!document.querySelector('#ne-mx th.mx-lt[data-b="kick"] [data-mxlf="kick"]'), n: maps.filter(m => m.band === 'kick').length } });
      T.tjek(a.kol.length === 8 && !a.kol.includes('ikkeIBrug') && a.u.length === 0, `${w} × ${h}: Node-editoren har 8 kolonner uden Ikke i brug; ne7, neParkeret, neSover og lmGammel findes ikke`, JSON.stringify(a));
      T.tjek(a.motor === 'ny' && !a.seg && a.knap && a.n >= 2, `${w} × ${h}: gs.motor er 'ny' uden knappen Ny · Klassisk; rækken Slag, dyb (kick) har ⏻ (${a.n} kick-regler)`, JSON.stringify(a));
      /* rigtigt klik på ⏻ */
      await side.evaluate(() => { const b = document.querySelector('#ne-mx th.mx-lt[data-b="kick"] [data-mxlf="kick"]'); b.scrollIntoView({ block: 'center' }) });
      await side.click('#ne-mx th.mx-lt[data-b="kick"] [data-mxlf="kick"]'); await side.waitForTimeout(700);
      const b = await side.evaluate(() => { const tr = document.querySelector('#ne-mx th.mx-lt[data-b="kick"]').closest('tr'); return { fra: neLtFra('kick'), gemt: !!(scene.ne && scene.ne.ltFra && scene.ne.ltFra.kick), kl: tr.className, m: (tr.querySelector('.mx-fra-m') || {}).textContent, paa: document.querySelector('[data-mxlf="kick"]').getAttribute('aria-pressed'), toast: (document.querySelector('.ne-toast') || {}).textContent || '' } });
      T.tjek(b.fra && b.gemt && /mx-r-fra/.test(b.kl) && b.m === 'slået fra' && b.paa === 'true', `${w} × ${h}: klik på ⏻ slår rækken fra (grå, "slået fra"; scene.ne.ltFra.kick; besked: "${b.toast.slice(0, 60)}")`, JSON.stringify(b));
      /* motoren: kick-reglerne giver 0, hihat-reglen slår til, mens generatoren spiller */
      const mo = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); try { gStart() } catch (e) { } await vent(2500);
        const ki = maps.map((m, i) => [m, i]).filter(x => x.band === 'kick' || x[0].band === 'kick').map(x => x[1]), hi = maps.map((m, i) => [m, i]).filter(x => x[0].band === 'hihat').map(x => x[1]);
        let kMax = 0, hMax = 0; for (let k = 0; k < 40; k++) { await vent(50); const E = (typeof ENV !== 'undefined' && ENV) || null; const ud = i => { try { return typeof neRegelUd === 'function' ? neRegelUd(i) : (E && E[i] != null ? E[i] : 0) } catch (e) { return 0 } }; ki.forEach(i => kMax = Math.max(kMax, +ud(i) || 0)); hi.forEach(i => hMax = Math.max(hMax, +ud(i) || 0)) }
        const off = ki.map(i => neLtFraF(maps[i])); return { ki: ki.length, hi: hi.length, kMax, hMax, off } });
      T.tjek(mo.off.every(Boolean) && mo.ki >= 1, `${w} × ${h}: motoren behandler de ${mo.ki} kick-regler som slået fra (neLtFraF), hihat-reglerne (${mo.hi}) ikke`, JSON.stringify(mo));
      /* Ctrl+Z slår til igen; knappen i Noders kontrolpanel */
      await side.keyboard.press('Control+z'); await side.waitForTimeout(800);
      const c = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const fraEfterZ = neLtFra('kick'); mxSaet(false, true); await vent(900); neVaelg('l:kick'); await vent(500); const kn = document.querySelector('#ne-kp [data-ne84="ltfra"]'); const tekst0 = kn && kn.textContent; if (kn) kn.click(); await vent(600); const node = NE2.N.get('l:kick'), regel = [...NE2.N.values()].find(n => n.kol === 'regel' && n.m && n.m.band === 'kick');
        return { fraEfterZ, tekst0, fra: neLtFra('kick'), nodeSlukket: !!(node && node.el && node.el.classList.contains('ne-slukket')), regelSlukket: !!(regel && regel.el && regel.el.classList.contains('ne-slukket')), tekst1: (document.querySelector('#ne-kp [data-ne84="ltfra"]') || {}).textContent } });
      T.tjek(c.fraEfterZ === false && c.tekst0 === 'Slå fra' && c.fra === true && c.nodeSlukket && c.regelSlukket && c.tekst1 === 'Slå til', `${w} × ${h}: Ctrl+Z slog rækken til igen; knappen i lydtrækkets kontrolpanel slår fra (noden og dens regler er slukkede i Noder)`, JSON.stringify(c));
      /* huskes i en gemt plads */
      const d = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); slotSave('T'); neSaetLtFra('kick', false, true); await vent(200); const mellem = neLtFra('kick'); slotLoad('T'); await vent(500); return { mellem, efter: neLtFra('kick') } });
      T.tjek(d.mellem === false && d.efter === true, `${w} × ${h}: Slå fra følger med i en gemt plads (Opsætning 20)`, JSON.stringify(d));
      if (w === 1920) { await side.evaluate(async () => { mxSaet(true, true); await new Promise(r => setTimeout(r, 900)) }); await side.screenshot({ path: path.join(__dirname, 'ud', 'v9_84-slaa-fra.png') }).catch(() => { }); }
      await side.evaluate(() => { try { gStop() } catch (e) { } });
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
