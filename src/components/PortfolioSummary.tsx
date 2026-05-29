import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { NormalizedAsset } from '../lib/api';
import { usePortfolioStats } from '../hooks/usePortfolioStats';
import { formatCurrency, formatPercent } from '../lib/format';

interface PortfolioSummaryProps {
  assets: NormalizedAsset[];
  isLoading: boolean;
}

function useCountUp(target: number, duration = 900) {
  const [val, setVal] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    const start = prev.current;
    const startTime = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(start + (target - start) * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else prev.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

export function PortfolioSummary({ assets, isLoading }: PortfolioSummaryProps) {
  const stats = usePortfolioStats(assets);
  const animatedTotal = useCountUp(stats.totalValue);
  const up = stats.weightedChange24h >= 0;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <Card className="overflow-hidden transition-shadow duration-200 hover:shadow-lg">
        <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Combined Watchlist Value</p>
            {isLoading ? (
              <Skeleton className="h-11 w-56" />
            ) : (
              <h2 className="font-display text-3xl font-bold tabular-nums sm:text-4xl">{formatCurrency(animatedTotal)}</h2>
            )}
            <Badge
              variant="secondary"
              className={`gap-1 ${up ? 'text-emerald-400' : 'text-rose-400'}`}
            >
              {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {formatPercent(stats.weightedChange24h)} 24h
            </Badge>
          </div>

          <div className="h-20 w-full max-w-xs">
            {!isLoading && stats.series.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats.series}>
                  <defs>
                    <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={up ? '#34d399' : '#fb7185'} stopOpacity={0.4} />
                      <stop offset="100%" stopColor={up ? '#34d399' : '#fb7185'} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={up ? '#34d399' : '#fb7185'}
                    strokeWidth={2}
                    fill="url(#portfolioGrad)"
                    isAnimationActive
                    animationDuration={900}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-lg border border-border p-3 transition-colors duration-200 hover:border-emerald-400/40">
              <p className="flex items-center gap-1 text-xs text-emerald-400">
                <ArrowUpRight size={13} /> Best Performer
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-5 w-20" />
              ) : (
                <p className="mt-0.5 font-display font-semibold">
                  {stats.bestPerformer?.symbol}{' '}
                  <span className="text-sm text-emerald-400">
                    {stats.bestPerformer ? formatPercent(stats.bestPerformer.change24h) : ''}
                  </span>
                </p>
              )}
            </div>
            <div className="rounded-lg border border-border p-3 transition-colors duration-200 hover:border-rose-400/40">
              <p className="flex items-center gap-1 text-xs text-rose-400">
                <ArrowDownRight size={13} /> Worst Performer
              </p>
              {isLoading ? (
                <Skeleton className="mt-1 h-5 w-20" />
              ) : (
                <p className="mt-0.5 font-display font-semibold">
                  {stats.worstPerformer?.symbol}{' '}
                  <span className="text-sm text-rose-400">
                    {stats.worstPerformer ? formatPercent(stats.worstPerformer.change24h) : ''}
                  </span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}