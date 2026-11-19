/* Trin 4 · Det nye i v9.85 (pakke 7, B1): alt indbygget er beskyttet. Hver indbygget ting har et fast fingeraftryk (hash) i tests/indbygget.json:
   de 7 færdige opsætninger, der ikke afhænger af en sang (figurer og regler; figur-id'er normaliseres), de 6 regel-skabeloner (NE11_STD), danserens
   standardforbindelser (DANS_STD og danserStandard), diskokuglens kobling (diskoKobl), Morgenstjernen (nyMorgenstjerne og de 6 regler i skabelonen)
   og Standards regler (DEFAULT). Ændrer noget sig, fejler testen. Er ændringen villet: node tests/80-indbygget.js <fil> --opdater skriver nye fingeraftryk.
   Testen tjekker også, at kun de 10 opsætninger findes, at trommeslageren er væk, og at Nulstil bane, klods, figurer og lyd stadig virker. */
const path = require('path'); const fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const JSONFIL = path.join(__dirname, 'indbygget.json');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Indbygget'), opdater = process.argv.includes('--opdater');
  console.log('80 · Alt indbygget er beskyttet (v9.85) · ' + path.basename(fil));
  const browser = await chromium.launch();
  try {
    const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } }); const side = await ctx.newPage(); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push(m.text()) });
    await side.goto('file://' + fil); await side.waitForTimeout(4500);
    const r = await side.evaluate(async () => {
      const vent = ms => new Promise(r => setTimeout(r, ms));
      const hsh = s => { let h = 7; for (let i = 0; i < s.length; i++) h = (Math.imul(h, 31) + s.charCodeAt(i)) >>> 0; return h };
      const norm = o => { /* figur-id'er bliver til deres nummer i listen, så fingeraftrykket ikke afhænger af, hvilke figurer der fandtes før */
        const obj = (o.objekter || []).map((x, i) => ({ nr: i, id: x.id })), idTil = id => { const f = obj.find(x => x.id === id); return f ? '#' + f.nr : id };
        const maps = (o.maps || []).map(m => { const k = { ...m }; delete k.id; k.effect = String(k.effect).replace(/^obj:([^:]+):/, (a, id) => 'obj:' + idTil(id) + ':').replace(/^liv:(.+)$/, (a, id) => 'liv:' + idTil(id)); return k });
        const objekter = (o.objekter || []).map(x => { const k = JSON.parse(JSON.stringify(x)); k.id = idTil(k.id); return k });
        return JSON.stringify({ master: o.master, maps, objekter, scene: o.scene || null, lyd: o.lyd || null, show: o.show || null }) };
      const F = {}, ids = FORINDST.map(f => f.id);
      let seed = 11; const mr = Math.random; Math.random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
      for (const f of FORINDST) { if (f.auto) continue; seed = 11; try { F['ops:' + f.id] = hsh(norm(f.lav())) } catch (e) { F['ops:' + f.id] = 'fejl: ' + e.message } }
      Math.random = mr;
      F['skabeloner'] = hsh(JSON.stringify(NE11_STD)); F['DEFAULT'] = hsh(JSON.stringify(DEFAULT)); F['DANS_STD'] = hsh(JSON.stringify(DANS_STD));
      F['danserStandard'] = hsh(danserStandard.toString()); F['diskoKobl'] = hsh(diskoKobl.toString()); F['nyMorgenstjerne'] = hsh(nyMorgenstjerne.toString());
      F['MS_FRA_TIL'] = hsh(JSON.stringify([MS_FRA, MS_TIL]));
      /* trommeslageren er væk; Nulstil virker */
      const trommer = { fn: typeof opTrommer, knap: !!document.querySelector('[data-op="trommer"]'), ops: ids.includes('trommer_show'), tip: typeof TIP_ID === 'object' && 'trommer' in TIP_ID };
      brugFor('piger_show', true); await vent(400); const n0 = fase2.objekter.length, m0 = maps.length;
      const nul = opsNulstilVisuelt(); anvend(nul, null, 'test', true); await vent(400);
      const nulstil = { n0, m0, n1: fase2.objekter.length, m1: maps.length, std: maps.length === DEFAULT.length && maps.every((m, i) => m.band === DEFAULT[i].band && m.effect === DEFAULT[i].effect), spor: scene.spor };
      return { F, ids, trommer, nulstil, skift: !!document.getElementById('ops-skift') || !!document.getElementById('tb-skift'), label: (document.querySelector('#opsui label') || {}).textContent || '' };
    });
    T.tjek(r.ids.join(',') === 'auto1,auto2,auto3,piger_show,danser_show,ms_show,dronning_show,singlen,spilselv,klaverspil', `kun de 10 opsætninger findes: ${r.ids.join(', ')}`);
    T.tjek(r.trommer.fn === 'undefined' && !r.trommer.knap && !r.trommer.ops && !r.trommer.tip && !r.skift, 'trommeslageren (opTrommer, knappen, showet, tippet) og Random alt: skift automatisk er væk', JSON.stringify(r.trommer));
    T.tjek(r.nulstil.n0 >= 2 && r.nulstil.m0 > 11 && r.nulstil.n1 === 1 && r.nulstil.std, `Nulstil bane, klods, figurer og lyd virker uden opsætningen Nulstil (fra ${r.nulstil.n0} figurer og ${r.nulstil.m0} regler til 1 skjult figur og Standards 11 regler)`, JSON.stringify(r.nulstil));
    T.tjek(/^Opsætning \(10\)/.test(r.label.trim()), `Opsætninger skriver det rigtige antal: "${r.label.trim().slice(0, 20)}"`);
    const fejlH = Object.entries(r.F).filter(([k, v]) => typeof v !== 'number');
    T.tjek(!fejlH.length, 'alle fingeraftryk kunne regnes', fejlH.map(x => x.join(': ')).join('; '));
    if (opdater) { fs.writeFileSync(JSONFIL, JSON.stringify(r.F, null, 1) + '\n'); console.log('  fingeraftryk skrevet til tests/indbygget.json'); }
    else {
      let gemt = null; try { gemt = JSON.parse(fs.readFileSync(JSONFIL, 'utf8')) } catch (e) { }
      T.tjek(!!gemt, 'tests/indbygget.json findes (ellers: kør med --opdater)');
      if (gemt) { const diff = Object.keys(gemt).filter(k => gemt[k] !== r.F[k]), nye = Object.keys(r.F).filter(k => !(k in gemt));
        T.tjek(!diff.length && !nye.length, `det indbyggede er uændret (${Object.keys(gemt).length} fingeraftryk: ${Object.keys(gemt).join(', ')})`, 'ændret: ' + diff.join(', ') + (nye.length ? ' · nye: ' + nye.join(', ') : '') + ' (er ændringen villet: node tests/80-indbygget.js <fil> --opdater)'); }
    }
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
    await ctx.close();
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
