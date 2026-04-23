import { PlayerAnalysisResponse } from "@/types/analysis";
import { useState, useEffect } from "react";
import { getPlayersAnalysis } from "@/services/api";

export function usePlayerAnalysis(playerId: string | null) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<PlayerAnalysisResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!playerId) return;

    let cancelled = false;

    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        const response = await getPlayersAnalysis(playerId);
        if (!cancelled) setData(response);
      } catch (err) {
        if (!cancelled) setError(err as Error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => {
      cancelled = true;
    };
  }, [playerId]);
  return { data, loading, error };
}
