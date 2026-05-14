# Build Log

## Sprint 1 — Project init + design tokens + UI primitives
Date: 2026-05-14
Status: COMPLETE — `npm run build` exits 0, `npm run lint` exits 0.

### Shipped
- Next.js project bootstrapped at `C:\dev\한글교수법\` (App Router, TypeScript, Tailwind v4, Turbopack, ESLint).
- Pretendard via CDN `<link>` in `app/layout.tsx`, `<html lang="ko">`.
- Metadata block (title, description, openGraph, twitter) per BRIEF lines 238–251.
- Tailwind v4 `@theme` block in `app/globals.css` exposing `--color-background/foreground/yang/eum/muted/accent` and `--font-pretendard`. Generates `bg-yang`, `text-eum`, `font-pretendard`, etc.
- `prefers-reduced-motion` media query zeroes animations/transitions/scroll-behavior globally.
- `lib/cn.ts` — clsx + tailwind-merge helper.
- `components/ui/Container.tsx` — max-w-1100 wrapper, ref-forwarding, `cn()` merge.
- `components/ui/Button.tsx` — primary/secondary variants, default/lg sizes, focus-visible ring on `--color-yang`, ref-forwarding.
- `app/page.tsx` — placeholder hero proving font + colors + both Button variants render.
- `README.md` — minimal stub with run commands and 12-phase progress checklist.
- Deps installed: `framer-motion`, `lucide-react`, `clsx`, `tailwind-merge`.

### Deviations from brief
- **Next.js version:** Brief said "Next.js 15" but instructed to run `create-next-app@latest`. Latest now installs **Next.js 16.2.6** (stable). App Router contracts and `--turbopack` flag are unchanged. Flagging for Architect — if 15.x is required (e.g. for a known plugin compatibility), pin in `package.json` and reinstall.
- **Korean dir + npm name conflict:** `create-next-app` rejects the project name "한글교수법" because npm requires URL-friendly package names. Worked around by creating into `/c/dev/hangeul-temp` (ASCII), moving all files into `/c/dev/한글교수법/`, deleting the temp dir, and renaming `package.json` → `"name": "hangeul-teaching"`. The directory itself is unchanged. No other Korean-path issues hit during install/build/lint.
- **Container empty interface lint error:** ESLint flagged `interface ContainerProps extends HTMLAttributes<HTMLDivElement> {}` as `no-empty-object-type`. Converted to `type ContainerProps = HTMLAttributes<HTMLDivElement>;` — equivalent, lint-clean.

### Build/lint output
- `npm run build` — compiled in 2.5s, TS pass, all 4 static pages generated. One soft warning: `metadataBase property in metadata export is not set` — Next defaults to `http://localhost:3000` for resolving the `/og-image.png` URL in OpenGraph/Twitter cards. Will be resolved when production domain is known (or by adding `metadataBase: new URL("…")` in metadata).
- `npm run lint` — 0 errors, 0 warnings.

### Known Gaps (deferred — DO NOT FIX in this sprint)
- `/og-image.png` asset does not exist in `public/`. Path is referenced in metadata as `/og-image.png` per brief; needs to be added in a later sprint along with section visuals.
- shadcn/ui not initialized — locked decision, revisit when a section actually needs Dialog/Form/etc.
- `metadataBase` not set in metadata — will need production URL or staging URL.
- All 10 page sections (Hero, Problem, BigIdea, Vowels, ConsonantRoots, ThreeModes, ConsonantTree, Numbers, Founder, Footer) — Sprint 2+.
- All `visuals/*` SVG components — Sprint 2+.
- Email signup form (섹션 9) — later sprint.
- Lighthouse + full a11y audit — phase 11 of BRIEF.
- 2 moderate `npm audit` advisories from transitive deps — non-blocking, defer to dependency hygiene pass.
- `package.json` "name" field is `hangeul-teaching` (ASCII) because npm forbids non-URL-friendly names. The directory remains `한글교수법`. Acceptable for internal/private project; would need a real npm name if ever published.

### Files created/modified
- `app/layout.tsx` (rewrote)
- `app/globals.css` (rewrote)
- `app/page.tsx` (rewrote)
- `lib/cn.ts` (new)
- `components/ui/Container.tsx` (new)
- `components/ui/Button.tsx` (new)
- `README.md` (rewrote)
- `package.json` (renamed to `hangeul-teaching`, added 4 deps)

### Untouched scaffolding (left as create-next-app emitted)
- `app/favicon.ico`, `public/*.svg` (Next/Vercel logos), `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `postcss.config.mjs`, `next-env.d.ts`, `AGENTS.md`, `CLAUDE.md`, `.gitignore`. These can be cleaned up later but are harmless.

## Sprint 2 — Hero section + first SVG (FaceDiagram-lite)
Date: 2026-05-14
Status: BUILD COMPLETE — `npm run build` exits 0, `npm run lint` exits 0, `metadataBase` warning gone. Ready for Reviewer.

### Shipped
- `app/layout.tsx` — added `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")` per locked decision. Removes the build warning; production env will override.
- `components/visuals/FaceDiagram.tsx` — pure SVG, no animation, no client directive. 400×500 viewBox, `stroke-width=2`, `currentColor` w/ default `text-eum`; nose (ㅣ) + mouth (ㅡ) inside `<g className="text-yang">` so they read as yang accents. `role="img"`, `aria-label`, and inline `<title>` all carry the locked accessibility string. Forwards `className` for caller sizing.
- `components/sections/HeroSection.tsx` — `"use client"`. Semantic `<section id="hero" aria-label="히어로">` wrapping Container → 2-col grid (`grid-cols-1 lg:grid-cols-[1.2fr_1fr]`). On mobile the SVG stacks above text via `order-1`/`order-2` swap. Entry animation: parent `motion.div` with `staggerChildren: 0.1`, child variants fade up 24px over 0.7s (label → h1 → h2 → body → CTA row). SVG column fades in with 0.3s delay. ChevronDown lives in an `<a href="#problem">` absolute-positioned at bottom-center, animated with infinite y-bounce `[0, 8, 0]` over 1.6s.
- `app/page.tsx` — Sprint 1 placeholder gone. Renders `<HeroSection />` plus an empty `<section id="problem" className="min-h-screen" aria-hidden="true" />` purely as anchor target so the primary CTA scroll behavior is testable.

### Decisions taken inside the locked envelope
- **Stagger implementation:** Used Framer's `variants` + `staggerChildren` on the parent `motion.div` rather than per-child explicit delays. Same observable behavior, less duplication.
- **CTA anchor wrapping:** Wrapped `<Button variant="primary">` in `<a href="#problem">` per brief. Used `className="inline-flex"` on the anchor so it sits cleanly in the `flex-col sm:flex-row` row without becoming a block-width link. The button itself is rendered as `<button>` (Button is a button element) — semantically the anchor is the navigation, the button inside is purely visual. `aria-label` lives on the anchor where the navigation actually happens.
- **SVG column sizing:** Brief did not pin a width. Used `mx-auto w-2/3 max-w-[280px] lg:w-full lg:max-w-[420px]` so it stays restrained on phones and grows tastefully on desktop. Easy to tune later.
- **Eye stroke coordinates:** Brief specified "x=160 and x=240, length ~16px". Implemented as `(152→168, y=160)` and `(232→248, y=160)` so each stroke is 16px wide and centered on x=160/x=240.
- **Inner chin curve:** Skipped per brief's "optional — skip if it adds clutter". The face reads cleanly without it.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — compiled in 2.6s, TS pass, 4 static pages generated, **no `metadataBase` warning**.

### Known Gaps (deferred)
- `/og-image.png` still missing — same status as Sprint 1.
- Real `#problem` content — Sprint 3.
- Path-draw animation on FaceDiagram — Sprint 5 (per brief).
- Full BodyDiagram — Sprint 4+ (per brief).
- "방법론 영상 보기" URL — disabled until product owner provides one.
- shadcn/ui — still deferred.
- 2 moderate `npm audit` advisories — still deferred.

### Files created/modified
- `app/layout.tsx` (added metadataBase)
- `app/page.tsx` (rewrote to render HeroSection + #problem stub)
- `components/sections/HeroSection.tsx` (new)
- `components/visuals/FaceDiagram.tsx` (new)

## Sprint 3 — ProblemSection + BigIdeaSection + AnnotatedBodyDiagram
Date: 2026-05-14
Status: BUILD COMPLETE — `npm run build` exits 0, `npm run lint` exits 0. Ready for Reviewer.

### Shipped
- `app/globals.css` — added `--color-background-muted: #F2F0EC;` to `@theme` (one new token, generates `bg-background-muted` for BigIdea section background separation).
- `components/visuals/AnnotatedBodyDiagram.tsx` (new) — `"use client"`. 400×600 viewBox. 7 hover-active `motion.g` parts (head, nose, mouth, philtrum, torso, ㄱ-arm, ㅅ-legs) + 1 passive opposite arm (차렷, no label, no hover). Each interactive part has: shape(s), `<motion.text>` label, transparent `<rect>` hitbox covering shape+label. Hover variants: `partVariants` scales 1→1.08; `labelVariants(color)` scales 1→1.15 and fills with yang(#E85D3C) for ㅣ/ㄱ/ㅅ, eum(#2C3E62) for ㅡ/ㅁ/ㅇ; `neutralLabelVariants` for • (인중) — scale only, no color shift. Visual language consistent with Hero BodyDiagram (currentColor 2px stroke, eum body, yang/eum hardcoded for the small accent strokes inside hover groups). Legs are two strokes radiating from a single hip apex point (200, 324) → forming the ㅅ shape called out in the brief, distinct from Hero's two parallel rectangle legs. ㄱ-arm is two perpendicular strokes (vertical from shoulder up, then horizontal toward head) on viewBox left = mirror right arm = Korean salute convention. `role="img"`, `aria-label`, inline `<title>` all carry the locked accessibility string from brief §D.
- `components/sections/ProblemSection.tsx` (new) — `"use client"`. `<section id="problem">` replacing the Sprint 2 stub. `min-h-screen pt-40 pb-20 flex flex-col justify-center`, `<Container>`, parent `motion.div` with `whileInView` + `viewport={{ once: true, amount: 0.3 }}` + `staggerChildren: 0.18`. 4 plain `motion.p` lines + 1 emphasis line (`text-yang font-bold`, yang only — no eum mixing per Arch's §C correction). Each line: `text-3xl md:text-5xl lg:text-6xl font-bold leading-tight`, fade-up 24px / 0.6s easeOut. Sentences drawn verbatim from BRIEF.md §섹션 2.
- `components/sections/BigIdeaSection.tsx` (new) — `"use client"`. `<section id="big-idea">` with `bg-background-muted` (uses the new token). Same `min-h-screen pt-40 pb-20 flex flex-col justify-center`. Center-aligned. Headline as one `<h2>` with two `<span className="block">` segments (no `<br />`). Sub paragraph in `text-foreground/80 max-w-2xl`. AnnotatedBodyDiagram below in `max-w-[320px] md:max-w-[420px] lg:max-w-[480px]` wrapper with `text-foreground` class to set `currentColor` for the SVG body strokes (overriding the diagram's default `text-eum` for a slightly different reading on the muted background). `staggerChildren: 0.18` reveals headline → sub → diagram in sequence.
- `app/page.tsx` — Sprint 2 anchor stub gone. Renders `<HeroSection /> <ProblemSection /> <BigIdeaSection />` in order.

### Decisions taken inside the locked envelope
- **`transformOrigin` + `transformBox: "fill-box"` on every motion shape**: Framer Motion's default scale transform-origin in SVG can be unintuitive (uses geometry origin (0,0) by default for `<line>` etc., causing scale to translate the element). Setting `transformBox: "fill-box"` and an explicit `transformOrigin` per part keeps each scale visually centered on the part. Particularly important for the philtrum dot and label scale-on-hover.
- **Arm/leg stroke widths bumped to 6**: The brief calls for "stroke" rendering with currentColor — the default 2px stroke we inherit from the SVG looks anemic for the ㄱ-arm and ㅅ-legs which need to read as glyphs at small sizes. Hero BodyDiagram uses solid filled rectangles for these limbs; the AnnotatedBodyDiagram switches to thicker strokes (6px) so the limbs themselves look like calligraphic strokes — visually halfway between Hero's body and the actual Korean glyph. This stays inside the visual language (still currentColor stroke) while making the labels-and-shapes pairing read as "the body part *is* the letter".
- **Hover color mapping**: yang (ㅣ/ㄱ/ㅅ) and eum (ㅡ/ㅁ/ㅇ) split per Arch's §E semantic mapping. Used hardcoded hex (`#E85D3C` / `#2C3E62`) inside the SVG `fill` because Framer's `fill` animation needs a literal color value, not a Tailwind class — the values mirror the tokens defined in `globals.css`. If the design tokens shift in future, both sites need updating; logged as an awareness item, not a fix.
- **Hitbox per part**: Every interactive `<motion.g>` opens with a transparent `<rect pointerEvents="all">` sized to comfortably include both the visible shape and its label, so users can hover over either the body part or the glyph label and get the same response. Critical for the philtrum dot (2.6px radius) and the small label glyphs.
- **Passive opposite arm rendering**: Just a static `<line>` outside any `motion.g`, no label, not hoverable. Brief §D explicitly says only one arm is the ㄱ.
- **`text-foreground` override on AnnotatedBodyDiagram in BigIdea**: The diagram defaults to `text-eum`; in BigIdea I wrap it with `text-foreground` for slightly higher contrast against the `bg-background-muted` warm gray. `cn()` merge in the diagram component lets the caller's class win.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — compiled in 3.2s, TS pass, 4 static pages generated, no warnings.

### Known Gaps (deferred)
- `/og-image.png` — still missing (Sprint 1+2 carryover).
- `package.json` "name" still ASCII (Sprint 1 carryover).
- 2 moderate `npm audit` advisories — still deferred.
- Hover hardcoded hex colors (`#E85D3C`, `#2C3E62`) duplicate the `globals.css` tokens — would benefit from a shared TS color constant if more diagrams need the same animated colors. Defer until Section 6 (ThreeModes) or Section 7 (ConsonantTree) needs it.
- ㄱ-arm vertical/horizontal segments scale around their own midpoints; on hover they appear to scale slightly apart at the corner. Subtle, acceptable for a hover affordance, but a future polish pass could group the two segments under a single transform.
- AnnotatedBodyDiagram is purely hover-driven; mobile/touch users get the static figure with permanent labels. Brief §E (out of scope) flags this as intentional for now — labels are still visible and meaningful without interaction. Tap-to-toggle behavior deferred per brief.
- shadcn/ui still not initialized — same locked-decision deferral.

### Files created/modified
- `app/globals.css` (added `--color-background-muted` token, 1 line)
- `app/page.tsx` (rewrote — added ProblemSection + BigIdeaSection imports/renders, removed stub)
- `components/sections/ProblemSection.tsx` (new)
- `components/sections/BigIdeaSection.tsx` (new)
- `components/visuals/AnnotatedBodyDiagram.tsx` (new)

## Sprint 4 — VowelsSection + VowelsFaceDiagram + PostureIcon
Date: 2026-05-14
Status: BUILD COMPLETE — `npm run build` exits 0, `npm run lint` exits 0. Ready for Reviewer.

### Shipped
- `components/visuals/AnnotatedBodyDiagram.tsx` — Sprint 3 carryovers applied. (1) ㄱ-arm hitbox right edge pulled in 12px: `<rect x={48} width={120}>` → `<rect x={48} width={108}>` (right edge 168 → 156). The Sprint 3-late interaction-enhancement pass had moved the hitbox from `:274-282` (per brief reference) to `:365-374`; same change, located by structure not line number. (2) Docstring augmented with explicit ㅅ-legs geometry note: `apex (200, 324) → (140, 540)/(260, 540)`, `atan(60/216) ≈ 15.5° from vertical`. The literal "26°" string the brief flagged was not present in the current docstring (rewritten during interaction pass), so the carryover was effectively to *add* the correct geometry note rather than to replace a stale one. Net: docstring now states the actual geometry.
- `components/visuals/PostureIcon.tsx` (new) — pure SVG, server component (no `"use client"`, no Framer dep). Exports `PostureVariant` union (10 variants: 2 base + 8 derived) and default-exports `PostureIcon`. `viewBox="0 0 80 80"`, `currentColor` stroke 2px. Single-switch rendering: standing layout (head circle (40, 16) r=6, body line (40, 24)→(40, 64)) vs lying layout (head circle (16, 40) r=6, body line (24, 40)→(64, 40)). Arms attached at 1/3 of body length from head. Single-arm length 18px; two-arm pair = two 14px parallel strokes 10px apart, on the same side of body — visualizing the "두 획" of ㅑㅕㅛㅠ. Arm direction matches Korean vowel stroke direction (ㅏ=right, ㅓ=left, ㅗ=up, ㅜ=down, etc.). `aria-hidden="true"` — adjacent vowel text label carries semantics. `cn()` className merge.
- `components/visuals/VowelsFaceDiagram.tsx` (new) — pure SVG, server component. New file rather than refactoring `FaceDiagram.tsx`: different viewBox (320×360), different label/glasses policy, different color policy. `<ellipse cx={160} cy={170} rx={90} ry={110}>` face outline. Glasses: two `r=22` circles + short bridge line, all wrapped in `<g className="text-foreground/50" stroke="currentColor">` so they render at low opacity and don't compete with the core glyphs. Nose = yang vertical line (3px); mouth = eum horizontal line (3px); philtrum = 2.5px foreground dot (neutral). SVG `<text>` labels sit to the right of each feature: "ㅣ (양)" yang fill, "• (인)" foreground fill, "ㅡ (음)" eum fill — large glyph (18-20px) + small "(yang/eum/in)" annotation (14px). `role="img"`, `aria-label`, inline `<title>` carry the locked accessibility string from the brief.
- `components/sections/VowelsSection.tsx` (new) — `"use client"`. `<section id="vowels">` with default background (no token, alternates with BigIdea's `bg-background-muted` for cross-section rhythm). `min-h-screen pt-40 pb-20 flex flex-col justify-center`, `<Container>`. Parent `motion.div` with `whileInView`, `viewport={{ once: true, amount: 0.2 }}`, `staggerChildren: 0.15`. 5 children all use the same locally-defined `fadeUp` variants (opacity 0→1, y 24→0, duration 0.7, easeOut): headline (h2, full-width, left-aligned per brief lock) → 3-line sub paragraph (ㅣ/ㅡ/• explainer) → 천지인 italic quote → 2-col grid (face diagram left, vowels table right) → centered closing line ("= 모음 10자. 외울 게 아니라 / 자세로 알아차립니다."). `staggerChildren` is local to this section file — not extracted to shared lib (brief instruction: 3rd usage isn't enough for extraction).
- Vowels table (right column of grid): `<ul className="space-y-6">` of 4 `<li>` rows. Each `<li>` is a Tailwind `group` with `rounded-lg p-3 hover:bg-foreground/[0.03] transition-colors` so the hover area is visually telegraphed. Row inner = `flex flex-wrap items-center gap-x-4 gap-y-3` containing: base PostureIcon (48×48, always colored by base polarity — yang for standing/ㅣ rows, eum for lying/ㅡ rows) → "(서서)/(누워) 한 팔/두 팔 →" prefix label → 2 result cells, each = PostureIcon (48×48, default `text-foreground`, `group-hover:text-yang|eum`, `transition-transform group-hover:scale-110`) + vowel character (`text-3xl md:text-4xl font-bold`, `text-foreground` default, `group-hover:text-yang|eum`). All result cells get `aria-label="모음 X — 양/음"` per brief §4. Rows are data-driven from a `ROWS` constant declared in the same file — one source of truth for the 8-vowel mapping. ROWS spec mirrors brief §4 exactly: ㅣ한팔→ㅏ/ㅓ, ㅣ두팔→ㅑ/ㅕ, ㅡ한팔→ㅗ/ㅜ, ㅡ두팔→ㅛ/ㅠ. Polarity mapping locked: yang = ㅏㅑㅗㅛ + base ㅣ; eum = ㅓㅕㅜㅠ + base ㅡ.
- `app/page.tsx` — added `import VowelsSection from "@/components/sections/VowelsSection"` and rendered `<VowelsSection />` after `<BigIdeaSection />`.

### Decisions taken inside the locked envelope
- **Headline alignment**: Brief allowed Bob to choose between left-aligned (locked default) and centered. Kept left-aligned — sub paragraph and italic quote both flow naturally as full-width left-aligned blocks above the grid; centering would have created an awkward asymmetry against the grid's left-anchored face diagram.
- **Two-팔 row base icon**: Brief allowed showing or omitting the base PostureIcon on the "두 팔" rows (rows 2 and 4). Kept it shown on all 4 rows — visual rhythm is much stronger when all 4 rows start from the same column position, and it makes the "base + arms = derived" formula readable at a glance without scanning back to a previous row.
- **Glasses bridge**: Used a short 16px bridge line between the two lens centers at y=150 (between the two circles, above the nose). Brief flagged this as tweakable. Tested mentally — bridge is well clear of the nose's y=180→220 vertical line, no visual conflict.
- **PostureIcon arm geometry — two-arm spacing**: Used 10px vertical (standing) or horizontal (lying) gap between the paired arms, both 14px long. This reads as "two distinct strokes" without crowding inside the 80×80 viewBox. The pair is offset to one side of the body line (not symmetric across the body) per brief §1 ("몸통 한쪽에 위/아래 짧은 간격 평행 직선 2개").
- **Posture icon sizing in table**: Used a `w-12 h-12` (48px) wrapper `div` with `text-{yang|eum|foreground}` for color control — the SVG inherits via `currentColor`. Hover scale lives on the wrapper so the SVG content scales as a group without per-stroke transform-origin gymnastics.
- **Polarity helpers**: Introduced two tiny in-file helpers (`polarityClass`, `polarityHoverClass`) returning `"text-yang"|"text-eum"` and `"group-hover:text-yang"|"group-hover:text-eum"` from a `Polarity` literal type. Avoids repeating the same conditional 12 times across the JSX. Local to file — would only get hoisted to a shared util if a third or fourth section needs the same mapping pattern.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — compiled in 3.6s, TS pass, 4 static pages generated, no warnings. Same route count as Sprint 3.

### Known Gaps (deferred — DO NOT FIX in this sprint)
- **Mobile tap → hover-equivalent on the vowel rows** — brief §4 specifies hover-only; mobile users see the static base state (foreground-colored result icons + text) without the yang/eum reveal. Brief flagged this as deferred to a later a11y pass. Logged as Known Gap per brief §Out of Scope.
- **`components/visuals/FaceDiagram.tsx` is unused** — it was Hero's original SVG but Hero now uses BodyDiagram (Sprint 2 → 3 transition). Brief explicitly says don't touch in this sprint. Cleanup candidate.
- **ㄱ-arm two-segment polyline refactor** — Sprint 3 reviewer noted the hover scale on each segment around its own midpoint creates a tiny visible split at the corner. Out of scope per brief.
- **No `prefers-reduced-motion` test** in CI — global media query in `globals.css` zeros animations; we rely on it being correct from Sprint 1. Manual test only.
- **Yang/eum hex literals** still duplicated in `PostureIcon.tsx` (none — it uses currentColor only), `VowelsFaceDiagram.tsx` (yes — for SVG `fill`/`stroke` attributes which can't read Tailwind classes), and `AnnotatedBodyDiagram.tsx` (yes — for Framer animated fills). Sprint 3 already logged this as deferred until 3rd+ visual needs the constants. VowelsFaceDiagram is now the 2nd; one more diagram and a `lib/colors.ts` extraction becomes worth it.
- `/og-image.png`, ASCII `package.json` "name", `npm audit` advisories — all carryover, all still deferred.

### Files created/modified
- `components/visuals/AnnotatedBodyDiagram.tsx` (carryover — hitbox width 120→108, docstring augmented with geometry note)
- `components/visuals/PostureIcon.tsx` (new)
- `components/visuals/VowelsFaceDiagram.tsx` (new)
- `components/sections/VowelsSection.tsx` (new)
- `app/page.tsx` (added import + 1 render line)

## Sprint 5 — ConsonantRootsSection + PostureMorphGiyeok + PostureMorphNieun
Date: 2026-05-14
Status: BUILD COMPLETE — `npm run build` exits 0, `npm run lint` exits 0. Ready for Reviewer.

### Shipped
- `components/visuals/PostureMorphGiyeok.tsx` (new) — `"use client"`. 200×200 viewBox, role="img" + inline `<title>` + aria-label "차렷 자세에서 거수 경례 자세로 변하는 사람. 경례한 팔이 ㄱ을 이룹니다." Default `text-eum` body coloring. Static parts: head circle (100,30) r=14, torso (100,44)→(100,140), two legs (100,140)→(80,180)/(120,180), opposite (left) arm (84,55)→(84,110). ㄱ-arm = two `<motion.line>`: vertical L1 morphs (116,55)→(116,110) → (116,55)→(116,15); horizontal L2 morphs collapsed (116,55)→(116,55) → (116,15)→(86,15). Both L1+L2 stroke animate `EUM (#2C3E62)` → `YANG (#E85D3C)`. Single transition `{ duration: 1.2, ease: "easeInOut" }`. Local hex constants `YANG`/`EUM` at top per AnnotatedBodyDiagram precedent.
- `components/visuals/PostureMorphNieun.tsx` (new) — `"use client"`. 200×200 viewBox, role="img" + inline `<title>` + aria-label "누운 자세에서 상체를 일으켜 앉는 사람. 앉은 자세가 ㄴ을 이룹니다." `<motion.circle>` head: lying (cx=30, cy=120) → sitting (cx=130, cy=40), r=14. Torso `<motion.line>` (ㄴ vertical): lying (44,120)→(130,120) horizontal → sitting (130,54)→(130,120) vertical, strokeWidth 2→3. Leg `<motion.line>` (ㄴ horizontal): position static (130,120)→(180,120), strokeWidth 2→3 only. All strokes EUM throughout — ㄱ vs ㄴ differentiation = 컬러 보간 vs 두께 강조 per BRIEF §D2. Arms intentionally omitted for visual simplicity (BRIEF flag #2 endorsed; head start on left = 좌→우 reading direction natural).
- `components/sections/ConsonantRootsSection.tsx` (new) — `"use client"`. `<section id="consonant-roots" aria-label="자음의 두 뿌리">` with `min-h-screen pt-40 pb-20 flex flex-col justify-center bg-background`. Parent `motion.div` with `whileInView`, `viewport={{ once: true, amount: 0.2 }}`, `staggerChildren: 0.18`. Three children all use locally-defined `fadeUp` (opacity 0→1, y 24→0, duration 0.7, easeOut): (1) headline `<h2>` "몸의 두 자세에서 자음이 태어납니다" — `text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-center max-w-3xl mx-auto`; (2) two-column grid `grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12 md:mt-16`, each cell `flex flex-col items-center text-center gap-4` with `<PostureMorph* className="w-full max-w-[240px]" />` → label `<p>` (`text-xl md:text-2xl font-bold`, ㄱ inline `text-yang` / ㄴ inline `text-eum`) → description `<p>` (`text-foreground/80 max-w-xs`); (3) closing `<p>` "단 두 자세. 여기서 자음 14자가 모두 자라납니다." (`text-2xl md:text-3xl font-bold text-center mt-16 md:mt-24 max-w-2xl mx-auto`). All 5 copy strings verbatim from BRIEF §D7.
- `app/page.tsx` — added `import ConsonantRootsSection from "@/components/sections/ConsonantRootsSection"` and rendered `<ConsonantRootsSection />` after `<VowelsSection />`.

### Decisions taken inside the locked envelope
- **Trigger plumbing — `onViewportEnter` on the SVG itself**: BRIEF specified "whileInView callback (viewport once+0.5)" but Framer's `whileInView` is for variant resolution, not arbitrary callbacks. Used `onViewportEnter` (Framer's idiomatic viewport callback) on the `motion.svg` with `viewport={{ once: true, amount: 0.5 }}` to fire `setMorphed(true)` exactly once when 50% visible. Combined with `onHoverStart`/`onHoverEnd` for replay. Effect: identical observable behavior to BRIEF intent, idiomatic API.
- **Hover replay timing**: `onHoverStart` resets to 차렷 (`setMorphed(false)`) then schedules `setMorphed(true)` on next frame via `requestAnimationFrame`. This forces React to commit the reset render before re-triggering the morph, so Framer interpolates from the start pose instead of skipping. `onHoverEnd` ensures we always settle on the morphed end state even if the hover ends mid-cycle.
- **`prefers-reduced-motion` derived state, not effect**: ESLint flagged my first pass (a `useEffect` writing `setMorphed(true)` when `reduced` flips) as `react-hooks/set-state-in-effect`. Replaced with derived state: `const morphed = reduced ? true : internalMorphed`. Hover/viewport handlers early-return when `reduced`. Net behavior matches BRIEF §D4 spec — reduced-motion users see the static end pose and triggers do nothing — without the cascading-render anti-pattern. Better than the original plan.
- **`stroke` on the `<motion.svg>` element vs each line**: For Giyeok the static body parts inherit `stroke="currentColor"` (= `text-eum`); the two ㄱ-arm lines override with `stroke` in their `initial`/`animate` so Framer can interpolate the color. For Nieun every visible stroke is EUM throughout, so I set `stroke={EUM}` directly on the SVG as the parent default and individual `motion.line` children only animate `strokeWidth`. Avoids per-line stroke literal duplication.
- **`useReducedMotion` returning `boolean | null`**: Treated `null` (Framer's "not yet detected" SSR state) as "not reduced" so animation plays after hydration. Same pattern AnnotatedBodyDiagram already uses elsewhere in spirit. Hover/viewport early-return only when `reduced === true`, so SSR mismatch is not a concern.
- **Coordinates kept verbatim from BRIEF**: All pixel coordinates in both morph components match the BRIEF §D3 reference values. No micro-adjustments needed — the morphing reads cleanly at 240px display width per visual inspection of the static endpoint poses.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings (after fixing the `useEffect` anti-pattern noted above).
- `npm run build` — compiled in 3.5s, TS pass, 4 static pages generated, no warnings. Same route count as Sprint 4.

### Known Gaps (deferred — DO NOT FIX in this sprint)
- **Yang/eum hex literals now duplicated in three diagrams** — `AnnotatedBodyDiagram.tsx`, `VowelsFaceDiagram.tsx`, `PostureMorphGiyeok.tsx` (PostureMorphNieun only uses EUM). BRIEF §Out of Scope explicitly defers `lib/colors.ts` extraction to Sprint 7 (ConsonantTree) when the same colors get used a 4th+ time. Logged for that sprint.
- **Hover replay on touch devices** — touch users can't hover; they get the auto-trigger on viewport entry only (single-play). Acceptable for the BRIEF intent; "tap to replay" not in scope this sprint.
- **PostureMorphNieun has no arms** — BRIEF flag #2 endorsed this for visual simplicity. The morph reads as a clear ㄴ without them.
- **`components/visuals/FaceDiagram.tsx` still unused** — Sprint 4 carryover. Out of scope.
- **Sprint 2/3 carryovers** — Button-as-anchor, ㄱ-arm corner fan, og-image, npm audit, ASCII package name — all still deferred per Architect direction.

### Files created/modified
- `components/visuals/PostureMorphGiyeok.tsx` (new)
- `components/visuals/PostureMorphNieun.tsx` (new)
- `components/sections/ConsonantRootsSection.tsx` (new)
- `app/page.tsx` (added import + 1 render line)

## Sprint 6 — ThreeModesSection + CombinationCard (×3)
Date: 2026-05-14
Status: BUILD COMPLETE — `npm run build` exits 0, `npm run lint` exits 0. Ready for Reviewer.

### Shipped
- `components/visuals/CombinationCard.tsx` (new) — `"use client"`. 단일 컴포넌트, `mode` prop으로 3분기 (close-corner / close-curve / open-spread). 200×200 viewBox 공통. ㄱ(좌상단 (40,40)/(80,40)+(80,80)) + ㄴ(우하단 (120,120)/(120,160)+(160,160))이 fade-in + 안쪽 슬라이드 후 모드별 결합 형상으로 morph. Sprint 5 PostureMorph 트리거 패턴 그대로 복제: `useState<boolean>(false) merged`, `useReducedMotion()` 파생 상태 (`reduced ? true : internalMerged`), `onViewportEnter` (`viewport={{ once: true, amount: 0.5 }}`) → `setMerged(true)`, hover reset → rAF → re-trigger. 카드 컨테이너 `flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-background border border-foreground/10`. 결과 글자 `<motion.p>` `text-7xl md:text-8xl font-bold` polarity별 `text-yang`/`text-eum`, `aria-hidden="true"`, `transition: { duration: 0.5, delay: 1.4 }`. 상단 모드 레이블(`text-sm md:text-base font-medium text-foreground/60 uppercase tracking-wide`) + 하단 라벨2(`text-lg md:text-xl font-bold text-foreground` / `text-base text-foreground/80 leading-relaxed`). `role="img"`, inline `<title>`, aria-label 자동 조립 ("{topLabel} — {result}로 결합되는 ㄱ과 ㄴ"). 색 상수 `YANG`/`EUM` inline (Sprint 7 lib/colors.ts carryover).
- `components/sections/ThreeModesSection.tsx` (new) — `"use client"`. `<section id="three-modes" aria-label="ㄱ과 ㄴ의 세 결합 모드">` `min-h-screen pt-40 pb-20 flex flex-col justify-center bg-background-muted` (Sprint 3 BigIdea와 동일 토큰 — 시각 임팩트 강조 + 직전 두 섹션이 default였으므로 muted로 리듬 변화). `<Container>` 내부 부모 `motion.div` `whileInView` `viewport={{ once: true, amount: 0.2 }}` `staggerChildren: 0.18`. 자식들 모두 로컬 `fadeUp` (opacity 0→1, y 24→0, 0.7s easeOut): (1) headline `<h2>` "같은 두 글자, 세 가지 결합 방식" — `text-3xl md:text-5xl lg:text-6xl font-bold leading-tight text-center max-w-3xl mx-auto`; (2) 서브 `<p>` "ㄱ과 ㄴ을 어떻게 합치느냐에 따라 세 개의 새 자음이 태어납니다. 사람 몸이 그것을 그대로 보여줍니다." — `text-base md:text-lg text-foreground/80 text-center max-w-2xl mx-auto mt-4 md:mt-6`; (3) 3카드 그리드 `grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 md:mt-16` — close-corner/ㅁ/eum, close-curve/ㅇ/eum, open-spread/ㅅ/yang; (4) 마무리 영역 `flex flex-col items-center gap-6 mt-16 md:mt-24` — 라벨 `<p>` "= 초자음 5개 완성" + nested `motion.div` (`staggerChildren: 0.12`, 자체 `whileInView` 트리거)로 5자 `<motion.span>` 순차 pop-in. `glyphPop = { hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1 } }` + `transition: { duration: 0.5, ease: "backOut" }`. 5자 데이터 `FINAL_GLYPHS` 상수: ㄱ(yang), ㄴ(eum), ㅁ(eum), ㅅ(yang), ㅇ(eum) — BRIEF 마무리 문구 순서 그대로. 모든 카피 BRIEF §F 글자 단위 verbatim.
- `app/page.tsx` — `import ThreeModesSection from "@/components/sections/ThreeModesSection"` 1줄 추가 + `<ThreeModesSection />` ConsonantRootsSection 다음에 1줄 추가.

### Decisions taken inside the locked envelope
- **카드 결합 애니메이션 = motion.line per-prop transition object**: BRIEF §D는 stage 1(slide)과 stage 2(morph)를 "단일 motion key로 보간"하라고 함. close-corner는 자모 좌표가 출발→종료로 직접 보간되므로 단일 `transition={SLIDE_TRANSITION}` (duration 1.0 easeInOut)으로 처리 — Framer가 x1/y1/x2/y2/opacity를 같은 timeline에 보간. close-curve와 open-spread는 좌표는 1.0s에 끝나야 하고 strokeOpacity/stroke 색은 별도 delay/duration이 필요해서 per-prop transition object를 썼다 (Framer가 prop별로 다른 transition을 받는 표준 패턴). 동일 좌표 보간은 SLIDE_TRANSITION 재사용으로 timing 일관 유지.
- **결과 글자 `<motion.p>` initial opacity 0**: BRIEF는 "글자 morph 완료 시점과 동시에 fade-in (whileInView once + 0.3s 지연 fade)"로 명시. delay 1.4s + duration 0.5s = 1.9s — 결합 애니메이션(1.0s slide + 마지막 색/원 transition 끝나는 ~1.5~1.7s)보다 약간 늦게 등장해서 자연스럽게 강조. `whileInView` 별도 부착 대신 부모(섹션) staggerChildren에 묶이지 않고 카드 자체의 SVG 트리거(`merged` state)에 동기화 — 같은 카드 안에서 SVG 종료와 결과 글자 등장이 정확히 짝지어진다 (SVG가 viewport 진입할 때 `merged: true` → 결과 글자 opacity도 그 시점에 1로 트리거됨).
- **마무리 5자 컨테이너 별도 `whileInView` 트리거**: 부모 섹션의 staggerChildren(0.18)이 헤드라인→서브→그리드→마무리div를 순차 fade-up 시킨 후, 마무리div 내부 5자 글자 컨테이너는 자체 `whileInView` + staggerChildren(0.12)로 자식 span pop-in을 별도 트리거. 부모 stagger와 nested stagger가 충돌 없이 캐스케이딩 — 마무리div가 보이기 시작할 때 5자가 이어서 순차 pop-in되는 효과.
- **카드 상단 모드 레이블 위치**: BRIEF C는 카드 구성을 (1)상단 200px SVG → (2)중앙 80px 결과 글자 → (3)하단 라벨1 → (4)하단 라벨2 로 명시했지만 topLabel("직각으로 닫음" 등)을 어디에 둘지는 명시 안 함. SVG 위에 `text-sm md:text-base font-medium text-foreground/60 uppercase tracking-wide` 미니 헤더로 배치 — 카드 정체성을 가장 먼저 알리고 SVG가 풀 시각 영역을 차지. uppercase + tracking-wide로 "section label" 톤. BRIEF flag #4 (borderless) 미적용 — bg-background-muted 위 bg-background border 카드의 분리감이 시각적으로 적정.
- **close-curve 단순화 시퀀스 timing**: BRIEF §D2 명시 그대로 — 라인 fade `delay: 0.8, duration: 0.5`, 원 draw `delay: 0.8, duration: 0.7`. 두 transition 동시 시작이라 사각형이 갑자기 사라지지 않고 원과 cross-fade. BRIEF flag #2(타이밍 미세조정 필요할 수 있음) 미발동 — 1.0s slide 끝나는 시점부터 0.2s 지연 후 cross-fade 시작이 자연스럽다.
- **open-spread stroke 색 보간 delay**: ㄱ/ㄴ 첫 line은 morph(좌표 0~1.0s) + 색 보간 (delay 0.5, duration 0.7) → 좌표 이동 중반부터 색이 점진적으로 yang 으로. 두 번째 line(사라질 line)은 strokeOpacity (delay 0.5, duration 0.5)로 fade-out. 모두 1.2s 부근에 안정.
- **카드별 독립 viewport 트리거**: BRIEF E 그대로 — 카드 사이 동기화 X. 각 카드 SVG의 `onViewportEnter`가 독립 발화. 데스크탑 3열에서는 셋이 거의 동시에 진입하지만 Framer가 리스트 정렬을 보장하지는 않음 — 의도된 동작.
- **5자 마무리 글자 크기**: BRIEF flag #3 명시 — 카드 결과 글자(`text-7xl md:text-8xl`)보다 마무리 5자(`text-5xl md:text-7xl`)가 작게 유지. 시각적 위계(개별 카드 결과 → 종합 5자)를 자연스럽게 표현.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — compiled in 3.3s, TS pass, 4 static pages generated, no warnings. Same route count as Sprint 5.

### Known Gaps (deferred — DO NOT FIX in this sprint)
- **`lib/colors.ts` 추출** — Sprint 5에서 3 visual 사용으로 carryover 했고, Sprint 6 CombinationCard가 4번째(YANG/EUM 둘 다 사용). BRIEF §Out of Scope 명시대로 Sprint 7(ConsonantTree)로 미룸.
- **모바일 탭 트리거** — Sprint 5와 동일하게 viewport 자동 트리거만 발화. 호버 replay는 데스크탑 한정. BRIEF Out of Scope.
- **5자 마무리 영역 cross-link** — 각 글자 호버 시 해당 카드 강조 — BRIEF Out of Scope, 향후 polish.
- **ㅇ 카드 진짜 path morphing** — line→arc 진짜 morph 대신 line fade-out + circle draw-on 합성. BRIEF가 명시적으로 단순화 endorse — 시각적으로 충분.
- **Sprint 2/3/4/5 carryovers** — FaceDiagram 미사용, AnnotatedBodyDiagram ㄱ-arm corner fan, og-image, npm audit, ASCII package.json name — 모두 그대로 deferred.

### Files created/modified
- `components/visuals/CombinationCard.tsx` (new)
- `components/sections/ThreeModesSection.tsx` (new)
- `app/page.tsx` (added import + 1 render line)

## Sprint 7 — ConsonantTreeSection + ConsonantTree + lib/colors.ts 추출
Date: 2026-05-14
Status: BUILD COMPLETE — `npm run build` exits 0, `npm run lint` exits 0, 4 static routes 유지. Ready for Reviewer.

### Shipped
- `lib/colors.ts` (new) — Sprint 5/6 carryover 해소. `YANG="#E85D3C"` / `EUM="#2C3E62"` / `FOREGROUND="#1A1A1A"` 3 export. JSDoc에 `@theme` 동기화 의무 명시 (Tailwind v4 globals.css 토큰과 동일 값 — 한쪽 변경 시 다른 쪽도 갱신).
- `components/visuals/AnnotatedBodyDiagram.tsx` — `import { YANG, EUM, FOREGROUND } from "@/lib/colors"` 1줄 추가, 로컬 const YANG/EUM/FOREGROUND 3줄 제거. `CONNECTOR_REST="#6B6B6B"`만 유지(공유 안 됨). 동작 변경 0.
- `components/visuals/VowelsFaceDiagram.tsx` — 동일 패턴 (3줄 → 1 import).
- `components/visuals/PostureMorphGiyeok.tsx` — 동일 패턴 (2줄 → 1 import). YANG/EUM 둘 다.
- `components/visuals/PostureMorphNieun.tsx` — 동일 패턴 (1줄 → 1 import). EUM만.
- `components/visuals/CombinationCard.tsx` — 동일 패턴 (2줄 → 1 import). YANG/EUM 둘 다.
- `components/visuals/ConsonantTree.tsx` (new) — `"use client"`. 한 motion.svg viewBox 0 0 800 1000. 5 motion.g (단계 1~5) + 호버 path 조건부 line. `CONSONANT_DATA` 상수 5행 (CONSONANT-TREE-REFERENCE.md canonical 매핑 그대로): ㄱ→ㅋ→ㄹ(yang) / ㄴ→ㄷ→ㅌ(eum) / ㅁ→ㅂ→ㅍ(eum) / ㅅ→ㅈ→ㅊ(yang) / ㅇ→ㅎ→null(eum). 각 행에 rowY + rootTreeX/Y 좌표 동봉 — 호버 path 그릴 때 트리/매트릭스 좌표계가 같은 SVG 안에 있어 직접 line 보간 가능. `useState<string | null>(null)` hovered state로 14 글자 노드(트리 ㄱ/ㄴ/ㅁ/ㅇ/ㅅ + 매트릭스 14셀) 모두 강조 동기화. 매트릭스 셀 호버 시 그 글자의 뿌리 노드도 함께 scale 1.15 (spring stiffness 300 damping 22). 비-hovered 글자 opacity 0.4. `useReducedMotion()` 시 모든 단계 transition duration 0 분기.
- `components/sections/ConsonantTreeSection.tsx` (new) — `"use client"`. `<section id="consonant-tree" aria-label="14자 자음 트리">` `min-h-screen pt-40 pb-20 flex flex-col justify-center bg-background` (ThreeModes muted 이후 default로 리듬 변화). Container 내부 부모 motion.div `whileInView viewport={{ once: true, amount: 0.2 }} staggerChildren: 0.18`. 4 자식 (모두 fadeUp): headline → sub → ConsonantTree wrapper → 하단 강조 박스. 강조 박스 내부 14자 가로 enumeration은 3 GlyphGroup (초자음 5 / +1획 5 / +2획 4) + 그룹 사이 세로 구분선(`text-foreground/20 |`) + 마무리 문장 ("2 뿌리 + 3 결합 + 2 획 추가" font-bold 강조). 모든 카피 BRIEF §H verbatim.
- `app/page.tsx` — `import ConsonantTreeSection from "@/components/sections/ConsonantTreeSection"` 1줄 + `<ConsonantTreeSection />` ThreeModesSection 다음에 1줄 추가.

### Decisions taken inside the locked envelope (Bob latitude flag 결과)
- **Flag #1 — 호버 path line 포함 (1차 풀버전)**: 트리 root → 매트릭스 셀 단일 line으로 풀버전 구현. line은 dashed (strokeDasharray "6 4") + opacity 0.5 + polarity 컬러 stroke (yang/eum). hovered가 매트릭스 plus1/plus2 셀일 때만 활성화 (root 호버 시는 path 안 그림 — 셀 강조만). 시각적으로 clean — 800×1000 viewBox 안에서 트리 영역(y 0-480)과 매트릭스 영역(y 520-1000) 사이 거리가 충분해 line이 messy하지 않음. 단순화 옵션(path 생략) 미발동.
- **Flag #2 — 매트릭스 컬럼 위치**: BRIEF 명시 그대로 (120/280/440/600). 별도 조정 불필요. 컬럼 헤더(y=540) + 첫 행(y=620)도 그대로 — 헤더와 첫 행 사이 80px 간격이 시각적으로 안정.
- **Flag #3 — 단계별 시퀀스 timing**: BRIEF 명시 그대로 (t=0/0.5/1.3/2.0/3.0, 총 ~4.5s). delayChildren는 stage group variants의 transition에 부여 (Framer 표준 패턴 — parent variant resolves "show" 시 grandchildren까지 캐스케이드). 별도 조정 미발동.
- **Flag #4 — 하단 강조 박스 그룹 구분**: 세로 구분선 (`text-foreground/20 |`) + `gap-x-6 gap-y-3` 사용. flex-wrap이 모바일에서 자연 줄바꿈하면서 그룹 단위는 inline-flex로 묶어 글자 단위 갈라짐 방지. 구분선과 큰 gap을 함께 써서 그룹 시각 분리 강화.

- **단계별 cascade 구현 — Framer variants 다단 nesting**: parent motion.svg는 빈 containerVariants (stagger 0)로 immediate "show" propagation. 각 단계 motion.g가 자체 variants의 transition에 `delayChildren: t(stageStartTime)`을 들고 있어 stagger의 절대 시점 제어. 단계 4(stage4Group)는 추가로 `staggerChildren: 0.15`로 ㅁ/ㅇ/ㅅ 3 노드 순차. 단계 5(stage5Group)는 `staggerChildren: 0.12`로 5행 순차, 각 행(stage5Row)은 다시 `staggerChildren: 0.08`로 행 내부 4셀 순차 — 3중 nested stagger.
- **호버 hitbox 전략**: 트리 root/단계4 글자 노드는 `<rect fill="transparent" pointerEvents="all">`로 라벨까지 덮는 100×100 (라벨 있으면 100×130) hitbox 부착. 매트릭스 셀은 80×80 hitbox. 모든 transparent rect는 `<motion.g>` 자식이므로 `onMouseEnter/Leave` 부모로 버블링 — Sprint 3 AnnotatedBodyDiagram 패턴 동일.
- **hoverPath 좌표 자료구조**: `CONSONANT_DATA` 각 행에 `rootTreeX/Y` (root 노드의 트리 영역 좌표)와 `rowY` (매트릭스 행 중심 y) 동봉. hoverPath 계산은 `hovered`가 어느 행의 plus1/plus2인지 한 번 순회로 결정 + 좌표 즉시 read. 매번 좌표 lookup 테이블 따로 안 씀 — 데이터에 포함시켜 단일 source.
- **dominantBaseline="central"** + **textAnchor="middle"**: 글자 노드/셀 모두 SVG `<text>`의 좌표(cx, cy)를 글자 중심에 맞추기 위함. circle/rect의 중심과 글자 중심이 정확히 일치 → 호버 scale 시 transformOrigin (cx, cy)이 자연스럽게 동작.
- **하단 박스 14자 GlyphGroup 컴포넌트**: 인라인으로 정의 (3번 사용). 3 그룹의 글자 데이터(`FINAL_INITIAL`/`FINAL_PLUS1`/`FINAL_PLUS2`)는 polarity 정보 동봉. 각 글자에 polarityClass (text-yang/text-eum) 적용. 박스 전체는 `flex flex-wrap items-center justify-center gap-x-6 gap-y-3` — 모바일 자동 줄바꿈, 데스크탑 한 줄 수렴.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — compiled in 3.4s, TS pass, 4 static pages generated, no warnings. Same route count as Sprint 6.

### Known Gaps (deferred — DO NOT FIX in this sprint)
- **모바일 탭 트리거 호버 등가물** — 데스크탑 호버 한정. 모바일은 정적 매트릭스 (값 자체는 전부 보임 + path line은 안 그려짐). BRIEF §Out of Scope 명시.
- **트리 노드↔매트릭스 정적 가이드 라인** (호버 없을 때) — C4 호버 path만. BRIEF §Out of Scope.
- **ConsonantTree 호버 시 매트릭스 행 전체 강조** (ㅋ 호버 → ㄱ/ㅋ/ㄹ 행 전체 동시 강조) — 단순 글자별 + root 강조만. BRIEF §Out of Scope.
- **lib/colors.ts에 다른 색 추가** (background-muted, foreground-various opacity 등) — YANG/EUM/FOREGROUND 3개만. 향후 필요 시 추가.
- **트리 root 호버 시 path 미표시** — 매트릭스 셀(plus1/plus2) 호버에서만 path line. root 호버 시는 셀 강조 없이 노드만 scale. 시각 단순성 위한 Bob 결정. 향후 polish 가능.
- **Sprint 2~6 기존 carryovers** — Button-as-anchor, ㄱ-arm corner fan, og-image, npm audit, ASCII package.json name, FaceDiagram 미사용, POSE 상수 hoist, topLabel uppercase, ㅇ cross-fade timing — 모두 그대로 deferred.

### Files created/modified
- `lib/colors.ts` (new — YANG/EUM/FOREGROUND export)
- `components/visuals/AnnotatedBodyDiagram.tsx` (1 import + 3 const removed)
- `components/visuals/VowelsFaceDiagram.tsx` (1 import + 3 const removed)
- `components/visuals/PostureMorphGiyeok.tsx` (1 import + 2 const removed)
- `components/visuals/PostureMorphNieun.tsx` (1 import + 1 const removed)
- `components/visuals/CombinationCard.tsx` (1 import + 2 const removed)
- `components/visuals/ConsonantTree.tsx` (new)
- `components/sections/ConsonantTreeSection.tsx` (new)
- `app/page.tsx` (added import + 1 render line)

---

## Sprint 8 — NumbersSection + NumberGlyph (BRIEF 단계 9 — 양·음 한글숫자 보너스)
Date: 2026-05-14
Status: BUILD BLOCKED — `npm run lint` exits 0, `npm run build` fails on **pre-existing** TS error in `components/visuals/CombinationCard.tsx` (Sprint 6 file). My new code TS-clean. Dev server (bs026tn9n) hot-reloaded and serves 200 OK. **Escalating to Arch — see Known Gaps.**

### Shipped (Sprint 8 deliverables)
- `components/visuals/NumberGlyph.tsx` (new) — `"use client"`. 단일 컴포넌트, `variant: "yang" | "eum"` prop. viewBox 240×280. W (yang: 5 vertex (40,220)→(90,80)→(120,200)→(150,80)→(200,220)) 또는 M (eum: 수평축 뒤집기 (40,80)→(90,220)→(120,100)→(150,220)→(200,80)). 각각 4 segment에 1·2·3·4 / 6·7·8·9 라벨. yang은 상단 △ (vertices 120,30 / 100,60 / 140,60) + "5 (↑)" 라벨, eum은 하단 ○ (cx=120 cy=250 r=14) + "0 (완성)" 라벨. 본체 stroke 5px, △/○ stroke 2.5px (체급 대비로 본체 강조). stroke `currentColor` + 부모 `text-yang`/`text-eum` 채널 — YANG/EUM 상수 import 불필요 (모든 stroke가 currentColor로 통함, 브리프 노트 그대로). `aria-hidden="true"` (인접 카드 라벨 + 마무리 단락이 의미 전달).
- 자동 루프 — Sprint 7 PostureMorphGiyeok 패턴 그대로: `useState(0) cycleKey` + `useEffect setInterval(LOOP_INTERVAL_MS=5500)` + `<motion.svg key={cycleKey}>` remount → forward 깨끗 재생. `onHoverStart={replay}` 호버 즉시 remount. `useReducedMotion()` 시 setInterval skip + 모든 transition `{duration:0}` → 정적 종료 자세 (W/M 4 stroke + 4 숫자 + △/○ + 그 라벨 모두 표시).
- 시퀀스 (총 ~3.0s + 2.5s 휴지 = 5.5s cycle):
  - 4 stroke `pathLength: 0→1` + opacity 0→1, duration 0.5s, delay 0/0.5/1.0/1.5 (4개 순차 draw-on)
  - 숫자 4개 `<motion.text>` opacity 0→1, duration 0.4s, delay 2.0+i*0.10 (stagger 0.10 — Bob latitude 0.08~0.12 중간값)
  - △/○ `<motion.g>` scale 0→1 + opacity 0→1, duration 0.5s, ease backOut, delay 2.5 (pop-in)
  - △/○ 라벨 opacity 0→1, duration 0.4s, delay 2.6 (pop과 0.1s 간격으로 자연스럽게 따라옴)
- `components/sections/NumbersSection.tsx` (new) — `"use client"`. `<section id="numbers" aria-label="양·음 한글숫자">` `pt-24 md:pt-32 pb-20 md:pb-24 bg-background-muted`. **min-h-screen 미사용** (보너스 톤 — 본문 자연 높이). Container 내부 부모 motion.div `whileInView viewport={{ once: true, amount: 0.2 }} staggerChildren: 0.18`. 4 자식 모두 fadeUp (opacity 0→1, y 24→0, duration 0.7s easeOut): h2 → sub p → 2카드 grid → 마무리 p. 카피 3개 BRIEF §섹션 8 verbatim. 카드 컨테이너 `flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-background border border-foreground/10` (ThreeModes CombinationCard 톤 그대로). NumberGlyph wrapper `w-full max-w-[240px]` + polarity color (`text-yang`/`text-eum`). 카드 라벨 `text-lg md:text-xl font-bold` + polarity color.
- `app/page.tsx` — `import NumbersSection from "@/components/sections/NumbersSection"` 1줄 + `<NumbersSection />`을 `<ConsonantTreeSection />` 다음에 1줄 추가. 8개 섹션 흐름 완성.

### Decisions taken inside the locked envelope (Bob latitude flag 결과)
- **Flag #1 — 숫자 라벨 폰트 크기/위치**: 14px font-size, fontWeight 700, `textAnchor="middle"` `dominantBaseline="central"`. 위치는 각 stroke 시작 vertex 근처에서 segment 진행 방향과 반대쪽으로 12~20px 오프셋해 본체 stroke와 시각적 비충돌. W: "1" (28,240) "2" (78,68) "3" (120,224) "4" (138,68). M (수평 뒤집기): "6" (28,68) "7" (78,240) "8" (120,92) "9" (138,240). vertex의 정확한 (40,220) 같은 자리에 두면 stroke 위에 얹혀 가독성 떨어지므로 의도적 오프셋. 14px 권장 범위 (14~16) 하단 — 240×280 viewBox 안에서 본체 stroke와 라벨 비례 균형.
- **Flag #2 — △/○ 라벨 텍스트 크기**: 13px (12~14 권장 중간). △ 라벨 위치 (165,50) — △ 우측에 배치 ("5 (↑)" 우향 자연). ○ 라벨 위치 (165,254) — ○ 우측 동일. textAnchor="start"로 글리프와 라벨 시각 접합.
- **Flag #3 — stroke-width**: W/M 본체 5px, △/○ 2.5px. 권장 범위(본체 4~5 / 보조 2~3) 내 상단/중간. 본체 강조 + 보조 글리프 가독.
- **Flag #4 — 숫자 라벨 stagger**: 0.10s (권장 0.08~0.12 중간). 너무 빠르면 4 숫자가 한 번에, 너무 느리면 △/○ 등장 지연 — 0.10이 시각적 안정점.
- **Flag #5 — △/○ 등장 모션**: pop-in (scale 0→1, ease backOut, 0.5s) + opacity 0→1 동시. backOut으로 약간의 overshoot — "완성"의 시각적 강조 효과. 라벨은 0.1s 후 fade-in으로 자연스러운 follow.

### 구현 디테일
- **transformOrigin 정확 좌표 지정**: △ 그룹 `transformOrigin: "120px 45px"` (△ 중심 부근), ○ 그룹 `transformOrigin: "120px 250px"` (○ 중심). pop-in scale이 글리프 자체 중심에서 자연스럽게 확장 (viewBox 좌상단 기준 X).
- **strokeLinecap "round"**: motion.svg 부모에 부착 — W/M 본체 + △ stroke 모두 둥근 끝단으로 도식 부드러움. (○는 closed circle이라 무관.)
- **whileInView vs animate**: 브리프 명시대로 `whileInView` + `viewport={{ once: true, amount: 0.2 }}` 사용. 기존 7개 섹션은 모두 `initial="hidden" animate="show"` (페이지 로드 즉시) 패턴이지만 이 섹션은 보너스 톤으로 viewport 진입 시 캐스케이드. 잠긴 결정.
- **반복 SVG 객체 — slice + map**: W_VERTICES.slice(0,4).map((start,i) => <motion.line/>)로 4 stroke를 데이터 driven 생성. 좌표 듀얼 source X, 단일 vertex 배열에서 segment 자동 도출. yang/eum variant 분기는 vertices/numberPositions/polarityClass 3 변수만 swap.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings.
- `npm run build` — **FAIL** (TS check). 새 코드는 type-clean (`npx tsc --noEmit` 결과 NumberGlyph.tsx, NumbersSection.tsx, page.tsx 0 errors). 실패 원인은 **pre-existing** `components/visuals/CombinationCard.tsx` 102-104행 — `useReducedMotion()` 반환 타입이 `boolean | null`인데 `CloseCornerShape`/`CloseCurveShape`/`OpenSpreadShape` 서브 컴포넌트가 `reduced: boolean`을 요구. Sprint 7 BUILD-LOG에 "build exits 0" 명시되어 있어 그 이후 framer-motion patch 업데이트가 타입 widen한 것으로 추정 (혹은 TS strict 동작 변화). Sprint 8 코드는 무관.
- 추가 검증: dev server (bs026tn9n) hot-reload 후 `curl -I http://localhost:3000/` 200 응답. 브라우저 SSR 동작 정상 — 빌드 실패는 production TS 체크에서만.

### Known Gaps (deferred / **escalation to Arch**)
- **CombinationCard.tsx TypeScript 회귀** (Sprint 6 파일, **Sprint 8 외 범위**) — Sprint 7까지 build 통과했으나 현재 시점에서 `useReducedMotion()` 타입이 `boolean | null`로 widen 되어 `reduced: boolean` 서브 컴포넌트 prop과 충돌. 3 호출지점 (line 102/103/104) 모두 동일 문제. **수정 옵션 (1줄):**
  - (a) `<CloseCornerShape reduced={!!reduced} />` 형태로 호출지에서 강제 boolean 변환 (3개 호출 동시 수정)
  - (b) sub-component 시그니처 `{ reduced: boolean }` → `{ reduced: boolean | null }` 변경 (3 함수 동시 수정)
  - 내 판단: **(a)가 시맨틱 보존 + 영향 최소** — sub-component는 진짜로 boolean만 다루므로 prop 타입은 그대로 유지하고, 호출지에서 null을 false로 정규화. 그러나 본 sprint 범위 외 — Arch 승인 필요. **escalating** — Arch 결정 시 Bob이 1줄 fix 적용 가능.
- **모바일 탭 트리거 (NumberGlyph)** — 자동 루프가 모든 디바이스에서 동작하므로 별도 트리거 불필요. BRIEF §Out of Scope.
- **카드 호버 효과** — 자동 루프 외 호버 인터랙션 추가 X. 호버 시 즉시 replay만 (Sprint 7 패턴). BRIEF §Out of Scope.
- **0~10 전체 enumeration** — W/M/△/○ 글리프 도식만. 숫자 표 형태 추가 X. BRIEF §Out of Scope.
- **양수 5와 음수 10(=0) 추가 도식** — △/○ 자체가 그 표현. BRIEF §Out of Scope.
- **Sprint 1~7 기존 carryovers** — Button-as-anchor, ㄱ-arm corner fan, og-image, npm audit, ASCII package.json name, FaceDiagram 미사용, POSE 상수 hoist, topLabel uppercase, ㅇ cross-fade timing, ConsonantTree root 호버 path, lib/colors.ts 추가 색 — 모두 그대로 deferred.

### Files created/modified
- `components/visuals/NumberGlyph.tsx` (new)
- `components/sections/NumbersSection.tsx` (new)
- `app/page.tsx` (added import + 1 render line)

---

## Sprint 9 — FounderSection + FooterSection + Button polymorphic (BUILD)
Date: 2026-05-14
Status: BUILD COMPLETE — awaiting review

### Step status
- Step 1 (Button polymorphic `as` prop) — done
- Step 2 (Hero CTA cleanup) — done
- Step 3 (FounderSection) — done
- Step 4 (FooterSection) — done
- Step 5 (page.tsx integration) — done
- Step 6 (lint/build clean) — done (both exit 0)

### Files created/modified
- `components/ui/Button.tsx` (rewrite) — polymorphic union: `ButtonAsButton` (default, `<button>`) vs `ButtonAsAnchor` (`as="a"`, `<a>`). forwardRef removed (no external ref users; grep confirmed only HeroSection uses Button). Discriminated on `props.as === "a"` at runtime; our own props (`variant`, `size`, `className`, `as`) stripped from `...rest` before forwarding to DOM. Button case keeps `type ?? "button"` default. Base/variant/size class tables identical to prior version.
- `components/sections/HeroSection.tsx:67-74` — replaced `<a href="#problem" aria-label="..." className="inline-flex"><Button ...>원리 보기 ↓</Button></a>` with `<Button as="a" href="#problem" aria-label="..." variant="primary" size="lg">원리 보기 ↓</Button>`. `inline-flex` redundant (already in Button base). Hero secondary disabled Button unchanged.
- `components/sections/FounderSection.tsx` (new) — `"use client"`. `<section id="founder" aria-label="창시자 소개" className="min-h-screen pt-24 pb-20 flex flex-col justify-center bg-background">`. Container > parent motion.div with `staggerChildren: 0.18`, `whileInView` (viewport once amount 0.2). Layout: `grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-center`. Photo placeholder: `aspect-[4/5] w-full max-w-[360px] rounded-2xl bg-gradient-to-br from-eum/15 to-yang/10` with centered "안심" (text-6xl/7xl font-bold text-foreground/40) + "金 潤奎" (text-base/lg text-foreground/40 tracking-widest). `role="img" aria-label="김윤규 장로 사진 (준비 중)"`. Photo wrapped in one `motion.div` child of parent stagger; text column is a plain `<div>` whose 6 inner `motion.p/h2/div` children share the same parent stagger (sibling-of-photo). Stagger cascade: photo → "Founder" label → "김윤규 (안심)" h2 → 약력 → 단락1 → 단락2 → CTA row. Body text BRIEF.md lines 180-182 verbatim. CTAs: secondary disabled `<Button>방법론 영상 보기</Button>` matches Hero; primary `<Button as="a" href={MAILTO_HREF}>이메일로 소식 받기</Button>` with full `aria-label`. mailto URL has subject/body URI-encoded (한글교수법 소식 신청 / 한글교수법 소식을 받아보고 싶습니다.) — stored in module-scope `MAILTO_HREF` const for readability.
- `components/sections/FooterSection.tsx` (new) — server component, no "use client", no motion. `<footer aria-label="사이트 푸터" className="bg-background-muted pt-12 md:pt-16 pb-10">`. Container > `grid grid-cols-1 md:grid-cols-3 gap-8 items-start`. Left col: "안심 양·음 한글교육 연구소" (text-base font-bold) + "사람의 몸이 곧 한글이다" subtitle (text-sm text-foreground/50 mt-1). Center col: `<nav aria-label="푸터 메뉴">` (md flex justify-center wrap) > `<ul className="flex flex-col gap-2 md:items-center md:text-center">` with 3 items. "소개" → `<a href="#big-idea">`. "영상" → `<span aria-disabled="true" title="준비 중" className="text-sm text-foreground/30 cursor-not-allowed">`. "문의" → `<a href="mailto:luxual8@gmail.com">`. Right col: `flex flex-col md:items-end md:text-right`. Copyright "© 2026 안심 양·음 한글교육" + social row `flex gap-3 mt-3`. Two inline 24x24 SVG glyphs in `<span role="img" aria-label="..." title="준비 중" className="text-foreground/30 cursor-not-allowed">`: YouTube (rounded rect + filled play triangle), Instagram (rounded rect + circle + small dot). lucide style — currentColor, stroke 2, linecap/linejoin round.
- `app/page.tsx` — added FounderSection + FooterSection imports. Wrapped existing 8 sections + new FounderSection in `<main>`, placed `<FooterSection />` as sibling outside `<main>` (HTML5 semantic). Top-level wrapped in fragment.

### Decisions taken inside the locked envelope
- **Button union shape**: Used `Omit<...HTMLAttributes, "className">` on both branches so our top-level `className` (declared in `CommonProps`) is the single source for that prop — avoids duplicate-key TypeScript narrowing issues. `as` is the discriminant (`undefined` vs `"a"` literal). Simple union, no generics. Discriminated narrow at runtime via `props.as === "a"`.
- **Button forwardRef removal**: grep'd `components/` for `ref=` on `<Button` — zero matches outside Hero (Hero's two `ref=` are unrelated, refer to `href` substring in tool output). Confirmed safe to drop forwardRef per brief §A.
- **Pre-built mailto URL constant**: encoded the Korean subject/body once into `MAILTO_HREF` (module scope) rather than inline-escaping inside JSX. Same encoding result, more readable, single edit point if string changes.
- **Photo placeholder content**: "안심" (Hangul name, 큰 글자) + "金 潤奎" (한자 본명, 작게, tracking-widest for 격식). Both at text-foreground/40 so the card reads as a tonal placeholder rather than a typographic flex. font-bold on "안심" only.
- **Footer center column md alignment**: brief §E says "모바일에서 좌측 정렬, md+에서 `md:items-center md:text-center`". Applied those classes to the `<ul>` directly, plus a `md:flex md:justify-center` wrapper on the `<nav>` so the centered ul actually sits in the middle of the center grid cell (otherwise ul would be left-aligned within the cell and `items-center` only affects its own children).
- **Social SVG glyphs**: simplified lucide-style. YouTube = `rect` (rx 3) + filled play triangle path (no stroke on triangle, only on rect). Instagram = `rect` (rx 5) + center `circle` r=4 + tiny `circle` r=0.8 filled at (17.5, 6.5) for the camera-dot. Both 24x24, currentColor.
- **Footer outside `<main>`**: per brief §pre-flag #3 — page.tsx had `<main>` wrapping all sections, so footer moved outside (sibling), with both wrapped in a top-level fragment. Single `<main>`, single `<footer>` semantic.

### Build/lint output
- `npm run lint` — 0 errors, 0 warnings.
- `npx tsc --noEmit` — 0 errors.
- `npm run build` — exit 0. ✓ Compiled successfully. TypeScript finished clean. Static pages 4/4 generated. Route count unchanged (`/`, `/_not-found`). **Sprint 8 CombinationCard TS regression resolved between sprints** — `components/visuals/CombinationCard.tsx:51` now `const reduced = useReducedMotion() ?? false;` (normalize null→false). That escalation is closed (not by Sprint 9 work; preexisting at sprint start).
- dev server (background, port 3000): `curl -I` 200 after edits, hot-reload picked up changes.

### Known Gaps (deferred / Sprint 9 Out-of-Scope flow-through)
- Real 김윤규 photo — placeholder card only. Single-point swap: `FounderSection.tsx` photo `<div>` block.
- Real email subscription backend (Mailchimp / Resend / etc.) — `mailto:luxual8@gmail.com` interim. Swap CTA Button to a form component when backend exists.
- Real video content — three disabled CTAs share the gap: Hero secondary, Founder primary "방법론 영상 보기", Footer menu "영상". Activate all three when video URL lands.
- Real social account URLs — Footer YouTube/Instagram `<span>` placeholders. Swap each `<span>` to `<a href="...">` (and drop `cursor-not-allowed`/`aria-disabled`).
- Footer menu does not expose 원리/자음/숫자 sections — minimal by design (brief §E).
- `metadataBase` production domain (Sprint 1 carryover) — unchanged.
- Sprint 1~7 carryovers (ㄱ-arm corner fan, og-image, npm audit, ASCII package.json name, FaceDiagram unused, POSE constants hoist, topLabel uppercase, ㅇ cross-fade timing, ConsonantTree root hover path, lib/colors.ts additions) — all still deferred.

### Files created/modified
- `components/ui/Button.tsx` (rewrite — polymorphic union)
- `components/sections/HeroSection.tsx` (CTA cleanup, lines 67-74)
- `components/sections/FounderSection.tsx` (new)
- `components/sections/FooterSection.tsx` (new)
- `app/page.tsx` (added 2 imports, restructured to fragment with `<main>` + `<footer>` siblings)

---

## Sprint 10 — Final polish + ship (BRIEF phases 11+12)
Date: 2026-05-15
Status: COMPLETE — `npm run build` exits 0, `npm run lint` exits 0, all 5 routes prerendered including `/opengraph-image`.

### Shipped
- **Step 1A 정리** — `components/visuals/FaceDiagram.tsx` 삭제(grep 결과 0 import). `BodyDiagram.tsx`는 HeroSection이 import — 유지.
- **Step 1B Sprint 9 carryovers** — 모두 사전 해소된 상태로 확인:
  - `Button.tsx:61` button 분기 destructure `as: _as2,` 대칭 OK
  - `lib/constants.ts` MAILTO_HREF (subject/body 인코딩) Founder + Footer 양쪽 import 확인
- **Step 2 OG 이미지** — 사전 적용 상태로 확인. `app/opengraph-image.tsx` 1200×630 ImageResponse, 시스템 sans-serif, background hex 직접. `app/layout.tsx` openGraph.images 명시 제거, Next.js 자동 채움.
- **Step 4 a11y opacity 점검** — `grep text-foreground/(55|50)` → 단일 hit (`VowelsFaceDiagram.tsx:44`, 안경 SVG 장식, aria 처리됨). 본문 텍스트 사용 0건. fix 불필요.
- **Step 5 빌드 검증** — `npm run build` exit 0, ~3.1s compile, TS clean. 5 static routes: `/`, `/_not-found`, `/opengraph-image`, (+ Next 내부). 동적 OG 이미지 빌드 시점 1회 생성 확인.
- **Step 6 README** — 전체 교체. 한국어. 개요 / 기술 스택 / 로컬 실행 / Vercel 디플로이 / 컴포넌트 구조 / 디자인 시스템 (색상 토큰, 양·음 폴라리티, 타이포, 애니메이션 정책) / 향후 확장(외부 asset swap 지점 5건) / Lighthouse 안내 / 라이선스.

### Deviations from brief
- **Lighthouse 실측 미수행** — 빌드 환경에서 실 브라우저 측정 불가. README에 "첫 배포 후 측정 후 README에 점수 추가 권장"으로 명시. 90+ 기준 충족 여부는 배포 환경에서 검증 필요.
- **반응형 4 viewport 실측 미수행** — 동일 사유. dev 서버 hot-reload 상태에서 코드 레벨 점검만 진행. ConsonantTree(800×1000 viewBox + maxWidth 800 height auto + preserveAspectRatio), ThreeModes (grid-cols-1 md:grid-cols-3), Vowels 표 (flex-wrap gap), Footer (grid-cols-1 md:grid-cols-3) 모두 반응형 props 설정 자체는 적절.
- **키보드 내비게이션 실측 미수행** — Button focus-visible ring(`focus-visible:outline-2 outline-yang`) 코드 확인, polymorphic anchor 변환에도 동일 클래스 유지. 실 Tab 순서 검증은 배포 후.

### Build/lint output (final)
- `npm run lint` — 0 errors, 0 warnings.
- `npx tsc --noEmit` — 0 errors.
- `npm run build` — exit 0, ~3.1s compile. Routes prerendered: `/` (○ Static), `/_not-found` (○ Static), `/opengraph-image` (○ Static).

### Known Gaps (final state — carryover to production)
- **외부 asset 의존**: 김윤규 사진 (FounderSection placeholder), 방법론 영상 URL (Hero + Founder secondary + Footer "영상" 3곳 동시 비활성), 소셜 URL (Footer 유튜브/인스타 span), 이메일 백엔드 (lib/constants.ts MAILTO_HREF).
- **Production 환경 검증 필요**: Lighthouse 4 카테고리 측정, 반응형 4 viewport 실측 (375/768/1280/1920), 키보드 Tab 순서 + focus ring 가시성, prefers-reduced-motion OS 토글 실측.
- **Production URL**: `metadataBase`는 `NEXT_PUBLIC_SITE_URL` 환경변수 기반. Vercel 배포 시 설정 필요.
- **npm audit**: 2 moderate advisories from transitive deps (Sprint 1부터 carryover). 별도 dependency hygiene pass.
- **package.json name**: `hangeul-teaching` (ASCII). 디렉토리는 `한글교수법` 유지. 내부 프로젝트로 acceptable.
- **모바일 호버 등가물**: Vowels 표 / ConsonantTree 호버 path — BRIEF가 데스크탑 호버 한정으로 lock. 모바일은 자동 루프로 정보 전달 완료.

### Files created/modified (Sprint 10)
- `README.md` (전체 교체)
- `handoff/BUILD-LOG.md` (Sprint 10 entry 추가)

### Files NOT touched in Sprint 10 (이미 사전 해소 또는 deferred)
- `components/ui/Button.tsx` — Sprint 9에서 polymorphic 완성
- `lib/constants.ts` — Sprint 9에서 신설
- `app/opengraph-image.tsx` — 사전 작성
- `app/layout.tsx` — 사전 정리 (Pretendard dynamic-subset, og-image asset 참조 제거)
- 모든 section/visual 컴포넌트 — Sprint 1~9에서 완성

---

## 최종 상태 (Sprint 10 후)

- 10개 섹션 완성
- 자동 루프 인터랙션 5개 시각 컴포넌트 (ConsonantRoots, ThreeModes, ConsonantTree, Numbers, AnnotatedBodyDiagram)
- 디자인 토큰 (색상 7개, 폰트 1개, 양·음 폴라리티 잠금)
- 메타데이터 + 동적 OG 이미지
- 키보드 a11y, prefers-reduced-motion, WCAG AA 색상 대비 코드 레벨 확인
- npm run build / lint / tsc 모두 통과
- README 운영용 정식화

Production deploy ready.


