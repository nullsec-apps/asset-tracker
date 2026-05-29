import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { TimeRange, usePriceHistory } from '../hooks/usePriceHistory';
import { formatPrice } from '../lib/format';

interface PriceChartProps {
  assetId: string;
  color?: string;
  positive?: boolean;
}

export function PriceChart({ assetId, positive = true }: PriceChartProps) {
  const [range, setRange] = useState<TimeRange>('24H');
  const { data, isLoading } = usePriceHistory(assetId, range);

  const line = positive ? '#34d399' : '#fb7185';
  const min = data.length ? Math.min(...data.map((d) => d.price)) : 0;
  const max = data.length ? Math.max(...data.map((d) => d.price)) : 1;

  return (
    <div className="space-y-3">
      <Tabs value={range} onValueChange={(v) => setRange(v as TimeRange)}>
        <TabsList>
          <TabsTrigger value="1H">1H</TabsTrigger>
          <TabsTrigger value="24H">24H</TabsTrigger>
          <TabsTrigger value="7D">7D</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="h-48 w-full rounded-lg border border-border bg-secondary/20 p-2">
        {isLoading || !data.length ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            {isLoading ? 'Loading chart…' : 'No history available'}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 6, right: 6, left: 6, bottom: 0 }}>
              <defs>
                <linearGradient id="detailGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={line} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={line} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" hide />
              <YAxis domain={[min * 0.998, max * 1.002]} hide />
              <RTooltip
                contentStyle={{
                  background: 'hsl(var(--popover))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelFormatter={(t) => new Date(t as number).toLocaleString()}
                formatter={(v: any) => [formatPrice(v as number), 'Price']}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={line}
                strokeWidth={2}
                fill="url(#detailGrad)"
                isAnimationActive
                animationDuration={700}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}