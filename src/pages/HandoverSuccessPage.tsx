import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useScanFlow } from '../hooks/useScanFlow';
import { ROUTES } from '../config/constants';
import { Check, ArrowRight, Home } from 'lucide-react';

export const HandoverSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const { visionResult, selectedValuePath, selectedReceiver, resetFlow } = useScanFlow();

  const handleTrack = () => {
    resetFlow();
    navigate('/items/item_01/track');
  };

  const handleHome = () => {
    resetFlow();
    navigate(ROUTES.HOME);
  };

  return (
    <WorkspaceContainer maxWidth="md">
      <Card variant="raised" className="p-8 sm:p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-14 h-14 rounded-full bg-soft-green text-brand-green flex items-center justify-center mx-auto mb-5">
          <Check className="w-7 h-7 stroke-[2.5]" />
        </div>

        <h1 className="text-2xl font-bold text-primary-text mb-2">
          Your item has a next step.
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text max-w-sm mx-auto mb-6">
          The handover record has been initialized. The receiver has been notified for drop-off coordination.
        </p>

        <div className="bg-canvas border border-border rounded-card p-4 text-left text-xs space-y-2 mb-8">
          <div className="flex justify-between">
            <span className="text-secondary-text">Item</span>
            <strong className="text-primary-text">
              {visionResult?.detectedObject || 'Old Wooden Chair'}
            </strong>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-text">Circular Pathway</span>
            <span className="font-semibold text-brand-green uppercase">
              {selectedValuePath || 'Reuse'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-secondary-text">Receiver Hub</span>
            <span className="font-medium text-primary-text">
              {selectedReceiver?.name || 'Community Furniture Reuse Center'}
            </span>
          </div>
          <div className="flex justify-between pt-1 border-t border-border/60">
            <span className="text-secondary-text">Status</span>
            <span className="font-medium text-primary-text">Receiver Matched & Scheduled</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="secondary"
            leftIcon={<Home className="w-4 h-4" />}
            onClick={handleHome}
          >
            Back to Home
          </Button>
          <Button
            variant="primary"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={handleTrack}
          >
            Track Item Journey
          </Button>
        </div>
      </Card>
    </WorkspaceContainer>
  );
};
