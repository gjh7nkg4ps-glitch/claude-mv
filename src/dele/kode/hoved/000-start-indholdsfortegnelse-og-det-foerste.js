
/* ======================================================================
   CLAUDE MV · INDHOLDSFORTEGNELSE (lavet forfra i v9.7 ud fra blokkenes markeringer)
   Søg efter blokkens navn for at finde den. De fleste blokke slutter med "SLUT: NAVN".
   Blokkene står ved siden af det, de bygger på, ikke i versionsrækkefølge.
   Det forrige <script> indeholder Three.js r128 og dets glød-værktøjer (MIT) og motoren Rytme (analyse, kilder, forbindelsernes motor, figurtegning).
   Vigtige tilstande: maps (forbindelserne), fase2.objekter (figurerne), set (indstillinger, rytme-set), scene (bane, klods og Mesh 3D-lys, rytme-scene),
   F, A og SHOWPROFIL (analysen af sangen), M3 (Mesh 3D), OJ (Øjet), FG (samlinger med faner), SC_FANER (Scenens faner), LAY3 (topbarens layouts).
   Blokke i dette script (145), i den rækkefølge de står:
     1. FASE 2: MÅLREGISTER
     2. FASE 2: PRESET-MIGRERING
     3. FASE 2: AFSPILNING (robusthed og synlighed)
     4. v9.68: ANALYSENS FREMGANG OG ANNULLÉR
     5. v9.70: ANALYSEN I BAGGRUNDS-TRÅDE (S1)
     6. v9.66: TJEK AF SANGENS ANALYSE
     7. v9.62: LANGE SANGE: NORMALISERING I STYKKER
     8. v9.8: LYDMOTOR 2
     9. FASE 2: MESH-FUNKTIONER
    10. FASE 2: SCENE (trin 3): fundamentet
    11. FASE 2: KLODS-TIMING (trin 4)
    12. FASE 2: LYDLAG (trin 5)
    13. FASE 2: OPSÆTNINGER OG SIKKERHED
    14. v5.6: NYE FORUDINDSTILLINGER
    15. v6.6: DISKODRONNINGERNE
    16. v7.6: SINGLEN: GULD OG DIAMANT
    17. v5.7: 11 NYE FORUDINDSTILLINGER
    18. KVALITET OG YDELSE
    19. TOPBAR I FEM TRIN, HJÆLP OG TOOLTIPS
    20. SHOW: tilpas figurer og effekter til sangen
    21. PLAYER: volumen, mute, niveaumåler, spol og tastaturgenveje
    22. KNAPPERNES FARVER: en knap, der er trykket, lyser, og farven fortæller, hvad der skete
    23. SIKKER VISNING: blinkbegrænsning og bevægelsesdæmpning
    24. UDGANGSVINDUE: billedet til projektoren
    25. TIDSLINJE: zoom, valg af klip og A/B-sløjfe
    26. TILFÆLDIGT: forbindelser (slag, flydende, figur-egenskaber) med antal, behold eller erstat, frø og Fortryd
    27. FIGUR-GENERATOR: mange figurer på én gang (antal, lag, former, farver efter toneart, tekstur, ringe, kobling, frø og Fortryd)
    28. VINDUER: snap, aktivt vindue, layouts og topbarens størrelse
    29. LIVE PREVIEW: format og fuld skærm
    30. OPTAG VIDEO
    31. LYD IND (live)
    32. TAKTFØLGER (live)
    33. TRYK-OG-HOLD-TOOLTIPS (berøringsskærm)
    34. TASTATURSTYRING AF RADIAL MESH
    35. LYDSTATUS, LYDTEST OG FEJLLOG
    36. NUMRE PÅ VINDUER OG BOKSE
    37. DANSER: eksempel, Dansemapping og udseender
    38. FASE 2: FORM-EDITOR (trin 1 og 2)
    39. PERFECT 1 OG PERFECT 2 (lyd og vision)
    40. v5.1: EDITORENS EGENSKABER PR. NIVEAU (rest; feNiv er altid 4)
    41. v5.2: HÆNDELSER PÅ DE FÆRDIGE FIGURER
    42. v6.0: LEVENDE PRIKKER (Adfærd er fjernet i v9.75)
    43. v6.1: HÅNDTAG I EDITORENS BILLEDE
    44. v6.2: ADAPTIV TÆRSKEL (dynamiske tærskler; hed Tilpas til sangen)
    45. v6.4: EQ+ (udvidet EQ ved siden af den gamle)
    46. v7.0: SKABELON ERSTATTER DEN URØRTE FIGUR 1
    47. v6.9 / v7.1: MESH 3D (Radial Mesh i rigtig 3D med shaders)
    48. v7.5: DANSER BAGVED i Mesh 3D
    49. v7.9: Lys-opsætninger (gem og hent lys)
    50. v7.2: 💡 Lys-panelet
    51. v8.0: ØJET (fremtidslys)
    52. v8.1: Øjet, cyberpunk-finish
    53. v8.2: Øjet til lange mix: blokke og Adaptiv tærskel
    54. v8.2: 💡 Lys til Øjet
    55. v8.2: øjenlåg, blink og pupil ved drop
    56. v6.7: AKTIVT VINDUE ØVERST
    57. v6.8: SAMLINGER (faner som i Scene)
    58. v8.3: ARBEJDSFLADE, TOPBAR-LAYOUTS OG OPRYDNING
    59. v8.4: GAIN-STAKKEN VISES OG KORT OVER FORBINDELSERNE
    60. v8.5: LÅS VINDUER
    61. v8.6: MESH 3D-LYSPANELET I NY STIL, DIODER FØLGER ATTACK OG RELEASE, FULD VISNING MED EN VEJ UD, VINDUER INDENFOR
    62. v8.7: ZONE-TILSTAND (vinduessystem A)
    63. v8.8: BUNDBAR OG SIDEBJÆLKE (bygges og fjernes ved start siden v9.71)
    64. v8.9: LEVENDE BAGGRUND OG GLØD PÅ MÅLERNE
    65. v9.3: EDITOREN RYDDET OP
    66. v9.4: EDITORENS EGENSKABER I NY STIL
    67. v9.5: FORKLARINGER TIL DANSERENS OG DISKOKUGLENS EGENSKABER
    68. v9.6: LYDKILDE-KORTENE (Lydfil, Generator, Lyd ind; i Sang siden v9.76)
    69. v9.10: SIGNALTYPER (D2)
    70. v9.9: MOTORENS KÆDE: HYSTERESE, HOLD OG SLEW (fra Router 2.0)
    71. v9.40: HOLD-TRIN, STANDARDKÆDE OG KILDELISTE (fra Router 2.0)
    72. v9.12: FJERNEDE KILDER
    73. v9.13: SMALLE BÅND FOLDET SAMMEN
    74. v9.13: TAKTSLAG AUTO
    75. v9.15: 4 SPOR (STEMS)
    76. v6.3: SØG (Ctrl+K); sidebjælken og transporten nederst er fjernet i v9.71
    77. Søg (kommandopalet)
    78. FASE 2: MESH-LINJER (tykkelse og lys-flow)
    79. FASE 2: SOLO OG MÆRK PREVIEW
    80. v9.35: EFFEKT-GRUPPERNES NAVNE (fra Dublet)
    81. v4.0: NUMRE PÅ KNAPPER, DROPDOWNS OG FELTER (slået fra siden v9.71)
    82. v4.9: FLERE MÅDER AT FØDES PÅ
    83. v5.9: TAKT I REALTID SOM KILDE OG HÆNDELSE
    84. v5.3: VINDUESLISTEN NIV_VIN OG nivAnvend (rest af Niveau)
    85. v5.8: SCENE-VINDUET
    86. v4.1: OPSÆTNINGER PÅ COMPUTEREN
    87. v9.19: NODE-EDITOR (TRIN 1): LÆRRED, ZOOM, TEMA OG KONTROLPANEL
    88. v9.20: NODE-EDITOR (TRIN 2): REGLERNE VISES
    89. v9.21: NODE-EDITOR (TRIN 3): LYDKILDE, FFT OG ANALYSER
    90. v9.22: NODE-EDITOR (TRIN 4): RET EN REGEL
    91. v9.23: NODE-EDITOR (TRIN 5): LAV OG SLET REGLER
    92. v9.24: NODE-EDITOR (TRIN 6): + TILFØJ OG CTRL+K
    93. v9.26: NODE-EDITOR (TRIN 8): FLERE REGLER PÅ ÉT MÅL
    94. v9.27: NODE-EDITOR (TRIN 9): TRIM OG FIGUR-STYRKE
    95. v9.28: NODE-EDITOR (TRIN 10): LÆR OG ADAPTIV TÆRSKEL
    96. v9.29: NODE-EDITOR (TRIN 11): SKABELONER
    97. v9.30: NODE-EDITOR (TRIN 12): SCENE-NODER OG EFFEKT-GRUPPER
    98. v9.31: NODE-EDITOR (TRIN 13): ZOOM UD, KUN VALGT KÆDE, DÆMP OG TASTATUR
    99. v9.32: NODE-EDITOR (TRIN 14): LINJER OG GLØD I TSL
   100. v9.33: NODE-EDITOR (TRIN 15): PAPIRETS NAVNE
   101. v9.34: NODE-EDITOR (TRIN 16): KORT OVER FORBINDELSERNE I CTRL+K
   102. v9.36: DOCKING (VINDUESSYSTEM C)
   103. v9.67: DE FIRE ARBEJDSOMRÅDER
   104. v9.37: TRÆK UDEN MARKERING
   105. v9.38: ALTID SKARPT
   106. v9.69: YDELSE
   107. v9.71: ÉN LINJE ØVERST
   108. v9.72: ÉT TEMA, STØRRELSE OG INDSTILLINGER
   109. v9.74: FIGURER, SCENE OG EGENSKABER
   110. v9.107: PÅ SCENEN (PS1): KARAKTERER, FIGURER OG EFFEKTER
   111. v9.75: VIS I MATRIX
   112. v9.76: SANG-VINDUET
   113. v9.77: LYD OVER TID
   114. v9.78: KORTET NIVEAU (LUFS, topværdi, klip)
   115. v9.79: KORTET STEREO (goniometer)
   116. v9.80: SPOR MED M/S
   117. v9.81: SKJULTE VINDUER OG FJERNEDE LYDLAG-MÅL (oprydning)
   118. v9.82: KLODSBANEN SLÅS TIL I SCENEN
   119. v9.100: NAVNE I LIVE PREVIEW
   120. v9.83: DØD KODE FJERNET (kun en kommentar)
   121. v9.84: SLÅ ET LYDTRÆK FRA (I STEDET FOR PARKÉR)
   122. v9.85: OPSÆTNINGERNE RYDDET OP (FORINDST, OPS_TEST, Nulstil)
   123. v9.86: STARTSKÆRM OG INDLÆST
   124. v9.104: GEMNING DER SIGER TIL, ? OG NYT PÅ STARTSKÆRMEN
   125. v9.106: GEM HELE ARBEJDET (D6)
   126. v9.122: AUTOSIKRING (T1)
   127. v9.87: BIBLIOTEKET
   128. v9.108: PÅ SCENEN (PS2): HYLDEN EFFEKTER I BIBLIOTEKET
   129. v9.109: PÅ SCENEN (PS3): ØJE OG SLÅ FRA PR. EFFEKT I NODER OG MATRIXEN, EFFEKTERNES NAVNE
   130. v9.89: ÉN VÆRKTØJSLINJE I NODE-EDITOREN
   131. v9.99: VÆRKTØJSLINJEN PASSER (⋯ MERE)
   132. v9.41: DE 10 VISNINGER I NODE-EDITOREN
   133. v9.42: D2 PÅ LÆRREDET
   134. FÆLLES INDGANG TIL REGLERNE (v9.43)
   135. v9.51: MATRIXEN
   136. v9.63: FORESLÅ REGLER
   137. v9.65: PANELET AUTOMATIK
   138. v9.61: NODE-EDITOR: OPSTILLINGER, KOLONNENAVNE DER FØLGER MED, OG SIKRING MOD EN TOM FLADE
   139. v9.105: GITTER: RET OP, A/B/C, LUFT-SKYDERE OG KÆMPE OPSTILLINGER
   140. v9.110: ANALYSE SIKKERHED (A0)
   141. v9.111: KOLONNENAVNE FAST ØVERST I NODE-EDITOREN
   142. v9.116: RIGTIGE TROMMER MED FACIT (MDB DRUMS)
   143. v9.117: BEDRE SLAG OG TAKT (A3, FØRSTE DEL)
   144. v9.118: A3-KICK I LANGE SANGE
   145. v9.119: TESTLYDEN KAN HØRES OG GEMMES
   ====================================================================== */


/* Rytme-editor v2: fase 2, trin 0. Opfører sig som v1; kun forberedelse. */
const {TAU,SKALAER,mtof,SCENE0,sceneKopi,LYD0,lydKopi,PROPS,FORMER,FAELLES,propsFor,uiProps,tidOf,nyEgenskaber,nyObjekt,MS_FRA,MS_TIL,MS_MAP,nyMorgenstjerne,migrerMS,migrer,showKopi,vaerdi,spin,rundPoly,formSti,tegnObj}=Rytme; /* alt dette ligger i runtime/render-runtime.js */
const BANDS=[['bas','Bas 20–250 Hz'],['mid','Mid 250–2k'],['hmid','Høj-mid 2–6k'],['brill','Brilliance 6–16k'],['rms','RMS'],['centroid','Spectral centroid'],['flux','Spectral flux'],['rolloff','Spectral rolloff'],['flat','Spectral flatness'],['zcr','Zero crossing rate'],['kick','Slag, dyb (kick)'],['snare','Slag, midt (snare)'],['hihat','Slag, høj (hihat)'],['vokal','Vokal 200–900 Hz']];
