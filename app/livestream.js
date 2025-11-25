import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';

export default function LivestreamScreen() {
  const twitchEmbedUrl = 'https://player.twitch.tv/?channel=essl&parent=localhost&muted=false';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>ESSL Livestream</Text>
        <Text style={styles.subtitle}>FOLLOW US ON TWITCH</Text>
      </View>
      
      <View style={styles.streamContainer}>
        <WebView
          source={{ uri: twitchEmbedUrl }}
          style={styles.webview}
          allowsFullscreenVideo={true}
          mediaPlaybackRequiresUserAction={false}
        />
      </View>

      <View style={styles.info}>
        <Ionicons name="information-circle" size={20} color="#00ff00" />
        <Text style={styles.infoText}>
          Der Livestream wird während aktiver Turniere übertragen
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#00ff00',
    fontWeight: '600',
    letterSpacing: 2,
  },
  streamContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
  },
  webview: {
    flex: 1,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
    margin: 20,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#888888',
    marginLeft: 12,
    flex: 1,
  },
});


