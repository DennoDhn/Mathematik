"use strict";
/* Offline SVG teaching labs. Values are clamped locally and never sent anywhere. */
(function(global){
 const h=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,Math.round(Number(v)||0)));
 const fractionIds=["bruchteile","vergleichen","kuerzen","erweitern","hauptnenner","bruchplus","bruchminus","bruchmal","bruchgeteilt"];
 const grade=(kind)=>({"fraction":"Bruch-Labor","decimal":"Komma-Labor","negative":"Zahlenstrahl","percent":"Prozent-Studio","geometry":"Geometrie-Labor","equation":"Gleichungswaage"}[kind]||"Mitmach-Labor");
 const details={
  fraction:"Verändere den Zähler und Nenner und beobachte, wie sich der Anteil verändert. Die Fläche zeigt den Wert – nicht die Größe der Zahlen.",
  decimal:"Jedes gefärbte Kästchen entspricht einem Hundertstel. Verschiebe den Regler und beobachte Dezimalzahl, Bruch und Prozent.",
  negative:"Ziehe die Markierung auf dem Zahlenstrahl. Links von null ist negativ, rechts positiv.",
  percent:"Wähle einen Rabatt. Du siehst sofort, welcher Teil von 100 € übrig bleibt.",
  geometry:"Verändere Länge und Breite: Fläche und Umfang reagieren unterschiedlich.",
  equation:"Verändere x. Beide Seiten der Gleichung sind nur bei der richtigen Zahl im Gleichgewicht."
 };
 function category(id){
  if(fractionIds.includes(id))return "fraction";
  if(["dezimalstellen","bruchkomma","kommaplus","kommamal","kommageteilt"].includes(id))return "decimal";
  if(["negativ","vorzeichen"].includes(id))return "negative";
  if(["prozente","prozentwert","dreisatz"].includes(id))return "percent";
  if(["umfang","flaeche","volumen","winkel"].includes(id))return "geometry";
  if(["gleichung","terme"].includes(id))return "equation";
  return null;
 }
 const configs={
  fraction:[["num","Ausgewählte Teile",1,12,3],["den","Teile insgesamt",2,12,4]],
  decimal:[["hund","Hundertstel",0,100,35]],
  negative:[["position","Position auf dem Zahlenstrahl",-10,10,-3]],
  percent:[["percent","Rabatt in Prozent",0,90,25]],
  geometry:[["length","Länge in cm",1,12,7],["width","Breite in cm",1,10,4]],
  equation:[["x","Wie groß ist x?",0,10,3]]
 };
 function markup(lesson){
  const kind=category(lesson.id);
  if(!kind)return "";
  return '<section class="lesson-box lab-section"><div class="lab-heading"><span class="lab-glyph" aria-hidden="true">✦</span><div><div class="eyebrow">Zum Ausprobieren</div><h2>'+grade(kind)+'</h2></div></div><p>'+details[kind]+'</p><div class="lab-visual" data-lab-canvas="'+kind+'" role="group" aria-label="'+grade(kind)+'"></div><div class="lab-controls">'+configs[kind].map(([id,label,min,max,start])=>'<label class="lab-control"><span>'+h(label)+': <output data-lab-output="'+id+'">'+start+'</output></span><input data-lab="'+kind+'" data-field="'+id+'" type="range" min="'+min+'" max="'+max+'" value="'+start+'" step="1" aria-label="'+h(label)+'"></label>').join("")+'</div></section>';
 }
 function bars(num,den,colour,y){
  return Array.from({length:den},(_,i)=>'<rect x="'+(10+i*480/den)+'" y="'+y+'" width="'+Math.max(1,480/den-3)+'" height="48" rx="5" fill="'+(i<num?colour:"#263A56")+'" stroke="#4F6584" stroke-width="1"/>').join("");
 }
 const svgBody=(inner,viewBox="0 0 500 120")=>'<svg viewBox="'+viewBox+'" class="lab-svg" role="img" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">'+inner+'</svg>';
 const fillBar=(filled,total)=>'<div class="lab-meter"><span style="width:'+(100*filled/Math.max(total,1))+'%"></span></div>';
 function canvas(kind,values){
  if(kind==="fraction"){
   const den=clamp(values.den,2,12),num=clamp(values.num,0,den),ratio=global.MATHE_ENGINE.rational(BigInt(num),BigInt(den));
   return svgBody(bars(num,den,"#AFEF79",13)+bars(Number(ratio.n),Number(ratio.d),"#66B7FF",78),"0 0 500 143")
    +'<div class="lab-equation"><strong>'+num+'/'+den+'</strong><span>=</span><strong>'+ratio.n+'/'+ratio.d+'</strong></div><p class="lab-caption">Oben: deine Einteilung · unten: derselbe Anteil vollständig gekürzt.</p>';
  }
  if(kind==="decimal"){
   const n=clamp(values.hund,0,100);
   const rects=Array.from({length:100},(_,i)=>'<rect x="'+(12+(i%10)*48)+'" y="'+(9+Math.floor(i/10)*30)+'" width="41" height="23" rx="4" fill="'+(i<n?"#66B7FF":"#263A56")+'"/>').join("");
   return svgBody(rects,"0 0 500 320")+'<div class="lab-equation"><strong>'+(n/100).toFixed(2).replace(".",",")+'</strong><span>=</span><strong>'+n+'/100</strong></div><p class="lab-caption">'+n+' von 100 Kästchen sind markiert.</p>';
  }
  if(kind==="negative"){
   const p=clamp(values.position,-10,10);
   const marks=Array.from({length:21},(_,i)=>{
    const x=19+i*23;
    return '<line x1="'+x+'" y1="40" x2="'+x+'" y2="62" stroke="#7891AD" stroke-width="2"/><text x="'+x+'" y="88" font-size="13" text-anchor="middle" fill="#C8D7EB">'+(i-10)+'</text>';
   }).join("");
   const x=19+(p+10)*23;
   return svgBody('<line x1="12" y1="52" x2="487" y2="52" stroke="#7891AD" stroke-width="3"/>'+marks+'<circle cx="'+x+'" cy="52" r="14" fill="#B7F56C" stroke="#0B1020" stroke-width="4"/>',"0 0 500 110")+'<div class="lab-equation"><strong>'+p+'</strong></div><p class="lab-caption">'+(p<0?"Links von 0 liegen die negativen Zahlen.":p>0?"Rechts von 0 liegen die positiven Zahlen.":"Die Null ist der Mittelpunkt.")+'</p>';
  }
  if(kind==="percent"){
   const p=clamp(values.percent,0,90);
   return '<div class="lab-price"><div><span>Vorher</span><strong>100 €</strong></div><span class="lab-arrow">→</span><div><span>Jetzt</span><strong>'+(100-p)+' €</strong></div></div>'+fillBar(100-p,100)+'<div class="lab-equation"><strong>'+p+' % Rabatt</strong><span>·</span><strong>'+p+' € gespart</strong></div>';
  }
  if(kind==="geometry"){
   const l=clamp(values.length,1,12),w=clamp(values.width,1,10);
   return svgBody('<rect x="90" y="10" width="'+(l*22)+'" height="'+(w*16)+'" rx="3" fill="#263D69" stroke="#B7F56C" stroke-width="4"/><text x="'+(90+l*11)+'" y="'+(24+w*8)+'" text-anchor="middle" fill="#EAF2FF" font-size="22" font-weight="800">'+(l*w)+' cm²</text>',"0 0 500 190")+'<div class="lab-equation"><strong>Fläche: '+(l*w)+' cm²</strong><span>·</span><strong>Umfang: '+(2*(l+w))+' cm</strong></div>';
  }
  const x=clamp(values.x,0,10),left=2*x+3,target=13;
  return '<div class="lab-scale"><div><span>2 × '+x+' + 3</span><strong>'+left+'</strong></div><span class="lab-scale-sign">'+(left===target?"=":"≠")+'</span><div><span>Rechte Seite</span><strong>'+target+'</strong></div></div><p class="lab-caption">'+(left===target?"Gleichgewicht! x = 5 ist die Lösung.":"Schiebe x so, dass links und rechts dieselbe Zahl herauskommt.")+'</p>';
 }
 function hydrate(root=document){
  root.querySelectorAll("[data-lab-canvas]").forEach(el=>{
   const kind=el.dataset.labCanvas,container=el.closest(".lab-section");if(!container)return;
   const values={};
   container.querySelectorAll("[data-field]").forEach(input=>{values[input.dataset.field]=Number(input.value);});
   if(kind==="fraction"&&values.num>values.den){values.num=values.den;const input=container.querySelector('[data-field="num"]');input.value=String(values.num);}
   container.querySelectorAll("[data-lab-output]").forEach(out=>{out.textContent=String(values[out.dataset.labOutput]);});
   el.innerHTML=canvas(kind,values);
  });
 }
 document.addEventListener("input",e=>{
  if(!e.target.matches?.("[data-lab]"))return;
  hydrate(e.target.closest(".lab-section"));
 });
 global.MATHE_VISUALS={markup,hydrate,category};
})(window);
