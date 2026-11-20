/* ========== v9.68: ANALYSENS FREMGANG OG ANNULLÉR ==========
   Brugerens ønske 17. november: en sang på 74 minutter tog 10 minutter at analysere, og der var kun en procent i statuslinjen.
   Feltet #ana-prog (midt øverst) viser trinnet (1 af 2: lydtræk · 2 af 2: toner og klang), en bjælke for hele analysen, tiden, der er gået,
   et skøn over resten, og knappen Annullér. analyze og analyzeAna kalder anaFrem(trin, andel) og standser, når ANA.stop er sat (fejlen ANA_STOP).
   Trin 1 regnes som 19 % af arbejdet (målt: 22 s mod 96 s). anaPause bruger en MessageChannel, så analysen ikke bremses, når fanen er i baggrunden. */
const ANA={stop:false,t0:0,sidst:0,pct:0,trin:0,DEL1:.19};
const anaPause=()=>new Promise(r=>{try{const c=new MessageChannel();c.port1.onmessage=()=>{c.port1.close();r()};c.port2.postMessage(0)}catch(e){setTimeout(r)}});
const anaTid=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};
function anaFelt(){let d=$('ana-prog');if(d)return d;d=document.createElement('div');d.id='ana-prog';d.className='ana-prog';d.hidden=true;d.setAttribute('role','status');d.setAttribute('aria-live','polite');
 d.innerHTML='<b class="ana-t">Analyserer sangen</b><span class="ana-trin"></span><div class="ana-bj" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-label="Analysens fremgang"><i></i></div><span class="ana-tal"></span><button id="ana-stop" title="Stop analysen">Annullér</button>';
 document.body.appendChild(d);d.querySelector('#ana-stop').onclick=()=>{ANA.stop=true;d.querySelector('.ana-trin').textContent='Annullerer …'};return d}
function anaFrem(trin,andel){const nu=performance.now(),d=anaFelt();if(!ANA.t0||nu-ANA.sidst>6000){ANA.t0=nu;ANA.stop=false}d.hidden=false;ANA.sidst=nu;ANA.trin=trin;
 const p=Math.max(0,Math.min(1,trin===1?andel*ANA.DEL1:ANA.DEL1+andel*(1-ANA.DEL1)));ANA.pct=p;const gaaet=(nu-ANA.t0)/1000,rest=p>.02?gaaet*(1-p)/p:NaN;
 if(!ANA.stop)d.querySelector('.ana-trin').textContent=trin===1?'Trin 1 af 2: lydtræk (bas, slag, styrke) · '+Math.round(andel*100)+' %':'Trin 2 af 2: toner og klang ('+atDeleTekst()+') · '+Math.round(andel*100)+' %';
 d.querySelector('.ana-bj i').style.width=(p*100).toFixed(1)+'%';d.querySelector('.ana-bj').setAttribute('aria-valuenow',Math.round(p*100));
 d.querySelector('.ana-tal').textContent=Math.round(p*100)+' % af hele analysen · gået '+anaTid(gaaet)+(Number.isFinite(rest)&&gaaet>3?' · cirka '+anaTid(rest)+' tilbage':'')}
function anaSkjul(){const d=$('ana-prog');if(d)d.hidden=true;ANA.stop=false;ANA.t0=0}
setInterval(()=>{const d=$('ana-prog');if(d&&!d.hidden&&performance.now()-ANA.sidst>2500)anaSkjul()},500);
addEventListener('unhandledrejection',e=>{if(e&&e.reason&&e.reason.message==='ANA_STOP'){e.preventDefault();anaSkjul();try{$('status').textContent='Analysen blev annulleret.'}catch(x){}}});
/* ========== SLUT: ANALYSENS FREMGANG OG ANNULLÉR ========== */

