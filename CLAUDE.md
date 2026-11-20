# CLAUDE.md · Claude MV

Version 3.2 · 20. november 2026 · gælder fra Claude MV v9.109 · skrevet af Claude (chat på claude.ai) som overlevering til Claude Code. Kortet ned efter P8.23 (historik og lukkede fejl ligger i `docs/arkiv/HISTORIK.md`).

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
- Hver ny version gemmes som en **ny fil med nyt navn** (fx `claude-mv-v9_19.html`), og **den forrige fil slettes i samme gem** (commit, fagudtryk). Så ligger der altid kun den nyeste i repoet, og de gamle findes i historikken.
- Skriv gemmebeskeden på dansk med versionsnummeret først, fx `Claude MV v9.19: startskærm med demosang`.
- Opdater denne fil (CLAUDE.md), når noget i afsnit 3 til 5 ændrer sig; skriv én linje pr. version i `docs/arkiv/HISTORIK.md`.
- **`STATUS.md` skal være kort** (P8.14 punkt 3d): højst cirka 80 linjer med afsnittene *Nu (version)*, *Næste*, *Venter på brugeren*, *Åbne spørgsmål* og *Senere*. `docs/STATUS-TIL-HOVEDCHATTEN.md` højst cirka 60 linjer: nuværende stand, åbne spørgsmål og næste skridt.
- **Dokumenterne** (P8.23): planerne rummer kun det, der ikke er bygget; besvarede SVAR-filer flyttes til `docs/arkiv/`, når hovedchatten har læst dem, og det, der stadig gælder, skrives kort ind i planen; `tests/README.md` er én linje pr. test.

### Test før aflevering
- **Test, før du afleverer**, og vis mig skærmbilleder af det nye.
- **Vær ærlig** om, hvad der ikke er testet, eller hvad der ikke kan lade sig gøre.
- **Testpakken ligger i `tests/`** og kører alle trin med `node tests/koer-alle.js` (se `tests/README.md`). Trin 4 (det nye) får sin egen testfil pr. version, fx `tests/4-lydmotor.js`, som bliver i pakken.
- Den faste rækkefølge: **1. Syntaks** (`node --check` på hvert `<script>`); **2. Opstart** i testbrowseren (Playwright, fagudtryk) uden `pageerror` og konsolfejl, altid med det rigtige filnavn; **3. Fast testpakke** (hver Scene-fane, gemte indstillinger fra ældre versioner, alle opsætninger, alle layouts uden overlap, Mesh 3D og Øjet, gem og hent en plads, tilføj og fjern en regel); **4. Det nye** med skærmbillede, i 1920 × 1080, 2560 × 1440 og 3840 × 2160.
- **Faldgruber i testbrowseren:** intet grafikkort (SwiftShader), så 3D er langsomt og WebGPU kan ikke prøves; fuld skærm kan ikke fotograferes; kør aldrig to testkørsler samtidig (hukommelsen løber tør); hele pakken tager cirka 2 timer. Testpakken laver selv testlyd (`tests/testlyd.js`, mono og stereo). Knapper testes med rigtige museklik.

### Sådan har vi rettet i koden
- Små, præcise tekst-erstatninger, hvor den gamle tekst skal passe **præcis ét sted**; ellers stop.
- Nye funktioner lægges i en blok med en start- og slutmarkering: `/* ========== v9.4: NAVN ========== */` … `/* ========== SLUT: NAVN ========== */`, med en kort dansk kommentar øverst om, hvad blokken gør og hvorfor.
- Pas på **rækkefølgen**: topbaren og nogle samlinger bygges sent (i `setTimeout`); kode, der bruger dem, skal vente. Nye blokke pakker gerne gamle funktioner ind (`{const gl=f;window.f=function(){…gl()…}}`) i stedet for at ændre dem.

## 3. Det vigtigste, vi har besluttet

### Grundreglen
> **Jeg skal kunne forstå, hvad der sker, uden at noget er skjult.**

Brug den som tjek af alle ændringer. Automatik må gerne findes, men den skal kunne **ses** (fx *Auto* eller *Manuel*, de tal den har valgt) og have **Tilbage til standard**. Det, *at* noget påvirker, skal altid kunne ses; kun detaljerne må foldes sammen (fagudtryk: progressive disclosure).

### Analysen er programmets hjerte (P8.16, 19. november)
> MV er bygget op omkring analysen. Målet er en meget stærk analyse: vi bruger alle de midler, der findes (spor, bedre metoder i browseren, et lokalt modul med AI og AI udenfor), når det kan betale sig. **"Kan betale sig"** betyder, at et lydtræk, der bruges, bliver tydeligt mere sikkert, og at det kan måles (fx med Detektion eller musikgeneratoren som facit). Planen for den nye analyse laves sammen med hovedchatten (P8.14 punkt 4); byg intet nyt i analysen før det.

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
| opstillinger af noder | **Gitter** (v9.105): Ret op, model A/B/C, skyderne Lodret og Vandret |

### Analyse og mapping
- **Gain-stakken** (fagudtryk: gain staging): reglens styrke × figurens eller effektens styrke × Samlet styrke × Afsnits-dynamik (kun med Show og en analyseret fil); vises som *Styrke brugt*. Alle regler går gennem **`Regler`** (`tilfoej`, `ret`, `slet`, `erstat`, `samlet`, `lyt`); hver regel har et fast `id`.
- Hovedanalysen bruger FFT 2048 (21,5 Hz pr. trin); tone-analysen og de 31 bånd bruger 8192. Under 50 Hz er det groft.

### Fjernet, og hvordan gamle opsætninger overlever
- **Lydkort** (`lk:`, v9.12), **Morph Pad** (`pad:`, v9.43) og **lydlag-målene** (`lyd:`, v9.81) er fjernet; en gammel regel med dem bliver stående, slås fra og får en gul besked (`fjernetTjek`). Tilføj dem ikke igen uden at spørge. Sidste version med Lydkort: v9.11 (tagget `milepael-med-lydkort`).
- **Dobbelte målinger** (v9.13): intet fjernes; de 31 smalle bånd står foldet under de fire brede. **Taktslag og Spor: Auto-valg** = fil → fra filen, Lyd ind eller generator → mens det spiller, med grunden vist. **Stereobredde** = 1 minus korrelationen mellem venstre og højre (Panorering måler placeringen).
- **4 spor (stems, v9.15):** Trommer, Bas, Vokal og Resten lægges sammen til én lyd; hvert spor måles for sig (14 lydtræk, `stem:SPOR:LYDTRÆK`); Auto-valg læser kick, snare og hihat fra Trommer. Delingen laves uden for MV med **Ultimate Vocal Remover**; *Vælg en mappe …* fordeler filerne efter navn (v9.101).

## 4. Åbne fejl og halvfærdigt (kun det, der stadig er åbent; én linje hver)

- **Konsol-linjen** `computeBoundingSphere(): Computed radius is NaN` (16. november) og den manglende streg fra Lydfil-noden: ikke undersøgt.
- **Lydmotor** (v9.8) er målt (ingen klip), men lyden er ikke lyttet til af et menneske.
- **Send til editor** laver ikke tempo-profilen (SHOWPROFIL); kun en lydfil gør det. Akkord-fladen og fill giver ikke klodser.
- **4 spor:** gemmes ikke i cachen eller i pladserne (vælges igen efter genstart); hvert spor får kun de 14 lydtræk, ikke trin 2; regnes i hovedtråden; 74 minutter × 4 spor kan ikke være i hukommelsen (se `docs/arkiv/SVAR-P8_14.md` a og b).
- **Hysterese, Hold med tid og Slew** virker ikke på klods-spor; klodser, der forudsiges fra filen, bruger ikke trim, Taktslag Auto og Spor Auto.
- **three.js:** r128 til Mesh 3D og Øjet, 0.186.1 ved siden af til Node-editorens linjer (valg A); B (esbuild, én three.js), når Mesh 3D og Øjet flyttes. WebGPU kan ikke prøves i testbrowseren (linjerne kører WebGL2).
- **Kort over forbindelserne** kræver internet første gang (Mermaid fra jsDelivr).
- **Lav show hakker hos brugeren:** kunne ikke genskabes; bed om sangens længde og konsollen, hvis det sker igen. **Node-editoren helt tom hos brugeren (v9.61):** årsagen er ikke fundet; sikringen viser *Vis alle noder* og *Stil noderne op igen*.
- **Oprydning, der stadig mangler:** Generator (fuld, w4) og Lydlag (w15) som skjult kode, `OPS_TEST` (40 test bruger den), `nivAnvend`, sidebjælkens og bundbjælkens kode (bygges og fjernes ved start), de gamle layouts i `lay3Anvend` (testene bruger dem), de gamle "Nyt i"-afsnit i manualen nævner fjernede ting (historik).
- **Regel-sættene** (B6, v9.90) og de seks skabeloner er Codes skøn; ikke prøvet på musik af et menneske. B6-navnene er ikke sagt god for udtrykkeligt.
- **Warm Analog** (v9.72) er en første gennemgang; faste farver i enkelte vinduer er ikke gået efter. Den levende baggrund er meget diskret (valget er ikke truffet).
- **Min opstilling 1/2** og egne regel-sæt ligger i `set.ne` (fælles for alle shows); egne regel-sæt kan ikke omdøbes eller slettes. Et langsomt træk i en skyder kan give flere Fortryd-skridt.
- **På scenen (PS1–PS3):** effekt-rækkerne har ingen ⋯-menu (kortet i Biblioteket har knapperne); effekt-regel-sættenes tal er Codes skøn ud fra Standard; 6c får adgang til effekterne, når 6c bygges.
- **Gem hele arbejdet:** analyse-cachen (IndexedDB) er ikke med; Hent kan ikke fortrydes.
- **Tags fra Claude Code:** sessionen må sende gem op, men ikke lave eller slette tags og grene. Grenen `v9_11-med-lydkort` kan slettes, når du vil.
- **Ikke prøvet:** din 43" skærm, berøringsskærm, mikrofon, MIDI-keyboard, rigtig fuld skærm, Unity-udgaven af Mesh 3D.

## 5. Planen: det næste

Rækkefølgen er brugerens (P8.14 punkt 8, P8.20, P8.23). Planerne: `PLAN-NY-BRUGERFLADE.md` (kun det ubyggede), `docs/PLAN-PAA-SCENEN.md`, `docs/PLAN-SANG-OG-ANALYSE.md`. Alt det byggede står i `docs/arkiv/HISTORIK.md`.

1. **På scenen er færdig (PS1–PS3; v9.109 er prøvet af brugeren og er ok, 20. november).** Hele testpakken er grøn på v9.109 (96 testfiler).
2. **PS4 er lukket:** gruppernes øje og Slå fra i Noder bliver (brugerens valg). Intet at bygge.
3. **6c Figur-generatoren** (beslutningerne i `PLAN-NY-BRUGERFLADE.md` § 4.2).
4. **Pigernes egenskaber:** ligger stille (brugeren, 20. november); ordnes engang i fremtiden ud fra `docs/PIGERNES-EGENSKABER.md`; intet fjernes før da.
5. **Analysen:** planen "Den nye analyse P8.19" (A0–A8) og skemaet "Alle lyde og alle metoder P8.22" venter på brugerens valg a–e (brugeren ser på dem med hovedchatten nu). Byg intet i analysen før det (grundreglen i § 3).
6. **Senere:** spor-deling som lokalt modul, `.stem.mp4`, målervæg, tema med tekstur, Radial Mesh-værksted med rigtig bloom, stregerne i Node-editoren, ét fælles Fortryd (D4), manualen som sidepanel (D5), nye 2D-figurer på et skelet, 3D-scene, S7 og S8. Detaljer i `STATUS.md` og planerne.
