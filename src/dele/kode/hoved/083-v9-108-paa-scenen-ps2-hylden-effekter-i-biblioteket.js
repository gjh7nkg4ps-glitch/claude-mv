/* ========== v9.108: PÅ SCENEN (PS2): HYLDEN EFFEKTER I BIBLIOTEKET ==========
   docs/PLAN-PAA-SCENEN.md, trin PS2 (godkendt i P8.20; P8.23 punkt 2). Biblioteket har hylden Effekter: ét kort pr. effekt (de 19 fra TARGETS med
   gruppe 'effekt') med et lille levende tegn (lyser efter effektens tal lige nu) og mærket "hele billedet". Det valgte kort: Brug = vis på scenen (øjet),
   Slå til/fra, Vis i matrix, Gem som regel-sæt, og regel-sættene til netop den effekt (valg C: kun sæt med sk.eff === id). De indbyggede regel-sæt
   (PS_SAET) hedder efter effekten, fx "Lys-puls på kick"; brugerens egne ligger i set.ne.effSaet (Lav en kopi, Omdøb, Slet, Gem som regel-sæt).
   Sættene ligger for sig (ikke i NE11_STD), så figurernes lister og test 80's fingeraftryk er uændrede. Regel: ['e', effekt, lydtræk, tærskel, styrke, attack, release].
   I På scenen (2 · Scene) åbner et klik på effektens navn kortet i Biblioteket. */
const PS2={E:null,t:0};
const PS_SAET=[
 {navn:'Lys-puls på kick',eff:'puls',regler:[['e','puls','kick',.25,1,15,220]]},
 {navn:'Lys-puls på snare',eff:'puls',regler:[['e','puls','snare',.3,1,10,180]]},
 {navn:'Baggrundsfarve på klangfarve',eff:'farve',regler:[['e','farve','centroid',0,1,250,400]]},
 {navn:'Baggrundsfarve på akkordrod',eff:'farve',regler:[['e','farve','hnd:akkordrod',0,1,40,600]]},
 {navn:'Partikel-burst på snare',eff:'burst',regler:[['e','burst','snare',.3,1,10,150]]},
 {navn:'Partikel-burst på kick',eff:'burst',regler:[['e','burst','kick',.3,1,8,150]]},
 {navn:'Bølge i banen på bas',eff:'bolge',regler:[['e','bolge','bas',.2,1,60,200]]},
 {navn:'Glød på hihat',eff:'glod',regler:[['e','glod','hihat',.35,.8,8,90]]},
 {navn:'Glød på vokal',eff:'glod',regler:[['e','glod','vokal',.3,1,40,300]]},
 {navn:'Kamera-ryst på flux',eff:'ryst',regler:[['e','ryst','flux',.6,.7,10,120]]},
 {navn:'Kamera-ryst på kick',eff:'ryst',regler:[['e','ryst','kick',.5,.6,5,120]]},
 {navn:'Banens fart på styrke',eff:'fart',regler:[['e','fart','rms',.1,1,200,500]]},
 {navn:'Zoom-puls på kick',eff:'zoom',regler:[['e','zoom','kick',.3,1,10,200]]},
 {navn:'Chokbølge-ring på snare',eff:'ring',regler:[['e','ring','snare',.35,1,5,250]]},
 {navn:'Chokbølge-ring på drop',eff:'ring',regler:[['e','ring','hnd:drop',.5,1,5,400]]},
 {navn:'Strobe-blink på hihat',eff:'strobe',regler:[['e','strobe','hihat',.4,.8,5,60]]},
 {navn:'Spor-lys på vokal',eff:'banelys',regler:[['e','banelys','vokal',.4,.8,80,300]]},
 {navn:'Partikelsky på bas',eff:'sky',regler:[['e','sky','bas',.25,1,80,400]]},
 {navn:'Dæmpningsringe på snare',eff:'daempring',regler:[['e','daempring','snare',.3,1,10,300]]},
 {navn:'Ekko-skygger på vokal',eff:'ekko',regler:[['e','ekko','vokal',.3,1,60,400]]},
 {navn:'Usikkerhedssky på flux',eff:'usikker',regler:[['e','usikker','flux',.4,1,40,300]]},
 {navn:'Prioritet på styrke',eff:'fokus',regler:[['e','fokus','rms',.2,1,100,400]]},
 {navn:'Relationer på mid',eff:'relation',regler:[['e','relation','mid',.2,1,100,400]]},
 {navn:'Halespor på kick',eff:'hale',regler:[['e','hale','kick',.3,1,10,300]]},
 {navn:'Dybdeskarphed på bas',eff:'sloer',regler:[['e','sloer','bas',.2,1,150,500]]}];
function psEffSaetMine(){set.ne=set.ne||{};if(!Array.isArray(set.ne.effSaet))set.ne.effSaet=[];return set.ne.effSaet}
function psSaetAlle(){const L=[];PS_SAET.forEach((sk,i)=>L.push({sk,std:true,i}));psEffSaetMine().forEach((sk,i)=>L.push({sk,std:false,i}));return L}
function psSaetFor(id){return psSaetAlle().filter(x=>x.sk&&x.sk.eff===id)}
function psSaetAf(k){const d=String(k).split(':');const L=d[1]==='std'?PS_SAET:psEffSaetMine();return{sk:L[+d[2]],std:d[1]==='std',i:+d[2]}}
function psEffGrp(id){try{return neFigurAf(id).navn}catch(e){return 'Andre effekter'}}
function psEffNavn(id){const t=TARGETS.find(x=>x.id===id);return t?t.navn:id}
function bibKortEffekter(){return psEffListe().map(t=>({k:'e:'+t.id,slags:'effekt',navn:t.navn,grp:psEffGrp(t.id),eff:t,tekst:t.navn+' virker på hele billedet, ikke på én ting på scenen.'}))}
{const gl=bibKort;window.bibKort=function(){return BIB.hylde==='effekter'?bibKortEffekter():gl.apply(this,arguments)}}
{const gl=bibMaerke;window.bibMaerke=function(k){return k&&k.slags==='effekt'?'Indbygget':gl.apply(this,arguments)}}
{const gl=blinkE;window.blinkE=function(E){PS2.E=E;return gl(E)}}
/* kortets billede: tegnet lyser efter effektens tal lige nu */
function psTegnEff(c,id){if(!c)return;const dp=Math.min(2,devicePixelRatio||1),W=Math.round(c.clientWidth*dp)||320,H=Math.round(W*9/16);if(c.width!==W)c.width=W;if(c.height!==H)c.height=H;const g=c.getContext('2d');if(!g)return;
 const q=psEff(id),v=q.skjult?0:Math.max(0,Math.min(1,+((PS2.E||{})[id])||0));g.clearRect(0,0,W,H);g.fillStyle='#130b08';g.fillRect(0,0,W,H);
 const r=Math.min(W,H)*(.2+.12*v),gr=g.createRadialGradient(W/2,H*.46,0,W/2,H*.46,r*2.4);gr.addColorStop(0,'rgba(255,198,89,'+(.18+.6*v).toFixed(2)+')');gr.addColorStop(1,'rgba(255,198,89,0)');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.fillStyle=q.skjult?'rgba(255,210,122,.35)':'#ffd27a';g.font='700 '+Math.round(r*1.5)+'px system-ui,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(PS_TEGN[id]||'✦',W/2,H*.46+2);
 g.fillStyle='rgba(255,230,210,.65)';g.font=Math.round(H*.11)+'px system-ui,sans-serif';g.fillText(q.skjult?'skjult på scenen':q.fra?'slået fra':'hele billedet',W/2,H*.88)}
{const gl=bibTegnBillede;window.bibTegnBillede=function(c,kort){if(kort&&kort.slags==='effekt'){psTegnEff(c,kort.eff.id);return}return gl.apply(this,arguments)}}
setInterval(()=>{try{if(BIB.hylde!=='effekter')return;const w=$('w36');if(!w||w.hidden||!w.getBoundingClientRect().width)return;document.querySelectorAll('#bib .bib-k[data-bib^="e:"] canvas').forEach(c=>psTegnEff(c,c.closest('.bib-k').dataset.bib.slice(2)))}catch(e){}},120);
/* det valgte kort */
function psDetalje(x){const id=x.eff.id,e=psEff(id),n=maps.filter(m=>String(m.effect)===id).length,S=psSaetFor(id),esc2=esc;
 let h='<div class="bib-dt"><b>'+esc2(x.navn)+'</b> <small class="bib-m bib-m-ind">Indbygget</small> <em class="ps-hele" title="Effekten virker på hele billedet, ikke på én ting på scenen">hele billedet</em></div>'
  +'<p class="small">'+(e.skjult?'Skjult på scenen (reglerne regner videre).':'Tegnes på scenen.')+' '+(e.fra?'Slået fra: reglerne giver 0.':'Slået til.')+' Styrke ×'+neTal(psStyrkeAf('e:'+id))+' · '+n+' regel'+(n===1?'':'r')+' · gruppen '+esc2(x.grp)+'. Øje, Slå fra og styrke står også i På scenen (2 · Scene).</p>'
  +'<div class="ab"><button data-biba="effvis" data-k="'+esc2(x.k)+'" title="'+(e.skjult?'Vis effekten på scenen igen':'Skjul effekten på scenen; reglerne regner videre')+'">'+(e.skjult?'Brug: vis på scenen':'Skjul på scenen')+'</button><button class="ghost" data-biba="efffra" data-k="'+esc2(x.k)+'" title="'+(e.fra?'Slå til igen':'Slå fra: reglerne giver 0, men effekten kan ses')+'">'+(e.fra?'Slå til':'Slå fra')+'</button><button class="ghost" data-biba="effmx" data-k="'+esc2(x.k)+'" title="Åbn 3 · Regler med matrixen; effektens regler står i dens kolonne">Vis i matrix</button><button class="ghost" data-biba="effgem" data-k="'+esc2(x.k)+'" title="Gem effektens regler, som de er nu, som et regel-sæt under Mine"'+(n?'':' disabled')+'>Gem som regel-sæt</button></div>'
  +'<h4>Regel-sæt til '+esc2(x.navn)+' ('+S.length+')</h4>'+(S.length?'<div class="bib-saet">'+S.map(q=>{const k='e:'+(q.std?'std':'mit')+':'+q.i,aaben=BIB.vis==='saet:'+k;return '<div class="bib-s'+(aaben?' bib-s-aaben':'')+'"><div class="bib-sh"><b>'+esc2(q.sk.navn)+'</b> <small class="bib-m bib-m-'+(q.std?'ind':'mit')+'">'+(q.std?'Indbygget':'Mit')+'</small> <small>'+q.sk.regler.length+' regel'+(q.sk.regler.length===1?'':'r')+'</small></div><div class="ab"><button data-biba="effsaetbrug" data-k="'+esc2(x.k)+'" data-s="'+k+'" title="Læg reglerne på effekten og vis den på scenen. Fortryd tager det af i ét trin.">Brug</button><button class="ghost" data-biba="effsaetregler" data-k="'+esc2(x.k)+'" data-s="'+k+'">'+(aaben?'Skjul reglerne':'Vis reglerne')+'</button>'+(q.std?'<button class="ghost" data-biba="effsaetkopi" data-k="'+esc2(x.k)+'" data-s="'+k+'">Lav en kopi</button>':'<button class="ghost" data-biba="effsaetomdoeb" data-k="'+esc2(x.k)+'" data-s="'+k+'">Omdøb</button><button class="ghost fare" data-biba="effsaetslet" data-k="'+esc2(x.k)+'" data-s="'+k+'">Slet</button>')+'</div>'+(aaben?'<ul>'+q.sk.regler.map(r=>'<li>'+esc2(bibRegelTekst(r))+'</li>').join('')+'</ul>':'')+'</div>'}).join('')+'</div>':'<p class="small">Ingen regel-sæt til denne effekt endnu. Lav regler i matrixen, og tryk Gem som regel-sæt.</p>');
 return h}
{const gl=bibDetalje;window.bibDetalje=function(x){if(x&&x.slags==='effekt')return psDetalje(x);return gl.apply(this,arguments)}}
function psBrugSaet(id,q){const sk=q.sk;let ny=0;bibDirekte(()=>{psEffSaet(id,'skjult',undefined);sk.regler.map(ne11Regel).forEach(r=>{if(r.type!=='e'||!TARGETS.some(t=>t.id===r.mal))return;const m={band:r.band,effect:r.mal,thr:r.thr??.3,gain:r.gain??1,att:r.att??20,rel:r.rel??200,curve:r.curve??1,gap:r.gap??120,min:true};if(r.inv)m.inv=true;const k=neKombFor(r.mal);if(k!=='max')m.komb=k;Regler.tilfoej(m,true);ny++});try{save();renderMaps()}catch(e){}});
 NE2.snavs=true;try{fg34Byg()}catch(e){}bibTegn();msg(sk.navn+': '+ny+' regel'+(ny===1?'':'r')+' lagt på '+psEffNavn(id)+', og effekten vises på scenen. Ctrl+Z tager det af igen.')}
function psGemSaet(id){const R=maps.filter(m=>String(m.effect)===id);if(!R.length){msg(psEffNavn(id)+' har ingen regler at gemme.');return}const L=psEffSaetMine(),navn=psEffNavn(id)+' (mine '+(L.filter(s=>s.eff===id).length+1)+')';
 L.push({navn,eff:id,regler:R.map(m=>['e',id,m.band,m.thr,m.gain,m.att,m.rel,m.curve,m.gap,m.inv?1:0])});try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}bibTegn();msg('Gemt som regel-sættet '+navn+' under Mine på hylden Effekter.')}
document.addEventListener('click',async e=>{const b=e.target.closest&&e.target.closest('#bib [data-biba^="eff"]');if(!b)return;const a=b.dataset.biba,x=bibFind(b.dataset.k);if(!x||x.slags!=='effekt')return;const id=x.eff.id;
 if(a==='effvis'){psSaetOeje('e:'+id);bibTegn();return}
 if(a==='efffra'){psSaetFra('e:'+id);bibTegn();return}
 if(a==='effmx'){try{lay3Anvend('ao-regler',true)}catch(x){}try{mxSaet(true)}catch(x){}msg(psEffNavn(id)+': reglerne står i matrixens kolonne for effekten (gruppen '+x.grp+').');return}
 if(a==='effgem'){psGemSaet(id);return}
 const q=b.dataset.s?psSaetAf(b.dataset.s):null;if(!q||!q.sk)return;
 if(a==='effsaetbrug'){psBrugSaet(id,q);return}
 if(a==='effsaetregler'){BIB.vis=BIB.vis==='saet:'+b.dataset.s?false:'saet:'+b.dataset.s;bibTegn();return}
 if(a==='effsaetkopi'){const L=psEffSaetMine();L.push({navn:q.sk.navn+' (kopi)',eff:id,regler:q.sk.regler.map(r=>r.slice())});try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}bibTegn();msg('Kopi lagt under Mine: '+q.sk.navn+' (kopi). Den kan omdøbes og slettes.');return}
 if(a==='effsaetomdoeb'&&!q.std){const r=await spoerg({titel:'Omdøb '+q.sk.navn,tekst:'Skriv det nye navn.',kode:true,ok:'Omdøb'});if(r.ok&&r.vaerdi){q.sk.navn=r.vaerdi.slice(0,40);try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}bibTegn()}return}
 if(a==='effsaetslet'&&!q.std){const r=await spoerg({titel:'Slet '+q.sk.navn+'?',tekst:'Regel-sættet slettes fra Mine. Det kan ikke fortrydes.',ok:'Ja, slet',fare:true});if(r.ok){psEffSaetMine().splice(q.i,1);try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}BIB.vis=false;bibTegn()}return}});
/* fra På scenen: et klik på effektens navn åbner kortet i Biblioteket */
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('#fg34 [data-psbib]');if(!b)return;e.stopPropagation();const id=b.dataset.psbib;try{bibVis('effekter')}catch(x){}BIB.valgt='e:'+id;BIB.vis=false;try{bibTegn()}catch(x){}});
/* ========== SLUT: PÅ SCENEN (PS2): HYLDEN EFFEKTER I BIBLIOTEKET ========== */
