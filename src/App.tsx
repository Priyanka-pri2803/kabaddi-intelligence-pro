/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from './hooks/use-auth';
import { useMatches } from './hooks/use-matches';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { HomePage } from './pages/home/HomePage';
import { LoggerPage } from './pages/tactics/LoggerPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { TeamsPage } from './pages/teams/TeamsPage';
import { PlayersPage } from './pages/players/PlayersPage';
import { ProfilePage } from './pages/profile/ProfilePage';

// Components
import { BottomNav } from './components/navigation/BottomNav';
import { SplashScreen } from './components/ui/SplashScreen';

type Screen = 'home' | 'logger' | 'dashboard' | 'profile' | 'teams' | 'players';

export default function App() {
  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
  const { matches, loading: matchesLoading } = useMatches(isAuthenticated);
  
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  // Splash logic
  useMemo(() => {
    if (!authLoading && isAuthenticated) {
       const timer = setTimeout(() => setShowSplash(false), 2000);
       return () => clearTimeout(timer);
    } else if (!authLoading && !isAuthenticated) {
       setShowSplash(false);
    }
  }, [authLoading, isAuthenticated]);

  const activeMatch = useMemo(() => 
    matches.find(m => m.id === activeMatchId), 
    [matches, activeMatchId]
  );

  const handleSelectMatch = (id: string, isLive: boolean) => {
    setActiveMatchId(id);
    setCurrentScreen(isLive ? 'logger' : 'dashboard');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="min-h-screen bg-brand-dark overflow-x-hidden">
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : (
          <motion.div
            key="app-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentScreen}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              >
                {currentScreen === 'home' && (
                  <HomePage 
                    matches={matches} 
                    onSelectMatch={handleSelectMatch} 
                    onLogout={logout} 
                  />
                )}
                
                {currentScreen === 'logger' && activeMatch && (
                  <LoggerPage 
                    match={activeMatch} 
                    onBack={() => setCurrentScreen('home')} 
                  />
                )}

                {currentScreen === 'dashboard' && (
                  <DashboardPage 
                    matches={matches} 
                    onBack={() => setCurrentScreen('home')} 
                  />
                )}

                {currentScreen === 'teams' && <TeamsPage />}
                
                {currentScreen === 'players' && <PlayersPage matches={matches} />}
                
                {currentScreen === 'profile' && <ProfilePage matches={matches} />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation (Only show on main screens) */}
            {currentScreen !== 'logger' && (
              <BottomNav 
                currentScreen={currentScreen} 
                onScreenChange={(screen) => setCurrentScreen(screen)} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
