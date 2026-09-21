import React from 'react';
import { cn } from '../../lib/utils';

export interface WorkspaceContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: 'sm' | 'md' | 'lg' | 'content' | 'full';
}

export const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({
  className,
  maxWidth = 'content',
  children,
  ...props
}) => {
  const maxWidthStyles = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    content: 'max-w-content',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div
      className={cn(
        'w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8 transition-all',
        maxWidthStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
