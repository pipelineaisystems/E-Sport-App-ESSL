import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '../contexts/AuthContext';
// import { NotificationProvider } from '../contexts/NotificationContext';
import { colors } from '../constants/colors';

export default function RootLayout() {
  useEffect(() => {
    // Ensure gesture handler is initialized
    if (typeof global.HermesInternal === 'undefined') {
      console.log('Hermes is not enabled');
    }
  }, []);

  return (
    <AuthProvider>
      {/* <NotificationProvider> */}
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: 'Login' }} />
          <Stack.Screen name="register" options={{ title: 'Registrieren' }} />
        </Stack>
      {/* </NotificationProvider> */}
    </AuthProvider>
  );
}

