import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAsync } from '../hooks/useAsync';
import { services } from '../services';
import { ROUTES } from '../config/constants';
import { StateView } from '../components/feedback/StateView';
import { ArrowLeft, CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { formatDate } from '../lib/formatters';

export const ItemTrackPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: handover, isLoading, error } = useAsync(
    () => services.handover.getHandoverById(id || 'mock'),
    { immediate: true }
  );

  return (
    <WorkspaceContainer maxWidth="lg">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.ITEMS)}
        >
          Back to items
        </Button>
      </div>

      <StateView isLoading={isLoading} error={error}>
        {handover && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Timeline Column */}
            <Card variant="resting" className="lg:col-span-2 p-6 sm:p-8">
              <h1 className="text-xl sm:text-2xl font-bold text-primary-text mb-1">
                Item Journey Tracking
              </h1>
              <p className="text-xs text-secondary-text mb-8">
                Timeline representation of this item’s circular progression.
              </p>

              <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {handover.timeline.map((step, idx) => {
                  return (
                    <div key={idx} className="relative flex items-start gap-4 pl-1">
                      <div className="relative z-10 w-7 h-7 rounded-full bg-surface flex items-center justify-center border-2 border-surface">
                        {step.isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-brand-green bg-white rounded-full" />
                        ) : step.isCurrent ? (
                          <div className="w-5 h-5 rounded-full bg-soft-green border-2 border-brand-green flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-brand-green" />
                          </div>
                        ) : (
                          <Circle className="w-5 h-5 text-border bg-white rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 pb-2">
                        <div className="flex items-baseline justify-between">
                          <h4
                            className={cn(
                              'text-sm font-semibold',
                              step.isCurrent
                                ? 'text-brand-green'
                                : step.isCompleted
                                ? 'text-primary-text'
                                : 'text-secondary-text'
                            )}
                          >
                            {step.label}
                          </h4>
                          {step.timestamp && (
                            <span className="text-[11px] text-secondary-text font-mono">
                              {formatDate(step.timestamp)}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-secondary-text mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Item Meta Column */}
            <div className="space-y-6">
              <Card variant="resting" className="p-5 space-y-4">
                <img
                  src={handover.itemImageUrl}
                  alt={handover.itemTitle}
                  className="w-full h-44 rounded-input object-cover border border-border"
                />
                <div>
                  <h3 className="font-semibold text-base text-primary-text">
                    {handover.itemTitle}
                  </h3>
                  <p className="text-xs text-secondary-text mt-0.5">{handover.itemCategory}</p>
                </div>

                <div className="pt-3 border-t border-border text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Value Path</span>
                    <span className="font-semibold text-brand-green uppercase">
                      {handover.valuePath}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-secondary-text">Partner Hub</span>
                    <span className="font-medium text-primary-text">{handover.receiverName}</span>
                  </div>
                </div>
              </Card>

              {/* Next Step Box */}
              <Card variant="resting" className="p-5 bg-soft-green/30 border-brand-green/30">
                <div className="flex items-center gap-2 text-xs font-semibold text-brand-green uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Next Action</span>
                </div>
                <p className="text-xs text-primary-text leading-relaxed">
                  Bring the item to <strong>{handover.receiverName}</strong> during their open drop-off hours. Show this confirmation at reception.
                </p>
              </Card>
            </div>
          </div>
        )}
      </StateView>
    </WorkspaceContainer>
  );
};
