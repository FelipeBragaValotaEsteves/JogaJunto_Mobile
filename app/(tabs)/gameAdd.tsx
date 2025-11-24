import { BackButtonTab } from '@/components/shared/BackButton';
import { Button, ButtonText } from '@/components/shared/Button';
import { ContentContainer } from '@/components/shared/ContentContainer';
import { Input } from '@/components/shared/Input';
import { KeyboardAwareContainer, MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { CircleArrowLeft } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { styled } from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import BASE_URL from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

export default function GameAddScreen() {
    const router = useRouter();
    const { partidaId, title, idGame, team1Name: initialTeam1, team2Name: initialTeam2, isEditing } = useLocalSearchParams();

    const [team1Name, setTeam1Name] = useState('');
    const [team2Name, setTeam2Name] = useState('');
    const [saving, setSaving] = useState(false);

    useFocusEffect(
        useCallback(() => {
            if (isEditing === 'true' && initialTeam1 && initialTeam2) {
                setTeam1Name(initialTeam1 as string);
                setTeam2Name(initialTeam2 as string);
            } else {
                setTeam1Name('');
                setTeam2Name('');
            }
        }, [isEditing, initialTeam1, initialTeam2])
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
            
            if (isEditing === 'true' && idGame) {
                const response = await fetch(`${BASE_URL}/jogos/${idGame}`, {
                    method: 'PUT',
                    headers: {
                        ...headers,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        time1: team1Name.trim(),
                        time2: team2Name.trim()
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Erro ao editar o jogo');
                }

                showAlert(
                    'success',
                    'Sucesso',
                    'Jogo editado com sucesso!',
                    () => {
                        router.replace({
                            pathname: '/(tabs)/gameDetails',
                            params: { id: partidaId, idGame: idGame, title: title, showEditButton: true as any },
                        });
                    }
                );
            } else {
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
                            params: { id: partidaId, idGame: data.jogo.id, title: title, showEditButton: true as any },
                        });
                    }
                );
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
            const action = isEditing === 'true' ? 'editar' : 'criar';
            showAlert('error', 'Erro', `Não foi possível ${action} o jogo: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <KeyboardAwareContainer>
            <MainContainer>
                <TopButtonsContainer>
                    <BackButtonTab onPress={() => {
                        if (isEditing === 'true' && idGame) {
                            router.replace({
                                pathname: '/(tabs)/gameDetails',
                                params: { id: partidaId, idGame: idGame, title: title, showEditButton: true as any },
                            });
                        } else {
                            router.replace({
                                pathname: '/(tabs)/matchDetails',
                                params: { id: partidaId, source: 'createdMatches' },
                            });
                        }
                    }}>
                        <CircleArrowLeft color="#2B6AE3" size={50} />
                    </BackButtonTab>
                </TopButtonsContainer>

                <TitlePageTabs>{isEditing === 'true' ? 'Editar Jogo' : 'Criar Novo Jogo'}</TitlePageTabs>

            <ContentContainer>
                <Input
                    placeholder="Nome do Time 1"
                    value={team1Name}
                    onChangeText={setTeam1Name}
                    editable={!saving}
                    maxLength={30}
                />

                <Input
                    placeholder="Nome do Time 2"
                    value={team2Name}
                    onChangeText={setTeam2Name}
                    editable={!saving}
                    maxLength={30}
                />

                <Button onPress={handleSave} disabled={saving}>
                    <ButtonText>
                        {saving ? 'SALVANDO...' : (isEditing === 'true' ? 'SALVAR ALTERAÇÕES' : 'CRIAR JOGO')}
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