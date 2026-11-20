/* ========== v9.109: PÅ SCENEN (PS3): ØJE OG SLÅ FRA PR. EFFEKT I NODER OG MATRIXEN, EFFEKTERNES NAVNE ==========
   docs/PLAN-PAA-SCENEN.md, trin PS3. Noder: en mål-node for en effekt (fx Lys-puls) viser effektens eget øje og Slå fra (klasserne ne-skjult og ne-fig-fra og
   "Skjult · " / "Slået fra · " i bunden), og mål-nodens kontrolpanel har knapperne Synlig/Skjult, Slå fra/til og styrken (data-ps3). Matrixen: kolonnens
   overskrift for en effekt har to små knapper (øje og ⏻, data-mxpo og data-mxpf) og bliver svag eller gennemstreget. Navne: Til (v9.100) skriver nu også
   navnene på de effekter, der slår til lige nu (over 0,05 og ikke skjult), i øverste venstre hjørne af Live preview (P8.15 punkt 1). Gruppernes øje og
   Slå fra i Noder bliver stående som "alle i gruppen". Alt gemmes i scene.ne.eff som i PS1 og dækkes af Ctrl+Z. */
const PS3={sidst:[]};
function ps3Er(e){return !!e&&psEffListe().some(t=>t.id===String(e))}
{const gl=ne2NodeHtml;window.ne2NodeHtml=function(n){let h=gl(n);if(!n||n.kol!=='maal'||!ps3Er(n.effect))return h;const q=psEff(n.effect);if(!q.skjult&&!q.fra)return h;
 h=h.replace('class="ne-node ne-n-maal','class="ne-node ne-n-maal'+(q.fra?' ne-fig-fra':'')+(q.skjult?' ne-skjult':''));const m=(q.skjult?'<span class="ne-gul">Skjult</span> · ':'')+(q.fra?'<span class="ne-gul">Slået fra</span> · ':'');if(m&&h.includes('<div class="ne-bund">'))h=h.replace('<div class="ne-bund">','<div class="ne-bund">'+m);return h}}
{const gl=ne2Kp;window.ne2Kp=function(ny){gl(ny);const n=NE2.valgt&&NE2.N.get(NE2.valgt),box=document.querySelector('#ne-kp .ne-kp-ind');if(!n||!box||n.kol!=='maal'||!ps3Er(n.effect)||box.querySelector('[data-ps3]'))return;const id=n.effect,q=psEff(id),st=psStyrkeAf('e:'+id);
 box.insertAdjacentHTML('afterbegin','<small>Effekten: øje, Slå fra og styrke (det samme som i På scenen og Biblioteket)</small><div class="ne-ret-knapper"><button class="ne-k'+(q.skjult?'':' ne-paa')+'" data-ps3="oeje" data-e="'+neHtml(id)+'" aria-pressed="'+!q.skjult+'" title="Øjet: skjul effekten på scenen; reglerne regner videre">'+(q.skjult?'⊘ Skjult':'◉ Synlig')+'</button><button class="ne-k'+(q.fra?' ne-paa':'')+'" data-ps3="fra" data-e="'+neHtml(id)+'" aria-pressed="'+!!q.fra+'" title="Slå fra: effektens regler giver 0, men den kan ses">'+(q.fra?'Slå til':'Slå fra')+'</button><span class="ne-kp-svag" title="Styrken ændres i På scenen (2 · Scene)">Styrke ×'+neTal(st)+'</span></div>')}}
(function(){const rod=$('ne');if(!rod)return;rod.addEventListener('click',e=>{const b=e.target.closest('[data-ps3]');if(!b)return;e.stopPropagation();const id=b.dataset.e;if(b.dataset.ps3==='oeje')psSaetOeje('e:'+id);else psSaetFra('e:'+id);NE2.sig='';try{ne2Byg()}catch(x){}try{ne2Kp(true)}catch(x){}})})();
/* matrixen: kolonnens overskrift */
function mxPsKl(e){if(!ps3Er(e))return '';const q=psEff(e);return (q.skjult?' mx-ps-af':'')+(q.fra?' mx-ps-fra':'')}
function mxPsKant(e){if(!ps3Er(e))return '';const q=psEff(e);return '<span class="mx-pk-r"><button class="mx-pk'+(q.skjult?' on':'')+'" data-mxpo="'+neHtml(e)+'" title="'+(q.skjult?'Skjult på scenen. Klik: vis igen':'Tegnes. Klik: skjul på scenen (reglerne regner videre)')+'" aria-pressed="'+!!q.skjult+'">'+(q.skjult?'⊘':'👁')+'</button><button class="mx-pk'+(q.fra?' on':'')+'" data-mxpf="'+neHtml(e)+'" title="'+(q.fra?'Slået fra: reglerne giver 0. Klik: slå til':'Slå fra: reglerne giver 0, men effekten kan ses')+'" aria-pressed="'+!!q.fra+'">⏻</button></span>'}
/* knapperne får deres egne lyttere, så kolonnens træk (pointer-capture på tabellen) ikke tager klikket */
{const gl=mxByg;window.mxByg=function(){const r=gl.apply(this,arguments);try{document.querySelectorAll('#ne-mx [data-mxpo],#ne-mx [data-mxpf]').forEach(b=>{if(b.dataset.ps3)return;b.dataset.ps3='1';b.addEventListener('pointerdown',e=>{e.stopPropagation()});b.addEventListener('click',e=>{e.stopPropagation();e.preventDefault();if(b.dataset.mxpo!==undefined)psSaetOeje('e:'+b.dataset.mxpo);else psSaetFra('e:'+b.dataset.mxpf);try{mxByg()}catch(x){}})})}catch(e){}return r}}
/* Navne: Til skriver også effekternes navne i et hjørne */
{const gl=pvNavneTegn;window.pvNavneTegn=function(g,W,H){gl(g,W,H);if(!pvNavneTil())return;const E=PS2.E||{};const L=psEffListe().filter(t=>!psEff(t.id).skjult&&(+E[t.id]||0)>.05).map(t=>t.navn.replace(/\s*\(.*$/,'')).slice(0,8);PS3.sidst=L;if(!L.length)return;
 g.save();g.font='600 11px IBM Plex Sans,Schibsted Grotesk,sans-serif';g.textAlign='left';g.textBaseline='top';L.forEach((t,i)=>{const y=8+i*15,tw=g.measureText(t).width;g.fillStyle='rgba(0,0,0,.5)';g.fillRect(6,y-2,tw+12,15);g.fillStyle='rgba(255,220,160,.95)';g.fillText('✦ '+t,10,y)});g.restore()}}
/* ========== SLUT: PÅ SCENEN (PS3): ØJE OG SLÅ FRA PR. EFFEKT I NODER OG MATRIXEN, EFFEKTERNES NAVNE ========== */



