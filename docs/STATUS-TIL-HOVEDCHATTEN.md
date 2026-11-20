# Status til hovedchatten · v9.114 · 20. november 2026

*Fra Claude Code. Højst 60 linjer. Skrevet til handover (P8.26 punkt 3).*

**Nyeste version i repoet: v9.114** (`claude-mv-v9_114.html`; rettelser efter hele testpakken). En ny version fra hovedchatten skal bygge på den nyeste fil i repoet og have et højere nummer. Regler og åbne fejl: `CLAUDE.md`. Historik: `docs/arkiv/HISTORIK.md`.

## Stand

- **Brugerfladen** (P8.1–P8.23) er bygget: fire arbejdsområder, docking, matrix og Noder, Biblioteket, På scenen (PS1–PS3; PS4 lukket), Gem hele arbejdet, gitteret. v9.111–v9.112: kolonnenavnene står i en fast linje øverst i Node-editoren.
- **A0 Analyse sikkerhed (v9.110):** fanen i Analyse måler analysen mod generatoren (6 mønstre, offline); cirkel med tal i matrixens rækker; resultat gemt med versionsnummer. Virker hos brugeren (28,6 s).
- **A1 (v9.113):** hvert af de 4 spor får hele analysen i baggrunds-trådene (`anaAlt`); kilderne hedder `stem:SPOR:ana:…` (fx Tonehøjde · Vokal) og findes i matrixen, Node-editoren, D2 og Analyse sikkerhed; analysen gemmes i cachen pr. filnavn og længde (filerne skal vælges igen efter genstart, men regnes ikke igen). **Der er 80 lydtræk pr. spor (14 + 66), ikke 98.** Spor kun under cirka 15 minutter.
- **P8.28:** bedste tærskel vises for alle slag-rækker, også sporenes; knappen *Brug den bedste tærskel* sætter tærsklen i brugerens regler på lydtrækket (Ctrl+Z virker); *Kopiér rapport* giver alle tal, det fundne tempo pr. mønster og browserens version som tekst.
- **Testpakken:** 98 testfiler; hele pakken på v9.113: 95 grønne, 3 fejl (54, 82, 91), rettet i v9.114 og kørt igen enkeltvis: grønne.

## Målte tal (testbrowseren, v9.113; F-mål eller % af tiden)

| Lydtræk | Hele lyden | Ét instrument alene |
| --- | --- | --- |
| Kick | 67 (bedste tærskel 0,20–0,25 giver 67) | Trommer: 42 (bedste tærskel 0,45 giver 45) |
| Snare | 29 | Trommer: 35 |
| Hihat | 72 | Trommer: 70 |
| Taktslag | 43 | Trommer: 63 |
| Takt 1 | 34 | Trommer: 59 |
| Tonehøjde | 12 (melodien) | melodien alene (står for Vokal): 89 |
| Basens tone | 47 | Tonehøjde · Bas: 87 |
| Toneklasse | 79 | Bas 99 · melodien 80 |
| De 12 toner | 87 | Bas 99 · melodien 92 |

Pr. mønster (House kun trommer · House · Hip-hop · DnB · Techno · Breakbeat): Taktslag 98 98 0 24 0 28; Taktslag · Trommer 98 98 98 45 0 31. Fundet tempo: 123,3 · 123,3 · 90 · 86,3 (det halve) · 132,5 · 112,3 (forkert).

**Det, A1 giver:** tonehøjde er brugbar på et rent spor (87 og 89 mod 47 og 12). Taktslaget bliver bedre på trommerne alene (Hip-hop 0 → 98). Slagene bliver ikke bedre af et rent spor med standard-reglen (ekkoet), og den bedste faste tærskel hjælper kun lidt (42 → 45): det kræver A3.

## Brugerens tal afviger (P8.28 punkt 1): ikke løst

Brugeren målte på v9.110: Kick 79, Snare 32, Hihat 74, Taktslag 25, Takt 1 0 af 48, Kick · Trommer 55 (to kørsler, samme tal). Testbrowseren: 67, 29, 72, 43, 34, 42.
- **Udelukket ved forsøg:** generatorens indstillinger (genre, tempo, swing, ekko, rum, lydstyrker, mute), EQ, Normalisering Fast, Adaptiv tærskel, flueben for analysens dele, en indlæst sang der spiller, generatoren startet og stoppet. Alle gav præcis de samme tal. OfflineAudioContext er altid 44,1 kHz.
- **Fundet:** browseren regner ikke generatorens lyd bit for bit ens fra kørsel til kørsel (melodi og trommer afviger, bassen ikke; også uden rum-klang). I testbrowseren flytter det højst ét slag. Brugerens Chrome (Windows) kan regne lyden mere anderledes; hvor et slag ligger lige ved tærsklen, eller taktslaget lige mellem to faser, tipper tallet.
- **Brugerens rapport (v9.113, Chrome 157, Windows, 26,6 s; to kørsler ens):** tempoet er det samme som i testbrowseren (123,3 · 123,3 · 90 · 86,3 · 132,5 · 112,3), tonerne er ens (12 · 47 · 79), men fasen i House er 3 og 1 (testbrowseren 0 og 0), så Takt 1 = 0 af 48, og Kick er 79 (bedste tærskel 0,50 giver 87; Kick · Trommer 55, 0,55 giver 81). Ingen fejl i testen: lyden regnes forskelligt, og fasen og kicket ligger på vippepunktet (A3).
- **Til planen (brugeren er enig):** hver slags facit på sin egen side: 1 Generatoren (bliver) · 2 ren matematik (næste, når brugeren skriver kør) · 3 lydfil + MIDI · 4 udgivne sæt med facit (brugeren og hovedchatten leder: Groove MIDI Dataset, Slakh2100, MUSDB18, Harmonix Set; licens skal tjekkes) · 5 Detektion. Se `docs/PLAN-SANG-OG-ANALYSE.md`.

## Rækkefølgen for analysen

A2 sikkerhedsgrænse og enighed i reglerne → A3 bedre slag (**først** taktslagets halve takt og kickets ekko) → A4 Lydtidslinjen → A5–A6 det lokale modul. Plan: "Den nye analyse P8.19" https://claude.ai/artifact/XEhWRPjamxqHZX7jhV1ESs · skema P8.25: https://claude.ai/artifact/VKviSHX9KRu9f8Rw4Z9QJU · kort plan i repoet: `docs/PLAN-SANG-OG-ANALYSE.md`.

## Åbne spørgsmål

1. Pigernes egenskaber (`docs/PIGERNES-EGENSKABER.md`): ligger stille.
2. Feltfarven D7: ikke valgt.
3. Det lokale modul (`docs/LOKALT-MODUL-INSTALLATION.md`): Pinokio først; om en fil-side kan nå `127.0.0.1` (CORS, Local Network Access) skal prøves i brugerens Chrome.
5. Rest fra A0: cirklen på lydtræk-noderne og i Foreslå regler. 6c Figur-generatoren venter.
