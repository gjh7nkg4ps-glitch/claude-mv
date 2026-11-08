/* Trin 4 · Det nye i v9.23: Node-editoren, trin 5 (lav og slet regler). Se docs/PLAN-NODE-EDITOREN.md og papirets afsnit 6 (forløb 1, 2 og 6).
   Forløb 1: træk et link fra et lydtræks udgang og slip på et tomt sted → Tilføj-listen viser kun Regel · Handling og Regel · Egenskab → reglen
   lægges, hvor man slap, og sover (findes ikke i maps) → træk fra dens udgang til en figur → menuen med figurens mål → reglen står i maps og i
   Mapping med samme standard som Router's "+ Ny forbindelse". Også: fra en analyses række, lydtræk direkte på en figur, skift mål ved at slippe på
   et mål, ny kilde og Gate ved at slippe på en regel, Esc afbryder, Slå fra / Slå til, Slet (knap og Delete), Fortryd (forløb 6).
   Skærmbilleder: tests/ud/node-editor-tilfoej.png og node-editor-maal-menu.png (deviceScaleFactor 2). */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const FARVEKODE = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:white|black|red|orange|yellow|gold|pink|purple|violet|magenta|gr[ae]y|silver|blue|green|brown)(?![\w-])/;

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 5)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('18 · Node-editor, trin 5 · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');
  const a = html.indexOf('/* ========== v9.23: NODE-EDITOR (TRIN 5)'), b = html.indexOf('/* ========== SLUT: NODE-EDITOR (TRIN 5)');
  const blok = a > 0 && b > a ? html.slice(a, b) : '';
  const lin = blok.split('\n').map(l => l.replace(/\/\*[^]*?\*\//g, '')).filter(l => FARVEKODE.test(l));
  T.tjek(blok && !lin.length, 'ingen farvekoder i blokken for trin 5', lin.slice(0, 2).map(l => (l.match(FARVEKODE) || [''])[0]).join(', '));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
    side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); NE.tilpas = false; NE.z = .5; NE.x = Math.round(20 - NE.kol.find(c => c.k === 'analyse').x * NE.z); NE.y = Math.round(96 + 480 * NE.z); neVis(); });
    /* de noder, testen bruger, lægges over alle andre (y under 0, hvor der ikke ligger noget), som brugeren kan trække dem, så start og mål kan ses */
    const læg = (key, kol, y) => side.evaluate(([key, kol, y]) => { NE.pos[key] = [NE.kol.find(c => c.k === kol).x, y]; ne2Byg(); }, [key, kol, y]);
    await vent(400);
    /* skærm-punkter */
    const port = (key, p) => side.evaluate(([key, p]) => { if (NE2.valgt && !NE5.kladder.length) neVaelg(null); const n = NE2.N.get(key), e = n.el.querySelector('.ne-port[data-p="' + p + '"]'); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, [key, p]);
    const midt = key => side.evaluate(key => { const r = NE2.N.get(key).el.querySelector('.ne-nh').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, key);
    const træk = async (fra, til) => { await side.mouse.move(fra.x, fra.y); await side.mouse.down(); await side.mouse.move((fra.x + til.x) / 2, (fra.y + til.y) / 2, { steps: 4 }); await side.mouse.move(til.x, til.y, { steps: 4 }); await side.mouse.up(); await vent(300); };
    const tomt = () => side.evaluate(() => { const fl = document.getElementById('ne-flade').getBoundingClientRect(); for (let y = fl.top + 120; y < fl.bottom - 40; y += 20) for (let x = fl.left + fl.width * .55; x < fl.right - 60; x += 20) { const e = document.elementFromPoint(x, y); if (e && (e.id === 'ne-flade' || e.id === 'ne-linjer' || e.id === 'ne-verden')) return { x, y }; } return null; });
    const før0 = await side.evaluate(() => maps.length);

    /* 1 · Forløb 1: lydtræk → tomt sted → Tilføj-listen → kladde */
    const lt = await side.evaluate(() => [...NE2.N.values()].find(n => n.kol === 'lydtraek').key);
    await læg(lt, 'lydtraek', -480); await vent(300);
    const t1 = await tomt();
    await træk(await port(lt, 'ud'), t1);
    const liste = await side.evaluate(() => { const m = document.getElementById('ne-menu'); return m ? { titel: m.querySelector('.ne-menu-t').textContent, valg: [...m.querySelectorAll('.ne-menu-i')].map(b => b.textContent) } : null; });
    T.tjek(liste && liste.valg.join('|') === 'Regel · Handling|Regel · Egenskab', `slip på et tomt sted: Tilføj-listen viser kun det, der passer ("${liste && liste.titel}": ${liste && liste.valg.join(', ')})`);
    await side.screenshot({ path: path.join(UD, 'node-editor-tilfoej.png') });
    await side.click('#ne-menu .ne-menu-i[data-v="handling"]'); await vent(400);
    const kl = await side.evaluate(([t1]) => { const k = NE5.kladder[0], n = k && NE2.N.get(k.key), fl = document.getElementById('ne-flade').getBoundingClientRect(); return k ? { maps: maps.length, sover: n.el.classList.contains('ne-kladde'), link: NE2.L.some(l => l.til === k.key), wx: NE.x + n.x * NE.z + fl.left, wy: NE.y + n.y * NE.z + fl.top, valgt: NE2.valgt === k.key, kp: document.querySelector('#ne-kp .ne-kp-tekst').textContent } : null; }, [t1]);
    T.tjek(kl && kl.maps === før0 && kl.sover && kl.link && Math.abs(kl.wx - t1.x) < 12 && Math.abs(kl.wy - t1.y) < 12 && kl.valgt && /mangler et mål/.test(kl.kp), 'den nye regel lægges, hvor man slap, sover (mangler mål), har et link fra lydtrækket og står ikke i maps endnu');
    /* kladde → figur → menu med mål */
    const fig = await side.evaluate(() => [...NE2.N.values()].find(n => n.kol === 'figur' && !n.gruppe) ? [...NE2.N.values()].find(n => n.kol === 'figur' && !n.gruppe).key : [...NE2.N.values()].find(n => n.kol === 'figur').key);
    await læg(fig, 'figur', -480); await vent(300);
    const kKey = await side.evaluate(() => NE5.kladder[0].key);
    await træk(await port(kKey, 'ud'), await midt(fig));
    const menu = await side.evaluate(() => { const m = document.getElementById('ne-menu'); return m ? { titel: m.querySelector('.ne-menu-t').textContent, n: m.querySelectorAll('.ne-menu-i').length, søg: !!m.querySelector('.ne-menu-s'), første: m.querySelector('.ne-menu-i').dataset.v } : null; });
    T.tjek(menu && menu.n > 3 && menu.søg, `slip på en figur: menuen med figurens mål ("${menu && menu.titel}", ${menu && menu.n} mål og et søgefelt)`);
    await side.screenshot({ path: path.join(UD, 'node-editor-maal-menu.png') });
    await side.click('#ne-menu .ne-menu-i[data-v="' + menu.første + '"]'); await vent(500);
    const ny = await side.evaluate(([v]) => { const m = maps[maps.length - 1]; const rows = maps.length; const k = 'r:' + m.band + '|' + m.effect + '|' + maps.filter(x => x.band === m.band && x.effect === m.effect).length; return { n: maps.length, m: JSON.stringify(m), effect: m.effect, rows, kladder: NE5.kladder.length, node: !!NE2.N.get(k), valgt: NE2.valgt === k, std: m.thr === .3 && m.gain === 1 && m.att === 20 && m.rel === 200 && m.curve === 1 && m.gap === 120 && m.min === true }; }, [menu.første]);
    T.tjek(ny.n === før0 + 1 && ny.effect === menu.første && ny.std && ny.rows === ny.n && ny.kladder === 0 && ny.node && ny.valgt, `reglen står nu i maps (${ny.rows} regler) med samme standard som Router's "+ Ny forbindelse": ${ny.m}`);

    /* 2 · Fra en analyses række (en kilde, ingen regel bruger endnu) */
    await læg('a:stereo', 'analyse', -480); await vent(300);
    const t2 = await tomt();
    await træk(await port('a:stereo', 'o:ana:bredde'), t2);
    await side.click('#ne-menu .ne-menu-i[data-v="egenskab"]'); await vent(400);
    const an = await side.evaluate(() => { const k = NE5.kladder[0]; return { band: k && k.band, slags: k && k.slags, lt: !!NE2.N.get('l:ana:bredde'), link: NE2.L.some(l => l.fra === 'a:stereo' && l.til === 'l:ana:bredde'), titel: k && NE2.N.get(k.key).el.querySelector('.ne-nt').textContent }; });
    T.tjek(an.band === 'ana:bredde' && an.slags === 'egenskab' && an.lt && an.link && /Egenskab/.test(an.titel), 'fra en analyses række (Stereobredde): nyt lydtræk med link fra Stereo og en ny regel · Egenskab');
    await side.evaluate(() => { neVaelg(NE5.kladder[0].key); }); await vent(200);
    await side.click('#ne-kp [data-ne5="slet-kladde"]'); await vent(300);
    T.tjek(await side.evaluate(() => NE5.kladder.length === 0 && !NE2.N.get('l:ana:bredde')), 'en ny regel uden mål kan slettes igen (og lydtrækket forsvinder med den)');

    /* 3 · Genveje: lydtræk direkte på en figur, skift mål, ny kilde, Gate, Esc */
    await side.evaluate(() => { for (const k in NE.pos) if (k.startsWith('r:')) delete NE.pos[k]; ne2Byg(); }); /* reglen fra forløb 1 blev sluppet midt på lærredet; den flyttes tilbage til sin automatiske plads */
    const n0 = await side.evaluate(() => maps.length);
    await træk(await port(lt, 'ud'), await midt(fig));
    const m2 = await side.evaluate(() => document.querySelector('#ne-menu .ne-menu-i:nth-of-type(2)') ? document.querySelectorAll('#ne-menu .ne-menu-i')[1].dataset.v : null);
    await side.click('#ne-menu .ne-menu-i[data-v="' + m2 + '"]'); await vent(500);
    const g1 = await side.evaluate(() => ({ n: maps.length, e: maps[maps.length - 1].effect }));
    T.tjek(g1.n === n0 + 1 && g1.e === m2, `lydtræk sluppet direkte på en figur: menuen og en ny regel (${g1.e})`);
    const iSidst = g1.n - 1;
    const rk = await side.evaluate(i => [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).key, iSidst);
    const mål = await side.evaluate(e => [...NE2.N.values()].find(n => n.kol === 'maal' && n.effect !== e).key, g1.e);
    await læg(rk, 'regel', -320); await læg(mål, 'maal', -320); await vent(300);
    const pRk = await port(rk, 'ud'), pM = await midt(mål);
    const hit = await side.evaluate(([a, b]) => { const f = (p) => { const e = document.elementFromPoint(p.x, p.y); return e ? (e.className || e.id) + (e.closest('.ne-node') ? '@' + e.closest('.ne-node').dataset.n : '') : 'ingen'; }; return f(a) + ' → ' + f(b); }, [pRk, pM]);
    await træk(pRk, pM);
    const g2 = await side.evaluate(([i, mål]) => ({ e: maps[i].effect, ventet: NE2.N.get(mål) ? NE2.N.get(mål).effect : mål.slice(2), toast: document.getElementById('ne-toast').textContent }), [iSidst, mål]);
    T.tjek(g2.e === mål.slice(2), `fra reglens udgang til et andet mål: reglen skifter mål (${g2.e}; "${g2.toast.replace('Fortryd', '').trim()}")`, hit);
    const lt2 = await side.evaluate(lt => [...NE2.N.values()].find(n => n.kol === 'lydtraek' && n.key !== lt).key, lt);
    const rk2 = await side.evaluate(i => [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).key, iSidst);
    await læg(lt2, 'lydtraek', -320); await læg(rk2, 'regel', -320); await vent(300);
    await træk(await port(lt2, 'ud'), await port(rk2, 'gate'));
    const g3 = await side.evaluate(([i, lt2]) => ({ port: maps[i].port, ventet: lt2.slice(2), portT: maps[i].portT }), [iSidst, lt2]);
    T.tjek(g3.port === g3.ventet && g3.portT === .5, `lydtræk sluppet på reglens gate-port: Gate fra ${g3.port} (Gate-tærskel ${g3.portT})`, 'ventet ' + g3.ventet);
    const rk3 = await side.evaluate(i => [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).key, iSidst);
    await læg(rk3, 'regel', -320); await vent(300);
    await træk(await port(lt2, 'ud'), await midt(rk3));
    T.tjek(await side.evaluate(([i, b]) => maps[i].band === b, [iSidst, lt2.slice(2)]), 'lydtræk sluppet på en regel: reglen får ny kilde');
    const esc = await side.evaluate(async () => { const n = maps.length; return n; });
    const t3 = await tomt(); await træk(await port(lt, 'ud'), t3); await side.keyboard.press('Escape'); await vent(200);
    T.tjek(await side.evaluate(n => !document.getElementById('ne-menu') && maps.length === n && NE5.kladder.length === 0, esc), 'Esc lukker Tilføj-listen, og intet ændres');

    /* 4 · Slå fra, Slet, Delete og Fortryd (forløb 6) */
    await side.evaluate(i => neVaelg([...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).key), iSidst); await vent(300);
    await side.click('#ne-kp [data-ne5="sluk"]'); await vent(400);
    const off = await side.evaluate(i => ({ off: maps[i].off, sluk: [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).el.classList.contains('ne-slukket'), knap: document.querySelector('#ne-kp [data-ne5="sluk"]').textContent }), iSidst);
    await side.click('#ne-kp [data-ne5="sluk"]'); await vent(400);
    const on = await side.evaluate(i => !('off' in maps[i]), iSidst);
    T.tjek(off.off === true && off.sluk && off.knap === 'Slå til' && on, 'Slå fra: reglen er slukket (sort skærm), knappen hedder Slå til; Slå til fjerner det igen');
    await vent(1200);
    const nFør = await side.evaluate(() => maps.length), jsonFør = await side.evaluate(() => JSON.stringify(maps));
    await side.click('#ne-kp [data-ne5="slet"]'); await vent(500);
    const sl = await side.evaluate(() => ({ n: maps.length, rows: maps.length }));
    await vent(1200);
    await side.click('.ne-vk[data-ne4="fortryd"]'); await vent(600);
    const fy = await side.evaluate(j => ({ n: maps.length, ens: JSON.stringify(maps) === j }), jsonFør);
    T.tjek(sl.n === nFør - 1 && sl.rows === sl.n && fy.n === nFør && fy.ens, `Slet regel: ${nFør} → ${sl.n} regler; Fortryd bringer den præcis tilbage`);
    await side.evaluate(i => neVaelg([...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).key), iSidst); await vent(200);
    await side.evaluate(i => [...NE2.N.values()].find(n => n.kol === 'regel' && n.i === i).el.focus(), iSidst);
    await side.keyboard.press('Delete'); await vent(400);
    T.tjek(await side.evaluate(n => maps.length === n - 1, nFør), 'Delete-tasten sletter den valgte regel');
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-tilfoej.png og tests/ud/node-editor-maal-menu.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
