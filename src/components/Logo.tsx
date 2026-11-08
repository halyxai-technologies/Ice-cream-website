import { cn } from "@/lib/utils";

/** Typeset wordmark matching the cup logo: chunky rounded BRIO over a tracked GELATO. */
export function Logo({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <span className={cn("inline-flex flex-col items-center leading-none", className)} style={{ color }}>
      <span className="font-display text-[1.6em] font-bold tracking-[0.01em]">BRIO</span>
      <span className="font-display -mt-[0.05em] text-[0.42em] font-medium tracking-[0.5em] pl-[0.5em]">GELATO</span>
    </span>
  );
}
