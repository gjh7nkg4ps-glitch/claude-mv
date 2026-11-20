/* ========== KVALITET OG YDELSE ========== */
/* Niveauer med lofter (Disco, Undervisning, Spar, Fuld, Egen), en regulator der kan slås til og fra, en ydelsesmåler og en måletest. Kernen ligger i runtime (kvalKopi, kvalTrin, regTik, maaleScener m.fl.).
   Kvalitet gemmes i indstillingerne (set.kval), ikke i en preset: den hører til computeren og skærmen, ikke til kunsten. */
const REG=Rytme.regNy(),METER={t:[],tid:0,stat:null},BENCH={aktiv:false,trin:-1,scener:[],S:null,sp:null,res:[],tider:[],varm:1000,maal:3000,sidst:0,t0:0,n:0,anbef:null};
let kvKey='',kvVal=null;
function kvalNu(){const key=JSON.stringify(set.kval)+'|'+REG.trin;if(key!==kvKey){kvKey=key;kvVal=Rytme.kvalTrin(Rytme.kvalKopi(set.kval),REG.trin)}return kvVal}
function pvSkala(b){const sk=kvalNu().skala;try{if(typeof UD!=='undefined'&&UD.pop&&!UD.pop.closed&&b&&b.clientWidth){const m=Math.min(2,(UD.pop.innerWidth*(UD.pop.devicePixelRatio||1))/b.clientWidth);if(m>sk)return m}}catch(e){}return sk}
function pvResize(){const c=$('pv');if(!c)return;const b=c.closest('.wb')||c.parentElement;if(!b||!b.clientWidth)return;const sk=pvSkala(b);c.width=Math.max(50,Math.round(b.clientWidth*sk));c.height=Math.max(50,Math.round(b.clientHeight*sk))}
function kvalAendret(){applySet();pvResize();kvalOpdat()}
function kvVaelg(id){const nu=Rytme.kvalKopi(set.kval);if(id==='egen'){const e={...nu};delete e.niveau;delete e.navn;delete e.trin;set.kval={...set.kval,niveau:'egen',egne:e}}else set.kval={...set.kval,niveau:id};
 const k=Rytme.kvalKopi(set.kval);set.fps=k.fps;REG.trin=0;kvalAendret();msg('Kvalitet: '+k.navn+'.')}
function kvRet(patch){const nu=Rytme.kvalKopi(set.kval),e={glod:nu.glod,blur:nu.blur,sky:nu.sky,ekko:nu.ekko,livObj:nu.livObj,livTotal:nu.livTotal,pigge:nu.pigge,skala:nu.skala,fps:nu.fps,...patch};set.kval={...set.kval,niveau:'egen',egne:e};if(patch.fps!==undefined)set.fps=Rytme.kvalKopi(set.kval).fps;REG.trin=0;kvalAendret()}
const KV_SL=[['sky','Partikler (højst)',0,500,10],['ekko','Ekkoer (højst)',0,4,1],['livObj','Levende kopier pr. figur (højst)',1,32,1],['livTotal','Levende kopier i alt (højst)',0,128,4],['pigge','Pigge på Pigkugle 3D (højst)',3,40,1]];
function kvalByg(){const el=$('kvalui');if(!el)return;
 el.innerHTML=`<p class="small" id="kv-aktiv"></p>
 <div class="seg" role="group" aria-label="Kvalitetsniveau">${['disco','undervisning','spar','fuld','egen'].map(k=>`<button class="ghost" data-kv="${k}">${k==='egen'?'Egen':Rytme.KVAL_NIVEAUER[k].navn}</button>`).join('')}</div>
 <p class="small" id="kv-tekst"></p>
 <label class="small"><input type="checkbox" id="kv-glod"> <b>Glød (sløring)</b> på former, Pigkugle 3D og slangen. Den dyreste ting i Canvas 2D, og slået fra som standard.</label>
 <label class="small"><input type="checkbox" id="kv-blur"> <b>Dybdeskarphed</b> (sløring af fjerne ting, styres af effekten <i>Dybdeskarphed</i>). Dyr, og slået fra som standard.</label>
 <div class="par" style="border-top:0;padding-top:0">${KV_SL.map(([k,n,a,b,st])=>`<label class="small"><span>${n}: <b data-kvv="${k}"></b></span><input type="range" data-kvs="${k}" min="${a}" max="${b}" step="${st}"></label>`).join('')}</div>
 <div class="ab"><label class="small">Opløsning <select id="kv-skala"><option value="1">100 %</option><option value="0.75">75 %</option><option value="0.5">50 %</option></select></label><label class="small">Billeder i sekundet <select id="kv-fps"><option value="60">60</option><option value="30">30</option></select></label><label class="small">Skarphed (Live preview) <select id="kv-skarp" title="Fuld: skærmens skalering (fx 1,5× eller 2×). Højst 2× og 1× gør tegnefladen mindre, så hvert billede koster mindre."><option value="fuld">Fuld (skærmens skalering)</option><option value="2">Højst 2×</option><option value="1">1×</option></select></label></div><p class="small" id="kv-skarp-nu"></p>
 <label class="small"><input type="checkbox" id="kv-reg"> <b>Kvalitetsregulator:</b> skruer selv ned (højst 4 trin), når billederne bliver for langsomme, og op igen, når der er plads. Går aldrig over det valgte niveau.</label>
 <label class="small"><input type="checkbox" id="kv-maaler"> Vis ydelsesmåler (her og øverst til højre i Live preview)</label>
 <p class="small kvmaal" id="kv-maal"></p>
 <h3 style="font-size:13px;margin:12px 0 4px">Måletest</h3>
 <p class="small">Gør Live preview så stort, som du vil bruge det, og tryk Kør. Testen tegner 7 forskellige scener på selve tegnefladen (cirka 30 sekunder) uden at røre din opsætning, og anbefaler et niveau. Billedhastigheden er ikke begrænset under testen.</p>
 <div class="ab"><button id="bench-start">Kør måletest</button><button class="ghost" id="bench-stop" disabled>Stop</button></div>
 <p class="small" id="bench-status" aria-live="polite"></p>
 <div id="bench-tab"></div>
 <textarea id="bench-rapport" readonly rows="10" style="width:100%;font-family:monospace;font-size:12px" aria-label="Rapport fra måletesten"></textarea>
 <div class="ab"><button class="ghost" id="bench-brug" hidden></button><button class="ghost" id="bench-kopi" hidden>Kopiér rapport</button></div>`}
function kvalOpdat(){const el=$('kvalui');if(!el||!$('kv-aktiv'))return;const k=Rytme.kvalKopi(set.kval),ef=kvalNu();
 el.querySelectorAll('[data-kv]').forEach(b=>{b.classList.toggle('on',b.dataset.kv===k.niveau);b.setAttribute('aria-pressed',b.dataset.kv===k.niveau)});
 $('kv-aktiv').textContent='Niveau: '+k.navn+(set.kval.regulator?(REG.trin?'. Regulatoren har skruet ned: trin '+REG.trin+' af 4.':'. Regulatoren er til (trin 0).'):'. Regulatoren er fra.');
 $('kv-tekst').textContent=Rytme.KVAL_TEKST[k.niveau];$('kv-glod').checked=k.glod;$('kv-blur').checked=k.blur;
 KV_SL.forEach(([q])=>{const i=el.querySelector('[data-kvs="'+q+'"]');if(document.activeElement!==i)i.value=k[q];el.querySelector('[data-kvv="'+q+'"]').textContent=k[q]+(ef[q]!==k[q]?' (regulator: '+ef[q]+')':'')});
 $('kv-skala').value=String(k.skala);if(![...$('kv-skala').options].some(o=>+o.value===k.skala)){$('kv-skala').insertAdjacentHTML('beforeend','<option value="'+k.skala+'">'+Math.round(k.skala*100)+' %</option>');$('kv-skala').value=String(k.skala)}
 $('kv-fps').value=String(k.fps);$('kv-reg').checked=!!set.kval.regulator;$('kv-maaler').checked=!!set.kval.maaler;benchUI()}
$('kvalui').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;
 if(t.dataset.kv)kvVaelg(t.dataset.kv);else if(t.id==='bench-start')benchStart();else if(t.id==='bench-stop')benchAfbryd();
 else if(t.id==='bench-brug'&&BENCH.anbef)kvVaelg(BENCH.anbef);
 else if(t.id==='bench-kopi'){const ta=$('bench-rapport');try{navigator.clipboard.writeText(ta.value).then(()=>msg('Rapporten er kopieret.'),()=>{ta.select();msg('Markér teksten og kopiér den selv (Ctrl+C).')})}catch(x){ta.select();msg('Markér teksten og kopiér den selv (Ctrl+C).')}}});
$('kvalui').addEventListener('change',e=>{const t=e.target;if(t.id==='kv-glod')kvRet({glod:t.checked});else if(t.id==='kv-blur')kvRet({blur:t.checked});else if(t.id==='kv-skala')kvRet({skala:+t.value});else if(t.id==='kv-fps')kvRet({fps:+t.value});
 else if(t.id==='kv-reg'){set.kval={...set.kval,regulator:t.checked};REG.trin=0;kvalAendret();msg(t.checked?'Kvalitetsregulatoren er slået til.':'Kvalitetsregulatoren er slået fra.')}
 else if(t.id==='kv-maaler'){set.kval={...set.kval,maaler:t.checked};kvalAendret()}});
$('kvalui').addEventListener('input',e=>{const t=e.target,k=t.dataset.kvs;if(k)kvRet({[k]:+t.value})});
function kvalMaalOpdat(){const tt=performance.now();if(tt-METER.tid<250)return;METER.tid=tt;METER.stat=METER.t.length?Rytme.maaleStat(METER.t):null;
 const e=$('kv-maal');if(!e||!set.kval.maaler){if(e)e.textContent='';return}const st=METER.stat,c=$('pv'),ef=kvalNu();
 e.textContent=st?Math.round(st.fps)+' billeder i sekundet, '+st.gns.toFixed(1).replace('.',',')+' ms pr. billede (langsomste 5 %: '+st.p95.toFixed(1).replace('.',',')+' ms). Tegneflade '+c.width+'×'+c.height+'. Levende kopier '+SCN.liv.length+', partikler '+SCN.skyer.length+', ringe '+SCN.ringe.length+', figurer '+fase2.objekter.length+'. Glød '+(ef.glod?'til':'fra')+', regulatortrin '+REG.trin+'.':'Venter på billeder ...'}
function tegnMaaler(g,W,Hh){const st=METER.stat;if(!st)return;const tx=Math.round(st.fps)+' fps  '+st.gns.toFixed(1)+' ms  trin '+REG.trin+'  '+Rytme.kvalKopi(set.kval).navn,fs=Math.max(11,Math.round(Hh*.028));g.save();g.font='700 '+fs+'px Schibsted Grotesk,sans-serif';g.textAlign='right';const w=g.measureText(tx).width+16;
 g.fillStyle='rgba(0,0,0,.55)';g.fillRect(W-w-8,8,w,fs+10);g.fillStyle=st.fps>=54?'#7dffb0':st.fps>=40?'#ffd166':'#ff7a7a';g.fillText(tx,W-16,8+fs);g.restore()}
/* ---- Måletest ---- */
function maaleInfo(){let gpu='ukendt';try{const gl=document.createElement('canvas').getContext('webgl'),x=gl.getExtension('WEBGL_debug_renderer_info');gpu=gl.getParameter(x.UNMASKED_RENDERER_WEBGL)}catch(e){}
 const c=$('pv');return{gpu,kerner:navigator.hardwareConcurrency,skaerm:screen.width+'×'+screen.height,dpr:window.devicePixelRatio,canvas:c.width+'×'+c.height,browser:navigator.userAgent,niveau:Rytme.kvalKopi(set.kval).navn}}
function benchStart(){if(BENCH.aktiv)return;BENCH.scener=Rytme.maaleScener();BENCH.aktiv=true;BENCH.trin=-1;BENCH.S=null;BENCH.sp=null;BENCH.res=[];BENCH.anbef=null;$('bench-rapport').value='';benchUI()}
function benchAfbryd(){if(!BENCH.aktiv)return;BENCH.aktiv=false;BENCH.S=null;BENCH.sp=null;msg('Måletesten er afbrudt.');benchUI()}
function benchSlut(){BENCH.aktiv=false;BENCH.S=null;BENCH.anbef=Rytme.maaleAnbefal(BENCH.res,60);$('bench-rapport').value=Rytme.maaleRapport(BENCH.res,maaleInfo(),BENCH.anbef,60);benchUI();msg('Måletesten er færdig. Anbefalet niveau: '+Rytme.KVAL_NIVEAUER[BENCH.anbef].navn+'.')}
function benchFrame(t){const B=BENCH;
 if(!B.S){B.trin++;if(B.trin>=B.scener.length){benchSlut();return}B.sp=B.scener[B.trin];B.S=B.sp.byg();B.t0=t;B.sidst=t;B.n=0;B.tider=[];benchUI()}
 const bs=B.S,c=$('pv'),g=c.getContext('2d'),iv=t-B.sidst,i=B.n++;B.sidst=t;if(bs.klods&&i%25===0)bs.T.blocks.push({l:(i/25|0)%3,z:0});
 Rytme.tegnScene(g,c.width,c.height,{E:bs.E(i),t,dt:Math.min(.05,Math.max(.001,iv/1000)),scene:bs.scene,pos:bs.pos,objekter:bs.objekter,slange:bs.slange,ur:()=>0,T:bs.T,kval:bs.kval,kilde:()=>.5});
 if(t-B.t0>B.varm&&iv>0&&iv<250)B.tider.push(iv);
 const fs=Math.max(12,Math.round(c.height*.03));g.save();g.font='700 '+fs+'px Schibsted Grotesk,sans-serif';g.textAlign='left';const tx='Måletest '+(B.trin+1)+' af '+B.scener.length+': '+B.sp.navn;g.fillStyle='rgba(0,0,0,.65)';g.fillRect(8,8,g.measureText(tx).width+16,fs+12);g.fillStyle='#fff';g.fillText(tx,16,8+fs);g.restore();
 if(t-B.t0>=B.varm+B.maal){const st=Rytme.maaleStat(B.tider);B.res.push({id:B.sp.id,navn:B.sp.navn,...st,vurdering:Rytme.maaleVurdering(st,60)});B.S=null}}
function benchUI(){const B=BENCH;if(!$('bench-status'))return;$('bench-start').disabled=B.aktiv;$('bench-stop').disabled=!B.aktiv;
 $('bench-status').textContent=B.aktiv?(B.sp?'Måletest kører: scene '+(B.trin+1)+' af '+B.scener.length+' ('+B.sp.navn+').':'Måletest starter ...'):B.anbef?'Færdig. Anbefalet niveau: '+Rytme.KVAL_NIVEAUER[B.anbef].navn+'.':'';
 $('bench-tab').innerHTML=B.res.length?'<table><tr><th>Scene</th><th>Billeder/sek.</th><th>Gns. ms</th><th>Langsomste 5 %</th><th>Vurdering</th></tr>'+B.res.map(x=>`<tr><td>${esc(x.navn)}</td><td>${Math.round(x.fps)}</td><td>${x.gns.toFixed(1)}</td><td>${x.p95.toFixed(1)}</td><td>${esc(x.vurdering)}</td></tr>`).join('')+'</table>':'';
 $('bench-brug').hidden=!B.anbef||B.aktiv;$('bench-kopi').hidden=!B.anbef||B.aktiv;if(B.anbef)$('bench-brug').textContent='Brug anbefalet niveau ('+Rytme.KVAL_NIVEAUER[B.anbef].navn+')'}
/* ========== SLUT: KVALITET OG YDELSE ========== */

