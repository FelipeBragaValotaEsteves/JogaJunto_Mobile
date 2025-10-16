import { BackButtonTab } from '@/components/shared/BackButton';
import { Button, ButtonText } from '@/components/shared/Button';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { Input } from '@/components/shared/Input';
import { MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { styled } from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import BASE_URL from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

export default function GameAddScreen() {
    const router = useRouter();
    const { partidaId } = useLocalSearchParams();

    const [team1Name, setTeam1Name] = useState('');
    const [team2Name, setTeam2Name] = useState('');
    const [saving, setSaving] = useState(false);

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

    const handleSave = async () => {
        if (!team1Name.trim()) {
            showAlert('error', 'Erro', 'Por favor, informe o nome do Time 1.');
            return;
        }

        if (!team2Name.trim()) {
            showAlert('error', 'Erro', 'Por favor, informe o nome do Time 2.');
            return;
        }

        if (!partidaId) {
            showAlert('error', 'Erro', 'ID da partida não encontrado.');
            return;
        }

        try {
            setSaving(true);

            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/jogos`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partidaId: partidaId,
                    time1: team1Name.trim(),
                    time2: team2Name.trim()
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar o jogo');
            }

            const data = await response.json();

            showAlert(
                'success',
                'Sucesso',
                'Jogo criado com sucesso!',
                () => {
                    router.replace({
                        pathname: '/(tabs)/gameDetails',
                        params: { id: partidaId, idGame: data.jogo.id },
                    });
                }
            );

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            showAlert('error', 'Erro', `Não foi possível criar o jogo: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab onPress={() => {
                    router.replace({
                        pathname: '/(tabs)/matchDetails',
                        params: { id: partidaId },
                    });
                }}>
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
            </TopButtonsContainer>

            <TitlePageTabs>Criar Novo Jogo</TitlePageTabs>

            <ContentContainer>
                <Input
                    placeholder="Nome do Time 1"
                    value={team1Name}
                    onChangeText={setTeam1Name}
                    editable={!saving}
                />

                <Input
                    placeholder="Nome do Time 2"
                    value={team2Name}
                    onChangeText={setTeam2Name}
                    editable={!saving}
                />

                <Button onPress={handleSave} disabled={saving}>
                    <ButtonText>
                        {saving ? 'SALVANDO...' : 'SALVAR'}
                    </ButtonText>
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