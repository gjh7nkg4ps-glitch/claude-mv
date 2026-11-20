# PLAN · TEKNIK OG VEDLIGEHOLDELSE (kun det, der ikke er bygget)

*Oprettet 20. november 2026 efter brugerens "til planen" (en vurdering fra Grok). Intet herfra er bygget. Brugeren vælger rækkefølgen; "kør" betyder byg.*

## Fakta (målt i v9.121)

| Del af filen | Størrelse | Hvem har skrevet den |
| --- | --- | --- |
| three.js r128 og glød-værktøjer (Mesh 3D, Øjet) | 0,63 MB | three.js (MIT) |
| three.js 0.186 core og WebGPU (Node-editorens linjer) | 3,74 MB | three.js (MIT) |
| Vores hovedscript (144 blokke, 7 419 lange linjer) | 1,32 MB | os |
| Rytme-motoren (`rytme-runtime`) | 0,15 MB | os |
| CSS (heraf indlejrede skrifttyper 0,14 MB) | 0,28 MB | os |
| HTML, manual og temaet | cirka 0,4 MB | os |
| **I alt** | **6,58 MB** (to tredjedele er three.js) | |

- **Lag på lag:** 130 steder pakker en senere blok en tidligere funktion ind (`{const gl=f;window.f=function(){…gl()…}}`), og 135 steder skrives en funktion om. Det er den måde, vi har rettet på (CLAUDE.md afsnit 2: små præcise erstatninger, gamle funktioner pakkes ind). Hvert skridt er sikkert, men koden får mange lag, og man skal læse flere blokke for at forstå én funktion.
- **Groks "2 `debugger`-linjer" og "56 TODO'er" står alle i three.js**, ikke i vores kode: det ene "debugger" er et ord i bibliotekets liste over reserverede ord, det andet en kommentar; TODO'erne er bibliotekets egne noter (2 i r128, 54 i 0.186). Vores egen kode har 0 `debugger` og 0 TODO. De skal ikke fjernes; three.js skiftes i stedet ud som helhed (valg B under three.js i CLAUDE.md § 4).
- **Det, der beskytter programmet i dag:** 101 automatiske test (kører på cirka 2 timer), git-historikken med én fil pr. version (hver version kan hentes tilbage), og *Gem hele arbejdet* (én fil på computeren).
- **Det, der allerede er moderne:** Node-editorens linjer er et rigtigt modul (`ne14-modul`, three.js 0.186 med TSL og WebGPU/WebGL2); analysen kører i baggrunds-tråde; alle regler går gennem ét sted (`Regler` med `lyt`).

## Idéerne (brugerens liste 20. november) med Codes vurdering

| Nr. | Idé | Codes vurdering | Størrelse |
| --- | --- | --- | --- |
| **T1** | **Autosikring:** en kopi af alt (alle `rytme-*`) hver dag i IndexedDB, de seneste 7 dage, og knappen *Gå tilbage til i går* (eller en anden dag) i Opsætninger, med en tydelig forklaring og Fortryd | **Anbefalet først**: lille, og den beskytter dit arbejde mod en fejl eller et forkert klik | 1 version |
| ~~T0~~ | **Bygget 20. november (uden ny version):** `src/` med 132 kildefiler (101 blokke i `kode/hoved/`), `src/byg.js` og `src/LÆSMIG.md`; bygger v9.121 byte for byte; test 102 | – | – |
| T0b | Byggeværktøj (esbuild eller Vite) | Først ved T6 (rigtige moduler med `import`); til T0 er et lille Node-script nok, uden nye værktøjer og uden internet | – |
| T2 | **Ryd op:** den døde kode (listen i CLAUDE.md § 4: Generator (fuld), Lydlag, `OPS_TEST`, `nivAnvend`, side- og bundbjælken, gamle layouts) og saml indpakningerne i ét område ad gangen | Efter T0, løbende, med testene som kontrol | løbende |
| T3 | **Central tilstand med lyttere** (fagudtryk: observer-mønster eller event-bus): `Regler` virker allerede sådan for reglerne; næste skridt er indstillingerne (`set`) | Efter T0, løbende | løbende |
| T4 | **SVG-ikoner** i stedet for emoji (ens på alle maskiner) | Lille; kan tages når som helst | 1 version |
| T5 | **Tung 2D-tegning til WebGL/WebGPU** (Live preview, Radial Mesh) og de tunge tegne-løkker isoleret, som Node-editorens linjer allerede er | Når der er et målt problem med farten; ellers senere | stort |
| T6 | **Moderne modulær struktur** (ES-moduler, esbuild) | Lang sigt: trin for trin efter T0–T3, aldrig alt på én gang | stort |
| – | "Fjern 2 `debugger` og gennemgå 56 TODO'er" | **Udgår**: de står i three.js (se Fakta) | – |

## Codes forslag til rækkefølge (brugeren vælger)

T1 autosikring → T0 del op (samme fil byte for byte) → resten af A3 → T2 og T3 hen ad vejen, ét område ad gangen → T4 → T5 og T6 senere. Analysen og brugerfladen kan bygges videre imens; ingen af trinene kræver, at programmet står stille.
