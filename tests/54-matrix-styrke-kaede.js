/* Trin 4 · Det nye i v9.59: matrixen, fase 3 trin 3d: styrke-kæden i kanten.
   - Trim på rækken (mærke ved lydtrækkets navn): træk, pil op/ned, dobbeltklik = 0 dB. Motoren bruger trimmet.
   - Figurens og effekt-gruppens styrke ved navnet: træk, pil op/ned, dobbeltklik = ×1.
   - Størst · Sum · Gang på kolonnen: klik skifter; svagt, når målet kun har én regel.
   - Samlet styrke i hjørnet; værktøjslinjens skyder er skjult i matrixen og vises igen i Noder.
   - Kontrolpanelets skydere Trim og Styrke er fjernet (tallet står der stadig).
   Rigtige museklik, træk og tastetryk ved 1920 × 1080, 2560 × 1440 og 3840 × 2160. */
const path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const MOD = process.platform === 'darwin' ? 'Meta' : 'Control';
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Matrix (styrke-kæden)');
  console.log('54 · Matrixen: styrke-kæden i kanten · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const id = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('std', true); await vent(800); const a = nyFigurHer('Pige A', .35, .6, 'danser'); syncTargets(); save(); persistObj(); lay3Anvend('noder'); await vent(2500);
        ne5Ny('kick', 'obj:' + a.id + ':0:dHop'); ne5Ny('snare', 'obj:' + a.id + ':0:dHop'); ne5Ny('hihat', 'obj:' + a.id + ':0:dHoved'); mxInd().mxFold['g:Bane'] = true; await vent(1500); return { a: a.id } });
      await side.click('#ne .mx-skift button[data-mx="1"]'); await side.waitForTimeout(1200);
      const E = p => 'obj:' + id.a + ':0:' + p, FK = 'f:' + id.a;
      const pkt = (attr, k) => side.evaluate(({ attr, k }) => { const b = [...document.querySelectorAll('#ne-mx [data-' + attr + ']')].find(x => x.getAttribute('data-' + attr) === k); if (!b) return null; b.scrollIntoView({ block: 'center', inline: 'center' }); const r = b.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, t: b.dataset.t, svag: b.classList.contains('mx-kt0') } }, { attr, k });
      const traek = async (attr, k, dy) => { const p = await pkt(attr, k); await side.mouse.move(p.x, p.y); await side.mouse.down(); for (let i = 1; i <= 8; i++) { await side.mouse.move(p.x, p.y + dy * i / 8); await side.waitForTimeout(25); } await side.mouse.up(); await side.waitForTimeout(900) };
      const toast = () => side.evaluate(() => ((document.getElementById('ne-toast') || {}).textContent || '').replace(/Fortryd$/, ''));
      const fortryd = async () => { await side.waitForTimeout(1800); await side.evaluate(() => document.querySelector('#ne-mx td.mx-c').focus()); await side.keyboard.press(MOD + '+z'); await side.waitForTimeout(900) };
      /* 1 · mærkerne står i kanten, og navnene er uændrede */
      const k1 = await side.evaluate(({ fk, e }) => { const q = s => document.querySelectorAll('#ne-mx ' + s).length; const lt = document.querySelector('#ne-mx th.mx-lt[data-b="kick"]'), ms = document.querySelector('#ne-mx [data-mxms]'), vl = document.querySelector('#ne .ne-vgrp-master');
        return { rk: q('tbody th.mx-lt'), trim: q('[data-mxtr]'), fig: q('th.mx-fig:not(.mx-foldet)'), fs: q('[data-mxfs]'), ko: q('[data-mxko]'), navn: lt.textContent, ms: !!ms && ms.getBoundingClientRect().width > 60, vl: vl ? getComputedStyle(vl).display : 'mangler', ko2: (document.querySelector('#ne-mx [data-mxko="' + e + '"]') || {}).className } }, { fk: FK, e: E('dHop') });
      const pt = await pkt('mxtr', 'kick'), pf = await pkt('mxfs', FK), pk = await pkt('mxko', E('dHop')), pk1 = await pkt('mxko', E('dHoved'));
      T.tjek(k1.trim === k1.rk && k1.fs === k1.fig && k1.ko >= 2 && k1.navn === 'Slag, dyb (kick)' && pt.t === '0 dB' && pt.svag && pf.t === '×1,00' && pf.svag && pk.t === 'Størst' && !pk.svag && pk1.svag && k1.ms && k1.vl === 'none' && pt.w >= 20 && pt.h >= 14, `${w} × ${h}: i kanten står Trim på hver række (${k1.trim}), Styrke ved hver figur og effekt-gruppe (${k1.fs}), Størst på kolonnerne (svagt, når målet kun har én regel) og Samlet styrke i hjørnet; standardværdier er svage (0 dB, ×1,00); værktøjslinjens Samlet styrke er skjult i matrixen; navnene er uændrede`, JSON.stringify({ k1, pt, pf, pk, pk1 }));
      /* 2 · Trim: træk 32 px op = +4 dB; motoren bruger det; pil ned; dobbeltklik = 0 dB; Fortryd */
      await traek('mxtr', 'kick', -32); const t2 = await side.evaluate(() => ({ db: neTrimDb('kick'), v: neTrimV('kick', .5) })), p2 = await pkt('mxtr', 'kick'), ts2 = await toast();
      await side.waitForTimeout(1800); /* så trækket og piletasten bliver to Fortryd-skridt */ await side.keyboard.press('ArrowDown'); await side.waitForTimeout(500); const t2b = await side.evaluate(() => ({ db: neTrimDb('kick'), fok: !!(document.activeElement && document.activeElement.dataset.mxtr === 'kick') }));
      T.tjek(t2.db === 4 && Math.abs(t2.v - .5 * Math.pow(10, 4 / 20)) < 1e-6 && p2.t === '+4 dB' && !p2.svag && /Trim på/.test(ts2) && t2b.db === 3.5 && t2b.fok, `${w} × ${h}: et træk 32 px op i rækkens mærke giver Trim +4 dB (mærket lyser, og motoren ganger kick med ×${String(Math.round(Math.pow(10, 4 / 20) * 100) / 100).replace('.', ',')}); pil ned giver +3,5 dB, og fokus bliver på mærket`, JSON.stringify({ t2, p2, ts2, t2b }));
      await fortryd(); const t2c = await side.evaluate(() => neTrimDb('kick')), p2c = await pkt('mxtr', 'kick');
      const pd = await pkt('mxtr', 'kick'); await side.mouse.dblclick(pd.x, pd.y); await side.waitForTimeout(900); const t2d = await side.evaluate(() => neTrimDb('kick')), p2d = await pkt('mxtr', 'kick');
      T.tjek(t2c === 4 && p2c.t === '+4 dB' && t2d === 0 && p2d.t === '0 dB' && p2d.svag, `${w} × ${h}: Ctrl+Z sætter trimmet tilbage (+4 dB, og mærket viser det), og et dobbeltklik giver 0 dB`, JSON.stringify({ t2c, p2c, t2d, p2d }));
      /* 3 · Figurens styrke: træk 60 px ned = ×0,50; figuren foldes ikke sammen; dobbeltklik = ×1 */
      await traek('mxfs', FK, 60); const f3 = await side.evaluate(k => ({ v: neFigStyrke(k), fold: !!mxInd().mxFold[k], f: neFigF('obj:' + k.slice(2) + ':0:dHop') }), FK), p3 = await pkt('mxfs', FK);
      await side.keyboard.press('ArrowUp'); await side.waitForTimeout(500); const f3b = await side.evaluate(k => neFigStyrke(k), FK);
      const p3d = await pkt('mxfs', FK); await side.mouse.dblclick(p3d.x, p3d.y); await side.waitForTimeout(900); const f3c = await side.evaluate(k => ({ v: neFigStyrke(k), fold: !!mxInd().mxFold[k] }), FK);
      const pg = await side.evaluate(() => { const b = document.querySelector('#ne-mx th.mx-grp:not(.mx-foldet) [data-mxfs]'); return b ? b.dataset.mxfs : null });
      let g3 = null; if (pg) { await traek('mxfs', pg, -24); g3 = await side.evaluate(k => neFigStyrke(k), pg); const pgd = await pkt('mxfs', pg); await side.mouse.dblclick(pgd.x, pgd.y); await side.waitForTimeout(800); }
      T.tjek(f3.v === 0.5 && f3.f === 0.5 && !f3.fold && p3.t === '×0,50' && !p3.svag && Math.abs(f3b - 0.55) < 1e-9 && f3c.v === 1 && !f3c.fold && (!pg || g3 === 1.2), `${w} × ${h}: et træk 60 px ned i mærket ved figurens navn giver styrke ×0,50 (motoren bruger den, og figuren foldes ikke sammen); pil op giver ×0,55; dobbeltklik giver ×1,00${pg ? '; en effekt-gruppe kan trækkes til ×1,20' : ''}`, JSON.stringify({ f3, p3, f3b, f3c, pg, g3 }));
      /* 4 · Størst → Sum → Gang → Størst på kolonnen */
      const kl = async () => { const p = await pkt('mxko', E('dHop')); await side.mouse.click(p.x, p.y); await side.waitForTimeout(700); return side.evaluate(e => ({ k: neKombFor(e), t: (document.querySelector('#ne-mx [data-mxko="' + e + '"]') || {}).dataset.t, m: maps.filter(m => m.effect === e).map(m => m.komb || 'max').join() }), E('dHop')) };
      const c1 = await kl(), c2 = await kl(), c3 = await kl();
      T.tjek(c1.k === 'sum' && c1.t === 'Sum' && c1.m === 'sum,sum' && c2.k === 'gang' && c2.t === 'Gang' && c3.k === 'max' && c3.t === 'Størst' && c3.m === 'max,max', `${w} × ${h}: klik på kolonnens mærke skifter Størst → Sum → Gang → Størst for målets to regler`, JSON.stringify({ c1, c2, c3 }));
      /* 5 · Samlet styrke i hjørnet: rigtig mus på skyderen; Noder viser værktøjslinjens skyder igen med samme tal */
      const ps = await side.evaluate(() => { const s = document.querySelector('#ne-mx [data-mxms]'); const r = s.getBoundingClientRect(); return { x: r.x, y: r.y + r.height / 2, w: r.width } });
      await side.mouse.click(ps.x + ps.w * 0.25, ps.y); await side.waitForTimeout(700);
      const s5 = await side.evaluate(() => ({ g: gmaster, b: document.querySelector('#ne-mx .mx-ms b').textContent, nm: +document.getElementById('ne-master').value, mm: +document.getElementById('mmaster').value, rk: document.querySelectorAll('#ne-mx tbody th.mx-lt').length }));
      await side.click('#ne .mx-skift button[data-mx="0"]'); await side.waitForTimeout(900); const s5b = await side.evaluate(() => { const vl = document.querySelector('#ne .ne-vgrp-master'); return { vis: getComputedStyle(vl).display !== 'none', t: document.getElementById('ne-master-v').textContent } });
      T.tjek(s5.g > 0.3 && s5.g < 0.7 && s5.nm === s5.g && s5.mm === s5.g && s5.b === '×' + s5.g.toFixed(2).replace('.', ',') && s5.rk >= 3 && s5b.vis && s5b.t === s5.b, `${w} × ${h}: et klik på skyderen Samlet styrke i hjørnet sætter den (${s5.b}); Radial Mesh' og værktøjslinjens skyder følger med, og i Noder står værktøjslinjens skyder der igen med samme tal`, JSON.stringify({ s5, s5b }));
      /* 6 · Noder: kontrolpanelet har ingen skydere til Trim og Styrke, men viser tallet; mærket på noden virker stadig */
      const kp = await side.evaluate(async fk => { const vent = ms => new Promise(r => setTimeout(r, ms)); neSaetTrim('kick', 3, true); await vent(900); const lt = [...NE2.N.values()].find(n => n.kol === 'lydtraek' && n.band === 'kick'); neVaelg(lt.key); await vent(500); const a = { sk: document.querySelectorAll('#ne-kp [data-ne9]').length, tekst: (document.querySelector('#ne-kp .ne-kp-ind') || {}).textContent || '' };
        neVaelg(fk); await vent(500); const b = { sk: document.querySelectorAll('#ne-kp [data-ne9]').length, tekst: (document.querySelector('#ne-kp .ne-kp-ind') || {}).textContent || '' }; return { a, b, node: !!document.querySelector('#ne-verden .ne-trim'), fst: !!document.querySelector('#ne-verden .ne-fstyrke') } }, FK);
      T.tjek(kp.a.sk === 0 && /Trim \+3 dB/.test(kp.a.tekst) && kp.b.sk === 0 && /Styrke ×1,00/.test(kp.b.tekst) && kp.node && kp.fst, `${w} × ${h}: i Noder har kontrolpanelet ingen skyder til Trim eller Styrke mere; det viser tallet ("Trim +3 dB", "Styrke ×1,00") og siger, hvor det ændres; mærkerne på noderne er der stadig`, JSON.stringify(kp));
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
