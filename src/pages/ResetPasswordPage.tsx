import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ActionableError } from '../components/feedback/ActionableError';
import { LoadingSkeleton } from '../components/feedback/LoadingSkeleton';
import { services } from '../services';
import { useAuth } from '../hooks/useAuth';
import { AppError } from '../services/api/apiError';
import {
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Check,
} from 'lucide-react';

type PageMode = 'verifying' | 'form' | 'expired' | 'no_session' | 'success';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { isPasswordRecovery } = useAuth();

  const [mode, setMode] = useState<PageMode>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form fields
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check URL parameters and session state on mount
  useEffect(() => {
    let isMounted = true;

    async function checkRecoveryStatus() {
      // 1. Inspect URL search params and hash fragment for Supabase auth errors
      const hash = typeof window !== 'undefined' ? window.location.hash : '';
      const search = typeof window !== 'undefined' ? window.location.search : '';

      const searchParams = new URLSearchParams(search);
      // Hash can contain #error=access_denied&error_code=otp_expired...
      const hashParams = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash);

      const hasError =
        searchParams.get('error') ||
        searchParams.get('error_code') ||
        hashParams.get('error') ||
        hashParams.get('error_code');

      const errorDescription =
        searchParams.get('error_description') ||
        hashParams.get('error_description') ||
        'This password reset link has expired or has already been used.';

      if (hasError) {
        if (isMounted) {
          setErrorMessage(decodeURIComponent(errorDescription.replace(/\+/g, ' ')));
          setMode('expired');
        }
        return;
      }

      // 2. Check if a recovery token or session exists
      const isRecoveryInHash = hash.includes('type=recovery') || hash.includes('access_token');
      const isRecoveryInSearch = search.includes('code=');

      try {
        const session = await services.auth.getCurrentSession();
        if (!isMounted) return;

        if (session || isRecoveryInHash || isRecoveryInSearch || isPasswordRecovery) {
          setMode('form');
        } else {
          // If no session after short delay, mark as no_session
          setTimeout(() => {
            if (isMounted) {
              setMode((current) => (current === 'verifying' ? 'no_session' : current));
            }
          }, 800);
        }
      } catch {
        if (isMounted) {
          setMode(isRecoveryInHash || isRecoveryInSearch ? 'form' : 'no_session');
        }
      }
    }

    checkRecoveryStatus();

    // Listen for live PASSWORD_RECOVERY event
    const unsubscribe = services.auth.onAuthStateChange((session, event) => {
      if (!isMounted) return;
      if (event === 'PASSWORD_RECOVERY' || session) {
        setMode('form');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [isPasswordRecovery]);

  const validateForm = (): boolean => {
    const errors: { password?: string; confirmPassword?: string } = {};

    if (!password) {
      errors.password = 'New password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password.';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match. Please re-enter.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await services.auth.updatePassword(password);
      // Erase password state immediately
      setPassword('');
      setConfirmPassword('');
      setMode('success');

      // Clear hash from URL for security
      if (typeof window !== 'undefined' && window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
    } catch (err: unknown) {
      if (err instanceof AppError) {
        setFormError(err.userMessage);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Unable to update your password. Please try requesting a new reset link.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hasMinLength = password.length >= 8;
  const hasMatchingPasswords = password.length > 0 && password === confirmPassword;

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4 xs:p-6 sm:p-12">
      {/* Brand Header */}
      <div className="w-full max-w-[440px] mb-6 flex items-center justify-between">
        <Link
          to={ROUTES.LANDING}
          className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-control"
          aria-label="Waste2Value Home"
        >
          <div className="w-8 h-8 rounded-control bg-deep-forest text-white flex items-center justify-center font-bold text-base shadow-sm">
            W
          </div>
          <span className="font-bold text-lg text-primary-text">Waste2Value</span>
        </Link>
        <Link
          to={ROUTES.LOGIN}
          className="inline-flex items-center gap-1 text-xs text-secondary-text hover:text-primary-text font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to sign in</span>
        </Link>
      </div>

      <Card className="w-full max-w-[440px] p-6 sm:p-8" variant="raised">
        {/* State 1: Verifying Recovery Session */}
        {mode === 'verifying' && (
          <div className="text-center py-8 space-y-4" role="status" aria-live="polite">
            <LoadingSkeleton variant="circle" className="w-12 h-12 mx-auto" />
            <div className="space-y-2">
              <h1 className="text-lg font-semibold text-primary-text">Verifying security token...</h1>
              <p className="text-xs text-secondary-text">Checking your password reset link authorization.</p>
            </div>
          </div>
        )}

        {/* State 2: Expired or Invalid Link */}
        {mode === 'expired' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-primary-text">Reset Link Expired</h1>
              <p className="text-sm text-secondary-text leading-relaxed">
                {errorMessage || 'For your security, password reset links can only be used once and expire shortly after being sent.'}
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              >
                Request New Reset Link
              </Button>
              <Button
                variant="tertiary"
                fullWidth
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Return to Sign In
              </Button>
            </div>
          </div>
        )}

        {/* State 3: No Active Session */}
        {mode === 'no_session' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-primary-text">Password Reset Required</h1>
              <p className="text-sm text-secondary-text leading-relaxed">
                To set a new password, please request a secure recovery link via our forgot password page.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.FORGOT_PASSWORD)}
              >
                Request Reset Link
              </Button>
              <Button
                variant="tertiary"
                fullWidth
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Return to Sign In
              </Button>
            </div>
          </div>
        )}

        {/* State 4: Active Form */}
        {mode === 'form' && (
          <>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
                Set new password
              </h1>
              <p className="text-sm text-secondary-text mt-1 leading-relaxed">
                Create a strong new password to protect your Waste2Value account.
              </p>
            </div>

            {formError && (
              <div className="mb-5">
                <ActionableError
                  compact
                  message={formError}
                  onDismiss={() => setFormError(null)}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                id="reset-password-input"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }
                }}
                error={fieldErrors.password}
                required
                disabled={isLoading}
                placeholder="At least 8 characters"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-secondary-text hover:text-primary-text focus-visible:outline-none p-1 -mr-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              <Input
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                id="reset-confirm-password-input"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }
                }}
                error={fieldErrors.confirmPassword}
                required
                disabled={isLoading}
                placeholder="Re-enter your password"
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-secondary-text hover:text-primary-text focus-visible:outline-none p-1 -mr-1"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />

              {/* Password Requirement Indicators */}
              <div className="py-1 space-y-1.5 text-xs text-secondary-text">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      hasMinLength ? 'bg-soft-green text-brand-green' : 'bg-canvas border border-border'
                    }`}
                  >
                    {hasMinLength && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className={hasMinLength ? 'text-primary-text font-medium' : ''}>
                    At least 8 characters
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                      hasMatchingPasswords ? 'bg-soft-green text-brand-green' : 'bg-canvas border border-border'
                    }`}
                  >
                    {hasMatchingPasswords && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <span className={hasMatchingPasswords ? 'text-primary-text font-medium' : ''}>
                    Passwords match
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  Update Password
                </Button>
              </div>
            </form>
          </>
        )}

        {/* State 5: Success Confirmation */}
        {mode === 'success' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-12 h-12 rounded-full bg-soft-green text-brand-green flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-primary-text">Password Updated</h1>
              <p className="text-sm text-secondary-text leading-relaxed">
                Your password has been successfully reset. You can now sign in with your new credentials.
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
              >
                Sign In With New Password
              </Button>
              <Button
                variant="tertiary"
                fullWidth
                onClick={() => navigate(ROUTES.HOME, { replace: true })}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
