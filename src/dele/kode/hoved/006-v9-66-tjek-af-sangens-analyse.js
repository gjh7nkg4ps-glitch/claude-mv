/* ========== v9.66: TJEK AF SANGENS ANALYSE ==========
   Brugerens fund 16. november: en lang sang gav slet ingen lys. Motoren og tidsregningen er prøvet med 74 minutters kunstige målinger og virker,
   så fejlen må ligge i målingerne for netop den sang (fx en gammel analyse i cachen). anaTjek() deler sangen i 8 dele og sammenligner lydens styrke
   (målt direkte i lyden) med analysens RMS og med, hvor tit kick er over 0,3. Passer længden ikke, eller er analysen stille, hvor der er lyd,
   analyseres sangen igen ved indlæsning. Tallene vises i statuslinjen og i panelet Automatik (Sangens analyse, Analysér igen). */
function anaTjek(){if(typeof RAW==='undefined'||!RAW||!RAW.rms||typeof buf==='undefined'||!buf||!(dur>0))return null;const K=8,n=RAW.rms.length,vent=Math.floor((buf.length-2048)/H),c=buf.getChannelData(0),L=c.length,lyd=[],ana=[],slag=[];
 for(let k=0;k<K;k++){let s=0,m=0;const a0=Math.floor(k/K*L),a1=Math.floor((k+1)/K*L),trin=Math.max(1,Math.floor((a1-a0)/4000));for(let i=a0;i<a1;i+=trin){s+=c[i]*c[i];m++}lyd.push(Math.sqrt(s/Math.max(1,m)));
  let q=0,z=0,sl=0;const i0=Math.floor(k/K*n),i1=Math.floor((k+1)/K*n),FK=typeof F!=='undefined'&&F&&F.kick;for(let i=i0;i<i1;i++){q+=RAW.rms[i];z++;if(FK&&FK[i]>.3)sl++}ana.push(q/Math.max(1,z));slag.push(sl/Math.max(1,z))}
 const ml=Math.max(...lyd),ma=Math.max(...ana),daarlig=[];if(ml>0&&ma>0)for(let k=0;k<K;k++)if(lyd[k]>ml*.1&&ana[k]<ma*.1*(lyd[k]/ml))daarlig.push(k+1);
 const laengdeOK=Math.abs(n-vent)<=Math.max(2,vent*.01);return{n,vent,laengdeOK,lyd,ana,slag,daarlig,medSlag:slag.filter(v=>v>.002).length,ok:laengdeOK&&!daarlig.length}}
function anaTekst(T){if(!T)return'Ingen analyseret lydfil';return'slag fundet i '+T.medSlag+' af 8 dele af sangen'+anaUden()+(T.laengdeOK?'':' · analysens længde passer ikke til lyden')+(T.daarlig.length?' · analysen er stille i del '+T.daarlig.join(', ')+', hvor der er lyd':'')}
function anaStatus(){const T=anaTjek(),st=$('status');if(T&&st&&!/slag fundet i/.test(st.textContent))st.textContent+=' · '+anaTekst(T)}
async function anaIgen(){if(typeof buf==='undefined'||!buf||typeof live!=='undefined'&&live){msg('Analysér igen: vælg en lydfil først.');return false}if(buf.length<H*8){msg('Analysér igen: lyden er for kort.');return false}
 const RAW0=RAW,ARAW0=ARAW;try{$('status').textContent='Analyserer igen …';const r=await anaAlt(buf,{efterTrin1:R1=>{RAW=R1;ARAW=null;try{applyNorm();buildPeaks()}catch(e){}}});RAW=r.F;ARAW=r.A;if(typeof SHOWKEY!=='undefined'&&SHOWKEY)cachePut(SHOWKEY,{F:RAW,A:ARAW,dele:AT.dele});applyNorm();buildPeaks();try{renderTune();renderGuide();showUI()}catch(e){}try{if(typeof rt!=='undefined')rt.tidC=null}catch(e){}
  anaSkjul();$('status').textContent='Analyseret igen og gemt · '+anaTekst(anaTjek());return true}catch(e){if(e&&e.message==='ANA_STOP'){anaSkjul();RAW=RAW0;ARAW=ARAW0;try{applyNorm();buildPeaks()}catch(x){}$('status').textContent='Analysér igen blev annulleret. Den gamle analyse bruges stadig.';return false}console.error(e);$('status').textContent='Analysen kunne ikke laves: '+((e&&e.message)||e);return false}}
/* ========== SLUT: TJEK AF SANGENS ANALYSE ========== */
