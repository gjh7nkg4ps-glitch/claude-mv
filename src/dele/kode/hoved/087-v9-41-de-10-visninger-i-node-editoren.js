/* ========== v9.41: DE 10 VISNINGER I NODE-EDITOREN ==========
   Brugerens valg (11. november): de 10 visninger fra Routing-overblik (slettet i v9.35) kommer tilbage, nu inde i Node-editoren.
   Værktøjslinjen har "Visning ▾": Noder (kolonner) er Node-editoren selv; de 10 andre er Frit netværk (kræfter), Matrix, Strømme, Tidslinje,
   Træ, Treemap, Bue-diagram, Hive plot, Ring (chord) og 3D-netværk. Vælges en af dem, står den i stedet for nodernes lærred (kontrolpanelet bliver).
   Tegningen og alt det, man kunne i Routing-overblik, er den samme kode som i v9.34 (blokken ROUTING-OVERBLIK, v3.4 og v3.5–v3.7): Find, Levende linjer,
   Vis slået fra, Fokus (klik på en knude), vælg en regel (klik på en linje) og ret dens tærskel og styrke i båndet nederst, Slå fra/til og Slet,
   Kræfter (Frastødning, Fjederlængde, Tyngdekraft, Retning, Vis kræfter, Ryst, Løsn fastgjorte, Standard), fastgør en knude (træk; dobbeltklik løsner),
   tidslinjen (klik hopper), træets faner, drej 3D-netværket og tastaturet. Kun tre linjer er ændret: hvornår den kan ses, Vis/Luk og tegnestarten.
   Valget huskes (set.neVis). Fladen laves med det samme (skjult), så den gamle kode finder sine knapper; den flyttes ind i Node-editoren, når den er bygget.
   rtHue og rtHash (fra v9.35-resten) står igen her, fordi de hører til blokken. */
/* v9.55: Matrix (gammel) er taget ud af listen (brugerens valg 15. november); dens tegning i drawRT bruges ikke mere */
const NE41_VIS=[['kol','Noder (kolonner)'],['fri','Frit netværk (kræfter)'],['strom','Strømme'],/* v9.77: Tidslinje er fjernet (Lyd over tid i Sang viser det samme for hele sangen) */['trae','Træ'],['treemap','Treemap'],['bue','Bue-diagram'],['hive','Hive plot'],['ring','Ring (chord)'],['d3','3D-netværk']];
{const d=document.createElement('div');d.id='ne-vis';d.className='ne-visflade';d.hidden=true;d.innerHTML="<div class=\"dubbar\"><label class=\"small ne41-lay\">Visning <select id=\"rtlay\" aria-label=\"Visning af reglerne\"><option value=\"kol\">Noder (kolonner)</option><option value=\"fri\">Frit netværk (kræfter)</option><option value=\"strom\">Strømme</option><option value=\"tid\">Tidslinje</option><option value=\"trae\">Træ</option><option value=\"treemap\">Treemap</option><option value=\"bue\">Bue-diagram</option><option value=\"hive\">Hive plot</option><option value=\"ring\">Ring (chord)</option><option value=\"d3\">3D-netværk</option></select></label><input id=\"rtfind\" type=\"search\" placeholder=\"Find …\" aria-label=\"Find lydtræk, mål eller figur\" style=\"width:140px\"><label class=\"small\" title=\"Linjerne lyser og bliver tykkere, når forbindelsen slår ud (envelope).\"><input type=\"checkbox\" id=\"rtpuls\" checked> Levende linjer</label><label class=\"small\" title=\"Vis også forbindelser, der er slået fra (stiplede).\"><input type=\"checkbox\" id=\"rtfra\" checked> Vis slået fra</label><button id=\"rtryd\" class=\"ghost\">Ryd fokus</button><span class=\"small\" id=\"rtinfo\" aria-live=\"off\"></span></div><div class=\"dubbar\" id=\"rtkraft\" hidden><span class=\"small\"><b>Kræfter</b></span><label class=\"small\" title=\"Hvor hårdt alle knuder skubber til hinanden. Højere giver mere luft.\">Frastødning <input type=\"range\" data-k=\"rep\" id=\"rtk-rep\" min=\"0\" max=\"3\" step=\".05\"> <span id=\"rtv-rep\"></span></label><label class=\"small\" title=\"Hver linje er en fjeder; dette er den længde, fjederen helst vil have.\">Fjederlængde <input type=\"range\" data-k=\"len\" id=\"rtk-len\" min=\"30\" max=\"220\" step=\"5\"> <span id=\"rtv-len\"></span></label><label class=\"small\" title=\"Trækker alle knuder mod midten, så netværket holder sammen.\">Tyngdekraft <input type=\"range\" data-k=\"grav\" id=\"rtk-grav\" min=\"0\" max=\"3\" step=\".05\"> <span id=\"rtv-grav\"></span></label><label class=\"small\" title=\"Trækker lydtræk mod venstre, mål mod midten og figurer mod højre. 0 er rent kraftlayout.\">Retning <input type=\"range\" data-k=\"ret\" id=\"rtk-ret\" min=\"0\" max=\"1\" step=\".05\"> <span id=\"rtv-ret\"></span></label><label class=\"small\" title=\"Tegn den samlede kraft på hver knude som en gul pil.\"><input type=\"checkbox\" id=\"rtk-vis\"> Vis kræfter</label><button id=\"rtk-ryst\" class=\"ghost\">Ryst</button><button id=\"rtk-los\" class=\"ghost\">Løsn fastgjorte</button><button id=\"rtk-nul\" class=\"ghost\">Standard</button><span class=\"small\" id=\"rtk-ro\"></span></div><div class=\"wb ne41-wb\"><canvas id=\"rt\" aria-label=\"Visning af alle regler: lydtræk, mål og figurer\"></canvas><p id=\"rt-hjaelp\" class=\"sr-only\">Visningen med tastatur: op og ned pil går i en kolonne, venstre og højre pil skifter mellem lydtræk, mål og figurer og kasser. Home og End går til første og sidste. Enter sætter fokus på knuden, så kun dens forbindelser er fremhævet, og Enter igen slår fokus fra. Skarpe parenteser eller Page up og Page down vælger forrige og næste forbindelse (inden for fokus). Delete sletter den valgte forbindelse. Escape rydder fokus og valg. I layoutet Frit netværk fastgør eller løsner P den aktuelle knude, og op og ned pil følger knudernes højde. Layout-menuen har 10 layouts; tastaturet går gennem lydtræk, mål og figurer på samme måde i dem alle. Tasterne bruges ikke til klaveret, mens lærredet har fokus.</p></div><div id=\"rtsel\" class=\"small\"></div>";document.body.appendChild(d)}
/* Alle forbindelser i tre faste kolonner: lydtræk → mål (effekter og figur-egenskaber) → figurer og kasser.
   Kolonnerne står fast, men rækkefølgen i hver kolonne findes med en kraft-lignende afslapning (barycenter): hver knude trækkes mod gennemsnittet af sine naboers højde, så forbundne knuder kommer ud for hinanden, og linjerne krydser mindre. Knuderne glider til deres nye plads, så billedet er roligt, også når forbindelser kommer og går.
   Klik på en knude: fokus på dens forbindelser (resten dæmpes). Klik på en linje: vælg forbindelsen (samme valg som i Radial Mesh og Dublet). Klik på en figur: den vælges også i Form-editoren. Linjetykkelse = gain; med Levende linjer lyser linjerne med forbindelsens envelope. */
const rt={W:800,H:500,t:0,y:{},fokus:null,conn:-1,scr:[0,0,0],lay:null,lines:[],stripSig:'',infoSig:'',kb:{kol:0,i:0,vis:false}};
const rtSynlig=()=>{const v=$('ne-vis');return!!v&&!v.hidden&&v.offsetParent!==null},RT_TOP=26,RT_KOL=['Lydtræk','Mål','Figurer og kasser'];
function rtResize(){const c=$('rt'),b=c.parentNode,d=Math.min(2,window.devicePixelRatio||1);rt.W=b.clientWidth||800;rt.H=b.clientHeight||500;c.width=Math.max(50,Math.round(rt.W*d));c.height=Math.max(50,Math.round(rt.H*d))}
function rtVis(on){ne41Vis(on?(set.rtLay&&set.rtLay!=='kol'?set.rtLay:'fri'):'noder')}
function rtHue(k){const i=BANDS.findIndex(b=>b[0]===k);if(i>=0)return i*26;let h=0;for(const ch of String(k))h=(h*31+ch.charCodeAt(0))%360;return h}
function rtMaal(k){
 if(k.startsWith('obj:')||k.startsWith('liv:')){const liv=k.startsWith('liv:'),dele=k.split(':'),id=dele[1],o=fase2.objekter.find(x=>x.id===id),gl=o?o.navn:id;
  let label='Liv · fødsel';if(!liv){const li=+dele[2],p=dele.slice(3).join(':');label=(PROP_VIS[p]||(PROPS[p]?PROPS[p][0]:p))+(o&&o.lag.length>1?' (lag '+(li+1)+')':'')}
  return{label,full:gl+': '+label,g:'fig:'+id,gl,gfull:'Figur: '+gl,fig:id}}
 const t=TARGETS.find(x=>x.id===k),kasse=/^klods\d+$/.test(k)?'Bane':k.startsWith('lyd:')?'Lyd':(DUB_KASSE[k]||'Andet');
 return{label:DUB_KORT[k]||(t?t.navn:k),full:t?t.navn:k,g:'kasse:'+kasse,gl:kasse,gfull:'Kasse: '+kasse,fig:null}}
function rtGraf(){const q=($('rtfind').value||'').trim().toLowerCase(),visFra=$('rtfra').checked,K=[{},{},{}],e1=[],E2={};
 maps.forEach((m,i)=>{if(m.off&&!visFra)return;const a=rtMaal(m.effect),bn=bandNavn(m.band);
  if(q&&![bn,a.full,a.gfull].some(s=>String(s).toLowerCase().includes(q)))return;
  const s='s:'+m.band,t='t:'+m.effect,g=a.g;
  if(!K[0][s])K[0][s]={id:s,kol:0,key:m.band,label:bn,full:'Lydtræk: '+bn,n:0};
  if(!K[1][t])K[1][t]={id:t,kol:1,key:m.effect,label:a.label,full:a.full,n:0,g};
  if(!K[2][g])K[2][g]={id:g,kol:2,key:g,label:a.gl,full:a.gfull,fig:a.fig,n:0,maal:[]};
  K[0][s].n++;K[1][t].n++;K[2][g].n++;if(!K[2][g].maal.includes(m.effect))K[2][g].maal.push(m.effect);
  e1.push({i,a:s,b:t,m});const k2=t+'>'+g;if(!E2[k2])E2[k2]={a:t,b:g}});
 return{kol:K.map(o=>Object.values(o)),e1,e2:Object.values(E2)}}
function rtLayout(){const G=rtGraf(),W=rt.W,H=rt.H,cw=Math.max(104,Math.min(196,Math.round((W-60)*.27))),xs=[8,Math.round(W/2-cw/2),W-cw-8],avail=H-RT_TOP-8,nb={},alle={};
 const add=(a,b)=>{(nb[a]=nb[a]||[]).push(b);(nb[b]=nb[b]||[]).push(a)};G.e1.forEach(e=>add(e.a,e.b));G.e2.forEach(e=>add(e.a,e.b));
 const kol=G.kol.map((L,c)=>{const n=L.length,h=Math.max(15,Math.min(22,Math.floor(avail/Math.max(1,n))-3)),step=h+3,tot=n*step,off=tot<avail?(avail-tot)/2:0;
  L.forEach(nd=>{const cy=rt.y[nd.id],ns=(nb[nd.id]||[]).map(id=>rt.y[id]).filter(v=>v!==undefined);let d=ns.length?ns.reduce((a,b)=>a+b,0)/ns.length:(cy!==undefined?cy:1e9);if(cy!==undefined&&ns.length)d=d*.7+cy*.3;nd.d=d});
  L.sort((a,b)=>(a.d-b.d)||a.label.localeCompare(b.label,'da'));
  const maxS=Math.max(0,tot-avail);rt.scr[c]=Math.max(0,Math.min(rt.scr[c],maxS));
  L.forEach((nd,j)=>{const mal=RT_TOP+off+j*step,cy=rt.y[nd.id];rt.y[nd.id]=cy===undefined?mal:cy+(mal-cy)*.22;nd.x=xs[c];nd.w=cw;nd.h=h;nd.y=rt.y[nd.id]-rt.scr[c];alle[nd.id]=nd});
  return{L,maxS,x:xs[c],w:cw}});
 Object.keys(rt.y).forEach(k=>{if(!alle[k])delete rt.y[k]});
 return{G,kol,alle,W,H,cw}}
function rtFokusMaps(L){const f=rt.fokus&&L.alle[rt.fokus];if(!f)return null;const s=new Set();
 maps.forEach((m,i)=>{if(f.kol===0?m.band===f.key:f.kol===1?m.effect===f.key:f.maal.includes(m.effect))s.add(i)});return s}
function rtAkt(nd){if(nd.kol===0)return Math.min(1,Math.max(0,bandV(nd.key)||0));if(nd.kol===1)return Math.min(1,lastE[nd.key]||0);if(nd.fig)return Math.min(1,nodeAct('obj:'+nd.fig));return Math.min(1,Math.max(0,...nd.maal.map(k=>lastE[k]||0)))}
const rtKort=(t,w)=>{t=String(t);const n=Math.max(3,Math.floor(w/6));return t.length>n?t.slice(0,n-1)+'…':t};
function drawRT(){if(!rtSynlig())return;const nu=performance.now();if(nu-rt.t<33)return;rt.t=nu;if(set.rtLay!=='kol'&&set.rtLay!=='fri'){rtTegnAndre();return}
 const c=$('rt'),g=c.getContext('2d'),d=c.width/rt.W,fri=set.rtLay==='fri',L=rt.lay=fri?rtLayoutFri():rtLayout(),W=rt.W,H=rt.H,acc=css('--acc')||'#3fc3a8',mute=css('--mute')||'#9aa7b4',puls=$('rtpuls').checked;
 if(rt.fokus&&!L.alle[rt.fokus])rt.fokus=null;if(rt.conn>=0&&!maps[rt.conn])rt.conn=-1;
 const F=rtFokusMaps(L),lit=new Set();if(F)F.forEach(i=>{const m=maps[i];lit.add('s:'+m.band);lit.add('t:'+m.effect);lit.add(rtMaal(m.effect).g)});
 g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,W,H);g.fillStyle='#10161c';g.fillRect(0,0,W,H);g.font='11px Schibsted Grotesk,sans-serif';g.textBaseline='middle';
 if(!fri)L.kol.forEach((k,ci)=>{g.fillStyle=mute;g.textAlign='left';g.fillText(RT_KOL[ci]+' ('+k.L.length+')'+(k.maxS>0?' ↕':''),k.x+2,12)});else{g.fillStyle=mute;g.textAlign='left';g.fillText('Frit netværk · '+L.kol.map((k,ci)=>RT_KOL[ci].toLowerCase()+' '+k.L.length).join(' · '),8,12)}
 if(!L.G.e1.length){g.fillStyle=mute;g.textAlign='center';g.font='12px Schibsted Grotesk,sans-serif';g.fillText(maps.length?'Ingen forbindelser passer til søgningen.':'Der er ingen forbindelser endnu. Lav dem i Radial Mesh, Dublet eller Mapping.',W/2,H/2);rtStrip();rtInfo(L);return}
 const bez=(sx,sy,tx,ty)=>{g.beginPath();g.moveTo(sx,sy);if(fri){g.lineTo(tx,ty);return}const k=Math.max(30,(tx-sx)*.45);g.bezierCurveTo(sx+k,sy,tx-k,ty,tx,ty)},ax=(n,h)=>fri?n.x+n.w/2:(h?n.x+n.w:n.x);
 // mål → figurer og kasser
 L.G.e2.forEach(e=>{const a=L.alle[e.a],b=L.alle[e.b];if(!a||!b)return;const on=!F||(lit.has(e.a)&&lit.has(e.b));bez(ax(a,1),a.y+a.h/2,ax(b,0),b.y+b.h/2);g.strokeStyle=b.fig?'rgba(255,209,102,'+(F?(on?.8:.05):.3)+')':'rgba(127,214,255,'+(F?(on?.8:.05):.3)+')';g.lineWidth=on&&F?2:1.2;g.stroke()});
 // lydtræk → mål (én linje pr. forbindelse)
 rt.lines=[];L.G.e1.forEach(e=>{const a=L.alle[e.a],b=L.alle[e.b];if(!a||!b)return;const m=e.m,sx=ax(a,1),sy=a.y+a.h/2,tx=ax(b,0),ty=b.y+b.h/2,en=puls?Math.min(1,env[e.i]||0):0,valgt=e.i===rt.conn,on=!F||F.has(e.i);
  let al=m.off?.22:(.42+en*.5);if(F&&!on)al=.05;else if(F)al=Math.max(al,.85);if(valgt)al=1;
  bez(sx,sy,tx,ty);if(m.off)g.setLineDash([5,4]);g.strokeStyle=valgt?'#ffffff':'hsla('+rtHue(m.band)+',85%,62%,'+al+')';g.lineWidth=(valgt?2.5:1)+Math.min(2,+m.gain||1)*1.2+en*2.5;g.stroke();g.setLineDash([]);rt.lines.push({i:e.i,sx,sy,tx,ty,fri})});
 // knuder
 L.kol.forEach((k,ci)=>{g.save();if(!fri){g.beginPath();g.rect(k.x-2,RT_TOP-3,k.w+4,H-RT_TOP+3);g.clip()}
  k.L.forEach(nd=>{if(nd.y+nd.h<RT_TOP-3||nd.y>H)return;const a=rtAkt(nd),on=!F||lit.has(nd.id),fok=rt.fokus===nd.id,kbv=rt.kb.vis&&rt.kb.kol===ci&&k.L[rt.kb.i]===nd;
   g.globalAlpha=on?1:.28;g.fillStyle=fok?'#2b3b4d':'#18212b';g.fillRect(nd.x,nd.y,nd.w,nd.h);
   const farve=ci===0?'hsla('+rtHue(nd.key)+',80%,50%,.55)':ci===1?'rgba(255,255,255,.14)':nd.fig?'rgba(255,209,102,.4)':'rgba(127,214,255,.35)';g.fillStyle=farve;g.fillRect(nd.x,nd.y,nd.w*a,nd.h);
   if(ci===2){g.fillStyle=nd.fig?'#ffd166':'#7fd6ff';g.fillRect(nd.x,nd.y,3,nd.h)}
   g.strokeStyle=fok?'#fff':'rgba(255,255,255,.18)';g.lineWidth=1;g.strokeRect(nd.x+.5,nd.y+.5,nd.w-1,nd.h-1);
   g.fillStyle='#e6edf4';g.textAlign='left';g.fillText(rtKort(nd.label,nd.w-30),nd.x+(ci===2?8:5),nd.y+nd.h/2);g.fillStyle=acc;g.textAlign='right';g.fillText(String(nd.n),nd.x+nd.w-4,nd.y+nd.h/2);
   if(kbv){g.globalAlpha=1;g.strokeStyle='#ffd54a';g.lineWidth=2;g.strokeRect(nd.x-2,nd.y-2,nd.w+4,nd.h+4)}if(fri&&nd.p&&nd.p.pin){g.fillStyle='#ffd54a';g.beginPath();g.arc(nd.x+nd.w-2,nd.y+2,3.5,0,7);g.fill()}g.globalAlpha=1});g.restore()});
 if(fri&&$('rtk-vis').checked){g.strokeStyle='rgba(255,213,74,.85)';g.fillStyle='rgba(255,213,74,.85)';g.lineWidth=1.5;Object.values(L.alle).forEach(nd=>{const p=nd.p;if(!p||p.pin)return;let fx=p.fx*6,fy=p.fy*6;const l=Math.hypot(fx,fy);if(l<3)return;if(l>48){fx*=48/l;fy*=48/l}const ex=p.x+fx,ey=p.y+fy,an=Math.atan2(fy,fx);g.beginPath();g.moveTo(p.x,p.y);g.lineTo(ex,ey);g.stroke();g.beginPath();g.moveTo(ex,ey);g.lineTo(ex-6*Math.cos(an-.45),ey-6*Math.sin(an-.45));g.lineTo(ex-6*Math.cos(an+.45),ey-6*Math.sin(an+.45));g.fill()})}
 if(fri){const t=rt.alfa>.3&&rt.bev>.3?'I bevægelse':rt.bev>.05&&rt.alfa>.03?'Falder til ro':'I ro';const el=$('rtk-ro');if(el.textContent!==t)el.textContent=t}
 rtStrip();rtInfo(L)}
function rtInfo(L){const t=maps.length+' forbindelser'+(L.G.e1.length!==maps.length?' ('+L.G.e1.length+' vist)':'')+(rt.fokus&&L.alle[rt.fokus]?' · fokus: '+L.alle[rt.fokus].label:'');if(t!==rt.infoSig){rt.infoSig=t;$('rtinfo').textContent=t}}
function rtPt(e){const r=$('rt').getBoundingClientRect();return{x:(e.clientX-r.left)/(r.width||rt.W)*rt.W,y:(e.clientY-r.top)/(r.height||rt.H)*rt.H}}
function rtVed(p){const L=rt.lay;if(!L)return null;if(L.andre)return rtVedAndre(p);for(const k of L.kol)for(const nd of k.L)if(p.x>=nd.x&&p.x<=nd.x+nd.w&&p.y>=nd.y&&p.y<=nd.y+nd.h&&p.y>=RT_TOP-3)return{t:'n',nd};
 for(const l of rt.lines){if(l.fri){const vx=l.tx-l.sx,vy=l.ty-l.sy,q=Math.max(0,Math.min(1,((p.x-l.sx)*vx+(p.y-l.sy)*vy)/(vx*vx+vy*vy||1)));if(Math.hypot(l.sx+q*vx-p.x,l.sy+q*vy-p.y)<6)return{t:'l',i:l.i};continue}const k=Math.max(30,(l.tx-l.sx)*.45);for(let s=0;s<=1;s+=.04){const u=1-s,x=u*u*u*l.sx+3*u*u*s*(l.sx+k)+3*u*s*s*(l.tx-k)+s*s*s*l.tx,y=u*u*u*l.sy+3*u*u*s*l.sy+3*u*s*s*l.ty+s*s*s*l.ty;if(Math.hypot(x-p.x,y-p.y)<6)return{t:'l',i:l.i}}}return null}
function rtFokus(nd){if(!nd||rt.fokus===nd.id){rt.fokus=null;msg('Fokus er slået fra. Alle forbindelser vises.');return}rt.fokus=nd.id;
 if(nd.fig){const j=fase2.objekter.findIndex(o=>o.id===nd.fig);if(j>=0&&j!==selO){selO=j;selL=0;try{formUI()}catch(e){}}}
 const n=maps.filter(m=>nd.kol===0?m.band===nd.key:nd.kol===1?m.effect===nd.key:nd.maal.includes(m.effect)).length;msg('Fokus på '+nd.full+': '+n+' forbindelse'+(n===1?'':'r')+'.'+(nd.fig?' Figuren er også valgt i Form-editoren.':''))}
function rtVaelg(i){if(i<0||!maps[i])return;rt.conn=i;selMesh(i);rt.stripSig='';const m=maps[i];msg('Valgt forbindelse: '+bandNavn(m.band)+' til '+rtMaal(m.effect).full+(m.off?' (slået fra)':'')+'.')}
const rtC=$('rt');
rtC.addEventListener('pointerdown',e=>{const pt=rtPt(e),v=rtVed(pt);if(!v){if(set.rtLay==='d3'){rt.rot={x0:pt.x,y0:pt.y,a:rt.ang.a,b:rt.ang.b,flyt:false};try{rtC.setPointerCapture(e.pointerId)}catch(er){}return}if(rt.fokus){rt.fokus=null}return}if(v.t==='x'){if(v.h.fn)v.h.fn(pt);return}if(v.t==='n'){if(set.rtLay==='fri'&&v.nd.p){rt.drag={id:v.nd.id,nd:v.nd,x0:pt.x,y0:pt.y,dx:v.nd.p.x-pt.x,dy:v.nd.p.y-pt.y,flyt:false};try{rtC.setPointerCapture(e.pointerId)}catch(er){}return}rtFokus(v.nd)}else rtVaelg(v.i)});
rtC.addEventListener('pointerup',()=>{const d=rt.drag;if(!d)return;rt.drag=null;if(!d.flyt)rtFokus(d.nd);else msg(d.nd.full+' er fastgjort. Dobbeltklik for at løsne den.')});
rtC.addEventListener('pointerup',()=>{if(!rt.rot)return;if(!rt.rot.flyt&&rt.fokus)rt.fokus=null;rt.rot=null;rt.spinPause=performance.now()+3000});
rtC.addEventListener('dblclick',e=>{if(set.rtLay!=='fri')return;const v=rtVed(rtPt(e));if(v&&v.t==='n'&&v.nd.p){v.nd.p.pin=!v.nd.p.pin;rtVarm(.3);msg(v.nd.full+(v.nd.p.pin?' er fastgjort.':' er løsnet og følger kræfterne igen.'))}});
rtC.addEventListener('pointermove',e=>{if(rt.rot){const pt=rtPt(e),r=rt.rot;if(Math.hypot(pt.x-r.x0,pt.y-r.y0)>4)r.flyt=true;rt.ang.a=r.a+(pt.x-r.x0)*.01;rt.ang.b=Math.max(-1.4,Math.min(1.4,r.b+(pt.y-r.y0)*.01));return}if(rt.drag){const pt=rtPt(e),d=rt.drag,p=rt.p[d.id];if(!d.flyt&&Math.hypot(pt.x-d.x0,pt.y-d.y0)>4)d.flyt=true;if(d.flyt&&p){p.x=pt.x+d.dx;p.y=pt.y+d.dy;p.vx=p.vy=0;p.pin=true;rtVarm(.3)}return}const v=rtVed(rtPt(e));let t='';if(v&&v.t==='x')t=v.h.tip||'';else if(v&&v.t==='n')t=v.nd.full+' · '+v.nd.n+' forbindelse'+(v.nd.n===1?'':'r')+'. Klik for fokus.';else if(v&&v.t==='l'){const m=maps[v.i];t=bandNavn(m.band)+' → '+rtMaal(m.effect).full+' (gain '+m.gain+'). Klik for at vælge.'}if(rtC.title!==t)rtC.title=t;rtC.style.cursor=v?'pointer':'default'});
rtC.addEventListener('wheel',e=>{const L=rt.lay;if(!L)return;if(set.rtLay==='trae'){if(rt.scrMax>0){rt.scrA=Math.max(0,Math.min(rt.scrMax,rt.scrA+e.deltaY));e.preventDefault()}return}if(L.fri||L.andre)return;const p=rtPt(e),ci=L.kol.findIndex(k=>p.x>=k.x-6&&p.x<=k.x+k.w+6);if(ci<0||L.kol[ci].maxS<=0)return;rt.scr[ci]=Math.max(0,Math.min(L.kol[ci].maxS,rt.scr[ci]+e.deltaY));e.preventDefault()},{passive:false});
$('rtryd').onclick=()=>{rt.fokus=null;rt.conn=-1;rt.stripSig='';msg('Fokus og valg er ryddet.')};
$('rtfind').addEventListener('input',()=>{rt.scr=[0,0,0]});
/* Tastatur: Tab ind i lærredet. Op og ned pil går i en kolonne, venstre og højre pil skifter kolonne, Enter sætter fokus (eller slår det fra), [ og ] går gennem forbindelserne (i fokus, hvis der er et), Delete sletter den valgte forbindelse, Escape rydder fokus. Tasterne standses, så de ikke også spiller klaver. */
function rtKbNu(){const L=rt.lay||rtLayout();let k=L.kol[rt.kb.kol];if(!k||!k.L.length){const j=L.kol.findIndex(x=>x.L.length);if(j<0)return null;rt.kb.kol=j;k=L.kol[j]}rt.kb.i=((rt.kb.i%k.L.length)+k.L.length)%k.L.length;return{L,k,nd:k.L[rt.kb.i]}}
function rtKbSig(){const s=rtKbNu();if(!s){msg('Der er ingen forbindelser endnu.');return}const{k,nd}=s,top=RT_TOP,bund=rt.H-8;if(set.rtLay!=='kol'){}else if(nd.y<top)rt.scr[rt.kb.kol]=Math.max(0,rt.scr[rt.kb.kol]-(top-nd.y)-2);else if(nd.y+nd.h>bund)rt.scr[rt.kb.kol]=Math.min(k.maxS,rt.scr[rt.kb.kol]+(nd.y+nd.h-bund)+2);rt.kb.vis=true;msg(RT_KOL[rt.kb.kol]+': '+(rt.kb.kol===0?nd.label:nd.full)+', '+nd.n+' forbindelse'+(nd.n===1?'':'r')+' ('+(rt.kb.i+1)+' af '+k.L.length+'). Enter sætter fokus.')}
rtC.setAttribute('tabindex','0');rtC.setAttribute('role','application');rtC.setAttribute('aria-describedby','rt-hjaelp');
rtC.addEventListener('focus',()=>{let fv=false;try{fv=rtC.matches(':focus-visible')}catch(e){}if(!fv)return;rt.kb.vis=true;rtKbSig()});rtC.addEventListener('blur',()=>{rt.kb.vis=false});
rtC.addEventListener('keydown',e=>{if(e.ctrlKey||e.metaKey||e.altKey)return;const k=e.key,stop=()=>{e.preventDefault();e.stopPropagation()};
 if(k==='ArrowDown'||k==='ArrowUp'){stop();rt.kb.i+=k==='ArrowDown'?1:-1;rtKbSig();return}
 if(k==='Home'||k==='End'){stop();const s=rtKbNu();if(s)rt.kb.i=k==='Home'?0:s.k.L.length-1;rtKbSig();return}
 if(k==='ArrowRight'||k==='ArrowLeft'){stop();const ny=rt.kb.kol+(k==='ArrowRight'?1:-1);if(ny<0||ny>2){msg('Der er ikke flere kolonner den vej.');return}const s=rtKbNu();const gl=s?s.nd.y:0;rt.kb.kol=ny;const L=rt.lay;if(L&&L.kol[ny].L.length){let b=0,bd=1e9;L.kol[ny].L.forEach((n,j)=>{const dd=Math.abs(n.y-gl);if(dd<bd){bd=dd;b=j}});rt.kb.i=b}rtKbSig();return}
 if(k==='Enter'||k===' '){stop();const s=rtKbNu();if(s)rtFokus(s.nd);return}
 if(k==='Escape'){if(rt.fokus||rt.conn>=0){stop();rt.fokus=null;rt.conn=-1;rt.stripSig='';msg('Fokus og valg er ryddet.')}return}
 if(k==='['||k===']'||k==='PageUp'||k==='PageDown'){stop();const F=rt.lay?rtFokusMaps(rt.lay):null,liste=F?[...F].sort((a,b)=>a-b):maps.map((m,i)=>i);if(!liste.length){msg('Der er ingen forbindelser.');return}const d=(k===']'||k==='PageDown')?1:-1,p=liste.indexOf(rt.conn),j=p<0?(d>0?0:liste.length-1):(p+d+liste.length)%liste.length;rtVaelg(liste[j]);return}
 if(k==='Delete'||k==='Backspace'){stop();rtSlet();return}
 if((k==='p'||k==='P')&&set.rtLay==='fri'){stop();const s=rtKbNu();if(s&&s.nd.p){s.nd.p.pin=!s.nd.p.pin;msg(s.nd.full+(s.nd.p.pin?' er fastgjort.':' er løsnet.'))}return}});
function rtSlet(){if(rt.conn<0||!maps[rt.conn]){msg('Ingen forbindelse er valgt. Klik på en linje, eller vælg en med [ og ].');return}{const i=rt.conn;rt.conn=-1;meshSel=-1;Regler.sletNr(i)}rt.stripSig='';msg('Forbindelsen er slettet. Der er '+maps.length+' tilbage.')}
/* Den valgte forbindelse: skydere og knapper under overblikket (samme felter som i Dublet) */
function rtStrip(){const m=maps[rt.conn],el=$('rtsel'),sig=m?rt.conn+'|'+m.band+'|'+m.effect+'|'+(m.off?1:0):'ingen';if(sig===rt.stripSig)return;rt.stripSig=sig;
 if(!m){el.innerHTML='<span>Klik på en knude for at se dens forbindelser, og klik på en linje for at vælge den. Linjetykkelse er gain; stiplet betyder slået fra.</span>';return}
 el.innerHTML='<b>'+hesc(bandNavn(m.band))+' → '+hesc(rtMaal(m.effect).full)+'</b><label>Tærskel <span data-v="thr">'+m.thr+'</span> <input type="range" data-f="thr" min="0" max="1" step=".01" value="'+m.thr+'"></label><label>Gain <span data-v="gain">'+m.gain+'</span> <input type="range" data-f="gain" min="0" max="2" step=".05" value="'+m.gain+'"></label><button class="ghost" data-act="fra">'+(m.off?'Slå til':'Slå fra')+'</button><button class="ghost" data-act="slet">Slet</button>'}
$('rtsel').addEventListener('input',e=>{const t=e.target,f=t.dataset.f,m=maps[rt.conn];if(!f||!m)return;m[f]=+t.value;t.parentNode.querySelector('[data-v]').textContent=m[f];save()});
$('rtsel').addEventListener('click',e=>{const a=e.target.dataset.act,m=maps[rt.conn];if(!a||!m)return;if(a==='slet'){rtSlet();return}if(a==='fra'){m.off=!m.off;save();renderMaps()}rt.stripSig=''});
rtResize();
/* ---------- v3.5: Frit netværk (force-directed) som valg ----------
   Samme graf som kolonnerne, men placeret af en lille fysik-simulation: alle knuder skubber til hinanden (frastødning), hver linje er en fjeder (fjederlængde), tyngdekraften holder netværket samlet, og Retning trækker svagt lydtræk mod venstre, mål mod midten og figurer og kasser mod højre. Det er et læringsvalg: skyderne ændrer kræfterne mens det kører, og Vis kræfter tegner den samlede kraft på hver knude som en pil. Træk i en knude for at fastgøre den; dobbeltklik løsner den. */
const RT_KRAFT0={rep:1,len:90,grav:1,ret:.3};
if(!['kol','fri','strom','trae','treemap','bue','hive','ring','d3'].includes(set.rtLay))set.rtLay='kol';if(set.neVis==='tid')set.neVis='kol';/* v9.55: den gamle Matrix-visning er fjernet; den nye matrix står under Noder · Matrix */set.rtKraft=Object.assign({},RT_KRAFT0,set.rtKraft||{});
rt.p={};rt.drag=null;rt.bev=0;rt.alfa=1;rt.gsig='';
const rtVarm=a=>{rt.alfa=Math.max(rt.alfa,a)};
function rtGemSet(){try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}}
function rtHash(s){let h=0;for(const ch of String(s))h=(h*31+ch.charCodeAt(0))%100003;return h}
function rtLayoutFri(){const G=rtGraf(),W=rt.W,H=rt.H,alle={},P=rt.p,K=set.rtKraft,nodes=[].concat(...G.kol);
 nodes.forEach(nd=>{nd.w=Math.round(Math.min(170,Math.max(70,nd.label.length*6.4+34)));nd.h=20;alle[nd.id]=nd;let p=P[nd.id];
  if(!p){const hx=rtHash(nd.id),gy=rt.y[nd.id];p=P[nd.id]={x:W*(.1+.4*nd.kol)+(hx%40-20),y:gy!==undefined?gy+10:H/2+((hx>>3)%160-80),vx:0,vy:0,fx:0,fy:0,pin:false}}nd.p=p});
 Object.keys(P).forEach(k=>{if(!alle[k])delete P[k]});
 const gs=nodes.length+'|'+G.e1.length+'|'+G.e2.length;if(gs!==rt.gsig){rt.gsig=gs;rtVarm(.6)}rt.alfa=Math.max(.015,rt.alfa*.985);const al=rt.alfa;
 const n=nodes.length,rep=K.rep*3200,sp=.012,gv=.0025*K.grav,rk=.01*K.ret;
 nodes.forEach(nd=>{nd.p.fx=0;nd.p.fy=0});
 for(let i=0;i<n;i++){const a=nodes[i].p;for(let j=i+1;j<n;j++){const b=nodes[j].p;let dx=(b.x-a.x)*.4,dy=b.y-a.y,d2=dx*dx+dy*dy;if(d2<1){dx=.7;dy=.5;d2=.74}const d=Math.sqrt(d2),f=rep/d2;dx=dx/d*2.5;dy/=d;a.fx-=dx*f;a.fy-=dy*f;b.fx+=dx*f;b.fy+=dy*f}}/* boksene er brede og lave, så vandret afstand tæller kun 40 %, og det vandrette skub forstærkes tilsvarende */
 const fjeder=(a,b)=>{if(!a||!b)return;const A=a.p,B=b.p;let dx=B.x-A.x,dy=B.y-A.y;const d=Math.hypot(dx,dy)+.01,f=(d-K.len)*sp;dx/=d;dy/=d;A.fx+=dx*f;A.fy+=dy*f;B.fx-=dx*f;B.fy-=dy*f};
 G.e1.forEach(e=>fjeder(alle[e.a],alle[e.b]));G.e2.forEach(e=>fjeder(alle[e.a],alle[e.b]));
 let bev=0;nodes.forEach(nd=>{const p=nd.p;p.fx+=(W/2-p.x)*gv*.35+(W*(.1+.4*nd.kol)-p.x)*rk;p.fy+=((RT_TOP+H)/2-p.y)*gv;
  if(p.pin||(rt.drag&&rt.drag.id===nd.id)){p.vx=p.vy=0}else{p.vx=(p.vx+Math.max(-20,Math.min(20,p.fx))*al)*.7;p.vy=(p.vy+Math.max(-20,Math.min(20,p.fy))*al)*.7;p.x+=p.vx;p.y+=p.vy;bev+=Math.abs(p.vx)+Math.abs(p.vy)}
  p.x=Math.max(nd.w/2+6,Math.min(W-nd.w/2-6,p.x));p.y=Math.max(RT_TOP+nd.h/2,Math.min(H-nd.h/2-6,p.y));nd.x=p.x-nd.w/2;nd.y=p.y-nd.h/2});
 for(let r=0;r<2;r++)for(let i=0;i<n;i++){const A=nodes[i],a=A.p;for(let j=i+1;j<n;j++){const B=nodes[j],b=B.p,dx=b.x-a.x,dy=b.y-a.y,ox=(A.w+B.w)/2+8-Math.abs(dx),oy=(A.h+B.h)/2+5-Math.abs(dy);if(ox<=0||oy<=0)continue;const fa=a.pin||(rt.drag&&rt.drag.id===A.id)?0:1,fb=b.pin||(rt.drag&&rt.drag.id===B.id)?0:1,sum=fa+fb;if(!sum)continue;if(oy<ox){const m=oy*(dy>=0?1:-1)/sum;a.y-=m*fa;b.y+=m*fb}else{const m=ox*(dx>=0?1:-1)/sum;a.x-=m*fa;b.x+=m*fb}}}
 nodes.forEach(nd=>{const p=nd.p;p.x=Math.max(nd.w/2+6,Math.min(W-nd.w/2-6,p.x));p.y=Math.max(RT_TOP+nd.h/2,Math.min(H-nd.h/2-6,p.y));nd.x=p.x-nd.w/2;nd.y=p.y-nd.h/2});
 rt.bev=n?bev/n:0;
 const kol=G.kol.map(L=>({L:L.slice().sort((a,b)=>a.p.y-b.p.y),maxS:0,x:0,w:0}));
 return{G,kol,alle,W,H,fri:true}}
function rtLayVis(){const fri=set.rtLay==='fri'||set.rtLay==='d3';$('rtlay').value=set.rtLay;$('rtkraft').hidden=!fri;const K=set.rtKraft;['rep','len','grav','ret'].forEach(k=>{const el=$('rtk-'+k);el.value=K[k];$('rtv-'+k).textContent=k==='len'?K[k]+' px':(+K[k]).toFixed(2)})}
$('rtlay').addEventListener('change',e=>{set.rtLay=RT_LAYS[e.target.value]?e.target.value:'kol';rt.scr=[0,0,0];rt.scrA=0;rt.drag=null;rt.rot=null;rtVarm(.8);rt.alfa3=Math.max(rt.alfa3,.8);rtGemSet();rtLayVis();msg(RT_LAYS[set.rtLay]+': '+RT_SPOERG[set.rtLay]+(set.rtLay==='fri'?' Træk i en knude for at fastgøre den; dobbeltklik løsner den.':set.rtLay==='d3'?' Træk i en tom plads for at dreje.':set.rtLay==='trae'?' Vælg figur eller kasse i fanerne øverst.':''))});
$('rtkraft').addEventListener('input',e=>{const k=e.target.dataset.k;if(!k)return;set.rtKraft[k]=+e.target.value;rtVarm(.5);rtLayVis();rtGemSet()});
$('rtk-nul').onclick=()=>{set.rtKraft=Object.assign({},RT_KRAFT0);rtVarm(.6);rtLayVis();rtGemSet();msg('Kræfterne er sat tilbage til standard.')};
$('rtk-los').onclick=()=>{let n=0;Object.values(rt.p).forEach(p=>{if(p.pin){p.pin=false;n++}});rtVarm(.4);msg(n?n+' fastgjort'+(n===1?' knude er':'e knuder er')+' løsnet.':'Ingen knuder var fastgjort.')};
$('rtk-ryst').onclick=()=>{rtVarm(1);Object.values(rt.p).forEach(p=>{if(!p.pin){p.vx+=(Math.random()-.5)*30;p.vy+=(Math.random()-.5)*30}});msg('Netværket er rystet; se det falde til ro igen.')};
rtLayVis();
/* ---------- v3.7: Ni layouts mere i Routing-overblik ----------
   Matrix, Strømme, Tidslinje, Træ, Treemap, Bue-diagram, Hive plot, Ring og 3D-netværk. De bruger samme graf (rtGraf), samme fokus (rtFokusMaps), samme valgte forbindelse og samme bånd som Kolonner og Frit netværk. Hvert layout tegner sig selv og lægger sine klikbare former i rt.hit (Path2D), så klik-testen er fælles: forbindelser vælges, knuder får fokus. Hvert layout svarer på sit eget spørgsmål (RT_SPOERG), som står ved Layout-menuen. */
const RT_LAYS={kol:'Kolonner',fri:'Frit netværk (kræfter)',strom:'Strømme',tid:'Tidslinje',trae:'Træ',treemap:'Treemap',bue:'Bue-diagram',hive:'Hive plot',ring:'Ring (chord)',d3:'3D-netværk'};
const RT_SPOERG={kol:'Hvor er forbindelsen, og hvordan retter jeg den?',fri:'Hvad hører sammen i klynger?',strom:'Hvor meget styrer hver lyd?',tid:'Hvornår i sangen slår hver forbindelse ud?',trae:'Hvad påvirker lige præcis denne figur?',treemap:'Hvor stor en del af forbindelserne har hver figur?',bue:'Hvilke lyde deler de samme mål?',hive:'Hvordan fordeler forbindelserne sig mellem grupperne?',ring:'Hvilke lyde og mål hænger sammen på kryds og tværs?',d3:'Hvordan ser det hele ud i rummet?'};
rt.hit=[];rt.npos={};rt.scrA=0;rt.scrMax=0;rt.trae=null;rt.hist=[];rt.tidC=null;rt.p3={};rt.ang={a:.5,b:-.25};rt.rot=null;rt.spinPause=0;rt.alfa3=1;rt.gsig3='';
const RT_TXT='#e6edf4',rtGrpC=n=>n&&n.fig?'#ffd166':'#7fd6ff',rtBandI=k=>{const i=BANDS.findIndex(b=>b[0]===k);return i<0?100:i};
function rtTlV(k,t){try{if(k.startsWith('ana:'))return(typeof A!=='undefined'&&A)?Math.min(1,Math.max(0,sampleA(k,t))):0;return(typeof F!=='undefined'&&F&&F[k])?Math.min(1,Math.max(0,sample(k,t))):0}catch(e){return 0}}
function rtSq(items,x,y,w,h){const out=[],tot=items.reduce((a,b)=>a+b.v,0);if(!tot||w<1||h<1)return out;const sc=w*h/tot;let rest=items.slice().sort((a,b)=>b.v-a.v).map(it=>({it,a:it.v*sc}));
 while(rest.length){const side=Math.min(w,h);let row=[],best=Infinity;for(let i=0;i<rest.length;i++){const r=rest.slice(0,i+1),s=r.reduce((a,b)=>a+b.a,0),mx=Math.max(...r.map(q=>q.a)),mn=Math.min(...r.map(q=>q.a)),wo=Math.max(side*side*mx/(s*s),s*s/(side*side*mn));if(wo<=best){best=wo;row=r}else break}
  const s=row.reduce((a,b)=>a+b.a,0),th=s/side;let off=0;row.forEach(q=>{const l=q.a/th;out.push(w>=h?{it:q.it,x,y:y+off,w:th,h:l}:{it:q.it,x:x+off,y,w:l,h:th});off+=l});if(w>=h){x+=th;w-=th}else{y+=th;h-=th}rest=rest.slice(row.length)}return out}
function rtTegnAndre(){const c=$('rt'),g=c.getContext('2d'),d=c.width/rt.W,W=rt.W,H=rt.H,lay=set.rtLay,G=rtGraf(),alle={};
 G.kol.forEach(L=>L.forEach(n=>{n.x=n.x||0;n.y=n.y||0;n.w=n.w||0;n.h=n.h||0;alle[n.id]=n}));
 const L=rt.lay={G,alle,kol:G.kol.map(Lk=>({L:Lk,maxS:0,x:0,w:0})),W,H,andre:true};
 if(rt.fokus&&!alle[rt.fokus])rt.fokus=null;if(rt.conn>=0&&!maps[rt.conn])rt.conn=-1;
 const F=rtFokusMaps(L),lit=new Set();if(F)F.forEach(i=>{const m=maps[i];lit.add('s:'+m.band);lit.add('t:'+m.effect);lit.add(rtMaal(m.effect).g)});
 const on=n=>!F||lit.has(n.id),eOn=i=>!F||F.has(i),puls=$('rtpuls').checked,en=i=>puls?Math.min(1,env[i]||0):0,mute=css('--mute')||'#9aa7b4';
 rt.hit=[];rt.npos={};g.setTransform(d,0,0,d,0,0);g.clearRect(0,0,W,H);g.fillStyle='#10161c';g.fillRect(0,0,W,H);g.font='11px Schibsted Grotesk,sans-serif';g.textBaseline='middle';
 g.fillStyle=mute;g.textAlign='left';g.fillText(RT_LAYS[lay]+' · '+RT_SPOERG[lay],8,12);
 if(!G.e1.length){g.textAlign='center';g.font='12px Schibsted Grotesk,sans-serif';g.fillText(maps.length?'Ingen forbindelser passer til søgningen.':'Der er ingen forbindelser endnu. Lav dem i Radial Mesh, Dublet eller Mapping.',W/2,H/2);rtStrip();rtInfo(L);return}
 const X={g,L,G,W,H,F,lit,on,eOn,en,mute};
 ({strom:rtStrom,trae:rtTrae,treemap:rtTreemap,bue:rtBue,hive:rtHive,ring:rtRing,d3:rt3D})[lay](X);
 if(rt.kb.vis){const s=rtKbNu(),p=s&&rt.npos[s.nd.id];if(p){g.globalAlpha=1;g.strokeStyle='#ffd54a';g.lineWidth=2;g.strokeRect(p.x-3,p.y-3,p.w+6,p.h+6)}}
 rtStrip();rtInfo(L)}
const rtFarve=(m,a)=>'hsla('+rtHue(m.band)+',85%,62%,'+a+')';
function rtSel(g,p,i){if(i===rt.conn){g.strokeStyle='#fff';g.lineWidth=2;g.stroke(p)}}
function rtNodeHit(nd,x,y,w,h){const p=new Path2D();p.rect(x,y,w,h);rt.hit.push({p,t:'n',nd});rt.npos[nd.id]={x,y,w,h}}
/* 1. Matrix (gammel): fjernet i v9.92; væk fra Visning ▾ siden v9.55 (knappen Noder · Matrix er den nye) */
/* 2. Strømme (Sankey): knudernes højde = summen af gain; hvert bånd = én forbindelse, tykkelse = gain. */
function rtStrom({g,L,G,W,H,F,lit,on,eOn,en}){const bw=12,top=26,gv=m=>Math.max(.05,+m.gain||0)*(m.off?.3:1);
 const x0=Math.max(110,W*.18),x1=W*.5-bw/2,x2=W-Math.max(140,W*.22),ord=(a,b)=>((rt.y[a.id]??1e9)-(rt.y[b.id]??1e9))||a.label.localeCompare(b.label,'da');
 const S=G.kol[0].slice().sort((a,b)=>rtBandI(a.key)-rtBandI(b.key)||ord(a,b)),T=G.kol[1].slice().sort((a,b)=>a.g.localeCompare(b.g)||ord(a,b)),Gr=G.kol[2].slice().sort(ord);
 const sum={};G.e1.forEach(e=>{const v=gv(e.m);sum[e.a]=(sum[e.a]||0)+v;sum[e.b]=(sum[e.b]||0)+v;const gg=L.alle[e.b].g;sum[gg]=(sum[gg]||0)+v});const tot=G.e1.reduce((a,e)=>a+gv(e.m),0);
 const gap=n=>n>25?2:n>12?4:7,kf=Math.min(...[S,T,Gr].map(c=>(H-top-8-gap(c.length)*(c.length-1))/tot));
 const pos={},lay=(c,x)=>{let y=top;c.forEach(n=>{const h=Math.max(1,sum[n.id]*kf);pos[n.id]={x,y,h,o:y,oi:y};y+=h+gap(c.length)})};lay(S,x0);lay(T,x1);lay(Gr,x2);
 const bandP=(xa,ya,xb,yb,h)=>{const mx=(xa+xb)/2,p=new Path2D();p.moveTo(xa,ya);p.bezierCurveTo(mx,ya,mx,yb,xb,yb);p.lineTo(xb,yb+h);p.bezierCurveTo(mx,yb+h,mx,ya+h,xa,ya+h);p.closePath();return p};
 T.forEach(t=>{const a=pos[t.id],b=pos[t.g];if(!b)return;const h=sum[t.id]*kf,p=bandP(x1+bw,a.y,x2,b.oi,h);b.oi+=h;g.fillStyle=rtGrpC(L.alle[t.g]);g.globalAlpha=(on(t)?.22:.05);g.fill(p);g.globalAlpha=1});
 const E=G.e1.slice().sort((p,q)=>T.indexOf(L.alle[p.b])-T.indexOf(L.alle[q.b])||S.indexOf(L.alle[p.a])-S.indexOf(L.alle[q.a]));
 E.forEach(e=>{const a=pos[e.a],b=pos[e.b],h=gv(e.m)*kf,p=bandP(x0+bw,a.o,x1,b.o,h);a.o+=h;b.o+=h;g.fillStyle=rtFarve(e.m,(e.m.off?.15:.3+.45*en(e.i))*(eOn(e.i)?1:.15));g.fill(p);rtSel(g,p,e.i);rt.hit.push({p,t:'l',i:e.i})});
 const nod=(n,col,lx,align,w)=>{const p=pos[n.id];g.globalAlpha=on(n)?1:.3;g.fillStyle=col;g.fillRect(p.x,p.y,bw,p.h);if(p.h>=9||!F||lit.has(n.id)){g.fillStyle=RT_TXT;g.textAlign=align;g.fillText(rtKort(n.label,w),lx,p.y+p.h/2)}g.globalAlpha=1;rtNodeHit(n,p.x,p.y,bw,Math.max(4,p.h))};
 S.forEach(n=>nod(n,'hsl('+rtHue(n.key)+',80%,55%)',x0-6,'right',x0-12));T.forEach(n=>nod(n,'rgba(230,237,244,.55)',x1+bw+5,'left',Math.min(170,x2-x1-40)));Gr.forEach(n=>nod(n,rtGrpC(n),x2+bw+6,'left',W-x2-bw-12))}
/* 3. Tidslinje (rtTid) er fjernet i v9.77: Lyd over tid i Sang → Avanceret viser lydtrækkene for hele sangen */
function rtTrae({g,L,G,W,H,F,on,eOn,en,mute}){const Gr=G.kol[2].slice().sort((a,b)=>(b.fig?1:0)-(a.fig?1:0)||a.label.localeCompare(b.label,'da'));if(!Gr.length)return;
 if(rt.fokus&&L.alle[rt.fokus]&&L.alle[rt.fokus].kol===2)rt.trae=rt.fokus;if(!rt.trae||!L.alle[rt.trae])rt.trae=Gr[0].id;const R=L.alle[rt.trae];
 const tw=Math.max(60,Math.min(140,(W-16)/Gr.length));Gr.forEach((n,i)=>{const x=8+i*tw,p=new Path2D();p.rect(x,22,tw-4,18);const v=n.id===rt.trae;g.fillStyle=v?'#2b3b4d':'#18212b';g.fill(p);g.fillStyle=rtGrpC(n);g.fillRect(x,22,3,18);g.fillStyle=v?'#fff':RT_TXT;g.textAlign='left';g.fillText(rtKort(n.label,tw-14),x+7,31);rt.hit.push({p,t:'x',tip:n.full+': vis træet for denne.',fn:()=>{rt.trae=n.id;rt.scrA=0;msg('Træ for '+n.full+'.')}})});
 const Ts=G.kol[1].filter(t=>t.g===rt.trae).sort((a,b)=>a.label.localeCompare(b.label,'da')),rows=[];Ts.forEach(t=>G.e1.filter(e=>e.b===t.id).sort((p,q)=>rtBandI(p.m.band)-rtBandI(q.m.band)).forEach(e=>rows.push({e,t})));
 const top=50,rh=Math.max(14,Math.min(26,(H-top-8)/Math.max(1,rows.length))),tot=rows.length*rh;rt.scrMax=Math.max(0,tot-(H-top-8));rt.scrA=Math.max(0,Math.min(rt.scrMax,rt.scrA));const off=tot<H-top-8?(H-top-8-tot)/2:0;
 const bw=Math.min(170,W*.24),xs=12,xt=W*.42,xr=W-bw-12,y0=top+off-rt.scrA;g.save();g.beginPath();g.rect(0,top-4,W,H-top+4);g.clip();
 const ty={};rows.forEach((r,i)=>{(ty[r.t.id]=ty[r.t.id]||[]).push(y0+i*rh+rh/2)});const ry=y0+tot/2;
 const elb=(xa,ya,xb,yb)=>{const mx=(xa+xb)/2,p=new Path2D();p.moveTo(xa,ya);p.lineTo(mx,ya);p.lineTo(mx,yb);p.lineTo(xb,yb);return p};
 Ts.forEach(t=>{const ys=ty[t.id],cy=ys.reduce((a,b)=>a+b,0)/ys.length;g.strokeStyle=rtGrpC(R);g.globalAlpha=on(t)?.6:.15;g.lineWidth=1.5;g.stroke(elb(xt+bw,cy,xr,ry));g.globalAlpha=1;g.globalAlpha=on(t)?1:.3;g.fillStyle='#18212b';g.fillRect(xt,cy-9,bw,18);g.strokeStyle='rgba(255,255,255,.2)';g.strokeRect(xt+.5,cy-8.5,bw-1,17);g.fillStyle=RT_TXT;g.textAlign='left';g.fillText(rtKort(t.label,bw-10),xt+5,cy);g.globalAlpha=1;rtNodeHit(t,xt,cy-9,bw,18)});
 rows.forEach((r,i)=>{const y=y0+i*rh+rh/2,m=r.e.m,ys=ty[r.t.id],cy=ys.reduce((a,b)=>a+b,0)/ys.length,p=elb(xs+bw,y,xt,cy),o=eOn(r.e.i);g.strokeStyle=rtFarve(m,(m.off?.25:.45+.5*en(r.e.i))*(o?1:.15));g.lineWidth=1+Math.min(2,+m.gain||0)*1.2;if(m.off)g.setLineDash([5,4]);g.stroke(p);g.setLineDash([]);rtSel(g,p,r.e.i);
  const bp=new Path2D();bp.rect(xs,y-rh/2+2,bw,rh-4);g.globalAlpha=o?1:.3;g.fillStyle='#18212b';g.fill(bp);g.fillStyle='hsla('+rtHue(m.band)+',80%,50%,.6)';g.fillRect(xs,y-rh/2+2,3,rh-4);g.fillStyle=RT_TXT;g.textAlign='left';g.fillText(rtKort(bandNavn(m.band),bw-12),xs+7,y);g.globalAlpha=1;rt.hit.push({p:bp,t:'l',i:r.e.i});rt.hit.push({p,t:'l',i:r.e.i,s:3})});
 g.restore();g.fillStyle='#2b3b4d';g.fillRect(xr,ry-12,bw,24);g.fillStyle=rtGrpC(R);g.fillRect(xr,ry-12,4,24);g.fillStyle='#fff';g.textAlign='left';g.fillText(rtKort(R.label+' · '+R.n,bw-14),xr+9,ry);rtNodeHit(R,xr,ry-12,bw,24)}
/* 5. Treemap: arealet = antal forbindelser. Yderste felter er figurer og kasser, indre felter er deres mål. */
function rtTreemap({g,L,G,W,H,F,on,eOn,en}){const outer=rtSq(G.kol[2].map(n=>({v:n.n,n})),8,24,W-16,H-32);
 outer.forEach(o=>{const n=o.it.n,c=rtGrpC(n);g.globalAlpha=on(n)?1:.3;g.fillStyle=c;g.globalAlpha*=.12;g.fillRect(o.x+1,o.y+1,o.w-2,o.h-2);g.globalAlpha=on(n)?1:.3;g.strokeStyle=c;g.lineWidth=1.5;g.strokeRect(o.x+1,o.y+1,o.w-2,o.h-2);
  const hh=o.h>40&&o.w>50?16:0;if(hh){g.fillStyle=c;g.textAlign='left';g.fillText(rtKort(n.label+' · '+n.n,o.w-12),o.x+6,o.y+10)}g.globalAlpha=1;rtNodeHit(n,o.x,o.y,o.w,Math.max(hh,6));
  const ts=G.kol[1].filter(t=>t.g===n.id).map(t=>({v:t.n,t}));rtSq(ts,o.x+4,o.y+hh+3,o.w-8,o.h-hh-7).forEach(r=>{const t=r.it.t,es=G.e1.filter(e=>e.b===t.id),m=es[0].m,pu=Math.max(0,...es.map(e=>en(e.i))),a=(.25+.45*pu)*(on(t)?1:.2);
   g.fillStyle=rtFarve(m,a);g.fillRect(r.x+1,r.y+1,r.w-2,r.h-2);g.strokeStyle='rgba(16,22,28,.9)';g.lineWidth=1;g.strokeRect(r.x+1,r.y+1,r.w-2,r.h-2);if(r.w>44&&r.h>14){g.globalAlpha=on(t)?1:.4;g.fillStyle=RT_TXT;g.textAlign='left';g.fillText(rtKort(t.label,r.w-8),r.x+4,r.y+Math.min(10,r.h/2));g.globalAlpha=1}rtNodeHit(t,r.x,r.y,r.w,r.h)})})}
/* 6. Bue-diagram: lydtræk og mål på én linje; hver forbindelse er en bue over linjen. Mål står ved siden af de lyde, der styrer dem, så delte mål ses som buer, der mødes. */
function rtBue({g,L,G,W,H,F,lit,on,eOn,en}){const S=G.kol[0].slice().sort((a,b)=>rtBandI(a.key)-rtBandI(b.key)||a.label.localeCompare(b.label,'da')),sp={};S.forEach((s,i)=>sp[s.id]=i*2);
 const T=G.kol[1].map(t=>{const ss=G.e1.filter(e=>e.b===t.id).map(e=>sp[e.a]);return{t,v:ss.reduce((a,b)=>a+b,0)/ss.length+.5}});const N=[...S.map(s=>({n:s,v:sp[s.id]})),...T.map(x=>({n:x.t,v:x.v}))].sort((a,b)=>a.v-b.v||a.n.kol-b.n.kol);
 const ly=H*.66,x0=30,x1=W-30,px={};N.forEach((x,i)=>px[x.n.id]=N.length>1?x0+(x1-x0)*i/(N.length-1):W/2);
 G.e1.forEach(e=>{const xa=px[e.a],xb=px[e.b],cx=(xa+xb)/2,rx=Math.abs(xb-xa)/2,ry=Math.min(rx,ly-34),p=new Path2D();p.ellipse(cx,ly,Math.max(.5,rx),Math.max(.5,ry),0,Math.PI,2*Math.PI);g.strokeStyle=rtFarve(e.m,(e.m.off?.2:.4+.5*en(e.i))*(eOn(e.i)?1:.1));g.lineWidth=1+Math.min(2,+e.m.gain||0)*1.2+en(e.i)*2;if(e.m.off)g.setLineDash([5,4]);g.stroke(p);g.setLineDash([]);rtSel(g,p,e.i);rt.hit.push({p,t:'l',i:e.i,s:3})});
 g.strokeStyle='rgba(255,255,255,.15)';g.lineWidth=1;g.beginPath();g.moveTo(x0-10,ly);g.lineTo(x1+10,ly);g.stroke();
 const many=N.length>40;N.forEach(({n})=>{const x=px[n.id],o=on(n);g.globalAlpha=o?1:.3;g.fillStyle=n.kol===0?'hsl('+rtHue(n.key)+',80%,58%)':'#e6edf4';g.beginPath();g.arc(x,ly,n.kol===0?5:3.5,0,7);g.fill();
  if(!many||(F&&lit.has(n.id))||n.kol===0){g.save();g.translate(x,ly+10);g.rotate(Math.PI/3);g.fillStyle=n.kol===0?'hsl('+rtHue(n.key)+',80%,70%)':RT_TXT;g.textAlign='left';g.fillText(rtKort(n.label,(H-ly)*1.05),0,0);g.restore()}g.globalAlpha=1;rtNodeHit(n,x-7,ly-7,14,14)})}
/* 7. Hive plot: tre akser fra midten (lydtræk op, mål ned til højre, figurer og kasser ned til venstre); forbindelserne er kurver mellem akserne. */
function rtHive({g,L,G,W,H,F,lit,on,eOn,en,mute}){const cx=W/2,cy=H/2+14,R0=26,R1=Math.max(60,Math.min(W,H)/2-46),ax=[-90,30,150].map(a=>a*Math.PI/180),navn=['Lydtræk','Mål','Figurer og kasser'];
 const C=[G.kol[0].slice().sort((a,b)=>rtBandI(a.key)-rtBandI(b.key)),G.kol[1].slice().sort((a,b)=>a.g.localeCompare(b.g)||a.label.localeCompare(b.label,'da')),G.kol[2].slice().sort((a,b)=>a.label.localeCompare(b.label,'da'))],P={};
 C.forEach((c,k)=>{g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=2;g.beginPath();g.moveTo(cx+Math.cos(ax[k])*R0*.6,cy+Math.sin(ax[k])*R0*.6);g.lineTo(cx+Math.cos(ax[k])*(R1+8),cy+Math.sin(ax[k])*(R1+8));g.stroke();g.fillStyle=mute;g.textAlign='center';g.fillText(navn[k],cx+Math.cos(ax[k])*(R1+22),cy+Math.sin(ax[k])*(R1+22));
  c.forEach((n,j)=>{const r=R0+(R1-R0)*(j+.5)/c.length;P[n.id]={x:cx+Math.cos(ax[k])*r,y:cy+Math.sin(ax[k])*r,k,r}})});
 const kur=(a,b)=>{const p=new Path2D(),bi=(ax[a.k]+ax[b.k])/2,rc=(a.r+b.r)/2*.95;p.moveTo(a.x,a.y);p.quadraticCurveTo(cx+Math.cos(bi)*rc,cy+Math.sin(bi)*rc,b.x,b.y);return p};/* kurven buer ud mellem de to akser: kontrolpunktet ligger på vinkelhalveringslinjen i gennemsnitsradius */
 G.e2.forEach(e=>{const a=P[e.a],b=P[e.b];if(!a||!b)return;g.strokeStyle=rtGrpC(L.alle[e.b]);g.globalAlpha=(!F||(lit.has(e.a)&&lit.has(e.b)))?.3:.05;g.lineWidth=1;g.stroke(kur(a,b));g.globalAlpha=1});
 G.e1.forEach(e=>{const p=kur(P[e.a],P[e.b]);g.strokeStyle=rtFarve(e.m,(e.m.off?.2:.4+.5*en(e.i))*(eOn(e.i)?1:.08));g.lineWidth=1+Math.min(2,+e.m.gain||0)+en(e.i)*2;if(e.m.off)g.setLineDash([5,4]);g.stroke(p);g.setLineDash([]);rtSel(g,p,e.i);rt.hit.push({p,t:'l',i:e.i,s:3})});
 C.forEach((c,k)=>c.forEach(n=>{const p=P[n.id],o=on(n);g.globalAlpha=o?1:.3;g.fillStyle=k===0?'hsl('+rtHue(n.key)+',80%,58%)':k===2?rtGrpC(n):'#e6edf4';g.beginPath();g.arc(p.x,p.y,4,0,7);g.fill();
  if(c.length<=22||(F&&lit.has(n.id))){const nx=-Math.sin(ax[k]),ny=Math.cos(ax[k]),s=k===1?1:-1;g.fillStyle=RT_TXT;g.textAlign=(nx*s>=0)?'left':'right';g.fillText(rtKort(n.label,120),p.x+nx*s*8,p.y+ny*s*8)}g.globalAlpha=1;rtNodeHit(n,p.x-6,p.y-6,12,12)}))}
/* 8. Ring (chord): alle knuder på en cirkel i tre buer; forbindelserne er korder gennem midten. */
function rtRing({g,L,G,W,H,F,lit,on,eOn,en}){const cx=W/2,cy=H/2+10,R=Math.max(50,Math.min(W,H)/2-80),C=[G.kol[0].slice().sort((a,b)=>rtBandI(a.key)-rtBandI(b.key)),G.kol[1].slice().sort((a,b)=>a.g.localeCompare(b.g)||a.label.localeCompare(b.label,'da')),G.kol[2].slice().sort((a,b)=>a.label.localeCompare(b.label,'da'))];
 const n=C.reduce((a,c)=>a+c.length,0),gp=.12,span=2*Math.PI-3*gp,P={};let a=-Math.PI/2+gp/2;C.forEach(c=>{c.forEach(nd=>{const w=span/n;P[nd.id]={a:a+w/2,x:cx+Math.cos(a+w/2)*R,y:cy+Math.sin(a+w/2)*R};a+=w});a+=gp});
 const kord=(p,q)=>{const pa=new Path2D();pa.moveTo(p.x,p.y);pa.quadraticCurveTo(cx,cy,q.x,q.y);return pa};
 G.e2.forEach(e=>{const p=P[e.a],q=P[e.b];g.strokeStyle=rtGrpC(L.alle[e.b]);g.globalAlpha=(!F||(lit.has(e.a)&&lit.has(e.b)))?.25:.04;g.lineWidth=1;g.stroke(kord(p,q));g.globalAlpha=1});
 G.e1.forEach(e=>{const pa=kord(P[e.a],P[e.b]);g.strokeStyle=rtFarve(e.m,(e.m.off?.2:.4+.5*en(e.i))*(eOn(e.i)?1:.08));g.lineWidth=1+Math.min(2,+e.m.gain||0)+en(e.i)*2;if(e.m.off)g.setLineDash([5,4]);g.stroke(pa);g.setLineDash([]);rtSel(g,pa,e.i);rt.hit.push({p:pa,t:'l',i:e.i,s:3})});
 C.forEach((c,k)=>c.forEach(nd=>{const p=P[nd.id],o=on(nd);g.globalAlpha=o?1:.3;g.fillStyle=k===0?'hsl('+rtHue(nd.key)+',80%,58%)':k===2?rtGrpC(nd):'#e6edf4';g.beginPath();g.arc(p.x,p.y,4.5,0,7);g.fill();
  if(n<=60||(F&&lit.has(nd.id))){g.save();g.translate(p.x,p.y);let r=p.a;const left=Math.cos(r)<0;g.rotate(left?r+Math.PI:r);g.fillStyle=RT_TXT;g.textAlign=left?'right':'left';g.fillText(rtKort(nd.label,72),left?-9:9,0);g.restore()}g.globalAlpha=1;rtNodeHit(nd,p.x-6,p.y-6,12,12)}))}
/* 9. 3D-netværk: samme kræfter som Frit netværk, men i tre dimensioner. Det drejer langsomt; træk i en tom plads for at dreje selv. Nære knuder er større og klarere. */
function rt3D({g,L,G,W,H,F,lit,on,eOn,en}){const K=set.rtKraft,N=[].concat(...G.kol),P=rt.p3;
 N.forEach(n=>{if(!P[n.id]){const h=rtHash(n.id),u=(h%997)/997*2*Math.PI,v=Math.acos(2*((h%613)/613)-1),r=90+(h%50);P[n.id]={x:r*Math.sin(v)*Math.cos(u)+(n.kol-1)*60,y:r*Math.cos(v),z:r*Math.sin(v)*Math.sin(u),vx:0,vy:0,vz:0}}});
 const ids=new Set(N.map(n=>n.id));Object.keys(P).forEach(k=>{if(!ids.has(k))delete P[k]});
 const gs=N.length+'|'+G.e1.length;if(gs!==rt.gsig3){rt.gsig3=gs;rt.alfa3=Math.max(rt.alfa3,.7)}rt.alfa3=Math.max(.015,rt.alfa3*.985);const al=rt.alfa3,rep=K.rep*2400,n=N.length;
 const f={};N.forEach(nd=>f[nd.id]=[0,0,0]);
 for(let i=0;i<n;i++){const a=P[N[i].id],fa=f[N[i].id];for(let j=i+1;j<n;j++){const b=P[N[j].id],fb=f[N[j].id];let dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,d2=dx*dx+dy*dy+dz*dz;if(d2<1){dx=.7;dy=.5;dz=.3;d2=.83}const d=Math.sqrt(d2),k=rep/d2;dx/=d;dy/=d;dz/=d;fa[0]-=dx*k;fa[1]-=dy*k;fa[2]-=dz*k;fb[0]+=dx*k;fb[1]+=dy*k;fb[2]+=dz*k}}
 const fj=(ia,ib)=>{const a=P[ia],b=P[ib];if(!a||!b)return;let dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;const d=Math.hypot(dx,dy,dz)+.01,k=(d-K.len)*.012;dx/=d;dy/=d;dz/=d;f[ia][0]+=dx*k;f[ia][1]+=dy*k;f[ia][2]+=dz*k;f[ib][0]-=dx*k;f[ib][1]-=dy*k;f[ib][2]-=dz*k};
 G.e1.forEach(e=>fj(e.a,e.b));G.e2.forEach(e=>fj(e.a,e.b));
 N.forEach(nd=>{const p=P[nd.id],ff=f[nd.id],gv=.0025*K.grav,cl=v=>Math.max(-20,Math.min(20,v));ff[0]+=(-p.x)*gv+((nd.kol-1)*110-p.x)*.01*K.ret;ff[1]+=-p.y*gv;ff[2]+=-p.z*gv;p.vx=(p.vx+cl(ff[0])*al)*.7;p.vy=(p.vy+cl(ff[1])*al)*.7;p.vz=(p.vz+cl(ff[2])*al)*.7;p.x+=p.vx;p.y+=p.vy;p.z+=p.vz});
 if(!rt.rot&&performance.now()>rt.spinPause)rt.ang.a+=.004;const ca=Math.cos(rt.ang.a),sa=Math.sin(rt.ang.a),cb=Math.cos(rt.ang.b),sb=Math.sin(rt.ang.b),sc=Math.min(W,H)/380,cx=W/2,cy=H/2+10,pr={};
 N.forEach(nd=>{const p=P[nd.id],x1=p.x*ca+p.z*sa,z1=-p.x*sa+p.z*ca,y2=p.y*cb-z1*sb,z2=p.y*sb+z1*cb,ff=420/Math.max(40,420+z2);pr[nd.id]={x:cx+x1*ff*sc,y:cy+y2*ff*sc,z:z2,f:ff}});
 const dyb=z=>Math.max(.15,Math.min(1,.65-z/400));
 G.e2.forEach(e=>{const a=pr[e.a],b=pr[e.b];g.strokeStyle=rtGrpC(L.alle[e.b]);g.globalAlpha=((!F||(lit.has(e.a)&&lit.has(e.b)))?.3:.04)*dyb((a.z+b.z)/2);g.lineWidth=1;g.beginPath();g.moveTo(a.x,a.y);g.lineTo(b.x,b.y);g.stroke();g.globalAlpha=1});
 G.e1.forEach(e=>{const a=pr[e.a],b=pr[e.b],p=new Path2D();p.moveTo(a.x,a.y);p.lineTo(b.x,b.y);g.strokeStyle=rtFarve(e.m,(e.m.off?.2:.4+.5*en(e.i))*(eOn(e.i)?1:.08)*dyb((a.z+b.z)/2)+(e.i===rt.conn?.5:0));g.lineWidth=(1+Math.min(2,+e.m.gain||0)+en(e.i)*2)*((a.f+b.f)/2);if(e.m.off)g.setLineDash([5,4]);g.stroke(p);g.setLineDash([]);rtSel(g,p,e.i);rt.hit.push({p,t:'l',i:e.i,s:3})});
 N.slice().sort((p,q)=>pr[q.id].z-pr[p.id].z).forEach(nd=>{const p=pr[nd.id],o=on(nd),r=(nd.kol===2?7:5)*p.f*Math.max(.8,sc);g.globalAlpha=(o?1:.25)*dyb(p.z);g.fillStyle=nd.kol===0?'hsl('+rtHue(nd.key)+',80%,58%)':nd.kol===2?rtGrpC(nd):'#e6edf4';g.beginPath();g.arc(p.x,p.y,r,0,7);g.fill();
  if(p.f>1.02||(F&&lit.has(nd.id))||nd.kol!==1){g.fillStyle=RT_TXT;g.textAlign='left';g.fillText(rtKort(nd.label,110),p.x+r+4,p.y)}g.globalAlpha=1;const hp=new Path2D();hp.arc(p.x,p.y,r+4,0,7);rt.hit.push({p:hp,t:'n',nd});rt.npos[nd.id]={x:p.x-r,y:p.y-r,w:2*r,h:2*r}})}
function rtVedAndre(pt){const c=$('rt'),g=c.getContext('2d'),d=c.width/rt.W;g.save();g.setTransform(d,0,0,d,0,0);let res=null;
 for(let k=rt.hit.length-1;k>=0&&!res;k--){const h=rt.hit[k];if(h.s){g.lineWidth=h.s+6;if(g.isPointInStroke(h.p,pt.x*d,pt.y*d))res=h}else if(g.isPointInPath(h.p,pt.x*d,pt.y*d))res=h}
 g.restore();if(!res)return null;if(res.t==='n')return{t:'n',nd:res.nd};if(res.t==='l')return{t:'l',i:res.i};return{t:'x',h:res}}

/* Node-editorens del: Visning ▾ i værktøjslinjen, fladen i stedet for lærredet, tegneløkken og Ctrl+K */
function ne41Nu(){return set.neVis&&set.neVis!=='kol'&&NE41_VIS.some(v=>v[0]===set.neVis)?set.neVis:'kol'}
function ne41Vis(v,stille){const ov=$('ne-vis'),fl=$('ne-flade');if(!NE41_VIS.some(x=>x[0]===v))v='kol';set.neVis=v;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}
 const sel=$('ne41-vis');if(sel&&sel.value!==v)sel.value=v;if(!ov||!fl)return;
 if(v==='kol'){ov.hidden=true;fl.style.display='';try{neVis()}catch(e){}if(!stille)neToast('Visning: Noder (kolonner)');return}
 const ny=set.rtLay!==v;$('rtlay').value=v;if(ny)$('rtlay').dispatchEvent(new Event('change',{bubbles:true}));else{try{rtLayVis()}catch(e){}}
 fl.style.display='none';ov.hidden=false;rt.t=0;try{rtResize()}catch(e){}if(!stille&&!ny)neToast('Visning: '+NE41_VIS.find(x=>x[0]===v)[1])}
/* Vælges "Noder (kolonner)" i fladens egen liste, går man tilbage til noderne */
$('rtlay').addEventListener('change',e=>{if(e.target.value==='kol'){ne41Vis('kol');return}const s=$('ne41-vis');if(s)s.value=e.target.value;set.neVis=e.target.value},true);
function ne41Start(){const rod=$('ne'),fl=$('ne-flade'),vl=rod&&rod.querySelector('.ne-vlinje');if(!rod||!fl||!vl||!NE.byg){setTimeout(ne41Start,300);return}
 const ov=$('ne-vis');fl.insertAdjacentElement('afterend',ov);
 const lbl=document.createElement('label');lbl.className='ne41-valg';lbl.title='Visning: Noder (kolonner) er Node-editoren. De 10 andre viser de samme regler på en anden måde (fra Routing-overblik).';
 lbl.innerHTML='<select id="ne41-vis" aria-label="Visning">'+NE41_VIS.map(([v,n])=>'<option value="'+v+'">'+n+'</option>').join('')+'</select>';
 const ank=vl.querySelector('.ne-trin');if(ank&&ank.nextSibling)ank.parentNode.insertBefore(lbl,ank.nextSibling);else vl.appendChild(lbl);
 $('ne41-vis').addEventListener('change',e=>ne41Vis(e.target.value));
 /* Tasterne i fladen må ikke også styre nodernes lærred */
 ov.addEventListener('keydown',e=>e.stopPropagation());ov.addEventListener('wheel',e=>e.stopPropagation(),{passive:true});
 try{new ResizeObserver(()=>{if(!ov.hidden){try{rtResize()}catch(e){}}}).observe(ov.querySelector('.ne41-wb'))}catch(e){}
 (function l(){requestAnimationFrame(l);if(rtSynlig()){try{drawRT()}catch(e){}}})();
 if(ne41Nu()!=='kol')ne41Vis(ne41Nu(),true);else{const s=$('ne41-vis');if(s)s.value='kol'}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne41Start);else setTimeout(ne41Start,0);
{const gl=neKpPunkter;window.neKpPunkter=function(L){gl(L);if(!NE.byg)return;NE41_VIS.forEach(([v,n])=>L.push({n:'Visning: '+n,kat:'Knapper · Node-editor',fn:()=>ne41Vis(v),ikon:v==='kol'?'▦':'◈'}))}}
/* ========== SLUT: DE 10 VISNINGER I NODE-EDITOREN ========== */
