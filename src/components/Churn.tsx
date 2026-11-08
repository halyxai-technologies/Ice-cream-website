import { useLayoutEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { img } from "@/data/flavors";

// Zoom-parallax layout (inspired by 21st.dev "Zoom Parallax"): the centre tile
// is exactly 1/4 of the viewport so a 4× scale lands it full-bleed.
const TILES = [
  { src: "churn", alt: "Strawberry gelato churning", cls: "w-[25vw] h-[25vh]", scale: 4 },
  { src: "shop", alt: "Brio shop front", cls: "w-[35vw] h-[30vh] -top-[30vh] left-[5vw]", scale: 5 },
  { src: "pistachio-flatlay", alt: "Pistachio ingredients", cls: "w-[20vw] h-[45vh] -top-[10vh] -left-[25vw]", scale: 6 },
  { src: "strawberry-ledge", alt: "Strawberry gelato on a sunny ledge", cls: "w-[25vw] h-[25vh] left-[27.5vw]", scale: 5 },
  { src: "blueberry-farm", alt: "Blueberry hills", cls: "w-[20vw] h-[25vh] top-[27.5vh] left-[5vw]", scale: 6 },
  { src: "mango-flatlay", alt: "Mango arrangement", cls: "w-[30vw] h-[25vh] top-[27.5vh] -left-[22.5vw]", scale: 8 },
  { src: "strawberry-flatlay", alt: "Strawberries arranged", cls: "w-[15vw] h-[15vh] top-[22.5vh] left-[25vw]", scale: 9 },
];

export function Churn() {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: 0.6 },
      });
      gsap.utils.toArray<HTMLElement>(".zp-tile").forEach((el, i) => {
        tl.to(el, { scale: TILES[i].scale, duration: 1 }, 0);
      });
      tl.to(".zp-intro", { opacity: 0, y: -60, duration: 0.18 }, 0.04)
        .fromTo(".zp-tile-inner", { borderRadius: 28 }, { borderRadius: 0, duration: 0.6 }, 0.3)
        .fromTo(".zp-head > *", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.25, ease: "power2.out" }, 0.82)
        .fromTo(".zp-shade", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.78)
        .to({}, { duration: 0.35 });

      gsap.from(".zp-intro > *", {
        y: 50, opacity: 0, stagger: 0.1, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="churn" className="relative h-[320vh] bg-cream">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <div className="zp-intro absolute inset-x-0 top-[12vh] z-10 flex flex-col items-center text-center md:top-[9vh]">
          <span className="eyebrow text-ink-soft">The churn</span>
          <h2 className="mt-2 font-display text-[9vw] font-semibold leading-none md:text-[3.4vw]">
            Where it all <span className="font-serif font-normal italic text-strawberry-deep">comes together</span>
          </h2>
        </div>
        {TILES.map((t) => (
          <div key={t.src} className="zp-tile absolute inset-0 flex items-center justify-center will-change-transform">
            <div className={`zp-tile-inner relative overflow-hidden rounded-[28px] ${t.cls}`}>
              <img src={img(t.src, t.scale >= 6 ? 1000 : 2000)} alt={t.alt} className="size-full object-cover" />
            </div>
          </div>
        ))}
        <div className="zp-shade pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-x-5 bottom-[10vh] text-cream md:inset-x-12">
          <div className="zp-head overflow-hidden">
            <p className="eyebrow mb-3">Every morning · 06:00</p>
          </div>
          <div className="zp-head overflow-hidden">
            <h3 className="font-display text-[15vw] font-bold leading-[0.85] md:text-[9vw]">Churned at dawn.</h3>
          </div>
          <div className="zp-head overflow-hidden">
            <h3 className="font-serif text-[13vw] italic leading-[0.95] md:text-[7.5vw]">Gone by dusk.</h3>
          </div>
          <div className="zp-head mt-5 max-w-lg overflow-hidden">
            <p className="text-lg text-cream/85">
              Our batch freezers run slow and cold, folding in less air so every spoon is dense, silky and loud with flavour.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
