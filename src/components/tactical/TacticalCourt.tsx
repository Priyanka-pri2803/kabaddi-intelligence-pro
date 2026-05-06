import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchAction } from '../../types';
import { cn } from '../../lib/utils';

interface TacticalCourtProps {
  actions: MatchAction[];
  className?: string;
  id?: string;
}

export const TacticalCourt: React.FC<TacticalCourtProps> = ({ actions, className, id }) => {
  const zones = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'] as const;
  
  // Calculate weights based on action density and recency
  const actionCounts = zones.reduce((acc, z) => {
    const zoneActions = (actions || []).filter(a => a.zone === z);
    // Recent actions (last 60s) count double for visual intensity
    const now = Date.now();
    const weightedCount = zoneActions.reduce((sum, a) => {
      const recencyBonus = (now - a.timestamp) < 60000 ? 2 : 1;
      return sum + (a.points > 0 ? 1.5 : 1) * recencyBonus;
    }, 0);
    
    acc[z] = weightedCount;
    return acc;
  }, {} as Record<string, number>);

  const max = Math.max(...Object.values(actionCounts), 1);

  const getHeatColor = (weight: number) => {
    if (weight === 0) return 'transparent';
    if (weight < 0.3) return 'rgba(255, 107, 0, 0.1)';
    if (weight < 0.6) return 'rgba(255, 107, 0, 0.3)';
    if (weight < 0.8) return 'rgba(255, 107, 0, 0.5)';
    return 'rgba(255, 107, 0, 0.8)';
  };

  return (
    <div id={id} className={cn("relative aspect-[3/2] w-full bg-brand-obsidian/40 rounded-2xl border border-white/5 overflow-hidden stadium-grid", className)}>
      <div className="absolute inset-0 flex flex-wrap">
        {zones.map(z => {
          const weight = actionCounts[z] / max;
          const isActive = (Date.now() - ((actions || []).filter(a => a.zone === z).pop()?.timestamp || 0)) < 3000;

          return (
            <div 
              key={z} 
              className="w-1/4 h-1/2 border border-white/5 flex items-center justify-center relative group"
            >
              <motion.div 
                initial={false}
                animate={{ 
                  backgroundColor: getHeatColor(weight),
                  opacity: weight > 0 ? 1 : 0,
                  scale: isActive ? 1.05 : 1
                }}
                transition={{ duration: 1 }}
                className={cn(
                  "absolute inset-0 heat-zone-transition",
                  weight > 0.8 && "animate-heat-throb"
                )} 
              />
              
              {/* Dynamic Glow for High Intensity Zones */}
              {weight > 0.5 && (
                <div className="absolute inset-0 bg-brand-orange/10 blur-xl pointer-events-none" />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[10px] font-black text-white/10 group-hover:text-white/40 transition-colors uppercase tracking-widest">{z}</span>
                {actionCounts[z] > 0 && (
                   <span className="text-[8px] font-bold text-brand-orange/60 font-mono tracking-tighter">
                     {Math.round(weight * 100)}%
                   </span>
                )}
              </div>

              <AnimatePresence>
                {isActive && (
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    className="absolute inset-0 border-2 border-brand-orange rounded-full pointer-events-none"
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Professional Tactical Lines */}
      <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20 shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
      <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-white/5" />
      <div className="absolute top-0 bottom-0 right-1/4 w-[1px] bg-white/5" />
      <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
      
      {/* Scoring Lines (Baulk/Bonus representation) */}
      <div className="absolute top-[15%] bottom-[15%] left-1/4 w-[1px] bg-white/20 border-l border-white/5" />
      <div className="absolute top-[15%] bottom-[15%] right-1/4 w-[1px] bg-white/20 border-r border-white/5" />
    </div>
  );
};

