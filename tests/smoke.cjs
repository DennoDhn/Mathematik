"use strict";
const fs=require("node:fs");
const vm=require("node:vm");
const assert=require("node:assert/strict");
const path=require("node:path");
const base=path.resolve(__dirname,"..");
const window={};
const context={window};
vm.createContext(context);
for(const name of ["lessons.js","math-engine.js","curriculum.js","additional-lessons.js"])
 vm.runInContext(fs.readFileSync(path.join(base,name),"utf8"),context,{filename:name});
const {GROUPS,LESSONS}=window.MATHE_DATA;
assert.ok(Array.isArray(GROUPS)&&GROUPS.length>=9,"Themenwelten fehlen");
assert.ok(Array.isArray(LESSONS)&&LESSONS.length>=56,"Zu wenige Lektionen");
const ids=new Set();
for(const l of LESSONS){
 assert.ok(l.id&&!ids.has(l.id),"Doppelte/fehlende Lektion-ID: "+l.id);
 ids.add(l.id);
 assert.ok(GROUPS.some(g=>g.id===l.group),"Unbekannte Gruppe: "+l.id);
 for(const key of ["title","brief","why","example","explain","rule","trap"])
  assert.ok(typeof l[key]==="string"&&l[key].length>=5,l.id+": "+key+" fehlt");
 assert.ok(Array.isArray(l.steps)&&l.steps.length>=2,l.id+": Rechenschritte fehlen");
 assert.ok(Array.isArray(l.questions)&&l.questions.length>=3,l.id+": Übungen fehlen");
 for(const q of l.questions){
  for(const key of ["question","answer","hint","solution"])
   assert.ok(typeof q[key]==="string"&&q[key].trim(),l.id+": Frage "+key+" fehlt");
 }
}
const precache=fs.readFileSync(path.join(base,"sw.js"),"utf8");
for(const name of ["index.html","styles.css","app.js","lessons.js","math-engine.js","curriculum.js","additional-lessons.js","visuals.js","manifest.webmanifest","icon.svg","icons/icon-192.png","icons/icon-512.png","icons/apple-touch-icon.png"]){
 assert.ok(fs.existsSync(path.join(base,name)),"Datei fehlt: "+name);
 assert.ok(precache.includes('"./'+name+'"'),"Offline-Cache fehlt: "+name);
}
const manifest=JSON.parse(fs.readFileSync(path.join(base,"manifest.webmanifest"),"utf8"));
assert.equal(manifest.display,"standalone");
assert.equal(manifest.start_url,"./");
console.log("OK: "+LESSONS.length+" Lektionen, "+LESSONS.reduce((n,l)=>n+l.questions.length,0)+" Aufgaben, Offline-Ressourcen und PWA-Manifest.");
