<?php
/**
 * Teams Routes
 */

global $pdo;
$user = getAuthUser();

switch ($request_method) {
    case 'GET':
        if ($segments[1] === 'my-team') {
            if (!$user) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                exit;
            }
            
            $stmt = $pdo->prepare("
                SELECT t.*, tm.role as member_role
                FROM teams t
                INNER JOIN team_members tm ON tm.team_id = t.id
                WHERE tm.user_id = ?
                LIMIT 1
            ");
            $stmt->execute([$user['id']]);
            $team = $stmt->fetch();
            
            if ($team) {
                // Get members
                $stmt = $pdo->prepare("
                    SELECT u.id, u.username, tm.role
                    FROM team_members tm
                    INNER JOIN users u ON u.id = tm.user_id
                    WHERE tm.team_id = ?
                ");
                $stmt->execute([$team['id']]);
                $members = $stmt->fetchAll();
                
                $team['members'] = $members;
                $team['captainId'] = $team['captain_id'];
                $team['maxMembers'] = $team['max_members'];
                
                echo json_encode($team);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'No team found']);
            }
        } elseif ($segments[1] === 'available') {
            // Get available teams
            $stmt = $pdo->query("
                SELECT t.*, 
                       COUNT(tm.id) as members_count
                FROM teams t
                LEFT JOIN team_members tm ON tm.team_id = t.id
                GROUP BY t.id
                HAVING members_count < t.max_members
                ORDER BY t.created_at DESC
            ");
            $teams = $stmt->fetchAll();
            
            foreach ($teams as &$team) {
                $team['members'] = [];
                $team['maxMembers'] = $team['max_members'];
            }
            
            echo json_encode($teams);
        }
        break;
        
    case 'POST':
        if (empty($segments[1])) {
            // Create team
            if (!$user) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                exit;
            }
            
            $name = $input['name'] ?? '';
            $game = $input['game'] ?? '';
            $max_members = $input['maxMembers'] ?? 5;
            
            if (empty($name) || empty($game)) {
                http_response_code(400);
                echo json_encode(['error' => 'Name and game required']);
                exit;
            }
            
            try {
                $pdo->beginTransaction();
                
                $stmt = $pdo->prepare("
                    INSERT INTO teams (name, game, captain_id, max_members)
                    VALUES (?, ?, ?, ?)
                ");
                $stmt->execute([$name, $game, $user['id'], $max_members]);
                $team_id = $pdo->lastInsertId();
                
                // Add captain as member
                $stmt = $pdo->prepare("
                    INSERT INTO team_members (team_id, user_id, role)
                    VALUES (?, ?, 'captain')
                ");
                $stmt->execute([$team_id, $user['id']]);
                
                $pdo->commit();
                
                echo json_encode(['id' => $team_id, 'success' => true]);
            } catch (PDOException $e) {
                $pdo->rollBack();
                http_response_code(400);
                echo json_encode(['error' => 'Team creation failed', 'message' => $e->getMessage()]);
            }
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}


