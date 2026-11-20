/* ========== v9.28: NODE-EDITOR (TRIN 10): LÆR OG ADAPTIV TÆRSKEL ==========
   Trin 10 af 16 (papirets afsnit 5.6): knappen Lær og Adaptiv tærskels to indstillinger i reglens kontrolpanel.
   - Lær (ét tryk): med en analyseret sang bruges målingen over hele sangen (F, A eller STEM.F, med trim og Vend om). Handling: tærsklen sættes lige
     under de tydelige slag (90 % af den 70. percentil af toppene). Egenskab: mindst = 10. percentil, mest = 95. percentil (styrken sættes, så udgangen
     når 1 ved "mest"). Med Lyd ind eller generatoren lytter Lær i 8 sekunder. Bagefter en kort besked, fx "Tærskel sat til 0,58 ud fra 212 slag · Fortryd".
   - En ny regel (lavet i Node-editoren) har Lær lysende som forslag, til Lær er brugt.
   - Adaptiv tærskel: Til/Fra, hvor hurtigt den følger sangen (1–8 s, standard 3 s) og bundgrænsen (0–0,3, standard 0,05).
     Det er de samme indstillinger som i EQ-vinduet (set.tilpas, set.tilpasTid, set.tilpasBund); de gælder alle regler. */
const NE10={nye:new Set(),lytter:null};
{const gl=ne5Ny;window.ne5Ny=function(band,effect,slags,pos){const m=gl(band,effect,slags,pos);NE10.nye.add(m);ne2Kp(true);return m}}
function ne10Serie(b){try{if(b.startsWith('stem:')){const p=b.split(':');return STEM.F&&STEM.F[p[1]]&&STEM.F[p[1]][stemFeat(b)]||null}if(b.startsWith('ana:'))return A&&A[b]||null;return F&&F[b]||null}catch(e){return null}}
function ne10Kvantil(a,q){if(!a.length)return 0;const s=Float32Array.from(a).sort();return s[Math.max(0,Math.min(s.length-1,Math.floor(q*(s.length-1))))]}
/* Regn Lær ud fra en række tal (0–1) */
function neLaerRegn(m,x,dtf){const v=Array.from(x,y=>{let z=neTrimV(m.band,+y||0);return m.inv?1-z:z});
 if(neEgM(m)){const lo=ne10Kvantil(v,.1),hi=ne10Kvantil(v,.95),thr=Math.max(0,Math.min(.95,Math.round(lo*100)/100));if(!(hi>thr+.02))return{fejl:'Lydtrækket ændrer sig næsten ikke i sangen, så mindst og mest kan ikke findes.'};const c=+(m.curve??1)||1,gain=Math.max(.05,Math.min(2,Math.round(Math.pow((1-thr)/(hi-thr),c)*100)/100));
  return{thr,gain,tekst:'Mindst sat til '+neTal(thr)+' og mest til '+neTal(hi)+' (styrke ×'+neTal(gain)+') ud fra '+(dtf?'hele sangen':'8 sekunder')}}
 const P=[];for(let i=1;i<v.length-1;i++)if(v[i]>v[i-1]&&v[i]>=v[i+1]&&v[i]>.05)P.push(v[i]);if(P.length<4)return{fejl:'Der er for få tydelige slag i '+(dtf?'sangen':'de 8 sekunder')+' til at sætte en tærskel.'};
 const thr=Math.max(.05,Math.min(.95,Math.round(.9*ne10Kvantil(P,.7)*100)/100));let n=0,sidst=-1e9;const min=Math.max(1,Math.round(.1/(dtf||.033)));for(let i=1;i<v.length-1;i++)if(v[i]>=thr&&v[i]>v[i-1]&&v[i]>=v[i+1]&&i-sidst>=min){n++;sidst=i}
 return{thr,tekst:'Tærskel sat til '+neTal(thr)+' ud fra '+n+' slag'}}
function neLaer(i){const m=maps[i];if(!m)return;const x=ne10Serie(m.band),fil=!!(x&&x.length>8&&!(typeof live!=='undefined'&&live));
 const brug=(r,dtf)=>{if(r.fejl){neToast('Lær: '+r.fejl,true);return}const foer={thr:m.thr,gain:m.gain};m.thr=r.thr;if(r.gain!=null)m.gain=r.gain;NE10.nye.delete(m);try{save();renderMaps()}catch(e){}neToast(r.tekst);ne2Byg();return foer};
 if(fil){brug(neLaerRegn(m,x,H/sr),H/sr);return}
 if(NE10.lytter)return;const S=[],t0=performance.now();neToast('Lær lytter i 8 sekunder …',true);NE10.lytter=setInterval(()=>{let v=0;try{v=+bandV(m.band)||0}catch(e){}S.push(v);const s=Math.ceil(8-(performance.now()-t0)/1000);neToastLive('Lær lytter … '+Math.max(0,s)+' s');if(performance.now()-t0>=8000){clearInterval(NE10.lytter);NE10.lytter=null;brug(neLaerRegn(m,S,0),0)}},33)}
/* Kontrolpanelet: Lær og Adaptiv tærskel */
{const gl=ne2Kp;window.ne2Kp=function(ny){gl(ny);const n=NE2.valgt&&NE2.N.get(NE2.valgt);if(!n||n.kol!=='regel'||n.kladde||!(n.i>=0))return;const box=document.querySelector('#ne-kp .ne-ret-knapper'),ret=document.querySelector('#ne-kp .ne-kp-ret');if(!box||!ret)return;
 const m=maps[n.i],ny2=NE10.nye.has(m),fil=!!(ne10Serie(m.band)&&!(typeof live!=='undefined'&&live));
 box.insertAdjacentHTML('afterbegin','<button class="ne-k ne-laer'+(ny2?' ne-forslag':'')+'" data-ne10="laer" data-i="'+n.i+'" title="'+(fil?'Lær ud fra hele sangen: ':'Lær lytter i 8 sekunder: ')+(neEgM(m)?'sætter mindst og mest.':'sætter tærsklen lige under de tydelige slag.')+' Kan fortrydes.">Lær'+(ny2?' · forslag':'')+'</button>');
 const on=!!set.tilpas,tid=+set.tilpasTid||3,bund=+(set.tilpasBund??.05);
 ret.insertAdjacentHTML('beforeend','<div class="ne-adaptiv"><small>Adaptiv tærskel (vores navn) · gælder alle regler</small><div class="ne-seg-r"><span class="ne-seg"><button class="ne-k'+(on?' ne-paa':'')+'" data-ne10="tilpas" data-v="1">Til</button><button class="ne-k'+(on?'':' ne-paa')+'" data-ne10="tilpas" data-v="0">Fra</button></span></div>'
  +'<label class="ne-sk'+(on?'':' ne-graa')+'"><span>Hvor hurtigt <b data-nv10="tid">'+String(tid).replace('.',',')+' s</b></span><input type="range" data-ne10="tid" min="1" max="8" step=".5" value="'+tid+'"></label>'
  +'<label class="ne-sk'+(on?'':' ne-graa')+'"><span>Bundgrænse <b data-nv10="bund">'+neTal(bund)+'</b></span><input type="range" data-ne10="bund" min="0" max=".3" step=".01" value="'+bund+'"></label></div>')}}
function ne10Saet(k,v){const map={tid:'eq-tilpas-tid',bund:'eq-tilpas-bund'};if(k==='tilpas'){const c=$('eq-tilpas');if(c&&c.checked!==!!v){c.checked=!!v;c.dispatchEvent(new Event('change',{bubbles:true}))}set.tilpas=!!v}
 else{const e=$(map[k]);if(e){e.value=v;e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}))}if(k==='tid')set.tilpasTid=+v;else set.tilpasBund=+v}
 try{tilpasUI()}catch(e){}try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}}
function ne10Start(){const rod=$('ne');if(!rod)return;
 rod.addEventListener('click',e=>{const b=e.target.closest('[data-ne10]');if(!b||b.tagName==='INPUT')return;if(b.dataset.ne10==='laer')neLaer(+b.dataset.i);else if(b.dataset.ne10==='tilpas'){ne10Saet('tilpas',b.dataset.v==='1');neToast('Adaptiv tærskel: '+(set.tilpas?'Til':'Fra')+' (gælder alle regler)',true);ne2Byg()}});
 rod.addEventListener('input',e=>{const t=e.target.closest('input[data-ne10]');if(!t)return;NE2.laas=true;const b=document.querySelector('#ne-kp [data-nv10="'+t.dataset.ne10+'"]');if(b)b.textContent=t.dataset.ne10==='tid'?String(+t.value).replace('.',',')+' s':neTal(+t.value);ne10Saet(t.dataset.ne10,+t.value)});
 rod.addEventListener('change',e=>{const t=e.target.closest('input[data-ne10]');if(!t)return;NE2.laas=false;neToast((t.dataset.ne10==='tid'?'Adaptiv tærskel følger sangen over ':'Adaptiv tærskels bundgrænse: ')+(t.dataset.ne10==='tid'?String(+t.value).replace('.',',')+' s':neTal(+t.value)),true)})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne10Start);else setTimeout(ne10Start,0);
/* ========== SLUT: NODE-EDITOR (TRIN 10): LÆR OG ADAPTIV TÆRSKEL ========== */
