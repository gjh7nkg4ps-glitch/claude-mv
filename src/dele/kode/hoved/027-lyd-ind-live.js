/* ========== LYD IND (live) ========== */
/* Lyd fra en mikrofon, en linjeindgang eller et andet faneblad føres ind i de samme to analysatorer (gan og gan2), som generatoren bruger, så billedet reagerer på lyden i rummet. Lyden sendes IKKE ud i højttalerne (ellers opstår der tilbagekobling). Ekkodæmpning, støjdæmpning og automatisk forstærkning slås fra, for de ødelægger musikken. Niveauet kan justeres (0,2 til 3 gange), og en måler viser det. Starter man en fil, slukkes Lyd ind. Kun i optagelsen kan lyden høres (den føres til optagelsen, ikke til højttalerne). */
const LIN={til:false,starter:false,stream:null,kilde:null,ut:null,an:null,buf:null,timer:null,niveau:0,mode:''};
function linStoette(){return typeof navigator!=='undefined'&&!!navigator.mediaDevices&&typeof navigator.mediaDevices.getUserMedia==='function'}
function linNu(){return !playing&&!!gan&&(gPlaying||LIN.til||(lastKeyT>0&&performance.now()-lastKeyT<4000))}
function linFejlTekst(e){const n=e&&e.name;if(n==='NotAllowedError'||n==='SecurityError')return'Adgangen til lyd blev afvist eller er ikke tilladt her. Giv tilladelse i browseren. Ser du programmet som en udgivet side, så åbn filen på din computer.';
 if(n==='NotFoundError'||n==='DevicesNotFoundError')return'Ingen lydindgang blev fundet. Tilslut en mikrofon eller et lydkort.';if(n==='NotReadableError'||n==='TrackStartError')return'Lydindgangen bruges af et andet program. Luk det, og prøv igen.';
 if(n==='OverconstrainedError')return'Den valgte enhed findes ikke mere. Vælg Standardenhed under Lyd ind, og prøv igen.';if(n==='NotSupportedError'||n==='AbortError')return'Din browser kan ikke dele lyd på denne måde.';return'Lyd ind kunne ikke startes ('+(n||'ukendt fejl')+').'}
function linSync(){if(!$('lin-kilde'))return;$('lin-kilde').value=set.linKilde;$('lin-niveau').value=String(Math.round(set.linNiveau*100));$('lin-n-tal').textContent=Math.round(set.linNiveau*100)+' %';
 const o=[...$('lin-enhed').options].some(x=>x.value===set.linEnhed);if(o)$('lin-enhed').value=set.linEnhed;
 $('lin-info').textContent=linStoette()?'Lyden går ind i analysen, men afspilles ikke i højttalerne. Mikrofon eller linje: brug et headset eller et lydkort, hvis rummet er stort. Fanelyd: du vælger et faneblad og sætter flueben ved at dele fanebladets lyd.':'Din browser kan ikke tage lyd ind (mediaDevices mangler), så Lyd ind virker ikke her.'}
function linUI(){const b=$('lin-btn');if(!b)return;b.setAttribute('aria-pressed',LIN.til?'true':'false');b.textContent=LIN.til?'Lyd ind: '+(LIN.mode==='fane'?'Fanelyd':'Mikrofon'):'Lyd ind: Fra';b.disabled=!linStoette();
 b.title=linStoette()?(LIN.til?'Sluk Lyd ind. Lyden fra rummet (eller fanebladet) styrer ikke længere billedet.':'Tag lyd ind fra en mikrofon, en linjeindgang eller et andet faneblad, så billedet reagerer på lyden live. Indstillinger står under Indstillinger.'):'Din browser kan ikke tage lyd ind (mediaDevices mangler).'}
function linEnheder(){if(!linStoette()||typeof navigator.mediaDevices.enumerateDevices!=='function')return Promise.resolve();return navigator.mediaDevices.enumerateDevices().then(l=>{const s=$('lin-enhed');if(!s)return;const v=set.linEnhed;let h='<option value="">Standardenhed</option>';let n=0;l.filter(x=>x.kind==='audioinput'&&x.deviceId).forEach(x=>{n++;h+='<option value="'+x.deviceId.replace(/[&<>"]/g,'')+'">'+String(x.label||'Lydindgang '+n).replace(/[&<>"]/g,'')+'</option>'});s.innerHTML=h;if([...s.options].some(o=>o.value===v))s.value=v}).catch(()=>{})}
function linTik(){if(!LIN.til||!LIN.an)return;LIN.an.getFloatTimeDomainData(LIN.buf);let p=0;for(let i=0;i<LIN.buf.length;i++)p=Math.max(p,Math.abs(LIN.buf[i]));LIN.niveau=p;const m=$('lin-maaler');if(m){m.firstElementChild.style.width=Math.min(100,Math.round(p*140))+'%';m.classList.toggle('klip',p>.95)}}
async function linStart(){if(LIN.til||LIN.starter)return false;if(!linStoette()){msg('Lyd ind: din browser kan ikke tage lyd ind (mediaDevices mangler).');return false}
 LIN.starter=true;let st;
 try{const dsp={echoCancellation:false,noiseSuppression:false,autoGainControl:false};
  if(set.linKilde==='fane'){if(typeof navigator.mediaDevices.getDisplayMedia!=='function'){msg('Lyd ind: din browser kan ikke dele fanelyd.');return false}
   st=await navigator.mediaDevices.getDisplayMedia({video:true,audio:dsp});if(!st.getAudioTracks().length){st.getTracks().forEach(t=>t.stop());msg('Ingen lyd blev delt. Vælg et faneblad, og sæt flueben ved at dele fanebladets lyd.');return false}}
  else{const a={...dsp};if(set.linEnhed)a.deviceId={exact:set.linEnhed};st=await navigator.mediaDevices.getUserMedia({audio:a})}}
 catch(e){msg(linFejlTekst(e));return false}finally{LIN.starter=false}
 if(playing)stop();ge();
 LIN.stream=st;LIN.mode=set.linKilde;LIN.kilde=gctx.createMediaStreamSource(st);LIN.ut=gctx.createGain();LIN.ut.gain.value=set.linNiveau;LIN.an=gctx.createAnalyser();LIN.an.fftSize=512;LIN.buf=new Float32Array(512);
 LIN.kilde.connect(LIN.ut);LIN.ut.connect(gan);LIN.ut.connect(gan2);LIN.ut.connect(LIN.an);
 if(REC.til&&REC.dest){try{LIN.ut.connect(REC.dest)}catch(e){}}
 st.getTracks().forEach(t=>{t.onended=()=>{if(LIN.til&&LIN.stream===st)linStop('Lyd ind blev afbrudt (enheden blev fjernet, eller delingen blev stoppet).')}});
 LIN.til=true;clearInterval(LIN.timer);LIN.timer=setInterval(linTik,120);linUI();linEnheder();
 msg('Lyd ind er tændt ('+(LIN.mode==='fane'?'fanelyd':'mikrofon eller linje')+'). Billedet reagerer nu på lyden. Den spilles ikke i højttalerne.');return true}
function linStop(aarsag){if(!LIN.til)return false;LIN.til=false;clearInterval(LIN.timer);LIN.timer=null;
 try{if(LIN.ut&&REC.dest)LIN.ut.disconnect(REC.dest)}catch(e){}
 [LIN.kilde,LIN.ut].forEach(n=>{try{if(n)n.disconnect()}catch(e){}});try{if(LIN.stream)LIN.stream.getTracks().forEach(t=>{t.onended=null;t.stop()})}catch(e){}
 LIN.stream=null;LIN.kilde=null;LIN.ut=null;LIN.an=null;LIN.niveau=0;LIN.mode='';const m=$('lin-maaler');if(m){m.firstElementChild.style.width='0%';m.classList.remove('klip')}
 linUI();msg(aarsag||'Lyd ind er slukket.');return true}
$('lin-btn').onclick=()=>{if(LIN.til)linStop();else linStart()};
$('lin-kilde').onchange=e=>{set.linKilde=e.target.value;applySet();msg(LIN.til?'Kilden ændres næste gang, du tænder Lyd ind.':'Lyd ind: kilden er nu '+(set.linKilde==='fane'?'fanelyd':'mikrofon eller linje')+'.')};
$('lin-enhed').onchange=e=>{set.linEnhed=e.target.value;applySet();msg(LIN.til?'Enheden ændres næste gang, du tænder Lyd ind.':'Lyd ind: enheden er valgt.')};
$('lin-niveau').oninput=e=>{set.linNiveau=Math.max(.2,Math.min(3,(+e.target.value)/100));applySet();if(LIN.til&&LIN.ut)LIN.ut.gain.value=set.linNiveau};
{const _pl=play;play=function(){if(LIN.til)linStop('Lyd ind er slukket, fordi en fil afspilles.');return _pl.apply(this,arguments)}}
try{if(linStoette()&&navigator.mediaDevices.addEventListener)navigator.mediaDevices.addEventListener('devicechange',()=>{linEnheder()})}catch(e){}
linSync();linUI();
/* ========== SLUT: LYD IND ========== */

