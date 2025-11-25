import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

export default function TournamentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [tournament, setTournament] = useState(null);
  const [bracket, setBracket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    loadTournament();
  }, [id]);

  const loadTournament = async () => {
    try {
      const [tournamentResponse, bracketResponse] = await Promise.all([
        api.get(`/tournaments/${id}`),
        api.get(`/tournaments/${id}/bracket`),
      ]);
      setTournament(tournamentResponse.data);
      setBracket(bracketResponse.data);
      setRegistered(tournamentResponse.data.registered);
    } catch (error) {
      console.error('Error loading tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      await api.post(`/tournaments/${id}/register`);
      setRegistered(true);
      router.push('/(tabs)/tournaments');
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registrierung fehlgeschlagen');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Lade Turnier...</Text>
      </View>
    );
  }

  if (!tournament) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Turnier nicht gefunden</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{tournament.name}</Text>
        <View style={[
          styles.statusBadge,
          tournament.status === 'open' && styles.statusOpen,
          tournament.status === 'ongoing' && styles.statusOngoing,
        ]}>
          <Text style={styles.statusText}>{tournament.status}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Details</Text>
        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Ionicons name="game-controller" size={20} color="#00ff00" />
            <Text style={styles.detailLabel}>Spiel:</Text>
            <Text style={styles.detailValue}>{tournament.game}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar" size={20} color="#00ff00" />
            <Text style={styles.detailLabel}>Start:</Text>
            <Text style={styles.detailValue}>
              {format(new Date(tournament.startDate), 'd. MMMM yyyy', { locale: de })}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people" size={20} color="#00ff00" />
            <Text style={styles.detailLabel}>Teilnehmer:</Text>
            <Text style={styles.detailValue}>
              {tournament.participants}/{tournament.maxParticipants} Teams
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Beschreibung</Text>
        <Text style={styles.description}>{tournament.description}</Text>
      </View>

      {bracket && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bracket</Text>
          <TouchableOpacity
            style={styles.bracketButton}
            onPress={() => router.push(`/tournaments/${id}/bracket`)}
          >
            <Text style={styles.bracketButtonText}>Bracket anzeigen</Text>
            <Ionicons name="chevron-forward" size={24} color="#00ff00" />
          </TouchableOpacity>
        </View>
      )}

      {!registered && tournament.status === 'open' && (
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
          >
            <Text style={styles.registerButtonText}>Jetzt registrieren!</Text>
          </TouchableOpacity>
        </View>
      )}

      {registered && (
        <View style={styles.section}>
          <View style={styles.registeredCard}>
            <Ionicons name="checkmark-circle" size={32} color="#00ff00" />
            <Text style={styles.registeredText}>Du bist für dieses Turnier registriert</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#00ff00',
  },
  statusOngoing: {
    backgroundColor: '#ffaa00',
  },
  statusText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  detailCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: '#888888',
    marginLeft: 12,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    lineHeight: 24,
  },
  bracketButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  bracketButtonText: {
    fontSize: 16,
    color: '#00ff00',
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  registeredCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  registeredText: {
    fontSize: 16,
    color: '#ffffff',
    marginLeft: 12,
  },
  loadingText: {
    color: '#888888',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});


