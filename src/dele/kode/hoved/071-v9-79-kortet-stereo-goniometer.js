/* ========== v9.79: KORTET STEREO (goniometer) ==========
   Planen docs/PLAN-SANG-OG-ANALYSE.md, trin S5: kortet Stereo under Sang → Avanceret. Goniometeret tegnes hvert billede fra de to
   AnalyserNodes i ne3Tap (venstre og højre, tidsdomæne, 1024 prøver): x = (V − H)/√2, y = (V + H)/√2, med et svagt spor fra de forrige billeder.
   De tre tal er analysens egne rækker (ana:bredde, ana:pan, ana:fase via kildeV ved now()), ikke en ny beregning (planens regel 1).
   Brug i en regel: rækken lægges i matrixens ekstra rækker (set.ne.mxE.b) og 3 · Regler åbnes med matrixen (sgBrugIRegel). */
var STE={tb:null,sidst:0};
const STE_TAL=[['ana:bredde','Stereobredde','0 ens i begge sider eller kun i én · 1 helt forskellige sider'],['ana:pan','Panorering','0 venstre · 0,5 midte · 1 højre'],['ana:fase','Faselighed','1 ens fase · 0,5 ukorreleret · 0 modfase']];
function steByg(){if(typeof STE==='undefined'||!STE)return;const k=document.querySelector('#sg [data-sgk="ste"]');if(!k||k.dataset.klar)return;k.dataset.klar='1';
 k.innerHTML='<div class="ste-gon"><canvas id="ste-gon" width="160" height="160" aria-label="Goniometer: lyden lige nu som punkter" role="img"></canvas><span class="small">mono ↑ · bred ↔</span></div><div class="ste-tal">'+STE_TAL.map(([key,n,f])=>'<div class="ste-r" data-ste="'+key+'"><b>'+n+'</b><i class="niv-bar"><u></u></i><em>–</em><span class="small">'+f+'</span><button class="ghost" data-sgregel="'+key+'" title="Læg '+n+' som række i matrixen og åbn 3 · Regler">Brug i en regel</button></div>').join('')+'<div class="ab"><button class="ghost" data-stelot="1" title="Slå rækken Stereo til i Lyd over tid (bredde og faselighed som kurver for hele sangen)">Vis over tid</button></div></div>';
 k.addEventListener('click',e=>{const b=e.target.closest('[data-sgregel]');if(b){sgBrugIRegel(b.dataset.sgregel);return}if(e.target.closest('[data-stelot]')){const L=lotIndst();L.rk.stereo=true;lotGem();lotHoved();lotHoejde();const c=$('lot');if(c)c.scrollIntoView({block:'start',behavior:'smooth'})}})}
function sgBrugIRegel(k){const I=mxInd();if(!I.mxE.b.includes(k))I.mxE.b.push(k);try{mxGem()}catch(e){}try{lay3Anvend('ao-regler')}catch(e){}try{dkVis('w33',true)}catch(e){}try{mxSaet(true,true)}catch(e){}
 setTimeout(()=>{try{mxEfterAlle('Rækken '+neLtNavn(k)+' står i matrixen: klik i en tom celle for at lave en regel.')}catch(e){}},350)}
function steTik(){const k=document.querySelector('#sg [data-sgk="ste"]');if(!k||k.offsetParent===null)return;const nu=performance.now();if(nu-STE.sidst<40)return;STE.sidst=nu;
 const spil=(typeof playing!=='undefined'&&playing)||(typeof live!=='undefined'&&live);const t=typeof now==='function'?now():0;
 STE_TAL.forEach(([key])=>{const r=k.querySelector('[data-ste="'+key+'"]');if(!r)return;let v=0,har=false;try{if(!live&&A&&A[key]){v=sampleA(key,t);har=true}else if(live){v=kildeV(key,t);har=true}}catch(e){}const u=r.querySelector('u'),em=r.querySelector('em');const w=(Math.max(0,Math.min(1,v))*100).toFixed(1)+'%';if(u&&u.style.width!==w)u.style.width=w;const tx=har?String(Math.round(v*100)/100).replace('.',','):'–';if(em&&em.textContent!==tx)em.textContent=tx});
 const c=$('ste-gon');if(!c)return;const g=c.getContext('2d'),W=c.width,H=c.height;g.fillStyle='rgba(7,3,3,.35)';g.fillRect(0,0,W,H);
 g.strokeStyle='rgba(255,138,0,.25)';g.lineWidth=1;g.beginPath();g.moveTo(W/2,0);g.lineTo(W/2,H);g.moveTo(0,H/2);g.lineTo(W,H/2);g.moveTo(0,0);g.lineTo(W,H);g.moveTo(W,0);g.lineTo(0,H);g.stroke();
 let tap=null;try{tap=spil?ne3Tap():null}catch(e){}if(!tap||!tap.L){return}
 const n=1024,bl=STE.bL||(STE.bL=new Float32Array(n)),br=STE.bR||(STE.bR=new Float32Array(n));try{tap.L.getFloatTimeDomainData(bl);if(tap.R)tap.R.getFloatTimeDomainData(br);else br.set(bl)}catch(e){return}
 g.fillStyle='rgba(255,176,0,.55)';const s=W/2*.9,r2=Math.SQRT1_2;for(let i=0;i<n;i+=2){const l=bl[i],rr=br[i],x=(l-rr)*r2,y=(l+rr)*r2;g.fillRect(W/2+x*s,H/2-y*s,1.5,1.5)}}
try{steByg()}catch(e){console.error(e)}
/* ========== SLUT: KORTET STEREO ========== */

