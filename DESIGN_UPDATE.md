# Design Update - ESSL Website Style

## Farben aktualisiert

Das Design wurde an die ESSL Website (https://www.essl.games/) angepasst:

### Hintergrund
- **Sehr dunkles Grau/Schwarz**: `#0a0a0a` (statt `#000000`)
- **Dunkles Grau für Cards**: `#1a1a1a`
- **Etwas helleres Grau**: `#252525`

### Primäre Akzentfarben
- **Violett/Lila** (Twitch-Style): `#8b5cf6` (statt Neon-Grün)
- **Dunkleres Violett**: `#6d28d9`
- **Helleres Violett**: `#a78bfa`

### Sekundäre Akzentfarbe
- **Rot/Dunkelrot** (Valorant-Style): `#dc2626`
- **Dunkleres Rot**: `#991b1b`
- **Helleres Rot**: `#ef4444`

### Text
- **Weiß für Headlines**: `#ffffff`
- **Hellgrau für weniger wichtige Texte**: `#d1d5db`
- **Grau für Meta-Infos**: `#9ca3af`

### Buttons
- **Primär (Violett)**: `#8b5cf6` mit weißer Schrift
- **Sekundär (Rot)**: `#dc2626` mit weißer Schrift

## Logo

- ESSL Logo wurde erstellt (SVG verfügbar in `assets/essl-logo.svg`)
- Logo wird in Welcome Screen und Login Screen angezeigt
- Gradient-Hintergrund: Blau → Violett → Rot
- Headset-Icon mit "ESSL" Text

## Hardcoded Login

Für Entwicklung wurde ein hardcoded Login hinzugefügt:
- **Email**: `office@pipebot.at`
- **Passwort**: `test123!`

Dieser Login funktioniert ohne Backend-Verbindung.

## Aktualisierte Screens

- ✅ Welcome Screen (index.js)
- ✅ Login Screen
- ✅ Home Screen (Teilweise)
- ✅ Tab Navigation

## Nächste Schritte

Weitere Screens sollten ebenfalls mit den neuen Farben aktualisiert werden:
- Tournaments Screen
- Teams Screen
- Calendar Screen
- Profile Screen
- Support Screen
- Rules Screen


