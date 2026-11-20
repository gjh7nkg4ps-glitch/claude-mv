/* ========== v9.26: NODE-EDITOR (TRIN 8): FLERE REGLER PÅ ÉT MÅL ==========
   Trin 8 af 16 (papirets afsnit 5.8): når flere regler styrer samme mål, vælges i Mål-nodens kontrolpanel, hvordan de lægges sammen:
   Største (standard, som MV altid har regnet: den største vinder), Læg sammen (summen, højst 1) eller Gang (produktet) (fagudtryk: max, add, multiply).
   Valget gemmes på reglerne som m.komb ('sum' eller 'gang'; Største = intet felt), så det følger med i Mapping, Opsætning 1–20 og Fortryd.
   Motoren (ROUTER 2.0 MOTOR) spørger neKombFor(mål): den første regel til målet med m.komb bestemmer. Uden m.komb regner motoren præcis som før.
   Gang: en regel, der står på 0 (fx under tærsklen eller slået fra), giver 0 for hele målet. */
const NE8={cache:null,t:0};
function neKombFor(e){const nu=performance.now();if(!NE8.cache||nu-NE8.t>250||NE8.n!==maps.length){NE8.cache={};NE8.t=nu;NE8.n=maps.length;for(const m of maps){if(m.komb&&!(m.effect in NE8.cache))NE8.cache[m.effect]=m.komb}}return NE8.cache[e]||'max'}
function neKomb(k,gl,cur){if(k==='sum')return Math.min(1,(gl||0)+cur);if(k==='gang')return gl===undefined?cur:gl*cur;return Math.max(gl||0,cur)}
const NE8_NAVN={max:'Største',sum:'Læg sammen',gang:'Gang'};
const NE8_TIP={max:'Den største af reglerne vinder (fagudtryk: max). Sådan har MV altid regnet.',sum:'Reglerne lægges sammen, højst 1 (fagudtryk: add).',gang:'Reglerne ganges (fagudtryk: multiply). En regel på 0 giver 0 for hele målet.'};
function neKombNavn(e){return NE8_NAVN[neKombFor(e)]}
function neSaetKomb(effect,k){NE8.cache=null;let n=0;maps.forEach(m=>{if(m.effect!==effect)return;n++;if(k==='max')delete m.komb;else m.komb=k});try{save();renderMaps()}catch(e){}NE8.cache=null;neToast(neMaalNavn(effect)+': '+NE8_NAVN[k]+' ('+n+(n===1?' regel':' regler')+')');ne2Byg()}
/* Kontrolpanelet for et mål: Største · Læg sammen · Gang */
{const gl=ne2Kp;window.ne2Kp=function(ny){gl(ny);const n=NE2.valgt&&NE2.N.get(NE2.valgt),box=document.querySelector('#ne-kp .ne-kp-ind');if(!n||!box||n.kol!=='maal'||!n.regler.length)return;const k=neKombFor(n.effect);
 box.innerHTML='<small>Flere regler på samme mål'+(n.regler.length<2?' · virker først med mere end én regel':'')+'</small><div class="ne-seg-r"><span class="ne-seg" role="group">'+['max','sum','gang'].map(x=>'<button class="ne-k'+(k===x?' ne-paa':'')+'" data-ne8="'+x+'" data-e="'+neHtml(n.effect)+'" aria-pressed="'+(k===x)+'" title="'+neHtml(NE8_TIP[x])+'">'+NE8_NAVN[x]+'</button>').join('')+'</span><small>'+neHtml(NE8_TIP[k])+'</small></div>'}}
{const gl=ne2Saetning;window.ne2Saetning=function(n){if(n.kol==='maal'&&n.regler.length>1){const fig=NE2.N.get(n.figur),k=neKombFor(n.effect);return '<b class="ne-s-maal">'+neHtml(neMaalNavn(n.effect))+'</b>'+(fig?' på <b class="ne-s-figur">'+neHtml(fig.navn)+'</b>':'')+' styres af '+n.regler.length+' regler. De lægges sammen med <b>'+NE8_NAVN[k]+'</b>: '+neHtml(NE8_TIP[k])}return gl(n)}}
function ne8Start(){const rod=$('ne');if(!rod)return;rod.addEventListener('click',e=>{const b=e.target.closest('[data-ne8]');if(b)neSaetKomb(b.dataset.e,b.dataset.ne8)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne8Start);else setTimeout(ne8Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 8): FLERE REGLER PÅ ÉT MÅL ========== */
