/* Trin 4 · Det nye i v9.87 (pakke 7, B3): Biblioteket. Ved tre skærmstørrelser med en gammel plads Opsætning 3 gemt på forhånd:
   3 · Regler har tre zoner med Biblioteket til venstre; hylden Shows har de 10 indbyggede (Indbygget) og Mine (den gamle plads er flyttet over med navn);
   rigtige klik: vælg Pigernes show → Brug henter det (Indlæst), Ctrl+Z tager det af igen; Lav en kopi giver et Mit, der kan omdøbes og slettes;
   hylden Figurer: Danser viser sine egne regel-sæt øverst (Dans på trommer, Dans på bas og vokal) og Puls på kick som fælles; Diskokugle på bas vises ikke
   hos danseren; Brug: læg på scenen lægger en danser på; Brug på et regel-sæt lægger reglerne på danseren i ét Fortryd-trin; Vis reglerne viser dem;
   Klodsbanen viser kun regel-sæt til effekt-grupper; Mine regel-sæt (Gem reglerne som et sæt) står hos figuren som Mit med Omdøb og Slet. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Biblioteket');
  console.log('82 · Biblioteket (v9.87) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push(m.text()) });
      await side.addInitScript(() => { try { localStorage.setItem('rytme-C', JSON.stringify({ v: 2, navn: 'Gammel C', gemt: '2026-10-01T10:00:00.000Z', laast: false, maps: [{ band: 'kick', effect: 'puls', thr: .4, gain: 1, att: 10, rel: 200 }], master: 1, objekter: [], pos: {} })) } catch (e) { } });
      await side.goto('file://' + fil); await side.waitForTimeout(5000);
      await side.click('#lay3 [data-lay3="ao-regler"]'); await side.waitForTimeout(1800);
      const a = await side.evaluate(() => { const w36 = document.getElementById('w36'); const kort = [...document.querySelectorAll('#bib .bib-k')].map(b => ({ k: b.dataset.bib, m: b.querySelector('.bib-m').textContent, tegnet: b.querySelector('canvas').width > 10 })); return { zoner: document.querySelectorAll('.dk-zone').length, bib: !!w36 && !w36.hidden, venstre: w36.getBoundingClientRect().x < 100, navn: DK_NAVN.w36, kort, mine: BIB.mine.map(x => x.navn), hylde: BIB.hylde } });
      T.tjek(a.zoner === 3 && a.bib && a.venstre && a.navn === 'Biblioteket' && a.hylde === 'shows', `${w} × ${h}: 3 · Regler har tre zoner med Biblioteket til venstre`, JSON.stringify({ zoner: a.zoner, bib: a.bib, venstre: a.venstre }));
      T.tjek(a.kort.filter(x => x.k.startsWith('s:f:')).length === 10 && a.kort.filter(x => x.k.startsWith('s:f:')).every(x => x.m === 'Indbygget') && a.kort.some(x => x.k.startsWith('s:m:') && x.m === 'Mit') && a.mine.includes('Gammel C') && a.kort.every(x => x.tegnet), `${w} × ${h}: hylden Shows: 10 Indbygget og Mine (Opsætning 3 er flyttet over som "${a.mine.join(', ')}"); alle kort har et billede`, JSON.stringify(a.kort.slice(0, 3)));
      /* Brug et show (rigtigt klik) og Fortryd */
      const n0 = await side.evaluate(() => ({ n: maps.length, o: fase2.objekter.length }));
      await side.click('#bib .bib-k[data-bib="s:f:piger_show"]'); await side.waitForTimeout(400); await side.click('#bib-det [data-biba="brug"]'); await side.waitForTimeout(1300);
      const b = await side.evaluate(() => ({ aktiv: active, indl: document.getElementById('el9-indl').textContent, n: maps.length, o: fase2.objekter.filter(o => o.synlig !== false).length }));
      await side.keyboard.press('Control+z'); await side.waitForTimeout(900);
      const b2 = await side.evaluate(() => ({ n: maps.length, o: fase2.objekter.length }));
      T.tjek(b.aktiv === 'f:piger_show' && /^Indlæst: Pigernes show/.test(b.indl) && b.o === 3 && b2.n === n0.n && b2.o === n0.o, `${w} × ${h}: Brug henter Pigernes show ("${b.indl}"); Ctrl+Z tager det af igen (${b2.n} regler som før)`, JSON.stringify({ b, b2, n0 }));
      /* Lav en kopi → Mit; Omdøb; Slet */
      await side.click('#bib .bib-k[data-bib="s:f:ms_show"]'); await side.waitForTimeout(300); await side.click('#bib-det [data-biba="kopi"]'); await side.waitForTimeout(600);
      const c = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const x = BIB.mine.find(y => /kopi/.test(y.navn)); const kopiNavn = x.navn; const kort = document.querySelector('#bib .bib-k.bib-valgt'); const knapper = [...document.querySelectorAll('#bib-det .ab button')].map(b => b.textContent);
        bibOmdoeb(x.id, 'Mit stjerneshow'); await vent(300); const navn = (document.querySelector('#bib .bib-k[data-bib="s:m:' + x.id + '"] b') || {}).textContent; const n1 = BIB.mine.length;
        const p = bibSlet(x.id); await vent(300); document.getElementById('bd-ok').click(); await p; await vent(300); return { kopi: kopiNavn, valgt: kort && kort.dataset.bib, knapper, navn, n1, n2: BIB.mine.length, gemt: !!(localStorage.getItem('rytme-bib')) } });
      T.tjek(/Morgenstjernens dans \(kopi\)/.test(c.kopi) && c.valgt === 's:m:' + (c.valgt || '').slice(4) && c.knapper.includes('Omdøb') && c.knapper.includes('Slet') && c.navn === 'Mit stjerneshow' && c.n2 === c.n1 - 1 && c.gemt, `${w} × ${h}: Lav en kopi giver "${c.kopi}" (Mit med Omdøb og Slet); omdøbt til "${c.navn}"; slettet igen (${c.n1} → ${c.n2})`, JSON.stringify(c));
      /* hylden Figurer: danseren og dens regel-sæt (valg C) */
      await side.click('#bib [data-bibh="figurer"]'); await side.waitForTimeout(400); await side.click('#bib .bib-k[data-bib="g:danser"]'); await side.waitForTimeout(500);
      const d = await side.evaluate(() => ({ saet: [...document.querySelectorAll('#bib .bib-s')].map(s => ({ navn: s.querySelector('b').textContent, faelles: !!s.querySelector('.bib-m-faelles'), mit: !!s.querySelector('.bib-m-mit') })), figurer: [...document.querySelectorAll('#bib .bib-k')].map(b => b.dataset.bib) }));
      T.tjek(d.figurer.length >= 9 && d.saet.length >= 3 && d.saet[0].navn === 'Dans på trommer' && !d.saet[0].faelles && d.saet[1].navn === 'Dans på bas og vokal' && d.saet.some(s => s.navn === 'Puls på kick' && s.faelles) && !d.saet.some(s => /Diskokugle|Klodsbane/.test(s.navn)), `${w} × ${h}: Danser viser sine egne regel-sæt øverst og Puls på kick som fælles (${d.saet.map(s => s.navn + (s.faelles ? ' (fælles)' : '')).join(', ')}); Diskokugle på bas og Klodsbane på slag vises ikke`, JSON.stringify(d.saet));
      /* Brug: læg på scenen; Brug et regel-sæt i ét Fortryd-trin */
      const e0 = await side.evaluate(() => ({ o: fase2.objekter.length, n: maps.length }));
      await side.click('#bib-det [data-biba="brug"]'); await side.waitForTimeout(800);
      const e1 = await side.evaluate(() => ({ o: fase2.objekter.length, danser: fase2.objekter.filter(o => o.lag[0].form === 'danser').length, n: maps.length }));
      await side.evaluate(() => { Regler.sletHvor(m => /^obj:/.test(m.effect)) }); await side.waitForTimeout(1300); /* historikken laver et skridt efter 0,8 s ro */ /* uden danserens egne regler, så regel-sættet kan ses alene */
      const e1b = await side.evaluate(() => maps.length);
      await side.click('#bib-det .bib-s [data-biba="saetbrug"]'); await side.waitForTimeout(1300);
      const e2 = await side.evaluate(() => ({ n: maps.length, hvem: !!document.getElementById('bib-hvem'), dans: maps.filter(m => /:dHop$|:dKnae$|:dArmV$|:dHoved$|:dHaar$/.test(m.effect)).length }));
      await side.keyboard.press('Control+z'); await side.waitForTimeout(900);
      const e3 = await side.evaluate(() => maps.length);
      T.tjek(e1.o === e0.o + 1 && e1.danser >= 1 && !e2.hvem && e2.n === e1b + 5 && e2.dans === 5 && e3 === e1b, `${w} × ${h}: Brug: læg på scenen giver en danser; Brug på Dans på trommer lægger 5 regler på den (${e1b} → ${e2.n}); Ctrl+Z tager dem af i ét trin (${e3})`, JSON.stringify({ e0, e1, e1b, e2, e3 }));
      /* Vis reglerne; Klodsbanen; Mine regel-sæt */
      await side.click('#bib-det .bib-s [data-biba="saetregler"]'); await side.waitForTimeout(400);
      const f = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const li = document.querySelectorAll('#bib-det .bib-s.bib-s-aaben li').length, tekst = (document.querySelector('#bib-det .bib-s.bib-s-aaben li') || {}).textContent || '';
        bibVaelg('g:bane'); await vent(400); const bane = [...document.querySelectorAll('#bib .bib-s b')].map(x => x.textContent);
        set.ne = set.ne || {}; set.ne.skabeloner = [{ navn: 'Mine: test', til: 'danser', regler: [['p', 'dHop', 'kick', .3, 1, 5, 150]] }]; bibVaelg('g:danser'); await vent(400); const mit = [...document.querySelectorAll('#bib .bib-s')].filter(s => s.querySelector('.bib-m-mit')).map(s => ({ navn: s.querySelector('b').textContent, knapper: [...s.querySelectorAll('button')].map(b => b.textContent) }));
        return { li, tekst, bane, mit } });
      T.tjek(f.li === 5 && /→/.test(f.tekst) && f.bane.join() === 'Klodsbane på slag' && f.mit.length === 1 && f.mit[0].knapper.includes('Omdøb') && f.mit[0].knapper.includes('Slet'), `${w} × ${h}: Vis reglerne viser 5 regler ("${f.tekst.slice(0, 50)}…"); Klodsbanen viser ${f.bane.join()}; et Mit regel-sæt står hos danseren med Omdøb og Slet`, JSON.stringify(f));
      if (w === 1920) await side.screenshot({ path: path.join(__dirname, 'ud', 'v9_87-biblioteket.png') }).catch(() => { });
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
