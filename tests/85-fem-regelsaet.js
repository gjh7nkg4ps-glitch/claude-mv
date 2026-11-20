/* Trin 4 · Det nye i v9.90 (pakke 7, B6): fem regel-sæt til hver figur. Ved tre skærmstørrelser: NE11_STD har de fem navne (Rolig, Energisk, På trommerne,
   På vokalen, Hele bandet) til danser, diskokugle og morgenstjerne og fem fælles uden figur; hver regel i hvert sæt peger på en egenskab, figuren har,
   og et lydtræk, der findes; Biblioteket viser de fem hos danseren, discokuglen, Morgenstjernen og (som fælles) hos tom figur og Perfect 1, uden
   dobbelte navne; Brug på "På vokalen" lægger reglerne på en danser med vokal som kilde og et udsving på bevægelserne (rigtigt klik); Ctrl+Z tager
   dem af; Ctrl+K viser skabelonerne med figurens navn. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const NAVNE = ['Rolig', 'Energisk', 'På trommerne', 'På vokalen', 'Hele bandet'];
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Fem regel-sæt');
  console.log('85 · Fem regel-sæt til hver figur (v9.90) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push(m.text()) });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      const a = await side.evaluate(NAVNE => { const S = NE11_STD.filter(s => s.b6); const pr = {}; ['danser', 'diskokugle', 'morgenstjerne', null].forEach(t => pr[t || 'faelles'] = S.filter(s => (s.til || null) === t).map(s => s.navn));
        const form = { danser: 'danser', diskokugle: 'discokugle', morgenstjerne: 'pigkugle' }; const bands = new Set(BANDS.map(b => b[0])); const daarlige = [];
        S.forEach(s => { const P = propsFor(s.til ? form[s.til] : 'cirkel'); s.regler.forEach(r => { if (r[0] !== 'p' || !P.includes(r[1])) daarlige.push(s.navn + '/' + (s.til || 'alle') + ': ' + r[1]); if (!bands.has(r[2])) daarlige.push(s.navn + ': lydtræk ' + r[2]) }) });
        return { pr, n: S.length, daarlige } }, NAVNE);
      T.tjek(a.n === 20 && ['danser', 'diskokugle', 'morgenstjerne', 'faelles'].every(k => a.pr[k].join() === NAVNE.join()) && !a.daarlige.length, `${w} × ${h}: 20 regel-sæt: de fem navne til danser, diskokugle, morgenstjerne og fælles; alle regler peger på egenskaber, figuren har, og lydtræk, der findes`, JSON.stringify(a));
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); bygSelv(); lay3Anvend('ao-regler'); await vent(1800); bibVis('figurer'); await vent(400) });
      const b = await side.evaluate(NAVNE => { const ud = {}; ['danser', 'diskokugle', 'morgenstjerne', 'nyt', 'perfect1'].forEach(id => { const f = BIB_FIG.find(x => x.id === id); const L = bibSaetFor(f); ud[id] = { navne: L.map(x => x.sk.navn), fem: NAVNE.every(n => L.some(x => x.sk.navn === n)), egen: L.filter(x => NAVNE.includes(x.sk.navn)).every(x => x.egen), dobbelt: new Set(L.map(x => x.sk.navn)).size !== L.length } }); return ud }, NAVNE);
      T.tjek(['danser', 'diskokugle', 'morgenstjerne'].every(k => b[k].fem && b[k].egen && !b[k].dobbelt) && ['nyt', 'perfect1'].every(k => b[k].fem && !b[k].egen && !b[k].dobbelt), `${w} × ${h}: Biblioteket viser de fem hos danser, discokugle og Morgenstjerne som egne og hos tom figur og Perfect 1 som fælles, uden dobbelte navne`, JSON.stringify(b));
      /* Brug "På vokalen" på en danser (rigtigt klik) */
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); opDanser(true); await vent(300); bibVaelg('g:danser'); await vent(500); const s = [...document.querySelectorAll('#bib .bib-s')].find(s => s.querySelector('b').textContent === 'På vokalen'); s.querySelector('[data-biba="saetbrug"]').scrollIntoView({ block: 'center' }) });
      const kn = await side.evaluate(() => { const s = [...document.querySelectorAll('#bib .bib-s')].find(s => s.querySelector('b').textContent === 'På vokalen'); const q = s.querySelector('[data-biba="saetbrug"]').getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
      await side.waitForTimeout(1500); /* v9.109: den nye danser skal være sit eget Fortryd-skridt, før Brug trykkes (ellers tager Ctrl+Z begge dele) */
      const n0 = await side.evaluate(() => maps.length);
      await side.mouse.click(kn.x, kn.y); await side.waitForTimeout(1500);
      const c = await side.evaluate(() => { const o = fase2.objekter.find(x => x.lag[0].form === 'danser'); const R = maps.filter(m => m.effect.startsWith('obj:' + o.id + ':')); const e = o.lag[0].egenskaber; return { n: R.length, vokal: R.every(m => m.band === 'vokal'), udsving: R.every(m => { const p = m.effect.split(':')[3]; return e[p] && e[p].fra !== e[p].til }), hvem: !!document.getElementById('bib-hvem') } });
      await side.keyboard.press('Control+z'); await side.waitForTimeout(900);
      const c2 = await side.evaluate(() => maps.length);
      T.tjek(!c.hvem && c.n === 5 && c.vokal && c.udsving && c2 === n0, `${w} × ${h}: Brug på På vokalen lægger 5 regler på danseren, alle fra vokal, med et udsving på bevægelserne; Ctrl+Z tager dem af (${c2} regler som før)`, JSON.stringify({ c, n0, c2 }));
      const d = await side.evaluate(() => { const L = []; neKpPunkter(L); return L.filter(x => /^Skabelon: /.test(x.n)).map(x => x.n) });
      T.tjek(d.some(x => x === 'Skabelon: Rolig · danseren') && d.some(x => x === 'Skabelon: Rolig · alle figurer') && d.some(x => x === 'Skabelon: Hele bandet · Morgenstjernen'), `${w} × ${h}: Ctrl+K viser skabelonerne med figurens navn (${d.length} skabeloner)`, d.join(' | ').slice(0, 300));
      if (w === 1920) { await side.evaluate(() => bibVaelg('g:diskokugle')); await side.waitForTimeout(600); await side.screenshot({ path: path.join(__dirname, 'ud', 'v9_90-fem-regelsaet.png') }).catch(() => { }); }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
