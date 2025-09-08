import { BackButtonTab } from '@/components/shared/BackButton';
import { MainContainer } from "@/components/shared/MainContainer";
import { TitlePageTabs } from "@/components/shared/TitlePage";
import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";

import { InviteCard } from "@/components/shared/InviteCard";
import { NoResults } from "@/components/shared/NoResults";
import React, { useState } from "react";
import styled from "styled-components/native";

type Notification = {
    title: string;
    description: string;
    date: string;
    hour: string;
};

export default function InvitesScreen() {
    const router = useRouter();

    const [Invites, setInvites] = useState<Notification[]>([
        {
            title: "Campo do ABC",
            date: "Segunda, 26 Maio",
            hour: "18:00",
            description: "Campo do ABC",
        },
        {
            title: "Campo do ABC",
            date: "Segunda, 26 Maio",
            hour: "18:00",
            description: "Campo do ABC",
        },
    ]);

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => router.back()} >
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
            </TopButtonsContainer>

            <TitlePageTabs>Convites</TitlePageTabs>

            {Invites.length === 0 ? (
                <NoResults message="Nenhum convite encontrado." />
            ) : (
                Invites.map((notification, index) => (
                    <InviteCard
                        key={index}
                        date={notification.date}
                        hour={notification.hour}
                        location={notification.title}
                        acceptLabel="ACEITAR"
                        rejectLabel="RECUSAR"
                        onAccept={() => console.log(`Convite aceito: ${notification.title}`)}
                        onReject={() => console.log(`Convite recusado: ${notification.title}`)}
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