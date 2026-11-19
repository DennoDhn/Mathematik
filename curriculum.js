"use strict";
/* Class hints and prerequisite graph. Every lesson remains accessible by choice. */
(function(global){
 const meta={
  einmaleins:{grade:5,prerequisites:[]},
  reihenfolge:{grade:5,prerequisites:["einmaleins"]},
  bruchteile:{grade:6,prerequisites:[]},
  vergleichen:{grade:6,prerequisites:["bruchteile"]},
  kuerzen:{grade:6,prerequisites:["bruchteile"]},
  erweitern:{grade:6,prerequisites:["kuerzen"]},
  hauptnenner:{grade:6,prerequisites:["erweitern"]},
  bruchplus:{grade:6,prerequisites:["hauptnenner"]},
  bruchminus:{grade:6,prerequisites:["bruchplus"]},
  bruchmal:{grade:6,prerequisites:["bruchteile"]},
  bruchgeteilt:{grade:6,prerequisites:["bruchmal"]},
  dezimalstellen:{grade:6,prerequisites:["bruchteile"]},
  bruchkomma:{grade:6,prerequisites:["dezimalstellen","bruchteile"]},
  kommaplus:{grade:6,prerequisites:["dezimalstellen"]},
  kommamal:{grade:6,prerequisites:["kommaplus"]},
  kommageteilt:{grade:6,prerequisites:["kommamal"]},
  negativ:{grade:7,prerequisites:[]},
  vorzeichen:{grade:7,prerequisites:["negativ"]},
  prozente:{grade:7,prerequisites:["bruchkomma"]},
  prozentwert:{grade:7,prerequisites:["prozente"]},
  dreisatz:{grade:7,prerequisites:["einmaleins"]},
  gleichung:{grade:7,prerequisites:["reihenfolge"]},
  terme:{grade:7,prerequisites:["gleichung"]},
  einheiten:{grade:5,prerequisites:[]},
  umfang:{grade:5,prerequisites:["einheiten"]},
  flaeche:{grade:6,prerequisites:["umfang"]},
  volumen:{grade:6,prerequisites:["flaeche"]},
  winkel:{grade:6,prerequisites:[]},
  durchschnitt:{grade:6,prerequisites:["einmaleins"]},
  wahrscheinlichkeit:{grade:7,prerequisites:["bruchteile"]}
 };
 const known=new Set(Object.keys(meta));
 for(const [id,value] of Object.entries(meta)){
   if(value.prerequisites.some(p=>!known.has(p)))throw Error("Unbekannte Voraussetzung in "+id);
 }
 const metadata=lesson=>meta[lesson.id]||{grade:6,prerequisites:[]};
 global.MATHE_CURRICULUM={meta,metadata};
})(window);
