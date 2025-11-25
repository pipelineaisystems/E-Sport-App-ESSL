import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { colors } from '../../constants/colors';

export default function TeamsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [myTeam, setMyTeam] = useState(null);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadTeams();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadTeams = async () => {
    try {
      const [myTeamResponse, availableResponse] = await Promise.all([
        api.get('/teams/my-team'),
        api.get('/teams/available'),
      ]);
      setMyTeam(myTeamResponse.data);
      setAvailableTeams(availableResponse.data);
    } catch (error) {
      console.error('Error loading teams:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTeamMember = (member, isCaptain) => (
    <View key={member.id} style={styles.memberCard}>
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{member.username}</Text>
        {isCaptain && (
          <View style={styles.captainBadge}>
            <Text style={styles.captainText}>Captain</Text>
          </View>
        )}
      </View>
      <Text style={styles.memberRole}>{member.role}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
        <Text style={styles.title}>Teams</Text>
        {!myTeam && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push('/teams/create')}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={24} color={colors.buttonPrimaryText} />
            <Text style={styles.createButtonText}>Team erstellen</Text>
          </TouchableOpacity>
        )}
      </Animated.View>

      {myTeam ? (
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Mein Team</Text>
          <View style={styles.teamCard}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>{myTeam.name}</Text>
              <TouchableOpacity
                onPress={() => router.push(`/teams/${myTeam.id}/edit`)}
                activeOpacity={0.7}
              >
                <Ionicons name="settings" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={styles.teamGame}>{myTeam.game}</Text>
            <Text style={styles.teamMembersTitle}>
              Mitglieder ({myTeam.members.length}/{myTeam.maxMembers})
            </Text>
            {myTeam.members.map((member) =>
              renderTeamMember(member, member.id === myTeam.captainId)
            )}
            {myTeam.members.length < myTeam.maxMembers && (
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={() => router.push(`/teams/${myTeam.id}/invite`)}
                activeOpacity={0.8}
              >
                <Ionicons name="person-add" size={20} color={colors.primary} />
                <Text style={styles.inviteButtonText}>Mitglied einladen</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      ) : (
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <View style={styles.noTeamCard}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.noTeamText}>Du bist noch keinem Team beigetreten</Text>
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => router.push('/teams/browse')}
              activeOpacity={0.8}
            >
              <Text style={styles.joinButtonText}>Team beitreten</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.joinButton,
                {
                  marginTop: 12,
                  backgroundColor: colors.backgroundSecondary,
                  borderWidth: 2,
                  borderColor: colors.primary,
                },
              ]}
              onPress={() => router.push('/teams/create')}
              activeOpacity={0.8}
            >
              <Text style={[styles.joinButtonText, { color: colors.primary }]}>Team erstellen</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
        <Text style={styles.sectionTitle}>Verfügbare Teams</Text>
        {availableTeams.length > 0 ? (
          <FlatList
            data={availableTeams}
            renderItem={({ item, index }) => (
              <Animated.View
                style={{
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  style={styles.availableTeamCard}
                  onPress={() => router.push(`/teams/${item.id}`)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.availableTeamName}>{item.name}</Text>
                  <Text style={styles.availableTeamGame}>{item.game}</Text>
                  <View style={styles.availableTeamInfo}>
                    <Ionicons name="people" size={16} color={colors.textSecondary} />
                    <Text style={styles.availableTeamMembers}>
                      {item.members.length}/{item.maxMembers}
                    </Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        ) : (
          <Text style={styles.emptyText}>Keine verfügbaren Teams</Text>
        )}
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
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
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
  teamCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  teamGame: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 16,
  },
  teamMembersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  memberCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  memberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 16,
    color: colors.text,
  },
  captainBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  captainText: {
    color: colors.buttonPrimaryText,
    fontSize: 10,
    fontWeight: 'bold',
  },
  memberRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 8,
  },
  inviteButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noTeamCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  noTeamText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  joinButton: {
    backgroundColor: colors.buttonPrimary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  joinButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  availableTeamCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  availableTeamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  availableTeamGame: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 8,
  },
  availableTeamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availableTeamMembers: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
