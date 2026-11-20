/* Trin 1 · Kilderne og den byggede fil passer sammen (T0, 20. november 2026): node src/byg.js bygger filen af src/dele/ i rækkefølgen fra src/dele.txt;
   testen bygger i hukommelsen og tjekker, at resultatet er præcis den fil, der testes (byte for byte), at hver del findes, og at ingen del står to gange. Ingen browser. */
const path = require('path'), { execFileSync } = require('child_process'), fs = require('fs');
const { findFil, tæller, ROD } = require('./faelles');
function kør(arg) {
  const fil = findFil(arg), T = tæller('Byg fra kilderne');
  console.log('102 · Byg fra kilderne (T0) · ' + path.basename(fil));
  const dele = fs.readFileSync(path.join(ROD, 'src', 'dele.txt'), 'utf8').split('\n').filter(l => l.trim() && !l.startsWith('#'));
  T.tjek(dele.length > 100 && new Set(dele).size === dele.length && dele.every(d => fs.existsSync(path.join(ROD, 'src', 'dele', d))), `src/dele.txt har ${dele.length} dele; alle findes, ingen står to gange`, '');
  let ud = '', ok = true; try { ud = execFileSync('node', [path.join(ROD, 'src', 'byg.js'), '--tjek', fil]).toString() } catch (e) { ok = false; ud = String(e.stdout || e.message) }
  T.tjek(ok && /^ENS/.test(ud), 'kilderne bygger præcis den testede fil, byte for byte: ' + ud.trim().slice(0, 160), ud);
  const ga = fs.existsSync(path.join(ROD, '.gitattributes')) && /src\/\*\* -text/.test(fs.readFileSync(path.join(ROD, '.gitattributes'), 'utf8'));
  T.tjek(ga, '.gitattributes forhindrer, at git ændrer linjeskift i kilderne', '');
  return T.slut();
}
module.exports = kør;
if (require.main === module) process.exit(kør(process.argv[2]) ? 0 : 1);
