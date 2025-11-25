<?php
/**
 * Notifications Routes
 */

global $pdo;
$user = getAuthUser();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

switch ($request_method) {
    case 'GET':
        if (empty($segments[1])) {
            // Get user notifications
            $stmt = $pdo->prepare("
                SELECT * FROM notifications
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT 50
            ");
            $stmt->execute([$user['id']]);
            $notifications = $stmt->fetchAll();
            
            echo json_encode($notifications);
        }
        break;
        
    case 'POST':
        if ($segments[1] === 'register-token') {
            // Register push token
            $token = $input['token'] ?? '';
            $platform = $input['platform'] ?? 'expo';
            
            if (empty($token)) {
                http_response_code(400);
                echo json_encode(['error' => 'Token required']);
                exit;
            }
            
            $stmt = $pdo->prepare("
                INSERT INTO push_tokens (user_id, token, platform)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP
            ");
            $stmt->execute([$user['id'], $token, $platform]);
            
            echo json_encode(['success' => true]);
        }
        break;
        
    case 'PATCH':
        if (is_numeric($segments[1]) && $segments[2] === 'read') {
            // Mark notification as read
            $notification_id = $segments[1];
            
            $stmt = $pdo->prepare("
                UPDATE notifications
                SET read = TRUE
                WHERE id = ? AND user_id = ?
            ");
            $stmt->execute([$notification_id, $user['id']]);
            
            echo json_encode(['success' => true]);
        } elseif ($segments[1] === 'read-all') {
            // Mark all as read
            $stmt = $pdo->prepare("
                UPDATE notifications
                SET read = TRUE
                WHERE user_id = ? AND read = FALSE
            ");
            $stmt->execute([$user['id']]);
            
            echo json_encode(['success' => true]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}


