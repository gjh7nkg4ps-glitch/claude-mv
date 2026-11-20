/* ========== SIKKER VISNING: blinkbegrænsning og bevægelsesdæmpning ========== */
/* Slået til fra start. Programmet MÅLER lysstyrken i det tegnede billede (et lille 16 gange 9-billede hvert billede) og tæller blink efter retningslinjen (WCAG 2.3.1: højst tre blink i sekundet, hvor et blink er et par modsatrettede skift på mindst 0,1 i relativ luminans). Kommer der for mange, dæmpes de lyse effekter (strobe, glød, lys-puls, chokbølge og burst) lige så meget, som der skal til, og de slippes langsomt igen. Strobe er desuden højst 0,24 hvid. Ryst og zoom halveres, og dæmpes til 40 %, hvis systemet siger, at du vil have mindre bevægelse. Gælder Live preview og dubletten; Lyd i 3D har sit eget valg med samme standard. Det er en hjælp, ikke en garanti. */
const BLINK=Rytme.blinkNy(),BL={c:null,g:null};
const reduceretBev=()=>{try{return !!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)}catch(e){return false}};
function blinkE(E){const rb=reduceretBev();if(!set.sikker&&!rb)return E;return Rytme.blinkBegraens(E,set.sikker?BLINK.faktor:1,rb?.4:(set.sikker?.5:1))}
function blinkLaes(){try{if(!BL.c){BL.c=document.createElement('canvas');BL.c.width=16;BL.c.height=9;BL.g=BL.c.getContext('2d',{willReadFrequently:true})}
 BL.g.drawImage($('pv'),0,0,16,9);const d=BL.g.getImageData(0,0,16,9).data;if(!d||!d.length)return null;let r=0,g=0,b=0;const n=d.length/4;for(let i=0;i<d.length;i+=4){r+=d[i];g+=d[i+1];b+=d[i+2]}return Rytme.luminans(r/n,g/n,b/n)}catch(e){return null}}
function blinkMaal(t){if(!set.sikker)return;if(t-(BL.t||0)<80)return;BL.t=t;/* v9.69: højst 12 gange i sekundet */const L=blinkLaes();if(L===null||!isFinite(L))return;Rytme.blinkTik(BLINK,L,t)}
function sikkerUI(){const b=$('tb-sikker');if(!b)return;b.setAttribute('aria-pressed',set.sikker?'true':'false');b.textContent='Sikker visning: '+(set.sikker?'Til':'Fra');if($('s-sikker'))$('s-sikker').checked=set.sikker;
 b.title='Sikker visning '+(set.sikker?'er til':'er fra')+'. Højst tre blink i sekundet og mindre rystelse. Målt lige nu: '+(Math.round(BLINK.rate*10)/10).toString().replace('.',',')+' blink i sekundet; dæmpning '+Math.round(BLINK.faktor*100)+' %.'+(reduceretBev()?' Dit system beder om mindre bevægelse, så rystelse og zoom dæmpes altid.':'')}
async function sikkerSaet(til){if(til===set.sikker)return true;if(!til){const r=await spoerg({titel:'Slå sikker visning fra?',tekst:'Uden den kan Strobe, Glød og Lys-puls blinke hurtigere end tre gange i sekundet over store dele af skærmen. Det kan give anfald hos personer med lysfølsom epilepsi, og det er ikke tilladt at vise for et publikum uden at have advaret dem. Vil du slå den fra?',ok:'Slå fra',fare:true});if(!r.ok){sikkerUI();return false}}
 set.sikker=til;if(til){BLINK.faktor=1;BLINK.tider.length=0;BLINK.hist.length=0;BLINK.L=null}applySet();msg(til?'Sikker visning er slået til.':'Sikker visning er slået fra. Du er selv ansvarlig for, at billedet ikke blinker for hurtigt.');return true}
$('tb-sikker').onclick=()=>sikkerSaet(!set.sikker);$('s-sikker').onchange=e=>{sikkerSaet(e.target.checked)};
setInterval(()=>{try{sikkerUI()}catch(e){}},400);
sikkerUI();
/* ---- Tilgængelighed: statuslinjen læses højt, og alle lærreder har et navn ---- */
$('status').setAttribute('role','status');$('status').setAttribute('aria-live','polite');
{const NAVN={tl:'Lydtræk over tid',eq:'EQ-visualizer med tærskler for hvert lydtræk',pv:'Live preview: det, publikum ser',mesh:'Radial Mesh: forbindelser mellem lydtræk og mål',xy:'Multi-styring (XY-pad)',an:'Analyse: log-spektrum, toneklasser og klang',form:'Figurens udseende'};document.querySelectorAll('canvas').forEach(c=>{if(!c.getAttribute('aria-label')&&!c.title)c.setAttribute('aria-label',NAVN[c.id]||('Tegneflade '+(c.id||'')))})}
/* ========== SLUT: SIKKER VISNING ========== */

