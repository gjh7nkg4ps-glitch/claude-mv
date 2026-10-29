# CLAUDE.md · Claude MV

Version 1.7 · 29. oktober 2026 · gælder fra Claude MV v9.12 · skrevet af Claude (chat på claude.ai) som overlevering til Claude Code.

Denne fil fortæller det, der **ikke** står i koden: hvad programmet er til, hvordan jeg vil arbejde, hvad vi har besluttet, og hvad der er halvfærdigt. Læs koden selv for resten. Øverst i hovedscriptet står en indholdsfortegnelse over alle blokke.

---

## 1. Hvad Claude MV er

Claude MV er et personligt værksted, der gør musik til levende billeder. En lydfil (oftest mp3) analyseres, og målingerne (fx bas, kick, hihat, taktslag, afsnit og drop) styrer figurer, lys og 3D-grafik gennem **forbindelser** (fagudtryk: mapping). Det er bygget sammen med Claude over mange versioner.

- Hele programmet er **én HTML-fil** (cirka 1,8 MB), der kører i browseren uden server og uden internet. Three.js r128 og dets glød-værktøjer (MIT) ligger inde i filen.
- Vigtigste dele: **Scenen** med Live preview (dansende figurer), Radial Mesh, Mesh 3D, Øjet (vores navn: lys fra fremtiden), EQ og EQ+; **Editoren** (figurer og deres egenskaber); **Arbejdsfeltet** (vores navn) med fanerne Mapping, Tidslinje, Analyse, Lydkilde og Router.
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
  1. i **filnavnet**: `claude-mv-v9_13.html`
  2. i **programmet**: `<title>Claude MV v9.13 (Rytme-editor)</title>` og det lille versionsmærke (søg efter `hver gang filen samles til udgivelse.">`)
  3. i **svaret** til mig
- Efter v9.9 kommer **v9.10**, v9.11 og så videre. **v10.0** venter vi med, til jeg siger til.
- Skriv også et **afsnit i manualen**: et nyt `<h3 id="man-v913">` lige over det forrige, og opdater linjen **"Nyt i v…"** øverst i manualen.

### GitHub
- Hver ny version gemmes som en **ny fil med nyt navn** (fx `claude-mv-v9_13.html`), og **den forrige fil slettes i samme gem** (commit, fagudtryk). Så ligger der altid kun den nyeste i repoet, og de gamle findes i historikken.
- Skriv gemmebeskeden på dansk med versionsnummeret først, fx `Claude MV v9.13: startskærm med demosang`.
- Opdater denne fil (CLAUDE.md), når noget i afsnit 3 til 6 ændrer sig.

### Test før aflevering
- **Test, før du afleverer**, og vis mig skærmbilleder af det nye.
- **Vær ærlig** om, hvad der ikke er testet, eller hvad der ikke kan lade sig gøre.
- **Testpakken ligger i `tests/`** og kører alle trin med `node tests/koer-alle.js` (se `tests/README.md`). Trin 4 (det nye) får sin egen testfil pr. version, fx `tests/4-lydmotor.js`, som bliver i pakken.
- Den faste rækkefølge, vi har brugt:
  1. **Syntaks:** kør `node --check` på hvert `<script>` i filen. Et opstartstjek alene fanger ikke syntaksfejl.
  2. **Opstart:** åbn filen i en testbrowser (Playwright, fagudtryk) og tjek, at der ingen fejl er (`pageerror` og konsolfejl). Giv altid tjekket det rigtige filnavn; vi har en gang testet en gammel fil i flere versioner uden at opdage det.
  3. **Fast testpakke:** alle forudindstillinger (`FORINDST`, kør hver med `brugFor(id,true)`) uden fejl; alle 5 layouts (`lay3Anvend`) uden overlap mellem synlige vinduer; Mesh 3D og Øjet starter; gem og hent en plads (`slotSave`/`slotLoad`); tilføj og fjern en forbindelse.
  4. **Det nye:** en test af netop det, der er ændret, plus et skærmbillede.
- **Kendte faldgruber i testbrowseren:** uden grafikkort (SwiftShader, fagudtryk) er 3D meget langsomt; analysen af en lydfil tager over et minut (uden SwiftShader cirka 11 sekunder); skærmbilleder af fuld skærm virker ikke. Testpakken laver selv en testlydfil (30 s ved 120 BPM, `tests/testlyd.js`).

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

### Analyse og mapping
- **Auto-tærskel** flytter tærsklen efter sangen. Den **gain-stak** (fagudtryk: gain staging), der bruges, er: forbindelsens gain × Samlet styrke × Følsomhed (kun Enkel tilstand) × Afsnits-dynamik (kun med Show og en analyseret fil). Den vises ved hver forbindelse som "Styrke brugt".
- Hovedanalysen bruger FFT 2048 (21,5 Hz pr. trin); tone-analysen og de 31 bånd bruger 8192. Under 50 Hz er det groft.

### Lydkort er fjernet (v9.12)
- **Lydkort** (kildegruppen `lk:`, en `.json`-fil fra Lydkosmos) er fjernet helt, fordi det gjorde tingene for komplicerede: endnu en kildegruppe med 17 kilder, der målte det samme som Lydtræk og Analysen (bas, kick, beat, RMS …), en ekstra fil, der skulle passe til sangen, og et ekstra kort og en knap.
- Den sidste version med Lydkort er v9.11, mærket med tagget **`milepael-med-lydkort`** (commit `87fcc93`).
- Gemte opsætninger med en `lk:`-kilde (eller `lk:`-port) går ikke i stykker: forbindelsen bliver stående, slås fra, giver 0, og der står en gul besked i statuslinjen, Mapping og Router (blokken *FJERNEDE KILDER*). Tilføj ikke Lydkort igen uden at spørge.

## 4. Hvad der er sket fra v8.0 til v9.12

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

## 5. Halvfærdigt og kendte fejl

- **Lydmotor 2** er målt (ingen klip, bassen følger akkorderne), men lyden er ikke lyttet til af et menneske endnu. Lydprøver laves af `tests/4-lydmotor.js`.
- **Klassisk** (den gamle lydmotor) klipper i alle genrer (peak 1,1 til 1,7). Den er ikke rettet, fordi Klassisk skal være uændret.
- **Send til editor** laver ikke tempo-profilen (SHOWPROFIL); det gør kun en lydfil. Bundbaren viser derfor ikke tempo og toneart for generatorens lyd.
- **Akkord-fladen og fill** står ikke i trinene og giver ikke klodser.
- **Router 2.0:** D2-sorteringen gælder kun Router. Mapping og de andre lister over kilder sorterer som før.
- **Router 2.0:** "den, der bruges, er markeret" er lavet som "bruges af forbindelse …" på chippen. En regel for, hvilken af to ens målinger der er bedst, findes ikke.
- **Dobbelte målinger** (talt i v9.12, ikke ændret): fx Bas (Lydtræk) og de 11 bas-bånd af de 31 (følges 0,88), Brilliance og 6–16 kHz-båndene (0,88), Spectral centroid og rolloff (0,94), Taktslag fra Analysen og Hændelse · taktslag (samme slag, målt to steder), Toneklasse og de 12 toner. Panorering og Stereobredde var altid 0 på testfilen (mono). Listen står i svaret fra v9.12-sessionen; der er ikke besluttet noget.
- **Tagget `milepael-med-lydkort`** er sat lokalt, men kunne ikke sendes op til GitHub fra Claude Code-sessionen (forbindelsen blev afbrudt hver gang; almindelige gem virker). Lav det på GitHub, hvis det ikke findes: commit `87fcc93`.
- **Router 2.0:** Auto og Manuel kan ses i boksen, men skiftes stadig under Opsætninger (Auto-tærskel gælder alle forbindelser).
- **Hysterese, Hold med tid og Slew** virker ikke på klods-spor, og Mapping har ingen skydere til dem (Mapping viser en linje, når de er sat).
- **Spærretid for alle slag** (v9.10): standarden er 120 ms for alle forbindelser, så to anslag fra en slag-kilde tættere end 120 ms bliver til ét. Ukendte kilder får typen glidende i mappen Klang.
- **Den levende baggrund** er meget diskret, fordi zonerne dækker næsten hele skærmen. Valget mellem at lade den være diskret eller gøre flere flader gennemsigtige er ikke truffet.
- **Fuld visning:** bjælken *Afslut fuld visning* er kun testet ved måling, ikke ved skærmbillede (testbrowseren kan ikke). Der er et sikkerhedstjek hvert halve sekund, der laver bjælken, hvis skiftet blev overset.
- **Kort over forbindelserne** kræver internet første gang (henter Mermaid 11.17.2 fra jsDelivr); uden internet vises koden.
- **Editoren:** fanen *Lag* har stadig mange kontroller, når *Detaljer* står højt. Det er egenskaberne selv; ikke en fejl.
- **Unity-udgaven af Mesh 3D (v2.1, et separat projekt)** er aldrig testet i Unity.

## 6. Planen: det næste

### Næste opgaver
| Opgave | Hvorfor |
| --- | --- |
| *(ingen faste opgaver lige nu)* | vælg fra idé-kassen nedenfor |

**Router-boksen** (bygget i v9.9) for én forbindelse: kilden med angivelse af, hvor den er målt, *Manuel* eller *Auto*; en **VU-måler** (fagudtryk) med tærsklen som en gul streg, man trækker i, **hysterese** (fagudtryk: to tærskler, så det ikke flimrer) som et svagt bånd under stregen og et topmærke (peak hold); signalet over tid før og efter kæden; skyderne **Attack**, **Release** og **Hold** (én skyder: Fra · 50 ms til 2 s · ∞, hvor ∞ står fast til næste lyd); "Styrke brugt" med gain-stakken; og de avancerede ting (kurve, slew, spærretid) som små drejeknapper. Kæden i fast rækkefølge: vend om → tærskel med hysterese → kurve → gain → attack og release → hold → slew.

### MV2 (sat ned i fart)
Claude MV2 er en planlagt ombygning omkring **én signalgraf** (én datamodel for alle forbindelser). Den er sat ned i fart; vi arbejder videre på MV. To beslutninger, der også gælder for Router 2.0:
- **Sortering af signaler (valg K1, vores navn): D2.** Mapper efter musik (Rytme, Tone og harmoni, Klang, Dynamik, Frekvens, Rum, Struktur, Styring) og farve efter type (slag, glidende, rampe, valg). **Intet lægges sammen:** hver måling (fx Bas fra Lydtræk og bas fra de 31 bånd) har sin egen linje med sit tal lige nu; den, der bruges, er markeret, og der står hvorfor.
- **Spærretid for alle slag**, grå hvor den ikke virker; release vises grå, når Hold står på ∞ (begge lavet i v9.9 og v9.10).

### Idé-kassen (senere)
Startskærm med demosang; Show- og Studie-tilstand; eksportér video; spilleliste og MIDI-læring; bro (OSC eller WebSocket, fagudtryk) til andre programmer; HPSS (fagudtryk: adskil trommer og toner) i analysen; figurer på et skelet med inspiration fra Cascadeur (stil og proportioner).
