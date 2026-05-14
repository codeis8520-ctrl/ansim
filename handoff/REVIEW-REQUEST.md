# Review Request — Sprint 9 (FounderSection + FooterSection + Button polymorphic)
Date: 2026-05-14
Ready for Review: YES

## Files Changed
- `components/ui/Button.tsx` (full rewrite) — Polymorphic union: `ButtonAsButton` (default → `<button>`) vs `ButtonAsAnchor` (`as="a"` → `<a>`). `as` is the discriminant. `Omit<...HTMLAttributes, "className">` on both branches so our top-level `className` from `CommonProps` is the single source. forwardRef removed (grep confirmed zero external ref users). At runtime: discriminate on `props.as === "a"`, strip our props (`variant`, `size`, `className`, `as`) before forwarding `...rest`. Button branch defaults `type ?? "button"`.
- `components/sections/HeroSection.tsx:67-74` — Replaced `<a><Button></Button></a>` button-in-anchor pattern with single `<Button as="a" href="#problem" aria-label="원리 보기, 다음 섹션으로 이동" variant="primary" size="lg">원리 보기 ↓</Button>`. Hero secondary disabled Button unchanged. ChevronDown affordance anchor unchanged.
- `components/sections/FounderSection.tsx` (new, full file) — `"use client"`. `<section id="founder" aria-label="창시자 소개">` with `min-h-screen pt-24 pb-20 flex flex-col justify-center bg-background`. parent motion.div `staggerChildren: 0.18`, `whileInView` once. Two-column grid `lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20`. Photo placeholder: `aspect-[4/5] max-w-[360px] rounded-2xl bg-gradient-to-br from-eum/15 to-yang/10`, "안심" + "金 潤奎" centered, `role="img" aria-label="김윤규 장로 사진 (준비 중)"`. Text column: Founder eyebrow (yang uppercase tracking-widest), "김윤규 (안심)" h2 (3xl/4xl bold), 약력, 두 단락 (BRIEF.md 180-182 verbatim, `mt-4` between), CTA row `mt-8 flex flex-col sm:flex-row gap-3`. CTAs: `<Button variant="secondary" disabled aria-disabled="true" title="준비 중">방법론 영상 보기</Button>` + `<Button as="a" href={MAILTO_HREF} variant="primary" aria-label="이메일로 소식 받기, 메일 클라이언트 열림">이메일로 소식 받기</Button>`. `MAILTO_HREF` is a module-scope const with URI-encoded Korean subject/body to `luxual8@gmail.com`.
- `components/sections/FooterSection.tsx` (new, full file) — server component (no `"use client"`, no motion). `<footer aria-label="사이트 푸터" className="bg-background-muted pt-12 md:pt-16 pb-10">`. Container > `grid grid-cols-1 md:grid-cols-3 gap-8 items-start`. Left: 연구소명 + 부설명. Center: `<nav aria-label="푸터 메뉴">` (with `md:flex md:justify-center` wrap so the centered ul sits in the middle of the cell) > `<ul className="flex flex-col gap-2 md:items-center md:text-center">` — "소개" `<a href="#big-idea">`, "영상" disabled `<span>`, "문의" `<a href="mailto:luxual8@gmail.com">`. Right: copyright + social row `flex gap-3 mt-3`. Two inline 24x24 SVGs (lucide style, currentColor stroke 2 linecap round) wrapped in disabled `<span role="img" aria-label="유튜브/인스타그램 (준비 중)" title="준비 중" className="text-foreground/30 cursor-not-allowed">`. YouTube: rect rx=3 + filled play path. Instagram: rect rx=5 + circle r=4 + filled dot r=0.8 at (17.5, 6.5).
- `app/page.tsx` — Added FounderSection + FooterSection imports. Wrapped 9 section components inside `<main>`, placed `<FooterSection />` as sibling outside `<main>` (HTML5 semantic). Top-level fragment.

## Open Questions
- Photo placeholder typography balance — chose "안심" (큰 한글) + "金 潤奎" (작은 한자) per brief §B's "큰 한글 '안심' + 작게 '金 潤奎' — 한자/이니셜 톤". Both at `text-foreground/40`. If the placeholder feels too subdued against the gradient, opacity can move to /50. Otherwise nothing to escalate.
- Footer center column alignment — added `md:flex md:justify-center` on the `<nav>` wrapper so the ul (which is column flex) is horizontally centered within its grid cell at md+. Without that wrapper, `md:items-center` only centers the `<li>`s relative to ul's natural width on the left. Confirming this matches the intended visual.
- Button polymorphic union — discriminant is `as` (literal `"a"` vs `undefined`). TS infers correctly for both call sites (Hero `as="a"`, Founder `as="a"` and bare `<Button>`). No use of generics. If a future caller passes `as="a"` *and* `type="submit"`, the union excludes `type` on the anchor branch — that's the desired behavior.

## Out of Scope (logged in BUILD-LOG)
- Real 김윤규 photo (placeholder card only)
- Real email subscription backend (mailto interim)
- Real video content (Hero secondary + Founder primary + Footer "영상" all disabled — three-point activation when video URL exists)
- Real social account URLs (YouTube/Instagram disabled spans)
- Footer menu expansion to 원리/자음/숫자 (minimal by brief §E)
- `metadataBase` production domain (Sprint 1 carryover)
- All Sprint 1~7 carryovers (unchanged)

## Verification
- `npm run lint` — 0 errors, 0 warnings.
- `npx tsc --noEmit` — 0 errors.
- `npm run build` — exit 0. Compiled 3.3s. TypeScript clean. 4/4 static pages. Route count unchanged.
- dev server (port 3000) — 200 OK after changes.
- Note: Sprint 8 CombinationCard TS regression (escalated to Arch) is **resolved** — `components/visuals/CombinationCard.tsx:51` now reads `const reduced = useReducedMotion() ?? false;`. Not touched in Sprint 9 (already fixed at sprint start). Escalation can be closed.
