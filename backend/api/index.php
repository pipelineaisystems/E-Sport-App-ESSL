<?php
/**
 * ESSL API Entry Point
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../config/config.php';

// Simple routing
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Remove query string
$path = parse_url($request_uri, PHP_URL_PATH);
$path = str_replace('/api', '', $path);
$path = trim($path, '/');
$segments = explode('/', $path);

// Get request body
$input = json_decode(file_get_contents('php://input'), true);

// Route handling
try {
    switch ($segments[0]) {
        case 'auth':
            require_once __DIR__ . '/routes/auth.php';
            break;
        case 'tournaments':
            require_once __DIR__ . '/routes/tournaments.php';
            break;
        case 'teams':
            require_once __DIR__ . '/routes/teams.php';
            break;
        case 'matches':
            require_once __DIR__ . '/routes/matches.php';
            break;
        case 'notifications':
            require_once __DIR__ . '/routes/notifications.php';
            break;
        case 'support':
            require_once __DIR__ . '/routes/support.php';
            break;
        case 'users':
            require_once __DIR__ . '/routes/users.php';
            break;
        default:
            http_response_code(404);
            echo json_encode(['error' => 'Endpoint not found']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage()
    ]);
}


