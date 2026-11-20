/* ========== FASE 2: OPSÆTNINGER OG SIKKERHED ========== */
/* 14 opsætninger (Standard + nr. 1 til 13) og 20 egne pladser (A til T) med lås. Alle destruktive handlinger spørger i selve siden, ikke med browserens confirm (den kan være blokeret på en udgivet side).
   Låsens kode (5326) er en sikring mod uheld, ikke mod nogen, der ser i kildekoden. */
const SLOTS=['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T'],/* v9.33: vises som Opsætning 1–20 */slotNr=n=>{const i=SLOTS.indexOf(n);return i<0?String(n):String(i+1)},LAAS_KODE='5326',kl=x=>JSON.parse(JSON.stringify(x));
let bdRes=null,opsSel='A',opsBygget=false;
function spoerg(o){return new Promise(res=>{if(bdRes)bdRes({ok:false,vaerdi:''});bdRes=res;$('bd-t').textContent=o.titel;$('bd-p').textContent=o.tekst;$('bd-in').hidden=!o.kode;$('bd-in').value='';$('bd-err').textContent=o.fejl||'';$('bd-ok').textContent=o.ok||'Ja';$('bd-nej').textContent=o.nej||'Annullér';$('bd-ok').classList.toggle('fare',!!o.fare);try{$('bd').showModal()}catch(e){}if(o.kode)try{$('bd-in').focus()}catch(e){}})}
function bdSvar(ok){const r=bdRes,v=$('bd-in').value;bdRes=null;try{$('bd').close()}catch(e){}if(r)r({ok,vaerdi:v})}
$('bd-ok').onclick=()=>bdSvar(true);$('bd-nej').onclick=()=>bdSvar(false);$('bd').addEventListener('cancel',e=>{e.preventDefault();bdSvar(false)});
$('bd-in').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();bdSvar(true)}});
async function sikker(foerste,anden){const a=await spoerg(foerste);if(!a.ok)return false;const b=await spoerg(anden);return b.ok}
async function laasOpKode(n){let fejl='';for(;;){const r=await spoerg({titel:'Lås opsætning '+slotNr(n)+' op',tekst:'Skriv koden for at låse op.',kode:true,ok:'Lås op',fejl});if(!r.ok)return false;if(r.vaerdi.trim()===LAAS_KODE)return true;fejl='Forkert kode. Prøv igen.'}}
const slotLaast=n=>{const d=slotRead(n);return !!(d&&d.laast)};
function slotSkriv(n,d){try{lsGem('rytme-'+n,JSON.stringify(d));return !!localStorage.getItem('rytme-'+n)}catch(e){return false}}
function slotLaas(n){const d=slotRead(n);if(!d){msg('Der er intet i opsætning '+slotNr(n)+' at låse.');return}d.laast=true;if(slotSkriv(n,d)){msg('Opsætning '+slotNr(n)+' er låst. Den kan ikke overskrives eller slettes, før den låses op med koden.');meshUI()}}
async function slotLaasOp(n){const d=slotRead(n);if(!d||!d.laast)return;if(!(await laasOpKode(n)))return;d.laast=false;if(slotSkriv(n,d)){msg('Opsætning '+slotNr(n)+' er låst op.');meshUI()}}
/* Gem fra brugerfladen: er der allerede noget i pladsen, spørges der først (en låst plads afvises af slotSave). */
async function gem(n,navn){const d=slotRead(n);if(d&&!d.laast&&n!=='A'&&n!=='B'){/* v3.9: A og B er hurtigpladserne til at sammenligne og overskrives uden spørgsmål; de andre spørger stadig */const nv='opsætning '+slotNr(n)+(d.navn?' ('+d.navn+')':'');
 const r=await spoerg({titel:'Overskriv '+nv+'?',tekst:nv+' indeholder allerede en opsætning. Hvis du gemmer, bliver den erstattet af det, du har nu. Det kan ikke fortrydes.',ok:'Ja, overskriv',fare:true});
 if(!r.ok){msg('Gem i opsætning '+slotNr(n)+' annulleret. Intet er ændret.');return false}}
 return slotSave(n,navn)}
async function slotSlet(n){const d=slotRead(n);if(!d){msg('Opsætning '+slotNr(n)+' er allerede tom.');return}if(d.laast){msg('Opsætning '+slotNr(n)+' er låst og kan ikke slettes. Lås den op først.');return}
 const navn='opsætning '+slotNr(n)+(d.navn?' ('+d.navn+')':'');
 const ja=await sikker({titel:'Slet '+navn+'?',tekst:'Opsætningen i '+navn+' bliver slettet.',ok:'Ja, fortsæt',fare:true},{titel:'Er du helt sikker?',tekst:'Det kan ikke fortrydes. Er '+navn+' vigtig, så annullér og lås den i stedet.',ok:'Ja, slet '+slotNr(n),fare:true});
 if(!ja){msg('Sletning af opsætning '+slotNr(n)+' annulleret.');return}
 try{localStorage.removeItem('rytme-'+n)}catch(e){}if(active===n)active=null;msg(navn+' er slettet.');meshUI()}
function navnAktiv(a){if(a==='std')return'Standard';if(a==='show')return'Sangens show'+(SHOW?' ('+SHOW.navn+')':'');if(a==='f:fest')return'Fest';if(/^f:/.test(a)){const f=FORINDST.find(x=>'f:'+x.id===a);return f?f.navn:a}const d=slotRead(a);if(SLOTS.includes(a))return 'Opsætning '+slotNr(a)+(d&&d.navn?' ('+d.navn+')':'');return d&&d.navn?a+' ('+d.navn+')':a}
/* ---- Nulstil alt (to bekræftelser; låste pladser bevares) ---- */
async function nulstilAlt(){const laaste=SLOTS.filter(slotLaast);
 const ja=await sikker({titel:'Nulstil alt?',tekst:'Dette sletter den mapping, de figurer, bane og klods, lydlag, positioner og indstillinger, du har lige nu, og generatorens sange. Dine egne opsætninger A til T bliver IKKE slettet; dem sletter du kun én ad gangen under Opsætninger. Gem gerne først på computeren (Opsætninger, Gem alle på computer). Du kan ikke fortryde det.',ok:'Ja, fortsæt',fare:true},{titel:'Er du helt sikker?',tekst:'Det, der er åbent nu, nulstilles for altid. Dine 20 opsætninger bevares.',ok:'Ja, nulstil alt',fare:true});
 if(!ja){msg('Nulstilling annulleret. Intet er ændret.');return}
 try{const behold=new Set([...SLOTS.map(n=>'rytme-'+n),'rytme-bib',...Object.values(LEGACY)]),keys=[];/* v9.91: Mine shows i Biblioteket bevares også *//* v4.1: egne opsætninger slettes aldrig af Nulstil alt, kun én ad gangen */for(let i=0;i<localStorage.length;i++)keys.push(localStorage.key(i));keys.filter(k=>k&&k.startsWith('rytme-')&&!behold.has(k)).forEach(k=>localStorage.removeItem(k))}catch(e){}
 /* v9.73: programmet genstarter i stedet for at bygge om i samme side. Før blev set sat til et lille sæt uden zoner, arbejdsområde og lås,
    så programmet faldt tilbage til de gamle frie vinduer (topbjælken kunne ikke trykkes, Opsætninger stod halvt uden for skærmen).
    Nu er alt i localStorage (undtagen pladserne) væk, og en genstart giver præcis startilstanden; beskeden vises efter genstarten (nul73Besked). */
 try{sessionStorage.setItem('mv-nulstillet','1')}catch(e){}
 try{set={tol:90,fps:60,theme:'warm',stoerrelse:'normal',zoner:true,lay3:'ao-sang',lay3Init:1,laast:true,laastStd971:1,kval:{niveau:'disco',egne:{},regulator:false,maaler:false}};lsGem('rytme-set',JSON.stringify(set))}catch(e){}
 try{$('sd').close()}catch(e){}
 location.reload()}
/* v9.73: beskeden efter Nulstil alt (programmet er genstartet) */
function nul73Besked(){try{if(sessionStorage.getItem('mv-nulstillet')!=='1')return;sessionStorage.removeItem('mv-nulstillet')}catch(e){return}msg('Alt er nulstillet, og programmet er startet forfra. Dine egne opsætninger 1 til 20 og Mine shows i Biblioteket er bevaret.')}
$('s-reset').onclick=()=>nulstilAlt();
/* ---- Opsætninger ---- */
const M=(b,e,thr,gain,att,rel,gap)=>({...mk(b,e,thr,gain,att,rel),gap:gap??120});
function fuldBase(){return[M('kick','puls',.3,1,12,220),M('snare','burst',.35,.9,8,150),M('hihat','glod',.4,.8,8,90),M('centroid','farve',0,1,250,400),M('bas','bolge',.2,1,60,200),M('rms','fart',.1,1,200,500),M('flux','ryst',.6,.7,10,120),M('bas','zoom',.4,.6,60,300),M('kick','ring',.35,.8,10,260),M('snare','strobe',.7,.5,6,90),M('vokal','banelys',.4,.8,80,300),M('hmid','slange',.2,.9,120,450),M('centroid','slange_farve',0,.8,300,700),M('kick','klods1',.3,1,8,120),M('snare','klods2',.3,1,8,120),M('hihat','klods3',.35,1,8,100)]}
function fuldObjekter(){const ms=nyMorgenstjerne(),o1=nyObjekt('o1','Figur 1'),mp=[];
 [['hmid','piglaengde',.3],['bas','storrelse',.2],['flux','drej',.2],['kick','skala',.3],['vokal','svaev',.2],['vokal','loeft',.2]].forEach(([b,p,thr])=>{const e=ms.lag[0].egenskaber[p];e.fra=MS_FRA[p];e.til=MS_TIL[p];mp.push(M(b,'obj:ms:0:'+p,thr,1,20,250))});
 uiProps('pigkugle').forEach(p=>{const b=AUTOKOBL[p];if(b){mp.push(M(b,'obj:o1:0:'+p,.3,1,20,200));ensureSwing(o1,0,p)}});
 return{objekter:[o1,ms],maps:mp}}
const FORINDST=[/* v9.85 (pakke 7, B1): kun de opsætninger, brugeren valgte; de andre 23 er fjernet. v9.97 (P8.14 3e): Lyt til sangen (auto1–3) er fjernet; Foreslå regler gør det samme og lader dig sige ja */
];

/* ========== v5.6: NYE FORUDINDSTILLINGER ==========
   Fire figur-shows (Pigernes show, Trommeslagerens solo, Danserens solo og Morgenstjernens dans) og tre med hændelser (Takt og akkord, Drop og omkvæd, Levende på taktslaget).
   Figur-shows bygges ved at køre skabelonen (fx To piger) i et midlertidigt, tomt rum med hændelser slået til, lægge de ekstra forbindelser til og gemme resultatet; derefter lægges det, du havde åbent, tilbage præcis som det var. */
function lavIsoleret(byg){const gm=maps,go=fase2.objekter,gs=selO,gl=selL,gh=set.skabHnd,gt=$('status').textContent;let d=null;
 try{maps=[];fase2.objekter=[];selO=0;selL=0;set.skabHnd=true;const fn=n=>fase2.objekter.find(o=>o.navn===n),add=(o,p,band,thr,gain,att,rel,inv)=>{if(!o)return;const li=o.lag.findIndex(l=>uiProps(l.form).includes(p));if(li<0)return;const eff=tidOf(o,li,p);if(maps.some(x=>x.band===band&&x.effect===eff))return;/* aldrig den samme forbindelse to gange */const m=mk(band,eff,thr,gain,att||5,rel||200);if(inv)m.inv=true;maps.push(m)},glob=(eff,band,thr,gain,att,rel)=>maps.push(mk(band,eff,thr,gain,att||5,rel||250));
  byg({fn,add,glob,skab:(fnc,op)=>{const foer=new Set(fase2.objekter.map(o=>o.id));fnc();if(op)skabHnd(op,foer)}});d={v:2,maps:kl(maps),master:1,objekter:kl(fase2.objekter)}}
 finally{maps=gm;fase2.objekter=go;selO=gs;selL=gl;set.skabHnd=gh;try{syncTargets();syncHandles();renderMaps();formUI();persistObj();save()}catch(e){}$('status').textContent=gt}return d}
const basisKlods=()=>DEFAULT.filter(m=>/^klods/.test(m.effect)).map(m=>({...m}));
function lavPigeShow(){return lavIsoleret(({fn,add,glob,skab})=>{skab(opPiger,'piger');const a=fn('Lyshåret pige'),b=fn('Pige på stangen');
 add(a,'dHop','kick',.4,.5,5,180);add(a,'dSpot','kick',.3,1,5,260);add(b,'dSpot','snare',.3,1,5,260);
 add(a,'dKrop','hnd:sektion',.2,1,20,1500);add(a,'dHop','hnd:drop',.2,1.2,5,450);add(b,'dHop','hnd:drop',.2,1.2,5,450);
 add(a,'glod','ana:pan',.55,1,30,300,true);add(b,'glod','ana:pan',.55,1,30,300);glob('burst','hnd:drop',.2,1,5,600);glob('zoom','hnd:drop',.2,.8,5,600)})}
function lavDanserShow(){return lavIsoleret(({glob,skab})=>{skab(opDanser,'danser');glob('puls','hnd:takt4',.2,.7,5,350);glob('burst','hnd:sektion',.2,1,5,600);glob('zoom','hnd:drop',.2,.8,5,600)})}
function lavStjerneDans(){return lavIsoleret(({add,skab})=>{skab(addMorgenstjerne,null);const o=nyMorgenstjerne();o.id=nyId();o.navn='Stjernering';o.pos={x:.5,y:.5};o.pos0={x:.5,y:.5};const e=o.lag[0].egenskaber,st=(p,f,t)=>{if(e[p])e[p]={fra:f,til:t}};
 if(e.storrelse)st('storrelse',e.storrelse.fra*.4,e.storrelse.til*.4);st('kopier',6,6);st('kopiRadius',.3,.3);st('kopiDrej',0,1.6);st('glod',0,.9);st('farveH',200,330);fase2.objekter.push(o);
 add(o,'kopiDrej','hnd:takt4',.2,1,20,700);add(o,'glod','hnd:takt',.2,1,5,220);add(o,'farveH','hnd:akkordrod',0,1,40,600)})}
FORINDST.push(
 {id:'piger_show',grp:'Figur-shows',navn:'Pigernes show',tekst:'De to piger og discokuglen danser en duet. I versene skiftes de: kick giver den lyshårede pige hop og spotlys, snare giver pigen på stangen spotlys. Ved et sektionsskift (omkvæd) læner de sig begge, ved et drop hopper de samtidig med lysudbrud og zoom, og discokuglen glimter på slaget og skifter farve efter akkorden. Med en lydfil i stereo lyser den venstre pige, når lyden kommer fra venstre, og den højre fra højre. Taktslag, sektionsskift og stereo kræver en analyseret lydfil.',lav:lavPigeShow},
 {id:'danser_show',grp:'Figur-shows',navn:'Danserens solo',tekst:'Danseren på sit dansegulv: hun skifter side på hvert taktslag, hopper ved et drop, spotlyset slår på hver takt, og gulvet skifter farve efter akkorden. Lys-puls på hver takt, lysudbrud ved hvert sektionsskift og zoom ved et drop.',lav:lavDanserShow},
 {id:'ms_show',grp:'Figur-shows',navn:'Morgenstjernens dans',tekst:'Morgenstjernen med sine seks forbindelser, præcis som du kender den, og omkring den en ring af seks små stjerner, der drejer ét skridt på hver takt, gløder på taktslaget og skifter farve efter akkorden.',lav:lavStjerneDans});
/* ========== SLUT: NYE FORUDINDSTILLINGER ========== */

/* ========== v6.6: DISKODRONNINGERNE ==========
   To dansere i luksus-festtøj og en guldkugle. Guldpigen: kort guldkjole med pailletter (tekstur Prikker), guldbælte og guldsko, mørke krøller. Diamantpigen: lang sølv- og diamantkjole med glimmer (tekstur Støj), isblåt bælte, sølvsko, platinblond bob. Begge med store ørenringe og høje hæle. Kjolerne glimter på hihat (glød), og glimmeret bevæger sig med flux (teksturens vinkel). */
const DRONNING_GULD={storrelse:.155,farveH:44,farveS:92,farveL:52,glod:.25,dTojStil:1,dKjoleVidde:.5,dTop2H:45,dTop2S:90,dTop2L:72,dBaelte:1,dSkoH:45,dSkoL:58,dHaelhoej:1,dErme:0,dHaarStil:4,dHaarH:25,dHaarS:60,dHaarL:22,dHaarLaengde:1.3,dPandehaar:.2,dHudH:28,dHudS:45,dHudL:62,dMakeup:1,dLaebeH:355,dOejeH:30,dBlush:.4,dOerering:1,dGlaede:.85,dSlank:.75,dTalje:.7,dArmV:.45,dArmH:.35,dHofte:.55,dHoved:.5,dHaar:.7,dKjole:.7,dKnae:.12,dKrop:.3,dSvaj:.45,dGulv:1,dGulvH:45,dGulvS:70,dGulvL:20,dSpot:.5,teksturStyrke:.35,teksturSkala:.07};
const DRONNING_DIAMANT={storrelse:.155,farveH:200,farveS:18,farveL:86,glod:.3,dTojStil:2,dKjoleVidde:.35,dTop2H:195,dTop2S:60,dTop2L:82,dBaelte:.6,dSkoH:200,dSkoL:86,dHaelhoej:1,dErme:0,dHaarStil:3,dHaarH:50,dHaarS:15,dHaarL:88,dHaarLaengde:.9,dPandehaar:.6,dHudH:22,dHudS:40,dHudL:80,dMakeup:1,dLaebeH:330,dOejeH:190,dBlush:.45,dOerering:1,dGlaede:.8,dSlank:.7,dTalje:.65,dArmV:.35,dArmH:.5,dHofte:.5,dHoved:.5,dHaar:.6,dKjole:.75,dKnae:.1,dKrop:.35,dSvaj:.45,dGulv:1,dGulvH:200,dGulvS:40,dGulvL:22,dSpot:.5,teksturStyrke:.45,teksturSkala:.05};
function opDronninger(){if(fase2.objekter.length+3>MAXO){msg('Diskodronningerne: der er ikke plads til tre figurer mere (højst '+MAXO+'). Slet nogle figurer først.');return}
 const sat=(o,P,tek)=>{const e=o.lag[0].egenskaber;Object.keys(P).forEach(p=>{if(e[p])e[p]={fra:P[p],til:P[p]}});o.lag[0].tekstur=tek};
 const k=nyFigurHer('Guldkugle',.5,.15,'discokugle'),a=nyFigurHer('Guldpigen',.3,.6,'danser'),b=nyFigurHer('Diamantpigen',.7,.6,'danser');sat(a,DRONNING_GULD,'prikker');sat(b,DRONNING_DIAMANT,'stoej');
 {const e=k.lag[0].egenskaber;if(e.kFarveH)e.kFarveH={fra:45,til:45}}
 danserStandard(a,0);[['dHofte',null,1],['dHaar',null,1],['dKjole',null,1],['dGlaede',null,1],['dArmH',null,1],['dHop','snare',.4]].forEach(([p,bd,g])=>danserKobl(b,0,p,bd,g));diskoKobl(k,0);
 [[a,'glod','hihat',.3,.9,5,140],[b,'glod','hihat',.3,.9,5,140],[a,'teksturVinkel','flux',.15,1,20,300],[b,'teksturVinkel','flux',.15,1,20,300]].forEach(([o,p,bd,thr,g,at,rl])=>{const li=o.lag.findIndex(l=>uiProps(l.form).includes(p));if(li<0)return;if(p==='teksturVinkel'){const e=o.lag[li].egenskaber;if(e.teksturVinkel)e.teksturVinkel={fra:-30,til:60}}if(p==='glod'){const e=o.lag[li].egenskaber;if(e.glod)e.glod={fra:e.glod.fra,til:.95}}Regler.tilfoej(mk(bd,tidOf(o,li,p),thr,g,at,rl),true)});
 selO=fase2.objekter.length-1;selL=0;syncTargets();renderMaps();formUI();persistObj();save();msg('Diskodronningerne: Guldpigen og Diamantpigen i luksus-festtøj under en guldkugle. Kjolerne glimter på hihat, og glimmeret bevæger sig med musikken.')}
setTimeout(()=>{SKAB_HND.dronninger=[['Guldpigen','dAlterner','hnd:takt',.2,1,5,200],['Diamantpigen','dHaar','hnd:takt2',.2,1,5,250],['Guldpigen','dKrop','hnd:sektion',.2,1,20,1500],['Diamantpigen','dKrop','hnd:sektion',.2,1,20,1500],['Guldpigen','dHop','hnd:drop',.2,1.2,5,450],['Diamantpigen','dHop','hnd:drop',.2,1.2,5,450],['Guldkugle','kGlimt','hnd:takt',.2,1,5,150],['Guldkugle','kIntensitet','hnd:drop',.2,1,5,900],['','burst','hnd:drop',.2,1,5,600]];},0);/* SKAB_HND oprettes længere nede */
function lavDronningShow(){return lavIsoleret(({fn,add,glob,skab})=>{skab(opDronninger,'dronninger');const a=fn('Guldpigen'),b=fn('Diamantpigen');add(a,'dSpot','kick',.3,1,5,260);add(b,'dSpot','snare',.3,1,5,260);add(a,'glod','ana:pan',.55,1,30,300,true);add(b,'glod','ana:pan',.55,1,30,300);glob('zoom','hnd:drop',.2,.8,5,600)})}
FORINDST.push({id:'dronning_show',grp:'Figur-shows',navn:'Diskodronningerne',tekst:'Guldpigen og Diamantpigen i luksus-festtøj (guld, diamanter og glimmer) danser en duet under en guldkugle. I versene skiftes de på kick og snare med spotlys, kjolerne glimter på hihat, og glimmeret bevæger sig med musikken. Ved et omkvæd læner de sig begge, ved et drop hopper de samtidig med lysudbrud og zoom, og kuglen glimter på taktslaget. Med en stereo-lydfil lyser den pige, lyden kommer fra.',lav:lavDronningShow});
/* ===== v7.6: SINGLEN: GULD OG DIAMANT =====
   Et rent show til ét nummer med Guldpigen og Diamantpigen under guldkuglen. Ingen ekko, halespor, kopier, levende kopier, strobe eller ryst, så pigerne står skarpt. Koreografi: de træder til hver sin side på hvert taktslag som spejlbilleder (Diamantpigens side er vendt), hofter på bassen, hår på hihat, kjole på mellemtonen, arme på vokalen (hver sin arm), spotlys skiftevis på kick og snare, et let hop på kick og et stort fælles hop på drop, de læner sig ved sektionsskift (omkvæd), glæden følger lydstyrken, og kjolerne glimter på hihat. Gulvet, baggrunden og kuglen skifter farve med akkorden; kuglen glimter på taktslaget; et blødt lyspuls hver takt og et lysudbrud og zoom på drop. */
function lavSinglen(){return lavIsoleret(({fn,add,glob,skab})=>{skab(opDronninger,null);maps.length=0;const a=fn('Guldpigen'),b=fn('Diamantpigen'),k=fn('Guldkugle');
 [[a,false],[b,true]].forEach(([o,spejl])=>{add(o,'dAlterner','hnd:takt',.2,1,5,200,spejl);add(o,'dHofte','bas',.15,1,40,260);add(o,'dHaar','hihat',.25,1,10,200);add(o,'dKjole','mid',.15,1,30,300);add(o,'dGlaede','rms',.1,1,80,600);add(o,'dHop','kick',.4,.35,5,180);add(o,'dHop','hnd:drop',.2,1.2,5,450);add(o,'dKrop','hnd:sektion',.2,1,20,1500);add(o,'glod','hihat',.3,.9,5,140);add(o,'dGulvH','hnd:akkordrod',0,1,60,600);add(o,'teksturVinkel','flux',.15,1,20,300)});
 add(a,'dArmH','vokal',.2,1,40,400);add(b,'dArmV','vokal',.2,1,40,400);add(a,'dSpot','kick',.3,1,5,260);add(b,'dSpot','snare',.3,1,5,260);
 add(k,'kGlimt','hnd:takt',.2,1,5,150);add(k,'kFarveH','hnd:akkordrod',0,1,60,600);add(k,'kIntensitet','rms',.1,1,60,500);
 glob('farve','hnd:akkordrod',0,.8,200,1500);glob('puls','hnd:takt4',.2,.25,5,300);glob('glod','vokal',.2,.4,60,500);glob('burst','hnd:drop',.2,1,5,600);glob('zoom','hnd:drop',.2,.6,5,600)})}
FORINDST.push({id:'singlen',grp:'Figur-shows',navn:'Singlen: Guld og Diamant',tekst:'Et rent show til ét nummer med Guldpigen og Diamantpigen under guldkuglen, uden ekko, kopier, halespor, strobe og ryst, så pigerne står skarpt. De træder til hver sin side på hvert taktslag som spejlbilleder, bevæger hofterne på bassen, håret på hihat og armene på vokalen, og skiftes om spotlyset på kick og snare. Ved omkvædet (sektionsskift) læner de sig, ved et drop hopper de sammen med lysudbrud og zoom. Kjolerne glimter på hihat, og gulv, baggrund og kugle skifter farve med akkorden. Taktslag, sektionsskift, drop og akkorder virker bedst med en analyseret lydfil.',lav:lavSinglen});
/* ========== SLUT: DISKODRONNINGERNE ========== */


/* ========== v5.7: 11 NYE FORUDINDSTILLINGER ==========
   Efter musikken: Techno, Hip-hop, Ballade, Rock, Klaver og klassisk, Drømmende. Spil selv: Tast og MIDI, Morph Pad som instrument, Klaverspil. Lær: Se lyden, Bas mod diskant.
   Figurer laves med nyFig (én form, faste egenskaber som fra og til) og levende figurer med livKopi. */
const NYFIG_IDS=new Set();function nyFigId(){let id=nyId(),n=parseInt(String(id).replace(/\D/g,''),10)||0;while(NYFIG_IDS.has(id)||fase2.objekter.some(x=>x.id===id))id='o'+(++n);NYFIG_IDS.add(id);return id}/* figurer i samme opsætning laves, før de lægges ind, så de skal have hver sit id */
function nyFig(navn,x,y,form,ege,liv){const o=nyObjekt(nyFigId(),navn);o.pos={x,y};o.pos0={x,y};o.synlig=true;const e=nyEgenskaber(form);Object.keys(ege||{}).forEach(k=>{if(!e[k])return;const v=ege[k];e[k]=Array.isArray(v)?{fra:v[0],til:v[1]}:{fra:v,til:v}});o.lag=[{form,egenskaber:e}];if(liv)o.liv=livKopi(liv);return o}
const fk=(o,p,band,thr,gain,att,rel,inv)=>{const m=mk(band,tidOf(o,0,p),thr,gain,att||10,rel||220);if(inv)m.inv=true;return m};
function lavSpilSelv(){const a=nyFig('Tast-figur',.35,.5,'stjerne',{storrelse:.06,farveH:45,farveS:85,farveL:60,glod:[.4,1]},{til:true,fodtAf:'tast',fodtOpt:{tast:'b'},maks:16,aktiv:900,decay:700,plac:{x:'tilf',y:'tilf',z:'fast'}}),b=nyFig('MIDI-figur',.65,.5,'cirkel',{storrelse:.04,farveS:75,farveL:62,glod:[.3,.9]},{til:true,fodtAf:'midi',toneFarve:true,maks:24,aktiv:1200,decay:900,plac:{x:'toneklasse',y:'tonehoejde',z:'fast'}});
 return{v:2,master:1,objekter:[a,b],maps:[mk('hnd:tast','burst',.2,1,5,500),mk('hnd:tast','ring',.2,.8,5,500),mk('hnd:midi','glod',.2,.8,5,300),mk('hnd:midinote','farve',0,1,40,600)]}}
function lavKlaverspil(){const o=nyFig('Tangent',.5,.5,'rektangel',{storrelse:.035,bredde:.6,hojde:2.2,afrunding:.3,farveS:70,farveL:64,glod:[.5,1]},{til:true,fodtAf:'midi',toneFarve:true,maks:32,aktiv:1600,decay:1200,plac:{x:'toneklasse',y:'tonehoejde',z:'fast'}});
 return{v:2,master:1,objekter:[o],maps:[mk('hnd:midinote','farve',0,1,40,800),mk('hnd:midi','relation',.2,.8,5,500),mk('hnd:midi','hale',.2,.8,5,500)]}}
FORINDST.push(
 {id:'spilselv',grp:'Spil selv',navn:'Tast og MIDI',tekst:'Du spiller selv: tasten B føder gule stjerner et tilfældigt sted med lysudbrud og chokbølge, og hver tangent på et MIDI-keyboard føder en cirkel på tonens plads i tonens farve. Baggrundsfarven følger den sidste MIDI-tone. Tilslut MIDI i Værksted (Chrome og Edge).',lav:lavSpilSelv},
 {id:'klaverspil',grp:'Spil selv',navn:'Klaverspil',tekst:'Til et MIDI-keyboard: hver tangent føder en lysende tangent på sin plads (toneklasse vandret, tonehøjde lodret) i tonens farve, med relationslinjer og halespor. Baggrundsfarven følger den sidste tone. Tilslut MIDI i Værksted (Chrome og Edge).',lav:lavKlaverspil});
/* ========== SLUT: 11 NYE FORUDINDSTILLINGER ========== */

function brugFor(id){const f=FORINDST.find(x=>x.id===id)||OPS_TEST[id];if(!f)return;
 if(f.auto){if(!F){msg(f.navn+' kræver en analyseret sang: vælg en lydfil, eller send generatorens mønster til editoren. Intet er ændret.');return}
  autoSetup(f.auto);active='f:'+f.id;meshSnap=snapStr();meshUI();msg(f.navn+' er indlæst efter den analyserede sang. '+$('gmsg').textContent);return}
 anvend(f.lav(),f.aktiv||'f:'+f.id,f.navn+' er indlæst.',true)}
/* ---- Panelet ---- */
function opsByg(){const el=$('opsui');if(!el)return;const grp=[];FORINDST.filter(f=>!f.skjult).forEach(f=>{let g=grp.find(x=>x.n===f.grp);if(!g){g={n:f.grp,l:[]};grp.push(g)}g.l.push(f)});
 el.innerHTML=`<p class="small" id="ops-aktiv"></p>
 <div class="ab"><label class="small">Opsætning (${FORINDST.filter(f=>!f.skjult).length}) <select id="ops-for">${grp.map(g=>`<optgroup label="${esc(g.n)}">${g.l.map(f=>`<option value="${f.id}">${esc(f.navn)}</option>`).join('')}</optgroup>`).join('')}</select></label><button id="ops-brug">Brug</button></div>
 <p class="small" id="ops-tekst"></p>
 
 <p class="small" id="ops-bib">Dine egne shows ligger i <b>Biblioteket</b> (3 · Regler) under Mine, som en liste uden loft. <button class="ghost" id="ops-bib-knap">Åbn Biblioteket</button></p><div id="ops-pladser" hidden><h3 style="font-size:13px;margin:12px 0 4px">Mine opsætninger (20 pladser)</h3>
 <div class="opsgrid" id="ops-grid">${SLOTS.map(n=>`<button class="ghost" data-slot="${n}"><b>${slotNr(n)}</b><small data-st></small></button>`).join('')}</div>
 <div class="ab"><label class="small">Navn <input id="ops-navn" maxlength="20" style="width:140px" aria-label="Navn til den valgte plads"></label><button id="ops-gem">Gem her</button><button class="ghost" id="ops-hent">Hent</button><button class="ghost" id="ops-slet">Slet</button><button class="ghost" id="ops-laas">Lås</button></div></div>
 <p class="small" id="ops-info"></p><div class="ab"><button id="ops-nulvis" class="ghost" title="Sæt bane, klods, figurer og lyd tilbage til standard (som v1). Dine forbindelser bliver også sat til Standard. Dine gemte opsætninger A til T røres ikke.">Nulstil bane, klods, figurer og lyd</button></div><div class="ab"><b>Sikkerhedskopi på computeren</b> <button class="ghost" id="ops-eks-alle" title="Gem alle dine opsætninger (A til T) i én fil på computeren, plus en tekstfil med et overblik over hver enkelt.">Gem alle på computer</button><button class="ghost" id="ops-eks-en" title="Gem kun den valgte plads på computeren, plus et overblik i tekst.">Gem valgte på computer</button><button class="ghost" id="ops-ind" title="Hent opsætninger fra en fil, du har gemt før. Du bliver spurgt to gange, hvis noget bliver overskrevet.">Indlæs fra computer</button><input type="file" id="ops-ind-fil" accept=".json,application/json" hidden></div><div class="ab"><b>Hele arbejdet i én fil</b> <button id="ops-alt-gem" title="Gem ALT, der ligger i browseren, i én fil: Mine shows i Biblioteket, Opsætning 1–20, det åbne arbejde, indstillinger, docking, Node-editorens pladser, lys i Mesh 3D og Øjet, generatorens sange, EQ+ og Radial Mesh. Analysens cache er ikke med (den regnes igen).">Gem hele arbejdet</button><button class="ghost" id="ops-alt-hent" title="Hent en fil, du har gemt med Gem hele arbejdet. Alt i browseren erstattes (du bliver spurgt to gange), og programmet starter forfra.">Hent hele arbejdet</button><input type="file" id="ops-alt-fil" accept=".json,application/json" hidden></div><p class="small">Gem jævnligt på computeren: browserens lager kan blive tømt (fx når man rydder historik), men filen bliver liggende. Tekstfilen viser, hvad hver opsætning indeholder, så du kan finde den rigtige igen.</p>`;opsBygget=true;
 const d=slotRead(opsSel);$('ops-navn').value=(d&&d.navn)||''}
function opsOpdat(){opsSelByg();if(!opsBygget)return;const dirty=active!==null&&snapStr()!==meshSnap;
 $('ops-aktiv').textContent=active===null?'Aktiv: ingen valgt (dine egne ændringer).':'Aktiv: '+navnAktiv(active)+(dirty?' (ændret siden hentning)':'')+'.';
 const f=FORINDST.find(x=>x.id===$('ops-for').value);$('ops-tekst').textContent=f?f.tekst:'';
 document.querySelectorAll('#ops-grid [data-slot]').forEach(b=>{const n=b.dataset.slot,d=slotRead(n);b.classList.toggle('on',active===n);b.style.outline=n===opsSel?'2px solid var(--acc)':'none';b.querySelector('[data-st]').textContent=d?((d.laast?'låst ':'')+(d.navn?d.navn.slice(0,7):'gemt')):'tom';b.title='Opsætning '+slotNr(n)+': '+(d?(d.navn||'gemt')+(d.laast?', låst':''):'tom')});
 const d=slotRead(opsSel);$('ops-gem').disabled=!!(d&&d.laast);$('ops-hent').disabled=!d;$('ops-slet').disabled=!d;$('ops-laas').disabled=!d;$('ops-laas').textContent=d&&d.laast?'Lås op':'Lås';
 $('ops-info').textContent=!d?'Opsætning '+slotNr(opsSel)+' er tom. Skriv evt. et navn, og tryk Gem her.':'Opsætning '+slotNr(opsSel)+(d.navn?' ('+d.navn+')':'')+(d.laast?': LÅST. Den kan ikke overskrives eller slettes, før den låses op med koden.':': gemt. Lås den, hvis den er vigtig og har taget lang tid at sætte op.')}
$('opsui').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
 if(t.dataset.slot){opsSel=t.dataset.slot;const d=slotRead(opsSel);$('ops-navn').value=(d&&d.navn)||'';opsOpdat();return}
 if(t.id==='ops-brug')brugFor($('ops-for').value);
 else if(t.id==='ops-gem')gem(opsSel,$('ops-navn').value.trim());
 else if(t.id==='ops-hent')slotLoad(opsSel);
 else if(t.id==='ops-slet')slotSlet(opsSel);
 else if(t.id==='ops-laas'){slotLaast(opsSel)?slotLaasOp(opsSel):slotLaas(opsSel)} else if(t.id==='ops-nulvis'){(async()=>{const r=await spoerg({titel:'Nulstil bane, klods, figurer og lyd?',tekst:'Bane, klods, figurer og lyd sættes tilbage til standard, og forbindelserne til Standard. Dine gemte opsætninger A til T røres ikke. Gem gerne det, du har, i en plads først.',ok:'Ja, nulstil',fare:true});if(r.ok)anvend(opsNulstilVisuelt(),null,'Bane, klods, figurer og lyd er sat tilbage til standard, og reglerne til Standard.',true);else msg('Intet er nulstillet.')})()} else if(t.id==='ops-eks-alle')opsEksport(SLOTS); else if(t.id==='ops-eks-en')opsEksport([opsSel]); else if(t.id==='ops-ind')$('ops-ind-fil').click()});
$('opsui').addEventListener('change',e=>{if(e.target.id==='ops-ind-fil'){const f=e.target.files&&e.target.files[0];e.target.value='';if(f)opsImport(f)}});
$('opsui').addEventListener('change',e=>{if(e.target.id==='ops-for')opsOpdat()});
/* Listen i spindelvævets værktøjslinje: de 11 opsætninger og de 20 egne pladser er altid her, uden at man skal rulle til et panel. */
function opsSelByg(){const a=$('mb-ops-sel'),b=$('mb-mine-sel');if(!a||!b)return;
 const sl=SLOTS.map(n=>{const d=slotRead(n);return{n,navn:d?(d.navn||'gemt'):'tom',laast:!!(d&&d.laast)}}),sig=JSON.stringify(sl)+active;
 if(a.dataset.sig===sig)return;a.dataset.sig=sig;b.dataset.sig=sig;
 a.innerHTML='<option value="">Vælg en opsætning …</option>'+FORINDST.filter(f=>!f.skjult).map(f=>`<option value="${f.id}">${esc(f.navn)}${active==='f:'+f.id||(f.id==='std'&&active==='std')?' (aktiv)':''}</option>`).join('');a.value='';
 b.innerHTML='<option value="">Vælg en af mine opsætninger …</option>'+sl.map(x=>`<option value="${x.n}">${x.n}: ${esc(x.navn)}${x.laast?' (låst)':''}${active===x.n?' (aktiv)':''}</option>`).join('');b.value=''}
$('mb-ops-sel').addEventListener('change',e=>{const v=e.target.value;e.target.value='';if(v)brugFor(v)});
$('mb-mine-sel').addEventListener('change',e=>{const n=e.target.value;e.target.value='';if(!n)return;if(!slotRead(n))msg('Opsætning '+slotNr(n)+' er tom: der er endnu ikke gemt noget der. Gem en opsætning i den under Opsætninger (Gem her), eller med Gem nuværende som.');else slotLoad(n)});
/* ========== SLUT: OPSÆTNINGER OG SIKKERHED ========== */

