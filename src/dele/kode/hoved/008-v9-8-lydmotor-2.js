/* ========== v9.8: LYDMOTOR 2 ==========
   Ny lydmotor til generatoren (vores navn: Lydmotor 2). Den nuværende generator lød tyndt, fordi hver lyd var én oscillator eller lidt støj, og fordi bas og lead spillede de samme toner i hver takt.
   Samme 8 spor og samme mønster (pat) som før, så klodser, Lyd-mål og Mapping virker uændret. v9.84: Klassisk er fjernet; gs.motor er altid 'ny'.
   Lydene: kick med tonefald, klik og mætning (saturation) · snare med to toner og støj · clap af fire små klap · hihat af seks firkant-oscillatorer (808-princippet) og lidt luftig støj; den lukkede hihat afbryder den åbne (choke) ·
   tom med tonefald · bas med to sav-oscillatorer, sub-tone og filter-kontur (filter envelope); en ny basnote stopper den forrige · lead med tre stemmer, filter-kontur og vibrato.
   Harmoni: hver takt (16 trin) har en akkord fra genrens akkordrække; bas og lead flyttes med akkorden. Akkord-fladen (pad) spiller akkorden blødt i baggrunden.
   Mønstre: Generér automatisk laver betoninger (accent, X) og spøgelsesslag (ghost notes, g), en baslinje i genrens stil og et lille melodimotiv. Fill: i hver 4. takt spiller snare og tom de sidste 4 trin.
   Mix: rumklang (reverb), kompressor og begrænser (limiter), så lyden er fyldig uden at klippe.
   Alt, der lyder uden at stå i mønstret (akkord-fladen og fill), kan ses: akkorden lige nu, takten og "Fill" lyser ved Lydmotor-rækken. */
const LM={vis:[],nulstil:true,stat:new WeakMap(),
 /* Genrens akkordrække som trin i skalaen (0 = grundtonen). mol bruges til mol-skalaer, dur til dur. */
 PROG:{house:{mol:[0,5,2,6],dur:[0,4,5,3]},techno:{mol:[0,0,5,6],dur:[0,0,3,4]},brk:{mol:[0,3,5,4],dur:[0,3,4,4]},hip:{mol:[0,5,3,4],dur:[0,5,3,4]},trap:{mol:[0,5,0,6],dur:[0,5,0,4]},dnb:{mol:[0,5,2,6],dur:[0,4,5,3]},disco:{mol:[0,3,6,2],dur:[0,3,4,3]}},
 /* Trommer pr. genre (16 trin): X = betonet, x = normal, g = spøgelsesslag. Rækkefølge: kick, snare, clap, hihat, åben hat. Bas: x = note. bl = basnotens længde i trin. */
 TROM:{house:['X...x...X...x...','..............g.','....X.......X...','xg.gxg.gxg.gxg.g','..X...X...X...X.','..x...x...x...x.',1.6],
  techno:['X...x...X...x...','............g...','....x.......x...','g.X.g.X.g.X.g.Xg','................','..xx..x...xx..x.',1.2],
  brk:['X.x.......x.....','....X..g.g..X..g','................','x.x.x.x.x.x.x...','..............x.','x.....x...x..x..',2],
  hip:['X......x..x.....','....X.......X...','....x.......x...','x.x.x.x.x.x.x.xg','................','x......x..x.....',3],
  trap:['X......x..X.....','................','........X.......','xgxgxgxgxgxgxxxx','................','x......x..x.....',5],
  dnb:['X.........x.....','....X..g....X..g','................','x.x.x.x.x.x.x.x.','................','x.........x.....',6],
  disco:['X...x...X...x...','....X.......X...','....x.......x...','x...x...x...x...','..X...X...X...X.','x.x.x.x.x.x.x.x.',1.2]},
 MODUS:{ionian:[0,2,4,5,7,9,11],aeolian:[0,2,3,5,7,8,10],dorian:[0,2,3,5,7,9,10]}};
gs.motor='ny';/* v9.84: kun én lydmotor (Klassisk er fjernet); feltet står, fordi det gemmes med sangen */
if(gs.pad===undefined)gs.pad=true;if(gs.fill===undefined)gs.fill=true;if(gs.rum===undefined)gs.rum=.25;
const LM_STD={pad:true,fill:true,rum:.25};
function lmModus(){return gs.scale==='major'?'ionian':gs.scale==='dorian'?'dorian':'aeolian'}
function lmDiaTone(base,i){const M=LM.MODUS[lmModus()],o=Math.floor(i/7);return base+gs.root+M[((i%7)+7)%7]+12*o}
function lmProg(){const P=LM.PROG[curGen]||LM.PROG.house;return lmModus()==='ionian'?P.dur:P.mol}
function lmAkkord(takt){const P=lmProg(),d=P[((takt%P.length)+P.length)%P.length],M=LM.MODUS[lmModus()];
 const t3=(M[(d+2)%7]+(d+2>=7?12:0))-M[d],t5=(M[(d+4)%7]+(d+4>=7?12:0))-M[d];
 return{deg:d,navn:ROOTS[(gs.root+M[d])%12]+(t5===6?'°':t3===3?'m':'')}}
function lmVel(r,v){return r>5?1:v===2?1.25:v===3?.4:1}
function lmS(c){let S=LM.stat.get(c);if(!S){S={n:0,bas:null,aaben:null,rv:null};LM.stat.set(c,S)}return S}
function lmImpuls(c,sek){const n=Math.floor(c.sampleRate*sek),b=c.createBuffer(2,n,c.sampleRate);for(let k=0;k<2;k++){const d=b.getChannelData(k);for(let i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/n,3)}return b}
/* Mix: voices -> m -> kompressor -> begrænser -> blød klipper (soft clipper, så det aldrig går over 1) -> udgang. Echo (delay) som før; rumklang (reverb) som en send. */
function mkMaster(c,bp){
 const m=c.createGain(),d=c.createDelay(1),fb=c.createGain(),w=c.createGain(),comp=c.createDynamicsCompressor(),lim=c.createDynamicsCompressor(),ud=c.createGain(),rv=c.createGain(),cv=c.createConvolver();
 m.gain.value=.8;comp.threshold.value=-16;comp.knee.value=8;comp.ratio.value=3;comp.attack.value=.008;comp.release.value=.16;
 lim.threshold.value=-3;lim.knee.value=0;lim.ratio.value=20;lim.attack.value=.002;lim.release.value=.08;ud.gain.value=.62;
 d.delayTime.value=60/bp*.75;fb.gain.value=.32;w.gain.value=gs.echo*.7;rv.gain.value=gs.rum;cv.buffer=lmImpuls(c,2.2);
 m.connect(comp);m.connect(d);d.connect(fb);fb.connect(d);d.connect(w);w.connect(comp);rv.connect(cv);cv.connect(comp);const kl=c.createWaveShaper(),kk=new Float32Array(1024);for(let i=0;i<1024;i++){const x=(i/511.5-1)*1.5;kk[i]=Math.tanh(x)}kl.curve=kk;comp.connect(lim);lim.connect(ud);ud.connect(kl);kl.connect(udgang(c));
 lmS(c).rv=rv;return{m,d,w,rv,lm:true}};
/* Én lyd. sd = længden af ét trin i sekunder. */
function lmVoice(c,out,tr,t,note,nb,vl,sd){const S=lmS(c),send=(node,a)=>{if(S.rv&&a>0){const s=c.createGain();s.gain.value=a;node.connect(s);s.connect(S.rv)}};
 const env=(g,a,att,dec,til)=>{g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(a,t+att);g.gain.exponentialRampToValueAtTime(.0008,t+(til||dec))};
 const osc=(type,f)=>{const o=c.createOscillator();o.type=type;o.frequency.setValueAtTime(f,t);return o};
 const stoej=(type,f,q)=>{const s=c.createBufferSource(),fl=c.createBiquadFilter();s.buffer=nb;fl.type=type;fl.frequency.value=f;if(q)fl.Q.value=q;s.connect(fl);return{s,fl}};
 const g=c.createGain();g.connect(out);
 if(tr===0){const o=osc('sine',165),ws=c.createWaveShaper(),k=new Float32Array(256);for(let i=0;i<256;i++){const x=i/127.5-1;k[i]=Math.tanh(2.2*x)/Math.tanh(2.2)}ws.curve=k;
  o.frequency.exponentialRampToValueAtTime(46,t+.09);const og=c.createGain();env(og,1.05*vl,.002,gs.kdec+.08);o.connect(og);og.connect(ws);ws.connect(g);o.start(t);o.stop(t+gs.kdec+.15);
  const kl=stoej('highpass',2500);const kg=c.createGain();env(kg,.45*vl,.0005,.014);kl.fl.connect(kg);kg.connect(g);kl.s.start(t);kl.s.stop(t+.03)}
 else if(tr===1){[[185,.5,.11],[330,.28,.07]].forEach(([f,a,dd])=>{const o=osc('triangle',f);o.frequency.exponentialRampToValueAtTime(f*.82,t+dd);const og=c.createGain();env(og,a*vl,.001,dd);o.connect(og);og.connect(g);o.start(t);o.stop(t+dd+.05)});
  const n=stoej('bandpass',3200,.7),hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=1200;const ng=c.createGain();env(ng,.75*vl,.001,.2);n.fl.connect(hp);hp.connect(ng);ng.connect(g);send(ng,.22);n.s.start(t);n.s.stop(t+.25)}
 else if(tr===2){const n=stoej('bandpass',1250,1.6),ng=c.createGain();ng.gain.setValueAtTime(0,t);[0,.011,.022,.034].forEach((dt,i)=>{ng.gain.setValueAtTime(.9*vl,t+dt);ng.gain.exponentialRampToValueAtTime(i<3?.12*vl:.0008,t+dt+(i<3?.009:.22))});
  n.fl.connect(ng);ng.connect(g);send(ng,.4);n.s.start(t);n.s.stop(t+.3)}
 else if(tr===3||tr===4){const aab=tr===4,bp=c.createBiquadFilter(),hp=c.createBiquadFilter(),hg=c.createGain();bp.type='bandpass';bp.frequency.value=9000;bp.Q.value=.6;hp.type='highpass';hp.frequency.value=6500;
  const dur=aab?.38:.07;env(hg,(aab?.5:.6)*vl,.001,dur);[205.3,304.4,369.6,522.7,540,800].forEach(f=>{const o=osc('square',f);o.connect(bp);o.start(t);o.stop(t+dur+.05)});const mk=c.createGain();mk.gain.value=3.2;bp.connect(mk);mk.connect(hp);const luft=stoej('highpass',8000);const lg=c.createGain();lg.gain.value=.45;luft.fl.connect(lg);lg.connect(hp);luft.s.start(t);luft.s.stop(t+dur+.05);hp.connect(hg);hg.connect(g);send(hg,aab?.15:.05);
  if(aab)S.aaben=hg;else if(S.aaben){try{S.aaben.gain.cancelScheduledValues(t);S.aaben.gain.setTargetAtTime(0,t,.008)}catch(e){}S.aaben=null}}
 else if(tr===5){const f0=note>0?mtof(note):200,o=osc('sine',f0*1.6);o.frequency.exponentialRampToValueAtTime(f0*.85,t+.22);const og=c.createGain();env(og,.8*vl,.002,.38);o.connect(og);og.connect(g);send(og,.2);o.start(t);o.stop(t+.45)}
 else if(tr===6){const f=mtof(note),len=Math.max(.08,sd*(LM.TROM[curGen]||LM.TROM.house)[6]),fl=c.createBiquadFilter(),bg=c.createGain();
  if(S.bas&&S.bas.slut>t){try{S.bas.g.gain.cancelScheduledValues(t);S.bas.g.gain.setTargetAtTime(0,t,.006)}catch(e){}}
  fl.type='lowpass';fl.Q.value=5;const base=Math.min(gs.cut*.22,1100)+90;fl.frequency.setValueAtTime(base*4.5,t);fl.frequency.exponentialRampToValueAtTime(base,t+.14);
  bg.gain.setValueAtTime(0,t);bg.gain.linearRampToValueAtTime(.42*vl,t+.004);bg.gain.setValueAtTime(.42*vl,t+len*.7);bg.gain.exponentialRampToValueAtTime(.0008,t+len);
  [-7,7].forEach(dc=>{const o=osc(gs.bw,f);o.detune.value=dc;o.connect(fl);o.start(t);o.stop(t+len+.05)});fl.connect(bg);
  const sub=osc('sine',f/(f>70?2:1)),sg=c.createGain();sg.gain.value=.55;sub.connect(sg);sg.connect(bg);sub.start(t);sub.stop(t+len+.05);bg.connect(g);S.bas={g:bg,slut:t+len}}
 else{const f=mtof(note),len=Math.max(.12,sd*2.2),fl=c.createBiquadFilter(),lg=c.createGain(),lfo=osc('sine',5.5),lfg=c.createGain();
  fl.type='lowpass';fl.Q.value=2;fl.frequency.setValueAtTime(Math.min(12000,gs.cut*1.8),t);fl.frequency.exponentialRampToValueAtTime(Math.max(300,gs.cut*.7),t+.25);
  lg.gain.setValueAtTime(0,t);lg.gain.linearRampToValueAtTime(.2*vl,t+.008);lg.gain.exponentialRampToValueAtTime(.11*vl,t+.15);lg.gain.setValueAtTime(.11*vl,t+len);lg.gain.exponentialRampToValueAtTime(.0008,t+len+.25);
  lfg.gain.setValueAtTime(0,t);lfg.gain.linearRampToValueAtTime(7,t+.25);lfo.connect(lfg);lfo.start(t);lfo.stop(t+len+.3);
  [-9,0,9].forEach(dc=>{const o=osc(gs.lw,f);o.detune.value=dc;lfg.connect(o.detune);o.connect(fl);o.start(t);o.stop(t+len+.3)});fl.connect(lg);lg.connect(g);send(lg,.3)}}
/* Akkord-fladen (pad): akkordens tre toner, blødt, en hel takt. */
function lmPad(c,out,t,ak,len){const S=lmS(c),fl=c.createBiquadFilter(),pg=c.createGain();fl.type='lowpass';fl.frequency.value=1100;fl.Q.value=.5;
 pg.gain.setValueAtTime(0,t);pg.gain.linearRampToValueAtTime(.075,t+Math.min(.35,len*.3));pg.gain.setValueAtTime(.075,t+len*.85);pg.gain.linearRampToValueAtTime(0,t+len+.05);
 [0,2,4].forEach(i=>{const f=mtof(lmDiaTone(48,ak.deg+i));[-6,6].forEach(dc=>{const o=c.createOscillator();o.type='sawtooth';o.frequency.value=f;o.detune.value=dc;o.connect(fl);o.start(t);o.stop(t+len+.1)})});
 fl.connect(pg);pg.connect(out);if(S.rv){const s=c.createGain();s.gain.value=.5;pg.connect(s);s.connect(S.rv)}}
/* Tonen for bas og lead: trinnet i skalaen flyttes med akkorden. Optagne tangenter (MIDI-tal fra 24) spilles, som de er. Mol-pentaton og blues: leaden bliver i sin skala. */
function lmTone(r,v,deg){if(v>=24)return v;if(r===6)return lmDiaTone(36,(v-1)+deg);if(gs.scale==='minpent'||gs.scale==='blues')return noteOf(r,v);return lmDiaTone(60,(v-1)+deg)}
function voice(c,out,tr,t,note,nb,vl){lmVoice(c,out,tr,t,note,nb,vl,60/bpm/4)}
function playStep(c,out,nb,t,q,bp){
 const S=lmS(c);if(c===gctx&&LM.nulstil){S.n=0;LM.nulstil=false;LM.vis.length=0}
 const sd=60/bp/4,tt=t+(q%2?gs.swing*sd*.5:0),takt=Math.floor(S.n/16),n16=S.n%16,ak=lmAkkord(takt),fill=gs.fill&&takt%4===3&&n16>=12;
 if(n16===0&&gs.pad)lmPad(c,out,t,ak,sd*16);
 for(let r=0;r<8;r++){const v=pat[r][q];if(!v||mute[r])continue;if(fill&&r===1)continue;lmVoice(c,out,r,tt,r>5?lmTone(r,v,ak.deg):r===5?lmDiaTone(48,ak.deg+4):0,nb,vol[r]*lmVel(r,v),sd)}
 if(fill){if(!mute[1])lmVoice(c,out,1,tt,0,nb,vol[1]*(.35+.2*(n16-12)),sd);if(!mute[5]&&n16%2===0)lmVoice(c,out,5,tt,lmDiaTone(48,ak.deg+(n16===12?7:4)),nb,vol[5]*.8,sd)}
 if(c===gctx){LM.vis.push({t:tt,takt,navn:ak.navn,fill});if(LM.vis.length>256)LM.vis.splice(0,128)}
 S.n++};
const lmGammelStart=gStart;gStart=function(){LM.nulstil=true;return lmGammelStart()};
/* Generér automatisk: genrens trommer med betoninger og spøgelsesslag, en baslinje i genrens stil og et melodimotiv på akkordens toner. */
function autoGen(){
 const T=LM.TROM[curGen]||LM.TROM.house,d=gs.dens,R=Math.random,val={X:2,x:1,g:3};
 const tromme=(s,r)=>[...s].map(ch=>{if(ch==='.')return R()<.025*d&&r!==4?3:0;if(ch==='g')return R()<.35+.6*d?3:0;if(ch==='x'&&R()<.06*(1-d))return 0;return val[ch]});
 const P=[0,1,2,3,4].map(r=>tromme(T[r],r));
 P[5]=Array.from({length:16},(_,i)=>i>=13&&R()<.25*d?1:0);
 P[6]=[...T[5]].map((ch,i)=>{if(ch==='x')return curGen==='disco'?(i%4===2?8:1):(i===0||R()<.6?1:[3,5,8][Math.floor(R()*3)]);return R()<.06*d?[1,5][Math.floor(R()*2)]:0});
 const motiv=Array(8).fill(0),pos=[0,3,6,2,5,7,1,4],antal=Math.max(1,Math.round(1+3*d));pos.slice(0,antal).forEach((p,i)=>{motiv[p]=p%4===0?[1,3,5,8][Math.floor(R()*4)]:1+Math.floor(R()*8)});
 P[7]=motiv.concat(motiv.map((v,i)=>i===7||(i>=5&&R()<.5)?(v?1+Math.floor(R()*8):0):v));
 if(gs.steps===32)P.forEach((row,r)=>{for(let i=0;i<16;i++){const v=row[i];row[i+16]=r===7&&R()<.4?(v?1+Math.floor(R()*8):0):(R()<.06&&r<6?(v?0:(r===0?0:3)):v)}});
 pat=P.map(pad32);bpm=GEN[curGen][4];genUI();drawGrid();lmUI()};
/* Betoninger og spøgelsesslag kan ses i trinene: .acc lyser stærkere, .gh svagere. */
const lmGammelDrawGrid=drawGrid;
drawGrid=function(){lmGammelDrawGrid();document.querySelectorAll('#pads .pad').forEach(p=>{const r=+p.dataset.r,v=pat[r][+p.dataset.s];p.classList.toggle('acc',r<6&&v===2);p.classList.toggle('gh',r<6&&v===3)})};
/* Skift motor: masteren bygges om, så mixet passer til motoren. */
function lmSaet(k,v){gs[k]=v;
 if(k==='rum'){const S=gctx&&lmS(gctx);if(S&&S.rv)S.rv.gain.value=v}lmUI();drawGrid()}
function lmRad(id){const ny=true,P=lmProg();
 return '<div class="lm-rad" data-lm="'+id+'"><span class="lm-l" title="Lydmotoren: fyldige lyde, akkorder, betoninger, fill og et mix med rumklang">Lydmotor</span>'
  +(ny?'<label class="lm-t"><input type="checkbox" data-lmk="pad"'+(gs.pad?' checked':'')+'> Akkord-flade</label><label class="lm-t"><input type="checkbox" data-lmk="fill"'+(gs.fill?' checked':'')+'> Fill hver 4. takt</label>'
  +'<label class="lm-t">Rumklang <input type="range" min="0" max="1" step=".05" value="'+gs.rum+'" data-lmk="rum"><b>'+String(gs.rum).replace('.',',')+'</b></label>':'')
  +'<button class="ghost" data-lmstd title="Lydmotor: akkord-flade og fill til, rumklang 0,25">Tilbage til standard</button>'
  +(ny?'<div class="lm-akk" aria-live="off"><span class="lm-l">Akkorder</span>'+P.map((d,i)=>'<span class="lm-a" data-i="'+i+'">'+lmAkkord(i).navn+'</span>').join('<i>→</i>')+'<span class="lm-takt"></span><span class="lm-fill">Fill</span></div>':'')+'</div>'}
function lmUI(){const ab=document.querySelector('#gen .lm-rad');if(ab)ab.outerHTML=lmRad('w4');else{const p=$('pads');if(p)p.insertAdjacentHTML('beforebegin',lmRad('w4'))}
 const lk=document.querySelector('#lks .lm-rad');if(lk)lk.outerHTML=lmRad('lks');else{const a=$('lks-adv'),k=a&&a.closest('.lks-kort');if(k)k.insertAdjacentHTML('beforeend',lmRad('lks'))}}
const lmGammelGenUI=genUI;genUI=function(){lmGammelGenUI();lmUI()};
const lmGammelLksByg=lksByg;lksByg=function(){lmGammelLksByg();lmUI()};
document.addEventListener('click',e=>{const b=e.target.closest('.lm-rad button');if(!b)return;if(b.dataset.lmstd!==undefined){Object.assign(gs,LM_STD);lmUI();drawGrid();const S=gctx&&lmS(gctx);if(S&&S.rv)S.rv.gain.value=gs.rum;msg('Lydmotor: tilbage til standard (akkord-flade og fill til, rumklang 0,25).')}});
document.addEventListener('change',e=>{const t=e.target;if(!t.closest||!t.closest('.lm-rad')||!t.dataset.lmk||t.type!=='checkbox')return;lmSaet(t.dataset.lmk,t.checked)});
document.addEventListener('input',e=>{const t=e.target;if(!t.closest||!t.closest('.lm-rad')||t.dataset.lmk!=='rum')return;gs.rum=+t.value;if(t.nextElementSibling)t.nextElementSibling.textContent=String(gs.rum).replace('.',',');const S=gctx&&lmS(gctx);if(S&&S.rv)S.rv.gain.value=gs.rum});
/* Vis akkorden, der spilles lige nu (ikke den, der er planlagt), takten og om der er fill. */
setInterval(()=>{const rk=document.querySelectorAll('.lm-akk');if(!rk.length)return;let nu=null;
 if(gPlaying&&gctx){const T=gctx.currentTime;for(const v of LM.vis){if(v.t<=T)nu=v;else break}}
 const P=lmProg();rk.forEach(el=>{el.querySelectorAll('.lm-a').forEach(a=>a.classList.toggle('nu',!!nu&&+a.dataset.i===nu.takt%P.length));
  const tk=el.querySelector('.lm-takt'),tx=nu?'takt '+(nu.takt%4+1)+' af 4':'stoppet';if(tk&&tk.textContent!==tx)tk.textContent=tx;const fl=el.querySelector('.lm-fill');if(fl)fl.classList.toggle('nu',!!nu&&nu.fill)})},100);
/* ========== SLUT: LYDMOTOR 2 ========== */

/* ---------- Flyt effekter ---------- */
let pos={puls:{x:.5,y:.55},ring:{x:.5,y:.86},burst:{x:.5,y:.55},glod:{x:.5,y:.5},sky:{x:.5,y:.62},daempring:{x:.7,y:.5}},moveMode=false,pvDrag=null,gmaster=1,meshSel=-1,meshDrag=null,meshHover=null,meshFokus=null,meshKilder='bånd',lastE={};
const POS0=JSON.parse(JSON.stringify(pos)),HANDLES=[['puls','Lys-puls'],['ring','Chokbølge'],['burst','Partikler'],['glod','Glød'],['sky','Partikelsky'],['daempring','Dæmpningsringe']],pvc=$('pv');
const HANDLES_N=HANDLES.length;
try{const sp=JSON.parse(localStorage.getItem('rytme-pos'));if(sp)Object.assign(pos,sp)}catch(e){}
const savePos=()=>{try{lsGem('rytme-pos',JSON.stringify(pos))}catch(e){}save()};
/* Håndtag, der ligger oven på hinanden (fx en figur på en effekts standardplads): et klik tager det nærmeste (en figur før en effekt, hvis de ligger præcis ens), og et nyt klik på samme sted tager det næste nedenunder. */
function vaelgHaandtag(kand,x,y,sidste){if(!kand.length)return null;kand.sort((a,b)=>a.d-b.d||b.fig-a.fig);let v=kand[0];
 if(kand.length>1&&sidste.k&&Math.hypot(x-sidste.x,y-sidste.y)<6){const i=kand.findIndex(c=>c.k===sidste.k);if(i>=0)v=kand[(i+1)%kand.length]}
 sidste.k=v.k;sidste.x=x;sidste.y=y;return v.k}
const pvSidste={k:null,x:-1e9,y:-1e9},dubSidste={k:null,x:-1e9,y:-1e9};
const pvPt=e=>{const r=pvc.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width,y:(e.clientY-r.top)/r.height,w:r.width,h:r.height}};
pvc.addEventListener('pointerdown',e=>{const kunFig=!moveMode;/* v9.74: uden Flyt effekter kan figurerne stadig tages (effekterne ikke) */if(kunFig&&!fg74Aktiv())return;const p=pvPt(e),kand=[];HANDLES.forEach(([k])=>{if(kunFig&&!k.startsWith('obj:'))return;const hq=hp(k),d=Math.hypot((p.x-hq.x)*p.w,(p.y-hq.y)*p.h);if(d<(kunFig?34:26))kand.push({k,d,fig:k.startsWith('obj:')?1:0})});const best=vaelgHaandtag(kand,e.clientX,e.clientY,pvSidste);if(best){pvDrag=best;try{pvc.setPointerCapture(e.pointerId)}catch(x){}if(best.startsWith('obj:'))try{fg74Vaelg(best.slice(4))}catch(x){}}});
pvc.addEventListener('pointermove',e=>{if(!pvDrag)return;const p=pvPt(e);setHp(pvDrag,{x:Math.min(1,Math.max(0,p.x)),y:Math.min(1,Math.max(0,p.y))})});
pvc.addEventListener('pointerup',()=>{if(pvDrag){const k=pvDrag;pvDrag=null;savePos();if(k.startsWith('obj:')&&!moveMode)try{fg74Flyttet(k.slice(4))}catch(x){}}});
pvc.addEventListener('pointermove',e=>{if(pvDrag||moveMode)return;let c='';if(fg74Aktiv()){const p=pvPt(e);if(HANDLES.some(([k])=>{if(!k.startsWith('obj:'))return false;const hq=hp(k);return Math.hypot((p.x-hq.x)*p.w,(p.y-hq.y)*p.h)<34}))c='grab'}if(pvc.style.cursor!==c)pvc.style.cursor=c});
$('mvbtn').onclick=e=>{moveMode=!moveMode;e.target.textContent='Flyt effekter: '+(moveMode?'Til':'Fra')};
$('mvrst').onclick=()=>{pos=JSON.parse(JSON.stringify(POS0));fase2.objekter.forEach(o=>{if(o.pos0)o.pos={x:o.pos0.x,y:o.pos0.y}});savePos();if(fase2.objekter[selO])posUI(fase2.objekter[selO]);if(typeof msg==='function')msg('Placeringer nulstillet: effekterne og figurerne er tilbage på deres standardplads.')};

/* ---------- Radial Mesh ---------- */
const kildeV=(k,t)=>k.startsWith('lk:')?0:k.startsWith('stem:')?stemV(k,t):k.startsWith('hnd:')?hndV(k):k.startsWith('pad:')?0:k.startsWith('ana:')?(live?(la[k]||0):(A&&(playing||offset>0)?sampleA(k,t):0)):(live?(lv[k]||0):(F&&(playing||offset>0)?sample(k,t):0));
const mc=$('mesh'),bandV=k=>kildeV(k,now());
/* v3.9: Radial Mesh tegnes skarpt (i skærmens rigtige pixels, op til 3 gange) og skaleres op i store vinduer, så streger, prikker og tekst vokser med nettet: nettet regnes i en virtuel størrelse (lærredets pixels / meshS), og meshS = pixeltæthed × zoom, zoom = mindste side / 480 holdt mellem 1 og 3. Størrelsen tjekkes i hver frame (meshTjek), så nettet altid finder sin plads igen, fx efter fuld skærm, eller når vinduet har været skjult. */
let meshS=1,meshSig='';
function meshResize(){const b=mc.parentNode,cw=b.clientWidth,ch=b.clientHeight;if(!cw||!ch)return;const d=Math.min(3,window.devicePixelRatio||1),z=Math.max(1,Math.min(3,Math.min(cw,ch)/480));mc.width=Math.max(50,Math.round(cw*d));mc.height=Math.max(50,Math.round(ch*d));meshS=mc.width/(cw/z);meshSig=cw+'x'+ch+'@'+d}
function meshTjek(){if((meshTjek.n=(meshTjek.n||0)+1)%30===0)try{fokusUI()}catch(e){}const b=mc.parentNode;if(!b)return;const cw=b.clientWidth,ch=b.clientHeight;if(!cw||!ch)return;if(cw+'x'+ch+'@'+Math.min(3,window.devicePixelRatio||1)!==meshSig)meshResize()}
$('meshctl').innerHTML='<div class="ab" style="margin:0"><b id="mlab" class="small"></b></div><div class="ab" style="margin:0 0 4px"><label class="small">Mål for forbindelsen <select id="mtarget"></select></label></div><div class="eqs">'+PAR.map(([f,n,a,b,st])=>`<label>${n}<input type="range" data-f="${f}" min="${a}" max="${b}" step="${st}"><b></b></label>`).join('')+'</div><div class="ab"><label class="small"><input type="checkbox" id="minv"> Invertér</label><label class="small"><input type="checkbox" id="moff"> Slå fra</label><button class="ghost" id="mdel">Slet forbindelse</button><label class="gr small" title="Samlet styrke (vores navn; fagudtryk: master gain): ganges på alle forbindelser.">Samlet styrke (master)<input type="range" id="mmaster" min="0" max="2" step=".05" value="1"><b>1</b></label></div>';
/* De 20 analysekilder, der kan vises yderst i spindelvævet i stedet for de 14 lydtræk (log-spektrets 31 lydtræk findes i listerne og i Analyse-vinduet). */
const BAND_KORT={kick:'Slag dyb',snare:'Slag midt',hihat:'Slag høj'};
const ANA_KORT={'ana:pitch':'Tonehøjde','ana:pitchsik':'Sikkerhed','ana:toneklasse':'Toneklasse','ana:tonestyrke':'Tonestyrke','ana:dissonans':'Dissonans','ana:rigdom':'Overtoner','ana:ulige':'Ulige','ana:spredning':'Spredning'};
const ANA20=Rytme.ANA_KILDER.filter(q=>q.gruppe==='Toner (12 toneklasser)'||q.gruppe==='Tone og klang').map(q=>({key:q.key,label:q.label,kort:/^ana:c\d+$/.test(q.key)?Rytme.TONE_NAVNE[+q.key.slice(5)]:ANA_KORT[q.key]}));
function meshGeom(){const MC=meshCv||mc,W=MC.width/meshS,H=MC.height/meshS,cx=W/2,cy=H/2,R=Math.min(W,H)*.4,r=R*.5,BL=meshKilder==='analyse'?ANA20:meshKilder==='hnd'?HND_KILDER:BANDS.map(b=>({key:b[0],label:b[1],kort:BAND_KORT[b[0]]})),n=BL.length,fk=meshFokus?fokusNoder():null;if(meshFokus&&!fk)meshFokus=null;const NE=fk?fk.noder:meshEff(),m=NE.length,rr=fk?(m>1?R*.62:0):r;
 return{W,H,cx,cy,R,r,exact:!!fk,titel:fk?fk.titel:null,
  bn:BL.map((b,i)=>{const a=-Math.PI/2+i/n*2*Math.PI;return{kind:'b',key:b.key,label:b.label,kort:b.kort,i,a,x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R}}),
  en:NE.map((e,i)=>{const a=-Math.PI/2+i/m*2*Math.PI;return{kind:'e',key:e.key,label:e.label,kort:e.kort,i,a,x:cx+Math.cos(a)*rr,y:cy+Math.sin(a)*rr}})}}
const ctrl=(a,b,G)=>({x:G.cx+(a.x+b.x-2*G.cx)*.2,y:G.cy+(a.y+b.y-2*G.cy)*.2}),ends=(m,G)=>[G.bn.find(n=>n.key===m.band),G.en.find(n=>n.key===(G.exact?m.effect:nodeKey(m.effect)))];
/* v6.7: Radial Mesh kan tegnes på et andet lærred (meshCv) i en anden skala, fx i udgangsvinduets fulde opløsning */
let meshCv=null;
function meshTilUd(W,H){if(!UD.mc)UD.mc=document.createElement('canvas');const oc=UD.mc;if(oc.width!==W||oc.height!==H){oc.width=W;oc.height=H}const gS=meshS,z=Math.max(1,Math.min(4,Math.min(W,H)/480));meshS=z;meshCv=oc;try{drawMesh()}finally{meshCv=null;meshS=gS}return oc}
function drawMesh(){if(!meshCv)meshTjek();const G=meshGeom(),{W,H,cx,cy,R,r}=G,g=(meshCv||mc).getContext('2d');g.setTransform(meshS,0,0,meshS,0,0);
 const bg=g.createRadialGradient(cx,cy,10,cx,cy,R*1.3);bg.addColorStop(0,'#16202c');bg.addColorStop(1,'#0b0f14');g.fillStyle=bg;g.fillRect(0,0,W,H);
 g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=1;[R,G.exact?(G.en.length>1?R*.62:0):r].filter(q=>q>0).forEach(q=>{g.beginPath();g.arc(cx,cy,q,0,7);g.stroke()});
 const TK=MTYK[set.meshTyk-1]||MTYK[3],now2=performance.now(),fl=!!set.meshFlow;
 maps.forEach((m,i)=>{const[b,e]=ends(m,G);if(!b||!e)return;const a=Math.min(1,env[i]||0),c=ctrl(b,e,G);
  g.beginPath();g.moveTo(b.x,b.y);g.quadraticCurveTo(c.x,c.y,e.x,e.y);
  if(i===meshSel){g.strokeStyle='#fff';g.lineWidth=TK[1]*4+a*TK[2];g.globalAlpha=.35;g.stroke();g.globalAlpha=1}
  g.strokeStyle='hsla('+HUE(b.i)+',85%,'+(55+a*20)+'%,'+(m.off?.12:fl?.12+a*.28:.28+a*.72)+')';g.lineWidth=TK[1]+a*TK[2];g.stroke();
  if(fl&&!m.off){const pv=lastEnvM[i]||0;if(a-pv>.06&&now2-(lastSpawn[i]||0)>110){lastSpawn[i]=now2;if(pulses.length<200)pulses.push({i,t0:now2,a})}lastEnvM[i]=a}});
 if(fl)drawPulses(g,G,TK,now2);
 if(meshDrag){g.strokeStyle='#fff';g.lineWidth=2;g.setLineDash([5,4]);g.beginPath();g.moveTo(meshDrag.n.x,meshDrag.n.y);g.lineTo(meshDrag.x,meshDrag.y);g.stroke();g.setLineDash([])}
 g.font='11px Schibsted Grotesk,sans-serif';
 G.bn.forEach(n=>{const v=bandV(n.key);g.fillStyle='hsl('+HUE(n.i)+' 70% 50%)';g.shadowColor=g.fillStyle;g.shadowBlur=4+v*16;g.beginPath();g.arc(n.x,n.y,6+v*7,0,7);g.fill();g.shadowBlur=0;
  const c=Math.cos(n.a);g.fillStyle='#cdd8e3';g.textAlign=c>.3?'left':c<-.3?'right':'center';g.fillText(n.kort||n.label.split(' ')[0],n.x+c*14,n.y+Math.sin(n.a)*14+4)});
 G.en.forEach(n=>{const v=Math.min(1,G.exact?(lastE[n.key]||0):nodeAct(n.key));g.fillStyle='rgba(255,255,255,'+(.25+v*.75)+')';g.shadowColor='#fff';g.shadowBlur=v*14;g.beginPath();g.arc(n.x,n.y,5+v*5,0,7);g.fill();g.shadowBlur=0;g.strokeStyle='#9fb0c0';g.lineWidth=1;g.stroke();
  if(G.exact){g.font='10px Schibsted Grotesk,sans-serif';const c=Math.cos(n.a),sn=Math.sin(n.a),o=G.en.length>1?14+(n.i%2)*12:16,lx=n.x+(G.en.length>1?c*o:0),ly=n.y+(G.en.length>1?sn*o:-o)+4;g.textAlign=G.en.length>1?(c>.3?'left':c<-.3?'right':'center'):'center';g.lineWidth=3;g.strokeStyle='rgba(11,15,20,.9)';g.strokeText(n.kort||n.label,lx,ly);g.fillStyle='#e6edf4';g.fillText(n.kort||n.label,lx,ly)}});
 const tip=n=>{g.textAlign='left';g.fillStyle='#fff';g.font='800 12px Schibsted Grotesk,sans-serif';g.fillText(n.label,n.x+10,n.y-9)};
 if(meshHover)tip(meshHover);else if(maps[meshSel]){const[b,e]=ends(maps[meshSel],G);if(e)tip(e)}
 {g.fillStyle='#9fb0c0';g.textAlign='center';g.font='11px Schibsted Grotesk,sans-serif';if(G.exact){g.font='700 12px Schibsted Grotesk,sans-serif';g.fillStyle='#e6edf4';g.fillText(G.titel,cx,G.en.length>1?cy:cy+34);g.font='10px Schibsted Grotesk,sans-serif';g.fillStyle='#9fb0c0';g.fillText(G.en.length>1?'Dobbeltklik på tom plads: tilbage til oversigten':'Dobbeltklik på tom plads: tilbage',cx,(G.en.length>1?cy:cy+34)+14)}else g.fillText('MASTER '+gmaster.toFixed(2),cx,cy+4)}meshKbTegn(g,G);g.textAlign='left'}
function meshRefresh(){if(meshSel>=maps.length)meshSel=-1;if(meshSel<0&&maps.length)meshSel=0;const m=maps[meshSel],lab=$('mlab');if(!lab)return;
 lab.textContent=m?'Valgt forbindelse: '+bandNavn(m.band)+' → '+effName(m.effect)+'. Klik på en anden linje for at vælge en anden.':'Der er ingen forbindelser. Træk fra et lydtræk (ydre ring) til en effekt (indre ring) for at oprette en.';
 document.querySelectorAll('#meshctl input[data-f]').forEach(r=>{r.disabled=!m;if(m){r.value=m[r.dataset.f];r.nextElementSibling.textContent=m[r.dataset.f]}});
 $('minv').disabled=$('moff').disabled=$('mdel').disabled=!m;if(m){$('minv').checked=!!m.inv;$('moff').checked=!!m.off}fyldMaal(m);fokusUI()}
/* ---- Objekt-visning (fokus) i spindelvævet: i stedet for oversigten vises ét objekts egenskaber (eller en gruppe af mål) i midten, og alle lydtræk ligger stadig yderst. Træk fra et lydtræk til en egenskab for at koble den PRÆCIS. ---- */
const kortNavn=l=>{const t=l.replace(/\s*\(.*$/,'').trim();return t.length>16?t.slice(0,15)+'…':t};
function fokusNoder(){const f=meshFokus;if(!f)return null;
 if(f.t==='obj'){const o=fase2.objekter.find(x=>x.id===f.id);if(!o)return null;const li=Math.max(0,Math.min(f.li||0,o.lag.length-1)),l=o.lag[li];
  const n=uiProps(l.form).map(p=>({key:tidOf(o,li,p),label:(o.lag.length>1?'Lag '+(li+1)+': ':'')+PROPS[p][0],kort:kortNavn(PROPS[p][0])}));
  if(o.liv&&o.liv.til&&!o.skabelon)n.push({key:'liv:'+o.id,label:'Fødsel (levende figur)',kort:'Fødsel'});
  return{noder:n,titel:o.navn+' · '+FORMER[l.form][0]+(o.lag.length>1?' · lag '+(li+1):'')}}
 if(f.t==='grp'){const n=f.keys.map(k=>TARGETS.find(t=>t.id===k)).filter(Boolean).map(t=>({key:t.id,label:t.navn,kort:kortNavn(t.navn)}));return n.length?{noder:n,titel:f.navn}:null}
 return null}
function fokusFraNode(key){if(key.startsWith('obj:')||key.startsWith('liv:')){const id=key.split(':')[1],o=fase2.objekter[selO];return{t:'obj',id,li:o&&o.id===id?selL:0}}
 if(/^klods\d+$/.test(key))return{t:'grp',navn:'Klodser',keys:TARGETS.filter(t=>/^klods\d+$/.test(t.id)).map(t=>t.id)};
 if(key.startsWith('lyd:'))return{t:'grp',navn:'Lyd',keys:TARGETS.filter(t=>t.id.startsWith('lyd:')).map(t=>t.id)};
 if(key==='slange'||key==='slange_farve')return{t:'grp',navn:'Slange',keys:['slange','slange_farve']};
 const t=TARGETS.find(t=>t.id===key);return{t:'grp',navn:t?t.navn:key,keys:[key]}}
function fokusSaet(f){meshFokus=f;const G=meshGeom();if(!meshFokus){fokusUI();return}
 const i=maps.findIndex(m=>G.en.some(n=>n.key===m.effect));if(i>=0)selMesh(i);fokusUI();meshRefresh();msg('Spindelvævet viser nu: '+G.titel+'. Træk fra et lydtræk (yderst) til en egenskab (i midten) for at koble den. Dobbeltklik på tom plads eller tryk Oversigt for at gå tilbage.')}
function fokusTilbage(){meshFokus=null;fokusUI();meshRefresh();msg('Spindelvævet viser oversigten igen.')}
const MESH_KASSER=['Scene','Lys og former','Bane','Efterspil og orden'];/* v4.0: alle fire effektgrupper fra Dublet er med, og alle forbindelser kan vælges direkte */
function fokusUI(){const sel=$('mb-vis');if(!sel)return;const sig=fase2.objekter.map(o=>o.id+'|'+o.navn).join(';')+'#'+maps.map(m=>m.band+'>'+m.effect+(m.off?'x':'')).join(',');
 if(sel.dataset.sig!==sig){sel.dataset.sig=sig;sel.innerHTML='<option value="">Oversigt (alle forbindelser)</option><optgroup label="Figurer">'+fase2.objekter.map(o=>`<option value="obj:${esc(o.id)}">${esc(o.navn)}${o.skabelon?' (model)':''}</option>`).join('')+'</optgroup><optgroup label="Grupper af effekter">'+MESH_KASSER.map(k=>`<option value="kasse:${k}">${k==='Scene'?'Scene-effekter':k}</option>`).join('')+'<option value="grp:lyd">Lyd (klik, tone, suus)</option><option value="grp:klods">Klodser (spor)</option><option value="grp:slange">Slange</option></optgroup><optgroup label="Vælg en forbindelse ('+maps.length+')">'+maps.map((m,i)=>`<option value="conn:${i}">${i+1}. ${esc(bandNavn(m.band))} → ${esc(effName(m.effect))}${m.off?' (slået fra)':''}</option>`).join('')+'</optgroup>'}
 const f=meshFokus;sel.value=!f?'':f.t==='obj'?'obj:'+f.id:MESH_KASSER.includes(f.navn)?'kasse:'+f.navn:f.navn==='Lyd'?'grp:lyd':f.navn==='Klodser'?'grp:klods':f.navn==='Slange'?'grp:slange':'';
 const lg=$('mb-lag'),o=f&&f.t==='obj'?fase2.objekter.find(x=>x.id===f.id):null;
 if(o&&o.lag.length>1){lg.hidden=false;lg.innerHTML=o.lag.map((l,i)=>`<option value="${i}">Lag ${i+1}: ${esc(FORMER[l.form][0])}</option>`).join('');lg.value=String(Math.min(f.li||0,o.lag.length-1))}else lg.hidden=true;
 $('mb-tilbage').hidden=!f}

/* v3.9: Stor visning og fuld skærm for Radial Mesh */
function meshStorSaet(on,stille){const w=$('w5');w.classList.toggle('meshstor',on);$('mstor').setAttribute('aria-pressed',on?'true':'false');$('mstor').textContent=on?'Vis kontroller':'Stor visning';requestAnimationFrame(meshResize);if(!stille)msg(on?'Stor visning: bjælkerne er skjult, og nettet fylder vinduet. Tryk Vis kontroller for at få dem tilbage.':'Kontrollerne er tilbage.')}
$('mstor').onclick=()=>{const on=!$('w5').classList.contains('meshstor');set.meshStor=on;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}meshStorSaet(on)};
$('mfuld').onclick=()=>{const w=$('w5');if(document.fullscreenElement===w){if(document.exitFullscreen)document.exitFullscreen().catch(()=>{});return}
 if(w.classList.contains('min'))miniSaet(w,false);w.hidden=false;
 if(!w.requestFullscreen){if(!w.classList.contains('max'))w.querySelector('.mx').click();meshStorSaet(true);msg('Din browser kan ikke vise et vindue i fuld skærm, så nettet er maksimeret i stedet.');return}
 try{const p=w.requestFullscreen();if(p&&p.catch)p.catch(()=>msg('Fuld skærm blev afvist af browseren. Prøv igen med et klik på knappen.'))}catch(e){msg('Fuld skærm blev afvist af browseren.')}};
document.addEventListener('fullscreenchange',()=>{const w=$('w5'),til=document.fullscreenElement===w;
 if(til){w.classList.add('meshfs');meshStorSaet(true,true);$('mfuld').textContent='Afslut fuld skærm';$('mfuld').setAttribute('aria-pressed','true');msg('Radial Mesh i fuld skærm. Escape eller Afslut fuld skærm går tilbage.')}
 else if(w.classList.contains('meshfs')){w.classList.remove('meshfs');meshStorSaet(!!set.meshStor,true);$('mfuld').textContent='Fuld skærm';$('mfuld').setAttribute('aria-pressed','false')}
 meshSig='';requestAnimationFrame(meshResize);setTimeout(meshResize,120);setTimeout(meshResize,400)});
if(set.meshStor)meshStorSaet(true,true);
$('mb-kilder').addEventListener('change',e=>{meshKilder=e.target.value;meshRefresh();msg(meshKilder==='hnd'?'Spindelvævet viser nu Hændelserne yderst: taktslag, akkordskift, slag, tone, støj, drop, pause, sektionsskift, MIDI, tast og pad. Træk fra en af dem til en effekt eller en egenskab.':meshKilder==='analyse'?'Spindelvævet viser nu toneklasserne og klang-målingerne yderst. Træk fra en af dem til en effekt eller en egenskab. Kræver en analyseret fil eller generatoren.':'Spindelvævet viser de 14 lydtræk yderst igen.')});
$('mb-vis').addEventListener('change',e=>{const v=e.target.value;if(!v){if(meshFokus)fokusTilbage();else fokusUI();return}if(v.startsWith('conn:')){const i=+v.slice(5);if(maps[i]){selMesh(i);msg('Valgt forbindelse '+(i+1)+': '+bandNavn(maps[i].band)+' → '+effName(maps[i].effect)+'.')}fokusUI();return}if(v.startsWith('kasse:')){const navn=v.slice(6),keys=Object.keys(DUB_KASSE).filter(k=>DUB_KASSE[k]===navn&&TARGETS.some(t=>t.id===k));fokusSaet({t:'grp',navn,keys});return}
 if(v.startsWith('obj:'))fokusSaet({t:'obj',id:v.slice(4),li:0});else fokusSaet(fokusFraNode(v==='grp:lyd'?'lyd:klik':v==='grp:klods'?'klods1':'slange'))});
$('mb-lag').addEventListener('change',e=>{if(meshFokus&&meshFokus.t==='obj')fokusSaet({...meshFokus,li:+e.target.value})});
$('mb-tilbage').addEventListener('click',()=>fokusTilbage());
function selMesh(i){if(i<0)return;meshSel=i;if(i>=0&&maps[i]){eqMap=i;eqSel=Math.max(0,idx(maps[i].band));eqRefresh()}meshRefresh()}
const meshPt=e=>{const r=mc.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*mc.width/meshS,y:(e.clientY-r.top)/r.height*mc.height/meshS}};
const meshNode=(p,G)=>{let best=null,bd=14;[...G.bn,...G.en].forEach(n=>{const d=Math.hypot(n.x-p.x,n.y-p.y);if(d<bd){bd=d;best=n}});return best};
function meshLine(p,G){let best=-1,bd=Math.max(10,(MTYK[set.meshTyk-1]||MTYK[3])[1]*2+6);maps.forEach((m,i)=>{const[b,e]=ends(m,G);if(!b||!e)return;const c=ctrl(b,e,G);for(let t=0;t<=1;t+=.05){const u=1-t,x=u*u*b.x+2*u*t*c.x+t*t*e.x,y=u*u*b.y+2*u*t*c.y+t*t*e.y,d=Math.hypot(x-p.x,y-p.y);if(d<bd){bd=d;best=i}}});return best}
mc.addEventListener('pointerdown',e=>{const p=meshPt(e),G=meshGeom();const n=meshNode(p,G);if(armed&&n&&n.kind==='b'){bindArmed(n.key);return}try{mc.setPointerCapture(e.pointerId)}catch(x){}if(n)meshDrag={n,x:p.x,y:p.y};else{const li=meshLine(p,G);if(li!==undefined&&li!==null&&li>=0)selMesh(li);else if(meshSel>=0){meshSel=-1;try{meshUI()}catch(x){}msg('Forbindelsen er fravalgt.')}}});
mc.addEventListener('pointermove',e=>{const p=meshPt(e);meshHover=meshNode(p,meshGeom());if(meshDrag){meshDrag.x=p.x;meshDrag.y=p.y}});
mc.addEventListener('pointerup',e=>{if(!meshDrag)return;const p=meshPt(e),G=meshGeom(),n=meshNode(p,G),d=meshDrag.n;meshDrag=null;
 if(n&&n.kind!==d.kind){meshKobl(d,n,G)}
 else if(n&&n.kind===d.kind&&n.key===d.key){const i=maps.findIndex(m=>d.kind==='b'?m.band===d.key:(G.exact?m.effect===d.key:nodeKey(m.effect)===d.key));if(i>=0)selMesh(i)}});
mc.addEventListener('dblclick',e=>{const p=meshPt(e),G=meshGeom(),n=meshNode(p,G);if(!meshFokus){if(n&&n.kind==='e')fokusSaet(fokusFraNode(n.key))}else if(!n)fokusTilbage()});
mc.addEventListener('pointerleave',()=>meshHover=null);
$('meshctl').addEventListener('input',e=>{const t=e.target;if(t.id==='mmaster'){gmaster=+t.value;t.nextElementSibling.textContent=gmaster;save();return}const f=t.dataset.f,m=maps[meshSel];if(!f||!m)return;m[f]=+t.value;t.nextElementSibling.textContent=m[f];save()});
$('meshctl').addEventListener('change',e=>{const m=maps[meshSel];if(!m)return;if(e.target.id==='minv')m.inv=e.target.checked;if(e.target.id==='moff')m.off=e.target.checked;save()});
$('mdel').onclick=()=>{if(maps[meshSel]){const i=meshSel;meshSel=-1;Regler.sletNr(i)}};

