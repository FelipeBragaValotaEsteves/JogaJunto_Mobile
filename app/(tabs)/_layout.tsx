import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs, useRouter, useSegments } from "expo-router";
import { Bell, Home, Mail, User } from "lucide-react-native";
import { Text, View } from "react-native";

import LogoJogaJunto from "../../assets/images/logo-white-small.svg";
import FabButton from "../../components/FabButton";
import typography from "../../constants/typography";

export default function TabsLayout() {
  const segments = useSegments();

  const isIndex = segments.length === 1 && segments[0] === "(tabs)";

  return (
    <Tabs
      screenOptions={{
        header: () => (isIndex ? <CustomHeaderIndex /> : <CustomHeader />),
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#111",
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
                marginTop: 30,
                padding: 20,
                borderRadius: 50,
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
                marginTop: 30,
                padding: 20,
                borderRadius: 1000,
              }}
            >
              <User color={color} size={35} />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="playedMatches"
        options={{ title: "Partidas Jogadas", href: null }}
      />
      <Tabs.Screen
        name="createdMatches"
        options={{ title: "Partidas Criadas", href: null }}
      />

      <Tabs.Screen
        name="notifications"
        options={{ title: "Notificações", href: null }}
      />

      <Tabs.Screen
        name="matchDetails"
        options={{ title: "Detalhes da Partida", href: null }}
      />

      <Tabs.Screen
        name="matchPlayers"
        options={{ title: "Jogadores da Partida", href: null }}
      />

      <Tabs.Screen
        name="matchPlayersAdd"
        options={{ title: "Adicionar Jogador", href: null }}
      />

      <Tabs.Screen
        name="invites"
        options={{ title: "Convites", href: null }}
      />

      <Tabs.Screen
        name="gameDetails"
        options={{ title: "Detalhes do Jogo", href: null }}
      />
    </Tabs>
  );
}

function CustomHeader() {
  const router = useRouter();

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
        <Bell
          color="white"
          size={28}
          onPress={() => router.push("/(tabs)/notifications")}
        />
        <Mail
          color="white"
          size={28}
          onPress={() => router.push("/(tabs)/invites")}
        />
      </View>
    </View>
  );
}

function CustomHeaderIndex() {
  const router = useRouter();

  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          height: 200,
          backgroundColor: "#3b82f6",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: -1,
        }}
      />
      <View
        style={{
          height: 110,
          paddingHorizontal: 20,
          paddingTop: 40,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <LogoJogaJunto height={56} />

        <View style={{ flexDirection: "row", gap: 20 }}>
          <Bell
            color="white"
            size={28}
            onPress={() => router.push("/(tabs)/notifications")}
          />
          <Mail
            color="white"
            size={28}
            onPress={() => router.push("/(tabs)/invites")}
          />
        </View>
      </View>

      <Text
        style={{
          ...typography["txt-1"],
          position: "absolute",
          top: 150,
          left: 20,
          color: "#e2e8f0",
        }}
      >
        Seja bem-vindo, jogador!
      </Text>
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
