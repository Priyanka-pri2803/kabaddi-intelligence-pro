import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, LayoutDashboard, Users, MapPin, User as UserIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface BottomNavProps {
  currentScreen: string;
  onScreenChange: (screen: any) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onScreenChange }) => {
  const tabs = [
    { id: 'home', icon: Trophy, label: 'Arena' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Matrix' },
    { id: 'teams', icon: Users, label: 'Standings' },
    { id: 'players', icon: MapPin, label: 'Tactics' },
    { id: 'profile', icon: UserIcon, label: 'Vault' },
  ];

  return (
    <motion.nav 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-6 left-6 right-6 h-20 bg-brand-obsidian/80 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-around px-4 z-50 shadow-2xl glass-card overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-t from-white/5 via-transparent to-transparent pointer-events-none" />
      {tabs.map((tab) => (
        <button 
          key={tab.id}
          onClick={() => onScreenChange(tab.id)} 
          className={cn(
            "flex flex-col items-center gap-1 group relative z-10 transition-all", 
            currentScreen === tab.id ? 'text-brand-orange' : 'text-white/20 hover:text-white/50'
          )}
        >
          <tab.icon className={cn(
            "w-5 h-5 transition-all text-xs", 
            currentScreen === tab.id ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,107,0,0.4)]' : 'group-active:scale-90'
          )} />
          <span className="text-[7px] font-black uppercase tracking-widest leading-none mt-1">{tab.label}</span>
        </button>
      ))}
    </motion.nav>
  );
};
