/* ========== FASE 2: SOLO OG MÆRK PREVIEW ========== */
/* Kun hjælp til at se forskel. Solo gør alt andet tavst uden at ændre dine forbindelser. Mærk preview skriver navne og lydtræk på effekterne. */
function ankre(id,W,Hh){const hz=Hh*.3,hy=Hh*.86;
 if(id==='puls'||id==='ring'||id==='burst'||id==='glod'||id==='sky'||id==='daempring'){const q=pos[id];return{x:q.x*W,y:q.y*Hh}}
 if(id.startsWith('obj:')||id.startsWith('liv:')){const o=fase2.objekter.find(o=>o.id===id.split(':')[1]);return o?{x:o.pos.x*W,y:o.pos.y*Hh}:null}
 if(id.startsWith('klods')){const l=+id.slice(5)-1,G=geo(W,Hh);return{x:G.lx(l,.8),y:G.ly(.8)}}
 if(id==='slange'||id==='slange_farve')return{x:W*.1,y:Hh*.7};
 if(id==='bolge')return{x:W/2,y:Hh*.95};
 return null}
function tegnMaerker(g,W,Hh,E,t){
 const used=new Map();maps.forEach((m,i)=>{if(m.off||(soloOn&&i!==meshSel))return;const u=used.get(m.effect)||{bands:[],hue:HUE(Math.max(0,idx(m.band))),sel:false};u.bands.push(((BANDS[idx(m.band)]||[0,m.band])[1]).split(' ')[0]);if(i===meshSel)u.sel=true;used.set(m.effect,u)});
 g.save();g.font='11px Schibsted Grotesk,sans-serif';const stack={};
 used.forEach((u,id)=>{const a=ankre(id,W,Hh);if(!a)return;const key=Math.round(a.x/24)+','+Math.round(a.y/24),k=stack[key]=(stack[key]||0)+1,col='hsl('+u.hue+' 80% 60%)';
  const txt=effName(id)+' ← '+u.bands.join(', '),w=g.measureText(txt).width+12,x=Math.min(W-w-4,Math.max(4,a.x+12)),y=a.y-12+(k-1)*17;
  g.strokeStyle=col;g.lineWidth=2;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(x,y-4);g.stroke();g.fillStyle=col;g.beginPath();g.arc(a.x,a.y,4,0,7);g.fill();
  g.fillStyle='rgba(0,0,0,.7)';g.lineWidth=u.sel?3:1.5;g.beginPath();g.rect(x,y-12,w,16);g.fill();g.stroke();g.fillStyle='#fff';g.fillText(txt,x+6,y);
  if(u.sel){g.strokeStyle='#fff';g.lineWidth=2;g.beginPath();g.arc(a.x,a.y,22+3*Math.sin(t/120),0,7);g.stroke()}});
 const n=Math.min(used.size,16);if(n){g.fillStyle='rgba(0,0,0,.6)';g.fillRect(6,6,232,n*15+8);let row=0;
  used.forEach((u,id)=>{if(row>=16)return;const y=22+row*15,lv=Math.min(1,E[id]||0),col='hsl('+u.hue+' 80% 60%)';g.fillStyle=col;g.fillRect(12,y-9,8,8);g.fillStyle='#fff';g.fillText(effName(id).slice(0,26),26,y);
   g.fillStyle='rgba(255,255,255,.2)';g.fillRect(174,y-9,58,8);g.fillStyle=col;g.fillRect(174,y-9,58*lv,8);if(u.sel){g.strokeStyle='#fff';g.lineWidth=1;g.strokeRect(10,y-11,224,13)}row++})}
 if(soloOn&&maps[meshSel]){const m=maps[meshSel],txt='SOLO: '+((BANDS[idx(m.band)]||[0,m.band])[1])+' → '+effName(m.effect);g.font='800 12px Schibsted Grotesk,sans-serif';const w=g.measureText(txt).width+16;g.fillStyle='#ffd23f';g.fillRect(W/2-w/2,6,w,20);g.fillStyle='#000';g.fillText(txt,W/2-w/2+8,20)}
 g.restore()}
$('mb-solo').onclick=()=>{soloOn=!soloOn;setTgl($('mb-solo'),soloOn,'Solo valgt');meshRefresh()};
$('mb-maerk').onclick=()=>{maerkOn=!maerkOn;setTgl($('mb-maerk'),maerkOn,'Mærk preview')};
/* ========== SLUT: SOLO OG MÆRK PREVIEW ========== */

/* ---------- Vinduer: flyt, maksimér, tilpas ---------- */
let zTop=10;
document.querySelectorAll('.win').forEach(w=>{const h=w.querySelector('.wh');w.querySelector('.mx').insertAdjacentHTML('beforebegin','<button class="mn" title="Minimér vinduet til en bjælke. Tryk + for at gendanne det." aria-label="Minimér vinduet">−</button>');
 w.querySelector('.mn').onclick=()=>miniSaet(w,!w.classList.contains('min'));
 h.addEventListener('pointerdown',e=>{if(e.target.closest('button,select,input,label')||e.button>0||w.classList.contains('max')||w.dataset.docked)return;if(set.laast&&w.parentNode&&w.parentNode.id==='ws'){laasHint();return}if(set.zoner&&(w.classList.contains('zone')||w.classList.contains('zon-pop')))return;/* v8.7: zoner flyttes med stregerne *//* v8.5: låste vinduer */e.preventDefault();if(w.dataset.snap){const bb=parseFloat((JSON.parse(w.dataset.fur||'{}').w||'0'))||w.offsetWidth;snapGendan(w);w.style.left=Math.max(0,Math.round(e.clientX-$('ws').getBoundingClientRect().left-bb/2))+'px';w.style.top=Math.max(vTop(),Math.round(e.clientY-$('ws').getBoundingClientRect().top+$('ws').scrollTop-12))+'px'}aktivSaet(w);const sx=e.clientX-w.offsetLeft,sy=e.clientY+$('ws').scrollTop-w.offsetTop;try{h.setPointerCapture(e.pointerId)}catch(x){}document.body.classList.add('drar');try{getSelection().removeAllRanges()}catch(x){}const ingenMarkering=ev=>ev.preventDefault();document.addEventListener('selectstart',ingenMarkering);let le=e;
  const mv=ev=>{le=ev;w.style.left=Math.max(0,Math.min(ev.clientX-sx,$('ws').clientWidth*(set.bredt?2:1)-80))+'px';/* v8.5: hele skrivebordets bredde */w.style.top=Math.max(0,ev.clientY+$('ws').scrollTop-sy)+'px';const mal=snapMaal(ev.clientX,ev.clientY);w._snapMal=mal;snapForhaand(mal)};
  const iv=setInterval(()=>{if(le.clientY>innerHeight-110)$('ws').scrollBy(0,16);else if(le.clientY<tbHoejde()+40&&$('ws').scrollTop>0)$('ws').scrollBy(0,-16);mv(le)},16);
  const end=()=>{clearInterval(iv);h.removeEventListener('pointermove',mv);document.removeEventListener('selectstart',ingenMarkering);document.body.classList.remove('drar');snapForhaand(null);const m2=w._snapMal;w._snapMal=null;if(m2)snapTil(w,m2)};h.addEventListener('pointermove',mv);h.addEventListener('pointerup',end,{once:true});h.addEventListener('pointercancel',end,{once:true})});
 w.querySelector('.mx').onclick=e=>{if(w.classList.contains('min'))miniSaet(w,false);w.classList.toggle('max');e.target.textContent=w.classList.contains('max')?'Gendan':'Maksimér'};
 new ResizeObserver(()=>{const b=w.querySelector('.wb'),c=b&&!b.classList.contains('wsec')?b.querySelector('canvas'):null;if(c){if(c.id==='mesh'){meshResize();return}const sk=c.id==='pv'?pvSkala(b):1;c.width=Math.max(50,Math.round(b.clientWidth*sk));c.height=Math.max(50,Math.round(b.clientHeight*sk))}}).observe(w)});

/* Vinduer: topbaren er klistret øverst, så et maksimeret vindue starter under den (--tbh), og et vindue kan ikke trækkes så højt op, at dets overskrift ligger bag topbaren. Escape gendanner et maksimeret vindue (eller afslutter Fest!), og dobbeltklik på en overskrift maksimerer og gendanner. */
function tbHoejde(){const t=$('tb');return t?(t.dataset.dock==='auto'?6:t.offsetHeight):0}
function tbhSaet(){document.documentElement.style.setProperty('--tbh',tbHoejde()+'px')}
function vTop(){const ws=$('ws');return ws?ws.scrollTop:0}/* v8.3: arbejdsfladen ruller for sig selv */
tbhSaet();try{new ResizeObserver(tbhSaet).observe($('tb'))}catch(e){}addEventListener('resize',tbhSaet);
document.addEventListener('keydown',e=>{if(e.key!=='Escape'||e.defaultPrevented)return;if(typeof snapMenuAaben==='function'&&snapMenuAaben()){snapMenuLuk();e.preventDefault();return}if(document.querySelector('#tb .menup:not([hidden])')||document.querySelector('dialog[open]'))return;const m=document.querySelector('.win.max');if(m){m.querySelector('.mx').click()}});
document.querySelectorAll('.win .wh').forEach(h=>h.addEventListener('dblclick',e=>{if(e.target.closest('button,select,input,label'))return;h.closest('.win').querySelector('.mx').click()}));

document.querySelectorAll('.win').forEach(w=>w.dataset.def=w.getAttribute('style'));
/* Mini-vinduer: et minimeret vindue flyttes ud i en kant (venstre, hvis det sad i den venstre søjle, ellers højre) som et slankt kort med et par indstillinger, der virker. På en smal skærm (under 900 px) folder det sig bare sammen, hvor det er. Ordn vinduer sætter de andre vinduer i to søjler uden overlap. */
const dockOK=()=>innerWidth>900,vinduesSide=w=>{const m=/(?:^|;)\s*left:\s*([^;]+)/.exec(w.dataset.def||'');const l=m?m[1].trim():'0';return(l==='0'||l==='0px')?'v':'h'};
const MINI={w1:'<button data-ma="play"></button><span data-mt="tid"></span>',w2:'<button data-ma="mv"></button><button data-ma="mvrst">Nulstil pos.</button>',w3:'<span data-mt="eq"></span>',w4:'<button data-ma="gp"></button><span data-mt="bpm"></span>',
 w5:'<select data-ms="vis" aria-label="Visning"></select><select data-ms="kilder" aria-label="Lydtræk yderst"><option value="bånd">De 14 lydtræk</option><option value="analyse">Toner og klang</option><option value="hnd">Hændelser</option></select>',w6:'<select data-ms="fobj" aria-label="Figur"></select><button data-ma="mesh">Vis i spindelvæv</button>',w7:'<span data-mt="tone"></span>',w8:'<button data-ma="klik:dubx">Luk dublet</button>'};
document.querySelectorAll('.win').forEach((w,i)=>{w.dataset.idx=i;w.insertAdjacentHTML('beforeend','<div class="wmini">'+(MINI[w.id]||'')+'</div>')});
function dockOpdat(){$('dockL').parentNode===document.body&&document.body.classList.toggle('dock-l',$('dockL').children.length>0);document.body.classList.toggle('dock-r',$('dockR').children.length>0)}
function miniSaet(w,on){w.classList.remove('max');const mx=w.querySelector('.mx');if(mx)mx.textContent='Maksimér';
 if(on){w.classList.add('min');if(dockOK()){const d=$(vinduesSide(w)==='v'?'dockL':'dockR');w.dataset.docked='1';d.appendChild(w);[...d.children].sort((a,b)=>+a.dataset.idx-+b.dataset.idx).forEach(c=>d.appendChild(c))}}
 else{w.classList.remove('min');if(w.dataset.docked){delete w.dataset.docked;$('ws').appendChild(w);[...$('ws').children].sort((a,b)=>+a.dataset.idx-+b.dataset.idx).forEach(c=>$('ws').appendChild(c))}}
 const mn=w.querySelector('.mn'),m=w.classList.contains('min');mn.textContent=m?'+':'−';mn.setAttribute('aria-label',m?'Udvid vinduet':'Minimér vinduet');dockOpdat();
 const alle=[...document.querySelectorAll('.win:not([hidden])')].every(x=>x.classList.contains('min'));$('mina').textContent=alle?'Udvid alle vinduer':'Minimér alle vinduer'}
function ordnVinduer(){const kol={v:0,h:0};document.querySelectorAll('#ws .win:not([hidden])').forEach(w=>{w.classList.remove('max');const mx=w.querySelector('.mx');if(mx)mx.textContent='Maksimér';const d=w.dataset.def||'',gv=p=>{const m=new RegExp('(?:^|;)\\s*'+p+':\\s*([^;]+)').exec(d);return m?m[1].trim():''},
  left=gv('left')||'0',width=gv('width')||'62%',hh=parseFloat(gv('height'))||420,side=(left==='0'||left==='0px')?'v':'h',min=w.classList.contains('min');
  w.setAttribute('style','left:'+left+';top:'+kol[side]+'px;width:'+width+';height:'+(min?'auto':hh+'px'));kol[side]+=(min?34:hh)+10});
 $('ws').style.height=Math.max(kol.v,kol.h,200)+'px'}
function minimerAlle(){const ws=[...document.querySelectorAll('.win:not([hidden])')],alle=ws.every(w=>w.classList.contains('min'));ws.forEach(w=>miniSaet(w,!alle));ordnVinduer()}
/* Mini-kortenes knapper og lister er genveje til de rigtige: de kalder det samme, og deres tekster følger de rigtiges. */
document.addEventListener('click',e=>{const b=e.target.closest('[data-ma]');if(!b)return;const a=b.dataset.ma,klik=id=>{const x=$(id);if(x)x.click()};
 if(a.startsWith('klik:'))klik(a.slice(5));else if(a.startsWith('gaa:')){const x=$(a.slice(4));if(x){if(x.scrollIntoView)x.scrollIntoView({behavior:'smooth',block:'center'});if(x.focus)x.focus()}}else if(a==='play')plSkift();else if(a==='mv')klik('mvbtn');else if(a==='mvrst')klik('mvrst');else if(a==='fest')klik('fest');else if(a==='gp')klik('gp');else if(a==='mesh'){const x=document.querySelector('#fctl [data-op="mesh"]');if(x)x.click()}else if(a.startsWith('manual:'))manualAabn(a.slice(7))});
document.addEventListener('change',e=>{const t=e.target,k=t.dataset&&t.dataset.ms;if(!k)return;
 if(k==='vis'||k==='kilder'||k==='fobj'){const o=$({vis:'mb-vis',kilder:'mb-kilder',fobj:'fobj'}[k]);if(o){o.value=t.value;o.dispatchEvent(new Event('change',{bubbles:true}))}}});
function miniSync(){if(!document.querySelector('.win.min'))return;const tx=(q,v)=>{const x=document.querySelector(q);if(x&&x.textContent!==v)x.textContent=v},ls=(q,id)=>{const x=document.querySelector(q),o=$(id);if(x&&o){if(x.innerHTML!==o.innerHTML)x.innerHTML=o.innerHTML;x.value=o.value}};
 tx('[data-ma="play"]',playing?'❚❚ Pause':'▶ Afspil');tx('[data-mt="tid"]',$('tid').textContent);tx('[data-ma="mv"]',$('mvbtn').textContent);tx('[data-ma="gp"]',$('gp')?$('gp').textContent:'Afspil');tx('[data-mt="bpm"]','BPM '+bpm);
 const m=maps[eqMap];tx('[data-mt="eq"]',m?bandNavn(m.band)+' → '+effName(m.effect)+' · tærskel '+m.thr:'Ingen forbindelse valgt');
 ls('[data-ms="vis"]','mb-vis');ls('[data-ms="fobj"]','fobj');const k=document.querySelector('[data-ms="kilder"]');if(k)k.value=meshKilder;
 const d=anaNu();tx('[data-mt="tone"]',d&&d.f0>0?noteNavn(d.f0)+' · '+Math.round(d.f0)+' Hz · '+Math.round(d.klar*100)+' %':d?'ingen tydelig tone':'udvid vinduet for at måle')}
$('rwin').onclick=ordnVinduer;$('mina').onclick=minimerAlle;
