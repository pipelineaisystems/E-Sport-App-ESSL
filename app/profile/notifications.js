import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

export default function NotificationsScreen() {
  const router = useRouter();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [tournamentEnabled, setTournamentEnabled] = useState(true);
  const [matchEnabled, setMatchEnabled] = useState(true);
  const [newsEnabled, setNewsEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Benachrichtigungen</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Allgemein</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="notifications" size={24} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push-Benachrichtigungen</Text>
                <Text style={styles.settingSubtitle}>Erhalte Benachrichtigungen auf deinem Gerät</Text>
              </View>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.border || '#333333', true: colors.primary || '#8b5cf6' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="mail" size={24} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>E-Mail Benachrichtigungen</Text>
                <Text style={styles.settingSubtitle}>Erhalte wichtige Updates per E-Mail</Text>
              </View>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: colors.border || '#333333', true: colors.primary || '#8b5cf6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Turniere</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="trophy" size={24} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Turnier-Updates</Text>
                <Text style={styles.settingSubtitle}>Neue Turniere und Anmeldungen</Text>
              </View>
            </View>
            <Switch
              value={tournamentEnabled}
              onValueChange={setTournamentEnabled}
              trackColor={{ false: colors.border || '#333333', true: colors.primary || '#8b5cf6' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Spielzeiten</Text>
                <Text style={styles.settingSubtitle}>Erinnerungen an bevorstehende Matches</Text>
              </View>
            </View>
            <Switch
              value={matchEnabled}
              onValueChange={setMatchEnabled}
              trackColor={{ false: colors.border || '#333333', true: colors.primary || '#8b5cf6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>News</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Ionicons name="newspaper" size={24} color={colors.primary} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>News & Updates</Text>
                <Text style={styles.settingSubtitle}>Aktuelle Nachrichten und Events</Text>
              </View>
            </View>
            <Switch
              value={newsEnabled}
              onValueChange={setNewsEnabled}
              trackColor={{ false: colors.border || '#333333', true: colors.primary || '#8b5cf6' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>
      </ScrollView>
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
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

