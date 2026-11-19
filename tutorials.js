"use strict";
/* MATHE HERO SCHOOL 1.0
 * Eigenständiger, fachlich formulierter Unterricht VOR dem Lernzettel und den Übungen.
 * Kerninhalte pro Lektion, ohne Login, Server oder Drittanbieter-Ressourcen.
 */
(function(global){
 const WORLDS={
  "basis": {
    "name": "Rechnen verstehen",
    "lead": "Zahlen sind nicht nur Zeichen. Sie helfen dir, Mengen zu vergleichen, zu verteilen und Veränderungen zu beschreiben.",
    "why": "Malnehmen, Teilen und die Reihenfolge von Rechenschritten bilden das Fundament für fast alle weiteren Mathethemen.",
    "map": [
      "Wie Zahlen und Rechenzeichen zusammenhängen",
      "Warum Rechengesetze für alle gelten",
      "Wie du Ergebnisse selbst überprüfst"
    ]
  },
  "brueche": {
    "name": "Brüche richtig begreifen",
    "lead": "Ein Bruch ist keine geheimnisvolle Schreibweise: Er beschreibt, wie ein Ganzes in gleich große Stücke geteilt wird.",
    "why": "Erst wenn du den Zusammenhang zwischen Stückgröße und Stückanzahl verstehst, werden Kürzen, Erweitern und Bruchrechnen logisch.",
    "map": [
      "Zähler und Nenner verstehen",
      "Gleichwertige Brüche sehen und begründen",
      "Brüche sicher umformen und berechnen"
    ]
  },
  "dezimal": {
    "name": "Das Geheimnis des Kommas",
    "lead": "Eine Dezimalzahl ist nur eine andere Schreibweise für Ganze und Bruchteile. Jede Stelle zählt.",
    "why": "Kommazahlen brauchst du bei Geld, Längen, Messwerten und später bei Prozenten und Formeln.",
    "map": [
      "Zehntel, Hundertstel und Tausendstel erkennen",
      "Brüche und Dezimalzahlen verbinden",
      "Mit dem Komma sicher rechnen"
    ]
  },
  "rational": {
    "name": "Über und unter null",
    "lead": "Der Zahlenstrahl geht links von null weiter. Negative Zahlen beschreiben Temperaturen, Schulden oder Bewegungen.",
    "why": "Mit dem Vorzeichen kannst du Richtungen und Veränderungen rechnen, die mit positiven Zahlen nicht beschrieben werden können.",
    "map": [
      "Negative Werte auf dem Zahlenstrahl lesen",
      "Abstände und Richtungen unterscheiden",
      "Vorzeichenregeln begründen"
    ]
  },
  "prozent": {
    "name": "Anteile im Alltag",
    "lead": "Prozent beschreibt einen Anteil von hundert. Damit kannst du Rabatte, Preise und Veränderungen verständlich vergleichen.",
    "why": "Bei Angeboten, Statistiken, Rezepten und Geschwindigkeiten brauchst du Anteile und Verhältnisse.",
    "map": [
      "Anteile in Prozent ausdrücken",
      "Von einem bekannten Wert auf andere schließen",
      "Rabatte und Veränderungen berechnen"
    ]
  },
  "algebra": {
    "name": "Mathe mit Buchstaben",
    "lead": "Ein Buchstabe wie x steht für eine Zahl, die du noch nicht kennst oder verändern möchtest.",
    "why": "Mit Termen und Gleichungen lassen sich Rätsel und Alltagssituationen systematisch statt durch Raten lösen.",
    "map": [
      "Unbekannte Zahlen beschreiben",
      "Gleichungen wie eine Waage behandeln",
      "Rechenausdrücke sicher umformen"
    ]
  },
  "graph": {
    "name": "Zusammenhänge sichtbar machen",
    "lead": "Auf einem Koordinatensystem kannst du Zahlenpaare als Punkte zeichnen und Veränderungen in einer Linie erkennen.",
    "why": "Graphen helfen, Fahrten, Preise, Messungen und viele andere Zusammenhänge auf einen Blick zu verstehen.",
    "map": [
      "Punkte mit zwei Zahlen finden",
      "Wertetabellen lesen",
      "Graphen richtig deuten"
    ]
  },
  "geo": {
    "name": "Die Welt vermessen",
    "lead": "Geometrie beschäftigt sich mit Formen, Linien, Flächen und räumlichen Körpern.",
    "why": "Beim Bauen, Zeichnen, Verpacken und Einrichten helfen Maße, Flächen und Volumen.",
    "map": [
      "Größen und Einheiten richtig wählen",
      "Umfang, Fläche und Volumen unterscheiden",
      "Formen und Winkel erklären"
    ]
  },
  "daten": {
    "name": "Daten verstehen statt raten",
    "lead": "Zahlen aus Umfragen und Experimenten werden erst durch eine gute Darstellung verständlich.",
    "why": "Du lernst, Diagramme kritisch zu lesen, typische Werte zu erkennen und Zufall richtig einzuschätzen.",
    "map": [
      "Daten sortieren und darstellen",
      "Durchschnitt und andere Kennzahlen unterscheiden",
      "Wahrscheinlichkeiten erklären"
    ]
  }
};
 const THEORY={
  "einmaleins": {
    "meaning": "Multiplizieren fasst gleich große Gruppen zusammen: 5 × 4 meint fünfmal vier Dinge. Division kann die Anzahl der Gruppen oder die Anzahl pro Gruppe suchen.",
    "reason": "Wenn du jede Gruppe gleich groß hältst, darfst du addieren, statt alles einzeln zu zählen. Bei Division macht eine passende Malaufgabe die Probe.",
    "method": "Erst bestimmen, was sich wiederholt. Schreibe die Malaufgabe. Prüfe das Ergebnis, indem du rückwärts teilst."
  },
  "reihenfolge": {
    "meaning": "Eine Rechenaufgabe ist wie eine vereinbarte Sprache. Klammern geben einen Auftrag, Punktrechnungen verbinden Gruppen, Strichrechnungen fügen Mengen hinzu oder ziehen sie ab.",
    "reason": "Für 2 + 3 × 4 gehören zuerst drei Vierergruppen zusammen: 12. Die 2 kommt danach hinzu. Das Ergebnis 14 ist kein Zufall, sondern eine gemeinsame Regel.",
    "method": "Zuerst Klammern von innen nach außen, dann × und : von links nach rechts, zuletzt + und − von links nach rechts."
  },
  "bruchteile": {
    "meaning": "Stell dir einen Kuchen vor, den du in gleich große Stücke aufteilst. Beim Bruch 3/4 zeigt die 4, dass das Ganze aus vier gleichen Teilen besteht. Die 3 sagt, dass du drei davon hast.",
    "reason": "Der Nenner bestimmt die Größe der Stücke. Achtel sind bei gleich großem Kuchen kleiner als Viertel. Der Zähler zählt diese Stücke. Ein Bruch kann auch größer als 1 sein, etwa 5/4.",
    "method": "Zeichne ein Ganzes. Teile es entsprechend dem Nenner auf. Male so viele Teile an, wie der Zähler angibt."
  },
  "vergleichen": {
    "meaning": "Beim Vergleichen hilft die Frage: Welcher Anteil vom selben Ganzen ist größer? Bei gleichem Nenner vergleichst du die Zähler. Bei unterschiedlichem Nenner musst du die Stückgrößen erst angleichen.",
    "reason": "1/2 und 2/4 sind gleich groß: Wenn du eine Hälfte in zwei gleich große Teile zerschneidest, erhältst du zwei Viertel. So kannst du Brüche gefahrlos vergleichbar machen.",
    "method": "Suche einen gemeinsamen Nenner. Erweitere beide Brüche. Vergleiche die neuen Zähler. Prüfe mit einer Skizze."
  },
  "kuerzen": {
    "meaning": "Kürzen bedeutet: einen Bruch einfacher schreiben, ohne seine Größe zu verändern. Bei 6/8 kannst du sowohl 6 als auch 8 durch 2 teilen. Daraus wird 3/4.",
    "reason": "Wenn du oben und unten durch dieselbe Zahl teilst, teilst du eigentlich durch einen Bruch wie 2/2. Dieser Bruch ist genau 1, also bleibt der Wert erhalten. Du bündelst kleine Stücke zu größeren.",
    "method": "Finde einen gemeinsamen Teiler größer als 1. Teile Zähler und Nenner durch diese Zahl. Wiederhole das, bis beide teilerfremd sind."
  },
  "erweitern": {
    "meaning": "Erweitern ist das Gegenstück zum Kürzen: Du verteilst denselben Anteil auf mehr, kleinere Stücke. Aus 2/3 werden durch Erweitern mit 4 genau 8/12.",
    "reason": "2/3 × 4/4 = 8/12. Da 4/4 genau 1 ist, verändert die Multiplikation den Anteil nicht. Nur die Darstellung ist anders. So entstehen gleiche Stückgrößen für Rechnungen.",
    "method": "Wähle den Erweiterungsfaktor. Multipliziere damit sowohl den Zähler als auch den Nenner. Vergleiche den Wert mit dem Ausgangsbruch."
  },
  "hauptnenner": {
    "meaning": "Ein Halb und ein Drittel sind unterschiedlich große Stücke. Für Plus und Minus brauchst du deshalb eine gemeinsame Stückgröße – einen gemeinsamen Nenner.",
    "reason": "Die Nenner 2 und 3 haben das kleinste gemeinsame Vielfache 6. Eine Hälfte wird zu 3/6, ein Drittel zu 2/6. Erst jetzt stehen gleich große Teile da.",
    "method": "Schreibe die Vielfachen der Nenner auf. Nimm das kleinste gemeinsame Vielfache. Erweitere jeden Bruch auf diesen Nenner."
  },
  "bruchplus": {
    "meaning": "Beim Addieren von Brüchen zählt man gleich große Teile zusammen. 2/7 + 3/7 sind fünf Siebtel, weil beide aus Siebteln bestehen.",
    "reason": "Bei 1/2 + 1/3 sind die Stücke verschieden groß. Verwandle sie in Sechstel: 3/6 + 2/6 = 5/6. Die Nenner werden nicht addiert, weil die Stückgröße gleich bleibt.",
    "method": "Prüfe die Nenner. Mache sie nötigenfalls gleich. Addiere nur die Zähler. Kürze das Ergebnis, wenn möglich."
  },
  "bruchminus": {
    "meaning": "Bruchsubtraktion beschreibt, wie viel von einem Anteil nach dem Wegnehmen übrig bleibt. 5/8 − 2/8 bedeutet: Von fünf Achtelstücken nimmst du zwei weg.",
    "reason": "Der gemeinsame Nenner sagt weiterhin, wie groß jedes Stück ist. Nur ihre Anzahl verändert sich. Bei verschiedenen Nennern musst du erst gleich große Stücke bilden.",
    "method": "Mache die Brüche gleichnamig. Ziehe den zweiten Zähler vom ersten ab. Der Nenner bleibt gleich; kürze danach."
  },
  "bruchmal": {
    "meaning": "Wenn du die Hälfte von einem Drittel suchst, brauchst du 1/2 × 1/3. Das ist 1/6 des ursprünglichen Ganzen.",
    "reason": "Die erste Teilung macht drei gleiche Stücke, die zweite halbiert jedes davon. Aus einem Ganzen entstehen sechs gleich große kleine Bereiche. Daher multiplizieren sich die Nenner.",
    "method": "Multipliziere Zähler mal Zähler und Nenner mal Nenner. Kürze möglichst vor oder nach dem Rechnen."
  },
  "bruchgeteilt": {
    "meaning": "Bruchdivision fragt, wie oft ein bestimmter Bruch in einen anderen passt. In einer Hälfte stecken genau zwei Viertel: 1/2 : 1/4 = 2.",
    "reason": "Durch ein Viertel teilen bedeutet, Viertel zu zählen; das entspricht mal vier. Allgemein wird beim Teilen durch einen Bruch mit dessen Kehrwert multipliziert.",
    "method": "Schreibe den ersten Bruch unverändert. Drehe nur den zweiten Bruch um. Multipliziere und kürze. Durch 0 ist Division verboten."
  },
  "dezimalstellen": {
    "meaning": "Dezimalzahlen haben dieselbe Stellenwertlogik wie ganze Zahlen. Links vom Komma stehen Einer, Zehner und Hunderter; rechts stehen Zehntel, Hundertstel und Tausendstel.",
    "reason": "Jede Stelle nach rechts ist zehnmal kleiner. Darum bedeutet 0,6 sechs Zehntel und 0,06 sechs Hundertstel. Eine zusätzliche Null am Ende wie 0,60 ändert dagegen nichts.",
    "method": "Lies die Stellen einzeln ab. Ergänze fehlende Stellen mit Null. Vergleiche von links nach rechts, nicht nach der Länge der Zahl."
  },
  "bruchkomma": {
    "meaning": "Ein Bruchstrich bedeutet Division. Du kannst den Bruch 3/4 daher als 3 : 4 rechnen und erhältst 0,75.",
    "reason": "Bei endlichen Dezimalzahlen kannst du umgekehrt die Stellen verwenden: 0,75 sind 75 Hundertstel, also 75/100 = 3/4. Manche Brüche, etwa 1/3, ergeben periodische Dezimalzahlen.",
    "method": "Bruch zu Dezimal: Zähler durch Nenner teilen. Dezimal zu Bruch: passende Zehnerpotenz als Nenner wählen und kürzen."
  },
  "kommaplus": {
    "meaning": "Bei Dezimalzahlen darfst du nur gleiche Stellenwerte zusammenrechnen. 2,5 Euro sind 2 Euro und 50 Cent. Mit 0,35 Euro ergibt das 2,85 Euro.",
    "reason": "Schreibe die Zahlen so untereinander, dass die Kommas genau übereinanderstehen. Fehlende Stellen kannst du mit Nullen ergänzen, denn 2,5 = 2,50.",
    "method": "Komma unter Komma schreiben. Von rechts nach links addieren oder subtrahieren. Komma im Ergebnis an derselben Stelle setzen."
  },
  "kommamal": {
    "meaning": "Multiplikation mit Kommazahlen funktioniert zunächst wie mit ganzen Zahlen. Anschließend musst du das Ergebnis an die Größenordnung der Faktoren anpassen.",
    "reason": "0,4 × 0,2 ist vier Zehntel mal zwei Zehntel. Das ergibt acht Hundertstel, also 0,08. Deshalb addierst du die Nachkommastellen beider Faktoren.",
    "method": "Rechne ohne Komma. Addiere die Anzahl der Nachkommastellen. Setze das Komma im Produkt entsprechend weit von rechts."
  },
  "kommageteilt": {
    "meaning": "Bei der Division von Kommazahlen darfst du beide Zahlen mit derselben Zehnerpotenz multiplizieren. Ihr Verhältnis bleibt dadurch gleich.",
    "reason": "4,5 : 0,5 ist genauso groß wie 45 : 5, denn beide Werte wurden mit 10 vervielfacht. Die zweite Aufgabe ist leichter zu rechnen.",
    "method": "Mache den Divisor durch Verschieben beider Kommas zur ganzen Zahl. Teile danach wie gewohnt. Prüfe durch Rückmultiplikation."
  },
  "negativ": {
    "meaning": "Eine negative Zahl liegt links von null auf dem Zahlenstrahl. −5 Grad bedeutet fünf Grad unter null; +5 Grad fünf Grad darüber.",
    "reason": "Je weiter links eine Zahl liegt, desto kleiner ist sie. Deshalb ist −8 kleiner als −3. Beim Addieren positiver Zahlen gehst du nach rechts, beim Addieren negativer nach links.",
    "method": "Markiere die Startzahl. Bestimme Vorzeichen und Richtung. Zähle die Schritte auf dem Zahlenstrahl."
  },
  "vorzeichen": {
    "meaning": "Beim Multiplizieren und Dividieren entscheidet neben den Beträgen auch das Vorzeichen. Gleiche Vorzeichen ergeben Plus, verschiedene Minus.",
    "reason": "Ein negatives Mal beschreibt eine Umkehrung der Richtung. Zweimal umkehren führt zurück zur ursprünglichen Richtung: Minus mal Minus ist deshalb Plus.",
    "method": "Rechne die Beträge ohne Vorzeichen. Bestimme das Ergebnisvorzeichen aus den zwei Ausgangsvorzeichen. Setze beides zusammen."
  },
  "prozente": {
    "meaning": "Prozent ist eine besondere Bruchschreibweise: Prozent bedeutet pro hundert. 25 % sind 25/100 und entsprechen 1/4.",
    "reason": "Damit kannst du Anteile bei verschiedenen Grundmengen vergleichen. 50 % von einer kleinen Pizza sind genauso eine Hälfte wie 50 % von einer großen – die Mengen sind aber unterschiedlich groß.",
    "method": "Schreibe die Prozentzahl als Hundertstel oder Dezimalzahl. Bei einem Anteil einer Menge multipliziere mit dem Grundwert."
  },
  "prozentwert": {
    "meaning": "Der Prozentwert ist der Teil einer Menge, den ein Prozentsatz beschreibt. 20 % von 50 Euro sind 10 Euro.",
    "reason": "Da 20 % = 0,2 ist, rechnest du 50 × 0,2. Bei einem Rabatt ist der gesparte Betrag der Prozentwert, der neue Preis ist der Grundwert minus Rabatt.",
    "method": "Grundwert finden. Prozentsatz durch 100 teilen. Beides multiplizieren. Bei Preisnachlass den Rabatt abziehen."
  },
  "dreisatz": {
    "meaning": "Der Dreisatz hilft, wenn Mengen in einem festen Verhältnis zueinanderstehen. Beispielsweise kostet ein Heft 2 Euro, also kosten fünf Hefte 10 Euro.",
    "reason": "Bei proportionalen Zusammenhängen verändert sich der Preis mit der Anzahl im selben Faktor. Verdoppelst du die Menge, verdoppelt sich der Preis – sofern der Stückpreis gleich bleibt.",
    "method": "Prüfe, ob der Zusammenhang proportional ist. Rechne auf eine Einheit zurück. Rechne von dort auf die gesuchte Menge."
  },
  "gleichung": {
    "meaning": "Eine Gleichung ist wie eine Waage mit zwei gleich schweren Seiten. x steht für eine unbekannte Zahl. Du willst herausfinden, welche Zahl die Waage im Gleichgewicht hält.",
    "reason": "Wenn du links 3 abziehst, musst du auch rechts 3 abziehen. So bleibt die Gleichheit erhalten. Durch schrittweise Umformungen stellst du x allein.",
    "method": "Stelle die Gleichung auf. Wende auf beide Seiten dieselbe erlaubte Operation an. Prüfe die gefundene Zahl in der Ausgangsgleichung."
  },
  "terme": {
    "meaning": "Ein Term ist ein Rechenausdruck mit Zahlen und Buchstaben. 3x meint drei gleiche x-Anteile. 3x + 2x sind also 5x.",
    "reason": "Nur gleichartige Terme darfst du addieren. 3 Äpfel und 2 Äpfel sind 5 Äpfel, aber 3 Äpfel plus 2 Birnen sind nicht 5 Äpfel. Genauso bleiben 3x + 2 verschieden.",
    "method": "Markiere Terme mit derselben Variablen und Potenz. Fasse ihre Zahlenfaktoren zusammen. Zahlen ohne Variable rechnest du getrennt."
  },
  "einheiten": {
    "meaning": "Eine Größe besteht aus einer Zahl und einer Einheit. Eine Länge von 2 m bedeutet dasselbe wie 200 cm: Die Zahl ändert sich, die Strecke nicht.",
    "reason": "Ein Meter enthält 100 Zentimeter, daher wird beim Wechsel in die kleinere Einheit die Zahl größer. Bei Flächen und Rauminhalten gelten andere Umrechnungsfaktoren.",
    "method": "Schreibe die Ausgangseinheit auf. Finde den Umrechnungsfaktor. Multipliziere oder dividiere und schreibe die neue Einheit dazu."
  },
  "umfang": {
    "meaning": "Umfang ist die Länge einer Linie, die einmal um eine Figur herumführt. Du brauchst den Umfang zum Beispiel für einen Zaun.",
    "reason": "Beim Rechteck liegen zwei gleiche Längen und zwei gleiche Breiten am Rand. Deshalb ist U = 2 × (Länge + Breite). Umfang wird in Längeneinheiten gemessen.",
    "method": "Erkenne alle Randseiten. Addiere ihre Längen. Gib eine Einheit wie cm oder m an."
  },
  "flaeche": {
    "meaning": "Flächeninhalt beschreibt, wie viel Platz eine ebene Figur bedeckt. Ein Quadrat mit 1 cm Seitenlänge hat 1 cm².",
    "reason": "Ein Rechteck kann aus gleich großen Quadratkästchen bestehen. Bei 4 Kästchen pro Reihe und 3 Reihen sind es 4 × 3 = 12 Kästchen. Darum gilt Länge mal Breite.",
    "method": "Zeichne oder denke dir Einheitsquadrate. Multipliziere Länge mal Breite. Gib Quadrateinheiten an."
  },
  "volumen": {
    "meaning": "Volumen ist der Raum, den ein Körper einnimmt. Denk an eine Schachtel, in die kleine Würfel passen.",
    "reason": "Ein Quader besteht aus Schichten gleich großer Würfel: Länge × Breite gibt die Würfel je Schicht, mal Höhe gibt alle Schichten zusammen. Die Einheit ist zum Beispiel cm³.",
    "method": "Messe Länge, Breite und Höhe in derselben Einheit. Multipliziere die drei Werte. Notiere die kubische Einheit."
  },
  "winkel": {
    "meaning": "Ein Winkel entsteht, wenn zwei Strahlen denselben Anfangspunkt haben. Er beschreibt ihre Öffnung, nicht ihre Länge.",
    "reason": "Ein rechter Winkel beträgt 90°. Bei einem Dreieck ergeben alle Innenwinkel zusammen 180°. Fehlende Winkel kannst du daher durch Subtraktion finden.",
    "method": "Erkenne Scheitelpunkt und Schenkel. Bestimme den Winkeltyp. Beim Dreieck rechne 180° minus die bekannten Winkel."
  },
  "durchschnitt": {
    "meaning": "Der Durchschnitt oder arithmetische Mittelwert verteilt eine Gesamtsumme gedanklich gleichmäßig auf alle Werte.",
    "reason": "Wenn die Werte 2, 4 und 9 ergeben, ist ihre Summe 15. Gleichmäßig auf drei Werte verteilt sind das 5. Der Durchschnitt muss kein ursprünglich vorkommender Wert sein.",
    "method": "Addiere alle Werte. Zähle, wie viele Werte vorhanden sind. Teile die Summe durch diese Anzahl."
  },
  "wahrscheinlichkeit": {
    "meaning": "Wahrscheinlichkeit misst die Chance, dass bei einem Zufallsexperiment ein bestimmtes Ereignis eintritt. Eine faire Münze hat zwei gleich wahrscheinliche Seiten.",
    "reason": "Bei gleich wahrscheinlichen Ergebnissen gilt: günstige Ergebnisse durch alle möglichen Ergebnisse. Eine faire Sechs hat bei einem Würfel Wahrscheinlichkeit 1/6.",
    "method": "Schreibe alle möglichen Ergebnisse auf. Zähle die günstigen. Bilde den Bruch günstige durch mögliche und kürze."
  },
  "schriftlich": {
    "meaning": "Schriftliche Rechenverfahren ordnen große Zahlen nach ihren Stellenwerten. Einer gehören unter Einer, Zehner unter Zehner.",
    "reason": "Ein Übertrag ist keine Zusatzregel ohne Grund: Zehn Einer ergeben einen Zehner. Beim schriftlichen Rechnen hältst du diese Umwandlung sichtbar fest.",
    "method": "Schreibe Stellenwert unter Stellenwert. Rechne von der passenden Seite aus. Beachte Überträge und prüfe das Ergebnis überschlägig."
  },
  "teiler": {
    "meaning": "Ein Teiler einer Zahl passt ohne Rest in sie hinein. Primzahlen besitzen genau zwei positive Teiler: 1 und sich selbst.",
    "reason": "Vielfache entstehen dagegen durch Malnehmen. Das kleinste gemeinsame Vielfache hilft beim Hauptnenner, der größte gemeinsame Teiler beim vollständigen Kürzen.",
    "method": "Suche Teiler durch systematisches Probieren. Schreibe Vielfache der beiden Zahlen auf. Unterscheide ggT von kgV."
  },
  "gemischt": {
    "meaning": "Eine gemischte Zahl besteht aus einer ganzen Zahl und einem echten Bruch: 2 1/3 sind zwei Ganze und ein weiteres Drittel.",
    "reason": "Ein Ganzes enthält drei Drittel. Zwei Ganze sind deshalb sechs Drittel; mit einem Drittel zusammen ergibt das 7/3.",
    "method": "Multipliziere ganze Zahl mal Nenner. Addiere den Zähler. Schreibe alles über denselben Nenner; rückwärts teile mit Rest."
  },
  "anteile": {
    "meaning": "Ein Bruchteil einer Menge sagt dir, wie viele Gegenstände zu einem Anteil gehören. 3/4 von 20 sind 15.",
    "reason": "Du teilst zuerst die gesamte Menge in vier gleich große Gruppen und nimmst dann drei davon. So entsteht die Regel Menge : Nenner × Zähler.",
    "method": "Teile die Menge durch den Nenner. Multipliziere mit dem Zähler. Kontrolliere, ob der Anteil zur Gesamtmenge passt."
  },
  "bruchzahlengerade": {
    "meaning": "Auf dem Zahlenstrahl ist ein Bruch eine genaue Position zwischen oder jenseits ganzer Zahlen. 3/4 liegt zwischen 0 und 1.",
    "reason": "Die Strecke von 0 bis 1 wird in gleich große Teile zerlegt. Der Nenner bestimmt die Schrittgröße, der Zähler die Anzahl der Schritte.",
    "method": "Markiere 0 und 1. Teile die Strecke entsprechend dem Nenner. Gehe so viele Abschnitte, wie der Zähler angibt."
  },
  "runden": {
    "meaning": "Runden ersetzt eine Zahl durch eine nahe Zahl mit weniger Stellen. So kannst du Messwerte vereinfachen und überschlagen.",
    "reason": "Du schaust die Stelle rechts neben der letzten behaltenen Stelle an. Ist sie 0 bis 4, bleibt die Stelle; bei 5 bis 9 wird aufgerundet.",
    "method": "Bestimme die gewünschte Stelle. Schau die Ziffer direkt rechts davon an. Runde und streiche die übrigen Stellen."
  },
  "periodisch": {
    "meaning": "Manche Divisionen enden nicht als Dezimalzahl. 1/3 ergibt 0,333...; dieselbe Ziffer wiederholt sich unendlich.",
    "reason": "Bei schriftlicher Division treten Reste irgendwann erneut auf. Wenn derselbe Rest wiederkommt, wiederholt sich ab dort auch die Ziffernfolge.",
    "method": "Teile Zähler durch Nenner. Beobachte die entstehenden Reste. Markiere die wiederkehrende Ziffernfolge als Periode."
  },
  "negativplus": {
    "meaning": "Negative Zahlen addieren oder subtrahieren ist wie ein Weg auf dem Zahlenstrahl. Von −2 aus drei Schritte nach rechts führt zu +1.",
    "reason": "Eine positive Zahl verschiebt nach rechts, eine negative nach links. Das Subtrahieren einer negativen Zahl ist eine Verschiebung nach rechts.",
    "method": "Beginne an der ersten Zahl. Achte auf das Rechenzeichen und Vorzeichen. Gehe die richtige Anzahl Schritte in die richtige Richtung."
  },
  "grundwert": {
    "meaning": "Der Grundwert ist die gesamte Menge, also 100 %. Wenn 20 % davon 8 Euro sind, suchst du die ursprünglichen 100 %.",
    "reason": "20 % sind ein Fünftel. Wenn ein Fünftel 8 Euro sind, muss das Ganze fünfmal so groß sein: 40 Euro.",
    "method": "Schreibe den Prozentwert und Prozentsatz auf. Rechne Grundwert = Prozentwert : Prozentsatz als Dezimalzahl. Prüfe rückwärts."
  },
  "prozentsatz": {
    "meaning": "Der Prozentsatz sagt, welcher Anteil des Grundwertes gemeint ist. Wenn 12 von 60 Kindern ein bestimmtes Hobby haben, ist der Anteil 12/60.",
    "reason": "Teilst du Anteil durch Grundwert, erhältst du den Dezimalanteil. Mal 100 zeigt, wie viele von hundert das wären: 20 %.",
    "method": "Teile Prozentwert durch Grundwert. Multipliziere mit 100. Setze das Prozentzeichen an das Ergebnis."
  },
  "zins": {
    "meaning": "Zinsen sind Geldbeträge, die sich aus einem Grundbetrag und einem Zinssatz über eine vereinbarte Zeit ergeben.",
    "reason": "Bei einfacher Jahresverzinsung berechnest du zuerst den Anteil des Kapitals in Prozent. Für andere Zeiträume brauchst du einen passenden Zeitanteil.",
    "method": "Wähle Kapital, Zinssatz und Zeitraum. Rechne erst den Jahreszins. Passe ihn nur bei der vereinbarten einfachen Verzinsung an die Zeit an."
  },
  "proportional": {
    "meaning": "Bei einer proportionalen Zuordnung steigen oder fallen zwei Größen im gleichen Verhältnis. Doppelt so viele Hefte kosten doppelt so viel, wenn der Einzelpreis gleich bleibt.",
    "reason": "Der Quotient Preis : Menge bleibt konstant. Diese feste Zahl heißt Proportionalitätsfaktor.",
    "method": "Erstelle eine Wertetabelle. Teile jeweils zugehörige Werte. Sind die Quotienten gleich, ist der Zusammenhang proportional."
  },
  "antiproportional": {
    "meaning": "Bei antiproportionalen Zuordnungen wird die eine Größe kleiner, wenn die andere entsprechend größer wird. Mehr gleich schnelle Helfer können dieselbe Arbeit schneller erledigen.",
    "reason": "Hier bleibt das Produkt beider Größen konstant. Verdoppelt sich eine Größe, halbiert sich die andere – aber nur unter passenden Bedingungen.",
    "method": "Prüfe, ob dieselbe Gesamtarbeit verteilt wird. Multipliziere die Wertepaare. Sind die Produkte gleich, liegt Antiproportionalität vor."
  },
  "verhaeltnisse": {
    "meaning": "Ein Verhältnis vergleicht zwei Mengen. Bei 2 : 3 kommen auf zwei Teile der ersten Menge drei der zweiten.",
    "reason": "Ein Maßstab 1 : 100 bedeutet, dass eine Länge auf der Zeichnung hundertmal kleiner als in Wirklichkeit ist. Die Einheit muss vorher übereinstimmen.",
    "method": "Bringe beide Größen auf gleiche Einheiten. Schreibe das Verhältnis. Kürze beide Seiten mit demselben Faktor."
  },
  "klammern": {
    "meaning": "Eine Klammer fasst mehrere Teile eines Terms zusammen. Eine Zahl vor der Klammer multipliziert jeden Summanden darin.",
    "reason": "2 × (x + 3) meint zwei Gruppen aus x plus 3. Das ergibt 2x + 6, weil beide Gruppen jeweils ein x und drei enthalten.",
    "method": "Multipliziere den Faktor mit jedem Term der Klammer. Beachte Vorzeichen. Fasse anschließend gleichartige Teile zusammen."
  },
  "gleichungsklammern": {
    "meaning": "Bei Gleichungen mit Klammern musst du zuerst die Klammern richtig auflösen, bevor du die Unbekannte isolierst.",
    "reason": "Die Waage bleibt nur im Gleichgewicht, wenn du dieselbe Umformung auf beiden Seiten ausführst. Eine Klammer ersetzt mehrere Summanden und darf nicht halb aufgelöst werden.",
    "method": "Multipliziere jeden Term aus der Klammer. Fasse Terme zusammen. Bringe alle x-Terme auf eine Seite und rechne Probe."
  },
  "koordinaten": {
    "meaning": "Ein Koordinatensystem zeigt Punkte mit zwei Zahlen. Die erste Zahl gibt die waagerechte Position an, die zweite die senkrechte.",
    "reason": "Die Achsen heißen x und y. Bei (3|2) gehst du vom Ursprung drei nach rechts und zwei nach oben. Die Reihenfolge darfst du nicht vertauschen.",
    "method": "Suche den Ursprung (0|0). Gehe die x-Schritte waagerecht. Gehe die y-Schritte senkrecht. Markiere den Schnittpunkt."
  },
  "graphen": {
    "meaning": "Ein Graph macht Zusammenhänge sichtbar. In einer Wertetabelle stehen zusammengehörige Zahlenpaare; als Punkte erkennst du Veränderungen.",
    "reason": "Steigt der Preis immer um denselben Betrag pro Stück, liegen die Punkte auf einer Geraden. Der Graph zeigt dir auch Werte zwischen den Tabellenpunkten.",
    "method": "Beschrifte die Achsen und Einheiten. Zeichne die Punkte aus der Tabelle. Verbinde sie nur, wenn Zwischenwerte sinnvoll sind."
  },
  "linien": {
    "meaning": "Eine lineare Funktion beschreibt eine konstante Änderung. In y = 2x + 1 wächst y jedes Mal um 2, wenn x um 1 zunimmt.",
    "reason": "Die Zahl vor x heißt Steigung. Die allein stehende Zahl zeigt, wo die Gerade die y-Achse schneidet. So kannst du Veränderung und Startwert getrennt lesen.",
    "method": "Setze x-Werte ein. Berechne passende y-Werte. Zeichne mindestens zwei Punkte und die Gerade."
  },
  "symmetrie": {
    "meaning": "Eine Figur ist achsensymmetrisch, wenn sie durch Spiegeln an einer bestimmten Geraden auf sich selbst fällt.",
    "reason": "Jeder Punkt und sein Spiegelbild haben denselben Abstand von der Symmetrieachse, liegen aber auf gegenüberliegenden Seiten.",
    "method": "Zeichne die Achse. Messe den Abstand eines Punktes zur Achse. Übertrage denselben Abstand auf die andere Seite."
  },
  "dreiecksflaeche": {
    "meaning": "Die Fläche eines Dreiecks kannst du aus der Fläche eines Rechtecks oder Parallelogramms ableiten. Zwei passende Dreiecke ergänzen sich zu einer ganzen Fläche.",
    "reason": "Darum ist die Dreiecksfläche die Hälfte von Grundseite mal zugehöriger Höhe: A = g × h : 2. Die Höhe steht senkrecht auf der Grundseite.",
    "method": "Bestimme Grundseite und senkrechte Höhe. Multipliziere beide. Teile durch 2 und gib cm² oder m² an."
  },
  "oberflaeche": {
    "meaning": "Die Oberfläche eines Körpers ist die Fläche aller seiner äußeren Seiten zusammen. Beim Quader gehören sechs Rechtecke dazu.",
    "reason": "Gegenüberliegende Seiten haben dieselbe Größe. Deshalb kannst du je zwei Flächen von Länge × Breite, Länge × Höhe und Breite × Höhe addieren.",
    "method": "Berechne die drei verschiedenen Rechteckflächen. Verdopple jede davon. Addiere die sechs Seitenflächen."
  },
  "diagramme": {
    "meaning": "Ein Diagramm übersetzt Zahlen in eine anschauliche Darstellung. Säulen zeigen Häufigkeiten, Linien Veränderungen und Kreisstücke Anteile eines Ganzen.",
    "reason": "Eine falsch beschriftete Achse kann täuschen. Prüfe deshalb Startpunkt, Einheit und Skala, bevor du Schlussfolgerungen ziehst.",
    "method": "Lies Titel und Achsen. Prüfe die Skalierung. Vergleiche die Werte und formuliere, was das Diagramm tatsächlich zeigt."
  },
  "median": {
    "meaning": "Der Median ist die mittlere Zahl einer sortierten Liste. Er ist besonders nützlich, wenn einzelne sehr große oder kleine Werte den Durchschnitt verzerren.",
    "reason": "Bei ungerader Anzahl nimmst du den mittleren Wert, bei gerader Anzahl den Mittelwert der zwei mittleren. Die Spannweite ist größter minus kleinster Wert.",
    "method": "Sortiere alle Werte. Bestimme den oder die mittleren. Ziehe für die Spannweite den kleinsten vom größten ab."
  },
  "haeufigkeiten": {
    "meaning": "Die absolute Häufigkeit zählt, wie oft ein Wert vorkommt. Die relative Häufigkeit zeigt, welchen Anteil das an allen Beobachtungen hat.",
    "reason": "Wenn 6 von 24 Personen etwas wählen, ist die relative Häufigkeit 6/24 = 1/4 = 25 %. So lassen sich Gruppen unterschiedlicher Größe vergleichen.",
    "method": "Zähle die Vorkommen. Teile durch die Anzahl aller Beobachtungen. Wandle den Anteil bei Bedarf in Prozent um."
  },
  "textaufgaben": {
    "meaning": "Eine Textaufgabe versteckt eine Rechnung in einer Geschichte. Das wichtigste Können ist zuerst das Verstehen, nicht das schnelle Rechnen.",
    "reason": "Markiere die bekannten Zahlen und ihre Einheiten. Formuliere die Frage in eigenen Worten und wähle erst dann einen passenden Rechenweg.",
    "method": "Lies den Text vollständig. Notiere gegeben und gesucht. Stelle eine Rechnung auf, löse sie und prüfe das Ergebnis am Alltag."
  }
};
 const FORMS={
  meaning:"Was ist das?",
  reason:"Warum funktioniert das?",
  method:"Wie gehe ich vor?"
 };
 function get(lesson){
  const entry=THEORY[lesson.id];
  if(!entry)throw Error("Unterricht fehlt: "+lesson.id);
  const terms=Object.entries(FORMS).map(([key,label])=>({label,text:entry[key]}));
  return {id:lesson.id,title:lesson.title,terms,world:WORLDS[lesson.group],
   goals:[lesson.brief,lesson.rule],
   practice:lesson.questions.slice(0,3).map((q,i)=>({
    title:"Gemeinsam rechnen "+(i+1),question:q.question,
    steps:[q.hint,q.solution],answer:String(q.answer)
   }))
  };
 }
 global.MATHE_TUTORIALS={WORLDS,THEORY,get};
})(window);
