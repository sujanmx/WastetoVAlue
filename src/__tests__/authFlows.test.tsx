import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { ProtectedRoute } from '../routes/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { services } from '../services';
import { AppError } from '../services/api/apiError';

describe('Authentication Flows & Security UX', () => {
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

  describe('ProtectedRoute Behavior', () => {
    it('redirects unauthenticated users to /login', async () => {
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
});
