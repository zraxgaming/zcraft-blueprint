import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  bio: string | null;
  role: 'user' | 'moderator' | 'admin';
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  signInWithDiscord: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isAdmin: boolean;
  isModerator: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      setUserProfile(data as UserProfile);
    } catch (err) {
      console.error('Error in fetchUserProfile:', err);
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get the current session
        const {
          data: { session: initialSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        setSession(initialSession);
        setUser(initialSession?.user || null);

        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user.id);
        }

        // Subscribe to auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            setSession(newSession);
            setUser(newSession?.user || null);

            if (newSession?.user) {
              await fetchUserProfile(newSession.user.id);
            } else {
              setUserProfile(null);
            }
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    setLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email,
        username,
        role: 'user',
      });

      if (profileError) throw profileError;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      setUserProfile((prev) => prev ? { ...prev, ...updates } : null);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const signInWithDiscord = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Discord sign-in error:', error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('GitHub sign-in error:', error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isModerator = userProfile?.role === 'moderator' || isAdmin;

  const value: AuthContextType = {
    user,
    userProfile,
    session,
    loading,
    login,
    register,
    logout,
    updateProfile,
    signInWithDiscord,
    signInWithGithub,
    signInWithGoogle,
    isAdmin,
    isModerator,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
