
/* ========== v9.16: FORESLÅ REGLER I LYDKILDE (før Auto-mapping) ==========
   Knapperne "Auto: Til/Fra" og "Kør Auto-mapping nu" flyttes (ikke kopieres) fra Lydtræk-guide (W18) til toppen af fanen
   Lydkilde (W31), fælles for Lydfil og 4 spor. Knapperne beholder deres id og deres kode; kun pladsen er ny.
   W18 beholder guiden og Standard/Fast 2 og får en linje om, hvor Auto er flyttet hen. */
(function(){const ind=()=>{const w=$('w31'),a=$('auto'),n=$('autonow');if(!w||!a||!n)return;const wb=w.querySelector('.wb');if(!wb||$('lk-auto'))return;
 const gl=a.parentNode;const d=document.createElement('span');d.id='lk-auto';d.className='lk-auto';
 d.title='Foreslå regler ud fra figurerne på scenen og den analyserede sang. Intet ændres, før du siger ja i matrixen.';
 d.appendChild(a);d.appendChild(n);
 /* i overskriften "Lydkilde", så Auto ikke gør fanen højere (v9.17: ingen knapper under bundbaren) */
 const wh=w.querySelector('.wh'),mx=wh&&wh.querySelector('.mx');if(wh){wh.insertBefore(d,mx||null)}else wb.insertBefore(d,wb.firstChild);
 if(gl){const t=document.createElement('span');t.className='small';t.textContent='Foreslå regler ligger øverst i fanen Lydkilde og under matrixen.';gl.insertBefore(t,gl.firstChild)}};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ind);else ind()})();
/* ========== SLUT: FORESLÅ REGLER I LYDKILDE ========== */
