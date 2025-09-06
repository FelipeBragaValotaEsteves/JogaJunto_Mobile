import { MainContainer } from "@/components/shared/MainContainer";
import { MatchCard } from "@/components/shared/MatchCard";
import { NoResults } from "@/components/shared/NoResults"; // Import NoResults component
import { TitlePageIndex } from "@/components/shared/TitlePage";
import BASE_URL from "@/constants/config";
import typography from "@/constants/typography";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import styled from "styled-components/native";
import { authHeaders } from '../../utils/authHeaders';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("jogador");
  const [matches, setMatches] = useState<{ data: string; hora_inicio: string; local: string }[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {

      setLoading(true);
      try {
        const matches = await getNearbyMatches();
        
        setMatches(matches);
      } catch (error) {

      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  async function getNearbyMatches() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setMatches([]);
      return [];
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;

    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude });
    const city = geocode[0]?.city;

    if (!city) {
      setMatches([]);
      return [];
    }

    const headers = await authHeaders();
    
    const response = await fetch(`${BASE_URL}/partidas/proximas/${city}`, {
      headers,
    });
    
    return await response.json();
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MainContainer style={{ paddingTop: 120 }}>
      <TitlePageIndex>Histórico</TitlePageIndex>

      <HistoryGrid>
        <HistoryTouchable onPress={() => router.push("/(tabs)/playedMatches")}>
          <HistoryCard>
            <HistoryImage
              source={require("../../assets/images/jogadas.jpg")}
              resizeMode="cover"
            />
            <HistoryLabel style={typography["txt-1"]}>
              Horários{"\n"}Jogados
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
              Horários{"\n"}Criados
            </HistoryLabel>
          </HistoryCard>
        </HistoryTouchable>
      </HistoryGrid>

      <TitlePageIndex style={{ marginTop: 24, marginBottom: 18 }}>
        Horários próximos a você
      </TitlePageIndex>

      {Array.isArray(matches) && matches.length > 0 ? (
        matches.map((match, index) => (
          <MatchCard
            key={index}
            date={match.data.split('T')[0]}
            hour={match.hora_inicio.slice(0, 5)}
            location={match.local}
            buttonLabel="PARTICIPAR"
            onPress={() => console.log(`Participar no ${match.local}`)}
          />
        ))
      ) : (
        <NoResults message={
          matches.length === 0
            ? "Não foi encontrado nenhum horário próximo a você!"
            : "Por favor, permita o acesso à sua localização para encontrar horários próximos."
        } />
      )}
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

