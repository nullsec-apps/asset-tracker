import { Area, AreaChart, ResponsiveContainer, YAxis } from 'recharts';
import { PricePoint } from '../hooks/usePriceHistory';

interface SparklineProps {
  data: PricePoint[];
  positive?: boolean;
}

export function Sparkline({ data, positive = true }: SparklineProps) {
  if (!data.length) return <div className="h-12 w-full animate-pulse rounded bg-secondary/40" />;
  const color = positive ? '#34d399' : '#fb7185';
  const id = `spark-${positive ? 'up' : 'down'}-${data.length}`;
  const min = Math.min(...data.map((d) => d.price));
  const max = Math.max(...data.map((d) => d.price));
  return (
    <div className="h-12 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={[min, max]} hide />
          <Area
            type="monotone"
            dataKey="price"
            stroke={color}
            strokeWidth={1.8}
            fill={`url(#${id})`}
            isAnimationActive
            animationDuration={800}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}