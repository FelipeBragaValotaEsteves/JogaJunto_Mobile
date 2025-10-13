import { TeamSection } from '@/components/shared/TeamSection';
import typography from '@/constants/typography';
import { GameDetails, MatchDetails, Player } from '@/hooks/useGameDetails';
import { styled } from 'styled-components/native';

interface GameDetailsMainProps {
  gameDetails: GameDetails;
  matchDetails: MatchDetails | null;
  onPlayerPress: (player: Player) => void;
  onAddPlayer: (teamName: string) => void;
}

const GameCard = styled.View`
  margin-bottom: 32px;
`;

const GameTitle = styled.Text`
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  text-align: center;
  margin-bottom: 12px;
`;

const ScoreSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TeamName = styled.Text`
  text-align: left;
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  word-wrap: break-word;
  width: 33%;
`;

const Score = styled.Text`
  text-align: center;
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  width: 33%;
`;

const TeamNameRight = styled.Text`
  text-align: right;
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  width: 33%;
`;

const PlayersSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

const TeamSectionContainer = styled.View`
  flex: 1;
`;

export function GameDetailsMain({ gameDetails, matchDetails, onPlayerPress, onAddPlayer }: GameDetailsMainProps) {
  const team1 = gameDetails.times?.[0];
  const team2 = gameDetails.times?.[1];

  return (
    <>
      <GameCard>
        <GameTitle>{gameDetails.titulo || 'Jogo'}</GameTitle>
        <ScoreSection>
          <TeamName>{team1?.nome || 'Time 1'}</TeamName>
          <Score>{gameDetails.placar1 || 0} x {gameDetails.placar2 || 0}</Score>
          <TeamNameRight>{team2?.nome || 'Time 2'}</TeamNameRight>
        </ScoreSection>
      </GameCard>

      <PlayersSection>
        <TeamSectionContainer>
          <TeamSection
            teamName={team1?.nome || 'Time 1'}
            players={team1?.jogadores || []}
            onPlayerPress={onPlayerPress}
            onAddPlayer={onAddPlayer}
          />
        </TeamSectionContainer>
        <TeamSectionContainer>
          <TeamSection
            teamName={team2?.nome || 'Time 2'}
            players={team2?.jogadores || []}
            onPlayerPress={onPlayerPress}
            onAddPlayer={onAddPlayer}
          />
        </TeamSectionContainer>
      </PlayersSection>
    </>
  );
}