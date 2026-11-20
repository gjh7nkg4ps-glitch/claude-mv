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

---

*Flyttet 20. november 2026 (v9.125):*

## Brugerens rapport fra v9.117 (Chrome 157, Windows, 20. november kl. 20.09)

- **Præcis de samme tal som Codes**, både Testlyd (14,8 s; alle 17 fingeraftryk ens) og Rigtige trommer (23 stykker på 11 s). A3 virker ens på begge pc'er.
- **Fund: fasens sikkerhed er ikke til at stole på endnu.** Den nye værdi (forskellen mellem bedste og næstbedste plads) er høj, også når takt 1 er forkert: House med bas 0,75 (forkert), Techno og Breakbeat i hele lyden 1 (taktslagene ligger ved siden af slagene). Lav værdi ved rigtige faser (House kun trommer 0,23). Den bør rettes, før den bruges i A2 (sikkerhedsgrænse); i dag står den i rækken *Bedre slag og takt (A3)* og i boblen ved Takt 1.
- **v9.118 (rettelse, fundet af testpakken, test 57):** kick i lineær skala nåede ikke tærsklen i stille stykker af sange over 10 minutter (*Lange sange* måtte højst skrue 4 gange op); for kick nu 16 gange. Korte sange er uændrede.
- **Ikke målt:** korte sange med et meget stille afsnit (fx en stille intro med svage kick); den lineære kick kan overse dem, fordi hele sangen normaliseres samlet. *Adaptiv tærskel* hjælper.

---

*Flyttet 20. november 2026 (v9.126):*

## P8.30 trin 2 (v9.116): Rigtige trommer (MDB Drums) · udgangspunktet for A3

23 stykker, 46 lydfiler, 16 s første gang, 2 s fra cachen. Standard-reglen, ±50 ms (slag), ±70 ms (taktslag). Bækken (CY) og tammer (TT, OT) er neutrale.

| Lydtræk | Hele mixet | Kun trommerne | Bedste faste tærskel (mix / trom) |
| --- | --- | --- | --- |
| Kick (KD, 1539) | 63 (falske 783, oversete 474) | 72 (falske 911, oversete 164) | 0,15 → 64 / 0,40 → 73 |
| Snare (SD, 2654) | 34 (falske 831, oversete 1940) | 46 (falske 496, oversete 1700) | 0,10 → 38 / 0,10 → 51 |
| Hihat (HH, 2639) | 68 | 72 | 0,50 → 69 / 0,25 → 72 |
| Taktslag (2694) | 81 | 77 | – |
| Takt 1 (680) | 17 | 6 | – |

Næsten alle stykker er cirka 110 BPM (fundet 110); BebopJazz og Gospel er 222 (fundet 110, det halve). Fase-sikkerheden er 0,05–0,50. **Codes læsning:** Taktslag er godt på rigtig musik, men Takt 1 er dårlig (samme fejl som i testlyden). Kick har mange falske slag, især på trommerne alene (911); Snare overser de fleste (1700–1940): de svage slag (ghost notes) i jazz trækker ned.

