/* ========== v9.85: OPSÆTNINGERNE RYDDET OP (FORINDST, OPS_TEST, Nulstil) ==========
   Brugerens B1 (P8.6): kun 10 færdige opsætninger bliver (FORINDST); 23 er fjernet sammen med deres funktioner, Random alt: skift automatisk,
   trommeslageren (opTrommer, showet Trommeslagerens solo, knappen under + Ny figur) og blokken FEST.
   Det, koden brugte, er flyttet hertil: opsNulstilVisuelt() er det, opsætningen Nulstil (vis) gjorde (knappen Nulstil bane, klods, figurer og lyd
   i Opsætninger); DEFAULT (Standards 11 regler) bruges stadig ved første start. OPS_TEST er tre fjernede opsætninger (Standard, Alle effekter,
   Alle effekter + figurer), som testpakken bygger på; de står ikke i nogen liste på skærmen og hentes kun med brugFor(id) fra en test.
   Alt indbygget er beskyttet af tests/80-indbygget.js (fingeraftryk i tests/indbygget.json). */
function opsNulstilVisuelt(){return{maps:kl(DEFAULT),master:1,scene:kl(SCENE0),lyd:lydKopi(null),objekter:[Object.assign(nyObjekt(),{synlig:false})],pos:kl(POS0)}}
const OPS_TEST={std:{id:'std',navn:'Standard',aktiv:'std',lav:()=>({maps:kl(DEFAULT),master:1})},
 fuld1:{id:'fuld1',navn:'Alle effekter',lav:()=>({maps:fuldBase(),master:1})},
 fuld2:{id:'fuld2',navn:'Alle effekter + figurer',lav:()=>{const o=fuldObjekter();return{maps:[...fuldBase(),...o.maps],objekter:o.objekter,master:1}}}};
/* ========== SLUT: OPSÆTNINGERNE RYDDET OP ========== */

