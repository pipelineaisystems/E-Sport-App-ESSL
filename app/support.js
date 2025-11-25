import { View, Text, StyleSheet } from 'react-native';
import ChatWidget from '../components/ChatWidget';
import { colors } from '../constants/colors';

export default function SupportScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Support</Text>
        <Text style={styles.subtitle}>Unser Chatbot hilft dir gerne weiter</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.infoText}>
          Klicke auf den Chat-Button unten rechts, um mit unserem Support-Chatbot zu sprechen.
        </Text>
      </View>
      <ChatWidget
        webhookUrl="https://your-webhook-url.com/api/chat"
        webhookRoute="/essl-support"
        logo=""
        name="ESSL Support"
        welcomeText="Willkommen beim ESSL Support"
        responseTimeText="Sofort verfügbar"
        primaryColor={colors.primary}
        secondaryColor={colors.primary}
        position="right"
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
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  infoText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

