/* ========== v9.104: GEMNING DER SIGER TIL, ? OG NYT PÅ STARTSKÆRMEN ==========
   Brugerens P8.18 (DeepSeeks UX-audit; D1, D2, D3).
   D1: alle localStorage.setItem går gennem lsGem(nøgle, tekst). Lykkes det, lyser det lille mærke "Gemt ✓" (#gem-ok, højst hvert 2. sekund, væk efter 1,5 s)
       i linjen øverst. Fejler det (fagudtryk: QuotaExceededError, lageret er fuldt), kommer banneret #gem-fejl frem øverst: "Kunne ikke gemme. Tag en
       sikkerhedskopi (Gem alle på computeren)." med en knap, der gemmer Opsætning 1–20 på computeren (opsEksport) og åbner Opsætninger. Banneret bliver,
       til en gemning lykkes igen. De gamle try/catch rundt om kaldene gør stadig ingen skade.
   D2: tasten ? (ikke i et felt) åbner manualen ved Tastaturgenveje.
   D3: startskærmen viser "Hvad er nyt i v…": de første linjer fra manualens nyeste afsnit (højst 5), foldet, med et link til hele listen i manualen. */
const GEM={t:0,fejl:false,tid:0};
function lsGem(k,v){try{localStorage.setItem(k,v);gemOk();return true}catch(e){gemFejl(e);return false}}
function gemOk(){if(GEM.fejl){GEM.fejl=false;const b=$('gem-fejl');if(b)b.hidden=true}const nu=Date.now();if(nu-GEM.tid<2000)return;GEM.tid=nu;const m=$('gem-ok');if(!m)return;m.classList.add('vis');clearTimeout(GEM.t);GEM.t=setTimeout(()=>m.classList.remove('vis'),1500)}
function gemFejl(e){GEM.fejl=true;let b=$('gem-fejl');if(!b){b=document.createElement('div');b.id='gem-fejl';b.setAttribute('role','alert');b.innerHTML='<b>Kunne ikke gemme.</b> <span>Browserens lager er fuldt eller lukket, så dit arbejde gemmes ikke, før der er plads. Tag en sikkerhedskopi (Gem hele arbejdet), og slet gamle shows under Mine i Biblioteket.</span> <button id="gem-fejl-alt">Gem hele arbejdet</button><button class="ghost" id="gem-fejl-kopi">Gem alle på computeren</button><button class="ghost" id="gem-fejl-luk" aria-label="Skjul">×</button>';document.body.appendChild(b);
  $('gem-fejl-kopi').onclick=()=>{try{opsEksport(SLOTS)}catch(x){}try{dkVis('w13')}catch(x){}};$('gem-fejl-luk').onclick=()=>{b.hidden=true}}
 const s=$('gem-fejl').querySelector('span');if(s&&e&&e.name&&!/Quota/i.test(e.name))s.textContent='Browseren afviste at gemme ('+e.name+'). Tag en sikkerhedskopi (Gem hele arbejdet).';b.hidden=false;try{console.warn('Gemning fejlede',e)}catch(x){}}
function gemMaerkeByg(){if($('gem-ok'))return;const st=$('status');if(!st||!st.parentNode)return;const m=document.createElement('span');m.id='gem-ok';m.className='chip';m.textContent='Gemt ✓';m.title='Det sidste er gemt i browseren';st.parentNode.insertBefore(m,st)}
/* D2 */
document.addEventListener('keydown',e=>{if(e.key!=='?'||e.ctrlKey||e.metaKey||e.altKey)return;if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||'')||(e.target&&e.target.isContentEditable))return;e.preventDefault();try{const d=$('gd');if(d&&!d.open){try{d.showModal()}catch(x){d.show()}}manualGaa('man-genveje')}catch(x){}});
/* D3 */
function startNytHtml(){try{const h=document.querySelector('#gd h3[id^="man-v9"],#gd h3[id^="man-v1"]');if(!h)return '';const v=(h.textContent.match(/\(v[\d.]+/)||[''])[0].slice(1)||('v'+(document.title.match(/v([\d.]+)/)||[0,''])[1]);let ul=h.nextElementSibling;const li=[];if(ul&&ul.tagName==='UL')[...ul.querySelectorAll('li')].slice(0,5).forEach(x=>{const t=x.textContent.replace(/\s+/g,' ').trim();li.push('<li>'+esc(t.length>220?t.slice(0,217)+'…':t)+'</li>')});if(!li.length)return '';
 return '<details class="start-nyt"><summary>Hvad er nyt i '+esc(v)+'</summary><ul>'+li.join('')+'</ul><button class="ghost" data-startnyt="'+esc(h.id)+'">Hele listen i manualen</button></details>'}catch(e){return ''}}
{const gl=startSkVis;window.startSkVis=function(altid){gl(altid);try{const d=$('start-sk');if(!d||!d.open)return;let n=$('start-nyt');if(!n){n=document.createElement('div');n.id='start-nyt';const fod=d.querySelector('.start-fod');if(fod)fod.insertAdjacentElement('beforebegin',n);else d.querySelector('.dlg').appendChild(n)}n.innerHTML=startNytHtml()}catch(e){}}}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-startnyt]');if(!b)return;try{const d=$('start-sk');if(d&&d.open)d.close()}catch(x){}try{const g=$('gd');if(g&&!g.open){try{g.showModal()}catch(x){g.show()}}manualGaa(b.dataset.startnyt)}catch(x){}});
setTimeout(gemMaerkeByg,1800);setInterval(gemMaerkeByg,3000);
/* ========== SLUT: GEMNING DER SIGER TIL, ? OG NYT PÅ STARTSKÆRMEN ========== */
