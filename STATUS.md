# STATUS · Claude MV

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
- **Trin 13 lavet (v9.31):** lys uden tekst under 20 %, Kun valgt kæde, Dæmp og tastaturet. Test: `tests/26-node-editor-tastatur.js`.
- **Trin 14 lavet (v9.32):** linjerne i TSL med den nye three.js ved siden af r128 (WebGPU, ellers WebGL2, ellers Canvas 2D). Test: `tests/27-node-editor-tsl.js`.
- **Næste: trin 15 (v9.33), nye navne og · gammel**

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
