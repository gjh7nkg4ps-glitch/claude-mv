/* Trin 4 · Det nye i v9.12: Lydkort (kildegruppen lk: fra Lydkosmos) er fjernet.
   - Lydkort findes ingen steder: ingen lk:-kilder i kildelisterne, Router, Radial Mesh, Mesh 3D og Dublet; intet kort i Lydkilde; ingen knap i sidebjælken; ingen funktioner tilbage; intet afsnit i manualen.
   - En gemt plads fra før (lavet med v9.11) med lk:-kilder går ikke i stykker: forbindelserne bliver stående, slås fra og giver 0, og der kommer en tydelig besked (statuslinje, øverst i Mapping og Router og ved forbindelsen). Andre forbindelser er urørte.
   - Det samme, når programmet starter med en gemt opsætning med en lk:-kilde.
   - Afspilning med en fjernet kilde giver ingen fejl.
   Skærmbilleder: tests/ud/lydkort-fjernet-mapping.png og tests/ud/lydkort-fjernet-router.png. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');

async function kør(arg) {
  const fil = findFil(arg), T = tæller('Lydkort fjernet'), UD = path.join(__dirname, 'ud');
  fs.mkdirSync(UD, { recursive: true });
  console.log('8 · Lydkort fjernet · ' + path.basename(fil));
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
  const ctx = await browser.newContext({ viewport: { width: 1600, height: 1400 } });
  const side = await ctx.newPage();
  let fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message));
  side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text()); });
  const nyeFejl = () => { const f = fejl; fejl = []; return f; };
  const html = fs.readFileSync(fil, 'utf8');
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4000);

    /* Lydkort findes ingen steder */
    const væk = await side.evaluate(() => {
      const liste = [typeof bandOptsAlle === 'function' ? bandOptsAlle('') : '', typeof feKildeOpts === 'function' ? feKildeOpts('') : ''].join('');
      return { optioner: (liste.match(/value="lk:/g) || []).length, router: r2AlleKilder().filter(k => k.startsWith('lk:')).length,
        grupper: [...document.querySelectorAll('select option[value="lk"]')].length,
        funktioner: ['LK', 'LK_KO', 'LK_KILDER', 'lkV', 'lkNavn', 'lkIndlaes', 'lkIndlaesFil', 'lkOptgruppe'].filter(n => { try { return typeof eval(n) !== 'undefined'; } catch (e) { return false; } }),
        lydkilde: !!document.getElementById('lks-lk') || [...document.querySelectorAll('#lks h4')].some(h => /Lydkort/.test(h.textContent)), knap: !!document.querySelector('[data-sbg="lk"]') || !!document.getElementById('lk-fil'),
        lydkildeKort: [...document.querySelectorAll('#lks h4')].map(h => h.textContent) };
    });
    T.tjek(væk.optioner === 0 && væk.router === 0, 'ingen lk:-kilder i kildelisterne og i Router');
    T.tjek(væk.grupper === 0, 'ingen kildegruppe Lydkort i Radial Mesh, Mesh 3D og Dublet');
    T.tjek(!væk.lydkilde && !væk.knap, 'intet Lydkort-kort i Lydkilde (' + væk.lydkildeKort.join(', ') + ') og ingen knap til lydkort-filer');
    T.tjek(!væk.funktioner.length, 'ingen Lydkort-funktioner tilbage i koden', væk.funktioner.join(', '));
    const m0 = html.indexOf('<h3 id="man-v912">'), manual = html.slice(m0, html.indexOf('<script', m0)); /* kun manualen, ikke koden */
    T.tjek(!html.includes('id="man-v65"') && (html.replace(/<script[\s\S]*?<\/script>/g, '').match(/Lydkosmos/g) || []).length === (manual.slice(0, manual.indexOf('</ul>')).match(/Lydkosmos/g) || []).length && !/Lydkosmos/.test(manual.slice(manual.indexOf('</ul>'))), 'manualen: afsnittet om Lydkort er væk, og Lydkosmos nævnes kun i afsnittet om v9.12');

    /* En gemt plads fra før med lk:-kilder */
    const plads = await side.evaluate(async () => {
      slotSave('A', 'gammel'); const d = JSON.parse(localStorage.getItem('rytme-A'));
      d.maps = [{ band: 'lk:kick', effect: 'puls', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'kick', effect: 'ring', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120, port: 'lk:beat', portT: .5 }, { band: 'bas', effect: 'glod', thr: .2, gain: 1, att: 20, rel: 200, curve: 1, gap: 120 }];
      localStorage.setItem('rytme-A', JSON.stringify(d)); slotLoad('A'); await new Promise(r => setTimeout(r, 400));
      const st = document.getElementById('status').textContent;
      return { n: maps.length, off: maps.map(m => !!m.off), fjernet: maps.map(m => m.fjernet || ''), band0: maps[0].band, port1: maps[1].port, status: st,
        banner: (document.querySelector('#maps .fj-banner') || {}).textContent || '', noter: document.querySelectorAll('#maps .fj-note').length, navn: bandNavn('lk:kick') };
    });
    T.tjek(plads.n === 3 && plads.band0 === 'lk:kick' && plads.port1 === 'lk:beat', 'pladsen hentes med alle 3 forbindelser; de fjernede kilder står der stadig');
    T.tjek(plads.off.join() === 'true,true,false' && plads.fjernet.join() === 'lk,lk,', 'forbindelsen med kilden lk:kick og den med porten lk:beat er slået fra; bas er urørt');
    T.tjek(/fjernet i v9\.12/.test(plads.status) && /1, 2/.test(plads.status), 'beskeden i statuslinjen: "' + plads.status.slice(0, 120) + '"');
    T.tjek(/2 forbindelser/.test(plads.banner) && plads.noter === 2, 'Mapping: gul besked øverst og en note ved begge forbindelser');
    T.tjek(plads.navn === 'Fjernet kilde: Lydkort kick', 'navnet på den fjernede kilde: "' + plads.navn + '"');
    const valgt = await side.evaluate(() => { const s = document.querySelector('#maps .row[data-i="0"] select[data-f="band"]'); fyldMapListe(s); return { v: s.value, t: s.options[s.selectedIndex].textContent }; });
    T.tjek(valgt.v === 'lk:kick', 'kildelisten ved forbindelsen viser stadig den fjernede kilde: "' + valgt.t + '"');
    await side.locator('#w25').screenshot({ path: path.join(UD, 'lydkort-fjernet-mapping.png') });

    await side.evaluate(() => { set.r2vis = 'kompakt'; const t = [...document.querySelectorAll('#w25 .fg-faner button')].find(b => b.textContent.trim() === 'Router'); t.click(); });
    await side.waitForFunction(() => document.querySelector('#r2 .r2-boks'), null, { timeout: 10000 });
    await side.waitForTimeout(800);
    const r2 = await side.evaluate(() => ({ banner: !!document.querySelector('#r2 .fj-banner'), noter: document.querySelectorAll('#r2 .fj-note').length, slukket: document.querySelectorAll('#r2 .r2-boks.slukket').length }));
    T.tjek(r2.banner && r2.noter === 2 && r2.slukket === 2, 'Router: gul besked, en note ved begge forbindelser, og de står som slået fra');
    await side.locator('#w25').screenshot({ path: path.join(UD, 'lydkort-fjernet-router.png') });
    let f = nyeFejl(); T.tjek(!f.length, 'gammel plads uden fejl', f.slice(0, 3).join(' | '));

    /* Afspilning med fjernede kilder */
    const wav = lavTestlyd(path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'mv-lyd-')), 'testlyd-120bpm.wav'));
    await side.setInputFiles('#file', wav);
    await side.waitForFunction(() => F && Math.abs(dur - 30) < 1 && !document.getElementById('play').disabled, null, { timeout: 240000 });
    await side.evaluate(() => { maps[0].off = false; document.getElementById('play').click(); });
    await side.waitForTimeout(2500);
    const sp = await side.evaluate(() => ({ v0: R2M.v[0] || 0, ud0: R2M.ud[0] || 0, ud2: R2M.ud[2] || 0, kv: kildeV('lk:kick', now()) }));
    T.tjek(sp.kv === 0 && sp.ud0 === 0, `en fjernet kilde giver 0, også hvis man slår forbindelsen til igen (ud ${sp.ud0})`);
    await side.evaluate(() => document.getElementById('pause') && document.getElementById('pause').click());
    f = nyeFejl(); T.tjek(!f.length, 'afspilning med fjernede kilder uden fejl', f.slice(0, 3).join(' | '));

    /* Programmet starter med en gemt opsætning med en lk:-kilde */
    await side.evaluate(() => { localStorage.setItem('rytme-mapping2', JSON.stringify([{ band: 'lk:rms', effect: 'puls', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }, { band: 'kick', effect: 'ring', thr: .3, gain: 1, att: 8, rel: 120, curve: 1, gap: 120 }])); });
    await side.reload(); await side.waitForTimeout(4500);
    const start = await side.evaluate(() => ({ n: maps.length, off: maps.map(m => !!m.off), banner: !!document.querySelector('#maps .fj-banner') }));
    T.tjek(start.n === 2 && start.off.join() === 'true,false' && start.banner, 'ved opstart med en gemt lk:-forbindelse: den er slået fra, og beskeden står i Mapping');
    f = nyeFejl(); T.tjek(!f.length, 'opstart uden fejl', f.slice(0, 3).join(' | '));
  } catch (e) {
    T.fejl('testen stoppede: ' + e.message.split('\n')[0]);
  } finally { await browser.close(); }
  console.log('  skærmbilleder: tests/ud/lydkort-fjernet-mapping.png, tests/ud/lydkort-fjernet-router.png');
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
