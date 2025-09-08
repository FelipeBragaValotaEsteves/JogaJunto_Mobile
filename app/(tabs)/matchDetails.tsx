import { BackButtonTab } from '@/components/shared/BackButton';
import GameCard from '@/components/shared/GameCard';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import typography from '@/constants/typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft, CirclePlus, CircleX, Edit, Users } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import { ContentContainer } from '../../components/shared/ContentContainer';
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

export default function MatchDetailsScreen() {
    const router = useRouter();
    const { id, source } = useLocalSearchParams();
    const [matchDetails, setMatchDetails] = useState<any>(null);
    const [games, setGames] = useState<any[]>([]);

    const showEditButton = source === 'createdMatches';

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

    useEffect(() => {
        if (!id) {
            console.error("ID da partida não foi fornecido.");
            return;
        }

        async function fetchMatchDetails() {
            try {
                const headers = await authHeaders();
                const response = await fetch(`${BASE_URL}/partidas/${id}`, { headers });

                if (!response.ok) {
                    throw new Error("Erro ao buscar detalhes da partida");
                }

                const data = await response.json();

                setMatchDetails(data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchMatchDetails();
    }, [id]);

    useEffect(() => {
        async function fetchGames() {
            try {
                const headers = await authHeaders();
                const response = await fetch(`${BASE_URL}/partidas/resumo/${id}`, { headers });

                if (!response.ok) {
                    throw new Error("Erro ao buscar jogos");
                }

                const data = await response.json();

                const formattedGames = data.map((jogo: any) => {
                    const time1 = jogo.times[0];
                    const time2 = jogo.times[1];

                    return {
                        id: jogo.jogoId,
                        titulo: `Jogo ${jogo.jogoId}`,
                        time1: time1?.nome || "",
                        time2: time2?.nome || "",
                        placar1: time1?.totais?.gols || 0,
                        placar2: time2?.totais?.gols || 0,
                        eventos: [
                            ...(time1?.jogadores?.flatMap((jogador: any) => 
                                Object.entries(jogador.eventos || {})
                                    .filter(([evento, valor]) => Number(valor) > 0)
                                    .map(([evento, valor]) => ({
                                        type: evento,
                                        player: jogador.nome,
                                        team: time1.nome,
                                        value: valor,
                                    }))
                            ) || []),
                            ...(time2?.jogadores?.flatMap((jogador: any) => 
                                Object.entries(jogador.eventos || {})
                                    .filter(([evento, valor]) => Number(valor) > 0)
                                    .map(([evento, valor]) => ({
                                        type: evento,
                                        player: jogador.nome,
                                        team: time2.nome,
                                        value: valor,
                                    }))
                            ) || [])
                        ],
                    };
                });

                setGames(formattedGames);
            } catch (error) {
                console.error("Erro ao buscar jogos:", error);
            }
        }

        if (id) {
            fetchGames();
        }
    }, [id]);

    const handleEdit = () => {
        if (!matchDetails) return;

        router.push({
            pathname: "/(tabs)/match",
            params: {
                id: matchDetails.id,
                local: matchDetails.local,
                data: matchDetails.data,
                hora_inicio: matchDetails.hora_inicio,
                hora_fim: matchDetails.hora_fim,
                rua: matchDetails.rua || "",
                bairro: matchDetails.bairro || "",
                numero: matchDetails.numero || "",
                estado_id: matchDetails.estado_id || "",
                cidade_id: matchDetails.cidade_id || "",
                tipo_partida_id: matchDetails.tipo_partida_id || "",
                aberto: matchDetails.aberto || false,
            },
        });
    };

    const handleCancelMatch = async () => {
        if (!matchDetails) return;

        showAlert(
            'warning',
            'Confirmar Cancelamento',
            'Tem certeza que deseja cancelar esta partida? Esta ação não pode ser desfeita.',
            async () => {
                try {
                    const headers = await authHeaders();
                    const response = await fetch(`${BASE_URL}/partidas/cancelar/${matchDetails.id}`, {
                        method: 'POST',
                        headers,
                    });

                    if (!response.ok) {
                        throw new Error("Erro ao cancelar a partida");
                    }

                    showAlert(
                        'success',
                        'Partida Cancelada',
                        'A partida foi cancelada com sucesso.',
                        () => {
                            router.back();
                        }
                    );
                } catch (error) {
                    console.error("Erro ao cancelar partida:", error);
                    showAlert(
                        'error',
                        'Erro',
                        'Não foi possível cancelar a partida. Tente novamente.'
                    );
                }
            }
        );
    };

    const handleViewPlayers = () => {
        if (!matchDetails) return;

        router.push({
            pathname: "/(tabs)/matchPlayers",
            params: {
                matchId: matchDetails.id,
                showEditButton: showEditButton ? 'true' : 'false',
            },
        });
    };

    if (!matchDetails || Object.keys(matchDetails).length === 0) {
        return (
            <MainContainer>
                <TitlePageTabs>Erro ao carregar os detalhes da partida.</TitlePageTabs>
            </MainContainer>
        );
    }

    const { time, formattedDate } = formatDateTime(matchDetails.data, matchDetails.hora_inicio);

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => router.back()}>
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
                <ButtonsContainer>
                    {showEditButton && (
                        <>
                            <CancelButton onPress={handleCancelMatch}>
                                <CircleX color="#E53E3E" size={30} />
                            </CancelButton>
                            <EditButton onPress={handleEdit}>
                                <Edit color="#2B6AE3" size={30} />
                            </EditButton>
                        </>
                    )}

                    <PlayersButton onPress={handleViewPlayers}>
                        <Users color="#2B6AE3" size={30} />
                    </PlayersButton>
                </ButtonsContainer>

            </TopButtonsContainer>

            <TitlePageTabs style={{ marginBottom: 8 }}>{matchDetails.local}</TitlePageTabs>
            <Divider />
            <SubTitleContainer>
                <SubTitleText>
                    {formattedDate} às {time}
                </SubTitleText>
                <SubTitleText>{matchDetails.tipo_partida_nome}</SubTitleText>
            </SubTitleContainer>

            {games.map((jogo, index) => (
                <GameCard
                    key={index}
                    title={jogo.titulo}
                    team1={jogo.time1}
                    team2={jogo.time2}
                    score1={jogo.placar1}
                    score2={jogo.placar2}
                    events={jogo.eventos}
                    onViewPress={() => {
                        router.push({
                            pathname: "/(tabs)/gameDetails",
                            params: {
                                id: jogo.id,
                            },
                        });
                    }}
                />
            ))}

            <ContentContainer>
                <AddGameButton onPress={() => console.log("Adicionar novo jogo")}>
                    <CirclePlus color="#B0BEC5" size={64} />
                </AddGameButton>
            </ContentContainer>

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

const Divider = styled.View`
  height: 2px;
  background-color: #d6dde0ff;
`;

const AddGameButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  margin: 30px 0;
`;

const EditButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 10px;
`;

const CancelButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 10px;
`;

const PlayersButton = styled.TouchableOpacity`
  padding: 8px 12px;
  border-radius: 8px;
  margin-left: 10px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;


