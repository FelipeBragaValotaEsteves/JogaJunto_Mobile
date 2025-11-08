import typography from '@/constants/typography';
import { User } from 'lucide-react-native';
import React from 'react';
import { styled } from 'styled-components/native';
import { Button, ButtonText } from './Button';
import { ContentContainer } from './ContentContainer';

interface AddPlayerCardProps {
  nome: string;
  foto: string | null;
  posicoes: string[];
  onInvite: () => void;
}

export default function AddPlayerCard({ nome, foto, posicoes, onInvite }: AddPlayerCardProps) {
  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <CardContainer>
        <LeftSection>
          {foto ? (
            <ProfileImage
              source={{ uri: foto }}
              onError={(e) => {
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
          <PlayerPositions>{posicoes.join(', ')}</PlayerPositions>
        </MiddleSection>
        <RightSection>
          <Button onPress={onInvite}>
            <ButtonText>CONVIDAR</ButtonText>
          </Button>
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
  font-weight: bold;
`;

const PlayerPositions = styled.Text`
  font-size: ${typography['txt-2'].fontSize}px;
  font-family: ${typography['txt-2'].fontFamily};
  margin-top: 4px;
`;