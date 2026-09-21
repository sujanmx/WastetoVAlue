import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { User, AuthSession, LoginCredentials, SignUpPayload, OnboardingPayload } from '../types/auth';
import { services } from '../services';

export interface SignUpResult {
  session: AuthSession | null;
  requiresConfirmation: boolean;
}

interface AuthContextValue {
  user: User | null;
  session: AuthSession | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isAuthenticated: boolean;
  isPasswordRecovery: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<SignUpResult>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: (payload: OnboardingPayload) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Check URL hash/params for direct recovery indicator on mount
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setIsPasswordRecovery(true);
    }

    async function initAuth() {
      try {
        const existingSession = await services.auth.getCurrentSession();
        if (isMounted) {
          if (existingSession) {
            setSession(existingSession);
            setStatus('authenticated');
          } else {
            setSession(null);
            setStatus('unauthenticated');
          }
        }
      } catch (err) {
        console.error('[AuthContext] Session initialization error:', err);
        if (isMounted) {
          setSession(null);
          setStatus('unauthenticated');
        }
      }
    }

    initAuth();

    // Subscribe to live auth state events (token refresh, login, logout, user update, password recovery)
    const unsubscribe = services.auth.onAuthStateChange((newSession, event) => {
      if (!isMounted) return;

      if (event === 'PASSWORD_RECOVERY') {
        setIsPasswordRecovery(true);
      } else if (event === 'SIGNED_OUT') {
        setIsPasswordRecovery(false);
      }

      if (newSession) {
        setSession(newSession);
        setStatus('authenticated');
      } else {
        setSession(null);
        setStatus('unauthenticated');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setStatus('loading');
    try {
      const newSession = await services.auth.login(credentials);
      setSession(newSession);
      setStatus('authenticated');
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload): Promise<SignUpResult> => {
    setStatus('loading');
    try {
      const newSession = await services.auth.signUp(payload);
      const isPending = !newSession.token || newSession.token === 'pending_confirmation';
      if (isPending) {
        setSession(null);
        setStatus('unauthenticated');
        return { session: null, requiresConfirmation: true };
      } else {
        setSession(newSession);
        setStatus('authenticated');
        return { session: newSession, requiresConfirmation: false };
      }
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setStatus('loading');
    try {
      const newSession = await services.auth.loginWithGoogle();
      setSession(newSession);
      setStatus('authenticated');
    } catch (err) {
      setStatus('unauthenticated');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await services.auth.logout();
    } finally {
      setSession(null);
      setStatus('unauthenticated');
    }
  }, []);

  const completeOnboarding = useCallback(async (payload: OnboardingPayload) => {
    const updatedUser = await services.auth.completeOnboarding(payload);
    setSession((prev) => (prev ? { ...prev, user: updatedUser } : null));
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    setStatus('loading');
    try {
      await services.auth.updatePassword(newPassword);
      setIsPasswordRecovery(false);
      // Refresh current session after password update
      const refreshedSession = await services.auth.getCurrentSession();
      if (refreshedSession) {
        setSession(refreshedSession);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    } catch (err) {
      // Keep authenticated status if session remains valid
      const curSession = await services.auth.getCurrentSession();
      setStatus(curSession ? 'authenticated' : 'unauthenticated');
      throw err;
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: session?.user || null,
      session,
      status,
      isAuthenticated: status === 'authenticated' && !!session,
      isPasswordRecovery,
      login,
      signUp,
      loginWithGoogle,
      logout,
      completeOnboarding,
      updatePassword,
    }),
    [session, status, isPasswordRecovery, login, signUp, loginWithGoogle, logout, completeOnboarding, updatePassword]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return ctx;
}
