import { useQuery } from '@tanstack/react-query';
import { fetchAllAssets, NormalizedAsset } from '../lib/api';
import { WATCHLIST } from '../lib/assets';
import { useEffect, useState } from 'react';

export interface UseAssetPricesResult {
  assets: NormalizedAsset[];
  isLoading: boolean;
  isError: boolean;
  lastUpdated: Date | null;
  refetch: () => void;
}

export function useAssetPrices(): UseAssetPricesResult {
  const query = useQuery({
    queryKey: ['assets'],
    queryFn: () => fetchAllAssets(WATCHLIST),
    refetchInterval: 30000,
    staleTime: 15000,
  });

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  useEffect(() => {
    if (query.dataUpdatedAt) setLastUpdated(new Date(query.dataUpdatedAt));
  }, [query.dataUpdatedAt]);

  return {
    assets: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    lastUpdated,
    refetch: () => query.refetch(),
  };
}