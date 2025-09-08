import typography from '@/constants/typography';
import { DiamondIcon, HandWavingIcon, SneakerMoveIcon, SoccerBallIcon } from 'phosphor-react-native';
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
  events: Array<{ type: string; player: string; team: string; value: number }>;
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

  console.log(team1Events);

  return (
    <ContentContainer style={{ marginBottom: 20 }}>
      <Title>{title}</Title>
      <ScoreContainer>
        <TeamContainer>
          <Team>{team1}</Team>
            {team1Events.map((event, index) => (
            <Event key={index} type={event.type} player={event.player} quantity={event.value} />
            ))}
        </TeamContainer>
        <Score>{score1} x {score2}</Score>
        <TeamContainer isSecondTeam>
          <Team>{team2}</Team>
          {team2Events.map((event, index) => (
            <Event key={index} type={event.type} player={event.player} quantity={event.value} />
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
  font-family: ${typography["txt-1"].fontFamily};
  margin-bottom: 8px;
`;

const ScoreContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  width: 100%;
`;

const TeamContainer = styled.View<{ isSecondTeam?: boolean }>`
  align-items: ${props => (props.isSecondTeam ? 'flex-end' : 'flex-start')};
  flex: 1;
`;

const Team = styled.Text`
  font-size: ${typography["txt-1"].fontSize}px;
  font-family: ${typography["txt-1"].fontFamily};
  margin-bottom: 8px;
`;

const Score = styled.Text`
  font-size: ${typography["txt-1"].fontSize}px;
  font-family: ${typography["txt-1"].fontFamily};
  flex: 1;
  text-align: center;
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
  font-family: ${typography["txt-2"].fontFamily};
`;

const Event: React.FC<{ type: string; player: string; quantity: number }> = ({ type, player, quantity }) => {
  const renderIcon = () => {
    switch (type) {
      case 'gol':
        return <SoccerBallIcon color="#007bff" weight="bold" size={18} />;
      case 'assistencia':
        return <SneakerMoveIcon color="#007bff" weight="bold" size={18} />;
      case 'cartaoVermelho':
        return <DiamondIcon color="#ff4d4d" weight="bold" size={18} />;
      case 'cartaoAmarelo':
        return <DiamondIcon color="#ffcc00" weight="bold" size={18} />;
      case 'defesa':
        return <HandWavingIcon color="#007bff" weight="bold" size={18} />;
      default:
        return null;
    }
  };

  return (
    <EventContainer>
      <EventIconWrapper>
        <EventIcon>{renderIcon()}</EventIcon>
        {quantity > 1 && (
          <QuantityBadge>
            <QuantityText>{quantity}</QuantityText>
          </QuantityBadge>
        )}
      </EventIconWrapper>
      <EventText>{player}</EventText>
    </EventContainer>
  );
};

const EventIconWrapper = styled.View`
  position: relative;
  margin-right: 8px;
`;

const QuantityBadge = styled.View`
  position: absolute;
  top: -4px;
  right: -4px;
  background-color: #ff4d4d;
  border-radius: 8px;
  min-width: 16px;
  height: 16px;
  justify-content: center;
  align-items: center;
`;

const QuantityText = styled.Text`
  color: #fff;
  font-size: 10px;
  font-weight: bold;
`;

export default GameCard;
