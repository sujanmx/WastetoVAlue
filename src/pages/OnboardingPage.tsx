import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../config/constants';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { UserRole } from '../types/auth';
import { CircularValuePath } from '../types/item';
import { cn } from '../lib/utils';
import { Check, ArrowRight } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { completeOnboarding, user } = useAuth();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<UserRole>(user?.role || 'household');
  const [interests, setInterests] = useState<CircularValuePath[]>(['reuse', 'donate']);
  const [location, setLocation] = useState(user?.location?.city || '');
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (path: CircularValuePath) => {
    setInterests((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await completeOnboarding({ role, interests, location });
      navigate(ROUTES.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6 sm:p-12">
      <Card className="w-full max-w-[520px] p-6 sm:p-8" variant="raised">
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
          <div>
            <span className="text-xs font-semibold text-brand-green">Step {step} of 3</span>
            <h2 className="text-lg font-bold text-primary-text mt-0.5">
              {step === 1 && 'What brings you to Waste2Value?'}
              {step === 2 && 'What are you interested in?'}
              {step === 3 && 'Find opportunities near you'}
            </h2>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={cn(
                  'w-6 h-1.5 rounded-full transition-colors',
                  s <= step ? 'bg-brand-green' : 'bg-border'
                )}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Role */}
        {step === 1 && (
          <div className="space-y-3">
            {[
              { id: 'household', label: 'Household / Individual', desc: 'Find second lives for home and personal items' },
              { id: 'student', label: 'Student / Academic', desc: 'Circular design, tool sharing, and sustainable living' },
              { id: 'business', label: 'Business / Commercial', desc: 'Commercial surplus diversion and sustainability audits' },
              { id: 'recycler', label: 'Recycler / Material Recovery', desc: 'Source clean industrial and consumer material streams' },
              { id: 'ngo', label: 'NGO / Community Partner', desc: 'Receive donations and reusable furniture for communities' },
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id as UserRole)}
                className={cn(
                  'w-full text-left p-3.5 rounded-card border transition-all flex items-center justify-between',
                  role === r.id
                    ? 'border-brand-green bg-soft-green/40 ring-1 ring-brand-green'
                    : 'border-border bg-surface hover:bg-canvas'
                )}
              >
                <div>
                  <p className="text-sm font-semibold text-primary-text">{r.label}</p>
                  <p className="text-xs text-secondary-text mt-0.5">{r.desc}</p>
                </div>
                {role === r.id && <Check className="w-4 h-4 text-brand-green flex-shrink-0" />}
              </button>
            ))}
            <Button
              className="mt-6"
              fullWidth
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="space-y-3">
            {[
              { id: 'reuse', title: 'Direct Reuse', desc: 'Keep items in active use with minimal refurbishment' },
              { id: 'donate', title: 'Social Donation', desc: 'Connect items to shelters, charities, and schools' },
              { id: 'resell', title: 'Secondary Resale', desc: 'Recover economic value through circular marketplaces' },
              { id: 'recycle', title: 'Material Recycling', desc: 'Ensure certified material recovery for end-of-life goods' },
            ].map((item) => {
              const selected = interests.includes(item.id as CircularValuePath);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleInterest(item.id as CircularValuePath)}
                  className={cn(
                    'w-full text-left p-3.5 rounded-card border transition-all flex items-center justify-between',
                    selected
                      ? 'border-brand-green bg-soft-green/40 ring-1 ring-brand-green'
                      : 'border-border bg-surface hover:bg-canvas'
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-primary-text">{item.title}</p>
                    <p className="text-xs text-secondary-text mt-0.5">{item.desc}</p>
                  </div>
                  {selected && <Check className="w-4 h-4 text-brand-green flex-shrink-0" />}
                </button>
              );
            })}
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                variant="primary"
                fullWidth
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-secondary-text">
              We use your location to match you with nearby drop-off hubs, reuse centers, and local recyclers within your neighborhood.
            </p>
            <Input
              label="Your City or Region"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
            />
            <div className="flex gap-3 mt-6">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                variant="primary"
                fullWidth
                isLoading={isLoading}
                onClick={handleFinish}
              >
                Complete Setup
              </Button>
            </div>
            <button
              type="button"
              onClick={handleFinish}
              className="w-full text-center text-xs text-secondary-text hover:text-primary-text pt-2"
            >
              Skip for now
            </button>
          </div>
        )}
      </Card>
    </div>
  );
};
