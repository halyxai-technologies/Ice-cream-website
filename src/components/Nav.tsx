import { useEffect, useRef, useState } from "react";
import { gsap, scrollTo } from "@/lib/gsap";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const LINKS = [
  { label: "Flavours", href: "#flavours" },
  { label: "Our churn", href: "#churn" },
  { label: "Menu", href: "#menu" },
  { label: "Visit", href: "#visit" },
];

export function Nav() {
  const bar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      if (!bar.current) return;
      const hide = y > last && y > 200;
      gsap.to(bar.current, { yPercent: hide ? -160 : 0, duration: 0.5, ease: "power3.out", overwrite: true });
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    const reveal = () =>
      gsap.fromTo(bar.current, { yPercent: -160 }, { yPercent: 0, duration: 1, ease: "expo.out", delay: 0.4 });
    window.addEventListener("brio:reveal", reveal);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("brio:reveal", reveal);
    };
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    scrollTo(href);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[80] h-[3px]">
        <div ref={progress} className="h-full origin-left scale-x-0 bg-gradient-to-r from-pistachio-deep via-strawberry-deep to-blueberry-deep" />
      </div>
      <header ref={bar} className="fixed inset-x-0 top-3 z-[70] flex justify-center px-3 md:top-5">
        <nav className="flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-white/50 bg-cream/70 py-2 pl-6 pr-2 shadow-[0_10px_40px_-15px_rgba(36,22,58,0.35)] backdrop-blur-xl">
          <a href="#top" onClick={go("#top")} data-cursor="Home" aria-label="Brio Gelato home">
            <Logo className="text-[15px] text-ink" />
          </a>
          <ul className="hidden items-center gap-1 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={go(l.href)}
                  className="group relative block overflow-hidden rounded-full px-4 py-2 font-display text-[15px] font-medium text-ink"
                >
                  <span className="block transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-full">{l.label}</span>
                  <span aria-hidden className="absolute inset-0 grid translate-y-full place-items-center text-strawberry-deep transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:translate-y-0">{l.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a
              href="#menu"
              onClick={go("#menu")}
              data-magnetic
              className="rounded-full bg-ink px-5 py-3 font-display text-[15px] font-medium text-cream transition-colors hover:bg-strawberry-deep"
            >
              Order a cup
            </a>
            <button
              onClick={() => setOpen((o) => !o)}
              className="grid size-11 place-items-center rounded-full bg-white/70 md:hidden"
              aria-label="Menu"
              aria-expanded={open}
            >
              <span className={cn("block h-0.5 w-5 bg-ink transition-transform", open && "translate-y-[3px] rotate-45")} />
              <span className={cn("-mt-4 block h-0.5 w-5 bg-ink transition-transform", open && "-translate-y-[3px] -rotate-45 mt-0")} />
            </button>
          </div>
        </nav>
      </header>
      <div
        className={cn(
          "fixed inset-0 z-[65] flex flex-col justify-center gap-2 bg-strawberry-light px-8 transition-[clip-path] duration-700 ease-[var(--ease-out-expo)] md:hidden",
          open ? "[clip-path:circle(150%_at_90%_5%)]" : "pointer-events-none [clip-path:circle(0%_at_90%_5%)]",
        )}
      >
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} onClick={go(l.href)} className="font-display text-6xl font-semibold text-strawberry-deep">
            {l.label}
          </a>
        ))}
      </div>
    </>
  );
}
