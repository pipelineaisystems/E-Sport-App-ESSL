import { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)/home');
      }
    }
  }, [user, loading]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/essl-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>ESSL</Text>
        <Text style={styles.subtitle}>Die #1 eSport Student League</Text>
        <Text style={styles.tagline}>Sei dabei!</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.primaryButtonText}>Jetzt registrieren!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.secondaryButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 30,
    width: 150,
    height: 150,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 72,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 24,
    color: colors.textSecondary,
    marginBottom: 5,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: colors.primary,
    marginBottom: 40,
    fontWeight: '600',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.text,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

