/* Trin 4 · Det nye i v9.55: matrixen, trin 2d (samme vilkår), og mindre på skærmen. Fase 2 i PLAN-NY-BRUGERFLADE.md.
   - Hver regel-node har en titel, der siger, hvad reglen gør ("lydtræk → mål").
   - Det gule ! for en regel uden udsving står også på regel-noden; et museklik giver udsvinget.
   - Fjernet: Matrix (gammel) i Visning ▾; knapperne fra de andre vinduer i kontrolpanelet og Ctrl+K (fjerne-listen nr. 49);
     Håndtag i billedet (nr. 41); udvikler-tekst og henvisninger til Mapping og Router.
   Rigtige museklik ved 1920 × 1080 og 2560 × 1440. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Samme vilkår');
  console.log('50 · Noder og Matrix på samme vilkår, og mindre på skærmen · ' + path.basename(fil));
  const html = fs.readFileSync(fil, 'utf8'), kode = html.slice(html.indexOf('id="rytme-runtime"'), html.indexOf('<!-- v9.32: den nye three.js'));
  const rester = ["['matrix','Matrix", 'data-ne39', 'const NE16', 'function ne39', 'ændres her, i Mapping', 'Alle 16 trin er bygget', "' i Mapping'", 'Ændres i Mapping eller Router', 'kommer i Mapping, når', "Radial Mesh eller Dublet.'", 'Tilslut MIDI i Mapping', 'står stadig i Mapping og Router', 'Finjustér i Mapping', 'ved siden af r128)\'', 'data-ne42="haand"'].filter(s => kode.includes(s));
  T.tjek(!rester.length, 'væk fra koden: Matrix (gammel) i listen over visninger, knapperne fra de andre vinduer, funktionslistens tal, knappen Håndtag i billedet og teksterne om Mapping, Router, trin og versioner', rester.join(' · '));
  const browser = await chromium.launch();
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
      await side.goto('file://' + fil); await side.waitForTimeout(3500);
      const a = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); brugFor('fuld2', true); await vent(800); lay3Anvend('noder'); await vent(2500); neVaelg(null); await vent(300);
        const R = [...NE2.N.values()].filter(n => n.kol === 'regel' && n.m && n.el), kp = document.getElementById('ne-kp'), L = []; neKpPunkter(L); const tr = document.querySelector('#ne .ne-trin');
        return { regler: R.length, titler: R.filter(n => { const t = n.el.querySelector('.ne-nt'); return t && t.textContent === neLtNavn(n.m.band) + ' → ' + neMaalNavn(n.m.effect) && t.title === t.textContent }).length, eks: R[0].el.querySelector('.ne-nt').textContent, slags: R.every(n => !!n.el.querySelector('select[data-nf="slags"]')),
          trin: !!tr && tr.offsetParent !== null, kp: kp.textContent, kpKnapper: [...kp.querySelectorAll('button')].map(b => b.textContent.trim()), sorter: kp.querySelectorAll('[data-ne42="sort"]').length,
          vis: [...document.getElementById('ne41-vis').options].map(o => o.textContent), ck: L.map(x => x.n) } });
      T.tjek(a.regler > 5 && a.titler === a.regler && a.slags, `${w} × ${h}: alle ${a.regler} regel-noder har en titel, der siger, hvad reglen gør (fx "${a.eks}"); Handling eller Egenskab står stadig i listen på noden`, JSON.stringify({ regler: a.regler, titler: a.titler, slags: a.slags }));
      T.tjek(!a.trin && !/Mapping|Router|16 trin|v9\.\d|af 114|three\.js|r128/.test(a.kp), `${w} × ${h}: ingen udvikler-tekst og ingen henvisning til Mapping eller Router i værktøjslinjen og kontrolpanelet`, a.kp.slice(0, 300));
      T.tjek(a.sorter === 2 && !a.kpKnapper.some(k => /Gem som|Hent \d|Sammenlign|Tilslut MIDI|morgenstjerne|Håndtag/i.test(k)), `${w} × ${h}: kontrolpanelet (intet valgt) har Sortér og linjernes valg (${a.kpKnapper.join(', ')}), ikke knapperne fra Opsætninger og Værksted`, a.kpKnapper.join(', '));
      T.tjek(a.vis.length === 9 && !a.vis.some(v => /^Matrix|^Tidslinje/.test(v)) && !a.ck.some(n => /^Opsætning: |^Generator: |^Lydmotor: |^Håndtag i billedet|^Lydkilde: /.test(n)) && a.ck.some(n => /Vis reglerne som matrix/.test(n)) && a.ck.some(n => /Kort over forbindelserne/.test(n)), `${w} × ${h}: Visning ▾ har Noder og 8 visninger uden den gamle Matrix og Tidslinje (v9.77); Ctrl+K i Node-editoren har ikke længere knapperne fra de andre vinduer, men stadig matrixen og Kort over forbindelserne`, a.vis.join(', '));
      /* Lydkilde-nodens kontrolpanel har ikke længere knapperne fra Lydkilde-vinduet */
      const lk = await side.evaluate(async () => { const n = [...NE2.N.values()].find(x => x.kol === 'lydkilde'); if (!n) return null; neVaelg(n.key); await new Promise(r => setTimeout(r, 400)); const kp = document.getElementById('ne-kp'); return { k: [...kp.querySelectorAll('button')].map(b => b.textContent.trim()), saetning: !!kp.querySelector('.ne-kp-saetning') } });
      T.tjek(!!lk && lk.saetning && !lk.k.some(k => /Vælg lydfil|Afspil|Nyt mønster|Lydmotor|Auto-mapping/i.test(k)), `${w} × ${h}: Lydkilde-nodens kontrolpanel viser sætningen, ikke Lydkilde-vinduets knapper`, lk ? lk.k.join(', ') : 'ingen lydkilde-node');
      /* det gule ! på en regel-node: et museklik giver udsvinget */
      const d = await side.evaluate(async () => { const vent = ms => new Promise(r => setTimeout(r, ms)); const o = nyFigurHer('Danser', .5, .55, 'danser'); syncTargets(); save(); persistObj(); const tid = 'obj:' + o.id + ':0:dHoved'; Regler.tilfoej(mk('snare', tid, .3, 1, 20, 200)); await vent(1500);
        const n = [...NE2.N.values()].find(x => x.kol === 'regel' && x.m && x.m.effect === tid), a = n && n.el && n.el.querySelector('.ne-m-adv'); if (!a) return { adv: false }; try { neVaelg(n.key); neVis() } catch (e) {} await vent(500); const r = a.getBoundingClientRect(), el = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); const q = neEgAf(tid); return { adv: true, tid, x: r.x + r.width / 2, y: r.y + r.height / 2, fri: el === a, fra: q.e.fra, til: q.e.til } }).catch(e => ({ fejl: e.message }));
      if (d && d.adv && d.fri) await side.mouse.click(d.x, d.y); else if (d && d.adv) await side.evaluate(tid => { const n = [...NE2.N.values()].find(x => x.kol === 'regel' && x.m && x.m.effect === tid); n.el.querySelector('.ne-m-adv').dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true })) }, d.tid);
      await side.waitForTimeout(1200);
      const e = d && d.adv ? await side.evaluate(tid => { const n = [...NE2.N.values()].find(x => x.kol === 'regel' && x.m && x.m.effect === tid), q = neEgAf(tid); return { adv: !!(n && n.el && n.el.querySelector('.ne-m-adv')), fra: q.e.fra, til: q.e.til, toast: (document.getElementById('ne-toast') || {}).textContent || '' } }, d.tid) : null;
      T.tjek(!!d && d.adv && d.fra === d.til && !!e && !e.adv && e.fra === 0 && e.til === .8 && /Udsving sat/.test(e.toast), `${w} × ${h}: en regel uden udsving har et gult ! på regel-noden; et ${d && d.fri ? 'museklik' : 'klik'} på det giver udsvinget ${e ? e.fra + '–' + e.til : '?'} og fjerner mærket`, JSON.stringify({ d, e }));
      /* en ny regel: beskeden nævner ikke Mapping */
      const ny = await side.evaluate(async () => { ne5Ny('hihat', 'strobe'); await new Promise(r => setTimeout(r, 400)); return (document.getElementById('ne-toast') || {}).textContent || '' });
      T.tjek(/^Ny regel: /.test(ny) && !/Mapping|nr\. \d/.test(ny), `${w} × ${h}: beskeden efter en ny regel er "${ny.replace(/Fortryd$/, '')}"`);
      T.tjek(!fejl.length, `${w} × ${h}: ingen fejl i browseren`, fejl.slice(0, 3).join(' | '));
      await ctx.close();
    }
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
