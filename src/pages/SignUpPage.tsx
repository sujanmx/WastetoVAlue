import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/constants';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ActionableError } from '../components/feedback/ActionableError';
import { UserRole } from '../types/auth';
import { Eye, EyeOff, MailCheck, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { AppError } from '../services/api/apiError';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, loginWithGoogle, isAuthenticated } = useAuth();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('household');
  const [location, setLocation] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Field validation errors
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Form-level error
  const [formError, setFormError] = useState<AppError | string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Email confirmation state
  const [isConfirmationPending, setIsConfirmationPending] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) {
      errors.name = 'Full name is required.';
    } else if (name.trim().length < 2) {
      errors.name = 'Full name must be at least 2 characters.';
    }

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!password) {
      errors.password = 'Password is required.';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters.';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password.';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match.';
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
      const result = await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
        role,
        location: location.trim() || undefined,
      });

      if (result.requiresConfirmation) {
        setRegisteredEmail(email.trim());
        setIsConfirmationPending(true);
      } else {
        navigate(ROUTES.ONBOARDING);
      }
    } catch (err: unknown) {
      if (err instanceof AppError) {
        setFormError(err);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Account registration failed. Please review your information.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (isLoading) return;
    setFormError(null);
    setIsLoading(true);
    try {
      await loginWithGoogle();
      navigate(ROUTES.HOME);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        setFormError(err);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Google sign-up could not be completed.');
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
            <span>Join the Circular Network</span>
          </div>

          <h2 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white">
            Give discarded items
            <br />
            <span className="text-soft-green">their highest circular value.</span>
          </h2>

          <p className="text-sm xl:text-base text-soft-green/80 leading-relaxed">
            Create an account to start scanning materials, identifying reuse paths, and connecting directly with verified recyclers and donation hubs.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-soft-green/80">
              <CheckCircle2 className="w-4 h-4 text-soft-green flex-shrink-0" />
              <span>Free for households, students, and community partners</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-soft-green/80">
              <CheckCircle2 className="w-4 h-4 text-soft-green flex-shrink-0" />
              <span>Full privacy: items and geolocation protected with RLS</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-soft-green/80">
              <CheckCircle2 className="w-4 h-4 text-soft-green flex-shrink-0" />
              <span>Verified local receiver network with live open hours</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-soft-green/60">
          © {new Date().getFullYear()} Waste2Value Platform · Precision Eco-Tech
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 xs:p-6 sm:p-10 lg:p-12">
        {/* Mobile Header Logo (<1024px) */}
        <div className="lg:hidden w-full max-w-[460px] mb-6 flex items-center justify-between">
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
            to={ROUTES.LOGIN}
            className="text-xs text-secondary-text hover:text-primary-text font-medium"
          >
            Sign in instead
          </Link>
        </div>

        <Card className="w-full max-w-[460px] p-6 sm:p-8" variant="raised">
          {isConfirmationPending ? (
            /* Email Confirmation Required Screen */
            <div className="text-center py-4 space-y-5">
              <div className="w-12 h-12 rounded-full bg-soft-green text-brand-green flex items-center justify-center mx-auto shadow-sm">
                <MailCheck className="w-6 h-6" />
              </div>

              <div>
                <h2 className="text-xl font-bold text-primary-text">Verify your email</h2>
                <p className="text-sm text-secondary-text mt-2 leading-relaxed">
                  We've sent a verification link to{' '}
                  <span className="font-semibold text-primary-text">{registeredEmail}</span>.
                  Please check your inbox to activate your account.
                </p>
              </div>

              <div className="p-3 bg-canvas rounded-card border border-border text-xs text-secondary-text text-left flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                <span>Once verified, you will be able to sign in and immediately access your circular workspace.</span>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Proceed to sign in
                </Button>
              </div>
            </div>
          ) : (
            /* Registration Form */
            <>
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
                  Create your account
                </h1>
                <p className="text-sm text-secondary-text mt-1">
                  Join the Waste2Value circular ecosystem.
                </p>
              </div>

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
                  label="Full Name"
                  type="text"
                  id="signup-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (fieldErrors.name) setFieldErrors((p) => ({ ...p, name: undefined }));
                  }}
                  error={fieldErrors.name}
                  required
                  disabled={isLoading}
                  placeholder="Alex Morgan"
                />

                <Input
                  label="Email Address"
                  type="email"
                  id="signup-email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  error={fieldErrors.email}
                  required
                  disabled={isLoading}
                  placeholder="alex@example.com"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="signup-password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                    }}
                    error={fieldErrors.password}
                    helperText="At least 8 characters"
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="p-1 text-secondary-text hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    }
                  />

                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="signup-confirm-password"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) {
                        setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
                      }
                    }}
                    error={fieldErrors.confirmPassword}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="p-1 text-secondary-text hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" aria-hidden="true" />
                        ) : (
                          <Eye className="w-4 h-4" aria-hidden="true" />
                        )}
                      </button>
                    }
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="signup-role" className="text-xs font-medium text-secondary-text">
                    I am joining as a
                  </label>
                  <select
                    id="signup-role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    disabled={isLoading}
                    className="w-full h-11 md:h-12 px-3.5 bg-surface text-primary-text border border-border rounded-input text-sm focus:border-brand-green focus:shadow-focus focus:outline-none cursor-pointer"
                  >
                    <option value="household">Household / Individual</option>
                    <option value="student">Student / Campus</option>
                    <option value="business">Business / Commercial</option>
                    <option value="recycler">Recycler / Processor</option>
                    <option value="ngo">NGO / Community Partner</option>
                  </select>
                </div>

                <Input
                  label="City or Region (Optional)"
                  type="text"
                  id="signup-location"
                  autoComplete="address-level2"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={isLoading}
                  placeholder="e.g. Seattle, WA"
                  helperText="Used to recommend verified receivers within your radius"
                />

                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="mt-3"
                >
                  Create account
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
                onClick={handleGoogleSignup}
                disabled={isLoading}
              >
                Continue with Google
              </Button>

              <p className="text-center text-xs sm:text-sm text-secondary-text mt-6">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-brand-green font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};
