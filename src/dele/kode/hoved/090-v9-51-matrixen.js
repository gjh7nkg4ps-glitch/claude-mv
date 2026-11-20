/* ========== v9.51: MATRIXEN ==========
   Fase 2 i PLAN-NY-BRUGERFLADE.md (P8.2), trin 2a. Matrixen viser alle regler i ét gitter (fagudtryk: modulation matrix):
   rækker = de lydtræk, der er i brug, i mapper efter musik (D2, samme rækkefølge som på lærredet: ne42Sml);
   kolonner = de mål, der er i brug, samlet pr. figur og effekt-gruppe (samme grupper som Node-editorens kolonne Figur).
   En celle med en regel viser styrken (gain) som højden på en søjle og lyser, når reglen slår til (samme regel som regel-nodens lampe).
   Et lille tal = flere regler i cellen; en lille prik = Gate; grå søjle = slået fra.
   Klik vælger reglen med neVaelg, så kontrolpanelet nederst viser den, præcis som ved klik på en regel-node.
   Matrixen bygger på Node-editorens model (NE2.N) og tegnes med almindelig HTML (en tabel), uden three.js.
   v9.52 (trin 2b): klik i en tom celle laver en regel (ne5Ny: samme standard som et nyt link); træk op og ned i en celle ændrer styrken
   (hvert trin rettes gennem Regler; Fortryd samler et træk til ét skridt); Delete sletter (ne5Slet); M slår fra og til; piletasterne flytter
   mellem cellerne og vælger reglen; Enter i en tom celle laver en regel; Shift + pil op og ned ændrer styrken ét trin.
   v9.53 (trin 2c): + lydtræk og + mål åbner en liste med søgning (mxVaelger) og lægger en række eller kolonne til, som ikke har regler endnu
   (set.ne.mxE); klik på en figurs navn folder den sammen til én smal kolonne (set.ne.mxFold); Brugte · Alle (set.ne.mxAlle) viser alle lydtræk
   (r2AlleKilder) og alle mål (TARGETS), hvor figurer uden regler står foldet sammen fra start.
   v9.54: en celle, hvis regel ikke kan ses, fordi egenskabens Fra og Til er ens (neUdenUdsving), har et gult !; et klik giver egenskaben et udsving (mxGivUdsving).
   v9.56 (fase 3, trin 3a: hurtigt arbejde): flere celler kan markeres (MX.mark: Ctrl + klik, Shift + klik, Ctrl+A, Esc); linjen under matrixen (#mx-bj)
   sætter samme styrke eller tærskel på alle markerede regler; Ctrl+C og Ctrl+V kopierer og indsætter (MX.klip). Hos en anden figur lander hver regel
   på den samme egenskab (mxMaalHos); ellers bruges afstanden i rækker og kolonner. Hver samlet handling er ét Regler.samlet og dermed ét Fortryd-skridt.
   v9.57 (trin 3b): træk med Ctrl fra en celle med en regel til en anden celle kopierer reglen dertil (MX.kt, mxKopierTil); Ctrl+Shift+V indsætter kun
   indstillingerne fra den første kopierede regel i de markerede regler (mxIndsaetIndst, MX_INDST), uden at ændre lydtræk og mål.
   v9.58 (trin 3c): knappen ⋯ ved figurens navn åbner en liste (mxFigMenu): kopiér alle figurens regler til en anden figur (mxFigKopier, samme egenskaber
   via mxMaalHos) eller spejl venstre og højre (mxSpejl: parrene i MX_SPEJL bytter regler).
   v9.59 (trin 3d): styrke-kæden i kanten: trim på rækken og figurens styrke på gruppen (mærker, der trækkes op og ned; mxKantStart, mxKantTrin),
   Størst · Sum · Gang på kolonnen (mxKombSkift) og Samlet styrke i hjørnet (i matrixen er værktøjslinjens skyder skjult).
   v9.60: linjen under matrixen står der altid med tydelige knapper (Markér celler: Til/Fra = MX.mm, Markér alle, Kopiér, Indsæt, Indsæt indstillinger,
   Spejl, Slå fra / til, Slet, Ryd markering og Største · Læg sammen · Gang for den valgte regels mål); et træk med Ctrl begynder først uden for cellen.
   Knappen Noder · Matrix i værktøjslinjen skifter; valget huskes i set.ne.mx. */
const MX={N:null,valgt:null,celler:[],raekker:[],kol:[],fig:[],t:0,klar:false,traek:null,slugKlik:0,vaelgLuk:null,mark:new Set(),anker:null,klip:null,bjSig:'',kt:null,mm:false};
function mxTil(){return !!(set.ne&&set.ne.mx)}
/* det, brugeren selv har lagt til eller foldet sammen (huskes) */
function mxInd(){set.ne=set.ne||{};const n=set.ne;n.mxE=n.mxE||{};n.mxE.b=n.mxE.b||[];n.mxE.e=n.mxE.e||[];n.mxFold=n.mxFold||{};if(n.mxKun&&!(fase2.objekter||[]).some(o=>o.id===n.mxKun))n.mxKun='';/* v9.75: Kun én figur (Vis i matrix) */return n}
function mxGem(){try{neGem()}catch(e){}try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}}
const mxKolId=k=>k.fold?'fold:'+k.f.key:k.m.effect;
/* modellen: rækker (lydtræk i mapper), figurer med deres mål (kolonner) og celler (regel-noder pr. lydtræk og mål).
   Brugte: det, der har regler, plus det, brugeren har lagt til. Alle: alle lydtræk og alle mål. */
function mxModel(){const N=NE2.N,I=mxInd(),alle=!!I.mxAlle,ok=n=>n&&n.kol==='regel'&&n.m&&maps[n.i]===n.m,celle={};
 N.forEach(n=>{if(!ok(n))return;const k=n.m.band+'|'+n.m.effect;(celle[k]=celle[k]||[]).push(n)});
 const brugtB=new Set(Object.keys(celle).map(k=>k.split('|')[0])),brugtE=new Set(Object.keys(celle).map(k=>k.slice(k.indexOf('|')+1)));
 const kun=I.mxKun||'';const B=[...brugtB];if(kun)BANDS.forEach(b=>{if(!B.includes(b[0]))B.push(b[0])});/* v9.75: Kun én figur: de 14 lydtræk som rækker */I.mxE.b.forEach(b=>{if(!B.includes(b)&&!fjernetKilde(b))B.push(b)});FS.liste.forEach(f=>{if(!B.includes(f.regel.band)&&!fjernetKilde(f.regel.band))B.push(f.regel.band)});if(alle)r2AlleKilder().forEach(b=>{if(!B.includes(b)&&!fjernetKilde(b))B.push(b)});B.sort((a,b)=>ne42Sml(a,b));
 const raekker=[];let mappe=null;B.forEach(b=>{const mp=sigInfo(b).mappe;if(mp!==mappe){mappe=mp;raekker.push({mappe:mp})}raekker.push({band:b,brugt:brugtB.has(b),ekstra:I.mxE.b.includes(b)})});
 const F=new Map(),findes=new Set(TARGETS.map(t=>t.id));
 const laeg=e=>{const fg=neFigurAf(e);let f=F.get(fg.key);if(!f){f={key:fg.key,navn:fg.navn,gruppe:!!fg.gruppe,maal:[]};F.set(fg.key,f)}if(!f.maal.some(m=>m.effect===e))f.maal.push({effect:e,brugt:brugtE.has(e),ekstra:I.mxE.e.includes(e)})};
 N.forEach(n=>{if(n.kol==='figur'&&n.maal)n.maal.forEach(k=>{const m=N.get(k);if(m&&brugtE.has(m.effect))laeg(m.effect)})});brugtE.forEach(laeg);
 I.mxE.e.forEach(e=>{if(findes.has(e))laeg(e)});FS.liste.forEach(f=>{if(findes.has(f.regel.effect))laeg(f.regel.effect)});if(alle)TARGETS.forEach(t=>laeg(t.id));if(kun)TARGETS.forEach(t=>{if(t.id.startsWith('obj:'+kun+':'))laeg(t.id)});
 let figurer=[...F.values()];if(kun)figurer=figurer.filter(f=>f.key==='f:'+kun);figurer.forEach(f=>{f.regler=f.maal.filter(m=>m.brugt).length;const v=I.mxFold[f.key];f.fold=kun?false:v===undefined?(alle&&!f.regler):!!v});
 return{raekker,figurer,celle,alle,kun}}
function mxByg(){const mx=$('ne-mx');if(!mx)return;const M=mxModel(),h=neHtml,sx=mx.scrollLeft,sy=mx.scrollTop;const fok=mx.contains(document.activeElement)?mxCelleId(document.activeElement):null;MX.N=NE2.N;MX.celler=[];MX.raekker=[];MX.fig=M.figurer;
 const kol=[];MX.kol=kol;M.figurer.forEach(f=>{if(f.fold)kol.push({f,fold:true,foerst:true});else f.maal.forEach((m,j)=>kol.push({f,m,foerst:j===0}))});
 const grp=k=>k.foerst?' mx-foerst'+(k.f.gruppe?' mx-grp':''):'';
 let t='<table role="grid" aria-label="Matrix: lydtræk som rækker, mål som kolonner"><thead><tr><th class="mx-hj" rowspan="2"><span class="mx-vis" role="group" aria-label="Hvad matrixen viser"><button data-mxv="0" aria-pressed="'+!M.alle+'" title="Brugte: de lydtræk og mål, der har regler, og dem, du selv har tilføjet">Brugte</button><button data-mxv="1" aria-pressed="'+M.alle+'" title="Alle: alle lydtræk og alle mål. Figurer uden regler står foldet sammen">Alle</button></span>'+(M.kun?'<span class="mx-kun" title="Matrixen viser kun denne figur (Vis i matrix). × alle viser alle figurer igen">Kun: <b>'+h((M.figurer[0]||{}).navn||M.kun)+'</b> <button data-mxkun="0" aria-label="Vis alle figurer igen">× alle</button></span>':'')+'<span class="mx-pkr"><button class="mx-pk" data-mxp="b" title="Tilføj et lydtræk som en ny række">+ lydtræk</button><button class="mx-pk" data-mxp="e" title="Tilføj et mål som en ny kolonne">+ mål</button></span><label class="mx-ms" title="Samlet styrke (master): ganges på alle regler">Samlet styrke<b>×'+neTal(typeof gmaster!=='undefined'?+gmaster:1)+'</b><input type="range" data-mxms="1" min="0" max="2" step=".05" value="'+(typeof gmaster!=='undefined'?+gmaster:1)+'" aria-label="Samlet styrke"></label><span class="mx-hjt">Lydtræk ↓ · Mål →</span></th>'
  +M.figurer.map(f=>'<th class="mx-fig'+(f.gruppe?' mx-grp':'')+(f.fold?' mx-foldet':'')+'" colspan="'+(f.fold?1:f.maal.length)+'" data-f="'+h(f.key)+'" tabindex="0" role="button" aria-expanded="'+!f.fold+'" title="'+h(f.navn+(f.fold?' · klik for at folde ud ('+f.maal.length+' mål)':' · klik for at folde sammen'))+'" aria-label="'+h(f.navn+(f.fold?', foldet sammen':''))+'">'+(f.fold||f.gruppe?'':'<button class="mx-fm" data-mxfm="'+h(f.key)+'" title="Kopiér reglerne til en anden figur, eller spejl venstre og højre" aria-label="'+h('Regler for '+f.navn+': kopiér eller spejl')+'"></button>')+(f.fold?'':mxKantFs(f))+(f.fold?'▸':'▾ '+h(f.navn)+(f.key==='g:Bane'&&typeof scene!=='undefined'&&scene.bane===false?' · klodsbane fra':''))+'</th>').join('')
  +'</tr><tr>'
  +kol.map(k=>k.fold?'<th class="mx-maal mx-foldet'+grp(k)+'" data-f="'+h(k.f.key)+'" title="'+h(k.f.navn+' · klik for at folde ud')+'"><span>'+h(k.f.navn+' · '+k.f.maal.length+' mål')+'</span></th>'
   :'<th class="mx-maal'+grp(k)+mxPsKl(k.m.effect)+'" title="'+h(k.f.navn+' · '+neMaalNavn(k.m.effect))+'"><span>'+h(neMaalNavn(k.m.effect))+'</span>'+mxKantKo(k.m.effect)+mxPsKant(k.m.effect)+(k.m.ekstra&&!k.m.brugt?'<button class="mx-x" data-mxx="e:'+h(k.m.effect)+'" title="Fjern kolonnen (den har ingen regler)" aria-label="Fjern kolonnen">×</button>':'')+'</th>').join('')+'</tr></thead><tbody>';
 M.raekker.forEach(r=>{if(r.mappe!==undefined){t+='<tr class="mx-mappe"><th>'+h(r.mappe)+'</th><td colspan="'+Math.max(1,kol.length)+'"></td></tr>';return}
  const ty=neLtType(r.band);t+='<tr'+(neLtFra(r.band)?' class="mx-r-fra"':'')+'><th class="mx-lt" data-b="'+h(r.band)+'" style="--mxf:var(--ne-lydtraekType-'+ty+',var(--ne-kolonne-lydtraek))" title="'+h(neLtNavn(r.band))+(neLtFra(r.band)?' · slået fra':'')+'">'+mxLtFraKnap(r.band)+mxKantTrim(r.band)+h(neLtNavn(r.band))+(neLtFra(r.band)?'<small class="mx-fra-m">slået fra</small>':'')+'<u><i></i></u>'+(r.ekstra&&!r.brugt?'<button class="mx-x" data-mxx="b:'+h(r.band)+'" title="Fjern rækken (den har ingen regler)" aria-label="Fjern rækken">×</button>':'')+'</th>'
   +kol.map((k,ki)=>{const L=k.fold?k.f.maal.flatMap(m=>M.celle[r.band+'|'+m.effect]||[]):(M.celle[r.band+'|'+k.m.effect]||[]),kl='mx-c'+grp(k)+(L.length?' mx-har':(k.fold?' mx-lukket':' mx-ledig'));
    const navn=neLtNavn(r.band)+' → '+k.f.navn+(k.fold?'':' · '+neMaalNavn(k.m.effect));
    if(!L.length)return '<td class="'+kl+'" tabindex="-1" role="gridcell" data-k="'+ki+'" title="'+h(k.fold?navn+' · fold figuren ud for at lave en regel her':'Klik for at lave en regel: '+navn)+'" aria-label="'+h('Tom celle: '+navn)+'"></td>';
    const uden=L.find(n=>neUdenUdsving(n.m.effect));
    return '<td class="'+kl+(uden?' mx-intet':'')+'" tabindex="-1" role="gridcell" data-k="'+ki+'" data-r="'+h(L.map(n=>n.key).join('\u0001'))+'" title="'+h(navn+(L.length>1?' ('+L.length+' regler)':'')+' · træk op og ned for at ændre styrken')+'" aria-label="'+h('Regel: '+navn)+'"><i class="mx-s"></i>'+(L.length>1?'<b>'+L.length+'</b>':'')+(L.some(n=>n.m.port)?'<s title="Gate"></s>':'')+(uden?'<button class="mx-adv" data-mxu="'+h(uden.m.effect)+'" title="Reglen flytter ikke noget endnu: egenskabens Fra og Til er ens. Klik for at give den et udsving." aria-label="Giv egenskaben et udsving">!</button>':'')+'</td>'}).join('')+'</tr>'});
 t+='</tbody></table>';
 if(!kol.length&&!M.raekker.length)t+='<p class="mx-tom">Der er ingen regler endnu. Tryk <b>+ lydtræk</b> og <b>+ mål</b>, og klik så i cellen, hvor de mødes. Så har du den første regel.</p>';
 mx.innerHTML=t;mx.scrollLeft=sx;mx.scrollTop=sy;
 mx.querySelectorAll('td.mx-har').forEach(td=>MX.celler.push({td,s:td.querySelector('.mx-s'),noegler:td.dataset.r.split('\u0001'),h:-1,slaar:null,fra:null}));
 mx.querySelectorAll('th.mx-lt').forEach(th=>MX.raekker.push({band:th.dataset.b,i:th.querySelector('u i'),w:-1}));
 MX.valgt=undefined;mxLev(true);if(fok){const td=mxFindCelle(fok);if(td)td.focus({preventScroll:true})}
 mxMarkTegn();
 /* et træk, der er i gang, fortsætter i den nye celle */
 if(MX.traek&&MX.traek.gang){const td=mxFindCelle(MX.traek.id);if(td){MX.traek.td=td;td.classList.add('mx-traekker');mxVisTal(td,MX.traek.g)}}}
/* det, der lever: søjlens højde (styrken), lyset (reglen slår til), grå (slået fra), det valgte og lydtrækkets bjælke */
function mxLev(nu){const N=NE2.N;mxBjaelke();{const s=MX.ms&&MX.ms.isConnected?MX.ms:(MX.ms=document.querySelector('#ne-mx [data-mxms]')),g=typeof gmaster!=='undefined'?+gmaster:1;if(s&&document.activeElement!==s&&+s.value!==g){s.value=g;const b=s.parentNode.querySelector('b');if(b)b.textContent='×'+neTal(g)}}
 MX.celler.forEach(c=>{let g=0,slaar=false,alleFra=true,valgt=false;c.noegler.forEach(k=>{const n=N.get(k);if(!n||!n.m)return;const m=n.m,i=n.i,fra=!!(m.off||m.fjernet);g=Math.max(g,+m.gain||0);if(!fra){alleFra=false;const v=+R2M.v[i]||0,ud=+R2M.ud[i]||0,thr=R2M.thr[i]!=null?+R2M.thr[i]:+m.thr;if((neEgM(m)?ud>.05:(v>=thr&&ud>.05)))slaar=true}if(k===NE2.valgt)valgt=true});
  const hh=Math.round(Math.max(.08,Math.min(1,g/2))*30);if(hh!==c.h){c.h=hh;c.s.style.height=hh+'px'}
  if(slaar!==c.slaar){c.slaar=slaar;c.td.classList.toggle('mx-slaar',slaar)}if(alleFra!==c.fra){c.fra=alleFra;c.td.classList.toggle('mx-fra',alleFra)}
  if(nu||MX.valgt!==NE2.valgt){c.td.classList.toggle('mx-valgt',valgt);if(valgt)c.td.setAttribute('aria-selected','true');else c.td.removeAttribute('aria-selected')}});
 MX.valgt=NE2.valgt;
 MX.raekker.forEach(r=>{let v=0;try{v=+bandV(r.band)||0;if(typeof neTrimV==='function')v=neTrimV(r.band,v)}catch(e){}const w=Math.round(Math.max(0,Math.min(1,v))*100);if(w!==r.w){r.w=w;r.i.style.width=w+'%'}})}
function mxSynlig(){const mx=$('ne-mx');return !!mx&&!mx.hidden&&mx.offsetParent!==null}
function mxTik(t){requestAnimationFrame(mxTik);if(!MX.klar||!mxSynlig()||t-MX.t<50)return;MX.t=t;try{if(MX.N!==NE2.N&&!(MX.nede&&t-MX.nede<3000))mxByg();else mxLev(false)}catch(e){console.error(e)}}
/* skift mellem Noder og Matrix */
function mxSaet(on,stille){const rod=$('ne'),mx=$('ne-mx'),fl=$('ne-flade'),ov=$('ne-vis');set.ne=set.ne||{};set.ne.mx=!!on;try{neGem()}catch(e){}try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}
 if(!rod||!mx||!fl)return;rod.classList.toggle('mx-til',!!on);rod.querySelectorAll('.mx-skift button').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.mx==='1')===!!on)));
 let toast=$('ne-toast');if(!toast){try{neToast('',true)}catch(e){}toast=$('ne-toast')}
 if(on){fl.style.display='none';if(ov)ov.hidden=true;mx.hidden=false;if(toast)mx.appendChild(toast);mxByg();if(!stille)neToast('Matrix: klik i en tom celle laver en regel. Træk op og ned i en celle ændrer styrken. Delete sletter, M slår fra og til.',true)}
 else{mxLukVaelger();const bj=$('mx-bj');if(bj)bj.hidden=true;mx.hidden=true;if(toast)fl.appendChild(toast);fl.style.display='';try{mxGlNe41Vis(ne41Nu(),true)}catch(e){}if(!stille)neToast('Noder',true)}}
let mxGlNe41Vis=null;
/* --- fase 3, trin 3a: markér flere celler, samme værdi på alle, kopiér og indsæt --- */
const mxNoegle=id=>id.b+'\u0001'+id.e;
function mxMarkTegn(){const mx=$('ne-mx');if(!mx)return;mx.querySelectorAll('td.mx-c').forEach(td=>{const id=mxCelleId(td),paa=!!id&&!id.fold&&MX.mark.has(mxNoegle(id));td.classList.toggle('mx-mark',paa);if(paa)td.setAttribute('aria-selected','true');else if(!td.classList.contains('mx-valgt'))td.removeAttribute('aria-selected')});mxBjaelke()}
function mxMarkRyd(){if(MX.mark.size){MX.mark.clear();mxMarkTegn()}}
function mxMarkSkift(td){const id=mxCelleId(td);if(!id||id.fold)return;const k=mxNoegle(id);if(MX.mark.has(k))MX.mark.delete(k);else MX.mark.add(k);MX.anker=id;mxMarkTegn()}
/* Shift + klik: hele firkanten fra den celle, der sidst blev klikket på */
function mxMarkOmraade(td){const id=mxCelleId(td),a=MX.anker;if(!id||id.fold)return;if(!a){mxMarkSkift(td);return}const B=MX.raekker.map(r=>r.band),r0=B.indexOf(a.b),r1=B.indexOf(id.b),k0=MX.kol.findIndex(k=>mxKolId(k)===a.e),k1=+td.dataset.k;if(r0<0||r1<0||k0<0){mxMarkSkift(td);return}
 for(let r=Math.min(r0,r1);r<=Math.max(r0,r1);r++)for(let k=Math.min(k0,k1);k<=Math.max(k0,k1);k++){const K=MX.kol[k];if(K&&!K.fold)MX.mark.add(B[r]+'\u0001'+K.m.effect)}mxMarkTegn()}
/* reglerne i de markerede celler; er intet markeret, reglen i den celle, der arbejdes i */
function mxMarkRegler(td){const ud=[];if(MX.mark.size){MX.mark.forEach(k=>{const[b,e]=k.split('\u0001');maps.forEach((m,i)=>{if(m.band===b&&m.effect===e)ud.push({i,m,b,e})})})}else if(td){const R=mxRegelI(td);if(R)ud.push({i:R.n.i,m:R.n.m,b:R.n.m.band,e:R.n.m.effect})}return ud}
function mxMarkAlle(){MX.mark.clear();MX.celler.forEach(c=>{const id=mxCelleId(c.td);if(id&&!id.fold)MX.mark.add(mxNoegle(id))});mxMarkTegn();if(!MX.mark.size)neToast('Der er ingen regler at markere.',true)}
function mxBjaelke(){const bj=$('mx-bj');if(!bj)return;if(!mxTil()){bj.hidden=true;MX.bjSig='';return}
 const vn=NE2.valgt&&NE2.N?NE2.N.get(NE2.valgt):null,ve=vn&&vn.m?vn.m.effect:null,vk=ve?neKombFor(ve):'';
 const sig=[...MX.mark].sort().join('|')+'#'+maps.length+'#'+(MX.klip?MX.klip.length:0)+'#'+MX.mm+'#'+(ve||'')+'#'+vk;bj.hidden=false;if(sig===MX.bjSig)return;MX.bjSig=sig;
 const R=mxMarkRegler(),har=R.length>0,g=har?+R[0].m.gain||0:1,th=har?+R[0].m.thr||0:.3,gr=x=>x?'':' disabled';
 bj.innerHTML='<button class="ne-k'+(MX.mm?' ne-paa':'')+'" data-mxb="mm" aria-pressed="'+MX.mm+'" title="Til: et almindeligt klik markerer cellen (det samme som Ctrl + klik). Fra: et klik vælger reglen eller laver en ny.">Markér celler: '+(MX.mm?'Til':'Fra')+'</button>'
  +'<button class="ne-k" data-mxb="alle" title="Markér alle celler med regler (Ctrl+A)">Markér alle</button>'
  +'<b>'+(MX.mark.size?MX.mark.size+(MX.mark.size===1?' celle':' celler')+' markeret':'Ingen celler markeret')+'</b>'+(MX.mark.size?'<span>'+R.length+(R.length===1?' regel':' regler')+'</span>':'')
  +(har?'<label title="Sæt samme styrke på alle de markerede regler">Styrke <input type="range" data-mxb="gain" min="0" max="2" step="0.05" value="'+g+'" aria-label="Styrke for de markerede regler"> <b data-mxbv="gain">×'+neTal(g)+'</b></label><label title="Sæt samme tærskel på alle de markerede regler">Tærskel <input type="range" data-mxb="thr" min="0" max="1" step="0.01" value="'+th+'" aria-label="Tærskel for de markerede regler"> <b data-mxbv="thr">'+neTal(th)+'</b></label>':'')
  +'<button class="ne-k" data-mxb="kopier"'+gr(har)+' title="Kopiér de markerede regler (Ctrl+C)">Kopiér</button>'
  +'<button class="ne-k" data-mxb="indsaet"'+gr(MX.klip&&MX.anker)+' title="Indsæt de kopierede regler med start i den celle, du sidst klikkede på (Ctrl+V)">Indsæt</button>'
  +'<button class="ne-k" data-mxb="indst"'+gr(MX.klip&&har)+' title="Giv de markerede regler samme indstillinger som den kopierede regel. Lydtræk og mål ændres ikke (Ctrl+Shift+V)">Indsæt indstillinger</button>'
  +'<button class="ne-k" data-mxb="spejl"'+gr(R.some(x=>mxSpejlAf(x.m.effect)))+' title="De markerede regler på Arm til venstre og Arm til højre bytter plads">Spejl</button>'
  +'<button class="ne-k" data-mxb="fra"'+gr(har)+' title="Slå de markerede regler fra eller til (M)">Slå fra / til</button>'
  +'<button class="ne-k ne-farlig" data-mxb="slet"'+gr(har)+' title="Slet de markerede regler (Delete)">Slet</button>'
  +'<button class="ne-k" data-mxb="ryd"'+gr(MX.mark.size)+' title="Fjern markeringen (Esc)">Ryd markering</button>'
  +(ve?'<span class="mx-bjk" title="'+neHtml(NE8_TIP[vk])+'">Flere regler på <b>'+neHtml(neMaalNavn(ve))+'</b>: <span class="ne-seg" role="group">'+['max','sum','gang'].map(x=>'<button class="ne-k'+(vk===x?' ne-paa':'')+'" data-mxbk="'+x+'" data-e="'+neHtml(ve)+'" aria-pressed="'+(vk===x)+'" title="'+neHtml(NE8_TIP[x])+'">'+NE8_NAVN[x]+'</button>').join('')+'</span></span>':'')}
function mxEfterAlle(tekst,uden){NE2.sig='';try{ne2Byg()}catch(x){}mxByg();try{ne2Kp(true)}catch(x){}MX.bjSig='';mxBjaelke();if(tekst)neToast(tekst,uden)}
function mxAlleStyrke(d){const R=mxMarkRegler();Regler.samlet(()=>R.forEach(x=>{const i=maps.indexOf(x.m);if(i>=0)Regler.retNr(i,{gain:mxTrin((+x.m.gain||0)+d)})}));MX.bjSig='';mxBjaelke();mxLev(false);try{ne2Kp(true)}catch(x){}neToast('Styrke '+(d>0?'op':'ned')+' på '+R.length+' regler',true)}
function mxAlleFra(){const R=mxMarkRegler();if(!R.length)return;const fra=R.some(x=>!x.m.off);Regler.samlet(()=>R.forEach(x=>{const i=maps.indexOf(x.m);if(i>=0)Regler.retNr(i,{off:fra?true:undefined})}));mxEfterAlle(R.length+(R.length===1?' regel':' regler')+' slået '+(fra?'fra':'til'))}
function mxAlleSlet(){const I=mxMarkRegler().map(x=>maps.indexOf(x.m)).filter(i=>i>=0).sort((a,b)=>b-a);if(!I.length)return;Regler.samlet(()=>I.forEach(i=>Regler.sletNr(i)));NE2.valgt=null;mxEfterAlle(I.length+(I.length===1?' regel':' regler')+' slettet')}
/* Ctrl+C: reglerne i de markerede celler (eller i cellen med fokus), med deres afstand i rækker og kolonner fra den øverste til venstre */
function mxKopier(td){const R=mxMarkRegler(td);if(!R.length){neToast('Der er ingen regler at kopiere. Markér celler med regler (Ctrl + klik), eller stil dig i en celle med en regel.',true);return}
 const B=MX.raekker.map(r=>r.band),kI=e=>MX.kol.findIndex(k=>!k.fold&&k.m.effect===e),r0=Math.min(...R.map(x=>B.indexOf(x.b))),k0=Math.min(...R.map(x=>kI(x.e)));
 MX.klip=R.map(x=>{const m=Object.assign({},x.m);delete m.id;return{dr:B.indexOf(x.b)-r0,dk:kI(x.e)-k0,m,fig:neFigurAf(x.e).key}});MX.bjSig='';mxBjaelke();
 neToast(R.length+(R.length===1?' regel':' regler')+' kopieret. Ctrl + klik på den celle, de skal starte i (eller gå derhen med piletasterne), og tryk Ctrl+V. Hos en anden figur lander de på de samme egenskaber.',true)}
/* --- fase 3, trin 3d: styrke-kæden i kanten: trim på rækken, styrke på figuren, Størst · Sum · Gang på kolonnen, Samlet styrke i hjørnet --- */
const MX_KOMB={max:'Størst',sum:'Sum',gang:'Gang'};
function mxKantTrim(b){const d=neTrimDb(b);return '<button class="mx-kt'+(d?'':' mx-kt0')+'" data-mxtr="'+neHtml(b)+'" title="'+neHtml('Trim på '+neLtNavn(b)+': '+ne9Db(d)+' (×'+neTal(Math.pow(10,d/20))+'). Ganges på lydtrækkets tal, før reglerne bruger det. Træk op eller ned, eller brug pil op/ned; dobbeltklik = 0 dB.')+'" aria-label="'+neHtml('Trim på '+neLtNavn(b)+': '+ne9Db(d))+'" data-t="'+neHtml(ne9Db(d))+'"></button>'}
function mxKantFs(f){const v=neFigStyrke(f.key);return '<button class="mx-kt'+(v===1?' mx-kt0':'')+'" data-mxfs="'+neHtml(f.key)+'" title="'+neHtml((f.gruppe?'Effekt-gruppens':'Figurens')+' styrke: ×'+neTal(v)+'. Ganges på alle regler til '+f.navn+'. Træk op eller ned, eller brug pil op/ned; dobbeltklik = ×1.')+'" aria-label="'+neHtml('Styrke for '+f.navn+': ×'+neTal(v))+'" data-t="×'+neTal(v)+'"></button>'}
function mxKantKo(e){const n=maps.filter(m=>m.effect===e).length;if(!n)return '';const k=neKombFor(e);return '<button class="mx-ko mx-ko-'+k+(n<2?' mx-kt0':'')+'" data-mxko="'+neHtml(e)+'" title="'+neHtml('Flere regler på samme mål: '+NE8_NAVN[k]+'. '+NE8_TIP[k]+(n<2?' Virker først med mere end én regel.':'')+' Klik skifter: Største → Læg sammen → Gang.')+'" aria-label="'+neHtml(neMaalNavn(e)+': '+NE8_NAVN[k])+'" data-t="'+MX_KOMB[k]+'"></button>'}
function mxKantFokus(attr,k){const b=[...$('ne-mx').querySelectorAll('[data-'+attr+']')].find(x=>x.getAttribute('data-'+attr)===k);if(b)b.focus({preventScroll:true})}
function mxKantTrin(t,dir){const trim=t.dataset.mxtr!==undefined,k=trim?t.dataset.mxtr:t.dataset.mxfs;if(trim)neSaetTrim(k,neTrimDb(k)+dir*.5,true);else neSaetFigStyrke(k,neFigStyrke(k)+dir*.05,true);mxByg();mxKantFokus(trim?'mxtr':'mxfs',k)}
function mxKombSkift(e){const nu=neKombFor(e),ny={max:'sum',sum:'gang',gang:'max'}[nu]||'sum';neSaetKomb(e,ny);mxByg();mxKantFokus('mxko',e)}
/* træk op og ned i et mærke i kanten: trim 8 px pr. dB (som på noden), styrke 120 px pr. 1,00 */
function mxKantStart(e){if(e.button>0)return;const t=e.target.closest('[data-mxtr],[data-mxfs]');if(!t)return;e.preventDefault();const trim=t.dataset.mxtr!==undefined,k=trim?t.dataset.mxtr:t.dataset.mxfs,y0=e.clientY,v0=trim?neTrimDb(k):neFigStyrke(k);let flyt=false;t.focus({preventScroll:true});
 const mv=ev=>{if(!flyt&&Math.abs(ev.clientY-y0)<3)return;if(!flyt){flyt=true;NE2.laas=true}const v=trim?v0+(y0-ev.clientY)/8:v0+(y0-ev.clientY)/120;
  if(trim){neSaetTrim(k,v,false);const d=neTrimDb(k);t.dataset.t=ne9Db(d);t.classList.toggle('mx-kt0',!d);neToastLive('Trim '+ne9Db(d))}else{neSaetFigStyrke(k,v,false);const f=neFigStyrke(k);t.dataset.t='×'+neTal(f);t.classList.toggle('mx-kt0',f===1);neToastLive('Styrke ×'+neTal(f))}};
 const op=()=>{removeEventListener('pointermove',mv);removeEventListener('pointerup',op);removeEventListener('pointercancel',op);if(!flyt)return;NE2.laas=false;MX.slugKlik=performance.now()+350;if(trim)neSaetTrim(k,neTrimDb(k),true);else neSaetFigStyrke(k,neFigStyrke(k),true);mxByg();mxKantFokus(trim?'mxtr':'mxfs',k)};
 addEventListener('pointermove',mv);addEventListener('pointerup',op);addEventListener('pointercancel',op)}
/* --- fase 3, trin 3c: kopiér en hel figurs regler til en anden figur, og spejl venstre og højre --- */
const MX_SPEJL=[['dArmV','dArmH']];/* egenskaber, der er hinandens spejlbillede */
function mxSpejlAf(eff){const d=String(eff).split(':');if(d[0]!=='obj'||d.length<4)return null;for(const[a,b]of MX_SPEJL){if(d[3]===a||d[3]===b){d[3]=d[3]===a?b:a;const ny=d.join(':');return TARGETS.some(t=>t.id===ny)?ny:null}}return null}
function mxFigRegler(key){return maps.filter(m=>neFigurAf(m.effect).key===key)}
function mxFigAlle(){const ud=[],set=new Set();TARGETS.forEach(t=>{const f=neFigurAf(t.id);if(f&&!f.gruppe&&String(f.key).startsWith('f:')&&!set.has(f.key)){set.add(f.key);ud.push(f)}});return ud}
function mxFigNavn(key){const f=mxFigAlle().find(x=>x.key===key);return f?f.navn:'figuren'}
/* alle figurens regler lægges hos en anden figur på de samme egenskaber; en regel, der står der, får indstillingerne. Ét Fortryd-skridt. */
function mxFigKopier(fra,til){const S=mxFigRegler(fra);if(!S.length){neToast(mxFigNavn(fra)+' har ingen regler at kopiere.',true);return}let ny=0,ret=0,over=0;const brugt=new Map(),maal=[];
 Regler.samlet(()=>S.forEach(s=>{const e=mxMaalHos(s.effect,til);if(!e){over++;return}const k=s.band+'\u0001'+e,j=brugt.get(k)||0;brugt.set(k,j+1);const t=maps.filter(m=>m.band===s.band&&m.effect===e)[j];
  if(t){const f={};MX_FELTER.forEach(x=>{f[x]=s[x]});Regler.retNr(maps.indexOf(t),f);ret++}else{const m=Object.assign({},s,{effect:e});delete m.id;Regler.tilfoej(m);ny++}maal.push(k)}));
 if(!ny&&!ret){neToast('Intet blev kopieret: '+mxFigNavn(til)+' har ingen af de egenskaber, reglerne bruger.',true);return}
 new Set(maal.map(k=>k.split('\u0001')[1])).forEach(e=>{try{neUdsving(e)}catch(x){}});try{persistObj()}catch(x){}
 const I=mxInd();if(I.mxFold[til]){I.mxFold[til]=false;mxGem()}MX.mark=new Set(maal);MX.anker=null;
 mxEfterAlle(mxFigNavn(til)+' har fået '+(ny+ret)+((ny+ret)===1?' regel':' regler')+' fra '+mxFigNavn(fra)+(ny&&ret?' ('+ny+' nye, '+ret+' rettet)':ret?' (rettet i de regler, der stod der)':'')+(over?'. '+over+' sprunget over: figuren har ikke egenskaben':'')+'.')}
/* spejl: regler på venstre arm flytter til højre arm og omvendt. Ét Fortryd-skridt. */
function mxSpejlListe(L,hvem){const P=L.map(m=>({m,ny:mxSpejlAf(m.effect)})).filter(x=>x.ny);if(!P.length){neToast('Der er ingen regler på Arm til venstre eller Arm til højre at spejle i '+hvem+'.',true);return}
 Regler.samlet(()=>P.forEach(x=>{const i=maps.indexOf(x.m);if(i>=0)Regler.retNr(i,{effect:x.ny})}));new Set(P.map(x=>x.ny)).forEach(e=>{try{neUdsving(e)}catch(x){}});try{persistObj()}catch(x){}
 MX.mark=new Set(P.map(x=>x.m.band+'\u0001'+x.ny));MX.anker=null;NE2.valgt=null;
 mxEfterAlle('Spejlet: '+P.length+(P.length===1?' regel':' regler')+' i '+hvem+' har byttet mellem Arm til venstre og Arm til højre.')}
function mxSpejl(key){mxSpejlListe(mxFigRegler(key),mxFigNavn(key))}
/* listen ved knappen ⋯ i figurens overskrift */
function mxFigMenu(key,anker){mxLukVaelger();const F=mxFigAlle(),f=F.find(x=>x.key===key);if(!f)return;const rod=$('ne'),d=document.createElement('div');d.className='mx-vaelg mx-fmenu';d.id='mx-vaelg';d.setAttribute('role','menu');d.setAttribute('aria-label','Regler for '+f.navn);
 const R=mxFigRegler(key),n=R.length,andre=F.filter(x=>x.key!==key),sp=R.some(m=>mxSpejlAf(m.effect));
 d.innerHTML='<div class="mx-vl"><div class="mx-vg">'+neHtml(f.navn)+' · '+n+(n===1?' regel':' regler')+'</div>'
  +(n&&andre.length?'<div class="mx-vg">Kopiér reglerne til</div>'+andre.map(x=>'<button role="menuitem" data-til="'+neHtml(x.key)+'" title="'+neHtml(x.navn+' får de samme regler på de samme egenskaber')+'">'+neHtml(x.navn)+'</button>').join(''):'<div class="mx-vg">'+(n?'Der er ingen anden figur at kopiere til':'Ingen regler at kopiere')+'</div>')
  +'<div class="mx-vg">Spejl</div><button role="menuitem" data-spejl="1"'+(sp?'':' disabled')+' title="Reglerne på Arm til venstre og Arm til højre bytter plads">Spejl venstre og højre</button><div class="mx-vg">Sæt af regler</div><button role="menuitem" data-saet="gem"'+(n?'':' disabled')+' title="Gem figurens regler under et navn, så de kan bruges på andre figurer og i andre opsætninger">Gem reglerne som et sæt</button>'+ne11Alle().map((sk,i)=>{let ok=false;try{ok=ne11Passer(sk,key)}catch(x){}return ok?'<button role="menuitem" data-saet="'+i+'" title="Sættet kommer ind som forslag (stiplede celler)">Brug et sæt: '+neHtml(ne11Navn(sk))+'</button>':''}).join('')+'</div>';rod.appendChild(d);
 d.style.left='0px';d.style.top='0px';const o=d.getBoundingClientRect(),r=anker.getBoundingClientRect(),hh=d.offsetHeight,x=Math.max(8,Math.min(innerWidth-d.offsetWidth-8,r.left)),y=r.bottom+4+hh<=innerHeight-8?r.bottom+4:Math.max(8,r.top-4-hh);d.style.left=(x-o.left)+'px';d.style.top=(y-o.top)+'px';
 const K=()=>[...d.querySelectorAll('button:not(:disabled)')];if(K()[0])K()[0].focus({preventScroll:true});
 d.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey))e.stopPropagation();const k=K(),i=k.indexOf(document.activeElement);
  if(e.key==='Escape'){e.preventDefault();mxLukVaelger();const b=[...$('ne-mx').querySelectorAll('[data-mxfm]')].find(q=>q.dataset.mxfm===key);if(b)b.focus()}
  else if(e.key==='ArrowDown'){e.preventDefault();if(k.length)k[Math.min(k.length-1,i+1)].focus()}else if(e.key==='ArrowUp'){e.preventDefault();if(k.length)k[Math.max(0,i-1)].focus()}});
 d.addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.disabled)return;mxLukVaelger();if(b.dataset.saet!==undefined){if(b.dataset.saet==='gem')neGemSkabelon(key);else{const sk=ne11Alle()[+b.dataset.saet];if(sk)neBrugSkabelon(sk,key)}}else if(b.dataset.til)mxFigKopier(key,b.dataset.til);else mxSpejl(key)});
 setTimeout(()=>{if(!$('mx-vaelg'))return;MX.vaelgLuk=e=>{if(!d.contains(e.target))mxLukVaelger()};addEventListener('pointerdown',MX.vaelgLuk,true)},0)}
/* --- fase 3, trin 3b: træk med Ctrl for at kopiere en celle, og indsæt kun indstillingerne --- */
function mxKtCelle(e){const el=document.elementFromPoint(e.clientX,e.clientY),td=el&&el.closest?el.closest('#ne-mx td.mx-c'):null,id=td&&mxCelleId(td);return td&&id&&!id.fold?{td,id}:null}
function mxKtFlyt(e){const K=MX.kt;if(!K||e.pointerId!==K.pid)return;if(!K.gang){const c0=mxKtCelle(e);if(Math.hypot(e.clientX-K.x,e.clientY-K.y)<6||(c0&&mxNoegle(c0.id)===mxNoegle(K.fra)))return;K.gang=true;NE2.laas=true;document.body.style.cursor='copy';const s=mxFindCelle(K.fra);if(s)s.classList.add('mx-kopi-fra')}
 e.preventDefault();const c=mxKtCelle(e),mx=$('ne-mx');mx.querySelectorAll('td.mx-kopi-til').forEach(x=>x.classList.remove('mx-kopi-til'));K.til=null;if(c&&mxNoegle(c.id)!==mxNoegle(K.fra)){c.td.classList.add('mx-kopi-til');K.til=c.id}}
function mxKtSlut(e){const K=MX.kt;if(!K||e.pointerId!==K.pid)return;MX.kt=null;removeEventListener('pointermove',mxKtFlyt);removeEventListener('pointerup',mxKtSlut);removeEventListener('pointercancel',mxKtSlut);if(!K.gang)return;
 NE2.laas=false;document.body.style.cursor='';{const c1=mxKtCelle(e);if(!(c1&&mxNoegle(c1.id)===mxNoegle(K.fra)))MX.slugKlik=performance.now()+350}const mx=$('ne-mx');mx.querySelectorAll('td.mx-kopi-til,td.mx-kopi-fra').forEach(x=>x.classList.remove('mx-kopi-til','mx-kopi-fra'));
 if(e.type==='pointercancel'||!K.til){if(performance.now()<MX.slugKlik)neToast('Kopien blev ikke lavet: slip på en anden celle.',true);return}mxKopierTil(K.fra,K.til)}
/* reglerne i én celle kopieres til en anden: en regel, der står der, får indstillingerne; ellers laves en ny. Ét Fortryd-skridt. */
function mxKopierTil(fra,til){const S=maps.filter(m=>m.band===fra.b&&m.effect===fra.e);if(!S.length)return;let ny=0,ret=0;
 Regler.samlet(()=>S.forEach((s,j)=>{const E=maps.filter(m=>m.band===til.b&&m.effect===til.e),t=E[j];if(t){const f={};MX_FELTER.forEach(k=>{f[k]=s[k]});Regler.retNr(maps.indexOf(t),f);ret++}else{const m=Object.assign({},s,{band:til.b,effect:til.e});delete m.id;delete m.off;Regler.tilfoej(m);ny++}}));
 try{neUdsving(til.e)}catch(x){}try{persistObj()}catch(x){}MX.mark.clear();MX.anker=til;const n=maps.filter(m=>m.band===til.b&&m.effect===til.e).length,key='r:'+til.b+'|'+til.e+'|'+Math.max(1,Math.min(n,1));
 NE2.sig='';try{ne2Byg()}catch(x){}mxByg();if(NE2.N.has(key))neVaelg(key);mxLev(true);const td=mxFindCelle(til);if(td)td.focus({preventScroll:true});
 neToast('Kopieret: '+neLtNavn(fra.b)+' → '+neMaalNavn(fra.e)+' til '+neLtNavn(til.b)+' → '+neFigurAf(til.e).navn+' · '+neMaalNavn(til.e)+(ret?' (reglen dér har fået indstillingerne)':'')+'.')}
/* indstillingerne, der følger med ved "Indsæt indstillinger": alt i kæden, men ikke lydtræk, mål, Slå fra eller hvordan flere regler lægges sammen */
const MX_INDST=['thr','gain','att','rel','curve','gap','hyst','hold','holdMs','slew','inv','port','portT'];
function mxIndsaetIndst(td){const K=MX.klip;if(!K||!K.length){neToast('Der er ikke kopieret noget endnu. Stil dig i en celle med en regel, og tryk Ctrl+C.',true);return}
 const R=mxMarkRegler(td);if(!R.length){neToast('Markér de regler, der skal have indstillingerne (Ctrl + klik), og tryk Ctrl+Shift+V.',true);return}
 const s=K[0].m,f={};MX_INDST.forEach(k=>{f[k]=s[k]});Regler.samlet(()=>R.forEach(x=>{const i=maps.indexOf(x.m);if(i>=0)Regler.retNr(i,f)}));
 mxEfterAlle('Indstillinger indsat i '+R.length+(R.length===1?' regel':' regler')+': tærskel '+neTal(s.thr)+', styrke ×'+neTal(s.gain)+', attack '+(s.att||0)+' ms, release '+(s.rel||0)+' ms og resten af kæden'+(K.length>1?' (fra den første af de '+K.length+' kopierede regler)':'')+'. Lydtræk og mål er ikke ændret.')}
/* den samme egenskab hos en anden figur (samme lag, ellers det første lag, der har egenskaben); null, når figuren ikke har den */
function mxMaalHos(eff,figKey){const d=String(eff).split(':');if(d[0]!=='obj'||!String(figKey).startsWith('f:'))return null;const id=figKey.slice(2),o=fase2.objekter.find(x=>x.id===id);if(!o)return null;const p=d[3],har=li=>!!(o.lag[li]&&o.lag[li].egenskaber&&o.lag[li].egenskaber[p]);let li=+d[2];if(!har(li))li=o.lag.findIndex((l,j)=>har(j));return li<0?null:'obj:'+id+':'+li+':'+p}
const MX_FELTER=['thr','gain','att','rel','curve','gap','inv','hyst','hold','holdMs','slew','port','portT','takt','spor','slags','komb'];
/* Ctrl+V: en regel, der findes i cellen, får de kopierede indstillinger; ellers laves en ny. Alt i ét Fortryd-skridt. */
function mxIndsaet(td){const K=MX.klip,id=td?mxCelleId(td):null;if(!K||!K.length){neToast('Der er ikke kopieret noget endnu. Markér celler med regler, og tryk Ctrl+C.',true);return}
 if(!id||id.fold){neToast('Ctrl + klik på den celle, reglerne skal starte i, og tryk Ctrl+V. En figur, der er foldet sammen, skal foldes ud først.',true);return}
 const B=MX.raekker.map(r=>r.band),ri=B.indexOf(id.b),ki=+td.dataset.k,tf=MX.kol[ki].f.key;let ny=0,ret=0,over=0;const maal=[];
 Regler.samlet(()=>K.forEach(c=>{const b=B[ri+c.dr];let e=null;if(c.fig!==tf&&String(c.fig).startsWith('f:')&&tf.startsWith('f:'))e=mxMaalHos(c.m.effect,tf);else{const k=MX.kol[ki+c.dk];e=k&&!k.fold?k.m.effect:null}
  if(!b||!e){over++;return}const i=maps.findIndex(m=>m.band===b&&m.effect===e);
  if(i>=0){const f={};MX_FELTER.forEach(k=>{f[k]=c.m[k]});Regler.retNr(i,f);ret++}else{Regler.tilfoej(Object.assign({},c.m,{band:b,effect:e}));ny++}
  try{neUdsving(e)}catch(x){}maal.push(b+'\u0001'+e)}));
 if(!ny&&!ret){neToast('Intet blev indsat: de kopierede regler passer ikke her'+(over?' ('+over+' sprunget over)':'')+'.',true);return}
 MX.mark=new Set(maal);MX.anker=id;try{persistObj()}catch(x){}
 mxEfterAlle((ny+ret)+((ny+ret)===1?' regel':' regler')+' indsat'+(ny&&ret?' ('+ny+' nye, '+ret+' rettet)':ret?' (rettet i de regler, der stod der)':'')+(over?'. '+over+' sprunget over (målet findes ikke hos figuren eller ligger uden for matrixen)':'')+'.');
 const ny2=mxFindCelle(id);if(ny2)ny2.focus({preventScroll:true})}
/* --- trin 2c: find rundt --- */
function mxGivUdsving(effect,td){const id=td?mxCelleId(td):null;if(td&&td.classList.contains('mx-har'))mxVaelgI(td,false);if(!neUdsving(effect)){neToast('Egenskaben kunne ikke få et udsving. Sæt Fra og Til under egenskaben i Editoren.',true);return}
 try{save()}catch(x){}NE2.sig='';mxByg();try{ne2Kp(true)}catch(x){}const ny=id&&mxFindCelle(id);if(ny)ny.focus({preventScroll:true});neToast('Udsving sat: '+neFigurAf(effect).navn+' · '+neMaalNavn(effect)+' går nu '+neEgRange(effect)+'. Du kan ændre Fra og Til under egenskaben i Editoren.')}
function mxFold(key){const I=mxInd(),f=MX.fig.find(x=>x.key===key);if(!f)return;I.mxFold[key]=!f.fold;mxGem();mxByg()}
function mxSaetAlle(on){const I=mxInd();I.mxAlle=!!on;mxGem();mxByg();neToast(on?'Alle lydtræk og alle mål vises. Figurer uden regler står foldet sammen; klik på ▸ for at folde ud.':'Kun de lydtræk og mål, der er i brug, vises.',true)}
function mxFjernEkstra(s){const I=mxInd(),type=s[0],id=s.slice(2),L=type==='b'?I.mxE.b:I.mxE.e,i=L.indexOf(id);if(i>=0)L.splice(i,1);mxGem();mxByg()}
function mxLukVaelger(){const d=$('mx-vaelg');if(d)d.remove();if(MX.vaelgLuk){removeEventListener('pointerdown',MX.vaelgLuk,true);MX.vaelgLuk=null}}
/* listen med søgning: type b = lydtræk (alle kilder i D2-rækkefølge), type e = mål (alle mål, pr. figur) */
function mxVaelger(type,anker){mxLukVaelger();const rod=$('ne'),d=document.createElement('div');d.className='mx-vaelg';d.id='mx-vaelg';d.setAttribute('role','dialog');d.setAttribute('aria-label',type==='b'?'Tilføj et lydtræk':'Tilføj et mål');
 const vist=new Set(type==='b'?MX.raekker.map(r=>r.band):MX.kol.filter(k=>!k.fold).map(k=>k.m.effect));
 const alle=type==='b'?r2AlleKilder().filter(b=>!fjernetKilde(b)).sort((a,b)=>ne42Sml(a,b)).map(b=>({id:b,navn:neLtNavn(b),grp:sigInfo(b).mappe})):TARGETS.map(t=>({id:t.id,navn:neMaalNavn(t.id),grp:neFigurAf(t.id).navn}));
 const L=alle.filter(x=>!vist.has(x.id));
 d.innerHTML='<input type="search" placeholder="'+(type==='b'?'Søg lydtræk …':'Søg mål …')+'" aria-label="'+(type==='b'?'Søg lydtræk':'Søg mål')+'"><div class="mx-vl" role="listbox"></div>';rod.appendChild(d);
 /* placeringen: under knappen (over den, hvis der ikke er plads). Zonen kan flytte nulpunktet for position:fixed, så forskydningen måles først */
 const mxPlacer=()=>{d.style.left='0px';d.style.top='0px';const o=d.getBoundingClientRect(),r=anker.isConnected?anker.getBoundingClientRect():{left:o.left+8,top:o.top+8,bottom:o.top+30},hh=d.offsetHeight;
  const x=Math.max(8,Math.min(innerWidth-d.offsetWidth-8,r.left)),y=r.bottom+4+hh<=innerHeight-8?r.bottom+4:Math.max(8,r.top-4-hh);d.style.left=(x-o.left)+'px';d.style.top=(y-o.top)+'px'};
 const inp=d.querySelector('input'),liste=d.querySelector('.mx-vl');let akt=0;
 const tegn=()=>{const q=inp.value.trim().toLowerCase(),F=L.filter(x=>!q||(x.navn+' '+x.grp).toLowerCase().includes(q)).slice(0,200);akt=Math.max(0,Math.min(akt,F.length-1));let g=null;
  liste.innerHTML=F.length?F.map((x,i)=>(x.grp!==g?'<div class="mx-vg">'+neHtml(g=x.grp)+'</div>':'')+'<button role="option" tabindex="-1" data-id="'+neHtml(x.id)+'"'+(i===akt?' class="mx-va" aria-selected="true"':'')+'>'+neHtml(x.navn)+'</button>').join(''):'<div class="mx-vg">'+(L.length?'Ingen passer til søgningen':(type==='b'?'Alle lydtræk står allerede i matrixen':'Alle mål står allerede i matrixen'))+'</div>';
  const a=liste.querySelector('.mx-va');if(a)a.scrollIntoView({block:'nearest'})};
 inp.addEventListener('input',()=>{akt=0;tegn()});
 d.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey))e.stopPropagation();const n=liste.querySelectorAll('button').length;
  if(e.key==='Escape'){e.preventDefault();mxLukVaelger();const b=$('ne-mx').querySelector('[data-mxp="'+type+'"]');if(b)b.focus()}
  else if(e.key==='ArrowDown'){e.preventDefault();akt=Math.min(n-1,akt+1);tegn()}else if(e.key==='ArrowUp'){e.preventDefault();akt=Math.max(0,akt-1);tegn()}
  else if(e.key==='Enter'){e.preventDefault();const a=liste.querySelector('.mx-va');if(a)mxTilfoejEkstra(type,a.dataset.id)}});
 liste.addEventListener('click',e=>{const b=e.target.closest('button[data-id]');if(b)mxTilfoejEkstra(type,b.dataset.id)});
 tegn();mxPlacer();inp.focus({preventScroll:true});
 setTimeout(()=>{if(!$('mx-vaelg'))return;MX.vaelgLuk=e=>{if(!d.contains(e.target))mxLukVaelger()};addEventListener('pointerdown',MX.vaelgLuk,true)},0)}
function mxTilfoejEkstra(type,id){const I=mxInd(),L=type==='b'?I.mxE.b:I.mxE.e;if(!L.includes(id))L.push(id);if(type==='e')I.mxFold[neFigurAf(id).key]=false;mxGem();mxLukVaelger();mxByg();
 const mx=$('ne-mx');let el=null,td=null;if(type==='b'){el=[...mx.querySelectorAll('th.mx-lt')].find(x=>x.dataset.b===id);td=el&&el.parentNode.querySelector('td.mx-c')}
 else{const ki=MX.kol.findIndex(k=>!k.fold&&k.m.effect===id);el=ki>=0?mx.querySelectorAll('thead tr:nth-child(2) th.mx-maal')[ki]:null;td=ki>=0?mx.querySelector('td.mx-c[data-k="'+ki+'"]'):null}
 if(el){el.scrollIntoView({block:'nearest',inline:'nearest'});el.classList.add('mx-ny');setTimeout(()=>el.classList.remove('mx-ny'),1600)}if(td)td.focus({preventScroll:true});
 neToast((type==='b'?'Lydtræk tilføjet: '+neLtNavn(id):'Mål tilføjet: '+neFigurAf(id).navn+' · '+neMaalNavn(id))+'. Klik i en celle for at lave en regel.',true)}
/* --- trin 2b: lav og ret --- */
/* en celles navn: lydtræk og mål (bruges til at finde cellen igen, når tabellen er bygget om) */
function mxCelleId(td){td=td&&td.closest?td.closest('td.mx-c'):null;if(!td)return null;const th=td.parentNode.querySelector('th.mx-lt'),k=MX.kol[+td.dataset.k];return th&&k?{b:th.dataset.b,e:mxKolId(k),fold:!!k.fold}:null}
function mxFindCelle(id){const mx=$('ne-mx');if(!mx||!id)return null;const ki=MX.kol.findIndex(k=>mxKolId(k)===id.e);if(ki<0)return null;const tr=[...mx.querySelectorAll('tbody tr')].find(r=>{const th=r.querySelector('th.mx-lt');return th&&th.dataset.b===id.b});return tr?tr.querySelector('td.mx-c[data-k="'+ki+'"]'):null}
/* den regel i cellen, der arbejdes med: den valgte, ellers den første */
function mxRegelI(td){const L=(td.dataset.r||'').split('\u0001').filter(Boolean);if(!L.length)return null;const k=L.includes(NE2.valgt)?NE2.valgt:L[0],n=NE2.N.get(k);return n&&n.m&&maps[n.i]===n.m?{k,n,L}:null}
function mxVaelgI(td,naeste){const L=td.dataset.r.split('\u0001'),i=L.indexOf(NE2.valgt);neVaelg(naeste?L[(i+1)%L.length]:(i>=0?L[i]:L[0]));mxLev(true)}
/* klik i en tom celle: en ny regel med standard-indstillinger, valgt med det samme */
function mxLav(td){const id=mxCelleId(td);if(!id)return;if(id.fold){mxFold(id.e.slice(5));return}ne5Ny(id.b,id.e);const n=maps.filter(x=>x.band===id.b&&x.effect===id.e).length,key='r:'+id.b+'|'+id.e+'|'+n;mxByg();if(NE2.N.has(key))neVaelg(key);mxLev(true);const ny=mxFindCelle(id);if(ny)ny.focus({preventScroll:true});
 const rg=neErEgenskab(id.e)?neEgRange(id.e):'';neToast('Ny regel: '+neLtNavn(id.b)+' → '+neMaalNavn(id.e)+(rg?' (udsving '+rg+')':'')+'. Træk op og ned i cellen for at ændre styrken.')}
const mxTrin=v=>Math.round(Math.max(0,Math.min(2,v))*20)/20;
function mxVisTal(td,g){let em=td.querySelector('em');if(g==null){if(em)em.remove();return}if(!em){em=document.createElement('em');td.appendChild(em)}em.textContent='×'+neTal(g)}
/* træk op og ned: styrken følger musen (50 px = 1,00); hvert trin rettes gennem Regler, så billedet følger med, mens man trækker */
function mxTraekStart(e){if(e.button>0||MX.traek||MX.kt||e.shiftKey)return;if(e.ctrlKey||e.metaKey){const c=e.target.closest('td.mx-har'),cid=c&&mxCelleId(c);if(cid&&!cid.fold){MX.kt={fra:cid,x:e.clientX,y:e.clientY,gang:false,pid:e.pointerId,til:null};addEventListener('pointermove',mxKtFlyt);addEventListener('pointerup',mxKtSlut);addEventListener('pointercancel',mxKtSlut)}return}const td=e.target.closest('td.mx-har');if(!td)return;const R=mxRegelI(td);if(!R)return;const cid=mxCelleId(td),alle=cid&&MX.mark.size>1&&MX.mark.has(mxNoegle(cid))?mxMarkRegler().map(x=>({m:x.m,g0:+x.m.gain||0})):null;MX.traek={td,id:cid,k:R.k,m:R.n.m,y:e.clientY,g0:+R.n.m.gain||0,g:+R.n.m.gain||0,gang:false,pid:e.pointerId,alle};
 /* lytterne sidder på vinduet, så trækket fortsætter, selv om tabellen bygges om undervejs */
 addEventListener('pointermove',mxTraekFlyt);addEventListener('pointerup',mxTraekSlut);addEventListener('pointercancel',mxTraekSlut)}
function mxTraekFlyt(e){const T=MX.traek;if(!T||e.pointerId!==T.pid)return;const dy=T.y-e.clientY;if(!T.gang){if(Math.abs(dy)<4)return;T.gang=true;NE2.laas=true;T.td.classList.add('mx-traekker');mxVisTal(T.td,T.g);if(NE2.valgt!==T.k){neVaelg(T.k)}}
 e.preventDefault();const g=mxTrin(T.g0+dy/50);if(g!==T.g){T.g=g;if(T.alle)Regler.samlet(()=>T.alle.forEach(x=>{const i=maps.indexOf(x.m);if(i>=0)Regler.retNr(i,{gain:mxTrin(x.g0+dy/50)})}));else{const i=maps.indexOf(T.m);if(i>=0)Regler.retNr(i,{gain:g})}mxVisTal(T.td,g);mxLev(false)}}
function mxTraekSlut(e){const T=MX.traek;if(!T||e.pointerId!==T.pid)return;MX.traek=null;removeEventListener('pointermove',mxTraekFlyt);removeEventListener('pointerup',mxTraekSlut);removeEventListener('pointercancel',mxTraekSlut);if(!T.gang)return;MX.slugKlik=performance.now()+350;NE2.laas=false;T.td.classList.remove('mx-traekker');mxVisTal(T.td,null);
 const m=T.m,i=maps.indexOf(m);if(i<0)return;if(T.g!==T.g0){try{ne2Kp(true)}catch(x){}neToast('Styrke ×'+neTal(T.g)+' ('+neLtNavn(m.band)+' → '+neMaalNavn(m.effect)+')')}}
/* tastatur: pile flytter mellem cellerne, Enter laver eller vælger, Delete sletter, M slår fra og til, Shift + pil op/ned ændrer styrken */
function mxTast(e){if(e.ctrlKey||e.metaKey){const g=String(e.key).toLowerCase(),c=e.target.closest&&e.target.closest('td.mx-c');if(e.altKey||g.length!==1||!'cva'.includes(g)||(e.shiftKey&&g!=='v'))return;/* Ctrl+Z og Ctrl+K skal stadig virke */
  e.preventDefault();e.stopPropagation();if(g==='c')mxKopier(c);else if(g==='v'){if(e.shiftKey)mxIndsaetIndst(c);else mxIndsaet(c)}else{MX.mark.clear();MX.celler.forEach(x=>{const id=mxCelleId(x.td);if(id&&!id.fold)MX.mark.add(mxNoegle(id))});mxMarkTegn()}return}
 e.stopPropagation();if(e.key==='Escape'&&MX.mark.size){e.preventDefault();mxMarkRyd();return}const mx=$('ne-mx');let td=e.target.closest&&e.target.closest('td.mx-c');const k=e.key;
 if(e.target.closest&&e.target.closest('[data-mxms]'))return;{const kt=e.target.closest&&e.target.closest('[data-mxtr],[data-mxfs]');if(kt){if(k==='ArrowUp'||k==='ArrowDown'){e.preventDefault();mxKantTrin(kt,k==='ArrowUp'?1:-1)}return}}if(e.target.closest&&e.target.closest('[data-mxfm],[data-mxko]'))return;const fh=e.target.closest&&e.target.closest('th.mx-fig');if(fh){if(k==='Enter'||k===' '){e.preventDefault();const key=fh.dataset.f;mxFold(key);const ny=[...mx.querySelectorAll('th.mx-fig')].find(x=>x.dataset.f===key);if(ny)ny.focus()}return}
 if(e.target.closest&&e.target.closest('button'))return;
 if(!td){if(/^Arrow/.test(k)||k==='Enter'){const f=mx.querySelector('td.mx-valgt')||mx.querySelector('td.mx-har')||mx.querySelector('td.mx-c');if(f){e.preventDefault();f.focus();if(f.classList.contains('mx-har'))mxVaelgI(f,false)}}return}
 const har=td.classList.contains('mx-har');
 /* flere celler markeret: Shift + pil, Delete og M gælder dem alle */
 if(MX.mark.size>1&&mxMarkRegler().length){if(e.shiftKey&&(k==='ArrowUp'||k==='ArrowDown')){e.preventDefault();mxAlleStyrke(k==='ArrowUp'?.05:-.05);return}
  if(k==='Delete'||k==='Backspace'){e.preventDefault();mxAlleSlet();return}if(k==='m'||k==='M'){e.preventDefault();mxAlleFra();return}}
 if(e.shiftKey&&har&&(k==='ArrowUp'||k==='ArrowDown')){e.preventDefault();const R=mxRegelI(td);if(!R)return;const g=mxTrin((+R.n.m.gain||0)+(k==='ArrowUp'?.05:-.05));if(g!==R.n.m.gain){const id=mxCelleId(td);Regler.retNr(R.n.i,{gain:g});try{ne2Kp(true)}catch(x){}mxLev(false);neToast('Styrke ×'+neTal(g),true)}return}
 if(/^Arrow/.test(k)){e.preventDefault();const raekker=[...mx.querySelectorAll('tbody tr')].filter(r=>r.querySelector('th.mx-lt')),ri=raekker.indexOf(td.parentNode),ki=+td.dataset.k,nr=k==='ArrowUp'?ri-1:k==='ArrowDown'?ri+1:ri,nk=k==='ArrowLeft'?ki-1:k==='ArrowRight'?ki+1:ki;
  if(nr<0||nr>=raekker.length||nk<0||nk>=MX.kol.length)return;const ny=raekker[nr].querySelector('td.mx-c[data-k="'+nk+'"]');if(!ny)return;ny.focus();ny.scrollIntoView({block:'nearest',inline:'nearest'});if(ny.classList.contains('mx-har'))mxVaelgI(ny,false);else if(NE2.valgt){neVaelg(null);mxLev(true)}return}
 if(k==='Enter'||k===' '){e.preventDefault();if(har)mxVaelgI(td,true);else mxLav(td);return}
 if(!har)return;const R=mxRegelI(td);if(!R)return;
 if(k==='Delete'||k==='Backspace'){e.preventDefault();const id=mxCelleId(td);ne5Slet(R.n.i);mxByg();const ny=mxFindCelle(id);if(ny){ny.focus({preventScroll:true});if(ny.classList.contains('mx-har'))mxVaelgI(ny,false)}return}
 if(k==='m'||k==='M'){e.preventDefault();const m=R.n.m,fra=!m.off;Regler.retNr(R.n.i,{off:fra?true:undefined});try{ne2Kp(true)}catch(x){}mxLev(false);neToast((fra?'Slået fra: ':'Slået til: ')+neLtNavn(m.band)+' → '+neMaalNavn(m.effect))}}
function mxStart(){const rod=$('ne'),fl=$('ne-flade'),vl=rod&&rod.querySelector('.ne-vlinje');if(!rod||!fl||!vl||!NE.byg||!NE2.byg||!$('ne41-vis')){setTimeout(mxStart,300);return}
 const mx=document.createElement('div');mx.id='ne-mx';mx.className='mx';mx.hidden=true;mx.tabIndex=0;mx.setAttribute('aria-label','Matrix over alle regler');(($('ne-vis')||fl)).insertAdjacentElement('afterend',mx);
 const sk=document.createElement('span');sk.className='mx-skift';sk.setAttribute('role','group');sk.setAttribute('aria-label','Vis reglerne som noder eller som matrix');
 sk.innerHTML='<button data-mx="0" aria-pressed="true" title="Noder: lydtræk, regler, figurer og mål som kasser med linjer imellem">Noder</button><button data-mx="1" aria-pressed="false" title="Matrix: alle regler i ét gitter. Rækker er lydtræk, kolonner er mål">Matrix</button>';
 const tit=vl.querySelector('.ne-titel');if(tit)tit.insertAdjacentElement('afterend',sk);else vl.insertBefore(sk,vl.firstChild);
 sk.addEventListener('click',e=>{const b=e.target.closest('button[data-mx]');if(b)mxSaet(b.dataset.mx==='1')});
 /* linjen under matrixen for de markerede celler (fase 3) */
 const bj=document.createElement('div');bj.id='mx-bj';bj.className='mx-bj';bj.hidden=true;bj.setAttribute('role','toolbar');bj.setAttribute('aria-label','De markerede celler');mx.insertAdjacentElement('afterend',bj);
 bj.addEventListener('input',e=>{const f=e.target.dataset.mxb;if(f!=='gain'&&f!=='thr')return;const v=+e.target.value;Regler.samlet(()=>mxMarkRegler().forEach(x=>{const i=maps.indexOf(x.m);if(i>=0)Regler.retNr(i,{[f]:v})}));const t=bj.querySelector('[data-mxbv="'+f+'"]');if(t)t.textContent=(f==='gain'?'×':'')+neTal(v);try{ne2Kp(true)}catch(x){}mxLev(false)});
 bj.addEventListener('click',e=>{const kb=e.target.closest('button[data-mxbk]');if(kb){neSaetKomb(kb.dataset.e,kb.dataset.mxbk);mxByg();MX.bjSig='';mxBjaelke();return}const b=e.target.closest('button[data-mxb]');if(!b||b.disabled)return;const h=b.dataset.mxb;if(h==='mm'){MX.mm=!MX.mm;MX.bjSig='';mxBjaelke();neToast(MX.mm?'Markér celler er Til: klik på de celler, du vil markere.':'Markér celler er Fra: et klik vælger reglen eller laver en ny.',true);return}if(h==='alle'){mxMarkAlle();return}if(h==='kopier')mxKopier(null);else if(h==='indsaet')mxIndsaet(mxFindCelle(MX.anker));else if(h==='indst')mxIndsaetIndst(null);else if(h==='spejl')mxSpejlListe(mxMarkRegler().map(x=>x.m),'de markerede regler');else if(h==='fra')mxAlleFra();else if(h==='slet')mxAlleSlet();else if(h==='ryd')mxMarkRyd()});
 bj.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey))e.stopPropagation()});
 mx.addEventListener('click',e=>{if(performance.now()<MX.slugKlik)return;const u=e.target.closest('[data-mxu]');if(u){mxGivUdsving(u.dataset.mxu,u.closest('td'));return}const p=e.target.closest('[data-mxp]');if(p){mxVaelger(p.dataset.mxp,p);return}const x=e.target.closest('[data-mxx]');if(x){mxFjernEkstra(x.dataset.mxx);return}
  const lf=e.target.closest('[data-mxlf]');if(lf){neSaetLtFra(lf.dataset.mxlf,!neLtFra(lf.dataset.mxlf));return}const v=e.target.closest('[data-mxv]');if(v){mxSaetAlle(v.dataset.mxv==='1');return}if(e.target.closest('[data-mxtr],[data-mxfs],.mx-ms'))return;const ko=e.target.closest('[data-mxko]');if(ko){mxKombSkift(ko.dataset.mxko);return}const fm=e.target.closest('[data-mxfm]');if(fm){mxFigMenu(fm.dataset.mxfm,fm);return}const fh=e.target.closest('th[data-f]');if(fh){mxFold(fh.dataset.f);return}let td=e.target.closest('td.mx-c');if(!td){const q=document.elementFromPoint(e.clientX,e.clientY);td=q&&q.closest?q.closest('#ne-mx td.mx-c'):null}if(!td)return;if(e.ctrlKey||e.metaKey){mxMarkSkift(td);td.focus({preventScroll:true});return}if(e.shiftKey){mxMarkOmraade(td);td.focus({preventScroll:true});return}
  if(MX.mm){mxMarkSkift(td);td.focus({preventScroll:true});return}mxMarkRyd();MX.anker=mxCelleId(td);if(td.classList.contains('mx-har'))mxVaelgI(td,true);else mxLav(td)});
 mx.addEventListener('pointerdown',e=>{MX.nede=performance.now();MX.ned={x:e.clientX,y:e.clientY,el:e.target,knap:e.button}},true);/* blev det, der blev trykket på, tegnet om inden slip, sender browseren intet klik; så sendes det her */addEventListener('pointerup',e=>{const d=MX.ned;MX.ned=null;setTimeout(()=>{MX.nede=0},60);if(d&&d.knap===0&&d.el&&!d.el.isConnected&&Math.hypot(e.clientX-d.x,e.clientY-d.y)<5&&mxTil()){const q=document.elementFromPoint(e.clientX,e.clientY);if(q&&q.closest&&q.closest('#ne-mx'))q.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,clientX:e.clientX,clientY:e.clientY,ctrlKey:e.ctrlKey,metaKey:e.metaKey,shiftKey:e.shiftKey}))}},true);addEventListener('pointercancel',()=>{MX.nede=0},true);
 mx.addEventListener('pointerdown',mxKantStart);
 mx.addEventListener('dblclick',e=>{const t=e.target.closest('[data-mxtr],[data-mxfs]');if(!t)return;e.preventDefault();const trim=t.dataset.mxtr!==undefined,k=trim?t.dataset.mxtr:t.dataset.mxfs;if(trim)neSaetTrim(k,0,true);else neSaetFigStyrke(k,1,true);mxByg();mxKantFokus(trim?'mxtr':'mxfs',k)});
 mx.addEventListener('input',e=>{const t=e.target.closest('[data-mxms]');if(!t)return;NE2.laas=true;gmaster=+t.value;const mm=$('mmaster');if(mm){mm.value=gmaster;if(mm.nextElementSibling)mm.nextElementSibling.textContent=gmaster}try{save()}catch(x){}try{ne4Vlinje()}catch(x){}const b=t.parentNode.querySelector('b');if(b)b.textContent='×'+neTal(gmaster)});
 mx.addEventListener('change',e=>{const t=e.target.closest('[data-mxms]');if(!t)return;NE2.laas=false;neToast('Samlet styrke ×'+neTal(gmaster),true)});
 mx.addEventListener('pointerdown',mxTraekStart);
 mx.addEventListener('keydown',mxTast);
 mx.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
 /* v9.55: det gule ! på en regel-node (reglen flytter ikke noget): et klik giver egenskaben et udsving, som i matrixen */
 rod.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('.ne-node .ne-m-adv');if(!a)return;e.stopPropagation();e.preventDefault();const el=a.closest('.ne-node'),n=el&&NE2.N.get(el.dataset.n);if(!n||!n.m)return;const eff=n.m.effect;NE2.valgt=n.key;
  if(!neUdsving(eff)){neToast('Egenskaben kunne ikke få et udsving. Sæt Fra og Til under egenskaben i Editoren.',true);return}try{save()}catch(x){}NE2.sig='';ne2Byg();try{ne2Kp(true)}catch(x){}neToast('Udsving sat: '+neFigurAf(eff).navn+' · '+neMaalNavn(eff)+' går nu '+neEgRange(eff)+'. Du kan ændre Fra og Til under egenskaben i Editoren.')},true);
 /* vælger man en af visningerne i Visning ▾ (fx fra Ctrl+K), går man ud af matrixen */
 mxGlNe41Vis=ne41Vis;window.ne41Vis=function(v,st){if(mxTil())mxSaet(false,true);return mxGlNe41Vis(v,st)};
 MX.klar=true;requestAnimationFrame(mxTik);if(mxTil())mxSaet(true,true)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mxStart);else setTimeout(mxStart,0);
{const gl=neKpPunkter;window.neKpPunkter=function(L){gl(L);if(!NE.byg)return;const k=(n,ikon,fn)=>L.push({n,kat:'Knapper · Node-editor',fn,ikon});
 k('Vis reglerne som matrix','▦',()=>mxSaet(true));k('Vis reglerne som noder','◫',()=>mxSaet(false));
 k('Matrix: + lydtræk','＋',()=>{mxSaet(true,true);const b=$('ne-mx').querySelector('[data-mxp="b"]');if(b)mxVaelger('b',b)});k('Matrix: + mål','＋',()=>{mxSaet(true,true);const b=$('ne-mx').querySelector('[data-mxp="e"]');if(b)mxVaelger('e',b)});
 k('Matrix: markér alle celler med regler (Ctrl+A)','▦',()=>{mxSaet(true,true);MX.mark.clear();MX.celler.forEach(x=>{const id=mxCelleId(x.td);if(id&&!id.fold)MX.mark.add(mxNoegle(id))});mxMarkTegn()});
 k('Matrix: indsæt kun indstillingerne i de markerede regler (Ctrl+Shift+V)','▦',()=>{mxSaet(true,true);mxIndsaetIndst(null)});
 k('Matrix: vis alle lydtræk og mål','▦',()=>{mxSaet(true,true);mxSaetAlle(true)});k('Matrix: vis kun de brugte','▦',()=>{mxSaet(true,true);mxSaetAlle(false)});
 k('Lange sange: normalisér i stykker på 2 minutter (til/fra)','♪',()=>normLokalSkift());k('Automatik: se og slå det fra, programmet vælger selv','⚙',()=>auAaben(true));k('Analysér sangen igen (og gem den nye analyse)','♪',()=>anaIgen());[1,2].forEach(i=>{k('Opstilling af noderne: Min opstilling '+i,'▤',()=>{mxSaet(false,true);setTimeout(()=>neOpstilEgen(i),80)});k('Opstilling af noderne: gem som Min opstilling '+i,'▤',()=>{mxSaet(false,true);setTimeout(()=>neOpstilGem(i),80)})});
 NE_OPST.forEach(o=>k('Opstilling af noderne: '+o[1],'▤',()=>{mxSaet(false,true);setTimeout(()=>neOpstil(o[0]),80)}));GIT_OPST.forEach(o=>k('Opstilling af noderne: '+o[1],'▤',()=>{mxSaet(false,true);setTimeout(()=>gitOpstil(o[0]),80)}));k('Ret op (gitter): de yderste noder er rammen, resten fordeles','▤',()=>{mxSaet(false,true);setTimeout(()=>gitRetOp(),80)})}}
/* ========== SLUT: MATRIXEN ========== */
