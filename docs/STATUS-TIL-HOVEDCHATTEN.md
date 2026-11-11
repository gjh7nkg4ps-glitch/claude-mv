# Status til hovedchatten · Node-editoren · v9.19–v9.42

*11. november 2026 · fra Claude Code · papir: `NODE-EDITOREN.md` (P7.6) · plan: `docs/PLAN-NODE-EDITOREN.md`*

**Vigtigt om versionsnumrene:** den nyeste version i repoet er **v9.42** (`claude-mv-v9_42.html`). Laver hovedchatten en ny version, skal den bygge videre på den fil og hedde **v9.43** eller højere. **v10.0** er ikke brugt; brugeren har ikke sagt til.

---

## 1 · Det, der er bygget (én linje pr. version)

| Version | Hvad |
| --- | --- |
| v9.19 | Trin 1: fanen Node-editor med de 9 kolonner, zoom, træk og Tilpas, kontrolpanelet, layoutet Noder, temaet Warm Analog og de tre skrifttyper i filen |
| v9.20 | Trin 2: reglerne vises som noder (Lydtræk → Regel → Figur → Mål) med levende tal og linjer; klik viser sætningen; noder kan flyttes |
| v9.21 | Trin 3: Lydkilde (lydfil, 4 spor, Lyd ind, generator), MIDI, Morph Pad, Tastatur, FFT hurtig og fin og de 9 analyser med alle 94 udgange |
| v9.22 | Trin 4: ret en regel på noden og i kontrolpanelet (hele kæden, Gate, Auto-valg, Styrke brugt); Fortryd; Normalisering og Samlet styrke |
| v9.23 | Trin 5: lav regler ved at trække links (Tilføj-listen, menuen med figurens mål); Slå fra/til og Slet |
| v9.24 | Trin 6: + Tilføj i kolonnerne og Ctrl+K med "Tilføj node" og "Knapper"; løse noder |
| v9.25 | Trin 7: Ikke i brug (parkér): det, der hænger under, sover |
| v9.26 | Trin 8: flere regler på ét mål: Største, Læg sammen, Gang |
| v9.27 | Trin 9: trim på lydtræk og styrke på figurer og effekt-grupper |
| v9.28 | Trin 10: Lær og Adaptiv tærskels indstillinger |
| v9.29 | Trin 11: skabeloner (6 faste og egne) |
| v9.30 | Trin 12: scene-noder med levende billede og Sluk; øje og Slå fra på figurer og effekt-grupper; Baggrund ▾ |
| v9.31 | Trin 13: lys under 20 % zoom, Kun valgt kæde, Dæmp og tastaturet |
| v9.32 | Trin 14: linjer og glød i TSL med den nye three.js ved siden af r128 (WebGPU, ellers WebGL2, ellers Canvas 2D) |
| v9.33 | Trin 15: papirets nye navne i hele programmet og "· gammel" på de fire gamle vinduer |
| v9.34 | Trin 16: funktionsliste-tjekket (tabel og test); 85 af 114 lavet |
| v9.35 | De fire gamle vinduer er slettet (Mapping, Router 2.0, Dublet, Routing-overblik), brugerens beslutning; det unikke er flyttet til Opsætninger og Værksted |
| v9.36 | Docking (vinduessystem C, brugerens valg): zoner med faner, træk mellem zoner, ⤢ Stor og ⛶ Fuld skærm |
| v9.37 | Rettet: noderne kunne ikke trækkes, når der var markeret tekst |
| v9.38 | Altid skarpt: Live preview og Øjet i fuld opløsning; noderne bliver ikke længere til lys; roligere drejeknapper |
| v9.39 | Knapperne fra Lydkilde, Opsætninger og Værksted i Node-editorens kontrolpanel og Ctrl+K; rettet WebGPU-fejl ved skjult fane; 98 af 114 |
| v9.40 | Oprydning: Router-boksens kode og tegneløkke og de frie vinduers rester er fjernet |
| v9.41 | De 10 visninger fra Routing-overblik er tilbage i Node-editoren (Visning ▾); 103 af 114 |
| v9.42 | D2-sortering på lærredet med mappe-overskrifter og håndtag i Live previews billede; **alle 106 funktioner, der skal være i Node-editoren, er lavet** (8 er ikke nødvendige) |

## 2 · Det, der mangler fra planen

**Ingenting fra trinene.** Alle 16 trin i `docs/PLAN-NODE-EDITOREN.md` er lavet, og funktionslisten (`docs/node-editoren/FUNKTIONSLISTE-TJEK.md`) har 106 lavet, 0 delvis og 0 mangler.

To ting fra planens faste regler (afsnit C) er ikke lavet, som planen skrev dem:

| Planens regel | Hvad der skete |
| --- | --- |
| Hver regel får et fast id | Ikke lavet. En regels plads på lærredet huskes ud fra *kilde, mål og nummer*. Flytter en regel kilde eller mål i Node-editoren, flyttes pladsen med. Det har været nok indtil nu |
| Node-editoren bruger Form-editorens Fortryd | Lavet for regler og figurer. **Ikke** for trim, effekt-gruppernes styrke, øje og Slå fra, Normalisering og Samlet styrke |

Planens afsnit E (ikke med i planen) gælder stadig: rigtig EQ som node, Lær ved at trykke i takt, flere lydkilder på én gang, flere scener ved siden af hinanden og Mesh 3D og Øjet på den nye three.js (valg B).

## 3 · Hvor vi har afveget fra papiret (P7.6), og hvorfor

| Papiret siger | Det er bygget sådan | Hvorfor |
| --- | --- | --- |
| §10 og svar A6: de gamle vinduer fjernes i **v10.0** | Fjernet i **v9.35** | Brugeren bad om det 8. november ("slet de gamle windows"), men sagde ikke v10.0. CLAUDE.md siger, at v10.0 venter, til brugeren siger til |
| §8: Routing-overblik fjernes først, når alle 11 visninger findes i Node-editoren | Fjernet i v9.35, før visningerne fandtes; de kom tilbage i v9.41 | Brugeren besluttede at slette alle fire vinduer på én gang (papiret tillader det: "eller når brugeren beslutter, at nogle kan vente") |
| §1 regel 3, §4.4 og §6 nr. 4: under 20 % zoom bliver noderne til **lys uden tekst** | Bygget i v9.31, **slået fra i v9.38**; noderne står som kasser ved al zoom | Brugerens ønske: "boksene må ikke blive til lys, men skal stå skarpt i zoom hele vejen" |
| §3: "+ Tilføj" sidder **under** hver kolonne | Sidder i kolonnens **overskrift** | Så den altid kan ses; under kolonnen forsvinder den, når kolonnen er lang |
| §3: værktøjslinjen har et søgefelt "Søg eller tilføj … Ctrl+K" | Intet søgefelt i linjen; **Ctrl+K** åbner programmets fælles søgeliste med Node-editorens grupper | Programmet havde allerede Søg (Ctrl+K) fra v9.16; ét sted at søge |
| §3: værktøjslinjen | Har også **Visning ▾** (v9.41), Placér og Tilpas | Visning ▾ kom med de 10 visninger; Placér og Tilpas var nødvendige for at finde rundt |
| §4.6: kontrolpanelet nederst i hele bredden | Stadig i hele bredden, men **højst 46 %** af Node-editoren, og det ruller | Med knapperne fra v9.39 skubbede panelet noderne helt væk ved 1600 × 1000 |
| §5.6: **Handling / Egenskab** er to slags regler | Valget ændrer kun visningen (`m.slags`); motoren regner ens | Motoren skulle være uændret for gamle opsætninger |
| §5.6: Adaptiv tærskel har to indstillinger **i reglens kontrolpanel** | De står i kontrolpanelet, men gælder **alle regler** | Adaptiv tærskel er én fælles indstilling i motoren (den samme som i EQ-vinduet) |
| §3 og §5.9: Baggrund ▾ viser "Dublet-scenen" | Hedder **Live preview** | Dublet er slettet; billedet var altid Live previews |
| §5.9: scenen åbnes stort ved klik | Klik åbner scenen med **⤢ Stor** i docking | Docking (v9.36) erstattede de frie vinduer |
| §4.4: situationen "langt ude" | Findes ikke længere (se lys ovenfor) | Samme grund som lysene |
| §7: skrifttypen Orbitron til overskrifter | Orbitron har ikke Ø, ø og ·; de tegn vises med IBM Plex Sans | Skrifttypen mangler tegnene |
| Ikke i papiret: Dæmp | Bygget som "det, der ikke slår til lige nu, bliver svagt" | Papiret nævner Dæmp i værktøjslinjen, men forklarer den ikke |
| Ikke i papiret | **Docking** (v9.36), **knapperne fra de andre vinduer** (v9.39), **de 10 visninger** (v9.41), **D2 på lærredet** og **håndtag i billedet** (v9.42) | Brugerens valg; de sidste tre fra funktionslisten, så intet fra de slettede vinduer forsvandt |

## 4 · Det, der ikke er testet

- WebGPU (testbrowseren har intet grafikkort; linjerne testes med WebGL2).
- Den rigtige 43" skærm (docking og skarphed er testet ved 1600 × 1000 og 2560 × 1440 med skalering 1,5).
- Tilslut MIDI og Lyd ind med et rigtigt keyboard og en rigtig mikrofon.
- Skabelonerne og Lydmotor 2 er ikke prøvet på musik af et menneske.
