import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { FLAVORS, img } from "@/data/flavors";

/** Horizontal, pinned menu. Cards lean into the direction of travel based on scroll velocity. */
export function Menu() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const distance = () => (track.current ? track.current.scrollWidth - window.innerWidth : 0);
      const skew = gsap.quickTo(".mn-card", "skewX", { duration: 0.5, ease: "power3" });
      const move = gsap.to(track.current, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.7,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => skew(gsap.utils.clamp(-8, 8, self.getVelocity() / -300)),
        },
      });

      gsap.utils.toArray<HTMLElement>(".mn-card").forEach((card) => {
        gsap.fromTo(
          card.querySelector("img"),
          { xPercent: -12, scale: 1.15 },
          {
            xPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: move, start: "left right", end: "right left", scrub: true },
          },
        );
        gsap.from(card, {
          rotate: gsap.utils.random(-10, 10),
          yPercent: gsap.utils.random(10, 30),
          ease: "power2.out",
          scrollTrigger: { trigger: card, containerAnimation: move, start: "left 110%", end: "left 55%", scrub: true },
        });
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="menu" className="relative h-[100svh] overflow-hidden bg-milk">
      <div ref={track} className="flex h-full w-max items-center gap-[4vw] pl-5 pr-[10vw] md:pl-12">
        <div className="flex w-[82vw] shrink-0 flex-col justify-center md:w-[36vw]">
          <span className="eyebrow text-ink-soft">The menu · four cups</span>
          <h2 className="mt-4 font-display text-[16vw] font-bold leading-[0.85] md:text-[7.5vw]">
            Pick your <span className="font-serif font-normal italic text-mango-deep">brio.</span>
          </h2>
          <p className="mt-6 max-w-sm text-lg text-ink-soft">
            One scoop, two scoops, or the whole spectrum. Every cup is filled to order and finished with its own topping.
          </p>
          <p className="mt-10 font-display text-sm font-semibold uppercase tracking-[0.3em] text-ink/60">Scroll sideways →</p>
        </div>

        {FLAVORS.map((f) => (
          <article
            key={f.key}
            className="mn-card group relative h-[68svh] w-[78vw] shrink-0 overflow-hidden rounded-[40px] will-change-transform md:h-[72vh] md:w-[30vw]"
            style={{ background: f.light }}
            data-cursor={f.price}
          >
            <img
              src={img(`${f.key}-cup`)}
              alt={`Brio ${f.name} cup`}
              className="absolute inset-0 size-full object-cover transition-[filter] duration-700 group-hover:saturate-[1.2]"
            />
            <div className="absolute inset-x-0 top-0 flex items-start justify-between p-6" style={{ color: f.deep }}>
              <span className="font-display text-sm font-semibold tracking-[0.25em]">No. {f.index}</span>
              <span className="rounded-full bg-cream/85 px-4 py-1.5 font-display font-semibold backdrop-blur">{f.price}</span>
            </div>
            <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[30px] bg-cream/90 p-3 pl-6 backdrop-blur-md">
              <div>
                <h3 className="font-display text-2xl font-semibold leading-tight" style={{ color: f.deep }}>
                  {f.italian}
                </h3>
                <p className="text-sm text-ink-soft">{f.notes.join(" · ")}</p>
              </div>
              <button
                className="grid size-12 place-items-center rounded-full font-display text-2xl text-cream transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-90 group-hover:scale-110"
                style={{ background: f.deep }}
                aria-label={`Add ${f.name}`}
              >
                +
              </button>
            </div>
          </article>
        ))}

        <article className="mn-card relative h-[68svh] w-[78vw] shrink-0 overflow-hidden rounded-[40px] md:h-[72vh] md:w-[44vw]" data-cursor="All four">
          <img src={img("strawberry-ledge")} alt="Brio gelato in the sun" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute inset-x-6 bottom-6 text-cream md:inset-x-10 md:bottom-10">
            <p className="eyebrow">Can't choose?</p>
            <h3 className="mt-2 font-display text-5xl font-bold leading-[0.9] md:text-7xl">
              Il Quattro.
            </h3>
            <p className="mt-3 max-w-xs text-cream/85">A little of all four in one cup, finished with every topping. €7.90</p>
          </div>
        </article>
      </div>
    </section>
  );
}
