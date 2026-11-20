# Status til hovedchatten · v9.110 · 20. november 2026

*Fra Claude Code. Højst 60 linjer (P8.23 punkt 1g). Den gamle udgave (Node-editoren v9.19–v9.42) ligger i `docs/arkiv/STATUS-TIL-HOVEDCHATTEN-v9_42.md`.*

**Nyeste version i repoet: v9.110** (`claude-mv-v9_110.html`). Laver hovedchatten en ny version, skal den bygge videre på den fil og hedde v9.111 eller højere.

## Nuværende stand

- **Brugerfladen (P8.1–P8.9):** fase 0–7 og pakke 1–7 er bygget: én linje øverst, fire arbejdsområder, docking, matrixen og Noder på samme vilkår, Foreslå regler i stedet for Auto, panelet Automatik, Figurer → På scenen, Biblioteket (shows, figurer, regel-sæt, Mine shows uden loft), fem regel-sæt pr. figur, startskærm, Indlæst, ét tema (Warm Analog), Størrelse, Indstillinger.
- **Sang og analyse (P8.4):** S0–S6 er bygget: vinduet Analyse (Sang · Spor · Avanceret), analysen i baggrunds-tråde, Lyd over tid, Niveau (LUFS), Stereo, Spor med M/S, Detektion med hit-rate, 4 spor fra en mappe.
- **På scenen (P8.14 punkt 7, P8.20, P8.23):** PS1–PS3 bygget (v9.107–v9.109): vinduet På scenen med Karakterer, Figurer og Effekter; hylden Effekter i Biblioteket med regel-sæt som *Lys-puls på kick*; øje og Slå fra pr. effekt i Noder og matrixen; effekternes navne i Live preview. **Stoppet efter PS3.**
- **Testpakken:** 97 testfiler; test 97 (Analyse sikkerhed) er grøn; hele pakken køres på v9.110, og resultatet skrives her.

## A0 · Analyse sikkerhed (v9.110, P8.24): de første målte tal

Facit: generatoren, 6 mønstre på 8 takter med generatorens standard-lyd (ekko 0,25, rum 0,25), regnet offline: House 124 kun trommer · House 124 · Hip-hop 90 · Drum and bass 172 (alle tre med bas og melodi) · Techno 132 med akkord-flade · Breakbeat 140 med støj (12 dB under musikken). Slag: standard-reglen (tærskel 0,30; Hihat 0,35; attack 8 ms, release 120 ms, spærretid 120 ms), ramt inden for ±50 ms; taktslag ±70 ms. Sikkerhed = F-mål i procent. To kørsler giver samme tal (fast frø).

| Lydtræk | Sikkerhed | Rammer | Falske | Oversete | Pr. mønster (i rækkefølgen ovenfor) |
| --- | --- | --- | --- | --- | --- |
| Kick | 67 | 116 af 160 | 69 | 44 | 25 · 100 · 75 · 97 · 71 · 55 |
| Snare (snare og klap) | 29 | 49 af 152 | 140 | 103 | 25 · 18 · 31 · 30 · 0 · 52 |
| Hihat (lukket og åben) | 72 | 311 af 528 | 22 | 217 | 58 · 55 · 91 · 87 · 78 · 75 |
| Taktslag (fra filen) | 43 | 78 af 192 | 95 | 114 | 98 · 98 · 0 · 24 · 0 · 28 |
| Takt 1 (fra filen) | 34 | 16 af 48 | 29 | 32 | 94 · 94 · 0 · 0 · 0 · 0 |
| Tonehøjde (melodien, hele lyden) | 12 | % af tiden | – | – | – · 7 · 28 · 9 · 0 · 7 |
| Tonehøjde, kun melodien | 89 | % af tiden | – | – | 93 · 88 · 86 (House, Hip-hop, DnB) |
| Basens tone, hele lyden (ikke et lydtræk endnu) | 47 | % af tiden | – | – | – · 33 · 54 · 62 · 37 · 32 |
| Basens tone, kun bassen | 87 | % af tiden | – | – | 68 · 93 · 92 |
| Toneklasse · de 12 toner (gennemsnit) | 79 · 87 | % af tiden | – | – | |
| Kun trommerne: Kick · Snare · Hihat | 42 · 35 · 70 | | | | Kick: 25 · 22 · 75 · 89 · 9 · 64 |

**Det, tallene viser (Codes læsning):**
- **Ekkoet narrer Kick.** I House kun trommer udløser kickets ekko (3 sekstendedele senere) reglen cirka 100 ms før det næste rigtige kick, og spærretiden på 120 ms blokerer så det rigtige. Med bas i lyden sker det ikke (House 100). Derfor er "kun trommerne" ikke bedre end hele lyden her; et rent Trommer-spor hjælper ikke, når fejlen er tærsklen. En tærskel, der følger niveauet (A3), bør fjerne det.
- **Snare er det svageste slag:** den åbne hihat og kicket udløser den (140 falske). Høj-mid-båndet alene kan ikke skelne snare fra hihat.
- **Taktslaget er enten rigtigt eller en halv takt forskudt:** House 98, men Hip-hop og Techno 0, fordi slagene lægges på modslaget (fasen er forkert, tempoet er rigtigt). Takt 1 følger med ned.
- **Tonehøjde virker på én stemme (89), ikke i en blanding (12).** Det støtter planen om at køre tonehøjden på sporene (A1). Bassens dybeste tone ligger en oktav under det, generatoren kalder tonen (en sinus under); facit er den dybeste.
- Ren matematik (bånd, styrke, klang, stereo) står som 99. Vokal, afsnit, akkorder og takturet "mens det spiller" har intet facit (?).

**Forbehold:** generatorens lyde er rene og ens; rigtig musik giver normalt lavere tal. Slag er målt med standard-reglen, ikke med brugerens regler og ikke med Adaptiv tærskel. Testen tog 42 s i testbrowseren (4 langsomme kerner); tiden hos brugeren er ikke målt.

**Ikke bygget i A0 (står i planen):** cirklen på lydtræk-noderne i Node-editoren og i Foreslå regler. **Punkt e:** `docs/LOKALT-MODUL-INSTALLATION.md` (Pinokio først, et startscript som reserve; om en fil-side kan nå `127.0.0.1` i Chrome skal prøves).

## Åbne spørgsmål til brugeren

1. **Pigernes egenskaber** (`docs/PIGERNES-EGENSKABER.md`): ligger stille til engang i fremtiden (brugeren 20. november).
2. Hvor lang tid tager ▶ Kør testen på brugerens pc?

## Næste skridt (P8.24 punkt 4)

1. Brugeren prøver v9.110; fejl rettes først.
2. A1 hele analysen på sporene i baggrunds-trådene (sporenes analyse gemmes) · A2 sikkerhedsgrænse og enighed i reglerne · A3 bedre slag · A4 Lydtidslinjen · A5–A6 det lokale modul. Ét trin ad gangen, når brugeren siger til.
3. 6c Figur-generatoren (`PLAN-NY-BRUGERFLADE.md` § 4.2), når brugeren siger til.

## Åbne fejl (kort; listen står i `CLAUDE.md` § 4)

- Konsol-linjen `computeBoundingSphere(): Computed radius is NaN` og den manglende streg fra Lydfil-noden: ikke undersøgt.
- Lav show hakker og en helt tom Node-editor hos brugeren: kunne ikke genskabes.
- 4 spor: ikke i cachen, kun 14 lydtræk pr. spor, regnes i hovedtråden.
- Lydmotoren er ikke lyttet til af et menneske; regel-sættene er Codes skøn.
