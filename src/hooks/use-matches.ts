import { useState, useEffect } from 'react';
import { Match } from '../types';
import { matchService } from '../services/database/match-service';

export const useMatches = (isAuthenticated: boolean) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    const unsub = matchService.subscribeToMatches((data) => {
      setMatches(data);
      setLoading(false);
    });

    return () => unsub();
  }, [isAuthenticated]);

  return {
    matches,
    loading
  };
};
