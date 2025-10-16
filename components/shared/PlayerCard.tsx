import typography from '@/constants/typography';
import { User } from 'lucide-react-native';
import React from 'react';
import { styled } from 'styled-components/native';
import { Button, ButtonText } from './Button';
import { ContentContainer } from './ContentContainer';


interface PlayerCardProps {
  nome: string;
  foto: string | null;
  posicoes: string[];
  status?: 'Confirmado' | 'Pendente' | 'Recusado';
  onAdd?: () => void;
}

export default function PlayerCard({ nome, foto, posicoes, status, onAdd }: PlayerCardProps) {
  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <CardContainer>
        <LeftSection>
          {foto ? (
            <ProfileImage
              source={{ uri: foto }}
              onError={(e) => {
                console.log('Erro ao carregar imagem do jogador:', e.nativeEvent.error);
              }}
            />
          ) : (
            <PlaceholderImage>
              <User size={30} color="#B0BEC5" />
            </PlaceholderImage>
          )}
        </LeftSection>
        <MiddleSection>
          <PlayerName>{nome}</PlayerName>
          <PlayerPositions>{Array.isArray(posicoes) && posicoes.length > 0 ? posicoes.join(', ') : 'Posição não definida'}</PlayerPositions>
        </MiddleSection>
        <RightSection>
          {onAdd ? (
            <Button onPress={onAdd}>
              <ButtonText>ADICIONAR</ButtonText>
            </Button>
          ) : (
            status && <PlayerStatus status={status}>{status.toUpperCase()}</PlayerStatus>
          )}
        </RightSection>
      </CardContainer>
    </ContentContainer>
  );
}

const CardContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const LeftSection = styled.View`
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const MiddleSection = styled.View`
  flex: 1;
  justify-content: center;
`;

const RightSection = styled.View`
  justify-content: center;
  align-items: flex-end;
`;

const ProfileImage = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

const PlaceholderImage = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #e2e8f0;
  justify-content: center;
  align-items: center;
`;

const PlayerName = styled.Text`
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
`;

const PlayerPositions = styled.Text`
  font-size: ${typography['txt-3'].fontSize}px;
  font-family: ${typography['txt-3'].fontFamily};
  margin-top: 8px;
`;

const PlayerStatus = styled.Text<{ status: string }>`
  font-size: ${typography['txt-2-bold'].fontSize}px;
  font-family: ${typography['txt-2-bold'].fontFamily};
  color: ${({ status }) =>
    status === 'aceito' ? '#2ECC71' : status === 'pendente' || status === 'inserido manualmente' ? '#F1C40F' : '#E74C3C'};
`;