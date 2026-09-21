import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { useScanFlow } from '../hooks/useScanFlow';
import { services } from '../services';
import { ROUTES } from '../config/constants';
import { PipelineProgress } from '../types/ai';
import { ActionableError } from '../components/feedback/ActionableError';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const ScanAnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const { imageData, setVisionResult, setValueAiResult } = useScanFlow();

  const [currentProgress, setCurrentProgress] = useState<PipelineProgress>({
    stage: 'detecting_object',
    stageIndex: 1,
    totalStages: 3,
    label: 'Detecting object and geometry...',
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function runPipeline() {
      if (!imageData?.previewUrl) {
        navigate(ROUTES.SCAN);
        return;
      }

      try {
        const vision = await services.ai.identifyItem(
          imageData.file || imageData.previewUrl,
          (progress) => {
            if (isMounted) setCurrentProgress(progress);
          }
        );

        if (!isMounted) return;
        setVisionResult(vision);

        const value = await services.ai.recommendValuePaths(vision);
        if (!isMounted) return;
        setValueAiResult(value);

        // Transition seamlessly to result
        navigate(ROUTES.SCAN_RESULT);
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'AI analysis was interrupted.');
        }
      }
    }

    runPipeline();

    return () => {
      isMounted = false;
    };
  }, [imageData, navigate, setVisionResult, setValueAiResult]);

  return (
    <WorkspaceContainer maxWidth="md">
      <div className="text-center max-w-md mx-auto py-12">
        <h1 className="text-2xl font-bold text-primary-text mb-2">Understanding your item</h1>
        <p className="text-xs text-secondary-text mb-8">
          Analyzing physical characteristics, timber/metal composition, and circular opportunities.
        </p>

        {error ? (
          <ActionableError
            message={error}
            onRetry={() => window.location.reload()}
            recoveryLabel="Retry Analysis"
          />
        ) : (
          <Card variant="raised" className="p-6 text-left">
            <div className="space-y-4">
              {[
                { index: 1, name: 'Detecting object geometry' },
                { index: 2, name: 'Identifying material composition' },
                { index: 3, name: 'Assessing structural condition' },
              ].map((step) => {
                const isCompleted = currentProgress.stageIndex > step.index;
                const isCurrent = currentProgress.stageIndex === step.index;

                return (
                  <div
                    key={step.index}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-card transition-colors',
                      isCurrent && 'bg-soft-green/40 border border-brand-green/30',
                      !isCurrent && 'opacity-60'
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-brand-green flex-shrink-0" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-brand-green animate-spin flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-border flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary-text">{step.name}</p>
                      {isCurrent && (
                        <p className="text-xs text-secondary-text mt-0.5">{currentProgress.label}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        )}
      </div>
    </WorkspaceContainer>
  );
};
