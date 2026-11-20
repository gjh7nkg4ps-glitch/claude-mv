# Status til hovedchatten · v9.107 · 20. november 2026

*Fra Claude Code. Højst 60 linjer (P8.23 punkt 1g). Den gamle udgave (Node-editoren v9.19–v9.42) ligger i `docs/arkiv/STATUS-TIL-HOVEDCHATTEN-v9_42.md`.*

**Nyeste version i repoet: v9.107** (`claude-mv-v9_107.html`). Laver hovedchatten en ny version, skal den bygge videre på den fil og hedde v9.108 eller højere.

## Nuværende stand

- **Brugerfladen (P8.1–P8.9):** fase 0–7 og pakke 1–7 er bygget: én linje øverst, fire arbejdsområder, docking, matrixen og Noder på samme vilkår, Foreslå regler i stedet for Auto, panelet Automatik, Figurer → På scenen, Biblioteket (shows, figurer, regel-sæt, Mine shows uden loft), fem regel-sæt pr. figur, startskærm, Indlæst, ét tema (Warm Analog), Størrelse, Indstillinger.
- **Sang og analyse (P8.4):** S0–S6 er bygget: vinduet Analyse (Sang · Spor · Avanceret), analysen i baggrunds-tråde, Lyd over tid, Niveau (LUFS), Stereo, Spor med M/S, Detektion med hit-rate, 4 spor fra en mappe.
- **Node-editoren:** alle 16 trin, de 10 visninger, gitteret (Ret op, A/B/C, luft-skydere, tre kæmpe opstillinger; pladser gemt med showet).
- **Gemning (P8.18):** Gemt ✓, banner når lageret er fuldt, tasten ?, Hvad er nyt på startskærmen, Gem hele arbejdet / Hent hele arbejdet (én fil med alt).
- **På scenen (P8.14 punkt 7, P8.20):** PS1 bygget (v9.107): Karakterer, Figurer og Effekter med øje, Slå fra og styrke pr. effekt.
- **Testpakken:** 88 testfiler; hele pakken kørt på v9.106 (82 grønne, 8 rettet i v9.107 og testene). To rigtige fejl fundet og rettet: D2-sortering kunne ikke ses med gitteret; et rigtigt klik på det gule ! virkede aldrig.
- **Dokumenterne (P8.23 punkt 1):** CLAUDE.md er kortet fra 167 KB til cirka 15 KB; historik og lukkede fejl i `docs/arkiv/HISTORIK.md`; planerne rummer kun det ubyggede; SVAR-filerne er i arkivet.

## Åbne spørgsmål til brugeren

1. **Analysen:** valg a–e i "Den nye analyse P8.19" (A0–A8); skemaet "Alle lyde og alle metoder P8.22" findes. Intet bygges før valget.
2. **Pigernes egenskaber** (`docs/PIGERNES-EGENSKABER.md`): hvad må fjernes? Hovedchattens forslag: fjern de fem, der intet viser, og fold de "lidt"-synlige sammen under *Finere detaljer*.
3. **4 spor på lange sange:** skal de virke på 74 minutter (kræver WebCodecs og mindre hukommelse) eller kun under cirka 15 minutter?
4. Prøven af v9.107 (På scenen, gitteret, Gem hele arbejdet): fejl fra brugeren rettes før PS2.

## Næste skridt (P8.23)

1. **PS2:** hylden Effekter i Biblioteket med regel-sæt navngivet efter effekten (fx *Lys-puls på kick*); valg C gælder.
2. **PS3:** Noder og matrixen viser øje og Slå fra pr. effekt; Navne: Til skriver effekternes navne i et hjørne. **Stop efter PS3**; hele testpakken på den nyeste version først.
3. **PS4** oprydning, så **6c Figur-generatoren** (beslutningerne i `PLAN-NY-BRUGERFLADE.md` § 4.2).
4. Analysen, når brugeren har valgt.

## Åbne fejl (kort; listen står i `CLAUDE.md` § 4)

- Konsol-linjen `computeBoundingSphere(): Computed radius is NaN` og den manglende streg fra Lydfil-noden: ikke undersøgt.
- Lav show hakker og en helt tom Node-editor hos brugeren: kunne ikke genskabes.
- 4 spor: ikke i cachen, kun 14 lydtræk pr. spor, regnes i hovedtråden.
- Lydmotoren er ikke lyttet til af et menneske; regel-sættene er Codes skøn.
