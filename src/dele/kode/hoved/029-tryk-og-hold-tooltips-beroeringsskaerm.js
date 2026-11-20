/* ========== TRYK-OG-HOLD-TOOLTIPS (berøringsskærm) ========== */
/* En musetip (title) vises ikke på en berøringsskærm. Hold en finger (eller en pen) på noget med en forklaring i cirka et halvt sekund, så vises forklaringen i en boble, til du løfter fingeren og lidt efter (cirka 3,5 sekunder i alt). Flytter fingeren sig mere end 10 punkter, eller løftes den før tiden, vises intet, og trykket virker som et almindeligt tryk. Har boblen været vist, springes selve trykket over (så du ikke kommer til at trykke på knappen, mens du læser). Musen er upåvirket. */
const TIP={t:null,skjul:null,el:null,x:0,y:0,vist:false,blok:0,boble:null};
function tipEl(el){return el&&el.closest?el.closest('[title]'):null}
function tipLuk(){clearTimeout(TIP.t);clearTimeout(TIP.skjul);TIP.t=TIP.skjul=null;if(TIP.boble)TIP.boble.hidden=true;TIP.vist=false}
function tipVis(el){const tx=(el.getAttribute('title')||'').trim();if(!tx)return false;let b=TIP.boble;if(!b){b=TIP.boble=document.createElement('div');b.id='tipboble';b.setAttribute('role','tooltip');document.body.appendChild(b)}
 b.textContent=tx;b.hidden=false;const r=el.getBoundingClientRect(),bw=Math.min(320,innerWidth*.8),x=Math.max(8,Math.min(innerWidth-bw-8,r.left+r.width/2-bw/2)),over=r.top-8>70;b.style.maxWidth=bw+'px';b.style.left=x+'px';b.style.top=over?'auto':(r.bottom+8)+'px';b.style.bottom=over?(innerHeight-r.top+8)+'px':'auto';TIP.vist=true;clearTimeout(TIP.skjul);TIP.skjul=setTimeout(tipLuk,3500);return true}
document.addEventListener('pointerdown',e=>{tipLuk();if(e.pointerType!=='touch'&&e.pointerType!=='pen')return;const el=tipEl(e.target);if(!el||!(el.getAttribute('title')||'').trim())return;TIP.el=el;TIP.x=e.clientX;TIP.y=e.clientY;TIP.t=setTimeout(()=>{TIP.t=null;if(tipVis(el))TIP.blok=Date.now()},500)},true);
document.addEventListener('pointermove',e=>{if(TIP.t&&Math.hypot(e.clientX-TIP.x,e.clientY-TIP.y)>10){clearTimeout(TIP.t);TIP.t=null}},true);
['pointerup','pointercancel'].forEach(n=>document.addEventListener(n,()=>{if(TIP.t){clearTimeout(TIP.t);TIP.t=null}},true));
document.addEventListener('click',e=>{if(TIP.blok&&Date.now()-TIP.blok<900){TIP.blok=0;e.preventDefault();e.stopPropagation()}},true);
document.addEventListener('contextmenu',e=>{if(TIP.blok&&Date.now()-TIP.blok<900)e.preventDefault()},true);
addEventListener('scroll',()=>{if(TIP.vist)tipLuk()},true);
/* ========== SLUT: TRYK-OG-HOLD-TOOLTIPS ========== */

