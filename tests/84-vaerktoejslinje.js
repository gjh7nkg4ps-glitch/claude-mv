/* Trin 4 · Det nye i v9.89 (pakke 7, B5): én værktøjslinje over matrixen og Node-editoren. Ved tre skærmstørrelser med Pigernes show (rigtige klik):
   værktøjslinjen har Foreslå regler, Lav show ▾, Tilfældigt ▾, Gem som regel-sæt og 🗺 Kort, både i Noder og Matrix; Foreslå regler giver forslag
   (stiplede celler, ingen regler ændret); Tilfældigt ▾ → Tilfældige slag giver forslag; Lav show ▾ åbner en liste med Rolig · Balanceret · Vild (uden sang:
   en besked, ingen regler ændret); Gem som regel-sæt gemmer den valgte figurs regler som et Mit regel-sæt; 🗺 Kort åbner Kort over forbindelserne;
   linjen under matrixen har ingen Foreslå-knap mere, men viser antal forslag med Ja til alle og Nej til alle. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Værktøjslinje');
  console.log('84 · Én værktøjslinje (v9.89) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error' && !/Failed to load resource|ERR_TUNNEL|mermaid/i.test(m.text())) fejl.push(m.text()) }); /* Kort over forbindelserne henter Mermaid fra internettet; uden net kommer en fejl i konsollen, som ikke er programmets */
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('piger_show', true); await vent(300); lay3Anvend('ao-regler'); await vent(1800); mxSaet(false, true); await vent(600) });
      const knapper = () => side.evaluate(() => [...document.querySelectorAll('#ne89-vaerk button')].map(b => b.textContent));
      const a = await knapper(); await side.evaluate(async () => { mxSaet(true, true); await new Promise(r => setTimeout(r, 800)) });
      const a2 = await side.evaluate(() => ({ knapper: [...document.querySelectorAll('#ne89-vaerk button')].map(b => b.textContent), synlig: document.getElementById('ne89-vaerk').getBoundingClientRect().width > 0, fsKnap: [...document.querySelectorAll('#fs-bj button')].map(b => b.textContent), fsTekst: document.getElementById('fs-bj').textContent }));
      T.tjek(a.join('|') === 'Foreslå regler|Lav show ▾|Tilfældigt ▾|Gem som regel-sæt|🗺 Kort' && a2.knapper.join() === a.join() && a2.synlig && !a2.fsKnap.includes('Foreslå regler') && /Forslag/.test(a2.fsTekst), `${w} × ${h}: værktøjslinjen har de fem værktøjer i både Noder og Matrix (${a.join(' · ')}); linjen under matrixen har ingen Foreslå-knap`, JSON.stringify(a2));
      /* Foreslå regler (rigtigt klik): forslag, ingen regler ændret */
      const r0 = await side.evaluate(() => JSON.stringify(maps));
      await side.evaluate(() => { Regler.sletHvor(m => /:dHop$/.test(m.effect)) }); await side.waitForTimeout(500); /* et mål uden regel, så der er noget at foreslå */
      const r1 = await side.evaluate(() => { window.__r1 = JSON.stringify(maps); return window.__r1 });
      await side.click('#ne89-vaerk [data-ne89="foreslaa"]'); await side.waitForTimeout(1200);
      const b = await side.evaluate(() => ({ fs: FS.liste.length, celler: document.querySelectorAll('#ne-mx td.mx-forslag').length, ens: JSON.stringify(maps) === window.__r1, ja: [...document.querySelectorAll('#fs-bj button')].map(x => x.textContent) }));
      T.tjek(b.fs >= 1 && b.celler >= 1 && b.ja.includes('Ja til alle') && b.ja.includes('Nej til alle'), `${w} × ${h}: Foreslå regler giver ${b.fs} forslag som stiplede celler; linjen under matrixen har Ja til alle og Nej til alle`, JSON.stringify(b));
      await side.evaluate(() => fsNejAlle()); await side.waitForTimeout(300);
      /* Tilfældigt ▾ → Tilfældige slag */
      await side.click('#ne89-vaerk [data-ne89="rnd"]'); await side.waitForTimeout(300);
      const m1 = await side.evaluate(() => ({ menu: !!document.getElementById('ne89-menu'), punkter: [...document.querySelectorAll('#ne89-menu button')].map(b => b.textContent) }));
      await side.click('#ne89-menu [data-v="slag"]'); await side.waitForTimeout(1200);
      const c = await side.evaluate(() => ({ menu: !!document.getElementById('ne89-menu'), fs: FS.liste.length, ens: JSON.stringify(maps) === window.__r1, status: document.getElementById('status').textContent }));
      T.tjek(m1.menu && m1.punkter.join('|') === 'Tilfældige slag|Tilfældige flydende|Tilfældige figur-egenskaber' && !c.menu && /Tilfældige slag/.test(c.status) && /Ingen regler er ændret/.test(c.status), `${w} × ${h}: Tilfældigt ▾ viser tre valg; Tilfældige slag giver forslag uden at ændre regler ("${c.status.slice(0, 70)}…")`, JSON.stringify({ m1, c }));
      await side.evaluate(() => fsNejAlle()); await side.waitForTimeout(300);
      /* Lav show ▾ uden sang: en besked, intet ændret */
      await side.click('#ne89-vaerk [data-ne89="show"]'); await side.waitForTimeout(300);
      const m2 = await side.evaluate(() => [...document.querySelectorAll('#ne89-menu button')].map(b => b.textContent));
      await side.click('#ne89-menu [data-v="rolig"]'); await side.waitForTimeout(800);
      const d = await side.evaluate(() => ({ n: maps.length, status: document.getElementById('status').textContent, menu: !!document.getElementById('ne89-menu') }));
      T.tjek(m2.join('|') === 'Rolig|Balanceret|Vild' && !d.menu && /vælg en lydfil|Intet er ændret|ingen forslag|Ingen regler/i.test(d.status), `${w} × ${h}: Lav show ▾ viser Rolig · Balanceret · Vild; uden sang kommer en besked ("${d.status.slice(0, 70)}…")`, JSON.stringify({ m2, d }));
      /* Gem som regel-sæt: Lyshåret pige valgt i Noder */
      const e = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); mxSaet(false, true); await vent(700); const o = fase2.objekter.find(x => x.navn === 'Lyshåret pige'); neVaelg('f:' + o.id); await vent(400); const n0 = ((set.ne && set.ne.skabeloner) || []).length; document.querySelector('#ne89-vaerk [data-ne89="gem"]').click(); await vent(600); const S = set.ne.skabeloner; const sk = S[S.length - 1]; return { n0, n1: S.length, navn: sk && sk.navn, regler: sk && sk.regler.length, mine: typeof bibSaetAlle === 'function' ? bibSaetAlle().filter(x => !x.std).length : -1 } });
      T.tjek(e.n1 === e.n0 + 1 && /Lyshåret pige/.test(e.navn) && e.regler >= 5 && e.mine === e.n1, `${w} × ${h}: Gem som regel-sæt gemmer "${e.navn}" (${e.regler} regler) under Mine regel-sæt i Biblioteket`, JSON.stringify(e));
      /* 🗺 Kort */
      await side.click('#ne89-vaerk [data-ne89="kort"]'); await side.waitForTimeout(600);
      const f = await side.evaluate(() => { const m = document.getElementById('mvk'); const vis = !!m && !m.hidden; mvkLuk(); return vis });
      T.tjek(f, `${w} × ${h}: 🗺 Kort åbner Kort over forbindelserne`);
      if (w === 1920) { await side.evaluate(async () => { mxSaet(true, true); await new Promise(r => setTimeout(r, 800)); fsForeslaa(); await new Promise(r => setTimeout(r, 800)) }); await side.screenshot({ path: path.join(__dirname, 'ud', 'v9_89-vaerktoejslinje.png') }).catch(() => { }); }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
