/* ========== v9.75: VIS I MATRIX ==========
   Planens trin 6b: fanen Koblinger er blevet til knappen Vis i matrix (i Egenskaber og i Figurer), som åbner 3 · Regler med matrixen
   sat til kun at vise én figur (set.ne.mxKun: alle figurens egenskaber som kolonner, de 14 lydtræk som rækker, chippen "Kun: navn · × alle"
   øverst til venstre i matrixen). Knappen ved en egenskab (data-fe-mx = reglens mål) gør det samme og vælger reglen, hvis den findes.
   Fjernet: fanerne Koblinger og Adfærd (ADF), Detaljer-niveauerne (feNiv er altid 4) og kilde-listen med ⚡ ved hver egenskab. */
function neVisFigur(oid,effect){const o=(fase2.objekter||[]).find(x=>x.id===oid);if(!o)return;mxInd().mxKun=oid;try{mxGem()}catch(e){}
 try{lay3Anvend('ao-regler')}catch(e){}try{dkVis('w33',true)}catch(e){}try{mxSaet(true,true)}catch(e){}
 setTimeout(()=>{try{mxEfterAlle()}catch(e){}let valgt=false;if(effect){try{let id=null;NE2.N.forEach((n,k)=>{if(!id&&n.kol==='regel'&&n.m&&n.m.effect===effect)id=n.key||k});if(id){neVaelg(id);valgt=true;const ki=MX.kol.findIndex(q=>q.m&&q.m.effect===effect),c=ki>=0?document.querySelector('#ne-mx td.mx-har[data-k="'+ki+'"]'):null;if(c)c.scrollIntoView({block:'center',inline:'center'})}}catch(e){}}
  try{neToast('Matrixen viser kun '+o.navn+(valgt?' med reglen valgt':'')+'. × alle (øverst til venstre) viser alle figurer igen.')}catch(e){}},350)}
function neVisAlleFigurer(){mxInd().mxKun='';try{mxGem()}catch(e){}try{mxEfterAlle('Matrixen viser alle figurer igen.')}catch(e){}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#fe-vismx,#fg34-mx,[data-fe-mx],[data-mxkun]');if(!t)return;
 if(t.dataset.mxkun!==undefined){neVisAlleFigurer();return}
 const{o}=cur();if(!o)return;neVisFigur(o.id,t.dataset.feMx||null)});
/* ========== SLUT: VIS I MATRIX ========== */

