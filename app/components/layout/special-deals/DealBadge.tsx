// app/components/layout/special-deals/DealBadge.tsx
'use client';

import { cn } from '@/lib/utils';
import { Zap, Flame, Sparkles, TrendingDown } from 'lucide-react';

interface DealBadgeProps {
  type?: 'hot' | 'flash' | 'limited' | 'discount';
  text?: string;
  discount?: number;
}

export function DealBadge({ type = 'discount', text, discount }: DealBadgeProps) {
  const getBadgeConfig = () => {
    switch (type) {
      case 'hot':
        return {
          icon: Flame,
          bgClass: 'bg-gradient-to-br from-destructive to-destructive/80',
          label: text || 'Hot Deal',
        };
      case 'flash':
        return {
          icon: Zap,
          bgClass: 'bg-gradient-to-br from-emperador to-granite',
          label: text || 'Flash Sale',
        };
      case 'limited':
        return {
          icon: Sparkles,
          bgClass: 'bg-gradient-to-br from-accent to-clay',
          label: text || 'Limited',
        };
      case 'discount':
      default:
        return {
          icon: TrendingDown,
          bgClass: 'bg-gradient-to-br from-emperador to-granite',
          label: discount ? `${discount}% OFF` : text || 'Sale',
        };
    }
  };

  const { icon: Icon, bgClass, label } = getBadgeConfig();

  return (
    <div className="absolute top-3 left-3 z-10">
      <div
        className={cn(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-md',
          'text-white text-xs font-semibold uppercase tracking-wider',
          'shadow-lg backdrop-blur-sm',
          'animate-pulse-slow',
          bgClass
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{label}</span>
      </div>
    </div>
  );
}
