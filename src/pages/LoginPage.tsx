import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/constants';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ActionableError } from '../components/feedback/ActionableError';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { AppError } from '../services/api/apiError';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loginWithGoogle, isAuthenticated, isPasswordRecovery } = useAuth();

  // If already authenticated, redirect to destination or home (unless currently in password recovery)
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || ROUTES.HOME;

  React.useEffect(() => {
    if (isAuthenticated && !isPasswordRecovery) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isPasswordRecovery, navigate, from]);

  const [email, setEmail] = useState('alex.morgan@example.com');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  // Form-level error
  const [formError, setFormError] = useState<AppError | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
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
      await login({
        email: email.trim(),
        password,
        rememberMe,
      });
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof AppError) {
        setFormError(err);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Authentication failed. Please check your credentials and try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setFormError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err instanceof AppError) {
        setFormError(err);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Google sign-in could not be completed.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col lg:flex-row">
      {/* Left Brand Visual Panel (Desktop only: 1024px+) */}
      <div className="hidden lg:flex lg:w-1/2 bg-deep-forest text-white flex-col justify-between p-12 xl:p-16">
        <div>
          <Link
            to={ROUTES.LANDING}
            className="inline-flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-soft-green rounded-control"
            aria-label="Waste2Value Home"
          >
            <div className="w-9 h-9 rounded-control bg-white text-deep-forest flex items-center justify-center font-bold text-lg shadow-sm">
              W
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Waste2Value</span>
          </Link>
        </div>

        <div className="max-w-lg space-y-6 my-auto py-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-soft-green/15 text-soft-green text-xs font-semibold tracking-wide border border-soft-green/20">
            <Sparkles className="w-3.5 h-3.5 text-soft-green" />
            <span>Circular Economy Operating System</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white">
            Don't throw it away.
            <br />
            <span className="text-soft-green">Find its next value.</span>
          </h2>

          <p className="text-sm xl:text-base text-soft-green/80 leading-relaxed">
            Connect discarded items to appropriate reuse centers, recyclers, donation partners, and buyers through transparent three-AI identification and matching.
          </p>

          <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4 text-xs text-soft-green/70">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-soft-green flex-shrink-0 mt-0.5" />
              <span>Multi-tenant Row Level Security & verified partner hubs</span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-soft-green flex-shrink-0 mt-0.5" />
              <span>Transparent AI reasoning with full user override</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-soft-green/60">
          © {new Date().getFullYear()} Waste2Value Platform · Precision Eco-Tech
        </div>
      </div>

      {/* Right Form Panel (Universal / Mobile-first) */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 xs:p-6 sm:p-10 lg:p-12">
        {/* Mobile Header Logo (<1024px) */}
        <div className="lg:hidden w-full max-w-[440px] mb-6 flex items-center justify-between">
          <Link
            to={ROUTES.LANDING}
            className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-control"
            aria-label="Waste2Value Home"
          >
            <div className="w-8 h-8 rounded-control bg-deep-forest text-white flex items-center justify-center font-bold text-base">
              W
            </div>
            <span className="font-bold text-lg text-primary-text">Waste2Value</span>
          </Link>
          <Link
            to={ROUTES.LANDING}
            className="text-xs text-secondary-text hover:text-primary-text font-medium"
          >
            Back to home
          </Link>
        </div>

        <Card className="w-full max-w-[440px] p-6 sm:p-8" variant="raised">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-secondary-text mt-1">
              Continue your journey toward a circular future.
            </p>
          </div>

          {/* Form-level Error Display */}
          {formError && (
            <div className="mb-5">
              <ActionableError
                compact
                message={
                  typeof formError === 'string'
                    ? formError
                    : formError.userMessage || formError.message
                }
                recoveryLabel={
                  typeof formError === 'object' && formError.recoveryAdvice?.actionLabel
                    ? formError.recoveryAdvice.actionLabel
                    : undefined
                }
                onDismiss={() => setFormError(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              type="email"
              id="login-email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  setFieldErrors((prev) => ({ ...prev, email: undefined }));
                }
              }}
              error={fieldErrors.email}
              required
              disabled={isLoading}
              placeholder="name@example.com"
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="login-password"
              autoComplete="current-password"
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
              placeholder="••••••••"
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-secondary-text hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4" aria-hidden="true" />
                  )}
                </button>
              }
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-secondary-text select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded border-border text-brand-green focus:ring-brand-green focus:ring-offset-0 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-brand-green font-medium hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
              disabled={isLoading}
              className="mt-2"
            >
              Sign in
            </Button>
          </form>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative bg-surface px-3 text-xs text-secondary-text uppercase tracking-wider">
              or
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            Continue with Google
          </Button>

          <p className="text-center text-xs sm:text-sm text-secondary-text mt-6">
            Don't have an account?{' '}
            <Link
              to={ROUTES.SIGNUP}
              className="text-brand-green font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
            >
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
