/* ========== v9.61: NODE-EDITOR: OPSTILLINGER, KOLONNENAVNE DER FØLGER MED, OG SIKRING MOD EN TOM FLADE ==========
   Brugerens ønske 16. november: faste opstillinger af noderne (seks: Kolonner, Bred, Luftig, Meget luftig, Kompakt og Kæmpe, der fylder feltet ved 10 % zoom),
   kolonnenavne, der følger zoom og kan trækkes (flytter hele kolonnen), og Node-editoren var helt tom hos brugeren (kunne ikke genskabes).
   - neOpstil(id) stiller noderne op ud fra den automatiske placering (ne2Placer) og gemmer hver nodes plads i NE.pos; valget står i set.ne.opst.
   - ne61Hoveder() lægger hver kolonnes overskrift lige over kolonnens noder og skalerer den med zoom (kaldes fra neVis).
   - Sikringen: ugyldige tal i placering og zoom rettes (ne61Rens, neVis, neZoomOm), én node, der ikke kan tegnes, stopper ikke resten (ne2NodeHtml),
     og ne61Vagt() viser en besked med knapper, hvis ingen noder kan ses. */
const NE61={fejl:'',sig:'',S:1.5,HH:120};
const NE_OPST=[['kolonner','Kolonner','Én kolonne pr. slags; noderne står fra toppen med lige store mellemrum'],['bred','Bred','Lange kolonner deles i flere rækker ved siden af hinanden og spredes ud over fem felters bredde, så teksten kan læses'],['luftig','Luftig','Spredt ud over hele feltet med lige store mellemrum og mere luft end Bred'],['megetluftig','Meget luftig','Spredt ud over hele feltet med dobbelt så meget luft som før'],['kompakt','Kompakt','Alt tæt sammen'],['kaempe','Kæmpe','Spredt helt ud: fylder hele feltet, når der er zoomet ud til 10 %']];
const NE61_P={kolonner:{stak:true,gy:24,gx:1.3,bredde:true},luftig:{stak:true,gy:72,gx:2.4,wrap:true,just:true},megetluftig:{stak:true,gy:300,gx:9,wrap:true,just:true},kompakt:{stak:true,gy:8,gx:.35,wrap:true},bred:{stak:true,gy:32,gx:1.2,wrap:true,just:true,felter:5},kaempe:{fy:1.25,gx:1.3,fyld:true}};
/* --- sikring mod en tom flade --- */
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){try{return gl(n)}catch(e){NE61.fejl=String((e&&e.message)||e);try{console.error(e)}catch(x){}return '<div class="ne-node ne-n-'+neHtml(n.kol||'regel')+'" data-n="'+neHtml(n.key)+'" tabindex="0"><div class="ne-hd"><b>'+neHtml(n.navn||n.key)+'</b></div></div>'}}}
function ne61Rens(){const fb={};NE.kol.forEach(c=>fb[c.k]=c.x);let y=0;NE2.N.forEach(n=>{if(!Number.isFinite(n.x)){n.x=Number.isFinite(fb[n.kol])?fb[n.kol]:0;if(NE.pos)delete NE.pos[n.key]}if(!Number.isFinite(n.y)){n.y=y;y+=160;if(NE.pos)delete NE.pos[n.key]}})}
{const gl=ne2Placer;window.ne2Placer=function(){gl();ne61Rens()}}
{const gl=ne2Byg;window.ne2Byg=function(){try{return gl()}catch(e){NE61.fejl=String((e&&e.message)||e);try{console.error(e)}catch(x){}}}}
{const gl=neZoomOm;window.neZoomOm=function(px,py,f){if(![px,py,f].every(Number.isFinite)||f<=0)return;gl(px,py,f)}}
{const gl=neVis;window.neVis=function(){if(![NE.z,NE.x,NE.y].every(Number.isFinite)){NE.z=Number.isFinite(NE.z)&&NE.z>0?NE.z:.5;NE.x=Number.isFinite(NE.x)?NE.x:24;NE.y=Number.isFinite(NE.y)?NE.y:NE.TOP}gl();ne61Hoveder()}}
/* Tilpas giver plads til overskrifterne, der nu står over noderne og følger zoom */
{const gl=neTilpas;window.neTilpas=function(stille){gl(true);const B=neGraenser();if(B&&Number.isFinite(B.y0))NE.y=Math.round(12+(NE61.HH+16-B.y0)*NE.z);neVis();if(!stille)neGem()}}
/* --- kolonnenavnene: lige over kolonnens noder, i samme zoom, og de kan trækkes --- */
function ne61Kol(n){return n.kol}
function ne61Boks(k){let x0=Infinity,x1=-Infinity,y0=Infinity;if(NE2.N)NE2.N.forEach(n=>{if(!n.el||ne61Kol(n)!==k||!Number.isFinite(n.x)||!Number.isFinite(n.y))return;x0=Math.min(x0,n.x);x1=Math.max(x1,n.x+(n.w||n.el.offsetWidth||240));y0=Math.min(y0,n.y)});return Number.isFinite(x0)?{x0,x1,y0}:null}
function ne61Hoveder(){const s=NE.z*NE61.S;document.querySelectorAll('#ne-hoveder .ne-hoved').forEach((h,i)=>{const c=NE.kol[i];if(!c)return;const b=ne61Boks(c.k)||{x0:c.x,x1:c.x+c.w,y0:0};h.classList.remove('ne-smal','ne-mini');h.style.transformOrigin='0 0';h.style.transform='scale('+s+')';
  h.style.left=Math.round(NE.x+b.x0*NE.z)+'px';h.style.top=Math.max(6,Math.round(NE.y+(b.y0-NE61.HH)*NE.z))+'px';/* rulles kolonnens top ud af feltet, bliver navnet (og + Tilføj) stående øverst */h.style.width=Math.max(60,Math.round((b.x1-b.x0)/NE61.S))+'px'})}
/* --- opstillingerne --- */
function neOpstil(id,stille){const fl=$('ne-flade'),def=NE_OPST.find(o=>o[0]===id),P=NE61_P[id];if(!fl||!def||!P||!NE2.N)return false;if(!(fl.clientWidth>0)||fl.style.display==='none'){neToast('Skift til Noder for at bruge en opstilling.',true);return false}
 neSaetPos({});ne2Byg();/* den automatiske placering er udgangspunktet */
 const G=+NE.tema.maal.gitter||8,rund=v=>Math.round(v/G)*G,W=fl.clientWidth,HF=fl.clientHeight,gap0=+NE.tema.maal.kolonneAfstand||64,top=NE61.HH+16;
 const grupper=NE.kol.map(c=>({c,L:[...NE2.N.values()].filter(n=>n.el&&!n.parkeret&&n.kol===c.k).sort((a,b)=>a.y-b.y||a.x-b.x)})).filter(g=>g.L.length);if(!grupper.length){neToast('Der er ingen noder at stille op.',true);return false}
 const bw=n=>n.el.offsetWidth||n.w||240,bh=n=>Math.ceil((n.el.offsetHeight||n.h||120)/G)*G,x00=grupper[0].c.x,gx=gap0*P.gx,y00=Math.min(...grupper.map(g=>g.L[0].y));
 /* S = de lodrette stakke: i en stak-opstilling kan en kolonne deles i flere; ellers er hver kolonne én stak med den automatiske højde ganget op */
 const lav=(wrapH,fy,stak,gy)=>{if(stak===undefined)stak=!!P.stak;if(gy===undefined)gy=P.gy||0;const S=[];grupper.forEach((g,gi)=>{let cur=null;g.L.forEach(n=>{if(!cur||(wrapH&&cur.L.length&&cur.h+bh(n)>wrapH)){cur={g:gi,L:[],h:0,w:0};S.push(cur)}
    const y=stak?cur.h+(cur.L.length?gy:0):rund((n.y-y00)*fy);cur.L.push({n,y});cur.h=y+bh(n);cur.w=Math.max(cur.w,bw(n))})});
   let x=x00;S.forEach((s,i)=>{if(i)x+=S[i-1].g===s.g?Math.max(3*G,gx*.4):gx;s.x=x;x+=s.w});return{S,w:x-x00,h:Math.max(...S.map(s=>s.h))}};
 const zoomFor=r=>Math.min(1,(W-48)/Math.max(200,r.w+48),(HF-24)/(r.h+top));
 let R=lav(0,P.fy||1);
 if(P.wrap){let bedst={z:zoomFor(R),r:R};for(let k=2;k<=12;k++){const r=lav(R.h/k+1,1),z=zoomFor(r);if(z>bedst.z+1e-6)bedst={z,r}}R=bedst.r}
 let exJ=0;if(P.just){/* v9.66: spred stakkene ud over hele feltets bredde og højde med lige store mellemrum (kolonnernes rækkefølge er den faste fra NE.kol) */const zj=zoomFor(R),TWj=(W-48)/zj-48,THj=(HF-24)/zj-top;if(R.S.length>1&&R.w<TWj*(P.felter||1))exJ=(TWj*(P.felter||1)-R.w)/(R.S.length-1);R.S.forEach(s=>{const eg=s.L.length>1?Math.max(0,(THj-s.h)/(s.L.length-1)):0;s.L.forEach((o,j)=>{o.y+=j*eg})})}
 let ex=0;if(P.fyld){const TW=(W-48)/.1-48,TH=(HF-24)/.1-top;let fy=1;R=lav(0,1);if(R.h>TH){/* for mange noder til én kolonne pr. slags: kolonnerne deles, og luften fordeles i hver stak */R=lav(TH,1,true,3*G);R.S.forEach(s=>{const eg=s.L.length>1?Math.max(0,(TH-s.h)/(s.L.length-1)):0;s.L.forEach((o,j)=>{o.y+=j*eg})})}
  else for(let i=0;i<5&&R.h>0;i++){const ny=Math.max(1,fy*TH/R.h);if(Math.abs(ny-fy)<fy*.002)break;fy=ny;R=lav(0,fy)}if(R.S.length>1&&R.w<TW)ex=(TW-R.w)/(R.S.length-1)}
 const pos={};R.S.forEach((s,i)=>s.L.forEach(o=>{pos[o.n.key]=[rund(s.x+i*(ex+exJ)),rund(o.y)]}));
 neSaetPos(pos);set.ne=set.ne||{};set.ne.opst=id;ne2Byg();
 const B=neGraenser()||{x0:x00,x1:x00+R.w,y0:0},hh=Math.max(...[...NE2.N.values()].filter(n=>n.el).map(n=>n.y+bh(n)))-B.y0,z=Math.max(NE.ZMIN,Math.min(1,(W-48)/Math.max(200,B.x1-B.x0),(P.stak&&!P.bredde)||P.fyld?(HF-24)/(hh+top):1));/* kolonne-opstillingerne tilpasses i bredden (teksten kan læses, og man ruller ned); de andre vises hele */
 NE.tilpas=false;NE.z=z;NE.x=Math.round((W-(B.x1-B.x0)*z)/2-B.x0*z);NE.y=Math.round(12+(top-B.y0)*z);if(P.fyld){NE.z=.1;NE.x=Math.round((W-(B.x1-B.x0)*.1)/2-B.x0*.1);NE.y=Math.round(12+(top-B.y0)*.1)}if(P.felter){/* fem felter bred: zoom efter højden, og start ved venstre kant (Lydkilde) */NE.z=Math.max(NE.ZMIN,Math.min(1,(HF-24)/(hh+top)));NE.x=Math.round(24-B.x0*NE.z);NE.y=Math.round(12+(top-B.y0)*NE.z)}neVis();neGem();const v=$('ne61-opst');if(v)v.value=id;
 if(!stille)neToast('Opstilling: '+def[1]+' · '+Object.keys(pos).length+' noder · zoom '+Math.round(NE.z*100)+' %.'+(P.felter?' Den er '+P.felter+' felter bred: rul sidelæns, eller zoom ud for at se det hele.':'')+' Placér giver den automatiske opstilling tilbage.',true);return true}
/* v9.62: to opstillinger, brugeren selv gemmer (set.ne.egne[1] og [2]: hver nodes plads og zoom) */
function ne62Valg(){const v=$('ne61-opst');if(!v)return;const E=(set.ne&&set.ne.egne)||{};[1,2].forEach(i=>{const o=v.querySelector('option[value="egen'+i+'"]');if(o){o.disabled=!E[i];o.textContent='Min opstilling '+i+(E[i]?'':' (tom)')}})}
function neOpstilGem(i){const fl=$('ne-flade'),v=$('ne61-opst');if(!NE2.N||!fl||!(fl.clientWidth>0)){neToast('Skift til Noder for at gemme en opstilling.',true);if(v)v.value='';return false}
 if(set.ne&&set.ne.egne&&set.ne.egne[i]&&!(confirm('Min opstilling '+i+' findes allerede. Vil du gemme den nye oven i den?')&&confirm('Er du helt sikker? Den gamle Min opstilling '+i+' kan ikke hentes igen.'))){if(v)v.value=(set.ne&&set.ne.opst)||'';neToast('Min opstilling '+i+' er ikke ændret.',true);return false}
 const pos={};NE2.N.forEach(n=>{if(n.el&&Number.isFinite(n.x)&&Number.isFinite(n.y))pos[n.key]=[n.x,n.y]});set.ne=set.ne||{};set.ne.egne=set.ne.egne||{};set.ne.egne[i]={pos,z:NE.z,x:NE.x,y:NE.y};set.ne.opst='egen'+i;NE.pos=Object.assign({},pos);NE.tilpas=false;neGem();ne62Valg();if(v)v.value='egen'+i;
 neToast('Gemt som Min opstilling '+i+': '+Object.keys(pos).length+' noders plads og zoom '+Math.round(NE.z*100)+' %.',true);return true}
function neOpstilEgen(i){const E=set.ne&&set.ne.egne&&set.ne.egne[i],v=$('ne61-opst');if(!E){neToast('Min opstilling '+i+' er tom. Flyt noderne, og vælg Gem som Min opstilling '+i+'.',true);if(v)v.value=(set.ne&&set.ne.opst)||'';return false}
 neSaetPos(Object.assign({},E.pos));set.ne.opst='egen'+i;NE.tilpas=false;if([E.z,E.x,E.y].every(Number.isFinite)){NE.z=Math.max(NE.ZMIN,Math.min(NE.ZMAX,E.z));NE.x=E.x;NE.y=E.y}NE2.sig='';ne2Byg();neVis();neGem();if(v)v.value='egen'+i;
 const ny=[...NE2.N.values()].filter(n=>n.el&&!E.pos[n.key]).length;neToast('Min opstilling '+i+(ny?' · '+ny+(ny===1?' ny node har':' nye noder har')+' fået den automatiske plads':''),true);return true}
{const gl=neAutoPlacer;window.neAutoPlacer=function(){if(set.ne)delete set.ne.opst;const v=$('ne61-opst');if(v)v.value='';gl()}}
/* --- beskeden, når ingen noder kan ses --- */
function ne61Vagt(){const fl=$('ne-flade'),rod=$('ne');if(!fl||!rod||!NE2.N||!NE2.byg)return;let b=$('ne61-tom');const fremme=fl.clientWidth>0&&fl.clientHeight>0&&!rod.classList.contains('mx-til')&&fl.style.display!=='none';if(!fremme||NE2.traek||NE.traek){if(b)b.hidden=true;return}
 const N=[...NE2.N.values()],E=N.filter(n=>n.el&&n.el.isConnected),r=fl.getBoundingClientRect();let ses=false;for(const n of E){const q=n.el.getBoundingClientRect();if(q.width>0&&q.right>r.left&&q.left<r.right&&q.bottom>r.top&&q.top<r.bottom){ses=true;break}}
 const tekst=N.length&&!E.length?'Noderne kunne ikke tegnes.':(E.length&&!ses?'Ingen af de '+E.length+' noder kan ses lige nu.':'');if(!tekst){if(b)b.hidden=true;NE61.sig='';return}
 if(!b){b=document.createElement('div');b.id='ne61-tom';b.className='ne61-tom';b.setAttribute('role','alert');fl.appendChild(b);b.addEventListener('pointerdown',e=>e.stopPropagation());
  b.addEventListener('click',e=>{const k=e.target.closest('[data-ne61]');if(!k)return;NE61.fejl='';if(k.dataset.ne61==='op'){neAutoPlacer()}neTilpas();NE61.sig='';setTimeout(ne61Vagt,300)})}
 const sig=tekst+'|'+NE61.fejl;b.hidden=false;if(sig===NE61.sig)return;NE61.sig=sig;
 b.innerHTML='<b>'+neHtml(tekst)+'</b><span><button class="ne-k" data-ne61="vis" title="Zoom og flyt, så alle noder kan ses">Vis alle noder</button><button class="ne-k" data-ne61="op" title="Glem de pladser, noderne er flyttet til, og stil dem op automatisk igen">Stil noderne op igen</button></span>'+(NE61.fejl?'<small>Fejl: '+neHtml(NE61.fejl)+'</small>':'')}
function ne61Start(){const hv=$('ne-hoveder'),vl=document.querySelector('#ne .ne-vlinje'),tp=vl&&vl.querySelector('[data-ne="tilpas"]');if(!hv||!tp||!NE.byg||!NE2.byg){setTimeout(ne61Start,300);return}
 const lbl=document.createElement('label');lbl.className='ne61-valg';lbl.title='Opstilling: stil alle noder op på én af seks måder. Også de noder, du selv har flyttet, flyttes. Placér giver den automatiske opstilling tilbage.';
 lbl.innerHTML='<select id="ne61-opst" aria-label="Opstilling af noderne"><option value="">Opstilling ▾</option>'+NE_OPST.map(o=>'<option value="'+o[0]+'" title="'+neHtml(o[2])+'">'+neHtml(o[1])+'</option>').join('')+GIT_OPST.map(o=>'<option value="'+o[0]+'" title="'+neHtml(o[2])+'">'+neHtml(o[1])+'</option>').join('')+'<option value="egen1">Min opstilling 1</option><option value="egen2">Min opstilling 2</option><option value="gem1">Gem som Min opstilling 1</option><option value="gem2">Gem som Min opstilling 2</option></select>';tp.insertAdjacentElement('afterend',lbl);auStart(lbl);
 const v=$('ne61-opst');v.value=(set.ne&&set.ne.opst&&(NE61_P[set.ne.opst]||/^egen[12]$/.test(set.ne.opst)||/^git\d$/.test(set.ne.opst)))?set.ne.opst:'';v.addEventListener('change',e=>{const id=e.target.value;if(/^gem[12]$/.test(id))neOpstilGem(+id.slice(3));else if(/^egen[12]$/.test(id))neOpstilEgen(+id.slice(4));else if(/^git\d$/.test(id))gitOpstil(id);else if(id)neOpstil(id);else neAutoPlacer()});ne62Valg();
 hv.querySelectorAll('.ne-hnavn').forEach(h=>{h.title='Træk for at flytte hele kolonnen'});
 hv.addEventListener('pointerdown',e=>{const hn=e.target.closest('.ne-hnavn');if(!hn||e.button>0)return;const k=hn.closest('.ne-hoved').dataset.kol,L=[...NE2.N.values()].filter(n=>n.el&&ne61Kol(n)===k);e.preventDefault();e.stopPropagation();
  if(!L.length){neToast('Kolonnen '+hn.textContent+' har ingen noder at flytte.',true);return}
  const d={px:e.clientX,py:e.clientY,L:L.map(n=>({n,x:n.x,y:n.y})),flyt:false},G=+NE.tema.maal.gitter||8;
  const mv=ev=>{const dx=Math.round((ev.clientX-d.px)/NE.z/G)*G,dy=Math.round((ev.clientY-d.py)/NE.z/G)*G;if(!d.flyt&&!dx&&!dy)return;if(!d.flyt){d.flyt=true;NE2.laas=true}d.L.forEach(o=>{o.n.x=o.x+dx;o.n.y=o.y+dy;o.n.el.style.left=o.n.x+'px';o.n.el.style.top=o.n.y+'px'});ne61Hoveder();try{neLinjerTegn()}catch(x){}};
  const op=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',op);removeEventListener('pointercancel',op);if(!d.flyt)return;NE2.laas=false;NE.pos=NE.pos||{};d.L.forEach(o=>{NE.pos[o.n.key]=[o.n.x,o.n.y];o.n.flyttet=true});NE.tilpas=false;neGem();neVis();neToast('Kolonnen '+hn.textContent+' er flyttet ('+d.L.length+(d.L.length===1?' node':' noder')+'). Placér stiller alt tilbage.',true)};
  addEventListener('pointermove',mv);addEventListener('pointerup',op);addEventListener('pointercancel',op)});
 neVis();setInterval(ne61Vagt,1000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ne61Start,600));else setTimeout(ne61Start,600);
/* ========== SLUT: NODE-EDITOR: OPSTILLINGER, KOLONNENAVNE DER FØLGER MED, OG SIKRING MOD EN TOM FLADE ========== */
