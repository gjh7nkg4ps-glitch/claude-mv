# Testpakken · Claude MV

Testene følger den faste rækkefølge i `CLAUDE.md` afsnit 2 (*Test før aflevering*).
De bruger kun Node og Playwright (fagudtryk: testbrowser). Der skal ikke installeres noget ekstra.

## Sådan kører du dem

Alle test på den nyeste `claude-mv-v*.html` i repoets rod:

```bash
node tests/koer-alle.js
```

En bestemt fil:

```bash
node tests/koer-alle.js claude-mv-v9_7.html
```

Hurtigt, uden analyse af en lydfil (de forudindstillinger, der kræver en sang, springes over):

```bash
node tests/koer-alle.js --uden-lyd
```

Hver test kan også køres alene, fx `node tests/2-indhold.js`.
Filnavnet skrives altid øverst, så vi ser, at det er den rigtige fil, der testes.

## Hvad der testes

| Fil | Trin | Hvad |
| --- | --- | --- |
| `1-syntaks.js` | 1 · Syntaks | `node --check` på hvert `<script>` i filen |
| `2-indhold.js` | 2 · Indhold | versionen er ens i filnavn, `<title>`, versionsmærke og manual (*Nyt i v…* og `man-vXY`); indholdsfortegnelsen passer med blokkenes markeringer; ingen henvisning til `PLAN_FASE2` i koden eller manualen |
| `3-browser.js` | 3 · Opstart | ingen `pageerror` og ingen konsolfejl |
| | 3 · Arbejdsfeltet | ingen gammel Generator-fane; Generator-vinduet (W4) findes og åbnes med *Avanceret …* i Lydkilde |
| | 3 · Lyd | en testlydfil analyseres, og tempoet findes til cirka 120 BPM |
| | 3 · Fast testpakke | alle forudindstillinger (`FORINDST`, `brugFor`) indlæses uden fejl · alle 5 layouts (`lay3Anvend`) uden overlap mellem synlige vinduer · Mesh 3D og Øjet starter · gem og hent plads A (`slotSave`/`slotLoad`) · tilføj og fjern en forbindelse |
| `4-lydmotor.js` | 4 · Det nye i v9.8 | Lydmotor 2: alle 7 genrer med Ny og Klassisk uden at spille (ingen klip, ikke stille, forskellige); betoninger og spøgelsesslag; akkorden lyser, takten tæller, Fill i takt 4; skift motor og *Tilbage til standard*; *Send til editor*. Gemmer lydprøver i `tests/ud/lyd/` |
| `5-router.js` | 4 · Det nye i v9.9 | Router 2.0: motoren regner præcis som før uden de nye trin; hysterese, Hold 300 ms og Slew 2/s måles; de virker ikke på klods-spor; fanen, boksene, linjerne og chipsene; træk i VU-måleren, drejeknap, Hold ∞ gør Release grå, Spærretid grå, ↺ Standard, Mapping-linjen, + Ny og ✕; levende med en lydfil |
| `testlyd.js` | hjælp | laver testlydfilen: 30 s ved 120 BPM med kick, hihat, bas og en akkord i a-mol |
| `faelles.js` | hjælp | finder programfilen og læser dens `<script>`-dele |
| `koer-alle.js` | | kører det hele i rækkefølge: 1, 2, 3 og så alle test af det nye (4, 5 …) |

**Skærmbilleder** gemmes i `tests/ud/` (opstart, hvert layout, Mesh 3D, Øjet). Mappen kommer ikke med i repoet.

## Det tester pakken ikke

- **Trin 4 · Det nye**: hver version får sin egen testfil (`4-…`, `5-…`), der bliver i pakken, så det nye også testes senere.
- Om lyden *lyder* godt. Testene måler lyden (klip, styrke, frekvenser), men et menneske skal lytte til lydprøverne i `tests/ud/lyd/`.
- *Afslut fuld visning*: testbrowseren kan ikke tage skærmbilleder af fuld skærm.
- Om billederne *ser* rigtige ud. Det kræver, at et menneske (eller Claude) kigger på skærmbillederne.

## Kendte faldgruber

- Uden grafikkort (SwiftShader, fagudtryk) er 3D meget langsomt. Mesh 3D og Øjet får 10 sekunder til at starte.
- Analysen af testlydfilen tog cirka 3 sekunder i Claude Codes skybrowser. På en langsommere maskine kan den tage over et minut; testen venter op til 4 minutter.
