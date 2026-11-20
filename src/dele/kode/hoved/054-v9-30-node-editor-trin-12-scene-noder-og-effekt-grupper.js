/* ========== v9.30: NODE-EDITOR (TRIN 12): SCENE-NODER OG EFFEKT-GRUPPER ==========
   Trin 12 af 16 (papirets afsnit 5.7 og 5.9).
   - Scene-noder: én node for hver scene, der vises lige nu (fanen i Scene, et løsrevet vindue eller udgangsvinduet). Kun de 5 scener kan vises:
     Live preview, Radial Mesh, Mesh 3D, Øjet og Lyd i 3D. Noden har et lille, levende billede (4 billeder i sekundet), en vælger øverst til højre
     (skifter fanen i Scene), og et klik på billedet åbner scenen stort (layoutet Show). Kontrolpanelet: Riv løs / Til Scene, Send til skærm og Sluk.
     Slukket (set.ne.sluk): scenen tegner ikke (Live preview, Radial Mesh, Mesh 3D, Øjet og Lyd i 3D stopper deres tegning), vinduet viser "Slukket".
     Links ind: ét fra hver figur og effekt-gruppe til Live preview (den eneste scene, der tegner figurerne). De andre scener viser lyden direkte.
   - Figurer og effekt-grupper får øje og Slå fra (fagudtryk: visibility og bypass). Øjet på en figur er det samme som "Læg på scenen / Tag af scenen"
     (o.synlig). Øjet på en effekt-gruppe skjuler dens effekter på scenen (scene.ne.grp[navn].skjult). Slå fra får figuren eller gruppen til at stå stille:
     dens regler giver 0 i motoren (o.neFra og scene.ne.grp[navn].fra), men den kan ses. Styrken kom i trin 9.
   - Baggrund ▾ i værktøjslinjen: Fra (standard) · Dublet-scenen · Mesh 3D · Øjet, svagt bag noderne (set.ne.bg). */
const NE12={fc:null,ft:0,sc:null,st:0,tBil:0,tBg:0,tvang:null,ned:null};
const NE12_SC=[['w2','Live preview','pv'],['w5','Radial Mesh','mesh'],['w28','Mesh 3D','m3cv'],['w29','Øjet','ojcv']];/* v9.81: Lyd i 3D er fjernet */
const NE12_UD={pv:'w2',mesh:'w5',mesh3d:'w28',oeje:'w29'};
const NE12_BG=[['fra','Fra'],['dublet','Live preview'],['mesh3d','Mesh 3D'],['oeje','Øjet']];
const ne12Navn=id=>(NE12_SC.find(s=>s[0]===id)||[0,id])[1];
function ne12Sluk(id){return !!(set.ne&&Array.isArray(set.ne.sluk)&&set.ne.sluk.includes(id))}
function ne12Tabt(id){try{if(id==='w28')return !!M3.tabt||typeof THREE==='undefined';if(id==='w29')return !!OJ.tabt||typeof THREE==='undefined'}catch(e){}return false}
/* Hvilke scener vises lige nu */
function ne12Vises(){const S=[],sc=$('w23'),scVis=!!(sc&&!sc.hidden&&!sc.classList.contains('min'));let ud='';try{if(typeof udgangAaben==='function'&&udgangAaben())ud=NE12_UD[set.udkilde]||''}catch(e){}
 NE12_SC.forEach(([id])=>{const w=$(id);if(!w)return;let hvor='';if(scIScene(id)){if(set.scene.aktiv===id&&scVis)hvor='scene'}else if(!w.hidden&&!w.classList.contains('min'))hvor='vindue';if(hvor||ud===id)S.push({id,hvor,ud:ud===id})});return S}
/* Slå fra (bypass) og øjet for effekt-grupper: motoren og tegningen spørger pr. mål; svaret huskes et kvarter sekund */
function ne12Grp(){return (scene&&scene.ne&&scene.ne.grp)||{}}
function ne12GrpAf(e){let n='Andre effekter';try{n=neFigurAf(e).navn}catch(x){}return n}
function ne12Cache(){const nu=performance.now();if(!NE12.fc||nu-NE12.ft>250){NE12.fc=new Map();NE12.ft=nu}return NE12.fc}
function neFraF(m){const e=String(m.effect),C=ne12Cache();let v=C.get('f|'+e);if(v===undefined){v=false;if(e.startsWith('obj:')||e.startsWith('liv:')){const o=fase2.objekter.find(x=>x.id===e.split(':')[1]);v=!!(o&&o.neFra)}else{const g=ne12Grp()[ne12GrpAf(e)];v=!!(g&&g.fra)}C.set('f|'+e,v)}return v}
function ne12Skjult(e){const C=ne12Cache();let v=C.get('s|'+e);if(v===undefined){const g=ne12Grp()[ne12GrpAf(e)];v=!!(g&&g.skjult);C.set('s|'+e,v)}return v}
function neFigFra(fk){if(fk.startsWith('f:')){const o=fase2.objekter.find(x=>x.id===fk.slice(2));return !!(o&&o.neFra)}const g=ne12Grp()[fk.slice(2)];return !!(g&&g.fra)}
function neFigSkjult(fk){if(fk.startsWith('f:')){const o=fase2.objekter.find(x=>x.id===fk.slice(2));return !!(o&&!o.synlig)}const g=ne12Grp()[fk.slice(2)];return !!(g&&g.skjult)}
function neSaetFra(fk,fra){const nd=NE2.N.get(fk),navn=nd?nd.navn:fk.slice(2);if(fk.startsWith('f:')){const o=fase2.objekter.find(x=>x.id===fk.slice(2));if(!o)return;if(fra)o.neFra=true;else delete o.neFra;try{persistObj()}catch(e){}}
 else{const N=ne9Ne(true),n=fk.slice(2);N.grp[n]=N.grp[n]||{};if(fra)N.grp[n].fra=true;else delete N.grp[n].fra}NE12.fc=null;try{save()}catch(e){}neToast(navn+(fra?' er slået fra: den står stille, men kan ses':' er slået til igen'),false);ne2Byg()}
function neSaetOeje(fk,vis){const nd=NE2.N.get(fk),navn=nd?nd.navn:fk.slice(2);if(fk.startsWith('f:')){const o=fase2.objekter.find(x=>x.id===fk.slice(2));if(!o)return;o.synlig=!!vis;try{persistObj()}catch(e){}try{if(typeof feFigurer==='function')feFigurer()}catch(e){}}
 else{const N=ne9Ne(true),n=fk.slice(2);N.grp[n]=N.grp[n]||{};if(vis)delete N.grp[n].skjult;else N.grp[n].skjult=true}NE12.fc=null;try{save()}catch(e){}neToast(navn+(vis?' vises igen på scenen':' er skjult på scenen (reglerne regner videre)'),false);ne2Byg()}
/* Motorens tal går uændret videre; kun tegningen af en skjult effekt-gruppe får 0 */
{const gl=blinkE;window.blinkE=function(E){const g=ne12Grp();if(Object.keys(g).some(n=>g[n]&&g[n].skjult)){E=Object.assign({},E);Object.keys(E).forEach(k=>{if(!k.startsWith('obj:')&&!k.startsWith('liv:')&&ne12Skjult(k))E[k]=0})}return gl(E)}}
/* Slukket: scenerne tegner ikke */
function ne12Sort(c){try{const g=c.getContext('2d');if(!g)return;g.setTransform(1,0,0,1,0,0);g.fillStyle=(NE2.farver&&NE2.farver.skaerm)||ne2Farver().skaerm;g.fillRect(0,0,c.width,c.height)}catch(e){}}
{const gl=Rytme.tegnScene;Rytme.tegnScene=function(g,W,Hh,S){if(ne12Sluk('w2')&&g&&g.canvas&&g.canvas.id==='pv'){ne12Sort(g.canvas);return}return gl.apply(this,arguments)}}
{const gl=drawMesh;window.drawMesh=function(){if(ne12Sluk('w5')&&!meshCv){if(!NE12.meshSort){NE12.meshSort=1;ne12Sort($('mesh'))}return}NE12.meshSort=0;return gl.apply(this,arguments)}}
{const gl=m3Tik;window.m3Tik=function(){if(ne12Sluk('w28'))return;return gl.apply(this,arguments)}}
{const gl=ojTik;window.ojTik=function(){if(ne12Sluk('w29'))return;return gl.apply(this,arguments)}}
{const gl=m3Synlig;window.m3Synlig=function(){return NE12.tvang==='w28'||gl()}}
{const gl=ojSynlig;window.ojSynlig=function(){return NE12.tvang==='w29'||gl()}}
function ne12SlukVindue(){NE12_SC.forEach(([id])=>{const w=$(id);if(!w)return;const s=ne12Sluk(id);if(s&&!w.dataset.neTema&&NE.tema){neTemaVars(w,NE.tema);w.dataset.neTema='1'}w.classList.toggle('ne-sc-sluk',s)})}
function neSaetSluk(id,sluk){set.ne=set.ne||{};const L=Array.isArray(set.ne.sluk)?set.ne.sluk.filter(x=>x!==id):[];if(sluk)L.push(id);if(L.length)set.ne.sluk=L;else delete set.ne.sluk;NE12.meshSort=0;
 try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}ne12SlukVindue();neToast(ne12Navn(id)+(sluk?' er slukket: scenen tegner ikke, så computeren sparer kræfter':' tegner igen'),true);ne2Byg()}
/* Billedet af en scene i et lille lærred (beskåret, så det fylder) */
function ne12Kopi(src,c){if(!src||!c||!src.width||!src.height)return false;const g=c.getContext('2d'),fz=c._f||1,W=c.width/fz,H=c.height/fz;g.setTransform(fz,0,0,fz,0,0);const s=Math.max(W/src.width,H/src.height),w=src.width*s,h=src.height*s;try{g.drawImage(src,(W-w)/2,(H-h)/2,w,h);return true}catch(e){return false}}
/* Mesh 3D og Øjet tegner kun, når de kan ses. Til baggrunden tegnes de et kort øjeblik i lille størrelse (motorens hakke-måler røres ikke). */
function ne12Tving(id,W,H){const sy=id==='w28'?m3Synlig:ojSynlig;if(sy())return $(id==='w28'?'m3cv':'ojcv');const M=id==='w28'?M3:OJ,gem={kval:M.kval,tung:M.tung,let:M.let,dtEma:M.dtEma,kvalBesked:M.kvalBesked};
 NE12.tvang=id;try{M.sidstT=performance.now()/1000-.1;return id==='w28'?m3TilUd(W,H):ojTilUd(W,H)}catch(e){return null}finally{NE12.tvang=null;Object.assign(M,gem)}}
/* Model: scene-noder og links fra figurer og effekt-grupper */
{const gl=ne2Model;window.ne2Model=function(){const R=gl(),N=R.N,L=R.L;ne12Vises().forEach(s=>{const k='s:'+s.id;N.set(k,{key:k,kol:'scene',sc:s.id,navn:ne12Navn(s.id),hvor:s.hvor,ud:s.ud,regler:[]})});
 if(N.has('s:w2'))N.forEach(n=>{if(n.kol==='figur')L.push({fra:n.key,fp:'ud',til:'s:w2',tp:'ind',kilde:'s',gruppe:n.gruppe})});return R}}
{const gl=ne2Sig;window.ne2Sig=function(){let x='';try{x=JSON.stringify([ne12Vises(),set.ne&&set.ne.sluk,fase2.objekter.map(o=>o.neFra?1:0)])}catch(e){}return gl()+'#12'+x}}
{const gl=ne2Placer;window.ne2Placer=function(){gl();const G=+NE.tema.maal.gitter||8,N=NE2.N,P=NE.pos||{},x0=(NE.kol.find(c=>c.k==='scene')||{x:0}).x;let y=0;
 N.forEach(n=>{if(n.kol!=='scene')return;const p=P[n.key];n.x=p&&Number.isFinite(p[0])?p[0]:x0;n.y=p&&Number.isFinite(p[1])?p[1]:y;n.flyttet=!!p;y+=(n.el&&n.el.offsetHeight?Math.ceil(n.el.offsetHeight/G)*G:320)+3*G});
 NE2.hoejde=Math.max(NE2.hoejde||0,y)}}
{const gl=ne2Kaede;window.ne2Kaede=function(){gl();const N=NE2.N,k=NE2.valgt;if(!k||!N.has('s:w2'))return;const n=N.get(k);let S=NE2.kaede||new Set([k]);
 if(n&&n.kol==='scene'){if(k==='s:w2')N.forEach(x=>{if(x.kol==='figur')S.add(x.key)})}else if([...S].some(x=>(N.get(x)||{}).kol==='figur'))S.add('s:w2');NE2.kaede=S}}
/* Noderne */
function ne12NodeHtml(n){const sl=ne12Sluk(n.sc),tabt=ne12Tabt(n.sc),w=+NE.tema.maal.bredde.bred||440,antal=[...NE2.N.values()].filter(x=>x.kol==='figur').length;
 const st=[n.hvor==='scene'?'Vises i Scene':n.hvor==='vindue'?'Eget vindue':'',n.ud?'Sendt til skærm':''].filter(Boolean).join(' · ');
 const vaelg='<select class="ne-vaelg" data-ne12="vaelg" data-sc="'+n.sc+'" aria-label="Vælg scene" title="Vælg, hvilken scene Scene-vinduet viser. Kun de 5 scener kan vises; EQ og EQ+ er værktøjer.">'+NE12_SC.map(([id,nv])=>'<option value="'+id+'"'+(id===n.sc?' selected':'')+'>'+neHtml(nv)+' ▾</option>').join('')+'</select>';
 return '<div class="ne-node ne-n-scene'+(sl?' ne-slukket':'')+(tabt?' ne-ikke-tilg':'')+'" data-n="'+neHtml(n.key)+'" tabindex="0" role="button" aria-label="Scene '+neHtml(n.navn)+'" style="--nf:var(--ne-kolonne-scene);width:'+w+'px"><div class="ne-nh"><b class="ne-nt">Scene</b>'+vaelg+'</div>'
  +'<div class="ne-skaerm ne-sc-skaerm">'+(tabt?'<span class="ne-sc-tekst">Kræver 3D (WebGL)</span>':'<canvas class="ne-sc-billede" width="416" height="234" data-ne12="billede" title="Klik for at åbne '+neHtml(n.navn)+' stort (layoutet Show)."></canvas>')+'</div>'
  +'<div class="ne-bund">'+neHtml(n.navn)+(sl?' · Slukket: tegner ikke':st?' · '+neHtml(st):'')+' · '+(n.sc==='w2'?antal+(antal===1?' figur eller gruppe':' figurer og grupper'):'viser lyden direkte, ikke figurerne')+'</div><i class="ne-port ind" data-p="ind"></i></div>'}
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){if(n.kol==='scene')return ne12NodeHtml(n);let h=gl(n);if(n.kol!=='figur'||n.parkeret)return h;const sk=neFigSkjult(n.key),fra=neFigFra(n.key);
 const knap='<button class="ne-oeje'+(sk?' ne-lukket':'')+'" data-ne12="oeje" data-k="'+neHtml(n.key)+'" aria-pressed="'+!sk+'" title="'+(sk?'Skjult: vises ikke på scenen. Klik for at vise.':'Synlig på scenen. Klik for at skjule (reglerne regner videre).')+'">'+(sk?'⊘':'◉')+'</button>';
 if(/<span class="ne-oeje"[^>]*>[^<]*<\/span>/.test(h))h=h.replace(/<span class="ne-oeje"[^>]*>[^<]*<\/span>/,knap);else h=h.replace('</b>','</b>'+knap);
 h=h.replace('class="ne-node ne-n-figur','class="ne-node ne-n-figur'+(fra?' ne-fig-fra':'')+(sk?' ne-skjult':''));if(fra)h=h.replace('<div class="ne-bund">','<div class="ne-bund"><span class="ne-gul">Slået fra</span> · ');return h}}
/* Kontrolpanelet */
{const gl=ne2Saetning;window.ne2Saetning=function(n){if(n.kol==='scene'){const st=ne12Sluk(n.sc)?' Den er <span class="ne-gul">slukket</span>: den tegner ikke, så computeren sparer kræfter.':'';return '<b class="ne-s-figur">'+neHtml(n.navn)+'</b> '+(n.hvor==='scene'?'vises i Scene-vinduet':n.hvor==='vindue'?'er sit eget vindue':'vises kun')+(n.ud?' og i udgangsvinduet (Send til skærm)':'')+'. '+(n.sc==='w2'?'Den tegner figurerne og effekt-grupperne.':'Den viser lyden direkte, ikke figurerne.')+st}
 let s=gl(n);if(n.kol==='figur'&&neFigFra(n.key))s='<span class="ne-gul">Slået fra.</span> '+s+' Den står stille, men kan ses.';return s}}
{const gl=ne2Kp;window.ne2Kp=function(ny){gl(ny);const n=NE2.valgt&&NE2.N.get(NE2.valgt),kp=$('ne-kp');if(!n||!kp)return;const box=kp.querySelector('.ne-kp-ind');
 if(n.kol==='scene'){const t=kp.querySelector('.ne-kp-titel');if(t)t.textContent='Kontrolpanelet · Scene · '+n.navn;if(!box)return;const sl=ne12Sluk(n.sc),ude=!scIScene(n.sc),kanUd=!!SC_UD[n.sc];
  box.innerHTML='<small>Scenen</small><div class="ne-kp-svag">Scenen vises i 2 · Scene og 4 · Show; vælgeren på noden skifter fanen. Send til skærm, ⤢ Stor og ⛶ Fuld skærm sidder i zonens bjælke.</div>';return}/* v9.81: Riv løs, Send til skærm, Sluk og Åbn stort er fjernet fra scene-noden */
 if(n.kol==='figur'&&box){const sk=neFigSkjult(n.key),fra=neFigFra(n.key);box.insertAdjacentHTML('afterbegin','<small>Øje og Slå fra</small><div class="ne-ret-knapper"><button class="ne-k'+(sk?'':' ne-paa')+'" data-ne12="oeje" data-k="'+neHtml(n.key)+'" aria-pressed="'+!sk+'" title="Øjet: '+(n.gruppe?'skjuler gruppens effekter på scenen':'det samme som Læg på scenen / Tag af scenen')+'. Reglerne regner videre.">'+(sk?'⊘ Skjult':'◉ Synlig')+'</button><button class="ne-k'+(fra?' ne-paa':'')+'" data-ne12="fra" data-k="'+neHtml(n.key)+'" aria-pressed="'+fra+'" title="Slå fra: alle '+n.regler.length+' regler giver 0, så '+(n.gruppe?'gruppen':'figuren')+' står stille, men kan ses.">'+(fra?'Slå til':'Slå fra')+'</button></div>')}}}
/* + Tilføj og Ctrl+K i Scene-kolonnen */
{const gl=ne6Valg;window.ne6Valg=function(kol){if(kol!=='scene')return gl(kol);const V=ne12Vises().map(s=>s.id);return [['Scener (kun disse 5 kan vises)',NE12_SC.map(([id,nv])=>['s:'+id,nv+(V.includes(id)?' · vises':''),'Vis '+nv+' i Scene-vinduet'])]]}}
{const gl=ne6Valgt;window.ne6Valgt=function(kol,v){if(kol!=='scene'||!String(v).startsWith('s:'))return gl(kol,v);ne12Vis(String(v).slice(2))}}
function ne12Vis(id){const w=$(id);if(!w)return;if(scIScene(id))scVaelg(id,true);else{w.hidden=false;if(w.classList.contains('min'))try{miniSaet(w,false)}catch(e){}w.style.zIndex=++zTop}neToast(ne12Navn(id)+' vises nu'+(scIScene(id)?' i Scene':' i sit eget vindue'),true);ne2Byg();setTimeout(()=>{if(NE2.N.has('s:'+id))neVaelg('s:'+id)},50)}
function ne12Stort(id){if(!$(id))return;if(scIScene(id)){scVaelg(id,true);try{lay3Anvend('show')}catch(e){}neToast(ne12Navn(id)+' vises stort (layoutet Show). Tilbage: Noder i topbjælken.',true)}else{$(id).style.zIndex=++zTop;neToast(ne12Navn(id)+' er lagt øverst',true)}}
{const gl=ne2Hoveder;window.ne2Hoveder=function(){gl();const n=[...NE2.N.values()].filter(x=>x.kol==='scene').length,h=document.querySelector('#ne-hoveder .ne-hoved[data-kol="scene"] .ne-naar');if(h){h.textContent=n?n+(n===1?' scene vises':' scener vises'):'Ingen scene vises';h.title='Én scene-node for hver scene, der vises (fanen i Scene, et løsrevet vindue eller udgangsvinduet).'}
 const b=document.querySelector('#ne-hoveder .ne-tilfoej[data-ne6="scene"]');if(b)b.title='Vis en scene: Live preview, Radial Mesh, Mesh 3D, Øjet eller Lyd i 3D'}}
/* Levende: billederne, links til scenen, slukkede figurer og baggrunden */
{const gl=ne3Tik;window.ne3Tik=function(t){gl(t);const N=NE2.N;
 NE2.L.forEach(l=>{if(l.kilde==='s'){const a=N.get(l.fra);l.vNu=a&&!neFigSkjult(a.key)&&!neFigFra(a.key)?(a.vNu||0):0}});
 N.forEach(n=>{if(n.kol==='regel'&&n.el&&n.m&&!n.m.off&&(neFraF(n.m)||neLtFraF(n.m)))n.el.classList.add('ne-slukket');if(n.kol==='lydtraek'&&n.el)n.el.classList.toggle('ne-slukket',neLtFra(n.band))});
 if(t-NE12.tBil>250){NE12.tBil=t;N.forEach(n=>{if(n.kol!=='scene'||!n.el||ne12Sluk(n.sc))return;const c=n.el.querySelector('.ne-sc-billede'),k=NE12_SC.find(s=>s[0]===n.sc);if(c&&k)ne12Kopi($(k[2]),c)})}
 if(t-NE12.tBg>200){NE12.tBg=t;ne12Bg()}}}
function ne12Bg(){const v=(set.ne&&set.ne.bg)||'fra',c=$('ne-bg'),fl=$('ne-flade');if(!c||!fl)return;c.hidden=v==='fra';if(v==='fra')return;const W=Math.max(2,fl.clientWidth),H=Math.max(2,fl.clientHeight);if(c.width!==W||c.height!==H){c.width=W;c.height=H}
 let src=null;if(v==='dublet')src=$('pv');else{const id=v==='mesh3d'?'w28':'w29';if(!ne12Sluk(id)&&!ne12Tabt(id))src=ne12Tving(id,Math.min(640,W),Math.min(360,H))}
 if(!src){c.getContext('2d').clearRect(0,0,W,H);return}ne12Kopi(src,c)}
function neSaetBg(v){set.ne=set.ne||{};if(v==='fra')delete set.ne.bg;else set.ne.bg=v;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}const s=$('ne-bg-v');if(s)s.value=v;NE12.tBg=0;ne12Bg();neToast('Baggrund: '+(NE12_BG.find(b=>b[0]===v)||[0,v])[1],true)}
function ne12Start(){const rod=$('ne'),fl=$('ne-flade'),ms=$('ne-master');if(!rod||!fl||!ms||!NE.byg){setTimeout(ne12Start,300);return}
 const tr=document.querySelector('#ne .ne-trin');if(tr)tr.textContent='Node-editoren · docking og fuld skærm';
 if(!$('ne-bg')){const c=document.createElement('canvas');c.id='ne-bg';c.className='ne-bg';c.hidden=true;c.setAttribute('aria-hidden','true');fl.insertBefore(c,fl.firstChild)}
 if(!$('ne-bg-v')){const v=(set.ne&&set.ne.bg)||'fra';ms.closest('.ne-vgrp').insertAdjacentHTML('afterend','<label class="ne-vgrp" title="Baggrund: en scene svagt bag noderne. Mesh 3D og Øjet tegnes kun til baggrunden, når du har valgt dem."><small>Baggrund</small><select id="ne-bg-v" class="ne-vaelg" aria-label="Baggrund bag noderne">'+NE12_BG.map(([k,n])=>'<option value="'+k+'"'+(k===v?' selected':'')+'>'+n+' ▾</option>').join('')+'</select></label>')}
 ne12SlukVindue();
 rod.addEventListener('change',e=>{const s=e.target;if(s.id==='ne-bg-v'){neSaetBg(s.value);return}if(s.dataset&&s.dataset.ne12==='vaelg'){const id=s.value;if(id!==s.dataset.sc)ne12Vis(id)}});
 /* noden fanger musen (pointer capture), så klikket rammer noden: billedet huskes ved pointerdown */
 rod.addEventListener('pointerdown',e=>{const b=e.target.closest('[data-ne12="billede"]');NE12.ned=b?[e.clientX,e.clientY,b.closest('.ne-node').dataset.n]:null},true);
 rod.addEventListener('click',e=>{const d=NE12.ned;NE12.ned=null;if(d){if(Math.hypot(e.clientX-d[0],e.clientY-d[1])<=4)setTimeout(()=>ne12Stort(d[2].slice(2)),0);return}
  const b=e.target.closest('[data-ne12]');if(!b||b.tagName==='SELECT'||b.tagName==='CANVAS')return;const a=b.dataset.ne12;
  e.stopPropagation();if(a==='oeje')neSaetOeje(b.dataset.k,neFigSkjult(b.dataset.k));else if(a==='fra')neSaetFra(b.dataset.k,!neFigFra(b.dataset.k));else if(a==='sluk')neSaetSluk(b.dataset.sc,!ne12Sluk(b.dataset.sc));else if(a==='stort')ne12Stort(b.dataset.sc);
  else if(a==='riv'){const id=b.dataset.sc;if(scIScene(id))scRiv(id);else scTilbage(id);setTimeout(()=>{ne2Byg();if(NE2.N.has('s:'+id))neVaelg('s:'+id)},80)}
  else if(a==='ud'){const k=SC_UD[b.dataset.sc],sel=$('ud-kilde');if(!k||!sel)return;sel.value=k;sel.dispatchEvent(new Event('change',{bubbles:true}));try{udgangStart()}catch(x){}neToast(ne12Navn(b.dataset.sc)+' vises i udgangsvinduet. Træk det over på den eksterne skærm.',true)}},true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ne12Start,0));else setTimeout(ne12Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 12): SCENE-NODER OG EFFEKT-GRUPPER ========== */
