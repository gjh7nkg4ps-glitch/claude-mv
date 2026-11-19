# Svar på P8.14 punkt 5 · 19. november 2026

Skrevet af Claude Code efter brugerens besked P8.14 (`docs/arkiv/BESKED-TIL-CODE-19-nov-P8_14.txt`). Svarene gælder v9.102. Tal, der er målt, står med "målt"; resten er skøn og står med "skøn".

## a) De 4 spor i dag

| Spørgsmål | Svar |
| --- | --- |
| Hvilke lydtræk måles på et spor? | De **14 lydtræk** fra trin 1 af analysen (`analyze`): Bas, Mid, Høj-mid, Brilliance, Styrke (RMS), Flux, Kick, Snare, Hihat, Vokal, Centroid, Anslag, Tonehøjde-ændring og Stereobredde (det, der står i `BANDS`). Kilderne hedder `stem:trommer:kick` og vises som *Trommer · Kick*. |
| Hvad måles ikke på et spor? | Trin 2 (`analyzeAna`): de 31 smalle bånd, toneklasserne (chroma), tonehøjde, klang (rolloff, zero crossing), stereo (panorering, faselighed), taktslag fra filen, afsnit og drop. Dem har kun den samlede lyd. |
| Regnes de i baggrunds-trådene? | **Nej.** Kun den samlede lyd går gennem trådene (S1, v9.70). Hvert spor regnes i hovedtråden med den gamle `analyze` (`stemBrug`), ét spor ad gangen, så siden fryser imens. |
| Hvor lang tid tager det? | Målt i testmaskinen (uden grafikkort, 4 kerner): trin 1 i hovedtråden ≈ 1,4 s pr. minut lyd. **4 minutter: cirka 6 s pr. spor, 30 s for den samlede lyd + 4 spor.** **74 minutter: cirka 1 min 45 s pr. spor, 8–9 minutter i alt**, og siden fryser imens (skøn; ikke målt på 74 minutter). |
| Hukommelse | Hvert spor ligger afkodet i hukommelsen som 32-bit tal: 4 minutter stereo ved 48 kHz ≈ 92 MB pr. spor, 5 lyde (4 spor + blandingen) ≈ 460 MB. **74 minutter ≈ 1,7 GB pr. spor, 8,5 GB for 5**: det kan browseren ikke holde (én fane kan typisk have 2–4 GB). Din sang på 74 minutter virker i dag som **én** fil (1,7 GB). Med 4 spor på 74 minutter må sporene afkodes i mindre opløsning (mono, 22 kHz: 0,4 GB pr. spor) eller i stykker (WebCodecs `AudioDecoder`, der kan læse filen bid for bid), og kun blandingen må ligge i fuld kvalitet til afspilning. |

## b) Hele analysen på hvert spor

Det, der skal til: `stemBrug` sender hvert spor gennem `anaAlt` (trådene, S1) i stedet for `analyze`, og hvert spor får sine egne `ana:`-rækker (fx `stem:trommer:ana:ls12`). Node-editoren, matrixen og D2 skal kende de nye kilder (i dag kender de kun `stem:SPOR:LYDTRÆK` for de 14).

| | 4 minutter | 74 minutter |
| --- | --- | --- |
| Tid i trådene (målt på den samlede lyd: 5 minutter = 10 s med 3 tråde) | ≈ 8 s pr. spor, **≈ 40 s for 5 lyde** med 3 tråde; cirka det halve på din maskine med 8 tråde (skøn) | ≈ 2,5 min pr. spor, **≈ 12 min for 5 lyde** med 3 tråde; 5–6 min med 8 tråde (skøn) |
| Analysens tal (14 + 84 rækker pr. lyd) | ≈ 8 MB pr. spor | ≈ 150 MB pr. spor, 750 MB for 5 (skøn: 382 000 rammer × 98 rækker × 4 byte) |
| Cachen i browseren (IndexedDB) | ≈ 3 MB pr. spor | ≈ 56 MB pr. spor (målt for én lyd), 280 MB for 5 |
| Den afkodede lyd | se a): 460 MB | se a): 8,5 GB, **kan ikke lade sig gøre uden mindre opløsning eller stykker** |

Skønnet for 74 minutter forudsætter, at hukommelsen til den afkodede lyd løses først (a).

## c) Lydformater og grænser

- MV kalder browserens egen afkodning (`decodeAudioData`) med `accept="audio/*"`. Det, din browser kan afkode, kan MV læse. **Chrome og Edge:** mp3, wav, flac, ogg (Vorbis og Opus), aac og m4a (det første lydspor i en mp4), webm. **Firefox:** det samme, aac og m4a kan svigte på nogle maskiner. **Safari:** mp3, wav, aac, flac; ikke ogg. `.stem.mp4` læses som det første spor (den samlede lyd), se *Senere*.
- **Grænser i MV:** ingen i koden. **Grænser i browseren:** filen læses hel ind (én `ArrayBuffer` på højst 2 GB), og den afkodede lyd fylder længde × 48 000 × kanaler × 4 byte (74 minutter stereo ≈ 1,7 GB). En fane har typisk 2–4 GB i alt. Din sang på 74 minutter er derfor tæt på loftet som én fil; 4 spor på den længde kræver en anden vej (se a).
- Analysen kører ved AudioContextens samplerate (oftest 48 kHz på Windows). Alle filer samples om til den af browseren, så mp3 på 44,1 kHz og wav på 96 kHz behandles ens.

## d) Det, et nyt analyse-vindue kan bygge på, og det åbne

**Findes (alt i vinduet Analyse, v9.76–v9.101):**

| Del | Hvad den kan | Kode |
| --- | --- | --- |
| Lyd over tid (S3) | hele sangen på én tidsakse: afsnit, bølgeform, spektrogram, taktslag, toner, stereo, lydstyrke, lydtræk med tærskler; zoom og hop | `lotByg`, `lotTegn`, `lotSerie` |
| Niveau (S4) | V/H med topmærke og klip; LUFS, LRA, topværdi, RMS, crest factor for hele sangen (BS.1770) | `nivByg`, `nivStart`, `NIV.res` |
| Stereo (S5) | goniometer lige nu; stereobredde, panorering, faselighed fra analysen; Brug i en regel | `steByg`, `STE_TAL` |
| Spor (S6) | én række pr. spor: fil, bølgeform, niveau, M og S (kun det, man hører); Vælg 4 filer … og Vælg en mappe … (v9.101) | `stemKort`, `stemSaetFlere` |
| Detektion (v9.95) | tap K og S i takt, hit-rate i procent, falske alarmer, bedste tærskel, klodsernes timing | `renderTune`, `score`, `marks` |
| Analysen i tråde (S1) | trin 1 og 2 i baggrunds-tråde; bjælke med tid og Annullér; flueben pr. del; Analysér igen; tjek af analysen mod lyden (`anaTjek`) | `anaAlt`, `atKoer`, `ANA` |
| Lange sange (v9.62) | normalisering i stykker på 2 minutter | `normLokalF` |
| Spektrum og Spektrum+ | de 14 lydtræk som søjler med tærskler; 31 bånd, vandfald, lyt til ét bånd | `drawEQ`, `drawEQP` |
| Toner og klang | log-spektrum, toneklasser, tonehøjde | `drawAna` |
| Indstillinger for analysen | Normalisering, Lange sange, Adaptiv tærskel, Analysér igen, flueben | `sgIndstTegn` |

**Åbent i `docs/PLAN-SANG-OG-ANALYSE.md`:** S7 HPSS (adskil trommer og toner), S8 spilleliste, `.stem.mp4`, de 4 spor i trådene og med hele analysen (b), **sikkerhed pr. lydtræk** (● sikker, ▲ ok, ! usikker fra P8.14 punkt 2; findes ikke endnu, kræver et facit som Detektion eller generatoren), bedre metoder til kick/snare/hihat (i dag: båndenergi med flux og tærskel), et lokalt modul med AI, og hvilken samplerate analysen skal køre ved.

## e) Radial Mesh

- **Det passer.** Baggrunden er en tegnet radial gradient fra `#16202c` i midten til `#0b0f14` i kanten (`drawMesh`, `createRadialGradient`). Gløden er Canvas 2D's `shadowBlur` (21 steder i Radial Mesh), ikke rigtig bloom: den gør alt lysere lige omkring stregen, også baggrunden, og den er dyr at tegne.
- **Hvorfor den er lille i fuld skærm:** ringens radius er sat til **40 % af den korteste side** (`meshGeom`: `R = min(W, H) · 0,4`), så ringen fylder 80 % af højden, og resten er plads til navnene udenom. På en bred skærm (16:9) bruges bredden ikke. Oveni skaleres tegningen ned til højst 3 gange (`meshResize`: `z = min(3, min(bredde, højde) / 480)`), så på 2160 px højde regnes der med 720 logiske px; det gør ikke ringen mindre, men teksten relativt større. Fra v9.99 er vinduets overskrift og bjælken væk i fuld skærm, så ringen har hele skærmen.
- **Et separat Radial Mesh-værksted med rigtig bloom i WebGL kræver:** (1) en kopi af Radial Mesh, der tegner de samme data (ring, lydtræk-noder, effekt-noder, forbindelser og det rejsende lys) med den nye three.js, som allerede ligger i filen (0.186.1; Node-editorens linjer bruger den i TSL), i sit eget vindue med sort baggrund; (2) en **bloom-pass** (fagudtryk: tærskel → sløring i flere trin → lægges oven på), så kun det lyse gløder: three.js' `BloomNode` findes som tillæg (`three/addons/tsl/display/BloomNode.js`, cirka 15 KB) og skal lægges ind i filen; (3) indstillinger for tærskel, styrke og radius, og baggrunde (sort, stjerner, galakser som billeder eller en lille shader); (4) det rejsende lys skrives om til en shader, så det ikke forringes (det originale Radial Mesh røres ikke). Skøn: **3 til 4 versioner**: først en kopi, der kun kan ses på (ingen træk-og-slip; forbindelser laves i originalen eller i matrixen), så bloom og indstillinger, så baggrunde, til sidst træk-og-slip, hvis du vil have det i værkstedet. WebGPU kan ikke prøves i testbrowseren; WebGL2 kan.

## f) Spor-deling inde i browseren

- **Demucs (htdemucs) kan køre i browseren** med ONNX Runtime Web; der findes færdige forsøg (fx *demucs.cpp* og *demucs-web* i WebAssembly). Modellen fylder **cirka 80 MB** (160 MB i fuld præcision) og skal hentes én gang og ligge i browserens cache. Tid for en sang på 4 minutter (skøn, ikke målt): **WebAssembly på CPU'en: 5 til 15 minutter**; **WebGPU (ORT Webs WebGPU-udgave) på et RTX 2070: 1 til 3 minutter**, og ORT Web mangler stadig nogle af de operationer, Demucs bruger (STFT), så en del skal regnes i JavaScript ved siden af. Hukommelse: 1 til 2 GB i fanen.
- **RoFormer (BS-RoFormer, Mel-RoFormer; dem UVR's bedste modeller bruger):** modellerne er 100 til 400 MB og er transformere, der er 3 til 10 gange tungere end Demucs. I browseren: **10 til 30 minutter for 4 minutter på WebGPU** (skøn) og 2 til 4 GB hukommelse, så fanen kan gå ned. Ikke praktisk i dag.
- **Det samme som et lokalt modul** (Python + PyTorch med CUDA, det UVR selv gør): htdemucs **10 til 20 sekunder** for 4 minutter på et RTX 2070, Mel-RoFormer **1 til 2 minutter**. Det er den vej, der kan betale sig (jf. P8.16): et lille program på pc'en, som MV taler med over HTTP på localhost, og som kan installeres med ét klik; MV virker uden.

## g) Andet, I bør vide, før analyse-vinduet planlægges

1. **Facit først.** "Mere sikkert" kan kun måles med et facit: Detektion (dine tryk), generatoren (mønsteret er kendt, så kick og snare kendes præcist) og 4 spor (trommesporet er næsten et facit for kick/snare/hihat). Byg et lille måle-sæt (3–5 sange + generatoren) før nye metoder, så hver metode får et tal.
- **Samplerate og hop.** Analysen regner i rammer på 2048 prøver med hop 1024 (`H=1024`, både i `analyze` og i baggrunds-trådene) ved 48 kHz, cirka 21 ms pr. ramme (rettet efter P8.20 punkt 5; før stod der 512 og 10,7 ms); 21,5 Hz pr. trin, så under 50 Hz er det groft. Bedre bas-opløsning kræver større FFT (8192 bruges allerede til toner og de 31 bånd) eller en ekstra lav-frekvens-analyse.
- **Kick, snare og hihat i dag** er båndenergi med flux og tærskel (ingen model). Det første, der vil give "tydeligt mere sikkert", er sandsynligvis en onset-detektor pr. bånd med adaptiv tærskel og spærretid (fagudtryk: spectral flux onset detection), målt mod facit, før der bruges AI.
- **74 minutter** sætter grænser for alt med spor (hukommelse, se a og b). Beslut, om 4 spor skal virke på hele sange, eller kun på sange under cirka 15 minutter, før det bygges.
- **Cachen** gemmer kun den samlede lyd; sporene skal vælges igen efter genstart. Et nyt analyse-vindue bør gemme sporenes analyse med en nøgle pr. filnavn og længde.
- **Trådene** (S1) kender kun ét lydsignal ad gangen; de skal lære at tage flere, hvis sporene skal regnes samtidig.
- **WebCodecs** (`AudioDecoder`) findes i Chrome og Edge og kan afkode bid for bid uden at holde hele sangen i hukommelsen; det er vejen til 74 minutter med spor og til `.stem.mp4`.
