# Det lokale modul: installation med ét klik (P8.24 punkt e) · 20. november 2026

*Kun en undersøgelse; intet er bygget. Kilderne er læst på nettet 20. november 2026. Det, der står som "ikke bekræftet", kunne ikke læses direkte (siden var spærret herfra) og bygger på uddrag.*

**Hvad modulet er:** et lille program på din egen pc (Python med grafikkortet, RTX 2070), som MV taler med over `http://127.0.0.1` (fagudtryk: lokal HTTP-tjeneste). Det skal kunne dele en sang i spor (Demucs) og senere finde taktslag, ord og instrumenter.

## Anbefaling

**Pinokio først, et lille startscript som reserve.** Et færdigt installationsprogram (.exe) er ikke umagen værd nu.

| Vej | Hvad du skal gøre | For | Imod |
| --- | --- | --- | --- |
| **A · Pinokio** (anbefalet) | Installér Pinokio én gang. Tryk *Download from URL*, indsæt adressen på vores script, tryk *Install*, og derefter *Start*. Cirka 5–6 klik første gang, ét klik (*Start*) derefter. | Pinokio henter selv Python, git, conda, ffmpeg og den rigtige PyTorch til grafikkortet. Start- og stopknap. Opdatering = scriptet hentes igen. Vi skal ikke lave et signeret program. | Fylder meget (fællesskabets vejledning siger op til 50 GB til de fleste apps). Antivirus kan afbryde første installation. Mappen skal ligge på et NTFS-drev uden mellemrum i stien. Et script, der ikke er godkendt af Pinokio, giver en advarsel. |
| **B · Startscript** (reserve) | Dobbeltklik på en `.bat`-fil. Den henter Python (med værktøjet uv) og pakkerne første gang. | Lille fil. Samme kode og samme pakkeliste som i A. | Sort tekstvindue. Windows advarer om filer fra nettet (SmartScreen). Ingen start- og stopknap. |
| C · Installationsprogram (.exe) | Ét klik. | Virker uden internet. | Flere GB. PyTorch med CUDA er svært at pakke. Hver opdatering er en ny stor fil. Uden signering advarer Windows. |
| D · Docker | – | Et færdigt billede med grafikkort findes. | Kræver WSL2 og Docker Desktop; for tungt. |

## Det, vi kan genbruge

- **python-audio-separator** (MIT): motoren bag Ultimate Vocal Remover som kommando og Python-bibliotek, med htdemucs og de andre modeller. Installeres med `pip install "audio-separator[gpu]"`. Den har ingen lokal tjeneste indbygget; den skal vi skrive (cirka 50 linjer med FastAPI).
- **Ultimate Vocal Remover** selv har kun et vindue, ingen kommando eller API. StemRoller det samme.
- Der blev ikke fundet et færdigt Pinokio-script kun til Demucs (søgningen var ikke udtømmende).

## Det, der skal prøves, før vi stoler på vejen

1. **Kan MV nå tjenesten?** MV åbnes som en fil (`file://`), og Chrome behandler det som en fremmed afsender (`Origin: null`). Tjenesten skal svare med `Access-Control-Allow-Origin: *` (fagudtryk: CORS). Chrome har siden version 142 en ny regel for adgang til lokale adresser (Local Network Access); om en fil-side er undtaget, er **ikke bekræftet**. Det skal prøves i din Chrome.
2. **Får vi grafikkortet med?** Der er indlæg om, at Pinokios PyTorch-hjælper nogle gange vælger udgaven uden grafikkort.
3. **Hvor lang tid og hvor meget plads** tager installationen på din pc, og blander antivirus sig?

**Mindste forsøg (4 små filer, ikke bygget):** `install.js` (PyTorch + audio-separator + FastAPI), `server.py` (`/health` svarer, om grafikkortet er med; `/separate` tager en lydfil og giver 4 spor), `start.js`, `pinokio.js`. Fra MV: ét kald til `http://127.0.0.1:PORT/health`.

**Ikke undersøgt:** om Beat This!, WhisperX, allin1 og PANNs/CLAP kan installeres på Windows og være i 8 GB på grafikkortet.

## Kilder

- Pinokio: https://github.com/pinokiocomputer/pinokio · udgivelser: https://github.com/pinokiocomputer/pinokio/releases (v8.3.7) · script-dokumentation: https://raw.githubusercontent.com/pinokiocomputer/program.pinokio.computer/main/README.md · fællesskabets vejledning: https://github.com/6Morpheus6/pinokio-wiki
- python-audio-separator: https://github.com/nomadkaraoke/python-audio-separator · Ultimate Vocal Remover: https://github.com/Anjok07/ultimatevocalremovergui · StemRoller: https://github.com/stemrollerapp/stemroller
- Local Network Access: https://github.com/WICG/local-network-access/blob/main/explainer.md
