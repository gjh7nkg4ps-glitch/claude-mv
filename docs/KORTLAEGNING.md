# KORTLÆGNING · fase 0 i P8.1 · v9.42

*13. november 2026 · fra Claude Code · til brugeren og hovedchatten · plan: `PLAN-NY-BRUGERFLADE.md` (P8.1)*

**Ingen kode er ændret.** Alt her er læst eller målt i `claude-mv-v9_42.html` (6.213.041 bytes, 162.578 linjer).

- **Læst** betyder: fundet i koden med et script. Linjenumrene er linjer i HTML-filen.
- **Målt** betyder: talt i det kørende program i en testbrowser uden grafikkort, i tre størrelser: 1920 × 1080, 2560 × 1440 og 3840 × 2160.

Indhold: [a · Regler](#a--regler) · [b · Auto](#b--auto) · [c · Fjerne-listen](#c--fjerne-listen) · [d · Rester](#d--rester) · [e · Udgangspunkt](#e--udgangspunkt) · [f · Planens tal](#f--planens-tal-tjekket) · [g · Testpakken](#g--testpakken-på-v942) · [h · P7.7 punkt 3](#h--p77-punkt-3)

---

## a · Regler

Regel-listen hedder `maps` i koden. Den gemmes i browseren under nøglen `rytme-mapping2`.

### a1 · Sammendrag (læst)

| Hvad | Antal |
| --- | --- |
| Steder, der ændrer selve listen (lægger til, fjerner eller erstatter) | **69 fundet** |
| … heraf en lokal liste med samme navn i `lavRandomAlt` (ikke regel-listen) | 3 |
| … heraf selve oprettelsen ved start | 1 |
| **Steder, der skal flyttes til den fælles indgang** | **65** |
| Steder, der skriver et felt på en regel (fx tærskel, styrke, kilde) | 59 skrivninger fordelt på 33 funktioner |
| Kald af `renderMaps()` ("reglerne er ændret") | 64 |
| Udgaver af `renderMaps` oven på hinanden | 4 (den oprindelige og tre tilføjelser: v9.12, v9.13 og v9.15) |
| Opslag af det slettede Mapping-vindues liste (`$('maps')`) | 15 |

De 69 fordeler sig sådan: `maps = …` 36 (heraf 19 `maps = maps.filter(…)`, 1 `flatMap` og 16, der erstatter hele listen), `maps.push` 26, `maps.splice` 6 og `maps.length = 0` 1.

**Tre steder er vigtigere end de andre**, fordi de erstatter hele listen uden at spørge eller mens man arbejder:

| Sted | Linje | Hvorfor det er vigtigt |
| --- | --- | --- |
| `autoSetup` (Auto-mapping) | 4015 | Erstatter alle regler. Kører også af sig selv efter en analyse, hvis *Auto-mapping: Til*: lydfil (linje 3854), generator (4163) og 4 spor (7021) |
| `mmpBlTrin` (Morph Pad) | 7411 | Erstatter hele listen igen og igen, mens Morph Pad blander opsætninger. Den står ikke i planens liste i fase 4 |
| `feGendan` (Ctrl+Z) | 6034 | Fortryd sætter hele listen tilbage. Den fælles indgang skal bygges rundt om denne |

### a2 · Hvert sted, der ændrer listen (læst)

Kolonnen *Hvor* er rettet i hånden, hvor scriptet kun kunne finde den nærmeste funktion ovenfor. *(uden blok)* betyder, at koden står i den gamle del af scriptet, før blokkene fik markeringer.

| Nr. | Linje | Hvordan | Hvor (funktion eller sted) | Blok | Hvad stedet gør |
| --- | --- | --- | --- | --- | --- |
| 1 | 3785 | `maps =` | start | (uden blok) | Listen laves ved start (standard-reglerne) |
| 2 | 3786 | `maps =` | start | (uden blok) | Gemte regler hentes ved start |
| 3 | 3947 | `maps.splice` | Mapping (slettet vindue) | (uden blok) | Slet-knappen i en Mapping-række; vinduet findes ikke mere |
| 4 | 3949 | `maps.push` | Mapping (slettet vindue) | (uden blok) | Ny forbindelse-knappen i Mapping; knappen findes ikke mere |
| 5 | 3978 | `maps =` | Preset som tekst · Indlæs | (uden blok) | Hele listen erstattes af den indlæste tekst |
| 6 | 4015 | `maps =` | autoSetup | (uden blok) | **Auto-mapping: hele listen erstattes** |
| 7 | 4020 | `maps =` | applyPreset | (uden blok) | En fast opsætning (Standard, Fast 2): hele listen erstattes |
| 8 | 4058 | `maps.push` | EQ | (uden blok) | Ny regel fra den valgte søjle til Glød |
| 9 | 4460 | `maps.splice` | Radial Mesh | (uden blok) | Slet den valgte regel |
| 10 | 4482 | `maps =` | Radial Mesh · Multi-styring | FASE 2: MESH-FUNKTIONER | Pucken slippes: listen sættes tilbage til udgangspunktet |
| 11 | 4502 | `maps =` | anvend | FASE 2: MESH-FUNKTIONER | Hent en opsætning eller plads: hele listen erstattes |
| 12 | 4541 | `maps.push` | klodsMangler | FASE 2: SCENE (trin 3): fundamentet | Fylder tomme klods-spor med nye regler |
| 13 | 4542 | `maps =` | baneSkabelon | FASE 2: SCENE (trin 3): fundamentet | Fjerner regler til klods-spor, der ikke findes mere |
| 14 | 4546 | `maps =` | sporAendret | FASE 2: SCENE (trin 3): fundamentet | Samme, når antal spor ændres |
| 15 | 4577 | `maps =` | Bane og klods · Nulstil | FASE 2: SCENE (trin 3): fundamentet | Samme, ved nulstilling af banen |
| 16 | 4641 | `maps =` | bindLyd | FASE 2: LYDLAG (trin 5) | Lydlag: erstatter reglen til et lydlag |
| 17 | 4641 | `maps.push` | bindLyd | FASE 2: LYDLAG (trin 5) | (samme sted, linjen har flere) |
| 18 | 4695 | `maps =` | nulstilAlt | FASE 2: OPSÆTNINGER OG SIKKERHED | Nulstil alt: standard-reglerne |
| 19 | 4726 | `maps =` | lavRandomAlt | FASE 2: OPSÆTNINGER OG SIKKERHED | *Lokal liste med samme navn (ikke regel-listen)* |
| 20 | 4731 | `maps.push` | lavRandomAlt | FASE 2: OPSÆTNINGER OG SIKKERHED | *Lokal liste (ikke regel-listen)* |
| 21 | 4732 | `maps.push` | lavRandomAlt | FASE 2: OPSÆTNINGER OG SIKKERHED | *Lokal liste (ikke regel-listen)* |
| 22 | 4755 | `maps =` | lavIsoleret | v5.6: NYE FORUDINDSTILLINGER | Idé-galleriet bygger en opsætning i en tom liste … |
| 23 | 4755 | `maps.push` | lavIsoleret | v5.6: NYE FORUDINDSTILLINGER | (samme sted, linjen har flere) |
| 24 | 4755 | `maps.push` | lavIsoleret | v5.6: NYE FORUDINDSTILLINGER | (samme sted, linjen har flere) |
| 25 | 4757 | `maps =` | lavIsoleret | v5.6: NYE FORUDINDSTILLINGER | … og sætter den rigtige liste tilbage bagefter |
| 26 | 4791 | `maps.push` | opDronninger | v6.6: DISKODRONNINGERNE | Diskodronningerne: regler til de nye figurer |
| 27 | 4798 | `maps.length =` | lavSinglen | v6.6: DISKODRONNINGERNE | Singlen: listen tømmes inde i lavIsoleret |
| 28 | 5465 | `maps =` | rndTilfoej | TILFÆLDIGT | Tilfældigt med Erstat: fjerner kategoriens regler |
| 29 | 5470 | `maps.push` | rndTilfoej | TILFÆLDIGT | Tilfældigt: nye regler |
| 30 | 5480 | `maps =` | fortrydTilfaeldigt | TILFÆLDIGT | Fortryd tilfældigt: hele listen sættes tilbage |
| 31 | 5497 | `maps =` | lavFigurer | FIGUR-GENERATOR | Figur-generator med Erstat: fjerner de gamle figurers regler |
| 32 | 5523 | `maps =` | fortrydFigurer | FIGUR-GENERATOR | Fortryd figurer: hele listen sættes tilbage |
| 33 | 5749 | `maps.push` | meshKobl | TASTATURSTYRING AF RADIAL MESH | Radial Mesh: ny regel ved træk eller Enter |
| 34 | 5764 | `maps.splice` | Radial Mesh · Delete | TASTATURSTYRING AF RADIAL MESH | Slet den valgte regel |
| 35 | 5832 | `maps =` | danserKobl | DANSER: eksempel, Dansemapping og udseender | Dansemapping: erstatter reglen til én danse-egenskab |
| 36 | 5832 | `maps.push` | danserKobl | DANSER: eksempel, Dansemapping og udseender | (samme sted, linjen har flere) |
| 37 | 5838 | `maps =` | diskoKobl | DANSER: eksempel, Dansemapping og udseender | Diskokuglen: fjerner dens gamle regler … |
| 38 | 5839 | `maps.push` | diskoKobl | DANSER: eksempel, Dansemapping og udseender | … og lægger de nye |
| 39 | 5839 | `maps.push` | diskoKobl | DANSER: eksempel, Dansemapping og udseender | … og lægger de nye |
| 40 | 5861 | `maps =` | danserBlok | DANSER: eksempel, Dansemapping og udseender | Dansemapping-panelet: fjerner regler for en bevægelse |
| 41 | 5865 | `maps =` | danserBlok | DANSER: eksempel, Dansemapping og udseender | Dansemapping-panelet: fjerner én regel |
| 42 | 5877 | `maps =` | Form-editor · start | FASE 2: FORM-EDITOR (trin 1 og 2) | Gamle Morgenstjerne-regler flyttes til figuren (migrering) |
| 43 | 5911 | `maps =` | remapLag | FASE 2: FORM-EDITOR (trin 1 og 2) | Lag flyttes eller slettes: reglernes lag-numre rettes |
| 44 | 5926 | `maps.push` | opTrommer | FASE 2: FORM-EDITOR (trin 1 og 2) | Trommeslageren: regler til de nye figurer |
| 45 | 5973 | `maps.push` | opPerfect | PERFECT 1 OG PERFECT 2 (lyd og vision) | Perfect 1 og 2: regler til figurerne |
| 46 | 5974 | `maps.push` | opPerfect | PERFECT 1 OG PERFECT 2 (lyd og vision) | Perfect 1 og 2: regler til scene-effekterne |
| 47 | 5981 | `maps.push` | opDup | (uden blok) | Duplikér figur: kopierer dens regler |
| 48 | 5983 | `maps =` | opSlet | (uden blok) | Slet figur: fjerner dens regler |
| 49 | 5987 | `maps.push` | lagDup | (uden blok) | Duplikér lag: kopierer lagets regler |
| 50 | 6034 | `maps =` | feGendan | (uden blok) | **Fortryd / Gentag (Ctrl+Z): hele listen sættes tilbage** |
| 51 | 6070 | `maps.push` | skabHnd | v5.2: HÆNDELSER PÅ DE FÆRDIGE FIGURER | Hændelser på de færdige figurer: nye regler |
| 52 | 6095 | `maps =` | adfSlaa | v6.0: ADFÆRD OG LEVENDE PRIKKER | Adfærd fjernes: fjerner dens regel |
| 53 | 6097 | `maps =` | adfSlaa | v6.0: ADFÆRD OG LEVENDE PRIKKER | Adfærd lægges på: erstatter reglen |
| 54 | 6097 | `maps.push` | adfSlaa | v6.0: ADFÆRD OG LEVENDE PRIKKER | (samme sted, linjen har flere) |
| 55 | 7174 | `maps =` | Editor · skift form | (uden blok) | Fjerner regler til egenskaber, den nye form ikke har |
| 56 | 7182 | `maps =` | Editor · Nulstil figur | (uden blok) | Fjerner figurens regler |
| 57 | 7184 | `maps =` | Editor · Fjern koblinger | (uden blok) | Fjerner lagets regler |
| 58 | 7201 | `maps.splice` | Editor · fanen Koblinger | (uden blok) | Slet en kobling |
| 59 | 7211 | `maps =` | bindProp | (uden blok) | Editoren: kobl en egenskab til et lydtræk (også Auto-kobl og ⚡ Kobl via klik) |
| 60 | 7211 | `maps.push` | bindProp | (uden blok) | (samme sted, linjen har flere) |
| 61 | 7215 | `maps.push` | addMorgenstjerne | (uden blok) | Tilføj morgenstjerne: 6 regler |
| 62 | 7221 | `maps =` | Editor · Levende | (uden blok) | Levende slås fra: fjerner fødsels-reglen |
| 63 | 7228 | `maps =` | Editor · Levende | (uden blok) | Fødes af: erstatter fødsels-reglen |
| 64 | 7228 | `maps.push` | Editor · Levende | (uden blok) | (samme sted, linjen har flere) |
| 65 | 7411 | `maps =` | mmpBlTrin | MASTER MORPH PAD (v3.6) | **Morph Pad: hele listen erstattes, mens pucken bevæger sig** |
| 66 | 8292 | `maps.push` | ne5Ny | v9.23: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER | Node-editoren: ny regel |
| 67 | 8326 | `maps.splice` | ne5Slet | v9.23: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER | Node-editoren: slet regel |
| 68 | 8584 | `maps.push` | neBrugSkabelon | v9.29: NODE-EDITOR (TRIN 11): SKABELONER | Node-editoren: skabelon lægger regler |
| 69 | 9176 | `maps.splice` | rtSlet | v9.41: DE 10 VISNINGER I NODE-EDITOREN | Visningerne (fra Routing-overblik): slet regel |

### a3 · Steder, der skriver et felt på en regel (læst)

Disse ændrer ikke listen, men en regels indhold. De skal også gennem den fælles indgang (`ret(id, felter)`), ellers ved Fortryd og skærmen ikke besked.

| Linje | Blok | Funktion (nærmeste) | Antal | Felter |
| --- | --- | --- | --- | --- |
| 4046 | (uden blok) | manualSoeg | 2 | min |
| 4061 | (uden blok) | eqThr | 1 | thr |
| 4459 | (uden blok) | meshLine | 2 | inv, off |
| 4755 | v5.6: NYE FORUDINDSTILLINGER | lavIsoleret | 1 | inv |
| 4812 | v5.7: 11 NYE FORUDINDSTILLINGER | nyFig | 1 | inv |
| 5209 | SHOW: tilpas figurer og effekter til sangen | lavShow | 2 | thr |
| 5232 | SHOW: tilpas figurer og effekter til sangen | showKontrol | 1 | thr |
| 5866 | DANSER: eksempel, Dansemapping og udseender | danserBlok | 2 | band, gain |
| 6915 | v9.12: FJERNEDE KILDER | fjernetTjek | 2 | fjernet, off |
| 6965 | v9.13: TAKTSLAG AUTO | lsSkift | 1 | takt |
| 6981 | v9.13: TAKTSLAG AUTO | taktLinje | 2 | takt |
| 6989 | v9.15: 4 SPOR (STEMS) | taktLinje | 1 | spor |
| 7054 | v9.15: 4 SPOR (STEMS) | stemLinje | 2 | spor |
| 7198 | (uden blok) | (lytter uden navn) | 3 | band, off |
| 7218 | (uden blok) | addMorgenstjerne | 1 | effect |
| 7410 | MASTER MORPH PAD (v3.6) | mmpBlTrin | 1 | min |
| 8166 | v9.22: NODE-EDITOR (TRIN 4): RET EN REGEL | ne4Saet | 9 | assign, hold, holdMs, inv, port, portT, slags |
| 8292 | v9.23: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER | ne5Ny | 1 | slags |
| 8308 | v9.23: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER | ne5Slip | 4 | band, effect, port, portT |
| 8321 | v9.23: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER | ne5Start | 2 | off |
| 8469 | v9.26: NODE-EDITOR (TRIN 8): FLERE REGLER PÅ ÉT  | neSaetKomb | 2 | komb |
| 8540 | v9.28: NODE-EDITOR (TRIN 10): LÆR OG ADAPTIV TÆR | neLaer | 2 | gain, thr |
| 8584 | v9.29: NODE-EDITOR (TRIN 11): SKABELONER | neBrugSkabelon | 2 | inv, komb |
| 9182 | v9.41: DE 10 VISNINGER I NODE-EDITOREN | rtStrip | 1 | off |
| 3946 | (uden blok) | renderMaps | 3 | feltet vælges af skyderen (`m[f] = …`) |
| 4056 | (uden blok) | eqRefresh | 1 | feltet vælges af skyderen (`m[f] = …`) |
| 4458 | (uden blok) | meshLine | 1 | feltet vælges af skyderen (`m[f] = …`) |
| 4470 | FASE 2: MESH-FUNKTIONER | puckApply | 1 | feltet vælges af skyderen (`m[f] = …`) |
| 7197 | (uden blok) | (lytter uden navn) | 1 | feltet vælges af skyderen (`m[f] = …`) |
| 7410 | MASTER MORPH PAD (v3.6) | mmpBlTrin | 1 | feltet vælges af skyderen (`m[f] = …`) |
| 8169 | v9.22: NODE-EDITOR (TRIN 4): RET EN REGEL | ne4Saet | 1 | feltet vælges af skyderen (`m[f] = …`) |
| 8172 | v9.22: NODE-EDITOR (TRIN 4): RET EN REGEL | ne4Saet | 1 | feltet vælges af skyderen (`m[f] = …`) |
| 9181 | v9.41: DE 10 VISNINGER I NODE-EDITOREN | rtStrip | 1 | feltet vælges af skyderen (`m[f] = …`) |

Scriptet finder kun skrivninger gennem navnene `m`, `maps[i]` og nogle få andre. Der kan være enkelte flere (fx gennem `forEach(x => …)`). Testen i fase 1 ("ingen kode uden for den fælles indgang skriver til `maps`") skal derfor laves ved at fryse listen i testen, ikke ved at lede i teksten.

### a4 · Hvor en regels data ligger (læst)

| Data | Ligger i | Gemmes under | Følger med i Opsætning 1–20 | Ctrl+Z |
| --- | --- | --- | --- | --- |
| Selve reglen (kilde, mål, tærskel, styrke, kæden, `komb`, `slags`) | `maps` | `rytme-mapping2` | ja | ja |
| Trim pr. lydtræk og effekt-gruppernes styrke, øje og Slå fra | `scene.ne` | `rytme-scene` | ja | **nej** |
| Figurens styrke, øje og Slå fra | figuren (`o.neStyrke`, `o.neFra`) | `rytme-objekter` | ja | ja |
| Nodens plads, parkeret, løse noder, egne skabeloner, slukkede scener, sortering | `set.ne` | `rytme-set` | **nej** (gælder alle opsætninger) | nej |
| Samlet styrke og Normalisering | `gmaster`, `mode` | i opsætningen | ja | **nej** |

En regel har **intet id**. Node-editoren kender den på *kilde, mål og nummer*. Node-editoren opdager ændringer ved at regne en signatur (`ne2Sig`) og sammenligne den med den forrige, hver gang den tegner.

---

## b · Auto

Jeg har fundet **36 ting**, der hedder Auto eller Automatisk, eller som gør noget af sig selv. Planen skriver "mindst 15".

### b1 · Skriver regler

| Nr. | Navn på skærmen | Hvor | Funktion · linje | Hvad den ændrer | Spørger først? |
| --- | --- | --- | --- | --- | --- |
| B1 | **Auto-mapping: Til/Fra** | Lydkilde, Node-editoren (Lydkilde-noden), Ctrl+K | `autoOn` · 4021 | Når den er Til, køres B2 efter hver analyse: lydfil, generator og 4 spor (linje 3854, 4163 og 7021). Fra ved start | nej |
| B2 | **Kør Auto-mapping nu** · "Lyt til sangen" | Lydkilde, Node-editoren, Ctrl+K, Radial Mesh (skjult knap *Kør Auto*), Idé-galleri | `autoSetup` · 4003 | **Erstatter alle regler.** Kender kun klodser og de gamle effekter, ikke figurerne | nej (Ctrl+Z virker) |
| B3 | Program auto: *Lyt til sangen: rolig · balanceret · tæt* | Opsætninger og Idé-galleri | `FORINDST` auto1–3 · 4739 | Det samme som B2 med tre tætheder | nej |
| B4 | **Auto-kobl** | Editoren · fanen Lag | 7213 (`bindProp`) | Lægger en regel på hver "oplagt" egenskab i laget, der ikke har en | nej |
| B5 | Dansemapping | Editoren (danser) | `danserKobl` · 5832 | Erstatter reglen til hver danse-bevægelse | nej |
| B6 | Diskokuglens kobling | Editoren (discokugle) | `diskoKobl` · 5838 | Erstatter kuglens regler | nej |
| B7 | **Lav show: Rolig · Balanceret · Vild** | Mere, Show-vinduet | `lavShow` · 5196 | **Erstatter alle regler og alle figurer** og sætter afsnits-dynamik ud fra sangen. Har sin egen *Fortryd sidste show* | nej |
| B8 | **Tilfældigt** (slag, flydende, figur-egenskaber, alle) | Værksted, Radial Mesh, Ctrl+K | `rndTilfoej` · 5464 | Lægger regler til eller erstatter en kategori. Egen *Fortryd tilfældigt* | nej |
| B9 | Random alt · *Tilfældig* og *Tilfældig, maks.* | Opsætninger | `lavRandomAlt` · 4723 | Ny tilfældig opsætning: regler, figurer og bane | nej |
| B10 | **Random alt: skift automatisk** (hvert 10.–60. sekund) | Opsætninger, Mere | `ops-skift` · 4852 | Kører B9 igen og igen | nej |
| B11 | Figur-generatorens kobling | Editoren · Ny figur | `lavFigurer` · 5489 | Nye figurer med regler. Egen *Fortryd figurer* | nej |
| B12 | Skabeloner | Node-editoren, Ctrl+K | `neBrugSkabelon` · 8579 | Lægger en skabelons regler på en figur | nej (Ctrl+Z virker) |
| B13 | Tilføj morgenstjerne | Værksted, Editoren, Node-editoren | `addMorgenstjerne` · 7214 | Figuren og 6 regler | nej |
| B14 | Udfyldning af klods-spor | sker af sig selv | `klodsMangler` · 4541 | Lægger en regel på hvert tomt klods-spor, når en opsætning hentes, eller antal spor ændres | nej, og siges kun i en statuslinje |
| B15 | Hændelser på de færdige figurer | Editoren · skabeloner *Med hændelser* | `skabHnd` · 6068 | Lægger hændelses-regler på en ny skabelon-figur | nej |
| B16 | Adfærd ("Hop på kick" …) | Editoren · fanen Adfærd | `adfSlaa` · 6092 | Ét klik lægger eller fjerner en regel | det er selve klikket |
| B17 | **Morph Pad** (og *Selvkørsel*) | Morph Pad | `mmpBlTrin` · 7407 | Blander 2–4 opsætninger og **erstatter hele listen løbende**. Med Selvkørsel bevæger pucken sig selv | nej |
| B18 | Multi-styring (pucken i Radial Mesh) | Radial Mesh | `puckApply` · 4469 | Skruer på mange reglers tærskel og styrke på én gang; sætter dem tilbage, når pucken slippes | det er selve trækket |
| B19 | Fjernede kilder | sker af sig selv | `fjernetTjek` · 6915 | Slår regler fra, der bruger det fjernede Lydkort | nej (gul besked) |

Planens liste i fase 4 mangler **B10, B14, B15, B17, B18 og B19**.

### b2 · Vælger en måling eller et tal

| Nr. | Navn på skærmen | Hvor | Linje | Hvad den ændrer |
| --- | --- | --- | --- | --- |
| B20 | **Auto-valg · Taktslag** | reglens kontrolpanel | `taktValg` · 6971 | Om taktslaget læses fra filen eller mens det spiller (`m.takt`) |
| B21 | **Auto-valg · Spor** | reglens kontrolpanel | `stemValg` · 7044 | Om kick, snare, hihat, bas og vokal læses fra de 4 spor (`m.spor`) |
| B22 | **Adaptiv tærskel** (før Auto-tærskel) | reglens kontrolpanel, EQ, Opsætninger | `set.tilpas` | Flytter tærsklen efter sangen. Gælder alle regler |
| B23 | **Normalisering: Adaptiv · Fast** | Node-editorens linje, Mere | `applyNorm` · 3893 | Hvordan lydtrækkenes tal skaleres |
| B24 | **Lær** | reglens kontrolpanel | `neLaer` · 8539 | Sætter tærskel (eller mindst, mest og styrke) ud fra sangen. Ét tryk, kan fortrydes |
| B25 | Klods-timing: *Auto: klodsen rammer på slaget* | Bane og klods | `stmode` · 4556 | Om klodserne forudsiges fra filen eller kommer efter slaget |

### b3 · Visning og ydelse

| Nr. | Navn på skærmen | Hvor | Hvad den ændrer |
| --- | --- | --- | --- |
| B26 | Automatisk skarphed | Mesh 3D | Sænker opløsningen, når billedet hakker (`M3.kval`) |
| B27 | Kvalitetsregulator | Kvalitet | Sænker glød, partikler og billeder i sekundet, når det hakker (`REG`) |
| B28 | Linjer: **Auto** · Canvas 2D | Node-editorens kontrolpanel | WebGPU, ellers WebGL2, ellers Canvas 2D |
| B29 | Topbar: *Skjul automatisk* | Mere · Topbar | Topbaren gemmer sig |
| B30 | Tema: *Automatisk* | Indstillinger | Lyst eller mørkt efter computeren |
| B31 | Billede: *Automatisk* | Editoren | Hvor meget plads figurens billede får |
| B32 | *Bevæg selv* | Mesh 3D og Øjet | Kameraet bevæger sig af sig selv |
| B33 | Hvem danser: *Automatisk* | Mesh 3D · Lys | Den første danser blandt figurerne, ellers den indbyggede |
| B34 | **Tilpas** og *Placér* | Node-editoren | Zoom, så alt kan ses; stil noderne igen |
| B35 | Gemmer af sig selv | hele programmet | Regler, figurer, scene og indstillinger gemmes i browseren efter hver ændring |
| B36 | ✦ Nyt mønster (manualen kalder den *Generér automatisk*) | generatoren | Nyt trommemønster |

**Fortryd findes i 6 udgaver** (planen skriver 5): Ctrl+Z (Editoren og Node-editoren deler historik), Fortryd tilfældigt, Fortryd figurer, Fortryd sidste show, Fortryd for lyset i Mesh 3D og Fortryd for lyset i Øjet.

---

## c · Fjerne-listen

**Brugeren har svaret den 13. november.** Afgørelsen for hvert nummer står i `PLAN-NY-BRUGERFLADE.md` (P8.2), afsnit 3.1. Kolonnen *Mit forslag* nedenfor er, som den var, før svaret.

**Sådan svarer du:** skriv numrene, fx `behold 1-9, 13 · fjern 16, 23, 24 · ved ikke 7, 8`.

Tallene i kolonnen *Kontroller* er **knapper · skydere · dropdowns**, målt i programmet. Kolonnen *Mit forslag* er kun et forslag; du bestemmer. Det, planens afsnit 5 siger ikke må ændres, står som **bliver**.

### c1 · Vinduer (28 i filen: 24 rigtige og 4 skjulte beholdere)

| Nr. | Vindue | Hvad det gør | Kontroller | Åbnes i dag fra | Mit forslag |
| --- | --- | --- | --- | --- | --- |
| 1 | **Live preview** (W2) | Scenen med figurer, bane og effekter | 9 · 0 · 1 | Scene-zonen, alle layouts | **bliver** |
| 2 | **Radial Mesh** (W5) | Lydtræk yderst, mål inderst; træk en regel. Har også Multi-styring, Tilfældigt og A/B | 22 · 8 · 11 | Scene-zonen | **bliver** |
| 3 | **Mesh 3D** (W28) | Reglerne som 3D-net med lys og danser | 13 · 0 · 0 | Scene-zonen | **bliver** |
| 4 | **Øjet** (W29) | Lys fra fremtiden ud fra den analyserede sang | 11 · 1 · 0 | Scene-zonen | **bliver** |
| 5 | **EQ** (W3) | Søjler; træk tærskel; Adaptiv tærskel | 6 · 8 · 1 | Scene-zonen | **bliver** |
| 6 | **EQ+** (W24) | Vandfald, topværdi, lyt til ét bånd | 10 · 0 · 1 | Scene-zonen | behold |
| 7 | **Morph Pad** (W11) | Blander 2–4 opsætninger med en puck; erstatter regel-listen løbende (se B17) | 8 · 4 · 1 | Scene-zonen, Mere | ved ikke |
| 8 | **Lyd i 3D** (W9) | Musikken som landskab og striber | 6 · 0 · 3 | Scene-zonen, Mere | ved ikke |
| 9 | **Node-editor** (W33) | Regler som noder og links | 40 · 5 · 15 | Arbejdsfeltet | behold (valg V1) |
| 10 | **Tidslinje** (W1) | Lydtræk over tid; spring, vælg klip, A/B-sløjfe | 13 · 0 · 1 | Arbejdsfeltet | behold |
| 11 | **Analyse** (W7) | Log-spektrum, toneklasser, tonehøjde | 4 · 0 · 0 | Arbejdsfeltet | behold |
| 12 | **Lydkilde** (W31) | Lydfil, 4 spor, generator, Lyd ind, Auto-mapping | 17 · 3 · 1 | Arbejdsfeltet | behold |
| 13 | **Editor** (W6) | Figurer: Ny figur, Adfærd, Figur, Lag, Koblinger | 87 · 34 · 27 | Editor-zonen | behold (bygges om i fase 6) |
| 14 | **Opsætninger** (W13) | 34 færdige opsætninger, 20 egne pladser, Gem som 1/2 | 39 · 0 · 2 | Editor-zonen | behold |
| 15 | **Idé-galleri** (W22) | De samme opsætninger som små billeder, man kan prøve | 5 · 0 · 1 | Editor-zonen, sidebjælken | ved ikke (dublet af 14) |
| 16 | **Preset (tekst)** (W21) | Opsætningen som JSON-tekst: kopiér og indlæs | 7 · 0 · 0 | kun ＋, sidebjælken, Ctrl+K | behold lille (planen: bag Mere i Show) |
| 17 | **Generator (fuld)** (W4) | Trin-sequencer med 8 instrumenter, toneart og keyboard | 315 · 15 · 6 | layoutet Lyd, Lydkilde · Avanceret | ved ikke (315 knapper er trinene) |
| 18 | **Lydlag** (W15) | Lyde, der spilles, når en regel slår til | 10 · 8 · 5 | layoutet Lyd | ved ikke |
| 19 | **Kvalitet** (W14) | Kvalitetsniveau, regulator, måletest | 12 · 5 · 2 | kun ＋, Mere, Ctrl+K | behold lille |
| 20 | **Bane og klods** (W16) | Klodsbanen fra rytmespillet: spor, fart, timing | 9 · 8 · 2 | kun ＋, Ctrl+K | efter valg V2 |
| 21 | **Show** (W17) | Lav show ud fra sangen; afsnittenes vægte; hvilke figurer der optræder | 19 · 0 · 0 | kun ＋, Mere | ved ikke |
| 22 | **Lydtræk-guide** (W18) | Forklaring af lydtrækkene, Standard og Fast 2, og de knapper, der blev flyttet fra Mapping (Tilfældigt, Ryd hold, Tilslut MIDI, Kort) | 15 · 0 · 0 | kun ＋, Ctrl+K | fjern vinduet, flyt det brugte |
| 23 | **Audit** (W19) | Tabel: hvor godt hvert lydtræk passer til sangen | 4 · 0 · 0 | kun ＋, Ctrl+K | ved ikke |
| 24 | **Detektion** (W20) | Tryk K og S i takt og mål, hvor præcis slag-detektionen er | 7 · 1 · 0 | kun ＋, Ctrl+K | ved ikke |

De 4 beholdere (W23 Scene, W25 Arbejdsfelt, W26 Værksted, W27 Opsætninger) er rester fra systemet med samlinger. De vises aldrig med docking. 13 af de 28 vinduer står ikke i nogen zone fra start (10 af dem ligger skjult i den gamle højre dock).

### c2 · Visninger og dele af Node-editoren

| Nr. | Del | Hvad den gør | Mit forslag |
| --- | --- | --- | --- |
| 25 | Visning: **Noder (kolonner)** | Node-editoren selv | behold |
| 26 | Visning: Frit netværk (kræfter) | Knuder, der skubber til hinanden; Kræfter-bjælke | valg V3 venter |
| 27 | Visning: Matrix (den gamle fra v3.4) | Lydtræk × mål; kan ikke lave regler | erstattes i fase 2 |
| 28 | Visning: Strømme | Hvor meget styrer hver lyd | valg V3 venter |
| 29 | Visning: Tidslinje | Hvornår i sangen slår hver regel til | behold (planen) |
| 30 | Visning: Træ | Hvad påvirker denne figur | valg V3 venter |
| 31 | Visning: Treemap | Hvor stor en del har hver figur | valg V3 venter |
| 32 | Visning: Bue-diagram | Hvilke lyde deler de samme mål | valg V3 venter |
| 33 | Visning: Hive plot | Hvordan fordeler reglerne sig | valg V3 venter |
| 34 | Visning: Ring (chord) | Hvad hænger sammen på kryds og tværs | valg V3 venter |
| 35 | Visning: 3D-netværk | Netværket i rummet | valg V3 venter |
| 36 | Kolonnen **Ikke i brug** (parkér) | Parkér en kilde, så dens regler sover | ved ikke |
| 37 | **Baggrund ▾** | Live preview, Mesh 3D eller Øjet bag noderne | ved ikke |
| 38 | **Dæmp** | Det, der ikke slår til, bliver svagt | ved ikke |
| 39 | **Kun valgt kæde** | Kun den valgte kæde lyser | behold |
| 40 | **Sortér: Figur → mål · D2** | Rækkefølgen på lærredet | behold (matrixen bruger D2) |
| 41 | **Håndtag i billedet** | Flyt effekter og figurer i det lille scene-billede | ved ikke (dublet af Flyt effekter) |
| 42 | **Linjer: Auto · Canvas 2D** | Hvad linjerne tegnes med | flyt til Indstillinger |
| 43 | **Skabeloner** (6 faste og egne) | Læg et sæt regler på en figur | bliver til forslag i fase 4 |
| 44 | **Lær** | Sæt tærsklen ud fra sangen | behold |
| 45 | **Største · Læg sammen · Gang** | Flere regler på samme mål | behold |
| 46 | **Trim** og **figur-styrke** | Styrke pr. lydtræk og pr. figur | behold |
| 47 | **Øje og Slå fra** på figurer og effekt-grupper | Skjul eller sluk | behold |
| 48 | Scene-nodens knapper | Riv løs, Send til skærm, Sluk, Åbn stort | ved ikke |
| 49 | Knapperne fra v9.39 i kontrolpanelet | Lydfil, 4 spor, generator, Lydmotor, Lyd ind, Auto-mapping, Gem som 1/2, Hent 1/2, Sammenlign, Tilslut MIDI, Tilføj morgenstjerne | fjern (de findes i deres egne vinduer) |
| 50 | Analysernes foldede grupper og de 9 analyse-noder | Vejen fra lyd til lydtræk | behold |

### c3 · Rammen om vinduerne

| Nr. | Del | Hvad den gør | Kontroller | Mit forslag |
| --- | --- | --- | --- | --- |
| 51 | **Sidebjælken** | 9 punkter: Musik, Scene, Editor, Forbindelser, Galleri, Opsætninger, Vis, Mere, Hjælp, med udfoldspaneler | 9 + 39 i panelerne | fjern (fase 5) |
| 52 | **De 6 layout-knapper** | Overblik, Show, Byg, Lyd, Figurer, Noder | 6 | fjern (fase 5) |
| 53 | 💾 Gem layout og **Mine layouts** | Gem og hent egne opstillinger af vinduer (6 pladser) | 4 | fjern (fase 5) |
| 54 | 🔒 **Lås vinduer** og ↺ **Standard** | Lås streger og faner; sæt layoutet tilbage | 2 | efter valg V5 |
| 55 | **Docking-knapperne** i hver zone | ＋ åbn fane, ⤢ Stor, ⛶ Fuld skærm, ⋯ del og luk, × på faner | 4 pr. zone | ⤢ og ⛶ behold; resten efter valg V5 |
| 56 | **Bundbjælken** | Afspil, pause, spol, A/B-sløjfe, lydstyrke, Lyd ind, Projektor | 12 · 2 · 0 | flyttes op i linjen øverst (fase 5) |
| 57 | **Søg (Ctrl+K)** | Find knapper og noder | – | **bliver** |
| 58 | **Niveau 1–4** | Skjuler vinduer og kilder efter niveau | 1 dropdown | fjern (fase 5) |
| 59 | Editorens **Detaljer** | Skjuler egenskaber efter niveau | 1 dropdown | fjern (fase 6) |
| 60 | **Numre på vinduer og bokse** (W6.1 …) | 109 nummer-mærker i filen; 1 kan ses i Overblik | – | fjern (fase 5) |
| 61 | **Enkel tilstand** | Skjuler alt undtagen Live preview; panel med EQ og 5 følsomheds-skydere | 2 · 9 · 1 | fjern (fase 5) |
| 62 | **Mere-menuen** | 5 undermenuer: Opsætning, Show, Vinduer, Lyd og ydelse, Hjælp | 28 · 0 · 7 | ryddes (fase 5) |
| 63 | **Effekter: Fuld · Let · Fra** og den levende baggrund | Baggrunden bag zonerne | 1 | ved ikke |
| 64 | **Udgangsvindue (projektor)**, Sort skærm, Send Scene-fanen til skærm | Billedet på en anden skærm | 4 | behold lille |
| 65 | **Optag video** | Optager Live preview | 1 + dialog | behold lille |
| 66 | **Sikker visning** | Højst tre blink i sekundet | 1 | behold |
| 67 | **Kort over forbindelserne** (Mermaid) | Reglerne som diagram; PNG og SVG; kræver internet første gang | 7 | ved ikke |
| 68 | **Manual, Ordliste, Genveje, Kom i gang** | Hjælp (manualen fylder 306 KB af filen) | 5 + 4 | behold; de gamle "Nyt i"-afsnit kan fjernes |
| 69 | **Indstillinger** | Tema, billeder i sekundet, tolerance, lydtest, fejllog, Nulstil alt | 7 · 1 · 8 | behold |
| 70 | **Flyt effekter** og *Nulstil pos.* | Håndtag i Live preview | 2 | behold |
| 71 | Det grønne ✓ efter et klik (knappernes farver) | Viser, om et klik ændrede noget | – | ved ikke |

### c4 · Grupper af knapper inde i vinduerne

| Nr. | Gruppe | Hvor | Hvad den gør | Mit forslag |
| --- | --- | --- | --- | --- |
| 72 | **Skabelon-figurer**: Diskodronningerne, Morgenstjerne, trommeslager, danser, to piger ved stangen, discokugle, Perfect 1, Perfect 2 | Editoren · Ny figur | Indsætter figurer med regler | behold |
| 73 | **Figur-generator** | Editoren · Ny figur | Mange tilfældige figurer på én gang (antal, lag, farver, frø) | ved ikke |
| 74 | **Adfærd** (12 stk., fx Hop på kick) | Editoren · fanen Adfærd | Ét klik = én regel | ved ikke (matrixen gør det samme) |
| 75 | **Fanen Koblinger** | Editoren | Liste over figurens regler | fjern (fase 6: Vis i matrix) |
| 76 | **Auto-kobl** og ⚡ **Kobl via klik** | Editoren · fanen Lag | Regler på lagets egenskaber | bliver til forslag (fase 4) |
| 77 | En kilde-dropdown ved **hver egenskab** | Editoren · fanen Lag | Vælg lydtræk direkte ved egenskaben (27 dropdowns) | ved ikke |
| 78 | **Levende** (fødes af …) | Editoren · fanen Figur | Hvert anslag føder en kopi | **bliver** |
| 79 | **Multi-styring** (pucken), A og B | Radial Mesh | Skru på mange regler på én gang | ved ikke |
| 80 | **Tilfældigt-panelet** (slag, flydende, figur, antal, frø, Fortryd) | Værksted · Lydtræk-guide; Radial Mesh | Tilfældige regler | bliver til forslag (fase 4) |
| 81 | **Ryd hold**, **Tilslut MIDI**, Standard, Fast 2 | Værksted · Lydtræk-guide | Rester fra Mapping | flyt Tilslut MIDI; resten ved ikke |
| 82 | **Lav show**: Rolig, Balanceret, Vild, Fortryd | Mere; Show | Show ud fra sangen | bliver til forslag (fase 4) |
| 83 | **Sektionernes vægte** og **Figurernes optræden** (43 felter) | Show | Afsnits-dynamik: hvad hvert afsnit skruer op og ned for | ved ikke |
| 84 | **De 34 færdige opsætninger** i 11 grupper | Opsætninger, Idé-galleri | Standard, Lavet af AI, Program auto, Fuld, Tilfældig, Fest, Figur-shows, Hændelser, Efter musikken, Spil selv, Lær | ved ikke: hvilke bruger du? |
| 85 | **Mine opsætninger** (20 pladser), Gem som 1/2, Hent 1/2, Sammenlign 1 ↔ 2 | Opsætninger | Egne opsætninger | behold |
| 86 | **Random alt: skift automatisk** | Opsætninger, Mere | Ny tilfældig opsætning hvert 10.–60. sekund | ved ikke |
| 87 | **4 spor (stems)** | Lydkilde | 4 filer som én sang | behold |
| 88 | **Generator-kortet** (genre, tempo, tæthed, Nyt mønster, Muter) og **Lydmotor: Ny · Klassisk** | Lydkilde | Musik uden fil | ved ikke: skal Klassisk blive? |
| 89 | **Lyd ind** (mikrofon eller fanelyd) | Lydkilde, bundbjælken, sidebjælken | Lyd udefra | behold lille |
| 90 | **Auto-mapping: Til/Fra** | Lydkilde | At B2 kører selv ved ny sang | fjern (fase 4) |
| 91 | **Kvalitetsniveauer** (Disco, Undervisning, Spar, Fuld, Egen), regulator og **måletest** | Kvalitet | Ydelse | behold lille |
| 92 | **Tast B**, MIDI-tangent og pad-cirkel som kilder | kilde-listerne | Spil selv | ved ikke |
| 93 | **Mesh 3D · Lys-panelet** og **Øjet · Lys-panelet** | Mesh 3D, Øjet | Farver, lys, drop, gemte lys | **bliver** |
| 94 | **Fest** (én knap, så alt kommer i gang) | Opsætninger | Starter generator og en fuld opsætning | ved ikke |

---

## d · Rester

Død kode og indstillinger fra ældre vinduessystemer. Intet af det kan ses, medmindre der står andet.

### d1 · Elementer, der ligger skjult i siden (målt)

| Rest | Fra | Hvad der ligger |
| --- | --- | --- |
| Knapperne **↔ Bredt skrivebord** og **▦ Zoner** i topbaren | v8.5 og v8.7 | findes i siden, skjult |
| `#snapmenu` | frie vinduer | 10 knapper (Venstre halvdel, Højre halvdel …), vises aldrig |
| `#dockL` og `#dockR` | mini-vinduer i siderne (v7.0) | `dockR` gemmer i dag de 10 vinduer, der ikke står i en zone (93 knapper, 22 skydere) |
| De 4 beholdere W23, W25, W26, W27 | samlinger (v6.8) og Scene-vinduet (v5.8) | 28 knapper i alt; vises aldrig |
| Knapperne ▦, + og *Maksimér* i hvert vindues overskrift | frie vinduer | findes i hvert af de 28 vinduer |
| I Mere-menuen (kan ses): **Ordn vinduer**, **Minimér alle vinduer**, **Enkel tilstand**, *Brug igen*, *Gem layout*, *Slet layout* | frie vinduer og Mine layouts | virker delvist eller ikke med docking; ikke prøvet |

### d2 · Indstillinger (læst)

| Indstilling | Brugt antal steder | Status |
| --- | --- | --- |
| `set.zoner` | 19 | altid sand med docking |
| `set.bredt` | 8 | bruges ikke med docking |
| `set.lay3` | 22 | bruges stadig: navnet på det valgte layout |
| `set.enkel` | 8 | Enkel tilstand; styrer også, om Følsomhed ganges på styrken |
| `set.snap` | 13 | findes ikke som gemt værdi; koden står tilbage |
| `set.scene` og `set.fg` | 36 og 33 | de gamle faner i Scene og samlingerne; docking læser dem stadig |
| `set.r2sort` | 1 | rest fra Router 2.0 (læses af `r2Orden`) |
| `set.rtLay` og `set.rtKraft` | 26 og 7 | bruges af de 10 visninger |
| `zoom.heltUdeUnder` i temaet | – | lysene under 20 % er slået fra i v9.38; reglen står stadig i temaet |

### d3 · Kode (læst)

| Rest | Størrelse | Hvorfor den er død eller halvdød |
| --- | --- | --- |
| Tegningen af det slettede Mapping-vindue i `renderMaps` og dens tre tilføjelser (v9.12, v9.13, v9.15) | 15 opslag af `$('maps')` | Vinduet er slettet i v9.35. Planen fjerner den i fase 1 |
| Knap-lyttere til Mapping: `$('add')`, `$('minall')`, slet og fold en række (linje 3946–3949), `syncRow`, `stakTik` (leder efter W12) | – | Knapperne findes ikke |
| To tidsstyrede løkker (hvert 0,5 s), der leder efter Mappings rækker (`.tk-rad`, `.st-rad`) | – | Rækkerne findes ikke |
| `knapTilstand` leder efter `dubbtn` og `rtbtn` | – | Knapperne er slettet |
| Blokken *VINDUER: snap, aktivt vindue, layouts …* | 15,6 KB | Snap og frie vinduer bruges ikke; layout-delen bruges |
| Blokken *v8.7: ZONE-TILSTAND* | 6,8 KB | Docking erstatter `zonerAnvend`, `zonerLayout`, `zonerSaet` og `zonPop`; de gamle udgaver er døde |
| Blokkene *v6.8: SAMLINGER*, *v5.8: SCENE-VINDUET*, *v8.3: ARBEJDSFLADE*, *v6.7: AKTIVT VINDUE*, *v8.5: LÅS VINDUER OG STORT SKRIVEBORD* | 5,6 + 6,3 + 6,0 + 1,3 + 2,4 KB | Docking erstatter 15 af deres funktioner (fx `scVaelg`, `fgVaelg`, `sbAabn`); resten skal ses efter én for én |
| Blokkene med numre og niveauer: *NUMRE PÅ VINDUER OG BOKSE*, *v4.0: NUMRE PÅ KNAPPER*, *v5.3: ÉT NIVEAU*, *v5.1: NIVEAUER I FORM-EDITOREN* | 3,7 + 4,6 + 3,0 + 4,5 KB | Lever, men fjernes i fase 5 og 6 |
| Lysene under 20 % zoom (`ne13Lod` og dens CSS) | – | Slået fra i v9.38 |
| *v9.35: REST AF DUBLET* | 1,0 KB | To tabeller (`DUB_KASSE`, `DUB_KORT`), som visningerne bruger |
| Fire funktioner, der aldrig kaldes | – | `r2Hue`, `lsBred`, `neVisNodeEfterByg`, `rtVis` (4 af 1.032 funktioner) |
| Tekst, der peger på slettede vinduer | – | I kodens tekster: *Mapping* 27 steder, *Dublet* 18, *Router* 6, *Routing-overblik* 4. På skærmen med Pigernes show: *Mapping* 21 gange ("Nr. 1 i Mapping" på hver regel), *Dublet* 2 |
| Udvikler-tekst på skærmen | – | "Alle 16 trin er bygget (v9.19–v9.34)", "106 af 114 lavet", "three.js r186 ved siden af r128", "Node-editoren · docking og fuld skærm" |

Kun 4 funktioner er helt døde, fordi de gamle systemer er bygget oven på hinanden: hver ny version har pakket de gamle funktioner ind i stedet for at erstatte dem. Derfor kan de gamle blokke ikke bare slettes; de skal tages én ad gangen med testpakken efter hver.

---

## e · Udgangspunkt

Tallene, som de kommende trin skal måles imod.

### e1 · Kontroller i filen (målt; ens i alle tre størrelser)

| Hvad | I filen | Kan ses fra start (Overblik, 2560 × 1440) |
| --- | --- | --- |
| Knapper | **859** | 118 |
| Skydere | **112** | 5 |
| Dropdowns | **98** | 20 |
| Afkrydsningsfelter | 49 | – |
| Tekst- og talfelter | 59 | – |
| Vinduer | **28** (24 rigtige og 4 beholdere) | 3 zoner med 15 faner |
| Nummer-mærker (W6.1 …) | 109 | 1 |
| Færdige opsætninger | 34 | – |
| Layouts | 6 | – |
| Visninger i Node-editoren | 11 | – |
| Lydtræk (kilder) | 116 | – |
| Mål i Pigernes show | 224 | – |

De fem vinduer med flest kontroller: Generator (fuld) 315 knapper, Editor 87 knapper og 34 skydere og 27 dropdowns, Node-editor 40, Opsætninger 39, Radial Mesh 22.

### e2 · Filens størrelse (læst)

| Del | Størrelse | Andel |
| --- | --- | --- |
| Hele filen | **6,21 MB** (6.213.041 bytes) | 100 % |
| Den nye three.js (r186), kun til linjerne i Node-editoren | 3,75 MB | 60 % |
| Den gamle three.js (r128), til Mesh 3D og Øjet | 0,63 MB | 10 % |
| Programmets egen kode (JavaScript) | 1,22 MB | 20 % |
| Resten: HTML, CSS, manualen (0,31 MB) og skrifttyper (0,13 MB) | 0,62 MB | 10 % |

Blokke i hovedscriptet ifølge indholdsfortegnelsen: 110. Funktioner i egen kode: 1.032.

### e3 · Skærmstørrelser (målt)

| Størrelse | Starter uden fejl | Zoom i Node-editoren i Overblik | Kan teksten læses? (mit skøn) |
| --- | --- | --- | --- |
| 1920 × 1080 | ja | 28 % | nej |
| 2560 × 1440 | ja | 39 % | nej (skriften er cirka 5 punkter høj) |
| 3840 × 2160 | ja | 61 % | ja, lille |

Zoomen følger vinduets bredde, fordi *Tilpas* viser alle 9 kolonner. Det er det modsatte af planens afsnit 1.1 (mindste størrelser, og flere rækker på en større skærm).

---

## f · Planens tal, tjekket

Afsnit 2 i planen. **Passer** betyder, at jeg får det samme tal.

| Afsnit | Planens tal | Mit tal | Passer? |
| --- | --- | --- | --- |
| 2.1 | Starter uden fejl, 6 layouts | Ja, i alle tre størrelser | passer |
| 2.1 | "10 forudindstillinger" | Der findes **34**. Testpakken kører alle 34 uden fejl | **passer ikke** (gennemgangen prøvede nok 10 af dem) |
| 2.2 | Cirka 60 steder ændrer `maps` | **69 fundet, 65 rigtige** (se a1), plus 59 skrivninger til felter | lidt flere |
| 2.2 | 64 kald af `renderMaps()` | 64 | passer |
| 2.2 | Tre tilføjelser oven på `renderMaps` | 3 (v9.12, v9.13, v9.15) | passer |
| 2.2 | En regel har intet id | Rigtigt | passer |
| 2.2 | Data fire steder | Rigtigt; Samlet styrke og Normalisering er et femte (se a4) | passer, med en tilføjelse |
| 2.2 | Styrken ganges i mindst 6 led | 6: trim × regel × figur eller gruppe × samlet × følsomhed × afsnits-dynamik. Følsomhed tæller kun i Enkel tilstand | passer |
| 2.3 | Auto om mindst 15 ting | 36 ting (afsnit b): 19 skriver regler, 6 vælger en måling, 11 er visning og ydelse | passer ("mindst") |
| 2.3 | Auto-mapping kører selv tre steder, er Fra ved start | Rigtigt: lydfil, generator, 4 spor | passer |
| 2.3 | Fem forskellige Fortryd | **6**: lyset i Mesh 3D og lyset i Øjet har hver sin | **passer ikke helt** |
| 2.4 | Pigernes show: 37 regler, 14 lydtræk, 28 mål, 97 noder | 37, 14, 28, 97 | passer |
| 2.4 | Lærredet 3.689 px højt ved 63 % | 3.691 px ved 62,6 % | passer |
| 2.4 | Man ser 6 af 37 regler | **5** hele regler (layoutet Noder, efter Tilpas) | næsten |
| 2.4 | Alle regel-noder har samme titel | 35 × "Regel · Egenskab" og 2 × "Regel · Handling" | passer |
| 2.4 | Zoom 39 % i Overblik | 39 % ved 2560 × 1440 (28 % ved 1920, 61 % ved 3840) | passer |
| 2.4 | Kontrolpanelet ligger **oven på** lærredet og dækker de nederste noder | **Det ligger under lærredet, ikke ovenpå.** Men det tager pladsen: med en regel valgt er panelet 213 px højt, og lærredet bliver tilsvarende lavere | **passer ikke** (virkningen er den samme: man ser færre noder) |
| 2.4 | Tekst om slettede vinduer | Fundet alle tre: "Nr. 1 i Mapping", "effekt-gruppe fra Dublet", "ændres her, i Mapping og i Router" | passer |
| 2.4 | Udvikler-tekst | Fundet alle tre, og en fjerde: "Node-editoren · docking og fuld skærm" i værktøjslinjen | passer |
| 2.4 | Den gamle Matrix viser kun mål med en regel og kan ikke lave regler | Rigtigt: 14 lydtræk × 28 mål; blokken har ingen kode, der lægger en regel til | passer |
| 2.4 | To udseender på samme skærm | Rigtigt; også inde i visningerne (søgefeltet er lyst) | passer |
| 2.5 | Fem veje til samme vindue | 6: også Mere-menuen | passer ("fem" er for lavt) |
| 2.5 | To titler | Rigtigt for Live preview (fanen og vinduets egen bjælke) og Node-editor (fanen og "NODE-EDITOR" i linjen) | passer |
| 2.5 | Rester: Zoner, Bredt skrivebord, Ordn vinduer, Minimér alle, Enkel tilstand | Ordn vinduer, Minimér alle og Enkel tilstand **kan ses** i Mere. Zoner og Bredt skrivebord ligger **skjult** | delvist |
| 2.5 | Niveau og Detaljer findes begge; W6.1 på skærmen | Rigtigt | passer |
| 2.5 | 859 knapper, 112 skydere, 98 dropdowns, 28 vinduer | 859, 112, 98, 28 | passer |
| 2.5 | v9.17 havde 862 knapper og 31 vinduer | Ikke tjekket (kræver den gamle fil) | – |
| 2.6 | Editoren får 1077 × 1250 px i Figurer; billedet er en smal stribe | 1077 × 1250; billedet er 409 × 1250 | passer |
| 2.6 | Teksten "Scenen · træk prikken" er skåret af | Ikke tjekket | – |
| 2.7 | 6,2 MB; r186 3,7 MB (60 %); r128 0,6 MB; egen kode cirka 1,2 MB i 110 blokke | 6,21 · 3,75 (60 %) · 0,63 · 1,22 · 110 | passer |
| 2.8 | 116 lydtræk, 224 mål, 81 egenskaber på en danser | 116, 224, 81 | passer |
| 2.8 | 9 af 26 figur-regler er ens på de to piger | 9 af 26 | passer |

**Det, planen ikke har med:**

1. **Morph Pad erstatter regel-listen løbende** (B17). Den skal med i fase 1 og 4, ellers skriver den uden om den fælles indgang.
2. **Udfyldning af klods-spor** (B14) lægger regler til af sig selv, når en opsætning hentes. Det er netop "skriver regler uden at spørge".
3. **Random alt: skift automatisk** (B10) og **Multi-styring** (B18) mangler i fase 4.
4. **Ctrl+Z gemmer hele listen** (`feGendan`). Et id pr. regel og `ret(id, felter)` skal passe sammen med den måde, ellers mister en regel sit id ved Fortryd.
5. **13 af de 28 vinduer** står ikke i nogen zone fra start: de 4 beholdere og 9 rigtige vinduer. 7 af de 9 er ikke med i noget layout (Kvalitet, Bane og klods, Show, Lydtræk-guide, Audit, Detektion, Preset) og åbnes kun med ＋, Mere eller Ctrl+K.
6. Planen kalder papiret **P7.7**. I repoet ligger `NODE-EDITOREN.md` som **P7.6**. Se spørgsmål 1.

---

## g · Testpakken på v9.42

Kørt 13. november 2026 med `node tests/koer-alle.js claude-mv-v9_42.html`. Den tog cirka 20 minutter.

**Resultat: alle 36 testfiler bestod. 411 tjek, 0 fejl.** (Filerne har numrene 1–37; nummer 7 blev slettet i v9.35.)

**Lydmotor 2 (test 4) bestod hos mig: 15 ok, 0 fejl.** Den stoppede altså ikke på skærmbilledet her. Målingen: Lydmotor 2 har peak 0,82–0,86 i alle 7 genrer (ingen klip); Klassisk klipper stadig (peak 1,12–1,70), som det står i CLAUDE.md.

| Rækkefølge | Test | Resultat |
| --- | --- | --- |
| 1 | Syntaks | 5 ok, 0 fejl |
| 2 | Indhold | 7 ok, 0 fejl |
| 3 | Browser | 21 ok, 0 fejl |
| 4 | Lydmotor 2 | 15 ok, 0 fejl |
| 5 | Router 2.0-motoren | 6 ok, 0 fejl |
| 6 | Spærretid for alle slag | 11 ok, 0 fejl |
| 7 | Lydkort fjernet | 15 ok, 0 fejl |
| 8 | Kilder og stereo | 20 ok, 0 fejl |
| 9 | Stereobredde | 12 ok, 0 fejl |
| 10 | 4 spor | 19 ok, 0 fejl |
| 11 | Gamle indstillinger | 7 ok, 0 fejl |
| 12 | Rul i Arbejdsfeltet | 8 ok, 0 fejl |
| 13 | Node-editor (trin 1) | 32 ok, 0 fejl |
| 14 | Node-editor (trin 2) | 16 ok, 0 fejl |
| 15 | Node-editor (trin 3) | 20 ok, 0 fejl |
| 16 | Node-editor (trin 4) | 13 ok, 0 fejl |
| 17 | Node-editor (trin 5) | 16 ok, 0 fejl |
| 18 | Node-editor (trin 6) | 15 ok, 0 fejl |
| 19 | Node-editor (trin 7) | 9 ok, 0 fejl |
| 20 | Node-editor (trin 8) | 5 ok, 0 fejl |
| 21 | Node-editor (trin 9) | 7 ok, 0 fejl |
| 22 | Node-editor (trin 10) | 7 ok, 0 fejl |
| 23 | Node-editor (trin 11) | 8 ok, 0 fejl |
| 24 | Node-editor (trin 12) | 13 ok, 0 fejl |
| 25 | Node-editor (trin 13) | 8 ok, 0 fejl |
| 26 | Node-editor (trin 14) | 10 ok, 0 fejl |
| 27 | Node-editor (trin 15) | 7 ok, 0 fejl |
| 28 | Node-editor (trin 16) | 9 ok, 0 fejl |
| 29 | Gamle vinduer slettet | 9 ok, 0 fejl |
| 30 | Docking | 13 ok, 0 fejl |
| 31 | Træk uden markering | 4 ok, 0 fejl |
| 32 | Altid skarpt | 11 ok, 0 fejl |
| 33 | Knapper i Node-editoren | 11 ok, 0 fejl |
| 34 | Oprydning | 5 ok, 0 fejl |
| 35 | Visninger | 9 ok, 0 fejl |
| 36 | D2 og håndtag | 8 ok, 0 fejl |

Testpakken prøver programmet ved 1600 × 1000 og 2560 × 1440. Den prøver **ikke** 1920 × 1080 og 3840 × 2160; dem har jeg kun startet programmet i (afsnit e3). Fra fase 1 skal de tre størrelser fra planens afsnit 1.1 ind i testpakken.

---

## h · P7.7 punkt 3

| Del | Bygget? |
| --- | --- |
| a) Fortryd for resten (trim, effekt-gruppernes styrke, øje, Slå fra, Normalisering, Samlet styrke) | **Nej** |
| b) Et fast id på hver regel | **Nej** |

Det står også i `STATUS.md`. Jeg bygger det ikke, før du skriver "kør".

---

## Ikke testet

- Alt er målt i en testbrowser uden grafikkort. Hastighed, WebGPU og den rigtige 43" skærm er ikke prøvet.
- Programmet er kun prøvet med testsangen (30 sekunder, 120 BPM), ikke med rigtig musik.
- Knapperne i d1 (Ordn vinduer, Minimér alle, Enkel tilstand, Mine layouts) er ikke prøvet med docking.
- Tallene mærket **læst** er talt med scripts. Linjenumrene passer til `claude-mv-v9_42.html`; de flytter sig i næste version.
