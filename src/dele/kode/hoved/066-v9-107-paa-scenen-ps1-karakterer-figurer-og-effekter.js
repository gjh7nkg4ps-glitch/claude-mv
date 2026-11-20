/* ========== v9.107: PÅ SCENEN (PS1): KARAKTERER, FIGURER OG EFFEKTER ==========
   P8.14 punkt 7 og planen docs/PLAN-PAA-SCENEN.md (godkendt i P8.20). Vinduet Figurer (w34) hedder På scenen og har tre afsnit, der kan foldes
   (set.paaScene husker det): Karakterer (figurer med laget danser), Figurer (alle andre) og Effekter (de 19 fra TARGETS med mærket "hele billedet",
   foldet sammen fra start). Alle rækker har øje, Slå fra (⏻) og styrke. Effekterne får hver sit øje, Slå fra og styrke i scene.ne.eff[id]
   ({skjult, fra, styrke}); motoren spørger pr. effekt (neFraF), tegningen pr. effekt (ne12Skjult, blinkE) og styrken ganges på (neFigF).
   Gruppernes øje, Slå fra og styrke i Noder bliver stående som "alle i gruppen" (gruppe-flaget gælder stadig oven i). Ctrl+Z dækker det (feNe/feGendan).
   Intet ændres for de indbyggede opsætninger: scene.ne.eff er tom, til man trykker. Matrix og Noder viser øje/Slå fra pr. effekt fra PS3. */
const PS_TEGN={puls:'☀',farve:'▣',burst:'✺',bolge:'∿',glod:'◌',ryst:'≋',fart:'»',zoom:'⤢',ring:'◎',strobe:'⚡',banelys:'⋮',sky:'☁',daempring:'◍',ekko:'◐',usikker:'⁘',fokus:'◉',relation:'⟟',hale:'⌁',sloer:'▒'};
function psEffListe(){return TARGETS.filter(t=>t.gruppe==='effekt')}
function psEff(id){if(typeof scene==='undefined'||!scene)return{};scene.ne=scene.ne||{};const E=scene.ne.eff=(scene.ne.eff&&typeof scene.ne.eff==='object')?scene.ne.eff:{};return E[id]||{}}
function psEffSaet(id,felt,v){const E=(scene.ne.eff=scene.ne.eff||{}),q=E[id]=E[id]||{};if(v===undefined||v===false||v===null||(felt==='styrke'&&v===1))delete q[felt];else q[felt]=v;if(!Object.keys(q).length)delete E[id];try{NE12.fc=null}catch(e){}}
function psEffAf(e){e=String(e);if(e.startsWith('obj:')||e.startsWith('liv:'))return null;const E=typeof scene!=='undefined'&&scene&&scene.ne&&scene.ne.eff;return (E&&E[e])||null}
function psFold(){set.paaScene=(set.paaScene&&typeof set.paaScene==='object')?set.paaScene:{kar:true,fig:true,eff:false};return set.paaScene}
function psErKar(o){const l=o&&o.lag&&o.lag[0];return !!(l&&l.form==='danser')}
function psNavn(k){if(k.startsWith('f:')){const o=fase2.objekter.find(x=>x.id===k.slice(2));return o?o.navn:k}const t=TARGETS.find(x=>x.id===k.slice(2));return t?t.navn:k.slice(2)}
function psStyrkeAf(k){if(k.startsWith('f:'))return neFigStyrke(k);const q=psEff(k.slice(2));return Number.isFinite(+q.styrke)?+q.styrke:1}
function psFraAf(k){return k.startsWith('f:')?neFigFra(k):!!psEff(k.slice(2)).fra}
function psKnapper(k,vis,fra,st){return (vis===null?'':'<button class="fg34-oje" data-psoje="'+k+'" title="'+(vis?'Tegnes. Klik: skjul på scenen (reglerne regner videre)':'Skjult på scenen. Klik: vis igen')+'" aria-pressed="'+vis+'">'+(vis?'👁':'⊘')+'</button>')
 +'<button class="fg34-oje ps-fra'+(fra?' on':'')+'" data-psfra="'+k+'" title="'+(fra?'Slået fra: reglerne giver 0. Klik: slå til igen':'Slå fra: reglerne giver 0, men den kan ses')+'" aria-pressed="'+fra+'">⏻</button><span class="ps-styrke" data-psst="'+k+'" title="Styrke ×'+neTal(st)+': ganges på alle reglerne. Træk op og ned; dobbeltklik = 1">×'+neTal(st)+'</span>'}
function psEffRaekke(t){const e=psEff(t.id),n=maps.filter(m=>String(m.effect)===t.id).length;return '<div class="fg34-row ps-eff'+(e.skjult?' ps-af':'')+(e.fra?' ps-fraet':'')+'" data-pseff="'+t.id+'" title="'+esc(t.navn)+': virker på hele billedet. Reglerne står i matrixen (3 · Regler)."><i>'+(PS_TEGN[t.id]||'✦')+'</i><span class="fg34-navn ps-navn" role="button" tabindex="0" data-psbib="'+t.id+'" title="Åbn effekten i Biblioteket (regel-sæt)">'+esc(t.navn)+'</span><em class="ps-hele" title="Virker på hele billedet, ikke én ting på scenen">hele billedet</em>'+(n?'<small title="'+n+' regler">'+n+'</small>':'')+psKnapper('e:'+t.id,!e.skjult,!!e.fra,psStyrkeAf('e:'+t.id))+'</div>'}
function psSaetOeje(k){if(!k.startsWith('e:'))return;const id=k.slice(2),vis=!!psEff(id).skjult;psEffSaet(id,'skjult',vis?undefined:true);try{save()}catch(e){}fg34Byg();msg(psNavn(k)+(vis?' vises igen på scenen.':' er skjult på scenen (reglerne regner videre). Ctrl+Z fortryder.'))}
function psSaetFra(k){const fra=!psFraAf(k);if(k.startsWith('f:')){neSaetFra(k,fra);fg34Byg();return}const id=k.slice(2);psEffSaet(id,'fra',fra?true:undefined);try{save()}catch(e){}fg34Byg();msg(psNavn(k)+(fra?' er slået fra: reglerne giver 0, men den kan ses. Ctrl+Z fortryder.':' er slået til igen.'))}
function psSaetStyrke(k,v,slut){v=Math.max(0,Math.min(2,Math.round(v*20)/20));if(k.startsWith('f:')){neSaetFigStyrke(k,v,slut);return}psEffSaet(k.slice(2),'styrke',v);if(slut){try{save()}catch(e){}msg(psNavn(k)+': styrke ×'+neTal(v)+'. Ctrl+Z fortryder.')}}
/* vinduet: de tre afsnit lægges uden om Figurers rækker, og effekterne får deres egne */
{const gl=fg34Byg;window.fg34Byg=function(){gl();const h=$('fg34'),li=h&&h.querySelector('.fg34-liste');if(!li||li.querySelector('.ps-afsnit'))return;const F=psFold();
 const kar=[],fig=[];[...li.querySelectorAll('.fg34-row[data-fg34]')].forEach(r=>{const o=fase2.objekter[+r.dataset.fg34];if(!o)return;const k='f:'+o.id;if(!o.skabelon){const oj=r.querySelector('[data-fg34oje]');(oj||r).insertAdjacentHTML(oj?'afterend':'beforeend',psKnapper(k,null,neFigFra(k),neFigStyrke(k)));if(neFigFra(k))r.classList.add('ps-fraet')}(psErKar(o)?kar:fig).push(r)});
 const det=(k,navn,n,ekstra)=>{const d=document.createElement('details');d.className='ps-afsnit';d.dataset.ps=k;d.open=F[k]!==false;d.innerHTML='<summary><span>'+navn+' ('+n+')</span>'+(ekstra||'')+'</summary>';return d};
 const dk=det('kar','Karakterer',kar.length),df=det('fig','Figurer',fig.length),de=det('eff','Effekter',psEffListe().length,' <em class="ps-hele" title="Effekterne virker på hele billedet, ikke på én ting på scenen">hele billedet</em>');
 kar.forEach(r=>dk.appendChild(r));fig.forEach(r=>df.appendChild(r));de.insertAdjacentHTML('beforeend',psEffListe().map(psEffRaekke).join(''));li.appendChild(dk);li.appendChild(df);li.appendChild(de);li.setAttribute('aria-label','På scenen');if(FG34.omd>=0){const i=li.querySelector('.fg34-omd');if(i){i.focus();i.select()}}/* flytningen ind i afsnittene tog fokus fra omdøbnings-feltet */}}
(function(){const h=$('fg34');if(!h)return;
 h.addEventListener('toggle',e=>{const d=e.target&&e.target.closest&&e.target.closest('.ps-afsnit');if(!d)return;psFold()[d.dataset.ps]=d.open;try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}},true);
 h.addEventListener('click',e=>{const t=e.target;const o=t.closest('[data-psoje]');if(o){e.stopPropagation();psSaetOeje(o.dataset.psoje);return}const f=t.closest('[data-psfra]');if(f){e.stopPropagation();psSaetFra(f.dataset.psfra);return}});
 h.addEventListener('dblclick',e=>{const s=e.target.closest('[data-psst]');if(!s)return;e.preventDefault();e.stopPropagation();psSaetStyrke(s.dataset.psst,1,true);fg34Byg()});
 h.addEventListener('pointerdown',e=>{const s=e.target.closest('[data-psst]');if(!s||e.button>0)return;e.preventDefault();e.stopPropagation();const k=s.dataset.psst,y0=e.clientY,v0=psStyrkeAf(k);let v=v0,flyt=false;try{s.setPointerCapture(e.pointerId)}catch(x){}
  const mv=ev=>{const nv=Math.max(0,Math.min(2,Math.round((v0-(ev.clientY-y0)/120)*20)/20));if(nv===v&&!flyt)return;flyt=true;v=nv;psSaetStyrke(k,v,false);s.textContent='×'+neTal(v)};
  const op=()=>{s.removeEventListener('pointermove',mv);s.removeEventListener('pointerup',op);s.removeEventListener('pointercancel',op);if(flyt){psSaetStyrke(k,v,true);fg34Byg()}};
  s.addEventListener('pointermove',mv);s.addEventListener('pointerup',op);s.addEventListener('pointercancel',op)})})();
/* ved opstart bygges listen, før denne blok er læst (formUI kører tidligt), så den bygges én gang til med afsnittene */
setTimeout(()=>{try{fg34Byg()}catch(e){}},60);setTimeout(()=>{try{if(!document.querySelector('#fg34 .ps-afsnit'))fg34Byg()}catch(e){}},2500);
/* motoren og tegningen spørger pr. effekt (oven i gruppens flag) */
{const gl=neFraF;window.neFraF=function(m){const q=psEffAf(m&&m.effect);if(q&&q.fra)return true;return gl(m)}}
{const gl=ne12Skjult;window.ne12Skjult=function(e){const q=psEffAf(e);if(q&&q.skjult)return true;return gl(e)}}
{const gl=neFigF;window.neFigF=function(e){let f=gl(e);const q=psEffAf(e);if(q&&Number.isFinite(+q.styrke))f*=+q.styrke;return f}}
{const gl=blinkE;window.blinkE=function(E){const X=typeof scene!=='undefined'&&scene&&scene.ne&&scene.ne.eff;if(X&&Object.keys(X).some(k=>X[k]&&X[k].skjult)){E=Object.assign({},E);Object.keys(E).forEach(k=>{if(X[k]&&X[k].skjult)E[k]=0})}return gl(E)}}
/* Rettet samtidig (fundet af test 37 på v9.106): med gitteret (v9.105) ligger alle pladser fast, så et skift af sorteringen (Figur → mål · D2) ikke kunne ses;
   nu lægges gitteret om, når sorteringen skiftes, og D2's mappe-overskrifter følger lydtrækkenes rigtige pladser (gitMapper). */
function gitMapper(){if(typeof NE42==='undefined'||!NE42.mapper||!NE42.mapper.length||!NE2.N)return;const els=[...document.querySelectorAll('#ne-verden .ne42-mappe')],lt=[...NE2.N.values()].filter(n=>n.el&&n.kol==='lydtraek');
 NE42.mapper.forEach((h,i)=>{const f=lt.filter(n=>{try{return sigInfo(n.band).mappe===h.mappe}catch(e){return false}}).sort((a,b)=>a.y-b.y)[0];if(!f)return;h.y=f.y;if(els[i]){els[i].style.top=(f.y-26)+'px';els[i].style.left=f.x+'px'}})}
{const gl=gitLaeg;window.gitLaeg=function(){const r=gl.apply(this,arguments);try{gitMapper()}catch(e){}return r}}
{const gl=ne2Byg;window.ne2Byg=function(){const r=gl.apply(this,arguments);try{gitMapper()}catch(e){}return r}}
{const gl=ne42SaetSort;window.ne42SaetSort=function(v){gl(v);try{if(NE2.N&&NE2.N.size&&!GIT.gammel){NE2.sig='';ne2Byg();const g=gitInd();if(g.ramme)gitRetOp(true);else gitStandard(1,true)}}catch(e){}}}
/* ========== SLUT: PÅ SCENEN (PS1): KARAKTERER, FIGURER OG EFFEKTER ========== */


