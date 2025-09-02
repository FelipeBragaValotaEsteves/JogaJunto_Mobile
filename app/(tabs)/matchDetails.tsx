import { BackButtonTab } from '@/components/shared/BackButton';
import GameCard from '@/components/shared/GameCard';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import typography from '@/constants/typography';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft, CirclePlus, Edit, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import { ContentContainer } from '../../components/shared/ContentContainer';
import BASE_URL from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

function formatDateTime(data: string, hora: string): { time: string; formattedDate: string } {
    let dateObj: Date;
    if (data.includes('-')) {
        const [year, month, day] = data.split('-').map(Number);
        dateObj = new Date(year, month - 1, day);
    } else {
        dateObj = new Date(parseInt(data));
    }
    
    const time = hora.slice(0, 5); 
    let dayOfWeek = dateObj.toLocaleDateString('pt-BR', { weekday: 'long' });
    dayOfWeek = dayOfWeek.replace('-feira', '');
    dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('pt-BR', { month: 'long' });
    return { time, formattedDate: `${dayOfWeek}, ${day} de ${month}` };
}

const mockGames = [
    {
        id: 1,
        titulo: 'Primeiro jogo',
        time1: 'Vermelho',
        time2: 'Verde',
        placar1: 1,
        placar2: 1,
        eventos: [
            { type: 'goal', player: 'Raphael', team: 'Verde' },
            { type: 'goal', player: 'Gomes', team: 'Vermelho' },
            { type: 'card', player: 'Raphael', team: 'Verde' },
            { type: 'assist', player: 'Felipe', team: 'Verde' },
        ],
    },
];

export default function MatchDetailsScreen() {
    const router = useRouter();
    const { id, source } = useLocalSearchParams(); 
    const [matchDetails, setMatchDetails] = useState<any>(null);

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
                {showEditButton && (
                    <ButtonsContainer>
                        <CancelButton onPress={handleCancelMatch}>
                            <X color="#E53E3E" size={30} />
                        </CancelButton>
                        <EditButton onPress={handleEdit}>
                            <Edit color="#2B6AE3" size={30} />
                        </EditButton>
                    </ButtonsContainer>
                )}
            </TopButtonsContainer>

            <TitlePageTabs style={{ marginBottom: 8 }}>{matchDetails.local}</TitlePageTabs>
            <Divider />
            <SubTitleContainer>
                <SubTitleText>
                    {formattedDate} às {time}
                </SubTitleText>
                <SubTitleText>{matchDetails.tipo_partida_nome}</SubTitleText>
            </SubTitleContainer>

            {mockGames.map((jogo, index) => (
                <GameCard
                    key={index}
                    title={jogo.titulo}
                    team1={jogo.time1}
                    team2={jogo.time2}
                    score1={jogo.placar1}
                    score2={jogo.placar2}
                    events={jogo.eventos}
                    onViewPress={() => console.log(`Visualizar jogo ${jogo.id}`)}
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

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;


