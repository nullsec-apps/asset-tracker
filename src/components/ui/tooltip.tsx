import * as React from 'react';
import { cn } from '@/lib/utils';

function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Tooltip({ children }: { children: React.ReactNode }) {
  return <span className="group relative inline-flex">{children}</span>;
}

function TooltipTrigger({ children }: { children: React.ReactNode; asChild?: boolean }) {
  return <>{children}</>;
}

function TooltipContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'pointer-events-none absolute -top-9 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow transition-opacity duration-200 group-hover:opacity-100',
        className
      )}
    >
      {children}
    </span>
  );
}

export { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent };