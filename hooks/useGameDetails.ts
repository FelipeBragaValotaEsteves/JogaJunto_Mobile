import BASE_URL from '@/constants/config';
import { authHeaders } from '@/utils/authHeaders';
import { useCallback, useEffect, useState } from 'react';

export interface Player {
  id: number;
  nome: string;
  posicao: string;
  foto: string;
  gols?: number;
  assistencias?: number;
  cartoesAmarelos?: number;
  cartoesVermelhos?: number;
  defesas?: number;
  rating?: number;
  timeParticipanteId: number;
}

export interface Team {
  id: number;
  nome: string;
  jogadores: Player[];
}

export interface GameDetails {
  id: number;
  titulo: string;
  time1: string;
  time2: string;
  placar1: number;
  placar2: number;
  times?: Team[];
}

export interface MatchDetails {
  id: number;
  titulo: string;
  descricao?: string;
  data: string;
  hora_inicio: string;
  local: string;
  tipo_partida_nome: string;
  status?: string;
}

export interface Position {
  id: number;
  nome: string;
}

export function useGameDetails(id: string, idGame: string) {
  const [gameDetails, setGameDetails] = useState<GameDetails | null>(null);
  const [matchDetails, setMatchDetails] = useState<MatchDetails | null>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const headers = await authHeaders();

      const [matchRes, gameRes, posRes] = await Promise.all([
        fetch(`${BASE_URL}/partidas/${id}`, { headers }),
        fetch(`${BASE_URL}/jogos/${idGame}`, { headers }),
        fetch(`${BASE_URL}/posicao/list`, { headers }),
      ]);


      if (!matchRes.ok || !gameRes.ok || !posRes.ok) {
        throw new Error('Erro ao buscar dados do jogo.');
      }

      const [matchData, gameData, posData] = await Promise.all([
        matchRes.json(),
        gameRes.json(),
        posRes.json(),
      ]);

      console.log(JSON.stringify(gameData));

      const normalizedGame: GameDetails = {
        id: gameData.jogoId ?? gameData.id ?? 0,
        titulo: gameData.titulo ?? `Jogo ${gameData.jogoId ?? idGame}`,
        time1: gameData.times?.[0]?.nome ?? 'Time 1',
        time2: gameData.times?.[1]?.nome ?? 'Time 2',
        placar1: gameData.times?.[0]?.totais?.gols ?? 0,
        placar2: gameData.times?.[1]?.totais?.gols ?? 0,
        times:
          gameData.times?.map((t: any) => ({
            id: t.id ?? t.timeId ?? 0,
            nome: t.nome,
            jogadores:
              t.jogadores?.map((j: any) => ({
                id: j.jogadorId ?? j.id ?? 0,
                nome: j.nome ?? 'Jogador',
                posicao: j.posicao ?? '',
                foto: j.foto ?? '',
                gols: j.eventos?.gol ?? 0,
                assistencias: j.eventos?.assistencia ?? 0,
                cartoesAmarelos: j.eventos?.cartaoAmarelo ?? 0,
                cartoesVermelhos: j.eventos?.cartaoVermelho ?? 0,
                defesas: j.eventos?.defesa ?? 0,
                rating: j.nota ?? 0,
                timeParticipanteId: j.timeParticipanteId ?? 0,
              })) ?? [],
          })) ?? [],
      };

      setGameDetails(normalizedGame);
      setMatchDetails(matchData);
      setPositions(posData);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Erro desconhecido ao carregar dados';
      console.error('useGameDetails erro:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id, idGame]);

  useEffect(() => {
    if (id && idGame) {
      fetchAll();
    } else {
      setError('IDs inválidos para buscar jogo.');
      setLoading(false);
    }
  }, [fetchAll, id, idGame]);

  return { gameDetails, matchDetails, positions, loading, error, fetchAll };
}
