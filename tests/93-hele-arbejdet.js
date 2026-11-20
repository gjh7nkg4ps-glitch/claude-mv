/* Trin 4 · Det nye i v9.106 (P8.18 D6): Gem hele arbejdet og Hent hele arbejdet. Ved 1920 × 1080: et Mit show laves i Biblioteket, og rigtigt klik på
   Gem hele arbejdet i Opsætninger henter én fil (type hele-arbejdet) med rytme-bib, rytme-set, rytme-scene, rytme-mapping2 og rytme-objekter og et overblik;
   derefter slettes Mit show, og temaet ændres; Hent hele arbejdet (rigtigt klik, filen vælges, to rigtige klik på Ja) erstatter alt og starter forfra med beskeden;
   Mit show og temaet er tilbage; en opsætnings-fil afvises med en besked; knappen står i banneret og i 💾 Gem ▾. */
const path = require('path'), fs = require('fs'), os = require('os');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Hele arbejdet'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('93 · Gem hele arbejdet og Hent hele arbejdet · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
    await side.goto('file://' + fil); await side.waitForTimeout(4500);
    await side.evaluate(() => { brugFor('piger_show', true); bibGemShow('Test 93', null); set.theme = 'warm'; save(); lsGem('rytme-set', JSON.stringify(set)); dkVis('w13') }); await side.waitForTimeout(800);
    const k = await side.evaluate(() => { const b = document.getElementById('ops-alt-gem'); b.scrollIntoView(); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2, synlig: q.width > 0 } });
    T.tjek(k.synlig, 'knappen Gem hele arbejdet står i Opsætninger under Sikkerhedskopi på computeren', JSON.stringify(k));
    const [dl] = await Promise.all([side.waitForEvent('download', { timeout: 15000 }), side.mouse.click(k.x, k.y)]);
    const mappe = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-alt-')), altFil = path.join(mappe, dl.suggestedFilename()); await dl.saveAs(altFil);
    const d = JSON.parse(fs.readFileSync(altFil, 'utf8')); const n = Object.keys(d.noegler || {});
    T.tjek(/^claude-mv-alt_.*\.json$/.test(dl.suggestedFilename()) && d.type === 'hele-arbejdet' && ['rytme-bib', 'rytme-set', 'rytme-scene', 'rytme-mapping2', 'rytme-objekter'].every(x => n.includes(x)) && n.every(x => x.startsWith('rytme-')) && Array.isArray(d.overblik) && /Mine shows i Biblioteket: 1 \(Test 93\)/.test(d.overblik.join('\n')), `filen ${dl.suggestedFilename()} har ${n.length} nøgler (bib, set, scene, mapping2, objekter …) og et overblik: "${(d.overblik || [])[1]}"`, JSON.stringify({ type: d.type, n, ov: d.overblik }));
    const status1 = await side.evaluate(() => document.getElementById('status').textContent);
    T.tjek(/Hele arbejdet er gemt på computeren/.test(status1), 'statuslinjen siger, at hele arbejdet er gemt', status1);
    /* ændr noget, og hent filen igen */
    await side.evaluate(() => { BIB.mine = []; bibSkriv(); set.theme = 'dark'; applySet(); lsGem('rytme-set', JSON.stringify(set)) }); await side.waitForTimeout(400);
    const foer = await side.evaluate(() => ({ mine: BIB.mine.length, tema: set.theme }));
    const kh = await side.evaluate(() => { const b = document.getElementById('ops-alt-hent'); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } });
    await side.evaluate(() => { window.__filKlik = 0; const gl = HTMLInputElement.prototype.click; HTMLInputElement.prototype.click = function () { if (this.id === 'ops-alt-fil') window.__filKlik++; else gl.call(this) } });
    await side.mouse.click(kh.x, kh.y); await side.waitForTimeout(300);
    const filKlik = await side.evaluate(() => window.__filKlik);
    T.tjek(filKlik === 1, 'rigtigt klik på Hent hele arbejdet åbner fil-vælgeren', String(filKlik));
    await side.setInputFiles('#ops-alt-fil', altFil); await side.waitForTimeout(600);
    const sp1 = await side.evaluate(() => { const b = document.getElementById('bd-ok'); return b && b.getBoundingClientRect().width > 0 ? { t: document.getElementById('bd-t').textContent, p: document.getElementById('bd-p').textContent } : null });
    T.tjek(sp1 && sp1.t === 'Hent hele arbejdet?' && /Mine shows i Biblioteket: 1 \(Test 93\)/.test(sp1.p) && /ALT, der er i browseren nu, bliver erstattet/.test(sp1.p), 'Hent hele arbejdet (rigtigt klik, filen valgt) spørger først med filens overblik og det, der erstattes', JSON.stringify(sp1));
    const klik = async () => { const q = await side.evaluate(() => { const b = document.getElementById('bd-ok'); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 } }); await side.mouse.click(q.x, q.y) };
    await klik(); await side.waitForTimeout(400);
    const sp2 = await side.evaluate(() => document.getElementById('bd-t').textContent);
    T.tjek(sp2 === 'Er du helt sikker?', 'og spørger igen', sp2);
    await klik(); await side.waitForTimeout(5500);
    const efter = await side.evaluate(() => ({ mine: BIB.mine.map(x => x.navn), tema: set.theme, status: document.getElementById('status').textContent, regler: maps.length }));
    T.tjek(foer.mine === 0 && foer.tema === 'dark' && efter.mine.length === 1 && efter.mine[0] === 'Test 93' && efter.tema === 'warm' && /Hele arbejdet er hentet fra filen, og programmet er startet forfra/.test(efter.status) && efter.regler === 37, `efter to rigtige klik på Ja er alt erstattet, og programmet er startet forfra: Mit show "Test 93" og temaet er tilbage, ${efter.regler} regler`, JSON.stringify({ foer, efter }));
    await side.screenshot({ path: path.join(UD, 'hele-arbejdet-hentet.png'), clip: { x: 0, y: 0, width: 1920, height: 60 } });
    /* en opsætnings-fil afvises */
    const opsFil = path.join(mappe, 'ops.json'); fs.writeFileSync(opsFil, JSON.stringify({ program: 'Claude MV', type: 'opsaetninger', version: 4.1, pladser: {} }));
    const afvist = await side.evaluate(async () => { const f = new File([JSON.stringify({ program: 'Claude MV', type: 'opsaetninger', version: 4.1, pladser: {} })], 'ops.json', { type: 'application/json' }); const r = await altImport(f); return { r, status: document.getElementById('status').textContent } });
    T.tjek(afvist.r === false && /fil med opsætninger/.test(afvist.status), 'en fil med Opsætning 1–20 afvises med en besked, der peger på Indlæs fra computer', JSON.stringify(afvist));
    /* banneret og Gem ▾ */
    const steder = await side.evaluate(async () => { Storage.prototype.__gl = Storage.prototype.setItem; Storage.prototype.setItem = function () { const e = new Error('kvote'); e.name = 'QuotaExceededError'; throw e }; save(); await new Promise(r => setTimeout(r, 200)); const b = document.getElementById('gem-fejl'); const banner = !!(b && !b.hidden && b.querySelector('#gem-fejl-alt') && /Gem hele arbejdet/.test(b.textContent)); Storage.prototype.setItem = Storage.prototype.__gl; save(); el9GemByg(); const gem = !!document.querySelector('#el9-gem-pan [data-el9alt]'); return { banner, gem } });
    T.tjek(steder.banner && steder.gem, 'knappen Gem hele arbejdet står også i banneret Kunne ikke gemme (fremhævet) og i 💾 Gem ▾', JSON.stringify(steder));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
    await ctx.close();
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
