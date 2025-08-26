import { BackButtonTab } from '@/components/shared/BackButton';
import { MainContainer } from "@/components/shared/MainContainer";
import { MatchCard } from "@/components/shared/MatchCard";
import { TitlePageTabs } from "@/components/shared/TitlePage";
import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";

import { NoResults } from "@/components/shared/NoResults";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import BASE_URL from "../../constants/config";

type PlayedMatch = {
  date: string;
  hour: string;
  location: string;
};

export default function PlayedMatchesScreen() {
  const router = useRouter();
  const [playedMatches, setPlayedMatches] = useState<PlayedMatch[]>([]);
  const userId = "123";

  useEffect(() => {
    async function loadData() {
      try {
        const matches = await fetchPlayedMatches(userId);
        setPlayedMatches(matches);
      } catch (error) {
        console.error(error);
      }
    }

    loadData();
  }, []);

  async function fetchPlayedMatches(userId: string) {
    const response = await fetch(`${BASE_URL}/matches/played?userId=${userId}`);

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
        playedMatches.map((match, index) => (
          <MatchCard
            key={index}
            date={match.date}
            hour={match.hour}
            location={match.location}
            buttonLabel="VISUALIZAR"
            onPress={() => console.log(`Ver detalhes da partida em ${match.location}`)}
          />
        ))
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