import { BASE_URL_IMAGE } from '@/constants/config';
import typography from '@/constants/typography';
import { Plus, Trash2, User } from 'lucide-react-native';
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
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function PlayerCard({ nome, foto, posicoes, status, onAdd, onRemove, showRemove }: PlayerCardProps) {
  const imageUri = foto
    ? (foto.startsWith('http://') || foto.startsWith('https://')
      ? foto
      : `${BASE_URL_IMAGE}${foto}`)
    : null;

  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <CardContainer>

        <LeftSection>
          {imageUri ? (
            <ProfileImage
              source={{ uri: imageUri }}
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
          <PlayerPositions>{Array.isArray(posicoes) && posicoes.length > 0 ? posicoes.join(', ') : ''}</PlayerPositions>
        </MiddleSection>
        <RightSection>
          {showRemove && onRemove && (
            <RemoveButton onPress={onRemove}>
              <Trash2 size={20} color="#E53E3E" />
            </RemoveButton>
          )}
          {onAdd ? (
            <Button onPress={onAdd}>
              <ButtonText><Plus size={24} color="#FFFFFF" /></ButtonText>
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
  position: relative;
`;

const RemoveButton = styled.TouchableOpacity`
  border-radius: 20px;
  padding: 6px;
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
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
`;

const ProfileImage = styled.Image`
  width: 70px;
  height: 70px;
  border-radius: 9999px;
`;

const PlaceholderImage = styled.View`
  width: 70px;
  height: 70px;
  border-radius: 9999px;
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
    status === 'aceito' ? '#2ECC71' : status === 'pendente' || status === 'manual' ? '#2ECC71' : '#E74C3C'};
`;