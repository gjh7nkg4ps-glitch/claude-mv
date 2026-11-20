
/* ========== v9.122: AUTOSIKRING (T1) ==========
   Brugerens valg T1 (20. november; docs/PLAN-TEKNIK.md): en automatisk kopi af hele arbejdet hver dag, så man altid kan gå tilbage til i går.
   - Første gang MV startes en dag (og igen, hvis MV står åben over midnat), lægges en kopi af alt under rytme-* (det samme som Gem hele arbejdet) i
     IndexedDB (databasen rytme, nøglen sikring|D|ÅÅÅÅ-MM-DD) og et lille overblik (sikring-meta|…). De seneste 7 dage gemmes; ældre slettes.
   - Opsætninger → Sikkerhedskopi på computeren → Automatiske kopier: én række pr. kopi (i dag, i går, dato · klokkeslæt · version · indhold · størrelse)
     og knappen Gå tilbage hertil. Der spørges to gange (som ved Hent hele arbejdet). Før MV går tilbage, gemmes det, der er nu, som "lige før du gik
     tilbage" (sikring|F|…, de 2 seneste), så det kan fortrydes med samme knap. Programmet starter forfra og siger bagefter, hvad der skete.
   - Tag en kopi nu: lægger dagens kopi igen (den erstatter dagens).
   - Analyse-cachen er ikke med (den regnes igen). Kopierne ligger i browseren; Gem hele arbejdet (en fil på computeren) er stadig den sikreste. */
const SIK={DAGE:7,FOER:2,tegnet:0};
function sikDag(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')}
const sikPut=(k,v)=>db().then(d=>new Promise((res,rej)=>{const tx=d.transaction('a','readwrite');tx.objectStore('a').put(v,k);tx.oncomplete=()=>res(true);tx.onerror=()=>rej(tx.error);tx.onabort=()=>rej(tx.error)}));
const sikGet=k=>db().then(d=>new Promise(res=>{const q=d.transaction('a').objectStore('a').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>res(null)}));
const sikDel=k=>db().then(d=>new Promise(res=>{const tx=d.transaction('a','readwrite');tx.objectStore('a').delete(k);tx.oncomplete=()=>res(true);tx.onerror=()=>res(false)}));
const sikMetaer=()=>db().then(d=>new Promise(res=>{const q=d.transaction('a').objectStore('a').getAll(IDBKeyRange.bound('sikring-meta|','sikring-meta|￿'));q.onsuccess=()=>res(q.result||[]);q.onerror=()=>res([])}));
/* læg en kopi: grund 'dag' (dagens kopi; dag kan angives, fx i en test) eller 'foer' (lige før man går tilbage) */
async function sikTag(grund,dag){const noegler={};altNoegler().forEach(k=>{noegler[k]=localStorage.getItem(k)});if(!Object.keys(noegler).length)return null;
 dag=dag||sikDag();const nu=new Date().toISOString(),id=grund==='foer'?'F|'+nu:'D|'+dag,mv=(document.title.match(/v[\d.]+/)||[''])[0],d={program:'Claude MV',type:ALT.type,version:ALT.version,mv,gemt:nu,dag,grund,noegler};
 const kb=Math.max(1,Math.round(Object.keys(noegler).reduce((s,k)=>s+k.length+String(noegler[k]).length,0)*2/1024)),meta={id,grund,dag,gemt:nu,mv,antal:Object.keys(noegler).length,kb,overblik:altOverblik(d).slice(0,3)};
 await sikPut('sikring|'+id,d);await sikPut('sikring-meta|'+id,meta);await sikRyd();SIK.tegnet=0;return meta}
async function sikRyd(){const M=await sikMetaer(),D=M.filter(m=>m.grund!=='foer').sort((a,b)=>a.dag<b.dag?1:-1),F=M.filter(m=>m.grund==='foer').sort((a,b)=>a.gemt<b.gemt?1:-1);
 for(const m of D.slice(SIK.DAGE).concat(F.slice(SIK.FOER))){await sikDel('sikring|'+m.id);await sikDel('sikring-meta|'+m.id)}}
async function sikDagligt(){if(ALT.genstarter)return;try{const M=await sikMetaer(),dag=sikDag();if(!M.some(m=>m.grund!=='foer'&&m.dag===dag))await sikTag('dag')}catch(e){console.warn('Autosikring:',e)}}
setTimeout(sikDagligt,6000);setInterval(sikDagligt,30*60000);
function sikNavn(m){const i=sikDag(),ig=sikDag(new Date(Date.now()-864e5)),t=opsDato(m.gemt);if(m.grund==='foer')return 'lige før du gik tilbage ('+t+')';
 return (m.dag===i?'i dag':m.dag===ig?'i går':m.dag.split('-').reverse().join('-'))+' ('+t+')'}
async function sikGaaTilbage(id){const m=(await sikMetaer()).find(x=>x.id===id),v=await sikGet('sikring|'+id);if(!m||!v||!v.noegler){msg('Kopien kunne ikke læses.');return false}
 const her=altOverblik({noegler:Object.fromEntries(altNoegler().map(x=>[x,localStorage.getItem(x)]))});
 const ja=await sikker({titel:'Gå tilbage til kopien fra '+sikNavn(m)+'?',tekst:'Kopien'+(m.mv?' ('+m.mv+')':'')+' indeholder: '+m.overblik.join('; ')+'. Det, der er i browseren nu, bliver erstattet: '+her.slice(0,3).join('; ')+'. MV gemmer først det, du har nu, som en kopi, så du kan fortryde.',ok:'Ja, gå tilbage',fare:true},{titel:'Er du helt sikker?',tekst:'Programmet starter forfra bagefter. Fortryd: Opsætninger → Automatiske kopier → "lige før du gik tilbage" → Gå tilbage hertil.',ok:'Ja, gå tilbage og start forfra',fare:true});
 if(!ja){msg('Annulleret. Intet er ændret.');return false}
 try{await sikTag('foer')}catch(e){console.warn(e)}
 let fejl=[];try{altNoegler().forEach(x=>localStorage.removeItem(x));fejl=Object.keys(v.noegler).filter(x=>x.startsWith('rytme-')&&typeof v.noegler[x]==='string'&&!lsGem(x,v.noegler[x]));sessionStorage.setItem('mv-sikring','MV er gået tilbage til kopien fra '+sikNavn(m)+' og er startet forfra. Fortryd under Opsætninger → Automatiske kopier.')}catch(e){fejl.push(String(e&&e.name||e))}
 if(fejl.length)msg('Kunne ikke skrive alt i browserens lager ('+fejl.length+' nøgler). Programmet starter forfra med det, der kom ind.');
 ALT.genstarter=true;setTimeout(()=>location.reload(),fejl.length?1500:50);return true}
setTimeout(()=>{try{const t=sessionStorage.getItem('mv-sikring');if(t){sessionStorage.removeItem('mv-sikring');msg(t)}}catch(e){}},2500);
const sikStr=kb=>kb>=1024?(kb/1024).toFixed(1).replace('.',',')+' MB':kb+' KB';
async function sikTegn(tving){const g=$('ops-alt-gem');if(!g||!g.offsetParent)return;const ab=g.closest('.ab');if(!ab)return;let b=$('sik-boks');if(!b){b=document.createElement('div');b.id='sik-boks';b.className='sik-boks';ab.insertAdjacentElement('afterend',b)}
 if(!tving&&b.dataset.klar&&Date.now()-SIK.tegnet<20000)return;SIK.tegnet=Date.now();const M=await sikMetaer(),D=M.filter(m=>m.grund!=='foer').sort((a,c)=>a.dag<c.dag?1:-1),F=M.filter(m=>m.grund==='foer').sort((a,c)=>a.gemt<c.gemt?1:-1);
 b.innerHTML='<div class="sik-top"><b>Automatiske kopier</b> <span class="small">én om dagen, de seneste '+SIK.DAGE+' dage; de ligger i browseren</span> <button class="ghost" data-sik="nu" title="Læg en kopi af alt, som det er lige nu (den erstatter dagens kopi)">Tag en kopi nu</button></div>'
  +(D.length+F.length?'<table class="sik-tab"><tbody>'+F.concat(D).map(m=>'<tr data-sikid="'+neHtml(m.id)+'"><td><b>'+neHtml(sikNavn(m))+'</b></td><td class="small">'+neHtml(m.mv||'')+'</td><td class="small">'+neHtml(m.overblik.join(' · '))+' · '+sikStr(m.kb)+'</td><td><button class="ghost" data-sik="tilbage" data-id="'+neHtml(m.id)+'" title="Erstat alt i browseren med denne kopi (du bliver spurgt to gange; det, du har nu, gemmes først)">Gå tilbage hertil</button></td></tr>').join('')+'</tbody></table>':'<p class="small">Ingen kopier endnu. Den første lægges, når MV har kørt et par sekunder.</p>');b.dataset.klar='1'}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-sik]');if(!t)return;if(t.dataset.sik==='nu'){sikTag('dag').then(m=>{msg(m?'Kopien er lagt: '+sikNavn(m)+'.':'Der er intet at gemme endnu.');sikTegn(true)})}else sikGaaTilbage(t.dataset.id)});
setInterval(()=>{try{sikTegn()}catch(e){}},2000);
/* ========== SLUT: AUTOSIKRING (T1) ========== */
