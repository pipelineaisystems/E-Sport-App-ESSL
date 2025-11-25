import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { useAuth } from '../../contexts/AuthContext';

export default function CreateTeamScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [teamName, setTeamName] = useState('');
  const [school, setSchool] = useState(user?.school || '');
  const [game, setGame] = useState('Valorant');
  const [loading, setLoading] = useState(false);

  const games = ['Valorant', 'Clash Royale', 'Rocket League', 'Overwatch'];

  const handleCreate = async () => {
    if (!teamName.trim() || !school.trim()) {
      Alert.alert('Fehler', 'Bitte fülle alle Felder aus');
      return;
    }

    setLoading(true);
    try {
      // TODO: API Call
      // await api.post('/teams', { name: teamName, school, game });
      Alert.alert('Erfolg', 'Team wurde erstellt!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Fehler', 'Team konnte nicht erstellt werden');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Team erstellen</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="people" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Teamname"
              placeholderTextColor={colors.textSecondary}
              value={teamName}
              onChangeText={setTeamName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="school" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Schule"
              placeholderTextColor={colors.textSecondary}
              value={school}
              onChangeText={setSchool}
            />
          </View>

          <View style={styles.gameContainer}>
            <Text style={styles.label}>Spiel:</Text>
            <View style={styles.gameButtons}>
              {games.map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.gameButton,
                    game === g && styles.gameButtonActive,
                  ]}
                  onPress={() => setGame(g)}
                >
                  <Text
                    style={[
                      styles.gameButtonText,
                      game === g && styles.gameButtonTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={[styles.createButton, loading && styles.createButtonDisabled]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? 'Wird erstellt...' : 'Team erstellen'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputIcon: {
    marginLeft: 16,
  },
  input: {
    flex: 1,
    padding: 16,
    color: colors.text,
    fontSize: 16,
  },
  gameContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  gameButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gameButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  gameButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  gameButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  gameButtonTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});


