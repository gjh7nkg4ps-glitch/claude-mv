/* ========== v9.118: A3-KICK I LANGE SANGE ==========
   Rettelse til v9.117, fundet af testpakken (test 57). Kick regnes i lineær skala (A3), og lineær skala spreder styrken meget mere end den logaritmiske:
   et stykke, der er "fem gange svagere" i den gamle skala, er cirka 15 gange svagere i den lineære. "Lange sange" (normalisering i stykker på 2 minutter,
   kun sange over 10 minutter) må højst skrue et stille stykke 4 gange op (NORM_LOKAL.gulv = 0,25); det var ikke nok til den nye kick, så kick i de stille
   stykker af en lang sang nåede aldrig tærsklen. Nu må kick skrues 16 gange op (gulvet i anden potens, 0,0625), når A3 er til; alle andre lydtræk og
   sange under 10 minutter regnes som før. */
{const gl=normLokalF;window.normLokalF=function(){if(!a3Til())return gl.apply(this,arguments);const N=NORM_LOKAL,k0=N.noegler,g0=N.gulv;N.noegler=k0.filter(k=>k!=='kick');try{gl.apply(this,arguments)}finally{N.noegler=k0}
 if(N.aktiv&&F&&F.kick){N.gulv=g0*g0;try{F.kick=normLokalSerie(F.kick)}finally{N.gulv=g0}}}}
/* ========== SLUT: A3-KICK I LANGE SANGE ========== */


