/* Trin 4 · Det nye i v9.129 (brugerens valg A): Rigtige trommer kan måles igen uden at vælge mappen. Ved 1920 × 1080 med den lille testmappe fra test 99:
   uden facit er der ingen "Mål igen"; efter mappen er facit gemt i browseren (2 stykker) og knapperne står der; efter en genindlæsning måler et rigtigt klik på
   "Mål igen (uden mappen)" de samme tal uden at åbne mappe-vælgeren (alt fra cachen, også 4 spor); mangler en analyse i cachen, siger MV det og måler ikke;
   "Glem facit" (rigtigt klik, spørger først) sletter facit, og knapperne forsvinder; ingen MDB-filer i repoet; ingen konsolfejl. */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { findFil, tæller, ROD } = require('./faelles');
const { lavMappe } = require('./99-rigtige-trommer');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Rigtige trommer uden mappen'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('109 · Rigtige trommer uden mappen (valg A) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-mdbf-')), { M } = lavMappe(tmp);
  const browser = await chromium.launch(); const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage(); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const åbn = async () => { await side.evaluate(() => { asAaben('kick') }); await side.waitForTimeout(1200) };
  const klik = async sel => { const p = await side.evaluate(sel => { const b = document.querySelector(sel); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); if (!p) throw new Error('findes ikke: ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(500) };
  const tal = () => side.evaluate(() => { const R = MDB.data.res; return JSON.stringify(['mix', 'trom'].map(v => Object.keys(R[v]).sort().map(k => k + ':' + R[v][k].s + '/' + R[v][k].hit + '/' + R[v][k].fa))) });
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500); await åbn();
    const k0 = await side.evaluate(() => ({ igen: !!document.querySelector('[data-mdbx="igen"]'), info: MDBF.info }));
    T.tjek(!k0.igen && !k0.info, 'uden facit i browseren er der ingen "Mål igen"', JSON.stringify(k0));
    await side.setInputFiles('#as-mdb-fil', M); await side.waitForFunction(() => !MDB.koerer && MDB.data && MDB.data.res && MDB.data.spor4, null, { timeout: 300000 }); await side.waitForTimeout(800);
    const t1 = await tal(), k1 = await side.evaluate(async () => { const x = await cacheGet(MDBF.KEY); return { n: x && x.stykker.length, navne: x && x.stykker.map(s => s.navn), klass: x && x.stykker.every(s => /\tKD|KD/.test(s.klass || '')), beats: x && x.stykker.every(s => (s.beats || '').split('\n').length > 5), lyd: x && x.stykker.every(s => s.mix && s.trom && s.mix.size > 0 && !('data' in s.mix)), igen: !!document.querySelector('#as-mdb [data-mdbx="igen"]'), tekst: (document.querySelector('#as-mdb .as-top') || {}).textContent || '' } });
    T.tjek(k1.n === 2 && k1.klass && k1.beats && k1.lyd && k1.igen && /ligger i browseren \(2 stykker\)/.test(k1.tekst), `efter mappen er facit gemt i browseren (${k1.n} stykker: ${(k1.navne || []).join(', ')}; kun tekst, navn og størrelse, ingen lyd), og knappen Mål igen står der`, JSON.stringify(k1).slice(0, 300));
    /* genindlæs: målingen uden mappen */
    await side.reload(); await side.waitForTimeout(4500); await åbn();
    await side.evaluate(() => { window.__klik = []; const gl = HTMLInputElement.prototype.click; HTMLInputElement.prototype.click = function () { __klik.push(this.id); if (this.id !== 'as-mdb-fil') return gl.call(this) } });
    const d0 = await side.evaluate(() => MDB.data.dato); await klik('#as-mdb [data-mdbx="igen"]');
    await side.waitForFunction(d0 => !MDB.koerer && MDB.data && MDB.data.dato > d0 && MDB.data.spor4, d0, { timeout: 120000 }); await side.waitForTimeout(500);
    const t2 = await tal(), k2 = await side.evaluate(() => ({ klik: __klik.slice(), hentet: MDB.data.hentet, lyd: MDB.data.lyd, spor4: MDB.data.spor4, st: document.getElementById('status').textContent }));
    T.tjek(t2 === t1 && k2.klik.length === 0 && k2.hentet === 4 && k2.lyd === 4 && k2.spor4 === 2, `efter en genindlæsning måler et rigtigt klik på "Mål igen (uden mappen)" de samme tal uden mappe-vælgeren (alle ${k2.hentet} lydfiler fra cachen, 4 spor med)`, JSON.stringify({ k2, ens: t2 === t1 }));
    await side.evaluate(() => document.getElementById('as-mdb').scrollIntoView({ block: 'start' })); await side.waitForTimeout(300);
    await side.screenshot({ path: path.join(UD, 'rigtige-trommer-uden-mappen.png') });
    /* en analyse mangler i cachen */
    const d1 = await side.evaluate(async () => { const x = await cacheGet(MDBF.KEY), a = x.stykker[0].mix; await new Promise(res => db().then(d => { const tx = d.transaction('a', 'readwrite'); tx.objectStore('a').delete('mdb' + MDB.VER + 't|' + a.name + '|' + a.size); tx.oncomplete = res })); return MDB.data.dato });
    await klik('#as-mdb [data-mdbx="igen"]'); await side.waitForTimeout(800);
    const k3 = await side.evaluate(d1 => ({ samme: MDB.data.dato === d1, st: document.getElementById('status').textContent, koerer: MDB.koerer }), d1);
    T.tjek(k3.samme && !k3.koerer && /Analysen af 1 lydfil mangler i cachen/.test(k3.st), `mangler en analyse i cachen, siger MV det ("${k3.st.slice(0, 70)} …") og måler ikke`, JSON.stringify(k3));
    /* Glem facit */
    await klik('#as-mdb [data-mdbx="glem"]'); const sp = await side.evaluate(() => document.getElementById('bd-t').textContent); await klik('#bd-ok'); await side.waitForTimeout(400);
    const k4 = await side.evaluate(async () => ({ x: await cacheGet(MDBF.KEY), igen: !!document.querySelector('#as-mdb [data-mdbx="igen"]'), tal: !!(MDB.data && MDB.data.res) }));
    T.tjek(/Glem facit/.test(sp) && !k4.x && !k4.igen && k4.tal, '"Glem facit" (rigtigt klik) spørger først og sletter så facit; knapperne forsvinder, tallene bliver', JSON.stringify({ sp, k4: { x: !!k4.x, igen: k4.igen, tal: k4.tal } }));
    const repo = execFileSync('git', ['ls-files'], { cwd: ROD }).toString().split('\n').filter(f => /MusicDelta|_class\.txt$|_MIX\.beats$|MDB Drums/i.test(f));
    T.tjek(repo.length === 0, 'ingen MDB Drums-filer i repoet (licens CC BY-NC-SA 4.0)', repo.join(', '));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
