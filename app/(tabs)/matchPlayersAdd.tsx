import AddPlayerCard from '@/components/shared/AddPlayerCard';
import { BackButtonTab } from '@/components/shared/BackButton';
import { Input } from '@/components/shared/Input';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { useRouter } from 'expo-router';
import { CircleArrowLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';

export default function AddPlayerScreen() {
    const router = useRouter();
    const [players, setPlayers] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const mockPlayers = [
            {
                id: 1,
                nome: 'João Silva',
                foto: 'https://randomuser.me/api/portraits/men/1.jpg',
                posicoes: ['Atacante', 'Meio-campo'],
            },
            {
                id: 2,
                nome: 'Carlos Souza',
                foto: 'https://randomuser.me/api/portraits/men/2.jpg',
                posicoes: ['Defensor'],
            },
            {
                id: 3,
                nome: 'Ana Pereira',
                foto: 'https://randomuser.me/api/portraits/women/1.jpg',
                posicoes: ['Goleiro'],
            },
            {
                id: 4,
                nome: 'Maria Oliveira',
                foto: 'https://randomuser.me/api/portraits/women/2.jpg',
                posicoes: ['Atacante'],
            },
        ];
        setPlayers(mockPlayers);
    }, []);

    const filteredPlayers = players.filter((player) =>
        player.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInvite = (playerName: string) => {
        console.log(`Jogador ${playerName} convidado!`);
    };

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab>
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
            </TopButtonsContainer>
            <TitlePageTabs>Adicionar Jogador</TitlePageTabs>

            <Input
                placeholder="Digite o nome do jogador"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
            />

            {filteredPlayers.map((player) => (
                <AddPlayerCard
                    key={player.id}
                    nome={player.nome}
                    foto={player.foto}
                    posicoes={player.posicoes}
                    onInvite={() => handleInvite(player.nome)}
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