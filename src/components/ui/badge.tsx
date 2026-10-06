import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold tracking-wide border",
  {
    variants: {
      variant: {
        operational:
          "border-status-operational/35 bg-status-operational/15 text-status-operational",
        warning:
          "border-status-warning/35 bg-status-warning/15 text-status-warning",
        critical:
          "border-status-critical/35 bg-status-critical/15 text-status-critical",
        muted:
          "border-border bg-white/[0.04] text-foreground-muted",
        info: "border-status-info/35 bg-status-info/15 text-status-info",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
