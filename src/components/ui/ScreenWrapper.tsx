import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ScreenWrapperProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export const ScreenWrapper: React.FC<ScreenWrapperProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBack, 
  onBack, 
  className 
}) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.02 }}
    className={cn("min-h-screen pb-32 px-4 pt-6 max-w-2xl mx-auto w-full", className)}
  >
    <div className="flex items-center justify-between mb-8">
      <div>
        <div className="flex items-center gap-2">
          {showBack && (
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full -ml-2 transition-colors" title="Go back">
              <ChevronRight className="rotate-180 w-5 h-5 text-white/60" />
            </button>
          )}
          <h1 className="text-2xl font-display font-black uppercase tracking-tight text-white">{title}</h1>
        </div>
        {subtitle && <p className="text-white/40 text-xs font-bold uppercase tracking-widest mt-1">{subtitle}</p>}
      </div>
      <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center orange-glow">
        <Activity className="w-5 h-5 text-brand-orange" />
      </div>
    </div>
    {children}
  </motion.div>
);
