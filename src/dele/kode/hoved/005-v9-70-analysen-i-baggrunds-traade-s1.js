/* ========== v9.70: ANALYSEN I BAGGRUNDS-TRÅDE (S1) ==========
   Planen docs/PLAN-SANG-OG-ANALYSE.md, trin S1 (brugerens valg a + c, P8.4). Før regnede analyze() og analyzeAna() i samme tråd som skærmen,
   i små bidder med pauser; 74 minutter tog cirka 10 minutter. Nu deles sangen i stykker (AT.JOB rammer, cirka 28 s), og en pulje af baggrunds-tråde
   (fagudtryk: Web Workers; én pr. kerne, højst 8) regner stykkerne. Tråden får Rytme-motoren (scriptet rytme-runtime) og makeFFT som tekst
   (blob-adresse, intet internet). Hver ramme regnes med præcis samme kode som før; trin 1 får én ramme ekstra foran som tilløb til flux (den forrige
   rammes spektrum), og kick, snare og hihat (rise) regnes bagefter over hele rækken, som før. Trin 2 deles kun ved lige rammenumre, så parrene (f, f+1)
   er de samme som før. Tallene er de samme (test 65 sammenligner med den gamle analyse).
   - Brug sangen imens (c): efter trin 1 kaldes efterTrin1 (RAW, applyNorm, buildPeaks, Afspil), mens trin 2 regnes videre.
   - Flueben pr. del (set.anaDele: toner, baand, klang, stereo; i panelet Automatik): anaRamme får A.dele og springer det fra-slåede over; stereo
     springes over i selve trinnet. AT.dele husker, hvad den viste analyse er lavet uden (gemmes i cachen som dele); anaUden() skriver det.
   - Kan tråde ikke laves (eller fejler en), bruges analyze()/analyzeAna() i samme tråd som før (AT.fejl, statuslinjen).
   - Annullér: trådene afbrydes (terminate), og ANA_STOP kastes som før. 4 spor (stems) bruger stadig den gamle vej. */
const AT={JOB:600,pool:null,url:null,dele:null,fejl:null,brugt:0,tid:null};
function atDele(){return Object.assign({toner:true,baand:true,klang:true,stereo:true},set.anaDele||{})}
const AT_NAVN={toner:'Toner og tonehøjde',baand:'De 31 bånd',klang:'Klang',stereo:'Stereo'};
function atDeleTekst(){const d=atDele();const til=Object.keys(AT_NAVN).filter(k=>d[k]!==false).map(k=>AT_NAVN[k].toLowerCase());return til.length?til.join(', '):'kun toneklasser'}
function anaUden(){const d=AT.dele;if(!d)return'';const fra=Object.keys(AT_NAVN).filter(k=>d[k]===false).map(k=>AT_NAVN[k]);return fra.length?' · analyseret uden: '+fra.join(', '):''}
function atDeleHtml(){const d=atDele();return'<div class="au-dele" title="Det, der er slået fra, regnes ikke i trin 2 (dets kilder giver 0). Gælder næste analyse: tryk Analysér igen.">Dele af analysen (næste analyse): '+Object.keys(AT_NAVN).map(k=>'<label><input type="checkbox" data-audel="'+k+'"'+(d[k]!==false?' checked':'')+'> '+AT_NAVN[k]+'</label>').join(' ')+(AT.fejl?' <span class="au-fejl">Baggrunds-tråde virkede ikke ('+neHtml(AT.fejl)+'); analysen regnes i samme tråd som før.</span>':'')+'</div>'}
document.addEventListener('change',e=>{const c=e.target&&e.target.closest&&e.target.closest('[data-audel]');if(!c)return;set.anaDele=Object.assign(atDele(),{[c.dataset.audel]:c.checked});try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}
 try{msg((c.checked?'Med':'Uden')+' '+AT_NAVN[c.dataset.audel]+' i næste analyse. Tryk Analysér igen for at regne sangen om.')}catch(x){}});
function atAntal(){return Math.max(1,Math.min(8,(navigator.hardwareConcurrency||2)-1))}
/* Koden, der kører i tråden (sendes som tekst; må ikke bruge noget fra siden). */
function atTraadKode(){
 let BANDS_K=[];const H=1024;
 self.onmessage=e=>{const m=e.data;try{if(m.type==='start'){BANDS_K=m.bands;self.postMessage({type:'klar'});return}
  const ud=m.type==='trin1'?trin1(m):trin2(m);const tr=[];for(const k in ud.R)tr.push(ud.R[k].buffer);self.postMessage(ud,tr)}catch(err){self.postMessage({type:'fejl',id:m.id,fejl:String(err&&err.message||err)})}};
 function trin1(m){const {c0,sr,start,f0,f1,id}=m,c1=m.c1||c0,N=2048,fft=makeFFT(N),n=f1-f0,R={};BANDS_K.forEach(k=>R[k]=new Float32Array(n));
  const re=new Float32Array(N),im=new Float32Array(N),mag=new Float32Array(N/2),prev=new Float32Array(N/2),win=new Float32Array(N);
  for(let i=0;i<N;i++)win[i]=.5-.5*Math.cos(2*Math.PI*i/N);
  const bin=f=>Math.min(N/2-1,Math.round(f*N/sr)),fr=i=>i*sr/N;
  const band=(a,z)=>{const i0=bin(a),i1=Math.max(i0+1,bin(z));let s=0;for(let i=i0;i<i1;i++)s+=mag[i]*mag[i];return Math.log10(1+100*Math.sqrt(s/(i1-i0)))};
  const top=bin(8000);
  for(let f=Math.max(0,f0-1);f<f1;f++){
   const o=f*H-start;let sq=0,zc=0,lp=0;
   for(let i=0;i<N;i++){const v=(c0[o+i]+c1[o+i])*.5;re[i]=v*win[i];im[i]=0;sq+=v*v;if(i&&(v>=0)!==(lp>=0))zc++;lp=v}
   fft(re,im);
   let fl=0,sm=0,cw=0,lg=0;
   for(let i=0;i<N/2;i++){mag[i]=Math.hypot(re[i],im[i])/N*4;const d=mag[i]-prev[i];if(d>0)fl+=d;prev[i]=mag[i]}
   if(f<f0)continue;/* tilløb: kun prev (flux) skal være som før */
   for(let i=1;i<top;i++){sm+=mag[i];cw+=mag[i]*fr(i);lg+=Math.log(mag[i]+1e-9)}
   let acc=0,ro=0;for(let i=1;i<top;i++){acc+=mag[i];if(acc>=.85*sm){ro=fr(i);break}}
   const q=f-f0;R.bas[q]=band(20,250);R.mid[q]=band(250,2000);R.hmid[q]=band(2000,6000);R.brill[q]=band(6000,16000);
   R.rms[q]=Math.sqrt(sq/N);R.centroid[q]=sm>1e-6?cw/sm:0;R.rolloff[q]=ro;R.flux[q]=fl;
   R.flat[q]=sm>1e-6?Math.exp(lg/(top-1))/(sm/(top-1)):0;R.zcr[q]=zc/N;
   R.vokal[q]=band(200,900)*(1-Math.min(1,R.flat[q]*3))}
  return{type:'trin1',id,f0,f1,R}}
 function trin2(m){const {c0,sr,start,total,f0,f1,id,dele}=m,c1=m.c1||c0,AN=Rytme.anaNy(sr),N=8192,n=f1-f0,x=new Float32Array(N),xl=new Float32Array(N),xr=new Float32Array(N),R={};AN.dele=dele;
  Rytme.ANA_KILDER.forEach(k=>R[k.key]=new Float32Array(n));R.f0=new Float32Array(n);R.klar=new Float32Array(n);R.f0m=new Float32Array(n);R.klarm=new Float32Array(n);
  for(let f=f0;f<f1;f+=2){const st=f*H+1024-N/2;for(let i=0;i<N;i++){const j=st+i;const gyldig=j>=0&&j<total;x[i]=gyldig?(c0[j-start]+c1[j-start])*.5:0;xl[i]=gyldig?c0[j-start]:0;xr[i]=gyldig?c1[j-start]:0}
   const o=Rytme.anaRamme(AN,x),sv=dele.stereo!==false?Rytme.stereoRamme(xl,xr,N/2-2048,N/2+2048):{pan:.5,bredde:0,fase:.5};
   for(let h=0;h<2&&f+h<f1;h++){const q=f+h-f0;for(const k in o.k)R[k][q]=o.k[k];R['ana:pan'][q]=sv.pan;R['ana:bredde'][q]=sv.bredde;R['ana:fase'][q]=sv.fase;R.f0[q]=o.raa.f0;R.klar[q]=o.raa.klar;R.f0m[q]=o.raa.f0m;R.klarm[q]=o.raa.klarm}}
  return{type:'trin2',id,f0,f1,R}}
}
function atKilde(){const rt=document.getElementById('rytme-runtime');if(!rt)throw new Error('rytme-runtime mangler');return rt.textContent+'\n'+makeFFT.toString()+'\n('+atTraadKode.toString()+')();'}
async function atPool(){if(AT.pool)return AT.pool;if(typeof Worker==='undefined')throw new Error('browseren har ingen Worker');
 if(!AT.url)AT.url=URL.createObjectURL(new Blob([atKilde()],{type:'text/javascript'}));const n=atAntal(),P=[];
 for(let i=0;i<n;i++){const w=new Worker(AT.url);P.push(w)}
 await Promise.all(P.map(w=>new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('tråden svarede ikke')),8000);w.onmessage=e=>{if(e.data&&e.data.type==='klar'){clearTimeout(t);res()}};w.onerror=e=>{clearTimeout(t);rej(new Error(e&&e.message||'tråden fejlede'))};w.postMessage({type:'start',bands:BANDS.map(b=>b[0])})})))
  .catch(e=>{P.forEach(w=>{try{w.terminate()}catch(x){}});throw e});
 AT.pool=P;AT.brugt=n;return P}
function atLuk(){if(AT.pool){AT.pool.forEach(w=>{try{w.terminate()}catch(x){}});AT.pool=null}}
/* Ét trin (1 eller 2) over hele sangen i trådene. Giver de fulde rækker som analyze()/analyzeAna(). */
async function atKoer(b,trin,dele){const P=await atPool();const c0=b.getChannelData(0),c1=b.numberOfChannels>1?b.getChannelData(1):null,L=c0.length,sr0=b.sampleRate,n=Math.floor((L-2048)/H);
 const R={};if(trin===1)BANDS.forEach(([k])=>R[k]=new Float32Array(n));else{Rytme.ANA_KILDER.forEach(k=>R[k.key]=new Float32Array(n));R.f0=new Float32Array(n);R.klar=new Float32Array(n);R.f0m=new Float32Array(n);R.klarm=new Float32Array(n)}
 const jobs=[];for(let f0=0;f0<n;f0+=AT.JOB){const f1=Math.min(n,f0+AT.JOB);let s0,s1;if(trin===1){s0=Math.max(0,(f0-1)*H);s1=Math.min(L,(f1-1)*H+2048)}else{s0=Math.max(0,f0*H+1024-4096);s1=Math.min(L,(f1-1)*H+1024+4096)}jobs.push({f0,f1,s0,s1})}
 let naeste=0,faerdige=0,rammer=0,fejl=null;anaFrem(trin,0);
 await new Promise((res,rej)=>{const iv=setInterval(()=>{if(ANA.stop&&!fejl){fejl=new Error('ANA_STOP');clearInterval(iv);rej(fejl)}},150);const giv=w=>{if(fejl)return;if(ANA.stop){fejl=new Error('ANA_STOP');rej(fejl);return}if(naeste>=jobs.length)return;const j=jobs[naeste],id=naeste++;const a0=c0.slice(j.s0,j.s1),a1=c1?c1.slice(j.s0,j.s1):null;
   w.onmessage=e=>{const m=e.data;if(!m)return;if(m.type==='fejl'){fejl=new Error(m.fejl);rej(fejl);return}for(const k in m.R){if(R[k])R[k].set(m.R[k],m.f0)}faerdige++;rammer+=m.f1-m.f0;anaFrem(trin,Math.min(1,rammer/n));try{const pct=Math.round(100*rammer/n);$('status').textContent=trin===1?'Analyserer… '+pct+'%':'Lydtræk er klar: du kan spille sangen nu. Toner og klang regnes stadig … '+pct+'%'}catch(e){}if(faerdige===jobs.length){clearInterval(iv);res()}else giv(w)};
   w.onerror=e=>{fejl=new Error((e&&e.message)||'tråden fejlede');rej(fejl)};
   w.postMessage({type:trin===1?'trin1':'trin2',id,c0:a0,c1:a1,sr:sr0,start:j.s0,total:L,f0:j.f0,f1:j.f1,dele},a1?[a0.buffer,a1.buffer]:[a0.buffer])};
  P.forEach(giv)}).catch(e=>{atLuk();throw e});
 if(trin===1){const rise=(a,w)=>{const o=new Float32Array(n);for(let i=1;i<n;i++)o[i]=Math.max(0,a[i]-(a[i-1]*.5+(a[i-2]||0)*.5))*(w?w(i):1);return o};R.kick=rise(R.bas);R.snare=rise(R.hmid,i=>.5+R.zcr[i]*8);R.hihat=rise(R.brill)}
 return R}
/* Hele analysen: trin 1 (eller opt.F, hvis lydtrækkene findes i forvejen), efterTrin1, trin 2. Falder tilbage til den gamle vej, hvis trådene fejler. */
async function anaAlt(b,opt){opt=opt||{};const dele=atDele();AT.fejl=null;AT.dele=null;sr=b.sampleRate;const t0=performance.now();let F1=opt.F||null,A1;
 try{if(typeof NE2!=='undefined')NE2.analyserer=true}catch(e){}
 try{if(!F1){try{F1=await atKoer(b,1,dele)}catch(e){if(e&&e.message==='ANA_STOP')throw e;console.warn('Baggrunds-tråde fejlede; den gamle analyse bruges',e);AT.fejl=String((e&&e.message)||e);F1=await analyze(b)}}}
 finally{try{if(typeof NE2!=='undefined')NE2.analyserer=false}catch(e){}}
 const t1=performance.now();if(opt.efterTrin1)try{opt.efterTrin1(F1)}catch(e){console.error(e)}
 try{if(typeof NE2!=='undefined')NE2.analyserer='trin2'}catch(e){}
 try{if(AT.fejl)A1=await analyzeAna(b);else{try{A1=await atKoer(b,2,dele)}catch(e){if(e&&e.message==='ANA_STOP')throw e;console.warn('Baggrunds-tråde fejlede i trin 2; den gamle analyse bruges',e);AT.fejl=String((e&&e.message)||e);A1=await analyzeAna(b)}}}
 finally{try{if(typeof NE2!=='undefined')NE2.analyserer=false}catch(e){}}
 AT.dele=dele;AT.tid={trin1:Math.round(t1-t0),trin2:Math.round(performance.now()-t1),traade:AT.fejl?0:AT.brugt};try{if(AT.fejl)$('status').textContent+=' · baggrunds-tråde virkede ikke ('+AT.fejl+'); regnet i samme tråd som før'}catch(e){}
 return{F:F1,A:A1}}
/* Efter trin 1: sangen kan bruges, mens trin 2 regnes. */
function anaKlar1(){try{applyNorm();buildPeaks()}catch(e){console.error(e)}try{$('play').disabled=false}catch(e){}try{$('status').textContent='Lydtræk er klar: du kan spille sangen nu. Toner og klang regnes stadig …'}catch(e){}}
/* ========== SLUT: ANALYSEN I BAGGRUNDS-TRÅDE (S1) ========== */
