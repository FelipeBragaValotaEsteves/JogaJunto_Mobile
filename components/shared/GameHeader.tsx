import { TitlePageTabs } from '@/components/shared/TitlePage';
import { GameDetails, MatchDetails } from '@/hooks/useGameDetails';
import { Divider, SubTitleContainer, SubTitleText } from '@/styles/gameDetailsStyles';
import { formatDateTime } from '@/utils/formatDateTime';

interface GameHeaderProps {
  matchDetails?: MatchDetails | null;
  gameDetails?: GameDetails | null;
}

export function GameHeader({ matchDetails, gameDetails }: GameHeaderProps) {
  const info =
    matchDetails && matchDetails.data && matchDetails.hora_inicio
      ? formatDateTime(matchDetails.data, matchDetails.hora_inicio)
      : null;

  return (
    <>
      <TitlePageTabs>
        {matchDetails?.local
          ? matchDetails.local
          : `${gameDetails?.time1 ?? 'Time 1'} x ${gameDetails?.time2 ?? 'Time 2'}`}
      </TitlePageTabs>

      <Divider />

      <SubTitleContainer>
        <SubTitleText>
          {info
            ? `${info.formattedDate} às ${info.time}`
            : 'Data não informada'}
        </SubTitleText>
        <SubTitleText>
          {matchDetails?.tipo_partida_nome || 'Tipo não informado'}
        </SubTitleText>
      </SubTitleContainer>
    </>
  );
}
