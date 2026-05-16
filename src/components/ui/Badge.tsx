import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'border-transparent bg-muted text-muted-foreground hover:bg-muted/80',
        destructive: 'border-transparent bg-red-500 text-white hover:bg-red-500/80',
        outline: 'text-foreground border-border',
        success: 'border-transparent bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
        warning: 'border-transparent bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
        ai: 'border-transparent bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
