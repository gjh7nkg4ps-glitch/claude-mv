
/* ========== v9.127: RETTELSERNE BRUGES I REGLERNE (A4, ANDEN DEL) ==========
   Plan A4: hændelserne med dine rettelser er kilder til reglerne. I stedet for nye kilder rettes de kurver, reglerne allerede læser, så alle regler, figurer og
   Node-editoren følger med uden at blive bygget om:
   - Slettet Kick, Snare eller Hihat: kurven (F.kick, F.snare, F.hihat og med 4 spor også Trommer-sporets) sættes til 0 fra cirka 45 ms før til 70 ms efter.
   - Nyt slag: kurven får en top (1, og 0,5 i rammen efter). Flyttet = slettet det gamle sted og nyt det nye sted.
   - Takt 1: kurven Takt (første slag) (A['ana:takt']) regnes igen ud fra Takt 1-hændelserne med rettelserne (samme form: falder over 0,25 s).
   - Kun for den sang, der er hentet; aldrig i testene (Analyse sikkerhed, Rigtige trommer: asNorm). Hændelserne i Lyd over tid regnes stadig af de urørte kurver.
   - Knappen "Rettelser i reglerne: Til/Fra" i hovedet af Lyd over tid (set.tlRegler = false er Fra; standard Til). Med Fra er kurverne som før v9.127. */
const TLR={F0:null,iNorm:0,antal:0};
function tlrTil(){return !(typeof set!=='undefined'&&set&&set.tlRegler===false)}
{const gl=asNorm;window.asNorm=function(){TLR.iNorm++;try{return gl.apply(this,arguments)}finally{TLR.iNorm--}}}
/* de urørte kurver gemmes, så de kan rettes igen fra bunden */
function tlrGem0(){const sp=typeof STEM!=='undefined'&&STEM.klar&&STEM.F&&STEM.F.trommer?STEM.F.trommer:null,k3=['kick','snare','hihat'];
 TLR.F0={F,kurver:Object.fromEntries(k3.map(k=>[k,F[k]])),trom:sp?Object.fromEntries(k3.filter(k=>sp[k]).map(k=>[k,sp[k]])):null,spRef:sp,A,takt:A&&A['ana:takt']}}
function tlrGendan(){const G=TLR.F0;if(!G||G.F!==F)return;for(const k in G.kurver)F[k]=G.kurver[k];if(G.trom&&G.spRef)for(const k in G.trom)G.spRef[k]=G.trom[k];if(G.A&&G.A===A&&G.takt)A['ana:takt']=G.takt;TLR.antal=0}
function tlrRet(){if(TLR.iNorm>0||typeof F==='undefined'||!F||!F.kick||!sr)return 0;if(!TLR.F0||TLR.F0.F!==F)tlrGem0();tlrGendan();if(!tlrTil())return 0;const R=tlRet(),n=R.slet.length+R.flyt.length+R.ny.length;if(!n)return 0;
 const dtf=H/sr,G=TLR.F0,nul=(a,t)=>{const f=Math.round(t/dtf)-1;for(let d=-2;d<=3;d++){const j=f+d;if(j>=0&&j<a.length)a[j]=0}},top=(a,t)=>{const f=Math.max(0,Math.round(t/dtf)-1);if(f<a.length)a[f]=1;if(f+1<a.length)a[f+1]=Math.max(a[f+1],.5)};
 const kopi={},tk={};['kick','snare','hihat'].forEach(k=>{kopi[k]=Float32Array.from(G.kurver[k]);if(G.trom&&G.trom[k])tk[k]=Float32Array.from(G.trom[k])});
 const del=(k,t)=>{if(!kopi[k])return;nul(kopi[k],t);if(tk[k])nul(tk[k],t)},ny=(k,t)=>{if(!kopi[k])return;top(kopi[k],t);if(tk[k])top(tk[k],t)};
 R.slet.forEach(s=>del(s.spor,s.t));R.flyt.forEach(s=>{del(s.spor,s.fra);ny(s.spor,s.til)});R.ny.forEach(s=>ny(s.spor,s.t));
 for(const k in kopi)F[k]=kopi[k];if(G.spRef)for(const k in tk)G.spRef[k]=tk[k];
 if(A&&G.takt&&(R.slet.concat(R.flyt,R.ny).some(s=>s.spor==='takt1'))){const L=(tlHaend()||[]).filter(e=>e.spor==='takt1').map(e=>e.t),a=new Float32Array(G.takt.length);L.forEach(t0=>{for(let k=Math.max(0,Math.floor(t0/dtf)-1);k<a.length;k++){const t=(k+1)*dtf;if(t<t0-1e-9)continue;if(t>t0+.7)break;const v=Math.exp(-(t-t0)/.25);if(v>a[k])a[k]=v}});A['ana:takt']=a}
 TLR.antal=n;return n}
/* tlRaa (hændelserne i Lyd over tid) regner altid af de urørte kurver */
{const gl=tlRaa;window.tlRaa=function(){const G=TLR.F0;if(!G||G.F!==F||!TLR.antal)return gl.apply(this,arguments);const nu={};for(const k in G.kurver){nu[k]=F[k];F[k]=G.kurver[k]}const nt={};if(G.trom&&G.spRef)for(const k in G.trom){nt[k]=G.spRef[k];G.spRef[k]=G.trom[k]}
 const na=A&&A['ana:takt'];if(G.A===A&&G.takt)A['ana:takt']=G.takt;try{return gl.apply(this,arguments)}finally{for(const k in nu)F[k]=nu[k];for(const k in nt)G.spRef[k]=nt[k];if(na)A['ana:takt']=na}}}
/* rettes igen, når analysen regnes om, og når du retter */
{const gl=applyNorm;window.applyNorm=function(){if(TLR.iNorm===0){try{tlrGendan()}catch(e){}}/* Trommer-sporets kurver regnes ikke om; de lægges tilbage, før der rettes igen */const r=gl.apply(this,arguments);if(TLR.iNorm===0){TLR.F0=null;try{tlrRet()}catch(e){console.error(e)}}return r}}
{const gl=tlRetGem;window.tlRetGem=function(r,tekst){const ok=gl(r,tekst);try{tlrRet()}catch(e){}return ok}}
{const gl=tlFortryd;window.tlFortryd=function(){gl();try{tlrRet()}catch(e){}}}
/* knappen i hovedet af Lyd over tid */
{const gl=lotHoved;window.lotHoved=function(){gl();const b=document.querySelector('#sg [data-sgh="lot"] .tl-bar');if(!b||b.querySelector('[data-tlr]'))return;const til=tlrTil(),x=document.createElement('button');x.dataset.tlr='1';x.className=til?'on':'ghost';x.setAttribute('aria-pressed',til);
 x.title='Til: dine rettelser (slettede, flyttede og nye slag) bruges af reglerne for den sang, der er hentet. Fra: reglerne læser analysen, som den er.';x.textContent='Rettelser i reglerne: '+(til?'Til':'Fra');const f=b.querySelector('[data-tl="fortryd"]');b.insertBefore(x,f||null)}}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-tlr]');if(!b)return;const til=!tlrTil();if(til)delete set.tlRegler;else set.tlRegler=false;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}const n=tlrRet();try{lotHoved();LOT.offSig='';lotTegn()}catch(e){}
 msg('Rettelser i reglerne: '+(til?'Til'+(n?' ('+n+' rettelser bruges)':' (ingen rettelser endnu)'):'Fra; reglerne læser analysen, som den er')+'.')});
setTimeout(()=>{try{lotHoved()}catch(e){}},0);
/* ========== SLUT: RETTELSERNE BRUGES I REGLERNE (A4, ANDEN DEL) ========== */
