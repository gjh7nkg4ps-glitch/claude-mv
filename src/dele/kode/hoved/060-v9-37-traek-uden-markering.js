/* ========== v9.37: TRÆK UDEN MARKERING ==========
   Fejl fundet af brugeren (video 8. november): en node kunne ikke trækkes; i stedet fulgte en svag kopi af teksten på skærmen musen, og musen viste 🚫.
   Grunden: et træk på kontrolpanelets tekst, kolonnernes overskrifter eller værktøjslinjen markerede tekst hen over noderne. Det næste træk i en node
   startede så browserens egen træk-og-slip af markeringen (fagudtryk: native drag and drop), som afbrød nodens træk (pointercancel).
   Rettelsen: (1) browserens træk-og-slip er slået fra i Node-editoren og zonernes fanebjælker, (2) en gammel markering ryddes, når man trykker dér,
   og (3) teksten dér kan ikke markeres (felter, man skriver i, kan stadig). */
function v937Her(t){t=t&&t.nodeType===1?t:t&&t.parentElement;return t&&t.closest?t.closest('#ne,.dk-bjaelke'):null}
document.addEventListener('dragstart',e=>{if(v937Her(e.target))e.preventDefault()},true);
document.addEventListener('pointerdown',e=>{if(e.button>0||!v937Her(e.target))return;if(e.target.closest('input,textarea,select,[contenteditable="true"]'))return;const s=getSelection();if(s&&s.rangeCount&&!s.isCollapsed)s.removeAllRanges()},true);
/* ========== SLUT: TRÆK UDEN MARKERING ========== */
