import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DataHonestyBadge } from '../components/feedback/DataHonestyBadge';
import { useScanFlow } from '../hooks/useScanFlow';
import { useAsync } from '../hooks/useAsync';
import { services } from '../services';
import { ROUTES } from '../config/constants';
import { formatDistance } from '../lib/formatters';
import { ArrowLeft, MapPin, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { StateView } from '../components/feedback/StateView';

export const ReceiverDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedReceiver, selectReceiver, selectedValuePath, visionResult } = useScanFlow();

  const { data: receiver, isLoading, error } = useAsync(
    () => (selectedReceiver?.id === id && selectedReceiver ? Promise.resolve(selectedReceiver) : services.receivers.getReceiverById(id || 'rec_01')),
    { immediate: true }
  );

  const handleProceedToHandover = () => {
    if (receiver) {
      selectReceiver(receiver);
      navigate(ROUTES.HANDOVER_CONFIRM);
    }
  };

  return (
    <WorkspaceContainer>
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.RECEIVERS)}
        >
          Back to receivers
        </Button>
      </div>

      <StateView isLoading={isLoading} error={error}>
        {receiver && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Receiver Info Column */}
            <div className="lg:col-span-2 space-y-6">
              <Card variant="resting" className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-green uppercase tracking-wider">
                    {receiver.typeLabel}
                  </span>
                  <DataHonestyBadge type="demo-receiver" />
                </div>
                <h1 className="text-2xl font-bold text-primary-text mb-2">{receiver.name}</h1>
                <p className="text-sm text-secondary-text mb-6 leading-relaxed">
                  {receiver.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs py-4 border-y border-border/60">
                  <div>
                    <span className="text-secondary-text block mb-1">Address & Distance</span>
                    <p className="font-medium text-primary-text flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-secondary-text" />
                      {receiver.address} ({formatDistance(receiver.distanceKm)})
                    </p>
                  </div>
                  <div>
                    <span className="text-secondary-text block mb-1">Operating Hours</span>
                    <p className="font-medium text-primary-text flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-secondary-text" />
                      {receiver.openHours}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-primary-text mb-3">
                    Accepted Materials & Items
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {receiver.acceptedCategories.map((cat) => (
                      <Badge key={cat} variant="default" size="md">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Matching AI Transparency */}
              <Card variant="resting" className="p-6 bg-[#F8FAFC] border-[#E2E8F0]">
                <div className="flex items-center gap-2 mb-3">
                  <DataHonestyBadge type="ai-assisted" customText="Matching AI Rationale" />
                </div>
                <h3 className="text-sm font-semibold text-primary-text mb-2">Why this match?</h3>
                <div className="space-y-2 text-xs text-secondary-text">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span>Material category match: Accepts solid wood timber furniture.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span>High community reuse score with zero-landfill diversion commitment.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span>Located within 3 km of your current profile neighborhood.</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right: Your Item & Handover Action */}
            <div className="lg:col-span-1 space-y-6">
              <Card variant="raised" className="p-6 sticky top-24">
                <h3 className="text-sm font-bold uppercase tracking-wider text-primary-text mb-4 pb-2 border-b border-border/60">
                  Item Handover Summary
                </h3>

                <div className="space-y-3 text-xs mb-6">
                  <div>
                    <span className="text-secondary-text block">Item</span>
                    <strong className="text-primary-text text-sm">
                      {visionResult?.detectedObject || 'Old Wooden Chair'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-secondary-text block">Selected Value Path</span>
                    <span className="font-semibold text-brand-green uppercase">
                      {selectedValuePath || 'Reuse'}
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary-text block">Matched Partner</span>
                    <span className="font-medium text-primary-text">{receiver.name}</span>
                  </div>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleProceedToHandover}
                >
                  Select Receiver & Continue
                </Button>
              </Card>
            </div>
          </div>
        )}
      </StateView>
    </WorkspaceContainer>
  );
};
