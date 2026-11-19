"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,".."),ctx={window:{}};
vm.createContext(ctx);
for(const file of ["lessons.js","math-engine.js","curriculum.js","additional-lessons.js","tutorials.js"]){
 vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),ctx,{filename:file});
}
const data=ctx.window.MATHE_DATA,t=ctx.window.MATHE_TUTORIALS,engine=ctx.window.MATHE_ENGINE;
assert.equal(data.LESSONS.length,56,"56 Lektionen erforderlich");
assert.equal(Object.keys(t.WORLDS).length,9,"Alle neun Themenwelten brauchen eigene Einführungen");
for(const world of data.GROUPS){
 const w=t.WORLDS[world.id];
 assert.ok(w&&w.lead.length>=70&&w.why.length>=70,"Fehlende Themenwelteinführung: "+world.id);
 assert.equal(w.map.length,3);
}
let examples=0;
for(const lesson of data.LESSONS){
 const course=t.get(lesson);
 assert.equal(course.terms.length,3,"Drei Theorieabschnitte fehlen: "+lesson.id);
 for(const section of course.terms)assert.ok(section.label&&section.text.length>=70,"Theorie zu kurz: "+lesson.id);
 assert.equal(course.practice.length,3,"Drei gemeinsame Aufgaben fehlen: "+lesson.id);
 for(const example of course.practice){
  assert.ok(example.question&&example.answer&&example.steps.length===2,lesson.id+": Unvollständiges Beispiel");
  assert.equal(engine.check(example.answer,{question:example.question,answer:example.answer}).correct,true,"Antwortfehler im Unterricht: "+lesson.id);
  examples++;
 }
}
const html=fs.readFileSync(path.join(root,"index.html"),"utf8"),sw=fs.readFileSync(path.join(root,"sw.js"),"utf8"),app=fs.readFileSync(path.join(root,"app.js"),"utf8");
assert.ok(html.includes('src="./tutorials.js"'),"Unterrichtsskript fehlt in HTML");
assert.ok(html.indexOf('src="./tutorials.js"')<html.indexOf('src="./app.js"'),"Unterricht muss vor App geladen werden");
assert.ok(sw.includes('"./tutorials.js"'),"Offline-Cache enthält Unterricht nicht");
assert.ok(app.includes('case "classroom"'),"Unterricht ist nicht erreichbar");
assert.ok(app.includes("teach-next-example"),"Schrittweises gemeinsames Rechnen fehlt");
assert.ok(app.includes("theoryCompleted:true"),"Unterrichtsfortschritt wird nicht gespeichert");
console.log("PASS: 9 Themenwelten, 56 Theorieunterrichte, "+examples+" begleitete Übungsbeispiele, App-/Offline-Einbindung.");
