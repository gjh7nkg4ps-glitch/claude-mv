/* ========== v9.62: LANGE SANGE: NORMALISERING I STYKKER ==========
   Brugerens fund 16. november: en sang på 74 minutter kunne ikke mappes; reglerne slog kun til de første par minutter. Med Normalisering: Adaptiv
   deles hvert lydtræk med sangens 99. percentil. I et langt mix kan ét kraftigt stykke (over 1 % af sangen) sætte målestokken, så resten ligger
   under tærsklerne. For sange over 10 minutter deles tallene derfor bagefter med det lokale niveau (99. percentil i stykker på 2 minutter, glidende),
   dog mindst NORM_LOKAL.gulv af sangens niveau. Kun de lydtræk, der måler styrke og slag; ikke dem, der måler klang (centroid, rolloff, fladhed, ZCR).
   Kan slås fra med set.normLokal=false (Søg, Ctrl+K). Sange under 10 minutter regnes præcis som før. */
const NORM_LOKAL={min:600,blok:120,gulv:.25,noegler:['bas','mid','hmid','brill','rms','flux','vokal','kick','snare','hihat'],ana:k=>k==='ana:anslag'||/^ana:ls\d/.test(k)};
function normLokalTil(){return typeof mode!=='undefined'&&mode==='auto'&&typeof dur==='number'&&dur>NORM_LOKAL.min&&!(typeof set!=='undefined'&&set&&set.normLokal===false)}
function normLokalSerie(a){const dt=H/sr,B=Math.max(8,Math.round(NORM_LOKAL.blok/dt)),hop=B>>1,n=a.length;if(n<B*2)return a;const P=[];
 for(let s=0;s<n;s+=hop){const e=Math.min(n,s+B),q=Float32Array.from(a.subarray?a.subarray(s,e):Array.prototype.slice.call(a,s,e)).sort();P.push(Math.max(NORM_LOKAL.gulv,Math.min(1,q[Math.floor(q.length*.99)]||0)))}
 const o=new Float32Array(n);for(let i=0;i<n;i++){const x=(i-B/2)/hop,j=Math.max(0,Math.min(P.length-1,Math.floor(x))),j2=Math.min(P.length-1,j+1),f=Math.max(0,Math.min(1,x-j)),p=P[j]*(1-f)+P[j2]*f;o[i]=Math.min(1,a[i]/p)}return o}
function normLokalF(){NORM_LOKAL.aktiv=normLokalTil();if(!NORM_LOKAL.aktiv||!F)return;NORM_LOKAL.noegler.forEach(k=>{if(F[k])F[k]=normLokalSerie(F[k])});
 try{const st=$('status');if(st&&!/i stykker/.test(st.textContent))st.textContent+=' · lang sang ('+Math.round(dur/60)+' min): normaliseret i stykker på 2 minutter'}catch(e){}}
function normLokalA(){if(!NORM_LOKAL.aktiv||!A)return;Object.keys(A).forEach(k=>{if(NORM_LOKAL.ana(k)&&A[k]&&A[k].length)A[k]=normLokalSerie(A[k])})}
function normLokalSkift(){set.normLokal=set.normLokal===false;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}applyNorm();try{if(F){buildPeaks();renderTune();renderGuide()}}catch(e){}try{if(typeof rt!=='undefined')rt.tidC=null}catch(e){}
 msg('Lange sange: '+(set.normLokal===false?'normaliseres over hele sangen (som før v9.62).':'normaliseres i stykker på 2 minutter.')+(typeof dur==='number'&&dur>NORM_LOKAL.min?'':' Det gælder kun sange over 10 minutter.'))}
/* ========== SLUT: LANGE SANGE: NORMALISERING I STYKKER ========== */
function applyNorm(){if(!RAW)return;fileVer++;F={};for(const[k]of BANDS){const a=RAW[k];let p;if(mode==='auto'){const s=Float32Array.from(a).sort();p=s[Math.floor(a.length*.99)]||1e-9;if(k==='hihat')p=Rytme.normToppe(a,p)}else p=REF[k];F[k]=a.map(v=>Math.min(1,v/p))}normLokalF();anaNorm()}
function normSkift(){mode=mode==='auto'?'fast':'auto';applyNorm();if(F){buildPeaks();renderTune();renderGuide()}}/* v9.93: før knappen #norm (skjult siden v9.72); Automatik og Node-editorens værktøjslinje kalder normSkift() */
function drawSektioner(){const c=$('tl'),g=c.getContext('2d'),W=c.width,Hh=c.height;if(!SHOWPROFIL||!SHOWPROFIL.sektioner||!dur)return;g.save();g.font='11px Schibsted Grotesk,sans-serif';g.textBaseline='top';
 SHOWPROFIL.sektioner.forEach((q,i)=>{const x=tlX(q.t0,W);if(x<0||x>W)return;if(i>0){g.strokeStyle='rgba(255,209,102,.75)';g.lineWidth=2;g.beginPath();g.moveTo(x,0);g.lineTo(x,Hh);g.stroke()}g.fillStyle='rgba(11,15,20,.7)';const tw=g.measureText(q.navn).width+8;g.fillRect(x+2,Hh-16,tw,14);g.fillStyle='#ffd166';g.fillText(q.navn,x+6,Hh-15)});
 if(SHOWPROFIL.bpm>0){g.fillStyle='rgba(11,15,20,.7)';const t='♩ '+Math.round(SHOWPROFIL.bpm)+' BPM';g.fillRect(W-g.measureText(t).width-12,2,g.measureText(t).width+8,14);g.fillStyle='#ffd166';g.textAlign='right';g.fillText(t,W-8,3)}g.restore()}
function drawTL(){drawTL0();if(!live&&F&&SHOWPROFIL)drawSektioner()}
function drawTL0(){
 const c=$('tl'),g=c.getContext('2d'),W=c.width,Hh=c.height,rh=Hh/BANDS.length;
 g.clearRect(0,0,W,Hh);g.font='12px Schibsted Grotesk,sans-serif';g.textBaseline='top';
 if(live){drawLiveTL(g,W,Hh);return}
 if(!F){g.fillStyle=css('--mute');g.fillText('Ingen analyse endnu. Vælg en lydfil, eller tryk Afspil i Musik-generatoren.',12,12);return}
 const t=now(),V=tlVis(),zoomet=V.b-V.a<dur*.999;
 BANDS.forEach(([k,label],i)=>{
  const y=i*rh,col='hsl('+HUE(i)+' 60% 42%)',v=sample(k,t),ms=maps.filter(m=>m.band===k),act=ms.some(m=>v>m.thr&&v>.02);
  if(act){g.globalAlpha=.2;g.fillStyle=col;g.fillRect(0,y,W,rh);g.globalAlpha=1}
  g.strokeStyle=css('--line');g.beginPath();g.moveTo(0,y+.5);g.lineTo(W,y+.5);g.stroke();
  g.fillStyle=col;const p=peaks[k];g.beginPath();g.moveTo(0,y+rh-2);
  if(!p){/* v9.68: toppene er ikke regnet endnu (fx mens sangen analyseres igen); intet tegnes */}else if(!zoomet){for(let x=0;x<W;x++)g.lineTo(x,y+rh-2-p[Math.floor(x/W*1000)]*(rh-6))}
  else{const aa=F[k],dtf=H/sr,sp=V.b-V.a;for(let x=0;x<W;x++){const i0=Math.max(0,Math.floor((V.a+x/W*sp)/dtf)-1),i1=Math.min(aa.length-1,Math.max(i0,Math.floor((V.a+(x+1)/W*sp)/dtf)-1));let m=0;for(let q=i0;q<=i1;q++)if(aa[q]>m)m=aa[q];g.lineTo(x,y+rh-2-m*(rh-6))}}
  g.lineTo(W,y+rh-2);g.fill();
  ms.forEach(m=>{const ty=y+rh-2-m.thr*(rh-6);g.strokeStyle=css('--ink');g.setLineDash([4,3]);g.beginPath();g.moveTo(0,ty);g.lineTo(W,ty);g.stroke();g.setLineDash([])});
  (marks[k]||[]).forEach(mt=>{const mx=tlX(mt,W);if(mx>=0&&mx<=W){g.fillStyle=css('--ink');g.fillRect(mx,y,1.5,rh)}});
  g.fillStyle=act?css('--acc'):css('--ink');g.font=(act?'800 ':'400 ')+'12px Schibsted Grotesk,sans-serif';
  g.fillText(label+(ms.length?'  →  '+[...new Set(ms.map(m=>effName(m.effect)))].join(', '):''),6,y+3);
  g.fillStyle=col;g.fillRect(W-12,y+rh-2-v*(rh-4),8,v*(rh-4));g.strokeStyle=css('--ink');g.strokeRect(W-12,y+2,8,rh-4)});
 tlOverlay(g,W,Hh,V);const px=tlX(now(),W);if(px>=0&&px<=W){g.fillStyle=css('--acc');g.fillRect(px-1,0,2,Hh)}}

/* ---------- Mapping-panel ---------- */
const PAR=[
['thr','Tærskel',0,1,.01,'Hvor højt lydtrækket skal op, før effekten begynder. 0 = reagerer altid, 1 = næsten aldrig. Sæt den lige over baggrundsstøjen, så kun rigtige slag tæller.'],
['gain','Gain',0,2,.05,'Hvor kraftigt effekten svarer, når lydtrækket er over tærsklen. Højt = stort udslag, lavt = diskret.'],
['att','Attack ms',1,600,1,'Hvor hurtigt effekten tænder. Lav = skarp og øjeblikkelig (kick, snare). Høj = blød indfasning (farver, glød).'],
['rel','Release ms',10,1500,5,'Hvor langsomt effekten slukker igen. Kort = præcist og hakket, langt = efterglød der hænger.'],
['curve','Kurve',.3,3,.05,'1 = lineær. Over 1 tæller kun de kraftigste slag (mere kontrast). Under 1 viser også små udsving.'],
['gap','Spærretid ms',0,600,10,'Spærretid (vores navn; fagudtryk: refractory period, før kaldt Pause): mindste tid mellem to slag. Fra v9.10 virker den for alle forbindelser fra en slag-kilde (kick, snare, hihat, taktslag, hændelser …), så ét slag ikke giver flere anslag; for klods-spor og Lyd-mål som før. Grå i Router, når kilden glider.']];
function save(){if(multiOn&&!puck.quiet)puckRebase();try{lsGem('rytme-mapping2',JSON.stringify(maps));lsGem('rytme-objekter',JSON.stringify(fase2.objekter));lsGem('rytme-scene',JSON.stringify(scene));lsGem('rytme-lyd',JSON.stringify(lyd));if(SHOW)lsGem('rytme-show-aktiv',JSON.stringify(SHOW));else localStorage.removeItem('rytme-show-aktiv')}catch(e){}$('json').value=presetJSON();renderTune();eqRefresh();meshRefresh();meshUI()}
const opts=(L,v)=>L.map(([k,n])=>`<option value="${k}"${k===v?' selected':''}>${n}</option>`).join('');
/* Hurtighed: hver forbindelse i Mapping har to lister (lydtræk og effekt), og effektlisten indeholder ALLE mål: hver figur lægger cirka 25 mål pr. lag til, så en trommeslager gav cirka 500 mål og Perfect 2 cirka 1400, og med 70 forbindelser blev det tæt på 80.000 valgmuligheder i siden, som blev bygget om ved hver ændring og gjorde alle opslag i siden langsomme (profileret: næsten al tiden i billedløkken gik til siden, ikke til tegning). Nu viser en række kun det valgte lydtræk og den valgte effekt, og hele listen fyldes ind, første gang man trykker på listen eller tabulerer til den (fyldMapListe). fyldMapLister() fylder alle på én gang (bruges af tests og eksport). */
function fyldMapListe(s){if(!s||s.dataset.fuld)return;const v=s.value;s.innerHTML=s.dataset.f==='effect'?effOpts(v):s.dataset.f==='port'?'<option value="">Ingen port</option>'+bandOpts(v):bandOpts(v);s.value=v;s.dataset.fuld='1'}
/* v9.2: fyldMapLister fjernet (blev ikke brugt) */
function renderMaps(){
 maps.forEach(m=>{m.curve??=1;m.gap??=120;m.min??=true});
}
let HOLDRYD=false;$('hold-ryd').onclick=()=>{HOLDRYD=true;msg('Hold ryddet: alle forbindelser med Hold er sat til 0, og de holder igen fra næste lyd.')};

if($('map-midi'))$('map-midi').onclick=()=>levMidi();
/* ---------- A/B ---------- */
let active=null; /* null | 'std' | 'A' | 'B': den aktive opsætning. Fælles for A/B-panelet og Radial Mesh. */
function abStatus(){meshUI()}

/* ---------- Audit og tuning ---------- */
function corr(a,b){const n=a.length;let ma=0,mb=0;for(let i=0;i<n;i+=3){ma+=a[i];mb+=b[i]}const c=Math.ceil(n/3);ma/=c;mb/=c;let s=0,va=0,vb=0;
 for(let i=0;i<n;i+=3){const x=a[i]-ma,y=b[i]-mb;s+=x*y;va+=x*x;vb+=y*y}return s/Math.sqrt(va*vb+1e-12)}
/* v9.93: renderAudit (vinduet Lydtræk-audit, w19) er fjernet; corr bruges stadig af Foreslå regler (autoListe) */
function events(k,thr){const a=F[k],o=[];let lt=-1;for(let i=1;i<a.length-1;i++)if(a[i]>=thr&&a[i]>=a[i-1]&&a[i]>a[i+1]){const t=i*H/sr;if(t-lt>.1){o.push(t);lt=t}}return o}
function score(k,thr){const ev=events(k,thr),u=new Set();let hit=0;marks[k].forEach(t=>{const j=ev.findIndex((e,x)=>!u.has(x)&&Math.abs(e-t)<set.tol/1000);if(j>=0){u.add(j);hit++}});return{hit,fa:ev.length-u.size,ev:ev.length}}
function renderTune(){
 if(!F){$('tune').textContent='Analysér en sang først, og tryk så K og S i takt.';return}
 $('tune').innerHTML=['kick','snare'].map(k=>{const n=marks[k].length;if(!n)return `<p class="small">${k==='kick'?'Kick':'Snare'}: ingen tryk endnu (${k==='kick'?'K':'S'}).</p>`;
  const m=maps.find(x=>x.band===k),thr=m?m.thr:.3,s=score(k,thr);let best=thr,bf=-1;
  for(let t=.1;t<=.9;t+=.05){const q=score(k,t),f=2*q.hit/(n+q.ev);if(f>bf){bf=f;best=t}}
  const pct=Math.round(s.hit/n*100),navn=k==='kick'?'Kick':'Snare';return `<p class="det-r"><b class="det-pct">${pct} %</b> <span><b>${navn}</b>: ramt ${s.hit} af ${n} tryk · ${s.fa} falske alarmer ved tærskel ${thr.toFixed(2).replace('.',',')} · bedste tærskel ${best.toFixed(2).replace('.',',')}</span></p>`}).join('')+timingRapport()}
const mark=k=>{if(!F)return;marks[k].push(now());renderTune()};
document.querySelectorAll('[data-mark]').forEach(b=>b.onclick=()=>mark(b.dataset.mark));
$('clr').onclick=()=>{marks={kick:[],snare:[]};renderTune()};
function detSynlig(){const k=document.querySelector('#sg .sg-kort[data-kort="det"]');return !!(k&&k.offsetParent)}/* v9.95: kortet Detektion kan ses */
document.addEventListener('keydown',e=>{if((kbOn&&!detSynlig())||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(e.key==='k')mark('kick');if(e.key==='s')mark('snare')});
$('cprt').onclick=async()=>{const kode=document.getElementById('rytme-runtime').textContent.trim();try{await navigator.clipboard.writeText(kode);$('pmsg').textContent='Runtime kopieret ('+kode.length+' tegn). Gem den som render-runtime.js.'}catch(e){const b=$('rtbox');b.value=kode;b.hidden=false;b.select();$('pmsg').textContent='Runtime er markeret nedenfor. Tryk Ctrl+C og gem som render-runtime.js.'}};
$('copy').onclick=async()=>{try{await navigator.clipboard.writeText($('json').value);$('pmsg').textContent='Kopieret'}catch(e){$('json').select();$('pmsg').textContent='Markeret. Tryk Ctrl+C for at kopiere'}};
$('load').onclick=()=>{try{const raw=JSON.parse($('json').value);if(!Array.isArray(raw.mappings))throw 0;const d=migrer(raw);SHOW=d.show||null;Regler.erstat(d.mappings,true);if(d.master!==undefined)gmaster=d.master;if(d.pos)Object.assign(pos,d.pos);{const rn=Rytme.renseObjekter(d.objekter||[]);fase2.objekter=rn.objekter.length?rn.objekter:[nyObjekt()];renMsg(rn)}fase2.objekter.forEach(sikrEgenskaber);scene=d.scene;lyd=d.lyd;syncTargets();syncHandles();try{formUI()}catch(e){console.error('Form-editoren kunne ikke tegnes ved opstart:',e);setTimeout(()=>{try{formUI()}catch(x){}},0)}sceneUI();lydUI();save();$('pmsg').textContent='Preset indlæst'+klodsHulTekst()}catch(e){$('pmsg').textContent='Ugyldig JSON. Preset skal have et felt "mappings".'}};

/* ---------- Lydtræk-guide og auto ---------- */
const idx=k=>BANDS.findIndex(b=>b[0]===k),mk=(band,effect,thr,gain,att,rel)=>({band,effect,thr,gain,att,rel,curve:1,gap:120});
let autoOn=false;
const FAST2=[mk('kick','klods1',.4,1,10,150),mk('snare','klods2',.4,1,10,150),mk('hihat','klods3',.5,1,10,120),mk('centroid','farve',0,1,300,600),mk('vokal','glod',.3,.8,150,500),mk('bas','bolge',.15,1,100,350),mk('rms','fart',.1,1,300,600),mk('bas','zoom',.4,.6,60,300),mk('mid','banelys',.3,.7,100,400)];
function stats(k){
 const a=F[k],n=a.length,s=Float32Array.from(a).sort(),q=p=>s[Math.min(n-1,Math.floor(n*p))];
 const contrast=q(.95)-q(.5),range=q(.95)-q(.05),lo=q(.3),thr=Math.max(.12,q(.5)+.6*(q(.97)-q(.5)));
 const ev=events(k,thr),eps=ev.length/dur,io=[];for(let i=1;i<ev.length;i++)io.push(ev[i]-ev[i-1]);
 let reg=0;if(io.length>=8){const h={};io.forEach(v=>{const b=Math.round(v/.03);h[b]=(h[b]||0)+1});const m=+Object.keys(h).sort((x,y)=>h[y]-h[x])[0]*.03;
  reg=io.filter(v=>[.5,1,2,3,4].some(r=>Math.abs(v/m-r)<.12*r)).length/io.length}
 const score=Math.round(100*(.5*reg+.5*Math.min(1,contrast/.5)));
 const cls=range<.2?'weak':(reg>=.45&&contrast>=.3&&eps>=.4&&eps<=8?'trig':'flow');
 return{contrast,range,lo,eps,reg,score,cls}}
const CLS={trig:'Takt-trigger: klodser, puls, partikler',flow:'Flydende: farve, drejning, størrelse, glød, fart',weak:'Svag: udelad eller erstat'};
function renderGuide(){
 if(!F)return;const S=BANDS.map(([k,l])=>({k,l,...stats(k)}));
 S.forEach(x=>{let mx=0,mn='';S.forEach(y=>{if(y.k!==x.k){const c=Math.abs(corr(F[x.k],F[y.k]));if(c>mx){mx=c;mn=y.l}}});x.ov=mx;x.ovn=mn});
 S.sort((a,b)=>b.score-a.score);const worst=S.slice(-3),low=[...S].sort((a,b)=>a.contrast-b.contrast).slice(0,3);
 $('guide').innerHTML=`<div style="overflow-x:auto"><table><tr><th>Lydtræk</th><th>Bedst til</th><th>I takt</th><th>Højde</th><th>Slag/s</th><th>Ligner</th></tr>
 ${S.map(x=>`<tr class="${worst.includes(x)?'dead':''}"><td>${x.l}</td><td>${CLS[x.cls]}</td><td>${x.reg?Math.round(x.reg*100)+' %':'ingen fast puls'}</td><td><span style="display:inline-block;height:8px;width:${Math.round(x.contrast*70)}px;background:var(--acc);border-radius:2px"></span> ${x.contrast.toFixed(2)}</td><td>${x.eps.toFixed(1)}</td><td>${x.ov>.8?x.ovn+' ('+x.ov.toFixed(2)+')':''}</td></tr>`).join('')}</table></div>
 <p><b>Mindst i takt i denne sang:</b> ${worst.map(x=>x.l).join(', ')}. Brug dem til blød, flydende effekter, ikke til klodser.</p>
 <p><b>Sværest at se forskel på pga. højde:</b> ${low.map(x=>x.l).join(', ')}. Sæt tærsklen lavt, eller brug dem kun til farve og glød.</p>
 <p>I takt = hvor jævnt slagene kommer. Højde = hvor langt toppene rager op over normalniveauet. Rækker i rødt er sangens svageste takt-lydtræk. Tal er vejledende og gælder kun denne sang.</p>`}
function autoListe(o){o=Object.assign({mal:2.5,flyd:5},o);
 if(!F)return null;
 const S=BANDS.map(([k])=>({k,...stats(k)})),m=[];
 const trig=S.filter(x=>x.cls==='trig').sort((a,b)=>b.score-a.score),ch=[];
 for(const x of trig)if(ch.length<Math.max(3,scene.spor)&&ch.every(c=>Math.abs(corr(F[c.k],F[x.k]))<.85))ch.push(x);
 ch.sort((a,b)=>idx(a.k)-idx(b.k));
 const tt=(k,tg)=>{let b=.5,bd=1e9;for(let t=.1;t<=.9;t+=.05){const d=Math.abs(events(k,t).length/dur-tg);if(d<bd){bd=d;b=t}}return +b.toFixed(2)};
 const th=ch.map(x=>tt(x.k,o.mal));
 ch.forEach((x,i)=>m.push(mk(x.k,'klods'+(i+1),th[i],1,8,120)));
 [['puls',0,15,220],['burst',1,10,150],['glod',2,8,90]].forEach(([e,i,a,r])=>{if(ch[i])m.push(mk(ch[i].k,e,th[i],.9,a,r))});
 const used=new Set(ch.map(x=>x.k)),flow=S.filter(x=>!used.has(x.k)&&x.cls!=='weak').sort((a,b)=>b.range-a.range);
 ['farve','fart','bolge','zoom','banelys','glod','ring','slange','slange_farve'].slice(0,o.flyd).forEach((e,i)=>{const x=flow[i];if(x)m.push(mk(x.k,e,+Math.min(.5,x.lo).toFixed(2),1,e==='fart'?250:200,e==='fart'?500:400))});
 return{m,ch}}
function autoSetup(o){if(!F){$('gmsg').textContent='Analysér en sang først.';return}const R0=autoListe(o),m=R0.m,ch=R0.ch;
 Regler.erstat(m,true);active=null;const fyldt=klodsMangler(scene.spor);if(fyldt)syncTargets();renderMaps();save();abStatus();
 $('gmsg').textContent=ch.length?'Auto-mapping: '+ch.length+' klods-spor fra '+ch.map(x=>BANDS[idx(x.k)][1]).join(', ')+(fyldt?' (og '+fyldt+' spor mere, fyldt op med lydtræk i rækkefølge)':'')+', resten af lydtrækkene som flydende effekter. Brug Gem som 1/2 for at beholde den.':'Fandt ingen tydelige takt-lydtræk i sangen. Flydende effekter er sat, men ingen klodser.'}
/* Baner uden forbindelse: har scenen flere baner end tre, mangler en fast indstilling eller en indlæst opsætning let forbindelser til bane 4 og opefter, og så kommer der ingen klodser dér. Fast 1 og 2 og Auto fylder dem nu op (klodsMangler); indlæste opsætninger siger det. */
function klodsHul(){const N=scene.spor,h=[];for(let i=1;i<=N;i++)if(!maps.some(m=>m.effect==='klods'+i))h.push(i);return h}
function klodsHulTekst(){const h=klodsHul();if(!h.length)return'';return' Spor '+(h.length===1?h[0]:h[0]+(h.length===h[h.length-1]-h[0]+1?' til ':' og flere, til ')+h[h.length-1])+' har ingen klods-forbindelse, så der kommer ingen klodser dér: træk i skyderen for antal spor, eller brug Bane og Lav klods-forbindelser.'}
function applyPreset(a){Regler.erstat(JSON.parse(JSON.stringify(a)),true);active=(a===DEFAULT?'std':null);const nye=klodsMangler(scene.spor);if(nye)syncTargets();renderMaps();meshSnap=snapStr();save();abStatus();$('gmsg').textContent='Fast indstilling indlæst.'+(nye?' '+nye+' klods-forbindelser er lavet til spor 4 og opefter (kilderne i rækkefølge: kick, snare, hihat, bas, flux, høj-mid, brilliance, vokal, mid og toner), så alle '+scene.spor+' spor får klodser.':'')}
$('auto').onclick=()=>{if(1)return;/* v9.63: Auto-mapping: Til/Fra er fjernet */autoOn=!autoOn;$('auto').textContent='Auto-mapping: '+(autoOn?'Til':'Fra');$('auto').classList.toggle('on',autoOn);if(autoOn&&F)autoSetup()};
$('autonow').onclick=()=>fsForeslaa();$('fast1').onclick=()=>applyPreset(DEFAULT);$('fast2').onclick=()=>applyPreset(FAST2);

/* ---------- Indstillinger ---------- */
let set={tol:90,fps:60,theme:'warm',felt:'neon',stoerrelse:'normal',topbar:'fuld',topdock:'fast',recOpl:'kilde',recFps:30,recLyd:true,recMaks:5,nyFigSkjult:true,nyFigValgt:false,linKilde:'mik',linEnhed:'',linNiveau:1,gentag:true,sikker:true,udkilde:'pv',vol:1,mute:false,kval:{niveau:'disco',egne:{},regulator:false,maaler:false}},lastDraw=0;try{Object.assign(set,JSON.parse(localStorage.getItem('rytme-set')))}catch(e){}set.gentag=set.gentag!==false;set.sikker=set.sikker!==false;if(!['warm','dark','light'].includes(set.theme))set.theme='warm';/* v9.72: Warm Analog i hele programmet; 'auto' og ukendte bliver til warm */if(!['lille','normal','stor','stoerre'].includes(set.stoerrelse))set.stoerrelse='normal';if(!['pv','mesh','mesh3d','oeje'].includes(set.udkilde))set.udkilde='pv';/* v9.83: Mesh 3D og Øjet huskes nu også */if(!['neon','moerk','lys','tema'].includes(set.felt))set.felt='neon';if(!['fuld','kompakt','minimal'].includes(set.topbar))set.topbar='fuld';if(!['fast','auto'].includes(set.topdock))set.topdock='fast';if(!['kilde','720','1080'].includes(set.recOpl))set.recOpl='kilde';if(![30,60].includes(set.recFps))set.recFps=30;set.recLyd=set.recLyd!==false;if(![1,5,10,30].includes(set.recMaks))set.recMaks=5;set.nyFigSkjult=set.nyFigSkjult===true;set.nyFigValgt=set.nyFigValgt===true;if(!set.nyFigValgt)set.nyFigSkjult=true;if(!['mik','fane'].includes(set.linKilde))set.linKilde='mik';if(typeof set.linEnhed!=='string'||set.linEnhed.length>300)set.linEnhed='';set.linNiveau=Number.isFinite(+set.linNiveau)?Math.max(.2,Math.min(3,+set.linNiveau)):1;set.vol=Math.max(0,Math.min(1,isFinite(+set.vol)?+set.vol:1));if(set.vol<.01)set.vol=.8;/* v3.4: en gemt lydstyrke på 0 gav et program, der startede helt stille uden forklaring; nu starter det på 80 % i stedet */set.mute=!!set.mute;set.kval=Object.assign({niveau:'disco',egne:{},regulator:false,maaler:false},set.kval);
function applySet(){const te9=set.theme==='warm'?'dark':set.theme;/* v9.72: Warm Analog bygger på det mørke tema */if(te9==='auto')delete document.documentElement.dataset.theme;else document.documentElement.dataset.theme=te9;document.documentElement.classList.toggle('tema-warm',set.theme==='warm');try{st9Anvend()}catch(e){}try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}document.documentElement.dataset.felt=set.felt;$('s-felt').value=set.felt;if(typeof tbModus==='function')tbModus();if(typeof recSync==='function')recSync();if($('s-nyfig'))$('s-nyfig').checked=!!set.nyFigSkjult;if(typeof linSync==='function')linSync();$('s-theme').value=set.theme;$('s-fps').value=set.fps;$('s-tol').value=set.tol;$('s-tv').textContent=set.tol;if($('s-gentag'))$('s-gentag').checked=set.gentag;if($('tb-gentag'))$('tb-gentag').checked=set.gentag;if(typeof plUI==='function')plUI();if(typeof sikkerUI==='function')sikkerUI()}
$('s-theme').onchange=e=>{set.theme=e.target.value;applySet()};$('s-felt').onchange=e=>{set.felt=e.target.value;applySet()};$('s-fps').onchange=e=>{set.fps=+e.target.value;applySet()};$('s-gentag').onchange=e=>{set.gentag=e.target.checked;applySet()};$('s-nyfig').onchange=e=>{set.nyFigSkjult=e.target.checked;set.nyFigValgt=true;applySet();msg(set.nyFigSkjult?'Nye figurer starter nu i kassen (skjult). Byg dem færdige i Form-editoren, og tryk Læg på scenen, når de er klar.':'Nye figurer kommer nu på scenen med det samme, på et frit sted.')};$('tb-gentag').onchange=e=>{set.gentag=e.target.checked;applySet()};$('s-tol').oninput=e=>{set.tol=+e.target.value;applySet();renderTune()};
/* Nulstil alt: se zonen OPSÆTNINGER OG SIKKERHED (egne bekræftelsesdialoger i stedet for browserens confirm, som kan være blokeret). */
$('sbtn').onclick=()=>$('sd').showModal();$('s-x').onclick=()=>$('sd').close();
$('gbtn').onclick=()=>$('gd').showModal();$('gx').onclick=()=>$('gd').close();
/* Manualen: fire faner (Brugermanual, Teknisk manual, Vision og forklaringer, Alt), en indholdsfortegnelse og søgning */
function manualTab(n){['g1','g2','g3'].forEach((g,j)=>{$(g).hidden=!(n===4||j===n-1)});[1,2,3,4].forEach(q=>$('gt'+q).className=q===n?'':'ghost');manualToc()}
function manualToc(){const it=[];['g1','g2','g3'].filter(g=>!$(g).hidden).forEach(g=>$(g).querySelectorAll('h2,h3').forEach(h=>{if(h.id&&!h.hidden)it.push('<a data-man="'+h.id+'" class="'+(h.tagName==='H2'?'t2':'t3')+'" href="#'+h.id+'">'+h.textContent.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))+'</a>')}));$('man-toc').innerHTML=it.join('')}
function manualGaa(id){const x=document.getElementById(id);if(!x)return false;const g=x.closest('#g1,#g2,#g3');if(g&&g.hidden)manualTab({g1:1,g2:2,g3:3}[g.id]);if(x.scrollIntoView)x.scrollIntoView({block:'start'});return true}
function manualSoeg(){const q=$('man-find').value.trim().toLowerCase(),sek=[];if(q&&$('gt4').className!=='')manualTab(4);
 ['g1','g2','g3'].forEach(g=>{let cur=null;[...$(g).children].forEach(el=>{if(el.tagName==='H2'||el.tagName==='H3'){cur={h:el,els:[el]};sek.push(cur)}else if(cur)cur.els.push(el)})});
 let n=0;sek.forEach(c=>{const ok=!q||c.els.map(e=>e.textContent).join(' ').toLowerCase().includes(q);c.els.forEach(e=>e.hidden=!ok&&!(e.tagName==='H2'&&!q));if(ok&&c.h.tagName==='H3')n++});
 $('man-info').textContent=q?(n?n+' afsnit passer til "'+$('man-find').value.trim()+'".':'Intet afsnit passer til "'+$('man-find').value.trim()+'".'):'';manualToc()}
[1,2,3,4].forEach(n=>$('gt'+n).onclick=()=>manualTab(n));$('man-find').addEventListener('input',manualSoeg);
$('man-toc').addEventListener('click',e=>{const a=e.target.closest('[data-man]');if(a){e.preventDefault();manualGaa(a.dataset.man)}});
$('gd').addEventListener('click',e=>{const a=e.target.closest('a[data-man]');if(a&&a.closest('#gd')&&!a.closest('#man-toc')){e.preventDefault();manualGaa(a.dataset.man)}});
document.querySelectorAll('#gd h2,#gd h3').forEach((h,i)=>{if(!h.id)h.id='man-'+h.textContent.toLowerCase().replace(/[^a-z0-9æøå]+/g,'-').replace(/^-|-$/g,'').slice(0,40)+'-'+i});
manualToc();


/* ---------- EQ-visualizer ---------- */
let eqSel=0,eqMap=-1;const peakH=[],eqc=$('eq'),eqFirst=k=>maps.findIndex(m=>m.band===k);
$('eqctl').innerHTML='<div class="ab" style="margin:0"><select id="eqmap" aria-label="Forbindelse"></select></div><div class="eqs">'+PAR.map(([f,n,a,b,st])=>`<label>${n}<input type="range" data-f="${f}" min="${a}" max="${b}" step="${st}"><b></b></label>`).join('')+'</div>';
function eqRefresh(){const sel=$('eqmap');if(!sel)return;sel.innerHTML=maps.map((m,i)=>`<option value="${i}">${esc(bandNavn(m.band))} → ${esc(effName(m.effect))}</option>`).join('')||'<option>Ingen forbindelser</option>';
 if(eqMap<0||eqMap>=maps.length)eqMap=maps.length?0:-1;if(eqMap>=0)meshSel=eqMap;sel.value=eqMap;const m=maps[eqMap];
 document.querySelectorAll('#eqctl input').forEach(r=>{r.disabled=!m;if(m){r.value=m[r.dataset.f];r.nextElementSibling.textContent=m[r.dataset.f]}})}
$('eqctl').addEventListener('input',e=>{const f=e.target.dataset.f,m=maps[eqMap];if(!f||!m)return;m[f]=+e.target.value;e.target.nextElementSibling.textContent=m[f];save()});
$('eqctl').addEventListener('change',e=>{if(e.target.id==='eqmap'){eqMap=+e.target.value;eqSel=idx(maps[eqMap].band);eqRefresh()}});
/* v9.97 (P8.14 3c): knappen Opret forbindelse på valgt lydtræk er fjernet (hvert klik lavede en ny regel uden synligt tegn); regler laves i matrixen */
let eqDrag=false;
function eqPt(e){const r=eqc.getBoundingClientRect(),W=eqc.width,H=eqc.height,x=(e.clientX-r.left)/r.width*W,y=(e.clientY-r.top)/r.height*H;return{b:Math.min(13,Math.max(0,Math.floor((x-8)/((W-16)/14)))),v:1-(y-10)/(H-34)}}
function eqThr(p){const m=maps[eqMap];if(!m||m.band!==BANDS[eqSel][0])return;m.thr=+Math.min(1,Math.max(0,p.v)).toFixed(2);save()}
eqc.addEventListener('pointerdown',e=>{const p=eqPt(e);if(armed){bindArmed(BANDS[p.b][0]);return}eqSel=p.b;const k=BANDS[p.b][0],i=eqFirst(k);if(i>=0&&!(eqMap>=0&&maps[eqMap]&&maps[eqMap].band===k))eqMap=i;eqRefresh();eqDrag=true;eqc.setPointerCapture(e.pointerId);eqThr(p)});
eqc.addEventListener('pointermove',e=>{if(eqDrag)eqThr(eqPt(e))});eqc.addEventListener('pointerup',()=>eqDrag=false);
function drawEQ(){
 const g=eqc.getContext('2d'),W=eqc.width,H=eqc.height,bw=(W-16)/14,top=10,bot=H-24,hh=bot-top,t=F?now():0;
 const bg=g.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#0b0f14');bg.addColorStop(1,'#16202c');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.strokeStyle='rgba(255,255,255,.07)';g.lineWidth=1;for(let i=0;i<=10;i++){const y=top+hh*i/10;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}
 BANDS.forEach(([k,l],i)=>{
  const v=live?(lv[k]||0):(F&&(playing||offset>0)?sample(k,t):0),x=8+i*bw,w=bw-6,seg=Math.max(5,hh/28),lit=Math.round(v*hh/seg);
  const m=(eqMap>=0&&maps[eqMap]&&maps[eqMap].band===k)?maps[eqMap]:maps.find(q=>q.band===k);peakH[i]=Math.max(v,(peakH[i]||0)-.012);
  for(let q=0;q<28;q++){const y=bot-(q+1)*seg+1,on=q<lit,lv=q/28;g.fillStyle=on?'hsl('+(130-lv*130)+' 90% '+(45+lv*10)+'%)':'rgba(255,255,255,.05)';
   if(on){g.shadowColor=g.fillStyle;g.shadowBlur=8}g.beginPath();g.roundRect?g.roundRect(x+2,y,w,seg-2,2):g.rect(x+2,y,w,seg-2);g.fill();g.shadowBlur=0}
  g.fillStyle='#fff';g.fillRect(x+2,bot-peakH[i]*hh-2,w,3);
  if(m){const ty=bot-m.thr*hh,mi=maps.indexOf(m),te=set.tilpas&&typeof TIL!=='undefined'&&TIL.eff[mi]!=null?TIL.eff[mi]:null;g.strokeStyle=te!=null?'rgba(255,255,255,.45)':'#fff';g.lineWidth=2;g.setLineDash([5,3]);g.beginPath();g.moveTo(x,ty);g.lineTo(x+bw-2,ty);g.stroke();g.setLineDash([]);if(te!=null){const ty2=bot-te*hh;g.strokeStyle='#ffb347';g.lineWidth=3;g.beginPath();g.moveTo(x,ty2);g.lineTo(x+bw-2,ty2);g.stroke()}
   g.fillStyle=v>(te!=null?te:m.thr)?'#7dffb2':'#fff';g.beginPath();g.moveTo(x+bw-2,ty);g.lineTo(x+bw-9,ty-5);g.lineTo(x+bw-9,ty+5);g.fill()}
  if(i===eqSel){g.strokeStyle='hsl('+HUE(i)+' 80% 60%)';g.lineWidth=2;g.strokeRect(x,top-4,bw-2,hh+8)}
  g.fillStyle=i===eqSel?'#fff':'#9fb0c0';g.font='11px Schibsted Grotesk,sans-serif';g.textAlign='center';g.fillText(l.split(' ')[0],x+bw/2-1,H-8)});
 g.textAlign='left'}

/* ---------- Live-analyse af generatoren ---------- */
const HL=480,lv={},lhist={},lpk={},lre=new Float32Array(2048),lim=new Float32Array(2048),lmag=new Float32Array(1024),lprev=new Float32Array(1024),ltd=new Float32Array(2048),lwin=new Float32Array(2048),lfft=makeFFT(2048),lpb={};let lpos=0;
for(let i=0;i<2048;i++)lwin[i]=.5-.5*Math.cos(2*Math.PI*i/2048);
BANDS.forEach(([k])=>{lhist[k]=new Float32Array(HL);lpk[k]=REF[k]*.5;lv[k]=0});
function liveCalc(){
 gan.getFloatTimeDomainData(ltd);const N=2048,s=gctx.sampleRate;let sq=0,zc=0,lp=0;
 for(let i=0;i<N;i++){const v=ltd[i];lre[i]=v*lwin[i];lim[i]=0;sq+=v*v;if(i&&(v>=0)!==(lp>=0))zc++;lp=v}
 lfft(lre,lim);let fl=0,sm=0,cw=0,lg=0;
 for(let i=0;i<N/2;i++){lmag[i]=Math.hypot(lre[i],lim[i])/N*4;const d=lmag[i]-lprev[i];if(d>0)fl+=d;lprev[i]=lmag[i]}
 const bin=f=>Math.min(N/2-1,Math.round(f*N/s)),top=bin(8000),fr=i=>i*s/N;
 const band=(a,z)=>{const i0=bin(a),i1=Math.max(i0+1,bin(z));let q=0;for(let i=i0;i<i1;i++)q+=lmag[i]*lmag[i];return Math.log10(1+100*Math.sqrt(q/(i1-i0)))};
 for(let i=1;i<top;i++){sm+=lmag[i];cw+=lmag[i]*fr(i);lg+=Math.log(lmag[i]+1e-9)}
 let acc=0,ro=0;for(let i=1;i<top;i++){acc+=lmag[i];if(acc>=.85*sm){ro=fr(i);break}}
 const R={bas:band(20,250),mid:band(250,2000),hmid:band(2000,6000),brill:band(6000,16000),rms:Math.sqrt(sq/N),centroid:sm>1e-6?cw/sm:0,rolloff:ro,flux:fl,flat:sm>1e-6?Math.exp(lg/(top-1))/(sm/(top-1)):0,zcr:zc/N};
 R.vokal=band(200,900)*(1-Math.min(1,R.flat*3));
 const ris=(k,v,w)=>{const o=Math.max(0,v-(lpb[k]||0))*(w||1);lpb[k]=v;return o};
 R.kick=ris('bas',R.bas);R.snare=ris('hmid',R.hmid,.5+R.zcr*8);R.hihat=ris('brill',R.brill);
 for(const[k]of BANDS){lpk[k]=Math.max(REF[k]*.5,lpk[k]*.9995,R[k]);lv[k]=Math.min(1,R[k]/lpk[k]);lhist[k][lpos]=lv[k]}
 lpos=(lpos+1)%HL}
/* Live-analyse af toner og klang (gan2, 8192 punkter). Kun når noget bruger den: en forbindelse fra en ana:-kilde, et objekt, der fødes af toner eller placeres efter en ana:-kilde, eller Analyse-vinduet. */
const lt8=new Float32Array(8192),la={},lpa={},LANA={AN:null,t:0,TS:Rytme.toneNy(),raa:null,ev:[]};
function anaBehov(){return maps.some(m=>m.band.startsWith('ana:'))||fase2.objekter.some(o=>o.liv&&o.liv.til&&(['tone','akkord','klang'].includes(o.liv.fodtAf)||['x','y','z'].some(k=>String(o.liv.plac&&o.liv.plac[k]).startsWith('ana:'))))||!($('w7')&&$('w7').classList.contains('min'))}
function liveAna(){const tt=performance.now();if(!gan2||tt-LANA.t<30)return;LANA.t=tt;if(!LANA.AN||LANA.AN.sr!==gctx.sampleRate)LANA.AN=Rytme.anaNy(gctx.sampleRate);
 gan2.getFloatTimeDomainData(lt8);const o=Rytme.anaRamme(LANA.AN,lt8);LANA.raa=o.raa;
 for(const k in o.k){const v=o.k[k];if(/^ana:ls/.test(k)){lpa[k]=Math.max(.3,(lpa[k]||0)*.9995,v);la[k]=Math.min(1,v/lpa[k])}else la[k]=v}
 {const S=LANA.AR||(LANA.AR=Rytme.artikulationNy()),ar=Rytme.artikulationTik(S,o.raa.rms,(tt-(LANA.tAR||tt-33))/1000);LANA.tAR=tt;la['ana:anslag']=ar.anslag;la['ana:legato']=ar.legato}
 {const D=LANA.DM||(LANA.DM=Rytme.dominansNy()),dd=Rytme.dominansTik(D,[lv.bas||0,lv.mid||0,lv.hmid||0,lv.brill||0],(tt-(LANA.tDM||tt-33))/1000);LANA.tDM=tt;la['ana:domBas']=dd[0];la['ana:domMid']=dd[1];la['ana:domHoej']=dd[2];la['ana:domBrill']=dd[3]}
 {const KR=LANA.KR||(LANA.KR=Rytme.karakterNy()),kk=Rytme.karakterTik(KR,{rms:lv.rms||0,flux:lv.flux||0,hmid:lv.hmid||0,brill:lv.brill||0,centroid:lv.centroid||0,rolloff:lv.rolloff||0},(tt-(LANA.tKR||tt-33))/1000);LANA.tKR=tt;la['ana:energi']=kk.energi;la['ana:lyshed']=kk.lyshed}
 const e=Rytme.toneTik(LANA.TS,o.raa.f0,o.raa.klar,gctx.currentTime);if(e)LANA.ev.push(e)}
/* ---------- Analyse-vinduet: log-spektrum (31 lydtræk), toneklasser, grundtone og klang ---------- */
function anaNu(){if(live&&anaBehov())return{k:la,f0:LANA.raa?LANA.raa.f0:0,klar:LANA.raa?LANA.raa.klar:0,kilde:'live'};
 if(A&&(playing||offset>0)){const t=now(),k={};for(const q of Rytme.ANA_KILDER)k[q.key]=sampleA(q.key,t);const i=Math.max(0,Math.min(A.f0.length-1,Math.floor(t*sr/H)));return{k,f0:A.f0[i],klar:A.klar[i],kilde:'fil'}}
 return null}
const noteNavn=f0=>{if(!(f0>0))return'–';const m=Math.round(69+12*Math.log2(f0/440));return Rytme.TONE_NAVNE[((m%12)+12)%12]+(Math.floor(m/12)-1)};
function drawAna(){const c=$('an');if(!c||c.offsetParent===null)return;/* v9.76: Analyse bor i Sang */const g=c.getContext('2d'),W=c.width,Hh=c.height,d=anaNu();g.clearRect(0,0,W,Hh);g.font='12px Schibsted Grotesk,sans-serif';g.textBaseline='top';
 if(!d){g.fillStyle=css('--mute');g.fillText('Ingen analyse endnu. Vælg en lydfil og tryk Afspil, eller tryk Afspil i Musik-generatoren.',12,12);return}
 const ink=css('--ink'),mute=css('--mute'),sw=W*.6,x0=34,bw=(sw-x0-8)/31,bot=Hh-24,top=28;g.fillStyle=mute;g.fillText('Log-spektrum (tredjedel-oktaver, 20 Hz til 20 kHz)',x0,6);
 for(let b=0;b<31;b++){const v=d.k['ana:ls'+b]||0,h=v*(bot-top);g.fillStyle='hsl('+Math.round(250-v*220)+' 70% '+(38+v*20)+'%)';g.fillRect(x0+b*bw+1,bot-h,Math.max(1,bw-2),h)}
 g.fillStyle=mute;[[0,'20'],[4,'50'],[7,'100'],[10,'200'],[14,'500'],[17,'1k'],[20,'2k'],[24,'5k'],[27,'10k'],[30,'20k']].forEach(([b,t])=>{g.textAlign='center';g.fillText(t,x0+b*bw+bw/2,bot+6)});g.textAlign='left';
 const cx0=sw+16,cw=(W-cx0-10)/12,cb=Hh*.5;let dom=0,dm=0;for(let i=0;i<12;i++){const v=d.k['ana:c'+i]||0;if(v>dm){dm=v;dom=i}}
 g.fillStyle=mute;g.fillText('Toneklasser',cx0,6);
 for(let i=0;i<12;i++){const v=d.k['ana:c'+i]||0,h=v*(cb-top);g.fillStyle=i===dom&&dm>0?'hsl('+(i*30)+' 80% 58%)':'hsl('+(i*30)+' 40% 38%)';g.fillRect(cx0+i*cw+1,cb-h,Math.max(1,cw-2),h);g.fillStyle=ink;g.textAlign='center';g.fillText(Rytme.TONE_NAVNE[i],cx0+i*cw+cw/2,cb+4)}g.textAlign='left';
 g.fillStyle=ink;g.font='800 26px Schibsted Grotesk,sans-serif';g.fillText(noteNavn(d.f0),cx0,cb+26);g.font='12px Schibsted Grotesk,sans-serif';g.fillStyle=mute;g.fillText(d.f0>0?Math.round(d.f0)+' Hz, sikkerhed '+Math.round(d.klar*100)+' %':'ingen tydelig tone',cx0+Math.min(110,cw*4),cb+34);
 [['Dissonans','ana:dissonans'],['Overtonerigdom','ana:rigdom'],['Ulige overtoner','ana:ulige'],['Spredning','ana:spredning']].forEach(([t,k],i)=>{const y=cb+66+i*20,v=d.k[k]||0;g.fillStyle=mute;g.fillText(t,cx0,y);g.fillStyle='rgba(128,128,128,.25)';g.fillRect(cx0+104,y+3,W-cx0-120,9);g.fillStyle=css('--acc');g.fillRect(cx0+104,y+3,(W-cx0-120)*v,9)})}
function drawLiveTL(g,W,Hh){const rh=Hh/BANDS.length;g.font='12px Schibsted Grotesk,sans-serif';g.textBaseline='top';
 BANDS.forEach(([k,label],i)=>{const y=i*rh,col='hsl('+HUE(i)+' 60% 42%)',h=lhist[k],ms=maps.filter(m=>m.band===k),act=ms.some(m=>lv[k]>m.thr&&lv[k]>.02);
  if(act){g.globalAlpha=.2;g.fillStyle=col;g.fillRect(0,y,W,rh);g.globalAlpha=1}
  g.strokeStyle=css('--line');g.beginPath();g.moveTo(0,y+.5);g.lineTo(W,y+.5);g.stroke();
  g.fillStyle=col;g.beginPath();g.moveTo(0,y+rh-2);for(let x=0;x<W;x++)g.lineTo(x,y+rh-2-h[(lpos+Math.floor(x/W*HL))%HL]*(rh-6));g.lineTo(W,y+rh-2);g.fill();
  ms.forEach(m=>{const ty=y+rh-2-m.thr*(rh-6);g.strokeStyle=css('--ink');g.setLineDash([4,3]);g.beginPath();g.moveTo(0,ty);g.lineTo(W,ty);g.stroke();g.setLineDash([])});
  g.fillStyle=act?css('--acc'):css('--ink');g.fillText(label+(ms.length?'  →  '+[...new Set(ms.map(m=>effName(m.effect)))].join(', '):''),6,y+3);
  g.fillStyle=col;g.fillRect(W-12,y+rh-2-lv[k]*(rh-4),8,lv[k]*(rh-4));g.strokeStyle=css('--ink');g.strokeRect(W-12,y+2,8,rh-4)});
 g.fillStyle=css('--acc');g.font='800 12px Schibsted Grotesk,sans-serif';g.fillText('LIVE: musik fra generatoren (de seneste 8 sekunder)',W-330,4)}

/* ---------- Musik-generator ---------- */
const TR=['Kick','Snare','Clap','Hihat','Åben hat','Tom','Bas','Lead'],SC=SKALAER;
const ROOTS=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'],WAVES=[['sine','Sinus'],['triangle','Trekant'],['sawtooth','Sav'],['square','Firkant']];
let gs={swing:0,root:9,scale:'minpent',bw:'sawtooth',lw:'square',cut:3000,echo:.25,dens:.5,kdec:.35,steps:16,oct:0},vol=[1,.8,.7,.5,.5,.7,.8,.6],mute=TR.map(()=>false),curGen='house';
function newPat(){return TR.map(()=>Array(32).fill(0))}
let pat=newPat(),bpm=120,gPlaying=false,gStep=0,gNext=0,gT0=0,gPlan=[],gPlanNext=0,gPlanStep=0,gPlanK=0,gPlayK=0,gTimer=null,gctx=null,gmk=null,gan=null,gan2=null,gnb=null,gShow=-1,shown=-2,kbOn=true,rec=false,live=false,lastKeyT=0;
const nbuf=c=>{const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;return b};
const noteOf=(r,v)=>v>=24?v:(r===6?36:60)+gs.root+SC[gs.scale][(v-1)%8];
function ge(){gctx=actx=actx||new (window.AudioContext||window.webkitAudioContext)();gctx.resume();if(!gmk){gmk=mkMaster(gctx,bpm);gan=gctx.createAnalyser();gan.fftSize=2048;gmk.m.connect(gan);gmk.w.connect(gan);gan2=gctx.createAnalyser();gan2.fftSize=8192;gmk.m.connect(gan2);gmk.w.connect(gan2);gnb=nbuf(gctx)}}
/* Generatorens takt: planlægger trin frem i tiden (så klodser kan kigge frem) og spiller dem, når de er tæt på. Kan kaldes af en test. */
function gTick(){if(!gPlaying||!gctx)return;planAhead(gctx.currentTime+Math.max(.12,scene.trefferlinje/scene.klodsFart+.3));
 for(const p of gPlan){if(p.k<gPlayK)continue;if(p.T>=gctx.currentTime+.12)break;playStep(gctx,gmk.m,gnb,p.T,p.s,bpm);gShow=p.s;gPlayK=p.k+1}}
function gStart(){ge();gStep=0;gT0=gctx.currentTime+.05;gNext=gT0;gPlaying=true;gPlan=[];gPlanNext=gT0;gPlanStep=0;gPlanK=0;gPlayK=0;lh.length=0;
 gTimer=setInterval(gTick,25);
 if($('gp'))$('gp').textContent='Stop';$('status').textContent='Live: generatoren styrer preview, EQ og lydtræksvisning'}
function gStop(){clearInterval(gTimer);gPlaying=false;gPlan=[];gShow=-1;if($('gp'))$('gp').textContent='Afspil';$('status').textContent='Generator stoppet'}
async function useBuffer(b){stop();offset=0;buf=b;dur=b.duration;sr=b.sampleRate;RAW=await analyze(b);applyNorm();buildPeaks();renderTune();renderGuide();showUI();showFundet();if(autoOn)autoSetup();$('play').disabled=false;$('status').textContent='Generatoren er analyseret. Tryk Afspil øverst.'}
async function renderToEditor(){const T=128,sd=60/bpm/4,oc=new OfflineAudioContext(1,Math.ceil(44100*(sd*T+1.5)),44100),m2=mkMaster(oc,bpm),nb=nbuf(oc);
 for(let i=0;i<T;i++)playStep(oc,m2.m,nb,i*sd,i%gs.steps,bpm);await useBuffer(await oc.startRendering())}
const GEN={house:['x...x...x...x...','....x.......x...','x.x.x.x.x.x.x.x.','..x...x...x...x.',124],techno:['x...x...x...x...','....x.......x..x','.x.x.x.x.x.x.x.x','..x...x...x...x.',132],brk:['x.....x...x.....','....x.......x..x','x.x.x.x.x.x.x.x.','......x.......x.',140],hip:['x.....x...x..x..','....x.......x...','x.x.x.x.x.x.x.xx','..............x.',90],trap:['x..x....x.x.....','........x.......','xxxxxxxxxxxxxxxx','..............x.',140],dnb:['x.........x.....','....x.......x...','x.x.x.x.x.x.x.x.','......x.......x.',172],disco:['x...x...x...x...','....x.......x...','x.x.x.x.x.x.x.x.','..x...x...x...x.',118]};
const cell=r=>r>5?1+Math.floor(Math.random()*8):1,pad32=a=>a.concat(Array(32-a.length).fill(0));
function drawGrid(){document.querySelectorAll('#pads .pad').forEach(p=>{const r=+p.dataset.r,q=+p.dataset.s;p.hidden=q>=gs.steps;p.classList.toggle('on',!!pat[r][q]);p.classList.toggle('m',mute[r])})}
const slotKey=n=>'rytme-song-'+n;
function slotUI(){document.querySelectorAll('[data-gl]').forEach(b=>{let f=false;try{f=!!localStorage.getItem(slotKey(b.dataset.gl))}catch(e){}b.classList.toggle('on',f)})}
function saveSong(n){try{lsGem(slotKey(n),JSON.stringify({pat,bpm,gs,vol,mute}))}catch(e){}slotUI()}
function loadSong(n){try{const d=JSON.parse(localStorage.getItem(slotKey(n)));if(!d)return;pat=TR.map((_,r)=>pad32((d.pat[r]||[]).slice(0,32)));bpm=d.bpm;Object.assign(gs,d.gs||{});vol=TR.map((_,i)=>d.vol&&d.vol[i]!==undefined?d.vol[i]:vol[i]);mute=TR.map((_,i)=>!!(d.mute&&d.mute[i]));genUI();drawGrid()}catch(e){}}
function keyOn(n){ge();lastKeyT=performance.now();voice(gctx,gmk.m,7,gctx.currentTime,n,gnb,vol[7]);
 if(rec&&gPlaying){const q=Math.round((gctx.currentTime-gT0)/(60/bpm/4))%gs.steps;pat[7][(q+gs.steps)%gs.steps]=n;drawGrid()}}
function genUI(){
 const sl=(g,n,a,b,st,v)=>`<label class="gr small">${n}<input type="range" data-g="${g}" min="${a}" max="${b}" step="${st}" value="${v}"><b>${v}</b></label>`;
 $('gen').innerHTML=`<p class="small"><b>Sådan bruger du den:</b> Tryk Afspil. Så styrer musikken Live preview, EQ og lydtræksvisningen i realtid. Vil du også have tidslinje, lydtræk-guide og Auto-mapping på dit mønster, tryk "Send til editor", og tryk derefter Afspil øverst på siden.</p>
 <div class="ab"><button id="gp">${gPlaying?'Stop':'Afspil'}</button>${sl('bpm','BPM',60,200,1,bpm)}<select data-g="steps" aria-label="Antal trin">${opts([['16','16 trin'],['32','32 trin']],String(gs.steps))}</select>${sl('swing','Swing',0,1,.05,gs.swing)}</div>
 <div class="ab"><select data-g="gen" aria-label="Genre">${opts([['house','House'],['techno','Techno'],['brk','Breakbeat'],['hip','Hip-hop'],['trap','Trap'],['dnb','Drum and bass'],['disco','Disco']],curGen)}</select>${sl('dens','Tæthed',0,1,.05,gs.dens)}<button id="gauto">Generér automatisk</button><button id="gmut" class="ghost">Muter lidt</button><button id="gclr" class="ghost">Ryd</button></div>
 <div class="ab"><select data-g="root" aria-label="Grundtone">${opts(ROOTS.map((n,i)=>[String(i),n]),String(gs.root))}</select><select data-g="scale" aria-label="Skala">${opts([['minpent','Mol-pentaton'],['major','Dur'],['minor','Mol'],['blues','Blues'],['dorian','Dorisk']],gs.scale)}</select><select data-g="bw" aria-label="Bas-lyd">${opts(WAVES,gs.bw)}</select><select data-g="lw" aria-label="Lead-lyd">${opts(WAVES,gs.lw)}</select><span class="small">toneart, skala, bas-lyd, lead-lyd</span></div>
 <div class="ab">${sl('cut','Filter',300,8000,50,gs.cut)}${sl('echo','Echo',0,.8,.05,gs.echo)}${sl('kdec','Kick-længde',.1,.8,.05,gs.kdec)}</div>
 <div id="pads">${TR.map((n,r)=>`<div class="gr"><span class="gl">${n}</span><button class="ghost mt${mute[r]?' on':''}" data-m="${r}" aria-label="Mute ${n}">M</button><input type="range" data-vr="${r}" min="0" max="1" step=".05" value="${vol[r]}" aria-label="Lydstyrke ${n}">${Array.from({length:32},(_,q)=>`<button class="pad${q%4===3?' g':''}" data-r="${r}" data-s="${q}" aria-label="${n} trin ${q+1}"></button>`).join('')}</div>`).join('')}</div>
 <div class="ab"><b class="small">Gem:</b>${[1,2,3,4,5].map(n=>`<button class="ghost" data-gs="${n}">${n}</button>`).join('')}<b class="small">Hent:</b>${[1,2,3,4,5].map(n=>`<button class="ghost" data-gl="${n}">${n}</button>`).join('')}<button id="gsend">Send til editor</button></div>
 <div class="ab"><b class="small">Keyboard:</b><button class="ghost" id="octd">Oktav −</button><button class="ghost" id="octu">Oktav +</button><span class="small">oktav ${gs.oct>0?'+':''}${gs.oct}</span><button id="grec" class="${rec?'on':''}">Optag</button><button id="gkb" class="${kbOn?'on':''}">Computertastatur: ${kbOn?'Til':'Fra'}</button></div>
 <div id="keys">${Array.from({length:25},(_,i)=>`<button class="key${[1,3,6,8,10].includes(i%12)?' b':''}" data-k="${48+i}" aria-label="Tangent ${48+i}"></button>`).join('')}</div>
 <p class="small">Spil med musen eller computerens tastatur (A til L er de hvide tangenter, W E T Y U O P de sorte). Optag lægger det, du spiller, ind i Lead-instrumentet i takt, mens musikken kører. Når computertastaturet er til, virker K og S til tuning ikke.</p>`;
 slotUI();applySet()}
$('gen').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const id=b.id;
 if(b.classList.contains('pad')){const r=+b.dataset.r,q=+b.dataset.s;pat[r][q]=pat[r][q]?0:cell(r);drawGrid()}
 else if(b.dataset.m!==undefined){const r=+b.dataset.m;mute[r]=!mute[r];b.classList.toggle('on',mute[r]);drawGrid()}
 else if(id==='gp')gPlaying?gStop():gStart();
 else if(id==='gauto')autoGen();
 else if(id==='gclr'){pat=newPat();drawGrid()}
 else if(id==='gmut'){for(let i=0;i<5;i++){const r=Math.floor(Math.random()*8),q=Math.floor(Math.random()*gs.steps);pat[r][q]=pat[r][q]?0:cell(r)}drawGrid()}
 else if(id==='octd'||id==='octu'){gs.oct=Math.max(-2,Math.min(2,gs.oct+(id==='octu'?1:-1)));genUI();drawGrid()}
 else if(id==='grec'){rec=!rec;b.classList.toggle('on',rec);if(rec&&!gPlaying)gStart()}
 else if(id==='gkb'){kbOn=!kbOn;b.classList.toggle('on',kbOn);b.textContent='Computertastatur: '+(kbOn?'Til':'Fra')}
 else if(id==='gsend'){gStop();$('status').textContent='Renderer og analyserer…';renderToEditor().catch(err=>{$('status').textContent='Programfejl: '+(err&&err.message||err)})}
 else if(b.dataset.gs!==undefined)saveSong(b.dataset.gs);
 else if(b.dataset.gl!==undefined)loadSong(b.dataset.gl)});
$('gen').addEventListener('input',e=>{const t=e.target;if(t.dataset.vr!==undefined){vol[+t.dataset.vr]=+t.value;return}const g=t.dataset.g;if(!g)return;const v=t.type==='range'?+t.value:t.value;
 if(g==='bpm'){bpm=v;if(gmk)gmk.d.delayTime.value=60/bpm*.75}else if(g==='gen')curGen=v;
 else{gs[g]=(g==='root'||g==='steps')?+v:v;if(g==='echo'&&gmk)gmk.w.gain.value=v;if(g==='steps'){gStep=0;drawGrid()}}
 if(t.type==='range'&&t.nextElementSibling)t.nextElementSibling.textContent=v});
$('gen').addEventListener('pointerdown',e=>{const k=e.target.closest('.key');if(k){keyOn(+k.dataset.k+gs.oct*12);k.classList.add('hit');setTimeout(()=>k.classList.remove('hit'),120)}});
const KM={a:0,w:1,s:2,e:3,d:4,f:5,t:6,g:7,y:8,h:9,u:10,j:11,k:12,o:13,l:14,p:15,'æ':16};
document.addEventListener('keydown',e=>{if(!kbOn||e.repeat||e.ctrlKey||e.metaKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const k=KM[e.key.toLowerCase()];if(k===undefined)return;
 keyOn(60+gs.oct*12+k);const el=document.querySelector('#keys [data-k="'+(60+k)+'"]');if(el){el.classList.add('hit');setTimeout(()=>el.classList.remove('hit'),120)}});
function stepHL(){if(gShow!==shown){shown=gShow;document.querySelectorAll('#pads .pad').forEach(p=>p.classList.toggle('now',+p.dataset.s===gShow))}}

