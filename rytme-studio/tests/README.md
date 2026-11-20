# Test af Rytme Studio

Kør alle: `node rytme-studio/tests/koer-alle.js` (cirka 2 minutter; Node og Playwright). Skærmbilleder og testlyd lander i `tests/ud/` (gemmes ikke i repoet).

| Fil | Hvad |
| --- | --- |
| `1-syntaks.js` | `node --check` på hvert modul (script-element) i filen |
| `2-run1.js` | Run 1 med rigtige museklik og tastetryk: opstart uden fejl, demo-lyd, afspil og pause, søgning, zoom, snap, loop A til B, lydstyrke, følg afspilning, tempo-gitter, sprog, filer (WAV, dårlig fil, slip), slutning og Stop, beskedliste, det der huskes, skærmbilleder i 1920, 2560 og 3840, smalle vinduer |
| `3-mp3.js` | en mp3 på 4 minutter (laves med ffmpeg): afkodning, fremskridt, zoom helt ind, følg afspilning |
