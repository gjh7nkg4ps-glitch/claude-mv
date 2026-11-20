
/* ========== v9.125: SIKKERHEDSGRÆNSE OG ENIGHED I REGLERNE (A2) ==========
   Plan A2 (hovedchattens "Den nye analyse P8.19"; P8.17 punkt 3: vis usikkerheden, og undgå falske handlinger).
   - Kræv sikkerhed (vores navn; fagudtryk: confidence gate): hver regel kan få feltet m.sik (0 = Fra, ellers 0,05 til 1). Reglen virker kun, når lydtrækkets
     sikkerhed lige nu er mindst så høj. Sikkerheden (a2Sik) er
       pr. øjeblik, hvor den findes: Tonehøjde og Toneklasse → Tonesikkerhed (ana:pitchsik, også pr. spor); Takt (første slag) og Takt 1-hændelsen → fasens
       sikkerhed takt for takt (v9.123: takternes enighed i de 9 takter omkring stedet, gennem samme rampe; takt 1 sat i hånden = 1);
       ellers fast: tallet fra Analyse sikkerhed (det, cirklen viser; med 4 spor Trommer- og 4 spor-tallene). Ikke målt = spærrer ikke (det står i panelet).
   - Rækkefølgen: tærskel → sikkerhedsgrænse → enighed (Gate: en anden kilde skal også være over sin tærskel) → hysterese og spærretid → handling.
     Sikkerhedsgrænsen lukker reglen ligesom Gate; den lægges ind gennem motorens o.off, så motoren selv er uændret. Uden m.sik regnes præcis som før.
   - Enighed er Gate (findes fra v9.9 som Port, v9.33 Gate); kontrolpanelet forklarer den nu som "to kilder skal være enige".
   - Node-editoren: skyderen Kræv sikkerhed i kontrolpanelet (over Gate) med lydtrækkets sikkerhed og hvor den kommer fra; mærket "≥ 80 %" på regel-noden,
     rødt, mens sikkerhedsgrænsen spærrer. Matrixens Kopiér og Indsæt indstillinger tager feltet med.
   - Foreslå regler: lydtræk med gul eller rød cirkel (under 75 %) får tærsklen hævet 0,1 (højst 0,9), og forslaget siger hvorfor.
   - Lyd over tid: rækken Taktslag er skraveret, hvor fasens sikkerhed er under 0,5 (takt 1 kan være forkert dér). */
const A2={blok:[],fast:{},fastT:0};
NE4_FELT.sik=['Kræv sikkerhed',0,1,.05,0,v=>v>0?Math.round(v*100)+' %':'Fra'];
try{MX_INDST.push('sik');MX_FELTER.push('sik')}catch(e){}
/* fasens sikkerhed pr. ramme: takternes enighed i 9 takter omkring stedet */
function a2FaseKurve(){const P=typeof SHOWPROFIL!=='undefined'?SHOWPROFIL:null;if(!P||!P.beats||!P.beats.length||typeof F==='undefined'||!F||!F.kick)return null;const n=F.kick.length;
 if(P.faseKurve&&P.faseKurve.n===n&&P.faseKurve.h===!!P.faseHaandsat&&P.faseKurve.I===P.faseInfo)return P.faseKurve.k;const k=new Float32Array(n);
 if(P.faseHaandsat)k.fill(1);else{const I=P.faseInfo;if(!I||!I.stemmer||!I.stemmer.length)return null;const st=I.stemmer,b=P.beats,W=4;
  for(let g=0;g<st.length;g++){let s=0,c=0;for(let j=Math.max(0,g-W);j<=Math.min(st.length-1,g+W);j++){s+=st[j];c++}const kv=a3FaseKonf(Math.max(0,(s/c-.25)/.75),I.toner),f0=g===0?0:b[g*4],f1=g===st.length-1?n:b[(g+1)*4];for(let f=Math.max(0,f0);f<Math.min(n,f1);f++)k[f]=kv}}
 P.faseKurve={n,k,h:!!P.faseHaandsat,I:P.faseInfo};return k}
/* lydtrækkets sikkerhed: {v: 0 til 1 eller null, slags: 'nu' (pr. øjeblik) eller 'fast', hvor: tekst} */
function a2Sik(b,t){b=String(b||'');const tt=t==null?(typeof now==='function'?now():0):t,m=/^(stem:([^:]+):)?ana:(pitch|toneklasse)$/.exec(b);
 if(m){let v=null;try{v=kildeV((m[1]||'')+'ana:pitchsik',tt)}catch(e){}return{v:Number.isFinite(+v)?Math.max(0,Math.min(1,+v)):null,slags:'nu',hvor:'Tonesikkerhed'+(m[2]?' i sporet':'')+', pr. øjeblik'}}
 const vb=(typeof AS!=='undefined'&&AS.VIA&&AS.VIA[b])||b;
 if(vb==='ana:takt'&&!(typeof live!=='undefined'&&live)){const k=a2FaseKurve();if(k){const f=Math.max(0,Math.min(k.length-1,Math.floor(tt/(H/sr))));return{v:k[f],slags:'nu',hvor:'fasens sikkerhed takt for takt, pr. øjeblik'}}}
 const nu=performance.now();if(nu-A2.fastT>1000){A2.fast={};A2.fastT=nu}
 if(!(b in A2.fast)){let o=null;try{o=asFor(asEgen(b))}catch(e){}A2.fast[b]=o&&o.s!=null?{v:o.s/100,slags:'fast',hvor:o.mat?'præcis måling':'fast tal fra Analyse sikkerhed (målt på testlyd)'}:{v:null,slags:'fast',hvor:'ikke målt, så grænsen spærrer ikke'}}
 return A2.fast[b]}
/* motoren: sikkerhedsgrænsen lukker reglen ligesom Gate */
{const gl=Rytme.koer;Rytme.koer=function(maps,o){if(!o||!maps||!maps.some(m=>m&&+m.sik>0)){A2.blok.length=0;return gl.apply(this,arguments)}const off=o.off,t=typeof now==='function'?now():0;
 const o2=Object.assign({},o,{off:(m,i)=>{const a=off?off(m,i):false;let s=false;if(m&&+m.sik>0){const q=a2Sik(m.band,t);s=q.v!=null&&q.v<+m.sik}A2.blok[i]=s;return a||s}});return gl.call(this,maps,o2)}}
/* Node-editoren: skyderen i kontrolpanelet og mærket på noden */
{const gl=window.ne2Indst;window.ne2Indst=function(n){let h=gl(n);if(!n||n.kol!=='regel'||!n.m)return h;const m=n.m,q=a2Sik(m.band),sk=+m.sik||0,tal=q.v==null?'ikke målt':q.slags==='nu'?'lige nu '+neTal(q.v):Math.round(q.v*100)+' %',blok=sk>0&&q.v!=null&&q.v<sk;
 const html='<div class="ne-sik" data-a2="1">'+ne4Skyder(m,'sik',false,'Kræv sikkerhed (vores navn; fagudtryk: confidence gate): reglen virker kun, når lydtrækkets sikkerhed er mindst så høj. Fra = som før.')
  +'<small>Sikkerhed for '+neHtml(neLtNavn(m.band))+': <b>'+neHtml(tal)+'</b> ('+neHtml(q.hvor)+')'+(sk>0?(blok?' · <b class="a2-blok">spærret nu</b>':' · åben nu'):'')+'. Rækkefølgen: tærskel → sikkerhed → Gate (enighed) → hysterese og spærretid → handling.</small></div>';
 h=h.replace('<div class="ne-gate">',html+'<div class="ne-gate">').replace('title="Gate: reglen virker kun, når denne kilde er over Gate-tærsklen.">Gate ','title="Gate (enighed): reglen virker kun, når denne kilde også er over Gate-tærsklen; så skal to kilder være enige, fx Kick · Trommer og bassens stigning.">Gate ');return h}}
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){let h=gl(n);try{if(n&&n.kol==='regel'&&n.m&&+n.m.sik>0){const p=Math.round(n.m.sik*100);h=h.replace('<span class="ne-maerker">','<span class="ne-maerker"><span class="ne-m ne-m-sik'+(A2.blok[n.i]?' ne-m-blok':'')+'" data-a2i="'+n.i+'" title="'+neHtml('Kræv sikkerhed: reglen virker kun, når sikkerheden for '+neLtNavn(n.m.band)+' er mindst '+p+' %. Rød = spærret lige nu.')+'">≥ '+p+' %</span>')}}catch(e){}return h}}
setInterval(()=>{document.querySelectorAll('.ne-m-sik[data-a2i]').forEach(el=>el.classList.toggle('ne-m-blok',!!A2.blok[+el.dataset.a2i]))},250);
/* Foreslå regler: usikre lydtræk får en højere tærskel */
{const gl=fsBeregn;window.fsBeregn=function(){const L=gl();try{L.forEach(f=>{const o=asFor(asEgen(f.regel.band));if(o&&o.s!=null&&!o.mat&&o.s<75){const gt=+f.regel.thr||0,ny=Math.min(.9,Math.round((gt+.1)*100)/100);if(ny>gt){f.regel.thr=ny;f.hvorfor+=' Analyse sikkerhed: '+o.s+' % ('+(o.s>=50?'med omtanke':'usikker')+'), så tærsklen er hævet fra '+neTal(gt)+' til '+neTal(ny)+'.'}}})}catch(e){}return L}}
/* Lyd over tid: skraveret, hvor takt 1 er usikker */
{const gl=lotTegnFast;window.lotTegnFast=function(g,W,Hh,R,V){gl(g,W,Hh,R,V);try{const P=typeof SHOWPROFIL!=='undefined'?SHOWPROFIL:null;if(!P||!P.beats||!P.beats.length||(V.b-V.a)>90)return;const k=a2FaseKurve();if(!k)return;
 let y=14,ty=-1,th=0;R.forEach(r=>{if(r.id==='takt'){ty=y;th=r.h}y+=r.h});if(ty<0)return;const dtf=H/sr,pc=document.createElement('canvas');pc.width=pc.height=8;const q=pc.getContext('2d');q.strokeStyle='rgba(255,110,110,.6)';q.lineWidth=1.5;q.beginPath();q.moveTo(0,8);q.lineTo(8,0);q.stroke();
 g.save();g.fillStyle=g.createPattern(pc,'repeat');let x0=-1,nLav=0;for(let x=0;x<=W;x++){let lav=false;if(x<W){const f=Math.floor((V.a+(x+.5)/W*(V.b-V.a))/dtf);lav=f>=0&&f<k.length&&k[f]<.5}if(lav&&x0<0)x0=x;if(!lav&&x0>=0){g.fillRect(x0,ty+2,x-x0,th-4);nLav+=x-x0;x0=-1}}
 if(nLav){const tx='skraveret: takt 1 usikker (fasens sikkerhed under 0,5)';g.font='11px Schibsted Grotesk,sans-serif';g.textBaseline='top';const w=g.measureText(tx).width+8;g.fillStyle='rgba(7,3,3,.65)';g.fillRect(W-w-24,ty+2,w,14);g.fillStyle=css('--mute');g.fillText(tx,W-w-20,ty+3)}A2.lotLav=nLav;g.restore()}catch(e){}}}
/* ========== SLUT: SIKKERHEDSGRÆNSE OG ENIGHED I REGLERNE (A2) ========== */
