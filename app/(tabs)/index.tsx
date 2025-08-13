import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import styled from "styled-components/native";

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [username, setUsername] = useState("jogador");

   const entrar = () => {
        router.navigate("/");
        
    };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Container>
      <Header>
        <WelcomeText>Bem vindo jogador, {username}!</WelcomeText>
      </Header>

      <Content>
        <SectionTitle>Histórico</SectionTitle>

        <HistoryContainer>
          <HistoryBox>
            <HistoryImage source={require("../../assets/images/jogadas.png")} />
            <HistoryLabel>Partidas Jogadas</HistoryLabel>
          </HistoryBox>
          <HistoryBox>
            <HistoryImage source={require("../../assets/images/criadas.png")} />
            <HistoryLabel>Partidas Criadas</HistoryLabel>
          </HistoryBox>
        </HistoryContainer>

        <SectionTitle>Jogos próximos a você</SectionTitle>

        <ScrollView showsVerticalScrollIndicator={false}>
          <GameCard>
            <GameDate>Segunda, 26 Maio</GameDate>
            <GameHour>18:00</GameHour>
            <GameLocation>
              <MapPin size={16} color="#6B7280" />
              <GameLocationText>Campo do ABC</GameLocationText>
            </GameLocation>
            <ParticipateButton>
              <ParticipateText>PARTICIPAR</ParticipateText>
            </ParticipateButton>
          </GameCard>

          <GameCard>
            <GameDate>Quarta, 28 Maio</GameDate>
          </GameCard>
        </ScrollView>
      </Content>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: white;
`;

const Header = styled.View`
  background-color: #3b82f6;
  padding: 60px 20px 20px;
`;

const WelcomeText = styled.Text`
  color: white;
  font-size: 20px;
  font-weight: bold;
`;

const Content = styled.View`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const HistoryContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const HistoryBox = styled.TouchableOpacity`
  width: 48%;
  background-color: #f3f4f6;
  border-radius: 12px;
  overflow: hidden;
`;

const HistoryImage = styled.Image`
  width: 100%;
  height: 100px;
`;

const HistoryLabel = styled.Text`
  text-align: center;
  padding: 8px;
  font-weight: bold;
`;

const GameCard = styled.View`
  background-color: #f9fafb;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
`;

const GameDate = styled.Text`
  font-size: 16px;
  font-weight: bold;
`;

const GameHour = styled.Text`
  font-size: 14px;
  margin-top: 4px;
`;

const GameLocation = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 4px;
`;

const GameLocationText = styled.Text`
  margin-left: 6px;
  color: #6b7280;
`;

const ParticipateButton = styled.TouchableOpacity`
  background-color: #22c55e;
  padding: 10px;
  border-radius: 12px;
  margin-top: 10px;
  align-items: center;
`;

const ParticipateText = styled.Text`
  color: white;
  font-weight: bold;
`;

