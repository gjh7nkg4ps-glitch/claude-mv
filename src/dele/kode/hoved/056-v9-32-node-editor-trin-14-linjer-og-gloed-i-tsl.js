/* ========== v9.32: NODE-EDITOR (TRIN 14): LINJER OG GLØD I TSL ==========
   Trin 14 af 16 (planens valg A fra trin 0): den nye three.js (0.186.1, MIT) ligger ved siden af r128. Den står som tekst nederst i filen
   (<script type="text/plain" id="three-ny-core"> og "three-ny-webgpu") og indlæses af et lille modul-script (id="ne14-modul") via blob-adresser,
   så intet hentes fra internettet, og r128 (window.THREE, som Mesh 3D og Øjet bruger) røres ikke.
   - Linjerne mellem noderne tegnes med WebGPURenderer og et materiale i TSL (fagudtryk: Three Shading Language): en blød kant og en glød, der kun
     er på det valgte og det, der slår til lige nu. WebGPU bruges, hvis browseren har det; ellers WebGL2 (reserven). Går begge galt, tegnes linjerne
     som før med Canvas 2D.
   - Det, der bruges, står i kontrolpanelet (når intet er valgt): "Linjer: TSL · WebGL2" eller "Canvas 2D" med grunden. Valget Auto · Canvas 2D
     huskes i set.ne.linjer ('2d'); Auto er standard.
   - Linjernes form, farve og lysstyrke regnes præcis som før (neLinjerTegn); kun selve tegningen er flyttet. */
window.NE14={ok:false,backend:'',grund:'den nye three.js indlæses',rev:'',stat:{links:0,gloed:0},valg:(set.ne&&set.ne.linjer==='2d')?'2d':'auto'};
NE14.brug=()=>NE14.ok&&NE14.valg!=='2d';
function neLinjerValg(v){NE14.valg=v==='2d'?'2d':'auto';set.ne=set.ne||{};if(NE14.valg==='2d')set.ne.linjer='2d';else delete set.ne.linjer;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}
 if(typeof NE14.ryd==='function')NE14.ryd();neLinjerTegn();ne2Kp(true);neToast('Linjer: '+(NE14.brug()?'TSL · '+NE14.backend:'Canvas 2D'),true)}
function ne14Tekst(){return NE14.brug()?'TSL · '+NE14.backend:'Canvas 2D'+(NE14.valg==='2d'?' (valgt)':' · '+NE14.grund)}
/* Kontrolpanelet, når intet er valgt: hvad linjerne tegnes med */
/* v9.93: linjen "Linjer: Auto · Canvas 2D" i kontrolpanelet er fjernet (skjult siden v9.72); valget står under Indstillinger → Linjer i Node-editoren (neLinjerValg) */
function ne14Start(){const rod=$('ne');if(!rod||!NE.byg){setTimeout(ne14Start,300);return}const tr=document.querySelector('#ne .ne-trin');if(tr)tr.textContent='Node-editoren · docking og fuld skærm';
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ne14Start,0));else setTimeout(ne14Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 14): LINJER OG GLØD I TSL ========== */
