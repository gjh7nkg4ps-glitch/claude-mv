/* ========== v9.76: SANG-VINDUET ==========
   Planen docs/PLAN-SANG-OG-ANALYSE.md, trin S2 (layout B, P8.4): arbejdsområdet 1 · Sang er ét vindue (w35) med Lydkilde til venstre
   og fanerne Sang · Spor · Avanceret til højre. Kortene er de gamle vinduers indhold, flyttet ind som DOM-elementer (samme id'er, samme
   lyttere, samme tal): Tidslinje (w1) = Bølgeform og sløjfe, EQ (w3) = Spektrum, Analyse (w7) = Toner og klang, EQ+ (w24) = Spektrum+,
   Lydkilde (w31) = venstre side, kortet 4 spor = fanen Spor, Shows tempoknapper = Taktslag. Indstillinger for analysen (Normalisering, Lange
   sange, Adaptiv tærskel, Analysér igen, flueben) står kun her; Automatik viser værdien og "Ændres i Sang" (auSang). De fem gamle vinduer er
   skjult, og dkVis åbner Sang på den rigtige fane (SG_ALIAS). Tegnefladerne får størrelse efter deres kort (ResizeObserver). */
const SG={klar:false,sig:''},SG_ALIAS={w1:'sang',w3:'sang',w31:'sang',w7:'avanceret',w24:'avanceret'};
if(!set.s2a){set.s2a=1;try{if(set.dockLay)delete set.dockLay['ao-sang']}catch(e){}}
/* gemte layouts: de gamle vinduer bliver til Sang */
(function(){const om=n=>{if(!n)return;if(n.t==='z'){const f=[];n.f.forEach(id=>{const ny=SG_ALIAS[id]?'w35':id;if(!f.includes(ny))f.push(ny)});n.f=f;if(SG_ALIAS[n.a])n.a='w35';return}(n.c||[]).forEach(om)};try{om(set.dock);Object.values(set.dockLay||{}).forEach(om)}catch(e){}})();
function sgFane(n){if(!['sang','spor','avanceret'].includes(n))n='sang';set.sgFane=n;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}const h=$('sg');if(!h)return;h.querySelectorAll('.sg-fane').forEach(f=>{f.hidden=f.dataset.sg!==n});h.querySelectorAll('[data-sgf]').forEach(b=>{const on=b.dataset.sgf===n;b.classList.toggle('on',on);b.setAttribute('aria-selected',on)});sgMaal()}
function sgKort(id,navn,hjaelp){return '<section class="sg-kort" data-kort="'+id+'"><div class="sg-top"><h4>'+navn+'</h4>'+(hjaelp?'<span class="small">'+hjaelp+'</span>':'')+'<span class="sg-top-h" data-sgh="'+id+'"></span></div><div class="sg-krop" data-sgk="'+id+'"></div></section>'}
function sgMaal(){const h=$('sg');if(!h)return;h.querySelectorAll('.sg-krop canvas').forEach(c=>{const b=c.parentElement;if(!b||c.offsetParent===null)return;const W=Math.max(50,Math.round(b.clientWidth)),H=Math.max(50,Math.round(b.clientHeight));if(c.width!==W||c.height!==H){c.width=W;c.height=H}})}
function sgFlyt(el,til){if(el&&til&&el.parentNode!==til)til.appendChild(el)}
function sgByg(){const h=$('sg');if(!h||SG.klar)return;SG.klar=true;
 h.innerHTML='<div class="sg-venstre"></div><div class="sg-hoejre"><div class="sg-faner" role="tablist" aria-label="Analyse: faner"><button class="ghost" role="tab" data-sgf="sang">Sang</button><button class="ghost" role="tab" data-sgf="spor">Spor</button><button class="ghost" role="tab" data-sgf="avanceret">Avanceret</button><span id="sg-lyt" class="sg-lyt" hidden></span></div>'
  +'<div class="sg-fane" data-sg="sang">'+sgKort('tl','Bølgeform og sløjfe','klik for at springe, træk for at vælge et klip, hjul for zoom')+sgKort('eq','Spektrum','de 14 lydtræk som søjler; klik og træk i en søjle for tærskel')+sgKort('niv','Niveau','V og H lige nu, topværdi og klip; lydstyrke (LUFS) og dynamik for hele sangen · kun visning')+sgKort('takt','Taktslag','tempo fra filen; ret det her, hvis analysen tog det halve eller det dobbelte')+'</div>'
  +'<div class="sg-fane" data-sg="spor" hidden><p class="small sg-f">Én række pr. spor, der findes. Når der kun lyttes til ét spor, står det her.</p></div>'
  +'<div class="sg-fane" data-sg="avanceret" hidden>'+sgKort('lot','Lyd over tid','hele sangen på én tidsakse: klik hopper, hjul zoomer, Shift + hjul flytter')+sgKort('an','Toner og klang','log-spektrum, toneklasser og tonehøjde')+sgKort('ste','Stereo','goniometer lige nu; stereobredde, panorering og faselighed fra analysen')+sgKort('eqp','Spektrum+','31 bånd, vandfald, topværdi, lyt til ét bånd')+sgKort('det','Detektion','tap K og S i takt med sangen; hit-raten viser, hvor sikkert Kick og Snare findes')+sgKort('indst','Indstillinger for analysen','står kun her; panelet Automatik viser værdien')+'</div></div>';
 const K=id=>h.querySelector('[data-sgk="'+id+'"]'),T=id=>h.querySelector('[data-sgh="'+id+'"]');
 /* Lydkilde */ sgFlyt($('lks'),h.querySelector('.sg-venstre'));
 /* Tidslinje */ {const w=$('w1');if(w){sgFlyt(w.querySelector('.tlbar'),T('tl'));sgFlyt(w.querySelector('#tl'),K('tl'))}}
 /* EQ */ {const w=$('w3');if(w){sgFlyt($('eq-tilpas-maerke'),T('eq'));sgFlyt($('eq-ops'),T('eq'));sgFlyt($('eq-panel'),K('eq').parentNode);K('eq').parentNode.insertBefore($('eq-panel'),K('eq'));sgFlyt($('eq'),K('eq'));sgFlyt($('eqctl'),K('eq').parentNode)}}
 /* Taktslag (fra Show) */ {const b=$('show-halv');if(b&&b.parentNode)sgFlyt(b.parentNode,K('takt'))}
 /* Analyse */ sgFlyt($('an'),K('an'));
 /* EQ+ */ sgFlyt($('eqp-bar'),T('eqp'));sgFlyt($('eqp'),K('eqp'));
 /* Detektion (v9.95; før det skjulte vindue w20) */ {const w=$('w20');if(w){const s=w.querySelector('.wb > section');if(s)sgFlyt(s,K('det'))}}
 /* Indstillinger for analysen */ sgIndstTegn(true);
 /* Lyd over tid (v9.77) */ try{lotByg()}catch(e){console.error(e)}
 /* Niveau (v9.78) */ try{nivByg()}catch(e){console.error(e)}
 /* Stereo (v9.79) */ try{steByg()}catch(e){console.error(e)}
 ['w1','w3','w7','w24','w31','w20'].forEach(id=>{const w=$(id);if(w){w.hidden=true;w.classList.add('zon-skjult')}});
 h.addEventListener('click',e=>{const b=e.target.closest('[data-sgf]');if(b){sgFane(b.dataset.sgf);return}const a=e.target.closest('[data-sgau]');if(a){auSaet(a.dataset.sgau,a.dataset.v);SG.sig='';setTimeout(()=>sgIndstTegn(),80)}});
 try{new ResizeObserver(()=>sgMaal()).observe(h)}catch(e){}
 sgFane(set.sgFane||'sang');setInterval(sgTik,300)}
function sgIndstTegn(tving){const k=document.querySelector('#sg [data-sgk="indst"]');if(!k||(k.offsetParent===null&&!tving))return;let T;try{T=auTilstand()}catch(e){return}const sig=JSON.stringify(T);if(sig===SG.sig)return;SG.sig=sig;
 const seg=(key,a,b,paaA)=>'<span class="ne-seg sg-seg" role="group"><button class="'+(paaA?'on':'ghost')+'" data-sgau="'+key+'" data-v="1" aria-pressed="'+paaA+'">'+a+'</button><button class="'+(paaA?'ghost':'on')+'" data-sgau="'+key+'" data-v="0" aria-pressed="'+!paaA+'">'+b+'</button></span>';
 const rk=(navn,hvad,styr)=>'<div class="sg-r"><b>'+navn+'</b><span class="small">'+hvad+'</span><span class="sg-styr">'+styr+'</span></div>';
 k.innerHTML=rk('Normalisering','Gør hvert lydtræk til et tal fra 0 til 1. Adaptiv: efter sangen. Fast: en fast målestok.',seg('norm','Adaptiv','Fast',T.norm==='auto'))
  +rk('Lange sange','Sange over 10 minutter måles i stykker på 2 minutter, så ét kraftigt stykke ikke holder resten nede.',seg('lokal','Til','Fra',T.lokal))
  +rk('Adaptiv tærskel','Flytter reglernes tærskel efter lydens niveau lige nu (hvor hurtigt og bundgrænse: ⚙ Opsætning ved Spektrum).',seg('tilpas','Til','Fra',T.tilpas))
  +rk('Sangens analyse','Sammenligner analysen med lyden i 8 dele af sangen.','<span>'+neHtml(String(T.ana))+'</span> <button class="ghost" data-sgau="anaigen" title="Analysér sangen forfra og gem den nye analyse">Analysér igen</button>'+(typeof atDeleHtml==='function'?atDeleHtml():''))}
function sgTik(){try{nivStart()}catch(e){}const h=$('sg');if(!h||h.offsetParent===null)return;const st=document.querySelector('#lks .lks-stem');if(st){const f=h.querySelector('.sg-fane[data-sg="spor"]');if(f)f.appendChild(st)}sgMaal();sgIndstTegn()}
sgByg();
/* ========== SLUT: SANG-VINDUET ========== */

