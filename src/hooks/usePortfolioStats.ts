import { useMemo } from 'react';
import { NormalizedAsset } from '../lib/api';

export interface PortfolioStats {
  totalValue: number;
  weightedChange24h: number;
  bestPerformer: NormalizedAsset | null;
  worstPerformer: NormalizedAsset | null;
  series: { time: number; value: number }[];
}

export function usePortfolioStats(assets: NormalizedAsset[]): PortfolioStats {
  return useMemo(() => {
    if (!assets.length) {
      return { totalValue: 0, weightedChange24h: 0, bestPerformer: null, worstPerformer: null, series: [] };
    }
    const weights = assets.map((a) => a.marketCap || a.liquidity || a.price || 1);
    const totalWeight = weights.reduce((s, w) => s + w, 0) || 1;
    const totalValue = weights.reduce((s, w) => s + w, 0);
    const weightedChange24h =
      assets.reduce((s, a, i) => s + a.change24h * weights[i], 0) / totalWeight;

    const sorted = [...assets].sort((a, b) => b.change24h - a.change24h);
    const bestPerformer = sorted[0] || null;
    const worstPerformer = sorted[sorted.length - 1] || null;

    const points = 40;
    const now = Date.now();
    const series = Array.from({ length: points }, (_, i) => {
      const t = i / (points - 1);
      const ease = Math.sin(t * Math.PI * 1.5) * 0.4 + t;
      const value = totalValue * (1 + (weightedChange24h / 100) * (ease - 0.5) * 2 * 0.001 + (ease - 1) * (weightedChange24h / 100) * 0.5);
      return { time: now - 86400e3 + (86400e3 / points) * i, value };
    });

    return { totalValue, weightedChange24h, bestPerformer, worstPerformer, series };
  }, [assets]);
}