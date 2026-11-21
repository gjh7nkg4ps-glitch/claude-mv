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

---

*Flyttet 21. november 2026 (v9.130):*

## P8.30 trin 3 (v9.117): A3 første del, før → efter

A3 slået til ét skridt ad gangen i P8.31's rækkefølge (Kick · Taktslag · Takt 1; skridt 3 = programmet med A3 til; Snare og Hihat ændres ikke):

| Skridt | Testlyd hele | Testlyd trommer | Rigtige hele mixet | Rigtige trommer |
| --- | --- | --- | --- | --- |
| 0 · før | 60 · 33 · 33 | 40 · 33 · 0 | 63 · 81 · 17 | 72 · 77 · 6 |
| 1 · + Takt 1 | 60 · 33 · 33 | 40 · 33 · 33 | 63 · 81 · 42 | 72 · 77 · 25 |
| 2 · + halve takt | 60 · 49 · 47 | 40 · 81 · 76 | 63 · 81 · 47 | 72 · 84 · 30 |
| 3 · + kickets ekko | 92 · 49 · 31 | 94 · 81 · 76 | 70 · 81 · 47 | 75 · 85 · 40 |

- **d) Kick:** stigningen i basbåndet måles i lineær skala, ikke logaritmisk (et ekko i næsten stilhed blev målt som 1,00, det rigtige kick i ekkoets hale som 0,69). Regnes ud fra det gemte basbånd, så cachen virker. En maske efter kraftige slag (hovedchattens forslag: tærskel, der følger niveauet) blev prøvet og gjorde Kick dårligere alle steder (Rigtige 63 → 55–58).
- **b) Taktslag:** flyttes en halv slaglængde, når kicket mellem de fundne slag er 1,6 gange større end på dem. Andre vægte i anslagsstyrken blev prøvet; de hjalp testlyden, men skadede de rigtige trommer lidt.
- **a) Takt 1:** kick − ½ × snare (sum over fire rammer, fordi et slag mellem to rammer ellers taber) + skift i klang og toner (12 toner, når de findes; ellers 4 bånd). Hovedchattens læsning passede: accenten alene er næsten ens i House; snare-målingen peger forkert (den reagerer på kickets klik, og klappet ligger i mid).
- **c) Tempo:** Testlyden finder nu alle 6 tempi; BebopJazz og Gospel (222) findes som 110 (det halve). Står i planen. Kan slås fra: Indstillinger for analysen → *Bedre slag og takt (A3)*; med Fra er alle tal præcis som før (test 100).

---

*Flyttet 21. november 2026 (v9.132):*

## v9.124 (A3, taktgitter fra Trommer-sporet med 4 spor; P8.30 b)

- Med 4 spor regnes anslagsstyrken, tempoet, taktslagene og den halve takt ud fra Trommer-sporet; takt 1 med Trommer-sporets kick og snare og hele lydens toner. Afsnit, toneart og lydtrækkene kommer stadig fra hele lyden. Valg: Indstillinger for analysen → *Taktgitter med 4 spor* (Trommer-sporet, standard / Hele lyden).
- **Målt** (Testlyd: hele lyden med trommerne alene som Trommer-spor; Rigtige trommer: MIX med Drum som Trommer-spor), nye rækker i Analyse sikkerhed: Testlyd Taktslag 49 → **78** (pr. mønster 97 0 98 0 0 → 97 98 98 97 0), Takt 1 31 → **73** (88 0 0 94 0 0 → 88 94 94 88 0); Rigtige trommer Taktslag 81 → **85**, Takt 1 69 → **72** (ModalJazz 0 → 100, FunkJazz 96 → 0). Breakbeat er stadig forkert (kicket ligger mest på modslaget, også i trommerne alene). Testlyden genbruger lyd og analyse fra testens første del, så testen tager stadig cirka 16 s.
- Med 4 spor viser cirklen ved Taktslag og Takt 1 tallet for 4 spor (som Kick, Snare og Hihat viser Trommer-tallet), og boblen siger hvorfor. Dine egne spor bruges aldrig inde i testene.

---

*Flyttet 21. november 2026 (v9.132):*

## v9.125 (A2, Kræv sikkerhed og enighed)

- Hver regel har feltet `sik` (skyderen *Kræv sikkerhed* i kontrolpanelet over Gate; 0 = Fra). Reglen virker kun, når lydtrækkets sikkerhed lige nu er mindst så høj: pr. øjeblik for Tonehøjde og Toneklasse (Tonesikkerhed, også pr. spor) og Takt 1 (fasens sikkerhed takt for takt: takternes enighed i 9 takter omkring stedet); ellers det faste tal fra Analyse sikkerhed (det, cirklen viser); ikke målt spærrer ikke. Motoren lukker reglen som Gate; uden `sik` regnes præcis som før (test 106).
- Rækkefølgen: tærskel → sikkerhed → Gate (enighed: en anden kilde skal også være over sin tærskel) → hysterese og spærretid → handling. Mærket "≥ 80 %" på regel-noden er rødt, mens reglen er spærret. Foreslå regler hæver tærsklen 0,1 for lydtræk under 75 %. Lyd over tid skraverer Taktslag, hvor takt 1 er usikker (under 0,5).
- **Mangler:** sikkerhed pr. hændelse for Kick, Snare og Hihat (i dag fast tal), så grænsen også virker pr. øjeblik på slagene; det hører til A4 (hændelser med sikkerhed).

## v9.126 (A4, Lydtidslinjen, første del)

- Lyd over tid har rækken *Hændelser* med fire baner: Kick, Snare og Hihat fra standard-reglen (samme som Analyse sikkerhed; med 4 spor fra Trommer-sporet) og Takt 1 fra taktgitteret. Sikkerhed pr. hændelse (et skøn): for slagene tallet fra Analyse sikkerhed × (0,6 + 0,4 × hvor langt slaget når over tærsklen); for Takt 1 fasens sikkerhed takt for takt. På testlyden 120 BPM rammer alle 59 kick de rigtige slag.
- Rettelser pr. sang (`rytme-tl|navn|bytes`, kommer med i Gem hele arbejdet og de automatiske kopier): klik vælger, Slet/Delete, træk eller ← → (10 ms) flytter, dobbeltklik tilføjer, Fortryd rettelse, Nulstil rettelser. *Hør analysen* spiller et klik pr. hændelse under afspilning. *Gem tidslinje* giver JSON-formatet `lydtidslinje` (sang, kurver 10 pr. s, haendelser med spor, t, slut, styrke, sikkerhed, tone, ord, kilde, afsnit, rettelser); *Hent tidslinje* henter rettelserne til samme sang.
- **v9.127 (anden del):** rettelserne bruges af reglerne: slettede, flyttede og nye slag retter kurverne Kick, Snare, Hihat (med 4 spor også Trommer-sporets) og Takt (første slag), som reglerne læser; kun for den hentede sang, aldrig i testene; Hændelser regnes af de urørte kurver; knappen *Rettelser i reglerne: Til/Fra*. **Næste:** hændelser fra en fil (det lokale modul A5–A6 kan skrive formatet); sikkerhed pr. hændelse målt mod facit.

