import typography from '@/constants/typography';
import React from 'react';
import styled from 'styled-components/native';
import { Button, ButtonText } from './Button';
import { ContentContainer } from './ContentContainer';

interface AddPlayerCardProps {
    nome: string;
    foto: string;
    posicoes: string[];
    onInvite: () => void;
}

export default function AddPlayerCard({ nome, foto, posicoes, onInvite }: AddPlayerCardProps) {
    return (
        <ContentContainer style={{ marginBottom: 20 }}>
            <CardContainer>
                <LeftSection>
                    <ProfileImage source={{ uri: foto }} />
                </LeftSection>
                <MiddleSection>
                    <PlayerName>{nome}</PlayerName>
                    <PlayerPositions>{posicoes.join(', ')}</PlayerPositions>
                </MiddleSection>
                <RightSection>
                    <Button onPress={onInvite}>
                        <ButtonText>Convidar</ButtonText>
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