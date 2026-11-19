# Svar på P8.18 (D1–D7) · 19. november 2026

Beskeden ligger i `docs/arkiv/BESKED-TIL-CODE-19-nov-P8_18.txt`. **Intet eksisterende er fjernet.**

## Bygget i v9.104 (NU)

| Punkt | Hvad | Hvor |
| --- | --- | --- |
| **D1** gemning, der siger til | Alle 72 steder, der gemmer i browseren (`localStorage.setItem`), går nu gennem én hjælper, `lsGem(nøgle, tekst)`. Lykkes det, lyser det lille mærke **Gemt ✓** i linjen øverst (før statuslinjen) i 1,5 s, højst hvert 2. sekund. Fejler det (lageret er fuldt, `QuotaExceededError`, eller lukket), kommer et rødt banner midt øverst: *Kunne ikke gemme. Browserens lager er fuldt eller lukket, så dit arbejde gemmes ikke, før der er plads. Tag en sikkerhedskopi (Gem alle på computeren), og slet gamle shows under Mine i Biblioteket.* Knappen **Gem alle på computeren** i banneret er den samme som i Opsætninger (`opsEksport`) og åbner Opsætninger. Banneret forsvinder af sig selv, når en gemning lykkes igen. | linjen øverst; blokken *GEMNING DER SIGER TIL, ? OG NYT PÅ STARTSKÆRMEN* |
| **D2** tasten ? | **?** (Shift + ·) åbner manualen ved *Tastaturgenveje* (`man-genveje`). Ikke når du skriver i et felt (input, textarea, select, contenteditable). | hele programmet |
| **D3** Hvad er nyt | Startskærmen har foldet afsnittet **Hvad er nyt i v9.104** (de første højst 5 linjer fra manualens nyeste "Nyt i"-afsnit, hver klippet til cirka 170 tegn) og knappen **Hele listen i manualen**, der åbner manualen ved afsnittet. Teksten læses fra manualen, så den følger med, hver gang et nyt afsnit skrives. | startskærmen |

Rettet samtidig: startskærmens *Start et show* sagde "de 10 indbyggede shows" (det har været 7 siden v9.97).

## D6 · Dækker "Gem alle på computeren" alt?

**Nej.** Knappen *Gem alle på computeren* (Opsætninger, `opsEksport(SLOTS)`) gemmer kun **Opsætning 1–20** (nøglerne `rytme-A` … `rytme-T`). Det, der **ikke** kommer med:

| Hvad | Nøgle i browseren | Hvor det ses |
| --- | --- | --- |
| **Mine shows i Biblioteket** (uden loft; siden v9.87 er det her, Gem ▾ lægger dine shows) | `rytme-bib` | Biblioteket → Shows → Mit |
| Det, du arbejder på lige nu (regler, figurer, scene, pladser, det aktive show) | `rytme-mapping2`, `rytme-objekter`, `rytme-scene`, `rytme-pos`, `rytme-show-aktiv`, `rytme-show-foer` | alt på skærmen |
| Indstillinger: tema, størrelse, docking-layouts, Node-editorens pladser, egne opstillinger, **egne regel-sæt** (`set.ne.skabeloner`), Mine layouts | `rytme-set`, `rytme-layouts`, `rytme-layout-pladser` | Indstillinger, Opstilling ▾, Biblioteket (regel-sæt Mit) |
| Lys i Mesh 3D og Øjet (gemte lys-opsætninger) | `rytme-m3lys-gemte`, `rytme-m3form`, `rytme-oje`, `rytme-ojlys-gemte` | Mesh 3D og Øjet |
| Generatorens gemte sange 1–5, EQ+, Radial Mesh' indstillinger, sortering, udgang, lydlag | `rytme-spil`, `rytme-eqp`, `rytme-mesh-*`, `rytme-sort`, `rytme-udgang`, `rytme-lyd` | Generator, Spektrum+, Radial Mesh |
| Sangens show (det, Lav show gemmer til sangen) og analyse-cachen | `rytme-song-…` og IndexedDB | Biblioteket → Sangens show |

**Hvor meget fylder det?** Målt i testbrowseren (tegn i localStorage; 1 tegn ≈ 2 bytes):

| Tilstand | Tegn i alt | heraf `rytme-bib` |
| --- | --- | --- |
| Ny start (Standard) | 4 029 | 0 |
| Pigernes show indlæst | 13 115 | 0 |
| + Perfect 2 (mange figurer) | 39 946 | 0 |
| + 3 Mine shows i Biblioteket | 156 863 | 116 908 |

Det er cirka **314 KB**, cirka **6 %** af Chromes loft på cirka 5 MB pr. side. Hvert Mit show fylder cirka 40 KB, så loftet nås ved cirka **100 gemte shows af Perfect 2-størrelse** (eller flere mindre). Med D1 får du besked, før noget går tabt.

**Forslag (byg efter ja):** én knap **Gem hele arbejdet** (i Opsætninger ved siden af *Gem alle på computeren*, og i banneret) laver **én fil** `claude-mv-alt_<dato>.json` med alle `rytme-*`-nøgler (Mine shows, Opsætning 1–20, det aktive arbejde, indstillinger, lys, generatorens sange), og **Hent hele arbejdet** læser den ind igen og genstarter (som Nulstil alt gør). Analyse-cachen (IndexedDB, fx 56 MB for 74 minutter) kommer ikke med; den regnes igen. *Gem alle på computeren* bliver, som den er.

## Til planen (SENERE)

- **D4 ét fælles Fortryd:** Ctrl+Z dækker i dag regler, figurer, trim, effekt-grupper, Normalisering, Samlet styrke og Slå fra (v9.44, v9.84). Uden for: Fortryd for lyset i Mesh 3D og Øjet, Fortryd i EQ+ og Form-editorens egen historik. Skrevet ind i `PLAN-NY-BRUGERFLADE.md` under *Senere*.
- **D5 manualen som sidepanel:** manualen er i dag en dialog (`#gd`), der dækker programmet. Som sidepanel (en zone i docking, der kan trækkes og lukkes) kan man læse og klikke samtidig. Skrevet ind under *Senere*.

## Uændret

- **D7 feltfarven:** rørt ikke. Står i planen som "rør den ikke, før brugeren har valgt".
