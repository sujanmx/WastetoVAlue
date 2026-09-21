import { IAuthService } from '../interfaces/IAuthService';
import { supabase } from '../../lib/supabase/client';
import { AppError } from '../api/apiError';
import {
  User,
  AuthSession,
  LoginCredentials,
  SignUpPayload,
  OnboardingPayload,
  UserRole,
} from '../../types/auth';
import type { Database } from '../../types/database';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

function mapProfileToUser(userAuth: { id: string; email?: string }, profile?: ProfileRow | null): User {
  return {
    id: userAuth.id,
    name: profile?.name || 'Member',
    email: userAuth.email || profile?.email || '',
    role: (profile?.role as UserRole) || 'household',
    location: profile?.city ? { city: profile.city, latitude: profile.latitude ?? undefined, longitude: profile.longitude ?? undefined } : undefined,
    preferences: {
      interests: (profile?.interests as ('reuse' | 'donate' | 'resell' | 'recycle')[]) || ['reuse', 'donate'],
      notificationsEnabled: profile?.notifications_enabled ?? true,
      reducedMotion: profile?.reduced_motion ?? false,
      searchRadiusKm: profile?.search_radius_km ?? 10,
    },
    createdAt: profile?.created_at || new Date().toISOString(),
  };
}

export class SupabaseAuthService implements IAuthService {
  private async fetchProfile(userId: string): Promise<ProfileRow | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('[SupabaseAuthService] Error fetching profile:', error);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthSession> {
    if (!credentials.email || !credentials.password) {
      throw AppError.validation('Email and password are required.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (error || !data.session || !data.user) {
      throw AppError.fromSupabase(error, 'Invalid login credentials.');
    }

    const profile = await this.fetchProfile(data.user.id);
    const user = mapProfileToUser(data.user, profile);

    return {
      token: data.session.access_token,
      expiresAt: new Date(data.session.expires_at! * 1000).toISOString(),
      user,
    };
  }

  async signUp(payload: SignUpPayload): Promise<AuthSession> {
    if (!payload.email || !payload.password) {
      throw AppError.validation('Email and password are required.');
    }

    const { data, error } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          name: payload.name,
          role: payload.role || 'household',
          city: payload.location || null,
        },
      },
    });

    if (error || !data.user) {
      throw AppError.fromSupabase(error, 'Sign up request failed.');
    }

    // If email confirmation is disabled or automatic session exists
    const sessionToken = data.session?.access_token || 'pending_confirmation';
    const expiresAt = data.session?.expires_at
      ? new Date(data.session.expires_at * 1000).toISOString()
      : new Date(Date.now() + 3600000).toISOString();

    const profile = await this.fetchProfile(data.user.id);
    const user = mapProfileToUser(data.user, profile);

    return {
      token: sessionToken,
      expiresAt,
      user,
    };
  }

  async loginWithGoogle(): Promise<AuthSession> {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/home` : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
      },
    });

    if (error) {
      throw AppError.fromSupabase(error, 'OAuth initialization failed.');
    }

    // OAuth redirects away; dummy session returned for method contract
    return {
      token: 'oauth_redirect',
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
      user: {
        id: 'oauth_pending',
        name: 'OAuth User',
        email: '',
        role: 'household',
        preferences: {
          interests: ['reuse', 'donate'],
          notificationsEnabled: true,
          reducedMotion: false,
          searchRadiusKm: 10,
        },
        createdAt: new Date().toISOString(),
      },
    };
  }

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw AppError.fromSupabase(error, 'Failed to sign out cleanly.');
    }
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session || !data.session.user) {
      return null;
    }

    const profile = await this.fetchProfile(data.session.user.id);
    const user = mapProfileToUser(data.session.user, profile);

    return {
      token: data.session.access_token,
      expiresAt: new Date(data.session.expires_at! * 1000).toISOString(),
      user,
    };
  }

  async completeOnboarding(payload: OnboardingPayload): Promise<User> {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData?.user) {
      throw AppError.unauthorized('No authenticated user found to complete onboarding.');
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        role: payload.role,
        interests: payload.interests,
        city: payload.location || null,
        onboarding_completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id);

    if (error) {
      throw AppError.fromSupabase(error, 'Failed to save onboarding preferences.');
    }

    const updatedProfile = await this.fetchProfile(authData.user.id);
    return mapProfileToUser(authData.user, updatedProfile);
  }

  async requestPasswordReset(email: string): Promise<void> {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/login` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) {
      // Do not leak existence of user account
      console.warn('[SupabaseAuthService] Password reset notice:', error.message);
    }
  }

  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sbSession) => {
      if (!sbSession || !sbSession.user || event === 'SIGNED_OUT') {
        callback(null);
        return;
      }

      if (['SIGNED_IN', 'TOKEN_REFRESHED', 'USER_UPDATED', 'INITIAL_SESSION'].includes(event)) {
        const profile = await this.fetchProfile(sbSession.user.id);
        const user = mapProfileToUser(sbSession.user, profile);
        callback({
          token: sbSession.access_token,
          expiresAt: new Date(sbSession.expires_at! * 1000).toISOString(),
          user,
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }
}
