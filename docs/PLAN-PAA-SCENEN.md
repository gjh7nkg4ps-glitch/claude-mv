# Plan: "På scenen" · karakterer, figurer og effekter ligestillet (P8.14 punkt 7)

Udkast 1 · 19. november 2026 · skrevet af Claude Code. **Bygges først, når brugeren har sagt ja.** Efter planen følger 6c (Figur-generatoren, `PLAN-NY-BRUGERFLADE.md`).

## 1. Sådan er det i dag

| | Figurer og karakterer | Effekter |
| --- | --- | --- |
| Hvor de ses | vinduet **Figurer** (w34) i 2 · Scene: én række pr. figur med tegn, navn, antal regler, øje (på scenen eller i kassen) | ingen liste; de 19 effekter er mål i `TARGETS` (Lys-puls, Baggrundsfarve, Partikel-burst, Bølge i banen, Glød, Kamera-ryst, Banens fart, Zoom-puls, Chokbølge-ring, Strobe-blink, Spor-lys, Partikelsky, Dæmpningsringe, Ekko-skygger, Usikkerhedssky, Prioritet, Relationer, Halespor, Dybdeskarphed) og står i matrixen og Noder i grupperne *Scene-effekter*, *Lys og former*, *Bane*, *Efterspil og orden*, *Levende* |
| Læg på / tag af | øjet i Figurer (`opScene`) | findes ikke; en effekt er altid "på" og tegner, når dens regler giver noget |
| Slå fra | figurens Slå fra i Noder (`o.neFra`: reglerne giver 0) | kun pr. **gruppe** (`scene.ne.grp[navn].fra`) i Noder |
| Øje (tegnes ikke) | ja | kun pr. gruppe (`scene.ne.grp[navn].skjult`) |
| Styrke | figur-styrke (`o.neStyrke`) | pr. gruppe (`scene.ne.grp[navn].styrke`) |
| Regel-sæt | ja (Biblioteket, valg C) | nej |
| Biblioteket | hylden Figurer | nej |
| Navne i Live preview | Navne: Til (v9.100) | nej (kommer i et hjørne, P8.15) |

## 2. Det, der ændres

- **Én liste "På scenen"** i 2 · Scene (vinduet Figurer får navnet *På scenen*) med tre afsnit: **Karakterer** (figurer med laget *danser*: pigerne, danseren, dronningerne), **Figurer** (alle andre: discokugle, Morgenstjerne, Perfect, egne), **Effekter** (de 19 fra `TARGETS` med mærket *hele billedet*). Samme række for alle tre: tegn, navn, antal regler, **øje**, **Slå fra**, styrke, ⋯ (regel-sæt, Vis i matrix, omdøb for figurer).
- **Effekterne får hver sit øje og Slå fra** (`scene.ne.eff[id] = {skjult, fra, styrke}`), og motoren spørger pr. effekt (`neFraF` og tegningen af effekten). Gruppernes øje, Slå fra og styrke i Noder bliver stående som "alle i gruppen" (sætter alle effekter i gruppen).
- **Biblioteket får hylden Effekter**: ét kort pr. effekt med et lille levende tegn, Brug (= øjet til), og **regel-sæt til effekter** (fx *Lys på kick*, *Farve på toneart*, *Bane på slag*; de kendte fra DEFAULT og Standard). Valg C gælder også her: kun sæt, der passer til effekten.
- **Figur-generatoren (6c)** kan foreslå effekter som "forslag med regler", på samme måde som figurer (det står i P8.14 punkt 2 som "generatoren skal også kunne foreslå effekter").
- **Navne i Live preview**: med Navne: Til står effekternes navne (de, der lige nu giver noget) i et hjørne (P8.15).
- **Matrixen og Noder**: en effekt, der er slået fra eller har øjet lukket, vises som i dag for figurer (grå kolonne, mærket *fra*).

## 3. Det, der flyttes

- Øje, Slå fra og styrke for effekterne flytter fra gruppe-niveau (Noder) til pr. effekt (listen På scenen, Noder, matrixens kolonne). Gruppe-knapperne bliver som genvej.
- Figurers knapper (Duplikér, Slet, ▲ ▼, Vis i spindelvæv, Figur-generatoren) bliver i afsnittene Karakterer og Figurer; Effekter har kun øje, Slå fra, styrke og ⋯.

## 4. Det, der fjernes

- Intet i denne omgang. Når listen virker, kan gruppernes øje og Slå fra i Noder fjernes, hvis de er i vejen (dit valg).

## 5. Det betyder for de indbyggede opsætninger

- **Ingen ændring i tal eller tegning**: alle effekter har øjet åbent og Slå fra slået fra som standard (`scene.ne.eff` tom = som i dag), så Pigernes show, Danserens solo, Morgenstjernens dans, Diskodronningerne, Singlen, Tast og MIDI og Klaverspil tegner præcis som før (test 80's fingeraftryk ændres ikke).
- Gemte opsætninger og Mine shows uden `scene.ne.eff` åbner som i dag. `sceneKopi` tager `ne.eff` med, så en opsætning husker, hvad der er slået fra.
- Standard (DEFAULT, 11 regler) rører vi ikke.

## 6. Trin (ét pr. "kør", hver med egen test ved tre skærmstørrelser)

| Trin | Hvad | Fjerner |
| --- | --- | --- |
| PS1 | Listen På scenen (w34) med de tre afsnit; effekternes øje, Slå fra og styrke i `scene.ne.eff`; motoren og tegningen spørger pr. effekt; Ctrl+Z dækker det. **Bygget i v9.107** (test 94) | intet; tal: 19 nye rækker |
| PS2 | Biblioteket: hylden Effekter med kort og regel-sæt til effekter; Brug = øjet til; valg C. **Bygget i v9.108** (sættene ligger i `PS_SAET`, ikke i `NE11_STD`; test 95) | intet |
| PS3 | Noder og matrixen viser øje/Slå fra pr. effekt; Navne: Til skriver effekternes navne i et hjørne. **Bygget i v9.109** (test 96). Figur-generatoren (6c) får adgang til effekterne, når 6c bygges | gruppernes knapper i Noder bliver genveje |
| PS4 | Lukket 20. november: brugeren valgte, at gruppernes øje og Slå fra i Noder bliver ("alle i gruppen"). Intet bygges. | ingen |

## 7. Spørgsmål til brugeren · **besvaret i P8.20 (19. november): ja til alle tre**

Vinduet hedder **På scenen** (2 · Scene beholder navnet). Effekterne står **nederst**, foldet fra start som *Effekter (19) · hele billedet*; alle tre afsnit (Karakterer, Figurer, Effekter) kan foldes, og programmet husker, hvad der er foldet ud. Effekternes regel-sæt hedder **efter effekten** (fx *Lys-puls på kick*). Rækkefølge: hele testpakken først, så PS1, og **stop efter PS1**, så brugeren kan prøve den før PS2.


1. Skal vinduet hedde **På scenen** (og 2 · Scene beholde navnet)?
2. Skal effekterne stå **øverst eller nederst** i listen? (forslag: nederst, foldet som *Effekter (19) · hele billedet*)
3. Regel-sæt til effekter: skal de hedde det samme som figurernes (Rolig, Energisk, På trommerne, På vokalen, Hele bandet) eller efter effekten (fx *Lys-puls på kick*)? Forslag: efter effekten, fordi én effekt kun har ét mål.
