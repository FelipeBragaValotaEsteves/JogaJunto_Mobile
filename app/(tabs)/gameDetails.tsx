import { GameDetailsMain } from '@/components/GameDetailsMain';
import { Alert } from '@/components/shared/Alert';
import { BackButtonTab } from '@/components/shared/BackButton';
import { Button, ButtonText } from '@/components/shared/Button';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { GameHeader } from '@/components/shared/GameHeader';
import { Loading } from '@/components/shared/Loading';
import { KeyboardAwareContainer, MainContainer } from '@/components/shared/MainContainer';
import { NumberInput } from '@/components/shared/NumberInput';
import PlayerCard from '@/components/shared/PlayerCard';
import { Select } from '@/components/shared/Select';
import typography from '@/constants/typography';
import { Player, useGameDetails } from '@/hooks/useGameDetails';
import { TopButtonsContainer } from '@/styles/gameDetailsStyles';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft, User } from 'lucide-react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { styled } from 'styled-components/native';
import BASE_URL, { BASE_URL_IMAGE } from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

interface AvailablePlayer {
    id: number;
    nome: string;
    foto: string;
    status: string;
    posicoes: (string | null)[];
}

export default function GameDetailsScreen() {
    const router = useRouter();

    const { id, idGame, title, showEditButton } = useLocalSearchParams();
    const { gameDetails, matchDetails, positions, loading, error, fetchAll } = useGameDetails(
        id as string,
        idGame as string
    );

    const [editingTeam, setEditingTeam] = useState<string | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [editablePlayer, setEditablePlayer] = useState({
        gols: 0,
        assistencias: 0,
        cartoes: 0,
        cartoesAmarelos: 0,
        cartoesVermelhos: 0,
        defesas: 0,
        rating: 0.0,
        posicao: '',
        posicaoId: 0
    });
    const [availablePlayers, setAvailablePlayers] = useState<AvailablePlayer[]>([]);
    const [loadingPlayers, setLoadingPlayers] = useState(false);
    const [positionPickerOpen, setPositionPickerOpen] = useState(false);
    const [positionItems, setPositionItems] = useState<{ label: string; value: string }[]>([]);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['100%'], []);

    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setSelectedPlayer(null);
            setEditingTeam(null);
        }
    }, []);

    const handleAddPlayer = async (teamName: string) => {
        setEditingTeam(teamName);
        setSelectedPlayer(null);
        setAvailablePlayers([]);
        setLoadingPlayers(true);
        bottomSheetRef.current?.expand();

        try {
            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/jogadores/partida/${id}`, { headers });
            console.log(`${BASE_URL}/jogadores/partida/${id}`, headers);

            console.log(response);

            if (response.ok) {
                const data = await response.json();

                setAvailablePlayers(data || []);
            }
        } catch (_error) {
            console.log('Erro ao buscar jogadores disponíveis:', _error);
        } finally {
            setLoadingPlayers(false);
        }
    };

    const handlePlayerPress = (player: Player) => {
        console.log(player);
        
        setSelectedPlayer(player);

        const currentPosition = positions.find(pos => pos.nome === player.posicao);

        setEditablePlayer({
            gols: player.gols || 0,
            assistencias: player.assistencias || 0,
            cartoes: 0,
            cartoesAmarelos: player.cartoesAmarelos || 0,
            cartoesVermelhos: player.cartoesVermelhos || 0,
            defesas: player.defesas || 0,
            rating: player.rating || 0,
            posicao: player.posicao || '',
            posicaoId: currentPosition?.id || 0
        });

        const posItems = positions.map(pos => ({
            label: pos.nome,
            value: pos.id.toString()
        }));
        setPositionItems(posItems);

        setEditingTeam(null);
        bottomSheetRef.current?.expand();
    };

    const handleStatChange = (stat: keyof typeof editablePlayer, value: number | string) => {
        setEditablePlayer(prev => ({
            ...prev,
            [stat]: value
        }));
    };

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

    const handleSaveChanges = useCallback(async () => {
        if (!selectedPlayer || !gameDetails) return;

        try {
            const headers = await authHeaders();

            const response = await fetch(`${BASE_URL}/time-participantes/${selectedPlayer.id}`, {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    gol: editablePlayer.gols,
                    assistencia: editablePlayer.assistencias,
                    cartaoAmarelo: editablePlayer.cartoesAmarelos,
                    cartaoVermelho: editablePlayer.cartoesVermelhos,
                    defesa: editablePlayer.defesas,
                    posicaoId: editablePlayer.posicaoId
                })
            });

            if (response.ok) {
                showAlert('success', 'Sucesso', 'Estatísticas do jogador atualizadas com sucesso!');
                bottomSheetRef.current?.close();

                await fetchAll();
            } else {
                const errorData = await response.json();
                showAlert('error', 'Erro', errorData.message || 'Erro ao salvar as alterações.');
            }
        } catch {
            showAlert('error', 'Erro', 'Erro ao salvar as alterações. Verifique sua conexão.');
        }
    }, [selectedPlayer, gameDetails, editablePlayer, fetchAll]);

    const handleAddPlayerToTeam = useCallback(async (player: AvailablePlayer) => {
        if (!gameDetails || !editingTeam) return;

        const selectedTeam = gameDetails.times?.find(team => team.nome === editingTeam);
        if (!selectedTeam) {
            showAlert('error', 'Erro', 'Time não encontrado.');
            return;
        }

        try {
            const headers = await authHeaders();
            console.log(JSON.stringify({
                jogadorId: player.id,
                timeId: selectedTeam.id,
                jogoId: gameDetails.id
            }));

            const response = await fetch(`${BASE_URL}/time-participantes`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jogadorId: player.id,
                    timeId: selectedTeam.id,
                    jogoId: gameDetails.id
                })
            });

            if (response.ok) {
                showAlert('success', 'Sucesso', `${player.nome} foi adicionado ao ${editingTeam}!`);
                bottomSheetRef.current?.close();

                await fetchAll();
            } else {
                const errorData = await response.json();
                showAlert('error', 'Erro', errorData.message || 'Erro ao adicionar jogador ao time.');
            }
        } catch {
            showAlert('error', 'Erro', 'Erro ao adicionar jogador ao time. Verifique sua conexão.');
        }
    }, [gameDetails, editingTeam, fetchAll]);

    if (loading) {
        return <Loading />;
    }

    if (error || !gameDetails) {
        return (
            <MainContainer>
                <TitlePageTabs>Erro ao carregar jogo</TitlePageTabs>
                <ContentContainer>
                    <Text>{error || 'Erro desconhecido'}</Text>
                    <Button onPress={fetchAll}>
                        <ButtonText>Tentar novamente</ButtonText>
                    </Button>
                </ContentContainer>
            </MainContainer>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardAwareContainer>
                <MainContainer>
                    <TopButtonsContainer>
                        <BackButtonTab onPress={() => {
                            if (matchDetails) {
                                router.replace({
                                    pathname: '/(tabs)/matchDetails',
                                    params: { id: matchDetails.id, source: showEditButton ? 'createdMatches' : undefined },
                                });
                            }
                        }}>
                            <CircleArrowLeft color="#2B6AE3" size={50} />
                        </BackButtonTab>
                    </TopButtonsContainer>

                    <GameHeader matchDetails={matchDetails} gameDetails={gameDetails} />

                    <ContentContainer>
                        <GameDetailsMain
                            gameDetails={gameDetails}
                            title={title as string}
                            onPlayerPress={handlePlayerPress}
                            onAddPlayer={handleAddPlayer}
                        />
                    </ContentContainer>
                </MainContainer>
            </KeyboardAwareContainer>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
            >
                <BottomSheetScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
                    {selectedPlayer ? (
                        <PlayerDetailsContainer>
                            <PlayerImageNamePositionContainer>
                                {selectedPlayer.foto ? (
                                    selectedPlayer.foto.startsWith('http://') || selectedPlayer.foto.startsWith('https://') ? (
                                        <PlayerImage
                                            source={{ uri: selectedPlayer.foto }}
                                            onError={(e) => {
                                                console.log('Erro ao carregar imagem do jogador:', e.nativeEvent.error);
                                            }}
                                        />
                                    ) : (
                                        <PlayerImage
                                            source={{ uri: `${BASE_URL_IMAGE}${selectedPlayer.foto}` }}
                                            onError={(e) => {
                                                console.log('Erro ao carregar imagem do jogador:', e.nativeEvent.error);
                                            }}
                                        />
                                    )
                                ) : (
                                    <PlaceholderImage>
                                        <User size={40} color="#B0BEC5" />
                                    </PlaceholderImage>
                                )}
                                <View>
                                    <PlayerNameSheet>{selectedPlayer.nome}</PlayerNameSheet>
                                    <PlayerPositionSheet>{selectedPlayer.posicao || 'Posição não definida'}</PlayerPositionSheet>
                                </View>
                            </PlayerImageNamePositionContainer>

                            <StatsFormContainer>
                                <StatEditRow>
                                    <StatLabel>Posição</StatLabel>
                                    <CompactSelectContainer>
                                        <Select
                                            items={positionItems}
                                            value={editablePlayer.posicaoId.toString()}
                                            setValue={(callback: any) => {
                                                const value = typeof callback === 'function' ? callback(editablePlayer.posicaoId.toString()) : callback;
                                                const position = positions.find(p => p.id.toString() === value);
                                                handleStatChange('posicaoId', parseInt(value));
                                                handleStatChange('posicao', position?.nome || '');
                                            }}
                                            open={positionPickerOpen}
                                            setOpen={setPositionPickerOpen}
                                            setItems={setPositionItems}
                                        />
                                    </CompactSelectContainer>
                                </StatEditRow>

                                <StatEditRow>
                                    <StatLabel>Gols</StatLabel>
                                    <NumberInput
                                        value={editablePlayer.gols}
                                        onDecrease={() => handleStatChange('gols', Math.max(0, editablePlayer.gols - 1))}
                                        onIncrease={() => handleStatChange('gols', editablePlayer.gols + 1)}
                                    />
                                </StatEditRow>

                                <StatEditRow>
                                    <StatLabel>Assistências</StatLabel>
                                    <NumberInput
                                        value={editablePlayer.assistencias}
                                        onDecrease={() => handleStatChange('assistencias', Math.max(0, editablePlayer.assistencias - 1))}
                                        onIncrease={() => handleStatChange('assistencias', editablePlayer.assistencias + 1)}
                                    />
                                </StatEditRow>

                                <StatEditRow>
                                    <StatLabel>Cartões Amarelos</StatLabel>
                                    <NumberInput
                                        value={editablePlayer.cartoesAmarelos}
                                        onDecrease={() => handleStatChange('cartoesAmarelos', Math.max(0, editablePlayer.cartoesAmarelos - 1))}
                                        onIncrease={() => handleStatChange('cartoesAmarelos', editablePlayer.cartoesAmarelos + 1)}
                                    />
                                </StatEditRow>

                                <StatEditRow>
                                    <StatLabel>Cartões Vermelhos</StatLabel>
                                    <NumberInput
                                        value={editablePlayer.cartoesVermelhos}
                                        onDecrease={() => handleStatChange('cartoesVermelhos', Math.max(0, editablePlayer.cartoesVermelhos - 1))}
                                        onIncrease={() => handleStatChange('cartoesVermelhos', editablePlayer.cartoesVermelhos + 1)}
                                    />
                                </StatEditRow>

                                <StatEditRow>
                                    <StatLabel>Defesas</StatLabel>
                                    <NumberInput
                                        value={editablePlayer.defesas}
                                        onDecrease={() => handleStatChange('defesas', Math.max(0, editablePlayer.defesas - 1))}
                                        onIncrease={() => handleStatChange('defesas', editablePlayer.defesas + 1)}
                                    />
                                </StatEditRow>

                                <StatEditRow>
                                    <StatLabel>Rating</StatLabel>
                                    <NumberInput
                                        value={editablePlayer.rating}
                                        onDecrease={() => handleStatChange('rating', Math.max(0, Number((editablePlayer.rating - 0.1).toFixed(1))))}
                                        onIncrease={() => handleStatChange('rating', Math.min(10, Number((editablePlayer.rating + 0.1).toFixed(1))))}
                                        isFloat={true}
                                    />
                                </StatEditRow>

                                <Button onPress={handleSaveChanges} style={{ marginTop: 20 }}>
                                    <ButtonText>SALVAR</ButtonText>
                                </Button>
                            </StatsFormContainer>
                        </PlayerDetailsContainer>
                    ) : editingTeam ? (
                        <View>
                            <TeamName>
                                Adicionar jogador ao {editingTeam}
                            </TeamName>

                            {loadingPlayers ? (
                                <Text>Carregando jogadores disponíveis...</Text>
                            ) : (
                                availablePlayers.map((player) => (
                                    <PlayerCard
                                        key={player.id}
                                        nome={player.nome}
                                        foto={player.foto}
                                        posicoes={player.posicoes.filter((pos): pos is string => pos !== null)}
                                        onAdd={() => handleAddPlayerToTeam(player)}
                                    />
                                ))
                            )}
                        </View>
                    ) : null}
                </BottomSheetScrollView>
            </BottomSheet>

            <Alert
                visible={alertVisible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => setAlertVisible(false)}
                onConfirm={alertConfig.onConfirm}
            />
        </GestureHandlerRootView>
    );
}

const PlayerDetailsContainer = styled.View`
    align-items: flex-start;
    width: 100%;
`;

const PlayerImageNamePositionContainer = styled.View`
    flex-direction: row;
    gap: 16px;
    align-items: flex-start;
`;

const PlayerImage = styled.Image`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    margin-bottom: 16px;
`;

const PlaceholderImage = styled.View`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: #E0E0E0;
    margin-bottom: 16px;
    justify-content: center;
    align-items: center;
`;

const PlayerNameSheet = styled.Text`
    font-size: 24px;
    font-weight: bold;
    color: #2C2C2C;
    margin-bottom: 16px;
`;

const PlayerPositionSheet = styled.Text`
    font-size: 16px;
    color: #666;
    margin-bottom: 24px;
`;

const StatsFormContainer = styled.View`
    width: 100%;
`;

const StatEditRow = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 16px 8px;
    border-bottom-width: 1px;
    border-bottom-color: #EEE;
`;

const StatLabel = styled.Text`
    font-size: 18px;
    color: #333;
`;

const CompactSelectContainer = styled.View`
    width: 60%;
`;

const TitlePageTabs = styled.Text`
    font-size: ${typography['txt-1'].fontSize}px;
    font-family: ${typography['txt-1'].fontFamily};
    color: #2C2C2C;
    text-align: center;
    margin-bottom: 20px;
`;

const TeamName = styled.Text`
  text-align: left;
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
  margin-bottom: 16px;
`;