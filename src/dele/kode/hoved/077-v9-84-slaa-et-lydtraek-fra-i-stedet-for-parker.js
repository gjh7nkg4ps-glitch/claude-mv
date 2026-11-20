/* ========== v9.84: SLÅ ET LYDTRÆK FRA (I STEDET FOR PARKÉR) ==========
   Brugerens svar b (P8.9): kolonnen Ikke i brug (parkér, v9.25) er fjernet. I stedet kan hver lydtræk-række i matrixen slås fra med knappen ⏻
   (data-mxlf): alle rækkens regler sover (motoren behandler dem som slået fra via neLtFraF, som neFraF gør for figurer; m.off røres ikke),
   rækken er grå med "slået fra", og i Noder er lydtrækket og dets regler slukkede (ne-slukket). Det samme i lydtrækkets kontrolpanel (data-ne84).
   Gemmes i scene.ne.ltFra (følger opsætningen som trim) og fortrydes med Ctrl+Z (feSnap dækker scene.ne). */
function neLtFra(b){const N=(typeof scene!=='undefined'&&scene&&scene.ne&&scene.ne.ltFra)||null;return !!(N&&N[b])}
function neLtFraF(m){return !!(m&&neLtFra(m.band))}
function neSaetLtFra(b,fra,stille){const N=ne9Ne(true);N.ltFra=N.ltFra||{};if(fra)N.ltFra[b]=true;else delete N.ltFra[b];if(!Object.keys(N.ltFra).length)delete N.ltFra;try{save()}catch(e){}
 let n=0;try{n=maps.filter(m=>m.band===b).length}catch(e){}
 if(!stille)neToast(neLtNavn(b)+(fra?' er slået fra: '+n+(n===1?' regel sover.':' regler sover.'):' er slået til igen: '+n+(n===1?' regel':' regler')+' er vågen.'));
 try{ne2Byg()}catch(e){}try{if(typeof MX!=='undefined'&&typeof mxTil==='function'&&mxTil()){mxByg();const k=document.querySelector('#ne-mx [data-mxlf="'+CSS.escape(b)+'"]');if(k)k.focus({preventScroll:true})}}catch(e){}}/* knappen får fokus igen, så Ctrl+Z virker lige bagefter */
function mxLtFraKnap(b){const fra=neLtFra(b);return '<button class="mx-ltfra'+(fra?' mx-ltfra-paa':'')+'" data-mxlf="'+neHtml(b)+'" data-t="⏻" aria-label="Slå fra" aria-pressed="'+fra+'" title="'+(fra?'Slå til: rækkens regler vågner':'Slå fra: alle rækkens regler sover (giver 0), til rækken slås til igen')+'"></button>'}/* tegnet står i data-t (CSS), så rækkens tekst er uændret */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ne84="ltfra"]');if(!b)return;e.preventDefault();neSaetLtFra(b.dataset.b,!neLtFra(b.dataset.b));try{ne2Kp(true);const k=document.querySelector('#ne-kp [data-ne84="ltfra"]');if(k)k.focus({preventScroll:true})}catch(e){}});
/* ========== SLUT: SLÅ ET LYDTRÆK FRA (I STEDET FOR PARKÉR) ========== */

