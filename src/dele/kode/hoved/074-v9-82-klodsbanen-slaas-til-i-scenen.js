/* ========== v9.82: KLODSBANEN SLÅS TIL I SCENEN ==========
   Planens valg V2: banen er ikke fundamentet, men noget, man slår til i scenen. Knappen Klodsbane: Til · Fra i Live previews overskrift
   (#pv-bane) og under ☰ Mere i 2 · Scene er det samme som scene.bane (Vis bane i Bane og klods): fra tegnes hverken gulv, spor, trefferlinje,
   slange eller klodser; figurer og effekter tegnes stadig, og klods-reglerne regner videre. Første start uden gemte indstillinger: banen er fra
   (set.bane7b sættes én gang; en gemt scene røres ikke, og gamle opsætninger åbner med banen, som de blev gemt). Matrixen skriver "klodsbane fra"
   ved gruppen Bane. */
if(!set.bane7b){set.bane7b=1;try{if(!localStorage.getItem('rytme-scene')){scene.bane=false;persistScene()}}catch(e){}try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}}
function baneUI(){const b=$('pv-bane');if(!b)return;const til=scene.bane!==false,tx='Klodsbane: '+(til?'Til':'Fra');if(b.textContent!==tx)b.textContent=tx;b.setAttribute('aria-pressed',String(til));b.classList.toggle('on',til);const s=$('sbane');if(s&&s.checked!==til)s.checked=til}
function baneSkift(til){scene.bane=til===undefined?!(scene.bane!==false):!!til;try{sceneStatus()}catch(e){}persistScene();baneUI();try{sceneUI()}catch(e){}try{if(typeof MX!=='undefined'&&mxTil())mxByg()}catch(e){}msg(scene.bane!==false?'Klodsbanen vises: gulv, spor, trefferlinje, slange og klodser.':'Klodsbanen er fra: scenen er tom, indtil du lægger figurer og effekter på. Klods-reglerne regner videre.')}
{const b=$('pv-bane');if(b)b.onclick=()=>baneSkift()}
baneUI();setInterval(baneUI,500);
/* ========== SLUT: KLODSBANEN SLÅS TIL I SCENEN ========== */
