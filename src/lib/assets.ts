export type AssetSource = 'dexscreener' | 'coingecko';

export interface AssetConfig {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  source: AssetSource;
  address?: string;
  coingeckoId?: string;
  color: string;
}

export const WATCHLIST: AssetConfig[] = [
  {
    id: 'tibbir',
    symbol: 'TIBBIR',
    name: 'Tibbir',
    chain: 'base',
    source: 'dexscreener',
    address: '0xa4a2e2ca3fbfe21aed83471d28b6f65a233c6e00',
    color: '#F2A93B',
  },
  {
    id: 'oso',
    symbol: 'OSO',
    name: 'Oso',
    chain: 'base',
    source: 'dexscreener',
    address: '0x6921b130d297cc43754afba22e5eac0fbf8db75b',
    color: '#5BD3A6',
  },
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    chain: 'bitcoin',
    source: 'coingecko',
    coingeckoId: 'bitcoin',
    color: '#F7931A',
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    chain: 'ethereum',
    source: 'coingecko',
    coingeckoId: 'ethereum',
    color: '#627EEA',
  },
  {
    id: 'gribbit',
    symbol: 'GRIBBIT',
    name: 'Gribbit',
    chain: 'base',
    source: 'dexscreener',
    address: '0x6dd1b86b1aaa379d92a1b76a3aa1f7c5fa5d8c4a',
    color: '#7C5CFC',
  },
];