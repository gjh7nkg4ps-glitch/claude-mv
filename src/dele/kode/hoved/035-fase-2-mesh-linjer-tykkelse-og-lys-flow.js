/* ========== FASE 2: MESH-LINJER (tykkelse og lys-flow) ========== */
/* Kun udseende. Påvirker ikke motoren. Tykkelse: [navn, grundbredde, tillæg ved fuld aktivitet]. Trin 4 er den tidligere faste tykkelse. */
const MTYK=[['Hårfin',.8,2.5],['Tynd',1.5,5],['Medium',3,10],['Tyk',4.5,15],['Ekstra tyk',7,22]],PULSE_MS=450,pulses=[],lastEnvM=[],lastSpawn=[];
set.meshTyk??=4;set.meshFlow??=false;
function drawPulses(g,G,TK,t){for(let k=pulses.length-1;k>=0;k--){const p=pulses[k],m=maps[p.i];if(!m){pulses.splice(k,1);continue}const[b,e]=ends(m,G);if(!b||!e){pulses.splice(k,1);continue}
 const u=(t-p.t0)/PULSE_MS;if(u>1){pulses.splice(k,1);continue}const c=ctrl(b,e,G),h=HUE(b.i);
 for(let j=0;j<7;j++){const uu=u-j*.035;if(uu<0)break;const q=1-uu,x=q*q*b.x+2*q*uu*c.x+uu*uu*e.x,y=q*q*b.y+2*q*uu*c.y+uu*uu*e.y,f=1-j/7;
  g.fillStyle='hsla('+h+',90%,'+Math.round(65+u*25)+'%,'+(p.a*f*.9).toFixed(3)+')';g.shadowColor='hsl('+h+',90%,65%)';g.shadowBlur=j===0?14:0;g.beginPath();g.arc(x,y,Math.max(1.5,(TK[1]*.8+3+p.a*TK[2]*.4)*f),0,7);g.fill()}}g.shadowBlur=0}
function meshLinjeUI(){$('mtyk').value=set.meshTyk;$('mtykv').textContent=MTYK[set.meshTyk-1][0];setTgl($('mflow'),!!set.meshFlow,'Lys-flow')}
$('mtyk').oninput=e=>{set.meshTyk=+e.target.value;applySet();meshLinjeUI()};
$('mflow').onclick=()=>{set.meshFlow=!set.meshFlow;pulses.length=0;applySet();meshLinjeUI()};
meshLinjeUI();
/* ========== SLUT: MESH-LINJER ========== */

