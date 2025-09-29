import typography from '@/constants/typography';
import React from 'react';
import styled from 'styled-components/native';
import { Button, ButtonText } from './Button';
import { ContentContainer } from './ContentContainer';


interface PlayerCardProps {
    nome: string;
    foto: string;
    posicoes: string[];
    status?: 'Confirmado' | 'Pendente' | 'Recusado';
    onAdd?: () => void;
}

export default function PlayerCard({ nome, foto, posicoes, status, onAdd }: PlayerCardProps) {
    return (
        <ContentContainer style={{ marginBottom: 20 }}>
            <CardContainer>
                <LeftSection>
                    <ProfileImage source={{ uri: foto }} />
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
                        status && <PlayerStatus status={status}>{status}</PlayerStatus>
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
    status === 'Confirmado' ? '#2ECC71' : status === 'Pendente' ? '#F1C40F' : '#E74C3C'};
`;

const AddButton = styled.TouchableOpacity`
    background-color: #2B6AE3;
    padding: 8px 12px;
    border-radius: 6px;
`;

const AddButtonText = styled.Text`
    color: white;
    font-size: ${typography['btn-2'].fontSize}px;
    font-family: ${typography['btn-2'].fontFamily};
`;