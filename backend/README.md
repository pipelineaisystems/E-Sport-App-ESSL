# ESSL Backend API

PHP Backend für die ESSL App.

## Tech Stack

- PHP 8.0+
- MySQL 8.0+
- RESTful API

## Installation

1. Installiere PHP Dependencies (Composer):
```bash
composer install
```

2. Konfiguriere Datenbank in `config/database.php`

3. Führe Migrationen aus:
```bash
php migrate.php
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Tournaments
- `GET /api/tournaments` - Liste aller Turniere
- `GET /api/tournaments/{id}` - Turnier Details
- `POST /api/tournaments/{id}/register` - Für Turnier registrieren
- `GET /api/tournaments/{id}/bracket` - Bracket anzeigen

### Teams
- `GET /api/teams/my-team` - Mein Team
- `GET /api/teams/available` - Verfügbare Teams
- `POST /api/teams` - Team erstellen
- `POST /api/teams/{id}/invite` - Mitglied einladen

### Matches
- `GET /api/matches` - Liste aller Matches
- `GET /api/matches/{id}` - Match Details

### Support
- `GET /api/support/tickets` - Meine Tickets
- `POST /api/support/tickets` - Neues Ticket erstellen

### Notifications
- `GET /api/notifications` - Benachrichtigungen
- `POST /api/notifications/register-token` - Push Token registrieren

### Users
- `GET /api/users/stats` - Benutzer Statistiken
- `GET /api/users/medals` - Benutzer Medaillen
- `POST /api/users/riot-connect` - Riot Account verbinden

## Database Schema

Siehe `database/schema.sql` für das vollständige Datenbankschema.

## Riot API Integration

Die App nutzt die Riot Games API für automatische Statistik-Updates. 
API Key muss in der Konfiguration gesetzt werden.

## Discord Integration

Discord Bot für Community-Features (optional).


