# STATUS · Claude MV

Kort status over 4 spor (stems, fagudtryk). Planen i det hele står i `CLAUDE.md`, afsnit 6.

## Lavet (v9.15)

- **Trin 1 af stems:** kortet *4 spor (stems)* i fanen Lydkilde. Man giver programmet 4 filer, der er delt op på forhånd: **Trommer, Bas, Vokal og Resten**.
- Sporene lægges sammen til én lyd, der spilles og analyseres som en almindelig fil. Hvert spor måles for sig (14 lydtræk pr. spor, fx *Trommer · Kick*).
- **Auto:** kick, snare og hihat læses fra Trommer, bas fra Bas og vokal fra Vokal, når der er 4 spor. Grunden står ved forbindelsen, og man kan vælge Manuel.

## Næste

### Vælg et værktøj til at dele en almindelig mp3 i 4 spor (B)

Programmet kan **ikke** selv dele en mp3 op. Det er ikke bygget. **Du vælger værktøjet**, før der bygges noget.

| Værktøj | Hvad | For | Imod |
| --- | --- | --- | --- |
| **Demucs** (fagudtryk: source separation-model fra Meta, åben kildekode) | kører på din egen computer med Python | gratis; god kvalitet; musikken forlader ikke computeren; giver præcis 4 spor (drums, bass, vocals, other) | skal installeres (Python); langsomt uden grafikkort (flere minutter pr. sang); kan ikke køre inde i HTML-filen |
| **AudioPod** (online tjeneste) | du sender filen op og får sporene tilbage | intet at installere; hurtigt; er allerede koblet til Claude i dine sessioner (værktøjet *separate stems*) | koster kreditter; musikken sendes til en fremmed server; kræver internet |
| *Ultimate Vocal Remover* (program med vinduer, bruger Demucs og andre modeller) | på din egen computer | gratis; ingen kommandolinje | skal installeres; mange valg |

Alle tre giver 4 filer, som kortet *4 spor (stems)* allerede kan læse.

## Senere

### .stem.mp4 (Native Instruments' stems-format)

- **Hvad det er:** én MP4-fil med 5 lydspor: den samlede lyd og 4 spor (trommer, bas, andet/synths og vokal), alle i AAC (fagudtryk).
- **Hvorfor det ikke virker nu:** browserens almindelige afkodning (`decodeAudioData`) læser kun det første lydspor, altså den samlede lyd. Programmet siger det med en gul besked, hvis man prøver.
- **Det kan godt lade sig gøre uden store biblioteker:** en lille MP4-læser (fagudtryk: demuxer), der finder de 5 lydspor i filen, og browserens WebCodecs `AudioDecoder` til AAC. Anslået cirka 300 linjer. Virker i Chrome og Edge; i Firefox og Safari er det usikkert.
- **Indtil da:** del filen i 4 med ffmpeg (sporene ligger som nr. 1 til 4 efter den samlede lyd):

```bash
ffmpeg -i sang.stem.mp4 -map 0:a:1 trommer.wav -map 0:a:2 bas.wav -map 0:a:3 resten.wav -map 0:a:4 vokal.wav
```
