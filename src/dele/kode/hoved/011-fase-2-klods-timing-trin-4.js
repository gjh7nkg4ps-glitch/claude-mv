/* ========== FASE 2: KLODS-TIMING (trin 4) ========== */
/* Før blev klodsen oprettet, da slaget lød, og ankom en rejsetid (cirka 1,4 s) senere. Nu kigger programmet frem: for en fil kendes alle slag på forhånd, og generatoren kender sit mønster. Så oprettes klodsen en rejsetid FØR slaget og ankommer til trefferlinjen på slaget. Uden fremtid (kun tastatur) er klodsen live som før.
   Klodsens position regnes af lydens ur, ikke af billedernes: z = trefferlinje - (slagtid + synk - ur) * klodsfart. Så følger den lyden, også ved pauser, spring og tabte billeder. Banens fart påvirker derfor kun stribernes fart, ikke klodser med kig frem. */
const lydHz=(trin,okt)=>Rytme.lydHz(trin,okt,gs.root,gs.scale);
function lydVoice(c,id,t,S,o){Rytme.lydVoice(c,lm,id,t,S,o,{rod:gs.root,skala:gs.scale})}
const GEN_BAND={kick:[0],snare:[1,2],hihat:[3,4],bas:[0,6]};
let fileVer=0;const KD=Rytme.nyKlodser(),kh=KD.kh;
function planAhead(until){while(gPlanNext<until){gPlan.push({k:gPlanK++,s:gPlanStep,T:gPlanNext});gPlanStep=(gPlanStep+1)%gs.steps;gPlanNext+=60/bpm/4}}
function timingSrc(){if(scene.timing!=='auto')return null;
 if(playing&&buf&&F)return'fil';
 if(gPlaying&&gctx&&typeof gctx.currentTime==='number'&&gPlan.length)return'gen';
 if(buf&&F&&offset>0&&!gPlaying)return'fil';return null}
const erKlods=m=>/^klods\d+$/.test(m.effect);
/* Slagtider for en forbindelse til en klods: samme kæde som i Mapping (tærskel, kurve, gain, glidning, kant ved 0,35, pause), regnet over hele sangen. Tiden er rammens midte. */
function klodsHaendelser(m,i){const a=F&&F[m.band];if(!a)return[];return Rytme.slagtider(m,a,H/sr,gmaster,m.off||(soloOn&&i!==meshSel))}
/* Kurve til en forbindelses kilde, når klodserne planlægges ud fra en fil: de 14 lydtræk ligger i F, analysekilderne (toner, klang, rytme, artikulation) i A. Før blev kun F slået op, så baner med en tone som kilde (de sidste i 16-spors-skabelonen) aldrig fik klodser, når en fil blev spillet. */ function klodsBand(b){return(F&&F[b])||(A&&A[b])||undefined} function klodsFremad(src){const clk=!src?0:src==='fil'?now():gctx.currentTime;
 if(src==='gen')while(gPlan.length&&gPlan[0].T<clk-3&&gPlan[0].k<gPlayK)gPlan.shift();
 Rytme.klodsFremad(KD,blocks,{src,clk,scene,maps,master:gmaster,fileVer,dtf:H/sr,off:(m,i)=>m.off||(typeof neLtFraF==='function'&&neLtFraF(m))||(typeof neFraF==='function'&&neFraF(m))||(soloOn&&i!==meshSel),band:klodsBand,plan:gPlan,genHar:b=>!!GEN_BAND[b],genSlag:(b,p)=>GEN_BAND[b].some(r=>pat[r][p.s]&&!mute[r])})}
function timingTekst(){const src=timingSrc();
 if(scene.timing!=='auto')return'Klods-timing: live (som v1). Klodsen oprettes ved slaget og rammer trefferlinjen en rejsetid (cirka '+(scene.trefferlinje/scene.klodsFart).toFixed(1)+' s) senere.';
 if(src==='fil')return'Klods-timing nu: fil, kigger frem. Klodsen rammer trefferlinjen på slaget.';
 if(src==='gen')return'Klods-timing nu: generator, kigger frem efter mønsteret. Lydtræk uden slagmønster (fx centroid) er stadig live.';
 return live?'Klods-timing nu: live (kun tastatur, ingen fremtid). Klodsen rammer en rejsetid efter lyden.':'Klods-timing: auto. Afspil en fil eller generatoren for at se klodser, der rammer på slaget.'}
function stimOpdat(){const e=$('stim');if(!e)return;const t=timingTekst();if(e.textContent!==t)e.textContent=t}
function timingRapport(){let o='';['kick','snare'].forEach(k=>{if(!marks[k].length)return;const i=maps.findIndex(m=>m.band===k&&erKlods(m));if(i<0)return;const ev=klodsHaendelser(maps[i],i),d=[];
  marks[k].forEach(t=>{let b=null;ev.forEach(e=>{if(b===null||Math.abs(e-t)<Math.abs(b-t))b=e});if(b!==null&&Math.abs(b-t)<.25)d.push((b-t)*1000)});if(d.length<3)return;
  const mean=d.reduce((a,b)=>a+b,0)/d.length,sd=Math.sqrt(d.reduce((a,b)=>a+(b-mean)*(b-mean),0)/d.length);
  o+=`<p><b>${k}-klodser:</b> klodsen ankommer i gennemsnit ${Math.round(Math.abs(mean))} ms ${mean<0?'før':'efter'} dine tryk, med en spredning på ${Math.round(sd)} ms (${d.length} slag). Dine tryk er omtrentlige (cirka 30 til 50 ms) og lidt forsinkede, så gennemsnittet siger ikke noget om synk. Spredningen viser, hvor jævnt klodserne rammer.</p>`});return o}
/* ========== SLUT: KLODS-TIMING (trin 4) ========== */

