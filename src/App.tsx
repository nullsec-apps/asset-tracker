import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AppShell } from './components/AppShell';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchInterval: 30000, staleTime: 15000, retry: 1 } },
});

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppShell />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}