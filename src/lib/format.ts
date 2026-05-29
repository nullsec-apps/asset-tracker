export function formatPrice(value: number): string {
  if (!isFinite(value) || value === 0) return '$0.00';
  if (value >= 1) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (value >= 0.01) {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`;
  }
  const sig = value.toPrecision(4).replace(/0+$/, '');
  return `$${sig}`;
}

export function formatCompact(value: number): string {
  if (!isFinite(value)) return '--';
  const abs = Math.abs(value);
  if (abs >= 1e9) return (value / 1e9).toFixed(2) + 'B';
  if (abs >= 1e6) return (value / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return (value / 1e3).toFixed(2) + 'K';
  return value.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

export function formatPercent(value: number): string {
  if (!isFinite(value)) return '--';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function formatCurrency(value: number): string {
  if (!isFinite(value)) return '--';
  const abs = Math.abs(value);
  if (abs >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
}