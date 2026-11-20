/* ========== LIVE PREVIEW: format og fuld skærm ========== */
/* Formatvælgeren sætter Live previews vindue til et format (16:9, 9:16, 1:1, 4:3 eller 3:4) ud fra den nuværende bredde (kortes ned, så vinduet passer i arbejdsområdet), og Fuld skærm bruger browserens egen fuld skærm på selve vinduet (Escape afslutter). */
const PV_FORMAT={bredt:[16,9,'16:9 bredt'],hoejt:[9,16,'9:16 højt'],kvadrat:[1,1,'1:1 kvadrat'],fire3:[4,3,'4:3'],tre4:[3,4,'3:4 højt']};
function pvFormat(f){const F=PV_FORMAT[f];if(!F)return false;const w2=$('w2');if(w2.classList.contains('min'))miniSaet(w2,false);if(w2.classList.contains('max'))w2.querySelector('.mx').click();delete w2.dataset.snap;delete w2.dataset.fur;
 const kop=w2.querySelector('.wh').offsetHeight||34,ws=$('ws'),R=ws.getBoundingClientRect(),W0=ws.clientWidth||innerWidth,top0=Math.max(tbHoejde(),R.top),maxH=innerHeight-top0-16,r=F[0]/F[1];
 let bredde=w2.getBoundingClientRect().width||w2.offsetWidth||400,hoej=bredde/r+kop;if(hoej>maxH){hoej=maxH;bredde=(hoej-kop)*r}
 bredde=Math.max(240,Math.min(W0,bredde));hoej=Math.max(160,bredde/r+kop);
 w2.style.width=Math.round(bredde)+'px';w2.style.height=Math.round(hoej)+'px';const l=parseFloat(w2.style.left)||w2.offsetLeft||0;w2.style.left=Math.max(0,Math.min(l,W0-bredde))+'px';
 msg('Live preview har nu formatet '+F[2]+' (billedet er cirka '+Math.round(bredde)+' × '+Math.round(hoej-kop)+' punkter). Du kan stadig trække i hjørnet.');return true}
$('pv-format').onchange=e=>{if(e.target.value){pvFormat(e.target.value);e.target.value=''}};
function pvFuld(){const w2=$('w2');if(document.fullscreenElement===w2){if(document.exitFullscreen)document.exitFullscreen();return}
 if(!w2.requestFullscreen){msg('Fuld skærm: din browser kan ikke vise et vindue i fuld skærm. Brug Maksimér, eller Fest!.');return}
 if(w2.classList.contains('min'))miniSaet(w2,false);try{const p=w2.requestFullscreen();if(p&&p.catch)p.catch(()=>msg('Fuld skærm blev afvist af browseren. Prøv igen med et klik på knappen.'))}catch(e){msg('Fuld skærm blev afvist af browseren.')}}
$('pv-fuld').onclick=pvFuld;
document.addEventListener('fullscreenchange',()=>{const w2=$('w2'),til=document.fullscreenElement===w2;$('pv-fuld').textContent=til?'Afslut fuld skærm':'Fuld skærm';$('pv-fuld').setAttribute('aria-pressed',til?'true':'false');if(typeof pvResize==='function')pvResize()});
/* ========== SLUT: LIVE PREVIEW ========== */
