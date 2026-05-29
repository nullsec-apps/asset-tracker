import { NormalizedAsset } from '../lib/api';
import { formatPrice, formatPercent } from '../lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MarketTickerProps {
  assets: NormalizedAsset[];
}

export function MarketTicker({ assets }: MarketTickerProps) {
  if (assets.length === 0) {
    return (
      <div className="overflow-hidden border-b border-border bg-card/40">
        <div className="px-5 py-2 text-sm text-muted-foreground">Loading market data…</div>
      </div>
    );
  }

  const row = [...assets, ...assets];

  return (
    <div className="overflow-hidden border-b border-border bg-card/40">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {row.map((a, i) => {
          const up = a.change24h >= 0;
          return (
            <div key={i} className="flex items-center gap-2 border-r border-border/50 px-5 py-2 text-sm">
              <span className="font-semibold" style={{ color: a.color }}>
                {a.symbol}
              </span>
              <span className="text-foreground">{formatPrice(a.price)}</span>
              <span
                className={`flex items-center gap-0.5 text-xs ${
                  up ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {formatPercent(a.change24h)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}