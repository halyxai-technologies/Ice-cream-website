import { useLayoutEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { FLAVORS } from "@/data/flavors";

export function ChapterIntro() {
  const root = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const split = SplitText.create(".ci-head", { type: "lines,words", mask: "lines" });
      gsap.from(split.words, {
        yPercent: 110, stagger: 0.04, duration: 1.1, ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
      gsap.from(".ci-chip", {
        scale: 0, rotate: () => gsap.utils.random(-30, 30), stagger: 0.08, duration: 0.9, ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 60%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative bg-cream px-5 pb-[16vh] pt-[8vh] md:px-[7vw]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <h2 className="ci-head font-display text-[13vw] font-bold leading-[0.9] md:text-[6.6vw]">
          Four flavours.
          <br />
          Four corners
          <br />
          of the <span className="font-serif font-normal italic text-pistachio-deep">earth.</span>
        </h2>
        <div className="flex max-w-sm flex-col gap-5">
          <p className="text-lg text-ink-soft">
            Each cup starts somewhere real. Scroll through each one, from the field to the flat lay to the final drizzle.
          </p>
          <div className="flex flex-wrap gap-2">
            {FLAVORS.map((f) => (
              <span key={f.key} className="ci-chip rounded-full px-4 py-2 font-display font-semibold" style={{ background: f.light, color: f.deep }}>
                {f.index} {f.italian}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
