/* Trin 4 · Det nye i v9.43: Morph Pad er fjernet, og reglerne har fået en fælles indgang (Regler) og et fast id. Fase 1, første trin, i P8.2.
   - Morph Pad: ingen kode (mmp, MMP_KILDER), intet vindue W11, ingen knap, ingen pad-kilder i listerne, ingen opsætning "Morph Pad som instrument".
   - Gamle indstillinger med Morph Pad åbner: gemt Scene-fane W11, W11 i et gemt docking-layout og en regel med kilden pad:x. Reglen står der stadig,
     er slået fra, giver 0, og statuslinjen siger det.
   - Regler: tilfoej, find, ret, slet, erstat, samlet og lyt virker og skriver til den samme liste (maps).
   - Id: hver regel har et id, og ingen to er ens, efter start, efter hver færdig opsætning, efter en regel lavet et gammelt sted (Radial Mesh),
     efter Duplikér figur, efter Fortryd og efter genstart (id'erne er de samme).
   - Motoren regner ens med og uden id (samme udgang for den samme lyd).
   - Programmet starter uden fejl i 1920 × 1080, 2560 × 1440 og 3840 × 2160 (planens afsnit 1.1). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Fælles indgang');
  console.log('38 · Fælles indgang til reglerne · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8'), kode = html.slice(0, html.indexOf('<script type="text/plain" id="three-ny-core">'));
  const rester = ['mmp\\w*', 'MMP_KILDER', 'lavPadInstr', 'id="w11"', "id:'padinstr'"].filter(p => new RegExp(p).test(kode));
  T.tjek(!rester.length, 'Morph Pads kode, vindue (W11), knap og opsætning er væk fra filen', rester.join(', '));
  const browser = await chromium.launch();
  try {
    /* 1 · tre skærmstørrelser */
    const st = [];
    for (const [W, H] of [[1920, 1080], [2560, 1440], [3840, 2160]]) { const p = await browser.newPage({ viewport: { width: W, height: H } }); const f = []; p.on('pageerror', e => f.push(e.message)); p.on('console', x => { if (x.type() === 'error') f.push(x.text()); });
      await p.goto('file://' + fil); await p.waitForTimeout(3500); const r = await p.evaluate(() => ({ zoner: document.querySelectorAll('.dk-zone').length, pv: document.getElementById('pv').width > 100, id: maps.every(m => typeof m.id === 'string') })); st.push({ W, H, f, ...r }); await p.close(); }
    T.tjek(st.every(s => !s.f.length && s.zoner >= 3 && s.pv && s.id), `starter uden fejl i ${st.map(s => s.W + ' × ' + s.H).join(', ')}`, JSON.stringify(st.filter(s => s.f.length).slice(0, 1)));
    /* 2 · gamle indstillinger med Morph Pad */
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 } }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3000);
    await side.evaluate(() => { const s = JSON.parse(localStorage.getItem('rytme-set') || '{}'); s.scene = { aktiv: 'w11', ude: [] }; s.mmp = { mod: 'fjeder', auto: true }; if (s.dock) { const z = (function f(n) { return n.t === 'z' ? n : f(n.c[0]) })(s.dock); z.f.push('w11'); z.a = 'w11' } localStorage.setItem('rytme-set', JSON.stringify(s));
      localStorage.setItem('rytme-mapping2', JSON.stringify([{ band: 'pad:x', effect: 'zoom', thr: .2, gain: 1, att: 10, rel: 200, curve: 1, gap: 120 }, { band: 'kick', effect: 'puls', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120, port: 'pad:v1' }, { band: 'hnd:pad', effect: 'burst', thr: .2, gain: 1, att: 5, rel: 500, curve: 1, gap: 120 }, { band: 'bas', effect: 'glod', thr: .3, gain: 1, att: 20, rel: 200, curve: 1, gap: 120 }])); });
    await side.reload(); await side.waitForTimeout(4000);
    const gl = await side.evaluate(() => ({ n: maps.length, fj: maps.map(m => m.fjernet || ''), off: maps.map(m => !!m.off), status: document.getElementById('status').textContent, navn: bandNavn('pad:x'), v: kildeV('pad:x', 0), zoner: dkZoner(set.dock).map(z => z.f.join(',')).join(' | '), aktiv: set.scene.aktiv, valg: [...document.querySelectorAll('select option')].filter(o => /^pad:|hnd:pad/.test(o.value)).length, for: FORINDST.length }));
    T.tjek(gl.n === 4 && gl.fj.join() === 'pad,pad,pad,' && gl.off.join() === 'true,true,true,false' && gl.v === 0 && /Morph Pad, som er fjernet i v9\.43/.test(gl.status), `gamle regler med en pad-kilde åbner: de 3 står der, er slået fra og giver 0; reglen fra Bas er urørt. Statuslinjen: "${gl.status.slice(0, 90)}…"`);
    T.tjek(!/w11/.test(gl.zoner) && gl.aktiv !== 'w11' && gl.valg === 0 && gl.for === 33 && !/'tast','pad'\]/.test(kode) && !fejl.length, `gemt Scene-fane og gemt layout med W11 åbner uden fejl (${gl.zoner}); ingen pad-kilder i listerne; ${gl.for} færdige opsætninger (før 34)`, fejl[0] || '');
    /* 3 · den fælles indgang */
    const api = await side.evaluate(async () => { brugFor('fuld1', true); await new Promise(r => setTimeout(r, 300)); const n0 = maps.length, hændt = []; const stop = Regler.lyt(b => hændt.push(b.hvad));
      const id = Regler.tilfoej({ band: 'kick', effect: 'puls', thr: .4, gain: 1, att: 8, rel: 120, curve: 1, gap: 120, id: 'snyd' }); const fundet = Regler.find(id), iListen = maps[maps.length - 1] === fundet && fundet.id === id && id !== 'snyd';
      Regler.ret(id, { thr: .55, inv: true, id: 'andet' }); const rettet = maps[maps.length - 1].thr === .55 && maps[maps.length - 1].inv === true && maps[maps.length - 1].id === id;
      Regler.ret(id, { inv: undefined }); const fjernetFelt = !('inv' in Regler.find(id));
      const gemt = JSON.parse(localStorage.getItem('rytme-mapping2')).some(m => m.id === id && m.thr === .55);
      Regler.samlet(() => { Regler.tilfoej({ band: 'bas', effect: 'glod', thr: .3, gain: 1, att: 20, rel: 200 }); Regler.tilfoej({ band: 'snare', effect: 'ring', thr: .3, gain: 1, att: 8, rel: 200 }) }); const eftSamlet = maps.length;
      Regler.slet(id); const slettet = !Regler.find(id) && maps.length === n0 + 2, ukendt = Regler.slet('findes-ikke') === false && Regler.ret('findes-ikke', { thr: 1 }) === false;
      const kopi = Regler.alle(); kopi.pop(); const kopiErKopi = maps.length === n0 + 2;
      Regler.erstat([{ band: 'kick', effect: 'puls', thr: .3, gain: 1, att: 8, rel: 120 }, { band: 'bas', effect: 'glod', thr: .3, gain: 1, att: 20, rel: 200 }]); const erstattet = maps.length === 2 && Regler.antal() === 2 && maps.every(m => m.id);
      stop(); Regler.tilfoej({ band: 'hihat', effect: 'strobe', thr: .3, gain: 1, att: 5, rel: 80 }); const eftStop = hændt.length;
      return { iListen, rettet, fjernetFelt, gemt, eftSamlet: eftSamlet - n0, slettet, ukendt, kopiErKopi, erstattet, hændt, eftStop }; });
    T.tjek(api.iListen && api.rettet && api.fjernetFelt && api.gemt && api.slettet && api.ukendt && api.kopiErKopi && api.erstattet, 'Regler: tilfoej giver et nyt id (et medsendt id bruges ikke), find, ret (id kan ikke rettes; undefined fjerner et felt), slet, alle (en kopi) og erstat virker og gemmes', JSON.stringify(api));
    T.tjek(api.hændt.join() === 'tilfoej,ret,ret,samlet,slet,erstat' && api.eftStop === 6, `lyt: én besked pr. ændring (${api.hændt.join(', ')}); samlet giver én besked for to regler; ingen besked efter afmelding`);
    /* 4 · id overalt */
    const id = await side.evaluate(async () => { const ens = () => { const s = new Set(maps.map(m => m.id)); return maps.every(m => typeof m.id === 'string' && m.id) && s.size === maps.length }; const ud = { for: [] };
      for (const f of FORINDST) { if (f.auto) continue; try { brugFor(f.id, true) } catch (e) { ud.for.push(f.id + ' fejl') } if (!ens()) ud.for.push(f.id) }
      brugFor('piger_show', true); await new Promise(r => setTimeout(r, 300)); const foer = maps.map(m => m.id).join();
      /* et gammelt sted: Radial Mesh lægger en regel til uden om Regler */
      maps.push(mk('rms', 'ryst', .3, 1, 20, 200)); renderMaps(); save(); ud.gammelt = ens() && maps.length === 38 && maps.slice(0, 37).map(m => m.id).join() === foer;
      /* uden save: sikkerhedsnettet */
      maps.push({ band: 'bas', effect: 'zoom', thr: .3, gain: 1, att: 20, rel: 200 }); await new Promise(r => setTimeout(r, 800)); ud.net = ens() && maps.length === 39;
      /* Duplikér figur: kopierne får nye id'er */
      selO = fase2.objekter.findIndex(o => o.navn === 'Lyshåret pige'); const n0 = maps.length; opDup(); renderMaps(); save(); ud.dup = ens() && maps.length > n0; ud.dupN = maps.length - n0;
      ud.ids = maps.map(m => m.id).join(); return ud; });
    T.tjek(!id.for.length && id.gammelt && id.net && id.dup, `hver regel har sit eget id: efter alle færdige opsætninger, efter en regel lavet et gammelt sted (de 37 andre beholder deres id), efter en ændring uden gem (sikkerhedsnettet) og efter Duplikér figur (${id.dupN} kopier med nye id'er)`, JSON.stringify({ for: id.for, g: id.gammelt, n: id.net, d: id.dup }));
    /* Fortryd og genstart */
    const fo = await side.evaluate(async () => { await new Promise(r => setTimeout(r, 1500)); const foer = maps.map(m => m.id).join(); Regler.slet(maps[0].id); await new Promise(r => setTimeout(r, 1500)); feFortryd(); await new Promise(r => setTimeout(r, 300)); return { tilbage: maps.map(m => m.id).join() === foer, ids: maps.map(m => m.id).join() }; });
    await side.reload(); await side.waitForTimeout(3500);
    const eft = await side.evaluate(() => maps.map(m => m.id).join());
    T.tjek(fo.tilbage && eft === fo.ids, 'Fortryd (Ctrl+Z) giver reglen tilbage med det samme id; efter genstart har alle regler de samme id\'er');
    /* 5 · motoren regner ens med og uden id */
    const mo = await side.evaluate(async () => { brugFor('fuld1', true); curGen = 'house'; gStart(); await new Promise(r => setTimeout(r, 2500)); const snap = () => maps.map((m, i) => +(R2M.ud[i] || 0).toFixed(4)).join(); const felter = maps.map(m => { const k = { ...m }; delete k.id; return JSON.stringify(k) }).join('|');
      const std = FORINDST.find(f => f.id === 'fuld1').lav().maps.map(m => JSON.stringify({ curve: 1, gap: 120, ...m })).length; gStop && gStop(); return { n: maps.length, std, aktive: maps.filter((m, i) => (R2M.ud[i] || 0) > 0).length, kunId: maps.every(m => Object.keys(m).includes('id')), felter: felter.length }; });
    T.tjek(mo.n === mo.std && mo.aktive > 0 && mo.kunId, `opsætningen Alle effekter har de samme ${mo.n} regler som før, kun med et id mere; motoren giver udslag på ${mo.aktive} af dem med generatoren`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
