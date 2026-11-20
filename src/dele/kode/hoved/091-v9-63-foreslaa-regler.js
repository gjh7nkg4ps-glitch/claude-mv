/* ========== v9.63: FORESLÅ REGLER ==========
   Planens fase 4: intet skriver regler uden at spørge. Et forslag er en regel, der endnu ikke står i maps (FS.liste: {id, regel, hvorfor}).
   Forslagene vises som stiplede celler i matrixen (fsTegn, kaldt efter mxByg); ✓ eller Ja laver reglen (Regler.tilfoej), ✕ eller Nej fjerner forslaget.
   fsBeregn() kender figurerne (danserens bevægelser fra DANS_STD, discokuglens glimt og lys) og bruger Auto-mappings beregning (autoListe) til scenens
   effekter, når en sang er analyseret. Der foreslås kun regler til mål uden regler, så intet slettes eller ændres. */
const FS={liste:[],nr:0,valgt:0,sig:''};
function fsRegel(band,effect,thr,gain,att,rel){return{band,effect,thr,gain,att,rel,curve:1,gap:120}}
function fsLaeg(L,regel,hvorfor){if(!TARGETS.some(t=>t.id===regel.effect)||maps.some(m=>m.effect===regel.effect)||L.some(x=>x.regel.band===regel.band&&x.regel.effect===regel.effect))return;L.push({id:++FS.nr,regel,hvorfor})}
function fsBeregn(){const L=[];
 (fase2.objekter||[]).forEach(o=>{if(o.skabelon||!o.lag)return;o.lag.forEach((l,li)=>{const tid=p=>'obj:'+o.id+':'+li+':'+p,e=l.egenskaber||{};
  if(l.form==='danser')DANS_MOVES.forEach(([p,navn])=>{const s=DANS_STD[p];if(p==='dKrop'||!s||!e[p])return;fsLaeg(L,fsRegel(s[0],tid(p),s[1],1,s[2],s[3]),o.navn+' er en danser: '+navn+' plejer at passe til '+neLtNavn(s[0])+'.')});
  if(e.kGlimt&&e.kIntensitet){[['kick',.4,6,140],['snare',.4,6,140],['hihat',.45,6,110]].forEach(([b,thr,att,rel],i)=>{if(!i)fsLaeg(L,fsRegel(b,tid('kGlimt'),thr,1,att,rel),o.navn+' er en discokugle: glimt på '+neLtNavn(b)+'.')});fsLaeg(L,fsRegel('rms',tid('kIntensitet'),.1,1,150,600),o.navn+' er en discokugle: lyset følger sangens styrke.')}})});
 let a=null;try{a=typeof F!=='undefined'&&F?autoListe():null}catch(x){a=null}
 if(a&&a.m)a.m.forEach(r=>fsLaeg(L,Object.assign({},r),'Ud fra sangen: '+neLtNavn(r.band)+(/^klods/.test(r.effect)?' er et tydeligt slag, der kan give klodser.':' passer til '+neMaalNavn(r.effect)+'.')));
 return L}
function fsFind(id){return FS.liste.find(f=>f.id===+id)}
function fsRens(){FS.liste=FS.liste.filter(f=>TARGETS.some(t=>t.id===f.regel.effect)&&!maps.some(m=>m.band===f.regel.band&&m.effect===f.regel.effect));if(FS.valgt&&!fsFind(FS.valgt))FS.valgt=0}
/* de stiplede celler: tegnes oven på matrixen, hver gang den er bygget */
function fsTegn(){const mx=$('ne-mx');if(!mx)return;fsRens();FS.liste.forEach(f=>{const td=mxFindCelle({b:f.regel.band,e:f.regel.effect});if(!td||td.classList.contains('mx-har')||td.classList.contains('mx-lukket'))return;td.classList.add('mx-forslag');td.classList.toggle('fs-valgt',f.id===FS.valgt);td.dataset.fs=f.id;
  const navn=neLtNavn(f.regel.band)+' → '+neFigurAf(f.regel.effect).navn+' · '+neMaalNavn(f.regel.effect);td.title='Forslag: '+navn+'. '+f.hvorfor+' ✓ = ja, ✕ = nej.';td.setAttribute('aria-label','Forslag: '+navn);
  td.innerHTML='<button class="fs-j" data-fsj="'+f.id+'" title="Ja: lav reglen" aria-label="'+neHtml('Ja til '+navn)+'">✓</button><button class="fs-n" data-fsn="'+f.id+'" title="Nej: fjern forslaget" aria-label="'+neHtml('Nej til '+navn)+'">✕</button>'});FS.sig='';fsBj()}
{const gl=mxByg;window.mxByg=function(){gl();try{fsTegn()}catch(e){console.error(e)}}}
/* linjen med Foreslå regler, lige over linjen med Markér, Kopiér … */
function fsBj(){const bj=$('fs-bj');if(!bj)return;if(!mxTil()){bj.hidden=true;FS.sig='';return}bj.hidden=false;const v=fsFind(FS.valgt),sig=FS.liste.length+'|'+FS.valgt+'|'+(typeof F!=='undefined'&&F?1:0);if(sig===FS.sig)return;FS.sig=sig;const n=FS.liste.length;
 bj.innerHTML='<small class="fs-l">Forslag</small>'
  +(n?'<b>'+n+(n===1?' forslag':' forslag')+'</b><span>stiplede celler · ✓ = ja · ✕ = nej</span><button class="ne-k" data-fs="jaalle" title="Lav alle de foreslåede regler (ét Fortryd-skridt)">Ja til alle</button><button class="ne-k" data-fs="nejalle" title="Fjern alle forslag; ingen regler ændres">Nej til alle</button>':'<span>Ingen forslag lige nu</span>')
  +(v?'<span class="fs-hv"><b>'+neHtml(neLtNavn(v.regel.band)+' → '+neFigurAf(v.regel.effect).navn+' · '+neMaalNavn(v.regel.effect))+'</b> · '+neHtml(v.hvorfor)+'</span><button class="ne-k" data-fs="ja">Ja</button><button class="ne-k" data-fs="nej">Nej</button>':'')}
{const gl=mxBjaelke;window.mxBjaelke=function(){gl();fsBj()}}
function fsLav(f){const m=Object.assign({},f.regel);delete m.id;Regler.tilfoej(m);try{neUdsving(m.effect)}catch(e){}}
function fsJa(id){const f=fsFind(id);if(!f)return;const navn=neLtNavn(f.regel.band)+' → '+neMaalNavn(f.regel.effect);fsLav(f);FS.liste=FS.liste.filter(x=>x!==f);if(FS.valgt===f.id)FS.valgt=0;try{persistObj()}catch(e){}mxEfterAlle('Ja: reglen '+navn+' er lavet. '+FS.liste.length+' forslag tilbage.')}
function fsNej(id){const f=fsFind(id);if(!f)return;FS.liste=FS.liste.filter(x=>x!==f);if(FS.valgt===f.id)FS.valgt=0;mxByg();neToast('Nej: forslaget er fjernet. Ingen regler er ændret.',true)}
function fsJaAlle(){fsRens();const L=FS.liste.slice();if(!L.length)return;Regler.samlet(()=>L.forEach(fsLav));FS.liste=[];FS.valgt=0;try{persistObj()}catch(e){}mxEfterAlle('Ja til alle: '+L.length+(L.length===1?' regel':' regler')+' er lavet. Ingen af de regler, du havde, er ændret.')}
function fsNejAlle(){const n=FS.liste.length;FS.liste=[];FS.valgt=0;mxByg();neToast('Nej til alle: '+n+' forslag er fjernet. Ingen regler er ændret.',true)}
function fsForeslaa(){try{if(typeof sbAabn==='function'&&$('w33')&&!($('ne')&&$('ne').getBoundingClientRect().width>0))sbAabn('w33')}catch(e){}
 const foer=maps.length;FS.liste=fsBeregn();FS.valgt=0;const I=mxInd();new Set(FS.liste.map(f=>neFigurAf(f.regel.effect).key)).forEach(k=>{I.mxFold[k]=false});try{mxGem()}catch(e){}if(!mxTil())mxSaet(true,true);mxByg();
 const sang=typeof F!=='undefined'&&F,n=FS.liste.length;neToast(n?n+' forslag står som stiplede celler. ✓ = ja, ✕ = nej. Ingen af dine '+foer+' regler er ændret.'+(sang?'':' Analysér en sang for også at få forslag til scenens effekter.'):'Ingen forslag: alle figurers bevægelser og scenens effekter har allerede regler'+(sang?'.':', eller der mangler en analyseret sang.'),true);return n}
/* --- v9.64 (trin 4b): de andre, der skrev regler, giver forslag. fsFang(fn, hvem) kører den gamle funktion, mens Regler er i fange-tilstand:
   det, den ville tilføje, bliver til forslag; det, den ville slette eller rette, sker ikke. Figurernes udsving (Fra og Til) sættes tilbage bagefter. --- */
const FSF={til:false,L:[]};
['tilfoej','ret','slet','sletNr','retNr','sletHvor','retHvor','erstat'].forEach(n=>{const gl=Regler[n];if(typeof gl!=='function')return;Regler[n]=function(a){if(!FSF.til)return gl.apply(Regler,arguments);if(n==='tilfoej'){FSF.L.push(Object.assign({},a));return null}if(n==='erstat'){(a||[]).forEach(q=>FSF.L.push(Object.assign({},q)));return}return n==='sletHvor'||n==='retHvor'?0:undefined}});
function fsFang(fn,hvem,stille){if(FSF.direkte)return fn();/* FSF.direkte bruges kun af de gamle test af hjælpefunktionerne (de findes stadig og bruges, når en færdig opsætning eller figur indlæses) */const P=[];(fase2.objekter||[]).forEach(o=>(o.lag||[]).forEach(l=>{const e=l.egenskaber||{};Object.keys(e).forEach(p=>{if(e[p]&&typeof e[p]==='object')P.push([e,p,e[p].fra,e[p].til])})}));
 const M0=JSON.stringify(maps);FSF.til=true;FSF.L=[];let res;try{res=fn()}catch(x){console.error(x)}finally{FSF.til=false}P.forEach(([e,p,a,b])=>{if(e[p]&&typeof e[p]==='object'){e[p].fra=a;e[p].til=b}});
 const L=FSF.L;FSF.L=[];if(JSON.stringify(maps)!==M0){const foer=JSON.parse(M0);maps.forEach(q=>{if(q&&!foer.some(f=>f.band===q.band&&f.effect===q.effect))L.push(Object.assign({},q))});Regler.erstat(foer,true);try{save()}catch(x){}}let ny=0,over=0;try{syncTargets()}catch(x){}L.forEach(q=>{if(!q||!q.band||!q.effect)return;delete q.id;delete q.off;const f0=FS.liste.length;fsLaeg(FS.liste,q,hvem+'.');if(FS.liste.length>f0)ny++;else over++});
 try{persistObj()}catch(x){}const tekst=hvem+': '+(ny?ny+' forslag står som stiplede celler i matrixen (✓ = ja, ✕ = nej).':'ingen forslag.')+(over?' '+over+' sprunget over, fordi målet allerede har en regel eller et forslag.':'')+' Ingen regler er ændret.';
 if(ny&&!stille){try{if(typeof sbAabn==='function'&&$('w33')&&!($('ne')&&$('ne').getBoundingClientRect().width>0))sbAabn('w33')}catch(x){}const I=mxInd();new Set(FS.liste.map(f=>neFigurAf(f.regel.effect).key)).forEach(k=>{I.mxFold[k]=false});try{mxGem()}catch(x){}if(!mxTil())mxSaet(true,true)}
 try{NE2.sig='';ne2Byg()}catch(x){}try{if(mxTil())mxByg()}catch(x){}try{formUI()}catch(x){}try{msg(tekst)}catch(x){}try{if(mxTil())neToast(tekst,true)}catch(x){}return res}
{const gl=neBrugSkabelon;window.neBrugSkabelon=function(sk,fk){return fsFang(()=>gl(sk,fk),'Skabelonen '+((sk&&sk.navn)||''))}}
function fsStart(){const mx=$('ne-mx'),bj0=$('mx-bj');if(!mx||!bj0){setTimeout(fsStart,300);return}
  const bj=document.createElement('div');bj.id='fs-bj';bj.className='mx-bj fs-bj';bj.hidden=true;bj.setAttribute('role','toolbar');bj.setAttribute('aria-label','Forslag til regler');bj0.insertAdjacentElement('beforebegin',bj);
 bj.addEventListener('click',e=>{const b=e.target.closest('button[data-fs]');if(!b)return;const h=b.dataset.fs;if(h==='foreslaa')fsForeslaa();else if(h==='jaalle')fsJaAlle();else if(h==='nejalle')fsNejAlle();else if(h==='ja')fsJa(FS.valgt);else if(h==='nej')fsNej(FS.valgt)});
 bj.addEventListener('keydown',e=>{if(!(e.ctrlKey||e.metaKey))e.stopPropagation()});
 /* klik i en stiplet celle må ikke lave en almindelig regel: det fanges, før matrixens egen lytter ser det */
 mx.addEventListener('click',e=>{const j=e.target.closest('[data-fsj]'),n=e.target.closest('[data-fsn]');if(j){e.stopPropagation();fsJa(j.dataset.fsj);return}if(n){e.stopPropagation();fsNej(n.dataset.fsn);return}
  const td=e.target.closest('td.mx-forslag');if(td){e.stopPropagation();{/* klikket kan lande på cellen i stedet for knappen; så afgør stedet det */const q=td.getBoundingClientRect(),x=e.clientX-q.left,y=e.clientY-q.top;if(y>=6&&y<=33){if(x<=22){fsJa(td.dataset.fs);return}if(x>=q.width-22){fsNej(td.dataset.fs);return}}}FS.valgt=+td.dataset.fs;mx.querySelectorAll('td.mx-forslag').forEach(x=>x.classList.toggle('fs-valgt',x===td));td.focus({preventScroll:true});FS.sig='';fsBj()}},true);
 mx.addEventListener('keydown',e=>{const td=e.target.closest&&e.target.closest('td.mx-forslag');if(!td||e.ctrlKey||e.metaKey)return;if(e.key==='Enter'){e.preventDefault();e.stopPropagation();fsJa(td.dataset.fs)}else if(e.key==='Delete'||e.key==='Backspace'){e.preventDefault();e.stopPropagation();fsNej(td.dataset.fs)}},true);
 mx.addEventListener('pointerdown',e=>{if(e.target.closest('td.mx-forslag'))e.stopPropagation()},true);fsBj()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(fsStart,700));else setTimeout(fsStart,700);
/* ========== SLUT: FORESLÅ REGLER ========== */
