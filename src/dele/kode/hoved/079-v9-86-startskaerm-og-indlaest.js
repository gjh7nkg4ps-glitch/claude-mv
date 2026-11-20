/* ========== v9.86: STARTSKÆRM OG INDLÆST ==========
   Brugerens B2 (P8.6): programmet husker som før det sidste arbejde og arbejdsområde. Ved start vises en startskærm (#start-sk) med tre valg:
   Fortsæt, hvor du slap (fremhævet) · Start et show (de 10 i FORINDST og Mine i Opsætning 1–20; Biblioteket kommer i B3) · Byg selv (helt tomt).
   Linjen øverst viser altid, hvad der er indlæst (#el9-indl, indlTekst): navnet fra active (navnAktiv), antal figurer på scenen og regler, "Tomt",
   og "· ændret", når et show fra Mine (Opsætning 1–20) er ændret uden at være gemt (snapStr()!==meshSnap). Kun da spørger browseren før lukning
   (beforeunload). I testbrowseren (navigator.webdriver) vises startskærmen kun, når set.startSkTest er sat, så de 80 test ikke skal ændres. */
function indlTekst(){const fig=fase2.objekter.filter(o=>o.synlig!==false).length,regler=maps.length,a=active;
 let navn='';if(a!==null&&a!==undefined){try{navn=navnAktiv(a)}catch(e){navn=String(a)}}
 const mine=(typeof SLOTS!=='undefined'&&SLOTS.includes(a))||/^m:/.test(String(a)),aendret=!!(mine&&snapStr()!==meshSnap);
 const tom=!fig&&!regler;const tal=fig+(fig===1?' figur':' figurer')+' · '+regler+(regler===1?' regel':' regler');
 return{navn,fig,regler,mine,aendret,tom,tekst:tom?'Tomt':(navn||'eget arbejde')+' · '+tal+(aendret?' · ændret':'')}}
const INDL={sidst:''};
function indlUI(){const el=$('el9-indl');if(!el)return;let t;try{t=indlTekst()}catch(e){return}const s='Indlæst: '+t.tekst;if(s!==INDL.sidst){INDL.sidst=s;el.textContent=s;el.classList.toggle('indl-aendret',t.aendret);el.classList.toggle('indl-tom',t.tom);el.title=t.tom?'Intet er indlæst: ingen figurer på scenen og ingen regler.':(t.navn?t.navn:'Eget arbejde, ikke gemt som et show')+' · '+t.fig+' figurer på scenen · '+t.regler+' regler'+(t.aendret?' · ændret siden du hentede det (gem med 💾 Gem, hvis du vil beholde det)':'')}}
function indlStart(){indlUI();setInterval(indlUI,500);window.addEventListener('beforeunload',e=>{let a=false;try{a=!(typeof ALT!=='undefined'&&ALT.genstarter)&&indlTekst().aendret}catch(x){}if(a){e.preventDefault();e.returnValue=''}})}
function bygSelv(){anvend({maps:[],objekter:[Object.assign(nyObjekt(),{synlig:false})],master:1,pos:kl(POS0)},null,'Tomt: ingen figurer og ingen regler. Læg figurer på i 2 · Scene, og lav regler i 3 · Regler.',true);try{if(scene.bane!==false){scene.bane=false;persistScene();baneUI();sceneUI()}}catch(e){}active=null;meshSnap=snapStr();try{meshUI()}catch(e){}indlUI()}
function startSkListe(){const L=[];FORINDST.filter(f=>!f.skjult).forEach(f=>L.push({k:'f:'+f.id,navn:f.navn,grp:f.grp,tekst:f.tekst||''}));
 BIB.mine.forEach(x=>{const d=x.data||{};L.push({k:'m:'+x.id,navn:x.navn,grp:'Mine',tekst:(x.gemt?'gemt '+new Date(x.gemt).toLocaleDateString('da-DK'):'')+(d.objekter?' · '+d.objekter.length+' figurer':'')+(d.maps?' · '+d.maps.length+' regler':'')})});
 const grp=[];L.forEach(x=>{let g=grp.find(y=>y.n===x.grp);if(!g){g={n:x.grp,l:[]};grp.push(g)}g.l.push(x)});
 return grp.map(g=>'<h4>'+esc(g.n)+'</h4><div class="start-g">'+g.l.map(x=>'<button class="ghost start-v" data-start="'+esc(x.k)+'" title="'+esc(x.tekst)+'">'+esc(x.navn)+'</button>').join('')+'</div>').join('')}
function startSkVis(altid){const d=$('start-sk');if(!d||d.open)return;if(!altid&&navigator.webdriver&&!(set&&set.startSkTest))return;
 let t=null;try{t=indlTekst()}catch(e){}const li=$('start-liste');li.hidden=true;li.innerHTML='';$('start-valg')&&0;
 $('start-p').textContent=t&&!t.tom?'Det sidste arbejde er hentet.':'Scenen er tom.';$('start-fortsaet-s').textContent=t?(t.tom?'intet indlæst endnu':t.tekst):'';
 try{d.showModal()}catch(e){d.setAttribute('open','')}try{$('start-fortsaet').focus()}catch(e){}}
function startSkLuk(){const d=$('start-sk');if(d&&d.open)d.close()}
{const d=$('start-sk');if(d){d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.id==='start-fortsaet'){startSkLuk();return}
  if(b.id==='start-byg'){startSkLuk();bygSelv();return}
  if(b.id==='start-show'){startSkLuk();bibVis('shows');return}/* v9.87: Biblioteket */
  const k=b.dataset.start;if(!k)return;startSkLuk();if(k.startsWith('f:'))brugFor(k.slice(2));else if(k.startsWith('m:'))bibHent(k.slice(2));setTimeout(indlUI,50)});
 d.addEventListener('cancel',e=>{e.preventDefault();startSkLuk()})}}
/* ========== SLUT: STARTSKÆRM OG INDLÆST ========== */
