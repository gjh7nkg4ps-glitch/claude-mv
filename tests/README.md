# Testpakken · Claude MV

Kort udgave (P8.23): én linje pr. test. Den fulde beskrivelse af hver test ligger i `docs/arkiv/tests-README-fuld-v9_107.md`.

## Sådan kører du dem

```bash
node tests/koer-alle.js
```

En bestemt fil: `node tests/koer-alle.js claude-mv-v9_107.html`. Én test: `node tests/92-gitter.js claude-mv-v9_107.html`. Testene bruger Node og Playwright (testbrowser uden grafikkort); test 11 bruger Python med numpy. Hele pakken tager cirka 2 timer; kør aldrig to kørsler samtidig (hukommelsen løber tør). Hver version får sin egen test (trin 4), som bliver i pakken.

## Testene (110)

| Fil | Trin | Hvad |
| --- | --- | --- |
| `1-syntaks.js` | 1 · Syntaks | `node --check` på hvert `<script>` i filen |
| `2-indhold.js` | 2 · Indhold | versionen er ens i filnavn, `<title>`, versionsmærke og manual (*Nyt i v…* og `man-vXY`) … |
| `3-browser.js` | 3 · Opstart | ingen `pageerror` og ingen konsolfejl … |
| `4-lydmotor.js` | 4 · Det nye i v9.8 | Lydmotor 2: alle 7 genrer med Ny og Klassisk uden at spille (ingen klip, ikke stille, forskellige) … |
| `5-router.js` | 4 · Det nye i v9.9 | Router 2.0-motoren (vinduet er slettet i v9.35) … |
| `6-spaerretid.js` | 4 · Det nye i v9.10 | Spærretid for alle slag … |
| `8-lydkort-fjernet.js` | 4 · Det nye i v9.12 | Lydkort er fjernet: ingen lk:-kilder, intet kort i Lydkilde, ingen knap, ingen funktioner, intet afsnit i manu … |
| `9-kilder-og-stereo.js` | 4 · Det nye i v9.13 | kildelisterne pr. Niveau (smalle bånd foldet sammen under de brede bånd … |
| `10-stereobredde.js` | 4 · Det nye i v9.14 | Stereobredde = 1 minus korrelationen, højst 1 … |
| `11-stems.js` | 4 · Det nye i v9.15 | 4 spor (stems): kortet i Lydkilde, de 4 filer og deres længder, den samlede lyd … (v9.128: udslaget under afspilning er det største over 1 s) |
| `lav-stems.py` | hjælp | laver 4 test-spor med **numpy** (trommer 0–20 s, bas 5–25 s, vokal 10–30 s, resten 15–30 s) … |
| `12-gamle-indstillinger.js` | **fast del** (fra v9.18) | starter programmet med gemte indstillinger fra syv ældre versioner (`gamle-indstillinger/`) … |
| `13-rul-i-arbejdsfelt.js` | 4 · Det nye i v9.18 | alle faner i Arbejdsfeltet ruller, når indholdet er højere end fanen (Niveau 2 og 4) … |
| `30-gamle-vinduer-slettet.js` | 4 · Det nye i v9.35 | De fire gamle vinduer er slettet … |
| `31-docking.js` | 4 · Det nye i v9.36 | Docking ved 2560 × 1440 … |
| `90-spor-paa-en-gang.js` | 4 · Det nye i v9.101 | Vælg 4 filer … og Vælg en mappe … med Ultimate Vocal Removers filnavne (Drums, Bass, Vocals, Instrumental, No … |
| `91-gemning-siger-til.js` | 4 · Det nye i v9.104 | Alle setItem går gennem lsGem … |
| `92-gitter.js` | 4 · Det nye i v9.105 | Gitteret i Node-editoren ved 1920 × 1080 og 2560 × 1440 med Pigernes show … |
| `93-hele-arbejdet.js` | 4 · Det nye i v9.106 | Gem hele arbejdet (rigtigt klik i Opsætninger) … |
| `94-paa-scenen.js` | 4 · Det nye i v9.107 | På scenen ved 1920 × 1080 og 2560 × 1440 med Pigernes show … |
| `95-hylden-effekter.js` | 4 · Det nye i v9.108 | Hylden Effekter: 19 kort, kortet Lys-puls med regel-sæt der passer, Brug lægger reglen på, Ctrl+Z, Skjul på scenen, Lav en kopi, Gem som regel-sæt, valg C hos danseren, klik fra På scenen |
| `110-indstil-og-tjek.js` | 4 · Det nye i v9.130 (P8.33 trin 1) | To faste grupper (12 + 11, ingen fælles, jazz og rock i begge, ét 222 BPM-stykke i hver); den halve takt 1,6 og rampen 0,40 → 0,90; testmappen fra test 99: indstil + tjek = alle i hver række, "tjek N" i cellerne, "Sådan måles" og rapporten; ingen konsolfejl |
| `109-rigtige-trommer-uden-mappen.js` | 4 · Det nye i v9.129 (valg A) | Testmappen fra test 99: uden facit ingen Mål igen; efter mappen er facit gemt (kun tekst, navn og størrelse); efter genindlæsning giver et rigtigt klik på Mål igen de samme tal uden mappe-vælgeren (4 spor med); mangler en analyse i cachen, måles der ikke; Glem facit (spørger); ingen MDB-filer i repoet; ingen konsolfejl |
| `108-rettelser-i-reglerne.js` | 4 · Det nye i v9.127 (A4, anden del) | Med testlyden: slettet kick giver 0 i kurven Kick, flyttet kick er væk det gamle sted og findes det nye, nyt snare giver en top, slettet Takt 1 giver 0 i Takt (første slag); urørte slag er uændrede; Hændelser regnes af de urørte kurver; Analyse sikkerhed giver de samme tal; rigtige klik på Rettelser i reglerne (Fra og Til); Normalisering Fast og Adaptiv beholder rettelserne; ingen konsolfejl |
| `107-lydtidslinjen.js` | 4 · Det nye i v9.126 (A4, første del) | Rækken Hændelser i Lyd over tid med testlyden (kick på de rigtige slag, sikkerhed pr. hændelse); rigtige klik: vælg en streg (hopper ikke), Slet, → (10 ms), træk, dobbeltklik tilføjer, Fortryd rettelse, Nulstil rettelser (spørger); rettelserne i `rytme-tl|` og Gem hele arbejdet; Gem tidslinje (JSON lydtidslinje), Hent tidslinje (samme sang; anden sang afvises); Hør analysen planlægger klik; ingen konsolfejl |
| `106-kraev-sikkerhed.js` | 4 · Det nye i v9.125 (A2) | Skyderen Kræv sikkerhed over Gate (rigtigt klik sætter 80 %, regel-noden får "≥ 80 %"); motoren spærrer ved sikkerhed 0,3 og virker ved 0,9 og regner som før uden grænse; fast sikkerhed fra Analyse sikkerhed, ikke målt spærrer ikke; Takt 1 pr. øjeblik; Foreslå regler hæver tærsklen 0,1; Lyd over tid skraverer Taktslag; ingen konsolfejl |
| `105-taktgitter-4-spor.js` | 4 · Det nye i v9.124 (A3, tredje del) | Rækken Taktgitter med 4 spor under A3 (Trommer-sporet som standard); 4 spor, som testen selv laver, hentes med rigtige klik: taktgitteret kommer fra Trommer-sporet (100 % af slagene ramt), rigtige klik på Hele lyden og Trommer-sporet; Testlyd · 4 spor 78 og 73 uden dine egne spor; cirklen og boblen ved Taktslag; knapperne grå med A3 fra; Rigtige trommer har de to nye rækker; ingen konsolfejl |
| `104-fasens-sikkerhed.js` | 4 · Det nye i v9.123 (A3, anden del) | Rampen fra enighed til sikkerhed; Testlyd: sikkerheden 0,20–0,95 (Drum and bass 0,95, Hip-hop med bas 0,20); med en sang: "i N af M takter peger … på samme takt 1" i rækken og boblen; rigtige klik på Fra og Til; Rigtige trommer (testmappen fra test 99, som nu også giver `lavMappe`): hele mixet med trin 2, rapporten og "Sådan måles", cachen anden gang; ingen konsolfejl |
| `103-autosikring.js` | 4 · Det nye i v9.122 (T1) | Automatiske kopier ved 1920 × 1080: dagens kopi lægges af sig selv; 9 tidligere dage giver højst 7; rækkerne i Opsætninger (i dag, i går …); rigtige klik på Gå tilbage hertil (Annuller ændrer intet; to gange Ja går tilbage til i går og starter forfra); Fortryd via "lige før du gik tilbage"; Tag en kopi nu; ingen konsolfejl |
| `102-byg-fra-kilder.js` | 1 · Kilderne (T0) | `src/dele.txt` er hel; `node src/byg.js --tjek` bygger præcis den testede fil, byte for byte; `.gitattributes` beskytter linjeskiftene. Ingen browser |
| `101-testlyd-lyt-og-gem.js` | 4 · Det nye i v9.119 og v9.121 | Foldet sammen bag den lille knap "Testlyden ▸" (rigtige klik ud og ind, lyden standser); afsnittet "Testlyden: lyt og gem" (6 rækker); rigtige klik på ▶ Lyt og ■ Stop; Gem som WAV: header og fingeraftryk = rapportens (ac579ca0, a375df80); filen kan åbnes som sang; ▶ Lyt sætter sangen på pause |
| `100-bedre-slag-og-takt.js` | 4 · Det nye i v9.117 | A3-rækken i Indstillinger for analysen; Testlyd med A3 til (Kick 92, Taktslag · Trommer 81, Takt · Trommer 76); rigtigt klik på Fra giver præcis tallene fra før; Til igen; med en sang: "Denne sang" og boblen ved Takt 1 |
| `99-rigtige-trommer.js` | 4 · Det nye i v9.116 og v9.120 | Laver selv en lille facit-mappe med MDB-navne og underklasser (SDG, PHH); rækkerne uden svage slag og uden pedal (regnskabet: ramt → neutral, falske ens); rigtigt klik på Vælg facit-mappe; stykker efter navn; tallene hænger sammen; bækken neutralt; cachen; Testlyd røres ikke; rækken foldes ud; rapporten; ingen MDB-filer i repoet (MDB_MAPPE måler den rigtige mappe) |
| `98-spor-hele-analysen.js` | 4 · Det nye i v9.113 | 4 spor: 80 lydtræk pr. spor, siden fryser ikke (ur i siden), navne/type/D2, en regel på Tonehøjde · Vokal i matrixen og Noder; cachen anden gang og efter genstart; Analyse sikkerhed på ét instrument alene; Brug den bedste tærskel (rigtigt klik, Ctrl+Z); rapporten |
| `97-analyse-sikkerhed.js` | 4 · Det nye i v9.110 og v9.115 | Testlydens 17 fingeraftryk er præcis som referencen; gamle tal fra generatoren bliver ikke brugt, men står i historikken med en streg; "Testlyd" ved tallene; samlet tal uden 99; Cirklen i matrixens rækker (plads, farve, boble, rigtigt klik åbner fanen); ▶ Kør testen måler mod generatoren (tallene hænger sammen, gemt med version, intet røres); tabellen, Kun dem i brug, Sortér; 4 spor over 15 minutter giver en besked; tre skærmstørrelser |
| `96-effekt-i-noder-og-matrix.js` | 4 · Det nye i v9.109 | Mål-noden Lys-puls: Slå fra og øje i kontrolpanelet (rigtige klik), klasser og tekst på noden, Ctrl+Z; matrixens overskrift med øje og ⏻ (rigtige klik); Navne: Til skriver effekterne i hjørnet |
| `89-navne-i-live-preview.js` | 4 · Det nye i v9.100 | Ved 1920 × 1080 og 2560 × 1440 med Pigernes show … |
| `88-vaerktoejslinje-passer.js` | 4 · Det nye i v9.99 | Ved tre skærmstørrelser i 3 · Regler (Noder og Matrix) … |
| `87-generator-mere.js` | 4 · Det nye i v9.96 | Ved 1920 × 1080 og 2560 × 1440 … |
| `86-detektion.js` | 4 · Det nye i v9.95 | Ved tre skærmstørrelser … |
| `85-fem-regelsaet.js` | 4 · Det nye i v9.90 | Ved tre skærmstørrelser … |
| `84-vaerktoejslinje.js` | 4 · Det nye i v9.89 | Ved tre skærmstørrelser med Pigernes show (rigtige klik) … |
| `83-figurer-ligestillet.js` | 4 · Det nye i v9.88 | Ved tre skærmstørrelser (rigtige klik) … |
| `82-biblioteket.js` | 4 · Det nye i v9.87 | Ved tre skærmstørrelser med en gammel plads Opsætning 3 … |
| `81-startskaerm.js` | 4 · Det nye i v9.86 | Ved tre skærmstørrelser (startskærmen slås til i testbrowseren med set.startSkTest) … |
| `80-indbygget.js` | 4 · Det nye i v9.85 | Fingeraftryk (hash) af alt indbygget (7 opsætninger uden sang, de 6 regel-skabeloner, DEFAULT, danserens og di … |
| `79-slaa-lydtraek-fra.js` | 4 · Det nye i v9.84 | Ved tre skærmstørrelser … |
| `78-doed-kode.js` | 4 · Det nye i v9.83 | (Fra v9.93: renderAudit er væk … |
| `77-klodsbane.js` | 4 · Det nye i v9.82 | Ved tre skærmstørrelser … |
| `76-oprydning-7a.js` | 4 · Det nye i v9.81 | Ved tre skærmstørrelser … |
| `75-spor-ms.js` | 4 · Det nye i v9.80 | Ved 1920 × 1080 og 2560 × 1440 med de fire test-spor … |
| `74-stereo.js` | 4 · Det nye i v9.79 | Ved tre skærmstørrelser med stereo-testlyden … |
| `73-niveau.js` | 4 · Det nye i v9.78 | Ved tre skærmstørrelser med stereo-testlyden … |
| `72-lyd-over-tid.js` | 4 · Det nye i v9.77 | Ved tre skærmstørrelser med stereo-testlyden … (v9.128: 8 rækker med Hændelser) |
| `71-sang-vinduet.js` | 4 · Det nye i v9.76 | Ved tre skærmstørrelser … |
| `70-vis-i-matrix.js` | 4 · Det nye i v9.75 | (Fra v9.91: pigerne får danserens standardregler direkte i testen, fordi + Ny figur ikke giver regler mere.) V … |
| `69-figurer-og-egenskaber.js` | 4 · Det nye i v9.74 | (Fra v9.91: Morgenstjernen lægges på uden regler, nyt fingeraftryk for addMorgenstjerne.) Ved tre skærmstørrel … |
| `68-nulstil-alt.js` | 4 · Det nye i v9.73 | (Fra v9.91: fanger, at Mine shows i Biblioteket slettes, og at beskeden skjules.) Ved 1920 × 1080 og 2560 × 14 … |
| `67-tema-og-indstillinger.js` | 4 · Det nye i v9.72 | Ved tre skærmstørrelser … |
| `66-en-linje.js` | 4 · Det nye i v9.71 | Ved tre skærmstørrelser … |
| `65-traade.js` | 4 · Det nye i v9.70 (test 3, 15 og 16 venter fra v9.70 på, at trin 2 er færdigt, før de tjekker tempo, toneart og at ingen noder venter) | Trådenes analyse giver præcis de samme tal som den gamle (stereo-testfilen, 14 + 70 rækker) … |
| `64-ydelse.js` | 4 · Det nye i v9.69 | På 6 s afspilning (2× skærmskalering) … |
| `63-analyse-bjaelke.js` | 4 · Det nye i v9.68 | Mens en rigtig lydfil analyseres, står feltet midt øverst med Trin 1 af 2 og Trin 2 af 2, en bjælke og tiden … |
| `62-arbejdsomraader.js` | 4 · Det nye i v9.67 | Ved tre skærmstørrelser … |
| `61-analyse-tjek.js` | 4 · Det nye i v9.66 | En rigtig analyse af 40 sekunders lyd er ok (slag i 8 af 8 dele) … |
| `60-automatik.js` | 4 · Det nye i v9.65 | (Fra v9.93: Normalisering læses fra mode, ikke knappen #norm.) Ved tre skærmstørrelser med rigtige museklik … |
| `59-forslag-andre.js` | 4 · Det nye i v9.64 | Pigernes show med en ny danser og en fri figur … |
| `58-forslag.js` | 4 · Det nye i v9.63 | (Fra v9.91: linjen under matrixen hedder Forslag … |
| `57-lang-sang.js` | 4 · Det nye i v9.62 | Kunstige målinger for 74 minutter med en kraftig start … |
| `56-opstillinger.js` | 4 · Det nye i v9.61 | Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med Pigernes show (97 noder) … |
| `55-matrix-knapper.js` | 4 · Det nye i v9.60 | Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med rigtige museklik … |
| `54-matrix-styrke-kaede.js` | 4 · Det nye i v9.59 | Ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med rigtige museklik, træk og tastetryk … |
| `53-matrix-figur-kopi.js` | 4 · Det nye i v9.58 | Ved 1920 × 1080 og 2560 × 1440 med rigtige museklik og tastetryk … |
| `52-matrix-traek-kopi.js` | 4 · Det nye i v9.57 | Ved 1920 × 1080 og 2560 × 1440 med rigtige musetræk og tastetryk … |
| `51-matrix-kopier.js` | 4 · Det nye i v9.56 | Ved 1920 × 1080 og 2560 × 1440 med rigtige museklik, træk og tastetryk … |
| `50-samme-vilkaar.js` | 4 · Det nye i v9.55 | Ved 1920 × 1080 og 2560 × 1440 … |
| `49-udsving.js` | 4 · Det nye i v9.54 | Det samme som i brugerens video, med rigtige museklik ved 1920 × 1080 og 2560 × 1440 … |
| `48-matrix-find-rundt.js` | 4 · Det nye i v9.53 | Matrixen ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med rigtige museklik og tastetryk … |
| `47-matrix-lav-og-ret.js` | 4 · Det nye i v9.52 | Matrixen ved 1920 × 1080 og 2560 × 1440 med rigtige museklik, træk og tastetryk … |
| `46-matrix-se.js` | 4 · Det nye i v9.51 | Matrixen ved 1920 × 1080, 2560 × 1440 og 3840 × 2160 med rigtige museklik … |
| `45-node-editor-lytter.js` | 4 · Det nye i v9.50 | Mappings rester er væk fra filen … |
| `44-flytning-5.js` | 4 · Det nye i v9.49 | Tæller steder uden for `Regler` (højst 11, dem der ikke skal flyttes) … |
| `43-flytning-4.js` | 4 · Det nye i v9.48 | Rigtige museklik på Vis og Slet i Editorens Koblinger ved 1920 × 1080 og 2560 × 1440 (fejlen fra v9.36), zonen … |
| `42-flytning-3.js` | 4 · Det nye i v9.47 | Tæller steder uden for `Regler` (højst 35) … |
| `41-flytning-2.js` | 4 · Det nye i v9.46 | Tæller steder uden for `Regler`, der skriver direkte i `maps` (højst 44) … |
| `40-flytning-1.js` | 4 · Det nye i v9.45 | Tæller steder uden for `Regler`, der skriver direkte i `maps` (højst 57) … |
| `39-fortryd-for-alt.js` | 4 · Det nye i v9.44 | Ctrl+Z og Gentag for trim, effekt-gruppens styrke, Slå fra og øje, Samlet styrke og Normalisering … |
| `38-faelles-indgang.js` | 4 · Det nye i v9.43 | Morph Pad er væk fra filen … |
| `37-d2-og-haandtag.js` | 4 · Det nye i v9.42 | (Fra v9.92: koden bag håndtagene er fjernet … |
| `36-visninger.js` | 4 · Det nye i v9.41 | De 10 visninger i Node-editoren … |
| `35-oprydning.js` | 4 · Det nye i v9.40 | Oprydning: Router-boksens kode og CSS, de frie vinduers rester og "Tastatur i Dublet" er væk … |
| `33-altid-skarpt.js` | 4 · Det nye i v9.38 | Altid skarpt ved 2560 × 1440 og skalering 1,5 … |
| `32-traek-uden-markering.js` | 4 · Det nye i v9.37 | Rettet: træk på kontrolpanelet, overskrifterne og værktøjslinjen (fra v9.91 … |
| `28-node-editor-navne.js` | 4 · Det nye i v9.33 | Node-editoren, trin 15 … |
| `27-node-editor-tsl.js` | 4 · Det nye i v9.32 | (Fra v9.93: Auto og Canvas 2D vælges med neLinjerValg, fordi knapperne i kontrolpanelet er fjernet.) Node-edit … |
| `26-node-editor-tastatur.js` | 4 · Det nye i v9.31 | Node-editoren, trin 13 … |
| `25-node-editor-scene.js` | 4 · Det nye i v9.30 | Node-editoren, trin 12 … |
| `24-node-editor-skabelon.js` | 4 · Det nye i v9.29 | Node-editoren, trin 11 … |
| `23-node-editor-laer.js` | 4 · Det nye i v9.28 | Node-editoren, trin 10 … |
| `22-node-editor-trim.js` | 4 · Det nye i v9.27 | Node-editoren, trin 9 … |
| `21-node-editor-komb.js` | 4 · Det nye i v9.26 | (Fra v9.91: 10 opsætninger.) Node-editoren, trin 8 … |
| `19-node-editor-tilfoej.js` | 4 · Det nye i v9.24 | Node-editoren, trin 6 … |
| `18-node-editor-lav.js` | 4 · Det nye i v9.23 | (Fra v9.91: figur-noden lægges op først, og slippet rammer nodens nederste del, fordi kolonnens navn ellers dæ … |
| `17-node-editor-ret.js` | 4 · Det nye i v9.22 | (Fra v9.93: Normalisering læses fra mode.) Node-editoren, trin 4 … |
| `16-node-editor-analyser.js` | 4 · Det nye i v9.21 | Node-editoren, trin 3 … |
| `15-node-editor-regler.js` | 4 · Det nye i v9.20 | Node-editoren, trin 2 … |
| `14-node-editor.js` | 4 · Det nye i v9.19 | Node-editoren, trin 1 … |
| `gamle-indstillinger/` | data | localStorage fra v9.4, v9.6, v9.8, v9.11, v9.13, v9.15 og v9.18 (fra v9.19), lavet ved at bruge de gamle versi … |
| `testlyd.js` | hjælp | laver testlydfilen: 30 s ved 120 BPM med kick, hihat, bas og en akkord i a-mol … |
| `faelles.js` | hjælp | finder programfilen og læser dens `<script>`-dele |
