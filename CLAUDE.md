# CLAUDE.md · Claude MV

Version 3.2 · 20. november 2026 · gælder fra Claude MV v9.131 · skrevet af Claude (chat på claude.ai) som overlevering til Claude Code. Kortet ned efter P8.23 (historik og lukkede fejl ligger i `docs/arkiv/HISTORIK.md`).

Denne fil fortæller det, der **ikke** står i koden: hvad programmet er til, hvordan jeg vil arbejde, hvad vi har besluttet, hvad der er åbent, og hvad der er det næste. Læs koden selv for resten. Øverst i hovedscriptet står en indholdsfortegnelse over alle blokke.

**Faste regler for dokumenterne (P8.23):** Læs ikke `docs/arkiv/`, medmindre du leder efter noget bestemt. Hold CLAUDE.md under 15 KB. Fjern det, der er færdigt, fra planerne, når det er bygget (flyt det til `docs/arkiv/`; slet aldrig indhold). Hver version får højst én linje i `docs/arkiv/HISTORIK.md`.

---

## 1. Hvad Claude MV er

Claude MV er et personligt værksted, der gør musik til levende billeder. En lydfil (oftest mp3) analyseres, og målingerne (fx bas, kick, hihat, taktslag, afsnit og drop) styrer figurer, lys og 3D-grafik gennem **forbindelser** (fagudtryk: mapping). Det er bygget sammen med Claude over mange versioner.

- Hele programmet er **én HTML-fil** (cirka 6,5 MB med to udgaver af three.js), der kører i browseren uden server og uden internet.
- Vigtigste dele: fire arbejdsområder: **1 · Analyse** (lydfil, generator, spor, kortene i vinduet Analyse), **2 · Scene** (Live preview, Radial Mesh, Mesh 3D, Øjet; På scenen og Egenskaber), **3 · Regler** (Node-editoren med Noder og Matrix, Biblioteket) og **4 · Show**.
- Det er et **privat program**. Det skal være let at gå til, men kunne blive rigtig dybt.

## 2. Sådan vil jeg arbejde sammen med dig

### Sprog og forklaringer
- Svar på **dansk i et enkelt sprog**. Lær mig gerne de **internationale fagudtryk** en gang imellem.
- Når du bruger et navn eller udtryk, så skriv i parentes, om det er **vores eget navn** (kælenavn) eller det **normale fagudtryk**. Eksempel: Auto-tærskel (vores navn), envelope follower (fagudtryk).
- **Forklar konkret.** Jeg forstår ikke metaforer og sammenligninger (fx "som et supermarked"). Drop dem.
- Jeg er **meget visuel**. Brug diagrammer og tabeller. Mermaid-diagrammer (fagudtryk) er gode, men jeg kan ikke se små diagrammer i en chat. Lav hellere større diagrammer som `.md`-filer i repoet (GitHub viser Mermaid stort), eller som et skærmbillede.
- **Ret mig og lær mig nye ting**, især om hvordan vi arbejder bedst sammen.

### Beslutninger
- Vis **muligheder med for og imod**, giv et **anbefalet valg**, og lad **mig bestemme**.
- **Ændr kun det, jeg beder om.** Ryd op, når jeg siger til.

### Nøgleord
| Når jeg skriver | betyder det |
| --- | --- |
| **tænker højt** | jeg vil snakke, ikke bygge |
| **kør** | byg |
| **til planen** | gem idéen i planen (afsnit 6) uden at afbryde det, vi er i gang med |
| **lav handover** | lav et resumé, så en ny session kan tage over |

### Versioner
- **Nyt versionsnummer ved hver aflevering**, tre steder: filnavnet (`claude-mv-v9_19.html`), programmet (`<title>Claude MV v9.19 (Rytme-editor)</title>` og versionsmærket, søg efter `hver gang filen samles til udgivelse.">`) og svaret til mig. Efter v9.9 kommer v9.10 og så videre; **v10.0** venter, til jeg siger til.
- Skriv et **afsnit i manualen** (`<h3 id="man-v919">` lige over det forrige) og ret linjen **"Nyt i v…"** øverst (testen `2-indhold.js` tjekker den). Byg altid videre på den nyeste fil i repoet.

### GitHub
- **Hovedchattens indbakke** (P8.32, dit valg B2): læs `docs/hovedchat/BESLUTNINGER.md` ved start. Beskeder ligger i `docs/hovedchat/P8.x.txt`; "kør P8.x" betyder: læs og byg den besked. Kun hovedchatten skriver dér; nye beslutninger skrives kort ind i planen ved næste version. En beslutning er ikke en ordre. **Træk altid (git pull), før du gemmer.**
- Hver ny version gemmes som en **ny fil med nyt navn** (fx `claude-mv-v9_19.html`), og **den forrige fil slettes i samme gem** (commit, fagudtryk). Så ligger der altid kun den nyeste i repoet, og de gamle findes i historikken.
- Skriv gemmebeskeden på dansk med versionsnummeret først, fx `Claude MV v9.19: startskærm med demosang`.
- Opdater denne fil (CLAUDE.md), når noget i afsnit 3 til 5 ændrer sig; skriv én linje pr. version i `docs/arkiv/HISTORIK.md`.
- **`STATUS.md` skal være kort** (P8.14 punkt 3d): højst cirka 80 linjer med afsnittene *Nu (version)*, *Næste*, *Venter på brugeren*, *Åbne spørgsmål* og *Senere*. `docs/STATUS-TIL-HOVEDCHATTEN.md` højst cirka 80 linjer (brugeren 20. november: hellere lidt længere end at miste kontekst; skær ikke tal og fund væk).
- **Dokumenterne** (P8.23): planerne rummer kun det, der ikke er bygget; besvarede SVAR-filer flyttes til `docs/arkiv/`, når hovedchatten har læst dem, og det, der stadig gælder, skrives kort ind i planen; `tests/README.md` er én linje pr. test.

### Test før aflevering
- **Test, før du afleverer**, og vis mig skærmbilleder af det nye.
- **Vær ærlig** om, hvad der ikke er testet, eller hvad der ikke kan lade sig gøre.
- **Testpakken ligger i `tests/`** og kører alle trin med `node tests/koer-alle.js` (se `tests/README.md`). Trin 4 (det nye) får sin egen testfil pr. version, fx `tests/4-lydmotor.js`, som bliver i pakken.
- Den faste rækkefølge: **1. Syntaks** (`node --check` på hvert `<script>`); **2. Opstart** i testbrowseren (Playwright) uden `pageerror` og konsolfejl, med det rigtige filnavn; **3. Fast testpakke**; **4. Det nye** med skærmbillede i 1920 × 1080, 2560 × 1440 og 3840 × 2160.
- **Faldgruber i testbrowseren:** intet grafikkort (SwiftShader): 3D er langsomt, WebGPU kan ikke prøves; fuld skærm kan ikke fotograferes; kør aldrig to testkørsler samtidig (hukommelsen løber tør); hele pakken tager cirka 2 timer. Knapper testes med rigtige museklik.

### Sådan retter vi i koden (fra T0, 20. november)
- **Kilderne ligger i `src/dele/`** (én fil pr. blok i `kode/hoved/`; three.js i `vendor/`; CSS i `stil/`; manualen i `html/`); `src/dele.txt` er rækkefølgen. **Ret aldrig den byggede fil.** Byg med `node src/byg.js`; `--tjek <fil>` sammenligner byte for byte (test 102). Se `src/LÆSMIG.md`.
- Små, præcise tekst-erstatninger, hvor den gamle tekst skal passe **præcis ét sted** i alle kilderne; ellers stop.
- En ny funktion er en ny fil i `kode/hoved/` med start- og slutmarkering: `/* ========== v9.4: NAVN ========== */` … `/* ========== SLUT: NAVN ========== */` og en kort dansk kommentar øverst.
- Pas på **rækkefølgen**: topbaren og nogle samlinger bygges sent (i `setTimeout`); kode, der bruger dem, skal vente. Nye blokke pakker gerne gamle funktioner ind (`{const gl=f;window.f=function(){…gl()…}}`) i stedet for at ændre dem.

## 3. Det vigtigste, vi har besluttet

### Grundreglen
> **Jeg skal kunne forstå, hvad der sker, uden at noget er skjult.**

Brug den som tjek af alle ændringer. Automatik må gerne findes, men den skal kunne **ses** (fx *Auto* eller *Manuel*, de tal den har valgt) og have **Tilbage til standard**. Det, *at* noget påvirker, skal altid kunne ses; kun detaljerne må foldes sammen (fagudtryk: progressive disclosure).

### Analysen er programmets hjerte (P8.16, 19. november)
> MV er bygget op omkring analysen. Målet er en meget stærk analyse: vi bruger alle de midler, der findes (spor, bedre metoder i browseren, et lokalt modul med AI og AI udenfor), når det kan betale sig. **"Kan betale sig"** betyder, at et lydtræk, der bruges, bliver tydeligt mere sikkert, og at det kan måles (fx med Detektion eller musikgeneratoren som facit). Planen er "Den nye analyse P8.19" (A0–A8); facit er Testlyd (v9.115) og Rigtige trommer (v9.116); spor kun under cirka 15 minutter for nu. Byg ét trin ad gangen, og stop efter hvert.

### Udseende og vinduer
- **Docking** (v9.36; fagudtryk som i VS Code og Blender): zoner med faner, der fylder arbejdsfladen uden at overlappe; fire arbejdsområder (1 · Analyse, 2 · Scene, 3 · Regler, 4 · Show); layoutene husker ændringer, ↺ Standard sætter dem tilbage. **Din skærm er en 43" ASUS (3840 × 2160); du prøver selv hver version på den.**
- **Stil:** en 50/50-blanding af vores glas-look (glas, glød, shaders) og iZotope Ozone (kun inspiration): roligt, mørkt blågråt, og **lys kun på det, der måler noget**. Ikke flade, kedelige farver.
- **Skydere til det meste.** Runde drejeknapper kun som et signal om, at en funktion er avanceret.
- Jeg bruger **mest mp3-filer**. *Lyd ind* (mikrofon) og *Projektor* bruges sjældent og skal være små og ligge lidt i baggrunden.

### Navne (alle vores navne)
| Før | Nu |
| --- | --- |
| Tilpas til sangen, Auto-tærskel | **Adaptiv tærskel** (v9.33); mærket *Adaptiv* |
| Master gain | **Samlet styrke (master)** |
| Pause ved en forbindelse | **Spærretid** (fagudtryk: refractory period) |
| Show-vægte | **Afsnits-dynamik** (kun brugt i forklaringen af gain-stakken indtil videre) |
| Lyd (W25) | **Arbejdsfelt** |
| Generator-fanen | **Lydkilde** (W31) |
| Ny lydmotor (v9.8) | **Lydmotor** (hed Lydmotor 2 til v9.83; den gamle, Klassisk, er fjernet i v9.84) |
| Stems (v9.15) | **4 spor**: Trommer, Bas, Vokal og Resten; kilderne hedder fx **Trommer · Kick** |
| Port · Portgrænse | **Gate · Gate-tærskel** (v9.33) |
| Auto-mapping · Kør Auto-mapping nu | **Foreslå regler** (v9.63): forslag som stiplede celler, ja eller nej |
| Normalisering: Auto · Fast reference | **Normalisering: Adaptiv · Fast** (v9.33) |
| Auto (Taktslag og Spor) | **Auto-valg** (v9.33) |
| Pladserne A–T | **Opsætning 1–20** (v9.33; nøglerne `rytme-A` … `rytme-T`); **Mine shows** i Biblioteket (v9.87) |
| forudindstilling | **opsætning** (v9.33) |
| Scene (Dublets effekt-gruppe) | **Scene-effekter** |
| Mapping, Router 2.0, Dublet, Routing-overblik | **slettet i v9.35** (din beslutning); reglerne er i Node-editoren |
| 1 · Sang, vinduet Sang (S2) | **1 · Analyse, vinduet Analyse** (v9.98); fanerne inde i vinduet hedder Sang · Spor · Avanceret |
| vinduet Figurer (v9.74) | **På scenen** (v9.107): Karakterer, Figurer og Effekter |
| sikkerhed pr. lydtræk (● ▲ !) | **Analyse sikkerhed** (v9.110; fagudtryk: evaluation): fanen i Analyse og cirklen med tal i matrixen |
| generatoren som facit i Analyse sikkerhed | **Testlyd** (v9.115): regnes i ren matematik; **Rigtige trommer** (v9.116): MDB Drums fra en mappe |
| A3, første del | **Bedre slag og takt (A3)** (v9.117): Til/Fra i Indstillinger for analysen |
| opstillinger af noder | **Gitter** (v9.105): Ret op, model A/B/C, skyderne Lodret og Vandret |

### Analyse og mapping
- **Gain-stakken** (fagudtryk: gain staging): reglens styrke × figurens eller effektens styrke × Samlet styrke × Afsnits-dynamik (kun med Show og en analyseret fil); vises som *Styrke brugt*. Alle regler går gennem **`Regler`** (`tilfoej`, `ret`, `slet`, `erstat`, `samlet`, `lyt`); hver regel har et fast `id`.
- Hovedanalysen bruger FFT 2048 (21,5 Hz pr. trin); tone-analysen og de 31 bånd bruger 8192. Under 50 Hz er det groft.

### Fjernet, og hvordan gamle opsætninger overlever
- **Lydkort** (`lk:`, v9.12), **Morph Pad** (`pad:`, v9.43) og **lydlag-målene** (`lyd:`, v9.81) er fjernet; en gammel regel med dem bliver stående, slås fra og får en gul besked (`fjernetTjek`). Tilføj dem ikke igen uden at spørge. Sidste version med Lydkort: v9.11 (tagget `milepael-med-lydkort`).
- **Dobbelte målinger** (v9.13): intet fjernes; de 31 smalle bånd står foldet under de fire brede. **Taktslag og Spor: Auto-valg** = fil → fra filen, Lyd ind eller generator → mens det spiller, med grunden vist. **Stereobredde** = 1 minus korrelationen mellem venstre og højre (Panorering måler placeringen).
- **4 spor (stems, v9.15):** Trommer, Bas, Vokal og Resten lægges sammen til én lyd; hvert spor måles for sig (`stem:SPOR:LYDTRÆK`); Auto-valg læser kick, snare og hihat fra Trommer. Delingen laves med **Ultimate Vocal Remover**; *Vælg en mappe …* fordeler filerne efter navn.

## 4. Åbne fejl og halvfærdigt (kun det, der stadig er åbent; én linje hver)

- **Konsol-linjen** `computeBoundingSphere(): Computed radius is NaN` (16. november) og den manglende streg fra Lydfil-noden: ikke undersøgt.
- **Lydmotor** (v9.8): lyden er ikke lyttet til af et menneske.
- **Send til editor** laver ikke tempo-profilen (SHOWPROFIL). Akkord-fladen og fill giver ikke klodser.
- **4 spor (A1, v9.113):** hele analysen pr. spor (80 lydtræk: 14 + 66) i baggrunds-trådene, gemt i cachen pr. filnavn og længde; filerne vælges igen efter genstart; spor over cirka 15 minutter læses ikke ind (A8).
- **Hysterese, Hold med tid og Slew** virker ikke på klods-spor; forudsagte klodser bruger ikke trim, Taktslag Auto og Spor Auto.
- **three.js:** r128 til Mesh 3D og Øjet, 0.186.1 til Node-editorens linjer (valg A); B (én three.js), når Mesh 3D og Øjet flyttes. WebGPU kan ikke prøves i testbrowseren.
- **Kort over forbindelserne** kræver internet første gang (Mermaid).
- **Oprydning, der mangler:** Generator (fuld, w4), Lydlag (w15), `OPS_TEST`, `nivAnvend`, side- og bundbjælkens kode, gamle layouts i `lay3Anvend`, gamle "Nyt i"-afsnit.
- **Regel-sættene** (B6, v9.90) og de seks skabeloner er Codes skøn; ikke prøvet på musik af et menneske.
- **Warm Analog** (v9.72) er en første gennemgang; den levende baggrund er meget diskret (valget er ikke truffet).
- **Min opstilling 1/2** og egne regel-sæt ligger i `set.ne` (fælles for alle shows); egne regel-sæt kan ikke omdøbes eller slettes.
- **På scenen:** effekt-rækkerne har ingen ⋯-menu; effekt-regel-sættenes tal er Codes skøn; 6c får adgang til effekterne, når 6c bygges.
- **Analyse sikkerhed:** fasens sikkerhed ser ikke, om taktslagene ligger på modslaget. Kræv sikkerhed (A2) er pr. øjeblik kun for Tonehøjde og Takt 1. Cirklen mangler på lydtræk-noderne og i Foreslå regler.
- **Gem hele arbejdet:** analyse-cachen (IndexedDB) er ikke med; Hent kan ikke fortrydes.
- **Tags:** sessionen må ikke lave eller slette tags og grene (`v9_11-med-lydkort` kan slettes).
- **Ikke prøvet:** din 43" skærm, berøringsskærm, mikrofon, MIDI-keyboard, rigtig fuld skærm, Unity-udgaven af Mesh 3D.

## 5. Planen: det næste

Rækkefølgen er brugerens. Planerne: `PLAN-NY-BRUGERFLADE.md`, `docs/PLAN-PAA-SCENEN.md`, `docs/PLAN-SANG-OG-ANALYSE.md`, `docs/PLAN-TEKNIK.md`. Alt det byggede står i `docs/arkiv/HISTORIK.md`.

1. **På scenen er færdig** (PS1–PS3, v9.109 prøvet og ok; PS4 lukket: gruppernes øje og Slå fra i Noder bliver).
2. **Analysen** (plan P8.19: https://claude.ai/artifact/XEhWRPjamxqHZX7jhV1ESs · skema P8.25: https://claude.ai/artifact/VKviSHX9KRu9f8Rw4Z9QJU). Bygget til v9.131 (`docs/arkiv/HISTORIK.md`). **STOP.** Mål før og efter på Testlyd og Rigtige trommer (vælg på *indstil*, tjek på *tjek*); det, der skader de rigtige trommer, kommer ikke med. Næste: P8.33 trin 2–4 → rest af A4 → A5–A6. Tallene: `docs/STATUS-TIL-HOVEDCHATTEN.md`.
3. **Pigernes egenskaber:** ligger stille (brugeren, 20. november); intet fjernes (`docs/PIGERNES-EGENSKABER.md`).
4. **6c Figur-generatoren** (`PLAN-NY-BRUGERFLADE.md` § 4.2), når brugeren siger til. **Feltfarven D7** er ikke valgt.
5. **Senere:** står i `STATUS.md` (afsnittet Senere) og i planerne.
