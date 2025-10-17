import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData extends Record<string, unknown> {
  type: 'invite' | 'match' | 'game' | 'profile' | 'notifications';
  matchId?: string | number;
  gameId?: string | number;
  title?: string;
}

export const useNotifications = () => {
  const router = useRouter();
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Falha ao obter token de push notification!');
      return;
    }

    try {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push notification token:', token);
      
      
    } catch (error) {
      console.log('Erro ao obter token:', error);
    }

    return token;
  };

  
  useEffect(() => {
    
    const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data as unknown as NotificationData;
      
      console.log('Notificação recebida com dados:', data);
      
      
      if (data?.type) {
        switch (data.type) {
          case 'invite':
            
            router.push('/(tabs)/invites');
            break;
          case 'match':
            
            if (data.matchId) {
              router.push({
                pathname: '/(tabs)/matchDetails',
                params: { id: String(data.matchId) }
              });
            }
            break;
          case 'game':
            
            if (data.gameId && data.matchId) {
              router.push({
                pathname: '/(tabs)/gameDetails',
                params: { 
                  id: String(data.matchId),
                  idGame: String(data.gameId),
                  title: String(data.title || 'Detalhes do Jogo')
                }
              });
            }
            break;
          case 'profile':
            
            router.push('/(tabs)/perfil');
            break;
          case 'notifications':
            
            router.push('/(tabs)/notifications');
            break;
          default:
            
            console.log('Tipo de notificação não reconhecido:', data.type);
            break;
        }
      }
    };

    
    registerForPushNotificationsAsync();

    
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notificação recebida!', notification);
    });

    
    responseListener.current = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [router]);

  
  const scheduleLocalNotification = async (title: string, body: string, data?: NotificationData) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: { seconds: 1 } as Notifications.TimeIntervalTriggerInput,
    });
  };

  
  const cancelAllNotifications = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return {
    registerForPushNotificationsAsync,
    scheduleLocalNotification,
    cancelAllNotifications,
  };
};