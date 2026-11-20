/* ========== v9.19: NODE-EDITOR (TRIN 1): LÆRRED, ZOOM, TEMA OG KONTROLPANEL ==========
   Node-editoren (vores navn; fagudtryk: node editor) som fanen Node-editor i Arbejdsfeltet (W33) og layoutet Noder i topbaren.
   Trin 1 af 16 (docs/PLAN-NODE-EDITOREN.md): kun lærredet, de 9 kolonner, værktøjslinjen med zoom og Tilpas, og kontrolpanelet.
   Der er ingen noder endnu, og intet i maps ændres.
   Temaet Warm Analog (fagudtryk: design tokens) læses fra <script type="application/json" id="tema-warm-analog"> nederst i filen
   (en kopi af docs/node-editoren/tema-warm-analog.json) og lægges ud som CSS-variabler (--ne-…) på #ne.
   Der må ikke stå en eneste farvekode i denne blok eller i <style id="ne-stil">; testen 14-node-editor.js tjekker det.
   Bredder, afstanden mellem kolonnerne, hjørner og skrifttyperne kommer også fra temaet.
   Visningen (zoom og hvor lærredet er flyttet hen) gemmes i set.ne = {z, x, y, tilpas}. Mangler den (fx gamle indstillinger), tilpasses visningen.
   Tilpas gælder, indtil man selv zoomer eller flytter: så længe følger visningen med, når vinduet ændrer størrelse.
   Navnet "link" bruges ikke i koden, fordi Mesh 3D har M3.links; alt nyt hedder NE…. */
const NE={tema:null,byg:false,z:1,x:0,y:0,tilpas:false,kol:[],bredde:0,tilpasVent:false,gemT:0,traek:null,ZMIN:.1,ZMAX:2,TOP:96};
/* [nøgle i temaets "kolonne", navn, bredde (smal, normal eller bred), hvad der kommer i kolonnen, hvornår] */
const NE_KOL=[['lydkilde','Lydkilde','bred','Lydfil, 4 spor, Lyd ind, generator, MIDI og Tastatur','trin 3 (v9.21)'],
 ['fft','FFT','normal','FFT · hurtig (2048) og FFT · fin (8192)','trin 3 (v9.21)'],
 ['analyse','Analyse','normal','De 9 analyser, fx Slag-detektor og Taktslag','trin 3 (v9.21)'],
 ['lydtraek','Lydtræk','normal','Ét tal mellem 0 og 1, fx Kick','trin 2 (v9.20)'],
 ['regel','Regel','bred','Hvornår og hvor meget','trin 2 (v9.20)'],
 ['figur','Figur','normal','Hvem der reagerer (og effekt-grupper)','trin 2 (v9.20)'],
 ['maal','Mål','normal','Hvad figuren gør, fx Hop','trin 2 (v9.20)'],
 ['scene','Scene','bred','Hvor det hele vises','trin 12 (v9.30)']];
function neTema(){if(NE.tema)return NE.tema;try{const el=document.getElementById('tema-warm-analog');NE.tema=el?JSON.parse(el.textContent):null}catch(e){NE.tema=null}return NE.tema}
/* Hvert blad i temaet bliver en CSS-variabel: grund.tekst → --ne-grund-tekst, maalerGradient[0] → --ne-maalerGradient-0.
   Tal under "maal" får px på; skriftfamilier får anførselstegn (fx "Exo 2"). */
function neTemaVars(el,t){const navne=[];const gaa=(o,sti)=>{if(o==null)return;if(Array.isArray(o)){o.forEach((v,i)=>gaa(v,sti.concat(i)));return}
 if(typeof o==='object'){Object.keys(o).forEach(k=>gaa(o[k],sti.concat(k)));return}
 let v=String(o);if(typeof o==='number'&&sti[0]==='maal')v=o+'px';if(sti[sti.length-1]==='familie')v='"'+v.replace(/"/g,'')+'"';
 el.style.setProperty('--ne-'+sti.join('-'),v);navne.push('--ne-'+sti.join('-'))};gaa(t,[]);return navne}
const neEsc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function neByg(){const rod=$('ne');if(!rod||NE.byg)return;NE.byg=true;const t=neTema();
 if(!t||!t.maal||!t.kolonne){rod.innerHTML='<div class="ne-fejl">Temaet Warm Analog kunne ikke læses, så Node-editoren kan ikke vises. Det skal ligge nederst i filen som &lt;script id="tema-warm-analog"&gt;.</div>';return}
 neTemaVars(rod,t);NE.ZMIN=.02;/* v9.68: zoom ud til 2 % (før 10 %) */
 const B=t.maal.bredde,gap=+t.maal.kolonneAfstand;let x=0;NE.kol=NE_KOL.map(([k,navn,b,hvad,naar])=>{const o={k,navn,x,w:+B[b],b,hvad,naar};x+=o.w+gap;return o});NE.bredde=x-gap;
 rod.innerHTML='<div class="ne-vlinje" role="toolbar" aria-label="Node-editorens værktøjslinje"><b class="ne-titel">Node-editor</b><span class="ne-trin" title="Planen står i docs/PLAN-NODE-EDITOREN.md">Trin 1 af 16 · kun lærredet</span><span class="ne-luft"></span>'
  +'<button class="ne-k" data-ne="ud" title="Zoom ud (musehjulet eller −)" aria-label="Zoom ud">−</button><span class="ne-zoom" id="ne-zoom" title="Zoom (2 til 200 %)">100 %</span><button class="ne-k" data-ne="ind" title="Zoom ind (musehjulet eller +)" aria-label="Zoom ind">+</button>'
  +'<button class="ne-k" data-ne="placer" title="Placér alle noder automatisk igen. De noder, du har flyttet, flyttes tilbage.">Placér</button><button class="ne-k" data-ne="tilpas" title="Tilpas: vis alle noder i bredden (uden noder: alle 9 kolonner). Tasten 0.">Tilpas</button></div>'
  +'<div class="ne-flade" id="ne-flade" tabindex="0" role="application" aria-label="Lærredet med de 9 kolonner og noderne. Træk for at flytte, musehjulet zoomer, Shift og musehjulet flytter op og ned, piletasterne flytter, + og − zoomer, 0 tilpasser, Esc fjerner valget.">'
  +'<div class="ne-verden" id="ne-verden"></div>'
  +'<div class="ne-hoveder" id="ne-hoveder">'+NE.kol.map(c=>'<div class="ne-hoved" data-kol="'+c.k+'" style="color:var(--ne-kolonne-'+c.k+')"><div class="ne-hnavn">'+neEsc(c.navn)+'</div><div class="ne-hvad">'+neEsc(c.hvad)+'</div><div class="ne-naar" title="Noderne kommer i '+neEsc(c.naar)+'">'+neEsc(c.naar.replace(/^trin (\d+) \((v[\d.]+)\)$/,'Trin $1 · $2'))+'</div></div>').join('')+'</div></div>'
  +'<div class="ne-kp" id="ne-kp" aria-live="polite"><div class="ne-kp-titel">Kontrolpanelet</div><div class="ne-kp-tekst">Klik på en node for at se, hvordan den virker.</div>'
  +'<div class="ne-kp-svag">v9.19 er trin 1 af 16: lærredet, kolonnerne og temaet. Der er ingen noder endnu. De første (Lydtræk, Regel, Figur og Mål) kommer i v9.20. Dine forbindelser er de samme som før og ses stadig i Mapping og Router.</div></div>';
 const fl=$('ne-flade');
 rod.querySelector('.ne-vlinje').addEventListener('click',e=>{const b=e.target.closest('[data-ne]');if(!b)return;const k=b.dataset.ne;if(k==='placer'){if(typeof neAutoPlacer==='function')neAutoPlacer()}else if(k==='tilpas')neTilpas();else neZoomMidt(k==='ind'?1.25:.8)});
 fl.addEventListener('wheel',e=>{e.preventDefault();if(e.shiftKey){NE.tilpas=false;NE.y-=Math.max(-120,Math.min(120,e.deltaY||e.deltaX));neVis();neGem();return}const r=fl.getBoundingClientRect();neZoomOm(e.clientX-r.left,e.clientY-r.top,Math.exp(-Math.max(-60,Math.min(60,e.deltaY))*.004))},{passive:false});
 fl.addEventListener('pointerdown',e=>{if(e.button>0)return;NE.traek={px:e.clientX,py:e.clientY,x:NE.x,y:NE.y,flyttet:false};try{fl.setPointerCapture(e.pointerId)}catch(x){}fl.classList.add('ne-traekker');try{fl.focus({preventScroll:true})}catch(x){}});
 fl.addEventListener('pointermove',e=>{const d=NE.traek;if(!d)return;if(!d.flyttet&&Math.hypot(e.clientX-d.px,e.clientY-d.py)<3)return;d.flyttet=true;NE.tilpas=false;NE.x=d.x+e.clientX-d.px;NE.y=d.y+e.clientY-d.py;neVis()});
 const slip=()=>{const d=NE.traek;if(!d)return;NE.traek=null;fl.classList.remove('ne-traekker');if(d.flyttet)neGem();else if(typeof neVaelg==='function')neVaelg(null)};fl.addEventListener('pointerup',slip);fl.addEventListener('pointercancel',slip);
 fl.addEventListener('keydown',e=>{const k=e.key;let ok=true;if(k.startsWith('Arrow'))NE.tilpas=false;if(k==='ArrowLeft')NE.x+=60;else if(k==='ArrowRight')NE.x-=60;else if(k==='ArrowUp')NE.y+=60;else if(k==='ArrowDown')NE.y-=60;else if(k==='+'||k==='=')neZoomMidt(1.25);else if(k==='-')neZoomMidt(.8);else if(k==='0')neTilpas();else ok=false;if(ok){e.preventDefault();e.stopPropagation();neVis();neGem()}});
 new ResizeObserver(()=>{rod.classList.toggle('ne-lav',rod.clientHeight>0&&rod.clientHeight<320);if(fl.clientWidth<=0)return;if(NE.tilpasVent||NE.tilpas){NE.tilpasVent=false;neTilpas(true)}else neVis()}).observe(rod);
 const g=set.ne;if(g&&g.tilpas===false&&[g.z,g.x,g.y].every(Number.isFinite)){NE.z=Math.max(NE.ZMIN,Math.min(NE.ZMAX,g.z));NE.x=g.x;NE.y=g.y;neVis()}else if(fl.clientWidth>0)neTilpas(true);else NE.tilpasVent=true}
/* Tilpas: alle 9 kolonner i bredden, højst 100 %. */
/* v9.20: Tilpas viser alle noder (uden noder: alle kolonner). */
function neTilpas(stille){const fl=$('ne-flade');if(!fl)return;NE.tilpas=true;const W=fl.clientWidth||1,B=(typeof neGraenser==='function'&&neGraenser())||{x0:0,x1:NE.bredde,y0:0},bb=Math.max(200,B.x1-B.x0);NE.z=Math.max(NE.ZMIN,Math.min(1,(W-48)/bb));NE.x=Math.round((W-bb*NE.z)/2-B.x0*NE.z);NE.y=Math.round(NE.TOP-B.y0*NE.z);neVis();if(!stille)neGem()}
function neZoomOm(px,py,f){const nz=Math.max(NE.ZMIN,Math.min(NE.ZMAX,NE.z*f));if(nz===NE.z)return;NE.tilpas=false;NE.x=px-(px-NE.x)*nz/NE.z;NE.y=py-(py-NE.y)*nz/NE.z;NE.z=nz;neVis();neGem()}
function neZoomMidt(f){const fl=$('ne-flade');if(!fl)return;neZoomOm(fl.clientWidth/2,fl.clientHeight/2,f)}
/* Kolonnernes overskrifter følger lærredet sidelæns, men står fast øverst og bliver ikke mindre, så de kan læses ved alle zoom-trin. */
function neVis(){const v=$('ne-verden');if(!v)return;v.style.transform='translate('+NE.x+'px,'+NE.y+'px) scale('+NE.z+')';
 const z=$('ne-zoom');if(z)z.textContent=Math.round(NE.z*100)+' %';const tb=document.querySelector('.ne-k[data-ne=tilpas]');if(tb){tb.classList.toggle('ne-paa',NE.tilpas);tb.setAttribute('aria-pressed',NE.tilpas)}
 document.querySelectorAll('#ne-hoveder .ne-hoved').forEach((h,i)=>{const c=NE.kol[i];if(!c)return;const w=c.w*NE.z;h.style.left=Math.round(NE.x+c.x*NE.z)+'px';h.style.width=Math.max(8,Math.round(w))+'px';h.classList.toggle('ne-smal',w<150);h.classList.toggle('ne-mini',w<64)});if(typeof neLinjerTegn==='function')neLinjerTegn()}
function neGem(){clearTimeout(NE.gemT);NE.gemT=setTimeout(()=>{set.ne=Object.assign({},set.ne||{},{z:Math.round(NE.z*1000)/1000,x:Math.round(NE.x),y:Math.round(NE.y),tilpas:NE.tilpas});try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}},400)}
/* Layoutet Noder uden zone-tilstand: vælg fanen Node-editor i Arbejdsfeltet (i zone-tilstand gør ZONE_PLAN det). */
{const gl=window.lay3Anvend;window.lay3Anvend=function(k){const r=gl.apply(this,arguments);if(k==='noder'&&!set.zoner){try{fgVaelg('lyd','w33',true);fgVisHost('lyd')}catch(e){}}return r}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',neByg);else setTimeout(neByg,0);
/* ========== SLUT: NODE-EDITOR (TRIN 1): LÆRRED, ZOOM, TEMA OG KONTROLPANEL ========== */
