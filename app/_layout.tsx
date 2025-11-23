import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function AuthGate() {
  const { userToken, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!userToken && !inAuthGroup) {
      router.replace("/login");
      return;
    }

    if (userToken && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [segments, userToken, loading]);

  useEffect(() => {
    if (loading) return;

    function handleNotification(response: Notifications.NotificationResponse) {
      const data: any = response.notification.request.content.data || {};
      const route = data.route as string | undefined;

      if (!route) return;

      if (!userToken) {
        router.replace("/login");
        return;
      }

      router.push(route as any);
    }

    (async () => {
      const lastResponse = await Notifications.getLastNotificationResponseAsync();
      if (lastResponse) {
        handleNotification(lastResponse);
      }
    })();

    const sub = Notifications.addNotificationResponseReceivedListener(handleNotification);

    return () => {
      sub.remove();
    };
  }, [loading, userToken, router]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  const colorScheme = useColorScheme();

  if (!fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthGate />
        </GestureHandlerRootView>
      </AuthProvider>
    </ThemeProvider>
  );
}
