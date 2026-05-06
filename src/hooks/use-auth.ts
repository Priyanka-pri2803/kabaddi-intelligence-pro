import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { authService } from '../services/auth/auth-service';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('SPECTATOR');

  useEffect(() => {
    const unsub = authService.onAuthChange(async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userRole = await authService.getUserRole(firebaseUser.uid);
        setRole(userRole);
      } else {
        setRole('SPECTATOR');
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return {
    user,
    loading,
    role,
    isAuthenticated: !!user,
    login: authService.loginWithGoogle,
    logout: authService.logout
  };
};
