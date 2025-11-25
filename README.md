# ESSL - eSport Student League App

React Native Expo App für die ESSL (eSport Student League) Turniere.

## Features

### On Release
- ✅ Turnier-Anmeldungen
- ✅ Team-Bildung in der App
- ✅ Benachrichtigungen/Newsletter (Events, Livestreams, News, Social Media)
- ✅ Bracket-System (Battlefy-like)
- ✅ Regelwerk zum Nachlesen
- ✅ Terminkalender mit Spielzeiten
- ✅ Ticket/Support System (Chat-like)
- ✅ Auto Update von Spiel-Statistiken (verknüpft mit Riot Login)
- ✅ Rollenverteilung (Unterschied zwischen Spielern und Teamlern)

### Optional
- ✅ Feedback/Umfragen System
- ✅ Twitch Livestream in der App
- ✅ Hall of Fame (Vergangene Sieger)
- ✅ Jubiläumsfeed bzw. UserMedals wie in Duolingo
- ✅ InApp Werbung (Primär Sponsoren Werbung)

## Tech Stack

- **Frontend**: React Native (Expo, JavaScript)
- **Backend**: PHP + MySQL
- **APIs**: Riot Games API, Discord API

## Installation

1. Installiere Dependencies:
```bash
npm install
```

2. Erstelle eine `.env` Datei:
```
EXPO_PUBLIC_API_URL=http://localhost:8000/api
EXPO_PUBLIC_RIOT_API_KEY=dein_riot_api_key
```

3. Starte die App:
```bash
npm start
```

## Projektstruktur

```
essl-app/
├── app/                    # Expo Router Screens
│   ├── (tabs)/            # Tab Navigation
│   ├── tournaments/       # Turnier Screens
│   ├── teams/             # Team Screens
│   └── ...
├── contexts/              # React Contexts
│   ├── AuthContext.js
│   └── NotificationContext.js
├── services/              # API Services
│   ├── api.js
│   └── riotApi.js
└── assets/                # Bilder, Icons, etc.
```

## Backend Setup

Das Backend befindet sich im `backend/` Ordner. Siehe `backend/README.md` für Details.

## Design

Die App folgt dem Design der ESSL Website (https://www.essl.games/):
- Dunkles Theme (Schwarz)
- Neon-Grün (#00ff00) als Akzentfarbe
- Moderne, clean UI
- Uppercase Headlines

## Entwicklung

- Expo Router für Navigation
- AsyncStorage für lokale Daten
- Axios für API Calls
- Expo Notifications für Push Notifications
- React Native WebView für Twitch Streams

## License

© 2025 ESSL


