/* Laver en testlydfil (WAV), så analysen har noget at arbejde med: 30 s ved 120 BPM.
   Kick på hvert slag, hihat på hver ottendedel, bas på slag 1 og 3 og en akkord i a-mol.
   Skrives i ren Node, så der ikke skal installeres noget. */
const fs = require('fs');
function lavTestlyd(fil, sek = 30, bpm = 120, sr = 22050) {
  const n = sek * sr, x = new Float32Array(n), slag = 60 / bpm;
  let s = 1; const støj = () => ((s = (s * 16807) % 2147483647) / 2147483647) * 2 - 1;
  for (let b = 0; b * slag < sek; b++) {
    const t0 = Math.round(b * slag * sr);
    for (let i = 0; i < 0.25 * sr && t0 + i < n; i++) { const t = i / sr; x[t0 + i] += 0.9 * Math.sin(2 * Math.PI * (50 + 100 * Math.exp(-t * 30)) * t) * Math.exp(-t * 12); } // kick
    for (const h of [0, 0.5]) { const t1 = Math.round((b + h) * slag * sr); for (let i = 0; i < 0.04 * sr && t1 + i < n; i++) x[t1 + i] += 0.25 * støj() * Math.exp(-i / sr * 90); } // hihat
    if (b % 2 === 0) for (let i = 0; i < slag * sr && t0 + i < n; i++) { const t = i / sr; x[t0 + i] += 0.35 * Math.sin(2 * Math.PI * 55 * t) * Math.exp(-t * 3); } // bas
  }
  for (let i = 0; i < n; i++) { const t = i / sr; x[i] += 0.06 * (Math.sin(2 * Math.PI * 220 * t) + Math.sin(2 * Math.PI * 261.63 * t) + Math.sin(2 * Math.PI * 329.63 * t)); } // a-mol
  const buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVEfmt ', 8); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34); buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(x[i] * 0.7 * 32767))), 44 + i * 2);
  fs.writeFileSync(fil, buf); return fil;
}
if (require.main === module) console.log(lavTestlyd(process.argv[2] || 'testlyd.wav'));
module.exports = lavTestlyd;
