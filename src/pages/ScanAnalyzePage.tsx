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

import { AppError } from '../services/api/apiError';

export const ScanAnalyzePage: React.FC = () => {
  const navigate = useNavigate();
  const { imageData, setVisionResult, setValueAiResult } = useScanFlow();

  const [currentProgress, setCurrentProgress] = useState<PipelineProgress>({
    stage: 'detecting_object',
    stageIndex: 1,
    totalStages: 5,
    label: 'Detecting object and geometry...',
  });
  const [error, setError] = useState<AppError | Error | null>(null);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);

  const handleRetry = () => {
    setError(null);
    setCurrentProgress({
      stage: 'detecting_object',
      stageIndex: 1,
      totalStages: 5,
      label: 'Detecting object and geometry...',
    });
    setRetryTrigger((prev) => prev + 1);
  };

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
          setError(
            err instanceof Error ? err : new Error(String(err || 'AI analysis was interrupted.'))
          );
        }
      }
    }

    runPipeline();

    return () => {
      isMounted = false;
    };
  }, [imageData, navigate, setVisionResult, setValueAiResult, retryTrigger]);

  const appError = error instanceof AppError ? error : null;
  const isAuthError =
    appError?.code === 'AI_AUTH_REQUIRED' || appError?.code === 'AUTHENTICATION_ERROR';
  const errorMessage =
    appError?.userMessage || error?.message || 'AI analysis could not be completed. Please try again.';
  const errorTitle = isAuthError
    ? 'Sign In Required'
    : appError?.code === 'NETWORK_ERROR'
    ? 'Connection Interrupted'
    : 'Analysis Interrupted';
  const recoveryLabel = isAuthError
    ? 'Sign In'
    : appError?.recoveryAdvice?.actionLabel || 'Retry Analysis';
  const onRetryAction = isAuthError ? () => navigate(ROUTES.LOGIN) : handleRetry;

  return (
    <WorkspaceContainer maxWidth="md">
      <div className="text-center max-w-md mx-auto py-12">
        <h1 className="text-2xl font-bold text-primary-text mb-2">Understanding your item</h1>
        <p className="text-xs text-secondary-text mb-8">
          Analyzing physical characteristics, composition, and circular opportunities.
        </p>

        {error ? (
          <ActionableError
            title={errorTitle}
            message={errorMessage}
            onRetry={onRetryAction}
            recoveryLabel={recoveryLabel}
          />
        ) : (
          <Card variant="raised" className="p-6 text-left">
            <div className="space-y-3">
              {[
                { index: 1, name: '01 Detecting object' },
                { index: 2, name: '02 Identifying material' },
                { index: 3, name: '03 Assessing condition' },
                { index: 4, name: '04 Evaluating circular pathways' },
                { index: 5, name: '05 Preparing recommendation' },
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
