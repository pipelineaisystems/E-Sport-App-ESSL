import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function BrowseTeamsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team Alpha', school: 'HTL Innsbruck', game: 'Valorant', members: 3, maxMembers: 5 },
    { id: 2, name: 'Team Beta', school: 'MCI', game: 'Clash Royale', members: 4, maxMembers: 5 },
    { id: 3, name: 'Team Gamma', school: 'HTL Salzburg', game: 'Rocket League', members: 2, maxMembers: 5 },
  ]);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.school.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleJoin = (teamId) => {
    // TODO: API Call
    alert(`Team beitreten: ${teamId}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Team beitreten</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Team oder Schule suchen..."
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.teamCard} onPress={() => handleJoin(item.id)}>
            <View style={styles.teamHeader}>
              <Text style={styles.teamName}>{item.name}</Text>
              <View style={styles.membersBadge}>
                <Ionicons name="people" size={16} color={colors.primary} />
                <Text style={styles.membersText}>{item.members}/{item.maxMembers}</Text>
              </View>
            </View>
            <View style={styles.teamInfo}>
              <Ionicons name="school" size={16} color={colors.textSecondary} />
              <Text style={styles.teamSchool}>{item.school}</Text>
            </View>
            <View style={styles.teamInfo}>
              <Ionicons name="game-controller" size={16} color={colors.textSecondary} />
              <Text style={styles.teamGame}>{item.game}</Text>
            </View>
            <TouchableOpacity style={styles.joinButton} onPress={() => handleJoin(item.id)}>
              <Text style={styles.joinButtonText}>Beitreten</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>Keine Teams gefunden</Text>
          </View>
        }
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 16,
    color: colors.text,
    fontSize: 16,
  },
  list: {
    padding: 20,
    paddingTop: 0,
  },
  teamCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  membersBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  membersText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  teamSchool: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  teamGame: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  joinButton: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  joinButtonText: {
    color: colors.buttonPrimaryText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 16,
    marginTop: 16,
  },
});


