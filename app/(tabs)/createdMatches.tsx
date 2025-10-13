import { BackButtonTab } from '@/components/shared/BackButton';
import { MainContainer } from "@/components/shared/MainContainer";
import { MatchCard } from "@/components/shared/MatchCard";
import { TitlePageTabs } from "@/components/shared/TitlePage";
import { useFocusEffect, useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";

import { NoResults } from "@/components/shared/NoResults";
import React, { useCallback, useState } from "react";
import { styled } from "styled-components/native";
import BASE_URL from "../../constants/config";
import { authHeaders, getUserId } from '../../utils/authHeaders';

type Match = {
  id: string;
  hora_inicio: string;
  data: string;
  local: string;
  status: string;
};

export default function CreatedMatchesScreen() {
  const router = useRouter();
  const [createdMatches, setCreatedMatches] = useState<Match[]>([]);

  const loadData = useCallback(async () => {
    try {
      const userId = await getUserId();
      if (!userId) {
        throw new Error('ID do usuário não encontrado');
      }
      const matches = await fetchCreatedMatches(userId);
      setCreatedMatches(matches);
    } catch (error) {
      console.error("Erro ao carregar partidas criadas:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  async function fetchCreatedMatches(userId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${BASE_URL}/partidas/criada/${userId}`, {
      headers,
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar partidas criadas");
    }

    return await response.json();
  }

  return (
    <MainContainer>
      <TopButtonsContainer>
        <BackButtonTab>
          <CircleArrowLeft color="#2B6AE3" size={50} />
        </BackButtonTab>
      </TopButtonsContainer>

      <TitlePageTabs>Horários Criados</TitlePageTabs>

      {createdMatches.length === 0 ? (
        <NoResults message="Nenhuma partida criada encontrada." />
      ) : (
        createdMatches.map((match, index) => {
          const [date] = match.data.split('T');
          const isCanceled = match.status === 'cancelada';

          return (
            <MatchCard
              key={index}
              date={date}
              hour={match.hora_inicio.slice(0, 5)}
              location={match.local}
              buttonLabel={isCanceled ? "CANCELADA" : "VISUALIZAR"}
              onPress={isCanceled ? undefined : () => router.push({ pathname: '/(tabs)/matchDetails', params: { id: match.id, source: 'createdMatches' } })}
              isCanceled={isCanceled}
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
  margin-top: 10px;
  margin-bottom: 10px;
`;