/* ========== v9.23: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER ==========
   Trin 5 af 16 (docs/PLAN-NODE-EDITOREN.md, papirets afsnit 6, forløb 1): nye regler laves ved at trække et link.
   - Træk fra udgangen (●) på et lydtræk eller på en analyses række og slip på et tomt sted: Tilføj-listen (vores navn) viser kun det, der passer
     (Regel · Handling eller Regel · Egenskab). Reglen lægges, hvor man slap, som en kladde (vores navn), der sover, fordi den mangler et mål.
     Kladden ligger kun i Node-editoren (NE5.kladder), ikke i maps, så resten af programmet aldrig ser en forbindelse uden mål.
   - Træk videre fra reglens udgang og slip på en figur (eller en effekt-gruppe): en menu med figurens mål. Når et mål er valgt, kommer reglen
     i maps med de samme standardværdier som "+ Ny forbindelse" i Router, og den står straks i Mapping og Router.
   - Genveje: slip et lydtræk direkte på en figur (menuen kommer med det samme); slip på et Mål (reglen får det mål); slip på en eksisterende regel
     (den får ny kilde) eller på dens gate-port nederst til venstre (Gate).
   - Slå fra / Slå til (fagudtryk: bypass) og Slet i kontrolpanelet; Delete-tasten sletter den valgte regel. Alt kan fortrydes (Ctrl+Z).
   - Esc afbryder et træk eller en menu. Ingen fast id er nødvendig: når en regel får nyt mål eller ny kilde, flyttes dens gemte plads med. */
const NE5={traek:null,kladder:[],n:0,menu:null};
const NE5_NY={thr:.3,gain:1,att:20,rel:200,curve:1,gap:120,min:true};
/* Modellen: kladderne som regel-noder, der sover */
{const gl=ne2Model;window.ne2Model=function(){const R=gl(),N=R.N,L=R.L;NE5.kladder.forEach(k=>{if(!k.band){N.set(k.key,{key:k.key,kol:'regel',kladde:k,i:-1,m:{band:'',effect:'',thr:.3,gain:1,att:20,rel:200,curve:1,gap:120,slags:k.slags},regler:[]});return}const lk='l:'+k.band;let lt=N.get(lk);
  if(!lt){lt={key:lk,kol:'lydtraek',band:k.band,regler:[]};N.set(lk,lt);try{const h=ne3Hjem(k.band);if(h&&N.has(h[0])){L.push({fra:h[0],fp:h[1],til:lk,tp:'ind',kilde:h[0].startsWith('k:')?'k':'a',band:k.band});lt.hjem=h[0]}}catch(e){}}
  lt.regler.push(k.key);N.set(k.key,{key:k.key,kol:'regel',kladde:k,i:-1,m:{band:k.band,effect:'',thr:NE5_NY.thr,gain:1,att:20,rel:200,curve:1,gap:120,slags:k.slags},lt:lk,regler:[]});
  L.push({fra:lk,fp:'ud',til:k.key,tp:'ind',type:neLtType(k.band),kilde:'l'})});return R}}
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){if(!n.kladde)return gl(n);const k=n.kladde,w=+NE.tema.maal.bredde.bred||440;
 return '<div class="ne-node ne-n-regel ne-kladde" data-n="'+neHtml(n.key)+'" tabindex="0" role="button" aria-label="Ny regel uden mål" style="--nf:var(--ne-kolonne-regel);width:'+w+'px"><div class="ne-nh"><b class="ne-nt">Regel · '+(k.slags==='egenskab'?'Egenskab':'Handling')+' · ny</b><span class="ne-maerker"><span class="ne-m">Sover</span></span></div>'
  +'<div class="ne-skaerm"><span class="ne-mtekst">Mangler et mål. Træk fra udgangen ● til en figur eller et mål.</span></div><div class="ne-bund">'+(k.band?'Fra '+neHtml(neLtNavn(k.band)):'Mangler kilde: slip et lydtræk på den')+' · bliver til en regel, når den har et mål</div><i class="ne-port ind" data-p="ind"></i><i class="ne-port ud" data-p="ud"></i></div>'}}
{const gl=ne2Saetning;window.ne2Saetning=function(n){if(n.kladde)return 'Den nye regel fra <b class="ne-s-lydtraek">'+neHtml(neLtNavn(n.kladde.band))+'</b> mangler et mål. Træk fra dens udgang ● og slip på en figur, en effekt-gruppe eller et mål. Indtil da sover den og findes kun her (ikke i Mapping).';return gl(n)}}
{const gl=ne2Indst;window.ne2Indst=function(n){if(n.kladde)return '<div class="ne-kp-ret ne-kp-kladde"><button class="ne-k" data-ne5="slet-kladde" data-k="'+neHtml(n.key)+'">Slet den nye regel</button></div>';
 let h=gl(n);if(n.kol==='regel'&&n.m&&n.i>=0){const m=n.m;h=h.replace('<div class="ne-kp-ret" data-i="'+n.i+'">','<div class="ne-kp-ret" data-i="'+n.i+'"><div class="ne-ret-knapper"><button class="ne-k" data-ne5="sluk" data-i="'+n.i+'" title="Slå fra: reglen står stille (fagudtryk: bypass), men bliver stående. Slå til igen med samme knap.">'+(m.off?'Slå til':'Slå fra')+'</button><button class="ne-k ne-farlig" data-ne5="slet" data-i="'+n.i+'" title="Slet reglen (Delete). Kan fortrydes med Ctrl+Z.">Slet regel</button></div>')}return h}}
/* Hvor en port er på skærmen, og hvilken port musen er over */
function ne5PortPunkt(n,p){const q=n&&n.porte&&n.porte[p];return q?[NE.x+(n.x+q[0])*NE.z,NE.y+(n.y+q[1])*NE.z]:null}
function ne5Tegn(g){const d=NE5.traek;if(!d)return;const F=NE2.farver,p0=d.p0,p1=d.p1;if(!p0||!p1)return;const dx=Math.max(40,Math.abs(p1[0]-p0[0])*.5);g.save();g.strokeStyle=F.valgt;g.lineWidth=2;g.setLineDash([7,5]);g.globalAlpha=.9;g.beginPath();g.moveTo(p0[0],p0[1]);g.bezierCurveTo(p0[0]+dx,p0[1],p1[0]-dx,p1[1],p1[0],p1[1]);g.stroke();g.restore()}
/* Små menuer på lærredet (Tilføj-listen og målene) */
function ne5Luk(){const e=$('ne-menu');if(e)e.remove();NE5.menu=null}
function ne5Menu(x,y,titel,grupper,valgt,soeg){ne5Luk();const fl=$('ne-flade');const e=document.createElement('div');e.id='ne-menu';e.className='ne-menu';e.setAttribute('role','menu');
 e.innerHTML='<div class="ne-menu-t">'+neHtml(titel)+'</div>'+(soeg?'<input class="ne-menu-s" type="text" placeholder="Søg …" aria-label="Søg i listen">':'')+'<div class="ne-menu-l">'+grupper.map(([gn,items])=>(gn?'<div class="ne-menu-g">'+neHtml(gn)+'</div>':'')+items.map(([v,t,tip])=>'<button class="ne-menu-i" role="menuitem" data-v="'+neHtml(v)+'" title="'+neHtml(tip||t)+'">'+neHtml(t)+'</button>').join('')).join('')+'</div><button class="ne-menu-x ne-k" data-v="">Annullér · Esc</button>';
 fl.appendChild(e);const W=fl.clientWidth,H=fl.clientHeight;e.style.left=Math.max(8,Math.min(W-e.offsetWidth-8,x))+'px';e.style.top=Math.max(8,Math.min(H-e.offsetHeight-8,y))+'px';
 e.addEventListener('pointerdown',ev=>ev.stopPropagation());e.addEventListener('click',ev=>{const b=ev.target.closest('[data-v]');if(!b)return;ev.stopPropagation();const v=b.dataset.v;ne5Luk();if(v)valgt(v)});
 const s=e.querySelector('.ne-menu-s');if(s){s.addEventListener('input',()=>{const q=s.value.toLowerCase();e.querySelectorAll('.ne-menu-i').forEach(b=>b.hidden=!!q&&!b.textContent.toLowerCase().includes(q));e.querySelectorAll('.ne-menu-g').forEach(g=>{let x=g.nextElementSibling,vis=false;while(x&&x.classList.contains('ne-menu-i')){if(!x.hidden)vis=true;x=x.nextElementSibling}g.hidden=!vis})});setTimeout(()=>s.focus(),0)}
 else{const f=e.querySelector('.ne-menu-i');if(f)setTimeout(()=>f.focus(),0)}NE5.menu=e;return e}
/* Målene for en figur eller en effekt-gruppe, i grupper */
function ne5Maal(fk){try{syncTargets()}catch(e){}const ud=[];const grp={};TARGETS.forEach(t=>{if(neFigurAf(t.id).key!==fk)return;let g='';if(t.id.startsWith('obj:')){const p=t.id.split(':')[3];g=(t.gnavn&&t.gnavn!==(NE2.N.get(fk)||{}).navn)?t.gnavn:'Egenskaber'}else if(t.id.startsWith('liv:'))g='Levende kopier';
 (grp[g]=grp[g]||[]).push([t.id,neMaalNavn(t.id)+(maps.some(m=>m.effect===t.id)?' · har regler':''),t.navn])});Object.keys(grp).forEach(g=>ud.push([g,grp[g]]));return ud}
/* Gem en ny regel i maps */
/* v9.54: en regel til en figurs egenskab kan kun ses, når egenskabens Fra og Til er forskellige (udsvinget). Er de ens, får egenskaben et:
   danserens bevægelser deres standard (DANS_STD, som danserKobl), andre egenskaber det samme som Kobl i Editoren (ensureSwing), ellers hele vejen til den fjerneste ende.
   neUdenUdsving siger, om en regel ikke kan ses; neUdsving giver udsvinget og svarer true, hvis noget blev ændret. Et udsving, der findes, røres ikke. */
function neEgAf(effect){const d=String(effect).split(':');if(d[0]!=='obj')return null;const o=fase2.objekter.find(x=>x.id===d[1]),e=o&&o.lag[+d[2]]&&o.lag[+d[2]].egenskaber&&o.lag[+d[2]].egenskaber[d[3]];return e?{o,li:+d[2],p:d[3],e}:null}
function neUdenUdsving(effect){const q=neEgAf(effect);return !!q&&Number.isFinite(+q.e.fra)&&+q.e.fra===+q.e.til}
function neUdsving(effect){if(!neUdenUdsving(effect))return false;const {o,li,p,e}=neEgAf(effect),s=typeof DANS_STD!=='undefined'?DANS_STD[p]:null;
 if(s){e.fra=s[4];e.til=s[5]}else{try{ensureSwing(o,li,p)}catch(x){}}
 if(+e.fra===+e.til){const d=typeof PROPS!=='undefined'?PROPS[p]:null;if(d&&Number.isFinite(d[1])&&Number.isFinite(d[2])&&d[1]!==d[2])e.til=+e.fra>(d[1]+d[2])/2?d[1]:d[2]}
 if(+e.fra===+e.til)return false;try{persistObj()}catch(x){}try{formUI()}catch(x){}return true}
function ne5Ny(band,effect,slags,pos){const m0=Object.assign({band,effect},NE5_NY);if(slags&&slags!==(neErEgenskab(effect)?'egenskab':'handling'))m0.slags=slags;const m=Regler.find(Regler.tilfoej(m0));
 const n=maps.filter(x=>x.band===band&&x.effect===effect).length,key='r:'+band+'|'+effect+'|'+n;if(pos){NE.pos[key]=pos;neGem()}
 const uds=neUdsving(effect);NE2.valgt=key;neToast('Ny regel: '+neLtNavn(band)+' → '+neMaalNavn(effect)+(uds?' · udsving '+neEgRange(effect):''));ne2Byg();return m}
/* Når en regel skifter kilde eller mål, flyttes dens plads (nøglen er kilde|mål|nummer) */
function ne5Flyt(i,fn){const m=maps[i];if(!m)return;const ny=()=>{const t={};let k=null;maps.forEach((x,j)=>{const p=x.band+'|'+x.effect;t[p]=(t[p]||0)+1;if(j===i)k='r:'+p+'|'+t[p]});return k};const k0=ny();fn(m);const k1=ny();
 if(k0&&k1&&k0!==k1&&NE.pos[k0]){NE.pos[k1]=NE.pos[k0];delete NE.pos[k0];neGem()}if(NE2.valgt===k0)NE2.valgt=k1;try{save();renderMaps()}catch(e){}ne2Byg()}
function ne5Kladde(band,slags,x,y){const k={key:'d:'+(++NE5.n),band,slags};NE5.kladder.push(k);NE.pos[k.key]=[x,y];NE2.valgt=k.key;ne2Byg();neToast('Ny regel fra '+neLtNavn(band)+': træk fra dens udgang ● til en figur',true);return k}
function ne5SletKladde(key){NE5.kladder=NE5.kladder.filter(k=>k.key!==key);delete NE.pos[key];if(NE2.valgt===key)NE2.valgt=null;ne2Byg()}
/* Slip: hvad ligger under musen? */
function ne5Slip(d,ev){const el=document.elementFromPoint(ev.clientX,ev.clientY),nd=el&&el.closest&&el.closest('#ne-verden .ne-node'),mal=nd&&NE2.N.get(nd.dataset.n),fl=$('ne-flade').getBoundingClientRect(),
  wx=Math.round(((ev.clientX-fl.left-NE.x)/NE.z)/8)*8,wy=Math.round(((ev.clientY-fl.top-NE.y)/NE.z)/8)*8,mx=ev.clientX-fl.left,my=ev.clientY-fl.top;
 if(d.type==='kilde'){const band=d.band;
  if(!mal){ne5Menu(mx,my,'Tilføj · fra '+neLtNavn(band),[['Regel',[['handling','Regel · Handling','Slår til én gang, når lyden rammer (fx Hop).'],['egenskab','Regel · Egenskab','Følger lyden hele tiden (fx en arms vinkel).']]]],v=>ne5Kladde(band,v,wx,wy));return}
  if(mal.kol==='figur'){ne5Menu(mx,my,'Mål på '+mal.navn+' · fra '+neLtNavn(band),ne5Maal(mal.key),v=>ne5Ny(band,v,null,null),true);return}
  if(mal.kol==='maal'){ne5Ny(band,mal.effect,null,null);return}
  if(mal.kol==='regel'&&mal.kladde){mal.kladde.band=band;NE2.valgt=mal.key;ne2Byg();neToast('Den nye regel får kilden '+neLtNavn(band)+'; træk nu fra dens udgang til en figur',true);return}
  if(mal.kol==='regel'&&mal.i>=0){const gate=el.closest('.ne-port.gate');ne5Flyt(mal.i,m=>{if(gate){m.port=band;if(m.portT==null)m.portT=.5}else m.band=band});neToast((gate?'Gate':'Ny kilde')+' for regel '+(mal.i+1)+': '+neLtNavn(band));return}
  return}
 if(d.type==='regel'){const n=d.n;if(!mal)return;
  const saetMaal=effect=>{if(n.kladde&&!n.kladde.band){neToast('Den nye regel mangler en kilde: slip først et lydtræk på den',true);return}if(n.kladde){const pos=NE.pos[n.key];NE5.kladder=NE5.kladder.filter(k=>k!==n.kladde);delete NE.pos[n.key];ne5Ny(n.kladde.band,effect,n.kladde.slags,pos)}else{const foer=neMaalNavn(maps[n.i].effect);ne5Flyt(n.i,m=>{m.effect=effect});neToast('Regel '+(n.i+1)+': mål '+foer+' → '+neMaalNavn(effect))}};
  if(mal.kol==='figur'){ne5Menu(mx,my,'Mål på '+mal.navn,ne5Maal(mal.key),saetMaal,true);return}
  if(mal.kol==='maal'){saetMaal(mal.effect);return}}}
function ne5Start(){const v=$('ne-verden'),fl=$('ne-flade'),rod=$('ne');if(!v)return;
 v.addEventListener('pointerdown',e=>{const p=e.target.closest('.ne-port.ud');if(!p||e.button>0)return;const nd=p.closest('.ne-node'),n=NE2.N.get(nd.dataset.n);if(!n)return;let d=null;
  if(n.kol==='lydtraek')d={type:'kilde',band:n.band};else if(n.kol==='analyse'||n.kol==='lydkilde'){const k=String(p.dataset.p||'');if(k.startsWith('o:'))d={type:'kilde',band:k.slice(2)};else if(k.startsWith('s:'))return;else return}
  else if(n.kol==='regel')d={type:'regel',n};if(!d)return;e.stopPropagation();e.preventDefault();d.p0=ne5PortPunkt(n,p.dataset.p);const r=fl.getBoundingClientRect();d.p1=[e.clientX-r.left,e.clientY-r.top];NE5.traek=d;NE2.laas=true;try{p.setPointerCapture(e.pointerId)}catch(x){}ne5Luk();neLinjerTegn()},true);
 v.addEventListener('pointermove',e=>{const d=NE5.traek;if(!d)return;const r=fl.getBoundingClientRect();d.p1=[e.clientX-r.left,e.clientY-r.top];neLinjerTegn()},true);
 v.addEventListener('pointerup',e=>{const d=NE5.traek;if(!d)return;NE5.traek=null;NE2.laas=false;neLinjerTegn();e.stopPropagation();const dist=Math.hypot(d.p1[0]-d.p0[0],d.p1[1]-d.p0[1]);if(dist<12)return;ne5Slip(d,e)},true);
 rod.addEventListener('click',e=>{const b=e.target.closest('[data-ne5]');if(!b)return;const k=b.dataset.ne5,i=+b.dataset.i;
  if(k==='sluk'&&maps[i]){const m=maps[i];m.off=!m.off;if(!m.off)delete m.off;try{save();renderMaps()}catch(x){}neToast('Regel '+(i+1)+(maps[i].off?' er slået fra (står stille)':' er slået til igen'));ne2Byg()}
  else if(k==='slet'&&maps[i])ne5Slet(i);else if(k==='slet-kladde')ne5SletKladde(b.dataset.k)});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(NE5.menu||NE5.traek)){NE5.traek=null;NE2.laas=false;ne5Luk();neLinjerTegn();e.stopPropagation();return}
  if((e.key==='Delete'||e.key==='Backspace')&&NE2.valgt&&!/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||'')&&e.target.closest&&e.target.closest('#ne')&&!e.target.closest('#ne-mx,#mx-bj,#mx-vaelg')){const n=NE2.N.get(NE2.valgt);if(!n||n.kol!=='regel')return;e.preventDefault();e.stopPropagation();if(n.kladde)ne5SletKladde(n.key);else ne5Slet(n.i)}},true);
 fl.addEventListener('pointerdown',e=>{if(NE5.menu&&!e.target.closest('#ne-menu'))ne5Luk()})}
function ne5Slet(i){const m=maps[i];if(!m)return;const navn=neLtNavn(m.band)+' → '+neMaalNavn(m.effect);NE2.valgt=null;Regler.sletNr(i);neToast('Regel '+(i+1)+' slettet ('+navn+')');ne2Byg()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne5Start);else setTimeout(ne5Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER ========== */
