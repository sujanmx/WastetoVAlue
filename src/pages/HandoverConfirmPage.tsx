import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useScanFlow } from '../hooks/useScanFlow';
import { services } from '../services';
import { ROUTES } from '../config/constants';
import { ArrowLeft, CheckCircle2, MapPin } from 'lucide-react';

export const HandoverConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const { visionResult, selectedValuePath, selectedReceiver } = useScanFlow();
  const [isLoading, setIsLoading] = useState(false);

  const itemTitle = visionResult?.detectedObject || 'Old Wooden Chair';
  const path = selectedValuePath || 'reuse';
  const receiverName = selectedReceiver?.name || 'Community Furniture Reuse Center';
  const receiverAddress = selectedReceiver?.address || '450 Mission Street, Suite 102';

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await services.handover.confirmHandover({
        itemId: 'item_01',
        receiverId: selectedReceiver?.id || 'rec_01',
        valuePath: path,
      });
      navigate(ROUTES.HANDOVER_SUCCESS);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WorkspaceContainer maxWidth="md">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <Card variant="raised" className="p-6 sm:p-8 max-w-xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-primary-text mb-1">
          Review your handover
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text mb-6">
          Review details before confirming handover arrangements.
        </p>

        <div className="space-y-4 py-4 border-y border-border/60 text-xs sm:text-sm">
          <div className="flex justify-between items-center py-2 border-b border-border/40">
            <span className="text-secondary-text">Item</span>
            <strong className="text-primary-text">{itemTitle}</strong>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/40">
            <span className="text-secondary-text">Circular Value Path</span>
            <span className="font-semibold text-brand-green uppercase">{path}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border/40">
            <span className="text-secondary-text">Receiver Hub</span>
            <span className="font-medium text-primary-text text-right">{receiverName}</span>
          </div>

          <div className="flex justify-between items-start py-2">
            <span className="text-secondary-text">Location</span>
            <span className="font-medium text-primary-text text-right flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary-text" />
              {receiverAddress}
            </span>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={() => navigate(ROUTES.RECEIVERS)}>
            Edit Partner
          </Button>
          <Button
            variant="primary"
            fullWidth
            size="lg"
            isLoading={isLoading}
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            onClick={handleConfirm}
          >
            Confirm Handover
          </Button>
        </div>
      </Card>
    </WorkspaceContainer>
  );
};
