import React, { createContext, useState, useContext, useEffect } from 'react';
// import * as Notifications from 'expo-notifications';
import { api } from '../services/api';

// Benachrichtigungen deaktiviert
/* Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
}); */

const NotificationContext = createContext({});

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState(null);

  useEffect(() => {
    // Benachrichtigungen deaktiviert
    // registerForPushNotifications();
    // loadNotifications();
    // setupNotificationListener();
  }, []);

  const registerForPushNotifications = async () => {
    // Benachrichtigungen deaktiviert
    return;
    /* try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-project-id-here', // TODO: Setze deine EAS Project ID hier ein
      });
      setExpoPushToken(token.data);
      
      // Send token to backend
      await api.post('/notifications/register-token', { token: token.data });
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    } */
  };

  const loadNotifications = async () => {
    // Benachrichtigungen deaktiviert
    return;
    /* try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } */
  };

  const setupNotificationListener = () => {
    // Benachrichtigungen deaktiviert
    return;
    /* Notifications.addNotificationReceivedListener((notification) => {
      setNotifications((prev) => [notification.request.content, ...prev]);
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      // Handle notification tap
      console.log('Notification tapped:', response);
    }); */
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        expoPushToken,
        markAsRead,
        markAllAsRead,
        refreshNotifications: loadNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

