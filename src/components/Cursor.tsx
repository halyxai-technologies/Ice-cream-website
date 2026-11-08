import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { isTouch } from "@/lib/utils";

/** Soft scoop-shaped cursor: a dot plus a lagging blob that swells into a label over [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const blob = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (isTouch()) return;
    document.documentElement.classList.add("has-cursor");
    const xDot = gsap.quickTo(dot.current, "x", { duration: 0.08 });
    const yDot = gsap.quickTo(dot.current, "y", { duration: 0.08 });
    const xBlob = gsap.quickTo(blob.current, "x", { duration: 0.55, ease: "power3" });
    const yBlob = gsap.quickTo(blob.current, "y", { duration: 0.55, ease: "power3" });

    let active: Element | null = null;
    let px = -100, py = -100;
    const move = (e: PointerEvent) => {
      px = e.clientX; py = e.clientY;
      xDot(px); yDot(py); xBlob(px); yBlob(py);
      update(e.target as Element);
    };
    // content moves under a still pointer while scrolling, so re-test what's beneath it
    const onScroll = () => update(document.elementFromPoint(px, py));
    const update = (target: Element | null) => {
      const t = target?.closest?.("[data-cursor], a, button, [data-magnetic]") ?? null;
      if (t === active) return;
      active = t;
      const text = t?.getAttribute("data-cursor");
      if (label.current) label.current.textContent = text ?? "";
      gsap.to(blob.current, {
        scale: text ? 1 : t ? 0.45 : 0.22,
        backgroundColor: text ? "rgba(255,246,236,0.92)" : "rgba(36,22,58,0.12)",
        duration: 0.5,
        ease: "expo.out",
      });
      gsap.to(label.current, { opacity: text ? 1 : 0, duration: 0.3 });
      gsap.to(dot.current, { scale: t ? 0 : 1, duration: 0.3 });
    };

    // magnetic pull for CTAs
    const magnets = Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    const handlers = magnets.map((el) => {
      const mm = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.35, duration: 0.6, ease: "power3" });
      };
      const ml = () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)" });
      el.addEventListener("pointermove", mm);
      el.addEventListener("pointerleave", ml);
      return () => { el.removeEventListener("pointermove", mm); el.removeEventListener("pointerleave", ml); };
    });

    window.addEventListener("pointermove", move);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      handlers.forEach((h) => h());
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[95] hidden [@media(hover:hover)]:block" aria-hidden>
      <div ref={blob} className="absolute -left-12 -top-12 grid size-24 scale-[0.22] place-items-center rounded-full bg-ink/10 backdrop-blur-[2px]">
        <span ref={label} className="font-display text-sm font-semibold text-ink opacity-0" />
      </div>
      <div ref={dot} className="absolute -left-1 -top-1 size-2 rounded-full bg-ink" />
    </div>
  );
}
