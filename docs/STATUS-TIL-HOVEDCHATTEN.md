# Status til hovedchatten · v9.109 · 20. november 2026

*Fra Claude Code. Højst 60 linjer (P8.23 punkt 1g). Den gamle udgave (Node-editoren v9.19–v9.42) ligger i `docs/arkiv/STATUS-TIL-HOVEDCHATTEN-v9_42.md`.*

**Nyeste version i repoet: v9.109** (`claude-mv-v9_109.html`). Laver hovedchatten en ny version, skal den bygge videre på den fil og hedde v9.110 eller højere.

## Nuværende stand

- **Brugerfladen (P8.1–P8.9):** fase 0–7 og pakke 1–7 er bygget: én linje øverst, fire arbejdsområder, docking, matrixen og Noder på samme vilkår, Foreslå regler i stedet for Auto, panelet Automatik, Figurer → På scenen, Biblioteket (shows, figurer, regel-sæt, Mine shows uden loft), fem regel-sæt pr. figur, startskærm, Indlæst, ét tema (Warm Analog), Størrelse, Indstillinger.
- **Sang og analyse (P8.4):** S0–S6 er bygget: vinduet Analyse (Sang · Spor · Avanceret), analysen i baggrunds-tråde, Lyd over tid, Niveau (LUFS), Stereo, Spor med M/S, Detektion med hit-rate, 4 spor fra en mappe.
- **Node-editoren:** alle 16 trin, de 10 visninger, gitteret (Ret op, A/B/C, luft-skydere, tre kæmpe opstillinger; pladser gemt med showet).
- **Gemning (P8.18):** Gemt ✓, banner når lageret er fuldt, tasten ?, Hvad er nyt på startskærmen, Gem hele arbejdet / Hent hele arbejdet (én fil med alt).
- **På scenen (P8.14 punkt 7, P8.20, P8.23):** PS1–PS3 bygget (v9.107–v9.109): vinduet På scenen med Karakterer, Figurer og Effekter; hylden Effekter i Biblioteket med regel-sæt som *Lys-puls på kick*; øje og Slå fra pr. effekt i Noder og matrixen; effekternes navne i Live preview. **Stoppet efter PS3.**
- **Testpakken:** 96 testfiler; hele pakken kørt på v9.109: alle grønne (test 85 fejlede én gang på timing og er rettet). I v9.107 blev to rigtige fejl fundet og rettet: D2-sortering kunne ikke ses med gitteret; et rigtigt klik på det gule ! virkede aldrig.
- **Dokumenterne (P8.23 punkt 1):** CLAUDE.md er kortet fra 167 KB til cirka 15 KB; historik og lukkede fejl i `docs/arkiv/HISTORIK.md`; planerne rummer kun det ubyggede; SVAR-filerne er i arkivet.

## Åbne spørgsmål til brugeren

1. **Analysen:** valg a–e i "Den nye analyse P8.19" (A0–A8); skemaet "Alle lyde og alle metoder P8.22" findes. Intet bygges før valget.
2. **Pigernes egenskaber** (`docs/PIGERNES-EGENSKABER.md`): hvad må fjernes? Hovedchattens forslag: fjern de fem, der intet viser, og fold de "lidt"-synlige sammen under *Finere detaljer*.
3. **4 spor på lange sange:** skal de virke på 74 minutter (kræver WebCodecs og mindre hukommelse) eller kun under cirka 15 minutter?
4. Prøven af v9.107 (På scenen, gitteret, Gem hele arbejdet): fejl fra brugeren rettes før PS2.

## Næste skridt (P8.23)

1. Brugeren prøver v9.109; fejl rettes først.
2. **PS4** oprydning (gruppernes øje og Slå fra i Noder; brugerens valg), så **6c Figur-generatoren** (beslutningerne i `PLAN-NY-BRUGERFLADE.md` § 4.2).
3. Analysen, når brugeren har valgt a–e.

## Åbne fejl (kort; listen står i `CLAUDE.md` § 4)

- Konsol-linjen `computeBoundingSphere(): Computed radius is NaN` og den manglende streg fra Lydfil-noden: ikke undersøgt.
- Lav show hakker og en helt tom Node-editor hos brugeren: kunne ikke genskabes.
- 4 spor: ikke i cachen, kun 14 lydtræk pr. spor, regnes i hovedtråden.
- Lydmotoren er ikke lyttet til af et menneske; regel-sættene er Codes skøn.
