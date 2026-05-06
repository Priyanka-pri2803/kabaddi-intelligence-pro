import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { authService } from '../../services/auth/auth-service';

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await authService.loginWithGoogle();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 filter grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/80 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-sm"
        >
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-brand-orange/20 border-2 border-brand-orange rounded-3xl mx-auto flex items-center justify-center orange-glow mb-6 rotate-3">
              <Trophy className="w-10 h-10 text-brand-orange" />
            </div>
            <h1 className="text-4xl font-display font-black uppercase tracking-tight text-white mb-2 leading-none">ARENA PRO</h1>
            <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em]">Tactical Analytics Engine</p>
          </div>

          <div className="glass-card p-8 rounded-[2.5rem] border-white/10 space-y-8 text-center">
             <div className="space-y-2">
                <h3 className="text-xl font-display font-black text-white uppercase">Secure Entry</h3>
                <p className="text-xs text-white/40 font-medium">Use your corporate or authorized Google ID to access the tactical simulation environment.</p>
             </div>

             <button 
                onClick={handleLogin}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 rounded-2xl font-display font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
             >
                {loading ? 'Authorizing...' : 'Sovereign ID Sign-In'}
             </button>

             <p className="text-[8px] text-white/20 uppercase font-black tracking-widest bg-white/5 py-2 rounded-lg">Encrypted Connection Established</p>
          </div>
        </motion.div>
      </div>
  );
};
