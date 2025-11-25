import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';

const sponsors = [
  {
    id: 1,
    name: 'MCI - Die Unternehmerische Hochschule®',
    url: 'https://www.mci.edu',
    description: 'Management Center Innsbruck',
  },
  {
    id: 2,
    name: 'interact!multimedia',
    url: 'https://www.interactmultimedia.at/',
    description: 'Webagentur St. Pölten & Salzburg',
  },
  {
    id: 3,
    name: 'Carrera',
    url: 'https://carrera-toys.com/de-at',
    description: 'Rennbahn & Spielzeug',
  },
  {
    id: 4,
    name: 'Wiener Städtische',
    url: 'https://www.wienerstaedtische.at/',
    description: 'Versicherung',
  },
  {
    id: 5,
    name: 'LevelUp Salzburg',
    url: 'https://www.levelup-salzburg.at/',
    description: 'Gaming & eSports Event',
  },
];

export default function SponsorsScreen() {
  const router = useRouter();

  const handleSponsorPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert('URL konnte nicht geöffnet werden');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      alert('Fehler beim Öffnen der Website');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Unsere Sponsoren</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.intro}>
          Die ESSL wird unterstützt von folgenden Partnern und Sponsoren:
        </Text>

        {sponsors.map((sponsor) => (
          <TouchableOpacity
            key={sponsor.id}
            style={styles.sponsorCard}
            onPress={() => handleSponsorPress(sponsor.url)}
          >
            <View style={styles.sponsorHeader}>
              <View style={styles.sponsorIcon}>
                <Ionicons name="business" size={32} color={colors.primary} />
              </View>
              <View style={styles.sponsorInfo}>
                <Text style={styles.sponsorName}>{sponsor.name}</Text>
                <Text style={styles.sponsorDescription}>{sponsor.description}</Text>
              </View>
              <Ionicons name="open-outline" size={24} color={colors.textSecondary} />
            </View>
            <View style={styles.sponsorUrl}>
              <Ionicons name="link" size={16} color={colors.primary} />
              <Text style={styles.sponsorUrlText}>{sponsor.url}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Vielen Dank an alle unsere Sponsoren für die Unterstützung!
          </Text>
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
    padding: 20,
  },
  intro: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  sponsorCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sponsorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sponsorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  sponsorInfo: {
    flex: 1,
  },
  sponsorName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  sponsorDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sponsorUrl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sponsorUrlText: {
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});


