import { TeamSection } from '@/components/shared/TeamSection';
import typography from '@/constants/typography';
import { GameDetails, Player } from '@/hooks/useGameDetails';
import { useState } from 'react';
import { styled } from 'styled-components/native';

interface GameDetailsMainProps {
  gameDetails: GameDetails;
  title: string;
  onPlayerPress: (player: Player) => void;
  onAddPlayer: (teamName: string) => void;
  onTeamNameChange?: (teamId: number, newName: string) => void;
  canEdit?: boolean;
}

const GameCard = styled.View`
  margin-bottom: 32px;
`;

const GameTitle = styled.Text`
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  text-align: start;
  margin-bottom: 32px;
`;

const ScoreSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const TeamName = styled.TextInput`
  text-align: left;
  font-size: 20px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  word-wrap: break-word;
  width: 33%;
  padding: 0;
  margin: 0;
`;

const Score = styled.Text`
  text-align: center;
  font-size: ${typography['txt-1'].fontSize}px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  width: 33%;
`;

const TeamNameRight = styled.TextInput`
  text-align: right;
  font-size: 20px;
  font-family: ${typography['txt-1'].fontFamily};
  color: #2C2C2C;
  width: 33%;
  padding: 0;
  margin: 0;
`;

const PlayersSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

const TeamSectionContainer = styled.View`
  flex: 1;
`;

export function GameDetailsMain({ gameDetails, title, onPlayerPress, onAddPlayer, onTeamNameChange, canEdit = false }: GameDetailsMainProps) {
  const team1 = gameDetails.times?.[0];
  const team2 = gameDetails.times?.[1];

  const [team1Name, setTeam1Name] = useState(team1?.nome || 'Time 1');
  const [team2Name, setTeam2Name] = useState(team2?.nome || 'Time 2');

  const handleTeam1NameChange = (newName: string) => {
    setTeam1Name(newName);
  };

  const handleTeam2NameChange = (newName: string) => {
    setTeam2Name(newName);
  };

  const handleTeam1NameBlur = () => {
    if (team1 && team1Name !== team1.nome && onTeamNameChange) {
      onTeamNameChange(team1.id, team1Name);
    }
  };

  const handleTeam2NameBlur = () => {
    if (team2 && team2Name !== team2.nome && onTeamNameChange) {
      onTeamNameChange(team2.id, team2Name);
    }
  };

  return (
    <>
      <GameCard>
        <GameTitle>{title}</GameTitle>
        <ScoreSection>
          <TeamName
            value={team1Name}
            onChangeText={handleTeam1NameChange}
            onBlur={handleTeam1NameBlur}
            editable={canEdit}
            underlineColorAndroid="transparent"
            maxLength={30}
          />
          <Score>{gameDetails.placar1 || 0} x {gameDetails.placar2 || 0}</Score>
          <TeamNameRight
            value={team2Name}
            onChangeText={handleTeam2NameChange}
            onBlur={handleTeam2NameBlur}
            editable={canEdit}
            underlineColorAndroid="transparent"
            maxLength={30}
          />
        </ScoreSection>
      </GameCard>

      <PlayersSection>
        <TeamSectionContainer>
          <TeamSection
            teamName={team1Name}
            players={team1?.jogadores || []}
            onPlayerPress={onPlayerPress}
            onAddPlayer={onAddPlayer}
            canEdit={canEdit}
          />
        </TeamSectionContainer>
        <TeamSectionContainer>
          <TeamSection
            teamName={team2Name}
            players={team2?.jogadores || []}
            onPlayerPress={onPlayerPress}
            onAddPlayer={onAddPlayer}
            canEdit={canEdit}
          />
        </TeamSectionContainer>
      </PlayersSection>
    </>
  );
}