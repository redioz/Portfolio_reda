'use client';

import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Delta } from '@/lib/types';
import { cn } from '@/lib/utils';

interface DeltaBadgeProps {
  delta: Delta;
  format?: 'number' | 'currency' | 'percentage';
  invertColors?: boolean; // Pour les métriques où "down" est mieux (ex: CPC)
}

export function DeltaBadge({ delta, format = 'percentage', invertColors = false }: DeltaBadgeProps) {
  const { percentage, trend } = delta;

  const isPositive = invertColors ? trend === 'down' : trend === 'up';
  const isNegative = invertColors ? trend === 'up' : trend === 'down';

  const variantMap = {
    positive: 'success' as const,
    negative: 'danger' as const,
    stable: 'secondary' as const,
  };

  const variant = isPositive
    ? variantMap.positive
    : isNegative
    ? variantMap.negative
    : variantMap.stable;

  const Icon = trend === 'up' ? ArrowUp : trend === 'down' ? ArrowDown : Minus;

  const sign = percentage >= 0 ? '+' : '';
  const displayValue = `${sign}${percentage.toFixed(1)}%`;

  return (
    <Badge variant={variant} className="inline-flex items-center gap-1">
      <Icon className="h-3 w-3" />
      <span className="text-xs font-medium">{displayValue}</span>
    </Badge>
  );
}
