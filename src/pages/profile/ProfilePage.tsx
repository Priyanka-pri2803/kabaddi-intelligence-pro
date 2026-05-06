import React from 'react';
import { User as UserIcon, LogOut, Radio, Shield, Zap } from 'lucide-react';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useAuth } from '../../hooks/use-auth';
import { Match } from '../../types';
import { reportService } from '../../services/export/report-service';

interface ProfilePageProps {
  matches: Match[];
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ matches }) => {
  const { user, role, logout } = useAuth();
  const displayedMatch = matches[0];

  return (
    <ScreenWrapper title="Operator Identity" subtitle="Secure Access Vault">
      <div className="glass-card p-10 rounded-[3rem] mb-8 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-3xl border-white/10">
        <div className="absolute inset-0 bg-brand-orange/5 opacity-50 blur-[80px]" />
        
        <div className="relative mb-6">
          <div className="w-32 h-32 rounded-[2.5rem] bg-brand-orange/20 flex items-center justify-center border-2 border-brand-orange shadow-[0_0_40px_rgba(255,107,0,0.3)] rotate-3 overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} className="w-full h-full object-cover" alt="Profile" />
            ) : (
                <UserIcon className="w-16 h-16 text-brand-orange" />
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-brand-dark border-2 border-brand-orange rounded-xl flex items-center justify-center">
             <Shield className="w-5 h-5 text-brand-orange" />
          </div>
        </div>

        <h2 className="text-3xl font-display font-black uppercase tracking-tight text-white mb-2">{user?.displayName || 'OPERATOR'}</h2>
        <div className="flex items-center gap-2 mb-8">
           <span className="px-3 py-1 rounded-full bg-brand-orange/10 border border-brand-orange/20 text-[10px] font-black uppercase text-brand-orange tracking-widest">{role}</span>
           <span className="text-white/20 text-[10px] uppercase font-black">Level 04</span>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] text-white/30 uppercase font-black mb-1">Combat Logs</p>
              <p className="text-xl font-display font-black text-white">{matches.length}</p>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[8px] text-white/30 uppercase font-black mb-1">Aggression</p>
              <p className="text-xl font-display font-black text-brand-orange">8.4</p>
           </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {
              if (displayedMatch) {
                reportService.generateTacticalReport(displayedMatch, 'tactical-court-capture');
              } else {
                alert("No match data available for export.");
              }
            }}
            className="py-6 rounded-[2.5rem] bg-white/5 border border-white/10 text-white/60 font-display font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white/10 transition-all flex items-center justify-center gap-3"
          >
            <Radio className="w-4 h-4" /> EXPORT REPORT
          </button>
          <button 
            onClick={logout}
            className="py-6 rounded-[2.5rem] bg-white text-black font-display font-black uppercase tracking-[0.4em] text-[10px] hover:scale-[1.03] active:scale-95 transition-all shadow-2xl brightness-110 flex items-center justify-center gap-3"
          >
            <LogOut className="w-4 h-4" /> TERMINATE SESSION
          </button>
        </div>
      </div>
    </ScreenWrapper>
  );
};
