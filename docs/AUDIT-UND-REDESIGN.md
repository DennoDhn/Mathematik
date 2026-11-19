# MATHE HERO – Code-Audit, Fehlerliste und Premium-Redesign

Stand: 19. November 2026  
Geprüfter Stand: \`main\`, Dateien \`index.html\`, \`app.js\`, \`lessons.js\`, \`styles.css\`, \`sw.js\`, \`manifest.webmanifest\`, README, Smoke-Test und GitHub-Actions-Workflow.

> **Prüfgrenze:** Der Repository-Quellcode wurde untersucht; JavaScript und strukturierte Unterrichtsdaten wurden bereits mit einfachen Tests geprüft. Ein erfolgreicher Live-Abruf von GitHub Pages, visuelle Screenshots, vollständige Browser-End-to-End-Tests, Offline-Installations- und echte iOS-/Android-Gerätetests sind nicht bestätigt. Die folgenden Punkte trennen deshalb bestätigte Codeprobleme von Risiken und Qualitätszielen.

## Aktueller Bestand

- 30 Mathematiklektionen in acht Themenwelten.
- 92 fest definierte Aufgaben mit Hinweisen und Lösungserklärungen.
- Name/Spitzname, Klassenauswahl und Schalter für kurze Erklärungen.
- Statisches Hosting über GitHub Pages, Manifest, Service Worker und Cache-Liste.
- Lokaler Fortschritt mit Export/Import; keine Anmeldung, Werbung oder Cloud.
- Grundlegender Syntax-, Datenvollständigkeits- und PWA-Dateitest, noch keine umfassenden funktionalen und fachlichen Tests.

## P0: Nachgewiesene Fehler und funktionale Schwächen – zuerst beheben

- [ ] **A01 – Mathematisch gleichwertige Brüche teils fälschlich abgewiesen.** In \`app.js\` prüft \`equivalent()\` bei erwarteten Bruchantworten die **Schreibweise**. Beispiel: Bei „Eine Hälfte als Bruch?“ wird \`1/2\` akzeptiert, \`2/4\` aber abgelehnt, obwohl mathematisch gleichwertig; ebenso bei einer Wahrscheinlichkeit ohne verlangtes Kürzen. **Fix:** Exakte rationale Arithmetik (ggT-gekürzte Integerpaare), konfigurierbare Antwortregel \`equivalentFraction\` vs. \`requireSimplified\` vs. \`requireExpanded\` vs. \`requireDecimal\`. **Abnahme:** Gleichwertige Brüche werden zugelassen, wenn das Aufgabenformat das gestattet; bei „vollständig kürzen“ wird die Normalform eingefordert.
- [ ] **A02 – Aktuelle Eingabe kann bei Verbindungswechsel verschwinden.** \`window.addEventListener("online",render)\` und \`offline\` rufen ein vollständiges \`render()\` auf; die Antwort-Eingabe wird dabei neu erstellt. **Fix:** Verbindungssymbol getrennt aktualisieren, Formulareingaben und laufende Übung konservieren. **Abnahme:** Offline/Online-Wechsel mitten in einer Eingabe löscht keine Zeichen und verändert den Aufgabenstatus nicht.
- [ ] **A03 – Bei falscher Antwort wird die Eingabe ohne Übernahme neu gerendert.** Das vollständige Neu-Rendern erschwert das Korrigieren der eigenen Zahl. **Fix:** Eingabefeld und Auswahl erhalten, Fehlermeldung/Hinweise gezielt aktualisieren. **Abnahme:** Kind kann den eigenen Rechenfehler direkt im Eingabefeld verbessern.
- [ ] **A04 – Klassenwahl hat keine curriculare Wirkung.** Die App erlaubt Klassen 5 bis 8, zeigt aber für alle dieselben Lektionen. **Fix:** Lektionen mit Klassenstufe, Schwierigkeitsbereich und Voraussetzungen versehen; nur passende Empfehlungen, alle Grundlagen bewusst erreichbar. **Abnahme:** Klasse 6 und 7 erhalten unterschiedliche, nachvollziehbare Vorschläge.
- [ ] **A05 – Lernstatus bleibt nach einmaligem Bestehen dauerhaft „Gelernt“.** \`passed: old.passed || ...\` führt dazu, dass ein späterer schlechter Versuch nicht die Wiederholung anstößt. **Fix:** „bereits geschafft“ von „aktuell sicher“ trennen; Wiederholungsintervalle und Sicherheit aus mehreren unabhängigen Versuchen berechnen. **Abnahme:** Rückfälle führen zu gezielter Wiederholung ohne Verlust bereits erbrachter Erfolge.
- [ ] **A06 – Lernempfehlung folgt nur der Dateireihenfolge.** \`LESSONS.find(...!passed)\` verwendet keine Lernvoraussetzungen oder aktuellen Fehler. **Fix:** Voraussetzungen-Graph, gezielte Empfehlung und überspringbare Grundlagen. **Abnahme:** Kürzen wird nach Brüche verstehen, Dezimaldivision nicht vor Stellenwertverständnis empfohlen.

## P1: Pädagogische, inhaltliche und technische Verbesserungen

- [ ] **B01 – Aufgabenvarianten statt Auswendiglernen.** Heute haben alle 30 Lektionen jeweils 3–4 feste Aufgaben. Aufgaben mittels deterministischer Generatoren, kontrollierter Zahlenbereiche und reproduzierbaren Seeds erzeugen. Pro Thema verschiedene Beispiele und Aufgabentypen; Musterlösungen automatisch fachlich prüfen.
- [ ] **B02 – Visuelle Mathematik als echtes Lernwerkzeug.** Interaktive Bruchbalken/Pizzateile, Stellenwerttafel, verschiebbares Komma, Zahlenstrahl, Prozentbalken, Waage für Gleichungen, veränderbare Flächenfiguren. Alternativen für Tastatur- und Screenreader-Nutzung.
- [ ] **B03 – Fehlerdiagnose nach Regel statt nur „Fast“.** Typische Fehler erkennen (Zähler/Nenner vertauscht, nur oben gekürzt, Komma falsch gesetzt, Vorzeichenwechsel), zuerst kleinen Hinweis, dann nächsten Schritt, erst anschließend vollständige Lösung. Diagnose nur behaupten, wenn aus Antwort ableitbar.
- [ ] **B04 – Adaptive Lernformate.** Optional 3–5 / 10 / 15 Minuten; kurze Anleitung, Standard, ausführlicher Rechenweg, visuelle Hilfe. Kein medizinisches Label, kein Zeitdruck.
- [ ] **B05 – Unterrichtsstoff fachlich vervollständigen.** Einmal-Eins, schriftliches Rechnen, gemischte Zahlen, periodische Dezimalzahlen, Runden, Zinsrechnung, proportionale/antiproportionale Zuordnungen, Maßstab, Konstruktionen, Diagramme, relative Häufigkeiten, mehr Textaufgaben und Prüfungsaufgaben. Umfang nach Bundesland/Schulform kennzeichnen; aktuell sind 30 Lektionen ein Einstieg, nicht der vollständige Lehrplan.
- [ ] **B06 – Mathematische Prüfung ausbauen.** Tests für alle konkreten Fragen und Lösungen, Äquivalenzklassen, Grenzen, Null und Vorzeichen, Dezimalkomma, periodische Ergebnisse; einfache property-based Tests für generierte Aufgaben. Die jetzige CI prüft überwiegend Syntax/Datenfelder.
- [ ] **B07 – Lernrunden ohne Fortschrittsverlust.** Aktuelle Lektion, Aufgabenposition, nicht abgegebene Eingabe und Hilfestufe lokal zwischenspeichern; expliziter „Weitermachen“-Knopf. Browserdaten-Löschung bleibt möglich; Export/Import beibehalten.
- [ ] **B08 – Mehrere lokale Kinderprofile.** Separate Vornamen, Klassenstufen, Lernstände; Elternbereich ohne öffentliche Profile.
- [ ] **B09 – Wiederholungsplanung.** Wiederholung nach 1/3/7/14 Tagen als Ausgangspunkt, abhängig von sicherer Leistung und Hilfen. Gemischte neue Aufgaben statt derselben Antworten.
- [ ] **B10 – Verständliche Formeldarstellung.** Bruchstriche und Rechenschritte visuell statt nur \`1/2\` als Slashtext, aber korrekt zugänglich und bei schmalem Bildschirm nicht abgeschnitten.
- [ ] **B11 – Pädagogisches Inhaltsreview.** Texte auf missverständliche Formulierungen prüfen, z. B. der Abschnitt „2,5 + 0,35 ist nicht 2,85? Doch“ in der Dezimaladdition; stattdessen klare Positiv- und Fehlerbeispiele.
- [ ] **B12 – Für weitere Schulfächer modularisieren.** \`lessons.js\` (aktuell eine Datei mit allen Mathe-Inhalten) und \`app.js\` in Plattformkern, Fachmodul-Vertrag, Aufgabentypen, Bewertung, Content-Schema und Fortschritt getrennt aufteilen – ohne unnötiges Backend.

## P1: Technische Qualitätsabsicherung und PWA

- [ ] **T01 – Reale Pages-Verfügbarkeit prüfen:** Site-Aufruf, 404/404-Fallback, relative URLs, Installationsablauf.
- [ ] **T02 – Echte Offline-Tests:** Erstinstall, kompletter Cache, Flugmodus, Neustart nach Offline-Wechsel, alte/neue Version, Safe-Update bei unterbrochener Verbindung.
- [ ] **T03 – App-Icons als PNG ergänzen:** 192×192 und 512×512 (Maskable-Safe-Zone), separates Apple-Touch-Icon; bisher nur SVG \`any maskable\`. Verfügbarkeit/Look im iOS-Home-Screen verifizieren.
- [ ] **T04 – Cache-Versionierung automatisieren:** Bisher muss \`mathe-hero-shell-v2\` bei jeder Asset-Änderung manuell hochgezählt werden. Version/Hash im Build automatisieren, alte Daten-Caches und Nutzerdaten sauber trennen.
- [ ] **T05 – Testpyramide etablieren:** Echte UI-Tests mit Playwright inkl. Chromium/WebKit/Firefox, Installations-/Offline-Szenarien, Tastatur, Screenreader-Basics, Kontrast und Lighthouse CI. Nur tatsächlich ausgeführte Tests als bestanden melden.
- [ ] **T06 – Lokale Speicherung härten:** Auf Quota-Fehler hinweisen, Datenmigrationen versionieren, defekte Sicherungsdateien eindeutig abweisen, keine stille Nicht-Speicherung.
- [ ] **T07 – Bedienbarkeit verbessern:** Fokus nach Navigation korrekt setzen, sichtbaren Skip-Link für Tastatur, verlässliche Live-Ansagen, min. 44×44 Touchziele, Farbkontraste WCAG 2.2 AA, \`prefers-reduced-motion\`.
- [ ] **T08 – Sicherheit/Datenschutz:** Keine Tracker, kein unnötiges Fremd-CDN, sichere HTML-Escapes beibehalten, externe Dependencies nur nach Lizenz-/Sicherheitsprüfung.

## Premium-Redesign: MATHE HERO 2.0 – „Academy / Game Studio“

Ziel: Eigenständige, hochwertige Lern-App für 11–14-Jährige – **weder langweiliges Schulbuch noch Kleinkind-Design**. Visuelle Professionalität muss Lernen und Orientierung unterstützen.

### Designsystem (konkreter Entwurf, nicht bereits umgesetzt)

| Rolle | Vorschlag | Nutzung |
| --- | --- | --- |
| Nachtblau | \`#0B1020\` | dunkler, ruhiger App-Hintergrund |
| Surface | \`#151E33\` | Karten und Lektionsflächen |
| Electric Blue | \`#5AA9FF\` | Interaktionen, Mathe-Welt |
| Neon Mint | \`#B7F56C\` | Erfolg, positive Aktionen |
| Soft Violet | \`#A48BFF\` | Lernwelten und Details |
| Warm Coral | \`#FF9689\` | behutsame Fehlerhinweise |
| Warm White | \`#F6F8FF\` | Typografie und helle Variante |

Zwei vollwertige Themes: **Midnight** (dunkel) und **Paperlight** (hell). Typografie mit klarer Hierarchie, gut unterscheidbaren Ziffern und mathematischen Zeichen; möglichst systemnah und offline ohne externe Fonts. Motive als eigens erstellte, leichte SVG-Illustrationen oder CSS-Grafiken, keine zufälligen Stockbilder.

### Schlüsselbildschirme

1. **Start / persönliche Lernzentrale:** Begrüßung, Fortschrittsring, „Heutige Mission“ (5 oder 10 Minuten), „Da weitermachen“ und 2–3 relevante Themenkarten. Keine überfüllte Statistikseite.
2. **Lernwelten:** Große Cards mit eindeutiger Farbe, eigener Illustration und kurzem Zweck: Bruch-Labor, Komma-Station, Zahlen-Arena, Geometrie-Studio, Prozent-Shop. Große Touchflächen statt Tabellencharakter.
3. **Lektion / Visual-First:** Auf der ersten Bildschirmhöhe eine anschauliche Grafik und **eine** Erklärung; darunter geführte 3–5 Schritte, Merksatz, dann Übung. Optional vollständige schriftliche Theorie als aufklappbarer Abschnitt.
4. **Übungsmodus:** Eine Aufgabe pro Bildschirm. Große gut lesbare mathematische Darstellung, korrektes Bruch-/Dezimal-Eingabefeld, deutlicher Fokus, persistenter Tipp-Knopf. Rückmeldung räumlich stabil; kein Layoutspringen.
5. **Fortschritt:** Skill-Map und wiederholbare Missionen, ohne künstliche Strafmechaniken. Erfolgsanimationen dezent, abschaltbar und nie Voraussetzung.
6. **Onboarding & Installation:** Kleine, freundliche Einführung mit Spitzname, Klasse, Lernvorlieben; echte iOS-/Android-PWA-Anleitung und Hinweis, dass Daten lokal bleiben.

### Bewegungs- und Qualitätsregeln

- Microinteractions nur für Verständnis und Rückmeldung, z. B. ein Bruchbalken, der die gleiche Fläche in andere Teile zerlegt; kein Dauerblinken.
- Layout sauber mit 8-pt-Abstandssystem, 16–24 px Kartenradius, konsistenten Buttons, Schatten nur sparsam, Kontrast und Fokus sichtbar.
- Mobile First; iPhone-Einseiten-Übungen, Tablet-Zweispalten-Labor, Desktop mit Lernnavigation; kein horizontales Scrollen bei Formeln.
- Texte kurz, ein Schritt pro Moment, die ausführliche Theorie jederzeit erreichbar. Wenig Ablenkung, klare Interaktionshierarchie.
- Keine beliebigen Emoji-Kacheln, keine stockartige 3D-Grafik, keine dekorativen Features ohne echten Lernnutzen.

## Umsetzung in sinnvoller Reihenfolge

**Release 0.2 – Qualitätsbasis:** A01–A06, B06, B11, T01, T02, T06; alle vorherigen Lernstände erhalten. Ergebnis: mathematisch verlässliche und stabile Übungsoberfläche.

**Release 0.3 – Premium UI:** Redesign-Designsystem, Startseite, Fach-/Themenkarten, Lesson-Stepper, Übungen, echte Light/Dark-Varianten; T03, T07; mobile UX- und Accessibility-Tests.

**Release 0.4 – Lernen wie ein Spiel:** B01–B04, B07, B09, B10, Visualisierungen, individuelle Hilfestufen und Variation. Ergebnis: Lernerfolge statt Antwortauswendiglernen.

**Release 0.5 – Curriculum & Erweiterbarkeit:** B05, B08, B12, T04, T05, T08; Mathe 6/7 systematisch vervollständigen und Fachmodule sauber trennen.

## Definition of Done

Ein Feature ist erst abgeschlossen, wenn (a) der Lernzweck klar ist, (b) alle sichtbaren Controls funktionieren, (c) fachlich richtige Ergebnisse auch in Sonderfällen entstehen, (d) Mobile/Keyboard unterstützt werden, (e) Offline- und Lernstand nicht beschädigt werden, (f) Tests bestanden sind, und (g) offene Einschränkungen ehrlich dokumentiert wurden.

**Nicht erledigt:** Die Befunde sind eine Codeprüfung und Roadmap; die aufgelisteten Korrekturen und das Premium-Redesign wurden hiermit noch nicht implementiert.
