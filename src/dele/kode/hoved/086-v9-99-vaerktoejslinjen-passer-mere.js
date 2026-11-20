/* ========== v9.99: VÆRKTØJSLINJEN PASSER (⋯ MERE) ==========
   Brugerens P8.14 punkt 3f: værktøjslinjen over matrixen og Node-editoren (.ne-vlinje, cirka 2 500 px) skal kunne være der uden at rulle ved 1920 og 2560 px.
   Det, der ikke er plads til, flyttes bag knappen ⋯ Mere (fagudtryk: overflow menu) i en fast rækkefølge: de sjældne først (Baggrund, Dæmp, Kun valgt kæde,
   Opstilling, Visning, Automatik, Normalisering, Samlet styrke, Placér, Tilpas, zoom), så de sidste af værktøjerne (Kort, Gem som regel-sæt, Tilfældigt, Lav show),
   til sidst Gentag og Fortryd. Elementerne flyttes (ikke kopieres), så deres lyttere virker; en skjult pladsholder husker, hvor de kom fra, så de kan komme tilbage,
   når der bliver plads (ResizeObserver på linjen, og efter Noder · Matrix). Knappen viser, hvor mange der ligger bag den. */
const VL={pop:null,knap:null,travl:false,obs:null};
function vlLinje(){return document.querySelector('#ne .ne-vlinje')}
function vlNavn(el){const t=(el.textContent||'').trim();if(el.id==='ne89-vaerk')return 'værktøjer';if(el.classList.contains('ne41-valg'))return 'Visning';if(el.classList.contains('ne61-valg'))return 'Opstilling';if(el.classList.contains('ne-vgrp-master'))return 'Samlet styrke';if(el.classList.contains('ne-zoom')||t==='−'||t==='+')return 'zoom';if(/^Normalisering/.test(t))return 'Normalisering';if(/^Baggrund/.test(t))return 'Baggrund';return t.slice(0,24)}
/* rækkefølgen: det, der flyttes først, står først */
const VL_FOERST=['Baggrund','Dæmp','Kun valgt kæde','Opstilling','Visning','Automatik','Normalisering','Samlet styrke','Placér','Tilpas','zoom'];
function vlKandidater(vl){const L=[...vl.children].filter(c=>c!==VL.knap&&c!==VL.pop&&!c.classList.contains('ne-luft')&&!c.classList.contains('ne-titel')&&!c.classList.contains('ne-trin')&&!c.classList.contains('mx-skift')&&!c.hasAttribute('data-vlph'));
 const navn=c=>vlNavn(c),pri=c=>{const n=navn(c),i=VL_FOERST.indexOf(n);if(i>=0)return i;if(/Fortryd/.test(n))return 90;if(/Gentag/.test(n))return 89;return 50};
 return L.filter(c=>c.offsetParent!==null).sort((a,b)=>pri(a)-pri(b))}
function vlTilbage(){const vl=vlLinje(),p=VL.pop;if(!vl||!p)return;[...p.children].forEach(el=>{const ph=vl.querySelector('[data-vlph="'+el.dataset.vlid+'"]');if(ph){ph.replaceWith(el)}else vl.insertBefore(el,VL.knap);delete el.dataset.vlid});
 /* de enkelte knapper i værktøjs-gruppen (#ne89-vaerk) */const g=$('ne89-vaerk');if(g)[...p.querySelectorAll('[data-vlph-g]')].forEach(()=>{})}
let VL_ID=0;
function vlFlyt(el){const vl=vlLinje(),p=VL.pop;const id=String(++VL_ID);el.dataset.vlid=id;const ph=document.createElement('i');ph.hidden=true;ph.setAttribute('data-vlph',id);el.replaceWith(ph);p.appendChild(el)}
function vlPas(){const vl=vlLinje();if(!vl||VL.travl)return;VL.travl=true;try{vlByg();vlTilbage();
 const plads=()=>vl.scrollWidth<=vl.clientWidth+1;if(plads()&&!VL.pop.children.length){VL.knap.hidden=true;return}
 VL.knap.hidden=false;const K=vlKandidater(vl);let i=0;while(!plads()&&i<K.length){const c=K[i++];if(c.id==='ne89-vaerk'){/* værktøjerne: de sidste knapper først, Foreslå regler bliver */const kn=[...c.querySelectorAll(':scope > .ne-k')].reverse().filter(b=>!/Foreslå/.test(b.textContent));for(const b of kn){if(plads())break;vlFlyt(b)}}else if(vlNavn(c)==='zoom'){[...vl.children].filter(x=>vlNavn(x)==='zoom'&&x.offsetParent).forEach(x=>vlFlyt(x))}else vlFlyt(c)}
 const n=VL.pop.children.length;if(!n){VL.knap.hidden=true;vlLuk()}else{VL.knap.textContent='⋯ Mere ('+n+')';VL.knap.title=n+(n===1?' knap':' knapper')+' er lagt herind, fordi der ikke er plads i linjen: '+[...VL.pop.children].map(x=>(x.textContent||'').trim().split('\n')[0].slice(0,20)).join(', ')}}finally{VL.wSidst=vl.clientWidth;VL.nSidst=vl.children.length;VL.travl=false}}
function vlByg(){const vl=vlLinje();if(!vl||VL.knap)return;const k=document.createElement('button');k.className='ne-k ne-vl-mere';k.id='ne-vl-mere';k.textContent='⋯ Mere';k.setAttribute('aria-haspopup','true');k.setAttribute('aria-expanded','false');k.hidden=true;vl.appendChild(k);VL.knap=k;
 const p=document.createElement('div');p.id='ne-vl-pop';p.className='ne-vl-pop';p.hidden=true;p.setAttribute('role','menu');vl.appendChild(p);VL.pop=p;/* inde i linjen, så knappernes lyttere (de sidder på .ne-vlinje) og .ne-stilen virker */
 k.addEventListener('click',e=>{e.stopPropagation();if(p.hidden)vlAabn();else vlLuk()});
 document.addEventListener('pointerdown',e=>{if(p.hidden)return;if(e.target.closest('#ne-vl-pop,#ne-vl-mere,.ne89-menu,.ne-menu,#ne65-pan'))return;vlLuk()},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!p.hidden){vlLuk();e.stopPropagation()}},true);
 try{VL.obs=new ResizeObserver(()=>vlTjek());VL.obs.observe(vl)}catch(e){}
 try{new MutationObserver(()=>vlTjek()).observe(vl,{childList:true})}catch(e){}}
/* kun når der er brug for det (ellers kalder vores egne flytninger observatørerne igen og igen): linjen er for smal, eller den er blevet bredere, siden knapper blev lagt bag ⋯ */
function vlTjek(){const vl=vlLinje();if(!vl||VL.travl||!VL.pop)return;const w=vl.clientWidth;if(!w)return;/* v9.103: zonen er væk eller midt i et træk */const over=VL.pop.hidden&&vl.scrollWidth>w+1,bred=VL.pop.children.length&&w>(VL.wSidst||0)+40,nyt=vl.children.length!==VL.nSidst;if(!(over||bred||nyt))return;if(VL.raf)return;VL.raf=requestAnimationFrame(()=>{VL.raf=0;const v=vlLinje();if(v&&v.clientWidth)vlPas()})}
function vlAabn(){const k=VL.knap,p=VL.pop;if(!k||!p)return;const r=k.getBoundingClientRect();p.style.left='0px';p.style.top='0px';p.hidden=false;const o=p.getBoundingClientRect();/* zonen kan flytte nulpunktet for position:fixed (som v9.53) */p.style.left=(Math.max(8,Math.min(innerWidth-330,r.right-320))-o.left)+'px';p.style.top=(r.bottom+6-o.top)+'px';k.setAttribute('aria-expanded','true')}
function vlLuk(){const k=VL.knap,p=VL.pop;if(!k||!p)return;p.hidden=true;k.setAttribute('aria-expanded','false')}
{const gl=mxSaet;window.mxSaet=function(){const r=gl.apply(this,arguments);setTimeout(vlPas,60);return r}}
function vlStart(){if(!vlLinje()||!NE.byg){setTimeout(vlStart,300);return}vlPas();setTimeout(vlPas,1200);setTimeout(vlPas,2500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(vlStart,0));else setTimeout(vlStart,0);
/* ========== SLUT: VÆRKTØJSLINJEN PASSER (⋯ MERE) ========== */

