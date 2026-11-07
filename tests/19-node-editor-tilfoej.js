/* Trin 4 · Det nye i v9.24: Node-editoren, trin 6 (+ Tilføj og Ctrl+K). Se docs/PLAN-NODE-EDITOREN.md og papirets afsnit 5.2.
   - Ctrl+K: to grupper, "Tilføj node" (typefarve og levende bar) og "Knapper"; finder både noder og de gamle knapper.
   - En node fra Ctrl+K lander nederst i sin kolonne, kortet flytter sig derhen, og den lyser kort op; den huskes efter genstart; maps ændres ikke.
   - + Tilføj i kolonnerne: kun det, der passer (fx Regel: Handling og Egenskab); et mål uden regler står med "Ingen regler"; Ryd tomme mål.
   - En ny regel uden kilde: slip et lydtræk på den, træk til en figur, vælg mål → reglen i maps.
   - Tilfældigt og Kør Auto-mapping fortrydes i ét trin (Ctrl+Z).
   Skærmbilleder: tests/ud/node-editor-ctrlk.png og node-editor-plus-tilfoej.png (deviceScaleFactor 2). */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
const FARVEKODE = /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(|(?<![\w-])(?:white|black|red|orange|yellow|gold|pink|purple|violet|magenta|gr[ae]y|silver|blue|green|brown)(?![\w-])/;

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Node-editor (trin 6)'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('19 · Node-editor, trin 6 · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8');
  const a = html.indexOf('/* ========== v9.24: NODE-EDITOR (TRIN 6)'), b = html.indexOf('/* ========== SLUT: NODE-EDITOR (TRIN 6)');
  const blok = a > 0 && b > a ? html.slice(a, b) : '';
  const lin = blok.split('\n').map(l => l.replace(/\/\*[^]*?\*\//g, '')).filter(l => FARVEKODE.test(l));
  T.tjek(blok && !lin.length, 'ingen farvekoder i blokken for trin 6', lin.slice(0, 2).map(l => (l.match(FARVEKODE) || [''])[0]).join(', '));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1600, height: 1000 }, deviceScaleFactor: 2 });
    const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
    side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const vent = ms => side.waitForTimeout(ms);
    await side.evaluate(async () => { brugFor('fuld1', true); lay3Anvend('noder'); await new Promise(r => setTimeout(r, 1000)); });
    const json0 = await side.evaluate(() => JSON.stringify(maps));

    /* 1 · Ctrl+K: to grupper */
    await side.keyboard.press('Control+k'); await vent(300);
    await side.keyboard.type('tonehøjde'); await vent(400);
    const kp = await side.evaluate(() => { const g = [...document.querySelectorAll('#kp-liste .kp-g')].map(x => x.textContent), r = [...document.querySelectorAll('#kp-liste .kp-r')].map(x => ({ n: x.querySelector('span').textContent, ne: !!x.querySelector('.kp-prik'), bar: !!x.querySelector('.kp-bar'), farve: getComputedStyle(x.querySelector('.kp-prik') || x).backgroundColor })); return { g, r }; });
    T.tjek(kp.g[0] === 'Tilføj node' && kp.r[0] && kp.r[0].ne && kp.r[0].bar && /Lydtræk: Tonehøjde/.test(kp.r[0].n) && /^rgb/.test(kp.r[0].farve), `Ctrl+K "tonehøjde": gruppen Tilføj node med "${kp.r[0] && kp.r[0].n}" (typefarve ${kp.r[0] && kp.r[0].farve} og levende bar)`);
    await side.screenshot({ path: path.join(UD, 'node-editor-ctrlk.png') });
    await side.keyboard.press('Enter'); await vent(700);
    const t1 = await side.evaluate(() => { const n = NE2.N.get('l:ana:pitch'), fl = document.getElementById('ne-flade').getBoundingClientRect(), r = n && n.el.getBoundingClientRect(); const andre = [...NE2.N.values()].filter(x => x.kol === 'lydtraek' && x !== n); return n ? { los: set.ne.loese.includes('l:ana:pitch'), nederst: andre.every(x => x.y < n.y), synlig: r.top >= fl.top && r.bottom <= fl.bottom + 1 && r.left >= fl.left && r.right <= fl.right + 1, blink: n.el.classList.contains('ne-blink'), link: NE2.L.some(l => l.fra === 'a:tone' && l.til === 'l:ana:pitch'), hjem: n.hjem } : null; });
    T.tjek(t1 && t1.los && t1.nederst && t1.synlig && t1.blink && t1.link, 'Enter: Tonehøjde lander nederst i Lydtræk-kolonnen, kortet flytter sig derhen, noden lyser kort op og har link fra Tone og akkord');
    await side.keyboard.press('Control+k'); await vent(300); await side.keyboard.type('noder'); await vent(300);
    const kn = await side.evaluate(() => [...document.querySelectorAll('#kp-liste .kp-g')].map(x => x.textContent).join(',') + ' | ' + [...document.querySelectorAll('#kp-liste .kp-r span')].map(x => x.textContent).filter(t => /Layout: Noder/.test(t)).join(''));
    await side.keyboard.press('Escape');
    T.tjek(/Knapper/.test(kn) && /Layout: Noder/.test(kn), `Ctrl+K finder også de gamle knapper i gruppen Knapper (${kn})`);

    /* 2 · + Tilføj: Mål og Ryd tomme mål */
    await side.click('#ne-hoveder .ne-hoved[data-kol="maal"] .ne-tilfoej'); await vent(300);
    const ml = await side.evaluate(() => { const m = document.getElementById('ne-menu'); return { titel: m.querySelector('.ne-menu-t').textContent, g: m.querySelectorAll('.ne-menu-g').length, n: m.querySelectorAll('.ne-menu-i').length, søg: !!m.querySelector('.ne-menu-s') }; });
    await side.screenshot({ path: path.join(UD, 'node-editor-plus-tilfoej.png') });
    T.tjek(/Mål/.test(ml.titel) && ml.g >= 3 && ml.n > 20 && ml.søg, `+ Tilføj i Mål: ${ml.n} mål i ${ml.g} grupper (efter figur) og et søgefelt`);
    /* et mål, ingen regel bruger endnu */
    const tomt = await side.evaluate(() => { const t = TARGETS.find(t => !t.id.startsWith('obj:') && !/^klods|^lyd:|^liv:/.test(t.id) && !maps.some(m => m.effect === t.id)); const fg = neFigurAf(t.id); return { id: t.id, navn: neMaalNavn(t.id), fk: fg.key }; });
    await side.fill('#ne-menu .ne-menu-s', tomt.navn); await vent(200);
    await side.evaluate(id => document.querySelector('#ne-menu .ne-menu-i[data-v="m:' + id + '"]').click(), tomt.id); await vent(600);
    const tm = await side.evaluate(([id, fk]) => { const n = NE2.N.get('m:' + id); return n ? { tom: n.el.classList.contains('ne-tom'), tekst: n.el.textContent, fig: !!NE2.N.get(fk), link: NE2.L.some(l => l.fra === fk && l.til === 'm:' + id) } : null; }, [tomt.id, tomt.fk]);
    T.tjek(tm && tm.tom && /Ingen regler/.test(tm.tekst) && tm.fig && tm.link, `et mål uden regler (${tomt.navn}) står tonet ned med "Ingen regler" under ${tomt.fk.slice(2)}`);
    const ryd = await side.evaluate(id => { const n = neRydTommeMaal(); return { n, væk: !NE2.N.get('m:' + id), lt: !!NE2.N.get('l:ana:pitch') }; }, tomt.id);
    T.tjek(ryd.n === 1 && ryd.væk && ryd.lt, 'Ryd tomme mål fjerner det tomme mål (og kun det)');
    /* + Tilføj: Regel uden kilde → lydtræk på den → figur → mål */
    await side.click('#ne-hoveder .ne-hoved[data-kol="regel"] .ne-tilfoej'); await vent(300);
    const rv = await side.evaluate(() => [...document.querySelectorAll('#ne-menu .ne-menu-i')].map(b => b.textContent).join('|'));
    T.tjek(rv === 'Regel · Handling|Regel · Egenskab', `+ Tilføj i Regel viser kun det, der passer (${rv})`);
    await side.click('#ne-menu .ne-menu-i[data-v="handling"]'); await vent(600);
    const kl = await side.evaluate(() => { const k = NE5.kladder[0]; return k ? { band: k.band, tekst: NE2.N.get(k.key).el.textContent, key: k.key } : null; });
    T.tjek(kl && kl.band === null && /Mangler kilde/.test(kl.tekst), 'en ny regel uden kilde ("Mangler kilde: slip et lydtræk på den")');
    /* læg Tonehøjde, kladden og en figur ved siden af hinanden (som brugeren kan trække dem) */
    const fig = await side.evaluate(() => [...NE2.N.values()].find(n => n.kol === 'figur').key);
    await side.evaluate(([k, fig]) => { const x = c => NE.kol.find(q => q.k === c).x; NE.pos['l:ana:pitch'] = [x('lydtraek'), -480]; NE.pos[k] = [x('regel'), -480]; NE.pos[fig] = [x('figur'), -480]; ne2Byg(); NE.z = .5; NE.x = Math.round(20 - x('lydtraek') * NE.z); NE.y = Math.round(96 + 480 * NE.z); NE.tilpas = false; neVaelg(null); neVis(); }, [kl.key, fig]); await vent(300);
    const pt = (key, p) => side.evaluate(([key, p]) => { const e = p ? NE2.N.get(key).el.querySelector('.ne-port[data-p="' + p + '"]') : NE2.N.get(key).el.querySelector('.ne-nh'); const r = e.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, [key, p]);
    const træk = async (a, b) => { await side.mouse.move(a.x, a.y); await side.mouse.down(); await side.mouse.move((a.x + b.x) / 2, (a.y + b.y) / 2, { steps: 4 }); await side.mouse.move(b.x, b.y, { steps: 4 }); await side.mouse.up(); await vent(400); };
    await træk(await pt('l:ana:pitch', 'ud'), await pt(kl.key));
    const kb = await side.evaluate(() => NE5.kladder[0] && NE5.kladder[0].band);
    T.tjek(kb === 'ana:pitch', 'et lydtræk sluppet på den nye regel giver den kilden (Tonehøjde)');
    const n0 = await side.evaluate(() => maps.length);
    await træk(await pt(kl.key, 'ud'), await pt(fig));
    await side.evaluate(() => document.querySelector('#ne-menu .ne-menu-i').click()); await vent(600);
    const ny = await side.evaluate(() => ({ n: maps.length, m: maps[maps.length - 1], kl: NE5.kladder.length }));
    T.tjek(ny.n === n0 + 1 && ny.m.band === 'ana:pitch' && ny.kl === 0, `… og træk til en figur: reglen står i maps (${ny.m.band} → ${ny.m.effect})`);

    /* 3 · Løse noder huskes; maps blev kun ændret af den nye regel */
    await vent(600);
    await side.reload(); await side.waitForTimeout(3500);
    const gen = await side.evaluate(async () => { lay3Anvend('noder'); await new Promise(r => setTimeout(r, 900)); return { pitch: !!NE2.N.get('l:ana:pitch'), loese: set.ne.loese }; });
    T.tjek(gen.pitch && gen.loese.includes('l:ana:pitch'), `løse noder huskes efter genstart (${gen.loese.join(', ')})`);

    /* 4 · Tilfældigt og Kør Auto-mapping fortrydes i ét trin */
    const r1 = await side.evaluate(async () => { await new Promise(r => setTimeout(r, 1500)); const før = JSON.stringify(maps); kpAabn(); document.getElementById('kp-in').value = 'tilfældigt: slag'; document.getElementById('kp-in').dispatchEvent(new Event('input')); await new Promise(r => setTimeout(r, 200)); const i = KV_FIND(); return { før, i }; function KV_FIND() { const r = [...document.querySelectorAll('#kp-liste .kp-r')].find(x => /Tilfældigt: slag/.test(x.textContent)); if (r) r.click(); return !!r; } });
    await vent(1600);
    const r2 = await side.evaluate(async før => { const ændret = JSON.stringify(maps) !== før; document.querySelector('.ne-vk[data-ne4="fortryd"]').click(); await new Promise(r => setTimeout(r, 600)); return { ændret, tilbage: JSON.stringify(maps) === før }; }, r1.før);
    T.tjek(r1.i && r2.ændret && r2.tilbage, 'Tilfældigt: slag fra Ctrl+K ændrer reglerne, og ét Fortryd bringer dem præcis tilbage');
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-ne6-')), 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav);
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await vent(1500);
    const a1 = await side.evaluate(async () => { const før = JSON.stringify(maps); kpAabn(); document.getElementById('kp-in').value = 'auto-mapping'; document.getElementById('kp-in').dispatchEvent(new Event('input')); await new Promise(r => setTimeout(r, 200)); const r = [...document.querySelectorAll('#kp-liste .kp-r')].find(x => /Kør Auto-mapping/.test(x.textContent)); if (r) r.click(); await new Promise(r => setTimeout(r, 1800)); const efter = JSON.stringify(maps); document.querySelector('.ne-vk[data-ne4="fortryd"]').click(); await new Promise(r => setTimeout(r, 700)); return { fundet: !!r, ændret: efter !== før, n: JSON.parse(efter).length, tilbage: JSON.stringify(maps) === før }; });
    T.tjek(a1.fundet && a1.ændret && a1.tilbage, `Kør Auto-mapping fra Ctrl+K laver ${a1.n} regler ud fra sangen, og ét Fortryd bringer de gamle præcis tilbage`);
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
    await ctx.close();
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/node-editor-ctrlk.png og tests/ud/node-editor-plus-tilfoej.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
