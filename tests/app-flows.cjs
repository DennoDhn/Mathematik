"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict"),path=require("node:path");
const base=path.resolve(__dirname,"..");
const file=n=>fs.readFileSync(path.join(base,n),"utf8");
const store={};
function boot(){
 const root={innerHTML:"",focus(){}},events={},windowEvents={},documentElement={dataset:{}};
 let entered="";
 const document={
  documentElement,
  querySelector(selector){
   if(selector==="#app"||selector==="#content")return root;
   if(selector==="#answer")return {value:entered,focus(){},select(){}};
   if(selector==="#connection")return {textContent:"",className:"pill online"};
   return null;
  },
  querySelectorAll(){return []},
  addEventListener(type,fn){(events[type]??=[]).push(fn);}
 };
 const window={
  document,addEventListener(type,fn){(windowEvents[type]??=[]).push(fn);},
  scrollTo(){},confirm(){return true},print(){}
 };
 const navigator={onLine:true};
 const localStorage={getItem(key){return Object.hasOwn(store,key)?store[key]:null},setItem(key,value){store[key]=value},removeItem(key){delete store[key]}};
 const FormData=class{constructor(target){this.data=target.fields||{}}get(key){return this.data[key]}has(key){return Object.hasOwn(this.data,key)}};
 const context=vm.createContext({window,document,navigator,localStorage,location:{protocol:"file:"},FormData,console,Date,Math,setTimeout,URL,Blob});
 for(const name of ["lessons.js","math-engine.js","curriculum.js","additional-lessons.js","visuals.js","app.js"])
  vm.runInContext(file(name),context,{filename:name});
 const emit=(type,event)=>{for(const fn of events[type]||[])fn(event)};
 const nav=(view,id)=>emit("click",{target:{closest(sel){return sel==="[data-go]"?{dataset:{go:view,id}}:null}}});
 const action=(kind,id)=>emit("click",{target:{closest(sel){return sel==="[data-action]"?{dataset:{action:kind,id}}:null}}});
 const form=(id,fields)=>emit("submit",{target:{id,fields},preventDefault(){}});
 const input=value=>{entered=value;emit("input",{target:{id:"answer",value,matches(){return false}}})};
 return {root,window,documentElement,store,events,nav,action,form,input,windowEvents};
}
const a=boot();
assert.match(a.root.innerHTML,/Wie sollen wir dich nennen/);
a.form("welcome-form",{name:"Testperson",grade:"6"});
assert.match(a.root.innerHTML,/Hallo, Testperson/);
assert.equal(JSON.parse(store["mathe-hero-progress-v1"]).version,2);
a.nav("lesson","kuerzen");
assert.match(a.root.innerHTML,/Bruch-Labor/);
a.action("start","kuerzen");
assert.match(a.root.innerHTML,/Aufgabe 1 von 6/);
assert.ok(store["mathe-hero-running-lesson-v2"],"Practice not persisted");
a.input("2/4");
assert.match(store["mathe-hero-running-lesson-v2"],/"draft":"2\/4"/);
const b=boot();
assert.match(b.root.innerHTML,/Aufgabe 1 von 6/,"Practice did not resume after reload");
assert.match(b.root.innerHTML,/value="2\/4"/,"Answer draft missing on reload");
b.nav("settings");
assert.match(b.root.innerHTML,/Profile auf diesem Gerät/);
assert.match(b.root.innerHTML,/Paperlight/);
b.form("new-profile-form",{name:"Zweitprofil",grade:"7"});
assert.match(b.root.innerHTML,/Hallo, Zweitprofil/);
assert.equal(Object.keys(JSON.parse(store["mathe-hero-progress-v1"]).profiles).length,2);
b.nav("settings");
b.action("set-theme","light");
assert.equal(b.documentElement.dataset.theme,"light");
assert.equal(JSON.parse(store["mathe-hero-progress-v1"]).settings.theme,"light");
b.action("switch-profile","profile-1");
assert.match(b.root.innerHTML,/Hallo, Testperson/);
assert.equal(JSON.parse(store["mathe-hero-progress-v1"]).profile.name,"Testperson");
const sw=file("sw.js");
assert.match(sw,/self.addEventListener\("install"/);
assert.match(sw,/self.addEventListener\("fetch"/);
console.log("PASS: onboarding, persistent lesson, draft recovery, multiple profiles, theme switch and navigation.");
