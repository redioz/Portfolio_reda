'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatNumber, formatCurrency, formatPercentage } from '@/lib/utils';
import { DeltaBadge } from './delta-badge';
import { Delta } from '@/lib/types';

interface KpiCardProps {
  label: string;
  value: number;
  delta?: Delta;
  format?: 'number' | 'currency' | 'percentage';
  icon?: LucideIcon;
  className?: string;
  delay?: number;
  tooltip?: string;
}

export function KpiCard({
  label,
  value,
  delta,
  format = 'number',
  icon: Icon,
  className,
  delay = 0,
  tooltip,
}: KpiCardProps) {
  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val);
      case 'percentage':
        return formatPercentage(val);
      default:
        return formatNumber(val);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn('group hover:border-primary/50 transition-all', className)}>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {label}
          </CardTitle>
          {Icon && (
            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-2xl font-bold tracking-tight">
              {formatValue(value)}
            </div>
            {delta && <DeltaBadge delta={delta} format={format} />}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
