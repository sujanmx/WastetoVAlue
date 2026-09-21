import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'ai-vision' | 'ai-value' | 'ai-matching';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'h-9 px-3 text-xs rounded-control gap-1.5',
      md: 'h-11 md:h-12 px-5 text-sm rounded-button gap-2', // Meets 44-48px touch target
      lg: 'h-12 md:h-14 px-6 text-base rounded-button gap-2.5',
    }[size];

    const variantStyles = {
      primary:
        'bg-deep-forest text-white hover:bg-[#072419] active:bg-[#041710] shadow-sm',
      secondary:
        'bg-surface text-primary-text border border-border hover:bg-[#F2F4F2] active:bg-[#E8EBE8]',
      tertiary:
        'bg-transparent text-secondary-text hover:text-primary-text hover:bg-black/5 active:bg-black/10',
      destructive:
        'bg-error text-white hover:bg-[#9B1C12] active:bg-[#7F170E]',
      'ai-vision':
        'bg-ai-vision text-white hover:bg-[#0F766E] shadow-sm',
      'ai-value':
        'bg-ai-value text-white hover:bg-[#B45309] shadow-sm',
      'ai-matching':
        'bg-ai-matching text-white hover:bg-[#4338CA] shadow-sm',
    }[variant];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseStyles,
          sizeStyles,
          variantStyles,
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
