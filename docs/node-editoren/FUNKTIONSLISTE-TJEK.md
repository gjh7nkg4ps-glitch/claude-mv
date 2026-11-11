# Funktionsliste-tjek · Node-editoren (trin 16, v9.34; opdateret i v9.39, v9.41 og v9.42)

Hver linje fra `docs/arkiv/hjertet/FUNKTIONER.md` (skrevet ud fra v9.18) og dens plads i Node-editoren. Testen `tests/29-funktionsliste.js` går alle linjer igennem: hver funktion står her præcis én gang, status er en af de fire, og navnet i *Kontrol* findes i programmet.

**Status:** ✅ lavet · ◐ delvis · ✗ mangler · – ikke nødvendig (fx en fane, der ikke skal lukkes). De fire gamle vinduer er slettet i v9.35 efter din besked (papirets afsnit 8).

## Sammendrag

| | Antal |
| --- | --- |
| ✅ lavet | 106 |
| ◐ delvis | 0 |
| ✗ mangler | 0 |
| – ikke nødvendig | 8 |
| I alt (fra FUNKTIONER.md) | 114 |

**v9.35: de fire gamle vinduer er slettet** (din beslutning, 8. november 2026). Det, der stod som mangler eller delvis i dem, er gået tabt, undtagen det, der blev flyttet:

| Gammelt vindue | Mangler eller delvis i Node-editoren | Status |
| --- | --- | --- |
| Dublet | 2 | slettet i v9.35 |
| Router 2.0 | 1 | slettet i v9.35 |
| Routing-overblik | 4 | slettet i v9.35 |
| Mapping | 3 | slettet i v9.35 |

**v9.42:** Sortering (D2 på lærredet), Spejlbilledet og Flyt effekt eller figur (Håndtag i billedet) er ✅ lavet. **Alle 106 funktioner, der skal være i Node-editoren, er lavet.**

**v9.41:** de 10 visninger fra Routing-overblik er tilbage i Node-editoren (Visning ▾), med Kræfter, Træ og 3D-netværk; Layout og Overblik er nu ✅ lavet.

**v9.39:** de 13 linjer, hvor knappen kun fandtes i Lydkilde, Opsætninger eller Værksted, er nu ✅ lavet: knapperne findes i Node-editorens kontrolpanel (Lydkilde-noden, MIDI-noden, figurerne og uden valg) og i Ctrl+K.

**Flyttet i v9.35:** Gem som 1/2, Hent 1/2 og Sammenlign 1 ↔ 2 til Opsætninger (og stadig Radial Mesh); Kort over forbindelserne, Ryd hold, Tilføj morgenstjerne, Tilslut MIDI og Tilfældigt til Værksted · Lydtræk-guide (og Ctrl+K).

**Gået tabt i v9.35:** Routing-overblikkets 10 visninger (1 lavet: Kolonner er Node-editoren), Dublets håndtag i billedet (Flyt effekter i Live preview findes stadig), Mappings og Routers egne visninger (Kompakt/Fuld, D2-sortering, ▸ Vis i kildelisten).


## Dublet

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Åbn Dublet | ✅ lavet | Fanen Node-editor i Arbejdsfeltet og layoutet Noder i topbjælken | 1 | `neVis` |
| Luk | – ikke nødvendig | En fane; den lukkes ikke | 1 |  |
| Spejlbilledet | ✅ lavet | Scene-noden har et lille levende billede, Baggrund ▾ kan vise Live preview bag noderne, og Håndtag i billedet viser en prik for hver effekt og figur | 12, v9.42 | `ne12Vis, neSaetBg, ne42Prikker` |
| Opløsning | – ikke nødvendig | Scene-nodens billede er lille og tegnes 4 gange i sekundet | 12 |  |
| Lydtræk til venstre | ✅ lavet | Kolonnen Lydtræk med levende måler og tal; linjen lyser, når reglen slår til | 2 | `ne2Byg` |
| Vælg kildegruppe | ✅ lavet | + Tilføj i Lydtræk (grupperet efter mappe, også 4 spor og de 31 bånd) og analyse-noderne med alle udgange | 3, 6 | `ne6Valg` |
| Mål i kasser | ✅ lavet | Kolonnerne Figur og Mål; menuen med figurens mål er grupperet (Form, Pigge, Farve …) | 2, 5 | `ne5Maal` |
| Find mål | ✅ lavet | Søgefeltet i menuen med figurens mål og Ctrl+K | 5, 6 | `neKpPunkter` |
| Kun koblede | ✅ lavet | Node-editoren viser kun det, der er koblet (+ Tilføj viser resten) | 2 |  |
| Lav forbindelse | ✅ lavet | Træk fra udgangen ● på et lydtræk til en figur eller et mål | 5 | `ne5Ny` |
| Flyt effekt eller figur | ✅ lavet | Håndtag i billedet (Live previews scene-node): træk i prikken | v9.42 | `ne42SaetHaand` |
| Vælg forbindelse | ✅ lavet | Klik på en node: kanten og kæden lyser hvidt | 2 | `ne2Kaede` |
| Ret tærskel og gain | ✅ lavet | Træk tærsklen på reglens måler og styrke-tallet; skydere i kontrolpanelet | 4 | `ne4Vaerdi` |
| Slå fra / Slå til | ✅ lavet | Slå fra / Slå til i reglens kontrolpanel | 5 | `ne2Kp` |
| Slet | ✅ lavet | Slet regel og Delete | 5 | `ne5Slet` |
| Kobl via klik | – ikke nødvendig | Bliver i Form-editoren (den forsvinder ikke) |  |  |
| Tastatur | ✅ lavet | Home/End, ↑ ↓, ← →, [ ], Enter, Delete og Esc | 13 | `ne13Taster` |

## Router 2.0

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Grafen | ✅ lavet | Hele lærredet: lydkilde → FFT → analyse → lydtræk → regel → figur → mål → scene | 2, 3, 12 | `ne2Byg` |
| Ny forbindelse | ✅ lavet | Træk et link til et tomt sted (Tilføj-listen) og + Tilføj i Regel | 5, 6 | `ne5Kladde` |
| Visning | ✅ lavet | Zoom 10–200 %; under 20 % er noderne lys uden tekst | 1, 13 | `ne13Lod` |
| Detaljer | ✅ lavet | Klik på en regel: kontrolpanelet viser alt | 2, 4 | `ne2Kp` |
| Sortering | ✅ lavet | Sortér: Figur → mål · D2 (efter musik) i kontrolpanelet og Ctrl+K; D2 med mappe-overskrifter på lærredet | 2, 6, v9.42 | `ne42PlacerD2` |
| Farve efter type | ✅ lavet | Lydtrækkene har typens farve (temaets lydtraekType) | 2 |  |
| Kilde-chip | ✅ lavet | Lydtræk-noden viser tallet lige nu og "N regler" | 2 | `ne3Tik` |
| Vis kilder, der ikke bruges | ✅ lavet | + Tilføj i Lydtræk viser alle kilder; et nyt lydtræk er en løs node | 6 | `neTilfoej` |
| Standard-visning | ✅ lavet | Placér og Tilpas | 2 | `neTilpas` |
| Vælg kilde og mål | ✅ lavet | Træk et lydtræk på en regel (ny kilde) eller reglens udgang til et andet mål | 5 | `ne5Flyt` |
| Hvor målt, Manuel/Auto | ✅ lavet | Lydtræk-noden viser, hvor det er målt; reglen har mærket Adaptiv | 2, 15 | `r2Hvor` |
| VU-måler | ✅ lavet | Reglens måler med tærskel, hysterese-bånd og topmærke; træk tærsklen | 2, 4 | `ne4Vaerdi` |
| Ind · Tærskel · Ud | ✅ lavet | Reglens tal, tærsklen og udgangen lige nu | 2 |  |
| Signalet over tid | ✅ lavet | Signalet over tid i kontrolpanelet (før og efter kæden) | 2 | `ne2KpTik` |
| Kæden | ✅ lavet | Indstillingerne står i kædens rækkefølge i kontrolpanelet | 2 | `ne2Indst` |
| Taktslag Auto | ✅ lavet | Taktslag Auto-valg/Manuel i kontrolpanelet | 4 | `ne2Kp` |
| Spor Auto | ✅ lavet | Spor Auto-valg/Manuel i kontrolpanelet | 4 | `ne2Kp` |
| Gain, Attack, Release, Hold | ✅ lavet | Skydere i kontrolpanelet | 4 | `ne2Kp` |
| Styrke brugt | ✅ lavet | Styrke brugt med alle led (regel × figur × samlet × følsomhed × afsnits-dynamik) | 4, 9 | `stakFor` |
| Vend om | ✅ lavet | Vend om i kontrolpanelet | 4 | `ne2Kp` |
| Drejeknapper | ✅ lavet | Drejeknapper til hysterese, kurve, spærretid og slew | 4 | `ne2Kp` |
| ↺ Standard | ✅ lavet | Standard i kontrolpanelet | 4 | `ne2Kp` |
| Slet | ✅ lavet | Slet regel | 5 | `ne5Slet` |
| Fjernede kilder | ✅ lavet | Reglen viser "Kilden er fjernet (Lydkort)" | 2 | `ne2Saetning` |

## Routing-overblik

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Åbn | ✅ lavet | Fanen Node-editor og layoutet Noder | 1 | `neVis` |
| Luk | – ikke nødvendig | En fane; den lukkes ikke | 1 |  |
| Layout | ✅ lavet | Visning ▾ i værktøjslinjen: Noder (kolonner) og de 10 visninger fra Routing-overblik; valget huskes | v9.41 | `ne41Vis` |
| Find | ✅ lavet | Ctrl+K finder noder ("findes") og flytter kortet derhen | 6 | `neVisNode` |
| Levende linjer | ✅ lavet | Linjerne lever altid (TSL fra v9.32) | 2, 14 | `neLinjerTegn` |
| Vis slået fra | ✅ lavet | Slukkede regler står med "Slukket" og stiplet kant | 2 | `ne2Byg` |
| Fokus | ✅ lavet | Kun valgt kæde (fagudtryk: isolate); Esc slår det fra | 13 | `neKunKaede` |
| Vælg forbindelse | ✅ lavet | Klik på en regel | 2 | `ne2Kaede` |
| Ret tærskel og gain | ✅ lavet | Måleren og skyderne | 4 | `ne4Vaerdi` |
| Slå fra / Slå til · Slet | ✅ lavet | Slå fra / Slå til og Slet regel | 5 | `ne5Slet` |
| Kræfter (kun Frit netværk og 3D-netværk) | ✅ lavet | Visning Frit netværk eller 3D-netværk: bjælken Kræfter (Frastødning, Fjederlængde, Tyngdekraft, Retning, Vis kræfter, Ryst, Løsn fastgjorte, Standard) | v9.41 | `rtLayoutFri, rtLayVis` |
| Fastgør knude (Frit netværk) | ✅ lavet | Træk en node: pladsen huskes (set.ne.pos); Placér løsner alle | 2 | `ne2Placer` |
| Tidslinje-layout | ✅ lavet | Klik i bølgeformen på Lydfil-noden hopper i sangen | 3 | `ne3Tik` |
| Træ-layout | ✅ lavet | Visning Træ: fanerne øverst vælger roden | v9.41 | `rtTegnAndre` |
| 3D-netværk | ✅ lavet | Visning 3D-netværk: træk på en tom plads drejer | v9.41 | `rt3D` |
| Rul | ✅ lavet | Træk lærredet, Shift + musehjul, piletasterne | 1, 2 | `neZoomMidt` |
| Tastatur | ✅ lavet | Home/End, ↑ ↓, ← →, [ ], Enter, Delete og Esc | 13 | `ne13Taster` |
| Lav ny forbindelse | ✅ lavet | Node-editoren kan lave regler (træk et link) | 5 | `ne5Ny` |

## Mapping

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Sådan virker det | ✅ lavet | Kontrolpanelets sætning forklarer den valgte node | 2 | `ne2Saetning` |
| Gem som A / B · Hent A / B · Skift A/B | ✅ lavet | Kontrolpanelet, når intet er valgt: Gem som 1/2, Hent 1/2, Sammenlign 1 ↔ 2 (og Ctrl+K) | v9.39 | `ne39Handling` |
| Kort over forbindelserne | ✅ lavet | Ctrl+K i Node-editoren: Kort over forbindelserne (Mermaid, PNG, SVG) | 16 | `mvkAaben` |
| Tilføj forbindelse | ✅ lavet | Træk et link, + Tilføj eller Ctrl+K | 5, 6 | `ne5Ny` |
| Minimér alle | – ikke nødvendig | Zoom, Tilpas og lys uden tekst under 20 % | 13 |  |
| Ryd hold | ✅ lavet | Ctrl+K: Ryd hold | 6 | `neKpPunkter` |
| Tilføj morgenstjerne | ✅ lavet | Kontrolpanelet (intet valgt eller en figur) og Ctrl+K: Tilføj morgenstjerne (figur) med 6 regler; skabelonen Morgenstjerne lægger reglerne på en figur, der findes | 11, v9.39 | `ne39Handling, neBrugSkabelon` |
| Tilslut MIDI | ✅ lavet | MIDI-nodens kontrolpanel, kontrolpanelet uden valg og Ctrl+K | 3, v9.39 | `ne39Handling` |
| Tilfældigt | ✅ lavet | Ctrl+K: Tilfældigt (slag, flydende, figur-egenskaber), fortrydes i ét trin | 6 | `neKpPunkter` |
| Lydtræk og Effekt | ✅ lavet | Træk links: ny kilde eller nyt mål | 5 | `ne5Flyt` |
| Minimér række | – ikke nødvendig | Zoom og lys uden tekst | 13 |  |
| Fjern | ✅ lavet | Slet regel | 5 | `ne5Slet` |
| Styrke brugt | ✅ lavet | Styrke brugt i kontrolpanelet | 4, 9 | `stakFor` |
| 6 skydere | ✅ lavet | Skydere i kontrolpanelet | 4 | `ne2Kp` |
| Hold | ✅ lavet | Hold-skyderen (Fra · 50 ms til 2 s · ∞) | 4 | `ne2Kp` |
| Port og Portgrænse | ✅ lavet | Gate og Gate-tærskel (gate-porten på reglen) | 4, 5 | `ne2Kp` |
| Taktslag Auto | ✅ lavet | Taktslag Auto-valg/Manuel | 4 | `ne2Kp` |
| Spor Auto | ✅ lavet | Spor Auto-valg/Manuel | 4 | `ne2Kp` |
| Router-linje | ✅ lavet | Indstillingerne i kontrolpanelet | 2 | `ne2Indst` |
| Fjernede kilder | ✅ lavet | Reglen viser "Kilden er fjernet (Lydkort)" | 2 | `ne2Saetning` |
| Slå fra / Vend om | ✅ lavet | Node-editoren har både Slå fra og Vend om | 4, 5 | `ne2Kp` |

## Fanen Lydkilde

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Auto: Til/Fra | ✅ lavet | Lydkildens kontrolpanel: Auto-mapping: Til/Fra og Kør Auto-mapping nu (og Ctrl+K) | 6, v9.39 | `ne39Handling` |
| Kør auto-opsætning nu | ✅ lavet | Ctrl+K: Kør Auto-mapping (fortrydes i ét trin) | 6 | `neKpPunkter` |
| Rul | – ikke nødvendig | Lærredet flyttes med træk og Shift + musehjul | 2 |  |
| Lydfil | ✅ lavet | Lydfil-noden med bølgeform; + Tilføj i Lydkilde: Vælg lydfil … | 3, 6 | `ne3NodeHtml` |
| 4 spor (stems) | ✅ lavet | Lydfil-noden viser de 4 spor; Lydkildens kontrolpanel: Vælg 4 filer og Fjern sporene | 3, v9.39 | `ne3NodeHtml, ne39KildeHtml` |
| Spor-målinger | ✅ lavet | Lydtræk fra sporene i + Tilføj (fx Trommer · Kick) | 6 | `ne6Valg` |
| Spor Auto | ✅ lavet | Spor Auto-valg/Manuel i reglens kontrolpanel | 4 | `ne2Kp` |
| Generator · genre, tempo, tæthed | ✅ lavet | Lydkildens kontrolpanel: Genre, Tempo og Tæthed (styrer generatoren) | 3, v9.39 | `ne39KildeHtml` |
| ▶ Afspil generator · ✦ Nyt mønster · Muter lidt | ✅ lavet | Lydkildens kontrolpanel og Ctrl+K: Afspil/Stop, Nyt mønster, Muter lidt | 6, v9.39 | `ne39Handling` |
| Lydmotor | ✅ lavet | Lydkildens kontrolpanel og Ctrl+K: Lydmotor: Ny · Klassisk | v9.39 | `ne39Motor` |
| Avanceret … | ✅ lavet | Lydkildens kontrolpanel og Ctrl+K: Avanceret … åbner den fulde generator (W4) | v9.39 | `ne39Handling` |
| Lyd ind | ✅ lavet | Lyd ind-noden vises (målere); Lydkildens kontrolpanel og Ctrl+K: Lyd ind til eller fra | 3, v9.39 | `ne3NodeHtml, ne39Handling` |

## Funktioner, der findes flere steder

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Lav en forbindelse | ✅ lavet | Træk et link; + Tilføj; Ctrl+K; tastaturet (Enter, Enter) | 5, 6, 13 | `ne5Ny` |
| Slet en forbindelse | ✅ lavet | Slet regel og Delete | 5 | `ne5Slet` |
| Slå en forbindelse fra og til | ✅ lavet | Slå fra / Slå til (regel) og Slå fra (figur og effekt-gruppe) | 5, 12 | `neSaetFra` |
| Tærskel og gain | ✅ lavet | Måleren, styrke-tallet og skyderne | 4 | `ne4Vaerdi` |
| Alle 6 skydere (tærskel, gain, attack, release, kurve, spærretid) | ✅ lavet | Alle skydere og drejeknapper i kontrolpanelet | 4 | `ne2Kp` |
| Vend om (invertér) | ✅ lavet | Vend om i kontrolpanelet | 4 | `ne2Kp` |
| Hold | ✅ lavet | Hold-skyderen | 4 | `ne2Kp` |
| Styrke brugt | ✅ lavet | Styrke brugt med alle led | 4, 9 | `stakFor` |
| Taktslag Auto og Spor Auto | ✅ lavet | Taktslag og Spor: Auto-valg/Manuel | 4 | `ne2Kp` |
| Vælg kilde og mål for en forbindelse | ✅ lavet | Træk links til en ny kilde eller et nyt mål | 5 | `ne5Flyt` |
| Overblik over alle forbindelser | ✅ lavet | Node-editoren (Noder) og de 10 visninger i Visning ▾ | 2, v9.41 | `ne41Vis` |
| Tilfældige forbindelser | ✅ lavet | Ctrl+K: Tilfældigt | 6 | `neKpPunkter` |
| Auto-opsætning | ✅ lavet | Ctrl+K: Kør Auto-mapping | 6 | `neKpPunkter` |
| Vælg lydfil | ✅ lavet | + Tilføj i Lydkilde: Vælg lydfil … | 6 | `ne6Valg` |
| Lyd ind | ✅ lavet | Lyd ind-noden vises (målere); Lydkildens kontrolpanel og Ctrl+K: Lyd ind til eller fra | 3, v9.39 | `ne3NodeHtml, ne39Handling` |
| Generatoren | ✅ lavet | Lydkildens kontrolpanel: genre, tempo, tæthed, Afspil/Stop, Nyt mønster, Muter lidt, Lydmotor og Avanceret | 3, 6, v9.39 | `ne39KildeHtml` |
| Gem og hent pladserne A og B | ✅ lavet | Kontrolpanelet, når intet er valgt: Gem som 1/2 og Hent 1/2 (og Ctrl+K) | v9.39 | `ne39Handling` |
| A/B-sløjfe | – ikke nødvendig | Sløjfen A · B · ⟲ sidder i bundbaren, som altid kan ses |  |  |
| Åbn Dublet og Routing-overblik | ✅ lavet | Fanen Node-editor og layoutet Noder | 1 | `neVis` |

## Ord

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| **Auto** | ✅ lavet | Nye navne: Auto-mapping, Adaptiv tærskel, Auto-valg, Normalisering: Adaptiv | 15 |  |
| **A/B** | ✅ lavet | Nye navne: Opsætning 1–20 og Sammenlign 1 ↔ 2; sløjfen hedder stadig A · B · ⟲ | 15 |  |
| **Router** | ✅ lavet | Nye navne: Router 2.0 · gammel og Node-editoren | 15 |  |

## Kort over forbindelserne

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Mermaid-kode (📋 Kopiér) | ✅ lavet | Ctrl+K i Node-editoren åbner det samme kort | 16 | `mvkAaben` |
| ⬇ PNG | ✅ lavet | Ctrl+K i Node-editoren åbner det samme kort | 16 | `mvkAaben` |
| ⬇ SVG | ✅ lavet | Ctrl+K i Node-editoren åbner det samme kort | 16 | `mvkAaben` |

## Routing-overblik: de 11 visninger

| Funktion | Status | I Node-editoren | Trin | Kontrol |
| --- | --- | --- | --- | --- |
| Kolonner | ✅ lavet | Node-editoren er kolonner | 1, 2 | `ne2Placer` |
| Frit netværk (kræfter) | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtLayoutFri` |
| Matrix | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| Strømme | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| Tidslinje | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| Træ | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| Treemap | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| Bue-diagram | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| Hive plot | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| Ring (chord) | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rtTegnAndre` |
| 3D-netværk | ✅ lavet | Visning ▾ i Node-editorens værktøjslinje (samme tegning som i Routing-overblik) | v9.41 | `rt3D` |
