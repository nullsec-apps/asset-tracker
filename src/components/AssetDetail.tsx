import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Copy, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { MarketStats } from './MarketStats';
import { NormalizedAsset } from '../lib/api';
import { formatPrice, formatPercent } from '../lib/format';

interface AssetDetailProps {
  asset: NormalizedAsset | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssetDetail({ asset, open, onOpenChange }: AssetDetailProps) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    if (!asset?.address) return;
    navigator.clipboard.writeText(asset.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const up = (asset?.change24h ?? 0) >= 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        {asset && (
          <>
            <SheetHeader>
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: asset.color }}
                >
                  {asset.symbol.slice(0, 2)}
                </div>
                <div>
                  <SheetTitle>{asset.name}</SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    {asset.symbol} · {asset.chain}
                  </p>
                </div>
              </div>
            </SheetHeader>
            <div className="space-y-6 p-6 pt-2">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl font-bold tabular-nums">
                  {formatPrice(asset.price)}
                </span>
                <Badge
                  variant="secondary"
                  className={`gap-0.5 ${up ? 'text-emerald-400' : 'text-rose-400'}`}
                >
                  {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {formatPercent(asset.change24h)}
                </Badge>
              </div>

              <PriceChart assetId={asset.id} color={asset.color} positive={up} />
              <MarketStats asset={asset} />

              {asset.address && (
                <div className="rounded-lg border border-border p-3">
                  <p className="mb-1 text-xs text-muted-foreground">Contract Address</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="truncate text-xs text-foreground">{asset.address}</code>
                    <Button variant="ghost" size="icon" onClick={copy} className="shrink-0">
                      {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                {asset.dexUrl && (
                  <Button variant="outline" size="sm" onClick={() => window.open(asset.dexUrl, '_blank')}>
                    <ExternalLink size={14} /> {asset.source === 'coingecko' ? 'CoinGecko' : 'DexScreener'}
                  </Button>
                )}
                {asset.explorerUrl && (
                  <Button variant="outline" size="sm" onClick={() => window.open(asset.explorerUrl, '_blank')}>
                    <ExternalLink size={14} /> Explorer
                  </Button>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}