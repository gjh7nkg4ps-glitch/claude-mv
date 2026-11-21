
/* ========== v9.129: RIGTIGE TROMMER UDEN MAPPEN (VALG A) ==========
   Brugerens valg A (21. november): facit gemmes i browseren, så Rigtige trommer kan måles igen uden at vælge mappen MDB Drums.
   - Når mappen er valgt og målt, gemmes facit (NAVN_class.txt, NAVN_subclass.txt og NAVN_MIX.beats som tekst) og lydfilernes navn og størrelse i IndexedDB
     (nøglen mdbfacit|1, cirka 200 KB). Det ligger kun i browseren på din pc: aldrig i repoet og ikke i Gem hele arbejdet. Lyden selv gemmes ikke; analysen af
     den ligger allerede i cachen (mdb1|… og mdb1t|…), så målingen tager få sekunder.
   - Knappen "Mål igen (uden mappen)" ved Vælg facit-mappe måler med det gemte facit og analysen fra cachen. Mangler en analyse i cachen (fx ryddet af
     browseren), siger MV hvor mange, og beder om mappen igen; der måles ikke halvt.
   - "Glem facit" sletter det gemte facit (spørger først). Tallene og analysen i cachen bliver. Licens: MDB Drums er CC BY-NC-SA 4.0 (ikke-kommerciel). */
const MDBF={KEY:'mdbfacit|1',info:null};
async function mdbFacitHent(){let x=null;try{x=await cacheGet(MDBF.KEY)}catch(e){}MDBF.info=x&&Array.isArray(x.stykker)&&x.stykker.length?{dato:x.dato,n:x.stykker.length}:null;return MDBF.info?x:null}
async function mdbFacitGem(files){const L=mdbFind(files);if(!L.length)return false;const txt=async f=>f?await f.text():null,st=[];
 for(const s of L)st.push({navn:s.navn,mix:s.mix?{name:s.mix.name,size:s.mix.size}:null,trom:s.trom?{name:s.trom.name,size:s.trom.size}:null,klass:await txt(s.klass),sub:await txt(s.sub),beats:await txt(s.beats)});
 const x={dato:Date.now(),stykker:st},ok=await db().then(d=>new Promise(res=>{const tx=d.transaction('a','readwrite');tx.objectStore('a').put(x,MDBF.KEY);tx.oncomplete=()=>res(true);tx.onerror=()=>res(false);tx.onabort=()=>res(false)})).catch(()=>false);
 /* der ventes, til browseren har skrevet det (cachePut venter ikke) */if(ok)MDBF.info={dato:x.dato,n:st.length};return ok}
function mdbFacitSlet(){MDBF.info=null;return db().then(d=>new Promise(res=>{const tx=d.transaction('a','readwrite');tx.objectStore('a').delete(MDBF.KEY);tx.oncomplete=()=>res(true);tx.onerror=()=>res(false)})).catch(()=>false)}
/* facit som "filer" med de samme navne, så målingen kører præcis som med mappen; lyden findes kun i cachen */
function mdbVirtuelle(x){const F=[],tekst=(name,t)=>({name,size:t.length,__mdbv:true,text:async()=>t});
 for(const s of x.stykker){if(s.klass!=null)F.push(tekst(s.navn+'_class.txt',s.klass));if(s.sub!=null)F.push(tekst(s.navn+'_subclass.txt',s.sub));if(s.beats!=null)F.push(tekst(s.navn+'_MIX.beats',s.beats));
  [s.mix,s.trom].forEach(a=>{if(a)F.push({name:a.name,size:a.size,__mdbv:true,arrayBuffer:async()=>{throw new Error('Lyden findes ikke i browseren; vælg mappen igen.')}})})}return F}
async function mdbIgen(){if(MDB.koerer||MDBF.gemmer)return null;const x=await mdbFacitHent();if(!x){msg('Der er intet facit i browseren. Vælg facit-mappen.');asTegn();return null}let mangler=0;
 for(const s of x.stykker)for(const[a,toner]of[[s.mix,true],[s.trom,false]]){if(!a)continue;const c=await cacheGet('mdb'+MDB.VER+'|'+a.name+'|'+a.size);if(!(c&&c.R&&c.R.kick)){mangler++;continue}if(toner){const ct=await cacheGet('mdb'+MDB.VER+'t|'+a.name+'|'+a.size);if(!(ct&&ct.A1))mangler++}}
 if(mangler){const t='Analysen af '+mangler+(mangler===1?' lydfil':' lydfiler')+' mangler i cachen (browseren kan have ryddet den). Vælg facit-mappen igen; så regnes de og gemmes.';msg(t);try{$('status').textContent=t}catch(e){}return null}
 return mdbKoer(mdbVirtuelle(x))}
/* facit gemmes, før der måles (så det er gemt, også hvis siden lukkes lige efter målingen) */
{const gl=mdbKoer;window.mdbKoer=async function(files){const virt=Array.isArray(files)&&files.length&&files.every(f=>f&&f.__mdbv);if(!virt&&!MDB.koerer&&!MDBF.gemmer){MDBF.gemmer=true;try{await mdbFacitGem(files||[])}catch(e){console.warn(e)}finally{MDBF.gemmer=false}}return gl.apply(this,arguments)}}
{const gl=mdbHtml;window.mdbHtml=function(){const I=MDBF.info,dis=MDB.koerer?' disabled':'';
 return gl().replace('</button><span class="small">','</button>'+(I?'<button class="ghost" data-mdbx="igen"'+dis+' title="Mål Rigtige trommer igen med det facit og den analyse, der ligger i browseren; du behøver ikke vælge mappen">Mål igen (uden mappen)</button><button class="ghost" data-mdbx="glem"'+dis+' title="Slet det gemte facit fra browseren (spørger først)">Glem facit</button>':'')+'<span class="small">'+(I?'Facit fra '+asDato(I.dato)+' ligger i browseren ('+I.n+' stykker) · ':''))
  .replace('4. Første gang regnes 46 lydfiler (cirka et par minutter); bagefter hentes de fra cachen.<br>','4. Første gang regnes 46 lydfiler (cirka et par minutter); bagefter hentes de fra cachen.<br>5. Facit gemmes i browseren, så du bagefter kan trykke <b>Mål igen (uden mappen)</b>. <b>Glem facit</b> sletter det igen.<br>')}}
document.addEventListener('click',async e=>{const b=e.target.closest&&e.target.closest('[data-mdbx="igen"],[data-mdbx="glem"]');if(!b||b.disabled)return;e.stopPropagation();
 if(b.dataset.mdbx==='glem'){const ok=await spoerg({titel:'Glem facit fra MDB Drums?',tekst:'Facit (tekstfilerne) slettes fra browseren. Tallene og analysen i cachen bliver. For at måle igen skal du vælge mappen.',ok:'Ja, glem',fare:true});if(!ok||!ok.ok){msg('Annulleret. Intet er ændret.');return}await mdbFacitSlet();msg('Facit er glemt. Vælg mappen for at måle igen.');asTegn();return}
 await mdbIgen()});
mdbFacitHent().then(()=>{try{asTegn()}catch(e){}});
/* ========== SLUT: RIGTIGE TROMMER UDEN MAPPEN (VALG A) ========== */
