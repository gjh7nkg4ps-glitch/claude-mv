"""Laver 4 test-spor (stems) med numpy til tests/11-stems.js: 30 s ved 120 BPM, 22050 Hz, mono WAV.

Hvert spor spiller kun i sit eget tidsrum, så man kan se, at hver måling kun reagerer på sit eget spor:
  trommer  0-20 s   kick på hvert slag og hihat på hver ottendedel
  bas      5-25 s   basnoter (55 og 73 Hz) mellem slagene
  vokal   10-30 s   en tone (440 Hz med vibrato), 1,5 s tændt og 0,5 s slukket
  resten  15-30 s   akkorder (a-mol og F-dur), hver 2 s

Brug: python3 tests/lav-stems.py MAPPE [--kort-bas]   (--kort-bas gør bassen 1 s kortere, for at teste den gule besked)
"""
import sys, wave
import numpy as np

SR, SEK, BPM = 22050, 30, 120


def gem(sti, x):
    x = np.clip(x, -1, 1)
    with wave.open(sti, 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((x * 32767 * 0.8).astype('<i2').tobytes())


def lav(mappe, kort_bas=False):
    n, slag = SR * SEK, 60 / BPM
    t = np.arange(n) / SR
    rng = np.random.default_rng(5)
    tromme, bas, vokal, rest = (np.zeros(n) for _ in range(4))
    for b in range(int(SEK / slag)):
        t0 = b * slag
        if t0 < 20:  # kick og hihat
            i0 = int(t0 * SR); k = np.arange(int(.25 * SR)); tk = k / SR
            tromme[i0:i0 + len(k)] += .9 * np.sin(2 * np.pi * (50 + 100 * np.exp(-tk * 30)) * tk) * np.exp(-tk * 12)
            for h in (0, .5):
                i1 = int((t0 + h * slag) * SR); m = int(.04 * SR)
                tromme[i1:i1 + m] += .3 * rng.uniform(-1, 1, m) * np.exp(-np.arange(m) / SR * 90)
        if 5 <= t0 < 25:  # bas mellem slagene
            i0 = int((t0 + slag / 2) * SR); m = int(slag / 2 * SR); tb = np.arange(m) / SR
            f = 55 if b % 4 < 2 else 73.4
            bas[i0:i0 + m] += .6 * np.sin(2 * np.pi * f * tb) * np.exp(-tb * 4)
    on = (t >= 10) & ((t - 10) % 2 < 1.5)  # vokal
    vokal += on * .5 * np.sin(2 * np.pi * 440 * t + 3 * np.sin(2 * np.pi * 5.5 * t))
    for i, frekv in enumerate([(220, 261.63, 329.63), (174.61, 220, 261.63)] * 4):  # resten
        a = 15 + i * 2
        if a >= SEK: break
        m = (t >= a) & (t < a + 2)
        rest += m * .15 * sum(np.sin(2 * np.pi * f * t) for f in frekv)
    if kort_bas:
        bas = bas[:n - SR]
    for navn, x in (('trommer', tromme), ('bas', bas), ('vokal', vokal), ('resten', rest)):
        gem(f'{mappe}/{navn}.wav', x)


if __name__ == '__main__':
    lav(sys.argv[1], '--kort-bas' in sys.argv)
    print(sys.argv[1])
