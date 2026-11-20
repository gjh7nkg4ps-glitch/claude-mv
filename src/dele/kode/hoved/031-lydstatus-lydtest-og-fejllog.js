/* ========== LYDSTATUS, LYDTEST OG FEJLLOG ========== */
/* Fandt: programmet starter lyden først, når man trykker på noget, og der var ingen global fejlfanger, så en fejl i en browser var helt tavs. Lydstatus siger, om lyden er startet, kører eller venter (browserens regel om et klik først), samt programmets egen lydstyrke og lydløs (set.vol og set.mute, som styrer ALLE kilder via udgang()). Test lyden spiller en tone på 440 Hz gennem samme udgang som al anden lyd; hører man den ikke, ligger problemet uden for en enkelt kilde. Fejllogen gemmer de seneste 20 fejl (error og unhandledrejection) og kan kopieres. */
const FEJLLOG=[];
function fejlTekst(){return FEJLLOG.map(f=>f.t+'  '+f.kilde+': '+f.txt).join('\n')||'Ingen fejl.'}
function fejlUI(){const p=$('fejl-log'),n=$('fejl-antal');if(n)n.textContent=FEJLLOG.length;if(p)p.textContent=fejlTekst()}
function fejlLog(txt,kilde){FEJLLOG.push({t:new Date().toLocaleTimeString('da-DK'),kilde:kilde||'fejl',txt:String(txt==null?'ukendt':txt).slice(0,240)});while(FEJLLOG.length>20)FEJLLOG.shift();fejlUI()}
addEventListener('error',e=>{fejlLog((e.message||'ukendt fejl')+(e.lineno?' (linje '+e.lineno+')':''),'fejl');try{$('status').textContent='Fejl i programmet: '+String(e.message||'').slice(0,100)+'. Se Indstillinger, Lyd og fejl.'}catch(_){}});
addEventListener('unhandledrejection',e=>{const r=e.reason;fejlLog(r&&r.message?r.message:r,'løfte')});
function lydStatus(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return{tilstand:'ingen',tekst:'Din browser har ikke Web Audio, så programmet kan ikke spille lyd.'};
 const udg='Lydstyrke '+Math.round((set.vol==null?1:set.vol)*100)+' procent'+(set.mute?', LYDLØS (slå lyden til med lydløs-knappen i afspilleren)':'')+'.';
 if(!actx)return{tilstand:'ikke startet',tekst:'Lyden er ikke startet endnu; browseren starter den først, når du trykker på noget (afspil, en tangent eller Test lyden). '+udg};
 const s=actx.state;return{tilstand:s,tekst:s==='running'?'Lyden kører ('+Math.round(actx.sampleRate)+' Hz'+(actx.baseLatency?', forsinkelse '+Math.round(actx.baseLatency*1000)+' ms':'')+'). '+udg:s==='suspended'?'Lyden venter: browseren har sat den på pause, til du trykker på siden. Tryk på Test lyden. '+udg:'Lyden er '+(s==='closed'?'lukket; genindlæs siden':s)+'. '+udg}}
function lydStatusUI(){const e=$('lyd-status');if(e)e.textContent=lydStatus().tekst}
function lydTest(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC){lydStatusUI();msg(lydStatus().tekst);return}
 try{actx=gctx=actx||gctx||new AC();Promise.resolve(actx.resume()).catch(e=>fejlLog(e&&e.message||e,'lyd')).then(lydStatusUI);
  const c=actx,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.value=440;g.gain.setValueAtTime(0,c.currentTime);g.gain.linearRampToValueAtTime(.25,c.currentTime+.03);g.gain.linearRampToValueAtTime(0,c.currentTime+.6);o.connect(g);g.connect(udgang(c));o.start();o.stop(c.currentTime+.65);
  msg('Test lyden: en tone på 440 Hz spilles nu gennem programmets udgang. Hørte du den? Ellers: er fanen sat til lydløs (højttalerikonet på fanen), computerens lydstyrke, og programmets egen lydstyrke og lydløs-knap. '+lydStatus().tekst)}
 catch(e){fejlLog(e&&e.message||e,'lyd');msg('Test lyden mislykkedes: '+(e&&e.message||e))}lydStatusUI()}
$('lyd-test').onclick=lydTest;
$('fejl-kopi').onclick=()=>{try{navigator.clipboard.writeText(fejlTekst()).then(()=>msg('Fejllogen er kopieret.'),()=>msg('Kunne ikke kopiere; markér teksten i fejllogen i stedet.'))}catch(e){msg('Kunne ikke kopiere; markér teksten i fejllogen i stedet.')}};
setInterval(lydStatusUI,1000);lydStatusUI();fejlUI();
/* ========== SLUT: LYDSTATUS, LYDTEST OG FEJLLOG ========== */

