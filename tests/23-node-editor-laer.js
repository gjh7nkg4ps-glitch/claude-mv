/* Trin 4 · Det nye i v9.28: Node-editoren, trin 10 (Lær og Adaptiv tærskel). Se papirets afsnit 5.6.
   Med testlyden (120 BPM): Lær på en Handling-regel med Kick sætter tærsklen ud fra slagene og skriver hvor mange; Fortryd sætter tilbage; Lær på en
   Egenskab sætter mindst og mest (tærskel og styrke). En ny regel har Lær som forslag. Adaptiv tærskel: Til/Fra og de to skydere ændrer de samme
   indstillinger som EQ-vinduet. Skærmbillede: tests/ud/node-editor-laer.png. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 10)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('23 · Node-editor, trin 10 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 800)); });
    await side.setInputFiles('#file', lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-ne10-')), 'testlyd-120bpm.wav')));
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await vent(1500);
    const i = await side.evaluate(() => { let i = maps.findIndex(m => m.band === 'kick' && !String(m.effect).startsWith('obj:')); if (i < 0) { maps.push({ band: 'kick', effect: 'puls', thr: .3, gain: 1, att: 20, rel: 200, curve: 1, gap: 120, min: true }); renderMaps(); i = maps.length - 1; } maps[i].thr = .9; save(); return i; });
    await vent(1500);
    await side.evaluate(i => neVaelg([...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).key), i); await vent(300);
    await side.click('#ne-kp [data-ne10="laer"]'); await vent(500);
    const l1 = await side.evaluate(i => ({ thr: maps[i].thr, toast: document.getElementById('ne-toast').textContent }), i);
    await side.screenshot({ path: path.join(UD, 'node-editor-laer.png') });
    T.tjek(l1.thr > .05 && l1.thr < .9 && /Tærskel sat til [\d,]+ ud fra \d+ slag/.test(l1.toast), `Lær (Handling, Kick, hele sangen): ${l1.toast.replace('Fortryd', '').trim()}`);
    const n = +((l1.toast.match(/ud fra (\d+) slag/) || [])[1] || 0);
    T.tjek(n >= 30 && n <= 90, `antal slag passer til testlyden (30 s ved 120 BPM med kick på hvert slag: cirka 60; fundet ${n})`);
    await vent(1500); await side.click('.ne-vk[data-ne4="fortryd"]'); await vent(600);
    T.tjek(await side.evaluate(i => maps[i].thr === .9, i), 'Fortryd sætter tærsklen tilbage til 0,9');
    const eg = await side.evaluate(async () => { const j = maps.findIndex(m => m.band === 'bas'); const m = j >= 0 ? maps[j] : null; if (!m) return null; m.slags = 'egenskab'; m.thr = .5; m.gain = 1; save(); renderMaps(); await new Promise(r => setTimeout(r, 900)); neVaelg([...NE2.N.values()].find(n => n.kol === 'regel' && n.i === j).key); await new Promise(r => setTimeout(r, 200)); document.querySelector('#ne-kp [data-ne10="laer"]').click(); await new Promise(r => setTimeout(r, 400)); return { thr: m.thr, gain: m.gain, toast: document.getElementById('ne-toast').textContent }; });
    T.tjek(eg && /Mindst sat til/.test(eg.toast) && eg.thr !== .5 && eg.gain !== 1, eg ? `Lær (Egenskab, Bas): ${eg.toast.replace('Fortryd', '').trim()}` : 'ingen Bas-regel');
    /* ny regel: Lær som forslag */
    const ny = await side.evaluate(async () => { const fk = [...NE2.N.values()].find(n => n.kol === 'figur').key; ne5Ny('snare', 'glod', 'handling', null); await new Promise(r => setTimeout(r, 300)); const b = document.querySelector('#ne-kp [data-ne10="laer"]'); return { forslag: !!b && b.classList.contains('ne-forslag'), tekst: b && b.textContent }; });
    T.tjek(ny.forslag && /forslag/.test(ny.tekst), 'en ny regel har Lær lysende som forslag');
    /* Adaptiv tærskel */
    const ad = await side.evaluate(async () => { const r = {}; document.querySelector('#ne-kp [data-ne10="tilpas"][data-v="1"]').click(); await new Promise(r => setTimeout(r, 300)); r.on = set.tilpas; r.eq = document.getElementById('eq-tilpas').checked;
      const s = document.querySelector('#ne-kp input[data-ne10="tid"]'); s.value = 5; s.dispatchEvent(new Event('input', { bubbles: true })); s.dispatchEvent(new Event('change', { bubbles: true })); r.tid = set.tilpasTid; r.eqTid = +document.getElementById('eq-tilpas-tid').value;
      const b = document.querySelector('#ne-kp input[data-ne10="bund"]'); b.value = .1; b.dispatchEvent(new Event('input', { bubbles: true })); b.dispatchEvent(new Event('change', { bubbles: true })); r.bund = set.tilpasBund; r.eqBund = +document.getElementById('eq-tilpas-bund').value;
      document.querySelector('#ne-kp [data-ne10="tilpas"][data-v="0"]').click(); await new Promise(r => setTimeout(r, 300)); r.off = set.tilpas; return r; });
    T.tjek(ad.on === true && ad.eq && ad.tid === 5 && ad.eqTid === 5 && Math.abs(ad.bund - .1) < 1e-9 && Math.abs(ad.eqBund - .1) < 1e-9 && ad.off === false, 'Adaptiv tærskel: Til/Fra og de to skydere ændrer de samme indstillinger som EQ-vinduet (5 s, 0,10)');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/node-editor-laer.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
