/* Trin 4 · Det nye i v9.22: Node-editoren, trin 4 (ret en regel). Se docs/PLAN-NODE-EDITOREN.md og papirets afsnit 5.6.
   - Samme felter som Router (slettet i v9.35): de samme tal sat i Node-editoren og sådan, som Router satte dem, giver præcis den samme forbindelse (maps), og motoren regner det samme.
   - Hver indstilling i kontrolpanelet (skydere, drejeknapper med piletaster, Vend om, Gate og Gate-tærskel, Taktslag, Standard) ændrer det rigtige felt.
   - På noden: træk tærsklen, træk styrken, Handling/Egenskab (m.slags kun når den er anderledes), klemmen "mest" ændrer styrken.
   - Fortryd og Gentag (knapper og Ctrl+Z / Ctrl+Shift+Z), beskeden med Fortryd. Normalisering og Samlet styrke i værktøjslinjen.
   Skærmbilleder: tests/ud/node-editor-ret.png og node-editor-egenskab.png (deviceScaleFactor 2). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const FARVEKODE = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:white|black|red|orange|yellow|gold|pink|purple|violet|magenta|gr[ae]y|silver|blue|green|brown)(?![\w-])/;

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 4)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('17 · Node-editor, trin 4 · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');
  const a = html.indexOf('/* ========== v9.22: NODE-EDITOR (TRIN 4)'), b = html.indexOf('/* ========== SLUT: NODE-EDITOR (TRIN 4)');
  const blok = a > 0 && b > a ? html.slice(a, b) : '';
  const lin = blok.split('\n').map(l => l.replace(/\/\*[^]*?\*\//g, '')).filter(l => FARVEKODE.test(l));
  T.tjek(blok && !lin.length, 'ingen farvekoder i blokken for trin 4', lin.slice(0, 2).map(l => (l.match(FARVEKODE) || [''])[0]).join(', '));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
    side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); });
    /* vælg reglen i Node-editoren og vis den */
    const vælg = i => side.evaluate(async i => { const n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i); neVaelg(n.key); NE.tilpas = false; NE.z = .8; NE.x = Math.round(30 - NE.kol.find(c => c.k === 'lydtraek').x * NE.z); NE.y = Math.round(96 - n.y * NE.z); neVis(); await new Promise(r => setTimeout(r, 300)); return n.key; }, i);
    const sætSkyder = (f, v) => side.evaluate(([f, v]) => { const e = document.querySelector('#ne-kp .ne-kp-ret input[data-nf="' + f + '"]'); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); e.dispatchEvent(new Event('change', { bubbles: true })); }, [f, v]);

    /* 1 · De samme tal i Node-editoren og sådan, som Router 2.0 (slettet i v9.35) satte dem, giver den samme forbindelse */
    const kopi = await side.evaluate(() => { const m = JSON.parse(JSON.stringify(maps[2])); maps.push(JSON.parse(JSON.stringify(m)), JSON.parse(JSON.stringify(m))); renderMaps(); return maps.length; });
    const iA = kopi - 2, iB = kopi - 1;
    await vent(900); await vælg(iA);
    for (const [f, v] of [['thr', .62], ['gain', 1.35], ['att', 40], ['rel', 330], ['hold', 9]]) await sætSkyder(f, v);
    /* Router 2.0 er slettet i v9.35; dens skydere satte felterne sådan her (gain, att og rel direkte, Hold via R2_HOLD), så det gør testen selv */
    await side.evaluate(async iB => { const m = maps[iB]; m.gain = 1.35; m.att = 40; m.rel = 330; const ms = R2_HOLD[9]; m.hold = ms === Infinity; m.holdMs = ms === Infinity || !ms ? 0 : ms; m.thr = .62; save(); await new Promise(r => setTimeout(r, 300)); }, iB);
    const sam = await side.evaluate(([iA, iB]) => { const so = o => JSON.stringify(Object.keys(o).sort().reduce((x, k) => (x[k] = o[k], x), {})), A = so(maps[iA]), B = so(maps[iB]); const ud = v => Rytme.trinMaal(maps[iA], v, 1) === Rytme.trinMaal(maps[iB], v, 1); return { ens: A === B, A: A + ' | som Router satte dem: ' + B, regn: [.1, .5, .7, .9, 1].every(ud) }; }, [iA, iB]);
    T.tjek(sam.ens && sam.regn, 'de samme tal sat i Node-editoren og sådan, som Router satte dem, giver præcis den samme forbindelse, og motoren regner det samme', sam.A);
    await side.evaluate(([iA]) => { maps.splice(iA, 2); renderMaps(); }, [iA]); await vent(900);

    /* 2 · Hver indstilling ændrer det rigtige felt */
    await vælg(1);
    const før = await side.evaluate(() => JSON.parse(JSON.stringify(maps[1])));
    await sætSkyder('thr', .44); await sætSkyder('gain', .8); await sætSkyder('att', 25); await sætSkyder('rel', 400); await sætSkyder('hold', 22); /* 22 = ∞ */
    await side.evaluate(async () => { const k = f => document.querySelector('#ne-kp .ne-knap[data-nf="' + f + '"]'); for (const [f, n] of [['hyst', 3], ['curve', 4], ['gap', 2], ['slew', 2]]) for (let j = 0; j < n; j++) { k(f).focus(); k(f).dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })); await new Promise(r => setTimeout(r, 30)); } });
    await side.evaluate(() => { const c = document.querySelector('#ne-kp input[data-nf="inv"]'); c.checked = true; c.dispatchEvent(new Event('change', { bubbles: true })); });
    await side.evaluate(() => { const s = document.querySelector('#ne-kp select[data-nf="port"]'); s.value = 'bas'; s.dispatchEvent(new Event('change', { bubbles: true })); });
    await vent(200); await sætSkyder('portT', .3);
    const m1 = await side.evaluate(() => JSON.parse(JSON.stringify(maps[1])));
    const ok2 = m1.thr === .44 && m1.gain === .8 && m1.att === 25 && m1.rel === 400 && m1.hold === true && m1.hyst === .06 && Math.abs(m1.curve - ((før.curve ?? 1) + .4)) < 1e-6 && m1.gap === (før.gap ?? 120) + 40 && m1.slew === 2 && m1.inv === true && m1.port === 'bas' && m1.portT === .3;
    T.tjek(ok2, `kontrolpanelet ændrer de rigtige felter: thr ${m1.thr}, gain ${m1.gain}, att ${m1.att}, rel ${m1.rel}, hold ${m1.hold ? '∞' : m1.holdMs}, hyst ${m1.hyst}, curve ${m1.curve}, gap ${m1.gap}, slew ${m1.slew}, inv ${m1.inv}, port ${m1.port} > ${m1.portT}`);
    const node = await side.evaluate(() => { const n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === 1); return { vendt: /Vendt/.test(n.el.textContent), gate: !!n.el.querySelector('.ne-m-gate'), link: NE2.L.some(l => l.gate && l.til === n.key && l.fra === 'l:bas'), saet: document.querySelector('#ne-kp .ne-kp-tekst').textContent }; });
    T.tjek(node.vendt && node.gate && node.link && /under/.test(node.saet) && /Bas/.test(node.saet), `noden følger med: mærkerne Vendt og Gate, et gate-link fra Bas, og sætningen ("${node.saet.slice(0, 90)}…")`);
    await side.click('#ne-kp [data-ne4="std"]'); await vent(300);
    const std = await side.evaluate(() => JSON.parse(JSON.stringify(maps[1])));
    T.tjek(std.inv === false && std.hyst === 0 && std.curve === 1 && std.slew === 0 && std.gap === 120 && std.hold === false && std.holdMs === 0 && std.thr === .44 && std.gain === .8 && std.att === 25 && std.rel === 400, 'Standard sætter kæden tilbage (som Router), men tærskel, styrke, attack og release bliver');
    const takt = await side.evaluate(async () => { maps.push({ band: 'ana:taktslag', effect: 'ring', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }); renderMaps(); await new Promise(r => setTimeout(r, 900)); const i = maps.length - 1, n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i); neVaelg(n.key); await new Promise(r => setTimeout(r, 200));
      const b = document.querySelector('#ne-kp [data-nseg="takt"][data-v="live"]'); b.click(); await new Promise(r => setTimeout(r, 300)); const r = { takt: maps[i].takt, grund: document.querySelector('#ne-kp .ne-seg-r small').textContent };
      document.querySelector('#ne-kp [data-nseg="takt"][data-v=""]').click(); await new Promise(r => setTimeout(r, 300)); r.auto = !('takt' in maps[i]); maps.splice(i, 1); renderMaps(); await new Promise(r => setTimeout(r, 700)); return r; });
    T.tjek(takt.takt === 'live' && /Manuel/.test(takt.grund) && takt.auto, `Taktslag: Mens det spiller (Manuel: "${takt.grund.slice(0, 60)}…") og Auto igen`);

    /* 3 · På noden */
    await vælg(3);
    const box = await side.evaluate(() => { const n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === 3), r = n.el.querySelector('.ne-rm').getBoundingClientRect(), s = n.el.querySelector('.ne-styrke').getBoundingClientRect(); return { x0: r.left, w: r.width, y: r.top + r.height / 2, sx: s.left + s.width / 2, sy: s.top + s.height / 2, g0: maps[3].gain }; });
    await side.mouse.move(box.x0 + box.w * .2, box.y); await side.mouse.down(); await side.mouse.move(box.x0 + box.w * .7, box.y, { steps: 6 }); await side.mouse.up(); await vent(300);
    const thr = await side.evaluate(() => maps[3].thr);
    T.tjek(Math.abs(thr - .7) < .02, `træk i måleren flytter tærsklen til ${thr}`);
    await side.mouse.move(box.sx, box.sy); await side.mouse.down(); await side.mouse.move(box.sx, box.sy - 60, { steps: 5 }); await side.mouse.up(); await vent(300);
    const gain = await side.evaluate(() => maps[3].gain);
    T.tjek(Math.abs(gain - (box.g0 + .5)) < .06, `træk op i styrke-tallet: ×${box.g0} → ×${gain}`);
    const toast = await side.evaluate(() => { const e = document.getElementById('ne-toast'); return { vis: e && e.classList.contains('ne-toast-vis'), tekst: e ? e.textContent : '' }; });
    T.tjek(toast.vis && /Styrke/.test(toast.tekst) && /Fortryd/.test(toast.tekst), `beskeden efter ændringen: "${toast.tekst}"`);
    /* Fortryd og Gentag */
    await vent(1500);
    await side.click('.ne-vk[data-ne4="fortryd"]'); await vent(500);
    const fy = await side.evaluate(() => maps[3].gain);
    await side.click('.ne-vk[data-ne4="gentag"]'); await vent(500);
    const ge = await side.evaluate(() => maps[3].gain);
    await side.locator('#ne-flade').click({ position: { x: 20, y: 40 } });
    await side.keyboard.press('Control+z'); await vent(500);
    const cz = await side.evaluate(() => maps[3].gain);
    await side.keyboard.press('Control+Shift+z'); await vent(500);
    const csz = await side.evaluate(() => maps[3].gain);
    T.tjek(fy === box.g0 && ge === gain && cz === box.g0 && csz === gain, `Fortryd og Gentag: ↶ ×${fy}, ↷ ×${ge}, Ctrl+Z ×${cz}, Ctrl+Shift+Z ×${csz}`);
    /* Handling / Egenskab */
    const eg = await side.evaluate(async () => { const n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === 3), s = n.el.querySelector('select[data-nf="slags"]'); s.value = 'egenskab'; s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 300));
      const n2 = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === 3); const r = { slags: maps[3].slags, klemmer: n2.el.querySelectorAll('.ne-klemme').length, titel: n2.el.querySelector('.ne-nt').textContent };
      const k = n2.el.querySelector('.ne-mest').getBoundingClientRect(), mr = n2.el.querySelector('.ne-rm').getBoundingClientRect(); r.mx = k.left + 1; r.y = mr.top + mr.height / 2; r.x0 = mr.left; r.w = mr.width; r.g = maps[3].gain; r.mest = neMest(maps[3]); return r; });
    await side.screenshot({ path: path.join(UD, 'node-editor-egenskab.png') });
    await side.mouse.move(eg.mx, eg.y); await side.mouse.down(); await side.mouse.move(eg.x0 + eg.w * .95, eg.y, { steps: 5 }); await side.mouse.up(); await vent(300);
    const eg2 = await side.evaluate(async () => { const r = { g: maps[3].gain, mest: neMest(maps[3]) }; const n = [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === 3), s = n.el.querySelector('select[data-nf="slags"]'); s.value = 'handling'; s.dispatchEvent(new Event('change', { bubbles: true })); await new Promise(r => setTimeout(r, 300)); r.slet = !('slags' in maps[3]); return r; });
    T.tjek(eg.slags === 'egenskab' && eg.klemmer === 2 && /Egenskab/.test(eg.titel) && eg2.g < eg.g && Math.abs(eg2.mest - .95) < .03 && eg2.slet, `Egenskab: gemt i m.slags, to klemmer; "mest" trukket til ${eg2.mest.toFixed(2)} gør styrken ×${eg.g} → ×${eg2.g}; tilbage til Handling sletter m.slags (det læses ud fra målet)`);

    /* 4 · Værktøjslinjen */
    const vl = await side.evaluate(async () => { const r = { m0: mode }; document.querySelector('[data-ne4="norm"][data-v="fast"]').click(); await new Promise(r => setTimeout(r, 300)); r.m1 = mode; r.knap = document.getElementById('norm').textContent; document.querySelector('[data-ne4="norm"][data-v="auto"]').click(); await new Promise(r => setTimeout(r, 300)); r.m2 = mode;
      const s = document.getElementById('ne-master'); s.value = 1.4; s.dispatchEvent(new Event('input', { bubbles: true })); r.g = gmaster; r.mm = document.getElementById('mmaster') && +document.getElementById('mmaster').value; s.value = 1; s.dispatchEvent(new Event('input', { bubbles: true })); return r; });
    T.tjek(vl.m0 === 'auto' && vl.m1 === 'fast' && /Fast/.test(vl.knap) && vl.m2 === 'auto' && vl.g === 1.4 && vl.mm === 1.4, `Normalisering: Adaptiv → Fast → Adaptiv (knappen siger "${vl.knap}"), Samlet styrke ×1,4 også i Radial Mesh`);
    await vælg(1); await vent(600);
    await side.locator('#w25').screenshot({ path: path.join(UD, 'node-editor-ret.png') });
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-ret.png og tests/ud/node-editor-egenskab.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
