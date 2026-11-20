
/* ========== v9.126: LYDTIDSLINJEN (A4, FØRSTE DEL) ==========
   Plan A4 (hovedchattens "Den nye analyse P8.19"; Lydanalyse-kort v1.0): analysen som hændelser med tid og sikkerhed, som man kan se, høre og rette.
   - Hændelser (vores navn; fagudtryk: events/onsets): Kick, Snare og Hihat fra standard-reglen (samme som Analyse sikkerhed; med 4 spor fra Trommer-sporet) og
     Takt 1 fra taktgitteret. Hver hændelse har tid, styrke, sikkerhed og kilde. Sikkerheden er et skøn: for slagene tallet fra Analyse sikkerhed ganget med
     0,6 + 0,4 × hvor langt slaget når over tærsklen (svage slag tæt på tærsklen er mindre sikre); for Takt 1 fasens sikkerhed takt for takt (v9.123).
   - Lyd over tid får rækken Hændelser med fire baner. Hver hændelse er en streg; jo mere sikker, jo kraftigere. Rettede hændelser har en prik, nye en ring,
     slettede står svagt med et kryds (Dine rettelser).
   - Rettelser pr. sang (gemt i rytme-tl|navn|bytes, så de kommer med i Gem hele arbejdet og de automatiske kopier): klik på en streg vælger den; Slet (eller
     Delete, når du sidst har klikket i Lyd over tid), træk eller ← → flytter (10 ms; Shift 1 ms); dobbeltklik i en tom bane tilføjer; Fortryd rettelse; Nulstil rettelser (spørger først).
   - Hør analysen: et kort klik på hver hændelse, mens sangen spiller (kick dybt, snare sus, hihat højt, takt 1 en tone), så man kan høre, om analysen passer.
   - Gem tidslinje: én JSON-fil (format "lydtidslinje", version 1: sang {navn, bytes, laengde}, kurver (10 pr. sekund), haendelser [{spor, t, slut, styrke,
     sikkerhed, tone, ord, kilde}], afsnit, rettelser). Hent tidslinje: læser rettelserne fra en fil til den samme sang.
   - Næste del (A4): hændelserne som kilder til reglerne (med rettelserne), og hændelser fra en fil (det lokale modul, A5–A6). */
const TL={hoer:false,valgt:null,aktiv:false,raa:null,raaSig:'',cache:null,cacheSig:'',hist:[],sched:new Map(),sidstNu:-1,traek:null,ignKlik:false,stoej:null,
 SPOR:[['kick','Kick','hsl(15 85% 62%)'],['snare','Snare','hsl(200 80% 64%)'],['hihat','Hihat','hsl(55 85% 62%)'],['takt1','Takt 1','hsl(285 70% 72%)']],BH:14};
LOT.rk.splice(LOT.rk.findIndex(r=>r[0]==='takt')+1,0,['haend','Hændelser',TL.SPOR.length*TL.BH+6]);
{const gl=lotIndst;window.lotIndst=function(){const L=gl();if(L.rk&&L.rk.haend===undefined)L.rk.haend=true;return L}}
function tlNoegle(){const k=typeof SHOWKEY==='string'?SHOWKEY:'';if(!k)return null;if(k.startsWith('v3|')){const p=k.split('|');return 'rytme-tl|'+p[1]+'|'+p[2]}return 'rytme-tl|'+k}
function tlSang(){const k=typeof SHOWKEY==='string'?SHOWKEY:'',p=k.startsWith('v3|')?k.split('|'):null;return{navn:p?p[1]:(typeof SHOWNAVN!=='undefined'?SHOWNAVN:''),bytes:p?+p[2]:null,laengde:+(+dur||0).toFixed(3)}}
function tlRet(){const k=tlNoegle();if(k){try{const r=JSON.parse(localStorage.getItem(k)||'null');if(r&&Array.isArray(r.slet))return{slet:r.slet,flyt:r.flyt||[],ny:r.ny||[],dato:r.dato||0}}catch(e){}}return{slet:[],flyt:[],ny:[],dato:0}}
function tlRetGem(r,tekst){const k=tlNoegle();if(!k)return false;TL.hist.push(JSON.stringify(tlRet()));if(TL.hist.length>50)TL.hist.shift();r.dato=Date.now();let ok=false;try{ok=lsGem(k,JSON.stringify(r))!==false}catch(e){}TL.cacheSig='';LOT.offSig='';try{lotTegn();lotHoved()}catch(e){}if(tekst)msg(tekst);return ok}
/* hændelserne fra analysen (uden rettelser) */
function tlRaa(){if(typeof F==='undefined'||!F||!F.kick||!sr||typeof AS==='undefined')return null;const dtf=H/sr,P=SHOWPROFIL,sp=typeof STEM!=='undefined'&&STEM.klar&&STEM.F&&STEM.F.trommer,sig=[typeof fileVer!=='undefined'?fileVer:0,F.kick.length,P&&P.fase,P&&P.beats&&P.beats.length,P&&P.faseInfo&&P.faseInfo.ja,sp?1:0,AS.data&&AS.data.dato].join('|');
 if(TL.raa&&TL.raaSig===sig)return TL.raa;const E=[];
 ['kick','snare','hihat'].forEach(k=>{const T=sp&&STEM.F.trommer[k]&&Math.abs(STEM.F.trommer[k].length-F[k].length)<=2?STEM.F.trommer[k]:null,src=T||F[k],R=AS.REGEL[k],q=a2Sik(T?'stem:trommer:'+k:k),fast=q&&q.v!=null?q.v:null,kilde=T?'Trommer-sporet':'hele lyden';
  Rytme.slagtider(R,src,dtf,1,false).forEach(t=>{const f=Math.round(t/dtf)-1;let st=0;for(let d=-2;d<=2;d++){const v=+src[f+d]||0;if(v>st)st=v}const mar=Math.max(0,Math.min(1,(st-R.thr)/Math.max(.05,1-R.thr)));
   E.push({spor:k,t:+t.toFixed(3),styrke:+Math.min(1,st).toFixed(2),sikkerhed:fast==null?null:+(fast*(.6+.4*mar)).toFixed(2),kilde})})});
 if(P&&P.beats&&P.beats.length){const kv=a2FaseKurve();P.beats.forEach((k,i)=>{if(i%4!==P.fase)return;E.push({spor:'takt1',t:+((k+1)*dtf).toFixed(3),styrke:1,sikkerhed:kv?+(+kv[Math.min(kv.length-1,k)]).toFixed(2):null,kilde:P.gitter==='trommer'?'Trommer-sporet':'hele lyden'})})}
 E.sort((a,b)=>a.t-b.t);TL.raa=E;TL.raaSig=sig;return E}
/* hændelserne med dine rettelser */
function tlHaend(){const E=tlRaa();if(!E)return null;const R=tlRet(),sig=TL.raaSig+'|'+tlNoegle()+'|'+R.dato;if(TL.cache&&TL.cacheSig===sig)return TL.cache;const tol=.03,ud=[];
 E.forEach(e=>{if(R.slet.some(s=>s.spor===e.spor&&Math.abs(s.t-e.t)<=tol))return;const fl=R.flyt.find(s=>s.spor===e.spor&&Math.abs(s.fra-e.t)<=tol);ud.push(fl?Object.assign({},e,{t:fl.til,fra:e.t,kilde:'din rettelse (flyttet)'}):e)});
 R.ny.forEach(n=>ud.push({spor:n.spor,t:n.t,styrke:1,sikkerhed:1,kilde:'din rettelse (ny)',ny:true}));ud.sort((a,b)=>a.t-b.t);TL.cache=ud;TL.cacheSig=sig;return ud}
/* rettelser */
function tlFind(spor,t){const L=tlHaend()||[];let b=null,bd=1e9;L.forEach(e=>{if(e.spor!==spor)return;const d=Math.abs(e.t-t);if(d<bd){bd=d;b=e}});return b}
function tlSlet(e){if(!e)return;const R=tlRet();if(e.ny)R.ny=R.ny.filter(n=>!(n.spor===e.spor&&Math.abs(n.t-e.t)<.0005));else{const fra=e.fra!=null?e.fra:e.t;R.flyt=R.flyt.filter(s=>!(s.spor===e.spor&&Math.abs(s.fra-fra)<=.03));R.slet.push({spor:e.spor,t:fra})}TL.valgt=null;tlRetGem(R,tlNavn(e.spor)+' ved '+tlTid(e.t)+' er slettet. Fortryd rettelse fortryder.')}
function tlFlyt(e,til){if(!e)return;til=Math.max(0,Math.min(+dur||til,+til.toFixed(3)));const R=tlRet();if(e.ny){const n=R.ny.find(n=>n.spor===e.spor&&Math.abs(n.t-e.t)<.0005);if(n)n.t=til}else{const fra=e.fra!=null?e.fra:e.t;R.flyt=R.flyt.filter(s=>!(s.spor===e.spor&&Math.abs(s.fra-fra)<=.03));if(Math.abs(til-fra)>.0005)R.flyt.push({spor:e.spor,fra,til})}
 TL.valgt={spor:e.spor,t:til};tlRetGem(R,tlNavn(e.spor)+' er flyttet til '+tlTid(til)+'.')}
function tlNy(spor,t){const R=tlRet();t=+Math.max(0,t).toFixed(3);R.ny.push({spor,t});TL.valgt={spor,t};tlRetGem(R,tlNavn(spor)+' er tilføjet ved '+tlTid(t)+'.')}
function tlFortryd(){const s=TL.hist.pop();if(s==null){msg('Ingen rettelse at fortryde.');return}const k=tlNoegle();if(!k)return;try{lsGem(k,s)}catch(e){}TL.cacheSig='';LOT.offSig='';TL.valgt=null;try{lotTegn();lotHoved()}catch(e){}msg('Rettelsen er fortrudt.')}
async function tlNulstil(){const R=tlRet(),n=R.slet.length+R.flyt.length+R.ny.length;if(!n){msg('Der er ingen rettelser for denne sang.');return}const ok=await spoerg({titel:'Nulstil dine rettelser?',tekst:'Alle '+n+' rettelser for denne sang slettes (slettede, flyttede og nye hændelser). Fortryd rettelse kan hente dem igen.',ok:'Ja, nulstil',fare:true});if(!ok||!ok.ok){msg('Annulleret. Intet er ændret.');return}tlRetGem({slet:[],flyt:[],ny:[]},'Dine rettelser for denne sang er nulstillet.')}
function tlNavn(s){const x=TL.SPOR.find(q=>q[0]===s);return x?x[1]:s}
/* rækken Hændelser i Lyd over tid */
function tlRaekkeY(R){let y=14,ty=-1,th=0;(R||lotRaekker()).forEach(r=>{if(r.id==='haend'){ty=y;th=r.h}y+=r.h});return ty<0?null:{y:ty,h:th}}
{const gl=lotTegnFast;window.lotTegnFast=function(g,W,Hh,R,V){gl(g,W,Hh,R,V);try{const ry=tlRaekkeY(R);if(!ry)return;const L=tlHaend(),mute=css('--mute');g.save();g.font='10px Schibsted Grotesk,sans-serif';g.textBaseline='top';
 TL.SPOR.forEach(([s,n,c],j)=>{const y0=ry.y+3+j*TL.BH;g.fillStyle='rgba(255,255,255,.03)';g.fillRect(0,y0,W,TL.BH-2);g.fillStyle=mute;g.fillText(n,4,y0+1)});
 if(!L){g.fillStyle=mute;g.fillText('Hændelser: kommer, når sangen er analyseret',60,ry.y+4);g.restore();return}
 const R2=tlRet();R2.slet.forEach(d=>{const j=TL.SPOR.findIndex(q=>q[0]===d.spor);if(j<0)return;const x=tlX(d.t,W);if(x<0||x>W)return;const y0=ry.y+3+j*TL.BH;g.strokeStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(x-3,y0+2);g.lineTo(x+3,y0+TL.BH-4);g.moveTo(x+3,y0+2);g.lineTo(x-3,y0+TL.BH-4);g.stroke()});
 L.forEach(e=>{const j=TL.SPOR.findIndex(q=>q[0]===e.spor);if(j<0)return;const x=tlX(e.t,W);if(x<-2||x>W+2)return;const y0=ry.y+3+j*TL.BH,a=e.sikkerhed==null?.6:.2+.8*e.sikkerhed;g.globalAlpha=a;g.fillStyle=TL.SPOR[j][2];g.fillRect(Math.round(x)-1,y0+1,2,TL.BH-4);g.globalAlpha=1;
  if(e.fra!=null||e.ny){g.fillStyle='#fff';g.beginPath();g.arc(x,y0+TL.BH-4,e.ny?2.5:1.8,0,Math.PI*2);e.ny?(g.strokeStyle='#fff',g.stroke()):g.fill()}
  if(TL.valgt&&TL.valgt.spor===e.spor&&Math.abs(TL.valgt.t-e.t)<.0005){g.strokeStyle='#fff';g.lineWidth=1.5;g.strokeRect(Math.round(x)-3,y0,6,TL.BH-2);g.lineWidth=1}});
 if(TL.traek){const j=TL.SPOR.findIndex(q=>q[0]===TL.traek.e.spor),x=tlX(TL.traek.t,W),y0=ry.y+3+j*TL.BH;g.strokeStyle='#fff';g.setLineDash([2,2]);g.strokeRect(Math.round(x)-3,y0,6,TL.BH-2);g.setLineDash([])}
 g.restore()}catch(e){console.error(e)}}}
/* klik, dobbeltklik og træk i rækken Hændelser (før Lyd over tids eget klik, der hopper i sangen) */
function tlHit(ev){const c=$('lot');if(!c)return null;const r=c.getBoundingClientRect(),sx=c.width/(r.width||1),sy=c.height/(r.height||1),x=(ev.clientX-r.left)*sx,y=(ev.clientY-r.top)*sy,ry=tlRaekkeY();if(!ry||y<ry.y+3||y>=ry.y+3+TL.SPOR.length*TL.BH)return null;
 const j=Math.floor((y-ry.y-3)/TL.BH),spor=TL.SPOR[j][0],t=tlTrel(x/c.width),e=tlFind(spor,t),ex=e?tlX(e.t,c.width):null;return{spor,t,e:e&&Math.abs(ex-x)<=6*sx?e:null,sx}}
function tlKoble(){const k=document.querySelector('#sg [data-sgk="lot"]');if(!k||k.dataset.tl)return;k.dataset.tl='1';
 k.addEventListener('mousedown',ev=>{TL.aktiv=true;const h=tlHit(ev);if(!h||!h.e)return;ev.stopPropagation();TL.valgt={spor:h.e.spor,t:h.e.t};TL.traek={e:h.e,x0:ev.clientX,t:h.e.t,flyttet:false};LOT.offSig='';lotTegn();lotHoved()},true);
 k.addEventListener('click',ev=>{if(TL.ignKlik){TL.ignKlik=false;ev.stopPropagation();return}const h=tlHit(ev);if(h&&h.e){ev.stopPropagation()}},true);
 k.addEventListener('dblclick',ev=>{const h=tlHit(ev);if(!h||h.e)return;ev.stopPropagation();tlNy(h.spor,h.t)},true)}
window.addEventListener('mousemove',ev=>{const T=TL.traek;if(!T)return;const c=$('lot');if(!c)return;const r=c.getBoundingClientRect(),V=tlVis(),dt=(ev.clientX-T.x0)/(r.width||1)*(V.b-V.a);if(Math.abs(ev.clientX-T.x0)>2)T.flyttet=true;T.t=Math.max(0,T.e.t+dt);LOT.offSig='';lotTegn()});
window.addEventListener('mouseup',()=>{const T=TL.traek;if(!T)return;TL.traek=null;if(T.flyttet){TL.ignKlik=true;tlFlyt(T.e,T.t)}else{LOT.offSig='';lotTegn()}});
document.addEventListener('mousedown',ev=>{const k=document.querySelector('#sg [data-sgk="lot"]');if(k&&!k.contains(ev.target)&&!(ev.target.closest&&ev.target.closest('.tl-bar')))TL.aktiv=false},true);
document.addEventListener('keydown',ev=>{if(!TL.valgt||!TL.aktiv||/INPUT|SELECT|TEXTAREA/.test((document.activeElement||{}).tagName||''))return;const e=tlFind(TL.valgt.spor,TL.valgt.t);if(!e||Math.abs(e.t-TL.valgt.t)>.0005)return;
 if(ev.key==='Delete'||ev.key==='Backspace'){ev.preventDefault();tlSlet(e)}else if(ev.key==='ArrowLeft'||ev.key==='ArrowRight'){ev.preventDefault();tlFlyt(e,e.t+(ev.key==='ArrowLeft'?-1:1)*(ev.shiftKey?.001:.01))}else if(ev.key==='Escape'){TL.valgt=null;LOT.offSig='';lotTegn();lotHoved()}});
/* knapperne i hovedet af Lyd over tid */
{const gl=lotHoved;window.lotHoved=function(){gl();const h=document.querySelector('#sg [data-sgh="lot"]');if(!h)return;tlKoble();const e=TL.valgt&&tlFind(TL.valgt.spor,TL.valgt.t),v=e&&Math.abs(e.t-TL.valgt.t)<.0005?e:null,R=tlRet(),n=R.slet.length+R.flyt.length+R.ny.length;
 const b=document.createElement('span');b.className='tl-bar';b.innerHTML='<button data-tl="hoer" class="'+(TL.hoer?'on':'ghost')+'" aria-pressed="'+TL.hoer+'" title="Hør analysen: et kort klik på hver hændelse, mens sangen spiller (kick dybt, snare sus, hihat højt, takt 1 en tone)">'+(TL.hoer?'■ Hør analysen':'▶ Hør analysen')+'</button>'
  +(v?'<span class="small tl-valgt">Valgt: <b>'+neHtml(tlNavn(v.spor))+'</b> ved '+tlTid(v.t)+(v.sikkerhed!=null?' · sikkerhed '+String(v.sikkerhed).replace('.',','):'')+' · '+neHtml(v.kilde)+'</span><button class="ghost" data-tl="slet" title="Slet hændelsen (Delete)">Slet</button><button class="ghost" data-tl="v" title="Flyt 10 ms tilbage (←; Shift = 1 ms)">←</button><button class="ghost" data-tl="h" title="Flyt 10 ms frem (→; Shift = 1 ms)">→</button>':'<span class="small">Klik på en streg i Hændelser for at vælge den; dobbeltklik i en tom bane tilføjer.</span>')
  +'<button class="ghost" data-tl="fortryd"'+(TL.hist.length?'':' disabled')+' title="Fortryd den sidste rettelse">Fortryd rettelse</button><button class="ghost" data-tl="nulstil"'+(n?'':' disabled')+' title="Slet alle dine rettelser for denne sang (spørger først)">Nulstil rettelser'+(n?' ('+n+')':'')+'</button><button class="ghost" data-tl="gem" title="Gem hele tidslinjen som én JSON-fil (lydtidslinje)">Gem tidslinje</button><button class="ghost" data-tl="hent" title="Hent rettelserne fra en tidslinje-fil til den samme sang">Hent tidslinje</button>';
 h.appendChild(b)}}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-tl]');if(!b)return;const k=b.dataset.tl,e=TL.valgt&&tlFind(TL.valgt.spor,TL.valgt.t);
 if(k==='hoer'){TL.hoer=!TL.hoer;TL.sched.clear();lotHoved();msg(TL.hoer?'Hør analysen: et klik på hver hændelse, når sangen spiller.':'Hør analysen er slået fra.')}else if(k==='slet')tlSlet(e);else if(k==='v'||k==='h'){if(e)tlFlyt(e,e.t+(k==='v'?-.01:.01))}
 else if(k==='fortryd')tlFortryd();else if(k==='nulstil')tlNulstil();else if(k==='gem')tlGem();else if(k==='hent'){let i=$('tl-fil');if(!i){i=document.createElement('input');i.type='file';i.id='tl-fil';i.accept='.json,application/json';i.hidden=true;document.body.appendChild(i);i.addEventListener('change',()=>{const f=i.files[0];i.value='';if(f)tlHent(f)})}i.click()}});
/* Hør analysen: korte klik, planlagt lidt frem i tiden */
function tlKlik(spor,at){const c=typeof actx!=='undefined'?actx:null;if(!c)return;const g=c.createGain();g.connect(c.destination);const v=.22;
 if(spor==='kick'||spor==='takt1'){const o=c.createOscillator();o.frequency.value=spor==='kick'?70:1500;o.connect(g);g.gain.setValueAtTime(v,at);g.gain.exponentialRampToValueAtTime(.001,at+(spor==='kick'?.09:.06));o.start(at);o.stop(at+.1)}
 else{if(!TL.stoej){const b=c.createBuffer(1,Math.round(c.sampleRate*.08),c.sampleRate),d=b.getChannelData(0);let s=12345;for(let i=0;i<d.length;i++){s=(s*16807)%2147483647;d[i]=s/1073741823.5-1}TL.stoej=b}
  const n=c.createBufferSource();n.buffer=TL.stoej;const f=c.createBiquadFilter();f.type=spor==='snare'?'bandpass':'highpass';f.frequency.value=spor==='snare'?1800:7000;n.connect(f);f.connect(g);g.gain.setValueAtTime(v*(spor==='hihat'?.6:1),at);g.gain.exponentialRampToValueAtTime(.001,at+(spor==='hihat'?.03:.07));n.start(at);n.stop(at+.08)}}
setInterval(()=>{if(!TL.hoer||typeof playing==='undefined'||!playing||(typeof live!=='undefined'&&live)||typeof actx==='undefined'||!actx)return;const t=now();if(t<TL.sidstNu-.05)TL.sched.clear();TL.sidstNu=t;const L=tlHaend();if(!L)return;
 const til=t+.15;for(const e of L){if(e.t<t-.01)continue;if(e.t>til)break;const id=e.spor+'@'+e.t;if(TL.sched.has(id))continue;TL.sched.set(id,1);tlKlik(e.spor,actx.currentTime+Math.max(0,e.t-t))}if(TL.sched.size>2000)TL.sched.clear()},25);
/* JSON: gem og hent */
function tlJson(){const E=tlHaend()||[],P=SHOWPROFIL,dtf=H/sr,kurve=a=>{if(!a)return null;const st=Math.max(1,Math.round(.1/dtf)),o=[];for(let i=0;i<a.length;i+=st)o.push(+(+a[i]||0).toFixed(3));return o};
 const toner=(typeof TONER!=='undefined'&&Array.isArray(TONER)?TONER:[]).map(x=>({spor:'tone',t:+(+x.t).toFixed(3),slut:null,styrke:null,sikkerhed:x.klar!=null?+(+x.klar).toFixed(2):null,tone:x.midi,ord:null,kilde:'tonehøjde (trin 2)'}));
 return{format:'lydtidslinje',version:1,program:'Claude MV v'+asVersion(),gemt:new Date().toISOString(),sang:tlSang(),
  kurver:{hz:10,rms:kurve(F&&F.rms),energi:kurve(A&&A['ana:energi']),taktslag:kurve(A&&A['ana:taktslag'])},
  haendelser:E.map(e=>({spor:e.spor,t:e.t,slut:null,styrke:e.styrke,sikkerhed:e.sikkerhed,tone:null,ord:null,kilde:e.kilde})).concat(toner).sort((a,b)=>a.t-b.t),
  afsnit:(P&&P.sektioner||[]).map(q=>({t0:+(+q.t0).toFixed(2),t1:+(+(q.t1!=null?q.t1:0)).toFixed(2),navn:q.navn,energi:+(+q.energi||0).toFixed(2)})),rettelser:(()=>{const r=tlRet();delete r.dato;return r})()}}
function tlGem(){if(!tlRaa()){msg('Der er ingen analyseret sang endnu.');return}const J=tlJson(),s=JSON.stringify(J),a=document.createElement('a'),u=URL.createObjectURL(new Blob([s],{type:'application/json'}));a.href=u;a.download=(J.sang.navn||'sang').replace(/\.[^.]+$/,'').replace(/[\\/:*?"<>|]/g,'_')+'.lydtidslinje.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);
 msg('Tidslinjen er gemt: '+J.haendelser.length+' hændelser, '+J.afsnit.length+' afsnit og dine rettelser ('+Math.round(s.length/1024)+' KB).')}
async function tlHent(f){let J=null;try{J=JSON.parse(await f.text())}catch(e){}if(!J||J.format!=='lydtidslinje'||!J.rettelser){msg('Filen er ikke en lydtidslinje fra Claude MV.');return false}const S=tlSang();
 if(!tlNoegle()||(J.sang&&J.sang.bytes!=null&&S.bytes!=null&&(J.sang.bytes!==S.bytes||J.sang.navn!==S.navn))){msg('Tidslinjen hører til en anden sang ('+((J.sang&&J.sang.navn)||'ukendt')+'). Hent den sang først.');return false}
 const r=J.rettelser,n=(r.slet||[]).length+(r.flyt||[]).length+(r.ny||[]).length,ok=await spoerg({titel:'Hent rettelserne fra filen?',tekst:'Filen har '+n+' rettelser til '+(S.navn||'sangen')+'. Dine nuværende rettelser bliver erstattet (Fortryd rettelse kan hente dem igen).',ok:'Ja, hent'});
 if(!ok||!ok.ok){msg('Annulleret. Intet er ændret.');return false}return tlRetGem({slet:r.slet||[],flyt:r.flyt||[],ny:r.ny||[]},'Rettelserne er hentet fra filen ('+n+').')}
/* knapperne og klikkene sættes på med det samme (Lyd over tid er bygget, før denne blok er læst) og igen, hvis hovedet bygges om */
setTimeout(()=>{try{tlKoble();lotHoved()}catch(e){}},0);setInterval(()=>{try{const h=document.querySelector('#sg [data-sgh="lot"]');if(h&&!h.querySelector('.tl-bar'))lotHoved();tlKoble()}catch(e){}},1000);
/* ========== SLUT: LYDTIDSLINJEN (A4, FØRSTE DEL) ========== */
