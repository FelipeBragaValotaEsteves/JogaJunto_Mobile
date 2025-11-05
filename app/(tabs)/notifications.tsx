import { BackButtonTab } from '@/components/shared/BackButton';
import { Loading } from "@/components/shared/Loading";
import { MainContainer } from "@/components/shared/MainContainer";
import { TitlePageTabs } from "@/components/shared/TitlePage";
import { useFocusEffect } from "expo-router";
import { CircleArrowLeft } from "lucide-react-native";

import { NoResults } from "@/components/shared/NoResults";
import { NotificationCard } from "@/components/shared/NotificationCard";
import React, { useCallback, useState } from "react";
import { Text } from "react-native";
import { styled } from "styled-components/native";
import BASE_URL from '../../constants/config';
import { authHeaders, getUserId } from '../../utils/authHeaders';

interface NotificationData {
  id: number;
  usuario_id: number;
  mensagem: string;
  vista: boolean;
  datahora_envio: string;
}

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const timeString = date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    if (date.toDateString() === today.toDateString()) {
      return `Hoje às ${timeString}`;
    }
    
    if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem às ${timeString}`;
    }
    
    return date.toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }) + ` às ${timeString}`;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = await authHeaders();
      const userId = await getUserId();

      const response = await fetch(`${BASE_URL}/notificacoes/usuario/${userId}`, {
        headers,
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Falha ao carregar notificações`);
      }

      const data = await response.json();

      setNotifications(data || []);

    } catch (err: any) {
      setError(err?.message || 'Erro ao carregar notificações');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );

  return (
    <MainContainer>
      <TopButtonsContainer>
        <BackButtonTab>
          <CircleArrowLeft color="#2B6AE3" size={50} />
        </BackButtonTab>
      </TopButtonsContainer>

      <TitlePageTabs>Notificações</TitlePageTabs>

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorContainer>
          <Text style={{ color: '#e74c3c', textAlign: 'center' }}>
            {error}
          </Text>
        </ErrorContainer>
      ) : notifications.length === 0 ? (
        <NoResults message="Nenhuma notificação encontrada." />
      ) : (
        notifications.map((notification, index) => (
          <NotificationContainer key={notification.id}>
            <NotificationCard
              message={notification.mensagem}
              onPress={() => console.log(`Notificação ${notification.id} clicada`)}
            />
            <NotificationMeta>
              <MetaText>{formatDateTime(notification.datahora_envio)}</MetaText>
              {!notification.vista && <UnreadDot />}
            </NotificationMeta>
          </NotificationContainer>
        ))
      )}
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

const NotificationContainer = styled.View`
  margin-bottom: 15px;
  position: relative;
`;

const NotificationMeta = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background-color: #f8f9fa;
`;

const MetaText = styled.Text`
  font-size: 12px;
  color: #6c757d;
  font-style: italic;
`;

const UnreadDot = styled.View`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: #007bff;
`;