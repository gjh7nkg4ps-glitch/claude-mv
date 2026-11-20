/* ========== PLAYER: volumen, mute, niveaumåler, spol og tastaturgenveje ========== */
/* Al lyd (nummeret, generatoren og lydlaget) går gennem én fælles udgang: en volumen (kvadratisk, så skyderen føles jævn) og en niveaumåler. Volumen og mute gemmes. */
let UDG=null;const PL={peak:0,clipT:-1e9,drag:false,t:0};
const volGain=()=>{if(set.mute)return 0;const v=+set.vol;return Math.pow(Number.isFinite(v)?Math.max(0,Math.min(1,v)):.8,2)};/* v4.2: en ugyldig lydstyrke gav NaN dB; nu bruges 80 %, hvis værdien ikke er et tal */
function udgang(c){try{if(!UDG||UDG.ctx!==c){const pre=c.createGain(),g=c.createGain(),a=c.createAnalyser();a.fftSize=1024;let eq=[];try{const ei=Rytme.eqIndstilling(set.eq);eq=[ei.bas,ei.mid,ei.diskant].map(d=>{const f=c.createBiquadFilter();f.type=d.type;f.frequency.value=d.f;if(d.q)f.Q.value=d.q;f.gain.value=d.gain;return f})}catch(x){eq=[]}if(eq.length===3){pre.connect(eq[0]);eq[0].connect(eq[1]);eq[1].connect(eq[2]);eq[2].connect(g)}else pre.connect(g);const hp=c.createBiquadFilter(),lp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=10;lp.type='lowpass';lp.frequency.value=c.sampleRate/2-10;/* v6.4: filtre til EQ+ Lyt til ét bånd; helt åbne, når Lyt er slået fra */g.connect(hp);hp.connect(lp);lp.connect(a);a.connect(c.destination);UDG={ctx:c,pre,g,a,eq,hp,lp,buf:new Float32Array(1024)};if(typeof EQP!=='undefined'&&EQP.solo)setTimeout(()=>eqpSolo(EQP.solo),0)}
 const v=volGain();try{UDG.g.gain.setTargetAtTime(v,c.currentTime,.015)}catch(e){UDG.g.gain.value=v}return UDG.pre}catch(e){UDG=null;return c.destination}}
/* ---- EQ (det, du hører) ---- */
function eqSync(){if(!UDG||!UDG.eq)return;const e=Rytme.eqIndstilling(set.eq),c=UDG.ctx,til=[e.bas,e.mid,e.diskant];UDG.eq.forEach((f,i)=>{try{f.gain.setTargetAtTime(til[i].gain,c.currentTime,.02)}catch(x){f.gain.value=til[i].gain}})}
function renMsg(rn){if(rn&&(rn.rettet||rn.fjernet)){$('status').textContent='Nogle figurer var ødelagte og er rettet ('+rn.rettet+' rettelser'+(rn.fjernet?', '+rn.fjernet+' figurer fjernet':'')+').';window.__rens=rn}}
function plVol(v){v=+v;if(!Number.isFinite(v))v=Number.isFinite(+set.vol)?+set.vol:.8;set.vol=Math.max(0,Math.min(1,v));applySet();if(UDG)udgang(UDG.ctx);try{msg('Lydstyrke: '+Math.round(set.vol*100)+' %'+(set.vol<.01?'. Der er ingen lyd nu; pil op skruer op igen.':''))}catch(e){}}
function plMute(){set.mute=!set.mute;applySet();if(UDG)udgang(UDG.ctx);msg(set.mute?'🔇 Lyden er slået fra (tast M eller knappen nederst slår den til igen).':'🔊 Lyden er slået til.')}
function plUI(){const v=$('pl-vol');if(!v)return;if(!Number.isFinite(+set.vol))set.vol=.8;if(+v.value!==Math.round(set.vol*100))v.value=Math.round(set.vol*100);const g=volGain();$('pl-db').textContent=g<=0?'−∞ dB':(20*Math.log10(g)).toFixed(0).replace('-','−')+' dB';$('pl-mute').setAttribute('aria-pressed',set.mute?'true':'false');$('pl-mute').textContent=set.mute?'🔇 Lyd fra':'Lyd';$('pl-mute').classList.toggle('lydfra',!!set.mute);document.body.classList.toggle('lydfra',!!set.mute)}
function plSeek(t){if(!buf)return false;loopCheck(t);const was=playing;stop();offset=Math.max(0,Math.min(dur-.05,t));if(was){resumeTries=0;play()}plSync(true);return true}
function plSync(force){const har=!!buf;['pl-start','pl-back','pl-stop','pl-fwd','pl-pos'].forEach(i=>{const e=$(i);if(e&&e.disabled===har)e.disabled=!har});
 if(har&&!PL.drag){const p=Math.round(Math.min(1,now()/dur)*1000);if(+$('pl-pos').value!==p)$('pl-pos').value=p}if(!har&&+$('pl-pos').value!==0)$('pl-pos').value=0}
$('pl-start').onclick=()=>plSeek(0);$('pl-back').onclick=()=>plSeek(now()-5);$('pl-fwd').onclick=()=>plSeek(now()+5);
$('pl-stop').onclick=()=>{if(!buf)return;stop();offset=0;plSync(true)};
$('pl-mute').onclick=plMute;$('play').addEventListener('click',()=>setTimeout(()=>{if(volGain()<=0)msg(set.mute?'Lyden er slået fra (knappen Lyd i afspilleren). Tryk på den for at høre noget.':'Lydstyrken står på 0. Skru op med skyderen i afspilleren eller med pil op.')},60));$('pl-vol').addEventListener('input',e=>plVol(+e.target.value/100));
$('pl-pos').addEventListener('pointerdown',()=>{PL.drag=true});$('pl-pos').addEventListener('pointerup',()=>{PL.drag=false});$('pl-pos').addEventListener('input',e=>{PL.drag=true;if(buf)$('tid').textContent=fmt(+e.target.value/1000*dur)+' / '+fmt(dur)});$('pl-pos').addEventListener('change',e=>{PL.drag=false;plSeek(+e.target.value/1000*dur)});
document.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT|BUTTON/.test(e.target.tagName||''))return;const k=e.key;
 if(k===' '){e.preventDefault();if(buf)plSkift()}else if(k==='Home'){e.preventDefault();plSeek(0)}else if(k==='ArrowLeft'){e.preventDefault();plSeek(now()-(e.shiftKey?1:5))}else if(k==='ArrowRight'){e.preventDefault();plSeek(now()+(e.shiftKey?1:5))}
 else if(k==='ArrowUp'){e.preventDefault();plVol(set.vol+.05)}else if(k==='ArrowDown'){e.preventDefault();plVol(set.vol-.05)}else if(k==='m'||k==='M'){plMute()}});
function drawMeter(){const c=$('pl-meter');if(!c)return;const nu=performance.now();if(nu-PL.t<33)return;PL.t=nu;const g=c.getContext('2d'),W=c.width,Hh=c.height;g.clearRect(0,0,W,Hh);if(!UDG)return;
 UDG.a.getFloatTimeDomainData(UDG.buf);let pk=0;for(let i=0;i<UDG.buf.length;i++){const v=Math.abs(UDG.buf[i]);if(v>pk)pk=v}if(pk>=.99)PL.clipT=nu;PL.peak=Math.max(PL.peak*.93,pk);
 const db=x=>x<=1e-4?0:Math.max(0,Math.min(1,(20*Math.log10(x)+60)/60)),w=db(pk)*W,hold=db(PL.peak)*W;
 [[0,.7,'#2fb86a'],[.7,.9,'#e5a50a'],[.9,1,'#e04b45']].forEach(([a,b,f])=>{const x0=a*W,x1=Math.min(w,b*W);if(x1>x0){g.fillStyle=f;g.fillRect(x0,0,x1-x0,Hh)}});
 if(hold>1){g.fillStyle='#fff';g.fillRect(Math.min(W-2,hold),0,2,Hh)}if(nu-PL.clipT<1000){g.fillStyle='#e04b45';g.fillRect(W-8,0,8,Hh)}}
plUI();plSync(true);
/* ========== SLUT: PLAYER ========== */

