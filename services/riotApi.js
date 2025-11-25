import axios from 'axios';

const RIOT_API_BASE = 'https://europe.api.riotgames.com';
const RIOT_API_KEY = process.env.EXPO_PUBLIC_RIOT_API_KEY || '';

export const riotApi = axios.create({
  baseURL: RIOT_API_BASE,
  timeout: 10000,
  headers: {
    'X-Riot-Token': RIOT_API_KEY,
  },
});

export const getSummonerByName = async (summonerName, region = 'euw1') => {
  try {
    const response = await riotApi.get(
      `/lol/summoner/v4/summoners/by-name/${encodeURIComponent(summonerName)}`,
      {
        baseURL: `https://${region}.api.riotgames.com`,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching summoner:', error);
    throw error;
  }
};

export const getMatchHistory = async (puuid, count = 20) => {
  try {
    const response = await riotApi.get(
      `/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        params: { count },
        baseURL: 'https://europe.api.riotgames.com',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching match history:', error);
    throw error;
  }
};

export const getMatchDetails = async (matchId) => {
  try {
    const response = await riotApi.get(
      `/lol/match/v5/matches/${matchId}`,
      {
        baseURL: 'https://europe.api.riotgames.com',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching match details:', error);
    throw error;
  }
};

export const getRankedStats = async (summonerId, region = 'euw1') => {
  try {
    const response = await riotApi.get(
      `/lol/league/v4/entries/by-summoner/${summonerId}`,
      {
        baseURL: `https://${region}.api.riotgames.com`,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching ranked stats:', error);
    throw error;
  }
};

export const syncRiotStats = async (userId, summonerName, region = 'euw1') => {
  try {
    // Get summoner info
    const summoner = await getSummonerByName(summonerName, region);
    
    // Get ranked stats
    const rankedStats = await getRankedStats(summoner.id, region);
    
    // Get recent matches
    const matchIds = await getMatchHistory(summoner.puuid, 10);
    const matches = await Promise.all(
      matchIds.slice(0, 5).map(id => getMatchDetails(id))
    );

    // Calculate stats
    const stats = {
      summonerId: summoner.id,
      puuid: summoner.puuid,
      summonerLevel: summoner.summonerLevel,
      ranked: rankedStats.find(r => r.queueType === 'RANKED_SOLO_5x5') || null,
      recentMatches: matches.length,
      wins: matches.filter(m => {
        const participant = m.info.participants.find(p => p.puuid === summoner.puuid);
        return participant?.win;
      }).length,
      losses: matches.filter(m => {
        const participant = m.info.participants.find(p => p.puuid === summoner.puuid);
        return !participant?.win;
      }).length,
    };

    return stats;
  } catch (error) {
    console.error('Error syncing Riot stats:', error);
    throw error;
  }
};

export default {
  getSummonerByName,
  getMatchHistory,
  getMatchDetails,
  getRankedStats,
  syncRiotStats,
};


