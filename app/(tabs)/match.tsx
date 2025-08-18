import { BackButtonTab } from '@/components/shared/BackButton';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePage } from '@/components/shared/TitlePage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";
import React, { useState } from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import styled from 'styled-components/native';
import { Button, ButtonText } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';

export default function PerfilScreen() {

    const router = useRouter();

    const [nome, setNome] = useState('');
    const [data, setData] = useState('');
    const [valor, setValor] = useState('');
    const [openTipo, setOpenTipo] = useState(false);
    const [tipo, setTipo] = useState(null);
    const [itemsTipo, setItemsTipo] = useState([
        { label: 'Campo', value: 'Campo' },
        { label: 'Quadra', value: 'Quadra' },
        { label: 'Society', value: 'Society' },
    ]);

    const [horario, setHorario] = useState('');
    const [mostrarPickerHorario, setMostrarPickerHorario] = useState(false);

    const selecionarHorario = (_event: any, selectedDate?: Date) => {
        setMostrarPickerHorario(Platform.OS === 'ios');
        if (selectedDate) {
            const horas = selectedDate.getHours().toString().padStart(2, '0');
            const minutos = selectedDate.getMinutes().toString().padStart(2, '0');
            setHorario(`${horas}:${minutos}`);
        }
    };

    const salvarPartida = () => {
        console.log({ nome, data, valor, tipo, horario });
    };

    return (

        <MainContainer>
            <BackButtonTab onPress={() => router.back()} >
                <CircleArrowLeft color="#2B6AE3" size={50} />
            </BackButtonTab>

            <TitlePage>Partida</TitlePage>

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

                <PickerContainer>
                    <DropDownPicker
                        open={openTipo}
                        value={tipo}
                        items={itemsTipo}
                        setOpen={setOpenTipo}
                        setValue={setTipo}
                        setItems={setItemsTipo}
                        placeholder="Tipo"
                        style={{
                            borderColor: '#b0bec5',
                            borderRadius: 12,
                            minHeight: 50,
                            borderWidth: 2,
                        }}
                        dropDownContainerStyle={{
                            borderColor: '#b0bec5',
                            borderWidth: 2,
                            borderTopWidth: 0,
                            borderRadius: 12,
                            height: 150
                        }}
                        placeholderStyle={{
                            color: '#90a4ae',
                        }}
                    />
                </PickerContainer>

                <View>
                    <TouchableOpacity onPress={() => setMostrarPickerHorario(true)}>
                        <Input
                            placeholder="Horário"
                            value={horario}
                            editable={false} 
                            pointerEvents="none" 
                        />
                    </TouchableOpacity>

                    {mostrarPickerHorario && (
                        <DateTimePicker
                            mode="time"
                            value={new Date()}
                            is24Hour={true}
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={selecionarHorario}
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
        </MainContainer>
    );
}

const PickerContainer = styled.View`
  margin-bottom: 20px;
  z-index: 10; 
`;
