import { BackButtonTab } from '@/components/shared/BackButton';
import { MainContainer } from "@/components/shared/MainContainer";
import { TitlePageTabs } from "@/components/shared/TitlePage";
import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";

import { NoResults } from "@/components/shared/NoResults";
import { NotificationCard } from "@/components/shared/NotificationCard";
import React, { useState } from "react";
import styled from "styled-components/native";

type Notification = {
  title: string;
  description: string;
  date: string;
  hour: string;
};

export default function NotificationsScreen() {
  const router = useRouter();

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      title: "Campo do ABC",
      date: "Segunda, 26 Maio",
      hour: "18:00",
      description: "Você foi convidado para jogar no Campo do ABC às 18:00.",
    },
    {
      title: "Treino no Parque",
      date: "Terça, 27 Maio",
      hour: "19:00",
      description: "Participe do treino no Parque às 19:00.",
    },
  ]);

  return (
    <MainContainer>
      <TopButtonsContainer>
        <BackButtonTab onPress={() => router.back()} >
          <CircleArrowLeft color="#2B6AE3" size={50} />
        </BackButtonTab>
      </TopButtonsContainer>

      <TitlePageTabs>Notificações</TitlePageTabs>

      {notifications.length === 0 ? (
        <NoResults message="Nenhuma notificação encontrada." />
      ) : (
        notifications.map((notification, index) => (
          <NotificationCard
            key={index}
            message={notification.description}
            onPress={() => console.log(`Ir para: ${notification.title}`)}
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