# Status til hovedchatten · afsnit flyttet fra hovedfilen

*Flyttet 20. november 2026 (v9.123), så `docs/STATUS-TIL-HOVEDCHATTEN.md` holder sig til cirka 80 linjer. Uændret tekst.*

## P8.30 trin 1 (v9.115): testlyd i ren matematik

- **V8:** testlyden regnes af programmets egen kode (ikke browserens lydmotor). Samme 6 mønstre, tempi, toner og frø; kickets ekko, rum, åben hihat, bas mellem slagene og støj i Breakbeat er med. Bit for bit ens: to kørsler giver de samme 17 fingeraftryk, og Node 22 (en anden udgave af V8) giver det samme som Chrome 153. **Prøvet af brugeren (Chrome 157, Windows, 14,8 s): alle 17 fingeraftryk og alle tal er de samme som Codes.** Testen tager 15–18 s i testbrowseren (før 40 s).
- **V1:** "Testlyd" ved det samlede tal, i tabellen og i boblen ("Målt på testlyd, ikke på din sang"); det samlede tal er uden de præcise målinger (99) og uden ?; med 4 spor viser cirklen ved Kick, Snare og Hihat tallet for Trommer, og boblen siger det. Tal fra generatoren (v9.110–v9.114) bruges ikke; de står svagt i *Tidligere målinger* under stregen "Ny testlyd fra v9.115".
- **1c:** rapporten har pr. mønster tempoets sikkerhed, fasens sikkerhed og den rigtige fase, for hele lyden og for trommerne alene.

| Lydtræk (testlyd, v9.115) | Hele lyden | Kun trommerne / ét instrument |
| --- | --- | --- |
| Kick | 60 (bedste tærskel 0,35 → 61) | 40 (0,35 → 41) |
| Snare | 33 | 35 |
| Hihat | 80 | 76 |
| Taktslag | 33 | 33 |
| Takt 1 | 33 | 0 |
| Tonehøjde | 12 | melodien alene 87 |
| Basens tone | 44 | Tonehøjde · Bas 85 |

Pr. mønster (House kun trommer · House · Hip-hop · DnB · Techno · Breakbeat): Kick 17 79 73 100 43 73 · Taktslag 0 0 0 98 0 98 · Takt 1 0 0 0 94 0 94. Fundet tempo: 123 · 123 · 90 · 172,3 · 132,5 · 139,8 (DnB og Breakbeat er nu rigtige). Fase-sikkerhed 0,08–0,24 overalt (lav). **Codes læsning:** testlyden er lidt hårdere end generatorens lyd i House: taktslagene lægges en halv taktslag-længde for sent (0,743 s mod 0,500 s), dvs. på den åbne hihat, også uden bas; kickets falske slag ligger, hvor ekkoet er (0,859 s). Det er A3 punkt a, b og d. Hovedchattens læsning af takt 1 (fasen vælges på næsten ens pladser) passer med den lave fase-sikkerhed.

