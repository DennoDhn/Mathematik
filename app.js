"use strict";
(() => {
 const {GROUPS,LESSONS} = window.MATHE_DATA || {GROUPS:[],LESSONS:[]};
 const ENGINE=window.MATHE_ENGINE,CURRICULUM=window.MATHE_CURRICULUM,VISUALS=window.MATHE_VISUALS;
 if(!ENGINE||!CURRICULUM||!VISUALS)throw Error("Ein Lernmodul konnte nicht geladen werden.");
 const KEY="mathe-hero-progress-v1",SESSION_KEY="mathe-hero-running-lesson-v2";
 const clearSession=()=>{try{localStorage.removeItem(SESSION_KEY)}catch{}};
 const saveSession=()=>{try{if(session)localStorage.setItem(SESSION_KEY,JSON.stringify({profileId:state.activeProfileId,session}));}catch{}};
 const root = document.querySelector("#app");
 const escapeHTML = value => String(value ?? "").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const formatMath=text=>escapeHTML(text).replace(/(\d+)\/([1-9]\d*)/g,(all,top,bottom)=>
  '<span class="math-frac" role="img" aria-label="Bruch '+top+' durch '+bottom+'"><span>'+top+'</span><span>'+bottom+'</span></span>');
 const go=(view,id)=>{
  if(view==="resume"){
   const saved=pendingPractice();
   if(saved){session=saved;screen={view:"practice",id:saved.id};result=null;render();document.querySelector("#answer")?.focus();}
   else {screen={view:"home",id:null};result=null;session=null;render();}
   return;
  }
  screen={view,id};result=null;session=null;
  // Navigation pauses an unfinished round instead of destroying the saved draft.
  window.scrollTo({top:0,behavior:"auto"});render();document.querySelector("#content")?.focus();
 };
 const read=()=>{
  try{
   const s=JSON.parse(localStorage.getItem(KEY)||"null");
   if(!s||typeof s!=="object")return null;
   if(s.version===2&&s.profiles&&typeof s.profiles==="object"){
     const item=s.profiles[s.activeProfileId];
     if(item){s.profile=item.profile;s.progress=item.progress||{};s.settings=item.settings||{short:false};}
     else{s.profile=null;s.progress={};s.settings={short:false};}
     return s;
   }
   if(s.version===1){
     const id="profile-1";
     return {version:2,activeProfileId:s.profile?id:null,profiles:s.profile?{[id]:{profile:s.profile,progress:s.progress||{},settings:s.settings||{short:false}}}:{},profile:s.profile||null,progress:s.progress||{},settings:s.settings||{short:false}};
   }
   return null;
  }catch{return null;}
 };
 const state=read()||{version:2,activeProfileId:null,profiles:{},profile:null,progress:{},settings:{short:false}};
 const pendingPractice=()=>{
  try{
   const pending=JSON.parse(localStorage.getItem(SESSION_KEY)||"null"),s=pending?.session;
   if(pending?.profileId!==state.activeProfileId||!s||s.saved||!Array.isArray(s.questions)||!s.questions.length
       ||!Number.isInteger(s.index)||s.index<0||s.index>=s.questions.length||!LESSONS.some(l=>l.id===s.id))return null;
   return s;
  }catch{return null;}
 };
 let screen={view:"home",id:null},session=null,result=null,deferredInstall=null;
 try{
  const pending=JSON.parse(localStorage.getItem(SESSION_KEY)||"null");
  if(pending?.profileId===state.activeProfileId&&LESSONS.some(l=>l.id===pending.session?.id)&&Array.isArray(pending.session?.questions)){
   session=pending.session;screen={view:"practice",id:session.id};
  }
 }catch{clearSession();}
 const save=()=>{
  try{
   if(state.profile&&state.activeProfileId)state.profiles[state.activeProfileId]={profile:state.profile,progress:state.progress,settings:state.settings};
   localStorage.setItem(KEY,JSON.stringify(state));return true;
  }catch{return false;}
 };
 const switchProfile=id=>{
   const p=state.profiles[id];if(!p)return;
   state.activeProfileId=id;state.profile=p.profile;state.progress=p.progress||{};state.settings=p.settings||{short:false};
   save();go("home");
 };
 const isDue=p=>Boolean(p?.nextReview&&Date.parse(p.nextReview)<=Date.now());
 const prerequisiteMissing=l=>CURRICULUM.metadata(l).prerequisites.filter(id=>!state.progress[id]?.passed);
 const recommended=()=>{
   const due=LESSONS.find(l=>isDue(state.progress[l.id])||(state.progress[l.id]?.passed&&state.progress[l.id]?.secure===false));if(due)return due;
   const grade=Number(state.profile?.grade||6),available=LESSONS.filter(l=>!state.progress[l.id]?.passed);
   return available.find(l=>CURRICULUM.metadata(l).grade<=grade&&prerequisiteMissing(l).length===0)
     || available.find(l=>CURRICULUM.metadata(l).grade<=grade)||available[0]||LESSONS[0];
 };
 const getLesson = id => LESSONS.find(l=>l.id===id);
 const getGroup = id => GROUPS.find(g=>g.id===id);
 const getStatus = id => {const p=state.progress[id];return isDue(p)||(p?.passed&&p.secure===false)?"Wiederholen":p?.passed?"Gelernt":p?"Weiter üben":"Noch offen";};
 const passed = () => LESSONS.filter(l=>state.progress[l.id]?.passed).length;
 const attemptsCount = () => Object.values(state.progress).reduce((s,p)=>s+(p.attempts||0),0);
 const pct = (n,d) => d?Math.round(n/d*100):0;
 const equivalent=(value,task)=>ENGINE.check(value,task).correct;
 const roundSize=()=>({5:3,10:6,15:9})[Number(state.settings.duration)]||6;
 const lessonRoundSize=l=>ENGINE.generator(l.id,1).length?roundSize():Math.min(roundSize(),l.questions.length);
 const viewButton = (text,view,id="",cls="")=>'<button type="button" class="btn '+cls+'" data-go="'+escapeHTML(view)+'" data-id="'+escapeHTML(id)+'">'+escapeHTML(text)+'</button>';
 const navButton = (text,view)=>'<button class="navbutton'+(screen.view===view?' active':'')+'" data-go="'+view+'" type="button">'+text+'</button>';
 const progressBar = (value,total)=>'<div class="bar barsmall" role="progressbar" aria-label="Fortschritt" aria-valuenow="'+value+'" aria-valuemin="0" aria-valuemax="'+total+'"><span style="width:'+pct(value,total)+'%"></span></div>';
 const groupLessons = id => LESSONS.filter(l=>l.group===id);
 function frame(content) {
  const isOffline= !navigator.onLine;
  root.innerHTML = '<div class="app"><header class="top"><a href="./" class="brand" data-home="1"><span class="mark">M</span><span>MATHE HERO</span></a><div class="topright"><span class="pill '+(isOffline?'offline':'online')+'" id="connection">'+(isOffline?'Offline':'Online')+'</span><span class="pill">Klasse '+escapeHTML(state.profile?.grade||"6")+'</span><button type="button" class="btn small ghost install" id="install">Installieren</button></div></header><div class="layout"><nav class="sidebar" aria-label="Hauptnavigation">'+navButton("Start","home")+navButton("Themen","topics")+navButton("Wiederholen","review")+navButton("Mein Fortschritt","progress")+navButton("Einstellungen","settings")+'<aside class="sidebar-note">10 Minuten reichen für eine Runde.<br>Keine Werbung. Keine Anmeldung.<br>Dein Lernstand bleibt auf diesem Gerät.</aside></nav><main class="main" id="content" tabindex="-1">'+content+'</main></div><footer class="foot">MATHE HERO · Kostenlos, werbefrei & offline nach dem ersten Laden · Version 0.5</footer></div>';
  installState();
 }
 function crumb(group,lesson){
  return '<div class="crumb"><button data-go="topics">Themen</button><span>›</span>'+(group?'<button data-go="topic" data-id="'+group.id+'">'+escapeHTML(group.title)+'</button>':'')+(lesson?'<span>› '+escapeHTML(lesson.title)+'</span>':'')+'</div>';
 }
 function renderOnboard(){
  root.innerHTML='<div class="app"><header class="top"><div class="brand"><span class="mark">M</span><span>MATHE HERO</span></div><span class="pill">Kostenlos & werbefrei</span></header><main class="onboard"><div class="hero"><div class="eyebrow">Dein Start</div><h1>Mathe kann einfach sein.</h1><p class="lead">Hier lernst du in deinem Tempo. Wir erklären alles Schritt für Schritt und helfen, wenn etwas nicht klappt.</p><form id="welcome-form"><div class="formrow"><div><label for="p-name" class="fieldlabel">Wie sollen wir dich nennen?</label><input id="p-name" class="field" name="name" maxlength="40" placeholder="Dein Vorname oder Spitzname" required autocomplete="nickname"></div><div><label for="p-grade" class="fieldlabel">Welche Klasse?</label><select id="p-grade" name="grade" class="field"><option value="5">5. Klasse</option><option value="6" selected>6. Klasse</option><option value="7">7. Klasse</option><option value="8">8. Klasse</option></select></div></div><label class="check"><input type="checkbox" name="short"> Bitte kurze Erklärungen bevorzugen (jederzeit änderbar)</label><div class="actions"><button type="submit" class="btn primary">Los geht’s</button></div></form><p class="note" style="margin-top:20px">Dein Name und Fortschritt werden nur lokal im Browser gespeichert. Eine Anmeldung ist nicht nötig.</p></div></main></div>';
 }

 function home() {
  const next=recommended(),pending=pendingPractice();
  const due=LESSONS.filter(l=>isDue(state.progress[l.id])||(state.progress[l.id]?.passed&&state.progress[l.id]?.secure===false)).length;
  const primary=pending?viewButton("Letzte Übung fortsetzen","resume","","primary"):viewButton("Meine nächste Mission","lesson",next.id,"primary");
  return '<div class="hero hero-dashboard"><div class="hero-content"><div class="eyebrow">DEIN MATHE-STUDIO · KLASSE '+escapeHTML(state.profile.grade)+'</div>'+
   '<h1>Hallo, '+escapeHTML(state.profile.name)+'!<span class="hero-highlight">Bereit für den nächsten Schritt?</span></h1>'+
   '<p class="lead">Wenig lesen. Mehr verstehen. Übe in deinem Tempo und finde heraus, wie Mathe wirklich funktioniert.</p>'+
   '<div class="hero-spotlight"><span class="hero-spotlight-dot"></span><span>'+(pending?'Deine Übung wartet auf dich':"Empfohlen: "+escapeHTML(next.title))+'</span></div>'+
   '<div class="actions">'+primary+viewButton("Lernwelten entdecken","topics","","ghost")+'</div></div>'+
   '<div class="mission-art" aria-hidden="true"><span class="orbit orbit-1"></span><span class="orbit orbit-2"></span><span class="mission-math mission-math-a">½</span><span class="mission-math mission-math-b">×</span><span class="mission-math mission-math-c">%</span><span class="mission-math mission-math-d">3,5</span><div class="mission-core">M<span>+</span></div></div></div>'+
   '<div class="dashboard-section-head"><div><div class="eyebrow">DEIN FORTSCHRITT</div><h2>Jeder Schritt zählt.</h2></div>'+
   '<span class="dashboard-micro">'+(due?due+" Thema/Themen wiederholen":"Dein Lerntempo ist genau richtig")+'</span></div>'+
   '<div class="stats"><div class="stat"><strong>'+passed()+'</strong><span>Lektionen geschafft</span></div><div class="stat"><strong>'+due+'</strong><span>Zum Wiederholen</span></div><div class="stat"><strong>'+attemptsCount()+'</strong><span>Übungsrunden</span></div></div>'+
   progressBar(passed(),LESSONS.length)+
   '<div class="dashboard-section-head"><div><div class="eyebrow">WÄHLE DEIN THEMA</div><h2>Deine Lernwelten</h2></div>'+viewButton("Alle Themen","topics","","ghost small")+'</div>'+
   renderGroupGrid()+'<p class="note section">Neu bei Brüchen? Beginne mit „Brüche verstehen“ und arbeite dich zu Kürzen und Erweitern vor.</p>';
 }

 function renderGroupGrid(){
  const worldSymbols={basis:"×",brueche:"½",dezimal:"0,5",rational:"−3",prozent:"%",algebra:"x²",geo:"△",daten:"▥",graph:"ƒ"};
  return '<div class="grid world-grid">'+GROUPS.map(g=>{
   const lessons=groupLessons(g.id),done=lessons.filter(l=>state.progress[l.id]?.passed).length;
   return '<button class="card clickable world-card" data-world="'+escapeHTML(g.id)+'" data-go="topic" data-id="'+escapeHTML(g.id)+'">'+
   '<div class="world-top"><span class="meta">LERNWELT '+escapeHTML(g.emoji)+'</span><span class="world-glyph" aria-hidden="true">'+escapeHTML(worldSymbols[g.id]||"∑")+'</span></div>'+
   '<h3>'+escapeHTML(g.title)+'</h3><p>'+escapeHTML(g.desc)+'</p>'+
   '<div class="bottom"><span>'+done+' / '+lessons.length+' Lektionen</span><span class="world-enter" aria-hidden="true">↗</span></div>'+progressBar(done,lessons.length)+'</button>';
  }).join("")+'</div>';
 }
 function topics(){return '<div class="eyebrow">Dein Lernplan</div><h1>Alle Mathe-Themen</h1><p class="lead">Wähle, was du gerade in der Schule brauchst. Du kannst jedes Thema jederzeit wiederholen.</p>'+renderGroupGrid();}
 function topic(id){
  const group=getGroup(id);if(!group)return topics();
  const lessons=groupLessons(group.id);
  return crumb(group)+'<div class="eyebrow">Lernwelt '+group.emoji+'</div><h1>'+escapeHTML(group.title)+'</h1><p class="lead">'+escapeHTML(group.desc)+'</p><div class="lesson-list">'+lessons.map((l,i)=>'<button type="button" class="lesson-link" data-go="lesson" data-id="'+l.id+'"><span><strong>'+(i+1)+'. '+escapeHTML(l.title)+'</strong><small>'+escapeHTML(l.brief)+'</small></span><span class="right">Kl. '+CURRICULUM.metadata(l).grade+' · '+getStatus(l.id)+' →</span></button>').join("")+'</div>';
 }
 function lesson(id) {
  const l=getLesson(id);if(!l)return topics();
  const g=getGroup(l.group),short=!!state.settings.short;
  let html=crumb(g,l)+'<div class="eyebrow">Lektion · '+escapeHTML(g.title)+'</div><h1>'+escapeHTML(l.title)+'</h1><p class="lead">'+escapeHTML(l.brief)+'</p><div class="chipset"><span class="tag">'+getStatus(l.id)+'</span><button type="button" class="chip '+(short?'selected':'')+'" data-action="toggle-short" aria-pressed="'+short+'">Kurze Erklärung '+(short?'an':'aus')+'</button></div>';
  if(!short) html+='<section class="lesson-box"><h2>Wozu brauche ich das?</h2><p>'+escapeHTML(l.why)+'</p></section>';
  html+=VISUALS.markup(l);
  html+='<section class="lesson-box"><h2>So geht’s – Schritt für Schritt</h2><ol>'+l.steps.map(s=>'<li>'+formatMath(s)+'</li>').join("")+'</ol></section>';
  html+='<section class="lesson-box"><h2>Beispiel</h2><div class="example"><strong>'+formatMath(l.example)+'</strong><small>'+formatMath(l.explain)+'</small></div></section>';
  html+='<section class="lesson-box rule"><h2>Merksatz</h2><p>'+escapeHTML(l.rule)+'</p></section>';
  if(!short)html+='<section class="lesson-box warning"><h2>Pass auf!</h2><p>'+escapeHTML(l.trap)+'</p></section>';
  html+='<div class="actions"><button class="btn primary" data-action="start" data-id="'+l.id+'">Jetzt '+lessonRoundSize(l)+' Aufgaben lösen</button>'+viewButton("Zur Themenübersicht","topic",g.id,"ghost")+'<button class="btn ghost" data-action="print" type="button">Lernzettel drucken</button></div>';
  return html;
 }
 function startPractice(id){
  const l=getLesson(id);if(!l)return;
  session={id,index:0,score:0,tries:0,hints:0,answered:false,revealed:false,draft:"",questions:ENGINE.createSet(l,Date.now()+Math.floor(Math.random()*1000000),roundSize())};
  result=null;screen={view:"practice",id};saveSession();render();
 }
 function practice(){
  const s=session,l=getLesson(screen.id);if(!s||!l)return '<p>Es ist gerade keine Übung gestartet.</p>'+viewButton("Themen","topics");
  const questions=s.questions||l.questions;
  if(s.index>=questions.length)return practiceDone(l,s);
  const task=questions[s.index],n=questions.length;
  const feedback=result?'<div class="feedback'+(result.correct?'':' error')+'" role="status"><strong>'+escapeHTML(result.title)+'</strong><p>'+escapeHTML(result.body)+'</p></div>':'';
  return crumb(getGroup(l.group),l)+'<div class="eyebrow">Deine Übung</div><h1>'+escapeHTML(l.title)+'</h1><div class="kicker"><span class="question-count">Aufgabe '+(s.index+1)+' von '+n+'</span><strong>'+s.score+' richtig</strong></div>'+progressBar(s.index,n)+'<section class="lesson-box"><h2>Du bist dran!</h2><p class="question">'+formatMath(task.question)+'</p><form id="answer-form"><label class="fieldlabel" for="answer">Deine Antwort</label><input id="answer" class="field" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" placeholder="Hier dein Ergebnis eingeben" aria-describedby="answerhelp" value="'+escapeHTML(s.draft||"")+'" '+(s.answered?'disabled':'')+' required><p id="answerhelp" class="note" style="margin:8px 0 0">Brüche wie 3/4 eingeben; Dezimalzahlen mit Komma.</p><div class="actions" style="margin-top:18px">'+(!s.answered?'<button class="btn primary" type="submit">Prüfen</button>':'')+(!s.answered?'<button type="button" class="btn ghost" data-action="hint">Tipp anzeigen</button><button type="button" class="btn ghost" data-action="simplify">Ich verstehe das nicht</button>':'')+(!s.answered?'<button type="button" class="btn ghost" data-action="reveal">Lösung zeigen</button>':'')+(s.answered?'<button class="btn primary" type="button" data-action="next">'+(s.index===n-1?'Auswertung ansehen':'Nächste Aufgabe')+'</button>':'')+'</div></form>'+feedback+'</section><div class="actions">'+viewButton("Zurück zur Erklärung","lesson",l.id,"ghost")+'</div>';
 }
 function practiceDone(l,s){
  const n=(s.questions||l.questions).length,score=s.score,old=state.progress[l.id]||{best:0,attempts:0,passed:false};
  /* Only record results once per completed session. */
  if(!s.saved){
   const success=score>=Math.ceil(n*.75);
    const streak=success?Math.min(4,(old.reviewStreak||0)+1):0;
    const days=success?[1,3,7,14][Math.max(0,streak-1)]:1;
    state.progress[l.id]={...old,best:Math.max(score,old.best),attempts:old.attempts+1,
      passed:old.passed||success,reviewStreak:streak,secure:success,score,lastTotal:n,
      nextReview:new Date(Date.now()+days*86400000).toISOString(),updated:new Date().toISOString()};
   save();s.saved=true;clearSession();
  }
  const success=score>=Math.ceil(n*.75);
  const next=LESSONS[LESSONS.findIndex(x=>x.id===l.id)+1];
  return '<div class="hero"><div class="eyebrow">Runde abgeschlossen</div><h1>'+(success?'Das hast du geschafft!':'Gut geübt!')+'</h1><p class="lead">Du hast '+score+' von '+n+' Aufgaben beim ersten Versuch richtig gelöst.'+(success?' Diese Lektion zählt jetzt als gelernt.':' Du kannst sie nochmal üben – ohne Druck.')+'</p><div class="actions"><button class="btn primary" data-action="start" data-id="'+l.id+'">Nochmal üben</button>'+viewButton("Erklärung nachlesen","lesson",l.id,"ghost")+(next?viewButton("Nächste Lektion","lesson",next.id,"ghost"):'')+'</div></div>';
 }
 function review(){
  const todo=LESSONS.filter(l=>state.progress[l.id]&&(!state.progress[l.id].passed||isDue(state.progress[l.id])||state.progress[l.id].secure===false));
  const done=LESSONS.filter(l=>state.progress[l.id]?.passed&&!isDue(state.progress[l.id])&&state.progress[l.id].secure!==false);
  const items=[...todo,...done].slice(0,20);
  return '<div class="eyebrow">Nochmal sicher werden</div><h1>Wiederholen</h1><p class="lead">Du kannst alle geübten Themen wiederholen. Wenn du dich unsicher fühlst, lies zuerst den Lernzettel.</p>'+(items.length?'<div class="lesson-list">'+items.map(l=>'<button class="lesson-link" data-go="lesson" data-id="'+l.id+'"><span><strong>'+escapeHTML(l.title)+'</strong><small>'+getStatus(l.id)+'</small></span><span class="right">Üben →</span></button>').join("")+'</div>':'<div class="empty">Noch nichts geübt. Starte deine erste Lektion!<div class="actions" style="justify-content:center;margin-top:12px">'+viewButton("Themen entdecken","topics","","primary")+'</div></div>');
 }
 function progress(){
  const done=passed(),total=LESSONS.length;
  return '<div class="eyebrow">Lernstand auf diesem Gerät</div><h1>Mein Fortschritt</h1><div class="stats"><div class="stat"><strong>'+done+'</strong><span>Gelernt</span></div><div class="stat"><strong>'+attemptsCount()+'</strong><span>Runden</span></div><div class="stat"><strong>'+pct(done,total)+' %</strong><span>Fortschritt</span></div></div>'+progressBar(done,total)+'<h2 class="section">Deine Lernwelten</h2>'+GROUPS.map(g=>{const ls=groupLessons(g.id),n=ls.filter(l=>state.progress[l.id]?.passed).length;return '<section class="lesson-box"><div class="kicker"><strong>'+escapeHTML(g.title)+'</strong><span>'+n+' / '+ls.length+'</span></div>'+progressBar(n,ls.length)+'</section>';}).join("")+'<p class="note">Dies ist eine Orientierung, keine Schulnote. „Gelernt“ bedeutet, dass mindestens 75 % der Fragen in einer Übungsrunde beim ersten Versuch richtig beantwortet wurden.</p>';
 }
 function installGuide(){
  return '<section class="lesson-box"><h2>Als App installieren & offline lernen</h2><p>iPhone/iPad: Öffne die Seite in Safari, tippe auf Teilen und wähle „Zum Home-Bildschirm“. Android/Chrome: Öffne das Browsermenü und wähle „App installieren“.</p><p>Lade die Seite einmal vollständig mit Internetverbindung. Danach bleiben die Lerninhalte auf diesem Gerät auch offline verfügbar. Der Browser kann gespeicherte Appdaten bei Speicherknappheit löschen – nutze deshalb die Sicherungsfunktion.</p></section>';
 }
 function practiceControls(){
  const current=Number(state.settings.duration)||10;
  return '<section class="lesson-box"><h2>Mein Lerntempo</h2><p>Wähle, wie viele Aufgaben du pro Runde machen willst. Ohne Zeitlimit.</p><div class="chipset">'+
    [5,10,15].map(n=>'<button type="button" class="chip '+(current===n?'selected':'')+'" aria-pressed="'+(current===n)+'" data-action="set-duration" data-id="'+n+'">Ca. '+n+' Minuten</button>').join("")+'</div></section>';
 }
 function themeControls(){
  const current=state.settings.theme==="light"?"light":"dark";
  return '<section class="lesson-box"><h2>Darstellung</h2><p>Wähle das Design, das für dich am angenehmsten lesbar ist.</p><div class="chipset">'+
    ["dark","light"].map(id=>'<button type="button" class="chip '+(current===id?'selected':'')+'" aria-pressed="'+(current===id)+'" data-action="set-theme" data-id="'+id+'">'+(id==="dark"?"Midnight":"Paperlight")+'</button>').join("")+'</div></section>';
 }
 function profilesSection(){
  const buttons=Object.entries(state.profiles).map(([id,p])=>'<button type="button" class="chip '+(id===state.activeProfileId?'selected':'')+'" data-action="switch-profile" data-id="'+escapeHTML(id)+'">'+escapeHTML(p.profile?.name||"Profil")+'</button>').join("");
  return '<section class="lesson-box"><h2>Profile auf diesem Gerät</h2><p>Geschwister können hier eigene Lernstände anlegen.</p><div class="chipset">'+buttons+'</div><form id="new-profile-form"><div class="formrow"><div><label class="fieldlabel" for="new-name">Neues Profil</label><input id="new-name" name="name" maxlength="40" required class="field" placeholder="Name oder Spitzname"></div><div><label for="new-grade" class="fieldlabel">Klasse</label><select id="new-grade" name="grade" class="field">'+[5,6,7,8].map(n=>'<option value="'+n+'">'+n+'. Klasse</option>').join("")+'</select></div></div><button type="submit" class="btn">Profil hinzufügen</button></form></section>';
 }
 function settings(){
  return '<div class="eyebrow">Deine App</div><h1>Einstellungen</h1><section class="lesson-box"><h2>Schülerprofil</h2><form id="settings-form"><div class="formrow"><div><label class="fieldlabel" for="settings-name">Name / Spitzname</label><input class="field" id="settings-name" name="name" maxlength="40" required value="'+escapeHTML(state.profile.name)+'"></div><div><label class="fieldlabel" for="settings-grade">Klasse</label><select class="field" id="settings-grade" name="grade">'+[5,6,7,8].map(n=>'<option value="'+n+'"'+(String(n)===String(state.profile.grade)?' selected':'')+'>'+n+'. Klasse</option>').join("")+'</select></div></div><label class="check"><input name="short" type="checkbox"'+(state.settings.short?' checked':'')+'> Kurze Erklärungen bevorzugen</label><div class="actions"><button class="btn primary" type="submit">Speichern</button></div></form></section>'+profilesSection()+themeControls()+practiceControls()+installGuide()+'<section class="lesson-box"><h2>Lernstand sichern</h2><p>Dein Fortschritt wird lokal auf diesem Gerät gespeichert. Sichere ihn als Datei, wenn du den Browser wechselst oder Daten löschst.</p><div class="actions"><button class="btn" data-action="export">Sicherung herunterladen</button><label class="btn" for="import-file">Sicherung importieren</label><input id="import-file" type="file" accept="application/json,.json" class="sr-only"></div></section><section class="lesson-box warning"><h2>Daten löschen</h2><p>Alle lokalen Lernstände und das Profil auf diesem Gerät zurücksetzen.</p><button class="btn ghost" data-action="reset">Alle Daten löschen</button></section><p id="message" role="status" aria-live="polite"></p>';
 }
 function render(){
  document.documentElement.dataset.theme=state.settings.theme==="light"?"light":"dark";
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
  VISUALS.hydrate(document);
 }
 const notify=(message)=>{const n=document.querySelector("#message");if(n)n.textContent=message;};
 function installState(){
  const btn=document.querySelector("#install");if(!btn)return;
  if(deferredInstall)btn.classList.add("available");
 }
 window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredInstall=event;installState();});
 window.addEventListener("appinstalled",()=>{deferredInstall=null;installState();});
 const updateConnection=()=>{
   const el=document.querySelector("#connection");
   if(el){el.textContent=navigator.onLine?"Online":"Offline";el.className="pill "+(navigator.onLine?"online":"offline");}
 };
 window.addEventListener("online",updateConnection);window.addEventListener("offline",updateConnection);
 document.addEventListener("click",async event=>{
  const install=event.target.closest("#install");if(install&&deferredInstall){deferredInstall.prompt();deferredInstall=null;return;}
  const home=event.target.closest("[data-home]");if(home){event.preventDefault();go("home");return;}
  const goTo=event.target.closest("[data-go]");if(goTo){go(goTo.dataset.go,goTo.dataset.id||null);return;}
  const action=event.target.closest("[data-action]");if(!action)return;
  const type=action.dataset.action;
  if(type==="start"){startPractice(action.dataset.id);return;}
  if(type==="switch-profile"){switchProfile(action.dataset.id);return;}
  if(type==="set-theme"){state.settings.theme=action.dataset.id==="light"?"light":"dark";save();render();return;}
  if(type==="set-duration"){state.settings.duration=[5,10,15].includes(Number(action.dataset.id))?Number(action.dataset.id):10;save();render();return;}
  if(type==="toggle-short"){state.settings.short=!state.settings.short;save();render();return;}
  if(type==="print"){window.print();return;}
  if(type==="hint"){
   const l=getLesson(session.id),t=(session.questions||l.questions)[session.index];
   session.hints=(session.hints||0)+1;
   result={correct:false,title:session.hints===1?"Ein kleiner Tipp":"Zusätzliche Hilfe",body:session.hints===1?t.hint:session.hints===2?l.rule:t.solution};
   saveSession();render();return;
  }
  if(type==="simplify"){
   const l=getLesson(session.id);
   result={correct:false,title:"Ganz einfach erklärt",body:l.brief+" "+l.explain};
   render();return;
  }
  if(type==="reveal"){const t=(session.questions||getLesson(session.id).questions)[session.index];session.answered=true;result={correct:false,title:"So geht die Lösung: "+t.answer,body:t.solution};saveSession();render();return;}
  if(type==="next"){session.index++;session.answered=false;session.tries=0;session.hints=0;session.draft="";result=null;saveSession();render();document.querySelector("#answer")?.focus();return;}
  if(type==="export"){
   const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="mathe-hero-lernstand.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);notify("Sicherung wurde erstellt.");return;
  }
  if(type==="reset"&&window.confirm("Wirklich ALLE Profile und Lernstände auf diesem Gerät löschen?")){
   try{localStorage.removeItem(KEY);}catch{}
   state.profile=null;state.progress={};state.settings={short:false};state.profiles={};state.activeProfileId=null;go("home");
  }
 });
 document.addEventListener("submit",event=>{
  if(event.target.id==="welcome-form"){
   event.preventDefault();const f=new FormData(event.target),name=String(f.get("name")||"").trim();
   if(!name)return;
   state.activeProfileId="profile-"+Date.now();
   state.progress={};state.settings={short:f.has("short")};
   state.profile={name:name.slice(0,40),grade:String(f.get("grade")||"6")};
   save();go("home");return;
  }
  if(event.target.id==="new-profile-form"){
   event.preventDefault();const f=new FormData(event.target),name=String(f.get("name")||"").trim();
   if(!name)return;
   const id="profile-"+Date.now()+"-"+Math.floor(Math.random()*100000);
   state.activeProfileId=id;state.profile={name:name.slice(0,40),grade:String(f.get("grade")||"6")};
   state.progress={};state.settings={short:false};save();go("home");return;
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
   const task=(session.questions||getLesson(session.id).questions)[session.index];
   session.draft=value;
   const validation=ENGINE.check(value,task);
   if(validation.correct){
    if(session.tries===0)session.score++;
    session.answered=true;result={correct:true,title:"Richtig!",body:task.solution};
   }else{
    session.tries++;
    result={correct:false,title:"Noch nicht ganz – versuch es erneut.",body:validation.reason||ENGINE.diagnose(value,task)||task.hint};
   }
   saveSession();render();
   if(!session.answered){const field=document.querySelector("#answer");field?.focus();field?.select?.();}
  }
 });
 document.addEventListener("input",event=>{
   if(event.target?.id==="answer"&&session){session.draft=event.target.value;saveSession();}
 });
 document.addEventListener("change",async event=>{
  if(event.target.id!=="import-file")return;
  const file=event.target.files?.[0];if(!file)return;
  if(file.size>1024*1024){notify("Diese Sicherung ist zu groß.");return;}
  try{
   const data=JSON.parse(await file.text());
   const sanitizeProfile=p=>{
    if(!p||typeof p.name!=="string"||!p.name.trim())throw Error("Ungültiges Profil");
    return {name:p.name.trim().slice(0,40),grade:["5","6","7","8"].includes(String(p.grade))?String(p.grade):"6"};
   };
   const cleanProgress=progress=>{
    if(!progress||typeof progress!=="object"||Array.isArray(progress))throw Error("Ungültiger Lernstand");
    return Object.fromEntries(LESSONS.filter(l=>progress[l.id]).map(l=>{
      const p=progress[l.id],n=Number(p.best)||0,attempts=Number(p.attempts)||0;
      return [l.id,{best:Math.max(0,Math.min(1000,n)),attempts:Math.max(0,Math.min(100000,attempts)),
        passed:!!p.passed,reviewStreak:Math.max(0,Math.min(4,Number(p.reviewStreak)||0)),secure:!!p.secure,
        nextReview:typeof p.nextReview==="string"&&Number.isFinite(Date.parse(p.nextReview))?p.nextReview:null,
        updated:typeof p.updated==="string"?p.updated:""}];
    }));
   };
   if(!window.confirm("Vorhandenen Lernstand durch die Sicherung ersetzen?"))return;
   if(data.version===1){
    state.profile=sanitizeProfile(data.profile);state.progress=cleanProgress(data.progress);
    state.settings={short:!!data.settings?.short};
    state.activeProfileId="imported-1";state.profiles={};
   }else if(data.version===2&&data.profiles&&typeof data.profiles==="object"){
    const entries=Object.entries(data.profiles).slice(0,15).filter(([id,p])=>p?.profile&&p?.progress).map(([id,p],i)=>
      ["profile-"+i,{profile:sanitizeProfile(p.profile),progress:cleanProgress(p.progress),settings:{short:!!p.settings?.short,theme:p.settings?.theme==="light"?"light":"dark",duration:[5,10,15].includes(Number(p.settings?.duration))?Number(p.settings.duration):10}}]);
    if(!entries.length)throw Error("Leere Sicherung");
    state.profiles=Object.fromEntries(entries);state.activeProfileId=entries[0][0];
    state.profile=entries[0][1].profile;state.progress=entries[0][1].progress;state.settings=entries[0][1].settings;
   }else throw Error("Unbekanntes Format");
   save();go("progress");
  }catch{notify("Die Sicherungsdatei konnte nicht gelesen werden.");}
 });
 if("serviceWorker" in navigator && location.protocol==="https:")window.addEventListener("load",()=>{
  navigator.serviceWorker.register("./sw.js").catch(error=>console.warn("Offline-Funktion konnte nicht aktiviert werden:",error));
 });
 render();
})();