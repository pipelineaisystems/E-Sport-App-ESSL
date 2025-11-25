import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../services/api';
import { useState, useEffect, useRef } from 'react';
import { colors } from '../../constants/colors';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [medals, setMedals] = useState([]);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    loadProfileData();
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadProfileData = async () => {
    try {
      const [statsResponse, medalsResponse] = await Promise.all([
        api.get('/users/stats'),
        api.get('/users/medals'),
      ]);
      setStats(statsResponse.data);
      setMedals(medalsResponse.data);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        </View>
        <Text style={styles.username}>{user?.username || 'Spieler'}</Text>
        <Text style={styles.role}>{user?.role === 'captain' ? 'Team Captain' : 'Spieler'}</Text>
      </Animated.View>

      {stats && (
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Statistiken</Text>
          <View style={styles.statsGrid}>
            <Animated.View
              style={[
                styles.statCard,
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
              <Text style={styles.statValue}>{stats.matchesPlayed}</Text>
              <Text style={styles.statLabel}>Spiele</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.statCard,
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
              <Text style={styles.statValue}>{stats.wins}</Text>
              <Text style={styles.statLabel}>Siege</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.statCard,
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
              <Text style={styles.statValue}>{stats.losses}</Text>
              <Text style={styles.statLabel}>Niederlagen</Text>
            </Animated.View>
            <Animated.View
              style={[
                styles.statCard,
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
              <Text style={styles.statValue}>{stats.winRate}%</Text>
              <Text style={styles.statLabel}>Winrate</Text>
            </Animated.View>
          </View>
        </Animated.View>
      )}

      {medals.length > 0 && (
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Medaillen & Erfolge</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {medals.map((medal, index) => (
              <Animated.View
                key={medal.id}
                style={[
                  styles.medalCard,
                  {
                    opacity: fadeAnim,
                    transform: [
                      {
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons name="trophy" size={32} color={colors.primary} />
                <Text style={styles.medalName}>{medal.name}</Text>
                <Text style={styles.medalDate}>{medal.earnedDate}</Text>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Einstellungen</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/profile/edit')}
          activeOpacity={0.7}
        >
          <Ionicons name="person" size={24} color={colors.text} />
          <Text style={styles.menuText}>Profil bearbeiten</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/profile/riot-connect')}
          activeOpacity={0.7}
        >
          <Ionicons name="link" size={24} color={colors.text} />
          <Text style={styles.menuText}>Riot Account verbinden</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/profile/notifications')}
          activeOpacity={0.7}
        >
          <Ionicons name="notifications" size={24} color={colors.text} />
          <Text style={styles.menuText}>Benachrichtigungen</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/profile/sponsors')}
          activeOpacity={0.7}
        >
          <Ionicons name="business" size={24} color={colors.text} />
          <Text style={styles.menuText}>Sponsoren</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/rules')}
          activeOpacity={0.7}
        >
          <Ionicons name="document-text" size={24} color={colors.text} />
          <Text style={styles.menuText}>Regelwerk</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push('/support')}
          activeOpacity={0.7}
        >
          <Ionicons name="help-circle" size={24} color={colors.text} />
          <Text style={styles.menuText}>Support</Text>
          <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
        </TouchableOpacity>
      </Animated.View>

      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutText}>Abmelden</Text>
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    padding: 40,
    paddingTop: 60,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.buttonPrimaryText,
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  medalCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  medalName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  medalDate: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
