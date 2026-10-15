# Rommé Online – Gastspiel-Version

Eine responsive Rommé-Website für 2–4 Personen. **Keine Registrierung**: Spieler geben einen Namen ein, öffnen einen Raum mit sechsstelliger Zahl, geben den Code oder Link weiter, und der Raumleiter startet die Partie.

## Start auf Windows

1. ZIP entpacken und im Ordner mit der `package.json` eine PowerShell öffnen.
2. `npm.cmd start` ausführen (Node.js 22 oder neuer).
3. `http://localhost:3000` im Browser öffnen.

Es sind **keine npm-Abhängigkeiten** und kein `npm install` nötig.

Im selben WLAN funktioniert das Spiel über die IPv4-Adresse des Windows-Rechners (z. B. `http://192.168.178.30:3000`), wenn die Firewall den Zugriff zulässt. **Für Spieler an verschiedenen Standorten muss der Node-Server öffentlich bereitgestellt werden.** Ein statischer Hoster (z. B. GitHub Pages oder Netlify ohne Backend) reicht nicht.

## Funktionen

- Name statt Anmeldung; Gastidentität durch HttpOnly-Sitzungscookie mit 30 Tagen Laufzeit
- Privater sechsstelliger Raumcode, Einladungslink, 2–4 Mitspieler
- Spieler sehen nur die eigene Kartenhand
- Server erstellt und kontrolliert alle Karten und Spielzüge
- 2×52 Karten plus 6 Joker, 13 Karten pro Person
- Zug vom Ablagestapel oder verdecktem Stapel, auslegen, anlegen und abwerfen
- Erstmeldung mindestens 30 Punkte; mehrere Kombinationen auf einmal möglich
- Punkte über mehrere Runden; Raumleiter beendet die Partie und ermittelt den Gesamtsieger
- Automatische Aktualisierung im Browser alle 2,5 Sekunden
- Spielstand wird in einer lokalen `data.json` gespeichert

## Tests

`npm.cmd test` (Windows) oder `npm test`. Zusätzlich: `node --test test-integration.mjs` prüft drei getrennte Spieler, Raumzugang und zentrale Spielzüge.

## Hinweise zum Hosting und zu den Grenzen

Betrieb als **eine dauerhaft laufende Node.js-Instanz** mit HTTPS-Reverse-Proxy und **persistentem Speicher**. Über die Umgebungsvariablen `PORT`, `HOST` und `DATA_FILE` konfigurierbar. `HOST` standardmäßig `0.0.0.0`. Für manche Plattformen ist ein persistenter Datenträger kostenpflichtig; ohne Persistenz gehen laufende Räume bei Neustarts verloren. Der Prototyp ist kein fertig gehärteter öffentlich zugänglicher Produktionsdienst. Insbesondere für größere Nutzerzahlen fehlen umfassende Lasttests, WebSockets, einzelne Hausregel-Optionen (Joker-Tausch, Umbauen der Auslage, automatische Entscheidung beim blockierten Nachziehstapel) und eine Datenbank mit konkurrierenden Schreibtransaktionen. Derzeit dient ein Spielername zur Wiedererkennung nur in demselben Browser und ist kein dauerhaftes passwortgeschütztes Profil.

## Regelvarianten

Ass zählt 11, Bildkarten 10, Joker 20 Strafpunkte. Das Ass darf am Anfang oder Ende einer Folge stehen, aber nicht im Übergang zwischen König und Zwei. Eine Karte muss zum abschließenden Abwerfen übrig bleiben. Nach dem Ende einer Runde werden Strafpunkte aller übrigen Spieler zur Gesamtwertung addiert. Die Summe der niedrigsten Strafpunkte bestimmt die Sieger der Partie.

## Kostenlos öffentlich veröffentlichen (Render)

Ein `render.yaml` für einen kostenlosen Node-Webservice in Frankfurt ist enthalten. Nach dem Hochladen des Projektordners in ein eigenes GitHub-Repository kann Render über **New → Blueprint** aus dem Repository direkt einen Webservice erstellen. Alternativ Render → New Web Service → Repository wählen → Free → Build `npm install` → Start `npm start`. Render stellt anschließend einen öffentlichen `https://...onrender.com`-Link bereit.

**Grenzen der kostenlosen Variante:** Render schläft nach etwa 15 Minuten ohne Zugriffe ein. Der erste Aufruf danach kann rund eine Minute dauern. Außerdem ist der Speicher des kostenlosen Webservices nicht persistent: Nach Neustart, Standby und neuen Deployments gehen Räume und Rundenstände verloren. Für gelegentliche private Spielabende kann das ausreichen; für dauerhafte Speicherung müsste eine Datenbank ergänzt werden.
