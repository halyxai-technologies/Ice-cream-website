import { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { FLAVORS } from "@/data/flavors";

const LETTERS = ["B", "R", "I", "O"];

export function Footer() {
  const root = useRef<HTMLElement>(null);
  const [joined, setJoined] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".ft-letter", {
        yPercent: 100,
        rotate: (i) => [-12, 8, -6, 14][i],
        stagger: 0.08,
        ease: "elastic.out(1, 0.6)",
        duration: 1.6,
        scrollTrigger: { trigger: ".ft-word", start: "top 92%" },
      });
      gsap.from(".ft-col", {
        y: 40, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 75%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  const wobble = (e: React.MouseEvent<HTMLSpanElement>, i: number) =>
    gsap.fromTo(
      e.currentTarget,
      { yPercent: 0, rotate: 0 },
      { keyframes: [{ yPercent: -14, rotate: i % 2 ? 6 : -6, duration: 0.22 }, { yPercent: 0, rotate: 0, duration: 0.9, ease: "elastic.out(1.2, 0.35)" }] },
    );

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink text-cream">
      {/* drip edge */}
      <svg viewBox="0 0 1440 90" preserveAspectRatio="none" className="absolute inset-x-0 -top-px h-12 w-full md:h-20" aria-hidden>
        <path
          fill="#fff6ec"
          d="M0 0h1440v28c-38 0-46 52-78 52s-30-44-70-44-44 22-84 22-40-30-86-30-38 58-80 58-40-58-84-58-50 26-92 26-46-40-90-40-38 50-76 50-42-34-84-34-46 18-88 18-48-34-90-34-34 46-76 46-48-46-90-46-40 26-80 26-46-18-74-18V0z"
        />
      </svg>

      <div className="mx-auto max-w-[1500px] px-5 pb-8 pt-32 md:px-12 md:pt-44">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="ft-col">
            <p className="eyebrow text-cream/60">The Brio letter</p>
            <h3 className="mt-3 max-w-sm font-display text-4xl font-semibold leading-tight">
              New flavours, first. <span className="font-serif font-normal italic text-strawberry-light">Once a season.</span>
            </h3>
            <form
              className="mt-6 flex max-w-md items-center rounded-full bg-white/10 p-1.5 pl-5 ring-1 ring-white/15 focus-within:ring-strawberry-light"
              onSubmit={(e) => {
                e.preventDefault();
                setJoined(true);
              }}
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent font-display text-cream placeholder:text-cream/40 focus:outline-none"
              />
              <button data-magnetic className="rounded-full bg-strawberry-light px-5 py-3 font-display font-semibold text-strawberry-deep transition-colors hover:bg-cream">
                {joined ? "Grazie ✦" : "Join"}
              </button>
            </form>
          </div>
          {[
            ["Visit", ["Via dei Gelatai 12", "Old Town", "Open daily 11–23"]],
            ["Flavours", FLAVORS.map((f) => `${f.italian} · ${f.origin.split(",")[0]}`)],
            ["Follow", ["Instagram", "TikTok", "Pinterest"]],
          ].map(([h, items]) => (
            <div key={h as string} className="ft-col">
              <p className="eyebrow text-cream/60">{h as string}</p>
              <ul className="mt-4 space-y-2 font-display text-lg">
                {(items as string[]).map((t) => (
                  <li key={t}>
                    <a href="#" className="transition-colors hover:text-strawberry-light">{t}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="ft-word mt-20 flex select-none justify-between overflow-hidden leading-none">
          {LETTERS.map((l, i) => (
            <span
              key={l}
              onMouseEnter={(e) => wobble(e, i)}
              className="ft-letter inline-block font-display text-[33vw] font-bold leading-[0.8] md:text-[30vw]"
              style={{ color: FLAVORS[i].light }}
              data-cursor={FLAVORS[i].italian}
            >
              {l}
            </span>
          ))}
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-sm text-cream/50 md:flex-row">
          <span>© {new Date().getFullYear()} Brio Gelato. Made slowly, eaten quickly.</span>
          <span className="font-display tracking-[0.3em]">GELATO · CHURNED WITH VERVE</span>
        </div>
      </div>
    </footer>
  );
}
