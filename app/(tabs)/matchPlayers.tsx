import { BackButtonTab } from '@/components/shared/BackButton';
import { MainContainer } from '@/components/shared/MainContainer';
import PlayerCard from '@/components/shared/PlayerCard';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft, CirclePlus } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';

export default function MatchPlayersScreen() {
    const router = useRouter();
    const { showEditButton } = useLocalSearchParams();
    const [players, setPlayers] = useState<any[]>([]);

    useEffect(() => {
        const mockPlayers = [
            {
                id: 1,
                nome: 'João Silva',
                foto: 'https://randomuser.me/api/portraits/men/1.jpg',
                posicoes: ['Atacante', 'Meio-campo'],
                status: 'Confirmado',
            },
            {
                id: 2,
                nome: 'Carlos Souza',
                foto: 'https://randomuser.me/api/portraits/men/2.jpg',
                posicoes: ['Defensor'],
                status: 'Pendente',
            },
            {
                id: 3,
                nome: 'Ana Pereira',
                foto: 'https://randomuser.me/api/portraits/women/1.jpg',
                posicoes: ['Goleiro'],
                status: 'Recusado',
            },
            {
                id: 4,
                nome: 'Maria Oliveira',
                foto: 'https://randomuser.me/api/portraits/women/2.jpg',
                posicoes: ['Atacante'],
                status: 'Confirmado',
            },
        ];
        setPlayers(mockPlayers);
    }, []);

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab>
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
                {showEditButton === 'true' && (
                    <AddPlayerButton onPress={() => router.push('/(tabs)/matchPlayersAdd')}>
                        <CirclePlus color="#2B6AE3" size={30} />
                    </AddPlayerButton>
                )}
            </TopButtonsContainer>
            <TitlePageTabs>Jogadores da Partida</TitlePageTabs>

            {players.map((player) => (
                <PlayerCard
                    key={player.id}
                    nome={player.nome}
                    foto={player.foto}
                    posicoes={player.posicoes}
                    status={player.status}
                />
            ))}
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

const AddPlayerButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 10px;
`;