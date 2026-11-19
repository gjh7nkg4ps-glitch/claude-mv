# STATUS · Claude MV

## Ny brugerflade (P8.2, 13. november 2026)

Planen er `PLAN-NY-BRUGERFLADE.md` (P8.2), godkendt af brugeren 13. november; alle valg er afgjort. Den gælder foran `docs/PLAN-NODE-EDITOREN.md`, hvor de to er uenige.

- **Fase 0 (kortlægning) er lavet:** `docs/KORTLAEGNING.md`. Ingen kode er ændret; programmet er stadig **v9.42**. Hele testpakken bestod på v9.42 (411 tjek, 0 fejl; Lydmotor 2 bestod).
- **Brugeren har svaret på fase 0 (13. november):** svarene på fjerne-listen står i planens afsnit 3.1. Morph Pad fjernes helt, også i koden; Lyd i 3D, Idé-galleri, Generator (fuld), Lydlag, Detektion og flere fjernes; ingen af de gamle visninger fjernes, før matrixen er prøvet med musik (valg V3). Planen er rettet til P8.2.
- **Fase 1, trin 1 er lavet (v9.43):** Morph Pad er fjernet helt; den fælles indgang `Regler` og et fast id på hver regel er bygget. Test: `tests/38-faelles-indgang.js`. P7.7 punkt 3b (id) er dermed lavet; punkt 3a (Fortryd for resten) er næste trin.
- **Fase 1, trin 2 er lavet (v9.44):** ét Fortryd for alt (trim, effekt-grupper, Samlet styrke, Normalisering). Test: `tests/39-fortryd-for-alt.js`. P7.7 punkt 3 er dermed helt lavet.
- **Fase 1, trin 3, første bid er lavet (v9.45):** 9 steder bruger nu `Regler`. Test: `tests/40-flytning-1.js`.
- **Fase 1, trin 3, anden bid er lavet (v9.46):** Editorens 11 handlinger bruger nu `Regler` (ny: `Regler.sletHvor`). Test: `tests/41-flytning-2.js`.
- **Fase 1, trin 3, tredje bid er lavet (v9.47):** de 9 steder, der skifter hele listen, bruger `Regler.erstat(liste, true)`. Test: `tests/42-flytning-3.js`. Auto-mapping er ikke prøvet for sig i test 42 (kræver en analyseret sang).
- **Fase 1, trin 3, fjerde bid er lavet (v9.48):** 15 hjælpere bruger `Regler` med senere=true; 20 steder skriver stadig direkte i `maps` (9 mangler at blive flyttet, 11 skal ikke flyttes). Rettet: Slet og Vis i Editorens Koblinger (docking opfangede klikket siden v9.36). Test: `tests/43-flytning-4.js`.
- **Fase 1, trin 3 er færdigt (v9.49):** de sidste 9 steder bruger `Regler`; de 11, der er tilbage, skal ikke flyttes. Test: `tests/44-flytning-5.js`.
- **Fase 1 er færdig (v9.50):** Node-editoren lytter på `Regler`; Mappings døde tegning er fjernet. Test: `tests/45-node-editor-lytter.js`. Næste: fase 2 (matrixen).
- **Fase 2, trin 2a er lavet (v9.51):** matrixen kan vise og vælge (Noder · Matrix i Node-editorens værktøjslinje). Test: `tests/46-matrix-se.js`.
- **Fase 2, trin 2b er lavet (v9.52):** klik i en tom celle laver en regel; træk ændrer styrken; Delete, M, piletaster, Enter. Test: `tests/47-matrix-lav-og-ret.js`.
- **Fase 2, trin 2c er lavet (v9.53):** + lydtræk og + mål med søgning, fold en figur sammen, Brugte · Alle; rettet en fejl, hvor de skjulte noder blev bygget om ved hvert billede. Test: `tests/48-matrix-find-rundt.js`. Næste: 2d (samme vilkår).
- **Rettet i v9.54 (brugerens video 15. november):** en ny regel til en figurs egenskab giver nu egenskaben et udsving (`neUdsving`), så figuren bevæger sig; gult ! i matrixen på regler uden udsving. Test: `tests/49-udsving.js`.
- **Fase 2 er færdig (v9.55):** trin 2d (titel og gult ! på regel-noderne, tekst ryddet), Matrix (gammel) fjernet, knapperne fra de andre vinduer og Håndtag i billedet fjernet fra Node-editoren. Test: `tests/50-samme-vilkaar.js`.
- **Fase 3, trin 3a er lavet (v9.56):** markér flere celler, samme styrke og tærskel på alle, Ctrl+C og Ctrl+V i matrixen. Test: `tests/51-matrix-kopier.js`. 
- **Pakke 1 (resten af fase 3), ny arbejdsrytme fra 16. november: én pakke pr. "kør".** 3b er lavet (v9.57): træk med Ctrl for at kopiere en celle, og indsæt kun indstillingerne (Ctrl+Shift+V). Test: `tests/52-matrix-traek-kopi.js`. 3c er lavet (v9.58): knappen ⋯ ved figurens navn kopierer alle figurens regler til en anden figur og spejler venstre og højre arm. Test: `tests/53-matrix-figur-kopi.js`. 3d er lavet (v9.59): styrke-kæden i kanten af matrixen (trim på rækken, styrke ved figuren, Størst · Sum · Gang på kolonnen, Samlet styrke i hjørnet), og skyderne Trim og Styrke i kontrolpanelet er fjernet. Test: `tests/54-matrix-styrke-kaede.js`. **Pakke 1 og fase 3 er færdige.** Næste "kør": pakke 2 (fase 4, Forslag i stedet for Auto).
- **v9.60 (rettelser efter brugerens prøve af pakke 1):** Ctrl + klik markerer igen sikkert; linjen under matrixen står der altid med tydelige knapper (Markér celler: Til/Fra, Markér alle, Kopiér, Indsæt, Indsæt indstillinger, Spejl, Slå fra / til, Slet, Ryd markering, Største · Læg sammen · Gang). Test: `tests/55-matrix-knapper.js`. **Spurgt brugeren:** hvad der er buggy ved Spejl, om Node-editoren er helt tom, og hvilke 5 opstillinger af noderne der skal bygges.
- **v9.61:** Node-editoren har 6 opstillinger (Opstilling ▾: Kolonner, Bred, Luftig, Meget luftig, Kompakt, Kæmpe), kolonnenavne der følger zoom og kan trækkes, og en sikring mod en tom flade (besked med Vis alle noder). Matrixen: et klik går ikke tabt, når tabellen tegnes om. Test: `tests/56-opstillinger.js`. **Ikke fundet:** hvorfor Node-editoren var helt tom hos brugeren.
- **v9.62:** lange sange (over 10 minutter) normaliseres i stykker på 2 minutter; visningen Tidslinje viser det højeste tal pr. tidsrum; 2 egne opstillinger af noderne; linjerne tegnes med WebGL2. Test: `tests/57-lang-sang.js`. Ikke prøvet med brugerens sang på 74 minutter.
- **Pakke 2 (fase 4), trin 4a (v9.63):** Foreslå regler: forslag som stiplede celler i matrixen (ja eller nej, én ad gangen eller alle); Auto-mapping: Til/Fra og Kør Auto-mapping nu er væk. Test: `tests/58-forslag.js`.
- **Pakke 2, trin 4b (v9.64):** Auto-kobl, danserens Standardforbindelser, Tilfældigt, skabeloner, Tilføj morgenstjerne og klodsbanens tomme spor giver forslag i stedet for at skrive regler; Random alt: skift automatisk og tre Fortryd-knapper er væk. Lav show er ikke lagt om. Test: `tests/59-forslag-andre.js`.
- **Pakke 2, trin 4c (v9.65):** panelet Automatik (seks linjer, Tilbage til standard) og Gem reglerne som et sæt / Brug et sæt i ⋯ ved figurens navn. Test: `tests/60-automatik.js`. **Pakke 2 er afleveret.** Åbent: Lav show som forslag; visnings-automatik til Indstillinger (5c).
- **v9.66 (rettelser efter prøven af pakke 2):** tjek af sangens analyse mod lyden (analyserer igen, hvis de ikke passer; Analysér igen i Automatik), Bred/Luftig/Meget luftig spredt ud over hele feltet, to bekræftelser ved gem oven i Min opstilling, Lav show som forslag. Test: `tests/61-analyse-tjek.js`. Årsagen til den lange sang uden lys er ikke fundet. Linjernes tre tilstande (brugerens idé) står i CLAUDE.md afsnit 5 og tages op senere.
- **Pakke 4 (fase 5, resten) er bygget 17. november:** **v9.71 (5b)** én linje øverst: sidebjælken, bundbjælken, de 6 gamle layout-knapper, Mine layouts, Niveau, Enkel tilstand, Zoner, Bredt skrivebord og vinduesnumre er væk; ☰ Mere ▾ med det, der hører til arbejdsområdet; 💾 Gem ▾; ↶ ↷; docking låst som standard. Test: `tests/66-en-linje.js`. **v9.72 (5c)** Warm Analog i hele programmet (Mørkt og Lyst kan vælges), Størrelse (85–130 %), Indstillinger samlet ét sted (Visning og Ydelse). Test: `tests/67-tema-og-indstillinger.js`. **Fase 5 er færdig.** Brugeren prøver: fra programmet åbner, til pigerne danser til egen sang; tæl klik.
- **v9.73 (17. november):** Nulstil alt genstarter programmet i startilstanden (før: ingen zoner, topbjælken kunne ikke trykkes). Test: `tests/68-nulstil-alt.js`.
- **Pakke 5 (fase 6), trin 6a (v9.74):** 2 · Scene har Figurer til venstre (nyt vindue: vælg, øje, omdøb, + Ny figur med skabelonerne, Figur-generatoren nederst), scenen i midten og Egenskaber (Editoren uden figurliste og fane Ny figur) til højre; figurerne trækkes direkte i Live preview. Morgenstjernen og Levende er uændrede. Test: `tests/69-figurer-og-egenskaber.js`. **Trin 6b (v9.75):** Vis i matrix (Egenskaber og Figurer) åbner matrixen for kun den figur (chippen Kun: navn · × alle); fanen Koblinger, Adfærd, Detaljer og kilde-listen med ⚡ ved hver egenskab er væk; en knap ved hver egenskab viser reglens kilde eller + regel. Test: `tests/70-vis-i-matrix.js`. **Pakke 5 er bygget** (6c venter på brugerens skitse).
- **Trin S2 (v9.76):** vinduet Sang (Lydkilde til venstre; fanerne Sang · Spor · Avanceret med Tidslinje, EQ, Analyse, EQ+, Shows tempoknapper, 4 spor og Indstillinger for analysen flyttet ind; Automatik siger "Ændres i Sang"). Fem vinduer blev til ét. Test: `tests/71-sang-vinduet.js`. 
- **Trin S3 (v9.77):** Lyd over tid (Sang → Avanceret): hele sangen på én tidsakse med rækkerne Afsnit, Bølgeform, Spektrogram, Taktslag, Toner, Stereo og lydtræk med tærskler; Node-editorens visning Tidslinje er fjernet. Test: `tests/72-lyd-over-tid.js`. Brugeren 18. november: "kør alle undtagen figur" → S4, S5, S6 og pakke 6 bygges.
- **Trin S4 (v9.78):** kortet Niveau (V/H med topmærke og klip, LUFS integreret, LRA, topværdi, RMS, crest factor, klip for hele sangen; rækken Lydstyrke i Lyd over tid). Test: `tests/73-niveau.js`.
- **Trin S5 (v9.79):** kortet Stereo (goniometer lige nu; stereobredde, panorering og faselighed fra analysen med Brug i en regel og Vis over tid). Test: `tests/74-stereo.js`.
- **Trin S6 (v9.80):** fanen Spor med én række pr. spor (fil, bølgeform, niveau, M og S); M/S ændrer kun det, man hører; Niveau og Lyd over tid måler stadig den samlede lyd. Test: `tests/75-spor-ms.js`. **Sang og analyse (S0–S6) er færdig.** Næste: pakke 6 (7a, 7b, 7c).
- **Pakke 6, trin 7a (v9.81):** Lyd i 3D, Idé-galleri, Generator (fuld), Lydlag, Audit og Detektion er væk fra skærmen (koden ligger til 7c); lydlag-regler slås fra med en besked; scene-nodens knapper er væk. Lydtræk-guide er beholdt (Tilslut MIDI med flere findes kun dér). Test: `tests/76-oprydning-7a.js`.
- **Pakke 6, trin 7b (v9.82):** Klodsbane: Til · Fra i Live preview og under Mere i 2 · Scene; fra som standard ved en helt ny start; gemte opsætninger beholder banen. Test: `tests/77-klodsbane.js`.
- **v9.69 (ydelse, 17. november):** tre ting, der kørte uden grund, er rettet (dockingens sløjfe ved hvert billede, Sikker visnings pixel-læsning ved hvert billede, værktøjstip på alle knapper ved hver ændring), og Kvalitet har fået *Skarphed (Live preview)*: Fuld · Højst 2× · 1×, som regulatoren må sænke. Test: `tests/64-ydelse.js`. Ikke målt på brugerens maskine.
- **v9.70 (trin S1, 17. november):** analysen regnes i baggrunds-tråde med præcis de samme tal; sangen kan bruges efter trin 1; flueben pr. del af analysen i Automatik. Test: `tests/65-traade.js`. Målt i testmaskinen (3 tråde, under belastning): 5 minutters lyd 25 s → 10 s. **Farten på brugerens 74 minutter er ikke målt** (bed om tiden). 4 spor regnes stadig i samme tråd.
- **Rettelser 17. november (v9.68, uden for pakkerne):** tydelig bjælke og Annullér under analysen; fejlen i Tidslinjen ved hvert billede er rettet; Node-editoren zoomer ud til 2 %; Meget luftig dobbelt så luftig, Kolonner lavet om, Bred fem felter bred. Test: `tests/63-analyse-bjaelke.js`. **Ny plan til brugeren og hovedchatten:** `docs/PLAN-SANG-OG-ANALYSE.md` (udkast 1; intet bygget ud over S0). Analysens fart er ikke forbedret endnu (trin S1 i den plan).
- **Pakke 3, trin 5a (v9.67):** de fire arbejdsområder 1 · Sang, 2 · Scene, 3 · Regler og 4 · Show først i topbjælken, tasterne 1 til 4. Det gamle ligger der stadig. Test: `tests/62-arbejdsomraader.js`. **STOP:** brugeren skal se opdelingen, før pakke 4 bygges.
- **Venter på brugeren:** prøv v9.59 med musik (giv Pige på stangen de samme regler som Lyshåret pige), og skriv "kør pakke 2". Stadig "ved ikke": Ikke i brug (parkér), Kort over forbindelserne og Lydmotor Klassisk. Ikke afgjort: i hvilken fase Morph Pad fjernes (Code foreslår fase 1).
- **P7.7 punkt 3:** et fast id på hver regel er bygget i v9.43. Fortryd for resten (trim, effekt-gruppernes styrke, øje, Slå fra, Normalisering, Samlet styrke) er ikke bygget endnu.
- **Regler fra nu af:** ét trin pr. "kør"; brugeren prøver hver version med musik; hvert trin fjerner noget (tal før og efter); funktioner må forsvinde (funktionslisten gælder ikke mere); ingen udvikler-tekst på skærmen; hver version prøves i 1920 × 1080, 2560 × 1440 og 3840 × 2160.

Kort status over det, der er i gang. Planen i det hele står i `CLAUDE.md`, afsnit 6.

## Node-editoren (hed før Routeren og Hjertet)

Papiret er færdigt: `NODE-EDITOREN.md` (v7.6, 6. november 2026). Billederne og temaet ligger i `docs/node-editoren/`. Planen står i `docs/PLAN-NODE-EDITOREN.md`, og svarene er skrevet ind. Der bygges ét trin ad gangen.

- **Trin 1 lavet (v9.19):** fanen Node-editor i Arbejdsfeltet med de 9 kolonner, zoom, træk og Tilpas, kontrolpanelet, layoutet Noder, temaet og skrifttyperne i filen. Test: `tests/14-node-editor.js`.
- **Trin 2 lavet (v9.20):** reglerne vises som noder (Lydtræk → Regel → Figur → Mål), kun se; levende tal og linjer; vælg, flyt, Placér; kontrolpanelet med sætning, signal og indstillinger. Test: `tests/15-node-editor-regler.js`.
- **Trin 3 lavet (v9.21):** Lydkilde (Lydfil, 4 spor, Lyd ind, Generator; MIDI, Morph Pad og Tastatur), FFT · hurtig og fin, de 9 analyser med alle udgange. Test: `tests/16-node-editor-analyser.js`.
- **Trin 4 lavet (v9.22):** en regel kan rettes på noden og i kontrolpanelet; Fortryd; Normalisering og Samlet styrke i værktøjslinjen. Test: `tests/17-node-editor-ret.js`.
- **Trin 5 lavet (v9.23):** lav regler ved at trække links (Tilføj-listen, menuen med figurens mål), genveje, Slå fra/til, Slet. Test: `tests/18-node-editor-lav.js`.
- **Trin 6 lavet (v9.24):** + Tilføj i kolonnerne, Ctrl+K med Tilføj node og Knapper, løse noder, Ryd tomme mål. Test: `tests/19-node-editor-tilfoej.js`.
- **Trin 7 lavet (v9.25):** Ikke i brug: parkér kilder, analyser og lydtræk; det, der hænger under, sover. Test: `tests/20-node-editor-parker.js`.
- **Trin 8 lavet (v9.26):** flere regler på ét mål: Største, Læg sammen, Gang (m.komb). Test: `tests/21-node-editor-komb.js`.
- **Trin 9 lavet (v9.27):** trim på lydtræk og figur-styrke i motoren; Styrke brugt med figuren. Test: `tests/22-node-editor-trim.js`.
- **Trin 10 lavet (v9.28):** Lær i reglens kontrolpanel og Adaptiv tærskels indstillinger. Test: `tests/23-node-editor-laer.js`.
- **Trin 11 lavet (v9.29):** skabeloner (6 faste og egne) i Ctrl+K, + Tilføj og figurens kontrolpanel. Test: `tests/24-node-editor-skabelon.js`.
- **Trin 12 lavet (v9.30):** scene-noder med levende billede og Sluk; øje og Slå fra på figurer og effekt-grupper; Baggrund ▾. Test: `tests/25-node-editor-scene.js`.
- **Trin 13 lavet (v9.31):** lys uden tekst under 20 % (fjernet igen i v9.38), Kun valgt kæde, Dæmp og tastaturet. Test: `tests/26-node-editor-tastatur.js`.
- **Trin 14 lavet (v9.32):** linjerne i TSL med den nye three.js ved siden af r128 (WebGPU, ellers WebGL2, ellers Canvas 2D). Test: `tests/27-node-editor-tsl.js`.
- **Trin 15 lavet (v9.33):** nye navne i hele programmet og · gammel på de fire gamle vinduer. Test: `tests/28-node-editor-navne.js`.
- **Trin 16 lavet (v9.34):** funktionsliste-tjekket: tabellen og testen; Kort over forbindelserne i Node-editorens Ctrl+K. Test: `tests/29-funktionsliste.js`.
- **v9.35:** de fire gamle vinduer (Mapping, Router 2.0, Dublet, Routing-overblik) er slettet; det unikke er flyttet til Opsætninger og Værksted. Test: `tests/30-gamle-vinduer-slettet.js`.
- **v9.36:** docking (vinduessystem C): zoner med faner, træk mellem zoner og til kanter, streger, ⤢ Stor, ⛶ Fuld skærm, ＋, ×, ⋯ og ↺ Standard. Test: `tests/31-docking.js`.
- **v9.37:** rettet, at noderne ikke kunne trækkes, når der var markeret tekst (browserens træk-og-slip). Test: `tests/32-traek-uden-markering.js`.
- **v9.38:** altid skarpt: Live preview i skærmens fulde opløsning, Øjet skarpt i fuld skærm på 4K, noderne bliver ikke til lys og står skarpt ved al zoom; roligere drejeknapper (400 px, sidelæns, musehjul); ingen three.js-advarsel. Test: `tests/33-altid-skarpt.js`.
- **v9.39:** knapperne fra Lydkilde, Opsætninger og Værksted i Node-editorens kontrolpanel og Ctrl+K; funktionslisten 98 af 114; rettet WebGPU-fejl ved skjult fane. Test: `tests/34-knapper-i-node-editoren.js`.
- **v9.40:** oprydning: Router-boksens kode og tegneløkke, de frie vinduers rester (v7.0, v7.1, v9.0) og Dublets tastatur i manualen. Test: `tests/35-oprydning.js`.
- **v9.41:** de 10 visninger fra Routing-overblik i Node-editoren (Visning ▾). Test: `tests/36-visninger.js`.
- **v9.42:** D2 på lærredet (Sortér) og Håndtag i billedet; funktionslisten er færdig (106 af 106). Test: `tests/37-d2-og-haandtag.js`.
- **Næste: du vælger.** Funktionslisten er færdig. Små huller: Fortryd for trim og effekt-grupper, slet/omdøb skabeloner.

### Trin 0 · three.js med WebGPU: valgt A (4. november 2026)

- **Valgt: A.** Mesh 3D og Øjet bliver på three.js **r128**. Den nye three.js (`three.webgpu.js` og `three.core.js`, fast version) lægges ved siden af i sit eget `<script type="module">`, **når Routeren skal bygges**. **Der bygges intet nu.**
- Med A indlæses three.js to gange (r128 og den nye), og de to kan ikke dele noget. Det er accepteret, indtil Mesh 3D og Øjet flyttes (se *Senere*).

Baggrund (fra v9.18, da trin 0 stoppede ved punkt 2):


**1. Sådan er det i dag**
- MV bruger **three.js r128** (fra 2021). Den ligger **inde i HTML-filen** i det første `<script>` (cirka 612 KB) som en almindelig script-fil (fagudtryk: UMD/global build), der laver `window.THREE`.
- I samme script ligger efterbehandlingen (fagudtryk: postprocessing) fra three.js' gamle `examples/js`: EffectComposer, RenderPass, ShaderPass, UnrealBloomPass (glød, fagudtryk: bloom), CopyShader og LuminosityHighPassShader.
- Kun **Mesh 3D** og **Øjet** bruger three.js (WebGLRenderer, egne GLSL-shaders og bloom). MV's kode bruger `THREE.` 189 steder, men **først når Mesh 3D eller Øjet åbnes**. Testet: uden three.js starter MV uden fejl, og Mesh 3D og Øjet skriver bare, at 3D-biblioteket mangler.

**2. Den nye three.js kræver ES-moduler: derfor er trin 0 stoppet**
- Den nyeste er **0.187.0** (r187, 30. oktober 2026). Jeg har tjekket pakken **0.186.1** fra npm. Siden r160 er der **ingen almindelig script-udgave** mere; kun ES-moduler (fagudtryk: filer med `import`/`export`):

| Fil | WebGPURenderer | WebGLRenderer | Slags |
| --- | --- | --- | --- |
| `three.webgpu.js` (2,3 MB) | ja, med automatisk skift til WebGL2 | nej | ES-modul, henter `./three.core.js` |
| `three.module.js` (0,7 MB) | nej | ja | ES-modul, henter `./three.core.js` |
| `three.core.js` (1,5 MB) | – | – | den fælles kerne |
| `three.cjs` | – | – | 631 byte, kun en henvisning |

- Efterbehandlingen (EffectComposer, UnrealBloomPass …) findes også kun som ES-moduler.
- **Intet er ændret.** Punkt 3 til 9 (før- og efterbilleder, opdatering, beviset med WebGPURenderer) er ikke lavet.

**Hvor meget der skal ændres (du vælger)**

| Valg | Sådan | For | Imod |
| --- | --- | --- | --- |
| **A · Behold r128, læg den nye ved siden af** (**valgt**) | Mesh 3D og Øjet bliver på r128 uændret. Den nye three.js (kun `three.webgpu.js` + `three.core.js`) lægges i et eget `<script type="module">` til Routeren senere | ingen risiko for Mesh 3D og Øjet; intet byggeværktøj | **three.js indlæses to gange** (r128 og r186); filen bliver cirka 3,7 MB større; ting fra den ene (fx en geometri) kan ikke bruges i den anden |
| **B · Skift alt til den nye, samlet til én fil** (senere, se *Senere*) | Et byggeværktøj (fagudtryk: bundler, fx esbuild) samler `three.module.js`, `three.webgpu.js` og efterbehandlingen til **ét** modul, der lægges ind i HTML-filen og laver `window.THREE`. Ingen importmap | **én** three.js; WebGLRenderer og WebGPURenderer deler kernen; MV's opstart behøver ikke ændres, fordi `THREE` først bruges, når Mesh 3D og Øjet åbnes | et byggetrin i arbejdsgangen; filen bliver cirka 3 MB større; Mesh 3D og Øjet skal rettes (se listen nedenfor) og testes for farver og lysstyrke |
| **C · Importmap med data-adresser** | hver three.js-fil lægges ind som `data:`-adresse i en importmap (fagudtryk) | intet byggeværktøj | filerne skal skrives om (deres `import './three.core.js'`); 33 % større (base64); mest skrøbeligt |

**Det skal rettes ved B** (fundet i koden, ikke prøvet):
- `WebGLMultisampleRenderTarget` (2 steder) findes ikke mere; den hedder `WebGLRenderTarget` med `samples`.
- **Farver:** fra r152 er farvestyring (fagudtryk: color management) slået til, og billedet laves i sRGB. Mesh 3D og Øjet bliver sandsynligvis lysere eller anderledes i farverne, indtil det er sat op som før (fx `OutputPass` eller den gamle farveindstilling).
- **Lys:** lysstyrken på lys er ændret i r155, men MV bruger **ingen lys** (ingen PointLight, AmbientLight eller DirectionalLight), så det rammer ikke MV.
- WebGL1 er fjernet i r163; MV bruger allerede WebGL2 i browseren.

**8. WebGPURenderer og WebGLRenderer side om side**
- De kan godt bruges samtidig, men hver på **sit eget lærred** (fagudtryk: canvas). WebGPURenderer skal startes med `await renderer.init()`.
- **Med B:** three.js indlæses **kun én gang**. `three.webgpu.js` og `three.module.js` deler `three.core.js`, så geometrier, farver og vektorer kan bruges i begge.
- **Med A:** three.js indlæses **to gange** (r128 og r186), og de to kan ikke dele noget.
- WebGPURenderer kan ikke tegne MV's GLSL-shaders (`ShaderMaterial`) eller den gamle bloom; de skal skrives om til TSL (fagudtryk). Derfor bliver Mesh 3D og Øjet på WebGLRenderer.

**Kan ikke testes her:** WebGPU kræver et rigtigt grafikkort. Testbrowseren har intet (SwiftShader), så WebGPURenderer ville skifte til WebGL2.

### Trin 1 · Funktionslisten: lavet (v9.18), gennemgås i hovedchatten

- `docs/arkiv/hjertet/FUNKTIONER.md` (flyttet fra `docs/hjertet/` 6. november 2026): én tabel pr. del (Dublet, Router 2.0, Routing-overblik, Mapping, Lydkilde) og en liste over funktioner, der findes flere steder, og ord, der betyder flere ting.
- Listen er gennemgået i hovedchatten og er grundlaget for papiret `NODE-EDITOREN.md`.

## 4 spor (stems)

### Lavet (v9.15)

- **Trin 1:** kortet *4 spor (stems)* i fanen Lydkilde. Man giver programmet 4 filer, der er delt op på forhånd: **Trommer, Bas, Vokal og Resten**.
- Sporene lægges sammen til én lyd, der spilles og analyseres som en almindelig fil. Hvert spor måles for sig (14 lydtræk pr. spor, fx *Trommer · Kick*).
- **Auto:** kick, snare og hihat læses fra Trommer, bas fra Bas og vokal fra Vokal, når der er 4 spor.

### Besluttet: værktøj til at dele en mp3 i 4 spor

- **Værktøjet er valgt: Ultimate Vocal Remover, brugt uden for MV.** Man deler sangen i 4 filer der og trækker dem ind i kortet *4 spor (stems)*.
- **Opdeling inde i MV bygges ikke nu.**

## Senere

### three.js: skift til B (én three.js)

- **Når Mesh 3D og Øjet flyttes til den nye renderer**, skiftes der fra A til **B**: et byggeværktøj (fagudtryk: bundler, **esbuild**) samler `three.module.js`, `three.webgpu.js` og efterbehandlingen til **ét** modul i HTML-filen. Så indlæses three.js kun **én gang**, og WebGLRenderer og WebGPURenderer deler kernen.
- Det, der skal rettes ved skiftet, står under Trin 0 ovenfor (`WebGLMultisampleRenderTarget`, farvestyring). Mesh 3D's og Øjets GLSL-shaders og bloom skal skrives om til TSL (fagudtryk), hvis de også skal køre i WebGPURenderer.

### .stem.mp4 (Native Instruments' stems-format)

- **Hvad det er:** én MP4-fil med 5 lydspor: den samlede lyd og 4 spor (trommer, bas, andet/synths og vokal), alle i AAC (fagudtryk).
- **Hvorfor det ikke virker nu:** browserens almindelige afkodning (`decodeAudioData`) læser kun det første lydspor, altså den samlede lyd. Programmet siger det med en gul besked, hvis man prøver.
- **Det kan godt lade sig gøre uden store biblioteker:** en lille MP4-læser (fagudtryk: demuxer), der finder de 5 lydspor i filen, og browserens WebCodecs `AudioDecoder` til AAC. Anslået cirka 300 linjer. Virker i Chrome og Edge; i Firefox og Safari er det usikkert.
- **Indtil da:** del filen i 4 med ffmpeg (sporene ligger som nr. 1 til 4 efter den samlede lyd):

```bash
ffmpeg -i sang.stem.mp4 -map 0:a:1 trommer.wav -map 0:a:2 bas.wav -map 0:a:3 resten.wav -map 0:a:4 vokal.wav
```
