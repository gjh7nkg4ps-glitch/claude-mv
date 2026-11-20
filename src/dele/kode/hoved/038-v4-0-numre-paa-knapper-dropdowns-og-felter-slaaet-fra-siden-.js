/* ========== v4.0: NUMRE PÅ KNAPPER, DROPDOWNS OG FELTER (slået fra siden v9.71) ========== */
/* Hvert vindue nummererer sine knapper (K), dropdown-menuer (V for valg) og felter (F: skydere, afkrydsning, tekst og tal) i den rækkefølge, de står: W5:K7 er syvende knap i W5, W5:V2 anden dropdown. Topbaren og dens menuer hedder T. Numrene lægges i et lag oven på siden (de skubber ikke til noget) og vises kun for det, der kan ses. Listen regnes igen hvert 1,5 sekund, så nye rækker (fx en ny forbindelse i Mapping) får numre. Nye knapper kan få numrene efter dem til at skifte. */
const NRK={til:false,liste:[],lag:null,pulje:[],t:0,byg:0};
function nrkByg(){const L=[],kode=(rod,pre)=>{const c={K:0,V:0,F:0};rod.querySelectorAll('button,select,input,textarea').forEach(el=>{if(el.type==='hidden'||el.closest('.wmini')||el.closest('#nrk-lag'))return;const t=el.tagName==='BUTTON'?'K':el.tagName==='SELECT'?'V':'F';L.push([el,pre+':'+t+(++c[t])])})};
 const tb=$('tb');if(tb)kode(tb,'T');[...document.querySelectorAll('.win')].sort((a,b)=>+a.id.slice(1)-+b.id.slice(1)).forEach(w=>kode(w,'W'+w.id.slice(1)));NRK.liste=L;L.forEach(([el,k])=>el.dataset.nrk=k)}
function nrkTegn(){if(!NRK.til)return;const nu=performance.now();if(nu-NRK.byg>1500){NRK.byg=nu;nrkByg()}if(nu-NRK.t<250)return;NRK.t=nu;
 let n=0;const H=innerHeight,W=innerWidth;NRK.liste.forEach(([el,k])=>{const r=el.getBoundingClientRect();if(!r.width||!r.height||r.bottom<0||r.top>H||r.right<0||r.left>W)return;const wb=el.closest('.wb,.menup,.dock .win');if(wb){const q=wb.getBoundingClientRect();if(r.top<q.top-2||r.top>q.bottom||r.left>q.right||r.right<q.left)return}if(el.offsetParent===null&&getComputedStyle(el).position!=='fixed')return;
  let b=NRK.pulje[n];if(!b){b=document.createElement('span');b.className='nrk';NRK.lag.appendChild(b);NRK.pulje.push(b)}b.textContent=k;b.style.left=Math.max(0,Math.round(r.left-3))+'px';b.style.top=Math.max(0,Math.round(r.top-9))+'px';b.style.display='';b.dataset.t=k.split(':')[1].charAt(0);n++});
 for(let i=n;i<NRK.pulje.length;i++)NRK.pulje[i].style.display='none'}
function nrkVis(til,gem){NRK.til=til;$('numre-kn').checked=til;if(!NRK.lag){NRK.lag=document.createElement('div');NRK.lag.id='nrk-lag';NRK.lag.setAttribute('aria-hidden','true');document.body.appendChild(NRK.lag)}NRK.lag.hidden=!til;if(til){NRK.byg=0;NRK.t=0;nrkTegn()}if(gem)try{lsGem('rytme-numre-kn',til?'1':'0')}catch(e){}}
$('numre-kn').onchange=e=>{nrkVis(e.target.checked,true);msg(e.target.checked?'Knapper (K), dropdowns (V) og felter (F) har nu numre, fx W5:V2. T er topbaren.':'Numrene på knapper og menuer er skjult.')};
/* vis det, et nummer peger på: åbn vinduet (også fra docken), rul hen til det, og blink */
function visElement(x){const w=x.closest('.win');if(w){w.hidden=false;if(w.classList.contains('min')&&typeof miniSaet==='function')miniSaet(w,false);if(typeof aktivSaet==='function')aktivSaet(w)}const m=x.closest('.menup');if(m&&m.hidden){const b=m.previousElementSibling;if(b&&b.click)b.click()}
 try{x.scrollIntoView({behavior:'smooth',block:'center'})}catch(e){}x.classList.add('nrk-blink');setTimeout(()=>x.classList.remove('nrk-blink'),2200)}
function nrFind(){const q=($('nr-find').value||'').trim().toUpperCase().replace(/\s+/g,'');if(!q){msg('Skriv et nummer, fx W5:V2, W12 eller W6.3.');return}
 if(!NRK.liste.length)nrkByg();let x=null;const hit=NRK.liste.find(([el,k])=>k===q);if(hit)x=hit[0];
 if(!x&&/^W\d+$/.test(q))x=$('w'+q.slice(1));if(!x){const b=[...document.querySelectorAll('.nr')].find(b=>b.textContent===q);if(b)x=b.parentElement}
 if(!x){msg('Nummeret '+q+' findes ikke lige nu. Numre skrives som W5 (vindue), W6.3 (boks) eller W5:K7, W5:V2, W5:F4 (knap, dropdown, felt).');return}
 visElement(x);msg(q+' er vist og blinker.')}
$('nr-gaa').onclick=nrFind;$('nr-find').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();nrFind()}});
{let til=false;try{til=localStorage.getItem('rytme-numre-kn')==='1'}catch(e){}nrkVis(til,false)}
/* "Gå til" og andre steder, der ruller hen til noget i et minimeret eller skjult vindue, åbner nu vinduet først (panelerne er vinduer fra v4.0) */
{const orig=Element.prototype.scrollIntoView;Element.prototype.scrollIntoView=function(o){try{const w=this.closest&&this.closest('.win');if(w&&(w.hidden||w.classList.contains('min'))){w.hidden=false;if(w.classList.contains('min')&&typeof miniSaet==='function')miniSaet(w,false);if(typeof aktivSaet==='function')aktivSaet(w)}}catch(e){}return orig.call(this,o)}}
/* de ti paneler, der før lå under vinduerne, er vinduer W12 til W21 fra v4.0; de starter minimeret i højre side */
document.querySelectorAll('.win.wsekvin').forEach(w=>{if(!w.classList.contains('min'))miniSaet(w,true)});
/* ========== SLUT: NUMRE PÅ KNAPPER ========== */

