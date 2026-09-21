import { User, AuthSession, LoginCredentials, SignUpPayload, OnboardingPayload } from '../../types/auth';

export interface IAuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  signUp(payload: SignUpPayload): Promise<AuthSession>;
  loginWithGoogle(): Promise<AuthSession>;
  logout(): Promise<void>;
  getCurrentSession(): Promise<AuthSession | null>;
  completeOnboarding(payload: OnboardingPayload): Promise<User>;
  requestPasswordReset(email: string): Promise<void>;
  onAuthStateChange(callback: (session: AuthSession | null) => void): () => void;
}
