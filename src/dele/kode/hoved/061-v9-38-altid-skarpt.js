/* ========== v9.38: ALTID SKARPT ==========
   Brugerens ønske (8. november): Live preview, Øjet og Radial Mesh skal altid stå skarpt, og noderne må ikke blive til lys, men skal stå skarpt ved al zoom.
   - Live preview tegnede i kvalitetsniveauets skala (1) og ikke i skærmens skalering (devicePixelRatio, fagudtryk); på en skærm med 150 % var den kun 0,67
     så skarp, som skærmen kan vise. Nu tegner den i skærmens fulde opløsning (op til 3×), uanset kvalitetsniveau og regulator; kvalitetsniveauet styrer
     stadig glød, partikler og billeder i sekundet. Skifter skærmen skalering (fx når vinduet flyttes til en anden skærm), tilpasser den sig inden for et sekund.
   - Øjet havde et loft på 6 millioner punkter, så det blev skåret ned i fuld skærm på 4K (0,89). Loftet er nu 9 millioner (4K er 8,3 millioner).
   - Radial Mesh tegnede allerede i skærmens opløsning (målt 1,00 i alle tilfælde); den er ikke ændret.
   - Drejeknapperne i Node-editorens kontrolpanel var for følsomme (150 px for hele vejen); nu 400 px, sidelæns tæller, og musehjulet tager ét trin.
   - Advarslen "Multiple instances of Three.js" i konsollen er væk (den nye three.js indlæses, mens r128's mærke er gemt væk).
   - Node-editoren: noderne bliver ikke til lys under 20 % zoom mere. Lærredet har kun will-change (fagudtryk; browseren tegner så teksten én gang og
     forstørrer billedet) mens man zoomer eller flytter; et kvart sekund efter tegnes teksten skarpt igen. Tegnefladerne i noderne (spektrum, bølgeform,
     analysernes tegninger og scenens billede) får flere punkter, jo mere der zoomes ind (zoom × skærmens skalering, højst 4×), så de også står skarpt. */
const NE38={t:null,f:0};
function ne38Skala(){return Math.max(1,Math.min(4,(NE.z||1)*(window.devicePixelRatio||1)))}
function ne38Lerreder(){const v=$('ne-verden');if(!v)return;const f=Math.round(ne38Skala()*4)/4;v.querySelectorAll('canvas').forEach(c=>{if(!c.dataset.bw){c.dataset.bw=c.width;c.dataset.bh=c.height}if(c._f===f)return;c._f=f;c.width=Math.round(+c.dataset.bw*f);c.height=Math.round(+c.dataset.bh*f);
 if(c.classList.contains('ne-boelge'))NE2.N.forEach(n=>{if(n.el&&n.el.contains(c))n.boelgeTegnet=false})});NE38.f=f}
function ne38Faerdig(){const v=$('ne-verden');if(v)v.style.willChange='auto';ne38Lerreder()}
{const gl=neVis;window.neVis=function(){const r=gl.apply(this,arguments);const v=$('ne-verden');if(v){v.style.willChange='transform';clearTimeout(NE38.t);NE38.t=setTimeout(ne38Faerdig,250)}return r}}
{const gl=ne2Byg;window.ne2Byg=function(){const r=gl.apply(this,arguments);ne38Lerreder();return r}}
/* Live preview i skærmens fulde opløsning (projektorens størrelse bruges, hvis den er større) */
window.pvSkala=function(b){let sk=Math.min(3,Math.max(1,(window.devicePixelRatio||1)*(typeof st9Zoom==='function'?st9Zoom():1)));try{if(typeof UD!=='undefined'&&UD.pop&&!UD.pop.closed&&b&&b.clientWidth){const m=Math.min(3,(UD.pop.innerWidth*(UD.pop.devicePixelRatio||1))/b.clientWidth);if(m>sk)sk=m}}catch(e){}return sk};
setInterval(()=>{const c=$('pv');if(!c||!c.clientWidth)return;const b=c.closest('.wb')||c.parentElement;if(!b||!b.clientWidth)return;const sk=pvSkala(b);if(Math.abs(c.width-Math.round(b.clientWidth*sk))>2)try{pvResize()}catch(e){}
 if(NE38.f&&Math.abs(Math.round(ne38Skala()*4)/4-NE38.f)>.01)ne38Lerreder()},1000);
setTimeout(()=>{try{pvResize()}catch(e){}ne38Faerdig()},1500);
/* Drejeknapperne i kontrolpanelet (brugerens fund: "enten fuld eller ingen"): hele vejen er nu 400 px træk (før 150), sidelæns tæller også
   (højre = mere), og musehjulet over en knap flytter ét trin ad gangen (sendes som en piletast med Shift, så Fortryd og beskeden er de samme). */
document.addEventListener('wheel',e=>{const k=e.target.closest&&e.target.closest('#ne-kp .ne-knap');if(!k)return;e.preventDefault();
 k.dispatchEvent(new KeyboardEvent('keydown',{key:e.deltaY<0?'ArrowUp':'ArrowDown',shiftKey:true,bubbles:true,cancelable:true}))},{passive:false,capture:true});
/* ========== SLUT: ALTID SKARPT ========== */

