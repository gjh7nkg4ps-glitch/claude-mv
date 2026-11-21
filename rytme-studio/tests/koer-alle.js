/* Kør alle test af Rytme Studio i fast rækkefølge. Brug: node rytme-studio/tests/koer-alle.js */
const { FIL } = require('./faelles');
(async () => {
  const res = [require('./1-syntaks')(FIL)];
  res.push(await require('./2-run1')());
  res.push(await require('./3-mp3')());
  res.push(await require('./4-stile')());
  res.push(await require('./5-opsaetninger')());
  const ok = res.every(Boolean);
  console.log(ok ? '✅ Alle test er bestået.' : '❌ Mindst én test fejlede.');
  process.exit(ok ? 0 : 1);
})();
