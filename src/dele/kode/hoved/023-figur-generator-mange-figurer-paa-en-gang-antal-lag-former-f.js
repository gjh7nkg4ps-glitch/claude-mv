/* ========== FIGUR-GENERATOR: mange figurer på én gang (antal, lag, former, farver efter toneart, tekstur, ringe, kobling, frø og Fortryd) ========== */
/* Laver op til 32 figurer (så mange, der er plads til) med tilfældige lag. Former: tilfældige af de 14 (3D-former halvt så ofte) eller kun cirkler. Farver: efter sangens toneart (grundtone × 30 grader som farvetone, lysere og mættere i dur og dæmpet i mol) eller tilfældige; uden en analyseret toneart bruges tilfældige. Tekstur: ingen, tilfældig (cirka hvert andet lag) eller én type. Ringe: nogle lag bliver en lille form gentaget i en ring rundt om figuren. Kobling: figurerne forbindes tilfældigt til musikken (som Tilfældige figur-egenskaber). Et frø gør valget gentageligt, og Fortryd figurer sætter alt tilbage (op til 10 trin). Behold lægger figurerne til dem, du har (der er plads til 32 i alt); Erstat sletter først dine figurer (men ikke klods-modellen) og deres forbindelser. */
const FGEN={foer:[],max:10,froe:''};
function fgenSnap(){return{maps:JSON.parse(JSON.stringify(maps)),objekter:JSON.parse(JSON.stringify(fase2.objekter)),selO,selL}}
function lavFigurer(opt){opt=opt||{};
 const tal=(v,def,lo,hi)=>{const x=String(v).trim()===''||isNaN(+v)?def:+v;return Math.max(lo,Math.min(hi,Math.round(x)))};
 const antal=tal(opt.antal??$('fg-antal').value,8,1,MAXO);let lagMin=tal(opt.lagMin??$('fg-lagmin').value,1,1,MAXL),lagMaks=tal(opt.lagMaks??$('fg-lagmaks').value,3,1,MAXL);if(lagMaks<lagMin)lagMaks=lagMin;
 const former=opt.former??document.querySelector('input[name="fg-former"]:checked').value,farve=opt.farve??$('fg-farve').value,tekst=opt.tekst??$('fg-tekst').value,ring=opt.ring??$('fg-ring').checked,kobl=opt.kobl??$('fg-kobl').checked,erstat=opt.erstat??(document.querySelector('input[name="fg-mode"]:checked').value==='erstat');
 const froeInd=String(opt.froe!==undefined?opt.froe:$('fg-froe').value).trim(),froe=froeInd||Math.floor(Math.random()*1e9).toString(36);
 const behold=fase2.objekter.filter(o=>erstat?o.skabelon:true),plads=MAXO-behold.length;
 if(plads<1){msg('Figur-generator: der er ingen plads (højst '+MAXO+' figurer). Slet nogle, eller vælg Erstat mine figurer. Intet er ændret.');return false}
 const n=Math.min(antal,plads);FGEN.foer.push(fgenSnap());if(FGEN.foer.length>FGEN.max)FGEN.foer.shift();
 if(erstat){const vaek=fase2.objekter.filter(o=>!o.skabelon).map(o=>o.id);fase2.objekter=behold.slice();Regler.sletHvor(m=>vaek.some(id=>m.effect.startsWith('obj:'+id+':')||m.effect==='liv:'+id),true)}
 const rng=rndRng('fg:'+froe),R=(a,b,st)=>+(Math.round((a+rng()*(b-a))/st)*st).toFixed(3),pick=a=>a[Math.floor(rng()*a.length)];
 const cl=(q,v)=>{const d=PROPS[q];return +Math.max(d[1],Math.min(d[2],Math.round(v/d[3])*d[3])).toFixed(4)};
 const P=SHOWPROFIL,tone=farve==='toneart'&&P&&P.toneart&&isFinite(P.toneart.rod)?P.toneart:null;
 const farveVal=()=>{if(tone){const dur=tone.modus==='dur',off=dur?[0,0,30,60,150,180]:[0,0,-30,-60,-150,210];return{H:((tone.rod*30+pick(off))%360+360)%360,S:dur?R(70,95,1):R(55,80,1),L:dur?R(55,70,1):R(45,60,1)}}return{H:R(0,359,1),S:R(60,95,1),L:R(45,70,1)}};
 const baseStr=Math.max(.04,Math.min(.13,.14-n*.0025)),pos=[],dmin=Math.max(.06,.22/Math.sqrt(n)),formKeys=Object.keys(FORMER).filter(k=>!Rytme.SAERLIGE_FORMER.includes(k)),TY=['striber','prikker','tern','boelger','stoej'];
 const nyeFig=[];let lagI=0,teksturLag=0,ringLag=0;
 for(let i=0;i<n;i++){let p=null;for(let f=0;f<30;f++){const q={x:R(.1,.9,.01),y:R(.15,.85,.01)};p=q;if(pos.every(r=>Math.hypot(r.x-q.x,r.y-q.y)>=dmin))break}
  pos.push(p);const o=nyObjekt(nyId(),'Figur '+(fase2.objekter.length+1));o.pos=p;o.lag=[];const L=R(lagMin,lagMaks,1),fv=farveVal();
  for(let li=0;li<L;li++){
   const form=former==='uden'?'cirkel':(()=>{let tot=0;const w=formKeys.map(f=>{const x=(f==='kugle3d'||f==='terning')?.5:1;tot+=x;return[f,x]});let r=rng()*tot;for(const[f,x]of w){r-=x;if(r<=0)return f}return formKeys[0]})();
   const l={form,egenskaber:nyEgenskaber(form)},e=l.egenskaber,s=(q,v)=>{if(e[q])e[q]={fra:cl(q,v),til:cl(q,v)}};const ringL=ring&&li>0&&rng()<.6;
   s('storrelse',ringL?R(.02,.05,.005):(li===0?baseStr*R(.8,1.2,.01):baseStr*R(.3,.7,.01)));
   s('farveH',fv.H+li*R(-12,12,1));s('farveS',fv.S);s('farveL',fv.L+(li%2?8:0));s('alpha',li===0?1:R(.6,1,.01));
   if(rng()<.35)s('kontur',R(.2,.7,.01));if(rng()<.35)s('glod',R(.2,.7,.01));if((form==='cirkel'||form==='pigkugle')&&rng()<.4)s('skygge',R(.3,.9,.01));
   s('rotation',R(0,359,1));if(rng()<.3)s('drej',R(-2,2,.1));
   if(e.punkter)s('punkter',form==='polygon'?R(3,8,1):form==='stjerne'?R(4,12,1):form==='blomst'?R(5,12,1):(form==='boelge'||form==='spiral')?R(8,16,1):R(6,16,1));
   if(e.indre)s('indre',R(.3,.7,.01));if(e.afrunding)s('afrunding',R(0,.5,.01));if(e.tykkelse)s('tykkelse',R(.1,.5,.01));if(e.piglaengde)s('piglaengde',R(.2,.8,.01));if(e.pigbredde)s('pigbredde',R(.3,.8,.01));
   if(ringL){s('kopier',R(3,16,1));s('kopiRadius',R(.06,.22,.005));s('kopiDrej',rng()<.5?R(-1.5,1.5,.05):0);s('kopiVend',pick([0,1,1,.5]));ringLag++}
   if(form!=='kugle3d'&&form!=='terning'&&tekst!=='ingen'){const ty=tekst==='tilfaeldig'?(rng()<.5?pick(TY):null):tekst;if(ty){l.tekstur=ty;s('teksturStyrke',R(.3,.8,.01));s('teksturSkala',R(.08,.3,.01));s('teksturVinkel',R(-90,90,1));teksturLag++}}
   o.lag.push(l);lagI++}
  fase2.objekter.push(o);nyeFig.push(o)}
 let koblet=0;if(kobl)koblet=rndTilfoej('fig',Math.min(16,2*n),false,rng).lagt;
 selO=fase2.objekter.indexOf(nyeFig[0]);selL=0;syncTargets();syncHandles();formUI();renderMaps();save();meshUI&&meshUI();
 FGEN.froe=froe;$('fg-brugt').textContent='Brugt frø: '+froe+' (skriv det i feltet Frø for at få de samme figurer igen)';
 msg('Figur-generator: '+n+(n<antal?' (af '+antal+'; der var kun plads til '+n+')':'')+' nye figurer med '+lagI+' lag ('+(former==='uden'?'kun cirkler':'tilfældige former')+'), farver '+(tone?'efter sangens toneart ('+tone.navn+')':(farve==='toneart'?'tilfældige (der er endnu ingen analyseret toneart)':'tilfældige'))+', tekstur på '+teksturLag+' lag, ringe på '+ringLag+' lag, '+koblet+' koblinger til musikken, '+(erstat?'dine gamle figurer er erstattet':'dine gamle figurer er beholdt')+'. Frø: '+froe+'.'+mangeAdv()+' Fortryd figurer sætter alt tilbage.');return true}
function fortrydFigurer(){if(!FGEN.foer.length){msg('Fortryd figurer: der er intet at fortryde.');return false}const s=FGEN.foer.pop();Regler.erstat(s.maps,true);fase2.objekter=s.objekter;if(!fase2.objekter.length)fase2.objekter.push(nyObjekt(nyId(),'Figur 1'));fase2.objekter.forEach(sikrEgenskaber);selO=Math.max(0,Math.min(s.selO,fase2.objekter.length-1));selL=0;syncTargets();syncHandles();formUI();renderMaps();save();meshUI&&meshUI();msg('Fortryd figurer: figurer og forbindelser er tilbage, som de var'+(FGEN.foer.length?' ('+FGEN.foer.length+' trin mere kan fortrydes).':'.'));return true}
$('fg-lav').onclick=()=>lavFigurer();$('fg-fortryd').onclick=fortrydFigurer;
$('fg-nyfroe').onclick=()=>{$('fg-froe').value=Math.floor(Math.random()*1e9).toString(36);msg('Nyt frø: '+$('fg-froe').value+'. Tryk Lav figurer for at få netop disse figurer igen og igen.')};
/* ========== SLUT: FIGUR-GENERATOR ========== */

