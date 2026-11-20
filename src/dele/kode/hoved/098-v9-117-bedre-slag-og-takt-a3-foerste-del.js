/* ========== v9.117: BEDRE SLAG OG TAKT (A3, FØRSTE DEL) ==========
   P8.30 trin 3. Målt før og efter på Testlyd (ens på alle pc'er) og Rigtige trommer (MDB Drums, 23 stykker); kun ændringer, der ikke skader de rigtige trommer, er med.
   d) Kick: før var kick stigningen i basbåndet målt i logaritmisk skala (log10(1 + 100 × niveau)). Et ekko, der kommer i næsten stilhed, stiger meget i den skala
      (et ekko 15 dB under kicket blev målt som 1,00), mens det rigtige kick midt i ekkoets hale stiger lidt (0,69). Nu regnes stigningen i lineær skala ud fra det
      samme basbånd (RAW.bas, også fra cachen), så ekkoet er lille. Testlyd 60 → 92, Rigtige trommer 63 → 70 (kun trommer 72 → 75).
   b) Taktslaget: når kicket tydeligt (1,6 gange mere) ligger midt mellem de fundne taktslag end på dem, flyttes taktslagene en halv slaglængde (de lå på modslaget,
      fx på en åben hihat). Testlyd 33 → 49 (kun trommer 33 → 81); Rigtige trommer 81 → 81 (kun trommer 77 → 85).
   a) Takt 1: før vandt den af fire pladser, der havde mest accent; i House er de næsten ens. Nu: kick minus ½ × snare (summen over fire rammer omkring slaget,
      så et slag mellem to rammer ikke taber) plus skift i klang og toner (12 toner, når de findes, ellers de fire brede bånd: to slag før mod to slag efter;
      akkorder og bas skifter oftest på takt 1). Fasens sikkerhed er afstanden mellem bedste og næstbedste plads. Testlyd kun trommer 0 → 76, hele lyden 33 → 31;
      Rigtige trommer 17 → 47 (kun trommer 6 → 40).
   Kan slås fra under Analyse → Avanceret → Indstillinger for analysen (set.a3 = false; så regnes alt som før). Live (Lyd ind, generatoren) er uændret.
   v9.123: fasens sikkerhed regnes nu som takternes enighed (blokken v9.123: FASENS SIKKERHED); A3.fd gemmer målingerne bag valget af takt 1. */
const A3={skift:null,fd:null};
function a3Til(){return !(typeof set!=='undefined'&&set&&set.a3===false)}
{const gl=applyNorm;window.applyNorm=function(){if(!a3Til()||!RAW||!RAW.bas)return gl.apply(this,arguments);const g=RAW.kick,b=RAW.bas,n=b.length,x=new Float32Array(n),o=new Float32Array(n);
 for(let i=0;i<n;i++)x[i]=Math.max(0,(Math.pow(10,b[i])-1)/100);for(let i=1;i<n;i++)o[i]=Math.max(0,x[i]-(x[i-1]*.5+(x[i-2]||0)*.5));RAW.kick=o;try{return gl.apply(this,arguments)}finally{RAW.kick=g}}}
{const gl=Rytme.taktslag;Rytme.taktslag=function(o,dtf,bpm,st){const b=gl(o,dtf,bpm,st);A3.skift=null;if(!a3Til()||b.length<8||typeof F==='undefined'||!F||!F.kick||F.kick.length!==o.length)return b;
 const n=F.kick.length,P=60/bpm/dtf,v=k=>{let m=0;for(let d=-1;d<=1;d++){const j=k+d;if(j>=0&&j<n)m=Math.max(m,F.kick[j]||0)}return m};let s0=0,s1=0;for(const k of b){s0+=v(k);const h=Math.round(k+P/2);if(h<n)s1+=v(h)}
 A3.skift={paa:s0,mellem:s1,flyttet:s1>s0*1.6};return A3.skift.flyttet?b.map(k=>Math.min(n-1,Math.round(k+P/2))):b}}
{const gl=Rytme.taktFase;Rytme.taktFase=function(acc,beats,pt){pt=pt||4;A3.fd=null;if(!a3Til()||typeof F==='undefined'||!F||!F.kick||!F.snare||beats.length<pt*3)return gl(acc,beats,pt);const n=F.kick.length;
 const sum=(a,k)=>{let m=0;for(let d=-1;d<=2;d++){const j=k+d;if(j>=0&&j<n)m+=a[j]||0}return m};
 const har=(typeof A!=='undefined'&&A&&A['ana:c0']&&A['ana:c0'].length===n)?Array.from({length:12},(_,c)=>A['ana:c'+c]):[F.bas,F.mid,F.hmid,F.brill];
 const vek=(k0,k1)=>{const v=har.map(()=>0);for(let k=Math.max(0,k0);k<Math.min(n,k1);k++)har.forEach((a,i)=>v[i]+=a[k]||0);const s=Math.hypot(...v)||1;return v.map(x=>x/s)};
 const B=beats.length,ac=[],nv=[];for(let i=0;i<B;i++){const k=beats[i];ac.push(sum(F.kick,k)-.5*sum(F.snare,k));if(i>=2&&i+2<B){const a=vek(beats[i-2],beats[i]),c=vek(beats[i],beats[i+2]);nv.push(Math.hypot(...a.map((x,j)=>x-c[j])))}else nv.push(null)}
 const z=arr=>{const s=new Float64Array(pt),c=new Int32Array(pt);arr.forEach((v,i)=>{if(v==null)return;s[i%pt]+=v;c[i%pt]++});const m=Array.from(s,(v,i)=>c[i]?v/c[i]:0),mu=m.reduce((a,b)=>a+b,0)/pt,sd=Math.sqrt(m.reduce((a,b)=>a+(b-mu)*(b-mu),0)/pt)||1;return m.map(x=>(x-mu)/sd)};
 const zA=z(ac),zN=z(nv),sc=zA.map((x,i)=>x+zN[i]);let bi=0;for(let i=1;i<pt;i++)if(sc[i]>sc[bi])bi=i;const so=sc.slice().sort((a,b)=>b-a);A3.fd={ac,nv,bi,pt,toner:har.length===12};return{fase:bi,konf:Math.max(0,Math.min(1,(so[0]-so[1])/2))}}}
{const gl=showAnalyser;window.showAnalyser=function(){A3.skift=null;const r=gl.apply(this,arguments);if(r){r.a3skift=!!(A3.skift&&A3.skift.flyttet);r.a3=a3Til()}return r}}
/* rækken i Indstillinger for analysen */
function a3Raekke(){const k=document.querySelector('#sg [data-sgk="indst"]');if(!k)return;const P=SHOWPROFIL,til=a3Til(),fk=P?Math.round((P.faseKonf||0)*100)/100:0,sig=[til,!!(P&&F),P&&P.a3skift,fk,P&&P.gitter].join('|'),g=k.querySelector('[data-a3r]');if(g&&g.dataset.sig===sig)return;if(g)g.remove();/* tegnes igen, når valget eller sangen skifter */const d=document.createElement('div');d.className='sg-r';d.dataset.a3r='1';d.dataset.sig=sig;
 d.innerHTML='<b>Bedre slag og takt (A3)</b><span class="small">Kick måles i lineær skala, så et ekko ikke ligner et slag; taktslaget flyttes en halv slaglængde, når kicket ligger mellem slagene; takt 1 findes ud fra kick, snare og skift i klang og toner. Fra = som før v9.117.'+(P&&F?' <b>Denne sang:</b> '+(P.gitter==='trommer'?'taktgitteret kommer fra Trommer-sporet (4 spor); ':'')+'taktslaget er '+(P.a3skift?'flyttet en halv slaglængde':'ikke flyttet')+'; fasens sikkerhed '+String(fk).replace('.',',')+a3FaseHvorfor(fk)+'.':'')+'</span><span class="sg-styr"><span class="ne-seg sg-seg" role="group"><button class="'+(til?'on':'ghost')+'" data-a3="1" aria-pressed="'+til+'" title="Standard">Til</button><button class="'+(til?'ghost':'on')+'" data-a3="0" aria-pressed="'+!til+'">Fra</button></span></span>';k.appendChild(d)}
{const gl=sgIndstTegn;window.sgIndstTegn=function(t){gl(t);try{a3Raekke()}catch(e){}}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-a3]');if(!b)return;const til=b.dataset.a3==='1';if(til)delete set.a3;else set.a3=false;try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}
 if(RAW){try{applyNorm();buildPeaks();renderTune();showUI()}catch(x){console.error(x)}}const r=document.querySelector('#sg [data-a3r]');if(r)r.remove();a3Raekke();try{asTegn()}catch(x){}
 msg('Bedre slag og takt (A3) er slået '+(til?'til':'fra')+'. '+(RAW?'Sangen er regnet om. ':'')+'Kør Analyse sikkerhed igen for at se tallene.')});
/* boblen ved Takt 1 siger, hvor sikker fasen er i den sang, der er indlæst */
{const gl=asBobleHtml;window.asBobleHtml=function(b){let t=gl(b);if(/^(ana:takt|hnd:takt4)$/.test(String(b))&&typeof SHOWPROFIL!=='undefined'&&SHOWPROFIL&&F){const fk=Math.round((SHOWPROFIL.faseKonf||0)*100)/100;t+='<br><span class="as-b-sv"><b>Din sang:</b> fasens sikkerhed '+String(fk).replace('.',',')+a3FaseHvorfor(fk,true)+'.</span>'}return t}}
{const gl=asRapport;window.asRapport=function(){return gl().replace(/\n/,'\nBedre slag og takt (A3): '+(a3Til()?'til':'fra')+'\n')}}
/* ========== SLUT: BEDRE SLAG OG TAKT (A3, FØRSTE DEL) ========== */


