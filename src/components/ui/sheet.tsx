import * as React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

interface SheetContextType {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = React.createContext<SheetContextType>({ open: false, onOpenChange: () => {} });

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function Sheet({ open, onOpenChange, children }: SheetProps) {
  return <SheetContext.Provider value={{ open, onOpenChange }}>{children}</SheetContext.Provider>;
}

function SheetContent({ className, children }: { className?: string; children: React.ReactNode }) {
  const { open, onOpenChange } = React.useContext(SheetContext);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: 'fadeIn 0.25s ease-out' }}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'absolute right-0 top-0 h-full w-full max-w-md border-l border-border bg-card shadow-2xl',
          className
        )}
        style={{ animation: 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-md p-1 text-muted-foreground transition-colors duration-200 hover:bg-secondary hover:text-foreground"
        >
          <X size={20} />
        </button>
        {children}
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
    </div>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pb-2', className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('font-display text-xl font-semibold', className)} {...props} />;
}

export { Sheet, SheetContent, SheetHeader, SheetTitle };