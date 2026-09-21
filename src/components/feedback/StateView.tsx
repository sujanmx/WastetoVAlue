import React from 'react';
import { ActionableError } from './ActionableError';
import { EmptyState, EmptyStateProps } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';

export interface StateViewProps {
  isLoading?: boolean;
  error?: string | null;
  isEmpty?: boolean;
  emptyProps?: EmptyStateProps;
  onRetry?: () => void;
  loadingFallback?: React.ReactNode;
  children: React.ReactNode;
}

export const StateView: React.FC<StateViewProps> = ({
  isLoading,
  error,
  isEmpty,
  emptyProps,
  onRetry,
  loadingFallback,
  children,
}) => {
  if (isLoading) {
    return (
      loadingFallback || (
        <div className="space-y-4 py-6">
          <LoadingSkeleton variant="rect" className="h-32" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LoadingSkeleton variant="card" />
            <LoadingSkeleton variant="card" />
          </div>
        </div>
      )
    );
  }

  if (error) {
    return (
      <div className="py-6">
        <ActionableError
          message={error}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (isEmpty && emptyProps) {
    return (
      <div className="py-6">
        <EmptyState {...emptyProps} />
      </div>
    );
  }

  return <>{children}</>;
};
