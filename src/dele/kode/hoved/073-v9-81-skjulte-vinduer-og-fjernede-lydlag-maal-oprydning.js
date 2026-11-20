/* ========== v9.81: SKJULTE VINDUER OG FJERNEDE LYDLAG-MÅL (oprydning) ==========
   Planens fase 7, trin 7a (PLAN-NY-BRUGERFLADE.md, afsnit 3.1): det, der stod som "fjern" og stadig lå i programmet, tages væk fra skærmen:
   vinduerne Lyd i 3D (w9), Idé-galleri (w22), Generator (fuld) (w4), Lydlag (w15), Audit (w19) og Detektion (w20) (ude af DK_NAVN, Scene,
   arbejdsområderne og ☰ Mere; skjult her), knapperne til dem i de gamle menuer, scene-nodens knapper i Node-editoren, Lydkildes Avanceret …
   og lydlag-målene (TARGETS). Audits beregning (renderAudit) bruges stadig af Foreslå regler. Koden bag ligger i filen til 7c (død kode). */
['w15','w20'].forEach(id=>{const w=$(id);if(w){w.hidden=true;w.classList.add('zon-skjult')}});/* v9.83: Lyd i 3D (w9) og Idé-galleri (w22) er ude af filen */
try{if(set.ne&&Array.isArray(set.ne.sluk)&&set.ne.sluk.length){set.ne.sluk=[];lsGem('rytme-set',JSON.stringify(set))}}catch(e){}/* en slukket scene tændes: knappen Sluk er væk */
try{const om=n=>{if(!n)return;if(n.t==='z'){n.f=n.f.filter(id=>DK_NAVN[id]);if(!DK_NAVN[n.a])n.a=n.f[0]||null;return}(n.c||[]).forEach(om)};om(set.dock);Object.values(set.dockLay||{}).forEach(om)}catch(e){}
/* ========== SLUT: SKJULTE VINDUER OG FJERNEDE LYDLAG-MÅL ========== */

