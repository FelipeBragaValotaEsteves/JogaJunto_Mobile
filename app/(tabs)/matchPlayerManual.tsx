import { BackButtonTab } from '@/components/shared/BackButton';
import { Button, ButtonText } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { KeyboardAwareContainer, MainContainer } from '@/components/shared/MainContainer';
import { TitlePageTabs } from '@/components/shared/TitlePage';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { CircleArrowLeft } from 'lucide-react-native';
import React, { useCallback, useState } from 'react';
import { styled } from 'styled-components/native';
import { Alert } from '../../components/shared/Alert';
import BASE_URL from '../../constants/config';
import { authHeaders } from '../../utils/authHeaders';

export default function MatchPlayerManualScreen() {
    const { showEditButton, matchId } = useLocalSearchParams();

    const [nome, setNome] = useState('');
    const [loading, setLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            setNome('');
        }, [])
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

    const handleAddPlayer = async () => {
        if (!nome.trim()) {
            showAlert('error', 'Campo Obrigatório', 'Por favor, preencha o nome do jogador.');
            return;
        }

        if (!matchId) {
            showAlert('error', 'Erro', 'ID da partida não encontrado.');
            return;
        }

        try {
            setLoading(true);

            const headers = await authHeaders();
            const response = await fetch(`${BASE_URL}/jogadores/externo/adicionar`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    partida_id: parseInt(matchId as string),
                    nome: nome.trim()
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ${response.status}: Falha ao adicionar jogador`);
            }

            await response.json();

            showAlert(
                'success',
                'Jogador Adicionado!',
                `${nome} foi adicionado com sucesso à partida!`,
                () => {
                    router.replace({
                        pathname: '/(tabs)/matchPlayers',
                        params: { matchId: matchId, showEditButton: showEditButton },
                    });
                }
            );

        } catch (err: any) {

            showAlert(
                'error',
                'Erro ao Adicionar Jogador',
                err?.message || 'Não foi possível adicionar o jogador. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareContainer>
            <MainContainer>
                <TopButtonsContainer>
                    <BackButtonTab onPress={() => {
                        router.replace({
                            pathname: '/(tabs)/matchPlayersAdd',
                            params: { matchId: matchId, showEditButton: showEditButton },
                        });
                    }}>
                        <CircleArrowLeft color="#2B6AE3" size={50} />
                    </BackButtonTab>
                </TopButtonsContainer>

                <TitlePageTabs>Adicionar Manualmente</TitlePageTabs>

                <FormContainer>
                    <CharacterCount>{nome.length}/15</CharacterCount>
                    <Input
                        placeholder="Nome do jogador"
                        value={nome}
                        onChangeText={setNome}
                        editable={!loading}
                        maxLength={15}
                    />

                    <ButtonContainer>
                        <Button
                            onPress={handleAddPlayer}
                            disabled={loading}
                        >
                            <ButtonText>
                                {loading ? "ADICIONANDO..." : "ADICIONAR JOGADOR"}
                            </ButtonText>
                        </Button>
                    </ButtonContainer>
                </FormContainer>

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

const FormContainer = styled.View`
  flex: 1;
  padding-top: 20px;
`;

const CharacterCount = styled.Text`
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.View`
  margin-top: 20px;
`;
