/* ========== v5.9: TAKT I REALTID SOM KILDE OG HÆNDELSE ==========
   Programmet har en taktfølger til live lyd (TAKT = Rytme.taktNy(), fodret hvert billede af taktTik med kick og flux), som indtil nu kun styrede lampen ved Lyd ind. Nu bliver den til kilder og hændelser, så takten virker med mikrofon, fanelyd og generator, ligesom med lydfiler:
   et nyt slag er, når taktfasen springer fra høj til lav (fasen er 0 på slaget). Takten (første slag) er den af de fire pladser, hvor kick i gennemsnit er stærkest. Giver la['ana:taktslag'] (kort blink), la['ana:takt'] (blink på første slag) og la['ana:taktfase'] (0 til 1 mellem slagene) samt hændelserne taktslag, hvert 2. slag, hver takt og hver 2. takt. Er følgeren usikker (intet tempo), er alt 0. */
const LBT={i:0,gPrev:0,tSlag:-1e9,nye:[],ned:0,posK:[0,0,0,0],P:0,bpm:0,ref:0,refT:0,mult:1,uenigT:0};
/* oktav-hukommelse: har tempoet været stabilt i 4 s (ref), og springer følgeren til det halve eller dobbelte, holdes det gamle tempo (mult 2 eller 0,5), og slagene imellem slås ud fra fasen. Står det nye tempo i over 6 s, accepteres det som et rigtigt temposkift. */
function lbtTik(){const nu=performance.now()/1000,s=TAKT.tilstand(nu),kick=+(lv.kick||0)||0;
 if(!TK.live||!s.bpm){la['ana:taktslag']=0;la['ana:takt']=0;la['ana:taktfase']=0;LBT.gPrev=0;LBT.bpm=0;LBT.ref=0;LBT.mult=1;return}
 const b=s.bpm,r=LBT.ref?b/LBT.ref:1;
 if(!LBT.ref){LBT.ref=b;LBT.refT=nu;LBT.mult=1}
 else if(Math.abs(r-1)<.08){LBT.mult=1;LBT.uenigT=0;LBT.ref=LBT.ref*.9+b*.1}
 else if(Math.abs(r-.5)<.05||Math.abs(r-2)<.2){if(!LBT.uenigT)LBT.uenigT=nu;if(nu-LBT.refT>4&&nu-LBT.uenigT<6)LBT.mult=r<1?2:.5;else{LBT.ref=b;LBT.refT=nu;LBT.mult=1;LBT.uenigT=0}}
 else{LBT.ref=b;LBT.refT=nu;LBT.mult=1;LBT.uenigT=0}
 LBT.bpm=b*LBT.mult;LBT.P=60/LBT.bpm;const f=Math.max(0,Math.min(1,+s.fase||0)),g=LBT.mult===2?(f*2)%1:f;
 let slag=g<LBT.gPrev-.5&&nu-LBT.tSlag>LBT.P*.5;if(slag&&LBT.mult===.5){LBT.halv=!LBT.halv;if(LBT.halv)slag=false}
 if(slag){LBT.i++;LBT.nye.push(LBT.i);LBT.tSlag=nu;const pos=LBT.i%4;LBT.posK[pos]=LBT.posK[pos]*.85+kick*.15;LBT.ned=LBT.posK.indexOf(Math.max(...LBT.posK))}
 LBT.gPrev=g;const siden=nu-LBT.tSlag,ok=siden<2*LBT.P;la['ana:taktslag']=ok?Math.exp(-siden/.1):0;la['ana:takt']=ok&&((LBT.i-LBT.ned)%4+4)%4===0?Math.exp(-siden/.12):0;la['ana:taktfase']=ok?Math.min(1,siden/LBT.P):0}
/* ========== SLUT: TAKT I REALTID ========== */


