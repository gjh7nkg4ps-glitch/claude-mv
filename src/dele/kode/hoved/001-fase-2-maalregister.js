/* ========== FASE 2: MÅLREGISTER ========== */
/* TARGETS er kilden til alle mål (effekter nu, egenskaber på objekter i trin 1). EFFECTS afledes, så mapping, EQ og Radial Mesh virker som før. */
const T=(id,navn,gruppe,flytbar,gnavn)=>({id,navn,gruppe,flytbar:!!flytbar,gnavn});
const TARGETS=[
 T('puls','Lys-puls','effekt',1),
 T('farve','Baggrundsfarve','effekt'),
 T('burst','Partikel-burst','effekt',1),
 T('bolge','Bølge i banen','effekt'),
 T('glod','Glød','effekt',1),
 T('ryst','Kamera-ryst','effekt'),
 T('fart','Banens fart','effekt'),
 T('zoom','Zoom-puls','effekt'),
 T('ring','Chokbølge-ring','effekt',1),
 T('strobe','Strobe-blink','effekt'),
 T('banelys','Spor-lys (alle 3)','effekt'),
 T('sky','Partikelsky','effekt',1),
 T('daempring','Dæmpningsringe','effekt',1),
 T('ekko','Ekko-skygger','effekt'),
 T('usikker','Usikkerhedssky','effekt'),
 T('fokus','Prioritet: fokus på de kraftigste levende kopier','effekt'),
 T('relation','Relationer (linjer mellem beslægtede levende kopier)','effekt'),
 T('hale','Halespor (på levende kopier)','effekt'),
 T('sloer','Dybdeskarphed (sløring af fjerne ting)','effekt'),
 T('slange','Slange: bølge','slange'),
 T('slange_farve','Slange: farveskift','slange')
];/* v9.81: målene lyd:klik, lyd:tone og lyd:suus (Lydlag) er fjernet; gamle regler slås fra med en besked (fjernetTjek) */
const EFFECTS=TARGETS.map(t=>[t.id,t.navn]);
/* ========== SLUT: MÅLREGISTER ========== */

