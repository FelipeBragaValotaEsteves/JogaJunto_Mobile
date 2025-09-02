import { BackButtonTab } from '@/components/shared/BackButton';
import { MainContainer } from "@/components/shared/MainContainer";
import { MatchCard } from "@/components/shared/MatchCard";
import { TitlePageTabs } from "@/components/shared/TitlePage";
import { useFocusEffect, useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";

import { NoResults } from "@/components/shared/NoResults";
import React, { useCallback, useState } from "react";
import styled from "styled-components/native";
import BASE_URL from "../../constants/config";
import { authHeaders, getUserId } from '../../utils/authHeaders';

type Match = {
  id: string;
  datahora_inicio: string;
  local: string;
};

export default function PlayedMatchesScreen() {
  const router = useRouter();
  const [playedMatches, setPlayedMatches] = useState<Match[]>([]);

  const loadData = useCallback(async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }
      const matches = await fetchPlayedMatches(userId);
      setPlayedMatches(matches);
    } catch (error) {
      console.error("Erro ao carregar partidas jogadas:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  async function fetchPlayedMatches(userId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${BASE_URL}/partidas/jogada/${userId}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar partidas jogadas");
    }

    return await response.json();
  }

  return (
    <MainContainer>
      <TopButtonsContainer>
        <BackButtonTab onPress={() => router.back()} >
          <CircleArrowLeft color="#2B6AE3" size={50} />
        </BackButtonTab>
      </TopButtonsContainer>

      <TitlePageTabs>Partidas Jogadas</TitlePageTabs>

      {playedMatches.length === 0 ? (
        <NoResults message="Nenhuma partida jogada encontrada." />
      ) : (
        playedMatches.map((match, index) => {
          const time = match.datahora_inicio.split('T')[1].split(':');
          return (
            <MatchCard
              key={index}
              date={match.datahora_inicio}
              hour={`${time[0]}:${time[1]}`}
              location={match.local}
              buttonLabel="VISUALIZAR"
              onPress={() => router.push({ pathname: '/(tabs)/matchDetails', params: { id: match.id, source: 'playedMatches' } })} 
            />
          );
        })
      )}
    </MainContainer>
  );
}

const TopButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10;
  margin-bottom: 10;
`;