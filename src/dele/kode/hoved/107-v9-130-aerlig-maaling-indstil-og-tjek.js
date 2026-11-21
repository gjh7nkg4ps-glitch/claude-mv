
/* ========== v9.130: ÆRLIG MÅLING · INDSTIL OG TJEK (P8.33 TRIN 1) ==========
   Hovedchattens P8.33 trin 1 (brugerens valg N1): rampen for fasens sikkerhed (v9.123) og flere vægte i A3 er valgt på de samme 23 stykker, som de måles på,
   så tallene kan være for pæne (fagudtryk: overfitting). Nu er Rigtige trommer delt i to faste grupper (fagudtryk: tuning set og test set):
   - indstil (12): 80sRock, BebopJazz, CoolJazz, Disco, FunkJazz, Grunge, Hendrix, ModalJazz, Reggae, Rockabilly, SpeedMetal, Zeppelin;
   - tjek (11): Beatles, Britpop, Country1, FreeJazz, FusionJazz, Gospel, LatinJazz, Punk, Rock, Shadows, SwingJazz.
     Hvert andet stykke i alfabetisk rækkefølge; Gospel og Grunge er byttet, så hver gruppe har ét stykke på 222 BPM. Jazz og rock er i begge.
     Andre navne (fx en testmappe): hvert andet i alfabetisk rækkefølge blandt dem.
   - Hver celle viser også tallet for tjek-gruppen alene (det ærlige tal); rapporten har indstil og tjek pr. række. Fra nu af vælges nye vægte og tærskler
     kun på indstil.
   - Målt igen på indstil (12 stykker), tjekket på tjek (11):
     a) Rampen for fasens sikkerhed med toner: 0,40 + 0,50 × enighed / 0,25, højst 0,90 (før 0,20 + 0,75 × enighed / 0,25, højst 0,95). Brier-score
        (lavere er bedre; altid 50 % giver 0,25): tjek 0,070 (et fast tal giver 0,172). En fri tilpasning af alle tre tal ramte indstil bedre (0,136), men
        tjek dårligere (0,125): overtilpasning. Uden toner (kun trommer) duer rampen ikke: tjek 0,27–0,33, dårligere end 0,25; forslag i STATUS.
     b) Den halve takt (A3, v9.117; faktoren A3.HALV): valgt på indstil ville faktor 1,0 give hele mixets Taktslag 77 → 91, men tjek falder 86 → 80 og
        Takt 1 80 → 74 (Testlyden ville stige 49 → 81): overtilpasning, så 1,6 bliver. "Aldrig flyt" er dårligere på tjek (Takt 1 80 → 69; 4 spor
        Taktslag 82 → 82, Takt 1 80 → 70), så reglen er ærligt bekræftet. Breakbeat rammer stadig ikke: dens kick ligger mest på modslaget (musikken). */
const MDBG={INDSTIL:['80sRock','BebopJazz','CoolJazz','Disco','FunkJazz','Grunge','Hendrix','ModalJazz','Reggae','Rockabilly','SpeedMetal','Zeppelin'],TJEK:['Beatles','Britpop','Country1','FreeJazz','FusionJazz','Gospel','LatinJazz','Punk','Rock','Shadows','SwingJazz'],navne:[]};
function mdbGruppe(navn){const k=String(navn).replace(/^MusicDelta_/,'');if(MDBG.TJEK.includes(k))return 'tjek';if(MDBG.INDSTIL.includes(k))return 'indstil';
 const u=MDBG.navne.filter(n=>{const q=String(n).replace(/^MusicDelta_/,'');return !MDBG.TJEK.includes(q)&&!MDBG.INDSTIL.includes(q)}).sort(),i=u.indexOf(navn);return i>=0&&i%2===1?'tjek':'indstil'}
{const gl=mdbFind;window.mdbFind=function(files){const L=gl(files);MDBG.navne=L.map(x=>x.navn);return L}}
function mdbGrpLed(r,navn,o){const g=mdbGruppe(navn),G=r.grp||(r.grp={indstil:{hit:0,n:0,fa:0,ov:0,neu:0,stk:0},tjek:{hit:0,n:0,fa:0,ov:0,neu:0,stk:0}}),q=G[g];['hit','n','fa','ov','neu'].forEach(x=>q[x]+=o[x]||0);q.stk++}
function mdbGrpS(r){if(r&&r.grp)for(const g in r.grp)r.grp[g].s=r.grp[g].stk?asF(r.grp[g]):null}
/* tallet for tjek-gruppen i hver celle */
{const gl=mdbCelle;window.mdbCelle=function(r){const t=gl(r),q=r&&r.grp&&r.grp.tjek;if(!q||!q.stk||q.s==null)return t;const i=r.grp.indstil;
 return t.replace(/<\/span><\/td>$/,' · <b class="mdb-tjek" title="'+neHtml('Tjek-gruppen alene ('+q.stk+' stykker): det ærlige tal, fordi vægte og tærskler vælges på indstil-gruppen ('+(i&&i.stk?i.stk+' stykker giver '+i.s:'ingen')+').')+'">tjek '+q.s+'</b></span></td>')}}
{const gl=mdbHtml;window.mdbHtml=function(){return gl().replace('<summary>Sådan måles rigtige trommer</summary>','<summary>Sådan måles rigtige trommer</summary><p class="small"><b>Indstil og tjek</b> (fagudtryk: tuning set og test set; fra v9.130): de 23 stykker er delt i to faste grupper, hvert andet stykke i alfabetisk rækkefølge (Gospel og Grunge er byttet, så hver gruppe har ét stykke på 222 BPM). Vægte og tærskler vælges kun på <b>indstil</b> ('+MDBG.INDSTIL.join(', ')+'). Tallet <b>tjek</b> i hver celle er målt på tjek-gruppen alene ('+MDBG.TJEK.join(', ')+') og er det ærlige tal; det store tal er alle stykker.</p>')}}
{const gl=asRapport;window.asRapport=function(){let t=gl();const D=MDB.data;if(!D||!D.res)return t;const L=[];
 MDB.V.forEach(([v,nv])=>{const rk=MDB.R.filter(([k])=>D.res[v][k]&&D.res[v][k].grp).map(([k,n])=>{const g=D.res[v][k].grp;return n+' indstil '+(g.indstil.s==null?'–':g.indstil.s)+' / tjek '+(g.tjek.s==null?'–':g.tjek.s)});if(rk.length)L.push(nv+' · indstil og tjek: '+rk.join(' · '))});
 return L.length?t+'\n'+L.join('\n'):t}}
/* ========== SLUT: ÆRLIG MÅLING · INDSTIL OG TJEK (P8.33 TRIN 1) ========== */
