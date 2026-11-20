/* Trin 4 · Det nye i v9.126 (A4, første del): Lydtidslinjen. Ved 1920 × 1080 med testlyden (30 s, 120 BPM, kick på hvert slag):
   Lyd over tid har rækken Hændelser (Kick, Snare, Hihat, Takt 1) med sikkerhed pr. hændelse; kick rammer de rigtige slag; et rigtigt klik på en streg vælger
   den, og Slet (rigtigt klik) sletter den; → flytter 10 ms; træk med musen flytter uden at hoppe i sangen; dobbeltklik i en tom bane tilføjer; Fortryd
   rettelse og Nulstil rettelser (med spørgsmål); rettelserne ligger under rytme-tl| og kommer med i Gem hele arbejdet; Gem tidslinje giver en JSON-fil i formatet
   lydtidslinje; Hent tidslinje henter rettelserne til den samme sang og afviser en anden sang; Hør analysen planlægger klik, mens sangen spiller; ingen konsolfejl. */
const fs = require('fs'), os = require('os'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
const lavTestlyd = require('./testlyd');
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Lydtidslinjen'), UD = path.join(__dirname, 'ud'); fs.mkdirSync(UD, { recursive: true });
  console.log('107 · Lydtidslinjen (A4, første del) · ' + path.basename(fil));
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-tl-')), wav = lavTestlyd(path.join(tmp, 'testlyd-120bpm.wav')), bytes = fs.statSync(wav).size;
  const browser = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] }); const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 }, acceptDownloads: true }); const side = await ctx.newPage(); const fejl = [];
  side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', m => { if (m.type() === 'error') fejl.push('konsol: ' + m.text().slice(0, 200)) });
  const klik = async sel => { const p = await side.evaluate(sel => { const b = document.querySelector(sel); if (!b) return null; b.scrollIntoView({ block: 'center' }); const q = b.getBoundingClientRect(); return { x: q.x + q.width / 2, y: q.y + q.height / 2 } }, sel); if (!p) throw new Error('findes ikke: ' + sel); await side.mouse.click(p.x, p.y); await side.waitForTimeout(500) };
  const streg = (spor, nr) => side.evaluate(([spor, nr]) => { const c = document.getElementById('lot'); c.scrollIntoView({ block: 'center' }); const L = tlHaend().filter(e => e.spor === spor), e = L[nr], r = c.getBoundingClientRect(), ry = tlRaekkeY(), j = TL.SPOR.findIndex(q => q[0] === spor); return { x: r.left + tlX(e.t, c.width) * r.width / c.width, y: r.top + (ry.y + 3 + j * TL.BH + TL.BH / 2) * r.height / c.height, t: e.t, n: L.length } }, [spor, nr]);
  const ret = () => side.evaluate(() => tlRet());
  try {
    await side.goto('file://' + fil); await side.waitForTimeout(4500); await side.evaluate(async () => { await asKoer() });
    await side.setInputFiles('#file', wav); await side.waitForFunction(() => F && A && SHOWPROFIL && SHOWPROFIL.faseInfo && !document.getElementById('play').disabled, null, { timeout: 180000 }); await side.waitForTimeout(800);
    await side.evaluate(async () => { lay3Anvend('ao-sang'); dkVis('w35'); sgFane('avanceret'); await new Promise(r => setTimeout(r, 900)); document.getElementById('lot').scrollIntoView({ block: 'center' }); LOT.offSig = ''; lotTegn() }); await side.waitForTimeout(500);
    const h0 = await side.evaluate(() => { const L = tlHaend(), n = s => L.filter(e => e.spor === s).length, kick = L.filter(e => e.spor === 'kick'); let ramt = 0; kick.forEach(e => { const b = Math.round(e.t / .5) * .5; if (Math.abs(e.t - b) <= .05) ramt++ });
      return { rk: lotRaekker().map(r => r.id), slaa: lotIndst().rk.haend, kick: n('kick'), hihat: n('hihat'), takt1: n('takt1'), ramt, sik: L.every(e => e.sikkerhed == null || (e.sikkerhed >= 0 && e.sikkerhed <= 1)), kickSik: kick.slice(0, 3).map(e => e.sikkerhed), kilde: kick[0] && kick[0].kilde } });
    T.tjek(h0.rk.includes('haend') && h0.slaa === true && h0.kick >= 50 && h0.ramt >= .9 * h0.kick && h0.takt1 >= 12 && h0.sik && h0.kickSik.every(x => x > .5), `Lyd over tid har rækken Hændelser: ${h0.kick} kick (${h0.ramt} på de rigtige slag), ${h0.hihat} hihat, ${h0.takt1} takt 1; sikkerhed pr. hændelse (kick ${h0.kickSik.join(', ')})`, JSON.stringify(h0));
    await side.screenshot({ path: path.join(UD, 'lydtidslinjen.png') });
    /* vælg med et rigtigt klik og slet med et rigtigt klik på Slet */
    const off0 = await side.evaluate(() => offset), s1 = await streg('kick', 10); await side.mouse.click(s1.x, s1.y); await side.waitForTimeout(500);
    const v1 = await side.evaluate(() => ({ valgt: TL.valgt, bar: (document.querySelector('.tl-bar .tl-valgt') || {}).textContent || '', off: offset }));
    T.tjek(v1.valgt && v1.valgt.spor === 'kick' && Math.abs(v1.valgt.t - s1.t) < .001 && /Valgt: Kick ved/.test(v1.bar) && v1.off === off0, `et rigtigt klik på en streg vælger den ("${v1.bar.slice(0, 60)}") og hopper ikke i sangen`, JSON.stringify(v1));
    await klik('.tl-bar [data-tl="slet"]'); const r1 = await ret(), n1 = await side.evaluate(() => tlHaend().filter(e => e.spor === 'kick').length);
    T.tjek(r1.slet.length === 1 && Math.abs(r1.slet[0].t - s1.t) < .001 && n1 === s1.n - 1, `Slet (rigtigt klik): kick ved ${s1.t} s er væk (${s1.n} → ${n1}) og står i dine rettelser`, JSON.stringify(r1));
    /* → flytter 10 ms */
    const s2 = await streg('kick', 20); await side.mouse.click(s2.x, s2.y); await side.waitForTimeout(300); await side.keyboard.press('ArrowRight'); await side.waitForTimeout(400);
    const r2 = await ret(); T.tjek(r2.flyt.length === 1 && Math.abs(r2.flyt[0].til - (s2.t + .01)) < .0015, `→ flytter den valgte 10 ms (${s2.t} → ${r2.flyt[0] && r2.flyt[0].til})`, JSON.stringify(r2.flyt));
    /* træk med musen */
    const s3 = await streg('kick', 30), off1 = await side.evaluate(() => offset); await side.mouse.move(s3.x, s3.y); await side.mouse.down(); await side.mouse.move(s3.x + 15, s3.y, { steps: 5 }); await side.mouse.move(s3.x + 30, s3.y, { steps: 5 }); await side.mouse.up(); await side.waitForTimeout(500);
    const r3 = await ret(), d3 = await side.evaluate(([x0]) => { const c = document.getElementById('lot'), r = c.getBoundingClientRect(), V = tlVis(); return 30 / r.width * (V.b - V.a) }, [s3.x]), off2 = await side.evaluate(() => offset), f3 = r3.flyt.find(f => Math.abs(f.fra - s3.t) < .001);
    T.tjek(f3 && Math.abs(f3.til - s3.t - d3) < .03 && off2 === off1, `træk med musen flytter kicket ${(d3 * 1000).toFixed(0)} ms (${s3.t} → ${f3 && f3.til}) uden at hoppe i sangen`, JSON.stringify({ f3, d3, off1, off2 }));
    /* dobbeltklik i en tom bane tilføjer */
    const tom = await side.evaluate(() => { const c = document.getElementById('lot'), r = c.getBoundingClientRect(), ry = tlRaekkeY(), j = TL.SPOR.findIndex(q => q[0] === 'snare'), L = tlHaend().filter(e => e.spor === 'snare'); let t = 12.25; while (L.some(e => Math.abs(e.t - t) < .3)) t += .37; return { x: r.left + tlX(t, c.width) * r.width / c.width, y: r.top + (ry.y + 3 + j * TL.BH + TL.BH / 2) * r.height / c.height, t } });
    await side.mouse.dblclick(tom.x, tom.y); await side.waitForTimeout(500); const r4 = await ret();
    T.tjek(r4.ny.length === 1 && r4.ny[0].spor === 'snare' && Math.abs(r4.ny[0].t - tom.t) < .05, `dobbeltklik i en tom bane tilføjer en snare ved ${r4.ny[0] && r4.ny[0].t} s`, JSON.stringify(r4.ny));
    /* rettelserne ligger under rytme-tl| og kommer med i Gem hele arbejdet */
    const k = await side.evaluate(() => ({ k: tlNoegle(), alle: altNoegler().filter(x => x.startsWith('rytme-tl|')) }));
    T.tjek(k.k === 'rytme-tl|testlyd-120bpm.wav|' + bytes && k.alle.includes(k.k), `rettelserne gemmes pr. sang (${k.k}) og kommer med i Gem hele arbejdet`, JSON.stringify(k));
    /* Fortryd rettelse */
    await klik('.tl-bar [data-tl="fortryd"]'); const r5 = await ret(); T.tjek(r5.ny.length === 0 && r5.flyt.length === r4.flyt.length && r5.slet.length === 1, 'Fortryd rettelse (rigtigt klik) fjerner den sidste rettelse (den nye snare)', JSON.stringify(r5));
    /* Gem tidslinje */
    const [dl] = await Promise.all([side.waitForEvent('download', { timeout: 15000 }), klik('.tl-bar [data-tl="gem"]')]); const jf = path.join(tmp, 'tl.json'); await dl.saveAs(jf); const J = JSON.parse(fs.readFileSync(jf, 'utf8'));
    const hs = J.haendelser.filter(e => e.spor === 'kick');
    T.tjek(J.format === 'lydtidslinje' && J.version === 1 && J.sang.navn === 'testlyd-120bpm.wav' && J.sang.bytes === bytes && Math.abs(J.sang.laengde - 30) < .2 && hs.length === h0.kick - 1 && hs.every(e => 'sikkerhed' in e && 'kilde' in e && 'slut' in e && 'tone' in e && 'ord' in e) && J.kurver.hz === 10 && J.kurver.rms.length > 250 && Array.isArray(J.afsnit) && J.rettelser.slet.length === 1 && /\.lydtidslinje\.json$/.test(dl.suggestedFilename()),
      `Gem tidslinje: ${dl.suggestedFilename()} med ${J.haendelser.length} hændelser (kick ${hs.length}), ${J.afsnit.length} afsnit, kurver (10 pr. s) og rettelserne`, JSON.stringify({ f: J.format, s: J.sang, n: J.haendelser.length }));
    /* Nulstil rettelser (spørger) */
    await klik('.tl-bar [data-tl="nulstil"]'); const sp = await side.evaluate(() => document.getElementById('bd-t').textContent); await klik('#bd-ok'); const r6 = await ret();
    T.tjek(/Nulstil dine rettelser/.test(sp) && r6.slet.length + r6.flyt.length + r6.ny.length === 0, 'Nulstil rettelser spørger først og sletter så alle rettelser for sangen', JSON.stringify({ sp, r6 }));
    /* Hent tidslinje: samme sang og en anden sang */
    J.rettelser = { slet: [{ spor: 'kick', t: hs[5].t }, { spor: 'kick', t: hs[6].t }], flyt: [], ny: [] }; const j2 = path.join(tmp, 'tl2.json'); fs.writeFileSync(j2, JSON.stringify(J));
    await klik('.tl-bar [data-tl="hent"]'); await side.setInputFiles('#tl-fil', j2); await side.waitForTimeout(500); const sp2 = await side.evaluate(() => document.getElementById('bd-t').textContent); await klik('#bd-ok'); const r7 = await ret();
    J.sang.bytes = bytes + 1; const j3 = path.join(tmp, 'tl3.json'); fs.writeFileSync(j3, JSON.stringify(J)); await klik('.tl-bar [data-tl="hent"]'); await side.setInputFiles('#tl-fil', j3); await side.waitForTimeout(500); const st = await side.evaluate(() => document.getElementById('status').textContent), r8 = await ret();
    T.tjek(/Hent rettelserne/.test(sp2) && r7.slet.length === 2 && /hører til en anden sang/.test(st) && r8.slet.length === 2, 'Hent tidslinje henter rettelserne til den samme sang (efter et spørgsmål) og afviser en fil til en anden sang', JSON.stringify({ sp2, r7: r7.slet.length, st: st.slice(0, 80) }));
    /* Hør analysen */
    await klik('.tl-bar [data-tl="hoer"]'); await klik('#play'); await side.waitForTimeout(1600); const ho = await side.evaluate(() => ({ hoer: TL.hoer, n: TL.sched.size, spiller: playing, ctx: actx && actx.state })); await klik('#play');
    T.tjek(ho.hoer && ho.spiller && ho.n >= 3, `Hør analysen (rigtigt klik): mens sangen spiller, planlægges klik på hændelserne (${ho.n} på 1,6 s; lyden ${ho.ctx})`, JSON.stringify(ho));
    T.tjek(fejl.length === 0, 'ingen fejl i konsollen', fejl.slice(0, 5).join('\n'));
  } finally { await browser.close(); try { fs.rmSync(tmp, { recursive: true, force: true }) } catch (e) { } }
  return T.slut();
}
module.exports = kør;
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
