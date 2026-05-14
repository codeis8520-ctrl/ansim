# 안심 양·음 한글교육

**사람의 몸이 곧 한글이다** — 김윤규(안심) 장로의 양·음 한글교수법을 5분 만에 직관적으로 이해할 수 있는 단일 페이지 랜딩 사이트.

## 개요

10개 섹션의 세로 스크롤 내러티브:

1. **Hero** — 주장 도입 ("사람의 몸이 곧 한글이다")
2. **Problem** — 통념 해체 (외울 게 아니라 알아차려야 한다)
3. **BigIdea** — 7부위 매핑 도식 + 자동 투어 인터랙션
4. **Vowels** — 모음 10자 증명 (천지인 + 팔 자세)
5. **ConsonantRoots** — 자음의 두 뿌리 ㄱ·ㄴ 모핑
6. **ThreeModes** — ㄱ+ㄴ 결합 3가지 → ㅁ·ㅇ·ㅅ
7. **ConsonantTree** — 자음 14자 enumeration (canonical 매핑)
8. **Numbers** — 양·음 한글숫자 W·△·M·○ (보너스)
9. **Founder** — 창시자 소개 + 이메일 CTA
10. **Footer** — 미니멀 푸터

모든 시각 데모는 inline SVG + Framer Motion으로 자체 구현. 호버·자동 루프·prefers-reduced-motion 대응 포함.

## 기술 스택

- **Next.js 16.2.6** (App Router, Turbopack)
- **TypeScript** (strict)
- **Tailwind CSS v4** (`@theme` 토큰)
- **Framer Motion** (스크롤·호버·자동 루프 애니메이션)
- **Pretendard** (CDN dynamic-subset, 한국어 최적화)
- **lucide-react** (아이콘)

## 로컬 실행

```bash
npm install
npm run dev        # 개발 서버 http://localhost:3000
npm run build      # 프로덕션 빌드
npm start          # 프로덕션 서버
npm run lint       # ESLint
```

## 디플로이 (Vercel 추천)

1. GitHub repo로 push
2. [Vercel](https://vercel.com)에서 Import Project → Next.js 자동 감지
3. 환경변수 설정:
   - `NEXT_PUBLIC_SITE_URL` = 실제 배포 URL (예: `https://hangeul.example.com`) — OpenGraph 이미지 절대 URL 생성에 사용
4. Deploy

OG 이미지는 `app/opengraph-image.tsx`가 빌드 시점에 자동 생성합니다. 별도 이미지 파일 업로드 불필요.

## 컴포넌트 구조

```
app/
  layout.tsx              Pretendard CDN, 메타데이터, metadataBase
  page.tsx                10개 섹션 조립
  globals.css             Tailwind v4 @theme 토큰, 한글 줄바꿈 정책
  opengraph-image.tsx     동적 OG 이미지 (1200×630)

components/
  ui/
    Container.tsx         max-width wrapper
    Button.tsx            polymorphic (button | a) primary/secondary, default/lg
  sections/
    HeroSection.tsx
    ProblemSection.tsx
    BigIdeaSection.tsx
    VowelsSection.tsx
    ConsonantRootsSection.tsx
    ThreeModesSection.tsx
    ConsonantTreeSection.tsx
    NumbersSection.tsx
    FounderSection.tsx
    FooterSection.tsx
  visuals/
    BodyDiagram.tsx              Hero 전신 도식
    AnnotatedBodyDiagram.tsx     BigIdea 7부위 라벨 + 자동 투어
    VowelsFaceDiagram.tsx        Vowels 얼굴 도식
    PostureIcon.tsx              모음 변환 표용 10-variant 자세 아이콘
    PostureMorphGiyeok.tsx       차렷→경례 모핑 (자동 루프)
    PostureMorphNieun.tsx        누움→앉음 모핑 (자동 루프)
    CombinationCard.tsx          ㄱ+ㄴ → ㅁ/ㅇ/ㅅ 결합 카드 (자동 루프)
    ConsonantTree.tsx            14자 자음 트리 + 매트릭스 (5단계 cascade)
    NumberGlyph.tsx              W·△·M·○ 도식 (자동 루프)

lib/
  cn.ts                   className merger (clsx + twMerge)
  colors.ts               YANG/EUM/FOREGROUND hex export (SVG inline 색상)
  constants.ts            MAILTO_HREF (Founder + Footer 공유)
```

## 디자인 시스템

### 색상 토큰 (globals.css `@theme`)

| 토큰 | 값 | 용도 |
|---|---|---|
| `--color-background` | #FAF8F5 | 따뜻한 오프화이트 |
| `--color-background-muted` | #F2F0EC | 섹션 리듬 변화용 |
| `--color-foreground` | #1A1A1A | 본문 텍스트 |
| `--color-yang` | #E85D3C | 양(陽) 액센트 (붉은빛 오렌지) |
| `--color-eum` | #2C3E62 | 음(陰) 액센트 (다크 인디고) |
| `--color-muted` | #6B6B6B | 보조 회색 |
| `--color-accent` | #F4C95D | 강조 노란빛 |

`lib/colors.ts`의 YANG/EUM/FOREGROUND 상수는 SVG `stroke`/`fill` 인라인 색상용. globals.css 토큰과 동기 유지 의무.

### 양·음 폴라리티 매핑 (잠금)

- **양 (#E85D3C)**: ㅣ ㄱ ㅅ (서기/벌림 — 기립 계열)
- **음 (#2C3E62)**: ㅡ ㄴ ㅁ ㅇ (눕기/닫음 — 정적 계열)
- **중성**: • (천지인의 인)

자음 14자 canonical 매핑은 `handoff/CONSONANT-TREE-REFERENCE.md` (창시자 친필 기준).

### 타이포그래피

- Pretendard Variable (CDN dynamic-subset, 페이지 실사용 글리프만 서브셋)
- 한글 줄바꿈: `word-break: keep-all` (단어 중간 절단 방지) + `text-wrap: balance` (헤드라인) / `pretty` (본문)

### 애니메이션 정책

- 모든 시각 데모는 **타이머 기반 자동 루프** (스크롤 무관, 페이지 로드 후 자동 재생)
- 패턴: `cycleKey` state + `setInterval` + `key={cycleKey}`로 SVG remount → forward 애니메이션 깨끗 재생
- 호버 시 즉시 replay
- `prefers-reduced-motion` 사용자: 모든 루프 비활성화, 정적 종료 자세

## 향후 확장

외부 asset 도착 시 단일 교체 지점:

| Asset | 위치 |
|---|---|
| 김윤규 장로 사진 | `components/sections/FounderSection.tsx` (placeholder div 교체) |
| 방법론 영상 URL | Hero + Founder secondary CTA (`disabled` 제거 + href 추가) |
| 소셜 URL (유튜브/인스타) | `components/sections/FooterSection.tsx` (placeholder span → a) |
| 이메일 백엔드 (Mailchimp/Resend) | `lib/constants.ts` `MAILTO_HREF` 교체 → Founder + Footer 자동 업데이트 |
| OG 이미지 디자인 | `app/opengraph-image.tsx` JSX 수정 |

## Lighthouse

빌드 + `npm start` 후 Chrome DevTools Lighthouse 탭에서 측정. 4 카테고리 (Performance / Accessibility / Best Practices / SEO) 90+ 목표. 측정 결과는 배포 환경에 따라 다르므로 첫 배포 후 README에 점수 추가 권장.

## 라이선스

저작권 © 2026 안심 양·음 한글교육 연구소. 김윤규 장로의 양·음 한글교수법은 창시자 고유 자산.
