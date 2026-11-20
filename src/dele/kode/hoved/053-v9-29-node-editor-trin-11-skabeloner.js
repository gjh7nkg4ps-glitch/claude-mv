/* ========== v9.29: NODE-EDITOR (TRIN 11): SKABELONER ==========
   Trin 11 af 16 (papirets afsnit 5.2): en skabelon (vores navn; fagudtryk: template) er lydtræk og regler, der lægges på én figur.
   - 6 følger med: Dans på trommer, Dans på bas og vokal (danser), Diskokugle på bas, Morgenstjerne (de 6 regler fra Tilføj morgenstjerne),
     Puls på kick (alle figurer) og Klodsbane på slag (effekt-gruppen Bane).
   - Vælg en skabelon i Ctrl+K, i "+ Tilføj" i Figur-kolonnen eller i en figurs kontrolpanel. Er ingen figur valgt, spørger listen "Hvilken figur?" (kun de
     figurer, skabelonen passer til). Reglerne kobles til figurens mål; et mål, figuren ikke har, springes over med en kort besked. Har målet allerede en regel,
     lægges den nye til (med målets Største, Læg sammen eller Gang). Er et lydtræk parkeret, trækkes det ind og vågner. Alt fortrydes i ét trin (Ctrl+Z).
   - Gem som skabelon: i en figurs kontrolpanel gemmes figurens regler som en ny skabelon (set.ne.skabeloner); den kan lægges på andre figurer. */
const NE11_STD=[/* v9.87 (B3/B4): til = den figur, regel-sættet hører til; uden til er det fælles og vises hos hver figur, det passer til */
 {navn:'Dans på trommer',til:'danser',regler:['dHop','dKnae','dArmV','dHoved','dHaar'].map(p=>['p',p])},
 {navn:'Dans på bas og vokal',til:'danser',regler:['dArmH','dHofte','dKrop','dKjole','dGlaede'].map(p=>['p',p])},
 {navn:'Dansemapping (danserens standard)',til:'danser',regler:['dKnae','dHop','dArmV','dArmH','dHoved','dHofte','dHaar','dKjole','dGlaede','dGulvPuls','dSpot'].map(p=>['p',p])},/* v9.88 (B4): de 11 standardforbindelser som et indbygget regel-sæt; lægges aldrig på af sig selv */
 {navn:'Diskokugle på bas',til:'diskokugle',regler:[['p','kIntensitet','bas',.2,1,40,500],['p','kGlimt','hnd:takt',.2,1,5,150],['p','kFarveH','hnd:akkordrod',0,1,40,600]]},
 {navn:'Morgenstjerne',til:'morgenstjerne',regler:[['p','piglaengde','hmid',.3,1,20,250],['p','storrelse','bas',.2,1,20,250],['p','drej','flux',.2,1,20,250],['p','skala','kick',.3,1,20,250],['p','svaev','vokal',.2,1,20,250],['p','loeft','vokal',.2,1,20,250]]},
 {navn:'Puls på kick',regler:[['p','skala','kick',.3,1,6,250],['p','glod','kick',.3,1,6,300],['p','farveH','hnd:akkordrod',0,1,40,600]]},
 {navn:'Klodsbane på slag',gruppe:'Bane',regler:[['e','klods1','kick',.3,1,5,150],['e','klods2','snare',.3,1,5,150],['e','klods3','hihat',.3,1,5,150]]},
 /* v9.90 (B6): fem regel-sæt pr. figur med de samme navne (P8.6: Rolig, Energisk, På trommerne, På vokalen, Hele bandet). Regel: ['p', egenskab, lydtræk, tærskel, styrke, attack ms, release ms] */
 {navn:'Rolig',til:'danser',b6:1,regler:[['p','dHofte','bas',.2,.8,120,500],['p','dKjole','mid',.25,.8,80,400],['p','dGlaede','rms',.2,1,200,800],['p','dHaar','hihat',.35,.6,30,400],['p','dKrop','bas',.3,.6,100,500]]},
 {navn:'Energisk',til:'danser',b6:1,regler:[['p','dHop','kick',.5,1.2,5,250],['p','dKnae','kick',.3,1,6,150],['p','dArmV','snare',.3,1.1,8,200],['p','dArmH','snare',.3,1.1,8,200],['p','dHoved','hihat',.3,1,10,160],['p','dSpot','brill',.2,1,40,300]]},
 {navn:'På trommerne',til:'danser',b6:1,regler:[['p','dKnae','kick',.3,1,8,160],['p','dHop','kick',.6,1,6,300],['p','dArmV','snare',.3,1,10,220],['p','dHoved','hihat',.3,.8,15,180],['p','dHaar','hihat',.3,1,15,350],['p','dGulvPuls','kick',.4,1,6,250]]},
 {navn:'På vokalen',til:'danser',b6:1,regler:[['p','dArmH','vokal',.2,1,60,500],['p','dGlaede','vokal',.2,1,100,600],['p','dHoved','vokal',.25,.8,60,400],['p','dKrop','vokal',.3,.6,80,500],['p','dSpot','vokal',.2,.9,50,400]]},
 {navn:'Hele bandet',til:'danser',b6:1,regler:[['p','dKnae','kick',.3,1,8,160],['p','dArmV','snare',.3,1,10,220],['p','dArmH','vokal',.2,1,60,500],['p','dHofte','bas',.2,.9,80,400],['p','dKjole','mid',.25,1,40,300],['p','dHaar','hihat',.3,1,15,350],['p','dGlaede','rms',.2,1,120,600],['p','dSpot','brill',.2,.9,50,400]]},
 {navn:'Rolig',til:'diskokugle',b6:1,regler:[['p','kIntensitet','rms',.2,.8,150,700],['p','kFarveH','centroid',0,1,250,600],['p','kHastighed','bas',.2,.6,120,500]]},
 {navn:'Energisk',til:'diskokugle',b6:1,regler:[['p','kGlimt','kick',.3,1.2,5,150],['p','kIntensitet','rms',.2,1.2,40,300],['p','kStraaler','snare',.3,1,10,200],['p','kHastighed','flux',.3,1,20,300]]},
 {navn:'På trommerne',til:'diskokugle',b6:1,regler:[['p','kGlimt','kick',.3,1,5,150],['p','kSpots','snare',.3,1,8,200],['p','kIntensitet','hihat',.3,.8,10,150],['p','kHastighed','kick',.4,.8,20,300]]},
 {navn:'På vokalen',til:'diskokugle',b6:1,regler:[['p','kIntensitet','vokal',.2,1,60,500],['p','kFarveH','vokal',.2,1,100,600],['p','kGlimt','vokal',.4,.8,20,250],['p','kStraalelaengde','vokal',.2,1,80,500]]},
 {navn:'Hele bandet',til:'diskokugle',b6:1,regler:[['p','kGlimt','kick',.3,1,5,150],['p','kSpots','snare',.3,1,8,200],['p','kStraaler','hihat',.3,.9,10,200],['p','kIntensitet','bas',.2,1,60,400],['p','kFarveH','centroid',0,1,250,600],['p','kHastighed','rms',.2,.8,100,500]]},
 {navn:'Rolig',til:'morgenstjerne',b6:1,regler:[['p','storrelse','bas',.2,.8,80,500],['p','svaev','rms',.2,.8,150,700],['p','farveH','centroid',0,1,250,600]]},
 {navn:'Energisk',til:'morgenstjerne',b6:1,regler:[['p','skala','kick',.3,1.2,8,220],['p','piglaengde','snare',.3,1.2,10,220],['p','drej','flux',.2,1.2,15,250],['p','loeft','hihat',.3,1,10,200]]},
 {navn:'På trommerne',til:'morgenstjerne',b6:1,regler:[['p','skala','kick',.3,1,10,250],['p','piglaengde','snare',.3,1,10,250],['p','glod','hihat',.3,.8,8,150],['p','drej','kick',.4,.8,20,250]]},
 {navn:'På vokalen',til:'morgenstjerne',b6:1,regler:[['p','svaev','vokal',.2,1,60,400],['p','loeft','vokal',.2,1,60,400],['p','piglaengde','vokal',.25,.9,60,350],['p','farveH','vokal',.2,1,100,600]]},
 {navn:'Hele bandet',til:'morgenstjerne',b6:1,regler:[['p','piglaengde','hmid',.3,1,20,250],['p','storrelse','bas',.2,1,20,250],['p','drej','flux',.2,1,20,250],['p','skala','kick',.3,1,20,250],['p','svaev','vokal',.2,1,20,250],['p','loeft','vokal',.2,1,20,250],['p','glod','hihat',.3,.8,8,150]]},
 {navn:'Rolig',b6:1,regler:[['p','storrelse','bas',.2,.8,100,500],['p','glod','rms',.2,.7,150,700],['p','farveH','centroid',0,1,250,600]]},
 {navn:'Energisk',b6:1,regler:[['p','skala','kick',.3,1.2,8,220],['p','glod','snare',.3,1,8,200],['p','drej','flux',.2,1,15,250],['p','svaev','hihat',.3,.8,10,200]]},
 {navn:'På trommerne',b6:1,regler:[['p','skala','kick',.3,1,8,250],['p','glod','snare',.3,1,8,200],['p','rotation','hihat',.3,1,10,200]]},
 {navn:'På vokalen',b6:1,regler:[['p','svaev','vokal',.2,1,60,400],['p','loeft','vokal',.2,1,60,400],['p','glod','vokal',.25,.9,60,400],['p','farveH','vokal',.2,1,100,600]]},
 {navn:'Hele bandet',b6:1,regler:[['p','skala','kick',.3,1,8,250],['p','glod','snare',.3,1,8,200],['p','drej','flux',.2,1,15,250],['p','storrelse','bas',.2,.9,80,400],['p','svaev','vokal',.2,1,60,400],['p','farveH','centroid',0,1,250,600]]}];
const NE11_FIGNAVN={danser:'danseren',diskokugle:'discokuglen',morgenstjerne:'Morgenstjernen'};
function ne11Navn(sk){return sk.navn+(sk.gruppe?'':sk.til?' · '+(NE11_FIGNAVN[sk.til]||sk.til):' · alle figurer')}
function ne11Alle(){return NE11_STD.concat((set.ne&&Array.isArray(set.ne.skabeloner))?set.ne.skabeloner:[])}
/* En regel i en skabelon: ['p', egenskab, lyd, tærskel, styrke, attack, release] eller ['e', effekt, …]. Dansernes regler uden tal bruger DANS_STD. */
function ne11Regel(r){if(r.length===2&&typeof DANS_STD!=='undefined'&&DANS_STD[r[1]]){const s=DANS_STD[r[1]];return{type:'p',mal:r[1],band:s[0],thr:s[1],gain:1,att:s[2],rel:s[3],fra:s[4],til:s[5]}}return{type:r[0],mal:r[1],band:r[2],thr:r[3],gain:r[4],att:r[5],rel:r[6],curve:r[7],gap:r[8],inv:r[9]}}
function ne11Passer(sk,fk){if(sk.gruppe)return fk==='g:'+sk.gruppe;if(!fk.startsWith('f:'))return false;const o=fase2.objekter.find(x=>x.id===fk.slice(2));if(!o||!o.lag||!o.lag[0])return false;let P=[];try{P=propsFor(o.lag[0].form)}catch(e){}return sk.regler.some(r=>r[0]==='p'&&P.includes(r[1]))}
function neBrugSkabelon(sk,fk){if(!ne11Passer(sk,fk)){neToast('Skabelonen '+sk.navn+' passer ikke til '+((NE2.N.get(fk)||{}).navn||fk),true);return}
 let ny=0;const over=[];const o=fk.startsWith('f:')?fase2.objekter.find(x=>x.id===fk.slice(2)):null;let P=[];try{if(o)P=propsFor(o.lag[0].form);if(sk.gruppe==='Bane')syncTargets()}catch(e){}
 sk.regler.map(ne11Regel).forEach(r=>{let eff;if(r.type==='p'){if(!P.includes(r.mal)){over.push(r.mal);return}eff=tidOf(o,0,r.mal);const e=o.lag[0].egenskaber[r.mal];if(e&&e.fra===e.til){if(r.fra!=null&&r.til!=null){e.fra=r.fra;e.til=r.til}else if(typeof MS_FRA!=='undefined'&&MS_FRA[r.mal]!=null){e.fra=MS_FRA[r.mal];e.til=MS_TIL[r.mal]}else if(typeof DANS_STD!=='undefined'&&DANS_STD[r.mal]){e.fra=DANS_STD[r.mal][4];e.til=DANS_STD[r.mal][5]}/* v9.90: danserens bevægelser */else if(PROPS[r.mal]){const q=PROPS[r.mal];e.til=Math.min(q[2],e.fra+(q[2]-q[1])*.3)}}}
  else{eff=r.mal;if(!TARGETS.some(t=>t.id===eff)){over.push(r.mal);return}}
  const m={band:r.band,effect:eff,thr:r.thr??.3,gain:r.gain??1,att:r.att??20,rel:r.rel??200,curve:r.curve??1,gap:r.gap??120,min:true};if(r.inv)m.inv=true;const k=neKombFor(eff);if(k!=='max')m.komb=k;Regler.tilfoej(m,true);ny++});
 try{if(o)persistObj();save();renderMaps()}catch(e){}NE2.valgt=fk;ne2Byg();
 neToast('Skabelon '+sk.navn+' på '+((NE2.N.get(fk)||{}).navn||fk)+': '+ny+(ny===1?' regel':' regler')+(over.length?' · sprunget over (figuren har ikke målet): '+over.map(p=>PROPS[p]?PROPS[p][0]:p).join(', '):''))}
function neSkabelonVaelg(sk){const sel=NE2.valgt&&NE2.N.get(NE2.valgt);if(sel&&sel.kol==='figur'&&ne11Passer(sk,sel.key)){neBrugSkabelon(sk,sel.key);return}
 const F=[...(fase2.objekter||[]).filter(o=>!o.skabelon).map(o=>['f:'+o.id,o.navn]),...NE2_GRUPPER.slice(0,5).map(g=>['g:'+g,g])].filter(([k])=>ne11Passer(sk,k));
 if(!F.length){neToast('Skabelonen '+sk.navn+' passer ikke til nogen af dine figurer',true);return}const fl=$('ne-flade');ne5Menu(Math.max(20,fl.clientWidth/2-140),60,'Hvilken figur? · '+sk.navn,[['Figurer, skabelonen passer til',F]],k=>neBrugSkabelon(sk,k))}
function neGemSkabelon(fk){const n=NE2.N.get(fk);if(!n)return;const R=[];maps.forEach(m=>{const fg=neFigurAf(m.effect);if(fg.key!==fk)return;const p=String(m.effect).startsWith('obj:')?String(m.effect).split(':')[3]:null;R.push([p?'p':'e',p||m.effect,m.band,m.thr,m.gain,m.att,m.rel,m.curve??1,m.gap??120,!!m.inv])});
 if(!R.length){neToast(n.navn+' har ingen regler at gemme',true);return}set.ne=set.ne||{};set.ne.skabeloner=Array.isArray(set.ne.skabeloner)?set.ne.skabeloner:[];const navn='Mine: '+n.navn+' ('+(set.ne.skabeloner.length+1)+')';const sk={navn,regler:R};if(n.gruppe)sk.gruppe=n.navn;set.ne.skabeloner.push(sk);
 try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}neToast('Gemt som skabelon "'+navn+'" ('+R.length+(R.length===1?' regel':' regler')+'); find den i Ctrl+K',true);ne2Kp(true);return sk}
/* Ctrl+K, + Tilføj (Figur) og figurens kontrolpanel */
{const gl=neKpPunkter;window.neKpPunkter=function(L){gl(L);if(!NE.byg)return;ne11Alle().forEach(sk=>L.push({n:'Skabelon: '+ne11Navn(sk),kat:'Tilføj node · Skabelon ('+sk.regler.length+' regler)',fn:()=>{try{fgVaelg('lyd','w33',true);fgVisHost('lyd')}catch(e){}setTimeout(()=>neSkabelonVaelg(sk),60)},ne:{farve:'var(--ne-kolonne-regel)'}}))}}
{const gl=ne6Valg;window.ne6Valg=function(kol){const v=gl(kol);if(kol==='figur')v.push(['Skabeloner',ne11Alle().map((sk,i)=>['sk:'+i,ne11Navn(sk)+' ('+sk.regler.length+' regler)'])]);return v}}
{const gl=ne6Valgt;window.ne6Valgt=function(kol,v){if(kol==='figur'&&String(v).startsWith('sk:')){const sk=ne11Alle()[+String(v).slice(3)];if(sk)neSkabelonVaelg(sk);return}return gl(kol,v)}}
{const gl=ne2Kp;window.ne2Kp=function(ny){gl(ny);const n=NE2.valgt&&NE2.N.get(NE2.valgt),box=document.querySelector('#ne-kp .ne-kp-ind');if(!n||!box||n.kol!=='figur')return;const S=ne11Alle().map((sk,i)=>[sk,i]).filter(([sk])=>ne11Passer(sk,n.key));
 box.insertAdjacentHTML('beforeend','<small>Skabeloner</small><div class="ne-ret-knapper">'+S.map(([sk,i])=>'<button class="ne-k" data-ne11="brug" data-i="'+i+'" title="Læg skabelonens '+sk.regler.length+' regler på '+neHtml(n.navn)+'. Kan fortrydes i ét trin.">'+neHtml(sk.navn)+'</button>').join('')+'<button class="ne-k" data-ne11="gem" title="Gem '+neHtml(n.navn)+'s regler som en ny skabelon.">Gem som skabelon</button></div>')}}
function ne11Start(){const rod=$('ne');if(!rod)return;rod.addEventListener('click',e=>{const b=e.target.closest('[data-ne11]');if(!b)return;const n=NE2.valgt&&NE2.N.get(NE2.valgt);if(!n)return;if(b.dataset.ne11==='gem')neGemSkabelon(n.key);else{const sk=ne11Alle()[+b.dataset.i];if(sk)neBrugSkabelon(sk,n.key)}})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne11Start);else setTimeout(ne11Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 11): SKABELONER ========== */
