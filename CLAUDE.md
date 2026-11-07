# CLAUDE.md · Claude MV

Version 2.3 · 7. november 2026 · gælder fra Claude MV v9.20 · skrevet af Claude (chat på claude.ai) som overlevering til Claude Code.

Denne fil fortæller det, der **ikke** står i koden: hvad programmet er til, hvordan jeg vil arbejde, hvad vi har besluttet, og hvad der er halvfærdigt. Læs koden selv for resten. Øverst i hovedscriptet står en indholdsfortegnelse over alle blokke.

---

## 1. Hvad Claude MV er

Claude MV er et personligt værksted, der gør musik til levende billeder. En lydfil (oftest mp3) analyseres, og målingerne (fx bas, kick, hihat, taktslag, afsnit og drop) styrer figurer, lys og 3D-grafik gennem **forbindelser** (fagudtryk: mapping). Det er bygget sammen med Claude over mange versioner.

- Hele programmet er **én HTML-fil** (cirka 1,8 MB), der kører i browseren uden server og uden internet. Three.js r128 og dets glød-værktøjer (MIT) ligger inde i filen.
- Vigtigste dele: **Scenen** med Live preview (dansende figurer), Radial Mesh, Mesh 3D, Øjet (vores navn: lys fra fremtiden), EQ og EQ+; **Editoren** (figurer og deres egenskaber); **Arbejdsfeltet** (vores navn) med fanerne Mapping, Tidslinje, Analyse, Lydkilde, Router og Node-editor (fra v9.19).
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
- **Nyt versionsnummer ved hver aflevering**, tre steder:
  1. i **filnavnet**: `claude-mv-v9_19.html`
  2. i **programmet**: `<title>Claude MV v9.19 (Rytme-editor)</title>` og det lille versionsmærke (søg efter `hver gang filen samles til udgivelse.">`)
  3. i **svaret** til mig
- Efter v9.9 kommer **v9.10**, v9.11 og så videre. **v10.0** venter vi med, til jeg siger til.
- Skriv også et **afsnit i manualen**: et nyt `<h3 id="man-v919">` lige over det forrige, og opdater linjen **"Nyt i v…"** øverst i manualen (testen `2-indhold.js` tjekker den; i v9.16 og v9.17 blev den glemt).
- Versioner kan også laves i hovedchatten på claude.ai (fx v9.16 og v9.17). Byg altid videre på den nyeste fil i repoet.

### GitHub
- Hver ny version gemmes som en **ny fil med nyt navn** (fx `claude-mv-v9_19.html`), og **den forrige fil slettes i samme gem** (commit, fagudtryk). Så ligger der altid kun den nyeste i repoet, og de gamle findes i historikken.
- Skriv gemmebeskeden på dansk med versionsnummeret først, fx `Claude MV v9.19: startskærm med demosang`.
- Opdater denne fil (CLAUDE.md), når noget i afsnit 3 til 6 ændrer sig.

### Test før aflevering
- **Test, før du afleverer**, og vis mig skærmbilleder af det nye.
- **Vær ærlig** om, hvad der ikke er testet, eller hvad der ikke kan lade sig gøre.
- **Testpakken ligger i `tests/`** og kører alle trin med `node tests/koer-alle.js` (se `tests/README.md`). Trin 4 (det nye) får sin egen testfil pr. version, fx `tests/4-lydmotor.js`, som bliver i pakken.
- Den faste rækkefølge, vi har brugt:
  1. **Syntaks:** kør `node --check` på hvert `<script>` i filen. Et opstartstjek alene fanger ikke syntaksfejl.
  2. **Opstart:** åbn filen i en testbrowser (Playwright, fagudtryk) og tjek, at der ingen fejl er (`pageerror` og konsolfejl). Giv altid tjekket det rigtige filnavn; vi har en gang testet en gammel fil i flere versioner uden at opdage det.
  3. **Fast testpakke:** opstart med hver Scene-fane gemt som valgt (v9.15); opstart med gemte indstillinger fra syv ældre versioner (`tests/gamle-indstillinger/`, v9.18; v9.18 selv kom med i v9.19); alle forudindstillinger (`FORINDST`, kør hver med `brugFor(id,true)`) uden fejl; alle 6 layouts (`lay3Anvend`; Noder kom med i v9.19) uden overlap mellem synlige vinduer; Mesh 3D og Øjet starter; gem og hent en plads (`slotSave`/`slotLoad`); tilføj og fjern en forbindelse.
  4. **Det nye:** en test af netop det, der er ændret, plus et skærmbillede.
- **Kendte faldgruber i testbrowseren:** uden grafikkort (SwiftShader, fagudtryk) er 3D meget langsomt; analysen af en lydfil tager over et minut (uden SwiftShader cirka 11 sekunder); skærmbilleder af fuld skærm virker ikke. Testpakken laver selv testlydfiler (30 s ved 120 BPM, `tests/testlyd.js`), i mono og i stereo (mono, venstre, højre og bred), så panorering og stereobredde også testes.

### Sådan har vi rettet i koden
- Små, præcise tekst-erstatninger, hvor den gamle tekst skal passe **præcis ét sted**; ellers stop.
- Nye funktioner lægges i en blok med en start- og slutmarkering: `/* ========== v9.4: NAVN ========== */` … `/* ========== SLUT: NAVN ========== */`, med en kort dansk kommentar øverst om, hvad blokken gør og hvorfor.
- Pas på **rækkefølgen**: topbaren, sidebjælken og nogle samlinger bygges sent (i `setTimeout`). Kode, der skal bruge dem, skal vente, ellers bliver den overskrevet eller finder ikke elementerne. Det har givet fejl flere gange.

## 3. Det vigtigste, vi har besluttet

### Grundreglen
> **Jeg skal kunne forstå, hvad der sker, uden at noget er skjult.**

Brug den som tjek af alle ændringer. Automatik må gerne findes, men den skal kunne **ses** (fx *Auto* eller *Manuel*, de tal den har valgt) og have **Tilbage til standard**. Det, *at* noget påvirker, skal altid kunne ses; kun detaljerne må foldes sammen (fagudtryk: progressive disclosure).

### Udseende og vinduer
- **Vinduessystem A: faste zoner** (som Ableton): Scene, Editor og Arbejdsfelt fylder skærmen uden at overlappe. Intet må ligge frit oven på zonerne. Andre vinduer åbnes som panel ovenpå (lukkes med ✕ eller Esc).
- **Stil:** en 50/50-blanding af vores glas-look (glas, glød, shaders) og iZotope Ozone (kun inspiration): roligt, mørkt blågråt, og **lys kun på det, der måler noget**. Ikke flade, kedelige farver.
- **Skydere til det meste.** Runde drejeknapper kun som et signal om, at en funktion er avanceret.
- Jeg bruger **mest mp3-filer**. *Lyd ind* (mikrofon) og *Projektor* bruges sjældent og skal være små og ligge lidt i baggrunden.

### Navne (alle vores navne)
| Før | Nu |
| --- | --- |
| Tilpas til sangen | **Auto-tærskel** |
| Master gain | **Samlet styrke (master)** |
| Pause ved en forbindelse | **Spærretid** (fagudtryk: refractory period) |
| Show-vægte | **Afsnits-dynamik** (kun brugt i forklaringen af gain-stakken indtil videre) |
| Lyd (W25) | **Arbejdsfelt** |
| Generator-fanen | **Lydkilde** (W31) |
| Ny lydmotor (v9.8) | **Lydmotor 2**; den gamle hedder **Klassisk** |
| Graf-editor (v9.9) | **Router 2.0**, fanen **Router** (W32); én boks pr. forbindelse hedder **Router-boks** |
| Stems (v9.15) | **4 spor**: Trommer, Bas, Vokal og Resten; kilderne hedder fx **Trommer · Kick** |

### Analyse og mapping
- **Auto-tærskel** flytter tærsklen efter sangen. Den **gain-stak** (fagudtryk: gain staging), der bruges, er: forbindelsens gain × Samlet styrke × Følsomhed (kun Enkel tilstand) × Afsnits-dynamik (kun med Show og en analyseret fil). Den vises ved hver forbindelse som "Styrke brugt".
- Hovedanalysen bruger FFT 2048 (21,5 Hz pr. trin); tone-analysen og de 31 bånd bruger 8192. Under 50 Hz er det groft.

### Lydkort er fjernet (v9.12)
- **Lydkort** (kildegruppen `lk:`, en `.json`-fil fra Lydkosmos) er fjernet helt, fordi det gjorde tingene for komplicerede: endnu en kildegruppe med 17 kilder, der målte det samme som Lydtræk og Analysen (bas, kick, beat, RMS …), en ekstra fil, der skulle passe til sangen, og et ekstra kort og en knap.
- Den sidste version med Lydkort er v9.11, mærket med tagget **`milepael-med-lydkort`** (commit `87fcc93`).
- Gemte opsætninger med en `lk:`-kilde (eller `lk:`-port) går ikke i stykker: forbindelsen bliver stående, slås fra, giver 0, og der står en gul besked i statuslinjen, Mapping og Router (blokken *FJERNEDE KILDER*). Tilføj ikke Lydkort igen uden at spørge.

### Dobbelte målinger (v9.13)
- **Intet fjernes.** Det, der hjælper, er at folde de detaljerede sammen og have én tydelig regel.
- **De 31 smalle bånd** står foldet sammen under hvert af de fire brede bånd (Bas 11, Mid 9, Høj-mid 5, Brilliance 6) i kildelisterne og i Router (fra Niveau 3). *▸ Vis* og *▾ Skjul* ændrer ikke forbindelsen; valget huskes.
- **Kun på Niveau 4:** de høje smalle bånd (5 kHz og op), Spectral rolloff og Zero crossing rate. Der står, hvor mange der er skjult; en forbindelse, der bruger en af dem, viser den stadig.
- **Taktslag og takt** (fra filen = Analysen; mens det spiller = takturet): reglen **Auto** er *fil → fra filen*, *Lyd ind eller generator → mens det spiller*, altid med grunden vist ved forbindelsen (fx "Auto: fra filen, fordi du spiller en fil"). Vælger man selv, står der **Manuel** og hvad Auto ville have brugt.
- **Stereobredde** (v9.14) = **1 minus korrelationen** mellem venstre og højre, højst 1; er den ene kanal stille (under 0,001 i RMS eller 40 dB under den anden), er bredden 0. Den måler bredde, ikke placering; **Panorering** måler placeringen. Bred og modfase giver begge 1; forskellen ses i **Faselighed**.

### 4 spor (stems, v9.15)
- **Trin 1:** man giver programmet 4 filer, der er delt op på forhånd (Trommer, Bas, Vokal, Resten) i kortet *4 spor (stems)* i Lydkilde. De lægges sammen til én lyd, der spilles og analyseres som en almindelig fil; hvert spor måles for sig (14 lydtræk pr. spor, kilderne `stem:SPOR:LYDTRÆK`, vist som fx *Trommer · Kick* i en gruppe pr. spor; D2: intet lægges sammen).
- **Auto:** med 4 spor læser kick, snare og hihat fra Trommer, bas fra Bas og vokal fra Vokal; grunden står ved forbindelsen; Manuel kan vælges (*Samlet lyd* eller *Sporet …*).
- **Værktøj til at dele en mp3 i 4 spor er valgt: Ultimate Vocal Remover, brugt uden for MV.** Opdeling inde i MV bygges ikke nu; se `STATUS.md`. **.stem.mp4** kan ikke læses endnu (se `STATUS.md`, Senere).

## 4. Hvad der er sket fra v8.0 til v9.20

| Version | Hvad |
| --- | --- |
| v8.0–v8.2 | **Øjet** (vores navn): lys fra fremtiden ud fra den analyserede sang, cyberpunk-finish (hornhinde, hologram-tekst, neongitter, scanlinjer), 💡 Lys, blink og pupil ved drop, blokke på 30 s og Auto-tærskel til lange mix |
| v8.3 | Topbar med 5 layouts (Overblik, Show, Byg, Lyd, Figurer), Mine layouts, arbejdsfladen ligger fast mellem bjælkerne |
| v8.4 | **Kort over forbindelserne** (Mermaid, fagudtryk; hentes fra internettet første gang) og **gain-stakken** ved hver forbindelse; nye navne |
| v8.5 | **Lås vinduer** og et større skrivebord (dobbelt længde, knap til dobbelt bredde) |
| v8.6 | Mesh 3D-lyspanelet i ny stil med forklaringer og ?-knapper; **pumpede dioder** (vores navn) følger forbindelsens attack og release; bjælke med *Afslut fuld visning*; vinduer flyttes ind, hvis de ligger uden for |
| v8.7 | **Zone-tilstand** (vinduessystem A); Mapping og Generator flyttet ind som faner i Arbejdsfeltet |
| v8.8 | Ny **bundbar** i glas med **A/B-sløjfe**, afsnit og drop-nedtælling, taktslag og toneart; sidebjælke med tegnede ikoner; tilpasser sig ned til 1.280 px |
| v8.9 | **Levende baggrund** (shader, fagudtryk) bag zonerne, der lytter til bas, taktslag og toneart; *Effekter: Fuld · Let · Fra* under ☰ Mere; glød på målerne |
| v9.0 | Rettet: revne faner og små vinduer lå frit oven på zonerne |
| v9.1 | Øjet kan drejes **360°** og zoomes fra 4 til 420; *↻ Drej rundt* |
| v9.2 | **Indholdsfortegnelse** øverst i koden (81 blokke); to ubrugte rester fjernet |
| v9.3 | **Editoren ryddet op**: faner uden bogstaver, ⋯ Mere-menu, forklaringer bag *? Forklaring*, Editorens Niveau hedder *Detaljer* |
| v9.4 | Editorens egenskaber i ny stil med kort forklaring og ?-knap ved hver af de 35 almindelige egenskaber |
| v9.5 | Forklaringer til alle danserens (58) og diskokuglens (12) egenskaber; ved bevægelserne står, hvilken lyd der plejer at passe (fx Hop på kick, Hofte på bas, Hår på hihat) |
| v9.6 | Fanen **Lydkilde** (vores navn, W31) i Arbejdsfeltet i stedet for Generator: træk en lydfil ind, se navn, længde, tempo, toneart og analyse-status; en enklere generator-flade (samme lydmotor; den fulde flade, W4, åbnes med *Avanceret …*); små kort for Lyd ind og Lydkort |
| v9.7 | **Indholdsfortegnelsen** i koden lavet forfra ud fra blokkenes markeringer (85 blokke; v9.3 til v9.6 manglede); henvisningen til PLAN_FASE2.md fjernet; **testpakken** lagt i `tests/` |
| v9.8 | **Lydmotor 2** (vores navn): nye lyde (kick med klik og mætning, 808-hihat med choke, bas med sub og filter-kontur, lead med vibrato), **akkordrække** pr. genre, som bas og lead følger, **akkord-flade** (pad), betoninger og spøgelsesslag, fill hver 4. takt, rumklang, kompressor, begrænser og blød klipper. *Lydmotor: Ny · Klassisk* og *Tilbage til standard*; akkorden lige nu lyser |
| v9.9 | **Router 2.0** (vores navn; fagudtryk: graf-editor), fanen Router: kilder → Router-bokse → mål med levende linjer; VU-måler med gul tærskel, man trækker i, hysterese-bånd og peak hold; signalet før og efter kæden; Gain, Attack, Release og Hold (Fra · 50 ms til 2 s · ∞); Styrke brugt; drejeknapper til Hysterese, Kurve, Slew og Spærretid. Motoren har fået **hysterese, Hold med tid og slew** i den faste kæde; uden dem regner den præcis som før |
| v9.10 | **Spærretid for alle slag**: virker nu for alle forbindelser fra en slag-kilde (grå i Router, når kilden glider); **signaltyper** efter D2 (type: slag, glidende, rampe, valg; mappe: Rytme … Styring); M-knappen i W4 er rettet (den delte klassenavn med en tabel) |
| v9.11 | **Router 2.0 videre**: *Visning: Kompakt · Fuld* (kompakt cirka 210 px pr. boks; *Detaljer ▸* åbner én), *Sortér: D2 · Rækkefølge* med mappe-overskrifter, farve efter type, hver kilde med sit tal lige nu og "bruges af …", *Vis kilder, der ikke bruges* med ＋, *Standard-visning*; Lydkort og de 31 bånd har faste pladser i D2 |
| v9.12 | **Lydkort fjernet** (kildegruppen lk:, kortet i Lydkilde, knappen under 🎵 Musik, gruppen i Radial Mesh, Mesh 3D og Dublet, afsnittet i manualen); gamle forbindelser med lk: slås fra med en tydelig besked. Tagget `milepael-med-lydkort` er den sidste version med Lydkort |
| v9.13 | **Dobbelte målinger foldet sammen**: de 31 smalle bånd under de fire brede bånd (*▸ Vis* / *▾ Skjul*); høje bånd, Rolloff og Zero crossing rate kun på Niveau 4; **Taktslag Auto** (fil → fra filen, Lyd ind/generator → mens det spiller) med grund og Manuel; rettet type for de tre glidende hændelser; **stereo-testfil** |
| v9.14 | **Stereobredde** regnes som 1 minus korrelationen (højst 1; 0, når den ene kanal er stille), så den ikke længere stiger, når lyden bare ligger til én side (før 0,37, nu 0); manual og ordliste rettet (panorering og stereobredde stod som "findes ikke endnu") |
| v9.15 | **4 spor (stems), trin 1**: kortet i Lydkilde, 4 filer spilles som én lyd, hvert spor måles for sig, gruppe pr. spor i kildelisten, Auto for kick/snare/hihat, bas og vokal; gul besked ved forskellige længder. **Rettet:** Lyd i 3D som gemt Scene-fane stoppede scriptet ved opstart (ingen grafik; fandtes siden før v9.6). `STATUS.md` med næste skridt |
| v9.16 | (hovedchatten) **Auto i Lydkilde**: *Auto: Til/Fra* og *Kør auto-opsætning nu* flyttet (ikke kopieret) fra Lydtræk-guide (W18) til fanen Lydkilde (blokken *v9.16: AUTO I LYDKILDE*); Søg (Ctrl+K) finder topbjælkens knapper og Auto |
| v9.17 | (hovedchatten) Auto sidder i Lydkildes overskrift; **Lydkilde kan rulle** (`#w31 > .wb { overflow-y: auto }`) |
| v9.18 | **Router kan rulle** (samme fejl som Lydkilde); linjen "Nyt i …" i manualen rettet; testpakken starter med **gemte indstillinger fra seks ældre versioner**; **Hjertet trin 0** stoppet ved punkt 2 (ny three.js kræver ES-moduler; se `STATUS.md`) og **trin 1**: `docs/hjertet/FUNKTIONER.md` |
| v9.19 | **Node-editoren, trin 1 af 16** (papir v7.6, `docs/PLAN-NODE-EDITOREN.md`): fanen **Node-editor** (W33) i Arbejdsfeltet med de 9 kolonner, zoom 10–200 %, træk, piletaster og **Tilpas**, kontrolpanelet nederst; layoutet **Noder**; temaet **Warm Analog** som JSON nederst i filen (kopi af `docs/node-editoren/tema-warm-analog.json`), alle farver som `--ne-…`-variabler; skrifttyperne Orbitron, Exo 2 og IBM Plex Sans i filen. Ingen noder endnu; `maps` ændres ikke |
| v9.20 | **Node-editoren, trin 2 af 16:** reglerne vises som noder (**Lydtræk → Regel → Figur → Mål**, effekt-grupperne blå) med links i temaets farver, kun til at se på; tallene, målerne, lamperne og linjerne lever; klik vælger (hvid kant, kæden hvid) og viser sætningen, signalet over tid og indstillingerne i kontrolpanelet; træk flytter en node (huskes i `set.ne.pos`), **Placér** stiller alt igen, Shift + musehjul flytter op og ned; **Tilpas** viser nu alle noder; *Venter* under analysen og *Slukket*. `maps` ændres ikke |

## 5. Halvfærdigt og kendte fejl

- **Lydmotor 2** er målt (ingen klip, bassen følger akkorderne), men lyden er ikke lyttet til af et menneske endnu. Lydprøver laves af `tests/4-lydmotor.js`.
- **Klassisk** (den gamle lydmotor) klipper i alle genrer (peak 1,1 til 1,7). Den er ikke rettet, fordi Klassisk skal være uændret.
- **Send til editor** laver ikke tempo-profilen (SHOWPROFIL); det gør kun en lydfil. Bundbaren viser derfor ikke tempo og toneart for generatorens lyd.
- **Akkord-fladen og fill** står ikke i trinene og giver ikke klodser.
- **Router 2.0:** D2-sorteringen gælder kun Router. Mapping og de andre lister over kilder sorterer som før.
- **Router 2.0:** "den, der bruges, er markeret" er lavet som "bruges af forbindelse …" på chippen. En regel for, hvilken af to ens målinger der er bedst, findes ikke.
- **Dobbelte målinger:** besluttet og lavet i v9.13 (se afsnit 3). Ikke ændret: Spectral centroid og rolloff (følges 0,94; rolloff kun på Niveau 4) og Toneklasse og de 12 toner.
- **Taktslag Auto** og **4 spor Auto** gælder motoren (Rytme.koer). Klodser, der forudsiges fra filen, bruger kilden, som den står i forbindelsen (den samlede lyd).
- **4 spor:** sporene gemmes ikke i cachen og ikke i pladserne; de skal vælges igen efter genstart. Lydfil-kortet i Lydkilde viser ikke de 4 spor (kortet *4 spor* gør). Hvert spor får kun de 14 lydtræk, ikke Analysen (de 31 bånd, toner osv.); den har kun den samlede lyd.
- **Opstartsfejl (rettet i v9.15):** Lyd i 3D som gemt Scene-fane stoppede scriptet. Testpakken starter nu programmet med hver Scene-fane gemt og (fra v9.18) med gemte indstillinger fra seks ældre versioner; den test fanger fejlen i v9.14.
- **three.js er r128** (2021), lagt ind som almindeligt script. En ny three.js med WebGPURenderer kræver ES-moduler. **Valgt (trin 0): A** — Mesh 3D og Øjet bliver på r128; den nye three.js lægges ved siden af, når Routeren bygges (three.js indlæses så to gange). Skift til **B** (esbuild, én three.js), når Mesh 3D og Øjet flyttes til den nye renderer. Se `STATUS.md`. WebGPU kan ikke testes i testbrowseren (intet grafikkort).
- **Tidslinje og Analyse** i Arbejdsfeltet ruller ikke, men deres indhold er ikke højere end fanen (tjekket i v9.18). Værksted og Opsætninger er ikke tjekket.
- **Tags fra Claude Code:** sessionens forbindelse til GitHub må sende gem og grene op, men ikke lave eller slette tags (og ikke slette grene). Tagget `milepael-med-lydkort` blev derfor lavet på GitHub under *Releases*; det peger på `87fcc93` (v9.11). Grenen `v9_11-med-lydkort` peger på det samme gem og kan slettes, når du vil.
- **Router 2.0:** Auto og Manuel kan ses i boksen, men skiftes stadig under Opsætninger (Auto-tærskel gælder alle forbindelser).
- **Hysterese, Hold med tid og Slew** virker ikke på klods-spor, og Mapping har ingen skydere til dem (Mapping viser en linje, når de er sat).
- **Spærretid for alle slag** (v9.10): standarden er 120 ms for alle forbindelser, så to anslag fra en slag-kilde tættere end 120 ms bliver til ét. Ukendte kilder får typen glidende i mappen Klang.
- **Den levende baggrund** er meget diskret, fordi zonerne dækker næsten hele skærmen. Valget mellem at lade den være diskret eller gøre flere flader gennemsigtige er ikke truffet.
- **Fuld visning:** bjælken *Afslut fuld visning* er kun testet ved måling, ikke ved skærmbillede (testbrowseren kan ikke). Der er et sikkerhedstjek hvert halve sekund, der laver bjælken, hvis skiftet blev overset.
- **Kort over forbindelserne** kræver internet første gang (henter Mermaid 11.17.2 fra jsDelivr); uden internet vises koden.
- **Editoren:** fanen *Lag* har stadig mange kontroller, når *Detaljer* står højt. Det er egenskaberne selv; ikke en fejl.
- **Unity-udgaven af Mesh 3D (v2.1, et separat projekt)** er aldrig testet i Unity.
- **Node-editoren (v9.20):** en regels plads huskes ud fra *kilde|mål|nummer*, fordi forbindelserne ikke har et fast id endnu (kommer, når reglerne kan ændres). Ændrer man kilde eller mål i Mapping, glemmes den regels plads. Pladserne gælder for alle opsætninger, ikke pr. plads (A–T). Handling/Egenskab læses ud fra målet (figurens egenskab = Egenskab). Figur-styrke og trim vises ikke (trin 9).
- **Node-editoren (v9.19):** Orbitron har ikke Ø, ø og ·; de tegn vises med IBM Plex Sans. I standard-layoutet (Overblik) er Node-editoren lav; layoutet *Noder* gør den stor. Programmets fælles ✓ efter et klik vises også på Node-editorens knapper.

## 6. Planen: det næste

### Næste opgaver
| Opgave | Hvorfor |
| --- | --- |
| **Node-editoren** (vores navn; hed før Routeren og Hjertet): papiret er `NODE-EDITOREN.md` (v7.6, billeder og tema i `docs/node-editoren/`); planen er `docs/PLAN-NODE-EDITOREN.md` med svarene. **Trin 1 og 2 er lavet (v9.19, v9.20). Næste: trin 3 (v9.21), Lydkilde, FFT og analyser vises**, når brugeren skriver "kør" | papiret er færdigt; intet er bygget. Funktionslisten ligger nu i `docs/arkiv/hjertet/FUNKTIONER.md`, og ingen funktion fra den må forsvinde |
| **three.js (trin 0):** valgt **A**; intet bygges nu | den nye three.js lægges ved siden af r128, når Node-editoren skal bygges; senere B (se `STATUS.md`) |

**Router-boksen** (bygget i v9.9) for én forbindelse: kilden med angivelse af, hvor den er målt, *Manuel* eller *Auto*; en **VU-måler** (fagudtryk) med tærsklen som en gul streg, man trækker i, **hysterese** (fagudtryk: to tærskler, så det ikke flimrer) som et svagt bånd under stregen og et topmærke (peak hold); signalet over tid før og efter kæden; skyderne **Attack**, **Release** og **Hold** (én skyder: Fra · 50 ms til 2 s · ∞, hvor ∞ står fast til næste lyd); "Styrke brugt" med gain-stakken; og de avancerede ting (kurve, slew, spærretid) som små drejeknapper. Kæden i fast rækkefølge: vend om → tærskel med hysterese → kurve → gain → attack og release → hold → slew.

### MV2 (sat ned i fart)
Claude MV2 er en planlagt ombygning omkring **én signalgraf** (én datamodel for alle forbindelser). Den er sat ned i fart; vi arbejder videre på MV. To beslutninger, der også gælder for Router 2.0:
- **Sortering af signaler (valg K1, vores navn): D2.** Mapper efter musik (Rytme, Tone og harmoni, Klang, Dynamik, Frekvens, Rum, Struktur, Styring) og farve efter type (slag, glidende, rampe, valg). **Intet lægges sammen:** hver måling (fx Bas fra Lydtræk og bas fra de 31 bånd) har sin egen linje med sit tal lige nu; den, der bruges, er markeret, og der står hvorfor.
- **Spærretid for alle slag**, grå hvor den ikke virker; release vises grå, når Hold står på ∞ (begge lavet i v9.9 og v9.10).

### Idé-kassen (senere)
Startskærm med demosang; Show- og Studie-tilstand; eksportér video; spilleliste og MIDI-læring; bro (OSC eller WebSocket, fagudtryk) til andre programmer; HPSS (fagudtryk: adskil trommer og toner) i analysen; figurer på et skelet med inspiration fra Cascadeur (stil og proportioner).
