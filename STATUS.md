# STATUS · Claude MV

Kort status (højst cirka 80 linjer; reglen står i `CLAUDE.md` afsnit 2). Historikken ligger i `docs/arkiv/HISTORIK.md` (én linje pr. version) og `docs/arkiv/STATUS-historik.md`. Planerne: `PLAN-NY-BRUGERFLADE.md` (brugerfladen), `docs/PLAN-SANG-OG-ANALYSE.md` (analysen), `docs/PLAN-PAA-SCENEN.md` (udkast, P8.14 punkt 7).

## Nu (v9.108, 20. november 2026)

- **Pakke 7 (Biblioteket) er færdig** (v9.85–v9.90) og rettet efter hele testpakken (v9.91).
- **Oprydningstrinnet efter pakke 7** er lavet i tre bidder (v9.92–v9.94): død kode, Normalisering som funktion, Audit og Niveau-rester væk, bloknavne efter hvad de gør (svar 1B).
- **P8.14 punkt 1 og 3 er bygget:** Detektion som kort under Analyse → Avanceret (v9.95, 2B); hele generatoren under Mere … i kortet Generator (v9.96, 3B); Lyt til sangen og EQ-knappen Opret forbindelse er væk (v9.97, 3e og 3c); Sang hedder Analyse (v9.98, 3b); værktøjslinjen ruller ikke mere (⋯ Mere), og Radial Mesh er helt i fuld skærm (v9.99, 3f); Navne: Til · Fra i Live preview (v9.100, P8.15 1); hent 4 spor på én gang, filer eller mappe (v9.101, 3a); en CSS-rettelse (v9.102).
- **Svarene på P8.14 punkt 5** står i `docs/arkiv/SVAR-P8_14.md`; **planen for punkt 7 ("På scenen")** i `docs/PLAN-PAA-SCENEN.md`; **listen over pigernes egenskaber** (punkt 9) i `docs/PIGERNES-EGENSKABER.md`.
- Hele testpakken (88 testfiler) er kørt på v9.106: 82 grønne; de 8 er rettet i v9.107 og testene (to rigtige fejl: D2-sortering kunne ikke ses med gitteret, og et rigtigt klik på det gule ! virkede ikke).
- **Dokumenterne er kortet ned (P8.23 punkt 1):** CLAUDE.md cirka 15 KB; historik i `docs/arkiv/HISTORIK.md`; planerne rummer kun det ubyggede; SVAR-filerne, KORTLAEGNING, NODE-EDITOREN (papiret), PLAN-NODE-EDITOREN og FUNKTIONSLISTE-TJEK er i `docs/arkiv/`.
- **På scenen, PS2 (v9.108):** hylden Effekter i Biblioteket med regel-sæt som *Lys-puls på kick*; klik på effektens navn i På scenen åbner kortet.
- **På scenen, PS1 (v9.107):** vinduet Figurer hedder På scenen med Karakterer, Figurer og Effekter (19, hele billedet); øje, ⏻ og styrke pr. række, også pr. effekt (`scene.ne.eff`); Ctrl+Z. **STOP efter PS1** (P8.20).
- **Gem hele arbejdet / Hent hele arbejdet (v9.106, D6):** én fil med alt under rytme-*; Opsætninger, 💾 Gem ▾ og banneret.
- **Gitter i Node-editoren (v9.105, P8.12):** faste kolonner, Ret op, A/B/C, Del, skyderne Lodret og Vandret, tre kæmpe opstillinger; pladser og skydere gemmes med showet; Ctrl+Z.
- **P8.18 D1–D3 er bygget (v9.104):** Gemt ✓ og banner, når gemningen fejler; tasten ?; Hvad er nyt på startskærmen. Svar på D6 i `docs/arkiv/SVAR-P8_18.md`.

## Næste (rækkefølgen fra P8.14 punkt 8 og P8.23)

1. Brugeren prøver PS1 og PS2; fejl rettes først. **PS3** (Noder og matrixen viser øje/Slå fra pr. effekt; Navne: Til skriver effekternes navne i et hjørne), **PS4** (oprydning).
3. **6c Figur-generatoren** efter skitsen P8.11 (beslutningerne står i `PLAN-NY-BRUGERFLADE.md` afsnit 4.2).
4. Analysen: planen "Den nye analyse P8.19" (A0–A8) venter på brugerens valg a–e; byg intet.

## Venter på brugeren

- Prøv v9.107 med musik: På scenen i 2 · Scene (fold Effekter ud, skjul Lys-puls med øjet, slå Glød fra med ⏻, træk i styrken); Gem hele arbejdet (Opsætninger) og Hent den igen; gitteret i Node-editoren (Ret op, A/B/C, skyderne, Gitter · Kæmpe), Biblioteket og de fem regel-sæt (B6-navnene er ikke sagt god for udtrykkeligt), Detektion med K og S på egen musik, Mere … i Generator, ⋯ Mere i værktøjslinjen, Navne: Til.
- Valg i `docs/PIGERNES-EGENSKABER.md` senere (P8.20: intet fjernes; hovedchattens forslag står i planen under Senere).
- Valg a–e i "Den nye analyse P8.19"; skemaet "Alle lyde og alle metoder P8.22" findes (P8.23 punkt 3).
- Lyt til sangen vs. Lav show: Lyt til sangen er fjernet i v9.97 (dit valg 3e); Lav show bliver.

## Åbne spørgsmål

- 4 spor på 74 minutter kan ikke holdes i hukommelsen (5 × 1,7 GB); se `docs/arkiv/SVAR-P8_14.md` a og b. Beslut, om spor skal virke på lange sange.
- Konsol-linjen `computeBoundingSphere(): Computed radius is NaN` (16. november) og den manglende streg fra Lydfil-noden: ikke undersøgt.
- `OPS_TEST` (tre test-opsætninger i filen) bliver, til 40 test er skrevet om; Lydlag (w15) og `lyd`-objektet i pladserne; `nivAnvend`; sidebjælkens og bundbjælkens kode (bygges og fjernes ved start).
- three.js: valg A står (ny three.js ved siden af r128); B (esbuild, én three.js), når Mesh 3D og Øjet flyttes.

## Senere (kort; detaljer i planerne)

- **Indbygget spor-deling** som lokalt modul (P8.14 punkt 6; `docs/arkiv/SVAR-P8_14.md` f). **.stem.mp4** læses og fordeles af sig selv; Native Instruments' gratis **Stem Creator Tool** kan samle 4 spor til én .stem.mp4 (P8.15 2, P8.16 1). Indtil da: `ffmpeg -i sang.stem.mp4 -map 0:a:1 trommer.wav -map 0:a:2 bas.wav -map 0:a:3 resten.wav -map 0:a:4 vokal.wav`.
- **Målervæg** (vores navn; fagudtryk: meter bridge): et stort vindue eller fuld skærm med mange målere.
- **Et ekstra tema** med tekstur, glans, kanter og former (ikke kun farver).
- **Radial Mesh-værksted** med rigtig bloom i WebGL, sort baggrund med stjerner og galakser, uden at røre originalen (`docs/arkiv/SVAR-P8_14.md` e).
- **Stregerne i Node-editoren** (farve pr. lyd, lys der rejser) lige efter analysen; S7 HPSS og S8 spilleliste sammen med analysen.
- **Nye 2D-figurer** (fugle, fønix, sanger, ny trommeslager, guitarist, mandlig danser) på et skelet med led (fagudtryk: rig), Cascadeur som inspiration; ragdollen kan bruge samme skelet (P8.15 3).
- **D4** ét fælles Fortryd (lyset i Mesh 3D og Øjet, EQ+, Form-editoren) og **D5** manualen som sidepanel (P8.18). **D7** feltfarven røres ikke.
- 3D-scene, Unity-udgaven af Mesh 3D (aldrig testet i Unity).
