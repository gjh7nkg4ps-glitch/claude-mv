/* Trin 1 · Syntaks: node --check på hvert <script> i rytme-studio.html.
   Brug: node rytme-studio/tests/1-syntaks.js */
const fs = require('fs'), path = require('path'), os = require('os'), { execFileSync } = require('child_process');
module.exports = function syntaks(fil) {
  const html = fs.readFileSync(fil, 'utf8');
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/g;
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'rs-syntaks-'));
  let m, antal = 0, fejl = 0;
  while ((m = re.exec(html))) {
    antal++;
    const navn = (m[1].match(/data-modul="([^"]+)"/) || [])[1] || 'script' + antal;
    const f = path.join(tmp, navn + '.js');
    fs.writeFileSync(f, m[2]);
    try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
    catch (e) { fejl++; console.log('  ❌ ' + navn + ':\n' + String(e.stderr)); }
  }
  fs.rmSync(tmp, { recursive: true, force: true });
  const ok = antal > 0 && fejl === 0;
  console.log((ok ? '✅' : '❌') + ' 1 · Syntaks: ' + antal + ' moduler, ' + fejl + ' med fejl');
  return ok;
};
if (require.main === module) process.exit(module.exports(path.join(__dirname, '..', 'rytme-studio.html')) ? 0 : 1);
