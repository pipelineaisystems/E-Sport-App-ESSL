import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { de } from 'date-fns/locale';
import { api } from '../../services/api';
import { colors } from '../../constants/colors';

export default function CalendarScreen() {
  const router = useRouter();
  const [matches, setMatches] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadMatches();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [selectedDate]);

  const loadMatches = async () => {
    try {
      const response = await api.get('/matches', {
        params: { date: selectedDate.toISOString().split('T')[0] },
      });
      setMatches(response.data);
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatMatchDate = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Heute';
    if (isTomorrow(date)) return 'Morgen';
    return format(date, 'EEEE, d. MMMM', { locale: de });
  };

  const formatMatchTime = (dateString) => {
    return format(parseISO(dateString), 'HH:mm');
  };

  const MatchCard = ({ match, index }) => {
    const cardAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(cardAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 100,
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        <TouchableOpacity
          style={styles.matchCard}
          onPress={() => router.push(`/matches/${match.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.matchHeader}>
            <Text style={styles.matchDate}>{formatMatchDate(match.scheduledAt)}</Text>
            <Text style={styles.matchTime}>{formatMatchTime(match.scheduledAt)}</Text>
          </View>
          <View style={styles.matchTeams}>
            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{match.team1.name}</Text>
              {match.score1 !== null && (
                <Text style={styles.teamScore}>{match.score1}</Text>
              )}
            </View>
            <Text style={styles.vs}>VS</Text>
            <View style={styles.teamContainer}>
              <Text style={styles.teamName}>{match.team2.name}</Text>
              {match.score2 !== null && (
                <Text style={styles.teamScore}>{match.score2}</Text>
              )}
            </View>
          </View>
          <View style={styles.matchFooter}>
            <View style={styles.gameContainer}>
              <Ionicons name="game-controller" size={16} color={colors.primary} />
              <Text style={styles.matchGame}>{match.tournament.game}</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                match.status === 'scheduled' && styles.statusScheduled,
                match.status === 'live' && styles.statusLive,
                match.status === 'finished' && styles.statusFinished,
              ]}
            >
              <Text style={styles.statusText}>
                {match.status === 'scheduled' ? 'Geplant' : match.status === 'live' ? 'Live' : 'Beendet'}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const groupedMatches = matches.reduce((acc, match) => {
    const date = parseISO(match.scheduledAt).toISOString().split('T')[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(match);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Spielzeiten</Text>
        <TouchableOpacity
          onPress={() => router.push('/calendar/filter')}
          activeOpacity={0.7}
        >
          <Ionicons name="filter" size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {loading ? (
        <View style={styles.center}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Ionicons name="hourglass" size={48} color={colors.primary} />
            <Text style={styles.loadingText}>Lade Spiele...</Text>
          </Animated.View>
        </View>
      ) : Object.keys(groupedMatches).length === 0 ? (
        <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
          <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.emptyText}>Keine Spiele geplant</Text>
          <Text style={styles.emptySubtext}>Schau später wieder vorbei!</Text>
        </Animated.View>
      ) : (
        <ScrollView style={styles.scrollView}>
          {Object.entries(groupedMatches).map(([date, dateMatches]) => (
            <Animated.View
              key={date}
              style={[
                styles.dateSection,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.dateTitle}>
                {format(parseISO(date), 'EEEE, d. MMMM yyyy', { locale: de })}
              </Text>
              {dateMatches.map((match, index) => (
                <MatchCard key={match.id} match={match} index={index} />
              ))}
            </Animated.View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textTransform: 'uppercase',
  },
  scrollView: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
  emptyText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtext: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 8,
  },
  dateSection: {
    padding: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 16,
    textTransform: 'capitalize',
  },
  matchCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  matchDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  matchTime: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
  },
  matchTeams: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamContainer: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  teamScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  vs: {
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  matchFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  gameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  matchGame: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusScheduled: {
    backgroundColor: colors.textSecondary,
  },
  statusLive: {
    backgroundColor: colors.error,
  },
  statusFinished: {
    backgroundColor: colors.primary,
  },
  statusText: {
    color: colors.buttonPrimaryText,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
