import { BackButtonTab } from '@/components/shared/BackButton';
import { Loading } from '@/components/shared/Loading';
import { MainContainer } from '@/components/shared/MainContainer';
import PlayerCard from '@/components/shared/PlayerCard';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft, CirclePlus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { styled } from 'styled-components/native';
import BASE_URL, { BASE_URL_IMAGE } from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

interface MatchPlayer {
    id: number;
    nome: string;
    foto: string | null;
    status: string;
    posicoes: (string | null)[];
}

export default function MatchPlayersScreen() {
    const router = useRouter();
    const { showEditButton, matchId } = useLocalSearchParams();
    const [players, setPlayers] = useState<MatchPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchMatchPlayers = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    if (!matchId) {
                        setError('ID da partida não encontrado');
                        return;
                    }

                    const headers = await authHeaders();
                    const response = await fetch(`${BASE_URL}/jogadores/partida/${matchId}`, {
                        headers,
                        cache: 'no-cache'
                    });

                    if (!response.ok) {
                        throw new Error(`Erro ${response.status}: Falha ao carregar jogadores`);
                    }

                    const data = await response.json();

                    const processedData = data.map((player: any) => {
                        const originalFoto = player.foto;
                        let processedFoto = null;

                        if (originalFoto &&
                            typeof originalFoto === 'string' &&
                            originalFoto !== '[object Object]' &&
                            originalFoto.trim() !== '') {

                            if (originalFoto.startsWith('http')) {

                                processedFoto = originalFoto;
                            } else {

                                processedFoto = `${BASE_URL_IMAGE}${originalFoto}`;
                            }
                        }

                        return {
                            ...player,
                            posicoes: player.posicoes?.filter((pos: any) => pos !== null) || [],
                            foto: processedFoto
                        };
                    });


                    if (isActive) {
                        setPlayers(processedData);
                    }
                } catch (err: any) {
                    if (isActive) {
                        setError(err?.message || 'Erro ao carregar jogadores da partida');
                    }
                } finally {
                    if (isActive) {
                        setLoading(false);
                    }
                }
            };

            if (matchId) {
                fetchMatchPlayers();
            }


            return () => {
                isActive = false;
            };
        }, [matchId])
    );

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => {
                    router.replace({
                        pathname: '/(tabs)/matchDetails',
                        params: { id: matchId, source: showEditButton ? 'createdMatches' : 'false' }
                    });
                }}>
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
                {showEditButton === 'true' && (
                    <AddPlayerButton onPress={() => router.push({ pathname: '/(tabs)/matchPlayersAdd', params: { showEditButton: showEditButton, matchId: matchId } })}>
                        <CirclePlus color="#2B6AE3" size={30} />
                    </AddPlayerButton>
                )}
            </TopButtonsContainer>
            <TitlePageTabs>Jogadores da Partida</TitlePageTabs>

            {loading ? (
                <Loading />
            ) : error ? (
                <ErrorContainer>
                    <Text style={{ color: '#e74c3c', textAlign: 'center' }}>
                        {error}
                    </Text>
                </ErrorContainer>
            ) : players.length === 0 ? (
                <NoPlayersContainer>
                    <Text style={{ textAlign: 'center', color: '#666' }}>
                        Nenhum jogador adicionado à partida
                    </Text>
                </NoPlayersContainer>
            ) : (
                players.map((player) => (
                    <PlayerCard
                        key={player.id}
                        nome={player.nome}
                        foto={player.foto}
                        posicoes={player.posicoes.filter((pos): pos is string => pos !== null)}
                        status={player.status as any}
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

const AddPlayerButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 10px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const NoPlayersContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;