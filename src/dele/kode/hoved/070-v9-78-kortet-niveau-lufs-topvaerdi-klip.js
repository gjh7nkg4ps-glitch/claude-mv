/* ========== v9.78: KORTET NIVEAU (LUFS, topværdi, klip) ==========
   Planen docs/PLAN-SANG-OG-ANALYSE.md, trin S4: kortet Niveau under Sang → Sang. Lige nu: V og H i dB fra den samme lytter som Lydfil-noden
   (ne3Tap: AnalyserNode på UDG.pre, før EQ), topmærke (holder 1,5 s) og klip-tæller (prøver ≥ 0,989 = −0,1 dBFS). Hele sangen (nivStart, regnet
   i bidder på cirka 1 s lyd ad gangen, så siden ikke fryser; 74 minutter tager nogle sekunder): K-vægtning (to biquad-filtre efter ITU-R BS.1770),
   100 ms delblokke med middel af kvadratet pr. kanal; momentan lydstyrke (400 ms), integreret lydstyrke med absolut (−70) og relativ (−10) gating,
   kortvarig lydstyrke (3 s hvert sekund, NIV.st: rækken Lydstyrke i Lyd over tid) og lydstyrke-område LRA (10. til 95. percentil, gating −70/−20);
   topværdi (største prøve), RMS, crest factor og klip. Alt er kun visning (P8.4, spørgsmål 4): ingen nye lydtræk. */
var NIV={buf:null,klar:false,res:null,st:null,x:0,peak:{L:0,R:0,tL:0,tR:0},klip:0,klipSidst:0,sig:''};
function nivByg(){if(typeof NIV==='undefined'||!NIV)return;const k=document.querySelector('#sg [data-sgk="niv"]');if(!k||k.dataset.klar)return;k.dataset.klar='1';
 k.innerHTML='<div class="niv-nu"><div class="niv-m"><span>V</span><i class="niv-bar"><u data-niv="L"></u><b data-niv="pL"></b></i><em data-niv="Ldb">–∞ dB</em></div><div class="niv-m"><span>H</span><i class="niv-bar"><u data-niv="R"></u><b data-niv="pR"></b></i><em data-niv="Rdb">–∞ dB</em></div><div class="niv-klip"><span>Klip</span><em data-niv="klip">0</em><button class="ghost" data-niv="nul" title="Nulstil klip-tælleren og topmærkerne">Nulstil</button></div></div><div class="niv-sang" data-niv="sang"></div>';
 k.addEventListener('click',e=>{if(e.target.closest('[data-niv="nul"]')){NIV.klip=0;NIV.peak={L:0,R:0,tL:0,tR:0};NIV.sig='';nivSang()}});nivSang()}
function nivTal(v,d){return Number.isFinite(v)?(v<0?'−':'')+Math.abs(v).toFixed(d==null?1:d).replace('.',','):'–'}
function nivSang(){const e=document.querySelector('#sg [data-niv="sang"]');if(!e)return;const R=NIV.res;let h;
 if(!buf)h='<span class="small">Vælg en lydfil: tallene for hele sangen regnes, når sangen er valgt.</span>';
 else if(!NIV.klar||NIV.buf!==maalBuf())h='<span class="small">Regner hele sangen … '+Math.round(100*(NIV.x||0)/Math.max(1,buf.length))+' %</span>';
 else{const c=(n,v,enh,tip)=>'<div class="niv-tal" title="'+neHtml(tip)+'"><span>'+n+'</span><b>'+v+'</b><small>'+enh+'</small></div>';
  h=c('Lydstyrke, integreret',nivTal(R.lufs),'LUFS','Hele sangens lydstyrke efter ITU-R BS.1770 (K-vægtning, absolut og relativ gating). Streaming-tjenester sigter typisk efter −14 LUFS.')
   +c('Lydstyrke-område (LRA)',nivTal(R.lra),'LU','Forskellen mellem de stille og de kraftige dele (10. til 95. percentil af den kortvarige lydstyrke). Lille tal = jævn, stort tal = dynamisk.')
   +c('Topværdi',nivTal(R.peakDb),'dBFS','Den højeste prøve i filen (ikke true peak). 0 dBFS er loftet.')
   +c('RMS',nivTal(R.rmsDb),'dBFS','Middelstyrken over hele sangen.')
   +c('Crest factor',nivTal(R.crest),'dB','Topværdi minus RMS. Lille tal = presset, komprimeret lyd; stort tal = luft og dynamik.')
   +c('Klip',String(R.klip),'prøver','Antal prøver på loftet (over −0,1 dBFS) i filen.')}
 if(e.innerHTML!==h)e.innerHTML=h}
/* biquad efter RBJ; K-vægtning: high shelf +4 dB ved 1681,97 Hz (Q 0,7072) og high-pass 38,135 Hz (Q 0,5003) */
function nivBiquad(type,fs,f0,Q,G){const w=2*Math.PI*f0/fs,cs=Math.cos(w),sn=Math.sin(w),al=sn/(2*Q);let b0,b1,b2,a0,a1,a2;
 if(type==='shelf'){const A=Math.pow(10,G/40),sA=Math.sqrt(A);b0=A*((A+1)+(A-1)*cs+2*sA*al);b1=-2*A*((A-1)+(A+1)*cs);b2=A*((A+1)+(A-1)*cs-2*sA*al);a0=(A+1)-(A-1)*cs+2*sA*al;a1=2*((A-1)-(A+1)*cs);a2=(A+1)-(A-1)*cs-2*sA*al}
 else{b0=(1+cs)/2;b1=-(1+cs);b2=(1+cs)/2;a0=1+al;a1=-2*cs;a2=1-al}
 return{b0:b0/a0,b1:b1/a0,b2:b2/a0,a1:a1/a0,a2:a2/a0,x1:0,x2:0,y1:0,y2:0}}
function nivStart(){const MB=maalBuf();if(!MB){NIV.buf=null;NIV.klar=false;NIV.res=null;NIV.st=null;return}if(NIV.buf===MB)return;const B=MB;NIV.buf=B;NIV.klar=false;NIV.res=null;NIV.st=null;NIV.x=0;
 const fs=B.sampleRate,ch=Math.min(2,B.numberOfChannels),d0=B.getChannelData(0),d1=ch>1?B.getChannelData(1):d0,len=B.length,sub=Math.max(1,Math.round(fs*.1)),nSub=Math.ceil(len/sub);
 const Z=[new Float64Array(nSub),new Float64Array(nSub)],f=[[nivBiquad('shelf',fs,1681.974,.7072,3.99984),nivBiquad('hp',fs,38.13547,.5003,0)],[nivBiquad('shelf',fs,1681.974,.7072,3.99984),nivBiquad('hp',fs,38.13547,.5003,0)]];
 let i=0,peak=0,sq=0,klip=0;const bid=Math.round(fs);
 const trin=()=>{if(NIV.buf!==B)return;const t0=performance.now();
  while(i<len&&performance.now()-t0<10){const i1=Math.min(len,i+bid);for(let c=0;c<2;c++){const d=c?d1:d0,F1=f[c][0],F2=f[c][1],z=Z[c];for(let n=i;n<i1;n++){const x=d[n],ax=x<0?-x:x;if(ax>peak)peak=ax;if(ax>=.98855)klip++;sq+=x*x;
     let y=F1.b0*x+F1.b1*F1.x1+F1.b2*F1.x2-F1.a1*F1.y1-F1.a2*F1.y2;F1.x2=F1.x1;F1.x1=x;F1.y2=F1.y1;F1.y1=y;const x2=y;y=F2.b0*x2+F2.b1*F2.x1+F2.b2*F2.x2-F2.a1*F2.y1-F2.a2*F2.y2;F2.x2=F2.x1;F2.x1=x2;F2.y2=F2.y1;F2.y1=y;z[(n/sub)|0]+=y*y}}i=i1;NIV.x=i}
  if(i<len){setTimeout(trin,0);return}
  /* færdig: blokke og gating */
  for(let c=0;c<2;c++)for(let q=0;q<nSub;q++){const n0=q*sub,n1=Math.min(len,n0+sub);Z[c][q]=n1>n0?Z[c][q]/(n1-n0):0}
  const lk=(q0,n)=>{let s=0;for(let c=0;c<2;c++)for(let q=q0;q<q0+n;q++)s+=Z[c][q];s/=n;return s>0?-0.691+10*Math.log10(s*(ch>1?1:2)):-Infinity};/* mono: begge kanaler er den samme (vægt 1 hver i BS.1770, så mono tæller dobbelt) */
  const mom=[];for(let q=0;q+4<=nSub;q++)mom.push(lk(q,4));const st=[];for(let q=0;q+30<=nSub;q+=10)st.push(lk(q,30));if(!st.length&&nSub>0)st.push(lk(0,nSub));
  const gate=(L,rel)=>{let a=L.filter(v=>v>-70);if(!a.length)return[];const m=10*Math.log10(a.reduce((s,v)=>s+Math.pow(10,v/10),0)/a.length);return a.filter(v=>v>m+rel)};
  const gi=gate(mom,-10),lufs=gi.length?10*Math.log10(gi.reduce((s,v)=>s+Math.pow(10,v/10),0)/gi.length):-Infinity;
  const gs=gate(st,-20).sort((p,q)=>p-q),lra=gs.length>1?gs[Math.floor(.95*(gs.length-1))]-gs[Math.floor(.1*(gs.length-1))]:0;
  const rmsDb=sq>0?20*Math.log10(Math.sqrt(sq/(len*2))):-Infinity,peakDb=peak>0?20*Math.log10(peak):-Infinity;
  NIV.res={lufs,lra,peakDb,rmsDb,crest:Number.isFinite(peakDb)&&Number.isFinite(rmsDb)?peakDb-rmsDb:NaN,klip,st:st.length};NIV.st=Float32Array.from(st);NIV.klar=true;NIV.sig='';try{LOT.offSig=''}catch(e){}nivSang()};
 setTimeout(trin,0)}
function nivTik(){const k=document.querySelector('#sg [data-sgk="niv"]');if(!k||k.offsetParent===null)return;if(!NIV.klar||NIV.buf!==maalBuf()){if((nivTik.n=(nivTik.n||0)+1)%15===0)nivSang()}
 const spil=(typeof playing!=='undefined'&&playing)||(typeof live!=='undefined'&&live);let tap=null;try{tap=spil?ne3Tap():null}catch(e){}
 const nu=performance.now(),pct=x=>(Math.max(0,Math.min(1,x))*100).toFixed(1)+'%',mx=d=>Number.isFinite(d)?Math.max(0,Math.min(1,(d+60)/60)):0;
 let L=-Infinity,R=-Infinity;if(tap){L=ne3Db(tap.L);R=tap.R?ne3Db(tap.R):L;const b=NIV.tb||(NIV.tb=new Float32Array(1024));[['L',tap.L],['R',tap.R||tap.L]].forEach(([c,an])=>{try{an.getFloatTimeDomainData(b)}catch(e){return}let m=0,kl=false;for(let i=0;i<b.length;i++){const a=b[i]<0?-b[i]:b[i];if(a>m)m=a;if(a>=.98855)kl=true}const db=m>0?20*Math.log10(m):-Infinity;if(db>=NIV.peak[c]||nu-NIV.peak['t'+c]>1500){NIV.peak[c]=db;NIV.peak['t'+c]=nu}if(kl&&c==='L'&&nu-NIV.klipSidst>120){NIV.klip++;NIV.klipSidst=nu}})}
 const sx=(q,s)=>{const e=k.querySelector('[data-niv="'+q+'"]');if(e&&e.textContent!==s)e.textContent=s},sw=(q,x)=>{const e=k.querySelector('[data-niv="'+q+'"]');if(e&&e.style.width!==pct(x))e.style.width=pct(x)},sl=(q,x)=>{const e=k.querySelector('[data-niv="'+q+'"]');if(e&&e.style.left!==pct(x))e.style.left=pct(x)};
 sw('L',mx(L));sw('R',mx(R));sx('Ldb',ne3DbTxt(L));sx('Rdb',ne3DbTxt(R));sl('pL',mx(NIV.peak.L));sl('pR',mx(NIV.peak.R));sx('klip',String(NIV.klip))}
try{nivByg()}catch(e){console.error(e)}
/* ========== SLUT: KORTET NIVEAU ========== */

