import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ActionableError } from '../components/feedback/ActionableError';
import { services } from '../services';
import { MailCheck, ArrowLeft, ShieldCheck } from 'lucide-react';
import { AppError } from '../services/api/apiError';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    if (!email.trim()) {
      setFieldError('Email address is required.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setFieldError('Please enter a valid email address.');
      return false;
    }
    setFieldError(undefined);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setFormError(null);

    if (!validate()) {
      return;
    }

    setIsLoading(true);
    try {
      await services.auth.requestPasswordReset(email.trim());
      setIsSubmitted(true);
    } catch (err: unknown) {
      if (err instanceof AppError) {
        setFormError(err.userMessage);
      } else if (err instanceof Error) {
        setFormError(err.message);
      } else {
        setFormError('Unable to process password reset. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        {isSubmitted ? (
          <div className="text-center py-4 space-y-5">
            <div className="w-12 h-12 rounded-full bg-soft-green text-brand-green flex items-center justify-center mx-auto shadow-sm">
              <MailCheck className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-primary-text">Check your email</h1>
              <p className="text-sm text-secondary-text mt-2 leading-relaxed">
                If an account exists for <span className="font-semibold text-primary-text">{email.trim()}</span>, you will receive password reset instructions shortly.
              </p>
            </div>

            <div className="p-3 bg-canvas rounded-card border border-border text-xs text-secondary-text text-left flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
              <span>For security reasons, we do not confirm whether an address is registered. Check your spam folder if the email doesn't appear within 5 minutes.</span>
            </div>

            <div className="pt-2 space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Return to sign in
              </Button>
              <button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="text-xs text-secondary-text hover:text-primary-text underline block mx-auto"
              >
                Didn't receive it? Try another address
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-text tracking-tight">
                Reset your password
              </h1>
              <p className="text-sm text-secondary-text mt-1 leading-relaxed">
                Enter your account email to receive secure recovery instructions.
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
                label="Email Address"
                type="email"
                id="reset-email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldError) setFieldError(undefined);
                }}
                error={fieldError}
                required
                disabled={isLoading}
                placeholder="alex@example.com"
              />

              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={isLoading}
                className="mt-2"
              >
                Send reset link
              </Button>
            </form>

            <div className="text-center mt-6 pt-4 border-t border-border/60">
              <Link
                to={ROUTES.LOGIN}
                className="text-xs text-secondary-text hover:text-primary-text font-medium inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to sign in</span>
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
