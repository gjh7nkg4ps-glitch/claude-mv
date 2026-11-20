
/* ============================================================================
   Rytme render-runtime
   Den kode, som EDITOR og SPIL deler, så de ikke glider fra hinanden.
   Ingen afhængighed af siden (ingen DOM, ingen globale variabler). Kræver kun
   et Canvas 2D-kontekstobjekt (til tegning) og, til lyde, en Web Audio-kontekst.

   Indhold (trin 7a og 7b):
     Preset:       migrer(), migrerMS(), sceneKopi(), lydKopi()
     Kæden:        trin()  (tærskel, kurve, gain, glidning), koer()  (alle forbindelser)
     Slag:         slagtider()  (tider for klodser og lyde ud fra et analyseret bånd)
     Objekter:     nyObjekt(), nyEgenskaber(), vaerdi(), tegnObj(), tegnObjekter(), stepObjekter()
     3D (trin 6):  rot3(), FORM3D  (Pigkugle 3D og Terning 3D: drejning om to akser, perspektiv, dybdeskygge)
     Klodser:      nyKlodser(), klodsLive(), klodsFremad()  (oprettelse af klodser: live og kig frem)
     Analyse:      anaNy(), anaRamme(), toneTik(), toneListe(), ANA_KILDER  (log-spektrum, tonehøjde, toneklasser, klang, tonebegivenheder)
     Kvalitet:     kvalKopi(), kvalTrin(), regNy(), regTik(), maaleScener(), maaleStat(), maaleVurdering(), maaleAnbefal(), maaleRapport()  (niveauer med lofter, regulator og måletest)
     Liv (objekter): livKopi(), livTilstand()  (levende objekter: forekomster, der fødes, lever og dør; kaldes af tegnScene)
     Levende:      tegnSky(), tegnDaempring(), tegnEkko(), tegnUsikker()  (partikelsky, dæmpningsringe, ekko-skygger, usikkerhedssky; kaldes af tegnScene)
     Scenen:       nyScene(), tegnScene()  (hele preview-tegningen: baggrund, glød, bane, striber, slange, klodser, effekter, strobe)
     Fundament:    geo()  (banens geometri for 1 til 8 spor)
     Lyd:          lydVoice(), lydHz()  (klik, tone og suus)

   Ikke med: at dele beregning og tegning op inde i tegnScene. Hjælpe-overlays (Mærk preview, Flyt-håndtag) hører kun til
   editoren.
   Se runtime/README.md for, hvordan et spil bruger filen.
   ============================================================================ */
var Rytme=(function(){
const VERSION='2.7 (sikker visning)';
const TAU=Math.PI*2;
const SKALAER={minpent:[0,3,5,7,10,12,15,17],major:[0,2,4,5,7,9,11,12],minor:[0,2,3,5,7,8,10,12],blues:[0,3,5,6,7,10,12,15],dorian:[0,2,3,5,7,9,10,12]},mtof=n=>440*Math.pow(2,(n-69)/12);
let lydNz=null,lydNzCtx=null;

/* ---------- Scene (fundamentet) ---------- */
const SCENE0={spor:3,trefferlinje:.9,farver:[340,150,45,200,280,20,100,320,10,75,175,225,255,300,355,125],klodsFart:.65,klodsStr:1,udseende:'standard',foelgSpor:true,timing:'auto',syncMs:0,bane:true,figurer:true};
function sceneKopi(d){const s=JSON.parse(JSON.stringify(SCENE0)),cl=(v,a,b)=>Math.max(a,Math.min(b,+v));
 if(d){if(d.m3&&typeof d.m3==='object')s.m3=JSON.parse(JSON.stringify(d.m3));/* v7.2: Mesh 3D-lys følger opsætningen */if(Array.isArray(d.farver))d.farver.slice(0,16).forEach((v,i)=>s.farver[i]=cl(v,0,360));if(d.spor!==undefined)s.spor=Math.round(cl(d.spor,1,16));if(d.bane!==undefined)s.bane=!!d.bane;if(d.figurer!==undefined)s.figurer=!!d.figurer;if(d.trefferlinje!==undefined)s.trefferlinje=cl(d.trefferlinje,.5,.98);
  if(d.klodsFart!==undefined)s.klodsFart=cl(d.klodsFart,.1,1.5);if(d.klodsStr!==undefined)s.klodsStr=cl(d.klodsStr,.5,2);if(d.udseende==='objekt')s.udseende='objekt';if(d.timing==='live')s.timing='live';if(d.syncMs!==undefined)s.syncMs=Math.round(cl(d.syncMs,-200,300));if(d.foelgSpor!==undefined)s.foelgSpor=!!d.foelgSpor}
 if(d&&d.ne&&typeof d.ne==='object')s.ne=JSON.parse(JSON.stringify(d.ne));/* v9.27: Node-editorens trim og gruppe-styrke følger med */
 return s}
function geo(scene,W,Hh){const N=scene.spor,sc=N<=4?1:.736/((N-1)*.23),hz=Hh*.3,hy=Hh*.86,TL=scene.trefferlinje;
 return{N,sc,hz,hy,TL,lx:(l,z)=>W/2+(l-(N-1)/2)*(W*.04+W*.19*z)*sc,ly:z=>hz+(hy-hz)*z,hw:z=>(W*.02+W*.085*z)*sc}}

/* ---------- Lyd: indstillinger ---------- */
const LYD0={mute:false,vol:.5,klik:{til:true,vol:.6},tone:{til:true,vol:.5,trin:1,okt:0,laengde:200,boelge:'sine'},suus:{til:false,vol:.3,variant:'skud',stem:true,laengde:.8}};
function lydKopi(d){const s=JSON.parse(JSON.stringify(LYD0)),cl=(v,a,b)=>Math.max(a,Math.min(b,+v)),ok=(x,y)=>x!==undefined&&y!==undefined&&!isNaN(+y);
 if(d){if(d.mute!==undefined)s.mute=!!d.mute;if(ok(1,d.vol))s.vol=cl(d.vol,0,1);
  if(d.klik){if(d.klik.til!==undefined)s.klik.til=!!d.klik.til;if(ok(1,d.klik.vol))s.klik.vol=cl(d.klik.vol,0,1)}
  if(d.tone){const t=d.tone;if(t.til!==undefined)s.tone.til=!!t.til;if(ok(1,t.vol))s.tone.vol=cl(t.vol,0,1);if(ok(1,t.trin))s.tone.trin=Math.round(cl(t.trin,1,8));if(ok(1,t.okt))s.tone.okt=Math.round(cl(t.okt,-2,2));if(ok(1,t.laengde))s.tone.laengde=cl(t.laengde,60,600);if(['sine','triangle','sawtooth','square'].includes(t.boelge))s.tone.boelge=t.boelge}
  if(d.suus){const u=d.suus;if(u.til!==undefined)s.suus.til=!!u.til;if(ok(1,u.vol))s.suus.vol=cl(u.vol,0,1);if(['skud','forvarsel','forbi','ingen'].includes(u.variant))s.suus.variant=u.variant;if(u.stem!==undefined)s.suus.stem=!!u.stem;if(ok(1,u.laengde))s.suus.laengde=cl(u.laengde,.3,2)}}
 return s}

/* ---------- Objekter: model ---------- */
const PROPS={storrelse:['Størrelse',.02,.6,.005,.09],bredde:['Bredde',.2,3,.05,1],hojde:['Højde',.2,3,.05,1],skala:['Skala (hele figuren)',.2,3,.05,1],rotation:['Rotation (grader)',-360,720,1,0],drej:['Drejehastighed (rad/s)',-20,20,.1,0],
 punkter:['Antal punkter',3,40,1,12],indre:['Indre radius',.1,.95,.01,.5],afrunding:['Afrunding',0,1,.01,0],tykkelse:['Tykkelse',.02,.9,.01,.25],piglaengde:['Pigges længde',0,2,.01,.5],pigbredde:['Pigges bredde',.05,1,.01,.35],
 farveH:['Farvetone',0,360,1,200],farveS:['Mætning',0,100,1,20],farveL:['Lys',0,100,1,78],skygge:['Skygge (kugle)',0,1,.01,0],kontur:['Kontur',0,1,.01,0],glod:['Glød',0,1,.01,0],alpha:['Synlighed',0,1,.01,1],
 svaev:['Svæv sidelæns (andel af bredden)',0,1,.01,0],loeft:['Løft opad (andel af højden)',-.5,.5,.01,0],
 afstand:['Afstand (0 nær, 1 fjern)',0,1,.01,0],kopier:['Gentagelser rundt om (antal)',1,32,1,1],kopiRadius:['Ringens radius (andel af højden)',0,.6,.005,0],kopiDrej:['Ringens drejning (rad/s)',-3,3,.05,0],kopiVend:['Kopierne vender (0 lige op, 1 udad)',0,1,.01,1],teksturStyrke:['Teksturens styrke',0,1,.01,0],teksturSkala:['Teksturens størrelse',.05,.5,.01,.15],teksturVinkel:['Teksturens vinkel (grader)',-180,180,1,0],
 rotX:['Vip om vandret akse (grader)',-360,720,1,25],rotY:['Drej om lodret akse (grader)',-360,720,1,35],drejX:['Vip-hastighed (rad/s)',-20,20,.1,0],drejY:['Drejehastighed om lodret akse (rad/s)',-20,20,.1,0],perspektiv:['Perspektiv',0,1,.01,.5],dybde:['Dybdeskygge (lys og mørk efter dybde)',0,1,.01,.6]};
const FORMER={cirkel:['Cirkel',[]],rektangel:['Rektangel',['afrunding']],ring:['Ring',['tykkelse']],polygon:['Polygon',['punkter','afrunding']],stjerne:['Stjerne',['punkter','indre','afrunding']],pigkugle:['Pigkugle',['punkter','piglaengde','pigbredde']],
 hjerte:['Hjerte',[]],maane:['Halvmåne',['tykkelse']],kors:['Kors',['tykkelse','afrunding']],blomst:['Blomst',['punkter','indre']],boelge:['Bølge',['punkter','tykkelse']],spiral:['Spiral',['punkter','tykkelse']],
 kugle3d:['Pigkugle 3D',['punkter','piglaengde','pigbredde','rotX','rotY','drejX','drejY','perspektiv','dybde']],terning:['Terning 3D',['rotX','rotY','drejX','drejY','perspektiv','dybde']]};
const FAELLES=['storrelse','bredde','hojde','skala','rotation','drej','farveH','farveS','farveL','skygge','kontur','glod','alpha','svaev','loeft','afstand','kopier','kopiRadius','kopiDrej','kopiVend','teksturStyrke','teksturSkala','teksturVinkel'];
const formDef=f=>Object.prototype.hasOwnProperty.call(FORMER,f)?FORMER[f]:FORMER.cirkel,propsFor=f=>[...FAELLES,...formDef(f)[1]],uiProps=f=>[...formDef(f)[1],...FAELLES],tidOf=(o,li,p)=>'obj:'+o.id+':'+li+':'+p;
/* ---- Danser: en stiliseret, påklædt kvinde (tegneserie), tegnet med kode. Alt i modelenheder: figurens højde er cirka 1 (fødder ved y=0, hovedet øverst ved cirka -0.95). Fjedre (hår, kjole, arme, hoved) giver efterslæb og overshoot; hop får forventning (nedbøjning) og squash og stretch. ---- */
const DANS_ST={},DANS_STANG_X=.17;
function dansFj(S,k,mal,fk,dm,dt){if(S[k]===undefined){S[k]=mal;S[k+'v']=0}const a=(mal-S[k])*fk-S[k+'v']*dm;S[k+'v']+=a*dt;S[k]+=S[k+'v']*dt;return S[k]}
function dansFlip(S,k,val){if(S[k]===undefined)S[k]=1;if(S[k+'p']===undefined)S[k+'p']=0;if(val>.25&&S[k+'p']<=.25)S[k]=-S[k];S[k+'p']=val;return S[k]}

/* v7.4: glitter på kjoler med teksturen Prikker (pailletter, guld) eller Støj (glimmer, sølv/diamant). Faste, tilfældige pladser i kjolen; hvert glimt funkler i sin egen rytme og kraftigere, når figuren gløder (fx på hihat). Tegnes inden for kjolens omrids. */
function dansGlitter(g,x0,y0,x1,y1,t,seed,kind,glod,styrke,N){let h=0;for(let i=0;i<seed.length;i++)h=(h*31+seed.charCodeAt(i))|0;const rnd=()=>{h=(h*1103515245+12345)&0x7fffffff;return h/0x7fffffff};
 const guld=kind==='prikker',k=Math.max(.15,Math.min(1.5,(styrke||.4)*2));g.save();g.globalCompositeOperation='lighter';
 for(let i=0;i<N;i++){const x=x0+rnd()*(x1-x0),y=y0+rnd()*(y1-y0),ph=rnd()*Math.PI*2,sp=2+rnd()*5,st=.6+rnd()*.8;const tw=Math.pow(Math.max(0,Math.sin(t*sp+ph)),8),a=Math.min(1,(.12+tw*.9+(glod||0)*.6*tw)*k);if(a<.05)continue;
  const r=(.0025+.006*tw)*st;g.globalAlpha=a*.55;g.fillStyle=guld?'#ffe9a3':'#e6f6ff';g.beginPath();g.arc(x,y,r*.6,0,Math.PI*2);g.fill();
  if(tw>.25){g.globalAlpha=a;g.strokeStyle=guld?'#fff6d6':'#ffffff';g.lineWidth=.0016;const L=r*3.2;g.beginPath();g.moveTo(x-L,y);g.lineTo(x+L,y);g.moveTo(x,y-L);g.lineTo(x,y+L);g.stroke()}}
 g.restore()}
function tegnDanser(g,R,v,fx){
 const t=fx.t/1000,k0=fx.key;let B=DANS_ST[k0];if(!B)B=DANS_ST[k0]={lt:-1,ci:0};if(B.lt===t)B.ci++;else{B.lt=t;B.ci=0}
 const key=k0+':'+B.ci;let S=DANS_ST[key];if(!S||t<S.t-1)S=DANS_ST[key]={t:t-.016};
 let dt=t-S.t;if(dt<=0)dt=0;dt=Math.min(.05,dt);S.t=t;const dtf=Math.max(dt,.0005);
 const cl=(x,a,b)=>Math.max(a,Math.min(b,x)),PI=Math.PI;
 const fk=60*v.dFjeder,zeta=cl(.85-.65*v.dEfterslaeb,.15,.95),dm=2*Math.sqrt(fk)*zeta,fk2=fk*2.2,dm2=2*Math.sqrt(fk2)*cl(zeta+.15,.3,1);
 const alt=v.dAlterner>.5,sP=cl(v.dStang,0,1),sdP=v.dStangSide>.5?-1:1;
 const fH=alt?dansFlip(S,'fH',v.dHofte):1,fD=alt?dansFlip(S,'fD',v.dHoved):1,fR=alt?dansFlip(S,'fR',v.dHaar):1,fK=alt?dansFlip(S,'fK',v.dKrop):1;
 // forventning: en hurtig stigning i hop giver en lille nedbøjning først
 const dhop=S.hp===undefined?0:(v.dHop-S.hp)/dtf;S.hp=v.dHop;if(dhop>1.2)S.antT=.14;S.antT=Math.max(0,(S.antT||0)-dt);S.ant=v.dForvent*.5*Math.min(1,S.antT/.14);
 const q=dansFj(S,'q',cl(v.dKnae+S.ant+.3*sP,0,1.3),fk2,dm2,dt),hop=dansFj(S,'hop',v.dHop,fk*1.2,2*Math.sqrt(fk*1.2)*cl(zeta,.2,.7),dt);
 const aV=dansFj(S,'aV',sdP<0?Math.max(v.dArmV,sP):v.dArmV,fk2,dm2,dt),aH=dansFj(S,'aH',sdP>0?Math.max(v.dArmH,sP):v.dArmH,fk2,dm2,dt);
 const hofte=dansFj(S,'hofte',v.dHofte*fH,fk,dm,dt),hoved=dansFj(S,'hoved',v.dHoved*fD,fk,dm,dt),krop=dansFj(S,'krop',v.dKrop*fK+sdP*.6*sP,fk,dm,dt);
 const ph=t*v.dTempo*2*PI*.6,sv=v.dSvaj;
 const haarMal=v.dHaar*fR*(.9+.5*Math.sin(ph*3))+hofte*.6+hoved*.5,hs=dansFj(S,'haar',haarMal,fk*.7,2*Math.sqrt(fk*.7)*cl(zeta*.7,.12,.9),dt);
 const kj=dansFj(S,'kj',v.dKjole*(Math.sin(ph*2.6)*.6+.4)+hofte*.7,fk*.8,2*Math.sqrt(fk*.8)*cl(zeta*.7,.12,.9),dt);
 const sq=v.dSquash,jump=hop*.16+.06*sP,lf=v.dBenLaengde,L1=.205*lf,L2=.195*lf,hh=v.dHaelhoej*.03;
 const hipH0=L1+L2+.025+hh,sx=Math.sin(ph)*.012*sv,br=Math.sin(ph*1.7)*.004*sv;
 const px=hofte*.05+sx,py=-(hipH0-q*.17)-jump;
 const sty=1+sq*(-.07*q*0+hop*.05-.05*Math.max(0,q-.3)),sxs=1+sq*(hop*-.035+.05*Math.max(0,q-.3));
 g.save();const hf=R*4.2;g.scale(hf,hf);g.translate(0,.5);g.scale(sxs,sty);
 const cH=fx.H,cS=fx.S,cL=fx.L,hsl=(h,s,l,a)=>'hsl('+(((h%360)+360)%360)+' '+cl(s,0,100)+'% '+cl(l,0,100)+'%'+(a!=null?' / '+a:'')+')';
 const skin=hsl(v.dHudH,v.dHudS,v.dHudL),skinD=hsl(v.dHudH,v.dHudS+8,v.dHudL-14),hairC=hsl(v.dHaarH,v.dHaarS,v.dHaarL),hairD=hsl(v.dHaarH,v.dHaarS,v.dHaarL-10),hairHi=hsl(v.dHaarH,v.dHaarS-8,v.dHaarL+14);
 const dress=hsl(cH,cS,cL),dressD=hsl(cH,cS,cL-20),dressHi=hsl(cH,cS,cL+9),c2=hsl(v.dTop2H,v.dTop2S,v.dTop2L),c2D=hsl(v.dTop2H,v.dTop2S,v.dTop2L-18);
 const ink=hsl(v.dHaarH,40,12),shoe=hsl(v.dSkoH,60,v.dSkoL);
 const stil=Math.round(v.dTojStil),hair=Math.round(v.dHaarStil),hl=v.dHaarLaengde;
 // ---- gulv og spot ----
 if(v.dGulv>.01){const rows=Math.round(v.dGulvFlis),cols=rows,wF=.46,wB=.30,dep=.11,y0=-.005,pul=v.dGulvPuls;g.save();g.globalAlpha=v.dGulv;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){const f0=r/rows,f1=(r+1)/rows,y_0=y0-dep*f0*0+(-dep*(1-f0))+dep*.0,yA=y0-dep+dep*(1-0)*0;const ya=y0+(-dep*(rows-r)/rows)+dep,yb=y0+(-dep*(rows-r-1)/rows)+dep;const wA=wB+(wF-wB)*(rows-r)/rows,wBn=wB+(wF-wB)*(rows-r-1)/rows;
   const xa0=-wA+2*wA*c/cols,xa1=-wA+2*wA*(c+1)/cols,xb0=-wBn+2*wBn*c/cols,xb1=-wBn+2*wBn*(c+1)/cols;const ch=(r+c)%2,Lg=v.dGulvL+(ch?9:-3)+pul*(ch?30:12);
   g.beginPath();g.moveTo(xa0,ya-dep*0);g.lineTo(xa1,ya);g.lineTo(xb1,yb);g.lineTo(xb0,yb);g.closePath();g.fillStyle=hsl(v.dGulvH+(ch?18:0),v.dGulvS,Lg);g.fill();g.strokeStyle=hsl(v.dGulvH,v.dGulvS,Math.max(8,v.dGulvL-14));g.lineWidth=.0025;g.stroke()}
  g.restore()}
 if(v.dSpot>.01){const sg=g.createRadialGradient(0,-.45,.02,0,-.2,.62);sg.addColorStop(0,'rgba(255,248,220,'+(.32*v.dSpot)+')');sg.addColorStop(1,'rgba(255,248,220,0)');g.fillStyle=sg;g.beginPath();g.moveTo(-.05,-1.2);g.lineTo(.05,-1.2);g.lineTo(.42,.04);g.lineTo(-.42,.04);g.closePath();g.fill()}
 g.fillStyle='rgba(0,0,0,.22)';g.beginPath();g.ellipse(px*.4,.004,.13-hop*.04,.014,0,0,PI*2);g.fill();
 // ---- punkter ----
 const sa=-hofte*.10+krop*.05,sw=.088*v.dSkulder,scx=px*.25+krop*.05,scy=py-.285-br;
 const shL=[scx-Math.cos(sa)*sw,scy-Math.sin(sa)*sw],shR=[scx+Math.cos(sa)*sw,scy+Math.sin(sa)*sw];
 const hAng=hoved*.30-sa*.5,nb=[scx,scy-.018],rh=.068*v.dHovedStr,hc=[nb[0]+hoved*.006,nb[1]-.082*v.dHovedStr-rh*.12];
 const arm=(sd,r)=>{const sh=sd<0?shL:shR,idle=Math.sin(ph+sd)*.05*sv,ang=.30+r*2.55+idle,al=v.dArmLaengde,ua=.165*al,fo=.150*al;const el=[sh[0]+sd*Math.sin(ang)*ua,sh[1]+Math.cos(ang)*ua];const a2=ang-(.28-.14*r)+Math.sin(ph*1.4+sd)*.04*sv;const wr=[el[0]+sd*Math.sin(a2)*fo,el[1]+Math.cos(a2)*fo];if(sP>0&&sd===sdP){const Ht=[sdP*DANS_STANG_X,sh[1]-.2],dx=Ht[0]-sh[0],dy=Ht[1]-sh[1],dl=Math.hypot(dx,dy)||1e-6,dd=Math.min(dl,ua+fo-.002),aa=(ua*ua-fo*fo+dd*dd)/(2*dd),hh2=Math.sqrt(Math.max(0,ua*ua-aa*aa)),ux=dx/dl,uy=dy/dl;let nx=-uy,ny=ux;if(ny<0){nx=-nx;ny=-ny}const elI=[sh[0]+ux*aa+nx*hh2,sh[1]+uy*aa+ny*hh2],wrI=[sh[0]+ux*dd,sh[1]+uy*dd],el2=[el[0]+(elI[0]-el[0])*sP,el[1]+(elI[1]-el[1])*sP],wr2=[wr[0]+(wrI[0]-wr[0])*sP,wr[1]+(wrI[1]-wr[1])*sP];return{sh,el:el2,wr:wr2,a2:Math.atan2(sd*(wr2[0]-el2[0]),wr2[1]-el2[1])}}return{sh,el,wr,a2}};
 const A1=arm(-1,aV),A2=arm(1,aH);
 const hipW=.062+.018*v.dSlank,hipL=[px-hipW,py],hipR=[px+hipW,py];
 const ank=sd=>{const lift=jump*.95,nx=px+sd*(.068+q*.03),ny=-.022-hh-lift;if(sd!==sdP||sP<=.4)return[nx,ny];const hk=cl((sP-.4)/.6,0,1);return[nx+(sdP*DANS_STANG_X-nx)*hk,ny-.14*hk]};
 const leg=sd=>{const hp=[px+sd*.05,py],an=ank(sd);let dx=an[0]-hp[0],dy=an[1]-hp[1],d=Math.min(Math.hypot(dx,dy),L1+L2-.002);const a=(L1*L1-L2*L2+d*d)/(2*d),hgt=Math.sqrt(Math.max(0,L1*L1-a*a)),ux=dx/Math.hypot(dx,dy),uy=dy/Math.hypot(dx,dy);let kx=hp[0]+ux*a,ky=hp[1]+uy*a;let nx=-uy,ny=ux;if(nx*sd<0){nx=-nx;ny=-ny}return{hp,kn:[kx+nx*hgt*.5,ky+ny*hgt*.5],an}};
 const LL=leg(-1),LR=leg(1);
 const lim=(a,b,w,col)=>{g.strokeStyle=col;g.lineWidth=w;g.lineCap='round';g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(b[0],b[1]);g.stroke()};
 const glowOn=fx.glow&&v.glod>.01;
 // ---- hår bagved ----
 const hx=hc[0],hy=hc[1],hrx=.064*v.dHovedStr,hry=.075*v.dHovedStr,tipS=cl(hs,-1.2,1.2)*.05*hl;
 const bagHaar=()=>{g.fillStyle=hairC;g.strokeStyle=hairD;g.lineWidth=.005;g.lineJoin='round';const wd=hrx+.014;
  if(hair===0||hair===4){const curly=hair===4,y1=scy+(curly?.21:.19)*hl+br,W=curly?.118:.100;g.beginPath();g.moveTo(hx-wd,hy-hry*.2);
   g.bezierCurveTo(hx-wd-.012,hy+hry*.9,hx-W*.92,scy-.02,hx-W+tipS*.35,scy+.06*hl);g.bezierCurveTo(hx-W+tipS*.7,scy+.12*hl,hx-W*.85+tipS,y1-.02,hx-W*.55+tipS,y1);
   g.quadraticCurveTo(hx-W*.3+tipS,y1+.024,hx+tipS,y1+.004);g.quadraticCurveTo(hx+W*.3+tipS,y1+.026,hx+W*.55+tipS,y1);
   g.bezierCurveTo(hx+W*.85+tipS,y1-.02,hx+W+tipS*.7,scy+.12*hl,hx+W+tipS*.35,scy+.06*hl);g.bezierCurveTo(hx+W*.92,scy-.02,hx+wd+.012,hy+hry*.9,hx+wd,hy-hry*.2);g.closePath();g.fill();g.stroke();
   if(curly)[-1,1].forEach(sd=>{for(let i=0;i<6;i++){const yy=scy+.0+i*.045*hl,xx=hx+sd*(W*(.86+.05*Math.sin(i*2.1)))+tipS*(i/5);g.beginPath();g.arc(xx,yy,.017,0,PI*2);g.fill();g.stroke()}})}
  else if(hair===3){const y1=hy+hry+.035,W=hrx+.036;g.beginPath();g.moveTo(hx-wd,hy-hry*.2);g.bezierCurveTo(hx-W-.01,hy+hry*.4,hx-W-.012+tipS*.4,y1-.02,hx-W+.014+tipS*.7,y1);g.quadraticCurveTo(hx+tipS*.7,y1+.022,hx+W-.014+tipS*.7,y1);g.bezierCurveTo(hx+W+.012+tipS*.4,y1-.02,hx+W+.01,hy+hry*.4,hx+wd,hy-hry*.2);g.closePath();g.fill();g.stroke()}
  else if(hair===1){const bx=hx+hrx*.8,by=hy-hry*.55,tx=bx+.02+tipS*2.2,ty=by+.12+.22*hl;g.beginPath();g.moveTo(bx-.01,by-.012);g.bezierCurveTo(bx+.07,by-.025,bx+.09+tipS*.8,by+.07,tx+.02,ty);g.quadraticCurveTo(tx,ty+.04,tx-.022,ty-.002);g.bezierCurveTo(bx+.02+tipS*.6,by+.08,bx+.035,by+.025,bx-.012,by+.014);g.closePath();g.fill();g.stroke();g.fillStyle=hsl(v.dTop2H,v.dTop2S,v.dTop2L);g.beginPath();g.arc(bx+.004,by,.0105,0,PI*2);g.fill()}
  else if(hair===2){g.beginPath();g.arc(hx,hy-hry-.012,.036,0,PI*2);g.fill();g.stroke()}};
 const fremHaar=()=>{g.fillStyle=hairC;g.strokeStyle=hairD;g.lineWidth=.005;g.lineJoin='round';
  g.beginPath();g.moveTo(hx-hrx-.008,hy+.012);g.bezierCurveTo(hx-hrx-.014,hy-hry*1.375-.004,hx+hrx+.014,hy-hry*1.375-.004,hx+hrx+.008,hy+.012);
  const pk=v.dPandehaar;g.bezierCurveTo(hx+hrx*.9,hy-hry*.25,hx+hrx*(.2+.5*(1-pk)),hy-hry*(.50-.42*pk),hx+hrx*.1*(1-pk)-hoved*.01,hy-hry*(.62-.52*pk));
  g.bezierCurveTo(hx-hrx*.35,hy-hry*(.50-.3*pk),hx-hrx*.9,hy-hry*.2,hx-hrx-.008,hy+.012);g.closePath();g.fill();g.stroke();
  g.fillStyle=hairHi;g.globalAlpha=.55;g.beginPath();g.ellipse(hx-hrx*.25,hy-hry*.80,hrx*.5,hry*.1,-.35,0,PI*2);g.fill();g.globalAlpha=1;g.fillStyle=hairC;
  if(hair===0||hair===4||hair===3){[-1,1].forEach(sd=>{g.beginPath();g.moveTo(hx+sd*hrx*.95,hy-hry*.3);g.bezierCurveTo(hx+sd*(hrx+.018),hy+.01,hx+sd*(hrx+.02)+sd*tipS*.2,hy+.04,hx+sd*(hrx+.012)+sd*tipS*.3,hy+(hair===3?.075:.075*hl)+.02);g.lineTo(hx+sd*(hrx-.01),hy+.03);g.bezierCurveTo(hx+sd*(hrx-.002),hy,hx+sd*hrx*.97,hy-hry*.1,hx+sd*hrx*.95,hy-hry*.3);g.closePath();g.fill();g.stroke()})}
  if((hair===0||hair===4)&&hl>.45){const ye=scy+.10*hl+br*.5;[-1,1].forEach(sd=>{g.fillStyle=hairC;g.beginPath();g.moveTo(hx+sd*(hrx+.002),hy+hry*.1);g.bezierCurveTo(hx+sd*(hrx+.034),hy+hry*.7,hx+sd*(.092)+tipS*.3,scy-.01,hx+sd*(.082)+tipS*.5,ye);g.quadraticCurveTo(hx+sd*.066+tipS*.5,ye+.03,hx+sd*.052+tipS*.4,ye-.004);g.bezierCurveTo(hx+sd*.05,scy+.02,hx+sd*(hrx+.01),hy+hry*.9,hx+sd*(hrx-.006),hy+hry*.4);g.closePath();g.fill();g.stroke()})}};
 // ---- tegn: hår bag, ben, kjole, arme, hoved ----
 if(v.dStangVis>.02){const px0=sdP*DANS_STANG_X,pg=g.createLinearGradient(px0-.013,0,px0+.013,0);pg.addColorStop(0,'#4a4f68');pg.addColorStop(.3,'#f2f4ff');pg.addColorStop(.6,'#b8bdd6');pg.addColorStop(1,'#4a4f68');g.save();g.globalAlpha=cl(v.dStangVis,0,1);g.fillStyle=pg;g.fillRect(px0-.011,-2.4,.022,2.4);g.fillStyle='rgba(255,255,255,.55)';g.fillRect(px0-.004,-2.4,.003,2.4);g.fillStyle='#7d83a0';g.beginPath();g.ellipse(px0,0,.05,.012,0,0,PI*2);g.fill();g.fillStyle='#d8dbee';g.beginPath();g.ellipse(px0,-.003,.038,.008,0,0,PI*2);g.fill();g.restore()}
 bagHaar();
 const ben=sd=>{const L=sd<0?LL:LR;lim(L.hp,L.kn,.046,skin);lim(L.kn,L.an,.038,skin);
  g.fillStyle=skin;g.beginPath();g.arc(L.kn[0],L.kn[1],.023,0,PI*2);g.fill();
  const sx0=L.an[0],sy0=L.an[1]+.006;g.fillStyle=shoe;g.strokeStyle=ink;g.lineWidth=.004;g.beginPath();g.ellipse(sx0,sy0+.009,.037,.021,0,0,PI*2);g.fill();g.stroke();if(v.dHaelhoej>.35){g.fillStyle=shoe;g.fillRect(sx0-.004,sy0+.008,.008,.012+hh*.4)}};
 ben(-1);ben(1);
 const waist=[px*.55+krop*.03,py-.118],wHalf=.050-.020*v.dTalje+.004*(1-v.dSlank),hipHalf=hipW+.012;
 // kjole / tøj
 const hemY=stil===1?py+.105:stil===2?-(.045+hh):py+.205,flare=.03+v.dKjoleVidde*.12+(stil===2?.025:0)+(stil===1?-.01:0);
 const kl=(side,yy)=>side*(hipHalf+flare*(yy)+Math.abs(kj)*.02*yy)+kj*.045*yy*side*0+kj*.05*yy;
 const hemPts=[];const n=8;for(let i=0;i<=n;i++){const u=i/n,xx=px+(-1+2*u)*(hipHalf+flare+Math.abs(kj)*.02)+kj*.05;hemPts.push([xx,hemY+Math.sin(u*PI*3+ph*2)*.006*(.4*sv+Math.abs(kj)*3)+Math.sin(u*PI)*.012])}
 const skirtCol=stil===3?c2:dress,skirtD=stil===3?c2D:dressD;
 if(glowOn){g.shadowColor=dress;g.shadowBlur=v.glod*40}
 {const gr=g.createLinearGradient(px-hipHalf-.05,0,px+hipHalf+.05,0);gr.addColorStop(0,stil===3?hsl(v.dTop2H,v.dTop2S,v.dTop2L-9):dressD);gr.addColorStop(.45,skirtCol);gr.addColorStop(1,stil===3?hsl(v.dTop2H,v.dTop2S,v.dTop2L-6):hsl(cH,cS,cL-10));g.fillStyle=gr}g.strokeStyle=skirtD;g.lineWidth=.005;g.beginPath();g.moveTo(px-hipHalf+.004,py-.012);
 g.lineTo(hemPts[0][0],hemPts[0][1]);for(let i=1;i<=n;i++)g.lineTo(hemPts[i][0],hemPts[i][1]);g.lineTo(px+hipHalf-.004,py-.012);g.closePath();g.fill();g.stroke();g.shadowBlur=0;
 g.save();g.clip();g.strokeStyle=skirtD;g.globalAlpha=.35;g.lineWidth=.004;for(let i=1;i<n;i++){g.beginPath();g.moveTo(px+(-1+2*i/n)*(hipHalf*.6),py-.01);g.lineTo(hemPts[i][0],hemPts[i][1]);g.stroke()}g.globalAlpha=1;if(fx.glit)dansGlitter(g,px-hipHalf-flare-.04,Math.min(py-.014,hemY),px+hipHalf+flare+.04,Math.max(py-.014,hemY)+.02,t,fx.key+'s',fx.glit,v.glod,fx.glitS,70);g.restore();g.globalAlpha=1;
 if(stil===3){g.fillStyle=c2D;g.fillRect(px-hipHalf,py-.014,hipHalf*2,.011)}
 // overdel
 const bodC=stil===3?dress:dress;g.fillStyle=bodC;g.strokeStyle=dressD;g.lineWidth=.005;if(glowOn){g.shadowColor=dress;g.shadowBlur=v.glod*40}
 g.beginPath();const nk=.040,nkY=scy+.035+.012*(stil===3?.4:1);g.moveTo(shL[0]+.006,shL[1]+.004);g.lineTo(nb[0]-nk,nb[1]+.004);g.quadraticCurveTo(nb[0],nkY+.04,nb[0]+nk,nb[1]+.004);g.lineTo(shR[0]-.006,shR[1]+.004);
 g.bezierCurveTo(shR[0]-.004,scy+.06,scx+.080,scy+.075,scx+.078,scy+.105);g.bezierCurveTo(scx+.07,scy+.14,waist[0]+wHalf+.002,waist[1]-.02,waist[0]+wHalf,waist[1]);g.bezierCurveTo(waist[0]+wHalf+.002,waist[1]+.03,px+hipHalf,py-.045,px+hipHalf,py-.01);
 g.lineTo(px-hipHalf,py-.01);g.bezierCurveTo(px-hipHalf,py-.045,waist[0]-wHalf-.002,waist[1]+.03,waist[0]-wHalf,waist[1]);g.bezierCurveTo(waist[0]-wHalf-.002,waist[1]-.02,scx-.07,scy+.14,scx-.078,scy+.105);g.bezierCurveTo(scx-.080,scy+.075,shL[0]+.004,scy+.06,shL[0]+.006,shL[1]+.004);g.closePath();g.fill();g.stroke();g.shadowBlur=0;if(fx.glit){g.save();g.clip();dansGlitter(g,scx-.1,Math.min(shL[1],shR[1])-.01,scx+.1,py,t,fx.key+'o',fx.glit,v.glod,fx.glitS,40);g.restore()}
 // hudfarvet halsudskæring
 g.fillStyle=skin;g.beginPath();g.moveTo(nb[0]-nk,nb[1]+.004);g.quadraticCurveTo(nb[0],nkY+.04,nb[0]+nk,nb[1]+.004);g.lineTo(nb[0]+nk*.7,nb[1]-.01);g.lineTo(nb[0]-nk*.7,nb[1]-.01);g.closePath();g.fill();
 // bælte / midje
 if(v.dBaelte>.05){g.fillStyle=c2;g.strokeStyle=c2D;g.lineWidth=.003;g.globalAlpha=Math.min(1,v.dBaelte*1.4);g.beginPath();g.moveTo(waist[0]-wHalf-.001,waist[1]-.009);g.lineTo(waist[0]+wHalf+.001,waist[1]-.009);g.lineTo(waist[0]+wHalf+.004,waist[1]+.009);g.lineTo(waist[0]-wHalf-.004,waist[1]+.009);g.closePath();g.fill();g.stroke();g.globalAlpha=1}
 // ---- arme ----
 const armD=(A,sd)=>{const er=v.dErme;const sl=er>.66?.8:er>.2?.42:0;lim(A.sh,A.el,.038,skin);lim(A.el,A.wr,.029,skin);
  if(sl>0){g.strokeStyle=dress;g.lineWidth=.042;g.lineCap='round';g.beginPath();g.moveTo(A.sh[0],A.sh[1]);const ex=A.sh[0]+(A.el[0]-A.sh[0])*sl,ey=A.sh[1]+(A.el[1]-A.sh[1])*sl;g.lineTo(ex,ey);g.stroke()}
  g.fillStyle=skin;g.strokeStyle=skinD;g.lineWidth=.003;g.beginPath();g.ellipse(A.wr[0]+sd*Math.sin(A.a2)*.02,A.wr[1]+Math.cos(A.a2)*.02,.018,.025,Math.atan2(Math.cos(A.a2),-sd*Math.sin(A.a2))-PI/2+PI*.0,0,PI*2);g.fill();g.stroke();
  g.fillStyle=skin;g.beginPath();g.arc(A.sh[0],A.sh[1]+.002,.025,0,PI*2);g.fill();if(sl>0){g.fillStyle=dress;g.beginPath();g.arc(A.sh[0],A.sh[1]+.002,.027,0,PI*2);g.fill()}};
 armD(A1,-1);armD(A2,1);
 // ---- hals og hoved ----
 g.fillStyle=skinD;g.beginPath();g.moveTo(nb[0]-.017,nb[1]+.008);g.lineTo(hc[0]-.019,hc[1]+hry*.7);g.lineTo(hc[0]+.019,hc[1]+hry*.7);g.lineTo(nb[0]+.017,nb[1]+.008);g.closePath();g.fill();
 g.save();g.translate(hc[0],hc[1]);g.rotate(hAng);g.translate(-hc[0],-hc[1]);
 // ører
 g.fillStyle=skin;[-1,1].forEach(sd=>{g.beginPath();g.ellipse(hc[0]+sd*hrx*.97,hc[1]+.008,.009,.014,0,0,PI*2);g.fill()});
 g.fillStyle=skin;g.strokeStyle=skinD;g.lineWidth=.004;g.beginPath();g.moveTo(hc[0],hc[1]-hry);g.bezierCurveTo(hc[0]+hrx*1.12,hc[1]-hry*.85,hc[0]+hrx*1.05,hc[1]+hry*.2,hc[0]+hrx*.55,hc[1]+hry*.85);g.quadraticCurveTo(hc[0],hc[1]+hry*1.12,hc[0]-hrx*.55,hc[1]+hry*.85);g.bezierCurveTo(hc[0]-hrx*1.05,hc[1]+hry*.2,hc[0]-hrx*1.12,hc[1]-hry*.85,hc[0],hc[1]-hry);g.closePath();g.fill();g.stroke();
 // ansigt
 const sh=hoved*.016,ey=hc[1]+hry*.06;const blink=((t*.23)%1)<.025?.15:1;
 if(v.dBlush>.02){g.fillStyle='hsl(350 85% 68% / '+(.38*v.dBlush)+')';[-1,1].forEach(sd=>{g.beginPath();g.ellipse(hc[0]+sh+sd*hrx*.5,hc[1]+hry*.34,.014,.009,0,0,PI*2);g.fill()})}
 [-1,1].forEach(sd=>{const ex=hc[0]+sh+sd*hrx*.40;g.fillStyle='#fff';g.beginPath();g.ellipse(ex,ey,.0155,.0105*blink,0,0,PI*2);g.fill();
  g.fillStyle=hsl(v.dOejeH,62,36);g.beginPath();g.ellipse(ex+hoved*.002,ey,.0085,.0085*blink,0,0,PI*2);g.fill();g.fillStyle='#111';g.beginPath();g.arc(ex+hoved*.002,ey,.0042,0,PI*2);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(ex+hoved*.002-.003,ey-.003*blink,.0022,0,PI*2);g.fill();
  const lw=.0035+.003*v.dMakeup;g.strokeStyle=ink;g.lineWidth=lw;g.lineCap='round';g.beginPath();g.ellipse(ex,ey,.0155,.0105*blink,0,PI*1.05,PI*1.95);g.stroke();
  if(v.dMakeup>.1){g.lineWidth=.0028;for(let i=0;i<3;i++){const a=PI*(1.18+i*.2),ox=ex+Math.cos(a)*.0155*1.0,oy=ey+Math.sin(a)*.0105*blink;g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+sd*.006+Math.cos(a)*.006,oy-.007-.004*v.dMakeup);g.stroke()}}
  g.strokeStyle=hairD;g.lineWidth=.0028+.0035*v.dBryn;g.beginPath();g.moveTo(ex-sd*.014,ey-.022);g.quadraticCurveTo(ex+sd*.0,ey-.032-v.dGlaede*.004,ex+sd*.016,ey-.021+sd*.0);g.stroke()});
 g.strokeStyle=skinD;g.lineWidth=.0028;g.beginPath();g.moveTo(hc[0]+sh,ey+.012);g.quadraticCurveTo(hc[0]+sh-.006,hc[1]+hry*.38,hc[0]+sh+.004,hc[1]+hry*.40);g.stroke();
 {const my=hc[1]+hry*.6,mw=.016,sm=v.dGlaede*.010,op=v.dGlaede>.8?(v.dGlaede-.8)*.02:0,mx=hc[0]+sh;const lipC=hsl(v.dLaebeH,60+v.dMakeup*20,52-v.dMakeup*10);
  g.fillStyle=op>.003?'#7a2330':lipC;g.strokeStyle=hsl(v.dLaebeH,60,32);g.lineWidth=.0028;
  g.beginPath();g.moveTo(mx-mw,my-sm);g.quadraticCurveTo(mx-mw*.45,my-.006-sm*.1,mx,my-.002);g.quadraticCurveTo(mx+mw*.45,my-.006-sm*.1,mx+mw,my-sm);g.quadraticCurveTo(mx+mw*.5,my+.011+sm*.4+op,mx,my+.0125+sm*.45+op);g.quadraticCurveTo(mx-mw*.5,my+.011+sm*.4+op,mx-mw,my-sm);g.closePath();g.fill();g.stroke();
  if(op>.004){g.fillStyle='#fff';g.beginPath();g.moveTo(mx-mw*.7,my-sm*.6+.001);g.quadraticCurveTo(mx,my+.001,mx+mw*.7,my-sm*.6+.001);g.quadraticCurveTo(mx,my+.004+op*.3,mx-mw*.7,my-sm*.6+.001);g.fill()}}
 fremHaar();
 // ørenringe
 if(v.dOerering>.04){g.fillStyle='hsl(46 90% 62%)';g.strokeStyle='hsl(40 70% 40%)';g.lineWidth=.0025;[-1,1].forEach(sd=>{const ex=hc[0]+sd*(hrx*.98+.003),ey2=hc[1]+.026;g.beginPath();g.moveTo(ex,ey2);g.lineTo(ex,ey2+.008+v.dOerering*.018);g.stroke();g.beginPath();g.arc(ex,ey2+.014+v.dOerering*.018,.0035+v.dOerering*.004,0,PI*2);g.fill();g.stroke()})}
 g.restore();g.restore();
}


const DANS_PROPS={
dKnae:['Knæbøj',0,1,.01,0],dHop:['Hop (løft fra gulvet)',0,1,.01,0],dArmV:['Arm til venstre i billedet: løft',0,1,.01,0],dArmH:['Arm til højre i billedet: løft',0,1,.01,0],dHoved:['Hoved: dreje og vippe',0,1,.01,0],dHofte:['Hofte: svaj',0,1,.01,0],dHaar:['Hår: sving',0,1,.01,0],dKjole:['Kjole: svirp',0,1,.01,0],dGlaede:['Glæde (smil)',0,1,.01,.6],dKrop:['Krop: læn til siden',0,1,.01,0],
dAlterner:['Skift side for hvert slag (hofte, hoved, hår, krop)',0,1,1,1],dFjeder:['Fjedre: stivhed',.3,3,.05,1],dEfterslaeb:['Efterslæb (hår og kjole svinger efter)',0,1,.01,.5],dForvent:['Forventning (nedbøjning før hop)',0,1,.01,.5],dSquash:['Squash og stretch',0,1,.01,.5],dSvaj:['Rolig grundbevægelse (svaj og vejrtrækning)',0,1,.01,.35],dTempo:['Grundbevægelsens tempo',.3,3,.05,1],
dHudH:['Hud: tone',0,60,1,25],dHudS:['Hud: mætning',0,100,1,45],dHudL:['Hud: lys',20,90,1,72],dSlank:['Kropsbygning (slank til kurvet)',0,1,.01,.4],dTalje:['Taljens smalhed',0,1,.01,.6],dBenLaengde:['Benlængde',.8,1.25,.01,1],dArmLaengde:['Armlængde',.8,1.2,.01,1],dHovedStr:['Hovedets størrelse',.8,1.3,.01,1],dSkulder:['Skulderbredde',.8,1.3,.01,1],
dMakeup:['Makeup (læber og vipper)',0,1,.01,.8],dLaebeH:['Læbefarve: tone',0,360,1,350],dOejeH:['Øjenfarve: tone',0,360,1,205],dBlush:['Kinder (rødme)',0,1,.01,.4],dBryn:['Øjenbryn (kraft)',0,1,.01,.5],dOerering:['Ørenringe (0 ingen, 1 store)',0,1,.01,.6],
dHaarStil:['Frisure (0 langt løst, 1 hestehale, 2 knold, 3 bob, 4 krøller)',0,4,1,0],dHaarH:['Hårfarve: tone',0,360,1,24],dHaarS:['Hårfarve: mætning',0,100,1,55],dHaarL:['Hårfarve: lys',0,100,1,26],dHaarLaengde:['Hårlængde',.3,1.6,.01,1],dPandehaar:['Pandehår (0 ingen, 1 fuldt)',0,1,.01,.5],
dTojStil:['Tøj (0 kjole, 1 kort kjole, 2 lang kjole, 3 top og nederdel)',0,3,1,0],dKjoleVidde:['Skørtets vidde',0,1,.01,.6],dTop2H:['Anden farve (bælte, nederdel): tone',0,360,1,45],dTop2S:['Anden farve: mætning',0,100,1,70],dTop2L:['Anden farve: lys',0,100,1,58],dSkoH:['Skoenes farve: tone',0,360,1,350],dSkoL:['Skoenes lys',0,100,1,30],dHaelhoej:['Hæle (0 flade, 1 høje)',0,1,.01,.5],dBaelte:['Bælte',0,1,.01,.6],dErme:['Ærmer (0 ingen, 0,5 korte, 1 lange)',0,1,.01,.2],
dGulv:['Dansegulv (0 skjult, 1 vist)',0,1,.01,1],dGulvH:['Gulv: tone',0,360,1,285],dGulvS:['Gulv: mætning',0,100,1,55],dGulvL:['Gulv: lys',5,70,1,30],dGulvPuls:['Gulvets puls (lys på fliserne)',0,1,.01,0],dGulvFlis:['Fliser (rækker)',2,10,1,6],dSpot:['Spot (lyskegle)',0,1,.01,.35],dStang:['Hold i stangen (pose: arm op, læn, ét ben hager ind)',0,1,.01,0],dStangVis:['Stang (vis)',0,1,.01,0],dStangSide:['Stang: side (0 til højre, 1 til venstre)',0,1,1,0]};
const DANS_KAT=(()=>{const o={},g=(k,l)=>l.forEach(p=>o[p]=k);g('Danser: bevægelser',['dKnae','dHop','dArmV','dArmH','dHoved','dHofte','dHaar','dKjole','dGlaede','dKrop','dStang']);g('Danser: fjedre',['dAlterner','dFjeder','dEfterslaeb','dForvent','dSquash','dSvaj','dTempo']);g('Danser: krop',['dHudH','dHudS','dHudL','dSlank','dTalje','dBenLaengde','dArmLaengde','dHovedStr','dSkulder']);g('Danser: ansigt',['dMakeup','dLaebeH','dOejeH','dBlush','dBryn','dOerering']);g('Danser: hår',['dHaarStil','dHaarH','dHaarS','dHaarL','dHaarLaengde','dPandehaar']);g('Danser: tøj',['dTojStil','dKjoleVidde','dTop2H','dTop2S','dTop2L','dSkoH','dSkoL','dHaelhoej','dBaelte','dErme']);g('Danser: gulv',['dGulv','dGulvH','dGulvS','dGulvL','dGulvPuls','dGulvFlis','dSpot','dStangVis','dStangSide']);return o})();
const DANS_SWING=(()=>{const o={};Object.keys(DANS_PROPS).forEach(p=>{const[,a,b]=DANS_PROPS[p];o[p]=v=>+(v+(b-a)*(v<(a+b)/2?.4:-.4)).toFixed(3)});['dKnae','dHop','dArmV','dArmH','dHaar','dKjole','dGlaede','dKrop','dGulvPuls','dStang','dStangVis'].forEach(p=>o[p]=()=>1);o.dHoved=()=>.8;o.dHofte=()=>.9;o.dKnae=()=>.85;o.dSpot=()=>.9;return o})();
Object.assign(PROPS,DANS_PROPS);FORMER.danser=['Danser',Object.keys(DANS_PROPS)];
/* ---- Discokugle: en kugle af spejlfliser, der drejer, med lysstråler og lysprikker. Lysshowet kan stilles ned (Lysshowets styrke og Rolig). Glimt (kGlimt, kobles til slag) holdes under et loft i glimt pr. sekund (kGlimtLoft), og intet bliver kraftigere end et fast loft (stråler højst 0,5 i gennemsigtighed, glimt højst 0,85), så det ikke bliver for kraftigt. ---- */
const DISKO_ST={};
const DISKO_PROPS={kIntensitet:['Lysshowets styrke',0,1,.01,.45],kStraaler:['Antal lysstråler',0,16,1,7],kStraalelaengde:['Strålernes længde',.5,3,.05,1.6],kHastighed:['Drejehastighed (negativ drejer den anden vej)',-2,2,.05,.35],kSpots:['Lysprikker på væg og gulv',0,1,.01,.5],kGlimt:['Glimt (kobles til slag)',0,1,.01,0],kGlimtLoft:['Højst så mange glimt i sekundet',1,8,1,3],kFarveVariation:['Farver (0 én farve, 1 mange)',0,1,.01,.7],kFarveH:['Grundfarve: tone',0,360,1,300],kFacetter:['Spejlfliser (rækker)',4,14,1,10],kRolig:['Rolig (dæmper hele lysshowet)',0,1,.01,0],kKaede:['Kæde (0 skjult, 1 vist)',0,1,1,1]};
const DISKO_KAT=(()=>{const o={};Object.keys(DISKO_PROPS).forEach(p=>o[p]='Discokugle');return o})();
const DISKO_SWING=(()=>{const o={};Object.keys(DISKO_PROPS).forEach(p=>{const[,a,b]=DISKO_PROPS[p];o[p]=v=>+(v+(b-a)*(v<(a+b)/2?.4:-.4)).toFixed(3)});o.kGlimt=()=>1;return o})();
function tegnDiskokugle(g,R,v,fx){
 const t=fx.t/1000,k0='d:'+fx.key;let B=DISKO_ST[k0];if(!B)B=DISKO_ST[k0]={lt:-1,ci:0};if(B.lt===t)B.ci++;else{B.lt=t;B.ci=0}
 const key=k0+':'+B.ci;let S=DISKO_ST[key];if(!S||t<S.t-1)S=DISKO_ST[key]={t:t-.016,f:0,tF:-9,p:0,n:0,ph:0};
 let dt=t-S.t;dt=Math.max(0,Math.min(.05,dt));S.t=t;
 const cl=(x,a,b)=>Math.max(a,Math.min(b,x)),PI=Math.PI,pk=p=>{const d=DISKO_PROPS[p],x=+v[p];return Number.isFinite(x)?cl(x,d[1],d[2]):d[4]},rolig=cl(pk('kRolig'),0,1),styrke=cl(pk('kIntensitet'),0,1)*(1-.8*rolig);
 const g0=cl(pk('kGlimt'),0,1);if(g0>.25&&S.p<=.25&&t-S.tF>=1/Math.max(1,pk('kGlimtLoft'))){S.tF=t;S.f=Math.max(S.f,g0);S.n++}S.p=g0;S.f*=Math.exp(-dt/.12);
 S.ph+=dt*pk('kHastighed');const ph=S.ph;
 const hsl=(h,s,l,a)=>'hsl('+(((h%360)+360)%360)+' '+s+'% '+l+'%'+(a!=null?' / '+a:'')+')';
 const flash=S.f*(1-.6*rolig),X=R*(pk('kStraalelaengde')*7);
 g.save();
 const n=Math.round(pk('kStraaler'));
 for(let i=0;i<n;i++){const a=ph+i*2*PI/n,w=.07,h=pk('kFarveH')+pk('kFarveVariation')*i*47,al=Math.min(.5,styrke*.34*(1+1.2*flash));if(al<=.003)continue;const bgr=g.createLinearGradient(0,0,Math.cos(a)*X,Math.sin(a)*X);bgr.addColorStop(0,hsl(h,90,66,1));bgr.addColorStop(1,hsl(h,90,66,0));g.globalAlpha=al;g.fillStyle=bgr;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a-w)*X,Math.sin(a-w)*X);g.lineTo(Math.cos(a+w)*X,Math.sin(a+w)*X);g.closePath();g.fill()}
 const ns=Math.round(22*cl(pk('kSpots'),0,1));for(let i=0;i<ns;i++){const a=ph*(i%2?1.3:-1.1)+i*2.399,d=R*(2.4+((i*7)%11)*.55),r=R*(.07+((i*5)%4)*.03),h=pk('kFarveH')+pk('kFarveVariation')*i*61,al=Math.min(.55,styrke*.6*(1+flash));if(al<=.003)continue;g.globalAlpha=al;g.fillStyle=hsl(h,90,70);g.beginPath();g.arc(Math.cos(a)*d*1.5,Math.sin(a)*d*.8,r,0,PI*2);g.fill()}
 g.globalAlpha=1;
 if(pk('kKaede')>.5){g.strokeStyle='#9aa0b8';g.lineWidth=Math.max(1,R*.03);g.beginPath();g.moveTo(0,-R);g.lineTo(0,-R*40);g.stroke()}
 g.save();g.beginPath();g.arc(0,0,R,0,PI*2);g.clip();const gr=g.createRadialGradient(-R*.35,-R*.35,R*.1,0,0,R);gr.addColorStop(0,'#fafbff');gr.addColorStop(.6,'#aeb4cc');gr.addColorStop(1,'#4a4f6b');g.fillStyle=gr;g.fillRect(-R,-R,R*2,R*2);
 const nl=Math.round(pk('kFacetter')),nm=Math.round(nl*1.6);
 for(let i=0;i<nl;i++)for(let j=0;j<nm;j++){const th0=-PI/2+PI*i/nl,th1=-PI/2+PI*(i+1)/nl,p0=2*PI*j/nm+ph,p1=2*PI*(j+1)/nm+ph;const P=(th,p)=>[Math.cos(th)*Math.sin(p)*R,Math.sin(th)*R,Math.cos(th)*Math.cos(p)];const q=[P(th0,p0),P(th0,p1),P(th1,p1),P(th1,p0)];if(q.every(a=>a[2]<-.02))continue;
  const hs=((i*73856093)^(j*19349663))>>>0,rnd=(hs%1000)/1000,sh=(q[0][2]+q[2][2])/2;let lys=58+26*rnd+sh*14;if(rnd<.12*(.4+styrke))lys=Math.min(96,lys+30*(.4+flash));
  g.beginPath();g.moveTo(q[0][0],q[0][1]);q.slice(1).forEach(a=>g.lineTo(a[0],a[1]));g.closePath();g.fillStyle=rnd<.1?hsl(pk('kFarveH')+pk('kFarveVariation')*(hs%7)*50,80,60+flash*30):hsl(225,14,lys);g.fill();g.strokeStyle='rgba(20,22,40,.6)';g.lineWidth=Math.max(.5,R*.012);g.stroke()}
 const hi=g.createRadialGradient(-R*.4,-R*.4,1,-R*.4,-R*.4,R*.6);hi.addColorStop(0,'rgba(255,255,255,.7)');hi.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=hi;g.fillRect(-R,-R,R*2,R*2);g.restore();
 if(flash>.02){g.globalAlpha=Math.min(.85,flash*.7);const fg=g.createRadialGradient(0,0,R*.2,0,0,R*2.2);fg.addColorStop(0,'rgba(255,255,255,.9)');fg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=fg;g.beginPath();g.arc(0,0,R*2.2,0,PI*2);g.fill();g.globalAlpha=1}
 g.restore()}
const SAERLIGE_FORMER=['danser','discokugle'],SAERLIGE_PROPS=Object.assign({},DANS_PROPS,DISKO_PROPS);
Object.assign(PROPS,DISKO_PROPS);FORMER.discokugle=['Discokugle',Object.keys(DISKO_PROPS)];
function nyEgenskaber(f){const e={};propsFor(f).forEach(p=>{const d=PROPS[p][4];e[p]={fra:d,til:d}});if(f==='pigkugle')e.piglaengde={fra:.3,til:.9};if(f==='discokugle'){e.storrelse={fra:.085,til:.085}}if(f==='danser'){e.storrelse={fra:.16,til:.16};e.farveH={fra:205,til:205};e.farveS={fra:65,til:65};e.farveL={fra:48,til:48}}return e}
const nyObjekt=(id='o1',navn='Figur 1')=>({id,navn,synlig:true,pos:{x:.28,y:.32},lag:[{form:'pigkugle',egenskaber:nyEgenskaber('pigkugle')}]});
function sikrEgenskaber(o){o.lag.forEach(l=>propsFor(l.form).forEach(p=>{if(!l.egenskaber[p]){const d=PROPS[p][4];l.egenskaber[p]={fra:d,til:d}}}))}
const MS_FRA={piglaengde:.25,storrelse:.05,drej:.4,skala:1,svaev:0,loeft:0},MS_TIL={piglaengde:1.55,storrelse:.15,drej:9.4,skala:1.7,svaev:.25,loeft:.08},MS_MAP={ms_spikes:['piglaengde'],ms_size:['storrelse'],ms_rot:['drej'],ms_scale:['skala'],ms_move:['svaev','loeft']};
function nyMorgenstjerne(){const o=nyObjekt('ms','Morgenstjerne');o.pos={x:.5,y:.42};const e=o.lag[0].egenskaber,st=(p,v)=>e[p]={fra:v,til:v};
 st('storrelse',.05);st('piglaengde',.25);st('pigbredde',.71);st('punkter',12);st('drej',.4);st('farveH',40);st('farveS',15);st('farveL',75);st('skygge',1);return o}
function migrerMS(mp,ob,ps){if(!mp.some(m=>m.effect&&m.effect.startsWith('ms_')))return{maps:mp,objekter:ob,pos:ps};
 let o=ob.find(x=>x.id==='ms');if(!o){o=nyMorgenstjerne();if(ps&&ps.ms)o.pos={x:ps.ms.x,y:ps.ms.y};ob=[...ob,o]}sikrEgenskaber(o);const out=[];
 mp.forEach(m=>{const t=MS_MAP[m.effect];if(!t){out.push(m);return}t.forEach(p=>{out.push({...m,effect:'obj:ms:0:'+p});const e=o.lag[0].egenskaber[p];e.fra=MS_FRA[p];e.til=MS_TIL[p]})});
 return{maps:out,objekter:ob,pos:ps}}

/* ---------- Preset ---------- */
/* Version 8 havde spilsignaler (bånd, der begynder med sig:). Spillet er droppet, så sådanne forbindelser fjernes ved indlæsning. */
const fjernSignaler=mp=>mp.filter(m=>!(typeof m.band==='string'&&m.band.startsWith('sig:')));
function migrer(d){if(Array.isArray(d))d={mappings:d};
 const r=migrerMS(fjernSignaler(d.mappings||[]).map(m=>({curve:1,gap:120,...m})),d.objekter||[],d.pos||{});
 const sh=d.show?showKopi(d.show):null;return{version:11,master:d.master??1,pos:r.pos,objekter:r.objekter,scene:sceneKopi(d.scene),lyd:lydKopi(d.lyd),mappings:r.maps,...(sh?{show:sh}:{})}}

/* ---------- Objekter: værdier og tegning ---------- */
function vaerdi(o,li,p,E){const e=o.lag[li].egenskaber[p];if(!e)return PROPS[p][4];const env=Math.min(1,Math.max(0,(E&&E[tidOf(o,li,p)])||0));return e.fra+env*(e.til-e.fra)}
const spin={};
function stepObjekter(objekter,dt,E){objekter.forEach(o=>o.lag.forEach((l,li)=>{const k=o.id+':'+li;if(l.egenskaber.drej)spin[k]=(spin[k]||0)+dt*vaerdi(o,li,'drej',E);
 if(l.egenskaber.drejX)spin[k+':x']=(spin[k+':x']||0)+dt*vaerdi(o,li,'drejX',E);if(l.egenskaber.drejY)spin[k+':y']=(spin[k+':y']||0)+dt*vaerdi(o,li,'drejY',E)}))}
function rundPoly(g,pts,r){const n=pts.length;if(r<.5){g.moveTo(pts[0][0],pts[0][1]);for(let i=1;i<n;i++)g.lineTo(pts[i][0],pts[i][1]);g.closePath();return}
 const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2],m0=mid(pts[n-1],pts[0]);g.moveTo(m0[0],m0[1]);for(let i=0;i<n;i++){const q=pts[i],m=mid(q,pts[(i+1)%n]);g.arcTo(q[0],q[1],m[0],m[1],r)}g.closePath()}
function formSti(g,f,R,v){const n=Math.max(3,Math.round(v.punkter||12));g.beginPath();
 if(f==='cirkel'){g.arc(0,0,R,0,TAU);return}
 if(f==='rektangel'){const r=Math.max(0,Math.min(1,v.afrunding))*R;g.moveTo(-R+r,-R);g.arcTo(R,-R,R,R,r);g.arcTo(R,R,-R,R,r);g.arcTo(-R,R,-R,-R,r);g.arcTo(-R,-R,R,-R,r);g.closePath();return}
 if(f==='ring'){g.arc(0,0,R,0,TAU);const r=R*(1-v.tykkelse);g.moveTo(r,0);g.arc(0,0,r,0,TAU,true);return}
 if(f==='polygon'||f==='stjerne'){const st=f==='stjerne',m=st?n*2:n,pts=[];for(let i=0;i<m;i++){const a=-Math.PI/2+i/m*TAU,r=st&&i%2?R*v.indre:R;pts.push([Math.cos(a)*r,Math.sin(a)*r])}rundPoly(g,pts,v.afrunding*R*.5);return}
 /* Nye flade former (alle som lukkede streger, i enhedsradius R). Hjerte: den klassiske hjertekurve. Halvmåne: to cirkler med radius R, forskudt d = 2·R·tykkelse (højst 1,8 R); tykkelsen er månens bredde i midten. Kors: et plus med armbredde 2·R·tykkelse, kan afrundes. Blomst: antal kronblade = punkter, kronbladenes dybde = indre radius. Bølge: en sinusbånd, antal bølger = punkter/4, tykkelse. Spiral: en spiral med punkter/4 omgange og en tykkelse, der vokser udad. De gamle former tegnes uændret. */
 if(f==='hjerte'){const k=R/17;for(let i=0;i<=72;i++){const a=i/72*TAU,x=16*Math.pow(Math.sin(a),3),y=-(13*Math.cos(a)-5*Math.cos(2*a)-2*Math.cos(3*a)-Math.cos(4*a));if(i)g.lineTo(x*k,y*k+R*.05);else g.moveTo(x*k,y*k+R*.05)}g.closePath();return}
 if(f==='maane'){const d=Math.min(1.8,2*Math.max(.02,v.tykkelse))*R,xi=d/2,yi=Math.sqrt(Math.max(0,R*R-xi*xi)),t1=Math.atan2(yi,xi),ox=(R-xi)/2,N=48;
  for(let i=0;i<=N;i++){const a=t1+(TAU-2*t1)*i/N,x=Math.cos(a)*R+ox,y=Math.sin(a)*R;if(i)g.lineTo(x,y);else g.moveTo(x,y)}
  const p1=Math.atan2(yi,xi-d),p2=Math.atan2(-yi,xi-d);for(let i=1;i<=N;i++){const a=p2+(p1-TAU-p2)*i/N;g.lineTo(d+Math.cos(a)*R+ox,Math.sin(a)*R)}g.closePath();return}
 if(f==='kors'){const a=R*Math.max(.02,Math.min(.9,v.tykkelse)),P=[[-a,-R],[a,-R],[a,-a],[R,-a],[R,a],[a,a],[a,R],[-a,R],[-a,a],[-R,a],[-R,-a],[-a,-a]];rundPoly(g,P,Math.max(0,Math.min(1,v.afrunding))*a*.8);return}
 if(f==='blomst'){const m=Math.max(3,Math.round(v.punkter||12)),ind=Math.max(.1,Math.min(.95,v.indre));for(let i=0;i<=180;i++){const a=i/180*TAU,rr=R*(ind+(1-ind)*(.5+.5*Math.cos(m*a))),x=Math.cos(a-Math.PI/2)*rr,y=Math.sin(a-Math.PI/2)*rr;if(i)g.lineTo(x,y);else g.moveTo(x,y)}g.closePath();return}
 if(f==='boelge'){const w=Math.max(1,Math.round((v.punkter||12)/4)),th=Math.max(.02,Math.min(.9,v.tykkelse))*R*.9,A=R*.35,N=96;for(let i=0;i<=N;i++){const x=-R+2*R*i/N,y=Math.sin(x/R*Math.PI*w)*A-th/2;if(i)g.lineTo(x,y);else g.moveTo(x,y)}for(let i=N;i>=0;i--){const x=-R+2*R*i/N;g.lineTo(x,Math.sin(x/R*Math.PI*w)*A+th/2)}g.closePath();return}
 if(f==='spiral'){const tu=Math.max(1,(v.punkter||12)/4),w=R*Math.max(.02,Math.min(.9,v.tykkelse))*.25,N=200,ud=[],ind=[];for(let i=0;i<=N;i++){const u=i/N,a=tu*TAU*u-Math.PI/2,rr=R*(.12+.88*u)*.92,wh=w*(.4+.6*u);ud.push([Math.cos(a)*(rr+wh),Math.sin(a)*(rr+wh)]);ind.push([Math.cos(a)*Math.max(0,rr-wh),Math.sin(a)*Math.max(0,rr-wh)])}ud.forEach((p,i)=>{if(i)g.lineTo(p[0],p[1]);else g.moveTo(p[0],p[1])});for(let i=N;i>=0;i--)g.lineTo(ind[i][0],ind[i][1]);g.closePath();return}
 const half=Math.PI/n*v.pigbredde,tip=R*(1+v.piglaengde);let first=0,prev=0;
 for(let i=0;i<n;i++){const a=-Math.PI/2+i/n*TAU,b1=a-half,b2=a+half;if(i===0){g.moveTo(Math.cos(b1)*R,Math.sin(b1)*R);first=b1}else g.arc(0,0,R,prev,b1,false);
  g.lineTo(Math.cos(a)*tip,Math.sin(a)*tip);g.lineTo(Math.cos(b2)*R,Math.sin(b2)*R);prev=b2}
 g.arc(0,0,R,prev,first+TAU,false);g.closePath()}
/* ---- Pseudo-3D (trin 6): former, der drejes i 3D og projiceres til 2D. Stadig kun Canvas 2D. ----
   z er positiv mod seeren. Punkter drejes først om den lodrette akse (Y), så om den vandrette (X). Perspektiv: skala 1/(1 − 0,3·perspektiv·dybde), dybde −1 (bagest) til 1 (forrest).
   Dybdeskygge: lysheden stiger mod seeren (±dybde·28 for pigge, ±dybde·20 for terningens flader). Kontur og glød virker som på de flade former. */
function rot3(x,y,z,ax,ay){const cy=Math.cos(ay),sy=Math.sin(ay),cx=Math.cos(ax),sx=Math.sin(ax),x1=x*cy+z*sy,z1=-x*sy+z*cy;return[x1,y*cx-z1*sx,y*sx+z1*cx]}
const persp=(zn,per)=>1/(1-.3*per*zn),klemL=x=>Math.max(0,Math.min(100,Math.round(x)));
function tegnKugle3d(g,R,v,H,S,L,col,sx,sy,glow,pigge){const n=Math.max(3,Math.min(pigge||40,Math.round(v.punkter||12))),tip=1+v.piglaengde,ax=v.rotX*Math.PI/180+sx,ay=v.rotY*Math.PI/180+sy,per=v.perspektiv,dy=v.dybde,w=Math.min(R*.9,R*v.pigbredde*2.8/Math.sqrt(n)),sp=[];
 for(let i=0;i<n;i++){const y0=1-2*(i+.5)/n,r0=Math.sqrt(1-y0*y0),ph=i*2.399963,d=rot3(Math.cos(ph)*r0,y0,Math.sin(ph)*r0,ax,ay),sb=persp(d[2]/tip,per),st=persp(d[2],per);
  sp.push({d,B:[d[0]*R*sb,d[1]*R*sb],T:[d[0]*R*tip*st,d[1]*R*tip*st],wb:w*sb})}
 sp.sort((a,b)=>a.d[2]-b.d[2]);
 const kont='hsl('+H+' '+S+'% '+klemL(L+20)+'%)',spike=q=>{const ux=q.T[0]-q.B[0],uy=q.T[1]-q.B[1],len=Math.hypot(ux,uy),px=len>1e-6?-uy/len:0,py=len>1e-6?ux/len:1;
  g.fillStyle='hsl('+H+' '+S+'% '+klemL(L+q.d[2]*dy*28)+'%)';
  g.beginPath();g.moveTo(q.T[0],q.T[1]);g.lineTo(q.B[0]+px*q.wb,q.B[1]+py*q.wb);g.lineTo(q.B[0]-px*q.wb,q.B[1]-py*q.wb);g.closePath();g.fill();
  if(v.kontur>.01){g.lineWidth=v.kontur*10;g.strokeStyle=kont;g.stroke()}
  g.beginPath();g.ellipse(q.B[0],q.B[1],Math.max(.5,q.wb*Math.abs(q.d[2])),Math.max(.5,q.wb),Math.atan2(uy,ux),0,TAU);g.fill()};
 let k=0;while(k<sp.length&&sp[k].d[2]<0)spike(sp[k++]);
 g.fillStyle='hsl('+H+' '+S+'% '+klemL(L-dy*10)+'%)';if(glow!==false&&v.glod>.01){g.shadowColor=col;g.shadowBlur=v.glod*50}g.beginPath();g.arc(0,0,R*.96,0,TAU);g.fill();g.shadowBlur=0;
 if(v.skygge>.01){const gr=g.createRadialGradient(-R*.3,-R*.3,R*.1,0,0,R);gr.addColorStop(0,'hsl('+H+' '+Math.min(100,S+15)+'% '+Math.min(100,L+10)+'%)');gr.addColorStop(1,'hsl('+H+' '+Math.min(100,S+10)+'% '+Math.max(0,L-45)+'%)');
  const a0=g.globalAlpha;g.globalAlpha=a0*Math.min(1,v.skygge);g.fillStyle=gr;g.beginPath();g.arc(0,0,R*.96,0,TAU);g.fill();g.globalAlpha=a0}
 if(v.kontur>.01){g.beginPath();g.arc(0,0,R*.96,0,TAU);g.lineWidth=v.kontur*10;g.strokeStyle=kont;g.stroke()}
 for(;k<sp.length;k++)spike(sp[k])}
const CUBE_F=(()=>{const f=[];[[0,1],[0,-1],[1,1],[1,-1],[2,1],[2,-1]].forEach(([ax,sg])=>{const a=(ax+1)%3,b=(ax+2)%3,c=[];[[-1,-1],[1,-1],[1,1],[-1,1]].forEach(([s,t])=>{const p=[0,0,0];p[ax]=sg;p[a]=s;p[b]=t;c.push(p)});const n=[0,0,0];n[ax]=sg;f.push({n,c})});return f})();
function tegnTerning(g,R,v,H,S,L,col,sx,sy,glow){const a=R*.8,ax=v.rotX*Math.PI/180+sx,ay=v.rotY*Math.PI/180+sy,per=v.perspektiv,dy=v.dybde;
 const fs=CUBE_F.map(f=>{const n=rot3(f.n[0],f.n[1],f.n[2],ax,ay),rp=f.c.map(p=>rot3(p[0],p[1],p[2],ax,ay));return{n,cz:rp.reduce((q,p)=>q+p[2],0)/4,pts:rp.map(r=>{const s=persp(r[2]/1.74,per);return[r[0]*a*s,r[1]*a*s]})}}).filter(f=>f.n[2]>1e-6).sort((p,q)=>p.cz-q.cz);
 g.lineJoin='round';fs.forEach(f=>{g.fillStyle='hsl('+H+' '+S+'% '+klemL(L+(f.n[2]*2-1)*dy*20)+'%)';if(glow!==false&&v.glod>.01){g.shadowColor=col;g.shadowBlur=v.glod*50}
  g.beginPath();f.pts.forEach((p,i)=>i?g.lineTo(p[0],p[1]):g.moveTo(p[0],p[1]));g.closePath();g.fill();g.shadowBlur=0;
  if(v.kontur>.01){g.lineWidth=v.kontur*10;g.strokeStyle='hsl('+H+' '+S+'% '+klemL(L+20)+'%)';g.stroke()}})}
const FORM3D={kugle3d:tegnKugle3d,terning:tegnTerning};

/* ---- Tekstur: et mønster inde i et lags form (kun flade former). Typen står på laget (l.tekstur: ingen, striber, prikker, tern, boelger eller stoej); styrke (0 til 1), størrelse (andel af radius) og vinkel er egenskaber, der kan kobles til lydtræk. Mønstret klippes til formen, tegnes med få store streger (én udfyldning pr. mønster) og er helt deterministisk (ingen tilfældighed, så det ikke flimrer). Ved styrke 0 eller typen ingen tegnes laget præcis som før. Med mere end 8 kopier springes teksturen over (ydelse). ---- */
const TEKSTURER=[['ingen','Ingen'],['striber','Striber'],['prikker','Prikker'],['tern','Tern'],['boelger','Bølger'],['stoej','Støj']],TEKSTUR_TYPER=TEKSTURER.map(x=>x[0]);
function tegnTekstur(g,f,R,v,type,H,S,L){const sp=Math.max(R*.15,R*v.teksturSkala*2),sty=Math.max(0,Math.min(1,v.teksturStyrke)),ext=R*1.45*(f==='pigkugle'?1+Math.max(0,v.piglaengde||0):1.02),
 mork='hsla('+H+','+S+'%,'+Math.max(0,L-30)+'%,'+(sty*.8).toFixed(3)+')',lys='hsla('+H+','+S+'%,'+Math.min(100,L+30)+'%,'+(sty*.8).toFixed(3)+')';
 g.save();formSti(g,f,R,v);g.clip();g.rotate(v.teksturVinkel*Math.PI/180);
 if(type==='striber'){g.fillStyle=mork;g.beginPath();for(let x=-ext;x<=ext;x+=sp*2)g.rect(x,-ext,sp,2*ext);g.fill()}
 else if(type==='tern'){g.fillStyle=mork;g.beginPath();let i=0;for(let x=-ext;x<=ext;x+=sp,i++){let j=0;for(let y=-ext;y<=ext;y+=sp,j++)if((i+j)%2===0)g.rect(x,y,sp,sp)}g.fill()}
 else if(type==='prikker'){g.fillStyle=lys;g.beginPath();for(let x=-ext;x<=ext;x+=sp)for(let y=-ext;y<=ext;y+=sp){g.moveTo(x+sp/2+sp*.28,y+sp/2);g.arc(x+sp/2,y+sp/2,sp*.28,0,TAU)}g.fill()}
 else if(type==='boelge'||type==='boelger'){g.strokeStyle=mork;g.lineWidth=Math.max(1,sp*.22);g.beginPath();for(let y=-ext;y<=ext;y+=sp){for(let x=-ext;x<=ext;x+=sp*.5){const yy=y+Math.sin(x/sp*1.6)*sp*.32;if(x===-ext)g.moveTo(x,yy);else g.lineTo(x,yy)}}g.stroke()}
 else if(type==='stoej'){g.fillStyle=mork;g.beginPath();const n=Math.min(400,Math.round((2*ext/sp)*(2*ext/sp)*.5));for(let i=0;i<n;i++)g.rect((hash01('t'+i)*2-1)*ext,(hash01('u'+i)*2-1)*ext,sp*.3,sp*.3);g.fill()}
 g.restore()}
function tegnObj(g,cx,cy,Hu,o,E,W,t,opt){W=W||Hu*1.78;t=t==null?performance.now():t;o.lag.forEach((l,li)=>{const v={};propsFor(l.form).forEach(p=>v[p]=vaerdi(o,li,p,E));
 const R=Math.max(.5,Hu*v.storrelse),zv=Math.max(0,Math.min(1.5,(v.afstand||0)+(opt&&opt.z||0))),cs=zv?1/(1+1.2*zv):1,da=zv?1-.55*Math.min(1,zv):1,al=Math.max(0,Math.min(1,v.alpha))*(opt&&opt.alpha!=null?opt.alpha:1)*da,sm=(opt&&opt.skala!=null?opt.skala:1)*cs,sT=opt&&opt.spinT!=null?opt.spinT:null,kvo=opt&&opt.kv||null,glow=!(kvo&&kvo.glod===false),bl=opt&&opt.blur>0&&zv>.15?+(opt.blur*zv*6*(Hu/360)).toFixed(2):0;
 g.save();g.translate(cx+Math.sin(t/450)*W*v.svaev,cy-Hu*v.loeft);g.rotate(v.rotation*Math.PI/180+(sT!==null?sT*v.drej:(spin[o.id+':'+li]||0)));g.scale(v.skala*v.bredde*sm,v.skala*v.hojde*sm);g.globalAlpha=al;if(bl)g.filter='blur('+bl+'px)';
 const H0=opt&&opt.hue!=null?opt.hue:Math.round(v.farveH),H=opt&&opt.hueShift?(((H0+opt.hueShift)%360)+360)%360:H0,S=Math.round(v.farveS),L=Math.round(v.farveL),col='hsl('+H+' '+S+'% '+L+'%)';
 const N=Math.max(1,Math.min(32,Math.round(v.kopier||1))),glow2=glow&&N<=8,tk=l.tekstur||'ingen',tekst=TEKSTUR_TYPER.includes(tk)&&tk!=='ingen'&&v.teksturStyrke>.01&&N<=8;
 const lagTegn=()=>{if(l.form==='discokugle'){tegnDiskokugle(g,R,v,{t,key:o.id+':'+li});return}if(l.form==='danser'){tegnDanser(g,R,v,{H,S,L,glow:glow2&&v.glod>.01,t,key:o.id+':'+li+(opt&&opt.nok?':'+opt.nok:''),glit:(tk==='prikker'||tk==='stoej')&&v.teksturStyrke>.01?tk:null,glitS:v.teksturStyrke||0});return}if(FORM3D[l.form]){FORM3D[l.form](g,R,v,H,S,L,col,sT!==null?sT*(v.drejX||0):(spin[o.id+':'+li+':x']||0),sT!==null?sT*(v.drejY||0):(spin[o.id+':'+li+':y']||0),glow2,kvo?kvo.pigge:40);return}
  formSti(g,l.form,R,v);g.fillStyle=col;if(glow2&&v.glod>.01){g.shadowColor=col;g.shadowBlur=v.glod*50}g.fill();g.shadowBlur=0;
 if(tekst)tegnTekstur(g,l.form,R,v,tk,H,S,L);
 if((l.form==='cirkel'||l.form==='pigkugle')&&v.skygge>.01){const gr=g.createRadialGradient(-R*.3,-R*.3,R*.1,0,0,R);gr.addColorStop(0,'hsl('+H+' '+Math.min(100,S+15)+'% '+Math.min(100,L+10)+'%)');gr.addColorStop(1,'hsl('+H+' '+Math.min(100,S+10)+'% '+Math.max(0,L-45)+'%)');
  g.globalAlpha=al*Math.min(1,v.skygge);g.fillStyle=gr;g.beginPath();g.arc(0,0,R,0,TAU);g.fill();g.globalAlpha=al}
 if(v.kontur>.01){formSti(g,l.form,R,v);g.lineWidth=v.kontur*10;g.strokeStyle='hsl('+H+' '+S+'% '+Math.min(100,L+20)+'%)';g.stroke()}};
 /* Gentagelse rundt om: N kopier i en ring med radius kopiRadius (andel af højden) og drejning kopiDrej (rad/s). Hver kopi drejes med sin plads i ringen; kopiVend 1 lader dem vende udad, 0 lader dem stå lige op; en mellemværdi vender dem det halve af deres plads i ringen (vinklen regnes fra −180 til 180 grader, så mønsteret er symmetrisk, og en søm ligger nederst). Ved ét eksemplar tegnes laget præcis som før. */
 if(N<=1){lagTegn();g.restore();return}
 {const rl=Hu*v.kopiRadius/((v.skala||1)*(sm||1)),ra=(t/1000)*v.kopiDrej;for(let i=0;i<N;i++){const an=i/N*TAU+ra;const aw=((an+Math.PI)%TAU+TAU)%TAU-Math.PI;g.save();g.rotate(an);g.translate(0,-rl);g.rotate(-an+Math.max(0,Math.min(1,v.kopiVend))*aw);lagTegn();g.restore()}}
 g.restore()})}
/* Afstand (z): 0 er nær, 1 er fjern. Et objekt (eller lag) med afstand tegnes mindre (1 / (1 + 1,2·z)) og svagere (1 − 0,55·z), og et objekts placering trækkes mod skærmens midte (flugtpunktet) med samme faktor. Er alle afstande 0, tegnes alt præcis som før (samme rækkefølge og tal). Ellers sorteres objekterne efter lag 1's afstand, de fjerneste først. Levende objekter (liv.til) tegnes ikke her, men som forekomster (tegnLiv). */
/* fx (valgfri): { vaegt:{id: 0 til 1}, hue: grader }. En figur med en synlighed under 0,03 tegnes ikke; ellers ganges dens synlighed med vægten, og den skaleres fra 60 til 100 % (så den vokser ind), og alle farvetoner flyttes med hue grader. */
function tegnObjekter(g,W,Hh,objekter,E,t,kv,fx){const L=objekter.filter(o=>o.synlig&&!o.skabelon&&!(o.liv&&o.liv.til)),zf=o=>vaerdi(o,0,'afstand',E),op=kv?{kv,blur:kv.blur?(E.sloer||0):0}:undefined,
  opFor=o=>{if(!fx)return op;const w=fx.vaegt&&fx.vaegt[o.id];if(w===undefined&&!fx.hue)return op;return{...(op||{}),...(w!==undefined?{alpha:w,skala:.6+.4*w}:{}),...(fx.hue?{hueShift:fx.hue}:{})}},skjult=o=>{const w=fx&&fx.vaegt&&fx.vaegt[o.id];return w!==undefined&&w<.03};
 if(!L.some(o=>zf(o)!==0)){L.forEach(o=>{if(!skjult(o))tegnObj(g,W*o.pos.x,Hh*o.pos.y,Hh,o,E,W,t,opFor(o))});return}
 L.map((o,i)=>({o,i,z:zf(o)})).sort((a,b)=>b.z-a.z||a.i-b.i).forEach(({o,z})=>{if(skjult(o))return;const cs=1/(1+1.2*Math.min(1.5,z)),px=.5+(o.pos.x-.5)*cs,py=.5+(o.pos.y-.5)*cs;tegnObj(g,W*px,Hh*py,Hh,o,E,W,t,opFor(o))})}

/* ---------- Kæden: fra bånd til envelope ---------- */
/* v er båndets værdi (0 til 1), dt er tiden siden sidst i sekunder, env er forrige envelope.
   Samme formel i editor og spil:  x = (v-tærskel)/(1-tærskel), hævet til kurve, gange gain og master; så glidning med attack og release. */
/* ---- Levende effekter: partikelsky, dæmpningsringe, ekko-skygger og usikkerhedssky. Alle er slukket (tegner intet) ved envelope 0. ----
   Partikelsky (E.sky): op til 500 bløde, lysende partikler, der fødes ved pos.sky (220 pr. sekund ved fuld styrke), bliver båret af et langsomt strømfelt og trukket mod skyens midte, og dør efter 1,2 til 2,9 s. Farve: baggrundens farvetone + 170 (± 25).
   Dæmpningsringe (E.daempring): en ring fødes, når envelope krydser 0,35 opad (mindst 110 ms mellem ringe, højst 12). Den breder sig med konstant fart (radius 0,04 til 0,66 · H over 1,8 s) og dæmpes med afstanden (alfa ∝ 1/(1 + r/(0,15·H)), og toner ud mod slutningen): lyden bliver svagere, jo længere den er fra kilden.
   Ekko-skygger (E.ekko): hvert synligt objekt tegnes igen 1 til 4 gange bagved, med sin tilstand fra 80, 160, ... ms siden (så ekkoet hænger efter) og lidt større og svagere for hvert ekko, så der også er et ekko af et stille objekt.
   Usikkerhedssky (E.usikker): 18 bløde pust i tåge omkring hvert synligt objekt. Skyen bliver større og tydeligere med envelope, og den er helt deterministisk (ingen tilfældighed), så den ikke flimrer uden grund. Kobl den til noget, der måler usikkerhed (fx flatness). */
const SKY_MAX=500,RING_MAX=12,RING_MS=1800,EKKO_MS=80,EKKO_MAX=4;
const hash01=s=>{let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return((h>>>0)%100003)/100003};
function tegnSky(g,W,Hh,S,hue){const{E,t,dt,pos,T}=S,P=T.skyer,q=pos.sky||{x:.5,y:.62},en=E.sky||0,cap=Math.min(SKY_MAX,S.kval?S.kval.sky:SKY_MAX);
 if(P.length>cap)P.splice(0,P.length-cap);
 if(en>.01&&cap>0){T.skyAcc+=en*220*dt;while(T.skyAcc>=1&&P.length<cap){T.skyAcc--;const a=Math.random()*TAU,rr=Math.sqrt(Math.random())*Hh*.05;
  P.push({x:q.x*W+Math.cos(a)*rr,y:q.y*Hh+Math.sin(a)*rr,vx:(Math.random()-.5)*Hh*.12,vy:(Math.random()-.5)*Hh*.12-Hh*.04,l:1,d:.35+Math.random()*.45,s:Hh*(.006+Math.random()*.012),h:Math.random()*50-25,cx:q.x*W,cy:q.y*Hh})}if(T.skyAcc>5)T.skyAcc=5}
 for(let i=P.length-1;i>=0;i--){const p=P[i];p.l-=dt*p.d;if(p.l<=0){P.splice(i,1);continue}
  const an=(Math.sin(p.x*.011+t/1700)+Math.cos(p.y*.013-t/2100))*Math.PI,k=(.4+en)*dt,dm=Math.pow(.2,dt);
  p.vx=(p.vx+(Math.cos(an)*Hh*.18+(p.cx-p.x)*1.2)*k)*dm;p.vy=(p.vy+(Math.sin(an)*Hh*.18+(p.cy-p.y)*1.2)*k)*dm;p.x+=p.vx*dt;p.y+=p.vy*dt}
 if(!P.length)return;
 g.save();g.globalCompositeOperation='lighter';
 P.forEach(p=>{g.fillStyle='hsla('+Math.round(((hue+170+p.h)%360+360)%360)+',85%,'+Math.round(55+p.l*15)+'%,'+(Math.pow(p.l,1.4)*.5).toFixed(3)+')';g.beginPath();g.arc(p.x,p.y,p.s*(.6+p.l*.9),0,TAU);g.fill()});g.restore()}
function tegnDaempring(g,W,Hh,S,hue){const{E,t,pos,T}=S,R=T.ringe,q=pos.daempring||{x:.7,y:.5},en=E.daempring||0;
 if(en>.35&&T.dpPrev<=.35&&t-T.dpT>110){T.dpT=t;if(R.length>=RING_MAX)R.shift();R.push({t0:t,a:Math.max(.4,Math.min(1,en)),x:q.x,y:q.y})}T.dpPrev=en;
 for(let i=R.length-1;i>=0;i--)if(t-R[i].t0>RING_MS)R.splice(i,1);
 if(!R.length)return;
 g.save();g.globalCompositeOperation='lighter';
 R.forEach(o=>{const u=(t-o.t0)/RING_MS,r=Hh*(.04+.62*u),a=o.a/(1+r/(.15*Hh))*(1-u*u),col='hsla('+(hue+30)+',90%,72%,';
  g.lineWidth=Math.max(1,Hh*.012*(1-u*.8));g.strokeStyle=col+a.toFixed(3)+')';g.beginPath();g.arc(o.x*W,o.y*Hh,r,0,TAU);g.stroke();
  g.fillStyle='hsla('+(hue+30)+',90%,70%,'+(a*.08).toFixed(3)+')';g.beginPath();g.arc(o.x*W,o.y*Hh,r,0,TAU);g.fill()});g.restore()}
function tegnEkko(g,W,Hh,S){const{E,t,objekter,T}=S,en=E.ekko||0;
 if(t-T.ekkoT>=EKKO_MS){T.ekkoT=t;const s={};for(const k in E)if(k.startsWith('obj:'))s[k]=E[k];T.ekkoH.unshift(s);if(T.ekkoH.length>EKKO_MAX+2)T.ekkoH.pop()}
 const emax=Math.min(EKKO_MAX,S.kval?S.kval.ekko:EKKO_MAX);if(en<.02||emax<1)return;const n=Math.min(emax,Math.max(1,Math.round(en*EKKO_MAX)));
 for(let k=n;k>=1;k--){const E2=Object.assign({},E,T.ekkoH[k]||T.ekkoH[T.ekkoH.length-1]||{}),al=en*.5*(1-(k-1)/(n+1)),sm=1+k*.08*en;
  if(al<.03)continue;objekter.forEach(o=>{if(o.synlig&&!o.skabelon)tegnObj(g,W*o.pos.x,Hh*o.pos.y,Hh,o,E2,W,t,{alpha:al,skala:sm,kv:S.kval})})}}
function tegnUsikker(g,W,Hh,S){const{E,t,objekter}=S,en=E.usikker||0;if(en<.02)return;
 g.save();g.globalCompositeOperation='lighter';
 objekter.forEach(o=>{if(!o.synlig||o.skabelon)return;const R0=Math.max(.5,Hh*vaerdi(o,0,'storrelse',E)*vaerdi(o,0,'skala',E)),cx=W*o.pos.x,cy=Hh*o.pos.y,rho=R0*(1+2.5*en),H=Math.round(vaerdi(o,0,'farveH',E));
  for(let i=0;i<18;i++){const h1=hash01(o.id+':'+i),a=h1*TAU*7.31+t/(900+i*53)*(i%2?.5:-.5),rr=rho*(.35+.65*Math.abs(Math.sin(h1*91.7+i)))*(.85+.15*Math.sin(t/700+i*1.7)),pr=R0*(.35+.5*Math.abs(Math.cos(h1*37.1+i*.9)))*(1+en*.6);
   g.fillStyle='hsla('+H+',35%,78%,'+(en*.14).toFixed(3)+')';g.beginPath();g.arc(cx+Math.cos(a)*rr,cy+Math.sin(a)*rr,pr,0,TAU);g.fill()}});g.restore()}

/* ---- Levende objekter (livscyklus). Et objekt med liv.til er en SKABELON: den tegnes ikke selv, men hvert anslag føder en FOREKOMST (en kopi), der gennemløber tilstandene født, aktiv, udtoning og død. ----
   Fødsel: når envelope for målet liv:<objekt-id> krydser 0,35 opad (mindst 110 ms mellem fødsler). Forekomstens udseende fastfryses ved fødslen (objektets egenskabsværdier på det tidspunkt), så hvert anslag får sit eget præg.
   Tilstande efter alder: født (0 til attack ms: levetidsfaktor 0 til 1, blød), aktiv (aktiv ms: 1), udtoning (decay ms: 1 til 0, blød), død (fjernes). Faktoren ganges på synlighed; i fødslen vokser forekomsten fra 30 % til 100 %, i udtoningen skrumper den fra 100 % til 85 %.
   Placering ved fødsel: for x, y og z hver 'fast' (objektets egen placering; z: ingen ekstra afstand), 'tilf' (tilfældig) eller et bånd (x = 0,1 + 0,8·v, y = 0,9 − 0,8·v, z = v), plus en tilfældig spredning (± spredning) i x og y. Z lægges til objektets egen afstand.
   Drift: forekomsten flytter sig drift.x, drift.y og drift.z (andel af skærmen pr. sekund). Højst maks forekomster pr. objekt (den ældste dør først) og 128 i alt. */
/* v4.9: flere måder at fødes på. fodtAf kan også være takt, akkord, klang, drop, pause, sektion, midi, tast og pad; deres hændelser kommer fra editoren i S.livEv[objekt-id] (en liste pr. billede), og hver hændelse føder én kopi som en tone (med toneklasse, hvis hændelsen har en). fodtOpt holder metodens valg. Slag (anslag) og Tone er uændrede. */
const LIV_METODER=['anslag','tone','takt','akkord','klang','drop','pause','sektion','midi','tast'],LIV_OPT0={hver:'slag',klang:'slag',foel:'mellem',pause:'stop',tast:'b'};
const LIV0={til:false,fodtAf:'anslag',fodtOpt:{hver:'slag',klang:'slag',foel:'mellem',pause:'stop',tast:'b'},toneFarve:false,maks:12,attack:80,aktiv:800,decay:900,drift:{x:0,y:-.05,z:0},spredning:.04,plac:{x:'fast',y:'fast',z:'fast'}};
function livKopi(d){const s=JSON.parse(JSON.stringify(LIV0)),cl=(v,a,b)=>Math.max(a,Math.min(b,+v)),ok=y=>y!==undefined&&y!==null&&!isNaN(+y);
 if(d){s.til=!!d.til;if(LIV_METODER.includes(d.fodtAf))s.fodtAf=d.fodtAf;if(d.fodtOpt&&typeof d.fodtOpt==='object')Object.keys(LIV_OPT0).forEach(k=>{if(typeof d.fodtOpt[k]==='string'&&d.fodtOpt[k])s.fodtOpt[k]=d.fodtOpt[k].slice(0,12)});s.toneFarve=!!d.toneFarve;if(ok(d.maks))s.maks=Math.round(cl(d.maks,1,32));if(ok(d.attack))s.attack=Math.round(cl(d.attack,10,2000));if(ok(d.aktiv))s.aktiv=Math.round(cl(d.aktiv,0,5000));if(ok(d.decay))s.decay=Math.round(cl(d.decay,50,5000));
  if(d.drift)['x','y','z'].forEach(k=>{if(ok(d.drift[k]))s.drift[k]=+cl(d.drift[k],-.5,.5).toFixed(3)});if(ok(d.spredning))s.spredning=+cl(d.spredning,0,.3).toFixed(3);
  if(d.plac)['x','y','z'].forEach(k=>{if(typeof d.plac[k]==='string'&&d.plac[k])s.plac[k]=d.plac[k]})}return s}
const glat=u=>u*u*(3-2*u);
function livTilstand(liv,ageMs){const a=liv.attack,h=liv.aktiv,d=liv.decay;
 if(ageMs<a)return{tilstand:'født',l:glat(Math.max(0,ageMs/a)),sk:.3+.7*glat(Math.max(0,ageMs/a))};
 if(ageMs<a+h)return{tilstand:'aktiv',l:1,sk:1};
 if(ageMs<a+h+d){const u=(ageMs-a-h)/d,l=1-glat(u);return{tilstand:'udtoning',l,sk:.85+.15*l}}
 return{tilstand:'død',l:0,sk:.85}}
/* Fødsel fra en fundet tone: har objektet liv.fodtAf = 'tone', fødes en forekomst for hver tonebegivenhed i S.toner ({midi, pc, ...}). Placering 'toneklasse' (x = 0,1 + 0,8·toneklasse/11) og 'tonehøjde' (y = 0,9 − 0,8·(midi − 28)/68, så høje toner står højt), og liv.toneFarve sætter forekomstens farvetone efter toneklassen (toneklasse · 30 grader). */
function livFod(S,o,L,t,tone){const{T,E}=S,kilde=S.kilde||(()=>.5),kv=S.kval||KVAL_FULD;let F=T.liv;
 if(kv.livTotal<1)return;L.maks=Math.min(L.maks,kv.livObj);
 const mine=F.filter(f=>f.oid===o.id);if(mine.length>=L.maks)F.splice(F.indexOf(mine[0]),1);if(F.length>=Math.min(128,kv.livTotal))F.shift();
 const p=(k,fast,tilf,bnd)=>{const v=L.plac[k];if(v==='toneklasse')return tone?(k==='x'?.1+.8*(tone.pc/11):tone.pc/11):fast;if(v==='tonehoejde')return tone?(k==='y'?.9-.8*Math.max(0,Math.min(1,(tone.midi-28)/68)):Math.max(0,Math.min(1,(tone.midi-28)/68))):fast;
  return v==='fast'?fast:v==='tilf'?tilf():bnd(Math.max(0,Math.min(1,+kilde(v)||0)))},rnd=()=>Math.random();
 let x=p('x',o.pos.x,()=>.1+.8*rnd(),v=>.1+.8*v),y=p('y',o.pos.y,()=>.1+.8*rnd(),v=>.9-.8*v),z=p('z',0,()=>rnd(),v=>v);
 if(L.spredning>0){x+=(rnd()*2-1)*L.spredning;y+=(rnd()*2-1)*L.spredning}
 const snap={};for(const k in E)if(k.startsWith('obj:'+o.id+':'))snap[k]=E[k];
 if(t-(T.livGrpT===undefined?-1e9:T.livGrpT)>150)T.livGrpN=(T.livGrpN||0)+1;T.livGrpT=t;
 F.push({oid:o.id,t0:t,x,y,z,vx:L.drift.x,vy:L.drift.y,vz:L.drift.z,E:snap,n:++T.livN,pc:tone?tone.pc:-1,midi:tone?tone.midi:0,hue:(L.toneFarve&&tone)?tone.pc*30:null,v:Math.max(0,Math.min(1,+kilde('rms')||0)),grp:T.livGrpN})}
/* Prioritet (E.fokus): de kraftigste forekomster (højest fødselsstyrke · nuværende livsfaktor; den øverste fjerdedel, mindst én) står i fokus: lidt større og fuldt synlige. De andre dæmpes (synlighed × (1 − 0,6·E), størrelse × (1 − 0,1·E)).
   Relationer (E.relation): en tynd linje mellem forekomster, der hører sammen: født inden for 150 ms af hinanden, samme toneklasse eller en kvint fra hinanden (højst 120 linjer). Synlighed E·0,5·den svageste af de to.
   Halespor (E.hale): hver forekomst efterlader en hale af sine seneste placeringer (en pr. 40 ms, højst 24; længde 4 + 16·E), der toner ud.
   Dybdeskarphed (E.sloer, kun hvis kval.blur): fjerne ting (afstand over 0,15) sløres med E · afstand · 6 pixel (i forhold til 360 pixels højde). Forekomster og ekkoer, der er næsten usynlige (synlighed under 3 %), tegnes ikke. */
function tegnLiv(g,W,Hh,S){const{E,t,objekter,T}=S,F=T.liv,om=new Map(objekter.map(o=>[o.id,o])),toner=S.toner||[];
 objekter.forEach(o=>{if(!o.liv||!o.liv.til||!o.synlig)return;const fw0=S.figVaegt&&S.figVaegt[o.id];if(fw0!==undefined&&fw0<.2)return;const L=livKopi(o.liv);
  if(L.fodtAf==='tone'){toner.forEach(ev=>livFod(S,o,L,t,ev));return}
  if(L.fodtAf!=='anslag'){((S.livEv&&S.livEv[o.id])||[]).forEach(ev=>livFod(S,o,L,t,ev||undefined));return}
  const key='liv:'+o.id,en=E[key]||0,pv=T.livPrev[key]||0;T.livPrev[key]=en;
  if(en>.35&&pv<=.35&&t-(T.livT[key]===undefined?-1e9:T.livT[key])>110){T.livT[key]=t;livFod(S,o,L,t)}});
 const ud=[],kvl=S.kval||KVAL_FULD,tot=Math.min(128,kvl.livTotal);
 while(F.length>tot)F.shift();
 objekter.forEach(o=>{if(!o.liv||!o.liv.til)return;const m=F.filter(f=>f.oid===o.id);for(let k=0;k<m.length-kvl.livObj;k++)F.splice(F.indexOf(m[k]),1)});
 for(let i=F.length-1;i>=0;i--){const f=F[i],o=om.get(f.oid);if(!o||!o.liv||!o.liv.til){F.splice(i,1);continue}
  const age=t-f.t0,st=livTilstand(livKopi(o.liv),age);if(st.tilstand==='død'){F.splice(i,1);continue}
  const as=age/1000,z=Math.max(0,Math.min(1.5,f.z+f.vz*as));ud.push({f,o,st,as,x:f.x+f.vx*as,y:f.y+f.vy*as,z,base:vaerdi(o,0,'afstand',f.E)})}
 if(!ud.length)return;
 ud.sort((a,b)=>(b.z+b.base)-(a.z+a.base));
 ud.forEach(u=>{const zt=Math.min(1.5,u.z+u.base),cs=1/(1+1.2*zt);u.px=zt?.5+(u.x-.5)*cs:u.x;u.py=zt?.5+(u.y-.5)*cs:u.y});
 const fk=E.fokus||0,hale=E.hale||0,rel=E.relation||0;let fokusSet=null;
 if(fk>.02){const w=ud.map((u,i)=>[u.f.v*u.st.l,i]).sort((a,b)=>b[0]-a[0]);fokusSet=new Set(w.slice(0,Math.max(1,Math.ceil(ud.length*.25))).map(q=>q[1]))}
 if(hale>.02)ud.forEach(u=>{const f=u.f;if(!f.sp)f.sp=[];if(f.sT===undefined||t-f.sT>=40){f.sT=t;f.sp.push({x:u.px,y:u.py,l:u.st.l});if(f.sp.length>24)f.sp.shift()}});
 if(hale>.02){g.save();ud.forEach(u=>{const f=u.f;if(!f.sp||f.sp.length<2)return;const N=Math.min(f.sp.length,Math.round(4+hale*16)),s0=f.sp.length-N,R0=Hh*vaerdi(u.o,0,'storrelse',f.E)*.5,H=f.hue!=null?f.hue:Math.round(vaerdi(u.o,0,'farveH',f.E));
  for(let j=0;j<N;j++){const p=f.sp[s0+j],k=(j+1)/N,al=hale*.45*k*Math.min(p.l,u.st.l);if(al<.03)continue;g.fillStyle='hsla('+H+',70%,65%,'+al.toFixed(3)+')';g.beginPath();g.arc(W*p.x,Hh*p.y,Math.max(1,R0*k),0,TAU);g.fill()}});g.restore()}
 if(rel>.02&&ud.length>1){g.save();g.lineWidth=Math.max(1,Hh*.003);let n=0;
  for(let i=0;i<ud.length&&n<120;i++)for(let j=i+1;j<ud.length&&n<120;j++){const a=ud[i],b=ud[j],fa=a.f,fb=b.f,
   slaegt=fa.grp===fb.grp||(fa.pc>=0&&fb.pc>=0&&(fa.pc===fb.pc||(fa.pc-fb.pc+12)%12===7||(fb.pc-fa.pc+12)%12===7));
   if(!slaegt)continue;const al=rel*.5*Math.min(a.st.l,b.st.l);if(al<.03)continue;g.strokeStyle='hsla(210,70%,82%,'+al.toFixed(3)+')';g.beginPath();g.moveTo(W*a.px,Hh*a.py);g.lineTo(W*b.px,Hh*b.py);g.stroke();n++}g.restore()}
 ud.forEach((u,i)=>{const{f,o,st,as}=u;let al=st.l,sk=st.sk;const fw=S.figVaegt&&S.figVaegt[o.id];if(fw!==undefined){al*=fw;sk*=.6+.4*fw}if(fokusSet){if(fokusSet.has(i))sk*=1+.12*fk;else{al*=1-.6*fk;sk*=1-.1*fk}}
  if(al<.03)return;tegnObj(g,W*u.px,Hh*u.py,Hh,o,f.E,W,t,{alpha:al,skala:sk,z:u.z,spinT:as,kv:S.kval,hue:f.hue,hueShift:S.paletGrader||0,blur:kvl.blur?(E.sloer||0):0})})}

/* ---- Analyse af toner og klang (ny familie af kilder: ana:...). Rene funktioner, så de kan testes og bruges i et andet program. ----
   anaNy(sr) giver tilstanden; anaRamme(A, x) tager de seneste 8192 mono-samples og giver værdier:
   - Log-spektrum: 31 tredjedel-oktav-bånd fra 20 Hz til 20 kHz (ISO-centre), på et 8192-punkts spektrum (5,4 Hz pr. bin ved 44,1 kHz, så også bassen kan skelnes). Råværdi log10(1 + 100·RMS), normaliseres af brugeren (fil: 99. percentil; live: løbende top).
   - Tonehøjde: McLeod-metoden (normaliseret autokorrelation via FFT) på de seneste 2048 samples, 45 til 1200 Hz. Giver grundtone f0 (0 hvis ingen tone) og sikkerhed (0 til 1).
   - Toneklasser (chroma): de 12 toner (C til B) fra spektrets toppe (60 til 3000 Hz), 0 til 1 i forhold til den kraftigste. Dominerende toneklasse og hvor dominerende den er.
   - Klang: dissonans (Sethares/Plomp-Levelt over de 10 kraftigste toppe), overtonerigdom (overtone 2 til 8 i forhold til grundtonen), ulige overtoner (andel af overtone 1 til 8, der er ulige), og spredning (hvor bredt spektret fordeler sig omkring tyngdepunktet).
   Er signalet næsten stille (RMS under 0,001), er alt nul. */
function makeFFT(N){const bits=Math.log2(N),rev=new Uint32Array(N),cs=new Float32Array(N/2),sn=new Float32Array(N/2);
 for(let i=0;i<N;i++){let q=0;for(let b=0;b<bits;b++)q|=((i>>b)&1)<<(bits-1-b);rev[i]=q}
 for(let i=0;i<N/2;i++){cs[i]=Math.cos(2*Math.PI*i/N);sn[i]=-Math.sin(2*Math.PI*i/N)}
 return(re,im)=>{for(let i=0;i<N;i++){const j=rev[i];if(j>i){let t=re[i];re[i]=re[j];re[j]=t;t=im[i];im[i]=im[j];im[j]=t}}
  for(let s=2;s<=N;s<<=1){const h=s>>1,st=N/s;for(let k=0;k<N;k+=s)for(let j=0;j<h;j++){const c=cs[j*st],d=sn[j*st],a=k+j,b=a+h,tr=re[b]*c-im[b]*d,ti=re[b]*d+im[b]*c;re[b]=re[a]-tr;im[b]=im[a]-ti;re[a]+=tr;im[a]+=ti}}}}
const ANA_N=8192,ANA_W=2048,LS_FC=[20,25,31.5,40,50,63,80,100,125,160,200,250,315,400,500,630,800,1000,1250,1600,2000,2500,3150,4000,5000,6300,8000,10000,12500,16000,20000];
const TONE_NAVNE=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
const ANA_KILDER=[...TONE_NAVNE.map((n,i)=>({key:'ana:c'+i,label:'Tone '+n,gruppe:'Toner (12 toneklasser)'})),
 {key:'ana:pitch',label:'Tonehøjde',gruppe:'Tone og klang'},{key:'ana:pitchsik',label:'Tonesikkerhed',gruppe:'Tone og klang'},{key:'ana:toneklasse',label:'Toneklasse (C til B)',gruppe:'Tone og klang'},{key:'ana:tonestyrke',label:'Tonestyrke',gruppe:'Tone og klang'},
 {key:'ana:dissonans',label:'Dissonans',gruppe:'Tone og klang'},{key:'ana:rigdom',label:'Overtonerigdom',gruppe:'Tone og klang'},{key:'ana:ulige',label:'Ulige overtoner',gruppe:'Tone og klang'},{key:'ana:spredning',label:'Spektral spredning',gruppe:'Tone og klang'},
 ...LS_FC.map((f,i)=>({key:'ana:ls'+i,label:(f>=1000?(f/1000)+' kHz':f+' Hz'),gruppe:'Log-spektrum (31 frekvensbånd)'})),
 {key:'ana:taktslag',label:'Taktslag',gruppe:'Rytme'},{key:'ana:takt',label:'Takt (første slag)',gruppe:'Rytme'},{key:'ana:taktfase',label:'Taktfase (0 til 1 mellem slag)',gruppe:'Rytme'},{key:'ana:anslag',label:'Anslagsskarphed',gruppe:'Artikulation'},{key:'ana:legato',label:'Legato-grad',gruppe:'Artikulation'},{key:'ana:pan',label:'Panorering (0 venstre, 0,5 midte, 1 højre)',gruppe:'Stereo (kun lydfiler)'},{key:'ana:bredde',label:'Stereobredde (0 samme lyd i begge sider eller kun i én, 1 helt forskellige sider)',gruppe:'Stereo (kun lydfiler)'},{key:'ana:fase',label:'Faselighed (1 ens fase, 0,5 ukorreleret, 0 modfase)',gruppe:'Stereo (kun lydfiler)'},{key:'ana:energi',label:'Energi (0 rolig, 1 energisk)',gruppe:'Lydens karakter (enkel måling, ikke prøvet på rigtig musik)'},{key:'ana:lyshed',label:'Lyshed (0 mørk, 1 lys)',gruppe:'Lydens karakter (enkel måling, ikke prøvet på rigtig musik)'},{key:'ana:peak',label:'Peak, topamplitude (eksperimentel)',gruppe:'Eksperimentel: ikke prøvet på rigtig musik'},{key:'ana:domBas',label:'Dominerer: bas (eksperimentel)',gruppe:'Eksperimentel: ikke prøvet på rigtig musik'},{key:'ana:domMid',label:'Dominerer: mid (eksperimentel)',gruppe:'Eksperimentel: ikke prøvet på rigtig musik'},{key:'ana:domHoej',label:'Dominerer: høj-mid (eksperimentel)',gruppe:'Eksperimentel: ikke prøvet på rigtig musik'},{key:'ana:domBrill',label:'Dominerer: brilliance (eksperimentel)',gruppe:'Eksperimentel: ikke prøvet på rigtig musik'}];
function anaNy(sr){const win=new Float32Array(ANA_N);for(let i=0;i<ANA_N;i++)win[i]=.5-.5*Math.cos(2*Math.PI*i/ANA_N);
 return{sr,win,fftS:makeFFT(ANA_N),fftP:makeFFT(2*ANA_W),re:new Float32Array(ANA_N),im:new Float32Array(ANA_N),mag:new Float32Array(ANA_N/2),pre:new Float32Array(2*ANA_W),pim:new Float32Array(2*ANA_W),S:new Float64Array(ANA_W+1),re2:new Float32Array(ANA_N),im2:new Float32Array(ANA_N)}}
function anaTom(){const k={};ANA_KILDER.forEach(q=>k[q.key]=0);return{raa:{ls:new Float32Array(31),chroma:new Float32Array(12),f0:0,klar:0,f0m:0,klarm:0,rms:0},k}}
function anaRamme(A,x){const N=ANA_N,sr=A.sr,{re,im,mag,win}=A,bh=sr/N,out=anaTom(),R=out.raa;let sq=0;for(let i=0;i<N;i++)sq+=x[i]*x[i];R.rms=Math.sqrt(sq/N);
 if(R.rms<.001)return out;
 {let pk=0;for(let i=N/2-1024;i<N/2+1024;i++){const a=Math.abs(x[i]);if(a>pk)pk=a}out.k['ana:peak']=Math.min(1,pk)}
 for(let i=0;i<N;i++){re[i]=x[i]*win[i];im[i]=0}A.fftS(re,im);for(let i=0;i<N/2;i++)mag[i]=Math.hypot(re[i],im[i])/N*4;
 if(!A.dele||A.dele.baand!==false)/* v9.70: kan slås fra (flueben) */for(let b=0;b<31;b++){const fc=LS_FC[b],i0=Math.ceil(fc/Math.pow(2,1/6)/bh),i1=Math.floor(fc*Math.pow(2,1/6)/bh);let q=0,n=0;
  if(i1<i0){const c=Math.min(N/2-1,Math.round(fc/bh));q=mag[c]*mag[c];n=1}else for(let i=i0;i<=i1&&i<N/2;i++){q+=mag[i]*mag[i];n++}
  R.ls[b]=Math.log10(1+100*Math.sqrt(q/Math.max(1,n)))}
 // toppe (50 Hz til 5 kHz)
 const lo=Math.max(2,Math.floor(50/bh)),hi=Math.min(N/2-2,Math.ceil(5000/bh));let mx=0;for(let i=lo;i<=hi;i++)if(mag[i]>mx)mx=mag[i];
 const pk=[];if(mx>1e-7)for(let i=lo;i<=hi;i++){const a=mag[i];if(a>.03*mx&&a>mag[i-1]&&a>=mag[i+1]){const l=mag[i-1],r=mag[i+1],d=(l-r)/(2*(l-2*a+r)||-1e-12),f=(i+d)*bh;pk.push({f,a:a-.25*(l-r)*d})}}
 pk.sort((p,q)=>q.a-p.a);
 // chroma
 let cs=0,cm=0;for(const p of pk){if(p.f<60||p.f>3000||p.a<.05*mx)continue;const m=Math.round(69+12*Math.log2(p.f/440)),c=((m%12)+12)%12;R.chroma[c]+=p.a}
 for(let c=0;c<12;c++){cs+=R.chroma[c];if(R.chroma[c]>cm)cm=R.chroma[c]}
 let pcDom=0;if(cm>0){for(let c=0;c<12;c++){if(R.chroma[c]===cm)pcDom=c;R.chroma[c]/=cm}}
 // tonehøjde (McLeod)
 let f0=0,klar=0;if(!A.dele||A.dele.toner!==false){/* v9.70: kan slås fra (flueben) */const W=ANA_W,Pr=A.pre,Pi=A.pim,S=A.S,off=N-W;Pr.fill(0);Pi.fill(0);for(let i=0;i<W;i++)Pr[i]=x[off+i];A.fftP(Pr,Pi);for(let i=0;i<2*W;i++){Pr[i]=Pr[i]*Pr[i]+Pi[i]*Pi[i];Pi[i]=0}A.fftP(Pr,Pi);
 S[0]=0;for(let i=0;i<W;i++)S[i+1]=S[i]+x[off+i]*x[off+i];
 const tmin=Math.max(2,Math.floor(sr/1200)),tmax=Math.min(W-2,Math.ceil(sr/45)),ns=new Float32Array(tmax+2);
 for(let t=0;t<=tmax+1;t++){const m=S[W-t]+S[W]-S[t];ns[t]=m>1e-12?2*(Pr[t]/(2*W))/m:0}
 let best=-1,bv=0;const cand=[];let t=1;while(t<tmax&&ns[t]>0)t++;
 while(t<tmax){while(t<tmax&&ns[t]<=0)t++;let pm=-1,pv=0;while(t<tmax&&ns[t]>0){if(ns[t]>pv){pv=ns[t];pm=t}t++}if(pm>=tmin)cand.push([pm,pv])}
 for(const c of cand)if(c[1]>bv)bv=c[1];
 for(const c of cand)if(c[1]>=.93*bv){best=c[0];break}
 if(best>0&&bv>.5){const a=ns[best-1],b=ns[best],c=ns[best+1],d=(a-c)/(2*(a-2*b+c)||-1e-12),tp=best+(Math.abs(d)<1?d:0);f0=sr/tp;klar=Math.min(1,Math.max(0,b))}
 R.f0=f0;R.klar=klar;
 // Melodi-laget: samme metode på effektspektret af det 8192-punkts Hann-vindue, men med alt under 180 Hz fjernet (og kun hvis resten har mindst 0,01 % af energien, ellers er det kun rester), så en høj og stærk bas eller kick ikke skjuler en svagere melodi. f0 er den kraftigste tone (ofte bassen), f0m den kraftigste tone over 180 Hz.
 {const re2=A.re2,im2=A.im2,kut=Math.ceil(180/bh);let f0m=0,klarm=0,tot=0;for(let i=0;i<N;i++){const f=Math.min(i,N-i),p=re[i]*re[i]+im[i]*im[i];tot+=p;re2[i]=f>=kut?p:0;im2[i]=0}A.fftS(re2,im2);const r0=re2[0];
  if(r0>1e-4*tot&&r0>1e-12){const tM=Math.max(2,Math.floor(sr/1200)),tX=Math.min(2000,Math.ceil(sr/180)),nm=new Float32Array(tX+2);for(let t=0;t<=tX+1;t++)nm[t]=re2[t]/r0;let u=1;while(u<tX&&nm[u]>0)u++;const cm=[];let bm=0;
   while(u<tX){while(u<tX&&nm[u]<=0)u++;let pm=-1,pv=0;while(u<tX&&nm[u]>0){if(nm[u]>pv){pv=nm[u];pm=u}u++}if(pm>=tM)cm.push([pm,pv])}
   for(const c of cm)if(c[1]>bm)bm=c[1];let bs=-1;for(const c of cm)if(c[1]>=.93*bm){bs=c[0];break}
   if(bs>0&&bm>.5){const a=nm[bs-1],b=nm[bs],c=nm[bs+1],d=(a-c)/(2*(a-2*b+c)||-1e-12),tp=bs+(Math.abs(d)<1?d:0);f0m=sr/tp;klarm=Math.min(1,Math.max(0,b))}}
  R.f0m=f0m;R.klarm=klarm}}
 // klang
 let diss=0,rig=0,ul=0,vr=0;if(!A.dele||A.dele.klang!==false){/* v9.70: kan slås fra (flueben) */const K=pk.slice(0,10);let di=0,as=0;const a0=K.length?K[0].a:1;
 for(let i=0;i<K.length;i++){const ai=K[i].a/a0;as+=ai*ai;for(let j=i+1;j<K.length;j++){const aj=K[j].a/a0,fm=Math.min(K[i].f,K[j].f),s=.24/(.0207*fm+18.96),d=Math.abs(K[j].f-K[i].f);di+=ai*aj*(Math.exp(-3.5*s*d)-Math.exp(-5.75*s*d))}}
 diss=as>0?1-Math.exp(-4*di/as):0;
 if(f0>0){const h=[];for(let k=1;k<=8;k++){const c=Math.round(k*f0/bh);let m=0;for(let i=Math.max(1,c-2);i<=Math.min(N/2-1,c+2);i++)if(mag[i]>m)m=mag[i];h.push(m)}
  let ov=0,sum=0,odd=0;for(let k=0;k<8;k++){sum+=h[k];if(k>0)ov+=h[k];if(k%2===0)odd+=h[k]}const x2=ov/(h[0]+1e-9);rig=x2/(1+x2);ul=sum>0?odd/sum:0}
 let cs2=0,cw=0,ci=Math.floor(50/bh),cz=Math.min(N/2-1,Math.ceil(8000/bh));for(let i=ci;i<=cz;i++){cs2+=mag[i];cw+=mag[i]*i*bh}
 const cen=cs2>0?cw/cs2:0;if(cs2>0){for(let i=ci;i<=cz;i++)vr+=mag[i]*(i*bh-cen)*(i*bh-cen);vr=Math.sqrt(vr/cs2)}}
 const k=out.k;for(let c=0;c<12;c++)k['ana:c'+c]=R.chroma[c];
 const mid=f0>0?69+12*Math.log2(f0/440):0;k['ana:pitch']=f0>0?Math.max(0,Math.min(1,Math.log2(f0/40)/Math.log2(2000/40))):0;k['ana:pitchsik']=klar;
 k['ana:toneklasse']=cm>0?pcDom/11:0;k['ana:tonestyrke']=cs>0?Math.max(0,Math.min(1,(cm/cs-1/12)/(11/12))):0;
 k['ana:dissonans']=diss;k['ana:rigdom']=rig;k['ana:ulige']=ul;k['ana:spredning']=Math.min(1,vr/4000);
 for(let b=0;b<31;b++)k['ana:ls'+b]=R.ls[b];
 R.pc=cm>0?pcDom:-1;R.midi=f0>0?Math.round(mid):0;return out}
/* Tonebegivenheder: en tone "begynder", når den samme tone (afrundet til nærmeste halvtone) har stået sikkert (mindst 0,6) i mindst 50 ms, og den ikke allerede er meldt. Samme tone igen meldes efter mindst 150 ms stilhed. Vibrato (under en halv tone) giver ingen ny begivenhed. */
function toneNy(){return{sidste:null,kand:null,kandT:0,meldt:false,sidstStemt:-1e9}}
function toneTik(S,f0,klar,t){if(f0>0&&klar>=.6){const m=Math.round(69+12*Math.log2(f0/440));
  if(S.kand!==m){if(S.sidste===m&&t-S.sidstStemt<=.15){S.kand=m;S.kandT=t;S.meldt=true}else{S.kand=m;S.kandT=t;S.meldt=false}}
  S.sidstStemt=t;if(!S.meldt&&t-S.kandT>=.05){S.meldt=true;S.sidste=m;return{midi:m,pc:((m%12)+12)%12,f0,klar,t}}return null}
 if(t-S.sidstStemt>.15){S.sidste=null;S.kand=null;S.meldt=false}return null}
function toneListe(f0s,klars,tider){const S=toneNy(),ev=[];for(let i=0;i<f0s.length;i++){const e=toneTik(S,f0s[i],klars[i],tider[i]);if(e)ev.push(e)}return ev}

/* ---- Show: tempo, taktslag, sangens opbygning, toneart og simulering. Rene funktioner (til lydfiler, der er analyseret på forhånd). ----
   Metoderne er kendte og standard: tempo som autokorrelation af anslags-styrken med en kamfilter-score og en forkærlighed for 120 BPM (Ellis 2007), taktslag som dynamisk programmering (Ellis 2007), opbygning som en lighedsmatrix med en skakbrætskerne (Foote 2000) og toneart ved sammenligning med Krumhansl-Kessler-profilerne. De giver en rimelig gætning, ikke en sandhed. */
function onsetStyrke(fl,kick,snare,hihat,dtf){const n=fl.length,o=new Float32Array(n),s=new Float64Array(n+1);for(let k=0;k<n;k++){o[k]=(fl[k]||0)+(kick?kick[k]||0:0)+(snare?snare[k]||0:0)+.5*(hihat?hihat[k]||0:0);s[k+1]=s[k]+o[k]}
 const w=Math.max(2,Math.round(.5/(dtf||.0232))),u=new Float32Array(n);for(let k=0;k<n;k++){const a=Math.max(0,k-w),b=Math.min(n,k+w+1);u[k]=Math.max(0,o[k]-(s[b]-s[a])/(b-a))}return u}
/* ---- Artikulation: to kilder regnet ud af lydstyrken (RMS), ens for filer og live. Anslagsskarphed (0 til 1): hvor meget lyden stiger i forhold til sit niveau inden for 50 millisekunder (stigningen fra det laveste niveau i de seneste 50 ms, delt med niveauet plus 0,02, delt med 0,8); det afhænger ikke af billedtiden, så et slag på ét billede giver det samme live (cirka 40 ms) og for filer (23 ms): et slag (kick, snare, pluck) giver 1, en blød opbygning (pad, crescendo) næsten 0. Den holdes oppe og klinger af over cirka 150 ms, så en forbindelse kan se den, og den tæller ikke ved næsten stilhed (RMS under 0,02). Legato-grad (0 til 1): hvor stabil og vedvarende lyden er: niveau (RMS over 0,04 giver fuldt niveau) gange stabilitet (ændring op og ned pr. sekund i forhold til niveauet; 6 pr. sekund eller mere er helt ustabilt), glattet over cirka 0,4 sekund; en vedvarende tone (pad, drone, en klokke med lang efterklang) giver tæt på 1, et slag med hurtig udklingning og stilhed giver tæt på 0. Konstanterne er valgt ud fra syntetiske lyde og er ikke prøvet på rigtig musik. ---- */
function artikulationNy(){return{prev:0,a:0,l:0,primed:false,t:0,h:[]}}
function artikulationTik(S,rms,dt){dt=Math.max(.005,Math.min(.2,+dt||.0232));rms=Math.max(0,+rms||0);S.t+=dt;const lev=Math.min(1,rms/.04);let mn=rms;if(S.primed){mn=Math.min(rms,S.prev);for(const q of S.h)if(S.t-q[0]<=.05&&q[1]<mn)mn=q[1]}const raa=Math.min(1,((rms-mn)/(rms+.02))/.8)*Math.min(1,rms/.02);S.a=Math.max(raa,S.a*Math.exp(-dt/.15));const ab=S.primed?Math.abs(rms-S.prev)/dt/(rms+.02):0,mal=lev*(1-Math.min(1,ab/6));S.l+=(mal-S.l)*(1-Math.exp(-dt/.4));S.h.push([S.t,rms]);while(S.h.length&&S.t-S.h[0][0]>.06)S.h.shift();S.prev=rms;S.primed=true;return{anslag:S.a,legato:S.l}}
function artikulationSerie(rms,dtf){const n=rms.length,S=artikulationNy(),a=new Float32Array(n),l=new Float32Array(n);for(let k=0;k<n;k++){const o=artikulationTik(S,rms[k],dtf);a[k]=o.anslag;l[k]=o.legato}return{anslag:a,legato:l}}
/* ---- Dominerer (EKSPERIMENTEL): hvilket af fire områder (bas, mid, høj-mid, brilliance) der stikker mest ud lige nu. Indgangene er områdernes normaliserede lydtræk (0 til 1, hver målt mod sit eget kraftigste niveau), så et område vinder, når det er højt i forhold til sig selv, ikke bare i kraft af at bas altid har mest energi. Det område, der vinder, giver 1 og de andre 0, glattet (hurtig opad, 60 ms; langsom nedad, 150 ms). Et nyt område skal være mindst 15 procent højere end det nuværende for at overtage (så resultatet ikke flakker), og er alle fire under 0,12, er der ingen dominerende (alle 0). En vurdering, ikke en måling; kun prøvet på syntetiske lyde. ---- */
function dominansNy(){return{d:-1,u:[0,0,0,0]}}
function dominansTik(S,v,dt){dt=Math.max(.005,Math.min(.2,+dt||.0232));const x=[0,1,2,3].map(i=>Math.max(0,Math.min(1,+v[i]||0)));let mx=0,im=0;x.forEach((q,i)=>{if(q>mx){mx=q;im=i}});if(mx>.12){if(S.d<0||(im!==S.d&&x[im]>x[S.d]*1.15+.02))S.d=im}else S.d=-1;for(let i=0;i<4;i++){const mal=S.d===i?1:0,tc=mal>S.u[i]?.06:.15;S.u[i]+=(mal-S.u[i])*(1-Math.exp(-dt/tc))}return S.u.slice()}
function dominansSerie(a4,dtf){const n=a4[0].length,S=dominansNy(),o=[0,1,2,3].map(()=>new Float32Array(n));for(let k=0;k<n;k++){const u=dominansTik(S,[a4[0][k],a4[1][k],a4[2][k],a4[3][k]],dtf);for(let i=0;i<4;i++)o[i][k]=u[i]}return o}
/* ---- Stereo (kun lydfiler): panorering, stereobredde og faselighed ud af venstre og højre kanal i et udsnit [fra,til). Panorering: forskellen på kanalernes RMS delt med summen, lagt over på 0 til 1 (0,5 er midte). Stereobredde (fra v9.14): 1 minus korrelationen mellem kanalerne, højst 1: 0 er samme lyd i begge kanaler (også hvis den ene er svagere), 1 er helt forskellige lyde i hver kanal eller modfase. Er den ene kanal stille, er bredden 0. Før v9.14 var det sidens RMS delt med summen af midtens og sidens RMS, som også steg, når lyden bare lå til den ene side. Faselighed: korrelationen mellem kanalerne, lagt over på 0 til 1 (1 ens fase, 0,5 ukorreleret, 0 modfase). I stilhed (begge kanaler under 0,001 i RMS) giver de midte, mono og ukorreleret (0,5; 0; 0,5), så en figur ikke hopper. ---- */
function stereoRamme(l,r,fra,til){fra=Math.max(0,fra|0);til=Math.min(l.length,r.length,til|0);let ll=0,rr=0,lr=0,mm=0,ss=0,n=0;for(let i=fra;i<til;i++){const a=+l[i],b=+r[i];if(!Number.isFinite(a)||!Number.isFinite(b))continue;ll+=a*a;rr+=b*b;lr+=a*b;const m=(a+b)/2,s=(a-b)/2;mm+=m*m;ss+=s*s;n++}
 if(n<1)return{pan:.5,bredde:0,fase:.5};const rl=Math.sqrt(ll/n),rrr=Math.sqrt(rr/n);if(rl<.001&&rrr<.001)return{pan:.5,bredde:0,fase:.5};
 const kl=x=>Math.max(0,Math.min(1,x)),pan=(rrr-rl)/(rrr+rl+1e-12)*.5+.5,kor=lr/(Math.sqrt(ll*rr)+1e-12);
 /* v9.14: bredde = 1 minus korrelationen, højst 1; er den ene kanal stille (under 0,001 i RMS eller 40 dB under den anden), er bredden 0 */
 const stille=Math.min(rl,rrr)<.001||Math.min(rl,rrr)<.01*Math.max(rl,rrr);
 return{pan:kl(pan),bredde:stille?0:kl(1-kor),fase:kl((kor+1)/2)}}
/* ---- Lydens karakter (enkel måling): to langsomme kilder, der siger, hvor energisk og hvor lys lyden er over de seneste sekunder. Det er lydens karakter, ikke en stemning eller en følelse. Energi lægger tre af de normaliserede lydtræk (0 til 1) sammen med faste vægte: 0,5 gange RMS, 0,3 gange Spectral flux og 0,2 gange gennemsnittet af Høj-mid og Brilliance. Lyshed er 0,6 gange Spectral centroid og 0,4 gange Spectral rolloff. Begge glattes med en tidskonstant på 2 sekunder (første værdi er lig indgangen, så starten ikke trækkes mod 0), så de bevæger sig langsomt. Vægtene er valgt af mig og er ikke sammenlignet med, hvad mennesker synes. Ren funktion, ens for filer og live. ---- */
function karakterNy(){return{e:0,l:0,start:true}}
function karakterTik(S,v,dt){dt=Math.max(.005,Math.min(.2,+dt||.0232));const g=k=>{const x=+(v&&v[k]);return Number.isFinite(x)?Math.max(0,Math.min(1,x)):0},en=.5*g('rms')+.3*g('flux')+.2*(g('hmid')+g('brill'))/2,ly=.6*g('centroid')+.4*g('rolloff');if(S.start){S.e=en;S.l=ly;S.start=false}else{const a=1-Math.exp(-dt/2);S.e+=(en-S.e)*a;S.l+=(ly-S.l)*a}return{energi:S.e,lyshed:S.l}}
function karakterSerie(F,dtf){const n=F.rms.length,S=karakterNy(),e=new Float32Array(n),l=new Float32Array(n);for(let k=0;k<n;k++){const u=karakterTik(S,{rms:F.rms[k],flux:F.flux[k],hmid:F.hmid[k],brill:F.brill[k],centroid:F.centroid[k],rolloff:F.rolloff[k]},dtf);e[k]=u.energi;l[k]=u.lyshed}return{energi:e,lyshed:l}}
/* Kilder, der regnes ud af lydtrækkene (ikke af selve lydanalysen); en gemt analyse behøver ikke dem. */
const ANA_AFLEDT=['ana:anslag','ana:legato','ana:domBas','ana:domMid','ana:domHoej','ana:domBrill','ana:energi','ana:lyshed'];
/* ---- Enkel tilstand: følsomhed pr. gruppe af lydtræk (bas, trommer, vokal, mid, højt) og en tre-bånds EQ. Følsomheden er en ganger (0 til 2, standard 1) på en forbindelses styrke; den gælder kun forbindelser, hvis kilde er i en af grupperne (alle andre får 1). EQ'en er tre filtre: lavt hyldefilter ved 200 Hz, klokkefilter ved 1 kHz og højt hyldefilter ved 4 kHz, hver fra minus 12 til plus 12 dB. Tal der ikke er tal bliver til standarden. ---- */
const FOELSOM_GRUPPER={bas:['bas'],trommer:['kick','snare','hihat','flux'],vokal:['vokal'],mid:['mid','hmid'],hoej:['brill','centroid','rolloff','zcr']};
function foelsomNy(){return{bas:1,trommer:1,vokal:1,mid:1,hoej:1}}
function foelsomFaktor(F,band){for(const g in FOELSOM_GRUPPER)if(FOELSOM_GRUPPER[g].includes(band)){const v=F&&F[g],x=(v===null||v===undefined||v==='')?NaN:+v;return Number.isFinite(x)?Math.max(0,Math.min(2,x)):1}return 1}
function eqNy(){return{bas:0,mid:0,diskant:0}}
function eqIndstilling(E){const g=k=>{const x=+(E&&E[k]);return Number.isFinite(x)?Math.max(-12,Math.min(12,x)):0};return{bas:{type:'lowshelf',f:200,gain:g('bas')},mid:{type:'peaking',f:1000,q:.8,gain:g('mid')},diskant:{type:'highshelf',f:4000,gain:g('diskant')}}}
/* ---- Rens figurer (v3.3): figurer, der kommer ind udefra (gemt i browseren, en importeret opsætning, en gemt plads), kan være ødelagte, fx med en form, programmet ikke kender. Funktionen laver en renset kopi og ændrer ikke indgangen: en figur, der ikke er et objekt, fjernes; mangler en figur id eller navn, får den et; ligger placeringen ikke som to tal, får den standardplaceringen; et lag, der ikke er et objekt, fjernes; en ukendt, tom eller manglende form bliver til Cirkel; manglende eller ødelagte egenskaber (ikke {fra, til} med tal) får standardværdien, og tal skrevet som tekst bliver til tal; en figur uden lag får ét lag med Cirkel. Gyldige figurer kommer igennem uændrede. Svaret er {objekter, rettet, fjernet}. ---- */
function renseObjekter(arr){const ud={objekter:[],rettet:0,fjernet:0};if(!Array.isArray(arr))return ud;
 arr.forEach((o,oi)=>{if(!o||typeof o!=='object'||Array.isArray(o)){ud.fjernet++;return}
  const n=Object.assign({},o);
  if(typeof n.id!=='string'||!n.id){n.id='o_r'+oi;ud.rettet++}
  if(typeof n.navn!=='string'){n.navn='Figur '+(oi+1);ud.rettet++}
  const p=n.pos;if(!p||typeof p!=='object'||typeof p.x!=='number'||typeof p.y!=='number'||!Number.isFinite(p.x)||!Number.isFinite(p.y)){n.pos={x:.28,y:.32};ud.rettet++}
  const nl=[];(Array.isArray(n.lag)?n.lag:[]).forEach(l=>{if(!l||typeof l!=='object'||Array.isArray(l)){ud.rettet++;return}
   const m=Object.assign({},l);
   if(typeof m.form!=='string'||!Object.prototype.hasOwnProperty.call(FORMER,m.form)){m.form='cirkel';ud.rettet++}
   if(!m.egenskaber||typeof m.egenskaber!=='object'||Array.isArray(m.egenskaber)){m.egenskaber={};ud.rettet++}
   const e=Object.assign({},m.egenskaber);
   propsFor(m.form).forEach(q=>{const x=e[q];if(x===undefined){if(Object.prototype.hasOwnProperty.call(e,q))delete e[q];return}const num=v=>(typeof v==='number'&&Number.isFinite(v))?v:(typeof v==='string'&&v.trim()!==''&&Number.isFinite(+v))?+v:NaN;
    const fr=x&&typeof x==='object'?num(x.fra):NaN,ti=x&&typeof x==='object'?num(x.til):NaN;
    if(!Number.isFinite(fr)||!Number.isFinite(ti)){const d=PROPS[q][4];e[q]={fra:d,til:d};ud.rettet++}
    else if(x.fra!==fr||x.til!==ti){e[q]=Object.assign({},x,{fra:fr,til:ti});ud.rettet++}});
   m.egenskaber=e;nl.push(m)});
  if(!nl.length){nl.push({form:'cirkel',egenskaber:nyEgenskaber('cirkel')});ud.rettet++}
  n.lag=nl;ud.objekter.push(n)});
 return ud}
/* Tilstand, der hører til en figur (fjedre, glimt, drejning), nøgles efter figurens id og blev aldrig ryddet op. Funktionen sletter de poster, der ikke er brugt de seneste graense sekunder (tSek er nu i sekunder), og svarer med, hvor mange den slettede. Poster uden tid slettes ikke. ---- */
function rydTilstand(tSek,graense){let n=0;const nu=+tSek,g=+graense;if(!Number.isFinite(nu)||!Number.isFinite(g))return 0;for(const T of [DANS_ST,DISKO_ST]){for(const k of Object.keys(T)){const s=T[k],sidst=s&&typeof s==='object'?(typeof s.t==='number'?s.t:(typeof s.lt==='number'?s.lt:null)):null;if(sidst!==null&&sidst<nu-g){delete T[k];n++}}}return n}
/* En gemt analyse af en sang må kun bruges, hvis den har alle de nuværende analysekilder; ellers mangler de nyere kilder (de ville være 0), og sangen skal analyseres igen. */
function cacheGyldig(c){return !!(c&&c.F&&c.A&&ANA_KILDER.every(q=>ANA_AFLEDT.includes(q.key)||c.A[q.key]))}
/* Normalisering efter slagkurvens toppe: den almindelige normalisering deler med kurvens 99. percentil, så de kraftigste udslag (fx støjen fra en snare) bestemmer målestokken, og svage, men regelmæssige slag (fx en hihat) bliver for små til at nå en tærskel. Her bruges i stedet medianområdet af kurvens lokale toppe (kvantil 0,6), men aldrig mindre end 0,2 gange den almindelige værdi (så en støjende kurve ikke skaleres mere end fem gange op). Er der under otte toppe, bruges den almindelige værdi. Målt: hihat finder 99 til 100 procent mod 34 procent på fem syntetiske sange. */ function normToppe(a,p99,kvantil,gulv){kvantil=kvantil==null?.6:kvantil;gulv=gulv==null?.2:gulv;const pk=[];for(let i=1;i<a.length-1;i++)if(a[i]>0&&a[i]>a[i-1]&&a[i]>=a[i+1])pk.push(a[i]);if(pk.length<8)return Math.max(p99,1e-9);pk.sort((x,y)=>x-y);const q=pk[Math.min(pk.length-1,Math.floor(pk.length*kvantil))];return Math.max(q,gulv*p99,1e-9)} function tempoSkoen(o,dtf,lo,hi){lo=lo||60;hi=hi||200;const n=o.length;if(n<Math.round(8/dtf))return{bpm:0,konf:0,score:0};
 let mu=0;for(let k=0;k<n;k++)mu+=o[k];mu/=n;const x=new Float32Array(n);let v0=0;for(let k=0;k<n;k++){x[k]=o[k]-mu;v0+=x[k]*x[k]}if(v0<1e-9)return{bpm:0,konf:0,score:0};
 const maxL=Math.ceil(60/lo/dtf*4)+3,ac=new Float64Array(maxL+2);for(let L=0;L<=maxL+1;L++){let s=0;for(let k=0;k+L<n;k++)s+=x[k]*x[k+L];ac[L]=s/(n-L)/(v0/n)}
 const A=l=>{const i=Math.floor(l),f=l-i;return i+1>=ac.length?0:ac[i]*(1-f)+ac[i+1]*f},W=[1,.7,.5,.35];let best=-1e9,bb=0;
 const cs=[];for(let b=lo;b<=hi;b+=.25){const L=60/b/dtf;let s=0;for(let j=1;j<=4;j++)if(j*L<=maxL)s+=W[j-1]*A(j*L);s=Math.max(0,s);const pr=Math.exp(-.5*Math.pow(Math.log2(b/120)/.9,2)),sc=s*pr;cs.push([b,sc]);if(sc>best){best=sc;bb=b}}
 const L0=60/bb/dtf;let pk=0;for(let d=-1;d<=1;d+=.5)pk=Math.max(pk,A(L0+d));/* Sikkerheden var kun periodiciteten (hvor regelmæssigt slagene gentager sig, højst 1), så den kunne sige 1,0 og alligevel tælle det halve eller dobbelte. Nu ganges den med en straf, når det halve eller dobbelte tempo næsten er lige så godt (kvoten mellem den bedste score i de to andre oktaver og den valgte); kvoten, det alternative tempo og periodiciteten returneres også. Straffen (0,6 fra kvote 0,5) er valgt ved at minimere Brier-scoren på 13 syntetiske sange (0,283 til 0,187), altså på de samme sange: den kan være overtilpasset. Tempoet selv er uændret. */ const per=Math.max(0,Math.min(1,pk/.5));let am=0,ab=0;for(const [bq,c] of cs){if((Math.abs(bq/(bb*2)-1)<.03||Math.abs(bq/(bb/2)-1)<.03)&&c>am){am=c;ab=bq}} const forhold=best>0?am/best:0;return{bpm:bb,konf:per*(1-.6*Math.max(0,Math.min(1,(forhold-.5)/.5))),periodicitet:per,oktavForhold:forhold,alt:ab,score:best}}
function taktslag(o,dtf,bpm,stramhed){if(!(bpm>0))return[];const n=o.length,P=60/bpm/dtf,lam=stramhed||100;let sd=0,mu=0;for(let k=0;k<n;k++)mu+=o[k];mu/=n;for(let k=0;k<n;k++)sd+=(o[k]-mu)*(o[k]-mu);sd=Math.sqrt(sd/n)||1;
 const C=new Float64Array(n),fra=new Int32Array(n).fill(-1);
 for(let k=0;k<n;k++){const ok=o[k]/sd;let b=-1e9,bj=-1;const j0=Math.max(0,Math.floor(k-2*P)),j1=Math.floor(k-P/2);for(let j=j0;j<=j1;j++){const d=Math.log((k-j)/P),v=C[j]-lam*d*d;if(v>b){b=v;bj=j}}
  if(bj>=0&&b>0){C[k]=ok+b;fra[k]=bj}else{C[k]=ok;fra[k]=-1}}
 let bk=Math.max(0,n-Math.ceil(P)-1);for(let k=bk;k<n;k++)if(C[k]>C[bk])bk=k;const out=[];for(let k=bk;k>=0;k=fra[k])out.push(k);return out.reverse()}
function taktFase(o,beats,perTakt){perTakt=perTakt||4;if(beats.length<perTakt*2)return{fase:0,konf:0};const s=new Float64Array(perTakt),c=new Int32Array(perTakt);beats.forEach((k,i)=>{s[i%perTakt]+=o[k];c[i%perTakt]++});
 const m=Array.from(s,(v,i)=>c[i]?v/c[i]:0);let bi=0;for(let i=1;i<perTakt;i++)if(m[i]>m[bi])bi=i;const rest=(m.reduce((a,b)=>a+b,0)-m[bi])/(perTakt-1);return{fase:bi,konf:m[bi]>0?Math.max(0,Math.min(1,(m[bi]-rest)/m[bi])):0}}
function taktKilder(n,dtf,beats,fase,perTakt){perTakt=perTakt||4;const sl=new Float32Array(n),tk=new Float32Array(n),fs=new Float32Array(n),tb=beats.map(k=>(k+1)*dtf);
 for(let i=0;i<tb.length;i++){const t0=tb[i],t1=i+1<tb.length?tb[i+1]:t0+(tb[i]-(tb[i-1]||t0-.5)),bar=((i%perTakt)===fase);
  for(let k=Math.max(0,Math.floor(t0/dtf)-1);k<n;k++){const t=(k+1)*dtf;if(t<t0-1e-9)continue;if(t>t0+.7)break;const a=Math.exp(-(t-t0)/.12);if(a>sl[k])sl[k]=a;if(bar){const b=Math.exp(-(t-t0)/.25);if(b>tk[k])tk[k]=b}}
  for(let k=Math.max(0,Math.floor(t0/dtf)-1);k<n;k++){const t=(k+1)*dtf;if(t<t0-1e-9)continue;if(t>=t1)break;fs[k]=Math.min(1,(t-t0)/Math.max(1e-6,t1-t0))}}
 return{taktslag:sl,takt:tk,taktfase:fs}}
const KK_DUR=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88],KK_MOL=[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17];
function toneart(ch){const cor=(a,b)=>{let ma=0,mb=0;for(let i=0;i<12;i++){ma+=a[i];mb+=b[i]}ma/=12;mb/=12;let s=0,va=0,vb=0;for(let i=0;i<12;i++){s+=(a[i]-ma)*(b[i]-mb);va+=(a[i]-ma)*(a[i]-ma);vb+=(b[i]-mb)*(b[i]-mb)}return s/Math.sqrt(va*vb+1e-12)};
 const sc=[];for(let rod=0;rod<12;rod++){const rot=Array.from({length:12},(_,i)=>ch[(i+rod)%12]);sc.push({rod,modus:'dur',c:cor(rot,KK_DUR)});sc.push({rod,modus:'mol',c:cor(rot,KK_MOL)})}
 sc.sort((a,b)=>b.c-a.c);const b=sc[0],n2=sc[1];return{rod:b.rod,modus:b.modus,c:b.c,konf:Math.max(0,Math.min(1,(b.c-n2.c)/(Math.abs(b.c)+1e-9)*4)),navn:TONE_NAVNE[b.rod]+(b.modus==='dur'?' dur':' mol')}}
/* Opbygning: feat er en liste af rækker (hver én værdi pr. analyseramme, i samme enhed 0 til 1; en række skaleres højst op til en spredning på 0,12, så støj ikke tæller som skift). Lighed er en gaussisk kerne på afstanden mellem sekundblokke. Resultat: sektioner {t0,t1,energi (0 til 1),navn}. */
function opbygning(feat,dtf,opt){opt=Object.assign({blok:1,minSek:8,kerne:8,taerskel:.12,gulv:.12},opt||{});const n=feat[0].length,bl=Math.max(1,Math.round(opt.blok/dtf)),m=Math.floor(n/bl),dur=n*dtf;
 const sek=(t0,t1,e)=>({t0,t1,energi:e,navn:''});if(m<12)return[Object.assign(sek(0,dur,.5),{navn:'hele sangen'})];
 const V=feat.map(row=>{const b=new Float64Array(m);for(let i=0;i<m;i++){let s=0;for(let k=i*bl;k<(i+1)*bl;k++)s+=row[k];b[i]=s/bl}let mu=0;for(let i=0;i<m;i++)mu+=b[i];mu/=m;let sd=0;for(let i=0;i<m;i++)sd+=(b[i]-mu)*(b[i]-mu);sd=Math.max(Math.sqrt(sd/m),opt.gulv);for(let i=0;i<m;i++)b[i]=(b[i]-mu)/sd;return b});
 const S=[],sig2=V.length*.35;for(let i=0;i<m;i++){S.push(new Float32Array(m));for(let j=0;j<m;j++){let s=0;for(let d=0;d<V.length;d++){const q=V[d][i]-V[d][j];s+=q*q}S[i][j]=Math.exp(-s/(2*sig2))}}
 const K=Math.max(2,Math.min(opt.kerne,Math.floor(m/4))),nov=new Float64Array(m);for(let i=K;i<m-K;i++){let s=0,w=0;for(let a=-K;a<K;a++)for(let b=-K;b<K;b++){const g=Math.exp(-.5*(Math.pow(a+.5,2)+Math.pow(b+.5,2))/Math.pow(K/2,2)),sg=(a>=0?1:-1)*(b>=0?1:-1);s+=sg*g*S[i+a][i+b];w+=g}nov[i]=s/w}
 const pk=[];for(let i=K;i<m-K;i++)if(nov[i]>=opt.taerskel&&nov[i]>=nov[i-1]&&nov[i]>nov[i+1])pk.push([i,nov[i]]);pk.sort((a,b)=>b[1]-a[1]);const min=Math.max(2,Math.round(opt.minSek/opt.blok)),valgt=[];for(const p of pk)if(valgt.every(q=>Math.abs(q-p[0])>=min))valgt.push(p[0]);valgt.sort((a,b)=>a-b);
 const grz=[0,...valgt.map(i=>i*bl*dtf),dur],loud=feat[0],raw=[];for(let i=0;i+1<grz.length;i++){const k0=Math.floor(grz[i]/dtf),k1=Math.max(k0+1,Math.floor(grz[i+1]/dtf));let s=0;for(let k=k0;k<k1&&k<n;k++)s+=loud[k];raw.push(s/(k1-k0))}
 let lo=Math.min(...raw),hi=Math.max(...raw);const e=raw.map(v=>hi>lo?(v-lo)/(hi-lo):.5),out=grz.slice(0,-1).map((t0,i)=>sek(t0,grz[i+1],e[i]));
 out.forEach((s,i)=>{const k0=Math.floor(s.t0/dtf),k1=Math.min(n,Math.floor(s.t1/dtf)),tr=Math.max(1,Math.floor((k1-k0)/3));let a=0,b=0;for(let k=k0;k<k0+tr;k++)a+=loud[k];for(let k=k1-tr;k<k1;k++)b+=loud[k];a/=tr;b/=tr;const sp=hi>lo?(b-a)/(hi-lo):0,nxt=out[i+1],prv=out[i-1];
  s.navn=s.energi<.34?'rolig':s.energi<.67?'middel':'høj';if(sp>.2&&nxt&&nxt.energi>s.energi+.15)s.navn='opbygning';else if(sp<-.2&&nxt&&nxt.energi<s.energi-.15)s.navn='nedtoning';
  if(i===0&&s.energi<.5&&out.length>1&&s.navn!=='opbygning')s.navn='intro';if(i===out.length-1&&s.energi<.5&&out.length>1)s.navn='outro'});return out}
/* Sektionernes vægte: hver forbindelse har en rolle, og hver slags sektion har en vægt pr. rolle. Ved en grænse glider vægten over 1,2 sekunder. */
const SHOW_ROLLER=['rytme','slag','flyd','melodi','scene','ekstra'];
const SHOW_TYPER={rolig:{rytme:.6,slag:.3,flyd:1,melodi:.8,scene:.8,ekstra:0},middel:{rytme:1,slag:.8,flyd:1,melodi:1,scene:1,ekstra:.3},'høj':{rytme:1,slag:1,flyd:1,melodi:1,scene:1,ekstra:1},opbygning:{rytme:.9,slag:.6,flyd:1,melodi:1,scene:.9,ekstra:.5},nedtoning:{rytme:.7,slag:.4,flyd:1,melodi:.9,scene:.8,ekstra:.1},intro:{rytme:.4,slag:.1,flyd:.8,melodi:.6,scene:.6,ekstra:0},outro:{rytme:.4,slag:.1,flyd:.8,melodi:.6,scene:.6,ekstra:0},'hele sangen':{rytme:1,slag:1,flyd:1,melodi:1,scene:1,ekstra:1}};
function vaegteKopi(v){if(!v||typeof v!=='object')return null;const o={};for(const t in SHOW_TYPER){if(!v[t]||typeof v[t]!=='object')continue;const r={};for(const ro of SHOW_ROLLER){const x=+v[t][ro];if(v[t][ro]!=null&&isFinite(x))r[ro]=Math.max(0,Math.min(1,x))}if(Object.keys(r).length)o[t]=r}return Object.keys(o).length?o:null}
function figurerKopi(f){if(!f||typeof f!=='object')return null;const o={};for(const id of Object.keys(f)){if(!id||id.length>40||!f[id]||typeof f[id]!=='object')continue;const r={};for(const t in SHOW_TYPER){const x=+f[id][t];if(f[id][t]!=null&&isFinite(x))r[t]=Math.max(0,Math.min(1,x))}if(Object.keys(r).length)o[id]=r}return Object.keys(o).length?o:null}
function paletKopi(p){if(!p||typeof p!=='object')return null;const o={};for(const t in SHOW_TYPER){const x=+p[t];if(p[t]!=null&&isFinite(x))o[t]=Math.max(-180,Math.min(180,x))}return Object.keys(o).length?o:null}
function showKopi(d){if(!d||typeof d!=='object')return null;const sek=Array.isArray(d.sektioner)?d.sektioner.filter(s=>s&&isFinite(s.t0)&&isFinite(s.t1)&&s.t1>s.t0).map(s=>({t0:+s.t0,t1:+s.t1,energi:Math.max(0,Math.min(1,+s.energi||0)),navn:SHOW_TYPER[s.navn]?s.navn:'middel'})):[];
 return{til:d.til!==false,variant:['rolig','balanceret','vild'].includes(d.variant)?d.variant:'balanceret',navn:String(d.navn||'').slice(0,60),fade:Math.max(.2,Math.min(4,+d.fade||1.2)),bpm:+d.bpm||0,toneart:String(d.toneart||'').slice(0,20),sektioner:sek,...(vaegteKopi(d.vaegte)?{vaegte:vaegteKopi(d.vaegte)}:{}),...(figurerKopi(d.figurer)?{figurer:figurerKopi(d.figurer)}:{}),...(paletKopi(d.palet)?{palet:paletKopi(d.palet)}:{})}}
function showVaegt(show,rolle,t){if(!show||!show.til||!show.sektioner||!show.sektioner.length)return 1;const S=show.sektioner,w=s=>{const o=show.vaegte&&show.vaegte[s.navn],v=o&&o[rolle];return v!=null&&isFinite(v)?Math.max(0,Math.min(1,v)):(SHOW_TYPER[s.navn]||SHOW_TYPER.middel)[rolle]};if(w(S[0])===undefined)return 1;let i=S.findIndex(s=>t>=s.t0&&t<s.t1);if(i<0)i=t<S[0].t0?0:S.length-1;const f=show.fade/2;let v=w(S[i]);
 if(i>0&&t-S[i].t0<f){const u=(t-S[i].t0+f)/(2*f);v=w(S[i-1])+(w(S[i])-w(S[i-1]))*(.5-.5*Math.cos(Math.PI*u))}
 else if(i<S.length-1&&S[i].t1-t<f){const u=(t-(S[i].t1-f))/(2*f);v=w(S[i])+(w(S[i+1])-w(S[i]))*(.5-.5*Math.cos(Math.PI*u))}return v}
/* ---- Sikker visning: en lukket sløjfe, der MÅLER lysstyrken i det tegnede billede og dæmper de lyse effekter, når der kommer for mange hurtige skift ----
   Retningslinjen (WCAG 2.3.1) siger: højst tre blink i sekundet, hvor et blink er et par modsatrettede skift i lysstyrke (relativ luminans) på mindst 10 % af den største lysstyrke, når den mørkeste er under 0,8 (altså et absolut skift på 0,1 på skalaen fra 0 til 1).
   luminans(r,g,b): relativ luminans (0 til 1) for en sRGB-farve. blinkNy() giver tilstanden. blinkTik(S, L, t): L er billedets gennemsnitlige luminans, t er tiden i ms; den finder skiftene (S.tider) og sætter S.faktor: ved 4 skift eller flere i det seneste sekund falder den hurtigt (angreb 25 ms) til det, der skal til for at få udsvinget i lysstyrke ned på 0,07 (men mindst 0,05 og højst 0,5), og den stiger langsomt igen (1,2 s, og først et sekund efter sidste dæmpning), så de lyse effekter dæmpes, mens det varer. S.rate er blink pr. sekund (skift / 2).
   blinkBegraens(E, faktor, bevaegelse): giver en kopi af effekterne, hvor de lyse (strobe, glød, lys-puls, chokbølge og burst) er ganget med faktor, strobe højst 0,6 (så den hvide flade højst er 0,24), og ryst og zoom er ganget med bevaegelse. */
function luminans(r,g,b){const f=c=>{c/=255;return c<=.03928?c/12.92:Math.pow((c+.055)/1.055,2.4)};return .2126*f(r)+.7152*f(g)+.0722*f(b)}
function blinkNy(){return{L:null,ext:0,retning:0,tider:[],hist:[],faktor:1,rate:0,sidst:null,hold:0}}
function blinkTik(S,L,t){const dt=S.sidst===null?16:Math.max(1,Math.min(250,t-S.sidst));S.sidst=t;
 if(S.L===null){S.L=L;S.ext=L}else{S.L=L;const fx=S.ext;
  if(S.retning>=0){if(S.retning===1&&L>fx)S.ext=L;else if(fx-L>=.1){if(L<.8)S.tider.push(t);S.retning=-1;S.ext=L}else if(S.retning===0&&L-fx>=.1){if(fx<.8)S.tider.push(t);S.retning=1;S.ext=L}}
  else{if(L<fx)S.ext=L;else if(L-fx>=.1){if(fx<.8)S.tider.push(t);S.retning=1;S.ext=L}}}
 S.hist.push([t,L]);while(S.hist.length&&t-S.hist[0][0]>1000)S.hist.shift();
 while(S.tider.length&&t-S.tider[0]>1000)S.tider.shift();const n=S.tider.length;S.rate=n/2;
 let mål=1;if(n>=4){let mn=1e9,mx=-1e9;for(const h of S.hist){if(h[1]<mn)mn=h[1];if(h[1]>mx)mx=h[1]}const a0=(mx-mn)/Math.max(S.faktor,.05);mål=Math.max(.05,Math.min(.5,.07/Math.max(a0,1e-6)));S.hold=t+1000}
 if(mål<S.faktor)S.faktor+=(mål-S.faktor)*(1-Math.exp(-dt/25));else if(t>=S.hold)S.faktor+=(mål-S.faktor)*(1-Math.exp(-dt/1200));
 S.faktor=Math.max(.05,Math.min(1,S.faktor));return S}
function blinkBegraens(E,faktor,bevaegelse){const o={...E};['strobe','glod','puls','ring','burst'].forEach(k=>{if(o[k]>0)o[k]=o[k]*faktor});if(o.strobe>.6)o.strobe=.6;if(o.ryst>0)o.ryst*=bevaegelse;if(o.zoom>0)o.zoom*=bevaegelse;return o}
/* Tempo-justering: tempoet kan være det halve eller dobbelte af det, man selv tæller. tempoFaktor giver nye taktslag (billedindeks): ×2 lægger et taktslag midt imellem hvert par, ×0,5 beholder hvert andet (den fase, hvor anslagsstyrken o er størst). tapTempo finder tempoet ud fra tryk (sekunder). snapTempo siger, hvilken faktor (0,5, 1 eller 2) der passer bedst til et tappet tempo, og om den passer (højst 8 % fra). foersteSlag finder, hvilket taktslag (0 til 3) et givet tidspunkt ligger nærmest. */
function tempoFaktor(beats,faktor,o){if(!beats||!beats.length)return[];if(faktor===2){const out=[];for(let i=0;i<beats.length;i++){out.push(beats[i]);if(i+1<beats.length)out.push(Math.round((beats[i]+beats[i+1])/2))}return out}
 if(faktor===.5){const s=[0,0],c=[0,0];beats.forEach((k,i)=>{s[i%2]+=o?o[k]||0:0;c[i%2]++});const ph=(c[1]&&s[1]/c[1]>s[0]/(c[0]||1))?1:0;return beats.filter((k,i)=>i%2===ph)}return beats.slice()}
function tapTempo(tider){const t=(tider||[]).slice(-9);if(t.length<4)return{bpm:0,n:t.length,konf:0};const iv=[];for(let i=1;i<t.length;i++)iv.push(t[i]-t[i-1]);const s=iv.slice().sort((a,b)=>a-b),med=s[Math.floor(s.length/2)];if(!(med>0))return{bpm:0,n:t.length,konf:0};
 const ok=iv.filter(v=>Math.abs(v-med)<=med*.25);if(ok.length<3)return{bpm:0,n:t.length,konf:0};const g=ok.reduce((a,b)=>a+b,0)/ok.length;let sd=0;ok.forEach(v=>sd+=(v-g)*(v-g));sd=Math.sqrt(sd/ok.length);return{bpm:60/g,n:t.length,konf:Math.max(0,Math.min(1,1-sd/g*4))}}
function snapTempo(tapBpm,bpm){if(!(tapBpm>0)||!(bpm>0))return{faktor:1,fejl:1,passer:false};let b=null;for(const f of [.5,1,2]){const e=Math.abs(bpm*f-tapBpm)/tapBpm;if(!b||e<b.fejl)b={faktor:f,fejl:e}}return{...b,passer:b.fejl<=.08}}
function foersteSlag(beats,t,dtf,perTakt){perTakt=perTakt||4;if(!beats||!beats.length)return{fase:0,afstand:1e9};let bi=0,bd=1e9;beats.forEach((k,i)=>{const d=Math.abs((k+1)*dtf-t);if(d<bd){bd=d;bi=i}});return{fase:bi%perTakt,afstand:bd}}
/* Figurernes optræden og farveskift: show.figurer = { figurId: { sektionstype: 0 til 1 } } siger, hvor synlig hver figur er i hver slags sektion (0 = væk, 1 = fuldt synlig); show.palet = { sektionstype: grader } flytter alle figurernes farvetoner. Begge glider over show.fade sekunder ved en sektionsgrænse (samme glidning som rollernes vægte). Figurer uden en tabel er altid synlige. */
const SHOW_FIGUR0={ms:{rolig:.8,middel:1,'høj':1,opbygning:1,nedtoning:.8,intro:.5,outro:.5,'hele sangen':1},puls:{rolig:.7,middel:1,'høj':1,opbygning:1,nedtoning:.7,intro:.4,outro:.4,'hele sangen':1},ring:{rolig:.4,middel:.9,'høj':1,opbygning:1,nedtoning:.5,intro:0,outro:0,'hele sangen':1},melodi:{rolig:.8,middel:1,'høj':1,opbygning:1,nedtoning:.8,intro:.3,outro:.3,'hele sangen':1},bund:{rolig:.4,middel:.9,'høj':1,opbygning:.9,nedtoning:.4,intro:0,outro:0,'hele sangen':1},glimt:{rolig:0,middel:.3,'høj':1,opbygning:.7,nedtoning:0,intro:0,outro:0,'hele sangen':1},spiral:{rolig:.2,middel:.8,'høj':1,opbygning:1,nedtoning:.2,intro:0,outro:0,'hele sangen':1},kerne:{rolig:0,middel:.3,'høj':1,opbygning:.6,nedtoning:0,intro:0,outro:0,'hele sangen':1}};
const SHOW_PALET0={intro:0,rolig:0,middel:25,'høj':50,opbygning:25,nedtoning:-15,outro:-30,'hele sangen':0};
function sektionGlid(show,w,t){const S=show.sektioner;if(!S||!S.length)return null;let i=S.findIndex(s=>t>=s.t0&&t<s.t1);if(i<0)i=t<S[0].t0?0:S.length-1;const f=show.fade/2;let v=w(S[i]);
 if(i>0&&t-S[i].t0<f){const u=(t-S[i].t0+f)/(2*f);v=w(S[i-1])+(w(S[i])-w(S[i-1]))*(.5-.5*Math.cos(Math.PI*u))}
 else if(i<S.length-1&&S[i].t1-t<f){const u=(t-(S[i].t1-f))/(2*f);v=w(S[i])+(w(S[i+1])-w(S[i]))*(.5-.5*Math.cos(Math.PI*u))}return v}
function showFigurVaegt(show,id,t){if(!show||!show.til||!show.figurer||!show.figurer[id])return 1;const tab=show.figurer[id],v=sektionGlid(show,s=>{const x=tab[s.navn];return x!=null&&isFinite(x)?Math.max(0,Math.min(1,x)):1},t);return v==null?1:Math.max(0,Math.min(1,v))}
function showPalet(show,t){if(!show||!show.til||!show.palet)return 0;const v=sektionGlid(show,s=>{const x=show.palet[s.navn];return x!=null&&isFinite(x)?Math.max(-180,Math.min(180,x)):0},t);return v==null?0:v}
/* Simulering af en forbindelse over en hel analyseret række a: hvor ofte den er tændt, hvor kraftig den er, og hvor mange slag i sekundet den giver. */
function aktivitet(m,a,dtf,master,vaegt){if(!a||!a.length)return{andel:0,middel:0,maks:0,pr_sek:0,antal:0};let env=0,prev=0,last=-1e9,tændt=0,sum=0,mx=0,ev=0;for(let k=0;k<a.length;k++){const w=vaegt?vaegt((k+1)*dtf):1;env=trin(m,a[k],dtf,env,master==null?1:master*w,false);const c=Math.min(1,env),t=(k+1)*dtf*1000;if(c>.15)tændt++;sum+=c;if(c>mx)mx=c;if(c>.35&&prev<=.35&&t-last>(m.gap??120)){last=t;ev++}prev=c}
 return{andel:tændt/a.length,middel:sum/a.length,maks:mx,pr_sek:ev/(a.length*dtf),antal:ev}}
/* Find en tærskel, så aktiviteten rammer et mål: {type:'slag',lo,hi} (slag i sekundet) eller {type:'flyd',lo,hi} (andel af tiden); maks (valgfri) begrænser tærsklen opad (standard 0,92). Giver den nye tærskel og om målet nåedes. */
function indstilTaerskel(m,a,dtf,master,maal){const val=r=>maal.type==='slag'?r.pr_sek:r.andel,mid=(maal.lo+maal.hi)/2;let lo=.02,hi=maal.maks||.92,best=null;
 for(let it=0;it<12;it++){const th=(lo+hi)/2,r=aktivitet({...m,thr:th},a,dtf,master),v=val(r);if(!best||Math.abs(v-mid)<Math.abs(best.v-mid))best={thr:th,v,r};if(v>mid)lo=th;else hi=th}
 return{thr:+best.thr.toFixed(3),v:best.v,ok:best.v>=maal.lo&&best.v<=maal.hi,r:best.r}}

/* ---- Lyd i 3D: musikken tegnet som et landskab og striber i et 3D-rum. Rene funktioner (geometri), så de kan testes uden at se noget. ----
   Verdenen er den samme i tre kameraer, der kun adskiller sig i tidsvinduet (bagud, frem): A Flyvning (fremtiden er synlig; kun lydfiler), B Horisont (kun nutid og fortid: det nye opstår ved horisonten og glider mod dig), C Skulptur (alt, der har været, bliver stående, og kameraet kredser).
   Dybden z går fra 0 (nær, den ældste del af vinduet) til 1 (fjern). Landskabet er log-spektrets 31 bånd over tid (virker i al musik), striberne er toner, programmet er sikkert på (længde = tonens længde). */
function noder(f0s,klars,rms,dtf,opt){opt=Object.assign({klar:.6,min:.08,hul:2,spring:1.5},opt||{});const out=[],n=f0s.length,midi=f=>69+12*Math.log2(f/440);let cur=null,hul=0;
 const luk=()=>{if(cur){const len=(cur.sl-cur.s0+1)*dtf;if(len>=opt.min){const m=cur.ms.slice().sort((a,b)=>a-b)[Math.floor(cur.ms.length/2)],mm=Math.round(m);out.push({t0:cur.s0*dtf,t1:(cur.sl+1)*dtf,midi:mm,f0:440*Math.pow(2,(m-69)/12),pc:((mm%12)+12)%12,niveau:Math.max(0,Math.min(1,cur.rs/cur.ms.length))})}cur=null}};
 for(let k=0;k<n;k++){const ok=f0s[k]>0&&klars[k]>=opt.klar;if(ok){const m=midi(f0s[k]);if(cur&&Math.abs(m-cur.sidst)>opt.spring)luk();if(!cur)cur={s0:k,sl:k,ms:[],rs:0,sidst:m};cur.sl=k;cur.ms.push(m);cur.rs+=rms?rms[k]||0:.5;cur.sidst=m;hul=0}else if(cur){hul++;if(hul>opt.hul)luk()}}
 luk();return out}
function d3Vindue(kamera,t,total){const m=kamera&&kamera.mode||'A';if(m==='B')return{bagud:kamera.bagud||6,frem:0};if(m==='C')return{bagud:Math.max(8,Math.min(t,total||t)),frem:0};return{bagud:kamera&&kamera.bagud||1.5,frem:kamera&&kamera.frem||4}}
const D3_HUE=x=>250*Math.max(0,Math.min(1,x));
function d3Farve(mode,o){o=o||{};const niv=Math.max(0,Math.min(1,o.niveau==null?.5:o.niveau));let h,s=80,l=35+niv*30;
 if(mode==='toneklasse'&&o.pc>=0&&o.pc!=null)h=o.pc*30;else if(mode==='klang'&&o.klang!=null)h=240*(1-Math.max(0,Math.min(1,o.klang)));else if(mode==='styrke'){h=200;s=70;l=20+niv*55}else if(mode==='sektion'&&o.sek!=null)h=(o.sek*70)%360;else h=D3_HUE(o.x);
 return{h:Math.round(h),s,l:Math.round(l)}}
/* Skalaen falder jævnt med dybden og kan aldrig blive negativ, heller ikke når et punkt kredser forbi kameraet (så bliver det bare større, op til 2,1 gange). */
function d3Projekter(p,kam,W,H){const th=kam&&kam.orbit||0,c=Math.cos(th),s=Math.sin(th),xc=p[0],zc=p[2]-.5,xr=xc*c+zc*s,zr=-xc*s+zc*c+.5,pe=zr>=0?1/(1+2.2*zr):1-1.1*zr;return{x:W/2+xr*W*.46*pe,y:H*(.3+.5*pe)-p[1]*H*.34*pe,pe,z:zr}}
/* S: {t, total, dtf, kamera:{mode,bagud,frem,orbit}, farve:'frekvens'|'toneklasse'|'klang'|'styrke'|'sektion', ls:[31 rækker 0 til 1], noder, slag:{kick:[sek],snare:[...],hihat:[...]}, beats:[sek], sektioner, klang:(t)=>0..1, sikker, loft}
   Giver {prim:[...], nu:z for "nu"-planet, vindue}. Primitiver: {type:'landskab',pts,farve,alpha}, {type:'stribe',pts,farve,alpha,bredde}, {type:'takt',z,alpha,bar}, {type:'udbrud',x,y,z,r,farve,alpha}. */
/* Forsvind: hvor længe et signal (stribe, udbrud, taktlinje) bliver stående, efter at lyden er væk. 'klang': kun et øjeblik (striber 0,25 s, udbrud 0,35 s, taktlinjer 0,5 s), så de forsvinder med klangen; 'lyd': striberne toner ud efter lydens egen udtoning i tonens frekvensbånd (udbrud og taktlinjer som 'klang'); 'kort': cirka et sekund (1, 0,8 og 1,5 s); 'vindue' (standard): først når de forlader tidsvinduet. Skulptur (C) beholder altid alt. Signalerne toner ud (alpha falder jævnt med alderen). */
const D3_FORSVIND={klang:{stribe:.25,udbrud:.35,takt:.5},kort:{stribe:1,udbrud:.8,takt:1.5}};
function d3Bygning(S){const t=S.t,total=S.total||t,W0=d3Vindue(S.kamera,t,total),span=W0.bagud+W0.frem,t0=t-W0.bagud,z=tt=>(tt-t0)/span,prim=[],mC=!!(S.kamera&&S.kamera.mode==='C'),lyd=!mC&&S.forsvind==='lyd',fo=mC?null:lyd?D3_FORSVIND.klang:D3_FORSVIND[S.forsvind]||null,loft=S.loft||{plader:48,striber:200,udbrud:60},dtf=S.dtf||.0232;
 const sekAt=tt=>{const q=S.sektioner||[];const i=q.findIndex(s=>tt>=s.t0&&tt<s.t1);return i<0?0:i},xfra=m=>Math.max(-1,Math.min(1,(Math.log2(440*Math.pow(2,(m-69)/12)/20)/Math.log2(1000))*2-1));
 if(S.ls&&S.ls.length){const K=Math.max(2,loft.plader);for(let i=0;i<K;i++){const tt=t0+span*(i+.5)/K;if(tt<0||tt>total)continue;const k=Math.max(0,Math.min(S.ls[0].length-1,Math.floor(tt/dtf))),pts=[];let sum=0;
  for(let j=0;j<S.ls.length;j++){const v=S.ls[j][k]||0;sum+=v;pts.push([j/(S.ls.length-1)*2-1,v,z(tt)])}
  prim.push({type:'landskab',pts,farve:d3Farve(S.farve,{x:.0,niveau:sum/S.ls.length,sek:sekAt(tt),klang:S.klang?S.klang(tt):null}),alpha:.3+.5*(1-Math.abs(z(tt)-.5)*.6),t:tt,gradient:S.farve==='frekvens'})}}
 /* 'lyd': tonen toner ud i takt med, at energien i dens eget frekvensbånd (log-spektret ved tonens grundtone) faktisk dør hen, i forhold til gennemsnittet, mens den klang; den kan aldrig lyse op igen (laveste værdi siden slutningen), og efter 3 s er den væk. */
 const lydFade=nd=>{const ls=S.ls;if(!ls||!ls.length||!(nd.f0>0))return null;const b=Math.max(0,Math.min(ls.length-1,Math.round(Math.log2(nd.f0/20)/Math.log2(1000)*(ls.length-1)))),row=ls[b],k0=Math.max(0,Math.floor(nd.t0/dtf)),k1=Math.floor(nd.t1/dtf),kn=Math.floor(t/dtf);let ref=0,n=0;for(let k=k0;k<=k1&&k<row.length;k++){ref+=row[k];n++}ref=n?ref/n:0;if(ref<1e-3)return{fa:0};let mn=1;for(let k=Math.max(0,k1);k<=kn&&k<row.length;k++){const q=Math.max(0,Math.min(1,row[k]/ref));if(q<mn)mn=q}return{fa:mn}};
 let ns=0;(S.noder||[]).forEach(nd=>{if(nd.t1<t0||nd.t0>t+W0.frem||ns>=loft.striber)return;const alder=t-nd.t1;let fa=1;if(lyd&&alder>0){const q=lydFade(nd);if(alder>3||(q?q.fa:1-alder/.25)<.03)return;fa=q?q.fa:1-alder/.25}else if(fo&&alder>0){if(alder>=fo.stribe)return;fa=1-alder/fo.stribe}const a=Math.max(nd.t0,t0),b=Math.min(nd.t1,t+W0.frem);if(b<=a)return;ns++;const x=xfra(nd.midi),y=.25+.75*nd.niveau;
  prim.push({type:'stribe',pts:[[x,y,z(a)],[x,y,z(b)]],farve:d3Farve(S.farve==='frekvens'?'frekvens':S.farve,{x:(x+1)/2,pc:nd.pc,niveau:nd.niveau,sek:sekAt(nd.t0),klang:S.klang?S.klang(nd.t0):null}),alpha:.95*fa,bredde:1+3*nd.niveau,midi:nd.midi,t0:nd.t0,t1:nd.t1})});
 (S.beats||[]).forEach((tb,i)=>{if(tb<t0||tb>t+W0.frem)return;let fa=1;if(fo&&t-tb>0){if(t-tb>=fo.takt)return;fa=1-(t-tb)/fo.takt}prim.push({type:'takt',z:z(tb),alpha:.22*fa,fade:fa,bar:(S.taktFase!=null&&i%4===S.taktFase),t:tb})});
 const kor={kick:{x:-.8,y:.1,r:.2,h:0},snare:{x:0,y:.2,r:.14,h:60},hihat:{x:.8,y:.45,r:.07,h:200}};let nu=0,sidste=-1e9;const alle=[];
 const lev=fo?fo.udbrud:.8;Object.keys(kor).forEach(k=>(S.slag&&S.slag[k]||[]).forEach(tb=>{if(tb>=t0&&tb<=t+W0.frem&&!(fo&&t-tb>=lev))alle.push([tb,k])}));alle.sort((a,b)=>a[0]-b[0]);
 for(const [tb,k] of alle){if(nu>=loft.udbrud)break;let al=.8;if(S.sikker){if(tb-sidste<.34)continue;al=.55;sidste=tb}nu++;prim.push({type:'udbrud',x:kor[k].x,y:kor[k].y,z:z(tb),r:kor[k].r,farve:{h:kor[k].h,s:85,l:55},alpha:al,slag:k,t:tb,levetid:lev})}
 return{prim,nu:z(t),vindue:W0}}

/* ---- Kvalitet og ydelse: niveauer med lofter, en regulator og en måletest. ----
   Kvalitet er en egenskab ved den computer og skærm, programmet kører på, ikke ved selve kunsten, så den hører ikke til i en preset.
   Et niveau er: glod (sløring på former og slange; DEN dyreste ting i Canvas 2D), pigge (højst antal pigge på Pigkugle 3D), sky (højst partikler), ekko (højst ekkoer),
   livObj og livTotal (højst levende forekomster pr. objekt og i alt), skala (tegnefladens opløsning i forhold til dens størrelse på skærmen) og fps (maks. billedhastighed).
   Uden kval tegner scenen som altid (= niveauet Fuld). Standard er Disco: glød fra og moderate lofter. */
const KVAL_FULD={niveau:'fuld',navn:'Fuld',glod:true,blur:true,pigge:40,sky:500,ekko:4,livObj:32,livTotal:128,skala:1,fps:60};
const KVAL_NIVEAUER={
 disco:{niveau:'disco',navn:'Disco',glod:false,blur:false,pigge:24,sky:300,ekko:3,livObj:12,livTotal:48,skala:1,fps:60},
 undervisning:{niveau:'undervisning',navn:'Undervisning',glod:true,blur:false,pigge:40,sky:200,ekko:2,livObj:6,livTotal:24,skala:1,fps:60},
 spar:{niveau:'spar',navn:'Spar',glod:false,blur:false,pigge:12,sky:100,ekko:1,livObj:4,livTotal:12,skala:.5,fps:30},
 fuld:KVAL_FULD};
const KVAL_TEKST={disco:'Til en stor skærm og lang tid ad gangen: glød fra, moderate lofter (op til 12 levende kopier pr. figur og 48 i alt, 300 partikler, 3 ekkoer).',
 undervisning:'Til tydelig visning med få ting: glød til, men lavere lofter (6 levende kopier pr. figur og 24 i alt, 200 partikler, 2 ekkoer).',
 spar:'Til en svag computer eller lav strøm: glød fra, små lofter, halv opløsning og 30 billeder i sekundet.',
 fuld:'Ingen lofter ud over programmets egne (glød til, 128 levende kopier, 500 partikler, 4 ekkoer). Kræver en kraftig computer.',
 egen:'Dine egne lofter. Start fra et niveau, og ændr det, du vil.'};
function kvalKopi(d){const id=typeof d==='string'?d:d&&d.niveau,eg=d&&typeof d==='object'?d.egne:null,cl=(v,a,b)=>Math.max(a,Math.min(b,+v)),ok=y=>y!==undefined&&y!==null&&!isNaN(+y);
 const base=id==='egen'?{...KVAL_NIVEAUER.disco,...(eg||{})}:{...(KVAL_NIVEAUER[id]||KVAL_NIVEAUER.disco)};
 const k={niveau:id==='egen'?'egen':(KVAL_NIVEAUER[id]?id:'disco'),navn:id==='egen'?'Egen':base.navn,glod:!!base.glod,blur:!!base.blur,pigge:ok(base.pigge)?Math.round(cl(base.pigge,3,40)):24,sky:ok(base.sky)?Math.round(cl(base.sky,0,500)):300,ekko:ok(base.ekko)?Math.round(cl(base.ekko,0,4)):3,
  livObj:ok(base.livObj)?Math.round(cl(base.livObj,1,32)):12,livTotal:ok(base.livTotal)?Math.round(cl(base.livTotal,0,128)):48,skala:ok(base.skala)?+cl(base.skala,.4,1).toFixed(2):1,fps:ok(base.fps)&&+base.fps<45?30:60};
 return k}
const REG_TRIN=[null,{glod:false,ekko:2,sky:.75,liv:1},{ekko:1,sky:.5,liv:.5},{ekko:0,sky:.25,liv:.25,skala:.75},{ekko:0,sky:.1,liv:.1,skala:.5}];
/* Regulatoren skruer ned i trin (højst 4) oven på det valgte niveau og aldrig op over det. Trin 1: glød fra, højst 2 ekkoer, 75 % partikler. Trin 2: højst 1 ekko, halvt så mange partikler og levende kopier. Trin 3: ingen ekkoer, en fjerdedel, højst 75 % opløsning. Trin 4: en tiendedel og 50 % opløsning. */
function kvalTrin(kv,trin){trin=Math.max(0,Math.min(4,trin|0));const o={...kv,trin};if(!trin)return o;const t=REG_TRIN[trin];o.glod=false;o.blur=false;if(t.ekko!==undefined)o.ekko=Math.min(o.ekko,t.ekko);
 o.sky=Math.round(o.sky*t.sky);o.livObj=Math.max(1,Math.round(o.livObj*t.liv));o.livTotal=Math.round(o.livTotal*t.liv);if(t.skala)o.skala=Math.min(o.skala,t.skala);return o}
/* Regulator: kaldes for hvert billede med tiden siden forrige billede (ms) og den ønskede billedtid (ms). Hver 30. billede regnes et gennemsnit.
   Over 1,2 gange den ønskede tid to gange i træk: ét trin ned i kvalitet. Højst 1,05 gange den ønskede tid i `krav` gennemsnit i træk (standard 8, cirka 4 sekunder): ét trin op igen.
   Fører et trin op til, at det bliver for langsomt igen, kræves flere gode gennemsnit næste gang (+8, højst 32), så regulatoren ikke svinger. Billedtider over 250 ms (fx baggrundsfane) ignoreres. Slået fra giver den altid trin 0. */
function regNy(){return{trin:0,buf:[],daarlig:0,god:0,krav:8}}
function regTik(R,dtMs,maalMs,aktiv,maxTrin){const mx=maxTrin==null?4:maxTrin;if(!aktiv){R.trin=0;R.buf.length=0;R.daarlig=R.god=0;return 0}
 if(!(dtMs>0)||dtMs>250)return R.trin;R.buf.push(dtMs);if(R.buf.length<30)return R.trin;
 const gns=R.buf.reduce((a,b)=>a+b,0)/R.buf.length;R.buf.length=0;
 if(gns>maalMs*1.2){R.daarlig++;R.god=0;if(R.daarlig>=2&&R.trin<mx){R.trin++;R.daarlig=0;R.krav=Math.min(32,R.krav+8)}}
 else if(gns<=maalMs*1.05){R.god++;R.daarlig=0;if(R.god>=R.krav&&R.trin>0){R.trin--;R.god=0;R.krav=Math.max(8,R.krav-4)}}
 else{R.daarlig=0;R.god=0}
 return R.trin}
/* ---- Måletest: scener, statistik, vurdering og rapport. ----
   maaleScener() giver scener, der belaster tegningen på forskellig vis. Hver har byg() (frisk tilstand), og E(i) giver effekternes værdier for billede i. De tegnes af tegnScene på den rigtige tegneflade, uden at røre brugerens egen opsætning. */
const E_NUL=()=>({farve:0,zoom:0,ryst:0,glod:0,fart:0,banelys:0,slange:0,slange_farve:0,bolge:0,puls:0,ring:0,burst:0,strobe:0,sky:0,daempring:0,ekko:0,usikker:0,fokus:0,relation:0,hale:0,sloer:0,fv:0});
function maaleScener(){const POSB={puls:{x:.5,y:.55},ring:{x:.5,y:.86},burst:{x:.5,y:.55},glod:{x:.5,y:.5},sky:{x:.5,y:.62},daempring:{x:.7,y:.5}};
 const rist=(id,lag,glod,skygge,form,x,y)=>{const o=nyObjekt(id,id);o.pos={x,y};o.lag=[];for(let i=0;i<lag;i++){const f=form||'pigkugle',e=nyEgenskaber(f);e.glod={fra:glod,til:glod};e.skygge={fra:skygge,til:skygge};o.lag.push({form:f,egenskaber:e})}return o};
 const gitter=(n,lag,glod,skygge,form,pre)=>Array.from({length:n},(_,i)=>rist((pre||'f')+i,lag,glod,skygge,form,.1+.8*((i%6)/5),.15+.14*Math.floor(i/6)));
 const levende=(n,lag,glod,skygge,form,maks,pre)=>gitter(n,lag,glod,skygge,form,pre||'l').map(o=>{o.liv=livKopi({til:true,maks,attack:80,aktiv:900,decay:600,spredning:.05,plac:{x:'tilf',y:'tilf',z:'tilf'}});return o});
 const spec=(id,navn,kv,objekter,Efn,klods,slange)=>({id,navn,kval:kv,byg:()=>({objekter:objekter(),E:Efn,kval:kv,T:nyScene(),scene:sceneKopi(null),pos:POSB,slange:!!slange,klods:klods||0})});
 const livE=(ids,i)=>{const e={};ids.forEach(x=>e['liv:'+x]=i%9<4?.9:.1);return e};
 const dis=kvalKopi('disco'),und=kvalKopi('undervisning'),ful=kvalKopi('fuld');
 return[
  spec('tom','Tom bane (3 spor)',ful,()=>[],i=>E_NUL()),
  spec('disco','Disco-belastning (6 figurer, 36 forekomster, sky, ringe, ekko)',dis,()=>[...gitter(6,2,0,0),...levende(3,1,0,0,'pigkugle',12,'ld')],i=>Object.assign(E_NUL(),{sky:.8,ekko:.8,daempring:i%7<3?.9:.1,puls:.6,farve:.6},livE(['ld0','ld1','ld2'],i))),
  spec('undervisning','Undervisning-belastning (6 figurer med glød, 18 levende kopier)',und,()=>[...gitter(6,2,.5,.6),...levende(3,1,.5,.6,'pigkugle',6,'lu')],i=>Object.assign(E_NUL(),{sky:.7,ekko:.7,puls:.6,farve:.6},livE(['lu0','lu1','lu2'],i))),
  spec('fuld','Fuld belastning (12 figurer × 3 lag med glød, 128 levende kopier, alle effekter)',ful,()=>[...gitter(12,3,.6,1),...levende(5,1,0,0,'pigkugle',32,'lf')],i=>Object.assign(E_NUL(),{farve:.8,glod:.8,fart:.8,banelys:.8,bolge:.8,puls:.8,ring:.8,burst:.8,sky:1,ekko:1,usikker:1,daempring:i%7<3?.9:.1,slange:.8,slange_farve:.8},livE(['lf0','lf1','lf2','lf3','lf4'],i)),3,true),
  spec('kugle3d','Pigkugle 3D (3 faste og 48 forekomster, 24 pigge)',dis,()=>[...gitter(3,1,0,0,'kugle3d','k'),...levende(4,1,0,0,'kugle3d',12,'lk')],i=>Object.assign(E_NUL(),livE(['lk0','lk1','lk2','lk3'],i))),
  spec('glod_fra','24 figurer uden glød',dis,()=>gitter(24,1,0,0),i=>E_NUL()),
  spec('glod_til','24 figurer med glød (sløring)',ful,()=>gitter(24,1,.6,0),i=>E_NUL())]}
function maaleStat(tider){const s=[...tider].sort((a,b)=>a-b),n=s.length;if(!n)return{n:0,gns:0,p95:0,max:0,fps:0};const gns=s.reduce((a,b)=>a+b,0)/n;return{n,gns,p95:s[Math.min(n-1,Math.floor(n*.95))],max:s[n-1],fps:1000/gns}}
/* ok: mindst 90 % af målet i billeder i sekundet og de langsomste 5 % højst 1,35 gange målets billedtid. grænse: mindst 70 % af målet. Ellers tung. */
function maaleVurdering(st,maalFps){const m=maalFps||60;if(!st.n)return'tung';if(st.fps>=m*.9&&st.p95<=1000/m*1.35)return'ok';if(st.fps>=m*.7)return'grænse';return'tung'}
function maaleAnbefal(res,maalFps){const v=id=>{const x=res.find(q=>q.id===id);return x?x.vurdering||maaleVurdering(x,maalFps):'tung'};
 if(v('tom')==='tung')return'spar';if(v('fuld')==='ok')return'fuld';if(v('undervisning')==='ok')return'undervisning';if(v('disco')==='ok')return'disco';return'spar'}
function maaleRapport(res,info,anbef,maalFps){const f=(x,d)=>(+x).toFixed(d==null?1:d).replace('.',','),L=['Måletest, Rytme-editor v2','Mål: '+(maalFps||60)+' billeder i sekundet. Opnået billedhastighed er ikke begrænset i testen.',''];
 if(info)L.push('Grafikkort: '+(info.gpu||'ukendt'),'Processorkerner: '+(info.kerner||'ukendt'),'Skærm: '+(info.skaerm||'ukendt')+', pixeltæthed '+(info.dpr||'ukendt'),'Tegneflade: '+(info.canvas||'ukendt'),'Browser: '+(info.browser||'ukendt'),'Niveau under testen: '+(info.niveau||'ukendt'),'');
 L.push('Scene | billeder i sek. | gns. ms | langsomste 5 % ms | vurdering');res.forEach(x=>L.push([x.navn,f(x.fps,0),f(x.gns),f(x.p95),x.vurdering||maaleVurdering(x,maalFps)].join(' | ')));
 L.push('','Anbefalet niveau: '+(KVAL_NIVEAUER[anbef]?KVAL_NIVEAUER[anbef].navn:anbef));return L.join('\n')}

/* ---- Scenen (trin 7b): hele preview-tegningen i ét kald. Flyttet ordret fra editoren (samme rækkefølge af kald og af Math.random), så facitlisten viser, at intet er ændret.
   Beregning og tegning er stadig blandet (klodser, striber og partikler flytter sig, mens de tegnes). Det deles op senere.
   S = {E, t, dt, scene, pos, objekter, slange, ur(klods), T}. E er effekternes envelopes, t og dt er tid og tidsskridt (ms og s), pos er effekternes positioner (0 til 1),
   slange er sand, hvis en forbindelse bruger slangen, kval (valgfri) er kvalitetens lofter fra kvalKopi() (uden kval tegnes alt som altid), kilde (valgfri) er en funktion navn => værdi 0 til 1, som giver et båndsnuværende niveau til placering ved fødsel af levende objekter,  og ur(klods) giver nuværende tid i sekunder på den klods' ur (filen eller lyden).
   T er tilstanden mellem billeder (nyScene()). Klodser (T.blocks) oprettes af den, der kalder. Tegner kun scenen: ingen hjælpe-overlays, ingen DOM. */
function nyScene(){return{dist:0,spawnAcc:0,flash:Array(16).fill(0),parts:[],blocks:[],skyer:[],skyAcc:0,ringe:[],dpPrev:0,dpT:-1e9,ekkoH:[],ekkoT:-1e9,liv:[],livPrev:{},livT:{},livN:0,livGrpT:-1e9,livGrpN:0}}
function tegnScene(g,W,Hh,S){const{E,t,dt,scene,pos,objekter,T}=S,{flash,parts,blocks}=T,{hz,hy,lx,ly,hw,N,sc,TL}=geo(scene,W,Hh);
 const tegnKlods=(l,x,y,s)=>{const o=objekter.find(q=>q.skabelon==='klods');if(!o)return false;tegnObj(g,x,y-s*.35,s*6.5,o,E,W,t,{hue:scene.foelgSpor?scene.farver[l]:null,kv:S.kval});return true};
 const hue=E.farve?(200+(E.fv||0)*160)%360:220;
 g.save();g.translate(W/2,Hh/2);g.scale(1+E.zoom*.08,1+E.zoom*.08);g.translate(-W/2,-Hh/2);
 if(E.ryst>.05)g.translate((Math.random()-.5)*E.ryst*16,(Math.random()-.5)*E.ryst*16);
 g.fillStyle='hsl('+hue+' 45% '+(8+E.farve*10)+'%)';g.fillRect(-30,-30,W+60,Hh+60);
 if(E.glod>.01){const gx=W*pos.glod.x,gy=Hh*pos.glod.y,gr2=Hh*(.5+E.glod*1.9),gr=g.createRadialGradient(gx,gy,0,gx,gy,gr2),h2=Math.round((hue+40)%360);g.globalCompositeOperation='lighter';
  gr.addColorStop(0,'hsla('+h2+',95%,70%,'+Math.min(1,E.glod*1.1).toFixed(3)+')');gr.addColorStop(.45,'hsla('+h2+',90%,55%,'+(E.glod*.45).toFixed(3)+')');gr.addColorStop(1,'hsla('+h2+',90%,50%,0)');g.fillStyle=gr;g.fillRect(-30,-30,W+60,Hh+60);g.globalCompositeOperation='source-over'}
 T.dist+=dt*(.25+E.fart*1.2);
 const vis=scene.bane!==false,klodsSk=N<=8?1:Math.min(1,sc/(.736/(7*.23)));
 if(vis){
 for(let l=0;l<N;l++){flash[l]=Math.max(0,flash[l]-dt*4);g.fillStyle='hsla('+scene.farver[l]+',70%,50%,'+(.1+E.banelys*.35+flash[l]*.45)+')';
  g.beginPath();g.moveTo(lx(l,0)-hw(0),ly(0));g.lineTo(lx(l,0)+hw(0),ly(0));g.lineTo(lx(l,1)+hw(1),ly(1));g.lineTo(lx(l,1)-hw(1),ly(1));g.fill();
  g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=2;g.stroke()}
 g.strokeStyle='rgba(255,255,255,.25)';for(let k=0;k<8;k++){const z=(k/8+T.dist)%1,y=ly(z*z);g.beginPath();g.moveTo(lx(0,z*z)-hw(z*z),y);g.lineTo(lx(N-1,z*z)+hw(z*z),y);g.stroke()}
 if(S.slange){g.lineCap='round';if(!S.kval||S.kval.glod!==false){g.shadowBlur=10;g.shadowColor='rgba(255,255,255,.6)'}
  for(const sd of[-1,1]){let px=0,py=0;for(let i=0;i<=60;i++){const z=i/60,d=(W*.04+W*.19*z)*sc,edge=sd<0?lx(0,z)-hw(z):lx(N-1,z)+hw(z),x=edge+sd*d/2+Math.sin(z*9+t/260+(sd>0?2:0))*(.08+E.slange)*d*.45,y=ly(z);
   if(i){g.strokeStyle='hsl('+((hue+z*60+E.slange_farve*220)%360)+' 90% 60%)';g.lineWidth=Math.max(1.5,d/10);g.beginPath();g.moveTo(px,py);g.lineTo(x,y);g.stroke()}px=x;py=y}}g.shadowBlur=0}
 g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.moveTo(lx(0,TL)-hw(TL),ly(TL));g.lineTo(lx(N-1,TL)+hw(TL),ly(TL));g.stroke();
 }
 for(let i=blocks.length-1;i>=0;i--){const b=blocks[i];if(b.tb!==undefined)b.z=TL-(b.tb+scene.syncMs/1000-S.ur(b))*scene.klodsFart;else b.z+=dt*(scene.klodsFart+E.fart*.7);if(b.z>=TL&&!b.h){b.h=1;flash[b.l]=1}if(b.z>1.05){blocks.splice(i,1);continue}if(b.z<0||!vis)continue;
  const z=b.z,s=(6+z*W*.07)*scene.klodsStr*klodsSk;if(scene.udseende==='objekt'&&tegnKlods(b.l,lx(b.l,z),ly(z),s))continue;g.fillStyle='hsl('+scene.farver[b.l]+' 85% 58%)';g.fillRect(lx(b.l,z)-s*.65,ly(z)-s*.7,s*1.3,s*.7);g.strokeStyle='#fff';g.lineWidth=2;g.strokeRect(lx(b.l,z)-s*.65,ly(z)-s*.7,s*1.3,s*.7)}
 if(E.bolge>0){g.strokeStyle='hsl('+(hue+80)+' 90% 65%)';g.lineWidth=3;g.beginPath();for(let x=0;x<=W;x+=6){const y=Hh*.95+Math.sin(x/38+t/180)*E.bolge*Hh*.05;x?g.lineTo(x,y):g.moveTo(x,y)}g.stroke()}
 if(E.puls>0){g.fillStyle='hsla('+(hue+150)+',95%,70%,'+(.2+E.puls*.5)+')';g.beginPath();g.arc(W*pos.puls.x,Hh*pos.puls.y,Hh*(.06+E.puls*.3),0,7);g.fill()}
 if(E.ring>.02){g.strokeStyle='hsla('+(hue+60)+',95%,75%,'+E.ring+')';g.lineWidth=4;g.beginPath();g.arc(W*pos.ring.x,Hh*pos.ring.y,Hh*(.06+(1-E.ring)*.5),0,7);g.stroke()}
 T.spawnAcc+=E.burst*dt*160;while(T.spawnAcc>1){T.spawnAcc--;const a=Math.random()*6.28,s=80+Math.random()*260;parts.push({x:W*pos.burst.x,y:Hh*pos.burst.y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:1})}
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.x+=p.vx*dt;p.y+=p.vy*dt;p.l-=dt*1.4;if(p.l<=0){parts.splice(i,1);continue}g.fillStyle='hsla('+(hue+30)+',95%,75%,'+p.l+')';g.fillRect(p.x,p.y,4,4)}
 tegnSky(g,W,Hh,S,hue);tegnDaempring(g,W,Hh,S,hue);tegnEkko(g,W,Hh,S);
 stepObjekter(objekter,dt,E);tegnObjekter(g,W,Hh,objekter,E,t,S.kval,S.figVaegt||S.paletGrader?{vaegt:S.figVaegt,hue:S.paletGrader}:undefined);tegnLiv(g,W,Hh,S);tegnUsikker(g,W,Hh,S);g.restore();if(E.strobe>.02){g.fillStyle='rgba(255,255,255,'+E.strobe*.4+')';g.fillRect(0,0,W,Hh)}}
/* ---- Klodsernes oprettelse (trin 7c). Flyttet fra editoren; samme regler som før. ----
   Live: en klods oprettes ved slaget (kant) og rejser derefter. Kig frem: klodsen oprettes en rejsetid FØR slaget og placeres efter uret (se tegnScene).
   KD er hukommelsen (nyKlodser()), blocks er T.blocks fra nyScene(). */
function nyKlodser(){return{kh:[],khSrc:null,khLast:0,lastSp:[]}}
const erKlodsMaal=m=>/^klods\d+$/.test(m.effect);
function klodsLive(KD,blocks,m,i,t,spor){if(t-(KD.lastSp[i]||0)>(m.gap??120)){KD.lastSp[i]=t;const kl=+m.effect.slice(5)-1;if(kl<spor)blocks.push({l:kl,z:0})}}
function fjernFremad(blocks){for(let i=blocks.length-1;i>=0;i--)if(blocks[i].tb!==undefined)blocks.splice(i,1)}
/* o: {src:'fil'|'gen'|null, clk (sekunder på kildens ur), scene, maps, master, fileVer, dtf (sekunder pr. analyseramme),
       off:(m,i)=>slået fra?, band:(navn)=>analysearray|null, plan:[{k,T,s}] (generatorens plan), genHar:(band)=>har bandet et slagmønster?, genSlag:(band,p)=>er der slag i trinnet p?} */
function klodsFremad(KD,blocks,o){const{src,clk,scene,maps}=o,kh=KD.kh;
 const khFor=(i,m)=>{const off=o.off(m,i),sig=[m.band,m.thr,m.gain,m.att,m.rel,m.curve??1,m.gap??120,m.inv?1:0,off?1:0,o.master,o.fileVer].join('|');let c=kh[i];
  if(!c||c.sig!==sig)c=kh[i]={sig,ev:KD.khSrc==='fil'?slagtider(m,o.band(m.band),o.dtf,o.master,off):[],ptr:null,gk:c?c.gk:-1};return c};
 if(src!==KD.khSrc){fjernFremad(blocks);kh.length=0;KD.khSrc=src;KD.khLast=0}if(!src)return;
 const travel=scene.trefferlinje/scene.klodsFart,sync=scene.syncMs/1000;
 if(src==='fil'){if(clk<KD.khLast-.05||clk>KD.khLast+.6){fjernFremad(blocks);kh.forEach(c=>{if(c)c.ptr=null})}KD.khLast=clk}
 maps.forEach((m,i)=>{if(!erKlodsMaal(m))return;const l=+m.effect.slice(5)-1;if(l>=scene.spor)return;const off=o.off(m,i);
  if(src==='fil'){const c=khFor(i,m);if(c.ptr===null){let q=0;while(q<c.ev.length&&c.ev[q]+sync<clk)q++;c.ptr=q}
   while(c.ptr<c.ev.length&&c.ev[c.ptr]+sync-travel<=clk){blocks.push({l,tb:c.ev[c.ptr],src:'fil',z:-1});c.ptr++}}
  else if(o.genHar(m.band)){const c=khFor(i,m);
   for(const p of o.plan){if(p.k<=c.gk)continue;if(p.T+sync-travel>clk)break;c.gk=p.k;if(!off&&p.T+sync>=clk-.05&&o.genSlag(m.band,p))blocks.push({l,tb:p.T,src:'gen',z:-1})}}})}

function trinMaal(m,v,master){const vv=m.inv?1-v:v;return Math.pow(Math.max(0,(vv-m.thr)/(1-m.thr+1e-6)),m.curve??1)*m.gain*master} function trin(m,v,dt,env,master,off){const x=off?0:trinMaal(m,v,master),tc=(x>env?m.att:m.rel)/1000;return env+(x-env)*(1-Math.exp(-dt/Math.max(tc,.001)))}
/* Kører alle forbindelser. o: { v:(m,i)=>båndværdi, off:(m,i)=>slået fra?, master, dt, env:[], pe:[], E:{}, kant:(m,i,cur,kantNu)=>{} }
   o.vaegt (valgfri): (m,i)=>tal, der ganges på forbindelsens gain (bruges af showets sektioner). Skriver envelope i o.env, forrige i o.pe og effektværdier (den kraftigste pr. mål) i o.E. kant kaldes for hver forbindelse; kantNu er sand, når envelope krydser 0,35 opad. */
function koer(maps,o){maps.forEach((m,i)=>{/* HOLD og PORT (kun her, ikke i trin, så klodser og slagtider er uændrede, og ikke på klods-spor). Hold (m.hold): niveauet bliver stående, når lyden går under tærsklen (eller porten er lukket), til næste lyd kommer og sætter et nyt niveau (højere eller lavere); en forbindelse, der er slået fra (m.off eller solo), klinger stadig af; o.holdRyd sætter alle hold-niveauer til 0. Port (m.port, en kilde; m.portT, grænsen, standard 0,5): forbindelsen virker kun, når portens kilde er mindst grænsen; ellers ignoreres dens indgang (den klinger af som slået fra, eller holder niveauet, hvis den har Hold). En kilde, der ikke er et tal, lukker porten. */ const v=o.v(m,i),w=o.vaegt?o.vaegt(m,i):1,kl=/^klods\d+$/.test(m.effect),muted=o.off(m,i);let gated=false;if(m.port&&!kl){const g=o.v({...m,band:m.port},i);gated=!(g>=(m.portT==null?.5:m.portT))}let e0=o.env[i]||0;const hold=m.hold&&!kl;if(hold&&o.holdRyd)e0=0;const mm=o.thrFn?o.thrFn(m,i,v):m;let e1=trin(mm,v,o.dt,e0,o.master*w,muted||gated);if(hold&&!muted&&(gated||!(trinMaal(mm,v,o.master*w)>0)))e1=e0;o.env[i]=e1;const cur=Math.min(1,o.env[i]);o.E[m.effect]=Math.max(o.E[m.effect]||0,cur);if(m.effect==='farve')o.E.fv=v;o.kant(m,i,cur,cur>.35&&(o.pe[i]||0)<=.35);o.pe[i]=cur})}
/* Tidspunkter (sekunder) for en forbindelses slag over et helt, analyseret bånd a (værdier 0 til 1, én pr. analyseramme af længden dtf sekunder). Tiden er rammens midte. */
function slagtider(m,a,dtf,master,off){if(!a)return[];let env=0,prev=0,last=-1e9;const ev=[];
 for(let k=0;k<a.length;k++){env=trin(m,a[k],dtf,env,master,off);const cur=Math.min(1,env),tms=(k+1)*dtf*1000;
  if(cur>.35&&prev<=.35&&tms-last>(m.gap??120)){last=tms;ev.push(tms/1000)}prev=cur}return ev}

/* ---------- Lyd: stemmer ---------- */
function lydNoise(c){if(lydNz&&lydNzCtx===c)return lydNz;const b=c.createBuffer(1,c.sampleRate,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;lydNz=b;lydNzCtx=c;return b}
const lydHz=(trin,okt,rod,skala)=>mtof(60+rod+okt*12+SKALAER[skala][Math.max(0,Math.min(7,trin-1))]);
function suusVoice(c,g,t,S,o,out,tn){const v=S.variant;if(v==='ingen')return;
 const pop=tb=>{const q=c.createOscillator(),pg=c.createGain();q.type='sine';q.frequency.setValueAtTime(180,tb);q.frequency.exponentialRampToValueAtTime(70,tb+.08);pg.gain.setValueAtTime(S.vol*.6,tb);pg.gain.exponentialRampToValueAtTime(.001,tb+.1);q.connect(pg);pg.connect(out);q.start(tb);q.stop(tb+.12)};
 if(v==='forvarsel'&&o.live){pop(t);return}
 const hi=S.stem?2*mtof(72+tn.rod):2000,lo=hi/4,sr2=c.createBufferSource(),f=c.createBiquadFilter();sr2.buffer=lydNoise(c);sr2.loop=true;f.type='bandpass';f.Q.value=5;sr2.connect(f);f.connect(g);
 const sw=(a,b,t0,t1)=>{f.frequency.setValueAtTime(a,t0);f.frequency.exponentialRampToValueAtTime(b,t1)};
 if(v==='skud'){sw(hi*1.5,lo,t,t+.22);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(S.vol,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+.22);sr2.start(t);sr2.stop(t+.25)}
 else if(v==='forvarsel'){const tb=t+S.laengde;sw(lo,hi,t,tb);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(S.vol*.8,tb);g.gain.linearRampToValueAtTime(.0001,tb+.03);sr2.start(t);sr2.stop(tb+.05);pop(tb)}
 else if(v==='forbi'){sw(hi,lo,t,t+.5);g.gain.setValueAtTime(S.vol*.6,t);g.gain.exponentialRampToValueAtTime(.001,t+.5);sr2.start(t);sr2.stop(t+.55)}}
function lydVoice(c,out,id,t,S,o,tn){const g=c.createGain();g.connect(out);
 if(id==='klik'){const sr2=c.createBufferSource(),f=c.createBiquadFilter();sr2.buffer=lydNoise(c);f.type='highpass';f.frequency.value=3000;sr2.connect(f);f.connect(g);g.gain.setValueAtTime(S.vol,t);g.gain.exponentialRampToValueAtTime(.001,t+.012);sr2.start(t);sr2.stop(t+.02)}
 else if(id==='tone'){const q=c.createOscillator(),L=S.laengde/1000;q.type=S.boelge;q.frequency.setValueAtTime(lydHz(S.trin,S.okt,tn.rod,tn.skala),t);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(S.vol,t+.005);g.gain.exponentialRampToValueAtTime(.001,t+L);q.connect(g);q.start(t);q.stop(t+L+.02)}
 else if(id==='suus')suusVoice(c,g,t,S,o,out,tn)}

/* Taktfølger i realtid. Får en slagstyrke (0 til 1) med en tid i sekunder og gætter tempoet (slag i minuttet) og hvor i et slag man er (fase 0 til 1). Slagstyrken lægges i en ring med faste trin (50 pr. sekund, de seneste 8 sekunder). Hvert halve sekund laves en autokorrelation over slagstyrken for tempoer fra 60 til 180, vægtet svagt mod omkring 120 (så et halvt eller dobbelt tempo sjældnere vinder); toppen finpudses (parabel) og glattes, og et nyt tempo skal gentages to gange, før det overtager. Fasen findes ved at lægge en kam med tempoets afstand ned over de seneste slag og vælge den placering, der rammer flest. Alt er rene tal uden DOM, så det kan testes. */
function taktNy(opt){
 opt=opt||{};const fs=opt.fs||50,sek=opt.vindue||8,N=Math.round(fs*sek),minB=opt.minBpm||60,maxB=opt.maxBpm||180,lagMin=Math.max(2,Math.floor(fs*60/maxB)),lagMax=Math.min(N>>1,Math.ceil(fs*60/minB)),hvert=opt.hvert||.5,minSek=opt.minSek||3,
 ring=new Float32Array(N),x=new Float32Array(N),r=new Float32Array(lagMax+2);
 let mult=1,step=-1,start=-1,sidstEst=-1e9,bpm=0,sik=0,t0=0,kand=0,kandAntal=0,laveSik=0,sidstStyrke=-1e9;
 const prior=b=>{const q=Math.log2(b/(opt.praef||120));return .6+.4*Math.exp(-q*q/(2*.6*.6))};
 function oktav(m){mult=(m===.5||m===2)?m:1}
 function nulstil(){ring.fill(0);step=-1;start=-1;sidstEst=-1e9;bpm=0;sik=0;t0=0;kand=0;kandAntal=0;laveSik=0;sidstStyrke=-1e9}
 function skriv(t,v){const s=Math.floor(t*fs);if(step<0){step=s;start=s;ring.fill(0)}
  if(s<step-N+1)return;
  if(s>step){if(s-step>=N)ring.fill(0);else for(let i=step+1;i<=s;i++)ring[((i%N)+N)%N]=0;step=s}
  const ix=((s%N)+N)%N;if(v>ring[ix])ring[ix]=v}
 function estimer(t){
  const n=Math.min(N,step-start+1);if(n<minSek*fs)return;
  let sum=0;for(let j=0;j<n;j++){const v=ring[(((step-n+1+j)%N)+N)%N];x[j]=v;sum+=v}
  const mid=sum/n;let e=0;for(let j=0;j<n;j++){const v=x[j]-mid;x[j]=v;e+=v*v}
  if(e<1e-6*n){laveSik++;sik=0;if(laveSik>8)bpm=0;return}
  let r0=0;for(let j=0;j<n;j++)r0+=x[j]*x[j];r0/=n;
  let bedst=-1,bs=-1;
  for(let l=lagMin;l<=lagMax&&l<n-4;l++){let q=0;for(let j=l;j<n;j++)q+=x[j]*x[j-l];q/=(n-l);r[l]=q;const s=q*prior(60*fs/l);if(s>bs){bs=s;bedst=l}}
  if(bedst<0)return;
  if(bedst*.5>=lagMin&&60*fs/(bedst*.5)<=(opt.dobbeltMax||175)){const h=Math.round(bedst*.5);let hq=0;for(let q=h-1;q<=h+1;q++){if(q>=lagMin&&q<=lagMax&&r[q]>hq)hq=r[q]}if(hq>=(opt.dobbeltTaerskel||.9)*r[bedst])bedst=h}
  let l=bedst;const a=r[l-1]||0,b=r[l],c=r[l+1]||0,den=a-2*b+c;let off=0;if(den<-1e-12)off=.5*(a-c)/den;if(off>1)off=1;if(off<-1)off=-1;
  const lag=l+off,nyBpm=60*fs/lag,rho=Math.max(0,Math.min(1,r[l]/(r0||1)));
  if(rho<(opt.minSik||.25)){laveSik++;sik=rho;if(laveSik>8)bpm=0;return}
  laveSik=0;sik=rho;
  if(!bpm){if(kand&&Math.abs(nyBpm/kand-1)<.04){kandAntal++}else{kand=nyBpm;kandAntal=1}if(kandAntal>=2){bpm=nyBpm;kand=0;kandAntal=0}else return}
  else if(Math.abs(nyBpm/bpm-1)<.04){bpm=.6*bpm+.4*nyBpm;kand=0;kandAntal=0}
  else{if(kand&&Math.abs(nyBpm/kand-1)<.04){kandAntal++}else{kand=nyBpm;kandAntal=1}if(kandAntal>=2){bpm=nyBpm;kand=0;kandAntal=0}else return}
  /* fase: kam med tempoets afstand over de seneste slag */
  const P=60*fs/bpm,m=Math.min(n,Math.floor(P*Math.floor(n/P)));let bf=0,bsc=-1;
  for(let f=0;f<P;f+=.5){let sc=0;for(let k=0;;k++){const idx=n-1-Math.round(f+k*P);if(idx<0||k*P>=m)break;sc+=x[idx]}if(sc>bsc){bsc=sc;bf=f}}
  const sidsteSlag=(step-bf)/fs;let ny=sidsteSlag;const per=60/bpm;
  if(t0){const d=ny-t0,tal=Math.round(d/per);ny=ny-tal*per;ny=t0+.5*(ny-t0)+tal*0}else{}
  t0=ny;sidstEst=t}
 function fod(t,v){skriv(t,Math.max(0,Math.min(1,+v||0)));if(t-sidstEst>=hvert){sidstEst=t-1e-9+0;estimer(t);sidstEst=t}}
 function tilstand(t){if(!bpm)return{bpm:0,grundBpm:0,oktav:mult,sikkerhed:sik,fase:0,slag:0};const b=bpm*mult,per=60/b,u=(t-t0)/per;return{bpm:b,grundBpm:bpm,oktav:mult,sikkerhed:sik,fase:u-Math.floor(u),slag:Math.floor(u)}}
 return{fod,tilstand,nulstil,oktav,get bpm(){return bpm*mult}}}

return{VERSION,TAU,SKALAER,mtof,SCENE0,sceneKopi,geo,nyScene,tegnScene,rot3,FORM3D,fjernSignaler,LIV0,livKopi,livTilstand,luminans,blinkNy,blinkTik,blinkBegraens,makeFFT,anaNy,anaRamme,anaTom,ANA_KILDER,LS_FC,TONE_NAVNE,toneNy,toneTik,toneListe,onsetStyrke,tempoSkoen,taktslag,taktFase,taktKilder,toneart,opbygning,noder,d3Vindue,d3Farve,d3Projekter,d3Bygning,D3_FORSVIND,SHOW_ROLLER,SHOW_TYPER,showKopi,vaegteKopi,figurerKopi,paletKopi,SHOW_FIGUR0,SHOW_PALET0,showFigurVaegt,showPalet,showVaegt,tempoFaktor,tapTempo,snapTempo,foersteSlag,aktivitet,indstilTaerskel,KK_DUR,KK_MOL,trin,KVAL_FULD,KVAL_NIVEAUER,KVAL_TEKST,kvalKopi,kvalTrin,regNy,regTik,maaleScener,maaleStat,maaleVurdering,maaleAnbefal,maaleRapport,E_NUL,nyKlodser,klodsLive,klodsFremad,fjernFremad,LYD0,lydKopi,PROPS,FORMER,FAELLES,propsFor,uiProps,tidOf,nyEgenskaber,nyObjekt,sikrEgenskaber,MS_FRA,MS_TIL,MS_MAP,nyMorgenstjerne,migrerMS,migrer,vaerdi,spin,stepObjekter,rundPoly,formSti,TEKSTURER,tegnTekstur,tegnObj,tegnObjekter,koer,slagtider,lydNoise,lydHz,suusVoice,lydVoice,taktNy,normToppe,artikulationNy,artikulationTik,artikulationSerie,dominansNy,dominansTik,dominansSerie,karakterNy,karakterTik,karakterSerie,ANA_AFLEDT,FOELSOM_GRUPPER,foelsomNy,foelsomFaktor,eqNy,eqIndstilling,renseObjekter,rydTilstand,stereoRamme,cacheGyldig,trinMaal,tegnDanser,DANS_ST,DANS_PROPS,DANS_KAT,DANS_SWING,tegnDiskokugle,DISKO_ST,DISKO_PROPS,DISKO_KAT,DISKO_SWING,SAERLIGE_FORMER,SAERLIGE_PROPS};
})();
if(typeof module!=='undefined'&&module.exports)module.exports=Rytme;
