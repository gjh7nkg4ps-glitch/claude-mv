/* ========== v9.72: ÉT TEMA, STØRRELSE OG INDSTILLINGER ==========
   Planen PLAN-NY-BRUGERFLADE.md, fase 5, trin 5c (pakke 4).
   - Tema: set.theme 'warm' (standard; Node-editorens Warm Analog i hele programmet), 'dark' (det gamle blå) eller 'light'. Warm sætter
     html.tema-warm; CSS'en nedenfor giver programmets variabler (--bg, --panel, --ink, --mute, --line, --acc …) temaets farver og retter
     de faste blå farver i topbjælken, zonerne, menuerne og felterne. EQ-visningens grafik ændres ikke.
   - Størrelse: set.stoerrelse (lille 0,85 · normal 1 · stor 1,15 · større 1,3) sættes som CSS zoom på body (st9Anvend); pvSkala ganger
     skærmens skalering med zoomen, så Live preview stadig tegnes skarpt.
   - Indstillinger (dialogen #sd) samler det, der kun handler om visning og ydelse: Tema, Størrelse, Skarphed, Effekter, Topbjælken,
     Linjer i Node-editoren (før Auto · Canvas 2D i kontrolpanelet), Felter, Billedhastighed, Sikker visning; Kvalitet, Kvalitetsregulator,
     Måletest og billeder i sekundet. De rigtige knapper FLYTTES hertil fra Mere → Lyd og ydelse (sektionen fjernes), så deres lyttere virker. */
const ST9={lille:.85,normal:1,stor:1.15,stoerre:1.3,klar:false,fors:0};
function st9Zoom(){return ST9[set.stoerrelse]||1}
function st9Anvend(){const z=st9Zoom();const nu=parseFloat(document.body.style.zoom||'1')||1;if(Math.abs(nu-z)>1e-6){document.body.style.zoom=z===1?'':String(z);try{tbhSaet()}catch(e){}try{pvResize()}catch(e){}requestAnimationFrame(()=>{try{window.dispatchEvent(new Event('resize'))}catch(e){}})}const s=$('s-stoer');if(s&&s.value!==set.stoerrelse)s.value=set.stoerrelse;const th=$('s-theme');if(th&&th.value!==set.theme)th.value=set.theme}
function st9Byg(){const sd=$('sd'),pan=$('mere-pan');if(!sd||!pan||!$('mere-lyd')||!$('tb-skarp')){if(++ST9.fors<80){setTimeout(st9Byg,100);return}}
 if(ST9.klar||!sd)return;ST9.klar=true;const dlg=sd.querySelector('.dlg'),h3=dlg&&dlg.querySelector('h3');if(!dlg||!h3)return;
 /* Visning */
 const vis=document.createElement('div');vis.className='ab';vis.id='sd-visning';vis.innerHTML='<b>Visning</b>';h3.insertAdjacentElement('afterend',vis);
 const tema=$('s-theme')&&$('s-theme').closest('label');if(tema)vis.appendChild(tema);const sto=$('s-stoer')&&$('s-stoer').closest('label');if(sto)vis.appendChild(sto);
 const sk=$('tb-skarp')&&$('tb-skarp').closest('label');if(sk){vis.appendChild(sk);sk.classList.remove('tbl');sk.querySelector('select').title='Live previews skarphed: Fuld = skærmens skalering. Højst 2× og 1× gør tegnefladen mindre, så hvert billede koster mindre.'}
 const fx=$('fx-knap');if(fx)vis.appendChild(fx);
 const dk=$('tb-dock')&&$('tb-dock').closest('label');if(dk){vis.appendChild(dk);dk.classList.remove('tbl');const o=$('tb-dock').options;if(o[1])o[1].textContent='Skjules, når musen er væk'}
 vis.insertAdjacentHTML('beforeend','<label>Linjer i Node-editoren <select id="s-linjer" title="Glød (TSL): linjerne tegnes med den nye three.js (WebGPU eller WebGL2) med blød kant og glød på det, der er valgt eller slår til. Enkle (Canvas 2D): linjerne tegnes som før, uden glød."><option value="auto">Glød (TSL)</option><option value="2d">Enkle (Canvas 2D)</option></select></label>');
 const felt=$('s-felt')&&$('s-felt').closest('label');if(felt)vis.appendChild(felt);const fps=$('s-fps')&&$('s-fps').closest('label');if(fps)vis.appendChild(fps);
 /* Ydelse */
 const yd=document.createElement('div');yd.className='ab';yd.id='sd-ydelse';yd.innerHTML='<b>Ydelse</b>';vis.insertAdjacentElement('afterend',yd);
 ['tb-kval','tb-reg'].forEach(id=>{const e=$(id),l=e&&e.closest('label');if(l){yd.appendChild(l);l.classList.remove('tbl')}});const bm=document.querySelector('[data-ma="klik:bench-start"]');if(bm)yd.appendChild(bm);const fp=$('tp-fps');if(fp)yd.appendChild(fp);
 /* Mere: sektionen Lyd og ydelse væk; Indstillinger som egen sektion */
 const ml=$('mere-lyd');if(ml){const sb=$('sbtn');const sek=document.createElement('div');sek.className='mere-sek';sek.id='mere-indst';sek.innerHTML='<h4>Indstillinger</h4><div class="mere-r"></div>';ml.insertAdjacentElement('afterend',sek);if(sb){sb.textContent='⚙ Indstillinger …';sb.title='Visning (tema, størrelse, skarphed, effekter), ydelse, lyd ind, optag video og nulstil';sek.querySelector('.mere-r').appendChild(sb)}ml.remove()}
 /* den gamle Opløsning-række i #sd (den første .ab med s-felt) er tom nu: fjern tomme rækker */
 dlg.querySelectorAll('.ab').forEach(a=>{if(!a.children.length&&!a.textContent.trim())a.remove()});const na=$('numre-ab');if(na)na.style.display='none';/* vinduesnumre er væk (5b); rækken Numre skal ikke vises */
 /* lyttere */
 const sl=$('s-linjer');if(sl){sl.value=(set.ne&&set.ne.linjer==='2d')?'2d':'auto';sl.onchange=e=>{try{neLinjerValg(e.target.value)}catch(x){}}}
 const ss=$('s-stoer');if(ss){ss.value=set.stoerrelse;ss.onchange=e=>{set.stoerrelse=e.target.value;applySet();msg('Størrelse: '+e.target.options[e.target.selectedIndex].textContent+'.')}}
 const th=$('s-theme');if(th){th.value=set.theme;th.onchange=e=>{set.theme=e.target.value;applySet();msg('Tema: '+e.target.options[e.target.selectedIndex].textContent+'.')}}
 if($('sbtn'))$('sbtn').onclick=()=>{try{el9MereLuk()}catch(e){}try{st9Anvend()}catch(e){}$('sd').showModal()};
 st9Anvend();}
setTimeout(st9Byg,2200);try{document.documentElement.classList.toggle('tema-warm',set.theme==='warm')}catch(e){}
/* ========== SLUT: ÉT TEMA, STØRRELSE OG INDSTILLINGER ========== */

