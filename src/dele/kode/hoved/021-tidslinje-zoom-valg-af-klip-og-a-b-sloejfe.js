/* ========== TIDSLINJE: zoom, valg af klip og A/B-sløjfe ========== */
/* Zoom: hjulet zoomer omkring musen (Shift eller sidelæns hjul panorerer), knapperne zoomer omkring midten, og Hele sangen viser alt. Mindste visning er 0,25 sekund, så man kan arbejde med små klip. Valg af klip: træk på tidslinjen (eller tryk A og B ved afspilningsmarkøren); kanterne kan snappe til taktslag, første slag i takten eller et kvart sekund. Sløjfe: klippet gentages uden hak i lyden (browserens egen sløjfe), og uret (now) ombrydes, så alt andet (klodser, show, Lyd i 3D) følger med. Et klik uden for sløjfen slår den fra. */
const TLS={snap:'fra',drag:null,sel:null,traek:false,foelg:true,tlMin:.25};
function tlVis(){const d=dur||0;if(!(TLV.b>TLV.a))return{a:0,b:d};return{a:Math.max(0,TLV.a),b:Math.min(d,TLV.b)}}
const tlX=(t,W)=>{const V=tlVis();return (t-V.a)/((V.b-V.a)||1)*W},tlTrel=rel=>{const V=tlVis();return V.a+rel*(V.b-V.a)};
const tlTid=t=>{const m=Math.floor(t/60),s2=t-m*60;return m+':'+(s2<10?'0':'')+s2.toFixed(s2%1?1:0).replace('.',',')};
function tlSaet(a,b){const d=dur||0;if(!(d>0))return;const span=Math.max(TLS.tlMin,Math.min(d,b-a));a=Math.max(0,Math.min(d-span,a));TLV.a=a;TLV.b=a+span;tlUI()}
function tlZoom(f,t){const V=tlVis(),span=V.b-V.a,ny=Math.max(TLS.tlMin,Math.min(dur||span,span*f)),c=t==null?(V.a+V.b)/2:t,rel=span?(c-V.a)/span:.5;tlSaet(c-rel*ny,c-rel*ny+ny)}
function tlFit(){TLV.a=0;TLV.b=0;if(typeof tlUI==='function'&&$('tl-info'))tlUI()}
function tlPan(del){const V=tlVis(),span=V.b-V.a;tlSaet(V.a+del*span,V.a+del*span+span)}
function tlSnap(t){const m=TLS.snap;if(m==='fra')return t;if(m==='kvart')return Math.round(t/.25)*.25;const P=SHOWPROFIL;if(!P||!P.beats||!P.beats.length)return t;const dtf=H/sr;let best=t,bd=1e9;P.beats.forEach((k,i)=>{if(m==='takt'&&i%4!==P.fase)return;const bt=(k+1)*dtf,d2=Math.abs(bt-t);if(d2<bd){bd=d2;best=bt}});return best}
function loopCheck(t){if(LOOP.til&&(t<LOOP.a||t>=LOOP.b)){LOOP.til=false;msg('Sløjfen er slået fra: du hoppede ud af klippet. Tryk Sløjfe for at slå den til igen.');tlUI()}}
function tlSpring(t){loopCheck(t);const was=playing;stop();offset=t;if(was)play()}
function tlSloejfe(til){if(til&&!(LOOP.b-LOOP.a>=.1)){msg('Sløjfe: vælg først et klip (træk på tidslinjen, eller tryk A og B ved afspilningsmarkøren).');return false}
 const was=playing,t=now();if(was)stop();LOOP.til=!!til;offset=til?((t>=LOOP.a&&t<LOOP.b)?t:LOOP.a):t;if(was)play();tlUI();return true}
function tlSaetAB(hvilken){if(!buf){msg('A og B: vælg en lydfil først.');return false}const t=tlSnap(now());
 if(hvilken==='a'){LOOP.a=t;if(LOOP.b<=LOOP.a+.1)LOOP.b=0;msg('A sat til '+tlTid(t)+'. Gå til slutningen af klippet, og tryk B.');tlUI();return true}
 if(!(LOOP.a>=0)||t<=LOOP.a+.1){msg('B skal ligge efter A (mindst 0,1 sekund). Tryk A først, eller gå længere frem.');return false}
 LOOP.b=t;tlSloejfe(true);msg('Klippet er A '+tlTid(LOOP.a)+' til B '+tlTid(LOOP.b)+' ('+(LOOP.b-LOOP.a).toFixed(2).replace('.',',')+' s), og det gentages.');return true}
function tlUI(){const V=tlVis(),i=$('tl-info');if(!i)return;const zoomet=V.b-V.a<(dur||0)*.999,l=LOOP.b>LOOP.a;
 i.textContent=(buf?(zoomet?'Visning '+tlTid(V.a)+' til '+tlTid(V.b)+' ('+(V.b-V.a).toFixed(1).replace('.',',')+' s). ':'Hele sangen. '):'')+(l?'Klip A '+tlTid(LOOP.a)+' til B '+tlTid(LOOP.b)+' ('+(LOOP.b-LOOP.a).toFixed(2).replace('.',',')+' s), sløjfe '+(LOOP.til?'til':'fra')+'.':'');
 const lb=$('tl-loop');lb.setAttribute('aria-pressed',LOOP.til?'true':'false');['tl-zi','tl-zo','tl-fit','tl-a','tl-b','tl-loop','tl-zloop','tl-ryd'].forEach(x=>{const b=$(x);if(b)b.disabled=!buf})}
function tlOverlay(g,W,Hh,V){if(!buf)return;const span=V.b-V.a;if(!(span>0))return;g.save();g.font='11px '+getComputedStyle(document.body).fontFamily;g.textBaseline='top';
 const trin=[.05,.1,.25,.5,1,2,5,10,15,30,60,120,300],stp=trin.find(x=>x/span*W>=70)||300;g.fillStyle=css('--mute');g.strokeStyle=css('--line');
 for(let t=Math.ceil(V.a/stp)*stp;t<=V.b+1e-9;t+=stp){const x=tlX(t,W);g.beginPath();g.moveTo(x+.5,0);g.lineTo(x+.5,10);g.stroke();g.fillText(tlTid(t),x+3,1)}
 const P=SHOWPROFIL;if(P&&P.beats&&P.beats.length&&span<=40){const dtf=H/sr;P.beats.forEach((k,i)=>{const bt=(k+1)*dtf;if(bt<V.a||bt>V.b)return;const x=tlX(bt,W),bar=i%4===P.fase;g.globalAlpha=bar?.55:.2;g.fillStyle=css('--ink');g.fillRect(x,bar?11:14,1,bar?Hh-11:Hh-14);g.globalAlpha=1})}
 const reg=(a,b,fyld,navn)=>{const x0=Math.max(0,tlX(a,W)),x1=Math.min(W,tlX(b,W));if(x1<=x0)return;g.fillStyle=fyld;g.fillRect(x0,0,x1-x0,Hh)};
 if(LOOP.b>LOOP.a){reg(LOOP.a,LOOP.b,LOOP.til?'rgba(89,210,255,.16)':'rgba(160,170,200,.10)');[['A',LOOP.a],['B',LOOP.b]].forEach(([n,t])=>{const x=tlX(t,W);if(x<-2||x>W+2)return;g.fillStyle=LOOP.til?css('--acc'):css('--mute');g.fillRect(x-1,0,2,Hh);g.font='bold 12px sans-serif';g.fillText(n,x+(n==='A'?4:-12),Hh-16)})}
 else if(LOOP.a>0){const x=tlX(LOOP.a,W);g.fillStyle=css('--acc');g.fillRect(x-1,0,2,Hh);g.fillText('A',x+4,Hh-16)}
 if(TLS.sel)reg(TLS.sel.a,TLS.sel.b,'rgba(255,209,102,.22)');g.restore()}
function tlFoelg(){if(!TLS.foelg||!playing||TLS.drag)return;const V=tlVis(),span=V.b-V.a;if(!(span<(dur||0)*.999))return;const t=now();if(t<V.a||t>V.a+.92*span)tlSaet(t-.08*span,t-.08*span+span)}
/* knapper, hjul og træk */
$('tl-zi').onclick=()=>tlZoom(.5);$('tl-zo').onclick=()=>tlZoom(2);$('tl-fit').onclick=tlFit;$('tl-a').onclick=()=>tlSaetAB('a');$('tl-b').onclick=()=>tlSaetAB('b');$('tl-loop').onclick=()=>tlSloejfe(!LOOP.til);
$('tl-zloop').onclick=()=>{if(!(LOOP.b>LOOP.a)){msg('Zoom til sløjfe: vælg først et klip.');return}const sp=LOOP.b-LOOP.a;tlSaet(LOOP.a-.15*sp,LOOP.b+.15*sp)};
$('tl-ryd').onclick=()=>{const var_=LOOP.til;if(var_)tlSloejfe(false);LOOP.a=0;LOOP.b=0;LOOP.til=false;tlUI();msg('Klippet (A og B) er ryddet.')};
$('tl-snap').addEventListener('change',e=>{TLS.snap=e.target.value;const P=SHOWPROFIL;msg('Snap: '+({fra:'fra',taktslag:'til taktslag',takt:'til første slag i takten',kvart:'til et kvart sekund'})[TLS.snap]+((/taktslag|takt/.test(TLS.snap)&&!(P&&P.beats&&P.beats.length))?'. Der er endnu ingen taktslag (analysér en lydfil med et sikkert tempo), så der snappes ikke.':'.'))});
$('tl-foelg').addEventListener('change',e=>{TLS.foelg=e.target.checked});
$('tl').addEventListener('wheel',e=>{if(!buf)return;e.preventDefault();const r=e.currentTarget.getBoundingClientRect(),rel=(e.clientX-r.left)/(r.width||1);
 if(e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY))tlPan((e.deltaX||e.deltaY)>0?.1:-.1);else tlZoom(e.deltaY<0?.8:1.25,tlTrel(rel))},{passive:false});
$('tl').addEventListener('pointerdown',e=>{if(!buf||e.button>0)return;const r=e.currentTarget.getBoundingClientRect();TLS.drag={x0:e.clientX,rel0:(e.clientX-r.left)/(r.width||1),flyttet:false};try{e.currentTarget.setPointerCapture(e.pointerId)}catch(x){}});
$('tl').addEventListener('pointermove',e=>{const d0=TLS.drag;if(!d0)return;const r=e.currentTarget.getBoundingClientRect();if(Math.abs(e.clientX-d0.x0)>5)d0.flyttet=true;if(d0.flyttet){const t0=tlTrel(d0.rel0),t1=tlTrel((e.clientX-r.left)/(r.width||1));TLS.sel={a:Math.min(t0,t1),b:Math.max(t0,t1)}}});
$('tl').addEventListener('pointerup',e=>{const d0=TLS.drag;TLS.drag=null;const sel=TLS.sel;TLS.sel=null;if(!d0||!d0.flyttet||!sel)return;TLS.traek=true;const a=Math.max(0,tlSnap(sel.a)),b=Math.min(dur,tlSnap(sel.b));
 if(b-a<.1){msg('Klippet er for kort (under 0,1 sekund). Træk et længere stykke.');return}LOOP.a=a;LOOP.b=b;tlSloejfe(true);msg('Klippet er A '+tlTid(a)+' til B '+tlTid(b)+' ('+(b-a).toFixed(2).replace('.',',')+' s), og det gentages.')});
tlUI();
/* ========== SLUT: TIDSLINJE ========== */

