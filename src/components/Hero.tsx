import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { FLAVORS } from "@/data/flavors";

const PANEL_BG: Record<string, string> = {
  pistachio: "#b9cc8f",
  strawberry: "#dc5d7c",
  mango: "#f4ac51",
  blueberry: "#9c8ce2",
};
const LETTERS = ["B", "R", "I", "O"];

/**
 * Four flavour panels, one cup each, spelling BRIO across the top.
 * Scrolling pulls the panels apart into floating cards before the manifesto slides over.
 */
export function Hero() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    let intro: () => void = () => {};
    const ctx = gsap.context(() => {
      gsap.set(".hero-letter", { yPercent: 115 });
      gsap.set(".hero-img", { scale: 1.18, yPercent: 8 });
      gsap.set(".hero-ui", { opacity: 0, y: 30 });

      intro = () => void gsap
          .timeline()
          .to(".hero-img", { scale: 1, yPercent: 0, duration: 1.8, stagger: 0.08, ease: "expo.out" })
          .to(".hero-letter", { yPercent: 0, duration: 1.4, stagger: 0.09, ease: "elastic.out(1, 0.6)" }, 0.1)
          .to(".hero-ui", { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.5);
      window.addEventListener("brio:reveal", intro, { once: true });

      const mm = gsap.matchMedia();
      mm.add(
        { desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" },
        (c) => {
          const desktop = c.conditions?.desktop;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "+=70%",
              scrub: 0.6,
              pin: true,
            },
          });
          // fromTo + immediateRender:false so the intro reveal can't leave stale start values behind
          tl.fromTo(".hero-ui", { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.2, immediateRender: false }, 0)
            .to(
              ".hero-panel",
              {
                clipPath: desktop ? "inset(9% 7% 9% 7% round 36px)" : "inset(6% 6% 6% 6% round 26px)",
                yPercent: (i) => (desktop ? [-9, 7, -5, 11][i] : [-4, 4, -4, 4][i]),
                rotate: (i) => (desktop ? [-3, 2, -2, 3][i] : 0),
                duration: 0.6,
              },
              0,
            )
            .fromTo(".hero-letter", { yPercent: 0, scale: 1 }, { yPercent: 18, scale: 0.78, duration: 0.6, immediateRender: false }, 0)
            .fromTo(".hero-img", { scale: 1, yPercent: 0 }, { scale: 1.08, yPercent: 0, duration: 0.6, immediateRender: false }, 0);
        },
      );
    }, root);
    return () => {
      window.removeEventListener("brio:reveal", intro);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative h-[100svh] overflow-hidden bg-cream">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 md:grid-cols-4 md:grid-rows-1">
        {FLAVORS.map((f, i) => (
          <div
            key={f.key}
            className="hero-panel relative overflow-hidden will-change-transform"
            style={{ background: PANEL_BG[f.key], clipPath: "inset(0% 0% 0% 0% round 0px)" }}
            data-cursor={f.italian}
          >
            <div className={`absolute inset-x-0 z-10 flex justify-center overflow-hidden pb-[2%] md:top-[8%] ${i < 2 ? "top-[20%]" : "top-[7%]"}`}>
              <span
                className="hero-letter block font-display font-bold leading-[0.92] text-cream drop-shadow-[0_12px_30px_rgba(0,0,0,0.08)] text-[min(30vw,17vh)] md:text-[min(19vw,30vh)]"
              >
                {LETTERS[i]}
              </span>
            </div>
            <img
              src={`/img/hero-${f.key}.webp`}
              alt={`Brio ${f.name} gelato cup`}
              className={`hero-img absolute inset-x-0 bottom-0 w-full object-contain object-bottom md:h-[80%] ${i < 2 ? "h-[64%]" : "h-[74%]"}`}
              style={{
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 14%), linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, #000 14%), linear-gradient(to right, transparent 0%, #000 13%, #000 87%, transparent 100%)",
                maskComposite: "intersect",
                WebkitMaskComposite: "source-in",
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-4 md:inset-x-8 md:bottom-7">
        <div className="hero-ui rounded-[28px] bg-cream/85 px-5 py-4 backdrop-blur-md md:px-7 md:py-5">
          <p className="eyebrow text-ink-soft">Small-batch · Churned daily</p>
          <p className="mt-1 font-display text-2xl font-semibold leading-tight text-ink md:text-4xl">
            Gelato with <span className="font-serif font-normal italic text-strawberry-deep">verve.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
