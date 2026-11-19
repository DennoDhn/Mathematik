# MATHE HERO – Mathe endlich verstehen

Eine kostenlose, werbefreie, installierbare **Mathe-Lern-PWA** für Kinder und Jugendliche, mit Schwerpunkt Klassen **6 und 7**. GitHub Pages reicht für den Betrieb aus – keine Anmeldung, keine App-Käufe, kein Server, keine Werbe- oder Analyseanbieter.

**Seite (GitHub Pages):** https://dennodhn.github.io/Mathematik/  
**Repository:** https://github.com/DennoDhn/Mathematik

## Update 0.6 – Premium-Lernzentrale und zuverlässiger üben

- Neue visuelle Startseite mit animierungsarmen Mathematik-Motiven und individuell gestalteten Themenkarten in Midnight und Paperlight.
- Angefangene Übungsrunde bleibt beim Navigieren lokal gespeichert. Die Startseite bietet direkt „Letzte Übung fortsetzen“.
- Lernempfehlungen und Wiederholung berücksichtigen auch spätere unsichere Ergebnisse.
- „Ich verstehe das nicht“ erklärt wichtige Themen mit alternativen Alltagsbeispielen.
- Nur **richtige Antworten im ersten Versuch ohne Tipps** zählen für die selbstständige Erfolgsquote; Lösungen mit Hilfe bleiben weiterhin ein Lernerfolg und können ohne Bestrafung weitergeübt werden.
- Testfälle für Fortsetzen, Entwürfe, Darstellung und Antworten mit Tipps wurden ergänzt.
- Service-Worker-Cache wurde für neue Ressourcen aktualisiert.

**Geprüft anhand des Repository-Codes:** 56 Lektionen, 170 feste und 5.275 stichprobenartig generierte korrekte Erwartungsantworten (25 Aufgabensätze pro Lektion), sechsmal Spezialfälle sowie eine simulierte Bedienungsfolge. Nicht bestätigt: visuelle Screenshots, reale Geräteinstallation, Safari/iPadOS und produktive Offline-Nutzung. Details in [QA-STATUS-2026-11-19.md](docs/QA-STATUS-2026-11-19.md).

## Neu: Theorieunterricht vor jeder Übung

Matheunterricht wie in der Schule: **erst verstehen, dann gemeinsam rechnen, anschließend selbstständig Aufgaben lösen**.

Jede der **56 Lektionen** besitzt jetzt einen eigenen Unterricht mit vier aufeinander aufbauenden Phasen:

1. **Was ist das?** Fachbegriffe und Alltagsnutzen verstehen.
2. **Warum funktioniert das?** Rechenidee, ausführliche Erklärung, vorgerechnetes Lehrerbeispiel und gegebenenfalls interaktives Lernlabor.
3. **Gemeinsam rechnen:** Drei Aufgaben schrittweise lösen – erst nachdenken, dann einen Hinweis aufdecken, danach die Lösung betrachten. Ohne Noten und Zeitdruck.
4. **Danach selbst üben:** Kompakter Lernzettel und eigenständige Aufgaben. Der Unterricht ist jederzeit wiederholbar.

Zusätzlich beginnen alle neun Lernwelten mit einer ausführlichen Einführung und Lernübersicht. Alle Theorieinhalte liegen im unabhängigen, offlinefähigen Modul `tutorials.js`. Abgeschlossene Unterrichtsteile werden pro Schülerprofil lokal gespeichert; der bisherige Fortschritt und die bestehenden Übungen bleiben erhalten.

## Was heute enthalten ist

- **56 Lektionen**, neun Themenwelten, **170 feste Übungsaufgaben** mit Hinweisen und Musterlösungen.
- Reproduzierbar generierte Aufgabenvarianten unter anderem für Bruchrechnung, negative Zahlen, Prozent, Dreisatz, Gleichungen, Dezimalrechnung, Umfang und Fläche.
- Schriftliche Theorie: Bedeutung, Anwendung, einzelne Rechenschritte, Beispiel, Merksatz, typische Stolperfalle.
- **Sechs interaktive Mitmach-Labore** für Bruchbalken, Dezimal-Hunderterfelder, negative Zahlen, Prozente, Figuren und Gleichungswaage.
- Nachvollziehbare mathematische Auswertung mit exakten rationalen Zahlen, einschließlich gleichwertiger Brüche, geforderter Kürzung und deutscher Dezimalkommas.
- Diagnosen für einige typische Fehler (Bruchaddition, nur einseitiges Kürzen/Erweitern, Faktor-10-Kommafehler, Vorzeichen), mehrstufige Hinweise und vollständige Lösungen.
- Einstufung nach Klasse, Voraussetzungen für Lernempfehlungen, Wiederholungsplanung und lokale Fortschrittsanzeige.
- Mehrere Kinderprofile pro Gerät, Spitzname/Klasse, Kurz-Erklärmodus, **Lernrunden mit ungefähr 5/10/15 Minuten Umfang – ohne Zeitlimit**.
- Hochwertiges, responsives Academy-Design mit Midnight- und Paperlight-Modus; Fokus- und Tastaturbedienung.
- Laufende Aufgaben und Eingaben werden lokal zwischengespeichert, sodass ein Neuladen die aktuelle Übung fortsetzen kann.
- Profil-/Fortschritts-Export und Import, einschließlich Migration früherer v1-Sicherungsdateien.

## Bedienung

1. Webseite öffnen, Spitznamen eingeben und Klasse wählen.
2. Passendes Thema öffnen. Empfehlung und alle anderen Themen sind jederzeit anwählbar.
3. Theorie lesen, interaktives Labor verändern, dann Übungen lösen.
4. Bei Schwierigkeiten **Tipp anzeigen**, **Ich verstehe das nicht** oder **Lösung zeigen**; falsche Antworten kosten keine Punkte.
5. In Einstellungen den Lernmodus, das Theme und ggf. Geschwisterprofil wählen; Lernstand regelmäßig sichern.

## Als PWA installieren / Offline

Die Seite muss **einmal mit Internetverbindung vollständig laden**, damit der Service Worker die Dateien vorhalten kann. Anschließend lassen sich die bereits mitgelieferten Lektionen offline nutzen.

- **iPhone/iPad:** Webseite in Safari öffnen → Teilen → Zum Home-Bildschirm.
- **Android/Chrome:** Browsermenü → App installieren / Zum Startbildschirm.
- **Desktop:** Je nach Browser über das Installationssymbol.

Manifest enthält SVG und dedizierte PNG-Icons in 192/512 px sowie Apple-Touch-Icon. Der Service Worker lädt bei Verbindung die aktuellen Dateien und nutzt bei Offline-Fehlern den lokalen Cache. **Wichtig:** Installations- und Offline-Funktion auf echten Geräten ist weiterhin separat zu testen; es wird hier kein bereits bestandenes Gerätetest-Ergebnis behauptet.

## Datenschutz

Spitzname, Klasse, Lernstand und Sitzungsfortschritt bleiben in **localStorage auf diesem Gerät**. Ohne Login und ohne Tracking. Es gibt keine automatische Synchronisierung. Browser-Datenlöschung oder Betriebssystem-Speicherbereinigung kann lokalen Fortschritt entfernen – unter Einstellungen eine Sicherung herunterladen.

## Technische Architektur

Vollständige statische Anwendung (HTML, CSS, JavaScript, SVG) ohne fremde Laufzeitbibliotheken. Bereitstellung über **GitHub Pages**, Branch \`main\`, Verzeichnis \`/(root)\`.

| Datei | Aufgabe |
| --- | --- |
| \`index.html\`, \`styles.css\` | PWA-Einstieg und responsives Academy-Design |
| \`app.js\` | Oberfläche, lokale Profile, Übungsrunden, Wiederholung und Fortschritt |
| \`lessons.js\` | Erstes Paket mit 30 Lektionen |
| \`additional-lessons.js\` | Erweiterungspaket mit 26 weiteren Lektionen |
| \`tutorials.js\` | Schulischer Theorieunterricht für alle 56 Lektionen und neun Themenwelten |
| \`math-engine.js\` | Exakte Arithmetik, Aufgabenvarianten, Diagnose |
| \`curriculum.js\` | Klassenstufen und Lernvoraussetzungen |
| \`visuals.js\` | Offline-SVG-Lernlabore |
| \`sw.js\`, \`manifest.webmanifest\`, \`icons/\` | Offline-Cache, Installation, Icons |
| \`tests/\` | Inhalt, Generatoren, Bewertungsfälle, Profilsystem und Übungsabläufe |
| \`docs/\` | Audit, Roadmap und Release-Status |

### Lokal testen

Ein statischer Webserver genügt:

    python3 -m http.server 8000

Dann **http://localhost:8000/** aufrufen. JavaScript-Checks:

    node --check app.js
    node --check math-engine.js
    node --check visuals.js
    node tests/smoke.cjs
    node tests/validation.cjs
    node tests/app-flows.cjs

GitHub Actions führt diese Prüfungen beim Push auf \`main\` aus. Die Tests prüfen viele Rechen- und Integrationsfälle, ersetzen aber **keine** echten iOS-/Android-, Safari-/WebKit- und visuellen Barrierefreiheitsprüfungen.

## Ausbau

Ein neues Thema kann in einem eigenen Paket ergänzt werden: gleiches Lektionenschema (ID, Fach/Thema, Theorie, Schritte, Beispiele, Fehlerhinweis, Aufgaben mit Lösungen) plus Curriculums-Zuordnung. Das Mathematikmodul ist bewusst von Aufgaben-Engine und Visualisierungen getrennt, sodass Deutsch, Englisch und weitere Fächer später ohne grundlegenden Umbau ergänzt werden können.

Weitere geplante Verbesserungen und bekannte Einschränkungen stehen unter **docs/AUDIT-UND-REDESIGN.md**.

**Status:** Substanziell erweiterter, technisch geprüfter Entwicklungsstand, **nicht** als vollständig schulformspezifisch, geräteübergreifend oder abschließend browsergetestet freigegeben.
