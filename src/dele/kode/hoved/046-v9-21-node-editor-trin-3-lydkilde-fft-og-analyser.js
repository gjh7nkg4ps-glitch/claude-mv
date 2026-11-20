/* ========== v9.21: NODE-EDITOR (TRIN 3): LYDKILDE, FFT OG ANALYSER ==========
   Trin 3 af 16 (docs/PLAN-NODE-EDITOREN.md, papirets afsnit 5.3 og 5.4): de tre første kolonner bygges.
   Lydkilde: den lydkilde, der er i brug (Lydfil, 4 spor, Lyd ind eller Generator; uden lyd: Lydfil "Ikke tilgængelig"), og de blå noder
   MIDI, Morph Pad og Tastatur, når en regel bruger dem (de tæller ikke som lydkilde).
   FFT: FFT · hurtig (2048) og FFT · fin (8192) med et liggende spektrum (dybe toner til venstre).
   Analyse: de 9 analyse-noder med én udgang (port) pr. række, som i papirets tabel 5.4. Grupper med mange udgange (de 12 toneklasser, de 31 bånd
   delt efter de fire brede bånd, Dominerer, Morph Pads cirkler) er foldet sammen; ▸ folder ud (valget huskes i set.ne.fold). Foldningen ændrer ikke reglerne.
   Links: lydkilden → FFT (fuld streg) og direkte til Styrke, Stereo, Klang (nulgennemgange), Tone og akkord (tonehøjde) og Afsnit (stiplet);
   FFT → analyserne; en analyses udgang → det lydtræk, en regel bruger; 4 spor: hvert spor direkte til sine lydtræk, Mix til analyserne.
   Tallene er de samme som motoren bruger (bandV). Spektret og de to målere læses fra en lytter (fagudtryk: AnalyserNode) på lyden, før EQ.
   Situationer: Sover (ingen lyd at analysere), Venter (mens sangen analyseres, med procent på lydkilden), Ikke tilgængelig (fx Stereo og Afsnit ved
   Lyd ind og generator). Klik i bølgeformen hopper i sangen; træk spoler. Intet i maps ændres. */
const NE3={tap:null,kilde:null,hist:{},taktI:0,taktPrev:0,frek:{}};
const NE3_GEN={house:'House',techno:'Techno',brk:'Breakbeat',hiphop:'Hip-hop',trap:'Trap',dnb:'Drum and bass',disco:'Disco'};
/* Analyserne: [nøgle, navn, visning, grundlag, rækker]. En række er [kilde, navn] eller en gruppe [':gruppe', navn, [kilder …]]. */
const NE3_LS=(a,b)=>Array.from({length:b-a+1},(_,i)=>'ana:ls'+(a+i));
const NE3_ANA=[
 ['slag','Slag-detektor','lamper','hurtig',[['kick','Kick'],['snare','Snare'],['hihat','Hihat'],['flux','Spectral flux'],['hnd:klang:slag','Hændelse · slag'],['hnd:klang:tone','Hændelse · tone'],['hnd:klang:stoej','Hændelse · støj']]],
 ['bred','Brede bånd','soejler','hurtig',[['bas','Bas 20–250 Hz'],['mid','Mid 250–2k'],['hmid','Høj-mid 2–6k'],['brill','Brilliance 6–16k'],['vokal','Vokal 200–900 Hz'],[':dom','Dominerer (eksperimentel)',['ana:domBas','ana:domMid','ana:domHoej','ana:domBrill']]]],
 ['b31','31 bånd','smalle','fin',[[':ls-bas','Bas · 11 smalle bånd',NE3_LS(0,10)],[':ls-mid','Mid · 9 smalle bånd',NE3_LS(11,19)],[':ls-hmid','Høj-mid · 5 smalle bånd',NE3_LS(20,24)],[':ls-brill','Brilliance · 6 smalle bånd',NE3_LS(25,30)]]],
 ['tone','Tone og akkord','hjul','fin',[[':c','12 toneklasser',Array.from({length:12},(_,i)=>'ana:c'+i)],['ana:toneklasse','Toneklasse'],['ana:tonestyrke','Tonestyrke'],['ana:pitch','Tonehøjde'],['ana:pitchsik','Tonesikkerhed'],['hnd:akkord','Hændelse · akkordskift'],['hnd:akkordrod','Akkordens grundtone'],['hnd:akkordmol','Dur eller mol']]],
 ['klang','Klang','kurve','begge',[['centroid','Centroid'],['flat','Flatness'],['rolloff','Rolloff'],['zcr','Zero crossing rate'],['ana:dissonans','Dissonans'],['ana:rigdom','Overtonerigdom'],['ana:ulige','Ulige overtoner'],['ana:spredning','Spektral spredning'],['ana:energi','Energi'],['ana:lyshed','Lyshed'],['ana:anslag','Anslagsskarphed'],['ana:legato','Legato-grad']]],
 ['takt','Taktslag','prikker','hurtig',[['ana:taktslag','Taktslag'],['ana:takt','Takt (første slag)'],['ana:taktfase','Taktfase'],['hnd:takt','Hændelse · taktslag'],['hnd:takt2','Hændelse · hvert 2. slag'],['hnd:takt4','Hændelse · hver takt'],['hnd:takt8','Hændelse · hver 2. takt']]],
 ['stereo','Stereo','balance','boelge',[['ana:pan','Panorering'],['ana:bredde','Stereobredde'],['ana:fase','Faselighed']]],
 ['styrke','Styrke','viser','boelge',[['rms','RMS'],['ana:peak','Peak (eksperimentel)']]],
 ['afsnit','Afsnit','afsnit','fil',[['hnd:drop','Drop eller løft'],['hnd:pause:stop','Musikken stopper'],['hnd:pause:start','Musikken starter'],['hnd:sektion','Sektionsskift']]]];
const NE3_BLAA=[['midi','MIDI',[['hnd:midi','Tangent · blink'],['hnd:midinote','Sidste tone · 0–1']]],
 ['tast','Tastatur',[['hnd:tast','Tast B']]]];
/* Hvor hver kilde kommer fra: nøgle → [node, port] */
function ne3Hjem(k){k=String(k);if(k.startsWith('stem:')){const s=k.split(':')[1];return['k:main','s:'+s]}
 for(const [id,,rows] of NE3_BLAA)for(const r of rows){if(r[0]===k)return['k:'+id,'o:'+k];if(r[2]&&r[2].includes(k))return['k:'+id,ne3Folde('k:'+id,r[0])?'g:'+r[0]:'o:'+k]}
 for(const a of NE3_ANA)for(const r of a[4]){if(r[0]===k)return['a:'+a[0],'o:'+k];if(r[2]&&r[2].includes(k))return['a:'+a[0],ne3Folde('a:'+a[0],r[0])?'g:'+r[0]:'o:'+k]}
 return null}
function ne3Folde(nk,g){const f=(set.ne&&set.ne.fold)||{};return !f[nk+'|'+g]}
function ne3Kilde(){try{if(typeof LIN!=='undefined'&&LIN.til)return{type:'lydind',navn:LIN.mode==='fane'?'Fanelyd':'Mikrofon'};
 if(typeof STEM!=='undefined'&&STEM.klar)return{type:'spor',navn:STEM.navn||'4 spor'};
 if(typeof gPlaying!=='undefined'&&gPlaying)return{type:'gen',navn:NE3_GEN[curGen]||curGen};
 const f=$('file'),fi=f&&f.files&&f.files[0];if(fi||(typeof F!=='undefined'&&F&&typeof buf!=='undefined'&&buf))return{type:'fil',navn:fi?fi.name:'Lydfil'};}catch(e){}return{type:'ingen',navn:''}}
const ne3Tid=s=>{s=Math.max(0,Math.round(+s||0));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function ne3FilInfo(){const P=typeof SHOWPROFIL!=='undefined'?SHOWPROFIL:null,d=typeof dur==='number'&&dur>0?ne3Tid(dur):'';return [d,P&&P.bpm?Math.round(P.bpm)+' BPM':'',P&&P.toneart&&P.toneart.navn?P.toneart.navn:''].filter(Boolean).join(' · ')}
function ne3Sig(){const K=ne3Kilde();let s=K.type+'|'+K.navn+'|'+JSON.stringify((set.ne&&set.ne.fold)||{});if(K.type==='fil'||K.type==='spor')s+='|'+ne3FilInfo();if(K.type==='gen')s+='|'+(typeof gs!=='undefined'?gs.dens:'');return s}
{const gl=ne2Sig;window.ne2Sig=function(){return gl()+'#'+ne3Sig()}}
/* Modellen udvides med lydkilden, FFT og analyserne. */
function ne3Udvid(R){const N=R.N,L=R.L,K=ne3Kilde();NE3.kilde=K;const add=(k,o)=>{if(!N.has(k))N.set(k,Object.assign({key:k,regler:[]},o));return N.get(k)};
 add('k:main',{kol:'lydkilde',kildeType:K.type,navn:K.navn});
 add('f:hurtig',{kol:'fft',fft:'hurtig'});add('f:fin',{kol:'fft',fft:'fin'});
 NE3_ANA.forEach(a=>add('a:'+a[0],{kol:'analyse',ana:a}));
 const brugt=new Set();N.forEach(n=>{if(n.kol==='lydtraek')brugt.add(n.band)});
 NE3_BLAA.forEach(([id,navn,rows])=>{const ks=rows.flatMap(r=>r[2]||[r[0]]);if(ks.some(k=>brugt.has(k)))add('k:'+id,{kol:'lydkilde',kildeType:id,navn,rows,blaa:true})});
 const ud=K.type==='spor'?'ud':'ud',ok=K.type!=='ingen';
 L.push({fra:'k:main',fp:ud,til:'f:hurtig',tp:'ind',kilde:'k'},{fra:'k:main',fp:ud,til:'f:fin',tp:'ind',kilde:'k'});
 [['styrke'],['stereo'],['klang'],['tone'],['afsnit']].forEach(([a])=>L.push({fra:'k:main',fp:ud,til:'a:'+a,tp:'ind',kilde:'k',stiplet:true}));
 NE3_ANA.forEach(a=>{const f=a[3];if(f==='hurtig'||f==='begge')L.push({fra:'f:hurtig',fp:'ud',til:'a:'+a[0],tp:'ind',kilde:'fft'});if(f==='fin'||f==='begge')L.push({fra:'f:fin',fp:'ud',til:'a:'+a[0],tp:'ind',kilde:'fft'});if(a[0]==='takt')L.push({fra:'f:hurtig',fp:'ud',til:'a:takt',tp:'ind',kilde:'fft'})});
 /* analysernes udgange → lydtrækkene */
 const set1=new Set();N.forEach(n=>{if(n.kol!=='lydtraek')return;const h=ne3Hjem(n.band);if(!h||!N.has(h[0]))return;const id=h[0]+'>'+h[1]+'>'+n.key;if(set1.has(id))return;set1.add(id);L.push({fra:h[0],fp:h[1],til:n.key,tp:'ind',kilde:h[0].startsWith('k:')?'k':'a',band:n.band,blaa:h[0]!=='k:main'&&h[0].startsWith('k:')});n.hjem=h[0]});
 /* dobbelte FFT-links fjernes (Taktslag) */
 const sete=new Set();for(let i=L.length-1;i>=0;i--){const l=L[i],id=l.fra+'|'+l.fp+'|'+l.til+'|'+l.tp;if(sete.has(id))L.splice(i,1);else sete.add(id)}
 return R}
{const gl=ne2Model;window.ne2Model=function(){return ne3Udvid(gl())}}
/* Rækker med udgange */
function ne3Raekker(nk,rows){return '<div class="ne-raekker">'+rows.map(r=>{if(r[2]){const lukket=ne3Folde(nk,r[0]);return '<div class="ne-r ne-r-gruppe" data-fold="'+neHtml(r[0])+'" title="'+(lukket?'Fold ud':'Fold sammen')+': '+r[2].length+' udgange. Ændrer ikke reglerne."><span class="ne-fold">'+(lukket?'▸':'▾')+'</span><span class="ne-rn">'+neHtml(r[1])+'</span><i class="ne-rb"><u></u></i>'+(lukket?'<i class="ne-port ud ne-rp" data-p="g:'+neHtml(r[0])+'"></i>':'')+'</div>'
  +(lukket?'':r[2].map(k=>'<div class="ne-r ne-r-barn" data-k="'+neHtml(k)+'"><span class="ne-rn">'+neHtml(neLtNavn(k).replace(/^Tone /,''))+'</span><i class="ne-rb"><u></u></i><i class="ne-port ud ne-rp" data-p="o:'+neHtml(k)+'"></i></div>').join(''))}
  return '<div class="ne-r" data-k="'+neHtml(r[0])+'"><span class="ne-rn">'+neHtml(r[1])+'</span><i class="ne-rb"><u></u></i><i class="ne-port ud ne-rp" data-p="o:'+neHtml(r[0])+'"></i></div>'}).join('')+'</div>'}
function ne3Aarsag(n){const K=NE3.kilde||{type:'ingen'};if(n.kol==='analyse'){const id=n.ana[0];if((id==='stereo')&&(K.type==='lydind'||K.type==='gen'))return 'Kun med en lydfil (Lyd ind og generator er mono her)';if(id==='afsnit'&&(K.type==='lydind'||K.type==='gen'))return 'Kun med en analyseret lydfil'}return ''}
function ne3NodeHtml(n){const k=n.kol,K=NE3.kilde||{type:'ingen'};let farve='var(--ne-kolonne-'+k+')',hoved='',krop='',bund='',porte='',label='',w=320,klasse='';
 if(k==='lydkilde'&&n.blaa){farve='var(--ne-kolonne-midiOgEffekter)';label=n.navn;hoved='<b class="ne-nt">'+neHtml(n.navn)+'</b><span class="ne-maerker"><span class="ne-m" title="Tæller ikke som lydkilde; kan bruges sammen med en sang.">Ikke lydkilde</span></span>';
  krop=ne3Raekker(n.key,n.rows);bund=n.kildeType==='midi'?'Kun tangenter i dag · Chrome og Edge':'Tasten B på tastaturet'}
 else if(k==='lydkilde'){const t=n.kildeType;w=(t==='fil'||t==='spor'||t==='ingen')?440:320;
  if(t==='fil'||t==='ingen'){const ext=t==='fil'?((String(n.navn).match(/\.([a-z0-9]+)$/i)||[])[1]||'').toUpperCase():'';label='Lydfil '+n.navn;
   hoved='<b class="ne-nt">Lydfil'+(ext?' · '+neHtml(ext):'')+'</b>'+(t==='fil'?'<span class="ne-vaelger ne-fnavn" title="'+neHtml(n.navn)+'">'+neHtml(n.navn)+'</span>':'');
   if(t==='ingen'){klasse=' ne-ikke';krop='<div class="ne-skaerm"><span class="ne-mtekst ne-gul">Vælg en lydfil · træk en fil ind i Lydkilde, eller tryk Vælg lydfil i bundbaren</span></div>';bund='Ikke tilgængelig: der er ingen lyd endnu'}
   else{krop='<div class="ne-skaerm ne-boelge-sk"><canvas class="ne-boelge" width="400" height="48" title="Bølgeformen: klik hopper i sangen, træk spoler."></canvas><i class="ne-hoved-streg"></i></div><div class="ne-vh"><div><span>V</span><i class="ne-rb"><u data-x="L"></u></i><b data-x="Ldb">–∞ dB</b></div><div><span>H</span><i class="ne-rb"><u data-x="R"></u></i><b data-x="Rdb">–∞ dB</b></div></div>';bund='<span data-x="info">'+neHtml(ne3FilInfo()||'Længde, tempo og toneart kommer efter analysen')+'</span>'}
   porte='<i class="ne-port ud" data-p="ud"></i>'}
  else if(t==='spor'){label='4 spor';hoved='<b class="ne-nt">4 spor</b><span class="ne-vaelger" title="'+neHtml(n.navn)+'">'+neHtml(n.navn)+'</span>';
   krop='<div class="ne-skaerm ne-spor-sk"><div class="ne-raekker">'+STEM_SPOR.map(([s,nv])=>'<div class="ne-r" data-k="stem:'+s+':rms"><span class="ne-rn">'+neHtml(nv)+'</span><i class="ne-rb"><u></u></i><i class="ne-port ud ne-rp" data-p="s:'+s+'"></i></div>').join('')+'<div class="ne-r ne-r-mix" data-k="rms"><span class="ne-rn">Mix</span><i class="ne-rb"><u></u></i><i class="ne-port ud ne-rp" data-p="ud"></i></div></div></div>';
   bund='Sporene går direkte til lydtrækkene · Mix går til analyserne · '+neHtml(ne3FilInfo())}
  else if(t==='lydind'){label='Lyd ind';hoved='<b class="ne-nt">Lyd ind</b><span class="ne-vaelger">'+neHtml(n.navn)+'</span>';krop='<div class="ne-skaerm"><div class="ne-maaler"><u class="ne-fyld" data-x="lvl"></u></div><b class="ne-tal" data-x="db">–∞</b></div>';bund='Live · ingen afsnit og ingen stereo';porte='<i class="ne-port ud" data-p="ud"></i>'}
  else if(t==='gen'){label='Generator';hoved='<b class="ne-nt">Generator</b><span class="ne-maerker"><span class="ne-m" title="Analyseres, mens den spiller.">Live</span></span>';
   const bpmN=(typeof GEN!=='undefined'&&GEN[curGen]&&GEN[curGen][4])||0;krop='<div class="ne-gen"><div><span>Genre</span><b>'+neHtml(n.navn)+'</b></div><div><span>Tempo</span><b>'+(typeof bpm!=='undefined'&&bpm?Math.round(bpm):bpmN)+' BPM</b></div><div><span>Tæthed</span><i class="ne-rb"><u style="width:'+Math.round((typeof gs!=='undefined'?+gs.dens:0)*100)+'%"></u></i></div></div><div class="ne-skaerm"><div class="ne-maaler"><u class="ne-fyld" data-x="lvl"></u></div><b class="ne-tal" data-x="db">–∞</b></div>';
   bund='Analyseres, mens den spiller (FFT 2048 og 8192) · Avanceret i Lydkilde';porte='<i class="ne-port ud" data-p="ud"></i>'}}
 else if(k==='fft'){const fin=n.fft==='fin';label='FFT '+(fin?'fin':'hurtig');hoved='<b class="ne-nt">FFT · '+(fin?'fin':'hurtig')+'</b><span class="ne-vaelger" title="Antal prøver pr. udsnit (fagudtryk: FFT-størrelse)">'+(fin?'8192':'2048')+'</span>';
  krop='<div class="ne-skaerm ne-spek-sk"><canvas class="ne-spek" width="280" height="48"></canvas></div><div class="ne-skala"><span>dybe</span><span>høje</span></div>';
  bund=fin?'5,4 Hz pr. trin · til tone, akkord og de 31 bånd':'21,5 Hz pr. trin · til slag, bånd, klang og taktslag';porte='<i class="ne-port ind" data-p="ind"></i><i class="ne-port ud" data-p="ud"></i>'}
 else if(k==='analyse'){const a=n.ana,vis=a[2];label='Analyse '+a[1];hoved='<b class="ne-nt">'+neHtml(a[1])+'</b>';
  let sk='';if(vis==='lamper')sk='<span class="ne-lamper">'+['kick','snare','hihat'].map(b=>'<i class="ne-lampe" data-k="'+b+'" title="'+b+'"></i>').join('')+'</span>';
  else if(vis==='soejler')sk='<span class="ne-soejler">'+['bas','mid','hmid','brill'].map(b=>'<i data-k="'+b+'"><u></u></i>').join('')+'</span>';
  else if(vis==='smalle')sk='<span class="ne-soejler ne-tynde">'+NE3_LS(0,30).map(b=>'<i data-k="'+b+'"><u></u></i>').join('')+'</span>';
  else if(vis==='prikker')sk='<span class="ne-prikker">'+[0,1,2,3].map(i=>'<i class="ne-lampe" data-i="'+i+'"></i>').join('')+'</span>';
  else if(vis==='balance')sk='<span class="ne-balance"><i class="ne-bredde"></i><i class="ne-bal-midt"></i><i class="ne-bal-prik"></i></span>';
  else if(vis==='afsnit')sk='<span class="ne-mtekst" data-x="afsnit">–</span><i class="ne-lampe" data-k="hnd:drop" title="Drop eller løft"></i>';
  else sk='<canvas class="ne-vis" data-vis="'+vis+'" width="260" height="40"></canvas>';
  krop='<div class="ne-skaerm ne-ana-sk">'+sk+'</div>'+ne3Raekker(n.key,a[4]);
  const gr={hurtig:'FFT · hurtig',fin:'FFT · fin',begge:'FFT · hurtig og fin, lydbølgen og andre lydtræk',boelge:'lydbølgen (uden FFT)',fil:'RMS og afsnittene fra analysen af filen'}[a[3]]+(a[0]==='tone'?' · tonehøjde med McLeod-metoden på lydbølgen':'');
  const aa=ne3Aarsag(n);if(aa)klasse=' ne-ikke';bund=aa?'<span class="ne-gul">Ikke tilgængelig: '+neHtml(aa)+'</span>':'Bygger på '+neHtml(gr);porte='<i class="ne-port ind" data-p="ind"></i>'}
 return '<div class="ne-node ne-n-'+k+klasse+'" data-n="'+neHtml(n.key)+'" tabindex="0" role="button" aria-label="'+neHtml(label)+'" style="--nf:'+farve+';width:'+w+'px"><div class="ne-nh">'+hoved+'</div>'+krop+'<div class="ne-bund">'+bund+'</div>'+porte+'</div>'}
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){return (n.kol==='lydkilde'||n.kol==='fft'||n.kol==='analyse')?ne3NodeHtml(n):gl(n)}}
/* Porte på rækkerne */
{const gl=ne2Porte;window.ne2Porte=function(n){gl(n);const el=n.el;if(!el||!n.porte)return;el.querySelectorAll('.ne-rp').forEach(p=>{const r=p.closest('.ne-r');let y=0,e=r;while(e&&e!==el){y+=e.offsetTop;e=e.offsetParent}if(e!==el){y=r.getBoundingClientRect().top-el.getBoundingClientRect().top}const ty=y+r.offsetHeight/2;p.style.top=(ty-6)+'px';n.porte[p.dataset.p]=[n.w,ty]});}}
/* Placering af de tre første kolonner: lydkilde øverst, FFT ud for lydkilden, analyserne i papirets rækkefølge. */
{const gl=ne2Placer;window.ne2Placer=function(){gl();const G=+NE.tema.maal.gitter||8,MELLEM=3*G,N=NE2.N,kolX={};NE.kol.forEach(c=>kolX[c.k]=c.x);const P=NE.pos||{};
 const H=n=>{const h=n.el?n.el.offsetHeight:0;return h>0?Math.ceil(h/G)*G:(n.kol==='analyse'?200:120)};
 const stak=(keys,y0)=>{let y=y0;keys.forEach(k=>{const n=N.get(k);if(!n)return;const p=P[n.key];n.x=p&&Number.isFinite(p[0])?p[0]:kolX[n.kol];n.y=p&&Number.isFinite(p[1])?p[1]:y;n.flyttet=!!p;y+=H(n)+MELLEM})};
 stak(['k:main','k:midi','k:tast'],0);stak(['f:hurtig','f:fin'],0);stak(NE3_ANA.map(a=>'a:'+a[0]),0);
 NE2.hoejde=Math.max(NE2.hoejde||0,...[...N.values()].map(n=>(n.y||0)+H(n)))}}
/* Den valgte kæde går også op til analysen, FFT og lydkilden, og ned fra en analyse til dens lydtræk og regler. */
{const gl=ne2Kaede;window.ne2Kaede=function(){gl();const N=NE2.N,k=NE2.valgt;if(!k)return;const n=N.get(k);if(!n)return;let S=NE2.kaede||new Set([k]);
 const op=lt=>{const l=N.get(lt);if(!l||!l.hjem)return;S.add(l.hjem);if(l.hjem.startsWith('a:')){const a=N.get(l.hjem);S.add('k:main');if(a&&a.ana){const f=a.ana[3];if(f==='hurtig'||f==='begge')S.add('f:hurtig');if(f==='fin'||f==='begge')S.add('f:fin')}}else if(l.hjem==='k:main')S.add('k:main')};
 const medRegel=rk=>{const r=N.get(rk);if(!r)return;[rk,r.lt,r.gate,r.figur,r.maal].forEach(x=>x&&S.add(x))};
 if(n.kol==='analyse'||n.kol==='fft'||n.kol==='lydkilde'){S=new Set([k]);const fra=new Set([k]);if(n.kol==='fft'){S.add('k:main');N.forEach(a=>{if(a.kol==='analyse'&&NE2.L.some(l=>l.fra===k&&l.til===a.key)){S.add(a.key);fra.add(a.key)}})}
  if(n.kol==='lydkilde'&&!n.blaa){N.forEach(x=>{if(x.kol==='fft'||x.kol==='analyse'){S.add(x.key);fra.add(x.key)}})}if(n.kol==='analyse'){S.add('k:main');NE2.L.forEach(l=>{if(l.til===k&&l.kilde==='fft')S.add(l.fra)})}
  NE2.L.forEach(l=>{if(fra.has(l.fra)&&N.get(l.til)&&N.get(l.til).kol==='lydtraek'){S.add(l.til);const lt=N.get(l.til);lt.regler.concat(lt.gates||[]).forEach(medRegel)}})}
 else [...S].forEach(x=>{const q=N.get(x);if(q&&q.kol==='lydtraek')op(x)});
 NE2.kaede=S;N.forEach(q=>q.el&&q.el.classList.toggle('ne-valgt',q.key===k))}}
{const gl=ne2Hoveder;window.ne2Hoveder=function(){gl();const N=[...NE2.N.values()],K=NE3.kilde||{type:'ingen'},s=(k,t,tip)=>{const h=document.querySelector('#ne-hoveder .ne-hoved[data-kol="'+k+'"] .ne-naar');if(h){h.textContent=t;h.title=tip||''}};
 const blaa=N.filter(n=>n.kol==='lydkilde'&&n.blaa).map(n=>n.navn);s('lydkilde',({fil:'Lydfil',spor:'4 spor',lydind:'Lyd ind',gen:'Generator',ingen:'Ingen lyd endnu'}[K.type])+(blaa.length?' + '+blaa.join(', '):''),'Én lydkilde ad gangen; MIDI og Tastatur tæller ikke med');
 s('fft','2 FFT · hurtig og fin');s('analyse','9 analyser · '+N.filter(n=>n.kol==='lydtraek'&&n.hjem&&n.hjem.startsWith('a:')).length+' udgange i brug')}}
/* Sætningen i kontrolpanelet */
{const gl=ne2Saetning;window.ne2Saetning=function(n){const b=(t,k)=>'<b class="ne-s-'+k+'">'+neHtml(t)+'</b>',K=NE3.kilde||{type:'ingen'};
 const brugt=key=>NE2.L.filter(l=>l.fra===key&&NE2.N.get(l.til)&&NE2.N.get(l.til).kol==='lydtraek').map(l=>neLtNavn(NE2.N.get(l.til).band));
 if(n.kol==='lydkilde'&&n.blaa){const u=brugt(n.key);return b(n.navn,'lydtraek')+' tæller ikke som lydkilde og kan bruges sammen med en sang. '+(u.length?'Reglerne bruger: '+neHtml(u.join(', '))+'.':'')}
 if(n.kol==='lydkilde'){if(n.kildeType==='ingen')return 'Der er ingen lyd endnu. Vælg en lydfil, start generatoren eller tænd Lyd ind. Indtil da sover FFT og analyserne.';
  const navn={fil:'filen '+n.navn,spor:'de 4 spor ('+n.navn+')',lydind:'Lyd ind ('+n.navn+')',gen:'generatoren ('+n.navn+')'}[n.kildeType];
  return 'Lyden kommer fra '+b(navn,'lydtraek')+(n.kildeType==='fil'||n.kildeType==='spor'?' ('+neHtml(ne3FilInfo())+')':'')+'. Den går til '+b('FFT · hurtig','maal')+' og '+b('FFT · fin','maal')+', og direkte (stiplet) til Styrke, Stereo, Klang (nulgennemgange), Tone og akkord (tonehøjde) og Afsnit.'+(n.kildeType==='spor'?' Hvert spor går direkte til sine lydtræk; Mix går til analyserne.':'')+(n.kildeType==='fil'?' Klik i bølgeformen for at hoppe i sangen.':'')}
 if(n.kol==='fft'){const fin=n.fft==='fin';return b('FFT · '+(fin?'fin':'hurtig'),'maal')+' (fagudtryk: Fast Fourier Transform) deler lyden op i frekvenser: '+(fin?'8192 prøver pr. udsnit, 5,4 Hz pr. trin. Præcis i tonerne, men langsommere. Bruges af 31 bånd, Tone og akkord og Klang.':'2048 prøver pr. udsnit, 21,5 Hz pr. trin. Reagerer hurtigt. Bruges af Slag-detektor, Brede bånd, Klang og Taktslag. Under 50 Hz er det groft.')}
 if(n.kol==='analyse'){const a=n.ana,u=brugt(n.key),gr={hurtig:'FFT · hurtig',fin:'FFT · fin',begge:'FFT · hurtig og fin, lydbølgen og andre lydtræk',boelge:'lydbølgen direkte fra lydkilden',fil:'styrken (RMS) og afsnittene fra analysen af filen'}[a[3]];
  const antal=a[4].reduce((s,r)=>s+(r[2]?r[2].length:1),0),aa=ne3Aarsag(n);
  return (aa?'<span class="ne-gul">Ikke tilgængelig: '+neHtml(aa)+'.</span> ':'')+b(a[1],'maal')+' bygger på '+neHtml(gr)+' og har '+antal+' udgange. '+(u.length?'Reglerne bruger: '+neHtml(u.join(', '))+'.':'Ingen regler bruger den endnu.')+(a[0]==='takt'?' Taktslag: ½×, 2×, Tap og Første slag nu findes i dag i Show-vinduet.':'')}
 return gl(n)}}
/* Lytteren på lyden (før EQ) til spektret og de to målere, når lyden er en fil eller 4 spor. Generator og Lyd ind bruger programmets egne lyttere (gan, gan2). */
function ne3Tap(){const K=NE3.kilde||{type:'ingen'};if(K.type==='gen'||K.type==='lydind'){if(typeof gan==='undefined'||!gan)return null;return{h:gan,f:gan2,L:gan,R:null}}
 if(typeof UDG==='undefined'||!UDG||!UDG.pre)return null;if(NE3.tap&&NE3.tap.ctx===UDG.ctx)return NE3.tap;try{const c=UDG.ctx,h=c.createAnalyser(),f=c.createAnalyser(),sp=c.createChannelSplitter(2),L=c.createAnalyser(),R=c.createAnalyser();
  h.fftSize=2048;f.fftSize=8192;h.smoothingTimeConstant=f.smoothingTimeConstant=.55;L.fftSize=R.fftSize=1024;UDG.pre.connect(h);UDG.pre.connect(f);UDG.pre.connect(sp);sp.connect(L,0);sp.connect(R,1);NE3.tap={ctx:c,h,f,L,R}}catch(e){NE3.tap=null}return NE3.tap}
function ne3Db(an){if(!an)return -Infinity;const b=NE3.tb||(NE3.tb=new Float32Array(1024));an.getFloatTimeDomainData(b.length<=an.fftSize?b:b.subarray(0,an.fftSize));let s=0;for(let i=0;i<b.length;i++)s+=b[i]*b[i];const r=Math.sqrt(s/b.length);return r>1e-5?20*Math.log10(r):-Infinity}
const ne3DbTxt=d=>Number.isFinite(d)?(d<0?'−':'')+Math.abs(d).toFixed(1).replace('.',',')+' dB':'–∞ dB';
function ne3Spek(c,an,fin){const g=c.getContext('2d'),fz=c._f||1,W=c.width/fz,H=c.height/fz,F=NE2.farver;g.setTransform(fz,0,0,fz,0,0);g.clearRect(0,0,W,H);const n=fin?48:24;let d=null;
 if(an&&(typeof playing!=='undefined'&&playing||typeof live!=='undefined'&&live)){d=NE3.frek[an.fftSize]||(NE3.frek[an.fftSize]=new Uint8Array(an.frequencyBinCount));an.getByteFrequencyData(d)}
 const sr=(an&&an.context&&an.context.sampleRate)||44100,bw=sr/((an&&an.fftSize)||(fin?8192:2048)),gr=g.createLinearGradient(0,H,0,0);gr.addColorStop(0,F.g0);gr.addColorStop(.45,F.g1);gr.addColorStop(.8,F.g2);gr.addColorStop(1,F.g3);g.fillStyle=gr;
 for(let i=0;i<n;i++){const f0=30*Math.pow(16000/30,i/n),f1=30*Math.pow(16000/30,(i+1)/n);let m=0;if(d){const a=Math.max(1,Math.floor(f0/bw)),b=Math.max(a+1,Math.ceil(f1/bw));for(let j=a;j<b&&j<d.length;j++)m=Math.max(m,d[j])}const h=Math.max(1,m/255*H),x=i*W/n;g.fillRect(x+1,H-h,W/n-2,h)}}
function ne3Vis(c,vis,v){const g=c.getContext('2d'),fz=c._f||1,W=c.width/fz,H=c.height/fz,F=NE2.farver;g.setTransform(fz,0,0,fz,0,0);g.clearRect(0,0,W,H);
 if(vis==='kurve'){const h=NE3.hist.klang||(NE3.hist.klang=[]);h.push(v);if(h.length>90)h.shift();g.strokeStyle=F.analyse;g.lineWidth=2;g.beginPath();h.forEach((y,i)=>{const x=i/89*W,yy=H-3-Math.min(1,y)*(H-6);i?g.lineTo(x,yy):g.moveTo(x,yy)});g.stroke()}
 else if(vis==='viser'){g.lineWidth=5;g.lineCap='round';g.strokeStyle=F.skaerm;g.beginPath();g.arc(W/2,H-4,H-10,Math.PI,2*Math.PI);g.stroke();g.strokeStyle=F.analyse;g.beginPath();g.arc(W/2,H-4,H-10,Math.PI,Math.PI*(1+Math.min(1,v)));g.stroke()}
 else if(vis==='hjul'){const cx=W/2,cy=H/2,R=H/2-3;for(let i=0;i<12;i++){let x=0;try{x=+bandV('ana:c'+i)||0}catch(e){}const a=-Math.PI/2+i*Math.PI/6;g.fillStyle=x>.5?F['t:tone']:F.skaerm;g.globalAlpha=.25+.75*Math.min(1,x);g.beginPath();g.arc(cx+Math.cos(a)*R*.78,cy+Math.sin(a)*R*.78,3.2,0,7);g.fill()}g.globalAlpha=1;
  let tk=0;try{tk=+bandV('ana:toneklasse')||0}catch(e){}g.fillStyle=F.svag;g.font='600 11px '+(getComputedStyle($('ne')).getPropertyValue('--ne-skrift-tekst-familie')||'sans-serif');g.textAlign='center';g.textBaseline='middle';try{g.fillText(TONE_NAVNE[Math.round(tk*11)]||'',cx,cy)}catch(e){}}}
/* Levende tal for de tre kolonner (kaldes fra ne2Tik, højst 30 gange i sekundet, kun når Node-editoren kan ses). */
function ne3Tik(t){const N=NE2.N,K=NE3.kilde||{type:'ingen'},v=k=>{try{const x=+bandV(k);return Number.isFinite(x)?Math.max(0,Math.min(1,x)):0}catch(e){return 0}},pct=x=>(Math.max(0,Math.min(1,x))*100).toFixed(1)+'%';
 const sover=K.type==='ingen',venter=!!NE2.analyserer;let procent='';if(venter){const m=String(($('status')||{}).textContent||'').match(/(\d+)\s*%/);procent=m?m[1]+' %':''}
 const tap=sover?null:ne3Tap();
 N.forEach(n=>{const el=n.el;if(!el||!(n.kol==='lydkilde'||n.kol==='fft'||n.kol==='analyse'))return;
  if(!n.blaa){el.classList.toggle('ne-sover',sover&&n.kol!=='lydkilde');el.classList.toggle('ne-venter',venter&&n.kol!=='lydkilde')}
  el.querySelectorAll('.ne-r[data-k]').forEach(r=>{const x=v(r.dataset.k),u=r.querySelector('.ne-rb u');if(u&&u.style.width!==pct(x))u.style.width=pct(x)});
  el.querySelectorAll('.ne-r-gruppe').forEach(r=>{const a=n.ana||NE3_BLAA.find(b=>'k:'+b[0]===n.key);const rows=a?(a[4]||a[2]):[],g=rows.find(q=>q[0]===r.dataset.fold);if(!g)return;const x=Math.max(...g[2].map(v)),u=r.querySelector('.ne-rb u');if(u)u.style.width=pct(x)});
  if(n.kol==='lydkilde'&&!n.blaa){const b=el.querySelector('[data-x="info"]');if(b){const s=venter?'Analyserer … '+procent:(ne3FilInfo()||'');if(b.textContent!==s)b.textContent=s}
   el.classList.toggle('ne-analyserer',venter);
   const c=el.querySelector('.ne-boelge');if(c){if(!n.boelgeTegnet&&typeof peaks!=='undefined'&&peaks&&peaks.rms){const g=c.getContext('2d'),fz=c._f||1,W=c.width/fz,H=c.height/fz,p=peaks.rms,F2=NE2.farver;g.setTransform(fz,0,0,fz,0,0);g.clearRect(0,0,W,H);g.fillStyle=F2.lydkilde;const mx=Math.max(1e-6,...p);for(let x=0;x<W;x+=2){const i=Math.floor(x/W*p.length),h=Math.max(1,p[i]/mx*(H-4));g.fillRect(x,(H-h)/2,1.4,h)}n.boelgeTegnet=true}
    const st=el.querySelector('.ne-hoved-streg'),tt=typeof now==='function'&&typeof dur==='number'&&dur>0?now()/dur:0;if(st)st.style.left=pct(tt)}
   if(tap){const L=ne3Db(tap.L),R=tap.R?ne3Db(tap.R):L,mx=d=>Number.isFinite(d)?Math.max(0,Math.min(1,(d+60)/60)):0;const sx=(k,s)=>{const e=el.querySelector('[data-x="'+k+'"]');if(e&&e.textContent!==s)e.textContent=s},sw=(k,x)=>{const e=el.querySelector('[data-x="'+k+'"]');if(e)e.style.width=pct(x)};
    const spil=(typeof playing!=='undefined'&&playing)||(typeof live!=='undefined'&&live);sw('L',spil?mx(L):0);sw('R',spil?mx(R):0);sx('Ldb',spil?ne3DbTxt(L):'–∞ dB');sx('Rdb',spil?ne3DbTxt(R):'–∞ dB');sw('lvl',spil?mx(L):0);sx('db',spil&&Number.isFinite(L)?Math.round(L)+'':'–∞')}}
  if(n.kol==='fft'){const c=el.querySelector('.ne-spek');if(c)ne3Spek(c,tap?(n.fft==='fin'?tap.f:tap.h):null,n.fft==='fin');n.vNu=v('rms')}
  if(n.kol==='analyse'){const a=n.ana,vis=a[2];n.vNu=Math.max(0,...a[4].flatMap(r=>r[2]||[r[0]]).slice(0,6).map(v));
   if(vis==='lamper')el.querySelectorAll('.ne-lampe').forEach(l=>l.classList.toggle('ne-taendt',v(l.dataset.k)>.5));
   else if(vis==='soejler'||vis==='smalle')el.querySelectorAll('.ne-soejler i').forEach(s=>{const u=s.firstChild;if(u)u.style.height=pct(v(s.dataset.k))});
   else if(vis==='prikker'){const ts=v('ana:taktslag'),tk=v('ana:takt');if(ts>.5&&NE3.taktPrev<=.5)NE3.taktI=tk>.5?0:(NE3.taktI+1)%4;NE3.taktPrev=ts;el.querySelectorAll('.ne-prikker .ne-lampe').forEach(l=>l.classList.toggle('ne-taendt',+l.dataset.i===NE3.taktI&&ts>.15))}
   else if(vis==='balance'){const p=el.querySelector('.ne-bal-prik'),b=el.querySelector('.ne-bredde');if(p)p.style.left=pct(v('ana:pan'));if(b)b.style.width=pct(v('ana:bredde'))}
   else if(vis==='afsnit'){const e=el.querySelector('[data-x="afsnit"]');let s='–';try{const P=SHOWPROFIL,tt=now();if(P&&P.sektioner&&P.sektioner.length){const i=P.sektioner.findIndex(x=>tt>=x.t0&&tt<(x.t1==null?1e9:x.t1));s='Afsnit '+(i+1)+' af '+P.sektioner.length}}catch(e){}if(e&&e.textContent!==s)e.textContent=s;const l=el.querySelector('.ne-lampe');if(l)l.classList.toggle('ne-taendt',v('hnd:drop')>.3)}
   else{const c=el.querySelector('.ne-vis');if(c)ne3Vis(c,vis,vis==='kurve'?v('centroid'):v('rms'))}}});
 NE2.L.forEach(l=>{if(l.band)l.vNu=v(l.band);else if(l.kilde==='k'||l.kilde==='fft')l.vNu=sover?0:v('rms')})}
/* Klik i bølgeformen hopper i sangen; træk spoler. Fold ▸ ▾ på en gruppe af udgange. */
function ne3Start(){const v=$('ne-verden');if(!v)return;
 v.addEventListener('pointerdown',e=>{const c=e.target.closest('.ne-boelge');if(!c||e.button>0)return;e.stopPropagation();e.preventDefault();const hop=ev=>{const r=c.getBoundingClientRect(),x=Math.max(0,Math.min(1,(ev.clientX-r.left)/r.width));if(typeof dur==='number'&&dur>0&&typeof tlSpring==='function')tlSpring(x*dur)};hop(e);
  try{c.setPointerCapture(e.pointerId)}catch(x){}const mv=ev=>hop(ev),op=()=>{c.removeEventListener('pointermove',mv);c.removeEventListener('pointerup',op)};c.addEventListener('pointermove',mv);c.addEventListener('pointerup',op)},true);
 v.addEventListener('click',e=>{const r=e.target.closest('.ne-r-gruppe');if(!r)return;const nd=r.closest('.ne-node');if(!nd)return;set.ne=set.ne||{};const f=set.ne.fold=set.ne.fold||{},k=nd.dataset.n+'|'+r.dataset.fold;if(f[k])delete f[k];else f[k]=true;neGem();ne2Byg()})}
/* Når en analyse starter, bygges noderne om med det samme (lydkilden skifter til Lydfil og viser procent). */
{const gl=window.analyze;if(typeof gl==='function')window.analyze=async function(){NE2.tSig=0;try{if(NE2.byg)setTimeout(()=>{if(NE2.snavs||ne2Sig()!==NE2.sig)ne2Byg()},0)}catch(e){}return gl.apply(this,arguments)}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne3Start);else setTimeout(ne3Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 3): LYDKILDE, FFT OG ANALYSER ========== */
