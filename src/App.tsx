import { useEffect } from "react";
import { initSmoothScroll, ScrollTrigger } from "@/lib/gsap";
import { FLAVORS } from "@/data/flavors";
import { Nav } from "@/components/Nav";
import { Cursor } from "@/components/Cursor";
import { Hero } from "@/components/Hero";
import { FlavorMarquee } from "@/components/FlavorMarquee";
import { ChapterIntro } from "@/components/ChapterIntro";
import { FlavorChapter } from "@/components/FlavorChapter";
import { Churn } from "@/components/Churn";
import { Menu } from "@/components/Menu";
import { Visit } from "@/components/Visit";
import { Footer } from "@/components/Footer";
import TextConvergence from "@/components/ui/text-convergence";

export default function App() {
  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    initSmoothScroll();
    // no loading screen: play the hero + nav entrance straight away
    requestAnimationFrame(() => window.dispatchEvent(new Event("brio:reveal")));
    document.fonts.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <FlavorMarquee />
        <ChapterIntro />
        {FLAVORS.map((f, i) => (
          <FlavorChapter key={f.key} flavor={f} first={i === 0} />
        ))}
        <Churn />
        <TextConvergence charRotation={26} className="bg-cream" textClassName="text-ink">
          <span>Slow</span> <span>churned.</span> <span className="text-pistachio-deep">Small</span>{" "}
          <span className="text-pistachio-deep">batch.</span> <span>Picked</span> <span>at</span>{" "}
          <span className="text-strawberry-deep">peak.</span> <span>Served</span> <span>with</span>{" "}
          <span className="font-serif font-normal italic text-mango-deep">brio.</span>
        </TextConvergence>
        <Menu />
        <Visit />
      </main>
      <Footer />
      <Cursor />
      <div className="grain" aria-hidden />
    </>
  );
}
