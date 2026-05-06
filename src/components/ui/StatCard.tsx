import React from 'react';
import { cn } from '../../lib/utils';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  trend?: 'up' | 'down';
  icon?: any;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  subValue, 
  trend, 
  icon: Icon 
}) => (
  <div className="glass-card p-5 rounded-2xl flex flex-col justify-between group hover:border-brand-orange/30 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <p className="sports-stat-label">{label}</p>
      {Icon && <Icon className="w-4 h-4 text-white/20 group-hover:text-brand-orange transition-colors" />}
    </div>
    <div>
      <h3 className="sports-stat-value text-3xl mb-1">{value}</h3>
      {subValue && (
        <div className="flex items-center gap-1">
          <span className={cn("text-[10px] font-bold uppercase tracking-widest", trend === 'up' ? 'text-green-400' : 'text-white/30')}>
            {subValue}
          </span>
        </div>
      )}
    </div>
  </div>
);
