/* ========== v9.119: TESTLYDEN KAN HØRES OG GEMMES ==========
   Brugerens valg C (20. november): testlyden fandtes kun i hukommelsen, mens testen kørte, og kunne hverken høres eller findes (grundreglen: intet skjult).
   Analyse sikkerhed får afsnittet "Testlyden: lyt og gem" med én række pr. mønster: vælg Hele lyden, Kun trommerne, Kun bassen eller Kun melodien;
   ▶ Lyt spiller præcis den lyd, testen måler på (asRender), direkte i højttaleren (uden EQ); ■ Stop standser den; en sang, der spiller, sættes på pause.
   Gem som WAV giver en fil på 44,1 kHz, mono, 16 bit, regnet med samme afrunding som fingeraftrykket, så filens fingeraftryk er det samme som i rapporten.
   Den gemte fil kan åbnes som en almindelig lydfil i MV. De seneste 6 lyde huskes, så de ikke skal regnes igen. */
const ASL={cache:new Map(),spiller:null,valg:{},travl:false,aaben:false/* v9.121: foldet sammen, til den lille knap trykkes */,V:[['alt','Hele lyden'],['trommer','Kun trommerne'],['bas','Kun bassen'],['lead','Kun melodien']]};
function aslVarianter(M){return M.kun==='trommer'?[['alt','Hele lyden (kun trommer)']]:ASL.V}
async function aslLyd(id,v){const k=id+'/'+v;if(ASL.cache.has(k))return ASL.cache.get(k);const M=AS.M.find(x=>x.id===id);ASL.travl=true;try{const x=await asRender(M,v);ASL.cache.set(k,x);if(ASL.cache.size>6)ASL.cache.delete(ASL.cache.keys().next().value);return x}finally{ASL.travl=false}}
function aslNavn(id,v){const M=AS.M.find(x=>x.id===id),V=M?aslVarianter(M).find(x=>x[0]===v):null;return (M?M.navn:id)+' · '+(V?V[1]:v)}
function aslStop(){const p=ASL.spiller;ASL.spiller=null;if(p){try{p.s.onended=null;p.s.stop()}catch(e){}}}
async function aslLyt(id,v){if(ASL.spiller&&ASL.spiller.id===id){aslStop();asTegn();return}aslStop();try{if(typeof playing!=='undefined'&&playing&&$('pause'))$('pause').click()}catch(e){}
 msg('Laver testlyden: '+aslNavn(id,v)+' …');const x=await aslLyd(id,v);actx=actx||new (window.AudioContext||window.webkitAudioContext)();try{await actx.resume()}catch(e){}
 const s=actx.createBufferSource(),g=actx.createGain();g.gain.value=.9;s.buffer=x.b;s.connect(g);g.connect(actx.destination);s.onended=()=>{if(ASL.spiller&&ASL.spiller.s===s){ASL.spiller=null;asTegn()}};s.start();
 ASL.spiller={id,v,s,dur:x.b.duration};asTegn();msg('Spiller testlyden: '+aslNavn(id,v)+' ('+Math.round(x.b.duration)+' s). Det er præcis den lyd, testen måler på.')}
function aslWav(b){const d=b.getChannelData(0),n=d.length,sr0=b.sampleRate,buf=new ArrayBuffer(44+n*2),v=new DataView(buf),w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i))};
 w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr0,true);v.setUint32(28,sr0*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);
 for(let i=0;i<n;i++)v.setInt16(44+i*2,Math.max(-32768,Math.min(32767,Math.round(d[i]*32767))),true);return new Blob([buf],{type:'audio/wav'})}
async function aslGem(id,v){msg('Laver testlyden: '+aslNavn(id,v)+' …');const x=await aslLyd(id,v),bl=aslWav(x.b),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download='testlyd_'+id+'_'+(v==='alt'?'hele-lyden':v==='trommer'?'kun-trommer':v==='bas'?'kun-bassen':'kun-melodien')+'.wav';document.body.appendChild(a);a.click();
 setTimeout(()=>{try{URL.revokeObjectURL(a.href);a.remove()}catch(e){}},4000);msg('Gemt: '+a.download+' ('+(bl.size/1048576).toFixed(1).replace('.',',')+' MB, fingeraftryk '+x.S.fp+'). Den kan åbnes som en almindelig lydfil i MV.')}
function aslHtml(){const h=neHtml;let t='<div id="as-lyd" class="as-lyd"><h4 class="as-h">Testlyden: lyt og gem</h4><p class="small">Testlyden regnes af programmet, når du trykker ▶ Kør testen, og gemmes ikke. Her kan du høre hvert mønster eller gemme det som en WAV-fil (44,1 kHz, mono, 16 bit), som kan åbnes som en almindelig lydfil i MV. Det er præcis den lyd, testen måler på.</p><table class="as-tab as-lyd-tab"><tbody>';
 AS.M.forEach(M=>{const V=aslVarianter(M),sel=ASL.valg[M.id]&&V.some(x=>x[0]===ASL.valg[M.id])?ASL.valg[M.id]:'alt',sp=!!(ASL.spiller&&ASL.spiller.id===M.id);
  t+='<tr data-asl="'+h(M.id)+'"><td class="as-nv">'+h(M.navn)+'</td><td><select data-aslv="'+h(M.id)+'" aria-label="'+h('Hvilken del af '+M.navn)+'">'+V.map(([v,n])=>'<option value="'+v+'"'+(v===sel?' selected':'')+'>'+h(n)+'</option>').join('')+'</select></td><td class="as-lyd-k"><button class="'+(sp?'on':'ghost')+'" data-aslx="lyt" data-id="'+h(M.id)+'" aria-pressed="'+sp+'">'+(sp?'■ Stop':'▶ Lyt')+'</button> <button class="ghost" data-aslx="gem" data-id="'+h(M.id)+'" title="Gem lyden som en WAV-fil">Gem som WAV</button></td></tr>'});
 return t+'</tbody></table></div>'}
function aslKnap(p){const r=p.querySelector('[data-asx="rapport"]');if(!r||p.querySelector('[data-aslx="vis"]'))return;const b=document.createElement('button');b.className='ghost as-lille'+(ASL.aaben?' on':'');b.dataset.aslx='vis';b.setAttribute('aria-expanded',ASL.aaben);b.title='Lyt til testlyden eller gem den som WAV (bruges sjældent)';b.textContent='Testlyden '+(ASL.aaben?'▾':'▸');r.insertAdjacentElement('afterend',b);r.insertAdjacentText('afterend',' ')}
function aslTegn(){const p=asRude();if(!p||p.hidden)return;const gl=p.querySelector('#as-lyd');if(gl)gl.remove();aslKnap(p);if(!ASL.aaben)return;/* v9.121: kun når den lille knap er trykket */const d=document.createElement('div');d.innerHTML=aslHtml();const el=d.firstChild,f=p.querySelector('#as-mdb')||[...p.querySelectorAll('h4.as-h')].find(x=>/Tidligere/.test(x.textContent));if(f)p.insertBefore(el,f);else p.appendChild(el)}
{const gl=asTegn;asTegn=function(){gl();try{aslTegn()}catch(e){console.error(e)}}}
function aslByg(){const p=asRude();if(!p||p.dataset.asl)return;p.dataset.asl='1';
 p.addEventListener('click',e=>{const b=e.target.closest('[data-aslx]');if(!b)return;e.stopPropagation();if(b.dataset.aslx==='vis'){ASL.aaben=!ASL.aaben;if(!ASL.aaben)aslStop();asTegn();return}const id=b.dataset.id,v=ASL.valg[id]||'alt';if(b.dataset.aslx==='lyt')aslLyt(id,v);else aslGem(id,v)},true);
 p.addEventListener('change',e=>{const s=e.target.closest('[data-aslv]');if(!s)return;ASL.valg[s.dataset.aslv]=s.value;if(ASL.spiller&&ASL.spiller.id===s.dataset.aslv){aslStop();asTegn()}},true)}
try{aslByg()}catch(e){console.error(e)}
/* ========== SLUT: TESTLYDEN KAN HØRES OG GEMMES ========== */


/* ---------- Preview: 3 spor med klodser ---------- */
const env=[],pe=[],lastSp=KD.lastSp,SCN=Rytme.nyScene(),parts=SCN.parts,blocks=SCN.blocks,flash=SCN.flash;let last=performance.now();
function frame(t){requestAnimationFrame(frame);if(!BENCH.aktiv&&t-lastDraw<1000/set.fps-2)return;lastDraw=t;try{frameBody(t)}catch(err){console.error(err);const gg=$('pv').getContext('2d');gg.setTransform(1,0,0,1,0,0);gg.shadowBlur=0;gg.setLineDash([]);gg.globalAlpha=1;$('status').textContent='Preview-fejl: '+(err&&err.message||err)}}
function frameBody(t){
 const rawDt=t-last,dt=Math.min(.05,rawDt/1000);last=t;if(BENCH.aktiv){benchFrame(t);return}
 if(rawDt>0&&rawDt<250){METER.t.push(rawDt);if(METER.t.length>120)METER.t.shift()}{const tr=REG.trin;Rytme.regTik(REG,rawDt,1000/set.fps,set.kval.regulator);if(REG.trin!==tr)kvalAendret()}
live=linNu();if(live)liveCalc();taktTik(live,performance.now()/1000);if(live&&anaBehov())liveAna();const tt=now(),E={},tsrc=timingSrc();EFFECTS.forEach(([k])=>E[k]=0);
 const bandNu=k=>kildeV(k,tt);
 let toner=[];if(live)toner=LANA.ev.splice(0);else if(TONER.length&&(playing||offset>0)){while(TP>0&&TONER[TP-1].t>tt)TP--;while(TP<TONER.length&&TONER[TP].t<=tt){if(tt-TONER[TP].t<.3)toner.push(TONER[TP]);TP++}}
if(t-(window.__rydT||0)>30000){window.__rydT=t;Rytme.rydTilstand(t/1000,120)} Rytme.koer(maps,{thrFn:set.tilpas?tilpasThr:null,vaegt:(m,i)=>((SHOW&&SHOW.til&&m.rolle&&!live&&(playing||offset>0))?Rytme.showVaegt(SHOW,m.rolle,tt):1)*(typeof neFigF==='function'?neFigF(m.effect):1),v:(m,i)=>(typeof neTrimV==='function'?neTrimV(m.band,bandNu(m.band)):bandNu(m.band)),off:(m,i)=>m.off||(typeof neLtFraF==='function'&&neLtFraF(m))||(typeof neFraF==='function'&&neFraF(m))||(soloOn&&i!==meshSel),master:gmaster,dt,env,pe,E,holdRyd:HOLDRYD,
  kant:(m,i,cur,kantNu)=>{if(!kantNu)return;const frem=tsrc==='fil'||(tsrc==='gen'&&GEN_BAND[m.band]);
   if(m.effect.startsWith('klods')&&!frem)Rytme.klodsLive(KD,blocks,m,i,t,scene.spor);
   if(m.effect.startsWith('lyd:')&&t-(lastSp[i]||0)>(m.gap??120)&&!frem){lastSp[i]=t;lydLive(m.effect.slice(4))}}});
 HOLDRYD=false;lastE=E;klodsFremad(tsrc);
 const c=$('pv'),g=c.getContext('2d'),W=c.width,Hh=c.height;
 Rytme.tegnScene(g,W,Hh,{E:blinkE(E),t,dt,scene,pos,objekter:fase2.objekter,kilde:bandNu,toner,livEv:livEvNu(),figVaegt:figVaegtNu(tt),paletGrader:paletNu(tt),kval:kvalNu(),slange:maps.some(m=>m.effect==='slange'||m.effect==='slange_farve'),ur:b=>b.src==='fil'?now():gctx.currentTime,T:SCN});blinkMaal(t);
 if(set.kval.maaler)tegnMaaler(g,W,Hh);
 if(maerkOn||soloOn)tegnMaerker(g,W,Hh,E,t);if(!moveMode)try{fg74Tegn(g,W,Hh)}catch(x){}try{pvNavneTegn(g,W,Hh)}catch(x){}/* v9.100 */if(moveMode){g.font='12px Schibsted Grotesk,sans-serif';HANDLES.forEach(([k,n])=>{const hq=hp(k),x=hq.x*W,y=hq.y*Hh;g.strokeStyle='#fff';g.fillStyle='rgba(10,125,107,.55)';g.lineWidth=2;g.setLineDash([4,3]);g.beginPath();g.arc(x,y,16,0,7);g.fill();g.stroke();g.setLineDash([]);g.fillStyle='#fff';g.fillText(n,x+20,y+4)})}
 [drawTL,lotTegn,nivTik,steTik,stemTik,drawEQ,drawMesh,drawXY,drawForm,stepHL,watchPlay,kvalMaalOpdat,drawAna,miniSync,topSync,nrkTegn,feHistTik,feLiveTik,drawEQP,m3Tik,ojTik,drawMeter,()=>plSync(false),knapTilstand,udgangTegn,tlFoelg,recTegn].forEach(fn=>{try{fn()}catch(x){console.error(x)}})}

genUI();drawGrid();slotUI();renderMaps();save();abStatus();requestAnimationFrame(frame);
