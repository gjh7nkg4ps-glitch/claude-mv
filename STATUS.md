# STATUS · Claude MV

Kort status (højst cirka 80 linjer; reglen står i `CLAUDE.md` afsnit 2). Historikken ligger i `docs/arkiv/HISTORIK.md` (én linje pr. version) og `docs/arkiv/STATUS-historik.md`. Planerne: `PLAN-NY-BRUGERFLADE.md` (brugerfladen), `docs/PLAN-SANG-OG-ANALYSE.md` (analysen), `docs/PLAN-PAA-SCENEN.md` (udkast, P8.14 punkt 7).

## Nu (v9.121, 20. november 2026)

- **v9.121:** *Testlyden: lyt og gem* ligger foldet sammen bag den lille knap **Testlyden ▸** (efter Kopiér rapport), fordi den næsten aldrig bruges (brugerens ønske).

- **v9.120 (G2, P8.31):** Rigtige trommer viser *Snare · uden svage slag* (SDG og SDD neutrale) og *Hihat · uden pedal* (PHH neutral); alle 21 underklasser står i "Sådan måles rigtige trommer".
- **v9.119 (valg C):** Analyse sikkerhed → *Testlyden: lyt og gem*: ▶ Lyt / ■ Stop og Gem som WAV pr. mønster (Hele lyden, Kun trommerne, Kun bassen, Kun melodien); samme fingeraftryk som rapporten.

- **v9.118:** rettelse til v9.117 (test 57): kick i stille stykker af sange over 10 minutter (Lange sange må nu skrue kick 16 gange op). Brugeren har prøvet v9.117: Testlyd og Rigtige trommer giver præcis de samme tal som hos Code. Fund: fasens sikkerhed er ikke kalibreret.
- **P8.30 trin 3 (v9.117, A3 første del):** kick i lineær skala (ekkoet), taktslaget flyttes en halv slaglængde, når kicket ligger mellem slagene, takt 1 ud fra kick, ½ × snare og skift i klang; Til/Fra i Indstillinger for analysen (med "Denne sang: …"). Før → efter står i `docs/STATUS-TIL-HOVEDCHATTEN.md`. **STOP efter trin 3.**
- **P8.30 trin 2 (v9.116):** Analyse sikkerhed har blokken **Rigtige trommer** (MDB Drums): *Vælg facit-mappe*, kolonnerne *hele mixet* og *kun trommerne*, Kick, Snare, Hihat, Taktslag, Takt 1; bækken og tammer er neutrale; cachen; aldrig blandet med Testlyd. 23 stykker på 16 s, 2 s fra cachen. Tallene: `docs/STATUS-TIL-HOVEDCHATTEN.md`.
- **Vejledning (MDB Drums):** github.com/CarlSouthall/MDBDrums → **Code** → **Download ZIP** · pak ud (cirka 2,2 GB; audio/multi-tracks, cirka 1,6 GB, kan slettes) · MV: 1 · Analyse → Analyse sikkerhed → **Vælg facit-mappe** → mappen **MDB Drums** · første gang cirka 20 s, derefter 2 s · licens CC BY-NC-SA 4.0.
- **P8.30 trin 1 (v9.115, prøvet af brugeren 20. november: alle fingeraftryk og tal ens):** testlyden regnes i ren matematik (samme 6 mønstre, ekko, rum, åben hihat, bas; ens på alle pc'er; 15–18 s); "Testlyd" ved alle tal; det samlede tal uden 99; med 4 spor viser cirklen Trommer-tallet og siger det; gamle tal (generatoren) står svagt i historikken med en streg; rapporten har tempoets og fasens sikkerhed og den rigtige fase. **STOP efter trin 1.**
- **v9.114:** rettelser efter hele testpakken på v9.113 (95 af 98 grønne): Analyse sikkerhed gemmer kun gennem lsGem; cirklen i matrixen ændrer ikke rækkens tekst; Tilpas tegner fladen én gang. Brugeren 20. november: v9.112 er fin; "Lav show hakker" og "tom Node-editor" sker ikke mere (lukket).
- **A1 (v9.113, P8.26 og P8.28):** hele analysen på de 4 spor (80 lydtræk pr. spor) i baggrunds-trådene, gemt i cachen; Analyse sikkerhed måler ét instrument alene, viser bedste tærskel også for sporene, har *Brug den bedste tærskel* (Ctrl+Z) og *Kopiér rapport*. **STOP efter A1.**
- **Kolonnenavnene står fast øverst i Node-editoren (v9.111):** en fast linje, samme størrelse uanset zoom, ingen overlap (brugerens ønske 20. november). v9.112: efter Tilpas står noderne under linjen (hele testpakken fandt, at klik på en node kunne ramme et kolonnenavn).
- **Analyse sikkerhed (A0, v9.110, P8.24):** fanen Analyse sikkerhed i Analyse måler analysen mod generatoren (6 mønstre, offline); cirkel med tal i matrixens rækker (grøn 75–100, gul 50–74, rød 0–49, ? ikke målt; 99 = ren matematik); resultatet gemmes med versionsnummer. 4 spor kun under cirka 15 minutter (besked). Notat om installation med ét klik: `docs/LOKALT-MODUL-INSTALLATION.md`. **STOP efter A0.** De første tal står i `docs/STATUS-TIL-HOVEDCHATTEN.md`.
- **P8.14 punkt 1 og 3 er bygget:** Detektion som kort under Analyse → Avanceret (v9.95, 2B); hele generatoren under Mere … i kortet Generator (v9.96, 3B); Lyt til sangen og EQ-knappen Opret forbindelse er væk (v9.97, 3e og 3c); Sang hedder Analyse (v9.98, 3b); værktøjslinjen ruller ikke mere (⋯ Mere), og Radial Mesh er helt i fuld skærm (v9.99, 3f); Navne: Til · Fra i Live preview (v9.100, P8.15 1); hent 4 spor på én gang, filer eller mappe (v9.101, 3a); en CSS-rettelse (v9.102).
- **Svarene på P8.14 punkt 5** står i `docs/arkiv/SVAR-P8_14.md`; **planen for punkt 7 ("På scenen")** i `docs/PLAN-PAA-SCENEN.md`; **listen over pigernes egenskaber** (punkt 9) i `docs/PIGERNES-EGENSKABER.md`.
- **Dokumenterne er kortet ned (P8.23 punkt 1):** CLAUDE.md cirka 15 KB; historik i `docs/arkiv/HISTORIK.md`; planerne rummer kun det ubyggede; SVAR-filerne, KORTLAEGNING, NODE-EDITOREN (papiret), PLAN-NODE-EDITOREN og FUNKTIONSLISTE-TJEK er i `docs/arkiv/`.
- **På scenen, PS3 (v9.109):** øje og Slå fra pr. effekt i Noder (mål-noden og kontrolpanelet) og matrixen (overskriften); Navne: Til skriver effekternes navne i hjørnet. **STOP efter PS3** (P8.23).
- **På scenen, PS2 (v9.108):** hylden Effekter i Biblioteket med regel-sæt som *Lys-puls på kick*; klik på effektens navn i På scenen åbner kortet.
- **På scenen, PS1 (v9.107):** vinduet Figurer hedder På scenen med Karakterer, Figurer og Effekter (19, hele billedet); øje, ⏻ og styrke pr. række, også pr. effekt (`scene.ne.eff`); Ctrl+Z. **STOP efter PS1** (P8.20).
- **Gem hele arbejdet / Hent hele arbejdet (v9.106, D6):** én fil med alt under rytme-*; Opsætninger, 💾 Gem ▾ og banneret.
- **Gitter i Node-editoren (v9.105, P8.12):** faste kolonner, Ret op, A/B/C, Del, skyderne Lodret og Vandret, tre kæmpe opstillinger; pladser og skydere gemmes med showet; Ctrl+Z.
- **P8.18 D1–D3 er bygget (v9.104):** Gemt ✓ og banner, når gemningen fejler; tasten ?; Hvad er nyt på startskærmen. Svar på D6 i `docs/arkiv/SVAR-P8_18.md`.

## Tal: Testlyd og Rigtige trommer (P8.31; F-mål)

A3 slået til ét skridt ad gangen i hovedchattens rækkefølge (Kick · Taktslag · Takt 1). Skridt 3 = programmet med A3 til.

| Skridt | Testlyd hele | Testlyd trommer | Rigtige hele mixet | Rigtige trommer |
| --- | --- | --- | --- | --- |
| 0 · før | 60 · 33 · 33 | 40 · 33 · 0 | 63 · 81 · 17 | 72 · 77 · 6 |
| 1 · + Takt 1 | 60 · 33 · 33 | 40 · 33 · 33 | 63 · 81 · 42 | 72 · 77 · 25 |
| 2 · + halve takt | 60 · 49 · 47 | 40 · 81 · 76 | 63 · 81 · 47 | 72 · 84 · 30 |
| 3 · + kickets ekko | 92 · 49 · 31 | 94 · 81 · 76 | 70 · 81 · 47 | 75 · 85 · 40 |

Skridt 3 sænker Testlyd · Takt 1 i hele lyden (47 → 31), men hæver de rigtige trommer (Takt 1 30 → 40, Kick 72 → 75); de rigtige trommer vejer tungest. Snare og Hihat ændres ikke af A3.

Svage slag (G2, Rigtige trommer, A3 til): Snare alle slag 34 / 46 (hele mixet / trommer) → uden svage slag 36 / 57; Hihat alle slag 68 / 72 → uden pedal 64 / 68 (pedal-hihat blev mest fundet, 415 af 523). Med visker også som svage: 34 / 56.

## Næste (rækkefølgen fra P8.14 punkt 8 og P8.23)

**Rækkefølgen for analysen (brugerens valg): A3 før A2:** resten af A3 → A2 → A4 → A5–A6.

1. Brugeren prøver v9.121 (Rigtige trommer: vælg MDB-mappen igen én gang, så underklasserne bliver læst). Brugeren vælger, om MV skal kunne måle Rigtige trommer igen uden at vælge mappen (forslag A: facit gemmes i cachen; B: MV husker mappen). Derefter resten af A3: fasens sikkerhed (kalibreres først), taktslag i Hip-hop og Techno med bas, taktgitter fra Trommer-sporet med 4 spor, tempoets halve, Snare.
2. Så A2 sikkerhedsgrænse og enighed (kræver en kalibreret fase-sikkerhed), A4 Lydtidslinjen, A5–A6 det lokale modul. Rest fra A0: cirklen på lydtræk-noderne og i Foreslå regler.
3. **6c Figur-generatoren** efter skitsen P8.11 (beslutningerne står i `PLAN-NY-BRUGERFLADE.md` afsnit 4.2).

## Venter på brugeren

- Valg i `docs/PIGERNES-EGENSKABER.md` engang i fremtiden (brugeren 20. november: ligger stille; P8.20: intet fjernes; hovedchattens forslag står i planen under Senere).
- Lyt til sangen vs. Lav show: Lyt til sangen er fjernet i v9.97 (dit valg 3e); Lav show bliver.

## Åbne spørgsmål

- Konsol-linjen `computeBoundingSphere(): Computed radius is NaN` (16. november) og den manglende streg fra Lydfil-noden: ikke undersøgt.
- `OPS_TEST` (tre test-opsætninger i filen) bliver, til 40 test er skrevet om; Lydlag (w15) og `lyd`-objektet i pladserne; `nivAnvend`; sidebjælkens og bundbjælkens kode (bygges og fjernes ved start).
- three.js: valg A står (ny three.js ved siden af r128); B (esbuild, én three.js), når Mesh 3D og Øjet flyttes.

## Senere (kort; detaljer i planerne)

- **Indbygget spor-deling** som lokalt modul (P8.14 punkt 6; `docs/arkiv/SVAR-P8_14.md` f). **.stem.mp4** læses og fordeles af sig selv; Native Instruments' gratis **Stem Creator Tool** kan samle 4 spor til én .stem.mp4 (P8.15 2, P8.16 1). Indtil da: `ffmpeg -i sang.stem.mp4 -map 0:a:1 trommer.wav -map 0:a:2 bas.wav -map 0:a:3 resten.wav -map 0:a:4 vokal.wav`.
- **Målervæg** (vores navn; fagudtryk: meter bridge): et stort vindue eller fuld skærm med mange målere.
- **Et ekstra tema** med tekstur, glans, kanter og former (ikke kun farver).
- **Radial Mesh-værksted** med rigtig bloom i WebGL, sort baggrund med stjerner og galakser, uden at røre originalen (`docs/arkiv/SVAR-P8_14.md` e).
- S7 HPSS og S8 spilleliste sammen med analysen. Kun en idé (brugeren 20. november: røres ikke): stregerne i Node-editoren.
- **Nye 2D-figurer** (fugle, fønix, sanger, ny trommeslager, guitarist, mandlig danser) på et skelet med led (fagudtryk: rig), Cascadeur som inspiration; ragdollen kan bruge samme skelet (P8.15 3).
- **D4** ét fælles Fortryd (lyset i Mesh 3D og Øjet, EQ+, Form-editoren) og **D5** manualen som sidepanel (P8.18). **D7** feltfarven røres ikke.
- 3D-scene, Unity-udgaven af Mesh 3D (aldrig testet i Unity).
