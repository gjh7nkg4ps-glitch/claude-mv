/* Trin 2 · Indhold: tjek uden browser, at filen hænger sammen.
   - Versionen er den samme i filnavnet, i <title>, i versionsmærket og i manualens "Nyt i v…" og afsnit man-vXY.
   - Indholdsfortegnelsen øverst i hovedscriptet passer med blokkenes markeringer (/* ========== NAVN ========== *\/).
   - Ingen henvisning til PLAN_FASE2.md i koden eller manualen. */
const fs = require('fs'), path = require('path');
const { findFil, versionFraNavn, scripts, tæller } = require('./faelles');

/* Blokkenes navne i den rækkefølge, de står (startmarkeringer; SLUT-markeringer tælles ikke). */
function blokke(kode) {
  const navne = [];
  for (const l of kode.split('\n')) {
    const m = l.match(/^\s*\/\*\s*={4,}\s*(.*?)\s*(={4,}.*)?$/);
    if (m && m[1] && !m[1].startsWith('SLUT')) navne.push(m[1].replace(/[\s*/]+$/, ''));
  }
  return navne;
}

function kør(arg) {
  const fil = findFil(arg), t = fs.readFileSync(fil, 'utf8'), T = tæller('Indhold');
  console.log('2 · Indhold · ' + path.basename(fil));
  const v = versionFraNavn(fil), vk = v.replace('.', '');
  T.tjek(t.includes(`<title>Claude MV v${v} (Rytme-editor)</title>`), `<title> siger v${v}`);
  T.tjek(t.includes(`hver gang filen samles til udgivelse.">v${v}</small>`), `versionsmærket siger v${v}`);
  T.tjek(t.includes(`<b>Nyt i v${v}:</b>`), `manualen: "Nyt i v${v}"`);
  T.tjek(t.includes(`<h3 id="man-v${vk}">`), `manualen: afsnit man-v${vk}`);

  const hoved = scripts(t).find(s => s.kode.includes('INDHOLDSFORTEGNELSE'));
  if (!hoved) { T.fejl('hovedscriptet med indholdsfortegnelsen findes ikke'); return T.slut(); }
  const m = hoved.kode.match(/Blokke i dette script \((\d+)\), i den rækkefølge de står:\n((?: +\d+\. .*\n)+)/);
  if (!m) { T.fejl('listen i indholdsfortegnelsen findes ikke'); return T.slut(); }
  const liste = m[2].trimEnd().split('\n').map(l => l.replace(/^ +\d+\. /, ''));
  const ægte = blokke(hoved.kode);
  T.tjek(+m[1] === liste.length, `tallet i overskriften (${m[1]}) passer med listen (${liste.length})`);
  const forskel = [];
  for (let i = 0; i < Math.max(liste.length, ægte.length); i++) if (liste[i] !== ægte[i]) forskel.push(`nr. ${i + 1}: listen "${liste[i]}", koden "${ægte[i]}"`);
  T.tjek(!forskel.length, `indholdsfortegnelsen passer med de ${ægte.length} markeringer`, forskel.slice(0, 3).join(' · '));

  const plan = t.split('\n').map((l, i) => l.includes('PLAN_FASE2') ? i + 1 : 0).filter(Boolean);
  T.tjek(!plan.length, 'ingen henvisning til PLAN_FASE2 i koden eller manualen', 'linje ' + plan.join(', '));
  return T.slut();
}
if (require.main === module) process.exit(kør(process.argv[2]) ? 0 : 1);
module.exports = kør;
module.exports.blokke = blokke;
