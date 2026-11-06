# Funktionsliste · Hjertet (trin 1)

Skrevet ud fra **Claude MV v9.18** (koden og manualen), 4. november 2026. Listen beskriver, hvad de fem dele **kan i dag**. Den er ikke en tegning af den nye Router; designet er ikke færdigt.

Fem dele: **Dublet** · **Router 2.0** · **Routing-overblik** · **Mapping** · **Fanen Lydkilde**.

Fælles for dem alle: de viser og ændrer **den samme liste af forbindelser** (`maps`). En forbindelse, der laves ét sted, står straks alle andre steder.

Ord i listen: *lydtræk* og *kilde* er det, der måles i lyden (fx Kick); *mål* er det, en forbindelse styrer (en effekt eller en figurs egenskab).

---

## 1. Dublet (Scene · fanen Dublet, W8)

| Funktion | Hvor (vindue, fane, knap) | Hvad den gør | Hvordan (klik, træk, skyder, tastgreb) | Bemærkning |
| --- | --- | --- | --- | --- |
| Åbn Dublet | Scene · fanen **Dublet**; knappen **Dublet** under Vinduer i topbjælken; **Dublet** i Live previews bjælke | Viser et spejl af Live preview med lydtræk til venstre og mål til højre | klik | Findes tre steder; vises fra Niveau 2 |
| Luk | Dublet · **Luk** | Lukker Dubletten | klik | |
| Spejlbilledet | Dublet · midten | Viser det samme som Live preview, med et håndtag for hver effekt og figur | – | Kan minimeres til et kort i siden |
| Opløsning | Dublet · **Opløsning** | Billedets skarphed: 100 %, 50 % (standard) eller 25 % | vælg i listen | Til en presset computer |
| Lydtræk til venstre | Dublet · venstre kolonne | Lydtrækkene med et levende niveau og en farvet prik, når de har en forbindelse (prikken lyser, mens forbindelsen er aktiv) | – | |
| Vælg kildegruppe | Dublet · **Lydtræk** | Skifter venstre kolonne: De 14 lydtræk · Toner og klang · Rytme (taktslag) · Master Morph Pad · Hændelser | vælg i listen | **4 spor**-kilderne (fx Trommer · Kick) og de 31 smalle bånd kan ikke vælges her |
| Mål i kasser | Dublet · højre kolonne | Målene i kasser: Scene, Lys og former, Bane, Efterspil og orden, Lyd, Figurer. En valgt figur får sine egenskaber i kasser (Form, Pigge, Farve, Bevægelse, Dybde, Liv) | klik på en kasses overskrift for at folde den ind og ud; rul med musehjulet | Tallet på hver chip er antallet af forbindelser |
| Find mål | Dublet · **Find mål …** | Viser kun de mål, der passer til teksten | skriv | |
| Kun koblede | Dublet · **Kun koblede** | Viser kun mål, der har en forbindelse | flueben | |
| Lav forbindelse | Dublet · lydtræk → mål | Laver en ny forbindelse | **træk** fra et lydtræk til et mål (eller omvendt); eller slip lydtrækket på et **håndtag** i billedet | Slipper man på en figur, spørger en menu, hvilken egenskab der skal styres |
| Flyt effekt eller figur | Dublet · håndtag i billedet | Flytter effekten eller figuren på scenen | træk i håndtaget | |
| Vælg forbindelse | Dublet · kurverne | Vælger en forbindelse; kun forbindelserne for det valgte tegnes | klik på et lydtræk, et mål, et håndtag eller en kurve | Hurtigt, også med hundredvis af forbindelser |
| Ret tærskel og gain | Dublet · båndet under billedet | Ændrer den valgte forbindelses tærskel og gain | to **skydere** | Kun tærskel og gain; resten (attack, release, kurve, spærretid, hold, port …) rettes i Mapping eller Router |
| Slå fra / Slå til | Dublet · båndet under billedet | Slår den valgte forbindelse fra eller til | klik | Findes også i Routing-overblik, Radial Mesh og Form-editoren; **ikke** i Mapping |
| Slet | Dublet · båndet under billedet | Sletter den valgte forbindelse | klik | |
| Kobl via klik | Form-editor · **⚡ Kobl via klik** ved en egenskab, derefter et lydtræk i Dublet | Kobler en egenskab til det lydtræk, man klikker på | klik i Form-editoren, så klik på et lydtræk; Esc afbryder | Virker også i EQ og Radial Mesh |
| Tastatur | Dublet · lærredet har fokus | Gå rundt og lav forbindelser uden mus | ↑ ↓ i en kolonne · ← → skifter kolonne · Home/End · Enter vælger lydtræk og laver forbindelsen på et mål · Enter på en figur åbner dens menu · Enter på en overskrift folder · Esc afbryder · Delete sletter · [ ] eller PgUp/PgDn forrige/næste forbindelse | Tasterne bruges ikke til klaveret, mens lærredet har fokus |

## 2. Router 2.0 (Arbejdsfelt · fanen Router, W32)

| Funktion | Hvor (vindue, fane, knap) | Hvad den gør | Hvordan (klik, træk, skyder, tastgreb) | Bemærkning |
| --- | --- | --- | --- | --- |
| Grafen | Router · midten | Kilder til venstre → én Router-boks pr. forbindelse → mål til højre, med linjer, der lyser efter det, der måles lige nu | – | Vises fra Niveau 2; fanen kan rulle fra v9.18 |
| Ny forbindelse | Router · **+ Ny forbindelse** | Laver en forbindelse (Bas → Lys-puls) | klik | Samme som **Tilføj forbindelse** i Mapping |
| Visning | Router · **Visning: Kompakt · Fuld** | Kompakt viser kilde, VU-måler, tallene, kæden og målet; Fuld viser alt i alle bokse | klik | Valget huskes |
| Detaljer | Router-boks · **Detaljer ▸** (kun i Kompakt) | Åbner én boks med skydere, drejeknapper, Styrke brugt og signalet over tid | klik | |
| Sortering | Router · **Sortér: D2 · Rækkefølge** | D2: kilderne i mapper efter musik med overskrifter, slag → glidende → rampe → valg; Rækkefølge: som forbindelserne bruger dem | klik | D2 gælder kun Router |
| Farve efter type | Router · kilder, bokse og linjer | Slag orange, glidende blå, rampe grøn, valg lilla | – | |
| Kilde-chip | Router · venstre kolonne | Kildens navn, gruppe, type, tal lige nu, en lille måler og "bruges af forbindelse …" | – | |
| Vis kilder, der ikke bruges | Router · flueben | Viser alle andre kilder i deres mapper med tal lige nu | flueben; **＋** på en kilde laver en ny forbindelse fra den | De 31 smalle bånd er foldet sammen (*▸ Bas: 11 smalle bånd*); høje bånd, Rolloff og Zero crossing rate kun på Niveau 4 |
| Standard-visning | Router · **Standard-visning** | Kompakt, D2 og ingen ubrugte kilder | klik | |
| Vælg kilde og mål | Router-boks · listen øverst og **Mål** nederst | Skifter forbindelsens kilde eller mål | vælg i listen; *▸ Vis … smalle bånd* folder ud uden at ændre forbindelsen | |
| Hvor målt, Manuel/Auto | Router-boks · linjen under kilden | Hvor kilden er målt (lydfil, generator, lyd ind, sporet …) og om tærsklen er Manuel eller Auto (Auto-tærskel) | – | Auto-tærskel slås til og fra under Opsætninger, ikke her |
| VU-måler | Router-boks | Lyden lige nu, tærsklen som gul streg, hysterese som svagt bånd, topmærke (peak hold) | **træk** i måleren for at flytte tærsklen | |
| Ind · Tærskel · Ud | Router-boks | Tallene lige nu | – | |
| Signalet over tid | Router-boks (Fuld eller Detaljer) | De sidste 2 sekunder: gråt før kæden, farvet efter | – | |
| Kæden | Router-boks | vend om → tærskel (+ hysterese) → kurve → gain → attack og release → spærretid → hold → slew; de trin, der gør noget, lyser | – | |
| Taktslag Auto | Router-boks (kilder: taktslag og takt) | *Auto · Fra filen · Mens det spiller* med grunden | klik | Findes også i Mapping |
| Spor Auto | Router-boks (kick, snare, hihat, bas, vokal, når der er 4 spor) | *Auto · Samlet lyd · Sporet …* med grunden | klik | Findes også i Mapping |
| Gain, Attack, Release, Hold | Router-boks (Fuld eller Detaljer) | Forbindelsens styrke og tider. Hold: Fra · 50 ms til 2 s · ∞ | **skydere** | Release er grå ved Hold ∞; Hold er grå på klods-spor |
| Styrke brugt | Router-boks (Fuld eller Detaljer) | gain × Samlet styrke × Følsomhed × Afsnits-dynamik; led, der ikke gør noget, er svage | hold musen over for hele regnestykket | Findes også i Mapping |
| Vend om | Router-boks (Fuld eller Detaljer) | Høj lyd giver lav effekt | klik | Findes også i Radial Mesh (*Invertér*); **ikke** i Mapping |
| Drejeknapper | Router-boks (Fuld eller Detaljer) | Hysterese, Kurve, Slew og Spærretid | **træk** op/ned; ↑ ↓ ← → (Shift = fint); dobbeltklik = standard | Spærretid er grå, når kilden glider; Hysterese og Slew er grå på klods-spor |
| ↺ Standard | Router-boks | Sætter kæden tilbage (vend om, hysterese, kurve, slew, spærretid, hold); tærskel, gain, attack og release bliver | klik | |
| Slet | Router-boks · **✕** | Sletter forbindelsen | klik | |
| Fjernede kilder | Router · gul besked og note i boksen | Viser forbindelser med en Lydkort-kilde, der er slået fra | – | |

## 3. Routing-overblik (Scene · fanen Routing, W10)

| Funktion | Hvor (vindue, fane, knap) | Hvad den gør | Hvordan (klik, træk, skyder, tastgreb) | Bemærkning |
| --- | --- | --- | --- | --- |
| Åbn | Scene · fanen **Routing**; knappen **Routing-overblik** under Vinduer i topbjælken | Viser alle forbindelser: lydtræk → mål → figurer og kasser | klik | Findes to steder; vises fra Niveau 3 |
| Luk | Routing-overblik · **Luk** | Lukker overblikket | klik | |
| Layout | Routing-overblik · **Layout** | 11 måder at se de samme forbindelser: Kolonner · Frit netværk (kræfter) · Matrix · Strømme · Tidslinje · Træ · Treemap · Bue-diagram · Hive plot · Ring (chord) · 3D-netværk. Hvert layout skriver sit spørgsmål øverst | vælg i listen | Valget huskes |
| Find | Routing-overblik · **Find …** | Viser kun lydtræk, mål og figurer, der passer | skriv | |
| Levende linjer | Routing-overblik · flueben | Linjerne lyser og bliver tykkere, når forbindelsen slår ud | flueben | |
| Vis slået fra | Routing-overblik · flueben | Viser også forbindelser, der er slået fra (stiplede) | flueben | |
| Fokus | Routing-overblik · en knude | Fremhæver kun knudens forbindelser; klik på en figur vælger den også i Form-editoren | klik; klik igen eller **Ryd fokus** | |
| Vælg forbindelse | Routing-overblik · en linje | Vælger forbindelsen | klik | |
| Ret tærskel og gain | Routing-overblik · båndet under | Ændrer den valgte forbindelses tærskel og gain | to **skydere** | Samme bånd som i Dublet |
| Slå fra / Slå til · Slet | Routing-overblik · båndet under | Slår den valgte forbindelse fra/til eller sletter den | klik | Findes også i Dublet |
| Kræfter (kun Frit netværk og 3D-netværk) | Routing-overblik · bjælken **Kræfter** | Frastødning, Fjederlængde, Tyngdekraft og Retning; Vis kræfter (gule pile); Ryst; Løsn fastgjorte; Standard | **skydere**, flueben og klik | |
| Fastgør knude (Frit netværk) | Routing-overblik · en knude | Placerer og fastgør knuden (gul prik) | **træk**; dobbeltklik løsner; P fastgør/løsner med tastaturet | |
| Tidslinje-layout | Routing-overblik · tidslinjen øverst | Hopper til et sted i sangen | klik | Uden lydfil: de sidste 12 sekunder live |
| Træ-layout | Routing-overblik · fanerne øverst | Vælger, hvilken figur eller kasse der er roden | klik | |
| 3D-netværk | Routing-overblik · tom plads | Drejer netværket | træk | Drejer også langsomt af sig selv |
| Rul | Routing-overblik · en kolonne | Ruller en lang kolonne | musehjul | |
| Tastatur | Routing-overblik · lærredet har fokus | Gå rundt uden mus | ↑ ↓ i en kolonne · ← → skifter kolonne · Home/End · Enter sætter og fjerner fokus · [ ] eller PgUp/PgDn forrige/næste forbindelse · Delete sletter · Esc rydder · P fastgør (Frit netværk) | |
| Lav ny forbindelse | – | – | – | **Kan ikke.** Nye forbindelser laves i Dublet, Radial Mesh, Mapping eller Router |

## 4. Mapping (Arbejdsfelt · fanen Mapping, W12)

| Funktion | Hvor (vindue, fane, knap) | Hvad den gør | Hvordan (klik, træk, skyder, tastgreb) | Bemærkning |
| --- | --- | --- | --- | --- |
| Sådan virker det | Mapping · foldet felt øverst | Kort forklaring af en forbindelse | klik for at folde ud | |
| Gem som A / B · Hent A / B · Skift A/B | Mapping · **Gem indstilling** | Gemmer og henter to pladser med forbindelser (og figurer, scene og lyd); Skift A/B skifter mellem dem | klik | **A** og **B** i bundbaren er noget andet: A/B-sløjfen (et stykke af sangen, der gentages) |
| Kort over forbindelserne | Mapping · **🗺 Kort over forbindelserne** | Alle forbindelser som et stort kort i fuld skærm, med tærskel, Styrke brugt og attack/release på pilene | klik; zoom med hjul eller + −; træk for at flytte; **Tilpas**; **📋 Kopiér Mermaid-kode**; **⬇ PNG**; **⬇ SVG**; **Luk (Esc)** | Kræver internet første gang (Mermaid); findes også i Søg (Ctrl+K) |
| Tilføj forbindelse | Mapping · **Tilføj forbindelse** | Laver en forbindelse (Bas → Lys-puls) | klik | Samme som **+ Ny forbindelse** i Router |
| Minimér alle | Mapping · **Minimér alle** / **Udvid alle** | Gør alle rækker kompakte eller fulde | klik | |
| Ryd hold | Mapping · **Ryd hold** | Sætter alle forbindelser med Hold til 0 | klik | |
| Tilføj morgenstjerne | Mapping · **Tilføj morgenstjerne (figur)** | Tilføjer figuren Morgenstjerne og 6 forbindelser | klik | Findes også i Form-editoren (Ny figur) |
| Tilslut MIDI | Mapping · **Tilslut MIDI** | Gør MIDI-kilderne brugbare | klik | Kun Chrome og Edge |
| Tilfældigt | Mapping · foldet felt **Tilfældigt** | Laver tilfældige forbindelser i tre kategorier | **Tilfældige slag**, **Tilfældige flydende**, **Tilfældige figur-egenskaber**; **Antal** (1–16); **Frø** og **Nyt frø**; **Behold mine** / **Erstat i kategorien**; **Fortryd tilfældigt** (op til 10 trin) | Radial Mesh har **Tilfældigt (alle)** med de samme valg |
| Lydtræk og Effekt | Mapping-række · to lister | Forbindelsens kilde og mål | vælg i listen; *▸ Vis … smalle bånd* folder ud uden at ændre forbindelsen | Listerne fyldes først, når man klikker (for hastighedens skyld) |
| Minimér række | Mapping-række · **−** / **+** | Gør én række kompakt | klik | |
| Fjern | Mapping-række · **Fjern** | Sletter forbindelsen | klik | |
| Styrke brugt | Mapping-række | gain × Samlet styrke × Følsomhed × Afsnits-dynamik | klik på *påvirket af … ting* for hele regnestykket | Findes også i Router |
| 6 skydere | Mapping-række | Tærskel, Gain, Attack ms, Release ms, Kurve, Spærretid ms, med en forklaring under hver | **skydere** | Radial Mesh og EQ har de samme 6 |
| Hold | Mapping-række · **Hold (pause uendelig)** | Effekten bliver stående, til næste lyd kommer | flueben | Router har det som Hold ∞ på skyderen |
| Port og Portgrænse | Mapping-række | Forbindelsen virker kun, når portens kilde er over grænsen | vælg i listen; skyder | **Kun i Mapping**; Router, Dublet og Radial Mesh viser ikke porten |
| Taktslag Auto | Mapping-række (kilder: taktslag og takt) | *Auto · Fra filen · Mens det spiller* med grunden | klik | Findes også i Router |
| Spor Auto | Mapping-række (kick, snare, hihat, bas, vokal, når der er 4 spor) | *Auto · Samlet lyd · Sporet …* med grunden | klik | Findes også i Router |
| Router-linje | Mapping-række | Viser *Router: hysterese … · hold … · slew …*, når de er sat | – | Mapping har ingen skydere til hysterese, hold med tid og slew |
| Fjernede kilder | Mapping · gul besked og note ved rækken | Viser forbindelser med en Lydkort-kilde, der er slået fra | – | |
| Slå fra / Vend om | – | – | – | **Mangler i Mapping.** Slå fra: Dublet, Routing-overblik, Radial Mesh, Form-editor. Vend om: Router og Radial Mesh |

## 5. Fanen Lydkilde (Arbejdsfelt · fanen Lydkilde, W31)

| Funktion | Hvor (vindue, fane, knap) | Hvad den gør | Hvordan (klik, træk, skyder, tastgreb) | Bemærkning |
| --- | --- | --- | --- | --- |
| Auto: Til/Fra | Lydkilde · overskriften | Til: hver gang en sang er analyseret, laver programmet selv forbindelserne | klik | Flyttet fra Lydtræk-guide i v9.16; findes kun her og i Søg |
| Kør auto-opsætning nu | Lydkilde · overskriften | Laver forbindelser ud fra den analyserede sang (op til 3 slag-lydtræk til klods-spor og flydende effekter) | klik | **Erstatter** alle forbindelser. Radial Mesh har også en **Kør Auto**-knap, men den er skjult (`hidden`) og vises aldrig |
| Rul | Lydkilde | Indholdet ruller, når fanen er lav | musehjul | Rettet i v9.17 |
| Lydfil | Lydkilde · kortet **Lydfil** | Vælger og analyserer en lydfil | **træk** en fil ind eller klik; viser fil, længde, tempo, toneart og om analysen kører | Findes også i bundbaren (**Vælg lydfil**) og i sidebjælken (🎵 Musik) |
| 4 spor (stems) | Lydkilde · kortet **4 spor (stems)** | Trommer, Bas, Vokal og Resten spilles som én lyd; hvert spor måles for sig | **træk** en fil på hvert felt eller klik; **Vælg 4 filer …** fordeler efter navnet; **▶ Brug de 4 spor**; **Fjern sporene** | Gul besked, hvis længderne ikke passer; .stem.mp4 kan ikke læses; sporene gemmes ikke |
| Spor-målinger | kildelisterne · grupperne *Spor · Trommer* osv. | 14 lydtræk pr. spor, fx *Trommer · Kick* | vælg i listen | Kun med en fil; ikke i Dublet |
| Spor Auto | Mapping og Router (se dér) | kick, snare, hihat → Trommer; bas → Bas; vokal → Vokal | – | |
| Generator · genre, tempo, tæthed | Lydkilde · kortet **Generator** | Vælger musikken, generatoren laver | liste og **skydere** | Samme indstillinger som i den fulde generator (W4) |
| ▶ Afspil generator · ✦ Nyt mønster · Muter lidt | Lydkilde · kortet **Generator** | Starter/stopper generatoren, laver et nyt mønster, ændrer lidt | klik | Findes også i W4 |
| Lydmotor | Lydkilde · kortet **Generator** | **Ny · Klassisk**, Akkord-flade, Fill hver 4. takt, Rumklang, Tilbage til standard; akkorden lige nu lyser | klik, flueben, skyder | Findes også i W4 |
| Avanceret … | Lydkilde · kortet **Generator** | Åbner den fulde generator (W4) med toneart, lyde, trin og keyboard | klik | |
| Lyd ind | Lydkilde · kortet **Lyd ind** | Tænder og slukker mikrofon eller fanelyd | klik | Findes også i bundbaren og i sidebjælken (🎵 Musik) |

---

## Funktioner, der findes flere steder

| Funktion | Steder |
| --- | --- |
| Lav en forbindelse | Dublet (træk) · Router (**+ Ny forbindelse** og **＋** på en ubrugt kilde) · Mapping (**Tilføj forbindelse**) · Radial Mesh (træk) · EQ (**Opret forbindelse på valgt lydtræk**) · Form-editor (**⚡ Kobl via klik**) |
| Slet en forbindelse | Dublet · Routing-overblik · Router (**✕**) · Mapping (**Fjern**) · Radial Mesh (**Slet forbindelse**) · Delete-tasten i Dublet og Routing-overblik |
| Slå en forbindelse fra og til | Dublet · Routing-overblik · Radial Mesh (**Slå fra**) · Form-editor. *Ikke* i Mapping og Router (Router viser den kun som slukket) |
| Tærskel og gain | Dublet · Routing-overblik · Router · Mapping · Radial Mesh · EQ |
| Alle 6 skydere (tærskel, gain, attack, release, kurve, spærretid) | Mapping · Radial Mesh · EQ · Router (kurve og spærretid som drejeknapper) |
| Vend om (invertér) | Router · Radial Mesh. *Ikke* i Mapping |
| Hold | Mapping (flueben) · Router (Hold ∞ på skyderen) |
| Styrke brugt | Mapping · Router |
| Taktslag Auto og Spor Auto | Mapping · Router |
| Vælg kilde og mål for en forbindelse | Mapping · Router · Radial Mesh (**Mål for forbindelsen**) |
| Overblik over alle forbindelser | Router (graf) · Routing-overblik (11 layouts) · Radial Mesh (net) · Kort over forbindelserne (Mermaid) · Dublet (kun de valgte) |
| Tilfældige forbindelser | Mapping (**Tilfældigt**, tre kategorier) · Radial Mesh (**Tilfældigt (alle)**) |
| Auto-opsætning | Lydkilde (**Kør auto-opsætning nu**) · Radial Mesh (**Kør Auto**, skjult og vises aldrig) · Show-menuen (**Kør Auto**, *Lav show: Rolig/Balanceret/Vild*) |
| Vælg lydfil | Lydkilde · bundbaren · sidebjælken (🎵 Musik) |
| Lyd ind | Lydkilde · bundbaren · sidebjælken (🎵 Musik) |
| Generatoren | Lydkilde (enkel flade) · W4 (fuld flade) · sidebjælken (🎵 Musik) |
| Gem og hent pladserne A og B | Mapping (**Gem indstilling**) · Opsætninger (**Mine opsætninger**: 20 pladser A til T; A og B er de samme som i Mapping) |
| A/B-sløjfe | bundbaren (**A**, **B**, **⟲**) · Tidslinje |
| Åbn Dublet og Routing-overblik | Scenens faner · topbjælken (Vinduer) · Dublet også i Live previews bjælke |

### Ord, der betyder flere ting

| Ord | Betyder |
| --- | --- |
| **Auto** | (1) *Auto: Til/Fra* og *Kør auto-opsætning nu* i Lydkilde: laver forbindelser; (2) *Auto-tærskel*: flytter tærsklen efter sangen; (3) *Taktslag Auto*: fra filen eller mens det spiller; (4) *Spor Auto*: samlet lyd eller sporet; (5) *Auto* i Router-boksen: viser, at Auto-tærskel er i gang |
| **A/B** | (1) to gemte pladser med forbindelser (Mapping); (2) *A/B-sløjfe* i bundbaren og Tidslinjen: et stykke af sangen, der gentages |
| **Router** | (1) *Router 2.0*, fanen Router i Arbejdsfeltet; (2) *Routing-overblik* i Scenen. To forskellige værktøjer |
