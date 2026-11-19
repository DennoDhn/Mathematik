"use strict";
(() => {
 const {GROUPS,LESSONS} = window.MATHE_DATA || {GROUPS:[],LESSONS:[]};
 const KEY = "mathe-hero-progress-v1";
 const root = document.querySelector("#app");
 const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const go = (view,id) => { screen={view,id}; result=null; session=null; window.scrollTo({top:0,behavior:"instant"}); render(); };
 const read = () => {try{const s=JSON.parse(localStorage.getItem(KEY)||"null");return s&&typeof s==="object"&&s.version===1?s:null;}catch{return null;}};
 const state = read() || {version:1,profile:null,progress:{},settings:{short:false}};
 let screen={view:"home",id:null},session=null,result=null,deferredInstall=null;
 const save = () => {try{localStorage.setItem(KEY,JSON.stringify(state));return true;}catch{return false;}};
 const getLesson = id => LESSONS.find(l=>l.id===id);
 const getGroup = id => GROUPS.find(g=>g.id===id);
 const getStatus = id => {const p=state.progress[id];return p?.passed?"Gelernt":p?"Weiter üben":"Noch offen";};
 const passed = () => LESSONS.filter(l=>state.progress[l.id]?.passed).length;
 const attemptsCount = () => Object.values(state.progress).reduce((s,p)=>s+(p.attempts||0),0);
 const pct = (n,d) => d?Math.round(n/d*100):0;
 const sanitizeNumber = s => String(s??"").trim().toLowerCase().replace(/[\u2212\u2013\u2014]/g,"-").replace(/\s/g,"").replace(/[.,]/g,".");
 const parseRational = text => {
   const t=sanitizeNumber(text).replace(/%$/,"");
   const parts=t.split("/");
   if(parts.length>2 || !parts.every(p=>/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(p)))return null;
   const num=Number(parts[0]),den=parts.length===2?Number(parts[1]):1;
   if(!Number.isFinite(num)||!Number.isFinite(den)||den===0)return null;
   return (num/den)*(sanitizeNumber(text).endsWith("%")?.01:1);
 };
 const equivalent = (value,task) => {
   const a=sanitizeNumber(value),b=sanitizeNumber(task.answer);
   if(!a)return false;
   if(task.mode==="value"){
     const x=parseRational(a),y=parseRational(b);
     return x!==null&&y!==null&&Math.abs(x-y)<1e-9;
   }
   const x=parseRational(a),y=parseRational(b);
   if(!/[x%=]/i.test(b)&&!/[x%=]/i.test(a)&&x!==null&&y!==null){
     /* Exact form is required for fractions; equivalent decimal formatting is allowed. */
     if(b.includes("/"))return a===b;
     if(a.includes("/"))return false;
     return Math.abs(x-y)<1e-9;
   }
   return a===b;
 };
 const viewButton = (text,view,id="",cls="")=>'<button type="button" class="btn '+cls+'" data-go="'+escapeHTML(view)+'" data-id="'+escapeHTML(id)+'">'+escapeHTML(text)+'</button>';
 const navButton = (text,view)=>'<button class="navbutton'+(screen.view===view?' active':'')+'" data-go="'+view+'" type="button">'+text+'</button>';
 const progressBar = (value,total)=>'<div class="bar barsmall" role="progressbar" aria-label="Fortschritt" aria-valuenow="'+value+'" aria-valuemin="0" aria-valuemax="'+total+'"><span style="width:'+pct(value,total)+'%"></span></div>';
 const groupLessons = id => LESSONS.filter(l=>l.group===id);
 function frame(content) {
  const isOffline= !navigator.onLine;
  root.innerHTML = '<div class="app"><header class="top"><a href="./" class="brand" data-home="1"><span class="mark">M</span><span>MATHE HERO</span></a><div class="topright"><span class="pill '+(isOffline?'offline':'online')+'" id="connection">'+(isOffline?'Offline':'Online')+'</span><span class="pill">Klasse '+escapeHTML(state.profile?.grade||"6")+'</span><button type="button" class="btn small ghost install" id="install">Installieren</button></div></header><div class="layout"><nav class="sidebar" aria-label="Hauptnavigation">'+navButton("Start","home")+navButton("Themen","topics")+navButton("Wiederholen","review")+navButton("Mein Fortschritt","progress")+navButton("Einstellungen","settings")+'<aside class="sidebar-note">10 Minuten reichen für eine Runde.<br>Keine Werbung. Keine Anmeldung.<br>Dein Lernstand bleibt auf diesem Gerät.</aside></nav><main class="main" id="content" tabindex="-1">'+content+'</main></div><footer class="foot">MATHE HERO · Kostenlos, werbefrei & offline nach dem ersten Laden · Version 0.1</footer></div>';
  installState();
 }
 function crumb(group,lesson){
  return '<div class="crumb"><button data-go="topics">Themen</button><span>›</span>'+(group?'<button data-go="topic" data-id="'+group.id+'">'+escapeHTML(group.title)+'</button>':'')+(lesson?'<span>› '+escapeHTML(lesson.title)+'</span>':'')+'</div>';
 }
 function renderOnboard(){
  root.innerHTML='<div class="app"><header class="top"><div class="brand"><span class="mark">M</span><span>MATHE HERO</span></div><span class="pill">Kostenlos & werbefrei</span></header><main class="onboard"><div class="hero"><div class="eyebrow">Dein Start</div><h1>Mathe kann einfach sein.</h1><p class="lead">Hier lernst du in deinem Tempo. Wir erklären alles Schritt für Schritt und helfen, wenn etwas nicht klappt.</p><form id="welcome-form"><div class="formrow"><div><label for="p-name" class="fieldlabel">Wie sollen wir dich nennen?</label><input id="p-name" class="field" name="name" maxlength="40" placeholder="Dein Vorname oder Spitzname" required autocomplete="nickname"></div><div><label for="p-grade" class="fieldlabel">Welche Klasse?</label><select id="p-grade" name="grade" class="field"><option value="5">5. Klasse</option><option value="6" selected>6. Klasse</option><option value="7">7. Klasse</option><option value="8">8. Klasse</option></select></div></div><label class="check"><input type="checkbox" name="short"> Bitte kurze Erklärungen bevorzugen (jederzeit änderbar)</label><div class="actions"><button type="submit" class="btn primary">Los geht’s</button></div></form><p class="note" style="margin-top:20px">Dein Name und Fortschritt werden nur lokal im Browser gespeichert. Eine Anmeldung ist nicht nötig.</p></div></main></div>';
 }
 function home() {
  const next=LESSONS.find(l=>!state.progress[l.id]?.passed)||LESSONS[0];
  return '<div class="hero"><div class="eyebrow">Dein Lernplatz</div><h1>Hallo, '+escapeHTML(state.profile.name)+'!</h1><p class="lead">Wir machen Mathe Schritt für Schritt. Nimm dir ein Thema vor, lies die Erklärung und probiere dann ein paar Aufgaben.</p><div class="actions">'+viewButton("Weiterlernen: "+next.title,"lesson",next.id,"primary")+viewButton("Alle Themen ansehen","topics","","ghost")+'</div></div><h2 class="section">Dein Fortschritt</h2><div class="stats"><div class="stat"><strong>'+passed()+'</strong><span>Gelernte Lektionen</span></div><div class="stat"><strong>'+LESSONS.length+'</strong><span>Lektionen insgesamt</span></div><div class="stat"><strong>'+attemptsCount()+'</strong><span>Übungsrunden</span></div></div>'+progressBar(passed(),LESSONS.length)+'<h2 class="section">Lernwelten</h2>'+renderGroupGrid()+'<p class="note section">Tipp: Fang bei „Brüche verstehen“ an, wenn du Kürzen und Erweitern lernen möchtest.</p>';
 }
 function renderGroupGrid(){
  return '<div class="grid">'+GROUPS.map(g=>{
   const lessons=groupLessons(g.id),done=lessons.filter(l=>state.progress[l.id]?.passed).length;
   return '<button class="card clickable" data-go="topic" data-id="'+g.id+'"><span class="meta">LERNWELT '+g.emoji+'</span><h3>'+escapeHTML(g.title)+'</h3><p>'+escapeHTML(g.desc)+'</p><div class="bottom"><span>'+done+' von '+lessons.length+' gelernt</span><span aria-hidden="true">→</span></div>'+progressBar(done,lessons.length)+'</button>';
  }).join("")+'</div>';
 }
 function topics(){return '<div class="eyebrow">Dein Lernplan</div><h1>Alle Mathe-Themen</h1><p class="lead">Wähle, was du gerade in der Schule brauchst. Du kannst jedes Thema jederzeit wiederholen.</p>'+renderGroupGrid();}
 function topic(id){
  const group=getGroup(id);if(!group)return topics();
  const lessons=groupLessons(group.id);
  return crumb(group)+'<div class="eyebrow">Lernwelt '+group.emoji+'</div><h1>'+escapeHTML(group.title)+'</h1><p class="lead">'+escapeHTML(group.desc)+'</p><div class="lesson-list">'+lessons.map((l,i)=>'<button type="button" class="lesson-link" data-go="lesson" data-id="'+l.id+'"><span><strong>'+(i+1)+'. '+escapeHTML(l.title)+'</strong><small>'+escapeHTML(l.brief)+'</small></span><span class="right">'+getStatus(l.id)+' →</span></button>').join("")+'</div>';
 }
 function lesson(id) {
  const l=getLesson(id);if(!l)return topics();
  const g=getGroup(l.group),short=!!state.settings.short;
  let html=crumb(g,l)+'<div class="eyebrow">Lektion · '+escapeHTML(g.title)+'</div><h1>'+escapeHTML(l.title)+'</h1><p class="lead">'+escapeHTML(l.brief)+'</p><div class="chipset"><span class="tag">'+getStatus(l.id)+'</span><button type="button" class="chip '+(short?'selected':'')+'" data-action="toggle-short" aria-pressed="'+short+'">Kurze Erklärung '+(short?'an':'aus')+'</button></div>';
  if(!short) html+='<section class="lesson-box"><h2>Wozu brauche ich das?</h2><p>'+escapeHTML(l.why)+'</p></section>';
  html+='<section class="lesson-box"><h2>So geht’s – Schritt für Schritt</h2><ol>'+l.steps.map(s=>'<li>'+escapeHTML(s)+'</li>').join("")+'</ol></section>';
  html+='<section class="lesson-box"><h2>Beispiel</h2><div class="example"><strong>'+escapeHTML(l.example)+'</strong><small>'+escapeHTML(l.explain)+'</small></div></section>';
  html+='<section class="lesson-box rule"><h2>Merksatz</h2><p>'+escapeHTML(l.rule)+'</p></section>';
  if(!short)html+='<section class="lesson-box warning"><h2>Pass auf!</h2><p>'+escapeHTML(l.trap)+'</p></section>';
  html+='<div class="actions"><button class="btn primary" data-action="start" data-id="'+l.id+'">Jetzt '+l.questions.length+' Aufgaben lösen</button>'+viewButton("Zur Themenübersicht","topic",g.id,"ghost")+'<button class="btn ghost" data-action="print" type="button">Lernzettel drucken</button></div>';
  return html;
 }
 function startPractice(id){
  const l=getLesson(id);if(!l)return;
  session={id,index:0,score:0,tries:0,answered:false,revealed:false};
  result=null;screen={view:"practice",id};render();
 }
 function practice(){
  const s=session,l=getLesson(screen.id);if(!s||!l)return '<p>Es ist gerade keine Übung gestartet.</p>'+viewButton("Themen","topics");
  if(s.index>=l.questions.length)return practiceDone(l,s);
  const task=l.questions[s.index],n=l.questions.length;
  const feedback=result?'<div class="feedback'+(result.correct?'':' error')+'" role="status"><strong>'+escapeHTML(result.title)+'</strong><p>'+escapeHTML(result.body)+'</p></div>':'';
  return crumb(getGroup(l.group),l)+'<div class="eyebrow">Deine Übung</div><h1>'+escapeHTML(l.title)+'</h1><div class="kicker"><span class="question-count">Aufgabe '+(s.index+1)+' von '+n+'</span><strong>'+s.score+' richtig</strong></div>'+progressBar(s.index,n)+'<section class="lesson-box"><h2>Du bist dran!</h2><p class="question">'+escapeHTML(task.question)+'</p><form id="answer-form"><label class="fieldlabel" for="answer">Deine Antwort</label><input id="answer" class="field" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" placeholder="Hier dein Ergebnis eingeben" aria-describedby="answerhelp" '+(s.answered?'disabled':'')+' required><p id="answerhelp" class="note" style="margin:8px 0 0">Brüche wie 3/4 eingeben; Dezimalzahlen mit Komma.</p><div class="actions" style="margin-top:18px">'+(!s.answered?'<button class="btn primary" type="submit">Prüfen</button>':'')+(!s.answered?'<button type="button" class="btn ghost" data-action="hint">Tipp anzeigen</button>':'')+(!s.answered?'<button type="button" class="btn ghost" data-action="reveal">Lösung zeigen</button>':'')+(s.answered?'<button class="btn primary" type="button" data-action="next">'+(s.index===n-1?'Auswertung ansehen':'Nächste Aufgabe')+'</button>':'')+'</div></form>'+feedback+'</section><div class="actions">'+viewButton("Zurück zur Erklärung","lesson",l.id,"ghost")+'</div>';
 }
 function practiceDone(l,s){
  const n=l.questions.length,score=s.score,old=state.progress[l.id]||{best:0,attempts:0,passed:false};
  /* Only record results once per completed session. */
  if(!s.saved){
   state.progress[l.id]={best:Math.max(score,old.best),attempts:old.attempts+1,passed:old.passed||score>=Math.ceil(n*.75),updated:new Date().toISOString()};
   save();s.saved=true;
  }
  const success=score>=Math.ceil(n*.75);
  const next=LESSONS[LESSONS.findIndex(x=>x.id===l.id)+1];
  return '<div class="hero"><div class="eyebrow">Runde abgeschlossen</div><h1>'+(success?'Das hast du geschafft!':'Gut geübt!')+'</h1><p class="lead">Du hast '+score+' von '+n+' Aufgaben beim ersten Versuch richtig gelöst.'+(success?' Diese Lektion zählt jetzt als gelernt.':' Du kannst sie nochmal üben – ohne Druck.')+'</p><div class="actions"><button class="btn primary" data-action="start" data-id="'+l.id+'">Nochmal üben</button>'+viewButton("Erklärung nachlesen","lesson",l.id,"ghost")+(next?viewButton("Nächste Lektion","lesson",next.id,"ghost"):'')+'</div></div>';
 }
 function review(){
  const todo=LESSONS.filter(l=>state.progress[l.id]&&!state.progress[l.id].passed);
  const done=LESSONS.filter(l=>state.progress[l.id]?.passed);
  const items=[...todo,...done].slice(0,12);
  return '<div class="eyebrow">Nochmal sicher werden</div><h1>Wiederholen</h1><p class="lead">Du kannst alle geübten Themen wiederholen. Wenn du dich unsicher fühlst, lies zuerst den Lernzettel.</p>'+(items.length?'<div class="lesson-list">'+items.map(l=>'<button class="lesson-link" data-go="lesson" data-id="'+l.id+'"><span><strong>'+escapeHTML(l.title)+'</strong><small>'+getStatus(l.id)+'</small></span><span class="right">Üben →</span></button>').join("")+'</div>':'<div class="empty">Noch nichts geübt. Starte deine erste Lektion!<div class="actions" style="justify-content:center;margin-top:12px">'+viewButton("Themen entdecken","topics","","primary")+'</div></div>');
 }
 function progress(){
  const done=passed(),total=LESSONS.length;
  return '<div class="eyebrow">Lernstand auf diesem Gerät</div><h1>Mein Fortschritt</h1><div class="stats"><div class="stat"><strong>'+done+'</strong><span>Gelernt</span></div><div class="stat"><strong>'+attemptsCount()+'</strong><span>Runden</span></div><div class="stat"><strong>'+pct(done,total)+' %</strong><span>Fortschritt</span></div></div>'+progressBar(done,total)+'<h2 class="section">Deine Lernwelten</h2>'+GROUPS.map(g=>{const ls=groupLessons(g.id),n=ls.filter(l=>state.progress[l.id]?.passed).length;return '<section class="lesson-box"><div class="kicker"><strong>'+escapeHTML(g.title)+'</strong><span>'+n+' / '+ls.length+'</span></div>'+progressBar(n,ls.length)+'</section>';}).join("")+'<p class="note">Dies ist eine Orientierung, keine Schulnote. „Gelernt“ bedeutet, dass mindestens 75 % der Fragen in einer Übungsrunde beim ersten Versuch richtig beantwortet wurden.</p>';
 }
 function settings(){
  return '<div class="eyebrow">Deine App</div><h1>Einstellungen</h1><section class="lesson-box"><h2>Schülerprofil</h2><form id="settings-form"><div class="formrow"><div><label class="fieldlabel" for="settings-name">Name / Spitzname</label><input class="field" id="settings-name" name="name" maxlength="40" required value="'+escapeHTML(state.profile.name)+'"></div><div><label class="fieldlabel" for="settings-grade">Klasse</label><select class="field" id="settings-grade" name="grade">'+[5,6,7,8].map(n=>'<option value="'+n+'"'+(String(n)===String(state.profile.grade)?' selected':'')+'>'+n+'. Klasse</option>').join("")+'</select></div></div><label class="check"><input name="short" type="checkbox"'+(state.settings.short?' checked':'')+'> Kurze Erklärungen bevorzugen</label><div class="actions"><button class="btn primary" type="submit">Speichern</button></div></form></section><section class="lesson-box"><h2>Lernstand sichern</h2><p>Dein Fortschritt wird lokal auf diesem Gerät gespeichert. Sichere ihn als Datei, wenn du den Browser wechselst oder Daten löschst.</p><div class="actions"><button class="btn" data-action="export">Sicherung herunterladen</button><label class="btn" for="import-file">Sicherung importieren</label><input id="import-file" type="file" accept="application/json,.json" class="sr-only"></div></section><section class="lesson-box warning"><h2>Daten löschen</h2><p>Alle lokalen Lernstände und das Profil auf diesem Gerät zurücksetzen.</p><button class="btn ghost" data-action="reset">Alle Daten löschen</button></section><p id="message" role="status" aria-live="polite"></p>';
 }
 function render(){
  if(!state.profile){renderOnboard();return;}
  let content;
  switch(screen.view){
   case "topics":content=topics();break;
   case "topic":content=topic(screen.id);break;
   case "lesson":content=lesson(screen.id);break;
   case "practice":content=practice();break;
   case "review":content=review();break;
   case "progress":content=progress();break;
   case "settings":content=settings();break;
   default:content=home();
  }
  frame(content);
 }
 const notify=(message)=>{const n=document.querySelector("#message");if(n)n.textContent=message;};
 function installState(){
  const btn=document.querySelector("#install");if(!btn)return;
  if(deferredInstall)btn.classList.add("available");
 }
 window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredInstall=event;installState();});
 window.addEventListener("appinstalled",()=>{deferredInstall=null;installState();});
 window.addEventListener("online",render);window.addEventListener("offline",render);
 document.addEventListener("click",async event=>{
  const install=event.target.closest("#install");if(install&&deferredInstall){deferredInstall.prompt();deferredInstall=null;return;}
  const home=event.target.closest("[data-home]");if(home){event.preventDefault();go("home");return;}
  const goTo=event.target.closest("[data-go]");if(goTo){go(goTo.dataset.go,goTo.dataset.id||null);return;}
  const action=event.target.closest("[data-action]");if(!action)return;
  const type=action.dataset.action;
  if(type==="start"){startPractice(action.dataset.id);return;}
  if(type==="toggle-short"){state.settings.short=!state.settings.short;save();render();return;}
  if(type==="print"){window.print();return;}
  if(type==="hint"){const t=getLesson(session.id).questions[session.index];result={correct:false,title:"Ein kleiner Tipp",body:t.hint};render();return;}
  if(type==="reveal"){const t=getLesson(session.id).questions[session.index];session.answered=true;result={correct:false,title:"So geht die Lösung: "+t.answer,body:t.solution};render();return;}
  if(type==="next"){session.index++;session.answered=false;session.tries=0;result=null;render();document.querySelector("#answer")?.focus();return;}
  if(type==="export"){
   const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mathe-hero-lernstand.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);notify("Sicherung wurde erstellt.");return;
  }
  if(type==="reset"&&window.confirm("Wirklich alle Daten auf diesem Gerät löschen?")){try{localStorage.removeItem(KEY);}catch{}state.profile=null;state.progress={};state.settings={short:false};go("home");}
 });
 document.addEventListener("submit",event=>{
  if(event.target.id==="welcome-form"){
   event.preventDefault();const f=new FormData(event.target),name=String(f.get("name")||"").trim();
   if(!name)return;
   state.profile={name:name.slice(0,40),grade:String(f.get("grade")||"6")};
   state.settings.short=f.has("short");save();go("home");return;
  }
  if(event.target.id==="settings-form"){
   event.preventDefault();const f=new FormData(event.target),name=String(f.get("name")||"").trim();
   if(!name)return;
   state.profile={name:name.slice(0,40),grade:String(f.get("grade")||"6")};
   state.settings.short=f.has("short");const saved=save();render();notify(saved?"Gespeichert.":"Speichern nicht möglich: Browser-Speicher nicht verfügbar.");return;
  }
  if(event.target.id==="answer-form"){
   event.preventDefault();if(!session||session.answered)return;
   const value=String(document.querySelector("#answer")?.value||"").trim();
   if(!value)return;
   const task=getLesson(session.id).questions[session.index];
   if(equivalent(value,task)){
    if(session.tries===0)session.score++;
    session.answered=true;result={correct:true,title:"Richtig!",body:task.solution};
   }else{
    session.tries++;
    result={correct:false,title:"Fast – probier es nochmal.",body:session.tries===1?task.hint:"Noch ein Tipp: "+task.hint+" Du kannst auch die Lösung anzeigen lassen."};
   }
   render();
   if(!session.answered)document.querySelector("#answer")?.focus();
  }
 });
 document.addEventListener("change",async event=>{
  if(event.target.id!=="import-file")return;
  const file=event.target.files?.[0];if(!file)return;
  if(file.size>1024*1024){notify("Diese Sicherung ist zu groß.");return;}
  try{
   const data=JSON.parse(await file.text());
   if(data.version!==1||!data.profile||typeof data.profile.name!=="string"||!data.progress||typeof data.progress!=="object"||Array.isArray(data.progress))throw Error("ungültig");
   if(!window.confirm("Aktuellen Lernstand durch die Sicherung ersetzen?"))return;
   state.profile={name:String(data.profile.name).slice(0,40),grade:["5","6","7","8"].includes(String(data.profile.grade))?String(data.profile.grade):"6"};
   state.settings={short:!!data.settings?.short};
   state.progress=Object.fromEntries(LESSONS.filter(l=>data.progress[l.id]).map(l=>{const p=data.progress[l.id];return [l.id,{best:Math.max(0,Math.min(l.questions.length,Number(p.best)||0)),attempts:Math.max(0,Math.min(100000,Number(p.attempts)||0)),passed:!!p.passed,updated:typeof p.updated==="string"?p.updated:""}];}));
   save();go("progress");
  }catch{notify("Die Sicherungsdatei konnte nicht gelesen werden.");}
 });
 if("serviceWorker" in navigator && location.protocol==="https:")window.addEventListener("load",()=>{
  navigator.serviceWorker.register("./sw.js").catch(error=>console.warn("Offline-Funktion konnte nicht aktiviert werden:",error));
 });
 render();
})();