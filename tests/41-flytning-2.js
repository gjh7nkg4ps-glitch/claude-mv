/* Trin 4 · Det nye i v9.46: Editorens steder er flyttet til den fælles indgang (fase 1, trin 3, anden bid).
   Elleve handlinger i Editoren laver eller sletter nu regler gennem Regler: kobl en egenskab (bindProp), Auto-kobl, Tilføj morgenstjerne,
   Levende fra, kobl Fødsel, Nulstil figur, fjern lagets koblinger, skift form, kopiér figur, slet figur og kopiér lag.
   Testen lytter på Regler og ser, at hver handling giver beskeden slet eller samlet (et gammelt sted giver "andet"), at alle regler har hvert sit id,
   og at Fortryd stadig virker. Den tæller også, hvor mange steder uden for indgangen der stadig skriver direkte i maps. */
const fs = require('fs'), path = require('path');
const { chromium } = require('playwright');
const { findFil, tæller } = require('./faelles');
function direkte(fil) { const html = fs.readFileSync(fil, 'utf8'); let k = html.slice(html.indexOf('id="rytme-runtime"'), html.indexOf('<script type="text/plain" id="three-ny-core">'));
  const a = k.indexOf('/* ========== FÆLLES INDGANG TIL REGLERNE'), b = k.indexOf('/* ========== SLUT: FÆLLES INDGANG TIL REGLERNE'); if (a > 0 && b > a) k = k.slice(0, a) + k.slice(b);
  return [/(?<![\w$.])maps\s*=(?!=)/g, /(?<![\w$.])maps\.push\(/g, /(?<![\w$.])maps\.splice\(/g, /(?<![\w$.])maps\.length\s*=(?!=)/g].reduce((s, p) => s + (k.match(p) || []).length, 0); }
async function kør(arg) {
  const fil = findFil(arg), T = tæller('Flytning 2');
  console.log('41 · Flytning til den fælles indgang, anden bid (Editoren) · ' + path.basename(fil));
  const n = direkte(fil);
  T.tjek(n <= 44, `${n} steder uden for den fælles indgang skriver stadig direkte i regel-listen (56 i v9.45; højst 44 nu)`);
  const browser = await chromium.launch();
  try {
    const side = await browser.newPage({ viewport: { width: 1600, height: 1000 } }); const fejl = [];
    side.on('pageerror', e => fejl.push('pageerror: ' + e.message)); side.on('console', x => { if (x.type() === 'error') fejl.push('konsol: ' + x.text()); });
    await side.goto('file://' + fil); await side.waitForTimeout(3500);
    const r = await side.evaluate(async () => { brugFor('fuld2', true); await new Promise(r => setTimeout(r, 2000)); const H = []; Regler.lyt(b => H.push(b.hvad)); const ud = {}, vent = ms => new Promise(r => setTimeout(r, ms));
      const fctl = document.getElementById('fctl');
      const falsk = (tag, id, ev, saet) => { const b = document.createElement(tag); b.id = id; if (saet) saet(b); fctl.appendChild(b); b.dispatchEvent(new Event(ev, { bubbles: true })); b.remove() };
      /* ventet: en liste over tilladte besked-rækker; dn: ændring i antal regler (null = lige meget, 'plus' = flere, 'minus' = færre) */
      const prøv = async (navn, fn, ventet, dn) => { H.length = 0; const n0 = maps.length; try { await fn() } catch (e) { ud[navn] = 'fejl: ' + e.message; return } await vent(700); const d = maps.length - n0, ens = new Set(maps.map(m => m.id)).size === maps.length && maps.every(m => m.id);
        const dOk = dn === null || (dn === 'plus' ? d > 0 : dn === 'minus' ? d < 0 : d === dn); ud[navn] = (ventet.includes(H.join()) && dOk && ens) ? 'ok' : 'beskeder: ' + H.join() + ' · ændring: ' + d + ' · id: ' + ens };
      /* en figur med regler vælges */
      const medRegler = () => fase2.objekter.findIndex(o => maps.some(m => m.effect.startsWith('obj:' + o.id + ':')));
      selO = Math.max(0, medRegler()); selL = 0; formUI(); await vent(300);
      const o = fase2.objekter[selO], p = uiProps(o.lag[0].form).find(p => !maps.some(m => m.effect === tidOf(o, 0, p)));
      await prøv('Kobl en egenskab', () => bindProp(o, 0, p, 'kick'), ['samlet'], 1);
      await prøv('Kobl til et andet lydtræk', () => bindProp(o, 0, p, 'snare'), ['samlet'], 0);
      await prøv('Fjern koblingen', () => bindProp(o, 0, p, ''), ['samlet'], -1);
      await prøv('Auto-kobl', () => { Regler.sletHvor(m => m.effect.startsWith('obj:' + o.id + ':0:')); H.length = 0; autoKobl() }, ['samlet'], null);
      await prøv('Tilføj morgenstjerne', () => { Regler.sletHvor(m => m.effect.startsWith('obj:ms:')); H.length = 0; addMorgenstjerne() }, ['samlet'], null);
      ud['Morgenstjernen har 6 regler'] = maps.filter(m => m.effect.startsWith('obj:ms:0:')).length === 6 ? 'ok' : 'antal ' + maps.filter(m => m.effect.startsWith('obj:ms:0:')).length;
      /* Levende: til, kobl Fødsel, fra */
      selO = Math.max(0, medRegler()); selL = 0; formUI(); const o2 = fase2.objekter[selO];
      falsk('input', 'fliv', 'change', b => { b.type = 'checkbox'; b.checked = true }); await vent(300);
      await prøv('Kobl Fødsel', () => { let s = document.getElementById('flivband'), egen = false; if (!s) { s = document.createElement('select'); s.id = 'flivband'; s.innerHTML = '<option value="kick">kick</option>'; document.body.appendChild(s); egen = true } falsk('button', 'flivkobl', 'click'); if (egen) s.remove() }, ['samlet'], 1);
      ud['Fødsel har spærretid 150'] = (maps.find(m => m.effect === 'liv:' + o2.id) || {}).gap === 150 ? 'ok' : 'mangler';
      await prøv('Levende fra', () => falsk('input', 'fliv', 'change', b => { b.type = 'checkbox'; b.checked = false }), ['slet'], -1);
      /* kopiér figur, kopiér lag, fjern lagets koblinger, nulstil og slet figur */
      selO = Math.max(0, medRegler()); selL = 0; const nO = fase2.objekter.length, nR = maps.filter(m => m.effect.startsWith('obj:' + fase2.objekter[selO].id + ':')).length;
      await prøv('Kopiér figur', () => opDup(), ['samlet'], nR);
      ud['Kopien er en ny figur'] = fase2.objekter.length === nO + 1 ? 'ok' : 'figurer: ' + fase2.objekter.length;
      const k = fase2.objekter[selO], nL = maps.filter(m => m.effect.startsWith('obj:' + k.id + ':0:')).length;
      selL = 0; await prøv('Kopiér lag', () => lagDup(), ['samlet'], nL);
      ud['Lagets kopi har de samme regler'] = maps.filter(m => m.effect.startsWith('obj:' + k.id + ':1:')).length === nL ? 'ok' : 'antal ' + maps.filter(m => m.effect.startsWith('obj:' + k.id + ':1:')).length;
      selL = 1; formUI(); await prøv('Fjern lagets koblinger', () => falsk('button', 'fclr', 'click'), ['slet'], -nL);
      selL = 0; formUI(); await prøv('Skift form', () => falsk('select', 'fform', 'change', b => { const andre = Object.keys(FORMER).filter(f => f !== k.lag[0].form); b.innerHTML = andre.map(f => '<option value="' + f + '">' + f + '</option>').join(''); b.value = andre[0] }), ['slet', ''], null);
      ud['Ingen regler til egenskaber, formen ikke har'] = maps.filter(m => m.effect.startsWith('obj:' + k.id + ':0:')).every(m => propsFor(k.lag[0].form).includes(m.effect.split(':')[3])) ? 'ok' : 'rester';
      selL = 0; bindProp(k, 0, uiProps(k.lag[0].form)[0], 'kick'); await vent(400);
      await prøv('Nulstil figur', () => falsk('button', 'fnul', 'click'), ['slet'], 'minus');
      bindProp(fase2.objekter[selO], 0, uiProps(fase2.objekter[selO].lag[0].form)[0], 'kick'); await vent(400);
      await prøv('Slet figur', () => opSlet(), ['slet'], -1);
      ud['Figuren er væk'] = fase2.objekter.length === nO ? 'ok' : 'figurer: ' + fase2.objekter.length;
      /* Fortryd efter en kobling lavet gennem indgangen */
      await vent(1500); selO = Math.max(0, medRegler()); selL = 0; const o3 = fase2.objekter[selO], p3 = uiProps(o3.lag[0].form).find(p => !maps.some(m => m.effect === tidOf(o3, 0, p))), n1 = maps.length;
      bindProp(o3, 0, p3, 'kick'); await vent(1700); feFortryd(); await vent(300); ud.fortryd = maps.length === n1 ? 'ok' : 'længde ' + maps.length + ' mod ' + n1;
      return ud; });
    const dårlig = Object.entries(r).filter(([k, v]) => v !== 'ok');
    T.tjek(!dårlig.length, `${Object.keys(r).length} tjek: Editorens handlinger går gennem den fælles indgang, giver den rigtige besked og et id, og Fortryd virker (${Object.keys(r).join('; ')})`, dårlig.map(([k, v]) => k + ' → ' + v).join(' | '));
    T.tjek(!fejl.length, 'ingen fejl i browseren', fejl.slice(0, 3).join(' | '));
  } catch (e) { T.fejl('testen stoppede: ' + e.message.split('\n')[0]); } finally { await browser.close(); }
  return T.slut();
}
if (require.main === module) kør(process.argv[2]).then(ok => process.exit(ok ? 0 : 1));
module.exports = kør;
