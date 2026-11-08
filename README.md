# Brio Gelato — scroll-animated site

Vite + React + Tailwind v4 + GSAP (ScrollTrigger, SplitText) + Lenis.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run assets     # re-generate public/img + public/frames from Images/ and Videos/
```

## Sections
1. **Hero** – four cup panels spell B·R·I·O, then split apart into floating cards
2. **Flavour marquee** – 21st.dev *Scroll Velocity Text*
3. **Four flavour chapters** (pinned, 3 acts each) – farm → ingredient flat-lay (unique reveal shape per flavour) → product film scrubbed frame-by-frame on a canvas
4. **The churn** – zoom parallax into the churning machine
5. **Kinetic line** – 21st.dev *Text Convergence* (adapted)
6. **Menu** – pinned horizontal scroll, velocity-skewed cards
7. **Visit** – zoom through a giant BRIO cut-out onto the shop front
8. **Footer** – drip edge, newsletter, wobbling wordmark

Fonts: **Fredoka** (matches the rounded logo), **Nunito** (body), **Instrument Serif** italic (accents).

Copy, prices, address and opening hours are placeholders — edit `src/data/flavors.ts`, `src/components/Visit.tsx` and `src/components/Footer.tsx`.
