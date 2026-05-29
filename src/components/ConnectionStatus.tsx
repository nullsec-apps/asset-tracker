import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ConnectionStatusProps {
  lastUpdated: Date | null;
  isLoading: boolean;
}

export function ConnectionStatus({ lastUpdated, isLoading }: ConnectionStatusProps) {
  const [ago, setAgo] = useState('');

  useEffect(() => {
    const tick = () => {
      if (!lastUpdated) {
        setAgo('connecting');
        return;
      }
      const secs = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (secs < 5) setAgo('just now');
      else if (secs < 60) setAgo(`${secs}s ago`);
      else setAgo(`${Math.floor(secs / 60)}m ago`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [lastUpdated]);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge variant="secondary" className="gap-1.5 px-2.5 py-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isLoading ? 'bg-amber-400' : 'bg-emerald-400'
            } animate-pulse-dot`}
          />
          <span className="text-[10px] font-semibold tracking-wide">{isLoading ? 'SYNC' : 'LIVE'}</span>
        </Badge>
      </TooltipTrigger>
      <TooltipContent>Updated {ago} · polling 30s</TooltipContent>
    </Tooltip>
  );
}