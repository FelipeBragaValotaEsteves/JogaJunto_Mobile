import { Alert } from '@/components/shared/Alert';
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
    convite_id: number | null;
    partida_participante_id: number | null;
}

export default function MatchPlayersScreen() {
    const router = useRouter();
    const { showEditButton, matchId } = useLocalSearchParams();
    const isEditMode = (showEditButton as any) === 'true' || (showEditButton as any) === true;
    const [players, setPlayers] = useState<MatchPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        type: string;
        title: string;
        message: string;
        onConfirm?: (() => void) | undefined;
    }>({
        type: 'success',
        title: '',
        message: '',
        onConfirm: undefined,
    });

    const showAlert = (type: string, title: string, message: string, onConfirm?: () => void) => {
        setAlertConfig({ type, title, message, onConfirm });
        setAlertVisible(true);
    };

    const fetchMatchPlayers = useCallback(async () => {
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

            setPlayers(processedData);
        } catch (err: any) {
            setError(err?.message || 'Erro ao carregar jogadores da partida');
        } finally {
            setLoading(false);
        }
    }, [matchId]);

    const handleRemovePlayer = useCallback((player: MatchPlayer) => {
        showAlert(
            'warning',
            'Confirmar Remoção',
            `Tem certeza que deseja remover ${player.nome} da partida?`,
            async () => {
                try {
                    const headers = await authHeaders();
                    let response;

                    if (player.status.toLowerCase() === 'pendente' || player.status.toLowerCase() === 'aceito') {
                        if (!player.convite_id) {
                            throw new Error("ID do convite não encontrado");
                        }
                        
                        response = await fetch(`${BASE_URL}/convites/remover/${player.convite_id}`, {
                            method: 'DELETE',
                            headers,
                        });
                    } else {
                        if (!player.partida_participante_id) {
                            throw new Error("ID do participante não encontrado");
                        }
                        response = await fetch(`${BASE_URL}/partida-participantes/${player.partida_participante_id}`, {
                            method: 'DELETE',
                            headers,
                        });
                    }

                    if (!response.ok) {
                        throw new Error("Erro ao remover jogador da partida");
                    }

                    showAlert(
                        'success',
                        'Jogador Removido',
                        `${player.nome} foi removido da partida com sucesso.`,
                        () => {
                            fetchMatchPlayers();
                        }
                    );
                } catch {
                    showAlert(
                        'error',
                        'Erro',
                        'Não foi possível remover o jogador. Tente novamente.'
                    );
                }
            }
        );
    }, [matchId, fetchMatchPlayers]);

    useFocusEffect(
        useCallback(() => {
            if (matchId) {
                fetchMatchPlayers();
            }
        }, [matchId, fetchMatchPlayers])
    );

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => {
                    router.replace({
                        pathname: '/(tabs)/matchDetails',
                        params: { id: matchId, source: isEditMode ? 'createdMatches' : 'playedMatches' }
                    });
                }}>
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
                {isEditMode && (
                    <AddPlayerButton onPress={() => router.push({ pathname: '/(tabs)/matchPlayersAdd', params: { showEditButton: isEditMode as any, matchId: matchId } })}>
                        <CirclePlus color="#2B6AE3" size={30} />
                    </AddPlayerButton>
                )}
            </TopButtonsContainer>
            <TitlePageTabs>Jogadores do Horário</TitlePageTabs>

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
                        showRemove={isEditMode && player.status.toLowerCase() !== 'recusado'}
                        onRemove={() => handleRemovePlayer(player)}
                    />
                ))
            )}
            
            <Alert
                visible={alertVisible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertVisible(false)}
                onConfirm={alertConfig.onConfirm}
            />
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