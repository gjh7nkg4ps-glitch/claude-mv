/* Trin 4 · Det nye i v9.29: Node-editoren, trin 11 (skabeloner). Se papirets afsnit 5.2.
   Dans på trommer på en danser: reglerne kommer på danserens mål, egenskaberne får et udsving, og ét Fortryd fjerner dem alle. Morgenstjerne på en figur
   uden pigge: Piglængde springes over med en besked. Klodsbane på Bane. Ctrl+K viser skabelonerne; uden valgt figur spørger listen "Hvilken figur?".
   Gem som skabelon: figurens regler bliver en ny skabelon, der kan lægges på en anden figur. Skærmbillede: tests/ud/node-editor-skabelon.png. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 11)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('24 · Node-editor, trin 11 · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    const d = await side.evaluate(async () => { const f = FORINDST.find(f => { try { brugFor(f.id, true); } catch (e) { return false; } return fase2.objekter.some(o => o.lag && o.lag[0] && o.lag[0].form === 'danser'); }); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); const o = fase2.objekter.find(o => o.lag && o.lag[0] && o.lag[0].form === 'danser'); return o ? { fk: 'f:' + o.id, navn: o.navn, f: f.id } : null; });
    T.tjek(!!d, d ? `en forudindstilling med en danser (${d.f}: ${d.navn})` : 'ingen forudindstilling med en danser');
    await vent(1500);
    const før = await side.evaluate(() => JSON.stringify({ m: maps, o: fase2.objekter }));
    const a = await side.evaluate(async fk => { neVaelg(fk); await new Promise(r => setTimeout(r, 200)); const n0 = maps.length; const b = [...document.querySelectorAll('#ne-kp [data-ne11="brug"]')].find(x => x.textContent === 'Dans på trommer'); if (b) b.click(); await new Promise(r => setTimeout(r, 400)); const ny = maps.slice(n0), id = fk.slice(2), o = fase2.objekter.find(x => x.id === id);
      return { knap: !!b, n: ny.length, ok: ny.every(m => m.effect.startsWith('obj:' + id + ':0:')), udsving: ny.every(m => { const e = o.lag[0].egenskaber[m.effect.split(':')[3]]; return e && e.fra !== e.til; }), lyde: ny.map(m => m.band + '→' + m.effect.split(':')[3]).join(', '), toast: document.getElementById('ne-toast').textContent }; }, d.fk);
    await side.screenshot({ path: path.join(UD, 'node-editor-skabelon.png') });
    T.tjek(a.knap && a.n === 5 && a.ok && a.udsving, `Dans på trommer på ${d.navn}: 5 regler (${a.lyde}), egenskaberne har et udsving`);
    await vent(1500); await side.click('.ne-vk[data-ne4="fortryd"]'); await vent(700);
    T.tjek(await side.evaluate(f => JSON.stringify({ m: maps, o: fase2.objekter }) === f, før), 'ét Fortryd fjerner alle skabelonens regler (og egenskabernes udsving)');
    const ms = await side.evaluate(async () => { const o = fase2.objekter.find(o => o.lag && o.lag[0] && o.lag[0].form !== 'pigkugle' && !propsFor(o.lag[0].form).includes('piglaengde')); if (!o) return null; const n0 = maps.length; neBrugSkabelon(NE11_STD.find(s => s.navn === 'Morgenstjerne'), 'f:' + o.id); await new Promise(r => setTimeout(r, 300)); return { n: maps.length - n0, toast: document.getElementById('ne-toast').textContent }; });
    T.tjek(ms && ms.n === 5 && /sprunget over/.test(ms.toast), ms ? `Morgenstjerne på en figur uden pigge: 5 regler, og "${ms.toast.replace('Fortryd', '').split('·').pop().trim()}"` : 'ingen figur uden pigge');
    const kl = await side.evaluate(async () => { scene.spor = Math.max(3, scene.spor || 3); syncTargets(); const n0 = maps.length; neBrugSkabelon(NE11_STD.find(s => s.navn === 'Klodsbane på slag'), 'g:Bane'); await new Promise(r => setTimeout(r, 300)); return maps.slice(n0).map(m => m.band + '→' + m.effect).join(', '); });
    T.tjek(kl === 'kick→klods1, snare→klods2, hihat→klods3', `Klodsbane på slag på Bane: ${kl}`);
    const kp = await side.evaluate(async () => { neVaelg(null); kpAabn(); document.getElementById('kp-in').value = 'skabelon dans'; document.getElementById('kp-in').dispatchEvent(new Event('input')); await new Promise(r => setTimeout(r, 200)); const r = [...document.querySelectorAll('#kp-liste .kp-r')].find(x => /Skabelon: Dans på trommer/.test(x.textContent)); if (r) r.click(); await new Promise(r => setTimeout(r, 400)); const m = document.getElementById('ne-menu'); return { fundet: !!r, titel: m && m.querySelector('.ne-menu-t').textContent, n: m ? m.querySelectorAll('.ne-menu-i').length : 0 }; });
    T.tjek(kp.fundet && /Hvilken figur\?/.test(kp.titel) && kp.n >= 1, `Ctrl+K: Skabelon: Dans på trommer → "${kp.titel}" med ${kp.n} danser(e)`);
    await side.keyboard.press('Escape');
    const gem = await side.evaluate(async fk => { neVaelg(fk); await new Promise(r => setTimeout(r, 200)); document.querySelector('#ne-kp [data-ne11="gem"]').click(); await new Promise(r => setTimeout(r, 300)); const sk = set.ne.skabeloner[set.ne.skabeloner.length - 1]; const ny = ne11Alle().includes(sk); return { navn: sk && sk.navn, n: sk && sk.regler.length, ny }; }, d.fk);
    T.tjek(gem.ny && gem.n > 0 && /Mine:/.test(gem.navn), `Gem som skabelon: "${gem.navn}" med ${gem.n} regler`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  console.log('  skærmbillede: tests/ud/node-editor-skabelon.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
