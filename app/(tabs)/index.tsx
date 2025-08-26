import { MainContainer } from "@/components/shared/MainContainer";
import { MatchCard } from "@/components/shared/MatchCard";
import { TitlePageIndex } from "@/components/shared/TitlePage";
import typography from "@/constants/typography";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("jogador");

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MainContainer>
      <TitlePageIndex>
        Bem vindo jogador, {username}!
      </TitlePageIndex>

      <TitlePageIndex>Histórico</TitlePageIndex>

      <HistoryGrid>
        <HistoryTouchable onPress={() => router.push("/(tabs)/playedMatches")}>
          <HistoryCard>
            <HistoryImage
              source={require("../../assets/images/jogadas.jpg")}
              resizeMode="cover"
            />
            <HistoryLabel style={typography["txt-1"]}>
              Partidas{"\n"}Jogadas
            </HistoryLabel>
          </HistoryCard>
        </HistoryTouchable>

        <HistoryTouchable onPress={() => router.push("/(tabs)/createdMatches")}>
          <HistoryCard>
            <HistoryImage
              source={require("../../assets/images/criadas.jpg")}
              resizeMode="cover"
            />
            <HistoryLabel style={typography["txt-1"]}>
              Partidas{"\n"}Criadas
            </HistoryLabel>
          </HistoryCard>
        </HistoryTouchable>
      </HistoryGrid>

      <TitlePageIndex>
        Jogos próximos a você
      </TitlePageIndex>

      <MatchCard
        date="Segunda, 26 Maio"
        hour="18:00"
        location="Campo do ABC"
        buttonLabel="PARTICIPAR"
        onPress={() => console.log("Participar no Campo do ABC")}
      />

      <MatchCard
        date="Quarta, 28 Maio"
        hour="20:00"
        location="Quadra do XYZ"
        buttonLabel="PARTICIPAR"
        onPress={() => console.log("Participar na Quadra do XYZ")}
      />
    </MainContainer>
  );
}

const HistoryGrid = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

const HistoryTouchable = styled.TouchableOpacity`
  width: 48%;
`;

const HistoryCard = styled.ImageBackground`
  width: 100%;
  height: 170px;
  border-radius: 32px;
  overflow: hidden;
  position: relative;
  margin-bottom: 20px;
`;

const HistoryLabel = styled.Text`
  position: absolute;
  bottom: 14px;
  left: 14px;
  right: 14px;
  color: #fff;
  text-align: left;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.35);
`;

const HistoryImage = styled.Image`
  width: 100%;
  height: 100%;
`;

