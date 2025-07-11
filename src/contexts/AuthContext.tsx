
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isGuest: boolean;
  guestId: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestId, setGuestId] = useState<string | null>(null);

  const isGuest = !user || user.is_anonymous;

  useEffect(() => {
    // Generate or retrieve guest ID
    const existingGuestId = localStorage.getItem('linkmage_guest_id');
    if (!existingGuestId) {
      const newGuestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      localStorage.setItem('linkmage_guest_id', newGuestId);
      setGuestId(newGuestId);
    } else {
      setGuestId(existingGuestId);
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.is_anonymous);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If no session exists, sign in anonymously
      if (!session) {
        signInAnonymously();
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInAnonymously = async () => {
    try {
      const { error } = await supabase.auth.signInAnonymously();
      if (error) {
        console.error('Anonymous sign in error:', error);
      }
    } catch (error) {
      console.error('Anonymous sign in failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // After signing out, automatically sign in anonymously
    setTimeout(() => {
      signInAnonymously();
    }, 100);
  };

  const value = {
    user,
    session,
    loading,
    isGuest,
    guestId,
    signIn,
    signUp,
    signOut,
    signInAnonymously,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
