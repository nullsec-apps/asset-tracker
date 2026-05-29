import { Separator } from '@/components/ui/separator';
import { NormalizedAsset } from '../lib/api';
import { formatCurrency } from '../lib/format';

interface MarketStatsProps {
  asset: NormalizedAsset;
}

export function MarketStats({ asset }: MarketStatsProps) {
  const stats = [
    { label: 'Market Cap', value: asset.marketCap ? formatCurrency(asset.marketCap) : '--' },
    { label: 'FDV', value: asset.fdv ? formatCurrency(asset.fdv) : '--' },
    { label: '24h Volume', value: asset.volume24h ? formatCurrency(asset.volume24h) : '--' },
    {
      label: asset.liquidity ? 'Liquidity' : 'Holders',
      value: asset.liquidity ? formatCurrency(asset.liquidity) : 'View on explorer →',
    },
  ];
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-border p-3 transition-colors duration-200 hover:border-primary/40">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="font-display text-lg font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>
      <Separator />
    </div>
  );
}