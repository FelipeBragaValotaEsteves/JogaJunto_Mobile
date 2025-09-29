import { Alert } from '@/components/shared/Alert';
import { BackButtonTab } from '@/components/shared/BackButton';
import { Button, ButtonText } from '@/components/shared/Button';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { MainContainer } from '@/components/shared/MainContainer';
import { NumberInput } from '@/components/shared/NumberInput';
import PlayerCard from '@/components/shared/PlayerCard';
import { Select } from '@/components/shared/Select';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import typography from '@/constants/typography';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft, Plus } from 'lucide-react-native';
import { SneakerMoveIcon, SoccerBallIcon, SquareIcon } from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import styled from 'styled-components/native';
import BASE_URL from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

function formatDateTime(data: string, hora: string): { time: string; formattedDate: string } {
    let dateObj: Date;
    const onlyDate = data.split('T')[0];
    const [year, month, day] = onlyDate.split('-').map(Number);
    dateObj = new Date(year, month - 1, day);

    const time = hora.slice(0, 5);
    let dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
    dayOfWeek = dayOfWeek.replace('-feira', '');
    dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const monthExtenso = dateObj.toLocaleDateString('pt-BR', { month: 'long' });
    return { time, formattedDate: `${dayOfWeek}, ${day} de ${monthExtenso}` };
}

interface GamePlayer {
    id: number;
    nome: string;
    time: string;
    posicao: string;
    gols: number;
    assistencias: number;
    cartoes: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
    defesas: number;
    rating: Float;
    foto?: string;
    posicoes?: string[];
    timeParticipanteId?: number;
    jogadorId?: number;
}

interface AvailablePlayer {
    id: number;
    nome: string;
    foto: string;
    posicoes: string[];
}

interface BackendPlayerEventos {
    gol: number;
    assistencia: number;
    defesa: number;
    cartaoAmarelo: number;
    cartaoVermelho: number;
}

interface BackendPlayer {
    timeParticipanteId: number;
    jogadorId: number;
    nome: string;
    eventos: BackendPlayerEventos;
}

interface BackendTeamTotais {
    gols: number;
    assistencias: number;
    cartoesAmarelos: number;
    cartoesVermelhos: number;
}

interface BackendTeam {
    timeId: number;
    nome: string;
    totais: BackendTeamTotais;
    jogadores: BackendPlayer[];
}

interface BackendGameResponse {
    jogoId: number;
    times: BackendTeam[];
}

interface MatchDetails {
    id: number;
    titulo: string;
    descricao: string;
    data: string;
    hora_inicio: string;
    local: string;
    tipo_partida_nome: string;
    status: string;
}

interface GameDetails {
    id: number;
    titulo: string;
    time1: string;
    time2: string;
    placar1: number;
    placar2: number;
    data: string;
    hora_inicio: string;
    local: string;
    tipo_partida_nome: string;
    jogadores: GamePlayer[];
}

interface Position {
    id: number;
    nome: string;
}

export default function GameDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showEditButton, setShowEditButton] = useState(true);
    const [editingTeam, setEditingTeam] = useState<string | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<GamePlayer | null>(null);
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
    const [addingPlayer, setAddingPlayer] = useState(false);
    const [savingStats, setSavingStats] = useState(false);
    const [positions, setPositions] = useState<Position[]>([]);

    const [positionPickerOpen, setPositionPickerOpen] = useState(false);
    const [positionItems, setPositionItems] = useState<{ label: string; value: string }[]>([]);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['100%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index === -1) {
            setEditingTeam(null);
            setSelectedPlayer(null);
            setPositionPickerOpen(false);
            setLoadingPlayers(false);
            setAddingPlayer(false);
            setAvailablePlayers([]);
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
            const response = await fetch(`${BASE_URL}/jogadores/jogadoresDisponiveis/?id=${id}`, { headers });
            
            if (!response.ok) {
                throw new Error(`Erro ao buscar jogadores disponíveis: ${response.status} ${response.statusText}`);
            }
            
            const data: AvailablePlayer[] = await response.json();
            const playersWithValidPositions = (data || []).map(player => ({
                ...player,
                posicoes: Array.isArray(player.posicoes) ? player.posicoes : []
            }));
            setAvailablePlayers(playersWithValidPositions);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar jogadores';
            console.error("Erro ao buscar jogadores disponíveis:", errorMessage);
            setAvailablePlayers([]);
            showAlert(
                'error',
                'Erro',
                'Não foi possível carregar os jogadores disponíveis. Tente novamente.'
            );
        } finally {
            setLoadingPlayers(false);
        }
    };

    const handlePlayerPress = (player: GamePlayer) => {
        setSelectedPlayer(player);


        const currentPosition = positions.find(pos => pos.nome === player.posicao);

        setEditablePlayer({
            gols: player.gols,
            assistencias: player.assistencias,
            cartoes: player.cartoes,
            cartoesAmarelos: player.cartoesAmarelos,
            cartoesVermelhos: player.cartoesVermelhos,
            defesas: player.defesas,
            rating: player.rating,
            posicao: player.posicao,
            posicaoId: currentPosition?.id || 0
        });
        setEditingTeam(null);
        bottomSheetRef.current?.expand();
    };

    const handleStatChange = (stat: keyof Omit<typeof editablePlayer, 'posicao'>, value: number) => {
        setEditablePlayer(prev => {
            const newValue = prev[stat] + value;

            if (stat === 'rating') {
                return { ...prev, [stat]: Math.max(0, parseFloat(newValue.toFixed(1))) };
            }

            const updatedPlayer = { ...prev, [stat]: Math.max(0, newValue) };


            if (stat === 'cartoesAmarelos' || stat === 'cartoesVermelhos') {
                updatedPlayer.cartoes = updatedPlayer.cartoesAmarelos + updatedPlayer.cartoesVermelhos;
            }

            return updatedPlayer;
        });
    };

    const fetchPositions = async () => {
        try {
            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/posicao/list`, { headers });

            if (!response.ok) {
                throw new Error(`Erro ao buscar posições: ${response.status} ${response.statusText}`);
            }

            const data: Position[] = await response.json();


            setPositions(data);
            setPositionItems(data.map(pos => ({ label: pos.nome, value: pos.id.toString() })));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar posições';
            console.error("Erro ao buscar posições:", errorMessage);
            setPositions([]);
            setPositionItems([]);
        }
    };

    const handleSaveChanges = async () => {
        if (!selectedPlayer || !gameDetails || savingStats) return;

        if (!selectedPlayer.jogadorId || !selectedPlayer.timeParticipanteId) {
            showAlert(
                'error',
                'Erro',
                'Dados insuficientes para salvar. IDs do jogador ou time não encontrados.'
            );
            return;
        }

        try {
            setSavingStats(true);

            const playerStats: any = {
                jogadorId: selectedPlayer.jogadorId,
                timeParticipanteId: selectedPlayer.timeParticipanteId,
                jogoId: gameDetails.id
            };


            if (editablePlayer.gols > 0) playerStats.gol = editablePlayer.gols;
            if (editablePlayer.assistencias > 0) playerStats.assistencia = editablePlayer.assistencias;
            if (editablePlayer.defesas > 0) playerStats.defesa = editablePlayer.defesas;
            if (editablePlayer.cartoesAmarelos > 0) playerStats.cartaoAmarelo = editablePlayer.cartoesAmarelos;
            if (editablePlayer.cartoesVermelhos > 0) playerStats.cartaoVermelho = editablePlayer.cartoesVermelhos;
            if (editablePlayer.posicaoId > 0) playerStats.posicaoId = editablePlayer.posicaoId;


            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/time-participantes/${selectedPlayer.jogadorId}`, {
                method: 'PUT',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(playerStats)
            });



            if (!response.ok) {
                const errorData = await response.text();
                console.error("Erro na resposta:", errorData);
                throw new Error(`Erro ao salvar estatísticas: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();

            await fetchMatchDetails();
            await fetchGameDetails(true);

            showAlert(
                'success',
                'Sucesso',
                'Estatísticas do jogador salvas com sucesso!'
            );

            bottomSheetRef.current?.close();

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            console.error("Erro ao salvar estatísticas:", errorMessage);

            showAlert(
                'error',
                'Erro',
                `Não foi possível salvar as estatísticas: ${errorMessage}`
            );
        } finally {
            setSavingStats(false);
        }
    };

    const handleAddPlayerToTeam = async (player: AvailablePlayer) => {
        if (!gameDetails || !editingTeam || addingPlayer) return;

        try {
            setAddingPlayer(true);

            const team1Name = gameDetails.time1;
            const team2Name = gameDetails.time2;
            
            const headers = await authHeaders();
            const gameResponse = await fetch(`${BASE_URL}/partidas/resumo/${id}`, { headers });
            
            if (!gameResponse.ok) {
                throw new Error('Erro ao buscar dados do jogo para adicionar jogador');
            }
            
            const gameData: BackendGameResponse[] = await gameResponse.json();
            const currentGameData = gameData[0];
            
            let timeId: number | null = null;
            
            if (editingTeam === team1Name && currentGameData.times[0]) {
                timeId = currentGameData.times[0].timeId;
            } else if (editingTeam === team2Name && currentGameData.times[1]) {
                timeId = currentGameData.times[1].timeId;
            }
            
            if (!timeId) {
                throw new Error('Time não encontrado para adicionar jogador');
            }

            const posicaoId = positions.find(pos => 
                player.posicoes && player.posicoes.includes(pos.nome)
            )?.id || positions[0]?.id || 1; 

            const addPlayerResponse = await fetch(`${BASE_URL}/time-participantes`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    timeId: timeId,
                    jogadorId: player.id,
                    posicaoId: posicaoId
                })
            });

            if (!addPlayerResponse.ok) {
                const errorData = await addPlayerResponse.json();
                throw new Error(errorData.message || 'Erro ao adicionar jogador ao time');
            }

            await fetchMatchDetails();
            await fetchGameDetails(true);
            
            setAvailablePlayers(prev => prev.filter(p => p.id !== player.id));
            bottomSheetRef.current?.close();

            showAlert(
                'success',
                'Sucesso',
                'Jogador adicionado ao time com sucesso!'
            );

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            console.error("Erro ao adicionar jogador ao time:", errorMessage);
            
            showAlert(
                'error',
                'Erro',
                `Não foi possível adicionar o jogador ao time: ${errorMessage}`
            );
        } finally {
            setAddingPlayer(false);
        }
    };

    const fetchMatchDetails = async () => {
        try {


            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/partidas/${id}`, { headers });


            if (!response.ok) {
                throw new Error(`Erro ao buscar detalhes da partida: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();

            setMatchDetails(data);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido ao buscar detalhes da partida';
            console.error("Erro ao buscar detalhes da partida:", errorMessage);
        }
    };

    const fetchGameDetails = async (isRefresh: boolean = false) => {
        try {
            if (!isRefresh) {
                setLoading(true);
            }
            setError(null);

            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/partidas/resumo/${id}`, { headers });
            if (!response.ok) {
                throw new Error(`Erro ${response.status}: ${response.statusText}`);
            }

            const data: BackendGameResponse[] = await response.json();

            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Nenhum dado encontrado para o jogo.");
            }

            const gameData = data[0];

            if (!gameData.jogoId) {
                throw new Error("ID do jogo não encontrado nos dados retornados.");
            }

            const team1 = gameData.times?.[0] || null;
            const team2 = gameData.times?.[1] || null;

            const parsedData: GameDetails = {
                id: gameData.jogoId,
                titulo: `Jogo ${gameData.jogoId}`,
                time1: team1?.nome || "Time 1",
                time2: team2?.nome || "Time 2",
                placar1: team1?.totais?.gols || 0,
                placar2: team2?.totais?.gols || 0,
                data: matchDetails?.data || "",
                hora_inicio: matchDetails?.hora_inicio || "",
                local: matchDetails?.local || "",
                tipo_partida_nome: matchDetails?.tipo_partida_nome || "",
                jogadores: [
                    ...(team1?.jogadores?.map((jogador: BackendPlayer) => ({
                        id: jogador.jogadorId || Math.random(),
                        nome: String(jogador.nome || "Jogador sem nome"),
                        time: String(team1.nome),
                        posicao: "",
                        gols: Number(jogador.eventos?.gol || 0),
                        assistencias: Number(jogador.eventos?.assistencia || 0),
                        cartoes: Number((jogador.eventos?.cartaoAmarelo || 0) + (jogador.eventos?.cartaoVermelho || 0)),
                        cartoesAmarelos: Number(jogador.eventos?.cartaoAmarelo || 0),
                        cartoesVermelhos: Number(jogador.eventos?.cartaoVermelho || 0),
                        defesas: Number(jogador.eventos?.defesa || 0),
                        rating: 0.0,
                        timeParticipanteId: jogador.timeParticipanteId,
                        jogadorId: jogador.jogadorId,
                    })) || []),
                    ...(team2?.jogadores?.map((jogador: BackendPlayer) => ({
                        id: jogador.jogadorId || Math.random(),
                        nome: String(jogador.nome || "Jogador sem nome"),
                        time: String(team2.nome),
                        posicao: "",
                        gols: Number(jogador.eventos?.gol || 0),
                        assistencias: Number(jogador.eventos?.assistencia || 0),
                        cartoes: Number((jogador.eventos?.cartaoAmarelo || 0) + (jogador.eventos?.cartaoVermelho || 0)),
                        cartoesAmarelos: Number(jogador.eventos?.cartaoAmarelo || 0),
                        cartoesVermelhos: Number(jogador.eventos?.cartaoVermelho || 0),
                        defesas: Number(jogador.eventos?.defesa || 0),
                        rating: 0.0,
                        timeParticipanteId: jogador.timeParticipanteId,
                        jogadorId: jogador.jogadorId,
                    })) || []),
                ],
            };

            setGameDetails(parsedData);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            console.error("Erro ao buscar detalhes do jogo:", errorMessage);
            setError(errorMessage);
            showAlert(
                'error',
                'Erro',
                errorMessage || 'Não foi possível carregar os detalhes do jogo. Tente novamente mais tarde.'
            );
        } finally {
            if (!isRefresh) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        if (!id) {
            console.error("ID do jogo não foi fornecido.");
            setError("ID do jogo não foi fornecido.");
            setLoading(false);
            return;
        }
    }, [id]);


    useFocusEffect(
        useCallback(() => {
            if (id) {
                const fetchData = async () => {
                    await fetchPositions();
                    await fetchMatchDetails();
                    await fetchGameDetails();
                };
                fetchData();
            }
        }, [id])
    );

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

    if (loading) {
        return (
            <MainContainer>
                <TitlePageTabs>Carregando detalhes do jogo...</TitlePageTabs>
            </MainContainer>
        );
    }

    if (error || !gameDetails) {
        return (
            <MainContainer>
                <TitlePageTabs>Erro ao carregar jogo</TitlePageTabs>
                <ContentContainer>
                    <Text>{error || 'Erro desconhecido'}</Text>
                    <Button onPress={async () => {
                        setError(null);
                        await fetchMatchDetails();
                        await fetchGameDetails();
                    }}>
                        <ButtonText>Tentar novamente</ButtonText>
                    </Button>
                </ContentContainer>
            </MainContainer>
        );
    }

    const team1Players = gameDetails?.jogadores?.filter(player => player.time === gameDetails.time1) || [];
    const team2Players = gameDetails?.jogadores?.filter(player => player.time === gameDetails.time2) || [];

    const team1Name = gameDetails?.time1 || "Time 1";
    const team2Name = gameDetails?.time2 || "Time 2";

    const matchInfo = matchDetails && gameDetails ? (() => {
        const { time, formattedDate } = formatDateTime(matchDetails.data, matchDetails.hora_inicio);
        return {
            formattedDate,
            time,
            local: matchDetails.local,
            tipo: matchDetails.tipo_partida_nome
        };
    })() : null;

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MainContainer>
                <TopButtonsContainer>
                    <BackButtonTab onPress={() => router.back()}>
                        <CircleArrowLeft color="#2B6AE3" size={50} />
                    </BackButtonTab>
                </TopButtonsContainer>

                <TitlePageTabs style={{ marginBottom: 8 }}>
                    {matchInfo?.local || gameDetails?.local || "Local não informado"}
                </TitlePageTabs>
                <Divider />
                <SubTitleContainer>
                    <SubTitleText>
                        {matchInfo ? 
                            `${matchInfo.formattedDate} às ${matchInfo.time}` :
                            (gameDetails?.data && gameDetails?.hora_inicio) ?
                                `${gameDetails.data} às ${gameDetails.hora_inicio}` :
                                "Data não informada"
                        }
                    </SubTitleText>
                    <SubTitleText>
                        {matchInfo?.tipo || gameDetails?.tipo_partida_nome || "Tipo não informado"}
                    </SubTitleText>
                </SubTitleContainer>

                <ContentContainer>
                    <GameCard>
                        <GameTitle>{gameDetails.titulo || 'Jogo'}</GameTitle>
                        <ScoreSection>
                            <TeamName>{team1Name}</TeamName>
                            <Score>{gameDetails.placar1 || 0} x {gameDetails.placar2 || 0}</Score>
                            <TeamNameRight>{team2Name}</TeamNameRight>
                        </ScoreSection>
                    </GameCard>

                    <PlayersSection>
                        <TeamSection>
                            {team1Players.map(player => (
                                <TouchableOpacity key={player.id} onPress={() => handlePlayerPress(player)}>
                                    <PlayerCardTeam>
                                        <PlayerNameSection>
                                            <PlayerName>{player.nome || 'Jogador'}</PlayerName>
                                            {player.posicao && typeof player.posicao === 'string' && player.posicao.trim() !== '' && <PlayerPosition>{player.posicao}</PlayerPosition>}
                                        </PlayerNameSection>
                                        <PlayerDetailsSection>
                                            <StatsSection>
                                                {player.gols > 0 && (
                                                    <StatIcon>
                                                        <SoccerBallIcon color="#007bff" size={18} />
                                                        {player.gols > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.gols || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.assistencias > 0 && (
                                                    <StatIcon>
                                                        <SneakerMoveIcon color="#007bff" size={18} />
                                                        {player.assistencias > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.assistencias || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.cartoesAmarelos > 0 && (
                                                    <StatIcon>
                                                        <SquareIcon color="#FFC107" size={18} />
                                                        {player.cartoesAmarelos > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.cartoesAmarelos || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.cartoesVermelhos > 0 && (
                                                    <StatIcon>
                                                        <SquareIcon color="#ff4d4d" size={18} />
                                                        {player.cartoesVermelhos > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.cartoesVermelhos || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                            </StatsSection>
                                            {typeof player.rating === 'number' && (
                                                <RatingSection>
                                                    <Rating rating={player.rating || 0}>{(player.rating || 0).toFixed(1)}</Rating>
                                                </RatingSection>
                                            )}
                                        </PlayerDetailsSection>
                                    </PlayerCardTeam>
                                </TouchableOpacity>
                            ))}
                            <AddPlayerButton onPress={() => handleAddPlayer(team1Name)}>
                                <Plus color="#2B6AE3" size={20} />
                                <AddPlayerText>Adicionar</AddPlayerText>
                            </AddPlayerButton>
                        </TeamSection>

                        <TeamSection>
                            {team2Players.map(player => (
                                <TouchableOpacity key={player.id} onPress={() => handlePlayerPress(player)}>
                                    <PlayerCardTeam>
                                        <PlayerNameSection>
                                            <PlayerName>{player.nome || 'Jogador'}</PlayerName>
                                            {player.posicao && typeof player.posicao === 'string' && player.posicao.trim() !== '' && <PlayerPosition>{player.posicao}</PlayerPosition>}
                                        </PlayerNameSection>
                                        <PlayerDetailsSection>
                                            <StatsSection>
                                                {player.gols > 0 && (
                                                    <StatIcon>
                                                        <SoccerBallIcon color="#007bff" size={18} />
                                                        {player.gols > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.gols || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.assistencias > 0 && (
                                                    <StatIcon>
                                                        <SneakerMoveIcon color="#007bff" size={18} />
                                                        {player.assistencias > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.assistencias || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.cartoesAmarelos > 0 && (
                                                    <StatIcon>
                                                        <SquareIcon color="#FFC107" size={18} />
                                                        {player.cartoesAmarelos > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.cartoesAmarelos || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.cartoesVermelhos > 0 && (
                                                    <StatIcon>
                                                        <SquareIcon color="#ff4d4d" size={18} />
                                                        {player.cartoesVermelhos > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.cartoesVermelhos || 0}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                            </StatsSection>
                                            {typeof player.rating === 'number' && (
                                                <RatingSection>
                                                    <Rating rating={player.rating || 0}>{(player.rating || 0).toFixed(1)}</Rating>
                                                </RatingSection>
                                            )}
                                        </PlayerDetailsSection>
                                    </PlayerCardTeam>
                                </TouchableOpacity>
                            ))}
                            <AddPlayerButton onPress={() => handleAddPlayer(team2Name)}>
                                <Plus color="#2B6AE3" size={20} />
                                <AddPlayerText>Adicionar</AddPlayerText>
                            </AddPlayerButton>
                        </TeamSection>
                    </PlayersSection>
                </ContentContainer>
            </MainContainer>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose={true}
            >
                <BottomSheetView style={{ flex: 1, padding: 24 }}>
                    {selectedPlayer ? (
                        <PlayerDetailsContainer>
                            <PlayerImageNamePositionContainer>
                                <PlayerImage />
                                <View>
                                    <PlayerNameSheet>{selectedPlayer.nome || 'Jogador'}</PlayerNameSheet>
                                    {showEditButton ? (
                                        <CompactSelectContainer>
                                            <Select
                                                open={positionPickerOpen}
                                                value={editablePlayer.posicaoId.toString()}
                                                items={positionItems}
                                                setOpen={setPositionPickerOpen}
                                                setValue={(callback) => {
                                                    const newPositionId = callback(editablePlayer.posicaoId.toString());
                                                    const selectedPosition = positions.find(pos => pos.id.toString() === newPositionId);
                                                    setEditablePlayer(prev => ({
                                                        ...prev,
                                                        posicaoId: parseInt(newPositionId),
                                                        posicao: selectedPosition?.nome || ''
                                                    }));
                                                }}
                                                setItems={setPositionItems}
                                                placeholder="Selecione a posição"
                                                zIndex={1000}
                                                zIndexInverse={3000}
                                            />
                                        </CompactSelectContainer>
                                    ) : (
                                        <PlayerPositionSheet>{selectedPlayer.posicao || 'Posição não definida'}</PlayerPositionSheet>
                                    )}
                                </View>
                            </PlayerImageNamePositionContainer>

                            <StatsFormContainer style={{ marginBottom: 24 }}>
                                <StatEditRow>
                                    <StatLabel>Gols</StatLabel>
                                    {showEditButton ? (
                                        <NumberInput
                                            value={editablePlayer.gols}
                                            onDecrease={() => handleStatChange('gols', -1)}
                                            onIncrease={() => handleStatChange('gols', 1)}
                                        />
                                    ) : (
                                        <StatValue>{selectedPlayer.gols}</StatValue>
                                    )}
                                </StatEditRow>
                                <StatEditRow>
                                    <StatLabel>Assistências</StatLabel>
                                    {showEditButton ? (
                                        <NumberInput
                                            value={editablePlayer.assistencias}
                                            onDecrease={() => handleStatChange('assistencias', -1)}
                                            onIncrease={() => handleStatChange('assistencias', 1)}
                                        />
                                    ) : (
                                        <StatValue>{selectedPlayer.assistencias}</StatValue>
                                    )}
                                </StatEditRow>
                                <StatEditRow>
                                    <StatLabel>Defesas</StatLabel>
                                    {showEditButton ? (
                                        <NumberInput
                                            value={editablePlayer.defesas}
                                            onDecrease={() => handleStatChange('defesas', -1)}
                                            onIncrease={() => handleStatChange('defesas', 1)}
                                        />
                                    ) : (
                                        <StatValue>{selectedPlayer.defesas}</StatValue>
                                    )}
                                </StatEditRow>
                                <StatEditRow>
                                    <StatLabel>Cartões Amarelos</StatLabel>
                                    {showEditButton ? (
                                        <NumberInput
                                            value={editablePlayer.cartoesAmarelos}
                                            onDecrease={() => handleStatChange('cartoesAmarelos', -1)}
                                            onIncrease={() => handleStatChange('cartoesAmarelos', 1)}
                                        />
                                    ) : (
                                        <StatValue>{selectedPlayer.cartoesAmarelos}</StatValue>
                                    )}
                                </StatEditRow>
                                <StatEditRow>
                                    <StatLabel>Cartões Vermelhos</StatLabel>
                                    {showEditButton ? (
                                        <NumberInput
                                            value={editablePlayer.cartoesVermelhos}
                                            onDecrease={() => handleStatChange('cartoesVermelhos', -1)}
                                            onIncrease={() => handleStatChange('cartoesVermelhos', 1)}
                                        />
                                    ) : (
                                        <StatValue>{selectedPlayer.cartoesVermelhos}</StatValue>
                                    )}
                                </StatEditRow>
                                <StatEditRow>
                                    <StatLabel>Nota</StatLabel>
                                    {showEditButton ? (
                                        <NumberInput
                                            value={editablePlayer.rating}
                                            onDecrease={() => handleStatChange('rating', -0.1)}
                                            onIncrease={() => handleStatChange('rating', 0.1)}
                                            isFloat={true}
                                        />
                                    ) : (
                                        <StatValue>{(selectedPlayer.rating || 0).toFixed(1)}</StatValue>
                                    )}
                                </StatEditRow>
                            </StatsFormContainer>

                            {showEditButton && (
                                <Button onPress={handleSaveChanges} disabled={savingStats}>
                                    <ButtonText>
                                        {savingStats ? "SALVANDO..." : "SALVAR ALTERAÇÕES"}
                                    </ButtonText>
                                </Button>
                            )}
                        </PlayerDetailsContainer>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <GameTitle style={{ marginBottom: 16 }}>Adicionar Jogador ao {editingTeam || 'Time'}</GameTitle>
                            {loadingPlayers ? (
                                <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }}>
                                    Carregando jogadores disponíveis...
                                </Text>
                            ) : availablePlayers.length > 0 ? (
                                availablePlayers.map((item) => (
                                    <PlayerCard
                                        key={item.id.toString()}
                                        nome={item.nome}
                                        foto={item.foto}
                                        posicoes={item.posicoes}
                                        onAdd={addingPlayer ? undefined : () => handleAddPlayerToTeam(item)}
                                    />
                                ))
                            ) : (
                                <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }}>
                                    Nenhum jogador disponível.
                                </Text>
                            )}
                            {addingPlayer && (
                                <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: '#2B6AE3' }}>
                                    Adicionando jogador ao time...
                                </Text>
                            )}
                        </View>
                    )}
                </BottomSheetView>
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

const TopButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Divider = styled.View`
  height: 2px;
  background-color: #d6dde0ff;
`;

const SubTitleContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 20px;
`;

const SubTitleText = styled.Text`
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: #2C2C2C;
`;

const GameCard = styled.View`
  margin-bottom: 32px;
`;

const GameTitle = styled.Text`
  font-size: ${typography["txt-1"].fontSize}px;
  font-family: ${typography["txt-1"].fontFamily};
  color: #2C2C2C;
  text-align: start;
  margin-bottom: 12px;
`;

const ScoreSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TeamName = styled.Text`
  text-align: left;
  font-size: ${typography["txt-1"].fontSize}px;
  font-family: ${typography["txt-1"].fontFamily};
  color: #2C2C2C;
  word-wrap: break-word; 
  width: 33%; 
`;

const Score = styled.Text`
  text-align: center; 
  font-size: ${typography["txt-1"].fontSize}px;
  font-family: ${typography["txt-1"].fontFamily};
  color: #2C2C2C;
  width: 33%; 

`;

const TeamNameRight = styled.Text`
  text-align: right;
  font-size: ${typography["txt-1"].fontSize}px;
  font-family: ${typography["txt-1"].fontFamily};
  color: #2C2C2C;
  width: 33%;
`;

const PlayersSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 16px; 
`;

const TeamSection = styled.View`
  flex: 1;
`;

const PlayerCardTeam = styled.View`
  border-bottom-width: 2px;
  border-bottom-color: #B0BEC5;
  padding: 6px 0;
`;

const PlayerNameSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const PlayerName = styled.Text`
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: #2C2C2C;
`;

const PlayerDetailsSection = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;

const StatsSection = styled.View`
  flex: 2;
  flex-direction: row;
  justify-content: flex-end;
  gap: 8px;
  margin-right: 16px;
`;

const RatingSection = styled.View`
  align-items: end;
`;

const PlayerPosition = styled.Text`
  font-size: ${typography["txt-3"].fontSize}px;
  font-family: ${typography["txt-3"].fontFamily};
  color: #2C2C2C;
  font-weight: bold;
`;

const StatIcon = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 4px;
`;

const Rating = styled.Text<{ rating: number }>`
  font-size: ${typography["txt-2"].fontSize}px;
  font-family: ${typography["txt-2"].fontFamily};
  color: white;
  background-color: ${({ rating }) => {
    const r = rating || 0;
    return r < 4 ? '#FF4D4D' : r <= 7 ? '#FFC107' : '#4CAF50';
  }};
  padding: 2px 8px;
  border-radius: 2px;
`;

const Badge = styled.View`
 position: absolute;
  top: -6px;
right: -10px;
  background-color: #FF4D4D;
  border-radius: 8px;
  padding: 2px 6px;
  margin-left: 4px;
`;

const BadgeText = styled.Text`
  font-size: 10px;
  font-family: ${typography["txt-3"].fontFamily};
  color: white;
  font-weight: bold;
`;

const AddPlayerButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
`;

const AddPlayerText = styled.Text`
  font-size: ${typography["btn-2"].fontSize}px;
  font-family: ${typography["btn-2"].fontFamily};
  color: #2B6AE3;
  margin-left: 8px;
`;

const PlayerDetailsContainer = styled.View`
    align-items: start;
    width: 100%;
`;

const PlayerImageNamePositionContainer = styled.View`
    flex-direction: row;
    gap: 16px;
    align-items: start;
`;

const PlayerImage = styled.View`
    width: 100px;
    height: 100px;
    border-radius: 50px;
    background-color: #E0E0E0;
    margin-bottom: 16px;
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

const CompactSelectContainer = styled.View`
    width: 80%;
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

const StatValue = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: #333;
`;