/* ========== FASE 2: AFSPILNING (robusthed og synlighed) ========== */
/* Problemet: hvis browseren afbryder lyden midt i et nummer, fortsatte playheaden uden lyd, og programmet sagde intet. Nu opdages det, der skrives en forklaring, og afspilningen fortsætter automatisk (højst to gange). */
const fmt=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
let resumeTries=0,lastClock=0,lastClockT=0,lastMsg=-1e9,lastTid=0;
function play(){if(!buf)return;actx.resume();src=actx.createBufferSource();src.buffer=buf;src.connect(udgang(actx));
 if(offset>=dur-.05)offset=0;if(LOOP.til&&LOOP.b>LOOP.a){if(offset<LOOP.a||offset>=LOOP.b)offset=LOOP.a;src.loop=true;src.loopStart=LOOP.a;src.loopEnd=LOOP.b}src.start(0,offset);startAt=actx.currentTime;playing=true;lastClock=actx.currentTime;lastClockT=performance.now();plKnapper();
 src.onended=ended}
function ended(){if(!playing)return;const t=now();playing=false;plKnapper();
 if(t>=dur-.15){offset=0;if(set.gentag){$('status').textContent='Numret gentages';play();return}$('status').textContent='Numret er færdigt';return}
 offset=t;if(resumeTries<2){resumeTries++;$('status').textContent='Lyden stoppede uventet ved '+fmt(t)+' og fortsatte automatisk';play()}
 else $('status').textContent='Lyden stoppede uventet ved '+fmt(t)+' af '+fmt(dur)+'. Tryk Afspil for at fortsætte derfra.'}
function stop(){if(src){src.onended=null;try{src.stop()}catch(e){}}if(playing)offset=now();playing=false;plKnapper()}
/* v4.3: to knapper i stedet for én, der skifter: Afspil starter (og gør ingenting, hvis der allerede spilles), Pause stopper og husker stedet. Afspil er markeret, mens der spilles, og Pause kan kun trykkes, mens der spilles. Mellemrumstasten og miniknappen i W1 skifter stadig. */
function plKnapper(){const a=$('play'),p=$('pause');if(a)a.setAttribute('aria-pressed',playing?'true':'false');if(p)p.disabled=!playing}
function plSkift(){if(playing)$('pause').click();else $('play').click()}
$('play').onclick=()=>{if(playing){msg('Der spilles allerede. Tryk Pause for at stoppe.');return}resumeTries=0;play();plKnapper()};
$('pause').onclick=()=>{if(!playing)return;stop();plKnapper();msg('Pause ved '+fmt(now())+'. Tryk Afspil for at fortsætte derfra.')};
function watchPlay(){const tp=performance.now();
 if(playing){const c=actx.currentTime;
  if(c!==lastClock){lastClock=c;lastClockT=tp}
  else if(tp-lastClockT>700&&tp-lastMsg>2000){lastMsg=tp;$('status').textContent='Browseren har sat lyden på pause ('+actx.state+'). Prøver at genoptage …';actx.resume()}
  if(!(LOOP.til&&LOOP.b>LOOP.a)&&offset+c-startAt>=dur+.4){stop();offset=0;if(set.gentag){$('status').textContent='Numret gentages';play()}else $('status').textContent='Numret er færdigt'}}
 if(tp-lastTid>200){lastTid=tp;stimOpdat();$('tid').textContent=buf?fmt(now())+' / '+fmt(dur)+(playing&&actx.state!=='running'?' (pause: '+actx.state+')':''):''}}
/* ========== SLUT: AFSPILNING ========== */
$('tl').onclick=e=>{if(TLS.traek){TLS.traek=false;return}if(!buf)return;const r=e.target.getBoundingClientRect();tlSpring(tlTrel((e.clientX-r.left)/r.width))};
const sample=(k,t)=>{const a=F[k];return a[Math.max(0,Math.min(a.length-1,Math.floor(t*sr/H)))]};

/* ---------- Tidslinje (live) ---------- */
const css=n=>getComputedStyle(document.documentElement).getPropertyValue(n).trim();
function buildPeaks(){peaks={};const W=1000;for(const[k]of BANDS){const a=F[k],p=new Float32Array(W);for(let x=0;x<W;x++){const i0=Math.floor(x/W*a.length),i1=Math.max(i0+1,Math.floor((x+1)/W*a.length));let m=0;for(let i=i0;i<i1;i++)if(a[i]>m)m=a[i];p[x]=m}peaks[k]=p}tlFit()}
const HUE=i=>i*26,LANE=[340,150,45],effName=k=>(EFFECTS.find(e=>e[0]===k)||[0,k])[1];
const REF={bas:1.6,mid:1.4,hmid:1.2,brill:1,rms:.3,centroid:6000,flux:60,rolloff:12000,flat:1,zcr:.3,kick:.4,snare:.4,hihat:.3,vokal:1.2};
let mode='auto',marks={kick:[],snare:[]};
