
/* ========== v9.123: FASENS SIKKERHED (A3, ANDEN DEL) ==========
   Resten af A3, første skridt (brugerens rækkefølge: resten af A3 → A2 → A4). Målt før og efter på Testlyd og Rigtige trommer.
   - Fasens sikkerhed (vores navn; fagudtryk: downbeat confidence) var i v9.117 afstanden mellem bedste og næstbedste af de fire pladser. Den var høj, også når
     takt 1 var forkert (brugerens rapport fra v9.117). Nu stemmer hver takt for sig: den plads af fire, hvor kick − ½ × snare + skift i klang og toner er størst
     (de samme målinger, som vælger takt 1). Enigheden er, hvor mange takter der peger på den valgte takt 1, over det tilfældige: 0 = som tilfældigt (1 af 4),
     1 = alle takter. Sikkerheden regnes ud af enigheden med en rampe, målt på Rigtige trommer:
       med toner (de 12 toner fra trin 2, som i en rigtig sang): 0,20 + 0,75 × enighed / 0,25, højst 0,95;
       uden toner (fx kun trommer): 0,25 + 0,40 × enighed / 0,50, højst 0,65.
     Målt på de samme stykker, som rampen er valgt på (23 + 23 stykker og 11 testlyde; kan være overtilpasset): hele mixet med enighed 0,2 eller mere → takt 1
     rigtig i 14 af 15, under 0,2 → 3 af 8. Brier-score (fagudtryk: gennemsnittet af (sikkerhed − rigtig)², lavere er bedre; altid 0,5 giver 0,25): hele mixet
     0,363 → 0,117; kun trommerne 0,323 → 0,229; testlyd 0,429 → 0,388. Sikkerheden kan ikke se, om selve taktslagene ligger på modslaget (testlydens Hip-hop,
     Techno og Breakbeat med bas).
   - Takternes stemmer gemmes i SHOWPROFIL.faseInfo (ja, nb, toner, stemmer), så A2 kan bruge sikkerheden takt for takt.
   - Med A3 slået fra er alt som før v9.117. */
const A3F={RAMPE:{toner:[.4,.5,.25,.9]/* v9.130: valgt igen på indstil (før .2, .75, .25, .95) */,uden:[.5,0,1,.5]/* v9.131: fast 0,50 (før .25, .4, .5, .65; tjek viste, at enigheden uden toner ikke forudsiger takt 1) */},sidst:null};
function a3FaseKonf(enig,toner){const r=toner?A3F.RAMPE.toner:A3F.RAMPE.uden;return Math.min(r[3],r[0]+r[1]*Math.min(1,Math.max(0,+enig||0)/r[2]))}
{const gl=Rytme.taktFase;Rytme.taktFase=function(acc,beats,pt){const r=gl(acc,beats,pt),d=A3.fd;A3.fd=null;A3F.sidst=null;if(!d||!r)return r;
 const sd=a=>{a=a.filter(x=>x!=null);if(!a.length)return 1;const m=a.reduce((x,y)=>x+y,0)/a.length;return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/a.length)||1},sA=sd(d.ac),sN=sd(d.nv),P=d.pt;
 const s=d.ac.map((x,i)=>x/sA+(d.nv[i]==null?0:d.nv[i]/sN)),st=[];for(let b=0;b*P+P-1<s.length;b++){let bj=0,bv=-Infinity;for(let j=0;j<P;j++){const v=s[b*P+j];if(v>bv){bv=v;bj=j}}st.push(bj===r.fase?1:0)}
 const nb=st.length,ja=st.reduce((a,b)=>a+b,0),enig=nb?Math.max(0,(ja/nb-1/P)/(1-1/P)):0,konf=Math.round(a3FaseKonf(enig,d.toner)*100)/100;
 A3F.sidst={enig:Math.round(enig*100)/100,ja,nb,toner:d.toner,stemmer:st,konfGl:r.konf};return{fase:r.fase,konf}}}
/* SHOWPROFIL får takternes stemmer (også når tempoet ganges med 2 eller ½) */
{const gl=showAnalyser;window.showAnalyser=function(){const r=gl.apply(this,arguments);if(r)r.faseInfo=A3F.sidst;return r}}
{const gl=showTempoBrug;window.showTempoBrug=function(){const r=gl.apply(this,arguments);if(typeof SHOWPROFIL!=='undefined'&&SHOWPROFIL)SHOWPROFIL.faseInfo=A3F.sidst;return r}}
/* teksten ved fasens sikkerhed (rækken i Indstillinger for analysen og boblen ved Takt 1) */
function a3FaseHvorfor(fk,boble){const I=typeof SHOWPROFIL!=='undefined'&&SHOWPROFIL&&SHOWPROFIL.faseInfo,lav=fk<.5;
 const hv=I?'i '+I.ja+' af '+I.nb+' takter peger kick, snare og skift i klang'+(I.toner?' og toner':'')+' på samme takt 1, hvor tilfældigt ville give cirka '+Math.round(I.nb/4)+(I.toner?'':'; uden toner kan takt 1 ikke vurderes, så sikkerheden er fast 0,5'):'',lt=lav?'lav: takt 1 kan være forkert'+(boble?'; ret den under Analyse → Sang → Taktslag':''):'';
 return hv||lt?' ('+[hv,lt].filter(Boolean).join('; ')+')':''}
/* ========== SLUT: FASENS SIKKERHED (A3, ANDEN DEL) ========== */
