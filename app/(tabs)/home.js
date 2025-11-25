import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { Animated } from 'react-native';
import { useEffect, useRef } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const unreadCount = 0;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.greeting}>Willkommen zurück, {user?.username || 'Spieler'}!</Text>
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => router.push('/profile/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={24} color={colors.text} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Nächstes Event</Text>
        <Animated.View
          style={[
            styles.eventCard,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <Text style={styles.eventTitle}>Clash Royale Cup</Text>
          <Text style={styles.eventDate}>In 5 Tagen</Text>
          <TouchableOpacity
            style={styles.eventButton}
            onPress={() => router.push('/tournaments/register')}
            activeOpacity={0.8}
          >
            <Text style={styles.eventButtonText}>Jetzt registrieren!</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aktuelle News</Text>
        <TouchableOpacity
          style={styles.newsCard}
          onPress={() => router.push('/news')}
        >
          <Text style={styles.newsTitle}>Emotion pur: Die ESSL-Finalspiele</Text>
          <Text style={styles.newsDate}>30. Juni 2025</Text>
        </TouchableOpacity>
      </View>

      {/* ⭐️ SCHNELLZUGRIFF — NUR DIESER TEIL WURDE GEÄNDERT ⭐️ */}
      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Schnellzugriff</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/teams')}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="people" size={32} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Mein Team</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/calendar')}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="calendar" size={32} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Spielzeiten</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/support')}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="help-circle" size={32} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Support</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionCard}
            onPress={() => router.push('/rules')}
            activeOpacity={0.7}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="document-text" size={32} color={colors.primary} />
            </View>
            <Text style={styles.quickActionText}>Regelwerk</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      {/* ⭐️ ENDE SCHNELLZUGRIFF ⭐️ */}

      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>ESSL Livestream</Text>
        <TouchableOpacity
          style={styles.streamCard}
          onPress={() => router.push('/livestream')}
          activeOpacity={0.8}
        >
          <Ionicons name="play-circle" size={48} color={colors.primary} />
          <Text style={styles.streamText}>FOLLOW US ON TWITCH</Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Unsere Sponsoren</Text>
        <TouchableOpacity
          style={styles.sponsorsCard}
          onPress={() => router.push('/profile/sponsors')}
          activeOpacity={0.8}
        >
          <View style={styles.sponsorsGrid}>
            <View style={styles.sponsorMini}>
              <Ionicons name="business" size={24} color={colors.primary} />
              <Text style={styles.sponsorMiniText}>MCI</Text>
            </View>
            <View style={styles.sponsorMini}>
              <Ionicons name="business" size={24} color={colors.primary} />
              <Text style={styles.sponsorMiniText}>interact!</Text>
            </View>
            <View style={styles.sponsorMini}>
              <Ionicons name="business" size={24} color={colors.primary} />
              <Text style={styles.sponsorMiniText}>Carrera</Text>
            </View>
            <View style={styles.sponsorMini}>
              <Ionicons name="business" size={24} color={colors.primary} />
              <Text style={styles.sponsorMiniText}>Wiener Städtische</Text>
            </View>
          </View>
          <View style={styles.sponsorsFooter}>
            <Text style={styles.sponsorsFooterText}>Alle Sponsoren anzeigen</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: colors.text, flex: 1 },
  notificationButton: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.secondary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.text, fontSize: 12, fontWeight: 'bold' },

  section: { padding: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textTransform: 'uppercase',
  },

  eventCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  eventTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text },
  eventDate: { fontSize: 16, color: colors.textSecondary, marginBottom: 16 },

  eventButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: 'flex-start',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  eventButtonText: { color: colors.buttonPrimaryText, fontSize: 16, fontWeight: 'bold' },

  newsCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  newsTitle: { fontSize: 18, fontWeight: '600', color: colors.text },
  newsDate: { fontSize: 14, color: colors.textSecondary },

  /* ⭐️ NUR SCHNELLZUGRIFF – FINAL ⭐️ */

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },

  quickActionCard: {
    width: '47%',         // 2 nebeneinander
    height: 120,          // klein & kompakt
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + '22',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  quickActionText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',   // horizontal
  },

  streamText: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    letterSpacing: 2,
  },

  sponsorsCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sponsorsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },

  sponsorMini: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
  sponsorMiniText: { color: colors.text, fontSize: 12, fontWeight: '600', marginTop: 8 },

  sponsorsFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sponsorsFooterText: { color: colors.primary, fontSize: 14, fontWeight: '600' },
});
