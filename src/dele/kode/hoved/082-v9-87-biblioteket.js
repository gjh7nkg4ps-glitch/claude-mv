/* ========== v9.87: BIBLIOTEKET ==========
   Brugerens B3 (P8.6) med valg C (P8.9): ét vindue, Biblioteket (w36), i 3 · Regler til venstre for matrixen og Node-editoren.
   Hylden Shows: FORINDST (Indbygget), BIB.mine (Mit; listen rytme-bib uden loft; Opsætning 1–20 flyttes over én gang, set.bib3a) og
   Sangens show (det gemte show til den valgte sang). Hylden Figurer: BIB_FIG (danser, to piger, discokugle, Morgenstjerne, Diskodronningerne,
   Perfect 1 og 2, tom figur) og Klodsbanen (regel-sæt til effekt-grupper). Hvert kort har et lille billede (tegnObj på et lærred, i hvile).
   Ved det valgte kort: Brug · Vis reglerne · Lav en kopi (Mit); et Mit kan omdøbes og slettes. Regel-sæt (ne11Alle: NE11_STD + set.ne.skabeloner)
   vises hos en figur, når figuren har alle de egenskaber, det styrer (bibPasser); figurens egne (til) øverst, fælles med mærket "fælles".
   Brug på et regel-sæt lægger det på en figur på scenen af den slags (Regler.samlet → ét Fortryd); findes der flere, spørges der. */
var BIB={noegle:'rytme-bib',mine:[],hylde:'shows',valgt:null,vis:false,cache:{},klar:false};
const BIB_FIG=[{id:'danser',navn:'Danser',form:'danser',op:'danser',tekst:'Én danser med arme, ben, hofte, hår og kjole, der kan styres hver for sig.'},
 {id:'piger',navn:'To piger ved stangen',form:'danser',op:'piger',tekst:'Lyshåret pige og Pige på stangen (to dansere) ved en stang.'},
 {id:'diskokugle',navn:'Discokugle',form:'discokugle',op:'diskokugle',tekst:'En discokugle med glimt, lys og farve.'},
 {id:'morgenstjerne',navn:'Morgenstjerne',form:'pigkugle',op:'morgenstjerne',tekst:'Pigkuglen med pigge, der kan vokse, dreje, svæve og løfte sig.'},
 {id:'dronninger',navn:'Diskodronningerne',form:'danser',op:'dronninger',tekst:'Tre dansere i et show.'},
 {id:'perfect1',navn:'Perfect 1',form:'cirkel',alle:true,op:'perfect1',tekst:'Perfect 1: figurer med lag og teksturer.'},
 {id:'perfect2',navn:'Perfect 2',form:'cirkel',alle:true,op:'perfect2',tekst:'Perfect 2: flere lag, teksturer, gentagelser og spejlinger.'},
 {id:'nyt',navn:'Tom figur',form:'cirkel',op:'nyt',tekst:'En tom figur med ét lag (en cirkel). Byg den færdig i Egenskaber.'},
 {id:'bane',navn:'Klodsbanen',form:null,gruppe:'Bane',tekst:'Regel-sæt til klodsbanen og effekt-grupperne (ikke en figur).'}];
function bibLaes(){try{const d=JSON.parse(localStorage.getItem(BIB.noegle));BIB.mine=Array.isArray(d)?d.filter(x=>x&&x.id&&x.data):[]}catch(e){BIB.mine=[]}}
function bibSkriv(){try{lsGem(BIB.noegle,JSON.stringify(BIB.mine))}catch(e){msg('Biblioteket kunne ikke gemmes (browseren tillader ikke lagring her).')}}
function bibNyId(){return 'm'+Date.now().toString(36)+Math.floor(Math.random()*1e4).toString(36)}
/* Opsætning 1–20 flyttes over én gang; pladserne bliver stående, så gamle knapper og test virker */
function bibFlytPladser(){if(set.bib3a)return;set.bib3a=1;let n=0;try{SLOTS.forEach(k=>{const d=slotRead(k);if(!d||BIB.mine.some(y=>y.id==='ms'+k))return;/* v9.91: ikke to gange (fx efter Nulstil alt) */BIB.mine.push({id:'ms'+k,navn:d.navn||('Opsætning '+slotNr(k)),gemt:d.gemt||new Date().toISOString(),laast:!!d.laast,data:{v:2,maps:d.maps,master:d.master,objekter:d.objekter,pos:d.pos,scene:d.scene,lyd:d.lyd,...(d.show?{show:d.show}:{})}});n++})}catch(e){}
 if(n)bibSkriv();try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}if(n)setTimeout(()=>{const s=$('status'),f=s&&/Alt er nulstillet/.test(s.textContent)?s.textContent+' ':'';msg(f+n+(n===1?' opsætning':' opsætninger')+' fra Opsætning 1–20 er flyttet til Biblioteket under Mine.')},2000)}
function bibMitAktivt(){const a=String(active||'');if(!a.startsWith('m:'))return null;return BIB.mine.find(x=>x.id===a.slice(2))||null}
function bibData(){return{v:2,maps:kl(maps),master:gmaster,objekter:kl(fase2.objekter),pos:kl(pos),scene:kl(scene),lyd:kl(lyd),...(SHOW?{show:kl(SHOW)}:{})}}
function bibGemShow(navn,id){let x=id?BIB.mine.find(y=>y.id===id):null;if(x&&x.laast){msg(x.navn+' er låst og kan ikke overskrives.');return null}
 if(!x){x={id:bibNyId(),navn:navn||('Mit show '+(BIB.mine.length+1)),gemt:'',laast:false,data:null};BIB.mine.push(x)}
 x.data=bibData();x.gemt=new Date().toISOString();bibSkriv();active='m:'+x.id;meshSnap=snapStr();try{meshUI()}catch(e){}try{indlUI()}catch(e){}bibTegn();return x}
function bibHent(id){const x=BIB.mine.find(y=>y.id===id);if(!x)return;anvend(x.data,'m:'+x.id,x.navn+' er hentet.');bibTegn()}
async function bibSlet(id){const x=BIB.mine.find(y=>y.id===id);if(!x)return;if(x.laast){msg(x.navn+' er låst og kan ikke slettes.');return}
 const r=await spoerg({titel:'Slet '+x.navn+'?',tekst:'Showet slettes fra Biblioteket. Det kan ikke fortrydes.',ok:'Ja, slet',fare:true});if(!r.ok){msg('Intet er slettet.');return}
 BIB.mine=BIB.mine.filter(y=>y.id!==id);bibSkriv();if(active==='m:'+id)active=null;if(BIB.valgt==='s:m:'+id)BIB.valgt=null;msg(x.navn+' er slettet.');bibTegn()}
function bibOmdoeb(id,navn){const x=BIB.mine.find(y=>y.id===id);if(!x||!navn)return;x.navn=navn.slice(0,40);bibSkriv();try{indlUI()}catch(e){}bibTegn()}
function bibKopi(kort){if(kort.slags==='show'){let d=null;try{d=kort.f?(kort.f.auto?null:kort.f.lav()):(kort.mit?kl(kort.mit.data):null)}catch(e){}if(!d){msg(kort.navn+' kan ikke kopieres (den laves efter sangen).');return}
  const x={id:bibNyId(),navn:kort.navn+' (kopi)',gemt:new Date().toISOString(),laast:false,data:Object.assign({v:2,master:1},d)};BIB.mine.push(x);bibSkriv();msg(x.navn+' ligger nu under Mine.');bibTegn();bibVaelg('s:m:'+x.id);return}
 if(kort.slags==='saet'){set.ne=set.ne||{};set.ne.skabeloner=Array.isArray(set.ne.skabeloner)?set.ne.skabeloner:[];const sk=kl(kort.sk);sk.navn=kort.sk.navn+' (kopi)';delete sk.std;set.ne.skabeloner.push(sk);try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}msg(sk.navn+' ligger nu under Mine regel-sæt.');bibTegn()}}
/* ---- regel-sæt pr. figur (valg C) ---- */
function bibSaetAlle(){const L=[];NE11_STD.forEach((sk,i)=>L.push({sk,std:true,i}));((set.ne&&Array.isArray(set.ne.skabeloner))?set.ne.skabeloner:[]).forEach((sk,i)=>L.push({sk,std:false,i}));return L}
function bibPasser(sk,fig){if(sk.gruppe)return !!fig.gruppe;if(fig.gruppe)return false;if(!fig.form)return false;let P=[];try{P=propsFor(fig.form)}catch(e){return false}const R=sk.regler.filter(r=>r[0]==='p'||r.length===2);return R.length>0&&R.every(r=>P.includes(r[1]))}
function bibSaetFor(fig){const L=bibSaetAlle().filter(x=>bibPasser(x.sk,fig)).map(x=>({...x,egen:x.sk.til===fig.id||(fig.form==='danser'&&x.sk.til==='danser')||(!x.std&&x.sk.til===fig.id)}));return L.filter(x=>x.egen||(!x.sk.til&&!L.some(y=>y.egen&&y.sk.navn===x.sk.navn))).sort((a,b)=>(b.egen-a.egen)||(a.std===b.std?0:a.std?-1:1))}/* v9.90: et fælles sæt med samme navn som figurens eget vises ikke */
function bibRegelTekst(r){const q=ne11Regel(r);const navnM=q.type==='p'?(PROPS[q.mal]?PROPS[q.mal][0]:q.mal):(TARGETS.find(t=>t.id===q.mal)||{navn:q.mal}).navn;let b=q.band;try{b=neLtNavn(q.band)}catch(e){}return b+' → '+navnM+' · tærskel '+String(q.thr??.3).replace('.',',')+' · styrke ×'+String(q.gain??1).replace('.',',')+' · '+(q.att??20)+'/'+(q.rel??200)+' ms'+(q.inv?' · vendt om':'')}
/* ---- kortene ---- */
function bibKortShows(){const L=[];FORINDST.filter(f=>!f.skjult).forEach(f=>L.push({k:'s:f:'+f.id,slags:'show',navn:f.navn,grp:f.grp,mit:null,f,tekst:f.tekst||'',auto:!!f.auto}));
 BIB.mine.forEach(x=>L.push({k:'s:m:'+x.id,slags:'show',navn:x.navn,grp:'Mine',mit:x,f:null,tekst:(x.gemt?'gemt '+opsDato(x.gemt):'')+((x.data&&x.data.objekter)?' · '+x.data.objekter.filter(o=>o.synlig!==false).length+' figurer':'')+((x.data&&x.data.maps)?' · '+x.data.maps.length+' regler':'')+(x.laast?' · låst':'')}));
 try{const k=pakkeNoegle();if(k&&localStorage.getItem(k)){L.push({k:'s:sang',slags:'show',navn:'Sangens show',grp:'Mine',mit:null,f:null,sang:true,tekst:'Det show, Lav show lavede og gemte til den valgte sang. Brug henter det.'})}}catch(e){}
 return L}
function bibKortFigurer(){return BIB_FIG.map(f=>({k:'g:'+f.id,slags:'figur',navn:f.navn,grp:f.gruppe?'Effekt-grupper':'Figurer',fig:f,tekst:f.tekst}))}
function bibKort(){return BIB.hylde==='shows'?bibKortShows():bibKortFigurer()}
function bibFind(k){return bibKort().find(x=>x.k===k)||null}
/* ---- billederne: figurerne i hvile på et lille lærred ---- */
function bibObjekterFor(kort){const key=kort.k+(kort.mit?':'+kort.mit.gemt:'');if(BIB.cache[key]!==undefined)return BIB.cache[key];let ob=null;
 try{if(kort.slags==='show'){if(kort.auto||kort.sang)ob=null;else if(kort.f){const d=kort.f.lav();ob=(d&&d.objekter)||[]}else if(kort.mit)ob=(kort.mit.data&&kort.mit.data.objekter)||[]}
  else if(kort.fig){const f=kort.fig;if(f.gruppe)ob=null;else if(f.op==='nyt'){const o=nyObjekt('bib','Tom figur');o.pos={x:.5,y:.5};o.synlig=true;ob=[o]}else if(f.op==='morgenstjerne'){const o=nyMorgenstjerne();o.pos={x:.5,y:.5};o.synlig=true;ob=[o]}
   else{const fn=({danser:opDanser,piger:opPiger,diskokugle:opDisko,dronninger:opDronninger,perfect1:()=>opPerfect(1),perfect2:()=>opPerfect(2)})[f.op];if(fn){const d=lavIsoleret(({skab})=>{skab(fn)});ob=(d&&d.objekter)||[]}}}}catch(e){ob=null}
 BIB.cache[key]=ob;return ob}
function bibTegnBillede(c,kort){const dp=Math.min(2,devicePixelRatio||1),W=Math.round(c.clientWidth*dp)||320,H=Math.round(W*9/16);if(c.width!==W)c.width=W;if(c.height!==H)c.height=H;const g=c.getContext('2d');g.fillStyle='#0b0d14';g.fillRect(0,0,W,H);
 const ob=bibObjekterFor(kort);if(!ob){g.fillStyle='rgba(255,213,74,.6)';g.font=Math.round(11*dp)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(kort.auto?'vælges efter din sang':kort.sang?'gemt til sangen':kort.fig&&kort.fig.gruppe?'klodsbanen':'intet billede',W/2,H/2);return}
 const L=ob.filter(o=>o.synlig!==false&&!o.skabelon);if(!L.length){g.fillStyle='rgba(230,237,244,.4)';g.font=Math.round(11*dp)+'px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('ingen figurer på scenen',W/2,H/2);return}
 L.slice(0,12).forEach(o=>{try{tegnObj(g,W*(o.pos?o.pos.x:.5),H*(o.pos?o.pos.y:.5),H,o,{},W,0,{kv:'spar'})}catch(e){}})}
/* ---- vinduet ---- */
function bibVis(hylde){if(hylde)BIB.hylde=hylde;try{if(set.lay3!=='ao-regler')lay3Anvend('ao-regler',true)}catch(e){}try{dkVis('w36')}catch(e){}bibTegn();const w=$('w36');if(w&&!w.hidden){const b=w.querySelector('.bib-k.bib-valgt')||w.querySelector('[data-bibh].on');if(b)try{b.focus({preventScroll:true})}catch(e){}}}
function bibVaelg(k){BIB.valgt=k;BIB.vis=false;bibTegn()}
function bibMaerke(kort){if(kort.slags==='show')return kort.mit?'Mit':'Indbygget';if(kort.slags==='figur')return 'Indbygget';return kort.std?'Indbygget':'Mit'}
function bibTegn(){const el=$('bib');if(!el)return;if(!BIB.klar){BIB.klar=true;bibLaes();bibFlytPladser()}
 const K=bibKort(),grp=[];K.forEach(x=>{let g=grp.find(y=>y.n===x.grp);if(!g){g={n:x.grp,l:[]};grp.push(g)}g.l.push(x)});
 const valgt=BIB.valgt?bibFind(BIB.valgt):null;
 let h='<div class="bib-top" role="tablist"><button class="bib-h'+(BIB.hylde==='shows'?' on':'')+'" data-bibh="shows" role="tab" aria-selected="'+(BIB.hylde==='shows')+'">Shows</button><button class="bib-h'+(BIB.hylde==='figurer'?' on':'')+'" data-bibh="figurer" role="tab" aria-selected="'+(BIB.hylde==='figurer')+'">Figurer</button><button class="bib-h'+(BIB.hylde==='effekter'?' on':'')+'" data-bibh="effekter" role="tab" aria-selected="'+(BIB.hylde==='effekter')+'">Effekter</button><span class="small bib-info">'+(BIB.hylde==='shows'?FORINDST.filter(f=>!f.skjult).length+' indbyggede · '+BIB.mine.length+' mine':BIB.hylde==='effekter'?psEffListe().length+' effekter · '+psSaetAlle().length+' regel-sæt':BIB_FIG.length+' figurer · '+bibSaetAlle().length+' regel-sæt')+'</span></div>';
 h+='<div class="bib-kort" role="listbox">'+grp.map(g=>'<h4>'+esc(g.n)+'</h4><div class="bib-g">'+g.l.map(x=>'<button class="bib-k'+(BIB.valgt===x.k?' bib-valgt':'')+'" data-bib="'+esc(x.k)+'" role="option" aria-selected="'+(BIB.valgt===x.k)+'" title="'+esc(x.tekst||'')+'"><canvas class="bib-c" width="320" height="180" aria-hidden="true"></canvas><b>'+esc(x.navn)+'</b><small class="bib-m bib-m-'+(bibMaerke(x)==='Mit'?'mit':'ind')+'">'+bibMaerke(x)+'</small></button>').join('')+'</div>').join('')+'</div>';
 h+='<div class="bib-det" id="bib-det">'+(valgt?bibDetalje(valgt):'<p class="small">Vælg et kort. Brug lægger på; Fortryd (Ctrl+Z) tager det af igen.</p>')+'</div>';
 el.innerHTML=h;el.querySelectorAll('.bib-k').forEach(b=>{const x=bibFind(b.dataset.bib);if(x)bibTegnBillede(b.querySelector('canvas'),x)})}
function bibDetalje(x){const mit=bibMaerke(x)==='Mit';let h='<div class="bib-dt"><b>'+esc(x.navn)+'</b> <small class="bib-m bib-m-'+(mit?'mit':'ind')+'">'+bibMaerke(x)+(x.mit&&x.mit.laast?' · låst':'')+'</small></div>'+(x.tekst?'<p class="small">'+esc(x.tekst)+'</p>':'');
 if(x.slags==='show'){h+='<div class="ab"><button data-biba="brug" data-k="'+esc(x.k)+'" title="Hent showet (regler, figurer, scene og lyd). Fortryd tager det af igen.">Brug</button><button class="ghost" data-biba="regler" data-k="'+esc(x.k)+'">Vis reglerne</button>'+(x.auto||x.sang?'':'<button class="ghost" data-biba="kopi" data-k="'+esc(x.k)+'" title="Lav en kopi under Mine, som du kan ændre, omdøbe og slette">Lav en kopi</button>')+(x.mit?'<button class="ghost" data-biba="omdoeb" data-k="'+esc(x.k)+'">Omdøb</button><button class="ghost fare" data-biba="slet" data-k="'+esc(x.k)+'"'+(x.mit.laast?' disabled':'')+'>Slet</button>':'')+'</div>';
  if(BIB.vis==='regler'){let R=null;try{R=x.f?(x.f.auto?null:x.f.lav()):x.mit?x.mit.data:null}catch(e){}h+='<div class="bib-regler">'+(R&&R.maps?'<b>'+R.maps.length+' regler</b><ul>'+R.maps.slice(0,80).map(m=>'<li>'+esc((()=>{let b=m.band;try{b=neLtNavn(m.band)}catch(e){}let e=m.effect;try{e=neMaalNavn(m.effect)}catch(x){}return b+' → '+e+' · tærskel '+String(m.thr??.3).replace('.',',')+' · ×'+String(m.gain??1).replace('.',',')})())+'</li>').join('')+(R.maps.length>80?'<li>…</li>':'')+'</ul>':'<p class="small">'+(x.auto?'Reglerne vælges efter den analyserede sang, når du bruger showet.':'Ingen regler at vise.')+'</p>')+'</div>'}}
 else if(x.slags==='figur'){const f=x.fig;if(!f.gruppe)h+='<div class="ab"><button data-biba="brug" data-k="'+esc(x.k)+'" title="Læg figuren på scenen. Fortryd tager den af igen.">Brug: læg på scenen</button></div>';
  const S=bibSaetFor(f);h+='<h4>Regel-sæt'+(f.gruppe?' til effekt-grupperne':' til '+esc(f.navn))+' ('+S.length+')</h4>'+(S.length?'<div class="bib-saet">'+S.map(q=>{const k='r:'+(q.std?'std':'mit')+':'+q.i;const aaben=BIB.vis==='saet:'+k;return '<div class="bib-s'+(aaben?' bib-s-aaben':'')+'"><div class="bib-sh"><b>'+esc(q.sk.navn)+'</b> <small class="bib-m bib-m-'+(q.std?'ind':'mit')+'">'+(q.std?'Indbygget':'Mit')+'</small>'+(q.egen?'':' <small class="bib-m bib-m-faelles" title="Et fælles regel-sæt: det passer til flere slags figurer">fælles</small>')+' <small>'+q.sk.regler.length+' regler</small></div><div class="ab"><button data-biba="saetbrug" data-k="'+esc(x.k)+'" data-s="'+k+'" title="Læg regel-sættet på en figur af denne slags på scenen. Fortryd tager det af i ét trin.">Brug</button><button class="ghost" data-biba="saetregler" data-k="'+esc(x.k)+'" data-s="'+k+'">'+(aaben?'Skjul reglerne':'Vis reglerne')+'</button>'+(q.std?'<button class="ghost" data-biba="saetkopi" data-k="'+esc(x.k)+'" data-s="'+k+'">Lav en kopi</button>':'<button class="ghost" data-biba="saetomdoeb" data-k="'+esc(x.k)+'" data-s="'+k+'">Omdøb</button><button class="ghost fare" data-biba="saetslet" data-k="'+esc(x.k)+'" data-s="'+k+'">Slet</button>')+'</div>'+(aaben?'<ul>'+q.sk.regler.map(r=>'<li>'+esc(bibRegelTekst(r))+'</li>').join('')+'</ul>':'')+'</div>'}).join('')+'</div>':'<p class="small">Ingen regel-sæt passer til denne figur endnu.</p>')}
 return h}
function bibSaetAf(k){const [_,slags,i]=k.split(':');const L=slags==='std'?NE11_STD:((set.ne&&set.ne.skabeloner)||[]);return{sk:L[+i],std:slags==='std',i:+i}}
function bibFigurerAf(fig){if(fig.gruppe)return[];if(fig.alle)return fase2.objekter.filter(o=>!o.skabelon);return fase2.objekter.filter(o=>!o.skabelon&&o.lag&&o.lag[0]&&o.lag[0].form===fig.form)}
function bibDirekte(fn){const d=FSF.direkte;FSF.direkte=true;try{Regler.samlet(fn)}finally{FSF.direkte=d}}/* Brug i Biblioteket lægger på med det samme (ikke forslag) i ét Fortryd-trin */
function bibBrugSaet(fig,q,oid){const sk=q.sk;if(fig.gruppe){bibDirekte(()=>neBrugSkabelon(sk,'g:'+sk.gruppe));return}
 const kand=bibFigurerAf(fig);let o=oid?kand.find(x=>x.id===oid):null;if(!o){const sel=fase2.objekter[selO];if(sel&&kand.includes(sel))o=sel}if(!o&&kand.length===1)o=kand[0];
 if(!o){if(!kand.length){msg('Der er ingen '+fig.navn.toLowerCase()+' på scenen. Tryk Brug: læg på scenen først.');return}
  const det=$('bib-det');if(det){det.insertAdjacentHTML('beforeend','<div class="bib-hvem" id="bib-hvem"><b>Hvilken figur?</b> '+kand.map(x=>'<button class="ghost" data-biba="saetbrug" data-k="g:'+esc(fig.id)+'" data-s="r:'+(q.std?'std':'mit')+':'+q.i+'" data-o="'+esc(x.id)+'">'+esc(x.navn)+'</button>').join('')+'</div>')}return}
 bibDirekte(()=>neBrugSkabelon(sk,'f:'+o.id));try{selO=fase2.objekter.indexOf(o);formUI()}catch(e){}}
function bibBrugFigur(fig){const fn=({danser:()=>opDanser(true),piger:()=>opPiger(true),diskokugle:()=>opDisko(true),dronninger:opDronninger,perfect1:()=>opPerfect(1),perfect2:()=>opPerfect(2),nyt:opNyt,morgenstjerne:()=>{addMorgenstjerne(true)}})[fig.op];if(!fn)return;
 const foer=new Set(fase2.objekter.map(o=>o.id));bibDirekte(()=>{fn();try{if(fig.op!=='nyt')skabHnd(fig.op,foer)}catch(e){}});try{fg34Byg()}catch(e){}}
{const bind=()=>{const el=$('bib');if(!el||el.dataset.bundet)return;el.dataset.bundet='1';
 el.addEventListener('click',async e=>{const hb=e.target.closest('[data-bibh]');if(hb){BIB.hylde=hb.dataset.bibh;BIB.valgt=null;BIB.vis=false;bibTegn();return}
  const kb=e.target.closest('.bib-k');if(kb){bibVaelg(kb.dataset.bib);return}
  const b=e.target.closest('[data-biba]');if(!b)return;const a=b.dataset.biba,x=bibFind(b.dataset.k);if(!x)return;
  if(a==='brug'){if(x.slags==='show'){if(x.sang){try{showHent()}catch(e){}}else if(x.f)brugFor(x.f.id);else if(x.mit)bibHent(x.mit.id);try{indlUI()}catch(e){}}else if(x.fig)bibBrugFigur(x.fig);return}
  if(a==='regler'){BIB.vis=BIB.vis==='regler'?false:'regler';bibTegn();return}
  if(a==='kopi'){bibKopi(x);return}
  if(a==='omdoeb'&&x.mit){const r=await spoerg({titel:'Omdøb '+x.navn,tekst:'Skriv det nye navn.',kode:true,ok:'Omdøb'});if(r.ok&&r.vaerdi)bibOmdoeb(x.mit.id,r.vaerdi);return}
  if(a==='slet'&&x.mit){bibSlet(x.mit.id);return}
  const q=b.dataset.s?bibSaetAf(b.dataset.s):null;if(!q||!q.sk)return;
  if(a==='saetbrug'){bibBrugSaet(x.fig,q,b.dataset.o);return}
  if(a==='saetregler'){BIB.vis=BIB.vis==='saet:'+b.dataset.s?false:'saet:'+b.dataset.s;bibTegn();return}
  if(a==='saetkopi'){bibKopi({slags:'saet',sk:q.sk});return}
  if(a==='saetomdoeb'&&!q.std){const r=await spoerg({titel:'Omdøb '+q.sk.navn,tekst:'Skriv det nye navn.',kode:true,ok:'Omdøb'});if(r.ok&&r.vaerdi){q.sk.navn=r.vaerdi.slice(0,40);try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}bibTegn()}return}
  if(a==='saetslet'&&!q.std){const r=await spoerg({titel:'Slet '+q.sk.navn+'?',tekst:'Regel-sættet slettes fra Mine. Det kan ikke fortrydes.',ok:'Ja, slet',fare:true});if(r.ok){set.ne.skabeloner.splice(q.i,1);try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}BIB.vis=false;bibTegn()}return}});
 new ResizeObserver(()=>{if(!$('w36')||$('w36').hidden)return;document.querySelectorAll('#bib .bib-k').forEach(b=>{const x=bibFind(b.dataset.bib);if(x)bibTegnBillede(b.querySelector('canvas'),x)})}).observe(el)};
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
 {const gl=navnAktiv;window.navnAktiv=function(a){if(/^m:/.test(String(a))){const x=BIB.mine.find(y=>y.id===String(a).slice(2));return x?x.navn:'Mit show'}return gl.apply(this,arguments)}}
 if(!set.bib3a){try{if(set.dockLay)delete set.dockLay['ao-regler']}catch(e){}}/* layoutet for 3 · Regler får Biblioteket én gang */
 setTimeout(()=>{try{if(!BIB.klar){BIB.klar=true;bibLaes();bibFlytPladser()}}catch(e){}const k=$('ops-bib-knap');if(k)k.onclick=()=>bibVis('shows');setInterval(()=>{const w=$('w36');if(w&&!w.hidden&&!w.dataset.tegnet){w.dataset.tegnet='1';bibTegn()}},700)},1600);
 /* Opsætning 1–20 i Opsætninger: gemte pladser vises stadig, hvis der er nogen (de kan hentes); ellers er de skjult */
 setTimeout(()=>{try{const p=$('ops-pladser');if(p)p.hidden=!SLOTS.some(n=>slotRead(n))}catch(e){}},1700);
 {const gl=opsByg;window.opsByg=function(){const r=gl.apply(this,arguments);try{const p=$('ops-pladser');if(p)p.hidden=!SLOTS.some(n=>slotRead(n));const k=$('ops-bib-knap');if(k)k.onclick=()=>bibVis('shows')}catch(e){}return r}}
 {const gl=slotSave;window.slotSave=function(n,navn){const r=gl.apply(this,arguments);try{const p=$('ops-pladser');if(p)p.hidden=false}catch(e){}return r}}}
/* ========== SLUT: BIBLIOTEKET ========== */
