import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronRight, Activity, Shield, Target, Trophy, X, Trash2 } from 'lucide-react';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { Match, Team, Player } from '../../types';
import { cn } from '../../lib/utils';
import { matchService } from '../../services/database/match-service';

interface HomePageProps {
  matches: Match[];
  onSelectMatch: (id: string, isLive: boolean) => void;
  onLogout: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ matches, onSelectMatch, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempHome, setTempHome] = useState('Home Team');
  const [tempAway, setTempAway] = useState('Away Team');

  const confirmCreateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const createTeam = (name: string): Team => ({
      id: crypto.randomUUID(),
      name,
      shortName: name.substring(0, 3).toUpperCase(),
      players: Array.from({ length: 7 }, (_, i) => ({
        id: crypto.randomUUID(),
        name: i === 0 ? "Captain" : `Elite Unit ${i + 1}`,
        number: i + 1 + Math.floor(Math.random() * 90),
        role: i < 3 ? 'RAIDER' : 'DEFENDER',
        stats: { raids: 0, tackles: 0, points: 0, efficiency: 75 + Math.floor(Math.random() * 20) }
      }))
    });

    const newMatch: Omit<Match, 'id'> = {
      homeTeam: createTeam(tempHome),
      awayTeam: createTeam(tempAway),
      date: new Date().toLocaleDateString(),
      actions: [],
      isLive: true,
      half: 1,
      score: { home: 0, away: 0 },
      revivalQueue: { home: [], away: [] },
      momentum: 0,
      winProbability: { home: 50, away: 50 }
    };

    const id = await matchService.createMatch(newMatch as any);
    if (id) {
       onSelectMatch(id, true);
    }
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this match session?')) {
      await matchService.deleteMatch(id);
    }
  };

  return (
    <ScreenWrapper title="Arena Hub" subtitle="Tactical Control Unit">
      {/* Hero Section */}
      <div className="relative h-48 rounded-3xl overflow-hidden mb-8 glass-card border-brand-orange/20 group">
        <img 
          src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80" 
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 blur-[2px]" 
          alt="Stadium"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark to-transparent" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-3xl font-display font-black uppercase leading-none mb-1 text-white">Dominate the Court</h2>
          <p className="text-white/60 text-[10px] font-bold uppercase tracking-[0.2em]">Real-time analytics for professional play</p>
        </div>
      </div>

      <div className="grid gap-6">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full h-24 rounded-2xl bg-gradient-to-br from-brand-orange to-[#FF4500] p-[1px] group transition-all active:scale-95 shadow-xl shadow-brand-orange/10"
        >
          <div className="w-full h-full bg-brand-dark/95 rounded-[inherit] flex items-center justify-between px-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center">
                <Plus className="w-6 h-6 text-brand-orange" />
              </div>
              <div className="text-left">
                <span className="block font-display font-black text-white uppercase tracking-tight text-xl leading-tight">Initialize</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest font-black">Launch Session Logger</span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-brand-orange group-hover:translate-x-1 transition-transform" />
          </div>
        </button>

        <div className="flex items-center justify-between mt-4 mb-2">
          <h2 className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black px-2">Battle Logs</h2>
          <span className="text-[10px] text-brand-orange font-bold uppercase px-2">{matches.length} Total</span>
        </div>

        {matches.map(m => (
          <motion.div 
            key={m.id}
            layout
            onClick={() => onSelectMatch(m.id, m.isLive)}
            className="glass-card p-5 rounded-2xl flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
          >
            {m.isLive && (
              <div className="absolute top-0 left-0 w-1 h-full bg-brand-orange animate-pulse" />
            )}
            <div className="flex gap-4 items-center">
              <div className={cn(
                "w-14 h-14 rounded-xl flex flex-col items-center justify-center font-display leading-tight border transition-colors",
                m.isLive ? "bg-brand-orange/10 border-brand-orange/40 text-brand-orange shadow-lg shadow-brand-orange/10" : "bg-white/5 border-white/5 text-white/40 group-hover:text-white/60"
              )}>
                <span className="text-2xl font-black">{m.score?.home || 0}</span>
                <span className="text-[8px] uppercase font-black tracking-widest">PTS</span>
              </div>
              <div>
                <h3 className="font-display font-black text-xl text-white group-hover:text-brand-orange transition-colors">
                  {m.homeTeam?.name || 'Home'} <span className="text-white/20 px-1">VS</span> {m.awayTeam?.name || 'Away'}
                </h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-white/30 uppercase font-black ml-0.5">{m.date}</span>
                  {m.isLive && (
                    <span className="flex items-center gap-1 text-[8px] text-brand-orange font-black uppercase px-2 py-0.5 rounded-md bg-brand-orange/10 border border-brand-orange/20">
                      LIVE
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={(e) => handleDelete(m.id, e)}
                title="Delete match"
                className="p-2 text-white/10 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <ChevronRight className="w-5 h-5 text-white/10 group-hover:translate-x-1 transition-transform group-hover:text-brand-orange" />
            </div>
          </motion.div>
        ))}

        {matches.length === 0 && (
          <div className="py-20 text-center glass-card rounded-3xl border-dashed border-white/10">
            <Activity className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 font-display uppercase tracking-widest text-[10px] font-black">Archive Empty</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm glass-card p-8 rounded-[2.5rem] border-brand-orange/20 shadow-2xl"
            >
              <form onSubmit={confirmCreateMatch} className="space-y-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-display font-black uppercase text-white tracking-tight">Mission Setup</h3>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Configure Target Opponent</p>
                    </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="sports-stat-label">Home Designation</label>
                    <input 
                      type="text" 
                      value={tempHome}
                      onChange={(e) => setTempHome(e.target.value)}
                      placeholder="Home Team..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none font-display uppercase font-bold"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="sports-stat-label">Opponent Designation</label>
                    <input 
                      type="text" 
                      value={tempAway}
                      onChange={(e) => setTempAway(e.target.value)}
                      placeholder="Away Team..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-brand-orange outline-none font-display uppercase font-bold"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/10 rounded-xl"
                  >
                    Abort
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-white bg-brand-orange rounded-xl shadow-lg shadow-brand-orange/30"
                  >
                    Deploy
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ScreenWrapper>
  );
};
