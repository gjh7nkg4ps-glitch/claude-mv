# Kilderne til Claude MV (T0, 20. november 2026)

Programmet er stadig **én fil** (`claude-mv-vX_Y.html` i repoets rod), og det er den, brugeren åbner. Filen bygges af kildefilerne her.

| Mappe | Indhold |
| --- | --- |
| `dele/kode/hoved/` | Vores hovedscript, **én fil pr. blok** (nummereret i den rækkefølge, de står; `000-start…` har indholdsfortegnelsen) |
| `dele/kode/` | Rytme-motoren (`rytme-runtime.js`), Node-editorens linje-modul (`ne14-modul.js`) og et lille script |
| `dele/stil/` | CSS (`hoved.css`, `dk-stil.css`, `ne-stil.css`, `b7-stil.css`, skrifttyperne i `ne-skrift.css`) |
| `dele/html/` | Siden (`side-krop.html` med vinduerne) og manualens tre faner (`manual-1-brugermanual.html` …) |
| `dele/vendor/` | three.js r128 med glød-værktøjer og three.js 0.186 (core og WebGPU); skrevet af andre (MIT); rettes ikke |
| `dele/data/` | Temaet Warm Analog (JSON) |
| `dele.txt` | Rækkefølgen, delene sættes sammen i |

**Byg:** `node src/byg.js` (skriver `claude-mv-vX_Y.html`; versionen læses fra `<title>`). **Tjek:** `node src/byg.js --tjek claude-mv-vX_Y.html` siger, om kilderne giver præcis den fil (byte for byte). Test 102 gør det samme.

**Regler:** ret aldrig den byggede fil, kun kilderne. En ny blok er en ny fil i `dele/kode/hoved/` og en ny linje i `dele.txt`. Delene sættes sammen uden ændringer (ingen mellemrum eller linjeskift imellem). Git må ikke ændre linjeskift (`.gitattributes`).
