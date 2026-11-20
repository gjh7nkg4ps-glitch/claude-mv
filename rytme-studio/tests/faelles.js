/* Fælles hjælpere til testene af Rytme Studio. */
const fs = require('fs'), path = require('path');

const FIL = path.join(__dirname, '..', 'rytme-studio.html');
const UD = path.join(__dirname, 'ud');

function playwright() {
  try { return require('playwright'); }
  catch (e) { return require('/opt/node-tools/node_modules/playwright'); }
}

/* En lille WAV-fil (16 bit, stereo) til test af "Vælg lydfil": en tone med et klik hvert halve sekund. */
function lavWav(sekunder = 3, sr = 44100) {
  const n = Math.round(sekunder * sr), data = Buffer.alloc(n * 4);
  for (let i = 0; i < n; i++) {
    const t = i / sr, slag = t % 0.5;
    const v = 0.3 * Math.sin(2 * Math.PI * 220 * t) + 0.6 * Math.sin(2 * Math.PI * 60 * slag) * Math.exp(-18 * slag);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), i * 4);
    data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v * 0.8)) * 32767), i * 4 + 2);
  }
  const hoved = Buffer.alloc(44);
  hoved.write('RIFF', 0); hoved.writeUInt32LE(36 + data.length, 4); hoved.write('WAVE', 8);
  hoved.write('fmt ', 12); hoved.writeUInt32LE(16, 16); hoved.writeUInt16LE(1, 20); hoved.writeUInt16LE(2, 22);
  hoved.writeUInt32LE(sr, 24); hoved.writeUInt32LE(sr * 4, 28); hoved.writeUInt16LE(4, 32); hoved.writeUInt16LE(16, 34);
  hoved.write('data', 36); hoved.writeUInt32LE(data.length, 40);
  return Buffer.concat([hoved, data]);
}

/* Tæller beståede og fejlede tjek og skriver én linje pr. tjek. */
function tjekker(navn) {
  let ok = 0, fejl = 0;
  return {
    tjek(betingelse, tekst, detalje) {
      if (betingelse) { ok++; console.log('  ✓ ' + tekst); }
      else { fejl++; console.log('  ✗ ' + tekst + (detalje !== undefined ? '  → ' + JSON.stringify(detalje) : '')); }
      return !!betingelse;
    },
    slut() {
      const godt = fejl === 0;
      console.log((godt ? '✅ ' : '❌ ') + navn + ': ' + ok + ' bestået, ' + fejl + ' fejlet\n');
      return godt;
    }
  };
}

module.exports = { FIL, UD, playwright, lavWav, tjekker, sikrUd: () => fs.mkdirSync(UD, { recursive: true }) };
