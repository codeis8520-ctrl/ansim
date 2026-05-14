# Architect Brief — Sprint 10 (BRIEF 11+12): Polish + Ship

마지막 sprint. 컨텐츠는 끝났다. 폴리시 sprint — 반응형 + 접근성 + 메타데이터 점검, 빌드 검증, Lighthouse 측정, README 정식화, 잔여 cleanup.

스코프가 넓어 보이지만 대부분 **점검 + 작은 fix**다. 새 컴포넌트 0, 새 섹션 0, 새 시각 0.

## Goal

빌드 통과 + Lighthouse 90+ 검증 + 운영용 README + 잔여 cleanup. 이 sprint가 끝나면 production deploy 준비 완료.

## Build Order (우선순위 — 위에서 아래로)

### Step 1 — Cleanup (가장 안전, 먼저)

**A. 미사용 파일 삭제**

- components/visuals/FaceDiagram.tsx — 삭제. Sprint 2~9 BUILD-LOG 전반에서 Hero가 BodyDiagram으로 교체된 이후 한 번도 import되지 않음. grep으로 zero import 확인 후 삭제.
- components/visuals/BodyDiagram.tsx — grep 후 결정. Hero가 실제로 import하는지 확인. import 있으면 유지, 없으면 삭제. (Hero=BodyDiagram, BigIdea=AnnotatedBodyDiagram 둘 다 살아있을 가능성 높음.)

**B. Sprint 9 Should Fix 두 건**

- components/ui/Button.tsx:59 — button 분기 destructure에 `as` 누락. anchor 분기와 대칭되도록 `as: _as2,` 추가 + `void _as2;`. 2줄.
- Footer 문의 mailto 중복 해소. Founder는 MAILTO_HREF (subject/body 인코딩) 사용 중, Footer는 bare mailto. 정책: 둘 다 같은 thread에 떨어지도록 둘 다 subject/body 포함 사용. **lib/constants.ts 신규**, MAILTO_HREF export. FounderSection.tsx + FooterSection.tsx 둘 다 import. Hero 비활성 CTA는 건드리지 말 것.

### Step 2 — OG 이미지 처리 (Sprint 1 carryover 해소)

/og-image.png asset이 존재하지 않음. 운영 시점에 OpenGraph 카드가 깨진 placeholder를 보여주는 건 막아야 함.

**선택: Next.js dynamic OG route 사용.**

app/opengraph-image.tsx 신규 파일. ImageResponse로 1200x630 PNG 동적 생성:

- 배경 #FAF8F5 (background 토큰 hex)
- 상단 작게 "안심 양·음 한글교육" (foreground #1A1A1A)
- 중앙 크게 "사람의 몸이 곧 한글이다" (foreground, bold)
- 폰트: 시스템 sans-serif. Pretendard CDN fetch는 ImageResponse에서 복잡 — locked, 시도하지 말 것 (시각 결과 불만족 시 escalate).

그 다음 app/layout.tsx metadata.openGraph에서 images 배열의 "/og-image.png" 제거. Next.js가 opengraph-image.tsx 자동 인식해서 메타 태그 채움.

twitter.card는 summary_large_image 그대로. Twitter도 same OG image 재사용 (Next 자동).

검증: npm run build 후 /opengraph-image route 생성 확인.

### Step 3 — 반응형 점검 + fix

**점검 우선순위 (높은 위험 → 낮은 위험):**

1. **ConsonantTree (components/visuals/ConsonantTree.tsx)** — viewBox 800x1000. 현재 width=100% style maxWidth:800 height:auto + preserveAspectRatio xMidYMid meet. SVG는 비례 축소되어 모바일에서 가로 스크롤 없음. 부모 wrapper ConsonantTreeSection.tsx:99에 max-w-[800px] mx-auto. **확인만.**
   - 단, **텍스트 가독성** 체크 — 800px viewBox 안의 SVG text는 모바일(375px)에서 12px 미만으로 축소 가능. devtools 375px에서 가시 확인. 정보 전달 가능하면 그대로. 안 되면 SVG text font-size를 viewBox 비례로 키울 것.

2. **ThreeModes 3카드 (components/sections/ThreeModesSection.tsx)** — grid-cols-1 md:grid-cols-3. **확인만.**

3. **Vowels 표 (components/sections/VowelsSection.tsx)** — li 내부 flex flex-wrap gap-x-4 gap-y-3. PostureIcon들 자동 줄바꿈. **확인만.** 빽빽하면 gap-y-3 키울 것.

4. **Footer 3단 (components/sections/FooterSection.tsx)** — grid grid-cols-1 md:grid-cols-3. **확인만.**

5. **Hero (components/sections/HeroSection.tsx)** — Sprint 2 reviewer가 검증 완료. **스킵.**

**측정:** npm run dev → Chrome DevTools responsive 375/768/1280/1920 4 viewport에서 각 섹션 스크롤. 가로 스크롤 / 컨텐츠 잘림 / 글자 12px 미만 / 터치 타겟 24px 미만 — 이 4개만 잡으면 됨. 깨지는 컴포넌트만 fix.

**점검 결과 BUILD-LOG에 명시** — viewport × section × OK/NG matrix.

### Step 4 — 접근성 점검 + fix

1. **모든 SVG에 aria-label** — Sprint 2~9에서 부착 완료. grep aria-label components/visuals/*.tsx 로 모든 파일 매치 확인. 누락 시 추가.

2. **키보드 내비게이션 수동 테스트:**
   - Tab → Hero primary CTA "원리 보기" → Enter로 #problem 스크롤
   - Tab → Hero 보조 disabled CTA (focus 가능한지 / ring 보이는지)
   - Tab → ChevronDown anchor (focus ring)
   - Tab → Founder primary CTA (as=a Button) → Enter로 mailto 발화
   - Tab → Footer nav (소개, 문의) → Enter
   - **호버 기반 인터랙션 (Vowels, ConsonantTree, AnnotatedBodyDiagram)** — BRIEF가 명시적으로 데스크탑 호버 한정으로 lock. 키보드 등가물 추가 X. **점검만.**

3. **WCAG AA 색상 대비** — opacity 처리된 텍스트:
   - text-foreground/80 (#1A1A1A의 80% on #FAF8F5) → 합성 ~#494847 → 대비비 ~8.5:1 → AA 통과
   - text-foreground/70 → ~#5B5A59 → ~6.4:1 → AA 통과
   - text-foreground/55 → ~#80807E → ~4.0:1 → **AA borderline**. 본문 텍스트(24px 미만 regular)면 foreground/60으로 상향. 라벨/캡션이면 그대로.
   - text-foreground/50 → 본문에 쓰면 AA 미달. 사용처 점검: VowelsFaceDiagram 안경(장식적 SVG, aria 처리됨) → OK. 다른 본문 텍스트 있으면 fix.
   - text-foreground/40, /30, /20 → Footer "(준비 중)", FaceDiagram 안경, 14자 separator pipes 등 장식적/placeholder/disabled. 의미는 인접 aria-label/title 또는 본문 caption이 전달. **AA 적용 안 됨, fix 불필요.** 단, 본문 텍스트에 /30 쓰는 곳 없는지 1초씩 확인.

   **방식:** grep text-foreground/55 와 grep text-foreground/50 component 내 — 본문 vs 라벨 vs 장식 triage. AA 미달인 본문만 foreground/60으로 상향.

4. **prefers-reduced-motion 존중** — globals.css:29-38 전역 zero-out + 시각 컴포넌트 단 useReducedMotion() guard (?? false normalized 패턴 Sprint 7~8 통일). **점검만.** OS 단 reduce motion 활성화 → 페이지 로드 → 자동 루프(Numbers, ConsonantRoots, ThreeModes, ConsonantTree) 멈춤 + 정적 종료 자세 확인.

5. **의미론적 HTML** — main / section / nav / footer 구조 Sprint 9에서 확립. 점검 스킵.

### Step 5 — 빌드 검증 + Lighthouse

**A. npm run build → exit 0.** 빌드 출력 캡처 (compile 시간 / route 수 / First Load JS 사이즈). BUILD-LOG에 기록.

**B. Lighthouse 측정**

빌드 후 npm start → localhost:3000 → DevTools Lighthouse 탭 → Mobile + Desktop 각각 측정. 4 카테고리 점수 기록:

- Performance
- Accessibility
- Best Practices
- SEO

**기준: 모든 카테고리 90+ (BRIEF 요구).**

90 미만 처리 분기:

- **Accessibility 90 미만** — 거의 100% fixable. 구체 issue 식별 + 즉시 fix.
- **Performance 90 미만** — 원인이 framer-motion bundle, Pretendard CDN 등 구조적이면 README 향후 최적화 항목 + 측정값 기록. 손쉬운 fix(이미지 lazy, font-display 등)면 즉시 fix.
- **Best Practices / SEO 90 미만** — 거의 100% fixable. 즉시 fix.

90 미만이 구조적이고 sprint 범위 넘으면 Bob escalate, Arch가 split sprint 결정.

### Step 6 — README 정식화

README.md 현재는 Sprint 1에서 만든 12-phase progress checklist. **전체 교체.** 한국어. 다음 섹션:

- 제목 + 한 줄 설명: 사람의 몸이 곧 한글이다 — 김윤규 장로의 양·음 한글 교수법 랜딩 페이지
- 개요 (10개 섹션, SVG + Framer Motion 인터랙션, 5분 학습 경험)
- 기술 스택 (Next.js 16.2.6 App Router Turbopack, TypeScript strict, Tailwind CSS v4 @theme, Framer Motion, Pretendard CDN)
- 로컬 실행 (bash 코드 블록: npm install / dev / build / start / lint)
- 디플로이 가이드 (Vercel 추천 — GitHub push → Vercel 자동 감지 → NEXT_PUBLIC_SITE_URL 환경변수 설정 → Deploy. OG 이미지는 opengraph-image.tsx에서 자동 생성, asset 업로드 불필요.)
- 컴포넌트 구조 (코드 블록 트리 그림: app/ + components/ui + components/sections + components/visuals + lib/ + 각 폴더 1줄 설명)
- 디자인 시스템 (색상 토큰 globals.css @theme 정의 + lib/colors.ts와의 동기 의무 + 양/음 폴라리티 매핑)
- 향후 확장 (영상/사진/소셜 URL/이메일 백엔드 도착 시 단일 교체 지점 — Sprint 9 BUILD-LOG의 placeholder swap 지점 그대로 인용)
- Lighthouse 점수 (Mobile + Desktop, 4 카테고리)
- 라이선스 (TBD — Project Owner 결정)

Lighthouse 90 미만 항목 발생 시 향후 최적화 섹션 추가.

### Step 7 — 최종 정리

handoff/BUILD-LOG.md에 Sprint 10 entry 추가. Sprint 1~9의 모든 carryover Known Gap 중 이 sprint에서 해소된 것 명시 (FaceDiagram 삭제, og-image, mailto 중복, Button as destructure, README). 미해소된 것 (npm audit advisories, ASCII package.json name, 김윤규 사진/영상/소셜 URL placeholder, 모바일 탭 호버 등가물) 그대로 carryover.

## Out of Scope

- 새 섹션 / 새 시각 컴포넌트
- 영상 / 김윤규 사진 / 소셜 URL — 외부 asset 도착 시 작업
- 모바일 탭 트리거 호버 등가물 (Vowels 표, ConsonantTree 호버 path) — BRIEF가 명시적으로 deferred
- npm audit 2 moderate advisories — dependency hygiene pass로 별도
- shadcn/ui — locked deferral
- ㄱ-arm corner fan refactor (AnnotatedBodyDiagram polyline 통합) — 시각적으로 acceptable
- POSE 상수 hoist (PostureMorphGiyeok/Nieun) — 가독성 nit
- topLabel uppercase/tracking-wide (CombinationCard, Korean에서 uppercase no-op) — 시각적 문제 없음
- ㅇ 카드 cross-fade timing 미세조정 — 시각적으로 acceptable
- lib/colors.ts에 추가 색 — YANG/EUM/FOREGROUND 3개로 충분
- ConsonantTree root 호버 path — out of scope per Sprint 7

## Acceptance

- npm run lint exit 0
- npm run build exit 0 (TypeScript clean, opengraph-image route prerendered)
- Lighthouse mobile + desktop 4 카테고리 점수 BUILD-LOG + README 기록
- 4 viewport (375/768/1280/1920) 반응형 점검 결과 BUILD-LOG 기록
- FaceDiagram.tsx 삭제 (BodyDiagram.tsx 결정 grep 근거로 명시)
- lib/constants.ts 신규, MAILTO_HREF Founder + Footer 공유
- Button as destructure 대칭화
- app/opengraph-image.tsx 동작, 메타 태그 자동 채워짐
- README 전체 교체
- BUILD-LOG Sprint 10 entry + Known Gap carryover delta

## Bob 사전 플래그 요청

다음 항목 중 결정 필요한 게 있으면 REVIEW-REQUEST.md에 사전 플래그:

1. Lighthouse 90 미만 발생 시 — 카테고리/점수/원인/sprint-fixable 여부.
2. 반응형 점검 중 깨지는 섹션 — viewport/컴포넌트/현상.
3. text-foreground/55 또는 /50이 본문 텍스트에 쓰이는 곳 — 사용처 + 대비비 + 권장 fix.
4. BodyDiagram.tsx 삭제 결정 — grep import list 근거.
5. OG 이미지 시각 결과 — 시스템 sans로 부족하면 Pretendard fetch 시도 escalate.
