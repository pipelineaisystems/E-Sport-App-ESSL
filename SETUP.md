# ESSL App Setup Guide

## Voraussetzungen

1. **Node.js** (v18 oder höher)
2. **npm** oder **yarn**
3. **Expo CLI**: `npm install -g expo-cli`
4. **MySQL** Datenbank
5. **PHP** (8.0+) für Backend
6. **Riot API Key** (optional, für Statistik-Updates)

## Installation

### 1. Frontend (React Native Expo)

```bash
cd essl-app
npm install
```

### 2. Backend (PHP)

1. Erstelle MySQL Datenbank:
```bash
mysql -u root -p < backend/database/schema.sql
```

2. Konfiguriere Datenbank in `backend/config/database.php` oder setze Environment Variables:
```bash
export DB_HOST=localhost
export DB_NAME=essl_db
export DB_USER=root
export DB_PASS=your_password
export RIOT_API_KEY=your_riot_api_key
```

3. Starte PHP Server (z.B. mit PHP Built-in Server):
```bash
cd backend
php -S localhost:8000
```

### 3. Environment Variables

Erstelle eine `.env` Datei im Root-Verzeichnis:
```bash
cp .env.example .env
```

Bearbeite `.env` und setze:
- `EXPO_PUBLIC_API_URL=http://localhost:8000/api`
- `EXPO_PUBLIC_RIOT_API_KEY=dein_riot_api_key`

## Assets

Erstelle folgende Assets im `assets/` Ordner:

- `icon.png` - App Icon (1024x1024)
- `splash.png` - Splash Screen (1242x2436)
- `adaptive-icon.png` - Android Adaptive Icon (1024x1024)
- `favicon.png` - Web Favicon (48x48)
- `notification-icon.png` - Notification Icon (96x96)
- `essl-bg.jpg` - Hintergrundbild für Welcome Screen

## App starten

```bash
npm start
```

Dann:
- Drücke `a` für Android Emulator
- Drücke `i` für iOS Simulator
- Scanne QR Code mit Expo Go App auf deinem Handy

## Features Implementiert

### ✅ Core Features
- [x] Turnier-Anmeldungen
- [x] Team-Bildung in der App
- [x] Benachrichtigungen/Newsletter
- [x] Bracket-System (Battlefy-like)
- [x] Regelwerk zum Nachlesen
- [x] Terminkalender mit Spielzeiten
- [x] Ticket/Support System
- [x] Auto Update von Spiel-Statistiken (Riot API)
- [x] Rollenverteilung (Spieler/Team Captain)

### ✅ Optional Features
- [x] Twitch Livestream in der App
- [x] Hall of Fame (Datenbank-Schema)
- [x] User Medaillen System
- [x] Feedback/Umfragen System (Datenbank-Schema)

## Projektstruktur

```
essl-app/
├── app/                    # Expo Router Screens
│   ├── (tabs)/            # Tab Navigation (Home, Tournaments, Teams, Calendar, Profile)
│   ├── tournaments/       # Turnier Screens
│   ├── profile/           # Profil Screens
│   ├── login.js           # Login Screen
│   ├── register.js        # Registrierung Screen
│   ├── support.js         # Support/Tickets
│   ├── rules.js           # Regelwerk
│   └── livestream.js      # Twitch Stream
├── contexts/              # React Contexts
│   ├── AuthContext.js     # Authentication
│   └── NotificationContext.js  # Notifications
├── services/              # API Services
│   ├── api.js             # Backend API Client
│   └── riotApi.js         # Riot Games API
├── backend/               # PHP Backend
│   ├── api/               # API Routes
│   ├── config/            # Configuration
│   └── database/          # Database Schema
└── assets/                # Images, Icons
```

## Design

Die App folgt dem ESSL Website Design:
- **Hintergrund**: Schwarz (#000000)
- **Akzentfarbe**: Neon-Grün (#00ff00)
- **Text**: Weiß (#ffffff)
- **Sekundärtext**: Grau (#888888)
- **Cards**: Dunkelgrau (#1a1a1a)

## Nächste Schritte

1. Assets erstellen/hinzufügen
2. Backend auf Server deployen
3. Riot API Key konfigurieren
4. Push Notifications konfigurieren (Expo)
5. Testing
6. App Store / Play Store Deployment

## Troubleshooting

### Backend Connection Error
- Prüfe ob PHP Server läuft
- Prüfe `EXPO_PUBLIC_API_URL` in `.env`
- Prüfe CORS Einstellungen

### Riot API Errors
- Prüfe ob API Key gesetzt ist
- Riot API hat Rate Limits (100 requests / 2 Minuten)
- Prüfe ob Summoner Name korrekt ist

### Database Errors
- Prüfe MySQL Connection
- Führe Schema erneut aus: `mysql -u root -p < backend/database/schema.sql`

## Support

Bei Fragen oder Problemen, erstelle ein Issue im Repository oder kontaktiere das ESSL Team.


