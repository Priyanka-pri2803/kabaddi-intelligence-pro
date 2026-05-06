import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

export const SplashScreen: React.FC = () => (
  <motion.div 
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] bg-brand-dark flex flex-col items-center justify-center stadium-grid"
  >
    <motion.div 
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative"
    >
      <div className="w-48 h-48 rounded-[3rem] border-2 border-brand-orange/30 flex items-center justify-center p-8 orange-glow mb-12 relative overflow-hidden">
        <Trophy className="w-full h-full text-brand-orange relative z-10" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-br from-brand-orange/10 to-transparent"
        />
      </div>
      
      <div className="text-center space-y-4">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-display font-black uppercase tracking-tighter text-white"
        >
          KABADDI <span className="text-brand-orange">INTEL</span>
        </motion.h1>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 0.8, duration: 1 }}
          className="h-[2px] bg-brand-orange/40 mx-auto"
        />
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-[10px] text-white/40 uppercase font-black tracking-[0.5em]"
        >
          Tactical Simulation Engine Initializing
        </motion.p>
      </div>
    </motion.div>
    
    <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-brand-orange animate-ping" />
      <span className="text-[8px] text-white/20 font-black uppercase tracking-widest">Network Secure</span>
    </div>
  </motion.div>
);
