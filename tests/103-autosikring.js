/* Trin 4 · Det nye i v9.122 (T1): automatiske kopier. Ved 1920 × 1080: MV lægger dagens kopi af sig selv (efter 6 s); kopier fra 9 tidligere dage giver
   højst 7 dage (de nyeste); Opsætninger → Automatiske kopier viser rækkerne (i dag, i går …); et rigtigt klik på Gå tilbage hertil ved "i går" spørger to gange
   (rigtige klik), gemmer det, der er nu, og starter forfra med gårsdagens indhold; Fortryd (rækken "lige før du gik tilbage") giver dagens indhold igen;
   Annuller ændrer intet; Tag en kopi nu lægger dagens kopi igen; ingen fejl i konsollen. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Autosikring'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('103 · Autosikring (T1) · ' + path.basename(fil));
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage(); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const midt = sel => side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'center' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel);
  const klik = async sel => { const p = await midt(sel); if (!p) throw new Error('findes ikke: ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(400) };
  const ops = async () => { await side.evaluate(() => dkVis('w13')); await side.waitForTimeout(800); await side.evaluate(() => sikTegn(true)); await side.waitForTimeout(800) };
  const svar = async () => { const t = await side.evaluate(() => { const b = document.getElementById('bd-ok'); return b && b.getBoundingClientRect().width > 0 ? document.getElementById('bd-t').textContent : null }); return t };
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(8000);
    const i0 = await side.evaluate(async () => { const M = await sikMetaer(); return M.map(m => ({ id: m.id, grund: m.grund, dag: m.dag, mv: m.mv, antal: m.antal })) });
    const idag = await side.evaluate(() => sikDag()), igaar = await side.evaluate(() => sikDag(new Date(Date.now() - 864e5)));
    T.tjek(i0.length === 1 && i0[0].grund === 'dag' && i0[0].dag === idag && i0[0].antal > 0 && /^v\d/.test(i0[0].mv), `MV lægger selv dagens kopi (${idag}, ${i0[0] && i0[0].antal} nøgler) kort efter start`, JSON.stringify(i0));
    /* 9 tidligere dage med "i går"-indhold, så dagens indhold */
    const dage = await side.evaluate(async () => { localStorage.setItem('rytme-test103', 'i går'); const d = []; for (let k = 9; k >= 1; k--) { const x = sikDag(new Date(Date.now() - k * 864e5)); d.push(x); await sikTag('dag', x) } localStorage.setItem('rytme-test103', 'i dag'); await sikTag('dag'); const M = await sikMetaer(); return { lagt: d, D: M.filter(m => m.grund === 'dag').map(m => m.dag).sort() } });
    T.tjek(dage.D.length === 7 && dage.D.includes(idag) && dage.D.includes(igaar) && !dage.D.includes(dage.lagt[0]) && !dage.D.includes(dage.lagt[1]) && !dage.D.includes(dage.lagt[2]), `højst 7 dage gemmes (de nyeste): ${dage.D.join(', ')}`, JSON.stringify(dage));
    await ops();
    const r0 = await side.evaluate(() => { const b = document.getElementById('sik-boks'); return b ? { synlig: !!b.offsetParent, rk: [...b.querySelectorAll('tr[data-sikid]')].map(r => r.children[0].textContent), knap: !!b.querySelector('[data-sik="nu"]') } : null });
    T.tjek(r0 && r0.synlig && r0.rk.length === 7 && /^i dag \(/.test(r0.rk[0]) && /^i går \(/.test(r0.rk[1]) && r0.knap, `Opsætninger → Automatiske kopier viser 7 rækker (${r0 && r0.rk.slice(0, 2).join(' · ')} …) og knappen Tag en kopi nu`, JSON.stringify(r0));
    await side.screenshot({ path: path.join(UD, 'autosikring.png') });
    /* Annuller ændrer intet */
    await klik('#sik-boks tr[data-sikid="D|' + igaar + '"] [data-sik="tilbage"]'); const a1 = await svar(); await klik('#bd-nej'); await side.waitForTimeout(400);
    const a2 = await side.evaluate(() => ({ v: localStorage.getItem('rytme-test103'), status: document.getElementById('status').textContent }));
    T.tjek(/^Gå tilbage til kopien fra i går/.test(a1 || '') && a2.v === 'i dag' && /Annulleret/.test(a2.status), 'Gå tilbage hertil (rigtigt klik) spørger; Annuller ændrer intet', JSON.stringify({ a1, a2 }));
    /* gå tilbage til i går */
    await klik('#sik-boks tr[data-sikid="D|' + igaar + '"] [data-sik="tilbage"]'); const s1 = await svar(); await klik('#bd-ok'); const s2 = await svar(); await klik('#bd-ok');
    await side.waitForTimeout(6500);
    const g1 = await side.evaluate(async () => { const M = await sikMetaer(); return { v: localStorage.getItem('rytme-test103'), status: document.getElementById('status').textContent, F: M.filter(m => m.grund === 'foer').length } });
    T.tjek(/^Gå tilbage til kopien fra i går/.test(s1 || '') && s2 === 'Er du helt sikker?' && g1.v === 'i går' && /gået tilbage til kopien fra i går/.test(g1.status) && g1.F === 1, 'to rigtige klik på Ja: MV gemmer det, der var (1 kopi "lige før"), og starter forfra med gårsdagens indhold; statuslinjen siger det', JSON.stringify({ s1, s2, g1 }));
    /* fortryd */
    await ops(); await klik('#sik-boks tr[data-sikid^="F|"] [data-sik="tilbage"]'); const f1 = await svar(); await klik('#bd-ok'); await klik('#bd-ok'); await side.waitForTimeout(6500);
    const g2 = await side.evaluate(async () => { const M = await sikMetaer(); return { v: localStorage.getItem('rytme-test103'), F: M.filter(m => m.grund === 'foer').length } });
    T.tjek(/lige før du gik tilbage/.test(f1 || '') && g2.v === 'i dag' && g2.F === 2, 'Fortryd: rækken "lige før du gik tilbage" giver dagens indhold igen (og gemmer også dét først)', JSON.stringify({ f1, g2 }));
    /* Tag en kopi nu */
    await ops(); const t0 = await side.evaluate(async () => (await sikMetaer()).find(m => m.id === 'D|' + sikDag()).gemt); await side.waitForTimeout(1100);
    await klik('#sik-boks [data-sik="nu"]'); await side.waitForTimeout(1500);
    const t1 = await side.evaluate(async () => ({ gemt: (await sikMetaer()).find(m => m.id === 'D|' + sikDag()).gemt, status: document.getElementById('status').textContent }));
    T.tjek(t1.gemt > t0 && /Kopien er lagt: i dag/.test(t1.status), 'Tag en kopi nu (rigtigt klik) lægger dagens kopi igen', JSON.stringify({ t0, t1 }));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
