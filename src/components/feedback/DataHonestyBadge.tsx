import React from 'react';
import { Badge } from '../common/Badge';
import { Info, Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

export type HonestyType =
  | 'ai-assisted'
  | 'estimated'
  | 'prototype-calculation'
  | 'demo-data'
  | 'potential-value'
  | 'demo-receiver';

interface DataHonestyBadgeProps {
  type: HonestyType;
  className?: string;
  customText?: string;
}

export const DataHonestyBadge: React.FC<DataHonestyBadgeProps> = ({
  type,
  className,
  customText,
}) => {
  switch (type) {
    case 'ai-assisted':
      return (
        <Badge variant="ai-vision" size="sm" className={cn('gap-1', className)}>
          <Sparkles className="w-3 h-3" />
          <span>{customText || 'AI-assisted assessment'}</span>
        </Badge>
      );
    case 'estimated':
      return (
        <Badge variant="warning" size="sm" className={cn('gap-1', className)}>
          <Info className="w-3 h-3" />
          <span>{customText || 'Estimated'}</span>
        </Badge>
      );
    case 'prototype-calculation':
      return (
        <Badge variant="default" size="sm" className={cn('gap-1', className)}>
          <span>{customText || 'Prototype calculation'}</span>
        </Badge>
      );
    case 'demo-data':
      return (
        <Badge variant="default" size="sm" className={cn('gap-1', className)}>
          <span>{customText || 'Demo data'}</span>
        </Badge>
      );
    case 'potential-value':
      return (
        <Badge variant="ai-value" size="sm" className={cn('gap-1', className)}>
          <span>{customText || 'Potential value'}</span>
        </Badge>
      );
    case 'demo-receiver':
      return (
        <Badge variant="default" size="sm" className={cn('gap-1', className)}>
          <span>{customText || 'Demo receiver'}</span>
        </Badge>
      );
    default:
      return null;
  }
};
