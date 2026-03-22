import React, { createContext, useContext, useEffect, useState } from 'react';
import { authSignIn, authSignInWithGoogle, authSignOut, authSignUp, request, tokenStore } from '@/lib/apiClient';

interface AuthUser {
  id: string;
  email?: string | null;
  email_confirmed_at?: string | null;
}

interface Session {
  access_token: string;
}

interface Profile {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  phone_verified: boolean;
  bio: string | null;
  location: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  avatar_url: string | null;
  is_seller: boolean;
  role: 'BUYER' | 'SELLER' | 'ADMIN' | 'COURIER';
  created_at: string;
  updated_at: string;
}

interface SignUpMetadata {
  username?: string;
  full_name?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  city?: string;
  address?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isEmailVerified: boolean;
  signUp: (email: string, password: string, metadata?: SignUpMetadata) => Promise<{ error: unknown; userId?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signInWithGoogle: (idToken: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: unknown }>;
  refreshProfile: () => Promise<void>;
  resendVerificationEmail: () => Promise<{ error: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const data = await request<{ profile: Profile }>(`/profiles/me`, { auth: true });
      if (data.profile) setProfile(data.profile);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    type MeResponse = {
      user: {
        id: string;
        email?: string | null;
        email_confirmed_at?: string | null;
      };
    };
    const init = async () => {
      if (!tokenStore.accessToken) {
        setUser(null);
        setSession(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      try {
        const data = await request<MeResponse>('/auth/me', { auth: true });
        const nextUser: AuthUser = {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
        };
        setUser(nextUser);
        setSession({ access_token: 'in-memory' });
        await fetchProfile();
      } catch {
        setUser(null);
        setSession(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const signUp = async (email: string, password: string, metadata?: SignUpMetadata) => {
    try {
      const data = await authSignUp(email, password, metadata);
      const nextUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at || null,
      };
      setUser(nextUser);
      setSession({ access_token: data.accessToken });
      await fetchProfile();
      return { error: null, userId: nextUser.id };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const data = await authSignIn(email, password);
      const nextUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at || null,
      };
      setUser(nextUser);
      setSession({ access_token: data.accessToken });
      await fetchProfile();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await authSignOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const signInWithGoogle = async (idToken: string) => {
    try {
      const data = await authSignInWithGoogle(idToken);
      const nextUser: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        email_confirmed_at: data.user.email_confirmed_at || null,
      };
      setUser(nextUser);
      setSession({ access_token: data.accessToken });
      await fetchProfile();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    try {
      await request<{ profile: Profile }>('/profiles/me', {
        method: 'PATCH',
        body: updates,
      });
      await fetchProfile();
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile();
    }
  };

  const isEmailVerified = !!user?.email_confirmed_at;

  const resendVerificationEmail = async () => {
    if (!user?.email) return { error: new Error('No email') };
    // Placeholder endpoint can be wired later if required.
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      isEmailVerified,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      updateProfile,
      refreshProfile,
      resendVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
