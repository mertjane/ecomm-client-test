// app/components/layout/special-deals/DealTimer.tsx
'use client';

import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DealTimerProps {
  expiresAt: string; // ISO string format
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function DealTimer({ expiresAt, className }: DealTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(expiresAt).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  if (isExpired) {
    return (
      <div className={cn('text-center py-2 text-xs text-destructive uppercase tracking-wider', className)}>
        Deal Expired
      </div>
    );
  }

  if (!timeLeft) {
    return null;
  }

  return (
    <div className={cn('bg-muted/50 rounded-md p-3', className)}>
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="w-3.5 h-3.5 text-emperador" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
          Ends In
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2">
        <TimeUnit value={timeLeft.days} label="Days" />
        <TimeUnit value={timeLeft.hours} label="Hrs" />
        <TimeUnit value={timeLeft.minutes} label="Min" />
        <TimeUnit value={timeLeft.seconds} label="Sec" />
      </div>
    </div>
  );
}

interface TimeUnitProps {
  value: number;
  label: string;
}

function TimeUnit({ value, label }: TimeUnitProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-emperador text-porcelain rounded px-2 py-1 min-w-[2.5rem] text-center">
        <span className="text-base font-semibold tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
        {label}
      </span>
    </div>
  );
}
