import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Sparkline } from './Sparkline';
import { NormalizedAsset } from '../lib/api';
import { usePriceHistory } from '../hooks/usePriceHistory';
import { formatPrice, formatPercent, formatCurrency } from '../lib/format';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  asset: NormalizedAsset;
  onClick: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  const { data } = usePriceHistory(asset.id, '24H');
  const up = asset.change24h >= 0;

  const [flash, setFlash] = useState('');
  const prevPrice = useRef(asset.price);
  useEffect(() => {
    if (prevPrice.current !== 0 && asset.price !== prevPrice.current) {
      setFlash(asset.price > prevPrice.current ? 'flash-up' : 'flash-down');
      const t = setTimeout(() => setFlash(''), 800);
      prevPrice.current = asset.price;
      return () => clearTimeout(t);
    }
    prevPrice.current = asset.price;
  }, [asset.price]);

  return (
    <Card
      onClick={onClick}
      className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
    >
      <CardContent className={cn('space-y-4 rounded-xl p-5', flash)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white transition-transform duration-200 group-hover:scale-110"
              style={{ backgroundColor: asset.color }}
            >
              {asset.symbol.slice(0, 2)}
            </div>
            <div>
              <p className="font-display font-semibold leading-tight">{asset.name}</p>
              <p className="text-xs text-muted-foreground">{asset.symbol} · {asset.chain}</p>
            </div>
          </div>
          <Badge
            variant="secondary"
            className={cn('gap-0.5', up ? 'text-emerald-400' : 'text-rose-400')}
          >
            {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {formatPercent(asset.change24h)}
          </Badge>
        </div>

        <div className="text-2xl font-bold tabular-nums">{formatPrice(asset.price)}</div>

        <Sparkline data={data} positive={up} />

        <div className="flex justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <div>
            <p className="text-[10px] uppercase tracking-wide">24h Vol</p>
            <p className="font-medium text-foreground">{formatCurrency(asset.volume24h)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wide">
              {asset.liquidity ? 'Liquidity' : 'Mkt Cap'}
            </p>
            <p className="font-medium text-foreground">
              {formatCurrency(asset.liquidity || asset.marketCap)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}