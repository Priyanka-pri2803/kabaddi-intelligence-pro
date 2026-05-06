import React from 'react';
import { motion } from 'framer-motion'
import { Activity, Zap, Target, Users, MapPin, Radio, History, ChevronRight, Shield } from 'lucide-react';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { StatCard } from '../../components/ui/StatCard';
import { TacticalCourt } from '../../components/tactical/TacticalCourt';
import { Match, ActionType, RaidResult, TackleResult } from '../../types';
import { cn } from '../../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell 
} from 'recharts';
import { aiService } from '../../services/ai/gemini-service';
import { reportService } from '../../services/export/report-service';

const COLORS = ['#FF6B00', '#3B82F6', '#10B981', '#EF4444'];

interface DashboardPageProps {
  matches: Match[];
  onBack: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ matches, onBack }) => {
  const displayedMatch = matches[0];
  if (!displayedMatch) return <ScreenWrapper title="Stats Matrix" onBack={onBack} showBack><div className="text-center py-20 text-white/20">No matching intel detected.</div></ScreenWrapper>;

  const totalRaids = (displayedMatch.actions || []).filter(a => a.type === ActionType.RAID).length;
  const totalTackles = (displayedMatch.actions || []).filter(a => a.type === ActionType.TACKLE).length;
  const raidEfficiency = aiService.calculateRaidEfficiency(displayedMatch);
  const tackleEfficiency = aiService.calculateTackleEfficiency(displayedMatch);

  const pieData = [
    { name: 'Raids', value: totalRaids },
    { name: 'Tackles', value: totalTackles },
  ];

  const momentumData = (displayedMatch.actions || []).map((a, i) => ({
    name: `A${i + 1}`,
    val: a.points * (a.type === ActionType.RAID ? 1 : 1.5)
  }));

  return (
    <ScreenWrapper title="Stats Matrix" subtitle="Aggregated Combat Telemetry" showBack onBack={onBack}>
      <div className="grid grid-cols-2 gap-4 mb-8">
        <StatCard label="Strike Efficiency" value={`${raidEfficiency}%`} subValue="+12% from avg" trend="up" icon={Zap} />
        <StatCard label="Lockdown Rate" value={`${tackleEfficiency}%`} subValue="Steady" trend="up" icon={Shield} />
        <StatCard label="Total Impact" value={displayedMatch.score?.home || 0} subValue="Points Clocked" icon={Target} />
        <StatCard label="Combat Actions" value={displayedMatch.actions?.length || 0} subValue="Telemetry Logs" icon={Activity} />
      </div>

      <div className="grid gap-6">
        <div className="glass-card p-6 rounded-[2.5rem]">
           <div className="flex items-center justify-between mb-6">
              <p className="sports-stat-label">Tactical Distribution</p>
              <div className="flex gap-4">
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-brand-orange" /><span className="text-[8px] font-black uppercase text-white/40">Raids</span></div>
                 <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /><span className="text-[8px] font-black uppercase text-white/40">Tackles</span></div>
              </div>
           </div>
           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                       {pieData.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                 </PieChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-card p-6 rounded-[2.5rem]">
           <p className="sports-stat-label mb-6">Momentum Oscillations</p>
           <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={momentumData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF6B00" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#FF6B00" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                    <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid #ffffff10' }} />
                    <Area type="monotone" dataKey="val" stroke="#FF6B00" fillOpacity={1} fill="url(#colorVal)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="glass-card p-6 rounded-[3rem] border-brand-orange/10 flex items-center justify-between group cursor-pointer" onClick={() => reportService.generateTacticalReport(displayedMatch, 'tactical-court-capture')}>
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                <Radio className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-display font-black text-white uppercase tracking-tight">Generate Recon Report</h4>
                <p className="text-[8px] text-white/30 uppercase font-bold tracking-widest">PDF Tactical Export</p>
              </div>
           </div>
           <ChevronRight className="w-5 h-5 text-white/10 group-hover:text-brand-orange transition-colors" />
        </div>
      </div>
    </ScreenWrapper>
  );
};


