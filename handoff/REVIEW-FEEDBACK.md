# Review Feedback — Sprint 1
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
(none — anything below is either out-of-scope or already logged in BUILD-LOG Known Gaps)

## Escalate to Architect
- **Next.js 15 vs 16.2.6** — Brief stated "Next.js 15" but instructed `create-next-app@latest`, which now installs 16.2.6. Bob followed the literal command. App Router contracts and `--turbopack` are unchanged, build/lint are clean, no API surface in this sprint touches anything that diverges between 15 and 16. Code-level: no problem. Decision needed from Arch: keep on 16.2.6 (recommended — it is what `latest` resolves to and there is no concrete reason to downgrade) or pin to 15.x (only justified if a future dependency demands it). Not a blocker for Sprint 1 either way; later sprints can pin if needed.
- **`metadataBase` placeholder vs wait** — Bob's open question #3. Adds one line of code now or stays a soft warning until production domain is decided. Product-adjacent (the URL itself), so Arch + PO call.

## On Bob's two pre-flagged items
1. **Next 16.2.6 install** — Bob made the right call. Following `create-next-app@latest` literally is correct; flagging the version drift is correct. Escalated above.
2. **`package.json` name `hangeul-teaching` (ASCII alias for `한글교수법`)** — npm package-name spec (RFC-compliant URL-friendly) genuinely forbids the Korean directory name as a `name` field value. The ASCII alias is the only viable fix and is standard practice. Directory remains `한글교수법` as the brief locked. From a code-correctness standpoint this is settled — no further action needed unless this project ever publishes to npm (extremely unlikely for a private landing page). BUILD-LOG already records the rationale. Acceptable.

## Cleared
Reviewed `app/layout.tsx`, `app/globals.css`, `app/page.tsx`, `lib/cn.ts`, `components/ui/Container.tsx`, `components/ui/Button.tsx`, `package.json`, `README.md` against the ARCHITECT-BRIEF Sprint 1 build order — every step (1 through 10) is implemented as specified, build exits 0, lint exits 0, design tokens generate the expected utilities, both Button variants render with correct focus-visible ring on `--color-yang`, and the Korean-path workaround is the right one. Sprint 1 passes.

---

# Review Feedback — Sprint 2
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
(none that block — see notes under "On Bob's three pre-flagged items" and Escalations below)

## Escalate to Architect
- **Button-inside-anchor pattern** (`components/sections/HeroSection.tsx:67-75`) — Bob's open question #2. Brief said "wrap `<Button>` in `<a>`" and Bob followed it literally. The HTML5 spec disallows interactive content (a `<button>` element) inside an `<a>` element. Browsers render it, but the W3C validator and axe-core will flag it; keyboard users may also see two tab stops for one CTA. Two clean fixes exist: (a) extend `Button` with an `as` prop so it can render an `<a>`, or (b) make the primary CTA a styled `<a>` (no Button component) for this one button. Option (a) is the right long-term call (every section's CTA wants this). Option (b) is the smaller change. This is a product/architecture decision — not Bob's call, not mine.
- **Eye stroke geometry — literal vs centered** (`components/visuals/FaceDiagram.tsx:39-40`) — Bob's open question #3. Brief said "x=160 and x=240, length ~16px". Bob centered the strokes on those x-coordinates (152→168, 232→248). The literal "starts at" reading would be 160→176 and 240→256, shifting both eyes 8px right. Centered is the more conventional reading and looks symmetric on the 400-wide viewBox; literal-start would push both eyes off-axis. I would keep centered, but it is a visual-design call so flagging it for Arch.

## On Bob's three pre-flagged items
1. **SVG column responsive width** (`HeroSection.tsx:93`, `mx-auto w-2/3 max-w-[280px] lg:w-full lg:max-w-[420px]`) — Brief did not pin a width, so there is nothing to be wrong with. The chosen ratios are sensible: ~67% width capped at 280px on mobile keeps the figure from dominating, 420px ceiling on desktop matches the `1.2fr_1fr` text/figure balance. Code is clean. No action unless Arch has a visual preference.
2. **CTA anchor wrapping** — Escalated above. Bob's instinct to flag the spec-violation was correct. Code-level acceptable for sprint 2 since it functions; needs an architectural answer before more CTAs accumulate.
3. **Eye stroke length** — Escalated above. Bob's centered interpretation is the better reading of the brief and the math is correct (16px wide, symmetric around the named x-coordinate). I would keep it; flagging only because the brief wording is ambiguous.

## Cleared
Reviewed `app/layout.tsx:5` (metadataBase line), `app/page.tsx` (full file, 11 lines), `components/visuals/FaceDiagram.tsx` (full file, 49 lines), and `components/sections/HeroSection.tsx` (full file, 116 lines) against ARCHITECT-BRIEF Sprint 2. metadataBase fix is correct and removes the warning as claimed. FaceDiagram uses currentColor + text-eum / text-yang exactly per the locked palette; viewBox, stroke-width, role, aria-label, and inline `<title>` all match the brief; geometry is symmetric on the 400×500 canvas. HeroSection layout (2-col grid 1.2fr/1fr on lg, mobile order swap, min-h-screen + 100svh dual-declaration for older browser fallback) matches; Framer staggerChildren entry uses the correct timing (0.1s stagger, 0.7s child duration, 0.3s SVG delay) and will be neutralized by the global `prefers-reduced-motion` rule shipped in Sprint 1; ChevronDown infinite bounce is correctly wrapped in an anchor with its own aria-label so it is a real navigation affordance. Build exits 0, lint exits 0, no new dependencies, no scope drift. Sprint 2 passes.

---

# Review Feedback — Sprint 3
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
- `components/visuals/AnnotatedBodyDiagram.tsx:274-282` — ㄱ-arm hitbox extends to x=168, but the head circle (cx=200 r=44) has visible pixels down to x=156 at y=80. There is a ~12px-wide strip on the head's left arc where hovering the visible head triggers the ㄱ-arm hover (because ㄱ-arm `<motion.g>` is declared after the head group, so it paints on top in SVG document order). The head still hovers correctly across ~90% of its area, so this is not a blocker — but a cleaner fix is either (a) shrink ㄱ-arm hitbox right edge from 168 → 156, or (b) reorder the groups so head is declared after ㄱ-arm. Option (a) is the smaller change.
- `components/visuals/AnnotatedBodyDiagram.tsx:21` (JSDoc) — Bob's open question #3 says "26° splay each side." The actual geometry from apex (200, 324) to (140, 540) is atan(60/216) ≈ 15.5° from vertical (~31° total spread). Visually it reads as ㅅ correctly, so no geometry change needed — but the docstring number should match reality. Update the comment or add a "splay ≈ 15.5° from vertical" note so future-you doesn't widen it chasing the wrong target.

## Escalate to Architect
(none — both items above are pure code-level cleanups within Bob's scope)

## On Bob's three pre-flagged items
1. **Hardcoded hex (#E85D3C, #2C3E62) duplicated from CSS tokens** — Acceptable. Framer Motion `fill` animations require literal color strings, not CSS variables or Tailwind classes, so this is a framework constraint, not a code smell. Bob already centralized the constants at the top of the file (`YANG`, `EUM`, `FOREGROUND`) so the duplication is local and findable. A shared `lib/colors.ts` only earns its keep when a third diagram needs the same animation pattern — defer until then. BUILD-LOG already records this. No action.
2. **ㄱ-arm corner fan-effect on hover** — Real but acceptable. Each perpendicular segment scales 1.08x around its own midpoint (vertical mid (148, 110), horizontal mid (168, 66)), so the corner at (148, 66) shifts ~3.5px on the vertical axis and ~1.6px on the horizontal. Subtle enough that it reads as "the arm flexes" rather than "the corner broke apart" — actually a subtle plus, gives the static glyph a tiny bit of life. If Arch wants a tighter rigid-body scale, the fix is collapse the two `<motion.line>` elements into one `<motion.polyline points="148,154 148,66 188,66" />` with `transformOrigin: "168px 110px"` (center of the L bounding box). Either way works. I would keep current behavior — it is on-brand for a body diagram. Defer to Arch if there is a stronger view.
3. **ㅅ-legs reading at current splay** — Geometry reads as ㅅ correctly. Apex (200, 324), endpoints (140, 540) and (260, 540): single vertex at hip + two diverging strokes is the unambiguous ㅅ silhouette, distinct from Hero BodyDiagram's parallel rectangles. The 120px-wide base over 216px height gives a balanced glyph proportion (close to the 1:1.8 ratio of Pretendard ㅅ). The actual splay angle is ~15.5° from vertical per side, not 26° as Bob's note claims (see Should Fix #2 — docstring fix). Visually fine, no widen/narrow needed.

## Cleared
Reviewed `app/globals.css` (full 23 lines), `app/page.tsx` (full 13 lines), `components/sections/ProblemSection.tsx` (full 56 lines), `components/sections/BigIdeaSection.tsx` (full 55 lines), and `components/visuals/AnnotatedBodyDiagram.tsx` (full 370 lines) against the ARCHITECT-BRIEF Sprint 3 spec. `--color-background-muted` token is the right hex (~4% darker than `--color-background`) and Tailwind v4 generates `bg-background-muted` correctly. ProblemSection uses `whileInView` + `viewport={{ once: true, amount: 0.3 }}` + `staggerChildren: 0.18` exactly as briefed; five sentences are verbatim; emphasis line gets `text-yang font-bold` correctly; typography ramp 3xl/5xl/6xl matches. BigIdeaSection uses `<span className="block">` instead of `<br />` (semantically cleaner — good), correctly overrides diagram color from `text-eum` to `text-foreground` for contrast on muted bg, stagger reveals headline → sub → diagram in the right order. AnnotatedBodyDiagram: 7 interactive parts + 1 passive arm, every motion shape carries explicit `transformOrigin` + `transformBox: "fill-box"` (the SVG scale-translation glitch fix), color mapping yang/eum/neutral matches Arch §E, hitboxes cover shape+label per part, ㄱ-arm placed at viewBox-left per Korean salute convention, legs splay from single hip apex to form ㅅ vs Hero's parallel rectangles, accessibility (role, aria-label, inline title) carries the locked string from brief §D verbatim. Build exits 0, lint exits 0, no new dependencies. Sprint 3 passes.

---

# Review Feedback — Sprint 4
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
(none — all advisories below are non-blocking)

## Escalate to Architect
(none — every Sprint 4 decision is defensible at the code level)

## On Bob's three pre-flagged items
1. **Headline left-aligned** (`components/sections/VowelsSection.tsx:96`) — Correct call. The headline, the 3-line sub paragraph, and the 천지인 italic quote are all full-width left-anchored blocks; centering only the h2 would have created a hard visual break where the sub paragraph re-anchors left. Left-aligned also reads naturally with the lg-breakpoint 2-col grid where the face diagram sits in the left column. Keep.
2. **Base PostureIcon shown on all 4 rows including 두 팔 rows** — Correct call. The "base + arm pattern → derived vowel" formula is the entire pedagogical payload of this table; omitting the base on rows 2/4 would force the reader to mentally carry it down from rows 1/3. With all 4 rows starting from the same column position, the eye reads the table as a clean 4×N grid and the formula stays visible at every row. Keep.
3. **Glasses bridge geometry** (`components/visuals/VowelsFaceDiagram.tsx:51`) — Geometry is correct. Lenses at (130, 150) r=22 and (190, 150) r=22; bridge spans (152, 150) → (168, 150), exactly the inner edges of the two lenses, 16px wide at the same y as both lens centers. No overlap with nose (starts y=180), philtrum (y=234), or mouth (y=250). The minor advisory below is purely terminological.

## Sprint 3 carryover verification
1. **ㄱ-arm hitbox 12px reduction** (`components/visuals/AnnotatedBodyDiagram.tsx:368-377`) — Verified. `<rect x={48} width={108}>` puts the right edge at x=156, exactly as Sprint 3 reviewer requested (168 → 156). Clean.
2. **Docstring geometry note** (`components/visuals/AnnotatedBodyDiagram.tsx:22-23`) — Verified. Now reads "ㅅ-legs geometry: apex (200, 324) → (140, 540) and (260, 540). 다리 한 쪽이 수직으로부터 atan(60/216) ≈ 15.5° 벌어진다." atan(60/216) = atan(0.2778) ≈ 15.524°. Math is correct, geometry is correctly documented, no stale "26°" string remains in the file. Resolved.

## Advisories (non-blocking)
- `components/visuals/VowelsFaceDiagram.tsx:50` — Comment calls the bridge "안경 다리". Colloquially "안경 다리" usually refers to the **temples** (the side arms behind the ears), not the bridge between lenses (브릿지 / 코받침). The element rendered is geometrically a bridge. Code is correct, the inline comment is the only thing slightly off. Trivial — fix on a future pass when the file is open for other reasons.
- **Base/result polarity asymmetry** (Bob's open question #3) — Reads as intentional. Base PostureIcons sit in their fixed yang/eum identity (the body's default state); result icons start neutral (`text-foreground`) and adopt yang/eum on hover. That visually encodes the pedagogical claim "base posture = stable axis, derived vowel = reactive transformation" — exactly the metaphor the section is selling. If anything, the asymmetry strengthens the read. Keep as-is.
- **사용자 관점 설득력 (advisory only — Sprint 4 is the section where the 10 vowels first enumerate, so this is the impact moment)**: The closing line "= 모음 10자. 외울 게 아니라 자세로 알아차립니다." carries the punchline correctly, and the row-hover yang/eum reveal is a clean payoff. The one thing a first-time reader might want: a single visual cue tying "base ㅣ" (standing-base, yang) and "base ㅡ" (lying-base, eum) back to the face diagram's nose=ㅣ / mouth=ㅡ on the left column. Currently the reader has to make that connection themselves by noticing the colors match. Not a defect — the brief did not call for an explicit visual bridge — and at the impact-section moment a *little* work for the reader is good (it converts a passive read into a "oh, I see it" moment, which is exactly the pedagogical claim the section is making). Worth Arch's note for Sprint 5+ if a connector or a one-line caption ever earns its keep, but do not retrofit now.

## Cleared
Reviewed `components/visuals/AnnotatedBodyDiagram.tsx` (lines 1-30 docstring + lines 355-417 ㄱ-arm group), `components/visuals/PostureIcon.tsx` (full 165 lines), `components/visuals/VowelsFaceDiagram.tsx` (full 158 lines), `components/sections/VowelsSection.tsx` (full 198 lines), and `app/page.tsx` (full 16 lines) against the ARCHITECT-BRIEF Sprint 4 spec. Sprint 3 carryovers (ㄱ-arm hitbox, docstring) both correctly applied with structurally-located fixes (line numbers shifted from interaction-enhancement pass — Bob located by content, not line, which is the right discipline). PostureIcon: 10-variant exhaustive union, currentColor stroke, server component, aria-hidden — correct. VowelsFaceDiagram: 320×360 viewBox per brief, foreground/50 glasses, yang nose / eum mouth / neutral philtrum, role/aria-label/title carry the locked accessibility string verbatim. VowelsSection: data-driven ROWS constant correctly maps the 8 derived vowels with locked yang/eum polarity (ㅏㅑㅗㅛ yang, ㅓㅕㅜㅠ eum), Tailwind v4 `text-yang|eum` and `group-hover:text-yang|eum` are full literal strings so JIT detects them, `staggerChildren: 0.15` + fadeUp 0.7s easeOut matches brief, headline/sub/quote/grid/closing rendered in correct order, hover affordance (`hover:bg-foreground/[0.03]` on group + `group-hover:scale-110` on result icons + color shift on text/icon) is the right mix of subtle and clear. Build exits 0, lint exits 0, no new dependencies, no scope drift. Sprint 4 passes.

# Review Feedback — Sprint 5
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
- `components/visuals/PostureMorphGiyeok.tsx:95-115` and `components/visuals/PostureMorphNieun.tsx:78-105` — Brief D3 explicitly called for "두 자세 좌표를 컴포넌트 내부 상수로 선언 (POSE_ATTENTION/POSE_SALUTE, POSE_LYING/POSE_SITTING)". Bob inlined the coordinates into `initial`/`animate` literals on each `motion.line` / `motion.circle` instead. Functionally identical; readability and future-tweak-ergonomics are weaker. Recommendation: hoist to `const POSE_ATTENTION_L1 = { x2: 116, y2: 110, stroke: EUM }` style consts (or grouped objects) at file top. Non-blocking — fix in next pass when either file is open for other reasons. Log to BUILD-LOG if not done inline.

## Escalate to Architect
- **Open Question #2 — ㄴ emphasis strength.** Bob shipped stroke-width 2→3 + EUM throughout per BRIEF D2 strict reading, declining the BRIEF flag #3 latitude (3.5px or temporary darker shade). This is a visual-judgment call best made on the rendered comparison at desktop 240px side-by-side, not a code defect. Decision needs Arch eyes (or Project Owner glance) at `http://localhost:3000#consonant-roots`. If the ㄱ-yang side overpowers the ㄴ-eum side visually, two-line bump is trivial follow-up. Code is correct as-is; flagging because the brief explicitly invited the choice.

## On Bob's two pre-flagged decisions
1. **`onViewportEnter` vs `whileInView` callback** (`PostureMorphGiyeok.tsx:70-75`, `PostureMorphNieun.tsx:66-71`) — Correct call. Framer Motion's `whileInView` is a variant-name string for the variant system (the viewport analog of `animate`), not a callback prop. The brief's wording "whileInView 콜백" in D3 / Build Order #1 was loose phrasing that conflated the variant prop with the viewport-callback pattern. `onViewportEnter` paired with `viewport={{ once: true, amount: 0.5 }}` is the idiomatic Framer Motion way to fire `setMorphed(true)` on first viewport entry at 50% visibility — which is exactly the observable behavior the brief specifies. No refactor needed; Bob's read of the framework is correct.
2. **Derived state instead of `useEffect` for reduced-motion** (`PostureMorphGiyeok.tsx:41-44`, `PostureMorphNieun.tsx:38-41`) — Strictly better. `react-hooks/set-state-in-effect` exists for a real reason (synchronous setState in effects forces a second render and can cascade). `const morphed = reduced ? true : internalMorphed` produces the identical observable behavior brief D4 specified — reduced-motion users see the end pose statically (because handlers early-return on `reduced`, so internalMorphed never matters anyway, and the derived expression pins display to `true`). One-line equivalent of the would-be effect. Keep.

## Spec compliance verification
- D1 components / paths: all 3 new files at correct paths, Giyeok+Nieun in `components/visuals/`, section in `components/sections/`. Correct.
- D2 visual language: 200×200 viewBox both ✓, 2px stroke ✓, `text-eum` default ✓, ㄱ-arm two motion.lines stroke EUM→YANG ✓, ㄴ stroke-width 2→3 with EUM throughout ✓, static parts (head/torso/opposite arm/legs in Giyeok) preserved ✓.
- D3 morphing: motion.line/motion.circle with coordinate interpolation (no path-d morphing) ✓, `{ duration: 1.2, ease: "easeInOut" }` ✓, single boolean state `morphed` ✓, hover-reset-then-replay via `setMorphed(false)` + `requestAnimationFrame(() => setMorphed(true))` ✓ (rAF is a defensible reading of "다음 tick"), `onHoverEnd` → `setMorphed(true)` end-state guarantee ✓. Coordinate constants: see Should Fix above.
- D4 reduced-motion: derived state path ✓, handlers no-op via early `return` when `reduced` ✓, end-pose static render preserved ✓.
- D5 layout: `grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16` ✓, `max-w-[240px]` ✓, label/description structure ✓, ㄱ-yang / ㄴ-eum inline color emphasis ✓.
- D6 background: `bg-background` ✓.
- D7 copy: All 5 strings byte-verbatim against brief — headline "몸의 두 자세에서 자음이 태어납니다", left label "차렷 + 경례 = ㄱ (양자음)", left desc "서서 거수 경례하는 팔의 모양. 한글 자음의 양의 뿌리.", right label "누움 + 앉음 = ㄴ (음자음)", right desc "누웠다가 앉는 다리의 모양. 한글 자음의 음의 뿌리.", closing "단 두 자세. 여기서 자음 14자가 모두 자라납니다." ✓.
- D8 entrance motion: parent motion.div, `whileInView`, `viewport={{ once: true, amount: 0.2 }}`, `staggerChildren: 0.18`, fadeUp variant (opacity 0→1, y 24→0, duration 0.7, easeOut) — all match VowelsSection pattern as required ✓.
- Accessibility: `role="img"` + matching aria-label + inline `<title>` on both morph SVGs ✓; aria-label strings match brief example wording verbatim ✓; section `aria-label="자음의 두 뿌리"` ✓.
- "use client" on all 3 new files ✓. Color hex constants at file top per AnnotatedBodyDiagram pattern ✓ (Nieun correctly omits YANG since no color interpolation needed).
- `app/page.tsx`: import + render after `<VowelsSection />` ✓.

## Cleared
Reviewed `components/visuals/PostureMorphGiyeok.tsx` (full 119 lines), `components/visuals/PostureMorphNieun.tsx` (full 108 lines), `components/sections/ConsonantRootsSection.tsx` (full 74 lines), and `app/page.tsx` (full 17 lines) against ARCHITECT-BRIEF Sprint 5 (D1–D8 + Build Order + Acceptance + Bob 사전 플래그 1–3). Both flagged Bob decisions (onViewportEnter callback pattern, derived-state reduced-motion handling) verified against the brief's intent and accepted — they preserve identical observable behavior while resolving framework-API and ESLint constraints the brief's literal wording overlooked. All 5 brief-locked copy strings verbatim. All animation timing constants and viewport amounts match. Coordinate inlining vs POSE constant declaration is the only deviation (Should Fix, non-blocking). ㄴ emphasis strength escalated to Arch as a visual-judgment heads-up on Bob's open question #2 — code itself is brief-compliant. Build/lint clean per Bob. Sprint 5 passes.

# Review Feedback — Sprint 6
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
(none — all four Bob pre-flags resolved correctly per BRIEF-locked defaults; no inline tweaks warranted)

## Escalate to Architect
- **Open Question #2 — topLabel placement and tone (mini-header above SVG, uppercase tracking-wide on Korean text).** BRIEF B defines topLabel as a prop (직각으로 닫음 등) but BRIEF C 4-item visual structure (1.SVG → 2.결과 글자 → 3.bottomLabel → 4.description) does not list it. Bob placed it as text-sm md:text-base font-medium text-foreground/60 uppercase tracking-wide mini-header above the SVG. Two visual-judgment concerns, both flagged in Bob REVIEW-REQUEST Open Q #2:
  1. uppercase is a visual no-op on Korean characters (Korean has no case). The class compiles cleanly but contributes nothing — consider removing for hygiene, even though it does no harm.
  2. tracking-wide on CJK can read as stretched/awkward, especially on the 2-character 벌림 topLabel where the gap between glyphs becomes prominent. Worth Arch eye on rendered output.
  Code is functionally brief-compliant; this is a where-does-topLabel-live gap in BRIEF C that Bob filled reasonably. If Arch wants the topLabel removed entirely, demoted to a tiny eyebrow style without uppercase/tracking, or repositioned (e.g. between SVG and result glyph), that is an Arch call.

- **Open Question #1 — ㅇ카드 line fade vs circle draw cross-fade naturalness.** Bob shipped BRIEF §D2 verbatim timing: line fade delay:0.8 duration:0.5 (ends 1.3s), circle draw delay:0.8 duration:0.7 (ends 1.5s). Both start simultaneously at t=0.8s, with overlapping cross-fade window. BRIEF flag #2 explicitly invited a latitude shift (line fade dur→0.7 OR circle delay→0.9) if rendered output reads as 사각형이 너무 갑자기 사라짐. This is a visual judgment best made on http://localhost:3000#three-modes at desktop card width, not a code defect. Code is brief-compliant; flagging because the brief explicitly invited the choice and BRIEF declared this section 가장 시각 임팩트 큰 섹션 — getting the ㅇ morph right matters.

## Visual/UX advisory (non-blocking, not Must Fix)
- **3 카드 topLabel 길이 비대칭**: 직각으로 닫음 (5자) / 곡선으로 닫음 (5자) / 벌림 (2자). The third card mini-header reads as visually orphaned at the same type size as the other two. Not a code issue — copy is BRIEF-locked. If Arch revisits topLabel rendering (Escalation above), this asymmetry should factor into the decision (e.g. demoting topLabel to a smaller eyebrow style would reduce the imbalance). No action required from Bob.
- **Nested whileInView on 5자 마무리 컨테이너 (ThreeModesSection.tsx:97-99)**: The 5-glyph stagger has its own viewport once+amount:0.5 independent from the parent section staggerChildren:0.18. On min-h-screen sections this typically works fine (the inner viewport check fires after parent cascade reaches that depth), but the two triggers are not formally coordinated. If during QA the 5자 pop-in feels desynchronized from the cascade, lowering inner amount to 0.3 or moving the stagger onto glyphPop parent variant would tighten coupling. Not a defect; flagged as a known asynchrony for future polish.
- **Three-card row trigger near-simultaneous on md:grid-cols-3 rows**: All three cards hit 50 percent viewport at the same scroll position and fire onViewportEnter within ~1 frame of each other. BRIEF E explicitly says 카드 사이 동기화 X so this is intentional, but the visual effect is three things start together rather than a left-to-right cascade. If Arch later wants a left-to-right cascade for the marquee section, would need either a parent-level orchestrator passing per-card delay, or tying card SVGs into the parent staggerChildren via Framer variant cascade through SVG props (non-trivial — Framer variant cascade through motion.svg children is restricted). Documenting now to avoid surprise.
- **Card border-foreground/10 retained on bg-background-muted**: BRIEF flag #4 invited removing border or swapping for shadow-sm. Bob retained the brief default. Likely fine on warm beige muted background — bg-background cards have natural contrast lift. Arch eye optional; visual judgment only.

## Spec compliance verification
- **Files & paths**: components/visuals/CombinationCard.tsx ok, components/sections/ThreeModesSection.tsx ok, app/page.tsx import + render after ConsonantRoots ok.
- **Trigger pattern (Sprint 5 PostureMorph parity)**: useReducedMotion() + derived merged = reduced ? true : internalMerged ok (CombinationCard.tsx:52-54), onViewportEnter + viewport once+amount:0.5 on motion.svg ok (lines 95-100), handleHoverStart resets+rAF ok (lines 56-60), handleHoverEnd settles on merged-true ok (lines 62-65). Identical pattern to PostureMorphGiyeok.tsx:41-56 / :70-75.
- **Coordinate verbatim from BRIEF §D**: ㄱ start (40,40)→(80,40) + (80,80) ok (lines 156, 166); ㄴ start (120,120)→(120,160) + (160,160) ok (lines 176, 186). All three modes share these starts, preserving BRIEF 같은 입력 → 다른 결과 thesis.
- **(a)안 슬라이드-앤-머지-앤-모프 부합**:
  - **close-corner (D1 → ㅁ)**: ㄱ → top+right edges (60,60)→(140,60), (140,60)→(140,140) ok; ㄴ → left+bottom edges (60,60)→(60,140), (60,140)→(140,140) ok; stroke EUM 유지 ok; single SLIDE_TRANSITION 1.0s easeInOut ok.
  - **close-curve (D2 → ㅇ)**: 4 lines slide to D1-equivalent rectangle positions ok; lines fade strokeOpacity → 0 (delay 0.8, dur 0.5) ok; circle r=40 at (100,100) draws via pathLength 0→1 + strokeOpacity 0→1 (delay 0.8, dur 0.7) ok; per-prop transition object so coordinates animate over SLIDE_TRANSITION while strokeOpacity uses lineFade ok.
  - **open-spread (D3 → ㅅ)**: ㄱ first line (40,40)→(80,40) morphs to (100,60)→(60,140) ok; ㄴ first line (120,120)→(120,160) morphs to (100,60)→(140,140) ok; second lines stay at start coords with strokeOpacity → 0 (delay 0.5, dur 0.5) ok; first lines stroke EUM → YANG (delay 0.5, dur 0.7) ok.
- **Result glyph motion.p**: text-7xl md:text-8xl font-bold ok (line 123), polarity → text-yang/text-eum ok (line 68 + 122-125), aria-hidden=true ok (line 118), transition duration:0.5 delay:1.4 ok (line 121), tied to card own merged state (not parent stagger) so SVG end and glyph entry stay paired ok.
- **Result glyph polarity locks (BRIEF §F + CONSONANT-TREE-REFERENCE)**: ㅁ/ㅇ → eum, ㅅ → yang ok (ThreeModesSection.tsx:64, 72, 80).
- **Card container**: flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-background border border-foreground/10 ok (line 73). BRIEF flag #4 default retained.
- **Section structure (BRIEF §F)**: section id=three-modes aria-label=ㄱ과 ㄴ의 세 결합 모드 ok (lines 28-31), min-h-screen pt-40 pb-20 flex flex-col justify-center bg-background-muted ok (line 31), parent motion.div whileInView + viewport once+amount:0.2 + staggerChildren:0.18 ok (lines 34-39), fadeUp variant matches Sprint 5 ConsonantRootsSection pattern ok (lines 7-10).
- **Copy verbatim against BRIEF §F**: headline 같은 두 글자, 세 가지 결합 방식 ok (line 45); sub ㄱ과 ㄴ을 어떻게 합치느냐에 따라 세 개의 새 자음이 태어납니다. 사람 몸이 그것을 그대로 보여줍니다. ok (line 53); 3 카드 topLabel/bottomLabel/description × 3 ok (lines 61-84); closing = 초자음 5개 완성 ok (line 93). All glyph-level exact match.
- **마무리 5자**: 순서 ㄱ ㄴ ㅁ ㅅ ㅇ ok (lines 18-24), polarity ㄱ/ㅅ yang + ㄴ/ㅁ/ㅇ eum ok (FINAL_GLYPHS const), text-5xl md:text-7xl (smaller than card text-7xl/8xl per BRIEF flag #3) ok (line 100), nested staggerChildren 0.12 ok (line 99), glyphPop = scale 0.7→1 + opacity 0→1, transition duration:0.5 ease:backOut ok (lines 12-15, 105-106).
- **Grid**: grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-12 md:mt-16 ok (line 59) — matches BRIEF E (mobile stack, ≥md three-column). Note: BRIEF E §태블릿 explicitly chose md:grid-cols-3 (not 2-col at md) to preserve the 3-way visual comparison; correctly preserved.
- **Accessibility**: each CombinationCard SVG has role=img + matching aria-label + inline title (lines 85-86, 102), aria-label string format {topLabel} — {result}로 결합되는 ㄱ과 ㄴ matches BRIEF H example ok (line 67); result p aria-hidden=true ok; 5자 spans render as plain text for SR ok.
- **prefers-reduced-motion**: derived state pins display to merged-true ok (line 54), hover handlers early-return on reduced ok (lines 57, 63). Triggers no-op as required.
- **Build/lint**: npm run lint 0 errors / 0 warnings; npm run build exits 0, 4 static routes (same count as Sprint 5).

## Cleared
Reviewed components/visuals/CombinationCard.tsx (full 543 lines — top trigger plumbing 43-114, CloseCornerShape 151-196, CloseCurveShape 208-380, OpenSpreadShape 391-542), components/sections/ThreeModesSection.tsx (full 118 lines), and app/page.tsx (full 19 lines) against ARCHITECT-BRIEF Sprint 6 (B/C/D/D1-D3/E/F/G/H/I + Build Order + Bob 사전 플래그 1-4). All four Bob pre-flags resolved correctly per BRIEF-locked defaults: (1) coordinates kept verbatim, no micro-tweak needed; (2) ㅇ cross-fade timing verbatim per BRIEF §D2 (line fade 0.8/0.5 + circle draw 0.8/0.7) — visual judgment escalated; (3) 마무리 5자 text-5xl md:text-7xl correctly smaller than card result text-7xl md:text-8xl, visual hierarchy preserved; (4) border border-foreground/10 retained on bg-background-muted background. Architect locked (a)안 슬라이드-앤-머지-앤-모프 fully satisfied: all three modes share identical ㄱ/ㄴ start coordinates ((40,40)/(80,40)/(80,80) for ㄱ + (120,120)/(120,160)/(160,160) for ㄴ), proving the 같은 두 글자, 다른 결합 thesis visually. Sprint 5 PostureMorph trigger pattern (useReducedMotion derived state + onViewportEnter once+amount:0.5 + hover reset/rAF/replay) cloned verbatim. All BRIEF §F locked copy strings glyph-verbatim. Polarity mapping correct everywhere. Build exits 0, lint exits 0, 4 static routes preserved (no route count drift). Two items escalated to Arch as visual-judgment-only (topLabel uppercase/tracking on Korean, ㅇ cross-fade naturalness) — code itself is brief-compliant. Sprint 6 passes.


---

# Review Feedback — Sprint 7 (ConsonantTreeSection + ConsonantTree + lib/colors.ts)
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
(none — items below are advisory only, not blocking)

## Escalate to Architect
(none — no product decisions surfaced)

## Verification

### Canonical mapping (CONSONANT-TREE-REFERENCE.md)
- `components/visuals/ConsonantTree.tsx:45-52` — `CONSONANT_DATA` matches the canonical table exactly:
  ㄱ(yang)→ㅋ→ㄹ / ㄴ(eum)→ㄷ→ㅌ / ㅁ(eum)→ㅂ→ㅍ / ㅅ(yang)→ㅈ→ㅊ / ㅇ(eum)→ㅎ→null. 14 glyph total = 5 + 5 + 4. ㅇ row +2 slot is rendered as dim em-dash (foreground/30) at line 366-380. Correct.
- `components/sections/ConsonantTreeSection.tsx:35-54` — `FINAL_INITIAL` / `FINAL_PLUS1` / `FINAL_PLUS2` polarity inheritance verified glyph-by-glyph: ㅋㄹ=yang (ㄱ root), ㄷㅌ=eum (ㄴ root), ㅂㅍ=eum (ㅁ root), ㅈㅊ=yang (ㅅ root), ㅎ=eum (ㅇ root). All 14 follow Sprint 3 locked polarities. Correct.

### lib/colors.ts extraction (Sprint 5/6 carryover resolved)
- `lib/colors.ts:14-16` — YANG/EUM/FOREGROUND constants. JSDoc explicitly mirrors `app/globals.css:6-8` `@theme` tokens; sync obligation called out. Clean.
- `components/visuals/AnnotatedBodyDiagram.tsx:6` — imports YANG/EUM/FOREGROUND; only `CONNECTOR_REST="#6B6B6B"` retained as local (correct — connector grey is not in the shared palette). No leftover YANG/EUM/FG hex literals in code; only the JSDoc comment block at lines 19-20 still mentions hex (intentional documentation). No behavior change.
- `components/visuals/VowelsFaceDiagram.tsx:2` — imports all three. No remaining hex literals for these colors. No behavior change.
- `components/visuals/PostureMorphGiyeok.tsx:6` — imports YANG/EUM. No remaining hex literals (line 14 mention is JSDoc). No behavior change.
- `components/visuals/PostureMorphNieun.tsx:6` — imports EUM only. No remaining hex literals. No behavior change.
- `components/visuals/CombinationCard.tsx:6` — imports YANG/EUM. No remaining hex literals. No behavior change.
- `app/page.tsx:7,18` — `ConsonantTreeSection` imported and placed after `ThreeModesSection`. Correct flow position.

### 5-stage cascade timing
Stages start at t = 0 / 0.5 / 1.3 / 2.0 / 3.0 (`ConsonantTree.tsx:91, 100, 126, 151, 178`). Stage durations: 1=0.5s, 2=0.5/0.7s, 3=0.6s, 4=0.5s + 0.15 stagger, 5=0.4 header + 0.35 cell × 0.08 stagger × 0.12 row stagger. Top-down ordering preserved. The `viewport={{ once: true, amount: 0.2 }}` trigger on the parent `motion.svg` (line 428) is the single cascade root, so absolute-time `delayChildren` values resolve cleanly. Reduced-motion: `t()` and `dur()` both collapse to 0; all `hidden`→`show` transitions snap immediately. Correct.

### Hover synchronization
- `ConsonantTree.tsx:215-225` — `isActive(glyph)` returns true for the hovered glyph itself, and additionally for the row's root when a plus1/plus2 cell is hovered. Tree-root hover does not propagate to row cells (deliberate per BRIEF "단순화" note).
- `ConsonantTree.tsx:237-255` — `hoverPath` is constructed only when the hover target is a plus1/plus2 cell; root hover yields no path. Correct per Bob's spec.
- `ConsonantTree.tsx:228-231` — non-active glyphs dim to opacity 0.4. All 14 glyphs participate via `opacityFor`. Correct.

### Accessibility
- Single `<title>` element is the first child of `motion.svg` (`ConsonantTree.tsx:430`), mirroring the `aria-label` (line 419). Screen-reader contract honored.
- The hover-path `<line>` has `pointerEvents="none"` (line 553), so it cannot intercept mouse from the underlying glyphs. Correct.

## Advisory (non-blocking — Bob and Arch judgment calls)

1. **Hover path dashed line crosses dimmed glyph regions.** Bob already flagged this in REVIEW-REQUEST Open Questions. Long diagonals like ㅋ-hover (240,160 → 440,620) and ㅌ-hover (560,160 → 600,700) traverse the entire tree-to-matrix gap and pass over/near unrelated rows. With the non-active glyphs at opacity 0.4 and the dashed line at opacity 0.5 + strokeDasharray "6 4", the visual weight should be tolerable, but worth a live eye-check. If it reads messy, two cheap fixes: (a) drop line opacity to ~0.35, or (b) convert to a 2-segment polyline that drops vertically from the root before bending — keeps the path off other rows. Not a Must Fix; ship and observe.

2. **Stage 4 stagger applies to lines + nodes together (6 children).** `stage4Group` (line 147-155) has `staggerChildren: 0.15`, and the SVG renders 3 lines then 3 glyph nodes as direct children. Stagger order is line₁(0)→line₂(0.15)→line₃(0.3)→ㅁ(0.45)→ㅇ(0.6)→ㅅ(0.75). Total stage-4 span = 2.0 + 0.75 + 0.5 = 3.25s, but stage 5 begins at t=3.0 — a ~0.25s overlap of the last node (ㅅ) with the matrix header fade-in. Visually probably fine because they're in different y-bands, but if the cascade should read strictly serial, either (a) bump stage 5 delay to t=3.3, or (b) split stage 4 into two nested groups (lines staggered, then nodes staggered). Brief said "위에서 아래로 한 단계씩" — slight overlap doesn't violate the spirit. Not a Must Fix.

3. **14-glyph enumeration impact in the closing box.** The closing box (`ConsonantTreeSection.tsx:106-122`) is the literal answer to the user's "14자 enumeration 설득력" critique. It does deliver — all 14 are visible, color-grouped by polarity, and the "2 뿌리 + 3 결합 + 2 획 추가" sentence ties it back to the system. One micro-suggestion if Bob has 3 minutes: the three `|` separators are `text-foreground/20` plain pipes — at 3xl/4xl font weight they may read as stronger column dividers than intended. Tested in head: a thin vertical-rule `<span>` (`h-[1em] w-px bg-foreground/15`) reads more cleanly than glyph-pipes. Cosmetic only — the current implementation is correct.

4. **Polarity column labels "(양)/(음)" in the matrix row label slot (`ConsonantTree.tsx:579-591`)** are not in the BRIEF as a required element, but they reinforce the polarity coloring legend rather than introducing new concepts. Technically a small scope addition, but it directly supports the canonical reference's "양/음 계열" semantic and makes the matrix self-explanatory. Acceptable drift.

## Cleared
Reviewed `lib/colors.ts`, `components/visuals/ConsonantTree.tsx`, `components/sections/ConsonantTreeSection.tsx`, the lib/colors.ts import edits in 5 visual components (AnnotatedBodyDiagram / VowelsFaceDiagram / PostureMorphGiyeok / PostureMorphNieun / CombinationCard), and `app/page.tsx` integration. Canonical 14-glyph mapping is verbatim, polarity inheritance is correct on all 14, the 5-stage cascade resolves cleanly, hover sync and reduced-motion both behave per spec, accessibility contract is intact, and the lib/colors.ts extraction produces zero rendering delta in the 5 modified components. Sprint 7 passes.

---

# Review Feedback — Sprint 8 (NumbersSection + NumberGlyph)
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
- `components/visuals/NumberGlyph.tsx:71` — Inconsistent `useReducedMotion()` handling. The carryover patch normalized the `boolean | null` return to `boolean` via `?? false` in PostureMorphGiyeok:27, PostureMorphNieun:29, ConsonantTree:69, and CombinationCard:51. NumberGlyph is the only `useReducedMotion`-consuming visual that does not. It compiles today because `reduced` is only consumed in truthy positions (`if (reduced)`, ternaries) and never passed as a typed `boolean` prop, so behavior is identical. This is purely a consistency nit — apply `const reduced = useReducedMotion() ?? false;` to keep the five visuals uniform and to be defensively typed if a future refactor passes `reduced` to a sub-component. Under-5-minute fix.

## Escalate to Architect
(none)

## Verification of carryover TS fix
- **`useReducedMotion() ?? false`** applied in CombinationCard:51, PostureMorphGiyeok:27, PostureMorphNieun:29, ConsonantTree:69. Verified semantics-preserving:
  - Hook returns `boolean | null` (null pre-mount / SSR). `null` and `false` are identically falsy in every consumer position used (`if (reduced) return;`, `reduced ? X : Y`).
  - In CombinationCard, `<CloseCornerShape reduced={reduced} />` (lines 102-104) now satisfies the sub-component `{ reduced: boolean }` signature without widening it. The fix is cleaner than Bob's option (a) — single normalization at the hook call site rather than three coercions at the prop sites — and preserves the original `boolean`-only semantic of the sub-components.
  - `npm run build` confirmed exit 0 (TypeScript phase finishes in 3.4s, all routes prerender).
  - Verdict: correct fix, well-chosen.

## Sprint 8 spec compliance
- **NumberGlyph variant divergence (yang=W+△ vs eum=M+○).** W vertices `(40,220)→(90,80)→(120,200)→(150,80)→(200,220)` (line 38-44) match BRIEF verbatim. M vertices `(40,80)→(90,220)→(120,100)→(150,220)→(200,80)` (line 46-52) match BRIEF verbatim. Numbers 1·2·3·4 (W) and 6·7·8·9 (M) are mapped to the four segments in stroke-start order, honoring BRIEF "획 수가 그대로 숫자의 값". △ at `120,30 / 100,60 / 140,60`, ○ at `cx=120 cy=250 r=14` — both BRIEF-locked coordinates. "5 (↑)" / "0 (완성)" labels present.
- **Auto-loop pattern consistency.** `cycleKey + setInterval(LOOP_INTERVAL_MS=5500) + key remount + onHoverStart replay + reduced-motion guard` (NumberGlyph:72-86, 102, 111). Identical structure to PostureMorphGiyeok / PostureMorphNieun / CombinationCard. LOOP_INTERVAL_MS=5500 matches BRIEF justification ("4.5s sequence + 1s pause, longer than 3500 because more elements + 보너스 톤"). Reduced-motion path correctly skips setInterval AND zeroes all transitions for instant terminal pose. Hover replay correctly no-ops under reduced-motion.
- **Bonus tone (no `min-h-screen`).** NumbersSection uses `pt-24 md:pt-32 pb-20 md:pb-24 bg-background-muted` (line 33) — exactly the BRIEF token. No `min-h-screen`, no `flex justify-center`, body height is natural. Cards use `bg-background border border-foreground/10` against the muted section bg, giving the soft contrast the BRIEF asked for.
- **whileInView trigger.** Bob flagged this as Open Question #3 (other 7 sections use `initial="hidden" animate="show"`). BRIEF lines 42 explicitly specifies `whileInView viewport={{ once: true, amount: 0.2 }}` for this section — locked decision. Bob's implementation (NumbersSection:39-40) matches verbatim. No issue.
- **Copy verbatim.** Headline "숫자도 같은 원리로", sub p, and final p (NumbersSection:46/53/85) all match BRIEF lines 43/44/49 character-for-character including the em-dash `—` and middle-dot separators.
- **Stagger / fadeUp.** `staggerChildren: 0.18` (line 19) matches BRIEF. Local fadeUp `opacity 0→1, y 24→0, 0.7s easeOut` (lines 7-14) matches BRIEF.
- **Card structure.** `flex flex-col items-center text-center gap-4 p-6 md:p-8 rounded-2xl bg-background border border-foreground/10` (lines 61, 71) matches BRIEF verbatim. NumberGlyph wrapper `w-full max-w-[240px]` + `text-yang`/`text-eum` (lines 62, 72) matches.
- **a11y.** `aria-hidden="true"` on `motion.svg` (NumberGlyph:103). `aria-label="양·음 한글숫자"` on section (NumbersSection:32). Adjacent text labels (`양수 1·2·3·4·5` / `음수 6·7·8·9·0`) carry the meaning for AT users. Contract honored.
- **page.tsx integration.** `NumbersSection` imported (line 8) and rendered after `<ConsonantTreeSection />` (line 20). 8-section flow complete.

## Open Questions response (Bob's items)
1. **Number label coordinates near W/M vertices.** Coordinates checked against viewBox 240×280 + segment paths: 1·2·3·4 labels at (28,240) (78,68) (120,224) (138,68) and 6·7·8·9 at (28,68) (78,240) (120,92) (138,240) all sit 12-20px off the nearest stroke. The y=68 and y=240 outer labels are 12px from the viewBox edge — within stroke linecap-round padding, no clipping risk. Visually plausible without browser. Not a blocker; if browser shows collision Bob can nudge in Should Fix territory next sprint.
2. **△ "5 (↑)" label at (165,50).** Inside viewBox 240px width, positioned right of △ apex (120) past the right vertex (140) — 25px gap. Reads cleanly. Same for "0 (완성)" at (165,254) right of ○ at cx=120 r=14 → 31px from circle edge. Both fit inside the 240px card width.
3. **whileInView vs initial/animate.** Resolved above — BRIEF-locked decision, no consistency override needed.

## Cleared
Reviewed `components/visuals/NumberGlyph.tsx`, `components/sections/NumbersSection.tsx`, and `app/page.tsx` against ARCHITECT-BRIEF Sprint 8. Coordinates, mapping (1-4 to W segments, 6-9 to M segments, △=5, ○=0), copy verbatim, auto-loop pattern, reduced-motion handling, accessibility, and bonus-tone styling all conform. Carryover `useReducedMotion() ?? false` fix on the four prior visuals is semantics-preserving and correctly chosen; `npm run build` exits 0. Sprint 8 passes.

---

# Review Feedback — Sprint 9 (FounderSection + FooterSection + Button polymorphic)
Date: 2026-05-14
Ready for Builder: YES

## Must Fix
(none)

## Should Fix
- `components/ui/Button.tsx:59` — Button branch destructure omits `as` from the rest. If a caller ever passes `as={undefined}` explicitly (or a future polymorphic helper does), `as` will be in `buttonRest` and forwarded onto the DOM `<button>`. React drops undefined-valued props at render so there is no actual warning today, but the destructure is asymmetric with the anchor branch (which does strip `as`). Recommendation: add `as: _as2,` to the button-branch destructure and `void _as2;` for parity. Two-line fix, defensible cleanliness. Not blocking — current call sites do not exercise the path.
- `components/sections/FooterSection.tsx:50-55` — Footer "문의" mailto uses bare `mailto:luxual8@gmail.com` (no subject/body). Founder primary CTA uses encoded subject/body. Either is acceptable, but if the Project Owner wants every inbound mail to land in the same labeled thread, factor `MAILTO_HREF` (or a no-subject variant) into `lib/constants.ts` and reuse. Optional — log to BUILD-LOG if not done inline.

## Escalate to Architect
(none — Sprint 2 button-in-anchor escalation is verifiably resolved at `HeroSection.tsx:67-75` via single `<Button as="a">`. Sprint 8 CombinationCard escalation Builder reports as resolved at `components/visuals/CombinationCard.tsx:51`; that is outside Sprint 9 scope but Arch should mark it closed.)

## Advisory (non-blocking, page-level tone)
- **Page ending sequence reads correctly.** Founder `min-h-screen` + centered layout gives the founder destination weight rather than sidebar weight; the second body paragraph ending "...짓누름이 아니라 발견이 되기를 바랍니다" lands as the page's last spoken sentiment before the quiet footer handoff. Emotional close works.
- **CTA order asymmetry between Hero and Founder.** Hero is `[primary active] [secondary disabled]`. Founder is `[secondary disabled] [primary active]`. Reversed pattern. Defensible: Founder's primary on the right anchors the "next step" at end-of-page where the eye lands last on LTR. But it is an inconsistency with Hero, and if Arch wants a uniform CTA grammar across the page, flip Founder to match Hero (primary first). Pure design call — not a code defect.
- **mailto URL encoding verified.** Subject decodes to "한글교수법 소식 신청", body decodes to "한글교수법 소식을 받아보고 싶습니다." Properly percent-encoded UTF-8, `%20` for spaces (correct in mailto query — `+` would be wrong here), `?` and `&` separators correct.
- **Polymorphic discriminated union is safe.** `as?: undefined` vs `as: "a"` discriminates cleanly. `Omit<..., "className">` on both branches resolves the only collision with `CommonProps`. forwardRef removal justified — grep across `components/` shows zero callers passing `ref` to Button; only two consumers (Hero, Founder), both Builder-controlled.
- **Footer semantics correct.** `<FooterSection>` is sibling of `<main>`, not child. The rendered `<footer>` therefore becomes the page-level contentinfo landmark. Nav inside footer carries `aria-label="푸터 메뉴"`. Disabled social/video placeholders use `<span role="img">` with `(준비 중)` labels and `cursor-not-allowed` — no broken link surface.

## Cleared
Reviewed `components/ui/Button.tsx` (full), `components/sections/HeroSection.tsx:67-75`, `components/sections/FounderSection.tsx` (full), `components/sections/FooterSection.tsx` (full), and `app/page.tsx` (full) against ARCHITECT-BRIEF Sprint 9. Polymorphic union safety, Sprint 2 button-in-anchor resolution, mailto encoding + a11y, footer/main semantic separation, and end-of-page tone all conform. Two Should Fix items are stylistic — neither blocks the step. Sprint 9 passes.
