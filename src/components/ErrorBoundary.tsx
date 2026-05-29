import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface State { hasError: boolean; }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle size={26} />
          </div>
          <h2 className="font-display text-xl font-semibold">Something went wrong</h2>
          <p className="max-w-sm text-sm text-muted-foreground">
            The terminal hit an unexpected error. Reload to reconnect to the live feed.
          </p>
          <Button onClick={() => window.location.reload()}>Reload terminal</Button>
        </div>
      );
    }
    return this.props.children;
  }
}