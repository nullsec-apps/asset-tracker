import { AssetConfig } from './assets';

export interface NormalizedAsset {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  color: string;
  price: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  fdv: number;
  address?: string;
  explorerUrl?: string;
  dexUrl?: string;
}

function explorerFor(chain: string, address?: string): string | undefined {
  if (!address) return undefined;
  if (chain === 'base') return `https://basescan.org/token/${address}`;
  if (chain === 'ethereum') return `https://etherscan.io/token/${address}`;
  return undefined;
}

export async function fetchDexScreener(config: AssetConfig): Promise<NormalizedAsset> {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${config.address}`);
  if (!res.ok) throw new Error('dexscreener failed');
  const data = await res.json();
  const pairs = (data.pairs || []).filter((p: any) => p.chainId === config.chain || true);
  const pair = pairs.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
  if (!pair) throw new Error('no pair');
  return {
    id: config.id,
    symbol: config.symbol,
    name: config.name,
    chain: config.chain,
    color: config.color,
    price: parseFloat(pair.priceUsd) || 0,
    change24h: pair.priceChange?.h24 ?? 0,
    volume24h: pair.volume?.h24 ?? 0,
    liquidity: pair.liquidity?.usd ?? 0,
    marketCap: pair.marketCap ?? pair.fdv ?? 0,
    fdv: pair.fdv ?? 0,
    address: config.address,
    explorerUrl: explorerFor(config.chain, config.address),
    dexUrl: `https://dexscreener.com/${config.chain}/${config.address}`,
  };
}

export async function fetchCoinGecko(config: AssetConfig): Promise<NormalizedAsset> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${config.coingeckoId}&price_change_percentage=24h`
  );
  if (!res.ok) throw new Error('coingecko failed');
  const data = await res.json();
  const c = data[0];
  if (!c) throw new Error('no coin');
  return {
    id: config.id,
    symbol: config.symbol,
    name: config.name,
    chain: config.chain,
    color: config.color,
    price: c.current_price ?? 0,
    change24h: c.price_change_percentage_24h ?? 0,
    volume24h: c.total_volume ?? 0,
    liquidity: 0,
    marketCap: c.market_cap ?? 0,
    fdv: c.fully_diluted_valuation ?? c.market_cap ?? 0,
    explorerUrl:
      config.chain === 'bitcoin'
        ? 'https://www.blockchain.com/explorer'
        : 'https://etherscan.io',
    dexUrl:
      config.chain === 'bitcoin'
        ? 'https://www.coingecko.com/en/coins/bitcoin'
        : 'https://www.coingecko.com/en/coins/ethereum',
  };
}

export async function fetchAsset(config: AssetConfig): Promise<NormalizedAsset> {
  if (config.source === 'coingecko') return fetchCoinGecko(config);
  return fetchDexScreener(config);
}

export async function fetchAllAssets(configs: AssetConfig[]): Promise<NormalizedAsset[]> {
  const results = await Promise.allSettled(configs.map((c) => fetchAsset(c)));
  return results
    .map((r, i) => {
      if (r.status === 'fulfilled') return r.value;
      const c = configs[i];
      return {
        id: c.id,
        symbol: c.symbol,
        name: c.name,
        chain: c.chain,
        color: c.color,
        price: 0,
        change24h: 0,
        volume24h: 0,
        liquidity: 0,
        marketCap: 0,
        fdv: 0,
        address: c.address,
        explorerUrl: explorerFor(c.chain, c.address),
      } as NormalizedAsset;
    })
    .sort((a, b) => configs.findIndex((c) => c.id === a.id) - configs.findIndex((c) => c.id === b.id));
}