// 21st.dev — "Text Convergence" by hyperiux (Hyperiux Vault)
// https://21st.dev/@hyperiux/components/text-convergence
// Adapted for Brio: accepts rich children (coloured words survive SplitText),
// fixes the undefined `rootStyle` reference and actually applies the computed
// scroll distance to the pin.
"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { cn, prefersReducedMotion } from "@/lib/utils";

const BASE_SCROLL_VH = 650;
const MIN_SCROLL_VH = 380;
const MAX_SCROLL_VH = 1000;
const BASE_WORD_COUNT = 20;
const CHARACTER_Y_PERCENT_MIN = -200;
const CHARACTER_Y_PERCENT_MAX = 200;
const CHARACTER_EASE = "elastic.out(1,0.8)";
const REDUCED_MOTION_FACTOR = 0.25;

const getScrollVh = (text: string) => {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).length : 0;
  const calculated = BASE_SCROLL_VH * (words / BASE_WORD_COUNT);
  return Math.max(MIN_SCROLL_VH, Math.min(calculated, MAX_SCROLL_VH));
};

export interface TextConvergenceProps {
  children: ReactNode;
  backgroundColor?: string;
  textColor?: string;
  charRotation?: number;
  className?: string;
  textClassName?: string;
}

export default function TextConvergence({
  children,
  backgroundColor,
  textColor,
  charRotation = 20,
  className = "",
  textClassName = "",
}: TextConvergenceProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);

  useLayoutEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;
    const scrollVh = getScrollVh(textElement.textContent ?? "");

    const context = gsap.context(() => {
      const split = SplitText.create(textElement, { type: "chars,words" });
      const charScale = prefersReducedMotion() ? REDUCED_MOTION_FACTOR : 1;

      const scrollTween = gsap.to(textElement, {
        xPercent: -100,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${(window.innerHeight * scrollVh) / 100}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      split.chars.forEach((character) => {
        gsap.from(character, {
          yPercent: gsap.utils.random(CHARACTER_Y_PERCENT_MIN, CHARACTER_Y_PERCENT_MAX) * charScale,
          rotation: gsap.utils.random(-charRotation, charRotation) * charScale,
          ease: CHARACTER_EASE,
          scrollTrigger: {
            trigger: character,
            containerAnimation: scrollTween,
            start: "left 100%",
            end: "left 30%",
            scrub: 0.4,
          },
        });
      });
    }, sectionRef);

    ScrollTrigger.refresh();
    return () => context.revert();
  }, [charRotation]);

  return (
    <div
      ref={sectionRef}
      className={cn("relative overflow-hidden", className)}
      style={backgroundColor ? { backgroundColor } : undefined}
    >
      <div className="flex h-screen items-center">
        <p
          ref={textRef}
          className={cn(
            "flex w-max gap-[4vw] whitespace-nowrap pl-[100%] font-display font-semibold leading-[1.1] tracking-tight",
            "text-[17vw] md:text-[11vw]",
            textClassName,
          )}
          style={textColor ? { color: textColor } : undefined}
        >
          {children}
        </p>
      </div>
    </div>
  );
}
