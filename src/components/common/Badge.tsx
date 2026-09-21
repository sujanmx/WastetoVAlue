import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'soft-green' | 'ai-vision' | 'ai-value' | 'ai-matching';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-medium tracking-tight',
    md: 'text-xs px-2.5 py-1 font-medium',
  }[size];

  const variantStyles = {
    default: 'bg-canvas text-secondary-text border border-border',
    success: 'bg-[#EDF7F1] text-success border border-[#C5E6D3]',
    warning: 'bg-[#FFF8EB] text-warning border border-[#FDE68A]',
    error: 'bg-[#FEF3F2] text-error border border-[#FECDCA]',
    'soft-green': 'bg-soft-green text-brand-green border border-[#C8E0D2]',
    'ai-vision': 'bg-ai-vision-soft text-ai-vision border border-ai-vision-border',
    'ai-value': 'bg-ai-value-soft text-ai-value border border-ai-value-border',
    'ai-matching': 'bg-ai-matching-soft text-ai-matching border border-ai-matching-border',
  }[variant];

  return (
    <span
      className={cn('inline-flex items-center gap-1 rounded-full', sizeStyles, variantStyles, className)}
      {...props}
    >
      {children}
    </span>
  );
};
