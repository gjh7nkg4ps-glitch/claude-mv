/* ========== v9.24: NODE-EDITOR (TRIN 6): + TILFØJ OG CTRL+K ==========
   Trin 6 af 16 (docs/PLAN-NODE-EDITOREN.md, papirets afsnit 5.2): noder kan tilføjes, før en regel bruger dem.
   - "+ Tilføj" i hver kolonnes overskrift (så den altid kan ses; papiret har den under kolonnen) åbner Tilføj-listen (vores navn) med kun det, der passer
     i kolonnen: lydkilder (Vælg lydfil, Start generatoren, MIDI, Morph Pad, Tastatur), lydtræk (alle kilder, med søgefelt), en ny regel (Handling eller
     Egenskab, uden kilde endnu), figurer og effekt-grupper, og mål (alle mål, grupperet efter figur). FFT og analyser findes altid; dem viser listen bare.
   - Ctrl+K (søgelisten fra v6.3) har nu to grupper: "Tilføj node" (med typefarve og en lille levende bar) og "Knapper" (de gamle punkter og de nye
     kommandoer: Ryd hold, Ryd tomme mål, Tilfældigt (slag, flydende, figur-egenskaber), Kør Auto-mapping, Placér og Tilpas).
   - En tilføjet node er en løs node (vores navn): den står i set.ne.loese og vises, selv om ingen regel bruger den. Den lander nederst i sin kolonne,
     kortet flytter sig derhen, og noden lyser kort op. Et mål uden regler står tonet ned med "Ingen regler"; Ryd tomme mål fjerner dem.
   - En ny regel uden kilde får en, når man slipper et lydtræk på den. Løse noder ændrer ikke maps. Tilfældigt og Kør Auto-mapping kan fortrydes i ét trin. */
const NE6={blink:null};
/* ne6Loese(true) opretter listen (når noget tilføjes); ellers læses den bare, så set.ne ikke laves ved opstart */
function ne6Loese(lav){if(!lav)return (set.ne&&Array.isArray(set.ne.loese))?set.ne.loese:[];set.ne=set.ne||{};if(!Array.isArray(set.ne.loese))set.ne.loese=[];return set.ne.loese}
/* Modellen: de løse noder */
{const gl=ne2Model;window.ne2Model=function(){const R=gl(),N=R.N,L=R.L;const add=(k,o)=>{if(!N.has(k))N.set(k,Object.assign({key:k,regler:[],los:true},o));return N.get(k)};
 const figur=fk=>{if(N.has(fk))return N.get(fk);if(fk.startsWith('g:')){return add(fk,{kol:'figur',navn:fk.slice(2),obj:null,gruppe:true,maal:[]})}const id=fk.slice(2),o=(fase2.objekter||[]).find(x=>x.id===id);return add(fk,{kol:'figur',navn:o?o.navn:id,obj:o||null,gruppe:false,maal:[]})};
 ne6Loese().forEach(k=>{try{
  if(k.startsWith('l:')&&!N.has(k)){const band=k.slice(2),lt=add(k,{kol:'lydtraek',band});const h=ne3Hjem(band);if(h&&N.has(h[0])){L.push({fra:h[0],fp:h[1],til:k,tp:'ind',kilde:h[0].startsWith('k:')?'k':'a',band});lt.hjem=h[0]}}
  else if((k.startsWith('f:')||k.startsWith('g:'))&&!N.has(k))figur(k);
  else if(k.startsWith('m:')&&!N.has(k)){const e=k.slice(2),fg=neFigurAf(e),f=figur(fg.key);add(k,{kol:'maal',effect:e,figur:fg.key,gruppe:fg.gruppe});if(!f.maal.includes(k)){f.maal.push(k);L.push({fra:fg.key,fp:'ud',til:k,tp:'ind',kilde:'f',gruppe:fg.gruppe})}}
  else if(/^k:(midi|pad|tast)$/.test(k)&&!N.has(k)){const b=NE3_BLAA.find(x=>'k:'+x[0]===k);if(b)add(k,{kol:'lydkilde',kildeType:b[0],navn:b[1],rows:b[2],blaa:true})}}catch(e){}});
 return R}}
/* Et mål uden regler: tonet ned med "Ingen regler" */
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){if(n.kol==='maal'&&!n.regler.length){const fig=NE2.N.get(n.figur);return '<div class="ne-node ne-n-maal ne-tom" data-n="'+neHtml(n.key)+'" tabindex="0" role="button" aria-label="Mål '+neHtml(neMaalNavn(n.effect))+' uden regler" style="--nf:'+(n.gruppe?'var(--ne-kolonne-midiOgEffekter)':'var(--ne-kolonne-maal)')+';width:'+(+NE.tema.maal.bredde.normal||320)+'px"><div class="ne-nh"><b class="ne-nt">'+neHtml(neMaalNavn(n.effect))+'</b></div><div class="ne-skaerm"><span class="ne-mtekst">Ingen regler</span></div><div class="ne-bund">'+neHtml(fig?fig.navn:'')+' · træk et link hertil fra et lydtræk eller en regel</div><i class="ne-port ind" data-p="ind"></i><i class="ne-port ud" data-p="ud"></i></div>'}return gl(n)}}
{const gl=ne2Saetning;window.ne2Saetning=function(n){if(n.kol==='maal'&&!n.regler.length)return '<b class="ne-s-maal">'+neHtml(neMaalNavn(n.effect))+'</b> har ingen regler endnu. Træk et link hertil fra et lydtræk eller fra en regels udgang. Tomme mål fjernes med Ryd tomme mål (Ctrl+K).';
 if(n.kladde&&!n.kladde.band)return 'Den nye regel mangler både kilde og mål. Slip et lydtræk på den (træk fra lydtrækkets udgang ●), og træk så fra reglens udgang til en figur.';return gl(n)}}
/* Tilføj en node: læg den nederst i sin kolonne, flyt kortet derhen og lad den lyse kort op */
function neTilfoej(key,kol){const L=ne6Loese(true);const findes=NE2.N.has(key);if(!findes&&!L.includes(key)){L.push(key)}
 if(!findes&&!NE.pos[key]){const G=+NE.tema.maal.gitter||8,c=NE.kol.find(x=>x.k===kol),bund=Math.max(0,...[...NE2.N.values()].filter(n=>n.kol===kol).map(n=>(n.y||0)+(n.h||120)));NE.pos[key]=[c?c.x:0,Math.ceil((bund+3*G)/G)*G]}
 neGem();ne2Byg();neVisNode(key,!findes);return key}
function neVisNode(key,ny){const n=NE2.N.get(key),fl=$('ne-flade');if(!n||!fl)return;if(NE.z<.5)NE.z=.7;NE.tilpas=false;NE.x=Math.round(fl.clientWidth/2-(n.x+(n.w||320)/2)*NE.z);NE.y=Math.round(Math.min(fl.clientHeight*.4,fl.clientHeight/2)-(n.y+(n.h||120)/2)*NE.z);neVis();neGem();
 n.el.classList.remove('ne-blink');void n.el.offsetWidth;n.el.classList.add('ne-blink');clearTimeout(NE6.blink);NE6.blink=setTimeout(()=>{const x=NE2.N.get(key);if(x&&x.el)x.el.classList.remove('ne-blink')},1600);if(ny)neToast('Tilføjet: '+ne6Navn(key)+' (nederst i kolonnen)',true)}
function ne6Navn(k){if(k.startsWith('l:'))return 'Lydtræk '+neLtNavn(k.slice(2));if(k.startsWith('m:'))return 'Mål '+neMaalNavn(k.slice(2));if(k.startsWith('g:'))return 'Effekt-gruppe '+k.slice(2);if(k.startsWith('f:')){const o=(fase2.objekter||[]).find(x=>x.id===k.slice(2));return 'Figur '+(o?o.navn:k.slice(2))}const b=NE3_BLAA.find(x=>'k:'+x[0]===k);return b?b[1]:k}
function neVisNodeEfterByg(k){setTimeout(()=>neVisNode(k,false),0)}
function neNyKladde(slags){const G=+NE.tema.maal.gitter||8,c=NE.kol.find(x=>x.k==='regel'),bund=Math.max(0,...[...NE2.N.values()].filter(n=>n.kol==='regel').map(n=>(n.y||0)+(n.h||150)));const k={key:'d:'+(++NE5.n),band:null,slags};NE5.kladder.push(k);NE.pos[k.key]=[c.x,Math.ceil((bund+3*G)/G)*G];NE2.valgt=k.key;ne2Byg();neVisNode(k.key,false);neToast('Ny regel: slip et lydtræk på den, og træk så fra dens udgang til en figur',true);return k}
function neRydTommeMaal(){const L=ne6Loese(true),før=L.length;set.ne.loese=L.filter(k=>!(k.startsWith('m:')&&!maps.some(m=>m.effect===k.slice(2))));const n=før-set.ne.loese.length;neGem();ne2Byg();neToast(n?'Ryd tomme mål: '+n+(n===1?' mål':' mål')+' uden regler er fjernet':'Der er ingen tomme mål',true);return n}
/* Hvad hver kolonne kan tilføje: [gruppe, [[værdi, tekst, forklaring]]] */
function ne6Valg(kol){const brugt=k=>NE2.N.has(k);
 if(kol==='lydkilde')return [['Lyd',[['fil','Vælg lydfil …','Den lyd, der er i brug, skifter til en lydfil.'],['gen','Start generatoren','Programmet laver selv musikken.']]],['Tæller ikke som lydkilde',NE3_BLAA.map(b=>['k:'+b[0],b[1]+(brugt('k:'+b[0])?' · findes':''),b[1]])]];
 if(kol==='fft')return [['Findes altid',[['f:hurtig','FFT · hurtig (2048) · findes'],['f:fin','FFT · fin (8192) · findes']]]];
 if(kol==='analyse')return [['Findes altid',NE3_ANA.map(a=>['a:'+a[0],a[1]+' · findes'])]];
 if(kol==='lydtraek'){let ks=[];try{ks=r2Orden(r2AlleKilder())}catch(e){ks=BANDS.map(b=>b[0])}const G={};ks.forEach(k=>{let mp='Andet';try{mp=sigInfo(k).mappe}catch(e){}(G[mp]=G[mp]||[]).push(['l:'+k,neLtNavn(k)+(brugt('l:'+k)?' · findes':'')])});return Object.keys(G).map(g=>[g,G[g]])}
 if(kol==='regel')return [['Regel',[['handling','Regel · Handling','Slår til én gang, når lyden rammer.'],['egenskab','Regel · Egenskab','Følger lyden hele tiden.']]]];
 if(kol==='figur')return [['Figurer',(fase2.objekter||[]).filter(o=>!o.skabelon).map(o=>['f:'+o.id,o.navn+(brugt('f:'+o.id)?' · findes':'')])],['Effekt-grupper',NE2_GRUPPER.slice(0,5).map(g=>['g:'+g,g+(brugt('g:'+g)?' · findes':'')])]];
 if(kol==='maal'){try{syncTargets()}catch(e){}const G={};TARGETS.forEach(t=>{const fg=neFigurAf(t.id);(G[fg.navn]=G[fg.navn]||[]).push(['m:'+t.id,neMaalNavn(t.id)+(brugt('m:'+t.id)?' · findes':'')])});return Object.keys(G).map(g=>[g,G[g]])}
 return [['Kommer senere',[['','Scene-noder kommer i trin 12 (v9.30)']]]]}
function ne6Valgt(kol,v){if(!v)return;if(kol==='lydkilde'){if(v==='fil'){const f=$('file');if(f)f.click();return}if(v==='gen'){try{gStart()}catch(e){}return}return neTilfoej(v,'lydkilde')}
 if(kol==='fft'||kol==='analyse')return neVisNode(v,false);if(kol==='regel')return neNyKladde(v);return neTilfoej(v,kol)}
/* Søgelisten (Ctrl+K): punkterne i gruppen "Tilføj node" */
function neKpPunkter(L){if(!NE.byg)return;const vis=fn=>()=>{try{fgVaelg('lyd','w33',true);fgVisHost('lyd')}catch(e){}setTimeout(fn,60)},farve=k=>'var(--ne-kolonne-'+k+')';
 const p=(n,kat,kol,band,fn,f)=>L.push({n,kat,fn:vis(fn),ne:{farve:f||farve(kol),band}});
 let ks=[];try{ks=r2AlleKilder()}catch(e){ks=BANDS.map(b=>b[0])}ks.forEach(k=>{const h=ne3Hjem(k),fra=h?(NE2.N.get(h[0])?(NE2.N.get(h[0]).ana?NE2.N.get(h[0]).ana[1]:NE2.N.get(h[0]).navn||'Lydkilde'):''):'';p('Lydtræk: '+neLtNavn(k),'Tilføj node · Lydtræk'+(fra?' · fra '+fra:''),'lydtraek',k,()=>neTilfoej('l:'+k,'lydtraek'),'var(--ne-lydtraekType-'+neLtType(k)+')')});
 p('Regel · Handling (ny)','Tilføj node · Regel','regel',null,()=>neNyKladde('handling'));p('Regel · Egenskab (ny)','Tilføj node · Regel','regel',null,()=>neNyKladde('egenskab'));
 (fase2.objekter||[]).filter(o=>!o.skabelon).forEach(o=>p('Figur: '+o.navn,'Tilføj node · Figur','figur',null,()=>neTilfoej('f:'+o.id,'figur')));
 NE2_GRUPPER.slice(0,5).forEach(g=>p('Effekt-gruppe: '+g,'Tilføj node · Figur','figur',null,()=>neTilfoej('g:'+g,'figur'),'var(--ne-kolonne-midiOgEffekter)'));
 try{syncTargets()}catch(e){}TARGETS.forEach(t=>{const fg=neFigurAf(t.id);p('Mål: '+neMaalNavn(t.id)+' · '+fg.navn,'Tilføj node · Mål','maal',null,()=>neTilfoej('m:'+t.id,'maal'),fg.gruppe?'var(--ne-kolonne-midiOgEffekter)':null)});
 NE3_BLAA.forEach(b=>p(b[1],'Tilføj node · Lydkilde (tæller ikke som lydkilde)','lydkilde',null,()=>neTilfoej('k:'+b[0],'lydkilde'),'var(--ne-kolonne-midiOgEffekter)'));
 NE3_ANA.forEach(a=>p('Analyse: '+a[1]+' (findes)','Tilføj node · Analyse','analyse',null,()=>neVisNode('a:'+a[0],false)));
 /* Knapper */
 const k=(n,ikon,fn)=>L.push({n,kat:'Knapper · Node-editor',fn:vis(fn),ikon});
 if($('hold-ryd'))k('Ryd hold (alle regler)','⟲',()=>{$('hold-ryd').click();neToast('Ryd hold: alle regler med Hold er sat til 0')});
 k('Ryd tomme mål','⌫',()=>neRydTommeMaal());
 [['rnd-slag','Tilfældigt: slag'],['rnd-flyd','Tilfældigt: flydende'],['rnd-fig','Tilfældigt: figur-egenskaber']].forEach(([id,n])=>{if($(id))k(n,'⚄',()=>{$(id).click();neToast(n+' · Fortryd med Ctrl+Z')})});
 k('Foreslå regler (stiplede celler i matrixen; intet ændres, før du siger ja)','✦',()=>fsForeslaa());
 k('Placér alle noder automatisk','▦',()=>neAutoPlacer());k('Tilpas: vis alle noder','⤢',()=>neTilpas())}
/* Søgelisten: sæt temaets farver på den, og lad de små barer leve, mens den er åben */
function ne6KpTik(){const kp=$('kp');if(!kp||kp.hidden)return;if(NE.tema&&!kp.dataset.neTema){neTemaVars(kp,NE.tema);kp.dataset.neTema='1'}kp.querySelectorAll('.kp-bar[data-kpb] u').forEach(u=>{let v=0;try{v=Math.max(0,Math.min(1,+bandV(u.parentNode.dataset.kpb)||0))}catch(e){}u.style.width=(v*100).toFixed(0)+'%'})}
/* "+ Tilføj" i kolonnernes overskrifter */
function ne6Start(){const hv=$('ne-hoveder'),fl=$('ne-flade');if(!hv)return;
 hv.querySelectorAll('.ne-hoved').forEach(h=>{const kol=h.dataset.kol;const b=document.createElement('button');b.className='ne-tilfoej';b.dataset.ne6=kol;b.textContent='+ Tilføj';b.title=kol==='scene'?'Scene-noder kommer i trin 12':'Tilføj en node i kolonnen '+h.querySelector('.ne-hnavn').textContent;h.querySelector('.ne-hnavn').appendChild(b)});
 hv.addEventListener('click',e=>{const b=e.target.closest('[data-ne6]');if(!b)return;e.stopPropagation();const kol=b.dataset.ne6,r=b.getBoundingClientRect(),f=fl.getBoundingClientRect();const v=ne6Valg(kol),mange=v.reduce((s,g)=>s+g[1].length,0)>8;
  ne5Menu(r.left-f.left,r.bottom-f.top+4,'Tilføj · '+(NE.kol.find(c=>c.k===kol)||{navn:kol}).navn,v,x=>ne6Valgt(kol,x),mange)});
 hv.addEventListener('pointerdown',e=>{if(e.target.closest('[data-ne6]'))e.stopPropagation()});
 /* Lærredet må aldrig rulle af sig selv (overflow: hidden kan stadig rulles, når noget inde i det får fokus); kun zoom og træk flytter det. */
 fl.addEventListener('scroll',()=>{if(fl.scrollLeft||fl.scrollTop){fl.scrollLeft=0;fl.scrollTop=0}});
 setInterval(ne6KpTik,120)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne6Start);else setTimeout(ne6Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 6): + TILFØJ OG CTRL+K ========== */
