/* Trin 1 · Syntaks: kør `node --check` på hvert <script> i filen.
   Et opstartstjek alene fanger ikke syntaksfejl i kode, der kun køres senere. */
const fs = require('fs'), os = require('os'), path = require('path'), { execFileSync } = require('child_process');
const { findFil, scripts, tæller } = require('./faelles');

function kør(arg) {
  const fil = findFil(arg), T = tæller('Syntaks');
  console.log('1 · Syntaks · ' + path.basename(fil));
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'mv-syntaks-'));
  scripts(fs.readFileSync(fil, 'utf8')).forEach((s, i) => {
    if (/type\s*=\s*["'](?!text\/javascript|module)/.test(s.attr)) return; // fx JSON eller shader-tekst
    const f = path.join(dir, `script${i + 1}.js`); fs.writeFileSync(f, s.kode);
    try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); T.ok(`script ${i + 1} (linje ${s.linje}, ${Math.round(s.kode.length / 1024)} KB)`); }
    catch (e) { T.fejl(`script ${i + 1} (linje ${s.linje}): ` + String(e.stderr).split('\n').slice(0, 5).join(' | ')); }
  });
  fs.rmSync(dir, { recursive: true, force: true });
  return T.slut();
}
if (require.main === module) process.exit(kør(process.argv[2]) ? 0 : 1);
module.exports = kør;
