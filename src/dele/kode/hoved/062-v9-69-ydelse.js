/* ========== v9.69: YDELSE ==========
   Brugerens besked 17. november: programmet hakker nogle gange. Målt i testbrowseren (20 s afspilning med Pigernes show):
   1) Dockingen lagde zonerne om ved hvert billede (cirka 24 gange i sekundet): dkAnvend sendte en resize-hændelse, og lytteren til resize kaldte
      dkAnvend igen. Nu sendes resize kun, når zonernes mål eller aktive fane er ændret (DK.sig69, i dkAnvend), så det stopper efter én omgang.
   2) Sikker visning læste pixels fra Live preview ved hvert billede (getImageData får grafikkortet til at vente). Nu højst 12 gange i sekundet (blinkMaal).
   3) Værktøjstip blev sat på alle knapper, hver gang noget i siden ændrede sig (cirka 10 gange i sekundet). Nu kun på det nye, og alle hvert 5. sekund.
   4) Skarphed (Live preview) i Kvalitet: Fuld (skærmens skalering, som v9.38) · Højst 2× · 1× (set.skarp). Kvalitetsregulatoren må sænke den
      (trin 3: højst 2×, trin 4: 1×), og det står i Kvalitet, mens det sker. Valget Opløsning (kval.skala) er skjult: det virkede ikke på Live preview siden v9.38. */
const SK69={reg:0};
function sk69Loft(){const v=String(set.skarp||'fuld');return v==='1'?1:v==='2'?2:3}
function sk69Reg(){return set.kval&&set.kval.regulator?(REG.trin>=4?1:REG.trin>=3?2:3):3}
window.pvSkala=function(b){const dpr=Math.min(3,Math.max(1,(window.devicePixelRatio||1)*(typeof st9Zoom==='function'?st9Zoom():1)));/* v9.72: Størrelse regnes med */let sk=Math.min(dpr,sk69Loft());const r=sk69Reg();SK69.reg=r<sk?r:0;if(r<sk)sk=r;
 try{if(typeof UD!=='undefined'&&UD.pop&&!UD.pop.closed&&b&&b.clientWidth){const m=Math.min(3,(UD.pop.innerWidth*(UD.pop.devicePixelRatio||1))/b.clientWidth);if(m>sk)sk=m}}catch(e){}return sk};
function sk69UI(){const s=$('kv-skarp'),n=$('kv-skarp-nu'),s2=$('tb-skarp');const v=String(set.skarp||'fuld');if(s2&&s2.value!==v)s2.value=v;/* v9.70: også i menuen Lyd og ydelse */if(!s)return;if(s.value!==v)s.value=v;const dpr=Math.min(3,Math.max(1,window.devicePixelRatio||1)),c=$('pv');
 let txt='Skærmens skalering er '+dpr.toFixed(2).replace('.',',')+'×';if(c&&c.width)txt+=' · Live previews tegneflade er '+c.width+' × '+c.height+' punkter';if(SK69.reg)txt+=' · regulatoren har sænket skarpheden til '+SK69.reg+'×, fordi billedet går langsomt (trin '+REG.trin+' af 4)';if(n&&n.textContent!==txt)n.textContent=txt}
setInterval(sk69UI,500);
document.addEventListener('change',e=>{if(e.target&&(e.target.id==='kv-skarp'||e.target.id==='tb-skarp')){set.skarp=e.target.value;try{lsGem('rytme-set',JSON.stringify(set))}catch(x){}try{pvResize()}catch(x){}sk69UI();msg('Skarphed: '+({fuld:'Fuld (skærmens skalering)','2':'højst 2×','1':'1×'}[set.skarp]||set.skarp)+'.')}});
/* ========== SLUT: YDELSE ========== */

