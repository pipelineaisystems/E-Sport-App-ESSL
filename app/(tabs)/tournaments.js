import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { colors } from '../../constants/colors';

export default function TournamentsScreen() {
  const router = useRouter();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTournaments();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadTournaments = async () => {
    try {
      const response = await api.get('/tournaments');
      setTournaments(response.data);
    } catch (error) {
      console.error('Error loading tournaments:', error);
      // Mock data for development
      setTournaments([
        {
          id: 1,
          name: 'Valorant Winter Cup',
          game: 'Valorant',
          status: 'open',
          startDate: '15.12.2025',
          participants: 12,
          maxParticipants: 16,
          registered: false,
        },
        {
          id: 2,
          name: 'Clash Royale Championship',
          game: 'Clash Royale',
          status: 'ongoing',
          startDate: '10.12.2025',
          participants: 8,
          maxParticipants: 8,
          registered: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const TournamentCard = ({ item, index }) => {
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
          style={styles.tournamentCard}
          onPress={() => router.push(`/tournaments/${item.id}`)}
          activeOpacity={0.8}
        >
          <View style={styles.tournamentHeader}>
            <Text style={styles.tournamentTitle}>{item.name}</Text>
            <View
              style={[
                styles.statusBadge,
                item.status === 'open' && styles.statusOpen,
                item.status === 'ongoing' && styles.statusOngoing,
                item.status === 'closed' && styles.statusClosed,
              ]}
            >
              <Text style={styles.statusText}>
                {item.status === 'open' ? 'Offen' : item.status === 'ongoing' ? 'Laufend' : 'Geschlossen'}
              </Text>
            </View>
          </View>
          <View style={styles.gameContainer}>
            <Ionicons name="game-controller" size={16} color={colors.primary} />
            <Text style={styles.tournamentGame}>{item.game}</Text>
          </View>
          <View style={styles.tournamentInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar" size={16} color={colors.textSecondary} />
              <Text style={styles.tournamentDate}>{item.startDate}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="people" size={16} color={colors.textSecondary} />
              <Text style={styles.tournamentParticipants}>
                {item.participants}/{item.maxParticipants} Teams
              </Text>
            </View>
          </View>
          {item.registered && (
            <View style={styles.registeredBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#ffffff" />
              <Text style={styles.registeredText}>Registriert</Text>
            </View>
          )}
          {!item.registered && item.status === 'open' && (
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => router.push(`/tournaments/${item.id}/register`)}
              activeOpacity={0.8}
            >
              <Text style={styles.registerButtonText}>Jetzt registrieren</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderTournament = ({ item, index }) => (
    <TournamentCard item={item} index={index} />
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Turniere</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => router.push('/tournaments/filter')}
          activeOpacity={0.7}
        >
          <Ionicons name="filter" size={24} color={colors.text} />
        </TouchableOpacity>
      </Animated.View>

      {loading ? (
        <View style={styles.center}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Ionicons name="hourglass" size={48} color={colors.primary} />
            <Text style={styles.loadingText}>Lade Turniere...</Text>
          </Animated.View>
        </View>
      ) : (
        <FlatList
          data={tournaments}
          renderItem={renderTournament}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Animated.View style={[styles.center, { opacity: fadeAnim }]}>
              <Ionicons name="trophy-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyText}>Keine Turniere verfügbar</Text>
              <Text style={styles.emptySubtext}>Schau später wieder vorbei!</Text>
            </Animated.View>
          }
        />
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
  filterButton: {
    padding: 8,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  tournamentCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tournamentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tournamentTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: colors.primary,
  },
  statusOngoing: {
    backgroundColor: colors.warning,
  },
  statusClosed: {
    backgroundColor: colors.textSecondary,
  },
  statusText: {
    color: colors.buttonPrimaryText,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  gameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tournamentGame: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  tournamentInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tournamentDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tournamentParticipants: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  registeredText: {
    color: colors.buttonPrimaryText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 12,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
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
});
