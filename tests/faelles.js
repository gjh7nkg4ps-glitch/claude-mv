/* Fælles hjælp til testene: find programfilen og læs dens <script>-dele. */
const fs = require('fs'), path = require('path');
const ROD = path.resolve(__dirname, '..');

/* Programfilen: den, der er givet på kommandolinjen, ellers den nyeste claude-mv-v*.html i repoets rod.
   Navnet skrives altid ud, så vi ikke tester en gammel fil uden at opdage det. */
function findFil(arg) {
  if (arg) return path.resolve(arg);
  const filer = fs.readdirSync(ROD).filter(f => /^claude-mv-v\d+_\d+\.html$/.test(f));
  if (!filer.length) throw new Error('Ingen claude-mv-v*.html i ' + ROD);
  const nr = f => f.match(/v(\d+)_(\d+)/).slice(1).map(Number);
  filer.sort((a, b) => { const [a1, a2] = nr(a), [b1, b2] = nr(b); return a1 - b1 || a2 - b2; });
  return path.join(ROD, filer[filer.length - 1]);
}

/* Versionen fra filnavnet, fx claude-mv-v9_7.html -> "9.7" */
function versionFraNavn(fil) { const m = path.basename(fil).match(/v(\d+)_(\d+)/); return m ? m[1] + '.' + m[2] : null; }

/* Alle <script>-dele med deres startlinje (1-talt). */
function scripts(tekst) {
  const ud = [], re = /<script([^>]*)>([\s\S]*?)<\/script>/g; let m;
  while ((m = re.exec(tekst))) {
    const linje = tekst.slice(0, m.index).split('\n').length;
    ud.push({ attr: m[1], kode: m[2], linje });
  }
  return ud;
}

/* Udskrift: ✅ eller ❌ og en tæller, så hver test kan sige, om alt gik godt. */
function tæller(navn) {
  let ok = 0, fejl = 0;
  return {
    ok(t) { ok++; console.log('  ✅ ' + t); },
    fejl(t) { fejl++; console.log('  ❌ ' + t); },
    tjek(betingelse, t, ekstra) { betingelse ? this.ok(t) : this.fejl(t + (ekstra ? ': ' + ekstra : '')); },
    slut() { console.log(`  ${navn}: ${ok} ok, ${fejl} fejl\n`); return fejl === 0; },
  };
}

module.exports = { ROD, findFil, versionFraNavn, scripts, tæller };
