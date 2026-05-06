import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Users, Radio, History, ChevronRight } from 'lucide-react';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { cn } from '../../lib/utils';

export const TeamsPage: React.FC = () => {
    const leagueData = [
      { id: '1', name: 'Jaipur Pink Panthers', s: 'JPP', p: 12, w: 8, l: 3, d: 1, pts: 42 },
      { id: '2', name: 'Puneri Paltan', s: 'PUN', p: 12, w: 9, l: 2, d: 1, pts: 48 },
      { id: '3', name: 'Dabang Delhi KC', s: 'DEL', p: 11, w: 7, l: 4, d: 0, pts: 35 },
      { id: '4', name: 'Bengaluru Bulls', s: 'BLR', p: 12, w: 6, l: 6, d: 0, pts: 30 },
      { id: '5', name: 'U Mumba', s: 'MUM', p: 12, w: 5, l: 6, d: 1, pts: 26 },
    ].sort((a, b) => b.pts - a.pts);

    return (
      <ScreenWrapper title="Pro Standings" subtitle="Live League Matrix">
        <div className="glass-card rounded-[2.5rem] overflow-hidden border-white/5">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-[8px] font-black uppercase text-white/30 tracking-widest">Rank</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase text-white/30 tracking-widest">Squad</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase text-white/30 tracking-widest text-center">P</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase text-white/30 tracking-widest text-center">W</th>
                <th className="px-6 py-4 text-[8px] font-black uppercase text-white/30 tracking-widest text-center">PTS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {leagueData.map((team, i) => (
                <tr key={team.id} className="group hover:bg-brand-orange/5 transition-colors">
                  <td className="px-6 py-5">
                    <span className={cn(
                      "flex items-center justify-center w-6 h-6 rounded-md font-display font-black text-xs",
                      i === 0 ? "bg-brand-orange text-white" : "bg-white/5 text-white/40"
                    )}>{i + 1}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 text-[10px] font-black text-brand-orange">
                        {team.s}
                      </div>
                      <span className="font-display font-bold text-sm tracking-tight text-white/80 group-hover:text-white transition-colors">{team.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center font-display font-bold text-white/40 text-sm">{team.p}</td>
                  <td className="px-6 py-5 text-center font-display font-bold text-green-500/60 text-sm">{team.w}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="font-display font-black text-white text-md tabular-nums">{team.pts}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="glass-card p-6 rounded-3xl border-brand-orange/10">
            <Radio className="w-5 h-5 text-brand-orange mb-3" />
            <p className="text-[7px] font-black uppercase text-white/20 tracking-widest mb-1">Live Feed</p>
            <p className="text-xs font-medium text-white/70">Panthers lead Bulls by 2 points at half-time.</p>
          </div>
          <div className="glass-card p-6 rounded-3xl border-blue-500/10">
            <History className="w-5 h-5 text-blue-500 mb-3" />
            <p className="text-[7px] font-black uppercase text-white/20 tracking-widest mb-1">Last Update</p>
            <p className="text-xs font-medium text-white/70">Tournament schedule updated for Phase 2.</p>
          </div>
        </div>
      </ScreenWrapper>
    );
};
