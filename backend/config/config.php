<?php
/**
 * Application Configuration
 */

define('APP_NAME', 'ESSL API');
define('APP_VERSION', '1.0.0');

// Riot API Configuration
define('RIOT_API_KEY', getenv('RIOT_API_KEY') ?: '');

// JWT Secret (for production)
define('JWT_SECRET', getenv('JWT_SECRET') ?: 'your-secret-key-change-in-production');

// CORS Configuration
define('CORS_ORIGINS', [
    'http://localhost:19006', // Expo dev server
    'exp://localhost:19000',
]);


