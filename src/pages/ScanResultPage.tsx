import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DataHonestyBadge } from '../components/feedback/DataHonestyBadge';
import { useScanFlow } from '../hooks/useScanFlow';
import { ROUTES } from '../config/constants';
import { CircularValuePath } from '../types/item';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

export const ScanResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { visionResult, valueAiResult, imageData, selectedValuePath, selectValuePath } =
    useScanFlow();

  // Fallback defaults for previewing directly
  const item = visionResult || {
    detectedObject: 'Wooden Dining Chair',
    category: 'Furniture' as const,
    material: 'Solid Oak Wood',
    condition: 'Usable' as const,
    confidence: 'High' as const,
    confidenceScore: 0.94,
    tags: ['furniture', 'timber', 'seating'],
  };

  const paths = valueAiResult?.paths || {
    reuse: {
      path: 'reuse' as const,
      title: 'Reuse',
      tagline: 'Keep the item in active service',
      isRecommended: true,
      reasoning: ['Sturdy timber joints intact', 'High local demand for home seating'],
      potentialDemand: 'High' as const,
      estimatedEffort: 'Low' as const,
      recoveryPotential: '100% item retention',
    },
    donate: {
      path: 'donate' as const,
      title: 'Donate',
      tagline: 'Pass to non-profits and shelters in need',
      isRecommended: false,
      reasoning: ['Immediate community social utility', 'Drop-off required'],
      potentialDemand: 'Moderate' as const,
      estimatedEffort: 'Moderate' as const,
      recoveryPotential: 'Community redistribution',
    },
    resell: {
      path: 'resell' as const,
      title: 'Resell',
      tagline: 'Recover direct economic value',
      isRecommended: false,
      reasoning: ['Estimated resale value: $25–$45', 'Buyer negotiation required'],
      potentialDemand: 'Moderate' as const,
      estimatedEffort: 'High' as const,
      recoveryPotential: 'Direct financial return',
    },
    recycle: {
      path: 'recycle' as const,
      title: 'Recycle',
      tagline: 'Recover raw materials and fibers',
      isRecommended: false,
      reasoning: ['Downcycles usable furniture', 'Secondary recovery option'],
      potentialDemand: 'High' as const,
      estimatedEffort: 'Low' as const,
      recoveryPotential: 'Raw material recovery',
    },
  };

  const activePath = selectedValuePath || 'reuse';

  const handleContinue = (path: CircularValuePath) => {
    selectValuePath(path);
    navigate(ROUTES.RECEIVERS);
  };

  return (
    <WorkspaceContainer>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <DataHonestyBadge type="ai-assisted" />
            <Badge variant="default" size="sm">
              High Confidence
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">{item.detectedObject}</h1>
          <p className="text-xs text-secondary-text mt-0.5">
            {item.category} • {item.material} • Condition: {item.condition}
          </p>
        </div>

        <button
          onClick={() => navigate(ROUTES.SCAN)}
          className="text-xs text-secondary-text hover:text-primary-text underline self-start sm:self-auto"
        >
          Looks incorrect? Scan again
        </button>
      </div>

      {/* Main Analysis Workspace: Desktop 3-panel vs Mobile Decision Stack */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Panel 1: Item Media & Physical Properties */}
        <Card variant="resting" className="lg:col-span-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="rounded-input overflow-hidden mb-4 border border-border bg-black/5 aspect-square max-h-64 flex items-center justify-center">
              <img
                src={
                  imageData?.previewUrl ||
                  'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80'
                }
                alt={item.detectedObject}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-semibold text-primary-text mb-2">Item Assessment</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-secondary-text">Detected Category</span>
                <span className="font-medium text-primary-text">{item.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-secondary-text">Primary Material</span>
                <span className="font-medium text-primary-text">{item.material}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-border/60">
                <span className="text-secondary-text">Structural Condition</span>
                <span className="font-medium text-brand-green">{item.condition}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Panel 2 & 3: Signature Circular Value Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-primary-text">
                What should happen to this item?
              </h2>
              <p className="text-xs text-secondary-text">
                Value AI suggests the highest circular utility. You choose the outcome.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(['reuse', 'donate', 'resell', 'recycle'] as CircularValuePath[]).map((pathKey) => {
              const option = paths[pathKey];
              const isSelected = activePath === pathKey;
              const isRecommended = option.isRecommended;

              return (
                <Card
                  key={pathKey}
                  variant={isRecommended ? 'recommended' : 'interactive'}
                  onClick={() => selectValuePath(pathKey)}
                  className={cn(
                    'flex flex-col justify-between transition-all',
                    isSelected && !isRecommended && 'border-brand-green ring-1 ring-brand-green',
                    !isSelected && !isRecommended && 'hover:border-border'
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary-text">
                        {option.title}
                      </span>
                      {isRecommended && (
                        <Badge variant="soft-green" size="sm">
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-secondary-text mb-3">{option.tagline}</p>

                    {/* Concise reasoning factors */}
                    <div className="space-y-1 mb-4">
                      {option.reasoning.map((reason, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-primary-text/90">
                          <Check className="w-3.5 h-3.5 text-brand-green flex-shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <span className="text-[11px] text-secondary-text">
                      Demand: <strong className="text-primary-text">{option.potentialDemand}</strong>
                    </span>
                    <Button
                      size="sm"
                      variant={isSelected ? 'primary' : 'secondary'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContinue(pathKey);
                      }}
                    >
                      Choose {option.title}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleContinue(activePath)}
            >
              Find Receivers for {paths[activePath].title}
            </Button>
          </div>
        </div>
      </div>
    </WorkspaceContainer>
  );
};
