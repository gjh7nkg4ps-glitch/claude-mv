# Testpakken · Claude MV

Testene følger den faste rækkefølge i `CLAUDE.md` afsnit 2 (*Test før aflevering*).
De bruger Node og Playwright (fagudtryk: testbrowser). Testen af 4 spor bruger også Python med numpy til at lave test-sporene.

## Sådan kører du dem

Alle test på den nyeste `claude-mv-v*.html` i repoets rod:

```bash
node tests/koer-alle.js
```

En bestemt fil:

```bash
node tests/koer-alle.js claude-mv-v9_7.html
```

Hurtigt, uden analyse af en lydfil (de forudindstillinger, der kræver en sang, springes over):

```bash
node tests/koer-alle.js --uden-lyd
```

Hver test kan også køres alene, fx `node tests/2-indhold.js`.
Filnavnet skrives altid øverst, så vi ser, at det er den rigtige fil, der testes.

## Hvad der testes

| Fil | Trin | Hvad |
| --- | --- | --- |
| `1-syntaks.js` | 1 · Syntaks | `node --check` på hvert `<script>` i filen |
| `2-indhold.js` | 2 · Indhold | versionen er ens i filnavn, `<title>`, versionsmærke og manual (*Nyt i v…* og `man-vXY`); indholdsfortegnelsen passer med blokkenes markeringer; ingen henvisning til `PLAN_FASE2` i koden eller manualen |
| `3-browser.js` | 3 · Opstart | ingen `pageerror` og ingen konsolfejl; fra v9.15 også opstart med hver Scene-fane gemt som valgt |
| | 3 · Arbejdsfeltet | ingen gammel Generator-fane; Generator-vinduet (W4) findes og åbnes med *Avanceret …* i Lydkilde |
| | 3 · Lyd | en testlydfil analyseres, og tempoet findes til cirka 120 BPM |
| | 3 · Fast testpakke | alle forudindstillinger (`FORINDST`, `brugFor`) indlæses uden fejl · alle layouts (`lay3Anvend`; 6 fra v9.19) uden overlap mellem synlige vinduer · Mesh 3D og Øjet starter · gem og hent plads A (`slotSave`/`slotLoad`) · tilføj og fjern en forbindelse |
| `4-lydmotor.js` | 4 · Det nye i v9.8 | Lydmotor 2: alle 7 genrer med Ny og Klassisk uden at spille (ingen klip, ikke stille, forskellige); betoninger og spøgelsesslag; akkorden lyser, takten tæller, Fill i takt 4; skift motor og *Tilbage til standard*; *Send til editor*. Gemmer lydprøver i `tests/ud/lyd/` |
| `5-router.js` | 4 · Det nye i v9.9 | Router 2.0: motoren regner præcis som før uden de nye trin; hysterese, Hold 300 ms og Slew 2/s måles; de virker ikke på klods-spor; fanen, boksene, linjerne og chipsene; træk i VU-måleren, drejeknap, Hold ∞ gør Release grå, Spærretid grå, ↺ Standard, Mapping-linjen, + Ny og ✕; levende med en lydfil |
| `6-spaerretid.js` | 4 · Det nye i v9.10 | Spærretid for alle slag: præcis som før med spærretid 0, for glidende kilder og for klods-spor; to anslag 50 ms fra hinanden bliver til ét; signaltyperne (D2); Spærretid grå i Router for glidende kilder; M-knappen i W4 er smal |
| `7-router-d2.js` | 4 · Det nye i v9.11 | Router kompakt og D2: standard Kompakt og D2; kompakte bokse og Detaljer ▸; Fuld; kildernes rækkefølge og mappe-overskrifter efter D2; Rækkefølge; farve efter type; "bruges af …"; Lydkort og de 31 bånd har faste pladser; Vis kilder, der ikke bruges, og ＋; Standard-visning; tallene lever med lyd |
| `8-lydkort-fjernet.js` | 4 · Det nye i v9.12 | Lydkort er fjernet: ingen lk:-kilder, intet kort i Lydkilde, ingen knap, ingen funktioner, intet afsnit i manualen; en gammel plads med lk:-kilde og lk:-port hentes uden fejl, forbindelserne slås fra, og beskeden står i statuslinjen, Mapping og Router; det samme ved opstart; afspilning uden fejl |
| `9-kilder-og-stereo.js` | 4 · Det nye i v9.13 | kildelisterne pr. Niveau (smalle bånd foldet sammen under de brede bånd; høje bånd, Rolloff og Zero crossing rate kun på Niveau 4); fold ud og ind uden at ændre forbindelsen; Router-listen; typerne for de glidende hændelser; taktslag Auto og Manuel (uden lyd, generator, fil) og hvad motoren læser; panorering, stereobredde og faselighed med stereo-testfilen |
| `10-stereobredde.js` | 4 · Det nye i v9.14 | Stereobredde = 1 minus korrelationen, højst 1: samme lyd i begge kanaler = 0, kun i venstre = 0, forskellige lyde = høj, svagere højre = 0, modfase = 1, stilhed og en næsten stille kanal = 0; panorering uændret; i programmet med stereo-testfilen; navn og manual |
| `11-stems.js` | 4 · Det nye i v9.15 | 4 spor (stems): kortet i Lydkilde, de 4 filer og deres længder, den samlede lyd; hver måling reagerer kun på sit eget spor (test-spor fra `lav-stems.py`, der spiller på hver sin tid); kildelisten med en gruppe pr. spor; Auto og Manuel; gul besked ved forskellige længder; besked ved .stem.mp4; en almindelig fil fjerner sporene |
| `lav-stems.py` | hjælp | laver 4 test-spor med **numpy** (trommer 0–20 s, bas 5–25 s, vokal 10–30 s, resten 15–30 s); `--kort-bas` gør bassen 1 s kortere |
| `12-gamle-indstillinger.js` | **fast del** (fra v9.18) | starter programmet med gemte indstillinger fra syv ældre versioner (`gamle-indstillinger/`): opstart uden fejl, scriptet kører til ende, plads A og B hentes, Router, Mesh 3D og Øjet åbner |
| `13-rul-i-arbejdsfelt.js` | 4 · Det nye i v9.18 | alle faner i Arbejdsfeltet ruller, når indholdet er højere end fanen (Niveau 2 og 4); linjen "Nyt i …" i manualen |
| `18-node-editor-lav.js` | 4 · Det nye i v9.23 | Node-editoren, trin 5 (papirets forløb 1 og 6): ingen farvekoder; træk fra et lydtræk til et tomt sted → Tilføj-listen viser kun Regel · Handling og Egenskab → reglen lægges, hvor man slap, og sover uden for maps → træk til en figur → menuen med mål → reglen i maps og Mapping med Router's standard; fra en analyses række; slet en ny regel; lydtræk på en figur; skift mål; Gate via gate-porten; ny kilde; Esc; Slå fra/til; Slet og Fortryd; Delete |
| `17-node-editor-ret.js` | 4 · Det nye i v9.22 | Node-editoren, trin 4: ingen farvekoder; de samme tal i Node-editoren og i Router giver præcis den samme forbindelse og samme regning; hver skyder, drejeknap, Vend om, Gate, Gate-tærskel, Taktslag og Standard ændrer det rigtige felt; noden følger med (Vendt, Gate, sætning); træk tærsklen og styrken på noden; beskeden med Fortryd; Fortryd/Gentag med knapper og Ctrl+Z/Ctrl+Shift+Z; Handling/Egenskab og klemmen mest; Normalisering og Samlet styrke |
| `16-node-editor-analyser.js` | 4 · Det nye i v9.21 | Node-editoren, trin 3: ingen farvekoder; uden lyd Ikke tilgængelig og Sover; alle 94 udgange fra papirets tabel 5.4 som porte; fold ▸; lydtræk får link fra den rigtige analyse og række; MIDI, Morph Pad og Tastatur; generator (Stereo og Afsnit ikke tilgængelige, spektret lever); mono-testfil (Venter med procent, navn, 120 BPM, hop i bølgeformen, levende målere, søjler, lamper og spektrum); stereo-testfil (V og H forskellige); 4 spor (rækker, porte, spor-links, lever); gamle indstillinger fra v9.18 |
| `15-node-editor-regler.js` | 4 · Det nye i v9.20 | Node-editoren, trin 2: ingen farvekoder i blokken; for alle forudindstillinger én Regel pr. forbindelse, én Lydtræk pr. kilde (også gate), én Mål pr. mål, de rigtige links, intet overlap, `maps` uændret; klik, sætning og Esc; flyt en node og genstart; Placér; Slukket og Gate; med en lydfil: Venter under analysen og levende tal, lamper og linjer; gamle indstillinger fra v9.18 |
| `14-node-editor.js` | 4 · Det nye i v9.19 | Node-editoren, trin 1: temaet i filen = `docs/node-editoren/tema-warm-analog.json`; ingen farvekoder i Node-editorens kode og stil; de 6 skrifttyper i filen; fanen og de 9 kolonner i temaets farver og bredder; zoom (musehjul, knapper, taster, 10–200 %), træk og Tilpas; visningen huskes efter genstart; layoutet Noder med og uden zone-tilstand; `maps` ændres ikke; gamle indstillinger fra v9.18 |
| `gamle-indstillinger/` | data | localStorage fra v9.4, v9.6, v9.8, v9.11, v9.13, v9.15 og v9.18 (fra v9.19), lavet ved at bruge de gamle versioner fra git-historikken (Niveau 4, forudindstillinger, plads A og B, layout Byg, generator-sang, Lyd i 3D som Scene-fane, Lydkort-forbindelse, hysterese/hold/slew, taktslag Manuel, Router-visning). Hver fil siger, hvilke trin der blev gjort |
| `testlyd.js` | hjælp | laver testlydfilen: 30 s ved 120 BPM med kick, hihat, bas og en akkord i a-mol. `testlyd.stereo(fil)` laver den i stereo i tre dele: mono, venstre, højre og bred |
| `faelles.js` | hjælp | finder programfilen og læser dens `<script>`-dele |
| `koer-alle.js` | | kører det hele i rækkefølge: 1, 2, 3 og så alle test af det nye (4, 5 …) |

**Skærmbilleder** gemmes i `tests/ud/` (opstart, hvert layout, Mesh 3D, Øjet). Mappen kommer ikke med i repoet.

## Det tester pakken ikke

- **Trin 4 · Det nye**: hver version får sin egen testfil (`4-…`, `5-…`), der bliver i pakken, så det nye også testes senere.
- Om lyden *lyder* godt. Testene måler lyden (klip, styrke, frekvenser), men et menneske skal lytte til lydprøverne i `tests/ud/lyd/`.
- *Afslut fuld visning*: testbrowseren kan ikke tage skærmbilleder af fuld skærm.
- Om billederne *ser* rigtige ud. Det kræver, at et menneske (eller Claude) kigger på skærmbillederne.

## Kendte faldgruber

- Uden grafikkort (SwiftShader, fagudtryk) er 3D meget langsomt. Mesh 3D og Øjet får 10 sekunder til at starte.
- Testbrowseren tegner kun 2 til 7 billeder i sekundet (uden grafikkort), så korte slag kan gå tabt mellem billederne. Testene af levende tal bruger derfor kilder, der glider, og venter på, at visningen er bygget om, i stedet for faste pauser.
- Analysen af testlydfilen tog cirka 3 sekunder i Claude Codes skybrowser. På en langsommere maskine kan den tage over et minut; testen venter op til 4 minutter.
