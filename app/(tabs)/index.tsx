import { Loading } from "@/components/shared/Loading";
import { MainContainer } from "@/components/shared/MainContainer";
import { MatchCard } from "@/components/shared/MatchCard";
import { NoResults } from "@/components/shared/NoResults";
import { TitlePageIndex } from "@/components/shared/TitlePage";
import BASE_URL from "@/constants/config";
import typography from "@/constants/typography";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { authHeaders } from '../../utils/authHeaders';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState<{ id: number; data: string; hora_inicio: string; local: string }[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {

      setLoading(true);
      try {
        const matches = await getLastMatches();

        setMatches(matches);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  async function getLastMatches() {

    const headers = await authHeaders();

    const response = await fetch(`${BASE_URL}/partidas/resumo/jogada`, {
      headers,
    });

    return await response.json();
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <MainContainer style={{ paddingTop: 120 }}>
      <TitlePageIndex>Histórico</TitlePageIndex>

      <HistoryGrid>
        <HistoryTouchable onPress={() => router.push({
          pathname: "/(tabs)/playedMatches",
          params: { from: "index" }
        })}>
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

        <HistoryTouchable onPress={() => router.push({
          pathname: "/(tabs)/createdMatches",
          params: { from: "index" }
        })}>
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
        Últimos horários jogados
      </TitlePageIndex>

      {Array.isArray(matches) && matches.length > 0 ? (
        matches.map((match, index) => (
          <MatchCard
            key={index}
            date={match.data.split('T')[0]}
            hour={match.hora_inicio.slice(0, 5)}
            location={match.local}
            buttonLabel="VISUALIZAR"
            onPress={() => router.push({
              pathname: "/(tabs)/matchDetails",
              params: { id: match.id.toString(), source: "index" }
            })}
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

