import { useState, useEffect, useCallback } from 'react';
import { MatchAction, ActionType, ZoneId, ZoneIntensity } from '../types';

export const useHeatmap = (initialActions: MatchAction[] = []) => {
  const [actions, setActions] = useState<MatchAction[]>(initialActions);
  const [intensities, setIntensities] = useState<Record<ZoneId, ZoneIntensity>>({
    A1: { id: 'A1', count: 0, weight: 0, lastActivity: 0 },
    A2: { id: 'A2', count: 0, weight: 0, lastActivity: 0 },
    B1: { id: 'B1', count: 0, weight: 0, lastActivity: 0 },
    B2: { id: 'B2', count: 0, weight: 0, lastActivity: 0 },
    C1: { id: 'C1', count: 0, weight: 0, lastActivity: 0 },
    C2: { id: 'C2', count: 0, weight: 0, lastActivity: 0 },
    D1: { id: 'D1', count: 0, weight: 0, lastActivity: 0 },
    D2: { id: 'D2', count: 0, weight: 0, lastActivity: 0 },
  });

  const calculateIntensities = useCallback((matchActions: MatchAction[]) => {
    const counts: Record<string, number> = {};
    const zones: ZoneId[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
    
    zones.forEach(z => counts[z] = 0);
    matchActions.forEach(a => {
      if (a.zone && zones.includes(a.zone as ZoneId)) {
        const weight = a.points > 0 ? 1.5 : 1;
        counts[a.zone] += weight;
      }
    });

    const max = Math.max(...Object.values(counts), 1);
    
    setIntensities(prev => {
      const next = { ...prev };
      zones.forEach(z => {
        next[z] = {
          id: z,
          count: counts[z],
          weight: counts[z] / max,
          lastActivity: matchActions.filter(a => a.zone === z).pop()?.timestamp || 0
        };
      });
      return next;
    });
  }, []);

  useEffect(() => {
    calculateIntensities(actions);
  }, [actions, calculateIntensities]);

  const simulateAction = () => {
    const zones: ZoneId[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
    const randomZone = zones[Math.floor(Math.random() * zones.length)];
    
    const newAction: MatchAction = {
      id: Math.random().toString(36),
      type: Math.random() > 0.5 ? ActionType.RAID : ActionType.TACKLE,
      result: 'SUCCESS',
      points: Math.floor(Math.random() * 3) + 1,
      teamId: 'team-1',
      timestamp: Date.now(),
      zone: randomZone
    };

    setActions(prev => [...prev, newAction]);
  };

  return {
    intensities,
    actions,
    simulateAction,
    addManualAction: (action: MatchAction) => setActions(prev => [...prev, action])
  };
};
