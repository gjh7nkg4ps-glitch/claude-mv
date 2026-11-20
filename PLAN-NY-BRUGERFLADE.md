# PLAN · NY BRUGERFLADE · P8.9 (kun det, der ikke er bygget)

*Kortet ned 20. november 2026 (P8.23). Den fulde plan med alle faser, gennemgangen af v9.42, valgene, fjerne-listen og pakkerne ligger uændret i `docs/arkiv/PLAN-NY-BRUGERFLADE-fuld-P8_20.md`. Fase 0–7, pakke 1–7, oprydningstrinnet, P8.14 punkt 1 og 3, gitteret, D1–D3, D6 og PS1 er bygget (v9.43–v9.107; én linje pr. version i `docs/arkiv/HISTORIK.md`).*

**Det, der mangler fra planen:** PS2–PS4 (`docs/PLAN-PAA-SCENEN.md`), 6c Figur-generatoren (§ 4.2), pigernes egenskaber (brugerens valg), det under *Senere*.

---

## 1 · Regler for arbejdet (gælder foran alt andet i planen)

1. **Én pakke pr. "kør"** (P8.3; før: ét trin pr. "kør"). Code bygger alle trin i pakken. Hvert trin får stadig sit eget versionsnummer, sin egen test og sit eget gem. Code stopper midt i en pakke, hvis en test fejler og ikke kan rettes sikkert, eller hvis et trin kræver et valg fra brugeren. Pakkerne står i afsnit 1.2.
2. **Brugeren prøver den sidste version i pakken med musik** (P8.3; før: hver version). Afleveringen har en kort liste over, hvad der skal prøves for hvert trin. Brugeren svarer "ok" eller "ikke ok".
3. **Hvert trin fjerner noget.** Afleveringen viser tallene før og efter: knapper, vinduer og filens størrelse.
4. **Funktioner må forsvinde.** Reglen "ingen funktion må forsvinde" (funktionslisten, 106 af 106) gælder ikke længere. Det, der fjernes, er det, brugeren krydser af i fase 0. Koden ligger stadig i git-historikken.
5. **Ingen udvikler-tekst på skærmen.** Ingen trin-numre, versionsnumre på biblioteker, vinduesnumre eller "106 af 114". Den slags hører hjemme i Hjælp.

De faste regler i `CLAUDE.md` gælder stadig: test før aflevering, versionsnummer i filnavn, program og svar, manualen opdateres, og gamle gemte indstillinger skal kunne åbnes.

*Hvorfor regel 2 og 4:* fra 7. til 11. november blev der bygget 24 versioner (v9.19 til v9.42). Hver version bestod sine kodetest, men ingen blev prøvet med musik undervejs. Og fordi intet måtte forsvinde, kom indholdet af de fire slettede vinduer ind i Node-editoren igen (v9.39 og v9.41).

### 1.1 · Skærmstørrelse

Programmet bygges ikke til én bestemt skærmstørrelse. Det tilpasser sig det vindue, det får (fagudtryk: responsive layout).

1. **Mindste størrelser i stedet for faste størrelser.** En celle i matrixen bliver aldrig mindre end 44 × 40 punkter. På en større skærm ser man flere rækker og kolonner, ikke større celler.
2. **Én indstilling, der hedder Størrelse** (fagudtryk: UI scale), så brugeren selv kan gøre tekst og celler større eller mindre.
3. **Code prøver hver version i tre størrelser:** 1920 × 1080, 2560 × 1440 og 3840 × 2160.

Skitserne er tegnet i 2560 × 1440. Det var en antagelse i gennemgangen og ikke et valg.

---

---

## 4 · Det, der ikke er bygget

### 4.2 · P8.14, P8.15 og P8.16 (19. november): det næste efter pakke 7

Skrevet ind af Claude Code efter brugerens beskeder (`docs/arkiv/BESKED-TIL-CODE-19-nov-P8_14.txt`, `…P8_15.txt`, `…P8_16.txt`).

**Rækkefølgen (P8.14 punkt 8):** 1) punkt 1 (svar 1B, 2B, 3B) og punkt 3 (små rettelser a–f) med næste "kør": **lavet i v9.94–v9.101**; 2) svar på punkt 5 (`docs/arkiv/SVAR-P8_14.md`) og planen for punkt 7 (`docs/PLAN-PAA-SCENEN.md`): **lavet**; 3) **"På scenen"** (punkt 7), når brugeren har sagt ja til planen; 4) **6c Figur-generatoren** (punkt 2).

**6c Figur-generatoren · beslutningerne er truffet (P8.14 punkt 2; skitsen "Skitse: Figur-generatoren P8.11", https://claude.ai/artifact/8kkrE327ui87cjM1gkQi55):**
- To veje ind: **Fra lyden** (standard) og **Fra figuren**.
- Galleri med **6 levende forslag**, der bevæger sig til sangen. Figurer og karakterer blandes som standard; knapperne Begge · Figurer · Karakterer øverst.
- Fra lyden: sikre lyde (● og ▲) øverst, usikre (!) sidst og svagere. Generatoren bruger kun usikre lyde, hvis brugeren vælger dem.
- Fra figuren: figurens regel-sæt fra Biblioteket (Rolig, Energisk, På trommerne, På vokalen, Hele bandet) + ét nyt mix af to lyde. De nye figurer (fugle, fønix, sanger, ny trommeslager, guitarist, mandlig danser) står gråt under "Kommer senere".
- Knapper: Nye forslag · Flere som den valgte (ændrer KUN udseendet; lyd og bevægelse bliver) · forrige forslag · frø. **Ingen Lås.**
- Til højre: det valgte forslag og de regler, det giver. Læg på scenen (reglerne kommer som forslag, stiplede celler) · Gem i Biblioteket (Mit) · Erstat den valgte figur. Alt kan fortrydes i ét trin; linjen Indlæst viser det.
- Opskrifterne (hvilke figurer passer til hvilke lyde) som i skitsens afsnit 4.
- Den gamle generator (mange tilfældige figurer) fjernes, når den nye virker. Hvor generatoren bor, bestemmer Code.
- Generatoren skal også kunne foreslå effekter, når "På scenen" er bygget.

**Nye 2D-figurer (P8.15 punkt 3):** de nye karakterer bygges på et **skelet med led** (fagudtryk: rig), Cascadeur som inspiration, så de bevæger sig som rigtige kroppe; ragdollen kan senere bruge det samme skelet. (Flyttet fra Idé-kassen.)

**Pigernes egenskaber (P8.14 punkt 9):** listen står i `docs/PIGERNES-EGENSKABER.md`; brugeren vælger; intet fjernes før da. **Senere (P8.20 punkt 4):** Pigernes egenskaber: brugeren vælger senere; forslag fra hovedchatten: fjern de fem, der intet viser, og fold de "lidt"-synlige sammen under *Finere detaljer*.

**P8.20 (19. november, `docs/arkiv/BESKED-TIL-CODE-19-nov-P8_20.txt`):** planen for "På scenen" er godkendt (vinduet hedder *På scenen*, 2 · Scene beholder navnet; effekterne nederst, foldet fra start som *Effekter (19) · hele billedet*, alle tre afsnit kan foldes, og det huskes; effekternes regel-sæt hedder efter effekten, fx *Lys-puls på kick*). Rækkefølge: hele testpakken først, så **PS1, og STOP efter PS1**. D6 bygges ikke før et ja. Analysen: planen "Den nye analyse P8.19" (A0–A8) venter på brugerens valg a–e; byg intet.

**Analysen (P8.14 punkt 4, P8.16 punkt 2):** analysen er programmets hjerte (grundregel i `CLAUDE.md` afsnit 3); byg intet nyt i analysen, før samtalen med hovedchatten er ført (skemaet "Status og lydtræk P8.10", https://claude.ai/artifact/UvGRe7tbJ1RN5xWigewvNV, og procenterne i P8.12).

**Senere (P8.14 punkt 6, P8.15 punkt 2, P8.16 punkt 1; byg ikke nu):** indbygget spor-deling som et lokalt modul (ét klik at installere; MV virker uden; `docs/arkiv/SVAR-P8_14.md` f siger, om browseren alene kan); målervæg (meter bridge); et ekstra tema med tekstur, glans, kanter og former; Radial Mesh-værksted (kopi, rigtig bloom, sort baggrund med stjerner og galakser, det rejsende lys må ikke forringes); stregerne i Node-editoren lige efter analysen; S7 og S8 sammen med analysen; **.stem.mp4** læses, og sporene havner på deres pladser af sig selv (som Vælg 4 filer …; Native Instruments' gratis Stem Creator Tool kan samle 4 spor til én .stem.mp4).

**P8.18 (19. november, `docs/arkiv/BESKED-TIL-CODE-19-nov-P8_18.txt`; svar i `docs/arkiv/SVAR-P8_18.md`):** **D1–D3 er bygget i v9.104** (Gemt ✓ og banner, når gemningen fejler; tasten ?; Hvad er nyt på startskærmen). **D6:** *Gem alle på computeren* dækker kun Opsætning 1–20; forslaget *Gem hele arbejdet / Hent hele arbejdet* (én fil med alle `rytme-*`-nøgler) bygges efter ja. **Senere:** **D4** ét fælles Fortryd (lyset i Mesh 3D og Øjet, EQ+ og Form-editorens egen historik ind under Ctrl+Z); **D5** manualen som sidepanel (en zone i docking i stedet for dialogen). **Uændret:** **D7** feltfarven røres ikke, før brugeren har valgt. Ingen af punkterne må fjerne noget eksisterende.

### Senere (ikke en del af faserne, tilføjet i P8.2)

- **Oprydningstrin efter pakke 7 (P8.9, punkt 3):** blokkene får navne efter, hvad de gør (testene rettes med), og den skjulte kode fra Generator (fuld), Lydlag, Audit og Detektion fjernes, når kortet Generator og Foreslå regler er løst fra den. **Første bid er lavet i v9.92** (Håndtag i billedet, den gamle Matrix-visning, data-ne9-lytterne; blokken v9.42 omdøbt), **anden bid i v9.93** (Normalisering-knappen, Linjer-knapperne, Audit, Niveau-resterne). Resten venter på svar: bloknavne (A/B), Detektion (fjern/flyt), Generator (fuld) (funktionerne må forsvinde eller skal ind i kortet).
- **Nye 2D-figurer (P8.6):** fugle, der danser med pigerne, en fønix med flammer, en sanger, en ny trommeslager, en guitarist og en mandlig danser; alle i den nuværende 2D-scene (Live preview). Bygges ikke nu.
- **3D-scene (P8.6):** en ny 3D-scene ved siden af Live preview, styret af de samme regler og den samme matrix; ragdollen (Lyd-dukken) skal ind her senere. Bygges ikke nu.
- **Analysen (P8.6):** se `docs/PLAN-SANG-OG-ANALYSE.md`, afsnit 10.
- **Sang og analyse (tilføjet 17. november):** brugerens ønske om en opdateret Lydkilde-menu og et avanceret layout til musik-analyse (inspiration: tre billeder af AURA Studio) har sin egen plan: `docs/PLAN-SANG-OG-ANALYSE.md` (udkast 1; trin S0 til S8; kun S0, bjælken og Annullér, er lavet i v9.68). Brugeren vender planen med hovedchatten; intet bygges før et "kør".

- **En ny global styring**, måske af Øjet, bygges på en anden måde end Morph Pad. Morph Pad var et forsøg på hurtig global styring og virkede ikke efter hensigten; den fjernes helt (afsnit 3.1). Den nye styring bygges ikke, før der er en skitse.

---

---

## 5 · Det, der ikke må ændres

- EQ-visningens grafik. Nye EQ-ting kommer som noget ekstra.
- Levende figurer og Morgenstjernen.
- Mesh 3D, Radial Mesh, Øjet og Live preview er programmets hovedattraktioner.
- **Radial Mesh: lyset rejser gennem banerne i takt med lyden.** Banerne lyser ikke bare op; man ser lyset bevæge sig. Den virkning må ikke ændres. (Tilføjet i P8.2.)
- Motoren skal regne præcis som før (testene findes).
- Gamle gemte indstillinger skal kunne åbnes (test 12).
- Grundreglen: "Jeg skal kunne forstå, hvad der sker, uden at noget er skjult."

---

---

## 6 · Model i Claude Code

| Arbejde | Model |
| --- | --- |
| Fase 0: kortlægning af hele koden | Fable 5.2 |
| Fase 1: opbygningen af den fælles indgang til reglerne | Fable 5.2 |
| Fase 5: opdelingen i arbejdsområder | Fable 5.2 |
| Alt byggeri, fejlretning, test og manual | Opus 5.5 |
| Opus kører fast i den samme fejl to gange | Skift til Fable 5.2 for den ene opgave |

Modellen skiftes med `/model`. Fable koster det dobbelte pr. token og bruger derfor kvoten hurtigere end Opus.

---
