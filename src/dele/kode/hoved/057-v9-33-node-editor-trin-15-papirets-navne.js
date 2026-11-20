/* ========== v9.33: NODE-EDITOR (TRIN 15): PAPIRETS NAVNE ==========
   Trin 15 af 16 (papirets afsnit 2 og 8): navnene fra papiret står nu i hele programmet (Adaptiv tærskel, Gate og Gate-tærskel, Auto-mapping,
   Normalisering: Adaptiv · Fast, Auto-valg, Opsætning 1–20, Sammenlign 1 ↔ 2, opsætning, Scene-effekter). De interne nøgler er de samme
   (rytme-A … rytme-T, set.tilpas, m.port, mode 'auto'), så gemte opsætninger åbnes som før; plads A vises som Opsætning 1 (slotNr).
   De fire gamle vinduer (Mapping, Router 2.0, Dublet og Routing-overblik) får mærket "· gammel" bag navnet på fanen og i overskriften.
   Mærket sættes med CSS (::after), så knappernes tekst og fanernes interne navne ikke ændres. */
const NE15_GAMMEL=['w12','w32','w8','w10'];
function ne15Gammel(){NE15_GAMMEL.forEach(id=>{document.querySelectorAll('[data-fgv="'+id+'"],[data-sc="'+id+'"]').forEach(b=>{if(!b.classList.contains('ne15-gammel')){b.classList.add('ne15-gammel');b.title='· gammel: virker endnu, men fjernes, når Node-editoren kan det samme.'}});
 const h=document.querySelector('#'+id+'>.wh>span');if(h&&!h.classList.contains('ne15-gammel'))h.classList.add('ne15-gammel')})}
{const gl=fgFaner;window.fgFaner=function(){const r=gl.apply(this,arguments);ne15Gammel();return r}}
{const gl=scFaner;window.scFaner=function(){const r=gl.apply(this,arguments);ne15Gammel();return r}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ne15Gammel,0));else setTimeout(ne15Gammel,0);setTimeout(ne15Gammel,1500);
/* ========== SLUT: NODE-EDITOR (TRIN 15): PAPIRETS NAVNE ========== */
