'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendingUp,
  Target,
  DollarSign,
  Settings,
  AlertCircle,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { QuickWin, Priority, Tag } from '@/lib/types';
import { cn } from '@/lib/utils';

interface QuickWinCardProps {
  quickWin: QuickWin;
  delay?: number;
}

const priorityConfig: Record<Priority, { variant: 'danger' | 'warning' | 'secondary'; label: string }> = {
  HIGH: { variant: 'danger', label: 'Haute' },
  MEDIUM: { variant: 'warning', label: 'Moyenne' },
  LOW: { variant: 'secondary', label: 'Basse' },
};

const tagConfig: Record<Tag, { icon: typeof Lightbulb; color: string; label: string }> = {
  CREA: { icon: Lightbulb, color: 'text-purple-500', label: 'Créa' },
  MEDIA: { icon: TrendingUp, color: 'text-blue-500', label: 'Média' },
  FUNNEL: { icon: Target, color: 'text-green-500', label: 'Funnel' },
  SALES: { icon: DollarSign, color: 'text-yellow-500', label: 'Sales' },
  OPS: { icon: Settings, color: 'text-gray-500', label: 'Ops' },
};

export function QuickWinCard({ quickWin, delay = 0 }: QuickWinCardProps) {
  const { title, reason, action, impact, priority, tag } = quickWin;

  const priorityStyle = priorityConfig[priority];
  const tagStyle = tagConfig[tag];
  const TagIcon = tagStyle.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="group hover:border-primary/30 transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 flex-1">
              <div className={cn('mt-0.5', tagStyle.color)}>
                <TagIcon className="h-5 w-5" />
              </div>
              <div className="space-y-1 flex-1">
                <CardTitle className="text-base font-semibold leading-tight">
                  {title}
                </CardTitle>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={priorityStyle.variant} className="text-xs">
                    {priorityStyle.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {tagStyle.label}
                  </Badge>
                </div>
              </div>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs">
                  <p className="text-sm">{impact}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Raison
              </span>
            </div>
            <p className="text-sm text-foreground/80">{reason}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Action
              </span>
            </div>
            <p className="text-sm text-foreground">{action}</p>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-medium text-primary">{impact}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
