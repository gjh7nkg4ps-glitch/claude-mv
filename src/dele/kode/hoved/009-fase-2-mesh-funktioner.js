/* ========== FASE 2: MESH-FUNKTIONER ========== */
let multiOn=false,multiUndo=null,soloOn=false,maerkOn=false;const puck={x:0,y:0,drag:false,base:null,snap:null},mcfg={x:'thr',y:'gain',grp:'alle'};
$('mx').innerHTML=opts(PAR.map(q=>[q[0],q[1]]),'thr');$('my').innerHTML=opts(PAR.map(q=>[q[0],q[1]]),'gain');
$('mg').innerHTML=opts([['alle','Alle'],['effekt','Effekter'],['klods','Klodser'],['slange','Slange'],['objekt','Figurer'],['lyd','Lyd']],'alle');
$('mx').onchange=e=>{mcfg.x=e.target.value;puckRebase()};$('my').onchange=e=>{mcfg.y=e.target.value;puckRebase()};$('mg').onchange=e=>{mcfg.grp=e.target.value;puckRebase()};
const inGrp=m=>mcfg.grp==='alle'||(TARGETS.find(t=>t.id===m.effect)||{}).gruppe===mcfg.grp;
function puckRebase(){puck.base=maps.map(m=>({...m}));puck.x=puck.y=0}
function puckApply(){let n=0;maps.forEach((m,i)=>{if(!puck.base||!puck.base[i]||!inGrp(m))return;n++;
  [[mcfg.x,puck.x],[mcfg.y,puck.y]].forEach(([f,v],k)=>{const d=PAR.find(q=>q[0]===f);if(!d)return;const lo=d[2],hi=d[3],st=d[4],cur=(k===1&&mcfg.x===mcfg.y)?m[f]:puck.base[i][f],nv=Math.max(lo,Math.min(hi,cur+v*(hi-lo)/2));m[f]=+(Math.round(nv/st)*st).toFixed(3)})});
meshRefresh();$('mlab').textContent='Multi-styring: '+n+' forbindelser, '+PAR.find(q=>q[0]===mcfg.x)[1]+' '+(puck.x>=0?'+':'')+puck.x.toFixed(2)+', '+PAR.find(q=>q[0]===mcfg.y)[1]+' '+(puck.y>=0?'+':'')+puck.y.toFixed(2)}
const xyc=$('xy');
function xyMove(e){const r=xyc.getBoundingClientRect(),W=xyc.width,H=xyc.height,cl=v=>Math.max(-1,Math.min(1,v));puck.x=cl(((e.clientX-r.left)/r.width*W-W/2)/(W/2-14));puck.y=cl(-((e.clientY-r.top)/r.height*H-H/2)/(H/2-14));puckApply()}
xyc.addEventListener('pointerdown',e=>{if(!puck.base)puckRebase();puck.drag=true;try{xyc.setPointerCapture(e.pointerId)}catch(x){}xyMove(e)});
xyc.addEventListener('pointermove',e=>{if(puck.drag)xyMove(e)});
xyc.addEventListener('pointerup',()=>{if(!puck.drag)return;puck.drag=false;puck.quiet=true;renderMaps();save();puck.quiet=false});
function drawXY(){if(!multiOn)return;const g=xyc.getContext('2d'),W=xyc.width,H=xyc.height,nx=PAR.find(z=>z[0]===mcfg.x)[1],ny=PAR.find(z=>z[0]===mcfg.y)[1];
 g.fillStyle='#0b0f14';g.fillRect(0,0,W,H);g.strokeStyle='rgba(255,255,255,.25)';g.lineWidth=1;g.setLineDash([3,4]);g.beginPath();g.moveTo(W/2,0);g.lineTo(W/2,H);g.moveTo(0,H/2);g.lineTo(W,H/2);g.stroke();g.setLineDash([]);
 g.fillStyle='#9fb0c0';g.font='10px Schibsted Grotesk,sans-serif';g.textAlign='left';g.fillText(nx+' −',4,H/2-4);g.textAlign='right';g.fillText(nx+' +',W-4,H/2-4);g.textAlign='center';g.fillText(ny+' +',W/2,11);g.fillText(ny+' −',W/2,H-4);
 const x=W/2+puck.x*(W/2-14),y=H/2-puck.y*(H/2-14);g.fillStyle=puck.drag?'#7dffb2':'#fff';g.shadowColor='#fff';g.shadowBlur=12;g.beginPath();g.arc(x,y,12,0,7);g.fill();g.shadowBlur=0;g.fillStyle='#0b0f14';g.font='800 11px Schibsted Grotesk,sans-serif';g.fillText('M',x,y+4);g.textAlign='left'}
$('mb-multi').onclick=()=>{multiOn=!multiOn;setTgl($('mb-multi'),multiOn,'Multi-styring');$('multibar').hidden=!multiOn;if(multiOn)puckRebase()};
$('mb-nulstil').onclick=()=>{if(puck.base){Regler.erstat(JSON.parse(JSON.stringify(puck.base)),true);puck.quiet=true;renderMaps();save();puck.quiet=false}puckRebase()};
const meshKey=n=>'rytme-mesh-'+n;
const STD_SNAP=JSON.stringify({m:DEFAULT.map(({min,...r})=>r),g:1}),NM={std:'Standard',A:'A',B:'B'},LEGACY={A:'rytme-mesh-1',B:'rytme-mesh-2'};
const mapSnap=()=>JSON.stringify({m:maps.map(({min,...r})=>r),g:gmaster}),snapStr=()=>JSON.stringify({m:maps.map(({min,...r})=>r),g:gmaster,o:fase2.objekter,p:pos,s:scene,y:lyd});
let meshSnap='';
function slotRead(n){try{let d=JSON.parse(localStorage.getItem('rytme-'+n));if(!d&&LEGACY[n])d=JSON.parse(localStorage.getItem(LEGACY[n]));if(!d)return null;return Array.isArray(d)?{maps:d}:d}catch(e){return null}}
function setTgl(b,on,txt){b.setAttribute('aria-checked',on?'true':'false');b.querySelector('span').textContent=txt+': '+(on?'Til':'Fra');b.classList.toggle('on',!!on)}
function meshUI(){['A','B'].forEach(n=>$('mb-'+n.toLowerCase()+'s').textContent=slotRead(n)?'gemt':'tom');
 if(active===null&&mapSnap()===STD_SNAP){active='std';meshSnap=snapStr()}
 [['std','mb-std'],['A','mb-a'],['B','mb-b']].forEach(([k,id])=>$(id).setAttribute('aria-pressed',active===k?'true':'false'));
 const dirty=active!==null&&snapStr()!==meshSnap;
 $('mb-stat').textContent=active===null?'Ingen opsætning er valgt. Det, du ser, er dine egne ændringer. Tryk Gem under "Gem nuværende som" for at beholde dem.':'Aktiv: '+navnAktiv(active)+(dirty?'. Ændret siden du hentede den. Tryk Gem for at beholde ændringerne.':'.');
 $('mb-stat').classList.toggle('dirty',dirty||active===null);
 $('abmsg').textContent='1: '+(slotRead('A')?'gemt':'tom')+', 2: '+(slotRead('B')?'gemt':'tom')+(active?', aktiv: '+navnAktiv(active)+(dirty?' (ændret)':''):'');
 document.querySelectorAll('[data-load]').forEach(b=>b.classList.toggle('on',b.dataset.load===active));opsOpdat()}
function slotSave(n,navn){const gl=slotRead(n);if(gl&&gl.laast){$('status').textContent='Opsætning '+slotNr(n)+' er låst og kan ikke overskrives. Lås den op først (koden står i manualen).';return false}
 const nv=(navn!==undefined?navn:(gl&&gl.navn))||'';let ok=false;try{lsGem('rytme-'+n,JSON.stringify({v:2,navn:nv,gemt:new Date().toISOString(),laast:!!(gl&&gl.laast),maps,master:gmaster,objekter:fase2.objekter,pos,scene,lyd}));ok=!!localStorage.getItem('rytme-'+n)}catch(e){}
 if(!ok){$('status').textContent='Kunne ikke gemme opsætning '+slotNr(n)+' (browseren tillader ikke lagring her).';return false}
 active=n;meshSnap=snapStr();$('status').textContent='Gemt som opsætning '+slotNr(n)+(nv?' ('+nv+')':'')+' (forbindelser, master, figurer, positioner, bane og lyd).';meshUI();return true}
function anvend(d,id,tekst,bevar){SHOW=d.show?showKopi(d.show):null;const tabt=active!==null&&snapStr()!==meshSnap?' Ændringer i '+navnAktiv(active)+' blev ikke gemt.':'';
 const rn=Rytme.renseObjekter(d.objekter||[]);renMsg(rn);const r=migrerMS(Rytme.fjernSignaler(d.maps).map(m=>({...m})),rn.objekter.length?rn.objekter:fase2.objekter,d.pos||pos);Regler.erstat(r.maps,true);gmaster=d.master??1;
 if(d.scene||!bevar)scene=sceneKopi(d.scene);if(d.lyd||!bevar)lyd=lydKopi(d.lyd);$('mmaster').value=gmaster;$('mmaster').nextElementSibling.textContent=gmaster;
 fase2.objekter=r.objekter;fase2.objekter.forEach(sikrEgenskaber);if(d.pos)Object.assign(pos,d.pos);
 meshSel=-1;syncTargets();syncHandles();try{formUI()}catch(e){console.error('Form-editoren kunne ikke tegnes ved opstart:',e);setTimeout(()=>{try{formUI()}catch(x){}},0)}sceneUI();lydUI();renderMaps();save();active=id;meshSnap=snapStr();meshUI();$('status').textContent=tekst+tabt+klodsHulTekst()}
function slotLoad(n){const d=slotRead(n);if(!d){$('status').textContent='Opsætning '+slotNr(n)+' er tom. Tryk Gem som '+slotNr(n)+' først.';return}anvend(d,n,'Opsætning '+slotNr(n)+(d.navn?' ('+d.navn+')':'')+' hentet.')}
document.querySelectorAll('[data-save]').forEach(b=>b.onclick=()=>gem(b.dataset.save));
document.querySelectorAll('[data-load]').forEach(b=>b.onclick=()=>slotLoad(b.dataset.load));
$('swap').onclick=()=>slotLoad(active==='A'?'B':'A');
$('mb-a').onclick=()=>slotLoad('A');$('mb-b').onclick=()=>slotLoad('B');$('mb-sa').onclick=()=>gem('A');$('mb-sb').onclick=()=>gem('B');
$('mb-std').onclick=()=>{const tabt=active!==null&&snapStr()!==meshSnap?' Ændringer i '+navnAktiv(active)+' blev ikke gemt.':'';gmaster=1;$('mmaster').value=1;$('mmaster').nextElementSibling.textContent=1;applyPreset(DEFAULT);meshSel=-1;meshRefresh();meshUI();$('status').textContent='Standardopsætning indlæst.'+tabt};
$('mb-auto').onclick=()=>{const had=!!F;autoSetup();$('status').textContent=$('gmsg').textContent;if(had)active=null;meshUI()};
/* ========== SLUT: MESH-FUNKTIONER ========== */

