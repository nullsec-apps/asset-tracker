import { useState } from 'react';
import { motion } from 'framer-motion';
import { TopNav } from './TopNav';
import { MarketTicker } from './MarketTicker';
import { PortfolioSummary } from './PortfolioSummary';
import { AssetGrid } from './AssetGrid';
import { AssetDetail } from './AssetDetail';
import { useAssetPrices } from '../hooks/useAssetPrices';
import { NormalizedAsset } from '../lib/api';

export function AppShell() {
  const { assets, isLoading, isError, lastUpdated, refetch } = useAssetPrices();
  const [selected, setSelected] = useState<NormalizedAsset | null>(null);
  const [open, setOpen] = useState(false);

  const handleSelect = (asset: NormalizedAsset) => {
    setSelected(asset);
    setOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <MarketTicker assets={assets} />
      <TopNav onRefresh={refetch} lastUpdated={lastUpdated} isLoading={isLoading} />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <PortfolioSummary assets={assets} isLoading={isLoading} />
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Favourite Assets</h3>
            <span className="text-xs text-muted-foreground">{assets.length} tracked</span>
          </div>
          <AssetGrid assets={assets} isLoading={isLoading} isError={isError} onSelect={handleSelect} onRetry={refetch} />
        </motion.div>
        <footer className="pt-4 text-center text-xs text-muted-foreground">
          Live data via DexScreener &amp; CoinGecko · auto-refresh every 30s
        </footer>
      </main>
      <AssetDetail asset={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}