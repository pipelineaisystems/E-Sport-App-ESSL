<?php
/**
 * Matches Routes
 */

global $pdo;

switch ($request_method) {
    case 'GET':
        if (empty($segments[1])) {
            // List matches
            $date = $_GET['date'] ?? null;
            
            $sql = "
                SELECT m.*,
                       t1.name as team1_name, t1.id as team1_id,
                       t2.name as team2_name, t2.id as team2_id,
                       tr.name as tournament_name, tr.game as tournament_game
                FROM matches m
                LEFT JOIN teams t1 ON m.team1_id = t1.id
                LEFT JOIN teams t2 ON m.team2_id = t2.id
                LEFT JOIN tournaments tr ON m.tournament_id = tr.id
            ";
            
            if ($date) {
                $sql .= " WHERE DATE(m.scheduled_at) = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$date]);
            } else {
                $sql .= " ORDER BY m.scheduled_at DESC LIMIT 50";
                $stmt = $pdo->query($sql);
            }
            
            $matches = $stmt->fetchAll();
            
            foreach ($matches as &$match) {
                $match['team1'] = ['id' => $match['team1_id'], 'name' => $match['team1_name']];
                $match['team2'] = ['id' => $match['team2_id'], 'name' => $match['team2_name']];
                $match['tournament'] = ['name' => $match['tournament_name'], 'game' => $match['tournament_game']];
                unset($match['team1_id'], $match['team1_name'], $match['team2_id'], $match['team2_name']);
                unset($match['tournament_name'], $match['tournament_game']);
            }
            
            echo json_encode($matches);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}


