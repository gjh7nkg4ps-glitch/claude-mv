/* ========== v9.111: KOLONNENAVNE FAST ØVERST I NODE-EDITOREN ==========
   Brugerens ønske 20. november: kolonnenavnene (Lydtræk, Regel, Figur …) fulgte kolonnernes plads og zoom (v9.61) og lå oven i hinanden, når to kolonner
   stod tæt (fx Figur, Analyse og Mål i gitteret). Nu står de i en fast linje øverst i Node-editoren: samme størrelse uanset zoom, lige meget plads til hver,
   og i samme rækkefølge fra venstre mod højre, som kolonnerne står på fladen. De flytter sig ikke, når fladen flyttes eller zoomes. + Tilføj og træk i navnet
   (flytter hele kolonnen) virker som før. ne61Hoveder erstattes; ne61Boks bruges stadig til at finde kolonnens plads. */
ne61Hoveder=function(){const hv=$('ne-hoveder');if(!hv)return;const W=hv.clientWidth;if(!(W>0))return;
 const L=[...hv.querySelectorAll('.ne-hoved')].map((h,i)=>{const c=NE.kol[i];if(!c)return null;const b=ne61Boks(c.k);return{h,i,x:b?b.x0:c.x}}).filter(Boolean).sort((a,b)=>a.x-b.x||a.i-b.i);
 const pad=12,w=(W-pad*2)/Math.max(1,L.length);
 L.forEach((o,j)=>{const s=o.h.style;s.transform='none';s.top='8px';s.left=Math.round(pad+j*w)+'px';s.width=Math.max(40,Math.round(w-14))+'px';o.h.classList.toggle('ne-smal',w<170);o.h.classList.toggle('ne-mini',w<90)})};
try{new ResizeObserver(()=>{try{ne61Hoveder()}catch(e){}}).observe($('ne-hoveder'))}catch(e){}
/* v9.112: efter Tilpas står den øverste node under linjen med kolonnenavne (NE111_TOP px fra toppen), også når der er zoomet langt ud; før kunne et klik på en node ramme et kolonnenavn */
const NE111_TOP=92,NE111={spring:false};/* v9.114: fladen tegnes én gang pr. Tilpas (før tre gange; det kunne mærkes på en stor skærm uden grafikkort) */
{const gl=neVis;window.neVis=function(){if(NE111.spring)return;return gl.apply(this,arguments)}}
{const gl=neTilpas;window.neTilpas=function(stille){NE111.spring=true;try{gl(true)}finally{NE111.spring=false}try{const B=neGraenser();if(B&&Number.isFinite(B.y0)){const y=Math.round(NE111_TOP-B.y0*NE.z);if(NE.y<y)NE.y=y}}catch(e){}neVis();if(!stille)neGem()}}
/* ========== SLUT: KOLONNENAVNE FAST ØVERST I NODE-EDITOREN ========== */


