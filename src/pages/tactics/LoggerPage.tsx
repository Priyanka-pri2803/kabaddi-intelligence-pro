import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Mic, ChevronRight, Zap, Target, History, Shield, Radio } from 'lucide-react';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Match, ActionType, RaidResult, TackleResult } from '../../types';
import { cn } from '../../lib/utils';
import { aiService } from '../../services/ai/gemini-service';
import { matchService } from '../../services/database/match-service';

interface LoggerPageProps {
  match: Match;
  onBack: () => void;
}

export const LoggerPage: React.FC<LoggerPageProps> = ({ match, onBack }) => {
  const [timer, setTimer] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [insights, setInsights] = useState<string[]>([]);
  const [winProb, setWinProb] = useState(50);

  useEffect(() => {
    let interval: any;
    if (isRunning && timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const addAction = async (type: ActionType, result: RaidResult | TackleResult) => {
    let points = 0;
    if (type === ActionType.RAID) {
      if (result === RaidResult.SUCCESS) points = 1;
      if (result === RaidResult.SUPER_RAID) points = 3;
    } else if (type === ActionType.TACKLE) {
      if (result === TackleResult.SUCCESS) points = 1;
      if (result === TackleResult.SUPER_TACKLE) points = 2;
    }

    const zones = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'D1', 'D2'];
    const randomZone = zones[Math.floor(Math.random() * zones.length)];

    const action = {
      type,
      result,
      points,
      teamId: match.homeTeam.id,
      timestamp: Date.now(),
      zone: randomZone as any
    };

    // Update match score and momentum locally/globally
    const newScore = { ...match.score, home: match.score.home + points };
    const newMomentum = Math.min(100, Math.max(-100, (match.momentum || 0) + (points * 10) - (result === RaidResult.FAIL ? 15 : 0)));

    await matchService.updateMatch(match.id, { 
      score: newScore,
      momentum: newMomentum
    });
    await matchService.addAction(match.id, action);

    // Reset timer
    setTimer(30);
    setIsRunning(false);

    // AI Trigger
    if ((match.actions?.length || 0) % 5 === 0) {
       const ai = await aiService.getTacticalInsights(match);
       setInsights(ai.insights);
       setWinProb(Math.round(ai.winProb * 100));
    }
  };

  return (
    <ScreenWrapper 
      title={`${match.homeTeam?.name || 'Home'} VS ${match.awayTeam?.name || 'Away'}`} 
      subtitle="Combat Intelligence"
      showBack
      onBack={onBack}
    >
      <button 
        onClick={() => {
          const commands = ["Successful raid", "Bonus point", "Super tackle", "Caught mid-flight"];
          const cmd = commands[Math.floor(Math.random() * commands.length)];
          alert(`Voice System: Detected "${cmd}" - Logged automatically.`);
          if (cmd === "Successful raid") addAction(ActionType.RAID, RaidResult.SUCCESS);
        }}
        title="Voice Command Input"
        className="fixed bottom-28 right-8 w-14 h-14 rounded-full bg-brand-orange text-white flex items-center justify-center shadow-2xl orange-glow z-[60] active:scale-95 transition-all group"
      >
        <Mic className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* AI Tactical Intelligence */}
      <AnimatePresence>
        {insights.length > 0 && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="glass-card mb-8 rounded-[2.5rem] border-brand-orange/30 overflow-hidden"
          >
            <div className="bg-brand-orange/10 px-6 py-4 flex items-center gap-3 border-b border-brand-orange/10">
              <div className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-orange">AI Tactical Feed</span>
            </div>
            <div className="p-6 space-y-3">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-4">
                  <ChevronRight className="w-4 h-4 text-brand-orange mt-0.5 shrink-0" />
                  <p className="text-sm font-medium text-white/80">{insight}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="glass-card p-8 rounded-[3rem] mb-8 relative overflow-hidden orange-glow bg-gradient-to-br from-brand-surface to-brand-dark border-white/10">
          <div className="absolute top-0 right-0 p-6">
            <div className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all shadow-lg",
              timer <= 7 ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" : "bg-white/5 border-white/10 text-white/60"
            )}>
              <Timer className="w-5 h-5" />
              <span className="font-display font-black text-lg tabular-nums">{timer.toString().padStart(2, '0')}s</span>
            </div>
          </div>

          <div className="flex items-center justify-around mt-8 mb-8">
            <div className="text-center">
              <p className="sports-stat-label text-brand-orange mb-2">{match.homeTeam?.name || 'Home'}</p>
              <h2 className="text-8xl font-display font-black text-white leading-none">{match.score?.home || 0}</h2>
            </div>
            <div className="h-24 w-px bg-white/10 mx-4" />
            <div className="text-center">
              <p className="sports-stat-label mb-2 opacity-30">{match.awayTeam?.name || 'Away'}</p>
              <h2 className="text-8xl font-display font-black text-white/30 leading-none">{match.score?.away || 0}</h2>
            </div>
          </div>

          {/* Win Probability */}
          <div className="flex items-center justify-between px-6 py-4 bg-white/5 rounded-2xl border border-white/5">
            <div className="text-left">
              <p className="text-[7px] text-white/30 font-black uppercase mb-1">Win Probability</p>
              <p className="text-lg font-display font-black text-brand-orange">{winProb}%</p>
            </div>
            <div className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-brand-orange animate-pulse" />
            </div>
          </div>

          <div className="flex justify-center mt-12 gap-4">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                "px-8 py-3 rounded-2xl flex items-center gap-3 font-display font-black uppercase text-xs tracking-[0.2em] transition-all",
                isRunning ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-green-500/20 text-green-400 border border-green-500/40"
              )}
            >
              {isRunning ? 'CEASE RAID' : 'LAUNCH RAID'}
            </button>
            <button 
              onClick={() => { setTimer(30); setIsRunning(false); }}
              className="px-8 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/40 font-display font-black uppercase text-xs tracking-[0.2em]"
            >
              RESET
            </button>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-6 pb-20">
          <div className="space-y-4">
            <p className="sports-stat-label px-2">Offensive Strike</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => addAction(ActionType.RAID, RaidResult.SUCCESS)}
                className="py-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 font-display font-black uppercase text-[9px]"
              >
                TOUCH
              </button>
              <button 
                onClick={() => addAction(ActionType.RAID, RaidResult.SUPER_RAID)}
                className="py-4 rounded-xl bg-brand-orange/20 border border-brand-orange text-white font-display font-black uppercase text-[9px]"
              >
                SUPER
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <p className="sports-stat-label px-2">Defensive Lockdown</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => addAction(ActionType.TACKLE, TackleResult.SUCCESS)}
                className="py-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-display font-black uppercase text-[9px]"
              >
                PIN
              </button>
              <button 
                onClick={() => addAction(ActionType.TACKLE, TackleResult.SUPER_TACKLE)}
                className="py-4 rounded-xl bg-purple-500/20 border border-purple-500 text-white font-display font-black uppercase text-[9px]"
              >
                BLOCK
              </button>
            </div>
          </div>
      </div>
    </ScreenWrapper>
  );
};
