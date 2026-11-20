/* ========== v9.42: D2 PÅ LÆRREDET ==========
   (Hed til v9.91 "D2 PÅ LÆRREDET OG HÅNDTAG I BILLEDET"; håndtagene er fjernet i v9.55 og koden i v9.92.) De sidste to linjer fra funktionslisten (brugerens valg 11. november).
   1 · D2 på lærredet: "Sortér: Figur → mål · D2 (efter musik)" i kontrolpanelet (når intet er valgt) og i Ctrl+K. Med D2 stables reglerne efter deres
       lydtræk i D2-rækkefølgen (mappe efter musik: Rytme, Tone og harmoni, Klang, Dynamik, Frekvens, Rum, Struktur, Styring; inden i mappen slag,
       glidende, rampe, valg; så navnet), og hver mappe får en overskrift i kolonnen Lydtræk. Figurer og mål står ud for deres regler som før.
       Noder, du selv har flyttet, bliver hvor de er (Placér stiller alt). Valget står i set.ne.sort.
   2 · Håndtag i billedet (Dublets håndtag, slettet i v9.35): scene-noden for Live preview har "Håndtag i billedet: Til/Fra" i sit kontrolpanel og i Ctrl+K.
       Til: hver effekt (Lys-puls, Chokbølge, Partikler, Glød, Partikelsky, Dæmpningsringe) og hver figur får en prik i det lille billede; træk i prikken
       flytter den på scenen (samme placering som Live previews "Flyt effekter" og Form-editorens x og y; gemmes med det samme). Figurer er gule, effekter
       grønne. Med håndtag viser billedet hele scenen (ellers skæres kanterne af, når Live preview er meget bred). Et træk i en prik flytter ikke noden og åbner ikke Show; et klik ved siden af åbner Show som før. Valget står i set.ne.haand. */
const NE42={mapper:null};
function ne42Sort(){return set.ne&&set.ne.sort==='d2'?'d2':'figur'}
function ne42SaetSort(v){set.ne=set.ne||{};set.ne.sort=v==='d2'?'d2':'figur';try{neGem()}catch(e){}try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}
 NE2.sig='';try{ne2Byg()}catch(e){}try{if(!NE2.valgt)ne2Kp(true)}catch(e){}neToast('Sortér: '+(set.ne.sort==='d2'?'D2 (efter musik): reglerne står i mapper efter deres lydtræk':'Figur → mål (som før)'))}
/* D2-rækkefølgen for et lydtræk: mappe, type, navn (samme som r2Orden og + Tilføj) */
function ne42D2(k){const S=sigInfo(k);return [SIG_MAPPER.indexOf(S.mappe),['slag','glidende','rampe','valg'].indexOf(S.type),String(neLtNavn?neLtNavn(k):k)]}
function ne42Sml(a,b){const A=ne42D2(a),B=ne42D2(b);return A[0]-B[0]||A[1]-B[1]||A[2].localeCompare(B[2],'da')}
/* Kopi af ne2Placer (trin 2) med én forskel: reglerne stables efter deres lydtræk i D2-rækkefølgen, med plads til en overskrift pr. mappe. */
function ne42PlacerD2(){const G=+NE.tema.maal.gitter||8,MELLEM=3*G,HOVED=4*G,rund=v=>Math.round(v/G)*G,N=NE2.N,kolX={};NE.kol.forEach(c=>kolX[c.k]=c.x);
 const fig=[...N.values()].filter(n=>n.kol==='figur'),fo=n=>n.gruppe?1000+NE2_GRUPPER.indexOf(n.navn):Math.max(0,(fase2.objekter||[]).findIndex(o=>o.id===n.key.slice(2)));fig.sort((a,b)=>fo(a)-fo(b));
 const bandAf=n=>n.m&&n.m.band||'',reg=[...N.values()].filter(n=>n.kol==='regel').sort((a,b)=>ne42Sml(bandAf(a),bandAf(b))||a.i-b.i);
 const STD={lydtraek:128,regel:152,figur:112,maal:112},H=n=>{const el=n.el,h=el?el.offsetHeight:0;return h>0?Math.ceil(h/G)*G:STD[n.kol]||120};
 let y=0,mp=null;NE42.mapper=[];reg.forEach(n=>{const m=sigInfo(bandAf(n)).mappe;if(m!==mp){if(mp!==null)y+=HOVED;mp=m;NE42.mapper.push({mappe:m,y})}n.ay=y;y+=H(n)+MELLEM});const midt=n=>n.ay+H(n)/2;
 const stak=(liste,ønsket)=>{liste.forEach(n=>n.ø=ønsket(n));liste.sort((a,b)=>a.ø-b.ø);let bund=-1e9;liste.forEach(n=>{n.ay=rund(Math.max(n.ø,bund));bund=n.ay+H(n)+MELLEM})};
 const snit=(keys,fb)=>{const r=keys.map(k=>N.get(k)).filter(x=>x&&x.ay!=null);return r.length?r.reduce((s,x)=>s+midt(x),0)/r.length:fb};
 const lt=[...N.values()].filter(n=>n.kol==='lydtraek');
 /* lydtræk uden regler kommer efter dem med, i D2-rækkefølge */
 lt.forEach(n=>{n.ø=n.regler.length?snit(n.regler.concat(n.gates||[]),0)-H(n)/2:1e8});lt.sort((a,b)=>a.ø-b.ø||ne42Sml(a.band,b.band));let bund=-1e9;lt.forEach(n=>{n.ay=rund(Math.max(n.ø<1e8?n.ø:bund,bund));bund=n.ay+H(n)+MELLEM});
 /* mappe-overskriften står over det første lydtræk i mappen */
 NE42.mapper.forEach(h=>{const f=lt.filter(n=>sigInfo(n.band).mappe===h.mappe).sort((a,b)=>a.ay-b.ay)[0];if(f)h.y=f.ay});
 stak(fig,n=>snit(n.regler,0)-H(n)/2);
 stak([...N.values()].filter(n=>n.kol==='maal'),n=>{const f=N.get(n.figur);const r=snit(n.regler,0);return (f?(r*2+midt(f))/3:r)-H(n)/2});
 const P=NE.pos||{};N.forEach(n=>{const p=P[n.key];n.x=p&&Number.isFinite(p[0])?p[0]:kolX[n.kol];n.y=p&&Number.isFinite(p[1])?p[1]:n.ay;n.flyttet=!!p});
 NE2.hoejde=Math.max(0,...[...N.values()].map(n=>n.y+H(n)))}
{const gl=ne2Placer;window.ne2Placer=function(){if(ne42Sort()==='d2')return ne42PlacerD2();NE42.mapper=[];return gl.apply(this,arguments)}}
/* Mappernes overskrifter i kolonnen Lydtræk (kun med D2) */
{const gl=ne2Byg;window.ne2Byg=function(){const r=gl.apply(this,arguments);const v=$('ne-verden');if(!v)return r;v.querySelectorAll('.ne42-mappe').forEach(e=>e.remove());
 if(ne42Sort()==='d2'&&NE42.mapper){const x=(NE.kol.find(c=>c.k==='lydtraek')||{x:0}).x;NE42.mapper.forEach(h=>{const d=document.createElement('div');d.className='ne42-mappe';d.textContent=h.mappe;d.style.left=x+'px';d.style.top=(h.y-26)+'px';v.appendChild(d)})}return r}}
/* v9.92: koden bag Håndtag i billedet (prikker i scene-nodens billede, træk, ne42SaetHaand/ne42Liste/ne42Kort/ne42Prikker/ne42Tegn/ne42Ved) er fjernet; knappen forsvandt i v9.55. Flyt effekter i Live preview gør det samme. */
/* Kontrolpanelet: Sortér når intet er valgt */
{const gl=ne2Kp;window.ne2Kp=function(ny){gl(ny);const kp=$('ne-kp');if(!kp)return;const n=NE2.valgt&&NE2.N.get(NE2.valgt);
 if(!n){const h='<div class="ne-kp-svag ne42-sort">Sortér noderne <span class="ne-seg" role="group" aria-label="Sortér"><button class="ne-k'+(ne42Sort()==='figur'?' ne-paa':'')+'" data-ne42="sort" data-v="figur" title="Reglerne står i rækkefølgen figur → mål (som før).">Figur → mål</button><button class="ne-k'+(ne42Sort()==='d2'?' ne-paa':'')+'" data-ne42="sort" data-v="d2" title="Reglerne står efter deres lydtræk i mapper efter musik (D2), med en overskrift pr. mappe.">D2 (efter musik)</button></span></div>';
  kp.insertAdjacentHTML('beforeend',h);return}
 /* v9.55: knappen Håndtag i billedet er fjernet (brugerens fjerne-liste nr. 41) */}}
function ne42Start(){const rod=$('ne');if(!rod||!NE.byg){setTimeout(ne42Start,300);return}
 rod.addEventListener('click',e=>{const b=e.target.closest('[data-ne42]');if(!b)return;e.stopPropagation();if(b.dataset.ne42==='sort')ne42SaetSort(b.dataset.v)});
 try{if(!NE2.valgt)ne2Kp(true)}catch(e){}if(ne42Sort()==='d2'){NE2.sig='';try{ne2Byg()}catch(e){}}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ne42Start);else setTimeout(ne42Start,0);
{const gl=neKpPunkter;window.neKpPunkter=function(L){gl(L);if(!NE.byg)return;const k=(n,ikon,fn)=>L.push({n,kat:'Knapper · Node-editor',fn,ikon});
 k('Sortér: D2 (efter musik)','≡',()=>ne42SaetSort('d2'));k('Sortér: Figur → mål','≡',()=>ne42SaetSort('figur'))}}
/* ========== SLUT: D2 PÅ LÆRREDET ========== */
