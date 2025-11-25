import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { Animated } from 'react-native';

export default function ChatWidget({ webhookUrl, webhookRoute, logo, name, welcomeText, responseTimeText, primaryColor, secondaryColor, position }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const primary = primaryColor || colors.primary;
  const secondary = secondaryColor || colors.primary;
  const pos = position || 'right';

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isOpen]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const generateSessionId = () => {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const parseMarkdown = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/\n/g, '\n');
  };

  const startNewConversation = async () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setHasStarted(true);
    setIsTyping(true);

    const data = [{
      action: 'loadPreviousSession',
      sessionId: newSessionId,
      route: webhookRoute,
      metadata: { userId: '', isNewSession: true },
    }];

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setIsTyping(false);
      const botMessage = Array.isArray(json) ? json[0].output : json.output;
      setMessages([{ id: Date.now().toString(), text: botMessage, isUser: false }]);
    } catch (e) {
      console.error('Chat init error:', e);
      setIsTyping(false);
      setMessages([{ id: Date.now().toString(), text: 'Willkommen! Wie kann ich dir helfen?', isUser: false }]);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { id: Date.now().toString(), text: inputValue, isUser: true };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    const data = {
      action: 'sendMessage',
      sessionId,
      route: webhookRoute,
      chatInput: userMessage.text,
      metadata: { companyName: 'ESSL', isNewSession: false },
    };

    try {
      const res = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      setIsTyping(false);
      const botMessage = Array.isArray(json) ? json[0].output : json.output;
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: botMessage, isUser: false }]);
    } catch (e) {
      console.error('Send error:', e);
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: Date.now().toString(), text: 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.', isUser: false }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.nativeEvent.key === 'Enter' && !e.nativeEvent.shiftKey) {
      sendMessage();
    }
  };

  const positionStyle = pos === 'left' ? { left: 20 } : { right: 20 };

  return (
    <>
      {/* Floating Button */}
      <Animated.View style={[styles.floatingButton, positionStyle, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity
          onPress={() => setIsOpen(true)}
          activeOpacity={0.8}
          style={[styles.floatingButtonInner, { backgroundColor: primary }]}
        >
          <Ionicons name="chatbubbles" size={28} color="#ffffff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Chat Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsOpen(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <Animated.View style={[styles.chatContainer, { opacity: fadeAnim }]}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.backgroundSecondary }]}>
              <View style={styles.headerLeft}>
                {logo ? (
                  <Animated.Image
                    source={{ uri: logo }}
                    style={[styles.logo, { transform: [{ rotate: '15deg' }] }]}
                  />
                ) : (
                  <Ionicons name="chatbubble-ellipses" size={24} color={primary} />
                )}
                <View style={styles.headerText}>
                  <Text style={styles.headerTitle}>{name || 'ESSL Support'}</Text>
                  <Text style={styles.headerSubtitle}>{responseTimeText || 'Sofort verfügbar'}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Welcome Screen */}
            {!hasStarted && (
              <View style={styles.welcomeContainer}>
                <Animated.View
                  style={[
                    styles.welcomeIcon,
                    {
                      backgroundColor: primary + '20',
                      transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }],
                    },
                  ]}
                >
                  <Ionicons name="sparkles" size={48} color={primary} />
                </Animated.View>
                <Text style={styles.welcomeTitle}>{welcomeText || 'Willkommen beim ESSL Support'}</Text>
                <Text style={styles.welcomeSubtitle}>Pipeline AI Chatbot – sofort bereit.</Text>
                <TouchableOpacity
                  style={[styles.startButton, { backgroundColor: primary }]}
                  onPress={startNewConversation}
                  activeOpacity={0.8}
                >
                  <Ionicons name="chatbubble" size={20} color="#ffffff" />
                  <Text style={styles.startButtonText}>Chat starten</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Chat Messages */}
            {hasStarted && (
              <>
                <ScrollView
                  ref={scrollViewRef}
                  style={styles.messagesContainer}
                  contentContainerStyle={styles.messagesContent}
                >
                  {messages.map((m, index) => (
                    <Animated.View
                      key={m.id}
                      style={[
                        styles.message,
                        m.isUser ? [styles.userMessage, { backgroundColor: primary }] : styles.botMessage,
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
                      <Text style={m.isUser ? styles.userMessageText : styles.botMessageText}>
                        {parseMarkdown(m.text)}
                      </Text>
                    </Animated.View>
                  ))}
                  {isTyping && (
                    <View style={styles.typingContainer}>
                      {[0, 1, 2].map((i) => (
                        <Animated.View
                          key={i}
                          style={[
                            styles.typingDot,
                            {
                              backgroundColor: primary,
                              opacity: pulseAnim.interpolate({
                                inputRange: [1, 1.1],
                                outputRange: [0.3, 1],
                              }),
                              transform: [
                                {
                                  translateY: pulseAnim.interpolate({
                                    inputRange: [1, 1.1],
                                    outputRange: [0, -8],
                                  }),
                                },
                              ],
                            },
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </ScrollView>

                {/* Input Field */}
                <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary }]}>
                  <TextInput
                    style={[styles.input, { borderColor: primary }]}
                    value={inputValue}
                    onChangeText={setInputValue}
                    placeholder="Nachricht eingeben..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    onSubmitEditing={sendMessage}
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, { backgroundColor: primary }]}
                    onPress={sendMessage}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="send" size={20} color="#ffffff" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    width: 60,
    height: 60,
    zIndex: 1000,
  },
  floatingButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  chatContainer: {
    height: '80%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  welcomeIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 32,
    textAlign: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: colors.backgroundSecondary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userMessageText: {
    color: '#ffffff',
    fontSize: 14,
  },
  botMessageText: {
    color: colors.text,
    fontSize: 14,
  },
  typingContainer: {
    flexDirection: 'row',
    gap: 6,
    padding: 12,
    alignItems: 'center',
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.text,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
