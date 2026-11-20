/* ========== v9.31: NODE-EDITOR (TRIN 13): ZOOM UD, KUN VALGT KÆDE, DÆMP OG TASTATUR ==========
   Trin 13 af 16 (papirets forløb 3 og 4 og afsnit 10).
   - Zoom ud: under 20 % (temaets zoom.heltUdeUnder) bliver noderne til lys uden tekst i kolonnens farve (fagudtryk: level of detail). Det, der slår til
     lige nu, gløder. Ved 20 % og derover vises alt som før.
   - Kun valgt kæde (fagudtryk: isolate): alt uden for den valgte kæde dæmpes kraftigt, så kun kæden fra lydkilde til scene lyser. Tryk igen eller Esc.
   - Dæmp (vores navn): det, der ikke slår til lige nu (tallet under 0,05), bliver svagt, så kun det, der måler noget, lyser. Huskes i set.ne.daemp.
   - Tastatur (som i Dublet og Routing-overblik), når lærredet eller en node har fokus: Home/End vælger den første/sidste node i kolonnen (uden valg: den
     første node), ↑ ↓ i en kolonne, ← → skifter kolonne (den node, der står nærmest i højden), [ ] eller PgUp/PgDn forrige/næste regel.
     Enter på et lydtræk vælger det som kilde; gå til et mål og tryk Enter: en ny regel (på en figur: menuen med figurens mål). Delete sletter en regel
     (fra trin 5). Esc afbryder kilden, slår Kun valgt kæde fra eller fjerner valget. Uden valgt node flytter piletasterne lærredet som før;
     Shift + piletast flytter altid lærredet. */
const NE13={iso:false,fra:null,t:0};
const ne13Daemp=()=>!!(set.ne&&set.ne.daemp);
const ne13Graense=()=>+((NE.tema&&NE.tema.zoom&&NE.tema.zoom.heltUdeUnder)||.2);
/* Zoom ud: lys uden tekst */
function ne13Lod(){const r=$('ne');if(!r)return;const lod=false/* v9.38: noderne bliver ikke til lys */;if(r.classList.contains('ne-lod')!==lod){r.classList.toggle('ne-lod',lod);if(lod)neToastLive('Under '+Math.round(ne13Graense()*100)+' %: noderne er lys uden tekst')}}
{const gl=neVis;window.neVis=function(){const r=gl.apply(this,arguments);ne13Lod();return r}}
/* Linjernes lysstyrke: dæmpet uden for kæden og (med Dæmp) når de ikke slår til */
function ne13Alfa(l,v){const a=.28+.72*Math.min(1,v);if(NE13.iso&&NE2.kaede)return .04;if(ne13Daemp()&&v<.05)return .06;return a}
/* Kun valgt kæde: noderne uden for kæden dæmpes */
function ne13Iso(){const K=NE13.iso&&NE2.kaede;NE2.N.forEach(n=>{if(n.el)n.el.classList.toggle('ne-uden-for',!!K&&!K.has(n.key))});document.querySelectorAll('#ne [data-ne13="iso"]').forEach(b=>{b.classList.toggle('ne-paa',NE13.iso);b.setAttribute('aria-pressed',NE13.iso)})}
{const gl=ne2Kaede;window.ne2Kaede=function(){gl();ne13Iso()}}
function neKunKaede(on){NE13.iso=on==null?!NE13.iso:!!on;if(NE13.iso&&!NE2.valgt)neToast('Kun valgt kæde er slået til: vælg en node, så dæmpes alt andet',true);else neToast(NE13.iso?'Kun valgt kæde: alt andet er dæmpet · Esc slår det fra':'Kun valgt kæde er slået fra',true);ne13Iso();neLinjerTegn()}
function neSaetDaemp(on){set.ne=set.ne||{};if(on)set.ne.daemp=true;else delete set.ne.daemp;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}
 document.querySelectorAll('#ne [data-ne13="daemp"]').forEach(b=>{b.classList.toggle('ne-paa',!!on);b.setAttribute('aria-pressed',!!on)});if(!on)NE2.N.forEach(n=>{if(n.el)n.el.classList.remove('ne-stille')});neToast(on?'Dæmp: kun det, der slår til lige nu, lyser':'Dæmp er slået fra',true);neLinjerTegn()}
/* Aktivitet pr. node (tallet lige nu, eller det største tal på dens links) */
function ne13Akt(){const A={};NE2.L.forEach(l=>{const v=+l.vNu||0;if(v>(A[l.fra]||0))A[l.fra]=v;if(v>(A[l.til]||0))A[l.til]=v});NE2.N.forEach(n=>{const v=Math.max(+n.vNu||0,+n.udNu||0);if(v>(A[n.key]||0))A[n.key]=v});return A}
{const gl=ne3Tik;window.ne3Tik=function(t){gl(t);const lod=false,d=ne13Daemp();if((!lod&&!d)||t-NE13.t<120)return;NE13.t=t;const A=ne13Akt();
 NE2.N.forEach(n=>{if(!n.el)return;const a=A[n.key]||0;if(lod)n.el.classList.toggle('ne-lys',a>.3);n.el.classList.toggle('ne-stille',d&&a<.05&&n.key!==NE2.valgt)})}}
/* Tastatur */
function ne13KolAf(n){let k=0;NE.kol.forEach((c,i)=>{if(n.x>=c.x-40)k=i});return k}
function ne13Kol(i){return [...NE2.N.values()].filter(n=>n.el&&n.el.offsetHeight>0&&ne13KolAf(n)===i).sort((a,b)=>a.y-b.y||a.x-b.x)}
function ne13Gaa(n){if(!n)return;neVaelg(n.key);const fl=$('ne-flade'),z=NE.z,W=fl.clientWidth,H=fl.clientHeight,top=96,sx=NE.x+n.x*z,sy=NE.y+n.y*z,w=(n.w||320)*z,h=(n.h||120)*z;let flyt=false;
 if(sx<20){NE.x+=20-sx;flyt=true}else if(sx+w>W-20){NE.x-=sx+w-(W-20);flyt=true}if(sy<top){NE.y+=top-sy;flyt=true}else if(sy+h>H-20){NE.y-=Math.min(sy-top,sy+h-(H-20));flyt=true}
 if(flyt){NE.tilpas=false;neVis();neGem()}try{n.el.focus({preventScroll:true})}catch(e){}ne13Status()}
function ne13Status(){const n=NE2.valgt&&NE2.N.get(NE2.valgt);if(!n||!NE13.fra)return;const b=NE13.fra;if(n.kol==='figur'||n.kol==='maal')neToastLive('Kilde: '+neLtNavn(b)+' · Enter laver en regel til '+(n.kol==='maal'?neMaalNavn(n.effect):n.navn));}
function ne13Taster(e){const k=e.key,tg=e.target;if(/INPUT|TEXTAREA|SELECT|BUTTON/.test(tg.tagName)||e.ctrlKey||e.metaKey||e.altKey)return;if(!(tg.id==='ne-flade'||tg.classList.contains('ne-node')))return;
 const N=NE2.N,n=NE2.valgt&&N.get(NE2.valgt),stop=()=>{e.preventDefault();e.stopImmediatePropagation()};
 if(k==='Escape'){if(NE13.fra){stop();NE13.fra=null;neToast('Kilden er afbrudt',true);return}if(NE13.iso){stop();neKunKaede(false);return}return}
 if(k.startsWith('Arrow')&&(e.shiftKey||!n))return;/* lærredet flyttes som før */
 const kols=NE.kol.map((c,i)=>i).filter(i=>ne13Kol(i).length);
 if(k==='Home'||k==='End'){stop();const i=n?ne13KolAf(n):kols[0];const L=ne13Kol(i);ne13Gaa(k==='Home'?L[0]:L[L.length-1]);return}
 if(!n&&(k===']'||k==='['||k==='PageDown'||k==='PageUp'||k==='Enter'))return;
 if(k==='ArrowUp'||k==='ArrowDown'){stop();const L=ne13Kol(ne13KolAf(n)),j=L.indexOf(n),ny=L[j+(k==='ArrowDown'?1:-1)];if(ny)ne13Gaa(ny);else neToastLive(k==='ArrowDown'?'Den sidste i kolonnen':'Den første i kolonnen');return}
 if(k==='ArrowLeft'||k==='ArrowRight'){stop();const i=ne13KolAf(n),p=kols.indexOf(i),q=kols[p+(k==='ArrowRight'?1:-1)];if(q==null){neToastLive('Der er ikke flere kolonner den vej');return}const L=ne13Kol(q),my=n.y+(n.h||0)/2;ne13Gaa(L.reduce((b,x)=>Math.abs(x.y+(x.h||0)/2-my)<Math.abs(b.y+(b.h||0)/2-my)?x:b,L[0]));return}
 if(k===']'||k==='['||k==='PageDown'||k==='PageUp'){stop();const R=[...N.values()].filter(x=>x.kol==='regel'&&x.el).sort((a,b)=>a.y-b.y||a.x-b.x),j=R.indexOf(n),f=k===']'||k==='PageDown'?1:-1;const ny=j<0?R[f>0?0:R.length-1]:R[j+f];if(ny)ne13Gaa(ny);return}
 if(k==='Enter'){if(n.kol==='lydtraek'&&!n.parkeret){stop();NE13.fra=n.band;neToast('Kilde: '+neLtNavn(n.band)+'. Gå til en figur eller et mål med piletasterne, og tryk Enter. Esc afbryder.',true);return}
  if(NE13.fra&&(n.kol==='maal'||n.kol==='figur')){stop();const band=NE13.fra;NE13.fra=null;if(n.kol==='maal'){ne5Ny(band,n.effect,null,null);return}const fl=$('ne-flade').getBoundingClientRect(),r=n.el.getBoundingClientRect();ne5Menu(Math.max(10,r.left-fl.left),Math.max(10,r.bottom-fl.top),'Mål på '+n.navn+' · fra '+neLtNavn(band),ne5Maal(n.key),v=>ne5Ny(band,v,null,null),true);return}}}
/* Værktøjslinjen og Ctrl+K */
{const gl=neKpPunkter;window.neKpPunkter=function(L){gl(L);if(!NE.byg)return;const vis=fn=>()=>{try{fgVaelg('lyd','w33',true);fgVisHost('lyd')}catch(e){}setTimeout(fn,60)};
 L.push({n:'Kun valgt kæde (til/fra)',kat:'Knapper · Node-editor',fn:vis(()=>neKunKaede()),ikon:'◎'});L.push({n:'Dæmp (til/fra)',kat:'Knapper · Node-editor',fn:vis(()=>neSaetDaemp(!ne13Daemp())),ikon:'◐'})}}
function ne13Start(){const rod=$('ne'),fl=$('ne-flade'),bg=$('ne-bg-v');if(!rod||!fl||!bg||!NE.byg){setTimeout(ne13Start,300);return}
 const tr=document.querySelector('#ne .ne-trin');if(tr)tr.textContent='Node-editoren · docking og fuld skærm';
 if(!rod.querySelector('[data-ne13="iso"]'))bg.closest('.ne-vgrp').insertAdjacentHTML('afterend','<button class="ne-k'+(ne13Daemp()?' ne-paa':'')+'" data-ne13="daemp" aria-pressed="'+ne13Daemp()+'" title="Dæmp (vores navn): det, der ikke slår til lige nu, bliver svagt, så kun det, der måler noget, lyser.">Dæmp</button><button class="ne-k" data-ne13="iso" aria-pressed="false" title="Kun valgt kæde (fagudtryk: isolate): alt uden for den valgte kæde dæmpes. Tryk igen eller Esc for at slå det fra.">Kun valgt kæde</button>');
 rod.addEventListener('click',e=>{const b=e.target.closest('[data-ne13]');if(!b)return;if(b.dataset.ne13==='iso')neKunKaede();else neSaetDaemp(!ne13Daemp())});
 fl.addEventListener('keydown',ne13Taster,true);ne13Lod()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ne13Start,0));else setTimeout(ne13Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 13): ZOOM UD, KUN VALGT KÆDE, DÆMP OG TASTATUR ========== */
