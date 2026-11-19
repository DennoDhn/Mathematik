"use strict";
/* MATHE HERO 0.2: mathematisch exakte, überprüfbare Aufgabenbewertung und Aufgabenvariation.
   Läuft vollständig lokal (auch offline) und benötigt keine externe Bibliothek. */
(function(global){
 const abs=n=>n<0n?-n:n;
 function gcd(a,b){a=abs(a);b=abs(b);while(b){[a,b]=[b,a%b]}return a||1n;}
 function rational(a,b=1n){
  if(b===0n)throw Error("Division durch null");
  if(b<0n){a=-a;b=-b;}
  const d=gcd(a,b);return {n:a/d,d:b/d};
 }
 function parse(value){
  if(typeof value!=="string"&&typeof value!=="number")return null;
  const input=String(value).trim().replace(/\u2212/g,"-").replace(/\s/g,"");
  const fraction=input.split("/");
  if(fraction.length>2)return null;
  const parseDecimal=s=>{
   if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(s))return null;
   let sign=1n,t=s.replace(",",".");if(t[0]==="-"){sign=-1n;t=t.slice(1)}else if(t[0]==="+")t=t.slice(1);
   const [whole,decimal=""]=t.split(".");
   const denominator=10n**BigInt(decimal.length);
   return rational(sign*BigInt((whole||"0")+decimal),denominator);
  };
  try{
   const a=parseDecimal(fraction[0]);if(!a)return null;
   if(fraction.length===1)return a;
   const b=parseDecimal(fraction[1]);if(!b||b.n===0n)return null;
   return rational(a.n*b.d,a.d*b.n);
  }catch{return null;}
 }
 function isFraction(s){return /^[+-]?\d+\s*\/\s*[+-]?\d+$/.test(String(s).trim())}
 function equal(a,b){return !!a&&!!b&&a.n===b.n&&a.d===b.d}
 function normalized(s){return String(s??"").trim().toLowerCase().replace(/\u2212/g,"-").replace(/\s+/g,"").replace(/,/g,".");}
 function check(input,task){
  const answer=String(task.answer),response=String(input??"").trim();
  if(!response)return {correct:false,reason:"Bitte gib ein Ergebnis ein."};
  const question=String(task.question||"").toLowerCase();
  const mode=task.mode&&task.mode!=="exact"?task.mode:(
    /erweitere\b/.test(question)?"expanded":
    /vollständig|gekürzt|kürze\b/.test(question)?"simplified":
    /als bruch|welcher bruch|welcher ist größer|wahrscheinlichkeit.*bruch/.test(question)?"fraction":
    /als dezimalzahl/.test(question)?"decimal":
    /als prozent/.test(question)?"percent":"equivalent");
  if(/[a-zäöü]/i.test(answer)&&!/%/.test(answer)&&!/^[-+]?\d*x/i.test(answer)){
   return {correct:normalized(response)===normalized(answer)};
  }
  if(/x/.test(answer)){
   return {correct:normalized(response)===normalized(answer)};
  }
  if(mode==="percent"||/%/.test(answer)){
   const v=normalized(response).replace(/prozent$/,"");
   if(!v.endsWith("%")&&!/%/.test(answer))return {correct:false};
   const a=parse(v.replace("%","")),b=parse(answer.replace("%",""));
   return {correct:equal(a,b)};
  }
  const a=parse(response),b=parse(answer);
  if(!a||!b)return {correct:false,reason:"Nutze z. B. 3/4 oder 0,75."};
  if(!equal(a,b))return {correct:false};
  if(mode==="decimal"&&response.includes("/"))return {correct:false,reason:"Bitte als Kommazahl schreiben."};
  if(["fraction","simplified","expanded"].includes(mode)&&!isFraction(response))return {correct:false,reason:"Bitte als Bruch mit / schreiben."};
  if(mode==="simplified"){
   const raw=response.split("/").map(t=>BigInt(t.trim()));
   if(gcd(raw[0],raw[1])!==1n)return {correct:false,reason:"Das Ergebnis stimmt, aber du kannst noch weiter kürzen."};
  }
  if(mode==="expanded"&&normalized(response)!==normalized(answer))return {correct:false,reason:"Der Wert stimmt. Gesucht ist die Erweiterung mit dem angegebenen Faktor."};
  return {correct:true};
 }
 function random(seed){
  let s=(seed>>>0)||1;
  return ()=>{s=(s+0x6D2B79F5)|0;let t=Math.imul(s^(s>>>15),1|s);t=(t+Math.imul(t^(t>>>7),61|t))^t;return ((t^(t>>>14))>>>0)/4294967296;};
 }
 function hash(value){let n=2166136261;for(const c of String(value)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return n>>>0;}
 function generator(id,seed,count=4){
  const rand=random(hash(id+":"+seed)),r=(a,b)=>a+Math.floor(rand()*(b-a+1)),out=[];
  const add=(question,answer,hint,solution,mode)=>{
   out.push({question,answer:String(answer),hint,solution,mode});
  };
  for(let i=0;i<count;i++){
   let a,b,c,d,n,v,w,ans;
   switch(id){
    case "kuerzen":
     a=r(1,8);b=r(a+1,12);c=r(2,7);
     const reduce=gcd(BigInt(a),BigInt(b));if(reduce>1n){a=Number(BigInt(a)/reduce);b=Number(BigInt(b)/reduce)}
     add("Kürze "+(a*c)+"/"+(b*c)+" vollständig.",a+"/"+b,"Teile Zähler und Nenner durch "+c+".",(a*c)+" : "+c+" = "+a+" und "+(b*c)+" : "+c+" = "+b+".","simplified");break;
    case "erweitern":
     a=r(1,5);b=r(a+1,10);c=r(2,8);
     add("Erweitere "+a+"/"+b+" mit "+c+".",(a*c)+"/"+(b*c),"Multipliziere oben UND unten mit "+c+".",a+" × "+c+" = "+(a*c)+", "+b+" × "+c+" = "+(b*c)+".","expanded");break;
    case "bruchplus":case "bruchminus":
     b=r(4,12);a=r(1,b-2);c=r(1,id==="bruchminus"?a:b-a);
     ans=id==="bruchplus"?a+c:a-c;
     const q=rational(BigInt(ans),BigInt(b));
     add(a+"/"+b+(id==="bruchplus"?" + ":" - ")+c+"/"+b+" = ? (gekürzt)",q.n+"/"+q.d,"Der Nenner bleibt gleich. Rechne nur die Zähler.",a+(id==="bruchplus"?" + ":" - ")+c+" = "+ans+", Ergebnis: "+q.n+"/"+q.d+".","simplified");break;
    case "bruchmal":
     a=r(1,8);b=r(2,9);c=r(1,6);d=r(2,9);
     n=rational(BigInt(a*c),BigInt(b*d));
     add(a+"/"+b+" × "+c+"/"+d+" = ? (gekürzt)",n.n+"/"+n.d,"Oben mal oben, unten mal unten.",(a*c)+"/"+(b*d)+" = "+n.n+"/"+n.d+".","simplified");break;
    case "bruchgeteilt":
     a=r(1,5);b=r(a+1,9);c=r(1,5);d=r(c+1,10);
     n=rational(BigInt(a*d),BigInt(b*c));
     add(a+"/"+b+" : "+c+"/"+d+" = ? (gekürzt)",n.n+"/"+n.d,"Kehre den ZWEITEN Bruch um und multipliziere.",a+"/"+b+" × "+d+"/"+c+" = "+n.n+"/"+n.d+".","simplified");break;
    case "kommaplus":
     a=r(10,990);b=r(10,950);
     add((a/100).toFixed(2).replace(".",",")+" + "+(b/100).toFixed(2).replace(".",",")+" = ?",((a+b)/100).toFixed(2).replace(".",","),"Komma unter Komma schreiben.",a+"/100 + "+b+"/100 = "+(a+b)+"/100.");break;
    case "kommamal":
     a=r(2,19);b=r(2,9);n=rational(BigInt(a*b),100n);
     add((a/10).toFixed(1).replace(".",",")+" × "+(b/10).toFixed(1).replace(".",",")+" = ?",String(Number(n.n)/Number(n.d)).replace(".",","),"Zuerst ohne Komma malnehmen, danach zwei Nachkommastellen.",a+" × "+b+" = "+a*b+". Mit zwei Nachkommastellen: "+String(Number(n.n)/Number(n.d)).replace(".",","));break;
    case "prozentwert":
     a=r(2,20)*10;b=[10,20,25,50][r(0,3)];c=a*b/100;
     add(b+" % von "+a+" = ?",c,"Teile "+a+" durch 100 und multipliziere mit "+b+".",a+" × "+b+" / 100 = "+c+".");break;
    case "dreisatz":
     a=r(2,8);b=r(2,8);c=r(2,10);
     add(a+" Hefte kosten "+(a*b)+" €. Was kosten "+c+" Hefte? (in Euro)",b*c,"Erst den Preis für ein Heft ausrechnen.",a*b+" : "+a+" = "+b+" € pro Heft; "+c+" × "+b+" = "+b*c+" €.");break;
    case "gleichung":
     a=r(2,8);b=r(1,12);c=r(1,12);
     add(a+"x + "+b+" = "+(a*c+b)+". Was ist x?",c,"Ziehe erst "+b+" ab und teile dann durch "+a+".",a+"x = "+a*c+", also x = "+c+".");break;
    case "negativ":
     a=r(1,12);b=r(2,15);
     add("-"+a+" + "+b+" = ?",b-a,"Starte links von null und gehe "+b+" nach rechts.","-"+a+" + "+b+" = "+(b-a)+".");break;
    case "umfang":
     a=r(2,18);b=r(2,12);
     add("Rechteck: "+a+" cm lang, "+b+" cm breit. Umfang in cm?",2*(a+b),"Addiere alle vier Seiten.",a+" + "+b+" + "+a+" + "+b+" = "+(2*(a+b))+" cm.");break;
    case "flaeche":
     a=r(2,14);b=r(2,12);
     add("Rechteck: "+a+" cm × "+b+" cm. Fläche in cm²?",a*b,"Länge mal Breite.",a+" × "+b+" = "+(a*b)+" cm².");break;
    default:return [];
   }
  }
  return out;
 }
 function createSet(lesson,seed){
  const fixed=lesson.questions.map(q=>({...q}));
  const generated=generator(lesson.id,seed,4);
  if(!generated.length)return fixed;
  const rnd=random(hash(lesson.id+"-order-"+seed));
  const selected=[...fixed.slice(0,2),...generated];
  for(let i=selected.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[selected[i],selected[j]]=[selected[j],selected[i]];}
  return selected;
 }
 global.MATHE_ENGINE={parse,rational,gcd,equal,check,createSet,generator,hash};
})(window);
