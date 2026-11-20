/* ========== v9.22: NODE-EDITOR (TRIN 4): RET EN REGEL ==========
   Trin 4 af 16 (docs/PLAN-NODE-EDITOREN.md, papirets afsnit 5.6): en regel kan rettes i Node-editoren. Ændringerne skriver i de samme felter i maps
   som Mapping og Router (thr, gain, att, rel, hold/holdMs, hyst, curve, gap, slew, inv, port, portT, takt, spor), så de tre steder altid viser det samme.
   På noden: træk den gule tærskel-streg på måleren (Handling) eller de to hvide klemmer (Egenskab: mindst = tærsklen, mest = hvor udgangen når 1; at trække
   i "mest" ændrer styrken). Træk op og ned i styrke-tallet (×1,00). Vælgeren Handling ▾ / Egenskab ▾ gemmes i m.slags (kun når den er anderledes end
   det, der læses ud fra målet); den ændrer kun, hvordan reglen vises og stilles, ikke hvordan motoren regner.
   I kontrolpanelet: skydere til tærskel, styrke, attack, release og hold; små drejeknapper til de avancerede (hysterese, kurve, spærretid, slew);
   Vend om, Gate (kilde og Gate-tærskel; i Mapping: Port og Gate-tærskel), Taktslag og Spor (Auto eller Manuel med grunden) og Standard.
   Fortryd: Node-editoren bruger Form-editorens historik (FEH, 50 skridt): ↶ Fortryd og ↷ Gentag i værktøjslinjen, Ctrl+Z og Ctrl+Shift+Z (eller Ctrl+Y).
   Efter hver ændring kommer en kort besked med Fortryd (fagudtryk: toast).
   Værktøjslinjen: Normalisering: Adaptiv · Fast (samme som knappen Normalisering: Adaptiv · Fast) og Samlet styrke (samme som Radial Mesh' Samlet styrke).
   Mens man trækker, bygges noderne ikke om (NE2.laas); det sker, når man slipper. */
const NE4={toastT:0,traek:null};
function neEgM(m){return m&&m.slags?m.slags==='egenskab':neErEgenskab(m&&m.effect)}
/* Hvor udgangen når 1 for en Egenskab: v = tærskel + (1 − tærskel) · (1/styrke)^(1/kurve). */
function neMest(m){const thr=+m.thr||0,g=Math.max(1e-6,+m.gain||0),c=+(m.curve??1)||1;return Math.min(1,thr+(1-thr)*Math.pow(1/g,1/c))}
const NE4_FELT={thr:['Tærskel',0,1,.01,0,v=>neTal(v)],gain:['Styrke',0,2,.05,1,v=>'×'+neTal(v)],att:['Attack',1,600,1,20,v=>Math.round(v)+' ms'],rel:['Release',10,1500,5,200,v=>Math.round(v)+' ms'],
 hyst:['Hysterese',0,.3,.01,0,v=>v?neTal(v):'Fra'],curve:['Kurve',.3,3,.05,1,v=>neTal(v)],gap:['Spærretid',0,600,10,120,v=>Math.round(v)+' ms'],slew:['Slew',0,20,.5,0,v=>v?neTal(v)+'/s':'Fra'],portT:['Gate-tærskel',0,1,.01,.5,v=>neTal(v)]};
function ne4Vaerdi(m,f){if(f==='hold')return r2HoldIdx(m);if(f==='curve')return m.curve??1;if(f==='gap')return m.gap??120;if(f==='portT')return m.portT==null?.5:+m.portT;return +m[f]||0}
function ne4Tekst(m,f){if(f==='hold')return r2HoldTxt(r2HoldIdx(m));if(f==='inv')return m.inv?'Til':'Fra';if(f==='port')return m.port?neLtNavn(m.port):'Ingen';if(f==='takt')return m.takt?TAKT_TXT[m.takt]:'Auto';if(f==='spor')return m.spor==='mix'?'Samlet lyd':m.spor==='spor'?'Sporet':'Auto';if(f==='slags')return neEgM(m)?'Egenskab':'Handling';const d=NE4_FELT[f];return d?d[5](ne4Vaerdi(m,f)):String(m[f])}
const NE4_NAVN={hold:'Hold',inv:'Vend om',port:'Gate',takt:'Taktslag',spor:'Spor',slags:'Slags',std:'Standard'};
/* Sæt ét felt. slut = brugeren har sluppet (gem, Mapping og Router opdateres, besked med Fortryd, noderne bygges om). */
function ne4Saet(i,f,v,slut,foer){const m=maps[i];if(!m)return;if(foer==null)foer=ne4Tekst(m,f);
 if(f==='hold'){const ms=R2_HOLD[+v];m.hold=ms===Infinity;m.holdMs=ms===Infinity||!ms?0:ms}
 else if(f==='inv')m.inv=!!v;
 else if(f==='port'){if(v){m.port=v;if(m.portT==null)m.portT=.5}else{delete m.port}}
 else if(f==='takt'||f==='spor'){if(v)m[f]=v;else delete m[f]}
 else if(f==='slags'){if(v===(neErEgenskab(m.effect)?'egenskab':'handling'))delete m.slags;else m.slags=v}
 else if(f==='std'){Object.assign(m,R2_STD)}
 else m[f]=+v;
 try{save()}catch(e){}
 if(slut){try{renderMaps()}catch(e){}const efter=f==='std'?'':ne4Tekst(m,f);neToast((NE4_NAVN[f]||(NE4_FELT[f]||[f])[0])+(f==='std'?': kæden er sat tilbage (tærskel, styrke, attack og release er uændrede)':' '+foer+' → '+efter)+' · regel '+(i+1));NE2.laas=false;ne2Byg()}}
/* Kort besked med Fortryd */
function neToast(t,uden){let e=$('ne-toast');const fl=$('ne-flade');if(!e&&fl){e=document.createElement('div');e.id='ne-toast';e.className='ne-toast';e.setAttribute('role','status');fl.appendChild(e)}if(!e)return;
 e.innerHTML='<span>'+neHtml(t)+'</span>'+(uden?'':'<button class="ne-k" data-ne4="fortryd" title="Fortryd (Ctrl+Z)">Fortryd</button>');e.classList.add('ne-toast-vis');clearTimeout(NE4.toastT);NE4.toastT=setTimeout(()=>e.classList.remove('ne-toast-vis'),6000)}
function neFortryd(){try{feFortryd()}catch(e){}ne4Vlinje()}
function neGentag(){try{feGentag()}catch(e){}ne4Vlinje()}
/* Drejeknap (kun til de avancerede ting) */
function ne4Knap(m,f,graa,tip){const d=NE4_FELT[f],v=ne4Vaerdi(m,f),p=(v-d[1])/(d[2]-d[1]),a0=-135,a=a0+270*Math.max(0,Math.min(1,p)),R=13,rad=x=>(x-90)*Math.PI/180,pt=x=>[18+R*Math.cos(rad(x)),18+R*Math.sin(rad(x))],[x0,y0]=pt(a0),[x1,y1]=pt(a);
 return '<div class="ne-knap'+(graa?' ne-graa':'')+'" role="slider" tabindex="0" data-nf="'+f+'" aria-label="'+d[0]+'" aria-valuemin="'+d[1]+'" aria-valuemax="'+d[2]+'" aria-valuenow="'+v+'" title="'+neHtml(tip)+' Træk op eller ned, eller brug piletasterne (Shift = fint). Dobbeltklik: standard.">'
  +'<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="13" class="ne-kb"/>'+(p>0?'<path class="ne-kv" d="M'+x0.toFixed(1)+' '+y0.toFixed(1)+' A13 13 0 '+(a-a0>180?1:0)+' 1 '+x1.toFixed(1)+' '+y1.toFixed(1)+'"/>':'')+'<line x1="18" y1="18" x2="'+x1.toFixed(1)+'" y2="'+y1.toFixed(1)+'" class="ne-kl"/></svg><span>'+d[0]+'</span><b data-nv="'+f+'">'+d[5](v)+'</b></div>'}
function ne4Skyder(m,f,graa,tip){const d=f==='hold'?['Hold',0,R2_HOLD.length-1,1]:NE4_FELT[f],v=ne4Vaerdi(m,f);
 return '<label class="ne-sk'+(graa?' ne-graa':'')+'" title="'+neHtml(tip)+'"><span>'+d[0]+' <b data-nv="'+f+'">'+ne4Tekst(m,f)+'</b></span><input type="range" data-nf="'+f+'" min="'+d[1]+'" max="'+d[2]+'" step="'+d[3]+'" value="'+v+'"></label>'}
function ne4Seg(f,valg,akt,grund){return '<div class="ne-seg-r"><span class="ne-seg" role="group">'+valg.map(([v,n])=>'<button class="ne-k'+(akt===v?' ne-paa':'')+'" data-nseg="'+f+'" data-v="'+v+'" aria-pressed="'+(akt===v)+'">'+n+'</button>').join('')+'</span><small>'+grund+'</small></div>'}
/* Indstillingerne i kontrolpanelet (erstatter visningen fra trin 2) */
function ne4Indst(n){if(n.kol!=='regel')return '';const m=n.m,i=n.i,kl=r2Kl(m),S=(()=>{try{return stakFor(m,i)}catch(e){return null}})(),inf=m.hold&&!kl,sp=r2SpaerVirker(m);
 let h='<div class="ne-kp-ret" data-i="'+i+'"><div class="ne-sks">'+ne4Skyder(m,'thr',false,'Tærsklen: under den sker der intet. Den gule streg på noden; træk i den.'+(S&&S.thrAuto!=null?' Adaptiv tærskel er slået til, så tærsklen følger sangen (nu '+neTal(S.thr)+'); her stiller du din egen.':''))
  +ne4Skyder(m,'gain',false,'Styrke (gain): hvor kraftigt reglen svarer over tærsklen. Træk også i tallet på noden.')
  +ne4Skyder(m,'att',false,'Attack: hvor hurtigt effekten tænder.')+ne4Skyder(m,'rel',inf,inf?'Release bruges ikke, når Hold står på ∞.':'Release: hvor langsomt effekten slukker igen.')
  +ne4Skyder(m,'hold',kl,kl?'Hold virker ikke på klods-spor.':'Hold: når lyden falder, bliver niveauet stående så længe. ∞ = står fast til næste lyd.')+'</div>'
  +'<div class="ne-knapper">'+ne4Knap(m,'hyst',kl,kl?'Virker ikke på klods-spor. ':'Hysterese (fagudtryk: to tærskler): slukker først, når lyden er så meget under tærsklen, så den ikke flimrer.')
  +ne4Knap(m,'curve',false,'Kurve: 1 er lige. Over 1 tæller kun de kraftigste slag; under 1 viser også små udsving.')
  +ne4Knap(m,'gap',!sp,sp?'Spærretid (vores navn; fagudtryk: refractory period): mindste tid mellem to slag.':'Spærretid virker ikke her: kilden glider (har ikke slag).')
  +ne4Knap(m,'slew',kl,kl?'Virker ikke på klods-spor. ':'Slew (fagudtryk): hvor hurtigt udgangen højst må ændre sig, i hele udslag pr. sekund.')
  +'<label class="ne-flueben" title="Vend om: høj lyd giver lav effekt og omvendt."><input type="checkbox" data-nf="inv"'+(m.inv?' checked':'')+'> Vend om</label>'
  +'<button class="ne-k" data-ne4="std" title="Standard: vend om fra, hysterese fra, kurve 1, slew fra, spærretid 120 ms, hold fra. Tærskel, styrke, attack og release bliver.">Standard</button></div>';
 let ks=[];try{ks=r2Orden(r2AlleKilder())}catch(e){ks=BANDS.map(b=>b[0])}
 h+='<div class="ne-gate"><label title="Gate: reglen virker kun, når denne kilde er over Gate-tærsklen.">Gate <select data-nf="port"><option value="">Ingen</option>'+ks.map(k=>'<option value="'+neHtml(k)+'"'+(m.port===k?' selected':'')+'>'+neHtml(neLtNavn(k))+'</option>').join('')+(m.port&&!ks.includes(m.port)?'<option value="'+neHtml(m.port)+'" selected>'+neHtml(neLtNavn(m.port))+'</option>':'')+'</select></label>'
  +(m.port?ne4Skyder(m,'portT',false,'Gate-tærskel: reglen virker kun, når '+neLtNavn(m.port)+' er over den.'):'')+'</div>';
 try{if(taktValg(m))h+=ne4Seg('takt',[['','Auto'],['fil','Fra filen'],['live','Mens det spiller']],m.takt||'',taktGrund(m))}catch(e){}
 try{if(stemValg(m))h+=ne4Seg('spor',[['','Auto'],['mix','Samlet lyd'],['spor','Sporet']],m.spor||'',stemGrund(m))}catch(e){}
 h+='</div>';
 if(S&&S.lag)h+='<div class="ne-kp-stak" title="Styrke brugt (gain-stak, fagudtryk: gain staging)">Styrke brugt <b>'+neTal(S.styrke)+'</b> = '+S.lag.map(x=>'<span class="'+(x[2]||x===S.lag[0]?'':'ne-svag')+'">'+neHtml(String(x[0]).replace(/ \(.*\)/,''))+' '+neTal(x[1])+'</span>').join(' × ')+'</div>';
 return h}
{window.ne2Indst=function(n){return ne4Indst(n)}}
/* Værktøjslinjen: Fortryd, Gentag, Normalisering, Samlet styrke */
function ne4Vlinje(){const fy=document.querySelector('[data-ne4="fortryd"].ne-vk'),ge=document.querySelector('[data-ne4="gentag"].ne-vk');try{if(fy)fy.disabled=!FEH.u.length&&!FEH.afv;if(ge)ge.disabled=!FEH.r.length}catch(e){}
 const md=typeof mode!=='undefined'?mode:'auto';document.querySelectorAll('[data-ne4="norm"]').forEach(b=>{const on=b.dataset.v===md;b.classList.toggle('ne-paa',on);b.setAttribute('aria-pressed',on)});
 const s=$('ne-master'),g=typeof gmaster!=='undefined'?+gmaster:1;if(s&&document.activeElement!==s&&+s.value!==g){s.value=g}const t=$('ne-master-v');if(t)t.textContent='×'+neTal(g)}
function ne4Start(){const rod=$('ne'),vl=rod&&rod.querySelector('.ne-vlinje'),v=$('ne-verden'),kp=$('ne-kp');if(!vl||!v)return;
 const tr=vl.querySelector('.ne-trin');if(tr){tr.textContent='Node-editoren · docking og fuld skærm'}
 tr.insertAdjacentHTML('afterend','<button class="ne-k ne-vk" data-ne4="fortryd" title="Fortryd (Ctrl+Z): regler, figurer, trim, effekt-grupper, Samlet styrke og Normalisering. 50 skridt.">↶ Fortryd</button><button class="ne-k ne-vk" data-ne4="gentag" title="Gentag (Ctrl+Shift+Z eller Ctrl+Y)">↷ Gentag</button>');
 const luft=vl.querySelector('.ne-luft');luft.insertAdjacentHTML('afterend','<span class="ne-vgrp" title="Normalisering: hvordan målingerne gøres til 0–1. Adaptiv = sangens 99. percentil (i dag: Auto). Fast = en fast reference."><small>Normalisering</small><span class="ne-seg"><button class="ne-k" data-ne4="norm" data-v="auto">Adaptiv</button><button class="ne-k" data-ne4="norm" data-v="fast">Fast</button></span></span>'
  +'<label class="ne-vgrp ne-vgrp-master" title="Samlet styrke (master): ganges på alle regler. Det samme som Samlet styrke i Radial Mesh."><small>Samlet styrke</small><input type="range" id="ne-master" min="0" max="2" step=".05" value="1"><b id="ne-master-v">×1,00</b></label>');
 rod.addEventListener('click',e=>{const b=e.target.closest('[data-ne4]');if(!b)return;const k=b.dataset.ne4;
  if(k==='fortryd')neFortryd();else if(k==='gentag')neGentag();
  else if(k==='norm'){const md=typeof mode!=='undefined'?mode:'auto';if(b.dataset.v!==md){normSkift();neToast('Normalisering: '+(b.dataset.v==='auto'?'Adaptiv':'Fast')+' · skift tilbage med knappen',true)}ne4Vlinje()}
  else if(k==='std'){const box=b.closest('.ne-kp-ret');if(box)ne4Saet(+box.dataset.i,'std',1,true)}});
 rod.addEventListener('input',e=>{const t=e.target;if(t.id==='ne-master'){gmaster=+t.value;const mm=$('mmaster');if(mm){mm.value=gmaster;if(mm.nextElementSibling)mm.nextElementSibling.textContent=gmaster}try{save()}catch(x){}ne4Vlinje();return}
  const box=t.closest('.ne-kp-ret');if(!box||!t.dataset.nf||t.type==='checkbox'||t.tagName==='SELECT')return;const i=+box.dataset.i,f=t.dataset.nf;if(!NE4.foer){NE4.foer={f,t:ne4Tekst(maps[i],f)}}NE2.laas=true;ne4Saet(i,f,t.value,false);const b=box.querySelector('[data-nv="'+f+'"]');if(b)b.textContent=ne4Tekst(maps[i],f)});
 rod.addEventListener('change',e=>{const t=e.target;if(t.id==='ne-master'){neToast('Samlet styrke ×'+neTal(gmaster),true);return}const box=t.closest('.ne-kp-ret');if(!box||!t.dataset.nf)return;const i=+box.dataset.i,f=t.dataset.nf;
  const foer=NE4.foer&&NE4.foer.f===f?NE4.foer.t:null;NE4.foer=null;ne4Saet(i,f,t.type==='checkbox'?t.checked:t.value,true,foer)});
 /* segmenter (Taktslag, Spor) */
 rod.addEventListener('click',e=>{const b=e.target.closest('[data-nseg]');if(!b)return;const box=b.closest('.ne-kp-ret');if(box)ne4Saet(+box.dataset.i,b.dataset.nseg,b.dataset.v,true)});
 /* drejeknapper: træk op/ned, piletaster, dobbeltklik = standard */
 const knapSaet=(k,nv,slut)=>{const box=k.closest('.ne-kp-ret'),i=+box.dataset.i,f=k.dataset.nf,d=NE4_FELT[f];nv=Math.max(d[1],Math.min(d[2],Math.round(nv/d[3])*d[3]));nv=+nv.toFixed(4);if(!NE4.foer)NE4.foer={f,t:ne4Tekst(maps[i],f)};NE2.laas=true;ne4Saet(i,f,nv,false);const b=k.querySelector('[data-nv]');if(b)b.textContent=d[5](nv);k.setAttribute('aria-valuenow',nv);if(slut){const foer=NE4.foer.t;NE4.foer=null;ne4Saet(i,f,nv,true,foer)}};
 rod.addEventListener('pointerdown',e=>{const k=e.target.closest('.ne-knap');if(!k||e.button>0)return;e.preventDefault();const f=k.dataset.nf,d=NE4_FELT[f],box=k.closest('.ne-kp-ret'),i=+box.dataset.i,v0=ne4Vaerdi(maps[i],f),y0=e.clientY,x0=e.clientX;let sidst=v0;
  try{k.setPointerCapture(e.pointerId)}catch(x){}const mv=ev=>{sidst=v0+((y0-ev.clientY)+(ev.clientX-x0))/400*(d[2]-d[1])*(ev.shiftKey?.2:1)/* v9.38: 400 px for hele vejen (før 150), sidelæns tæller også */;knapSaet(k,sidst,false)},op=()=>{k.removeEventListener('pointermove',mv);k.removeEventListener('pointerup',op);if(NE4.foer)knapSaet(k,sidst,true)};k.addEventListener('pointermove',mv);k.addEventListener('pointerup',op)});
 rod.addEventListener('keydown',e=>{const k=e.target.closest&&e.target.closest('.ne-knap');if(k){const d=NE4_FELT[k.dataset.nf],dir={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1}[e.key];if(dir){e.preventDefault();e.stopPropagation();const i=+k.closest('.ne-kp-ret').dataset.i;knapSaet(k,ne4Vaerdi(maps[i],k.dataset.nf)+dir*d[3]*(e.shiftKey?1:2),true);return}}
  if((e.ctrlKey||e.metaKey)&&!e.altKey){const q=e.key.toLowerCase();if(q==='z'||q==='y'){if(e.target.closest&&e.target.closest('input[type=text],textarea'))return;e.preventDefault();e.stopPropagation();if(q==='y'||e.shiftKey)neGentag();else neFortryd()}}},true);
 rod.addEventListener('dblclick',e=>{const k=e.target.closest('.ne-knap');if(!k)return;knapSaet(k,NE4_FELT[k.dataset.nf][4],true)});
 /* på noden: Handling/Egenskab, tærsklen (og klemmerne) og styrken */
 v.addEventListener('change',e=>{const s=e.target.closest('select[data-nf="slags"]');if(!s)return;const nd=s.closest('.ne-node'),n=NE2.N.get(nd.dataset.n);if(n)ne4Saet(n.i,'slags',s.value,true)});
 v.addEventListener('pointerdown',e=>{const nd=e.target.closest('.ne-node');if(!nd||e.button>0)return;const n=NE2.N.get(nd.dataset.n);if(!n||n.kol!=='regel')return;
  const mt=e.target.closest('.ne-rm'),st=e.target.closest('.ne-styrke');if(!mt&&!st)return;e.stopPropagation();e.preventDefault();const m=maps[n.i];if(!m)return;if(NE2.valgt!==n.key)neVaelg(n.key);NE2.laas=true;try{nd.setPointerCapture(e.pointerId)}catch(x){}
  let f,foer,saet;
  if(mt){const r=mt.getBoundingClientRect(),x=ev=>Math.max(0,Math.min(1,(ev.clientX-r.left)/r.width));
   if(neEgM(m)){const mest=neMest(m);f=Math.abs(x(e)-mest)<Math.abs(x(e)-(+m.thr||0))&&x(e)>(+m.thr||0)?'mest':'thr'}else f='thr';foer=f==='mest'?ne4Tekst(m,'gain'):ne4Tekst(m,'thr');
   saet=ev=>{const v=+x(ev).toFixed(2);if(f==='thr'){ne4Saet(n.i,'thr',Math.min(v,.99),false);const p=(Math.min(v,.99)*100).toFixed(1)+'%';nd.querySelectorAll('.ne-thr,.ne-klemme:not(.ne-mest)').forEach(q=>q.style.left=p);const u=nd.querySelector('.ne-under');if(u)u.style.width=p}
    else{const thr=+m.thr||0,c=+(m.curve??1)||1;if(v>thr+.01){const g=Math.max(.05,Math.min(2,Math.pow((1-thr)/(v-thr),c)));ne4Saet(n.i,'gain',Math.round(g*100)/100,false);const b=nd.querySelector('.ne-styrke b');if(b)b.textContent='×'+neTal(m.gain)}}
    const q=nd.querySelector('.ne-mest');if(q)q.style.left=(neMest(m)*100).toFixed(1)+'%';neToastLive(f==='mest'?'Styrke ×'+neTal(m.gain)+' (mest ved '+neTal(neMest(m))+')':'Tærskel '+neTal(m.thr))};saet(e)}
  else{const y0=e.clientY,g0=+m.gain||0;f='gain';foer=ne4Tekst(m,'gain');saet=ev=>{const g=Math.max(0,Math.min(2,Math.round((g0+(y0-ev.clientY)/120)*20)/20));ne4Saet(n.i,'gain',g,false);const b=nd.querySelector('.ne-styrke b');if(b)b.textContent='×'+neTal(g);neToastLive('Styrke ×'+neTal(g))}}
  NE4.traek={nd,saet,f:f==='mest'?'gain':f,foer,i:n.i}});
 v.addEventListener('pointermove',e=>{const d=NE4.traek;if(d)d.saet(e)});
 const slip=()=>{const d=NE4.traek;if(!d)return;NE4.traek=null;ne4Saet(d.i,d.f,maps[d.i][d.f],true,d.foer)};v.addEventListener('pointerup',slip);v.addEventListener('pointercancel',slip);
 v.addEventListener('dblclick',e=>{const st=e.target.closest('.ne-styrke');if(!st)return;const n=NE2.N.get(st.closest('.ne-node').dataset.n);if(n)ne4Saet(n.i,'gain',1,true)});
 setInterval(ne4Vlinje,500);ne4Vlinje()}
function neToastLive(t){const e=$('ne-toast');if(e&&e.classList.contains('ne-toast-vis')){const s=e.querySelector('span');if(s)s.textContent=t}else neToast(t)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne4Start);else setTimeout(ne4Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 4): RET EN REGEL ========== */
