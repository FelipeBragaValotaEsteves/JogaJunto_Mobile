import { Player } from '@/hooks/useGameDetails';
import {
  AddPlayerButton,
  AddPlayerText,
  Badge,
  BadgeText,
  PlayerCardTeam,
  PlayerDetailsSection,
  PlayerName,
  PlayerNameSection,
  PlayerPosition,
  Rating,
  RatingSection,
  StatIcon,
  StatsSection,
} from '@/styles/gameDetailsStyles';
import { Plus } from 'lucide-react-native';
import { SneakerMoveIcon, SoccerBallIcon, SquareIcon } from 'phosphor-react-native';
import { TouchableOpacity } from 'react-native';

type TeamSectionProps = {
  teamName: string;
  players: Player[];
  onPlayerPress: (player: Player) => void;
  onAddPlayer: (teamName: string) => void;
};

export function TeamSection({ teamName, players, onPlayerPress, onAddPlayer }: TeamSectionProps) {
  return (
    <>
      {players.map((player) => {
        const gols = player.gols ?? 0;
        const assistencias = player.assistencias ?? 0;
        const cartoesAmarelos = player.cartoesAmarelos ?? 0;
        const cartoesVermelhos = player.cartoesVermelhos ?? 0;
        const rating = player.rating ?? 0;
        console.log(player);
        
        return (
          <TouchableOpacity key={player.id.toString()} onPress={() => onPlayerPress(player)}>
            <PlayerCardTeam>
              <PlayerNameSection>
                <PlayerName>{player.nome || 'Jogador'}</PlayerName>
                {player.posicao && typeof player.posicao === 'string' && player.posicao.trim() !== '' && (
                  <PlayerPosition>{player.posicao}</PlayerPosition>
                )}
              </PlayerNameSection>

              <PlayerDetailsSection>
                <StatsSection>
                  {gols > 0 && (
                    <StatIcon>
                      <SoccerBallIcon color="#007bff" size={18} />
                      {gols > 1 && (
                        <Badge>
                          <BadgeText>{gols}</BadgeText>
                        </Badge>
                      )}
                    </StatIcon>
                  )}

                  {assistencias > 0 && (
                    <StatIcon>
                      <SneakerMoveIcon color="#007bff" size={18} />
                      {assistencias > 1 && (
                        <Badge>
                          <BadgeText>{assistencias}</BadgeText>
                        </Badge>
                      )}
                    </StatIcon>
                  )}

                  {cartoesAmarelos > 0 && (
                    <StatIcon>
                      <SquareIcon color="#FFC107" size={18} />
                      {cartoesAmarelos > 1 && (
                        <Badge>
                          <BadgeText>{cartoesAmarelos}</BadgeText>
                        </Badge>
                      )}
                    </StatIcon>
                  )}

                  {cartoesVermelhos > 0 && (
                    <StatIcon>
                      <SquareIcon color="#ff4d4d" size={18} />
                      {cartoesVermelhos > 1 && (
                        <Badge>
                          <BadgeText>{cartoesVermelhos}</BadgeText>
                        </Badge>
                      )}
                    </StatIcon>
                  )}
                </StatsSection>

                <RatingSection>
                  <Rating rating={rating}>{rating.toFixed(1)}</Rating>
                </RatingSection>
              </PlayerDetailsSection>
            </PlayerCardTeam>
          </TouchableOpacity>
        );
      })}

      <AddPlayerButton onPress={() => onAddPlayer(teamName)}>
        <Plus color="#2B6AE3" size={20} />
        <AddPlayerText>Adicionar</AddPlayerText>
      </AddPlayerButton>
    </>
  );
}
