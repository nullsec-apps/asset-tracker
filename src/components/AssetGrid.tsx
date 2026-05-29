import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { AssetCard } from './AssetCard';
import { NormalizedAsset } from '../lib/api';
import { WATCHLIST } from '../lib/assets';

interface AssetGridProps {
  assets: NormalizedAsset[];
  isLoading: boolean;
  isError: boolean;
  onSelect: (asset: NormalizedAsset) => void;
  onRetry: () => void;
}

export function AssetGrid({ assets, isLoading, isError, onSelect, onRetry }: AssetGridProps) {
  if (isError) {
    return (
      <div className="flex h-48 flex-col items-center justify-center gap-3 rounded-xl border border-border text-muted-foreground">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle size={22} />
        </div>
        <p className="text-sm">Failed to load asset data.</p>
        <Button size="sm" variant="outline" onClick={onRetry}>Try again</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {WATCHLIST.map((a) => (
          <Card key={a.id}>
            <CardContent className="space-y-4 p-5">
              <Skeleton className="h-9 w-32" />
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-6 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!assets.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-border text-sm text-muted-foreground">
        No assets being tracked yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {assets.map((asset, i) => (
        <motion.div
          key={asset.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: i * 0.06 }}
        >
          <AssetCard asset={asset} onClick={() => onSelect(asset)} />
        </motion.div>
      ))}
    </div>
  );
}