# STATUS · Claude MV

Kort status (højst cirka 80 linjer; reglen står i `CLAUDE.md` afsnit 2). Historikken ligger i `docs/arkiv/HISTORIK.md` (én linje pr. version) og `docs/arkiv/STATUS-historik.md`. Planerne: `PLAN-NY-BRUGERFLADE.md` (brugerfladen), `docs/PLAN-SANG-OG-ANALYSE.md` (analysen), `docs/PLAN-PAA-SCENEN.md` (udkast, P8.14 punkt 7).

## Nu (v9.131, 21. november 2026)

- **v9.131 (dit ja):** fasens sikkerhed uden toner er fast 0,50 med teksten "uden toner kan takt 1 ikke vurderes".
- **v9.130 (P8.33 trin 1, ærlig måling):** Rigtige trommer er delt i *indstil* (12) og *tjek* (11); hver celle viser tjek-tallet. Rampen for fasens sikkerhed er valgt igen på indstil (0,40 → 0,90; tjek klart bedre end et fast tal). Den halve takt bliver 1,6: 1,0 så bedre ud på indstil, men tjek faldt. Uden toner duer rampen ikke (forslag under Venter på brugeren). **STOP efter trin 1.**
- **v9.129 (dit valg A):** Rigtige trommer kan måles igen uden mappen: Analyse → Analyse sikkerhed → **Mål igen (uden mappen)** (23 stykker på cirka 7 s, samme tal som med mappen). Facit ligger kun i browseren; **Glem facit** sletter det.
- **v9.128 (rettelser efter hele testpakken på v9.127, 101 af 104 grønne):** Lyd over tid viser igen alle rækker (den nederste blev skåret af efter rækken Hændelser); Node-editorens mærke for en spærret regel bruger temaets farver; test 11 og 72 rettet.
- **v9.127 (A4, anden del):** dine rettelser i Hændelser bruges nu af reglerne (et slettet kick sætter ikke en regel i gang, et tilføjet slag gør). Knappen *Rettelser i reglerne: Til/Fra* i hovedet af Lyd over tid. Analysen og Analyse sikkerhed røres ikke.
- **v9.126 (A4, Lydtidslinjen, første del):** Lyd over tid har rækken *Hændelser* (Kick, Snare, Hihat og Takt 1); hver streg er et slag, jo kraftigere, jo mere sikkert. Klik vælger; Slet, træk eller ← → flytter; dobbeltklik tilføjer; rettelserne gemmes pr. sang. *Hør analysen* klikker på hvert slag, mens sangen spiller. *Gem tidslinje* og *Hent tidslinje* (JSON).
- **v9.125 (A2, Kræv sikkerhed):** hver regel har skyderen *Kræv sikkerhed* i Node-editorens kontrolpanel (over Gate). Reglen virker kun, når lydtrækket er sikkert nok lige nu: pr. øjeblik for Tonehøjde og Toneklasse (Tonesikkerhed) og Takt 1 (fasens sikkerhed takt for takt), ellers tallet fra Analyse sikkerhed. Regel-noden får mærket "≥ 80 %" (rødt, når spærret). Gate er enighed (to kilder). Foreslå regler hæver tærsklen 0,1 for lydtræk under 75 %; Lyd over tid skraverer Taktslag, hvor takt 1 er usikker.
- **v9.124 (A3, taktgitter med 4 spor):** med 4 spor finder MV tempo, taktslag og takt 1 ud fra Trommer-sporet (takt 1 også ud fra hele lydens toner). Valget står i Indstillinger for analysen → *Taktgitter med 4 spor* (Trommer-sporet / Hele lyden). Analyse sikkerhed har rækkerne *Taktslag · 4 spor* og *Takt 1 · 4 spor*; med 4 spor viser cirklen ved Taktslag og Takt 1 de tal.
- **v9.123 (A3, fasens sikkerhed):** hver takt stemmer for sig; sikkerheden er takternes enighed om takt 1 gennem en rampe målt på Rigtige trommer (med toner 0,20–0,95, uden 0,25–0,65). Rækken *Bedre slag og takt (A3)* og boblen ved Takt 1 siger fx "i 6 af 15 takter peger … på samme takt 1, hvor tilfældigt ville give cirka 4". Rigtige trommer måler nu hele mixet med toner (trin 2), sådan som MV analyserer en rigtig sang: Takt 1 47 → 69. Prøvet og ikke med: snaren til den halve takt (dårligere).
- **v9.122 (T1, autosikring):** MV lægger selv en kopi af alt i browseren hver dag (IndexedDB, de seneste 7 dage). Opsætninger → *Automatiske kopier*: én række pr. kopi (i dag, i går …) med *Gå tilbage hertil* (spørger to gange, gemmer først det, du har nu, og starter forfra) og *Tag en kopi nu*. Fortryd: rækken "lige før du gik tilbage". Analyse-cachen er ikke med; *Gem hele arbejdet* (en fil på din pc) er stadig den sikreste.
- **T0 (uden ny version):** koden ligger nu i `src/dele/` (132 filer; én pr. blok i `kode/hoved/`), og `node src/byg.js` bygger programfilen; den giver v9.121 byte for byte (test 102). Fra nu af rettes kun i kilderne.
- **v9.121:** *Testlyden: lyt og gem* ligger foldet sammen bag den lille knap **Testlyden ▸** (efter Kopiér rapport), fordi den næsten aldrig bruges (brugerens ønske).
- **v9.120 (G2, P8.31):** Rigtige trommer viser *Snare · uden svage slag* (SDG og SDD neutrale) og *Hihat · uden pedal* (PHH neutral); alle 21 underklasser står i "Sådan måles rigtige trommer".
- **v9.119 (valg C):** Analyse sikkerhed → *Testlyden: lyt og gem*: ▶ Lyt / ■ Stop og Gem som WAV pr. mønster (Hele lyden, Kun trommerne, Kun bassen, Kun melodien); samme fingeraftryk som rapporten.
- **v9.118:** rettelse til v9.117 (test 57): kick i stille stykker af sange over 10 minutter (Lange sange må nu skrue kick 16 gange op). Brugeren har prøvet v9.117: Testlyd og Rigtige trommer giver præcis de samme tal som hos Code. Fund: fasens sikkerhed er ikke kalibreret.
- **P8.30 trin 3 (v9.117, A3 første del):** kick i lineær skala (ekkoet), taktslaget flyttes en halv slaglængde, når kicket ligger mellem slagene, takt 1 ud fra kick, ½ × snare og skift i klang; Til/Fra i Indstillinger for analysen (med "Denne sang: …"). Før → efter står i `docs/STATUS-TIL-HOVEDCHATTEN.md`. **STOP efter trin 3.**
- **P8.30 trin 2 (v9.116):** Analyse sikkerhed har blokken **Rigtige trommer** (MDB Drums): *Vælg facit-mappe*, kolonnerne *hele mixet* og *kun trommerne*, Kick, Snare, Hihat, Taktslag, Takt 1; bækken og tammer er neutrale; cachen; aldrig blandet med Testlyd. 23 stykker på 16 s, 2 s fra cachen. Tallene: `docs/STATUS-TIL-HOVEDCHATTEN.md`.
- **Vejledning (MDB Drums):** github.com/CarlSouthall/MDBDrums → **Code** → **Download ZIP** · pak ud (cirka 2,2 GB; audio/multi-tracks, cirka 1,6 GB, kan slettes) · MV: 1 · Analyse → Analyse sikkerhed → **Vælg facit-mappe** → mappen **MDB Drums** · første gang cirka 20 s, derefter 2 s · licens CC BY-NC-SA 4.0.
- **P8.30 trin 1 (v9.115, prøvet af brugeren 20. november: alle fingeraftryk og tal ens):** testlyden regnes i ren matematik (samme 6 mønstre, ekko, rum, åben hihat, bas; ens på alle pc'er; 15–18 s); "Testlyd" ved alle tal; det samlede tal uden 99; med 4 spor viser cirklen Trommer-tallet og siger det; gamle tal (generatoren) står svagt i historikken med en streg; rapporten har tempoets og fasens sikkerhed og den rigtige fase. **STOP efter trin 1.**
- **A1 (v9.113, P8.26 og P8.28):** hele analysen på de 4 spor (80 lydtræk pr. spor) i baggrunds-trådene, gemt i cachen; Analyse sikkerhed måler ét instrument alene, viser bedste tærskel også for sporene, har *Brug den bedste tærskel* (Ctrl+Z) og *Kopiér rapport*. **STOP efter A1.**

## Tal: Testlyd og Rigtige trommer (P8.31; F-mål)

A3 slået til ét skridt ad gangen i hovedchattens rækkefølge (Kick · Taktslag · Takt 1). Skridt 3 = programmet med A3 til.

| Skridt | Testlyd hele | Testlyd trommer | Rigtige hele mixet | Rigtige trommer |
| --- | --- | --- | --- | --- |
| 0 · før | 60 · 33 · 33 | 40 · 33 · 0 | 63 · 81 · 17 | 72 · 77 · 6 |
| 1 · + Takt 1 | 60 · 33 · 33 | 40 · 33 · 33 | 63 · 81 · 42 | 72 · 77 · 25 |
| 2 · + halve takt | 60 · 49 · 47 | 40 · 81 · 76 | 63 · 81 · 47 | 72 · 84 · 30 |
| 3 · + kickets ekko | 92 · 49 · 31 | 94 · 81 · 76 | 70 · 81 · 47 | 75 · 85 · 40 |
| 4 · v9.123: hele mixet målt med toner | 92 · 49 · 31 | 94 · 81 · 76 | 70 · 81 · **69** | 75 · 85 · 40 |
| 5 · v9.124: 4 spor (Trommer-sporets gitter) | – · **78** · **73** | – | – · **85** · **72** | – |

Skridt 3 sænker Testlyd · Takt 1 i hele lyden (47 → 31), men hæver de rigtige trommer (Takt 1 30 → 40, Kick 72 → 75); de rigtige trommer vejer tungest. Snare og Hihat ændres ikke af A3. Skridt 4 ændrer ikke programmets valg, kun målingen: takt 1 findes med akkordskift, og dem havde målingen ikke før (rigtig takt 1 i 17 af 23 stykker mod 12). **Fasens sikkerhed** (Brier-score, lavere er bedre; altid 0,5 giver 0,25): hele mixet 0,363 → 0,117, kun trommerne 0,323 → 0,229, Testlyd 0,429 → 0,388 (taktslagene på modslaget i Hip-hop, Techno og Breakbeat med bas ses ikke).

Svage slag (G2, Rigtige trommer, A3 til): Snare alle slag 34 / 46 (hele mixet / trommer) → uden svage slag 36 / 57; Hihat alle slag 68 / 72 → uden pedal 64 / 68 (pedal-hihat blev mest fundet, 415 af 523). Med visker også som svage: 34 / 56.

## Næste (rækkefølgen fra P8.14 punkt 8 og P8.23)

**Rækkefølgen for analysen (brugerens valg): A3 før A2:** resten af A3 → A2 → A4 → A5–A6.

1. Brugeren prøver v9.122–v9.125 (Opsætninger → Automatiske kopier; Analyse sikkerhed → ▶ Kør testen og Vælg facit-mappe (nye rækker for 4 spor); Indstillinger for analysen → Taktgitter med 4 spor; en regel → Kræv sikkerhed; Lyd over tid → Hændelser og ▶ Hør analysen). Rigtige trommer uden mappen er bygget (dit valg A, v9.129). Rest af A3 (i planen): taktslag i Hip-hop og Techno med bas uden spor, tempoets halve, Snare.
2. A2 (v9.125) og A4 første del (v9.126) er bygget. Næste: hændelser fra en fil (det lokale modul skriver formatet lydtidslinje), så A5–A6 det lokale modul. Rest fra A0: cirklen på lydtræk-noderne og i Foreslå regler.
3. **6c Figur-generatoren** efter skitsen P8.11 (beslutningerne står i `PLAN-NY-BRUGERFLADE.md` afsnit 4.2).

## Venter på brugeren

- Valg i `docs/PIGERNES-EGENSKABER.md` engang i fremtiden (brugeren 20. november: ligger stille; P8.20: intet fjernes; hovedchattens forslag står i planen under Senere).
- Lyt til sangen vs. Lav show: Lyt til sangen er fjernet i v9.97 (dit valg 3e); Lav show bliver.

## Åbne spørgsmål

- Konsol-linjen `computeBoundingSphere(): Computed radius is NaN` (16. november) og den manglende streg fra Lydfil-noden: ikke undersøgt.
- `OPS_TEST` (tre test-opsætninger i filen) bliver, til 40 test er skrevet om; Lydlag (w15) og `lyd`-objektet i pladserne; `nivAnvend`; sidebjælkens og bundbjælkens kode (bygges og fjernes ved start).
- three.js: valg A står (ny three.js ved siden af r128); B (esbuild, én three.js), når Mesh 3D og Øjet flyttes.

## Senere (kort; detaljer i planerne)

- **Teknik og vedligeholdelse** (`docs/PLAN-TEKNIK.md`, brugerens "til planen" 20. november efter Groks vurdering): T0 (kilderne) og T1 (autosikring, v9.122) er bygget; tilbage: T2 ryd op, T3 central tilstand med lyttere, T4 SVG-ikoner, T5 tung tegning til WebGL/WebGPU, T6 moderne moduler. Groks 2 `debugger` og 56 TODO'er står i three.js, ikke i vores kode.

- **Indbygget spor-deling** som lokalt modul (P8.14 punkt 6; `docs/arkiv/SVAR-P8_14.md` f). **.stem.mp4** læses og fordeles af sig selv; Native Instruments' gratis **Stem Creator Tool** kan samle 4 spor til én .stem.mp4 (P8.15 2, P8.16 1). Indtil da: `ffmpeg -i sang.stem.mp4 -map 0:a:1 trommer.wav -map 0:a:2 bas.wav -map 0:a:3 resten.wav -map 0:a:4 vokal.wav`.
- **Målervæg** (vores navn; fagudtryk: meter bridge): et stort vindue eller fuld skærm med mange målere.
- **Et ekstra tema** med tekstur, glans, kanter og former (ikke kun farver).
- **Radial Mesh-værksted** med rigtig bloom i WebGL, sort baggrund med stjerner og galakser, uden at røre originalen (`docs/arkiv/SVAR-P8_14.md` e).
- S7 HPSS og S8 spilleliste sammen med analysen. Kun en idé (brugeren 20. november: røres ikke): stregerne i Node-editoren.
- **Nye 2D-figurer** (fugle, fønix, sanger, ny trommeslager, guitarist, mandlig danser) på et skelet med led (fagudtryk: rig), Cascadeur som inspiration; ragdollen kan bruge samme skelet (P8.15 3).
- **D4** ét fælles Fortryd (lyset i Mesh 3D og Øjet, EQ+, Form-editoren) og **D5** manualen som sidepanel (P8.18). **D7** feltfarven røres ikke.
- 3D-scene, Unity-udgaven af Mesh 3D (aldrig testet i Unity).
