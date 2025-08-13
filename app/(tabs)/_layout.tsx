import { Tabs } from "expo-router";
import { Bell, CircleEqualIcon, Home, PlusCircle, User } from "lucide-react-native";
import { View } from "react-native";
import LogoJogaJunto from "../../assets/images/logo-white-small.svg";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarIconStyle: {
          marginTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="criar"
        options={{
          tabBarIcon: () => (
            <View
              style={{
                backgroundColor: "#22c55e",
                borderRadius: 50,
                padding: 10,
              }}
            >
              <PlusCircle color="white" size={28} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color }) => <User color={color} size={24} />,
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
