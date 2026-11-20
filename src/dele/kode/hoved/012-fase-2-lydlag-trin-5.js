/* ========== FASE 2: LYDLAG (trin 5) ========== */
/* Lyde er mål ligesom effekter: en forbindelse fra et lydtræk til 'lyd:klik', 'lyd:tone' eller 'lyd:suus' udløser lyden på forbindelsens kant (envelope over 0,35, med pause).
   For filer og generator planlægges lyden på lydens ur (kig frem), så den sidder præcist på slaget; ellers udløses den live. Lydlaget går ikke gennem live-analysen, så det ikke selv udløser lydtræk. Alt kan mutes: pr. lyd og samlet. */
let lyd=lydKopi(null);try{const lj=JSON.parse(localStorage.getItem('rytme-lyd'));if(lj)lyd=lydKopi(lj)}catch(e){}
let lm=null,lmCtx=null,lhLast=0;const lh=[];
function lydCtx(){const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;actx=actx||new AC();try{actx.resume()}catch(e){}
 if(!lm||lmCtx!==actx){lm=actx.createGain();lm.connect(udgang(actx));lmCtx=actx}lm.gain.value=lyd.mute?0:lyd.vol;return actx}
/* Spiller en lyd, så SLAGET falder på tidspunktet beat (lydurets tid). Forvarsel starter derfor før beat. */
function lydSpil(id,beat,o){o=o||{};const S=lyd[id];if(!S||lyd.mute)return false;if(!S.til&&!o.force)return false;const c=lydCtx();if(!c)return false;
 const S2=Object.assign({},S,o.variant?{variant:o.variant}:{}),start=beat-(id==='suus'&&S2.variant==='forvarsel'&&!o.live?S2.laengde:0);lydVoice(c,id,start,S2,o);return true}
function lydLive(id){try{const c=lydCtx();lydSpil(id,(c?c.currentTime:0)+.01,{live:true})}catch(e){console.error(e)}}
/* Planlægger lyde for filer og generator et lille stykke frem (0,25 s), så de sidder præcist på lydens ur. */
function lydTick(){if(lyd.mute||!actx)return;const src=timingSrc();if(!src)return;const now0=actx.currentTime,AH=.25;
 if(src==='fil'){if(!playing)return;const clk=now();if(clk<lhLast-.05||clk>lhLast+.6)lh.forEach(c=>{if(c)c.ptr=null});lhLast=clk}
 maps.forEach((m,i)=>{if(!/^lyd:/.test(m.effect))return;const id=m.effect.slice(4),S=lyd[id];if(!S||!S.til)return;if(m.off||(soloOn&&i!==meshSel))return;
  const pre=id==='suus'&&S.variant==='forvarsel'?S.laengde:0;
  if(src==='fil'){const sig=[src,m.band,m.thr,m.gain,m.att,m.rel,m.curve??1,m.gap??120,m.inv?1:0,gmaster,fileVer,pre].join('|');let c=lh[i];if(!c||c.sig!==sig)c=lh[i]={sig,ev:klodsHaendelser(m,i),ptr:null,gk:-1};
   if(c.ptr===null){let q=0;while(q<c.ev.length&&startAt+c.ev[q]-offset-pre<now0-.03)q++;c.ptr=q}
   while(c.ptr<c.ev.length){const b=startAt+c.ev[c.ptr]-offset;if(b-pre>now0+AH)break;lydSpil(id,b);c.ptr++}}
  else if(GEN_BAND[m.band]){let c=lh[i];if(!c||c.sig!=='gen')c=lh[i]={sig:'gen',ev:[],ptr:null,gk:-1};
   for(const p of gPlan){if(p.k<=c.gk)continue;if(p.T-pre>now0+AH)break;c.gk=p.k;if(p.T-pre>=now0-.03&&GEN_BAND[m.band].some(r=>pat[r][p.s]&&!mute[r]))lydSpil(id,p.T)}}})}
setInterval(lydTick,40);
function lydTik(c,t){const q=c.createOscillator(),g=c.createGain();q.type='square';q.frequency.setValueAtTime(1500,t);g.gain.setValueAtTime(.05,t);g.gain.exponentialRampToValueAtTime(.001,t+.015);q.connect(g);g.connect(lm);q.start(t);q.stop(t+.02)}
function lydProev(id){const c=lydCtx();if(!c){msg('Din browser har ikke lyd.');return}if(lyd.mute){msg('Lydlaget er slået fra (mute).');return}const S=lyd[id],pre=id==='suus'&&S.variant==='forvarsel'?S.laengde:0;lydSpil(id,c.currentTime+.05+pre,{force:true})}
function lydDemo(v){const c=lydCtx();if(!c){msg('Din browser har ikke lyd.');return}if(lyd.mute){msg('Lydlaget er slået fra (mute).');return}
 const t0=c.currentTime+.1+(v==='forvarsel'?lyd.suus.laengde:0);for(let k=0;k<4;k++){const b=t0+k*.6;lydTik(c,b);lydSpil('suus',b,{variant:v,force:true})}
 msg('Lytter til '+({skud:'skudlyden',forvarsel:'forvarslet',forbi:'forbi-susen'})[v]+' på fire slag (et svagt tik viser slaget).')}
function persistLyd(){try{lsGem('rytme-lyd',JSON.stringify(lyd))}catch(e){}$('json').value=presetJSON();meshUI()}
function setLyd(pth,v){const k=pth.split('.');if(k.length===1)lyd[k[0]]=v;else lyd[k[0]][k[1]]=v;if(lm)lm.gain.value=lyd.mute?0:lyd.vol;persistLyd()}
function bindLyd(id,band){Regler.samlet(()=>{maps.filter(m=>m.effect==='lyd:'+id).forEach(m=>Regler.slet(m.id));if(band)Regler.tilfoej(mk(band,'lyd:'+id,.3,1,8,120))});lydUI()}
function lydUI(){const el=$('lydui');if(!el)return;
 const val=pth=>pth.split('.').reduce((o,k)=>o[k],lyd);
 const sl=(pth,n,a,b,st,u)=>`<label class="small"><span>${n}: <b data-lv="${pth}">${val(pth)}</b>${u||''}</span><input type="range" data-ly="${pth}" min="${a}" max="${b}" step="${st}" value="${val(pth)}"></label>`;
 const blk=(id,navn,body)=>{const mp=maps.find(m=>m.effect==='lyd:'+id);return `<div class="frow" data-lid="${id}"><b>${navn} <label class="small" style="font-weight:400"><input type="checkbox" data-lt="${id}"${lyd[id].til?' checked':''}> Lyd til</label></b><div class="bnd"><select data-lb="${id}" aria-label="Lydtræk for ${navn}"><option value="">Ingen kobling</option>${opts(BANDS,mp?mp.band:'')}</select><button class="ghost" data-prov="${id}">Prøv</button></div>${body}</div>`};
 el.innerHTML=`<div class="ab"><button id="lmute" class="tgl" role="switch" aria-checked="false"><i></i><span>Mute (alt lydlag): Fra</span></button></div>
 <div class="par" style="border-top:0;padding-top:0">${sl('vol','Lydstyrke (hele lydlaget)',0,1,.05)}</div>
 <p class="small">Intet lyder, før du har koblet et lydtræk til en lyd. Lydlaget kører på lydens ur (fil og generator), så lyden sidder præcist på slaget, uafhængigt af Synk-forskydning (den gælder kun klodserne).</p>
 ${blk('klik','Klik',`<div class="par">${sl('klik.vol','Styrke',0,1,.05)}</div>`)}
 ${blk('tone','Tone (fra tonearten)',`<div class="par">${sl('tone.vol','Styrke',0,1,.05)}${sl('tone.trin','Trin i skalaen',1,8,1)}${sl('tone.okt','Oktav',-2,2,1)}${sl('tone.laengde','Længde',60,600,10,' ms')}<label class="small">Bølge<select data-lw>${opts(WAVES,lyd.tone.boelge)}</select></label></div>`)}
 ${blk('suus','Suus (valgfri, slået fra som standard)',`<div class="par"><label class="small">Variant<select data-lv2>${opts([['skud','Skudlyd'],['forvarsel','Forvarsel'],['forbi','Forbi-susen'],['ingen','Ingen']],lyd.suus.variant)}</select></label>${sl('suus.vol','Styrke',0,1,.05)}${sl('suus.laengde','Længde ved forvarsel (s)',.3,2,.05)}<label class="small"><input type="checkbox" data-lst${lyd.suus.stem?' checked':''}> Stem til toneart</label></div><div class="ab"><span class="small">Lyt og sammenlign (med et svagt tik på hvert slag):</span><button class="ghost" data-lyt="skud">Skudlyd</button><button class="ghost" data-lyt="forvarsel">Forvarsel</button><button class="ghost" data-lyt="forbi">Forbi-susen</button></div>`)}
 <p class="small">Tonearten er generatorens (toneart og skala), også når en fil spiller. Registrering af en sangs toneart er ikke bygget. <b>Skudlyd</b> er et kort suk nedad på slaget. <b>Forvarsel</b> stiger op mod slaget og slutter med et lille pop. Uden fremtid (kun tastatur) spilles kun poppet. <b>Forbi-susen</b> starter på slaget og klinger ud.</p>`;
 setTgl($('lmute'),lyd.mute,'Mute (alt lydlag)')}
$('lydui').addEventListener('input',e=>{const t=e.target;if(t.dataset.ly){setLyd(t.dataset.ly,+t.value);const b=t.parentNode.querySelector('[data-lv]');if(b)b.textContent=t.value}});
$('lydui').addEventListener('change',e=>{const t=e.target;
 if(t.dataset.lt)setLyd(t.dataset.lt+'.til',t.checked);
 else if(t.dataset.lst!==undefined)setLyd('suus.stem',t.checked);
 else if(t.dataset.lw!==undefined)setLyd('tone.boelge',t.value);
 else if(t.dataset.lv2!==undefined){setLyd('suus.variant',t.value);lh.length=0}
 else if(t.dataset.lb!==undefined)bindLyd(t.dataset.lb,t.value)});
$('lydui').addEventListener('click',e=>{const t=e.target.closest('button');if(!t)return;if(t.id==='lmute'){setLyd('mute',!lyd.mute);lydUI()}else if(t.dataset.prov)lydProev(t.dataset.prov);else if(t.dataset.lyt)lydDemo(t.dataset.lyt)});
/* ========== SLUT: LYDLAG (trin 5) ========== */

