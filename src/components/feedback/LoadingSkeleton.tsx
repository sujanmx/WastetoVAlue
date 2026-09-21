import React from 'react';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle' | 'card';
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'text',
  ...props
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-control',
    rect: 'h-24 w-full rounded-input',
    circle: 'w-10 h-10 rounded-full',
    card: 'h-48 w-full rounded-card border border-border',
  }[variant];

  return (
    <div
      aria-hidden="true"
      className={cn('bg-border/60 animate-pulse', variantStyles, className)}
      {...props}
    />
  );
};
