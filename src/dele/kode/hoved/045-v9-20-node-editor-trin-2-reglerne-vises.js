/* ========== v9.20: NODE-EDITOR (TRIN 2): REGLERNE VISES ==========
   Trin 2 af 16 (docs/PLAN-NODE-EDITOREN.md): noderne Lydtræk → Regel → Figur → Mål og linjerne mellem dem bygges ud fra maps (forbindelserne).
   Kun til at se på: intet i maps ændres. Indstillinger rettes stadig i Mapping og Router, og noderne følger med.
   Én Regel-node pr. forbindelse; én Lydtræk-node pr. kilde (også gatens kilde, m.port); én Figur-node pr. figur og én pr. effekt-gruppe
   (Dublets grupper: Scene-effekter, Lys og former, Bane, Efterspil og orden, Lyd); én Mål-node pr. mål (m.effect).
   Handling eller Egenskab læses ud fra målet: en figurs egenskab (obj:…) følger lyden (Egenskab); effekter, klodser, lyde og fødsel slår til (Handling).
   Levende tal: Lydtræk = bandV(kilden); Regel = R2M.v (ind, efter vend om), R2M.thr (tærsklen, også Adaptiv), R2M.ud og R2M.port (gaten) fra motoren;
   Mål = den største ud af dens regler (sådan regner motoren i dag: Største); Figur = den største af dens mål.
   Placering: automatisk (kolonnerne fra trin 1, noder stablet i trin af 8 punkter, figurer, mål og lydtræk ud for deres regler).
   En node, man har flyttet, bliver, hvor den står (set.ne.pos). En regels nøgle er kilde|mål|nummer, fordi forbindelserne endnu ikke har et fast id
   (det kommer, når reglerne kan ændres i Node-editoren). Linjerne tegnes på et lærred (Canvas 2D, fagudtryk) under noderne i temaets farver.
   Situationer: Normal, Valgt (hvid kant og glød, kæden lyser hvidt), Flyttes (løftet), Venter (mens sangen analyseres), Slukket (forbindelsen er slået fra).
   Kontrolpanelet viser sætningen, signalet over tid (de sidste 2 sekunder, fra motoren) og kædens indstillinger. */
const NE2={byg:false,sig:'',N:new Map(),L:[],valgt:null,kaede:null,raf:0,t:0,tSig:0,tKp:0,farver:{},traek:null};
const neTal=x=>(Number.isFinite(+x)?+x:0).toFixed(2).replace('.',',');
const neHtml=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
/* Lydtrækkets type efter temaets "lydtraekType" (slag, bånd, takt, styrke, tone, vokal, klang, stereo). */
function neLtType(k){k=String(k);if(k.startsWith('stem:'))k=stemFeat(k);
 if(/^(kick|snare|hihat|flux)$/.test(k)||/^hnd:(klang|midi|tast|pad)/.test(k))return 'slag';
 if(/^(bas|mid|hmid|brill)$/.test(k)||/^ana:(ls\d+|dom)/.test(k))return 'baand';
 if(/^ana:(taktslag|takt|taktfase)$/.test(k)||/^hnd:(takt|sektion|drop|pause)/.test(k))return 'takt';
 if(/^(rms)$/.test(k)||/^ana:(peak|energi)$/.test(k))return 'styrke';
 if(/^ana:(c\d+|pitch|pitchsik|toneklasse|tonestyrke)$/.test(k)||/^hnd:akkord/.test(k)||/^hnd:midinote/.test(k))return 'tone';
 if(k==='vokal')return 'vokal';
 if(/^ana:(pan|bredde|fase)$/.test(k))return 'stereo';
 return 'klang'}
function neLtNavn(k){let n='';try{n=bandNavn(k)}catch(e){n=k}n=String(n||k);if(String(k).startsWith('stem:')){const d=n.split(' · ');if(d.length===2)n=d[1]+' · '+d[0]}return n}
function neMaalNavn(e){e=String(e);const t=(typeof TARGETS!=='undefined'?TARGETS:[]).find(x=>x.id===e);
 if(e.startsWith('obj:')){const p=e.split(':')[3];return (typeof PROPS!=='undefined'&&PROPS[p])?PROPS[p][0]:(t?t.navn:p)}
 if(e.startsWith('liv:'))return 'Fødsel';
 return (typeof DUB_KORT!=='undefined'&&DUB_KORT[e])||(t&&t.navn)||(typeof effName==='function'?effName(e):e)}
const NE2_GRUPPE={'Scene':'Scene-effekter','Lys og former':'Lys og former','Bane':'Bane','Efterspil og orden':'Efterspil og orden','Lyd':'Lyd'};
const NE2_GRUPPER=['Scene-effekter','Lys og former','Bane','Efterspil og orden','Lyd','Andre effekter'];
function neFigurAf(e){e=String(e);if(e.startsWith('obj:')||e.startsWith('liv:')){const id=e.split(':')[1],o=(fase2.objekter||[]).find(x=>x.id===id);return{key:'f:'+id,navn:o?o.navn:id,obj:o||null,gruppe:false}}
 const g=/^klods\d+$/.test(e)?'Bane':e.startsWith('lyd:')?'Lyd':(typeof DUB_KASSE!=='undefined'&&DUB_KASSE[e])||'',n=NE2_GRUPPE[g]||'Andre effekter';return{key:'g:'+n,navn:n,obj:null,gruppe:true}}
function neErEgenskab(e){return String(e).startsWith('obj:')}
function neEgRange(e){const d=String(e).split(':');try{const o=fase2.objekter.find(x=>x.id===d[1]),q=o&&o.lag[+d[2]]&&o.lag[+d[2]].egenskaber&&o.lag[+d[2]].egenskaber[d[3]];if(q&&Number.isFinite(+q.fra)&&Number.isFinite(+q.til)){const f=x=>String(Math.round(+x*100)/100).replace('.',',');return f(q.fra)+'–'+f(q.til)+(d[3]==='rotation'?'°':'')}}catch(e){}return ''}
/* Venter: mens en sang (eller generatorens lyd) analyseres. analyze() pakkes ind, så det kan ses, hvornår den kører. */
function neVenter(){return NE2.analyserer===true}/* v9.70: 'trin2' dæmper kun FFT og analyserne (ne3Tik) */
{const gl=window.analyze;if(typeof gl==='function')window.analyze=async function(){NE2.analyserer=true;try{return await gl.apply(this,arguments)}finally{NE2.analyserer=false}}}
/* Modellen: noder og linjer ud fra maps. */
function ne2Model(){const N=new Map(),L=[],taal={};const add=(k,o)=>{if(!N.has(k))N.set(k,Object.assign({key:k,regler:[]},o));return N.get(k)};
 maps.forEach((m,i)=>{const par=m.band+'|'+m.effect;taal[par]=(taal[par]||0)+1;const rk='r:'+par+'|'+taal[par],fg=neFigurAf(m.effect),mk='m:'+m.effect;
  add('l:'+m.band,{kol:'lydtraek',band:m.band}).regler.push(rk);
  if(m.port){const g=add('l:'+m.port,{kol:'lydtraek',band:m.port});g.gates=(g.gates||[]).concat(rk)}
  const f=add(fg.key,{kol:'figur',navn:fg.navn,obj:fg.obj,gruppe:fg.gruppe,maal:[]});f.regler.push(rk);if(!f.maal.includes(mk))f.maal.push(mk);
  add(mk,{kol:'maal',effect:m.effect,figur:fg.key,gruppe:fg.gruppe}).regler.push(rk);
  add(rk,{kol:'regel',i,m,lt:'l:'+m.band,gate:m.port?'l:'+m.port:null,figur:fg.key,maal:mk});
  L.push({fra:'l:'+m.band,fp:'ud',til:rk,tp:'ind',type:neLtType(m.band),kilde:'l',i});
  if(m.port)L.push({fra:'l:'+m.port,fp:'ud',til:rk,tp:'gate',type:neLtType(m.port),kilde:'l',gate:true,i});
  L.push({fra:rk,fp:'ud',til:fg.key,tp:'ind',kilde:'r',i})});
 N.forEach(n=>{if(n.kol==='figur')n.maal.forEach(mk=>L.push({fra:n.key,fp:'ud',til:mk,tp:'ind',kilde:'f',gruppe:n.gruppe}))});
 return{N,L}}
/* v9.50: reglerne er ikke længere med i signaturen. Node-editoren får besked fra Regler (NE2.snavs), når en regel er lavet, rettet eller slettet;
   signaturen dækker nu kun figurerne og det, der ikke er regler. */
function ne2Sig(){let s='';try{s=(fase2.objekter||[]).map(o=>o.id+'/'+o.navn+'/'+(o.synlig?1:0)+'/'+JSON.stringify(o.lag.map(l=>l.egenskaber||0))).join(';')+'#'+(set.tilpas?1:0)+(typeof live!=='undefined'&&live?1:0)+(typeof F!=='undefined'&&F?1:0)}catch(e){s=String(Math.random())}return s}
/* Små tegninger (ingen farver: de arver kolonnens farve) */
const NE2_FIG='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="2.6"/><path d="M12 8v7M12 10l-5 3M12 10l5 3M12 15l-4 6M12 15l4 6"/></svg>';
const NE2_GRP='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="7"/></svg>';
function ne2Maerker(l){const vis=l.slice(0,2),rest=l.length-vis.length;return vis.map(([t,k,tip])=>'<span class="ne-m'+(k?' ne-m-'+k:'')+'" title="'+neHtml(tip||t)+'">'+neHtml(t)+'</span>').join('')+(rest>0?'<span class="ne-m" title="'+neHtml(l.slice(2).map(x=>x[0]).join(', '))+'">+'+rest+'</span>':'')}
const NE2_SKALA='<div class="ne-skala" aria-hidden="true"><span>0</span><span>0,5</span><span>1</span></div>';
function ne2NodeHtml(n){const k=n.kol;let farve='var(--ne-kolonne-'+k+')',hoved='',krop='',bund='',porte='<i class="ne-port ind" data-p="ind"></i><i class="ne-port ud" data-p="ud"></i>',label='';
 if(k==='lydtraek'){const t=neLtType(n.band),navn=neLtNavn(n.band),brug=n.regler.length,gt=(n.gates||[]).length;label='Lydtræk '+navn;
  hoved='<i class="ne-prik" style="color:var(--ne-lydtraekType-'+t+')"></i><b class="ne-nt">'+neHtml(navn)+'</b>';
  krop='<div class="ne-skaerm"><div class="ne-maaler"><u class="ne-fyld"></u><i class="ne-top"></i></div><b class="ne-tal" data-x="v">0,00</b></div>'+NE2_SKALA;
  let hvor='';try{hvor=r2Hvor(n.band)}catch(e){}
  bund=neHtml(hvor)+(brug?' · '+brug+(brug===1?' regel':' regler'):'')+(gt?' · gate for '+gt:'')}
 else if(k==='regel'){const m=n.m,eg=neEgM(m),S=(()=>{try{return stakFor(m,n.i)}catch(e){return{thr:+m.thr||0}}})(),auto=S.thrAuto!=null,thr=Math.max(0,Math.min(1,+S.thr||0)),h=Math.max(0,+m.hyst||0);
  const mk=[];if(typeof neUdenUdsving==='function'&&neUdenUdsving(m.effect))mk.push(['!','adv','Reglen flytter ikke noget endnu: egenskabens Fra og Til er ens. Klik for at give den et udsving.']);if(auto)mk.push(['Adaptiv','adaptiv','Adaptiv tærskel: tærsklen følger sangen. Din tærskel er '+neTal(m.thr)+'.']);if(m.inv)mk.push(['Vendt','','Vend om: høj lyd giver lav effekt.']);
  if(m.port)mk.push(['Gate','gate','Gate: reglen virker kun, når '+neLtNavn(m.port)+' er over '+neTal(m.portT==null?.5:m.portT)+'.']);
  label='Regel '+(n.i+1)+': '+neLtNavn(m.band)+' til '+neMaalNavn(m.effect);
  hoved='<b class="ne-nt" title="'+neHtml(neLtNavn(m.band)+' → '+neMaalNavn(m.effect))+'">'+neHtml(neLtNavn(m.band)+' → '+neMaalNavn(m.effect))+'</b><span class="ne-maerker">'+ne2Maerker(mk)+'</span><select class="ne-vaelg" data-nf="slags" aria-label="Handling eller Egenskab" title="Handling: slår til én gang, når lyden rammer (tærskel og hysterese). Egenskab: følger lyden hele tiden (mindst og mest). Ændrer kun visningen; motoren regner ens. Standard læses ud fra målet.">'+'<option value="handling"'+(eg?'':' selected')+'>Handling ▾</option><option value="egenskab"'+(eg?' selected':'')+'>Egenskab ▾</option></select>';
  krop='<div class="ne-skaerm ne-med-styrke"><div class="ne-maaler ne-rm'+(eg?' ne-eg':'')+'"><u class="ne-fyld"></u>'+(eg?'<i class="ne-klemme" style="left:'+(thr*100).toFixed(1)+'%" title="Mindst: under '+neTal(thr)+' sker der intet. Træk for at ændre tærsklen."></i><i class="ne-klemme ne-mest" style="left:'+(neMest(m)*100).toFixed(1)+'%" title="Mest: her når udgangen 1. Træk for at ændre styrken."></i>':'<s class="ne-under" style="width:'+(thr*100).toFixed(1)+'%"></s>'+(h>0?'<s class="ne-hyst" style="left:'+(Math.max(0,thr-h)*100).toFixed(1)+'%;width:'+(Math.min(thr,h)*100).toFixed(1)+'%"></s>':'')+'<i class="ne-thr" style="left:'+(thr*100).toFixed(1)+'%"></i>')+'</div><b class="ne-tal" data-x="v">0,00</b></div>'
   +'<div class="ne-styrke" title="Styrke (gain) for denne regel. Træk i tallet for at ændre den."><small>styrke</small><b>×'+neTal(m.gain)+'</b></div>';
  krop='<div class="ne-krop">'+krop+'</div>'+NE2_SKALA;
  const andre=maps.filter((x,j)=>j!==n.i&&x.effect===m.effect).length;
  bund=(m.fjernet?'<span class="ne-gul">Kilden er fjernet (Lydkort), så reglen er slået fra.</span> ':'')+(eg?'→ '+neHtml(neEgRange(m.effect)||'egenskaben')+' på '+neHtml(neMaalNavn(m.effect))+' · ':'')+(m.port?'<span data-x="gate">Gate</span> · ':'')+(andre?'Deler målet '+neHtml(neMaalNavn(m.effect))+' med '+andre+(andre===1?' regel mere':' regler mere'):'Regel '+(n.i+1));
  porte+='<i class="ne-port gate" data-p="gate" title="Gate: her kommer et link fra den kilde, der åbner reglen."></i>'}
 else if(k==='figur'){const o=n.obj;if(n.gruppe)farve='var(--ne-kolonne-midiOgEffekter)';label=(n.gruppe?'Effekt-gruppe ':'Figur ')+n.navn;
  const skjult=o&&!o.synlig;hoved='<b class="ne-nt">'+neHtml(n.navn)+'</b>'+(n.gruppe?'':'<span class="ne-oeje" title="'+(skjult?'Skjult: figuren vises ikke på scenen (øjet er lukket).':'Synlig på scenen.')+'">'+(skjult?'⊘':'◉')+'</span>');
  let form='';try{form=o&&o.lag&&o.lag[0]&&FORMER[o.lag[0].form]?FORMER[o.lag[0].form][0]:''}catch(e){}
  krop='<div class="ne-skaerm ne-fig"><span class="ne-billede">'+(n.gruppe?NE2_GRP:NE2_FIG)+'</span><span class="ne-finfo"><b>'+n.maal.length+(n.maal.length===1?' mål':' mål')+' · '+n.regler.length+(n.regler.length===1?' regel':' regler')+'</b><small>'+neHtml(n.gruppe?'Effekt-gruppe (fra Dublet)':(o?(form||'Figur'):'Figuren findes ikke'))+'</small></span><i class="ne-lampe"></i></div>';
  bund=n.gruppe?'Effekt-gruppe · '+n.maal.length+' mål':(skjult?'Skjult på scenen · ':'')+n.maal.length+' mål';n.skjult=skjult}
 else if(k==='maal'){const eg=neErEgenskab(n.effect),fig=NE2.N.get(n.figur),flere=n.regler.length>1;if(n.gruppe)farve='var(--ne-kolonne-midiOgEffekter)';label='Mål '+neMaalNavn(n.effect);
  hoved='<b class="ne-nt">'+neHtml(neMaalNavn(n.effect))+'</b><span class="ne-maerker">'+(flere?ne2Maerker([[neKombNavn(n.effect),'','Flere regler på samme mål lægges sammen sådan. Vælges i kontrolpanelet: Største, Læg sammen eller Gang.']]):'')+'</span>';
  krop='<div class="ne-skaerm">'+(eg?'<div class="ne-maaler"><u class="ne-fyld"></u></div>':'<i class="ne-lampe ne-stor"></i><span class="ne-mtekst">'+(flere?n.regler.length+' regler':'1 regel')+'</span>')+'<b class="ne-tal" data-x="v">0,00</b></div>';
  bund=neHtml(fig?fig.navn:'')+' · '+(eg?'Egenskab'+(neEgRange(n.effect)?' → '+neHtml(neEgRange(n.effect)):''):'Handling')+(flere?' · '+n.regler.length+' regler':'')}
 const w=+NE.tema.maal.bredde[(NE.kol.find(c=>c.k===k)||{b:'normal'}).b]||320;
 return '<div class="ne-node ne-n-'+k+'" data-n="'+neHtml(n.key)+'" tabindex="0" role="button" aria-label="'+neHtml(label)+'" style="--nf:'+farve+';width:'+w+'px"><div class="ne-nh">'+hoved+'</div>'+krop+'<div class="ne-bund">'+bund+'</div>'+porte+'</div>'}
/* Placering: regler stablet i rækkefølgen figur → mål → Mapping-nummer; lydtræk, figurer og mål ud for deres regler. Alt i trin af 8 punkter. */
function ne2Placer(){const G=+NE.tema.maal.gitter||8,MELLEM=3*G,rund=v=>Math.round(v/G)*G,N=NE2.N,kolX={};NE.kol.forEach(c=>kolX[c.k]=c.x);
 const fig=[...N.values()].filter(n=>n.kol==='figur'),fo=n=>n.gruppe?1000+NE2_GRUPPER.indexOf(n.navn):Math.max(0,(fase2.objekter||[]).findIndex(o=>o.id===n.key.slice(2)));
 fig.sort((a,b)=>fo(a)-fo(b));const maalOrd=[];fig.forEach(f=>f.maal.forEach(mk=>maalOrd.push(mk)));
 const reg=[...N.values()].filter(n=>n.kol==='regel').sort((a,b)=>maalOrd.indexOf(a.maal)-maalOrd.indexOf(b.maal)||a.i-b.i);
 const STD={lydtraek:128,regel:152,figur:112,maal:112},H=n=>{const el=n.el,h=el?el.offsetHeight:0;return h>0?Math.ceil(h/G)*G:STD[n.kol]||120};
 let y=0;reg.forEach(n=>{n.ay=y;y+=H(n)+MELLEM});const midt=n=>n.ay+H(n)/2;
 const stak=(liste,ønsket)=>{liste.forEach(n=>n.ø=ønsket(n));liste.sort((a,b)=>a.ø-b.ø);let bund=-1e9;liste.forEach(n=>{n.ay=rund(Math.max(n.ø,bund));bund=n.ay+H(n)+MELLEM})};
 const snit=(keys,fb)=>{const r=keys.map(k=>N.get(k)).filter(x=>x&&x.ay!=null);return r.length?r.reduce((s,x)=>s+midt(x),0)/r.length:fb};
 stak([...N.values()].filter(n=>n.kol==='lydtraek'),n=>snit(n.regler.concat(n.gates||[]),0)-H(n)/2);
 stak(fig,n=>snit(n.regler,0)-H(n)/2);
 stak([...N.values()].filter(n=>n.kol==='maal'),n=>{const f=N.get(n.figur);const r=snit(n.regler,0);return (f?(r*2+midt(f))/3:r)-H(n)/2});
 const P=NE.pos||{};N.forEach(n=>{const p=P[n.key];n.x=p&&Number.isFinite(p[0])?p[0]:kolX[n.kol]+(n.kol==='lydtraek'||n.kol==='figur'||n.kol==='maal'?0:0);n.y=p&&Number.isFinite(p[1])?p[1]:n.ay;n.flyttet=!!p});
 NE2.hoejde=Math.max(0,...[...N.values()].map(n=>n.y+H(n)))}
function ne2Porte(n){const el=n.el;if(!el)return;const sk=el.querySelector('.ne-skaerm'),w=el.offsetWidth,ty=sk?sk.offsetTop+sk.offsetHeight/2:el.offsetHeight/2;n.w=w;n.h=el.offsetHeight;
 n.porte={ind:[0,ty],ud:[w,ty],gate:[0,Math.max(ty+18,el.offsetHeight-16)]};el.querySelectorAll('.ne-port').forEach(p=>{const q=n.porte[p.dataset.p];if(q){p.style.top=(q[1]-7)+'px'}})}
function ne2Byg(){const v=$('ne-verden');if(!v||!NE.byg||!NE.tema)return;const t0=performance.now();NE2.sig=ne2Sig();NE2.snavs=false;const {N,L}=ne2Model();NE2.N=N;NE2.L=L;
 v.querySelectorAll('.ne-node').forEach(e=>e.remove());const frag=document.createElement('div');
 frag.innerHTML=[...N.values()].map(ne2NodeHtml).join('');[...frag.children].forEach(el=>{v.appendChild(el);const n=N.get(el.dataset.n);if(n)n.el=el});
 ne2Placer();N.forEach(n=>{n.el.style.left=n.x+'px';n.el.style.top=n.y+'px';ne2Porte(n)});
 NE2.maalt=[...N.values()].some(n=>n.el&&n.el.offsetHeight>0)||!N.size;if(NE2.valgt&&!N.has(NE2.valgt))NE2.valgt=null;NE2.byg=true;ne2Kaede();ne2Hoveder();if(NE.tilpas&&NE2.maalt)neTilpas(true);else neVis();ne2Kp(true);NE2.bygMs=performance.now()-t0}
/* Noderne fylder: til Tilpas. */
function neGraenser(){const N=[...NE2.N.values()].filter(n=>n.el);if(!N.length)return null;return{x0:Math.min(...N.map(n=>n.x))-24,x1:Math.max(...N.map(n=>n.x+(n.w||320)))+24,y0:Math.min(...N.map(n=>n.y))}}
/* Overskrifterne: antal i stedet for "kommer i trin …" for de kolonner, der er bygget. */
function ne2Hoveder(){const c={lydtraek:0,regel:0,figur:0,maal:0};NE2.N.forEach(n=>c[n.kol]++);const ord={lydtraek:['lydtræk','lydtræk'],regel:['regel','regler'],figur:['figur eller gruppe','figurer og grupper'],maal:['mål','mål']};
 Object.keys(c).forEach(k=>{const h=document.querySelector('#ne-hoveder .ne-hoved[data-kol="'+k+'"] .ne-naar');if(h){h.textContent=c[k]?c[k]+' '+ord[k][c[k]===1?0:1]:'Ingen endnu';h.title=c[k]?'Bygget ud fra dine forbindelser (kun til at se på)':'Der er ingen forbindelser endnu'}})}
/* Den valgte kæde: noden selv og alt, den hænger sammen med. */
function ne2Kaede(){const N=NE2.N,k=NE2.valgt;NE2.kaede=null;N.forEach(n=>n.el&&n.el.classList.toggle('ne-valgt',n.key===k));if(!k)return;const S=new Set([k]),n=N.get(k);if(!n)return;
 const medRegel=rk=>{const r=N.get(rk);if(!r)return;S.add(rk);S.add(r.lt);if(r.gate)S.add(r.gate);S.add(r.figur);S.add(r.maal)};
 if(n.kol==='regel')medRegel(k);else if(n.kol==='lydtraek'){n.regler.concat(n.gates||[]).forEach(medRegel)}else n.regler.forEach(medRegel);
 if(n.kol==='lydtraek'){/* kun de mål, lydtrækket rammer */}NE2.kaede=S}
function neVaelg(k){NE2.valgt=k&&NE2.N.has(k)?k:null;ne2Kaede();ne2Kp(true);neLinjerTegn()}
/* Linjerne på lærredet. Farven er kolonnens (eller lydtrækkets type); den valgte kæde er hvid. Lysstyrken følger tallet lige nu. */
function ne2Farver(){const r=$('ne'),cs=r?getComputedStyle(r):null,g=k=>cs?cs.getPropertyValue(k).trim():'';const F={};if(!cs)return F;
 ['lydkilde','fft','analyse','lydtraek','regel','figur','maal','scene','midiOgEffekter'].forEach(k=>F[k]=g('--ne-kolonne-'+k));Object.keys((NE.tema&&NE.tema.lydtraekType)||{}).forEach(k=>F['t:'+k]=g('--ne-lydtraekType-'+k));
 F.valgt=g('--ne-gloed-valgt-kant');F.thr=g('--ne-taerskelStreg');F.svag=g('--ne-grund-svagTekst');F.skaerm=g('--ne-grund-skaermBaggrund');F.slaar=g('--ne-kolonne-figur');[0,1,2,3].forEach(i=>F['g'+i]=g('--ne-maalerGradient-'+i));NE2.farver=F;return F}
function neLinjerTegn(){const fl=$('ne-flade');if(!fl||!NE2.byg)return;let c=$('ne-linjer');if(!c)return;const W=fl.clientWidth,H=fl.clientHeight,dpr=Math.min(2,window.devicePixelRatio||1);
 if(c.width!==Math.round(W*dpr)||c.height!==Math.round(H*dpr)){c.width=Math.round(W*dpr);c.height=Math.round(H*dpr);c.style.width=W+'px';c.style.height=H+'px'}
 const g=c.getContext('2d'),F=NE2.farver.regel?NE2.farver:ne2Farver(),z=NE.z,N=NE2.N,K=NE2.kaede;g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W,H);if(window.NE14&&NE14.brug())NE14.start(W,H,dpr);
 const pt=(n,p)=>{const q=n.porte&&n.porte[p];return q?[NE.x+(n.x+q[0])*z,NE.y+(n.y+q[1])*z]:null};
 const tegn=(l,valgt)=>{const a=N.get(l.fra),b=N.get(l.til);if(!a||!b)return;const p0=pt(a,l.fp),p1=pt(b,l.tp);if(!p0||!p1)return;
  if(Math.max(p0[0],p1[0])<-50||Math.min(p0[0],p1[0])>W+50||Math.max(p0[1],p1[1])<-50||Math.min(p0[1],p1[1])>H+50)return;
  const v=l.vNu||0,col=valgt?F.valgt:l.sover?F.svag:l.kilde==='k'?(l.blaa?F.midiOgEffekter:F.lydkilde):l.kilde==='fft'?F.fft:l.kilde==='a'?F.analyse:l.kilde==='l'?(F['t:'+l.type]||F.lydtraek):l.kilde==='r'?F.regel:(l.gruppe?F.midiOgEffekter:F.figur);
  const dx=Math.max(30*z,Math.abs(p1[0]-p0[0])*.5);if(window.NE14&&NE14.brug()){NE14.lag(p0,p1,dx,col,valgt?1:(typeof ne13Alfa==='function'?ne13Alfa(l,v):(.28+.72*Math.min(1,v))),Math.max(1,(valgt?2.6:1.6+1.4*Math.min(1,v))*Math.min(1.4,Math.max(.6,z*1.6))),!!(l.gate||l.stiplet||l.sover),(valgt||v>.35)&&!NE2.udenGloed?(valgt?1:Math.min(1,v)):0);return}g.beginPath();g.moveTo(p0[0],p0[1]);g.bezierCurveTo(p0[0]+dx,p0[1],p1[0]-dx,p1[1],p1[0],p1[1]);
  g.strokeStyle=col;g.globalAlpha=valgt?1:(typeof ne13Alfa==='function'?ne13Alfa(l,v):(.28+.72*Math.min(1,v)));g.lineWidth=Math.max(1,(valgt?2.6:1.6+1.4*Math.min(1,v))*Math.min(1.4,Math.max(.6,z*1.6)));
  if(l.gate||l.stiplet||l.sover)g.setLineDash([6*Math.max(.5,z),5*Math.max(.5,z)]);else g.setLineDash([]);
  if((valgt||v>.35)&&!NE2.udenGloed){g.shadowColor=col;g.shadowBlur=valgt?10:8*v}else g.shadowBlur=0;g.stroke()};
 const V=NE2.L.map(l=>[l,!!(K&&K.has(l.fra)&&K.has(l.til)&&(l.kilde!=='f'||K.has(l.til)))]);V.filter(x=>!x[1]).forEach(x=>tegn(x[0],false));V.filter(x=>x[1]).forEach(x=>tegn(x[0],true));
 if(window.NE14&&NE14.brug())NE14.slut();g.globalAlpha=1;g.shadowBlur=0;g.setLineDash([]);if(typeof ne5Tegn==='function')ne5Tegn(g)}
/* Levende tal: højst 30 gange i sekundet og kun, når Node-editoren kan ses. */
function ne2Synlig(){const w=$('w33');if(!w||w.hidden||!NE2.byg)return false;const r=w.getBoundingClientRect();if(r.width<10||r.height<10)return false;const cs=getComputedStyle(w);return cs.display!=='none'&&cs.visibility!=='hidden'}
function ne2Tik(t){NE2.raf=requestAnimationFrame(ne2Tik);if(!NE.byg)return;if(!NE2.byg){if(NE.tema)ne2Byg();return}
 if(t-NE2.tSig>500&&!NE2.laas){NE2.tSig=t;try{Regler.tjek()}catch(e){}const s=ne2Sig();if(NE2.snavs||s!==NE2.sig||gitSkift()){ne2Byg();return}const ve=neVenter();if(ve!==NE2.venter){NE2.venter=ve;NE2.N.forEach(n=>{if(n.el&&(n.kol==='lydtraek'||n.kol==='regel'))n.el.classList.toggle('ne-venter',ve)})}}
 if(!ne2Synlig()||t-NE2.t<33)return;NE2.t=t;if(!NE2.maalt){const fl=$('ne-flade');/* v9.53: kun når lærredet kan ses; ellers ville noderne blive bygget om ved hvert billede, mens matrixen eller en visning er fremme */if(fl&&fl.offsetWidth>0){ne2Byg();return}}const N=NE2.N,sx=(el,tx)=>{if(el&&el.textContent!==tx)el.textContent=tx},bredde=(el,v)=>{if(el){const s=(Math.max(0,Math.min(1,v))*100).toFixed(1)+'%';if(el.style.width!==s)el.style.width=s}};
 const ltV={};N.forEach(n=>{if(n.kol!=='lydtraek')return;let v=0;try{v=+bandV(n.band)||0;if(typeof neTrimV==='function')v=neTrimV(n.band,v)}catch(e){}v=Math.max(0,Math.min(1,v));ltV[n.key]=v;const el=n.el;if(!el)return;
  bredde(el.querySelector('.ne-fyld'),v);if(!(n.pk>=v)||t-(n.pkT||0)>1500){n.pk=v;n.pkT=t}const top=el.querySelector('.ne-top');if(top){top.style.left=(n.pk*100).toFixed(1)+'%';top.classList.toggle('ne-loft',n.pk>=.999)}sx(el.querySelector('[data-x="v"]'),neTal(v))});
 const maalV={};N.forEach(n=>{if(n.kol!=='regel')return;const i=n.i,m=n.m,v=+R2M.v[i]||0,ud=+R2M.ud[i]||0,thr=R2M.thr[i]!=null?+R2M.thr[i]:+m.thr,el=n.el;n.vNu=v;n.udNu=ud;maalV[n.maal]=typeof neKombFor==='function'?neKomb(neKombFor(n.m.effect),maalV[n.maal],ud):Math.max(maalV[n.maal]||0,ud);if(!el)return;
  const sluk=!!(m.off||m.fjernet);el.classList.toggle('ne-slukket',sluk);bredde(el.querySelector('.ne-fyld'),v);sx(el.querySelector('[data-x="v"]'),neTal(v));
  el.classList.toggle('ne-slaar',!sluk&&!neEgM(m)&&v>=thr&&ud>.05);
  if(n.thrVist!==thr){n.thrVist=thr;const p=(Math.max(0,Math.min(1,thr))*100).toFixed(1)+'%',q=el.querySelector('.ne-thr'),u=el.querySelector('.ne-under'),k2=el.querySelector('.ne-klemme');if(q)q.style.left=p;if(u)u.style.width=p;if(k2)k2.style.left=p}
  if(m.port){const lukket=!!R2M.port[i],gm=el.querySelector('.ne-m-gate'),gb=el.querySelector('[data-x="gate"]');const tx='Gate · '+(lukket?'lukket':'åben');if(gm){sx(gm,tx);gm.classList.toggle('ne-lukket',lukket)}sx(gb,tx)}});
 const figV={};N.forEach(n=>{if(n.kol!=='maal')return;const v=maalV[n.key]||0;n.vNu=v;figV[n.figur]=Math.max(figV[n.figur]||0,v);const el=n.el;if(!el)return;bredde(el.querySelector('.ne-fyld'),v);sx(el.querySelector('[data-x="v"]'),neTal(v));const l=el.querySelector('.ne-lampe');if(l)l.classList.toggle('ne-taendt',v>.35)});
 N.forEach(n=>{if(n.kol!=='figur')return;const v=figV[n.key]||0;n.vNu=v;const l=n.el&&n.el.querySelector('.ne-lampe');if(l)l.classList.toggle('ne-taendt',v>.35)});
 NE2.L.forEach(l=>{if(l.kilde==='k'||l.kilde==='fft'||l.kilde==='a')return;l.vNu=l.kilde==='l'?(ltV[l.fra]||0):l.kilde==='r'?((N.get(l.fra)||{}).udNu||0):((N.get(l.til)||{}).vNu||0)});
 if(typeof ne3Tik==='function')ne3Tik(t);neLinjerTegn();ne2KpTik(t)}
/* Kontrolpanelet: sætningen, signalet over tid og indstillingerne for den valgte node. */
function ne2Saetning(n){const N=NE2.N,b=(t,k)=>'<b class="ne-s-'+k+'">'+neHtml(t)+'</b>';
 if(n.kol==='regel'){const m=n.m,S=(()=>{try{return stakFor(m,n.i)}catch(e){return{thr:+m.thr||0}}})(),thr=+S.thr||0,fig=N.get(n.figur),mn=neMaalNavn(m.effect),eg=neEgM(m);
  const kilde=b(neLtNavn(m.band),'lydtraek'),graense=m.inv?'under '+b(neTal(1-thr),'thr')+' (vendt)':'over '+b(neTal(thr),'thr'),gate=m.port?', og '+b(neLtNavn(m.port),'lydtraek')+' er over '+b(neTal(m.portT==null?.5:m.portT),'thr'):'';
  const pre=(m.off||m.fjernet)?'<span class="ne-gul">Slukket.</span> ':'';
  if(eg)return pre+'Når '+kilde+' er '+graense+gate+', følger '+b(mn,'maal')+' på '+b(fig?fig.navn:'','figur')+' lyden'+(neEgRange(m.effect)?' (→ '+neHtml(neEgRange(m.effect))+')':'')+'.';
  return pre+'Når '+kilde+' er '+graense+gate+', slår '+b(mn,'maal')+' til'+(fig?(fig.gruppe?' ('+neHtml(fig.navn)+')':' på '+b(fig.navn,'figur')):'')+'.'}
 if(n.kol==='lydtraek'){let hv='';try{hv=r2Hvor(n.band)}catch(e){}return b(neLtNavn(n.band),'lydtraek')+' er ét tal mellem 0 og 1 ('+neHtml(hv)+'). Det bruges af '+n.regler.length+(n.regler.length===1?' regel':' regler')+((n.gates||[]).length?' og er gate for '+n.gates.length:'')+'.'}
 if(n.kol==='figur')return b(n.navn,'figur')+(n.gruppe?' er en effekt-gruppe fra Dublet med ':' har ')+n.maal.length+' mål og '+n.regler.length+(n.regler.length===1?' regel':' regler')+'.'+(n.skjult?' Den er skjult på scenen.':'');
 if(n.kol==='maal'){const fig=N.get(n.figur);return b(neMaalNavn(n.effect),'maal')+(fig?' på '+b(fig.navn,'figur'):'')+' styres af '+n.regler.length+(n.regler.length===1?' regel.':' regler. Den største vinder (Største), som MV regner i dag.')}
 return ''}
function ne2Indst(n){if(n.kol!=='regel')return '';const m=n.m,S=(()=>{try{return stakFor(m,n.i)}catch(e){return null}})(),hk=(()=>{try{return r2HoldTxt(r2HoldIdx(m))}catch(e){return m.hold?'∞':'Fra'}})();
 const l=[['Tærskel',neTal(m.thr)+(S&&S.thrAuto!=null?' (Adaptiv nu '+neTal(S.thr)+')':'')],['Styrke (gain)',neTal(m.gain)],['Attack',Math.round(+m.att||0)+' ms'],['Release',Math.round(+m.rel||0)+' ms'],['Kurve',neTal(m.curve??1)],['Spærretid',Math.round(m.gap??120)+' ms'],['Hold',hk],['Hysterese',+m.hyst?neTal(m.hyst):'Fra'],['Slew',+m.slew?neTal(m.slew)+'/s':'Fra'],['Vend om',m.inv?'Til':'Fra']];
 if(m.port)l.push(['Gate',neLtNavn(m.port)+' over '+neTal(m.portT==null?.5:m.portT)]);
 return '<div class="ne-kp-indst">'+l.map(([a,v])=>'<span>'+neHtml(a)+' <b>'+neHtml(v)+'</b></span>').join('')+'</div>'+(S&&S.lag?'<div class="ne-kp-stak" title="Styrke brugt (gain-stak, fagudtryk: gain staging)">Styrke brugt <b>'+neTal(S.styrke)+'</b> = '+S.lag.map(x=>'<span class="'+(x[2]||x===S.lag[0]?'':'ne-svag')+'">'+neHtml(String(x[0]).replace(/ \(.*\)/,''))+' '+neTal(x[1])+'</span>').join(' × ')+'</div>':'')}
function ne2Kp(ny){const kp=$('ne-kp');if(!kp)return;const n=NE2.valgt&&NE2.N.get(NE2.valgt);
 if(!n){const tom=!maps.length;kp.className='ne-kp';kp.innerHTML='<div class="ne-kp-titel">Kontrolpanelet</div><div class="ne-kp-tekst">'+(tom?'Der er ingen regler endnu. Træk fra et lydtræk til en figur, skift til Matrix og tryk + lydtræk og + mål, eller vælg en opsætning.':'Klik på en node for at se, hvordan den virker.')+'</div><div class="ne-kp-svag">Træk fra udgangen ● på et lydtræk for at lave en regel, og fra reglens udgang til en figur. + Tilføj i overskrifterne og Ctrl+K tilføjer noder. Tastaturet: Home, piletasterne, Enter og Esc. Fortryd med Ctrl+Z eller ↶.</div>';return}
 const titel={lydkilde:n.blaa?n.navn:'Lydkilde',fft:'FFT',analyse:'Analyse · '+(n.ana?n.ana[1]:''),lydtraek:'Lydtræk',regel:'Regel · '+(n.m&&neEgM(n.m)?'Egenskab':'Handling'),figur:n.gruppe?'Effekt-gruppe':'Figur',maal:'Mål'}[n.kol];
 kp.className='ne-kp ne-kp-valgt';kp.style.setProperty('--nf',n.kol==='figur'&&n.gruppe||n.kol==='maal'&&n.gruppe?'var(--ne-kolonne-midiOgEffekter)':'var(--ne-kolonne-'+n.kol+')');
 kp.innerHTML='<div class="ne-kp-titel">Kontrolpanelet · '+neHtml(titel)+'</div><div class="ne-kp-felter"><div class="ne-kp-saetning"><small>Sætningen</small><div class="ne-kp-tekst">'+ne2Saetning(n)+'</div></div>'
  +(n.kol==='regel'?'<div class="ne-kp-signal"><small>Signalet over tid · de sidste 2 sekunder · gråt før kæden, farvet efter</small><canvas id="ne-kp-sig" width="360" height="56"></canvas></div><div class="ne-kp-ind"><small>Indstillinger</small>'+ne2Indst(n)+'</div>':'<div class="ne-kp-ind"><div class="ne-kp-svag">Klik på en regel for at rette den. Lydkilder, analyser, figurer og mål kan endnu kun ses.</div></div>')+'</div>'}
function ne2KpTik(t){if(t-NE2.tKp<500)return;NE2.tKp=t;const n=NE2.valgt&&NE2.N.get(NE2.valgt);if(!n||n.kol!=='regel')return;const c=$('ne-kp-sig');if(!c)return;
 const H=R2M.h[n.i],g=c.getContext('2d'),W=c.width,HH=c.height,F=NE2.farver,thr=R2M.thr[n.i]!=null?+R2M.thr[n.i]:+n.m.thr;g.clearRect(0,0,W,HH);
 g.strokeStyle=F.thr;g.setLineDash([4,4]);g.lineWidth=1;g.beginPath();g.moveTo(0,HH-thr*(HH-2));g.lineTo(W,HH-thr*(HH-2));g.stroke();g.setLineDash([]);
 if(!H)return;const ln=(arr,st,lw,a)=>{g.strokeStyle=st;g.globalAlpha=a;g.lineWidth=lw;g.beginPath();for(let k=0;k<R2M.N;k++){const y=HH-1-Math.min(1,arr[(H.p+k)%R2M.N])*(HH-2),x=k/(R2M.N-1)*W;k?g.lineTo(x,y):g.moveTo(x,y)}g.stroke();g.globalAlpha=1};
 ln(H.ind,F.svag,1,.7);ln(H.ud,F.regel,2,1)}
/* At flytte en node: træk i den. Et klik uden at flytte vælger den. */
function ne2Start(){const fl=$('ne-flade'),v=$('ne-verden');if(!fl||!v||!NE.byg)return;{/* v9.105: pladserne ligger i showet; det gamle set.ne.pos flyttes over én gang */const gl=(set.ne&&set.ne.pos&&typeof set.ne.pos==='object')?set.ne.pos:null;if(typeof scene!=='undefined'&&scene){scene.ne=scene.ne||{};if(gl&&Object.keys(gl).length&&!(scene.ne.pos&&Object.keys(scene.ne.pos).length))scene.ne.pos=gl}if(set.ne)delete set.ne.pos;gitSync();if(!NE.pos)NE.pos={}}
 if(!$('ne-linjer')){const c=document.createElement('canvas');c.id='ne-linjer';c.className='ne-linjer';c.setAttribute('aria-hidden','true');fl.insertBefore(c,fl.firstChild)}
 const tr=document.querySelector('#ne .ne-trin');if(tr){tr.textContent='Trin 3 af 16 · lydkilde, FFT og analyser (kun se)';tr.title='Planen står i docs/PLAN-NODE-EDITOREN.md'}
 v.addEventListener('pointerdown',e=>{const el=e.target.closest('.ne-node');if(!el||e.button>0)return;if(e.target.closest('.ne-m-adv')){e.stopPropagation();return}/* v9.107: ellers fangede lærredets træk klikket */if(e.target.closest('select,input,button,label,.ne-rm,.ne-styrke,.ne-port'))return;e.stopPropagation();const n=NE2.N.get(el.dataset.n);if(!n)return;
  NE2.traek={n,el,px:e.clientX,py:e.clientY,x:n.x,y:n.y,flyttet:false};try{el.setPointerCapture(e.pointerId)}catch(x){}});
 v.addEventListener('pointermove',e=>{const d=NE2.traek;if(!d)return;if(!d.flyttet&&Math.hypot(e.clientX-d.px,e.clientY-d.py)<4)return;if(!d.flyttet){d.flyttet=true;d.el.classList.add('ne-flyttes')}
  const G=+NE.tema.maal.gitter||8;d.n.x=Math.round((d.x+(e.clientX-d.px)/NE.z)/G)*G;d.n.y=Math.round((d.y+(e.clientY-d.py)/NE.z)/G)*G;d.el.style.left=d.n.x+'px';d.el.style.top=d.n.y+'px';neLinjerTegn()});
 const slip=e=>{const d=NE2.traek;if(!d)return;NE2.traek=null;d.el.classList.remove('ne-flyttes');if(d.flyttet){NE.pos[d.n.key]=[d.n.x,d.n.y];d.n.flyttet=true;ne2RydPos();neGem();gitGem()}else neVaelg(NE2.valgt===d.n.key?null:d.n.key)};
 v.addEventListener('pointerup',slip);v.addEventListener('pointercancel',slip);
 v.addEventListener('keydown',e=>{const el=e.target.closest('.ne-node');if(!el)return;if(e.key==='Enter'||e.key===' '){e.preventDefault();e.stopPropagation();neVaelg(el.dataset.n)}});
 fl.addEventListener('keydown',e=>{if(e.key==='Escape'&&NE2.valgt){e.stopPropagation();neVaelg(null)}});
 new ResizeObserver(()=>neLinjerTegn()).observe(fl);
 ne2Farver();ne2Byg();if(!NE2.raf)NE2.raf=requestAnimationFrame(ne2Tik)}
/* Gemte pladser for noder, der ikke findes mere, ryddes, når der er over 400. */
function ne2RydPos(){const k=Object.keys(NE.pos);if(k.length<=400)return;k.forEach(x=>{if(!NE2.N.has(x))delete NE.pos[x]})}
/* Placér alle noder automatisk igen (de flyttede glemmes). */
function neAutoPlacer(){NE.pos={};neGem();ne2Byg()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne2Start);else setTimeout(ne2Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 2): REGLERNE VISES ========== */
