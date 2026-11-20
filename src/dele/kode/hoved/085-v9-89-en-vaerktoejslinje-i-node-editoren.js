/* ========== v9.89: ÉN VÆRKTØJSLINJE I NODE-EDITOREN ==========
   Brugerens B5 (P8.6): én linje over matrixen og Node-editoren, som begge bruger (.ne-vlinje). Gruppen #ne89-vaerk lægges efter Fortryd og Gentag:
   Foreslå regler (fsForeslaa), Lav show ▾ (fsFang(lavShow)), Tilfældigt ▾ (fsFang(tilfaeldigt)), Gem som regel-sæt (neGemSkabelon for den valgte
   figur) og Kort over forbindelserne (mvkAaben; svar c i P8.9). Alle værktøjer giver forslag, ikke færdige regler. Knappen Foreslå regler i linjen
   under matrixen er fjernet (linjen viser antal forslag, Ja til alle og Nej til alle). */
function ne89Figur(){let fk=NE2.valgt&&NE2.N.get(NE2.valgt);if(fk&&fk.kol==='figur')return fk.key;try{const I=mxInd();if(I&&I.mxKun&&NE2.N.has('f:'+I.mxKun))return 'f:'+I.mxKun}catch(e){}const o=fase2.objekter[selO];if(o&&!o.skabelon&&NE2.N.has('f:'+o.id))return 'f:'+o.id;return null}
function ne89GemSaet(anker){try{ne2Byg()}catch(e){}const fk=ne89Figur();if(fk){neGemSkabelon(fk);return}
 const F=[...(fase2.objekter||[]).filter(o=>!o.skabelon&&NE2.N.has('f:'+o.id)).map(o=>['f:'+o.id,o.navn]),...NE2_GRUPPER.slice(0,5).filter(g=>NE2.N.has('g:'+g)).map(g=>['g:'+g,g])];
 if(!F.length){neToast('Ingen figur har regler at gemme',true);return}ne89Menu(anker,'Hvilken figurs regler?',F.map(([k,n])=>[k,n]),k=>neGemSkabelon(k))}
function ne89Menu(anker,titel,punkter,valgt){ne89Luk();const m=document.createElement('div');m.id='ne89-menu';m.className='ne89-menu';m.setAttribute('role','menu');m.innerHTML='<div class="ne89-t">'+esc(titel)+'</div>'+punkter.map(([v,n,tip])=>'<button class="ne-k" role="menuitem" data-v="'+esc(v)+'" title="'+esc(tip||'')+'">'+esc(n)+'</button>').join('');
 const r=anker.getBoundingClientRect();m.style.left=Math.round(r.left)+'px';m.style.top=Math.round(r.bottom+4)+'px';document.body.appendChild(m);
 m.addEventListener('click',e=>{const b=e.target.closest('[data-v]');if(!b)return;ne89Luk();valgt(b.dataset.v)});const f=m.querySelector('button');if(f)f.focus();
 setTimeout(()=>{document.addEventListener('pointerdown',ne89Udenfor,true);document.addEventListener('keydown',ne89Esc,true)},0)}
function ne89Udenfor(e){const m=$('ne89-menu');if(m&&!m.contains(e.target))ne89Luk()}
function ne89Esc(e){if(e.key==='Escape'){e.stopPropagation();ne89Luk()}}
function ne89Luk(){const m=$('ne89-menu');if(m)m.remove();document.removeEventListener('pointerdown',ne89Udenfor,true);document.removeEventListener('keydown',ne89Esc,true)}
function ne89Start(){const vl=document.querySelector('#ne .ne-vlinje');if(!vl||$('ne89-vaerk')){if(!vl)setTimeout(ne89Start,300);return}const g=vl.querySelector('[data-ne4="gentag"]');if(!g){setTimeout(ne89Start,300);return}
 g.insertAdjacentHTML('afterend','<span class="ne-vgrp" id="ne89-vaerk" role="group" aria-label="Værktøjer, der giver forslag"><button class="ne-k" data-ne89="foreslaa" title="Regn forslag ud fra figurerne på scenen og den analyserede sang. Forslagene står som stiplede celler i matrixen; intet ændres, før du siger ja.">Foreslå regler</button><button class="ne-k" data-ne89="show" aria-haspopup="menu" title="Lav et show til den analyserede sang (Rolig, Balanceret eller Vild). Figurer og afsnit sættes; reglerne bliver forslag.">Lav show ▾</button><button class="ne-k" data-ne89="rnd" aria-haspopup="menu" title="Tilfældige regler som forslag: slag, flydende eller figur-egenskaber (antallet står i Lydtræk-guide).">Tilfældigt ▾</button><button class="ne-k" data-ne89="gem" title="Gem den valgte figurs regler som et regel-sæt under figuren → Mine i Biblioteket.">Gem som regel-sæt</button><button class="ne-k" data-ne89="kort" title="Kort over forbindelserne (Mermaid): alle regler som et diagram, der kan gemmes som PNG eller SVG.">🗺 Kort</button></span>');
 vl.addEventListener('click',e=>{const b=e.target.closest('[data-ne89]');if(!b)return;const k=b.dataset.ne89;
  if(k==='foreslaa'){try{if(!mxTil())mxSaet(true,true)}catch(x){}fsForeslaa()}
  else if(k==='show')ne89Menu(b,'Lav show til sangen (forslag)',[['rolig','Rolig','Få figurer og effekter, blød bevægelse'],['balanceret','Balanceret','Mellem'],['vild','Vild','Mange figurer og effekter']],v=>{try{if(!mxTil())mxSaet(true,true)}catch(x){}fsFang(()=>lavShow(v),'Lav show: '+({rolig:'Rolig',balanceret:'Balanceret',vild:'Vild'})[v])})
  else if(k==='rnd')ne89Menu(b,'Tilfældigt (forslag)',[['slag','Tilfældige slag','Kick, snare, hihat og andre slag med korte tider'],['flyd','Tilfældige flydende','Blødere lydtræk med langsomme tider'],['fig','Tilfældige figur-egenskaber','Regler til egenskaber på dine figurer']],v=>{try{if(!mxTil())mxSaet(true,true)}catch(x){}fsFang(()=>tilfaeldigt(v),({slag:'Tilfældige slag',flyd:'Tilfældige flydende',fig:'Tilfældige figur-egenskaber'})[v])})
  else if(k==='gem')ne89GemSaet(b)
  else if(k==='kort'){try{mvkAaben()}catch(x){}}});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(ne89Start,400));else setTimeout(ne89Start,400);
/* ========== SLUT: ÉN VÆRKTØJSLINJE I NODE-EDITOREN ========== */
