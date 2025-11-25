import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { syncRiotStats } from '../../services/riotApi';

export default function RiotConnectScreen() {
  const router = useRouter();
  const [summonerName, setSummonerName] = useState('');
  const [region, setRegion] = useState('euw1');
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = async () => {
    if (!summonerName) {
      Alert.alert('Fehler', 'Bitte gib deinen Summoner-Namen ein');
      return;
    }

    setLoading(true);
    try {
      // Sync stats from Riot API
      const stats = await syncRiotStats(null, summonerName, region);
      
      // Save to backend
      const response = await api.post('/users/riot-connect', {
        summonerName,
        region,
        stats,
      });

      setConnected(true);
      Alert.alert('Erfolg', 'Riot Account erfolgreich verbunden!');
      router.back();
    } catch (error) {
      console.error('Error connecting Riot account:', error);
      Alert.alert(
        'Fehler',
        error.response?.data?.message || 'Fehler beim Verbinden des Riot Accounts'
      );
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    { code: 'euw1', name: 'EUW (Europe West)' },
    { code: 'eun1', name: 'EUNE (Europe Nordic & East)' },
    { code: 'na1', name: 'NA (North America)' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Riot Account verbinden</Text>
        <Text style={styles.subtitle}>
          Verbinde deinen Riot Account, um deine Statistiken automatisch zu aktualisieren
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person" size={20} color="#888888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Summoner Name"
            placeholderTextColor="#888888"
            value={summonerName}
            onChangeText={setSummonerName}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.regionContainer}>
          <Text style={styles.regionLabel}>Region:</Text>
          {regions.map((reg) => (
            <TouchableOpacity
              key={reg.code}
              style={[
                styles.regionButton,
                region === reg.code && styles.regionButtonActive,
              ]}
              onPress={() => setRegion(reg.code)}
            >
              <Text
                style={[
                  styles.regionButtonText,
                  region === reg.code && styles.regionButtonTextActive,
                ]}
              >
                {reg.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.connectButton, loading && styles.connectButtonDisabled]}
          onPress={handleConnect}
          disabled={loading}
        >
          <Text style={styles.connectButtonText}>
            {loading ? 'Wird verbunden...' : 'Verbinden'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color="#00ff00" />
          <Text style={styles.infoText}>
            Deine Statistiken werden automatisch aktualisiert, wenn du Spiele spielst.
          </Text>
        </View>
      </View>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    lineHeight: 24,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333333',
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  regionContainer: {
    marginBottom: 24,
  },
  regionLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  regionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333333',
    marginBottom: 8,
  },
  regionButtonActive: {
    borderColor: '#00ff00',
    backgroundColor: '#00ff00',
  },
  regionButtonText: {
    color: '#888888',
    fontSize: 16,
  },
  regionButtonTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  connectButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  connectButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#888888',
    marginLeft: 12,
    lineHeight: 20,
  },
});


