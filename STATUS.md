# STATUS · Claude MV

Kort status (højst cirka 80 linjer; reglen står i `CLAUDE.md` afsnit 2). Historikken ligger i `docs/arkiv/STATUS-historik.md` og pr. version i `CLAUDE.md` afsnit 4. Planerne: `PLAN-NY-BRUGERFLADE.md` (brugerfladen), `docs/PLAN-SANG-OG-ANALYSE.md` (analysen), `docs/PLAN-PAA-SCENEN.md` (udkast, P8.14 punkt 7).

## Nu (v9.102, 19. november 2026)

- **Pakke 7 (Biblioteket) er færdig** (v9.85–v9.90) og rettet efter hele testpakken (v9.91).
- **Oprydningstrinnet efter pakke 7** er lavet i tre bidder (v9.92–v9.94): død kode, Normalisering som funktion, Audit og Niveau-rester væk, bloknavne efter hvad de gør (svar 1B).
- **P8.14 punkt 1 og 3 er bygget:** Detektion som kort under Analyse → Avanceret (v9.95, 2B); hele generatoren under Mere … i kortet Generator (v9.96, 3B); Lyt til sangen og EQ-knappen Opret forbindelse er væk (v9.97, 3e og 3c); Sang hedder Analyse (v9.98, 3b); værktøjslinjen ruller ikke mere (⋯ Mere), og Radial Mesh er helt i fuld skærm (v9.99, 3f); Navne: Til · Fra i Live preview (v9.100, P8.15 1); hent 4 spor på én gang, filer eller mappe (v9.101, 3a); en CSS-rettelse (v9.102).
- **Svarene på P8.14 punkt 5** står i `docs/SVAR-P8_14.md`; **planen for punkt 7 ("På scenen")** i `docs/PLAN-PAA-SCENEN.md`; **listen over pigernes egenskaber** (punkt 9) i `docs/PIGERNES-EGENSKABER.md`.
- Hele testpakken (86 testfiler) sættes i gang på v9.102; resultatet står i afleveringen.

## Næste (rækkefølgen fra P8.14 punkt 8)

1. Brugeren læser `docs/SVAR-P8_14.md` og siger ja eller nej til `docs/PLAN-PAA-SCENEN.md` (tre spørgsmål nederst).
2. **"På scenen"** (PS1–PS4), når planen er godkendt.
3. **6c Figur-generatoren** efter skitsen P8.11 (beslutningerne står i `PLAN-NY-BRUGERFLADE.md` afsnit 4.2).
4. Analysen planlægges sammen med hovedchatten (P8.14 punkt 4, P8.16 punkt 2); byg intet nyt i analysen før det.

## Venter på brugeren

- Prøv v9.102 med musik: Biblioteket og de fem regel-sæt (B6-navnene er ikke sagt god for udtrykkeligt), Detektion med K og S på egen musik, Mere … i Generator, ⋯ Mere i værktøjslinjen, Navne: Til.
- Svar på `docs/PLAN-PAA-SCENEN.md` (navn, rækkefølge, navne på effekt-regel-sæt).
- Valg i `docs/PIGERNES-EGENSKABER.md` (hvad der må fjernes; intet er fjernet).
- Lyt til sangen vs. Lav show: Lyt til sangen er fjernet i v9.97 (dit valg 3e); Lav show bliver.

## Åbne spørgsmål

- 4 spor på 74 minutter kan ikke holdes i hukommelsen (5 × 1,7 GB); se `docs/SVAR-P8_14.md` a og b. Beslut, om spor skal virke på lange sange.
- Konsol-linjen `computeBoundingSphere(): Computed radius is NaN` (16. november) og den manglende streg fra Lydfil-noden: ikke undersøgt.
- `OPS_TEST` (tre test-opsætninger i filen) bliver, til 40 test er skrevet om; Lydlag (w15) og `lyd`-objektet i pladserne; `nivAnvend`; sidebjælkens og bundbjælkens kode (bygges og fjernes ved start).
- three.js: valg A står (ny three.js ved siden af r128); B (esbuild, én three.js), når Mesh 3D og Øjet flyttes.

## Senere (kort; detaljer i planerne)

- **Indbygget spor-deling** som lokalt modul (P8.14 punkt 6; `docs/SVAR-P8_14.md` f). **.stem.mp4** læses og fordeles af sig selv; Native Instruments' gratis **Stem Creator Tool** kan samle 4 spor til én .stem.mp4 (P8.15 2, P8.16 1). Indtil da: `ffmpeg -i sang.stem.mp4 -map 0:a:1 trommer.wav -map 0:a:2 bas.wav -map 0:a:3 resten.wav -map 0:a:4 vokal.wav`.
- **Målervæg** (vores navn; fagudtryk: meter bridge): et stort vindue eller fuld skærm med mange målere.
- **Et ekstra tema** med tekstur, glans, kanter og former (ikke kun farver).
- **Radial Mesh-værksted** med rigtig bloom i WebGL, sort baggrund med stjerner og galakser, uden at røre originalen (`docs/SVAR-P8_14.md` e).
- **Stregerne i Node-editoren** (farve pr. lyd, lys der rejser) lige efter analysen; S7 HPSS og S8 spilleliste sammen med analysen.
- **Nye 2D-figurer** (fugle, fønix, sanger, ny trommeslager, guitarist, mandlig danser) på et skelet med led (fagudtryk: rig), Cascadeur som inspiration; ragdollen kan bruge samme skelet (P8.15 3).
- 3D-scene, Unity-udgaven af Mesh 3D (aldrig testet i Unity).
