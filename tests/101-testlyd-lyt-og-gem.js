/* Trin 4 · Det nye i v9.119 (brugerens valg C): testlyden kan høres og gemmes. Ved 1920 × 1080: afsnittet "Testlyden: lyt og gem" har én række pr. mønster
   (6) mellem Testlyd-tabellen og Rigtige trommer; et rigtigt klik på ▶ Lyt spiller lyden (knappen hedder ■ Stop), et nyt klik standser den; vælg Kun trommerne
   og Gem som WAV: filen er en WAV på 44,1 kHz, mono, 16 bit, og dens fingeraftryk er præcis rapportens (House · kun trommer ac579ca0, House · hele lyden
   a375df80); filen kan åbnes som en almindelig lydfil (tempo cirka 124); spiller sangen, sætter ▶ Lyt den på pause. Ved 2560 × 1440: ingen vandret rulning. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const fp = buf => { const n = (buf.length - 44) / 2; let hs = 2166136261; for (let i = 0; i < n; i++) { const v = buf.readInt16LE(44 + i * 2); hs = Math.imul(hs ^ (v & 255), 16777619); hs = Math.imul(hs ^ ((v >> 8) & 255), 16777619) } return (hs >>> 0).toString(16).padStart(8, '0') };
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Testlyden lyt og gem'), UD = path.join(__dirname, 'ud'), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-asl-')); fs.mkdirSync(UD, { recursive: true });
  console.log('101 · Testlyden: lyt og gem (v9.119) · ' + path.basename(fil));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h }, acceptDownloads: true }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
      await side.goto('file://' + fil); await side.waitForTimeout(4500); await side.evaluate(() => asAaben('kick')); await side.waitForTimeout(1200);
      const midt = sel => side.evaluate(sel => { const el = document.querySelector(sel); el.scrollIntoView({ block: 'center' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel);
      const klik = async sel => { const p = await midt(sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(400) };
      const a = await side.evaluate(() => { const L = document.getElementById('as-lyd'), tab = document.querySelector('#as-rude .as-tab').getBoundingClientRect(), m = document.getElementById('as-mdb'), q = L.getBoundingClientRect(); return { rk: L.querySelectorAll('tr[data-asl]').length, v: [...L.querySelectorAll('[data-asl="house"] option')].map(o => o.textContent), v0: [...L.querySelectorAll('[data-asl="house-t"] option')].map(o => o.textContent), under: q.top > tab.bottom, foerMdb: !m || q.bottom <= m.getBoundingClientRect().top + 1, rul: document.getElementById('as-rude').scrollWidth <= document.getElementById('as-rude').clientWidth + 1 } });
      T.tjek(a.rk === 6 && a.v.join() === 'Hele lyden,Kun trommerne,Kun bassen,Kun melodien' && a.v0.length === 1 && a.under && a.foerMdb && a.rul, `${w} × ${h}: afsnittet "Testlyden: lyt og gem" har 6 rækker (House kun trommer har kun hele lyden) og står mellem Testlyd-tabellen og Rigtige trommer; ingen vandret rulning`, JSON.stringify(a));
      if (w === 1920) {
        await klik('#as-lyd [data-aslx="lyt"][data-id="house"]'); await side.waitForFunction(() => ASL.spiller && ASL.spiller.id === 'house', null, { timeout: 30000 }); await side.waitForTimeout(300);
        const l1 = await side.evaluate(() => ({ sp: ASL.spiller && ASL.spiller.id, v: ASL.spiller && ASL.spiller.v, dur: ASL.spiller && Math.round(ASL.spiller.dur), knap: document.querySelector('#as-lyd [data-aslx="lyt"][data-id="house"]').textContent, status: document.getElementById('status').textContent, ctx: actx && actx.state }));
        T.tjek(l1.sp === 'house' && l1.v === 'alt' && l1.knap === '■ Stop' && /Spiller testlyden: House 124/.test(l1.status) && l1.dur >= 16 && l1.ctx === 'running', `et rigtigt klik på ▶ Lyt spiller House · hele lyden (${l1.dur} s); knappen hedder ■ Stop; statuslinjen siger det`, JSON.stringify(l1));
        await side.screenshot({ path: path.join(UD, 'testlyd-lyt-og-gem.png') });
        await klik('#as-lyd [data-aslx="lyt"][data-id="house"]');
        const l2 = await side.evaluate(() => ({ sp: ASL.spiller, knap: document.querySelector('#as-lyd [data-aslx="lyt"][data-id="house"]').textContent }));
        T.tjek(l2.sp === null && l2.knap === '▶ Lyt', 'et nyt rigtigt klik (■ Stop) standser lyden', JSON.stringify(l2));
        await side.selectOption('#as-lyd [data-aslv="house"]', 'trommer'); await side.waitForTimeout(200);
        const [dl] = await Promise.all([side.waitForEvent('download', { timeout: 60000 }), klik('#as-lyd [data-aslx="gem"][data-id="house"]')]); const ud = path.join(tmp, dl.suggestedFilename()); await dl.saveAs(ud);
        const b = fs.readFileSync(ud), hdr = { riff: b.toString('ascii', 0, 4), wave: b.toString('ascii', 8, 12), fmt: b.readUInt16LE(20), kan: b.readUInt16LE(22), sr: b.readUInt32LE(24), bit: b.readUInt16LE(34), data: b.readUInt32LE(40), str: b.length };
        const f1 = fp(b);
        T.tjek(dl.suggestedFilename() === 'testlyd_house_kun-trommer.wav' && hdr.riff === 'RIFF' && hdr.wave === 'WAVE' && hdr.fmt === 1 && hdr.kan === 1 && hdr.sr === 44100 && hdr.bit === 16 && hdr.data === b.length - 44 && f1 === 'ac579ca0', `Kun trommerne + Gem som WAV (rigtigt klik): ${dl.suggestedFilename()}, ${(b.length / 1048576).toFixed(1)} MB, 44,1 kHz mono 16 bit, fingeraftryk ${f1} = rapportens`, JSON.stringify({ hdr, f1 }));
        await side.selectOption('#as-lyd [data-aslv="house"]', 'alt'); await side.waitForTimeout(200);
        const [dl2] = await Promise.all([side.waitForEvent('download', { timeout: 60000 }), klik('#as-lyd [data-aslx="gem"][data-id="house"]')]); const ud2 = path.join(tmp, dl2.suggestedFilename()); await dl2.saveAs(ud2); const f2 = fp(fs.readFileSync(ud2));
        T.tjek(f2 === 'a375df80', `House · hele lyden som WAV har fingeraftrykket ${f2} = rapportens`, f2);
        await side.setInputFiles('#file', ud2); await side.waitForFunction(() => F && SHOWPROFIL && !document.getElementById('play').disabled, null, { timeout: 120000 }); await side.waitForTimeout(500);
        const s = await side.evaluate(() => ({ bpm: Math.round(SHOWPROFIL.bpm), navn: SHOWNAVN }));
        await side.evaluate(() => document.getElementById('play').click()); await side.waitForTimeout(800); await side.evaluate(() => asAaben('kick')); await side.waitForTimeout(800);
        const s0 = await side.evaluate(() => playing); await klik('#as-lyd [data-aslx="lyt"][data-id="dnb"]'); await side.waitForFunction(() => ASL.spiller && ASL.spiller.id === 'dnb', null, { timeout: 30000 });
        const s1 = await side.evaluate(() => ({ playing, sp: ASL.spiller.id })); await klik('#as-lyd [data-aslx="lyt"][data-id="dnb"]');
        T.tjek(Math.abs(s.bpm - 124) <= 2 && /testlyd_house_hele-lyden\.wav/.test(s.navn) && s0 === true && s1.playing === false && s1.sp === 'dnb', `den gemte fil kan åbnes som en almindelig lydfil (${s.bpm} BPM); spiller sangen, sætter ▶ Lyt den på pause`, JSON.stringify({ s, s0, s1 }));
      }
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
