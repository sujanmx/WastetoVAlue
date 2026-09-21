/**
 * Authentication domain contracts and types.
 */

export type UserRole = 'household' | 'student' | 'business' | 'recycler' | 'ngo';

export interface UserPreferences {
  interests: ('reuse' | 'donate' | 'resell' | 'recycle')[];
  notificationsEnabled: boolean;
  reducedMotion: boolean;
  searchRadiusKm: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  location?: {
    city: string;
    latitude?: number;
    longitude?: number;
  };
  preferences: UserPreferences;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password?: string;
  rememberMe?: boolean;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password?: string;
  role?: UserRole;
  location?: string;
}

export interface OnboardingPayload {
  role: UserRole;
  interests: ('reuse' | 'donate' | 'resell' | 'recycle')[];
  location?: string;
}
