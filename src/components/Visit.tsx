import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { img } from "@/data/flavors";

/**
 * The shop front is seen through a giant BRIO cut-out; scrolling zooms through the "I"
 * until you're standing on the street outside.
 */
export function Visit() {
  const root = useRef<HTMLElement>(null);
  const word = useRef<SVGTextElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const origin = () => {
        const t = word.current;
        if (!t) return "0 0";
        try {
          const b = t.getExtentOfChar(2); // the "I" — zooming into a stroke keeps the image filling the screen
          return `${b.x + b.width / 2} ${b.y + b.height * 0.55}`;
        } catch {
          const b = t.getBBox();
          return `${b.x + b.width / 2} ${b.y + b.height / 2}`;
        }
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          scrub: 0.7,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
      tl.to(".vs-copy", { opacity: 0, y: -30, duration: 0.15 }, 0.05)
        .fromTo(word.current, { scale: 1, svgOrigin: origin }, { scale: 60, svgOrigin: origin, duration: 1, ease: "power3.in" }, 0.1)
        .fromTo(".vs-photo", { scale: 1.45 }, { scale: 1, duration: 1.1, ease: "power2.out" }, 0.1)
        .to(".vs-mask", { opacity: 0, duration: 0.05 }, 1.05)
        .fromTo(".vs-card", { yPercent: 120, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, 1.1)
        .to({}, { duration: 0.3 });
    }, root);

    // the SVG measures glyphs, so remeasure once the display font is in
    document.fonts.ready.then(() => gsap.delayedCall(0.05, () => window.dispatchEvent(new Event("resize"))));
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="visit" className="relative h-[100svh] overflow-hidden bg-cream">
      <img src={img("shop")} alt="The Brio shop front on a cobbled street" className="vs-photo absolute inset-0 size-full object-cover will-change-transform" />

      <svg className="vs-mask absolute inset-0 size-full" aria-hidden>
        <defs>
          <mask id="brio-cutout" maskUnits="userSpaceOnUse">
            <rect width="100%" height="100%" fill="white" />
            <text
              ref={word}
              x="50%"
              y="54%"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="black"
              style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "min(31vw, 52vh)", letterSpacing: "-0.01em" }}
            >
              BRIO
            </text>
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="#fff6ec" mask="url(#brio-cutout)" />
      </svg>

      <div className="vs-copy pointer-events-none absolute inset-x-0 top-[14vh] flex flex-col items-center text-center">
        <span className="eyebrow text-ink-soft">Come say ciao</span>
        <p className="mt-2 font-display text-2xl font-semibold md:text-3xl">
          The little green shop with the <span className="font-serif font-normal italic text-strawberry-deep">pink awning</span>
        </p>
      </div>
      <p className="vs-copy pointer-events-none absolute inset-x-0 bottom-[12vh] text-center eyebrow text-ink-soft">Scroll to step inside</p>

      <div className="vs-card absolute inset-x-3 bottom-3 rounded-[36px] bg-cream/92 p-6 opacity-0 shadow-2xl backdrop-blur-xl md:inset-x-auto md:bottom-8 md:right-8 md:w-[460px] md:p-8">
        <span className="eyebrow text-ink-soft">Visit Brio</span>
        <h2 className="mt-2 font-display text-4xl font-bold leading-[0.95] text-pistachio-deep md:text-5xl">
          Vieni a <span className="font-serif font-normal italic text-strawberry-deep">trovarci.</span>
        </h2>
        <dl className="mt-6 grid grid-cols-2 gap-5 text-sm">
          <div>
            <dt className="eyebrow text-[10px] text-ink-soft">Address</dt>
            <dd className="mt-1 font-display text-base font-semibold leading-snug">Via dei Gelatai 12<br />Old Town</dd>
          </div>
          <div>
            <dt className="eyebrow text-[10px] text-ink-soft">Open daily</dt>
            <dd className="mt-1 font-display text-base font-semibold leading-snug">11:00 — 23:00<br />Fri–Sat till late</dd>
          </div>
        </dl>
        <div className="mt-6 flex flex-wrap gap-2">
          <a href="#" data-magnetic className="rounded-full bg-ink px-6 py-3 font-display font-semibold text-cream transition-colors hover:bg-pistachio-deep">
            Get directions
          </a>
          <a href="#menu" data-magnetic className="rounded-full border-2 border-ink px-6 py-3 font-display font-semibold text-ink transition-colors hover:bg-ink hover:text-cream">
            Order pickup
          </a>
        </div>
      </div>
    </section>
  );
}
