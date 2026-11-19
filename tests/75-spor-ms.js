/* Trin 4 · Det nye i v9.80 (trin S6): fanen Spor med én række pr. spor (fil, bølgeform, niveau, M og S).
   Ved 1920 × 1080 og 2560 × 1440 med de 4 test-spor (lav-stems.py): fire rækker med bølgeform (tegnet) og M/S; efter Brug de 4 spor: M på Trommer (rigtigt klik)
   skifter den lyd, der spilles (buf), uden at ændre analysen (F.kick, STEM.F) eller Niveaus måling (den fulde blanding), afspilningen fortsætter samme sted,
   det gule felt og mærket ved fanerne siger det; S på Bas giver kun Bas; M igen → alle spor; niveauet pr. spor lever, mens der spilles. */
const path = require('path'), os = require('os'), fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Spor med M/S');
  console.log('75 · Fanen Spor med M/S (S6) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-spor-')); let sporOk = true;
  try { execFileSync('python3', ['-I', path.join(__dirname, 'lav-stems.py'), tmp]); } catch (e) { sporOk = false; T.fejl('test-sporene kunne ikke laves (python3 med numpy): ' + String(e.message).split('\n')[0]); }
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      if (!sporOk) break;
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4000);
      await side.click('#lay3 [data-lay3="ao-sang"]'); await side.waitForTimeout(800); await side.click('#sg [data-sgf="spor"]'); await side.waitForTimeout(600);
      const r0 = await side.evaluate(() => ({ rk: [...document.querySelectorAll('.stem-rk .stem-r')].map(r => r.dataset.stemr), bf: document.querySelectorAll('.stem-bf').length, ms: document.querySelectorAll('[data-stemm]').length + document.querySelectorAll('[data-stems]').length, lyt: document.getElementById('stem-lyt').hidden, h4: document.querySelector('.lks-stem h4').textContent, knapper: ['stem-flere-k', 'stem-brug', 'stem-fjern'].map(id => !!document.getElementById(id)) }));
      T.tjek(r0.rk.join(',') === 'trommer,bas,vokal,resten' && r0.bf === 4 && r0.ms === 8 && r0.lyt && r0.h4 === 'Spor' && r0.knapper.every(Boolean), `${w} × ${h}: fanen Spor har én række pr. spor (${r0.rk.join(', ')}) med bølgeform, M og S, og knapperne Vælg 4 filer, Brug de 4 spor og Fjern sporene`, JSON.stringify(r0));
      for (const s of ['trommer', 'bas', 'vokal', 'resten']) await side.setInputFiles(`[data-stem-input="${s}"]`, path.join(tmp, s + '.wav'));
      await side.waitForFunction(() => STEM_SPOR.every(([s]) => STEM.buf[s]), null, { timeout: 20000 }); await side.waitForTimeout(1500);
      const bf = await side.evaluate(() => { const ud = {}; document.querySelectorAll('.stem-bf').forEach(c => { const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data; let n = 0; for (let i = 0; i < d.length; i += 8) if (d[i] > 120) n++; ud[c.dataset.stembf] = n }); return { ud, env: Object.keys(STEM.env || {}).filter(s => STEM.env[s].klar) } });
      T.tjek(Object.values(bf.ud).every(n => n > 50) && bf.env.length === 4, `${w} × ${h}: bølgeformen er tegnet for alle fire spor (${Object.entries(bf.ud).map(([k, v]) => k + ' ' + v).join(', ')})`, JSON.stringify(bf));
      await side.click('#stem-brug'); await side.waitForFunction(() => STEM.klar && F && !document.getElementById('play').disabled, null, { timeout: 300000 }); await side.waitForTimeout(800);
      const klik = async sel => { const p = await side.evaluate(sel => { const el = document.querySelector(sel); el.scrollIntoView({ block: 'center' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(500) };
      const f0 = await side.evaluate(() => ({ kick: Array.from(F.kick.slice(0, 200)).join(','), sf: Object.keys(STEM.F).join(), alle: buf === STEM.mixAlle, dur }));
      /* spil, M på Trommer */
      await side.evaluate(() => { tlSpring(8); play() }); await side.waitForTimeout(1200);
      const t0 = await side.evaluate(() => now());
      await klik('[data-stemm="trommer"]'); await side.waitForTimeout(800);
      const m1 = await side.evaluate(() => ({ t: now(), playing, alle: buf === STEM.mixAlle, mute: STEM.mute.trommer, hoer: stemHoerbare().join(), kick: Array.from(F.kick.slice(0, 200)).join(','), sf: Object.keys(STEM.F).join(), lyt: document.getElementById('stem-lyt').textContent, lytSkjult: document.getElementById('stem-lyt').hidden, badge: document.getElementById('sg-lyt').textContent, badgeSkjult: document.getElementById('sg-lyt').hidden, status: document.getElementById('status').textContent, nivBuf: NIV.buf === STEM.mixAlle, mOn: document.querySelector('[data-stemm="trommer"]').classList.contains('on'), niv: [...document.querySelectorAll('[data-stemniv]')].map(u => parseFloat(u.style.width) || 0) }));
      /* den hørte lyd er uden trommer: sammenlign en prøve i den nye buf med trommesporet */
      const uden = await side.evaluate(() => { const n = 44100 * 2, a = buf.getChannelData(0), tr = STEM.buf.trommer.getChannelData(0), al = STEM.mixAlle.getChannelData(0); let d1 = 0, d2 = 0; for (let i = 0; i < n; i++) { d1 += Math.abs(a[i] - (al[i] - tr[i])); d2 += Math.abs(a[i] - al[i]) } return { udenTr: d1 / n, modAlle: d2 / n } });
      T.tjek(f0.alle && m1.playing && !m1.alle && m1.mute && m1.hoer === 'bas,vokal,resten' && m1.kick === f0.kick && m1.sf === f0.sf && !m1.lytSkjult && /uden Trommer/.test(m1.lyt) && !m1.badgeSkjult && /uden Trommer/.test(m1.badge) && m1.nivBuf && m1.mOn && m1.t > t0 && m1.t < t0 + 3 && uden.udenTr < 1e-6 && uden.modAlle > 1e-4 && m1.niv.some(v => v > 0), `${w} × ${h}: M på Trommer (rigtigt klik) skifter den hørte lyd til sporene uden trommer (prøverne passer), analysen (F.kick, STEM.F) og Niveaus måling er uændrede, afspilningen fortsætter (${t0.toFixed(1)} → ${m1.t.toFixed(1)} s), og det står der: "${m1.lyt}" · "${m1.badge}"; sporenes niveau lever`, JSON.stringify({ f0: { alle: f0.alle }, m1: { ...m1, kick: m1.kick.slice(0, 30) }, uden, t0 }));
      /* S på Bas */
      await klik('[data-stems="bas"]'); await side.waitForTimeout(600);
      const s1 = await side.evaluate(() => ({ solo: STEM.solo, hoer: stemHoerbare().join(), lyt: document.getElementById('stem-lyt').textContent, sOn: document.querySelector('[data-stems="bas"]').classList.contains('on'), tavse: [...document.querySelectorAll('.stem-r.stem-tavs')].map(r => r.dataset.stemr).join() }));
      await klik('[data-stems="bas"]'); await klik('[data-stemm="trommer"]'); await side.waitForTimeout(600);
      const s2 = await side.evaluate(() => ({ alle: buf === STEM.mixAlle, hoer: stemHoerbare().join(), lytSkjult: document.getElementById('stem-lyt').hidden, badgeSkjult: document.getElementById('sg-lyt').hidden, playing }));
      await side.evaluate(() => stop());
      T.tjek(s1.solo === 'bas' && s1.hoer === 'bas' && /kun til Bas/.test(s1.lyt) && s1.sOn && s1.tavse === 'trommer,vokal,resten' && s2.alle && s2.hoer === 'trommer,bas,vokal,resten' && s2.lytSkjult && s2.badgeSkjult, `${w} × ${h}: S på Bas giver kun Bas ("${s1.lyt}"; de andre rækker er dæmpede); S og M igen giver alle spor, og felterne forsvinder`, JSON.stringify({ s1, s2 }));
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
