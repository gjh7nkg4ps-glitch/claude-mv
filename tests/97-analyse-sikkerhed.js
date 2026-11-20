/* Trin 4 · Det nye i v9.110 (A0, P8.24): Analyse sikkerhed. Ved 1920 × 1080: matrixens rækker har en cirkel (⏻ · navn · dB · cirkel) inde i rækken;
   før testen står der "?" ved Kick og 99 ved Bas; boblen kommer, når musen peger; et rigtigt klik åbner Analyse → Analyse sikkerhed ved rækken;
   ▶ Kør testen (rigtigt klik) måler mod generatoren og gemmer resultatet med versionsnummeret; tallene hænger sammen (ramte + oversete = alle slag,
   F-målet); generatorens og sangens tilstand er urørt; rækken foldes ud; Kun dem i brug og Sortér: usikre først; cirklen i matrixen får tallet.
   4 spor: en fil på 16 minutter læses ikke ind og giver en besked. Ved 2560 × 1440 og 3840 × 2160: det gemte resultat vises, og intet stikker ud. */
const path = require('path'), fs = require('fs');
const { chromium } = require('playwright');
const { findFil, tæller, versionFraNavn } = require('./faelles');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Analyse sikkerhed'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('97 · Analyse sikkerhed (A0) · ' + path.basename(fil));
  const browser = await chromium.launch(); let gemt = null;
  try {
    for (const [w, h] of [[1920, 1080], [2560, 1440], [3840, 2160]]) {
      const ctx = await browser.newContext({ viewport: { width: w, height: h } }); const side = await ctx.newPage(); const fejl = [];
      side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text().slice(0, 200)); });
      await side.goto('file://' + fil); await side.waitForTimeout(4500);
      if (gemt) { await side.evaluate(d => localStorage.setItem('rytme-asik', d), gemt); await side.reload(); await side.waitForTimeout(4500); }
      const midt = sel => side.evaluate(sel => { const el = document.querySelector(sel); if (!el) return null; el.scrollIntoView({ block: 'nearest' }); const q = el.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel);
      const klik = async sel => { const p = await midt(sel); if (!p) throw new Error('findes ikke: ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(500) };
      const KICK = '#ne-mx th.mx-lt[data-b="kick"] .as-c';
      await side.evaluate(() => { lay3Anvend('noder'); mxSaet(true) }); await side.waitForTimeout(2500);
      const m0 = await side.evaluate(() => { const R = [...document.querySelectorAll('#ne-mx th.mx-lt')], c = b => { const e = document.querySelector('#ne-mx th.mx-lt[data-b="' + b + '"] .as-c'); return e ? { t: e.textContent, kl: e.className } : null };
        const th = document.querySelector('#ne-mx th.mx-lt[data-b="kick"]'), q = th.getBoundingClientRect(), k = th.querySelector('.as-c').getBoundingClientRect(), kt = th.querySelector('.mx-kt').getBoundingClientRect(), lf = th.querySelector('.mx-ltfra').getBoundingClientRect();
        return { n: R.length, c: R.filter(t => t.querySelectorAll('.as-c').length === 1).length, kick: c('kick'), bas: c('bas'), vokal: c('vokal'), inde: k.right <= q.right + .5 && k.left >= q.left && k.top >= q.top && k.bottom <= q.bottom, orden: lf.right <= kt.left && kt.right <= k.left + .5, hoejde: Math.round(q.height) } });
      if (!gemt) {
        T.tjek(m0.n > 3 && m0.c === m0.n, `${w} × ${h}: hver af matrixens ${m0.n} rækker har én cirkel`, JSON.stringify(m0));
        T.tjek(m0.kick && m0.kick.t === '?' && /as-k-n/.test(m0.kick.kl) && m0.bas && m0.bas.t === '99' && /as-k-g/.test(m0.bas.kl) && m0.vokal && m0.vokal.t === '?', 'før testen: Kick og Vokal har et gråt "?", Bas (ren matematik) har et grønt 99', JSON.stringify(m0));
        T.tjek(m0.inde && m0.orden && m0.hoejde <= 41, 'cirklen ligger inde i rækkens hoved (dækker ingen celle), i rækkefølgen ⏻ · navn · dB · cirkel; rækken er stadig 40 px høj', JSON.stringify(m0));
        const p = await midt(KICK); await side.mouse.move(p.x, p.y); await side.waitForTimeout(400);
        const b0 = await side.evaluate(() => { const b = document.getElementById('as-boble'); return b && !b.hidden ? b.textContent : '' });
        T.tjek(/Ikke målt endnu/.test(b0) && /kick/i.test(b0), 'musen over cirklen (rigtig bevægelse): boblen siger, at Kick ikke er målt endnu', b0);
        await klik(KICK); await side.waitForTimeout(1200);
        const a0 = await side.evaluate(() => { const p = document.getElementById('as-rude'), r = p && [...p.querySelectorAll('[data-asr]')].find(x => x.dataset.asr === 'kick'), fb = document.querySelector('#sg [data-sgf="sikker"]'); return { synlig: !!(p && p.offsetParent), fane: fb && fb.classList.contains('on') && fb.textContent, raekke: !!r, blink: !!(r && r.classList.contains('as-blink')), samlet: (document.getElementById('as-samlet') || {}).textContent, boble: !document.getElementById('as-boble').hidden, det: !!document.querySelector('#sg .sg-kort[data-kort="det"]') } });
        T.tjek(a0.synlig && a0.fane === 'Analyse sikkerhed' && a0.raekke && a0.blink && a0.samlet === '99' && !a0.boble && a0.det, 'et rigtigt klik på cirklen åbner Analyse → Analyse sikkerhed ved rækken Kick (rækken lyser op); Detektion findes stadig', JSON.stringify(a0));
        /* kør testen */
        const foer = await side.evaluate(() => { window.__as = { pat, gs, vol, mute, F, RAW, A, UDG, rnd: Math.random }; return { bpm, curGen, mode, sr, dur, eq: JSON.stringify(set.eq || null), status: document.getElementById('status').textContent } });
        const t0 = Date.now(); await klik('#as-rude [data-asx="koer"]');
        const midtvejs = await side.evaluate(() => ({ koerer: AS.koerer, knap: document.querySelector('#as-rude [data-asx="koer"]').disabled }));
        await side.waitForFunction(() => !AS.koerer && AS.data && AS.data.res && AS.data.res.kick, null, { timeout: 240000 }); await side.waitForTimeout(600); const sek = Math.round((Date.now() - t0) / 1000);
        const r = await side.evaluate(() => { const D = AS.data, R = D.res, F1 = o => { const d = 2 * o.hit + o.fa + o.ov; return d ? Math.round(200 * o.hit / d) : 0 }, g = window.__as;
          return { v: D.v, n: D.n, ms: D.ms, hist: D.hist.length, ls: (JSON.parse(localStorage.getItem('rytme-asik') || '{}').res || {}).kick ? 1 : 0,
            tal: Object.fromEntries(['kick', 'snare', 'hihat', 'ana:taktslag', 'ana:takt', 'ana:pitch', 'x:bastone', 'stem:bas:ana:pitch', 'stem:vokal:ana:pitch', 'ana:toneklasse', 'x:toner', 'stem:trommer:kick', 'stem:trommer:snare', 'stem:trommer:hihat'].map(k => [k, R[k] ? R[k].s : null])),
            sum: ['kick', 'snare', 'hihat', 'ana:taktslag', 'ana:takt', 'stem:trommer:kick'].every(k => R[k] && R[k].type === 'h' && R[k].hit + R[k].ov === R[k].n && R[k].s === F1(R[k]) && R[k].pm.length >= 5),
            kickN: R.kick.n, beatN: R['ana:taktslag'].n, taktN: R['ana:takt'].n, bedst: R.kick.bedst, kurve: R['ana:pitch'].type === 'k' && R['ana:pitch'].sek > 10 && R['ana:c0'] && R['ana:c11'] ? 1 : 0,
            mat: asFor('bas').s, ls31: asFor('ana:ls12').s, stemBas: asFor('stem:bas:bas').s, vokal: asFor('vokal').s, drop: asFor('hnd:drop').s, hndTakt: asFor('hnd:takt').s === R['ana:taktslag'].s,
            uroert: pat === g.pat && gs === g.gs && vol === g.vol && mute === g.mute && F === g.F && RAW === g.RAW && A === g.A && UDG === g.UDG && Math.random === g.rnd, nu: { bpm, curGen, mode, sr, dur, eq: JSON.stringify(set.eq || null) }, status: document.getElementById('status').textContent, prog: (document.getElementById('ana-prog') || { hidden: true }).hidden } });
        console.log('  målt på ' + sek + ' s (programmets egen tid: ' + (r.ms / 1000).toFixed(1) + ' s): ' + JSON.stringify(r.tal));
        T.tjek(midtvejs.koerer && midtvejs.knap, 'mens testen kører, er knappen låst', JSON.stringify(midtvejs));
        T.tjek(r.v === versionFraNavn(fil) && r.n === 6 && r.hist === 1 && r.ls === 1, `resultatet er gemt (rytme-asik) med versionsnummeret v${r.v}, 6 mønstre og én linje i historikken`, JSON.stringify(r));
        T.tjek(r.sum && r.kickN === 160 && r.beatN === 192 && r.taktN === 48 && Array.isArray(r.bedst), 'slagene hænger sammen: ramte + oversete = alle slag (Kick 160, Taktslag 192, Takt 48), sikkerheden er F-målet, og hvert lydtræk har tal pr. mønster og en bedste tærskel', JSON.stringify(r));
        T.tjek(Object.values(r.tal).every(v => Number.isInteger(v) && v >= 0 && v <= 100) && r.kurve === 1, 'alle målte lydtræk har et tal fra 0 til 100, også kurverne (Tonehøjde, Toneklasse, de 12 toner, Basens tone)', JSON.stringify(r.tal));
        T.tjek(r.tal['stem:vokal:ana:pitch'] > r.tal['ana:pitch'] && r.tal['stem:bas:ana:pitch'] > r.tal['x:bastone'], `en tone er lettere at finde alene end i hele lyden (Tonehøjde ${r.tal['stem:vokal:ana:pitch']} mod ${r.tal['ana:pitch']}, Basens tone ${r.tal['stem:bas:ana:pitch']} mod ${r.tal['x:bastone']})`, JSON.stringify(r.tal));
        T.tjek(r.mat === 99 && r.ls31 === 99 && r.stemBas === 99 && r.vokal === null && r.drop === null && r.hndTakt, 'ren matematik giver 99 (Bas, et smalt bånd, Bas · Bas); Vokal og Drop har intet tal; Hændelse · taktslag bruger tallet for taktslag fra filen', JSON.stringify(r));
        T.tjek(r.uroert && JSON.stringify(r.nu) === JSON.stringify({ bpm: foer.bpm, curGen: foer.curGen, mode: foer.mode, sr: foer.sr, dur: foer.dur, eq: foer.eq }) && r.prog, 'generatorens mønster og indstillinger, den indlæste analyse, EQ og Math.random er urørt efter testen; analysens fremgangsfelt er ikke fremme', JSON.stringify({ foer, nu: r.nu, uroert: r.uroert }));
        gemt = await side.evaluate(() => localStorage.getItem('rytme-asik'));
        /* tabellen */
        const t1 = await side.evaluate(() => { const p = document.getElementById('as-rude'), r = [...p.querySelectorAll('tr[data-asr]')].find(x => x.dataset.asr === 'kick'), td = [...r.children].map(x => x.textContent); return { td, samlet: document.getElementById('as-samlet').textContent, facit: p.querySelector('.as-facit').textContent, hist: p.querySelectorAll('.as-hist tbody tr').length, raekker: p.querySelectorAll('tr[data-asr]').length } });
        T.tjek(/kick/i.test(t1.td[0]) && /i brug/.test(t1.td[0]) && /^\d+ af 160$/.test(t1.td[2]) && /^\d+$/.test(t1.td[3]) && /^\d+$/.test(t1.td[4]) && /Generatoren/.test(t1.td[5]) && /6 mønstre · målt/.test(t1.facit) && t1.hist === 1 && /^\d+$/.test(t1.samlet), `tabellen: Kick har Rammer, Falske, Oversete og Målt på; øverst står samlet sikkerhed (${t1.samlet}) og facit; historikken har én linje`, JSON.stringify(t1));
        await klik('#as-rude tr[data-asr="kick"] td.as-nv');
        const t2 = await side.evaluate(() => { const d = document.querySelector('#as-rude tr.as-det'); return d ? d.textContent : '' });
        T.tjek(/Pr\. mønster/.test(t2) && /House 124 · kun trommer/.test(t2) && /Bedste tærskel/.test(t2), 'et rigtigt klik på rækken folder tallene pr. mønster og den bedste tærskel ud', t2.slice(0, 200));
        await klik('#as-rude [data-asx="usikre"]');
        const t3 = await side.evaluate(() => [...document.querySelectorAll('#as-rude tr[data-asr] .as-sk .as-c')].map(c => c.textContent));
        const tal3 = t3.filter(x => x !== '?').map(Number);
        T.tjek(tal3.length > 5 && tal3.every((v, i) => i === 0 || tal3[i - 1] <= v) && t3.indexOf('?') > tal3.length - 1, 'Sortér: usikre først (rigtigt klik): tallene står stigende, og dem uden tal står nederst', t3.join(' '));
        await klik('#as-rude [data-asx="brug"]');
        const t4 = await side.evaluate(() => ({ alle: [...document.querySelectorAll('#as-rude tr[data-asr]')].every(r => /i brug/.test(r.children[0].textContent)), n: document.querySelectorAll('#as-rude tr[data-asr]').length, brug: asIBrug().size }));
        T.tjek(t4.alle && t4.n === t4.brug && t4.n > 2, `Kun dem i brug (rigtigt klik): tabellen viser de ${t4.n} lydtræk, showet bruger`, JSON.stringify(t4));
        await klik('#as-rude [data-asx="brug"]'); await klik('#as-rude [data-asx="usikre"]');
        await side.screenshot({ path: path.join(UD, 'analyse-sikkerhed-fane.png') });
        /* 4 spor: for lang fil */
        const sp = await side.evaluate(async () => { const wav = sek => { const sr = 8000, n = sek * sr, b = new ArrayBuffer(44 + n), v = new DataView(b), s = (o, t) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0))); s(0, 'RIFF'); v.setUint32(4, 36 + n, true); s(8, 'WAVEfmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, sr, true); v.setUint32(28, sr, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true); s(36, 'data'); v.setUint32(40, n, true); new Uint8Array(b, 44).fill(128); return b };
          await stemSaetFil('trommer', new File([wav(16 * 60)], 'lang drums.wav', { type: 'audio/wav' })); const lang = { buf: !!STEM.buf.trommer, besked: (document.getElementById('stem-besked') || {}).textContent || '' };
          await stemSaetFil('trommer', new File([wav(3)], 'kort drums.wav', { type: 'audio/wav' })); const kort = { buf: !!STEM.buf.trommer, sek: STEM.buf.trommer ? Math.round(STEM.buf.trommer.duration) : 0 }; delete STEM.buf.trommer; delete STEM.fil.trommer; try { stemUI() } catch (e) { } return { lang, kort } });
        T.tjek(!sp.lang.buf && /16 minutter/.test(sp.lang.besked) && /15 minutter/.test(sp.lang.besked) && sp.kort.buf && sp.kort.sek === 3, '4 spor: en fil på 16 minutter læses ikke ind og giver en venlig besked; en kort fil læses ind som før', JSON.stringify(sp));
        await side.evaluate(() => { lay3Anvend('noder'); mxSaet(true) }); await side.waitForTimeout(2000);
      }
      /* matrixen med tal (alle tre størrelser) */
      const m1 = await side.evaluate(() => { const e = document.querySelector('#ne-mx th.mx-lt[data-b="kick"] .as-c'); return { t: e.textContent, kl: e.className, s: AS.data.res.kick.s } });
      const p1 = await midt(KICK); await side.mouse.move(p1.x, p1.y); await side.waitForTimeout(400);
      const b1 = await side.evaluate(() => { const b = document.getElementById('as-boble'), q = b.getBoundingClientRect(); return { t: b.hidden ? '' : b.textContent, inde: q.right <= innerWidth && q.bottom <= innerHeight && q.left >= 0 && q.top >= 0 } });
      T.tjek(m1.t === String(m1.s) && new RegExp('as-k-' + (m1.s >= 75 ? 'g' : m1.s >= 50 ? 'y' : 'r')).test(m1.kl) && new RegExp(m1.s + ' %').test(b1.t) && /Rammer \d+ af 160 · falske \d+ · oversete \d+/.test(b1.t) && /Målt på Generatoren/.test(b1.t) && b1.inde, `${w} × ${h}: cirklen ved Kick viser ${m1.t} i den rigtige farve, og boblen har Rammer, falske, oversete, Målt på og dato`, JSON.stringify({ m1, b1 }));
      await side.screenshot({ path: path.join(UD, 'analyse-sikkerhed-matrix-' + w + '.png'), clip: { x: 0, y: 40, width: Math.min(w, 1500), height: Math.min(h - 40, 700) } });
      await side.mouse.move(5, 5); await klik(KICK); await side.waitForTimeout(1200);
      const lay = await side.evaluate(() => { const p = document.getElementById('as-rude'), q = p.getBoundingClientRect(), t = p.querySelector('.as-tab').getBoundingClientRect(), k = p.querySelector('[data-asx="koer"]').getBoundingClientRect(); return { synlig: !!p.offsetParent, bred: p.scrollWidth <= p.clientWidth + 1, tab: t.right <= q.right + 1, knap: k.right <= q.right + 1 && k.width > 40, w: Math.round(q.width) } });
      T.tjek(lay.synlig && lay.bred && lay.tab && lay.knap, `${w} × ${h}: fanen Analyse sikkerhed (${lay.w} px bred) har ingen vandret rulning; tabellen og ▶ Kør testen er inden for vinduet`, JSON.stringify(lay));
      if (w === 3840) await side.screenshot({ path: path.join(UD, 'analyse-sikkerhed-fane-3840.png') });
      T.tjek(fejl.length === 0, `${w} × ${h}: ingen fejl i konsollen`, fejl.slice(0, 5).join('\n'));
      await ctx.close();
    }
  } finally { await browser.close() }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
