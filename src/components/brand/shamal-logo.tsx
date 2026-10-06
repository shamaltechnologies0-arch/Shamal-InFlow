import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  href?: string;
  className?: string;
  /** mark = compact navbar size; full = standard; stacked = login / hero */
  variant?: "full" | "mark" | "stacked";
};

export function ShamalLogo({ href = "/", className, variant = "full" }: Props) {
  const mark = (
    <span className="inline-flex items-center rounded-md bg-white px-2.5 py-1">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/shamal-logo.png"
        alt="Shamal Inventory"
        width={952}
        height={172}
        className={cn(
          "h-auto w-auto object-contain",
          variant === "mark" && "h-7",
          variant === "full" && "h-8",
          variant === "stacked" && "h-14",
        )}
      />
    </span>
  );

  if (!href) return <div className={className}>{mark}</div>;
  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      {mark}
    </Link>
  );
}
