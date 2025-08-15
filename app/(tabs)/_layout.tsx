import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Bell, CircleEqualIcon, Home, User } from "lucide-react-native";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LogoJogaJunto from "../../assets/images/logo-white-small.svg";
import FabButton from "../../components/FabButton";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12);
  const fabBottom = bottom + 24;

  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#2B2B2B",
        tabBarStyle: {
          height: 68,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
        },
        tabBarBackground: () => (
          <View style={{ flex: 1 }}>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 24,
                right: 24,
                height: 2,
                backgroundColor: "rgba(0,0,0,0.04)",
              }}
            />
            <View style={{ flex: 1, backgroundColor: "#F5F7FA" }} />
          </View>
        ),
      }}
      tabBar={(props) => (
        <>
          <BottomTabBar {...props} />
          <FabButton onPress={() => props.navigation.navigate("match" as never)} bottom={fabBottom} />
        </>
      )}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={26} />,
        }}
      />
      <Tabs.Screen
        name="match"
        options={{
          tabBarButton: () => null,
          tabBarIcon: () => null,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={26} />,
        }}
      />
    </Tabs>
  );
}

function CustomHeader() {
  return (
    <View
      style={{
        height: 110,
        paddingHorizontal: 20,
        paddingTop: 40,
        backgroundColor: "#3b82f6",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <LogoJogaJunto height={56} />
      <View style={{ flexDirection: "row", gap: 20 }}>
        <Bell color="white" size={28} />
        <CircleEqualIcon color="white" size={28} />
      </View>
    </View>
  );
}
