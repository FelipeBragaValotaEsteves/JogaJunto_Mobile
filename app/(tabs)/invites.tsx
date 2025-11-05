import { BackButtonTab } from '@/components/shared/BackButton';
import { Loading } from "@/components/shared/Loading";
import { MainContainer } from "@/components/shared/MainContainer";
import { TitlePageTabs } from "@/components/shared/TitlePage";
import { useFocusEffect } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";

import { Alert } from "@/components/shared/Alert";
import { InviteCard } from "@/components/shared/InviteCard";
import { NoResults } from "@/components/shared/NoResults";
import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { styled } from "styled-components/native";
import BASE_URL from '../../constants/config';
import { authHeaders, getUserId } from '../../utils/authHeaders';
import { formatDateTime } from '../../utils/formatDateTime';

interface Invite {
    convite_id: number;
    partida_id: number;
    status: string;
    local: string;
    data: string;
    hora_inicio: string;
}

export default function InvitesScreen() {
    const [invites, setInvites] = useState<Invite[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState<{
        type: string;
        title: string;
        message: string;
        onConfirm?: () => void;
    }>({
        type: '',
        title: '',
        message: ''
    });

    const showAlert = (type: string, title: string, message: string, onConfirm?: () => void) => {
        setAlertConfig({ type, title, message, onConfirm });
        setAlertVisible(true);
    };

    const fetchInvites = async () => {
        try {
            setLoading(true);
            setError(null);

            const headers = await authHeaders();
            const userId = await getUserId();

            const response = await fetch(`${BASE_URL}/convites/usuario/${userId}`, {
                headers,
                cache: 'no-cache'
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao carregar convites`);
            }

            const data = await response.json();
            setInvites(data || []);
        } catch (err: any) {
            setError(err?.message || 'Erro ao carregar convites');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const loadInvites = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    const headers = await authHeaders();
                    const userId = await getUserId();

                    const response = await fetch(`${BASE_URL}/convites/usuario/${userId}`, {
                        headers,
                        cache: 'no-cache'
                    });

                    if (!response.ok) {
                        throw new Error(`Erro ${response.status}: Falha ao carregar convites`);
                    }

                    const data = await response.json();

                    if (isActive) {
                        setInvites(data || []);
                    }
                } catch (err: any) {
                    if (isActive) {
                        setError(err?.message || 'Erro ao carregar convites');
                    }
                } finally {
                    if (isActive) {
                        setLoading(false);
                    }
                }
            };

            loadInvites();

            return () => {
                isActive = false;
            };
        }, [])
    );

    const handleAcceptInvite = async (conviteId: number) => {
        try {
            const headers = await authHeaders();
            
            const response = await fetch(`${BASE_URL}/convites/aceitar/${conviteId}`, {
                method: 'PUT',
                headers,
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao aceitar convite`);
            }

            showAlert('success', 'Sucesso', 'Convite aceito com sucesso!');
            
            await fetchInvites();
            
        } catch (err: any) {
            showAlert('error', 'Erro', err?.message || 'Erro ao aceitar convite');
        }
    };

    const handleRejectInvite = async (conviteId: number) => {
        try {
            const headers = await authHeaders();
            
            const response = await fetch(`${BASE_URL}/convites/recusar/${conviteId}`, {
                method: 'PUT',
                headers,
            });

            if (!response.ok) {
                throw new Error(`Erro ${response.status}: Falha ao recusar convite`);
            }

            showAlert('success', 'Sucesso', 'Convite recusado com sucesso!');
            
            await fetchInvites();
            
        } catch (err: any) {
            showAlert('error', 'Erro', err?.message || 'Erro ao recusar convite');
        }
    };

    return (
        <MainContainer>
            <TopButtonsContainer>
                <BackButtonTab>
                    <CircleArrowLeft color="#2B6AE3" size={50} />
                </BackButtonTab>
            </TopButtonsContainer>

            <TitlePageTabs>Convites</TitlePageTabs>

            {loading ? (
                <Loading />
            ) : error ? (
                <ErrorContainer>
                    <Text style={{ color: '#e74c3c', textAlign: 'center' }}>
                        {error}
                    </Text>
                </ErrorContainer>
            ) : invites.length === 0 ? (
                <NoResults message="Nenhum convite encontrado." />
            ) : (
                invites.map((invite, index) => {
                    const { time, formattedDate } = formatDateTime(invite.data, invite.hora_inicio);
                    return (
                        <InviteCard
                            key={`${invite.convite_id}-${index}`}
                            date={formattedDate}
                            hour={time}
                            location={invite.local}
                            status={invite.status}
                            onAccept={() => handleAcceptInvite(invite.convite_id)}
                            onReject={() => handleRejectInvite(invite.convite_id)}
                        />
                    );
                })
            )}
            
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

const ErrorContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;