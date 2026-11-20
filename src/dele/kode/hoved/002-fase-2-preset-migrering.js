/* ========== FASE 2: PRESET-MIGRERING ========== */
/* Alle presets går gennem migrer(). Ny version = nyt trin her. Skal kunne indlæse alle ældre. Nuværende version: 11 (version 10 har ingen analysekilder (ana:...) og ingen fødsel fra toner; version 9 har ingen afstand og ingen levende objekter; version 8 havde spilsignaler, som er fjernet igen; version 6 har ingen lyd; version 5 har ingen scene; version 4 kan have ms_*-mål, som nu er objektet Morgenstjerne). */
/* migrer() og migrerMS() ligger nu i runtime/render-runtime.js (samme kode i editor og spil). */
/* ========== SLUT: PRESET-MIGRERING ========== */
const $=id=>document.getElementById(id);
const DEFAULT=[
 {band:'kick',effect:'klods1',thr:.3,gain:1,att:8,rel:120,curve:1,gap:120},
 {band:'snare',effect:'klods2',thr:.3,gain:1,att:8,rel:120,curve:1,gap:120},
 {band:'hihat',effect:'klods3',thr:.35,gain:1,att:8,rel:100,curve:1,gap:120},
 {band:'kick',effect:'puls',thr:.25,gain:1,att:15,rel:220,curve:1,gap:120},
 {band:'snare',effect:'burst',thr:.3,gain:1,att:10,rel:150,curve:1,gap:120},
 {band:'hihat',effect:'glod',thr:.35,gain:.8,att:8,rel:90,curve:1,gap:120},
 {band:'centroid',effect:'farve',thr:0,gain:1,att:250,rel:400,curve:1,gap:120},
 {band:'bas',effect:'bolge',thr:.2,gain:1,att:60,rel:200,curve:1,gap:120},
 {band:'rms',effect:'fart',thr:.1,gain:1,att:200,rel:500,curve:1,gap:120},
 {band:'flux',effect:'ryst',thr:.6,gain:.7,att:10,rel:120,curve:1,gap:120},
 {band:'vokal',effect:'banelys',thr:.4,gain:.8,att:80,rel:300,curve:1,gap:120}
];
let maps=DEFAULT.map(m=>({...m}));let SHOWPROFIL=null,SHOW=null,SHOWKEY=null,SHOWNAVN='',SHOWRAP='';const LOOP={a:0,b:0,til:false},TLV={a:0,b:0};
try{const s=localStorage.getItem('rytme-mapping2');if(s)maps=Rytme.fjernSignaler(JSON.parse(s));localStorage.removeItem('rytme-spil')}catch(e){}
let RAW=null,F=null,dur=0,sr=44100,H=1024,buf=null,actx=null,src=null,playing=false,offset=0,startAt=0,peaks={};

/* ---------- Analyse ---------- */
function makeFFT(N){const rev=new Uint32Array(N),cs=new Float32Array(N/2),sn=new Float32Array(N/2);const bits=Math.log2(N);
 for(let i=0;i<N;i++){let r=0;for(let b=0;b<bits;b++)r|=((i>>b)&1)<<(bits-1-b);rev[i]=r}
 for(let i=0;i<N/2;i++){cs[i]=Math.cos(2*Math.PI*i/N);sn[i]=-Math.sin(2*Math.PI*i/N)}
 return(re,im)=>{for(let i=0;i<N;i++){const j=rev[i];if(j>i){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t}}
  for(let s=2;s<=N;s<<=1){const h=s>>1,st=N/s;for(let k=0;k<N;k+=s)for(let j=0;j<h;j++){const c=cs[j*st],d=sn[j*st],a=k+j,b=a+h;
   const tr=re[b]*c-im[b]*d,ti=re[b]*d+im[b]*c;re[b]=re[a]-tr;im[b]=im[a]-ti;re[a]+=tr;im[a]+=ti}}}}
async function analyze(b){
 const N=2048,fft=makeFFT(N),c0=b.getChannelData(0),c1=b.numberOfChannels>1?b.getChannelData(1):c0;
 sr=b.sampleRate;const n=Math.floor((c0.length-N)/H);
 const R={};BANDS.forEach(([k])=>R[k]=new Float32Array(n));
 const re=new Float32Array(N),im=new Float32Array(N),mag=new Float32Array(N/2),prev=new Float32Array(N/2),win=new Float32Array(N);
 for(let i=0;i<N;i++)win[i]=.5-.5*Math.cos(2*Math.PI*i/N);
 const bin=f=>Math.min(N/2-1,Math.round(f*N/sr)),fr=i=>i*sr/N;
 const band=(a,z)=>{const i0=bin(a),i1=Math.max(i0+1,bin(z));let s=0;for(let i=i0;i<i1;i++)s+=mag[i]*mag[i];return Math.log10(1+100*Math.sqrt(s/(i1-i0)))};
 const top=bin(8000);
 for(let f=0;f<n;f++){
  const o=f*H;let sq=0,zc=0,lp=0;
  for(let i=0;i<N;i++){const v=(c0[o+i]+c1[o+i])*.5;re[i]=v*win[i];im[i]=0;sq+=v*v;if(i&&(v>=0)!==(lp>=0))zc++;lp=v}
  fft(re,im);
  let fl=0,sm=0,cw=0,lg=0;
  for(let i=0;i<N/2;i++){mag[i]=Math.hypot(re[i],im[i])/N*4;const d=mag[i]-prev[i];if(d>0)fl+=d;prev[i]=mag[i]}
  for(let i=1;i<top;i++){sm+=mag[i];cw+=mag[i]*fr(i);lg+=Math.log(mag[i]+1e-9)}
  let acc=0,ro=0;for(let i=1;i<top;i++){acc+=mag[i];if(acc>=.85*sm){ro=fr(i);break}}
  R.bas[f]=band(20,250);R.mid[f]=band(250,2000);R.hmid[f]=band(2000,6000);R.brill[f]=band(6000,16000);
  R.rms[f]=Math.sqrt(sq/N);R.centroid[f]=sm>1e-6?cw/sm:0;R.rolloff[f]=ro;R.flux[f]=fl;
  R.flat[f]=sm>1e-6?Math.exp(lg/(top-1))/(sm/(top-1)):0;R.zcr[f]=zc/N;
  R.vokal[f]=band(200,900)*(1-Math.min(1,R.flat[f]*3));
  if(f%150===0){$('status').textContent='Analyserer… '+Math.round(f/n*100)+'%';anaFrem(1,f/n);await anaPause();if(ANA.stop)throw new Error('ANA_STOP')}
 }
 const rise=(a,w)=>{const o=new Float32Array(n);for(let i=1;i<n;i++)o[i]=Math.max(0,a[i]-(a[i-1]*.5+(a[i-2]||0)*.5))*(w?w(i):1);return o};
 R.kick=rise(R.bas);R.snare=rise(R.hmid,i=>.5+R.zcr[i]*8);R.hihat=rise(R.brill);
 return R}
/* ---------- Analyse af toner og klang (kilder ana:...) ---------- */
/* Regnes oven på de 14 lydtræk, med et 8192-punkts vindue (log-spektrum, tonehøjde, toneklasser, klang). Filer: efter den almindelige analyse (hver anden ramme, cirka 9 sekunder for 3 minutter, gemmes i cachen). Live: højst hver 33. ms, og kun når noget bruger den. */
let A=null,ARAW=null,TONER=[],TP=0;
async function analyzeAna(b){const AN=Rytme.anaNy(b.sampleRate),N=8192,c0=b.getChannelData(0),c1=b.numberOfChannels>1?b.getChannelData(1):c0,n=Math.floor((c0.length-2048)/H),x=new Float32Array(N),xl=new Float32Array(N),xr=new Float32Array(N),R={};
 Rytme.ANA_KILDER.forEach(k=>R[k.key]=new Float32Array(n));R.f0=new Float32Array(n);R.klar=new Float32Array(n);R.f0m=new Float32Array(n);R.klarm=new Float32Array(n);
 for(let f=0;f<n;f+=2){const st=f*H+1024-N/2;for(let i=0;i<N;i++){const j=st+i;const gyldig=j>=0&&j<c0.length;x[i]=gyldig?(c0[j]+c1[j])*.5:0;xl[i]=gyldig?c0[j]:0;xr[i]=gyldig?c1[j]:0}
  const o=Rytme.anaRamme(AN,x),sv=Rytme.stereoRamme(xl,xr,N/2-2048,N/2+2048);for(let h=0;h<2&&f+h<n;h++){for(const k in o.k)R[k][f+h]=o.k[k];R['ana:pan'][f+h]=sv.pan;R['ana:bredde'][f+h]=sv.bredde;R['ana:fase'][f+h]=sv.fase;R.f0[f+h]=o.raa.f0;R.klar[f+h]=o.raa.klar;R.f0m[f+h]=o.raa.f0m;R.klarm[f+h]=o.raa.klarm}
  if(f%80===0){$('status').textContent='Analyserer toner og klang … '+Math.round(f/n*100)+'%';anaFrem(2,f/n);await anaPause();if(ANA.stop)throw new Error('ANA_STOP')}}
 return R}
function anaNorm(){if(!ARAW){A=null;TONER=[];return}A={};for(const k in ARAW){const a=ARAW[k];if(/^ana:ls/.test(k)){const q=Float32Array.from(a).sort(),p=q[Math.floor(a.length*.99)]||1e-9;A[k]=a.map(v=>Math.min(1,v/p))}else A[k]=a}
 if(RAW&&RAW.rms){const ar=Rytme.artikulationSerie(RAW.rms,H/sr);A['ana:anslag']=ar.anslag;A['ana:legato']=ar.legato}
 if(F&&F.bas&&F.mid&&F.hmid&&F.brill){const ds=Rytme.dominansSerie([F.bas,F.mid,F.hmid,F.brill],H/sr);A['ana:domBas']=ds[0];A['ana:domMid']=ds[1];A['ana:domHoej']=ds[2];A['ana:domBrill']=ds[3]}
 if(F&&F.rms&&F.flux&&F.hmid&&F.brill&&F.centroid&&F.rolloff){const ks=Rytme.karakterSerie(F,H/sr);A['ana:energi']=ks.energi;A['ana:lyshed']=ks.lyshed}
 normLokalA();
 const n=ARAW.f0.length;TONER=Rytme.toneListe(ARAW.f0,ARAW.klar,Array.from({length:n},(_,f)=>(f+1)*H/sr));TP=0;showAnalyser()}
const sampleA=(k,t)=>{const a=A&&A[k];return a?a[Math.max(0,Math.min(a.length-1,Math.floor(t*sr/H)))]:0};

/* ---------- IndexedDB-cache ---------- */
const db=()=>new Promise((res,rej)=>{const r=indexedDB.open('rytme',1);r.onupgradeneeded=()=>r.result.createObjectStore('a');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)});
async function cacheGet(k){try{const d=await db();return await new Promise(r=>{const q=d.transaction('a').objectStore('a').get(k);q.onsuccess=()=>r(q.result);q.onerror=()=>r(null)})}catch(e){return null}}
async function cachePut(k,v){try{const d=await db();d.transaction('a','readwrite').objectStore('a').put(v,k)}catch(e){}}

/* ---------- Fil ---------- */
$('file').onchange=async e=>{
 const f=e.target.files[0];if(!f)return;stop();offset=0;
 try{
  actx=actx||new (window.AudioContext||window.webkitAudioContext)();
  $('status').textContent='Afkoder lyd…';
  try{buf=await actx.decodeAudioData(await f.arrayBuffer())}catch(de){$('status').textContent='Browseren kunne ikke afkode filen. Prøv en MP3, WAV eller OGG.';return}
  dur=buf.duration;sr=buf.sampleRate;
  A=null;ARAW=null;TONER=[];SHOWPROFIL=null;const key='v2|'+f.name+'|'+f.size+'|'+f.lastModified,key3='v3|'+f.name+'|'+f.size+'|'+f.lastModified;SHOWKEY=key3;SHOWNAVN=f.name;let c=await cacheGet(key3);
  if(Rytme.cacheGyldig(c)){RAW=c.F;ARAW=c.A;AT.dele=c.dele||null;$('status').textContent='Analyse hentet fra cache'+anaUden();applyNorm();buildPeaks();const T0=anaTjek();if(T0&&!T0.ok){$('status').textContent='Den gemte analyse passer ikke til lyden ('+(T0.laengdeOK?'den er stille et sted, hvor der er lyd':'forkert længde')+'). Analyserer igen …';const r=await anaAlt(buf,{efterTrin1:R1=>{RAW=R1;ARAW=null;cachePut(key,{F:RAW});anaKlar1()}});RAW=r.F;ARAW=r.A;cachePut(key3,{F:RAW,A:ARAW,dele:AT.dele});$('status').textContent='Analyseret igen og gemt (den gamle analyse passede ikke til lyden)'+anaUden()}}
  else{const c2=(c&&c.F)?c:await cacheGet(key);let F1=null;if(c2&&c2.F&&c2.F.kick&&Math.abs(c2.F.kick.length-Math.floor((buf.length-2048)/H))<=Math.max(2,buf.length/H*.01))F1=c2.F;const r=await anaAlt(buf,{F:F1,efterTrin1:R1=>{RAW=R1;ARAW=null;if(!F1)cachePut(key,{F:RAW});anaKlar1()}});RAW=r.F;ARAW=r.A;cachePut(key3,{F:RAW,A:ARAW,dele:AT.dele});$('status').textContent='Analyse færdig og gemt i cache'+anaUden()}
  applyNorm();buildPeaks();renderTune();renderGuide();showUI();showFundet();if(autoOn)autoSetup();$('play').disabled=false;anaSkjul();try{anaStatus()}catch(e){}
 }catch(err){if(err&&err.message==='ANA_STOP'){anaSkjul();if(RAW&&F&&ANA.trin===2){ARAW=null;A=null;TONER=[];$('status').textContent='Trin 2 blev annulleret: lydtrækkene kan bruges, men toner, bånd, stereo og klang mangler (tryk Analysér igen i Automatik).'}else{RAW=null;F=null;ARAW=null;A=null;try{$('play').disabled=true}catch(e){}$('status').textContent='Analysen blev annulleret. Vælg lydfilen igen for at analysere den.'}}else{console.error(err);$('status').textContent='Programfejl: '+(err&&err.message||err)}}
};

/* ---------- Afspilning ---------- */
const now=()=>{if(!playing)return offset;const raw=offset+actx.currentTime-startAt;if(LOOP.til&&LOOP.b>LOOP.a&&raw>=LOOP.b)return LOOP.a+((raw-LOOP.a)%(LOOP.b-LOOP.a));return Math.min(dur,raw)};
