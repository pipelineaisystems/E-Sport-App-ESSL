import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { api } from '../../../services/api';

export default function BracketScreen() {
  const { id } = useLocalSearchParams();
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBracket();
  }, [id]);

  const loadBracket = async () => {
    try {
      const response = await api.get(`/tournaments/${id}/bracket`);
      setBracket(response.data);
    } catch (error) {
      console.error('Error loading bracket:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderMatch = (match, round, index) => (
    <View key={match.id} style={styles.matchContainer}>
      <View style={styles.matchBox}>
        <View style={[
          styles.teamBox,
          match.winner === match.team1?.id && styles.winnerBox,
        ]}>
          <Text style={styles.teamName}>
            {match.team1?.name || 'TBD'}
          </Text>
          {match.score1 !== null && (
            <Text style={styles.score}>{match.score1}</Text>
          )}
        </View>
        <View style={[
          styles.teamBox,
          match.winner === match.team2?.id && styles.winnerBox,
        ]}>
          <Text style={styles.teamName}>
            {match.team2?.name || 'TBD'}
          </Text>
          {match.score2 !== null && (
            <Text style={styles.score}>{match.score2}</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderRound = (round, roundIndex) => (
    <View key={roundIndex} style={styles.roundContainer}>
      <Text style={styles.roundTitle}>{round.name}</Text>
      {round.matches.map((match, index) => renderMatch(match, round, index))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Lade Bracket...</Text>
      </View>
    );
  }

  if (!bracket || !bracket.rounds || bracket.rounds.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Bracket noch nicht verfügbar</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      horizontal
      contentContainerStyle={styles.scrollContent}
    >
      {bracket.rounds.map((round, index) => renderRound(round, index))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
  },
  loadingText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  roundContainer: {
    marginRight: 40,
    minWidth: 200,
  },
  roundTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00ff00',
    marginBottom: 20,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  matchContainer: {
    marginBottom: 20,
  },
  matchBox: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333333',
    overflow: 'hidden',
  },
  teamBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  winnerBox: {
    backgroundColor: '#00ff0020',
    borderLeftWidth: 3,
    borderLeftColor: '#00ff00',
  },
  teamName: {
    fontSize: 14,
    color: '#ffffff',
    flex: 1,
  },
  score: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff00',
    marginLeft: 12,
  },
});


