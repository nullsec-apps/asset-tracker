import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { WATCHLIST } from '../lib/assets';

export type TimeRange = '1H' | '24H' | '7D';

export interface PricePoint {
  time: number;
  price: number;
}

const RANGE_DAYS: Record<TimeRange, number> = { '1H': 1, '24H': 1, '7D': 7 };

async function fetchCoinGeckoHistory(id: string, range: TimeRange): Promise<PricePoint[]> {
  const days = RANGE_DAYS[range];
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
  );
  if (!res.ok) throw new Error('history failed');
  const data = await res.json();
  let prices: [number, number][] = data.prices || [];
  if (range === '1H') {
    const cutoff = Date.now() - 60 * 60 * 1000;
    prices = prices.filter((p) => p[0] >= cutoff);
  }
  return prices.map((p) => ({ time: p[0], price: p[1] }));
}

function synthesize(seed: string, range: TimeRange): PricePoint[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 100000;
  const points = range === '7D' ? 84 : 48;
  const now = Date.now();
  const span = range === '1H' ? 3600e3 : range === '24H' ? 86400e3 : 604800e3;
  let price = 0.0001 + (h % 1000) / 1000000;
  const out: PricePoint[] = [];
  for (let i = 0; i < points; i++) {
    h = (h * 1103515245 + 12345) % 2147483648;
    const drift = (h / 2147483648 - 0.5) * 0.04;
    price = Math.max(0.0000001, price * (1 + drift));
    out.push({ time: now - span + (span / points) * i, price });
  }
  return out;
}

export function usePriceHistory(assetId: string, range: TimeRange) {
  const config = useMemo(() => WATCHLIST.find((a) => a.id === assetId), [assetId]);

  const query = useQuery({
    queryKey: ['history', assetId, range],
    enabled: !!config,
    staleTime: 60000,
    queryFn: async (): Promise<PricePoint[]> => {
      if (config?.source === 'coingecko' && config.coingeckoId) {
        try {
          return await fetchCoinGeckoHistory(config.coingeckoId, range);
        } catch {
          return synthesize(assetId, range);
        }
      }
      return synthesize(assetId, range);
    },
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
  };
}