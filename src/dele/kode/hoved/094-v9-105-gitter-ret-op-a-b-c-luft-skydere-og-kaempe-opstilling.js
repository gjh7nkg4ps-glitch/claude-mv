/* ========== v9.105: GITTER: RET OP, A/B/C, LUFT-SKYDERE OG KÆMPE OPSTILLINGER ==========
   Brugerens P8.12 (skitser) og besked 19. november. Årsagen til rodet før (målt med Pigernes show):
   (1) hver kolonne blev stablet for sig fra toppen med fast luft (24 px), så Regel-kolonnen blev 5 900 px høj, mens Lydkilde, FFT og Analyse lå øverst
       i en klump; Lydtræk, Figur og Mål fik hver sin plads ud fra deres reglers gennemsnit, så de bredte sig ned langs Regel-kolonnen;
   (2) de pladser, man selv havde trukket noder til, lå i set.ne.pos, fælles for alle shows, og blev aldrig rettet op; en nøgle som
       r:kick|dHop|0 passer også i et andet show, så en node kunne stå langt ude i et show, hvor den aldrig var flyttet;
   (3) Tilpas regnede alle noder med, også de flyttede, så én node langt ude gjorde resten bittesmå.
   Nu: noderne står i faste kolonner (NE.kol, Lydkilde → FFT → Analyse → Lydtræk → Regel → Figur → Mål → Scene) med lige stor luft vandret.
   Ret op (gitRetOp): rammen er de yderste noder (de flyttes ikke); alle andre fordeles i rammen efter modellen (gitLaeg):
   A = hver kolonne fylder hele højden; B = ét fælles rækkegitter, kolonnerne centreret; C (standard) = som A, men luften er højst 2 × den
   tætteste kolonnes luft, og kolonnen er centreret. Valgfrit: del lange kolonner i to stakke (fra som standard).
   Skyderne Lodret og Vandret (40–150 %) strækker rammen fra midten; noderne følger med, mens man trækker. Standard-opstillingen (Placér, og første
   gang et show vises) er et gitter, hvor den tætteste kolonne har sin naturlige højde, og bredden følger feltets form × 1,35 (brugerens ønske:
   30–40 % bredere end skitsen); Tilpas viser det hele. Tre kæmpe opstillinger: Gitter · Stor (2×), Kæmpe (4×), Enorm (8×).
   Pladserne ligger nu i showet (scene.ne.pos; NE.pos er det samme objekt) sammen med skyderne (scene.ne.git); set.ne.pos flyttes over én gang.
   Ctrl+Z dækker Ret op, skyderne og træk (feNe/feGendan). */
const GIT={gammel:false,gemT:0};
const GIT_OPST=[['git2','Gitter · Stor (2×)','Gitteret med dobbelt så meget luft i begge retninger'],['git4','Gitter · Kæmpe (4×)','Gitteret med fire gange så meget luft'],['git8','Gitter · Enorm (8×)','Gitteret med otte gange så meget luft']];
const GIT_MODEL={C:'C · fyld højden, højst 2 × luft',A:'A · fyld hele højden',B:'B · fælles rækker'};
function gitInd(){if(typeof scene==='undefined'||!scene)return{model:'C',lod:100,vand:100,del:false};scene.ne=scene.ne||{};const g=scene.ne.git=(scene.ne.git&&typeof scene.ne.git==='object')?scene.ne.git:{};if(!/^[ABC]$/.test(g.model))g.model='C';g.lod=Math.max(40,Math.min(150,+g.lod||100));g.vand=Math.max(40,Math.min(150,+g.vand||100));g.del=!!g.del;if(g.ramme&&!['cx','cy','w','h'].every(k=>Number.isFinite(g.ramme[k])))delete g.ramme;return g}
/* NE.pos og scene.ne.pos er det samme objekt, så pladserne følger showet */
function neSaetPos(p){NE.pos=(p&&typeof p==='object')?p:{};if(typeof scene!=='undefined'&&scene){scene.ne=scene.ne||{};scene.ne.pos=NE.pos}}
function gitSkift(){return typeof scene!=='undefined'&&!!scene&&(!scene.ne||scene.ne.pos!==NE.pos)}
function gitSync(){if(typeof scene==='undefined'||!scene)return;scene.ne=scene.ne||{};if(!scene.ne.pos||typeof scene.ne.pos!=='object'||Array.isArray(scene.ne.pos))scene.ne.pos={};if(NE.pos!==scene.ne.pos){NE.pos=scene.ne.pos;NE2.sig=''}}
function gitGem(){clearTimeout(GIT.gemT);GIT.gemT=setTimeout(()=>{try{save()}catch(e){}},400)}
function gitPosSnap(p){const u={};Object.keys(p||{}).filter(k=>!/^d:/.test(k)).sort().forEach(k=>{const v=p[k];if(v&&Number.isFinite(v[0])&&Number.isFinite(v[1]))u[k]=[v[0],v[1]]});return Object.keys(u).length?u:0}
const gitH=n=>{const h=(n.el&&n.el.offsetHeight)||n.h||0;return h>0?Math.ceil(h/8)*8:(n.kol==='analyse'?200:n.kol==='scene'?320:128)};
const gitB=n=>(n.el&&n.el.offsetWidth)||n.w||((NE.kol.find(c=>c.k===n.kol)||{}).w)||320;
/* kolonnerne i NE.kol-rækkefølge; rækkefølgen inde i kolonnen følger den automatiske placering (n.ay: Figur → mål eller D2), ellers hvor noden står nu */
function gitKol(){if(!NE2.N)return[];return NE.kol.map(c=>({c,L:[...NE2.N.values()].filter(n=>n.el&&n.kol===c.k).sort((a,b)=>(Number.isFinite(a.ay)?a.ay:a.y)-(Number.isFinite(b.ay)?b.ay:b.y)||a.x-b.x||String(a.key).localeCompare(String(b.key)))})).filter(g=>g.L.length)}
function gitRamme(){const N=[...(NE2.N||new Map()).values()].filter(n=>n.el&&Number.isFinite(n.x)&&Number.isFinite(n.y));if(!N.length)return null;return{x0:Math.min(...N.map(n=>n.x)),x1:Math.max(...N.map(n=>n.x+gitB(n))),y0:Math.min(...N.map(n=>n.y)),y1:Math.max(...N.map(n=>n.y+gitH(n)))}}
function gitRammeNu(g){const r=g.ramme;return{x0:r.cx-r.w*g.vand/200,x1:r.cx+r.w*g.vand/200,y0:r.cy-r.h*g.lod/200,y1:r.cy+r.h*g.lod/200}}
/* lægger noderne i gitteret inde i rammen og skriver pladserne i NE.pos; bygger ikke noderne om */
function gitLaeg(ramme,g){g=g||gitInd();const grp=gitKol();if(!grp.length||!ramme)return false;const G=8,M=3*G,rund=v=>Math.round(v/G)*G,H=Math.max(1,ramme.y1-ramme.y0);
 const stakke=[];grp.forEach(gr=>{const nat=gr.L.reduce((s,n)=>s+gitH(n),0)+(gr.L.length-1)*M,w=Math.max(...gr.L.map(gitB));
  if(g.del&&gr.L.length>3&&nat>H){const m=Math.ceil(gr.L.length/2);stakke.push({g:gr,L:gr.L.slice(0,m),w,sub:0});stakke.push({g:gr,L:gr.L.slice(m),w,sub:1})}else stakke.push({g:gr,L:gr.L,w,sub:-1})});
 const slots=[];stakke.forEach(s=>{if(s.sub===1){slots[slots.length-1].S.push(s);return}slots.push({S:[s]})});slots.forEach(sl=>{sl.w=sl.S.reduce((a,s)=>a+s.w,0)+(sl.S.length-1)*M});
 const sumW=slots.reduce((a,s)=>a+s.w,0),luft=slots.length>1?(ramme.x1-ramme.x0-sumW)/(slots.length-1):0;
 let x=ramme.x0;const kx={};slots.forEach(sl=>{let xx=x;sl.S.forEach(s=>{s.x=xx;if(kx[s.g.c.k]===undefined)kx[s.g.c.k]=rund(xx);xx+=s.w+M});x+=sl.w+luft});
 const flere=stakke.filter(s=>s.L.length>1),taet=flere.length?Math.min(...flere.map(s=>(H-s.L.reduce((a,n)=>a+gitH(n),0))/(s.L.length-1))):M;
 const nMax=Math.max(...stakke.map(s=>s.L.length)),hMaxN=Math.max(...stakke.map(s=>Math.max(...s.L.map(gitH)))),pitch=nMax>1?(H-hMaxN)/(nMax-1):0;
 stakke.forEach(s=>{const n=s.L.length,sum=s.L.reduce((a,nd)=>a+gitH(nd),0);
  if(g.model==='B'){const y0=ramme.y0+(H-((n-1)*pitch+hMaxN))/2;s.L.forEach((nd,i)=>{nd.gx=s.x;nd.gy=y0+i*pitch+(hMaxN-gitH(nd))/2});return}
  let afst=n>1?(H-sum)/(n-1):0;if(g.model==='C')afst=Math.min(afst,2*Math.max(taet,M));const hoej=sum+(n-1)*afst;let y=ramme.y0+(H-hoej)/2;s.L.forEach(nd=>{nd.gx=s.x;nd.gy=y;y+=gitH(nd)+afst})});
 let hoejde=0;NE2.N.forEach(n=>{if(n.gx===undefined)return;n.x=rund(n.gx);n.y=rund(n.gy);n.flyttet=true;NE.pos[n.key]=[n.x,n.y];delete n.gx;delete n.gy;if(n.el){n.el.style.left=n.x+'px';n.el.style.top=n.y+'px'}hoejde=Math.max(hoejde,n.y+gitH(n))});
 NE2.hoejde=hoejde;g.kx=kx;try{ne61Hoveder()}catch(e){}try{if(NE2.byg)neLinjerTegn()}catch(e){}return true}
function gitAntal(){return [...(NE2.N||new Map()).values()].filter(n=>n.el).length}
/* Ret op: rammen er de yderste noder lige nu (ved de skydere, der står); de andre fordeles inde i den */
function gitRetOp(stille){const g=gitInd(),r=gitRamme();if(!r){neToast('Der er ingen noder at rette op.',true);return false}
 g.ramme={cx:(r.x0+r.x1)/2,cy:(r.y0+r.y1)/2,w:(r.x1-r.x0)/(g.vand/100),h:(r.y1-r.y0)/(g.lod/100)};gitLaeg(gitRammeNu(g),g);gitUI();gitGem();
 if(!stille)neToast('Ret op: '+gitAntal()+' noder i gitter '+g.model+'. Rammen er de yderste noder; de står, hvor de stod. Ctrl+Z fortryder.',true);return true}
/* standard: den tætteste kolonne i naturlig højde (gange f), bredden efter feltets form × 1,35 */
function gitStandard(f,stille){const g=gitInd(),grp=gitKol();if(!grp.length)return false;const fl=$('ne-flade'),W=(fl&&fl.clientWidth)||1920,HF=(fl&&fl.clientHeight)||1000,M=24;f=f||1;
 const hNat=Math.max(...grp.map(gr=>gr.L.reduce((s,n)=>s+gitH(n),0)+(gr.L.length-1)*M)),wMin=grp.reduce((s,gr)=>s+Math.max(...gr.L.map(gitB)),0)+(grp.length-1)*120;
 const H=Math.round(hNat*f),Wd=Math.max(Math.round(wMin*f),Math.round(H*(W/HF)*1.35));
 g.lod=100;g.vand=100;g.ramme={cx:Math.round(Wd/2),cy:Math.round(H/2),w:Wd,h:H};gitLaeg(gitRammeNu(g),g);gitUI();if(!stille)gitGem();return true}
function gitOpstil(id,stille){const o=GIT_OPST.find(x=>x[0]===id);if(!o||!NE2.N)return false;const fl=$('ne-flade');if(!fl||!(fl.clientWidth>0)||fl.style.display==='none'){neToast('Skift til Noder for at bruge en opstilling.',true);return false}
 if(!gitStandard(+id.slice(3),true))return false;set.ne=set.ne||{};set.ne.opst=id;NE.tilpas=true;neTilpas();gitGem();const v=$('ne61-opst');if(v)v.value=id;
 if(!stille)neToast('Opstilling: '+o[1]+' · '+gitAntal()+' noder · zoom '+Math.round(NE.z*100)+' %. Skyderne Lodret og Vandret ændrer luften.',true);return true}
/* --- værktøjslinjen: Ret op, model, Del, og de to skydere --- */
function gitUI(){const g=gitInd(),m=$('ne-git-model'),d=$('ne-git-del'),l=$('ne-git-lod'),v=$('ne-git-vand');if(m)m.value=g.model;if(d)d.checked=g.del;if(l){l.value=g.lod;l.nextElementSibling.textContent=g.lod+' %'}if(v){v.value=g.vand;v.nextElementSibling.textContent=g.vand+' %'}}
/* gitteret har sin egen linje lige over kontrolpanelet (værktøjslinjen er fuld; dér ville det ryge bag ⋯ Mere) */
function gitUIByg(){if($('ne-git'))return;const kp=$('ne-kp');if(!kp){setTimeout(gitUIByg,400);return}
 kp.insertAdjacentHTML('beforebegin','<div id="ne-git" role="group" aria-label="Gitter"><b class="ne-git-t" title="Noderne står i faste kolonner med lige stor luft. Ret op lægger dem i et gitter inde i rammen (de yderste noder).">Gitter</b>'
  +'<button class="ne-k" data-git="ret" title="Ret op: de yderste noder er rammen og flyttes ikke; alle andre fordeles jævnt i faste kolonner inde i rammen. Ctrl+Z fortryder.">Ret op</button>'
  +'<select id="ne-git-model" aria-label="Lodret fordeling" title="Lodret fordeling: C = hver kolonne fylder højden, centreret, men luften er højst 2 × den tætteste kolonnes luft (standard); A = hver kolonne fylder hele højden; B = ét fælles rækkegitter, kolonnerne centreret">'+Object.keys(GIT_MODEL).map(k=>'<option value="'+k+'">'+GIT_MODEL[k]+'</option>').join('')+'</select>'
  +'<label title="Del lange kolonner i to stakke ved siden af hinanden, når de ikke kan være i rammens højde (fra som standard)"><input type="checkbox" id="ne-git-del"> Del</label>'
  +'<label title="Lodret luft (op og ned): strækker rammen fra midten, 40–150 %"><small>↕</small><input type="range" id="ne-git-lod" min="40" max="150" step="1" value="100"><output>100 %</output></label>'
  +'<label title="Vandret luft (frem og tilbage): strækker rammen fra midten, 40–150 %"><small>↔</small><input type="range" id="ne-git-vand" min="40" max="150" step="1" value="100"><output>100 %</output></label></div>');
 const grp=$('ne-git');grp.addEventListener('pointerdown',e=>e.stopPropagation());
 grp.querySelector('[data-git="ret"]').addEventListener('click',()=>{if(set.ne&&set.ne.mx){mxSaet(false,true)}setTimeout(()=>gitRetOp(),30)});
 const om=()=>{const g=gitInd();if(!g.ramme){gitRetOp(true);return}gitLaeg(gitRammeNu(g),g)};
 $('ne-git-model').addEventListener('change',e=>{gitInd().model=e.target.value;om();gitGem();neToast('Lodret fordeling: '+GIT_MODEL[e.target.value]+'.',true)});
 $('ne-git-del').addEventListener('change',e=>{gitInd().del=e.target.checked;om();gitGem();neToast(e.target.checked?'Lange kolonner deles i to stakke.':'Kolonnerne deles ikke.',true)});
 [['ne-git-lod','lod','Lodret luft'],['ne-git-vand','vand','Vandret luft']].forEach(([id,f,navn])=>{const el=$(id);el.addEventListener('input',e=>{const g=gitInd();g[f]=Math.max(40,Math.min(150,+e.target.value||100));el.nextElementSibling.textContent=g[f]+' %';NE.tilpas=false;om()});el.addEventListener('change',()=>{gitGem();neToast(navn+': '+gitInd()[f]+' %. Ctrl+Z fortryder.',true)})});
 gitUI()}
/* nye noder uden plads lander i deres kolonne i gitteret, nederst; uden noget gitter endnu får showet standard-gitteret første gang */
{const gl=ne2Placer;window.ne2Placer=function(){gl();if(GIT.gammel||!NE2.N||!NE2.N.size)return;const g=gitInd(),maalt=[...NE2.N.values()].some(n=>n.el&&n.el.offsetHeight>0);if(!maalt)return;
 if(g.ramme&&g.kx){const bund={};NE2.N.forEach(n=>{if(n.flyttet||!n.el)return;const x=g.kx[n.kol];if(x===undefined)return;if(bund[n.kol]===undefined)bund[n.kol]=Math.max(gitRammeNu(g).y0-24,...[...NE2.N.values()].filter(m=>m.kol===n.kol&&m.flyttet).map(m=>m.y+gitH(m)));n.x=x;n.y=Math.round((bund[n.kol]+24)/8)*8;bund[n.kol]=n.y+gitH(n)});return}
 if(!Object.keys(NE.pos||{}).some(k=>!/^d:/.test(k)))gitStandard(1,true)}}
{const gl=ne2Byg;window.ne2Byg=function(){gitSync();return gl.apply(this,arguments)}}
{const gl=neAutoPlacer;window.neAutoPlacer=function(){neSaetPos({});const g=gitInd();delete g.ramme;delete g.kx;NE.tilpas=true;gl();gitUI();gitGem()}}
{const gl=neOpstil;window.neOpstil=function(id,stille){GIT.gammel=true;let r=false;try{r=gl(id,stille)}finally{GIT.gammel=false}if(r){const g=gitInd();delete g.ramme;delete g.kx;gitGem()}return r}}
{const gl=neOpstilEgen;window.neOpstilEgen=function(i){const r=gl(i);const g=gitInd();delete g.ramme;delete g.kx;gitGem();return r}}
/* skiftes hele regel-listen (et show hentes, Nulstil, Indlæs fra tekst), glemmes pladserne, så showet får sit eget gitter (dets egne pladser kommer med i scene.ne.pos, hvis det har nogen); ikke i forslags-fangeren */
{const gl=Regler.erstat;Regler.erstat=function(){const r=gl.apply(Regler,arguments);try{if(!(typeof FSF!=='undefined'&&FSF&&FSF.til)){neSaetPos({});const g=gitInd();delete g.ramme;delete g.kx;NE.tilpas=true}}catch(e){}return r}}
setTimeout(gitUIByg,1200);
/* ========== SLUT: GITTER: RET OP, A/B/C, LUFT-SKYDERE OG KÆMPE OPSTILLINGER ========== */


