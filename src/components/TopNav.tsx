import { Button } from '@/components/ui/button';
import { RefreshCw, Sun, Moon } from 'lucide-react';
import { ConnectionStatus } from './ConnectionStatus';
import { useTheme } from '../hooks/useTheme';

interface TopNavProps {
  onRefresh: () => void;
  lastUpdated: Date | null;
  isLoading: boolean;
}

export function TopNav({ onRefresh, lastUpdated, isLoading }: TopNavProps) {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground transition-transform duration-200 hover:scale-105">
            W
          </div>
          <span className="font-display text-base font-semibold tracking-tight">Watchlist</span>
          <span className="hidden text-xs text-muted-foreground sm:inline">Terminal</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ConnectionStatus lastUpdated={lastUpdated} isLoading={isLoading} />
          <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="Refresh" className="hover:text-primary">
            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme" className="hover:text-primary">
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>
        </div>
      </div>
    </header>
  );
}