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
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft, Plus } from 'lucide-react-native';
import { DiamondIcon, SneakerMoveIcon, SoccerBallIcon } from 'phosphor-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Float } from 'react-native/Libraries/Types/CodegenTypes';
import styled from 'styled-components/native';
import BASE_URL from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

interface GamePlayer {
    id: number;
    nome: string;
    time: string;
    posicao: string;
    gols: number;
    assistencias: number;
    cartoes: number;
    rating: Float;
    foto?: string;
    posicoes?: string[];
}

interface AvailablePlayer {
    id: number;
    nome: string;
    foto: string;
    posicoes: string[];
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

const POSICOES = ['GK', 'LD', 'ZAG', 'LE', 'VOL', 'MC', 'PE', 'PD', 'CA'];

export default function GameDetailsScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
    const [showEditButton, setShowEditButton] = useState(true);
    const [editingTeam, setEditingTeam] = useState<string | null>(null);
    const [selectedPlayer, setSelectedPlayer] = useState<GamePlayer | null>(null);
    const [editablePlayer, setEditablePlayer] = useState({ gols: 0, assistencias: 0, cartoes: 0, rating: 0.0, posicao: '' });
    const [availablePlayers, setAvailablePlayers] = useState<AvailablePlayer[]>([]);

    const [positionPickerOpen, setPositionPickerOpen] = useState(false);
    const [positionItems, setPositionItems] = useState(POSICOES.map(p => ({ label: p, value: p })));

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['100%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
        if (index === -1) {
            setEditingTeam(null);
            setSelectedPlayer(null);
            setPositionPickerOpen(false);
        }
    }, []);

    const handleAddPlayer = (teamName: string) => {
        setEditingTeam(teamName);
        setSelectedPlayer(null);
        bottomSheetRef.current?.expand();
    };

    const handlePlayerPress = (player: GamePlayer) => {
        setSelectedPlayer(player);
        setEditablePlayer({
            gols: player.gols,
            assistencias: player.assistencias,
            cartoes: player.cartoes,
            rating: player.rating,
            posicao: player.posicao
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
            return { ...prev, [stat]: Math.max(0, newValue) };
        });
    };

    const handleSaveChanges = () => {
        if (!selectedPlayer || !gameDetails) return;

        const updatedJogadores = gameDetails.jogadores.map(p =>
            p.id === selectedPlayer.id ? { ...p, ...editablePlayer } : p
        );

        setGameDetails({ ...gameDetails, jogadores: updatedJogadores });
        bottomSheetRef.current?.close();
    };

    const handleAddPlayerToTeam = (player: AvailablePlayer) => {
        if (!gameDetails || !editingTeam) return;

        const newPlayer: GamePlayer = {
            ...player,
            id: Math.random(),
            time: editingTeam,
            posicao: player.posicoes[0] || 'ZAG',
            gols: 0,
            assistencias: 0,
            cartoes: 0,
            rating: 5.0,
        };

        setGameDetails(prev => prev ? { ...prev, jogadores: [...prev.jogadores, newPlayer] } : null);

        setAvailablePlayers(prev => prev.filter(p => p.id !== player.id));
        bottomSheetRef.current?.close();
    };

    useEffect(() => {
        if (!id) {
            console.error("ID do jogo não foi fornecido.");
            return;
        }

        async function fetchGameDetails() {
            try {
                const headers = await authHeaders();
                const response = await fetch(`${BASE_URL}/jogos/${id}`, { headers });

                if (!response.ok) {
                    throw new Error("Erro ao buscar detalhes do jogo");
                }

                const data = await response.json();
                setGameDetails(data);
            } catch (error) {

                setGameDetails({
                    id: Number(id),
                    titulo: 'Primeiro jogo',
                    time1: 'Vermelho',
                    time2: 'Verde',
                    placar1: 1,
                    placar2: 1,
                    data: '2025-09-07',
                    hora_inicio: '15:00',
                    local: 'Estádio Municipal',
                    tipo_partida_nome: 'Campo',
                    jogadores: [

                        { id: 1, nome: 'Raphael Silva', time: 'Vermelho', posicao: 'GK', gols: 0, assistencias: 0, cartoes: 0, rating: 7.5, foto: 'https://i.pravatar.cc/150?img=1' },
                        { id: 2, nome: 'Carlos Lima', time: 'Vermelho', posicao: 'LD', gols: 0, assistencias: 1, cartoes: 0, rating: 6.8, foto: 'https://i.pravatar.cc/150?img=2' },
                        { id: 3, nome: 'Gomes Santos', time: 'Vermelho', posicao: 'ZAG', gols: 1, assistencias: 0, cartoes: 0, rating: 7.2, foto: 'https://i.pravatar.cc/150?img=3' },
                        { id: 4, nome: 'Ricardo Costa', time: 'Vermelho', posicao: 'ZAG', gols: 0, assistencias: 0, cartoes: 1, rating: 6.5, foto: 'https://i.pravatar.cc/150?img=4' },
                        { id: 5, nome: 'Felipe Rocha', time: 'Vermelho', posicao: 'LE', gols: 0, assistencias: 0, cartoes: 0, rating: 6.0, foto: 'https://i.pravatar.cc/150?img=5' },
                        { id: 6, nome: 'João Pedro', time: 'Vermelho', posicao: 'VOL', gols: 0, assistencias: 0, cartoes: 0, rating: 6.8, foto: 'https://i.pravatar.cc/150?img=6' },
                        { id: 7, nome: 'Miguel Souza', time: 'Vermelho', posicao: 'MC', gols: 0, assistencias: 1, cartoes: 0, rating: 7.0, foto: 'https://i.pravatar.cc/150?img=7' },
                        { id: 8, nome: 'Lucas Mendes', time: 'Vermelho', posicao: 'VOL', gols: 0, assistencias: 0, cartoes: 0, rating: 6.5, foto: 'https://i.pravatar.cc/150?img=8' },
                        { id: 9, nome: 'Diego Alves', time: 'Vermelho', posicao: 'PE', gols: 1, assistencias: 0, cartoes: 0, rating: 7.8, foto: 'https://i.pravatar.cc/150?img=9' },
                        { id: 10, nome: 'Bruno Ferreira', time: 'Vermelho', posicao: 'CA', gols: 2, assistencias: 0, cartoes: 0, rating: 8.5, foto: 'https://i.pravatar.cc/150?img=10' },
                        { id: 11, nome: 'André Oliveira', time: 'Vermelho', posicao: 'PD', gols: 0, assistencias: 1, cartoes: 0, rating: 7.0, foto: 'https://i.pravatar.cc/150?img=11' },


                        { id: 12, nome: 'Marcos Silva', time: 'Verde', posicao: 'GK', gols: 0, assistencias: 0, cartoes: 0, rating: 7.0, foto: 'https://i.pravatar.cc/150?img=12' },
                        { id: 13, nome: 'Gabriel Santos', time: 'Verde', posicao: 'LD', gols: 0, assistencias: 0, cartoes: 0, rating: 6.5, foto: 'https://i.pravatar.cc/150?img=13' },
                        { id: 14, nome: 'Rafael Mendes', time: 'Verde', posicao: 'ZAG', gols: 0, assistencias: 0, cartoes: 0, rating: 6.8, foto: 'https://i.pravatar.cc/150?img=14' },
                        { id: 15, nome: 'Thiago Lima', time: 'Verde', posicao: 'ZAG', gols: 0, assistencias: 0, cartoes: 0, rating: 6.5, foto: 'https://i.pravatar.cc/150?img=15' },
                        { id: 16, nome: 'Eduardo Rocha', time: 'Verde', posicao: 'LE', gols: 0, assistencias: 0, cartoes: 0, rating: 6.0, foto: 'https://i.pravatar.cc/150?img=16' },
                        { id: 17, nome: 'Fernando Oliveira', time: 'Verde', posicao: 'VOL', gols: 0, assistencias: 0, cartoes: 0, rating: 6.8, foto: 'https://i.pravatar.cc/150?img=17' },
                        { id: 18, nome: 'Rodrigo Silva', time: 'Verde', posicao: 'MC', gols: 0, assistencias: 1, cartoes: 0, rating: 7.0, foto: 'https://i.pravatar.cc/150?img=18' },
                        { id: 19, nome: 'Alex Ferreira', time: 'Verde', posicao: 'VOL', gols: 0, assistencias: 0, cartoes: 0, rating: 6.5, foto: 'https://i.pravatar.cc/150?img=19' },
                        { id: 20, nome: 'Vítor Alves', time: 'Verde', posicao: 'PE', gols: 1, assistencias: 0, cartoes: 0, rating: 7.8, foto: 'https://i.pravatar.cc/150?img=20' },
                        { id: 21, nome: 'Raphael Silva', time: 'Verde', posicao: 'CA', gols: 2, assistencias: 0, cartoes: 0, rating: 9.4, foto: 'https://i.pravatar.cc/150?img=21' },
                        { id: 22, nome: 'Felipe Costa', time: 'Verde', posicao: 'PD', gols: 0, assistencias: 1, cartoes: 0, rating: 7.0, foto: 'https://i.pravatar.cc/150?img=22' },
                    ],
                });

                setAvailablePlayers([
                    { id: 101, nome: 'Jorge Jesus', foto: 'https://i.pravatar.cc/150?img=51', posicoes: ['ZAG', 'VOL'] },
                    { id: 102, nome: 'Abel Ferreira', foto: 'https://i.pravatar.cc/150?img=52', posicoes: ['MC'] },
                    { id: 103, nome: 'Renato Gaúcho', foto: 'https://i.pravatar.cc/150?img=53', posicoes: ['CA', 'PE'] },
                ]);
            }
        }

        fetchGameDetails();
    }, [id]);

    if (!gameDetails) {
        return (
            <MainContainer>
                <TitlePageTabs>Carregando detalhes do jogo...</TitlePageTabs>
            </MainContainer>
        );
    }

    const team1Players = gameDetails.jogadores.filter(player => player.time === gameDetails.time1);
    const team2Players = gameDetails.jogadores.filter(player => player.time === gameDetails.time2);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <MainContainer>
                <TopButtonsContainer>
                    <BackButtonTab onPress={() => router.back()}>
                        <CircleArrowLeft color="#2B6AE3" size={50} />
                    </BackButtonTab>
                </TopButtonsContainer>

                <TitlePageTabs style={{ marginBottom: 8 }}>{gameDetails.local}</TitlePageTabs>
                <Divider />
                <SubTitleContainer>
                    <SubTitleText>
                        {gameDetails.data} às {gameDetails.hora_inicio}
                    </SubTitleText>
                    <SubTitleText>{gameDetails.tipo_partida_nome}</SubTitleText>
                </SubTitleContainer>

                <ContentContainer>
                    <GameCard>
                        <GameTitle>{gameDetails.titulo}</GameTitle>
                        <ScoreSection>
                            <TeamName>{gameDetails.time1}</TeamName>
                            <Score>{gameDetails.placar1} x {gameDetails.placar2}</Score>
                            <TeamNameRight>{gameDetails.time2}</TeamNameRight>
                        </ScoreSection>
                    </GameCard>

                    <PlayersSection>
                        <TeamSection>
                            {team1Players.map(player => (
                                <TouchableOpacity key={player.id} onPress={() => handlePlayerPress(player)}>
                                    <PlayerCardTeam>
                                        <PlayerNameSection>
                                            <PlayerName>{player.nome}</PlayerName>
                                            {player.posicao && <PlayerPosition>{player.posicao}</PlayerPosition>}
                                        </PlayerNameSection>
                                        <PlayerDetailsSection>
                                            <StatsSection>
                                                {player.gols > 0 && (
                                                    <StatIcon>
                                                        <SoccerBallIcon color="#007bff" size={18} />
                                                        {player.gols > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.gols}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.assistencias > 0 && (
                                                    <StatIcon>
                                                        <SneakerMoveIcon color="#007bff" size={18} />
                                                        {player.assistencias > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.assistencias}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.cartoes > 0 && (
                                                    <StatIcon>
                                                        <DiamondIcon color="#ff4d4d" size={18} />
                                                        {player.cartoes > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.cartoes}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                            </StatsSection>
                                            {player.rating && (
                                                <RatingSection>
                                                    <Rating rating={player.rating}>{player.rating.toFixed(1)}</Rating>
                                                </RatingSection>
                                            )}
                                        </PlayerDetailsSection>
                                    </PlayerCardTeam>
                                </TouchableOpacity>
                            ))}
                            <AddPlayerButton onPress={() => handleAddPlayer(gameDetails.time1)}>
                                <Plus color="#2B6AE3" size={20} />
                                <AddPlayerText>Adicionar</AddPlayerText>
                            </AddPlayerButton>
                        </TeamSection>

                        <TeamSection>
                            {team2Players.map(player => (
                                <TouchableOpacity key={player.id} onPress={() => handlePlayerPress(player)}>
                                    <PlayerCardTeam>
                                        <PlayerNameSection>
                                            <PlayerName>{player.nome}</PlayerName>
                                            {player.posicao && <PlayerPosition>{player.posicao}</PlayerPosition>}
                                        </PlayerNameSection>
                                        <PlayerDetailsSection>
                                            <StatsSection>
                                                {player.gols > 0 && (
                                                    <StatIcon>
                                                        <SoccerBallIcon color="#007bff" size={18} />
                                                        {player.gols > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.gols}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.assistencias > 0 && (
                                                    <StatIcon>
                                                        <SneakerMoveIcon color="#007bff" size={18} />
                                                        {player.assistencias > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.assistencias}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                                {player.cartoes > 0 && (
                                                    <StatIcon>
                                                        <DiamondIcon color="#ff4d4d" size={18} />
                                                        {player.cartoes > 1 && (
                                                            <Badge>
                                                                <BadgeText>{player.cartoes}</BadgeText>
                                                            </Badge>
                                                        )}
                                                    </StatIcon>
                                                )}
                                            </StatsSection>
                                            {player.rating && (
                                                <RatingSection>
                                                    <Rating rating={player.rating}>{player.rating.toFixed(1)}</Rating>
                                                </RatingSection>
                                            )}
                                        </PlayerDetailsSection>
                                    </PlayerCardTeam>
                                </TouchableOpacity>
                            ))}
                            <AddPlayerButton onPress={() => handleAddPlayer(gameDetails.time2)}>
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
                                    <PlayerNameSheet>{selectedPlayer.nome}</PlayerNameSheet>
                                    {showEditButton ? (
                                        <CompactSelectContainer>
                                            <Select
                                                open={positionPickerOpen}
                                                value={editablePlayer.posicao}
                                                items={positionItems}
                                                setOpen={setPositionPickerOpen}
                                                setValue={(callback) => {
                                                    const newPosition = callback(editablePlayer.posicao);
                                                    setEditablePlayer(prev => ({ ...prev, posicao: newPosition }));
                                                }}
                                                setItems={setPositionItems}
                                                placeholder="Selecione a posição"
                                                zIndex={1000}
                                                zIndexInverse={3000}
                                            />
                                        </CompactSelectContainer>
                                    ) : (
                                        <PlayerPositionSheet>{selectedPlayer.posicao}</PlayerPositionSheet>
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
                                    <StatLabel>Cartões</StatLabel>
                                    {showEditButton ? (
                                        <NumberInput
                                            value={editablePlayer.cartoes}
                                            onDecrease={() => handleStatChange('cartoes', -1)}
                                            onIncrease={() => handleStatChange('cartoes', 1)}
                                        />
                                    ) : (
                                        <StatValue>{selectedPlayer.cartoes}</StatValue>
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
                                        <StatValue>{selectedPlayer.rating.toFixed(1)}</StatValue>
                                    )}
                                </StatEditRow>
                            </StatsFormContainer>

                            {showEditButton && (
                                <Button onPress={handleSaveChanges}>
                                    <ButtonText>SALVAR ALTERAÇÕES</ButtonText>
                                </Button>
                            )}
                        </PlayerDetailsContainer>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <GameTitle style={{ marginBottom: 16 }}>Adicionar Jogador ao {editingTeam}</GameTitle>
                            {availablePlayers.length > 0 ? (
                                availablePlayers.map((item) => (
                                    <PlayerCard
                                        key={item.id.toString()}
                                        nome={item.nome}
                                        foto={item.foto}
                                        posicoes={item.posicoes}
                                        onAdd={() => handleAddPlayerToTeam(item)}
                                    />
                                ))
                            ) : (
                                <Text>Nenhum jogador disponível.</Text>
                            )}
                        </View>
                    )}
                </BottomSheetView>
            </BottomSheet>
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
  background-color: ${({ rating }) =>
        rating < 4 ? '#FF4D4D' : rating <= 7 ? '#FFC107' : '#4CAF50'};
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
    width: 120px;
    max-width: 120px;
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