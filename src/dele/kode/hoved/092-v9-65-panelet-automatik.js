/* ========== v9.65: PANELET AUTOMATIK ==========
   Planens fase 4: alt, programmet vælger selv om målingerne, kan ses ét sted og slås fra, og én knap giver standard tilbage.
   Panelet (#ne65-pan) åbnes med knappen Automatik i Node-editorens værktøjslinje. Det bruger de samme kontakter som resten af programmet:
   Normalisering (#norm), lange sange (set.normLokal), Adaptiv tærskel (ne10Saet), Taktslag og Spor (m.takt og m.spor på reglerne) og
   Afsnits-dynamik (#show-folg). Regler skrives aldrig herfra. */
function auTilstand(){if(typeof atDele==='function')auTilstand.dele=JSON.stringify(atDele());const man=f=>maps.filter(m=>m[f]).length,tp=$('eq-tilpas');return{norm:typeof mode!=='undefined'?mode:'auto',lokal:set.normLokal!==false,tilpas:!!(tp&&tp.checked),tilpasStd:!!(tp&&tp.defaultChecked),takt:man('takt'),spor:man('spor'),show:typeof SHOW!=='undefined'&&SHOW?(SHOW.til?'til':'fra'):'ingen',ana:auAna()}}
function auAna(){try{const v=(typeof fileVer!=='undefined'?fileVer:0)+'|'+(typeof dur!=='undefined'?dur:0);if(!auAna.c||auAna.c.v!==v)auAna.c={v,t:anaTekst(anaTjek())};return auAna.c.t}catch(e){return'Ingen analyseret lydfil'}}
function auTegn(){const p=$('ne65-pan');if(!p||p.hidden)return;const T=auTilstand(),sig=JSON.stringify(T);if(sig===p.dataset.sig)return;p.dataset.sig=sig;
 const seg=(k,a,b,paaA)=>'<span class="ne-seg" role="group"><button class="ne-k'+(paaA?' ne-paa':'')+'" data-au="'+k+'" data-v="1" aria-pressed="'+paaA+'">'+a+'</button><button class="ne-k'+(paaA?'':' ne-paa')+'" data-au="'+k+'" data-v="0" aria-pressed="'+!paaA+'">'+b+'</button></span>';
 const r=(k,navn,hvad,styr,std)=>'<tr data-aur="'+k+'"><th>'+navn+'</th><td class="au-hvad">'+hvad+'</td><td class="au-styr">'+styr+'</td><td class="au-std">Standard: '+std+'</td></tr>';
 const manuel=(k,n)=>n?'<span>'+n+(n===1?' regel står':' regler står')+' på Manuel</span> <button class="ne-k" data-au="'+k+'">Sæt alle til Auto-valg</button>':'<span>Alle regler bruger Auto-valg</span>';
 p.innerHTML='<div class="au-h"><b>Automatik</b><span>Det, programmet vælger selv om målingerne. Alt kan ses og slås fra her.</span><button class="ne-k" data-au="luk" aria-label="Luk panelet Automatik">Luk</button></div><table>'
  +r('norm','Normalisering','Gør hvert lydtræk til et tal fra 0 til 1. Adaptiv: efter sangen. Fast: en fast målestok.',auSang(T.norm==='auto'?'Adaptiv':'Fast'),'Adaptiv')
  +r('lokal','Lange sange','Sange over 10 minutter måles i stykker på 2 minutter, så ét kraftigt stykke ikke holder resten nede.',auSang(T.lokal?'Til (i stykker på 2 minutter)':'Fra'),'Til')
  +r('tilpas','Adaptiv tærskel','Flytter reglernes tærskel efter lydens niveau lige nu.',auSang(T.tilpas?'Til':'Fra'),T.tilpasStd?'Til':'Fra')
  +r('takt','Taktslag: Auto-valg','Vælger selv mellem taktslag fra filen og taktslag, mens det spiller.',manuel('takt',T.takt),'Auto-valg')
  +r('spor','Spor: Auto-valg','Med 4 spor læses fx kick fra Trommer og bas fra Bas.',manuel('spor',T.spor),'Auto-valg')
  +r('ana','Sangens analyse','Sammenligner analysen med lyden i 8 dele af sangen. Uden slag i en del reagerer reglerne ikke dér.',auSang(T.ana),'—')
  +r('show','Afsnits-dynamik','Showet skruer op og ned for reglerne i sangens afsnit (sektionernes vægte).',T.show==='ingen'?'<span>Ikke i brug: der er ikke lavet et show</span>':seg('show','Til','Fra',T.show==='til'),'Til')
  +'</table><div class="au-f"><button class="ne-k" data-au="std" title="Sæt alle linjer tilbage til standard">Tilbage til standard</button><span>Regler skrives aldrig automatisk. Brug Foreslå regler under matrixen.</span></div>'}
function auAlleAuto(f){const I=[];maps.forEach((m,i)=>{if(m[f])I.push(i)});if(I.length)Regler.samlet(()=>I.forEach(i=>Regler.retNr(i,{[f]:undefined})));return I.length}
function auSang(v){return '<span>'+neHtml(String(v))+'</span> <button class="ne-k" data-au="sang" title="Indstillingerne for analysen står i vinduet Analyse under Avanceret">Ændres i Analyse</button>'}/* v9.76 */
function auSaet(k,v){if(k==='sang'){try{auAaben(false)}catch(e){}try{lay3Anvend('ao-sang')}catch(e){}try{dkVis('w35')}catch(e){}try{sgFane('avanceret')}catch(e){}return}if(k==='anaigen'){neToast('Analyserer sangen igen …',true);anaIgen().then(()=>{auAna.c=null;const p=$('ne65-pan');if(p)p.dataset.sig='';auTegn();neToast($('status').textContent,true)});return}const T=auTilstand();let tekst='';
 if(k==='norm'){const vil=v==='1'?'auto':'fast';if(vil!==T.norm)normSkift();tekst='Normalisering: '+(vil==='auto'?'Adaptiv':'Fast')}
 else if(k==='lokal'){if((v==='1')!==T.lokal)normLokalSkift();tekst='Lange sange: '+(v==='1'?'måles i stykker på 2 minutter':'måles over hele sangen')}
 else if(k==='tilpas'){ne10Saet('tilpas',v==='1');tekst='Adaptiv tærskel: '+(v==='1'?'Til':'Fra')}
 else if(k==='takt'||k==='spor'){const n=auAlleAuto(k);tekst=(k==='takt'?'Taktslag':'Spor')+': '+n+(n===1?' regel':' regler')+' sat til Auto-valg'}
 else if(k==='show'){const c=$('show-folg');if(c&&c.checked!==(v==='1'))c.click();else if(typeof SHOW!=='undefined'&&SHOW&&SHOW.til!==(v==='1')){SHOW.til=v==='1';try{save()}catch(e){}}tekst='Afsnits-dynamik: '+(v==='1'?'Til':'Fra')}
 else if(k==='std'){if(T.norm!=='auto')normSkift();if(!T.lokal)normLokalSkift();if(T.tilpas!==T.tilpasStd)ne10Saet('tilpas',T.tilpasStd);const n=auAlleAuto('takt')+auAlleAuto('spor');if(T.show==='fra'){const c=$('show-folg');if(c&&!c.checked)c.click();else if(SHOW)SHOW.til=true}tekst='Automatik: alt er sat tilbage til standard'+(n?' ('+n+(n===1?' regel':' regler')+' sat til Auto-valg)':'')}
 const p=$('ne65-pan');if(p)p.dataset.sig='';auTegn();try{ne2Kp(true)}catch(e){}if(tekst)neToast(tekst,true)}
function auAaben(til){const p=$('ne65-pan'),b=document.querySelector('#ne [data-au="aaben"]');if(!p)return;p.hidden=til===undefined?!p.hidden:!til;p.dataset.sig='';if(b){b.classList.toggle('ne-paa',!p.hidden);b.setAttribute('aria-expanded',String(!p.hidden))}auTegn()}
function auStart(anker){const rod=$('ne');if(!rod||$('ne65-pan'))return;const b=document.createElement('button');b.className='ne-k';b.dataset.au='aaben';b.textContent='Automatik';b.title='Automatik: se og slå det fra, programmet vælger selv (normalisering, Adaptiv tærskel, Auto-valg af taktslag og spor, Afsnits-dynamik)';b.setAttribute('aria-expanded','false');anker.insertAdjacentElement('afterend',b);
 const p=document.createElement('div');p.id='ne65-pan';p.className='ne65-pan';p.hidden=true;p.setAttribute('role','dialog');p.setAttribute('aria-label','Automatik');rod.appendChild(p);
 rod.addEventListener('click',e=>{const k=e.target.closest('[data-au]');if(!k)return;const h=k.dataset.au;if(h==='aaben')auAaben();else if(h==='luk')auAaben(false);else auSaet(h,k.dataset.v)});
 p.addEventListener('pointerdown',e=>e.stopPropagation());p.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();auAaben(false)}else if(!(e.ctrlKey||e.metaKey))e.stopPropagation()});p.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
 setInterval(auTegn,500)}
/* ========== SLUT: PANELET AUTOMATIK ========== */
