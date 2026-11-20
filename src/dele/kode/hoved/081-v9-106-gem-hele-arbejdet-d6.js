/* ========== v9.106: GEM HELE ARBEJDET (D6) ==========
   P8.18 D6 (brugerens ja 19. november). "Gem alle på computer" (opsEksport) dækker kun Opsætning 1–20. "Gem hele arbejdet" (altEksport) lægger alt,
   der ligger i browserens lager under rytme-* (Mine shows i Biblioteket, Opsætning 1–20, det åbne arbejde, indstillinger og docking, Node-editorens
   pladser, lys i Mesh 3D og Øjet, generatorens sange, EQ+ og Radial Mesh), i én fil claude-mv-alt_<dato>.json med et overblik øverst.
   "Hent hele arbejdet" (altImport) læser filen, spørger to gange, erstatter alt under rytme-* og genstarter programmet (som Nulstil alt gør);
   beskeden vises efter genstarten (altBesked). Analyse-cachen (IndexedDB) er ikke med; den regnes igen. Knapperne står i Opsætninger
   (Sikkerhedskopi på computeren), i 💾 Gem ▾ og i banneret Kunne ikke gemme. */
const ALT={type:'hele-arbejdet',version:1,genstarter:false};
function altNoegler(){const k=[];try{for(let i=0;i<localStorage.length;i++){const n=localStorage.key(i);if(n&&n.startsWith('rytme-'))k.push(n)}}catch(e){}return k.sort()}
function altOverblik(d){const L=[],n=(d&&d.noegler)||{},par=k=>{try{return JSON.parse(n[k])}catch(e){return null}};
 const bib=par('rytme-bib');L.push('Mine shows i Biblioteket: '+(Array.isArray(bib)?bib.length:0)+(Array.isArray(bib)&&bib.length?' ('+bib.map(x=>x&&x.navn).filter(Boolean).join(', ')+')':''));
 const pl=SLOTS.filter(s=>n['rytme-'+s]);L.push('Opsætning 1–20 med indhold: '+pl.length+(pl.length?' ('+pl.map(s=>{try{return slotNr(s)}catch(e){return s}}).join(', ')+')':''));
 const m=par('rytme-mapping2'),o=par('rytme-objekter');L.push('Det åbne arbejde: '+(Array.isArray(m)?m.length:0)+' regler, '+(Array.isArray(o)?o.filter(x=>x&&!x.skabelon).length:0)+' figurer');
 L.push('Indstillinger, docking, Node-editorens pladser, lys i Mesh 3D og Øjet, generatorens sange, EQ+ og Radial Mesh: '+Object.keys(n).filter(k=>!/^rytme-(bib|mapping2|objekter|[A-T])$/.test(k)).length+' nøgler');
 const tegn=Object.keys(n).reduce((s,k)=>s+k.length+String(n[k]).length,0);L.push('Størrelse: cirka '+Math.round(tegn*2/1024)+' KB ('+Object.keys(n).length+' nøgler i alt)');return L}
function altEksport(){const noegler={};altNoegler().forEach(k=>{noegler[k]=localStorage.getItem(k)});const k=Object.keys(noegler);if(!k.length){msg('Der er intet at gemme endnu.');return false}
 const nu=new Date(),st=nu.toISOString().slice(0,16).replace('T','_').replace(':','-'),navn='claude-mv-alt_'+st,d={program:'Claude MV',type:ALT.type,version:ALT.version,mv:(document.title.match(/v[\d.]+/)||[''])[0],gemt:nu.toISOString(),noegler};
 d.overblik=['Claude MV · hele arbejdet gemt '+opsDato(nu.toISOString())].concat(altOverblik(d),['','Hent filen igen under Opsætninger → Sikkerhedskopi på computeren → Hent hele arbejdet. Alt i browseren erstattes, og programmet starter forfra.']);
 const ok=opsHent(navn+'.json',JSON.stringify(d,null,1),'application/json');msg(ok?'Hele arbejdet er gemt på computeren som '+navn+'.json. '+d.overblik[1]+'; '+d.overblik[2]+'; '+d.overblik[3]+'.':'Filen kunne ikke gemmes (browseren afviste det).');return ok}
async function altImport(f){let d;try{d=JSON.parse(await f.text())}catch(e){msg('Filen kunne ikke læses.');return false}
 if(!d||d.type!==ALT.type||!d.noegler||typeof d.noegler!=='object'){if(d&&d.type==='opsaetninger'){msg('Det er en fil med opsætninger (Opsætning 1–20). Brug Indlæs fra computer til den.');return false}msg('Filen er ikke en "hele arbejdet"-fil fra Claude MV (feltet noegler mangler).');return false}
 const k=Object.keys(d.noegler).filter(x=>x.startsWith('rytme-')&&typeof d.noegler[x]==='string');if(!k.length){msg('Filen indeholder intet at hente.');return false}
 const ov=altOverblik(d),her=altOverblik({noegler:Object.fromEntries(altNoegler().map(x=>[x,localStorage.getItem(x)]))});
 const ja=await sikker({titel:'Hent hele arbejdet?',tekst:'Filen ('+(d.gemt?opsDato(d.gemt):'ukendt tidspunkt')+(d.mv?', '+d.mv:'')+') indeholder: '+ov.slice(0,3).join('; ')+'. ALT, der er i browseren nu, bliver erstattet: '+her.slice(0,3).join('; ')+'. Gem gerne først det, du har nu (Gem hele arbejdet).',ok:'Ja, fortsæt',fare:true},{titel:'Er du helt sikker?',tekst:'Mine shows, Opsætning 1–20, det åbne arbejde og alle indstillinger i browseren erstattes af filens og kan ikke hentes igen. Programmet starter forfra bagefter.',ok:'Ja, hent og start forfra',fare:true});
 if(!ja){msg('Hentning annulleret. Intet er ændret.');return false}
 let fejl=[];try{altNoegler().forEach(x=>localStorage.removeItem(x));fejl=k.filter(x=>!lsGem(x,d.noegler[x]));sessionStorage.setItem('mv-hentet',ov[0]+' · '+ov[1]+' · '+ov[2])}catch(e){fejl.push(String(e&&e.name||e))}
 if(fejl.length){msg('Kunne ikke skrive alt i browserens lager ('+fejl.length+' nøgler; lageret er måske fuldt). Programmet starter forfra med det, der kom ind.')}
 ALT.genstarter=true;setTimeout(()=>location.reload(),fejl.length?1500:50);return true}
function altBesked(){try{const t=sessionStorage.getItem('mv-hentet');if(!t)return;sessionStorage.removeItem('mv-hentet');msg('Hele arbejdet er hentet fra filen, og programmet er startet forfra. '+t+'.')}catch(e){}}
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('#ops-alt-gem,#ops-alt-hent,#gem-fejl-alt,[data-el9alt]');if(!t)return;
 if(t.id==='ops-alt-hent'){const f=$('ops-alt-fil');if(f){f.value='';f.click()}return}
 if(t.hasAttribute('data-el9alt')){try{el9GemAaben(false)}catch(x){}}altEksport()});
document.addEventListener('change',e=>{if(e.target&&e.target.id==='ops-alt-fil'){const f=e.target.files&&e.target.files[0];e.target.value='';if(f)altImport(f)}});
/* ========== SLUT: GEM HELE ARBEJDET (D6) ========== */



