/* Trin 4 · Det nye i v9.130 (P8.33 trin 1): ærlig måling. Ved 1920 × 1080: de 23 stykker i MDB Drums er delt i to faste grupper (indstil 12, tjek 11,
   ingen fælles, jazz og rock i begge, ét stykke på 222 BPM i hver); andre navne deles hvert andet i alfabetisk rækkefølge; med den lille testmappe fra test 99
   (rigtigt klik på Vælg facit-mappe er afprøvet i test 99; her bruges mappe-vælgeren direkte) har hver række tal for indstil og tjek, og regnskabet passer
   (indstil + tjek = alle); hver celle viser "tjek N"; "Sådan måles" forklarer grupperne; rapporten har "indstil og tjek"; rampen for fasens sikkerhed er den nye
   (0,40 → 0,90), og faktoren for den halve takt er stadig 1,6; ingen konsolfejl. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const { lavMappe } = require('./99-rigtige-trommer');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Indstil og tjek'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('110 · Ærlig måling: indstil og tjek (P8.33 trin 1) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-grp-')), { M } = lavMappe(tmp);
  const browser = await chromium.launch(); const side = await browser.newPage({ viewport: { width: 1920, height: 1080 } }); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500);
    const g = await side.evaluate(() => { const I = MDBG.INDSTIL, T = MDBG.TJEK, alle = I.concat(T); return { nI: I.length, nT: T.length, faelles: I.filter(x => T.includes(x)).length, unik: new Set(alle).size, jazzI: I.filter(x => /Jazz/.test(x)).length, jazzT: T.filter(x => /Jazz/.test(x)).length, rockI: I.filter(x => /Rock|Grunge|Hendrix|Zeppelin/.test(x)).length, rockT: T.filter(x => /Rock|Punk|Beatles|Britpop/.test(x)).length, hurtig: [mdbGruppe('MusicDelta_BebopJazz'), mdbGruppe('MusicDelta_Gospel')], halv: A3.HALV, ramp: [a3FaseKonf(0, true), a3FaseKonf(.25, true)].map(x => Math.round(x * 100) / 100) } });
    T.tjek(g.nI === 12 && g.nT === 11 && g.faelles === 0 && g.unik === 23 && g.jazzI >= 3 && g.jazzT >= 3 && g.rockI >= 3 && g.rockT >= 3 && g.hurtig[0] !== g.hurtig[1], `to faste grupper: indstil ${g.nI} og tjek ${g.nT} (ingen fælles; jazz ${g.jazzI}/${g.jazzT}, rock ${g.rockI}/${g.rockT}; BebopJazz i ${g.hurtig[0]}, Gospel i ${g.hurtig[1]})`, JSON.stringify(g));
    T.tjek(g.halv === 1.6 && g.ramp[0] === .4 && g.ramp[1] === .9, `målt igen: den halve takt bliver 1,6; rampen for fasens sikkerhed med toner er 0,40 → 0,90`, JSON.stringify(g));
    await side.evaluate(() => { asAaben('kick') }); await side.waitForTimeout(1200);
    await side.setInputFiles('#as-mdb-fil', M); await side.waitForFunction(() => !MDB.koerer && MDB.data && MDB.data.res && MDB.data.spor4, null, { timeout: 300000 }); await side.waitForTimeout(600);
    const r = await side.evaluate(() => { const D = MDB.data.res, ud = { grp: [mdbGruppe('Test_Pop'), mdbGruppe('Test_Rock')], ok: true, rk: [] };
      for (const [v] of MDB.V) for (const k in D[v]) { const x = D[v][k]; if (!x.grp) { ud.ok = false; ud.rk.push(v + ':' + k + ' mangler'); continue } const I = x.grp.indstil, T = x.grp.tjek; ['hit', 'n', 'fa', 'ov'].forEach(f => { if (I[f] + T[f] !== x[f]) { ud.ok = false; ud.rk.push(v + ':' + k + ':' + f) } }); if (I.stk + T.stk !== x.pm.length) { ud.ok = false; ud.rk.push(v + ':' + k + ':stk') } }
      const c = [...document.querySelectorAll('#as-mdb .mdb-tjek')]; ud.celler = c.length; ud.c0 = c[0] ? c[0].textContent : ''; ud.titel = c[0] ? c[0].title : ''; ud.hv = (document.querySelector('#as-mdb details.as-hvordan') || {}).textContent || ''; ud.rap = asRapport(); return ud });
    T.tjek(r.grp[0] !== r.grp[1] && r.ok, `testmappen: Test_Pop i ${r.grp[0]}, Test_Rock i ${r.grp[1]}; i alle rækker er indstil + tjek = alle (rammer, slag, falske, oversete, stykker)`, JSON.stringify(r.rk));
    T.tjek(r.celler >= 10 && /^tjek \d+$/.test(r.c0) && /Tjek-gruppen alene/.test(r.titel) && /Indstil og tjek/.test(r.hv) && /tuning set og test set/.test(r.hv) && /indstil og tjek: Kick \(KD\) indstil \d+ \/ tjek \d+/.test(r.rap), `hver celle viser "${r.c0}" (${r.celler} celler); "Sådan måles" og rapporten har indstil og tjek`, JSON.stringify({ c0: r.c0, n: r.celler }));
    await side.evaluate(() => document.getElementById('as-mdb').scrollIntoView({ block: 'start' })); await side.waitForTimeout(300);
    await side.screenshot({ path: path.join(UD, 'indstil-og-tjek.png') });
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
