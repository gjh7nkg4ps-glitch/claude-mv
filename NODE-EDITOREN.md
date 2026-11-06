# NODE-EDITOREN · papir v7.5

*6. november 2026 · fra hovedchatten · erstatter HJERTET.md · v7.5 har svarene fra SVAR-FASE1.md skrevet ind*

Node-editoren er den nye skærm i Claude MV, hvor man kobler lyd til figurer. Den hed før "Routeren" og "Hjertet". Begge navne udgår.

Papiret er færdigt i fem faser (papiret, fælles opbygning, grå tegninger, forløb og endeligt udseende). **Intet er bygget endnu.** Code laver først en plan, og der bygges først, når brugeren har sagt god for planen.

Billederne ligger i `docs/node-editoren/`. Temaet ligger som faste værdier i `docs/node-editoren/tema-warm-analog.json`.

---

## 0 · Sådan læses papiret

- **Navnene** i afsnit 2 gælder både i programmet og i papiret. Står der et fagudtryk i parentes, er det kun til forklaring.
- **"Til planen"** betyder: en idé, der kommer senere. Den skal ikke bygges nu.
- **"Åben"** betyder: venter på et svar. Se afsnit 11.
- Brugeren ændrer aldrig noget med vilje på lærredet med tegningerne. Billederne her er de godkendte udgaver.

---

## 1 · Fælles regler for alle noder

1. **Noden viser *hvad* og *hvor meget*. Kontrolpanelet viser *hvordan*.**
2. **Små mærker vises kun, når noget er slået til eller er anderledes**, fx "Adaptiv", "Vendt", "Største", "Gate · åben".
3. **Grafikken forenkles kun, når der er zoomet helt ud** (under 20 % zoom). Indtil da viser noderne alt (fagudtryk: level of detail).
4. **Kilder, analyser og lydtræk parkeres** i Ikke i brug. **Regler, figurer, mål og scener slås fra**, hvor de står.
5. **Noget, der mangler sit input, sover** (tonet ned og stiplet). **Noget, der kræver, at brugeren gør noget, er "ikke tilgængelig"** med en kort tekst om, hvad der skal gøres.
6. **Alt, der ændrer meget på én gang, kan fortrydes i ét trin**, fx en skabelon eller Auto-mapping.
7. **Ét navn pr. ting.** "Auto" står aldrig alene.
8. **Glød betyder noget:** kun det, der er valgt eller slår til lige nu, gløder. Alt andet har kun en farvet kant.

---

## 2 · Ordlisten

| I programmet | Betyder | Fagudtryk | Før |
|---|---|---|---|
| **Node** | Alle kasserne i Node-editoren | node | kasse |
| **Link** | Linjen mellem to noder | link, wire | kabel |
| **Port** | De runde ind- og udgange på noderne | port | – |
| **Regel** | Noden, der bestemmer hvornår og hvor meget | mapping | forbindelse |
| **Node-editoren** | Den nye skærm | node editor | Routeren, Hjertet |
| **… · gammel** | Dublet, Router 2.0, Routing-overblik og Mapping: virker endnu, fjernes, når Node-editoren kan det samme | – | uden mærke |
| **Gate · Gate-tærskel** | Reglen virker kun, når en anden kilde er over tærsklen | gate | Port · Portgrænse (Mapping) |
| **Auto-mapping** | Laver regler selv ud fra sangen (Til/Fra og Kør nu) | auto-mapping | Auto, Kør auto-opsætning nu |
| **Adaptiv tærskel** | Tærsklen følger sangen. Mærket "Adaptiv" på regel-noden | adaptive threshold | Auto-tærskel, "Auto"-mærke |
| **Normalisering: Adaptiv · Fast** | Hvordan målinger gøres til 0–1 | – | Normalisering: Auto · Fast |
| **Auto-valg** | Programmet vælger mellem faste valg (Taktslag, Spor) | automatic mode | Auto |
| **A · B · ⟲** | Sløjfen: et stykke af sangen gentages | A–B loop | det samme |
| **Opsætning 1–20** | De gemte pladser | – | A–T, Gem som A/B |
| **Sammenlign 1 ↔ 2** | Skift mellem to opsætninger | A/B comparison | Skift A/B |
| **Preset** | Færdige indstillinger til én regel | preset | det samme |
| **Skabelon** | Lydtræk og regler, der slippes på én figur | template | ny |
| **Opsætning** | Det hele, fx Pigernes show | – | forudindstilling |
| **Layout** | Egne opstillinger af vinduerne | layout | "preset" |
| **Lydtræk** (vores navn) | Ét tal mellem 0 og 1 fra en analyse | audio feature | – |
| **Scene-effekter** | Dublets effekt-gruppe "Scene" | – | Scene |
| **Hent fil** | Teksten for at gemme en fil | – | "link" |

Billede: `20-ordliste.png`.

---

## 3 · Kortet

Billede: `01-det-store-kort.png` (endeligt udseende) og `04-alle-noder-graa.png` (størrelser).

**Kolonnerne fra venstre mod højre:**

| # | Kolonne | Bredde (punkter ved 100 %) |
|---|---|---|
| – | Ikke i brug | smal 200 |
| 1 | Lydkilde | bred 440 (lydfil, 4 spor) · normal 320 (Lyd ind, generator, MIDI) |
| 2 | FFT | normal 320 |
| 3 | Analyse | normal 320 |
| 4 | Lydtræk | normal 320 |
| 5 | Regel | bred 440 |
| 6 | Figur (og effekt-grupper) | normal 320 |
| 7 | Mål | normal 320 |
| 8 | Scene | bred 440 |

- Afstand mellem kolonner: 120 punkter. Højden vokser i trin af 8 punkter.
- **"+ Tilføj"** sidder under hver kolonne (ikke under Ikke i brug).
- **Værktøjslinjen øverst:** ↶ Fortryd · ↷ Gentag · søgefelt "Søg eller tilføj … Ctrl+K" · Normalisering: Adaptiv · Fast · Samlet styrke · Baggrund ▾ (Dublet-scenen, Mesh 3D, Øjet) · Dæmp · Kun valgt kæde · zoom.
- **Kontrolpanelet nederst** i hele bredden. Se afsnit 4.6.
- **Links** går ud fra højre side af en node og ind i venstre. Et link har farven fra den kolonne (eller lydtræk-type), det kommer fra. Valgte kæder er hvide.

---

## 4 · Fælles opbygning (alle noder)

Billede: `03-faelles-opbygning.png`.

### 4.1 De 8 dele
1. **Overskrift:** ikon og titel. Her tager man fat for at flytte noden. Altid samme højde (40 punkter).
2. **Mærker:** i overskriften, højst 2 ad gangen, resten som "+1".
3. **Vælger:** øverst til højre, fx "Handling ▾" eller "Live preview ▾".
4. **Skærm:** det, noden viser (måler, spektrum, lamper, billede).
5. **Tal og styrke:** det store tal står i skærmen. Styrken står til højre for skærmen, kun på regel og figur.
6. **Skala:** under skærmen, når det giver mening.
7. **Bundlinje:** kort tekst om status og gule beskeder.
8. **Porte:** ind til venstre (ring), ud til højre (prik).

### 4.2 Porte
- Én port pr. række. Har noden flere ind- eller udgange, sidder hver port ud for sin række.
- Har noden kun én port, sidder den midt for skærmen.
- Ekstra porte, fx gaten, sidder nederst til venstre.

### 4.3 Størrelser
Tre bredder: smal 200, normal 320, bred 440. Højden følger indholdet i trin af 8 punkter (fagudtryk: 8-punkts grid).

### 4.4 De 8 fælles situationer
| Situation | Sådan ser den ud |
|---|---|
| Normal | Farvet kant |
| Valgt | Hvid kant og glød. Linkene lyser |
| Flyttes | Løftet med skygge |
| Venter | Tonet ned, mens sangen analyseres |
| Sover | Tonet ned og stiplet. Mangler sit input |
| Slukket | Brugeren har slået den fra. Sort skærm og ordet "Slukket" |
| Ikke tilgængelig | Grå, med kort tekst om, hvad man skal gøre |
| Langt ude | Kun lys, ingen tekst. Kun under 20 % zoom |

Ting, kun nogle noder har, får faste pladser: procent og rødt topmærke i skærmen, gule beskeder og korte tekster i bundlinjen, mærker i overskriften.

### 4.5 Spiller eller står stille
Er ikke en situation. Det ses på målerne og visningerne.

### 4.6 Kontrolpanelet
Nederst i hele bredden. Det viser den valgte node: **sætningen** (fx "Når kick er over 0,60, hopper Pige 2."), **signalet over tid**, **indstillinger** og **knapper**. Er intet valgt, står der en kort hjælpetekst: "Klik på en node for at se, hvordan den virker."

---

## 5 · Noderne

### 5.1 Ikke i brug
Billede: `10-ikke-i-brug.png`.

- **Formål:** viser kun det, brugeren selv har parkeret. Alle andre noder findes under "+ Tilføj".
- **Kan parkeres:** kun kilder, analyser og lydtræk.
- **Regler ved parkering:** sover, hvor de står. Kun de sovende regler vågner igen, når tingen trækkes tilbage. Regler, brugeren selv har slået fra, bliver slukket.
- **Sovende links** starter i den parkerede ting, som får en lille grå udgang, kun når den har sovende regler.
- **Det, der hænger under** en parkeret analyse eller kilde, sover også og vågner igen (undtagen det, brugeren selv har slået fra).
- **Den eneste kilde:** beskeden "Alt vil sove. Parkér alligevel?" med Annullér som standardvalg.
- **Tom kolonne:** smal stribe med lodret tekst. Bliver bred med "Slip her for at parkere", når man trækker noget hen over.
- **Situationer:** har sovende regler, valgt, trækkes, ikke tilgængelig, langt ude.

### 5.2 Tilføj-listen (vores navn)
Billede: `11-tilfoej-listen.png`.

- Åbnes med "+ Tilføj" i hver kolonne, og når man trækker et link ud og slipper det på et tomt sted (viser så kun det, der passer). **Ingen Tab-tast.**
- **Ctrl+K** er én søgeliste med to grupper: "Tilføj node" og "Knapper". Noder har typefarve og en lille levende bar. Knapper har et ikon. Til højre står, hvor det hører til.
- En node fra Ctrl+K lander nederst i sin kolonne. Kortet flytter sig derhen, og noden lyser kort op.
- **Skabelon:** lydtræk og regler, der slippes på en figur, ellers spørger listen "Hvilken figur?". Reglerne kobles til figurens mål. Mangler et mål, laves det.
  - Findes lydtrækket allerede, bruges det igen. Er det parkeret, trækkes det ind og vågner.
  - Kan figuren ikke få målet, springes reglen over med en kort besked.
  - Har målet allerede en regel, lægges den nye til med "Største". Fortryd fjerner den.
- Brugeren kan selv lave skabeloner: markér regler og vælg "Gem som skabelon". 4–6 følger med fra start, fx Dans på trommer, Diskokugle på bas, Klodsbane på slag, Arme på vokal.

### 5.3 Lydkilde
Billede: `12-lydkilde.png`.

- **Formål:** viser, hvor lyden kommer fra. **Kun udgange.**
- **Fem slags:**
  - **Lydfil:** bølgeform med afspilningsstreg, to store målere (venstre og højre i dB), navn, længde, tempo og toneart. Klik på navnet eller træk en fil ind. "Vælg lydfil" i bundbaren gør det samme.
  - **4 spor:** én node med én række pr. spor (Trommer, Bas, Vokal, Resten, Mix), hver med lille bølgeform, lille måler og egen udgang. Sporene går direkte til lydtræk. Kun Mix går til analyserne. "Vælg 4 filer" fordeler efter navn. "Fjern sporene" findes. Sporene laves uden for MV (Ultimate Vocal Remover).
  - **Lyd ind:** lille node med rullende bølgeform og én måler. Klik på navnet for mikrofon eller fanelyd. "Live · ingen afsnit og ingen stereo". Niveau 20–300 % (ca. −14 til +9,5 dB) i kontrolpanelet.
  - **Generator:** egen node med genre (House 124, Techno 132, Breakbeat 140, Hip-hop 90, Trap 140, Drum and bass 172, Disco 118 BPM), tempo (60–200 BPM) og tæthed (0–1). Mærket "Live". Analyseres, mens den spiller (FFT 2048 og 8192). "Avanceret …" i kontrolpanelet åbner den fulde generator med resten: 16 eller 32 trin, swing, grundtone og skala, bas- og lead-lyd, filter, echo, kick-længde, 8 spor, 5 pladser til mønstre, Send til editor og keyboard med Optag.
  - **MIDI:** egen node. Tæller ikke som lydkilde, så den kan bruges samtidig med en sang. I dag kun tangenter (anslagets styrke bruges ikke): to udgange, "Tangent · blink" (kort blink ved hvert anslag) og "Sidste tone · 0–1" (A0 til C8). Virker kun i Chrome og Edge. En tangent kan også få en figur til at blive født som en levende kopi, hvis figuren er sat til at fødes af MIDI.
- **Bølgeformen:** klik hopper i sangen, træk spoler. Ved 4 spor hopper hele sangen. Lyd ind kan ikke spoles.
- **Én lydkilde ad gangen** (MIDI tæller ikke med).
- **Skift kilde:** den nye overtager linkene, og den gamle parkeres. Fortryd kan bytte tilbage. Spor-links sover, hvis den nye kilde ikke har en passende port.
- **Situationer:** analyserer (med procent), valgt, flyttes, "Slip lydfil her", ikke tilgængelig (fx "Find filen igen", "Vælg 4 lydfiler", "Filen kan ikke læses", "Giv adgang til mikrofonen", "Del en fane med lyd"), langt ude, og en gul besked, når de 4 spor ikke er lige lange.
- Efter genstart viser 4 spor "Ikke tilgængelig" (sporene gemmes ikke).

### 5.4 FFT og Analyse
Billede: `13-analyse.png`.

- **FFT har sin egen kolonne** mellem lydkilden og analyserne, med **to noder**:
  - **FFT · hurtig (2048):** til slag, brede bånd, klang og taktslag.
  - **FFT · fin (8192):** til tone og akkord.
  - Begge viser et liggende spektrum (dybe toner til venstre). Linkene går ud fra højre side.
- **Uden om FFT:** styrke, nulgennemgange og stereo får link direkte fra lydkilden. Tonehøjde (McLeod-metoden) får også et link direkte fra lydkilden.
- **De syv analyse-noder og deres visning:** Slag-detektor (tre lamper), Brede bånd (søjler), Tone og akkord (tonehjul), Klang (kurve), Taktslag (prikker i takt), Stereo (balance), Styrke (viser).
- **Udgange** som rækker, én port pr. række, fx Slag: Kick, Snare, Hihat. (Listen over udgange er papirets bedste bud. Ret den efter koden.)
- **Ingen tænd/sluk-knap.** Vil man slukke en analyse, parkerer man den.
- **Indstillinger** i kontrolpanelet. De fleste tal ligger fast i dag. Taktslag: ½×, 1×, 2×, Tap og "Første slag nu" (i dag i Show-vinduet; i Node-editoren sidder de i Taktslag-nodens kontrolpanel).
- **Hvad bygger på hvad (fra koden):** taktslag bygger på FFT 2048-lydtrækkene (flux, kick, snare, hihat). Toneklasser og akkord bygger på FFT 8192. Tonehøjde bruger McLeod-metoden på lydbølgen. Toneart regnes over hele sangen.
- **Situationer:** venter, valgt, flyttes, sover, ikke tilgængelig (fx "Ingen stereo fra Lyd ind", "Kun 'Mens det spiller' ved Lyd ind"), langt ude.

### 5.5 Lydtræk (vores navn)
Billede: `14-lydtraek.png`.

- **Formål:** ét tal mellem 0 og 1, som reglerne bruger.
- **Viser:** stor måler med hvidt topmærke (peak hold) og tallet.
- **Trim:** −12 til +12 dB (× ¼ til × 4) øverst til højre. **Findes ikke i MV i dag og skal bygges.**
- **Normalisering:** vises i kontrolpanelet, fx "−18 dB → Adaptiv → 0,82". Adaptiv eller Fast vælges i værktøjslinjen (Adaptiv = sangens 99. percentil).
- **Spor i navnet:** lydtræk fra et spor får sporets navn bagefter, fx "Kick · Trommer". Fra hele sangen: intet efternavn.
- **Rækkefølge og farve:** sorteret efter musikken, farve efter type (se afsnit 7).
- **Porte:** ind og ud. **Kan parkeres.**
- **Situationer:** venter, valgt, flyttes, sover, ikke tilgængelig, **rammer loftet** (topmærket bliver rødt, når tallet står fast på 1, fagudtryk: clipping), langt ude.

### 5.6 Regel (fagudtryk: mapping)
Billede: `15-regel.png`.

- **Formål:** bestemmer, hvornår og hvor meget en figur reagerer.
- **To slags**, valgt med vælgeren øverst til højre (**Handling ▾ / Egenskab ▾**). Ordet "Tærskel-split" fjernes, det var kun navnet på looket.
  - **Handling** (trigger): sker én gang, når lyden rammer. Gul tærskel-streg, som man trækker direkte på måleren. Hysteresen ligger altid lige under stregen. Under stregen er farverne svagere, over stregen lyser de fuldt.
  - **Egenskab:** følger lyden hele tiden. To klemmer for mindst og mest, og hvad det bliver til, fx → 0–90°.
- **Kæden** (rækkefølge): vend om → tærskel og hysterese → kurve → gain (styrke) → attack og release → spærretid → hold → slew.
- **Styrke** står på noden til højre for måleren. Man trækker i tallet.
- **Gate** har sin egen indgang nederst til venstre. Man trækker et link fra fx Bas derhen. Gate-tærsklen stilles i kontrolpanelet. Mærket "Gate · åben" eller "Gate · lukket".
- **Kurve:** kun i kontrolpanelet.
- **Hold:** kun skyderen (Fra · 50 ms til 2 s · ∞).
- **Vend om:** i kontrolpanelet. Mærket "Vendt" på noden, når den er slået til.
- **Lær:** ét tryk. En sang bruger analysen af hele sangen, Lyd ind lytter i 8 sekunder. Ved Handling sættes tærsklen lige under de tydelige slag, ved Egenskab sættes mindst og mest. Bagefter en kort besked, fx "Tærskel sat til 0,58 ud fra 212 slag · Fortryd".
- **Standard:** sætter kæden tilbage, men tærskel, styrke, attack og release bliver, som de er.
- **Ryd hold:** en kommando i Ctrl+K. Gælder alle regler.
- **En ny regel** starter med Standard, og Lær lyser som forslag.
- **Adaptiv tærskel** (i dag Auto-tærskel) har to indstillinger i kontrolpanelet: hvor hurtigt den følger sangen (1–8 s, standard 3 s) og en bundgrænse (0–0,3, standard 0,05).
- **Mærker:** "Adaptiv", "Vendt".
- **Situationer:** venter, valgt, flyttes, slukket, sover (mangler sit lydtræk), gate lukket, langt ude.

### 5.7 Figur og effekt-grupper
Billede: `16-figur.png`.

- **Formål:** viser, hvem der reagerer.
- **Viser:** lille billede, navn, antal mål, øje og styrke.
- **Styrke** på noden, ligesom reglens. **Figur-styrke findes ikke i MV i dag og skal bygges.**
- **Styrke brugt** = regel × figur × samlet styrke × følsomhed × afsnits-dynamik. Kontrolpanelet viser hele regnestykket. Led, der ikke er i brug, står svagt.
  - **Følsomhed** findes kun i Enkel tilstand: fem grupper (Bas, Trommer, Vokal, Mid, Højt), 0–200 %.
  - **Afsnits-dynamik** findes kun med Show og en analyseret fil: en vægt pr. rolle (rytme, slag, flyd, melodi, scene, ekstra) og pr. slags afsnit.
- **Øje og Slå fra** er to ting: øjet skjuler figuren på scenen, og "Slå fra" får den til at stå stille, men den kan ses (fagudtryk: visibility og bypass).
- **Link på figuren:** en menu med figurens mål. Mangler målet, laves det.
- **Morgenstjerne:** figuren findes i Tilføj-listen. De 6 regler bliver en skabelon, man kan slippe på den.
- **Effekt-grupper:** hver af Dublets grupper bliver en node i figur-kolonnen med øje, "Slå fra" og styrke. De er blå. Deres mål:
  - **Scene-effekter:** Baggrundsfarve, Zoom-puls, Kamera-ryst, Strobe-blink, Banens fart.
  - **Lys og former:** Lys-puls, Glød, Chokbølge-ring, Partikel-burst, Dæmpningsringe, Partikelsky.
  - **Bane:** Spor-lys (alle 3), Bølge i banen, Slange: bølge, Slange: farveskift, Klods spor 1, 2 og 3.
  - **Efterspil og orden:** Ekko-skygger, Usikkerhedssky, Halespor, Relationer, Prioritet (fokus), Dybdeskarphed.
  - **Lyd:** Klik, Tone (fra tonearten), Suus.
- **Figurernes mål** er grupperet som i Dublet i dag: Form, Pigge, Farve, Bevægelse, Dybde, Liv.
- **Porte:** ind og ud. **Kan ikke parkeres**, men slås fra.
- **Situationer:** valgt (figuren lyser kort op i Live preview), flyttes, skjult (øjet lukket, billedet tonet ned), slukket, langt ude.

### 5.8 Mål
Billede: `17-maal.png`.

- **Formål:** viser, hvad figuren eller effekten gør.
- **Viser:** navn, figur, lampe (Handling) eller måler (Egenskab), og hvad det bliver til, fx → 0–90°.
- **Flere regler på samme mål:** Største (standard), Læg sammen (højst 1) eller Gang (fagudtryk: max, add, multiply). Vælges i kontrolpanelet. Mærket står på noden, når der er mere end én regel.
- **Tomt mål:** bliver stående, tonet ned, med "Ingen regler". Ctrl+K får kommandoen "Ryd tomme mål".
- **Porte:** ind og ud. **Kan ikke parkeres**, men slås fra.
- **Situationer:** valgt, flyttes, slukket, ingen regler, figuren er skjult eller slukket (tonet ned med en lille tekst), langt ude.

### 5.9 Scene
Billede: `18-scene.png`.

- **Formål:** viser, hvor det hele vises.
- **Viser:** et lille, levende billede med få billeder i sekundet. Vælgeren viser kun de 5 scener, der kan vises: Live preview, Radial Mesh, Mesh 3D, Øjet og Lyd i 3D. Scenens andre faner (Routing, EQ, EQ+, Morph Pad, Dublet) er værktøjer, ikke scener.
- **Man kan:** klikke på billedet for at åbne scenen stort. "Riv løs" og "Send til skærm" sidder i kontrolpanelet.
- **Én scene-node for hver scene, der vises.**
- **Links ind:** ét fra hver figur og hver effekt-gruppe. **Kun indgang.**
- **Kan ikke parkeres**, men slås fra.
- **Situationer:** valgt, flyttes, slukket (sort billede, "Slukket", scenen tegner ikke, så computeren sparer kræfter), ikke tilgængelig (fx "Kræver 3D"), langt ude.

---

## 6 · Forløb: hvad sker der, når …

Billede: `05-forloeb.png`. Alle 7 er godkendt.

1. **Ny regel ved at trække:** træk et link ud fra et lydtræk og slip på et tomt sted → Tilføj-listen viser kun det, der passer → reglen lægges, hvor man slap → træk videre til en figur → menu med figurens mål (mangler det, laves det) → reglen kører med Standard, og Lær lyser.
2. **Klik på en node:** kanten og linkene lyser, og kontrolpanelet viser, hvordan noden virker. Klik på et tomt sted: intet valgt, hjælpetekst i kontrolpanelet.
3. **Kun valgt kæde:** alt andet dæmpes, så kun kæden fra lydkilde til scene lyser (fagudtryk: isolate). Tryk igen eller Esc for at slå det fra.
4. **Zoom ud:** ved 50 % vises alt stadig. Under 20 % bliver noderne til lys uden tekst.
5. **Lær:** se 5.6. Fortryd sætter tærsklen tilbage.
6. **Fortryd:** Ctrl+Z og Ctrl+Shift+Z, og knapperne ↶ Fortryd og ↷ Gentag i værktøjslinjen. Efter hver handling kommer en kort besked med Fortryd (fagudtryk: toast). Store ting fortrydes i ét trin.
7. **Parkér et lydtræk:** træk det mod Ikke i brug → kolonnen bliver bred med "Slip her for at parkere" → reglerne sover, hvor de står, med stiplede links fra en lille grå udgang → træk tilbage, og de sovende regler vågner.

---

## 7 · Temaet: Warm Analog

Billede: `02-tema-warm-analog.png`. Faste værdier: `docs/node-editoren/tema-warm-analog.json` (fagudtryk: design tokens). Temaet skal kunne skiftes ud senere, så farver og glød må ikke skrives direkte ind i koden.

- **Grundfarver:** baggrund #070303 → #2a0f0a, node-flade #2a1610 → #120a08, titler #ffffff, tekst #ffd9c8, svag tekst #c8a898.
- **Måler-gradient:** gul #ffd60a → orange #ff8a00 → rød #ff3b1f → pink #ff2d75.
- **Farve pr. kolonne** (en varm gradient, der følger lydens vej): Ikke i brug #8a7a72, Lydkilde #ffb000, FFT #ffd60a, Analyse #ff8a00, Lydtræk #ff6a1f, Regel #ff3b1f, Figur #ff2d75, Mål #e0409a, Scene #c77dff. MIDI og effekt-grupper #5ab0ff.
- **Lydtræk-typer** (farverne fra det store kort): slag #ff6b5a, bånd #ffa040, takt #ffd34a, styrke #ffc46a, tone #c99bff, vokal #d79bff, klang #9fe07a, stereo #6fc3ff.
- **Glød:** kun valgt (hvid kant og glød) og det, der slår til lige nu.
- **Skrifttyper:** Orbitron (overskrifter og knapper, store bogstaver), Exo 2 kursiv (tal), IBM Plex Sans (tekst).

---

## 8 · Funktionslisten og de gamle vinduer

- `FUNKTIONER.md` (fra trin 1) gælder. Et gammelt vindue fjernes først, når alt det, det kan, virker i Node-editoren.
- De fire gamle vinduer får "· gammel" bag navnet: Dublet, Router 2.0, Routing-overblik og Mapping.
- Routing-overblik fjernes først, når alle 11 visninger findes i Node-editoren, eller når brugeren beslutter, at nogle kan vente.
- Kort over forbindelserne (eksport som Mermaid, PNG og SVG) må ikke forsvinde.
- Tastaturnavigation (findes i Dublet og Routing-overblik) skal med til Node-editoren.
- Billede: `22-funktionsliste.png`.

---

## 9 · Kendte forskelle mellem papiret og MV i dag

| Emne | Papiret | MV i dag |
|---|---|---|
| Styrke brugt | regel × figur × samlet × følsomhed × afsnits-dynamik | gain × samlet × følsomhed × afsnits-dynamik |
| Figur-styrke | findes | findes ikke |
| Trim på lydtræk | −12 til +12 dB | findes ikke |
| Navne | se afsnit 2 | gamle navne |
| Gemte pladser | Opsætning 1–20 | A–T |
| Ordet "link" | linjen mellem noder | kun om at gemme en fil. I koden hedder Mesh 3D's rør `M3.links`, så Node-editorens links skal have et andet navn i koden |
| MIDI | tangenter, knapper og drejeknapper senere | kun tangenter |
| EQ | en rigtig EQ (som analyserne lytter igennem) er til planen | EQ-vinduet ændrer kun det, man hører (±12 dB) |

---

## 10 · Teknik (besluttet før)

- Den gamle three.js (r128) bliver til Mesh 3D og Øjet. Node-editoren får en ny three.js ved siden af. Én fælles three.js kommer senere.
- Al ny grafik skrives i TSL fra start, så det kører på både WebGPU og WebGL2. Mesh 3D og Øjet flyttes senere, én ad gangen.
- Gemte indstillinger fra gamle versioner skal stadig kunne åbnes (der findes tests med 6 gamle versioner).

---

## 11 · Åbne punkter

1. **Zone-tilstand:** ikke prøvet, om flere løsrevne scener kan ses på én gang.
2. **Udgangene på analyse-noderne** (afsnit 5.4) er papirets bedste bud og skal rettes efter koden (de 14 lydtræk, toner, klang og de 31 bånd).

*Afklaret i v7.5:* Detektions-tolerance hører ikke til en analyse. Den ændrer kun målingen af hit-rate i Detektions-tuning, som er parkeret (se afsnit 12). Scene-effekter beholder navnet. Indholdet står i afsnit 5.7.

---

## 12 · Til planen (senere, ikke nu)

- En rigtig EQ som node mellem lydkilden og FFT, hvis en sang giver problemer. MV's nuværende EQ-vindue skal så have et andet navn.
- Lær ved at trykke i takt med musikken, sammen med Detektions-tuning (tolerance 30–200 ms, standard 90 ms).
- Flere lydkilder på samme tid.
- MIDI: knapper og drejeknapper (CC).
- Generatoren: "Send til editor" giver i dag ingen tempo-profil.
- Sporene laves inde i MV.
- Vinduet Opsætninger har også indstillinger. Skal det hedde noget andet?
- Vælgeren "Spor" er måske ikke nødvendig, når linkene viser det.
- Auto-mapping erstatter alle regler og skal kunne fortrydes.

---

## 13 · Billeder i docs/node-editoren/

| Fil | Viser |
|---|---|
| 01-det-store-kort.png | Hele Node-editoren i det endelige udseende |
| 02-tema-warm-analog.png | Temaet |
| 03-faelles-opbygning.png | Den fælles opbygning og de 8 situationer |
| 04-alle-noder-graa.png | Alle noder i gråt med størrelser |
| 05-forloeb.png | De 7 forløb |
| 10-ikke-i-brug.png … 18-scene.png | Én tegning pr. node |
| 20-ordliste.png | Ordlisten |
| 21-fase1-overblik.png | Overblik over papiret |
| 22-funktionsliste.png | Funktionslisten |
