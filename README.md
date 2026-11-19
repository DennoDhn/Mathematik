# MATHE HERO – Mathe verstehen

Kostenlose, werbefreie und offlinefähige Lernhilfe für Mathematik in Klasse 6 und 7. Diese erste Version ist ein direkt nutzbarer Startstand, kein vollständiger Ersatz für den Schulunterricht.

**Website:** https://dennodhn.github.io/Mathematik/

## Enthalten

- Einrichtung mit Name/Spitzname, Klasse und kurzer Erklärungsansicht
- 30 verständliche Lektionen in acht Themenwelten
- 92 Aufgaben mit individuellen Hinweisen und erklärten Lösungen
- Bruchrechnung: kürzen, erweitern, gemeinsamer Nenner und Grundrechenarten
- Dezimalzahlen, negative Zahlen, Prozent, Dreisatz, Terme und Gleichungen
- Einheiten, Umfang, Fläche, Volumen, Winkel, Mittelwert, Wahrscheinlichkeit
- Lernfortschritt, Wiederholen, Lernstand exportieren und importieren
- PWA-Installation und Offline-Nutzung nach dem ersten vollständigen Laden

## Starten

Öffne die Website, gib einen Namen ein und wähle eine Klasse. Wähle eine Lernwelt, lies die Erklärung und löse die Aufgaben.

**Offline:** Besuche die Seite zunächst mit Internetverbindung, bis die Dateien geladen und der Service Worker installiert ist. Danach funktioniert die Kern-App auch ohne Internet. Auf iPhone/iPad: Teilen → Zum Home-Bildschirm. Auf unterstützten anderen Browsern: Installieren.

**Datenschutz:** Profil und Lernstand bleiben ausschließlich im lokalen Browser-Speicher. Keine Registrierung, Werbung, Tracker, Cloud oder geräteübergreifende Synchronisierung. Browserdaten-Löschung kann den Fortschritt entfernen; nutze die Export-Funktion in den Einstellungen.

## GitHub Pages

Repo: DennoDhn/Mathematik. Unter Settings → Pages: Deploy from a branch, main, /(root). Keine Build-Schritte und keine zusätzlichen Server.

## Architektur

- index.html – Einstieg und Meta-Tags
- styles.css – responsives Layout
- lessons.js – Unterrichtsinhalte und Aufgaben
- app.js – Navigation, Übungen, lokale Profile und Fortschritt
- manifest.webmanifest – PWA
- sw.js – Offline-Cache
- icon.svg – App-Icon
- tests/smoke.cjs – Grundprüfung der Unterrichtsdaten
- .github/workflows/verify.yml – automatisierte Checks

Neue Lektionen können in lessons.js als Datenobjekte ergänzt werden. Jede benötigt eine eindeutige ID, eine Themenwelt, Theorie, Rechenschritte, Beispiel, Regel, Stolperfalle und erklärbare Aufgaben. Für weitere Schulfächer ist eine spätere Aufteilung in eigenständige Fachmodule vorgesehen.

Entwicklungscheck:

    node --check app.js
    node --check lessons.js
    node --check sw.js
    node tests/smoke.cjs

## Nächste Schritte

- Weitere Aufgabenvarianten und interaktive Bruchbalken und Zahlenstrahlen
- Vertiefung aller Themen für Klasse 6/7 nach Bundesland und Schulform
- Browser-, Offline- und Installationstests auf echten iOS-, Android- und Desktop-Geräten
- Langfristig separate Fachmodule für Deutsch, Englisch und mehr

Die App markiert eine Lektion als gelernt, wenn mindestens 75 % der Aufgaben in einer Übungsrunde im ersten Versuch richtig beantwortet wurden. Das ist nur eine Lernorientierung und keine Schulnote.

**Status:** Erste nutzbare Version. Live-Pages-Status, Installation und echter Offlinebetrieb sind noch separat im Browser zu verifizieren.
