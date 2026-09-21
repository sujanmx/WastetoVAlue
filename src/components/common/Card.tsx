import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'resting' | 'raised' | 'interactive' | 'recommended';
  as?: React.ElementType;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'resting', as: Component = 'div', children, ...props }, ref) => {
    const variantStyles = {
      resting: 'bg-surface border border-border rounded-card',
      raised: 'bg-surface border border-border rounded-card shadow-raised',
      interactive:
        'bg-surface border border-border rounded-card transition-all duration-150 hover:border-brand-green/40 hover:bg-[#FAFBF9] cursor-pointer',
      recommended:
        'bg-surface border-2 border-brand-green rounded-card shadow-raised relative ring-1 ring-brand-green/10',
    }[variant];

    return (
      <Component ref={ref} className={cn(variantStyles, 'p-4 md:p-6', className)} {...props}>
        {children}
      </Component>
    );
  }
);

Card.displayName = 'Card';
