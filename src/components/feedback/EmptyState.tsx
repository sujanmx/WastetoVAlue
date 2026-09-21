import React from 'react';
import { Button } from '../common/Button';
import { cn } from '../../lib/utils';
import { LucideIcon, PackageOpen } from 'lucide-react';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = PackageOpen,
  title,
  description,
  actionLabel,
  onAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 md:p-12 bg-surface border border-border rounded-card',
        className
      )}
    >
      <div className="w-12 h-12 rounded-full bg-canvas flex items-center justify-center text-secondary-text mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base md:text-lg font-semibold text-primary-text mb-1">{title}</h3>
      <p className="text-sm text-secondary-text max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="primary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
