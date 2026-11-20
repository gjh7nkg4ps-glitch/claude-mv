
/* ========== v9.124: TAKTGITTER FRA TROMMER-SPORET (A3, TREDJE DEL) ==========
   Hovedchattens forslag (P8.30 b): med 4 spor kommer sangens taktgitter fra Trommer-sporet (ét fælles taktgitter til hele showet).
   - Når 4 spor er analyseret (STEM.klar, og Trommer-sporet har lige så mange rammer som den samlede lyd), regnes anslagsstyrken, tempoet, taktslagene og den halve
     takt (A3) ud fra Trommer-sporets kick, snare, hihat og flux. Takt 1 findes med Trommer-sporets kick og snare og den samlede lyds toner og klang (akkordskiftene).
     Alt andet (afsnit, toneart, lydtrækkene) kommer stadig fra den samlede lyd. Uden spor er alt som i v9.123.
   - Målt med samme facit som før (Testlyd: hele lyden, og trommerne alene som Trommer-spor; Rigtige trommer: NAVN_MIX.wav, og NAVN_Drum.wav som Trommer-spor):
       Testlyd Taktslag pr. mønster 97 0 98 0 0 → 97 98 98 97 0 og Takt 1 0 0 94 0 0 → 88 94 94 88 0 (House, Hip-hop, Drum and bass, Techno, Breakbeat);
       Rigtige trommer Taktslag 81 → 85 og Takt 1 69 → 72 (FunkJazz Takt 1 96 → 0, ModalJazz 0 → 100). Breakbeat er stadig forkert (dens kick ligger mest på modslaget).
   - Analyse sikkerhed måler det: rækkerne "Taktslag · 4 spor" og "Takt 1 · 4 spor" (Testlyd og Rigtige trommer · hele mixet). Testlyden genbruger lyden og analysen fra
     testens første del (ingen ekstra analyse). Med 4 spor viser cirklen ved Taktslag og Takt 1 de tal, og boblen siger hvorfor.
   - Indstillinger for analysen → Taktgitter med 4 spor: Trommer-sporet (standard) eller Hele lyden (set.a3spor = false). Med A3 slået fra er alt som før v9.117.
   - Under testene bruges dine egne 4 spor aldrig (A3S.test); målingerne lægger Trommer-sporet ind for sig (A3S.falsk). */
const A3S={trom:null,memo:null,test:false,falsk:null},A3X={slag:'x:taktslag:4spor',takt:'x:takt:4spor'};
AS.X[A3X.slag]='Taktslag · 4 spor (taktgitter fra Trommer-sporet)';AS.X[A3X.takt]='Takt 1 · 4 spor (taktgitter fra Trommer-sporet)';
function a3SporTil(){return a3Til()&&!(typeof set!=='undefined'&&set&&set.a3spor===false)}
function a3SporF(){try{if(!a3SporTil()||!F||!F.kick)return null;let T=A3S.falsk;if(!T){if(A3S.test||typeof STEM==='undefined'||!STEM.klar||!STEM.F||!STEM.F.trommer)return null;T=STEM.F.trommer}
 if(!T.kick||!T.flux||!T.snare||!T.hihat||Math.abs(T.kick.length-F.kick.length)>2)return null;const n=F.kick.length,fit=a=>{if(a.length===n)return a;const o=new Float32Array(n);o.set(Array.prototype.slice.call(a,0,n));return o};
 return{flux:fit(T.flux),kick:fit(T.kick),snare:fit(T.snare),hihat:fit(T.hihat)}}catch(e){return null}}
{const gl=Rytme.onsetStyrke;Rytme.onsetStyrke=function(fl,kick,snare,hihat,dtf){const T=A3S.trom;return T?gl(T.flux,T.kick,T.snare,T.hihat,dtf):gl(fl,kick,snare,hihat,dtf)}}
for(const fn of ['taktslag','taktFase']){const gl=Rytme[fn];Rytme[fn]=function(){const T=A3S.trom;if(!T)return gl.apply(this,arguments);const g=F;F=Object.assign({},F,T);try{return gl.apply(this,arguments)}finally{F=g}}}
{const gl=showAnalyser;window.showAnalyser=function(){A3S.trom=a3SporF();try{const r=gl.apply(this,arguments);if(r)r.gitter=A3S.trom?'trommer':'hele';return r}finally{A3S.trom=null}}}
{const gl=showTempoBrug;window.showTempoBrug=function(){A3S.trom=typeof SHOWPROFIL!=='undefined'&&SHOWPROFIL&&SHOWPROFIL.gitter==='trommer'?a3SporF():null;try{return gl.apply(this,arguments)}finally{A3S.trom=null}}}
/* rækken i Indstillinger for analysen (lige under Bedre slag og takt) */
function a3SporRaekke(){const k=document.querySelector('#sg [data-sgk="indst"]');if(!k)return;const til=a3SporTil(),a3=a3Til(),P=typeof SHOWPROFIL!=='undefined'?SHOWPROFIL:null,har=typeof STEM!=='undefined'&&!!STEM.klar,sig=[til,a3,har,P&&P.gitter].join('|');let g=k.querySelector('[data-a3sr]');
 if(!g||g.dataset.sig!==sig){if(g)g.remove();g=document.createElement('div');g.className='sg-r';g.dataset.a3sr='1';g.dataset.sig=sig;const dis=a3?'':' disabled';
  g.innerHTML='<b>Taktgitter med 4 spor</b><span class="small">Med 4 spor regnes tempo, taktslag og takt 1 ud fra Trommer-sporet (takt 1 også ud fra toner og akkorder i den samlede lyd); uden spor bruges hele lyden. Hører til Bedre slag og takt (A3).'+(a3?'':' A3 er slået fra.')+(har&&P?' <b>Denne sang:</b> taktgitteret kommer fra '+(P.gitter==='trommer'?'Trommer-sporet':'hele lyden')+'.':'')+'</span><span class="sg-styr"><span class="ne-seg sg-seg" role="group"><button class="'+(til?'on':'ghost')+'" data-a3s="1" aria-pressed="'+til+'" title="Standard"'+dis+'>Trommer-sporet</button><button class="'+(til?'ghost':'on')+'" data-a3s="0" aria-pressed="'+!til+'"'+dis+'>Hele lyden</button></span></span>';k.appendChild(g)}
 const a=k.querySelector('[data-a3r]');if(a&&a.nextElementSibling!==g)a.insertAdjacentElement('afterend',g)}
{const gl=sgIndstTegn;window.sgIndstTegn=function(t){gl(t);try{a3SporRaekke()}catch(e){}}}
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-a3]'))setTimeout(()=>{try{a3SporRaekke()}catch(x){}},0);const b=e.target.closest&&e.target.closest('[data-a3s]');if(!b||b.disabled)return;const til=b.dataset.a3s==='1';
 if(til)delete set.a3spor;else set.a3spor=false;try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}if(RAW){try{applyNorm();buildPeaks();renderTune();showUI()}catch(x){console.error(x)}}
 ['[data-a3r]','[data-a3sr]'].forEach(s=>{const r=document.querySelector('#sg '+s);if(r)r.remove()});try{a3Raekke();a3SporRaekke()}catch(x){}try{asTegn();mxByg()}catch(x){}
 msg('Taktgitter med 4 spor: '+(til?'Trommer-sporet':'hele lyden')+'. '+(RAW?'Sangen er regnet om. ':'')+(typeof STEM!=='undefined'&&STEM.klar?'':'Det gælder, når 4 spor er hentet.'))});
/* Analyse sikkerhed · Testlyd: hele lyden med trommerne alene som Trommer-spor. Lyden og trin 1 og 2 fra testens første del genbruges (husket under testen). */
{const gl=asRender;window.asRender=async function(M,v){const r=await gl.apply(this,arguments);if(A3S.memo&&r&&r.b){A3S.memo.r.set(M.id+'/'+v,r);A3S.memo.lyd.add(r.b)}return r}}
{const gl=atKoer;window.atKoer=async function(b,trin){const r=await gl.apply(this,arguments);if(A3S.memo&&b&&A3S.memo.lyd.has(b)){const x=A3S.memo.raw.get(b)||{};x['t'+trin]=r;A3S.memo.raw.set(b,x)}return r}}
function a3Spor4Testlyd(m){const D=AS.data;if(!m||!D||!D.res)return false;const res=D.res,paa='Testlyd, hele lyden med trommerne alene som Trommer-spor (4 spor)';delete res[A3X.slag];delete res[A3X.takt];
 const add=(k,id,o)=>{const r=res[k]||(res[k]={hit:0,n:0,fa:0,ov:0,pm:[],type:'h',paa});['hit','n','fa','ov'].forEach(x=>r[x]+=o[x]);r.pm.push([id,asF(o)])};
 for(const M of AS.M){if(M.kun==='trommer')continue;const ra=m.r.get(M.id+'/alt'),rt=m.r.get(M.id+'/trommer'),xa=ra&&m.raw.get(ra.b),xt=rt&&m.raw.get(rt.b);if(!xa||!xt||!xa.t1||!xt.t1)continue;
  const Nt=asNorm(xt.t1,null,rt.b.sampleRate,rt.b.duration);let N;A3S.falsk=Object.assign({},Nt.A,Nt.F);try{N=asNorm(xa.t1,xa.t2||null,ra.b.sampleRate,ra.b.duration)}finally{A3S.falsk=null}
  const S=ra.S;add(A3X.slag,M.id,asMatch(S.beat,asSpring(N.A['ana:taktslag'],N.dtf,S),AS.TOLT));add(A3X.takt,M.id,asMatch(S.takt,asSpring(N.A['ana:takt'],N.dtf,S),AS.TOLT))}
 [A3X.slag,A3X.takt].forEach(k=>{if(res[k])res[k].s=asF(res[k])});return !!res[A3X.slag]}
{const gl=asKoer;window.asKoer=async function(){if(AS.koerer)return gl.apply(this,arguments);const m={r:new Map(),raw:new Map(),lyd:new Set()};A3S.memo=m;A3S.test=true;let d;try{d=await gl.apply(this,arguments)}finally{A3S.memo=null;A3S.test=false}
 try{if(d&&d.res&&a3Til()){A3S.test=true;const t0=performance.now();if(a3Spor4Testlyd(m)){d.ms+=Math.round(performance.now()-t0);const h=d.hist&&d.hist[d.hist.length-1];if(h&&h.s){h.s[A3X.slag]=d.res[A3X.slag].s;h.s[A3X.takt]=d.res[A3X.takt].s}
  try{lsGem('rytme-asik',JSON.stringify(AS.data))}catch(e){}asTegn();try{mxByg()}catch(e){}}}}catch(e){console.error(e)}finally{A3S.test=false;A3S.falsk=null}return AS.data}}
/* Rigtige trommer: hele mixet med kun trommerne som Trommer-spor (alt kommer fra cachen fra første del) */
MDB.R.push(['taktslag4','Taktslag · 4 spor'],['takt4','Takt 1 · 4 spor']);
{const gl=mdbKoer;window.mdbKoer=async function(files){if(MDB.koerer)return gl.apply(this,arguments);A3S.test=true;let d;try{d=await gl.apply(this,arguments)}finally{A3S.test=false}
 if(!d||!d.res||!a3Til())return d;MDB.koerer=true;A3S.test=true;const t0=performance.now();
 try{const L=mdbFind(files),sum={taktslag4:{hit:0,n:0,fa:0,ov:0,neu:0,pm:[]},takt4:{hit:0,n:0,fa:0,ov:0,neu:0,pm:[]}};let i=0;
  for(const st of L){if(!st.mix||!st.trom||!st.beats)continue;i++;MDB.frem='Rigtige trommer · 4 spor: '+i+' af '+L.length;asTegn();await new Promise(r=>setTimeout(r,0));
   const bt=mdbLinjer(await st.beats.text()).map(x=>[+x[0],+x[1]]),om=await mdbLyd(st.mix,true),ot=await mdbLyd(st.trom,false),Nt=asNorm(ot.R,null,ot.sr,ot.dur);let N;A3S.falsk=Object.assign({},Nt.A,Nt.F);try{N=asNorm(om.R,om.A1||null,om.sr,om.dur)}finally{A3S.falsk=null}
   const S={t0:0,slut:om.dur},a=mdbMatch(bt.map(x=>x[0]),asSpring(N.A['ana:taktslag'],N.dtf,S),AS.TOLT),b=mdbMatch(bt.filter(x=>x[1]===1).map(x=>x[0]),asSpring(N.A['ana:takt'],N.dtf,S),AS.TOLT);
   [['taktslag4',a],['takt4',b]].forEach(([k,o])=>{const r=sum[k];['hit','n','fa','ov'].forEach(x=>r[x]+=o[x]);r.pm.push([st.navn,asF(o)])})}
  if(i){for(const k in sum){sum[k].s=asF(sum[k]);d.res.mix[k]=sum[k]}d.ms+=Math.round(performance.now()-t0);d.spor4=i;const h=d.hist&&d.hist[d.hist.length-1];if(h&&h.s){h.s['mix:taktslag4']=sum.taktslag4.s;h.s['mix:takt4']=sum.takt4.s}try{lsGem('rytme-asik-mdb',JSON.stringify(MDB.data))}catch(e){}}}
 catch(e){console.error(e)}finally{MDB.koerer=false;MDB.frem='';A3S.test=false;A3S.falsk=null}asTegn();return MDB.data}}
{const gl=mdbHtml;window.mdbHtml=function(){return gl().replace('<b>Kick</b> = KD','<b>Taktslag · 4 spor</b> og <b>Takt 1 · 4 spor</b>: hele mixet analyseres med kun trommerne som Trommer-spor, så taktgitteret kommer fra trommerne, som i MV med 4 spor (fra v9.124; kolonnen kun trommerne er tom her). <b>Kick</b> = KD')}}
/* cirklen og boblen: med 4 spor er det tallet for 4 spor, der gælder for Taktslag og Takt 1 */
{const gl=asEgen;window.asEgen=function(b){const r=gl(b);try{if(r===b&&typeof STEM!=='undefined'&&STEM.klar&&a3SporTil()){const k=AS.VIA[b]||b;if(k==='ana:taktslag')return A3X.slag;if(k==='ana:takt')return A3X.takt}}catch(e){}return r}}
{const gl=asIBrug;window.asIBrug=function(){const S=gl();try{if(typeof STEM!=='undefined'&&STEM.klar&&a3SporTil())[...S].forEach(b=>{const e=asEgen(b);if(e!==b){S.delete(b);S.add(e)}})}catch(e){}return S}}
{const gl=asFor;window.asFor=function(b){const o=gl(b);if((b===A3X.slag||b===A3X.takt)&&o.s==null)o.hvorfor=a3Til()?'Måles fra v9.124: kør testen igen i Analyse → Analyse sikkerhed.':'Måles kun, når Bedre slag og takt (A3) er slået til.';return o}}
{const gl=asBobleHtml;window.asBobleHtml=function(b){let t=gl(b);try{const e=asEgen(b);if(e===A3X.slag||e===A3X.takt)t=t.replace('læser fra Trommer-sporet (Auto-valg)','får taktgitteret fra Trommer-sporet (Indstillinger for analysen → Taktgitter med 4 spor)')}catch(x){}return t}}
/* ========== SLUT: TAKTGITTER FRA TROMMER-SPORET (A3, TREDJE DEL) ========== */
