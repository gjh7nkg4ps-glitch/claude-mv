/* ========== v4.1: OPSÆTNINGER PÅ COMPUTEREN ========== */
/* Gem alle (eller den valgte) af dine opsætninger i en fil (.json) på computeren, plus en tekstfil med et overblik: navn, hvornår den blev gemt, om den er låst, antal forbindelser, figurer og en liste over forbindelserne. Indlæs læser filen igen; pladser, der bliver overskrevet, nævnes, og der spørges to gange. Låste pladser springes over. */
function opsDato(iso){if(!iso)return 'ukendt tidspunkt';try{const d=new Date(iso);return d.toLocaleDateString('da-DK')+' kl. '+d.toLocaleTimeString('da-DK',{hour:'2-digit',minute:'2-digit'})}catch(e){return iso}}
function opsOverblik(n,d){const ml=Array.isArray(d.maps)?d.maps:[],ob=Array.isArray(d.objekter)?d.objekter:[],L=[];
 L.push('Opsætning '+slotNr(n)+(d.navn?' · '+d.navn:'')+(d.laast?' · LÅST':''));L.push('  Gemt: '+opsDato(d.gemt)+' · '+ml.length+(ml.length===1?' forbindelse · ':' forbindelser · ')+(()=>{const n=ob.filter(o=>!o.skabelon).length;return n+(n===1?' figur':' figurer')})()+' · master '+(d.master??1));
 if(ob.length)L.push('  Figurer: '+ob.filter(o=>!o.skabelon).map(o=>o.navn+' ('+(o.lag||[]).map(l=>FORMER[l.form]?FORMER[l.form][0]:l.form).join(', ')+')').join('; '));
 ml.forEach((m,i)=>{let e=m.effect;try{e=effName(m.effect)}catch(x){}L.push('  '+(i+1)+'. '+bandNavn(m.band)+' → '+e+' · tærskel '+m.thr+' · gain '+m.gain+(m.off?' · slået fra':''))});return L.join('\n')}
function opsHent(navn,tekst,type){try{const b=new Blob([tekst],{type}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=navn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1500);return true}catch(e){return false}}
function opsEksport(liste){const pl={};liste.forEach(n=>{const d=slotRead(n);if(d)pl[n]=d});const k=Object.keys(pl);if(!k.length){msg(liste.length===1?'Pladsen '+liste[0]+' er tom; der er intet at gemme.':'Du har ingen gemte opsætninger endnu.');return}
 const nu=new Date(),st=nu.toISOString().slice(0,16).replace('T','_').replace(':','-'),navn='claude-mv-opsaetninger_'+(k.length===1?k[0]+'_':'')+st;
 const ov='Claude MV · opsætninger gemt '+opsDato(nu.toISOString())+'\n'+k.length+' opsætning'+(k.length===1?'':'er')+': '+k.join(', ')+'\n\n'+k.map(n=>opsOverblik(n,pl[n])).join('\n\n')+'\n\nIndlæs filen '+navn+'.json igen under Opsætninger, Indlæs fra computer.\n';
 const data={program:'Claude MV',type:'opsaetninger',version:4.1,gemt:nu.toISOString(),overblik:ov.split('\n'),pladser:pl};
 const ok=opsHent(navn+'.json',JSON.stringify(data,null,1),'application/json');setTimeout(()=>opsHent(navn+'_overblik.txt',ov,'text/plain;charset=utf-8'),400);
 msg(ok?'Gemt på computeren: '+navn+'.json og '+navn+'_overblik.txt ('+k.join(', ')+'). Kig i mappen Overførsler. Spørger browseren, om siden må hente flere filer, så sig ja.':'Browseren tillod ikke at gemme filen her. Åbn programmet som fil på computeren, eller brug Preset som tekst.')}
async function opsImport(f){let d;try{d=JSON.parse(await f.text())}catch(e){msg('Filen kunne ikke læses som en opsætningsfil.');return}
 const pl=d&&d.pladser&&typeof d.pladser==='object'?d.pladser:null;if(!pl){msg('Filen indeholder ingen opsætninger (feltet pladser mangler).');return}
 const k=Object.keys(pl).filter(n=>SLOTS.includes(n)&&pl[n]&&Array.isArray(pl[n].maps));if(!k.length){msg('Filen indeholder ingen gyldige opsætninger.');return}
 const laaste=k.filter(n=>slotLaast(n)),nye=k.filter(n=>!laaste.includes(n)),over=nye.filter(n=>slotRead(n));
 if(!nye.length){msg('Alle pladserne i filen ('+k.join(', ')+') er låst her og bliver ikke overskrevet.');return}
 const t1='Filen indeholder '+k.length+' opsætning'+(k.length===1?'':'er')+': '+k.join(', ')+'.'+(over.length?' Disse pladser har allerede indhold og bliver OVERSKREVET: '+over.join(', ')+'.':' Ingen af dem overskriver noget.')+(laaste.length?' Låste pladser springes over: '+laaste.join(', ')+'.':'');
 const ja=over.length?await sikker({titel:'Indlæs fra computer?',tekst:t1,ok:'Ja, fortsæt',fare:true},{titel:'Er du helt sikker?',tekst:'Det, der står i '+over.join(', ')+' nu, bliver erstattet og kan ikke hentes igen (medmindre du har gemt det på computeren).',ok:'Ja, overskriv',fare:true}):(await spoerg({titel:'Indlæs fra computer?',tekst:t1,ok:'Indlæs'})).ok;
 if(!ja){msg('Indlæsning annulleret. Intet er ændret.');return}
 let n=0;nye.forEach(x=>{const v={...pl[x],laast:false};if(slotSkriv(x,v))n++});try{meshUI();opsOpdat()}catch(e){}msg(n+' opsætning'+(n===1?'':'er')+' indlæst fra '+f.name+': '+nye.join(', ')+'. Hent dem under Opsætninger eller Mine opsætninger.')}
/* ========== SLUT: OPSÆTNINGER PÅ COMPUTEREN ========== */




