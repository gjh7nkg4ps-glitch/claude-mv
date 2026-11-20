/* ========== FÆLLES INDGANG TIL REGLERNE (v9.43) ==========
   Fase 1 i PLAN-NY-BRUGERFLADE.md (P8.2), første trin: opbygningen.
   Regel-listen hedder maps. Indtil nu har cirka 65 steder i koden ændret den direkte. Regler er det ene sted, der fra nu af skal bruges
   til at lave, rette og slette en regel (fagudtryk: API eller "store"). I dette trin er indgangen bygget og virker; de gamle steder flyttes
   herover i de næste trin, lidt ad gangen, med testpakken efter hver bid.
   - Hver regel har et fast id (feltet id, fx "r-m3k2-0-x7q"). Regler uden id (gamle opsætninger, gamle gemte indstillinger og de gamle
     steder i koden) får et, så snart listen gemmes. To regler kan aldrig have det samme id: en kopi får et nyt. Id'et gemmes sammen med
     reglen, følger med i Opsætning 1–20 og i Fortryd, og betyder intet for, hvordan motoren regner.
   - Regler.alle() giver listen; find(id) én regel; tilfoej(regel) lægger en til og giver dens id; ret(id, felter) ændrer felter
     (et felt sat til undefined fjernes); slet(id); erstat(liste) skifter hele listen; samlet(funktion) samler flere ændringer til én besked;
     lyt(funktion) kaldes, hver gang reglerne er ændret, også når et af de gamle steder har gjort det (det opdages, når listen gemmes).
   - Alle ændringer gemmes som før (save og renderMaps), så Ctrl+Z virker uændret.
   v9.45: de første 9 steder bruger indgangen (EQ, Radial Mesh, Editorens Koblinger, Node-editoren, visningerne og lydlag); sletNr og retNr er til de steder, der kender reglens nummer.
   v9.46: Editorens 11 handlinger bruger indgangen; sletHvor(funktion) sletter alle regler, der passer.
   v9.47: de 9 steder, der skifter hele listen (opsætninger, Indlæs, Auto-mapping, Nulstil alt, Fortryd, Multi-styring), bruger erstat(liste, true).
   v9.48: 15 steder mere (banens klods-regler, Tilfældigt, Lav figurer, danseren, diskokuglen, lagenes numre) bruger tilfoej, sletHvor og den nye retHvor med senere=true:
   de er hjælpere, som kaldes midt i en større handling, der selv gemmer til sidst.
   v9.49: de sidste 9 steder (Diskodronningerne, trommeslageren, Perfect, hændelser på figurerne, Lyd og vision, Node-editorens skabeloner).
   Tilbage uden for indgangen er kun: let maps, de to ved opstart (indgangen findes ikke endnu), den midlertidige liste i lavIsoleret og lavSinglen,
   og en lokal liste med samme navn i den tilfældige opsætning.
   v9.50: Node-editoren lytter på Regler (se sidst i blokken), og resterne af Mapping-vinduets tegning er fjernet fra renderMaps. */
const Regler=(()=>{let nr=0,sidst='',samler=0,naeste=null,travl=false;const lyttere=new Set();
 const nytId=()=>'r-'+Date.now().toString(36)+'-'+(nr++).toString(36)+'-'+Math.random().toString(36).slice(2,5);
 function sikrId(){const brugt=new Set();let nye=0;maps.forEach(m=>{if(!m||typeof m!=='object')return;if(typeof m.id!=='string'||!m.id||brugt.has(m.id)){m.id=nytId();nye++}brugt.add(m.id)});return nye}
 const sig=()=>{try{return JSON.stringify(maps)}catch(e){return String(Math.random())}};
 /* kaldes efter hver gemning: giver nye regler et id og siger til lytterne, hvis noget er ændret */
 function tjek(){if(travl)return false;const nye=sikrId(),s=sig();if(s===sidst){naeste=null;return false}const foerste=sidst==='';sidst=s;const b=naeste||{hvad:'andet',id:null};naeste=null;
  if(nye){try{lsGem('rytme-mapping2',s)}catch(e){}}
  if(!foerste)lyttere.forEach(f=>{try{f(b)}catch(e){console.error(e)}});return true}
 function gem(hvad,id){if(samler){naeste={hvad:'samlet',id:null};return}naeste={hvad,id:id||null};travl=true;try{save()}catch(e){}try{renderMaps()}catch(e){}travl=false;tjek()}
 const indeks=id=>maps.findIndex(m=>m&&m.id===id);
 /* senere: ændringen er lavet, men stedet gemmer selv lidt efter; flere ændringer inden gemningen bliver til én besked (samlet) */
 const maerk=h=>{naeste={hvad:naeste?'samlet':h,id:null}};
 return{
  alle:()=>maps.slice(),
  antal:()=>maps.length,
  find:id=>maps[indeks(id)]||null,
  indeks,
  tilfoej(regel,senere){const m=Object.assign({},regel);delete m.id;if(senere){maps.push(m);maerk('tilfoej');return null}m.id=nytId();maps.push(m);gem('tilfoej',m.id);return m.id},
  ret(id,felter){const m=maps[indeks(id)];if(!m||!felter)return false;Object.keys(felter).forEach(k=>{if(k==='id')return;if(felter[k]===undefined)delete m[k];else m[k]=felter[k]});gem('ret',id);return true},
  slet(id){const i=indeks(id);if(i<0)return false;maps.splice(i,1);gem('slet',id);return true},
  /* sletter alle regler, som funktionen siger ja til; giver antallet og én besked */
  sletHvor(fn,senere){const n0=maps.length;maps=maps.filter(m=>!fn(m));const n=n0-maps.length;if(n){if(senere)maerk('slet');else gem('slet',null)}return n},
  /* retter alle regler, som fn siger ja til; aendring(regel) giver de felter, der skal sættes */
  retHvor(fn,aendring,senere){let n=0;maps.forEach(m=>{if(!fn(m))return;const f=aendring(m)||{};Object.keys(f).forEach(k=>{if(k==='id')return;if(f[k]===undefined)delete m[k];else m[k]=f[k]});n++});if(n){if(senere)maerk('ret');else gem('ret',null)}return n},
  /* til de steder, der kender reglens nummer i listen (0 er den første) */
  sletNr(i){const m=maps[i];if(!m)return false;const id=m.id||null;maps.splice(i,1);gem('slet',id);return true},
  retNr(i,felter){const m=maps[i];if(!m)return false;if(!m.id)sikrId();return this.ret(m.id,felter)},
  /* senere=true: listen skiftes nu, men gemmes først, når stedet selv gemmer (det har mere at stille på plads først); beskeden er stadig erstat */
  erstat(liste,senere){maps=(liste||[]).map(m=>Object.assign({},m));if(senere)naeste={hvad:'erstat',id:null};else gem('erstat',null);return maps.length},
  samlet(fn){samler++;try{fn()}finally{samler--}if(!samler)gem('samlet',null)},
  lyt(fn){lyttere.add(fn);return()=>lyttere.delete(fn)},
  tjek,nytId}})();
{const gl=save;window.save=function(){const r=gl.apply(this,arguments);try{Regler.tjek()}catch(e){}return r}}
/* sikkerhedsnet: et gammelt sted, der ændrer listen uden at gemme, opdages inden for et halvt sekund */
setInterval(()=>{try{Regler.tjek()}catch(e){}},500);
try{Regler.tjek()}catch(e){}
/* v9.50: Node-editoren lytter her; den bygger noderne om ved næste tjek (højst et halvt sekund efter, som før) */
Regler.lyt(()=>{try{NE2.snavs=true}catch(e){}});
/* ========== SLUT: FÆLLES INDGANG TIL REGLERNE ========== */
