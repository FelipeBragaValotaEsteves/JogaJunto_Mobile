import { BackButtonTab } from '@/components/shared/BackButton';
import { Checkbox } from '@/components/shared/Checkbox';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import { Button, ButtonText } from '../../components/shared/Button';
import { DatePicker } from '../../components/shared/DatePicker';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { TimePicker } from '../../components/shared/TimePicker';
import BASE_URL from "../../constants/config";
import { authHeaders } from '../../utils/authHeaders';

async function fetchMatchDetails(matchId: string) {
    const headers = await authHeaders();
    const response = await fetch(`${BASE_URL}/partidas/${matchId}`, {
        headers,
    });

    if (!response.ok) {
        throw new Error("Erro ao buscar detalhes da partida");
    }

    return await response.json();
}

export default function MatchScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const [currentPhase, setCurrentPhase] = useState(1);
    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [horaInicial, setHoraInicial] = useState('');
    const [horaFinal, setHoraFinal] = useState('');
    const [valor, setValor] = useState('');
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [estado, setEstado] = useState<number | null>(null);
    const [estados, setEstados] = useState<any[]>([]);
    const [openEstado, setOpenEstado] = useState(false);
    const [cidades, setCidades] = useState<any[]>([]);
    const [cidade, setCidade] = useState<number | null>(null);
    const [openCidade, setOpenCidade] = useState(false);
    const [itemsTipo, setItemsTipo] = useState<{ label: string; value: string | number }[]>([]);
    const [tipo, setTipo] = useState<number | null>(null);
    const [openTipo, setOpenTipo] = useState(false);
    const [aceitaJogadoresDeFora, setAceitaJogadoresDeFora] = useState(false);

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

    const resetForm = () => {
        setCurrentPhase(1);
        setNome('');
        setData('');
        setHoraInicial('');
        setHoraFinal('');
        setValor('');
        setRua('');
        setBairro('');
        setNumero('');
        setEstado(null);
        setCidade(null);
        setTipo(null);
        setAceitaJogadoresDeFora(false);
    };

    useFocusEffect(
        useCallback(() => {
            resetForm();

            if (id) {
                const matchId = Array.isArray(id) ? id[0] : id;
                fetchMatchDetails(matchId).then((data) => {
                    setNome(data.local || '');
                    setData(data.data ? data.data : '');
                    setHoraInicial(data.hora_inicio ? data.hora_inicio.slice(0, 5) : '');
                    setHoraFinal(data.hora_fim ? data.hora_fim.slice(0, 5) : '');
                    setValor(data.valor || '');
                    setRua(data.rua || '');
                    setBairro(data.bairro || '');
                    setNumero(data.numero ? String(data.numero) : '');
                    setEstado(data.estado_id || null);
                    setCidade(data.cidade_id || null);
                    setTipo(data.tipo_partida_id || null);
                    setAceitaJogadoresDeFora(data.aberto || false);
                }).catch((error) => {
                    console.error(error);
                    showAlert('error', 'Erro', 'Não foi possível carregar os detalhes da partida.');
                });
            }
        }, [id])
    );

    useEffect(() => {
        const fetchEstados = async () => {
            try {
                const headers = await authHeaders();
                const response = await fetch(`${BASE_URL}/estados`, { headers });
                if (!response.ok) {
                    throw new Error('Erro ao buscar estados');
                }
                const data = await response.json();
                setEstados(data.map((estado: any) => ({ label: estado.nome, value: estado.id })));
            } catch (error) {
                console.error(error);
                showAlert('error', 'Erro', 'Não foi possível carregar os estados.');
            }
        };

        fetchEstados();
    }, []);

    useEffect(() => {
        if (estado) {
            const fetchCidades = async () => {
                try {
                    const headers = await authHeaders();
                    const response = await fetch(`${BASE_URL}/cidades/${estado}`, { headers });
                    if (!response.ok) {
                        throw new Error('Erro ao buscar cidades');
                    }
                    const data = await response.json();
                    setCidades(data.map((cidade: any) => ({ label: cidade.nome, value: cidade.id })));
                } catch (error) {
                    console.error(error);
                    showAlert('error', 'Erro', 'Não foi possível carregar as cidades.');
                }
            };

            fetchCidades();
        }
    }, [estado]);

    useEffect(() => {
        const fetchTiposPartida = async () => {
            try {
                const headers = await authHeaders();
                const response = await fetch(`${BASE_URL}/tipos`, { headers });
                if (!response.ok) {
                    throw new Error('Erro ao buscar tipos de partida');
                }
                const data = await response.json();
                setItemsTipo(data.map((tipo: any) => ({ label: tipo.nome, value: tipo.id })));
            } catch (error) {
                console.error(error);
                showAlert('error', 'Erro', 'Não foi possível carregar os tipos de partida.');
            }
        };

        fetchTiposPartida();
    }, []);

    function formatCurrency(value: string): string {
        const numericValue = value.replace(/\D/g, ""); 
        const formattedValue = (Number(numericValue) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
        return formattedValue;
    }

    function parseCurrency(value: string): number {
        return Number(value.replace(/[^0-9,-]+/g, "").replace(",", ".")); 
    }

    const salvarPartida = async () => {
        try {
            const headers = await authHeaders();

            if (!tipo) {
                showAlert('error', 'Erro', 'Tipo é obrigatório.');
                return;
            }

            const partida = {
                local: nome,
                rua,
                bairro,
                numero: numero ? parseInt(numero, 10) : undefined,
                cidade_id: cidade ?? null,
                aberto: aceitaJogadoresDeFora,
                data: data || undefined,
                hora_inicio: horaInicial || undefined,
                hora_fim: horaFinal || undefined,
                tipo_partida_id: tipo ?? null,
                valor: valor ? parseCurrency(valor) : undefined, 
            };

            const method = id ? 'PUT' : 'POST';
            const url = id
                ? `${BASE_URL}/partidas/${id}`
                : `${BASE_URL}/partidas`;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                },
                body: JSON.stringify(partida),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao salvar a partida');
            }

            showAlert(
                'success',
                'Sucesso',
                id ? 'Partida atualizada com sucesso!' : 'Partida cadastrada com sucesso!'
            );

            resetForm();
            router.back();
        } catch (error) {
            showAlert('error', 'Erro', error instanceof Error ? error.message : 'Erro ao salvar a partida');
        }
    };

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => router.back()} >
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
            </TopButtonsContainer>

            <TitlePageTabs>Horário</TitlePageTabs>

            <ProgressContainer>
                <ProgressStep active={currentPhase >= 1} />
                <ProgressStep active={currentPhase >= 2} />
                <ProgressStep active={currentPhase >= 3} />
            </ProgressContainer>

            <ContentContainer>
                {currentPhase === 1 && (
                    <>
                        <Input
                            placeholder="Local"
                            value={nome}
                            onChangeText={setNome}
                        />

                        <DatePicker
                            placeholder="Data"
                            value={data}
                            onChange={setData}
                        />

                        <TimePicker
                            placeholder="Horário Inicial"
                            value={horaInicial}
                            onChange={setHoraInicial}
                        />

                        <TimePicker
                            placeholder="Horário Final"
                            value={horaFinal}
                            onChange={setHoraFinal}
                        />

                        <Select
                            open={openTipo}
                            value={tipo}
                            items={itemsTipo}
                            setOpen={setOpenTipo}
                            setValue={setTipo}
                            setItems={setItemsTipo}
                            placeholder="Selecione o tipo"
                            zIndex={2000}
                        />
                    </>
                )}

                {currentPhase === 2 && (
                    <>
                        <Input
                            placeholder="Rua (opcional)"
                            value={rua}
                            onChangeText={setRua}
                        />

                        <Input
                            placeholder="Bairro (opcional)"
                            value={bairro}
                            onChangeText={setBairro}
                        />

                        <Input
                            placeholder="Número (opcional)"
                            value={numero}
                            onChangeText={setNumero}
                            keyboardType="numeric"
                        />

                        <Select
                            open={openEstado}
                            value={estado}
                            items={estados}
                            setOpen={setOpenEstado}
                            setValue={setEstado}
                            setItems={setEstados}
                            placeholder="Selecione o estado"
                            zIndex={2000}
                        />

                        <Select
                            open={openCidade}
                            value={cidade}
                            items={cidades}
                            setOpen={setOpenCidade}
                            setValue={setCidade}
                            setItems={setCidades}
                            placeholder="Selecione a cidade"
                            zIndex={1000}
                        />
                    </>
                )}

                {currentPhase === 3 && (
                    <>
                        <Checkbox
                            value={aceitaJogadoresDeFora}
                            onValueChange={setAceitaJogadoresDeFora}
                            label="Aceita jogadores de fora?"
                        />

                        <Input
                            placeholder="Valor"
                            value={valor}
                            onChangeText={(text) => setValor(formatCurrency(text))}
                            keyboardType="numeric"
                        />
                    </>
                )}

                <ButtonRow>
                    {currentPhase > 1 && (
                        <BackButtonWrapper>
                            <Button onPress={() => setCurrentPhase(currentPhase - 1)}>
                                <ButtonText>VOLTAR</ButtonText>
                            </Button>
                        </BackButtonWrapper>
                    )}

                    <Button onPress={() => {
                        if (currentPhase < 3) {
                            setCurrentPhase(currentPhase + 1);
                        } else {
                            salvarPartida();
                        }
                    }}>
                        <ButtonText>{currentPhase < 3 ? 'PRÓXIMO' : 'SALVAR'}</ButtonText>
                    </Button>
                </ButtonRow>
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

const ProgressContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: 10px 0;
`;

const ProgressStep = styled.View<{ active: boolean }>`
  flex: 1;
  height: 5px;
  background-color: ${({ active }) => (active ? '#2B6AE3' : '#E0E0E0')};
  margin: 0 5px;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  justify-content: flex-end; /* Garante que o botão PRÓXIMO fique sempre à direita */
`;

const BackButtonWrapper = styled.View`
  margin-right: auto; /* Garante que o botão VOLTAR fique à esquerda */
`;