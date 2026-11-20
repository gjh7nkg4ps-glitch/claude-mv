/* Bygger Claude MV-filen af kildefilerne i src/ (T0, 20. november 2026).
   Delene står i src/dele.txt i den rækkefølge, de sættes sammen; stierne er under src/dele/. Intet ændres: filerne lægges efter hinanden, byte for byte.
   Brug:
     node src/byg.js                 bygger claude-mv-vX_Y.html i repoets rod (versionen læses fra <title> i delene)
     node src/byg.js --til <fil>     bygger til en bestemt fil
     node src/byg.js --tjek <fil>    bygger i hukommelsen og siger, om resultatet er præcis det samme som <fil> (byte for byte)
   Ingen andre værktøjer eller internet er nødvendige; kun Node. */
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const SRC = __dirname, ROD = path.join(SRC, '..');
function byg() {
  const dele = fs.readFileSync(path.join(SRC, 'dele.txt'), 'utf8').split('\n').map(l => l.replace(/\r$/, '')).filter(l => l.trim() && !l.startsWith('#'));
  const mangler = dele.filter(d => !fs.existsSync(path.join(SRC, 'dele', d)));
  if (mangler.length) throw new Error('Disse dele findes ikke: ' + mangler.join(', '));
  return { dele, buf: Buffer.concat(dele.map(d => fs.readFileSync(path.join(SRC, 'dele', d)))) };
}
const sha = b => crypto.createHash('sha256').update(b).digest('hex').slice(0, 16);
const a = process.argv.slice(2), { dele, buf } = byg();
if (a[0] === '--tjek') {
  const f = path.resolve(a[1]), gl = fs.readFileSync(f), ens = Buffer.compare(gl, buf) === 0;
  console.log((ens ? 'ENS' : 'FORSKELLIG') + ': bygget ' + buf.length + ' bytes (' + sha(buf) + ') · ' + path.basename(f) + ' ' + gl.length + ' bytes (' + sha(gl) + ') · ' + dele.length + ' dele');
  if (!ens) { let i = 0; while (i < buf.length && buf[i] === gl[i]) i++; console.log('Første forskel ved byte ' + i + ': …' + JSON.stringify(buf.slice(Math.max(0, i - 40), i + 40).toString('utf8')) + '…'); }
  process.exit(ens ? 0 : 1);
}
const m = buf.toString('utf8', 0, 300000).match(/<title>Claude MV v(\d+)\.(\d+)/);
const ud = a[0] === '--til' ? path.resolve(a[1]) : path.join(ROD, 'claude-mv-v' + (m ? m[1] + '_' + m[2] : 'ukendt') + '.html');
fs.writeFileSync(ud, buf);
console.log('Bygget: ' + path.relative(ROD, ud) + ' · ' + buf.length + ' bytes (' + sha(buf) + ') · ' + dele.length + ' dele');
