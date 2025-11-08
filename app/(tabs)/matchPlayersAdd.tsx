import AddPlayerCard from '@/components/shared/AddPlayerCard';
import { BackButtonTab } from '@/components/shared/BackButton';
import { Input } from '@/components/shared/Input';
import { Loading } from '@/components/shared/Loading';
import { KeyboardAwareContainer, MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { CircleArrowLeft, UserPlus } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { Text } from 'react-native';
import { styled } from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import BASE_URL, { BASE_URL_IMAGE } from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

interface AvailablePlayer {
    id: number;
    nome: string;
    foto: string | null;
    posicoes: string[];
}

export default function AddPlayerScreen() {
    const { showEditButton, matchId } = useLocalSearchParams();

    const [players, setPlayers] = useState<AvailablePlayer[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
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

    useFocusEffect(
        useCallback(() => {
            const fetchAvailablePlayers = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    if (!matchId) {
                        setError('ID da partida não encontrado');
                        return;
                    }

                    const headers = await authHeaders();
                    const response = await fetch(`${BASE_URL}/jogadores/disponiveis/partida/${matchId}`, {
                        headers
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
                            foto: processedFoto
                        };
                    });

                    setPlayers(processedData || []);
                } catch (err: any) {
      
                    setError(err?.message || 'Erro ao carregar jogadores disponíveis');
                } finally {
                    setLoading(false);
                }
            };

            if (matchId) {
                fetchAvailablePlayers();
            }
        }, [matchId])
    );

    const filteredPlayers = players.filter((player) =>
        player.nome.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleInvite = async (playerId: number, playerName: string) => {
        try {

            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/convites`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partida_id: parseInt(matchId as string),
                    usuario_id: playerId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ${response.status}: Falha ao enviar convite`);
            }

            await response.json();

            showAlert(
                'success', 
                'Convite Enviado!', 
                `Convite enviado para ${playerName} com sucesso!`,
                () => {
                    setPlayers(prev => prev.filter(p => p.id !== playerId));
                }
            );

        } catch (err: any) {
            showAlert(
                'error', 
                'Erro ao Enviar Convite', 
                err?.message || 'Não foi possível enviar o convite. Tente novamente.'
            );
        }
    };

    return (
        <KeyboardAwareContainer>
            <MainContainer>
                <TopButtonsContainer>
                    <BackButtonTab onPress={() => {
                        router.replace({
                            pathname: '/(tabs)/matchPlayers',
                            params: { matchId: matchId, showEditButton: showEditButton },
                        });
                    }}>
                        <CircleArrowLeft color="#2B6AE3" size={50} />
                    </BackButtonTab>
                </TopButtonsContainer>
                
                <TitlePageTabs>Adicionar Jogador</TitlePageTabs>

                {showEditButton === 'true' && (
                    <ManualAddButton onPress={() => router.push({
                        pathname: '/(tabs)/matchPlayerManual' as any,
                        params: { showEditButton: showEditButton, matchId: matchId }
                    })}>
                        <UserPlus color="#2B6AE3" size={20} />
                        <ManualAddText>Adicionar Manualmente</ManualAddText>
                    </ManualAddButton>
                )}

            {loading ? (
                <Loading />
            ) : error ? (
                <ErrorContainer>
                    <Text style={{ color: '#e74c3c', textAlign: 'center' }}>
                        {error}
                    </Text>
                </ErrorContainer>
            ) : (
                <>
                    <Input
                        placeholder="Digite o nome do jogador"
                        value={searchQuery}
                        onChangeText={(text) => setSearchQuery(text)}
                    />

                    {filteredPlayers.length === 0 ? (
                        <NoResultsContainer>
                            <Text style={{ textAlign: 'center', color: '#666' }}>
                                {searchQuery ? 'Nenhum jogador encontrado' : 'Nenhum jogador disponível'}
                            </Text>
                        </NoResultsContainer>
                    ) : (
                        filteredPlayers.map((player) => (
                            <AddPlayerCard
                                key={player.id}
                                nome={player.nome}
                                foto={player.foto}
                                posicoes={player.posicoes}
                                onInvite={() => handleInvite(player.id, player.nome)}
                            />
                        ))
                    )}
                </>
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
        </KeyboardAwareContainer>
    );
}

const TopButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const NoResultsContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const ManualAddButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #f0f7ff;
  border: 2px solid #2B6AE3;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  gap: 8px;
`;

const ManualAddText = styled.Text`
  color: #2B6AE3;
  font-size: 16px;
  font-weight: 600;
`;
