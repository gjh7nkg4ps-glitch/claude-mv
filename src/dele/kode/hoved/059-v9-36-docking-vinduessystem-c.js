/* ========== v9.36: DOCKING (VINDUESSYSTEM C) ==========
   Brugerens valg C (8. november 2026, 43" skærm): ét docking-system (fagudtryk: docking) i stedet for zonerne og de frie vinduer.
   - Arbejdsfladen er delt i zoner (vores navn). Hver zone har sin egen fanebjælke; hver fane er et vindue (Live preview, Node-editor, Editor …).
   - Træk en fane til en anden zone (slip på fanebjælken eller midt i zonen), eller til en kant af en zone: så deles zonen i to, og fanen får den nye halvdel.
   - Stregerne mellem zonerne trækkes for at ændre størrelsen; dobbeltklik gør de to sider lige store. 🔒 Lås vinduer låser stregerne og fanerne.
   - I hver zones bjælke: ＋ (åbn et vindue som fane her), ⤢ Stor (zonen fylder hele arbejdsfladen; Esc eller ⤢ igen går tilbage),
     ⛶ Fuld skærm (rigtig fuld skærm: zonen fylder hele skærmen; Esc afslutter) og ⋯ (del til højre, del nedad, send til skærm, luk zonen).
   - Layout-knapperne (Overblik, Show, Byg, Lyd, Figurer, Noder) husker dine ændringer pr. layout; ↺ Standard sætter det valgte layout tilbage.
   - Fjernet: de frie vinduer (▦ Zoner: fra), ▦-menuen, Maksimér, −, ⇱ Riv løs, ↔ Bredt skrivebord og panelerne ovenpå. Det, der åbnede et panel
     (sidebjælken, Søg, Vinduer), åbner nu vinduet som fane. De gamle funktioner (scVaelg, fgVaelg, sbAabn, lay3Anvend …) sendes hertil.
   Opbygning (set.dock): en zone er {t:'z', id, f:[vinduer], a:aktiv}; en deling er {t:'d', r:'h' (side om side) eller 'v' (over hinanden), s:[andele], c:[børn]}. */
const DK_NAVN={w2:'Live preview',w5:'Radial Mesh',w28:'Mesh 3D',w29:'Øjet',w33:'Node-editor',w36:'Biblioteket',w35:'Analyse'/* v9.98: hed Sang */,w6:'Egenskaber',w34:'På scenen'/* v9.107: hed Figurer */,/* v9.76: Tidslinje (w1), EQ (w3), Analyse (w7), EQ+ (w24) og Lydkilde (w31) bor i Sang (w35); v9.81: Lyd i 3D (w9), Generator (fuld) (w4), Idé-galleri (w22), Lydlag (w15), Audit (w19) og Detektion (w20) er fjernet */w13:'Opsætninger',w21:'Preset',w14:'Kvalitet',w16:'Bane og klods',w17:'Show',w18:'Lydtræk-guide'};
const DK_VAERT=['w23','w25','w26','w27'],DK_SC=['w2','w5','w28','w29'],DK_AF=['w33','w36','w35'],DK_G=8;
const DK={klar:false,stor:null,sidst:null,traek:null,streg:null,n:0};
const dkZ=(id,f,a)=>({t:'z',id,f:f.slice(),a});
function dkStd(k){const SC=DK_SC,AF=DK_AF;return ({
 overblik:{t:'d',r:'h',s:[.64,.36],c:[{t:'d',r:'v',s:[.62,.38],c:[dkZ('sc',SC,'w2'),dkZ('af',AF,'w33')]},dkZ('ed',['w6','w13'],'w6')]},
 show:dkZ('sc',SC,'w2'),
 byg:{t:'d',r:'h',s:[.6,.4],c:[dkZ('sc',SC,'w5'),{t:'d',r:'v',s:[.55,.45],c:[dkZ('af',AF,'w33'),dkZ('ed',['w6','w13'],'w6')]}]},
 lyd:{t:'d',r:'v',s:[.6,.4],c:[{t:'d',r:'h',s:[.6,.4],c:[dkZ('sc',SC,'w24'),dkZ('af',['w31','w1','w7','w33'],'w31')]},dkZ('gen',['w4','w15'],'w4')]},
 figurer:{t:'d',r:'h',s:[.55,.45],c:[dkZ('sc',SC,'w2'),dkZ('ed',['w6','w13'],'w6')]},
 noder:{t:'d',r:'v',s:[.3,.7],c:[dkZ('sc',SC,'w2'),dkZ('af',AF,'w33')]}}[k]||null)}
/* ========== v9.67: DE FIRE ARBEJDSOMRÅDER ==========
   Planens fase 5: fire arbejdsområder, Sang, Scene, Regler og Show (tasterne 1 til 4). Hvert er et docking-layout (som Overblik og de andre),
   så stregerne og fanerne kan trækkes, ændringerne huskes, og ↺ Standard sætter det tilbage. Knapperne står først i topbjælken (LAY3).
   De gamle layouts, sidebjælken og bundbjælken ligger der stadig; de fjernes i trin 5b. */
const AO=['ao-sang','ao-scene','ao-regler','ao-show'];
const AO_STD={'ao-sang':()=>dkZ('af',['w35'],'w35'),/* v9.76: ét vindue, Sang */
 'ao-scene':()=>({t:'d',r:'h',s:[.17,.55,.28],c:[dkZ('fg',['w34'],'w34'),dkZ('sc',['w2','w28','w29','w5'],'w2'),dkZ('ed',['w6'],'w6')]}),/* v9.74: Figurer · scene · Egenskaber; v9.81: uden Idé-galleri */
 'ao-regler':()=>({t:'d',r:'h',s:[.22,.56,.22],c:[dkZ('bib',['w36'],'w36'),dkZ('af',['w33'],'w33'),dkZ('sc',['w2'],'w2')]}),/* v9.87: Biblioteket til venstre */
 'ao-show':()=>({t:'d',r:'h',s:[.78,.22],c:[dkZ('sc',['w2','w28','w29','w5'],'w2'),dkZ('ed',['w13','w17'],'w13')]})};
{const gl=dkStd;window.dkStd=function(k){return AO_STD[k]?AO_STD[k]():gl(k)}}
function aoVaelg(k){if(!AO_STD[k])return;try{lay3Anvend(k)}catch(e){console.error(e)}}
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||e.shiftKey||e.key.length!==1)return;const i='1234'.indexOf(e.key);if(i<0)return;const t=e.target;if(t&&t.closest&&t.closest('input,textarea,select,[contenteditable="true"]'))return;e.preventDefault();aoVaelg(AO[i])});
/* ========== SLUT: DE FIRE ARBEJDSOMRÅDER ========== */
const dkKopi=x=>JSON.parse(JSON.stringify(x));
function dkZoner(n,L){L=L||[];if(!n)return L;if(n.t==='z')L.push(n);else n.c.forEach(c=>dkZoner(c,L));return L}
function dkZoneAf(w){return dkZoner(set.dock).find(z=>z.f.includes(w))||null}
function dkZone(id){return dkZoner(set.dock).find(z=>z.id===id)||null}
function dkForaelder(n,mål){if(!n||n.t==='z')return null;for(let i=0;i<n.c.length;i++){if(n.c[i]===mål)return[n,i];const r=dkForaelder(n.c[i],mål);if(r)return r}return null}
function dkSynligFane(id){const w=$(id);return !!(w&&!w.classList.contains('niv-skjult'))}
function dkGem(){try{if(set.lay3){set.dockLay=set.dockLay||{};set.dockLay[set.lay3]=dkKopi(set.dock)}lsGem('rytme-set',JSON.stringify(set))}catch(e){}}
/* fjern en zone fra træet (dens faner skal være flyttet først) */
function dkFjernZone(z){const p=dkForaelder(set.dock,z);if(!p){return}const[n,i]=p;n.c.splice(i,1);const s=n.s.splice(i,1)[0]||0;const sum=n.s.reduce((a,b)=>a+b,0)||1;n.s=n.s.map(x=>x/sum);
 if(n.c.length===1){const enebarn=n.c[0],pp=dkForaelder(set.dock,n);if(!pp)set.dock=enebarn;else pp[0].c[pp[1]]=enebarn}}
function dkTagUd(w){const z=dkZoneAf(w);if(!z)return null;z.f=z.f.filter(x=>x!==w);if(z.a===w)z.a=z.f.find(dkSynligFane)||z.f[0]||null;if(!z.f.length&&dkZoner(set.dock).length>1)dkFjernZone(z);return z}
function dkLaegI(w,z,i){if(!z)return;dkTagUd(w);z=dkZone(z.id)||z;if(i==null||i<0||i>z.f.length)z.f.push(w);else z.f.splice(i,0,w);z.a=w}
/* del zonen z: side 'l','r','t','b'; den nye zone får vinduet w */
function dkDel(z,side,w){const ny=dkZ('z'+(++DK.n)+Date.now().toString(36).slice(-3),[],null);dkTagUd(w);z=dkZone(z.id);if(!z){/* zonen forsvandt (det var dens eneste fane): læg fanen tilbage */return}ny.f=[w];ny.a=w;const r=side==='l'||side==='r'?'h':'v',foer=side==='l'||side==='t';
 const p=dkForaelder(set.dock,z);if(p&&p[0].r===r){const[n,i]=p,h=n.s[i]/2;n.s[i]=h;n.c.splice(foer?i:i+1,0,ny);n.s.splice(foer?i:i+1,0,h)}
 else{const d={t:'d',r,s:[.5,.5],c:foer?[ny,z]:[z,ny]};if(!p)set.dock=d;else p[0].c[p[1]]=d}return ny}
/* tegn */
function dkRect(n,x,y,b,h,ud){if(n.t==='z'){ud.z.push([n,x,y,b,h]);return}const G=DK_G,vand=n.r==='h',tot=(vand?b:h)-G*(n.c.length-1);let p=vand?x:y;
 n.c.forEach((c,i)=>{const l=Math.max(60,tot*n.s[i]);if(vand)dkRect(c,p,y,l,h,ud);else dkRect(c,x,p,b,l,ud);p+=l;if(i<n.c.length-1){ud.s.push({n,i,vand,x:vand?p:x,y:vand?y:p,b:vand?G:b,h:vand?h:G,tot,start:vand?x:y});p+=G}})}
function dkFane(id){return DK_NAVN[id]||(($(id)||{}).querySelector&&($(id).querySelector('.wh span')||{}).textContent)||id}
function dkAnvend(){const ws=$('ws');if(!ws||!DK.klar||!set.dock)return;const W=ws.clientWidth,H=ws.clientHeight,G=DK_G;
 DK_VAERT.forEach(id=>{const w=$(id);if(w){w.classList.add('zon-skjult');w.classList.remove('zone','zon-pop')}});['zs-v','zs-h'].forEach(i=>{const z=$(i);if(z)z.hidden=true});
 const ud={z:[],s:[]},Z=dkZoner(set.dock);if(DK.stor&&!dkZone(DK.stor))DK.stor=null;
 if(DK.stor){const z=dkZone(DK.stor);ud.z.push([z,G,G,W-2*G,H-2*G])}else dkRect(set.dock,G,G,W-2*G,H-2*G,ud);
 const brugt=new Set();
 ud.z.forEach(([z,x,y,b,h])=>{let el=$('dz-'+z.id);if(!el){el=document.createElement('section');el.id='dz-'+z.id;el.className='dk-zone';el.dataset.z=z.id;el.innerHTML='<div class="dk-bjaelke"><div class="dk-faner" role="tablist"></div><div class="dk-knapper"><button class="dk-k" data-dk="ny" title="Åbn et vindue som fane i denne zone">＋</button><button class="dk-k" data-dk="stor" title="Stor: zonen fylder hele arbejdsfladen (Esc går tilbage)">⤢</button><button class="dk-k" data-dk="fuld" title="Fuld skærm: zonen fylder hele skærmen (Esc afslutter)">⛶</button><button class="dk-k" data-dk="mere" title="Del zonen, send til skærm eller luk zonen">⋯</button></div></div><div class="dk-krop"></div>';ws.appendChild(el)}
  el.hidden=false;el.style.left=Math.round(x)+'px';el.style.top=Math.round(y)+'px';el.style.width=Math.round(b)+'px';el.style.height=Math.round(h)+'px';el.classList.toggle('dk-stor',DK.stor===z.id);brugt.add(el.id);
  const krop=el.querySelector('.dk-krop');if(!z.a||!z.f.includes(z.a)||!dkSynligFane(z.a))z.a=z.f.find(dkSynligFane)||z.f[0]||null;
  z.f.forEach(id=>{const w=$(id);if(!w)return;if(w.parentNode!==krop)krop.appendChild(w);w.classList.remove('fg-member','fg-aktiv','zone','zon-skjult','zon-pop','max','min');w.classList.add('scene-member','dk-medlem');const ak=id===z.a;w.classList.toggle('scene-aktiv',ak);w.hidden=!ak});
  const fb=el.querySelector('.dk-faner'),sig=z.f.map(id=>id+(id===z.a?'*':'')+(dkSynligFane(id)?'':'-')).join(',');if(fb.dataset.sig!==sig){fb.dataset.sig=sig;fb.innerHTML=z.f.filter(dkSynligFane).map(id=>'<span class="dk-fk'+(id===z.a?' on':'')+'"><button class="dk-fane" role="tab" aria-selected="'+(id===z.a)+'" data-w="'+id+'" title="'+dkFane(id).replace(/"/g,'&quot;')+' · træk fanen til en anden zone eller til en kant for at dele">'+dkFane(id)+'</button><button class="dk-fx" data-dk="luk" data-w="'+id+'" aria-label="Luk fanen '+dkFane(id)+'" title="Luk fanen (åbn den igen med ＋, sidebjælken eller Søg)">×</button></span>').join('')}});
 ws.querySelectorAll('.dk-zone').forEach(el=>{if(!brugt.has(el.id)){[...el.querySelectorAll('.dk-krop > .win')].forEach(w=>{w.hidden=true;w.classList.remove('scene-member','scene-aktiv','dk-medlem');ws.appendChild(w)});el.remove()}});
 /* vinduer, der ikke er faner, er lukket */
 const docket=new Set(Z.flatMap(z=>z.f));Object.keys(DK_NAVN).forEach(id=>{const w=$(id);if(!w||docket.has(id))return;if(w.classList.contains('dk-medlem')){w.classList.remove('scene-member','scene-aktiv','dk-medlem');ws.appendChild(w)}w.hidden=true;w.classList.add('zon-skjult')});
 ws.querySelectorAll('.dk-streg').forEach(s=>s.remove());if(!DK.stor)ud.s.forEach((s,k)=>{const d=document.createElement('div');d.className='dk-streg'+(s.vand?' dk-lodret':' dk-vandret')+(set.laast?' dk-laast':'');d.dataset.k=k;d.setAttribute('role','separator');d.title=set.laast?'Låst (🔒 Lås vinduer i topbjælken)':'Træk for at ændre størrelsen · dobbeltklik: lige store';d.style.left=Math.round(s.x)+'px';d.style.top=Math.round(s.y)+'px';d.style.width=Math.round(s.b)+'px';d.style.height=Math.round(s.h)+'px';ws.appendChild(d)});DK.streger=ud.s;
 /* forenelighed: Scenens og samlingernes aktive fane */
 Z.forEach(z=>{if(!z.a)return;if(SC_FANER.some(f=>f[0]===z.a)&&set.scene)set.scene.aktiv=set.scene.aktiv&&Z.some(q=>q.a===set.scene.aktiv)&&SC_FANER.some(f=>f[0]===set.scene.aktiv)?set.scene.aktiv:z.a;try{Object.keys(FG).forEach(g=>{if(FG[g].faner.some(f=>f[0]===z.a))set.fg[g].aktiv=z.a})}catch(e){}});
 ws.scrollTop=0;ws.scrollLeft=0;dkStorBesked();
 /* v9.69: resize sendes kun, når zonerne faktisk er ændret; ellers kaldte lytteren til resize dkAnvend igen ved hvert billede */
 const sig69=W+'x'+H+'|'+(DK.stor||'')+'|'+ud.z.map(([z,x,y,b,h])=>z.id+':'+Math.round(x)+','+Math.round(y)+','+Math.round(b)+','+Math.round(h)+':'+z.a).join(';');if(sig69!==DK.sig69){DK.sig69=sig69;requestAnimationFrame(()=>{try{window.dispatchEvent(new Event('resize'))}catch(e){}})}}
function dkStorBesked(){let b=$('dk-storbesked');if(!DK.stor){if(b)b.hidden=true;return}if(!b){b=document.createElement('div');b.id='dk-storbesked';b.className='dk-storbesked';$('ws').appendChild(b)}b.hidden=false;const z=dkZone(DK.stor);b.textContent='Stor: '+(z&&z.a?dkFane(z.a):'zonen')+' fylder arbejdsfladen · Esc eller ⤢ går tilbage'}
function dkResize(id){try{({w5:meshResize}[id]||(()=>{}))()}catch(e){}}
/* vis et vindue: aktivér dets fane; er det ikke en fane, åbnes det i den sidst brugte zone */
function dkVis(id,stille){if(typeof SG_ALIAS!=='undefined'&&SG_ALIAS[id]){try{sgFane(SG_ALIAS[id])}catch(e){}id='w35'}/* v9.76 */const w=$(id);if(!w||!DK.klar)return false;if(DK_VAERT.includes(id))id={w23:(set.scene&&set.scene.aktiv)||'w2',w25:(set.fg&&set.fg.lyd&&set.fg.lyd.aktiv)||'w33',w26:(set.fg&&set.fg.vaerk&&set.fg.vaerk.aktiv)||'w18',w27:(set.fg&&set.fg.ops&&set.fg.ops.aktiv)||'w13'}[id];
 if(!DK_NAVN[id])return false;if($(id).classList.contains('niv-skjult')){msg('Vinduet hører til et højere niveau. Skift Niveau nederst i sidebjælken for at se det.');return false}
 let z=dkZoneAf(id);if(!z){z=dkZone(DK.sidst)||dkZoner(set.dock).find(q=>q.f.some(f=>DK_SC.includes(f)))||dkZoner(set.dock)[0];z.f.push(id)}z.a=id;if(DK.stor&&DK.stor!==z.id)DK.stor=null;DK.sidst=z.id;dkGem();dkAnvend();dkResize(id);
 if(SC_FANER.some(f=>f[0]===id))set.scene.aktiv=id;return true}
/* layouts */
function dkLayout(k,stille){const std=dkStd(k);if(!std)return;set.lay3=k;set.dock=dkKopi((set.dockLay&&set.dockLay[k])||std);DK.stor=null;dkGem();dkAnvend();try{lay3UI()}catch(e){}if(!stille)msg('Layout: '+(LAY3.find(x=>x[0]===k)||[0,k])[1]+'.'+(set.dockLay&&set.dockLay[k]&&JSON.stringify(set.dockLay[k])!==JSON.stringify(std)?' Dine ændringer er husket; ↺ Standard sætter det tilbage.':''))}
function dkStandard(){const k=set.lay3||'overblik';if(set.dockLay)delete set.dockLay[k];set.dock=dkKopi(dkStd(k)||dkStd('overblik'));DK.stor=null;dkGem();dkAnvend();msg('Layoutet '+((LAY3.find(x=>x[0]===k)||[0,k])[1])+' er sat tilbage til standard.')}
/* overtag de gamle funktioner */
window.zonerAnvend=function(){if(DK.klar)dkAnvend()};
window.zonerLayout=function(k,stille){dkLayout(k,stille)};
window.zonerSaet=function(){set.zoner=true;document.body.classList.add('zoner');if(DK.klar)dkAnvend()};
window.zonPop=function(id){dkVis(id)};window.zonLuk=function(){};
window.scVaelg=function(id,stille){if(dkVis(id)&&!stille)msg('Viser nu '+dkFane(id)+'.')};
window.scRiv=function(id){const z=dkZoneAf(id);if(z){dkDel(z,'r',id);dkGem();dkAnvend();msg(dkFane(id)+' har fået sin egen zone til højre. Træk fanen tilbage for at samle dem igen.')}};
window.scTilbage=function(id){dkVis(id)};window.fgRiv=function(g,id){window.scRiv(id)};
window.fgVaelg=function(g,id,stille){if(dkVis(id)&&!stille)msg('Viser nu '+dkFane(id)+'.')};window.fgVisHost=function(){};
window.sbAabn=function(id){dkVis(id)};
/* Node-editorens scene-node: "Åbn stort" og klik på billedet bruger ⤢ Stor */
window.ne12Stort=function(id){const z=dkZoneAf(id);if(!z){dkVis(id);return}z.a=id;DK.stor=z.id;dkAnvend();try{neToast(dkFane(id)+' fylder hele arbejdsfladen (⤢ Stor). Esc går tilbage.',true)}catch(e){}};
{const gl=layNu;window.layNu=function(){return{dock:dkKopi(set.dock)}}}
{const gl=layBrug;window.layBrug=function(o){if(o&&o.dock){set.dock=dkKopi(o.dock);set.lay3='';DK.stor=null;dkGem();dkAnvend();return 3}if(o&&o.zoner){dkLayout('overblik',true);return 3}return gl.apply(this,arguments)}}
{const gl=nivAnvend;window.nivAnvend=function(){const r=gl.apply(this,arguments);if(DK.klar)dkAnvend();return r}}
window.ne12Vises=function(){const S=[];let ud='';try{if(typeof udgangAaben==='function'&&udgangAaben())ud=NE12_UD[set.udkilde]||''}catch(e){}const A=new Set(dkZoner(set.dock).map(z=>z.a));
 NE12_SC.forEach(([id])=>{const hvor=A.has(id)?'scene':'';if(hvor||ud===id)S.push({id,hvor,ud:ud===id})});return S};
/* træk i stregerne */
function dkStregStart(e){const d=e.target.closest('.dk-streg');if(!d||e.button>0)return;e.preventDefault();if(set.laast){try{laasHint()}catch(x){}return}const s=DK.streger[+d.dataset.k];if(!s)return;DK.streg={s,d,p0:s.vand?e.clientX:e.clientY,a:s.n.s[s.i],b:s.n.s[s.i+1]};try{d.setPointerCapture(e.pointerId)}catch(x){}document.body.classList.add('drar')}
function dkStregFlyt(e){const T=DK.streg;if(!T)return;const s=T.s,dx=((s.vand?e.clientX:e.clientY)-T.p0)/Math.max(1,s.tot),min=Math.min(.45,200/Math.max(1,s.tot)),sum=T.a+T.b;let a=Math.max(min,Math.min(sum-min,T.a+dx));s.n.s[s.i]=a;s.n.s[s.i+1]=sum-a;dkAnvend()}
function dkStregSlip(){if(!DK.streg)return;DK.streg=null;document.body.classList.remove('drar');dkGem()}
/* træk i fanerne */
function dkFaneStart(e){const f=e.target.closest('.dk-fane');if(!f||e.button>0)return;DK.traek={w:f.dataset.w,x:e.clientX,y:e.clientY,i:false}}
function dkMaal(e){const ws=$('ws'),el=document.elementFromPoint(e.clientX,e.clientY),zo=el&&el.closest&&el.closest('.dk-zone');if(!zo)return null;const z=dkZone(zo.dataset.z);if(!z)return null;const r=zo.getBoundingClientRect(),bj=zo.querySelector('.dk-bjaelke').getBoundingClientRect();
 if(e.clientY<=bj.bottom){const F=[...zo.querySelectorAll('.dk-fane')];let i=F.findIndex(b=>{const q=b.getBoundingClientRect();return e.clientX<q.left+q.width/2});const ix=i<0?z.f.length:z.f.indexOf(F[i].dataset.w);return{z,zo,sted:'fane',i:ix,r:{x:bj.left,y:bj.top,b:bj.width,h:bj.height}}}
 const fx=(e.clientX-r.left)/r.width,fy=(e.clientY-r.top)/r.height,k=.25;let sted='c';if(fx<k)sted='l';else if(fx>1-k)sted='r';else if(fy<k)sted='t';else if(fy>1-k)sted='b';
 const R={c:{x:r.left,y:r.top,b:r.width,h:r.height},l:{x:r.left,y:r.top,b:r.width/2,h:r.height},r:{x:r.left+r.width/2,y:r.top,b:r.width/2,h:r.height},t:{x:r.left,y:r.top,b:r.width,h:r.height/2},b:{x:r.left,y:r.top+r.height/2,b:r.width,h:r.height/2}}[sted];return{z,zo,sted,r:R}}
function dkFaneFlyt(e){const T=DK.traek;if(!T)return;if(!T.i){if(Math.hypot(e.clientX-T.x,e.clientY-T.y)<6)return;if(set.laast){DK.traek=null;try{laasHint()}catch(x){}return}T.i=true;document.body.classList.add('dk-traekker');const g=document.createElement('div');g.className='dk-spoegelse';g.textContent=dkFane(T.w);document.body.appendChild(g);T.g=g;const o=document.createElement('div');o.className='dk-felt';document.body.appendChild(o);T.o=o}
 T.g.style.left=(e.clientX+12)+'px';T.g.style.top=(e.clientY+10)+'px';const m=dkMaal(e);T.m=m;if(!m){T.o.hidden=true;return}T.o.hidden=false;T.o.style.left=m.r.x+'px';T.o.style.top=m.r.y+'px';T.o.style.width=m.r.b+'px';T.o.style.height=m.r.h+'px';T.o.dataset.sted=m.sted;
 T.g.textContent=dkFane(T.w)+' → '+({fane:'flyt hertil',c:'flyt hertil',l:'ny zone til venstre',r:'ny zone til højre',t:'ny zone foroven',b:'ny zone forneden'}[m.sted])}
function dkFaneSlip(e){const T=DK.traek;DK.traek=null;if(!T)return;document.body.classList.remove('dk-traekker');if(T.g)T.g.remove();if(T.o)T.o.remove();
 if(!T.i){const z=dkZoneAf(T.w);if(z){z.a=T.w;DK.sidst=z.id;dkGem();dkAnvend();dkResize(T.w)}return}
 const m=T.m;if(!m)return;const fra=dkZoneAf(T.w);if(m.sted==='fane'||m.sted==='c'){if(fra===m.z&&m.sted==='c')return;dkLaegI(T.w,m.z,m.sted==='fane'?m.i:null);DK.sidst=m.z.id}
 else{if(fra===m.z&&fra.f.length===1)return;const ny=dkDel(m.z,m.sted,T.w);if(ny)DK.sidst=ny.id}
 DK.stor=null;dkGem();dkAnvend();dkResize(T.w);msg(dkFane(T.w)+(m.sted==='fane'||m.sted==='c'?' er flyttet.':' har fået en ny zone.')+' Layoutet husker det; ↺ Standard sætter det tilbage.')}
/* zonens knapper */
function dkMenu(knap,titel,punkter){const fl=document.querySelector('.dk-menu');if(fl)fl.remove();const m=document.createElement('div');m.className='dk-menu';m.setAttribute('role','menu');m.innerHTML='<div class="dk-menu-t">'+titel+'</div>'+punkter.map((p,i)=>p?'<button role="menuitem" data-i="'+i+'"'+(p[2]?' disabled':'')+'>'+p[0]+'</button>':'<hr>').join('');document.body.appendChild(m);const r=knap.getBoundingClientRect();m.style.left=Math.max(8,Math.min(innerWidth-m.offsetWidth-8,r.right-m.offsetWidth))+'px';m.style.top=Math.min(innerHeight-m.offsetHeight-8,r.bottom+4)+'px';
 m.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;m.remove();punkter[+b.dataset.i][1]()});setTimeout(()=>{const luk=e=>{if(!m.contains(e.target)){m.remove();removeEventListener('pointerdown',luk,true)}};addEventListener('pointerdown',luk,true)},0);const f=m.querySelector('button');if(f)f.focus()}
function dkKnap(e){const fa=e.target.closest('.dk-fane');if(fa&&e.detail===0){/* tastatur eller .click(): vælg fanen */const z=dkZoneAf(fa.dataset.w);if(z){z.a=fa.dataset.w;DK.sidst=z.id;dkGem();dkAnvend();dkResize(fa.dataset.w)}return}const b=e.target.closest('[data-dk]');if(!b||b.closest('.win'))return;/* v9.48: kun zonens egne knapper; rækkerne i Editorens Koblinger har også data-dk */const zo=b.closest('.dk-zone'),z=zo&&dkZone(zo.dataset.z);if(!z)return;e.stopPropagation();const k=b.dataset.dk;DK.sidst=z.id;
 if(k==='luk'){const w=b.dataset.w;if(dkZoner(set.dock).length===1&&z.f.length===1){msg('Den sidste fane kan ikke lukkes.');return}dkTagUd(w);dkGem();dkAnvend();msg(dkFane(w)+' er lukket. Åbn det igen med ＋, sidebjælken eller Søg.');return}
 if(k==='ny'){const alle=Object.keys(DK_NAVN).filter(id=>$(id)&&dkSynligFane(id));dkMenu(b,'Åbn som fane her',alle.map(id=>{const her=dkZoneAf(id);return[dkFane(id)+(her===z?' · her':her?' · flyt hertil':''),()=>{dkLaegI(id,z,null);dkGem();dkAnvend();dkResize(id)},her===z]}));return}
 if(k==='stor'){DK.stor=DK.stor===z.id?null:z.id;dkAnvend();return}
 if(k==='fuld'){if(document.fullscreenElement){document.exitFullscreen().catch(()=>{});return}zo.requestFullscreen?zo.requestFullscreen().catch(()=>msg('Browseren tillod ikke fuld skærm.')):msg('Browseren kan ikke vise fuld skærm.');return}
 if(k==='mere'){const a=z.a,kanUd=a&&typeof SC_UD!=='undefined'&&SC_UD[a];dkMenu(b,'Zonen',[['Del: '+(a?dkFane(a):'fanen')+' får en ny zone til højre',()=>{if(z.f.length<2){msg('Zonen har kun én fane; åbn en til med ＋ først.');return}dkDel(z,'r',a);dkGem();dkAnvend()},z.f.length<2],['Del: '+(a?dkFane(a):'fanen')+' får en ny zone nedenunder',()=>{if(z.f.length<2)return;dkDel(z,'b',a);dkGem();dkAnvend()},z.f.length<2],null,
  ['▸ Send '+(a?dkFane(a):'')+' til skærm (projektor)',()=>{const sel=$('ud-kilde');if(!sel)return;sel.value=SC_UD[a];sel.dispatchEvent(new Event('change',{bubbles:true}));try{udgangStart()}catch(x){}msg(dkFane(a)+' vises i udgangsvinduet. Træk det over på den eksterne skærm.')},!kanUd],null,
  ['Luk zonen (fanerne flyttes til nabozonen)',()=>{dkLukZone(z)},dkZoner(set.dock).length<2],['↺ Standard: sæt layoutet tilbage',()=>dkStandard()]]);return}}
function dkLukZone(z){const Z=dkZoner(set.dock);if(Z.length<2)return;const p=dkForaelder(set.dock,z),nabo=dkZoner(p[0].c[p[1]===0?1:p[1]-1])[0];z.f.slice().forEach(w=>{nabo.f.push(w)});z.f=[];dkFjernZone(z);DK.stor=null;dkGem();dkAnvend();msg('Zonen er lukket; dens faner står nu i nabozonen.')}
/* start */
function dkStart(){const ws=$('ws');if(!ws){setTimeout(dkStart,300);return}
 set.zoner=true;document.body.classList.add('zoner','dk');DK.klar=true;
 if(!set.dock||!dkZoner(set.dock).length){const k=set.lay3&&dkStd(set.lay3)?set.lay3:'overblik';set.lay3=k;set.dock=dkKopi((set.dockLay&&set.dockLay[k])||dkStd(k))}
 /* vinduer, der ikke findes i filen mere (eller i træet to gange), ryddes væk */
 const set2=new Set();dkZoner(set.dock).forEach(z=>{z.f=z.f.filter(id=>$(id)&&DK_NAVN[id]&&!set2.has(id)&&set2.add(id))});dkZoner(set.dock).filter(z=>!z.f.length).forEach(z=>{if(dkZoner(set.dock).length>1)dkFjernZone(z)});
 DK.n=dkZoner(set.dock).length;dkAnvend();
 ws.addEventListener('pointerdown',e=>{if(e.target.closest('.dk-streg'))dkStregStart(e);else if(e.target.closest('.dk-fane'))dkFaneStart(e)});
 addEventListener('pointermove',e=>{if(DK.streg)dkStregFlyt(e);else if(DK.traek)dkFaneFlyt(e)});addEventListener('pointerup',e=>{if(DK.streg)dkStregSlip(e);else if(DK.traek)dkFaneSlip(e)});
 ws.addEventListener('dblclick',e=>{const d=e.target.closest('.dk-streg');if(d){const s=DK.streger[+d.dataset.k];if(!s||set.laast)return;const sum=s.n.s[s.i]+s.n.s[s.i+1];s.n.s[s.i]=s.n.s[s.i+1]=sum/2;dkGem();dkAnvend();return}const bj=e.target.closest('.dk-faner');if(bj&&!e.target.closest('.dk-fx')){const zo=bj.closest('.dk-zone');DK.stor=DK.stor===zo.dataset.z?null:zo.dataset.z;dkAnvend()}});
 ws.addEventListener('click',dkKnap,true);
 ws.addEventListener('keydown',e=>{const f=e.target.closest&&e.target.closest('.dk-fane');if(!f)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){const F=[...f.closest('.dk-faner').querySelectorAll('.dk-fane')],i=F.indexOf(f),n=F[i+(e.key==='ArrowRight'?1:-1)];if(n){e.preventDefault();n.click();setTimeout(()=>{const x=document.querySelector('.dk-fane[data-w="'+n.dataset.w+'"]');if(x)x.focus()},0)}}});
 /* zonens vinduer kan ikke trækkes rundt som frie vinduer */
 ws.addEventListener('pointerdown',e=>{const h=e.target.closest('.dk-medlem > .wh');if(h&&!e.target.closest('button,select,input,label,a,textarea'))e.stopImmediatePropagation()},true);
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&DK.stor&&!document.fullscreenElement){DK.stor=null;dkAnvend();e.stopPropagation()}},true);
 document.addEventListener('fullscreenchange',()=>{document.querySelectorAll('.dk-zone').forEach(z=>z.classList.toggle('dk-fuld',document.fullscreenElement===z));setTimeout(()=>{try{window.dispatchEvent(new Event('resize'))}catch(e){}},60)});
 /* et vindue, der åbnes et andet sted fra (fx en knap, der sætter hidden=false), bliver en fane */
 setInterval(()=>{if(!DK.klar||DK.traek||DK.streg)return;let n=0;if(DK.laast!==!!set.laast){DK.laast=!!set.laast;n++}Object.keys(DK_NAVN).forEach(id=>{const w=$(id);if(!w||w.hidden||w.classList.contains('niv-skjult')||w.closest('.dk-zone'))return;const z=dkZoneAf(id);if(z){z.a=id}else{const q=dkZone(DK.sidst)||dkZoner(set.dock)[0];q.f.push(id);q.a=id}n++});if(n){dkGem();dkAnvend()}},500);
 /* topbjælken: ↺ Standard ved layoutene; Zoner og Bredt skrivebord findes ikke mere */
 const tb=$('lay3');if(tb&&!$('dk-std')){tb.insertAdjacentHTML('beforeend','<button class="ghost" id="dk-std" title="↺ Standard: sæt det valgte layout tilbage (dine ændringer i zonerne glemmes)">↺ Standard</button>');$('dk-std').onclick=()=>dkStandard()}
 ['zon-knap','bred-knap'].forEach(i=>{const b=$(i);if(b)b.hidden=true})}
setTimeout(dkStart,900);
/* ========== SLUT: DOCKING (VINDUESSYSTEM C) ========== */
