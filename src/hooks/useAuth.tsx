import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ApiError, api, setUnauthorizedHandler } from '../lib/api';
import type { AuthUser } from '../types/api';

interface AuthContextValue {
  user: AuthUser | null;
  /** `loading` until the first "who am I?" check finishes. */
  status: 'loading' | 'ready';
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (name: string, email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready'>('loading');

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ user: AuthUser }>('/api/auth/me')
      .then((res) => !cancelled && setUser(res.user))
      .catch((err: unknown) => {
        // 401 simply means "not signed in". Anything else (server down) also lands here as signed out.
        if (!(err instanceof ApiError) || err.status !== 401) console.warn('Could not check session');
        if (!cancelled) setUser(null);
      })
      .finally(() => !cancelled && setStatus('ready'));
    return () => {
      cancelled = true;
    };
  }, []);

  // If any request later reports the session is gone (expired, revoked, disabled), sign out locally.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: AuthUser }>('/api/auth/login', { email, password });
    setUser(res.user);
    return res.user;
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await api.post<{ user: AuthUser }>('/api/auth/register', { name, email, password });
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(() => ({ user, status, login, register, logout }), [user, status, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
