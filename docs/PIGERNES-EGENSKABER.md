# Pigernes egenskaber (P8.14 punkt 9) · 19. november 2026

Pigerne (Lyshåret pige, Pige på stangen), Danseren og Diskodronningerne er alle laget **danser**, så de har de samme egenskaber: **58 egne** (`DANS_PROPS`) og **24 fælles** (dem, alle figurer har). Alle 58 egne læses af tegningen (`tegnDanser`), så "viser intet" betyder her: ændringen kan ikke ses i praksis, eller den gælder ikke en danser. **Intet er fjernet.** Du vælger.

Kolonnen *Viser* er Codes skøn ud fra koden og testbilleder; *Shows* = de indbyggede opsætninger Pigernes show (P), Danserens solo (D), Diskodronningerne (Q) har en regel på egenskaben; *Regel-sæt* = indbyggede regel-sæt, der bruger den (Dansemapping, Dans på trommer, Dans på bas og vokal, Rolig, Energisk, På trommerne, På vokalen, Hele bandet, Puls på kick).

## Bevægelser (styres af regler)

| Egenskab | Navn | Viser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| dKnae | Knæbøj | tydeligt | P D Q | Dansemapping, Dans på trommer, Energisk, På trommerne, Hele bandet |
| dHop | Hop (løft fra gulvet) | tydeligt | P D Q | Dansemapping, Dans på trommer, Energisk, På trommerne |
| dArmV | Arm til venstre i billedet: løft | tydeligt | P D Q | Dansemapping, Dans på trommer, Energisk, På trommerne, Hele bandet |
| dArmH | Arm til højre i billedet: løft | tydeligt | P D Q | Dansemapping, Dans på bas og vokal, Energisk, På vokalen, Hele bandet |
| dHoved | Hoved: dreje og vippe | tydeligt | P D Q | Dansemapping, Dans på trommer, Energisk, På trommerne, På vokalen |
| dHofte | Hofte: svaj | tydeligt | P D Q | Dansemapping, Dans på bas og vokal, Rolig, Hele bandet |
| dHaar | Hår: sving | tydeligt (langt hår), lidt (knold og bob) | P D Q | Dansemapping, Dans på trommer, Rolig, På trommerne, Hele bandet |
| dKjole | Kjole: svirp | tydeligt (kjole), intet (top og nederdel uden vidde) | P D Q | Dansemapping, Dans på bas og vokal, Rolig, Hele bandet |
| dGlaede | Glæde (smil) | lidt (kun munden) | P D Q | Dansemapping, Dans på bas og vokal, Rolig, På vokalen, Hele bandet |
| dKrop | Krop: læn til siden | tydeligt | P Q | Dans på bas og vokal, Rolig, På vokalen |
| dStang | Stang: sving om stangen | tydeligt, kun når stangen er vist (dStangVis) | – | – |
| dSpot | Spot (lys ovenfra) | tydeligt | P D Q | Dansemapping, Energisk, På vokalen, Hele bandet |
| dGulvPuls | Gulv: puls i fliserne | tydeligt, kun med gulv (dGulv) | P D Q | Dansemapping, På trommerne |

## Fjedre (hvordan bevægelserne følger efter)

| Egenskab | Navn | Viser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| dAlterner | Skift side for hvert slag (hofte, hoved, hår, krop) | lidt (kun med regler på de fire) | P D Q | – |
| dFjeder | Fjedre: stivhed | lidt | – | – |
| dEfterslaeb | Efterslæb (hår og kjole svinger efter) | lidt | – | – |
| dForvent | Forventning (nedbøjning før hop) | lidt (kun ved hop) | – | – |
| dSquash | Squash og stretch | lidt | – | – |
| dSvaj | Rolig grundbevægelse (svaj og vejrtrækning) | lidt (ses, når musikken er stille) | – | – |
| dTempo | Grundbevægelsens tempo | lidt | – | – |

## Krop

| Egenskab | Navn | Viser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| dHudH | Hud: tone | tydeligt | – | – |
| dHudS | Hud: mætning | lidt | – | – |
| dHudL | Hud: lys | tydeligt | – | – |
| dSlank | Kropsbygning (slank til kurvet) | tydeligt | – | – |
| dTalje | Taljens smalhed | lidt | – | – |
| dBenLaengde | Benlængde | tydeligt | – | – |
| dArmLaengde | Armlængde | tydeligt | – | – |
| dHovedStr | Hovedets størrelse | tydeligt | – | – |
| dSkulder | Skulderbredde | lidt | – | – |

## Ansigt

| Egenskab | Navn | Viser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| dMakeup | Makeup (læber og vipper) | lidt | – | – |
| dLaebeH | Læbefarve: tone | lidt | – | – |
| dOejeH | Øjenfarve: tone | intet i praksis (øjnene er få px) | – | – |
| dBlush | Kinder (rødme) | lidt | – | – |
| dBryn | Øjenbryn (kraft) | intet i praksis | – | – |
| dOerering | Ørenringe (0 ingen, 1 store) | lidt | – | – |

## Hår

| Egenskab | Navn | Viser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| dHaarStil | Frisure (langt løst, hestehale, knold, bob, krøller) | tydeligt | – | – |
| dHaarH | Hårfarve: tone | tydeligt | – | – |
| dHaarS | Hårfarve: mætning | lidt | – | – |
| dHaarL | Hårfarve: lys | tydeligt | – | – |
| dHaarLaengde | Hårlængde | tydeligt (langt løst), intet (knold) | – | – |
| dPandehaar | Pandehår (0 ingen, 1 fuldt) | lidt | – | – |

## Tøj

| Egenskab | Navn | Viser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| dTojStil | Tøj (kjole, kort kjole, lang kjole, top og nederdel) | tydeligt | – | – |
| dKjoleVidde | Skørtets vidde | tydeligt | – | – |
| dTop2H | Anden farve (bælte, nederdel): tone | tydeligt (top og nederdel), lidt (kjole: kun bæltet) | – | – |
| dTop2S | Anden farve: mætning | lidt | – | – |
| dTop2L | Anden farve: lys | lidt | – | – |
| dSkoH | Skoenes farve: tone | lidt (skoene er små) | – | – |
| dSkoL | Skoenes lys | intet i praksis | – | – |
| dHaelhoej | Hæle (0 flade, 1 høje) | lidt | – | – |
| dBaelte | Bælte | lidt | – | – |
| dErme | Ærmer (0 ingen, 0,5 korte, 1 lange) | lidt | – | – |

## Gulv, spot og stang

| Egenskab | Navn | Viser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| dGulv | Gulv (til/fra) | tydeligt | – | – |
| dGulvH | Gulv: tone | tydeligt | D | – |
| dGulvS | Gulv: mætning | lidt | – | – |
| dGulvL | Gulv: lys | tydeligt | – | – |
| dGulvFlis | Gulv: flisernes størrelse | lidt | – | – |
| dStangVis | Stang (til/fra) | tydeligt | – | – |
| dStangSide | Stangens side | tydeligt, kun med stang | – | – |

## Fælles egenskaber (alle figurer har dem)

| Egenskab | Navn | Viser på en danser | Shows | Regel-sæt |
| --- | --- | --- | --- | --- |
| storrelse | Størrelse | tydeligt | – | Rolig, Hele bandet |
| bredde | Bredde | **intet** (danseren bruger kun Størrelse) | – | – |
| hojde | Højde | **intet** (som Bredde) | – | – |
| skala | Skala (puls) | tydeligt | – | Puls på kick, Energisk, På trommerne, Hele bandet |
| rotation | Drejning (vinkel) | tydeligt, men ser mærkelig ud på en menneskefigur | – | På trommerne |
| drej | Drejehastighed | tydeligt, men ser mærkelig ud | – | Energisk, Hele bandet |
| farveH, farveS, farveL | Farve (kjolens tone, mætning, lys) | tydeligt (tone), lidt (mætning, lys) | – | Puls på kick, Rolig, På vokalen, Hele bandet (farveH) |
| skygge | Skygge | lidt | – | – |
| kontur | Kontur | lidt | – | – |
| glod | Glød | tydeligt | P Q | Puls på kick, Rolig, Energisk, På trommerne, På vokalen, Hele bandet |
| alpha | Synlighed | tydeligt | – | – |
| svaev | Svæv (op og ned) | tydeligt | – | Energisk, På vokalen, Hele bandet |
| loeft | Løft | tydeligt | – | På vokalen |
| afstand | Afstand (dybde) | lidt | – | – |
| kopier, kopiRadius, kopiDrej, kopiVend | Kopier i en ring | tydeligt (flere dansere), men tungt at tegne | – | – |
| teksturStyrke, teksturSkala, teksturVinkel | Tekstur (prikker, støj) | lidt (kun prikker og støj oven på figuren) | Q (vinkel) | – |

## Det, jeg vil foreslå at fjerne (dit valg)

- **Bredde og Højde** på danseren (viser intet; Størrelse gør det samme).
- **Øjenfarve** og **Øjenbryn** (kan ikke ses i almindelig størrelse).
- **Skoenes lys**.
- Måske **Rotation** og **Drejehastighed** på karakterer (de drejer hele figuren som et billede; det ser forkert ud på en krop). De bruges af regel-sættene På trommerne (rotation) og Energisk/Hele bandet (drej), som så skal rettes.

Fjern intet, før du har valgt.
