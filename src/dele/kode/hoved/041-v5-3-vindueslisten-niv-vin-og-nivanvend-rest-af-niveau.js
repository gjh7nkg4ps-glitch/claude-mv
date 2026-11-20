/* ========== v5.3: VINDUESLISTEN NIV_VIN OG nivAnvend (rest af Niveau) ==========
   Knappen Niveau i topbaren styrer hele programmet (Form-editorens niveauknap viser det samme og ændrer det samme). Samme fire trin overalt:
   1 Simpel: vinduerne Live preview (W2), Form-editor (W6), Radial Mesh (W5), Mapping (W12) og Opsætninger (W13). 17 kilder. Mapping viser kilde, mål og gain.
   2 Medium: + Tidslinje (W1), EQ (W3), Generator (W4), Dublet (W8) og Show (W17). 32 kilder. + tærskel.
   3 Høj: + Analyse (W7), Lyd i 3D (W9), Routing-overblik (W10), Master Morph Pad (W11), Lydlag (W15) og Bane og klods (W16). 111 kilder (+ toner og klang og pad). + attack og release.
   4 Ekstrem: + Kvalitet (W14), Lydtræk-guide (W18), Audit (W19), Detektion (W20) og Preset (W21). Alle 116 kilder. + kurve, pause, hold og port.
   Et vindue, der ikke hører til niveauet, skjules (også i docken og i Vinduer-menuen) og kommer tilbage, som det var, når niveauet hæves. Forbindelser virker altid. */
const NIV_VIN={1:['w23','w27','w28','w29','w31','w35','w36','w2','w6','w34','w5','w13','w25','w33'],2:['w1','w3','w24','w4','w17'],3:['w7','w15','w16'],4:['w26','w14','w18','w19','w20','w21']};
function nivVinduer(n){const ok=new Set();for(let k=1;k<=n;k++)NIV_VIN[k].forEach(w=>ok.add(w));return ok}
function nivAnvend(){const n=4/* v9.71: Niveau er fjernet; alle vinduer vises (Editorens Detaljer bruger stadig feNiv) */,ok=nivVinduer(n);document.body.dataset.niv=n;
 document.querySelectorAll('.win').forEach(w=>w.classList.toggle('niv-skjult',!ok.has(w.id)));
 const kildeOk={'bånd':1,hnd:1,rytme:2,analyse:3};['mb-kilder','dubkild'].forEach(id=>{const sel=$(id);if(sel)[...sel.options].forEach(o=>{const k=kildeOk[o.value]||1;o.hidden=n<k;o.disabled=n<k&&o.value!==sel.value})});
 try{dockOpdat()}catch(e){}try{if(typeof fgFaner==='function')Object.keys(FG).forEach(g=>{fgFaner(g);const a=set.fg[g].aktiv;if(fgIGruppe(a)&&$(a).classList.contains('niv-skjult')){const f=FG[g].faner.find(x=>fgIGruppe(x[0])&&!$(x[0]).classList.contains('niv-skjult'));if(f)fgVaelg(g,f[0],true)}})}catch(e){}try{if(typeof scFaner==='function'){scFaner();if(scIScene(set.scene.aktiv)&&$(set.scene.aktiv).classList.contains('niv-skjult')){const f=SC_FANER.find(x=>scIScene(x[0])&&!$(x[0]).classList.contains('niv-skjult'));if(f)scVaelg(f[0],true)}}}catch(e){}}
/* v9.93: nivSaet, NIV_KNAP og lytteren til #tb-niv er fjernet (Niveau forsvandt i v9.71) */
nivAnvend();
/* ========== SLUT: VINDUESLISTEN ========== */

