import React from 'react';
import { Button } from '../common/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ActionableErrorProps {
  title?: string;
  message: string;
  recoveryLabel?: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  compact?: boolean;
}

export const ActionableError: React.FC<ActionableErrorProps> = ({
  title,
  message,
  recoveryLabel = 'Retry',
  onRetry,
  onDismiss,
  className,
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        role="alert"
        className={cn(
          'flex items-start gap-2.5 p-3 sm:p-3.5 bg-[#FEF3F2] border border-[#FECDCA] rounded-card text-left text-xs',
          className
        )}
      >
        <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <div className="font-semibold text-[#912018] mb-0.5">{title}</div>}
          <div className="text-[#B42318] leading-relaxed">{message}</div>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-1.5 font-medium text-[#912018] underline hover:text-black flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{recoveryLabel}</span>
            </button>
          )}
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss error"
            className="text-[#B42318] hover:text-[#912018] p-0.5 rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-error"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center text-center p-6 md:p-8 bg-[#FEF3F2] border border-[#FECDCA] rounded-card',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-white text-error flex items-center justify-center mb-3 shadow-sm">
        <AlertTriangle className="w-5 h-5" />
      </div>
      <h4 className="text-sm md:text-base font-semibold text-[#912018] mb-1">{title || 'Something went wrong'}</h4>
      <p className="text-xs md:text-sm text-[#B42318] max-w-md mb-4">{message}</p>
      <div className="flex items-center gap-2">
        {onRetry && (
          <Button
            size="sm"
            variant="secondary"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={onRetry}
            className="border-[#FECDCA] text-[#912018] hover:bg-white"
          >
            {recoveryLabel}
          </Button>
        )}
        {onDismiss && (
          <Button
            size="sm"
            variant="tertiary"
            onClick={onDismiss}
            className="text-[#912018]"
          >
            Dismiss
          </Button>
        )}
      </div>
    </div>
  );
};
