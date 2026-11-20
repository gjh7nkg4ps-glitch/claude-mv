/* ========== v9.27: NODE-EDITOR (TRIN 9): TRIM OG FIGUR-STYRKE ==========
   Trin 9 af 16 (papirets afsnit 5.5 og 5.7): to nye ting i motoren.
   - Trim på et lydtræk: −12 til +12 dB (× ¼ til × 4). Tallet fra kilden ganges med trimmet, før reglerne bruger det (højst 1). Gemmes i scene.ne.trim
     ({kilde: dB}), så det følger med i Opsætning 1–20 (sceneKopi beholder nu feltet ne). Mærket "Trim" står øverst til højre på lydtrækket; træk op og ned
     i det (dobbeltklik = 0 dB), eller brug skyderen i kontrolpanelet.
   - Figur-styrke: en figurs styrke (o.neStyrke, 0 til 2, standard 1) ganges på alle dens regler. Effekt-grupperne har den samme styrke i scene.ne.grp.
     Styrke brugt = regel × figur × samlet styrke × afsnits-dynamik (papirets regnestykke); kontrolpanelet viser alle led.
   - Uden trim og med styrke 1 regner motoren præcis som før. Klodser, der forudsiges fra filen, bruger ikke trimmet (de regner på analysen af hele filen). */
function ne9Ne(lav){if(lav){scene.ne=scene.ne||{};scene.ne.trim=scene.ne.trim||{};scene.ne.grp=scene.ne.grp||{}}return scene.ne||{}}
function neTrimDb(b){const t=(scene&&scene.ne&&scene.ne.trim)||null;return t&&Number.isFinite(+t[b])?+t[b]:0}
function neTrimV(b,v){const d=neTrimDb(b);if(!d)return v;const x=(+v||0)*Math.pow(10,d/20);return Math.max(0,Math.min(1,x))}
/* figurens eller effekt-gruppens styrke for et mål */
function neFigF(e){e=String(e);let f=1;if(e.startsWith('obj:')||e.startsWith('liv:')){const id=e.split(':')[1],o=fase2.objekter.find(x=>x.id===id);if(o&&Number.isFinite(+o.neStyrke))f=+o.neStyrke}
 else{const g=(scene&&scene.ne&&scene.ne.grp)||null;if(g){let n='Andre effekter';try{n=neFigurAf(e).navn}catch(x){}const q=g[n];if(q&&Number.isFinite(+q.styrke))f=+q.styrke}}return f}
function neFigStyrke(fk){if(fk.startsWith('f:')){const o=fase2.objekter.find(x=>x.id===fk.slice(2));return o&&Number.isFinite(+o.neStyrke)?+o.neStyrke:1}const g=(scene&&scene.ne&&scene.ne.grp)||{},q=g[fk.slice(2)];return q&&Number.isFinite(+q.styrke)?+q.styrke:1}
function neSaetFigStyrke(fk,v,slut){v=Math.max(0,Math.min(2,Math.round(v*20)/20));if(fk.startsWith('f:')){const o=fase2.objekter.find(x=>x.id===fk.slice(2));if(!o)return;if(v===1)delete o.neStyrke;else o.neStyrke=v;try{persistObj()}catch(e){}}
 else{const N=ne9Ne(true),n=fk.slice(2);N.grp[n]=N.grp[n]||{};if(v===1)delete N.grp[n].styrke;else N.grp[n].styrke=v}try{save()}catch(e){}if(slut){const nd=NE2.N.get(fk);neToast((nd?nd.navn:fk)+': styrke ×'+neTal(v),false);ne2Byg()}}
function neSaetTrim(b,db,slut){db=Math.max(-12,Math.min(12,Math.round(db*2)/2));const N=ne9Ne(true);if(!db)delete N.trim[b];else N.trim[b]=db;try{save()}catch(e){}if(slut){neToast('Trim på '+neLtNavn(b)+': '+ne9Db(db)+' (×'+neTal(Math.pow(10,db/20))+')');ne2Byg()}}
const ne9Db=d=>(d>0?'+':d<0?'−':'')+String(Math.abs(d)).replace('.',',')+' dB';
/* Styrke brugt: figur-styrken som et led */
{const gl=stakFor;window.stakFor=function(m,i){const S=gl(m,i);const f=neFigF(m.effect);let navn='Figur-styrke';try{const fg=neFigurAf(m.effect);navn=(fg.gruppe?'Effekt-gruppens styrke (':'Figur-styrke (')+fg.navn+')'}catch(e){}
 S.lag.splice(1,0,[navn+' (vores navn)',f,f!==1,'trækkes i tallet på figur-noden i Node-editoren']);S.styrke*=f;if(f!==1)S.paavirket=(S.paavirket||0)+1;return S}}
/* Noderne: Trim på lydtrækket, styrke på figuren */
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){let h=gl(n);if(n.parkeret)return h;
 if(n.kol==='lydtraek'){const d=neTrimDb(n.band);h=h.replace('<b class="ne-nt">','<b class="ne-nt">').replace(/(<div class="ne-nh">[^]*?)(<\/div>)/,'$1<span class="ne-trim'+(d?' ne-trim-paa':'')+'" data-trim="'+neHtml(n.band)+'" title="Trim (−12 til +12 dB): ganges på tallet, før reglerne bruger det. Træk op eller ned; dobbeltklik = 0 dB.">Trim '+ne9Db(d)+'</span>$2')}
 else if(n.kol==='figur'){const f=neFigStyrke(n.key);h=h.replace('<i class="ne-lampe"></i></div>','<i class="ne-lampe"></i><div class="ne-styrke ne-fstyrke" data-fstyrke="'+neHtml(n.key)+'" title="'+(n.gruppe?'Effekt-gruppens':'Figurens')+' styrke: ganges på alle dens regler. Træk op eller ned; dobbeltklik = 1."><small>styrke</small><b>×'+neTal(f)+'</b></div></div>')}
 return h}}
/* Kontrolpanelet: trim og figur-styrke */
{const gl=ne2Kp;window.ne2Kp=function(ny){gl(ny);const n=NE2.valgt&&NE2.N.get(NE2.valgt),box=document.querySelector('#ne-kp .ne-kp-ind');if(!n||!box||n.parkeret)return;
 if(n.kol==='lydtraek'){const d=neTrimDb(n.band),nm=typeof mode!=='undefined'&&mode==='fast'?'Fast':'Adaptiv';
  box.innerHTML='<small>Trim og normalisering</small><div class="ne-kp-svag">Trim <b data-nv9="trim">'+ne9Db(d)+'</b> (×'+neTal(Math.pow(10,d/20))+'). Ændres ved at trække op eller ned i mærket Trim på noden eller i matrixens række; dobbeltklik = 0 dB.</div><div class="ne-kp-svag">Kilden → normalisering ('+nm+(nm==='Adaptiv'?': sangens 99. percentil':': fast reference')+') → × trim → tallet, reglerne bruger (højst 1).</div><div class="ne-kp-knapper"><button class="ne-k'+(neLtFra(n.band)?' ne-paa':'')+'" data-ne84="ltfra" data-b="'+neHtml(n.band)+'" aria-pressed="'+neLtFra(n.band)+'" title="Slå fra: alle '+n.regler.length+' regler fra dette lydtræk sover (giver 0), til det slås til igen.">'+(neLtFra(n.band)?'Slå til':'Slå fra')+'</button></div>'}
 else if(n.kol==='figur'){const f=neFigStyrke(n.key);box.innerHTML='<small>'+(n.gruppe?'Effekt-gruppens':'Figurens')+' styrke</small><div class="ne-kp-svag">Styrke <b data-nv9="fs">×'+neTal(f)+'</b>. Ændres ved at trække op eller ned i mærket styrke på noden eller ved figurens navn i matrixen; dobbeltklik = ×1.</div><div class="ne-kp-svag">Ganges på alle '+n.regler.length+' regler til '+neHtml(n.navn)+'. Styrke brugt = regel × figur × samlet styrke × afsnits-dynamik.</div>'}}}
/* Fortryd og pladser skal bygge noderne om, når trim eller styrke ændres */
{const gl=ne2Sig;window.ne2Sig=function(){let x='';try{x=JSON.stringify((scene&&scene.ne)||{})+fase2.objekter.map(o=>o.neStyrke||1).join(',')}catch(e){}return gl()+'#'+x}}
function ne9Start(){const v=$('ne-verden'),rod=$('ne');if(!v)return;
 v.addEventListener('pointerdown',e=>{const t=e.target.closest('.ne-trim,.ne-fstyrke');if(!t||e.button>0)return;e.stopPropagation();e.preventDefault();NE2.laas=true;const y0=e.clientY,trim=t.classList.contains('ne-trim'),k=trim?t.dataset.trim:t.dataset.fstyrke,v0=trim?neTrimDb(k):neFigStyrke(k);let sidst=v0;try{t.setPointerCapture(e.pointerId)}catch(x){}
  const mv=ev=>{sidst=trim?v0+(y0-ev.clientY)/8:v0+(y0-ev.clientY)/120;if(trim){neSaetTrim(k,sidst,false);const d=neTrimDb(k);t.textContent='Trim '+ne9Db(d);neToastLive('Trim '+ne9Db(d))}else{neSaetFigStyrke(k,sidst,false);const b=t.querySelector('b');if(b)b.textContent='×'+neTal(neFigStyrke(k));neToastLive('Styrke ×'+neTal(neFigStyrke(k)))}};
  const op=()=>{t.removeEventListener('pointermove',mv);t.removeEventListener('pointerup',op);NE2.laas=false;if(trim)neSaetTrim(k,neTrimDb(k),true);else neSaetFigStyrke(k,neFigStyrke(k),true)};t.addEventListener('pointermove',mv);t.addEventListener('pointerup',op)},true);
 v.addEventListener('dblclick',e=>{const t=e.target.closest('.ne-trim,.ne-fstyrke');if(!t)return;if(t.classList.contains('ne-trim'))neSaetTrim(t.dataset.trim,0,true);else neSaetFigStyrke(t.dataset.fstyrke,1,true)});
 /* v9.92: lytterne til skyderne Trim og Styrke i kontrolpanelet (data-ne9) er fjernet; skyderne forsvandt i v9.59 */}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne9Start);else setTimeout(ne9Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 9): TRIM OG FIGUR-STYRKE ========== */
