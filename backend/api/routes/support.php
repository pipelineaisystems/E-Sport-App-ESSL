<?php
/**
 * Support Routes
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
        if ($segments[1] === 'tickets') {
            // Get user tickets
            $stmt = $pdo->prepare("
                SELECT * FROM support_tickets
                WHERE user_id = ?
                ORDER BY created_at DESC
            ");
            $stmt->execute([$user['id']]);
            $tickets = $stmt->fetchAll();
            
            echo json_encode($tickets);
        }
        break;
        
    case 'POST':
        if ($segments[1] === 'tickets') {
            // Create ticket
            $subject = $input['subject'] ?? '';
            $message = $input['message'] ?? '';
            
            if (empty($subject) || empty($message)) {
                http_response_code(400);
                echo json_encode(['error' => 'Subject and message required']);
                exit;
            }
            
            $stmt = $pdo->prepare("
                INSERT INTO support_tickets (user_id, subject, message)
                VALUES (?, ?, ?)
            ");
            $stmt->execute([$user['id'], $subject, $message]);
            $ticket_id = $pdo->lastInsertId();
            
            echo json_encode(['id' => $ticket_id, 'success' => true]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}


