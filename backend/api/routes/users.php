<?php
/**
 * Users Routes
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
        if ($segments[1] === 'stats') {
            // Get user stats
            $stmt = $pdo->prepare("
                SELECT * FROM user_stats
                WHERE user_id = ?
            ");
            $stmt->execute([$user['id']]);
            $stats = $stmt->fetch();
            
            if (!$stats) {
                // Create stats entry if doesn't exist
                $stmt = $pdo->prepare("INSERT INTO user_stats (user_id) VALUES (?)");
                $stmt->execute([$user['id']]);
                $stats = [
                    'matches_played' => 0,
                    'wins' => 0,
                    'losses' => 0,
                    'win_rate' => 0,
                ];
            }
            
            echo json_encode([
                'matchesPlayed' => $stats['matches_played'],
                'wins' => $stats['wins'],
                'losses' => $stats['losses'],
                'winRate' => (float)$stats['win_rate'],
            ]);
        } elseif ($segments[1] === 'medals') {
            // Get user medals
            $stmt = $pdo->prepare("
                SELECT * FROM medals
                WHERE user_id = ?
                ORDER BY earned_date DESC
            ");
            $stmt->execute([$user['id']]);
            $medals = $stmt->fetchAll();
            
            foreach ($medals as &$medal) {
                $medal['earnedDate'] = $medal['earned_date'];
            }
            
            echo json_encode($medals);
        }
        break;
        
    case 'POST':
        if ($segments[1] === 'riot-connect') {
            // Connect Riot account
            $summoner_name = $input['summonerName'] ?? '';
            $region = $input['region'] ?? 'euw1';
            $stats = $input['stats'] ?? [];
            
            if (empty($summoner_name)) {
                http_response_code(400);
                echo json_encode(['error' => 'Summoner name required']);
                exit;
            }
            
            $stmt = $pdo->prepare("
                UPDATE users
                SET riot_summoner_name = ?, 
                    riot_region = ?,
                    riot_puuid = ?,
                    riot_summoner_id = ?
                WHERE id = ?
            ");
            $stmt->execute([
                $summoner_name,
                $region,
                $stats['puuid'] ?? null,
                $stats['summonerId'] ?? null,
                $user['id']
            ]);
            
            // Update stats
            if (!empty($stats)) {
                $stmt = $pdo->prepare("
                    UPDATE user_stats
                    SET riot_rank = ?,
                        riot_tier = ?,
                        riot_lp = ?,
                        last_synced_at = CURRENT_TIMESTAMP
                    WHERE user_id = ?
                ");
                $ranked = $stats['ranked'] ?? null;
                $stmt->execute([
                    $ranked['rank'] ?? null,
                    $ranked['tier'] ?? null,
                    $ranked['leaguePoints'] ?? null,
                    $user['id']
                ]);
            }
            
            echo json_encode(['success' => true]);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}


