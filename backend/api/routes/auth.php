<?php
/**
 * Authentication Routes
 */

global $pdo;

switch ($request_method) {
    case 'POST':
        if ($segments[1] === 'register') {
            // Register new user
            $username = $input['username'] ?? '';
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            $school = $input['school'] ?? '';
            $role = $input['role'] ?? 'player';
            
            if (empty($username) || empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing required fields']);
                exit;
            }
            
            $password_hash = password_hash($password, PASSWORD_DEFAULT);
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO users (username, email, password_hash, school, role)
                    VALUES (?, ?, ?, ?, ?)
                ");
                $stmt->execute([$username, $email, $password_hash, $school, $role]);
                
                $user_id = $pdo->lastInsertId();
                
                // Create user stats entry
                $stmt = $pdo->prepare("INSERT INTO user_stats (user_id) VALUES (?)");
                $stmt->execute([$user_id]);
                
                // Generate token (simplified - use JWT in production)
                $token = (string)$user_id;
                
                $user = [
                    'id' => $user_id,
                    'username' => $username,
                    'email' => $email,
                    'role' => $role,
                ];
                
                echo json_encode([
                    'token' => $token,
                    'user' => $user
                ]);
            } catch (PDOException $e) {
                http_response_code(400);
                echo json_encode(['error' => 'Registration failed', 'message' => $e->getMessage()]);
            }
        } elseif ($segments[1] === 'login') {
            // Login
            $email = $input['email'] ?? '';
            $password = $input['password'] ?? '';
            
            if (empty($email) || empty($password)) {
                http_response_code(400);
                echo json_encode(['error' => 'Email and password required']);
                exit;
            }
            
            $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
            $stmt->execute([$email]);
            $user = $stmt->fetch();
            
            if ($user && password_verify($password, $user['password_hash'])) {
                $token = (string)$user['id'];
                
                unset($user['password_hash']);
                
                echo json_encode([
                    'token' => $token,
                    'user' => $user
                ]);
            } else {
                http_response_code(401);
                echo json_encode(['error' => 'Invalid credentials']);
            }
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}


