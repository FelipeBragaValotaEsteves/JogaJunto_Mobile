import typography from '@/constants/typography';
import { DiamondIcon, SneakerMoveIcon, SoccerBallIcon } from 'phosphor-react-native';
import React from 'react';
import styled from 'styled-components/native';
import { Button, ButtonText } from './Button';
import { ContentContainer } from './ContentContainer';

interface GameCardProps {
  title: string;
  team1: string;
  team2: string;
  score1: number;
  score2: number;
  events: Array<{ type: string; player: string; team: string }>;
  onViewPress: () => void;
}

const GameCard: React.FC<GameCardProps> = ({
  title,
  team1,
  team2,
  score1,
  score2,
  events,
  onViewPress,
}) => {
  const team1Events = events.filter(event => event.team === team1);
  const team2Events = events.filter(event => event.team === team2);

  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <Title>{title}</Title>
      <ScoreContainer>
        <TeamContainer>
          <Team>{team1}</Team>
          {team1Events.map((event, index) => (
            <Event key={index} type={event.type} player={event.player} />
          ))}
        </TeamContainer>
        <Score>{score1} x {score2}</Score>
        <TeamContainer>
          <Team>{team2}</Team>
          {team2Events.map((event, index) => (
            <Event key={index} type={event.type} player={event.player} />
          ))}
        </TeamContainer>
      </ScoreContainer>
      <Button onPress={onViewPress}>
        <ButtonText>VISUALIZAR</ButtonText>
      </Button>
    </ContentContainer>
  );
};

const Title = styled.Text`
  font-size: ${typography["txt-1"].fontSize}px;
  line-height: ${typography["txt-1"].lineHeight}px;
  font-family: ${typography["txt-1"].fontFamily};
  margin-bottom: 8px;
`;

const ScoreContainer = styled.View`
  flex-direction: row;
  align-items: start;
  margin-bottom: 8px;
  gap: 10px;
`;

const TeamContainer = styled.View`
  align-items: start;
`;

const Team = styled.Text`
  font-size: ${typography["txt-1"].fontSize}px;
  line-height: ${typography["txt-1"].lineHeight}px;
  font-family: ${typography["txt-1"].fontFamily};
  margin-bottom: 8px;
  text-align: start;
`;

const Score = styled.Text`
  font-size: ${typography["txt-1"].fontSize}px;
  line-height: ${typography["txt-1"].lineHeight}px;
  font-family: ${typography["txt-1"].fontFamily};
`;

const EventIcon = styled.View`
  margin-right: 8px;
`;

const EventContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 8px;
`;

const EventText = styled.Text`
  font-size: ${typography["txt-2"].fontSize}px;
  line-height: ${typography["txt-2"].lineHeight}px;
  font-family: ${typography["txt-2"].fontFamily};
`;

const Event: React.FC<{ type: string; player: string }> = ({ type, player }) => {
  const renderIcon = () => {
    switch (type) {
      case 'goal':
        return <SoccerBallIcon color="#007bff" weight="bold" size={18} />;
      case 'assist':
        return <SneakerMoveIcon  color="#007bff" weight="bold" size={18} />;
      case 'card':
        return <DiamondIcon color="#ff4d4d" weight="bold" size={18} />;
      default:
        return null;
    }
  };

  return (
    <EventContainer>
      <EventIcon>{renderIcon()}</EventIcon>
      <EventText>{player}</EventText>
    </EventContainer>
  );
};

export default GameCard;
