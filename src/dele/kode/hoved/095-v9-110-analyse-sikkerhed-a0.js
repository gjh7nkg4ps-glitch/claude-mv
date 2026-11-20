/* ========== v9.110: ANALYSE SIKKERHED (A0) ==========
   Hovedchattens besked P8.24 (planen "Den nye analyse P8.19", trin A0; fagudtryk: evaluation). Måler, hvor sikkert analysen finder det, den siger, den finder.
   - (v9.115: lyden regnes nu i ren matematik af assPlan, assStemme og assMaster; se kommentaren ved dem. Resten af dette punkt gælder til v9.114.)
   - Facit er generatoren: asRender spiller 6 faste mønstre (AS.M: forskellige tempi, med og uden bas og melodi, ét med akkord-flade og ét med støj) i en
     OfflineAudioContext (sekunder, ikke minutter) og skriver ned, hvor hvert slag, taktslag og hver tone er. Generatorens egne indstillinger (pat, bpm, gs,
     vol, mute, curGen, set.eq, UDG) byttes kun ud, mens lydgrafen bygges (i samme tråd, uden pauser), og sættes tilbage med det samme. Tilfældige tal
     (støjen i snare og hihat) kommer fra et fast frø, så to kørsler giver samme tal.
   - Analysen er programmets egen: atKoer (baggrunds-trådene; analyze og analyzeAna, hvis de ikke virker), applyNorm, anaNorm og showAnalyser (asNorm bytter
     RAW, F, A, ARAW, SHOWPROFIL, sr, dur og mode ud i samme tråd og sætter dem tilbage, så sangen, der er indlæst, ikke røres).
   - Slag (Kick, Snare, Hihat): programmets standard-regel (DEFAULT: tærskel 0,30 / 0,35, attack 8 ms, release 120 / 100 ms, spærretid 120 ms) gennem
     slagtider(); et slag er ramt inden for ±50 ms. Taktslag og Takt (første slag) læses fra ana:taktslag og ana:takt; ramt inden for ±70 ms.
     Sikkerhed = F-mål (fagudtryk: F-measure) = 2 × ramte / (2 × ramte + falske + oversete), i procent.
   - Kurver (Tonehøjde, Toneklasse, de 12 toner): procent af tiden rigtig; tonehøjden er rigtig inden for en halv tone.
   - "Kun trommerne" (som et perfekt Trommer-spor) giver tallene for stem:trommer:kick, snare og hihat.
   - Ren matematik (bånd, styrke, klang, stereo) får 99 og teksten "præcis måling". Det, generatoren ikke har facit for (Vokal, afsnit, akkorder), får "?".
   - Resultatet gemmes i localStorage (rytme-asik) med programmets versionsnummer og en kort historik, så to versioner kan sammenlignes.
   - Skærmen: en cirkel med tallet i matrixens rækkehoved (⏻ · navn · dB · cirkel; data-asb), en boble når man peger, klik åbner Analyse → Analyse sikkerhed
     ved rækken. Fanen (data-sgf="sikker") har samlet sikkerhed for de lydtræk, showet bruger, og tabellen. Detektion (v9.95) er uændret og kan åbnes herfra.
   - 4 spor (brugerens valg b): et spor over cirka 15 minutter læses ikke ind; der kommer en venlig besked i stedet for en fejl (asVarighed læser længden
     fra filens hoved, før noget afkodes). */
const AS={T0:.5,TAKTER:8,SR:44100,TOL:.05,TOLT:.07,SPOR_MAX:900,koerer:false,kunBrug:false,usikre:false,vis:{},aaben:{},data:null,frem:'',
 GS:{swing:0,root:9,scale:'minpent',bw:'sawtooth',lw:'square',cut:3000,echo:.25,dens:.5,kdec:.35,steps:16,oct:0,motor:'ny',pad:false,fill:false,rum:.25},
 REF:{},
 VOL:[1,.8,.7,.5,.5,.7,.8,.6],LEAD:{0:1,3:3,6:5,8:4,11:3,14:1},
 REGEL:{kick:{thr:.3,gain:1,att:8,rel:120,curve:1,gap:120},snare:{thr:.3,gain:1,att:8,rel:120,curve:1,gap:120},hihat:{thr:.35,gain:1,att:8,rel:100,curve:1,gap:120}},
 M:[{id:'house-t',navn:'House 124 · kun trommer',genre:'house',bpm:124,kun:'trommer',froe:11},
  {id:'house',navn:'House 124 · bas og melodi',genre:'house',bpm:124,froe:12},
  {id:'hip',navn:'Hip-hop 90 · bas og melodi',genre:'hip',bpm:90,froe:13},
  {id:'dnb',navn:'Drum and bass 172 · bas og melodi',genre:'dnb',bpm:172,froe:14},
  {id:'techno',navn:'Techno 132 · bas, melodi og akkord-flade',genre:'techno',bpm:132,pad:true,froe:15},
  {id:'brk',navn:'Breakbeat 140 · bas, melodi og støj',genre:'brk',bpm:140,stoej:.25,froe:16}],
 MAT:/^(bas|mid|hmid|brill|rms|centroid|flux|rolloff|flat|zcr|ana:ls\d+|ana:pan|ana:bredde|ana:fase|ana:dissonans|ana:rigdom|ana:ulige|ana:spredning|ana:energi|ana:lyshed|ana:anslag|ana:legato|ana:peak)$/,
 VIA:{'hnd:takt':'ana:taktslag','hnd:takt4':'ana:takt','ana:taktfase':'ana:taktslag','stem:trommer:ana:taktfase':'stem:trommer:ana:taktslag'},
 HOVED:[['kick','Kick'],['snare','Snare'],['hihat','Hihat'],['ana:taktslag','Taktslag'],['ana:takt','Takt 1'],['ana:pitch','Tonehøjde'],['x:bastone','Basens tone'],['stem:trommer:kick','Trommer · Kick'],['stem:trommer:ana:taktslag','Trommer · Taktslag'],['stem:bas:ana:pitch','Bas · Tonehøjde'],['stem:vokal:ana:pitch','Melodi alene · Tonehøjde']],
 X:{'x:bastone':'Basens tone · hele lyden','x:toner':'De 12 toner (gennemsnit)','x:toner:bas':'De 12 toner · kun bassen (gennemsnit)','x:toner:vokal':'De 12 toner · kun melodien (gennemsnit)','stem:bas:ana:pitch':'Tonehøjde · Bas (basens tone på Bas-sporet)','stem:vokal:ana:pitch':'Tonehøjde · Vokal (målt på testlydens melodi alene)'}};
try{const d=JSON.parse(localStorage.getItem('rytme-asik')||'null');if(d&&d.lyd==='test')AS.data=d;else if(d){AS.data=null;AS.gamHist=d.hist||[]}}catch(e){AS.data=null}/* v9.115: tal fra før v9.115 er målt på generatorens lyd; kun deres historik beholdes */
function asVersion(){const m=/v(\d+\.\d+)/.exec(document.title);return m?m[1]:'?'}
function asFroe(s){return()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function asPat(M){const T=LM.TROM[M.genre],p=TR.map(()=>Array(32).fill(0)),c={X:2,x:1,g:3};for(let r=0;r<5;r++)for(let q=0;q<16;q++)p[r][q]=c[T[r][q]]||0;
 if(M.kun!=='trommer'){for(let q=0;q<16;q++)p[6][q]=T[5][q]==='x'?1:0;for(const q in AS.LEAD)p[7][+q]=AS.LEAD[q]}return p}

/* v9.115 (P8.30 trin 1, V8): testlyden regnes i ren matematik af programmet selv (assPlan, assStemme, assMaster) i stedet for i browserens lydmotor.
   Grunden: browserens lydmotor regnede generatorens lyd en anelse forskelligt fra pc til pc og fra gang til gang (brugerens rapport 20. november), så tallene
   ikke kunne sammenlignes. Her bruges kun almindelig regning med faste frø, så lyden er bit for bit ens overalt; fingeraftrykket (S.fp) i rapporten viser det.
   Samme 6 mønstre, tempi, toner og frø som før. Lydene efterligner generatorens (lmVoice og mkMaster): kick med tone, der falder, og klik; snare (to trekanter
   og støj); klap; lukket og åben hihat (seks firkanter og støj; den lukkede kvæler den åbne); bas (to savtakker gennem et filter, der lukker, og en sinus under,
   som kvæles af den næste); melodi (tre firkanter med vibrato); akkord-flade i Techno. Mesteren: ekko på 3/16 (det, der narrer Kick), rum (egen rumklang med
   samme energi som browserens, 0,077), kompressor, begrænser og blød klipning. Testen er ikke gjort lettere. */
const ASS={SR:44100,rvSkala:0};
const assBlep=(t,dt)=>t<dt?(t/=dt,t+t-t*t-1):t>1-dt?(t=(t-1)/dt,t*t+t+t+1):0;
function assFlt(type,f,q){const o={x1:0,x2:0,y1:0,y2:0,k:null};o.set=f=>{const w=2*Math.PI*Math.max(1,Math.min(f,ASS.SR/2-1))/ASS.SR,c=Math.cos(w),s=Math.sin(w),a=type==='bandpass'?s/(2*q):s/(2*Math.pow(10,q/20)),a0=1+a;
  o.k=type==='lowpass'?[(1-c)/2/a0,(1-c)/a0,(1-c)/2/a0,-2*c/a0,(1-a)/a0]:type==='highpass'?[(1+c)/2/a0,-(1+c)/a0,(1+c)/2/a0,-2*c/a0,(1-a)/a0]:[a/a0,0,-a/a0,-2*c/a0,(1-a)/a0]};
 o.run=x=>{const k=o.k,y=k[0]*x+k[1]*o.x1+k[2]*o.x2-k[3]*o.y1-k[4]*o.y2;o.x2=o.x1;o.x1=x;o.y2=o.y1;o.y1=y;return y};o.set(f);return o}
/* en lydstyrke-kurve som i Web Audio: ['set',tid,værdi] · ['lin',tid,værdi] · ['exp',tid,værdi]; tiden er fra stemmens start */
function assAut(E,tau){let pv=0,pt=0;for(let i=0;i<E.length;i++){const e=E[i];if(tau<e[1]){if(e[0]==='lin')return pv+(e[2]-pv)*(tau-pt)/Math.max(1e-9,e[1]-pt);if(e[0]==='exp'&&pv>0)return pv*Math.pow(e[2]/pv,(tau-pt)/Math.max(1e-9,e[1]-pt));return pv}pv=e[2];pt=e[1]}return pv}
const assEnv=(a,att,til)=>[['set',0,0],['lin',att,a],['exp',til,.0008]];
/* planen: hvornår hver lyd spilles (som playStep) og facit (som før) */
function assPlan(M,variant){const sd=60/M.bpm/4,T=AS.TAKTER*16,t0=AS.T0,len=t0+sd*T+1.5;
 const g={pat,bpm,gs,vol,mute,curGen},S={sd,t0,slut:t0+sd*T,len,kick:[],snare:[],hihat:[],beat:[],takt:[],toner:[]},E=[];let G;
 try{pat=asPat(M);bpm=M.bpm;curGen=M.genre;gs=Object.assign({},AS.GS,{pad:!!M.pad&&variant==='alt'});vol=AS.VOL.slice();
  mute=TR.map((_,r)=>variant==='trommer'?r>5:variant==='bas'?r!==6:variant==='lead'?r!==7:false);G={echo:gs.echo,rum:gs.rum,kdec:gs.kdec,cut:gs.cut,bl:LM.TROM[M.genre][6]};
  for(let i=0;i<T;i++){const q=i%16,tt=t0+i*sd,ak=lmAkkord(Math.floor(i/16)),paa=r=>!!pat[r][q]&&!mute[r];
   if(q===0&&gs.pad)E.push({r:'pad',t:tt,len:sd*16,toner:[0,2,4].map(j=>lmDiaTone(48,ak.deg+j))});
   for(let r=0;r<8;r++){if(!paa(r))continue;const v=pat[r][q];E.push({r,t:tt,note:r>5?lmTone(r,v,ak.deg):r===5?lmDiaTone(48,ak.deg+4):0,vl:vol[r]*lmVel(r,v)})}
   if(paa(0))S.kick.push(tt);if(paa(1)||paa(2))S.snare.push(tt);if(paa(3)||paa(4))S.hihat.push(tt);if(q%4===0)S.beat.push(tt);if(q===0)S.takt.push(tt);
   if(paa(6)){const b=tt+Math.max(.08,sd*LM.TROM[M.genre][6]),f=S.toner.filter(x=>x.k==='bas').pop();if(f&&f.b>tt)f.b=tt;const bm=lmTone(6,pat[6][q],ak.deg);S.toner.push({k:'bas',a:tt,b,m:mtof(bm)>70?bm-12:bm})}/* sinussen under bassen er bassens dybeste tone */
   if(paa(7))S.toner.push({k:'lead',a:tt,b:tt+Math.max(.12,sd*2.2),m:lmTone(7,pat[7][q],ak.deg)});
   if(q===0&&gs.pad)[0,2,4].forEach(j=>S.toner.push({k:'pad',a:tt,b:tt+sd*16,m:lmDiaTone(48,ak.deg+j)}))}
 }finally{pat=g.pat;bpm=g.bpm;gs=g.gs;vol=g.vol;mute=g.mute;curGen=g.curGen}
 /* den lukkede hihat kvæler den åbne; den næste bastone kvæler den forrige */
 E.forEach((e,i)=>{if(e.r===4){const n=E.find((x,j)=>j>i&&x.r===3&&x.t>e.t);if(n&&n.t-e.t<.43)e.choke=n.t-e.t}if(e.r===6){const L=Math.max(.08,sd*G.bl),n=E.find((x,j)=>j>i&&x.r===6&&x.t>e.t);if(n&&n.t<e.t+L)e.choke=n.t-e.t}});
 return{S,E,G,sd}}
function assStemme(D,R,e,G,NB,sd){const SR=ASS.SR,t=e.t,i0=Math.max(0,Math.floor(t*SR)),vl=e.vl,tc=e.choke;
 const run=(dur,fn)=>{const i1=Math.min(D.length,Math.ceil((t+dur)*SR));for(let i=i0;i<i1;i++){const tau=i/SR-t;if(tau>=0)fn(i,tau,i-i0)}};
 if(e.r===0){const til=G.kdec+.08,Eo=assEnv(1.05*vl,.002,til),Ec=assEnv(.45*vl,.0005,.014),hp=assFlt('highpass',2500,1),tn=Math.tanh(2.2);let ph=0;
  run(G.kdec+.15,(i,tau,j)=>{const f=tau<.09?165*Math.pow(46/165,tau/.09):46;ph+=f/SR;ph-=Math.floor(ph);const x=Math.max(-1,Math.min(1,Math.sin(2*Math.PI*ph)*assAut(Eo,tau)));let y=Math.tanh(2.2*x)/tn;if(tau<.03)y+=hp.run(NB[j])*assAut(Ec,tau);D[i]+=y})}
 else if(e.r===1){const O=[[185,.5,.11],[330,.28,.07]].map(([f,a,dd])=>({f,dd,E:assEnv(a*vl,.001,dd),ph:0})),bp=assFlt('bandpass',3200,.7),hp=assFlt('highpass',1200,1),En=assEnv(.75*vl,.001,.2);
  run(.25,(i,tau,j)=>{let y=0;for(const o of O){if(tau<o.dd+.05){const f=tau<o.dd?o.f*Math.pow(.82,tau/o.dd):o.f*.82;o.ph+=f/SR;o.ph-=Math.floor(o.ph);y+=(1-4*Math.abs(o.ph-.5))*assAut(o.E,tau)}}const n=hp.run(bp.run(NB[j]))*assAut(En,tau);D[i]+=y+n;R[i]+=n*.22})}
 else if(e.r===2){const E=[['set',0,0]];[0,.011,.022,.034].forEach((dt,k)=>{E.push(['set',dt,.9*vl]);E.push(['exp',dt+(k<3?.009:.22),k<3?.12*vl:.0008])});const bp=assFlt('bandpass',1250,1.6);
  run(.3,(i,tau,j)=>{const n=bp.run(NB[j])*assAut(E,tau);D[i]+=n;R[i]+=n*.4})}
 else if(e.r===3||e.r===4){const aab=e.r===4,dur=aab?.38:.07,E=assEnv((aab?.5:.6)*vl,.001,dur),F=[205.3,304.4,369.6,522.7,540,800],ph=[0,0,0,0,0,0],bp=assFlt('bandpass',9000,.6),h8=assFlt('highpass',8000,1),hp=assFlt('highpass',6500,1);
  run(dur+.05,(i,tau,j)=>{let s=0;for(let k=0;k<6;k++){const dt=F[k]/SR;let p=ph[k]+dt;p-=Math.floor(p);ph[k]=p;s+=(p<.5?1:-1)+assBlep(p,dt)-assBlep((p+.5)%1,dt)}let g=assAut(E,tau);if(tc!=null&&tau>=tc)g=assAut(E,tc)*Math.exp(-(tau-tc)/.008);const y=hp.run(bp.run(s)*3.2+h8.run(NB[j])*.45)*g;D[i]+=y;R[i]+=y*(aab?.15:.05)})}
 else if(e.r===6){const f=mtof(e.note),len=Math.max(.08,sd*G.bl),base=Math.min(G.cut*.22,1100)+90,lp=assFlt('lowpass',base*4.5,5),E=[['set',0,0],['lin',.004,.42*vl],['set',len*.7,.42*vl],['exp',len,.0008]],fs=f/(f>70?2:1),f1=f*Math.pow(2,-7/1200),f2=f*Math.pow(2,7/1200);let p1=0,p2=0,ps=0;
  run(len+.05,(i,tau,j)=>{if((j&15)===0)lp.set(tau<.14?base*4.5*Math.pow(1/4.5,tau/.14):base);const d1=f1/SR,d2=f2/SR;p1+=d1;p1-=Math.floor(p1);p2+=d2;p2-=Math.floor(p2);ps+=fs/SR;ps-=Math.floor(ps);
   let g=assAut(E,tau);if(tc!=null&&tau>=tc)g=assAut(E,tc)*Math.exp(-(tau-tc)/.006);D[i]+=(lp.run((2*p1-1-assBlep(p1,d1))+(2*p2-1-assBlep(p2,d2)))+Math.sin(2*Math.PI*ps)*.55)*g})}
 else if(e.r===7){const f=mtof(e.note),len=Math.max(.12,sd*2.2),c0=Math.min(12000,G.cut*1.8),c1=Math.max(300,G.cut*.7),lp=assFlt('lowpass',c0,2),E=[['set',0,0],['lin',.008,.2*vl],['exp',.15,.11*vl],['set',len,.11*vl],['exp',len+.25,.0008]],ph=[0,0,0],det=[-9,0,9];
  run(len+.3,(i,tau,j)=>{if((j&15)===0)lp.set(tau<.25?c0*Math.pow(c1/c0,tau/.25):c1);const vib=(tau<.25?7*tau/.25:7)*Math.sin(2*Math.PI*5.5*tau);let s=0;for(let k=0;k<3;k++){const dt=f*Math.pow(2,(det[k]+vib)/1200)/SR;let p=ph[k]+dt;p-=Math.floor(p);ph[k]=p;s+=(p<.5?1:-1)+assBlep(p,dt)-assBlep((p+.5)%1,dt)}const y=lp.run(s)*assAut(E,tau);D[i]+=y;R[i]+=y*.3})}
 else if(e.r==='pad'){const len=e.len,lp=assFlt('lowpass',1100,.5),E=[['set',0,0],['lin',Math.min(.35,len*.3),.075],['set',len*.85,.075],['lin',len+.05,0]],O=[];e.toner.forEach(m=>{const f=mtof(m);[-6,6].forEach(c=>O.push({f:f*Math.pow(2,c/1200),p:0}))});
  run(len+.1,(i,tau)=>{let s=0;for(const o of O){const dt=o.f/SR;o.p+=dt;o.p-=Math.floor(o.p);s+=2*o.p-1-assBlep(o.p,dt)}const y=lp.run(s)*assAut(E,tau);D[i]+=y;R[i]+=y*.5})}}
/* rum: seks kamfiltre og tre allpas-filtre (Schroeder/Freeverb, fagudtryk) */
function assRum(x){const n=x.length,y=new Float64Array(n);for(const L of [1116,1188,1277,1356,1422,1491]){const b=new Float64Array(L);let j=0,lp=0;for(let i=0;i<n;i++){const o=b[j];lp=o*.8+lp*.2;b[j]=x[i]+lp*.88;y[i]+=o;j=j+1===L?0:j+1}}
 for(const L of [556,441,341]){const b=new Float64Array(L);let j=0;for(let i=0;i<n;i++){const o=b[j],v=y[i];y[i]=o-v;b[j]=v+o*.5;j=j+1===L?0:j+1}}return y}
function assKomp(x,thr,knee,ratio,att,rel){const SR=ASS.SR,aA=1-Math.exp(-1/(att*SR)),aR=1-Math.exp(-1/(rel*SR)),K=d=>d<thr-knee/2?d:(knee>0&&d<thr+knee/2)?d+(1/ratio-1)*Math.pow(d-thr+knee/2,2)/(2*knee):thr+(d-thr)/ratio,mk=Math.pow(10,-.6*K(0)/20);let env=0;
 for(let i=0;i<x.length;i++){const l=Math.abs(x[i]);env+=(l-env)*(l>env?aA:aR);if(env>1e-6){const d=20*Math.log10(env);x[i]*=Math.pow(10,(K(d)-d)/20)}x[i]*=mk}}
function assMaster(D,R,bp,G){const SR=ASS.SR,n=D.length,X=new Float64Array(n),L=Math.round(60/bp*.75*SR),dl=new Float64Array(n),w=G.echo*.7;
 if(!ASS.rvSkala){const im=new Float64Array(SR*3);im[0]=1;const r=assRum(im);let e=0;for(let i=0;i<r.length;i++)e+=r[i]*r[i];ASS.rvSkala=Math.sqrt(.077/e)}
 for(let i=0;i<n;i++){const m=.8*D[i],o=i>=L?dl[i-L]:0;dl[i]=m+.32*o;X[i]=m+w*o}
 const W=assRum(R),rv=G.rum*ASS.rvSkala;for(let i=0;i<n;i++)X[i]+=W[i]*rv;
 assKomp(X,-16,8,3,.008,.16);assKomp(X,-3,0,20,.002,.08);const hp=assFlt('highpass',10,1),Y=new Float32Array(n);for(let i=0;i<n;i++)Y[i]=hp.run(Math.tanh(1.5*Math.max(-1,Math.min(1,X[i]*.62))));return Y}
/* Spil ét mønster. variant: alt (hele lyden) · trommer · bas · lead. Giver lyden og facit (S). */
async function asRender(M,variant){await new Promise(r=>setTimeout(r,0));const P=assPlan(M,variant),S=P.S,SR=ASS.SR,n=Math.ceil(SR*S.len),D=new Float64Array(n),R=new Float64Array(n),NB=new Float64Array(SR),rn=asFroe(M.froe);for(let i=0;i<SR;i++)NB[i]=rn()*2-1;
 P.E.forEach(e=>assStemme(D,R,e,P.G,NB,S.sd));const b=new AudioBuffer({length:n,numberOfChannels:1,sampleRate:SR});b.copyToChannel(assMaster(D,R,M.bpm,P.G),0);
 if(M.stoej&&variant==='alt'){const d=b.getChannelData(0),r=asFroe(M.froe+100),i0=Math.floor(S.t0*AS.SR),i1=Math.min(d.length,Math.floor(S.slut*AS.SR));let q=0;for(let i=i0;i<i1;i++)q+=d[i]*d[i];
  const a=Math.sqrt(q/Math.max(1,i1-i0))*M.stoej*Math.sqrt(3);for(let i=0;i<d.length;i++)d[i]+=(r()*2-1)*a}
 /* fingeraftryk af lyden (16 bit), så man kan se, om to pc'er har regnet præcis den samme lyd */{const d=b.getChannelData(0);let hs=2166136261;for(let i=0;i<d.length;i++){const v=Math.max(-32768,Math.min(32767,Math.round(d[i]*32767)));hs=Math.imul(hs^(v&255),16777619);hs=Math.imul(hs^((v>>8)&255),16777619)}S.fp=(hs>>>0).toString(16).padStart(8,'0')}
 return{b,S}}
/* Programmets egen normalisering og takt-analyse på et prøvestykke, uden at røre den indlæste sang. Alt sker i samme tråd, uden pauser. */
function asNorm(R1,A1,srx,durx){let st='';try{st=$('status').textContent}catch(e){}
 const g={RAW,F,A,ARAW,TONER,TP,SHOWPROFIL,sr,dur,mode,fileVer,nl:NORM_LOKAL.aktiv};
 try{RAW=R1;ARAW=A1;sr=srx;dur=durx;mode='auto';A=null;SHOWPROFIL=null;applyNorm();if(!A1)showAnalyser();const P=SHOWPROFIL,r2=v=>Math.round((+v||0)*100)/100;return{F,A:A||{},f0:A1?A1.f0:null,dtf:H/srx,bpm:P?Math.round(P.bpm*10)/10:0,fase:P?P.fase:0,faseKonf:P?r2(P.faseKonf):0,tempoKonf:P?r2(P.tempoKonf):0,beats:P&&P.beats?P.beats.slice():[],flyt:!!(P&&P.a3skift)}}
 finally{RAW=g.RAW;F=g.F;A=g.A;ARAW=g.ARAW;TONER=g.TONER;TP=g.TP;SHOWPROFIL=g.SHOWPROFIL;sr=g.sr;dur=g.dur;mode=g.mode;fileVer=g.fileVer;NORM_LOKAL.aktiv=g.nl;try{$('status').textContent=st}catch(e){}}}
async function asAnalyse(b,trin2){const dele={toner:true,baand:true,klang:true,stereo:true},sr0=sr;let R1,A1=null;
 try{R1=await atKoer(b,1,dele);if(trin2)A1=await atKoer(b,2,dele)}catch(e){if(e&&e.message==='ANA_STOP')throw e;R1=await analyze(b);if(trin2)A1=await analyzeAna(b)}finally{sr=sr0}
 return asNorm(R1,A1,b.sampleRate,b.duration)}
function asMatch(sand,fund,tol){const u=new Set();let hit=0;sand.forEach(t=>{let bj=-1,bd=tol;fund.forEach((e,j)=>{if(u.has(j))return;const d=Math.abs(e-t);if(d<=bd){bd=d;bj=j}});if(bj>=0){u.add(bj);hit++}});return{hit,n:sand.length,fa:fund.length-hit,ov:sand.length-hit}}
function asF(o){const d=2*o.hit+o.fa+o.ov;return d?Math.round(200*o.hit/d):0}
function asSpring(a,dtf,S){const o=[];if(!a)return o;for(let k=1;k<a.length;k++)if(a[k]-a[k-1]>.3)o.push((k+1)*dtf);return o.filter(t=>t>=S.t0-.1&&t<=S.slut+.1)}
/* Kør hele testen. Giver resultatet og gemmer det. */
async function asKoer(){if(AS.koerer)return null;if(typeof NE2!=='undefined'&&NE2.analyserer){try{msg('Vent, til sangens analyse er færdig. Så kan testen køres.')}catch(e){}return null}
 AS.koerer=true;const t00=performance.now(),glFrem=anaFrem;let st0='';try{st0=$('status').textContent}catch(e){}
 const res={},thrS={};const led=(k,id,o)=>{const r=res[k]||(res[k]={hit:0,n:0,fa:0,ov:0,ret:0,okt:0,pm:[]});for(const x in o)if(typeof o[x]==='number')r[x]=(r[x]||0)+o[x];r.type=o.type;r.paa=o.paa;r.pm.push([id,o.type==='h'?asF(o):o.n?Math.round(100*o.ret/o.n):0])};
 AS.dbg=[];const job=[];AS.M.forEach(M=>{job.push([M,'alt']);if(M.kun!=='trommer')job.push([M,'trommer'])});AS.M.filter(M=>['house','hip','dnb'].includes(M.id)).forEach(M=>{job.push([M,'bas']);job.push([M,'lead'])});
 try{anaFrem=function(){};
  /* v9.115: testlyden regnes én ad gangen i samme tråd (ren regning), med en pause mellem hver, så siden kan tegnes */
  const LYD=[];for(let j=0;j<job.length;j++){AS.frem='Laver testlyden … '+(j+1)+' af '+job.length;asTegn();const tA=performance.now(),x=await asRender(job[j][0],job[j][1]);x.ms=Math.round(performance.now()-tA);LYD.push(x)}
  for(let j=0;j<job.length;j++){const[M,v]=job[j];AS.frem='Måler '+(j+1)+' af '+job.length+' …';asTegn();await new Promise(r=>setTimeout(r,0));
   const{b,S}=LYD[j],tB=performance.now(),tone=v!=='trommer'&&M.kun!=='trommer',N=await asAnalyse(b,tone),ind=t=>t>=S.t0-.1&&t<=S.slut+.1,dbg={id:M.id,v,bpm:N.bpm,fase:N.fase,sk:N.flyt,fk:N.faseKonf,tk:N.tempoKonf,rf:(()=>{/* den rigtige fase: hvilken af de fire pladser i taktslagene der ligger på takt 1 (facit) */const tb=N.beats.map(k=>(k+1)*N.dtf),c=[0,0,0,0];S.takt.forEach(T=>{let bi=-1,bd=AS.TOLT;tb.forEach((x,q)=>{const d=Math.abs(x-T);if(d<=bd){bd=d;bi=q}});if(bi>=0)c[bi%4]++});const m=Math.max(...c);return m?c.indexOf(m):null})(),render:LYD[j].ms,ana:Math.round(performance.now()-tB),sand:S,fund:{}};AS.dbg.push(dbg);
   if(v==='alt'||v==='trommer'){const trom=v==='trommer'||M.kun==='trommer';
    ['kick','snare','hihat'].forEach(k=>{const fund=Rytme.slagtider(AS.REGEL[k],N.F[k],N.dtf,1,false).filter(ind);dbg.fund[k]=fund;
     if(v==='alt')led(k,M.id,Object.assign({type:'h',paa:'Testlyd'},asMatch(S[k],fund,AS.TOL)));
     if(trom)led('stem:trommer:'+k,M.id,Object.assign({type:'h',paa:'Testlyd, kun trommerne'},asMatch(S[k],fund,AS.TOL)));
     /* bedste tærskel: for hele lyden og (P8.28) for trommerne alene */for(let q=2;q<=18;q++){const thr=q*.05,o=asMatch(S[k],Rytme.slagtider(Object.assign({},AS.REGEL[k],{thr}),N.F[k],N.dtf,1,false).filter(ind),AS.TOL);(v==='alt'?[k]:[]).concat(trom?['stem:trommer:'+k]:[]).forEach(kk=>{const z=(thrS[kk]=thrS[kk]||{})[q]||(thrS[kk][q]={hit:0,fa:0,ov:0});z.hit+=o.hit;z.fa+=o.fa;z.ov+=o.ov})}})}
   if(v==='trommer'||M.kun==='trommer'){led('stem:trommer:ana:taktslag',M.id,Object.assign({type:'h',paa:'Testlyd, kun trommerne'},asMatch(S.beat,asSpring(N.A['ana:taktslag'],N.dtf,S),AS.TOLT)));led('stem:trommer:ana:takt',M.id,Object.assign({type:'h',paa:'Testlyd, kun trommerne'},asMatch(S.takt,asSpring(N.A['ana:takt'],N.dtf,S),AS.TOLT)))}
   if(v==='alt'){dbg.fund.beat=asSpring(N.A['ana:taktslag'],N.dtf,S);dbg.fund.takt=asSpring(N.A['ana:takt'],N.dtf,S);led('ana:taktslag',M.id,Object.assign({type:'h',paa:'Testlyd'},asMatch(S.beat,asSpring(N.A['ana:taktslag'],N.dtf,S),AS.TOLT)));
    led('ana:takt',M.id,Object.assign({type:'h',paa:'Testlyd'},asMatch(S.takt,asSpring(N.A['ana:takt'],N.dtf,S),AS.TOLT)))}
   if(tone&&N.f0){const n=N.f0.length,P={n:0,ret:0,okt:0},B={n:0,ret:0,okt:0},TK={n:0,ret:0},C=Array.from({length:12},()=>({n:0,ret:0}));
    const maal=(o,f,m)=>{o.n++;if(!(f>0))return;const x=69+12*Math.log2(f/440);if(Math.abs(x-m)<=1)o.ret++;else if(Math.abs(((Math.round(x)-m)%12+12)%12)===0)o.okt++};
    for(let k=0;k<n;k++){const t=(k+1)*N.dtf;if(t<S.t0||t>S.slut)continue;let lead=null,bas=null;const pcs=new Set();
     for(const x of S.toner){if(t<x.a||t>x.b)continue;pcs.add(((x.m%12)+12)%12);if(t>=x.a+.03){if(x.k==='lead')lead=x.m;if(x.k==='bas')bas=x.m}}
     if(lead!==null&&v!=='bas')maal(P,N.f0[k],lead);if(bas!==null&&v!=='lead')maal(B,N.f0[k],bas);
     if(pcs.size){TK.n++;const tk=N.A['ana:toneklasse'];if(tk&&pcs.has(Math.round(tk[k]*11)))TK.ret++;for(let c=0;c<12;c++){const a=N.A['ana:c'+c];C[c].n++;if(!!(a&&a[k]>=.5)===pcs.has(c))C[c].ret++}}}
    const K=(o,paa)=>Object.assign({type:'k',paa},o);
    if(v==='alt'){if(P.n)led('ana:pitch',M.id,K(P,'Testlyd, melodien'));if(B.n)led('x:bastone',M.id,K(B,'Testlyd'));if(TK.n)led('ana:toneklasse',M.id,K(TK,'Testlyd'));
     C.forEach((o,c)=>{if(o.n){led('ana:c'+c,M.id,K(o,'Testlyd'));led('x:toner',M.id,K(o,'Testlyd'))}})}
    /* v9.113 (A1): ét instrument alene = det, et rent spor kan give. Bassen alene er Bas-sporet; melodien alene står for Vokal-sporet (generatoren kan ikke synge). */
    if(v==='bas'||v==='lead'){const sp=v==='bas'?'bas':'vokal',paa='Testlyd, kun '+(v==='bas'?'bassen':'melodien'),o=v==='bas'?B:P;if(o.n)led('stem:'+sp+':ana:pitch',M.id,K(o,paa));if(TK.n)led('stem:'+sp+':ana:toneklasse',M.id,K(TK,paa));C.forEach((q,c)=>{if(q.n){led('stem:'+sp+':ana:c'+c,M.id,K(q,paa));led('x:toner:'+sp,M.id,K(q,paa))}})}}}
  for(const k in res){const r=res[k];r.s=r.type==='h'?asF(r):r.n?Math.round(100*r.ret/r.n):0;if(r.type==='k'){r.sek=Math.round(r.n*H/AS.SR);delete r.hit;delete r.fa;delete r.ov}else{delete r.ret;delete r.okt}}
  for(const k in thrS){let bq=0,bs=-1;for(const q in thrS[k]){const s=asF(thrS[k][q]);if(s>bs){bs=s;bq=+q}}if(res[k])res[k].bedst=[Math.round(bq*5)/100,bs]}
  const hist=((AS.data&&AS.data.hist)||AS.gamHist||[]).slice(-19),kort={};AS.HOVED.forEach(([k])=>{if(res[k])kort[k]=res[k].s});
  AS.data={lyd:'test',v:asVersion(),dato:Date.now(),n:AS.M.length,ms:Math.round(performance.now()-t00),fp:Object.fromEntries(AS.dbg.map(x=>[x.id+'/'+x.v,x.sand.fp])),bpm:Object.fromEntries(AS.dbg.filter(x=>x.v==='alt'||x.v==='trommer').map(x=>[x.id+(x.v==='trommer'?'/trommer':''),[x.bpm,x.fase,x.fk,x.tk,x.rf,x.sk]])),res,hist:hist.concat([{lyd:'test',v:asVersion(),dato:Date.now(),s:kort}])};AS.gamHist=null;
  try{lsGem('rytme-asik',JSON.stringify(AS.data))}catch(e){}/* v9.114: kun gennem lsGem, så en fuld lagerplads giver banneret */
  try{$('status').textContent='Analyse sikkerhed er målt på testlyden ('+AS.M.length+' mønstre, ikke din sang; '+(AS.data.ms/1000).toFixed(1).replace('.',',')+' s).'}catch(e){}
 }catch(e){console.error(e);try{$('status').textContent=e&&e.message==='ANA_STOP'?'Testen blev annulleret.':'Testen kunne ikke køres: '+(e&&e.message||e)}catch(x){}}
 finally{anaFrem=glFrem;try{anaSkjul()}catch(e){}AS.koerer=false;AS.frem=''}
 asTegn();try{mxByg()}catch(e){}return AS.data}
/* Slå et lydtræk op: {s: tal eller null, r: målingen, mat, via, hvorfor} */
function asFor(b){b=String(b);const R=(AS.data&&AS.data.res)||{};
 if(/^hnd:(midi|tast|midinote)$/.test(b))return{s:99,mat:true,tekst:'præcis (din egen tangent eller tast)'};
 if(AS.MAT.test(b)||(/^stem:[^:]+:/.test(b)&&AS.MAT.test(stemFeat(b))))return{s:99,mat:true,tekst:'præcis måling'};
 /* v9.113: Resten har ingen egen måling; melodien alene (målt som Vokal-sporet) er det nærmeste */if(/^stem:resten:ana:/.test(b)&&R[b.replace('stem:resten:','stem:vokal:')])return{s:R[b.replace('stem:resten:','stem:vokal:')].s,r:R[b.replace('stem:resten:','stem:vokal:')],via:'målt på testlydens melodi alene'};
 const via=AS.VIA[b],k=via||b;if(R[k])return{s:R[k].s,r:R[k],via:via?(b==='ana:taktfase'?'følger taktslaget fra filen':'målt på taktslag fra filen, som Auto-valg bruger, når du spiller en fil; takturet, mens det spiller, er ikke målt'):''};
 let hv=AS.gamHist&&AS.gamHist.length?'Ikke målt med den nye testlyd endnu (fra v9.115). Kør testen i Analyse → Analyse sikkerhed.':'Ikke målt endnu. Kør testen i Analyse → Analyse sikkerhed.';const maalt=!!(AS.data&&AS.data.res);
 if(/vokal$/.test(b))hv='Kan ikke måles med testlyden: den kan ikke synge. Får først et tal, når der er sange med facit.';
 else if(/^hnd:(drop|pause|sektion)/.test(b))hv='Kan ikke måles med testlyden: mønstrene har ingen afsnit med facit.';
 else if(/^hnd:(klang|akkord|takt2|takt8)/.test(b))hv='Måles kun, mens det spiller; kan ikke regnes i testen endnu.';
 else if(/^ana:(dom|pitchsik|tonestyrke)/.test(b))hv='Har intet facit i testlyden.';
 else if(/^stem:/.test(b))hv='Har intet facit i testlyden (den kan spille trommerne, bassen og melodien alene, men ikke synge).';
 else if(maalt)hv='Har intet facit i testlyden.';
 return{s:null,hvorfor:hv}}
/* P8.28: browseren regner ikke generatorens lyd helt ens fra kørsel til kørsel (melodi og trommer afviger i sidste decimal; målt med fingeraftrykket S.fp), så der er ingen fast reference (AS.REF er tom). Rapporten (asRapport) har det fundne tempo pr. mønster, alle tal og browserens version, så to pc'er kan sammenlignes. */
function asLyd(){const D=AS.data;if(!D||!D.fp)return null;const K=Object.keys(AS.REF);if(!K.length)return null;const af=K.filter(k=>D.fp[k]!==AS.REF[k]);return{n:K.length,af:af.length}}
function asRapport(){const D=AS.data;if(!D)return'Analyse sikkerhed er ikke målt endnu.';const L=['Claude MV v'+D.v+' · Analyse sikkerhed · '+asDato(D.dato)+' · '+(D.ms/1000).toFixed(1)+' s',navigator.userAgent,'Kerner: '+(navigator.hardwareConcurrency||'?')];const ly=asLyd();if(ly)L.push('Lyden: '+(ly.af?ly.af+' af '+ly.n+' stykker afviger fra referencen':'som referencen ('+ly.n+' stykker)'));
 if(D.bpm){const fm=(nv,x)=>nv+' → '+(x?x[0]+' BPM (tempo-sikkerhed '+x[3]+')'+(x[5]?', taktslaget flyttet ½ slag':'')+', fase '+x[1]+' ('+(x[4]==null?'taktslagene rammer ved siden af slagene, så der er ingen rigtig fase':'rigtig fase '+x[4])+', fase-sikkerhed '+x[2]+')':'?');L.push('Lyd: Testlyd (ren matematik, ens på alle pc\'er)');L.push('Fundet tempo og fase, hele lyden (rigtigt tempo står i navnet): '+AS.M.map(M=>fm(M.navn.split(' · ')[0],D.bpm[M.id])).join(' · '));L.push('Fundet tempo og fase, kun trommerne: '+AS.M.map(M=>fm(M.navn.split(' · ')[0],D.bpm[M.id+'/trommer']||(M.kun==='trommer'?D.bpm[M.id]:null))).join(' · '))}
 Object.keys(D.res).filter(k=>!/ana:c\d+$/.test(k)).forEach(k=>{const r=D.res[k];L.push(asNavn(k)+': '+r.s+(r.type==='h'?' (rammer '+r.hit+' af '+r.n+', falske '+r.fa+', oversete '+r.ov+')':' % af tiden')+' · pr. mønster '+r.pm.map(x=>x[1]).join(' ')+(r.bedst?' · bedste tærskel '+r.bedst[0]+' → '+r.bedst[1]:''))});
 if(D.fp)L.push('Fingeraftryk af testlyden (skal være ens på alle pc\'er): '+Object.keys(D.fp).map(k=>k+'='+D.fp[k]).join(' '));return L.join('\n')}
function asBrugBedst(k){const r=AS.data&&AS.data.res&&AS.data.res[k];if(!r||!r.bedst)return 0;const thr=r.bedst[0];let n=0;Regler.samlet(()=>{n=Regler.retHvor(m=>m.band===k,()=>({thr}),true)});try{save()}catch(e){}try{mxByg()}catch(e){}try{msg(n?'Tærsklen er sat til '+String(thr.toFixed(2)).replace('.',',')+' i '+n+(n===1?' regel':' regler')+' på '+asNavn(k)+'. Ctrl+Z fortryder.':'Ingen regler bruger '+asNavn(k)+'.')}catch(e){}asTegn();return n}
function asKl(s){return s==null?'n':s>=75?'g':s>=50?'y':'r'}
function asOrd(s){return s==null?'ikke målt':s>=75?'sikker':s>=50?'med omtanke':'usikker'}
function asNavn(b){if(AS.X[b])return AS.X[b];try{return neLtNavn(b)}catch(e){return b}}
function asDato(d){try{const x=new Date(d);return x.getDate()+'. '+['jan.','feb.','mar.','apr.','maj','jun.','jul.','aug.','sep.','okt.','nov.','dec.'][x.getMonth()]+' kl. '+String(x.getHours()).padStart(2,'0')+'.'+String(x.getMinutes()).padStart(2,'0')}catch(e){return''}}
function asEgen(b){try{if(STEM.klar&&['kick','snare','hihat'].includes(b)&&maps.some(m=>m.band===b&&!m.off&&m.spor!=='mix'))return'stem:trommer:'+b}catch(e){}return b}/* v9.115: det tal, dit show faktisk bruger */
function asCirkel(b,kl){const o=asFor(asEgen(b));return '<button type="button" class="as-c as-k-'+asKl(o.s)+(kl?' '+kl:'')+'" data-asb="'+neHtml(b)+'" aria-label="'+neHtml('Sikkerhed for '+asNavn(b)+': '+(o.s==null?'ikke målt':o.s+' %')+'. Klik åbner Analyse sikkerhed')+'">'+(o.s==null?'?':o.s)+'</button>'}
function asBobleHtml(b){let fra='';const eg=asEgen(b);if(eg!==b){const a=asFor(b),c=asFor(eg);fra='<span class="as-b-sv">Du har 4 spor: dine regler på '+neHtml(asNavn(b))+' læser fra Trommer-sporet (Auto-valg), så tallet her er '+neHtml(asNavn(eg))+(c.s!=null?' ('+c.s+')':'')+', ikke hele lyden'+(a.s!=null?' ('+a.s+')':'')+'. Et andet tal end før er ikke en fejl.</span><br>';b=eg}return fra+asBobleHtml0(b)}
function asBobleHtml0(b){const o=asFor(b),h=neHtml,D=AS.data;if(o.mat)return '<span class="as-b-st">99 %</span><b>'+o.tekst+'</b><br><b>'+h(asNavn(b))+'</b><br><span class="as-b-sv">Ren matematik: tallet er det, der er i lyden. Klik åbner Analyse → Analyse sikkerhed.</span>';
 if(o.s==null)return '<b>'+h(asNavn(b))+'</b><br>'+h(o.hvorfor);const r=o.r;
 return '<span class="as-b-st">'+o.s+' %</span><b>'+asOrd(o.s)+'</b><br><b>'+h(asNavn(b))+'</b><br>'+(r.type==='h'?'Rammer '+r.hit+' af '+r.n+' · falske '+r.fa+' · oversete '+r.ov:'Rigtig '+o.s+' % af tiden ('+r.sek+' s målt)')
  +'<br><span class="as-b-sv"><b>Målt på testlyd, ikke på din sang</b> ('+h(r.paa)+') · '+asDato(D.dato)+' · v'+h(D.v)+(o.via?'<br>'+h(o.via.charAt(0).toUpperCase()+o.via.slice(1))+'.':'')+'<br>Klik åbner Analyse → Analyse sikkerhed.</span>'}
function asBoble(el){let b=$('as-boble');if(!b){b=document.createElement('div');b.id='as-boble';b.className='as-boble';b.setAttribute('role','tooltip');document.body.appendChild(b)}
 if(!el){b.hidden=true;return}b.innerHTML=asBobleHtml(el.dataset.asb);b.hidden=false;const q=el.getBoundingClientRect(),x=Math.min(q.right+10,innerWidth-b.offsetWidth-10),y=Math.max(10,Math.min(q.top-10,innerHeight-b.offsetHeight-10));b.style.left=Math.max(10,x)+'px';b.style.top=y+'px'}
document.addEventListener('mouseover',e=>{const el=e.target.closest&&e.target.closest('[data-asb]');if(el)asBoble(el);else asBoble(null)});
document.addEventListener('focusin',e=>{const el=e.target.closest&&e.target.closest('[data-asb]');if(el)asBoble(el)});
document.addEventListener('focusout',e=>{if(e.target.closest&&e.target.closest('[data-asb]'))asBoble(null)});
document.addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('[data-asb]');if(!el||el.closest('#as-rude'))return;e.preventDefault();e.stopPropagation();asBoble(null);asAaben(el.dataset.asb)});
/* De lydtræk, showet bruger (det, reglerne faktisk læser: taktslag fra filen, kick fra Trommer, når der er 4 spor) */
function asIBrug(){const S=new Set();try{maps.forEach(m=>{if(m.off)return;let b=String(m.band);try{if(STEM.klar&&['kick','snare','hihat'].includes(b)&&m.spor!=='mix')b='stem:trommer:'+b}catch(e){}S.add(b)})}catch(e){}return S}
function asSamlet(){const L=[...asIBrug()].map(b=>asFor(b)),tal=L.filter(o=>o.s!=null&&!o.mat);/* v9.115: de præcise målinger (99) trækker ikke gennemsnittet op */return{n:L.length,mat:L.filter(o=>o.mat).length,ikke:L.filter(o=>o.s==null).length,maalt:tal.length,s:tal.length?Math.round(tal.reduce((a,o)=>a+o.s,0)/tal.length):null}}
function asRaekker(){const brug=asIBrug(),R=(AS.data&&AS.data.res)||{},L=[],ind=b=>{if(!L.includes(b))L.push(b)};
 ['kick','snare','hihat','stem:trommer:kick','stem:trommer:snare','stem:trommer:hihat','ana:taktslag','stem:trommer:ana:taktslag','stem:trommer:ana:takt','ana:takt','hnd:takt','hnd:takt4','ana:pitch','stem:vokal:ana:pitch','x:bastone','stem:bas:ana:pitch','ana:toneklasse','stem:bas:ana:toneklasse','stem:vokal:ana:toneklasse','x:toner','x:toner:bas','x:toner:vokal','vokal','hnd:takt2','hnd:takt8','hnd:akkord','hnd:klang:slag','hnd:drop','hnd:sektion','ana:pitchsik','ana:tonestyrke'].forEach(ind);
 brug.forEach(ind);Object.keys(AS.vis).forEach(ind);
 let ud=L.filter(b=>{const o=asFor(b);if(AS.kunBrug)return brug.has(b);return !o.mat||brug.has(b)||AS.vis[b]});
 if(AS.usikre)ud=ud.map((b,i)=>[b,asFor(b).s,i]).sort((a,c)=>(a[1]==null?1e3:a[1])-(c[1]==null?1e3:c[1])||a[2]-c[2]).map(x=>x[0]);return{ud,brug}}
function asRude(){return document.querySelector('#sg .sg-fane[data-sg="sikker"]')}
function asTegn(){const p=asRude();if(!p||p.hidden)return;const h=neHtml,D=AS.data,S=asSamlet(),{ud,brug}=asRaekker(),far=b=>{let ty='';try{ty=neLtType(b.startsWith('x:')?(b==='x:toner'||b.startsWith('x:toner:')?'ana:c0':'ana:pitch'):b)}catch(e){}return (typeof NE2!=='undefined'&&NE2.farver&&NE2.farver['t:'+ty])||'rgba(255,255,255,.3)'};
 const pm=r=>{const G=new Map();r.pm.forEach(([id,s])=>{const g=G.get(id)||[0,0];g[0]+=s;g[1]++;G.set(id,g)});return [...G].map(([id,g])=>{const M=AS.M.find(x=>x.id===id);return h((M?M.navn:id))+' <b>'+Math.round(g[0]/g[1])+'</b>'}).join(' · ')};
 let t='<div class="as-top"><span class="as-c as-stor as-k-'+asKl(S.s)+'" id="as-samlet">'+(S.s==null?'?':S.s)+'</span><div><b>Samlet sikkerhed · testlyd</b><br><span class="small">gennemsnit af de '+S.maalt+' af dit shows '+S.n+' lydtræk, der er målt på testlyden (ikke din sang)'+(S.mat||S.ikke?'; tæller ikke med: '+[S.mat?S.mat+' præcise målinger (99)':'',S.ikke?S.ikke+' uden tal (?)':''].filter(Boolean).join(' og '):'')+'</span></div>'
  +'<span class="small as-facit">Facit: <b>Testlyd</b> (ren matematik, ens på alle pc\'er) · '+AS.M.length+' mønstre · '+(D?'målt '+asDato(D.dato)+' · v'+h(D.v)+' · '+(D.ms/1000).toFixed(1).replace('.',',')+' s'+(()=>{const ly=asLyd();return ly?' · <span title="Lydens fingeraftryk sammenlignet med Codes testbrowser. Afviger den, regner din browser generatorens lyd en anelse anderledes; så kan tallene ikke sammenlignes helt med en anden pc, men to kørsler på din pc kan.">lyden: '+(ly.af?'afviger fra referencen ('+ly.af+' af '+ly.n+')':'som referencen')+'</span>':''})():'ikke målt endnu')+'</span><span class="as-luft"></span>'
  +'<button class="'+(AS.kunBrug?'on':'ghost')+'" data-asx="brug" aria-pressed="'+AS.kunBrug+'" title="Vis kun de lydtræk, dit show bruger">Kun dem i brug</button><button class="'+(AS.usikre?'on':'ghost')+'" data-asx="usikre" aria-pressed="'+AS.usikre+'" title="De laveste tal øverst; dem uden tal nederst">Sortér: usikre først</button>'
  +'<button class="as-prim" data-asx="koer"'+(AS.koerer?' disabled':'')+' title="Programmet laver testlyden ('+AS.M.length+' mønstre) uden lyd i højttaleren og måler analysen mod det, der blev spillet. Tager nogle sekunder.">'+(AS.koerer?h(AS.frem||'Måler …'):'▶ Kør testen')+'</button></div>'
  +'<details class="as-hvordan"'+(AS.hvordan?' open':'')+'><summary>Sådan måles det</summary><p class="small"><b>Testlyden</b> (vores navn) er '+AS.M.length+' mønstre på '+AS.TAKTER+' takter, hvor programmet ved præcis, hvor hvert slag og hver tone er (facit): '+AS.M.map(M=>h(M.navn)).join(' · ')+'. Programmet regner lyden selv i ren matematik (ikke i browserens lydmotor), så den er præcis ens på alle pc\'er. Lydene efterligner generatorens: kick med ekko, snare og klap, lukket og åben hihat, bas mellem slagene, melodi og rum. Lyden går gennem den samme analyse som en lydfil. <b>Tallene handler om testlyden, ikke om din sang eller dine 4 spor.</b> Tal fra før v9.115 er målt på generatorens lyd og kan ikke sammenlignes.</p>'
  +'<p class="small"><b>Slag</b> (Kick, Snare, Hihat) findes med programmets standard-regel (tærskel 0,30; Hihat 0,35; attack 8 ms; release 120 ms; spærretid 120 ms). Et slag er ramt, når det findes højst 50 ms fra det rigtige sted; taktslag højst 70 ms. <b>Falske</b> = fundet, men der var intet slag. <b>Oversete</b> = der var et slag, men det blev ikke fundet. Sikkerheden er F-målet (fagudtryk: F-measure): 2 × ramte / (2 × ramte + falske + oversete). Snare tæller snare og klap; Hihat tæller lukket og åben hihat; også de svage slag tæller.</p>'
  +'<p class="small"><b>Kurver</b> (Tonehøjde, Toneklasse, de 12 toner): hvor stor en del af tiden tallet er rigtigt. Tonehøjden er rigtig, når den er højst en halv tone fra den tone, testlyden spiller. <b>99 · præcis måling</b> står ved det, der er ren matematik (bånd, styrke, klang, stereo). <b>?</b> står ved det, testlyden ikke har facit for (fx Vokal og afsnit). Den samlede sikkerhed regnes uden 99 og uden ?. <b>Ét instrument alene</b> (kun trommerne, kun bassen, kun melodien) er de samme mønstre med resten slået fra; det viser, hvad et rent spor kan give. Rækkerne hedder som sporets lydtræk, fx Tonehøjde · Bas. Melodien alene står for Vokal-sporet, fordi testlyden ikke kan synge. Har du 4 spor, læser dine regler på Kick, Snare og Hihat fra Trommer-sporet; så viser cirklen i matrixen tallet for Trommer.</p></details>'
  +'<table class="as-tab"><thead><tr><th>Lydtræk</th><th>Sikkerhed (testlyd)</th><th>Rammer</th><th>Falske</th><th>Oversete</th><th>Målt på</th></tr></thead><tbody>';
 ud.forEach(b=>{const o=asFor(b),r=o.r,kl=asKl(o.s);let det='';try{if(r&&(b==='kick'||b==='snare')&&F&&marks[b]&&marks[b].length){const m=maps.find(x=>x.band===b),q=score(b,m?m.thr:.3);det=' · dine tryk (Detektion): ramt '+q.hit+' af '+marks[b].length}}catch(e){}
  t+='<tr class="as-r'+(AS.blink===b?' as-blink':'')+'" data-asr="'+h(b)+'" tabindex="0" title="Klik for at se tallene for hvert mønster"><td class="as-nv" style="border-left-color:'+far(b)+'">'+h(asNavn(b))+(brug.has(b)?' <i class="as-ib">i brug</i>':'')+(asEgen(b)!==b?' <i class="as-ib as-ej">dit show læser '+h(asNavn(asEgen(b)))+' (4 spor)</i>':'')+(b.startsWith('x:')?' <i class="as-ib as-ej">ikke et lydtræk endnu</i>':'')+'</td>'
   +'<td class="as-sk"><span class="as-c as-k-'+kl+'">'+(o.s==null?'?':o.s)+'</span><span class="as-bar"><i class="as-k-'+kl+'" style="width:'+(o.s||0)+'%"></i></span></td>'
   +(o.mat?'<td>'+h(o.tekst)+'</td><td>–</td><td>–</td><td class="small">ren matematik</td>':o.s==null?'<td>–</td><td>–</td><td>–</td><td class="small">'+h(o.hvorfor)+'</td>'
    :r.type==='h'?'<td>'+r.hit+' af '+r.n+'</td><td>'+r.fa+'</td><td>'+r.ov+'</td><td class="small">'+h(r.paa)+(o.via?' · '+h(o.via):'')+h(det)+'</td>'
    :'<td>'+o.s+' % af tiden</td><td>–</td><td>–</td><td class="small">'+h(r.paa)+' · '+r.sek+' s'+(r.okt?' · rigtig tone i forkert oktav: '+Math.round(100*r.okt/r.n)+' %':'')+'</td>')+'</tr>';
  if(AS.aaben[b]&&r)t+='<tr class="as-det"><td colspan="6" class="small">Pr. mønster: '+pm(r)+(r.bedst?(()=>{const nR=maps.filter(m=>m.band===b).length,bt=String(r.bedst[0].toFixed(2)).replace('.',',');return '<br>Bedste tærskel: <b>'+bt+'</b> giver <b>'+r.bedst[1]+'</b> (standard-reglen bruger '+String(AS.REGEL[b.split(':').pop()].thr.toFixed(2)).replace('.',',')+' og giver '+r.s+'). <button class="ghost" data-asbedst="'+h(b)+'"'+(nR?'':' disabled')+' title="'+(nR?'Sætter tærsklen til '+bt+' i dine '+nR+' regler på dette lydtræk. Ctrl+Z fortryder.':'Ingen af dine regler bruger dette lydtræk')+'">Brug den bedste tærskel'+(nR?' i '+nR+(nR===1?' regel':' regler'):'')+'</button>'})():'')+'</td></tr>'});
 t+='</tbody></table><p class="small as-note">De lydtræk, der er ren matematik (bånd, de 31 smalle bånd, styrke, klang, stereo), får 99 og vises her, når de er i brug. Tallene gælder testlyden, ikke din sang; rigtig musik er mere rodet, så tallene for en sang vil normalt være lavere.</p>';
 const Hs=(D&&D.hist)||AS.gamHist||[];if(Hs.length)t+='<h4 class="as-h">Tidligere målinger (nyeste nederst)</h4><table class="as-tab as-hist"><thead><tr><th>Version</th><th>Målt</th>'+AS.HOVED.map(x=>'<th>'+h(x[1])+'</th>').join('')+'</tr></thead><tbody>'+Hs.slice(-8).map((x,i,a)=>(x.lyd==='test'&&i>0&&a[i-1].lyd!=='test'?'<tr class="as-skel"><td colspan="'+(AS.HOVED.length+2)+'">— Ny testlyd fra v9.115: tallene ovenfor er målt på generatorens lyd og kan ikke sammenlignes med tallene nedenfor —</td></tr>':'')+'<tr'+(x.lyd==='test'?'':' class="as-gam" title="Målt på generatorens lyd (før v9.115)"')+'><td>v'+h(x.v)+'</td><td>'+asDato(x.dato)+'</td>'+AS.HOVED.map(([k])=>'<td>'+(x.s&&x.s[k]!=null?x.s[k]:'–')+'</td>').join('')+'</tr>').join('')+'</tbody></table>';
 t+='<p class="small as-note">Vil du måle på din egen sang? <b>Detektion</b> (under Avanceret) sammenligner Kick og Snare med dine egne tryk på K og S. <button class="ghost" data-asx="det">Åbn Detektion</button> <button class="ghost" data-asx="rapport" title="Kopierer alle tal, det fundne tempo og lydens fingeraftryk som tekst, så de kan sendes til hovedchatten">Kopiér rapport</button></p>';
 const sy=p.scrollTop;p.innerHTML=t;p.scrollTop=sy}
function asAaben(b){AS.vis[b]=1;AS.blink=b;try{lay3Anvend('ao-sang')}catch(e){}try{dkVis('w35')}catch(e){}sgFane('sikker');
 setTimeout(()=>{const p=asRude(),r=p&&[...p.querySelectorAll('[data-asr]')].find(x=>x.dataset.asr===b);if(r)try{r.scrollIntoView({block:'center'});r.focus({preventScroll:true})}catch(e){}setTimeout(()=>{AS.blink=null;if(r)r.classList.remove('as-blink')},2200)},120)}
/* Fanen i Analyse-vinduet */
function asByg(){const h=$('sg');if(!h||asRude())return;const f=h.querySelector('.sg-faner'),lyt=$('sg-lyt');if(!f)return;const b=document.createElement('button');b.className='ghost';b.setAttribute('role','tab');b.dataset.sgf='sikker';b.textContent='Analyse sikkerhed';b.title='Hvor sikkert analysen finder hvert lydtræk, målt mod generatoren (fagudtryk: evaluation)';f.insertBefore(b,lyt||null);
 const p=document.createElement('div');p.className='sg-fane as-rude';p.id='as-rude';p.dataset.sg='sikker';p.hidden=true;h.querySelector('.sg-hoejre').appendChild(p);
 p.addEventListener('click',e=>{const x=e.target.closest('[data-asx]');if(x){const k=x.dataset.asx;if(k==='brug'){AS.kunBrug=!AS.kunBrug;asTegn()}else if(k==='usikre'){AS.usikre=!AS.usikre;asTegn()}else if(k==='koer')asKoer();else if(k==='rapport'){const t=asRapport();(navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(t):Promise.reject()).then(()=>msg('Rapporten er kopieret ('+t.length+' tegn).')).catch(()=>{const a=document.createElement('textarea');a.value=t;a.className='as-rap';a.readOnly=true;x.parentNode.appendChild(a);a.select();msg('Rapporten står i feltet. Tryk Ctrl+C.')})}else if(k==='det'){sgFane('avanceret');setTimeout(()=>{const d=document.querySelector('#sg .sg-kort[data-kort="det"]');if(d)d.scrollIntoView({block:'center'})},60)}return}
  {const bb=e.target.closest('[data-asbedst]');if(bb){asBrugBedst(bb.dataset.asbedst);return}}if(e.target.closest('summary')){setTimeout(()=>{const d=p.querySelector('.as-hvordan');AS.hvordan=!!(d&&d.open)},0);return}const r=e.target.closest('[data-asr]');if(r){const k=r.dataset.asr;AS.aaben[k]=!AS.aaben[k];asTegn()}});
 p.addEventListener('keydown',e=>{if(e.key!=='Enter'&&e.key!==' ')return;const r=e.target.closest&&e.target.closest('tr[data-asr]');if(r&&e.target===r){e.preventDefault();AS.aaben[r.dataset.asr]=!AS.aaben[r.dataset.asr];asTegn()}})}
{const gl=sgFane;sgFane=function(n){if(n!=='sikker')return gl(n);const h=$('sg');if(!h||!asRude())return gl('sang');set.sgFane='sikker';try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}
  h.querySelectorAll('.sg-fane').forEach(f=>{f.hidden=f.dataset.sg!=='sikker'});h.querySelectorAll('[data-sgf]').forEach(b=>{const on=b.dataset.sgf==='sikker';b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});asTegn()}}
try{asByg()}catch(e){console.error(e)}
/* Cirklen i matrixens rækkehoved: ⏻ · navn · dB · cirkel. Egne lyttere, så rækkens træk ikke tager klikket. */
{const gl=mxByg;window.mxByg=function(){const r=gl.apply(this,arguments);try{document.querySelectorAll('#ne-mx th.mx-lt').forEach(th=>{if(th.querySelector('.as-c'))return;const b=th.dataset.b;if(!b)return;const d=document.createElement('span');d.innerHTML=asCirkel(b,th.querySelector('.mx-x')?'as-c-x':'');const c=d.firstChild,kt=th.querySelector('.mx-kt');c.dataset.t=c.textContent;c.textContent='';/* v9.114: tallet står i data-t (CSS), så rækkens tekst er uændret */th.insertBefore(c,kt||th.firstChild);c.addEventListener('pointerdown',e=>e.stopPropagation())})}catch(e){}return r}}
setTimeout(()=>{try{if($('ne-mx')&&$('ne-mx').querySelector('th.mx-lt'))mxByg()}catch(e){}},1500);
/* 4 spor: kun sange under cirka 15 minutter for nu (brugerens valg b). Længden læses fra filens hoved, før noget afkodes. */
function asVarighed(f){return new Promise(res=>{try{const a=document.createElement('audio'),u=URL.createObjectURL(f);let done=false;const slut=v=>{if(done)return;done=true;try{URL.revokeObjectURL(u)}catch(e){}res(v)};a.preload='metadata';a.onloadedmetadata=()=>slut(Number.isFinite(a.duration)?a.duration:0);a.onerror=()=>slut(0);setTimeout(()=>slut(0),4000);a.src=u}catch(e){res(0)}})}
function asSporForLang(f,sek){const t='⚠ '+f.name+' er '+Math.round(sek/60)+' minutter lang. 4 spor virker kun på sange under cirka 15 minutter for nu, fordi fire lange spor fylder mere, end browseren kan have i hukommelsen. Sporet er ikke læst ind. Du kan stadig åbne sangen som en almindelig lydfil; så analyseres den samlede lyd. Spor på lange sange kommer senere.';
 const e=$('stem-besked');if(e)e.innerHTML='<span class="stem-gul">'+esc(t)+'</span>';try{msg(t)}catch(x){}}
{const gl=stemSaetFil;stemSaetFil=async function(spor,f){if(f&&!/\.stem\.mp4$/i.test(f.name)){const sek=await asVarighed(f);if(sek>AS.SPOR_MAX){asSporForLang(f,sek);return}}
  const r=await gl(spor,f);try{const b=STEM.buf[spor];if(f&&b&&b.duration>AS.SPOR_MAX){delete STEM.buf[spor];delete STEM.fil[spor];try{stemUI()}catch(e){}asSporForLang(f,b.duration)}}catch(e){}return r}}
/* ========== SLUT: ANALYSE SIKKERHED (A0) ========== */


