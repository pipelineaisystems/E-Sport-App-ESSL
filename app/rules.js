import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { useState } from 'react';
import { Animated } from 'react-native';

export default function RulesScreen() {
  const router = useRouter();
  const [expandedSections, setExpandedSections] = useState({});
  const fadeAnim = new Animated.Value(1);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const rules = [
    {
      id: 'general',
      title: 'Allgemeine Regeln',
      icon: 'document-text',
      content: `1. Fair Play ist oberstes Gebot
2. Respektvoller Umgang mit Gegnern und Teammitgliedern
3. Keine Cheats, Hacks oder unerlaubte Modifikationen
4. Pünktlichkeit bei Matches ist Pflicht
5. Kommunikation über offizielle Kanäle`,
    },
    {
      id: 'tournaments',
      title: 'Turnier-Regeln',
      icon: 'trophy',
      content: `1. Anmeldung bis 24h vor Turnierstart
2. Mindestens 4 Spieler pro Team erforderlich
3. Ersatzspieler müssen vorher registriert sein
4. Disqualifikation bei No-Show
5. Proteste innerhalb von 15 Minuten nach Match`,
    },
    {
      id: 'matches',
      title: 'Match-Regeln',
      icon: 'game-controller',
      content: `1. Best of 3 Format (außer Finale: Best of 5)
2. Server-Auswahl: Coinflip
3. Pause-Regel: Max. 5 Minuten pro Match
4. Screenshots von Ergebnissen erforderlich
5. Stream-Delay: Mindestens 2 Minuten`,
    },
    {
      id: 'behavior',
      title: 'Verhaltensregeln',
      icon: 'people',
      content: `1. Keine Beleidigungen oder Toxizität
2. Keine Diskriminierung jeglicher Art
3. Respekt gegenüber Admins und Schiedsrichtern
4. Konstruktive Kritik ist erwünscht
5. Verstöße führen zu Warnungen oder Banns`,
    },
    {
      id: 'technical',
      title: 'Technische Regeln',
      icon: 'settings',
      content: `1. Stabile Internetverbindung erforderlich
2. Ping unter 100ms empfohlen
3. Screenshare bei Verdacht auf Cheating
4. Updates vor Turnieren installieren
5. Backup-Plan bei technischen Problemen`,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Regelwerk</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.intro}>
          <Ionicons name="shield-checkmark" size={48} color={colors.primary} />
          <Text style={styles.introTitle}>ESSL Regelwerk</Text>
          <Text style={styles.introText}>
            Diese Regeln gewährleisten faire und respektvolle Wettkämpfe für alle Teilnehmer.
          </Text>
        </View>

        {rules.map((rule, index) => (
          <Animated.View
            key={rule.id}
            style={[
              styles.ruleCard,
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
            <TouchableOpacity
              style={styles.ruleHeader}
              onPress={() => toggleSection(rule.id)}
              activeOpacity={0.7}
            >
              <View style={styles.ruleHeaderLeft}>
                <View style={[styles.ruleIcon, { backgroundColor: colors.primary + '20' }]}>
                  <Ionicons name={rule.icon} size={24} color={colors.primary} />
                </View>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
              </View>
              <Ionicons
                name={expandedSections[rule.id] ? 'chevron-up' : 'chevron-down'}
                size={24}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
            {expandedSections[rule.id] && (
              <View style={styles.ruleContent}>
                <Text style={styles.ruleText}>{rule.content}</Text>
              </View>
            )}
          </Animated.View>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bei Fragen zu den Regeln kontaktiere bitte unseren Support.
          </Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={() => router.push('/support')}
          >
            <Ionicons name="help-circle" size={20} color="#ffffff" />
            <Text style={styles.supportButtonText}>Support kontaktieren</Text>
          </TouchableOpacity>
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
  contentContainer: {
    padding: 20,
    paddingTop: 0,
  },
  intro: {
    alignItems: 'center',
    marginBottom: 32,
    padding: 24,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  ruleCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  ruleHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  ruleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ruleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  ruleContent: {
    padding: 16,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  ruleText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  supportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  supportButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
