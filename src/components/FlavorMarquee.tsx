import { ScrollVelocityContainer, ScrollVelocityRow } from "./ui/scroll-velocity-text";
import { FLAVORS, img } from "@/data/flavors";

/** Built on the 21st.dev Scroll Velocity Text marquee — speeds up and reverses with your scroll. */
export function FlavorMarquee() {
  return (
    <section className="relative overflow-hidden bg-cream py-[10vh]" aria-label="Flavours">
      <ScrollVelocityContainer className="space-y-2 md:space-y-4">
        <ScrollVelocityRow baseVelocity={3} direction={1}>
          {FLAVORS.map((f) => (
            <span key={f.key} className="mx-[2vw] inline-flex items-center gap-[3vw]">
              <span className="font-display text-[17vw] font-bold leading-none md:text-[11vw]" style={{ color: f.deep }}>
                {f.italian}
              </span>
              <img src={img(`${f.key}-cup`, 1000)} alt="" aria-hidden className="h-[13vw] w-[13vw] rounded-full object-cover md:h-[8vw] md:w-[8vw]" />
            </span>
          ))}
        </ScrollVelocityRow>
        <ScrollVelocityRow baseVelocity={3} direction={-1}>
          {["Slow churned", "Small batch", "Picked at peak", "Served with verve"].map((w, i) => (
            <span key={w} className="mx-[2vw] inline-flex items-center gap-[3vw]">
              <span
                className="text-outline font-display text-[17vw] font-bold leading-none md:text-[11vw]"
                style={{ ["--stroke" as string]: FLAVORS[i].deep }}
              >
                {w}
              </span>
              <span className="font-display text-[8vw] md:text-[5vw]" style={{ color: FLAVORS[i].stage }}>✦</span>
            </span>
          ))}
        </ScrollVelocityRow>
      </ScrollVelocityContainer>
    </section>
  );
}
