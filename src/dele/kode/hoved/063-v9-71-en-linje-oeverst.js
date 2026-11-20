/* ========== v9.71: ÉN LINJE ØVERST ==========
   Planen PLAN-NY-BRUGERFLADE.md, fase 5, trin 5b (pakke 4). Alt samles i én linje øverst: de fire arbejdsområder (#lay3, kun ao-*), afspilningen
   (#tp flyttes ind i linjen; dens CSS gælder stadig), statuslinjen, og til højre Søg, ↶ Fortryd, ↷ Gentag, 💾 Gem ▾ (Opsætning 1–20) og ☰ Mere ▾.
   Fjernes: sidebjælken (#sb) og dens flyout (#sb-fly), bundbjælken (#tp som bjælke), de seks gamle layout-knapper, Mine ▾ og 💾 Gem layout,
   🔒/↔/▦-knapperne i topbjælken (Lås flyttes til Mere), Niveau (nivAnvend viser altid alle vinduer), Enkel tilstand (#enkel), vinduesnumre.
   Mere-panelet (#mere-pan) bygges af de rigtige knapper, der FLYTTES fra de gamle menuer (deres lyttere virker som før), plus en sektion for det
   valgte arbejdsområde (el9AoPunkter). Docking låses som standard første gang (set.laastStd971). Bygges 1,5 s efter start, når de gamle bjælker er bygget. */
const EL9={klar:false,fors:0};
/* programmet starter altid i et arbejdsområde: sættes her ved start (før docking læser set.lay3), ikke senere, så et layout, der vælges lige efter start, ikke bliver overskrevet */
if(!/^ao-/.test(String(set.lay3||''))){set.lay3='ao-sang';set.lay3Init=1}
function el9Flyt(el,til){if(el&&til&&el.parentNode!==til)til.appendChild(el);return el}
function el9Sek(pan,id,titel){const s=document.createElement('div');s.className='mere-sek';s.id=id;s.innerHTML='<h4>'+titel+'</h4><div class="mere-r"></div>';pan.appendChild(s);return s.querySelector('.mere-r')}
function el9Knap(txt,fn,title){const b=document.createElement('button');b.className='ghost';b.textContent=txt;if(title)b.title=title;b.onclick=fn;return b}
function el9Klik(id){return()=>{el9MereLuk();const b=$(id);if(b)b.click();else msg('Knappen findes ikke lige nu.')}}
function el9Scud(){el9MereLuk();const s=document.querySelector('#sc-faner [data-scud]');if(s&&!s.disabled)s.click();else msg('Vælg Live preview, Radial Mesh, Mesh 3D eller Øjet i Scene først.')}
function el9AoPunkter(){const k=set.lay3||'';const gaa=id=>()=>{el9MereLuk();try{dkVis(id)}catch(e){}};
 const P={'ao-sang':[['Lydtræk-guide',gaa('w18'),'Værksted: Tilslut MIDI, Tilfældigt']],
  'ao-scene':[['Figur-generator',()=>{el9MereLuk();try{dkVis('w34')}catch(e){}try{const d=$('fgen');if(d){d.open=true;d.scrollIntoView({block:'nearest'})}}catch(e){}},'Lav mange figurer på én gang (nederst i Figurer)'],['Klodsbane: til/fra',el9Klik('pv-bane'),'Vis eller skjul banen, sporene og klodserne i Live preview'],['Navne: til/fra',el9Klik('pv-navne'),'Skriv hver figurs navn ved figuren i Live preview'],['Bane og klods',gaa('w16')],['Kvalitet',gaa('w14')],['Flyt effekter: til/fra',el9Klik('mvbtn'),'Træk effekterne på plads i Live preview'],['Nulstil effekternes placering',el9Klik('mvrst')]],
  'ao-regler':[['Biblioteket',gaa('w36'),'Shows og figurer med regel-sæt'],['Automatik',()=>{el9MereLuk();try{dkVis('w33')}catch(e){}try{auAaben(true)}catch(e){}},'Det, programmet vælger selv om målingerne'],['Kort over forbindelserne',()=>{el9MereLuk();try{mvkAaben()}catch(e){}}]],
  'ao-show':[['Preset som tekst',gaa('w21')],['Lav show: Rolig',el9Klik('show-rolig')],['Lav show: Balanceret',el9Klik('show-bal')],['Lav show: Vild',el9Klik('show-vild')]]};
 const navn=(typeof LAY3!=='undefined'&&LAY3.find(x=>x[0]===k)||[0,''])[1];return{navn:P[k]?navn:'alle arbejdsområder',liste:P[k]||[].concat(P['ao-sang'],P['ao-scene'],P['ao-regler'],P['ao-show'])}}
function el9MereByg(){const r=$('mere-ao');if(!r)return;const o=el9AoPunkter();r.innerHTML='';r.parentNode.querySelector('h4').textContent='I '+o.navn;o.liste.forEach(([n,fn,t])=>r.appendChild(el9Knap(n,fn,t)))}
function el9MereAaben(til){const p=$('mere-pan'),b=$('el9-mere');if(!p)return;const vis=til===undefined?p.hidden:!!til;if(vis)el9MereByg();p.hidden=!vis;if(b){b.setAttribute('aria-expanded',vis);b.classList.toggle('on',vis)}if(vis){const g=$('el9-gem-pan');if(g)g.hidden=true}}
function el9MereLuk(){el9MereAaben(false)}
function el9GemByg(){const p=$('el9-gem-pan');if(!p)return;const nu=bibMitAktivt();p.innerHTML='<h4>Gem som et show i Biblioteket</h4>'+(nu?'<button class="ghost" data-el9gemi="'+esc(nu.id)+'">Gem i «'+esc(nu.navn)+'» (det, der er indlæst)</button>':'')+'<div class="ab"><input type="text" id="el9-gem-navn" maxlength="40" placeholder="Navn på det nye show" aria-label="Navn på det nye show"><button data-el9gemny>Gem som nyt show</button></div>'+(BIB.mine.length?'<h4>Eller overskriv et af dine shows</h4>'+BIB.mine.map(x=>'<button class="ghost" data-el9gem="'+esc(x.id)+'"'+(x.laast?' disabled':'')+'>'+esc(x.navn)+(x.laast?' 🔒':'')+'</button>').join(''):'')+'<p class="small">Regler, figurer, scene, lyd og show gemmes. Shows kan omdøbes og slettes i Biblioteket (3 · Regler).</p><h4>Sikkerhedskopi</h4><div class="ab"><button class="ghost" data-el9alt title="Én fil med alt, der ligger i browseren: Mine shows, Opsætning 1–20, det åbne arbejde og indstillinger. Hentes igen under Opsætninger.">Gem hele arbejdet på computeren</button></div>'}
function el9GemAaben(til){const p=$('el9-gem-pan'),b=$('el9-gem');if(!p)return;const vis=til===undefined?p.hidden:!!til;if(vis)el9GemByg();p.hidden=!vis;if(b)b.setAttribute('aria-expanded',vis);if(vis)el9MereLuk()}
function el9Byg(){const tb=$('tb'),tbm=tb&&tb.querySelector('.tbm'),tp=$('tp'),lay3=$('lay3'),sb=$('sb'),fly=$('sb-fly');
 if(!tbm||!tp||!lay3||!$('tp-ab')||!fly||!$('fx-knap')){if(++EL9.fors<60){setTimeout(el9Byg,100);return}}
 if(EL9.klar||!tbm||!tp||!lay3)return;EL9.klar=true;
 /* 1 · arbejdsområderne: kun de fire */
 lay3.querySelectorAll('[data-lay3]').forEach(b=>{if(!/^ao-/.test(b.dataset.lay3))b.remove()});['lay3-mine','lay3-gem','bred-knap','zon-knap'].forEach(id=>{const e=$(id);if(e)e.remove()});
 const laas=$('laas-knap'),std=[...lay3.querySelectorAll('button')].find(b=>/Standard/.test(b.textContent||''));
 if(typeof LAY3!=='undefined'&&LAY3.length>4)LAY3.splice(4);
 /* 2 · afspilningen ind i linjen */
 tbm.insertBefore(tp,lay3.nextSibling);const sk=tp.querySelector('.tp-sk');if(sk)sk.remove();
 /* 3 · højre: Søg, Fortryd, Gentag, Gem, Mere */
 const h=document.createElement('div');h.id='el9-hoejre';h.innerHTML='<button id="el9-fortryd" class="ghost" title="Fortryd (Ctrl+Z)" aria-label="Fortryd">↶</button><button id="el9-gentag" class="ghost" title="Gentag (Ctrl+Shift+Z)" aria-label="Gentag">↷</button><button id="el9-gem" class="ghost" aria-expanded="false" title="Gem alt i en af pladserne Opsætning 1 til 20">💾 Gem ▾</button><button id="el9-mere" class="ghost" aria-expanded="false" title="Mere: det, der hører til arbejdsområdet, visning, vinduer, lyd og ydelse, opsætninger og hjælp">☰ Mere ▾</button>';
 const st=$('status');tbm.appendChild(h);if(st)tbm.insertBefore(st,h);{const il=document.createElement('span');il.id='el9-indl';il.className='chip';il.title='Det, der er indlæst lige nu';if(st)tbm.insertBefore(il,st);else tbm.insertBefore(il,h)}/* v9.86: Indlæst */const kp=$('kp-knap');if(kp)h.insertBefore(kp,h.firstChild);
 $('el9-fortryd').onclick=()=>{try{feFortryd()}catch(e){}};$('el9-gentag').onclick=()=>{try{feGentag()}catch(e){}};
 const gp=document.createElement('div');gp.id='el9-gem-pan';gp.className='el9-pan';gp.hidden=true;document.body.appendChild(gp);$('el9-gem').onclick=()=>el9GemAaben();
 gp.addEventListener('click',e=>{const ny=e.target.closest('[data-el9gemny]');if(ny){const navn=($('el9-gem-navn')||{}).value||'';const x=bibGemShow(navn.trim()||null,null);el9GemAaben(false);if(x)msg('💾 Gemt som nyt show: '+x.navn+' (Biblioteket → Mine).');return}
  const i=e.target.closest('[data-el9gemi]');if(i){const x=bibGemShow(null,i.dataset.el9gemi);el9GemAaben(false);if(x)msg('💾 Gemt i '+x.navn+'.');return}
  const b=e.target.closest('[data-el9gem]');if(!b)return;const x=bibGemShow(null,b.dataset.el9gem);el9GemAaben(false);if(x)msg('💾 Gemt i '+x.navn+'.')});
 gp.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='el9-gem-navn'){e.preventDefault();const x=bibGemShow((e.target.value||'').trim()||null,null);el9GemAaben(false);if(x)msg('💾 Gemt som nyt show: '+x.navn+'.')}});
 /* 4 · Mere-panelet: de rigtige knapper flyttes herind */
 const pan=document.createElement('div');pan.id='mere-pan';pan.className='el9-pan';pan.hidden=true;pan.setAttribute('role','dialog');pan.setAttribute('aria-label','Mere');document.body.appendChild(pan);
 const ao=el9Sek(pan,'mere-ao-sek','I arbejdsområdet');ao.id='mere-ao';
 const vis=el9Sek(pan,'mere-vis','Vis');['tb-sikker','ud-btn','ud-sort','rec-btn','lin-btn','tp-ud'].forEach(id=>el9Flyt($(id),vis));const uk=$('ud-kilde');if(uk&&uk.closest('label'))vis.appendChild(uk.closest('label'));
 vis.appendChild(el9Knap('⛶ Live preview i fuld skærm',()=>{el9MereLuk();try{pvFuld()}catch(e){}}));vis.appendChild(el9Knap('▸ Send Scene-fanen til skærm',el9Scud));
 const vin=el9Sek(pan,'mere-vin','Vinduer');if(laas)vin.appendChild(laas);if(std)vin.appendChild(std);const dk=$('tb-dock');if(dk&&dk.closest('label')){const l=dk.closest('label');vin.appendChild(l);[...l.childNodes].forEach(n=>{if(n.nodeType===3&&n.textContent.trim())n.textContent='Topbjælken '})}
 const lyd=el9Sek(pan,'mere-lyd','Lyd og ydelse');['tb-kval','tb-skarp','tb-reg'].forEach(id=>{const e=$(id);if(e&&e.closest('label'))lyd.appendChild(e.closest('label'))});el9Flyt(document.querySelector('[data-ma="klik:bench-start"]'),lyd);el9Flyt($('norm'),lyd);el9Flyt(document.querySelector('[data-ma="klik:lmute"]'),lyd);el9Flyt($('fx-knap'),lyd);el9Flyt($('tp-fps'),lyd);el9Flyt($('sbtn'),lyd);
 const ops=el9Sek(pan,'mere-ops','Opsætninger');['tb-ops','tb-mine'].forEach(id=>{const e=$(id);if(e&&e.closest('label'))ops.appendChild(e.closest('label'))});el9Flyt(document.querySelector('[data-ma="klik:copy"]'),ops);el9Flyt(document.querySelector('[data-ma="gaa:json"]'),ops);el9Flyt(document.querySelector('[data-ma="klik:s-reset"]'),ops);
 const hj=el9Sek(pan,'mere-hj','Hjælp');el9Flyt($('hjbtn'),hj);el9Flyt($('gbtn'),hj);el9Flyt(document.querySelector('[data-ma="manual:genveje"]'),hj);el9Flyt(document.querySelector('[data-ma="manual:figur-form"]'),hj);
 $('el9-mere').onclick=()=>el9MereAaben();
 document.addEventListener('pointerdown',e=>{const p=$('mere-pan'),g=$('el9-gem-pan');if(p&&!p.hidden&&!p.contains(e.target)&&!e.target.closest('#el9-mere'))el9MereLuk();if(g&&!g.hidden&&!g.contains(e.target)&&!e.target.closest('#el9-gem'))el9GemAaben(false)},true);
 document.addEventListener('keydown',e=>{if(e.key!=='Escape')return;const p=$('mere-pan'),g=$('el9-gem-pan');if(p&&!p.hidden){el9MereLuk();e.stopPropagation()}if(g&&!g.hidden)el9GemAaben(false)},true);
 /* 5 · væk: sidebjælke, flyout, Enkel tilstand, Niveau, numre */
 if(fly){fly.hidden=true;fly.remove()}if(sb)sb.remove();const en=$('enkel');if(en)en.remove();const eb=$('enkelbtn');if(eb)eb.remove();if(set.enkel){set.enkel=false;document.body.classList.remove('enkel')}
 const nv=$('tb-niv');if(nv){const l=nv.closest('label');(l||nv).remove()}
 try{numreVis(false,true)}catch(e){document.body.classList.add('numre-fra')}const na=$('numre-ab');if(na)na.hidden=true;
 /* 6 · docking låst som standard (første gang efter v9.71) */
 if(!set.laastStd971){set.laastStd971=1;set.laast=true;try{laasGem()}catch(e){}}try{laasUI()}catch(e){}
 try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}
 document.body.classList.add('el9');try{nul73Besked()}catch(e){}try{altBesked()}catch(e){}try{indlStart()}catch(e){}try{startSkVis()}catch(e){}try{tbhSaet()}catch(e){}try{nivAnvend()}catch(e){}try{lay3UI()}catch(e){}requestAnimationFrame(()=>{try{tbhSaet();window.dispatchEvent(new Event('resize'))}catch(e){}});
}
setTimeout(el9Byg,1500);
/* ========== SLUT: ÉN LINJE ØVERST ========== */

