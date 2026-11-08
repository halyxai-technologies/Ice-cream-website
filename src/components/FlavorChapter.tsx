import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { FRAME_COUNT, frameSrc, img, type Flavor, type Reveal } from "@/data/flavors";

const REVEALS: Record<Reveal, [string, string]> = {
  circle: ["circle(0% at 50% 50%)", "circle(80% at 50% 50%)"],
  inset: ["inset(50% 50% 50% 50% round 48px)", "inset(0% 0% 0% 0% round 0px)"],
  diagonal: ["polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)", "polygon(0% 0%, 210% 0%, 0% 210%, 0% 0%)"],
  ellipse: ["ellipse(0% 0% at 50% 100%)", "ellipse(150% 130% at 50% 100%)"],
};
// the film rises like a dome of gelato
const FILM_FROM = "inset(100% 0% 0% 0% round 50vw 50vw 0vw 0vw)";
const FILM_TO = "inset(0% 0% 0% 0% round 0vw 0vw 0vw 0vw)";

/** Lazily-loaded frame sequence painted to a canvas with object-fit: cover semantics. */
function createSequence(canvas: HTMLCanvasElement, flavor: Flavor["key"], stage: string) {
  const ctx = canvas.getContext("2d", { alpha: false })!;
  const frames: (HTMLImageElement | null)[] = Array(FRAME_COUNT).fill(null);
  let current = 0;
  let requested = false;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    draw(current);
  };

  const pick = (i: number) => {
    if (frames[i]) return frames[i];
    for (let d = 1; d < FRAME_COUNT; d++) {
      if (frames[i - d]) return frames[i - d];
      if (frames[i + d]) return frames[i + d];
    }
    return null;
  };

  function draw(i: number) {
    current = i;
    const im = pick(i);
    if (!im || !canvas.width) return;
    const cw = canvas.width, ch = canvas.height;
    if (cw >= ch * 0.9) {
      // landscape: plain object-fit cover
      const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight);
      const w = im.naturalWidth * s, h = im.naturalHeight * s;
      ctx.drawImage(im, (cw - w) / 2, (ch - h) / 2, w, h);
      return;
    }
    // portrait: keep the cup a sensible size and feather the film into the stage colour
    const s = (cw * 1.9) / im.naturalWidth;
    const w = im.naturalWidth * s, h = im.naturalHeight * s;
    const x = (cw - w) / 2, y = ch * 0.53 - h / 2;
    ctx.fillStyle = stage;
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(im, x, y, w, h);
    const fade = h * 0.22;
    const transparent = stage + "00";
    let g = ctx.createLinearGradient(0, y, 0, y + fade);
    g.addColorStop(0, stage); g.addColorStop(1, transparent);
    ctx.fillStyle = g; ctx.fillRect(0, y - 1, cw, fade + 1);
    g = ctx.createLinearGradient(0, y + h - fade, 0, y + h);
    g.addColorStop(0, transparent); g.addColorStop(1, stage);
    ctx.fillStyle = g; ctx.fillRect(0, y + h - fade, cw, fade + 1);
  }

  const loadOne = (i: number) =>
    new Promise<void>((res) => {
      const im = new Image();
      im.decoding = "async";
      im.onload = () => {
        frames[i] = im;
        if (Math.abs(i - current) < 3 || i === 0) draw(current);
        res();
      };
      im.onerror = () => res();
      im.src = frameSrc(flavor, i);
    });

  /** Coarse-to-fine: every 8th frame first so scrubbing works immediately, then fill the gaps. */
  const load = async () => {
    if (requested) return;
    requested = true;
    await loadOne(0);
    const order: number[] = [];
    for (const step of [8, 4, 2, 1])
      for (let i = 0; i < FRAME_COUNT; i += step) if (!order.includes(i) && i !== 0) order.push(i);
    const queue = [...order];
    const worker = async () => {
      while (queue.length) await loadOne(queue.shift()!);
    };
    await Promise.all(Array.from({ length: 6 }, worker));
  };

  return { draw, resize, load, prime: () => loadOne(0) };
}

export function FlavorChapter({ flavor: f, first }: { flavor: Flavor; first?: boolean }) {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const seq = createSequence(canvas.current!, f.key, f.stage);
    seq.resize();
    if (first) seq.load();
    else seq.prime();

    const ctx = gsap.context(() => {
      // start pulling frames a couple of screens before the chapter arrives
      ScrollTrigger.create({ trigger: root.current, start: "top bottom+=200%", once: true, onEnter: () => seq.load() });

      const title = SplitText.create(".ch-title", { type: "chars", mask: "chars" });
      gsap.from(title.chars, {
        yPercent: 110,
        rotate: 8,
        stagger: 0.04,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 55%", toggleActions: "play none none reverse" },
      });
      gsap.from(".ch-a-meta > *", {
        y: 30, opacity: 0, stagger: 0.08, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 45%", toggleActions: "play none none reverse" },
      });
      // the farm drifts into place as the chapter slides up
      gsap.fromTo(".ch-farm img", { yPercent: -12 }, {
        yPercent: 0, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
      });

      const [revFrom, revTo] = REVEALS[f.reveal];
      gsap.set(".ch-flat", { clipPath: revFrom });
      gsap.set(".ch-film", { clipPath: FILM_FROM });
      gsap.set([".ch-b > *", ".ch-c-item"], { opacity: 0, y: 40 });
      gsap.set(".ch-cap", { opacity: 0, yPercent: 60 });

      const play = { frame: 0 };
      let lastCap = -1;
      const caps = gsap.utils.toArray<HTMLElement>(".ch-cap");
      const showCap = (n: number) => {
        if (n === lastCap) return;
        caps.forEach((c, i) =>
          gsap.to(c, { opacity: i === n ? 1 : 0, yPercent: i === n ? 0 : i < n ? -60 : 60, duration: 0.6, ease: "expo.out", overwrite: true }),
        );
        lastCap = n;
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 4.6}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onRefresh: () => seq.resize(),
        },
      });

      // ACT I — origin
      tl.fromTo(".ch-farm img", { scale: 1.25 }, { scale: 1.02, duration: 3 }, 0)
        .to(".ch-a", { yPercent: -18, opacity: 0, duration: 0.8, ease: "power2.in" }, 1.6)
        .to(".ch-rail-fill", { scaleX: 1 / 3, duration: 2.4 }, 0)

        // ACT II — what goes in
        // fromTo with explicit strings: Chrome normalises clip-path when read back
        // (e.g. "inset(50% 50% 50% 50%)" -> "inset(50%)"), which breaks number-by-number tweening
        .fromTo(".ch-flat", { clipPath: revFrom }, { clipPath: revTo, duration: 1.6, ease: "power2.inOut" }, 2)
        .fromTo(".ch-flat img", { scale: 1.35, rotate: -4 }, { scale: 1, rotate: 0, duration: 2.6 }, 2)
        .to(".ch-b > *", { opacity: 1, y: 0, stagger: 0.12, duration: 0.6, ease: "power2.out" }, 3.1)
        .to(".ch-rail-fill", { scaleX: 2 / 3, duration: 2.6 }, 2.4)
        .to(".ch-b > *", { opacity: 0, y: -40, stagger: 0.06, duration: 0.5, ease: "power2.in" }, 4.7)

        // ACT III — the cup, scrubbed frame by frame
        .fromTo(".ch-film", { clipPath: FILM_FROM }, { clipPath: FILM_TO, duration: 1.3, ease: "power2.inOut" }, 5)
        .fromTo(".ch-film canvas", { scale: 1.2 }, { scale: 1, duration: 1.6, ease: "power2.out" }, 5)
        .to(".ch-c-item", { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: "power2.out" }, 5.8)
        .to(
          play,
          {
            frame: FRAME_COUNT - 1,
            duration: 4.4,
            onUpdate: () => {
              const fr = Math.round(play.frame);
              seq.draw(fr);
              if (counter.current) counter.current.textContent = String(fr + 1).padStart(3, "0");
              const p = fr / (FRAME_COUNT - 1);
              showCap(p < 0.3 ? 0 : p < 0.62 ? 1 : 2);
            },
          },
          5.6,
        )
        .to(".ch-rail-fill", { scaleX: 1, duration: 4.4 }, 5.6)
        .to({}, { duration: 0.4 });

      tl.eventCallback("onUpdate", () => {
        if (tl.time() < 5.5 && lastCap !== -1) {
          caps.forEach((c) => gsap.to(c, { opacity: 0, duration: 0.3, overwrite: true }));
          lastCap = -1;
        }
      });
    }, root);

    const onResize = () => seq.resize();
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      ctx.revert();
    };
  }, [f, first]);

  const isEven = Number(f.index) % 2 === 0;

  return (
    <section
      ref={root}
      id={first ? "flavours" : undefined}
      className="relative h-[100svh] overflow-hidden"
      style={{ background: f.stage, ["--deep" as string]: f.deep, ["--light" as string]: f.light }}
      aria-label={`${f.name} — from ${f.origin}`}
    >
      {/* ACT I — farm */}
      <div className="ch-farm absolute inset-0">
        <img src={img(`${f.key}-farm`)} alt={`${f.name} harvest, ${f.origin}`} className="size-full object-cover will-change-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-black/25" />
      </div>
      <div className="ch-a absolute inset-0 flex flex-col justify-end p-5 pb-28 md:p-12 md:pb-32">
        <div className="ch-a-meta mb-4 flex flex-wrap items-center gap-3 text-cream">
          <span className="rounded-full border border-cream/50 px-3 py-1 font-display text-sm font-semibold">{f.index} / 04</span>
          <span className="eyebrow">Origin · {f.origin}</span>
          <span className="eyebrow hidden opacity-70 md:inline">{f.coords}</span>
        </div>
        <h2 className="ch-title font-display text-[16.5vw] font-bold leading-[0.82] tracking-[-0.02em] text-cream md:text-[15vw]">
          {f.italian}
        </h2>
        <div className="ch-a-meta mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg leading-snug text-cream/90 md:text-xl">{f.originLine}</p>
          <span className="eyebrow text-cream/80">Keep scrolling — follow it to the cup ↓</span>
        </div>
      </div>

      {/* ACT II — flat lay */}
      <div className="ch-flat absolute inset-0" style={{ background: f.light }}>
        <img src={img(`${f.key}-flatlay`)} alt={`${f.name} ingredients`} className="size-full object-cover will-change-transform" />
        <div className="ch-b absolute inset-0 flex flex-col items-center justify-center px-6 text-center" style={{ color: f.deep }}>
          <span className="eyebrow">What goes in</span>
          <h3 className="mt-3 max-w-[14ch] font-display text-[11vw] font-semibold leading-[0.95] md:text-[5.2vw]">{f.ingredientsLine}</h3>
          <ul className="mt-8 flex flex-col gap-3 md:flex-row md:gap-4">
            {f.ingredients.map((g) => (
              <li key={g.name} className="rounded-full bg-cream/80 px-5 py-2.5 backdrop-blur-sm">
                <span className="font-display font-semibold">{g.name}</span>
                <span className="ml-2 font-serif text-lg italic opacity-80">{g.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ACT III — film */}
      <div className="ch-film absolute inset-0" style={{ background: f.stage }}>
        <canvas ref={canvas} className="absolute inset-0 size-full will-change-transform" aria-label={`${f.name} gelato film`} />
        <div
          className={`absolute inset-0 flex flex-col justify-between p-5 pb-28 pt-24 md:flex-row md:items-center md:p-12 ${isEven ? "md:flex-row-reverse" : ""}`}
        >
          <div className={`max-w-sm md:max-w-[25vw] ${isEven ? "md:text-right" : ""}`} style={{ color: f.deep }}>
            <p className="ch-c-item eyebrow">No. {f.index} · {f.origin}</p>
            <h3 className="ch-c-item mt-2 font-display text-[16vw] font-bold leading-[0.85] md:text-[4.9vw]">{f.name}</h3>
            <div className={`ch-c-item mt-5 flex flex-wrap gap-2 ${isEven ? "md:justify-end" : ""}`}>
              {f.notes.map((n) => (
                <span key={n} className="rounded-full border-2 px-3 py-1 font-display text-sm font-semibold" style={{ borderColor: f.deep }}>
                  {n}
                </span>
              ))}
            </div>
            <div className={`ch-c-item mt-6 hidden items-center gap-4 md:flex ${isEven ? "justify-end" : ""}`}>
              <span className="font-display text-3xl font-semibold">{f.price}</span>
              <a
                href="#menu"
                data-magnetic
                data-cursor="Scoop"
                className="rounded-full px-6 py-3 font-display font-semibold text-cream transition-transform hover:scale-105"
                style={{ background: f.deep }}
              >
                Add a cup
              </a>
            </div>
          </div>

          <div className={`relative h-24 md:h-40 md:w-[22vw] ${isEven ? "" : "md:text-right"}`} style={{ color: f.deep }}>
            {f.captions.map((c) => (
              <p key={c} className="ch-cap absolute inset-x-0 bottom-0 font-serif text-4xl italic leading-[1.02] md:top-0 md:bottom-auto md:text-[2.6vw]">
                {c}
              </p>
            ))}
          </div>
        </div>
        <div className="ch-c-item pointer-events-none absolute right-5 top-24 hidden font-display md:block text-xs font-semibold tracking-[0.3em] md:right-12 md:top-28" style={{ color: f.deep }}>
          FRAME <span ref={counter}>001</span> / {FRAME_COUNT}
        </div>
      </div>

      {/* chapter rail */}
      <div className="absolute inset-x-5 bottom-6 z-10 md:inset-x-12 md:bottom-8">
        <div className="mb-2 flex justify-between font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-cream mix-blend-difference">
          <span>Origin</span>
          <span>What goes in</span>
          <span>The cup</span>
        </div>
        <div className="h-[3px] overflow-hidden rounded-full bg-white/30">
          <div className="ch-rail-fill h-full origin-left scale-x-0 rounded-full bg-cream" />
        </div>
      </div>
    </section>
  );
}
