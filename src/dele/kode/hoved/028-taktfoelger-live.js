/* ========== TAKTFØLGER (live) ========== */
/* Forarbejde til en live-indgang med taktfølger: hvert billede i live-tilstand (Lyd ind, generatoren eller tastaturet) får taktfølgeren en slagstyrke (60 procent kick og 40 procent flux), og den gætter tempoet og, hvor man er i et slag. Her vises resultatet (tempo, sikkerhed, en lampe, der blinker på slaget) med knapperne ÷2 og ×2 til oktavfejl. Det bruges endnu ikke til at styre figurer, klodser eller Show; næste skridt er at gøre taktfasen til et lydtræk. */
const TAKT=Rytme.taktNy(),TK={live:false,lampe:false,okt:1};
function taktTekst(){const s=TAKT.tilstand(performance.now()/1000);if(!TK.live)return'Tempo: ingen live-lyd (tænd Lyd ind eller generatoren)';if(!s.bpm)return'Tempo: lytter … (der skal være et par sekunder med tydelige slag)';return'Tempo: '+Math.round(s.bpm)+' slag i minuttet, sikkerhed '+Math.round(s.sikkerhed*100)+' %'+(TK.okt===.5?' (halveret)':TK.okt===2?' (fordoblet)':'')}
function taktLampe(l){if(l===TK.lampe)return;TK.lampe=l;const b=$('lin-btn'),q=$('lin-lampe');if(b)b.classList.toggle('takt-slag',l);if(q)q.classList.toggle('slag',l)}
function taktTik(live,tSek){if(live){TK.live=true;TAKT.fod(tSek,Math.min(1,Math.max(0,(lv.kick||0)*.5+(lv.snare||0)*.4+(lv.flux||0)*.3)));/* v5.9: snaren med, så bagslaget på 2 og 4 tæller, og et rock-mønster (kick på 1 og 3) ikke halverer tempoet */const s=TAKT.tilstand(tSek);taktLampe(s.bpm>0&&s.fase<.15)}
 else if(TK.live){TK.live=false;TAKT.nulstil();taktLampe(false);taktUI()}}
function taktUI(){const t=$('lin-takt');if(t)t.textContent=taktTekst();const b=$('lin-btn');if(b&&LIN.til){const s=TAKT.tilstand(performance.now()/1000);b.textContent='Lyd ind: '+(LIN.mode==='fane'?'Fanelyd':'Mikrofon')+(TK.live&&s.bpm?' · '+Math.round(s.bpm)+' BPM':'')}
 ['halv','dobbelt'].forEach(n=>{const k=$('takt-'+n);if(k)k.setAttribute('aria-pressed',TK.okt===(n==='halv'?.5:2)?'true':'false')})}
function taktOktav(m){TK.okt=TK.okt===m?1:m;TAKT.oktav(TK.okt);taktUI();msg(TK.okt===1?'Taktfølgeren: tempoet er som fundet.':'Taktfølgeren: tempoet er '+(TK.okt===.5?'halveret':'fordoblet')+'. Tryk igen for at gå tilbage.')}
$('takt-halv').onclick=()=>taktOktav(.5);$('takt-dobbelt').onclick=()=>taktOktav(2);
setInterval(taktUI,250);taktUI();
/* ========== SLUT: TAKTFØLGER ========== */

