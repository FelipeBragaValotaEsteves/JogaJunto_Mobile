import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import { Bell, CircleEqualIcon, Home, User } from "lucide-react-native";
import { View } from "react-native";

import LogoJogaJunto from "../../assets/images/logo-white-small.svg";
import FabButton from "../../components/FabButton";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#111",
        tabBarInactiveTintColor: "#2B2B2B",
        tabBarStyle: {
          height: 100,
          backgroundColor: "transparent",
          borderTopWidth: 0,
          position: "absolute",
        },
        tabBarBackground: () => <TabBarBackground />,
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: 60,
                padding: 20,
                borderRadius: 1000,
                backgroundColor: focused ? "#b0bec52e" : "transparent",
              }}
            >
              <Home color={color} size={35} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="match"
        options={{
          tabBarButton: (props) => <FabButton {...props} />,
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                marginTop: 60,
                padding: 20,
                borderRadius: 1000,
                backgroundColor: focused ? "#b0bec52e" : "transparent",
              }}
            >
              <User color={color} size={35} />
            </View>
          ),
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

function TabBarBackground() {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          height: 4,
          backgroundColor: "#d6dde0ff",
        }}
      />
      <View style={{ flex: 1, backgroundColor: "#F5F7FA" }} />
    </View>
  );
}
