# PLAN · SANG OG ANALYSE · P8.4 (kun det, der ikke er bygget)

*Kortet ned 20. november 2026 (P8.23). Den fulde plan (billederne, Lyd over tid, layoutet, farten, alle trin, spørgsmål og svar) ligger uændret i `docs/arkiv/PLAN-SANG-OG-ANALYSE-fuld-P8_20.md`. S0–S6 er bygget (v9.68–v9.80): vinduet Analyse med fanerne Sang · Spor · Avanceret, Lyd over tid, Niveau, Stereo, Spor med M/S, Detektion, analysen i baggrunds-tråde.*

**Grundreglen (P8.16):** analysen er programmets hjerte. **Brugerens valg (P8.24, 20. november):** a) A0 først · b) spor kun under cirka 15 minutter for nu · c) facit er generatoren · d) cirkel med tal · e) installation med ét klik undersøges (`docs/LOKALT-MODUL-INSTALLATION.md`). **A0 Analyse sikkerhed (v9.110), A1 hele analysen på sporene (v9.113), Testlyd (v9.115), Rigtige trommer (v9.116), A3 første del (v9.117–v9.118), testlyden hørbar (v9.119), svage slag (v9.120) fasens sikkerhed (v9.123) taktgitteret fra Trommer-sporet med 4 spor (v9.124) og A2 Kræv sikkerhed (v9.125) er bygget.** Rækkefølgen derefter (brugerens valg: **A3 før A2**), ét trin ad gangen: **A3** bedre slag: **første del bygget (v9.117):** kick i lineær skala, taktslaget ½ slag, takt 1 ud fra kick, snare og skift i klang. **Resten af A3:** fasens sikkerhed er kalibreret (v9.123: takternes enighed med en målt rampe; Rigtige trommer måler hele mixet med toner, Takt 1 47 → 69); prøvet og ikke med: snaren til den halve takt (snaren reagerer på den åbne hihat; Testlyd Taktslag 49 → 33, Rigtige trommer kun trommer 85 → 77); den lineære kick i korte sange med et meget stille afsnit er ikke målt (idé: stigningen delt med et langsomt niveau over 2–4 s); taktslaget i Hip-hop og Techno med bas (hele lyden 0; trommerne alene 98); med 4 spor: ét taktgitter fra Trommer-sporet (**bygget i v9.124**: Testlyd Taktslag 49 → 78 og Takt 1 31 → 73; Rigtige trommer 81 → 85 og 69 → 72; uden spor er Hip-hop, Techno og Breakbeat med bas stadig forkerte); tempo det halve (BebopJazz og Gospel 222 → 110); Snare (høj-mid kan ikke skelne snare fra hihat og kickets klik; klap ligger i mid; uden svage slag 36 / 57, så de fleste almindelige slag overses også) · **A2** sikkerhedsgrænse og enighed i reglerne (**bygget i v9.125**: Kræv sikkerhed pr. regel, pr. øjeblik for Tonehøjde og Takt 1, ellers Analyse sikkerhed; enighed = Gate; Foreslå regler +0,1; skravering i Lyd over tid; mangler: sikkerhed pr. hændelse for slagene, så grænsen også virker pr. øjeblik på Kick, Snare og Hihat) · **A4** Lydtidslinjen · **A5–A6** det lokale modul · **A8** spor bid for bid (WebCodecs) på lange sange. **Rest fra A0:** samme cirkel på lydtræk-noderne i Node-editoren og i Foreslå regler; takturet "mens det spiller", akkorder og afsnit har intet facit endnu; mål også med brugerens egne regler og Adaptiv tærskel. Planen er hovedchattens "Den nye analyse P8.19" (A0–A8). Hovedchatten har også skemaet **"Alle lyde og alle metoder P8.22"** (https://claude.ai/artifact/VKviSHX9KRu9f8Rw4Z9QJU), som samtalen bygger på.

## Flere slags facit til Analyse sikkerhed (til planen, brugeren 20. november; ikke bygget)

Brugerens rapport fra v9.113 (Chrome 157, Windows) viste: tempoet findes ens på brugerens pc og i testbrowseren, tonerne er ens, men fasen (hvilket slag der er nr. 1) og Kick er forskellige, fordi browseren regner generatorens lyd lidt forskelligt, og analysen ligger tæt på vippepunktet. Tal fra samme pc kan sammenlignes; tal fra to pc'er kan ikke. Brugeren er enig i denne rækkefølge. **Hver slags facit får sin egen side med egne tal og egen historik, så intet blandes.**

| Nr. | Facit | Stand |
| --- | --- | --- |
| 1 | **Generatoren** (browserens lydmotor) | v9.110–v9.114; tallene står kun i historikken |
| 2 | **Ren matematik (Testlyd):** samme mønstre, lyden regnes af vores egen kode, så den er ens på alle pc'er og hurtigere | **bygget (v9.115)**; erstatter 1 i tabellen |
| 3 | **Lydfil + MIDI-fil** (MIDI er facit for slag og toner) | efter 2 |
| 3b | **MDB Drums** (P8.30 trin 2, V4): 23 stykker med rigtige trommer, facit for slag og taktslag; CC BY-NC-SA 4.0, må aldrig ligge i repoet; brugeren henter mappen | **bygget (v9.116)** |
| 4 | **Udgivne sæt med facit** (brugeren og hovedchatten leder nu): Groove MIDI Dataset (trommer med MIDI), Slakh2100 (toner og slag pr. instrument, med spor), MUSDB18 (4 spor), Harmonix Set (taktslag, takt 1, afsnit; kun facit). Licens og download skal tjekkes | venter på det, de finder; bruger 3 |
| 5 | **Dine egne tryk** (Detektion, K og S) | bygget (v9.95); bliver |

## Det, der stadig gælder fra svarene (docs/arkiv/SVAR-P8_14.md a–g)

- Hvert af de 4 spor får kun de 14 lydtræk fra trin 1, regnet i hovedtråden (siden fryser imens); trin 2 (31 bånd, toner, klang, stereo, taktslag, afsnit) findes kun for den samlede lyd. Sporene gemmes ikke i cachen.
- Hukommelse: 4 minutter stereo ≈ 92 MB pr. spor; **74 minutter ≈ 1,7 GB pr. spor, 8,5 GB for 5 lyde**, mere end en fane kan holde. Beslut, om 4 spor skal virke på hele sange eller kun under cirka 15 minutter. WebCodecs (`AudioDecoder`) kan afkode bid for bid og er vejen til 74 minutter med spor og til `.stem.mp4`.
- MV læser det, browseren kan afkode (mp3, wav, flac, ogg, aac/m4a, webm); ingen grænser i koden, men filen læses hel ind (højst 2 GB).
- Analysen regner i rammer på 2048 prøver med hop 1024 (cirka 21 ms ved 48 kHz; 21,5 Hz pr. trin, så under 50 Hz er det groft). Kick, snare og hihat er båndenergi med flux og tærskel (ingen model); det første, der kan give "tydeligt mere sikkert", er en onset-detektor pr. bånd målt mod et facit (Detektion, generatoren, trommesporet). Lav et måle-sæt (3–5 sange + generatoren), før nye metoder bygges.
- Spor-deling i browseren: Demucs kan køre med ONNX Runtime Web (cirka 80 MB model; minutter pr. sang); RoFormer er for tung. **Et lokalt modul** (Python, CUDA; htdemucs 10–20 s for 4 minutter på et RTX 2070) er det, der kan betale sig.
- Radial Mesh: baggrunden er en tegnet gradient, gløden er `shadowBlur`, ikke rigtig bloom; et Radial Mesh-værksted med WebGL-bloom står under Senere.

## 7 · Trinene, der ikke er bygget

S0–S6 er bygget (v9.68–v9.80; den fulde tabel står i arkivet).

| Trin | Hvad bygges | Afhænger af |
| --- | --- | --- |
| **S7** (vent, P8.4) | Harmonisk og perkussiv deling (HPSS) som to nye kilder | S1 (tung beregning) |
| **S8** (senere, P8.4) | Spilleliste | S2 |

S7 og S8 tages op sammen med analysen (P8.14 punkt 6).

## 10 · Senere (ikke en del af trinene; P8.4 og P8.6)

- **Facit til senere (hovedchatten, P8.30 og P8.32; til planen, ikke nu):**
  - **Din sang:** brugerens egne tryk (K og S i Detektion) gemt som facit for én af brugerens egne sange, med kolonnen "Din sang" i Analyse sikkerhed.
  - **Sangstemme med facit fra MedleyDB:** melodiens tonehøjde; kræver ansøgning om adgang; licens kun ikke-kommerciel; filerne aldrig i repoet. Hovedchatten undersøger den åbne prøve (415 MB), når vi når til vokalen.
  - **Slakh** (MIDI-facit for alle instrumenter; 105 GB) og **sølv-facit** fra en AI-model (Beat This!) på brugerens egne sange hører til det lokale modul (A5–A6).

- **Analysen (P8.6, 19. november):** ventetiden er ikke længere et problem efter v9.70 (baggrunds-tråde); mulighederne for "mindre arbejde" (fx Nøjagtighed: Hurtig) bygges ikke. **Før Lydtidslinjen bygges,** vender brugeren og hovedchatten, hvordan lydene findes mere sikkert. Til den samtale hører Lydanalyse-kort v1.0, Lydanalyse-guide v1.0 og fem veje: **A** ret i hånden · **B** trommerne skilt ad (DrumSep, LarsNet) · **C** AI uden for programmet (ADTOF, Beat This!) · **D** takten som hjælp (fagudtryk: quantization) · **E** lær sangens egne lyde (fagudtryk: template matching). **Husk:** de 4 spor regnes endnu ikke i baggrunds-trådene (`stemBrug` regner i samme tråd); det skal med, før hele analysen køres på hvert spor.

- **Lydtidslinjen** og **Lydanalyse-kort v1.0** fra hovedchatten (https://claude.ai/artifact/DWwBZLPvvZ43gVJbDiYwBA). Første trin derfra: kør hele analysen (tonehøjde, toner, klang) på **hvert spor**, især tonehøjden på Vokal-sporet. Bygges først, når S1 er lavet, fordi det giver cirka fem gange så meget at regne. **Intet fra dette punkt bygges nu.**

---

## 11 · Grundregel og det næste (P8.14 og P8.16, 19. november 2026)

> **Analysen er programmets hjerte.** MV er bygget op omkring analysen. Målet er en meget stærk analyse: vi bruger alle de midler, der findes (spor, bedre metoder i browseren, et lokalt modul med AI og AI udenfor), når det kan betale sig. "Kan betale sig" betyder, at et lydtræk, der bruges, bliver tydeligt mere sikkert, og at det kan måles (fx med Detektion eller musikgeneratoren som facit).

- **Byg intet nyt i analysen**, før hovedchatten og brugeren har talt om den (P8.14 punkt 4): til samtalen hører skemaet "Status og lydtræk P8.10" (https://claude.ai/artifact/UvGRe7tbJ1RN5xWigewvNV), procenterne i P8.12 og Codes svar i `docs/arkiv/SVAR-P8_14.md` (4 spor i dag, hele analysen pr. spor, formater og grænser, det der findes, Radial Mesh, spor-deling i browseren, andet).
- **Lavet siden P8.4:** S1–S6 (v9.70–v9.80); **Detektion** er et kort under Analyse → Avanceret med hit-rate i procent (v9.95); **4 spor på én gang** fra filer eller en mappe, fordelt efter navn (v9.101); arbejdsområdet og vinduet hedder **Analyse** (v9.98).
- **Åbent:** S7 HPSS, S8 spilleliste, .stem.mp4 (Stem Creator Tool kan lave filerne), 4 spor i trådene og med hele analysen, sikkerhed pr. lydtræk (● ▲ !), bedre slag-metoder målt mod et facit, lokalt modul med AI, 74 minutter med spor (hukommelse), samplerate.

### 11.1 · Punkter til samtalen om den nye analyse (P8.17, 19. november; må ikke glemmes)

1. **Instrument-genkendelse, lokalt** (fagudtryk: audio tagging / instrument recognition). Lag 2, i browseren: YAMNet (Google, 521 slags lyde, TensorFlow.js) og Essentias instrument-modeller (cirka 40 instrumenter). Lag 3, i det lokale modul på grafikkortet: PANNs (527 slags lyde) og CLAP (man skriver et ord, fx "saxophone", og får et svar; fagudtryk: zero-shot). Køres helst på sporet Resten, så trommer, bas og stemme ikke forstyrrer. Giver afsnit på tidslinjen som "saxofon spiller her" og kan føde figurer i Figur-generatoren.
2. **Rettelse af lagene.** Næsten alt kan køre lokalt på et RTX 2070: også ord med tid (WhisperX), navngivne afsnit (allin1), taktslag (Beat This!) og instrumenter. "AI udenfor" (lag 4) er kun for det, der ikke kan køre på pc'en, eller for brugere uden et stærkt grafikkort.
3. **Vis usikkerheden, og undgå falske handlinger.** Hver hændelse og hver kurve får et tal for, hvor sikker den er (fagudtryk: confidence); i Lyd over tid vises usikre steder svagere eller skraveret. **Sikkerhedsgrænse pr. regel:** en skyder "kræv sikkerhed mindst …" ved siden af tærsklen, så en regel kun slår til, når målingen er sikker nok (som Tonesikkerhed kan bruges som gate i dag). **To kilder skal være enige** (valgfrit pr. regel): fx slår reglen kun til, når både Kick · Trommer og bassens stigning siger "kick". **Foreslå regler** giver lydtræk med ▲ en højere tærskel som standard. På skærmen forklares valget: højere grænse = færre falske handlinger, men flere slag, der ikke bliver fundet.
