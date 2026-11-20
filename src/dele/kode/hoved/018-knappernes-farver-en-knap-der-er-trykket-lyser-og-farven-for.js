/* ========== KNAPPERNES FARVER: en knap, der er trykket, lyser, og farven fortæller, hvad der skete ========== */
/* Blå: trykket (kort), og "intet at se". Grøn med ✓: det virkede (der kom en besked, eller knappen skiftede tilstand). Gul med !: noget manglede (fx ingen lydfil). Rød med ✕: det mislykkedes. Fast grøn kant: en knap, der er tændt (fx Flyt effekter, Dublet, Fest, Afspil, Lyd fra). Gul pulserende: venter på dig (Kobl via klik). */
const KF_FEJL=/\bkunne ikke\b|\bugyldig\b|\bikke en gyldig\b|\bfejl\b|\bfuldt\b/i,KF_ADV=/\bvælg (først )?en lydfil\b|\bvælg først\b|\banalysér en sang\b|\bder er intet\b|\bintet at\b|\bintet er\b|\blav først\b|\btryk i takt\b|\bpasser ikke\b|\ber tom\b|\bikke sikre\b|\bingen\b|\bmindst\b|\bkræver\b|\bfindes ikke\b|\bikke ændret\b|\bikke gemt\b|\bvent, til analysen\b|\btryk, mens\b/i;
const klassificer=t=>KF_FEJL.test(t)?'fejl':KF_ADV.test(t)?'advarsel':'ok';
function knapFlash(b,t,ms){clearTimeout(b.__kt);b.dataset.t=t;b.__kt=setTimeout(()=>{if(b.dataset.t===t)delete b.dataset.t},ms||1400)}
let KFP=[];const kfObs=new MutationObserver(()=>{const nu=performance.now();KFP.forEach(p=>{if(nu-p.t<420){p.sat=true;p.tekst=$('status').textContent}})});kfObs.observe($('status'),{childList:true,characterData:true,subtree:true});
function kfVurder(p){KFP=KFP.filter(x=>x!==p);const b=p.b;if(!b.isConnected)return;const skiftet=b.textContent!==p.t0||b.getAttribute('aria-pressed')!==p.p0||b.disabled!==p.d0;
 if(p.sat)knapFlash(b,klassificer(p.tekst||''),1500);else if(skiftet)knapFlash(b,'ok',1200);else knapFlash(b,'info',900)}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button');if(!b||b.disabled||b.closest('dialog'))return;knapFlash(b,'klik',160);const p={b,t:performance.now(),t0:b.textContent,p0:b.getAttribute('aria-pressed'),d0:b.disabled,sat:false};KFP.push(p);setTimeout(()=>kfVurder(p),450)},true);
/* Knapper, der kan være tændt: får aria-pressed, så de lyser fast grønt, mens de er tændt */
function knapTilstand(){const T=[['mvbtn',()=>moveMode],['dubbtn',()=>typeof dubSynlig==='function'&&dubSynlig()],['rtbtn',()=>typeof rtSynlig==='function'&&rtSynlig()],['play',()=>playing],['show-halv',()=>!!SHOWPROFIL&&SHOWPROFIL.faktor===.5],['show-dobbelt',()=>!!SHOWPROFIL&&SHOWPROFIL.faktor===2],['tb-mv',()=>moveMode],['ud-btn',()=>udgangAaben()],['ud-sort',()=>UD.sort],['tl-loop',()=>LOOP.til]];
 T.forEach(([id,f])=>{const b=$(id);if(!b)return;const v=f()?'true':'false';if(b.getAttribute('aria-pressed')!==v)b.setAttribute('aria-pressed',v)})}
/* ========== SLUT: KNAPPERNES FARVER ========== */

