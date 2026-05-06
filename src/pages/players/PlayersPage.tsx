import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Zap } from 'lucide-react';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { TacticalCourt } from '../../components/tactical/TacticalCourt';
import { Match } from '../../types';
import { cn } from '../../lib/utils';
import { useHeatmap } from '../../hooks/use-heatmap';

interface PlayersPageProps {
  matches: Match[];
}

export const PlayersPage: React.FC<PlayersPageProps> = ({ matches }) => {
    const displayedMatch = matches[0];
    const { actions, simulateAction } = useHeatmap(displayedMatch?.actions || []);
    
    return (
      <ScreenWrapper title="Combat Tactical" subtitle="Personnel & Spatial Matrix">
        <div className="space-y-6">
          <div className="glass-card p-6 rounded-3xl overflow-hidden relative">
            <div className="flex items-center justify-between mb-4">
               <p className="sports-stat-label">Spatial Intensity (Heatmap)</p>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={simulateAction}
                    className="flex items-center gap-2 bg-brand-orange/10 hover:bg-brand-orange/20 border border-brand-orange/30 px-3 py-1.5 rounded-xl transition-all group active:scale-95"
                  >
                    <Zap className="w-3 h-3 text-brand-orange group-hover:scale-110" />
                    <span className="text-[10px] font-black uppercase text-brand-orange tracking-widest">Simulate Event</span>
                  </button>
                  <MapPin className="w-4 h-4 text-brand-orange animate-pulse" />
               </div>
            </div>
            <TacticalCourt id="tactical-court-capture" actions={actions} />
          </div>

          <div className="grid gap-4">
            <p className="sports-stat-label px-2">Personnel Readiness</p>
            {displayedMatch?.homeTeam?.players?.map((player, i) => (
              <div key={player?.id || i} className="glass-card p-6 rounded-2xl flex items-center justify-between group hover:border-brand-orange/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange border border-brand-orange/20">
                    <span className="font-display font-black text-xl">#{player?.number || '0'}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg uppercase tracking-tight text-white group-hover:text-brand-orange transition-colors">
                      {player?.name || 'Unknown Unit'}
                    </h3>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] text-white/40 uppercase font-black">{player?.role || 'COMBATANT'}</span>
                       <div className={cn(
                         "w-1.5 h-1.5 rounded-full",
                         displayedMatch.revivalQueue?.home?.includes(player.id) ? "bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]" : "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]"
                       )} />
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block text-xl font-display font-black text-white">{player?.stats?.efficiency || 0}%</span>
                  <span className="text-[8px] text-white/20 uppercase font-black">Combat Efficiency</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScreenWrapper>
    );
};

