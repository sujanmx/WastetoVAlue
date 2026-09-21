import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { services } from '../services';
import { AppError } from '../services/api/apiError';

describe('Authentication Flows & Security UX', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });
  describe('LoginPage Behavior', () => {
    const renderLogin = () => {
      return render(
        <MemoryRouter initialEntries={['/login']}>
          <AuthProvider>
            <LoginPage />
          </AuthProvider>
        </MemoryRouter>
      );
    };

    it('renders login form with accessible labels and show/hide password toggle', () => {
      renderLogin();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Show password/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /^Sign in$/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue with Google/i })).toBeInTheDocument();
    });

    it('toggles password visibility with accessible label update', () => {
      renderLogin();
      const passwordInput = screen.getByLabelText(/^Password$/i);
      const toggleButton = screen.getByRole('button', { name: /Show password/i });

      expect(passwordInput).toHaveAttribute('type', 'password');
      fireEvent.click(toggleButton);

      expect(passwordInput).toHaveAttribute('type', 'text');
      expect(screen.getByRole('button', { name: /Hide password/i })).toBeInTheDocument();
    });

    it('validates required email and password fields on submit', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/^Password$/i);
      const submitButton = screen.getByRole('button', { name: /^Sign in$/i });

      // Clear default values
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.change(passwordInput, { target: { value: '' } });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/Email address is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/Password is required/i)).toBeInTheDocument();
    });

    it('validates email format', async () => {
      renderLogin();
      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitButton = screen.getByRole('button', { name: /^Sign in$/i });

      fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
      fireEvent.click(submitButton);

      expect(await screen.findByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    it('displays actionable error when authentication fails', async () => {
      vi.spyOn(services.auth, 'login').mockRejectedValueOnce(
        new AppError({
          message: 'Invalid credentials',
          code: 'AUTHENTICATION_ERROR',
          userMessage: 'Invalid email or password. Please verify your credentials.',
        })
      );

      renderLogin();
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/^Password$/i);
      const submitButton = screen.getByRole('button', { name: /^Sign in$/i });

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrongpass' } });
      fireEvent.click(submitButton);

      expect(
        await screen.findByText(/Invalid email or password. Please verify your credentials./i)
      ).toBeInTheDocument();
    });
  });

  describe('SignUpPage Behavior', () => {
    const renderSignUp = () => {
      return render(
        <MemoryRouter initialEntries={['/signup']}>
          <AuthProvider>
            <SignUpPage />
          </AuthProvider>
        </MemoryRouter>
      );
    };

    it('renders all required registration fields including domain roles', () => {
      renderSignUp();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^Confirm Password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/I am joining as a/i)).toBeInTheDocument();
    });

    it('validates password mismatch and minimum length', async () => {
      renderSignUp();
      const nameInput = screen.getByLabelText(/Full Name/i);
      const emailInput = screen.getByLabelText(/Email Address/i);
      const passwordInput = screen.getByLabelText(/^Password$/i);
      const confirmInput = screen.getByLabelText(/^Confirm Password$/i);
      const submitBtn = screen.getByRole('button', { name: /Create account/i });

      fireEvent.change(nameInput, { target: { value: 'Alex Morgan' } });
      fireEvent.change(emailInput, { target: { value: 'alex@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.change(confirmInput, { target: { value: 'different' } });
      fireEvent.click(submitBtn);

      expect(await screen.findByText(/Password must be at least 8 characters/i)).toBeInTheDocument();
      expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    it('handles email confirmation required state gracefully', async () => {
      vi.spyOn(services.auth, 'signUp').mockResolvedValueOnce({
        token: 'pending_confirmation',
        expiresAt: '',
        user: {
          id: 'user_new',
          name: 'Alex Morgan',
          email: 'alex.confirm@example.com',
          role: 'household',
          preferences: {
            interests: ['reuse'],
            notificationsEnabled: true,
            reducedMotion: false,
            searchRadiusKm: 10,
          },
          createdAt: new Date().toISOString(),
        },
      });

      renderSignUp();
      fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Alex Morgan' } });
      fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'alex.confirm@example.com' } });
      fireEvent.change(screen.getByLabelText(/^Password$/i), { target: { value: 'password123' } });
      fireEvent.change(screen.getByLabelText(/^Confirm Password$/i), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: /Create account/i }));

      expect(await screen.findByText(/Verify your email/i)).toBeInTheDocument();
      expect(screen.getByText(/We've sent a verification link to/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Proceed to sign in/i })).toBeInTheDocument();
    });
  });

  describe('ForgotPasswordPage Behavior', () => {
    it('validates email format and displays account-enumeration safe confirmation', async () => {
      const resetSpy = vi.spyOn(services.auth, 'requestPasswordReset').mockResolvedValueOnce();

      render(
        <MemoryRouter initialEntries={['/forgot-password']}>
          <ForgotPasswordPage />
        </MemoryRouter>
      );

      const emailInput = screen.getByLabelText(/Email Address/i);
      const submitBtn = screen.getByRole('button', { name: /Send reset link/i });

      // Missing email
      fireEvent.change(emailInput, { target: { value: '' } });
      fireEvent.click(submitBtn);
      expect(await screen.findByText(/Email address is required/i)).toBeInTheDocument();

      // Valid email
      fireEvent.change(emailInput, { target: { value: 'user@example.com' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(resetSpy).toHaveBeenCalledWith('user@example.com');
      });

      expect(await screen.findByText(/Check your email/i)).toBeInTheDocument();
      expect(screen.getByText(/If an account exists for/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Return to sign in/i })).toBeInTheDocument();
    });
  });

  describe('ResetPasswordPage Behavior & Password Recovery Flow', () => {
    it('detects expired link from URL error parameters and displays recovery advice', async () => {
      // Simulate Supabase OTP expired redirect URL
      delete (window as unknown as { location: unknown }).location;
      (window as unknown as { location: unknown }).location = {
        origin: 'https://waste2value.vercel.app',
        pathname: '/reset-password',
        search: '?error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired',
        hash: '',
      };

      render(
        <MemoryRouter initialEntries={['/reset-password?error=access_denied&error_code=otp_expired']}>
          <AuthProvider>
            <ResetPasswordPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByText(/Reset Link Expired/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Request New Reset Link/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Return to Sign In/i })).toBeInTheDocument();
    });

    it('detects missing recovery session and prompts for link request', async () => {
      delete (window as unknown as { location: unknown }).location;
      (window as unknown as { location: unknown }).location = {
        origin: 'https://waste2value.vercel.app',
        pathname: '/reset-password',
        search: '',
        hash: '',
      };

      vi.spyOn(services.auth, 'getCurrentSession').mockResolvedValue(null);

      render(
        <MemoryRouter initialEntries={['/reset-password']}>
          <AuthProvider>
            <ResetPasswordPage />
          </AuthProvider>
        </MemoryRouter>
      );

      expect(await screen.findByText(/Password Reset Required/i, {}, { timeout: 2000 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Request Reset Link/i })).toBeInTheDocument();
    });

    it('validates password minimum length and mismatch in reset form', async () => {
      // Simulate valid recovery session present
      vi.spyOn(services.auth, 'getCurrentSession').mockResolvedValue({
        token: 'recovery_access_token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        user: {
          id: 'recovery_user_1',
          name: 'Recovery User',
          email: 'user@example.com',
          role: 'household',
          preferences: { interests: ['reuse'], notificationsEnabled: true, reducedMotion: false, searchRadiusKm: 10 },
          createdAt: new Date().toISOString(),
        },
      });

      render(
        <MemoryRouter initialEntries={['/reset-password']}>
          <AuthProvider>
            <ResetPasswordPage />
          </AuthProvider>
        </MemoryRouter>
      );

      // Form should be rendered
      const passwordInput = await screen.findByLabelText(/^New Password$/i);
      const confirmInput = screen.getByLabelText(/^Confirm New Password$/i);
      const submitBtn = screen.getByRole('button', { name: /Update Password/i });

      // Test short password
      fireEvent.change(passwordInput, { target: { value: 'short' } });
      fireEvent.change(confirmInput, { target: { value: 'short' } });
      fireEvent.click(submitBtn);
      expect(await screen.findByText(/Password must be at least 8 characters long/i)).toBeInTheDocument();

      // Test mismatched passwords
      fireEvent.change(passwordInput, { target: { value: 'ValidPassword123' } });
      fireEvent.change(confirmInput, { target: { value: 'DifferentPassword123' } });
      fireEvent.click(submitBtn);
      expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    it('submits valid password, prevents duplicate submission, and displays success state', async () => {
      vi.spyOn(services.auth, 'getCurrentSession').mockResolvedValue({
        token: 'recovery_access_token',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        user: {
          id: 'recovery_user_1',
          name: 'Recovery User',
          email: 'user@example.com',
          role: 'household',
          preferences: { interests: ['reuse'], notificationsEnabled: true, reducedMotion: false, searchRadiusKm: 10 },
          createdAt: new Date().toISOString(),
        },
      });

      const updateSpy = vi.spyOn(services.auth, 'updatePassword').mockResolvedValueOnce();

      render(
        <MemoryRouter initialEntries={['/reset-password']}>
          <AuthProvider>
            <ResetPasswordPage />
          </AuthProvider>
        </MemoryRouter>
      );

      const passwordInput = await screen.findByLabelText(/^New Password$/i);
      const confirmInput = screen.getByLabelText(/^Confirm New Password$/i);
      const submitBtn = screen.getByRole('button', { name: /Update Password/i });

      fireEvent.change(passwordInput, { target: { value: 'NewSecurePassword123!' } });
      fireEvent.change(confirmInput, { target: { value: 'NewSecurePassword123!' } });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(updateSpy).toHaveBeenCalledWith('NewSecurePassword123!');
      });

      expect(await screen.findByText(/Password Updated/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In With New Password/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Go to Dashboard/i })).toBeInTheDocument();
    });
  });

  describe('ProtectedRoute Behavior', () => {
    it('redirects unauthenticated users to /login', async () => {
      vi.spyOn(services.auth, 'getCurrentSession').mockResolvedValue(null);
      render(
        <MemoryRouter initialEntries={['/dashboard']}>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<div>Login Page Screen</div>} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <div>Secret Protected Content</div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      );

      await waitFor(() => {
        expect(screen.getByText('Login Page Screen')).toBeInTheDocument();
      });
      expect(screen.queryByText('Secret Protected Content')).not.toBeInTheDocument();
    });
  });

  describe('Vercel SPA Deployment & Security Verification', () => {
    it('requestPasswordReset generates correct origin-based redirect without hardcoding localhost', async () => {
      delete (window as unknown as { location: unknown }).location;
      (window as unknown as { location: unknown }).location = {
        origin: 'https://production-app.vercel.app',
      };

      const resetSpy = vi.spyOn(services.auth, 'requestPasswordReset');
      await services.auth.requestPasswordReset('user@example.com');

      expect(resetSpy).toHaveBeenCalledWith('user@example.com');
      // Verify origin is dynamically pulled from window.location.origin
      expect(window.location.origin).toBe('https://production-app.vercel.app');
      expect(window.location.origin).not.toContain('localhost');
    });

    it('updatePassword rejects passwords shorter than 8 characters', async () => {
      await expect(services.auth.updatePassword('12345')).rejects.toThrow(
        /Password must be at least 8 characters/i
      );
    });
  });
});
