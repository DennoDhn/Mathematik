"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),path=require("node:path");
const root=path.resolve(__dirname,"..");
const context={window:{},document:{addEventListener(){}},console};vm.createContext(context);
const modules=["lessons.js","math-engine.js","curriculum.js","additional-lessons.js","visuals.js"];
for(const file of modules)vm.runInContext(fs.readFileSync(path.join(root,file),"utf8"),context,{filename:file});
const {LESSONS,GROUPS}=context.window.MATHE_DATA;
const engine=context.window.MATHE_ENGINE,curr=context.window.MATHE_CURRICULUM;
assert.equal(LESSONS.length,56,"Unexpected curriculum size");
assert.equal(GROUPS.length,9,"Missing subject groups");
assert.equal(new Set(LESSONS.map(l=>l.id)).size,LESSONS.length,"Duplicate lesson IDs");
for(const group of GROUPS)assert.ok(LESSONS.some(l=>l.group===group.id),"Empty topic: "+group.id);
let checks=0;
for(const l of LESSONS){
 assert.ok(GROUPS.some(g=>g.id===l.group),"Invalid group for "+l.id);
 assert.ok(curr.meta[l.id]&&Number.isInteger(curr.meta[l.id].grade),"Missing grade for "+l.id);
 for(const parent of curr.meta[l.id].prerequisites)assert.ok(LESSONS.some(x=>x.id===parent),"Invalid prerequisite "+parent);
 for(const field of ["title","brief","why","example","explain","rule","trap"])
  assert.ok(typeof l[field]==="string"&&l[field].length>6,"Incomplete "+field+" in "+l.id);
 assert.ok(l.steps.length>=2,"Missing tutorial steps in "+l.id);
 assert.ok(l.questions.length>=3,"Too few exercises in "+l.id);
 for(const q of l.questions){
  for(const field of ["question","answer","hint","solution"])assert.ok(typeof q[field]==="string"&&q[field].trim(),"Missing "+field+" for "+l.id);
  assert.equal(engine.check(q.answer,q).correct,true,"Original expected answer rejected in "+l.id+": "+q.question+" -> "+q.answer);
  checks++;
 }
 for(let seed=1;seed<=50;seed++){
  const questions=engine.createSet(l,seed);
  assert.ok(questions.length>=3,"No practice tasks in "+l.id);
  for(const q of questions){
   assert.equal(engine.check(q.answer,q).correct,true,"Generated expected answer rejected in "+l.id+": "+q.question+" -> "+q.answer);
   checks++;
  }
 }
}
function test(name,value,task,want){assert.equal(engine.check(value,task).correct,want,name);checks++;}
test("Equivalent fraction", "2/4",{question:"Eine Hälfte als Bruch?",answer:"1/2"},true);
test("Equivalent fraction as probability", "3/6",{question:"Wahrscheinlichkeit als Bruch?",answer:"1/2"},true);
test("Fraction must be simplified","2/4",{question:"Kürze vollständig",answer:"1/2"},false);
test("Correct simplified fraction","1/2",{question:"Kürze vollständig",answer:"1/2"},true);
test("Wrong expansion factor","6/12",{question:"Erweitere 1/2 mit 3",answer:"3/6"},false);
test("Correct expansion","3/6",{question:"Erweitere 1/2 mit 3",answer:"3/6"},true);
test("German comma","0,75",{question:"als Dezimalzahl",answer:"0,75"},true);
test("English dot also supported","0.75",{question:"als Dezimalzahl",answer:"0,75"},true);
test("Mixed number","2 1/3",{question:"7/3 als gemischte Zahl",answer:"2 1/3"},true);
test("Ratio format","1:2",{question:"Vereinfache Verhältnis 4:8",answer:"1:2"},true);
test("Precise rounding","2",{question:"Runde 1,995 auf zwei Nachkommastellen",answer:"2,00"},false);
test("Precise rounding correct","2,00",{question:"Runde 1,995 auf zwei Nachkommastellen",answer:"2,00"},true);
test("Cannot divide by zero","1/0",{question:"ein Halb",answer:"1/2"},false);
test("Unary minus","-6",{question:"-2 × 3",answer:"-6"},true);
test("Percent correct","20%",{question:"0,2 als Prozent?",answer:"20%"},true);
test("Percent wrong","25%",{question:"0,2 als Prozent?",answer:"20%"},false);
assert.equal(engine.generator("kuerzen",123).map(q=>q.question).join("|"),engine.generator("kuerzen",123).map(q=>q.question).join("|"),"Seed reproducibility");
const sw=fs.readFileSync(path.join(root,"sw.js"),"utf8");
const html=fs.readFileSync(path.join(root,"index.html"),"utf8");
for(const name of ["index.html","styles.css","lessons.js","math-engine.js","curriculum.js","additional-lessons.js","visuals.js","app.js","manifest.webmanifest","icon.svg"]){
 assert.ok(fs.existsSync(path.join(root,name)),"Asset missing: "+name);
 assert.ok(sw.includes('"./'+name+'"'),"Offline cache excludes "+name);
}
for(const name of modules.concat(["app.js"]))assert.ok(html.includes('src="./'+name+'"'),"HTML does not include "+name);
assert.ok(sw.includes("skipWaiting")&&sw.includes("clients.claim"),"Worker update lifecycle incomplete");
const manifest=JSON.parse(fs.readFileSync(path.join(root,"manifest.webmanifest"),"utf8"));
assert.equal(manifest.scope,"./");assert.equal(manifest.start_url,"./");
assert.equal(manifest.display,"standalone");
console.log("PASS:",LESSONS.length,"lessons,",LESSONS.reduce((n,l)=>n+l.questions.length,0),"fixed tasks,",checks,"evaluation checks, offline assets.");
