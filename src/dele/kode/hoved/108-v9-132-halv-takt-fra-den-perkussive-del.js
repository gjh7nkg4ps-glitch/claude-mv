
/* ========== v9.132: DEN HALVE TAKT FRA DEN PERKUSSIVE DEL (P8.33 TRIN 2) ==========
   Hovedchattens P8.33 trin 2 (S7 i planen): uden 4 spor lægges taktslagene i testlydens Hip-hop, Techno og Breakbeat på modslaget, fordi bassen og den åbne
   hihat ligger mellem slagene. Harmonisk og perkussiv deling (fagudtryk: HPSS, Fitzgerald 2010): et medianfilter hen over tiden giver det harmoniske (toner,
   der varer), hen over frekvenserne det perkussive (korte slag over mange frekvenser). Her regnes det på et log-frekvens-spektrogram (96 bånd fra 30 Hz til
   16 kHz; kun de 30 nederste bruges, FFT 2048 og hop 1024 som analysen, medianer over 17 rammer og 9 bånd, blød maske med potens 2).
   - Målt (Testlyd; Rigtige trommer med indstil og tjek; alle / indstil / tjek):
       a) hele taktgitteret på den perkussive del: Testlyd Taktslag 49 → 65, men kun trommer 81 → 70; Rigtige hele mixet Taktslag 81/77/86 → 80/86/74 og
          Takt 1 69/58/80 → 65/73/57: indstil bedre, tjek meget dårligere; kommer ikke med.
       b) kun afgørelsen om den halve takt (A3, v9.117) bruger den perkussive kick (energien under 120 Hz uden den bas, der varer ved): Testlyd hele lyden
          Taktslag 49 → 65 og Takt 1 31 → 45 (Techno 0 → 97); kun trommer 81 og 76 som før; Rigtige trommer præcis de samme tal i alle rækker. Det er denne.
       c) som b, men også med den perkussive snare: House og Techno fejler igen (Testlyd 49); kommer ikke med.
   - Sangen: den perkussive kick regnes i sin egen baggrunds-tråd (makeFFT og a3hpssKick som tekst, intet internet), når sangen er analyseret, og gemmes i
     cachen (hpss1|sangens nøgle); så regnes taktgitteret om. Over 20 minutter: hele lyden (står i rækken). Med 4 spor bruges Trommer-sporet som før (v9.124).
   - Testene: Testlyd regner den perkussive kick for hver testlyd; Rigtige trommer gemmer den pr. lydfil (mdb1h|filnavn|størrelse), så Mål igen giver de
     samme tal.
   - Indstillinger for analysen → Halv takt uden spor: Perkussiv del (standard) / Hele lyden (set.a3perk = false; som før v9.132). Med A3 slået fra: som før v9.117.
   - Breakbeat rammer stadig ikke: kicket ligger mest på modslaget, og det kan være musikken (står i "Sådan måles det"). */
const A3H={nu:null,brugt:false,url:null,sang:{noegle:null,kick:null,regner:false,fejl:null}};
function a3hTil(){return a3Til()&&!(typeof set!=='undefined'&&set&&set.a3perk===false)}
/* den perkussive kick: ren funktion (bruges både i tråden og i testene) */
function a3hpssKick(x,sr,n){const N=2048,Hh=1024,fft=makeFFT(N),B=96,BK=30,fmin=30,fmax=16000,tw=8,fw=4,edges=[];
 for(let b=0;b<=B;b++){const f=fmin*Math.pow(fmax/fmin,b/B);edges.push(Math.max(1,Math.min(N/2,Math.round(f*N/sr))))}for(let b=1;b<=B;b++)if(edges[b]<=edges[b-1])edges[b]=edges[b-1]+1;
 const S=new Float32Array(n*BK),re=new Float32Array(N),im=new Float32Array(N),win=new Float32Array(N);for(let i=0;i<N;i++)win[i]=.5-.5*Math.cos(2*Math.PI*i/N);
 for(let f=0;f<n;f++){const o=f*Hh;for(let i=0;i<N;i++){const j=o+i;re[i]=(j<x.length?x[j]:0)*win[i];im[i]=0}fft(re,im);for(let b=0;b<BK;b++){let s=0;const i0=edges[b],i1=Math.min(N/2,edges[b+1]);for(let i=i0;i<i1;i++)s+=re[i]*re[i]+im[i]*im[i];S[f*BK+b]=Math.sqrt(s/Math.max(1,i1-i0))}}
 const w=new Float32Array(17),med=k=>{for(let i=1;i<k;i++){const v=w[i];let j=i-1;while(j>=0&&w[j]>v){w[j+1]=w[j];j--}w[j+1]=v}return w[k>>1]},lo=[];
 for(let b=0;b<BK;b++){const fc=fmin*Math.pow(fmax/fmin,(b+.5)/B);if(fc<120)lo.push(b)}
 const kick=new Float32Array(n);let p1=0,p2=0;
 for(let f=0;f<n;f++){let e=0;for(const b of lo){let k=0;for(let d=-tw;d<=tw;d++){const g=f+d;if(g>=0&&g<n)w[k++]=S[g*BK+b]}const hm=med(k);k=0;for(let d=-fw;d<=fw;d++){const c=b+d;if(c>=0&&c<B&&c<BK)w[k++]=S[f*BK+c]}const pm=med(k),v=S[f*BK+b]*(pm*pm/(hm*hm+pm*pm+1e-20));e+=v*v}
  e=Math.sqrt(e);kick[f]=Math.max(0,e-(p1+p2)/2);p2=p1;p1=e}
 const s=Float32Array.from(kick).sort(),p=s[Math.floor(s.length*.99)]||1e-9;for(let i=0;i<n;i++)kick[i]=Math.min(1,kick[i]/p);return kick}
function a3hMono(b){const c0=b.getChannelData(0),c1=b.numberOfChannels>1?b.getChannelData(1):c0,x=new Float32Array(c0.length);for(let i=0;i<x.length;i++)x[i]=(c0[i]+c1[i])*.5;return x}
function a3hTraad(){self.onmessage=e=>{const m=e.data;try{const k=a3hpssKick(m.x,m.sr,m.n);self.postMessage({kick:k},[k.buffer])}catch(err){self.postMessage({fejl:String(err&&err.message||err)})}}}
function a3hRegn(x,sr,n){return new Promise((res,rej)=>{try{if(!A3H.url)A3H.url=URL.createObjectURL(new Blob([makeFFT.toString()+'\n'+a3hpssKick.toString()+'\n('+a3hTraad.toString()+')();'],{type:'text/javascript'}));const w=new Worker(A3H.url);
 w.onmessage=e=>{w.terminate();e.data.fejl?rej(new Error(e.data.fejl)):res(e.data.kick)};w.onerror=e=>{w.terminate();rej(new Error(e.message||'tråden fejlede'))};w.postMessage({x,sr,n},[x.buffer])}catch(e){rej(e)}})}
/* den perkussive kick, der passer til analysen lige nu (testene: A3H.nu; ellers sangens) */
function a3hKick(){if(!a3hTil()||typeof F==='undefined'||!F||!F.kick)return null;const P=A3S.test?A3H.nu:(A3H.nu||(A3H.sang.kick&&A3H.sang.noegle===a3hNoegle()?A3H.sang.kick:null));if(!P)return null;
 const n=F.kick.length;if(Math.abs(P.length-n)>3)return null;if(P.length===n)return P;const o=new Float32Array(n);o.set(Array.prototype.slice.call(P,0,n));return o}
{const gl=Rytme.taktslag;Rytme.taktslag=function(){if(A3S.trom)return gl.apply(this,arguments);/* med 4 spor: Trommer-sporet (v9.124) */const P=a3hKick();if(!P)return gl.apply(this,arguments);A3H.brugt=true;const g=F;F=Object.assign({},F,{kick:P});try{return gl.apply(this,arguments)}finally{F=g}}}
{const gl=showAnalyser;window.showAnalyser=function(){A3H.brugt=false;const r=gl.apply(this,arguments);if(r)r.halv=A3H.brugt?'perkussiv':'hele';return r}}
/* sangen: regnes i baggrunden, når den er analyseret */
function a3hNoegle(){const k=typeof SHOWKEY==='string'?SHOWKEY:'';return k&&!k.startsWith('stems|')?'hpss1|'+k:null}
async function a3hSang(){if(!a3hTil()||A3H.sang.regner||typeof buf==='undefined'||!buf||typeof F==='undefined'||!F||!F.kick||(typeof live!=='undefined'&&live)||(typeof STEM!=='undefined'&&STEM.klar))return;const key=a3hNoegle();if(!key||A3H.sang.noegle===key)return;
 if(buf.duration>20*60){A3H.sang={noegle:key,kick:null,regner:false,fejl:'sangen er over 20 minutter'};try{a3Raekke()}catch(e){}return}
 A3H.sang={noegle:key,kick:null,regner:true,fejl:null};try{a3Raekke()}catch(e){}const n=F.kick.length;let kick=null;
 try{const c=await cacheGet(key);if(c&&c.kick&&Math.abs(c.kick.length-n)<=3)kick=c.kick;else{try{kick=await a3hRegn(a3hMono(buf),buf.sampleRate,n)}catch(e){kick=a3hpssKick(a3hMono(buf),buf.sampleRate,n)}cachePut(key,{kick})}}
 catch(e){A3H.sang={noegle:key,kick:null,regner:false,fejl:String(e&&e.message||e)};return}
 if(A3H.sang.noegle!==key||a3hNoegle()!==key)return;A3H.sang={noegle:key,kick,regner:false,fejl:null};
 if(typeof RAW!=='undefined'&&RAW&&!(typeof STEM!=='undefined'&&STEM.klar)){try{applyNorm();buildPeaks();renderTune();showUI()}catch(e){console.error(e)}}/* taktgitteret regnes om */try{const r=document.querySelector('#sg [data-a3r]');if(r)r.remove();a3Raekke()}catch(e){}}
setInterval(()=>{a3hSang()},1500);
/* Testlyd: den perkussive kick regnes for hver testlyd (kort, så det sker i samme tråd) */
{const gl=asAnalyse;window.asAnalyse=async function(b,t){A3H.nu=a3hTil()?a3hpssKick(a3hMono(b),b.sampleRate,Math.max(1,Math.floor((b.length-2048)/1024))):null;try{return await gl(b,t)}finally{A3H.nu=null}}}
/* Rigtige trommer: gemt pr. lydfil, så Mål igen (uden mappen) giver de samme tal */
{const gl=mdbLyd;window.mdbLyd=async function(f,toner){const o=await gl(f,toner);A3H.nu=null;if(!a3hTil())return o;const key='mdb'+MDB.VER+'h|'+f.name+'|'+f.size;let c=await cacheGet(key);
 if(!(c&&c.kick)){if(f.__mdbv)return o;const oc=new OfflineAudioContext(1,1,44100),b=await oc.decodeAudioData(await f.arrayBuffer());c={kick:a3hpssKick(a3hMono(b),b.sampleRate,Math.max(1,Math.floor((b.length-2048)/1024)))};cachePut(key,c)}
 A3H.nu=c.kick;return o}}
{const gl=mdbKoer;window.mdbKoer=async function(){try{return await gl.apply(this,arguments)}finally{A3H.nu=null}}}
{const gl=mdbIgen;window.mdbIgen=async function(){if(a3hTil()&&!MDB.koerer){const x=await mdbFacitHent();if(x){let mangler=0;for(const s of x.stykker)for(const a of [s.mix,s.trom]){if(!a)continue;const c=await cacheGet('mdb'+MDB.VER+'h|'+a.name+'|'+a.size);if(!(c&&c.kick))mangler++}
 if(mangler){const t='Den perkussive del (v9.132) mangler for '+mangler+(mangler===1?' lydfil':' lydfiler')+' i cachen. Vælg facit-mappen én gang; så regnes den og gemmes, og Mål igen virker igen.';msg(t);try{$('status').textContent=t}catch(e){}return null}}}return gl.apply(this,arguments)}}
/* rækkerne i Indstillinger for analysen */
function a3hRaekke(){const k=document.querySelector('#sg [data-sgk="indst"]');if(!k)return;const til=a3hTil(),a3=a3Til(),P=typeof SHOWPROFIL!=='undefined'?SHOWPROFIL:null,S=A3H.sang,har=typeof STEM!=='undefined'&&!!STEM.klar,
 nu=har?'med 4 spor bruges Trommer-sporet':!P?'':S.regner?'den perkussive del regnes …':S.fejl?'hele lyden ('+S.fejl+')':P.halv==='perkussiv'?'den halve takt er afgjort med den perkussive del'+(P.a3skift?' (taktslaget er flyttet)':''):til?'hele lyden (den perkussive del kommer, når sangen er analyseret)':'hele lyden',
 sig=[til,a3,nu].join('|');let g=k.querySelector('[data-a3hr]');
 if(!g||g.dataset.sig!==sig){if(g)g.remove();g=document.createElement('div');g.className='sg-r';g.dataset.a3hr='1';g.dataset.sig=sig;const dis=a3?'':' disabled';
  g.innerHTML='<b>Halv takt uden spor</b><span class="small">Om taktslagene skal flyttes en halv slaglængde (A3), afgøres med kicket fra den perkussive del (fagudtryk: HPSS): bas og akkorder, der varer ved, er trukket fra, så en bas mellem slagene ikke ligner et kick. Selve taktgitteret regnes som før.'+(a3?'':' A3 er slået fra.')+(nu?' <b>Denne sang:</b> '+neHtml(nu)+'.':'')+'</span><span class="sg-styr"><span class="ne-seg sg-seg" role="group"><button class="'+(til?'on':'ghost')+'" data-a3h="1" aria-pressed="'+til+'" title="Standard"'+dis+'>Perkussiv del</button><button class="'+(til?'ghost':'on')+'" data-a3h="0" aria-pressed="'+!til+'"'+dis+'>Hele lyden</button></span></span>';k.appendChild(g)}
 const f=k.querySelector('[data-a3sr]')||k.querySelector('[data-a3r]');if(f&&f.nextElementSibling!==g)f.insertAdjacentElement('afterend',g)}
{const gl=sgIndstTegn;window.sgIndstTegn=function(t){gl(t);try{a3hRaekke()}catch(e){}}}
{const gl=a3Raekke;window.a3Raekke=function(){gl();try{a3hRaekke()}catch(e){}}}
setInterval(()=>{try{if(document.querySelector('#sg [data-a3hr]'))a3hRaekke()}catch(e){}},1500);
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-a3],[data-a3s]'))setTimeout(()=>{try{a3hRaekke()}catch(x){}},0);const b=e.target.closest&&e.target.closest('[data-a3h]');if(!b||b.disabled)return;const til=b.dataset.a3h==='1';
 if(til)delete set.a3perk;else set.a3perk=false;try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}if(RAW){try{applyNorm();buildPeaks();renderTune();showUI()}catch(x){console.error(x)}}['[data-a3r]','[data-a3hr]'].forEach(s=>{const r=document.querySelector('#sg '+s);if(r)r.remove()});try{a3Raekke()}catch(x){}try{asTegn();mxByg()}catch(x){}
 msg('Halv takt uden spor: '+(til?'perkussiv del':'hele lyden')+'. '+(RAW?'Sangen er regnet om. ':'')+'Kør Analyse sikkerhed igen for at se tallene.')});
/* "Sådan måles det" (Testlyd): Breakbeat */
{const gl=asTegn;window.asTegn=function(){gl();try{const d=document.querySelector('#as-rude details.as-hvordan');if(d&&!d.querySelector('[data-a3hb]')){const p=document.createElement('p');p.className='small';p.dataset.a3hb='1';p.innerHTML='<b>Breakbeat</b> rammer ikke taktslagene uden 4 spor: dens kick ligger mest på modslaget (mellem slagene). Det kan være musikken og ikke en fejl i analysen (P8.33).';d.appendChild(p)}}catch(e){}}}
/* ========== SLUT: DEN HALVE TAKT FRA DEN PERKUSSIVE DEL (P8.33 TRIN 2) ========== */
