<?php
/**
 * Tournaments Routes
 */

global $pdo;
$user = getAuthUser();

switch ($request_method) {
    case 'GET':
        if (empty($segments[1])) {
            // List all tournaments
            $stmt = $pdo->query("
                SELECT t.*, 
                       COUNT(tr.id) as participants,
                       EXISTS(
                           SELECT 1 FROM tournament_registrations tr2 
                           WHERE tr2.tournament_id = t.id 
                           AND tr2.team_id IN (
                               SELECT team_id FROM team_members WHERE user_id = ?
                           )
                       ) as registered
                FROM tournaments t
                LEFT JOIN tournament_registrations tr ON tr.tournament_id = t.id
                GROUP BY t.id
                ORDER BY t.start_date DESC
            ");
            $stmt->execute([$user['id'] ?? 0]);
            $tournaments = $stmt->fetchAll();
            
            echo json_encode($tournaments);
        } elseif (is_numeric($segments[1])) {
            $tournament_id = $segments[1];
            
            if (!empty($segments[2]) && $segments[2] === 'bracket') {
                // Get bracket
                $stmt = $pdo->prepare("
                    SELECT m.*, 
                           t1.name as team1_name, t1.id as team1_id,
                           t2.name as team2_name, t2.id as team2_id
                    FROM matches m
                    LEFT JOIN teams t1 ON m.team1_id = t1.id
                    LEFT JOIN teams t2 ON m.team2_id = t2.id
                    WHERE m.tournament_id = ?
                    ORDER BY m.round_name, m.scheduled_at
                ");
                $stmt->execute([$tournament_id]);
                $matches = $stmt->fetchAll();
                
                // Group by rounds
                $rounds = [];
                foreach ($matches as $match) {
                    $round_name = $match['round_name'] ?? 'Round 1';
                    if (!isset($rounds[$round_name])) {
                        $rounds[$round_name] = ['name' => $round_name, 'matches' => []];
                    }
                    $rounds[$round_name]['matches'][] = [
                        'id' => $match['id'],
                        'team1' => ['id' => $match['team1_id'], 'name' => $match['team1_name']],
                        'team2' => ['id' => $match['team2_id'], 'name' => $match['team2_name']],
                        'score1' => $match['score1'],
                        'score2' => $match['score2'],
                        'winner' => $match['winner_id'],
                        'scheduledAt' => $match['scheduled_at'],
                    ];
                }
                
                echo json_encode(['rounds' => array_values($rounds)]);
            } else {
                // Get tournament details
                $stmt = $pdo->prepare("
                    SELECT t.*, 
                           COUNT(tr.id) as participants,
                           EXISTS(
                               SELECT 1 FROM tournament_registrations tr2 
                               WHERE tr2.tournament_id = t.id 
                               AND tr2.team_id IN (
                                   SELECT team_id FROM team_members WHERE user_id = ?
                               )
                           ) as registered
                    FROM tournaments t
                    LEFT JOIN tournament_registrations tr ON tr.tournament_id = t.id
                    WHERE t.id = ?
                    GROUP BY t.id
                ");
                $stmt->execute([$user['id'] ?? 0, $tournament_id]);
                $tournament = $stmt->fetch();
                
                if ($tournament) {
                    echo json_encode($tournament);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Tournament not found']);
                }
            }
        }
        break;
        
    case 'POST':
        if (is_numeric($segments[1]) && $segments[2] === 'register') {
            // Register for tournament
            if (!$user) {
                http_response_code(401);
                echo json_encode(['error' => 'Unauthorized']);
                exit;
            }
            
            $tournament_id = $segments[1];
            
            // Get user's team
            $stmt = $pdo->prepare("
                SELECT team_id FROM team_members 
                WHERE user_id = ? AND role = 'captain'
                LIMIT 1
            ");
            $stmt->execute([$user['id']]);
            $team = $stmt->fetch();
            
            if (!$team) {
                http_response_code(400);
                echo json_encode(['error' => 'You must be a team captain to register']);
                exit;
            }
            
            try {
                $stmt = $pdo->prepare("
                    INSERT INTO tournament_registrations (tournament_id, team_id)
                    VALUES (?, ?)
                ");
                $stmt->execute([$tournament_id, $team['team_id']]);
                
                echo json_encode(['success' => true]);
            } catch (PDOException $e) {
                http_response_code(400);
                echo json_encode(['error' => 'Registration failed', 'message' => $e->getMessage()]);
            }
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}


