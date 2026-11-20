/* ========== OPTAG VIDEO ========== */
/* Optager det, udgangsvinduet viser (Live preview, Radial Mesh eller Lyd i 3D), og lyden fra den fælles udgang, som en videofil (webm, eller mp4 hvis browseren kun kan det). Billedet tegnes ind i et skjult lærred i den valgte opløsning (med bevaret billedformat og sorte kanter), og browserens MediaRecorder optager lærredet og lyden. Lyden tappes FØR volumen og mute, så optagelsen ikke afhænger af, hvor højt du lytter. Alt optages i hukommelsen; derfor er der en højeste længde, og når det er slut, vises en dialog med en afspiller og et link til at gemme filen. Intet sendes væk. */
const REC={til:false,mr:null,cv:null,c2:null,dest:null,chunks:[],bytes:0,t0:0,timer:null,url:null,mime:'',W:0,H:0,fps:30,lyd:false,fil:''};
const recStoette=()=>typeof MediaRecorder!=='undefined'&&typeof HTMLCanvasElement!=='undefined'&&typeof HTMLCanvasElement.prototype.captureStream==='function';
function recMime(lyd){const k=lyd?['video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm','video/mp4']:['video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm','video/mp4'];if(typeof MediaRecorder==='undefined'||typeof MediaRecorder.isTypeSupported!=='function')return '';return k.find(m=>{try{return MediaRecorder.isTypeSupported(m)}catch(e){return false}})||''}
function recStr(){const kk=udKilde(),src=kk.cv;if(set.recOpl==='720')return[1280,720];if(set.recOpl==='1080')return[1920,1080];const sw=(src&&src.width)||1280,sh=(src&&src.height)||720,f=Math.min(1,1920/sw);return[Math.max(2,Math.round(sw*f/2)*2),Math.max(2,Math.round(sh*f/2)*2)]}
const recBitrate=(W,H,fps)=>Math.round(Math.max(1.5e6,Math.min(12e6,W*H*fps*.07)));
const recTid=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0'),recMB=b=>(b/1048576).toFixed(1).replace('.',',')+' MB';
function recSync(){if(!$('rec-opl'))return;$('rec-opl').value=set.recOpl;$('rec-fps').value=String(set.recFps);$('rec-lyd').checked=!!set.recLyd;$('rec-maks').value=String(set.recMaks);
 const [W,H]=[set.recOpl==='720'?1280:set.recOpl==='1080'?1920:1280,set.recOpl==='720'?720:set.recOpl==='1080'?1080:720],mb=recBitrate(W,H,set.recFps)/8*60/1048576;
 $('rec-info').textContent='Cirka '+Math.round(mb)+' MB i minuttet ved '+(set.recOpl==='kilde'?'en kilde på 1280 × 720':W+' × '+H)+' og '+set.recFps+' billeder i sekundet; ved den højeste længde ('+set.recMaks+' min) bliver det cirka '+Math.round(mb*set.recMaks)+' MB i hukommelsen. Optager det, udgangsvinduet viser.'+(recStoette()?'':' Din browser kan ikke optage fra et lærred, så Optag virker ikke her.')}
function recUI(){const b=$('rec-btn');if(!b)return;const s=REC.til?(performance.now()-REC.t0)/1000:0;b.setAttribute('aria-pressed',REC.til?'true':'false');b.textContent=REC.til?'Optager '+recTid(s):'Optag: Fra';b.disabled=!recStoette();b.title=recStoette()?(REC.til?'Stop optagelsen (højst '+set.recMaks+' minutter). Videoen vises bagefter, så du kan gemme den.':'Optag det, udgangsvinduet viser, og lyden fra den fælles udgang, som en videofil. Indstillinger: opløsning, billeder i sekundet, lyd og højeste længde.'):'Din browser kan ikke optage fra et lærred (MediaRecorder og captureStream mangler). Prøv Chrome, Edge eller Firefox.'}
function recTegn(){if(!REC.til)return;const g=REC.c2,W=REC.W,H=REC.H;g.fillStyle='#000';g.fillRect(0,0,W,H);if(UD.sort)return;const kk=udKilde(),pv=kk.cv;
 if(!kk.klar||!pv||!pv.width||!pv.height){g.fillStyle='#9fb0c0';g.font=Math.round(H/28)+'px system-ui,sans-serif';g.textAlign='center';g.fillText(kk.tekst||'Kilden er ikke klar',W/2,H/2);return}
 const f=Math.min(W/pv.width,H/pv.height),w=pv.width*f,h=pv.height*f;g.imageSmoothingQuality='high';g.drawImage(pv,(W-w)/2,(H-h)/2,w,h)}
function recOpryd(){clearInterval(REC.timer);REC.timer=null;try{if(REC.dest&&UDG&&UDG.pre)UDG.pre.disconnect(REC.dest)}catch(e){}try{if(REC.dest&&typeof LIN!=='undefined'&&LIN.ut)LIN.ut.disconnect(REC.dest)}catch(e){}try{if(REC.mr&&REC.mr.stream)REC.mr.stream.getTracks().forEach(t=>t.stop())}catch(e){}REC.dest=null;REC.cv=null;REC.c2=null}
function recStart(){if(REC.til)return false;if(!recStoette()){msg('Optag video: din browser kan ikke optage fra et lærred (MediaRecorder og captureStream mangler). Prøv Chrome, Edge eller Firefox.');return false}
 const[W,H]=recStr(),fps=set.recFps;REC.cv=document.createElement('canvas');REC.cv.width=W;REC.cv.height=H;REC.c2=REC.cv.getContext('2d');REC.W=W;REC.H=H;REC.fps=fps;
 let stream;try{stream=REC.cv.captureStream(fps)}catch(e){REC.cv=null;msg('Optag video: browseren kunne ikke starte en optagelse af billedet.');return false}
 REC.lyd=false;REC.dest=null;
 if(set.recLyd){try{const c=actx||(actx=gctx=new (window.AudioContext||window.webkitAudioContext)());if(!UDG||UDG.ctx!==c)udgang(c);if(UDG&&UDG.pre){REC.dest=c.createMediaStreamDestination();UDG.pre.connect(REC.dest);if(typeof LIN!=='undefined'&&LIN.til&&LIN.ut){try{LIN.ut.connect(REC.dest)}catch(e){}}REC.dest.stream.getAudioTracks().forEach(t=>stream.addTrack(t));REC.lyd=true}}catch(e){REC.dest=null;REC.lyd=false}}
 REC.mime=recMime(REC.lyd);const opt={videoBitsPerSecond:recBitrate(W,H,fps)};if(REC.mime)opt.mimeType=REC.mime;if(REC.lyd)opt.audioBitsPerSecond=128000;
 try{REC.mr=new MediaRecorder(stream,opt)}catch(e){recOpryd();msg('Optag video: browseren kunne ikke starte optageren ('+(e&&e.message?e.message:'ukendt fejl')+').');return false}
 REC.chunks=[];REC.bytes=0;REC.mr.ondataavailable=e=>{if(e.data&&e.data.size){REC.chunks.push(e.data);REC.bytes+=e.data.size}};REC.mr.onstop=recFaerdig;
 try{REC.mr.start(1000)}catch(e){recOpryd();msg('Optag video: optageren kunne ikke startes.');return false}
 REC.til=true;REC.t0=performance.now();REC.timer=setInterval(recTik,500);recTegn();recUI();
 msg('Optager '+W+' × '+H+' med '+fps+' billeder i sekundet'+(REC.lyd?' og lyd':(set.recLyd?' (UDEN lyd: lydudgangen kunne ikke tappes)':' uden lyd'))+'. Højst '+set.recMaks+' minutter. Tryk på Optag igen for at stoppe.');return true}
function recTik(){if(!REC.til)return;const s=(performance.now()-REC.t0)/1000;if(s>=set.recMaks*60){recStop('Den højeste længde ('+set.recMaks+' minutter) er nået, så optagelsen er stoppet.');return}recUI()}
function recStop(aarsag){if(!REC.til)return false;REC.til=false;REC.aarsag=aarsag||'';REC.laengde=(performance.now()-REC.t0)/1000;clearInterval(REC.timer);REC.timer=null;try{REC.mr.stop()}catch(e){recFaerdig()}recUI();return true}
function recFaerdig(){const mime=(REC.mr&&REC.mr.mimeType)||REC.mime||'video/webm',laengde=REC.laengde||0,W=REC.W,H=REC.H,lyd=REC.lyd;recOpryd();
 const blob=new Blob(REC.chunks,{type:mime});REC.chunks=[];if(!blob.size){msg('Optagelsen blev tom (der kom ingen billeder). Prøv igen, og lad fanen være synlig, mens du optager.');recUI();return}
 if(REC.url){try{URL.revokeObjectURL(REC.url)}catch(e){}}REC.url=URL.createObjectURL(blob);const ext=/mp4/.test(mime)?'mp4':'webm',n=new Date(),p2=x=>String(x).padStart(2,'0');
 REC.fil='claude-mv-optagelse-'+n.getFullYear()+p2(n.getMonth()+1)+p2(n.getDate())+'-'+p2(n.getHours())+p2(n.getMinutes())+p2(n.getSeconds())+'.'+ext;
 $('rec-video').src=REC.url;$('rec-hent').href=REC.url;$('rec-hent').setAttribute('download',REC.fil);
 $('rec-tekst').textContent='Længde '+recTid(laengde)+', størrelse '+recMB(blob.size)+', '+W+' × '+H+', '+REC.fps+' billeder i sekundet, '+(lyd?'med lyd':'uden lyd')+', format '+ext+'. Filnavn: '+REC.fil+'.'+(REC.aarsag?' '+REC.aarsag:'');
 try{$('recdlg').showModal()}catch(e){}msg('Optagelsen er færdig ('+recTid(laengde)+', '+recMB(blob.size)+'). Gem den fra dialogen.');recUI()}
function recLuk(){const u=REC.url;REC.url=null;try{$('recdlg').close()}catch(e){}try{$('rec-video').pause()}catch(e){}$('rec-video').removeAttribute('src');if(u){try{URL.revokeObjectURL(u)}catch(e){}}}
$('rec-btn').onclick=()=>{if(REC.til)recStop();else recStart()};$('rec-luk').onclick=recLuk;$('recdlg').addEventListener('close',()=>{if(REC.url)recLuk()});
$('rec-opl').onchange=e=>{set.recOpl=e.target.value;applySet()};$('rec-fps').onchange=e=>{set.recFps=+e.target.value;applySet()};$('rec-lyd').onchange=e=>{set.recLyd=e.target.checked;applySet()};$('rec-maks').onchange=e=>{set.recMaks=+e.target.value;applySet()};
addEventListener('beforeunload',e=>{if(REC.til){e.preventDefault();e.returnValue=''}});
recSync();recUI();
/* ========== SLUT: OPTAG VIDEO ========== */

