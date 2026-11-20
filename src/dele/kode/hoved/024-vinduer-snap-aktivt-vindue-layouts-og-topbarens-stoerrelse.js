/* ========== VINDUER: snap, aktivt vindue, layouts og topbarens størrelse ========== */
/* Snap: træk et vindue til en kant eller et hjørne (venstre og højre kant: halvdele; hjørner: kvarte; øverste kant: maksimér; nederste kant: nederste halvdel), eller brug knappen ▦ i overskriften. Arbejdsområdet er alt under topbaren. Et snappet vindue gendanner sin gamle størrelse, når man trækker i det. Layouts gemmer alle vinduers placering, størrelse, minimering og maksimering (i lageret rytme-layouts) og kan hentes igen; fem færdige layouts følger med. Topbaren har tre størrelser (fuld, kompakt og minimal) og kan fastgøres eller skjules automatisk. */
const SNAP_VALG=[['v','Venstre halvdel'],['h','Højre halvdel'],['o','Øverste halvdel'],['n','Nederste halvdel'],['vo','Øverst til venstre'],['ho','Øverst til højre'],['vn','Nederst til venstre'],['hn','Nederst til højre'],['fuld','Fuld (maksimér)'],['gendan','Gendan størrelse']];
function snapRect(type){const ws=$('ws'),R=ws.getBoundingClientRect(),tb=tbHoejde(),top0=Math.max(tb,R.top),W=ws.clientWidth||innerWidth,BB=$('tp')?$('tp').offsetHeight:0,H=innerHeight-top0-BB,x0=R.left,hx=W/2,hy=H/2;
 const m={v:[0,0,hx,H],h:[hx,0,W-hx,H],o:[0,0,W,hy],n:[0,hy,W,H-hy],vo:[0,0,hx,hy],ho:[hx,0,W-hx,hy],vn:[0,hy,hx,H-hy],hn:[hx,hy,W-hx,H-hy]}[type];if(!m)return null;
 return{vx:x0+m[0],vy:top0+m[1],w:m[2],h:m[3],x:m[0],y:top0+m[1]-R.top+($('ws').scrollTop||0)}}
function snapMaal(x,y){const tb=tbHoejde(),SB=$('sb')?$('sb').offsetWidth:0,BB=$('tp')?$('tp').offsetHeight:0,L=x<=SB+24,Hh=x>=innerWidth-24,T=y<=tb+24,B=y>=innerHeight-BB-24;
 if(L&&T)return'vo';if(Hh&&T)return'ho';if(L&&B)return'vn';if(Hh&&B)return'hn';if(L)return'v';if(Hh)return'h';if(T)return'fuld';if(B)return'n';return null}
function snapForhaand(type){let el=$('snapfor');if(!el){el=document.createElement('div');el.id='snapfor';el.setAttribute('aria-hidden','true');document.body.appendChild(el)}
 if(!type){el.style.display='none';el.dataset.type='';return}const r=type==='fuld'?{vx:$('ws').getBoundingClientRect().left,vy:tbHoejde(),w:$('ws').clientWidth||innerWidth,h:innerHeight-tbHoejde()}:snapRect(type);
 el.style.cssText='display:block;left:'+r.vx+'px;top:'+r.vy+'px;width:'+r.w+'px;height:'+r.h+'px';el.dataset.type=type}
function snapGendan(w){const f=w.dataset.fur?JSON.parse(w.dataset.fur):null;if(f){w.style.left=f.l;w.style.top=f.t;w.style.width=f.w;w.style.height=f.h}delete w.dataset.snap;delete w.dataset.fur}
function snapTil(w,type){if(type==='gendan'){if(w.dataset.snap)snapGendan(w);else if(w.classList.contains('max'))w.querySelector('.mx').click();return true}
 if(w.classList.contains('min'))miniSaet(w,false);
 if(type==='fuld'){if(!w.classList.contains('max'))w.querySelector('.mx').click();return true}
 const r=snapRect(type);if(!r)return false;if(w.classList.contains('max'))w.querySelector('.mx').click();
 if(!w.dataset.snap)w.dataset.fur=JSON.stringify({l:w.style.left,t:w.style.top,w:w.style.width,h:w.style.height});
 w.style.left=Math.round(r.x)+'px';w.style.top=Math.round(r.y)+'px';w.style.width=Math.round(r.w)+'px';w.style.height=Math.round(r.h)+'px';w.dataset.snap=type;aktivSaet(w);return true}
function aktivSaet(w){document.querySelectorAll('.win.aktiv').forEach(x=>{if(x!==w)x.classList.remove('aktiv')});w.classList.add('aktiv');w.style.zIndex=++zTop}
document.querySelectorAll('.win').forEach(w=>w.addEventListener('pointerdown',()=>{if(!w.classList.contains('aktiv'))aktivSaet(w)},true));
/* snap-menuen (knappen ▦ i hver overskrift) */
let snapVindue=null;
function snapMenuAaben(){const m=$('snapmenu');return !!m&&!m.hidden}
function snapMenuLuk(){const m=$('snapmenu');if(m)m.hidden=true;if(snapVindue){const b=snapVindue.querySelector('.sn');if(b)b.setAttribute('aria-expanded','false')}snapVindue=null}
function snapMenuByg(){const m=document.createElement('div');m.id='snapmenu';m.setAttribute('role','menu');m.setAttribute('aria-label','Placér vinduet');m.hidden=true;m.innerHTML=SNAP_VALG.map(([k,n])=>'<button class="ghost" role="menuitem" data-snap="'+k+'">'+n+'</button>').join('');document.body.appendChild(m);
 m.addEventListener('click',e=>{const b=e.target.closest('[data-snap]');if(!b||!snapVindue)return;const w=snapVindue;snapMenuLuk();snapTil(w,b.dataset.snap);msg('Vinduet er placeret: '+(SNAP_VALG.find(x=>x[0]===b.dataset.snap)||[0,''])[1]+'.')})}
snapMenuByg();
document.querySelectorAll('.win').forEach(w=>{const mx=w.querySelector('.mx');if(!mx)return;mx.insertAdjacentHTML('beforebegin','<button class="sn" title="Placér vinduet: halv eller kvart skærm, fuld eller gendan. Du kan også trække vinduet til en kant eller et hjørne." aria-label="Placér vinduet" aria-haspopup="menu" aria-expanded="false">▦</button>');
 w.querySelector('.sn').onclick=e=>{e.stopPropagation();const m=$('snapmenu'),b=e.currentTarget;if(snapMenuAaben()&&snapVindue===w){snapMenuLuk();return}snapMenuLuk();snapVindue=w;const r=b.getBoundingClientRect();m.style.left=Math.max(4,Math.min(innerWidth-190,r.left))+'px';m.style.top=(r.bottom+4)+'px';m.hidden=false;b.setAttribute('aria-expanded','true');const f=m.querySelector('button');if(f&&e.detail===0)f.focus()}});
document.addEventListener('click',e=>{if(snapMenuAaben()&&!e.target.closest('#snapmenu,.sn'))snapMenuLuk()},true);
/* layouts */
const LAY_KEY='rytme-layouts',LAY_PLADS_KEY='rytme-layout-pladser',LAY_STD=['std','Som ved start (nulstil vinduerne)'];
/* v4.0: seks faste layouts til hver sin slags arbejde og seks egne pladser. Faste: 1 Optræden (kun billedet), 2 Byg forbindelser (Radial Mesh til venstre, Mapping og preview til højre), 3 Figurer (Form-editoren og preview med Mapping under), 4 Lyt og tun (tidslinjen over EQ og Detektions-tuning), 5 Overblik og læring (Routing-overblik ved siden af Radial Mesh og preview), 6 Live med pad (preview, Master Morph Pad og Radial Mesh). Vinduer, der ikke er med, minimeres i docken. */
const layMaal=s=>s===''||(typeof s==='string'&&/^-?\d{1,5}(\.\d+)?(px|%)$/.test(s));
function layLaes(){try{const d=JSON.parse(localStorage.getItem(LAY_KEY)||'{}');return d&&typeof d==='object'&&!Array.isArray(d)?d:{}}catch(e){return{}}}
function layGemmeLager(d){try{lsGem(LAY_KEY,JSON.stringify(d))}catch(e){}}
function layNu(){const o={};document.querySelectorAll('.win').forEach(w=>{o[w.id]={l:w.style.left,t:w.style.top,w:w.style.width,h:w.style.height,min:w.classList.contains('min'),max:w.classList.contains('max'),hid:!!w.hidden,snap:w.dataset.snap||''}});return o}
function layBrug(o){if(!o||typeof o!=='object')return 0;let n=0;Object.keys(o).forEach(id=>{const w=$(id),v=o[id];if(!w||!w.classList.contains('win')||!v||typeof v!=='object')return;n++;
  if(w.classList.contains('max'))w.querySelector('.mx').click();if(w.classList.contains('min'))miniSaet(w,false);
  [['left','l'],['top','t'],['width','w'],['height','h']].forEach(([p,k])=>{if(layMaal(v[k]))w.style[p]=v[k]});
  if(v.snap&&SNAP_VALG.some(x=>x[0]===v.snap))w.dataset.snap=v.snap;else delete w.dataset.snap;delete w.dataset.fur;
  w.hidden=!!v.hid;if(v.max&&!w.classList.contains('max'))w.querySelector('.mx').click();else if(v.min&&!w.hidden)miniSaet(w,true)});return n}
function layFaerdig(id){const alle=[...document.querySelectorAll('.win')],synlige=alle.filter(w=>!w.hidden);
 if(id==='std'){alle.forEach(w=>{if(w.classList.contains('max'))w.querySelector('.mx').click();if(w.classList.contains('min'))miniSaet(w,false);delete w.dataset.snap;delete w.dataset.fur;w.setAttribute('style',w.dataset.def||'')});document.querySelectorAll('.win.wsekvin').forEach(w=>{if(!w.classList.contains('min'))miniSaet(w,true)});try{SC_FANER.forEach(([id])=>{if(!scIScene(id))scIndIScene(id)});scGem();scVaelg('w2',true)}catch(e){}try{Object.keys(FG).forEach(g=>{FG[g].faner.forEach(([id])=>{if(!fgIGruppe(id))fgInd(g,id)});fgVaelg(g,FG[g].faner[0][0],true)})}catch(e){}return true}
 const planer={opt:[['w2','fuld']],byg:[['w5','v'],['w25','ho'],['w2','hn']],fig:[['w6','h'],['w2','vo'],['w25','vn']],lyt:[['w1','o'],['w3','vn'],['w20','hn']],laer:[['w25','v'],['w5','ho'],['w2','hn']],stor:[['w2','fuld']],pe:[['w2','v'],['w6','h']],fire:[['w2','vo'],['w5','ho'],['w6','vn'],['w1','hn']],pt:[['w2','o'],['w1','n']]}[id];if(!planer)return false;
 /* v5.8: det første af Scene-vinduets medlemmer i planen får Scene-vinduet (og fanen vælges); flere medlemmer rives løs som egne vinduer */
 const scIds=SC_FANER.map(f=>f[0]);let foerste=null;const fgF={};const plan=planer.map(([wid,t])=>{if(scIds.includes(wid)){if(!foerste){foerste=wid;if(!scIScene(wid))scIndIScene(wid);return ['w23',t]}if(scIScene(wid))scRiv(wid);return [wid,t]}const fg=fgAf(wid);if(fg){if(!fgF[fg]){fgF[fg]=wid;if(!fgIGruppe(wid))fgInd(fg,wid);return [FG[fg].host,t]}if(fgIGruppe(wid))fgRiv(fg,wid,true);return [wid,t]}return [wid,t]});
 [...document.querySelectorAll('.win')].filter(w=>!w.hidden).forEach(w=>{if(!plan.some(p=>p[0]===w.id)&&!w.classList.contains('min')&&!w.classList.contains('scene-member')&&!w.classList.contains('fg-member'))miniSaet(w,true)});plan.forEach(([wid,t])=>{const w=$(wid);if(w){w.hidden=false;snapTil(w,t)}});if(foerste)scVaelg(foerste,true);Object.entries(fgF).forEach(([g,id])=>fgVaelg(g,id,true));return true}
const layEsc=t=>String(t).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'})[c]);
function layPladser(){try{const a=JSON.parse(localStorage.getItem(LAY_PLADS_KEY)||'[]');return [0,1,2,3,4,5].map(i=>a[i]&&typeof a[i]==='object'&&a[i].data?a[i]:null)}catch(e){return [null,null,null,null,null,null]}}
function layPladserGem(a){try{lsGem(LAY_PLADS_KEY,JSON.stringify(a))}catch(e){}}
const LAY_FAERDIGE=[];/* v8.3: de gamle faste layouts er erstattet af topbarens fem layouts */
function layBygListe(){const s=$('lay-vaelg');if(!s)return;const mine=layLaes(),vaerdi=s.value,pl=layPladser();
 s.innerHTML=(LAY_FAERDIGE.length?'<optgroup label="Faste">'+LAY_FAERDIGE.map(([k,n])=>'<option value="f:'+k+'">'+n+'</option>').join('')+'</optgroup>':'')+'<optgroup label="Mine (6 pladser)">'+pl.map((x,i)=>'<option value="s:'+i+'">Plads '+(i+1)+' · '+(x?layEsc(x.navn||'uden navn'):'tom')+'</option>').join('')+'</optgroup><optgroup label="Nulstil"><option value="f:std">'+LAY_STD[1]+'</option></optgroup>'+(Object.keys(mine).length?'<optgroup label="Ældre gemte (med navn)">'+Object.keys(mine).map(n=>'<option value="m:'+layEsc(n)+'">'+layEsc(n)+'</option>').join('')+'</optgroup>':'');
 if([...s.options].some(o=>o.value===vaerdi))s.value=vaerdi}
const layNavn=t=>String(t||'').replace(/[<>"&]/g,'').replace(/\s+/g,' ').trim().slice(0,24);
$('lay-gem').onclick=()=>{const v=$('lay-vaelg').value||'';if(!v.startsWith('s:')){msg('Gem layout: vælg en af dine 6 pladser (Plads 1 til 6) i listen først. Navnet skriver du i feltet Navn.');return}const i=+v.slice(2),a=layPladser(),n=layNavn($('lay-navn').value)||(a[i]&&a[i].navn)||'Layout '+(i+1);a[i]={navn:n,data:layNu()};layPladserGem(a);layBygListe();$('lay-vaelg').value=v;msg('Layout gemt i plads '+(i+1)+': '+n+'.')};
/* v5.8: et layout bruges, så snart det vælges (ingen ekstra klik) */
$('lay-vaelg').addEventListener('change',()=>{if($('lay-vaelg').value)$('lay-brug').click()});
$('lay-brug').onclick=()=>{const v=$('lay-vaelg').value||'';if(v.startsWith('f:')){const ok=layFaerdig(v.slice(2));msg(ok?'Layout brugt: '+([...LAY_FAERDIGE,LAY_STD].find(x=>x[0]===v.slice(2))||[0,''])[1]+'.':'Layoutet findes ikke.');return}
 if(v.startsWith('s:')){const i=+v.slice(2),x=layPladser()[i];if(!x){msg('Plads '+(i+1)+' er tom. Indret vinduerne, vælg pladsen, og tryk Gem layout.');return}const k=layBrug(x.data);msg('Layout brugt: plads '+(i+1)+', '+x.navn+' ('+k+' vinduer).');return}
 if(v.startsWith('m:')){const n=v.slice(2),d=layLaes();if(!(n in d)){msg('Layoutet findes ikke længere.');layBygListe();return}const k=layBrug(d[n]);msg('Layout brugt: '+n+' ('+k+' vinduer).');return}msg('Vælg et layout først.')};
$('lay-slet').onclick=async()=>{const v=$('lay-vaelg').value||'';if(!v.startsWith('m:')&&!v.startsWith('s:')){msg('Slet layout: de faste layouts kan ikke slettes. Vælg en af dine pladser.');return}
 if(v.startsWith('s:')){const i=+v.slice(2),a=layPladser();if(!a[i]){msg('Plads '+(i+1)+' er allerede tom.');return}const r=await spoerg({titel:'Slet layoutet i plads '+(i+1)+'?',tekst:'Layoutet '+a[i].navn+' bliver slettet. Det kan ikke fortrydes.',ok:'Ja, slet',fare:true});if(!r.ok){msg('Sletning annulleret.');return}a[i]=null;layPladserGem(a);layBygListe();$('lay-vaelg').value=v;msg('Plads '+(i+1)+' er tømt.');return}
 const n=v.slice(2),d=layLaes();if(!(n in d)){return}const r=await spoerg({titel:'Slet layoutet '+n+'?',tekst:'Det kan ikke fortrydes.',ok:'Ja, slet',fare:true});if(!r.ok){msg('Sletning annulleret.');return}delete d[n];layGemmeLager(d);layBygListe();msg('Layout slettet: '+n+'.')};
layBygListe();
/* topbarens størrelse og dock */
let tbSkjulT=null,tbStatT=null;
function tbModus(){const t=$('tb');if(!t)return;t.dataset.tb=set.topbar;t.dataset.dock=set.topdock;document.body.dataset.tbdock=set.topdock;if(set.topbar!=='minimal')t.classList.remove('udv');if(set.topdock!=='auto')t.classList.remove('vis');
 if($('tb-stoerrelse'))$('tb-stoerrelse').value=set.topbar;if($('tb-dock'))$('tb-dock').value=set.topdock;if(typeof tbhSaet==='function')tbhSaet()}
function tbSkjulSoeg(){clearTimeout(tbSkjulT);tbSkjulT=setTimeout(()=>{const t=$('tb');if(!t||set.topdock!=='auto')return;if(t.matches(':hover')||t.contains(document.activeElement)||document.querySelector('#tb .menup:not([hidden])')){tbSkjulSoeg();return}t.classList.remove('vis')},500)}
$('tb-hot').addEventListener('mouseenter',()=>{if(set.topdock==='auto')$('tb').classList.add('vis')});
/* v4.2: baren kom ikke altid frem, hvis musen allerede stod i den tynde zone øverst, da den skjulte sig (der kom ingen ny "musen går ind"). Nu kommer den frem, så snart musen er helt oppe ved kanten, også hvis den står stille, og ved et tryk øverst på en skærm. Alt+T viser og skjuler den fra tastaturet. */
document.addEventListener('pointermove',e=>{if(set.topdock==='auto'&&e.clientY<=8&&!$('tb').classList.contains('vis'))$('tb').classList.add('vis')},{passive:true});
document.addEventListener('pointerdown',e=>{if(set.topdock==='auto'&&e.clientY<=14)$('tb').classList.add('vis')},{passive:true});
document.addEventListener('keydown',e=>{if(e.altKey&&!e.ctrlKey&&!e.metaKey&&(e.key==='t'||e.key==='T'||e.code==='KeyT')){e.preventDefault();const t=$('tb');if(set.topdock!=='auto'){msg('Topbaren er fastgjort; Alt+T bruges kun, når den skjules automatisk.');return}const v=t.classList.toggle('vis');if(v){const f=t.querySelector('button,select');if(f)f.focus()}else tbSkjulSoeg()}});
$('tb').addEventListener('mouseenter',()=>{clearTimeout(tbSkjulT)});$('tb').addEventListener('mouseleave',()=>{if(set.topdock==='auto')tbSkjulSoeg()});
$('tb').addEventListener('focusin',()=>{if(set.topdock==='auto')$('tb').classList.add('vis')});$('tb').addEventListener('focusout',()=>{if(set.topdock==='auto')tbSkjulSoeg()});
$('tb-udv').onclick=()=>{const t=$('tb'),v=t.classList.toggle('udv');$('tb-udv').setAttribute('aria-expanded',v?'true':'false');tbhSaet()};
$('tb-stoerrelse').onchange=e=>{set.topbar=e.target.value;applySet();msg('Topbaren er nu '+({fuld:'fuld',kompakt:'kompakt (halv højde: statuslinjen vises kort, når der sker noget)',minimal:'minimal (kun Afspil og Fest!; tryk ☰ for resten)'})[set.topbar]+'.')};
$('tb-dock').onchange=e=>{set.topdock=e.target.value;applySet();msg(set.topdock==='auto'?'Topbaren skjules og kommer frem, når musen er helt oppe i toppen (eller du tabber derop).':'Topbaren sidder fast øverst.')};
try{new MutationObserver(()=>{const t=$('tb');if(!t||t.dataset.tb==='fuld')return;t.classList.add('stat');clearTimeout(tbStatT);tbStatT=setTimeout(()=>t.classList.remove('stat'),4000)}).observe($('status'),{childList:true,characterData:true,subtree:true})}catch(e){}
tbModus();
/* ========== SLUT: VINDUER ========== */

