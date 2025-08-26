import { BackButtonTab } from '@/components/shared/BackButton';
import { Checkbox } from '@/components/shared/Checkbox';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";
import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import { Button, ButtonText } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import BASE_URL from "../../constants/config";

async function fetchMatchDetails(matchId: string) {
  const response = await fetch(`${BASE_URL}/matches/${matchId}`);

  if (!response.ok) {
    throw new Error("Erro ao buscar detalhes da partida");
  }

  return await response.json();
}

export default function MatchScreen() {
    const router = useRouter();

    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [valor, setValor] = useState('');
    const [rua, setRua] = useState('');
    const [bairro, setBairro] = useState('');
    const [numero, setNumero] = useState('');
    const [cidade, setCidade] = useState(null);
    const [openCidade, setOpenCidade] = useState(false);
    const [itemsCidade, setItemsCidade] = useState([
        { label: 'São Paulo', value: 'São Paulo' },
        { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
        { label: 'Belo Horizonte', value: 'Belo Horizonte' },
    ]);

    const [aceitaJogadoresDeFora, setAceitaJogadoresDeFora] = useState(false);

    const [openTipo, setOpenTipo] = useState(false);
    const [tipo, setTipo] = useState(null);
    const [itemsTipo, setItemsTipo] = useState([
        { label: 'Campo', value: 'Campo' },
        { label: 'Quadra', value: 'Quadra' },
        { label: 'Society', value: 'Society' },
    ]);

    const [horaInicial, setHoraInicial] = useState('');
    const [horaFinal, setHoraFinal] = useState('');
    const [mostrarPickerHoraInicial, setMostrarPickerHoraInicial] = useState(false);
    const [mostrarPickerHoraFinal, setMostrarPickerHoraFinal] = useState(false);

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

    const selecionarHora = (setHora: React.Dispatch<React.SetStateAction<string>>, _event: any, selectedDate?: Date) => {
        if (Platform.OS !== 'ios') {
            setMostrarPickerHoraInicial(false);
            setMostrarPickerHoraFinal(false);
        }
        if (selectedDate) {
            const horas = selectedDate.getHours().toString().padStart(2, '0');
            const minutos = selectedDate.getMinutes().toString().padStart(2, '0');
            setHora(`${horas}:${minutos}`);
        }
    };

    const salvarPartida = () => {
        console.log({
            nome,
            data,
            valor,
            tipo,
            rua,
            bairro,
            numero,
            cidade,
            aceitaJogadoresDeFora,
            horaInicial,
            horaFinal,
        });
        showAlert('success', 'Sucesso', 'Partida salva com sucesso!');
    };

    const sair = async () => {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('token');
        router.replace("/login");
    };

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => router.back()} >
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
            </TopButtonsContainer>

            <TitlePageTabs>Partida</TitlePageTabs>

            <ContentContainer>
                <Input
                    placeholder="Nome"
                    value={nome}
                    onChangeText={setNome}
                />

                <Input
                    placeholder="Data"
                    value={data}
                    onChangeText={setData}
                />

                <Select
                    label="Tipo"
                    open={openTipo}
                    value={tipo}
                    items={itemsTipo}
                    setOpen={setOpenTipo}
                    setValue={setTipo}
                    setItems={setItemsTipo}
                    placeholder="Selecione o tipo"
                    zIndex={2000}
                />

                <Input
                    placeholder="Rua"
                    value={rua}
                    onChangeText={setRua}
                />

                <Input
                    placeholder="Bairro"
                    value={bairro}
                    onChangeText={setBairro}
                />

                <Input
                    placeholder="Número"
                    value={numero}
                    onChangeText={setNumero}
                />

                <Select
                    label="Cidade"
                    open={openCidade}
                    value={cidade}
                    items={itemsCidade}
                    setOpen={setOpenCidade}
                    setValue={setCidade}
                    setItems={setItemsCidade}
                    placeholder="Selecione a cidade"
                    zIndex={1000}
                />

                <Checkbox
                    value={aceitaJogadoresDeFora}
                    onValueChange={setAceitaJogadoresDeFora}
                    label="Aceita jogadores de fora?"
                />

                <View>
                    <TouchableOpacity onPress={() => setMostrarPickerHoraInicial(true)}>
                        <Input
                            placeholder="Hora Inicial"
                            value={horaInicial}
                            editable={false}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>

                    {mostrarPickerHoraInicial && (
                        <DateTimePicker
                            mode="time"
                            value={new Date()}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => selecionarHora(setHoraInicial, event, date)}
                        />
                    )}
                </View>

                <View>
                    <TouchableOpacity onPress={() => setMostrarPickerHoraFinal(true)}>
                        <Input
                            placeholder="Hora Final"
                            value={horaFinal}
                            editable={false}
                            pointerEvents="none"
                        />
                    </TouchableOpacity>

                    {mostrarPickerHoraFinal && (
                        <DateTimePicker
                            mode="time"
                            value={new Date()}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={(event, date) => selecionarHora(setHoraFinal, event, date)}
                        />
                    )}
                </View>

                <Input
                    placeholder="Valor"
                    value={valor}
                    onChangeText={setValor}
                />

                <Button onPress={salvarPartida}>
                    <ButtonText>SALVAR</ButtonText>
                </Button>
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