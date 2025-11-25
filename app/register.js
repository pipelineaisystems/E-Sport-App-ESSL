import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    school: '',
    role: 'player', // player or captain
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    if (!formData.username || !formData.email || !formData.password || !formData.school) {
      Alert.alert('Fehler', 'Bitte fülle alle Pflichtfelder aus');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Fehler', 'Passwörter stimmen nicht überein');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Fehler', 'Passwort muss mindestens 6 Zeichen lang sein');
      return;
    }

    setLoading(true);
    const { confirmPassword, ...registerData } = formData;
    const result = await register(registerData);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)/home');
    } else {
      Alert.alert('Registrierung fehlgeschlagen', result.error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>ESSL</Text>
          <Text style={styles.subtitle}>Registrieren</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Ionicons name="person" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Benutzername"
                placeholderTextColor="#888888"
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="E-Mail"
                placeholderTextColor="#888888"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="school" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Schule"
                placeholderTextColor="#888888"
                value={formData.school}
                onChangeText={(text) => setFormData({ ...formData, school: text })}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Passwort"
                placeholderTextColor="#888888"
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="#888888"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color="#888888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Passwort bestätigen"
                placeholderTextColor="#888888"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Rolle:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'player' && styles.roleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, role: 'player' })}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      formData.role === 'player' && styles.roleButtonTextActive,
                    ]}
                  >
                    Spieler
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleButton,
                    formData.role === 'captain' && styles.roleButtonActive,
                  ]}
                  onPress={() => setFormData({ ...formData, role: 'captain' })}
                >
                  <Text
                    style={[
                      styles.roleButtonText,
                      formData.role === 'captain' && styles.roleButtonTextActive,
                    ]}
                  >
                    Team Captain
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Wird registriert...' : 'Registrieren'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginLinkText}>
                Bereits registriert? Jetzt anmelden
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 24,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 40,
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
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
  eyeIcon: {
    padding: 16,
  },
  roleContainer: {
    marginBottom: 24,
  },
  roleLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#333333',
    alignItems: 'center',
  },
  roleButtonActive: {
    borderColor: '#00ff00',
    backgroundColor: '#00ff00',
  },
  roleButtonText: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '600',
  },
  roleButtonTextActive: {
    color: '#000000',
  },
  registerButton: {
    backgroundColor: '#00ff00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loginLink: {
    marginTop: 24,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#00ff00',
    fontSize: 16,
  },
});


