/* ========== v5.8: SCENE-VINDUET ==========
   Live preview (W2), Radial Mesh (W5), Routing-overblik (W10), EQ (W3), Master Morph Pad (W11), Dublet (W8) og Lyd i 3D (W9) bor som faner i ét vindue, Scene (W23), med store skifteknapper. Den valgte fane fylder vinduet; de andre er usynlige, men tegner videre, hvis de er udgangsvinduets kilde, så projektoren aldrig fryser. Dublet, Lyd i 3D, Routing og Morph Pad sættes på pause, når de ikke er valgt (medmindre de er projektorens kilde).
   ⇱ Riv løs gør fanen til sit eget vindue igen (husket i set.scene.ude), og et løsrevet vindue har knappen ⤵ Til Scene. ▸ Send til skærm sender fanen til udgangsvinduet (Live preview, Radial Mesh og Lyd i 3D). Åbnes et af vinduerne et andet sted fra (fx Vinduer-menuen), vælges dets fane. */
const SC_FANER=[['w2','Live preview'],['w5','Radial Mesh'],['w28','Mesh 3D'],['w29','Øjet']]/* v9.81: Lyd i 3D er fjernet *//* v9.76: EQ og EQ+ bor i Sang */,SC_TUNG={},SC_UD={w2:'pv',w5:'mesh',w28:'mesh3d',w29:'oeje'};
(function(){const d=set.scene&&typeof set.scene==='object'?set.scene:{};set.scene={aktiv:SC_FANER.some(f=>f[0]===d.aktiv)?d.aktiv:'w2',ude:Array.isArray(d.ude)?d.ude.filter(x=>SC_FANER.some(f=>f[0]===x)):[]}})();
const scIScene=id=>{const w=$(id);return !!(w&&w.classList.contains('scene-member'))};
function scGem(){try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}}
function scAabn(id){const w=$(id);if(w)w.hidden=false}
function scUdKilde(){const k=$('ud-kilde');return k?k.value:''}
function scVaelg(id,stille){if(!scIScene(id))return;set.scene.aktiv=id;scGem();const ud=scUdKilde();
 SC_FANER.forEach(([fid])=>{const w=$(fid);if(!scIScene(fid))return;const aktiv=fid===id;w.classList.toggle('scene-aktiv',aktiv);if(w.classList.contains('min'))miniSaet(w,false);
  if(aktiv){SC_TUNG[fid]?(w.hidden?scAabn(fid):null):(w.hidden=false);w.hidden=false}else if(SC_TUNG[fid]&&SC_UD[fid]!==ud){w.hidden=true}else w.hidden=false});
 try{({w5:meshResize}[id]||(()=>{}))()}catch(e){}requestAnimationFrame(()=>{try{window.dispatchEvent(new Event('resize'))}catch(e){}});scFaner();if(!stille)msg('Scene viser nu '+(SC_FANER.find(f=>f[0]===id)||[0,''])[1]+'.')}
function scIndIScene(id){const w=$(id),k=$('sc-krop');if(!w||!k||scIScene(id))return;if(w.classList.contains('min'))miniSaet(w,false);if(w.classList.contains('max')){w.classList.remove('max');const mx=w.querySelector('.mx');if(mx)mx.textContent='Maksimér'}w.dataset.scStil=w.getAttribute('style')||'';w.classList.add('scene-member');k.appendChild(w);set.scene.ude=set.scene.ude.filter(x=>x!==id)}
function scRiv(id){const w=$(id);if(!scIScene(id))return;const sc=$('w23'),ws=$('ws');w.classList.remove('scene-member','scene-aktiv');ws.appendChild(w);const r=sc.getBoundingClientRect(),wr=ws.getBoundingClientRect();
 w.setAttribute('style','left:'+Math.round(r.left-wr.left+40)+'px;top:'+Math.round(r.top-wr.top+60)+'px;width:'+Math.round(r.width*.6)+'px;height:'+Math.round(Math.max(360,r.height*.7))+'px');w.style.zIndex=++zTop;w.hidden=false;if(SC_TUNG[id])scAabn(id);
 if(!set.scene.ude.includes(id))set.scene.ude.push(id);const naeste=SC_FANER.find(f=>scIScene(f[0])&&!$(f[0]).classList.contains('niv-skjult'));if(set.scene.aktiv===id&&naeste)scVaelg(naeste[0],true);scGem();scFaner();try{dockOpdat()}catch(e){}
 msg((SC_FANER.find(f=>f[0]===id)||[0,''])[1]+' er nu sit eget vindue. Tryk ⤵ Til Scene i dets overskrift for at lægge det tilbage som fane.')}
function scTilbage(id){scIndIScene(id);scGem();scVaelg(id,true);try{dockOpdat()}catch(e){}msg((SC_FANER.find(f=>f[0]===id)||[0,''])[1]+' er lagt tilbage som fane i Scene.')}
function scFaner(){const el=$('sc-faner');if(!el)return;setTimeout(()=>{try{tilpasUI()}catch(e){}},0);const a=set.scene.aktiv,ud={w2:1,w5:1,w9:1,w28:1,w29:1}[a];
 el.innerHTML=SC_FANER.filter(([id])=>scIScene(id)&&!$(id).classList.contains('niv-skjult')).map(([id,n])=>'<button class="ghost sc-f'+(id===a?' on':'')+'" role="tab" aria-selected="'+(id===a)+'" data-sc="'+id+'">'+n+'</button>').join('')+'<span class="sc-luft"></span><button class="ghost" data-scriv title="Gør den valgte fane til sit eget vindue, fx for at se to ting på én gang.">⇱ Riv løs</button><button class="ghost" data-scud'+(ud?'':' disabled')+' title="'+(ud?'Vis den valgte fane i udgangsvinduet (ekstern skærm).':'Udgangsvinduet kan kun vise Live preview, Radial Mesh, Mesh 3D og Øjet.')+'">▸ Send til skærm</button>'}
$('sc-faner').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.sc){scVaelg(b.dataset.sc);return}if(b.dataset.scriv!==undefined){scRiv(set.scene.aktiv);return}
 if(b.dataset.scud!==undefined){const k=SC_UD[set.scene.aktiv],sel=$('ud-kilde');if(!k||!sel)return;sel.value=k;sel.dispatchEvent(new Event('change',{bubbles:true}));try{udgangStart()}catch(x){}msg((SC_FANER.find(f=>f[0]===set.scene.aktiv)||[0,''])[1]+' vises i udgangsvinduet. Træk det over på den eksterne skærm.')}});
/* hvert medlem får ⤵ Til Scene i sin overskrift (vises kun, når det er løsrevet); medlemmers overskrift kan ikke trække vinduet */
SC_FANER.forEach(([id])=>{const w=$(id),h=w&&w.querySelector('.wh');if(!h)return;const b=document.createElement('button');b.className='ghost sc-tilbage';b.textContent='⤵ Til Scene';b.title='Læg vinduet tilbage som fane i Scene-vinduet.';b.onclick=e=>{e.stopPropagation();scTilbage(id)};const sp=h.querySelector('span:last-child');(sp&&sp!==h.firstElementChild?sp:h).appendChild(b);
 h.addEventListener('pointerdown',e=>{if(w.classList.contains('scene-member')&&!e.target.closest('button,select,input,label'))e.stopImmediatePropagation()},true)});
/* åbnes et medlem andre steder fra, vælges fanen */
{const pak=(navn,id)=>{const f=window[navn];if(typeof f!=='function')return;window[navn]=function(on){if(on&&scIScene(id)){scVaelg(id,true);return}return f.apply(this,arguments)}};}
['dubbtn','rtbtn'].forEach((bid,i)=>{const id=['w8','w10'][i],b=$(bid);if(!b)return;const gl=b.onclick;b.onclick=e=>{if(scIScene(id)){scVaelg(id);return}if(gl)gl.call(b,e)}});
/* start: læg medlemmerne ind (undtagen de løsrevne) */
SC_FANER.forEach(([id])=>{if(!set.scene.ude.includes(id))scIndIScene(id)});
if(!scIScene(set.scene.aktiv))set.scene.aktiv=(SC_FANER.find(f=>scIScene(f[0]))||['w2'])[0];scVaelg(set.scene.aktiv,true);
$('ud-kilde')&&$('ud-kilde').addEventListener('change',()=>scVaelg(set.scene.aktiv,true));
/* ========== SLUT: SCENE-VINDUET ========== */





