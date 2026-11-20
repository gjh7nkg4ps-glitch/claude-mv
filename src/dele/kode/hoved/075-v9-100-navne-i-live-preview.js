/* ========== v9.100: NAVNE I LIVE PREVIEW ==========
   Brugerens P8.15 punkt 1: knappen Navne: Til · Fra i Live previews overskrift (#pv-navne, ved Klodsbane). Til: hver synlig figurs (og karakters) navn
   står med lille tekst lige under figurens midte (o.pos), så man kan se, hvad der er hvad. Fra som standard; valget huskes i set.pvNavne (gælder alle
   opsætninger). Tegnes i billedløkken efter figurerne (pvNavneTegn), kun på Live preview. Når "På scenen" (P8.14 punkt 7) er bygget, vises effekternes
   navne i et hjørne, fordi de virker på hele billedet. */
function pvNavneTil(){return set.pvNavne===true}
function pvNavneUI(){const b=$('pv-navne');if(!b)return;const til=pvNavneTil(),tx='Navne: '+(til?'Til':'Fra');if(b.textContent!==tx)b.textContent=tx;b.setAttribute('aria-pressed',String(til));b.classList.toggle('on',til)}
function pvNavneSkift(til){set.pvNavne=til===undefined?!pvNavneTil():!!til;try{lsGem('rytme-set',JSON.stringify(set))}catch(e){}pvNavneUI();msg(set.pvNavne?'Navne: hver figurs navn står ved figuren i Live preview.':'Navne: fra.')}
function pvNavneTegn(g,W,H){if(!pvNavneTil())return;g.save();g.font='600 11px IBM Plex Sans,Schibsted Grotesk,sans-serif';g.textAlign='center';g.textBaseline='top';
 fase2.objekter.forEach(o=>{if(!o.synlig||o.skabelon||!o.pos||!o.navn)return;const x=o.pos.x*W,y=o.pos.y*H+22,t=String(o.navn),tw=g.measureText(t).width;g.fillStyle='rgba(0,0,0,.55)';g.fillRect(x-tw/2-5,y-2,tw+10,16);g.fillStyle='rgba(255,241,220,.95)';g.fillText(t,x,y)});g.restore()}
{const b=$('pv-bane');if(b&&!$('pv-navne')){const n=document.createElement('button');n.id='pv-navne';n.setAttribute('aria-pressed','false');n.title='Navne: skriv hver figurs navn med lille tekst ved figuren i Live preview, så du kan se, hvad der er hvad. Fra som standard.';n.textContent='Navne: Fra';b.insertAdjacentElement('afterend',n);n.onclick=()=>pvNavneSkift()}}
pvNavneUI();setInterval(pvNavneUI,1000);
/* ========== SLUT: NAVNE I LIVE PREVIEW ========== */


